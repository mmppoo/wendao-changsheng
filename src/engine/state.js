import { RNG, clamp } from './rng.js';
import {
  REALMS, expToNext, realmLabel, LAWS, LAW_BY_ID, LAW_STAGES,
  DAO_BASE_QUALITIES, GOLDEN_CORE_QUALITIES,
} from '../data/realms.js';
import { ROOT_BY_ID } from '../data/roots.js';
import { ORIGIN_BY_ID } from '../data/origins.js';
import { ITEM_BY_ID } from '../data/items.js';
import { SECT_BY_ID, SECT_RANKS, sectRank } from '../data/sects.js';
import { TALENT_BY_ID } from '../data/talents.js';
import { GOLDEN_FINGER_BY_ID } from '../data/golden_fingers.js';
import { REGION_BY_ID } from '../data/regions.js';

export const SAVE_VERSION = 4;
export const START_AGE_MONTHS = 16 * 12;

const ATTR_KEYS = ['悟性', '根骨', '神识', '道心', '气运', '魅力'];

export function createRun({ seed, name, gender, originId, rootId, goldenFingerId = null, meta = {} }) {
  const rng = new RNG(seed);
  const origin = ORIGIN_BY_ID[originId] || ORIGIN_BY_ID.farmer;
  const root = ROOT_BY_ID[rootId] || ROOT_BY_ID.wuling;
  const gf = goldenFingerId ? (GOLDEN_FINGER_BY_ID[goldenFingerId] || null) : null;

  const attrs = { 悟性: 10, 根骨: 10, 神识: 10, 道心: 10, 气运: 5, 魅力: 5 };
  for (const k of ATTR_KEYS) if (origin.attrs?.[k]) attrs[k] += origin.attrs[k];
  if (root.id === 'tianling') for (const k of ATTR_KEYS) attrs[k] += 8;
  if (root.id === 'hundun') for (const k of ATTR_KEYS) attrs[k] += 15;
  if (root.id === 'shui') attrs.神识 += 10;
  if (root.id === 'bing') attrs.道心 += 8;

  const char = {
    name: name || '无名',
    gender: gender || '女',
    originId: origin.id,
    rootId: root.id,
    goldenFingerId: gf?.id || null,
    petId: null,
    artifactLevel: 0,
    artifactName: '无名青锋',
    sectId: null,
    sectRank: 0,
    contribution: 0,
    realm: 0,
    layer: 0,
    exp: 0,
    daoBaseQuality: null,
    goldenCoreQuality: null,
    laws: {},
    mainLawId: null,
    lawExp: 0,
    age: START_AGE_MONTHS,
    lifespan: Math.round((80 + root.lifespan) * 12),
    hp: 0,
    mp: 0,
    maxHp: 0,
    maxMp: 0,
    attrs,
    stones: origin.stones || 0,
    reputation: 0,
    karma: origin.flags?.魔裔 ? -15 : 0,
    demon: 0,
    inventory: [],
    techniques: [],
    titles: [],
    regionId: 'qingniu',
    location: '青牛山脉',
    regionProgress: { qingniu: 0 },
    visitedLocations: ['青牛山脉'],
    injuries: 0,
    relations: {},
  };

  for (const id of origin.items || []) addItemRaw(char, id, 1);
  if (root.tags.includes('体修')) char.attrs.根骨 += 5;

  const buffs = {};
  const talentFlags = {};
  if (gf?.apply) {
    const ap = gf.apply;
    if (ap.attrs) for (const [k, v] of Object.entries(ap.attrs)) attrs[k] = (attrs[k] || 0) + v;
    if (ap.stones) char.stones += ap.stones;
    if (ap.lifespan) char.lifespan += ap.lifespan * 12;
    for (const id of ap.items || []) addItemRaw(char, id, 1);
    for (const tech of ap.techniques || []) {
      if (!char.techniques.some((x) => x.id === tech.id)) char.techniques.push({ ...tech });
    }
    if (ap.title && !char.titles.includes(ap.title)) char.titles.push(ap.title);
    if (ap.flag) Object.assign(talentFlags, ap.flag);
  }

  for (const tid of meta.talents || []) {
    const t = TALENT_BY_ID[tid];
    if (!t?.apply) continue;
    const ap = t.apply;
    if (ap.attrs) for (const [k, v] of Object.entries(ap.attrs)) attrs[k] = (attrs[k] || 0) + v;
    if (ap.stones) char.stones += ap.stones;
    if (ap.lifespan) char.lifespan += ap.lifespan * 12;
    for (const id of ap.items || []) addItemRaw(char, id, 1);
    for (const tech of ap.techniques || []) {
      if (!char.techniques.some((x) => x.id === tech.id)) char.techniques.push({ ...tech });
    }
    if (ap.buffs) for (const [k, v] of Object.entries(ap.buffs)) buffs[k] = (buffs[k] || 0) + v;
    if (ap.flag) Object.assign(talentFlags, ap.flag);
  }

  recomputeDerived(char);
  char.hp = char.maxHp;
  char.mp = char.maxMp;

  const rootsSeen = Array.from(new Set([...(meta.rootsSeen || []), root.id]));
  const sectsJoined = meta.sectsJoined || [];

  const state = {
    version: SAVE_VERSION,
    seed,
    rngState: rng.getState(),
    turn: 0,
    char,
    flags: { ...(origin.flags || {}), ...talentFlags },
    counters: { roots_seen: rootsSeen.length },
    recent: [],
    achievements: {},
    endings: {},
    buffs,
    combat: null,
    scene: { id: 'hub', result: null },
    log: [],
    rumors: [],
    stats: {
      actions: 0, breakthroughs: 0, failures: 0, encounters: 0, kills: 0,
      deaths: 0, tribulations: 0, pills: 0, years: 0, events: 0, goldSpent: 0,
    },
    meta: {
      cycle: meta.cycle || 1,
      karmaPoints: meta.karmaPoints || 0,
      talents: meta.talents || [],
      unlockedEndings: meta.unlockedEndings || [],
      achievements: meta.achievements || {},
      rootsSeen,
      sectsJoined,
      runs: meta.runs || 0,
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  state.rng = rng;
  return state;
}

function addItemRaw(char, id, qty = 1) {
  const def = ITEM_BY_ID[id];
  const existing = char.inventory.find((it) => it.id === id);
  if (existing && def?.stack !== false) existing.qty += qty;
  else char.inventory.push({ id, qty });
}

export function addItem(state, id, qty = 1) {
  const def = ITEM_BY_ID[id];
  if (!def) return `未知物品 ${id}`;
  const existing = state.char.inventory.find((it) => it.id === id);
  if (existing && def.stack !== false) existing.qty += qty;
  else state.char.inventory.push({ id, qty });
  return `获得 ${def.name} ×${qty}`;
}

export function removeItem(state, id, qty = 1) {
  const idx = state.char.inventory.findIndex((it) => it.id === id);
  if (idx < 0) return false;
  const it = state.char.inventory[idx];
  if (it.qty < qty) return false;
  it.qty -= qty;
  if (it.qty <= 0) state.char.inventory.splice(idx, 1);
  return true;
}

export function hasItem(state, id) {
  return state.char.inventory.some((it) => it.id === id && it.qty > 0);
}

export function itemCount(state, id) {
  return state.char.inventory.filter((it) => it.id === id).reduce((a, b) => a + b.qty, 0);
}

export function qualityMultiplier(char) {
  const dao = DAO_BASE_QUALITIES.find((q) => q.id === char.daoBaseQuality)?.mult || 1;
  const core = GOLDEN_CORE_QUALITIES.find((q) => q.id === char.goldenCoreQuality)?.mult || 1;
  return dao * core;
}

export function lawBonusSum(char, key) {
  let sum = 0;
  for (const [lid, lvl] of Object.entries(char.laws || {})) {
    const def = LAW_BY_ID[lid];
    if (def?.bonus?.[key] && lvl > 0) sum += def.bonus[key] * lvl;
  }
  return sum;
}

export function maxLawLevel(char) {
  const vals = Object.values(char.laws || {}).map(Number);
  return vals.length ? Math.max(0, ...vals) : 0;
}

export function defaultLawFor(char) {
  if (char.mainLawId && LAW_BY_ID[char.mainLawId]) return char.mainLawId;
  const rootMap = {
    jin: 'sword', huo: 'pill', lei: 'thunder', kongjian: 'space',
    xingchen: 'star', xue: 'blood', hundun: 'chaos', bing: 'time',
  };
  if (rootMap[char.rootId]) return rootMap[char.rootId];
  const sectMap = {
    taixuan: 'sword', qingyun: 'thunder', danxia: 'pill', tianyin: 'karma',
    wanxiang: 'array', hanshan: 'time', wanbao: 'space', xuemo: 'blood',
  };
  if (sectMap[char.sectId]) return sectMap[char.sectId];
  return 'sword';
}

export function gainLawExp(state, amount, preferredLawId = null) {
  const c = state.char;
  c.laws = c.laws || {};
  const lid = preferredLawId && LAW_BY_ID[preferredLawId] ? preferredLawId : defaultLawFor(c);
  if (!c.mainLawId) c.mainLawId = lid;
  const curLvl = c.laws[lid] || 0;
  if (curLvl >= LAW_STAGES.length - 1) return [`${LAW_BY_ID[lid].name}法则已臻圆满`];
  c.lawExp = (c.lawExp || 0) + Math.max(1, Math.round(amount));
  const out = [`${LAW_BY_ID[lid].name}法则感悟 +${Math.round(amount)}`];
  let need = 60 * (curLvl + 1) * (curLvl + 1);
  while (c.lawExp >= need && (c.laws[lid] || 0) < LAW_STAGES.length - 1) {
    c.lawExp -= need;
    c.laws[lid] = (c.laws[lid] || 0) + 1;
    out.push(`【法则突破】${LAW_BY_ID[lid].name}法则迈入「${LAW_STAGES[c.laws[lid]]}」！`);
    recomputeDerived(c);
    need = 60 * (c.laws[lid] + 1) * (c.laws[lid] + 1);
  }
  return out;
}

export function recomputeDerived(char) {
  const root = ROOT_BY_ID[char.rootId];
  const realm = REALMS[char.realm] || REALMS[0];
  const pm = realm.powerMult || 1;
  const layerMult = 1 + (char.layer || 0) * 0.1;
  const qMult = qualityMultiplier(char);
  const bodyBonus = root?.tags?.includes('体修') ? 1.55 : 1;
  const equipMp = (char.inventory || []).reduce((acc, it) => acc + (ITEM_BY_ID[it.id]?.equip?.mp || 0), 0);
  const techLifespan = (char.techniques || []).reduce((acc, t) => acc + (t.lifespan || 0), 0);
  const lawLifespan = lawBonusSum(char, 'lifespan');
  const lawHpMult = 1 + lawBonusSum(char, 'hp');
  const lawMpMult = 1 + lawBonusSum(char, 'mp');

  char.maxHp = Math.round((120 + char.attrs.根骨 * 16) * pm * layerMult * qMult * bodyBonus * lawHpMult);
  char.maxMp = Math.round((80 + char.attrs.神识 * 14) * pm * layerMult * qMult * lawMpMult + equipMp * Math.sqrt(pm));
  char.lifespanBase = Math.round((80 + (root?.lifespan || 0) + (realm?.lifespan || 0) + techLifespan + lawLifespan) * 12);
  if (!char.lifespan || char.lifespan < char.lifespanBase) char.lifespan = char.lifespanBase;
  char.hp = clamp(char.hp, 0, char.maxHp);
  char.mp = clamp(char.mp, 0, char.maxMp);
  if (char.sectId) {
    char.sectRank = clamp(char.sectRank || 0, 0, SECT_RANKS.length - 1);
  } else {
    char.sectRank = 0;
  }
  if (!char.regionId) char.regionId = 'qingniu';
  if (!char.regionProgress) char.regionProgress = { [char.regionId]: 0 };
  if (REGION_BY_ID[char.regionId]) char.location = REGION_BY_ID[char.regionId].name;
  return char;
}

export function realmInfo(char) {
  return REALMS[char.realm];
}

export function needExp(char) {
  return expToNext(char);
}

export function isRealmMaxLayer(char) {
  return char.layer >= REALMS[char.realm].layers - 1;
}

export function canBreakthrough(char) {
  return char.exp >= needExp(char) && char.realm < REALMS.length - 1;
}

export function bottleneckStatus(state) {
  const c = state.char;
  if (!isRealmMaxLayer(c)) return { ok: true, missing: [], bottleneck: null };
  const bn = REALMS[c.realm]?.bottleneck;
  if (!bn) return { ok: true, missing: [], bottleneck: null };
  const missing = [];
  if (bn.minDaoxin && c.attrs.道心 < bn.minDaoxin) missing.push(`道心需达 ${bn.minDaoxin}（当前 ${Math.round(c.attrs.道心)}）`);
  if (bn.minLawLevel && maxLawLevel(c) < bn.minLawLevel) {
    missing.push(`至少一道法则达「${LAW_STAGES[bn.minLawLevel]}」（当前 ${LAW_STAGES[maxLawLevel(c)]}）`);
  }
  return { ok: missing.length === 0, missing, bottleneck: bn };
}

export function breakthroughChance(state) {
  const char = state.char;
  const root = ROOT_BY_ID[char.rootId];
  const base = 0.9 - char.realm * 0.058;
  let p = base
    + (root?.breakBonus || 0) / 100
    + char.attrs.道心 * 0.003
    + char.attrs.气运 * 0.0016
    + lawBonusSum(char, 'breakBonus') / 100
    + (state.buffs?.breakBonus || 0) / 100
    - char.demon * 0.0045
    - (char.injuries || 0) * 0.015;
  if (canBreakthrough(char) && isRealmMaxLayer(char)) p -= 0.1;
  if (char.rootId === 'hundun') p -= 0.05;
  return clamp(p, 0.05, 0.97);
}

export function rootSpeed(char) {
  const root = ROOT_BY_ID[char.rootId];
  return root?.speed || 1;
}

export function sectPerks(char) {
  if (!char.sectId) return {};
  return SECT_BY_ID[char.sectId]?.perks || {};
}

export function monthlyExp(state) {
  const char = state.char;
  const realm = REALMS[char.realm];
  const perks = sectPerks(char);
  const techniques = (char.techniques || []).reduce((acc, t) => acc + (t.speed || 0), 0);
  const lawSpd = lawBonusSum(char, 'speed');
  const buff = state.buffs?.speed || 0;
  const base = 4.2 + char.attrs.悟性 * 0.14 + char.attrs.根骨 * 0.04;
  const speed = rootSpeed(char) * (1 + (perks.speed || 0)) * (1 + techniques) * (1 + lawSpd) * (1 + buff);
  const demonPenalty = 1 - clamp(char.demon / 260, 0, 0.7);
  return Math.max(1, Math.round(base * speed * realm.monthly * demonPenalty));
}

export function gainExp(state, amount) {
  const char = state.char;
  if (char.realm >= REALMS.length - 1) return 0;
  const before = char.exp;
  char.exp = Math.min(needExp(char), char.exp + Math.max(0, Math.round(amount)));
  return char.exp - before;
}

export function advanceMonths(state, months, rng) {
  const char = state.char;
  const notes = [];
  char.age += months;
  const healMult = char.rootId === 'mu' ? 1.5 : 1;
  const regen = Math.round(char.maxHp * 0.12 * months * healMult);
  char.hp = clamp(char.hp + regen, 0, char.maxHp);
  char.mp = clamp(char.mp + Math.round(char.maxMp * 0.2 * months), 0, char.maxMp);
  const perks = sectPerks(char);
  if (char.sectId) {
    const pm = REALMS[char.realm]?.powerMult || 1;
    const stipend = Math.round(((perks.stones || 0) + (char.sectRank || 0) * 15) * Math.sqrt(pm) * months * 0.5);
    if (stipend) { char.stones += stipend; notes.push(`宗门月俸 +${stipend} 灵石`); }
    char.contribution += Math.round((char.sectRank || 0) * 2 * months);
  }
  const demonResist = clamp((perks.demonResist || 0) + lawBonusSum(char, 'demonResist'), 0, 0.85);
  const demonChance = 0.02 * months * (1 - demonResist);
  if (char.demon > 0 && rng && rng.chance(demonChance)) {
    char.demon = Math.min(100, char.demon + 1);
    notes.push('夜半梦魇惊魂，心魔 +1');
  }
  if (char.injuries > 0 && months >= 3) char.injuries = Math.max(0, char.injuries - 1);
  recomputeDerived(char);
  state.stats.years = Math.floor((char.age - START_AGE_MONTHS) / 12);
  return notes;
}

export function isDead(state) {
  const c = state.char;
  return c.hp <= 0 || c.age >= c.lifespan;
}

export function attrSum(char, keys) {
  return keys.reduce((a, k) => a + (char.attrs[k] || 0), 0);
}
