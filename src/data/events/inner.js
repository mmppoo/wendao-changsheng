/** 内景：闭关、入梦、心魔、顿悟。修炼时小概率触发。 */
export const INNER_EVENTS = [
  {
    id: 'ev_inner_dream', title: '梦', pool: 'inner', tier: 1, weight: 8, minRealm: 0,
    text: '你梦见自己站在一片没有边的水上。\n\n水里有个人在往下沉，穿着和你一样的衣服。他没有挣扎，只是看着你。',
    choices: [
      {
        label: '伸手拉他', hint: '道心',
        outcome: { text: '你抓住他的手。他的手很凉。\n\n拉上来的一瞬间，你看清了他的脸——是你自己，老了很多。\n\n他说：「别急。」然后你醒了。', effects: { attrs: { 道心: 3 }, demon: -3 } },
      },
      {
        label: '看着他沉下去', hint: '',
        outcome: { text: '你站在水面上，看着他一点一点沉下去。\n\n最后一只眼睛没入水时，你醒了。枕头是湿的。', effects: { demon: 5, attrs: { 悟性: 1 } } },
      },
    ],
  },
  {
    id: 'ev_inner_demon', title: '心魔低语', pool: 'inner', tier: 2, weight: 7, minRealm: 0,
    require: 'demon >= 10',
    text: '识海里有个声音在说话。它用的是你的声音，但语气比你温柔。\n\n「何必呢。」它说，「你已经很累了。」',
    choices: [
      {
        label: '不理它', hint: '道心检定',
        roll: {
          p: 0.55, attrs: { 道心: 0.012 },
          success: { text: '你继续吐纳。声音渐渐远了，像退潮。', effects: { demon: -5, attrs: { 道心: 2 } } },
          fail: { text: '你越是不理它，它说得越多。它说了你所有不敢想的事。\n\n你睁开眼时，天已经黑了。', effects: { demon: 8, attrs: { 道心: 1 } } },
        },
      },
      {
        label: '跟它说话', hint: '危险的好奇',
        outcome: { text: '「你到底想要什么？」\n\n「我想要你想要的东西。」它说，「我只是比你诚实。」\n\n你沉默了很久。', effects: { demon: 12, attrs: { 悟性: 3 } } },
      },
      {
        label: '以清心咒镇压', hint: '需道心 ≥ 30',
        require: 'char.attrs.道心 >= 30', requireHint: '道心不足',
        outcome: { text: '咒音一起，识海里的声音像被烫到一样缩了回去。\n\n你听见它最后说了一句：「你会来找我的。」', effects: { demon: -15, attrs: { 道心: 3 } } },
      },
    ],
  },
  {
    id: 'ev_inner_insight', title: '顿悟', pool: 'inner', tier: 4, weight: 3, minRealm: 0,
    once: true,
    text: '你看着窗外的一片叶子，看了很久。\n\n风来，叶子动。风停，叶子还在动。\n\n忽然之间，你明白了什么。那个道理太大，你的脑子装不下，但你的身体记住了。',
    choices: [
      {
        label: '抓住它', hint: '大机缘',
        outcome: { text: '你盘膝坐下，一坐就是七天。\n\n七天后你起身，觉得整个世界都轻了一点。', effects: { expPct: 0.6, attrs: { 悟性: 8, 道心: 5 }, lifespan: 20, title: '顿悟', flag: { 顿悟: true } } },
      },
      {
        label: '不去抓，让它过去', hint: '另一种悟',
        outcome: { text: '你没有动。那个道理从你身体里穿过去，像风穿过窗子。\n\n你笑了一下。这大概也是一种懂。', effects: { attrs: { 道心: 10 }, demon: -10, flag: { 顿悟: true } } },
      },
    ],
  },
  {
    id: 'ev_inner_memory', title: '旧事', pool: 'inner', tier: 1, weight: 8, minRealm: 0,
    text: '入定时，一段很久以前的记忆浮了上来。\n\n那年你七岁，蹲在门口等一个人回来。等到天黑，等到睡着，那个人也没回来。',
    choices: [
      {
        label: '把这段记忆看完', hint: '',
        outcome: { text: '你在记忆里陪那个孩子坐了一夜。\n\n天亮时，孩子站起来，拍拍屁股上的土，自己回屋了。\n\n你忽然很想抱抱他。', effects: { attrs: { 道心: 4 }, demon: -6 } },
      },
      {
        label: '压下去', hint: '',
        outcome: { text: '你把记忆按回原处。它挣扎了一下，沉下去了。\n\n但它没有消失。', effects: { demon: 4 } },
      },
    ],
  },
  {
    id: 'ev_inner_body', title: '身体', pool: 'inner', tier: 2, weight: 6, minRealm: 1,
    text: '你发现自己的指甲变成了半透明，能看见里面的血丝。\n\n皮肤下面，有一层很淡的光在流动。',
    choices: [
      {
        label: '仔细看', hint: '悟性',
        outcome: { text: '那是灵气在改造你的身体。你正在一点点地，不再是原来的那个人。\n\n你盯着自己的手看了很久。', effects: { attrs: { 根骨: 2, 悟性: 2 }, demon: 2 } },
      },
      {
        label: '不去想', hint: '',
        outcome: { text: '你把手缩进袖子里，继续修炼。\n\n有些事想多了没好处。', effects: { attrs: { 道心: 2 } } },
      },
    ],
  },
  {
    id: 'ev_inner_void', title: '虚空', pool: 'inner', tier: 3, weight: 4, minRealm: 3,
    once: true,
    text: '入定到极深处，你忽然发现自己不在身体里了。\n\n周围是纯粹的黑，没有上下，没有时间。你听见自己的心跳，从很远的地方传来。',
    choices: [
      {
        label: '往前走', hint: '危险',
        roll: {
          p: 0.45, attrs: { 道心: 0.012, 神识: 0.008 },
          success: { text: '黑暗尽头有一点光。你走过去，光里是一扇门。\n\n你没有推门。你只是看了看，然后转身回来了。\n\n醒来后，你的神识强了一大截。', effects: { attrs: { 神识: 10, 道心: 5 }, expPct: 0.3, lifespan: 30 } },
          fail: { text: '你迷路了。在黑暗里走了很久很久，久到忘了自己是谁。\n\n最后是一声鸡叫把你叫了回来。', effects: { demon: 15, attrs: { 神识: 3 } } },
        },
      },
      {
        label: '立刻回身', hint: '',
        outcome: { text: '你转身就回。身体像一件旧衣服，你钻进去，扣好。\n\n心跳慢慢回来了。', effects: { attrs: { 道心: 3 } } },
      },
    ],
  },
  {
    id: 'ev_inner_doubt', title: '道心之问', pool: 'inner', tier: 3, weight: 5, minRealm: 1,
    require: 'age >= 40 * 12',
    text: '你忽然问自己：我为什么要长生？\n\n这个问题一出来，灵气就乱了。你坐在蒲团上，出了一身冷汗。',
    choices: [
      {
        label: '想清楚它', hint: '道心检定',
        roll: {
          p: 0.5, attrs: { 道心: 0.01, 悟性: 0.008 },
          success: { text: '你想了三天三夜，最后想到的答案是：我不想死。\n\n这个答案很俗，但它是真的。灵气重新顺了。', effects: { attrs: { 道心: 8 }, expPct: 0.2, flag: { 道心之问: true } } },
          fail: { text: '你想不明白。越想越乱，最后灵气逆行，你吐了一口血。', effects: { hp: -40, demon: 10 } },
        },
      },
      {
        label: '不想了，继续修', hint: '',
        outcome: { text: '你把问题压下去，继续吐纳。\n\n但它像一根刺，扎在那儿了。', effects: { demon: 6, attrs: { 悟性: 1 } } },
      },
    ],
  },
];
