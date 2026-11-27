/**
 * 物品（v4.0）：丹药、法器、灵材、功法、符箓。
 * use 效果由 engine/effects.js 的 applyEffects 统一结算。
 */
export const ITEMS = [
  // ---- 原有 20 件物品（全部保留 ID） ----
  {
    id: 'yinqi_dan', name: '引气丹', type: '丹药', tier: '凡', price: 30,
    desc: '炼气期最寻常的丹药，服下可省一月苦功。', use: { exp: 80 }, stack: true,
  },
  {
    id: 'huiling_dan', name: '回灵丹', type: '丹药', tier: '黄', price: 80,
    desc: '灵液凝成，服之灵力充盈，高阶修士亦可速复三成法力。', use: { mp: 50, mpPct: 0.3 }, stack: true,
  },
  {
    id: 'liaoshang_dan', name: '疗伤丹', type: '丹药', tier: '黄', price: 70,
    desc: '止血生肌，行走江湖必备，可恢复固定与两成半气血。', use: { hp: 80, hpPct: 0.25 }, stack: true,
  },
  {
    id: 'zhuji_dan', name: '筑基丹', type: '丹药', tier: '玄', price: 600,
    desc: '筑基之时服用，可大幅提升成功率并稳固道基。', use: { breakBonus: 18, lifespan: 5 }, stack: true,
  },
  {
    id: 'pozhang_dan', name: '破障丹', type: '丹药', tier: '玄', price: 900,
    desc: '冲关破障，硬生生把瓶颈撞开一道缝。', use: { breakBonus: 25, demon: 3 }, stack: true,
  },
  {
    id: 'xisui_dan', name: '洗髓丹', type: '丹药', tier: '地', price: 2600,
    desc: '洗经伐髓，改造资质。凡人也有一次重来的机会。', use: { attrs: { 根骨: 4, 悟性: 2 }, lifespan: 10 }, stack: true,
  },
  {
    id: 'jiuzhuan_dan', name: '九转金丹', type: '丹药', tier: '天', price: 30000,
    desc: '九转九炼，一丹可续命三百年，气血尽复。', use: { lifespan: 300, hp: 9999, hpPct: 1 }, stack: true,
  },
  {
    id: 'tianjie_dan', name: '天劫丹', type: '丹药', tier: '仙', price: 120000,
    desc: '以雷木为引，硬抗一道天雷。传说只有疯子才炼得出来。', use: { breakBonus: 40, hp: -500 }, stack: true,
  },
  {
    id: 'qingfeng_jian', name: '青锋剑', type: '法器', tier: '黄', price: 200,
    desc: '凡铁所铸，但剑身有一线青光。', equip: { atk: 6 },
  },
  {
    id: 'liegong', name: '祖传猎弓', type: '法器', tier: '凡', price: 60,
    desc: '桑木弓，弦是狼筋。你父亲留下的。', equip: { atk: 4, crit: 2 },
  },
  {
    id: 'canjian', name: '残剑', type: '法器', tier: '地', price: 0,
    desc: '你前世的本体。锈迹斑斑，握在手里却会轻轻震鸣。', equip: { atk: 18, crit: 8 },
  },
  {
    id: 'xueyu', name: '血玉牌', type: '法器', tier: '玄', price: 0,
    desc: '母亲的遗物。贴身带着，能听见很远的哭声。', equip: { mp: 30, demon: 2 },
  },
  {
    id: 'lingcao', name: '百年灵草', type: '灵材', tier: '黄', price: 45,
    desc: '山野间采得，炼丹主料。', stack: true,
  },
  {
    id: 'xuantie', name: '玄铁', type: '灵材', tier: '玄', price: 160,
    desc: '炼器上品，重逾千斤。', stack: true,
  },
  {
    id: 'leimu', name: '雷击木', type: '灵材', tier: '地', price: 800,
    desc: '被天雷劈过却未死的老木，蕴含雷意。', stack: true,
  },
  {
    id: 'huxin_fu', name: '护心符', type: '符箓', tier: '玄', price: 320,
    desc: '一次性护体，可挡致命一击。', use: { shield: 1 }, stack: true,
  },
  {
    id: 'shenxing_fu', name: '神行符', type: '符箓', tier: '黄', price: 60,
    desc: '日行千里。逃命、赶路、赴约，都用得上。', use: { escape: 1 }, stack: true,
  },
  {
    id: 'jiuzhuan_gong', name: '《九转元功》', type: '功法', tier: '天', price: 0,
    desc: '不知来历的残卷，每读一遍，经脉就宽一分。', technique: { speed: 0.25, attrs: { 根骨: 3 } },
  },
  {
    id: 'wujian_jue', name: '《无剑诀》', type: '功法', tier: '天', price: 0,
    desc: '剑不在手，剑在念。修至深处，草木皆剑。', technique: { atk: 0.3, speed: 0.1 },
  },
  {
    id: 'changchun_gong', name: '《长春功》', type: '功法', tier: '地', price: 0,
    desc: '木系养命之法，寿元绵长。', technique: { lifespan: 40, speed: 0.08 },
  },

  // ---- v4.0 新增 15 件高阶丹药与灵材 ----
  {
    id: 'jiejin_dan', name: '结金丹', type: '丹药', tier: '玄', price: 2200,
    desc: '凝液成丹的破境圣药，可大幅提升结丹成算并增进修为。',
    use: { breakBonus: 22, expPct: 0.12 }, stack: true,
  },
  {
    id: 'huaying_dan', name: '化婴丹', type: '丹药', tier: '地', price: 9500,
    desc: '碎丹成婴时护持元神的灵丹，助元婴稳固诞生并延寿十五载。',
    use: { breakBonus: 26, expPct: 0.12, lifespan: 15 }, stack: true,
  },
  {
    id: 'huashen_dan', name: '化神丹', type: '丹药', tier: '地', price: 36000,
    desc: '采九天罡气炼就，服之引动神魂与天地法则共鸣，大增化神契机。',
    use: { breakBonus: 28, lawExp: 35 }, stack: true,
  },
  {
    id: 'xukong_jing', name: '虚空晶', type: '灵材', tier: '天', price: 120000,
    desc: '自界壁裂缝凝结的稀世晶石，既可作炼虚破境阵眼，亦可直接炼化悟道。',
    use: { breakBonus: 30, lawExp: 60 }, stack: true,
  },
  {
    id: 'dao_fruit', name: '悟道果', type: '丹药', tier: '天', price: 320000,
    desc: '三千年一熟的先天道果，服之灵台清明，法则感悟如决堤奔涌。',
    use: { breakBonus: 32, lawExp: 100, attrs: { 悟性: 5, 道心: 5 } }, stack: true,
  },
  {
    id: 'tiandao_lotus', name: '天道莲', type: '丹药', tier: '仙', price: 900000,
    desc: '生于混沌灵池的九品青莲，可涤荡心魔、延寿百廿载并助冲击大乘。',
    use: { breakBonus: 36, lawExp: 160, lifespan: 120, demon: -25 }, stack: true,
  },
  {
    id: 'dahuan_dan', name: '大还丹', type: '丹药', tier: '地', price: 1800,
    desc: '高阶疗伤回灵宝丹，纵使身受重创亦能顷刻复原六成半气血与半数灵力。',
    use: { hp: 400, hpPct: 0.65, mp: 200, mpPct: 0.5 }, stack: true,
  },
  {
    id: 'qingxin_dan', name: '清心丹', type: '丹药', tier: '玄', price: 420,
    desc: '冰莲与静心草合炼，服之神识澄澈，驱散心魔躁动。',
    use: { demon: -18, attrs: { 道心: 1 } }, stack: true,
  },
  {
    id: 'juling_dan', name: '聚灵丹', type: '丹药', tier: '玄', price: 380,
    desc: '筑基与金丹修士常用的精进丹药，可省去数月苦修。',
    use: { exp: 900, expPct: 0.18 }, stack: true,
  },
  {
    id: 'yuanying_dan', name: '元婴丹', type: '丹药', tier: '地', price: 14000,
    desc: '以千年药王精炼而成，药力雄浑，专供元婴及化神大修增进修为。',
    use: { exp: 32000, expPct: 0.25 }, stack: true,
  },
  {
    id: 'xianling_dan', name: '仙灵丹', type: '丹药', tier: '仙', price: 180000,
    desc: '沾染一丝上界仙气的绝品宝丹，修为暴涨且可重塑生机、增寿五十载。',
    use: { expPct: 0.35, hpPct: 0.8, mpPct: 0.8, lifespan: 50 }, stack: true,
  },
  {
    id: 'qiannian_lingcao', name: '千年灵草', type: '灵材', tier: '玄', price: 320,
    desc: '历经十个甲子方成的灵药主材，炼制结金丹与高阶宝丹不可或缺。',
    stack: true,
  },
  {
    id: 'xingchen_sha', name: '星辰砂', type: '灵材', tier: '地', price: 2400,
    desc: '天外陨星坠落归墟所化的银辉灵砂，祭炼本命法宝可令锋芒大涨。',
    stack: true,
  },
  {
    id: 'longxue_jing', name: '龙血精', type: '灵材', tier: '天', price: 18000,
    desc: '太古蛟龙遗留的真血结晶，直接吞服可强筋壮骨、延寿三十载。',
    use: { attrs: { 根骨: 6 }, hpPct: 0.5, lifespan: 30 }, stack: true,
  },
  {
    id: 'faze_canpian', name: '法则残片', type: '灵材', tier: '天', price: 28000,
    desc: '古仙大战崩碎的大道印记，参悟吸收可大幅精进法则感悟与神识。',
    use: { lawExp: 80, attrs: { 神识: 3, 悟性: 3 } }, stack: true,
  },
];

export const ITEM_BY_ID = Object.fromEntries(ITEMS.map((i) => [i.id, i]));

export function itemName(id) {
  return ITEM_BY_ID[id]?.name || id;
}
