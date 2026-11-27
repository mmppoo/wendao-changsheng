/**
 * 金手指 / 伴生机缘系统（网文核心流派构筑）：
 * 每一种机缘都会改变核心玩法、解锁专属剧情选项与日常收益，带来完全不同的百小时多周目体验。
 */
export const GOLDEN_FINGERS = [
  {
    id: 'gf_bottle',
    name: '掌天小绿瓶',
    tag: '苟道 · 凡人流',
    icon: '瓶',
    color: '#58b98a',
    desc: '一只不知来历的墨绿小瓶，月夜吸纳星辉，每数月凝聚一滴绿液，可催熟灵草、滋养丹田。',
    perk: '闭关与历练概率凝出百年灵草；服用丹药修为与恢复效果 +30%；可激活隐藏「催熟灵药」分支。',
    apply: { items: ['lingcao', 'lingcao'], flag: { 金手指_绿瓶: true } },
  },
  {
    id: 'gf_sword_elder',
    name: '残剑老祖魂',
    tag: '老爷爷 · 热血打脸',
    icon: '剑',
    color: '#e6b95c',
    desc: '随身古戒中沉睡着一缕上古剑尊残魂，毒舌挑剔却见识通天，常在绝境指点杀招。',
    perk: '开局赠《太虚剑意》与青锋剑，战斗攻击 +20%，参悟悟性额外 +1，解锁老祖指点隐藏选项。',
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
    tag: '算计 · 情报捡漏',
    icon: '镜',
    color: '#7ab8d9',
    desc: '一面蒙尘铜镜，能照见三息之后的死劫与宝光，坊市捡漏、拍卖压价、反杀伏击无往不利。',
    perk: '神识 +6、气运 +6；坊市/拍卖折扣 -15%；奇遇与检定成算提升；开局赠护心符。',
    apply: { items: ['huxin_fu'], attrs: { 神识: 6, 气运: 6 }, flag: { 金手指_天机镜: true } },
  },
  {
    id: 'gf_stealth',
    name: '龟息藏锋诀',
    tag: '稳健师兄 · 扮猪吃虎',
    icon: '龟',
    color: '#a3b88c',
    desc: '上古散修所创匿息秘法，外人看你永远低两重境界。越是稳健，越能出其不意反杀夺宝。',
    perk: '道心 +6、寿元 +30年；心魔增长减半；战斗防御减伤 18% 且遁走成算 +25%；触发「扮猪吃虎」奇遇。',
    apply: { lifespan: 30, attrs: { 道心: 6 }, flag: { 金手指_苟道: true } },
  },
  {
    id: 'gf_signin',
    name: '万界道碑',
    tag: '打卡 · 机缘滚雪球',
    icon: '碑',
    color: '#c08ae8',
    desc: '识海深处矗立一座无字古碑，每踏足一处新地界或突破大境界，碑面便落下一道机缘赏赐。',
    perk: '每首次云游新地点额外获赠灵石与丹药，突破大境界自动赐宝，开局赠 200 灵石与引气丹。',
    apply: { stones: 200, items: ['yinqi_dan', 'yinqi_dan'], flag: { 金手指_道碑: true } },
  },
  {
    id: 'gf_none',
    name: '纯凡骨 · 无外物',
    tag: '硬核 · 本心问道',
    icon: '心',
    color: '#d44d38',
    desc: '不借绿瓶，不靠老祖，只凭一颗向道之心与手中三尺青锋，硬生生杀出一条长生路。',
    perk: '无开局外挂，但道心 +5、全奇遇名望 +25%，结局额外结算 +2 轮回点并授予「赤手问道」名号。',
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
