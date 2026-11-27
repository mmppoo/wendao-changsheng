/**
 * 灵根：开局抽取，决定修炼速度、突破倾向、可触发的专属奇遇。
 * weight 为抽取权重；speed 为修炼倍率；breakBonus 为突破成功率加成（百分点）。
 */
export const ROOTS = [
  {
    id: 'wuling', name: '五灵根', grade: '凡', element: '杂', weight: 24, speed: 0.85,
    breakBonus: 0, lifespan: 0,
    desc: '五行俱全，却样样不精。世人称之为「杂灵根」，多被宗门拒之门外。',
    quirk: '修行缓慢，但五行法术皆可入门，旁人难以预料你的手段。',
    tags: ['杂'],
  },
  {
    id: 'siling', name: '四灵根', grade: '凡', element: '杂', weight: 18, speed: 1.0,
    breakBonus: 0, lifespan: 0,
    desc: '四气混杂，比五灵根稍清。仍是散修里最常见的资质。',
    quirk: '无甚特异，唯有勤能补拙。',
    tags: ['杂'],
  },
  {
    id: 'sanling', name: '三灵根', grade: '黄', element: '杂', weight: 16, speed: 1.18,
    breakBonus: 1, lifespan: 5,
    desc: '三气并行而不冲，已算可造之材。中小宗门愿意收为外门弟子。',
    quirk: '可同时修习三种属性的法术。',
    tags: ['杂'],
  },
  {
    id: 'shuangling', name: '双灵根', grade: '玄', element: '双', weight: 12, speed: 1.45,
    breakBonus: 3, lifespan: 15,
    desc: '两气交泰，修行一日可抵旁人三日。宗门争抢的资质。',
    quirk: '两系法术相生，威力和合。',
    tags: ['双'],
  },
  {
    id: 'jin', name: '金灵根', grade: '地', element: '金', weight: 2.6, speed: 1.8,
    breakBonus: 4, lifespan: 20,
    desc: '庚金之气入体，锋芒自生。天生适合剑修与杀伐之道。',
    quirk: '剑道悟性极高，攻击类法术威力 +20%。',
    tags: ['单', '金'],
  },
  {
    id: 'mu', name: '木灵根', grade: '地', element: '木', weight: 2.6, speed: 1.75,
    breakBonus: 3, lifespan: 60,
    desc: '乙木长生，气血绵长。医道、丹道、御兽皆宜。',
    quirk: '寿元 +60 年，疗伤效果 +50%。',
    tags: ['单', '木'],
  },
  {
    id: 'shui', name: '水灵根', grade: '地', element: '水', weight: 2.6, speed: 1.8,
    breakBonus: 4, lifespan: 25,
    desc: '上善若水，神识澄澈。修习幻术与水法事半功倍。',
    quirk: '神识 +10，心境不易动摇。',
    tags: ['单', '水'],
  },
  {
    id: 'huo', name: '火灵根', grade: '地', element: '火', weight: 2.6, speed: 1.8,
    breakBonus: 3, lifespan: 10,
    desc: '离火焚身，性烈如焰。丹火、器火、战火，皆由此生。',
    quirk: '炼丹炼器成功率 +15%，性情易躁。',
    tags: ['单', '火'],
  },
  {
    id: 'tu', name: '土灵根', grade: '地', element: '土', weight: 2.6, speed: 1.7,
    breakBonus: 5, lifespan: 40,
    desc: '厚土载物，根基最稳。突破时比旁人更能扛住反噬。',
    quirk: '突破成功率 +5%，防御类法术威力 +20%。',
    tags: ['单', '土'],
  },
  {
    id: 'lei', name: '雷灵根', grade: '天', element: '雷', weight: 1.3, speed: 2.0,
    breakBonus: 9, lifespan: 0,
    desc: '天雷入体，万中无一。渡劫时雷劫认主，反而成了助力。',
    quirk: '雷劫伤害 -30%，突破 +9%；但易招天妒，奇遇中凶险更多。',
    tags: ['变异', '雷'],
  },
  {
    id: 'bing', name: '冰灵根', grade: '天', element: '冰', weight: 1.3, speed: 1.95,
    breakBonus: 6, lifespan: 30,
    desc: '玄冰封心，情动则伤。修无情道者，进境快得可怕。',
    quirk: '道心 +8，但情缘事件会额外损耗道心。',
    tags: ['变异', '冰'],
  },
  {
    id: 'feng', name: '风灵根', grade: '天', element: '风', weight: 1.4, speed: 1.9,
    breakBonus: 4, lifespan: 10,
    desc: '御风而行，身法无双。逃命的本事，天下第一。',
    quirk: '战斗逃跑必定成功，云游耗时 -1 月。',
    tags: ['变异', '风'],
  },
  {
    id: 'an', name: '暗灵根', grade: '天', element: '暗', weight: 1.2, speed: 1.9,
    breakBonus: 5, lifespan: 0,
    desc: '幽暗缠身，见光则弱。魔道宗门视之为圣种。',
    quirk: '魔道功法威力 +25%，正道声望增长减半。',
    tags: ['变异', '暗', '魔'],
  },
  {
    id: 'xue', name: '血灵根', grade: '天', element: '血', weight: 0.9, speed: 2.05,
    breakBonus: 7, lifespan: -20,
    desc: '以血养道，进境极快，代价是寿元与人性。',
    quirk: '可用气血换取修为；寿元 -20 年。',
    tags: ['变异', '血', '魔'],
  },
  {
    id: 'kongjian', name: '空间灵根', grade: '仙', element: '空间', weight: 0.4, speed: 2.2,
    breakBonus: 8, lifespan: 50,
    desc: '天生能撕裂虚空。万里之外，一步可至。',
    quirk: '云游耗时减半，奇遇概率 +25%，可开辟洞天。',
    tags: ['变异', '空间'],
  },
  {
    id: 'taiyin', name: '太阴灵根', grade: '仙', element: '月', weight: 0.35, speed: 2.3,
    breakBonus: 6, lifespan: 80,
    desc: '月华入命，神魂天生近道。夜里修行，事半功倍。',
    quirk: '夜间修炼 +30%，神魂类奇遇专属。',
    tags: ['变异', '月'],
  },
  {
    id: 'taiyang', name: '太阳灵根', grade: '仙', element: '日', weight: 0.35, speed: 2.3,
    breakBonus: 6, lifespan: 40,
    desc: '大日真火自生，百邪不侵。正道魁首的胚子。',
    quirk: '对魔道伤害 +40%，声望获取 +50%。',
    tags: ['变异', '日'],
  },
  {
    id: 'xingchen', name: '星辰灵根', grade: '仙', element: '星', weight: 0.3, speed: 2.25,
    breakBonus: 7, lifespan: 100,
    desc: '周身窍穴如星斗排列，可借星辰之力修行。',
    quirk: '每突破一层额外 +2 属性点，观星事件专属。',
    tags: ['变异', '星'],
  },
  {
    id: 'tianling', name: '天灵根', grade: '仙', element: '天', weight: 0.18, speed: 2.6,
    breakBonus: 12, lifespan: 120,
    desc: '万古一遇。灵气自入丹田，无需搬运。史书上每个天灵根，都写满了一整页。',
    quirk: '全属性 +8，突破 +12%，宗门争抢，凶险亦随之。',
    tags: ['天'],
  },
  {
    id: 'hundun', name: '混沌灵根', grade: '仙', element: '混沌', weight: 0.06, speed: 3.0,
    breakBonus: 15, lifespan: 200,
    desc: '开天辟地之初的一缕混沌之气。此根不入五行，不容于天道。',
    quirk: '全属性 +15，突破 +15%；但天道视你为异数，天劫威力翻倍。',
    tags: ['混沌'],
  },
  {
    id: 'wulinggen', name: '伪灵根（无灵根）', grade: '凡', element: '无', weight: 5, speed: 0.45,
    breakBonus: -5, lifespan: -10,
    desc: '灵根闭塞，几乎无法引气。世人断言你此生与仙途无缘。',
    quirk: '修炼极慢，但体修路线全开：气血成长翻倍，可走「以力证道」。',
    tags: ['无', '体修'],
  },
];

export const ROOT_BY_ID = Object.fromEntries(ROOTS.map((r) => [r.id, r]));
export const ROOT_WEIGHT_TOTAL = ROOTS.reduce((a, r) => a + r.weight, 0);
export const GRADE_ORDER = { 凡: 0, 黄: 1, 玄: 2, 地: 3, 天: 4, 仙: 5 };
