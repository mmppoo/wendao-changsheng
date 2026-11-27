import { compileCondition, buildContext } from './expr.js';
import { LEGACY_EVENT_IDS } from '../data/events/index.js';
import { REALMS, realmLabel, LAW_BY_ID, LAW_STAGES } from '../data/realms.js';
import { ROOT_BY_ID } from '../data/roots.js';
import { SECT_BY_ID, SECT_RANKS, sectRankName } from '../data/sects.js';
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
    ? (sectRankName(c.sectId, c.sectRank || 0))
    : (c.playerSectName ? '开山祖师' : '无门无派');
  const cultYear = Math.max(1, Math.floor((c.age - START_AGE_MONTHS) / 12) + 1);
  return String(text)
    .replaceAll('{name}', c.name)
    .replaceAll('{rival}', state.flags?.['宿敌名'] || '那人')
    .replaceAll('{realm}', realmLabel(c))
    .replaceAll('{root}', root?.name || '凡体')
    .replaceAll('{sect}', sectDisplay)
    .replaceAll('{rank}', rankName)
    .replaceAll('{age}', String(Math.floor(c.age / 12)))
    .replaceAll('{year}', String(cultYear))
    .replaceAll('{stones}', String(c.stones))
    .replaceAll('{exp}', String(Math.floor(c.exp)))
    .replaceAll('{need}', String(Number.isFinite(needExp(c)) ? needExp(c) : '∞'))
    .replaceAll('{location}', c.location || '青石镇');
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
    if (LEGACY_EVENT_IDS.has(ev.id)) return false;
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
 * [冲击境界(修为满时)] / [再临天门(渡劫)] / 洞府修行 / 五域行走 / 仙门大殿(或拜入仙门) / 市集坊间 / 红尘道友 / 此生履历
 */
export function buildHub(game) {
  const { state } = game;
  const c = state.char;
  const sect = c.sectId ? SECT_BY_ID[c.sectId] : null;
  const rankName = sect ? (sectRankName(c.sectId, c.sectRank || 0)) : '散修';
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

  // v8：结丹以上，跨越岁月的主入口——闭关到下一件身边大事（遇大事、新篇章、修为圆满、寿元告急即出关）
  if (c.realm >= 1 && !(canBreakthrough(c) && bottleneckStatus(state).ok)) {
    choices.push({
      id: 'long_seclusion',
      label: '闭关至下一件大事',
      hint: '至多百年 · 遇身边大事、修为圆满或寿元告急即出关',
      action: 'longSeclusion',
      effect: 'primary',
    });
  }
  // 最常用的两件事放在主界直接点，不用先进子菜单
  choices.push(
    {
      id: 'quick_cultivate',
      label: '修炼半年',
      hint: '吐纳炼气，攒修为',
      action: 'cultivate',
      params: { months: 6 },
      effect: 'quick',
    },
    {
      id: 'quick_explore',
      label: `在${region.name}走走`,
      hint: '三个月 · 会遇上人和事',
      action: 'regionExplore',
      params: { returnTo: 'hub' },
      effect: 'quick',
    },
  );
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
      label: '五域行走',
      hint: `${region.name} ${progress}% · 探险迁徙`,
      action: 'openRegion',
    },
  );

  if (sect) {
    choices.push({
      id: 'open_sect',
      label: '门户',
      hint: `${sect.name} · ${rankName}`,
      action: 'openSectHall',
    });
  } else if (c.playerSectName) {
    choices.push({
      id: 'open_sect',
      label: '门户',
      hint: `${c.playerSectName} · 祖师（${c.playerSectLevel || 1}品）`,
      action: 'openSectHall',
    });
  } else {
    choices.push({
      id: 'find_sect',
      label: '投身门户',
      hint: '玄衡、青崖、边军、商会……',
      action: 'sectRecruit',
    });
  }

  choices.push(
    {
      id: 'open_city',
      label: '市集坊间',
      hint: '商行 · 秘阁 · 暗拍',
      action: 'openCity',
    },
    {
      id: 'open_npc',
      label: '故人',
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
      // 主界只写一两句眼前的景，加一条「眼下该做什么」；数值都在顶栏，不重复
      const SCENES = {
        qingniu: ['河湾渡口的船又摆了一趟，市集上有人在吆喝新米。', '东田里的稻子抽了穗，祠庙的钟敲过三下。', '老窑那边冒着烟，赵守又在祠庙门口贴告示。'],
        luoxia: ['临河粮码头上，扛包的人从早排到晚。', '河堤上风大，芦洲那头隐约有船影。', '城里茶馆在议论粮价，一天一个说法。'],
        yaosen: ['青崖谷的药田起了雾，七十二涧水声不断。', '铜谷的炉坊彻夜不熄，铁锤声隔着山都听得见。'],
        guixu: ['玄衡群峰云气缠绕，护山大阵的符光一明一灭。', '山门前的石阶上，外门弟子扫了一早上的落叶。'],
        beihuang: ['雁门关上烽燧无烟，关外草滩一片枯黄。', '朔川的风刮了一夜，边军在修补外堡的土墙。'],
        zhongzhou: ['宁京街上车马不断，宫墙里的事没人说得清。', '河洛的庄园连着庄园，佃户们低头赶路。'],
        kunlun: ['玉门关外黄沙漫天，商队在井边歇脚。', '沙州绿洲的井水又浅了一指，守井的人在吵架。'],
        jiuxiao: ['白驼废墟里只有风声，流沙底下压着旧府的屋脊。'],
      };
      const lines = SCENES[c.regionId] || SCENES.qingniu;
      const sceneLine = lines[(state.turn + c.realm) % lines.length];
      const alert = lifespanAlert(c);
      const alignInfo = techAlignmentConflict(c);
      const notes = [];
      if (alert.level === 'critical') notes.push(`【大限将至】${alert.text}`);
      else if (alert.level === 'warn') notes.push(`【寿元不多】${alert.text}`);
      if (alignInfo.conflict) notes.push('【功法相冲】正邪功法同修，心魔滋长、突破变难。');
      if (c.playerSectName) notes.push(`你的门户「${c.playerSectName}」门下 ${c.playerSectDisciples || 0} 人。`);
      const goal = activeDaoGoal(state);
      // 近来：最近听到的三条消息（世事在走，主界就该看得见）
      const recent = (state.rumors || []).slice(1, 4).map((r) => `· ${r}`);
      return `${sceneLine}${notes.length ? `\n\n${notes.join('\n')}` : ''}${recent.length ? `\n\n近来\n${recent.join('\n')}` : ''}\n\n眼下 · ${goal.label}：${goal.detail}`;
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
