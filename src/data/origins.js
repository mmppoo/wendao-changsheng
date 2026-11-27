/** 出身（v8）：沿用 11 个出身编号，全部改成第一纪元第 1 年、主角十六岁时的出身。开局资源与 flags 不变。 */
export const ORIGINS = [
  {
    id: 'farmer', name: '青石镇农户之子', weight: 16,
    desc: '你生在青石镇东田边上，家里租着两亩薄田，祖上三代种地。十岁那年，玄衡别院的执事来量灵田，你远远看见那人手里的符纸自己亮了起来。',
    attrs: { 根骨: 5, 道心: 5, 悟性: 1 },
    stones: 0, items: [], flags: { 寒门: true },
    hook: '征粮令一年比一年重。你比谁都知道饿的滋味，也比谁都能忍。',
  },
  {
    id: 'fallen_clan', name: '河洛门阀庶子', weight: 12,
    desc: '你是河洛一户门阀的庶出旁支。父母相继亡故后，嫡支借清丈的风声收走了你家名下的田契，只留给你半座宅子和一柜族塾里的旧书。',
    attrs: { 悟性: 6, 神识: 3, 道心: 2 },
    stones: 300, items: ['yinqi_dan'], flags: { 家族血仇: true },
    hook: '母亲临终前把一张田契的底稿缝进你的衣襟。那几十亩地，本该是你家的。',
  },
  {
    id: 'royal', name: '宁朝宗室远支', weight: 6,
    desc: '你是宁朝宗室的远支，名字写在玉牒最末一页。在宁京锦衣玉食长到十六岁，宫里的供奉替你摸过一回根骨，说你有修行的底子。',
    attrs: { 悟性: 3, 气运: 5, 魅力: 10 },
    stones: 1200, items: ['yinqi_dan', 'yinqi_dan'], flags: { 皇室: true },
    hook: '户部的账已经空了，宗室的名分还在。这个姓能护你，也能招来杀身之祸。',
  },
  {
    id: 'merchant', name: '青崖药行之家', weight: 9,
    desc: '你家在青崖镇开药行，三代收七十二涧药农的药，再转卖到各地。你识得百草，也识得人心。',
    attrs: { 悟性: 4, 神识: 4 },
    stones: 500, items: ['huiling_dan', 'lingcao'], flags: { 商道: true },
    hook: '你从小在柜台后算账，知道一枚灵石能换几条命，也知道上游一放浆，下游的药价要涨几成。',
  },
  {
    id: 'orphan', name: '朔部孤儿', weight: 14,
    desc: '你生在朔川草滩。八岁那年冬营遭了雪灾，部落往北迁时把你落在代北驿外，是驿里的老卒把你捡了回去。',
    attrs: { 根骨: 6, 气运: 6, 道心: 3 },
    stones: 0, items: [], flags: { 野性: true },
    hook: '你说话还带着草滩的口音。你活下来的每一天，都是运气。',
  },
  {
    id: 'scholar', name: '临河仓吏之家', weight: 8,
    desc: '父亲是临河粮码头的老仓吏。你在账房里长大，六岁拨算盘，十岁替父亲誊账。嘉澜十四年那桩漂没案，他翻来覆去讲了你一整个童年。',
    attrs: { 悟性: 10, 神识: 6, 道心: 4 },
    stones: 100, items: [], flags: { 儒道: true },
    hook: '你习惯先问账对不对得上。这让你慢，也让你走得远。',
  },
  {
    id: 'hunter', name: '北境军户', weight: 10,
    desc: '你生在雁门关下的军户人家，七岁能开弓，十二岁跟着父亲上过烽燧。家里那张弓传了三代。',
    attrs: { 根骨: 10, 道心: 3 },
    stones: 50, items: ['liegong'], flags: { 山野: true },
    hook: '饷银欠了一年多。你信手里的弓，不信公文。',
  },
  {
    id: 'wanderer', name: '黑风寨出身', weight: 10,
    desc: '你在芦洲旧河闸边长大，十二岁就跟着黑风寨的船收过路钱。去年你带着一把剑下了船，没再回去。',
    attrs: { 根骨: 5, 悟性: 4, 魅力: 6 },
    stones: 200, items: ['qingfeng_jian'], flags: { 江湖: true },
    hook: '寨里有人记着你的好，也有人记着你欠的账。',
  },
  {
    id: 'demon_child', name: '白驼遗孤', weight: 6,
    desc: '你母亲是赤霞遗脉的人。她死在白驼驿外的沙丘下，死前把一枚血色玉牌塞进你的襁褓，说：别回白驼。',
    attrs: { 根骨: 4, 神识: 6, 道心: -4 },
    stones: 300, items: ['xueyu'], flags: { 魔裔: true },
    hook: '玉牌贴着心口是温的。你身上有洗不掉的血味。',
  },
  {
    id: 'artifact_spirit', name: '器铺学徒', weight: 4,
    desc: '你在青石镇沈砚的器铺当了四年学徒。铺子角落里有一截从西陲收来的残剑，别人碰它冰手，你碰它是温的。师父把它给了你。',
    attrs: { 神识: 12, 悟性: 6, 道心: 2 },
    stones: 0, items: ['canjian'], flags: { 器灵: true },
    hook: '你摸铁就知道成色，闭上眼也能听出炉火欠几分。',
  },
  {
    id: 'outsider', name: '河湾渡船工之后', weight: 1,
    desc: '你是河湾渡一个船工的儿子，十六岁那年的一个早上，你醒在船舱里，脑子里多了另一个世界的记忆：霓虹、屏幕、一份做不完的工作。',
    attrs: { 悟性: 8, 气运: 10, 神识: 5 },
    stones: 100, items: [], flags: { 天外: true },
    hook: '岸上有人喊你解缆。你不知道自己为什么会在这里，只知道今天的船还得摆。',
  },
];

export const ORIGIN_BY_ID = Object.fromEntries(ORIGINS.map((o) => [o.id, o]));
