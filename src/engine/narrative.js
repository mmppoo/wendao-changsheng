import { compileCondition, buildContext } from './expr.js';
import { REALMS, realmLabel } from '../data/realms.js';
import { ROOT_BY_ID } from '../data/roots.js';
import { SECT_BY_ID, sectRank } from '../data/sects.js';
import { ITEM_BY_ID } from '../data/items.js';
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
  const choices = [
    {
      id: 'cultivate', label: '打坐修炼', hint: '半年 · 稳步积累修为',
      action: 'cultivate', params: { months: 6 }, effect: 'quiet',
    },
    {
      id: 'deep', label: '闭关苦修', hint: '两年 · 修为大涨，但心魔易生',
      action: 'cultivate', params: { months: 24, demonRisk: true },
    },
    {
      id: 'explore', label: '外出历练', hint: '三月 · 奇遇与凶险并存',
      action: 'explore',
    },
    {
      id: 'travel', label: '云游四方', hint: '三月 · 换一处山水，长几分见识',
      action: 'travel',
    },
  ];

  if (sect) {
    choices.push({
      id: 'sect_task', label: `宗门事务·${rank.name}`, hint: '三月 · 赚取贡献与灵石',
      action: 'sectTask',
    });
  } else if (!state.flags.拜师季过) {
    choices.push({
      id: 'find_sect', label: '寻访仙门', hint: '一月 · 看看哪座山门愿意为你开',
      action: 'sectRecruit',
    });
  }

  choices.push(
    { id: 'market', label: '坊市走走', hint: '一月 · 买卖丹药法器', action: 'market' },
    { id: 'comprehend', label: '参悟所学', hint: '半年 · 悟性见长，心境澄明', action: 'comprehend' },
    {
      id: 'settle', label: '沉淀心境', hint: '三月 · 压下心魔，抚平伤势',
      action: 'settle', require: 'demon > 0 || char.injuries > 0', requireHint: '心境无碍',
    },
  );
  if (canBreakthrough(c)) {
    choices.push({
      id: 'breakthrough', label: '冲击境界', hint: '修为已满，可叩关一试',
      action: 'breakthrough', effect: 'highlight',
    });
  }
  if (c.realm >= 3 && !state.flags.开宗立派) {
    choices.push({ id: 'found_sect', label: '开宗立派', hint: '自立山门，收徒讲道', action: 'foundSect', once: false });
  }
  choices.push({ id: 'fate', label: '查看命途', hint: '成就 · 结局 · 此生行止', action: 'fate' });

  return {
    id: 'hub',
    title: `${c.location} · ${realmLabel(c)}`,
    text: () => {
      const hours = [
        '风从山门吹进来，带着松针和旧香灰的味道。',
        '夜雨敲窗，你听见自己的心跳比雨点慢。',
        '远处有人在打铁，一锤一锤，像在敲你的骨头。',
        '云压得很低，山下的灯火一盏一盏亮起来。',
        '你睁开眼，丹田里的灵气像一尾鱼，转了一圈又沉下去。',
      ];
      const idx = (state.turn + state.char.realm) % hours.length;
      const remain = Math.max(0, Math.floor((c.lifespan - c.age) / 12));
      return `${hours[idx]}\n\n你今年${Math.floor(c.age / 12)}岁，${realmLabel(c)}。寿元还剩${remain}年。\n修为${Math.floor(c.exp)} / ${Number.isFinite(needExp(c)) ? needExp(c) : '∞'}。`;
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
