/** 主线级剧情链：由 STORY_TRIGGERS 在满足条件时插入当前回合。 */
export const STORY_EVENTS = [
  {
    id: 'story_jade_1', title: '玉牌', pool: 'story', tier: 3, weight: 0, minRealm: 0,
    text: '那枚刻着你名字的玉牌，又出现在你的枕边。\n\n你明明把它埋进了土里。',
    choices: [
      {
        label: '握住它', hint: '',
        outcome: {
          text: '玉牌发热，你听见一个很老的声音：\n\n「第九个了。」\n\n「什么第九个？」\n「第九个拿到这块牌的人。前八个，都死在筑基之前。」',
          effects: { flag: { 玉牌说话: true } },
          goto: 'story_jade_2',
        },
      },
      {
        label: '把它砸碎', hint: '力量检定',
        roll: {
          p: 0.45, attrs: { 根骨: 0.01 },
          success: { text: '玉牌碎了。碎片里流出一缕黑气，散在空气里。\n\n你听见一声很轻的叹息。', effects: { demon: -10, attrs: { 道心: 3 }, flag: { 玉牌碎: true } } },
          fail: { text: '你砸下去，玉牌没碎，你的手流血了。血被它吸了进去。', effects: { hp: -20, demon: 10 } },
        },
      },
    ],
  },
  {
    id: 'story_jade_2', title: '第九个', pool: 'story', tier: 3, weight: 0,
    text: '玉牌里的声音继续说：\n\n「我们是同一块料子做的。每死一个，就换一个。你是第九个。」\n\n「那我死了呢？」\n「第十个。」',
    choices: [
      {
        label: '问：怎么破', hint: '',
        outcome: { text: '「破不了。」它说，「除非你活得比它久。」\n\n「它是谁？」\n\n「它是写这块牌子的人。」', effects: { flag: { 玉牌来历: true } }, goto: 'story_jade_3' },
      },
      {
        label: '把玉牌扔进火山', hint: '花费 200 灵石雇人',
        require: 'stones >= 200', requireHint: '没有灵石',
        cost: { stones: 200 },
        outcome: { text: '你雇了个散修，把玉牌扔进了南疆的火山口。\n\n三个月后，它又出现在你的枕边，边缘有一点焦。', effects: { demon: 5, flag: { 玉牌烧过: true } }, goto: 'story_jade_3' },
      },
    ],
  },
  {
    id: 'story_jade_3', title: '写牌子的人', pool: 'story', tier: 4, weight: 0,
    text: '你按声音的指引，在一座无名山下挖了三丈。\n\n挖出一口棺材。棺材里没有人，只有一块和玉牌一模一样的石碑，碑上刻着：\n\n「此生不许成仙。」',
    choices: [
      {
        label: '在碑上刻自己的名字', hint: '逆天',
        outcome: {
          text: '你刻完了最后一笔，碑裂了。\n\n天上打了一个雷，很远。\n\n你听见那个声音笑了：「有胆子。第十个，也许不一样。」',
          effects: { attrs: { 道心: 10, 悟性: 5 }, lifespan: 50, expPct: 0.4, title: '刻碑人', flag: { 刻碑: true } },
        },
      },
      {
        label: '把碑埋回去', hint: '稳',
        outcome: { text: '你把土填回去，踩实，又在上面种了一棵草。\n\n「我不惹你，你也别惹我。」你说。\n\n风把草吹得晃了晃。', effects: { attrs: { 道心: 5 }, demon: -10 } },
      },
    ],
  },
  {
    id: 'story_mother_1', title: '血色玉牌', pool: 'story', tier: 3, weight: 0, minRealm: 1,
    text: '你贴身的血玉牌忽然烫起来。\n\n你听见一个女人的声音，很轻，像隔着很多年：\n\n「别回北荒。」\n\n然后是一阵铁链拖地的声音。',
    choices: [
      {
        label: '回北荒', hint: '危险',
        outcome: { text: '你连夜北上。越往北，血玉牌越烫。\n\n在血魔宗的山门外，你看见一根石柱，柱上锁着一具骨架。骨架的手腕上，系着和你一样的红绳。', effects: { flag: { 见母骸: true } }, goto: 'story_mother_2' },
      },
      {
        label: '不去', hint: '',
        outcome: { text: '你把玉牌塞进储物袋最深处。\n\n那天夜里，你梦见一个女人背对着你，一直在走。你追不上。', effects: { demon: 8, attrs: { 道心: 2 } } },
      },
    ],
  },
  {
    id: 'story_mother_2', title: '血池底', pool: 'story', tier: 4, weight: 0,
    text: '你潜入血池。池底有一座倒悬的宫殿，宫殿里全是镜子。\n\n每面镜子里都有一个女人，长得都一样。她们同时开口：\n\n「你终于来了。」',
    choices: [
      {
        label: '找出真的那个', hint: '神识检定',
        roll: {
          p: 0.5, attrs: { 神识: 0.012 },
          success: { text: '你闭上限，用神识一寸寸摸过去。第七面镜子是温的。\n\n你伸手进去，牵出一缕残魂。她看着你，眼泪掉下来：「长这么大了。」', effects: { attrs: { 神识: 5, 道心: 4 }, flag: { 母魂: true } }, goto: 'story_mother_3' },
          fail: { text: '你分不清。所有的镜子都在喊你。你在宫殿里转了很久，最后被血池的水推了出来。', effects: { hp: -60, demon: 10 } },
        },
      },
      {
        label: '打碎所有镜子', hint: '',
        outcome: { text: '镜子全碎了。碎片里映出几千个你。\n\n你站在中间，忽然发现自己也在碎。', effects: { hp: -40, demon: 12 } },
      },
    ],
  },
  {
    id: 'story_mother_3', title: '残魂', pool: 'story', tier: 4, weight: 0,
    text: '母亲的残魂只够说三句话。\n\n「你父亲不是魔。」\n「血魔宗在养一个东西。」\n「别让它看见你。」',
    choices: [
      {
        label: '问她：那你呢', hint: '',
        outcome: { text: '她笑了笑，开始变淡。\n\n「我啊……我这一辈子，就做对了一件事。」\n\n「什么？」\n\n「把你送出去了。」\n\n她散了。血玉牌裂成两半。', effects: { attrs: { 道心: 8 }, demon: -20, lifespan: 30, title: '母赠', items: ['xueyu'], flag: { 母魂散: true } } },
      },
      {
        label: '把她的残魂收进玉牌', hint: '逆天而行',
        outcome: { text: '你用禁术把残魂封进玉牌。\n\n她还在，但再也不能说话了。你贴身带着它，像带着一块石头。', effects: { demon: 15, attrs: { 神识: 5 }, flag: { 母魂封: true } } },
      },
    ],
  },
  {
    id: 'story_cave_1', title: '洞天', pool: 'story', tier: 4, weight: 0, minRealm: 2,
    text: '你在山中避雨，误入一处石缝。\n\n石缝后面是一个小世界：一亩田，一间屋，一口井。田里的稻子熟了，没有人收。\n\n屋里的桌上有一封信，信上写：「给下一个进来的人。」',
    choices: [
      {
        label: '读信', hint: '',
        outcome: {
          text: '「我叫沈砚，筑基三百一十年，没能结丹。\n\n这地方是我一块一块搬出来的。我死之前把它留在这儿，谁进来归谁。\n\n只有一个条件：别让它荒了。」',
          effects: { flag: { 洞天: true }, attrs: { 道心: 3 } },
          goto: 'story_cave_2',
        },
      },
      {
        label: '先看看井', hint: '',
        outcome: { text: '井里有水，水面上浮着一层灵气，浓得几乎成雾。\n\n你捧起一口喝了。经脉里像过了一阵春风。', effects: { expPct: 0.3, flag: { 洞天: true } }, goto: 'story_cave_2' },
      },
    ],
  },
  {
    id: 'story_cave_2', title: '一亩田', pool: 'story', tier: 4, weight: 0,
    text: '你在这里住了下来。\n\n白天种田，晚上打坐。田里的稻子收了一茬，又种了一茬。\n\n有一天你在田埂上坐着，忽然觉得，这样过一辈子也不错。',
    choices: [
      {
        label: '留下', hint: '放弃一部分野心',
        outcome: { text: '你在这里住了三年。\n\n三年后你走出石缝，境界没涨多少，但整个人像被水洗过。\n\n石缝在你身后合上了。', effects: { attrs: { 道心: 10, 悟性: 5 }, demon: -20, expPct: 0.3, flag: { 洞天居住: true }, time: 36 } },
      },
      {
        label: '把洞天炼成自己的', hint: '空间灵根专属',
        require: 'char.rootId === "kongjian"', requireHint: '你没有撕裂虚空的本事',
        outcome: { text: '你用了七天，把整个小世界折起来，收进袖子里。\n\n从此你随身带着一亩田。累的时候进去坐坐。', effects: { attrs: { 神识: 10 }, lifespan: 100, flag: { 随身洞天: true }, title: '洞天主人' } },
      },
    ],
  },
  {
    id: 'story_lover_1', title: '一个人', pool: 'story', tier: 3, weight: 0, minRealm: 1,
    require: 'flag("道侣")',
    text: '你回到洞府，看见她/他坐在灯下，正在补一件旧衣服。\n\n那件衣服是你三十年前穿的，早就不能穿了。',
    choices: [
      {
        label: '坐下，陪她/他', hint: '',
        outcome: { text: '你坐了一夜。她/他没说话，你也没说。\n\n天亮时，衣服补好了。针脚很密。', effects: { relation: { 道侣: 20 }, attrs: { 道心: 3 } } },
      },
      {
        label: '说：我要闭关了', hint: '',
        outcome: { text: '她/他抬起头，笑了一下：「去吧。」\n\n你走到门口，听见针掉在地上的声音。', effects: { relation: { 道侣: -20 }, demon: 5 } },
      },
    ],
  },
  {
    id: 'story_ascend_1', title: '天门', pool: 'story', tier: 5, weight: 0, minRealm: 8,
    text: '你站在山巅。天上有门，门是虚的，看得见，摸不着。\n\n守门的神将低头看你：「你要进来吗？」\n\n「进去之后呢？」\n「进去之后就再也回不来了。」',
    choices: [
      {
        label: '进去', hint: '踏入天门，飞升上界',
        outcome: { text: '你迈出一步，山河在脚下远去。', effects: { realmSet: 9 }, ending: 'e_ascend', dynamicAscend: true },
      },
      {
        label: '再等等', hint: '留在人间（三次拒绝可触发隐藏结局）',
        outcome: { text: '你退回山巅。神将没有表情，门慢慢淡了。\n\n你听见山下有人喊你的名字。', effects: { counter: { refuse_ascend: 1 }, attrs: { 道心: 5 } } },
      },
    ],
  },
];

export const STORY_TRIGGERS = [
  { id: 'story_jade_1', when: 'flag("同名玉牌") && !flag("story:story_jade_1")' },
  { id: 'story_mother_1', when: 'char.originId === "demon_child" && realm >= 1 && !flag("story:story_mother_1")' },
  { id: 'story_cave_1', when: 'realm >= 2 && age >= 60 && !flag("story:story_cave_1")' },
  { id: 'story_lover_1', when: 'flag("道侣") && realm >= 2 && !flag("story:story_lover_1")' },
  { id: 'story_ascend_1', when: 'realm >= 8 && !flag("story:story_ascend_1")' },
];
