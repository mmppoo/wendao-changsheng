/**
 * 金手指：随身瓶、戒中残魂、面板、鉴宝镜、藏锋诀、道碑、吞噬、御兽、凡骨。tag 只写一句它做什么，不写流派。
 * perk 只写引擎里真实生效的效果；flag 键（金手指_*）被事件引用。
 */
export const GOLDEN_FINGERS = [
  {
    id: 'gf_bottle',
    name: '掌天小绿瓶',
    tag: '催熟灵草',
    icon: '瓶',
    color: '#58b98a',
    desc: '一只来历成谜的墨绿小瓶。子夜承接星月清辉，凝露成液，滴一滴在灵草上，百年药性一夜长成。',
    perk: '闭关时常凝出灵草（结丹起为千年灵草）；洞府多一项「催灵」，以灵草换丹药和修为；服丹效果 +30%；开局带两株灵草。',
    apply: { items: ['lingcao', 'lingcao'], flag: { 金手指_绿瓶: true } },
  },
  {
    id: 'gf_sword_elder',
    name: '戒中老祖',
    tag: '残魂指点',
    icon: '戒',
    color: '#e6b95c',
    desc: '母亲留下的旧戒指里，睡着一缕上古剑修的残魂。嘴毒，眼光极高，危急关头会骂着你指出敌人的破绽。',
    perk: '开局习得老祖亲传《太虚剑意》并带一柄青锋剑，战力 +20%，悟性 +4、根骨 +3；参悟时悟性多涨；不少奇遇里老祖会插嘴给出别的路。',
    apply: {
      items: ['qingfeng_jian'],
      techniques: [{ id: 'gf_sword_art', name: '《太虚剑意》', speed: 0.08, atk: 0.06, def: 0.02, lifespan: 0, align: '正', artName: '太虚一剑' }],
      attrs: { 悟性: 4, 根骨: 3 },
      flag: { 金手指_剑老: true },
    },
  },
  {
    id: 'gf_panel',
    name: '修仙面板',
    tag: '熟练度',
    icon: '板',
    color: '#5fb3c4',
    desc: '某天睁眼，眼前多了一块只有你看得见的面板。吐纳一年，「吐纳熟练度」就往上跳一格。别人靠天赋，你靠肝。',
    perk: '每活过一年，熟练度 +1，修炼速度随之 +1%，最多 +60%；每破一个大境界，悟性 +2。',
    apply: { attrs: { 道心: 2 }, flag: { 金手指_面板: true } },
  },
  {
    id: 'gf_karma_mirror',
    name: '天机因果镜',
    tag: '鉴宝避凶',
    icon: '镜',
    color: '#7ab8d9',
    desc: '一面蒙尘的古铜镜，照得出三息之后的吉凶，也照得出一件东西的真成色。坊市捡漏、拍卖压价，你总先人一步。',
    perk: '神识 +6、气运 +6；奇遇与秘境寻宝成算更高；坊市、书肆、拍卖买价 -15%，拍到重宝不会被人盯上；开局带护心符。',
    apply: { items: ['huxin_fu'], attrs: { 神识: 6, 气运: 6 }, flag: { 金手指_天机镜: true } },
  },
  {
    id: 'gf_stealth',
    name: '龟息藏锋诀',
    tag: '藏匿修为',
    icon: '龟',
    color: '#a3b88c',
    desc: '一卷上古散修的匿息法门，外人看你永远低两个小境界。不争、不露、不死，熬到最后的才是赢家。',
    perk: '道心 +6、寿元 +30 年；心魔滋生减半；受伤 -18%，逃跑成算 +25%；拍到重宝不会被人尾随；部分奇遇多出藏锋的选项。',
    apply: { lifespan: 30, attrs: { 道心: 6 }, flag: { 金手指_苟道: true } },
  },
  {
    id: 'gf_signin',
    name: '万界道碑',
    tag: '行路得赏',
    icon: '碑',
    color: '#c08ae8',
    desc: '识海深处立着一座无字古碑。每踏上一片没去过的地界、每破一次大境界，碑上就多一道纹，掉下一份造化。',
    perk: '首次到达每个地方都有灵石入账（越凶险越多）；每渡过一次天劫，赐灵石与破障丹；开局带 200 灵石与两枚引气丹。',
    apply: { stones: 200, items: ['yinqi_dan', 'yinqi_dan'], flag: { 金手指_道碑: true } },
  },
  {
    id: 'gf_devour',
    name: '吞天魔功',
    tag: '吞噬精元',
    icon: '噬',
    color: '#b0466a',
    desc: '一篇刻在兽骨上的残缺魔功。斩一个敌人，就吞一口他的精元。越战越强，只是心里那团火，也越烧越旺。',
    perk: '斩敌所得修为 +60%，且有四分之一的机会吞得一点根骨或神识；每次吞噬心魔 +2。',
    apply: { attrs: { 根骨: 2 }, flag: { 金手指_吞噬: true } },
  },
  {
    id: 'gf_beast',
    name: '御兽灵契',
    tag: '灵宠相伴',
    icon: '兽',
    color: '#d9925a',
    desc: '你天生带着一道兽契。山里捡到的那只青鸾雏鸟，第一眼就认了你做主人。它长，你也长。',
    perk: '开局带一只二阶青鸾雏鸟；灵宠的全部加成 ×1.5。',
    apply: { pet: 'pet_bird', petLevel: 2, flag: { 金手指_御兽: true } },
  },
  {
    id: 'gf_none',
    name: '凡骨',
    tag: '本心问道',
    icon: '心',
    color: '#d44d38',
    desc: '不倚异宝，不托残魂，只凭一颗向道之心和三尺青锋，自己走出一条路。',
    perk: '没有开局异宝，但道心 +5、声望获取 +25%；开局得称号「赤手问道」；每一世结算多得 2 点轮回点。',
    apply: { attrs: { 道心: 5 }, title: '赤手问道', flag: { 金手指_无外物: true } },
  },
];

export const GOLDEN_FINGER_BY_ID = Object.fromEntries(GOLDEN_FINGERS.map((g) => [g.id, g]));

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
