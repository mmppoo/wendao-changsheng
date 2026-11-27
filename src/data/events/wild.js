/** 野外奇遇池：山野、荒村、古道、秘境入口。 */
export const WILD_EVENTS = [
  {
    id: 'ev_old_well', title: '古井', pool: 'wild', tier: 2, weight: 8, minRealm: 0,
    once: true,
    text: '山道边有一口废井，井沿被磨得发亮，说明很多年前这里住着人。\n\n你往下看，井里没有水，只有一线极细的凉气往上冒。那凉气里有灵气——很少，但很纯。',
    choices: [
      {
        label: '下去看看', hint: '神识检定 · 有风险',
        require: 'char.attrs.神识 >= 12', requireHint: '神识不足，看不清井底',
        cost: { month: 1 },
        roll: {
          p: 0.55, attrs: { 神识: 0.012, 气运: 0.008 },
          success: {
            text: '井底是一间小小的石室，蒲团上坐着一具白骨，白骨的膝盖上摊着一枚玉简。\n\n你拿起玉简，里面只有一句话：\n\n「后来者，别学我。」',
            effects: { expPct: 0.25, items: ['yinqi_dan'], attrs: { 道心: 2 }, flag: { 井底石室: true }, achievements: ['a_ghost'] },
          },
          fail: {
            text: '你下到一半，井壁塌了。碎石砸在背上，你抓着井绳爬上来时，指甲全翻了。',
            effects: { hp: -35, injury: 1 },
          },
        },
      },
      {
        label: '在井边打坐一夜', hint: '一月 · 借那一线灵气',
        cost: { month: 1 },
        outcome: {
          text: '你在井边坐到天亮。凉气顺着脊椎往上爬，像有人用手指一节一节地数你的骨头。\n\n天亮时你发现井口的青苔枯了一圈。',
          effects: { exp: 60, attrs: { 根骨: 1 } },
        },
      },
      { label: '走开', hint: '', outcome: { text: '你走了。身后的井里，有什么东西轻轻叹了口气。' } },
    ],
  },
  {
    id: 'ev_fox_fire', title: '狐火', pool: 'wild', tier: 1, weight: 10, minRealm: 0,
    text: '夜路上，前面飘着一团青白色的火。你走它就走，你停它就停。\n\n火后面有个声音，很年轻，像个姑娘：\n\n「借个火。」',
    choices: [
      {
        label: '把火折子递过去', hint: '善缘',
        outcome: {
          text: '一只手从黑暗里伸出来，指甲是青的。她接过火折子，吹亮，照出一张很白的脸。\n\n「你是第一个没跑的。」她把火折子还你，火已经不会灭了。',
          effects: { items: ['shenxing_fu'], reputation: 5, flag: { 狐缘: true } },
        },
      },
      {
        label: '拔剑', hint: '战斗 · 青背狼（她招来的）',
        combat: {
          enemy: 'wolf',
          win: {
            text: '剑光过后，青火散了。地上只剩一撮白毛，和一句没说完的话：「小气。」',
            effects: { exp: 40, karma: -5 },
          },
          lose: { text: '你被那团火燎了眉毛。醒来时天亮了，身上多了三道抓痕。', effects: { hp: -20 } },
        },
      },
      {
        label: '绕路', hint: '不惹事',
        outcome: { text: '你绕了很远。回头看时，那团火还在原地，像在等下一个路人。', effects: { attrs: { 道心: 1 } } },
      },
    ],
  },
  {
    id: 'ev_dead_cultivator', title: '坐化', pool: 'wild', tier: 3, weight: 6, minRealm: 1,
    once: true,
    text: '石洞里坐着一具尸骨，姿势很正，像是自己坐好的。\n\n骨头上没有伤，衣服也没烂，说明他死的时候境界不低。他面前的石壁上刻着两个字：\n\n「差一点。」',
    choices: [
      {
        label: '取走他的储物袋', hint: '贪婪 · 有因果',
        outcome: {
          text: '袋子里有三枚丹药和一枚黑色玉牌。你把玉牌翻过来，背面刻着一个名字——和你同名。\n\n你手一抖。',
          effects: { items: ['zhuji_dan', 'yinqi_dan'], karma: -10, demon: 5, flag: { 同名玉牌: true } },
          goto: 'ev_dead_cultivator_2',
        },
      },
      {
        label: '替他收殓', hint: '道心',
        cost: { month: 1 },
        outcome: {
          text: '你在洞外挖了个坑，把他埋了。填土时你摸到他怀里有东西——一枚温热的玉简。\n\n「赠予葬我之人。」',
          effects: { attrs: { 道心: 4 }, expPct: 0.2, karma: 15, items: ['jiuzhuan_gong'], achievements: ['a_ghost'] },
        },
      },
      {
        label: '看那两个字', hint: '悟性',
        cost: { month: 1 },
        outcome: {
          text: '你盯着「差一点」看了很久，忽然明白他差的是什么——不是修为，是放不下。\n\n你起身时，腿麻了。',
          effects: { attrs: { 悟性: 3, 道心: 2 } },
        },
      },
    ],
  },
  {
    id: 'ev_dead_cultivator_2', title: '同名', pool: 'branch', tier: 3, weight: 0,
    text: '玉牌在你手里越来越烫，烫得你几乎握不住。\n\n石壁上的字开始渗水，一滴一滴，像有人在哭。你听见身后有呼吸声——很轻，就在你耳后。',
    choices: [
      {
        label: '回头', hint: '道心检定',
        roll: {
          p: 0.5, attrs: { 道心: 0.01, 悟性: 0.005 },
          success: {
            text: '身后什么都没有。你再看玉牌，上面的名字已经变成了「无名」。\n\n你把玉牌埋回土里，走出洞时，天亮了。',
            effects: { attrs: { 道心: 5 }, flag: { 同名玉牌: false } },
          },
          fail: {
            text: '你回头，看见的是你自己。他比你老，眼睛里没有光。\n\n他说：「差一点。」\n\n然后他走进你的身体里。你没有拦住。',
            effects: { demon: 15, attrs: { 悟性: 3 } },
          },
        },
      },
      {
        label: '把玉牌扔进火里', hint: '消耗一枚丹药引火',
        require: 'has("yinqi_dan")', requireHint: '没有可烧的东西',
        cost: { item: 'yinqi_dan' },
        outcome: {
          text: '玉牌在丹火里裂开，里面掉出一缕头发。头发一碰到火就没了，洞里忽然安静下来。',
          effects: { demon: -8, attrs: { 道心: 3 }, karma: 5 },
        },
      },
    ],
  },
  {
    id: 'ev_road_bandit', title: '劫道', pool: 'wild', tier: 1, weight: 10, minRealm: 0,
    text: '三个散修横在路中间，为首的那个缺了半只耳朵。\n\n「道友，借点灵石花花。」他说这话时，手已经按在刀上。',
    choices: [
      {
        label: '给钱', hint: '破财免灾',
        require: 'stones >= 50', requireHint: '你比他们还穷',
        cost: { stones: 50 },
        outcome: { text: '他们收了钱，还很有礼貌地让开了路。走出很远，你才敢回头。', effects: { attrs: { 道心: 1 } } },
      },
      {
        label: '动手', hint: '战斗 · 劫道散修',
        combat: {
          enemy: 'bandit',
          win: { text: '缺耳朵的那个跑了，另两个躺在地上。你从他们身上翻出一些灵石。', effects: { exp: 60, stones: 80, karma: -5 } },
          lose: { text: '你被打断了三根肋骨，储物袋被抢空。', effects: { hp: -40, stones: -100, injury: 1 } },
        },
      },
      {
        label: '说：我知道一条更好的路', hint: '魅力检定',
        roll: {
          p: 0.4, attrs: { 魅力: 0.012, 悟性: 0.006 },
          success: { text: '你胡编了一条「埋着前人宝藏」的路线，他们信了，急匆匆地走了。', effects: { attrs: { 魅力: 2 }, exp: 30 } },
          fail: { text: '「你当我们傻？」缺耳朵的一刀劈过来，你侧身躲开，袖子被削掉一半。', effects: { hp: -15 } },
        },
      },
    ],
  },
  {
    id: 'ev_ghost_wedding', title: '鬼娶亲', pool: 'wild', tier: 3, weight: 5, minRealm: 1,
    once: true,
    text: '半夜，山道上忽然响起唢呐。\n\n一队红衣人抬着花轿从雾里出来，脸上都涂着白粉，笑得很整齐。\n\n轿帘掀开一角，里面坐着一个纸人。纸人的脸，和你一模一样。',
    choices: [
      {
        label: '拦住花轿', hint: '道心检定 · 凶险',
        roll: {
          p: 0.45, attrs: { 道心: 0.012, 神识: 0.006 },
          success: {
            text: '你一剑挑开轿帘。纸人碎了，里面掉出一枚铜钱，铜钱上刻着「买命」二字。\n\n唢呐声停了。红衣人一个个跪下，然后化成纸灰。',
            effects: { expPct: 0.3, items: ['huxin_fu'], attrs: { 道心: 4 }, achievements: ['a_ghost'] },
          },
          fail: {
            text: '你的剑穿过了轿子，像穿过一团雾。纸人转过头，对你笑了一下。\n\n你醒来时躺在路边，手里攥着一枚铜钱，掌心被烫出一个「囍」字。',
            effects: { hp: -50, demon: 12, items: ['huxin_fu'], flag: { 掌心囍: true } },
          },
        },
      },
      {
        label: '跟着走', hint: '看看它要把你抬到哪',
        cost: { month: 1 },
        outcome: {
          text: '花轿抬进一座废弃的祠堂。祠堂里摆着两副牌位，一副写着「新郎」，另一副是空的。\n\n你在牌位前站了一夜。天亮时，空牌位上多了你的名字。',
          effects: { demon: 8, expPct: 0.15, flag: { 祠堂牌位: true }, lifespan: -5 },
        },
      },
      { label: '闭眼，等它过去', hint: '', outcome: { text: '唢呐声从你身边过去了。你睁眼时，地上落了一层纸钱。', effects: { attrs: { 道心: 2 } } } },
    ],
  },
  {
    id: 'ev_thunder_pool', title: '雷池', pool: 'wild', tier: 4, weight: 4, minRealm: 1,
    require: 'char.rootId === "lei" || char.attrs.根骨 >= 25',
    once: true,
    text: '山谷中央有一汪池水，水面浮着细小的电弧。\n\n传说上古有雷兽在此沐浴，雷兽死了，雷留了下来。\n\n你靠近时，头发一根根竖了起来。',
    choices: [
      {
        label: '走进雷池', hint: '雷灵根专属 · 大机缘',
        require: 'char.rootId === "lei"', requireHint: '你的身体扛不住',
        outcome: {
          text: '雷进了你的身体，却没有伤你。它们在经脉里跑了一圈，像回家。\n\n你从池里出来时，皮肤上浮着淡淡的雷纹。',
          effects: { expPct: 0.8, attrs: { 根骨: 8, 神识: 5 }, lifespan: 20, title: '雷池洗身', flag: { 雷池: true }, achievements: ['a_root_lei'] },
        },
      },
      {
        label: '以根骨硬闯', hint: '极凶 · 九死一生',
        require: 'char.attrs.根骨 >= 25', requireHint: '根骨不足',
        roll: {
          p: 0.35, attrs: { 根骨: 0.008 },
          success: {
            text: '你在雷池里站了半炷香。出来时，半边身子是焦的，但经脉宽了一倍。',
            effects: { expPct: 0.5, attrs: { 根骨: 5 }, injury: 2, title: '雷池洗身' },
          },
          fail: { text: '雷把你从池子里掀了出来。你在地上躺了三天，醒来时闻到自己身上的焦味。', effects: { hp: -80, injury: 3, demon: 5 } },
        },
      },
      {
        label: '取一瓶雷水', hint: '炼器材料',
        cost: { month: 1 },
        outcome: { text: '你用玉瓶装了半瓶雷水，瓶身一直在抖。', effects: { items: ['leimu'], attrs: { 神识: 2 } } },
      },
    ],
  },
  {
    id: 'ev_herb_garden', title: '废药圃', pool: 'wild', tier: 2, weight: 9, minRealm: 0,
    text: '半山腰有一片荒了的药圃，垄还在，草比人高。\n\n你蹲下去拨开草，看见一株灵草还活着，叶子边缘泛着微光。',
    choices: [
      {
        label: '小心采下', hint: '悟性检定',
        roll: {
          p: 0.6, attrs: { 悟性: 0.008 },
          success: { text: '你用指甲一点点刨开土，根须完整。这株草至少有三百年。', effects: { items: ['lingcao'], exp: 30 } },
          fail: { text: '你手重了，根断了。灵草的汁液渗进土里，很快看不见了。', effects: { attrs: { 悟性: 1 } } },
        },
      },
      {
        label: '找找还有没有别的', hint: '一月 · 可能遇到守园的东西',
        cost: { month: 1 },
        roll: {
          p: 0.5, attrs: { 气运: 0.01 },
          success: { text: '你在最深处找到一小片没死的药田，采了满满一袋。', effects: { items: [{ id: 'lingcao', qty: 3 }], exp: 40 } },
          fail: {
            text: '你翻到第三垄时，土里钻出一条碗口粗的蛇。它不是妖，但牙有毒。',
            effects: { hp: -25, items: ['lingcao'] },
          },
        },
      },
      { label: '不采，替它把草拔了', hint: '善缘',
        outcome: { text: '你拔了半天草，手上全是泥。走的时候，那株灵草朝你的方向弯了一下。', effects: { karma: 10, attrs: { 道心: 2 } } } },
    ],
  },
  {
    id: 'ev_broken_stele', title: '断碑', pool: 'wild', tier: 3, weight: 7, minRealm: 1,
    once: true,
    text: '荒草里立着半截石碑，碑文被风化了大半，只认得出几个字：\n\n「……不可以……」「……归……」\n\n你摸上去时，指尖有一阵刺痛，像被针扎。',
    choices: [
      {
        label: '以神识读碑', hint: '神识检定 · 得残篇',
        roll: {
          p: 0.55, attrs: { 神识: 0.01 },
          success: {
            text: '碑文在你识海里连成一句话：「道不可外求，归即是路。」\n\n你怔了很久。这句话像一把钥匙，插进了一个你从没发现过的锁孔。',
            effects: { attrs: { 悟性: 5, 道心: 3 }, expPct: 0.2, techniques: [{ id: 'stele_jue', name: '《归道残篇》', speed: 0.08 }] },
          },
          fail: { text: '你的神识撞在碑上，像撞在一堵墙上。鼻子流了血。', effects: { hp: -20, demon: 5 } },
        },
      },
      {
        label: '把碑挖出来', hint: '力气活',
        cost: { month: 1 },
        outcome: { text: '碑下埋着一个铁盒，盒里是一枚生锈的钥匙，不知道开什么锁。', effects: { items: ['xuantie'], flag: { 生锈钥匙: true } } },
      },
    ],
  },
  {
    id: 'ev_night_cry', title: '夜哭', pool: 'wild', tier: 1, weight: 9, minRealm: 0,
    text: '半夜你被哭声吵醒。声音很近，就在帐篷外。\n\n你掀开帘子，看见一个穿红袄的小孩蹲在火堆边，肩膀一抽一抽的。\n\n火光照不到他的脸。',
    choices: [
      {
        label: '问他怎么了', hint: '道心',
        outcome: {
          text: '他抬起头，脸是一片空白。\n\n「我娘说，哭了就有人来。」\n\n你还没说话，他就散了，像被风吹灭的灯。火堆边留下一只小鞋。',
          effects: { attrs: { 道心: 2 }, demon: 3, flag: { 小鞋: true } },
        },
      },
      {
        label: '念一段清心咒', hint: '需道心 ≥ 20',
        require: 'char.attrs.道心 >= 20', requireHint: '道心不足，念不出声',
        outcome: {
          text: '你念到第三句，哭声停了。小孩站起来，朝你作了个揖，然后走进黑暗里。\n\n第二天你在路边看见一座小坟，坟头的草被人拔干净了。',
          effects: { karma: 15, attrs: { 道心: 3 }, exp: 30 },
        },
      },
      { label: '假装没听见', hint: '', outcome: { text: '你把被子蒙在头上。哭声一直响到天亮，然后停了。', effects: { demon: 4 } } },
    ],
  },
  {
    id: 'ev_sword_grave', title: '剑冢', pool: 'wild', tier: 4, weight: 4, minRealm: 2,
    once: true,
    text: '山谷里插满了剑，一眼望不到头。有的还亮，有的已经锈成了土。\n\n风穿过剑林，发出很低的声音，像很多人在同时叹气。\n\n最深处有一柄剑，没有锈。',
    choices: [
      {
        label: '走向最深处的剑', hint: '剑道机缘 · 有主',
        roll: {
          p: 0.4, attrs: { 道心: 0.008, 根骨: 0.006 },
          success: {
            text: '你握住剑柄。剑鸣了一声，很轻，像终于等到人。\n\n周围所有的剑同时低了一寸，像在行礼。',
            effects: { items: ['qingfeng_jian'], attrs: { 根骨: 5 }, title: '剑冢取剑', flag: { 剑断法宝: true }, achievements: ['a_sword'] },
          },
          fail: {
            text: '你的手刚碰到剑柄，整座剑冢的剑都转了向，剑尖对着你。\n\n你退出来时，身上多了十七道口子。',
            effects: { hp: -60, injury: 2, attrs: { 道心: 3 } },
          },
        },
      },
      {
        label: '在剑冢外坐一夜', hint: '听剑',
        cost: { month: 1 },
        outcome: { text: '你听了一夜的剑鸣。天亮时，你忽然懂了一点「快」的意思。', effects: { attrs: { 悟性: 2, 根骨: 2 }, expPct: 0.1 } },
      },
    ],
  },
  {
    id: 'ev_poison_marsh', title: '毒沼', pool: 'wild', tier: 2, weight: 7, minRealm: 0,
    text: '前面是一片沼泽，水面浮着彩色的油光。\n\n沼中央有一朵花，花瓣是黑的，周围三尺没有一丝虫鸣。',
    choices: [
      {
        label: '涉水去摘', hint: '根骨检定 · 毒',
        roll: {
          p: 0.5, attrs: { 根骨: 0.01, 气运: 0.006 },
          success: { text: '你屏住呼吸蹚过去，摘下了那朵花。花入手冰凉，毒气顺着掌心往上爬，被你压了回去。', effects: { items: ['lingcao'], attrs: { 根骨: 2 }, exp: 50 } },
          fail: { text: '水下的泥吸住了你的腿。你挣扎着爬回来，小腿上全是紫色的斑。', effects: { hp: -45, injury: 1, demon: 3 } },
        },
      },
      {
        label: '绕过去', hint: '',
        outcome: { text: '你绕了半座山。回头时，那朵黑花还在水中央，静静开着。', effects: { attrs: { 道心: 1 } } },
      },
    ],
  },
  {
    id: 'ev_temple_rain', title: '破庙避雨', pool: 'wild', tier: 1, weight: 10, minRealm: 0,
    text: '雨下得很大，你躲进一座破庙。神像的脸被人凿了，供桌上落满灰。\n\n角落里已经有人了——一个背着书箱的老书生，正在烤火。',
    choices: [
      {
        label: '坐下一起烤火', hint: '听一个故事',
        outcome: {
          text: '老书生给你讲了个故事：三十年前，他也有灵根，也想过修仙。走到半路，家里来信说母亲病了。他回了家。\n\n「后来呢？」\n「后来我娘活了很久，活到八十。我送走她，自己也就老了。」\n\n他把书箱打开，里面全是手抄的道经。「送你一本。我读了一辈子，也没读出什么。」',
          effects: { items: ['changchun_gong'], attrs: { 道心: 3 }, flag: { 听完故事: true }, achievements: ['a_tea'] },
        },
      },
      {
        label: '问他为何不修仙了', hint: '悟性 +1',
        outcome: { text: '「修啊。」他说，「我只是不飞了。」\n\n你没听懂。他也没再解释。', effects: { attrs: { 悟性: 1, 道心: 2 } } },
      },
      {
        label: '在墙上题一首诗', hint: '留名',
        outcome: { text: '你借着火光，在墙上写了四句歪诗。老书生看了半天，说：字丑，但是真心。', effects: { attrs: { 魅力: 2 }, reputation: 2, flag: { 题壁: true }, achievements: ['a_poem'] } },
      },
    ],
  },
  {
    id: 'ev_water_ghost', title: '水鬼', pool: 'wild', tier: 2, weight: 7, minRealm: 0,
    text: '渡口没有船。你正要绕路，水里伸出一只手，抓住了一个洗衣妇的脚踝。\n\n那妇人尖叫着被拖向水边。',
    choices: [
      {
        label: '出手救人', hint: '战斗 · 怨魂',
        combat: {
          enemy: 'ghost',
          win: {
            text: '你一剑斩断那只手。妇人瘫坐在地上，一直道谢。水里浮起一具泡胀的尸体，脸已经看不清了。',
            effects: { exp: 80, reputation: 20, karma: 20, achievements: ['a_ghost'] },
          },
          lose: { text: '你被拖进水里。冰水灌进肺里，你拼死才爬上岸。妇人已经不见了。', effects: { hp: -60, injury: 2 } },
        },
      },
      {
        label: '扔一张符', hint: '消耗护心符',
        require: 'has("huxin_fu")', requireHint: '没有符',
        cost: { item: 'huxin_fu' },
        outcome: { text: '符纸在水面炸开，水鬼尖叫一声沉了下去。妇人趁机爬上岸，给你磕了个头。', effects: { reputation: 15, karma: 15 } },
      },
      { label: '不出手', hint: '因果', outcome: { text: '你站在原地，看着水面重新平静。洗衣妇的篮子漂在河上，转了三圈。', effects: { karma: -20, demon: 5 } } },
    ],
  },
  {
    id: 'ev_talking_crane', title: '白鹤', pool: 'wild', tier: 3, weight: 6, minRealm: 0,
    once: true,
    text: '一只白鹤落在你面前，歪着头看你。\n\n它开口了，声音像个老头：「你身上有股味道，我认得。」\n\n「什么味道？」\n「不甘心。」',
    choices: [
      {
        label: '问它认得谁', hint: '一段旧事',
        outcome: {
          text: '「三百年前有个小子，也这个味道。」鹤说，「他后来飞升了，走的时候哭得很难看。」\n\n「为什么哭？」\n「他说他忘了自己为什么要修。」\n\n鹤拍拍翅膀走了，落下一根羽毛。',
          effects: { attrs: { 道心: 4, 悟性: 2 }, items: ['lingcao'], flag: { 鹤羽: true } },
        },
      },
      {
        label: '抓它', hint: '愚蠢但有效？',
        roll: {
          p: 0.2, attrs: { 气运: 0.01 },
          success: { text: '你居然抓住了。它在你手里变成一根羽毛，很轻。', effects: { items: ['shenxing_fu'], attrs: { 气运: 3 } } },
          fail: { text: '它啄了你一口，啄在眉心。你疼了三天，但那三天里，你看东西特别清楚。', effects: { hp: -10, attrs: { 神识: 3 } } },
        },
      },
    ],
  },
  {
    id: 'ev_cave_echo', title: '洞中回音', pool: 'wild', tier: 2, weight: 7, minRealm: 0,
    text: '山洞很深，你喊了一声，回音却比你多了一个字。\n\n你喊「有人吗」，回音说「有」。',
    choices: [
      {
        label: '再问一句：你是谁', hint: '神识',
        roll: {
          p: 0.5, attrs: { 神识: 0.012 },
          success: { text: '「我是你。」回音说，「你走的时候，别忘了带我。」\n\n你在洞里找到一面铜镜，镜子里没有人。', effects: { items: ['huxin_fu'], attrs: { 神识: 3 }, flag: { 镜中人: true }, achievements: ['a_mirror'] } },
          fail: { text: '回音突然变成很多个声音，同时说：「你是谁？你是谁？你是谁？」\n\n你捂着耳朵跑出去，耳鸣了三天。', effects: { hp: -20, demon: 6 } },
        },
      },
      { label: '退出山洞', hint: '', outcome: { text: '你退出去，回音还在里面，一遍遍地喊你。', effects: { demon: 3 } } },
    ],
  },
  {
    id: 'ev_ghost_market', title: '鬼市', pool: 'wild', tier: 4, weight: 3, minRealm: 2,
    once: true,
    text: '子时，荒地上忽然多了一条街。\n\n灯笼是白的，摊主都没有影子。他们卖的东西很奇怪：一段记忆、一个名字、一条命。\n\n没有人看你，但你知道他们在等你。',
    choices: [
      {
        label: '买一段记忆', hint: '付出十年寿元',
        cost: { month: 1 },
        outcome: {
          text: '摊主从罐子里取出一缕白气，按进你的眉心。\n\n你看见一个不认识的人的一生：种田、娶妻、死在大雪里。很平凡，但你哭了。',
          effects: { lifespan: -10, attrs: { 悟性: 6, 道心: 4 }, expPct: 0.3 },
        },
      },
      {
        label: '买一个名字', hint: '代价未知',
        outcome: {
          text: '「你叫什么？」摊主问。\n\n你报了名字。他写在一张黄纸上，收进袖子，然后给了你一枚铜钱。\n\n走出鬼市，你忽然想不起自己姓什么了。',
          effects: { attrs: { 气运: 8 }, reputation: -30, flag: { 无名: true } },
        },
      },
      {
        label: '什么都不买，看看就走', hint: '道心',
        outcome: { text: '你走完整条街，什么也没碰。出街时，所有灯笼同时灭了。\n\n你回头，荒地还是荒地。', effects: { attrs: { 道心: 5 }, exp: 50 } },
      },
    ],
  },
  {
    id: 'ev_fallen_star', title: '坠星', pool: 'wild', tier: 5, weight: 2, minRealm: 1,
    once: true,
    text: '夜里，天上一颗星掉了下来，落在西边的山里。\n\n整座山都在发光。你赶到时，坑底是一块还烫着的石头，石头里隐约有个人形。',
    choices: [
      {
        label: '挖出来', hint: '星辰机缘',
        roll: {
          p: 0.45, attrs: { 气运: 0.012, 根骨: 0.006 },
          success: {
            text: '石头裂开，里面是一枚拳头大的星核。它在你手里跳动，像一颗心。\n\n那一夜，你的经脉里多了一条银河。',
            effects: { attrs: { 神识: 8, 根骨: 5 }, expPct: 0.6, lifespan: 50, title: '星核在体', achievements: ['a_star'] },
          },
          fail: { text: '石头炸了。你被气浪掀出十丈，醒来时耳朵里全是嗡嗡声。', effects: { hp: -70, injury: 2, attrs: { 神识: 2 } } },
        },
      },
      {
        label: '在坑边等它凉', hint: '一月',
        cost: { month: 1 },
        outcome: { text: '你在坑边守了一个月。石头凉了，光也散了，最后只剩一块普通的陨铁。', effects: { items: ['xuantie'], attrs: { 悟性: 2 } } },
      },
    ],
  },
  {
    id: 'ev_peach_blossom', title: '桃花源', pool: 'wild', tier: 3, weight: 5, minRealm: 0,
    once: true,
    text: '你顺着一条溪走了很久，忽然看见两岸全是桃花。\n\n花下有田，田里有人。他们穿的衣服是几百年前的样式，看见你，也不惊讶，只是招手。',
    choices: [
      {
        label: '留下住一阵', hint: '三月 · 红尘',
        cost: { month: 3 },
        outcome: {
          text: '你住了三个月。每天日出而作，日落而息。有人教你插秧，有人给你说媒。\n\n第三个月的最后一天，你在溪边看见自己的倒影，忽然想起自己是个修士。\n\n你走了。回头看，桃花还在，田还在，人不见了。',
          effects: { attrs: { 道心: 6, 悟性: 3 }, lifespan: 5, flag: { 红尘一年: true }, title: '桃源客' },
        },
      },
      {
        label: '问他们是什么人', hint: '',
        outcome: { text: '最老的那个说：「我们是没走出去的人。」\n\n他指了指溪水：「顺流下去，就回不来了。」', effects: { attrs: { 悟性: 3 }, exp: 40 } },
      },
    ],
  },
  {
    id: 'ev_mirror_lake', title: '镜湖', pool: 'wild', tier: 4, weight: 4, minRealm: 1,
    once: true,
    text: '湖面平得像一块镜子。你走到水边，看见水里的自己。\n\n他比你干净，比你年轻，正抬头看你。\n\n他先开了口：「你终于来了。」',
    choices: [
      {
        label: '问他：你是谁', hint: '心魔检定',
        roll: {
          p: 0.5, attrs: { 道心: 0.012 },
          success: {
            text: '「我是你没走的那条路。」他说，「我来告诉你，那条路上有什么。」\n\n他伸手，你也伸手。指尖碰到水面的瞬间，你看见了一生：平凡、安稳、有儿有女。\n\n然后你收回手。「我不换。」',
            effects: { attrs: { 道心: 8 }, expPct: 0.4, demon: -10, title: '照见' },
          },
          fail: {
            text: '你伸手去碰他。水面碎了，他抓住你的手腕，把你往水里拖。\n\n你挣扎着退开，半边身子已经湿透。水里的你笑了笑，沉下去了。',
            effects: { hp: -40, demon: 15 },
          },
        },
      },
      {
        label: '砸碎湖面', hint: '暴力解法',
        outcome: { text: '你一剑劈在水上。水花溅起三丈，落下时，湖里只剩你自己的倒影，一脸惊魂未定。', effects: { attrs: { 根骨: 2 }, demon: 5 } },
      },
    ],
  },
  {
    id: 'ev_x_chicken', title: '一只鸡', pool: 'wild', tier: 1, weight: 4, minRealm: 0,
    text: '你蹲在溪边喝水，一只芦花鸡从草丛里冲出来，照着你的手背就是一口。\n\n它不怕人，也不跑，歪着头看你，喉咙里咕咕响。你手背上已经见了血。',
    choices: [
      {
        label: '抓住它，今晚加餐',
        roll: { p: 0.55, attrs: { 根骨: 0.01, 气运: 0.004 },
          success: { text: '你一把按住它的翅膀。它在你手里挣了两下，不动了。\n\n当晚你吃到了这半个月来最香的一顿肉。', effects: { hp: 12, exp: 15, flag: { 被鸡啄: true } } },
          fail: { text: '它飞起来，爪子在你脸上蹬了一下。你捂着鼻子蹲下去，血从指缝里流出来。\n\n鸡站在三步外，很平静地看着你。', effects: { hp: -10, attrs: { 道心: 1 }, flag: { 被鸡啄: true } } },
        },
      },
      { label: '赶走它，继续喝水', outcome: { text: '你挥挥手，它退了两步，又回来。你换了个地方喝，它跟过来。\n\n你走的时候，它送了你半里地。', effects: { attrs: { 气运: 1 } } } },
      { label: '把干粮掰一半给它', outcome: { text: '它啄得很急，吃完抬头看你，忽然不叫了。\n\n你走远回头，它还站在原地，像一块没人认领的补丁。', effects: { karma: 4, attrs: { 魅力: 1 }, flag: { 喂过鸡: true } } } },
    ],
  },
];
