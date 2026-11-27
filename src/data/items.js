/** 物品：丹药、法器、灵材、功法、符箓。use 效果由 systems 里的 applyEffects 统一处理。 */
export const ITEMS = [
  { id: 'yinqi_dan', name: '引气丹', type: '丹药', tier: '凡', price: 30,
    desc: '炼气期最寻常的丹药，服下可省一月苦功。', use: { exp: 80 }, stack: true },
  { id: 'huiling_dan', name: '回灵丹', type: '丹药', tier: '黄', price: 80,
    desc: '灵液凝成，服之灵力充盈。', use: { mp: 40 }, stack: true },
  { id: 'liaoshang_dan', name: '疗伤丹', type: '丹药', tier: '黄', price: 70,
    desc: '止血生肌，行走江湖必备。', use: { hp: 60 }, stack: true },
  { id: 'zhuji_dan', name: '筑基丹', type: '丹药', tier: '玄', price: 600,
    desc: '筑基之时服用，可大幅提升成功率。', use: { breakBonus: 18, lifespan: 5 }, stack: true },
  { id: 'pozhang_dan', name: '破障丹', type: '丹药', tier: '玄', price: 900,
    desc: '冲关破障，硬生生把瓶颈撞开一道缝。', use: { breakBonus: 25, demon: 3 }, stack: true },
  { id: 'xisui_dan', name: '洗髓丹', type: '丹药', tier: '地', price: 2600,
    desc: '洗经伐髓，改造资质。凡人也有一次重来的机会。', use: { attrs: { 根骨: 4, 悟性: 2 }, lifespan: 10 }, stack: true },
  { id: 'jiuzhuan_dan', name: '九转金丹', type: '丹药', tier: '天', price: 30000,
    desc: '九转九炼，一丹可续命三百年。', use: { lifespan: 300, hp: 9999 }, stack: true },
  { id: 'tianjie_dan', name: '天劫丹', type: '丹药', tier: '仙', price: 120000,
    desc: '以雷木为引，硬抗一道天雷。传说只有疯子才炼得出来。', use: { breakBonus: 40, hp: -500 }, stack: true },
  { id: 'qingfeng_jian', name: '青锋剑', type: '法器', tier: '黄', price: 200,
    desc: '凡铁所铸，但剑身有一线青光。', equip: { atk: 6 } },
  { id: 'liegong', name: '祖传猎弓', type: '法器', tier: '凡', price: 60,
    desc: '桑木弓，弦是狼筋。你父亲留下的。', equip: { atk: 4, crit: 2 } },
  { id: 'canjian', name: '残剑', type: '法器', tier: '地', price: 0,
    desc: '你前世的本体。锈迹斑斑，握在手里却会轻轻震鸣。', equip: { atk: 18, crit: 8 } },
  { id: 'xueyu', name: '血玉牌', type: '法器', tier: '玄', price: 0,
    desc: '母亲的遗物。贴身带着，能听见很远的哭声。', equip: { mp: 30, demon: 2 } },
  { id: 'lingcao', name: '百年灵草', type: '灵材', tier: '黄', price: 45,
    desc: '山野间采得，炼丹主料。', stack: true },
  { id: 'xuantie', name: '玄铁', type: '灵材', tier: '玄', price: 160,
    desc: '炼器上品，重逾千斤。', stack: true },
  { id: 'leimu', name: '雷击木', type: '灵材', tier: '地', price: 800,
    desc: '被天雷劈过却未死的老木，蕴含雷意。', stack: true },
  { id: 'huxin_fu', name: '护心符', type: '符箓', tier: '玄', price: 320,
    desc: '一次性护体，可挡致命一击。', use: { shield: 1 }, stack: true },
  { id: 'shenxing_fu', name: '神行符', type: '符箓', tier: '黄', price: 60,
    desc: '日行千里。逃命、赶路、赴约，都用得上。', use: { escape: 1 }, stack: true },
  { id: 'jiuzhuan_gong', name: '《九转元功》', type: '功法', tier: '天', price: 0,
    desc: '不知来历的残卷，每读一遍，经脉就宽一分。', technique: { speed: 0.25, attrs: { 根骨: 3 } } },
  { id: 'wujian_jue', name: '《无剑诀》', type: '功法', tier: '天', price: 0,
    desc: '剑不在手，剑在念。修至深处，草木皆剑。', technique: { atk: 0.3, speed: 0.1 } },
  { id: 'changchun_gong', name: '《长春功》', type: '功法', tier: '地', price: 0,
    desc: '木系养命之法，寿元绵长。', technique: { lifespan: 40, speed: 0.08 } },
];

export const ITEM_BY_ID = Object.fromEntries(ITEMS.map((i) => [i.id, i]));

export function itemName(id) {
  return ITEM_BY_ID[id]?.name || id;
}
