/**
 * 轮回长线（v8）：多世成长的总账。
 *
 * 1. 天赋分阶：每个轮回天赋可点到五重，价格逐重递增，是长期的轮回点去处。
 * 2. 劫数：首次飞升后开启。每提一重劫数，世间更凶险，轮回点与收获更丰厚；最高十二重。
 * 3. 出身与机缘解锁：初入轮回只有少数出身与机缘可选，其余靠历世成就逐一解锁。
 * 4. 前世遗泽：一世终了，可择一至三样东西带入来世（功法、宝物、灵石、道韵）。
 * 5. 结局收录：一世终了时，优先落入「尚未收录」的结局，并按结局品阶给首见奖励。
 */
import { TALENTS, TALENT_BY_ID } from '../data/talents.js';
import { ORIGINS } from '../data/origins.js';
import { GOLDEN_FINGERS } from '../data/golden_fingers.js';
import { ENDINGS, ENDING_BY_ID } from '../data/endings.js';
import { ITEM_BY_ID } from '../data/items.js';

export const TALENT_MAX_LEVEL = 5;
export const JIESHU_MAX = 12;
export const META_VERSION = 8;

/* ------------------------------ 天赋分阶 ------------------------------ */

export function talentLevel(meta, id) {
  const lv = meta?.talentLevels?.[id];
  if (lv != null) return lv;
  return (meta?.talents || []).includes(id) ? 1 : 0;
}

/** 点亮第 next 重所需轮回点：基础价 × 重数。 */
export function talentCost(t, next) {
  return t.cost * next;
}

export function buyTalentLevel(meta, id) {
  const t = TALENT_BY_ID[id];
  if (!t) return { ok: false, reason: '无此天赋' };
  const cur = talentLevel(meta, id);
  if (cur >= TALENT_MAX_LEVEL) return { ok: false, reason: '已臻五重' };
  const cost = talentCost(t, cur + 1);
  if ((meta.karmaPoints || 0) < cost) return { ok: false, reason: `需 ${cost} 轮回点` };
  meta.karmaPoints -= cost;
  meta.talentLevels = { ...(meta.talentLevels || {}), [id]: cur + 1 };
  if (!(meta.talents || []).includes(id)) meta.talents = [...(meta.talents || []), id];
  return { ok: true, level: cur + 1, cost };
}

/** 天赋效果随重数放大：一重 ×1，五重 ×3。功法、物品、印记只在一重给一次。 */
export function talentScale(level) {
  return level <= 0 ? 0 : 1 + (level - 1) * 0.5;
}

/** 轮回点全部花完所需总数（给界面显示「天赋总进度」）。 */
export function talentTotalCost() {
  return TALENTS.reduce((acc, t) => {
    let sum = 0;
    for (let l = 1; l <= TALENT_MAX_LEVEL; l++) sum += talentCost(t, l);
    return acc + sum;
  }, 0);
}

/* ------------------------------ 劫数 ------------------------------ */

export const JIESHU_DESC = [
  '常世：天道平和，按本来面目修行。',
  '一重劫：妖邪渐起。敌手气血与攻伐 +18%。',
  '二重劫：灵机稀薄。另加修炼速度 -4%。',
  '三重劫：天妒英才。另加破境成功率 -3%。',
  '四重劫：寿数减薄。另加寿元 -6%。前世遗泽 +1 件。',
  '五重劫：群魔乱舞。敌手更凶。',
  '六重劫：天威更重。破境、寿元再降。',
  '七重劫：万劫不磨。',
  '八重劫：仙路断绝之兆。前世遗泽 +1 件。',
  '九重劫：九死一生。',
  '十重劫：天道亲临。',
  '十一重劫：末法将至。',
  '十二重劫：逆天而行。此重之下活过千年，方称逆天改命。',
];

/** 劫数对一世的全部影响，引擎各处统一读这里。 */
export function jieshuMods(j = 0) {
  const n = Math.max(0, Math.min(JIESHU_MAX, j | 0));
  return {
    level: n,
    enemyMult: 1 + 0.18 * n,
    speedMult: n >= 2 ? 1 - 0.04 * (n - 1) * 0.5 : 1,
    breakPenalty: n >= 3 ? 3 + (n - 3) * 1.2 : 0,
    lifespanMult: n >= 4 ? 1 - 0.06 - (n - 4) * 0.02 : 1,
    karmaMult: 1 + 0.25 * n,
    lootMult: 1 + 0.1 * n,
    legacySlots: 1 + (n >= 4 ? 1 : 0) + (n >= 8 ? 1 : 0),
  };
}

/* ------------------------------ 出身与机缘解锁 ------------------------------ */

/** 此世无飞升。「过关」口径改为：某一世活过第一个千年（第 1000 年，五域会盟之世）。 */
const CLEAR_YEAR = 1000;

function endingCount(meta) { return (meta?.unlockedEndings || []).length; }
function cleared(meta) { return (meta?.maxYear || 0) >= CLEAR_YEAR; }

/** 解锁条件：{ test(meta) → bool, hint 文案 }。未列出的默认开放。 */
export const ORIGIN_UNLOCKS = {
  fallen_clan: { hint: '任意一世修至筑基', test: (m) => (m.maxRealm || 0) >= 1 },
  wanderer: { hint: '走完两世', test: (m) => (m.runs || 0) >= 2 },
  merchant: { hint: '任意一世修至结丹', test: (m) => (m.maxRealm || 0) >= 2 },
  royal: { hint: '收录 5 个结局', test: (m) => endingCount(m) >= 5 },
  demon_child: { hint: '历世累计斩敌 300', test: (m) => (m.totalKills || 0) >= 300 },
  artifact_spirit: { hint: '任意一世修至元婴', test: (m) => (m.maxRealm || 0) >= 3 },
  outsider: { hint: '任意一世活过第一千年', test: (m) => cleared(m) },
};

export const GF_UNLOCKS = {
  gf_karma_mirror: { hint: '收录 3 个结局', test: (m) => endingCount(m) >= 3 },
  gf_stealth: { hint: '任意一世活过三百岁', test: (m) => (m.maxAge || 0) >= 300 },
  gf_signin: { hint: '任意一世踏足五州', test: (m) => (m.maxRegions || 0) >= 5 },
};

/** 旧存档（v8 之前）已经玩过的人，全部开放，不收回已有内容。 */
function legacyOpen(meta) {
  return !meta?.metaVersion && (meta?.runs || 0) >= 1;
}

export function originUnlocked(meta, id) {
  const rule = ORIGIN_UNLOCKS[id];
  if (!rule || legacyOpen(meta)) return true;
  return (meta?.unlockedOrigins || []).includes(id) || rule.test(meta || {});
}

export function goldenFingerUnlocked(meta, id) {
  const rule = GF_UNLOCKS[id];
  if (!rule || legacyOpen(meta)) return true;
  return (meta?.unlockedGF || []).includes(id) || rule.test(meta || {});
}

export function availableOrigins(meta) { return ORIGINS.filter((o) => originUnlocked(meta, o.id)); }
export function availableGoldenFingers(meta) { return GOLDEN_FINGERS.filter((g) => goldenFingerUnlocked(meta, g.id)); }

/** 结算一世后调用：把新满足的解锁写进 meta，返回新解锁的名字列表（给结局页播报）。 */
export function refreshUnlocks(meta) {
  const fresh = [];
  meta.unlockedOrigins = meta.unlockedOrigins || [];
  meta.unlockedGF = meta.unlockedGF || [];
  for (const o of ORIGINS) {
    const rule = ORIGIN_UNLOCKS[o.id];
    if (!rule || meta.unlockedOrigins.includes(o.id)) continue;
    if (rule.test(meta)) { meta.unlockedOrigins.push(o.id); fresh.push(`出身「${o.name}」`); }
  }
  for (const g of GOLDEN_FINGERS) {
    const rule = GF_UNLOCKS[g.id];
    if (!rule || meta.unlockedGF.includes(g.id)) continue;
    if (rule.test(meta)) { meta.unlockedGF.push(g.id); fresh.push(`机缘「${g.name}」`); }
  }
  return fresh;
}

/* ------------------------------ 结局收录与轮回点 ------------------------------ */

export const ENDING_TIER_KARMA = { 凡: 1, 黄: 2, 玄: 3, 地: 4, 天: 6, 仙: 8 };

/**
 * 在所有满足条件的结局中挑一个：优先尚未收录的（其中按 priority 最高），
 * 全都收录过才落回 priority 最高的那一个。返回 { ending, candidates }。
 */
export function chooseEnding(meta, matches) {
  const sorted = [...matches].sort((a, b) => b.priority - a.priority);
  const seen = new Set(meta?.unlockedEndings || []);
  const fresh = sorted.find((e) => !seen.has(e.id));
  return { ending: fresh || sorted[0] || null, candidates: sorted };
}

/** 一世结算的轮回点：保底 + 境界 + 首见结局奖励，再乘劫数倍率。 */
export function endingKarma({ ending, firstTime, realm, jieshu, pureMortal }) {
  const base = 1 + Math.floor((realm || 0) / 2) + (pureMortal ? 2 : 0);
  const first = firstTime ? (ENDING_TIER_KARMA[ending?.tier] || 2) : 0;
  const mult = jieshuMods(jieshu).karmaMult;
  return { base, first, mult, total: Math.round((base + first) * mult) };
}

/** 一世终了时更新跨世统计（解锁条件读这些）。 */
export function recordLifeStats(meta, state) {
  const c = state.char;
  meta.maxRealm = Math.max(meta.maxRealm || 0, c.realm || 0);
  meta.maxAge = Math.max(meta.maxAge || 0, Math.floor((c.age || 0) / 12));
  meta.totalKills = (meta.totalKills || 0) + (state.stats?.kills || 0);
  const regions = Object.keys(c.regionProgress || {}).length;
  meta.maxRegions = Math.max(meta.maxRegions || 0, regions);
  const year = Math.max(1, Math.floor(((c.age || 192) - 192) / 12) + 1);
  meta.maxYear = Math.max(meta.maxYear || 0, year);
  const j = c.jieshu || 0;
  if (year >= CLEAR_YEAR) meta.jieshuCleared = Math.max(meta.jieshuCleared ?? -1, j);
  meta.metaVersion = META_VERSION;
}

/** 当前可选的最高劫数：在某一劫数下活过第一千年，即可选更高一重。从未过关则只能选 0。 */
export function maxSelectableJieshu(meta) {
  const done = meta?.jieshuCleared;
  if (done == null) return 0;
  return Math.min(JIESHU_MAX, done + 1);
}

/* ------------------------------ 前世遗泽 ------------------------------ */

const NON_LEGACY_ITEMS = new Set(['tianjie_dan']);

/** 一世终了时可带走的东西。 */
export function legacyOptions(state) {
  const c = state.char;
  const opts = [];
  const gradeRank = { 凡: 0, 黄: 1, 玄: 2, 地: 3, 天: 4, 仙: 5 };
  const techs = [...(c.techniques || [])]
    .filter((t) => !String(t.id).startsWith('gf_'))
    .sort((a, b) => (gradeRank[b.grade] || 0) - (gradeRank[a.grade] || 0));
  for (const t of techs.slice(0, 6)) {
    opts.push({ kind: 'tech', id: t.id, label: `功法 ${t.name}`, payload: { ...t } });
  }
  const items = (c.inventory || [])
    .map((it) => ({ it, def: ITEM_BY_ID[it.id] }))
    .filter(({ it, def }) => def && it.qty > 0 && !NON_LEGACY_ITEMS.has(it.id) && def.type !== '丹药'
      && (def.equip || ['地', '天', '仙'].includes(def.tier) || (def.price || 0) >= 3000))
    .sort((a, b) => (b.def.price || 0) - (a.def.price || 0));
  for (const { it, def } of items.slice(0, 4)) {
    opts.push({ kind: 'item', id: it.id, label: `宝物 ${def.name}`, payload: { id: it.id } });
  }
  const stones = Math.min(200000, Math.floor((c.stones || 0) * 0.1));
  if (stones >= 100) opts.push({ kind: 'stones', id: 'stones', label: `一成家财 ${stones.toLocaleString()} 灵石`, payload: { stones } });
  const laws = Object.entries(c.laws || {}).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
  if (laws.length) opts.push({ kind: 'law', id: laws[0][0], label: '一缕道韵（主修法则开局即一重）', payload: { lawId: laws[0][0] } });
  return opts;
}

/** 把选中的遗泽写进 meta.pendingLegacy，供下一世 createRun 读取。 */
export function setLegacy(meta, picks) {
  meta.pendingLegacy = picks.map((p) => ({ kind: p.kind, id: p.id, payload: p.payload }));
}

/* ------------------------------ 旧存档迁移 ------------------------------ */

export function migrateMeta(meta) {
  if (!meta) return meta;
  // 旧存档（v8 之前）玩过的人：已开放的出身与机缘全部写进解锁名单，之后不会再被锁回去
  if (legacyOpen(meta)) {
    meta.unlockedOrigins = Array.from(new Set([...(meta.unlockedOrigins || []), ...ORIGINS.map((o) => o.id)]));
    meta.unlockedGF = Array.from(new Set([...(meta.unlockedGF || []), ...GOLDEN_FINGERS.map((g) => g.id)]));
    meta.metaVersion = META_VERSION;
  }
  if (!meta.talentLevels) {
    meta.talentLevels = {};
    for (const id of meta.talents || []) meta.talentLevels[id] = 1;
  }
  if (meta.maxRealm == null) {
    const tiers = (meta.unlockedEndings || []).map((id) => ENDING_BY_ID[id]?.tier);
    meta.maxRealm = tiers.includes('仙') ? 9 : 0;
  }
  return meta;
}

/* ------------------------------ 模拟器用：自动加点 ------------------------------ */

export function autoSpend(meta) {
  migrateMeta(meta);
  for (;;) {
    let best = null;
    for (const t of TALENTS) {
      const lv = talentLevel(meta, t.id);
      if (lv >= TALENT_MAX_LEVEL) continue;
      const cost = talentCost(t, lv + 1);
      if (cost <= (meta.karmaPoints || 0) && (!best || cost < best.cost)) best = { id: t.id, cost };
    }
    if (!best) break;
    buyTalentLevel(meta, best.id);
  }
}

export { ENDINGS };
