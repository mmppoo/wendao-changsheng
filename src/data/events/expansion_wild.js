/** 扩展事件池：山野荒村、秘境妖兽、城镇江湖。 */
export const WILD_EXPANSION = [
  {
    id: 'ev_x_wolf_pack', title: '狼群', pool: 'wild', tier: 1, weight: 8, minRealm: 0,
    text: '雪地上有一串脚印，绕着你宿营的地方转了半圈。\n\n后半夜风停了，你听见树枝被踩断的声音——一声，两声，然后从三个方向同时响起。\n\n七对眼睛在暗处亮起来，不急，像在等你先动。',
    choices: [
      {
        label: '拔剑迎上去', hint: '战斗 · 雪狼',
        combat: {
          enemy: 'wolf',
          win: {
            text: '第一头扑得最高，落下来时已经不动了。剩下的围着你转了三圈，退了。\n\n你在雪里坐了半宿，手抖得点不着火。',
            effects: { exp: 70, stones: 30, attrs: { 根骨: 1 }, counter: { 山行: 1 } },
          },
          lose: { text: '你砍倒两头，第三头咬住了你的小腿。天亮时狼走了，你在雪里爬回的路上留了一条红线。', effects: { hp: -40, injury: 1 } },
        },
      },
      {
        label: '点起火把逼近', hint: '定力检定',
        roll: {
          p: 0.55, attrs: { 道心: 0.008, 气运: 0.006 },
          success: { text: '你把火举过头顶，一步一步往前压。狼退了三丈，最后散进林子里。\n\n你在灰烬边坐到天亮，火没敢灭。', effects: { exp: 30, attrs: { 神识: 1 } } },
          fail: { text: '松脂泼在雪上，火一下窜起来，也把你自己逼退了两步。狼没退，你的袖子先烧了。', effects: { hp: -25, injury: 1 } },
        },
      },
      { label: '割开行囊，扔出干粮', outcome: { text: '你把半袋干粮甩进雪地。头狼叼起来，看了你一眼，带着狼群走了。\n\n后半夜你没睡，饿到天亮。', effects: { hp: -8, karma: 5, attrs: { 道心: 1 } } } },
    ],
  },
  {
    id: 'ev_x_mountain_shrine', title: '山神庙', pool: 'wild', tier: 1, weight: 9, minRealm: 0,
    text: '雨把你逼进一座山神庙。神像只剩半张脸，供桌被人劈了当柴烧。\n\n墙角摆着七双新草鞋，鞋头都朝着门外。\n\n你在门槛上坐下，雨下了一夜，草鞋的主人一直没回来。',
    choices: [
      {
        label: '供上十枚灵石', hint: '花费 10 灵石',
        require: 'stones >= 10', requireHint: '身上没有灵石',
        cost: { stones: 10 },
        outcome: { text: '灵石放在断桌腿上，你合手拜了三下。\n\n雨停时，殿里的霉味散了，多了一点干燥的香灰气。你走出去，山路比来时好走。', effects: { karma: 10, attrs: { 道心: 2 }, flag: { 山神香火: true } } },
      },
      {
        label: '在殿里睡一夜', hint: '一月 · 梦见什么不一定',
        cost: { month: 1 },
        roll: {
          p: 0.6, attrs: { 气运: 0.008 },
          success: { text: '你梦见一个没有脸的人给你引路，醒来时天光正落在神像的断颈上。\n\n那一夜睡得比闭关还沉，经脉里的灵气自己转了一圈。', effects: { exp: 55, attrs: { 神识: 1 } } },
          fail: { text: '梦里有人一直在门外问你：走了没有。你答不出，醒时喉咙干得发疼，天还没亮。', effects: { demon: 5, hp: -12 } },
        },
      },
      {
        label: '翻供桌底下', hint: '贪',
        roll: {
          p: 0.45, attrs: { 气运: 0.01 },
          success: { text: '砖缝里塞着一只布包，里面是三枚引气丹，纸包上的字迹已经化开。', effects: { items: [{ id: 'yinqi_dan', qty: 3 }], karma: -5 } },
          fail: { text: '你掀开砖，底下是一窝潮虫，还有一截发黑的手指骨。你把砖放回去了。', effects: { karma: -8, demon: 3 } },
        },
      },
    ],
  },
  {
    id: 'ev_x_dry_well', title: '枯井', pool: 'wild', tier: 2, weight: 7, minRealm: 0,
    text: '村口的井枯了，井沿上磨出七道深槽，是几十年打水磨的。\n\n你趴在井口往下看。井底没有水，有一层很薄的白雾，雾里隐约是一间屋子的轮廓。\n\n井绳还在，新的。',
    choices: [
      {
        label: '顺着井绳下去', hint: '神识 ≥ 15 · 有风险',
        require: 'char.attrs.神识 >= 15', requireHint: '神识不足，看不透井底',
        cost: { month: 1 },
        outcome: {
          text: '你落到井底，脚踩在实的青砖上。雾散开，是一间没有门的堂屋，桌椅齐整，桌上摆着四副碗筷，饭还热着。\n\n你回头，井口只剩一个针尖大的亮点。',
          effects: { expPct: 0.15, attrs: { 神识: 2 }, flag: { 井底人家: true } },
          goto: 'ev_x_dry_well_deep',
        },
      },
      {
        label: '提一桶雾上来', hint: '一月 · 炼气',
        cost: { month: 1 },
        outcome: { text: '你把桶放下去，提上来时桶里是空的，桶底却结了一层白霜。\n\n霜化开后，桶底剩下一株细小的灵草，它有灵气的味道，很不干净，但能用。', effects: { items: ['lingcao'], exp: 40, demon: 3 } },
      },
      { label: '把井绳割断', outcome: { text: '刀落下去，绳子掉进井里，很久才听见回声。\n\n你走出村口时，身后有打水的声音，一下，一下，很规律。', effects: { karma: -5, attrs: { 道心: 2 }, flag: { 断井绳: true } } } },
    ],
  },
  {
    id: 'ev_x_herb_slope', title: '药坡', pool: 'wild', tier: 1, weight: 9, minRealm: 0,
    text: '南坡朝阳，雪化得早，草已经绿了一寸。\n\n你蹲下去看，绿里夹着几株叶子发暗的草药，是凡人也认得的止血草。再往上走，草色更深，有一片长得格外整齐。',
    choices: [
      {
        label: '采凡药，进城换钱', hint: '一月 · 稳妥',
        cost: { month: 1 },
        outcome: { text: '你采了满满两筐，背到镇上药铺，掌柜的按斤称，折成几块碎灵石给了你。\n\n他多看了你一眼，说：手上有药味，是常年采的。', effects: { stones: 60, attrs: { 悟性: 1 } } },
      },
      {
        label: '往深处找灵草', hint: '悟性检定',
        roll: {
          p: 0.5, attrs: { 悟性: 0.01, 气运: 0.006 },
          success: { text: '那片整齐的草底下埋着一株灵草，叶片边缘有一线极细的银边。你连土一起挖了出来。', effects: { items: ['lingcao'], exp: 35 } },
          fail: { text: '你挖到第三株，指缝里钻出细小的根须，扎进皮肉。你甩了半天才甩掉，手上多了几道红痕。', effects: { hp: -15, attrs: { 悟性: 1 } } },
        },
      },
      { label: '只采一半，留下根', outcome: { text: '你把每株都掐了尖，根留在土里。\n\n走时你想，明年这时候，这里还会有一坡草。', effects: { karma: 8, items: ['lingcao'], attrs: { 道心: 1 } } } },
    ],
  },
  {
    id: 'ev_x_boar_snare', title: '兽夹', pool: 'wild', tier: 1, weight: 8, minRealm: 0, maxRealm: 1,
    text: '你踩空了一步，脚踝一紧。铁齿合上来，隔着一层布咬进肉里。\n\n夹子是新的，齿上抹了油，旁边插着一根削尖的木桩，桩上挂着布条。这是猎户的记号，意思是这片林子归他。',
    choices: [
      {
        label: '自己掰开', hint: '根骨检定',
        roll: {
          p: 0.55, attrs: { 根骨: 0.01 },
          success: { text: '你两手撑住铁齿，一寸一寸撑开，把脚抽出来。齿弹回去时夹断了一截枯枝。\n\n你坐在树根上喘了很久，脚踝肿成两倍粗。', effects: { hp: -20, injury: 1, attrs: { 根骨: 1 } } },
          fail: { text: '铁齿纹丝不动，你的手心先裂了。你只能坐着，等血把裤脚浸透。', effects: { hp: -45, injury: 2 } },
        },
      },
      {
        label: '用灵力震开', hint: '需炼气三层以上',
        require: 'realm >= 1 || char.layer >= 2', requireHint: '灵力不够震开铁齿',
        cost: { mp: 15 },
        outcome: { text: '你把灵力灌进掌心，往两边一推，铁齿崩了一个口子。\n\n夹子废了。你把它埋进雪里，算是还给猎户的。', effects: { hp: -10, attrs: { 神识: 1 } } },
      },
      {
        label: '吹哨子等人', hint: '一月 · 也许有人来',
        cost: { month: 1 },
        outcome: { text: '你吹了半个时辰，来的不是猎户，是一条瘦狗。它绕着你转了两圈，趴下来陪你。\n\n第二天清早，猎户顺着狗叫找过来，一言不发地掰开夹子，背你下山。', effects: { hp: -18, injury: 1, flag: { 欠人情: true }, relation: { 猎户: 2 } } },
      },
    ],
  },
  {
    id: 'ev_x_mist_wood', title: '雾林', pool: 'wild', tier: 2, weight: 7, minRealm: 0,
    text: '林子里起雾了，雾贴着地面走，走得很慢。\n\n你走了半个时辰，看见一棵被雷劈开的老树，一半焦黑，一半还活着。\n\n再走半个时辰，你又看见了那棵树。焦的那一半，换了方向。',
    choices: [
      {
        label: '闭眼，用神识走', hint: '神识检定',
        roll: {
          p: 0.5, attrs: { 神识: 0.012 },
          success: { text: '你闭上眼，只用神识探路。脚下的土是软的，树是冷的，只有一条线一直往东。\n\n走出雾时，天已经黑了，你在林子边上，看见了自己的脚印。', effects: { attrs: { 神识: 3 }, exp: 60, flag: { 雾林: true }, counter: { 山行: 1 } } },
          fail: { text: '你的神识探出去，撞在一片空白上。再睁眼，你站在雾的正中央，四面都是一样的树。\n\n你在里面转了两天，靠吃雪活下来。', effects: { hp: -30, demon: 6, attrs: { 道心: 1 } } },
        },
      },
      {
        label: '在树上刻记号', hint: '一月 · 笨办法',
        cost: { month: 1 },
        outcome: { text: '你每隔十步刻一刀，刻到第七十刀，发现那道刀痕就在你手边，还没干。\n\n你站着想了很久，把刀收起来，改刻自己的名字。雾散了一条缝。', effects: { attrs: { 悟性: 2 }, exp: 45 } },
      },
      { label: '原地坐下等雾散', outcome: { text: '你坐了三天。雾没散，但你已经能分辨出风的方向，风里有水气，水在东边。\n\n你顺着风走，走出了林子。', effects: { attrs: { 悟性: 1, 道心: 1 }, hp: -10 } } },
    ],
  },
  {
    id: 'ev_x_old_hunter', title: '老猎户', pool: 'wild', tier: 1, weight: 8, minRealm: 0,
    text: '山腰有一间木屋，屋前晒着兽皮，腥味很重。\n\n老头坐在门槛上磨刀，抬头看你：「修士？」\n\n你说路过。他往屋里指了一下，锅里还剩半锅肉汤。',
    choices: [
      {
        label: '坐下吃一碗', hint: '',
        outcome: { text: '汤很咸，肉炖得烂。你吃完，他说起前年山里出了个东西，吃了七个人，最后一队修士上山才弄死。\n\n「那东西死的时候，叫得像人。」他把碗收走，不再说话。', effects: { attrs: { 根骨: 1, 道心: 1 }, flag: { 山里旧事: true } } },
      },
      {
        label: '替他修补兽皮棚', hint: '一月 · 结缘',
        cost: { month: 1 },
        outcome: { text: '你砍了六根木头，把塌了的棚子重新支起来。老头不说谢，第三天塞给你一张弓，弓身上过油。\n\n「打不死的东西，也能拖慢它。」', effects: { items: ['liegong'], relation: { 猎户: 3 }, karma: 10 } },
      },
      {
        label: '问他山里还有什么', hint: '神识',
        roll: {
          p: 0.5, attrs: { 悟性: 0.01 },
          success: { text: '他盯了你半晌，用刀尖在土上画了一个圈，圈里点了三下：「往这儿走，别走夜路。」\n\n你后来知道那是山北的三处旧洞。', effects: { attrs: { 神识: 2 }, items: ['liaoshang_dan'], flag: { 山洞图: true } } },
          fail: { text: '他摇摇头，说山里没什么，就是不干净。你再问，他就只顾磨刀了。', effects: { attrs: { 悟性: 1 } } },
        },
      },
    ],
  },
  {
    id: 'ev_x_hollow_tree', title: '树洞', pool: 'wild', tier: 2, weight: 6, minRealm: 0,
    text: '一棵要三人合抱的老树，树心空了，洞口只容一人侧身。\n\n洞口边缘被磨得很光滑，像有东西常年进出。地上的毛不是兽毛，是头发，缠在树皮上，一缕一缕，很长。',
    choices: [
      {
        label: '侧身钻进去', hint: '根骨检定 · 狭窄',
        roll: {
          p: 0.5, attrs: { 根骨: 0.01, 气运: 0.005 },
          success: { text: '树心里是空的，一直通到根下，底下有一窝干草和几枚蛋，蛋壳上有细纹，摸着发热。\n\n窝里垫的干草中夹着两株灵草，你拔了出来，蛋没有动。', effects: { items: [{ id: 'lingcao', qty: 2 }], exp: 40 } },
          fail: { text: '你卡在中间，卡了半个时辰。挣出来时肩膀磨掉一层皮，树洞里传出细小的爬动声。', effects: { hp: -25, injury: 1, demon: 3 } },
        },
      },
      {
        label: '在洞口烧一把火', hint: '',
        outcome: { text: '烟灌进去，里面响起一阵很轻的咳嗽，像小孩。\n\n你等烟散了再看，洞里空了，只有一把落下来的长头发。', effects: { karma: -10, demon: 4, exp: 20 } },
      },
      { label: '放一捧米，走开', outcome: { text: '你把行囊里的米倒在洞口，用叶子盖好。\n\n走出很远，你听见树洞里有人低声说了句什么，听不清，但不像恶意。', effects: { karma: 12, attrs: { 道心: 2 }, flag: { 树中客: true } } } },
    ],
  },
  {
    id: 'ev_x_stone_circle', title: '石阵', pool: 'wild', tier: 3, weight: 5, minRealm: 1,
    text: '荒坡上立着十三块石头，高矮不一，表面都被风磨圆了。\n\n你走进阵中，天忽然暗了一瞬，再亮时，石头的位置全变了。有一块石头正对着你，上面刻着一个字：入。',
    choices: [
      {
        label: '按那个字走进去', hint: '阵道 · 有去无回',
        cost: { month: 1 },
        outcome: {
          text: '你朝那块石头走了三步，脚下的土变成了石板，石板一直铺到雾里。\n\n身后十三块石头重新排了一次，声音很闷。',
          effects: { attrs: { 神识: 2 }, flag: { 入阵: true } },
          goto: 'ev_x_stone_circle_inner',
        },
      },
      {
        label: '以神识描一遍阵形', hint: '神识 ≥ 25',
        require: 'char.attrs.神识 >= 25', requireHint: '神识不足，描不全阵形',
        cost: { month: 1 },
        outcome: { text: '你把十三块石头的位置一一记进识海，记到第九块，鼻子开始流血。\n\n记完之后你才明白，这不是困人的阵，是一座坟的排布。', effects: { attrs: { 神识: 4, 悟性: 2 }, hp: -20, expPct: 0.15 } },
      },
      { label: '退出去', outcome: { text: '你倒退着走出去，一步都没敢转身。\n\n出了阵，你回头，十三块石头还是十三块石头，安静得像从没动过。', effects: { attrs: { 道心: 1 } } } },
    ],
  },
  {
    id: 'ev_x_moon_spring', title: '月泉', pool: 'wild', tier: 3, weight: 5, minRealm: 1,
    text: '泉眼只有一口锅大，水是从石缝里渗出来的，很凉。\n\n月亮升到正中时，泉面上浮起一层白气，气散得极慢，像被什么压着。\n\n你在泉边坐下，觉得自己的心跳慢了下来。',
    choices: [
      {
        label: '饮一口泉水', hint: '洗炼 · 有代价',
        cost: { month: 1 },
        roll: {
          p: 0.55, attrs: { 气运: 0.01, 根骨: 0.006 },
          success: { text: '水入喉像一把碎冰，落到丹田又化成暖的。你在泉边坐了一夜，睁眼时天光大亮，身上的旧伤不疼了。', effects: { heal: 1, expPct: 0.2, attrs: { 根骨: 2, 道心: 2 } } },
          fail: { text: '水在腹中结成了冰。你抱着肚子在泉边打了一夜的抖，天亮时才化开。', effects: { hp: -40, injury: 1 } },
        },
      },
      {
        label: '取水回去炼丹', hint: '一月 · 得材料',
        cost: { month: 1 },
        outcome: { text: '你用三只玉瓶装满，瓶口封了三层蜡。走出十里，瓶身还是凉的。\n\n后来你拿这三瓶水跟药铺换了一株百年灵草，还找回几十块灵石。', effects: { items: ['lingcao'], stones: 50, attrs: { 神识: 1 } } },
      },
      { label: '把泉眼填了', hint: '为什么？', outcome: { text: '你搬石头堵住泉眼，堵到一半手停住了。\n\n你想起自己喝过的那一口。石头又一块块搬开了。', effects: { attrs: { 道心: 4 }, karma: 6, exp: 30 } } },
    ],
  },
  {
    id: 'ev_x_guiding_light', title: '引路火', pool: 'world', tier: 2, weight: 7, minRealm: 0,
    text: '夜路上有人在前面提灯，灯是纸糊的，火苗不动。\n\n你跟着走了一里，才发现脚下没有路，是踩在别人踩过的草上。\n\n提灯的人一直没回头，但你知道他在等你跟上。',
    choices: [
      {
        label: '跟到底', hint: '看看他要带你去哪',
        cost: { month: 1 },
        outcome: { text: '灯停在一座新坟前。他把灯插在坟头，转身时你才看清，他没有脸。\n\n坟前有块木板，写着你的名字，墨还没干。你把木板拔起来，折了。', effects: { demon: 8, attrs: { 道心: 3 }, exp: 50, flag: { 无名坟: true } } },
      },
      {
        label: '喊住他', hint: '道心检定',
        roll: {
          p: 0.5, attrs: { 道心: 0.01, 神识: 0.006 },
          success: { text: '他停下，把灯递给你。灯里没有油，只有一缕很细的白气。\n\n「拿着，」他说，声音像从很远的地方传来，「我走不动了。」然后他跪下去，散了。', effects: { attrs: { 道心: 3, 神识: 2 }, karma: 10, flag: { 引路灯: true } } },
          fail: { text: '他一回头，灯就灭了。你在原地站到天亮，发现自己一直站在坟圈子中间。', effects: { hp: -20, demon: 10 } },
        },
      },
      { label: '拐进岔路', outcome: { text: '你拐向另一条路，走了没几步，回头看见那盏灯还在原地。\n\n它没有追来，只是把光调暗了一点。', effects: { attrs: { 道心: 1 }, demon: 3 } } },
    ],
  },
  {
    id: 'ev_x_rogue_ambush', title: '截杀', pool: 'wild', tier: 3, weight: 6, minRealm: 1,
    text: '一道剑光从背后贴着头皮过去，削断你三根头发。\n\n林子里走出一个人，衣服洗得发白，剑上有豁口。他看你一眼，说：「东西留下，人可以走。」\n\n他的手在抖，是饿的。',
    choices: [
      {
        label: '交手', hint: '战斗 · 落魄散修',
        combat: {
          enemy: 'cultivator',
          win: {
            text: '他倒在落叶里，剑脱了手。你走过去，他闭上眼等死。\n\n你没动手，把储物袋里的干粮扔在他旁边。他睁眼时，你已经走了。',
            effects: { exp: 120, attrs: { 根骨: 2 }, karma: 5, counter: { 杀人: 1 } },
          },
          lose: { text: '他的剑比你快，也比你狠。你被按在地上，储物袋被扯走，脸压在泥里。\n\n「对不住。」他说，然后走了。', effects: { hp: -55, stones: -80, injury: 2 } },
        },
      },
      {
        label: '给他一半灵石', hint: '花费 100 灵石',
        require: 'stones >= 100', requireHint: '你也没有',
        cost: { stones: 100 },
        outcome: { text: '他接过灵石，数了两遍，塞进怀里。走之前他说：往北三十里有血魔宗的人，你别去。\n\n你没问他是谁。', effects: { karma: 12, flag: { 散修情报: true }, attrs: { 道心: 2 } } },
      },
      {
        label: '问他为什么', hint: '悟性',
        roll: {
          p: 0.45, attrs: { 悟性: 0.012, 魅力: 0.006 },
          success: { text: '他愣了一下，剑尖往下掉了半寸。「宗门散了，」他说，「师兄把丹房分完了，我什么都没抢到。」\n\n你给了他十枚灵石，他接了，还了你半部剑诀。', effects: { attrs: { 悟性: 2, 魅力: 1 }, exp: 60, karma: 10 } },
          fail: { text: '「问什么。」他说完就出剑。你挡住第一下，第二下擦着肋过去了。', effects: { hp: -35, injury: 1 } },
        },
      },
    ],
  },
  {
    id: 'ev_x_antler_beast', title: '角兽', pool: 'wild', tier: 2, weight: 7, minRealm: 0,
    text: '一头鹿站在溪边喝水，角上缠着红布条，布条已经褪成粉色。\n\n它喝完了不急着走，把头转向你，像是在打量。\n\n你注意到它的蹄子踩在石头上，石头裂了。',
    choices: [
      {
        label: '退开，绕路', hint: '谨慎',
        outcome: { text: '你退了十几步，它一直看着你。你绕过溪湾走到对岸，回头时它已经不在了，溪边留着两个深坑。', effects: { attrs: { 道心: 1 }, exp: 20 } },
      },
      {
        label: '动手', hint: '战斗 · 角兽',
        combat: {
          enemy: 'beast', displayName: '角兽',
          win: {
            text: '它撞断了三棵树才倒下，角上的红布条掉进溪水里，一进水就化成一摊血。\n\n你从它角根里撬出一块乌沉沉的东西，是铁，沉得不像骨头。',
            effects: { exp: 110, items: ['xuantie'], attrs: { 根骨: 2 }, karma: -8 },
          },
          lose: { text: '它的角挑穿了你的肩，把你甩出三丈。你爬起来时它已经走了，溪边有一小块红布。', effects: { hp: -50, injury: 2 } },
        },
      },
      {
        label: '解下红布条', hint: '神识检定',
        roll: {
          p: 0.5, attrs: { 神识: 0.012 },
          success: { text: '布条上有字，是用血写的三个名字，最后一个被划掉了。你把布条烧了。\n\n鹿朝你低下头，退进林子里，蹄声很轻。', effects: { karma: 15, attrs: { 神识: 2 }, flag: { 释放角兽: true } } },
          fail: { text: '你刚一伸手，它就退了，眼睛发红。红布条在空中荡了一下，像有人从里面抓住了它。', effects: { hp: -20, demon: 5 } },
        },
      },
    ],
  },
  {
    id: 'ev_x_snake_den', title: '蛇窟', pool: 'wild', tier: 2, weight: 7, minRealm: 0,
    text: '石缝里涌出一股热气，混着腥。\n\n你数了数，洞口以下的坡上盘着二十几条蛇，最粗的那条有小腿粗，正把头搁在石头上晒太阳。\n\n它们都没动，只是齐齐地把头转向你。',
    choices: [
      {
        label: '以火驱蛇', hint: '需火灵根或符',
        require: 'char.rootId === "huo" || has("huxin_fu")', requireHint: '你没有能生火的东西',
        cost: { mp: 12 },
        outcome: { text: '火顺着坡烧上去，蛇群像退潮一样缩回石缝里。烟散了以后，洞里露出一堆蛇蜕，最上面那层还带着鳞光。\n\n蛇蜕底下压着一株被蛇群守了多年的灵草，你连根挖了。', effects: { items: ['lingcao'], exp: 60, attrs: { 神识: 1 } } },
      },
      {
        label: '杀了那条最粗的', hint: '战斗 · 石鳞蛇',
        combat: {
          enemy: 'beast', displayName: '石鳞蛇',
          win: { text: '它的头被你砍下来时还张着嘴。剩下的蛇在石壁上乱窜，你从洞里挖出一株被蛇群守着的灵草，根须上还缠着蛇蜕。', effects: { exp: 90, items: ['lingcao'], karma: -5 } },
          lose: { text: '它的牙擦过你的手腕，一股麻意顺着胳膊往上爬。你退出洞口，用灵力逼了半夜的毒。', effects: { hp: -45, injury: 1, demon: 3 } },
        },
      },
      {
        label: '绕坡下走', hint: '',
        outcome: { text: '你贴着坡根绕过去，离得最近的一条蛇只有两尺。它没动。\n\n你走出很远才发现自己一直屏着气。', effects: { attrs: { 道心: 1 }, exp: 15 } },
      },
    ],
  },
  {
    id: 'ev_x_dead_village', title: '空村', pool: 'wild', tier: 1, weight: 8, minRealm: 0,
    text: '村子空了，门都开着，锅还架在灶上。\n\n有一家的桌上摆着四碗饭，饭已经硬了，没有人动过。\n\n你在巷子里走，听见自己脚步的回声，比该有的多一下。',
    choices: [
      {
        label: '挨家看看', hint: '神识 · 一月',
        cost: { month: 1 },
        roll: {
          p: 0.5, attrs: { 神识: 0.01, 气运: 0.005 },
          success: { text: '最后一间屋里，墙角有堆新土。你挖开，是一只木匣，里面有一张符和一小袋灵石，压着一张纸条：给来收尸的人。', effects: { stones: 120, items: ['huxin_fu'], exp: 30 } },
          fail: { text: '你推开第七扇门，屋里的桌椅摆得整整齐齐，四个人坐在桌边，脸都是空的。\n\n你退出去，门自己关上了。', effects: { hp: -25, demon: 10 } },
        },
      },
      {
        label: '在村口立个牌子', hint: '善缘',
        cost: { month: 1 },
        outcome: { text: '你劈了一块门板，写上「此处无人，勿入」，钉在村口的槐树上。\n\n钉完最后一颗钉子，村里所有的门同时响了一声，像在道谢。', effects: { karma: 20, attrs: { 道心: 3 }, exp: 40 } },
      },
      { label: '快步穿过去', outcome: { text: '你走得很快，一直走到日头偏西才停。\n\n回头看，村子在暮色里很小，像个蹲着的什么东西。', effects: { hp: -5, demon: 2 } } },
    ],
  },
  {
    id: 'ev_x_cliff_carving', title: '崖刻', pool: 'wild', tier: 3, weight: 5, minRealm: 1,
    text: '崖壁上刻满了字，从下往上，字越来越小，最上面一排要仰着头才看得见。\n\n刻字的人显然刻了很多年，前面还是工整的楷书，后面已经成了歪歪扭扭的划痕。\n\n最后一句话是：「我数到八万。」',
    choices: [
      {
        label: '读完所有字', hint: '悟性检定 · 耗时',
        cost: { month: 1 },
        roll: {
          p: 0.55, attrs: { 悟性: 0.012 },
          success: { text: '前七千字讲的是一套呼吸的法子，很笨，但极稳。后面全是数数。\n\n你照着呼吸了三天，经脉里的灵气第一次自己走完一整圈。', effects: { attrs: { 悟性: 3, 根骨: 2 }, expPct: 0.18, techniques: [{ id: 'yabi_xi', name: '《崖壁息法》', speed: 0.06 }] } },
          fail: { text: '读到第五千字，字迹开始重影。你揉了揉眼，再看时那些字已经不像字了。\n\n你在崖下睡了一天一夜。', effects: { hp: -20, demon: 6, attrs: { 悟性: 1 } } },
        },
      },
      {
        label: '只刻一句话给自己', hint: '',
        outcome: { text: '你在最下面找了个空处，刻了三个字：还在走。\n\n刻完你退开看，发现自己那三个字比上面所有的字都丑。', effects: { attrs: { 道心: 3 }, exp: 45, flag: { 崖上留字: true } } },
      },
      { label: '找他数到八万之后', hint: '神识 ≥ 20',
        require: 'char.attrs.神识 >= 20', requireHint: '看不出后面还有什么',
        outcome: { text: '字迹旁边有一片被手指磨出的凹痕，凹痕往里，是一个只容一人的石窝，窝里有人坐化的痕迹。\n\n他的膝盖朝着崖壁，不是朝着路。', effects: { attrs: { 神识: 3, 道心: 2 }, expPct: 0.12, flag: { 石窝: true } } } },
    ],
  },
  {
    id: 'ev_x_wind_gorge', title: '风谷', pool: 'wild', tier: 3, weight: 5, minRealm: 1,
    require: 'char.rootId === "feng" || char.attrs.根骨 >= 22',
    text: '峡谷里常年有风，风从谷底往上抽，抽得人站不直。\n\n谷壁上挂着很多布条和断绳，都是走过的人留下的。最下面那根绳子上，还拴着一只鞋。\n\n风里有灵气的味道，很薄，但一直在。',
    choices: [
      {
        label: '迎风走上去', hint: '风灵根 · 大机缘',
        require: 'char.rootId === "feng"', requireHint: '你的身法扛不住这风',
        outcome: { text: '你迎着风往上走，风从你身上穿过去，像穿一件旧衣服。\n\n走到谷顶时，风停了，你听见自己的呼吸声第一次这么清楚。', effects: { expPct: 0.5, attrs: { 根骨: 5, 神识: 3 }, lifespan: 10, title: '过风口', flag: { 过风谷: true } } },
      },
      {
        label: '以根骨硬撑', hint: '凶险',
        require: 'char.attrs.根骨 >= 22', requireHint: '根骨不足',
        roll: {
          p: 0.4, attrs: { 根骨: 0.01 },
          success: { text: '你抓着石缝一寸一寸往上挪，指甲全翻了。到顶时，风把血吹干在脸上。\n\n你笑了，因为你还站着。', effects: { expPct: 0.3, attrs: { 根骨: 4 }, injury: 2, title: '过风口' } },
          fail: { text: '风把你从半腰掀下来，你撞在谷壁上，一路滑到谷底。左腿的骨头断在里面，没穿出来。', effects: { hp: -70, injury: 3 } },
        },
      },
      { label: '收集布条', hint: '', outcome: { text: '你解下几根还算结实的布条，绕在自己手上。\n\n这些东西没什么用，但每一根都是一个走到这里的人留下的。', effects: { attrs: { 道心: 2 }, exp: 35 } } },
    ],
  },
  {
    id: 'ev_x_bone_bridge', title: '骨桥', pool: 'wild', tier: 4, weight: 4, minRealm: 2,
    text: '两山之间架着一座桥，桥面是一节一节的白骨，接缝处用铜丝缠着。\n\n桥头坐着一个守桥的人，穿黑，低着头。你走近，他抬起头——脸上只有一张嘴。\n\n「过桥的，都要留一句话。」',
    choices: [
      {
        label: '说一句真话', hint: '道心检定',
        roll: {
          p: 0.5, attrs: { 道心: 0.012, 悟性: 0.006 },
          success: { text: '你说：我怕死。\n\n他点点头，让开路。桥上的骨头一节一节亮起来，像有人提着灯从对岸走过来接你。', effects: { expPct: 0.3, attrs: { 道心: 5 }, lifespan: 8, flag: { 过骨桥: true }, counter: { 山行: 1 } } },
          fail: { text: '你说了一句漂亮话。他笑了，笑声从那张嘴里漏出来。\n\n桥塌了一半，你抓着铜丝爬过剩下的半座。', effects: { hp: -45, injury: 2, demon: 8 } },
        },
      },
      {
        label: '不说过，原路回去', hint: '',
        outcome: { text: '你转身。他在背后说：「你刚才想说谎。」\n\n你没有回头，但走了三里，耳朵里还是有那个笑声。', effects: { demon: 5, attrs: { 道心: 2 } } },
      },
      {
        label: '绕过桥，从谷底走', hint: '一月 · 绕远',
        cost: { month: 1 },
        outcome: { text: '谷底全是碎骨，踩上去响。你走了一天，抬头还能看见那座桥。\n\n守桥的人一直坐在那里，没动过。', effects: { attrs: { 根骨: 2 }, exp: 60, hp: -15 } },
      },
    ],
  },
  {
    id: 'ev_x_ancient_altar', title: '古坛', pool: 'wild', tier: 4, weight: 4, minRealm: 2,
    once: true,
    text: '台地中央垒着一座石坛，三层，每层都刻着看不懂的纹。\n\n坛顶放着一只青铜小鼎，鼎里没有灰，有一层薄薄的水，水面浮着两片叶子，新鲜得像刚落下来。\n\n四周很静，静得能听见水在鼎里动。',
    choices: [
      {
        label: '把手按在坛上', hint: '血脉 · 未知',
        cost: { month: 1 },
        outcome: {
          text: '石纹顺着你的掌心亮起来，一路亮到坛顶。鼎里的水翻了一下，两片叶子沉了。\n\n你听见很远的地方有人在敲钟，一声接一声，敲了九下。',
          effects: { attrs: { 神识: 3 }, flag: { 坛开: true } },
          goto: 'ev_x_altar_inner',
        },
      },
      {
        label: '取走那只鼎', hint: '贪婪 · 有代价',
        outcome: { text: '鼎入手极沉，像抱着一块碑。你走出三十步，坛上传来一声闷响，石纹全暗了。\n\n当晚你梦见两片叶子在你掌心里烂掉。', effects: { items: ['xuantie'], stones: 200, karma: -15, demon: 8, flag: { 取鼎: true } } },
      },
      {
        label: '把鼎里的水倒回土里', hint: '道心',
        cost: { month: 1 },
        outcome: { text: '你把水泼在坛下的土里，土立刻黑了，长出两株极小的苗。\n\n你走的时候，那两株苗已经有半尺高。', effects: { karma: 25, attrs: { 道心: 4 }, items: ['lingcao'], exp: 100 } },
      },
    ],
  },
  {
    id: 'ev_x_spirit_spring', title: '灵泉', pool: 'wild', tier: 3, weight: 6, minRealm: 1,
    text: '泉在山坳里，水面只有井口大，却有很浓的灵气往上冒。\n\n一只鹿的尸体倒在泉边，已经烂了，但泉边的草长到了人腰高。\n\n你在泉边站了一会儿，吸进去的气让胸口发闷。',
    choices: [
      {
        label: '在泉边打坐', hint: '一月 · 灵气太浓',
        cost: { month: 1 },
        roll: {
          p: 0.55, attrs: { 根骨: 0.008, 道心: 0.008 },
          success: { text: '灵气浓得像水，压得你喘不上气。你硬坐了三天，第四天忽然通了，胸口那股闷劲散开，经脉宽了一线。', effects: { expPct: 0.22, attrs: { 根骨: 3 } } },
          fail: { text: '灵气灌得太急，冲进你的识海。你流了半夜的鼻血，天亮时头还是昏的。', effects: { hp: -35, demon: 6, exp: 40 } },
        },
      },
      {
        label: '引泉入瓶', hint: '一月 · 得材料',
        cost: { month: 1 },
        outcome: { text: '你灌了五瓶，瓶塞压不住，气从缝里往外冒。\n\n回到城里，一个炼丹的老头看见瓶子，眼神变了，当场拿两枚回灵丹和一袋灵石换走了。', effects: { items: [{ id: 'huiling_dan', qty: 2 }], stones: 80 } },
      },
      { label: '把鹿埋了再走', hint: '', outcome: { text: '你挖了个坑，把鹿推进去，盖上土。\n\n埋完你才想起，是这具尸体养肥了这一泉的水。你也说不清自己做对了没有。', effects: { karma: 10, attrs: { 道心: 3 } } } },
    ],
  },
  {
    id: 'ev_x_wandering_monk', title: '游方僧', pool: 'wild', tier: 2, weight: 7, minRealm: 0,
    text: '路边的石头上坐着一个和尚，僧袍补了十七八个补丁，脚边放着一只破钵。\n\n他见你来了，把钵往前推了推：「施主，讨口水。」\n\n你给他水，他喝了半钵，剩下一半倒在土里。',
    choices: [
      {
        label: '问他为什么倒掉', hint: '',
        outcome: { text: '「给地下的。」他说，「他们比我渴。」\n\n他站起来，拍拍衣服，往你手里塞了一枚旧铜钱，说这钱他揣了四十年，没用过。', effects: { attrs: { 道心: 3, 悟性: 2 }, karma: 10, flag: { 旧铜钱: true } } },
      },
      {
        label: '供他一顿斋饭', hint: '一月 · 结缘',
        cost: { month: 1 },
        outcome: { text: '你陪他走了三天，一路上他什么也不讲，只在有人家门口停了停，念两句。\n\n分手时他说：你身上有杀气，压一压。这话别人也说过，只有他说的你记住了。', effects: { demon: -10, attrs: { 道心: 4 }, exp: 40 } },
      },
      {
        label: '问他会不会武', hint: '试探',
        roll: {
          p: 0.4, attrs: { 神识: 0.01, 气运: 0.006 },
          success: { text: '他笑，把手掌摊开。掌心有一个淡淡的卍字，是烫的。\n\n「会一点。」他说，「不轻易用。」你再看他时，他已经走远了。', effects: { attrs: { 神识: 3 }, exp: 80, flag: { 见过苦行僧: true } } },
          fail: { text: '「不会。」他说得很干脆，然后低头继续喝水，一副不想再聊的样子。', effects: { attrs: { 悟性: 1 } } },
        },
      },
    ],
  },
  {
    id: 'ev_x_woodcutter', title: '樵夫', pool: 'wild', tier: 2, weight: 6, minRealm: 0,
    text: '林子里有人在砍柴，斧头落下去的声音很闷，隔很久才响第二下。\n\n你走过去，看见一个樵夫背对着你，砍的是一棵已经倒下的树。\n\n他的斧头每落一次，树上的叶子就掉一片下去，落地就没了。',
    choices: [
      {
        label: '搭话', hint: '道心',
        outcome: { text: '「这树砍不完。」他说，没回头，「我砍了六十年，它还是这么粗。」\n\n你想问他为什么不换个地方，话到嘴边又咽了回去。你在他旁边坐了一夜，听见斧头响到天亮。', effects: { attrs: { 道心: 3 }, demon: 4, exp: 50, flag: { 砍树人: true } } },
      },
      {
        label: '替他砍一斧', hint: '根骨检定',
        roll: {
          p: 0.5, attrs: { 根骨: 0.01 },
          success: { text: '你接过斧头，一斧下去，树干裂开一条缝，缝里掉出一枚灰色的丹丸。\n\n樵夫看着丹丸，说：「原来有东西。」然后他就散了，斧头落在草里。', effects: { items: ['xisui_dan'], exp: 80, karma: 10, attrs: { 道心: 2 } } },
          fail: { text: '斧头卡在树里，拔不出来。你回头，樵夫不见了。\n\n你在树前站了很久，最后把自己的手割破，往缝里滴了一滴血。', effects: { hp: -15, demon: 6, exp: 30 } },
        },
      },
      { label: '悄悄走开', outcome: { text: '你退进林子里，斧头声跟了你两里。\n\n直到你走出林子，那声音才停下，停得很突然。', effects: { demon: 2 } } },
    ],
  },
  {
    id: 'ev_x_ice_cavern', title: '冰窟', pool: 'wild', tier: 4, weight: 4, minRealm: 2,
    require: 'char.rootId === "bing" || char.attrs.根骨 >= 28',
    text: '洞口结着透明的冰，冰里有东西——不是石头，是人影，一共九个，姿势各不相同。\n\n里面的冷不是天气的冷，冷得你体内的灵力流动都慢了。\n\n你在门口站了一会儿，眉毛上结了霜。',
    choices: [
      {
        label: '走进去', hint: '冰灵根 · 洗炼',
        require: 'char.rootId === "bing"', requireHint: '你进去只会冻死',
        outcome: { text: '你走进去，冰没有伤你。它顺着你的经脉走了一遍，把里面那些年积下的燥气都刮掉了。\n\n出来时，你的呼吸在空气里凝成一条白线，很久才散。', effects: { expPct: 0.55, attrs: { 根骨: 6, 神识: 3 }, demon: -15, title: '冰窟洗脉', flag: { 冰窟: true } } },
      },
      {
        label: '以根骨硬闯', hint: '极险',
        require: 'char.attrs.根骨 >= 28', requireHint: '根骨不足',
        roll: {
          p: 0.35, attrs: { 根骨: 0.008 },
          success: { text: '你在里面撑了半炷香，指甲冻掉了三片，但丹田里结出一层薄薄的寒霜，是护体的东西。', effects: { expPct: 0.35, attrs: { 根骨: 4 }, injury: 2, items: ['xisui_dan'] } },
          fail: { text: '你走进去七步就走不动了，是靠退出来时扒着冰壁爬的。醒来时，脚趾冻黑了两根。', effects: { hp: -85, injury: 3, demon: 5 } },
        },
      },
      { label: '在洞口取冰', hint: '一月', cost: { month: 1 }, outcome: { text: '你凿下一块冰，冰心里冻着一块乌黑的玄铁。冰化了，铁还是凉的，贴着掌心冷得很干净。\n\n这东西炼器用得上。', effects: { items: ['xuantie'], attrs: { 神识: 1 } } } },
    ],
  },
  {
    id: 'ev_x_flower_maze', title: '花障', pool: 'wild', tier: 3, weight: 5, minRealm: 1,
    text: '山谷里开满了花，粉的，一直开到看不见的地方。\n\n你走进去，香气很甜，甜得发闷。走了很久，你发现自己一直在沿着同一道坡往上走。\n\n前面有个穿白衣的人，也在走，走得很慢。他回头看了你一眼。',
    choices: [
      {
        label: '跟住那个人', hint: '心魔 · 凶险',
        combat: {
          enemy: 'heart_demon',
          win: { text: '你追上他，回头看你的却不是他的脸，是你自己的脸。\n\n你一剑过去，花全都黑了。香气散后，你在山谷的另一头。', effects: { expPct: 0.3, attrs: { 道心: 5 }, demon: -10 } },
          lose: { text: '他一直走在你前面，走了三天。第三天你放弃了，坐在花里，忽然很想睡。醒来时花谢了一半。', effects: { hp: -40, demon: 20, attrs: { 道心: 2 } } },
        },
      },
      {
        label: '闭气，直走', hint: '根骨检定',
        roll: {
          p: 0.55, attrs: { 根骨: 0.008, 道心: 0.008 },
          success: { text: '你屏住呼吸往前走，脸憋得发紫。花香进不来，脑子就清。\n\n你走出花海时，前面那个人已经不见了。', effects: { attrs: { 道心: 3, 根骨: 1 }, exp: 70 } },
          fail: { text: '你憋不住，深吸了一口。眼前的坡忽然变陡，你跪在花里吐了。', effects: { hp: -30, demon: 8 } },
        },
      },
      { label: '采一束花', outcome: { text: '花离了枝就枯，一束花在手里变成了干草。\n\n干草里只有一株灵草还活着。你捏着它，忽然想起自己为什么会走进这个山谷。', effects: { items: ['lingcao'], attrs: { 悟性: 1 }, demon: 3 } } },
    ],
  },
  {
    id: 'ev_x_grave_robber', title: '盗墓人', pool: 'wild', tier: 2, weight: 6, minRealm: 0,
    text: '荒坡上有一个新挖的洞，土堆在一边，还没干。\n\n洞里传出人声，是在骂人，骂完又咳嗽。\n\n你蹲在洞口看，一个瘦子正在撬棺材盖，撬了半天，盖子纹丝不动。',
    choices: [
      {
        label: '下去帮他撬', hint: '未知',
        outcome: { text: '你搭了把手，盖子开了。里面没有尸骨，只有一只上了锁的铁箱和一张字条：给开盖的人。\n\n瘦子看完字条，脸白了，把箱子推给你，自己爬了出去。', effects: { items: ['xuantie'], stones: 100, karma: -5, flag: { 开棺: true } } },
      },
      {
        label: '把他叫上来', hint: '善缘',
        outcome: { text: '「底下有东西。」你说。他不信，骂了一句，然后棺材里传出指甲刮木头的声音。\n\n他爬上来时腿是软的，跪在地上谢了你半天，把身上所有的钱都塞给你。', effects: { stones: 60, karma: 10, attrs: { 神识: 1 } } },
      },
      {
        label: '填了那个洞', hint: '一月',
        cost: { month: 1 },
        outcome: { text: '你一锹一锹把土填回去，填到一半，瘦子从里面爬出来骂你。你没停。\n\n填完你才知道，那是他爹的坟，他撬了三天。', effects: { karma: -5, attrs: { 道心: 2 }, exp: 30 } },
      },
    ],
  },
  {
    id: 'ev_x_hanging_coffins', title: '悬棺', pool: 'wild', tier: 4, weight: 3, minRealm: 2,
    once: true,
    text: '崖壁上凿了很多方洞，每个洞里搁着一口棺材，几十口，对着江。\n\n最高的那一口没有盖严，缝里垂下一截红绸，被风吹了很多年，颜色还没褪。\n\n崖下没有路，只有一条凿出来的脚窝，窄得放不下整只脚。',
    choices: [
      {
        label: '爬上去看那口红绸', hint: '根骨 · 极险',
        roll: {
          p: 0.4, attrs: { 根骨: 0.01, 气运: 0.01 },
          success: {
            text: '你踩着脚窝爬上去，红绸入手很轻。棺材里没有骨，只有一卷画，画上是你站在这面崖壁前，抬头看着。\n\n画的角落有落款，日期是明年。',
            effects: { attrs: { 神识: 4 }, expPct: 0.3, flag: { 悬棺画: true } },
            goto: 'ev_x_hanging_dream',
          },
          fail: { text: '第三十步时脚窝碎了。你抓着红绸往下滑，绸子断了，你摔在崖下的碎石上。\n\n抬头看，那口棺材的盖，合上了。', effects: { hp: -75, injury: 3, demon: 8 } },
        },
      },
      {
        label: '在崖下烧一炷香', hint: '道心',
        cost: { month: 1 },
        outcome: { text: '香烧到一半，江上起雾。你听见几十口棺材里同时有轻轻的响动，像很多人翻身。\n\n雾散时，香还在烧，只剩一小截，插在石头缝里，很稳。', effects: { karma: 15, attrs: { 道心: 4 }, exp: 90 } },
      },
      { label: '沿江走开', outcome: { text: '你沿着江走了。走了半天，回头还能看见那些黑洞洞的方口。\n\n风把那截红绸吹得很直，像在指路。', effects: { attrs: { 悟性: 1 } } } },
    ],
  },
  {
    id: 'ev_x_fox_den', title: '狐穴', pool: 'wild', tier: 3, weight: 5, minRealm: 0,
    text: '土坡下有个洞口，洞口扫得很干净，旁边摆着三只小碗，碗里有水。\n\n你蹲下看，碗是细瓷的，不像是野物用的。\n\n洞里传出声音，是有人在数数，数到七就重来。',
    choices: [
      {
        label: '喊一声', hint: '神识',
        roll: {
          p: 0.5, attrs: { 神识: 0.008, 魅力: 0.006 },
          success: { text: '数数的声音停了。过了一会儿，洞里走出一个穿青衣的女人，头发梳得很整。\n\n「你听得见？」她问。你说听得见。她笑了，把三只碗收进袖子，留下一条白帕子，帕子里包着一张符。', effects: { items: ['shenxing_fu'], attrs: { 魅力: 2 }, flag: { 狐识: true } } },
          fail: { text: '数数的声音快了，越数越乱，最后变成一片尖响。你捂着耳朵后退，洞口塌了半边。', effects: { hp: -25, demon: 8 } },
        },
      },
      {
        label: '往里扔石头', hint: '不智',
        outcome: { text: '石头滚进去，撞到什么东西，叮的一声。\n\n洞里安静了。你等到天黑，什么也没出来。走的时候，三只碗都碎了。', effects: { karma: -10, demon: 5 } },
      },
      { label: '把碗添满水', outcome: { text: '你去溪边舀了水，把三只碗一一添满。\n\n数数的声音停了。你没有回头，但你知道洞口站着什么，在看你。', effects: { karma: 8, attrs: { 道心: 2 }, flag: { 添水: true } } } },
    ],
  },
  {
    id: 'ev_x_broken_temple', title: '荒寺', pool: 'wild', tier: 3, weight: 5, minRealm: 1,
    text: '寺在半山，山门倒了，匾额摔成三截，只认得出一个「寂」字。\n\n殿里的佛像被凿掉了脸，蒲团上落了厚厚一层灰，只有正中的一个，灰是新的。\n\n有人在拜。',
    choices: [
      {
        label: '等他拜完', hint: '一月',
        cost: { month: 1 },
        outcome: { text: '那个人拜了整整一天，起身时衣服上的灰都没拍。\n\n他走前对你说：这佛不灵，但跪着的人灵。说完他把自己的蒲团挪了挪，让出一个位置。', effects: { attrs: { 道心: 3, 悟性: 2 }, exp: 60 } },
      },
      {
        label: '自己也跪一个', hint: '道心',
        outcome: { text: '你跪下，想了半天没想出来求什么。\n\n最后你在心里说：求个明白。殿里没有回应，但你起身时，膝盖上的灰比别人少。', effects: { attrs: { 道心: 2 }, demon: -8, exp: 40 } },
      },
      {
        label: '找找寺里的东西', hint: '神识 · 贪',
        roll: {
          p: 0.5, attrs: { 神识: 0.01, 气运: 0.006 },
          success: { text: '佛像的肚子里塞着经卷，多数已经烂了，最里面一层还完好。\n\n那是半部讲静心的残经。', effects: { items: ['changchun_gong'], attrs: { 道心: 2 }, karma: -5 } },
          fail: { text: '你伸手进去，摸到的是一把头发。再往里，手指被咬住了。', effects: { hp: -30, demon: 10 } },
        },
      },
    ],
  },
  {
    id: 'ev_x_dead_traveler', title: '道旁', pool: 'wild', tier: 1, weight: 8, minRealm: 0,
    text: '道边躺着一个死人，脸朝下，手里还攥着半张饼。\n\n看衣服是赶路的行商，鞋底磨穿了。\n\n走这条路的人很多，没有一个人停下来。你站了一会儿，日头在背后。',
    choices: [
      {
        label: '把他埋了', hint: '一月',
        cost: { month: 1 },
        outcome: { text: '你挖了半人深的坑，把他放平，饼塞回他手里。\n\n埋完你在他包袱里找到一枚小小的银锁，刻着两个字，是名字。你把银锁也埋了，包袱里的几块碎灵石留作了路费。', effects: { karma: 15, attrs: { 道心: 2 }, stones: 40 } },
      },
      {
        label: '翻他的包袱', hint: '贪',
        outcome: { text: '包袱里有两串铜钱、一件换洗衣裳、一张写着地址的纸。\n\n你把钱收了，纸塞回去。走出很远，你想起纸上那个地址，是往你来的方向的。', effects: { stones: 80, karma: -12, demon: 4 } },
      },
      { label: '给他盖一层土', outcome: { text: '土不深，只能盖住脸。\n\n你往回走了半里，又回来，把那半张饼拿走了。你告诉自己是不想浪费。', effects: { karma: -3, attrs: { 道心: 1 } } } },
    ],
  },
  {
    id: 'ev_x_fire_from_sky', title: '天火', pool: 'wild', tier: 5, weight: 2, minRealm: 2,
    once: true,
    text: '傍晚，天边落下来一团火，不快，像一片烧着的叶子。\n\n它落在三十里外的荒地上，火光冲天，烧了一夜，到早上还没熄。\n\n你赶到时，火只烧着一个圈，圈内的土是琉璃色的。',
    choices: [
      {
        label: '走进火圈', hint: '九死 · 天大机缘',
        roll: {
          p: 0.35, attrs: { 气运: 0.015, 根骨: 0.008 },
          success: {
            text: '火从你身上烧过去，皮肤一寸寸裂开又长回来。你不觉得疼，只觉得轻。\n\n火熄时，你站在琉璃地中央，掌心里有一小簇火，不烧手。',
            effects: { expPct: 0.9, attrs: { 根骨: 8, 神识: 6 }, mp: 80, lifespan: 30, title: '天火洗身', flag: { 天火: true } },
          },
          fail: { text: '火只烧掉你一层皮就散了。你在琉璃地上躺着，听见自己的骨头在响。\n\n爬出去用了两天。', effects: { hp: -95, injury: 3, demon: 10 } },
        },
      },
      {
        label: '收集火种', hint: '一月 · 炼器',
        cost: { month: 1 },
        outcome: { text: '你用三块玄铁裹住一缕火，装进铁匣。匣子一直在跳。\n\n这东西拿出去，够换一笔大钱，也够让人起杀心。', effects: { items: ['xuantie'], stones: 300, attrs: { 神识: 2 }, flag: { 天火种: true } } },
      },
      { label: '远远看着', outcome: { text: '你在坡上坐到火灭。\n\n火光把你的影子拉得很长，一直拉到脚边，像另一个人站着。', effects: { attrs: { 悟性: 2 }, exp: 60 } } },
    ],
  },
  {
    id: 'ev_x_seal_crack', title: '封石', pool: 'wild', tier: 5, weight: 2, minRealm: 4,
    once: true,
    require: 'char.attrs.神识 >= 35 || realm >= 3',
    text: '山体上嵌着一块黑石，石上贴了九道符，符纸已经朽了，只有最后一枚铜钉还亮。\n\n你靠近时，石头里传出很轻的敲击声，三下，停一停，再三下。\n\n那不是求救的节奏，是有人在里头等得不耐烦了。',
    choices: [
      {
        label: '揭下符纸', hint: '放出点什么 · 极险',
        outcome: {
          text: '符纸一揭就碎。黑石上裂开一道细缝，缝里出来的第一口气，把你推退了一丈。\n\n你听见里面有人在笑，笑得很克制。',
          effects: { demon: 10, flag: { 封印松动: true } },
          goto: 'ev_x_seal_broken',
        },
      },
      {
        label: '重新贴上符', hint: '一月 · 消耗',
        require: 'has("huxin_fu")', requireHint: '没有可用的符',
        cost: { item: 'huxin_fu', month: 1 },
        outcome: { text: '你把符按在裂缝上，血从指缝里渗进石纹。敲击声停了。\n\n你退开三步，那三下又响了起来，很轻，像在笑你。', effects: { karma: 20, attrs: { 神识: 3 }, expPct: 0.2, flag: { 加固封印: true } } },
      },
      { label: '记下位置就走', outcome: { text: '你在识海里把这块石头的方位记了三遍，转身下山。\n\n走到山脚，你还在想那三下敲击，节奏和你心跳一样。', effects: { attrs: { 神识: 2 }, flag: { 记住封石: true }, demon: 4 } } },
    ],
  },
  {
    id: 'ev_x_old_monster_cave', title: '老怪', pool: 'wild', tier: 5, weight: 2, minRealm: 4,
    text: '雪山深处有一个山洞，洞口的雪是干净的，一丝脚印都没有。\n\n你走进去，洞壁上挂着冰，冰里冻着人，一共十一个，都睁着眼。\n\n最里面坐着一个人，头发雪白，正用指甲在冰上刻字。他抬头：「来得正好，我缺一个。」',
    choices: [
      {
        label: '不退，拔剑', hint: '战斗 · 雪窟老怪',
        combat: {
          enemy: 'old_monster', displayName: '雪窟老怪',
          win: {
            text: '他死的时候很平静，手里的指甲断在冰上。你在他身下摸到一只玉匣，匣里是一枚九转丹。\n\n洞壁上的冰开始化，十一个人闭上眼睛。',
            effects: { expPct: 0.6, items: ['jiuzhuan_dan'], attrs: { 根骨: 4 }, karma: 15, title: '斩雪窟老怪', flag: { 雪窟: true } },
          },
          lose: { text: '他的手按在你胸口，你听见自己的心跳被按停了半拍。\n\n醒过来时你躺在洞外，胸口有一个青紫的手印，一直没退。', effects: { hp: -100, injury: 3, demon: 15 } },
        },
      },
      {
        label: '说：我给你刻', hint: '诡异 · 交换',
        cost: { month: 3 },
        outcome: { text: '你替他刻了三个月的字，刻的都是一些人名，刻完他就抹掉。\n\n第三个月最后一天，他说了句「够了」，把手按在你头顶，你全身的灵力被抽走一半，又灌回来一些别的。\n\n你下山时，忘了自己这三个月在做什么。', effects: { attrs: { 悟性: 5, 神识: 4 }, demon: 10, lifespan: -10, expPct: 0.3, flag: { 与老怪有约: true } } },
      },
      { label: '退出去', outcome: { text: '你退出洞口，鞠了一躬。\n\n他在里面说：「下次来，记得带上你自己。」你没敢回头。', effects: { attrs: { 道心: 2 }, demon: 5 } } },
    ],
  },
  {
    id: 'ev_x_ghost_king_hall', title: '鬼王殿', pool: 'wild', tier: 5, weight: 2, minRealm: 4,
    once: true,
    text: '地宫的门开在乱葬岗下面，进去是一条很长的甬道，两侧站着披甲的鬼卒，一动不动。\n\n殿上有一张空椅子，椅背上钉着九十九根钉子。\n\n你走上殿时，所有鬼卒同时跪下，跪的方向是你。',
    choices: [
      {
        label: '坐上那张椅子', hint: '鬼道 · 万劫',
        roll: {
          p: 0.3, attrs: { 道心: 0.012, 神识: 0.008 },
          success: {
            text: '钉子一根根退出来，落在地上。你坐下的瞬间，整座地宫的鬼气往你身上涌。\n\n你没有变。你只是从那以后，能看见活人身上什么时候开始冷。',
            effects: { expPct: 0.75, attrs: { 神识: 8, 道心: 4 }, demon: 15, title: '鬼王座上人', flag: { 坐过鬼王座: true } },
          },
          fail: { text: '你的膝盖刚弯下去，就听见无数人在你耳边同时开口。\n\n醒来时你趴在殿门口，身上多了九十九个小孔，像被钉子穿过。', effects: { hp: -90, injury: 3, demon: 30 } },
        },
      },
      {
        label: '砍断那些钉子', hint: '道心',
        cost: { month: 1 },
        outcome: { text: '你一根一根砍，砍到第九十九根，椅子自己塌了。\n\n鬼卒们一个个化烟，最后剩下一个老鬼，朝你拱手：「我们等了四百年，等一个不肯坐的人。」他给了你一样东西。', effects: { items: ['jiuzhuan_dan'], karma: 40, attrs: { 道心: 6 }, expPct: 0.35, flag: { 断钉: true } } },
      },
      {
        label: '去椅后看看', hint: '神识',
        roll: {
          p: 0.45, attrs: { 神识: 0.012 },
          success: { text: '椅子后面堆着九十九具尸骨，每具颈上挂一块木牌。最后一块还空着，背面刻着一个日期。\n\n是今天。你把木牌掰了。', effects: { attrs: { 神识: 4 }, exp: 200, demon: 10, flag: { 掰牌: true } } },
          fail: { text: '你刚走到椅后，所有鬼卒同时抬头。它们的脸是一样的，都是你的脸。', effects: { hp: -60, demon: 20 } },
        },
      },
    ],
  },
  {
    id: 'ev_x_blood_pool', title: '血池', pool: 'wild', tier: 4, weight: 3, minRealm: 2,
    text: '谷底有一个池子，池水是暗红的，不臭，反而有一点甜。\n\n池边立着七根木桩，桩上还挂着布条和头发。\n\n你走近，池水表面轻轻动了一下，像有什么在下面转了个身。',
    choices: [
      {
        label: '填了这池子', hint: '战斗 · 血修士',
        combat: {
          enemy: 'blood_cult',
          win: { text: '他从池里出来时浑身是血，不是他的。你把他的头按进池里，池水开始退。\n\n最后池底只剩一层黑泥和七副牙。', effects: { expPct: 0.3, karma: 25, reputation: 15, flag: { 破血池: true } } },
          lose: { text: '他的手抓住你的脚踝，往池里拖。你割断自己的袖子才挣出来，池水喝了你不少血。', effects: { hp: -70, injury: 2, demon: 12 } },
        },
      },
      {
        label: '以血换功', hint: '魔道 · 代价重',
        cost: { hp: 40 },
        outcome: { text: '你割开手掌，血滴进池里。池水翻起来，顺着你的手臂往上爬，凉得像蛇。\n\n三天后你的修为涨了一大截，但那三天里你一直想吃肉，生的。', effects: { expPct: 0.5, attrs: { 根骨: 4 }, demon: 25, karma: -25 } },
      },
      { label: '离开这里', outcome: { text: '你转身就走，走得很快。\n\n身后的池水开始冒泡，一直到你走出谷口才停。', effects: { attrs: { 道心: 2 } } } },
    ],
  },
  {
    id: 'ev_x_jindan_ruin', title: '遗府', pool: 'wild', tier: 4, weight: 3, minRealm: 2,
    text: '半塌的石门后面是一处洞府，丹炉倒在中间，炉底的灰还是干的。\n\n墙上挂着一条腰带，腰带上绣着云纹，是结丹修士才配的东西。\n\n你往里走，脚底下踩到了骨头，一踩就碎。',
    choices: [
      {
        label: '往里走到底', hint: '战斗 · 遗府残魂',
        combat: {
          enemy: 'jindan_elder', displayName: '遗府残魂',
          win: { text: '那东西只剩一口气撑着，死了以后就散了。丹炉下面压着一只匣子，匣子里有两枚丹药，其中一枚还带着温。', effects: { expPct: 0.4, items: ['zhuji_dan', 'pozhang_dan'], attrs: { 神识: 2 }, flag: { 得遗府: true } } },
          lose: { text: '它一掌拍在你胸口。你飞出去撞在石门上，肋骨断了四根，吐出来的血是黑的。', effects: { hp: -85, injury: 3, demon: 8 } },
        },
      },
      {
        label: '只取腰带', hint: '稳妥',
        outcome: { text: '你把腰带解下来，布料入手就碎了一半，只剩一枚玄铁带扣还完好。\n\n你捧着剩下的半条走出去，觉得背后一直有人在看。', effects: { items: ['xuantie'], stones: 150, karma: -5 } },
      },
      {
        label: '替他收拾丹炉', hint: '一月 · 道心',
        cost: { month: 1 },
        outcome: { text: '你把丹炉扶正，扫了灰，把散在地上的骨头收进一只陶罐，摆在炉边。\n\n做完这些，炉里自己生出一点火。你把那点火收了。', effects: { attrs: { 道心: 4, 悟性: 2 }, karma: 20, expPct: 0.15, flag: { 遗府炉火: true } } },
      },
    ],
  },
  {
    id: 'ev_x_heart_lake', title: '心湖', pool: 'wild', tier: 4, weight: 3, minRealm: 3,
    text: '湖很小，水很浅，浅到能看见底。底下躺着的不是石头，是一层一层的人形，都是躺着的姿势。\n\n你蹲在岸边，水里的自己也蹲下来。\n\n它比你慢半息。',
    choices: [
      {
        label: '把手伸进水里', hint: '心魔 · 照见',
        outcome: {
          text: '水里的你抓住你的手腕，力气不大，只是不放。\n\n它开口，用你的声音说：你坐下来，换我上去。',
          effects: { demon: 8, attrs: { 神识: 2 } },
          goto: 'ev_x_heart_lake_shore',
        },
      },
      {
        label: '以剑搅乱水面', hint: '战斗 · 心魔',
        combat: {
          enemy: 'heart_demon',
          win: { text: '水被搅成一片碎光，底下的人形一个个翻过身去。\n\n你收剑时手是稳的。这是很久没有过的事。', effects: { expPct: 0.3, attrs: { 道心: 6 }, demon: -20 } },
          lose: { text: '剑进了水，水里的你接住了剑。\n\n它把剑递回来的时候，你接的时候用了两只手。你没觉得有什么不对。', effects: { demon: 25, attrs: { 道心: 1 }, hp: -30 } },
        },
      },
      { label: '走开', outcome: { text: '你起身走开。水里的你慢了半息才站起来，然后一直站在原地看你走。', effects: { attrs: { 道心: 3 }, demon: 4 } } },
    ],
  },
  {
    id: 'ev_x_mountain_god', title: '山神', pool: 'wild', tier: 4, weight: 3, minRealm: 1,
    once: true,
    text: '你在山里迷了路，走到一处没有路的地方，前面立着一块无字的石。\n\n石头后面走出一个很高的人，穿的是树皮，脸被藤蔓遮着。\n\n「你踩坏了我三棵苗。」他说，声音像土在动。',
    choices: [
      {
        label: '认错，赔他', hint: '花费 100 灵石',
        require: 'stones >= 100', requireHint: '身上没有灵石',
        cost: { stones: 100 },
        outcome: { text: '他收下灵石，埋进土里。过了一会儿，那三处被他指过的地方长出三棵新苗。\n\n「走吧。」他说，「下次看着脚下。」他抬手在你肩上按了一下，你身上的土气散了。', effects: { karma: 20, attrs: { 根骨: 3, 道心: 2 }, flag: { 山神庇佑: true }, buff: { breakBonus: 0.02 } } },
      },
      {
        label: '说：山里本来没有路', hint: '顶撞 · 有胆',
        roll: {
          p: 0.45, attrs: { 道心: 0.012, 悟性: 0.008 },
          success: { text: '他沉默了很久，然后笑了，笑声让整座山的叶子都在抖。\n\n「有道理。」他说，「那你走出来的路，就是你的。」他让开路，你走出去时，脚下真的有一条路。', effects: { attrs: { 悟性: 4, 道心: 3 }, expPct: 0.25, flag: { 山神认可: true } } },
          fail: { text: '他一脚跺下去，地裂开一道缝，你掉进去半截身子。爬出来时，膝盖以下的土变成了石头。', effects: { hp: -50, injury: 2 } },
        },
      },
      { label: '不说话，跪下', outcome: { text: '你跪下，额头碰到土。\n\n他站了一会儿，说：「跪没用。」然后走了。你抬头时，前面多了一条兽道，窄，但通。', effects: { attrs: { 道心: 2 }, exp: 60 } } },
    ],
  },
  {
    id: 'ev_x_rock_ape', title: '山魈', pool: 'wild', tier: 2, weight: 6, minRealm: 0,
    text: '石头后面有东西在看你。你绕过去，它绕过来。\n\n第三次照面，你终于看清了：一人高，浑身黑毛，脸有点像人，嘴咧到耳根，一直在笑。\n\n它手里拎着一根人的腿骨。',
    choices: [
      {
        label: '先动手', hint: '战斗 · 山魈',
        combat: {
          enemy: 'beast', displayName: '山魈',
          win: { text: '它死得很安静，笑还挂在脸上。你在它窝里找到一堆东西：铜钱、骨头、一只还能用的储物袋。', effects: { exp: 100, stones: 90, items: ['liaoshang_dan'] } },
          lose: { text: '它的爪子从你肩头刮到腰，你的衣服和皮一起裂开。它没追，只是坐在石头上笑。', effects: { hp: -55, injury: 2 } },
        },
      },
      {
        label: '学它的样子笑', hint: '怪招',
        roll: {
          p: 0.45, attrs: { 魅力: 0.01, 气运: 0.008 },
          success: { text: '你咧嘴笑，笑到脸酸。它愣了一下，也笑，然后把腿骨扔给你，转身跳上崖壁走了。\n\n那根骨头很沉，不是人的。', effects: { items: ['xuantie'], attrs: { 魅力: 2 }, exp: 50 } },
          fail: { text: '你笑到一半，它的笑收了。它扑过来，你退得快，只被抓掉一块头皮。', effects: { hp: -30, injury: 1 } },
        },
      },
      { label: '退走', outcome: { text: '你退着走，它跟着你走了半里，一直笑。\n\n到你上了大路，它才停下，把腿骨往地上一插，像插一面旗。', effects: { attrs: { 道心: 1 }, demon: 3 } } },
    ],
  },
  {
    id: 'ev_x_lost_trail', title: '迷径', pool: 'wild', tier: 1, weight: 8, minRealm: 0,
    text: '山里的岔路很多，每条看着都像正路。\n\n你在第三个岔口坐下，看见地上有前人堆的石堆，三块一叠，一共五叠。\n\n最上面那块石头上，有人用刀刻了个箭头，指的方向，和你来时一样。',
    choices: [
      {
        label: '按箭头走', hint: '',
        outcome: { text: '你往回走了半天，回到第二个岔口。石堆也是往回的。\n\n你终于明白，堆石堆的人也在找路，而且没找到。', effects: { hp: -10, attrs: { 悟性: 2 }, exp: 30 } },
      },
      {
        label: '自己认方向', hint: '神识检定',
        roll: {
          p: 0.55, attrs: { 神识: 0.008, 气运: 0.006 },
          success: { text: '你看树的长势，看水流的坡向，看云走的方向。半天后你走出了山。\n\n出山的地方，离你要去的地方只有三里。', effects: { attrs: { 神识: 2 }, exp: 50 } },
          fail: { text: '你认错了方向，走进了一片死竹林。在里面转到天黑，才顺着水声出来。', effects: { hp: -25, attrs: { 悟性: 1 } } },
        },
      },
      { label: '再加一叠石堆', outcome: { text: '你在第五叠旁边加了一叠，六块，比你见过的都高。\n\n走的时候你想，也许后面的人会看见。', effects: { karma: 6, attrs: { 道心: 1 } } } },
    ],
  },
  {
    id: 'ev_x_dew_grass', title: '露草', pool: 'wild', tier: 1, weight: 9, minRealm: 0,
    text: '天没亮，草叶上全是露水。\n\n有一种草，露水只结在叶心，一颗，很圆，太阳一出来就没了。\n\n你蹲下来，看见一整片都结着这样的水珠，一颗一颗，像有人摆的。',
    choices: [
      {
        label: '趁天没亮采完', hint: '一月 · 熬夜',
        cost: { month: 1 },
        outcome: { text: '你采了三个清晨，把这批露水收进两只玉瓶，只装了半瓶，后来托人炼成了一枚回灵丹。\n\n最后一早，你看见整片草都蔫了。你有点后悔，但瓶子已经收进怀里。', effects: { items: ['huiling_dan'], exp: 30, karma: -3 } },
      },
      {
        label: '只取一颗，含在舌下', hint: '悟性',
        roll: {
          p: 0.6, attrs: { 悟性: 0.01 },
          success: { text: '露水化在舌上，是凉的，凉意一路走到眉心。你在原地坐了一个时辰，睁眼时，看东西比从前清。', effects: { attrs: { 悟性: 2, 神识: 1 }, exp: 40 } },
          fail: { text: '露水有点苦。你没坐住，肚子疼了半日，什么也没悟出来。', effects: { hp: -12 } },
        },
      },
      { label: '等太阳出来看它们消失', outcome: { text: '太阳一露头，那些水珠一颗一颗灭掉，很快。\n\n你看完了整个过程，心里空了一下，说不上为什么。', effects: { attrs: { 道心: 2 }, demon: -4 } } },
    ],
  },
  {
    id: 'ev_x_wolf_cub', title: '狼崽', pool: 'wild', tier: 1, weight: 7, minRealm: 0,
    text: '石缝里有一只狼崽，很小，眼睛还没睁利索，一直在叫。\n\n母狼不在附近，地上有拖拽的痕迹，还有一摊已经干了的血。\n\n它闻到你的味道，叫声变大了。',
    choices: [
      {
        label: '带走它', hint: '养一只',
        cost: { month: 1 },
        outcome: {
          text: '你用布把它裹起来，喂了点肉汤。它在你怀里睡了一路，醒来就开始咬你的手指。\n\n你知道它长大以后会是什么，但你还是没放下。',
          effects: { attrs: { 道心: 1, 魅力: 1 }, karma: 8, flag: { 养狼: true }, relation: { 狼崽: 5 } },
          goto: 'ev_x_wolf_cub_den',
        },
      },
      {
        label: '留在原地', hint: '',
        outcome: { text: '你把它挪到更深的石缝里，用草盖住。\n\n走的时候它还叫，叫得很有劲。你没回头。', effects: { karma: 3, attrs: { 道心: 1 } } },
      },
      {
        label: '杀了它，取了皮', hint: '贪',
        outcome: { text: '它太小，皮剥下来只有巴掌大。你把它晾干收进储物袋，一路没再看。\n\n后来你拿它跟药农换了一株灵草，手上那股味道却一直没散。', effects: { items: ['lingcao'], karma: -18, demon: 6 } },
      },
    ],
  },
  {
    id: 'ev_x_earth_vein', title: '地脉', pool: 'wild', tier: 3, weight: 5, minRealm: 1,
    require: 'char.rootId === "tu" || char.attrs.根骨 >= 20',
    text: '一片石滩，石头都是圆的，踩上去会响。\n\n你趴下来听，石头下面有声音，很沉，一下一下，隔很久才一下。\n\n像有什么在地底翻身，翻得不急，因为它有的是时间。',
    choices: [
      {
        label: '贴着地面调息', hint: '土灵根 · 厚土',
        require: 'char.rootId === "tu"', requireHint: '你听不进地脉',
        cost: { month: 1 },
        outcome: { text: '你贴在地上，把呼吸放得和地脉一样慢。第三天，你的丹田里多了一点沉的东西，很重，但稳。\n\n起身时，你脚下的石头碎了。', effects: { expPct: 0.4, attrs: { 根骨: 6 }, title: '地脉在身', flag: { 通地脉: true } } },
      },
      {
        label: '挖下去看看', hint: '一月 · 凶险',
        cost: { month: 1 },
        roll: {
          p: 0.45, attrs: { 根骨: 0.01, 气运: 0.008 },
          success: { text: '挖到一丈深，土里露出一截发亮的根状石，摸上去是热的。你截了一小段，剩下的照原样埋回去。', effects: { items: ['xuantie'], exp: 80, attrs: { 神识: 2 } } },
          fail: { text: '土塌了。你被埋在下面，靠一只手刨了半个时辰才出来，指甲全没了。', effects: { hp: -60, injury: 2 } },
        },
      },
      { label: '什么也不动', outcome: { text: '你在石滩上坐了一夜，什么也没做。\n\n天亮时，地底的声音停了，像是知道你听完了。', effects: { attrs: { 道心: 2 }, exp: 35 } } },
    ],
  },
  {
    id: 'ev_x_stone_gate', title: '石门', pool: 'wild', tier: 3, weight: 5, minRealm: 1,
    text: '两扇石门立在荒草里，没有墙，门框上也没有顶。\n\n石门上各刻着半个字，合起来是一个「归」。\n\n你从旁边绕过去，走了十步，又回到了门前。',
    choices: [
      {
        label: '推门', hint: '秘境',
        cost: { month: 1 },
        outcome: {
          text: '门比你预想的轻。门后没有路，只有一段青石台阶，往下走。\n\n你回头看，门框外还是荒草，草在风里倒向一边。',
          effects: { attrs: { 神识: 2 }, flag: { 入石门: true } },
          goto: 'ev_x_stone_gate_inner',
        },
      },
      {
        label: '在门前打坐', hint: '一月 · 悟那个字',
        cost: { month: 1 },
        outcome: { text: '你对着那个「归」字坐了一个月。到最后你已经不认识这个字了，只觉得它像一个门口的姿势。\n\n起身时，你的心境平了很多。', effects: { attrs: { 悟性: 4, 道心: 3 }, expPct: 0.15 } },
      },
      { label: '绕远路走', outcome: { text: '你往反方向绕了三里，路通了。\n\n回头看，那两扇门还在原地，门框里是荒草，不是别的。', effects: { exp: 20 } } },
    ],
  },
  {
    id: 'ev_x_puppet_cave', title: '傀儡', pool: 'wild', tier: 4, weight: 3, minRealm: 3,
    text: '洞厅很大，摆着几十个人形的木偶，都穿着衣服，脸上涂了粉。\n\n它们排成两列，中间是一条通道，通向最里面的一个台子。\n\n你走进去，木偶的头同时转过来，关节响成一片。',
    choices: [
      {
        label: '抢在它们动之前冲', hint: '战斗 · 木傀',
        combat: {
          enemy: 'rogue', displayName: '木傀',
          win: { text: '你冲到台子上，木偶在你身后一排排倒下。台上是一枚玉简，里面刻着一套操纵之术，底下还压着一张神行符。', effects: { expPct: 0.3, items: ['shenxing_fu'], attrs: { 神识: 3 }, flag: { 得傀术: true } } },
          lose: { text: '一只木偶的手掐住了你的脖子，另一只按住你的腿。你被抬起来，放在台子上。\n\n三天后你自己醒的。', effects: { hp: -70, injury: 2, demon: 8 } },
        },
      },
      {
        label: '照它们的样子站好', hint: '怪招 · 神识',
        roll: {
          p: 0.5, attrs: { 神识: 0.01, 道心: 0.008 },
          success: { text: '你站进队列里，一动不动，站了两个时辰。\n\n木偶们把头转回去。你走出来，走到台前，从一个木偶手里取走了它握的东西。', effects: { items: ['xisui_dan'], attrs: { 神识: 3, 道心: 2 }, exp: 150 } },
          fail: { text: '你站了半个时辰，膝盖先动了。整厅的木偶同时扑过来。', effects: { hp: -65, injury: 2 } },
        },
      },
      { label: '退出去，把洞口堵上', outcome: { text: '你搬石头把洞口堵了，堵得很实。\n\n回头的路上你想，那些木偶穿着衣服，衣服是有人给他们穿上的。', effects: { karma: 5, attrs: { 道心: 1 }, exp: 40 } } },
    ],
  },
  {
    id: 'ev_x_thunder_ridge', title: '雷脊', pool: 'wild', tier: 4, weight: 3, minRealm: 2,
    require: 'char.rootId === "lei" || char.attrs.根骨 >= 26',
    text: '山脊是一片裸露的黑岩，岩上有焦痕，一道一道，像被人用刀刻的。\n\n云压得很低，云里有光在走。\n\n你站在脊上，头发竖了起来，皮肤上像有细针在扎。',
    choices: [
      {
        label: '站在脊上等雷', hint: '雷灵根 · 借雷',
        require: 'char.rootId === "lei"', requireHint: '你扛不住这一道',
        roll: {
          p: 0.55, attrs: { 根骨: 0.01 },
          success: { text: '雷落下来的时候，你听见的不是响，是静。\n\n雷走了一遍你的经脉，把里面堵着的地方一路打通。你从脊上下来时，脚下留了两个焦印。', effects: { expPct: 0.6, attrs: { 根骨: 7, 神识: 3 }, lifespan: 15, title: '雷脊引雷', flag: { 雷脊: true } } },
          fail: { text: '雷偏了半尺，落在你左肩。你半边身子麻了三天，衣服烧掉一半。', effects: { hp: -70, injury: 2, attrs: { 根骨: 2 } } },
        },
      },
      {
        label: '在脊下避雷', hint: '一月 · 观雷',
        cost: { month: 1 },
        outcome: { text: '你在岩下躲了一个月，看雷一次次落在那片黑岩上。\n\n看到后来，你能提前半息知道它要落在哪。这个本事没什么用，但很有用。', effects: { attrs: { 神识: 3, 悟性: 2 }, exp: 90 } },
      },
      { label: '绕到山后', outcome: { text: '你绕了很远。\n\n雷落在你身后的脊上，一声接一声。你走得不快，但一直没停。', effects: { attrs: { 道心: 1 } } } },
    ],
  },
  {
    id: 'ev_x_abyss_edge', title: '渊边', pool: 'wild', tier: 3, weight: 4, minRealm: 1,
    text: '地裂开一道口子，宽三十步，深得看不见底。\n\n风从下面往上吹，带着水气和铁锈味。\n\n对面崖壁上长着一株草，叶片反光，隔着这道深渊。',
    choices: [
      {
        label: '御器过去', hint: '需筑基以上',
        require: 'realm >= 1', requireHint: '修为不足，飞不过去',
        cost: { mp: 25 },
        roll: {
          p: 0.5, attrs: { 神识: 0.01, 气运: 0.008 },
          success: { text: '你踩着剑过去，风把你往下压。你贴着崖壁抓住那株草，草根扎得很深，你连根拔了。\n\n回来时，剑身一直在抖。', effects: { items: ['lingcao'], exp: 90, attrs: { 神识: 2 } } },
          fail: { text: '风在半途变了向。你被压在崖壁上，指甲抓出十道白痕，最后是爬回来的。', effects: { hp: -50, injury: 2, mp: -20 } },
        },
      },
      {
        label: '往下爬', hint: '凶险 · 未知',
        cost: { month: 1 },
        roll: {
          p: 0.35, attrs: { 根骨: 0.01, 气运: 0.01 },
          success: { text: '你往下爬了半天，看见崖壁上凿着栈道的孔，还有一只旧铁钩。\n\n再往下，雾里有一线水光。你没有再下去。', effects: { attrs: { 神识: 3 }, items: ['xuantie'], exp: 110, flag: { 渊下有水: true } } },
          fail: { text: '你踩空了一块石头，靠一只手的力气挂在崖上，挂了很久。上来时，手指的皮全磨掉了。', effects: { hp: -80, injury: 3 } },
        },
      },
      { label: '扔块石头听响', outcome: { text: '石头落下去，很久没有回声。\n\n你又扔了一块，还是没有。你退了两步，觉得脚下这层地也薄了。', effects: { attrs: { 神识: 1 }, demon: 3 } } },
    ],
  },
  {
    id: 'ev_x_gourd_hermit', title: '葫芦翁', pool: 'wild', tier: 3, weight: 4, minRealm: 1,
    text: '溪边有个老头在洗葫芦，洗得很仔细，一只一只。\n\n他身边堆着几十只葫芦，大小不一，都空着。\n\n你走过去，他抬头说：「挑一只。挑对了，我教你一样东西。」',
    choices: [
      {
        label: '挑最小的那只', hint: '眼光',
        roll: {
          p: 0.45, attrs: { 悟性: 0.012, 气运: 0.008 },
          success: { text: '他看了很久，把最小的葫芦递给你，说：「小的装得下，大的装不满。」\n\n他教你一式吐纳，很简单，你练了三天才学会第一口气。', effects: { attrs: { 悟性: 4, 根骨: 2 }, expPct: 0.2, techniques: [{ id: 'hulu_xi', name: '《葫芦吐纳》', speed: 0.07 }] } },
          fail: { text: '他摇头，把葫芦收回去：「你看的是大小，不是空。」\n\n他把洗好的葫芦一只只挂回树上，不再理你。', effects: { attrs: { 悟性: 1 }, exp: 30 } },
        },
      },
      {
        label: '挑最旧的那只', hint: '',
        outcome: { text: '那只葫芦上有裂纹，用铜丝补过。他接过去看了一会儿，说：「这是我师父的。」\n\n他没有教你东西，只是把葫芦给了你。后来你发现它装水不坏。', effects: { items: ['huiling_dan'], attrs: { 道心: 3 }, karma: 5 } },
      },
      { label: '不挑，帮他洗', hint: '一月', cost: { month: 1 }, outcome: { text: '你洗了一个月的葫芦，手泡得发白。\n\n临走他说：「你洗得比我干净。」给了你一只最大的，里面装着一口凉水，喝完还想喝。', effects: { items: ['huiling_dan'], attrs: { 道心: 2 }, exp: 70 } } },
    ],
  },
  {
    id: 'ev_x_market_stall', title: '坊市', pool: 'world', tier: 1, weight: 9, minRealm: 0,
    text: '坊市里挤满了人，摊子一直摆到河边。\n\n一个瘸腿的摊主在卖「上古法器」，摊上摆着十几件锈铁，每件都用红绳系着。\n\n他见你看，把最中间那件往前推了推：「这件，祖上传的。」',
    choices: [
      {
        label: '买下他推的那件', hint: '花费 50 灵石',
        require: 'stones >= 50', requireHint: '你买不起',
        cost: { stones: 50 },
        roll: {
          p: 0.3, attrs: { 气运: 0.015 },
          success: { text: '回去你把它泡在井水里，锈皮脱了一层，底下是半截剑身，还有灵光。\n\n你回去找那个摊子，摊子没了。', effects: { items: ['canjian'], exp: 60, flag: { 捡漏: true } } },
          fail: { text: '锈就是锈。你把它扔进河里，它沉得很干脆。', effects: { attrs: { 悟性: 1 } } },
        },
      },
      {
        label: '翻他自己的东西卖', hint: '神识',
        roll: {
          p: 0.5, attrs: { 神识: 0.01 },
          success: { text: '你从他摊子底下的布袋里挑出一枚丹药，品相不错。他愣了一下，说：「客人眼毒。」按市价卖了你。', effects: { items: ['yinqi_dan'], stones: -20, attrs: { 神识: 1 } } },
          fail: { text: '布袋里全是碎铁和旧绳子，只有一股霉味。他还笑你翻得认真。', effects: { demon: 2 } },
        },
      },
      { label: '什么也不买，听人讲价', outcome: { text: '你听了一下午。一个筑基修士为十枚灵石跟人吵了半个时辰，最后没买。\n\n你走出坊市时，天已经黑了，摊主们还在喊。', effects: { attrs: { 悟性: 1 }, stones: 10 } } },
    ],
  },
  {
    id: 'ev_x_dice_house', title: '赌坊', pool: 'world', tier: 1, weight: 8, minRealm: 0,
    text: '赌坊的门帘很厚，里面烟熏得看不清人脸。\n\n桌上押的是骰子，最大的一注压着一个铜盆，盆里是灵石。\n\n你站在桌边，庄家抬眼看你：「玩不玩？」',
    choices: [
      {
        label: '押十枚灵石', hint: '花费 10 灵石',
        require: 'stones >= 10', requireHint: '没有灵石',
        cost: { stones: 10 },
        roll: {
          p: 0.45, attrs: { 气运: 0.02 },
          success: { text: '骰子开出你押的点。庄家推给你一小堆，你手一拢，收了。周围的人开始看你。', effects: { stones: 40, attrs: { 气运: 1 } } },
          fail: { text: '开出来差一点。你把灵石推过去，庄家笑着说了句「再来」。你没有再来。', effects: { attrs: { 道心: 1 } } },
        },
      },
      {
        label: '看骰子的门道', hint: '神识 · 识破',
        roll: {
          p: 0.5, attrs: { 神识: 0.012 },
          success: { text: '骰子里灌了铅。你看出来了，庄家也看出你看出来了。\n\n他请你到后堂，给了你二十枚灵石，说：以后常来，别说话。', effects: { stones: 20, attrs: { 神识: 2 }, flag: { 识破赌坊: true }, karma: -5 } },
          fail: { text: '你看了半天什么也没看出来，倒被庄家看了半天。\n\n出门时，有两个人在后面跟着你，跟了两条街。', effects: { hp: -15, demon: 3 } },
        },
      },
      { label: '把铜盆掀了', hint: '江湖事', outcome: { text: '灵石撒了一地，所有人都扑下去抢。你趁乱走了出去。\n\n身后有人喊抓贼，声音里带着笑。', effects: { stones: 60, reputation: -10, karma: -8, flag: { 得罪赌坊: true } } } },
    ],
  },
  {
    id: 'ev_x_music_tower', title: '琴楼', pool: 'world', tier: 1, weight: 7, minRealm: 0, maxRealm: 4,
    text: '琴楼二层临水，帘子半卷。\n\n一个女子在弹琴，弹得很慢，一段弹了三遍，每次都不一样。\n\n楼下有人叫好，她没理。你站在楼下听，她忽然停了，往下看了一眼。',
    choices: [
      {
        label: '上楼', hint: '花费 30 灵石',
        require: 'stones >= 30', requireHint: '没有灵石',
        cost: { stones: 30 },
        outcome: { text: '她给你倒了一杯冷茶，说：「你听得懂第三遍。」\n\n你们没说几句话。走的时候她说，她弹了十年，只有三个人听得出第三遍不一样。', effects: { attrs: { 悟性: 2, 魅力: 2 }, relation: { 琴女: 3 }, flag: { 琴楼知音: true } } },
      },
      {
        label: '在楼下听完全曲', hint: '一月',
        cost: { month: 1 },
        outcome: { text: '你听了一个月，每晚都在楼下。她后来改成每晚只弹一遍，弹完就熄灯。\n\n你走的那天，她把一支旧琴弦从楼上扔下来，弦上系着一张符。', effects: { attrs: { 道心: 3, 悟性: 2 }, items: ['shenxing_fu'], demon: -6 } },
      },
      { label: '走开', outcome: { text: '你走了。琴声跟了你半条街，然后被市声盖住。', effects: { demon: -2 } } },
    ],
  },
  {
    id: 'ev_x_escort_job', title: '镖局', pool: 'world', tier: 2, weight: 8, minRealm: 0,
    text: '镖局门口贴着一张红纸：招护镖，走黑风岭，走一趟五十两。\n\n院子里十几个汉子在磨刀，看见你，都停了手。\n\n总镖头上下打量你：「修士？我们这趟，正缺这个。」',
    choices: [
      {
        label: '接这趟镖', hint: '战斗 · 黑风岭匪',
        combat: {
          enemy: 'bandit',
          win: { text: '匪是从两侧山上滚石头开始的。你打退了头一波，剩下的人没敢再下来。\n\n到地方时，总镖头把五十两银子换成了灵石，多给了三成。', effects: { exp: 130, stones: 150, reputation: 15, attrs: { 根骨: 2 }, flag: { 走过黑风岭: true } } },
          lose: { text: '石头砸在镖车上，车翻了。你被三个人围住，刀从背后进来，从肩头出去。\n\n镖丢了，你在山下的村子里躺了半个月。', effects: { hp: -60, injury: 2, reputation: -10 } },
        },
      },
      {
        label: '只押最后一程', hint: '一月 · 稳妥',
        cost: { month: 1 },
        outcome: { text: '最后一程是平路，你押了七天，什么事也没发生。\n\n总镖头照付了钱，末了说：「你这人实在，下次还找你。」', effects: { stones: 60, relation: { 总镖头: 3 }, attrs: { 道心: 1 } } },
      },
      { label: '问他们缺不缺记账的', hint: '', outcome: { text: '总镖头笑了：「读书人？」你说不是，只是想跟着走一趟。\n\n他让你记了半个月的账。账上有一笔写得很奇怪：某月某日，送一口空棺过岭。', effects: { attrs: { 悟性: 2 }, stones: 40, flag: { 空棺: true } } } },
    ],
  },
  {
    id: 'ev_x_arena', title: '擂台', pool: 'world', tier: 2, weight: 7, minRealm: 0,
    text: '城西的擂台上已经打了三天，赢的那个是个光头，筑基修士，站了三天没下来。\n\n台下押注的人喊得嗓子都哑了。\n\n主持人看见你身上的灵气，走过来问：「上不上？赢了他，彩头一百二十枚灵石。」',
    choices: [
      {
        label: '上擂台', hint: '战斗 · 擂主',
        combat: {
          enemy: 'cultivator', displayName: '擂台光头',
          win: { text: '他倒下去的时候还睁着眼。台下静了一瞬，然后有人开始喊你的名字。\n\n你下台时，一百二十枚灵石的彩头砸在你脚边。', effects: { exp: 120, stones: 120, reputation: 20, attrs: { 根骨: 2 }, counter: { arena_win: 1 } } },
          lose: { text: '他的一掌贴在你胸口，你飞下擂台，撞翻了三个押注的人。\n\n醒的时候有人往你手里塞了几枚灵石。', effects: { hp: -50, injury: 1, reputation: -5 } },
        },
      },
      {
        label: '押光头赢', hint: '花费 50 灵石',
        require: 'stones >= 50', requireHint: '没有灵石',
        cost: { stones: 50 },
        outcome: { text: '光头赢了第四场。你收了钱，下注的人骂骂咧咧地散了。\n\n你回头看了一眼擂台，光头的腿上有一道新伤，血顺着手腕往下滴。', effects: { stones: 120, attrs: { 气运: 1 } } },
      },
      { label: '看，不下注', outcome: { text: '你看了三天，把台上人的出手都记下了。\n\n第四天光头被打下去，赢的是个瘦子，用的是光头自己的招式。', effects: { attrs: { 悟性: 2 }, exp: 50 } } },
    ],
  },
  {
    id: 'ev_x_tax_man', title: '税吏', pool: 'world', tier: 1, weight: 8, minRealm: 0, maxRealm: 2,
    text: '村口摆着一张桌，两个差役在收丁税。\n\n一个老农翻遍了口袋，差出二十文。差役把他的锅拎起来，砸在地上。\n\n老农跪下去捡碎片，手一直在抖。',
    choices: [
      {
        label: '替他把钱补上', hint: '花费 30 灵石',
        require: 'stones >= 30', requireHint: '拿不出',
        cost: { stones: 30 },
        outcome: { text: '差役收了钱，看你的眼神变了，什么也没说就走了。\n\n老农要给你磕头，你把他扶起来。他的袖子是空的，另一边。', effects: { karma: 20, reputation: 8, attrs: { 道心: 2 } } },
      },
      {
        label: '把桌子掀了', hint: '动手',
        roll: {
          p: 0.6, attrs: { 根骨: 0.008, 道心: 0.005 },
          success: { text: '桌子翻了，册子散在泥里。两个差役跑了，跑得比村里人还快。\n\n村里人没敢欢呼，只是把碎锅捡走了。', effects: { karma: 15, reputation: 20, flag: { 抗税: true }, demon: 3 } },
          fail: { text: '你掀了桌子，第二天县里来了七个带刀的。你不愿对凡人下重手，挨了几下刀鞘，在村外的山上躲了三天。', effects: { hp: -30, reputation: -15, flag: { 通缉: true } } },
        },
      },
      { label: '走开', outcome: { text: '你走开了。身后有瓷器碎裂的声音，接着是差役的笑。\n\n你走得很快。', effects: { karma: -8, demon: 4 } } },
    ],
  },
  {
    id: 'ev_x_siege_city', title: '围城', pool: 'world', tier: 4, weight: 4, minRealm: 1,
    once: true,
    text: '城被围了四十天。围城的是北边草滩下来的狼群，领头的是一头比马还高的白狼。城墙上的人越来越少，城下的狼越来越多。\n\n你进城时，米价已经涨到一斗一串钱，街上有人在卖马。\n\n守将站在城头，披风破了，正在看城外那一片绿莹莹的眼睛。',
    choices: [
      {
        label: '留下守城', hint: '战斗 · 朔川狼王',
        combat: {
          enemy: 'demon_general',
          win: {
            text: '你从城头跳下去，落进狼群，一路杀到那头白狼跟前。城上的人跟着喊起来。\n\n狼群退了三里。守将下来时，把披风解下来给你，说：这城欠你一条命。',
            effects: { expPct: 0.4, reputation: 90, karma: 40, title: '守城人', flag: { 守过围城: true } },
          },
          lose: { text: '那头白狼一口咬穿你的肩，把你按在城墙根下。你是被自己人用钩子拖回去的。\n\n城最后没破，但你躺了两个月。', effects: { hp: -90, injury: 3, reputation: 20 } },
        },
      },
      {
        label: '带人从水道出城', hint: '一月 · 救人',
        cost: { month: 1 },
        outcome: { text: '你带着两百多口人从水门出去，水到腰，孩子骑在大人肩上。\n\n走到安全的地方，你回头，城的轮廓在雾里，看不见火。', effects: { karma: 60, reputation: 40, attrs: { 道心: 5 }, flag: { 救出围城百姓: true } } },
      },
      { label: '趁乱进城做买卖', hint: '财', outcome: { text: '你用车推着两石米进城，卖了十倍价。\n\n买米的是个抱着孩子的女人，她把镯子摘下来给你，你没要。', effects: { stones: 400, karma: -15, demon: 5 } } },
    ],
  },
  {
    id: 'ev_x_conscription', title: '征丁', pool: 'world', tier: 2, weight: 7, minRealm: 0,
    text: '官道上过着一队新兵，绳子捆成一串，都是十六七岁的少年。\n\n押队的军官骑着马，鞭子搭在鞍上。\n\n一个少年抬头看你，嘴唇动了一下，没出声。你不确定他在说什么。',
    choices: [
      {
        label: '买下他', hint: '花费 200 灵石',
        require: 'stones >= 200', requireHint: '拿不出赎身的钱',
        cost: { stones: 200 },
        outcome: { text: '军官数完灵石，把绳子解开，还笑着说「仙师慈悲」。\n\n少年站在路边，不知道该往哪走。你给他指了个方向，他走了两步，回头给你磕了个头。', effects: { karma: 25, reputation: 10, flag: { 赎过新兵: true } } },
      },
      {
        label: '夜里放走他们', hint: '风险',
        roll: {
          p: 0.5, attrs: { 神识: 0.01, 气运: 0.006 },
          success: { text: '你在子时割了绳子，四十多个少年四散跑进庄稼地。\n\n军官发现后追了半夜，一个人也没抓到。', effects: { karma: 40, reputation: 15, flag: { 放走新兵: true }, demon: -5 } },
          fail: { text: '军营里放了哨。你割到一半，箭就射过来了。你带着三个人跑出去，剩下的人被吊在树上。', effects: { hp: -40, karma: 10, flag: { 通缉: true } } },
        },
      },
      { label: '看着他们走过去', outcome: { text: '队伍走完了。你数了数，一共六十三个人。\n\n那个嘴唇动过的少年走在倒数第二个。你一直没想明白他要说什么。', effects: { karma: -5, attrs: { 道心: 1 } } } },
    ],
  },
  {
    id: 'ev_x_magistrate', title: '县衙', pool: 'world', tier: 2, weight: 6, minRealm: 0,
    text: '县衙门口围了一堆人。堂上在审一桩案子：一个佃户被指控偷了东家的牛。\n\n县官在打瞌睡，师爷在念状纸。\n\n佃户跪在堂下，膝盖下垫着一层碎瓦。',
    choices: [
      {
        label: '上堂替佃户说话', hint: '魅力检定',
        roll: {
          p: 0.5, attrs: { 魅力: 0.012, 悟性: 0.008 },
          success: { text: '你把话讲得很慢，一条一条。堂上的人开始听，县官也醒了。\n\n牛是东家自己卖了，账在当铺里。佃户当场被放了。', effects: { reputation: 25, karma: 25, attrs: { 魅力: 2 }, flag: { 平过冤案: true } } },
          fail: { text: '你说了三句，师爷就打断你：「堂上不得喧哗。」\n\n两个差役把你架出去，佃户当天被判了三十板。', effects: { reputation: -10, karma: 5, hp: -10 } },
        },
      },
      {
        label: '塞钱给师爷', hint: '花费 100 灵石',
        require: 'stones >= 100', requireHint: '拿不出',
        cost: { stones: 100 },
        outcome: { text: '师爷把灵石收进袖子，改了一句状纸上的话。案子变成「牛走失」，打了五板就放了。\n\n佃户出来后一直跟着你，跟了三条街。', effects: { karma: 12, flag: { 识得师爷: true }, demon: 3 } },
      },
      { label: '不掺和', outcome: { text: '你站在门外听完了。板子打下去的声音，和你想象的不一样，很闷。', effects: { karma: -5 } } },
    ],
  },
  {
    id: 'ev_x_sword_duel', title: '决斗', pool: 'world', tier: 3, weight: 5, minRealm: 1,
    text: '城外的荒地上，两个人隔着十步站着，都不说话。\n\n围观的人离得很远。有人在你旁边低声说，这两人是同一门出来的，为一个女子。\n\n左边的那个，手一直在抖。',
    choices: [
      {
        label: '看下去', hint: '',
        outcome: { text: '他们同时出手，只有一声响。\n\n手抖的那个赢了，另一个捂着肚子跪下去。赢的人站着，站了很久，然后把剑扔了。', effects: { attrs: { 悟性: 3 }, exp: 80, demon: 3 } },
      },
      {
        label: '站到他们中间', hint: '道心 · 无礼',
        roll: {
          p: 0.45, attrs: { 道心: 0.012, 魅力: 0.008 },
          success: { text: '你说：为一个不在这里的人死，值不值？\n\n他们都没说话。过了很久，手抖的那个把剑收回鞘里，转身走了。另一个坐在了地上。', effects: { attrs: { 道心: 4, 魅力: 2 }, karma: 20, reputation: 15, flag: { 止过决斗: true } } },
          fail: { text: '他们同时向你出手。你挡住了左边，右边那剑从肋下进去半寸。\n\n他们打完就走了，留你一个人在荒地上按着伤口。', effects: { hp: -55, injury: 2 } },
        },
      },
      {
        label: '捡他们掉的东西', hint: '贪',
        outcome: { text: '他们走后，地上留着半截断剑和一只荷包。荷包里是一枚女子的发簪。\n\n你把发簪埋了，断剑收了。', effects: { items: ['canjian'], karma: -6, attrs: { 悟性: 1 } } },
      },
    ],
  },
  {
    id: 'ev_x_river_pirates', title: '水匪', pool: 'world', tier: 2, weight: 7, minRealm: 0,
    text: '渡船走到江心，岸上忽然撑出四条快船。\n\n船上的人不喊话，直接甩钩，铁钩钉进船帮，绳子一绷，船就横了。\n\n船家把橹一丢，蹲下去，只说了两个字：「完了。」',
    choices: [
      {
        label: '上前', hint: '战斗 · 水匪',
        combat: {
          enemy: 'bandit', displayName: '水匪',
          win: { text: '你砍断两条钩绳，跳上最近的快船。船上的人没料到，被逼得跳了江。\n\n渡船靠岸时，一船人都在看你。', effects: { exp: 120, stones: 100, reputation: 20, karma: 15 } },
          lose: { text: '钩子挂住了你的衣服，把你拖进水里。你在水下被打了两棍，醒来时船已经空了。', effects: { hp: -55, stones: -60, injury: 2 } },
        },
      },
      {
        label: '护住船家', hint: '',
        outcome: { text: '你把船家按在船板上，用身子挡着。匪抢了钱袋和货就走，没伤人。\n\n船家一直发抖，后来把你那件破了的衣服补好了。', effects: { karma: 15, stones: -50, attrs: { 道心: 3 } } },
      },
      { label: '跳江游过去', hint: '根骨', outcome: { text: '你跳进江里，一口气游到对岸，上岸时手还在抖。\n\n回头看，渡船停在江心，四个人正在船上翻东西。', effects: { hp: -20, attrs: { 根骨: 1 }, karma: -8 } } },
    ],
  },
  {
    id: 'ev_x_teahouse_rumor', title: '茶棚', pool: 'world', tier: 1, weight: 9, minRealm: 0,
    text: '官道边的茶棚，四张桌，坐满了赶路的人。\n\n邻桌两个行商在低声说话，说的是北边有个村子，一夜之间人全没了，只剩墙上一个手印。\n\n其中一个抬头看见你在听，声音就停了。',
    choices: [
      {
        label: '请他们喝一碗', hint: '花费 5 灵石',
        require: 'stones >= 5', requireHint: '身上没钱',
        cost: { stones: 5 },
        outcome: { text: '茶钱一付，话就多了。他们说那手印有六根指头，是印在墙里的，不是画上去的。\n\n「那村子现在没人敢去。」走的时候他们又说了一遍。', effects: { exp: 40, attrs: { 神识: 1 }, flag: { 六指手印: true } } },
      },
      {
        label: '追问细节', hint: '悟性',
        roll: {
          p: 0.5, attrs: { 悟性: 0.01, 魅力: 0.006 },
          success: { text: '你问了三句，他们越说越细：村子叫什么，哪一天，谁先发现的。\n\n问完你在桌上用手指蘸茶画了一幅方位图，两个行商都看愣了。', effects: { attrs: { 悟性: 2, 神识: 2 }, exp: 50 } },
          fail: { text: '「不关你的事。」他们把茶碗一推，起身走了。', effects: {} },
        },
      },
      { label: '喝完就走', outcome: { text: '你喝完茶，付了钱。走出茶棚时听见他们在背后说「多管闲事」。\n\n你回头看了一眼，他们已经低头喝茶了。', effects: { hp: 5 } } },
      {
        label: '说：那个村子我去过', hint: '需在山中行走有年',
        require: 'count("山行") >= 2', requireHint: '你还没在山里走够',
        outcome: { text: '你说了山里那些空村子：门都开着，锅还架在灶上，饭摆在桌上没人动过。\n\n茶棚里安静下来。两个行商对看了一眼，其中一个把茶碗推开，低声问：那你还敢不敢再去。', effects: { attrs: { 神识: 2 }, exp: 60, reputation: 5, flag: { 六指手印: true }, counter: { 传话: 1 } } },
      },
    ],
  },
  {
    id: 'ev_x_slave_market', title: '人市', pool: 'world', tier: 2, weight: 5, minRealm: 0,
    text: '人市在城北，一道矮墙就圈住了。\n\n墙内站着几十个人，脖子上挂木牌，牌上写价钱，写得越清楚，站得越直。\n\n最里面那个牌上没写价钱，只有两个字：哑的。',
    choices: [
      {
        label: '买下那个哑的', hint: '花费 300 灵石',
        require: 'stones >= 300', requireHint: '拿不出',
        cost: { stones: 300 },
        outcome: { text: '人牙子收钱时说，这人不干活，也不跑，就是一直看着门外。\n\n你带他出去，他站在街上不动。后来你才知道，他在等的人十年前就死了。', effects: { karma: 20, flag: { 哑仆: true }, relation: { 哑仆: 4 } } },
      },
      {
        label: '把墙推了', hint: '风险',
        roll: {
          p: 0.35, attrs: { 根骨: 0.01, 气运: 0.008 },
          success: { text: '矮墙塌了半边，人四散跑开。人牙子在地上滚，喊人。\n\n你在城外看见那些跑出来的人，有的跑得很远，有的站在原地发愣。', effects: { karma: 35, reputation: 20, flag: { 砸过人市: true }, demon: 5 } },
          fail: { text: '墙还没倒，护院就围上来了。你打倒四个，被第五个从背后砸了后脑。\n\n醒来时你躺在城外，钱袋空了。', effects: { hp: -60, injury: 2, stones: -80 } },
        },
      },
      { label: '什么也不做', outcome: { text: '你走了。走到街口，还听得见里面有人在讲价。\n\n那句「哑的」在你脑子里待了很久。', effects: { attrs: { 道心: 1 }, karma: -8 } } },
    ],
  },
  {
    id: 'ev_x_exam_hall', title: '科场', pool: 'world', tier: 1, weight: 6, minRealm: 0,
    text: '贡院外挤满了人，都是来送考的。\n\n一个穿旧长衫的考生蹲在墙根，手抖得连笔都拿不稳。他考了九年。\n\n旁边的号舍开了，考生一个个进去，进去前都要摸一下门框上的红布。',
    choices: [
      {
        label: '替那考生稳一稳心', hint: '道心',
        outcome: { text: '你把一缕灵力按在他后颈，他的手不抖了。\n\n他进去前回头看你，说了一句：「考完请你喝酒。」三天后发榜，他中了。他没找到你。', effects: { karma: 15, attrs: { 道心: 2 }, exp: 30, flag: { 助考: true } } },
      },
      {
        label: '自己也去考一场', hint: '一月 · 红尘',
        cost: { month: 1 },
        outcome: { text: '你写了一篇关于治水的策论，写完自己都觉得可笑。\n\n放榜时你排在四十七名。你没有去领那份差事。', effects: { attrs: { 悟性: 2 }, reputation: 5, flag: { 中过榜: true } } },
      },
      { label: '看热闹', outcome: { text: '你在贡院外站了一天。散场时，有人笑，有人被扶着出来。\n\n那个考了九年的人，是被人抬出来的。', effects: { attrs: { 悟性: 1 } } } },
    ],
  },
  {
    id: 'ev_x_rebel_banner', title: '义旗', pool: 'world', tier: 4, weight: 4, minRealm: 1,
    text: '山坳里扎着几千人，旗上写着一个「均」字。\n\n他们大多是从东边逃来的农户，刀是农具改的。\n\n头领是个瘦高的中年人，正在给一群人分粮。他看见你，走过来说：「仙师要是肯留下，我们就不怕那些人了。」',
    choices: [
      {
        label: '留下来教他们', hint: '三月',
        cost: { month: 3 },
        outcome: { text: '你教他们看地形、扎营、避箭，教了三个月。\n\n最后一天，头领当着所有人给你鞠了一躬。你知道这支队伍走不远，但你没说。', effects: { contribution: 30, reputation: 40, karma: 30, attrs: { 道心: 3 }, flag: { 义军教头: true } } },
      },
      {
        label: '帮他们打一仗', hint: '战斗 · 官军锐士',
        combat: {
          enemy: 'cultivator', displayName: '官军先锋',
          win: { text: '官军的先锋是个筑基修士，被你打退了三里。\n\n义军第一次赢。头领在你面前跪下，你没拦住。', effects: { exp: 200, reputation: 50, karma: 20, flag: { 义军战功: true }, demon: 5 } },
          lose: { text: '官军的阵法比你见过的都齐。你被围在中间，是靠义军几十个人用命换出来的。\n\n活下来的不到一半。', effects: { hp: -70, injury: 3, karma: 10, demon: 10 } },
        },
      },
      { label: '留下一笔钱就走', hint: '花费 100 灵石',
        require: 'stones >= 100', requireHint: '拿不出',
        cost: { stones: 100 },
        outcome: { text: '头领收了钱，没说话。你走出山坳时，回头看见旗降了一半——是给死人的礼节。\n\n你后来再没听过这支队伍的消息。', effects: { karma: 12, flag: { 资助义军: true } } } },
    ],
  },
  {
    id: 'ev_x_debt_note', title: '债契', pool: 'world', tier: 2, weight: 6, minRealm: 0,
    text: '客栈老板把你叫住，说有人留了东西给你。\n\n是一张债契，上面写着某年某月，借灵石五百，落款是一个你不认识的名字。\n\n背面有一行小字：若还不上，以身抵。',
    choices: [
      {
        label: '去找这个人', hint: '一月',
        cost: { month: 1 },
        outcome: { text: '你找了半个月，在一间破屋里找到他。他已经病得说不出话，床边放着一本账，记的全是他借出去的钱。\n\n他没有欠你，他是把别人的债都转到了自己名下。', effects: { karma: 20, attrs: { 道心: 4 }, exp: 60, flag: { 债契: true } } },
      },
      {
        label: '撕了它', hint: '',
        outcome: { text: '你把债契撕成两半，扔进灶膛。\n\n火苗窜了一下，纸上那个名字烧得最慢。', effects: { karma: 10, attrs: { 道心: 2 }, flag: { 债契: false } } },
      },
      {
        label: '收着，将来有用', hint: '心机',
        outcome: { text: '你把债契折好，收进储物袋最里层。\n\n之后每次缺钱，你都会想起它，但一次也没拿出来过。', effects: { attrs: { 悟性: 1 }, demon: 3, reputation: 2 } },
      },
    ],
  },
  {
    id: 'ev_x_singer', title: '歌女', pool: 'world', tier: 1, weight: 6, minRealm: 0,
    text: '酒楼上有女子唱曲，唱的是北边的调子，词很旧。\n\n唱到一半，有个醉汉把杯子砸上台，骂她唱丧气话。\n\n她停下来，看着那堆碎瓷，然后接着唱，声音一点没变。',
    choices: [
      {
        label: '把醉汉请出去', hint: '动手 · 轻',
        outcome: { text: '你拎着那人的后领把他放到门外，动作很轻。他骂了两句，睡了。\n\n她唱完下台，从袖子里取出一张纸给你，上面是她自己写的词，纸里还裹着一粒伤药。', effects: { attrs: { 魅力: 2, 道心: 1 }, relation: { 歌女: 3 }, items: ['liaoshang_dan'] } },
      },
      {
        label: '听完，给一笔赏', hint: '花费 50 灵石',
        require: 'stones >= 50', requireHint: '拿不出',
        cost: { stones: 50 },
        outcome: { text: '她把赏钱分了一半给楼里的杂役，说他们比她辛苦。\n\n你后来又来过几次，她每次唱的都不一样。', effects: { karma: 10, attrs: { 道心: 2, 魅力: 1 }, relation: { 歌女: 4 } } },
      },
      { label: '喝完酒走', outcome: { text: '你下楼时她还在唱。走到街上，那调子还跟着你。\n\n你想起自己也会唱两句，很多年没唱了。', effects: { demon: -4, attrs: { 道心: 1 } } } },
    ],
  },
  {
    id: 'ev_x_old_soldier', title: '老兵', pool: 'world', tier: 1, weight: 7, minRealm: 0, maxRealm: 3,
    text: '城门口坐着一个老兵，一条腿是木头的，正在补鞋。\n\n他不抬头，也不吆喝。有人把鞋放他面前，他就补，补完收两文。\n\n你走过时，他忽然说：「你走路的声音，是练过的。」',
    choices: [
      {
        label: '坐下来聊', hint: '',
        outcome: { text: '他讲了三十年前那场仗，讲得很平，没有一句抱怨。\n\n「死的都是好兵，」他说，「活着的都是运气好的。」他把补好的鞋递给你，不要钱，又摸出一粒军中带出来的伤药塞给你。', effects: { attrs: { 道心: 2, 悟性: 1 }, exp: 40, items: ['liaoshang_dan'] } },
      },
      {
        label: '问他怎么活下来的', hint: '悟性',
        roll: {
          p: 0.45, attrs: { 悟性: 0.01, 魅力: 0.008 },
          success: { text: '「我装死。」他说，「压在我身上那个，是我的兄弟。我趴了一夜。」\n\n他抬头看你，眼睛很清。「你要是哪天也要装死，记得别出声。」', effects: { attrs: { 悟性: 3, 道心: 2 }, exp: 60, flag: { 装死之课: true } } },
          fail: { text: '他把锥子放下，说：「问这个做什么。」然后低头继续补鞋。', effects: {} },
        },
      },
      { label: '给他留一双新鞋', hint: '花费 20 灵石',
        require: 'stones >= 20', requireHint: '拿不出',
        cost: { stones: 20 },
        outcome: { text: '你把鞋放在他手边。他看了一眼，说：「我只有一只脚。」\n\n然后他把鞋收进箱子里，很仔细。', effects: { karma: 8, attrs: { 道心: 1 } } } },
    ],
  },
  {
    id: 'ev_x_night_watch', title: '夜巡', pool: 'world', tier: 1, weight: 7, minRealm: 0,
    text: '更夫敲着梆子走过长街，走到拐角处忽然停了。\n\n他站了很久，然后退回来，绕了另一条路。\n\n你走到那个拐角看，墙角有一摊水，水里映着一盏不该有的灯。',
    choices: [
      {
        label: '走过去看那盏灯', hint: '战斗 · 街鬼',
        combat: {
          enemy: 'ghost',
          win: { text: '灯在你剑下灭了，水也干了，只剩墙上一道黑影，怎么也擦不掉。\n\n第二天更夫特意绕过来，在你面前敲了三下梆子。', effects: { exp: 90, karma: 15, reputation: 10 } },
          lose: { text: '灯没灭，你的手先僵了。你被按在墙上，闻到自己身上的土味。\n\n天亮时你躺在拐角，路人以为你是个醉汉。', effects: { hp: -40, demon: 10 } },
        },
      },
      {
        label: '叫住更夫问一句', hint: '神识',
        roll: {
          p: 0.5, attrs: { 神识: 0.01 },
          success: { text: '更夫说这拐角三个月里淹死过两个人，一个是醉汉，一个是找醉汉的媳妇。\n\n他从怀里摸出一张黄纸：「你若要管，这个给你。」', effects: { items: ['huxin_fu'], attrs: { 神识: 2 }, flag: { 拐角旧事: true } } },
          fail: { text: '更夫没理你，走得更快了。你回头，那盏灯还在水里，晃了一下。', effects: { demon: 4 } },
        },
      },
      { label: '跟着更夫走完这一夜', outcome: { text: '你陪他走完了城里十三条街。\n\n天亮时他说：「这条街的活人，我都认得。」你忽然觉得这话很重。', effects: { karma: 8, attrs: { 道心: 2 } } } },
    ],
  },
  {
    id: 'ev_x_temple_fair', title: '庙会', pool: 'world', tier: 1, weight: 8, minRealm: 0,
    text: '庙会占了半座城，卖糖的、耍猴的、算命的，挤在一处。\n\n一个算命先生拉着你的袖子不放，说：「这位有仙气。」\n\n他面前摆着一张图，图上画的是你的脸，画得不太像。',
    choices: [
      {
        label: '让他算一卦', hint: '花费 3 灵石',
        require: 'stones >= 3', requireHint: '连三枚都没有',
        cost: { stones: 3 },
        outcome: { text: '他掐着指头算了半天，说：「你这命，掉过一回，还掉过两回。」\n\n你问哪两回。他说：「你自己都不记得，我怎么说。」', effects: { attrs: { 悟性: 2 }, flag: { 算命: true }, demon: 2 } },
      },
      {
        label: '问他图哪来的', hint: '神识',
        roll: {
          p: 0.4, attrs: { 神识: 0.012 },
          success: { text: '他说是三天前一个和你长得一样的人来画的，付了一块银子。\n\n你把图收下，画上那人的眼角比你多一颗痣。', effects: { attrs: { 神识: 3 }, flag: { 画像之人: true }, demon: 5 } },
          fail: { text: '「随手画的。」他笑，把图收了回去，怎么也不肯再拿出来。', effects: {} },
        },
      },
      { label: '买一串糖给耍猴的', hint: '', outcome: { text: '猴子接过糖，朝你作了个揖，作得很像人。\n\n周围的人笑，你也笑。那一刻你觉得这些比修行实在。', effects: { karma: 5, demon: -6, attrs: { 道心: 1 } } } },
    ],
  },
  {
    id: 'ev_x_prisoner_escort', title: '押解', pool: 'world', tier: 2, weight: 5, minRealm: 0,
    text: '两个差役押着一个囚犯走在官道上，囚犯戴着三十斤的木枷。\n\n走到树荫下，差役坐下歇脚，把枷锁的钥匙挂在腰上。\n\n囚犯抬头看你，看了很久。他的嘴唇干裂，什么也没说。',
    choices: [
      {
        label: '给他一壶水', hint: '',
        outcome: { text: '你把水壶递过去，他喝得很慢。差役看了一眼，没说话。\n\n喝完他说了一句：「城西姓周的，欠我一命。」你没听懂，他已经低下头了。', effects: { karma: 8, attrs: { 道心: 2 }, flag: { 囚犯之言: true } } },
      },
      {
        label: '问差役他犯了什么事', hint: '神识',
        roll: {
          p: 0.5, attrs: { 悟性: 0.01, 魅力: 0.006 },
          success: { text: '差役说他是替人顶罪的，原主给了他家二十两银子。\n\n你再看那囚犯，他闭着眼，像睡着了。', effects: { attrs: { 悟性: 2, 神识: 1 }, karma: 5, flag: { 顶罪: true } } },
          fail: { text: '「不该问的别问。」差役把手按在刀上，你退了一步。', effects: {} },
        },
      },
      {
        label: '夜里劫了他', hint: '违法 · 风险',
        roll: {
          p: 0.35, attrs: { 根骨: 0.008, 气运: 0.01 },
          success: { text: '你打晕两个差役，砸了木枷。他跑了，跑之前回头说：城西姓周的。\n\n三天后你听说，那户姓周的人家一夜之间全死了。', effects: { karma: -15, demon: 8, flag: { 放走囚犯: true }, exp: 60 } },
          fail: { text: '差役没睡着，刀先出鞘。你打伤一个，另一个吹了哨子。你被追了十里。', effects: { hp: -35, reputation: -15, flag: { 通缉: true } } },
        },
      },
    ],
  },
  {
    id: 'ev_x_black_market', title: '黑市', pool: 'world', tier: 3, weight: 6, minRealm: 1,
    text: '黑市在一间米铺的后面，进门要对掌柜说一句「买糙米」。\n\n里面灯很暗，摊上摆的东西都不干净：带血的储物袋、刻着别人名字的玉牌、还有几枚封着符的丹。\n\n有人在你身后低声问：「要货吗？」',
    choices: [
      {
        label: '买那枚封符的丹', hint: '花费 300 灵石',
        require: 'stones >= 300', requireHint: '拿不出',
        cost: { stones: 300 },
        roll: {
          p: 0.5, attrs: { 气运: 0.012 },
          success: { text: '回去拆了符，丹上有九道纹。这是九转丹，来路不明，但确实是好东西。', effects: { items: ['jiuzhuan_dan'], exp: 50, flag: { 黑市买丹: true } } },
          fail: { text: '拆开符，丹已经空了，里面是一粒沙。你回头去找，米铺换了招牌。', effects: { demon: 5 } },
        },
      },
      {
        label: '问他要不要买家', hint: '江湖',
        outcome: { text: '他给你引了一个人，蒙着脸。那人要买一样东西：一个筑基修士的命。\n\n你没有答应，也没有拒绝。你把价问了，对方先塞给你一百灵石当定钱。', effects: { stones: 100, karma: -10, flag: { 有人买命: true } } },
      },
      { label: '什么也不买，记住这个地方', outcome: { text: '你走了一圈，把每个人的脸都记了。\n\n出门时掌柜的说：「仙师下次来，还是买糙米？」你说买。', effects: { attrs: { 神识: 2 }, flag: { 知黑市: true } } } },
    ],
  },
  {
    id: 'ev_x_general_tent', title: '军帐', pool: 'world', tier: 3, weight: 5, minRealm: 1,
    text: '中军帐里挂着一幅地图，图上插了十几面小旗。\n\n将军站在图前，四十来岁，甲没卸。他回头看你：「他们说你能隔空取物。」\n\n「能。」\n「那你能不能取对面主帅的头？」',
    choices: [
      {
        label: '答应下来', hint: '凶险 · 大功',
        combat: {
          enemy: 'cultivator', displayName: '敌营护卫',
          win: { text: '你夜里进了敌营，出来时衣服上有血。第二天敌军退了三十里。\n\n将军没有赏你，只是把自己年轻时用的一张弓给了你。', effects: { exp: 220, reputation: 60, contribution: 20, items: ['liegong'], karma: -15, flag: { 军中功: true } } },
          lose: { text: '帐里等着你的是三个修士。你被围在中间，靠一件护身符才脱身，那符碎了。', effects: { hp: -75, injury: 3, reputation: -20 } },
        },
      },
      {
        label: '说：我不杀人，但我能让他们看不见', hint: '谋',
        cost: { month: 1 },
        outcome: { text: '你布了一个月的雾阵，把整条河谷罩住。敌军摸不清虚实，退了。\n\n将军在帐里看了很久的图，最后说：「这比杀人难。」', effects: { exp: 150, reputation: 45, attrs: { 神识: 3, 悟性: 2 }, flag: { 布雾退敌: true } } },
      },
      { label: '拒绝', outcome: { text: '「我是个修士，不是刀。」你说。\n\n他看了你一会儿，笑了：「修士也是刀，只是贵一点。」然后他让人送你出去。', effects: { attrs: { 道心: 3 }, reputation: 5 } } },
    ],
  },
  {
    id: 'ev_x_dynasty_fall', title: '亡国', pool: 'world', tier: 5, weight: 2, minRealm: 3,
    once: true,
    text: '京城破了。城门口的火烧了三天，宫里的钟一直没人敲。\n\n你走在街上，看见有人抱着牌位跑，有人在拆宫门的铜钉。\n\n一个穿龙袍的老人坐在台阶上，脚边放着一只空碗。',
    choices: [
      {
        label: '在他旁边坐下', hint: '一月',
        cost: { month: 1 },
        outcome: {
          text: '他跟你说了很多话，从他登基那天说起，说到最后一个大臣跑掉。\n\n「我以为天下是我的，」他说，「后来才知道，是天下借我用了几年。」他把空碗推给你，碗底压着一枚丹药，说是太医院最后一炉。',
          effects: { attrs: { 道心: 6, 悟性: 3 }, expPct: 0.35, items: ['jiuzhuan_dan'], flag: { 见过亡国之君: true } },
        },
      },
      {
        label: '护他出城', hint: '风险 · 因果',
        roll: {
          p: 0.45, attrs: { 根骨: 0.01, 道心: 0.008 },
          success: { text: '你背着他走了三十里，路上遇到两拨乱兵，都被你打发了。\n\n他在一个农户家里住下，第二年开始教村里的孩子读书。你走时，他送你到门口，行了君臣礼。', effects: { karma: 30, reputation: 40, attrs: { 道心: 5 }, flag: { 救过故君: true } } },
          fail: { text: '乱兵太多。你护着他冲出去，他被流矢射中了背。\n\n他死在你背上，很轻。你把他埋在了路边。', effects: { hp: -60, karma: 15, demon: 12, attrs: { 道心: 3 } } },
        },
      },
      { label: '去宫里看看', hint: '财 · 因果', outcome: { text: '库房早被抢空了，你在地砖缝里摸出几只压扁的金饼，是有人藏下没带走的。\n\n墙上留着一幅画，画的是这一城的人。你看了很久，走的时候没有动它。', effects: { stones: 300, karma: -10, attrs: { 悟性: 3 }, flag: { 入过宫: true } } } },
    ],
  },
  {
    id: 'ev_x_red_dust', title: '红尘', pool: 'world', tier: 3, weight: 4, minRealm: 1,
    text: '你在一座小城住了半月，房东的女儿每天傍晚给你送一碗汤，汤不重样。\n\n第十天她站在门口问：「你哪天走？」\n\n你说不定。她低头想了一会儿，说：「那我每天多煮一点。」',
    choices: [
      {
        label: '留下来，过一年', hint: '十二月 · 红尘',
        cost: { month: 12 },
        outcome: {
          text: '你在城里住了一年，开了间小药铺。街坊都叫你先生。\n\n走的那天，她抱着孩子在门口送你，眼睛红的，还是笑着说：「路上小心。」\n\n你走出城门，才想起自己已经很多年没哭过。',
          effects: { attrs: { 道心: 6, 悟性: 2 }, demon: -25, lifespan: 3, flag: { 红尘一年: true }, relation: { 城中人: 5 }, title: '俗世客' },
        },
      },
      {
        label: '第二天就走', hint: '决断',
        outcome: { text: '你天没亮就走了，桌上留了一锭银子。\n\n走出城时你回头看了一眼，那户人家的灯亮着，一晚上没灭。', effects: { attrs: { 道心: 3 }, demon: 8, flag: { 未告别: true } } },
      },
      {
        label: '教她一门养生的法子', hint: '',
        outcome: { text: '你留下一张方子，教她怎么熬，火候讲到第三遍她才记住。\n\n你走的时候，那张方子已经贴在了灶边的墙上，用米汤粘的，很平。', effects: { karma: 15, attrs: { 道心: 4 }, exp: 60, flag: { 留方: true } } },
      },
    ],
  },
  {
    id: 'ev_x_dry_well_deep', title: '井底人家', pool: 'branch', tier: 2, weight: 0, minRealm: 0,
    text: '四副碗筷，四把椅子，只有你站着。\n\n饭是热的，菜里没有肉。你摸了一下碗沿，还是温的。\n\n里屋的门帘动了一下，帘子后面有人在里面坐着，不出声，但你确定它在等你说点什么。',
    choices: [
      {
        label: '坐下吃饭', hint: '吃不明的东西',
        roll: {
          p: 0.5, attrs: { 道心: 0.01, 气运: 0.006 },
          success: { text: '饭咽下去很暖，暖到胃里就散了。你吃了三碗，抬头时四把椅子都空了。\n\n屋子开始透光，墙变薄，你从井口爬上去时，手里握着一枚温热的丹丸。', effects: { expPct: 0.2, attrs: { 根骨: 2 }, items: ['huiling_dan'], karma: 5 } },
          fail: { text: '第一口饭在嘴里变成了土。你吐出来，土又变成了饭。\n\n你退出屋门，井壁上全是手印，都是向下爬的。', effects: { hp: -35, demon: 10 } },
        },
      },
      {
        label: '掀开里屋的门帘', hint: '神识 · 未知',
        roll: {
          p: 0.45, attrs: { 神识: 0.012 },
          success: { text: '里屋坐着一家四口，都不动，像纸扎的。桌上放着他们的名字牌。\n\n你把名字牌一个个放平，屋子里的灯亮了一盏。', effects: { attrs: { 神识: 3, 道心: 3 }, exp: 70, karma: 12, flag: { 井底名字: true } } },
          fail: { text: '帘子后面是空的，只有一面墙。墙上用指甲刻着：又来了一个。\n\n你退出去时，帘子自己放下了。', effects: { demon: 8, hp: -15 } },
        },
      },
      { label: '把碗筷收起来', outcome: { text: '你把四副碗筷摞好，端到灶边，像做完一件家务。\n\n再回头，堂屋的门开了，外面是一条向上的石阶。', effects: { karma: 8, attrs: { 道心: 2 }, exp: 40 } } },
    ],
  },
  {
    id: 'ev_x_stone_circle_inner', title: '阵中', pool: 'branch', tier: 3, weight: 0, minRealm: 1,
    text: '雾里是一座院子，院墙很高，门开着。\n\n院里种着菜，菜是新的。屋檐下挂着两串干辣椒，颜色还很红。\n\n正屋的门半开，屋里有个人在写字，背对着你，笔尖划过纸的声音很清楚。',
    choices: [
      {
        label: '进去看他在写什么', hint: '神识 ≥ 20',
        require: 'char.attrs.神识 >= 20', requireHint: '你不敢靠得太近',
        outcome: { text: '他写的是一个人的一生，从出生写到今天，最后一句是：他站在门口，不敢进来。\n\n你低头看纸，纸上没有你的名字。你抬头，屋里空了，笔还在动。', effects: { attrs: { 悟性: 4, 神识: 2 }, expPct: 0.2, demon: 5, flag: { 阵中院: true } } },
      },
      {
        label: '吃一个院子里的菜', hint: '怪',
        roll: {
          p: 0.55, attrs: { 气运: 0.012 },
          success: { text: '萝卜是甜的，甜得不像话。你吃了两个，肚子暖了很久。\n\n走出院子时，你已经站在阵外，十三块石头重新排好，一块也没有多。', effects: { hp: 40, attrs: { 根骨: 2 }, exp: 60 } },
          fail: { text: '咬下去是土的味道，还有一点铁锈味。你吐出来，看见土里混着一颗牙。', effects: { hp: -25, demon: 6 } },
        },
      },
      { label: '退出去', outcome: { text: '你退回雾里，走了很多步，听见身后的笔停了。\n\n再走，脚踩到实地，十三块石头在你身后，一块也不动。', effects: { attrs: { 道心: 2 }, exp: 40 } } },
    ],
  },
  {
    id: 'ev_x_altar_inner', title: '坛下', pool: 'branch', tier: 4, weight: 0, minRealm: 2,
    text: '石坛下沉了三级，露出一个圆形的空间，四壁都是黑的，只有正中一片白。\n\n白的地方坐着一具枯骨，骨头摆的是打坐的姿势，膝上放着一只空的剑鞘。\n\n剑鞘上没有剑，但你伸手时，手被什么挡住了。',
    choices: [
      {
        label: '对着剑鞘行礼', hint: '道心检定',
        roll: {
          p: 0.5, attrs: { 道心: 0.012, 悟性: 0.006 },
          success: { text: '你行了三次礼。第三次直起身时，剑鞘里传出一声很轻的鸣响。\n\n你伸手，手没有被挡。鞘里是空的，但你的手心被划了一道口子，伤口很直，像剑锋切的。', effects: { attrs: { 道心: 4, 根骨: 3 }, expPct: 0.25, techniques: [{ id: 'kongqiao_jian', name: '《空鞘剑意》', speed: 0.09 }] } },
          fail: { text: '你行礼，剑鞘没有反应。你伸手去拿，被那层看不见的东西推回来，退了三级台阶。\n\n它还是空的，但它不肯。', effects: { hp: -25, attrs: { 道心: 2 }, demon: 4 } },
        },
      },
      {
        label: '把枯骨搬开', hint: '贪 · 有代价',
        outcome: { text: '骨头一碰就散。你从骨灰里扒出一枚灰扑扑的丹丸，握在手里发烫。\n\n你退出坛时，坛上的青铜鼎裂了一道缝。', effects: { items: ['xisui_dan'], karma: -12, demon: 8 } },
      },
      { label: '原路退出去', outcome: { text: '你一级一级退上台阶，退到坛顶时鞠了一躬。\n\n身后没有动静。你走下台地时，天才刚亮。', effects: { attrs: { 道心: 2 }, exp: 50 } } },
    ],
  },
  {
    id: 'ev_x_hanging_dream', title: '画中', pool: 'branch', tier: 4, weight: 0, minRealm: 2,
    text: '画上的崖壁和眼前的崖壁一模一样，连棺材的位置都对得上。\n\n只有一处不同：画里的崖下站着一个人，背对着，穿的衣服和你一样。\n\n你抬头，崖下没有人。',
    choices: [
      {
        label: '把画烧了', hint: '断因果',
        cost: { month: 1 },
        outcome: { text: '画烧得很快，最后剩下一角，上面是那个背影的脚。\n\n你把它踩进土里，回头时，崖上那口棺材的盖开了，里面是空的。', effects: { demon: -15, attrs: { 道心: 4 }, expPct: 0.2, flag: { 烧画: true } } },
      },
      {
        label: '在画上添一笔', hint: '悟性',
        roll: {
          p: 0.45, attrs: { 悟性: 0.012, 气运: 0.008 },
          success: { text: '你在那个背影的旁边加了一个人，站在一起。\n\n画纸忽然发烫，你松手，它自己卷起来，落进江里。江面上浮起一层白雾，很快散了。', effects: { attrs: { 悟性: 4, 道心: 3 }, expPct: 0.3, lifespan: 8, flag: { 改画: true } } },
          fail: { text: '笔尖一落下，纸就把墨吃了，然后开始吃笔。你扔掉笔，指尖已经黑了一块，洗不掉。', effects: { hp: -30, demon: 12 } },
        },
      },
      { label: '把画收进储物袋', outcome: { text: '你把画卷起来收好。它很轻，像什么都没装。\n\n之后每隔几个月，你会在夜里听见纸被展开的声音。', effects: { attrs: { 神识: 2 }, demon: 8, flag: { 藏画: true } } } },
    ],
  },
  {
    id: 'ev_x_seal_broken', title: '缝里', pool: 'branch', tier: 5, weight: 0, minRealm: 3,
    text: '缝只有一个指头宽，里面很黑，黑得不像洞，像一块布。\n\n你贴近去看，黑里也有一双眼睛贴近来看，隔着一层什么。\n\n它开口，声音像从很深的水底浮上来：「符，是你揭的？」',
    choices: [
      {
        label: '说是', hint: '硬碰',
        combat: {
          enemy: 'demon_general', displayName: '封石里的东西',
          win: { text: '它从缝里挤出来的只是一部分，你砍了三次才砍断。\n\n缝合上了。你的手在抖，但你没有退。', effects: { expPct: 0.6, attrs: { 根骨: 5, 道心: 4 }, karma: 25, title: '补缝人', flag: { 补过封印: true } } },
          lose: { text: '它的一只手按在你胸口，你听见三根肋骨同时断掉的声音。\n\n你被扔下山，落在雪里，雪被血染红了一小片。', effects: { hp: -100, injury: 3, demon: 20 } },
        },
      },
      {
        label: '说：不是我', hint: '谎',
        roll: {
          p: 0.4, attrs: { 道心: 0.012, 悟性: 0.008 },
          success: { text: '它看了你很久，说：「那你帮我揭。」\n\n你说好。你伸手，把最后那枚铜钉按回去，按进了石头里。它在里面叫了一声，缝合上了。', effects: { karma: 30, attrs: { 道心: 5 }, expPct: 0.35, flag: { 封住缝: true } } },
          fail: { text: '「说谎的人，」它说，「身上会有味道。」\n\n你退了三步，胸口已经被划开一道，不深，但一直在流血。', effects: { hp: -60, injury: 2, demon: 15 } },
        },
      },
      { label: '什么也不说，退走', outcome: { text: '你退着走，一直退到山道上。\n\n回头看，山体上那道缝还在，像一只没有闭上的眼睛。', effects: { demon: 10, attrs: { 道心: 2 } } } },
    ],
  },
  {
    id: 'ev_x_stone_gate_inner', title: '阶下', pool: 'branch', tier: 3, weight: 0, minRealm: 1,
    text: '台阶一共九十九级，每一级的中间都磨出一个浅坑，是很多人踩出来的。\n\n底下是一间空殿，殿中央立着一面镜子，镜面朝下扣着。\n\n殿角有个人蹲着，抱着膝盖，听见你的脚步就抬起头。他和你长得有七分像。',
    choices: [
      {
        label: '问他是谁', hint: '神识',
        roll: {
          p: 0.5, attrs: { 神识: 0.012, 道心: 0.006 },
          success: { text: '「我是上一个进来的。」他说，「我在这儿等了很久，等到忘了自己在等什么。」\n\n他指了指镜子：「别看。看了就走不了了。」然后他闭上眼，化成灰。', effects: { attrs: { 神识: 3, 道心: 4 }, expPct: 0.2, flag: { 阶下人: true } } },
          fail: { text: '他不说话，只是笑，笑到你背后发凉。你再看他时，殿角是空的。', effects: { demon: 10 } },
        },
      },
      {
        label: '把镜子翻过来', hint: '危险',
        roll: {
          p: 0.4, attrs: { 气运: 0.012, 道心: 0.008 },
          success: { text: '镜面翻上来，里面是这座殿，殿里没有人。\n\n你在镜子里站了很久，才发现自己为什么看不见自己——你站在镜子的这一面。你把镜子砸了，镜框里露出半截断剑，很锋利。', effects: { items: ['canjian'], attrs: { 神识: 4 }, expPct: 0.25, demon: 5 } },
          fail: { text: '镜子里有个人，正在翻镜子。他的手伸出来，抓住了你的手腕，指甲掐进肉里。\n\n你挣开了镜子，手腕上留了五个洞。', effects: { hp: -50, injury: 2, demon: 15 } },
        },
      },
      { label: '沿台阶走回去', outcome: { text: '你一级一级往上走，走到第九十九级，门还开着。\n\n走出去时你在想，那些浅坑，是上来的人踩的，还是下去的。', effects: { attrs: { 悟性: 2 }, exp: 60 } } },
    ],
  },
  {
    id: 'ev_x_heart_lake_shore', title: '水里', pool: 'branch', tier: 4, weight: 0, minRealm: 2,
    text: '它没有用力，只是不放。水很凉，凉意顺着你的手腕往上爬，爬得很慢。\n\n「你坐下来，」它说，「换我上去。你在这里歇着，我替你走完。」\n\n它的脸贴在水面下，看得很诚恳。',
    choices: [
      {
        label: '收回手', hint: '道心检定',
        roll: {
          p: 0.5, attrs: { 道心: 0.014 },
          success: { text: '你一寸一寸把手抽回来。它没有拦，只是看着。\n\n「你还会回来的。」它说。你说：会，但不是今天。水里的自己笑了一下，散了。', effects: { attrs: { 道心: 7 }, demon: -20, expPct: 0.3, flag: { 拒过心魔: true } } },
          fail: { text: '水没过你的手腕，然后是手肘。你跪在岸边，用另一只手撑着地，撑到指节发白。\n\n抽回来的时候，手腕上有一圈青色的印子。', effects: { hp: -40, demon: 20 } },
        },
      },
      {
        label: '把它拉出来', hint: '反其道',
        roll: {
          p: 0.35, attrs: { 根骨: 0.012, 道心: 0.008 },
          success: { text: '你反手一拽，把它从水里拖了上来。它在地上，像一件湿衣服，慢慢干瘪下去。\n\n湖底的层层人形，跟着一起塌了。', effects: { expPct: 0.4, attrs: { 道心: 5, 根骨: 2 }, demon: -15, karma: 10 } },
          fail: { text: '你一拽，它顺势把你拉进水里。水很浅，但你沉不下去，也浮不上来。\n\n你在那口气快用完的时候，才被自己吐的泡推上来。', effects: { hp: -55, demon: 18 } },
        },
      },
      { label: '坐在岸边，等它放手', hint: '一月', cost: { month: 1 }, outcome: { text: '你坐了一个月，不吃不喝，只看着水里那只手。\n\n第三十天，它先松开了。', effects: { attrs: { 道心: 4 }, exp: 90, demon: -8 } } },
    ],
  },
  {
    id: 'ev_x_wolf_cub_den', title: '养狼', pool: 'branch', tier: 1, weight: 0, minRealm: 0,
    text: '它长得很快。三个月就有半人高，一年后能拖倒一头小鹿。\n\n它从不叫，只在你打坐时趴在门口，一动不动。\n\n那天你从外面回来，看见它嘴里叼着一样东西，放在你脚边。是一只人的手。',
    choices: [
      {
        label: '打它一顿', hint: '',
        outcome: { text: '你打了它三下，它没躲，也没叫。\n\n之后它再没往你脚边放过东西，但夜里会出去，天快亮才回来，嘴边总是湿的。', effects: { attrs: { 道心: 1 }, demon: 5, relation: { 狼崽: -3 }, flag: { 狼已噬人: true } } },
      },
      {
        label: '把它放回山里', hint: '狠心 · 道心检定',
        roll: {
          p: 0.5, attrs: { 道心: 0.012 },
          success: { text: '你带它走了很远，走到你也没来过的地方，然后转身走。\n\n它跟了你三里。你回头吼了一声，它停下，坐在原地，看着你走远。', effects: { karma: 10, attrs: { 道心: 4 }, demon: -8, flag: { 放狼归山: true }, relation: { 狼崽: 2 } } },
          fail: { text: '你走了五里，回头，它还在三十步外，不急不慢地跟着。\n\n你又走了十里，它还在。你没有再赶它。', effects: { attrs: { 道心: 2 }, demon: 4, relation: { 狼崽: 3 }, flag: { 狼已噬人: true } } },
        },
      },
      {
        label: '替它把手埋了', hint: '',
        outcome: { text: '你在后山挖了个坑，把手埋了，压了三块石头。\n\n它蹲在旁边看，看完把头搁在你腿上。你摸着它的毛，忽然不知道自己在养什么。', effects: { karma: 5, demon: 6, attrs: { 道心: 2 }, relation: { 狼崽: 4 }, flag: { 狼已噬人: true } } },
      },
    ],
  },
];
