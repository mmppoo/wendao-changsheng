import { RNG, clamp } from './rng.js';
import { REALMS, expToNext, realmLabel } from '../data/realms.js';
import { ROOT_BY_ID } from '../data/roots.js';
import { ORIGIN_BY_ID } from '../data/origins.js';
import { ITEM_BY_ID } from '../data/items.js';
import { SECT_BY_ID, sectRank } from '../data/sects.js';
import { TALENT_BY_ID } from '../data/talents.js';

export const SAVE_VERSION = 3;
export const START_AGE_MONTHS = 16 * 12;

const ATTR_KEYS = ['悟性', '根骨', '神识', '道心', '气运', '魅力'];

export function createRun({ seed, name, gender, originId, rootId, meta = {} }) {
  const rng = new RNG(seed);
  const origin = ORIGIN_BY_ID[originId] || ORIGIN_BY_ID.farmer;
  const root = ROOT_BY_ID[rootId] || ROOT_BY_ID.wuling;

  const attrs = { 悟性: 10, 根骨: 10, 神识: 10, 道心: 10, 气运: 5, 魅力: 5 };
  for (const k of ATTR_KEYS) if (origin.attrs?.[k]) attrs[k] += origin.attrs[k];
  if (root.id === 'tianling') for (const k of ATTR_KEYS) attrs[k] += 8;
  if (root.id === 'hundun') for (const k of ATTR_KEYS) attrs[k] += 15;
  if (root.id === 'shui') attrs.神识 += 10;
  if (root.id === 'bing') attrs.道心 += 8;
  if (origin.id === 'hunter') attrs.根骨 += 0; // 已在 origin.attrs 中计入气血

  const char = {
    name: name || '无名',
    gender: gender || '女',
    originId: origin.id,
    rootId: root.id,
    sectId: null,
    sectRank: 0,
    contribution: 0,
    realm: 0,
    layer: 0,
    exp: 0,
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
    location: '青牛村',
    injuries: 0,
    relations: {},
  };

  for (const id of origin.items || []) addItemRaw(char, id, 1);
  if (root.tags.includes('体修')) char.attrs.根骨 += 5;

  const buffs = {};
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
    if (ap.flag) Object.assign(char.flags || {}, ap.flag);
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
    flags: { ...(origin.flags || {}) },
    counters: { roots_seen: rootsSeen.length },
    recent: [],
    achievements: {},
    endings: {},
    buffs,
    combat: null,
    scene: { id: 'hub', result: null },
    log: [],
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

export function recomputeDerived(char) {
  const root = ROOT_BY_ID[char.rootId];
  const realm = REALMS[char.realm];
  const bodyBonus = root?.tags?.includes('体修') ? 1.6 : 1;
  char.maxHp = Math.round((100 + char.attrs.根骨 * 28 + char.realm * 420) * bodyBonus);
  char.maxMp = Math.round(60 + char.attrs.神识 * 18 + char.realm * 260);
  char.lifespanBase = Math.round((80 + (root?.lifespan || 0) + (realm?.lifespan || 0)) * 12);
  if (!char.lifespan || char.lifespan < char.lifespanBase) char.lifespan = char.lifespanBase;
  char.hp = clamp(char.hp, 0, char.maxHp);
  char.mp = clamp(char.mp, 0, char.maxMp);
  if (char.sectId) {
    const rank = sectRank(char.contribution);
    char.sectRank = rank.index;
  }
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

export function breakthroughChance(state) {
  const char = state.char;
  const root = ROOT_BY_ID[char.rootId];
  const base = 0.92 - char.realm * 0.062;
  let p = base
    + (root?.breakBonus || 0) / 100
    + char.attrs.道心 * 0.0032
    + char.attrs.气运 * 0.0016
    + (state.buffs?.breakBonus || 0) / 100
    - char.demon * 0.0045
    - (char.injuries || 0) * 0.01;
  if (canBreakthrough(char) && isRealmMaxLayer(char)) p -= 0.08; // 大境界更难
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
  const techniques = char.techniques.reduce((acc, t) => acc + (t.speed || 0), 0);
  const buff = state.buffs?.speed || 0;
  const base = 5 + char.attrs.悟性 * 0.16 + char.attrs.根骨 * 0.05;
  const speed = rootSpeed(char) * (1 + (perks.speed || 0)) * (1 + techniques) * (1 + buff);
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
  const regen = Math.round(char.maxHp * 0.12 * months);
  char.hp = clamp(char.hp + regen, 0, char.maxHp);
  char.mp = clamp(char.mp + Math.round(char.maxMp * 0.2 * months), 0, char.maxMp);
  if (char.sectId) {
    const perks = sectPerks(char);
    const stipend = Math.round((perks.stones || 0) * months);
    if (stipend) { char.stones += stipend; notes.push(`宗门月例 +${stipend} 灵石`); }
    char.contribution += Math.round(state.char.sectRank * 2 * months);
  }
  if (char.demon > 0 && rng && rng.chance(0.02 * months)) {
    char.demon = Math.min(100, char.demon + 1);
    notes.push('夜里又做了那个梦。心魔 +1');
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
