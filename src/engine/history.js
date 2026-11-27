/**
 * 大历史引擎（v8）：让世界按剧本的年份走。
 *
 * 历史事件 = 普通事件节点 + history 字段：
 *   history: {
 *     key: 'y001.nanze_requisition_ferry',  // 稳定编号，前世手札按它记
 *     domain: 'nanze',                       // 五域：zhongzhou / beijing / dongling / xichui / nanze；null 为天下大事
 *     regions: ['qingniu', 'luoxia'],        // 主角身在这些地区时亲历；为空则同域即可亲历
 *     window: [1, 3],                        // 发生年份（第一纪元第几年，含首尾）
 *     baseline: '若无人干预时的走向（一两句）', // 不在场时以风闻传来，也写进手札
 *     major: true,                           // 大事：亲历时强制插入；非大事只在当地探索时遇到
 *     minRealm: 0,                           // 可选：境界门槛（凡人碰不到的山上之事）
 *   }
 *
 * 选项可用的效果：world（改世界指标）、worldFlag（世界印记）、rewrite: '一句话'（标记本世已改写此事）。
 * 条件里可用：year()、known("key")（前世手札有记）、happened("key")、outcome("key")、world("字段")。
 */
import { START_AGE_MONTHS } from './state.js';

export const DOMAIN_NAMES = { zhongzhou: '中州', beijing: '北境', dongling: '东岭', xichui: '西陲', nanze: '南泽' };
export const REGION_DOMAIN = {
  qingniu: 'nanze', luoxia: 'nanze', yaosen: 'dongling', guixu: 'dongling',
  beihuang: 'beijing', zhongzhou: 'zhongzhou', kunlun: 'xichui', jiuxiao: 'xichui',
};

export function worldYear(state) {
  return Math.max(1, Math.floor(((state.char?.age ?? START_AGE_MONTHS) - START_AGE_MONTHS) / 12) + 1);
}

export function playerDomain(state) {
  return REGION_DOMAIN[state.char?.regionId || 'qingniu'] || 'nanze';
}

let HISTORY_INDEX = null;

/** 从事件注册表里挑出带 history 字段的事件，按开始年份排好。 */
export function historyIndex(registry) {
  if (HISTORY_INDEX && HISTORY_INDEX.registry === registry) return HISTORY_INDEX.list;
  const list = [];
  for (const ev of registry.values()) if (ev.history?.key) list.push(ev);
  list.sort((a, b) => a.history.window[0] - b.history.window[0]);
  HISTORY_INDEX = { registry, list };
  return list;
}

function presentAt(state, ev) {
  const h = ev.history;
  if ((state.char.realm || 0) < (h.minRealm || 0)) return false;
  const region = state.char.regionId || 'qingniu';
  if (h.regions?.length) return h.regions.includes(region);
  if (!h.domain) return true;
  return REGION_DOMAIN[region] === h.domain;
}

function remember(state, ev, source) {
  const meta = state.meta;
  meta.handbook = meta.handbook || {};
  const h = ev.history;
  const prev = meta.handbook[h.key];
  meta.handbook[h.key] = {
    key: h.key,
    title: ev.title,
    domain: h.domain || null,
    window: h.window,
    baseline: h.baseline || '',
    source: prev?.source === '亲历' ? '亲历' : source,
    lives: Array.from(new Set([...(prev?.lives || []), meta.cycle || 1])),
    lastOutcome: state.history?.[h.key]?.outcome || prev?.lastOutcome || 'baseline',
    rewrites: prev?.rewrites || 0,
  };
  return Boolean(prev);
}

/**
 * 每次行动之后调用。返回 { open: 事件 | null, notes: 风闻文字[] }。
 * - 已过窗口而未亲历的大事：按基准走向结算，化为风闻，写入手札。
 * - 正在窗口内、主角在场的事：返回第一件，交给引擎插入剧情。
 */
export function tickHistory(state, registry) {
  state.history = state.history || {};
  const year = worldYear(state);
  const notes = [];
  let open = null;
  for (const ev of historyIndex(registry)) {
    const h = ev.history;
    if (state.history[h.key]) continue;
    if (year < h.window[0]) break;
    if (year > h.window[1]) {
      state.history[h.key] = { outcome: 'baseline', year: h.window[1], source: '风闻' };
      const sameDomain = !h.domain || h.domain === playerDomain(state);
      if (h.major || sameDomain) {
        const prefix = h.domain ? `【${DOMAIN_NAMES[h.domain]}风闻 · 第${h.window[1]}年】` : `【天下大事 · 第${h.window[1]}年】`;
        notes.push(`${prefix}${ev.title}：${h.baseline}`);
        remember(state, ev, '风闻');
      }
      continue;
    }
    if (!open && presentAt(state, ev) && (h.major || state.scene?.id === 'regionHub')) open = ev;
  }
  return { open, notes };
}

/** 打开历史事件时调用：记为亲历，返回开场提示（前世应验）。 */
export function beginHistoryEvent(state, ev) {
  state.history = state.history || {};
  state.history[ev.history.key] = { outcome: 'witnessed', year: worldYear(state), source: '亲历' };
  state.currentHistoryKey = ev.history.key;
  const knewBefore = remember(state, ev, '亲历');
  if (knewBefore) state.counters.foretold = (state.counters.foretold || 0) + 1;
  return knewBefore ? `【前世所记，今日应验】第${ev.history.window[0]}年，${ev.title}。` : null;
}

/** 选项带 rewrite 效果时调用：本世改写了这件事。 */
export function markRewrite(state, text) {
  const key = state.currentHistoryKey;
  if (!key) return null;
  state.history = state.history || {};
  state.history[key] = { ...(state.history[key] || {}), outcome: 'changed', note: text };
  state.counters.history_rewrites = (state.counters.history_rewrites || 0) + 1;
  const entry = state.meta.handbook?.[key];
  if (entry) {
    entry.lastOutcome = 'changed';
    entry.rewrites = (entry.rewrites || 0) + 1;
    entry.rewriteNote = text;
  }
  state.rewrites = [...(state.rewrites || []), { key, year: worldYear(state), text }];
  return `【历史已改写】${text}`;
}

/** 手札条目，按年份排序（给界面用）。 */
export function handbookEntries(meta) {
  return Object.values(meta?.handbook || {}).sort((a, b) => (a.window?.[0] || 0) - (b.window?.[0] || 0));
}
