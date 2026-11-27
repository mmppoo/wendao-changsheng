/**
 * 金手指 / 伴生机缘系统（网文核心流派构筑）：
 * 每一种机缘都会改变核心玩法、解锁专属剧情选项与日常收益，带来完全不同的百小时多周目体验。
 */
export const GOLDEN_FINGERS = [
  {
    id: 'gf_bottle',
    name: '掌天小绿瓶',
    tag: '苟道 · 炼药流',
    icon: '瓶',
    color: '#58b98a',
    desc: '一只来历成谜的墨绿小瓶，子夜承接星月清辉，凝露成液，可催熟灵草、滋养丹田。',
    perk: '闭关与历练有概率凝出百年灵草；服丹效用 +30%；解锁「绿瓶催灵」专属行动。',
    apply: { items: ['lingcao', 'lingcao'], flag: { 金手指_绿瓶: true } },
  },
  {
    id: 'gf_sword_elder',
    name: '残剑老祖魂',
    tag: '剑道 · 随身老祖',
    icon: '剑',
    color: '#e6b95c',
    desc: '古戒中蛰伏着一缕太古剑尊残魂，言语刻薄却眼界通天，常于危局指点剑招破绽。',
    perk: '开局习得《太虚剑意》并携青锋剑，战力 +20%，参悟额外 +1 悟性，解锁老祖传音分支。',
    apply: {
      items: ['qingfeng_jian'],
      techniques: [{ id: 'taixu_jianyi', name: '《太虚剑意》', atk: 0.2, speed: 0.08 }],
      attrs: { 悟性: 4, 根骨: 3 },
      flag: { 金手指_剑老: true },
    },
  },
  {
    id: 'gf_karma_mirror',
    name: '天机因果镜',
    tag: '天机 · 鉴宝捡漏',
    icon: '镜',
    color: '#7ab8d9',
    desc: '一面蒙尘古铜镜，可映照三息后的吉凶死劫与灵宝真气，坊市鉴漏、暗拍压价皆先人一步。',
    perk: '神识 +6、气运 +6；坊市与拍卖折扣 -15%；奇遇检定成算提升；开局携护心符。',
    apply: { items: ['huxin_fu'], attrs: { 神识: 6, 气运: 6 }, flag: { 金手指_天机镜: true } },
  },
  {
    id: 'gf_stealth',
    name: '龟息藏锋诀',
    tag: '稳健 · 藏锋隐息',
    icon: '龟',
    color: '#a3b88c',
    desc: '上古散修秘传匿息法门，外人窥之永远低两重境界。平日藏拙守静，动则雷霆反杀。',
    perk: '道心 +6、寿元 +30年；心魔滋生减半；受创减伤 18% 且遁走成算 +25%；触发藏锋奇遇。',
    apply: { lifespan: 30, attrs: { 道心: 6 }, flag: { 金手指_苟道: true } },
  },
  {
    id: 'gf_signin',
    name: '万界道碑',
    tag: '游历 · 碑文赐宝',
    icon: '碑',
    color: '#c08ae8',
    desc: '识海深处矗立一座无字古碑，每踏足新地界或破开大境界，碑面便铭刻道纹、降下造化。',
    perk: '首抵各地界获赠灵石与丹药；渡劫破境自动赐宝；开局携 200 灵石与两枚引气丹。',
    apply: { stones: 200, items: ['yinqi_dan', 'yinqi_dan'], flag: { 金手指_道碑: true } },
  },
  {
    id: 'gf_none',
    name: '纯凡骨 · 不借外物',
    tag: '孤勇 · 本心问道',
    icon: '心',
    color: '#d44d38',
    desc: '不倚异宝，不托残魂，唯凭一颗向道赤心与三尺青锋，在漫漫仙途中自辟通天大道。',
    perk: '无开局异宝加持，但道心 +5、名望获取 +25%，终章额外结算 +2 轮回点并赐名「赤手问道」。',
    apply: { attrs: { 道心: 5 }, title: '赤手问道', flag: { 金手指_无外物: true } },
  },
];

export const GOLDEN_FINGER_BY_ID = Object.fromEntries(GOLDEN_FINGERS.map((g) => [g.id, g]));

/** 伴生灵兽表 */
export const PETS = [
  { id: 'pet_turtle', name: '玄水灵龟', icon: '龟', desc: '壳生八卦纹，寿与天齐，擅护主减伤。', defBonus: 0.14, lifespan: 40 },
  { id: 'pet_bird', name: '青鸾雏鸟', icon: '鸾', desc: '尾羽带风雷，日行万里，擅破阵寻宝。', atkBonus: 0.14, luck: 5 },
  { id: 'pet_beetle', name: '噬金灵虫', icon: '虫', desc: '吞金噬铁，群出如云，专破修士护体灵光。', atkBonus: 0.2, stonesBonus: 0.15 },
  { id: 'pet_fox', name: '九尾白狐', icon: '狐', desc: '通灵知人心，助主稳固道心、抵御心魔。', demonResist: 0.25, charm: 6 },
];

export const PET_BY_ID = Object.fromEntries(PETS.map((p) => [p.id, p]));
