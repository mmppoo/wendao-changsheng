/**
 * 结局：按 priority 从高到低命中第一个。
 * condition 为表达式；text 可以是字符串或 (state) => string。
 */
export const ENDINGS = [
  {
    id: 'e_ascend', name: '飞升成仙', priority: 100, tier: '仙',
    condition: 'realm >= 9',
    summary: '九重天劫散尽，天门开了一线。',
    text: (s) => `最后一道天雷落下时，你没有躲。\n\n雷光穿过身体，像穿过一张纸。你听见有人在很远的地方叫你的名字，又听见自己的骨头一寸寸变成光。\n\n天门开了。门后不是宫殿，是一片没有边际的白。\n\n你回头看了一眼人间——山河很小，小得像一张摊开的纸。纸上有一个十六岁的少年/少女，正在后山看见一道剑光。\n\n你走进白光里。\n\n此后千年，人间仍有传说：曾有人以${s.char.rootId === 'wulinggen' ? '凡骨' : '血肉'}之身，走到了天的尽头。`,
  },
  {
    id: 'e_sword_ascend', name: '一剑破天', priority: 106, tier: '仙',
    condition: 'realm >= 9 && char.sectId == "taixuan"',
    summary: '你以剑入道，也以剑入仙。',
    text: () => `天门开的时候，你没有走进去。

你站在门外，拔了剑。

「做什么？」守门的神将问。
「试试。」

你一剑劈开天门。门后不是白光，是你小时候在后山看见的那道剑光。

你走进去，剑还提着。`,
  },
  {
    id: 'e_dan_ascend', name: '丹成飞升', priority: 105, tier: '仙',
    condition: 'realm >= 8 && char.sectId == "danxia" && count("alchemy") >= 100',
    summary: '你炼了一辈子丹，最后一炉炼的是自己。',
    text: () => `你把最后一炉丹封了火，然后自己坐进了炉里。

弟子们跪在炉外哭了七天。第八天炉门开了，里面没有人，只有一枚丹。

丹上有一行小字：此丹不可服。

后来这枚丹供在丹霞谷的最高处。每年谷主换任，都要对它说一句话：祖师，今年也没炸炉。`,
  },
  {
    id: 'e_lover_ascend', name: '双宿', priority: 104, tier: '天',
    condition: 'realm >= 9 && flag("道侣") && char.relations.道侣 >= 35',
    summary: '天门只开一线，你们挤了进去。',
    text: () => `天门窄得只能过一个人。

你先进去，回头伸手。她/他抓住你的手，笑得像个孩子。

「疼吗？」
「疼。」
「忍忍。」

门在你们身后合上。人间的风停了。`,
  },
  {
    id: 'e_karma_saint', name: '功德圆满', priority: 47, tier: '地',
    condition: 'karma >= 500 && realm >= 4',
    summary: '你没有成仙，但很多人记得你。',
    text: () => `你死的那天，山下排了很长的队。

有瘸腿的樵夫，有还俗的和尚，有被你从水里捞出来的孩子——他已经老了。

他们不说话，只是站着。

你没有留下道统，没有留下法宝，只留下一句话，被人刻在石碑上：

「能帮就帮一把。」`,
  },
  {
    id: 'e_hermit_low', name: '归隐', priority: 46, tier: '玄',
    condition: 'realm >= 2 && char.attrs.道心 >= 60 && age >= 80 * 12',
    summary: '你在半山腰盖了间屋子，再没下来。',
    text: () => `你在半山腰盖了间屋子，种了两亩地，养了一只不会说话的鹤。

有修士上山来找你，说外面打起来了，正道魔道，死了很多人。

你给他们倒了茶，说：喝完再走。

他们喝完，走了。你还是没下山。`,
  },
  {
    id: 'e_demon_lord', name: '血海尸山', priority: 95, tier: '天',
    condition: 'realm >= 7 && karma <= -500',
    summary: '你成了自己少年时最恨的那种人。',
    text: (s) => `北荒的血池又涨了三尺。\n\n你坐在池边，脚下是七十二宗的山门牌匾，最大的一块写着「太玄」。\n\n有人说你疯了。你不觉得。你只是终于明白：这世上所有的道理，最后都要用拳头讲。\n\n你活了三千年，杀了十万人，把整个修真界踩在脚下。夜里你还是会梦见青牛村的炊烟，但醒来就忘了。\n\n——魔道至尊，${s.char.name}。史书这一页，墨是红的。`,
  },
  {
    id: 'e_ascend_demon', name: '魔仙', priority: 103, tier: '仙', hidden: true,
    condition: 'realm >= 9 && demon >= 50',
    summary: '你带着心魔一起飞升了。',
    text: () => `天劫散尽，你没有变干净。\n\n心魔站在你旁边，和你长得一模一样。它说：走吧。你说：好。\n\n你们一起走进天门。守门的神将看了一眼，什么也没说——他不敢。\n\n仙界从此多了一个规矩：看见那个影子，绕道走。`,
  },
  {
    id: 'e_ascend_refuse', name: '看山还是山', priority: 102, tier: '天', hidden: true,
    condition: 'realm >= 9 && count("refuse_ascend") >= 3',
    summary: '天门开了三次，你三次转身。',
    text: () => `第三次天门开的时候，你已经很老了。\n\n门后有人喊你，声音像母亲。你站在山门前，看了一会儿云，然后把门关上。\n\n你在山上种了一片桃树。春天开花的时候，满山都是粉的。有小孩上山来问：老爷爷，你为什么不飞升？\n\n你说：上面没有桃子。`,
  },
  {
    id: 'e_tribulation_death', name: '身死道消', priority: 80, tier: '玄',
    condition: 'flag("渡劫失败")',
    summary: '雷落下时，你想起的是一碗面。',
    text: (s) => `第九道雷落下的时候，你的护体灵光碎了。\n\n你想起十六岁那年冬天，母亲煮的一碗面。面很烫，你吹了很久。\n\n雷光很白。白得什么都看不见了。\n\n——${s.char.name}，${s.char.realm >= 2 ? '金丹修士' : '修士'}，卒于天劫之下。修真界每年都有人这样死，没人在意。`,
  },
  {
    id: 'e_demon_devour', name: '心魔噬体', priority: 78, tier: '玄', hidden: true,
    condition: 'demon >= 100',
    summary: '你终于听清了那个声音在说什么。',
    text: (s) => `那个声音跟了你很多年。起初它只是夜里的一句低语，后来它用你的声音说话，再后来它替你做了决定。\n\n最后一天，你坐在镜前，看见镜里的人先眨了眼睛。\n\n它说：换我了。\n\n你没有反抗。你甚至有点轻松。\n\n——${s.char.name}这个名字，从此归了另一个人。`,
  },
  {
    id: 'e_killed', name: '死于非命', priority: 70, tier: '黄',
    condition: 'hp <= 0',
    summary: '修真界少了一个人，多了一具尸。',
    text: () => `你倒下去的时候，天是灰的。\n\n杀你的人甚至没有看你的脸，他在擦自己的刀。刀很干净，你的血顺着血槽流下去，滴在土里。\n\n三天后，野狗把你的骨头拖进了林子。\n\n——这世上每天都有修士这样死。你不是第一个，也不是最后一个。`,
  },
  {
    id: 'e_old_age', name: '寿元耗尽', priority: 60, tier: '玄',
    condition: 'age >= lifespan',
    summary: '你活到了尽头，但没有走到尽头。',
    text: (s) => `最后几年，你的头发全白了，手抖得握不住剑。\n\n你坐在洞府门口晒太阳，看后辈们御剑飞过。他们飞得比你当年还快。\n\n某个清晨，你没能睁开眼。\n\n——${s.char.name}，享年${Math.floor(s.char.age / 12)}岁，止步于${s.char.realm >= 1 ? '筑基以上' : '炼气'}。你的道，断在了这里。`,
  },
  {
    id: 'e_sect_founder', name: '一代宗师', priority: 55, tier: '地',
    condition: 'flag("开宗立派") && reputation >= 500',
    summary: '你的山门，比你活得更久。',
    text: (s) => `你在一座无名的山上立了山门。第一年只有三个弟子，第三年三十个，第三十年三千个。\n\n你教他们吐纳，教他们剑法，教他们不要随便杀人。最后一课你只说了一句：\n\n「我这一生，也没想明白。你们自己去找。」\n\n你死后的第三百年，宗门还在。山门上刻着你的名字：${s.char.name}。字是歪的，是你自己刻的。`,
  },
  {
    id: 'e_hermit', name: '山中无甲子', priority: 50, tier: '玄',
    condition: 'char.attrs.道心 >= 80 && realm >= 3',
    summary: '你不再问长生，长生自己来了。',
    text: () => `你在山里住了很久，久到忘了自己多大。\n\n春种秋收，冬天下棋。偶尔有修士误入，问你是什么境界。你想了半天，说：种地的。\n\n后来有人把你写进书里，称你为「隐仙」。你看见了，笑了一下，把书垫了桌脚。`,
  },
  {
    id: 'e_red_dust', name: '红尘仙', priority: 48, tier: '天', hidden: true,
    condition: 'flag("道侣") && char.relations.道侣 >= 35',
    summary: '你没有飞升，因为你舍不得。',
    text: (s) => `天门开的那天，她/他在院子里晒被子。\n\n你站在门口看了很久，然后转身回去，帮她把被子抖开。\n\n「不去了？」\n「不去了。」\n\n你们在人间活了两百年，吵过很多次架，也一起看过很多次日落。最后你们葬在同一棵树下。\n\n——后来有人说，那棵树每年开的花，比别处的都白。`,
  },
  {
    id: 'e_pill_master', name: '丹道圣手', priority: 45, tier: '地',
    condition: 'char.sectId === "danxia" && count("alchemy") >= 100',
    summary: '你炼的丹，救了半个修真界。',
    text: () => `你一生炼了三万炉丹，炸了七千炉。\n\n你死的时候，丹霞谷的炉火第一次灭了。谷中弟子跪了一地，没有人说话，只有风穿过药田。\n\n你的墓碑上没写境界，只写了四个字：此人会炼丹。\n\n——修真界后来把这句话，当成最高的评价。`,
  },
  {
    id: 'e_sword_grave', name: '剑冢无名', priority: 44, tier: '地',
    condition: 'char.sectId === "taixuan" && stats.kills >= 100',
    summary: '你的剑留在了剑冢，名字没有。',
    text: () => `你死前把剑插进剑冢最深处。\n\n按剑宗的规矩，剑在人在，剑亡人亡。可你的剑还在，人没了。\n\n后来有弟子去剑冢选剑，走到最深处，看见一柄没有铭文的剑。他伸手去拔，剑鸣了一声，像在哭。\n\n他拔不动。`,
  },
  {
    id: 'e_emperor', name: '万古一帝', priority: 43, tier: '天', hidden: true,
    condition: 'char.originId === "royal" && realm >= 7',
    summary: '你既坐过龙椅，也坐过仙位。',
    text: () => `大梁的史官写你：\n\n「帝幼有仙缘，十八入山，三百岁归。归时乘云，百官伏地。帝曰：起来吧，朕只是回来看看。」\n\n你在皇城住了三天，换了三个皇帝，然后走了。\n\n此后大梁每一代皇帝登基，都要对着西方拜三拜。他们拜的不是你，是那个「长生」的可能。`,
  },
  {
    id: 'e_outsider', name: '天外归客', priority: 42, tier: '仙', hidden: true,
    condition: 'char.originId === "outsider" && realm >= 9',
    summary: '你终于明白，这不是穿越，是回家。',
    text: () => `飞升的那一刻，你看见的不是仙界。\n\n是一间亮着白灯的屋子，桌上有一台还开着的电脑，屏幕上是一个写到一半的故事。\n\n你伸手去碰屏幕。\n\n然后你醒了。窗外天亮了，楼下的早餐摊在冒热气。你坐了很久，忽然发现自己记得每一句咒语。\n\n你没有再打开那个文档。`,
  },
  {
    id: 'e_sword_spirit', name: '器灵归位', priority: 41, tier: '地', hidden: true,
    condition: 'char.originId === "artifact_spirit" && char.realm >= 6',
    summary: '你终于想起来，自己原本是什么。',
    text: () => `你把残剑插进自己的胸口。\n\n没有血。剑身一寸寸化开，重新长成你的骨头。你听见三千年前那个握剑的人说：老伙计，回来了。\n\n你睁开眼，手里握着的，是自己。`,
  },
  {
    id: 'e_mortal', name: '凡人一世', priority: 30, tier: '凡',
    condition: 'realm === 0 && age >= lifespan * 0.95',
    summary: '你没能踏上仙途，但你活过。',
    text: (s) => `你到死都是炼气一层，或者连一层都没有。\n\n你在山脚下开了个茶馆，给过路的修士倒水。他们出手很大方，也从不看你第二眼。\n\n你娶了/嫁了一个不修仙的人，生了两个孩子。孩子长大了，去了城里。\n\n你死在一个春天。\n\n——${s.char.name}，凡人，享年${Math.floor(s.char.age / 12)}岁。你的一生很短，但确实是你自己的。`,
  },
  {
    id: 'e_slaughter', name: '杀孽', priority: 28, tier: '玄', hidden: true,
    condition: 'stats.kills >= 1000',
    summary: '你数不清了，也就不数了。',
    text: () => `一开始你还记得每一张脸。后来你只记得剑拔出来的手感。\n\n最后你在一个雨夜醒过来，发现自己在洗手——手上没有血。\n\n你洗了一整夜。`,
  },
  {
    id: 'e_lonely', name: '独行', priority: 20, tier: '黄',
    condition: 'true',
    summary: '一个人来，一个人走。',
    text: (s) => `你死在半路上。\n\n没有人知道你叫什么，也没有人知道你走了多远。你的储物袋被野狗刨开，里面的丹药滚了一地，很快被雨泡烂。\n\n——${s.char.name}，卒于途中。`,
  },
];

export const ENDING_BY_ID = Object.fromEntries(ENDINGS.map((e) => [e.id, e]));

export function pickEnding(state, ctx) {
  const sorted = [...ENDINGS].sort((a, b) => b.priority - a.priority);
  for (const e of sorted) {
    try {
      if (ctx.compile(e.condition)(ctx.ctx)) return e;
    } catch (err) {
      console.warn('结局条件错误', e.id, err.message);
    }
  }
  return ENDINGS[ENDINGS.length - 1];
}
