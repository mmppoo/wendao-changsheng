/** 人间 / 城镇 / 江湖：更大的世界事件。 */
export const WORLD_EVENTS = [
  {
    id: 'ev_lantern_festival', title: '灯会', pool: 'world', tier: 1, weight: 9, minRealm: 0,
    text: '城里在办灯会。河上漂着几百盏灯，每盏灯下都写着一个愿望。\n\n有个卖灯的小贩问你：「客人不写一个？」',
    choices: [
      {
        label: '写：长生', hint: '',
        outcome: { text: '你把灯放进河里。灯漂了很远，忽然沉了。\n\n小贩说：「沉了好，沉了就是收下了。」', effects: { attrs: { 道心: 2 }, exp: 20 } },
      },
      {
        label: '写：回家', hint: '',
        outcome: { text: '你写完这两个字，愣了很久。你已经想不起家是什么样子了。', effects: { attrs: { 悟性: 1, 道心: 3 }, demon: -3 } },
      },
      {
        label: '不写，看别人写', hint: '气运',
        outcome: { text: '你站在桥上看了一夜。有个姑娘的灯上写着「愿那人平安」，灯漂到你脚边，停住了。', effects: { attrs: { 气运: 2, 魅力: 1 } } },
      },
    ],
  },
  {
    id: 'ev_refugees', title: '流民', pool: 'world', tier: 1, weight: 9, minRealm: 0,
    text: '官道上全是流民。北边发了大水，村子没了。\n\n一个妇人抱着孩子跪在你面前，不说话，只是磕头。',
    choices: [
      {
        label: '给些灵石', hint: '散财',
        require: 'stones >= 30', requireHint: '你也没有',
        cost: { stones: 30 },
        outcome: { text: '灵石在凡人手里换不了米，但你教她去城里的药铺换。她抱着孩子跑了，跑得很急。', effects: { karma: 20, reputation: 8, attrs: { 道心: 2 } } },
      },
      {
        label: '施粥', hint: '一月',
        cost: { month: 1 },
        outcome: { text: '你在城门口支了口锅，熬了一个月的粥。最后一锅粥见底时，你听见有人叫你「仙师」。\n\n你想说自己不是，但没开口。', effects: { karma: 30, reputation: 25, attrs: { 道心: 4 }, flag: { 施粥: true } } },
      },
      { label: '绕开', hint: '', outcome: { text: '你从人群边上走过去。没有人拦你。', effects: { karma: -5 } } },
    ],
  },
  {
    id: 'ev_teahouse_story', title: '茶摊', pool: 'world', tier: 1, weight: 10, minRealm: 0,
    text: '茶摊上有个说书人，正在讲三十年前的一场大战。\n\n「那魔头一剑劈开青云山，血流了三天三夜——」\n\n他说到一半，忽然看了你一眼。',
    choices: [
      {
        label: '听完', hint: '',
        outcome: { text: '故事讲完，说书人收了你一枚铜钱，低声说：「你身上有剑气，我闻得出来。」\n\n「你是修士吧？」他笑，「我年轻时候也想修，没修成。后来我想，能讲讲你们，也挺好。」', effects: { attrs: { 悟性: 2 }, reputation: 2, flag: { 听完故事: true }, achievements: ['a_tea'] } },
      },
      {
        label: '问他为什么看你', hint: '神识',
        roll: {
          p: 0.5, attrs: { 神识: 0.01 },
          success: { text: '他不是凡人。他的瞳孔里有一圈很淡的金色。\n\n「看出来了？」他放下醒木，「我只是个记事的。你们打生打死，总得有人记下来。」', effects: { attrs: { 神识: 2 }, exp: 40, flag: { 遇见记事人: true } } },
          fail: { text: '他摇摇头：「客人多虑了。」然后继续讲他的故事。', effects: {} },
        },
      },
    ],
  },
  {
    id: 'ev_plague_village', title: '疫村', pool: 'world', tier: 2, weight: 7, minRealm: 0,
    text: '村子被封了，村口挂着白布。里面有人在哭，也有人在咳。\n\n一个老郎中站在封条外，急得直跺脚：「里面还有孩子！」',
    choices: [
      {
        label: '进去看看', hint: '医道 · 有风险',
        roll: {
          p: 0.55, attrs: { 悟性: 0.01, 道心: 0.005 },
          success: {
            text: '不是瘟疫，是井水被一具尸傀污染了。你烧了尸傀，重新引了山泉。\n\n三天后，村里第一次有人走出门晒太阳。',
            effects: { karma: 40, reputation: 30, expPct: 0.15, attrs: { 悟性: 3 }, flag: { 救疫村: true } },
          },
          fail: { text: '你也染上了。高热三天，靠灵力硬压下去。村里死了七个人。', effects: { hp: -50, karma: 10, demon: 5 } },
        },
      },
      {
        label: '在村口画一道符', hint: '消耗符箓',
        require: 'has("huxin_fu")', requireHint: '没有符',
        cost: { item: 'huxin_fu' },
        outcome: { text: '符火在村口烧了一夜。第二天，咳声少了。老郎中朝你拱手，眼泪掉在胡子上。', effects: { karma: 25, reputation: 20 } },
      },
      { label: '走了', hint: '', outcome: { text: '你走出很远，还能听见村里的咳声。', effects: { karma: -10, demon: 3 } } },
    ],
  },
  {
    id: 'ev_auction', title: '拍卖会', pool: 'world', tier: 3, weight: 6, minRealm: 1,
    text: '万宝阁的拍卖会，凭请柬入场。你混在人群里，看见台上摆着一枚黑漆漆的珠子。\n\n「最后一件，来历不明，底价一千灵石。」',
    choices: [
      {
        label: '举牌', hint: '花费 1000 灵石',
        require: 'stones >= 1000', requireHint: '灵石不足',
        cost: { stones: 1000 },
        roll: {
          p: 0.5, attrs: { 气运: 0.02 },
          success: {
            text: '珠子到手。回客栈后你滴了一滴血上去，珠子裂开，里面是一枚储物戒，戒指里有一部残缺功法。',
            effects: { items: ['jiuzhuan_gong'], expPct: 0.2, flag: { 得地阶法宝: true }, achievements: ['a_treasure'] },
          },
          fail: { text: '珠子是假的。你捏碎它的时候，里面只有一粒沙子。', effects: { demon: 3 } },
        },
      },
      {
        label: '不举牌，观察出价的人', hint: '神识',
        outcome: { text: '最后举牌的是个蒙面人。他付钱时，袖口露出一截黑色的刺青——血魔宗的标记。\n\n你记住了他的脸。', effects: { attrs: { 神识: 2 }, flag: { 血魔宗线索: true } } },
      },
      {
        label: '偷', hint: '胆大包天',
        roll: {
          p: 0.25, attrs: { 气运: 0.01, 根骨: 0.005 },
          success: { text: '你趁换场时摸走了珠子。走出三条街，才敢喘气。', effects: { items: ['xuantie'], stones: 200, karma: -15, flag: { 偷过万宝阁: true } } },
          fail: { text: '你的手刚碰到托盘，四道神识同时锁定了你。你被扔出大门，摔断了一根肋骨。', effects: { hp: -40, reputation: -20, injury: 1 } },
        },
      },
    ],
  },
  {
    id: 'ev_demon_tide', title: '妖潮', pool: 'world', tier: 3, weight: 6, minRealm: 1,
    text: '城墙上的钟敲了九下。\n\n「妖潮！妖潮来了！」\n\n远处的山林像活了一样，黑压压地往这边涌。守城的修士只有七个。',
    choices: [
      {
        label: '上城墙', hint: '战斗 · 铁甲妖猪',
        combat: {
          enemy: 'beast',
          win: {
            text: '你杀到城墙下堆满了兽尸。天亮时，活下来的人只有三个，你是其中之一。\n\n守城的老修士拍了拍你的肩，什么也没说。',
            effects: { exp: 300, reputation: 80, karma: 30, title: '守城人', flag: { 守过城: true } },
          },
          lose: { text: '你被一头妖猪撞下城墙。醒来时城已经破了，到处是火。', effects: { hp: -80, injury: 3 } },
        },
      },
      {
        label: '护着百姓撤', hint: '善缘 · 少量修为',
        cost: { month: 1 },
        outcome: { text: '你带着三百多口人从南门撤出去。走到安全的地方，有个老太太塞给你两个煮鸡蛋。\n\n鸡蛋还是温的。', effects: { karma: 50, reputation: 40, attrs: { 道心: 4 }, items: ['liaoshang_dan'] } },
      },
      { label: '趁乱走', hint: '', outcome: { text: '你混在逃难的人里出了城。回头看，城头已经烧起来了。', effects: { karma: -15, demon: 4 } } },
    ],
  },
  {
    id: 'ev_emperor_summon', title: '皇命', pool: 'world', tier: 3, weight: 5, minRealm: 1,
    text: '一队金甲禁军拦住了你，为首的太监捧着一卷明黄圣旨。\n\n「陛下有旨，请仙师入宫，为陛下炼一炉长生丹。」',
    choices: [
      {
        label: '入宫', hint: '富贵 · 因果',
        cost: { month: 3 },
        outcome: {
          text: '你在宫里待了三个月。皇帝很老了，握着你的手，问你长生是不是真的。\n\n你说不知道。他笑了，说：「朕也这么想。」\n\n临走时他赏了你一千灵石，还有一句话：「别学朕。」',
          effects: { stones: 1000, reputation: 60, karma: 10, flag: { 见过皇帝: true }, attrs: { 道心: 3 } },
        },
      },
      {
        label: '拒绝', hint: '得罪皇室',
        outcome: { text: '太监的脸白了一下，然后笑着说：「仙师清高。」\n\n三个月后，你在通缉令上看见了自己的画像。', effects: { reputation: 10, flag: { 通缉: true }, karma: 5 } },
      },
      {
        label: '反问：陛下想长生做什么', hint: '悟性',
        outcome: { text: '太监愣住了。他说这个问题，二十年来没人问过。\n\n「陛下说……想再看看太子。」\n\n你替他炼了一炉养生的丹，不收钱。', effects: { karma: 25, attrs: { 道心: 3, 悟性: 2 } } },
      },
    ],
  },
  {
    id: 'ev_old_acquaintance', title: '故人', pool: 'world', tier: 2, weight: 7, minRealm: 1, require: 'age <= 60',
    text: '街上有人叫你的名字。\n\n你回头，看见一个挑着担子的汉子，脸上有风霜，眼睛却还是少年时候的样子。\n\n「真的是你。」他说，「我以为你早死了。」',
    choices: [
      {
        label: '认他', hint: '红尘',
        outcome: { text: '你们在酒馆坐到打烊。他说他娶了媳妇，生了两个儿子，日子还过得去。\n\n「你呢？」他问。\n\n你说：我在找一样东西。\n「找到了吗？」\n「还没有。」\n他点点头，好像这很正常。', effects: { attrs: { 道心: 4 }, demon: -5, flag: { 故人: true } } },
      },
      {
        label: '装作不认识', hint: '',
        outcome: { text: '你说：「认错人了。」\n\n他愣在原地，担子从肩上滑下来。你走出很远，还听见他在后面喊你的名字。', effects: { demon: 6, attrs: { 道心: -1 } } },
      },
      {
        label: '给他一笔钱', hint: '花费 200 灵石',
        require: 'stones >= 200', requireHint: '拿不出',
        cost: { stones: 200 },
        outcome: { text: '他不要。你硬塞给他，他红着眼收下了。\n\n「你还是那样。」他说。', effects: { karma: 15, attrs: { 道心: 2 } } },
      },
    ],
  },
  {
    id: 'ev_caravan', title: '商队', pool: 'world', tier: 1, weight: 8, minRealm: 0,
    text: '一支商队在你旁边扎营。领队是个独臂汉子，正在给伙计们分肉。\n\n他看见你，扔过来一块：「吃吗？前面三百里有沙匪，吃完好上路。」',
    choices: [
      {
        label: '吃，顺便问路', hint: '',
        outcome: { text: '肉很硬，但很香。独臂汉子说他这条胳膊是去年被沙匪砍的。\n\n「你要是往那边走，帮我带句话给沙匪头子：他欠我一条胳膊。」', effects: { attrs: { 根骨: 1 }, flag: { 沙匪口信: true } } },
      },
      {
        label: '替他们守夜', hint: '一月 · 报酬',
        cost: { month: 1 },
        outcome: { text: '你守了三夜，什么也没来。领队还是给了你工钱，说：「平安夜值钱。」', effects: { stones: 80, reputation: 5, attrs: { 道心: 1 } } },
      },
    ],
  },
  {
    id: 'ev_sea_storm', title: '海难', pool: 'world', tier: 3, weight: 4, minRealm: 1,
    text: '海上起了风暴。船在浪里像一片叶子。\n\n桅杆断了，压住了两个人。船老大在喊：「弃船！弃船！」',
    choices: [
      {
        label: '救人', hint: '根骨检定',
        roll: {
          p: 0.55, attrs: { 根骨: 0.012 },
          success: { text: '你扛起断桅，把两个人拖了出来。船最后还是沉了，但所有人都上了小舢板。\n\n海上漂了两天，你一滴水没喝。', effects: { karma: 40, reputation: 30, attrs: { 根骨: 3 }, injury: 1 } },
          fail: { text: '浪打过来，你被拍进水里。断桅压着你的腿，你割破了三根手指才挣开。', effects: { hp: -70, injury: 2 } },
        },
      },
      {
        label: '御剑飞走', hint: '需筑基以上',
        require: 'realm >= 1', requireHint: '修为不足，飞不起来',
        outcome: { text: '你踩着剑飞起来，回头看了一眼。船正在沉，有人在挥手。\n\n你飞走了。', effects: { karma: -20, demon: 5, exp: 30 } },
      },
    ],
  },
  {
    id: 'ev_ancient_battlefield', title: '古战场', pool: 'world', tier: 4, weight: 4, minRealm: 2,
    once: true,
    text: '荒原上寸草不生。土是黑的，偶尔翻出一截断剑或半块甲片。\n\n夜里能听见喊杀声，从地底下传上来。',
    choices: [
      {
        label: '挖', hint: '可能挖出法宝，也可能挖出怨灵',
        cost: { month: 1 },
        roll: {
          p: 0.5, attrs: { 气运: 0.012 },
          success: { text: '你挖出一柄断剑，剑身还有灵光。它认你。', effects: { items: ['qingfeng_jian'], expPct: 0.2, flag: { 得地阶法宝: true } } },
          fail: {
            text: '你挖开一座万人坑。尸气冲上来，你当场昏了过去。醒来时，身边站着七个半透明的士兵。',
            effects: { hp: -60, demon: 15 },
            goto: 'ev_ancient_battlefield_2',
          },
        },
      },
      {
        label: '为他们立碑', hint: '道心',
        cost: { month: 1 },
        outcome: { text: '你搬了三天石头，垒了个碑，上面什么也没刻。\n\n那天夜里，荒原上第一次没有喊杀声。', effects: { karma: 40, attrs: { 道心: 6 }, exp: 100, flag: { 古战场立碑: true } } },
      },
    ],
  },
  {
    id: 'ev_ancient_battlefield_2', title: '七个士兵', pool: 'branch', tier: 4, weight: 0,
    text: '他们围着你，不说话。你看见他们身上的甲——是三百年前那场大战的样式。\n\n为首的那个开口，声音像风穿过空盔甲：「你挖我们做什么？」',
    choices: [
      {
        label: '说：对不起', hint: '',
        outcome: { text: '他们互相看了看，然后一个一个散了。最后一个走之前，把手里的一杆枪插在你脚边。\n\n枪杆上刻着两个字：守土。', effects: { attrs: { 道心: 3 }, items: ['xuantie'], karma: 10 } },
      },
      {
        label: '说：想借你们的力量', hint: '危险',
        outcome: { text: '他们笑了。笑声里有铁锈味。\n\n「借？」为首的说，「我们守了三百年，谁借过我们？」\n\n你被扔出荒原，飞了很远。', effects: { hp: -50, demon: 10 } },
      },
    ],
  },
  {
    id: 'ev_beggar_immortal', title: '乞丐', pool: 'world', tier: 5, weight: 2, minRealm: 1,
    once: true,
    text: '城门口蹲着个乞丐，衣裳烂得看不出颜色。他朝你伸手：「赏口饭吃。」\n\n你注意到，他面前的地上，一片雪都没落。',
    choices: [
      {
        label: '给他灵石', hint: '看不出深浅的人',
        require: 'stones >= 10', requireHint: '没有',
        cost: { stones: 10 },
        outcome: {
          text: '他接过灵石，扔进嘴里嚼了，像嚼豆子。\n\n「还行。」他说，「你比上一个有礼貌。」\n\n他抬手在你眉心点了一下。你眼前一黑，再睁眼时，城门口没有人。\n\n你的识海里多了一句话：莫向外求。',
          effects: { attrs: { 悟性: 10, 道心: 8 }, expPct: 0.5, lifespan: 30, title: '遇仙', flag: { 遇仙: true } },
        },
      },
      {
        label: '蹲下来跟他聊', hint: '一月',
        cost: { month: 1 },
        outcome: { text: '你陪他蹲了一个月。他说的都是废话：今天风大，明天有雨，后街的包子涨了两文。\n\n最后一天他说：「你这个人，能处。」然后走了。\n\n你后来才想明白，那一个月里，你一次都没想起修炼。', effects: { attrs: { 道心: 10 }, demon: -20, flag: { 遇仙: true } } },
      },
      { label: '绕开', hint: '', outcome: { text: '你绕开了。走了几步回头，他还在那儿，只是不再看你。', effects: {} } },
    ],
  },
  {
    id: 'ev_mortal_wedding', title: '喜宴', pool: 'world', tier: 1, weight: 8, minRealm: 0,
    text: '村里有人娶亲，摆了几十桌。你不认识任何人，但被拉进去坐下。\n\n新郎给你敬酒，脸红得像块布：「仙师，喝一杯。」',
    choices: [
      {
        label: '喝', hint: '',
        outcome: { text: '酒很烈，是村里自己酿的。你喝到第三碗，听见有人在唱小调。\n\n那一刻你忽然不想修炼了。只是一瞬间的事。', effects: { attrs: { 道心: 2 }, demon: -5, flag: { 喝到天亮: true }, achievements: ['a_wine'] } },
      },
      {
        label: '随一份礼', hint: '花费 50 灵石',
        cost: { stones: 50 },
        outcome: { text: '你把灵石放在红纸上。新郎愣住了，说太多了。\n\n你说：新婚快乐。', effects: { karma: 10, reputation: 5 } },
      },
    ],
  },
  {
    id: 'ev_lost_child', title: '走失的孩子', pool: 'world', tier: 1, weight: 8, minRealm: 0,
    text: '一个五六岁的孩子在路边哭。他说他叫狗剩，找不到娘了。\n\n远处有集市，人很多。',
    choices: [
      {
        label: '带他找娘', hint: '耗时',
        cost: { month: 1 },
        outcome: { text: '你带着他在集市里转了半日，最后在一个卖糖人的摊子前找到了他娘。\n\n那妇人抱着孩子，反复给你作揖。孩子从她怀里探出头，把手里的糖人递给你。\n\n糖人已经化了。', effects: { karma: 20, attrs: { 道心: 2 }, items: ['liaoshang_dan'] } },
      },
      {
        label: '给他指个方向', hint: '',
        outcome: { text: '你指了指集市。他跑了两步，又回头看你。\n\n你没有跟上去。', effects: { karma: -5 } },
      },
    ],
  },
  {
    id: 'ev_love_meet', title: '同船', pool: 'world', tier: 2, weight: 6, minRealm: 1,
    text: '渡船在江心停了半日，船家说水下有东西，不肯走。\n\n同船的女修一直在船尾打坐。你注意到她的呼吸很轻，轻到像是随时会断。她睁开眼，正好看见你在看她。\n\n「你也是去南边？」她问。\n\n江面起了雾，你看不清她的脸，只看见她袖口绣着半枝枯梅。',
    choices: [
      {
        label: '与她论道，聊到雾散',
        outcome: { text: '你们从水气谈到剑意，从剑意谈到小时候。\n\n雾散的时候，船已经靠岸了。她跳下船，回头说：「我叫……算了，下次见面再说。」\n\n你没问她名字，她也没问你。', effects: { attrs: { 悟性: 1, 道心: 1 }, relation: { 故人: 15 }, flag: { 同船: true } } },
      },
      {
        label: '结为道侣，此后同行',
        cost: { month: 6 },
        outcome: { text: '她把枯梅袖口给你看，说这是她师门死绝那年绣的。\n\n你说，那以后我陪着你。\n\n她笑了笑，没说话，把手放进你手里。江风很冷，她的手更冷。', effects: { attrs: { 道心: 5 }, relation: { 道侣: 40 }, flag: { 道侣: true }, karma: 5 } },
      },
      {
        label: '闭目养神，各走各路',
        outcome: { text: '你闭上眼。她的呼吸声在雾里待了一会儿，然后上了岸。\n\n很多年后你还记得那半枝枯梅，但已经想不起她的声音。', effects: { attrs: { 道心: 2 } } },
      },
    ],
  },
];
