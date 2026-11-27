/** 出身：开局资源与专属剧情钩子。 */
export const ORIGINS = [
  {
    id: 'farmer', name: '农家子', weight: 16,
    desc: '你出生在青牛村，祖上三代种田。十岁那年，你在后山看见一道剑光劈开云层。',
    attrs: { 根骨: 5, 道心: 5, 悟性: 1 },
    stones: 0, items: [], flags: { 寒门: true },
    hook: '你比谁都知道饿的滋味，也比谁都能忍。',
  },
  {
    id: 'fallen_clan', name: '没落仙族', weight: 12,
    desc: '你家曾是筑基世家，如今只剩半座破宅与一柜发霉的族谱。',
    attrs: { 悟性: 6, 神识: 3, 道心: 2 },
    stones: 300, items: ['yinqi_dan'], flags: { 家族血仇: true },
    hook: '族谱最后一页写着：此仇不报，非赵氏子孙。',
  },
  {
    id: 'royal', name: '皇室宗亲', weight: 6,
    desc: '你是大梁的七皇子。锦衣玉食十八年，直到国师说你有仙缘。',
    attrs: { 悟性: 3, 气运: 5, 魅力: 10 },
    stones: 1200, items: ['yinqi_dan', 'yinqi_dan'], flags: { 皇室: true },
    hook: '你的名字本身就是一道护身符，也是一道催命符。',
  },
  {
    id: 'merchant', name: '药商之家', weight: 9,
    desc: '你家三代经营药材，识得百草，也识得人心。',
    attrs: { 悟性: 4, 神识: 4 },
    stones: 500, items: ['huiling_dan', 'lingcao'], flags: { 商道: true },
    hook: '你从小算账，知道一枚灵石能换几条命。',
  },
  {
    id: 'orphan', name: '山野孤儿', weight: 14,
    desc: '你不知道父母是谁。一头老狼把你养到八岁，然后死在一个雪夜。',
    attrs: { 根骨: 6, 气运: 6, 道心: 3 },
    stones: 0, items: [], flags: { 野性: true },
    hook: '你活下来的每一天，都是运气。',
  },
  {
    id: 'scholar', name: '书院书生', weight: 8,
    desc: '你读了十年圣贤书，却在科举前夜梦见一个白衣人对你说：读错了。',
    attrs: { 悟性: 10, 神识: 6, 道心: 4 },
    stones: 100, items: [], flags: { 儒道: true },
    hook: '你习惯先问「为什么」，这让你慢，也让你走得远。',
  },
  {
    id: 'hunter', name: '猎户之子', weight: 10,
    desc: '你七岁能开弓，十二岁独自杀过一头黑熊。',
    attrs: { 根骨: 10, 道心: 3 },
    stones: 50, items: ['liegong'], flags: { 山野: true },
    hook: '你信手感，不信道理。',
  },
  {
    id: 'wanderer', name: '江湖侠客', weight: 10,
    desc: '你行走江湖十年，杀过恶霸，也救过仇人。',
    attrs: { 根骨: 5, 悟性: 4, 魅力: 6 },
    stones: 200, items: ['qingfeng_jian'], flags: { 江湖: true },
    hook: '你欠三个人情，也结了三家仇。',
  },
  {
    id: 'demon_child', name: '魔道遗孤', weight: 6,
    desc: '你母亲是血魔宗长老。她死前把一枚血色玉牌塞进你襁褓，说：别回北荒。',
    attrs: { 根骨: 4, 神识: 6, 道心: -4 },
    stones: 300, items: ['xueyu'], flags: { 魔裔: true },
    hook: '你身上有洗不掉的血味。',
  },
  {
    id: 'artifact_spirit', name: '器灵转世', weight: 4,
    desc: '你记得自己曾是一柄剑，被人握了三千年。醒来时，你有了心跳。',
    attrs: { 神识: 12, 悟性: 6, 道心: 2 },
    stones: 0, items: ['canjian'], flags: { 器灵: true },
    hook: '你对金属的触感异常熟悉，像在摸自己的骨头。',
  },
  {
    id: 'outsider', name: '天外之人', weight: 1,
    desc: '你记得另一个世界的霓虹与屏幕。在这个世界醒来时，你知道接下来会发生什么——大致知道。',
    attrs: { 悟性: 8, 气运: 10, 神识: 5 },
    stones: 100, items: [], flags: { 天外: true },
    hook: '你看过剧本，但剧本已经开始改写。',
  },
];

export const ORIGIN_BY_ID = Object.fromEntries(ORIGINS.map((o) => [o.id, o]));
