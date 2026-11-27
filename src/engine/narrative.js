import { compileCondition, buildContext } from './expr.js';
import { REALMS, realmLabel, LAW_BY_ID, LAW_STAGES } from '../data/realms.js';
import { ROOT_BY_ID } from '../data/roots.js';
import { SECT_BY_ID, SECT_RANKS } from '../data/sects.js';
import { ITEM_BY_ID } from '../data/items.js';
import { REGION_BY_ID } from '../data/regions.js';
import { GOLDEN_FINGER_BY_ID, PET_BY_ID } from '../data/golden_fingers.js';
import {
  START_AGE_MONTHS, canBreakthrough, needExp, bottleneckStatus, maxLawLevel, defaultLawFor,
  lifespanAlert, activeTechniques, maxTechSlots, techAlignmentConflict,
  currentWorldEra, activeDaoGoal,
} from './state.js';

export const EVENTS = [];
const SEEN_CHOICE_PREFIX = 'pick:';

export function registerEvents(list) {
  for (const ev of list) EVENTS.push(ev);
}

export function buildRegistry(extra = []) {
  const map = new Map();
  for (const ev of [...EVENTS, ...extra]) {
    if (map.has(ev.id)) throw new Error(`节点 id 重复: ${ev.id}`);
    map.set(ev.id, ev);
  }
  return map;
}

export function formatText(text, state) {
  if (!text) return '';
  if (typeof text === 'function') return text(state);
  const c = state.char;
  const root = ROOT_BY_ID[c.rootId];
  const sect = c.sectId ? SECT_BY_ID[c.sectId] : null;
  const sectDisplay = sect?.name || c.playerSectName || '散修';
  const rankName = sect
    ? (SECT_RANKS[c.sectRank || 0]?.name || '外门弟子')
    : (c.playerSectName ? '开山祖师' : '无门无派');
  const cultYear = Math.max(1, Math.floor((c.age - START_AGE_MONTHS) / 12) + 1);
  return String(text)
    .replaceAll('{name}', c.name)
    .replaceAll('{realm}', realmLabel(c))
    .replaceAll('{root}', root?.name || '凡体')
    .replaceAll('{sect}', sectDisplay)
    .replaceAll('{rank}', rankName)
    .replaceAll('{age}', String(Math.floor(c.age / 12)))
    .replaceAll('{year}', String(cultYear))
    .replaceAll('{stones}', String(c.stones))
    .replaceAll('{exp}', String(Math.floor(c.exp)))
    .replaceAll('{need}', String(Number.isFinite(needExp(c)) ? needExp(c) : '∞'))
    .replaceAll('{location}', c.location || '青牛山脉');
}

export function contextOf(state, game) {
  return buildContext(state, {
    hasAchievement: (id) => (game ? game.hasAchievement(id) : Boolean(state.meta.achievements?.[id])),
  });
}

export function choiceAvailable(state, node, choice, game) {
  const ctx = contextOf(state, game);
  if (choice.once) {
    const key = `${SEEN_CHOICE_PREFIX}${node.id}:${choice.id ?? choice.label}`;
    if (state.counters[key]) return { ok: false, reason: '已选过' };
  }
  if (choice.require) {
    let pass = false;
    try { pass = compileCondition(choice.require)(ctx); } catch (e) { console.warn('条件错误', node.id, choice.require, e.message); }
    if (!pass) return { ok: false, reason: choice.requireHint || '条件不足', locked: true };
  }
  if (choice.disabled) {
    return { ok: false, reason: choice.reason || '暂不可用', locked: true };
  }
  const cost = choice.cost || {};
  if (cost.stones && state.char.stones < cost.stones) return { ok: false, reason: `需 ${cost.stones} 灵石`, locked: true };
  if (cost.hp && state.char.hp <= cost.hp) return { ok: false, reason: '气血不足', locked: true };
  if (cost.mp && state.char.mp < cost.mp) return { ok: false, reason: '灵力不足', locked: true };
  if (cost.item && !state.char.inventory.some((i) => i.id === cost.item && i.qty > 0)) {
    return { ok: false, reason: `需 ${ITEM_BY_ID[cost.item]?.name || cost.item}`, locked: true };
  }
  return { ok: true };
}

export function markChoiceTaken(state, node, choice) {
  if (choice.once) {
    const key = `${SEEN_CHOICE_PREFIX}${node.id}:${choice.id ?? choice.label}`;
    state.counters[key] = (state.counters[key] || 0) + 1;
  }
}

/** 从事件池按条件、州域亲和度与权重抽取；regionId 优先当前州域专属奇遇。 */
export function pickEvent(state, rng, game, kind = 'wild', regionId = null) {
  const ctx = contextOf(state, game);
  const curRegion = regionId || state.char.regionId || 'qingniu';
  const pool = EVENTS.filter((ev) => {
    if (ev.pool && ev.pool !== kind) return false;
    if (ev.minRealm != null && state.char.realm < ev.minRealm) return false;
    if (ev.maxRealm != null && state.char.realm > ev.maxRealm) return false;
    if (ev.once && state.flags[`ev:${ev.id}`]) return false;
    if (ev.region && regionId && ev.region !== regionId) return false;
    if (ev.require) {
      try { if (!compileCondition(ev.require)(ctx)) return false; } catch { return false; }
    }
    return true;
  });
  if (!pool.length) return null;
  const recent = state.recent || [];
  let candidates = pool.filter((ev) => !recent.includes(ev.id));
  if (candidates.length < Math.min(6, pool.length)) candidates = pool;
  const luck = 1 + state.char.attrs.气运 * 0.02;
  const picked = rng.weighted(candidates, (ev) => {
    let w = (ev.weight || 1) * (ev.tier && ev.tier >= 4 ? luck : 1);
    if (ev.region && ev.region === curRegion) w *= 4.5;
    return w;
  });
  if (picked) {
    state.recent = [picked.id, ...recent.filter((id) => id !== picked.id)].slice(0, 14);
  }
  return picked;
}

/**
 * 零重叠主界面六大支柱（v4.0）：
 * [冲击境界(修为满时)] / [再临天门(渡劫)] / 洞府修行 / 九州历练 / 仙门大殿(或拜入仙门) / 仙城坊市 / 红尘道友 / 此生履历
 */
export function buildHub(game) {
  const { state } = game;
  const c = state.char;
  const sect = c.sectId ? SECT_BY_ID[c.sectId] : null;
  const rankName = sect ? (SECT_RANKS[c.sectRank || 0]?.name || '外门弟子') : '散修';
  const region = REGION_BY_ID[c.regionId] || REGION_BY_ID.qingniu;
  const progress = Math.min(100, Math.round(c.regionProgress?.[region.id] || 0));
  const bn = bottleneckStatus(state);
  const choices = [];

  if (canBreakthrough(c)) {
    choices.push({
      id: 'breakthrough',
      label: bn.ok ? '冲击境界' : '冲击境界（瓶颈未解）',
      hint: bn.ok ? '修为圆满，即刻叩关破境' : bn.missing[0] || '大境瓶颈未满',
      action: 'breakthrough',
      effect: 'primary',
    });
  }
  if (c.realm >= 8 && (state.counters.refuse_ascend || 0) >= 1) {
    choices.push({
      id: 'revisit_gate',
      label: '再临天门',
      hint: '九霄天门虚影重现，决定飞升或留世',
      action: 'revisitGate',
      effect: 'primary',
    });
  }

  choices.push(
    {
      id: 'open_cave',
      label: '洞府修行',
      hint: '闭关 · 法则 · 丹器',
      action: 'openCave',
      effect: 'quiet',
    },
    {
      id: 'open_region',
      label: '九州历练',
      hint: `${region.name} ${progress}% · 探险迁徙`,
      action: 'openRegion',
    },
  );

  if (sect) {
    choices.push({
      id: 'open_sect',
      label: '仙门大殿',
      hint: `${sect.name} · ${rankName}`,
      action: 'openSectHall',
    });
  } else if (c.playerSectName) {
    choices.push({
      id: 'open_sect',
      label: '仙门大殿',
      hint: `${c.playerSectName} · 祖师（${c.playerSectLevel || 1}品）`,
      action: 'openSectHall',
    });
  } else {
    choices.push({
      id: 'find_sect',
      label: '拜入仙门',
      hint: '叩问十三宗山门',
      action: 'sectRecruit',
    });
  }

  choices.push(
    {
      id: 'open_city',
      label: '仙城坊市',
      hint: '商行 · 秘阁 · 暗拍',
      action: 'openCity',
    },
    {
      id: 'open_npc',
      label: '红尘道友',
      hint: '十二名修 · 论道结缘',
      action: 'openNpcHub',
    },
    {
      id: 'fate',
      label: '此生履历',
      hint: '战力 · 法则 · 终章',
      action: 'fate',
    },
  );

  return {
    id: 'hub',
    title: `${region.name} · ${realmLabel(c)}`,
    text: () => {
      const hours = [
        '山风掠过洞府禁制，远处云海间偶见几道剑修遁光划破长空。',
        '灯下拭剑，丹田灵气随周天缓缓流转，四野清寂无尘。',
        '州域茶楼正议论秘境将启与潜龙榜更迭，天下英杰暗流涌动。',
        '暮云低垂，灵泉雾起，正是稳固道基、参悟大道或外出历练之时。',
        '你吐出一口浊气，双目澄明——仙路漫漫，根基厚一寸，劫难轻三分。',
      ];
      const idx = (state.turn + c.realm) % hours.length;
      const alert = lifespanAlert(c);
      const remain = alert.remainYears;
      const active = activeTechniques(c);
      const techCap = maxTechSlots(c.realm);
      const alignInfo = techAlignmentConflict(c);
      const notes = [];
      if (alert.level === 'critical') notes.push(`【大限危警】${alert.text}`);
      else if (alert.level === 'warn') notes.push(`【寿元警示】${alert.text}`);
      if (alignInfo.conflict) notes.push('【功法相冲】正邪功法同修，心魔暗滋且破境成算受损！');
      const gf = c.goldenFingerId ? GOLDEN_FINGER_BY_ID[c.goldenFingerId] : null;
      if (gf && state.turn % 3 === 0) notes.push(`【${gf.name}】隐隐共鸣。`);
      if (c.petId && PET_BY_ID[c.petId]) {
        const pLvl = c.petLevel || 1;
        notes.push(`伴生灵兽「${PET_BY_ID[c.petId].name}」（${pLvl}阶）伏于身侧吐纳。`);
      }
      if (c.playerSectName) {
        notes.push(`自创仙宗「${c.playerSectName}」（${c.playerSectLevel || 1}品 · 门徒 ${c.playerSectDisciples || 0} 人）香火绵延。`);
      }
      if (state.flags['宿敌林昊'] && !state.flags['败林昊']) notes.push('【三年之约】林昊之辱犹在眼前，入筑基后将迎问道台对决。');
      const mainLaw = LAW_BY_ID[defaultLawFor(c)];
      const lawStage = LAW_STAGES[maxLawLevel(c)] || '未入门';
      const lawLine = c.realm >= 2 || maxLawLevel(c) > 0 ? ` · 法则：${mainLaw?.name || '剑道'}（${lawStage}）` : '';
      const needText = Number.isFinite(needExp(c)) ? needExp(c).toLocaleString() : '∞';
      const era = currentWorldEra(state);
      const eraRemain = state.worldEra ? Math.max(1, Math.ceil((state.worldEra.until - c.age) / 12)) : 30;
      const goal = activeDaoGoal(state);
      return `${hours[idx]}${notes.length ? `\n${notes.join('\n')}` : ''}\n\n【天象·${era.name}】${era.tag}（余 ${eraRemain} 年） · 【道途指引】${goal.label}：${goal.detail}\n${Math.floor(c.age / 12)} 岁 · ${realmLabel(c)}（余寿 ${remain} 年）· 身处「${region.name}」${lawLine}\n修为 ${Math.floor(c.exp).toLocaleString()} / ${needText} · 运使功法 ${active.length}/${techCap} · 攻 ${game.playerAtk().toLocaleString()} / 防 ${game.playerDef().toLocaleString()}`;
    },
    choices,
    hub: true,
  };
}

export function poolForAction(action) {
  switch (action) {
    case 'explore': return { kind: 'wild', chance: 0.55 };
    case 'travel': return { kind: 'world', chance: 0.6 };
    case 'sectTask': return { kind: 'sect', chance: 0.35 };
    default: return { kind: 'inner', chance: 0.08 };
  }
}
