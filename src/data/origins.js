/**
 * 出身：你这一世是谁、在哪、什么处境。只写身份，不写流派，不剧透开场。
 * 隐性共通背景：两年前你魂穿进这具身体，磨合两年耽误了修行（开场文字里交代）。
 * id 保持稳定（farmer / fallen_clan / ...），兼容全部事件、成就与结局表达式。
 */
export const ORIGINS = [
  {
    id: 'fallen_clan', name: '没落世家少主', weight: 14,
    desc: '青石镇一户没落修仙世家的独子。原身曾是镇上的天才，如今修为跌回炼气一层，家里早已撑不起门面。',
    attrs: { 悟性: 6, 神识: 3, 道心: 3 },
    stones: 300, items: ['yinqi_dan'], flags: { 家族血仇: true, 退婚流: true, 重生停滞: true },
  },
  {
    id: 'farmer', name: '山村农家子', weight: 16,
    desc: '青石镇外山村里的农家少年，家里守着几亩薄田。资质平平，今年才摸到引气的门径。',
    attrs: { 根骨: 5, 道心: 5, 悟性: 2 },
    stones: 0, items: [], flags: { 寒门: true, 凡人流: true, 重生停滞: true },
  },
  {
    id: 'royal', name: '失宠皇子', weight: 7,
    desc: '宁朝皇帝的第七子。宫里都当你是个庸人，正要把你打发去南泽看守别院。',
    attrs: { 悟性: 3, 气运: 5, 魅力: 10 },
    stones: 1200, items: ['yinqi_dan', 'yinqi_dan'], flags: { 皇室: true, 废太子流: true, 重生停滞: true },
  },
  {
    id: 'merchant', name: '药商少东家', weight: 9,
    desc: '青石镇三代药商的独子。家里的铺子如今被二叔把持，满街都笑你是个草包。',
    attrs: { 悟性: 4, 神识: 5 },
    stones: 500, items: ['huiling_dan', 'lingcao'], flags: { 商道: true, 鉴宝流: true, 重生停滞: true },
  },
  {
    id: 'orphan', name: '破庙孤儿', weight: 13,
    desc: '没爹没娘，在青石镇外的破庙里长大，靠给人跑腿换口饭吃。',
    attrs: { 根骨: 6, 气运: 6, 道心: 3 },
    stones: 0, items: [], flags: { 野性: true, 苟道流: true, 重生停滞: true },
  },
  {
    id: 'scholar', name: '落榜书生', weight: 8,
    desc: '临河书院的学生，原本是公认的头名，今年却名落孙山。',
    attrs: { 悟性: 10, 神识: 6, 道心: 4 },
    stones: 100, items: [], flags: { 儒道: true, 文道流: true, 重生停滞: true },
  },
  {
    id: 'hunter', name: '猎户少年', weight: 10,
    desc: '青石镇后山猎户家的孩子。刚引气入体，一身力气是常年进山打猎练出来的。',
    attrs: { 根骨: 10, 道心: 3 },
    stones: 50, items: ['liegong'], flags: { 山野: true, 体修流: true, 重生停滞: true },
  },
  {
    id: 'wanderer', name: '落魄剑客', weight: 10,
    desc: '在凡俗剑馆学过几年剑，坠崖伤了经脉后被赶出师门，如今在青石镇落脚。',
    attrs: { 根骨: 5, 悟性: 4, 魅力: 6 },
    stones: 200, items: ['qingfeng_jian'], flags: { 江湖: true, 剑修流: true, 重生停滞: true },
  },
  {
    id: 'demon_child', name: '魔尊转世', weight: 6,
    desc: '前世是魔道巨擘，这一世是青石镇上人人避着走的魔裔孤儿。',
    attrs: { 根骨: 4, 神识: 6, 道心: -4 },
    stones: 300, items: ['xueyu'], flags: { 魔裔: true, 魔尊流: true, 重生停滞: true },
  },
  {
    id: 'artifact_spirit', name: '剑灵化人', weight: 4,
    desc: '你本是一柄古剑的器灵，醒来成了青石镇铁匠铺的学徒，刚学会用这副血肉引气。',
    attrs: { 神识: 12, 悟性: 6, 道心: 2 },
    stones: 0, items: ['canjian'], flags: { 器灵: true, 器灵流: true, 重生停滞: true },
  },
  {
    id: 'outsider', name: '穿越者', weight: 3,
    desc: '从另一个世界来，在青石镇醒来。无亲无故，只有一肚子别处的见识。',
    attrs: { 悟性: 8, 气运: 10, 神识: 5 },
    stones: 100, items: [], flags: { 天外: true, 穿书流: true, 重生停滞: true },
  },
];

export const ORIGIN_BY_ID = Object.fromEntries(ORIGINS.map((o) => [o.id, o]));
