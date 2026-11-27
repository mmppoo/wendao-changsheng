/**
 * 机缘（金手指）：沿用 6 个编号与全部机制，v8 改成第一纪元原典里有来由的东西。
 * perk 只写引擎里真实生效的效果（见 src/engine/game.js / effects.js / meta.js 中对 goldenFingerId 的判断）。
 * flag 键（金手指_*）被事件引用，保持不变。
 */
export const GOLDEN_FINGERS = [
  {
    id: 'gf_bottle',
    name: '青石老窑储灵瓦罐',
    tag: '养药 · 丹药流',
    icon: '罐',
    color: '#58b98a',
    desc: '青石老窑底下挖出来的一只旧瓦罐，是早年野修士烧来储灵用的。罐底还沾着窑下灵田残脉的泥，灵草放进去养，长得比外头快得多。',
    perk: '闭关时有几率养出一株灵草（结丹起为千年灵草）；洞府多一项催灵：以一株灵草换一枚丹药（随境界从引气丹到元婴丹）和两个多月的修为，手头没有灵草时先养出一株；服丹所得修为与气血约 +30%，斗法中疗伤 +20%；开局带两株灵草。',
    apply: { items: ['lingcao', 'lingcao'], flag: { 金手指_绿瓶: true } },
  },
  {
    id: 'gf_sword_elder',
    name: '赤霞古修残念',
    tag: '剑道 · 随身古修',
    icon: '剑',
    color: '#e6b95c',
    desc: '一截从白驼流沙里捡来的断剑，剑身里留着赤霞旧府一名古修的残念。说话刻薄，眼界极高，危急时会指出敌手招式的破绽。',
    perk: '开局习得《赤霞残剑诀》并携青锋剑，合计战力 +20%，悟性 +4、根骨 +3；参悟时悟性多涨 1；部分奇遇多出残念指点的选项。',
    apply: {
      items: ['qingfeng_jian'],
      techniques: [{ id: 'gf_sword_art', name: '《赤霞残剑诀》', speed: 0.08, atk: 0.06, def: 0.02, lifespan: 0, align: '正', artName: '赤霞一剑' }],
      attrs: { 悟性: 4, 根骨: 3 },
      flag: { 金手指_剑老: true },
    },
  },
  {
    id: 'gf_karma_mirror',
    name: '观星台测灵罗盘',
    tag: '观测 · 趋吉避凶',
    icon: '盘',
    color: '#7ab8d9',
    desc: '一面观星台旧制的测灵罗盘。盘心一根铜针，灵气浓处会偏，杀机近了会抖。当年沈砚经手的那一批，流落在外的没有几面。',
    perk: '神识 +6、气运 +6；奇遇检定成算 +8%，秘境破禁寻宝成算 +12%；坊市、古籍秘阁与拍卖行买价 -15%；拍卖时对手抬价的几率减半，拍得重宝后不会被人尾随；开局携护心符。',
    apply: { items: ['huxin_fu'], attrs: { 神识: 6, 气运: 6 }, flag: { 金手指_天机镜: true } },
  },
  {
    id: 'gf_stealth',
    name: '长生叟心法',
    tag: '稳健 · 藏锋隐息',
    icon: '隐',
    color: '#a3b88c',
    desc: '五域市井传说里有个扶桑长生叟，死了又在旧地复生，形容不改。这卷心法据说出自他手，只讲怎么藏住气息、怎么活得久，不讲怎么赢。',
    perk: '道心 +6、寿元 +30 年；心魔滋生减半；受到的伤害 -18%，遁走成算 +25%；拍得重宝后不会被人尾随；部分奇遇多出藏锋选项。',
    apply: { lifespan: 30, attrs: { 道心: 6 }, flag: { 金手指_苟道: true } },
  },
  {
    id: 'gf_signin',
    name: '通远商会荐书',
    tag: '行商 · 商站挂名',
    icon: '契',
    color: '#c08ae8',
    desc: '一封通远商会掌柜亲笔写的荐书。凭它可以在各地商站挂名，替商会捎信、看货、认路。商会不养闲人，也从不亏待替它跑过远路的人。',
    perk: '开局带 200 灵石与两枚引气丹作本钱；每到一处从未去过的地界，当地商站付一笔脚钱（灵石，地界越险越多）；每渡过一次破境天劫，商会送来贺仪：灵石与破障丹一枚。',
    apply: { stones: 200, items: ['yinqi_dan', 'yinqi_dan'], flag: { 金手指_道碑: true } },
  },
  {
    id: 'gf_none',
    name: '凡骨 · 不借外物',
    tag: '孤勇 · 本心问道',
    icon: '心',
    color: '#d44d38',
    desc: '不倚异宝，不托残念，只凭自己一身凡骨走这条路。',
    perk: '没有开局异宝，但道心 +5、声望获取 +25%；开局得称号「赤手问道」；每一世结算多得 2 点轮回点。',
    apply: { attrs: { 道心: 5 }, title: '赤手问道', flag: { 金手指_无外物: true } },
  },
];

export const GOLDEN_FINGER_BY_ID = Object.fromEntries(GOLDEN_FINGERS.map((g) => [g.id, g]));

/** 伴生灵兽表 */
export const PETS = [
  {
    id: 'pet_turtle', name: '玄水灵龟', icon: '龟',
    desc: '壳生八卦纹，寿与天齐，擅护主减伤与渡劫护道。',
    defBonus: 0.14, atkBonus: 0, stonesBonus: 0, luckBonus: 2, exploreBonus: 0.05,
    demonResist: 0.08, tribResist: 0.10, lifespan: 40,
  },
  {
    id: 'pet_bird', name: '青鸾雏鸟', icon: '鸾',
    desc: '尾羽带风雷，日行万里，擅破阵寻宝与加快探索。',
    atkBonus: 0.12, defBonus: 0.04, stonesBonus: 0.05, luckBonus: 6, exploreBonus: 0.25,
    demonResist: 0, tribResist: 0.05,
  },
  {
    id: 'pet_beetle', name: '噬金灵虫', icon: '虫',
    desc: '吞金噬铁，群出如云，专破修士护体灵光并搜刮灵石。',
    atkBonus: 0.18, defBonus: 0.04, stonesBonus: 0.18, luckBonus: 2, exploreBonus: 0.10,
    demonResist: 0, tribResist: 0,
  },
  {
    id: 'pet_fox', name: '九尾白狐', icon: '狐',
    desc: '通灵知人心，助主稳固道心、抵御心魔与招揽奇缘。',
    atkBonus: 0.06, defBonus: 0.06, stonesBonus: 0.06, luckBonus: 5, exploreBonus: 0.12,
    demonResist: 0.25, tribResist: 0.06, charm: 6,
  },
];

export const PET_BY_ID = Object.fromEntries(PETS.map((p) => [p.id, p]));
