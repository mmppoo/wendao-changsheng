import { RNG, clamp } from './rng.js';
import {
  REALMS, expToNext, realmLabel, LAWS, LAW_BY_ID, LAW_STAGES,
  DAO_BASE_QUALITIES, GOLDEN_CORE_QUALITIES,
} from '../data/realms.js';
import { ROOT_BY_ID } from '../data/roots.js';
import { ORIGIN_BY_ID } from '../data/origins.js';
import { ITEM_BY_ID } from '../data/items.js';
import { SECT_BY_ID, SECT_RANKS, PLAYER_SECT_TEMPLATE, sectRank } from '../data/sects.js';
import { TALENT_BY_ID } from '../data/talents.js';
import { GOLDEN_FINGER_BY_ID, PET_BY_ID } from '../data/golden_fingers.js';
import { REGIONS, REGION_BY_ID } from '../data/regions.js';

export const SAVE_VERSION = 7;
export const START_AGE_MONTHS = 16 * 12;

export const WORLD_ERAS = [
  {
    id: 'aura_tide', name: '灵气潮汐', tag: '修炼 +25%',
    speed: 0.25, veinMult: 1.2,
    desc: '九州地脉灵雾喷薄，闭关修行与灵脉采撷收益大增。',
  },
  {
    id: 'demon_surge', name: '妖潮动荡', tag: '战利 +35%',
    combatLoot: 0.35, delveLoot: 0.3,
    desc: '四方妖邪蠢动，猎妖灵石修为 +35%、秘境探幽收获 +30%。',
  },
  {
    id: 'pill_craft_fair', name: '丹器盛会', tag: '炼丹 +15%',
    alchemy: 0.15, refineDiscount: 0.2,
    desc: '九州丹尊器师云集，炼丹成丹率 +15%、祭炼费用 -20%。',
  },
  {
    id: 'trade_boom', name: '万宝商潮', tag: '坊市 -12%',
    shopDiscount: 0.12, sellBonus: 0.2,
    desc: '仙商云集百货流转，坊市与秘阁额外 -12% 折扣、出售涨价 +20%。',
  },
  {
    id: 'dao_manifest', name: '天道显化', tag: '悟道 +40%',
    lawMult: 1.4, breakBonus: 5,
    desc: '大道道纹映照苍穹，法则感悟 +40%、破境成算 +5%。',
  },
  {
    id: 'trib_storm', name: '劫云暗涌', tag: '暴击 +10% · 声望 +40%',
    crit: 0.1, repMult: 1.4, demonMult: 1.2,
    desc: '九霄雷云压境，斗法暴击 +10%、声望 +40%（心魔滋长微增）。',
  },
];

export const WORLD_ERA_BY_ID = Object.fromEntries(WORLD_ERAS.map((e) => [e.id, e]));

export function currentWorldEra(state) {
  const id = state?.worldEra?.id;
  return WORLD_ERA_BY_ID[id] || WORLD_ERAS[0];
}

export function rollWorldEra(state, rng, excludeId = null) {
  const pool = WORLD_ERAS.filter((e) => e.id !== excludeId);
  const picked = rng ? rng.pick(pool) : pool[0];
  const duration = rng ? rng.int(360, 540) : 420; // 30–45 年
  const startAge = state?.char?.age ?? START_AGE_MONTHS;
  const eraState = { id: picked.id, until: startAge + duration };
  if (state) state.worldEra = eraState;
  return { era: picked, eraState };
}

export function activeDaoGoal(state) {
  if (!state?.char) return { label: '踏入仙途', detail: '吐纳炼气，初探长生之道', priority: 'normal' };
  const c = state.char;
  const life = lifespanAlert(c);
  if (life.level === 'critical') {
    return { label: '大限告急', detail: `余寿仅 ${life.remainYears} 年！速破境或寻延寿丹药`, priority: 'critical' };
  }
  const conflict = techAlignmentConflict(c);
  if (conflict.conflict) {
    return { label: '真气相冲', detail: '正邪功法混修，前往洞府「功法运使」卸除冲突典籍', priority: 'warn' };
  }
  const bn = bottleneckStatus(state);
  if (canBreakthrough(c)) {
    const nextName = REALMS[c.realm + 1]?.name || '更高境界';
    if (bn.ok) {
      return { label: '修为圆满', detail: `即刻点击「冲击境界」迈向${isRealmMaxLayer(c) ? nextName : '下一重'}`, priority: 'primary' };
    }
    return { label: '破解瓶颈', detail: `${bn.missing[0]}（前往洞府「参悟大道」）`, priority: 'warn' };
  }
  if (c.demon >= 50) {
    return { label: '镇压心魔', detail: `当前心魔 ${Math.round(c.demon)}，赴洞府「静心涤魔」或服清心丹`, priority: 'warn' };
  }
  if (!c.sectId && c.realm <= 2 && !(c.sectLeaveUntil && c.age < c.sectLeaveUntil)) {
    return { label: '拜入仙门', detail: '叩问十三宗山门，解锁藏经阁、任务堂与宗门宝库', priority: 'normal' };
  }
  const needPill = REALMS[c.realm]?.bottleneck?.needItem;
  if (needPill && isRealmMaxLayer(c) && !hasItem(state, needPill)) {
    const pillName = ITEM_BY_ID[needPill]?.name || needPill;
    return { label: `筹备${pillName}`, detail: `大境在即，可于丹房炼制或坊市/宗门宝库寻「${pillName}」`, priority: 'normal' };
  }
  const reg = REGION_BY_ID[c.regionId] || REGION_BY_ID.qingniu;
  const prog = Math.min(100, Math.round(c.regionProgress?.[reg.id] || 0));
  if (prog < 100) {
    return { label: `踏破${reg.name}`, detail: `探索度 ${prog}%（满百解锁灵脉采撷，亦可闯五层秘境探幽）`, priority: 'normal' };
  }
  const nextRegion = REGIONS.find((r) => c.realm >= r.minRealm && !(c.visitedLocations || []).includes(r.name));
  if (nextRegion) {
    return { label: `迁徙${nextRegion.name}`, detail: '前往新灵域获取首临见闻礼与更高阶丹材秘境', priority: 'normal' };
  }
  if (c.realm >= 8) {
    return { label: '叩问九霄天门', detail: '渡劫圆满可飞升真仙，或三拒天门证红尘仙', priority: 'primary' };
  }
  const era = currentWorldEra(state);
  return { label: `顺应「${era.name}」`, detail: `${era.desc}`, priority: 'normal' };
}

const ATTR_KEYS = ['悟性', '根骨', '神识', '道心', '气运', '魅力'];
const EVIL_SECTS = new Set(['xuemo', 'hehuan', 'youming']);
const EVIL_TECH_PREFIXES = ['xm_lib_', 'hh_lib_', 'ym_lib_'];
const RIGHTEOUS_TECH_PREFIXES = ['tx_lib_', 'qy_lib_', 'dx_lib_', 'ty_lib_', 'wx_lib_', 'hs_lib_'];

export function maxTechSlots(realm) {
  const r = Number(realm) || 0;
  return r <= 0 ? 2 : r === 1 ? 3 : r === 2 ? 4 : r === 3 ? 5 : 6;
}

export function techAlign(tech) {
  if (!tech) return '中';
  if (tech.align === '正' || tech.align === '邪' || tech.align === '中') return tech.align;
  if (tech.category === '魔功') return '邪';
  if (tech.sectId && SECT_BY_ID[tech.sectId]) {
    const a = SECT_BY_ID[tech.sectId].align;
    if (a === '正' || a === '邪') return a;
    return '中';
  }
  const id = String(tech.id || '');
  if (EVIL_TECH_PREFIXES.some((p) => id.startsWith(p))) return '邪';
  if (RIGHTEOUS_TECH_PREFIXES.some((p) => id.startsWith(p))) return '正';
  const name = String(tech.name || '');
  if (/[魔血鬼煞阴幽冥合欢嗜血]/.test(name) || tech.lawId === 'blood') {
    if (!/气血|碧血/.test(name)) return '邪';
  }
  if (/正道|太玄|青云|玉清|太清|上清|三清|佛|梵|静心|问心|清音/.test(name)) return '正';
  return '中';
}

export function activeTechniques(char) {
  if (!char) return [];
  if (!Array.isArray(char.techniques)) char.techniques = [];
  const cap = maxTechSlots(char.realm);
  const byId = new Map();
  for (const t of char.techniques) {
    if (t && t.id && !byId.has(t.id)) byId.set(t.id, t);
  }
  if (!Array.isArray(char.equippedTechs)) char.equippedTechs = [];
  // 清理已不存在或重复的功法 ID，并截断至当前境界槽位上限
  const cleaned = [];
  const seen = new Set();
  for (const id of char.equippedTechs) {
    if (byId.has(id) && !seen.has(id) && cleaned.length < cap) {
      seen.add(id);
      cleaned.push(id);
    }
  }
  // 若未装备任何功法（且非手动全部卸下），自动装备前 cap 门已学功法，兼容旧档与测试
  if (cleaned.length === 0 && !char._manualUnequip && char.techniques.length > 0) {
    for (const t of char.techniques) {
      if (t && t.id && !seen.has(t.id) && cleaned.length < cap) {
        seen.add(t.id);
        cleaned.push(t.id);
      }
    }
  }
  char.equippedTechs = cleaned;
  return cleaned.map((id) => byId.get(id)).filter(Boolean);
}

export function techCollectionBonus(char) {
  if (!char) return 0;
  const total = (char.techniques || []).length;
  const activeCount = activeTechniques(char).length;
  const unequippedCount = Math.max(0, total - activeCount);
  return Math.min(0.15, unequippedCount * 0.005);
}

export function techAlignmentConflict(char) {
  const active = activeTechniques(char);
  let evilCount = 0;
  let righteousCount = 0;
  for (const t of active) {
    const a = techAlign(t);
    if (a === '邪') evilCount++;
    else if (a === '正') righteousCount++;
  }
  const sect = char?.sectId ? SECT_BY_ID[char.sectId] : null;
  const isRighteousSect = sect?.align === '正';
  const isEvilCultivator = EVIL_SECTS.has(char?.sectId) || char?.rootId === 'xue' || char?.rootId === 'an';
  const conflict = (righteousCount > 0 && evilCount > 0) || (isRighteousSect && evilCount > 0);
  const demonPerHalfYear = conflict ? 4 : 0;
  const breakPenalty = conflict ? 8 : 0;
  const evilMasteryBonus = (!conflict && isEvilCultivator && evilCount > 0 && righteousCount === 0)
    ? (char?.rootId === 'an' ? 0.25 : 0.12)
    : 0;
  return { conflict, evilCount, righteousCount, demonPerHalfYear, breakPenalty, evilMasteryBonus };
}

const TECH_GRADE_RANK = { 凡: 0, 黄: 1, 玄: 2, 地: 3, 天: 4, 仙: 5 };

export function autoEquipBestTechniques(char) {
  if (!char || !Array.isArray(char.techniques)) return [];
  const cap = maxTechSlots(char.realm);
  const sect = char.sectId ? SECT_BY_ID[char.sectId] : null;
  const preferEvil = EVIL_SECTS.has(char.sectId) || char.rootId === 'xue' || char.rootId === 'an';
  const forbidEvil = sect?.align === '正';
  const score = (t) => (TECH_GRADE_RANK[t.grade] ?? 1) * 0.45 + (t.atk || 0) * 1.4 + (t.speed || 0) * 1.3 + (t.def || 0) * 0.9 + (t.lifespan || 0) * 0.002;
  const sorted = [...char.techniques].sort((a, b) => score(b) - score(a));
  const picked = [];
  let hasRight = false;
  let hasEvil = false;
  for (const t of sorted) {
    if (picked.length >= cap) break;
    const a = techAlign(t);
    if (forbidEvil && a === '邪') continue;
    if (a === '邪' && hasRight) continue;
    if (a === '正' && hasEvil) continue;
    if (preferEvil && a === '正' && sorted.some((x) => techAlign(x) === '邪' && !picked.includes(x.id))) continue;
    if (a === '正') hasRight = true;
    if (a === '邪') hasEvil = true;
    picked.push(t.id);
  }
  char.equippedTechs = picked;
  char._manualUnequip = picked.length === 0;
  recomputeDerived(char);
  return picked;
}

export function equipTechnique(char, techId) {
  if (!char || !Array.isArray(char.techniques)) return { ok: false, reason: '角色无功法数据' };
  const tech = char.techniques.find((t) => t.id === techId);
  if (!tech) return { ok: false, reason: '尚未习得此功法' };
  activeTechniques(char);
  if (char.equippedTechs.includes(techId)) return { ok: true, already: true, tech, reason: '已在运使中' };
  const cap = maxTechSlots(char.realm);
  if (char.equippedTechs.length >= cap) {
    return { ok: false, reason: `运使槽位已满（${cap}/${cap}），请先卸下其他功法` };
  }
  char.equippedTechs.push(techId);
  char._manualUnequip = false;
  recomputeDerived(char);
  return { ok: true, tech };
}

export function unequipTechnique(char, techId) {
  if (!char) return { ok: false, reason: '角色数据无效' };
  activeTechniques(char);
  const idx = char.equippedTechs.indexOf(techId);
  if (idx < 0) return { ok: false, reason: '该功法未在运使中' };
  char.equippedTechs.splice(idx, 1);
  if (char.equippedTechs.length === 0) char._manualUnequip = true;
  recomputeDerived(char);
  return { ok: true };
}

export function titleBonuses(char) {
  const res = { atk: 0, def: 0, speed: 0, lifespan: 0, daoxin: 0, repBonus: 0, alchemy: 0 };
  const titles = Array.isArray(char?.titles) ? char.titles : [];
  for (const t of titles) {
    const s = String(t || '');
    if (!s) continue;
    if (s === '开山祖师') { res.repBonus += 0.2; res.daoxin += 3; continue; }
    if (s === '刻碑人') { res.atk += 0.05; res.daoxin += 5; continue; }
    if (s === '洞天主人') { res.speed += 0.08; res.lifespan += 30; continue; }
    if (s === '赤手问道') { res.daoxin += 3; res.repBonus += 0.1; continue; }
    if (s === '雷池洗身') { res.def += 0.04; res.lifespan += 10; continue; }
    if (s === '星核在体') { res.atk += 0.04; res.speed += 0.04; continue; }
    if (s === '桃源客') { res.lifespan += 15; res.daoxin += 2; continue; }
    if (s === '照见') { res.daoxin += 4; continue; }
    if (s.includes('剑')) res.atk += 0.04;
    if (s.includes('丹') || s.includes('药')) res.alchemy += 0.06;
    if (s.includes('阵') || s.includes('星')) res.def += 0.03;
    if (s.includes('仙') || s.includes('圣') || s.includes('帝') || s.includes('尊')) {
      res.atk += 0.03;
      res.def += 0.03;
      res.repBonus += 0.08;
    }
  }
  return {
    atk: Math.min(0.25, +res.atk.toFixed(4)),
    def: Math.min(0.25, +res.def.toFixed(4)),
    speed: Math.min(0.2, +res.speed.toFixed(4)),
    lifespan: Math.min(100, Math.round(res.lifespan)),
    daoxin: Math.min(20, Math.round(res.daoxin)),
    repBonus: Math.min(0.5, +res.repBonus.toFixed(4)),
    alchemy: Math.min(0.25, +res.alchemy.toFixed(4)),
  };
}

export function petBonuses(char) {
  const zero = { atk: 0, def: 0, stones: 0, luck: 0, explore: 0, demonResist: 0, tribResist: 0, lifespan: 0 };
  if (!char?.petId || !PET_BY_ID[char.petId]) return zero;
  const lvl = clamp(Number(char.petLevel) || 1, 1, 5);
  const beastBoost = 1 + (sectPerks(char).beast || 0);
  const scale = (1 + (lvl - 1) * 0.35) * beastBoost;
  switch (char.petId) {
    case 'pet_turtle':
      return {
        ...zero,
        def: Math.min(0.45, +(0.14 * scale).toFixed(3)),
        tribResist: Math.min(0.25, +(0.05 * scale).toFixed(3)),
        lifespan: Math.round(40 * (1 + (lvl - 1) * 0.25) * beastBoost),
      };
    case 'pet_bird':
      return {
        ...zero,
        atk: +(0.14 * scale).toFixed(3),
        luck: Math.round(5 * scale),
        explore: Math.min(0.4, +(0.12 * scale).toFixed(3)),
        tribResist: Math.min(0.18, +(0.03 * scale).toFixed(3)),
      };
    case 'pet_beetle':
      return {
        ...zero,
        atk: +(0.2 * scale).toFixed(3),
        stones: +(0.15 * scale).toFixed(3),
        explore: +(0.06 * scale).toFixed(3),
      };
    case 'pet_fox':
      return {
        ...zero,
        demonResist: Math.min(0.65, +(0.25 * scale).toFixed(3)),
        luck: Math.round(3 * scale),
        def: +(0.06 * scale).toFixed(3),
        tribResist: Math.min(0.2, +(0.04 * scale).toFixed(3)),
      };
    default:
      return zero;
  }
}

export function lifespanAlert(char) {
  const lifespan = Math.max(1, Number(char?.lifespan) || 1);
  const age = Number(char?.age) || 0;
  const remainMonths = Math.max(0, lifespan - age);
  const remainYears = Math.floor(remainMonths / 12);
  const ratio = remainMonths / lifespan;
  if (remainMonths <= 60 || ratio <= 0.1) {
    return { level: 'critical', remainYears, remainMonths, text: '寿元将竭，油尽灯枯！须即刻破境或寻延寿仙药！' };
  }
  if (remainMonths <= 180 || ratio <= 0.25) {
    return { level: 'warn', remainYears, remainMonths, text: '大限渐近，余寿不足四分之一。' };
  }
  return { level: 'ok', remainYears, remainMonths, text: '' };
}

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
    petLevel: 1,
    caveLevel: 1,
    artifactLevel: 0,
    artifactName: '无名青锋',
    sectId: null,
    sectRank: 0,
    contribution: 0,
    sectBlacklist: {},
    sectLeaveUntil: 0,
    betrayCount: 0,
    playerSectName: null,
    playerSectLevel: 0,
    playerSectDisciples: 0,
    spouseNpcId: null,
    secretsCleared: [],
    stayRegionMonths: 0,
    realm: 0,
    layer: 0,
    exp: 0,
    daoBaseQuality: null,
    goldenCoreQuality: null,
    laws: {},
    mainLawId: null,
    lawExp: 0,
    age: START_AGE_MONTHS,
    bonusLifespan: 0,
    lifespanBase: Math.round((80 + root.lifespan) * 12),
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
    equippedTechs: [],
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

  const addStartingTech = (tech) => {
    if (!tech || !tech.id) return;
    if (!char.techniques.some((x) => x.id === tech.id)) {
      char.techniques.push({ ...tech });
      if (char.equippedTechs.length < maxTechSlots(char.realm) && !char.equippedTechs.includes(tech.id)) {
        char.equippedTechs.push(tech.id);
      }
    }
  };

  const buffs = {};
  const talentFlags = {};
  if (gf?.apply) {
    const ap = gf.apply;
    if (ap.attrs) for (const [k, v] of Object.entries(ap.attrs)) attrs[k] = (attrs[k] || 0) + v;
    if (ap.stones) char.stones += ap.stones;
    if (ap.lifespan) char.bonusLifespan += ap.lifespan * 12;
    for (const id of ap.items || []) addItemRaw(char, id, 1);
    for (const tech of ap.techniques || []) addStartingTech(tech);
    if (ap.title && !char.titles.includes(ap.title)) char.titles.push(ap.title);
    if (ap.flag) Object.assign(talentFlags, ap.flag);
  }

  for (const tid of meta.talents || []) {
    const t = TALENT_BY_ID[tid];
    if (!t?.apply) continue;
    const ap = t.apply;
    if (ap.attrs) for (const [k, v] of Object.entries(ap.attrs)) attrs[k] = (attrs[k] || 0) + v;
    if (ap.stones) char.stones += ap.stones;
    if (ap.lifespan) char.bonusLifespan += ap.lifespan * 12;
    for (const id of ap.items || []) addItemRaw(char, id, 1);
    for (const tech of ap.techniques || []) addStartingTech(tech);
    if (ap.buffs) for (const [k, v] of Object.entries(ap.buffs)) buffs[k] = (buffs[k] || 0) + v;
    if (ap.flag) Object.assign(talentFlags, ap.flag);
  }

  recomputeDerived(char);
  char.hp = char.maxHp;
  char.mp = char.maxMp;

  const rootsSeen = Array.from(new Set([...(meta.rootsSeen || []), root.id]));
  const sectsJoined = meta.sectsJoined || [];
  const techniquesSeen = Array.from(new Set([...(meta.techniquesSeen || []), ...char.techniques.map((t) => t.id)]));

  const state = {
    version: SAVE_VERSION,
    seed,
    rngState: rng.getState(),
    turn: 0,
    char,
    flags: { ...(origin.flags || {}), ...talentFlags },
    counters: { roots_seen: rootsSeen.length, stay_home: 0, laws: 0, delves: 0 },
    recent: [],
    achievements: {},
    endings: {},
    buffs,
    combat: null,
    delve: null,
    worldEra: { id: WORLD_ERAS[rng.int(0, WORLD_ERAS.length - 1)].id, until: START_AGE_MONTHS + rng.int(360, 540) },
    sectBoard: null,
    scene: { id: 'hub', result: null },
    log: [],
    rumors: [],
    stats: {
      actions: 0, breakthroughs: 0, failures: 0, encounters: 0, kills: 0,
      deaths: 0, tribulations: 0, pills: 0, years: 0, events: 0, goldSpent: 0, contribSpent: 0,
    },
    meta: {
      cycle: meta.cycle || 1,
      karmaPoints: meta.karmaPoints || 0,
      talents: meta.talents || [],
      unlockedEndings: meta.unlockedEndings || [],
      achievements: meta.achievements || {},
      rootsSeen,
      sectsJoined,
      techniquesSeen,
      runs: meta.runs || 0,
      totalDeaths: meta.totalDeaths || 0,
      achKarmaGranted: meta.achKarmaGranted || 0,
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
  state.counters = state.counters || {};
  const lid = preferredLawId && LAW_BY_ID[preferredLawId] ? preferredLawId : defaultLawFor(c);
  if (!c.mainLawId) c.mainLawId = lid;
  const curLvl = c.laws[lid] || 0;
  if (curLvl >= LAW_STAGES.length - 1) {
    state.counters.laws = Object.values(c.laws || {}).reduce((a, b) => a + Number(b || 0), 0);
    return [`${LAW_BY_ID[lid].name}法则已臻圆满`];
  }
  const era = currentWorldEra(state);
  const perks = sectPerks(c);
  const arrayBoost = (lid === 'array' && perks.array) ? (1 + perks.array) : 1;
  const finalAmount = Math.max(1, Math.round(amount * (era.lawMult || 1) * arrayBoost));
  c.lawExp = (c.lawExp || 0) + finalAmount;
  const out = [`${LAW_BY_ID[lid].name}法则感悟 +${finalAmount}`];
  let need = 60 * (curLvl + 1) * (curLvl + 1);
  while (c.lawExp >= need && (c.laws[lid] || 0) < LAW_STAGES.length - 1) {
    c.lawExp -= need;
    c.laws[lid] = (c.laws[lid] || 0) + 1;
    out.push(`【法则突破】${LAW_BY_ID[lid].name}法则迈入「${LAW_STAGES[c.laws[lid]]}」！`);
    recomputeDerived(c);
    need = 60 * (c.laws[lid] + 1) * (c.laws[lid] + 1);
  }
  state.counters.laws = Object.values(c.laws || {}).reduce((a, b) => a + Number(b || 0), 0);
  return out;
}

export function recomputeDerived(char) {
  // 兼容旧存档与直接构造角色对象的默认字段补齐
  if (!Array.isArray(char.techniques)) char.techniques = [];
  if (!Array.isArray(char.equippedTechs)) char.equippedTechs = [];
  if (!Array.isArray(char.titles)) char.titles = [];
  if (!Array.isArray(char.secretsCleared)) char.secretsCleared = [];
  if (!char.sectBlacklist || typeof char.sectBlacklist !== 'object') char.sectBlacklist = {};
  if (char.sectLeaveUntil == null) char.sectLeaveUntil = 0;
  if (char.betrayCount == null) char.betrayCount = 0;
  if (char.playerSectName === undefined) char.playerSectName = null;
  if (char.playerSectLevel == null) char.playerSectLevel = 0;
  if (char.playerSectDisciples == null) char.playerSectDisciples = 0;
  if (char.spouseNpcId === undefined) char.spouseNpcId = null;
  if (char.stayRegionMonths == null) char.stayRegionMonths = 0;
  if (char.bonusLifespan == null) char.bonusLifespan = 0;
  char.caveLevel = clamp(Number(char.caveLevel) || 1, 1, 9);
  char.petLevel = clamp(Number(char.petLevel) || 1, 1, 5);

  const active = activeTechniques(char);
  const root = ROOT_BY_ID[char.rootId];
  const realm = REALMS[char.realm] || REALMS[0];
  const pm = realm.powerMult || 1;
  const layerMult = 1 + (char.layer || 0) * 0.1;
  const qMult = qualityMultiplier(char);
  const bodyBonus = root?.tags?.includes('体修') ? 1.55 : 1;
  const equipMp = (char.inventory || []).reduce((acc, it) => acc + (ITEM_BY_ID[it.id]?.equip?.mp || 0), 0);

  const rawTechLifespan = active.reduce((acc, t) => acc + (t.lifespan || 0), 0);
  const techLifespan = clamp(rawTechLifespan, -50, 200);
  const lawLifespan = Math.min(300, lawBonusSum(char, 'lifespan'));
  const tBonus = titleBonuses(char);
  const pBonus = petBonuses(char);
  const sPerks = sectPerks(char);
  const lawHpMult = 1 + lawBonusSum(char, 'hp');
  const lawMpMult = 1 + lawBonusSum(char, 'mp');

  char.maxHp = Math.round((120 + char.attrs.根骨 * 16) * pm * layerMult * qMult * bodyBonus * lawHpMult);
  char.maxMp = Math.round((80 + char.attrs.神识 * 14) * pm * layerMult * qMult * lawMpMult + equipMp * Math.sqrt(pm));

  const baseYears = 80
    + (root?.lifespan || 0)
    + (realm?.lifespan || 0)
    + techLifespan
    + lawLifespan
    + (tBonus.lifespan || 0)
    + Math.min(100, pBonus.lifespan || 0)
    + Math.min(50, sPerks.lifespan || 0);
  const bonusCapMonths = Math.round(baseYears * 0.5 * 12);
  const bonusMinMonths = -Math.round(baseYears * 0.4 * 12);
  char.bonusLifespan = clamp(char.bonusLifespan || 0, -60000, 120000);
  const effectiveBonus = clamp(char.bonusLifespan, bonusMinMonths, bonusCapMonths);
  char.lifespanBase = Math.round(baseYears * 12);
  char.lifespan = Math.max(12 * 30, char.lifespanBase + effectiveBonus);

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
  const tBonus = titleBonuses(char);
  const pBonus = petBonuses(char);
  const alignInfo = techAlignmentConflict(char);
  const era = currentWorldEra(state);
  const permBreak = (state.buffs?.permBreakBonus || 0)
    || ((state.meta?.talents || []).includes('t_niming') ? 6 : 0);
  const base = 0.9 - char.realm * 0.058;
  let p = base
    + (root?.breakBonus || 0) / 100
    + (char.attrs.道心 + (tBonus.daoxin || 0)) * 0.003
    + (char.attrs.气运 + (pBonus.luck || 0)) * 0.0016
    + lawBonusSum(char, 'breakBonus') / 100
    + (state.buffs?.breakBonus || 0) / 100
    + permBreak / 100
    + (era.breakBonus || 0) / 100
    - (alignInfo.breakPenalty || 0) / 100
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
  if (!char?.sectId) return {};
  if (char.sectId === 'player_sect') {
    const lvl = clamp(Number(char.playerSectLevel) || 1, 1, 5);
    return {
      ...PLAYER_SECT_TEMPLATE.perks,
      speed: +(0.16 + lvl * 0.04).toFixed(2),
      atk: +(0.12 + lvl * 0.04).toFixed(2),
      def: +(0.1 + lvl * 0.03).toFixed(2),
      stones: 100 * lvl,
    };
  }
  return SECT_BY_ID[char.sectId]?.perks || {};
}

export function monthlyExp(state) {
  const char = state.char;
  const realm = REALMS[char.realm];
  const perks = sectPerks(char);
  const era = currentWorldEra(state);
  const activeTechSpeed = activeTechniques(char).reduce((acc, t) => acc + (t.speed || 0), 0);
  const collectionSpeed = techCollectionBonus(char);
  const alignInfo = techAlignmentConflict(char);
  const caveMult = 1 + (clamp(char.caveLevel || 1, 1, 9) - 1) * 0.18;
  const tBonus = titleBonuses(char);
  const techniques = activeTechSpeed + collectionSpeed + (alignInfo.evilMasteryBonus || 0);
  const lawSpd = lawBonusSum(char, 'speed');
  const buff = state.buffs?.speed || 0;
  const base = 4.2 + char.attrs.悟性 * 0.14 + char.attrs.根骨 * 0.04;
  const speed = rootSpeed(char)
    * (1 + (perks.speed || 0))
    * (1 + techniques)
    * caveMult
    * (1 + lawSpd)
    * (1 + (tBonus.speed || 0))
    * (1 + (era.speed || 0))
    * (1 + buff);
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
  char.stayRegionMonths = (char.stayRegionMonths || 0) + months;
  state.counters = state.counters || {};
  state.counters.stay_home = Math.max(state.counters.stay_home || 0, Math.floor(char.stayRegionMonths / 12));

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
  const era = currentWorldEra(state);
  const pBonus = petBonuses(char);
  const demonResist = clamp((perks.demonResist || 0) + lawBonusSum(char, 'demonResist') + (pBonus.demonResist || 0), 0, 0.85);
  const demonChance = 0.02 * months * (1 - demonResist) * (era.demonMult || 1);
  if (char.demon > 0 && rng && rng.chance(demonChance)) {
    char.demon = Math.min(100, char.demon + 1);
    notes.push('夜半梦魇惊魂，心魔 +1');
  }
  if (perks.demon && months >= 6 && rng && rng.chance(0.35 * (1 - demonResist))) {
    const dGain = Math.max(1, Math.round(perks.demon * (months / 12)));
    char.demon = clamp(char.demon + dGain, 0, 100);
    notes.push(`魔道血煞侵蚀神魂，心魔 +${dGain}`);
  }
  const alignInfo = techAlignmentConflict(char);
  if (alignInfo.conflict && months >= 6) {
    const rawGain = Math.round(alignInfo.demonPerHalfYear * (months / 6) * (1 - demonResist * 0.5));
    const gain = Math.max(1, rawGain);
    char.demon = clamp(char.demon + gain, 0, 100);
    notes.push(`正邪功法同修气机相冲，心魔 +${gain}`);
  }
  if (char.injuries > 0 && months >= 3) char.injuries = Math.max(0, char.injuries - 1);
  if (state.worldEra && char.age >= state.worldEra.until) {
    const { era: nextEra } = rollWorldEra(state, rng, state.worldEra.id);
    notes.push(`【九州天象更迭】进入「${nextEra.name}」纪元（${nextEra.tag}）：${nextEra.desc}`);
  }
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
