import { cleanHint } from '../data/events/hintClean.js';
/**
 * 千变因果「打脸·装逼·博弈」动态剧本矩阵引擎（v8.2）：
 *
 * 将「场景原型(32) × 相对境界档位(4: 远高/高于/同境/低于) × 气机姿态(3: 敛息/如常/外放)
 * × 网文出身(11) × 金手指(9) × 地域靠山势力(6) × 同门上官查岗 × 势力威慑度
 * × 恩怨簿登门清算 × 二段护短升级(打了小的来老的)」动态编织为逻辑严密的千万级应对分支。
 *
 * 核心铁律（含 v8.1.1 全部防刷与审计约束）：
 * 1. 严守逻辑合理性：低阶挑衅者敢惹高阶主角，必有敛息未散、返璞归真看不透或仗势眼瞎的合理解释；
 *    主角修为低于对手时，硬亮低修为绝不无脑成功，金手指底牌亦有合理失手概率并转入实战；
 *    同门高阶长老遇本门恶少时走「清理门户 · 上官查岗」，绝不出现把自家太上长老当野散修的逻辑冲突。
 * 2. 靠山势力严格贴合当前五域地理（西陲沙盗不出南泽，芦洲黑风寨不出北境）。
 * 3. 防刷约束：每大境界遇事属性总预算 FS_ATTR_BUDGET = 8（含实战胜果）；短时连惹风头递减；
 *    势力震慑进贡每势力一年冷却；每笔恩怨仅可清算一次。
 * 4. 严格遵守宁朝五域专名，零旧世界禁用词。
 */
import { clamp } from './rng.js';
import { REALMS, realmLabel } from '../data/realms.js';
import { REGION_BY_ID } from '../data/regions.js';
import { sectRankName } from '../data/sects.js';
import { ITEM_BY_ID } from '../data/items.js';
import { ORIGIN_BY_ID } from '../data/origins.js';
import { GOLDEN_FINGER_BY_ID } from '../data/golden_fingers.js';
import {
  AURA_STANCES,
  PROVOKER_SURNAMES,
  PROVOKER_GIVENS,
  PROVOKER_TITLES_BY_CATEGORY,
  BACKING_FACTIONS,
  ORIGIN_COUNTERS,
  GF_COUNTERS,
  FACESLAP_SCENARIOS,
} from '../data/faceSlapScenarios.js';
import {
  perceivedRealmLabel,
  monthlyExp,
  advanceMonths,
  addItem,
  gainExp,
  recomputeDerived,
  activeTechniques,
  yearOf,
} from './state.js';

export { AURA_STANCES };

const REL_LABELS = {
  much_higher: '你远高于对方',
  higher: '你高于对方',
  equal: '双方同境',
  lower: '对方高于你',
};

const TIER_REWARD_MULT = {
  much_higher: 0.9,
  higher: 1.15,
  equal: 1.45,
  lower: 2.1,
};

/** 遇事与盛会共享属性额度：每个大境界至多 +8（各项合计），杜绝任何刷属性漏洞。 */
export const FS_ATTR_BUDGET = 8;
let blockedAttrs = new Set();

export function bumpFaceSlapAttr(game, key, n) {
  const s = game.state;
  const c = s.char;
  if (!n) return 0;
  if (n < 0) { c.attrs[key] = (c.attrs[key] || 0) + n; return n; }
  s.faceSlapAttr = s.faceSlapAttr || {};
  const used = s.faceSlapAttr[c.realm] || 0;
  const give = Math.max(0, Math.min(n, FS_ATTR_BUDGET - used));
  if (give < n) blockedAttrs.add(key);
  if (!give) return 0;
  s.faceSlapAttr[c.realm] = used + give;
  c.attrs[key] = (c.attrs[key] || 0) + give;
  return give;
}

export function remainingAttrBudget(state) {
  const used = state?.faceSlapAttr?.[state?.char?.realm || 0] || 0;
  return Math.max(0, FS_ATTR_BUDGET - used);
}

/** 风头：短时间里连着惹事，敢来的多是没油水的小角色，所得递减；每半年消退一档。 */
export function heatOf(state) {
  const h = state.faceSlapHeat;
  if (!h) return 0;
  return Math.max(0, h.v - Math.max(0, (state.char.age - h.at) / 6));
}

/**
 * 场景前提：写到「你家祖田」「当年驱逐你的山门」「你的月例」的场景，主角得真有这段过去、这个身份，
 * 否则就是凭空编造。once：这类旧怨一世只翻一次，不会隔几年就冒出一个新的「当年恶少」。
 */
const HOME_REGIONS = ['qingniu', 'luoxia'];
// 孤儿、魔道遗孤没有可争的祖产，皇子的家业不是乡下祠堂与祖田
const hasFamily = (c) => !['orphan', 'demon_child', 'royal'].includes(c.originId);
const sectJunior = (c, maxRank) => Boolean(c.sectId && c.sectId !== 'sanxiu' && c.sectId !== 'player_sect' && (c.sectRank || 0) <= maxRank);
const SCENARIO_GATES = {
  fs_02_clan_seize_field: { once: true, ok: (c) => hasFamily(c) && HOME_REGIONS.includes(c.regionId) },
  fs_04_heirloom_extortion: { once: true, ok: (c) => c.originId !== 'orphan' },
  fs_09_spirit_stone_mock: { ok: (c) => (c.realm || 0) <= 1 },
  fs_10_steward_dock_stipend: { ok: (c) => sectJunior(c, 1) },
  fs_11_arena_challenge_trap: { ok: (c) => sectJunior(c, 1) },
  fs_12_scripture_pavilion_block: { ok: (c) => sectJunior(c, 2) },
  fs_29_hometown_ferry_scorn: { once: true, ok: (c) => HOME_REGIONS.includes(c.regionId) },
  fs_30_former_bully_reunion: { once: true, ok: () => true },
  fs_31_ancestral_hall_reckoning: { once: true, ok: (c) => hasFamily(c) && HOME_REGIONS.includes(c.regionId) },
  fs_32_expelled_sect_return: { once: true, ok: (c) => (c.betrayCount || 0) > 0 || Object.keys(c.sectBlacklist || {}).length > 0 },
};
function scenarioAllowed(state, sc) {
  const gate = SCENARIO_GATES[sc.id];
  if (!gate) return true;
  if (gate.once && (state.faceSlapOnce || []).includes(sc.id)) return false;
  return gate.ok(state.char);
}

/** 风波升级（护短长老现身）：有家底撑腰的更爱喊人，看不出深浅的毛头小子多半没人管。 */
function escalateRoll(game, fs, base) {
  const adj = fs?.motive === 'backed' ? 0.2 : fs?.motive === 'blind' ? -0.15 : 0;
  return game.rng.chance(clamp(base + adj, 0.05, 0.9));
}

function interp(tpl, vars) {
  if (!tpl) return '';
  let out = String(tpl);
  for (const [k, v] of Object.entries(vars)) {
    out = out.replaceAll(`{${k}}`, String(v ?? ''));
  }
  return out;
}

/** 按当前地域挑选合乎五域地理的靠山势力。 */
function pickBackingForRegion(regionId, rng) {
  const local = BACKING_FACTIONS.filter((b) => Array.isArray(b.homeRegions) && b.homeRegions.includes(regionId));
  if (local.length) return rng.pick(local);
  return rng.pick(BACKING_FACTIONS);
}

/** 势力威慑度读写（打了对方小辈 +1、收拾了护短长老 +2）。 */
export function getFactionDread(state, backingId) {
  return Number(state?.factionDread?.[backingId]) || 0;
}

export function addFactionDread(state, backingId, delta = 1) {
  if (!state || !backingId || !delta) return 0;
  state.factionDread = state.factionDread || {};
  state.factionDread[backingId] = clamp((state.factionDread[backingId] || 0) + delta, 0, 20);
  return state.factionDread[backingId];
}

/** 恩怨簿：记下一笔未报之仇（最多保留 12 笔待清算，避免存档膨胀）。 */
export function recordGrudge(state, fs, reason = '旧日受辱') {
  if (!state || !fs || fs.isGrudge) return null;
  state.grudges = Array.isArray(state.grudges) ? state.grudges : [];
  const unsettled = state.grudges.filter((g) => g.status === 'owe');
  if (unsettled.some((g) => g.provokerName === fs.provokerName && g.backingId === fs.backingId)) return null;
  const sc = FACESLAP_SCENARIOS.find((x) => x.id === fs.scenarioId) || FACESLAP_SCENARIOS[0];
  const entry = {
    id: `gr_${state.turn}_${state.grudges.length}`,
    provokerName: fs.provokerName,
    provokerTitle: fs.provokerTitle,
    provokerRealm: fs.provokerRealm,
    provokerRealmLabel: fs.provokerRealmLabel,
    backingId: fs.backingId,
    scenarioId: fs.scenarioId,
    scenarioTitle: sc.title,
    loc: fs.loc,
    regionId: state.char.regionId || 'qingniu',
    year: yearOf(state),
    atAge: state.char.age,
    playerRealmThen: state.char.realm,
    reason,
    status: 'owe',
  };
  state.grudges.push(entry);
  // 保持未清算条目不超过 12 条
  while (state.grudges.filter((g) => g.status === 'owe').length > 12) {
    const idx = state.grudges.findIndex((g) => g.status === 'owe');
    if (idx >= 0) state.grudges.splice(idx, 1);
    else break;
  }
  return entry;
}

/** 仇人也会老死：按其境界寿元，记仇时大约还剩六成寿数，过了就不在人世了。 */
export function expireGrudges(state) {
  const out = [];
  for (const g of state?.grudges || []) {
    if (g.status !== 'owe') continue;
    const years = ((state.char?.age || 0) - (g.atAge || 0)) / 12;
    const left = (REALMS[g.provokerRealm || 0]?.lifespan || 120) * 0.6;
    if (years > left) {
      g.status = 'expired';
      g.expiredYear = yearOf(state);
      out.push(g);
    }
  }
  return out;
}

export function settleGrudge(state, grudgeId) {
  if (!state || !grudgeId || !Array.isArray(state.grudges)) return null;
  const g = state.grudges.find((x) => x.id === grudgeId && x.status === 'owe');
  if (!g) return null;
  g.status = 'settled';
  g.settledYear = yearOf(state);
  state.counters.revenge_wins = (state.counters.revenge_wins || 0) + 1;
  return g;
}

/** 评估主角在同境界中的底蕴分（0–100）：用于同境气势碾压与越阶疑兵判定。 */
export function foundationScore(state) {
  const c = state.char;
  let score = 15;
  if (c.daoBaseQuality === 'tiandao') score += 22;
  else if (c.daoBaseQuality === 'shang') score += 12;
  if (c.goldenCoreQuality === 'jiuwen') score += 22;
  else if (c.goldenCoreQuality === 'shang') score += 12;
  score += Math.min(20, (c.artifactLevel || 0) * 3);
  score += Math.min(14, (c.attrs.道心 || 0) * 0.25);
  score += Math.min(12, (c.attrs.神识 || 0) * 0.2);
  const topGrade = activeTechniques(c).reduce((m, t) => {
    const g = { 凡: 1, 黄: 2, 玄: 4, 地: 7, 天: 11, 仙: 16 }[t.grade] || 2;
    return Math.max(m, g);
  }, 0);
  score += topGrade;
  if (c.reputation >= 300) score += 8;
  if (c.goldenFingerId && c.goldenFingerId !== 'gf_none') score += 6;
  return clamp(Math.round(score), 0, 100);
}

/** 计算挑衅者相对主角的境界档位与合理境界值。 */
function rollProvokerTier(char, rng, forceRelTier = null) {
  const stance = char.auraStance || 'normal';
  const r = char.realm || 0;
  const layer = char.layer || 0;

  let weights;
  if (r >= 9) {
    weights = [
      { id: 'much_higher', w: 56 },
      { id: 'higher', w: 30 },
      { id: 'equal', w: 14 },
    ];
  } else if (r === 0) {
    weights = [
      { id: 'much_higher', w: layer >= 4 ? (stance === 'hide' ? 28 : 18) : 8 },
      { id: 'higher', w: layer >= 2 ? 26 : 14 },
      { id: 'equal', w: 42 },
      { id: 'lower', w: stance === 'show' ? 28 : 20 },
    ];
  } else if (stance === 'hide') {
    weights = [
      { id: 'much_higher', w: 40 },
      { id: 'higher', w: 32 },
      { id: 'equal', w: 17 },
      { id: 'lower', w: 11 },
    ];
  } else if (stance === 'show') {
    weights = [
      { id: 'much_higher', w: 14 },
      { id: 'higher', w: 18 },
      { id: 'equal', w: 40 },
      { id: 'lower', w: 28 },
    ];
  } else {
    weights = [
      { id: 'much_higher', w: 24 },
      { id: 'higher', w: 26 },
      { id: 'equal', w: 30 },
      { id: 'lower', w: 20 },
    ];
  }

  const relTier = forceRelTier && (r < 9 || forceRelTier !== 'lower')
    ? forceRelTier
    : rng.weighted(weights, (x) => x.w).id;

  let provokerRealm = r;
  let provokerRealmLabel = REALMS[r]?.name || '炼气';
  if (relTier === 'much_higher') {
    if (r === 0) {
      provokerRealm = 0;
      provokerRealmLabel = layer >= 5 ? '炼气一层' : '凡俗武夫';
    } else if (r === 1) {
      provokerRealm = 0;
      provokerRealmLabel = '炼气中期';
    } else {
      const drop = rng.int(2, Math.min(4, r));
      provokerRealm = Math.max(0, r - drop);
      provokerRealmLabel = `${REALMS[provokerRealm].name}${provokerRealm === 0 ? '后期' : '初期'}`;
    }
  } else if (relTier === 'higher') {
    if (r === 0) {
      provokerRealm = 0;
      provokerRealmLabel = layer >= 3 ? `炼气${['一', '二', '三', '四', '五'][Math.max(0, layer - 2)] || '二'}层` : '炼气一层';
    } else {
      provokerRealm = r - 1;
      provokerRealmLabel = `${REALMS[provokerRealm].name}${provokerRealm === 0 ? '圆满' : '后期'}`;
    }
  } else if (relTier === 'equal') {
    provokerRealm = r;
    provokerRealmLabel = r === 0
      ? `炼气${REALMS[0].layerNames[clamp(layer, 0, 8)]}`
      : (r === 9 ? '同阶真仙' : `${REALMS[r].name}中期`);
  } else {
    provokerRealm = Math.min(9, r + 1);
    provokerRealmLabel = `${REALMS[provokerRealm].name}${provokerRealm === 9 ? '' : '初期'}`;
  }

  return { relTier, provokerRealm, provokerRealmLabel };
}

/** 比较主角与任意目标境界的相对档位。 */
export function compareRealmTier(char, targetRealm) {
  const diff = (char.realm || 0) - targetRealm;
  if (diff >= 2) return 'much_higher';
  if (diff === 1) return 'higher';
  if (diff === 0) return 'equal';
  return 'lower';
}

/** 主动或狭路相逢发起「恩怨簿 · 登门清算」重逢遭遇。 */
export function startGrudgeRevenge(game, grudgeId, { returnTo = 'grudgeBook', note = null } = {}) {
  const s = game.state;
  const c = s.char;
  expireGrudges(s);
  const g = (s.grudges || []).find((x) => x.id === grudgeId && x.status === 'owe');
  if (!g) return null;
  const backing = BACKING_FACTIONS.find((b) => b.id === g.backingId) || BACKING_FACTIONS[0];
  const sc = FACESLAP_SCENARIOS.find((x) => x.id === g.scenarioId) || FACESLAP_SCENARIOS[0];
  const relTier = compareRealmTier(c, g.provokerRealm);
  const elderRealm = Math.min(9, g.provokerRealm + 1);
  const elderRealmLabel = `${REALMS[elderRealm].name}${elderRealm === 9 ? '' : '中期'}`;
  blockedAttrs = new Set();

  s.faceSlap = {
    scenarioId: sc.id,
    stage: 'junior',
    context: 'revenge',
    returnTo,
    isGrudge: true,
    grudgeId: g.id,
    grudgeYear: g.year,
    grudgeReason: g.reason,
    loc: g.loc,
    provokerName: g.provokerName,
    provokerTitle: g.provokerTitle,
    provokerRealm: g.provokerRealm,
    provokerRealmLabel: g.provokerRealmLabel,
    relTier,
    stance: c.auraStance || 'normal',
    seenRealm: perceivedRealmLabel(c),
    backingId: backing.id,
    elderRealm,
    elderRealmLabel,
    elderRelTier: compareRealmTier(c, elderRealm),
    raisedStakes: true,
    evidenceHeld: true,
    note: Array.isArray(note) && note.length ? note.filter(Boolean) : null,
  };
  s.scene = { id: 'faceSlap', result: null };
  s.stats.events++;
  s.stats.encounters = (s.stats.encounters || 0) + 1;
  game.pushLog(`恩怨清算 · 重逢${g.provokerName}`);
  return s.faceSlap;
}

/** 构造「恩怨簿」子界面节点：可查看所有未报旧怨并主动登门算账，亦可查阅六大靠山威慑度。 */
export function buildGrudgeBookNode(game) {
  const s = game.state;
  const c = s.char;
  expireGrudges(s);
  const pending = (s.grudges || []).filter((g) => g.status === 'owe');
  const settled = (s.grudges || []).filter((g) => g.status === 'settled');
  const expired = (s.grudges || []).filter((g) => g.status === 'expired');
  const dreadList = BACKING_FACTIONS
    .map((b) => ({ b, d: getFactionDread(s, b.id) }))
    .filter((x) => x.d > 0)
    .map(({ b, d }) => `${b.name}：${d >= 4 ? `闻风丧胆(${d})` : d >= 2 ? `颇为忌惮(${d})` : `略有耳闻(${d})`}`);

  const choices = pending.map((g) => {
    const tier = compareRealmTier(c, g.provokerRealm);
    const backing = BACKING_FACTIONS.find((b) => b.id === g.backingId);
    return {
      id: `revenge_${g.id}`,
      label: `登门清算 · ${g.provokerName}（${g.provokerRealmLabel} · ${REL_LABELS[tier]}）`,
      hint: `第${g.year}年于${g.loc}（${backing?.name || '旧怨'}）· 一月 · 一了百了`,
      action: 'grudgeRevenge',
      params: { grudgeId: g.id },
      effect: tier === 'much_higher' || tier === 'higher' ? 'primary' : '',
    };
  });
  choices.push({ id: 'back_city', label: '合上恩怨簿', hint: '返回市集坊间', action: 'openCity' });

  const bodyLines = [
    pending.length
      ? `簿上尚有 ${pending.length} 笔未报之账。当年修为未足暂且忍下，如今随时可登门清算（每笔旧账仅可清算一次）。`
      : '眼下恩怨簿干干净净，尚无未了之仇。若日后遇事暂避或一时失手，皆会记入此簿，留待来日翻盘。',
    settled.length ? `已了结旧怨：${settled.length} 笔。` : '',
    expired.length ? `仇家已寿终、无从清算：${expired.slice(-3).map((g) => g.provokerName).join('、')}${expired.length > 3 ? ` 等 ${expired.length} 人` : ''}。` : '',
    dreadList.length ? `\n【五域靠山威慑】\n${dreadList.join('　·　')}` : '\n【五域靠山威慑】各地门阀与恶霸尚未尝过你的厉害。',
  ].filter(Boolean);

  return {
    id: 'grudgeBook',
    title: '恩怨簿',
    text: bodyLines.join('\n'),
    choices,
    subhub: true,
  };
}

/** 动态生成一场网文打脸/装逼遭遇，写入 state.faceSlap 并打开 faceSlap 场景。 */
export function startFaceSlapEncounter(game, {
  context = 'explore',
  returnTo = 'hub',
  forceRelTier = null,
  forceScenarioId = null,
  note = null,
} = {}) {
  const s = game.state;
  const c = s.char;
  const rng = game.rng;
  const region = REGION_BY_ID[c.regionId] || REGION_BY_ID.qingniu;

  // 若无指定场景/档位，在当地有超过 1 年的未报旧怨且你如今不弱于对方时，18% 概率自然触发「狭路相逢」
  if (!forceRelTier && !forceScenarioId && Array.isArray(s.grudges)) {
    expireGrudges(s);
    const due = s.grudges.filter((g) => g.status === 'owe' && g.regionId === region.id && c.age - (g.atAge || 0) >= 12 && c.realm >= g.provokerRealm);
    if (due.length && rng.chance(0.18)) {
      const pickedG = rng.pick(due);
      return startGrudgeRevenge(game, pickedG.id, { returnTo, note });
    }
  }

  let scenario = forceScenarioId ? FACESLAP_SCENARIOS.find((x) => x.id === forceScenarioId) : null;
  if (!scenario) {
    const recent = s.faceSlapRecent || [];
    let pool = FACESLAP_SCENARIOS.filter((sc) => {
      if (sc.minRealm != null && c.realm < sc.minRealm) return false;
      if (sc.maxRealm != null && c.realm > sc.maxRealm) return false;
      if (sc.regions && !sc.regions.includes(region.id)) return false;
      if (sc.contexts && !sc.contexts.includes(context)) return false;
      return scenarioAllowed(s, sc);
    });
    if (!pool.length) {
      pool = FACESLAP_SCENARIOS.filter((sc) => (sc.minRealm ?? 0) <= c.realm && c.realm <= (sc.maxRealm ?? 9) && scenarioAllowed(s, sc));
    }
    if (!pool.length) pool = FACESLAP_SCENARIOS.filter((sc) => !SCENARIO_GATES[sc.id]);
    const fresh = pool.filter((sc) => !recent.includes(sc.id));
    scenario = rng.pick(fresh.length ? fresh : pool);
  }
  s.faceSlapRecent = [scenario.id, ...(s.faceSlapRecent || []).filter((id) => id !== scenario.id)].slice(0, 12);
  if (SCENARIO_GATES[scenario.id]?.once) s.faceSlapOnce = [...new Set([...(s.faceSlapOnce || []), scenario.id])];
  s.faceSlapHeat = { v: heatOf(s) + 1, at: c.age };
  blockedAttrs = new Set();

  const { relTier, provokerRealm, provokerRealmLabel } = rollProvokerTier(c, rng, forceRelTier);
  const backing = pickBackingForRegion(region.id, rng);
  const titlePool = PROVOKER_TITLES_BY_CATEGORY[scenario.category] || ['狂妄修士'];
  const provokerTitle = rng.pick(titlePool);
  const provokerName = rng.pick(PROVOKER_SURNAMES) + rng.pick(PROVOKER_GIVENS);
  const landmark = region.landmarks?.length ? rng.pick(region.landmarks) : region.name;
  const loc = `${region.name}·${landmark}`;
  const seenRealm = perceivedRealmLabel(c);
  const stance = c.auraStance || 'normal';

  const elderRealm = Math.min(9, provokerRealm + 1);
  const elderRealmLabel = `${REALMS[elderRealm].name}${elderRealm === 9 ? '' : '中期'}`;
  // 没敛息却被修为更低的人挑衅，必须有个说得通的缘由：要么境界差太远看不出深浅，要么家底厚有恃无恐
  let motive = null;
  if (stance !== 'hide' && (relTier === 'much_higher' || relTier === 'higher')) {
    const gap = (c.realm || 0) - provokerRealm;
    motive = gap >= 2 && rng.chance(provokerRealm === 0 ? 0.7 : 0.5) ? 'blind' : 'backed';
  }

  s.faceSlap = {
    scenarioId: scenario.id,
    motive,
    stage: 'junior',
    context,
    returnTo,
    isGrudge: false,
    grudgeId: null,
    loc,
    provokerName,
    provokerTitle,
    provokerRealm,
    provokerRealmLabel,
    relTier,
    stance,
    seenRealm,
    backingId: backing.id,
    elderRealm,
    elderRealmLabel,
    elderRelTier: compareRealmTier(c, elderRealm),
    raisedStakes: false,
    evidenceHeld: false,
    note: Array.isArray(note) && note.length ? note.filter(Boolean) : null,
  };
  s.scene = { id: 'faceSlap', result: null };
  s.stats.events++;
  s.stats.encounters = (s.stats.encounters || 0) + 1;
  game.pushLog(`遇事 · ${scenario.title}`);
  return s.faceSlap;
}

function templateVars(game, fs) {
  const s = game.state;
  const c = s.char;
  const sc = FACESLAP_SCENARIOS.find((x) => x.id === fs.scenarioId) || FACESLAP_SCENARIOS[0];
  const backing = BACKING_FACTIONS.find((b) => b.id === fs.backingId) || BACKING_FACTIONS[0];
  return {
    name: c.name,
    realm: realmLabel(c),
    seenRealm: fs.seenRealm || perceivedRealmLabel(c),
    loc: fs.loc,
    provoker: fs.provokerName,
    provokerTitle: fs.provokerTitle,
    provokerRealm: fs.provokerRealmLabel,
    backing: backing.name,
    elderTitle: backing.elderTitle,
    elderRealm: fs.elderRealmLabel,
    crowd: sc.crowd,
    stakes: sc.stakes,
    sect: game.currentSectName(),
    rank: c.sectId ? (c.sectId === 'player_sect' ? '开山祖师' : sectRankName(c.sectId, c.sectRank || 0)) : '散修',
  };
}

function rewardScale(game, fs, extraMult = 1) {
  const c = game.state.char;
  const pm = REALMS[c.realm]?.powerMult || 1;
  const tierMult = TIER_REWARD_MULT[fs.stage === 'elder' ? fs.elderRelTier : fs.relTier] || 1;
  const heatMult = fs.isGrudge ? 1.15 : Math.max(0.3, 1 - 0.14 * heatOf(game.state));
  const stakeMult = (fs.raisedStakes ? 1.45 : 1) * (fs.stage === 'elder' ? 1.55 : 1) * extraMult * heatMult;
  return {
    stones: Math.round((85 + c.realm * 50) * Math.pow(pm, 0.5) * tierMult * stakeMult),
    exp: Math.round(monthlyExp(game.state) * (1.1 + c.realm * 0.12) * tierMult * stakeMult),
    rep: Math.round((16 + c.realm * 8) * tierMult * stakeMult),
  };
}

function hasIdentityClout(state) {
  const c = state.char;
  return Boolean(c.playerSectName || (c.sectId && c.sectId !== 'sanxiu' && (c.sectRank || 0) >= 2) || c.reputation >= 200 || (c.titles || []).length >= 2);
}

/** 检测主角是否就是对方所倚仗靠山的本门上官（消除自家门下把太上长老当野散修的逻辑冲突）。 */
function isSameSectBoss(state, backing) {
  const c = state.char;
  return Boolean(backing?.sectId && c.sectId === backing.sectId && (c.sectRank || 0) >= 2);
}

/** 构造动态遇事节点（包含阶段一挑衅者、旧怨清算 & 阶段二护短长老）。 */
// 遇事选项的提示同样只写做法与考验，不写结果
export function buildFaceSlapNode(game) {
  const node = buildFaceSlapNodeRaw(game);
  if (node?.choices) for (const ch of node.choices) if (typeof ch.hint === 'string') ch.hint = cleanHint(ch.hint);
  return node;
}

function buildFaceSlapNodeRaw(game) {
  const s = game.state;
  const c = s.char;
  const fs = s.faceSlap;
  if (!fs) return null;
  const sc = FACESLAP_SCENARIOS.find((x) => x.id === fs.scenarioId) || FACESLAP_SCENARIOS[0];
  const backing = BACKING_FACTIONS.find((b) => b.id === fs.backingId) || BACKING_FACTIONS[0];
  const vars = templateVars(game, fs);
  const origin = ORIGIN_BY_ID[c.originId];
  const gf = c.goldenFingerId ? GOLDEN_FINGER_BY_ID[c.goldenFingerId] : null;
  const originCounter = ORIGIN_COUNTERS[c.originId];
  const gfCounter = c.goldenFingerId ? GF_COUNTERS[c.goldenFingerId] : null;
  const sameBoss = isSameSectBoss(s, backing);
  const dread = getFactionDread(s, backing.id);
  const isHide = (c.auraStance || 'normal') === 'hide';

  // —— 阶段二：打了小的，老的护短出场 ——
  if (fs.stage === 'elder') {
    const eTier = compareRealmTier(c, fs.elderRealm);
    fs.elderRelTier = eTier;
    const stanceName = AURA_STANCES[c.auraStance || 'normal']?.name || '顺其自然';
    const intro = interp(backing.escalateIntro, vars);
    const dreadHint = dread >= 3 ? `\n\n人群里已有门客认出你的眉眼，贴在${backing.elderTitle}耳边急声低语，那老者的眉头当即皱成一团。` : '';
    const bossHint = sameBoss ? `\n\n偏巧你本就是「${vars.sect}」的【${vars.rank}】，这位${backing.elderTitle}见了你也得行礼。` : '';
    const body = `${intro}\n\n来者修为约在【${fs.elderRealmLabel}】（${REL_LABELS[eTier]}），你此刻气机为「${stanceName}」${isHide ? `（对外只显${fs.seenRealm}）` : ''}。${fs.evidenceHeld ? '\n\n刚才你早把那小辈自曝的把柄一字不落留在了众人耳中。' : ''}${dreadHint}${bossHint}`;

    const choices = [];
    if (sameBoss) {
      choices.push({
        id: 'fs_elder_boss',
        label: `【清理门户】亮出「${vars.sect}·${vars.rank}」本门印信斥责`,
        hint: '本门上官当面 · 护短长老反手拿人谢罪',
        action: 'faceSlapResolve',
        params: { tactic: 'elder_boss' },
        effect: 'primary',
      });
    }
    choices.push({
      id: 'fs_elder_show',
      label: isHide
        ? (eTier === 'much_higher' || eTier === 'higher'
          ? `散去敛息，以${realmLabel(c)}威压直视来者`
          : `散去敛息，放出${realmLabel(c)}气势对峙`)
        : (eTier === 'much_higher' || eTier === 'higher'
          ? `一步踏出，以${realmLabel(c)}威压直视来者`
          : `不退半步，放出${realmLabel(c)}气势对峙`),
      hint: eTier === 'much_higher'
        ? '绝对压制 · 来者看清你的境界当场变色'
        : eTier === 'higher'
          ? '境界压制 · 震慑护短长老赔罪'
          : eTier === 'equal'
            ? '同境拼底蕴 · 根基够厚则直压其势'
            : '对方高你一境 · 硬亮修为未必压得住，小心翻脸',
      action: 'faceSlapResolve',
      params: { tactic: 'elder_show' },
      effect: !sameBoss && (eTier === 'much_higher' || eTier === 'higher') ? 'primary' : '',
    });
    if (fs.evidenceHeld || c.attrs.悟性 >= 14) {
      choices.push({
        id: 'fs_elder_expose',
        label: fs.evidenceHeld ? '当众抖出方才套出的把柄，以理压人' : '当着满场众人点破其门中丑闻，借舆论逼退',
        hint: fs.evidenceHeld ? '证据确凿 · 靠山反而不敢护短' : '悟性/名望博弈 · 逼对方息事宁人',
        action: 'faceSlapResolve',
        params: { tactic: 'elder_expose' },
      });
    }
    if (gfCounter) {
      choices.push({
        id: 'fs_elder_gf',
        label: `【${gf?.name || '金手指'}】${gfCounter.label}`,
        hint: eTier === 'lower' ? `以底牌搏杀机应对${backing.elderTitle}（高一境有失手可能）` : `亮出压箱底牌应对${backing.elderTitle}`,
        action: 'faceSlapResolve',
        params: { tactic: 'elder_gf' },
        effect: !sameBoss && eTier === 'lower' ? 'primary' : '',
      });
    }
    if (hasIdentityClout(s) && !sameBoss) {
      choices.push({
        id: 'fs_elder_clout',
        label: `亮出「${c.playerSectName ? `${c.playerSectName}祖师` : (c.sectId && c.sectId !== 'sanxiu' ? `${game.currentSectName()}·${sectRankName(c.sectId, c.sectRank || 0)}` : c.titles[c.titles.length - 1] || '五域威名')}」身份`,
        hint: '以势压势 · 让对方掂量掂量分量',
        action: 'faceSlapResolve',
        params: { tactic: 'elder_clout' },
      });
    }
    choices.push(
      {
        id: 'fs_elder_fight',
        label: '连老的一块教训 · 直接动手',
        hint: eTier === 'lower' ? `越阶硬战【${fs.elderRealmLabel}】· 胜则名震一域` : `实战交锋【${fs.elderRealmLabel}】· 彻底打服`,
        action: 'faceSlapResolve',
        params: { tactic: 'elder_fight' },
      },
      {
        id: 'fs_elder_leave',
        label: '见好就收，拱手退场',
        hint: '保全已得之利，不与老辈死磕',
        action: 'faceSlapResolve',
        params: { tactic: 'elder_leave' },
      },
    );
    return {
      id: 'faceSlap',
      title: `${backing.elderTitle}现身`,
      text: body,
      choices,
    };
  }

  // —— 阶段一：初遇挑衅 / 恩怨清算重逢 ——
  const rTier = fs.relTier;
  const isHiddenTrick = fs.stance === 'hide' && (rTier === 'much_higher' || rTier === 'higher');
  const provokeKey = isHiddenTrick
    ? 'hidden'
    : (rTier === 'much_higher' || rTier === 'higher')
      ? 'blind'
      : rTier === 'equal'
        ? 'peer'
        : 'bully';

  let setupText;
  let provokeText;
  if (fs.isGrudge) {
    setupText = `冤家路窄。你在${fs.loc}迎面撞见了第${fs.grudgeYear}年曾让你吃瘪的${fs.provokerTitle}「${fs.provokerName}」。他如今修为仍在【${fs.provokerRealmLabel}】，而你已是【${realmLabel(c)}】（${REL_LABELS[rTier]}）。`;
    provokeText = rTier === 'much_higher' || rTier === 'higher'
      ? `「是你？」${fs.provokerName}先是一愣，随即看清你周身深不可测的气机，手里茶盏咔嚓掉在地上，嘴唇哆嗦着往后退了半步。`
      : `「哟，这不是当年那个手下败将吗？」${fs.provokerName}嗤笑一声，抱着胳膊挡在街心，「怎么，今天还想再讨一顿打？」`;
  } else {
    setupText = interp(sc.setup, vars);
    provokeText = interp(sc.provokeLine[provokeKey], vars);
  }

  let stanceNote;
  if (fs.stance === 'hide') {
    if (rTier === 'lower') {
      stanceNote = c.goldenFingerId === 'gf_stealth'
        ? `对方修为约在【${fs.provokerRealmLabel}】（高你一境），但凭「龟息藏锋诀」竟瞒过了对方大半神识，他只当你是【${fs.seenRealm}】的寻常散修。`
        : `你虽开启了「敛息藏锋」，但对方【${fs.provokerRealmLabel}】高你一筹，一眼便看穿了你的真实底细。`;
    } else {
      stanceNote = `你此刻「敛息藏锋」，外人眼中只见你【${fs.seenRealm}】的微弱气机。对方真实修为约在【${fs.provokerRealmLabel}】（${REL_LABELS[rTier]}）。`;
    }
  } else if (fs.motive === 'blind') {
    stanceNote = fs.stance === 'show'
      ? `你虽威压外放，可对方修为不过【${fs.provokerRealmLabel}】，与你差得太远，反倒感应不出深浅，只当你是个故作姿态的过路人。`
      : `对方修为不过【${fs.provokerRealmLabel}】，与你差得太远，根本看不出你的深浅，只当你是寻常过路人。`;
  } else if (fs.motive === 'backed') {
    stanceNote = `对方修为约在【${fs.provokerRealmLabel}】（${REL_LABELS[rTier]}），${fs.stance === 'show' ? '分明被你的威压逼得脸色发白' : '看得出你修为不浅'}，却仗着「${backing.name}」家大业大，腰间还挂着长辈赐的护身玉符，认定没人敢动他。`;
  } else if (fs.stance === 'show') {
    stanceNote = `你此刻「威压外放」，修为毫无遮掩。对方修为约在【${fs.provokerRealmLabel}】（${REL_LABELS[rTier]}），仍仗着「${backing.name}」的势头挑衅。`;
  } else {
    stanceNote = `对方修为约在【${fs.provokerRealmLabel}】（${REL_LABELS[rTier]}），背后牵着「${backing.name}」的招牌。`;
  }

  const dreadText = dread >= 4
    ? (isHide
      ? `\n\n你早已打得「${backing.name}」闻风丧胆，只是此刻你敛息换了气机，这蠢货压根没认出眼前就是自家谈之色变的狠人。`
      : `\n\n话才出口，旁边的随从猛地拉住${fs.provokerName}衣袖尖声颤道：「少爷别说了，这人好像就是把咱们靠山收拾惨了的${c.name}。」`)
    : dread >= 2
      ? `\n\n「${backing.name}」近来已被你教训过几回，对方身旁有眼尖的门客隐隐觉得你面熟，神色有些发虚。`
      : '';

  const choices = [];

  // 特殊分支 A：同门上官清理门户（零逻辑冲突！）
  if (sameBoss) {
    choices.push({
      id: 'fs_boss',
      label: `【清理门户】亮出「${vars.sect}·${vars.rank}」本门印信`,
      hint: '这蠢材竟拿你自家门户的招牌来压你 · 当场拿人问责',
      action: 'faceSlapResolve',
      params: { tactic: 'same_boss' },
      effect: 'primary',
    });
  }

  // 特殊分支 B：威慑满级不战而屈（有 1 年冷却防刷）
  const canDreadTribute = dread >= 4 && !fs.isGrudge && c.age >= (s.factionTributeAt?.[backing.id] || 0);
  if (canDreadTribute) {
    choices.push({
      id: 'fs_dread',
      label: isHide ? `轻笑报出「${c.name}」大名，揭破伪装` : `冷声反问：「连${backing.name}的长老见我都得让路，你算什么东西？」`,
      hint: `「${backing.name}」对你已闻风丧胆（威慑 ${dread}）· 不战而屈`,
      action: 'faceSlapResolve',
      params: { tactic: 'dread_name' },
      effect: !sameBoss ? 'primary' : '',
    });
  }

  choices.push(
    {
      id: 'fs_lowkey',
      label: rTier === 'much_higher' || rTier === 'higher'
        ? (isHide ? '继续敛息装弱，诱他抬高赌注再反手收网' : '骤然收起气机示弱，诱他抬高赌注再反手收网')
        : '收起锋芒示弱套话，暗记对方破绽与把柄',
      hint: rTier === 'much_higher' || rTier === 'higher'
        ? '扮猪吃虎 · 先忍一手'
        : '隐匿锋芒 · 智谋检定，避实击虚',
      action: 'faceSlapResolve',
      params: { tactic: 'lowkey' },
      effect: !sameBoss && !canDreadTribute && isHiddenTrick ? 'primary' : '',
    },
    {
      id: 'fs_show',
      label: rTier === 'much_higher'
        ? `${isHide ? '散去敛息，' : '一步踏出，'}展露${realmLabel(c)}真境威压`
        : rTier === 'higher'
          ? `${isHide ? '散去敛息，' : '散开气机，'}以${realmLabel(c)}修为直接压场`
          : rTier === 'equal'
            ? `亮出${realmLabel(c)}气息与一身底蕴正面硬压`
            : `硬顶着对方威压，亮出${realmLabel(c)}气势寸步不让`,
      hint: rTier === 'much_higher'
        ? '降维震慑 · 无需出手'
        : rTier === 'higher'
          ? '高一境压制 · 直接震退对方赔礼'
          : rTier === 'equal'
            ? `同境拼根基（当前底蕴 ${foundationScore(s)}）· 够厚则气势直压`
            : '修为低于对方 · 硬亮境界极易激怒对方开打，除非底蕴惊人',
      action: 'faceSlapResolve',
      params: { tactic: 'show' },
      effect: !sameBoss && !canDreadTribute && !isHiddenTrick && (rTier === 'much_higher' || rTier === 'higher') ? 'primary' : '',
    },
  );

  if (originCounter) {
    choices.push({
      id: 'fs_origin',
      label: `【${origin?.trope || origin?.name || '出身'}】${originCounter.label}`,
      hint: originCounter.hint,
      action: 'faceSlapResolve',
      params: { tactic: 'origin' },
    });
  }

  if (gfCounter) {
    choices.push({
      id: 'fs_gf',
      label: `【${gf?.name || '机缘'}】${gfCounter.label}`,
      hint: rTier === 'lower' ? `${gfCounter.hint}（高一境约半数压得住，失手转斗法）` : gfCounter.hint,
      action: 'faceSlapResolve',
      params: { tactic: 'gf' },
      effect: !sameBoss && rTier === 'lower' ? 'primary' : '',
    });
  }

  if (hasIdentityClout(s) && !sameBoss) {
    const idLabel = c.playerSectName
      ? `${c.playerSectName}开山祖师`
      : (c.sectId && c.sectId !== 'sanxiu' && (c.sectRank || 0) >= 2
        ? `${game.currentSectName()}·${sectRankName(c.sectId, c.sectRank)}`
        : (c.titles[c.titles.length - 1] || '名震五域'));
    choices.push({
      id: 'fs_clout',
      label: `亮出「${idLabel}」身份令牌`,
      hint: '以门户威望与爵位反压对方靠山',
      action: 'faceSlapResolve',
      params: { tactic: 'clout' },
    });
  }

  choices.push(
    {
      id: 'fs_fight',
      label: rTier === 'much_higher' ? '懒得多言，反手一招教他做人' : rTier === 'lower' ? '不服便战，越阶一搏' : '废话少说，手底下见真章',
      hint: rTier === 'much_higher'
        ? `实战碾压【${fs.provokerRealmLabel}】· 几乎一招毙敌`
        : rTier === 'lower'
          ? `高危越阶斗法【${fs.provokerRealmLabel}】· 胜则轰动全场`
          : `进入斗法【${fs.provokerRealmLabel}】· 胜夺彩头`,
      action: 'faceSlapResolve',
      params: { tactic: 'fight' },
    },
    {
      id: 'fs_walk',
      label: rTier === 'much_higher' || rTier === 'higher' ? '淡然一笑，懒得与蝼蚁置气' : '暂避锋芒，记入恩怨簿转身离去',
      hint: rTier === 'much_higher' || rTier === 'higher' ? '不动干戈 · 稳固道心' : '记下此人姓名与靠山，来日破境登门清算',
      action: 'faceSlapResolve',
      params: { tactic: 'walk' },
    },
  );

  const heatNote = !fs.isGrudge && heatOf(s) >= 3 ? '\n\n（你近来接连惹事，坊间已认得你，敢凑上来的多是没什么油水的小角色。）' : '';
  const noteText = fs.note ? `${fs.note.join('\n')}\n\n` : '';
  return {
    id: 'faceSlap',
    title: fs.isGrudge ? `冤家路窄` : sc.title,
    text: `${noteText}${setupText}\n\n${provokeText}\n\n${stanceNote}${dreadText}${heatNote}`,
    choices,
  };
}

function finalizeFaceSlap(game, { text, lines = [], fx = null, escalate = false, victory = false }) {
  const s = game.state;
  const fs = s.faceSlap;
  if (blockedAttrs.size) {
    const re = new RegExp(`[，、]?(${[...blockedAttrs].join('|')}) \\+\\d+`, 'g');
    lines = lines.map((l) => l.replace(re, '').replace(/：，/g, '：').replace(/，。/g, '。').replace(/：。/g, '。'));
  }
  blockedAttrs = new Set();

  if (victory && fs) {
    addFactionDread(s, fs.backingId, fs.stage === 'elder' ? 2 : 1);
    if (fs.isGrudge && fs.grudgeId && !escalate) {
      const doneG = settleGrudge(s, fs.grudgeId);
      if (doneG) lines.push(`【旧怨了结】当年第${doneG.year}年之辱已连本带利讨回。`);
    }
  }

  if (escalate && fs && fs.stage === 'junior') {
    fs.stage = 'elder';
    s.scene.result = {
      text: `${text}\n\n然而风波尚未平息——人群外忽然传来一声怒喝，对方的靠山闻讯赶来了。`,
      lines,
      fx,
      returnTo: 'faceSlap',
    };
  } else {
    const ret = fs?.returnTo || 'hub';
    s.faceSlap = null;
    s.scene.result = {
      text,
      lines,
      fx,
      returnTo: ret,
    };
  }
  game.afterAction();
  game.emit();
}

function maybeLootItem(game, fs, chance = 0.38) {
  if (!game.rng.chance(chance)) return null;
  const region = REGION_BY_ID[game.state.char.regionId] || REGION_BY_ID.qingniu;
  const pool = region.exploreRewards?.length ? region.exploreRewards : ['lingcao', 'yinqi_dan'];
  const id = game.rng.pick(pool);
  if (!ITEM_BY_ID[id]) return null;
  addItem(game.state, id, 1);
  return ITEM_BY_ID[id].name;
}

function launchFaceSlapCombat(game, fs, sc, backing, isElder = false, introLines = []) {
  const s = game.state;
  const c = s.char;
  const vars = templateVars(game, fs);
  const targetRealm = isElder ? fs.elderRealm : fs.provokerRealm;
  const relTier = isElder ? fs.elderRelTier : fs.relTier;
  const baseEnemyId = isElder ? (backing.enemyId || 'jindan_elder') : (sc.enemyId || 'cultivator');
  const displayName = isElder ? `${backing.name}·${backing.elderTitle}` : `${fs.provokerTitle}·${fs.provokerName}`;

  let scaleMult = 1.0;
  if (relTier === 'much_higher') scaleMult = c.realm === 0 ? 0.55 : 0.72;
  else if (relTier === 'higher') scaleMult = 0.88;
  else if (relTier === 'equal') scaleMult = 1.02;
  else if (relTier === 'lower') scaleMult = 0.62;

  const rew = rewardScale(game, fs, isElder ? 1.2 : 1.0);
  const shouldEscalate = !isElder && sc.canEscalate && !fs.isGrudge && escalateRoll(game, fs, 0.42);
  const winBody = isElder
    ? `${interp(backing.elderFightText, vars)}\n\n连靠山都被你当场打服，四周${sc.crowd}鸦雀无声，再无人敢轻视你半分。`
    : interp(sc.fightWin, vars);
  const loseBody = isElder
    ? `${backing.elderTitle}终究高出一筹，一掌将你震退十丈。你借势抽身脱困，将这笔账与「${backing.name}」一并记在心底。`
    : `${interp(sc.fightLose, vars)}\n\n你将${fs.provokerName}的面孔与「${backing.name}」记入了恩怨簿。`;

  // 严格遵守 v8.1.1 属性大境总额度（FS_ATTR_BUDGET = 8）
  const winDaoxin = relTier === 'lower' ? Math.min(2, remainingAttrBudget(s)) : 0;

  return game.startCombat({
    enemy: baseEnemyId,
    matchRealm: targetRealm,
    scaleMult,
    displayName,
    win: {
      text: winBody,
      effects: {
        stones: rew.stones,
        exp: rew.exp,
        reputation: rew.rep,
        attrs: winDaoxin > 0 ? { 道心: winDaoxin } : {},
        counter: isElder
          ? { faceslap_wins: 1, elder_slaps: 1, ...(relTier === 'lower' ? { underdog_slaps: 1 } : {}) }
          : { faceslap_wins: 1, ...(relTier === 'lower' ? { underdog_slaps: 1 } : {}) },
      },
      faceSlapAttrSpend: winDaoxin,
      faceSlapDread: { backingId: backing.id, delta: isElder ? 2 : 1 },
      faceSlapSettleGrudge: fs.isGrudge ? fs.grudgeId : null,
      faceSlapEscalate: shouldEscalate,
      faceSlapClear: !shouldEscalate,
      returnTo: shouldEscalate ? 'faceSlap' : (fs.returnTo || 'hub'),
      fx: 'breakthrough',
      log: isElder ? `当众击败护短的${backing.elderTitle}` : `在${sc.title}中教训了${fs.provokerName}`,
    },
    lose: {
      text: loseBody,
      effects: {
        injury: 1,
        reputation: -Math.round(rew.rep * 0.3),
      },
      faceSlapRecordGrudge: !isElder && !fs.isGrudge ? '斗法吃瘪' : null,
      faceSlapClear: true,
      returnTo: fs.returnTo || 'hub',
    },
  }, {
    lines: [
      ...introLines.filter(Boolean),
      `【${sc.title}】${displayName}（${isElder ? fs.elderRealmLabel : fs.provokerRealmLabel}）出手袭来。`,
    ],
  });
}

/** 处理玩家在动态遇事中的任意策略选择。 */
export function resolveFaceSlapChoice(game, tactic) {
  const s = game.state;
  const c = s.char;
  const fs = s.faceSlap;
  if (!fs) return game.act_backHub();
  const sc = FACESLAP_SCENARIOS.find((x) => x.id === fs.scenarioId) || FACESLAP_SCENARIOS[0];
  const backing = BACKING_FACTIONS.find((b) => b.id === fs.backingId) || BACKING_FACTIONS[0];
  const vars = templateVars(game, fs);
  const fScore = foundationScore(s);
  const dread = getFactionDread(s, backing.id);
  const dreadEdge = dread >= 2 ? 0.12 : 0;
  const lines = advanceMonths(s, 1, game.rng);

  // ==================== 阶段二：护短长老应对 ====================
  if (fs.stage === 'elder') {
    const eTier = fs.elderRelTier;
    const rew = rewardScale(game, fs, 1.15);

    if (tactic === 'elder_boss' && isSameSectBoss(s, backing)) {
      c.stones += rew.stones;
      c.reputation += Math.round(rew.rep * 1.2);
      c.contribution += 120 + (c.sectRank || 0) * 60;
      s.counters.faceslap_wins = (s.counters.faceslap_wins || 0) + 1;
      s.counters.flex_wins = (s.counters.flex_wins || 0) + 1;
      s.counters.elder_slaps = (s.counters.elder_slaps || 0) + 1;
      lines.push(`【清理门户】护短执事当场拿人请罪：灵石 +${rew.stones.toLocaleString()}，声望 +${Math.round(rew.rep * 1.2)}，门户贡献 +${120 + (c.sectRank || 0) * 60}。`);
      return finalizeFaceSlap(game, {
        text: `你神色冷淡，直接亮出「${vars.sect}·${vars.rank}」本门印信。${backing.elderTitle}定睛一看，吓得魂飞魄散，当场跪地叩首：「属下该死，不知是${vars.rank}亲临微服巡查。」说罢反手封住${fs.provokerName}气海，押着人连连赔礼请罪。`,
        lines,
        fx: 'breakthrough',
        victory: true,
      });
    }

    if (tactic === 'elder_leave') {
      lines.push('你收起战利品从容离去，道心 +1。');
      bumpFaceSlapAttr(game, '道心', 1);
      return finalizeFaceSlap(game, {
        text: `你扫了一眼气势汹汹的${backing.elderTitle}，拱手一笑：「小辈无礼，我已替贵方管教过了。后会有期。」说罢御风离去，留下一地目瞪口呆的看客。`,
        lines,
      });
    }

    if (tactic === 'elder_fight') {
      return launchFaceSlapCombat(game, fs, sc, backing, true);
    }

    if (tactic === 'elder_show') {
      if (eTier === 'much_higher' || eTier === 'higher' || (eTier === 'equal' && fScore + dread * 4 >= 52)) {
        c.stones += rew.stones;
        c.reputation += rew.rep;
        const gotExp = gainExp(s, Math.round(rew.exp * 0.6));
        bumpFaceSlapAttr(game, '道心', 2);
        s.counters.faceslap_wins = (s.counters.faceslap_wins || 0) + 1;
        s.counters.flex_wins = (s.counters.flex_wins || 0) + 1;
        s.counters.elder_slaps = (s.counters.elder_slaps || 0) + 1;
        const loot = maybeLootItem(game, fs, 0.55);
        lines.push(`护短长老跪服赔礼：灵石 +${rew.stones.toLocaleString()}，声望 +${rew.rep}，修为 +${gotExp.toLocaleString()}，道心 +2${loot ? `，额外奉上「${loot}」×1` : ''}。`);
        game.pushRumor(`【五域风闻】「${c.name}」在${fs.loc}以${realmLabel(c)}威压震服${backing.name}${backing.elderTitle}，逼得对方自掌小辈赔罪。`);
        return finalizeFaceSlap(game, {
          text: interp(backing.elderKneelText, vars),
          lines,
          fx: 'breakthrough',
          victory: true,
        });
      }
      if (eTier === 'lower' && fScore >= 72 && game.rng.chance(0.55 + dreadEdge)) {
        c.reputation += rew.rep;
        bumpFaceSlapAttr(game, '道心', 3);
        s.counters.faceslap_wins = (s.counters.faceslap_wins || 0) + 1;
        s.counters.elder_slaps = (s.counters.elder_slaps || 0) + 1;
        lines.push(`你一身惊人底蕴竟震得高阶长老疑心背后有大能护道，对方惊疑退走。声望 +${rew.rep}，道心 +3。`);
        return finalizeFaceSlap(game, {
          text: `你虽境界略逊，但放出那一缕纯厚无比的道基威压与杀伐锋芒，反倒让${backing.elderTitle}神色骤变——他以为你是某位隐世老怪的亲传，硬生生咽下怒火，拎着${fs.provokerName}灰溜溜退走。`,
          lines,
          fx: 'breakthrough',
          victory: true,
        });
      }
      return launchFaceSlapCombat(game, fs, sc, backing, true, [`${backing.elderTitle}冷笑一声：「区区${realmLabel(c)}，也敢在老夫面前摆架子。」`]);
    }

    if (tactic === 'elder_expose') {
      const p = fs.evidenceHeld ? 0.94 : clamp(0.48 + (c.attrs.悟性 || 0) * 0.012 + (c.reputation > 100 ? 0.12 : 0) + dreadEdge, 0.35, 0.92);
      if (game.rng.chance(p)) {
        c.stones += rew.stones;
        c.reputation += Math.round(rew.rep * 1.2);
        bumpFaceSlapAttr(game, '悟性', 1);
        s.counters.faceslap_wins = (s.counters.faceslap_wins || 0) + 1;
        s.counters.lowkey_wins = (s.counters.lowkey_wins || 0) + 1;
        s.counters.elder_slaps = (s.counters.elder_slaps || 0) + 1;
        lines.push(`当众抖出把柄，${backing.elderTitle}颜面扫地赔礼息事：灵石 +${rew.stones.toLocaleString()}，声望 +${Math.round(rew.rep * 1.2)}，悟性 +1。`);
        return finalizeFaceSlap(game, {
          text: `你神色从容，当着${sc.crowd}的面将方才${fs.provokerName}倚势压人、私吞灵资的丑事一字不差道出。人群顿时哗然议论。${backing.elderTitle}脸色青一阵白一阵，怕把事情闹到上头耳朵里，当众甩了${fs.provokerName}一记耳光，塞给你一袋封口灵石匆匆离去。`,
          lines,
          fx: 'alchemy',
          victory: true,
        });
      }
      return launchFaceSlapCombat(game, fs, sc, backing, true, [`${backing.elderTitle}恼羞成怒，喝道：「休要血口喷人，先拿你封口再说。」`]);
    }

    if (tactic === 'elder_clout') {
      const cloutPower = (c.playerSectName ? 4 : 0) + (c.sectRank || 0) + (c.reputation >= 400 ? 2 : 0);
      const ok = eTier !== 'lower' || cloutPower >= 4 || game.rng.chance(0.55 + dreadEdge);
      if (ok) {
        c.stones += Math.round(rew.stones * 0.85);
        c.reputation += rew.rep;
        s.counters.faceslap_wins = (s.counters.faceslap_wins || 0) + 1;
        s.counters.flex_wins = (s.counters.flex_wins || 0) + 1;
        s.counters.elder_slaps = (s.counters.elder_slaps || 0) + 1;
        lines.push(`亮明尊位，对方连声告罪退去：灵石 +${Math.round(rew.stones * 0.85).toLocaleString()}，声望 +${rew.rep}。`);
        return finalizeFaceSlap(game, {
          text: `你冷哼一声，随手抛出一枚沉甸甸的身份令牌。${backing.elderTitle}接过一看，瞳孔猛地一缩，刚才的滔天气焰顷刻散尽，当即把${fs.provokerName}按着头向你鞠躬赔罪，双手奉上厚礼。`,
          lines,
          fx: 'breakthrough',
          victory: true,
        });
      }
      return launchFaceSlapCombat(game, fs, sc, backing, true, [`${backing.elderTitle}扫了一眼令牌，阴冷道：「少拿外头名号吓人，今日照拿不误。」`]);
    }

    if (tactic === 'elder_gf') {
      const gfC = GF_COUNTERS[c.goldenFingerId];
      if (!gfC) return launchFaceSlapCombat(game, fs, sc, backing, true);
      const gfP = { much_higher: 1, higher: 0.95, equal: 0.75, lower: 0.45 }[eTier] ?? 0.75;
      if (!game.rng.chance(clamp(gfP + dreadEdge * 0.5, 0.35, 1))) {
        return launchFaceSlapCombat(game, fs, sc, backing, true, [`你亮出压箱底牌，却被见多识广的${backing.elderTitle}硬生生挡下，对方冷笑着欺身压来。`]);
      }
      const text = interp(gfC.successLines[eTier] || gfC.successLines.equal, vars);
      c.stones += Math.round(rew.stones * (gfC.bonus?.stonesMult || 1));
      c.reputation += rew.rep + (gfC.bonus?.reputation || 10);
      const gotExp = gainExp(s, Math.round(rew.exp * (gfC.bonus?.expMult || 0.7)));
      if (gfC.bonus?.daoxin) bumpFaceSlapAttr(game, '道心', gfC.bonus.daoxin);
      if (gfC.bonus?.demon) c.demon = clamp(c.demon + gfC.bonus.demon, 0, 100);
      s.counters.faceslap_wins = (s.counters.faceslap_wins || 0) + 1;
      s.counters.elder_slaps = (s.counters.elder_slaps || 0) + 1;
      if (eTier === 'lower') s.counters.underdog_slaps = (s.counters.underdog_slaps || 0) + 1;
      const loot = maybeLootItem(game, fs, 0.5);
      lines.push(`底牌镇服护短长老：灵石 +${Math.round(rew.stones * (gfC.bonus?.stonesMult || 1)).toLocaleString()}，声望 +${rew.rep + (gfC.bonus?.reputation || 10)}，修为 +${gotExp.toLocaleString()}${loot ? `，获得「${loot}」×1` : ''}。`);
      return finalizeFaceSlap(game, {
        text: `${text}\n\n${interp(gfC.crowdReact, vars)} ${backing.elderTitle}见势不妙，哪还敢护短，赔了灵石带着小辈狼狈遁走。`,
        lines,
        fx: 'breakthrough',
        victory: true,
      });
    }
  }

  // ==================== 阶段一：初遇挑衅应对 ====================
  const rTier = fs.relTier;

  // 特殊策略 A：同门上官清理门户
  if (tactic === 'same_boss' && isSameSectBoss(s, backing)) {
    const rew = rewardScale(game, fs, 1.05);
    c.stones += rew.stones;
    c.reputation += Math.round(rew.rep * 1.15);
    c.contribution += 80 + (c.sectRank || 0) * 40;
    s.counters.faceslap_wins = (s.counters.faceslap_wins || 0) + 1;
    s.counters.flex_wins = (s.counters.flex_wins || 0) + 1;
    lines.push(`【清理门户】你亮明本门「${vars.rank}」身份，对方当场瘫软：灵石 +${rew.stones.toLocaleString()}，声望 +${Math.round(rew.rep * 1.15)}，门户贡献 +${80 + (c.sectRank || 0) * 40}。`);
    return finalizeFaceSlap(game, {
      text: `你没有动怒，只慢条斯理从腰间解下「${vars.sect}·${vars.rank}」的纯金印信拍在桌上：「拿我${vars.sect}的招牌在外面欺男霸女，谁给你的胆子？」\n\n${fs.provokerName}看清印信品阶，脸色瞬间惨白如纸，扑通一声跪倒在地，把方才讹诈旁人的灵石全数吐了出来。四周${sc.crowd}一片叫好。`,
      lines,
      fx: 'breakthrough',
      victory: true,
    });
  }

  // 特殊策略 B：靠山威慑满级，报出名号不战而屈（1 年冷却防刷）
  if (tactic === 'dread_name' && dread >= 4) {
    s.factionTributeAt = s.factionTributeAt || {};
    s.factionTributeAt[backing.id] = c.age + 12;
    const rew = rewardScale(game, fs, 0.9);
    c.stones += rew.stones;
    c.reputation += rew.rep;
    s.counters.faceslap_wins = (s.counters.faceslap_wins || 0) + 1;
    s.counters.flex_wins = (s.counters.flex_wins || 0) + 1;
    lines.push(`【闻风丧胆】报出「${c.name}」名号不战而屈：灵石 +${rew.stones.toLocaleString()}，声望 +${rew.rep}。`);
    return finalizeFaceSlap(game, {
      text: `你轻笑一声，淡淡报出名号：「${c.name}。」\n\n短短二字落地，${fs.provokerName}如遭五雷轰顶——「${backing.name}」内部早已把你的画像传遍，千叮万嘱见了你立刻绕道。那人腿软得站都站不稳，颤抖着奉上一袋压惊灵石，连滚带爬逃出十丈开外。`,
      lines,
      fx: 'breakthrough',
      victory: true,
    });
  }

  if (tactic === 'walk') {
    bumpFaceSlapAttr(game, '道心', 1);
    if (rTier === 'much_higher' || rTier === 'higher') {
      lines.push('你不屑与井蛙纠缠，拂袖而去，道心 +1。');
      return finalizeFaceSlap(game, {
        text: `你看了${fs.provokerName}一眼，像看一只在靴尖乱蹦的蚂蚱，轻轻摇头转身离开。人群中有几位眼毒的老修士却猛地一凛，暗暗记下了你方才那一闪而逝的深不可测。`,
        lines,
      });
    }
    const gEntry = recordGrudge(s, fs, '昔日暂避锋芒');
    lines.push(`审时度势暂避锋芒，道心 +1。${gEntry ? `已将「${fs.provokerName}」记入恩怨簿，来日可登门清算。` : ''}`);
    return finalizeFaceSlap(game, {
      text: `你压下心头火气，淡然退后一步转身离去。身后传来${fs.provokerName}的嗤笑，你把这张脸与「${backing.name}」一并记入恩怨簿——修行路长，来日方长。`,
      lines,
    });
  }

  if (tactic === 'fight') {
    return launchFaceSlapCombat(game, fs, sc, backing, false);
  }

  // 策略 1：隐匿修为 / 扮猪吃虎
  if (tactic === 'lowkey') {
    if (rTier === 'much_higher' || rTier === 'higher') {
      fs.raisedStakes = true;
      fs.evidenceHeld = true;
      const rew = rewardScale(game, fs, 1.25);
      c.stones += rew.stones;
      c.reputation += rew.rep;
      const gotExp = gainExp(s, Math.round(rew.exp * 0.65));
      bumpFaceSlapAttr(game, '道心', 1);
      s.counters.faceslap_wins = (s.counters.faceslap_wins || 0) + 1;
      s.counters.lowkey_wins = (s.counters.lowkey_wins || 0) + 1;
      const loot = maybeLootItem(game, fs, 0.48);
      const shouldEscalate = sc.canEscalate && !fs.isGrudge && escalateRoll(game, fs, 0.45);
      lines.push(`【扮猪吃虎】诱敌加码后反手掀桌：灵石 +${rew.stones.toLocaleString()}，声望 +${rew.rep}，修为 +${gotExp.toLocaleString()}，道心 +1${loot ? `，顺走战利「${loot}」×1` : ''}。`);
      game.pushRumor(`【五域风闻】「${c.name}」在${fs.loc}扮猪吃虎，把「${backing.name}」的${fs.provokerName}坑得颜面尽失、血本无归。`);
      return finalizeFaceSlap(game, {
        text: interp(sc.lowkeyWin, vars),
        lines,
        fx: 'alchemy',
        escalate: shouldEscalate,
        victory: true,
      });
    }
    const p = clamp(0.46 + (c.attrs.悟性 || 0) * 0.01 + (c.attrs.神识 || 0) * 0.008 + (c.goldenFingerId === 'gf_stealth' ? 0.2 : 0) + dreadEdge, 0.3, 0.92);
    if (game.rng.chance(p)) {
      fs.evidenceHeld = true;
      const rew = rewardScale(game, fs, 0.95);
      c.stones += rew.stones;
      c.reputation += Math.round(rew.rep * 0.85);
      bumpFaceSlapAttr(game, '悟性', 1);
      bumpFaceSlapAttr(game, '神识', 1);
      s.counters.faceslap_wins = (s.counters.faceslap_wins || 0) + 1;
      s.counters.lowkey_wins = (s.counters.lowkey_wins || 0) + 1;
      lines.push(`【藏锋智取】示弱套出对方破绽反客为主：灵石 +${rew.stones.toLocaleString()}，声望 +${Math.round(rew.rep * 0.85)}，悟性 +1，神识 +1。`);
      return finalizeFaceSlap(game, {
        text: `你故意露出一副怯懦模样，几句话便哄得自负的${fs.provokerName}洋洋得意，竟当着${sc.crowd}把自家私下克扣、违规越界的话全秃噜了出来。你随即淡笑着收好话柄与赌注，气得他脸色铁青却投鼠忌器，只能眼睁睁看着你满载而归。`,
        lines,
        fx: 'alchemy',
        victory: true,
      });
    }
    bumpFaceSlapAttr(game, '道心', 2);
    recordGrudge(s, fs, '套话未成');
    lines.push('对方老奸巨猾识破了你的试探，你顺势抽身退走，道心 +2。');
    return finalizeFaceSlap(game, {
      text: `${fs.provokerName}虽狂却不傻，察觉你在套话，冷哼一声拂袖作罢。你虽未讨到彩头，却把他的功法路数与名字暗暗记了下来。`,
      lines,
    });
  }

  // 策略 2：显露修为 / 威压镇场
  if (tactic === 'show') {
    if (rTier === 'much_higher') {
      const rew = rewardScale(game, fs, 1.05);
      c.stones += rew.stones;
      c.reputation += Math.round(rew.rep * 1.25);
      bumpFaceSlapAttr(game, '道心', 1);
      s.counters.faceslap_wins = (s.counters.faceslap_wins || 0) + 1;
      s.counters.flex_wins = (s.counters.flex_wins || 0) + 1;
      const loot = maybeLootItem(game, fs, 0.35);
      const shouldEscalate = sc.canEscalate && !fs.isGrudge && escalateRoll(game, fs, 0.45);
      lines.push(`【绝对威压】全场跪服赔礼：灵石 +${rew.stones.toLocaleString()}，声望 +${Math.round(rew.rep * 1.25)}，道心 +1${loot ? `，赔礼「${loot}」×1` : ''}。`);
      game.pushRumor(`【五域风闻】${fs.loc}有不长眼之辈冲撞了${realmLabel(c)}大修「${c.name}」，仅凭一缕威压便跪地求饶。`);
      return finalizeFaceSlap(game, {
        text: interp(sc.showWin.much_higher, vars),
        lines,
        fx: 'breakthrough',
        escalate: shouldEscalate,
        victory: true,
      });
    }
    if (rTier === 'higher') {
      const rew = rewardScale(game, fs, 1.0);
      c.stones += rew.stones;
      c.reputation += rew.rep;
      const gotExp = gainExp(s, Math.round(rew.exp * 0.45));
      s.counters.faceslap_wins = (s.counters.faceslap_wins || 0) + 1;
      s.counters.flex_wins = (s.counters.flex_wins || 0) + 1;
      const loot = maybeLootItem(game, fs, 0.35);
      const shouldEscalate = sc.canEscalate && !fs.isGrudge && escalateRoll(game, fs, 0.4);
      lines.push(`【高境压制】对方脸色剧变赔礼退让：灵石 +${rew.stones.toLocaleString()}，声望 +${rew.rep}，修为 +${gotExp.toLocaleString()}${loot ? `，获得「${loot}」×1` : ''}。`);
      return finalizeFaceSlap(game, {
        text: interp(sc.showWin.higher, vars),
        lines,
        fx: 'breakthrough',
        escalate: shouldEscalate,
        victory: true,
      });
    }
    if (rTier === 'equal') {
      const winAuraChance = clamp(0.25 + (fScore - 30) * 0.012 + dreadEdge, 0.18, 0.9);
      if (game.rng.chance(winAuraChance)) {
        const rew = rewardScale(game, fs, 1.15);
        c.stones += rew.stones;
        c.reputation += Math.round(rew.rep * 1.15);
        const gotExp = gainExp(s, Math.round(rew.exp * 0.55));
        bumpFaceSlapAttr(game, '道心', 2);
        s.counters.faceslap_wins = (s.counters.faceslap_wins || 0) + 1;
        s.counters.flex_wins = (s.counters.flex_wins || 0) + 1;
        const shouldEscalate = sc.canEscalate && !fs.isGrudge && escalateRoll(game, fs, 0.35);
        lines.push(`【同境碾压】你一身浑厚底蕴（${fScore}）生生压垮同境对手：灵石 +${rew.stones.toLocaleString()}，声望 +${Math.round(rew.rep * 1.15)}，修为 +${gotExp.toLocaleString()}，道心 +2。`);
        return finalizeFaceSlap(game, {
          text: interp(sc.showWin.equal, vars),
          lines,
          fx: 'breakthrough',
          escalate: shouldEscalate,
          victory: true,
        });
      }
      return launchFaceSlapCombat(game, fs, sc, backing, false, [`双方同境气势相撞，势均力敌。${fs.provokerName}冷笑拔兵，当场要与你手底下见真章。`]);
    }
    if (fScore >= 65 && game.rng.chance(0.45 + dreadEdge)) {
      const rew = rewardScale(game, fs, 1.1);
      c.reputation += rew.rep;
      bumpFaceSlapAttr(game, '道心', 3);
      s.counters.faceslap_wins = (s.counters.faceslap_wins || 0) + 1;
      s.counters.underdog_slaps = (s.counters.underdog_slaps || 0) + 1;
      lines.push(`【以弱慑强】你虽低一境，却凭惊人根基与道心震慑对方生疑：声望 +${rew.rep}，道心 +3。`);
      return finalizeFaceSlap(game, {
        text: `你明知境界不如对方，却毫不退缩地放出${realmLabel(c)}气息。${fs.provokerName}刚要嗤笑，忽然被你气息中那股远超同阶的凝练杀意刺得心头一跳——以为你身怀绝世秘宝或大能护道，竟硬生生刹住脚步，丢下一句场面话灰溜溜退了出去。`,
        lines,
        fx: 'breakthrough',
        victory: true,
      });
    }
    return launchFaceSlapCombat(game, fs, sc, backing, false, [`${fs.provokerName}感应到你区区${realmLabel(c)}的修为，仰头大笑：「低我一境也敢在我面前放肆？」话音未落便已抢攻过来。`]);
  }

  // 策略 3：出身专属流派破局
  if (tactic === 'origin') {
    const oc = ORIGIN_COUNTERS[c.originId];
    if (!oc) return launchFaceSlapCombat(game, fs, sc, backing, false);
    const attrVal = c.attrs[oc.attrKey] || 10;
    const baseP = rTier === 'much_higher' ? 0.98 : rTier === 'higher' ? 0.92 : rTier === 'equal' ? 0.72 : 0.52;
    const p = clamp(baseP + attrVal * 0.006 + dreadEdge, 0.4, 0.99);
    if (game.rng.chance(p)) {
      const rew = rewardScale(game, fs, oc.bonus?.stonesMult || 1.1);
      c.stones += rew.stones;
      c.reputation += rew.rep + (oc.bonus?.reputation || 12);
      const gotExp = gainExp(s, Math.round(rew.exp * 0.6));
      if (oc.bonus?.daoxin) bumpFaceSlapAttr(game, '道心', oc.bonus.daoxin);
      if (oc.bonus?.attrGain) bumpFaceSlapAttr(game, oc.attrKey, oc.bonus.attrGain);
      s.counters.faceslap_wins = (s.counters.faceslap_wins || 0) + 1;
      if (rTier === 'lower') s.counters.underdog_slaps = (s.counters.underdog_slaps || 0) + 1;
      const loot = maybeLootItem(game, fs, 0.42);
      const shouldEscalate = sc.canEscalate && !fs.isGrudge && escalateRoll(game, fs, 0.38);
      lines.push(`【出身破局】灵石 +${rew.stones.toLocaleString()}，声望 +${rew.rep + (oc.bonus?.reputation || 12)}，修为 +${gotExp.toLocaleString()}${loot ? `，另获「${loot}」×1` : ''}。`);
      return finalizeFaceSlap(game, {
        text: `${interp(oc.successLines[rTier] || oc.successLines.equal, vars)}\n\n${interp(oc.crowdReact, vars)}`,
        lines,
        fx: 'breakthrough',
        escalate: shouldEscalate,
        victory: true,
      });
    }
    return launchFaceSlapCombat(game, fs, sc, backing, false, [interp(oc.failLine, vars)]);
  }

  // 策略 4：金手指降维打脸
  if (tactic === 'gf') {
    const gc = GF_COUNTERS[c.goldenFingerId];
    if (!gc) return launchFaceSlapCombat(game, fs, sc, backing, false);
    const gfP = { much_higher: 1, higher: 0.95, equal: 0.8, lower: 0.5 }[rTier] ?? 0.8;
    if (!game.rng.chance(clamp(gfP + dreadEdge * 0.5, 0.35, 1))) {
      return launchFaceSlapCombat(game, fs, sc, backing, false, ['你亮出了压箱底牌，对方却仗着修为不吃这一套，冷笑着直接动手。']);
    }
    const rew = rewardScale(game, fs, gc.bonus?.stonesMult || 1.2);
    c.stones += rew.stones;
    c.reputation += rew.rep + (gc.bonus?.reputation || 15);
    const gotExp = gainExp(s, Math.round(rew.exp * (gc.bonus?.expMult || 0.75)));
    if (gc.bonus?.daoxin) bumpFaceSlapAttr(game, '道心', gc.bonus.daoxin);
    if (gc.bonus?.demon) c.demon = clamp(c.demon + gc.bonus.demon, 0, 100);
    s.counters.faceslap_wins = (s.counters.faceslap_wins || 0) + 1;
    if (c.goldenFingerId === 'gf_stealth') s.counters.lowkey_wins = (s.counters.lowkey_wins || 0) + 1;
    else s.counters.flex_wins = (s.counters.flex_wins || 0) + 1;
    if (rTier === 'lower') s.counters.underdog_slaps = (s.counters.underdog_slaps || 0) + 1;
    const loot = maybeLootItem(game, fs, 0.5);
    const shouldEscalate = sc.canEscalate && !fs.isGrudge && c.goldenFingerId !== 'gf_stealth' && escalateRoll(game, fs, 0.36);
    lines.push(`【机缘显威】灵石 +${rew.stones.toLocaleString()}，声望 +${rew.rep + (gc.bonus?.reputation || 15)}，修为 +${gotExp.toLocaleString()}${loot ? `，额外所得「${loot}」×1` : ''}。`);
    game.pushRumor(`【五域风闻】「${c.name}」在${fs.loc}以惊人手段压倒${fs.provokerName}，满堂皆惊。`);
    return finalizeFaceSlap(game, {
      text: `${interp(gc.successLines[rTier] || gc.successLines.equal, vars)}\n\n${interp(gc.crowdReact, vars)}`,
      lines,
      fx: 'breakthrough',
      escalate: shouldEscalate,
      victory: true,
    });
  }

  // 策略 5：身份威望压人
  if (tactic === 'clout') {
    const rankPower = (c.playerSectName ? 5 : 0) + (c.sectRank || 0) + (c.reputation >= 300 ? 2 : 0);
    const ok = rTier !== 'lower' || rankPower >= 4 || game.rng.chance(0.5 + dreadEdge);
    if (ok) {
      const rew = rewardScale(game, fs, 0.95);
      c.stones += rew.stones;
      c.reputation += rew.rep;
      s.counters.faceslap_wins = (s.counters.faceslap_wins || 0) + 1;
      s.counters.flex_wins = (s.counters.flex_wins || 0) + 1;
      lines.push(`【身份压场】对方听闻你的名号当场怂了：灵石 +${rew.stones.toLocaleString()}，声望 +${rew.rep}。`);
      return finalizeFaceSlap(game, {
        text: `你神色不变，随手亮出「${vars.sect}·${vars.rank}」的身份信物。${fs.provokerName}原本还拿「${backing.name}」压人，定睛一看你的令牌顿时腿脚一软，先前跟着起哄的随从更是齐齐后退两步，乖乖奉上赔礼灵石连声告罪。`,
        lines,
        fx: 'breakthrough',
        victory: true,
      });
    }
    return launchFaceSlapCombat(game, fs, sc, backing, false, [`${fs.provokerName}不屑地哼了一声：「拿外头的虚名来压我？先接我一招再说。」`]);
  }

  recomputeDerived(c);
  return finalizeFaceSlap(game, { text: '一场风波就此落幕。', lines });
}
