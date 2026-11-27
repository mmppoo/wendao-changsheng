import { addItem, removeItem, gainExp, needExp, recomputeDerived, advanceMonths } from './state.js';
import { ITEM_BY_ID } from '../data/items.js';
import { SECT_BY_ID } from '../data/sects.js';
import { REALMS } from '../data/realms.js';
import { PET_BY_ID } from '../data/golden_fingers.js';
import { clamp } from './rng.js';

/**
 * 统一效果结算。所有剧情、物品、事件都只描述 effects，不直接改状态。
 * 返回给玩家看的文本行。
 */
export function applyEffects(state, effects = {}, ctx = {}) {
  const out = [];
  const c = state.char;
  if (!effects) return out;

  if (effects.exp) {
    const gained = gainExp(state, effects.exp);
    if (gained) out.push(`修为 +${gained}`);
  }
  if (effects.expPct) {
    const gained = gainExp(state, Math.round(needExp(c) * effects.expPct));
    if (gained) out.push(`修为 +${gained}`);
  }
  if (effects.stones) {
    c.stones = Math.max(0, c.stones + effects.stones);
    out.push(`灵石 ${effects.stones > 0 ? '+' : ''}${effects.stones}`);
  }
  if (effects.hp) {
    const delta = effects.hp > 0 && c.rootId === 'mu' ? Math.round(effects.hp * 1.5) : effects.hp;
    c.hp = clamp(c.hp + delta, 0, c.maxHp);
    out.push(`气血 ${delta > 0 ? '+' : ''}${delta}`);
  }
  if (effects.mp) {
    c.mp = clamp(c.mp + effects.mp, 0, c.maxMp);
    out.push(`灵力 ${effects.mp > 0 ? '+' : ''}${effects.mp}`);
  }
  if (effects.attrs) {
    for (const [k, v] of Object.entries(effects.attrs)) {
      c.attrs[k] = Math.max(0, (c.attrs[k] || 0) + v);
      out.push(`${k} ${v > 0 ? '+' : ''}${v}`);
    }
    recomputeDerived(c);
  }
  if (effects.lifespan) {
    c.lifespan += effects.lifespan * 12;
    out.push(`寿元 ${effects.lifespan > 0 ? '+' : ''}${effects.lifespan} 年`);
  }
  if (effects.reputation) {
    let rep = effects.reputation;
    if (rep > 0 && c.rootId === 'taiyang') rep = Math.round(rep * 1.5);
    if (rep > 0 && c.rootId === 'an') rep = Math.max(1, Math.round(rep * 0.5));
    if (rep > 0 && c.goldenFingerId === 'gf_none') rep = Math.round(rep * 1.25);
    c.reputation += rep;
    out.push(`声望 ${rep > 0 ? '+' : ''}${rep}`);
  }
  if (effects.contribution) {
    c.contribution = Math.max(0, c.contribution + effects.contribution);
    out.push(`宗门贡献 ${effects.contribution > 0 ? '+' : ''}${effects.contribution}`);
  }
  if (effects.karma) {
    c.karma += effects.karma;
    out.push(`业力 ${effects.karma > 0 ? '+' : ''}${effects.karma}`);
  }
  if (effects.demon) {
    let dm = effects.demon;
    if (dm > 0 && c.goldenFingerId === 'gf_stealth') dm = Math.max(1, Math.round(dm * 0.5));
    c.demon = clamp(c.demon + dm, 0, 100);
    out.push(`心魔 ${dm > 0 ? '+' : ''}${dm}`);
  }
  if (effects.pet && PET_BY_ID[effects.pet]) {
    c.petId = effects.pet;
    out.push(`伴生灵兽「${PET_BY_ID[effects.pet].name}」认主`);
  }
  if (effects.injury) {
    c.injuries = Math.max(0, (c.injuries || 0) + effects.injury);
    out.push(`伤势 +${effects.injury}`);
  }
  if (effects.heal) {
    c.injuries = Math.max(0, (c.injuries || 0) - effects.heal);
    c.hp = c.maxHp;
    out.push('伤势痊愈');
  }
  if (effects.items) {
    for (const entry of effects.items) {
      const id = typeof entry === 'string' ? entry : entry.id;
      const qty = typeof entry === 'string' ? 1 : (entry.qty || 1);
      const def = ITEM_BY_ID[id];
      if (!def) continue;
      addItem(state, id, qty);
      out.push(`获得 ${def.name}${qty > 1 ? ` ×${qty}` : ''}`);
    }
  }
  if (effects.removeItems) {
    for (const entry of effects.removeItems) {
      const id = typeof entry === 'string' ? entry : entry.id;
      const qty = typeof entry === 'string' ? 1 : (entry.qty || 1);
      if (removeItem(state, id, qty)) out.push(`失去 ${ITEM_BY_ID[id]?.name || id}${qty > 1 ? ` ×${qty}` : ''}`);
    }
  }
  if (effects.techniques) {
    for (const t of effects.techniques) {
      if (!c.techniques.some((x) => x.id === t.id)) {
        c.techniques.push({ ...t });
        out.push(`习得${t.name || '功法'}`);
      }
    }
  }
  if (effects.title) {
    const list = Array.isArray(effects.title) ? effects.title : [effects.title];
    for (const t of list) if (!c.titles.includes(t)) { c.titles.push(t); out.push(`获得称号「${t}」`); }
  }
  if (effects.flag) {
    for (const [k, v] of Object.entries(effects.flag)) state.flags[k] = v;
  }
  if (effects.counter) {
    for (const [k, v] of Object.entries(effects.counter)) {
      state.counters[k] = (state.counters[k] || 0) + v;
    }
  }
  if (effects.breakBonus) {
    state.buffs.breakBonus = (state.buffs.breakBonus || 0) + effects.breakBonus;
    out.push(`下次突破成算 +${effects.breakBonus}%`);
  }
  if (effects.shield) {
    state.buffs.shield = (state.buffs.shield || 0) + effects.shield;
    out.push(`护体金光 +${effects.shield} 层`);
  }
  if (effects.escape) {
    state.buffs.escape = (state.buffs.escape || 0) + effects.escape;
    out.push(`神行遁符 +${effects.escape} 次`);
  }
  if (effects.buff) {
    if (effects.buff.breakBonus) state.buffs.breakBonus = (state.buffs.breakBonus || 0) + effects.buff.breakBonus;
    if (effects.buff.speed) state.buffs.speed = (state.buffs.speed || 0) + effects.buff.speed;
  }
  if (effects.relation) {
    for (const [k, v] of Object.entries(effects.relation)) {
      c.relations[k] = (c.relations[k] || 0) + v;
    }
  }
  if (effects.sect) {
    c.sectId = effects.sect;
    c.sectRank = 0;
    c.contribution = 0;
    out.push(`加入${SECT_BY_ID[effects.sect]?.name || effects.sect}`);
  }
  if (effects.realmSet && Number.isInteger(effects.realmSet)) {
    const realm = REALMS[effects.realmSet];
    if (realm) {
      c.realm = effects.realmSet;
      c.layer = Math.min(effects.layerSet ?? 0, realm.layers - 1);
      c.exp = 0;
      c.lifespanBase = Math.round((80 + (realm.lifespan || 0)) * 12);
      c.lifespan = Math.max(c.lifespan, c.lifespanBase);
      out.push(`境界：${realm.name}`);
      recomputeDerived(c);
    }
  }
  if (effects.time) {
    out.push(...advanceMonths(state, effects.time, ctx.rng));
  }
  if (effects.achievements && ctx.unlockAchievement) {
    for (const id of effects.achievements) {
      const name = ctx.unlockAchievement(id);
      if (name) out.push(`成就解锁：${name}`);
    }
  }
  state.updatedAt = Date.now();
  return out;
}
