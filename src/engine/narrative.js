import { compileCondition, buildContext } from './expr.js';
import { REALMS, realmLabel } from '../data/realms.js';
import { ROOT_BY_ID } from '../data/roots.js';
import { SECT_BY_ID, sectRank } from '../data/sects.js';
import { ITEM_BY_ID } from '../data/items.js';
import { GOLDEN_FINGER_BY_ID, PET_BY_ID } from '../data/golden_fingers.js';
import { canBreakthrough, needExp } from './state.js';

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
  const rank = sectRank(c.contribution);
  return String(text)
    .replaceAll('{name}', c.name)
    .replaceAll('{realm}', realmLabel(c))
    .replaceAll('{root}', root?.name || '凡体')
    .replaceAll('{sect}', sect?.name || '散修')
    .replaceAll('{rank}', sect ? rank.name : '无门无派')
    .replaceAll('{age}', String(Math.floor(c.age / 12)))
    .replaceAll('{year}', String(1980 + Math.floor(c.age / 12)))
    .replaceAll('{stones}', String(c.stones))
    .replaceAll('{exp}', String(Math.floor(c.exp)))
    .replaceAll('{need}', String(Number.isFinite(needExp(c)) ? needExp(c) : '∞'))
    .replaceAll('{location}', c.location || '人间');
}

export function contextOf(state, game) {
  return buildContext(state, {
    hasAchievement: (id) => game ? game.hasAchievement(id) : Boolean(state.meta.achievements?.[id]),
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

/** 从事件池里按条件与权重抽一个；kind 为池标签。 */
export function pickEvent(state, rng, game, kind = 'wild') {
  const ctx = contextOf(state, game);
  const pool = EVENTS.filter((ev) => {
    if (ev.pool && ev.pool !== kind) return false;
    if (ev.minRealm != null && state.char.realm < ev.minRealm) return false;
    if (ev.maxRealm != null && state.char.realm > ev.maxRealm) return false;
    if (ev.once && state.flags[`ev:${ev.id}`]) return false;
    if (ev.require) {
      try { if (!compileCondition(ev.require)(ctx)) return false; } catch { return false; }
    }
    return true;
  });
  if (!pool.length) return null;
  // 近期去重：避免连着抽到同一个节点，池子够大时才生效
  const recent = state.recent || [];
  let candidates = pool.filter((ev) => !recent.includes(ev.id));
  if (candidates.length < Math.min(6, pool.length)) candidates = pool;
  // 气运影响稀有事件（tier 高）的权重
  const luck = 1 + state.char.attrs.气运 * 0.02;
  const picked = rng.weighted(candidates, (ev) => (ev.weight || 1) * (ev.tier && ev.tier >= 4 ? luck : 1));
  if (picked) {
    state.recent = [picked.id, ...recent.filter((id) => id !== picked.id)].slice(0, 12);
  }
  return picked;
}

export function buildHub(game) {
  const { state } = game;
  const c = state.char;
  const sect = c.sectId ? SECT_BY_ID[c.sectId] : null;
  const rank = sectRank(c.contribution);
  const realm = REALMS[c.realm];
  const monthCost = 1;
  const travelMonths = c.rootId === 'kongjian' ? 3 : c.rootId === 'feng' ? 5 : 6;
  const choices = [];

  if (canBreakthrough(c)) {
    choices.push({
      id: 'breakthrough', label: '冲击境界', hint: '修为圆满，即刻叩关破境！',
      action: 'breakthrough', effect: 'primary',
    });
  }
  if (c.realm >= 8 && (state.counters.refuse_ascend || 0) >= 1) {
    choices.push({
      id: 'revisit_gate', label: '再临天门', hint: '天门虚影再现，决定飞升或留世',
      action: 'revisitGate', effect: 'primary',
    });
  }

  choices.push(
    {
      id: 'cultivate', label: '吐纳打坐', hint: '半年 · 稳步炼气',
      action: 'cultivate', params: { months: 6 }, effect: 'quiet',
    },
    {
      id: 'deep', label: '闭关苦修', hint: '两年 · 进境极快，防心魔',
      action: 'cultivate', params: { months: 24, demonRisk: true },
    },
    {
      id: 'explore', label: '山野历练', hint: '三月 · 寻机缘，防杀劫',
      action: 'explore',
    },
    {
      id: 'travel', label: '游历四方', hint: `${travelMonths}月 · 换地界，长见识`,
      action: 'travel',
    },
  );

  if (c.rootId === 'xue') {
    choices.push({
      id: 'blood_cultivate', label: '燃血秘修', hint: '三月 · 焚血换取暴涨修为',
      action: 'bloodCultivate', require: 'char.hp > char.maxHp * 0.35', requireHint: '气血不足，强行燃血恐伤本源',
    });
  }

  if (c.goldenFingerId === 'gf_bottle') {
    choices.push({
      id: 'bottle_ripen', label: '绿瓶催灵', hint: '两月 · 催熟灵草凝丹',
      action: 'bottleRipen',
    });
  }

  if (c.realm >= 1 || c.stones >= 300) {
    choices.push({
      id: 'auction', label: '万宝拍卖', hint: '一月 · 竞拍稀世珍宝',
      action: 'auction',
    });
  }

  if (c.realm >= 1) {
    choices.push({
      id: 'secret_realm', label: '秘境探幽', hint: '半年 · 深入古境夺造化',
      action: 'secretRealm',
    });
  }

  if (c.inventory.some((i) => (i.id === 'xuantie' || i.id === 'leimu') && i.qty > 0) || c.stones >= 350) {
    choices.push({
      id: 'refine', label: `祭炼法宝`, hint: `三月 · 温养${c.artifactName || '本命青锋'}`,
      action: 'refine',
    });
  }

  if (sect) {
    choices.push({
      id: 'sect_task', label: `宗门差事`, hint: `三月 · ${rank.name}领俸挣贡献`,
      action: 'sectTask',
    });
  } else if (!state.flags.拜师季过) {
    choices.push({
      id: 'find_sect', label: '拜入仙门', hint: '一月 · 叩问诸宗山门',
      action: 'sectRecruit',
    });
  }

  if (c.sectId === 'danxia' || state.char.inventory.some((i) => i.id === 'lingcao' && i.qty > 0)) {
    choices.push({
      id: 'alchemy', label: '开炉炼丹', hint: '一月 · 炼制灵丹妙药',
      action: 'alchemy',
    });
  }

  choices.push(
    { id: 'market', label: '云桥坊市', hint: '一月 · 买卖丹药灵材', action: 'market' },
    { id: 'comprehend', label: '参悟大道', hint: '半年 · 增悟性，明道心', action: 'comprehend' },
  );
  if (c.demon > 0 || c.injuries > 0) {
    choices.push({
      id: 'settle', label: '静心涤魔', hint: '三月 · 镇压心魔，疗内伤',
      action: 'settle',
    });
  }
  if (c.realm >= 3 && !state.flags.开宗立派) {
    choices.push({ id: 'found_sect', label: '开宗立派', hint: '自立山门，广收门徒', action: 'foundSect', once: false });
  }
  choices.push({ id: 'fate', label: '此生履历', hint: '功业 · 因果 · 行止总览', action: 'fate' });

  return {
    id: 'hub',
    title: `${c.location} · ${realmLabel(c)}`,
    text: () => {
      const hours = [
        '山风掠过洞府禁制，远处天际偶尔划过两道剑修遁光。',
        '灯下擦拭法剑，灵气顺着经脉周天流转，丹田微微发烫。',
        '坊市茶楼里都在议论秘境将开的消息，散修们个个磨刀霍霍。',
        '暮云低垂，灵泉雾气缭绕，正是闭关苦修或外出碰机缘的好时辰。',
        '你睁开双目，吐出一口浊气——修仙路长，一步稳、步步稳。',
      ];
      const idx = (state.turn + state.char.realm) % hours.length;
      const remain = Math.max(0, Math.floor((c.lifespan - c.age) / 12));
      const notes = [];
      const gf = c.goldenFingerId ? GOLDEN_FINGER_BY_ID[c.goldenFingerId] : null;
      if (gf && state.turn % 3 === 0) notes.push(`【${gf.name}】隐隐共鸣。`);
      if (c.petId && PET_BY_ID[c.petId]) notes.push(`伴生灵兽「${PET_BY_ID[c.petId].name}」正乖巧伏在你身侧吐纳。`);
      if (state.flags['宿敌林昊'] && !state.flags['败林昊']) notes.push('【三年之约】林昊之辱犹在眼前，突破筑基后便将迎来问道台宿命对决！');
      const rankNum = Math.max(1, 108 - c.realm * 11 - Math.floor(c.reputation / 25) - state.stats.kills * 2);
      const rankLine = c.reputation >= 50 || c.realm >= 1 ? ` · 天机阁潜龙榜：第 ${rankNum} 位` : '';
      return `${hours[idx]}${notes.length ? `\n${notes.join('')}` : ''}\n\n你今年 ${Math.floor(c.age / 12)} 岁，${realmLabel(c)}（余寿 ${remain} 年）${rankLine}。\n当前修为 ${Math.floor(c.exp)} / ${Number.isFinite(needExp(c)) ? needExp(c) : '∞'}。`;
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
