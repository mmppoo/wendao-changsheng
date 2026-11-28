/**
 * 千变因果「打脸·装逼·博弈」动态剧本矩阵引擎（v8.1）：
 *
 * 将「场景原型(32) × 相对境界档位(4: 远高/高于/同境/低于) × 气机姿态(3: 敛息/如常/外放)
 * × 网文出身(11) × 金手指(9) × 靠山势力(6) × 宗门/身份/根基 × 二段护短升级(打了小的来老的)」
 * 动态编织为逻辑严密、文风凝练的千万级网文应对分支。
 *
 * 核心铁律：
 * 1. 严守逻辑合理性：低阶挑衅者敢惹高阶主角，必然是因为主角敛息藏锋、返璞归真看不透，或仗着背后靠山眼瞎；
 *    主角修为低于对手时，硬亮低修为绝不无脑震慑成功，必须凭根基/智谋/出身/金手指或越阶硬战破局。
 * 2. 严格遵守宁朝五域专名，不引入任何旧世界词汇。
 */
import { clamp } from './rng.js';
import { REALMS, realmLabel } from '../data/realms.js';
import { REGION_BY_ID } from '../data/regions.js';
import { SECT_BY_ID, sectRankName } from '../data/sects.js';
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

function interp(tpl, vars) {
  if (!tpl) return '';
  let out = String(tpl);
  for (const [k, v] of Object.entries(vars)) {
    out = out.replaceAll(`{${k}}`, String(v ?? ''));
  }
  return out;
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
    // 真仙已无更高境界，只有俯视众生与同阶古修
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

/** 比较主角与任意目标境界的相对档位（用于二段护短长老）。 */
export function compareRealmTier(char, targetRealm) {
  const diff = (char.realm || 0) - targetRealm;
  if (diff >= 2) return 'much_higher';
  if (diff === 1) return 'higher';
  if (diff === 0) return 'equal';
  return 'lower';
}

/** 动态生成一场网文打脸/装逼遭遇，写入 state.faceSlap 并打开 faceSlap 场景。 */
export function startFaceSlapEncounter(game, {
  context = 'explore',
  returnTo = 'hub',
  forceRelTier = null,
  forceScenarioId = null,
} = {}) {
  const s = game.state;
  const c = s.char;
  const rng = game.rng;
  const region = REGION_BY_ID[c.regionId] || REGION_BY_ID.qingniu;

  let scenario = forceScenarioId ? FACESLAP_SCENARIOS.find((x) => x.id === forceScenarioId) : null;
  if (!scenario) {
    const recent = s.faceSlapRecent || [];
    let pool = FACESLAP_SCENARIOS.filter((sc) => {
      if (sc.minRealm != null && c.realm < sc.minRealm) return false;
      if (sc.maxRealm != null && c.realm > sc.maxRealm) return false;
      if (sc.regions && !sc.regions.includes(region.id)) return false;
      if (sc.contexts && !sc.contexts.includes(context)) return false;
      return true;
    });
    if (!pool.length) {
      pool = FACESLAP_SCENARIOS.filter((sc) => (sc.minRealm ?? 0) <= c.realm && c.realm <= (sc.maxRealm ?? 9));
    }
    if (!pool.length) pool = FACESLAP_SCENARIOS;
    const fresh = pool.filter((sc) => !recent.includes(sc.id));
    scenario = rng.pick(fresh.length ? fresh : pool);
  }
  s.faceSlapRecent = [scenario.id, ...(s.faceSlapRecent || []).filter((id) => id !== scenario.id)].slice(0, 12);

  const { relTier, provokerRealm, provokerRealmLabel } = rollProvokerTier(c, rng, forceRelTier);
  const backing = rng.pick(BACKING_FACTIONS);
  const titlePool = PROVOKER_TITLES_BY_CATEGORY[scenario.category] || ['狂妄修士'];
  const provokerTitle = rng.pick(titlePool);
  const provokerName = rng.pick(PROVOKER_SURNAMES) + rng.pick(PROVOKER_GIVENS);
  const landmark = region.landmarks?.length ? rng.pick(region.landmarks) : region.name;
  const loc = `${region.name}·${landmark}`;
  const seenRealm = perceivedRealmLabel(c);
  const stance = c.auraStance || 'normal';

  const elderRealm = Math.min(9, provokerRealm + 1);
  const elderRealmLabel = `${REALMS[elderRealm].name}${elderRealm === 9 ? '' : '中期'}`;

  s.faceSlap = {
    scenarioId: scenario.id,
    stage: 'junior', // 'junior' | 'elder'
    context,
    returnTo,
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
    raisedStakes: false, // 是否在第一段套话抬高了彩头/留下把柄
    evidenceHeld: false, // 是否抓到了对方的把柄
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
  const stakeMult = (fs.raisedStakes ? 1.45 : 1) * (fs.stage === 'elder' ? 1.55 : 1) * extraMult;
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

/** 构造动态遇事节点（包含阶段一挑衅者 & 阶段二护短长老）。 */
export function buildFaceSlapNode(game) {
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

  // —— 阶段二：打了小的，老的护短出场 ——
  if (fs.stage === 'elder') {
    const eTier = compareRealmTier(c, fs.elderRealm);
    fs.elderRelTier = eTier;
    const stanceName = AURA_STANCES[c.auraStance || 'normal']?.name || '顺其自然';
    const intro = interp(backing.escalateIntro, vars);
    const body = `${intro}\n\n来者修为约在【${fs.elderRealmLabel}】（${REL_LABELS[eTier]}），而你此刻气机为「${stanceName}」${c.auraStance === 'hide' ? `（对外只显${fs.seenRealm}）` : ''}。${fs.evidenceHeld ? '\n\n刚才你早把那小辈自曝的把柄一字不落留在了众人耳中。' : ''}`;
    const choices = [
      {
        id: 'fs_elder_show',
        label: eTier === 'much_higher' || eTier === 'higher'
          ? `散去敛息，以${realmLabel(c)}威压直视来者`
          : `不退半步，放出${realmLabel(c)}气势对峙`,
        hint: eTier === 'much_higher'
          ? '绝对压制 · 来者看清你的境界当场变色'
          : eTier === 'higher'
            ? '境界压制 · 震慑护短长老赔罪'
            : eTier === 'equal'
              ? '同境拼底蕴 · 根基够厚则直压其势'
              : '对方高你一境 · 硬亮修为未必压得住，小心翻脸',
        action: 'faceSlapResolve',
        params: { tactic: 'elder_show' },
        effect: eTier === 'much_higher' || eTier === 'higher' ? 'primary' : '',
      },
    ];
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
        hint: `亮出压箱底牌应对${backing.elderTitle}`,
        action: 'faceSlapResolve',
        params: { tactic: 'elder_gf' },
        effect: eTier === 'lower' ? 'primary' : '',
      });
    }
    if (hasIdentityClout(s)) {
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
        label: `连老的一块教训 · 直接动手`,
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
      title: `护短风波 · ${backing.elderTitle}现身`,
      text: body,
      choices,
    };
  }

  // —— 阶段一：初遇挑衅 ——
  const rTier = fs.relTier;
  const isHiddenTrick = fs.stance === 'hide' && (rTier === 'much_higher' || rTier === 'higher');
  const provokeKey = isHiddenTrick
    ? 'hidden'
    : (rTier === 'much_higher' || rTier === 'higher')
      ? 'blind'
      : rTier === 'equal'
        ? 'peer'
        : 'bully';
  const setupText = interp(sc.setup, vars);
  const provokeText = interp(sc.provokeLine[provokeKey], vars);
  const stanceNote = fs.stance === 'hide'
    ? `你此刻「敛息藏锋」，外人眼中只见你【${fs.seenRealm}】的微弱气机。对方真实修为约在【${fs.provokerRealmLabel}】（${REL_LABELS[rTier]}）。`
    : fs.stance === 'show'
      ? `你此刻「威压外放」，修为毫无遮掩。对方修为约在【${fs.provokerRealmLabel}】（${REL_LABELS[rTier]}），却仍仗着「${backing.name}」的势头挑衅。`
      : `对方修为约在【${fs.provokerRealmLabel}】（${REL_LABELS[rTier]}），背后牵着「${backing.name}」的招牌。`;

  const choices = [
    {
      id: 'fs_lowkey',
      label: rTier === 'much_higher' || rTier === 'higher'
        ? '继续敛息装弱，诱他抬高赌注再反手收网'
        : '收起锋芒示弱套话，暗记对方破绽与把柄',
      hint: rTier === 'much_higher' || rTier === 'higher'
        ? '扮猪吃虎 · 彩头与打脸爽度翻倍，且能留下把柄'
        : '隐匿锋芒 · 智谋检定，避实击虚',
      action: 'faceSlapResolve',
      params: { tactic: 'lowkey' },
      effect: isHiddenTrick ? 'primary' : '',
    },
    {
      id: 'fs_show',
      label: rTier === 'much_higher'
        ? `一步踏出，展露${realmLabel(c)}真境威压`
        : rTier === 'higher'
          ? `散开气机，以${realmLabel(c)}修为直接压场`
          : rTier === 'equal'
            ? `亮出${realmLabel(c)}气息与一身底蕴正面硬压`
            : `硬顶着对方威压，亮出${realmLabel(c)}气势寸步不让`,
      hint: rTier === 'much_higher'
        ? '降维震慑 · 无需出剑即可镇服全场'
        : rTier === 'higher'
          ? '高一境压制 · 大概率直接震退对方赔礼'
          : rTier === 'equal'
            ? `同境拼根基（当前底蕴 ${foundationScore(s)}）· 够厚则气势直压`
            : '修为低于对方 · 硬亮境界极易激怒对方开打，除非底蕴惊人',
      action: 'faceSlapResolve',
      params: { tactic: 'show' },
      effect: (!isHiddenTrick && (rTier === 'much_higher' || rTier === 'higher')) ? 'primary' : '',
    },
  ];

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
      hint: gfCounter.hint,
      action: 'faceSlapResolve',
      params: { tactic: 'gf' },
      effect: rTier === 'lower' ? 'primary' : '',
    });
  }

  if (hasIdentityClout(s)) {
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
      label: rTier === 'much_higher' ? '懒得多言，反手一招教他做人' : rTier === 'lower' ? '不服便战 · 以弱撼强越阶打脸' : '废话少说，手底下见真章',
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
      label: rTier === 'much_higher' || rTier === 'higher' ? '淡然一笑，懒得与蝼蚁置气' : '暂避锋芒，记下此人面孔转身离去',
      hint: '不动干戈 · 稳固道心',
      action: 'faceSlapResolve',
      params: { tactic: 'walk' },
    },
  );

  return {
    id: 'faceSlap',
    title: `${sc.title} · ${REL_LABELS[rTier]}`,
    text: `${setupText}\n\n${provokeText}\n\n${stanceNote}`,
    choices,
  };
}

function finalizeFaceSlap(game, { text, lines = [], fx = null, escalate = false }) {
  const s = game.state;
  const fs = s.faceSlap;
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

function launchFaceSlapCombat(game, fs, sc, backing, isElder = false) {
  const s = game.state;
  const c = s.char;
  const vars = templateVars(game, fs);
  const targetRealm = isElder ? fs.elderRealm : fs.provokerRealm;
  const relTier = isElder ? fs.elderRelTier : fs.relTier;
  const baseEnemyId = isElder ? (backing.enemyId || 'jindan_elder') : (sc.enemyId || 'cultivator');
  const displayName = isElder ? `${backing.name}·${backing.elderTitle}` : `${fs.provokerTitle}·${fs.provokerName}`;

  // 精确按相对境界档位标定敌手强度：much_higher 确保爽快秒杀，lower 则是可胜但硬核的越阶之战
  let scaleMult = 1.0;
  if (relTier === 'much_higher') scaleMult = c.realm === 0 ? 0.55 : 0.72;
  else if (relTier === 'higher') scaleMult = 0.88;
  else if (relTier === 'equal') scaleMult = 1.02;
  else if (relTier === 'lower') scaleMult = 0.62; // 跨一大境（2.8× 倍率）× 0.62 ≈ 1.7× 同阶敌手，有底牌和战术可越阶胜出！

  const rew = rewardScale(game, fs, isElder ? 1.2 : 1.0);
  const shouldEscalate = !isElder && sc.canEscalate && game.rng.chance(0.42);
  const winBody = isElder
    ? `${interp(backing.elderFightText, vars)}\n\n连靠山都被你当场打服，四周${sc.crowd}鸦雀无声，再无人敢轻视你半分。`
    : interp(sc.fightWin, vars);
  const loseBody = isElder
    ? `${backing.elderTitle}终究高出一筹，一掌将你震退十丈。你借势抽身脱困，留下一句冷笑——这笔账，来日必连同「${backing.name}」一并算清。`
    : interp(sc.fightLose, vars);

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
        attrs: { 道心: relTier === 'lower' ? 3 : 1 },
        counter: isElder
          ? { faceslap_wins: 1, elder_slaps: 1, ...(relTier === 'lower' ? { underdog_slaps: 1 } : {}) }
          : { faceslap_wins: 1, ...(relTier === 'lower' ? { underdog_slaps: 1 } : {}) },
      },
      faceSlapEscalate: shouldEscalate,
      faceSlapClear: !shouldEscalate,
      returnTo: shouldEscalate ? 'faceSlap' : (fs.returnTo || 'hub'),
      fx: 'breakthrough',
      log: isElder ? `当众击败护短的${backing.elderTitle}` : `在${sc.title}中打脸${fs.provokerName}`,
    },
    lose: {
      text: loseBody,
      effects: {
        injury: 1,
        attrs: { 道心: 2, 悟性: 1 },
        reputation: -Math.round(rew.rep * 0.3),
      },
      faceSlapClear: true,
      returnTo: fs.returnTo || 'hub',
    },
  }, { lines: [`【${sc.title}】${displayName}（${isElder ? fs.elderRealmLabel : fs.provokerRealmLabel}）出手袭来。`] });
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
  const lines = advanceMonths(s, 1, game.rng);

  // ==================== 阶段二：护短长老应对 ====================
  if (fs.stage === 'elder') {
    const eTier = fs.elderRelTier;
    const rew = rewardScale(game, fs, 1.15);

    if (tactic === 'elder_leave') {
      lines.push('你收起战利品从容离去，道心 +1。');
      c.attrs.道心 += 1;
      return finalizeFaceSlap(game, {
        text: `你扫了一眼气势汹汹的${backing.elderTitle}，拱手一笑：「小辈无礼，我已替贵方管教过了。后会有期。」说罢御风离去，留下一地目瞪口呆的看客。`,
        lines,
      });
    }

    if (tactic === 'elder_fight') {
      return launchFaceSlapCombat(game, fs, sc, backing, true);
    }

    if (tactic === 'elder_show') {
      if (eTier === 'much_higher' || eTier === 'higher' || (eTier === 'equal' && fScore >= 52)) {
        c.stones += rew.stones;
        c.reputation += rew.rep;
        const gotExp = gainExp(s, Math.round(rew.exp * 0.6));
        c.attrs.道心 += 2;
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
        });
      }
      if (eTier === 'lower' && fScore >= 72 && game.rng.chance(0.55)) {
        c.reputation += rew.rep;
        c.attrs.道心 += 3;
        s.counters.faceslap_wins = (s.counters.faceslap_wins || 0) + 1;
        s.counters.elder_slaps = (s.counters.elder_slaps || 0) + 1;
        lines.push(`你一身惊人底蕴竟震得高阶长老疑心背后有大能护道，对方惊疑退走！声望 +${rew.rep}，道心 +3。`);
        return finalizeFaceSlap(game, {
          text: `你虽境界略逊，但放出那一缕纯厚无比的道基威压与杀伐锋芒，反倒让${backing.elderTitle}神色骤变——他以为你是某位隐世老怪的亲传，硬生生咽下怒火，拎着${fs.provokerName}灰溜溜退走。`,
          lines,
          fx: 'breakthrough',
        });
      }
      // 逻辑真实：修为低于长老又压不住场，直接激怒开打！
      return launchFaceSlapCombat(game, fs, sc, backing, true);
    }

    if (tactic === 'elder_expose') {
      const p = fs.evidenceHeld ? 0.94 : clamp(0.48 + (c.attrs.悟性 || 0) * 0.012 + (c.reputation > 100 ? 0.12 : 0), 0.35, 0.9);
      if (game.rng.chance(p)) {
        c.stones += rew.stones;
        c.reputation += Math.round(rew.rep * 1.2);
        c.attrs.悟性 += 1;
        s.counters.faceslap_wins = (s.counters.faceslap_wins || 0) + 1;
        s.counters.lowkey_wins = (s.counters.lowkey_wins || 0) + 1;
        s.counters.elder_slaps = (s.counters.elder_slaps || 0) + 1;
        lines.push(`当众抖出把柄，${backing.elderTitle}颜面扫地赔礼息事：灵石 +${rew.stones.toLocaleString()}，声望 +${Math.round(rew.rep * 1.2)}，悟性 +1。`);
        return finalizeFaceSlap(game, {
          text: `你神色从容，当着${sc.crowd}的面将方才${fs.provokerName}倚势压人、私吞灵资的丑事一字不差道出。人群顿时哗然议论。${backing.elderTitle}脸色青一阵白一阵，怕把事情闹到上头耳朵里，当众甩了${fs.provokerName}一记耳光，塞给你一袋封口灵石匆匆离去。`,
          lines,
          fx: 'alchemy',
        });
      }
      return launchFaceSlapCombat(game, fs, sc, backing, true);
    }

    if (tactic === 'elder_clout') {
      const cloutPower = (c.playerSectName ? 4 : 0) + (c.sectRank || 0) + (c.reputation >= 400 ? 2 : 0);
      const ok = eTier !== 'lower' || cloutPower >= 4 || game.rng.chance(0.55);
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
        });
      }
      return launchFaceSlapCombat(game, fs, sc, backing, true);
    }

    if (tactic === 'elder_gf') {
      const gfC = GF_COUNTERS[c.goldenFingerId];
      if (!gfC) return launchFaceSlapCombat(game, fs, sc, backing, true);
      const text = interp(gfC.successLines[eTier] || gfC.successLines.equal, vars);
      c.stones += Math.round(rew.stones * (gfC.bonus?.stonesMult || 1));
      c.reputation += rew.rep + (gfC.bonus?.reputation || 10);
      const gotExp = gainExp(s, Math.round(rew.exp * (gfC.bonus?.expMult || 0.7)));
      if (gfC.bonus?.daoxin) c.attrs.道心 += gfC.bonus.daoxin;
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
      });
    }
  }

  // ==================== 阶段一：初遇挑衅应对 ====================
  const rTier = fs.relTier;

  if (tactic === 'walk') {
    c.attrs.道心 += 1;
    if (rTier === 'much_higher' || rTier === 'higher') {
      lines.push('你不屑与井蛙纠缠，拂袖而去，道心 +1。');
      return finalizeFaceSlap(game, {
        text: `你看了${fs.provokerName}一眼，像看一只在靴尖乱蹦的蚂蚱，轻轻摇头转身离开。人群中有几位眼毒的老修士却猛地一凛，暗暗记下了你方才那一闪而逝的深不可测。`,
        lines,
      });
    }
    c.attrs.悟性 += 1;
    lines.push('审时度势暂避锋芒，道心 +1，悟性 +1。');
    return finalizeFaceSlap(game, {
      text: `你压下心头火气，淡然退后一步转身离去。身后传来${fs.provokerName}的嗤笑，你把这张脸与「${backing.name}」一并记在心底——修仙路长，来日方长。`,
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
      c.attrs.道心 += 1;
      s.counters.faceslap_wins = (s.counters.faceslap_wins || 0) + 1;
      s.counters.lowkey_wins = (s.counters.lowkey_wins || 0) + 1;
      const loot = maybeLootItem(game, fs, 0.48);
      const shouldEscalate = sc.canEscalate && game.rng.chance(0.45);
      lines.push(`【扮猪吃虎】诱敌加码后反手掀桌：灵石 +${rew.stones.toLocaleString()}，声望 +${rew.rep}，修为 +${gotExp.toLocaleString()}，道心 +1${loot ? `，顺走战利「${loot}」×1` : ''}。`);
      game.pushRumor(`【五域风闻】「${c.name}」在${fs.loc}扮猪吃虎，把「${backing.name}」的${fs.provokerName}坑得颜面尽失、血本无归。`);
      return finalizeFaceSlap(game, {
        text: interp(sc.lowkeyWin, vars),
        lines,
        fx: 'alchemy',
        escalate: shouldEscalate,
      });
    }
    // 同境或低于对手：凭悟性+神识智谋套话破局
    const p = clamp(0.46 + (c.attrs.悟性 || 0) * 0.01 + (c.attrs.神识 || 0) * 0.008 + (c.goldenFingerId === 'gf_stealth' ? 0.2 : 0), 0.3, 0.92);
    if (game.rng.chance(p)) {
      fs.evidenceHeld = true;
      const rew = rewardScale(game, fs, 0.95);
      c.stones += rew.stones;
      c.reputation += Math.round(rew.rep * 0.85);
      c.attrs.悟性 += 1;
      c.attrs.神识 += 1;
      s.counters.faceslap_wins = (s.counters.faceslap_wins || 0) + 1;
      s.counters.lowkey_wins = (s.counters.lowkey_wins || 0) + 1;
      lines.push(`【藏锋智取】示弱套出对方破绽反客为主：灵石 +${rew.stones.toLocaleString()}，声望 +${Math.round(rew.rep * 0.85)}，悟性 +1，神识 +1。`);
      return finalizeFaceSlap(game, {
        text: `你故意露出一副怯懦模样，几句话便哄得自负的${fs.provokerName}洋洋得意，竟当着${sc.crowd}把自家私下克扣、违规越界的话全秃噜了出来。你随即淡笑着收好话柄与赌注，气得他脸色铁青却投鼠忌器，只能眼睁睁看着你满载而归。`,
        lines,
        fx: 'alchemy',
      });
    }
    c.attrs.道心 += 2;
    lines.push('对方老奸巨猾识破了你的试探，你顺势抽身退走，道心 +2。');
    return finalizeFaceSlap(game, {
      text: `${fs.provokerName}虽狂却不傻，察觉你在套话，冷哼一声拂袖作罢。你虽未讨到彩头，却把他的功法路数看清了大半。`,
      lines,
    });
  }

  // 策略 2：显露修为 / 威压镇场
  if (tactic === 'show') {
    if (rTier === 'much_higher') {
      const rew = rewardScale(game, fs, 1.05);
      c.stones += rew.stones;
      c.reputation += Math.round(rew.rep * 1.25);
      c.attrs.道心 += 1;
      s.counters.faceslap_wins = (s.counters.faceslap_wins || 0) + 1;
      s.counters.flex_wins = (s.counters.flex_wins || 0) + 1;
      const loot = maybeLootItem(game, fs, 0.35);
      const shouldEscalate = sc.canEscalate && game.rng.chance(0.45);
      lines.push(`【绝对威压】全场跪服赔礼：灵石 +${rew.stones.toLocaleString()}，声望 +${Math.round(rew.rep * 1.25)}，道心 +1${loot ? `，赔礼「${loot}」×1` : ''}。`);
      game.pushRumor(`【五域风闻】${fs.loc}有不长眼之辈冲撞了${realmLabel(c)}大修「${c.name}」，仅凭一缕威压便跪地求饶。`);
      return finalizeFaceSlap(game, {
        text: interp(sc.showWin.much_higher, vars),
        lines,
        fx: 'breakthrough',
        escalate: shouldEscalate,
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
      const shouldEscalate = sc.canEscalate && game.rng.chance(0.4);
      lines.push(`【高境压制】对方脸色剧变赔礼退让：灵石 +${rew.stones.toLocaleString()}，声望 +${rew.rep}，修为 +${gotExp.toLocaleString()}${loot ? `，获得「${loot}」×1` : ''}。`);
      return finalizeFaceSlap(game, {
        text: interp(sc.showWin.higher, vars),
        lines,
        fx: 'breakthrough',
        escalate: shouldEscalate,
      });
    }
    if (rTier === 'equal') {
      // 同境拼根基：底蕴深厚则直接气势压垮，否则当场开打！
      const winAuraChance = clamp(0.25 + (fScore - 30) * 0.012, 0.18, 0.88);
      if (game.rng.chance(winAuraChance)) {
        const rew = rewardScale(game, fs, 1.15);
        c.stones += rew.stones;
        c.reputation += Math.round(rew.rep * 1.15);
        const gotExp = gainExp(s, Math.round(rew.exp * 0.55));
        c.attrs.道心 += 2;
        s.counters.faceslap_wins = (s.counters.faceslap_wins || 0) + 1;
        s.counters.flex_wins = (s.counters.flex_wins || 0) + 1;
        const shouldEscalate = sc.canEscalate && game.rng.chance(0.35);
        lines.push(`【同境碾压】你一身浑厚底蕴（${fScore}）生生压垮同境对手：灵石 +${rew.stones.toLocaleString()}，声望 +${Math.round(rew.rep * 1.15)}，修为 +${gotExp.toLocaleString()}，道心 +2。`);
        return finalizeFaceSlap(game, {
          text: interp(sc.showWin.equal, vars),
          lines,
          fx: 'breakthrough',
          escalate: shouldEscalate,
        });
      }
      // 同境底蕴未压倒对方 -> 公平斗法！
      return launchFaceSlapCombat(game, fs, sc, backing, false);
    }
    // rTier === 'lower'：严守逻辑！修为低硬亮修为不会无脑成功
    if (fScore >= 65 && game.rng.chance(0.45)) {
      const rew = rewardScale(game, fs, 1.1);
      c.reputation += rew.rep;
      c.attrs.道心 += 3;
      s.counters.faceslap_wins = (s.counters.faceslap_wins || 0) + 1;
      s.counters.underdog_slaps = (s.counters.underdog_slaps || 0) + 1;
      lines.push(`【以弱慑强】你虽低一境，却凭惊人根基与道心震慑对方生疑：声望 +${rew.rep}，道心 +3。`);
      return finalizeFaceSlap(game, {
        text: `你明知境界不如对方，却毫不退缩地放出${realmLabel(c)}气息。${fs.provokerName}刚要嗤笑，忽然被你气息中那股远超同阶的凝练杀意刺得心头一跳——以为你身怀绝世秘宝或大能护道，竟硬生生刹住脚步，丢下一句场面话灰溜溜退了出去。`,
        lines,
        fx: 'breakthrough',
      });
    }
    // 否则对方嗤笑并直接动手（逼出硬核越阶战！）
    return launchFaceSlapCombat(game, fs, sc, backing, false);
  }

  // 策略 3：出身专属流派破局
  if (tactic === 'origin') {
    const oc = ORIGIN_COUNTERS[c.originId];
    if (!oc) return launchFaceSlapCombat(game, fs, sc, backing, false);
    const attrVal = c.attrs[oc.attrKey] || 10;
    const baseP = rTier === 'much_higher' ? 0.98 : rTier === 'higher' ? 0.92 : rTier === 'equal' ? 0.72 : 0.52;
    const p = clamp(baseP + attrVal * 0.006, 0.4, 0.99);
    if (game.rng.chance(p)) {
      const rew = rewardScale(game, fs, oc.bonus?.stonesMult || 1.1);
      c.stones += rew.stones;
      c.reputation += rew.rep + (oc.bonus?.reputation || 12);
      const gotExp = gainExp(s, Math.round(rew.exp * 0.6));
      if (oc.bonus?.daoxin) c.attrs.道心 += oc.bonus.daoxin;
      if (oc.bonus?.attrGain) c.attrs[oc.attrKey] = (c.attrs[oc.attrKey] || 10) + oc.bonus.attrGain;
      s.counters.faceslap_wins = (s.counters.faceslap_wins || 0) + 1;
      if (rTier === 'lower') s.counters.underdog_slaps = (s.counters.underdog_slaps || 0) + 1;
      const loot = maybeLootItem(game, fs, 0.42);
      const shouldEscalate = sc.canEscalate && game.rng.chance(0.38);
      lines.push(`【出身破局】灵石 +${rew.stones.toLocaleString()}，声望 +${rew.rep + (oc.bonus?.reputation || 12)}，修为 +${gotExp.toLocaleString()}${loot ? `，另获「${loot}」×1` : ''}。`);
      return finalizeFaceSlap(game, {
        text: `${interp(oc.successLines[rTier] || oc.successLines.equal, vars)}\n\n${interp(oc.crowdReact, vars)}`,
        lines,
        fx: 'breakthrough',
        escalate: shouldEscalate,
      });
    }
    // 失败则转为实战打脸！
    return launchFaceSlapCombat(game, fs, sc, backing, false);
  }

  // 策略 4：金手指降维打脸
  if (tactic === 'gf') {
    const gc = GF_COUNTERS[c.goldenFingerId];
    if (!gc) return launchFaceSlapCombat(game, fs, sc, backing, false);
    const rew = rewardScale(game, fs, gc.bonus?.stonesMult || 1.2);
    c.stones += rew.stones;
    c.reputation += rew.rep + (gc.bonus?.reputation || 15);
    const gotExp = gainExp(s, Math.round(rew.exp * (gc.bonus?.expMult || 0.75)));
    if (gc.bonus?.daoxin) c.attrs.道心 += gc.bonus.daoxin;
    if (gc.bonus?.demon) c.demon = clamp(c.demon + gc.bonus.demon, 0, 100);
    s.counters.faceslap_wins = (s.counters.faceslap_wins || 0) + 1;
    if (c.goldenFingerId === 'gf_stealth') s.counters.lowkey_wins = (s.counters.lowkey_wins || 0) + 1;
    else s.counters.flex_wins = (s.counters.flex_wins || 0) + 1;
    if (rTier === 'lower') s.counters.underdog_slaps = (s.counters.underdog_slaps || 0) + 1;
    const loot = maybeLootItem(game, fs, 0.5);
    const shouldEscalate = sc.canEscalate && c.goldenFingerId !== 'gf_stealth' && game.rng.chance(0.36);
    lines.push(`【机缘显威】灵石 +${rew.stones.toLocaleString()}，声望 +${rew.rep + (gc.bonus?.reputation || 15)}，修为 +${gotExp.toLocaleString()}${loot ? `，额外所得「${loot}」×1` : ''}。`);
    game.pushRumor(`【五域风闻】「${c.name}」在${fs.loc}以惊人手段压倒${fs.provokerName}，满堂皆惊。`);
    return finalizeFaceSlap(game, {
      text: `${interp(gc.successLines[rTier] || gc.successLines.equal, vars)}\n\n${interp(gc.crowdReact, vars)}`,
      lines,
      fx: 'breakthrough',
      escalate: shouldEscalate,
    });
  }

  // 策略 5：身份威望压人
  if (tactic === 'clout') {
    const rankPower = (c.playerSectName ? 5 : 0) + (c.sectRank || 0) + (c.reputation >= 300 ? 2 : 0);
    const ok = rTier !== 'lower' || rankPower >= 4 || game.rng.chance(0.5);
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
      });
    }
    return launchFaceSlapCombat(game, fs, sc, backing, false);
  }

  recomputeDerived(c);
  return finalizeFaceSlap(game, { text: '一场风波就此落幕。', lines });
}
