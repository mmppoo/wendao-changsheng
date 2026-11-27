/**
 * 境界体系（v4.0；v8 第三境改名结丹，渡劫后为真仙，不离五域）：十境分层，战力指数跃迁，突破瓶颈与法则共鸣体系。
 * exp 为「进入下一层」所需的修为，powerMult 为境界基础战力倍率。
 */
export const REALMS = [
  {
    id: 'lianqi', name: '炼气', layers: 9, exp: 260, growth: 1.24,
    lifespan: 120, monthly: 1, tribulation: false, powerMult: 1,
    layerNames: ['一层', '二层', '三层', '四层', '五层', '六层', '七层', '八层', '九层'],
    desc: '引气入体，打通经脉。凡人与修士的分野，就从这一口灵气开始。',
    bottleneck: {
      needItem: 'zhuji_dan',
      minDaoxin: 12,
      minLawLevel: 0,
      trialDesc: '灵气化液，引天地灵机铸就道基。道基品质将永久铭刻于此后每一境。',
      qualityNames: ['凡品道基', '上品道基', '天道筑基'],
    },
  },
  {
    id: 'zhuji', name: '筑基', layers: 4, exp: 3600, growth: 1.55,
    lifespan: 260, monthly: 7, tribulation: false, powerMult: 2.8,
    layerNames: ['初期', '中期', '后期', '圆满'],
    desc: '筑就道基，寿元大增。道基的品质，会在此后每一次天劫里回响。',
    bottleneck: {
      needItem: 'jiejin_dan',
      minDaoxin: 20,
      minLawLevel: 0,
      trialDesc: '压缩气海灵液为丹胎，丹纹越多，雷劫越烈，成道的根基也越厚。',
      qualityNames: ['下品结丹', '上品结丹', '九纹结丹'],
    },
  },
  {
    id: 'jindan', name: '结丹', layers: 4, exp: 32000, growth: 1.62,
    lifespan: 520, monthly: 32, tribulation: true, powerMult: 7.5,
    layerNames: ['初期', '中期', '后期', '圆满'],
    desc: '周天元气固结成一枚无漏之丹，神识外放如亲眼所见。在各方势力中，结丹修士已是宗师。丹成之日，雷劫必至。',
    bottleneck: {
      needItem: 'huaying_dan',
      minDaoxin: 30,
      minLawLevel: 0,
      trialDesc: '碎丹成婴，神魂脱离凡胎初生灵智。若道心不固，极易为心魔反噬。',
      qualityNames: ['凡婴', '灵婴', '混沌元婴'],
    },
  },
  {
    id: 'yuanying', name: '元婴', layers: 4, exp: 240000, growth: 1.68,
    lifespan: 1000, monthly: 130, tribulation: true, powerMult: 20,
    layerNames: ['初期', '中期', '后期', '圆满'],
    desc: '丹壳破开，灵婴自生，即便肉身败亡也能寄神于他处。世人多奉为陆地神仙，常人一生难得一见。',
    bottleneck: {
      needItem: 'huashen_dan',
      minDaoxin: 42,
      minLawLevel: 1,
      trialDesc: '元婴通天，需初窥至少一道天地法则，方能化神。',
      qualityNames: ['初神', '玄神', '法相化神'],
    },
  },
  {
    id: 'huashen', name: '化神', layers: 4, exp: 1800000, growth: 1.72,
    lifespan: 2000, monthly: 520, tribulation: true, powerMult: 55,
    layerNames: ['初期', '中期', '后期', '圆满'],
    desc: '元婴之上，世人已不知其详，只在古籍残卷中偶有记载：化神者一念之间，山河变色。',
    bottleneck: {
      needItem: 'xukong_jing',
      minDaoxin: 55,
      minLawLevel: 2,
      trialDesc: '洞破虚实幻相，以虚空晶引元神合道，需主修法则达到「略有小成」。',
      qualityNames: ['返虚', '洞虚', '太虚真身'],
    },
  },
  {
    id: 'lianxu', name: '炼虚', layers: 4, exp: 12000000, growth: 1.76,
    lifespan: 4000, monthly: 2000, tribulation: true, powerMult: 150,
    layerNames: ['初期', '中期', '后期', '圆满'],
    desc: '古籍残载：炼虚合道，虚实之间再无界限。这一境界在五域只存于传说。',
    bottleneck: {
      needItem: 'dao_fruit',
      minDaoxin: 70,
      minLawLevel: 3,
      trialDesc: '元神法相重归肉身，身法合一。需悟道果定神，且法则达「融会贯通」。',
      qualityNames: ['灵合', '道合', '混元合体'],
    },
  },
  {
    id: 'heti', name: '合体', layers: 4, exp: 76000000, growth: 1.8,
    lifespan: 8000, monthly: 7600, tribulation: true, powerMult: 420,
    layerNames: ['初期', '中期', '后期', '圆满'],
    desc: '传说中法与身合、身与道合的境界。到了这里，已经很难被杀死。',
    bottleneck: {
      needItem: 'tiandao_lotus',
      minDaoxin: 88,
      minLawLevel: 4,
      trialDesc: '万法归宗，立于五域之巅。需天道莲承压，且法则达「登峰造极」。',
      qualityNames: ['小乘', '大乘', '极道大乘'],
    },
  },
  {
    id: 'dacheng', name: '大乘', layers: 4, exp: 460000000, growth: 1.85,
    lifespan: 15000, monthly: 28000, tribulation: true, powerMult: 1200,
    layerNames: ['初期', '中期', '后期', '圆满'],
    desc: '大乘之巅，只差最后几重天劫。这一步，拦住过多少古修，天机阁的残卷里没有记全。',
    bottleneck: {
      needItem: 'tianjie_dan',
      minDaoxin: 105,
      minLawLevel: 4,
      trialDesc: '引动灭世雷劫，褪尽最后的凡骨。过得去便入渡劫，过不去便灰飞烟灭。',
      qualityNames: ['凡劫', '紫霄劫', '混沌神劫'],
    },
  },
  {
    id: 'dujie', name: '渡劫', layers: 3, exp: 2800000000, growth: 1.95,
    lifespan: 30000, monthly: 95000, tribulation: true, powerMult: 3500,
    layerNames: ['一劫', '二劫', '三劫'],
    desc: '九重天劫，一重一重地数。数完了，便是仙。',
    bottleneck: {
      needItem: 'tianjie_dan',
      minDaoxin: 120,
      minLawLevel: 5,
      trialDesc: '三劫圆满，法则圆满。渡过最后一重天劫，便是真仙，人仍在这片天地之间。',
      qualityNames: ['散仙', '地仙', '太乙真仙'],
    },
  },
  {
    id: 'zhenxian', name: '真仙', layers: 1, exp: Infinity, growth: 1,
    lifespan: 60000, monthly: 1, tribulation: true, powerMult: 10000,
    layerNames: ['仙'],
    desc: '劫后成仙，不离五域。寿元近乎无尽，可以看着一个个纪元过去，路还可以继续走下去。',
    bottleneck: null,
  },
];

export const REALM_KEYS = REALMS.map((r) => r.id);

export const LAW_STAGES = ['未入门', '初窥门径', '略有小成', '融会贯通', '登峰造极', '法则圆满'];

export const LAWS = [
  {
    id: 'sword', name: '剑道', element: '金',
    desc: '一剑破万法。剑意凝实之处，神通皆可斩裂。',
    bonus: { atk: 0.1, crit: 0.03 },
  },
  {
    id: 'pill', name: '丹道', element: '火',
    desc: '夺天地造化入炉，以凡火炼仙丹，药效倍增。',
    bonus: { alchemy: 0.12, lifespan: 15 },
  },
  {
    id: 'array', name: '阵道', element: '阵',
    desc: '借山川地脉为棋盘，一念成阵，攻守自如。',
    bonus: { def: 0.1, speed: 0.06 },
  },
  {
    id: 'thunder', name: '雷霆', element: '雷',
    desc: '执天雷之威，破邪诛魔，渡劫时雷威减免。',
    bonus: { atk: 0.09, tribulationResist: 0.08 },
  },
  {
    id: 'space', name: '空间', element: '空',
    desc: '咫尺天涯，裂空挪移，游历与遁走俱占先机。',
    bonus: { flee: 0.1, speed: 0.05 },
  },
  {
    id: 'time', name: '光阴', element: '时',
    desc: '一念春秋，洞悉岁月流速，闭关进境与寿元俱增。',
    bonus: { speed: 0.1, lifespan: 25 },
  },
  {
    id: 'star', name: '星辰', element: '星',
    desc: '引周天星力淬炼肉身神魂，气血灵力齐涨。',
    bonus: { hp: 0.08, mp: 0.08 },
  },
  {
    id: 'karma', name: '因果', element: '命',
    desc: '窥见众生红线与天机轮转，避凶趋吉，心魔难侵。',
    bonus: { breakBonus: 4, demonResist: 0.08 },
  },
  {
    id: 'blood', name: '血海', element: '血',
    desc: '以杀证道，气血化海，愈战愈狂。',
    bonus: { atk: 0.11, lifesteal: 0.04 },
  },
  {
    id: 'chaos', name: '混沌', element: '混',
    desc: '万法归源，阴阳未分。修成不易，却可压制诸般法则。',
    bonus: { atk: 0.08, def: 0.08, speed: 0.06 },
  },
];

export const LAW_BY_ID = Object.fromEntries(LAWS.map((l) => [l.id, l]));

export const DAO_BASE_QUALITIES = [
  { id: 'fan', name: '凡品道基', mult: 1.0, minScore: 0, desc: '中规中矩的道基，足以支撑常人修至结丹。' },
  { id: 'shang', name: '上品道基', mult: 1.18, minScore: 45, desc: '灵脉澄澈，气海浑厚，同阶斗法占尽上风。' },
  { id: 'tiandao', name: '天道筑基', mult: 1.38, minScore: 80, desc: '引天道垂青铸就的无暇道基，战力与修炼潜力冠绝同辈。' },
];

export const GOLDEN_CORE_QUALITIES = [
  { id: 'xia', name: '下品结丹', mult: 1.0, minScore: 0, desc: '丹成无纹，虽已凝丹，却难以窥见大道极境。' },
  { id: 'shang', name: '上品结丹', mult: 1.2, minScore: 55, desc: '丹蕴六纹，法力精纯凝练，威压四方群修。' },
  { id: 'jiuwen', name: '九纹结丹', mult: 1.45, minScore: 90, desc: '万中无一的九纹之丹，丹成之日，百里内灵气都朝丹田涌来。' },
];

export function realmLabel(char) {
  const realm = REALMS[char.realm] || REALMS[0];
  if (realm.id === 'zhenxian') return '真仙';
  return `${realm.name}${realm.layerNames[Math.min(char.layer, realm.layerNames.length - 1)]}`;
}

export function expToNext(char) {
  const realm = REALMS[char.realm];
  if (!realm || !Number.isFinite(realm.exp)) return Infinity;
  return Math.round(realm.exp * Math.pow(realm.growth, char.layer));
}

export function totalExpCurve() {
  let total = 0;
  for (const realm of REALMS) {
    if (!Number.isFinite(realm.exp)) continue;
    for (let l = 0; l < realm.layers; l++) total += realm.exp * Math.pow(realm.growth, l);
  }
  return total;
}
