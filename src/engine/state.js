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
import { talentLevel, talentScale, jieshuMods, migrateMeta } from './meta.js';
import { ERA1_CHAPTERS, chapterForYear } from '../data/history/chronicle.js';
import { freshCentury1World } from '../data/history/index.js';
import { GOLDEN_FINGER_BY_ID, PET_BY_ID } from '../data/golden_fingers.js';
import { REGIONS, REGION_BY_ID } from '../data/regions.js';

export const SAVE_VERSION = 8; // v8：世界换成宁朝五域，v7 及以前的「进行中的一世」不再载入（跨世进度保留）
export const START_AGE_MONTHS = 16 * 12;

/* ---------------- v8 大历史：年份、篇章、灵气 ---------------- */

/** 第一纪元第几年（每一世都从第 1 年开始，主角 16 岁）。 */
export function yearOf(state) {
  return Math.max(1, Math.floor(((state?.char?.age ?? START_AGE_MONTHS) - START_AGE_MONTHS) / 12) + 1);
}

/** 各章末的灵气（0–100）：照百章总表「修凡消长」逐章累计，起点 50。 */
const LINGQI_BY_CHAPTER = (() => {
  let L = 50;
  return ERA1_CHAPTERS.map((c) => { L = Math.max(0, Math.min(100, L + c.cult * 8)); return L; });
})();

/** 某年的灵气：章内从上一章末值线性过渡到本章末值。 */
export function lingqiAt(year) {
  const y = Math.max(1, year | 0);
  if (y > 10000) return LINGQI_BY_CHAPTER[LINGQI_BY_CHAPTER.length - 1];
  const idx = Math.min(LINGQI_BY_CHAPTER.length - 1, Math.floor((y - 1) / 100));
  const prev = idx === 0 ? 50 : LINGQI_BY_CHAPTER[idx - 1];
  const t = ((y - 1) % 100) / 100;
  return Math.round(prev + (LINGQI_BY_CHAPTER[idx] - prev) * t);
}

/** 灵气的大白话说法（界面只给词，不给数字）。 */
export function lingqiWord(L) {
  if (L >= 85) return '鼎盛';
  if (L >= 65) return '充沛';
  if (L >= 40) return '平常';
  if (L >= 20) return '稀薄';
  if (L > 0) return '将尽';
  return '断绝';
}

/** 外人眼中的修为表象（敛息藏锋时压低一至两个大境界，配合龟息藏锋诀更隐蔽）。 */
export function perceivedRealmLabel(char) {
  if (!char) return '炼气一层';
  const stance = char.auraStance || 'normal';
  if (stance !== 'hide') return realmLabel(char);
  const stealth = char.goldenFingerId === 'gf_stealth';
  const r = char.realm || 0;
  const layer = char.layer || 0;
  if (r === 0) {
    if (stealth || layer <= 3) return '凡俗微弱气机';
    return '炼气一层';
  }
  if (r === 1) return stealth ? '炼气一层' : '炼气三层';
  if (r === 2) return stealth ? '炼气中期' : '炼气圆满';
  const drop = stealth ? Math.min(3, r) : Math.min(2, r);
  const shown = Math.max(0, r - drop);
  return shown === 0 ? '炼气后期' : `${REALMS[shown].name}初期`;
}

/** 冲击某一大境所需的天地灵机（剧本：元婴以上是世人不知的境地，只在灵气鼎盛之世可成）。 */
export const LINGQI_FOR_REALM = [0, 10, 30, 45, 70, 78, 82, 86, 88, 90];

export function realmCapByLingqi(L) {
  let cap = 0;
  for (let r = 0; r < LINGQI_FOR_REALM.length; r++) if (L >= LINGQI_FOR_REALM[r]) cap = r;
  return cap;
}

/**
 * 当世气象（取代旧的随机「天象纪元」）：由本章与灵气决定。
 * 字段沿用旧接口：speed / breakBonus / veinMult / shopDiscount / sellBonus / combatLoot …
 */
export function currentWorldEra(state) {
  const year = yearOf(state);
  const ch = chapterForYear(year);
  const L = lingqiAt(year);
  const speed = (0.15 + 1.7 * L / 100) - 1;
  const techUp = ch.tech > 0;
  return {
    id: ch.id,
    name: ch.name,
    desc: ch.world,
    chapter: ch,
    lingqi: L,
    speed,
    veinMult: Math.max(0.1, L / 50),
    breakBonus: Math.round((L - 50) / 10),
    shopDiscount: techUp ? 0.08 : 0,
    sellBonus: techUp ? 0.1 : 0,
    alchemy: L >= 70 ? 0.1 : (L < 20 ? -0.2 : 0),
    lawMult: L >= 80 ? 1.3 : 1,
    combatLoot: 0,
  };
}

export function activeDaoGoal(state) {
  if (!state?.char) return { label: '踏入仙途', detail: '吐纳炼气，初探长生之道', priority: 'normal' };
  const c = state.char;
  const life = lifespanAlert(c);
  if (life.level === 'critical') {
    return { label: '大限告急', detail: `余寿仅 ${life.remainYears} 年，需尽快破境或寻延寿丹药`, priority: 'critical' };
  }
  // v8：第一百年大水已过，本世没改写——提示可以带着记忆回到第一年
  const judged = state.history?.['y019.century_judgement'];
  if (judged && (state.meta?.cycle || 1) <= 3 && !(state.rewrites || []).length && yearOf(state) < 120) {
    return { label: '前世之鉴', detail: '临河这场大水已记进前世手札。若想改写，可到洞府「了此一生」，带着记忆回到第一年', priority: 'warn' };
  }
  // v8：末法预警——按当前境界，灵气枯竭时寿元只剩四成，算出熬不熬得过去
  const yr = yearOf(state);
  if (c.realm >= 1 && yr < 4700) {
    const fullMonths = c.lifespan / Math.max(0.4, c.mofaMult || 1);
    const deathYear = Math.floor((fullMonths * 0.4 - START_AGE_MONTHS) / 12) + 1;
    if (deathYear > 4700 && deathYear < 8000 && yr >= 1200) {
      return { label: '末法将至', detail: `灵气将在第四千七百年前后枯竭。以${REALMS[c.realm].name}之寿，约第 ${deathYear} 年便撑不住，等不到第八千年灵潮`, priority: 'warn' };
    }
  }
  const conflict = techAlignmentConflict(c);
  if (conflict.conflict) {
    return { label: '真气相冲', detail: '正邪功法同修，到洞府「功法」里卸下相冲的功法', priority: 'warn' };
  }
  const bn = bottleneckStatus(state);
  if (canBreakthrough(c)) {
    const nextName = REALMS[c.realm + 1]?.name || '更高境界';
    if (bn.ok) {
      return { label: '可以突破了', detail: `到洞府「冲击境界」，迈向${isRealmMaxLayer(c) ? nextName : '下一层'}`, priority: 'primary' };
    }
    return { label: '卡在瓶颈', detail: bn.missing[0].startsWith('如今天地') ? bn.missing[0] : `${bn.missing[0]}（到洞府「参悟」）`, priority: 'warn' };
  }
  if (c.demon >= 50) {
    return { label: '镇压心魔', detail: `当前心魔 ${Math.round(c.demon)}，赴洞府「静心涤魔」或服清心丹`, priority: 'warn' };
  }
  if (!c.sectId && c.realm <= 2 && !(c.sectLeaveUntil && c.age < c.sectLeaveUntil)) {
    return { label: '找个门路', detail: '投身一处门户，能学功法、领差事、换资源', priority: 'normal' };
  }
  const needPill = REALMS[c.realm]?.bottleneck?.needItem;
  if (needPill && isRealmMaxLayer(c) && !hasItem(state, needPill)) {
    const pillName = ITEM_BY_ID[needPill]?.name || needPill;
    return { label: `筹备${pillName}`, detail: `大境在即，可在丹房炼制，或到市集坊间、门户宝库寻「${pillName}」`, priority: 'normal' };
  }
  const reg = REGION_BY_ID[c.regionId] || REGION_BY_ID.qingniu;
  const prog = Math.min(100, Math.round(c.regionProgress?.[reg.id] || 0));
  if (prog < 100) {
    return { label: `走遍${reg.name}`, detail: `已走过 ${prog}%。走遍之后，可采灵脉、下秘境`, priority: 'normal' };
  }
  const nextRegion = REGIONS.find((r) => c.realm >= r.minRealm && !(c.visitedLocations || []).includes(r.name));
  if (nextRegion) {
    return { label: `去${nextRegion.name}`, detail: '那里有新的人、新的事，也有更好的药材和秘境', priority: 'normal' };
  }
  if (c.realm >= 8) {
    return { label: '渡劫证真', detail: '渡过天劫即成真仙，此后长居五域，看纪元更替', priority: 'primary' };
  }
  const era = currentWorldEra(state);
  return { label: '四处走走', detail: '五域各有大事，人在哪里，就能亲眼看见哪里的事', priority: 'normal' };
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
  if (char.equippedTechs.includes(techId)) return { ok: true, already: true, tech, reason: '已在用' };
  const cap = maxTechSlots(char.realm);
  if (char.equippedTechs.length >= cap) {
    return { ok: false, reason: '在用功法已满，请先卸下一部' };
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
  if (idx < 0) return { ok: false, reason: '该功法没有在用' };
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
  const beastBoost = (1 + (sectPerks(char).beast || 0)) * (char.goldenFingerId === 'gf_beast' ? 1.5 : 1);
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
    return { level: 'critical', remainYears, remainMonths, text: '寿元将尽，需尽快破境或寻延寿丹药。' };
  }
  if (remainMonths <= 180 || ratio <= 0.25) {
    return { level: 'warn', remainYears, remainMonths, text: '大限渐近，余寿不足四分之一。' };
  }
  return { level: 'ok', remainYears, remainMonths, text: '' };
}

export function createRun({ seed, name, gender, originId, rootId, goldenFingerId = null, meta = {}, jieshu = 0 }) {
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
    auraStance: gf?.id === 'gf_stealth' ? 'hide' : 'normal',
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
    location: '青石镇',
    regionProgress: { qingniu: 0 },
    visitedLocations: ['青石镇'],
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
    if (ap.pet) { char.petId = ap.pet; char.petLevel = ap.petLevel || 1; }
    if (ap.flag) Object.assign(talentFlags, ap.flag);
  }

  migrateMeta(meta);
  for (const tid of meta.talents || []) {
    const t = TALENT_BY_ID[tid];
    if (!t?.apply) continue;
    const ap = t.apply;
    // v8：天赋分五重，数值随重数放大（一重 ×1 … 五重 ×3）；功法、物品、印记只给一次
    const f = talentScale(talentLevel(meta, tid));
    if (f <= 0) continue;
    if (ap.attrs) for (const [k, v] of Object.entries(ap.attrs)) attrs[k] = (attrs[k] || 0) + Math.round(v * f);
    if (ap.stones) char.stones += Math.round(ap.stones * f);
    if (ap.lifespan) char.bonusLifespan += Math.round(ap.lifespan * f) * 12;
    for (const id of ap.items || []) addItemRaw(char, id, 1);
    for (const tech of ap.techniques || []) addStartingTech(tech);
    if (ap.buffs) for (const [k, v] of Object.entries(ap.buffs)) buffs[k] = (buffs[k] || 0) + v * f;
    if (ap.flag) Object.assign(talentFlags, ap.flag);
  }

  // v8：前世遗泽
  const legacyNotes = [];
  for (const lg of meta.pendingLegacy || []) {
    if (lg.kind === 'tech' && lg.payload) { addStartingTech(lg.payload); legacyNotes.push(`前世功法 ${lg.payload.name}`); }
    if (lg.kind === 'item' && ITEM_BY_ID[lg.id]) { addItemRaw(char, lg.id, 1); legacyNotes.push(`前世遗宝 ${ITEM_BY_ID[lg.id].name}`); }
    if (lg.kind === 'stones') { char.stones += lg.payload?.stones || 0; legacyNotes.push(`前世遗财 ${(lg.payload?.stones || 0).toLocaleString()} 灵石`); }
    if (lg.kind === 'law' && lg.payload?.lawId) { char.laws = { ...(char.laws || {}), [lg.payload.lawId]: Math.max(1, char.laws?.[lg.payload.lawId] || 0) }; legacyNotes.push('前世道韵'); }
  }
  char.jieshu = Math.max(0, Math.min(12, jieshu | 0));

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
    counters: {
      roots_seen: rootsSeen.length, stay_home: 0, laws: 0, delves: 0,
      faceslap_wins: 0, flex_wins: 0, lowkey_wins: 0, elder_slaps: 0, underdog_slaps: 0,
    },
    recent: [],
    achievements: {},
    endings: {},
    buffs,
    combat: null,
    delve: null,
    faceSlap: null,
    faceSlapRecent: [],
    sectBoard: null,
    scene: { id: 'hub', result: null },
    log: [],
    rumors: [],
    stats: {
      actions: 0, breakthroughs: 0, failures: 0, encounters: 0, kills: 0,
      deaths: 0, tribulations: 0, pills: 0, years: 0, events: 0, goldSpent: 0, contribSpent: 0,
    },
    jieshu: char.jieshu,
    legacyNotes,
    // v8：第一百年的世界指标（粮储、路运、号令、组织、堤、船……），每一世重置为剧本起点
    world: freshCentury1World(),
    history: {},
    meta: {
      ...meta,
      pendingLegacy: null,
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
    out.push(`【法则突破】${LAW_BY_ID[lid].name}法则迈入「${LAW_STAGES[c.laws[lid]]}」。`);
    recomputeDerived(c);
    need = 60 * (c.laws[lid] + 1) * (c.laws[lid] + 1);
  }
  state.counters.laws = Object.values(c.laws || {}).reduce((a, b) => a + Number(b || 0), 0);
  return out;
}

/** v8：六维属性上限随境界提高（炼气 40，每高一大境 +20，真仙 220）。反复出现的事件、参悟再多也不会刷到上千。 */
export function attrCap(realm = 0) {
  return 40 + Math.max(0, realm | 0) * 20;
}

export function recomputeDerived(char) {
  if (char.attrs) {
    const cap = attrCap(char.realm);
    for (const k of ATTR_KEYS) if ((char.attrs[k] || 0) > cap) char.attrs[k] = cap;
  }
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
  // v8 末法折寿：灵气低于 50 时，修士寿元随灵气折损，灵气为 0 时只剩四成（凡人不受影响）
  const yearNow = Math.max(1, Math.floor(((char.age ?? START_AGE_MONTHS) - START_AGE_MONTHS) / 12) + 1);
  const Lnow = lingqiAt(yearNow);
  const mofaMult = char.realm >= 1 ? 0.4 + 0.6 * clamp(Lnow / 50, 0, 1) : 1;
  char.mofaMult = mofaMult;
  char.lifespan = Math.max(12 * 30, Math.round((char.lifespanBase + effectiveBonus) * jieshuMods(char.jieshu || 0).lifespanMult * mofaMult));

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
  // v8：天地灵机不足，大境冲不上去（等灵气回升之世）
  const L = lingqiAt(yearOf(state));
  const needL = LINGQI_FOR_REALM[c.realm + 1] ?? 0;
  if (L < needL) {
    missing.push(`如今天地灵气${lingqiWord(L)}，撑不起${REALMS[c.realm + 1]?.name || '下一境'}，要等灵气更足的年月`);
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
    || (talentLevel(state.meta, 't_niming') ? 6 * talentScale(talentLevel(state.meta, 't_niming')) : 0);
  const base = 0.9 - char.realm * 0.058;
  let p = base
    + (root?.breakBonus || 0) / 100
    + Math.min(150, char.attrs.道心 + (tBonus.daoxin || 0)) * 0.003
    + Math.min(120, char.attrs.气运 + (pBonus.luck || 0)) * 0.0016
    + lawBonusSum(char, 'breakBonus') / 100
    + (state.buffs?.breakBonus || 0) / 100
    + permBreak / 100
    + (era.breakBonus || 0) / 100
    - (alignInfo.breakPenalty || 0) / 100
    - char.demon * 0.0045
    - jieshuMods(char.jieshu || 0).breakPenalty / 100
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

/** 修仙面板：每活过一年熟练度 +1，最多 60。 */
export function panelMastery(char) {
  return Math.max(0, Math.min(60, Math.floor(((char?.age || START_AGE_MONTHS) - START_AGE_MONTHS) / 12)));
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
  const jMult = jieshuMods(char.jieshu || 0).speedMult;
  const panel = char.goldenFingerId === 'gf_panel' ? 1 + panelMastery(char) / 100 : 1;
  return Math.max(1, Math.round(base * speed * realm.monthly * demonPenalty * jMult * panel));
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
    if (stipend) { char.stones += stipend; notes.push(`门户月俸 +${stipend} 灵石`); }
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
  // v8：灵气随年代起落。不播报「篇章」，只在灵气明显变了的时候说一句人话
  const chNow = chapterForYear(yearOf(state));
  state.chapterId = chNow.id;
  const wordNow = lingqiWord(lingqiAt(yearOf(state)));
  if (state.lingqiWord && state.lingqiWord !== wordNow) {
    const order = ['断绝', '将尽', '稀薄', '平常', '充沛', '鼎盛'];
    const up = order.indexOf(wordNow) > order.indexOf(state.lingqiWord);
    notes.push(up
      ? `这些年，天地间的灵气一年比一年足（灵气${wordNow}），吐纳比从前快了。`
      : `这些年，天地间的灵气一年比一年薄（灵气${wordNow}），修行比从前慢了。`);
  }
  state.lingqiWord = wordNow;
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
