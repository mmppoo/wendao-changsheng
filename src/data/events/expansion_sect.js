/**
 * 宗门扩写事件：十三宗门各自的规矩与气味（pool: 'sect'）、闭关内景（pool: 'inner'）。
 * 结构参考 ink 的 knot / choice / divert：多段剧情用 pool: 'branch'、weight: 0 的节点承接。
 */
export const SECT_EXPANSION = [
  /* ───────────── 太玄剑宗 ───────────── */
  {
    id: 'ev_s_taixuan_sword_tomb', title: '剑冢', pool: 'sect', tier: 1, weight: 8, minRealm: 0,
    require: 'flag("入宗:taixuan") && char.sectId === "taixuan"',
    text: '剑冢在问剑峰背面，一万三千柄断剑插在土里，像一片倒着长的林。\n\n你的差事是用粗麻布擦去剑身上的锈，一天三十柄。擦到第十九柄时，剑忽然震了一下，割开你的虎口。',
    choices: [
      {
        label: '握紧它，血别浪费', hint: '剑择人 · 检定',
        roll: {
          p: 0.4, attrs: { 根骨: 0.012, 气运: 0.008 },
          success: {
            text: '血渗进剑脊，锈像被人揭开。剑身上浮出两个字：无锋。你听见背后有人轻轻「嗯」了一声，回头没有人。',
            effects: { items: ['wujian_jue'], counter: { sword_rust: 1 }, attrs: { 根骨: 2 }, contribution: 60, flag: { 剑冢择剑: true } },
          },
          fail: { text: '剑吸了你半碗血，然后从中间断了。执事罚你赔三块玄铁，说剑是宗门的，血是你自己的。', effects: { hp: -30, stones: -90, contribution: -40 } },
        },
      },
      {
        label: '按差事办，锈擦完就走',
        outcome: { text: '你把血在裤子上蹭掉，接着擦。天黑前擦完三十柄，一柄不多。执事在本子上画了个勾，没抬头。', effects: { contribution: 40, attrs: { 道心: 1 } } },
      },
      {
        label: '偷看剑铭，抄下来', hint: '门规：私抄剑铭者，笞二十',
        roll: {
          p: 0.5, attrs: { 悟性: 0.01 },
          success: { text: '你抄了七页，藏在枕下。夜里读，发现每柄剑的铭文末尾都在骂同一个人——太玄祖师。骂得很文雅，也很脏。', effects: { exp: 80, attrs: { 悟性: 2 }, demon: 2, flag: { 抄剑铭: true } } },
          fail: { text: '执事的手按在你肩上。「抄什么？」你答不出。二十鞭，抄本烧了，灰倒进剑冢。', effects: { hp: -40, injury: 1, reputation: -10, contribution: -60 } },
        },
      },
    ],
  },
  {
    id: 'ev_s_taixuan_ask_sword', title: '你的剑为谁而拔', pool: 'sect', tier: 2, weight: 7, minRealm: 1,
    require: 'flag("入宗:taixuan") && char.sectId === "taixuan" && char.sectRank >= 1',
    text: '内门授剑礼。长老坐在上首，问的还是入门那一句：你的剑，为谁而拔？\n\n前头三个人答了「为宗门」「为苍生」「为道」，长老都没抬头。轮到你时，堂里很静，只有檐水滴在石阶上。',
    choices: [
      {
        label: '为我自己',
        outcome: { text: '长老抬起眼。「宗门里说这话的，都活不长。」他把一柄剑推过来，「拿着。至少你是真话。」', effects: { items: ['qingfeng_jian'], attrs: { 道心: 3 }, reputation: -10, contribution: 80, flag: { 授剑: true } } },
      },
      {
        label: '为死人',
        outcome: { text: '你说为那些没能走下剑冢的人。长老沉默很久，说：「那你得先记住他们的名字。记不住的，不算。」', effects: { attrs: { 道心: 5, 神识: 2 }, demon: 4 } },
      },
      {
        label: '反问：长老的剑为谁拔', hint: '道心检定',
        roll: {
          p: 0.4, attrs: { 道心: 0.01, 魅力: 0.008 },
          success: { text: '他愣住，然后笑出声——那种很久没笑过的人的笑。「为了一句对不起。」他没说对谁。', effects: { attrs: { 悟性: 3 }, contribution: 120, relation: { 太玄长老: 20 }, flag: { 长老旧事: true } } },
          fail: { text: '「礼上无问。」威压落下来，你单膝跪进檐水里，跪到礼散。没人扶你。', effects: { hp: -25, reputation: -15 } },
        },
      },
    ],
  },
  {
    id: 'ev_s_taixuan_borrow_sword', title: '借剑', pool: 'sect', tier: 2, weight: 6, minRealm: 0,
    require: 'flag("入宗:taixuan") && char.sectId === "taixuan"',
    text: '师兄来借剑。他自己那柄断了，明日要下山办差，宗门不补。\n\n「就一晚。」他说，手在你剑鞘上没松开。你见过他上一柄剑是怎么断的——替一个外门弟子挡了三刀。',
    choices: [
      {
        label: '借',
        outcome: { text: '第二天剑还回来，剑脊多了一道补痕，磨得很平。他在你门口放了一壶酒，酒是冷的，壶身上有霜。', effects: { relation: { 借剑师兄: 35 }, attrs: { 道心: 2 }, contribution: 20 } },
      },
      {
        label: '不借，说自己也明日办事',
        outcome: { text: '他松开手，说了句「知道了」。第二天下山，他没回来。剑冢里多了一柄新剑，锈得比谁都快。', effects: { demon: 8, attrs: { 道心: -2 }, karma: -5 } },
      },
      {
        label: '借，但要他带你一起下山', hint: '战斗 · 劫道散修',
        combat: {
          enemy: 'bandit',
          win: { text: '三十里官道，血是热的。他把你按在身后，你替他补了后半程。回来的路上，他把酒壶递给你，说：「下次还借。」', effects: { contribution: 150, stones: 80, exp: 120, relation: { 借剑师兄: 25 }, attrs: { 根骨: 2 } } },
          lose: { text: '你们被围住，他背着你跑了十里。剑丢在山道上，你躺了半个月。', effects: { hp: -45, injury: 2, contribution: 20 } },
        },
      },
    ],
  },

  /* ───────────── 青云门 ───────────── */
  {
    id: 'ev_s_qingyun_rule_two', title: '第二条', pool: 'sect', tier: 1, weight: 8, minRealm: 0,
    require: 'flag("入宗:qingyun") && char.sectId === "qingyun"',
    text: '青云门门规三百条，刻在通天峰石壁上。新入门的差事是抄规，抄错一字，重来。\n\n抄到第二条时你停了：不可负友。石壁上这一条被人摸得发亮，字口比别处深，像被指甲抠过。',
    choices: [
      {
        label: '接着抄，抄完',
        outcome: { text: '你抄到第三百条，天亮。指节僵得弯不回来。执事收走纸，说：「抄过的人，日后都记得第二条。」', effects: { contribution: 50, attrs: { 道心: 2 } } },
      },
      {
        label: '在第二条下面添一行小字', hint: '私改门规',
        roll: {
          p: 0.5, attrs: { 道心: 0.008, 悟性: 0.008 },
          success: { text: '你写了「若友先负我呢」。三个月后，石壁上多了一行批注：「那就当他死了。」笔迹很老。', effects: { attrs: { 悟性: 3, 道心: 1 }, exp: 60, flag: { 石壁问答: true }, demon: 2 } },
          fail: { text: '墨被雨冲开，糊了一片。执事说你污了石壁，罚扫峰道半年。扫的时候你天天看见那一片污。', effects: { contribution: -80, attrs: { 道心: 2 } } },
        },
      },
      {
        label: '问执事：这一条有人犯过吗',
        outcome: { text: '他的手停了停。「上一个犯的，现在在后山挑水。挑了一百年。」他顿了顿，「你见着他，别叫师兄。」', effects: { attrs: { 道心: 3 }, flag: { 后山挑水人: true } } },
      },
    ],
  },
  {
    id: 'ev_s_qingyun_cloud_sea', title: '通天峰的云', pool: 'sect', tier: 2, weight: 6, minRealm: 1,
    require: 'flag("入宗:qingyun") && char.sectId === "qingyun" && char.sectRank >= 1',
    text: '通天峰顶终年压在云里。今日云开了一线，能看见山下三百里。\n\n同门都在看，有人指着一处说那是他家。你顺着看过去，只看见一片灰。值守的钟快响了。',
    choices: [
      {
        label: '多站一会儿，把那片灰看完',
        outcome: { text: '钟响了你才走，迟到，罚俸三月。可你在那片灰里认出一条河——小时候你差点淹死在里面。', effects: { stones: -60, attrs: { 悟性: 2, 道心: 2 }, demon: -3 } },
      },
      {
        label: '立刻回去值守',
        outcome: { text: '你走得干脆。回到岗位上时，云已经合上。此后再没人见过那样的天。', effects: { contribution: 80, attrs: { 道心: 1 } } },
      },
      {
        label: '问同门：那真是你家', hint: '魅力',
        roll: {
          p: 0.55, attrs: { 魅力: 0.01 },
          success: { text: '他沉默一下：「不是。我只是想有个地方能指。」那天你们在云边一直站到日落。', effects: { relation: { 守峰同门: 25 }, attrs: { 道心: 3 }, demon: -4 } },
          fail: { text: '「关你什么事。」他走了。云合上，风把你的袖子吹得鼓起来。', effects: { attrs: { 道心: 1 } } },
        },
      },
    ],
  },
  {
    id: 'ev_s_qingyun_two_peaks', title: '两峰之争', pool: 'sect', tier: 3, weight: 6, minRealm: 1,
    require: 'flag("入宗:qingyun") && char.sectId === "qingyun" && char.sectRank >= 2',
    text: '朝阳峰与落霞峰为一条灵脉吵了三年。今日在议事堂，两边都带了剑。\n\n你是真传，被推出来说话。堂上坐着三位长老，都不开口，只看你。案上摆着一盏冷茶，没人碰。',
    choices: [
      {
        label: '判给朝阳峰，他们人多',
        outcome: { text: '落霞峰的师兄当场摔了剑。三年后他成了别宗的长老，路过青云山时没停。', effects: { contribution: 200, reputation: 15, relation: { 落霞峰: -40 }, karma: -10 } },
      },
      {
        label: '提第三条：灵脉归公，两峰轮值', hint: '悟性检定',
        roll: {
          p: 0.5, attrs: { 悟性: 0.012, 道心: 0.006 },
          success: { text: '长老们互相看了一眼。最老的那个说：「这法子我们想过，没人敢提。」灵脉归公。两峰都恨你，也都不动你。', effects: { contribution: 400, attrs: { 悟性: 4 }, reputation: 20, relation: { 两峰: -15 } } },
          fail: { text: '两边同时冷笑。长老说：「再议。」再议就是三年，灵脉照旧吵。', effects: { reputation: -20, attrs: { 道心: 2 } } },
        },
      },
      {
        label: '说自己不管，退下',
        outcome: { text: '你退出议事堂。吵声隔着一层门，还是很响。你在阶上坐了很久，直到被人赶走。', effects: { attrs: { 道心: 2 }, reputation: -10 } },
      },
    ],
  },

  /* ───────────── 丹霞谷 ───────────── */
  {
    id: 'ev_s_danxia_watch_fire', title: '守炉', pool: 'sect', tier: 1, weight: 8, minRealm: 0,
    require: 'flag("入宗:danxia") && char.sectId === "danxia"',
    text: '百草园的丹炉三百年没熄过。守炉一夜一换，炉温要一直压在「将沸未沸」那口气上。\n\n后半夜火苗矮了一寸。你的眼皮在打架，炉子里的药香一阵浓一阵淡，像有人在里面呼吸。',
    choices: [
      {
        label: '掐自己一把，盯着火',
        outcome: { text: '你盯到天亮，火一寸没低。交班时老丹师看了看炉，说：「这炉认人。」', effects: { contribution: 60, attrs: { 悟性: 2 }, hp: -10 } },
      },
      {
        label: '添一把猛火，去睡一会', hint: '气运',
        roll: {
          p: 0.4, attrs: { 气运: 0.01 },
          success: { text: '你睡了两个时辰，回来时火正好。炉底多了一枚废丹，你悄悄收了，还成色不错。', effects: { items: ['yinqi_dan'], hp: 10 } },
          fail: { text: '炉炸了。半炉药渣糊上房梁，你被罚扫三年炉灰，眉毛长了半年才长齐。', effects: { hp: -40, contribution: -150, attrs: { 悟性: 1 } } },
        },
      },
      {
        label: '叫醒隔壁的师兄替你看',
        outcome: { text: '他骂了一句，还是来了。天亮时他眼睛通红，你补了他两枚引气丹的价钱。他说下次别叫。', effects: { stones: -60, relation: { 守炉师兄: 15 }, attrs: { 道心: 1 } } },
      },
    ],
  },
  {
    id: 'ev_s_danxia_taste_drug', title: '试药', pool: 'sect', tier: 2, weight: 7, minRealm: 0,
    require: 'flag("入宗:danxia") && char.sectId === "danxia"',
    text: '长老新炼了一炉丹，缺一个试药的人。丹房门口贴了条子：自愿者，贡献三百。\n\n条子下站着四个人。你是第五个。长老把丹递过来，只说了一句：「说真话。」',
    choices: [
      {
        label: '吞下去，如实说感受', hint: '根骨检定',
        roll: {
          p: 0.55, attrs: { 根骨: 0.008, 道心: 0.008 },
          success: { text: '半个时辰后，经脉像被温水洗过。你说「太热，热在骨头里」。长老记下，改了一味药，抬头道：「下次还找你。」', effects: { contribution: 300, exp: 150, attrs: { 根骨: 2 }, relation: { 丹房长老: 25 } } },
          fail: { text: '你吐了血，只说半句「心口……」就晕过去。醒来时长老守在旁边，脸色很难看。', effects: { hp: -60, injury: 2, contribution: 300, attrs: { 根骨: 1 } } },
        },
      },
      {
        label: '先问：前四个试过的人呢',
        outcome: { text: '长老看你很久。「两个死了，两个还在床上。」他把丹收回去，「你不试，我不勉强。」三百贡献没拿到。', effects: { attrs: { 道心: 4 }, demon: -2 } },
      },
      {
        label: '收下丹，回去再吃', hint: '欺瞒长老',
        outcome: { text: '你把丹藏进袖子，当晚在柴房吞下，烧了半宿，境界松动一线。第二天长老问起，你说「没敢吃」。他没说话，只把你的名字从丹房名册上划了。', effects: { expPct: 0.15, contribution: -200, reputation: -15, attrs: { 悟性: 2 } } },
      },
    ],
  },
  {
    id: 'ev_s_danxia_herb_garden', title: '百草园', pool: 'sect', tier: 1, weight: 7, minRealm: 0,
    require: 'flag("入宗:danxia") && char.sectId === "danxia" && char.sectRank >= 1',
    text: '百草园按节气分区，终年一股苦香，闻久了分不清是药还是自己身上的味。\n\n你的差事是采七味相克的药。第七味长在园子最里边，那片归长老私用，篱笆上挂着牌子：擅入者，废一手。',
    choices: [
      {
        label: '按规矩，采园外的替代药',
        outcome: { text: '替代的那味成色差一截。老丹师看了看，没说话，只把炉火调小了一点。', effects: { contribution: 80, attrs: { 悟性: 2 } } },
      },
      {
        label: '翻篱笆', hint: '风险',
        roll: {
          p: 0.45, attrs: { 气运: 0.012 },
          success: { text: '你采到了。回来路上撞见长老，他看了看你手里的药，说：「用完了把根埋回去。」', effects: { items: ['lingcao'], exp: 120, attrs: { 悟性: 3 }, flag: { 越篱: true } } },
          fail: { text: '篱笆上有禁制。你的左手废了半个月，握不住东西，连筷子都拿不稳。', effects: { hp: -45, injury: 2, contribution: -100 } },
        },
      },
      {
        label: '把牌子摘下来，插回自己门口', hint: '狂',
        outcome: { text: '第二天牌子不见了，你的床铺被搬到园子最外边的棚里。棚子漏风，药香也淡。', effects: { reputation: -25, attrs: { 道心: 3 }, demon: 3 } },
      },
    ],
  },

  /* ───────────── 天音寺 ───────────── */
  {
    id: 'ev_s_tianyin_bell', title: '梵钟崖', pool: 'sect', tier: 2, weight: 8, minRealm: 0,
    require: 'flag("入宗:tianyin") && char.sectId === "tianyin"',
    text: '天音寺不供佛，只供一口钟。钟在崖上，风大时自己会响，十里内的妖魔都会头痛。\n\n你的差事是每日撞钟三下。今日第一下撞下去，钟声没有散——它在你耳朵里停住了。',
    choices: [
      {
        label: '站着听完，让它响', hint: '道心检定',
        roll: {
          p: 0.5, attrs: { 道心: 0.012 },
          success: { text: '钟声在耳里转了三圈才散。散开时你听见里面夹着一句人声，像很多人同时念同一句经。', effects: { attrs: { 神识: 3, 道心: 3 }, exp: 100 } },
          fail: { text: '你在钟声里跪倒了，鼻血滴在钟座上。师兄把你抬回去，只说了一个字：「贪。」', effects: { hp: -35, attrs: { 神识: 1 } } },
        },
      },
      {
        label: '捂住耳朵，撞完剩下两下',
        outcome: { text: '剩下两下撞得很干。钟声散得很快。老僧在廊下看了你一眼，什么也没说，转身去添灯油。', effects: { contribution: 70, attrs: { 道心: 2 } } },
      },
      {
        label: '问老僧：钟里是不是有人',
        outcome: { text: '「有。」老僧说，「三百年前全寺的人都在里面。撞钟就是叫他们别睡。」他顿了顿，「你刚才听见了？」', effects: { attrs: { 悟性: 3 }, flag: { 钟里有人: true }, demon: 3 } },
      },
    ],
  },
  {
    id: 'ev_s_tianyin_sutra', title: '血经', pool: 'sect', tier: 1, weight: 8, minRealm: 0,
    require: 'flag("入宗:tianyin") && char.sectId === "tianyin"',
    text: '寺里抄经用血不用墨。你的差事是抄《渡亡经》第九卷，一日三页，血从指尖取。\n\n抄到第二页，纸上的字开始不对——不是你写错的，是字自己在挪。',
    choices: [
      {
        label: '停下，把纸烧了重抄',
        outcome: { text: '你在火盆边坐了一夜，重抄一遍，字很稳。老僧来看过，说：「字挪，是有人要你看见他。」', effects: { contribution: 60, attrs: { 道心: 3 }, hp: -15 } },
      },
      {
        label: '顺着字挪的方向读下去', hint: '神识检定',
        roll: {
          p: 0.45, attrs: { 神识: 0.012 },
          success: { text: '那一行读出来是一个名字，和一句「我在第三层塔」。你去塔里找过，第三层是空的，地砖是新的。', effects: { attrs: { 神识: 4 }, flag: { 塔中名: true }, demon: 5, exp: 80 } },
          fail: { text: '你读到一半，鼻血滴在纸上，被吸干了。此后三日，你看任何字都是斜的。', effects: { hp: -30, attrs: { 神识: 1 }, demon: 6 } },
        },
      },
      {
        label: '换用墨，不取血', hint: '违背寺规',
        outcome: { text: '墨字清楚，也凉。老僧看了你的纸，说：「省了血，也省了心。」三页都退了回来。', effects: { contribution: -60, attrs: { 道心: -1 }, hp: 10 } },
      },
    ],
  },

  /* ───────────── 万象书院 ───────────── */
  {
    id: 'ev_s_wanxiang_frozen_ink', title: '墨冻', pool: 'sect', tier: 1, weight: 7, minRealm: 0,
    require: 'flag("入宗:wanxiang") && char.sectId === "wanxiang"',
    text: '书院弟子不练剑，练字。字成阵，阵杀人。\n\n你在观星台下写字，写到第十七个字，墨冻住了。北风从檐下穿过去，把纸掀起来，字迹散成一片星。先生站在你身后，已经站了很久。',
    choices: [
      {
        label: '重磨墨，从头写',
        outcome: { text: '你写到天亮，写废四十张纸。先生只说了一句：「第十七笔，你手抖了。」然后走了。', effects: { contribution: 70, attrs: { 悟性: 3 }, hp: -10 } },
      },
      {
        label: '就着散开的字，补成一个阵', hint: '悟性检定',
        roll: {
          p: 0.4, attrs: { 悟性: 0.014 },
          success: { text: '阵成了，很小，只够困住一只麻雀。先生看了很久，说：「野路子。留着。」', effects: { attrs: { 悟性: 4, 神识: 2 }, contribution: 150, exp: 100 } },
          fail: { text: '阵反噬。纸烧起来，你的眉毛没了半边，观星台的檐角焦了一块。', effects: { hp: -30, contribution: -100 } },
        },
      },
      {
        label: '把纸揉了，说：天太冷',
        outcome: { text: '先生笑了一下。「冷是借口。」他把自己的砚台推过来，「用我的。下次别说冷。」', effects: { relation: { 书院先生: 20 }, attrs: { 悟性: 2 } } },
      },
    ],
  },
  {
    id: 'ev_s_wanxiang_star', title: '观星台', pool: 'sect', tier: 3, weight: 6, minRealm: 1,
    require: 'flag("入宗:wanxiang") && char.sectId === "wanxiang" && char.sectRank >= 1',
    text: '观星台的差事是推演天象，把每晚的星位移抄在三丈长的绢上。\n\n今夜你发现一颗星在动，动的方向不对。它不是在走，是被什么拉着走。绢上已经画了三十年的星图，没有这一条。',
    choices: [
      {
        label: '如实记下',
        outcome: { text: '你把那条线画上去。第二天三位先生一起来看，站着看到天黑。最老的那个说：「这条线，三百年前有过一次。」', effects: { contribution: 300, attrs: { 神识: 4, 悟性: 2 }, flag: { 星坠: true } } },
      },
      {
        label: '不记，抹掉',
        outcome: { text: '你把那段绢裁了，接口藏在星图里。此后三年，那颗星一直在动。你每年裁一次。', effects: { demon: 8, attrs: { 神识: 1 }, flag: { 藏星: true } } },
      },
      {
        label: '连夜推演它要去哪', hint: '耗神',
        roll: {
          p: 0.45, attrs: { 悟性: 0.012, 神识: 0.01 },
          success: { text: '推到最后，你算出一个日子和一个地方：三年后的秋天，北荒。你把绢卷起来塞进袖子。', effects: { attrs: { 神识: 5, 悟性: 3 }, lifespan: -5, flag: { 北荒之约: true }, expPct: 0.2 } },
          fail: { text: '你在台上晕了三天。醒来时嘴里有铁味，绢上是一堆自己也看不懂的线。', effects: { hp: -50, mp: -40, demon: 6 } },
        },
      },
    ],
  },

  /* ───────────── 寒山道观 ───────────── */
  {
    id: 'ev_s_hanshan_dark_hall', title: '无灯观', pool: 'sect', tier: 1, weight: 8, minRealm: 0,
    require: 'flag("入宗:hanshan") && char.sectId === "hanshan"',
    text: '寒山道观不点灯。夜里上香要摸着墙走，墙上有前人磨出的指痕，一行一行，像路。\n\n今夜你摸到第八十七块砖时，砖是热的。观里没有火。',
    choices: [
      {
        label: '把手按在砖上，等', hint: '道心检定',
        roll: {
          p: 0.5, attrs: { 道心: 0.012 },
          success: { text: '热从掌心进来，一路走到丹田。你「看」见黑暗里有一间屋子，屋里坐着一个人，也在等。', effects: { attrs: { 道心: 4, 神识: 2 }, exp: 100, flag: { 热砖: true } } },
          fail: { text: '热变成了烫。你缩手，指尖起了三个泡，泡破了，里面没有脓，只有一点灰。', effects: { hp: -25, attrs: { 道心: 1 }, demon: 4 } },
        },
      },
      {
        label: '记下位置，回去睡觉',
        outcome: { text: '第二天你再来，整面墙都是凉的。你按遍八十七块，没有一块是热的。', effects: { attrs: { 悟性: 2 }, demon: 2 } },
      },
      {
        label: '叫醒守夜的老道',
        outcome: { text: '老道摸着那块砖，笑了。「它挑人。」他往砖上吐了口唾沫，「下次它再热，你就尿上去。」', effects: { relation: { 守夜老道: 20 }, attrs: { 道心: 2 } } },
      },
    ],
  },
  {
    id: 'ev_s_hanshan_snow_house', title: '雪里的人家', pool: 'sect', tier: 2, weight: 7, minRealm: 0,
    require: 'flag("入宗:hanshan") && char.sectId === "hanshan"',
    text: '山下猎户来观里求人：孩子夜里总哭，说屋梁上坐着个人。\n\n你带着符纸下山，雪很深。屋里很干净，梁上什么也没有。孩子指着你的方向，说：「他下来了。」',
    choices: [
      {
        label: '在梁上贴符，烧掉屋里的旧物', hint: '消耗护心符',
        require: 'has("huxin_fu")', requireHint: '没有符纸',
        cost: { item: 'huxin_fu' },
        outcome: { text: '符贴上，旧物烧起来——是一件小棉袄，孩子哥哥的，去年冬天冻死的。孩子在火边睡着了，第一次没哭。', effects: { karma: 25, reputation: 15, attrs: { 道心: 3 } } },
      },
      {
        label: '把孩子抱到院里，自己在梁下坐一夜',
        outcome: { text: '你坐到天亮，什么也没来。孩子睡得很沉。猎户塞给你半扇野猪肉，你没要，只带走一把灶灰。', effects: { karma: 20, hp: -20, attrs: { 道心: 4 } } },
      },
      {
        label: '硬拔：用神识逼它出来', hint: '战斗 · 怨魂',
        combat: {
          enemy: 'ghost',
          win: { text: '你把它从天井逼出来，是一团很小的影子，不凶。你送它走了，第二天观里的钟自己响了一下。', effects: { exp: 200, karma: 30, attrs: { 神识: 3 } } },
          lose: { text: '它不肯走，反过来缠上你。你在雪地里吐了一口血，回观后病了两个月。', effects: { hp: -55, injury: 2, demon: 8 } },
        },
      },
    ],
  },

  /* ───────────── 万宝阁 ───────────── */
  {
    id: 'ev_s_wanbao_ledger', title: '三十六号库', pool: 'sect', tier: 1, weight: 8, minRealm: 0,
    require: 'flag("入宗:wanbao") && char.sectId === "wanbao"',
    text: '三十六号库存的是「待押品」——客人拿来换灵石、再也赎不回去的东西。\n\n盘点时你发现账上少了一件：一枚没有名字的玉扣。管库的老先生说：「账是死的，人是活的。」他把笔递给你。',
    choices: [
      {
        label: '如实记「缺一件」',
        outcome: { text: '老先生签了字，什么也没说。三个月后，那枚玉扣出现在拍卖台上，卖家是阁里的人。', effects: { contribution: 100, attrs: { 道心: 3 }, reputation: 10 } },
      },
      {
        label: '把账抹平',
        outcome: { text: '你落笔时手很稳。老先生看了你一眼，第二天起你被调去守夜。守夜多三百灵石，也多了整夜的脚步声。', effects: { stones: 300, attrs: { 道心: -1 }, demon: 4, flag: { 抹账: true } } },
      },
      {
        label: '自己赔上，把玉扣买下来', hint: '二百灵石',
        require: 'stones >= 200', requireHint: '灵石不足',
        cost: { stones: 200 },
        roll: {
          p: 0.5, attrs: { 气运: 0.012 },
          success: { text: '玉扣归你。夜里它在掌心温了一下，像有人在里面翻了个身。扣子里藏着一枚破障丹。', effects: { items: ['pozhang_dan'], attrs: { 气运: 2 } } },
          fail: { text: '玉扣是假的，壳里塞了蜡。老先生笑：「三十六号库，从来不缺假货。」', effects: { attrs: { 悟性: 2 }, demon: 2 } },
        },
      },
    ],
  },
  {
    id: 'ev_s_wanbao_debt', title: '讨债', pool: 'sect', tier: 2, weight: 7, minRealm: 1,
    require: 'flag("入宗:wanbao") && char.sectId === "wanbao"',
    text: '账房给你一张欠条：青云门外门弟子，欠灵石一千二，逾期两年。\n\n「要得回来，抽三成。」账房说，「要不回来，从你月例里扣路费。」',
    choices: [
      {
        label: '上门硬要', hint: '战斗 · 筑基修士',
        combat: {
          enemy: 'cultivator',
          win: { text: '他掏空了柜子，凑出七百，剩下的写了新条。你抽了三成，把新条也收进袖子。', effects: { stones: 360, contribution: 200, reputation: 15, karma: -10 } },
          lose: { text: '他比欠条上写的能打。你被扔出门，路费照扣，伤了自己养。', effects: { stones: -80, hp: -40, injury: 1 } },
        },
      },
      {
        label: '替他垫上，欠条收进自己袖子', hint: '一千二百灵石',
        require: 'stones >= 1200', requireHint: '拿不出这些灵石',
        cost: { stones: 1200 },
        outcome: { text: '你没去找他。三年后那张纸自己找上门——他成了金丹，把本利放在你桌上。走时留下一句：「万宝阁还有人这样做事。」', effects: { karma: 35, reputation: 30, attrs: { 道心: 4 }, relation: { 欠债人: 40 } } },
      },
      {
        label: '把欠条转卖给阁里的催收',
        outcome: { text: '你抽了三成，剩下不管了。一个月后听说他被打断了腿，逐出青云门。你数钱的时候手很稳。', effects: { stones: 360, karma: -20, demon: 6, contribution: 100 } },
      },
    ],
  },

  /* ───────────── 万兽山 ───────────── */
  {
    id: 'ev_s_wanshou_cub', title: '走失的幼崽', pool: 'sect', tier: 1, weight: 8, minRealm: 0,
    require: 'flag("入宗:wanshou") && char.sectId === "wanshou"',
    text: '百兽谷丢了一头幼崽，三日的。母兽在谷口撞了一夜岩壁，血把石头染了一片。\n\n你的差事是找回来。山里下着雨，兽踪被冲得只剩半枚。',
    choices: [
      {
        label: '循着血味往深处找', hint: '神识检定',
        roll: {
          p: 0.5, attrs: { 神识: 0.01, 根骨: 0.006 },
          success: { text: '你在石缝里找到它，冷得发抖，还活着。抱回来时母兽没有咬你，只把鼻子贴在你手背上，很烫。', effects: { contribution: 150, attrs: { 根骨: 3 }, relation: { 母兽: 40 }, exp: 100 } },
          fail: { text: '你找到的是半只脚。母兽闻了闻，然后就不再叫了，一整夜都没叫。', effects: { demon: 6, attrs: { 道心: 2 }, contribution: 50 } },
        },
      },
      {
        label: '先回谷报信，请执事带人',
        outcome: { text: '人来了，火把照亮半座山。幼崽第二天在溪边找到，已经僵了。执事在册子上写「雨大」，没写别的。', effects: { contribution: 80, attrs: { 道心: 1 } } },
      },
      {
        label: '吹兽哨，唤谷里的兽一起找', hint: '悟性检定',
        roll: {
          p: 0.45, attrs: { 悟性: 0.01 },
          success: { text: '哨声一起，谷里三十几头兽都动了。它们比你懂这座山。天亮时一头老猿把幼崽叼了回来。', effects: { contribution: 250, attrs: { 悟性: 3, 根骨: 2 }, exp: 120, flag: { 兽哨: true } } },
          fail: { text: '哨声惊了兽群，踩塌半条山道。你被罚半年月例，肋骨还被顶了一下。', effects: { stones: -150, contribution: -80, injury: 1 } },
        },
      },
    ],
  },
  {
    id: 'ev_s_wanshou_three_months', title: '同住三月', pool: 'sect', tier: 2, weight: 6, minRealm: 0,
    require: 'flag("入宗:wanshou") && char.sectId === "wanshou"',
    text: '山门是兽骨拱门。新入门的人要与一头妖兽同住三月，不许用强，不许上锁。\n\n分给你的是铁甲妖猪，半人高，牙很黄。它第一天就把你的铺盖拱进了泥里。',
    choices: [
      {
        label: '跟它挤一个窝，睡地上',
        outcome: { text: '三个月后你能听懂它哼的调子。它走的时候在门口站了很久，然后头也不回地进了林子。', effects: { attrs: { 根骨: 3, 道心: 3 }, exp: 150, flag: { 与兽同住: true } } },
      },
      {
        label: '偷偷在门上加一道栓', hint: '气运',
        roll: {
          p: 0.4, attrs: { 气运: 0.008 },
          success: { text: '栓上了，什么也没发生。三月满，你过关，执事看你的眼神有点淡。', effects: { attrs: { 根骨: 2 }, contribution: 60 } },
          fail: { text: '它撞开门，把你顶在墙上，獠牙离喉咙一寸。它没咬，只闻了闻，然后走了。', effects: { hp: -40, injury: 1, attrs: { 道心: 2 } } },
        },
      },
      {
        label: '拿灵草喂它', hint: '消耗百年灵草',
        require: 'has("lingcao")', requireHint: '没有灵草',
        cost: { item: 'lingcao' },
        outcome: { text: '它吃了灵草，第一次让你摸背。三月里它胖了一圈。执事记你一笔「以物媚兽」，扣了贡献。', effects: { attrs: { 根骨: 2, 魅力: 1 }, contribution: -60, relation: { 妖猪: 30 } } },
      },
    ],
  },

  /* ───────────── 机关城 ───────────── */
  {
    id: 'ev_s_jiguan_stairs', title: '第九层', pool: 'sect', tier: 2, weight: 8, minRealm: 0,
    require: 'flag("入宗:jiguan") && char.sectId === "jiguan"',
    text: '机关城会自己走路。入门的考校是从第九层走到第一层，不许碰响一块砖。\n\n第九层三千四百块砖，其中一百块是活的。你走第三步时，脚下的砖轻轻往下一沉。',
    choices: [
      {
        label: '停住，把重心挪回脚跟', hint: '悟性检定',
        roll: {
          p: 0.5, attrs: { 悟性: 0.012, 根骨: 0.008 },
          success: { text: '砖自己弹了回去。那一瞬你听见城在呼吸——很慢，一炷香一次。', effects: { contribution: 200, attrs: { 悟性: 4 }, exp: 120, flag: { 听见城: true } } },
          fail: { text: '砖沉到底，整层齿轮一起转。你被夹在两道墙之间，断了两根肋骨。', effects: { hp: -55, injury: 2, contribution: -50 } },
        },
      },
      {
        label: '跳过去', hint: '赌',
        roll: {
          p: 0.35, attrs: { 气运: 0.014, 根骨: 0.006 },
          success: { text: '你落地时压着三块砖的缝，城没响。楼上有人笑了一声，很短。', effects: { attrs: { 根骨: 3, 气运: 1 }, contribution: 150 } },
          fail: { text: '落地声很响。守城的傀儡从墙里出来，把你拎回第九层，从头再来。', effects: { hp: -30, contribution: -40, attrs: { 悟性: 1 } } },
        },
      },
      {
        label: '退回去，问执事有没有别的路',
        outcome: { text: '「没有别的路。」执事说，「城只认一条路。」他给了你一双软底靴，是他自己的。', effects: { relation: { 机关城执事: 20 }, attrs: { 悟性: 2 }, items: ['shenxing_fu'] } },
      },
    ],
  },
  {
    id: 'ev_s_jiguan_puppet', title: '失控的机关', pool: 'sect', tier: 3, weight: 6, minRealm: 1,
    require: 'flag("入宗:jiguan") && char.sectId === "jiguan"',
    text: '第七层的运货傀儡疯了，抱着半箱玄铁在廊道里横冲，已经撞断三个人的腿。\n\n它的后颈有一处手动闸，铜的，被撞得凹了进去。你手里只有一把凿子。',
    choices: [
      {
        label: '扑上去撬闸', hint: '根骨检定',
        roll: {
          p: 0.45, attrs: { 根骨: 0.012 },
          success: { text: '你被拖了七丈，凿子卡进凹口，闸跳了。傀儡停在离墙一寸处，玄铁撒了一地，你捡了三块。', effects: { items: ['xuantie'], contribution: 200, hp: -35, attrs: { 根骨: 2 } } },
          fail: { text: '它把你甩在柱子上。你在床上躺了一个月，怀里还攥着那把凿子。', effects: { hp: -70, injury: 3 } },
        },
      },
      {
        label: '撬开地砖，让它掉下去', hint: '破坏公物',
        outcome: { text: '你撬了四块砖。傀儡掉下去，砸穿两层楼板。城主没露面，只传下一句话：「修好。」你修了两年。', effects: { contribution: -300, attrs: { 悟性: 4 }, exp: 200 } },
      },
      {
        label: '站着，让人去报',
        outcome: { text: '你去报了。回来时它已撞塌一堵墙，然后自己停了。没人怪你，也没人记得你在场。', effects: { attrs: { 道心: 2 }, contribution: 20 } },
      },
    ],
  },

  /* ───────────── 血魔宗 ───────────── */
  {
    id: 'ev_s_xuemo_blood_pool', title: '血池', pool: 'sect', tier: 2, weight: 8, minRealm: 0,
    require: 'flag("入宗:xuemo") && char.sectId === "xuemo"',
    text: '血池在宗门外三十丈，池水暗红，冬天冒白气。新人要在里面泡够三日，或者杀死一个同样在泡的人。\n\n第二日夜里，池子里只剩你和另一个人。他一直在看你。',
    choices: [
      {
        label: '闭眼，泡到第三日', hint: '根骨检定',
        roll: {
          p: 0.5, attrs: { 根骨: 0.012, 道心: 0.006 },
          success: { text: '第三日天亮，池水浅了一寸，你的皮肉换了一层。你上岸时，那个人已经沉在池底。', effects: { attrs: { 根骨: 4 }, expPct: 0.1, karma: -10, flag: { 血池: true } } },
          fail: { text: '骨头开始疼，疼到说不出话。是执事把你拖上来的：「再泡半日你就化了。」', effects: { hp: -50, attrs: { 根骨: 2 }, demon: 8 } },
        },
      },
      {
        label: '先动手', hint: '战斗 · 血魔宗弟子',
        combat: {
          enemy: 'blood_cult',
          win: { text: '他沉下去的时候还在笑。你在池边坐到天亮，把他的手牌塞进腰里。', effects: { attrs: { 根骨: 3 }, karma: -30, demon: 10, contribution: 200 } },
          lose: { text: '你被他按在水里，喝了两口池水。是巡池的人把你捞上来的，你被扣了三个月月供。', effects: { hp: -60, injury: 3, contribution: -100 } },
        },
      },
      {
        label: '跟他说话，说：我们都别动',
        outcome: { text: '他笑了，说血池里没人守约。第三日他先上了岸。你们都没死。宗门记了一笔「不合规」，罚半年月例。', effects: { attrs: { 道心: 3 }, stones: -120, karma: 10, flag: { 血池同活: true } } },
      },
    ],
  },
  {
    id: 'ev_s_xuemo_quota', title: '月供', pool: 'sect', tier: 2, weight: 7, minRealm: 1,
    require: 'flag("入宗:xuemo") && char.sectId === "xuemo"',
    text: '血魔宗没有月例，只有月供：每月交三百斤生血，或者一条正道人命。\n\n今夜是月末。你手里有一小瓶战场上收的血，还差一半。山道上有个走单的青云弟子，境界比你低。',
    choices: [
      {
        label: '动手', hint: '战斗 · 筑基修士',
        combat: {
          enemy: 'cultivator',
          win: { text: '他死得很快，快到让你觉得这件事很轻。你把血装满了三瓶，剩下的倒在雪里，雪化了一片。', effects: { contribution: 250, exp: 200, karma: -40, demon: 12, stones: 120 } },
          lose: { text: '他反手一剑刺穿你的肩窝，跑了。你这个月的月供没着落，被记了一笔。', effects: { hp: -70, injury: 3, contribution: -100, reputation: -10 } },
        },
      },
      {
        label: '拿自己的血补', hint: '气血 -60',
        cost: { hp: 60 },
        outcome: { text: '你割开腕子放了大半夜，血不够，掺了水。第二天验血的执事闻了闻，什么也没说，只把你的名字记在另一本册子上。', effects: { attrs: { 道心: 4 }, contribution: 180, demon: -3, flag: { 掺水: true } } },
      },
      {
        label: '不交，躲着',
        outcome: { text: '你躲了七天。第八天，两个人的铺位空了。你把小瓶里的血倒在自己枕头上，说打翻了。', effects: { reputation: -20, demon: 6, attrs: { 道心: -2 } } },
      },
    ],
  },
  {
    id: 'ev_s_xuemo_roster', title: '名册', pool: 'sect', tier: 3, weight: 6, minRealm: 1,
    require: 'flag("入宗:xuemo") && char.sectId === "xuemo" && char.sectRank >= 1',
    text: '宗门每季发一次名册，把最末位的人划掉。这一季，末位是你的同屋。\n\n他半夜摇醒你，眼睛是红的：「帮我把排名改一改。只是改排名。」册子就在执事房里，门没锁。',
    choices: [
      {
        label: '帮他改', hint: '气运检定',
        roll: {
          p: 0.45, attrs: { 气运: 0.012 },
          success: { text: '你改了。第二季划掉的是另一个不认识的。同屋活下来，从此见了你绕着走。', effects: { relation: { 同屋: -20 }, demon: 10, karma: -15, flag: { 改册: true } } },
          fail: { text: '执事在册子上留了记号。你被吊在血池边的柱子上三天，同屋当天就被划了名。', effects: { hp: -60, injury: 2, reputation: -20 } },
        },
      },
      {
        label: '不帮，明早送他走',
        outcome: { text: '他坐在床沿到天亮。走时把你借他的外袍叠好放在床上：「我不怪你。」这句你记了很久。', effects: { attrs: { 道心: 3 }, demon: 5, flag: { 同屋死: true } } },
      },
      {
        label: '替他杀一个排名靠前的', hint: '战斗 · 血魔宗弟子',
        combat: {
          enemy: 'blood_cult',
          win: { text: '你把他沉进了血池。名册上少了一个名字，同屋的排名往前挪了一格。他不知道是你做的。', effects: { contribution: 300, exp: 250, demon: 15, karma: -35 } },
          lose: { text: '他早有防备。你被打断一条腿，扔在自己的铺上。名册照旧，同屋照旧被划。', effects: { hp: -75, injury: 3, reputation: -15 } },
        },
      },
    ],
  },

  /* ───────────── 合欢宗 ───────────── */
  {
    id: 'ev_s_hehuan_flower', title: '情花', pool: 'sect', tier: 1, weight: 8, minRealm: 0,
    require: 'flag("入宗:hehuan") && char.sectId === "hehuan"',
    text: '合欢林的花只在夜里开，采花要趁香最浓那一口。宗中说：采花的人，会闻到自己心里最不愿承认的那件事。\n\n你伸手去摘第一朵时，风从林子深处出来，带来一股很淡、很熟悉的味道。',
    choices: [
      {
        label: '摘下来，忍到回房',
        outcome: { text: '花在手心枯了。你把枯花放进水里，水变成浅红色，映出一张脸。你看了很久，把它喝掉了。', effects: { attrs: { 魅力: 3, 道心: 2 }, demon: 3, exp: 80 } },
      },
      {
        label: '停在原地，让香气把自己灌满', hint: '道心检定',
        roll: {
          p: 0.45, attrs: { 道心: 0.012 },
          success: { text: '你站到天亮。回来时师姐说你身上有股「想人」的味道。你笑了一下，没否认。', effects: { attrs: { 魅力: 5, 道心: 2 }, demon: 5, contribution: 100 } },
          fail: { text: '你在林子里迷了七日，醒来时满身花瓣，修为倒退一层，衣服上全是别人的香。', effects: { hp: -40, demon: 10, attrs: { 魅力: 2 } } },
        },
      },
      {
        label: '采满一篮，交差',
        outcome: { text: '你采了两百朵，交了。库房按朵记贡献，一朵两个点。这是宗里最干净的活。', effects: { contribution: 200, stones: 80, attrs: { 魅力: 1 } } },
      },
    ],
  },
  {
    id: 'ev_s_hehuan_guard', title: '护法', pool: 'sect', tier: 3, weight: 6, minRealm: 1,
    require: 'flag("入宗:hehuan") && char.sectId === "hehuan" && char.sectRank >= 1',
    text: '师姐要渡情劫——以情为引，烧掉心里最难舍的那一段。护法的人要守着，不许说话，不许出手，哪怕她叫你的名字。\n\n她坐在阵里，第一夜开始哭，第二夜开始叫你。',
    choices: [
      {
        label: '守住，一言不发', hint: '道心检定',
        roll: {
          p: 0.55, attrs: { 道心: 0.014 },
          success: { text: '第三日天亮，她走出阵，脸白得像纸，笑得很轻。「你很难叫。」她说，「我记住这个难字了。」', effects: { attrs: { 道心: 6, 魅力: 2 }, contribution: 300, relation: { 师姐: 40 }, expPct: 0.15 } },
          fail: { text: '你开了口。阵破了，她吐血倒地，情劫要重来一轮。被抬走时她没看你。', effects: { hp: -30, demon: 10, relation: { 师姐: -40 }, contribution: -200 } },
        },
      },
      {
        label: '回她一句：我在',
        outcome: { text: '她的哭声停了。劫没渡成，但她说：「够了。」此后每季她都来找你喝茶，一句话不说，喝完就走。', effects: { relation: { 师姐: 60 }, attrs: { 道心: 2 }, contribution: 50, demon: 2, flag: { 应了一声: true } } },
      },
      {
        label: '中途离阵，去叫长老',
        outcome: { text: '长老来时，她已经被自己的情火烧了半边脸。后来还是长好了，只是再没笑过。', effects: { attrs: { 道心: 3 }, reputation: -20, demon: 5, karma: -5 } },
      },
    ],
  },

  /* ───────────── 幽冥鬼道 ───────────── */
  {
    id: 'ev_s_youming_ferry', title: '黄泉渡', pool: 'sect', tier: 2, weight: 8, minRealm: 0,
    require: 'flag("入宗:youming") && char.sectId === "youming"',
    text: '黄泉渡的差事是收魂：把不肯走的魂魄劝上船，送过那片灰水。\n\n今夜来的是个孩子，蹲在渡口，说什么也不上船。他手里攥着半块饼，饼是硬的。',
    choices: [
      {
        label: '蹲下来，跟他说说话',
        outcome: { text: '你说了一夜。天亮时他把饼分了一半给你。你收下了，虽然你不能吃。他上船时回头挥了挥手。', effects: { attrs: { 道心: 4 }, karma: 25, exp: 100 } },
      },
      {
        label: '强收', hint: '神识检定',
        roll: {
          p: 0.5, attrs: { 神识: 0.012 },
          success: { text: '锁魂绳一套，他就小了，缩成一颗豆子。你把他放在船头。船开时，豆子还在跳。', effects: { contribution: 150, karma: -20, demon: 6, attrs: { 神识: 2 } } },
          fail: { text: '他挣开了，咬住你的手。那一口没有牙印，只有凉。此后半月你手上一直是凉的。', effects: { hp: -35, demon: 8, attrs: { 神识: 1 } } },
        },
      },
      {
        label: '替他找娘，让她来送', hint: '耗时一月',
        cost: { month: 1 },
        outcome: { text: '你花一个月找到他娘。妇人抱着半块饼哭了半宿。第二夜，孩子自己上了船。', effects: { karma: 40, contribution: 120, attrs: { 道心: 5 }, demon: -6 } },
      },
    ],
  },
  {
    id: 'ev_s_youming_grave', title: '挖坟', pool: 'sect', tier: 2, weight: 6, minRealm: 0,
    require: 'flag("入宗:youming") && char.sectId === "youming"',
    text: '宗门派你去一户人家挖坟。死的是个修士，下葬时带了件法器，宗门要那件东西。\n\n坟挖开，棺材里的尸身没有烂，眼睛是睁着的。',
    choices: [
      {
        label: '按差事取物，盖上土',
        outcome: { text: '你取了法器，把土填回去踩实。走时听见棺材里有指甲刮木头的声音——或许只是土在沉。', effects: { contribution: 250, stones: 100, demon: 6, karma: -15 } },
      },
      {
        label: '先合上他的眼', hint: '道心检定',
        roll: {
          p: 0.5, attrs: { 道心: 0.012 },
          success: { text: '眼皮很软。尸身忽然叹了口气，散了。棺材里只剩法器，和一块写着「谢谢」的木牌。', effects: { attrs: { 道心: 4, 神识: 2 }, contribution: 200, karma: 15, items: ['leimu'] } },
          fail: { text: '手刚碰到，尸身睁大了眼。一股尸气冲上来，你的手臂黑了三寸，半个月才退。', effects: { hp: -45, injury: 2, demon: 10 } },
        },
      },
      {
        label: '把坟填回去，空手回宗',
        outcome: { text: '执事没罚你，只说：「你迟早要挖的。」那年冬天，你自己家的坟被人挖了。', effects: { contribution: -150, attrs: { 道心: 3 }, demon: 4 } },
      },
    ],
  },

  /* ───────────── 散修 ───────────── */
  {
    id: 'ev_s_sanxiu_stall', title: '摆摊', pool: 'sect', tier: 1, weight: 8, minRealm: 0,
    require: 'flag("入宗:sanxiu") && char.sectId === "sanxiu"',
    text: '散修没有月例。你在城西坊市摆摊，卖自己炼的引气丹，一枚三十灵石。\n\n对面就是万宝阁分号，同样的丹卖八十。他们的伙计站在门口看你，已经看了一个时辰。',
    choices: [
      {
        label: '降价，卖二十',
        outcome: { text: '三天卖空了。第四天两个穿万宝阁衣服的人来收摊位费，一月五十。你交了一个月。', effects: { stones: 180, attrs: { 魅力: 2 }, demon: 2 } },
      },
      {
        label: '不降，挂一块木牌：自炼，可试丹', hint: '气运检定',
        roll: {
          p: 0.5, attrs: { 气运: 0.01, 魅力: 0.008 },
          success: { text: '有人试了一枚，当场坐下吐纳，起来买了十枚。木牌后来被人抄遍了坊市。', effects: { stones: 400, attrs: { 魅力: 3 }, reputation: 10 } },
          fail: { text: '试丹的人拉了一夜肚子，第二天带人来砸摊。你赔了三百灵石，收拾摊子走了。', effects: { stones: -300, hp: -20, reputation: -10 } },
        },
      },
      {
        label: '把摊子挪到更远的小巷',
        outcome: { text: '巷子深处一天来不了五个人。你坐在那儿看了半年书，倒把《长春功》看明白了。', effects: { items: ['changchun_gong'], attrs: { 悟性: 3 }, stones: 40 } },
      },
    ],
  },
  {
    id: 'ev_s_sanxiu_temple', title: '山神庙', pool: 'sect', tier: 1, weight: 7, minRealm: 0,
    require: 'flag("入宗:sanxiu") && char.sectId === "sanxiu"',
    text: '冬天。你在山神庙过夜，庙里已有三个人：一个断腿的老兵，一个抱孩子的女人，一个不说话的道人。\n\n神像半边脸塌了，供桌上落着雪。',
    choices: [
      {
        label: '生一堆火，把干粮分出去',
        outcome: { text: '火烧到半夜。老兵讲了一夜战场上的事，女人把孩子哄睡了。道人一直没说话，天亮时留给你一枚符，走了。', effects: { items: ['huxin_fu'], karma: 20, attrs: { 道心: 3 }, demon: -4 } },
      },
      {
        label: '占了最里边的角落，背对着他们睡',
        outcome: { text: '半夜有人摸你的包裹。你抓住那只手，是个孩子的手。你松开了。天亮时包裹里少了半块饼。', effects: { attrs: { 道心: 1 }, demon: 3, karma: -5 } },
      },
      {
        label: '问那道人：你是哪家的', hint: '神识检定',
        roll: {
          p: 0.45, attrs: { 神识: 0.01 },
          success: { text: '他抬起头，眼睛里没有眼白。「我是死人。」他说，「你身上有宗门气，可你没有宗门。」然后他就不见了，雪地上没有脚印。', effects: { attrs: { 神识: 4 }, demon: 6, exp: 120, flag: { 雪地无痕: true } } },
          fail: { text: '他不理你。你问了三遍，他起身走了。庙里剩下你和一尊塌脸的神像。', effects: { attrs: { 道心: 2 } } },
        },
      },
    ],
  },

  /* ───────────── 通用宗门事务 ───────────── */
  {
    id: 'ev_s_monthly_wage', title: '月例', pool: 'sect', tier: 1, weight: 10, minRealm: 0,
    require: 'char.sectId',
    text: '发月例的日子。执事坐在长桌后，把灵石一枚枚数进小布袋，数到一半手停了。\n\n「今年宗门修山门，月例扣三成。」他说，「有意见的，来找我。」没人动。',
    choices: [
      {
        label: '不吭声，领了就走',
        outcome: { text: '你捏了捏布袋，比上月轻。回去的路上，你把三枚灵石塞给了新入门的小师弟。', effects: { stones: 70, attrs: { 道心: 2 }, contribution: 20, karma: 5 } },
      },
      {
        label: '问：修山门为何扣外门的', hint: '道心检定',
        roll: {
          p: 0.4, attrs: { 道心: 0.01, 魅力: 0.008 },
          success: { text: '执事抬起头看你很久，然后把你的布袋添满。「问得对。」他说，「但你下个月别问了。」', effects: { stones: 100, attrs: { 道心: 3 }, reputation: 15, flag: { 问过月例: true } } },
          fail: { text: '「再多话，扣五成。」他把布袋推过来。你接了，比原先还轻。', effects: { stones: 50, reputation: -10, demon: 2 } },
        },
      },
      {
        label: '接私活，下山替人看风水', hint: '耗时一月',
        cost: { month: 1 },
        outcome: { text: '你下山一个月，赚的比月例多。回来时执事问你去了哪，你说探亲。他「嗯」了一声。', effects: { stones: 300, contribution: -60, attrs: { 魅力: 2 } } },
      },
    ],
  },
  {
    id: 'ev_s_chore_board', title: '差事牌', pool: 'sect', tier: 1, weight: 9, minRealm: 0,
    require: 'char.sectId',
    text: '差事牌一日一换。今日挂出来三块：扫山道、抄药方、给后山三位长老送饭。\n\n牌下围了十几个人，都不伸手。最后剩给你的，是送饭。',
    choices: [
      {
        label: '接，按时送',
        outcome: { text: '三位长老，一间屋子，一个门。你把饭放门口，敲三下，走开。三个月里没见过他们的脸。第四个月门开了条缝，一只手把一枚丹药放进你手心。', effects: { items: ['pozhang_dan'], contribution: 150, attrs: { 道心: 3 } } },
      },
      {
        label: '换牌，抢扫山道', hint: '根骨检定',
        roll: {
          p: 0.55, attrs: { 根骨: 0.01 },
          success: { text: '山道一千八百级，你扫了七天。有个长老路过，在你身边站了一会，说：「扫得干净。」这是他全部的话。', effects: { contribution: 100, attrs: { 根骨: 2 }, hp: -15 } },
          fail: { text: '牌被人先拿走了，你还被推了一把。最后还是你送饭，送的还是那间屋。', effects: { hp: -10, attrs: { 道心: 1 }, contribution: 20 } },
        },
      },
      {
        label: '不接，回房修炼',
        outcome: { text: '你没接牌。夜里有人在你门口放了一张纸，写着你的名字，后面画了一道。第二天执事说：「这个月你不必出门了。」', effects: { contribution: -120, attrs: { 道心: 2 }, demon: 3 } },
      },
    ],
  },
  {
    id: 'ev_s_borrow_stones', title: '借灵石', pool: 'sect', tier: 2, weight: 7, minRealm: 1,
    require: 'char.sectId && char.sectRank >= 1',
    text: '师弟来借灵石，三百，说要去换一枚筑基丹。\n\n他把自己的剑押在你桌上，那是他爹留下的。「三个月。」他说，「我要是没回来，剑归你。」',
    choices: [
      {
        label: '借，剑还他', hint: '三百灵石',
        require: 'stones >= 300', requireHint: '灵石不足',
        cost: { stones: 300 },
        outcome: { text: '他把剑推回来，红着眼走了。三个月后他回来了，境界稳在筑基，第一件事是来给你磕了个头。', effects: { relation: { 师弟: 60 }, attrs: { 道心: 4 }, flag: { 借过灵石: true } } },
      },
      {
        label: '收下剑，钱不借',
        outcome: { text: '他抱着剑在门口站了很久，然后走了。后来听说他没换到丹，去了西山打猎，死在一头妖猪嘴里。', effects: { attrs: { 道心: -3 }, demon: 8, karma: -10, items: ['canjian'] } },
      },
      {
        label: '借一半，剩下的让他自己想办法',
        outcome: { text: '他拿走一百五，剩下的到处凑。三个月后他回来了，境界没成，但活着。他见了你还是叫师兄。', effects: { stones: -150, relation: { 师弟: 25 }, attrs: { 道心: 1 } } },
      },
    ],
  },
  {
    id: 'ev_s_elder_silence', title: '长老的沉默', pool: 'sect', tier: 3, weight: 6, minRealm: 1,
    require: 'char.sectId && char.sectRank >= 2',
    text: '长老叫你去，不说话。他坐在蒲团上，面前的茶从热到凉，屋里的香烧完了两炷。\n\n你就站着，从天亮站到天黑。他终于开口，只说了两个字：「去吧。」',
    choices: [
      {
        label: '不问，行礼退出',
        outcome: { text: '你退到门口，他在背后补了一句：「下个月初七，别出门。」初七那天宗门死了四个人，都是真传。', effects: { attrs: { 道心: 4 }, flag: { 长老示警: true }, contribution: 100 } },
      },
      {
        label: '问：长老要说什么', hint: '道心检定',
        roll: {
          p: 0.4, attrs: { 道心: 0.012, 悟性: 0.008 },
          success: { text: '他把凉茶推到你面前。「我教过六个徒弟。」他说，「现在五个牌位在我屋里。」他抬眼看你，「你要活得比我久。」', effects: { attrs: { 悟性: 4, 道心: 4 }, relation: { 长老: 35 }, expPct: 0.1 } },
          fail: { text: '「我说过了。」他闭上眼。你在门口站到半夜，他没再睁眼。', effects: { attrs: { 道心: 2 }, reputation: -10 } },
        },
      },
      {
        label: '把凉茶喝了',
        outcome: { text: '茶很苦，苦到舌根发麻。他忽然笑了一下：「这茶有毒。」你愣住，他又说：「骗你的。」你走到山门才敢喘气。', effects: { attrs: { 道心: 3 }, demon: 4, relation: { 长老: 15 } } },
      },
    ],
  },
  {
    id: 'ev_s_law_hall', title: '执法堂', pool: 'sect', tier: 2, weight: 6, minRealm: 0,
    require: 'char.sectId',
    text: '执法堂问你：三月初九，你在后山做什么。\n\n那天你在后山埋了一只死掉的灵鹤。但他们问的不是鹤。有人说你给外宗递过东西。堂上三个人，桌上摆着一根竹签，签上没字。',
    choices: [
      {
        label: '如实说埋鹤', hint: '道心检定',
        roll: {
          p: 0.55, attrs: { 道心: 0.012 },
          success: { text: '他们传了守山的老头，老头说「是，我看见他挖坑」。签收了。你出门时腿是软的。', effects: { attrs: { 道心: 3 }, contribution: 50 } },
          fail: { text: '「埋鹤要挖三尺？」竹签推过来，「签上无名，就当你没来过。下次别来。」三个月里没人和你说话。', effects: { reputation: -25, demon: 6, attrs: { 道心: 2 } } },
        },
      },
      {
        label: '什么都不说，站到他们放你走',
        outcome: { text: '你站了一天一夜。第二天卯时他们让你走了，理由写的是「无据」。你回房睡了整整两天。', effects: { hp: -20, attrs: { 道心: 5 }, demon: 3 } },
      },
      {
        label: '反咬：是谁说的', hint: '魅力检定',
        roll: {
          p: 0.4, attrs: { 魅力: 0.01, 道心: 0.008 },
          success: { text: '你说出一个名字。堂上的人对视一眼——那个人三个月前已被逐出宗门。你的名字从册子上抹掉了。', effects: { reputation: 15, demon: 5, flag: { 反咬: true } } },
          fail: { text: '「你在执法堂里问话？」竹签被拍在桌上。笞二十，打完还得自己走回去。', effects: { hp: -40, injury: 1, reputation: -15 } },
        },
      },
    ],
  },
  {
    id: 'ev_s_gate_cull', title: '末位', pool: 'sect', tier: 1, weight: 8, minRealm: 0, maxRealm: 2,
    require: 'char.sectId && char.sectRank === 0',
    text: '外门每年筛一次，末位二十人遣散下山。榜贴在伙房外，你的名字在第十九。\n\n第二十那个，是和你一起入门、一起扫了两年山道的人。他站在榜前，一句话没说。',
    choices: [
      {
        label: '帮他补课，一起过关', hint: '耗时两月',
        cost: { month: 2, stones: 50 },
        outcome: { text: '你陪他练了两个月。榜换下来时，你们两个都在榜外。他请你吃了一顿，吃到一半哭了。', effects: { contribution: 80, relation: { 同门: 50 }, attrs: { 道心: 4 } } },
      },
      {
        label: '不管，自己往前挤',
        outcome: { text: '你把所有时间用来修炼，境界涨了一线，排到第十一。他下山那天你没去送。', effects: { expPct: 0.15, attrs: { 道心: -1 }, demon: 5 } },
      },
      {
        label: '去求执事，把名字换下来', hint: '魅力检定',
        roll: {
          p: 0.35, attrs: { 魅力: 0.012, 道心: 0.006 },
          success: { text: '执事把册子合上：「换名要有人担。」你担了。他留下，你替他把三个月差事都做了。', effects: { contribution: -150, relation: { 同门: 60 }, attrs: { 道心: 5 }, hp: -20 } },
          fail: { text: '「榜是长老定的。」他把你推出去，「你再求，我把你的名字也划了。」', effects: { reputation: -15, demon: 3 } },
        },
      },
    ],
  },
  {
    id: 'ev_s_border_post', title: '边境哨所', pool: 'sect', tier: 4, weight: 4, minRealm: 2,
    require: 'char.sectId && char.sectRank >= 1',
    text: '宗门与邻宗争一条灵石矿脉，谈崩了。你被派去守边境哨所：一间石屋，七个人，两架弩。\n\n第三夜，山下林子里有火光，很多。信符在墙上，烧了就能叫援兵，烧了也等于宣战。',
    choices: [
      {
        label: '烧信符',
        outcome: { text: '青烟冲上去，半个时辰内援兵就到。石屋里七个人都在看你。你把手按在刀上，等。', effects: { contribution: 300, attrs: { 道心: 3 } }, goto: 'ev_s_border_post_2' },
      },
      {
        label: '不烧，先派人去看', hint: '神识检定',
        roll: {
          p: 0.45, attrs: { 神识: 0.012 },
          success: { text: '是矿脉那边逃出来的矿工，两百多人，火把是他们的。你分了口粮，写了一份呈文。', effects: { contribution: 200, karma: 20, attrs: { 神识: 3 }, flag: { 矿工: true } } },
          fail: { text: '你派出去的人没回来。天亮时林子里立起了敌宗的旗，旗是新的。', effects: { hp: -30, contribution: -100 } },
        },
      },
      {
        label: '带人撤',
        outcome: { text: '你带六个人连夜退了三里。哨所空了。第二天宗门派人来查，问你为什么不烧信符。', effects: { contribution: -400, reputation: -40, demon: 6, flag: { 弃哨: true } } },
      },
    ],
  },
  {
    id: 'ev_s_mourning_stele', title: '英烈碑', pool: 'sect', tier: 2, weight: 6, minRealm: 1,
    require: 'char.sectId',
    text: '山门内的英烈碑一年刻一次名字，刻满就再立一块。今年新立的这块刻到一半停了——石匠说石头不够。\n\n碑上第一个名字你认得。上个月他还跟你借过火。',
    choices: [
      {
        label: '出灵石，把碑刻完', hint: '一百五十灵石',
        require: 'stones >= 150', requireHint: '灵石不足',
        cost: { stones: 150 },
        outcome: { text: '石匠连夜刻完，最后一行留了空。你问为什么，他说：「留着，明年用。」', effects: { contribution: 200, karma: 15, attrs: { 道心: 3 } } },
      },
      {
        label: '替死者上一炷香，念他的名字',
        outcome: { text: '你念了七个名字，念到第四个手抖了一下——你想不起他的脸了，只记得他借火时指甲缝里有泥。', effects: { attrs: { 道心: 5 }, demon: 4, karma: 10, flag: { 念过名: true } } },
      },
      {
        label: '自己上山采石', hint: '耗时一月',
        cost: { month: 1 },
        outcome: { text: '你在后山采了一个月石头，磨破三双手套。碑刻完了，你的名字没在上面。', effects: { contribution: 250, attrs: { 根骨: 2, 道心: 4 }, hp: -15 } },
      },
    ],
  },

  /* ───────────── 分支：边境哨所后续 ───────────── */
  {
    id: 'ev_s_border_post_2', title: '青烟', pool: 'branch', tier: 4, weight: 0, minRealm: 2,
    text: '烟是青的，援兵半个时辰内到。\n\n林子里的人也看见了。他们开始往山上走，走得不快，像不急。为首那个穿着和你一样的宗门袍，只是颜色淡一些，洗旧了。',
    choices: [
      {
        label: '守到援兵来', hint: '战斗 · 筑基修士',
        combat: {
          enemy: 'cultivator',
          win: { text: '你们把他堵在石阶上，弩箭钉住他的袖口。他抬头看了看烟，笑了：「早了一炷香。」援兵到时他还活着。', effects: { contribution: 500, exp: 300, attrs: { 根骨: 3 }, injury: 1 }, goto: 'ev_s_border_post_3' },
          lose: { text: '你们守到只剩三个人。石屋的门被撞开时，援兵的号角从山那边响起来。', effects: { hp: -60, injury: 3, contribution: 200 }, goto: 'ev_s_border_post_3' },
        },
      },
      {
        label: '开门谈判', hint: '魅力检定',
        roll: {
          p: 0.4, attrs: { 魅力: 0.014 },
          success: { text: '你一个人走到半山，和他站在雪里说了半个时辰。他退了兵，走前说：「矿脉我们不要了。你们那位执事，我认得。」', effects: { contribution: 700, attrs: { 魅力: 3, 道心: 4 }, flag: { 谈退敌兵: true }, exp: 300 }, goto: 'ev_s_border_post_3' },
          fail: { text: '他听你说完，抬手一刀。你躲开了要害，肩上的肉翻开一寸。门后的弩响了。', effects: { hp: -50, injury: 2, demon: 5 }, goto: 'ev_s_border_post_3' },
        },
      },
      {
        label: '一个人下山，在半路截他', hint: '赌命',
        roll: {
          p: 0.35, attrs: { 根骨: 0.014, 道心: 0.008 },
          success: { text: '你在石缝里等到了他。一刀，很短。他倒下去时抓住你的袖子，说：「你也是被派来的。」', effects: { contribution: 900, exp: 400, karma: -25, demon: 10, attrs: { 根骨: 4 }, flag: { 截杀敌首: true } }, goto: 'ev_s_border_post_3' },
          fail: { text: '他从你背后过来。你在雪里躺了很久，醒来时仗已经打完了。', effects: { hp: -80, injury: 4, demon: 8 }, goto: 'ev_s_border_post_3' },
        },
      },
    ],
  },
  {
    id: 'ev_s_border_post_3', title: '坑', pool: 'branch', tier: 4, weight: 0, minRealm: 2,
    text: '天亮。矿脉前那片坡地上躺着四十几个人，两边都有。援兵在收拾尸体，用绳子把同门的捆成一排，另一边的堆进坑里。\n\n执事拿着册子走过来，问你名字。',
    choices: [
      {
        label: '报名字，认功',
        outcome: { text: '他一笔一笔记下，写到你烧信符那一段时停了停，多添了两个字。册子合上，他拍了拍你的肩。', effects: { contribution: 800, reputation: 120, exp: 500, attrs: { 道心: -2 }, demon: 6, title: '守哨人' } },
      },
      {
        label: '说自己什么都没做',
        outcome: { text: '执事看了你一眼，笔停在半空，最后写下「在阵」。你在人群里站了很久，直到有人来收弩。', effects: { contribution: 100, attrs: { 道心: 5 }, demon: -5, karma: 10 } },
      },
      {
        label: '问他：坑里那些人叫什么', hint: '道心检定',
        roll: {
          p: 0.5, attrs: { 道心: 0.012 },
          success: { text: '他翻了两页：「不知道。他们宗里没报名字。」你把这句话记住了，比记住自己的功劳更牢。', effects: { attrs: { 道心: 4, 悟性: 2 }, demon: -3, flag: { 问过名字: true } } },
          fail: { text: '他合上册子：「不该问的别问。」然后一笔记下你的名字，后面画了个小小的圈。那个圈的意思是「留意」。', effects: { attrs: { 道心: 2 }, reputation: -15, demon: 3 } },
        },
      },
    ],
  },

  /* ───────────── 内景：闭关、梦、心魔 ───────────── */
  {
    id: 'ev_i_mirror_lake', title: '镜湖', pool: 'inner', tier: 1, weight: 8, minRealm: 0,
    text: '闭关第三日，你入了梦。梦里是一片没有边的湖，湖面很平，平得能照见天。\n\n你低头，湖里没有你的影子。湖底坐着一个人，正在吐纳，长得和你一模一样。',
    choices: [
      {
        label: '下水去，坐到他身边', hint: '道心检定',
        roll: {
          p: 0.5, attrs: { 道心: 0.012 },
          success: { text: '你在旁边坐下，两个人的呼吸慢慢合成一个。醒来时经脉宽了一线。', effects: { attrs: { 道心: 4, 悟性: 2 }, expPct: 0.1, demon: -4 } },
          fail: { text: '你一坐下，他就睁眼，把你按在水底。你在水里挣了很久才醒，嘴角有血。', effects: { hp: -35, demon: 8, attrs: { 道心: 1 } } },
        },
      },
      {
        label: '转身走开，不看他',
        outcome: { text: '你在湖边走到天亮。湖一直在那儿，很平。醒来后你觉得有点可惜，又说不清可惜什么。', effects: { attrs: { 道心: 3 }, demon: -2 } },
      },
      {
        label: '把石头扔进湖里',
        outcome: { text: '石头没有落水，停在水面上。湖里那个人抬起头，第一次开口：「别急。你还没到。」', effects: { attrs: { 悟性: 3 }, demon: 3, flag: { 镜湖: true } } },
      },
    ],
  },
  {
    id: 'ev_i_faceless_teacher', title: '无面之师', pool: 'inner', tier: 2, weight: 7, minRealm: 0,
    text: '梦里有个老人在教你吐纳，手按在你背上的位置很准，一句一句讲得很慢。\n\n你看不清他的脸，只有一团模糊的白。你问他叫什么，他说：「说了你就忘。」这样的梦已经第七夜了。',
    choices: [
      {
        label: '第八夜，主动入梦寻他', hint: '神识检定',
        roll: {
          p: 0.5, attrs: { 神识: 0.012 },
          success: { text: '你找到他的屋子，屋里只有一张空蒲团，和一本翻到一半的书。你把书看完，醒来时嘴里有墨味。', effects: { items: ['changchun_gong'], attrs: { 神识: 3, 悟性: 3 }, exp: 120 } },
          fail: { text: '你在梦里找不到路，走了一夜。醒来时天没亮，浑身是汗，背上那个位置还在发烫。', effects: { hp: -25, attrs: { 神识: 1 }, demon: 4 } },
        },
      },
      {
        label: '不再睡，靠打坐撑过去',
        cost: { hp: 30 },
        outcome: { text: '你撑了七天，眼睛红得像兔子。第八天终于睡着，梦里什么都没有了，安静得让人心慌。', effects: { attrs: { 道心: 4 }, demon: -3 } },
      },
      {
        label: '问他：我是不是见过你',
        outcome: { text: '他的手停了一下。「见过。」他说，「你出生那天我在门口站了一夜，没进去。」然后梦就散了。', effects: { attrs: { 道心: 5 }, demon: 4, flag: { 无面之师: true }, karma: 5 } },
      },
    ],
  },
  {
    id: 'ev_i_sea_whisper', title: '识海里的声音', pool: 'inner', tier: 2, weight: 7, minRealm: 0,
    require: 'demon >= 12',
    text: '识海里有声音，用你的语气，比你有耐心。\n\n它不劝你入魔，也不许你好处。它只是在你每次吐纳到最后一口气时，轻轻地说：「歇一歇吧。」你已经歇了三次。',
    choices: [
      {
        label: '不理，把那一口气吐完', hint: '道心检定',
        roll: {
          p: 0.5, attrs: { 道心: 0.014 },
          success: { text: '那口气吐出去，声音散了一半。你听见它有点意外地「哦」了一声。', effects: { demon: -8, attrs: { 道心: 3 }, exp: 80 } },
          fail: { text: '你歇了第四次。醒来时天黑了，经脉里堵着一团东西，吐不出来。', effects: { demon: 10, hp: -20, attrs: { 道心: 1 } } },
        },
      },
      {
        label: '跟它讲道理',
        outcome: { text: '你讲了半夜。它一直很认真地听，最后说：「你说得对。可是你还是想歇。」你发现自己无法反驳。', effects: { demon: 8, attrs: { 悟性: 3 } } },
      },
      {
        label: '喊它的名字', hint: '需在镜湖见过它',
        require: 'flag("镜湖")', requireHint: '你还不知道它叫什么',
        outcome: { text: '你喊：「你是湖底那个。」声音停了很久，然后笑了：「你记得。」它退了半步。第一次。', effects: { demon: -15, attrs: { 道心: 5, 神识: 2 }, flag: { 知心魔名: true } } },
      },
    ],
  },
  {
    id: 'ev_i_water_mirror', title: '照镜', pool: 'inner', tier: 3, weight: 5, minRealm: 1,
    require: 'demon >= 25',
    text: '你在水里照见自己。水面上的脸是对的，眼睛不对——它在看你的身后。\n\n你回头看，没有人。再看水面，它已经在笑了，嘴角比你高半分。你退后一步，水里的倒影没有退。',
    choices: [
      {
        label: '入识海，与它打一场', hint: '战斗 · 心魔',
        combat: {
          enemy: 'heart_demon',
          win: { text: '你把它按在识海的水底，它没有挣扎，只是笑着化开。你上岸时天亮了，身上没有伤。', effects: { demon: -25, attrs: { 道心: 8, 神识: 4 }, expPct: 0.2, title: '斩心魔' } },
          lose: { text: '它把你按在水底。你不知道过了多久。醒来时趴在地上，指甲抓破了三块砖。', effects: { demon: 15, hp: -40, attrs: { 道心: 1 } } },
        },
      },
      {
        label: '不看水，闭眼走开',
        outcome: { text: '你从此不在水边停留，洗脸都用布。它没再来，但你知道它还在。', effects: { demon: 5, attrs: { 道心: 2 } } },
      },
      {
        label: '冲水面吐一口血',
        cost: { hp: 25 },
        outcome: { text: '血散开，脸碎了，水面重归安静。你吐完这一口，觉得轻了一点，也说不上哪里轻。', effects: { demon: -10, attrs: { 道心: 3 } } },
      },
    ],
  },
  {
    id: 'ev_i_eave_rain', title: '檐雨', pool: 'inner', tier: 4, weight: 3, minRealm: 0, once: true,
    text: '雨下了七天。你坐在檐下听，听不出什么。\n\n第六天夜里，一滴水从瓦上落下来，落在石阶上，碎了。你看清它碎的方式。就那一瞬，有什么东西在你身体里对上了。',
    choices: [
      {
        label: '抓住，闭死关', hint: '耗时三月',
        cost: { month: 3 },
        outcome: { text: '三个月后你出关，境界稳了一整层。屋外的雨早已停了，石阶上还留着那一点湿。', effects: { expPct: 0.5, attrs: { 悟性: 6, 道心: 4 }, lifespan: 15, title: '听雨', flag: { 听雨: true } } },
      },
      {
        label: '不抓，继续听',
        outcome: { text: '你听到天亮。雨停时你什么也没得到，只觉得心里很干净。', effects: { attrs: { 道心: 8 }, demon: -12, flag: { 听雨: true } } },
      },
      {
        label: '把这滴水记下来，画在纸上',
        outcome: { text: '你画了四十张，都不像。第五十张像了。那张纸后来被人从你房里偷走。', effects: { attrs: { 悟性: 4 }, exp: 200, reputation: 10, flag: { 听雨: true } } },
      },
    ],
  },
  {
    id: 'ev_i_silence', title: '无声', pool: 'inner', tier: 3, weight: 4, minRealm: 2, once: true,
    text: '闭关到第九十日，你听不见了。\n\n不是聋——风还在吹，幡还在动，可声音没了。你连自己的心跳都听不见。你坐在那里，第一次觉得「静」是一个有重量的东西。',
    choices: [
      {
        label: '坐到底，看会怎样', hint: '道心检定',
        roll: {
          p: 0.45, attrs: { 道心: 0.014, 悟性: 0.008 },
          success: { text: '第十四日，声音一起回来了，像很多人同时开口。你被冲得吐了一口血，但神识大进。', effects: { attrs: { 神识: 8, 道心: 5 }, expPct: 0.25, hp: -30 } },
          fail: { text: '声音一直没回来。出关后你靠读唇接人说话，宗门里开始有人叫你哑师兄。', effects: { demon: 10, attrs: { 神识: 2 }, flag: { 失聪: true } } },
        },
      },
      {
        label: '提前出关',
        outcome: { text: '你推开门，声音一下子全回来了，太响。你蹲在门口捂了很久耳朵。', effects: { attrs: { 道心: 3 }, demon: -2 } },
      },
    ],
  },
  {
    id: 'ev_i_family_letter', title: '家书', pool: 'inner', tier: 1, weight: 8, minRealm: 0,
    require: 'age >= 30',
    text: '入定时，一封没写完的家书浮上来：\n\n「娘，我在山上很好，饭吃得饱，师父待我——」\n\n后面没有了。你记得那天你在等一个答案，等到墨干了，就没再写。',
    choices: [
      {
        label: '在识海里把它写完',
        outcome: { text: '你写了十七遍，最后一遍只写了四个字：我回不去。写完后心里空了一块，也稳了一块。', effects: { attrs: { 道心: 4 }, demon: -6, karma: 10 } },
      },
      {
        label: '把它烧了',
        outcome: { text: '纸在识海里烧得很慢，字一个一个消失。最后一个字是「待」，烧得很久。', effects: { demon: 4, attrs: { 悟性: 1 } } },
      },
      {
        label: '醒来真的写一封，托人带下山', hint: '二十灵石',
        cost: { stones: 20 },
        outcome: { text: '半年后有人带回一句话：「村里没人姓这个了。」你把回信烧在山上，风把灰吹得很高。', effects: { attrs: { 道心: 3 }, demon: 5, flag: { 寄过家书: true } } },
      },
    ],
  },
  {
    id: 'ev_i_master_grave', title: '师父的坟', pool: 'inner', tier: 2, weight: 6, minRealm: 1,
    require: 'age >= 45',
    text: '你在梦里走到一座坟前。碑上没有名字，只有一道剑痕。\n\n坟前放着一壶酒，酒还温的，四周没有人。你忽然想起：教你的那个人，你从来没问过他叫什么。',
    choices: [
      {
        label: '跪下磕头',
        outcome: { text: '磕到第三个，你听见背后有人说：「够了。」回头没有人。醒来时枕头是湿的。', effects: { attrs: { 道心: 6 }, demon: -8, karma: 15 } },
      },
      {
        label: '把酒喝了',
        outcome: { text: '酒很烈，喝到最后一滴，你尝出里面掺了血。「徒弟的酒，我尝过。」一个声音说。', effects: { attrs: { 道心: 3, 根骨: 2 }, demon: 2, flag: { 喝过师父的酒: true } } },
      },
      {
        label: '在碑上补一个名字', hint: '悟性检定',
        roll: {
          p: 0.4, attrs: { 悟性: 0.012 },
          success: { text: '你刻了三个字，刻完发现那三个字是你自己的名字。', effects: { attrs: { 悟性: 5, 道心: 3 }, expPct: 0.15, demon: 6, flag: { 碑上名: true } } },
          fail: { text: '刻刀一落，碑碎了。碎土里什么也没有，连那壶酒也不见了。', effects: { hp: -20, demon: 8 } },
        },
      },
    ],
  },
  {
    id: 'ev_i_scale', title: '鳞', pool: 'inner', tier: 2, weight: 6, minRealm: 1,
    text: '洗澡时你摸到后腰有一片硬的东西。低头看，是鳞，三片，青灰色，贴着骨头长。\n\n你抠了一下，疼，连着筋。铜盆里的水照出你的背，那三片在灯下泛着冷光，像鱼身上那种，不像人。',
    choices: [
      {
        label: '让它长，继续修',
        outcome: { text: '半年后长到十七片，摸上去是凉的。你再也不在人前脱衣服。', effects: { attrs: { 根骨: 4 }, demon: 5, flag: { 生鳞: true } } },
      },
      {
        label: '用刀削掉',
        cost: { hp: 30 },
        outcome: { text: '削了一个时辰，血把盆染红了。三个月后又长出来，多了一片。', effects: { attrs: { 根骨: 2 }, demon: 3 } },
      },
      {
        label: '去查旧书', hint: '需内门以上',
        require: 'char.sectRank >= 1', requireHint: '外门不许上三层',
        outcome: { text: '找到一行小字：「鳞生者，非人非妖，古称半蜕。」后面被撕掉了，撕口很新。', effects: { attrs: { 悟性: 4, 神识: 2 }, exp: 150, flag: { 半蜕: true } } },
      },
    ],
  },
  {
    id: 'ev_i_blood_color', title: '血的颜色', pool: 'inner', tier: 2, weight: 6, minRealm: 1,
    text: '练剑划破手指，血滴在雪上。\n\n不是红的，是淡金色，落在雪里像一小片油。你把手翻过来看，掌纹也淡了。雪还在下，你把那只手缩进袖子，袖子里也凉。',
    choices: [
      {
        label: '再划一刀，看仔细',
        cost: { hp: 15 },
        outcome: { text: '第二滴还是金色，第三滴开始发亮。你盯着看，忽然觉得那不像血，像什么东西在你身体里被慢慢榨出来。', effects: { attrs: { 悟性: 3 }, demon: 6 } },
      },
      {
        label: '用雪盖上，回房',
        outcome: { text: '你踩平那片雪。当晚打坐，灵气比往常顺，顺得有点不像自己的。', effects: { attrs: { 道心: 2 }, exp: 80 } },
      },
      {
        label: '把血收进小瓶，拿去问人',
        outcome: { text: '丹房的老丹师看了很久，把瓶塞回去：「别让人看见。」他压低声音，「上一个这样的，被宗门请去做客，再没回来。」', effects: { attrs: { 神识: 2 }, demon: 4, flag: { 金血: true } } },
      },
    ],
  },
  {
    id: 'ev_i_no_sleep', title: '不必睡', pool: 'inner', tier: 2, weight: 6, minRealm: 2,
    text: '你已经四十一天没睡了。\n\n不困。夜里别人都睡了，你坐在窗边，能听见三里外一只耗子过梁。时间变得很长，长到一天像一年。',
    choices: [
      {
        label: '把夜里的时间都用来修炼',
        outcome: { text: '四十一天，抵得上别人一年。代价是你开始记不住白天说过的话。', effects: { expPct: 0.3, attrs: { 悟性: 2 }, demon: 6 } },
      },
      {
        label: '逼自己睡', hint: '道心检定',
        roll: {
          p: 0.5, attrs: { 道心: 0.012 },
          success: { text: '你躺了三个时辰，睡着半炷香。梦里有一片很亮的白。醒来时觉得够了。', effects: { attrs: { 道心: 3 }, demon: -6 } },
          fail: { text: '你躺着，睁眼到天亮。窗外的天一点一点变白，你觉得那个过程很难看。', effects: { demon: 8, attrs: { 神识: 1 } } },
        },
      },
      {
        label: '出去走走，看看夜里的宗门',
        outcome: { text: '你绕山门走了一圈。演武场上有个人在练剑，是执事。他练最基础的起手式，练了三十年。他没看见你。', effects: { attrs: { 道心: 4, 悟性: 1 }, demon: -3 } },
      },
    ],
  },
  {
    id: 'ev_i_why_long_life', title: '为何长生', pool: 'inner', tier: 3, weight: 5, minRealm: 1,
    require: 'age >= 50',
    text: '你忽然问自己：我要长生做什么？\n\n这个问题一落，灵气就散了。你坐在蒲团上出了一身冷汗，手指发麻。窗外有人在砍柴，一声一声，很规律。',
    choices: [
      {
        label: '老实想，想到答案为止', hint: '道心检定',
        roll: {
          p: 0.5, attrs: { 道心: 0.012, 悟性: 0.009 },
          success: { text: '想到第三天，答案出来了：我怕。不是怕死，是怕那个什么都没有的地方。你承认了，灵气就顺了。', effects: { attrs: { 道心: 9 }, expPct: 0.2, demon: -10, flag: { 问过长生: true } } },
          fail: { text: '你想到第七天，什么都没想出来。灵气逆行，你吐了一口血，把蒲团染红一片。', effects: { hp: -45, demon: 12, attrs: { 道心: 1 } } },
        },
      },
      {
        label: '不想，去砍柴',
        outcome: { text: '你借了把柴刀砍了一下午，手磨破了，晚上睡得很沉。第二天问题还在，但没那么响了。', effects: { attrs: { 道心: 4 }, demon: -4, hp: -10 } },
      },
      {
        label: '给自己编一个答案',
        outcome: { text: '「为了看更远的地方。」你把这句念了三遍，灵气顺了。但它顺得很勉强，像一扇关不严的门。', effects: { attrs: { 道心: 2 }, exp: 120, demon: 2 } },
      },
    ],
  },
  {
    id: 'ev_i_count_the_dead', title: '数一数', pool: 'inner', tier: 3, weight: 5, minRealm: 2,
    require: 'karma <= -20',
    text: '闭关时，你开始数自己杀过的人。\n\n第一个是山道上的劫匪，你还记得他的刀柄缠着红布。第二个想不起来了。数到第十七个，脸都没了，只剩一堆姿势。数到第三十个，你数不下去。',
    choices: [
      {
        label: '数完', hint: '道心检定',
        roll: {
          p: 0.45, attrs: { 道心: 0.012 },
          success: { text: '你数到第四十一个，然后一个一个把名字想回来。想不回来的，你替他起了个名字。那夜你睡得很好。', effects: { attrs: { 道心: 7, 神识: 3 }, demon: -15, karma: 15 } },
          fail: { text: '你数到第五十个，识海里全是人脸，都在说话。你抱着头蹲在地上，天亮才停。', effects: { demon: 18, hp: -30, attrs: { 神识: 2 } } },
        },
      },
      {
        label: '不数了，把它们压下去',
        outcome: { text: '你把念头按进丹田下面。它在那儿了，很沉，压着你的呼吸。', effects: { demon: 8, attrs: { 道心: 2 } } },
      },
      {
        label: '为他们念一段往生咒', hint: '需内门以上',
        require: 'char.sectRank >= 1',
        outcome: { text: '你不会念，只记住一句。念到天亮，嗓子哑了。有没有用，你不知道。', effects: { karma: 25, attrs: { 道心: 4 }, demon: -8 } },
      },
    ],
  },
  {
    id: 'ev_i_qi_tide', title: '灵气潮', pool: 'inner', tier: 3, weight: 5, minRealm: 1,
    text: '子时，山里的灵气忽然涨了，像海。\n\n你坐在闭关室里，灵气从四面八方挤进来，挤得肋骨发响。这个时辰宗门的老人都知道不该修炼，但没人说过为什么。',
    choices: [
      {
        label: '开大周天，硬吞', hint: '根骨检定',
        roll: {
          p: 0.45, attrs: { 根骨: 0.012, 道心: 0.008 },
          success: { text: '你吞了半个时辰，经脉胀得发亮。潮退时境界跳了一线，鼻血流了一脸。', effects: { expPct: 0.35, attrs: { 根骨: 4 }, hp: -30, flag: { 吞潮: true } } },
          fail: { text: '灵气太猛，十二条经脉断了三条。你在床上躺两个月，境界还退了一层。', effects: { hp: -70, injury: 3, attrs: { 根骨: -2 } } },
        },
      },
      {
        label: '收功，等潮退',
        outcome: { text: '你收了功，坐在黑暗里听。潮声里有很多细小的声音，像有人在很远的地方喊。', effects: { attrs: { 道心: 4 }, demon: -5, exp: 60 } },
      },
      {
        label: '出门看',
        outcome: { text: '山道上站着十几个人，都不说话，都仰着头。天上没有月亮，云在往上走。', effects: { attrs: { 神识: 3 }, exp: 80, flag: { 看潮: true } } },
      },
    ],
  },
  {
    id: 'ev_i_dantian_eye', title: '丹田里的眼', pool: 'inner', tier: 4, weight: 3, minRealm: 3, once: true,
    text: '内视时，你看见丹田里睁开了一只眼。\n\n它不看你，它看你身后。你转动内视的角度，它也跟着转，始终朝着同一个方向——北方。你试着闭上它，闭不上。',
    choices: [
      {
        label: '顺着它的方向看', hint: '神识检定',
        roll: {
          p: 0.4, attrs: { 神识: 0.014 },
          success: { text: '你看见一片很远的雪原，雪原上有一座塔，塔上有一盏灯。灯下坐着一个人，也正朝你这边看。', effects: { attrs: { 神识: 10, 悟性: 4 }, expPct: 0.3, demon: 8, flag: { 北方有人: true } } },
          fail: { text: '那只眼忽然反过来看你。你被看得浑身发冷，从内视里跌出来，吐了一地。', effects: { hp: -50, demon: 15 } },
        },
      },
      {
        label: '用灵力把它糊住',
        cost: { mp: 40 },
        outcome: { text: '你糊了三层灵力，它还在下面眨。你不看它了，它也就不看了。', effects: { attrs: { 道心: 3 }, demon: 3 } },
      },
      {
        label: '不管它，继续修',
        outcome: { text: '三个月后它自己闭上了。闭之前，它转向了你，看了你一眼。', effects: { attrs: { 道心: 5 }, expPct: 0.1, demon: 4 } },
      },
    ],
  },
  {
    id: 'ev_i_memory_gap', title: '缺口', pool: 'inner', tier: 3, weight: 5, minRealm: 1,
    require: 'demon >= 15',
    text: '你发现自己的记忆有个缺口。\n\n去年秋天，三个月空白。同门说你那三个月一直在闭关，可你左肋有一道刀伤——闭关不会有刀伤。疤很新。',
    choices: [
      {
        label: '去查那三个月', hint: '神识检定',
        roll: {
          p: 0.45, attrs: { 神识: 0.012 },
          success: { text: '你查到一份任务记录：你被派去了一趟北荒，回来时是别人背回来的。任务内容那栏被人涂掉了，墨还很新。', effects: { attrs: { 神识: 4 }, exp: 150, demon: 8, flag: { 北荒任务: true } } },
          fail: { text: '你一查，头就疼，疼到跪下。有人在你耳边说：「别查。」声音很像你自己。', effects: { hp: -35, demon: 12, attrs: { 道心: 1 } } },
        },
      },
      {
        label: '不查，把疤当成闭关的意外',
        outcome: { text: '你给自己编了个理由：走火时撞在石壁上。编得很圆。此后你再没想起那三个月。', effects: { attrs: { 道心: 3 }, demon: 6, karma: -5 } },
      },
      {
        label: '割开疤，看里面是什么',
        cost: { hp: 40 },
        outcome: { text: '疤下面不是肉，是一小片黑色、很硬的东西，像鳞，也像字。你把它挖出来，它在手心里化了。', effects: { injury: 1, attrs: { 神识: 3 }, demon: 10, flag: { 疤下物: true } } },
      },
    ],
  },
  {
    id: 'ev_i_stone_door', title: '门', pool: 'inner', tier: 5, weight: 2, minRealm: 4, once: true,
    text: '入定到极深处，你站在一扇门前。\n\n门是石头的，没有缝，也没有把手。门上刻着一行字，你认得每一个字，连起来却读不懂。你已经在门前站了很久，不记得自己是什么时候进来的。',
    choices: [
      {
        label: '推', hint: '道心检定',
        roll: {
          p: 0.35, attrs: { 道心: 0.014, 根骨: 0.008 },
          success: { text: '门开了半寸。里面没有光，也没有黑。你听见自己的名字被念了一遍，用一个很老的声音。然后门自己合上了。', effects: { attrs: { 道心: 10, 悟性: 6 }, expPct: 0.6, lifespan: 40, title: '叩门者', flag: { 叩门: true } } },
          fail: { text: '你推不动，用了全部修为去推，门纹丝不动，你的经脉先裂了。', effects: { hp: -70, injury: 3, demon: 12 } },
        },
      },
      {
        label: '在门上刻自己的名字',
        outcome: { text: '你刻完最后一笔，字渗进去了，门还是没开。你退后一步，看见门上密密麻麻全是名字，有的已被磨平。', effects: { attrs: { 道心: 5 }, demon: 5, flag: { 门上刻名: true } } },
      },
      {
        label: '转身回去',
        outcome: { text: '你转身，门就在身后消失了。醒来时你在蒲团上，膝盖麻了。你不知道那扇门在哪一层。', effects: { attrs: { 道心: 6 }, demon: -6 } },
      },
    ],
  },
  {
    id: 'ev_i_see_own_death', title: '看见自己的死', pool: 'inner', tier: 4, weight: 3, minRealm: 3,
    require: 'age >= 60',
    text: '这次不是梦。打坐时你清清楚楚地「看见」了自己死的那一天。\n\n地点是一座山顶，天气很好，身边没有人。你死得很安静，像睡着。年份看不清，但那个山顶你认得——就是宗门后山。',
    choices: [
      {
        label: '记下来，等那一天',
        outcome: { text: '你开始每年去一次后山山顶，站着看日落。去了十一次，什么也没发生。第十二次你没去。', effects: { attrs: { 道心: 6 }, lifespan: 10, demon: 2, flag: { 见过死期: true } } },
      },
      {
        label: '想办法改它', hint: '悟性检定',
        roll: {
          p: 0.4, attrs: { 悟性: 0.012, 道心: 0.01 },
          success: { text: '你用三年把山顶削平了。那个画面里的山顶没有了。你不知道这算不算改成了。', effects: { attrs: { 悟性: 5, 道心: 4 }, expPct: 0.2, lifespan: 25, flag: { 削山: true } } },
          fail: { text: '你越改，那画面越清楚。最后一次看见时，山顶上多了一个人，背对着你，穿着你的衣服。', effects: { demon: 14, attrs: { 道心: 2 } } },
        },
      },
      {
        label: '不管，该死就死',
        outcome: { text: '你把这个画面放下，继续修炼。此后它每年自己来一次，像走亲戚。', effects: { attrs: { 道心: 8 }, demon: -8, karma: 10 } },
      },
    ],
  },
];
