/**
 * 宗门深度线、六大常驻羁绊人物线、终局悟法与斩三尸扩展包（36 节点）。
 * - 十三宗门（正 / 中 / 邪 / 散修）核心奇遇与多段剧情
 * - 六大常驻人物：苏晚晴、陆沉舟、药尘子、顾青衣、血煞老祖、林昊
 * - 化神悟法、炼虚合道、合体证道、大乘斩三尸（善尸 / 恶尸 / 执念尸）
 */
export const SECT_DEEP_EXPANSION = [
  /* ========================================================================
   * 第一篇 · 十三宗门深度线（pool: 'sect' + 'branch'，共 17 节点）
   * ======================================================================== */

  /* ───────────── 1. 太玄剑宗（两段式） ───────────── */
  {
    id: 'sd_taixuan_1', title: '太玄 · 剑冢古剑', pool: 'sect', tier: 4, weight: 7, minRealm: 1,
    require: 'char.sectId === "taixuan"',
    once: true,
    text: '秋夜值守剑冢深处，万柄铁剑忽然齐声低鸣。荒草尽头，一柄半截没入青石的无鞘古剑微微震颤，剑脊霜纹似在呼吸。\n\n守冢石碑刻着旧训：「凡古剑自鸣者，三百年不出其一，择主则生，逆锋则折。」风卷落叶，剑意正朝你眉心缓缓压来。',
    choices: [
      {
        label: '徒手按上剑柄，任剑意入脉', hint: '根骨与道心检定 · 古剑认主',
        cost: { month: 1 },
        roll: {
          p: 0.55, attrs: { 根骨: 0.012, 道心: 0.01 },
          success: {
            text: '寒意顺着掌心直贯丹田，青石应声裂作两半。古剑发出一声清越龙吟，主动脱石而起，落入你掌中。雾深处，一道白衣身影正提灯走来。',
            effects: { items: ['qingfeng_jian'], attrs: { 根骨: 4, 道心: 3 }, contribution: 180, flag: { 古剑认主: true }, counter: { sect_deep: 1 } },
            goto: 'sd_taixuan_2',
          },
          fail: {
            text: '剑意如秋霜割脉，你虎口崩血，被震退七步。古剑重归沉寂，剑鸣却惊动了后山巡夜的剑宗长老。',
            effects: { hp: -45, attrs: { 根骨: 2 }, counter: { sect_deep: 1 } },
            goto: 'sd_taixuan_2',
          },
        },
      },
      {
        label: '拔出佩剑，与古剑隔空对锋', hint: '战斗 · 剑魂虚影',
        cost: { month: 1 },
        combat: {
          enemy: 'sword_phantom',
          win: {
            text: '三尺剑光劈碎残影，古剑低鸣一声，向你微微倾身。山道尽头，剑宗长老负手停步，目光落在你尚未归鞘的剑尖上。',
            effects: { expPct: 0.25, attrs: { 根骨: 5 }, contribution: 240, reputation: 35, flag: { 古剑认主: true }, counter: { sect_deep: 1 } },
            goto: 'sd_taixuan_2',
          },
          lose: {
            text: '残影一剑挑飞你的佩剑，剑气削落半截衣袖。古剑寒光敛去，只留青石上一道极深的剑痕。',
            effects: { hp: -55, injury: 1, attrs: { 悟性: 2 } },
          },
        },
      },
      {
        label: '肃立三拜，不扰古剑清眠', hint: '守礼 · 道心稳固',
        outcome: {
          text: '你敛息退回石碑之外。万剑之鸣渐渐平息，夜雾里只剩松涛声。你觉出丹田剑气比往日沉静了几分。',
          effects: { attrs: { 道心: 4 }, demon: -6, contribution: 80 },
        },
      },
    ],
  },
  {
    id: 'sd_taixuan_2', title: '太玄 · 问剑峰论剑', pool: 'branch', tier: 4, weight: 0,
    text: (s) => `长老提着一盏旧灯坐上断崖青石，灯火映出他鬓边如雪的白发。\n\n${s.flags['古剑认主'] ? '他扫了一眼你腰间新得的古剑，神色微松：「三百年了，它总算肯再出石。」' : '他望着沉寂的剑冢叹了口气：「锋芒太急，未必能走远。」'}\n\n「坐吧。今日不考招式，只问一桩——剑是器，还是道？」`,
    choices: [
      {
        label: '「剑本死铁，唯执剑之人有道」', hint: '重本心 · 悟性道心大进',
        cost: { month: 2 },
        outcome: {
          text: '长老枯坐半晌，伸指在青石上刻下三道极淡的剑痕：「既如此，莫让剑替你做主。」那一夜你们论剑至天明，你悟透半卷无剑真意。',
          effects: { items: ['wujian_jue'], attrs: { 悟性: 5, 道心: 5 }, expPct: 0.3, contribution: 260, flag: { 问剑论道: true } },
        },
      },
      {
        label: '「人寿有尽，剑意长存，愿以身养剑」', hint: '纯粹剑修 · 根骨与法则感悟',
        cost: { month: 2 },
        outcome: {
          text: '长老眼中亮起一瞬极锐的光：「好一个以身养剑。」他袖手一挥，将半片珍藏的太古剑意残纹打入你识海。',
          effects: { items: ['faze_canpian'], attrs: { 根骨: 6, 神识: 3 }, expPct: 0.25, contribution: 220, title: '剑冢听锋', flag: { 问剑论道: true } },
        },
      },
      {
        label: '请长老递一剑，以剑代答', hint: '以战论道 · 需根骨 ≥ 18',
        require: 'char.attrs.根骨 >= 18', requireHint: '根骨不足十八，接不住长老一剑',
        combat: {
          enemy: 'jindan_elder',
          win: {
            text: '灯火摇曳而未灭。你硬接他压境三剑，剑脊震得虎口发麻。长老收指微笑：「太玄后继有人。」',
            effects: { expPct: 0.4, contribution: 420, reputation: 60, attrs: { 根骨: 5, 悟性: 4 }, flag: { 问剑论道: true } },
          },
          lose: {
            text: '一缕指风点散你的剑势，你单膝点地。长老扶你起身：「破绽在第三息，回去再练三年。」',
            effects: { hp: -35, attrs: { 悟性: 4 }, contribution: 120 },
          },
        },
      },
    ],
  },

  /* ───────────── 2. 青云门（两段式） ───────────── */
  {
    id: 'sd_qingyun_1', title: '青云 · 七峰会武', pool: 'sect', tier: 3, weight: 7, minRealm: 1,
    require: 'char.sectId === "qingyun"',
    once: true,
    text: '六十年一度的七峰会武于通天峰云海开台。七座主峰各出一名真传，白玉擂台悬在云雾之上，钟声传出百里。\n\n轮到你登台时，对面落霞峰的师兄已连胜三场，水蓝色剑幕如潮水铺开，台下长老正拭目以待。',
    choices: [
      {
        label: '直入剑幕，以力破巧', hint: '战斗 · 落霞峰剑首',
        cost: { month: 1 },
        combat: {
          enemy: 'jindan_elder',
          win: {
            text: '你踏破三重水幕，剑背轻敲对方肩头。云海之上静了一息，随即掌声如雷。掌门亲赐一枚青玉令，准你入藏经阁禁层一日。',
            effects: { contribution: 360, reputation: 55, expPct: 0.25, flag: { 七峰魁首: true }, counter: { arena_win: 1, sect_deep: 1 } },
            goto: 'sd_qingyun_2',
          },
          lose: {
            text: '水幕连绵不绝，你灵力耗尽，退至台边抱拳认负。掌门见你进退有度，仍许你随长老观摩藏经阁禁层外廊。',
            effects: { hp: -40, attrs: { 道心: 3 }, contribution: 120, counter: { sect_deep: 1 } },
            goto: 'sd_qingyun_2',
          },
        },
      },
      {
        label: '守定中宫，寻其气机换息之隙', hint: '悟性/神识检定 · 以静制动',
        cost: { month: 1 },
        roll: {
          p: 0.55, attrs: { 悟性: 0.012, 神识: 0.01 },
          success: {
            text: '你接他二十七剑不退半步，待其剑势将老，反手一指点散灵潮。台下长老抚须赞道：「深得青云静字诀。」掌门将禁层玉令交入你手。',
            effects: { contribution: 320, reputation: 45, attrs: { 悟性: 4, 道心: 3 }, flag: { 七峰魁首: true }, counter: { arena_win: 1, sect_deep: 1 } },
            goto: 'sd_qingyun_2',
          },
          fail: {
            text: '你算差半息，衣袖被剑气撕裂。虽惜败半招，落霞峰师兄却诚心拱手，邀你同赴藏经阁换书印证。',
            effects: { hp: -25, attrs: { 悟性: 2 }, contribution: 140, counter: { sect_deep: 1 } },
            goto: 'sd_qingyun_2',
          },
        },
      },
      {
        label: '台下观战记剑谱，不争虚名', hint: '稳妥 · 增悟性与道心',
        outcome: {
          text: '你在石栏外看完了七峰二十一场比试，回到洞府提笔默出十三套变招，虽无赏赐，胸中气象却宽了一截。',
          effects: { attrs: { 悟性: 4, 道心: 3 }, expPct: 0.15 },
        },
      },
    ],
  },
  {
    id: 'sd_qingyun_2', title: '青云 · 藏经阁禁层', pool: 'branch', tier: 4, weight: 0,
    text: (s) => `藏经阁第七层终年不燃灯烛，唯有玉简自身泛着微冷青光。${s.flags['七峰魁首'] ? '守阁长老验过你的青玉令，退到门外合上了铜锁。' : '守阁长老只允你在外案停留一炷香，目光片刻未离。'}\n\n檀木暗格里静静摆着两卷秘典：一卷是青云历代掌门手批的《青云清心录》，另一卷却以黑绳缠了七道，隐隐透出凛冽杀伐之气。`,
    choices: [
      {
        label: '静读《青云清心录》正统真传', hint: '稳固根基 · 得功法与丹药',
        cost: { month: 2 },
        outcome: {
          text: '你逐字读完三百年前祖师留在页眉的批注，方知青云门规「不可负友」背后藏着一段血泪旧案。合卷时，心境澄明如洗。',
          effects: { items: ['changchun_gong', 'qingxin_dan'], attrs: { 道心: 6, 悟性: 4 }, demon: -12, contribution: 150, flag: { 青云禁层: true } },
        },
      },
      {
        label: '解开黑绳，窥探禁卷残篇', hint: '高回报带心魔 · 需曾夺魁或神识 ≥ 22',
        require: 'flag("七峰魁首") || char.attrs.神识 >= 22', requireHint: '未得禁层深处许可，神识亦不足',
        roll: {
          p: 0.6, attrs: { 神识: 0.012, 道心: 0.008 },
          success: {
            text: '原是昔年青云叛徒留下的逆脉杀诀，被祖师封存于此以作警示。你去其戾气，取其运灵巧思，修为大进。',
            effects: { items: ['jiuzhuan_gong'], expPct: 0.4, attrs: { 悟性: 5, 神识: 4 }, demon: 8, flag: { 青云禁层: true } },
          },
          fail: {
            text: '黑绳甫断，卷中残存杀意直冲识海。你强咬舌尖退出暗格，冷汗湿透中衣，却也看清了几分正邪之界。',
            effects: { hp: -40, demon: 14, attrs: { 神识: 3 } },
          },
        },
      },
      {
        label: '重系黑绳，将禁卷隐患禀告掌门', hint: '恪守门规 · 声望与贡献',
        outcome: {
          text: '掌门听罢沉默良久，亲自上七层补了三道封灵符，赏你一瓶结金灵丹，言道：「青云缺的从不是奇才，是肯守门的人。」',
          effects: { items: ['jiejin_dan'], contribution: 300, reputation: 40, karma: 20, attrs: { 道心: 4 } },
        },
      },
    ],
  },

  /* ───────────── 3. 丹霞谷（两段式） ───────────── */
  {
    id: 'sd_danxia_1', title: '丹霞 · 九转炼丹大典', pool: 'sect', tier: 4, weight: 7, minRealm: 1,
    require: 'char.sectId === "danxia"',
    once: true,
    text: '丹霞谷三十年一开地肺赤炎，谷主亲自主持九转炼丹大典。百草园中九座铜炉齐鸣，药香凝成红云压在谷口。\n\n第七转火候将成之际，西侧地火脉骤然翻出墨绿毒烟，炉盖剧震——有人趁大典暗改了引火阵纹！',
    choices: [
      {
        label: '以灵力稳住主炉火候，先保丹胎', hint: '悟性检定 · 护住九转丹胚',
        cost: { mp: 30, month: 1 },
        roll: {
          p: 0.55, attrs: { 悟性: 0.012, 神识: 0.01 },
          success: {
            text: '你指尖连点七处火窍，硬生生将逆冲的毒烟逼出炉外。丹胎无恙，一道披黑袍的枯瘦人影却自烟雾中现身，直扑丹台！',
            effects: { contribution: 240, attrs: { 悟性: 4 }, flag: { 护稳丹炉: true }, counter: { alchemy: 2, sect_deep: 1 } },
            goto: 'sd_danxia_2',
          },
          fail: {
            text: '地火反噬灼伤你的双掌，主炉裂开一道细缝。烟尘未散，黑袍丹魔已冷笑着伸手抓向炉心！',
            effects: { hp: -45, attrs: { 悟性: 2 }, counter: { sect_deep: 1 } },
            goto: 'sd_danxia_2',
          },
        },
      },
      {
        label: '循毒烟逆追暗阵源头', hint: '直截丹魔后路',
        cost: { month: 1 },
        outcome: {
          text: '你弃炉跃入赤炎暗渠，一脚踹碎藏在石缝里的蚀灵毒石。渠口寒风一卷，丹魔被迫现出真身，阴冷双目死死锁住了你。',
          effects: { attrs: { 神识: 3 }, flag: { 识破毒阵: true }, counter: { sect_deep: 1 } },
          goto: 'sd_danxia_2',
        },
      },
      {
        label: '高声示警，疏散外门药童', hint: '保全同门 · 业力与声望',
        outcome: {
          text: '你吹响谷中铜哨，引着数十名低阶药童退往避毒亭。待长老赶来驱散黑烟，主炉已毁去大半，但谷中无一人中毒。',
          effects: { karma: 25, reputation: 35, contribution: 160, items: ['dahuan_dan'] },
        },
      },
    ],
  },
  {
    id: 'sd_danxia_2', title: '丹霞 · 丹魔夺炉', pool: 'branch', tier: 4, weight: 0,
    text: (s) => `黑袍丹魔袖中垂出九条青铜药链，笑声嘶哑：「丹霞谷守着这口三百年的老炉，却只配炼些延寿的庸丹！」\n\n${s.flags['护稳丹炉'] ? '主炉金光正盛，九转成丹只在呼吸之间。' : '毒烟仍在谷中弥漫，炉火明灭不定。'}谷主正被另两名魔修牵制，丹台前唯有你一人挡路。`,
    choices: [
      {
        label: '挺身死守丹台，力战丹魔', hint: '战斗 · 邪道丹魔',
        combat: {
          enemy: 'blood_cult',
          win: {
            text: '药链寸断，丹魔吐血遁入山雾。炉盖轰然冲天，九枚赤金丹药落入玉盘。谷主大笑，当众赠你一枚九转金丹与千年灵草。',
            effects: { items: ['jiuzhuan_dan', 'qiannian_lingcao'], contribution: 400, reputation: 65, karma: 20, attrs: { 悟性: 4 }, flag: { 丹霞平魔: true } },
          },
          lose: {
            text: '毒雾封住你的喉舌，你被药链扫飞出石台。幸而执法长老及时赶到击退丹魔，只丢了半炉残丹。',
            effects: { hp: -65, injury: 2, contribution: 100, items: ['liaoshang_dan'] },
          },
        },
      },
      {
        label: '以生克药理反投寒草，化其毒烟为丹引', hint: '需悟性 ≥ 20 或 识破毒阵',
        require: 'char.attrs.悟性 >= 20 || flag("识破毒阵")', requireHint: '药理火候不足，恐弄巧成拙',
        outcome: {
          text: '你抓起案头三株寒髓草投入地火，墨绿毒烟遇寒反凝，竟被九转铜炉倒吸回去！丹魔大惊失色，反受毒烟反噬遁走。炉中竟凝成一枚罕见的阴阳大还丹。',
          effects: { items: ['dahuan_dan', 'qiannian_lingcao'], expPct: 0.3, contribution: 380, reputation: 60, attrs: { 悟性: 6 }, flag: { 丹霞平魔: true } },
        },
      },
      {
        label: '弃炉炸火，迫退丹魔以保性命', hint: '壮士断腕 · 无伤脱身',
        outcome: {
          text: '你反手震碎火阀，赤炎冲天十丈。丹魔不敢硬接，怒骂一声退去。铜炉虽裂，总算没落入魔道之手。',
          effects: { contribution: 120, reputation: 15, attrs: { 道心: 2 } },
        },
      },
    ],
  },

  /* ───────────── 4. 天音寺 ───────────── */
  {
    id: 'sd_tianyin_1', title: '天音 · 梵钟镇魔与舍利问心', pool: 'sect', tier: 4, weight: 7, minRealm: 2,
    require: 'char.sectId === "tianyin"',
    once: true,
    text: '子夜大雷，梵钟崖下镇压了六百年的黑魔窟裂开一道石缝，漆黑怨气卷着铁链声漫上山阶。\n\n大殿中那口无佛古钟无风自响，钟顶悬出一枚温润的古佛舍利。老僧闭目合十：「魔出窟，心先动。{name}，你欲以力伏魔，还是以心印佛？」',
    choices: [
      {
        label: '提禅杖独入魔窟，镇压裂隙妖将', hint: '战斗 · 窟中魔将',
        cost: { month: 1 },
        combat: {
          enemy: 'demon_general',
          win: {
            text: '钟声随你步步压入地底，魔将咆哮着退回漆黑石缝。你以金印重封崖壁，出窟时衣袂染血，古佛舍利却分出一缕清光没入你眉心。',
            effects: { items: ['qingxin_dan', 'dao_fruit'], contribution: 420, reputation: 70, karma: 35, attrs: { 道心: 6, 根骨: 3 }, demon: -15, flag: { 镇魔梵钟: true } },
          },
          lose: {
            text: '怨气蚀骨，你被魔掌震出崖口。大钟九响将魔影逼回，老僧扶你入禅房静养月余。',
            effects: { hp: -80, injury: 2, demon: 6, attrs: { 道心: 3 } },
          },
        },
      },
      {
        label: '趺坐梵钟之下，受古佛舍利问心', hint: '道心检定 · 涤尽心魔',
        cost: { month: 3 },
        roll: {
          p: 0.55, attrs: { 道心: 0.014, 神识: 0.008 },
          success: {
            text: '舍利微光照见你过往所有贪念与悔恨。你既不辩解，也不逃避，只在钟声里静坐七日。魔窟怨气竟随你诵经声悄然平息。',
            effects: { attrs: { 道心: 10, 神识: 5 }, demon: -30, expPct: 0.35, contribution: 350, lifespan: 25, title: '听钟行者', flag: { 舍利问心: true } },
          },
          fail: {
            text: '舍利光华太澄澈，照出你藏得最深的一段旧怨。你心口剧痛，吐出一口黑血，却也看清了自身枷锁所在。',
            effects: { hp: -40, demon: 10, attrs: { 道心: 4, 悟性: 3 } },
          },
        },
      },
      {
        label: '守于山门渡化流散孤魂', hint: '慈悲稳妥 · 业力大增',
        cost: { month: 1 },
        outcome: {
          text: '你一夜未眠，以《大音希声》安抚十里内惊扰的山灵与孤魂。天亮时晨雾散尽，山脚村落的灯火安稳如常。',
          effects: { karma: 40, reputation: 30, contribution: 200, attrs: { 道心: 4 }, demon: -10 },
        },
      },
    ],
  },

  /* ───────────── 5. 万象书院 ───────────── */
  {
    id: 'sd_wanxiang_1', title: '万象 · 观星阵破域外魔影', pool: 'sect', tier: 4, weight: 7, minRealm: 2,
    require: 'char.sectId === "wanxiang"',
    once: true,
    text: '霜降之夜，观星台二十八宿青石骤然失色。天幕东北角裂开一道无声黑痕，数缕域外魔影顺着星光垂落，所过之处，墨字成阵的护院石碑接连崩碎。\n\n三位白发先生以血墨稳住阵脚，回首望你：「星枢缺一笔，须以活人神识为毫！」',
    choices: [
      {
        label: '以神识化毫，凌空补全周天星阵', hint: '悟性/神识检定 · 阵破域外魔',
        cost: { mp: 40, month: 2 },
        roll: {
          p: 0.55, attrs: { 悟性: 0.012, 神识: 0.012 },
          success: {
            text: '你踏入阵心，挥袖落笔，三百六十枚星辰古篆在夜空连成银网。域外魔影发出无声尖啸，被阵光炼作数捧璀璨星辰沙坠落石台。',
            effects: { items: ['xingchen_sha', 'faze_canpian'], attrs: { 悟性: 6, 神识: 6 }, expPct: 0.35, contribution: 420, reputation: 60, flag: { 观星破魔: true } },
          },
          fail: {
            text: '域外寒意顺着神识倒灌，你眼角渗血，字阵歪了半寸。三位先生合力补笔封住裂隙，你卧床半月才缓过神魂。',
            effects: { hp: -55, demon: 8, attrs: { 神识: 3, 悟性: 2 }, contribution: 180 },
          },
        },
      },
      {
        label: '执青锋直入星裂，斩杀魔影本体', hint: '战斗 · 虚空魔影',
        cost: { month: 1 },
        combat: {
          enemy: 'void_fiend',
          win: {
            text: '你迎着错乱的星风杀入黑痕边缘，剑光斩断魔影触须，天幕裂口随之缓缓愈合。先生们向你行了一记古礼。',
            effects: { items: ['xingchen_sha', 'xukong_jing'], expPct: 0.4, contribution: 450, reputation: 75, attrs: { 根骨: 4, 神识: 4 }, flag: { 观星破魔: true } },
          },
          lose: {
            text: '魔影无形无质，反震伤了你的识海。阵光将你拉回石台，天幕也在黎明前重归寂静。',
            effects: { hp: -75, injury: 2, demon: 10 },
          },
        },
      },
      {
        label: '抢先护下书院典籍楼，不令古卷被毁', hint: '稳妥 · 贡献与悟性',
        outcome: {
          text: '你展开小型聚灵阵护住三千架手抄孤本。待星台战毕，天色微白，经楼片纸未损。老山长拍了拍你的手背。',
          effects: { contribution: 220, attrs: { 悟性: 3, 道心: 3 }, stones: 250 },
        },
      },
    ],
  },

  /* ───────────── 6. 寒山道观 ───────────── */
  {
    id: 'sd_hanshan_1', title: '寒山 · 雪夜坐忘见古仙', pool: 'sect', tier: 5, weight: 6, minRealm: 2,
    require: 'char.sectId === "hanshan"',
    once: true,
    text: '大寒之夜，寒山大雪封门。无灯观中一如既往不燃烛火，唯窗外雪光照进幽暗大殿。\n\n你坐忘至三更，忽然察觉对面蒲团上不知何时多了一道瘦削雪影。那人眉眼模糊，声音却像积雪压断枯枝般清晰：「千年前我在这儿留过一盏灭掉的灯，你可看见黑暗里有什么？」',
    choices: [
      {
        label: '「黑暗里什么也没有，唯有我自己的念头」', hint: '道心检定 · 古仙点拨',
        cost: { month: 2 },
        roll: {
          p: 0.55, attrs: { 道心: 0.014, 悟性: 0.008 },
          success: {
            text: '雪影轻轻一笑，大殿冰霜瞬间化作满室清气。他抬指在你眉心一点，天亮时蒲团空空，案上却留着一枚温热的仙灵古丹。',
            effects: { items: ['xianling_dan'], attrs: { 道心: 8, 神识: 5 }, lifespan: 50, expPct: 0.35, demon: -20, contribution: 320, flag: { 雪夜见仙: true } },
          },
          fail: {
            text: '雪影沉默片刻，轻声道：「说得太快，未必是真的看见了。」言罢化风而散，只留满殿寒意渗骨。',
            effects: { attrs: { 道心: 3, 悟性: 2 }, lifespan: 10, demon: -5 },
          },
        },
      },
      {
        label: '不发一言，陪他静坐至雪停天明', hint: '无为坐忘 · 延寿净心',
        cost: { month: 3 },
        outcome: {
          text: '你阖上双目，不去问他是仙是鬼。一夜大雪无声，待晨光透窗，你发觉自己灵海圆融无瑕，寿元平添一甲子。',
          effects: { lifespan: 60, attrs: { 道心: 7, 根骨: 3 }, demon: -25, expPct: 0.25, title: '雪夜坐忘', flag: { 雪夜见仙: true } },
        },
      },
      {
        label: '起身为他斟一碗檐下新化的雪水', hint: '平淡见真 · 得古仙赠物',
        outcome: {
          text: '雪影接过粗陶碗，饮尽半盏，将碗倒扣在蒲团边：「修仙修到最后，反倒最难喝到一口干净水。」碗底压着一片细薄的法则玉纹。',
          effects: { items: ['faze_canpian'], attrs: { 道心: 5, 悟性: 4 }, karma: 20, contribution: 240, flag: { 雪夜见仙: true } },
        },
      },
    ],
  },

  /* ───────────── 7. 万宝阁 ───────────── */
  {
    id: 'sd_wanbao_1', title: '万宝 · 三十六号秘库鉴宝', pool: 'sect', tier: 4, weight: 7, minRealm: 1,
    require: 'char.sectId === "wanbao"',
    once: true,
    text: '万宝阁三十六号地下秘库十年一开。今夜红绸案上摆着三件无主奇物：一尊封蜡青铜鼎、一块暗纹玄铁简、一匣沾着海盐的鲛人泪，皆未标价，只许暗标竞拍。\n\n席间坐着正魔两道数位金丹执事，空气里满是灵石与杀气混杂的味道。',
    choices: [
      {
        label: '以神识暗鉴玄铁简，押灵石截胡', hint: '需灵石 600 · 神识与气运检定',
        cost: { stones: 600, month: 1 },
        roll: {
          p: 0.6, attrs: { 神识: 0.012, 气运: 0.01 },
          success: {
            text: '你一眼看破铁简夹层里藏着一缕星辰法则残纹。落槌之后，满座皆笑你冤大头，唯有你合匣转身时，听见简中星芒低鸣。',
            effects: { items: ['xingchen_sha', 'faze_canpian'], contribution: 320, attrs: { 神识: 4, 悟性: 3 }, flag: { 秘库掌眼: true } },
          },
          fail: {
            text: '铁简拆开，只余半段残缺炼器图与几块精铁。阁中掌柜笑着拍拍你的肩：「走眼一次，才算真正入了万宝门。」',
            effects: { items: ['xuantie', 'jiejin_dan'], attrs: { 悟性: 2 }, contribution: 120 },
          },
        },
      },
      {
        label: '识破青铜鼎乃魔修设局，当众拆台夺利', hint: '战斗 · 恼羞成怒的魔道买家',
        combat: {
          enemy: 'cultivator',
          win: {
            text: '你点破鼎底暗藏噬灵蛊，逼得做局的散修暴起发难。三招制敌后，大掌柜将查没的灵石分你一半，秘库自此由你挂名掌眼。',
            effects: { stones: 1400, items: ['jiejin_dan'], contribution: 380, reputation: 50, attrs: { 魅力: 3, 神识: 3 }, flag: { 秘库掌眼: true } },
          },
          lose: {
            text: '对方袖中飞出毒针，你肩头挂彩，好在万宝阁护卫及时出手将其镇压。掌柜赔了你一笔医药灵石。',
            effects: { hp: -45, stones: 300, contribution: 100 },
          },
        },
      },
      {
        label: '居中撮合正魔两家竞价，坐收佣金', hint: '商道手腕 · 稳赚灵石与贡献',
        cost: { month: 1 },
        outcome: {
          text: '你不动声色抬了两轮价码，让青云与血魔两家争得面红耳赤。待落槌散场，三十六号库账房悄悄给你划了厚厚一笔抽成。',
          effects: { stones: 1100, contribution: 260, attrs: { 魅力: 4 }, reputation: 15 },
        },
      },
    ],
  },

  /* ───────────── 8. 万兽山 ───────────── */
  {
    id: 'sd_wanshou_1', title: '万兽 · 万兽朝宗与妖皇遗血', pool: 'sect', tier: 4, weight: 7, minRealm: 2,
    require: 'char.sectId === "wanshou"',
    once: true,
    text: '百兽谷深处百年沉寂的兽骨拱门忽然发出苍凉长鸣。漫山灵兽无论品阶，齐齐面向幽谷血潭伏地低吼，竟是万兽朝宗之象。\n\n潭心石莲上，缓缓浮出一滴灿金如火的妖皇遗血。一头通体雪白的古猿正守在潭畔，金瞳冷冷打量着你。',
    choices: [
      {
        label: '与守潭古猿正面争锋，以强者之姿取血', hint: '战斗 · 镇谷古灵猿',
        cost: { month: 1 },
        combat: {
          enemy: 'spirit_ape',
          win: {
            text: '古猿捶胸长啸，终究单膝伏地，让开血潭之路。你收下那滴滚烫的妖皇遗血，只觉四肢百骸皆如重铸，万兽皆对你俯首。',
            effects: { items: ['longxue_jing', 'xisui_dan'], attrs: { 根骨: 7, 魅力: 3 }, lifespan: 30, contribution: 380, reputation: 60, flag: { 万兽朝宗: true } },
          },
          lose: {
            text: '古猿一拳震裂石岸，你跌入浅滩。它并未痛下杀手，只是抓起一把灵草抛到你怀里，转身隐入古林。',
            effects: { hp: -65, injury: 1, items: ['qiannian_lingcao'], attrs: { 根骨: 2 } },
          },
        },
      },
      {
        label: '运转《万兽契》，以平辈之礼邀古猿共分血气', hint: '魅力/根骨检定 · 驯服百兽',
        cost: { month: 2 },
        roll: {
          p: 0.55, attrs: { 魅力: 0.012, 根骨: 0.01 },
          success: {
            text: '你收起兵刃，划破指尖以本命灵血为引。古猿嗅了嗅气息，竟将石莲推近半尺。你与它各炼半滴遗血，谷中万兽齐声长鸣。',
            effects: { items: ['longxue_jing'], attrs: { 根骨: 5, 魅力: 5, 道心: 3 }, expPct: 0.3, contribution: 360, karma: 20, flag: { 万兽朝宗: true } },
          },
          fail: {
            text: '古猿嗤笑般喷出一口白气，一掌将你推回山道。虽未得遗血，观其吐纳兽息，你却悟出几分淬体门道。',
            effects: { hp: -30, attrs: { 根骨: 3, 悟性: 2 }, contribution: 120 },
          },
        },
      },
      {
        label: '以阵旗封镇血潭，免得山外低阶妖兽暴走', hint: '护山之举 · 贡献与业力',
        outcome: {
          text: '你连插十二面安魂兽旗，压住沸腾的妖皇威压。山脚躁动的兽群渐渐安静下来，长老赞你知轻重、识大局。',
          effects: { contribution: 320, karma: 30, reputation: 35, attrs: { 道心: 4 }, items: ['qiannian_lingcao'] },
        },
      },
    ],
  },

  /* ───────────── 9. 机关城 ───────────── */
  {
    id: 'sd_jiguan_1', title: '机关 · 第九层天工傀儡暴走', pool: 'sect', tier: 4, weight: 7, minRealm: 2,
    require: 'char.sectId === "jiguan"',
    once: true,
    text: '那座三百年不停挪动的机关城，今夜头一回在荒原上骤然停步。整座城池发出金属撕裂的闷响，第九层地心枢机红光冲天。\n\n一具三丈高的太古天工傀儡挣断玄铁锁链，胸口灵晶失控旋转，正一寸寸碾碎护城齿轮。三百年未露面的城主，此刻依旧杳无音讯。',
    choices: [
      {
        label: '迎难而上，硬拆天工傀儡胸口灵核', hint: '战斗 · 暴走太古傀儡',
        cost: { month: 1 },
        combat: {
          enemy: 'ancient_puppet',
          win: {
            text: '最后一击崩断傀儡枢轴，轰然巨响中，第九层红光渐熄。你在残骸深处拾得一枚刻满古篆的空间晶核，机关城缓缓重新迈开了脚步。',
            effects: { items: ['xukong_jing', 'xuantie'], expPct: 0.35, contribution: 420, reputation: 65, attrs: { 根骨: 4, 悟性: 4 }, flag: { 镇压九层: true } },
          },
          lose: {
            text: '铁臂横扫，你被震飞撞在青铜壁上。幸而备用闸门及时落下锁住九层，你拾起几块崩落的太古玄铁退回上层。',
            effects: { hp: -70, injury: 2, items: ['xuantie'], contribution: 120 },
          },
        },
      },
      {
        label: '借《天工开物》之法，逆转地心齿轮改写枢机', hint: '悟性检定 · 巧解危机',
        cost: { month: 2 },
        roll: {
          p: 0.55, attrs: { 悟性: 0.014, 神识: 0.01 },
          success: {
            text: '你在漫天飞溅的火星里踏着齿轮跃上傀儡脊背，三指拨正错位的青铜游标。傀儡眼中的红光转为淡青，竟向你单膝跪下，递出城主当年封存的玉匣。',
            effects: { items: ['xukong_jing', 'faze_canpian'], attrs: { 悟性: 7, 神识: 4 }, expPct: 0.3, contribution: 460, reputation: 70, title: '九层匠首', flag: { 镇压九层: true } },
          },
          fail: {
            text: '齿轮卡死，气浪掀翻了你的护身灵罩。你匆忙拉下急停拉杆，勉强保住上八层不塌，自己却被蒸汽烫伤半臂。',
            effects: { hp: -45, attrs: { 悟性: 3 }, contribution: 180 },
          },
        },
      },
      {
        label: '以玄铁熔铸锁桩，暂封第九层入口', hint: '稳妥止损 · 需玄铁或灵石 300',
        cost: { stones: 300 },
        outcome: {
          text: '你与器堂弟子合力浇筑七道玄铁巨门，将暴走的傀儡死死锁在最底层。城池虽行得慢了些，但满城修士皆得平安。',
          effects: { contribution: 260, reputation: 30, attrs: { 道心: 3, 根骨: 2 } },
        },
      },
    ],
  },

  /* ───────────── 10. 血魔宗（两段式：血池化魔 → 正道围剿正魔大战） ───────────── */
  {
    id: 'sd_xuemo_1', title: '血魔 · 血池化魔', pool: 'sect', tier: 4, weight: 7, minRealm: 2,
    require: 'char.sectId === "xuemo"',
    once: true,
    text: '北荒血池沸腾如煮，三百里内天色尽赤。十年一聚的「魔胎真血」自池底涌出，池畔白骨栈道上，七名真传彼此戒备，谁也不肯先下水。\n\n就在此刻，山门外骤然炸开九道青白剑虹——太玄剑宗与青云门的讨魔联军，偏偏挑在血池开池之夜兵临北荒！',
    choices: [
      {
        label: '趁乱纵身入血池，强吞魔胎真血', hint: '根骨检定 · 魔功大进，心魔暴涨',
        cost: { month: 1 },
        roll: {
          p: 0.6, attrs: { 根骨: 0.012, 道心: 0.006 },
          success: {
            text: '滚烫血浪几乎将你的经脉烧断，你咬碎牙关炼化三成真血。出池时双目赤光一闪，战力陡增，正逢山门阵破！',
            effects: { items: ['xueyu'], expPct: 0.4, attrs: { 根骨: 6 }, demon: 15, karma: -25, flag: { 血池淬魔: true }, counter: { sect_deep: 1 } },
            goto: 'sd_xuemo_2',
          },
          fail: {
            text: '血池煞气反噬，你呕出一口黑血跌回栈道，只勉强凝出一缕血煞护体。山门外杀声已近在咫尺！',
            effects: { hp: -55, demon: 18, attrs: { 根骨: 2 }, counter: { sect_deep: 1 } },
            goto: 'sd_xuemo_2',
          },
        },
      },
      {
        label: '舍弃血池机缘，先执魔刀赴山门布阵', hint: '深得魔宗看重 · 增血煞老祖好感',
        outcome: {
          text: '你头也不回跃上血骨城头，抢在联军合围前启开九幽血雾大阵。半空血云中，血煞老祖低沉的声音落下：「识大局，战后本座亲自赏你。」',
          effects: { contribution: 240, relation: { 血煞老祖: 20 }, attrs: { 道心: 3 }, flag: { 血阵先登: true }, counter: { sect_deep: 1 } },
          goto: 'sd_xuemo_2',
        },
      },
      {
        label: '顺手掠走池畔灵丹，随时准备遁逃', hint: '魔道本色 · 实利优先',
        outcome: {
          text: '宗门早说过，活下来的才是弟子。你趁同门厮杀，悄悄卷走两瓶凝血灵丹，退至外山观望正魔交锋。',
          effects: { items: ['huaying_dan', 'shenxing_fu'], stones: 400, karma: -15, relation: { 血煞老祖: -10 } },
        },
      },
    ],
  },
  {
    id: 'sd_xuemo_2', title: '北荒 · 正魔血战', pool: 'branch', tier: 5, weight: 0,
    text: (s) => `漫天剑雨与血浪撞在北荒上空，山石崩裂，尸骸枕藉。正道联军一名白发金丹长老斩开血雾，剑指血池中枢，朗声喝道：「魔崽受诛！」\n\n${s.flags['血池淬魔'] ? '你体内魔胎真血轰鸣不止，周身煞气凝如实质。' : '血雾大阵剧烈摇晃，眼看便要支撑不住。'}这一战，正邪皆无退路。`,
    choices: [
      {
        label: '阵前迎战正道长老，以血止剑', hint: '死战 · 正道金丹长老',
        combat: {
          enemy: 'jindan_elder',
          win: {
            text: '刀光劈断长老拂尘，你浑身浴血立于残碑之上。联军阵脚一乱，血煞老祖趁势挥袖卷退正道三百里。此战之后，你的名号响彻北荒。',
            effects: { expPct: 0.45, contribution: 550, reputation: 80, karma: -40, demon: 10, relation: { 血煞老祖: 30 }, items: ['longxue_jing'], title: '北荒血煞', flag: { 正魔大战: true } },
          },
          lose: {
            text: '剑气洞穿你的肩胛，你跌落血沟。血煞老祖隔空一掌拍退正道长老，将你从尸堆里提了出来：「没死，就还算本座的弟子。」',
            effects: { hp: -85, injury: 2, contribution: 150, relation: { 血煞老祖: 10 }, flag: { 正魔大战: true } },
          },
        },
      },
      {
        label: '引爆残余血池阵眼，掩护同门突围', hint: '以巧破局 · 智计退敌',
        cost: { month: 1 },
        roll: {
          p: 0.55, attrs: { 悟性: 0.012, 气运: 0.01 },
          success: {
            text: '血浪冲霄百丈，逼得正道剑阵连退十里。你趁乱收拢百余名血魔宗精锐撤入北荒深处，保住了宗门半壁根基。',
            effects: { contribution: 480, reputation: 50, attrs: { 悟性: 4, 道心: 3 }, relation: { 血煞老祖: 25 }, items: ['yuanying_dan'], flag: { 正魔大战: true } },
          },
          fail: {
            text: '阵眼反震险些将你吞没，虽阻住了追兵半个时辰，你也元气大伤，在暗窟养了整整半年。',
            effects: { hp: -70, injury: 2, contribution: 200 },
          },
        },
      },
      {
        label: '阵前倒戈，暗助正道放走被囚凡人', hint: '逆行改命 · 业力大涨，激怒魔宗',
        outcome: {
          text: '你趁战局混乱劈开后山血牢，放走百名即将投入血池的凡人。回望漫天血火，你知道自己在血魔宗的路，多半走到头了。',
          effects: { karma: 60, demon: -20, attrs: { 道心: 7 }, contribution: -300, relation: { 血煞老祖: -40 }, reputation: 45, flag: { 血牢放人: true } },
        },
      },
    ],
  },

  /* ───────────── 11. 合欢宗 ───────────── */
  {
    id: 'sd_hehuan_1', title: '合欢 · 情丝试炼与秘境双修', pool: 'sect', tier: 4, weight: 7, minRealm: 1,
    require: 'char.sectId === "hehuan"',
    once: true,
    text: '南疆合欢林花开如海，十年一启的「红尘情丝境」于月圆夜浮现。雾中万缕红丝缠树成网，凡入境者，皆会重逢心底最难忘的一道影子。\n\n宗中真传师姐/师兄提着一盏红纱灯停在你身侧，笑意似真似假：「情丝境独行易堕心魔，不如与我结伴入秘境双修，彼此借一分阴阳之气？」',
    choices: [
      {
        label: '共入秘境双修，阴阳互补', hint: '魅力/道心检定 · 修为与寿元大涨',
        cost: { month: 3 },
        roll: {
          p: 0.6, attrs: { 魅力: 0.012, 道心: 0.01 },
          success: {
            text: '花影摇曳，红尘念头如潮水拍岸，你们却始终守着灵台一寸清明。出境时灵力交融圆融，寿元与修为皆跨出一大步。',
            effects: { expPct: 0.4, lifespan: 35, attrs: { 魅力: 6, 道心: 3 }, items: ['juling_dan'], contribution: 300, flag: { 合欢试炼: true } },
          },
          fail: {
            text: '情丝反缠，你在幻境里沉溺了半月才挣脱。对方早已借势突破，只留下一枚温热丹药与半句戏言。',
            effects: { demon: 12, items: ['huaying_dan'], attrs: { 魅力: 2 }, contribution: 120 },
          },
        },
      },
      {
        label: '独入红雾，以真情直面心底幻影', hint: '心魔之战 · 破境明心',
        cost: { month: 2 },
        combat: {
          enemy: 'heart_demon',
          win: {
            text: '你没有急着拔剑，而是听完幻影说完那句迟了百年的话，再亲手拂散红雾。合欢宗长老在林外轻叹：「有情而能止，方是上乘。」',
            effects: { attrs: { 道心: 8, 魅力: 4 }, demon: -20, expPct: 0.35, contribution: 360, reputation: 45, flag: { 合欢试炼: true } },
          },
          lose: {
            text: '红丝勒紧识海，你终究没能狠下心斩断那道影子。跌出合欢林时，眼角沾着一滴冷露。',
            effects: { hp: -40, demon: 15, attrs: { 魅力: 3 } },
          },
        },
      },
      {
        label: '以剑气斩断满林情丝，自修无情道', hint: '反其道而行 · 悟性与神识大进',
        outcome: {
          text: '剑光过处，百里红花齐落。同门皆惊，唯独你自己知道，胸口那处空出来的地界，反而轻省了许多。',
          effects: { attrs: { 悟性: 6, 神识: 5, 魅力: -2 }, demon: -10, contribution: 220, items: ['qingxin_dan'] },
        },
      },
    ],
  },

  /* ───────────── 12. 幽冥鬼道 ───────────── */
  {
    id: 'sd_youming_1', title: '幽冥 · 黄泉渡阴司借道', pool: 'sect', tier: 4, weight: 7, minRealm: 2,
    require: 'char.sectId === "youming"',
    once: true,
    text: '鬼门关大开之夜，九幽黄泉水逆流三尺。一艘白骨渡船破雾停岸，船头提灯的阴司鬼王目光空洞，身后立着三百名不肯散去的古战残魂。\n\n鬼王声音像两块寒石相磨：「阳间路断，阴司欲借幽冥弟子一缕生魂为引，过关三日。借，还是不借？」',
    choices: [
      {
        label: '以神识定契借道，换阴司冥宝', hint: '神识检定 · 阴司交易',
        cost: { month: 2 },
        roll: {
          p: 0.55, attrs: { 神识: 0.014, 道心: 0.008 },
          success: {
            text: '你以三滴心头血点亮渡船灯火，引领三百残魂安然过关。三日后白骨船返航，鬼王抛下一柄太古残剑与一枚凝魂灵丹，没入黑雾。',
            effects: { items: ['canjian', 'yuanying_dan'], attrs: { 神识: 7, 悟性: 3 }, contribution: 380, expPct: 0.3, karma: 15, flag: { 阴司借道: true } },
          },
          fail: {
            text: '阴气倒灌入脉，你险些被拽进黄泉。强行扯断魂契后，折损十年阳寿，神识却在鬼气磨砺下锋利了几分。',
            effects: { hp: -60, lifespan: -10, attrs: { 神识: 4 }, demon: 8 },
          },
        },
      },
      {
        label: '喝止阴司越界，挥刃斩鬼王夺冥令', hint: '死战 · 黄泉鬼王',
        cost: { month: 1 },
        combat: {
          enemy: 'ghost_king',
          win: {
            text: '鬼火崩碎，白骨船沉回黄泉底。你拾起残存的阴司冥令，满渡口群鬼尽数俯首。宗中鬼老暗中颔首：「幽冥之主，原该如此。」',
            effects: { expPct: 0.4, items: ['yuanying_dan', 'faze_canpian'], contribution: 450, reputation: 65, attrs: { 神识: 6, 根骨: 3 }, flag: { 阴司借道: true } },
          },
          lose: {
            text: '鬼王一戟震碎你的护魂阵，你顺着暗流漂出十里才爬上岸，浑身冰冷如铁。',
            effects: { hp: -80, injury: 2, demon: 10 },
          },
        },
      },
      {
        label: '诵《幽冥渡魂经》，就地超度三百残魂', hint: '大功德 · 业力与道心暴涨',
        cost: { month: 2 },
        outcome: {
          text: '你立于渡口枯石之上诵经一夜。三百残魂卸去甲胄，向你躬身散作满江萤火。鬼王看了你很久，一声不响摇桨远去。',
          effects: { karma: 50, attrs: { 道心: 7, 神识: 4 }, demon: -18, contribution: 300, lifespan: 20 },
        },
      },
    ],
  },

  /* ───────────── 13. 散修联盟 ───────────── */
  {
    id: 'sd_sanxiu_1', title: '散修 · 无名酒肆盟会', pool: 'sect', tier: 3, weight: 8, minRealm: 1,
    require: 'char.sectId === "sanxiu"',
    once: true,
    text: '荒漠边城的无名酒肆，今夜挂出三盏青灯。大堂里挤满七十余名散修，刀剑横在长凳上，谁也没动桌上的浊酒。\n\n只因三大宗门联手圈占了西野最后三条野灵脉，贴出告示：凡散修擅入者，格杀勿论。断臂老修一拍桌子：「今夜要嘛散伙认命，要嘛立个盟，讨条活路！」',
    choices: [
      {
        label: '拔剑登桌，愿为先驱破大宗封脉令', hint: '战斗 · 宗门巡脉执事',
        cost: { month: 1 },
        combat: {
          enemy: 'cultivator',
          win: {
            text: '翌日黎明，你带三十名散修斩断西野封脉石碑，击退大宗巡脉执事。三大宗门顾忌众怒，终究让出半条灵脉。酒肆里从此多了一块写着你名字的木牌。',
            effects: { stones: 800, items: ['jiejin_dan', 'shenxing_fu'], reputation: 85, karma: 25, attrs: { 根骨: 4, 道心: 4 }, title: '野脉盟主', flag: { 散修盟会: true } },
          },
          lose: {
            text: '大宗巡脉阵法森严，你掩护众人杀出重围，左肩中了一剑。散修们凑出灵石丹药送到你客栈门口，谁也没提放弃。',
            effects: { hp: -55, injury: 1, items: ['liaoshang_dan'], reputation: 35, attrs: { 道心: 3 } },
          },
        },
      },
      {
        label: '执壶居中调停，以互市换取三条野脉共享', hint: '魅力/悟性检定 · 纵横捭阖',
        cost: { month: 2 },
        roll: {
          p: 0.55, attrs: { 魅力: 0.014, 悟性: 0.01 },
          success: {
            text: '你提着酒肆的联名血书直上大宗议事堂，许诺散修按季采药抵税，换得三条灵脉百年共采之约。那一夜无名酒肆喝空了十坛烈酒。',
            effects: { stones: 950, reputation: 90, karma: 30, attrs: { 魅力: 5, 悟性: 4 }, items: ['juling_dan'], flag: { 散修盟会: true } },
          },
          fail: {
            text: '大宗执事嗤笑一声，将文书撕作两半。你只得另寻偏僻荒谷带众人迁徙，虽失灵脉，倒结下一群过命之交。',
            effects: { stones: 250, reputation: 30, attrs: { 道心: 3, 魅力: 2 } },
          },
        },
      },
      {
        label: '饮尽碗中浊酒，独行天地不入任何盟', hint: '真散修本色 · 气运与道心',
        outcome: {
          text: '你丢下五枚灵石起身出门：「今日结盟，明日便成新宗门。」风沙扑面，你听见身后有人笑骂，却越走越觉天地宽广。',
          effects: { attrs: { 气运: 5, 道心: 4 }, demon: -10, expPct: 0.2 },
        },
      },
    ],
  },

  /* ========================================================================
   * 第二篇 · 六大常驻人物羁绊线（pool: 'world' + 'branch'，共 13 节点）
   * 苏晚晴 / 陆沉舟 / 药尘子 / 顾青衣 / 血煞老祖 / 林昊
   * ======================================================================== */

  /* ───────────── NPC 1：苏晚晴（三段式） ───────────── */
  {
    id: 'sd_npc_su_1', title: '故人 · 沧溟秘境携手', pool: 'world', tier: 4, weight: 7, minRealm: 1,
    once: true,
    text: '东海沧溟古泽开启，浓雾锁水百里。你踏上残破石桥时，一道熟悉的青衣身影正背剑立在桥头——是苏晚晴。\n\n她/他衣角沾着海露，看见你时眼底微亮：「巧了。桥下潜着一头守泽夜叉，我正愁少个人替我看后背。」',
    choices: [
      {
        label: '拔剑并肩，合击泽底水夜叉', hint: '战斗 · 沧溟夜叉 · 增苏晚晴情谊',
        cost: { month: 1 },
        combat: {
          enemy: 'sea_yaksha',
          win: {
            text: '你主正面破浪，苏晚晴一缕青衣剑光斜刺妖目，水夜叉哀嚎沉泽。你们共分古泽灵莲，约定出境后寻一处有雪的山头小聚。',
            effects: { items: ['qiannian_lingcao', 'juling_dan'], expPct: 0.25, relation: { 苏晚晴: 25 }, attrs: { 根骨: 3, 道心: 3 }, flag: { 秘境携手: true } },
            goto: 'sd_npc_su_2',
          },
          lose: {
            text: '巨浪拍碎石桥，苏晚晴反手拽住你衣袖借剑遁出十里。二人狼狈落在礁石上，相视一眼竟都笑出了声。',
            effects: { hp: -40, relation: { 苏晚晴: 20 }, flag: { 秘境携手: true } },
            goto: 'sd_npc_su_2',
          },
        },
      },
      {
        label: '以神识同解桥头水禁，绕开妖兽取宝', hint: '悟性/神识检定 · 默契配合',
        cost: { month: 1 },
        roll: {
          p: 0.6, attrs: { 悟性: 0.012, 神识: 0.01 },
          success: {
            text: '你指诀引气，苏晚晴以笛音定波，水禁无声分作两道。你们兵不血刃取走古泽灵丹，趁夜雾未散折返孤峰。',
            effects: { items: ['huaying_dan'], attrs: { 悟性: 4, 神识: 3 }, relation: { 苏晚晴: 25 }, flag: { 秘境携手: true } },
            goto: 'sd_npc_su_2',
          },
          fail: {
            text: '阵纹骤裂惊动妖兽，你们互为掩护退至泽外。虽失古泽灵宝，却把后背交给了彼此。',
            effects: { hp: -25, relation: { 苏晚晴: 15 }, flag: { 秘境携手: true } },
            goto: 'sd_npc_su_2',
          },
        },
      },
      {
        label: '赠其一枚护心符，各寻机缘', hint: '君子之交 · 浅结善缘',
        outcome: {
          text: '苏晚晴接过符箓收入袖中，含笑拱手：「那便山外再见。」青衣没入海雾，只余一声极轻的剑鸣。',
          effects: { relation: { 苏晚晴: 10 }, attrs: { 道心: 2 } },
        },
      },
    ],
  },
  {
    id: 'sd_npc_su_2', title: '晚晴 · 雪夜论剑', pool: 'branch', tier: 4, weight: 0,
    text: '出泽后恰逢入冬。你们在荒山梅林里生起一堆松柴，温了半壶旧酒。大雪簌簌压弯梅枝，苏晚晴折下两根枯梅，抛来一枝。\n\n「酒还烫，不如借这雪地拆三十招？」青衣在白雪里格外分明，剑意既清且远。',
    choices: [
      {
        label: '接枝起势，雪中拆剑至天明', hint: '以剑印心 · 悟性道心与情谊大涨',
        cost: { month: 1 },
        outcome: {
          text: '梅枝交错，落雪未沾衣襟。拆到第一百招时，你们同时收枝大笑。那夜的剑路与酒温，成了此后百年最难忘的一幕。',
          effects: { attrs: { 悟性: 5, 道心: 5 }, expPct: 0.25, demon: -12, relation: { 苏晚晴: 25 }, flag: { 雪夜论剑: true } },
        },
      },
      {
        label: '收枝入炉，围火细述修仙至今的困惑', hint: '倾心长谈 · 化解心魔',
        cost: { month: 1 },
        outcome: {
          text: '火光映在两人眼底。苏晚晴静静听你说完半生辗转，只轻声道：「往后若遇过不去的关隘，记得叫我。」',
          effects: { attrs: { 道心: 7, 魅力: 3 }, demon: -20, relation: { 苏晚晴: 30 }, flag: { 雪夜论剑: true } },
        },
      },
    ],
  },
  {
    id: 'sd_npc_su_3', title: '晚晴 · 共渡心魔', pool: 'world', tier: 5, weight: 8, minRealm: 3,
    require: 'flag("雪夜论剑") || rel("苏晚晴") >= 25',
    once: true,
    text: '破境关头，你体内积攒百年的旧怨轰然反噬，识海化作无边血海，几乎要将神魂吞没。\n\n千钧一发之际，一缕极清冷的梅香破开黑雾——苏晚晴不顾神魂受创之险，强行以本命剑意切入你的识海，横剑立在你身前：「闭眼做什么？不是说过，有难同当吗！」',
    choices: [
      {
        label: '振作神魂，与苏晚晴合剑斩杀心魔', hint: '战斗 · 识海心魔 · 结生死之契',
        cost: { month: 2 },
        combat: {
          enemy: 'heart_demon',
          win: {
            text: '两道剑光在血海深处合而为一，心魔哀嚎消散。睁眼时，洞府窗外正落春雨，苏晚晴脸色微白却笑得明朗，递来一朵护魂青莲。',
            effects: { items: ['tiandao_lotus'], demon: -35, attrs: { 道心: 10, 神识: 6 }, expPct: 0.4, relation: { 苏晚晴: 40 }, title: '同心斩魔', flag: { 共渡心魔: true } },
          },
          lose: {
            text: '心魔狂潮反扑，苏晚晴替你挡下最重一击，强行将你拉出识海。此后你闭门替她/他温养神魂半年，情谊反倒更深。',
            effects: { hp: -60, demon: -15, relation: { 苏晚晴: 35 }, attrs: { 道心: 5 }, flag: { 共渡心魔: true } },
          },
        },
      },
      {
        label: '反手将苏晚晴推出识海，独自承受反噬', hint: '宁损己身 · 护其无恙',
        cost: { month: 2 },
        roll: {
          p: 0.5, attrs: { 道心: 0.014, 神识: 0.01 },
          success: {
            text: '你不肯连累对方，硬凭一口孤勇吞下心魔。醒来时苏晚晴红着眼眶守在榻边，半晌才憋出一句：「蠢死了。」却握紧你的手没放开。',
            effects: { hp: -50, demon: -25, attrs: { 道心: 12 }, relation: { 苏晚晴: 45 }, items: ['dao_fruit'], flag: { 共渡心魔: true } },
          },
          fail: {
            text: '强撑之下神魂受损，好在苏晚晴守在洞外日夜以灵力温养，终究保住了你的道基不失。',
            effects: { hp: -80, injury: 2, demon: 5, relation: { 苏晚晴: 30 } },
          },
        },
      },
    ],
  },

  /* ───────────── NPC 2：陆沉舟（两段式） ───────────── */
  {
    id: 'sd_npc_lu_1', title: '剑痴 · 三战之约', pool: 'world', tier: 4, weight: 7, minRealm: 1,
    once: true,
    text: '西岭断崖风大，一名负剑白衣人正对着云海练拔剑，一拔便是三千次。他听见脚步声回身——是太玄剑痴陆沉舟。\n\n他目光在你周身停留三息，忽然露出极纯粹的战意：「{name}，同辈之中能接我三剑者寥寥。不如立下三战之约——今日一战，金丹一战，元婴再决生死高低！」',
    choices: [
      {
        label: '「好！」拔剑赴首战之约', hint: '战斗 · 陆沉舟剑影 · 宿敌初定',
        cost: { month: 1 },
        combat: {
          enemy: 'sword_phantom',
          win: {
            text: '双剑交鸣如雷，你一式变招压下他的快剑。陆沉舟抹去颊边血线，大笑收剑：「痛快！这一败我记下了，下一战绝不留手。」',
            effects: { expPct: 0.25, attrs: { 根骨: 4, 悟性: 3 }, reputation: 45, relation: { 陆沉舟: 30 }, flag: { 三战之约: true } },
          },
          lose: {
            text: '他的剑快如惊鸿，剑背停在你咽喉半寸。陆沉舟收剑抛来一瓶疗伤灵丹：「你的剑心够稳，只差火候。我等你追上来。」',
            effects: { hp: -35, items: ['liaoshang_dan'], attrs: { 悟性: 4 }, relation: { 陆沉舟: 25 }, flag: { 三战之约: true } },
          },
        },
      },
      {
        label: '以气机隔空试锋，不动兵刃定约', hint: '悟性/神识检定 · 点到为止',
        roll: {
          p: 0.55, attrs: { 悟性: 0.012, 根骨: 0.01 },
          success: {
            text: '两股剑意在断崖云海无声相撞，激起十丈松涛。陆沉舟眼中精光暴涨：「好！这三战之约，我记在剑鞘上了。」',
            effects: { attrs: { 悟性: 5, 神识: 3 }, expPct: 0.2, relation: { 陆沉舟: 25 }, flag: { 三战之约: true } },
          },
          fail: {
            text: '他的剑意凌厉得几乎割破你的护体灵光。你闷哼退后两步，陆沉舟微微颔首：「再磨十年，我在北岭等你。」',
            effects: { hp: -20, attrs: { 道心: 3 }, relation: { 陆沉舟: 15 }, flag: { 三战之约: true } },
          },
        },
      },
      {
        label: '婉拒比剑：「我只求长生，不求胜人」', hint: '淡泊守心',
        outcome: {
          text: '陆沉舟愣了片刻，收剑叹道：「可惜了你一身好根骨。」他转身踏云而去，只留崖上剑气久久不散。',
          effects: { attrs: { 道心: 4 }, relation: { 陆沉舟: -5 } },
        },
      },
    ],
  },
  {
    id: 'sd_npc_lu_2', title: '沉舟 · 绝境相援', pool: 'world', tier: 5, weight: 8, minRealm: 3,
    require: 'flag("三战之约") || rel("陆沉舟") >= 15',
    once: true,
    text: '北岭荒谷大雾弥漫，你误入血魔宗长老布下的绝杀血阵，灵力将竭，四周血影步步紧逼。\n\n绝境之际，高空云层骤然被一道孤绝如霜的剑光一劈为二！陆沉舟踏剑落于血阵中央，横剑护在你身侧，语气冷得像铁：「滚开。{name}的命，只能留给我的第三战！」',
    choices: [
      {
        label: '与陆沉舟背脊相抵，杀穿血阵', hint: '死战 · 血魔长老 · 宿敌成知己',
        cost: { month: 1 },
        combat: {
          enemy: 'blood_elder',
          win: {
            text: '双剑合璧，血阵寸寸崩裂，魔道长老断臂遁逃。荒谷风静，陆沉舟收剑靠在枯树上喘息，难得笑了笑：「算你欠我一坛好酒。」',
            effects: { items: ['wujian_jue', 'longxue_jing'], expPct: 0.4, reputation: 75, attrs: { 根骨: 6, 道心: 5 }, relation: { 陆沉舟: 45 }, title: '双剑知己', flag: { 绝境相援: true } },
          },
          lose: {
            text: '血阵威压太重，陆沉舟硬生生替你劈开一道生路，自己却被血刃洞穿肩骨。你背着他一路杀出百里，直到天明。',
            effects: { hp: -70, injury: 2, relation: { 陆沉舟: 50 }, attrs: { 道心: 6 }, flag: { 绝境相援: true } },
          },
        },
      },
      {
        label: '燃血催动护身灵力，掩护陆沉舟先行破阵眼', hint: '以命换机 · 重伤破阵',
        cost: { hp: 50 },
        outcome: {
          text: '你硬抗三道血雷为他抢出半息空档，陆沉舟一剑碎阵！脱险后他盯着你的伤处沉默良久，将半部太玄剑意手札塞入你怀中。',
          effects: { items: ['faze_canpian', 'dahuan_dan'], expPct: 0.35, relation: { 陆沉舟: 45 }, attrs: { 悟性: 5, 道心: 5 }, flag: { 绝境相援: true } },
        },
      },
    ],
  },

  /* ───────────── NPC 3：药尘子（两段式） ───────────── */
  {
    id: 'sd_npc_yao_1', title: '丹痴 · 以毒试药', pool: 'world', tier: 4, weight: 7, minRealm: 1,
    once: true,
    text: '云雾深林里藏着一座歪斜草庐，烟囱正冒着紫得发黑的丹烟。庐前坐着个头发焦卷、赤脚啃灵果的老头——正是销声匿迹百年的丹道大宗师药尘子。\n\n他眯眼打量你半晌，笑眯眯推来三碗颜色诡异的药汤：「小辈，老夫新炼的七绝化毒散缺个活人试药。敢喝一碗，便算你过了门槛。」',
    choices: [
      {
        label: '端起最黑的那碗一饮而尽', hint: '根骨检定 · 胆色惊人',
        cost: { month: 1 },
        roll: {
          p: 0.55, attrs: { 根骨: 0.014, 气运: 0.008 },
          success: {
            text: '药汁入腹如吞冰火，你硬凭经脉扛过三息剧痛，忽觉周身陈年暗伤尽数化去！药尘子抚掌狂笑：「好骨头！进来，老夫给你看点真东西。」',
            effects: { heal: 3, attrs: { 根骨: 5, 气运: 2 }, relation: { 药尘子: 30 }, flag: { 识药尘子: true } },
            goto: 'sd_npc_yao_2',
          },
          fail: {
            text: '药力太烈，你口吐紫沫昏睡了三日。醒来时药尘子正蹲在榻边拿炭笔记账：「嗯，火候大了半钱。罢了，算你通过！」',
            effects: { hp: -45, attrs: { 根骨: 3 }, relation: { 药尘子: 25 }, flag: { 识药尘子: true } },
            goto: 'sd_npc_yao_2',
          },
        },
      },
      {
        label: '嗅出汤中七味相克毒草，当场点破丹弊', hint: '悟性检定 · 以丹理服人',
        roll: {
          p: 0.55, attrs: { 悟性: 0.014, 神识: 0.01 },
          success: {
            text: '你随口道出蛇涎草与寒髓露相冲之理。药尘子愣住，猛地一拍大腿：「怪不得炸了老夫三口炉！快进来坐！」',
            effects: { attrs: { 悟性: 5 }, relation: { 药尘子: 35 }, flag: { 识药尘子: true, 丹理相投: true } },
            goto: 'sd_npc_yao_2',
          },
          fail: {
            text: '你认错了两味偏门异草，药尘子嗤笑一声把碗收了回去：「半桶水也敢班门弄斧。去去去，替我采十筐灵草再来！」',
            effects: { attrs: { 悟性: 2 }, relation: { 药尘子: 10 }, items: ['lingcao'] },
          },
        },
      },
      {
        label: '拱手辞谢：「前辈的药，晚辈无福消受」', hint: '稳妥远离',
        outcome: {
          text: '药尘子撇撇嘴，自己仰脖喝了半碗，咳得惊天动地。你趁机退入雾林，走出三里还能听见草庐炸炉的闷响。',
          effects: { attrs: { 道心: 2 } },
        },
      },
    ],
  },
  {
    id: 'sd_npc_yao_2', title: '药尘 · 亲授古丹方', pool: 'branch', tier: 4, weight: 0,
    text: (s) => `草庐内别有洞天，满墙皆是发黄的兽皮古方。药尘子一改疯癫模样，神色竟罕见地肃穆起来。\n\n${s.flags['丹理相投'] ? '「懂药理的人越来越少了。」他取出一卷焦边竹简，' : '「敢拿命试药的傻子不多了。」他拍开一尊黑铁药炉，'}「老夫手里有半卷失传的《九转古丹录》，今日传你一炉真火，能记几成，看你造化。」`,
    choices: [
      {
        label: '留庐三月，潜心抄录并演练古丹方', hint: '耗时三月 · 丹道大成，赠九转金丹',
        cost: { month: 3 },
        outcome: {
          text: '三月间炸过两次炉，烫黑过三回袖口，你终于在黎明前亲手炼出第一炉暗香浮动的古丹。药尘子哈哈大笑，将丹药与药材尽数塞进了你的储物袋。',
          effects: { items: ['jiuzhuan_dan', 'qiannian_lingcao'], attrs: { 悟性: 6, 神识: 4 }, expPct: 0.25, relation: { 药尘子: 30 }, counter: { alchemy: 3 }, flag: { 得古丹方: true } },
        },
      },
      {
        label: '请老宗师以古方为你重炼一炉洗髓延寿丹', hint: '需灵石 400 · 大幅增寿与洗髓',
        cost: { stones: 400, month: 2 },
        outcome: {
          text: '药尘子亲手掌火七七四十九日，成丹时满林草木皆青。你服下半枚，顿觉筋骨轻健，生机澎湃如春潮。',
          effects: { items: ['xisui_dan', 'dahuan_dan'], lifespan: 45, attrs: { 根骨: 5 }, relation: { 药尘子: 20 }, flag: { 得古丹方: true } },
        },
      },
    ],
  },

  /* ───────────── NPC 4：顾青衣（两段式） ───────────── */
  {
    id: 'sd_npc_gu_1', title: '天机 · 执笔换因果', pool: 'world', tier: 4, weight: 7, minRealm: 2,
    once: true,
    text: '细雨打湿乌篷船顶。你渡江时，船尾坐着一位手持狼毫、袖染淡墨的青衣女子，正是天机阁执笔女史顾青衣。\n\n她摊开一卷无字竹简，眸光清冷如秋水：「{name}，你身上缠着几段不寻常的因果。天机阁不收灵石，若肯告诉我你最不愿示人的一桩秘密，我便替你算一卦前程。」',
    choices: [
      {
        label: '坦诚相告半生隐秘，以因果换天机', hint: '深结机缘 · 揭示未来线索',
        cost: { month: 1 },
        outcome: {
          text: '你低声说完，竹简上竟自行浮出一行墨字，转瞬又淡去。顾青衣收笔轻叹：「原来如此。记住，化神之后若见天裂，万莫轻信接引仙光。」',
          effects: { attrs: { 悟性: 5, 气运: 4 }, expPct: 0.2, relation: { 顾青衣: 30 }, flag: { 识顾青衣: true, 天机初示: true } },
        },
      },
      {
        label: '以神识暗窥她怀中无字竹简', hint: '神识检定 · 犯天机之忌',
        roll: {
          p: 0.5, attrs: { 神识: 0.012, 气运: 0.01 },
          success: {
            text: '刹那间你看见简上密密麻麻写满九州大能的死期，最后一页赫然画着半扇残破仙门。顾青衣轻敲船舷收简，眼里反倒生出几分兴味：「神识倒利。」',
            effects: { attrs: { 神识: 6, 悟性: 3 }, relation: { 顾青衣: 20 }, flag: { 识顾青衣: true, 窥见天机: true } },
          },
          fail: {
            text: '竹简墨气反噬，你眼前一黑，鼻尖渗血。顾青衣递来一方素帕：「天机不可强窃，这一课权当免费。」',
            effects: { hp: -35, demon: 6, relation: { 顾青衣: 10 }, flag: { 识顾青衣: true } },
          },
        },
      },
      {
        label: '笑言「命数自己走，何须旁人落笔」', hint: '道心坚定',
        outcome: {
          text: '顾青衣闻言微怔，随即轻笑一声，在简角记下四个小字：「狂士可期。」靠岸时，她赠你一枚清心古丹作别。',
          effects: { items: ['qingxin_dan'], attrs: { 道心: 5 }, relation: { 顾青衣: 15 }, flag: { 识顾青衣: true } },
        },
      },
    ],
  },
  {
    id: 'sd_npc_gu_2', title: '青衣 · 上界真相', pool: 'world', tier: 5, weight: 8, minRealm: 4,
    require: 'flag("识顾青衣") || rel("顾青衣") >= 15',
    once: true,
    text: '寒江独钓，你再度遇见顾青衣。此番她不再年轻，鬓角平添三缕霜白——那是窥破太多天机招致的反噬。\n\n她展开最后一卷残简，江面瞬间映出九重天外荒凉崩裂的仙界残墟：「世人皆道飞升即是永生极乐。可天机阁查了三万年，上界灵潮早已枯竭，所谓飞升接引，不过是旧仙收割下界道果的渔网。」话音未落，云端骤然降下一道冷漠金光！',
    choices: [
      {
        label: '拔剑护住顾青衣，迎战降临的上界巡使', hint: '死战 · 天界巡使 · 逆天护史',
        cost: { month: 2 },
        combat: {
          enemy: 'heaven_envoy',
          win: {
            text: '金甲虚影在漫天法则碎片中崩解。顾青衣咳出一口血，将完整竹简托付于你：「从今往后，这桩真相由你带去渡劫。」',
            effects: { items: ['faze_canpian', 'xukong_jing'], expPct: 0.45, attrs: { 道心: 9, 悟性: 7, 神识: 6 }, relation: { 顾青衣: 45 }, title: '破妄执史', flag: { 上界真相: true } },
          },
          lose: {
            text: '巡使威压如天倾，顾青衣燃烧半生寿元撕开空间裂隙，硬将你送出千里之外。待你重返寒江，唯余一枝折断的狼毫飘在水面。',
            effects: { hp: -90, injury: 2, relation: { 顾青衣: 40 }, attrs: { 道心: 8 }, flag: { 上界真相: true } },
          },
        },
      },
      {
        label: '以虚空法则掩去二人天机，助她补全残简', hint: '悟性/神识检定 · 智避天罚',
        cost: { month: 3 },
        roll: {
          p: 0.55, attrs: { 悟性: 0.012, 神识: 0.012 },
          success: {
            text: '你指尖织出重重虚空迷障，瞒过九霄巡察。金光盘旋片刻散去。顾青衣松了口气，分你半页天道法则残篇，眼神里有了久违的温度。',
            effects: { items: ['faze_canpian', 'dao_fruit'], attrs: { 悟性: 8, 神识: 6 }, expPct: 0.35, relation: { 顾青衣: 40 }, flag: { 上界真相: true } },
          },
          fail: {
            text: '迷障被金光撕开一角，你们各受天罚反噬。虽保住了性命与残简，寿元却折了二十载。',
            effects: { hp: -65, lifespan: -20, attrs: { 神识: 5 }, relation: { 顾青衣: 30 }, flag: { 上界真相: true } },
          },
        },
      },
      {
        label: '合上竹简：「上界如何，待我飞升亲眼去破」', hint: '无畏道心 · 稳固前路',
        outcome: {
          text: '顾青衣凝视你许久，忽然展颜一笑：「若飞升者皆如你，那张渔网也该破了。」云端金光竟因你心无畏惧而自行退散。',
          effects: { attrs: { 道心: 10 }, demon: -20, breakBonus: 10, relation: { 顾青衣: 30 }, flag: { 上界真相: true } },
        },
      },
    ],
  },

  /* ───────────── NPC 5：血煞老祖（两段式） ───────────── */
  {
    id: 'sd_npc_xuesha_1', title: '枭雄 · 血煞招揽', pool: 'world', tier: 5, weight: 6, minRealm: 3,
    once: true,
    text: '荒原血月悬空，十里风声骤止。一名身披暗红大氅、面容却如中年儒生般的男子踏着血莲缓缓落下——北荒魔道第一枭雄，血煞老祖。\n\n他并未释放杀意，只随手抛来一枚温热玉符：「正道那群老东西嘴里念着苍生，背地里争灵脉比谁都狠。{name}，随本座去北荒血坛坐一坐，如何？」',
    choices: [
      {
        label: '接过玉符，随其赴北荒血坛一观', hint: '深入虎穴 · 进入魔坛抉择',
        cost: { month: 1 },
        outcome: {
          text: '血煞老祖大笑一声，袖袍卷起百丈血云。片刻之间，你已置身北荒万丈骨峰之巅。',
          effects: { relation: { 血煞老祖: 20 }, flag: { 赴血坛: true } },
          goto: 'sd_npc_xuesha_2',
        },
      },
      {
        label: '断然拒绝，挥剑与魔道枭雄一决生死', hint: '死战 · 血煞化身',
        cost: { month: 1 },
        combat: {
          enemy: 'blood_elder',
          win: {
            text: '剑光斩碎血莲，血煞老祖退后三步，抚掌赞道：「好锋芒！本座记住你了，下次再见便是真身相搏。」言罢化作漫天血雾远去。',
            effects: { expPct: 0.4, reputation: 90, karma: 40, attrs: { 道心: 7, 根骨: 4 }, items: ['yuanying_dan'], relation: { 血煞老祖: -25 }, flag: { 力拒血煞: true } },
          },
          lose: {
            text: '血海威压几乎碾碎你的护体罡气。血煞老祖收手居高临下望着你：「骨头很硬，可惜火候还差些。」他拂袖离去，留你独卧荒原。',
            effects: { hp: -85, injury: 2, attrs: { 道心: 4 }, relation: { 血煞老祖: -10 } },
          },
        },
      },
      {
        label: '不接符亦不动手，淡言「道不同，各自珍重」', hint: '不卑不亢 · 从容周旋',
        outcome: {
          text: '血煞老祖盯了你三息，收回玉符淡淡一笑：「倒是个明白人。北荒大门，随时为你留半扇。」',
          effects: { attrs: { 道心: 5, 魅力: 3 }, relation: { 血煞老祖: 10 } },
        },
      },
    ],
  },
  {
    id: 'sd_npc_xuesha_2', title: '血坛 · 正邪一念', pool: 'branch', tier: 5, weight: 0,
    text: '北荒血坛之下，数十名被擒的正道修士锁在黑铁柱上，而血坛中央悬着一团凝炼千年的魔道精粹。\n\n血煞老祖背手立在坛边：「吞下这团血精，本座亲手助你破境，北荒魔道分你一半。又或者——你也可以现在拔剑，试试能不能带着下面这些人活着走下骨峰。」',
    choices: [
      {
        label: '受其魔道传承，共掌北荒风云', hint: '堕魔求强 · 修为与魔宝暴涨，业力大减',
        cost: { month: 2 },
        outcome: {
          text: '滚烫血精没入丹田，你听见铁柱下传来正道修士的怒骂，却只觉浑身力量如海奔涌。血煞老祖将一枚传世血玉抛入你怀：「从今日起，天下正邪，你我平分。」',
          effects: { items: ['xueyu', 'huashen_dan'], expPct: 0.55, attrs: { 根骨: 8, 神识: 4 }, demon: 25, karma: -80, reputation: -40, relation: { 血煞老祖: 50 }, title: '血坛客卿', flag: { 血煞同盟: true } },
        },
      },
      {
        label: '临阵反戈，劈碎血精死战血煞老祖', hint: '极险死战 · 魔道老怪',
        combat: {
          enemy: 'old_monster',
          win: {
            text: '血坛轰然坍塌！你硬撼老怪十余合，震断铁链放走众修，自己亦在血光中悟透一分杀伐真意。血煞老祖怒极反笑，遁入九幽。',
            effects: { expPct: 0.5, items: ['dao_fruit', 'longxue_jing'], reputation: 120, karma: 70, attrs: { 道心: 9, 根骨: 6 }, relation: { 血煞老祖: -60 }, title: '破坛诛魔', flag: { 血坛死战: true } },
          },
          lose: {
            text: '魔威盖顶，你拼死劈开半边铁链掩护几名弟子逃生，自己重伤坠下骨峰，幸得古树挂住衣袍捡回一命。',
            effects: { hp: -110, injury: 3, karma: 40, reputation: 45, relation: { 血煞老祖: -45 } },
          },
        },
      },
      {
        label: '以奇珍或重诺与血煞交易，赎回正道俘虏', hint: '需灵石 1500 · 智谋两全',
        cost: { stones: 1500 },
        outcome: {
          text: '血煞老祖饶有兴味地收下灵石，挥手解开铁链：「既有正道心肠，又有魔道手腕，有趣。」你带着众人安然下山，正邪两道皆记住了你的名字。',
          effects: { karma: 55, reputation: 80, attrs: { 魅力: 5, 道心: 6 }, relation: { 血煞老祖: 25 }, flag: { 血坛赎人: true } },
        },
      },
    ],
  },

  /* ───────────── NPC 6：林昊（两段式） ───────────── */
  {
    id: 'sd_npc_lin_1', title: '故交 · 残碑争锋', pool: 'world', tier: 3, weight: 8, minRealm: 0,
    once: true,
    text: '青石渡口荒山后，一座塌了半边的古碑正溢出淡淡地脉灵气。你赶到时，一名背负断刀、衣衫洗得发白的年轻修士正守在碑前——是昔年坊市见过的寒门散修林昊。\n\n他手按断刀，目光既警惕又不肯退让半步：「这缕地脉灵气，我守了七天。道友若要，便按江湖规矩办。」',
    choices: [
      {
        label: '提议平分地脉灵气，各守半夜', hint: '广结善缘 · 结交林昊',
        cost: { month: 1 },
        outcome: {
          text: '林昊盯着你看了片刻，缓缓松开刀柄：「痛快。」那一夜你们各占石碑一侧吐纳，天亮时他抱拳道：「他日若有所成，林昊必还你这份情。」',
          effects: { expPct: 0.2, attrs: { 道心: 3, 魅力: 2 }, relation: { 林昊: 30 }, flag: { 识林昊: true } },
        },
      },
      {
        label: '拔剑切磋，胜者独得灵脉', hint: '战斗 · 执刀散修',
        combat: {
          enemy: 'cultivator',
          win: {
            text: '断刀被你震飞三尺，林昊抹去嘴角血丝，反而爽朗一笑：「输得心服！灵气归你，但这份刀债，十年后我再来讨教。」',
            effects: { expPct: 0.3, attrs: { 根骨: 3 }, stones: 160, relation: { 林昊: 25 }, flag: { 识林昊: true, 碑前胜林昊: true } },
          },
          lose: {
            text: '他那柄断刀沉重得惊人，一记重劈逼得你连退十步。林昊收刀分你三成灵气：「既同是苦修人，我不做绝。」',
            effects: { hp: -30, expPct: 0.12, relation: { 林昊: 20 }, flag: { 识林昊: true } },
          },
        },
      },
      {
        label: '拱手相让，并赠一瓶回灵丹', hint: '慷慨托情 · 需回灵丹或灵石 80',
        cost: { stones: 80 },
        outcome: {
          text: '林昊愣了很久，郑重接过丹药记在心底：「{name}，你这人不像修仙的，倒像话本里的侠客。此诺必践！」',
          effects: { karma: 20, attrs: { 道心: 3 }, relation: { 林昊: 40 }, flag: { 识林昊: true } },
        },
      },
    ],
  },
  {
    id: 'sd_npc_lin_2', title: '林昊 · 断刀赴约', pool: 'world', tier: 5, weight: 7, minRealm: 3,
    require: 'flag("识林昊") || rel("林昊") >= 15',
    once: true,
    text: '百年风尘一晃而过。你在西漠古道歇脚时，一阵狂沙卷开，一名玄衣刀修提着一柄重铸过的长刀走入驿站——正是林昊。他眉间多了道旧疤，气机却已凝如渊岳。\n\n他将一坛西漠烈酒重重顿在桌上：「听说前方大墓出土了化神古尸，我独自啃不下。当年欠你的那份情，今日连本带利一起算，敢不敢同去？」',
    choices: [
      {
        label: '饮干烈酒，与林昊并肩闯古墓', hint: '死战 · 太古尸王 · 共分重宝',
        cost: { month: 2 },
        combat: {
          enemy: 'ancient_corpse',
          win: {
            text: '刀剑交错破开千年尸气，古墓石棺轰然炸裂。林昊大笑，将棺中最珍贵的化神灵丹推到你手边：「没有当年渡口那一面，我走不到今日。」',
            effects: { items: ['huashen_dan', 'dao_fruit'], expPct: 0.4, reputation: 70, attrs: { 根骨: 6, 道心: 5 }, relation: { 林昊: 45 }, title: '古道同袍', flag: { 断刀赴约: true } },
          },
          lose: {
            text: '古尸煞气冲天，林昊硬抗一掌护你退出墓门。二人在荒漠篝火旁包扎伤口，虽未得重宝，情分却铁打不动。',
            effects: { hp: -75, injury: 2, items: ['yuanying_dan'], relation: { 林昊: 40 }, flag: { 断刀赴约: true } },
          },
        },
      },
      {
        label: '不闯险墓，只在驿站以刀剑印证百年大道', hint: '以武会友 · 悟性修为大进',
        cost: { month: 1 },
        outcome: {
          text: '你们在驿站外的胡杨林里拆了半夜招，又喝到日出。百年前同为炼气蝼蚁，如今皆成一方大能，相视大笑间，许多执念都散在风里。',
          effects: { expPct: 0.3, attrs: { 悟性: 6, 道心: 6 }, demon: -15, relation: { 林昊: 35 }, items: ['yuanying_dan'], flag: { 断刀赴约: true } },
        },
      },
    ],
  },

  /* ========================================================================
   * 第三篇 · 终局悟法与大乘斩三尸（pool: 'inner' + 'branch'，minRealm 4–8，共 6 节点）
   * ======================================================================== */

  {
    id: 'sd_law_1', title: '化神悟法 · 剑雷双律', pool: 'inner', tier: 5, weight: 7, minRealm: 4,
    once: true,
    text: '化神入定，你神魂离壳登临九霄罡风层。天地不再是山川草木，而化作万千交织的本源线条。\n\n前方两道最炽烈的法则正在云海翻涌：左侧是一线割裂苍穹的孤绝剑意，右侧是代天行罚的紫霄神雷。凡人看之即盲，化神方得窥其一角。',
    choices: [
      {
        label: '凝神参悟「剑之法则」，求一剑破万法', hint: '根骨/悟性检定 · 领悟剑道本源',
        cost: { month: 6 },
        roll: {
          p: 0.55, attrs: { 根骨: 0.01, 悟性: 0.01 },
          success: {
            text: '你忘却一切招式，只盯着那道切割虚空的银线看了半年。睁眼时，静室石壁无风自裂三寸，你已触摸到天地剑律。',
            effects: { items: ['faze_canpian'], attrs: { 根骨: 8, 悟性: 6 }, expPct: 0.4, breakBonus: 8, flag: { 悟剑法则: true }, counter: { laws: 1 } },
          },
          fail: {
            text: '剑意反割神魂，你识海如遭千刃穿刺，只勉强拓印下一缕残锋。',
            effects: { hp: -70, attrs: { 悟性: 3, 根骨: 3 }, demon: 6 },
          },
        },
      },
      {
        label: '引紫霄雷光入体，参悟「雷之法则」', hint: '根骨/道心检定 · 淬炼渡劫底气',
        cost: { month: 6 },
        roll: {
          p: 0.55, attrs: { 根骨: 0.01, 道心: 0.01 },
          success: {
            text: '紫雷洗遍骨髓，剧痛之后是极致的清明。你掌心浮现一道微小的电纹，从此天劫对你而言，不再只是毁灭，也是资粮。',
            effects: { items: ['faze_canpian', 'tianjie_dan'], attrs: { 根骨: 7, 道心: 7 }, expPct: 0.35, breakBonus: 12, flag: { 悟雷法则: true }, counter: { laws: 1 } },
          },
          fail: {
            text: '天威难测，你被雷弧震回肉身，焦烟袅袅，险些损了元神。',
            effects: { hp: -90, injury: 2, attrs: { 根骨: 4 } },
          },
        },
      },
      {
        label: '剑雷兼观而不强求，收心稳固神魂', hint: '稳妥积淀',
        cost: { month: 3 },
        outcome: {
          text: '你知贪多嚼不烂，只在罡风边缘静观三月，将所见脉络记入灵台。',
          effects: { attrs: { 道心: 5, 神识: 5 }, expPct: 0.25, demon: -10 },
        },
      },
    ],
  },

  {
    id: 'sd_law_2', title: '化神悟法 · 光阴与因果', pool: 'inner', tier: 5, weight: 7, minRealm: 4,
    once: true,
    text: '静室枯坐十载，某日檐前一滴雨水忽地悬停在半空。你看见水滴里映出自己过去百年的每一步脚印，又看见无数细如蛛丝的因果金线，从你指尖延向九州四海。\n\n空间折痕、光阴长河、因果罗网——这世间最幽微的三重至理，此刻正朝你敞开一隙。',
    choices: [
      {
        label: '逆溯「光阴法则」一息，窥见岁月真容', hint: '耗寿元 30 年 · 悟性暴涨，得虚空奇晶',
        cost: { month: 6 },
        outcome: {
          text: '你甘愿折去三十年寿元换取一息回溯。雨水倒飞回檐角，枯叶重青的刹那，你终于明白长生并非对抗时间，而是与时间同行。',
          effects: { lifespan: -30, items: ['xukong_jing', 'faze_canpian'], attrs: { 悟性: 10, 神识: 8 }, expPct: 0.45, flag: { 悟光阴法: true }, counter: { laws: 1 } },
        },
      },
      {
        label: '伸手拨动「因果法则」金线', hint: '直面天道仲裁虚影 · 大凶险大造化',
        cost: { month: 3 },
        combat: {
          enemy: 'sky_arbiter',
          win: {
            text: '天道裁决之影被你一念斩散，漫天因果金线随之臣服。你轻轻拂去一段陈年恶果，觉出此生业障竟轻了大半。',
            effects: { items: ['dao_fruit', 'faze_canpian'], karma: 50, attrs: { 气运: 8, 神识: 7, 道心: 6 }, expPct: 0.5, flag: { 悟因果法: true }, counter: { laws: 1 } },
          },
          lose: {
            text: '因果反噬重如山岳，裁决虚影一指点碎你的灵台护罩。你咳血惊醒，雨水早已坠地成泥。',
            effects: { hp: -100, injury: 2, demon: 12, attrs: { 悟性: 4 } },
          },
        },
      },
      {
        label: '静观雨水落下，以「空间折痕」纳须弥于芥子', hint: '神识/悟性检定 · 稳悟空间',
        cost: { month: 4 },
        roll: {
          p: 0.6, attrs: { 神识: 0.012, 悟性: 0.01 },
          success: {
            text: '你指尖微拢，竟将整座静室的方寸空间折进那滴水珠之中。万象归寂，道心自生青莲。',
            effects: { items: ['tiandao_lotus'], attrs: { 神识: 8, 悟性: 6, 道心: 5 }, expPct: 0.35, flag: { 悟空间法: true }, counter: { laws: 1 } },
          },
          fail: {
            text: '空间微澜反震经脉，水滴啪地碎在青砖上。虽未成法，却也添了几分虚实之悟。',
            effects: { hp: -45, attrs: { 神识: 4 } },
          },
        },
      },
    ],
  },

  {
    id: 'sd_law_3', title: '炼虚合道 · 虚空行道', pool: 'inner', tier: 6, weight: 7, minRealm: 5,
    once: true,
    text: '炼虚之境，肉身与神魂半隐太虚。入定深处，你一步迈出山河界壁，落入无光无声的太虚夹层。\n\n脚下没有大地，头顶没有星辰，只有破碎的古界残片与游弋的混沌魔影。炼虚合道，便要在这片虚无里，走出一条只属于自己的路。',
    choices: [
      {
        label: '在太虚深处刻下己道真名，镇杀来犯虚空魔', hint: '死战 · 虚空魔影 · 合道根基',
        cost: { month: 6 },
        combat: {
          enemy: 'void_fiend',
          win: {
            text: '太虚魔影化作纯澈虚空灵流涌入丹田，你的道名在无垠黑暗里亮起一点不灭微光。虚实之间，再难困住你的脚步。',
            effects: { items: ['xukong_jing', 'faze_canpian'], expPct: 0.5, attrs: { 神识: 10, 道心: 8 }, lifespan: 80, breakBonus: 12, flag: { 虚空行道: true } },
          },
          lose: {
            text: '太虚乱流险些撕碎你的神魂，你燃去数口本命精血才跌回洞府，白发竟添了一寸。',
            effects: { hp: -120, injury: 2, lifespan: -20, attrs: { 神识: 4 } },
          },
        },
      },
      {
        label: '深入太虚边缘，狩猎一缕太古混沌气', hint: '极险 · 混沌巨兽 · 得仙灵圣丹',
        cost: { month: 6 },
        combat: {
          enemy: 'chaos_beast',
          win: {
            text: '巨兽哀鸣遁入鸿蒙深处，留下一缕凝如白玉的混沌真气。你将其炼入元神，肉身隐隐生出几分不朽仙韵。',
            effects: { items: ['xianling_dan', 'dao_fruit'], expPct: 0.55, attrs: { 根骨: 10, 神识: 8 }, lifespan: 120, title: '太虚行者', flag: { 虚空行道: true } },
          },
          lose: {
            text: '混沌巨兽一尾扫碎百里虚空，你借残存法则仓皇遁回现世，元神剧震月余。',
            effects: { hp: -140, injury: 3, demon: 10 },
          },
        },
      },
      {
        label: '于虚实交界处垂钓星尘，以无为合天道', hint: '道心/悟性检定 · 润物无声',
        cost: { month: 8 },
        roll: {
          p: 0.6, attrs: { 道心: 0.012, 悟性: 0.01 },
          success: {
            text: '你不争不伐，任由太虚寂风穿身而过。八月之后，你已分不清是自己在呼吸，还是整片虚空在随你吐纳。',
            effects: { attrs: { 道心: 10, 悟性: 9 }, demon: -25, expPct: 0.45, lifespan: 100, breakBonus: 10, flag: { 虚空行道: true } },
          },
          fail: {
            text: '太虚寂寞太甚，你几乎忘了尘世姓名，好在心底一缕旧念把你拉回了人间。',
            effects: { demon: 12, attrs: { 道心: 4, 神识: 4 } },
          },
        },
      },
    ],
  },

  {
    id: 'sd_law_4', title: '合体证道 · 万法归身', pool: 'inner', tier: 6, weight: 6, minRealm: 6,
    once: true,
    text: '合体之关，法与身合，身与道合。你盘坐洞府，周身浮现过往所修诸般神通与法则光环，彼此轰鸣排斥，几乎要将肉身撑裂。\n\n若不能将万法熔于一炉，便永生止步合体，再无望大乘飞升。',
    choices: [
      {
        label: '以己身为炉，强融诸般法则归一', hint: '根骨/道心检定 · 证万法归身',
        cost: { month: 12 },
        roll: {
          p: 0.55, attrs: { 根骨: 0.01, 道心: 0.012 },
          success: {
            text: '一载枯坐，骨血碎而又生。最终百般法则光环尽数收束于丹田一点微光，你举手投足之间，已隐合山河脉动。',
            effects: { expPct: 0.55, attrs: { 根骨: 10, 悟性: 8, 道心: 8 }, lifespan: 150, breakBonus: 15, items: ['dao_fruit'], flag: { 万法归身: true } },
          },
          fail: {
            text: '法则对冲炸裂经脉，你连吐三口金血，只得先散去两道偏门神通保住道基。',
            effects: { hp: -130, injury: 2, attrs: { 悟性: 4 }, demon: 8 },
          },
        },
      },
      {
        label: '借天道青莲压阵，阴阳调和缓缓相融', hint: '需道心 ≥ 45 或 拥有天道青莲',
        require: 'char.attrs.道心 >= 45 || has("tiandao_lotus")', requireHint: '道心未至四十五，且无天道青莲镇压',
        cost: { month: 12 },
        outcome: {
          text: '清莲虚影在泥丸宫徐徐绽放，狂暴的法则灵流如百川归海，再无半分滞涩。此关一过，大乘之路已在脚下铺开。',
          effects: { expPct: 0.5, attrs: { 道心: 12, 神识: 8 }, demon: -30, lifespan: 180, breakBonus: 18, flag: { 万法归身: true } },
        },
      },
      {
        label: '舍繁就简，主动斩去冗余旁门只留主道', hint: '舍得之道 · 稳步精进',
        cost: { month: 6 },
        outcome: {
          text: '你亲手散去繁杂术法，只留一缕最纯粹的本命大道。虽失些许花哨神通，道基却前所未有地浑厚。',
          effects: { expPct: 0.35, attrs: { 道心: 8, 悟性: 6 }, demon: -18, breakBonus: 10 },
        },
      },
    ],
  },

  {
    id: 'sd_law_5', title: '大乘斩三尸 · 善恶二尸', pool: 'inner', tier: 6, weight: 8, minRealm: 7,
    once: true,
    text: '大乘绝巅，飞升近在咫尺，你却感到冥冥中有三道无形枷锁拽住元神——正是古仙口中的「三尸」：善尸执于虚名伪慈，恶尸执于杀伐贪欲，执念尸藏于泥丸最深处。\n\n入定间，白衣善尸与玄衣恶尸同时步出识海，双双冷笑：「斩了我们，你便连人也不算了。」',
    choices: [
      {
        label: '先斩白衣「善尸」，破一切虚名伪道', hint: '道心检定 · 斩善尸，直面执念',
        cost: { month: 6 },
        roll: {
          p: 0.6, attrs: { 道心: 0.012, 悟性: 0.01 },
          success: {
            text: '你直视白衣身影，一剑劈碎漫天虚假赞颂：「行善为心安，不为仙名！」善尸长叹化烟，泥丸宫深处第三道阴影缓缓苏醒。',
            effects: { attrs: { 道心: 10, 悟性: 6 }, demon: -20, expPct: 0.35, flag: { 斩善尸: true } },
            goto: 'sd_law_6',
          },
          fail: {
            text: '善尸句句诛心，唤出你昔日见死不救的旧幕。你心神动摇，退回现世，唯觉眉心沉重如铅。',
            effects: { hp: -90, demon: 15, attrs: { 道心: 3 } },
          },
        },
      },
      {
        label: '先斩玄衣「恶尸」，镇杀千年贪嗔杀念', hint: '死战 · 恶尸心魔 · 斩恶尸',
        cost: { month: 6 },
        combat: {
          enemy: 'heart_demon',
          win: {
            text: '黑雾崩散，恶尸临灭前大笑：「杀念易除，执念难消！」识海深处，一道穿着你年少旧衣的身影正缓缓抬起头。',
            effects: { attrs: { 根骨: 8, 道心: 8 }, demon: -25, expPct: 0.4, flag: { 斩恶尸: true } },
            goto: 'sd_law_6',
          },
          lose: {
            text: '恶尸借你过往血孽化作狂澜，你强行稳住灵台退出入定，浑身冷汗淋漓。',
            effects: { hp: -120, injury: 2, demon: 18 },
          },
        },
      },
      {
        label: '剑起鸿蒙，善恶二尸一并斩之', hint: '极高门槛 · 需道心 ≥ 55 且 神识 ≥ 50',
        require: 'char.attrs.道心 >= 55 && char.attrs.神识 >= 50', requireHint: '道心或神识火候未足，强斩恐道消身死',
        cost: { month: 12 },
        outcome: {
          text: '你双目如电，一念之间同时劈碎善恶双影。识海清明如万里长空，唯有最深处那尊执念尸，静静立在旧年的风雪里等你。',
          effects: { attrs: { 道心: 14, 神识: 10, 悟性: 8 }, demon: -35, expPct: 0.5, flag: { 斩善尸: true, 斩恶尸: true } },
          goto: 'sd_law_6',
        },
      },
    ],
  },

  {
    id: 'sd_law_6', title: '大乘斩三尸 · 执念尸', pool: 'branch', tier: 6, weight: 0,
    text: '善恶既去，泥丸宫深处只剩最后一道身影——它穿着你初入仙途时的粗布旧衫，眼里亮着最初那点不甘平凡的孤火。\n\n它没有拔剑，只轻声问你：「{name}，若连你为何踏上仙途的执念也一并斩去，明日飞升九霄的那个无情神仙，还是你吗？」',
    choices: [
      {
        label: '挥剑斩断执念尸，彻底无垢以迎天劫', hint: '死战 · 天道试炼 · 斩三尸圆满，飞升成算大增',
        cost: { month: 12 },
        combat: {
          enemy: 'sky_arbiter',
          win: {
            text: '剑落无声，旧衫身影含笑化作满天金雨。从此你与尘世再无半点拖曳，九霄之上天门隐现，似在静候你渡劫而来。',
            effects: { items: ['tianjie_dan', 'xianling_dan'], expPct: 0.6, attrs: { 道心: 15, 神识: 12, 悟性: 10 }, demon: -50, lifespan: 300, breakBonus: 25, title: '斩三尸尊者', flag: { 斩三尸圆满: true } },
          },
          lose: {
            text: '临落剑那半息你终究迟疑了。天道余威震伤元神，执念尸退回识海深处，只留一声轻叹。',
            effects: { hp: -130, injury: 2, attrs: { 道心: 6 }, breakBonus: 8 },
          },
        },
      },
      {
        label: '收剑入怀：「我不斩你——我带着你一起飞升」', hint: '以红尘本心证道 · 三尸合一',
        cost: { month: 12 },
        outcome: {
          text: '你走上前，伸手握住旧衫身影微凉的手。它微微一怔，随即化作一道温暖金光融入你的心口。\n\n原来真正能渡过九重天劫的，从不是无情木石，而是历经万年仍未冷透的本心。',
          effects: { items: ['dao_fruit', 'tiandao_lotus'], expPct: 0.55, attrs: { 道心: 18, 气运: 10, 悟性: 8 }, demon: -40, lifespan: 260, breakBonus: 22, title: '本心合道', flag: { 三尸合一: true, 斩三尸圆满: true } },
        },
      },
      {
        label: '暂封执念于灵台，待九重天劫中再作了断', hint: '稳妥积蓄 · 延寿净心',
        cost: { month: 3 },
        outcome: {
          text: '你向旧日的自己拱手一礼，将其安放于灵台深处。虽未彻底斩落，胸中气息却沉厚如渊，随时可叩渡劫之门。',
          effects: { expPct: 0.35, attrs: { 道心: 10 }, demon: -20, lifespan: 150, breakBonus: 12 },
        },
      },
    ],
  },
];
