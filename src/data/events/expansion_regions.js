/**
 * 九州八域风物志扩展包（ink 风格多段织网叙事）：
 * 覆盖青牛山脉、落霞仙城、苍茫妖森、东海归墟、北荒魔域、中州圣域、昆仑墟界、九霄天门八大疆域。
 * 每域均含多段 goto 分支链与高重玩度独立奇遇，并带有 region 元数据以供疆域探索筛选。
 */
export const REGION_EXPANSION = [
  /* ===================== 一、青牛山脉（qingniu，炼气起步） ===================== */
  {
    id: 'reg_qingniu_spring_1',
    title: '青牛 · 荒山灵泉',
    region: 'qingniu',
    pool: 'wild',
    tier: 2,
    weight: 8,
    minRealm: 0,
    maxRealm: 2,
    once: true,
    text: '青牛山北麓雾谷深处，一泓乳白灵泉自青石缝间涌出，泉面飘着细碎灵气。\n\n泉畔已先到了两名灰衣散修，正背靠石壁与一头伏低身躯的青背老狼对峙。见你提剑步入雾中，老狼喉间发出低吼，两名散修的眼神也陡然冷了下来。',
    choices: [
      {
        label: '先斩妖狼，再与散修平分灵泉',
        hint: '仗剑解围 · 易得善缘',
        cost: { month: 1 },
        combat: {
          enemy: 'wolf',
          win: {
            text: '剑锋划开山雾，青背老狼哀鸣倒地。两名散修收起戒备，抱拳让出半边泉眼：「道友出手利落，这口灵泉咱们各取一半。」',
            effects: { karma: 12, reputation: 10, flag: { 青牛平分灵泉: true } },
            goto: 'reg_qingniu_spring_2',
          },
          lose: {
            text: '妖狼扑势太猛，在你臂上撕开一道血口。你借势退入密林，隐约听见两名散修趁乱奔逃的脚步声。',
            effects: { hp: -25, injury: 1 },
          },
        },
      },
      {
        label: '横剑立于泉前，清场独享灵眼',
        hint: '强硬夺泉 · 需击退散修',
        cost: { month: 1 },
        combat: {
          enemy: 'bandit',
          win: {
            text: '你一剑震飞为首散修的短刀，妖狼闻血气惊逃，余人亦不敢再争。整座雾谷骤然安静下来，唯余灵泉叮咚作响。',
            effects: { karma: -10, stones: 35, flag: { 青牛独夺灵泉: true } },
            goto: 'reg_qingniu_spring_2',
          },
          lose: {
            text: '两名散修合击颇有章法，你被迫跃出雾谷，回头只见灵雾已将山坳吞没。',
            effects: { hp: -30, injury: 1 },
          },
        },
      },
      {
        label: '隐身石后，待两败俱伤再取一葫芦泉水',
        hint: '气运与神识检定 · 避战图利',
        roll: {
          p: 0.55,
          attrs: { 气运: 0.012, 神识: 0.01 },
          success: {
            text: '半炷香后人狼俱散，你从石后走出，从容灌满一葫芦灵泉。泉水入喉清冽，经脉顿时温热起来。',
            effects: { items: ['huiling_dan'], expPct: 0.16, karma: -5 },
          },
          fail: {
            text: '你刚探出身形，便被惊惶逃窜的妖狼扫了一爪。灵泉没捞着，反落了一身狼狈。',
            effects: { hp: -22 },
          },
        },
      },
    ],
  },
  {
    id: 'reg_qingniu_spring_2',
    title: '青牛 · 泉底青匣',
    region: 'qingniu',
    pool: 'branch',
    tier: 2,
    weight: 0,
    text: (s) => `泉雾散尽，水面清澈见底。${s.flags['青牛平分灵泉'] ? '那两名散修装满水囊便拱手告辞，临走前还指了指泉底反光处。' : '你独自守着泉眼，俯身掬水时，指尖忽然碰到泉底一块方正青石。'}\n\n拂去砂砾，竟是一只封蜡已半融的旧石匣，隐有药香渗出。`,
    choices: [
      {
        label: '起出石匣，收下丹药与灵草',
        hint: '稳妥收获 · 得修道资粮',
        outcome: {
          text: '石匣虽旧，蜡封尚存三分灵性。里面静放着两枚引气丹、一株百年灵草，还有几块磨得发亮的碎灵石。',
          effects: { items: ['yinqi_dan', 'lingcao'], stones: 55, expPct: 0.18 },
        },
      },
      {
        label: '借灵泉水气盘坐一月，温养经脉',
        hint: '耗一月光阴 · 夯实根骨与寿元',
        cost: { month: 1 },
        outcome: {
          text: '你把石匣暂放一旁，赤足浸入泉中吐纳三十日。山风过耳，丹田灵气比往日凝实了许多。',
          effects: { expPct: 0.28, attrs: { 根骨: 2, 道心: 1 }, lifespan: 3, items: ['yinqi_dan'] },
        },
      },
      {
        label: '以神识细察匣底夹层',
        hint: '神识 ≥ 12 · 暗藏古修护身符',
        require: 'char.attrs.神识 >= 12',
        requireHint: '神识不足十二，难察暗格',
        outcome: {
          text: '你指腹摩挲匣底纹路，咔哒一声弹开暗格。夹层里静躺着一张朱砂未褪的护心符，显是某位青牛老散修的压箱底之物。',
          effects: { items: ['huxin_fu', 'yinqi_dan'], attrs: { 神识: 2 }, flag: { 青牛泉秘: true } },
        },
      },
    ],
  },
  {
    id: 'reg_qingniu_stele',
    title: '青牛 · 古剑碑残韵',
    region: 'qingniu',
    pool: 'wild',
    tier: 2,
    weight: 7,
    minRealm: 0,
    maxRealm: 3,
    text: '青牛山断崖边矗着半截青石碑，碑文字迹早被百年山雨冲平，唯有一道斜贯碑身的剑痕至今锋芒未散。\n\n秋风吹过剑痕，发出极轻的嗡鸣，似有古人在此挥出一剑后便再未回头。',
    choices: [
      {
        label: '静坐碑前，以指临摹剑痕走势',
        hint: '悟性检定 · 参悟剑意',
        cost: { month: 1 },
        roll: {
          p: 0.55,
          attrs: { 悟性: 0.015, 根骨: 0.008 },
          success: {
            text: '你在碑前坐到星斗偏西，指尖终于跟上了那道剑痕的起落。一缕森然剑韵入目，你出招的迟滞感散去不少。',
            effects: { attrs: { 悟性: 2, 根骨: 2 }, expPct: 0.22 },
          },
          fail: {
            text: '那道剑痕太高远，你看得眼眶发酸，只勉强悟出一分凝神静气的法门。',
            effects: { exp: 65, attrs: { 道心: 1 } },
          },
        },
      },
      {
        label: '拔剑引动碑中残韵',
        hint: '太玄弟子或根骨 ≥ 10 · 以锋对锋',
        require: 'sect() == "taixuan" || char.attrs.根骨 >= 10',
        requireHint: '剑骨未成，难以承接残韵',
        cost: { month: 1 },
        outcome: {
          text: '剑脊与石碑轻触，一声清越剑鸣震落满崖枯叶。残韵顺着腕脉倒灌而入，令你气血翻涌却痛快淋漓。',
          effects: { expPct: 0.3, attrs: { 根骨: 2, 道心: 1 }, flag: { 青牛悟剑: true } },
        },
      },
      {
        label: '采下碑基石缝里滋生的寒灵草',
        hint: '稳妥 · 得灵材与薄利',
        outcome: {
          text: '你不敢久留寒风里，小心撬下碑根处一株吸足剑气的灵草，收进药囊便下山去。',
          effects: { items: ['lingcao'], stones: 25 },
        },
      },
    ],
  },
  {
    id: 'reg_qingniu_market',
    title: '青牛 · 散修黑市暗语',
    region: 'qingniu',
    pool: 'world',
    tier: 2,
    weight: 8,
    minRealm: 0,
    maxRealm: 3,
    text: '暮色压进青牛镇外废弃砖窑，七八名披蓑戴笠的散修点着幽绿兽油灯，在碎砖间席地摆摊。\n\n守窑的独眼老修敲了两下铜钵，哑着嗓子问：「山风紧，道友今夜是买明路货，还是问暗门事？」',
    choices: [
      {
        label: '掏出灵石，赌一瓶无签蜡封丹',
        hint: '气运检定 · 80 灵石博聚灵丹',
        require: 'stones >= 80',
        requireHint: '灵石不足八十',
        cost: { stones: 80 },
        roll: {
          p: 0.55,
          attrs: { 气运: 0.012, 神识: 0.01 },
          success: {
            text: '你拨开蜡封一嗅，清冽药香直冲灵台——竟是一枚货真价实的聚灵丹，老修气得胡子直翘。',
            effects: { items: ['juling_dan'], attrs: { 气运: 1 } },
          },
          fail: {
            text: '蜡封里不过是一枚受潮的引气丹，药力已散了大半。黑市规矩落手不退，你只当买了次教训。',
            effects: { items: ['yinqi_dan'] },
          },
        },
      },
      {
        label: '以江湖暗语向老修买一则山野秘闻',
        hint: '耗 30 灵石 · 增神识与气运',
        require: 'stones >= 30',
        requireHint: '灵石不足三十',
        cost: { stones: 30 },
        outcome: {
          text: '老修收起灵石，低声说了三处避妖小径与一处古修藏丹旧闻。你记在心里，日后行山省了不少弯路。',
          effects: { attrs: { 神识: 2, 气运: 1 }, reputation: 8, flag: { 青牛黑市客: true } },
        },
      },
      {
        label: '见角落邪修兜售血丹，提剑将其格杀',
        hint: '除魔卫道 · 战邪修',
        combat: {
          enemy: 'rogue',
          win: {
            text: '剑光掠过绿灯，那名邪修未及祭出毒幡便伏诛当场。窑中散修纷纷避让，你从其储物袋中清出灵石与疗伤药。',
            effects: { stones: 120, items: ['liaoshang_dan'], karma: 15, reputation: 15 },
          },
          lose: {
            text: '邪修扬出一把毒灰，趁黑遁出砖窑。你捂着刺痛的胸口退走，暗暗记下此人面貌。',
            effects: { hp: -32, injury: 1 },
          },
        },
      },
      {
        label: '不涉是非，买两张神行符便离开',
        hint: '50 灵石 · 备好脚力',
        require: 'stones >= 50',
        requireHint: '灵石不足五十',
        cost: { stones: 50 },
        outcome: {
          text: '你付过灵石，把两张折得整整齐齐的神行符揣入袖中，转身没入夜色。',
          effects: { items: ['shenxing_fu', 'shenxing_fu'] },
        },
      },
    ],
  },

  /* ===================== 二、落霞仙城（luoxia，繁华仙市） ===================== */
  {
    id: 'reg_luoxia_auction_1',
    title: '落霞 · 拍卖场外暗流',
    region: 'luoxia',
    pool: 'world',
    tier: 3,
    weight: 7,
    minRealm: 0,
    maxRealm: 4,
    once: true,
    text: '落霞仙城夜市灯火如星，万宝楼拍卖方散。你在青石长街喝茶歇脚，见一名青袍执事怀抱紫檀锦盒匆匆拐入无灯小巷，身后三名黑衣人贴墙跟进，指间隐有寒芒。',
    choices: [
      {
        label: '执剑入巷，拦下三名黑衣人',
        hint: '正面迎敌 · 开启落霞暗契线',
        cost: { month: 1 },
        combat: {
          enemy: 'bandit',
          win: {
            text: '短兵相接不过十合，黑衣人见仙城巡卫铜锣渐近，丢下两具尸体遁入屋脊。青袍执事按着伤口，朝你深深一揖。',
            effects: { karma: 18, reputation: 18, flag: { 落霞援手: true } },
            goto: 'reg_luoxia_auction_2',
          },
          lose: {
            text: '暗巷狭窄难展剑势，你替对方挡下一刀后被迫退回长街。好在巡卫赶到，黑衣人未能得手。',
            effects: { hp: -35, injury: 1, karma: 10 },
          },
        },
      },
      {
        label: '高声借巡卫旗号喝破其行藏',
        hint: '魅力与道心检定 · 智解危局',
        roll: {
          p: 0.58,
          attrs: { 魅力: 0.014, 道心: 0.01 },
          success: {
            text: '你一声清喝震动半条长街，楼上茶客纷纷探窗张望。黑衣人投鼠忌器，冷冷瞪你一眼便退散无踪。',
            effects: { reputation: 20, karma: 12, flag: { 落霞智解: true } },
            goto: 'reg_luoxia_auction_2',
          },
          fail: {
            text: '无人应和你的喝声，反倒引来一记暗镖擦肩而过。黑衣人与青袍执事转瞬消失在巷尾。',
            effects: { hp: -22, reputation: -5 },
          },
        },
      },
      {
        label: '置身事外，只顺手拾起巷口跌落的玉瓶',
        hint: '不沾因果 · 得小利',
        outcome: {
          text: '待巷中喧闹平息，你弯腰拾起滚落墙角的白玉小瓶，里面竟剩着一枚回灵丹与几十块散碎灵石。',
          effects: { items: ['huiling_dan'], stones: 65, karma: -10 },
        },
      },
    ],
  },
  {
    id: 'reg_luoxia_auction_2',
    title: '落霞 · 暗巷旧托',
    region: 'luoxia',
    pool: 'branch',
    tier: 3,
    weight: 0,
    text: '巷尾檐下挂着半盏残灯，青袍执事摘下兜帽，露出一张清瘦沉静的脸：「在下万宝阁外事执事沈砚。方才盒中所藏并非灵草，而是通往东海珊瑚海市的一纸暗契。」\n\n他抬眼看你：「那群人背后是血魔宗在城中的暗桩。道友若愿帮我查清内鬼，这纸暗契的副券可归你所有。」',
    choices: [
      {
        label: '接下暗契副券，顺藤摸瓜查明幕后',
        hint: '深入追查 · 步入暗战终局',
        cost: { month: 1 },
        outcome: {
          text: '你接过冰凉的鲛皮暗契，循着黑衣人遗落的暗红令牌，三日后锁定了城西晚霞楼顶层的接头密室。',
          effects: { attrs: { 神识: 2, 气运: 2 }, flag: { 落霞暗契: true } },
          goto: 'reg_luoxia_auction_3',
        },
      },
      {
        label: '亮出万宝阁腰牌，直接接管此案',
        hint: '万宝阁弟子专属 · 宗门贡献丰厚',
        require: 'sect() == "wanbao"',
        requireHint: '仅万宝阁弟子可行',
        outcome: {
          text: '沈砚见腰牌神色一肃，立刻奉上全部卷宗与线人名册。你不动声色调动商行眼线，很快揪出幕后真凶。',
          effects: { contribution: 260, stones: 280, flag: { 落霞暗契: true } },
          goto: 'reg_luoxia_auction_3',
        },
      },
      {
        label: '不愿再涉浑水，只收应得的诊金谢礼',
        hint: '见好就收 · 稳拿灵石与丹药',
        outcome: {
          text: '沈砚并未强求，爽快奉上一袋灵石与一枚聚灵丹：「今日救命之恩，万宝阁记下了。」',
          effects: { stones: 220, items: ['juling_dan'], reputation: 15 },
        },
      },
    ],
  },
  {
    id: 'reg_luoxia_auction_3',
    title: '落霞 · 晚霞听楼',
    region: 'luoxia',
    pool: 'branch',
    tier: 3,
    weight: 0,
    text: '酉时残阳烧红落霞城墙，晚霞楼顶层雅间却静得落针可闻。桌案对面坐着一名披灰袍的血魔宗暗桩，手指轻叩茶盏：「沈砚请来的帮手？你把暗契留下，这箱灵石尽归你。」',
    choices: [
      {
        label: '掀翻茶案，当场斩杀血魔暗桩',
        hint: '硬战血魔弟子 · 声望与重赏兼得',
        combat: {
          enemy: 'blood_cult',
          win: {
            text: '剑气震碎雕花窗棂，晚霞照亮一地冷血。你搜出暗桩怀中的密信交给万宝阁，落霞城中暗流就此平息。',
            effects: { stones: 450, items: ['dahuan_dan'], reputation: 45, karma: 25, flag: { 落霞除桩: true }, counter: { secrets: 1 } },
          },
          lose: {
            text: '对方血气诡谲，硬撼之下你震伤肺腑。所幸万宝阁护卫闻声赶至，暗桩弃赃而逃。',
            effects: { hp: -65, injury: 1, stones: 150, reputation: 15 },
          },
        },
      },
      {
        label: '以神识封门，亮出万宝阁铁令逼其吐赃',
        hint: '神识 ≥ 16 或万宝阁弟子 · 不战而屈人',
        require: 'char.attrs.神识 >= 16 || sect() == "wanbao"',
        requireHint: '神识不足十六，难慑此獠',
        outcome: {
          text: '你神识锁住雅间阵眼，楼下护卫甲胄声齐齐响起。暗桩脸色发青，只得留下赃物与名单，破窗狼狈逃遁。',
          effects: { stones: 380, items: ['huxin_fu', 'qingxin_dan'], reputation: 38, attrs: { 悟性: 2 }, counter: { secrets: 1 } },
        },
      },
      {
        label: '收下那箱灵石，放其悄然离城',
        hint: '暗中交易 · 得巨款而损道心',
        outcome: {
          text: '你合上箱盖，目送灰袍人消失在暮色屋檐间。灵石沉手，只是茶凉得比往日更快。',
          effects: { stones: 650, karma: -30, demon: 6 },
        },
      },
    ],
  },
  {
    id: 'reg_luoxia_tianji',
    title: '落霞 · 天机阁测命',
    region: 'luoxia',
    pool: 'world',
    tier: 3,
    weight: 7,
    minRealm: 0,
    maxRealm: 5,
    text: '落霞城东巷尾有座无窗青砖楼，悬匾「天机」。素纱帘后坐着一位白须盲卦师，三枚古铜钱在龟甲中轻轻碰撞。\n\n「来者脚步未乱，」盲卦师淡声开口，「是要算今岁祸福，还是问此生道途？」',
    choices: [
      {
        label: '奉百枚灵石，请先生起一卦道途签',
        hint: '气运检定 · 100 灵石卜吉凶',
        require: 'stones >= 100',
        requireHint: '灵石不足一百',
        cost: { stones: 100 },
        roll: {
          p: 0.6,
          attrs: { 气运: 0.012, 悟性: 0.01 },
          success: {
            text: '铜钱落地三阳开泰。盲卦师轻笑：「卦象云开见月，道友近期逢水遇木皆为生机。」你听完只觉心头豁亮。',
            effects: { attrs: { 气运: 4, 悟性: 2 }, expPct: 0.18, flag: { 天机吉卦: true } },
          },
          fail: {
            text: '卦象隐晦难明，盲卦师默然良久，只赠你八字：「戒急用忍，守心不移。」虽未得横财，焦躁却消去大半。',
            effects: { attrs: { 道心: 3 }, demon: -10 },
          },
        },
      },
      {
        label: '只求一句破妄心言，不卜吉凶',
        hint: '30 灵石 · 涤荡心魔',
        require: 'stones >= 30',
        requireHint: '灵石不足三十',
        cost: { stones: 30 },
        outcome: {
          text: '盲卦师收起铜钱：「命数在天，脚印在人。你既不问吉凶，便已胜过半数问卦者。」一语如清钟入耳。',
          effects: { demon: -15, attrs: { 道心: 3 } },
        },
      },
      {
        label: '暗运神识，窥探素帘后的八卦阵势',
        hint: '神识 ≥ 18 · 偷师天机阵理',
        require: 'char.attrs.神识 >= 18',
        requireHint: '神识不足十八，易遭反噬',
        roll: {
          p: 0.55,
          attrs: { 神识: 0.012, 悟性: 0.012 },
          success: {
            text: '帘后哪有什么奇阵，不过三柱清香与九块灵玉排成的周天位。你一眼看破其中流转之意，获益匪浅。',
            effects: { attrs: { 神识: 4, 悟性: 3 }, reputation: 15 },
          },
          fail: {
            text: '神识刚触帘幕，便被一股柔中带刺的卦意弹回。盲卦师轻咳一声：「小友手伸得太长了。」',
            effects: { hp: -28, demon: 4 },
          },
        },
      },
    ],
  },
  {
    id: 'reg_luoxia_pill',
    title: '落霞 · 仙城丹阁试药',
    region: 'luoxia',
    pool: 'world',
    tier: 2,
    weight: 8,
    minRealm: 0,
    maxRealm: 3,
    text: '丹霞谷驻落霞分阁门前悬着红榜：新成一炉「清灵散」，诚邀根骨扎实之修试药，酬以灵石与丹药。\n\n药香浓得化不开，几名青衣药童守在炉边，额角却隐隐渗汗，显是此炉火候略有偏差。',
    choices: [
      {
        label: '揭榜服药，以自身经脉硬炼药力',
        hint: '根骨检定 · 报酬丰厚但有药毒风险',
        cost: { month: 1 },
        roll: {
          p: 0.58,
          attrs: { 根骨: 0.014, 道心: 0.008 },
          success: {
            text: '药力如烈火游走百脉，你稳守丹田徐徐化开，非但无碍，反借烈药冲开一处细微滞涩。丹阁掌事大喜，依约重酬。',
            effects: { stones: 160, items: ['qingxin_dan'], attrs: { 根骨: 2 }, expPct: 0.2 },
          },
          fail: {
            text: '药性偏燥，烧得你喉头腥甜。掌事忙奉上疗伤丹与诊金赔礼，你调息半月方才平复。',
            effects: { hp: -35, stones: 110, items: ['liaoshang_dan'] },
          },
        },
      },
      {
        label: '轻嗅丹烟，点破此炉收火过急之弊',
        hint: '悟性 ≥ 14 或丹霞谷弟子 · 以识换酬',
        require: 'char.attrs.悟性 >= 14 || sect() == "danxia"',
        requireHint: '丹道悟性不足，难辨火候',
        outcome: {
          text: '你指明药烟中夹着一丝焦苦，需佐以冰泉缓火。丹阁长老闻言出迎，拱手致谢，赠你灵石与一枚聚灵丹。',
          effects: { stones: 200, items: ['juling_dan'], reputation: 22, attrs: { 悟性: 2 } },
        },
      },
      {
        label: '不试险药，顺手折价买两束余草离开',
        hint: '40 灵石 · 购得百年灵草',
        require: 'stones >= 40',
        requireHint: '灵石不足四十',
        cost: { stones: 40 },
        outcome: {
          text: '你挑了两束品相尚佳的百年灵草装入储物袋，绕开喧闹的丹阁门口。',
          effects: { items: ['lingcao', 'lingcao'] },
        },
      },
    ],
  },

  /* ===================== 三、苍茫妖森（yaosen，筑基险地） ===================== */
  {
    id: 'reg_yaosen_lotus_1',
    title: '妖森 · 碧眼妖猿护灵药',
    region: 'yaosen',
    pool: 'wild',
    tier: 4,
    weight: 6,
    minRealm: 1,
    maxRealm: 5,
    once: true,
    text: '苍茫妖森古木蔽日，深谷寒潭中竟挺立一株七叶青莲。莲蓬隐泛金丝，灵韵直透神魂，依古籍所载，分明是天道莲子的雏形。\n\n潭边磐石上蹲着一头丈高碧眼妖猿，臂骨如铁，碧瞳冷冷锁住你的咽喉。',
    choices: [
      {
        label: '提剑入谷，与碧眼妖猿正面决胜',
        hint: '力战妖猿 · 夺取青莲归属',
        cost: { month: 1 },
        combat: {
          enemy: 'spirit_ape',
          win: {
            text: '妖猿怒吼震落古木枯枝，终被你一剑逼退十丈。它捂着肩伤深深望了青莲一眼，跃入密林深处。',
            effects: { expPct: 0.24, attrs: { 根骨: 2 }, flag: { 妖猿败退: true } },
            goto: 'reg_yaosen_lotus_2',
          },
          lose: {
            text: '妖猿铁拳裹挟巨力砸来，震得你虎口崩裂。你不敢恋战，借密林藤蔓遁出深谷。',
            effects: { hp: -60, injury: 1 },
          },
        },
      },
      {
        label: '奉上灵石所换灵果丹香，与妖猿分莲示好',
        hint: '180 灵石 · 魅力与气运检定',
        require: 'stones >= 180',
        requireHint: '灵石不足一百八十',
        cost: { stones: 180 },
        roll: {
          p: 0.6,
          attrs: { 魅力: 0.012, 气运: 0.012 },
          success: {
            text: '你解下腰间灵药与聚灵玉屑置于石前，缓步后退。碧眼妖猿嗅了嗅药香，竟低吼一声，侧身让开半条通往寒潭的小径。',
            effects: { karma: 18, flag: { 妖猿让药: true } },
            goto: 'reg_yaosen_lotus_2',
          },
          fail: {
            text: '妖猿一掌拍碎玉匣，显然不信人族修士。你只得翻身避过劲风，匆匆退走。',
            effects: { hp: -32 },
          },
        },
      },
      {
        label: '绕到下风处潜行，仅采潭外千年灵草',
        hint: '避其锋芒 · 稳获高阶灵材',
        cost: { month: 1 },
        outcome: {
          text: '你敛息贴地而行，未惊动石上妖猿，只摘走寒潭外缘借莲气长成的千年灵草，从容退去。',
          effects: { items: ['qiannian_lingcao'], attrs: { 神识: 2 } },
        },
      },
    ],
  },
  {
    id: 'reg_yaosen_lotus_2',
    title: '妖森 · 青莲初绽',
    region: 'yaosen',
    pool: 'branch',
    tier: 4,
    weight: 0,
    text: (s) => `子时月光穿透树冠，落进寒潭。${s.flags['妖猿让药'] ? '碧眼妖猿蹲在远石上静静守望，并未阻拦。' : '潭畔再无阻碍，唯有夜风吹得莲叶沙沙作响。'}\n\n七叶青莲缓缓舒展，莲蓬里三粒莲子晶莹如玉，正中那一粒金纹流转，被一层薄薄的天然灵膜护住。`,
    choices: [
      {
        label: '以神识温养灵膜，采下金纹天道莲子',
        hint: '神识与悟性检定 · 有望得天道莲子',
        roll: {
          p: 0.58,
          attrs: { 神识: 0.012, 悟性: 0.012 },
          success: {
            text: '你的神识如春水般融化灵膜，金纹莲子轻落掌心，顿时清香满谷。你速将其收入玉匣，不敢怠慢。',
            effects: { items: ['tiandao_lotus'], attrs: { 悟性: 3, 道心: 3 }, flag: { 得天道莲子: true } },
            goto: 'reg_yaosen_lotus_3',
          },
          fail: {
            text: '灵膜受惊骤裂，金纹莲子化作一道青光沉入潭底。你只抢下两片沾满莲露的灵叶与一株千年灵草。',
            effects: { items: ['qiannian_lingcao'], hp: -30, attrs: { 神识: 2 } },
            goto: 'reg_yaosen_lotus_3',
          },
        },
      },
      {
        label: '只取外围凡莲与灵露，留金纹莲子于山谷',
        hint: '留一线生机 · 道心与善缘大增',
        outcome: {
          text: '你指尖一转，采下外侧莲露与灵草，完好保留了那粒金纹莲子。寒潭清波微荡，似有灵性相谢。',
          effects: { items: ['dahuan_dan', 'qiannian_lingcao'], karma: 28, attrs: { 道心: 4 } },
          goto: 'reg_yaosen_lotus_3',
        },
      },
      {
        label: '不采莲子，趁月华盘坐潭边悟道两月',
        hint: '耗两月 · 修为与寿元大进',
        cost: { month: 2 },
        outcome: {
          text: '你守着青莲吞吐月华六十日，直到莲谢落泥。起身时四肢轻灵，寿元与根骨皆悄然拔升。',
          effects: { expPct: 0.42, attrs: { 根骨: 3, 神识: 3 }, lifespan: 12, counter: { secrets: 1 } },
        },
      },
    ],
  },
  {
    id: 'reg_yaosen_lotus_3',
    title: '妖森 · 莲香引客',
    region: 'yaosen',
    pool: 'branch',
    tier: 4,
    weight: 0,
    text: '莲香随山风飘出十里，林间顿起阵阵妖嚎。一名早已潜伏在树冠上的灰袍筑基散修跃下拦路，目光死死盯着你腰间药囊：「山野灵物，见者有份。道友把玉匣留下吧。」',
    choices: [
      {
        label: '拔剑斩断其去路，以战立威',
        hint: '战筑基修士 · 夺其储物袋',
        combat: {
          enemy: 'cultivator',
          win: {
            text: '林间剑气纵横，灰袍散修护体灵罩碎裂，吐血倒飞。你收剑入鞘，清点其遗留灵石后从容出森。',
            effects: { stones: 340, reputation: 35, expPct: 0.2, counter: { secrets: 1 } },
          },
          lose: {
            text: '对方蓄谋已久，一记暗雷震伤你的经脉。你拼着受创突围而出，总算保住了身上灵物。',
            effects: { hp: -55, injury: 1 },
          },
        },
      },
      {
        label: '激发神行符，借浓雾瞬间甩开追兵',
        hint: '消耗神行符 · 无伤脱身',
        require: 'has("shenxing_fu")',
        requireHint: '行囊中无神行符',
        cost: { item: 'shenxing_fu' },
        outcome: {
          text: '清风缠足，你身形化作残影掠过十丈古树。身后骂声很快被夜雾吞没。',
          effects: { attrs: { 气运: 2 }, expPct: 0.12, counter: { secrets: 1 } },
        },
      },
      {
        label: '掷出一株百年灵草作饵，趁乱脱身',
        hint: '消耗百年灵草 · 舍小保大',
        require: 'has("lingcao")',
        requireHint: '行囊中无百年灵草',
        cost: { item: 'lingcao' },
        outcome: {
          text: '你佯装失手将灵草抛向林侧，灰袍人下意识伸手去接，再抬头时你已遁入幽深雾林。',
          effects: { attrs: { 悟性: 2 }, counter: { secrets: 1 } },
        },
      },
    ],
  },
  {
    id: 'reg_yaosen_python',
    title: '妖森 · 百丈毒蟒潭',
    region: 'yaosen',
    pool: 'wild',
    tier: 3,
    weight: 7,
    minRealm: 1,
    maxRealm: 4,
    text: '腐叶铺满墨绿毒潭，紫黑瘴气贴着水面翻涌。潭心枯木上生着一株通体赤红的灵草，水面忽起巨浪，一条水桶粗的毒蟒缓缓昂首，碧绿毒涎滴落处连岩石都冒起白烟。',
    choices: [
      {
        label: '迎瘴而上，斩毒蟒取蛇胆与赤草',
        hint: '战百丈毒蟒 · 战利品极丰',
        combat: {
          enemy: 'poison_python',
          win: {
            text: '你避开毒雾直刺七寸，毒蟒翻腾数圈沉入潭底。你剖得一枚温热蛇胆，又将潭心赤草连根收入玉盒。',
            effects: { items: ['qiannian_lingcao', 'dahuan_dan'], stones: 260, attrs: { 根骨: 3 } },
          },
          lose: {
            text: '毒瘴入肺令你头晕目眩，毒蟒尾扫如鞭。你强撑一口灵气逃出密林，连吐数口黑血。',
            effects: { hp: -65, injury: 1 },
          },
        },
      },
      {
        label: '隔岸遥发剑气，削草入怀即走',
        hint: '神识与气运检定 · 险中求速',
        roll: {
          p: 0.55,
          attrs: { 神识: 0.012, 气运: 0.01 },
          success: {
            text: '剑气精准斩断枯木根茎，你袖风一卷将赤草摄回掌中，不等毒蟒扑岸便已退入高枝。',
            effects: { items: ['qiannian_lingcao'], expPct: 0.16 },
          },
          fail: {
            text: '剑气惊醒毒蟒，一口碧毒凌空喷来。你仓促侧身，衣角与小臂仍被毒雾灼出焦痕。',
            effects: { hp: -42 },
          },
        },
      },
      {
        label: '不惊凶兽，在潭外采集伴生避毒灵草',
        hint: '稳妥 · 得清心丹与灵草',
        outcome: {
          text: '毒物百步之内必有解草。你绕着上风处采满药囊，又以草汁凝成一枚清心丹方才折返。',
          effects: { items: ['lingcao', 'qingxin_dan'], attrs: { 道心: 1 } },
        },
      },
    ],
  },
  {
    id: 'reg_yaosen_cave',
    title: '妖森 · 古修残府',
    region: 'yaosen',
    pool: 'wild',
    tier: 3,
    weight: 6,
    minRealm: 1,
    maxRealm: 4,
    once: true,
    text: '雷劈焦黑的千年老槐树干竟是中空，顺着藤蔓直下十丈，是一座早已断绝灵脉的古修石府。\n\n石榻上端坐一具青袍枯骨，膝前摆着半卷残简与一只青玉丹瓶，石壁上还刻着半幅草木吐纳图。',
    choices: [
      {
        label: '焚香三拜，再恭敬收下丹瓶与残简',
        hint: '礼敬前人 · 稳得筑基丹与悟性',
        cost: { month: 1 },
        outcome: {
          text: '你整衣三拜，将枯骨安葬于槐根之下。启开青玉丹瓶，竟是一枚保存完好的筑基丹，残简中更记着数段行气窍门。',
          effects: { items: ['zhuji_dan'], attrs: { 悟性: 3, 道心: 2 }, karma: 12, flag: { 妖森古府: true } },
        },
      },
      {
        label: '撬开石榻暗格，搜刮洞府全部遗藏',
        hint: '神识检定 · 收益更高但恐触禁制',
        roll: {
          p: 0.55,
          attrs: { 神识: 0.012, 根骨: 0.01 },
          success: {
            text: '你避开暗格里的残余毒针，起出一袋灵石、一块玄铁与一枚破障丹。只是石府顿时寒风大作。',
            effects: { stones: 460, items: ['pozhang_dan', 'xuantie'], karma: -15 },
          },
          fail: {
            text: '石榻轰然塌陷，一道护府阴雷当面炸开。你狼狈爬出树洞，只觉神魂隐隐作痛。',
            effects: { hp: -55, demon: 6 },
          },
        },
      },
      {
        label: '不取一物，对石壁草木吐纳图静修两月',
        hint: '耗两月 · 修为、悟性与寿元同进',
        cost: { month: 2 },
        outcome: {
          text: '你随石壁图谱呼吸吐纳，竟仿佛听见头顶老槐树心缓慢搏动。两月后出洞，修为精进一大截。',
          effects: { expPct: 0.36, attrs: { 悟性: 4 }, lifespan: 8 },
        },
      },
    ],
  },

  /* ===================== 四、东海归墟（guixu，金丹海疆） ===================== */
  {
    id: 'reg_guixu_wreck_1',
    title: '归墟 · 沉船古傀儡',
    region: 'guixu',
    pool: 'wild',
    tier: 4,
    weight: 6,
    minRealm: 2,
    maxRealm: 6,
    once: true,
    text: '东海落潮三里，黑礁之间赫然露出一艘玄铁包皮的百丈古楼船。船身爬满贝壳，主舱却透出幽蓝符光。\n\n你刚踏上湿滑甲板，舱门内便响起沉重齿轮声，一尊丈余青铜古傀儡提戟迈步而出，眼眶燃起冷焰。',
    choices: [
      {
        label: '祭剑强攻，硬拆青铜古傀儡',
        hint: '战古傀儡 · 进入主舱深处',
        combat: {
          enemy: 'ancient_puppet',
          win: {
            text: '长剑贯穿傀儡胸口灵核，齿轮哀鸣着停转。你在碎甲间拾得一块玄铁与半捧星辰砂，大步迈入主舱。',
            effects: { items: ['xuantie', 'xingchen_sha'], flag: { 归墟破傀: true } },
            goto: 'reg_guixu_wreck_2',
          },
          lose: {
            text: '青铜重戟扫起丈高浪墙，将你震飞甲板。海潮渐涨，你只得踏浪退回礁岛。',
            effects: { hp: -85, injury: 1 },
          },
        },
      },
      {
        label: '辨识船舷古符，寻傀儡背心停机阵眼',
        hint: '悟性 ≥ 20 或机关城弟子 · 智取古傀',
        require: 'char.attrs.悟性 >= 20 || sect() == "jiguan"',
        requireHint: '阵器悟性不足，难辨停机符眼',
        roll: {
          p: 0.62,
          attrs: { 悟性: 0.012, 神识: 0.01 },
          success: {
            text: '你踏着船舷残阵绕至傀儡身后，一指点灭其脊骨处的蓝玉符眼。古傀儡轰然单膝跪地，为你敞开舱门。',
            effects: { attrs: { 悟性: 3, 神识: 3 }, flag: { 归墟控傀: true } },
            goto: 'reg_guixu_wreck_2',
          },
          fail: {
            text: '符纹早已年久失修，你指尖刚落便激起一阵电弧，被迫抽身跃下楼船。',
            effects: { hp: -60, attrs: { 悟性: 1 } },
          },
        },
      },
      {
        label: '不闯主舱，刮走甲板星辰砂便离去',
        hint: '见好就收 · 得炼器灵材',
        outcome: {
          text: '你趁古傀儡守门不出，收刮了船首凝结的星辰砂与散落灵石，在涨潮前飘然远去。',
          effects: { items: ['xingchen_sha'], stones: 240 },
        },
      },
    ],
  },
  {
    id: 'reg_guixu_wreck_2',
    title: '归墟 · 鲛皮海图',
    region: 'guixu',
    pool: 'branch',
    tier: 4,
    weight: 0,
    text: '主舱之内竟滴水未渗。紫檀长案上摊着一卷泛黄鲛皮海图，以朱砂标出归墟深处一处暗礁宝鼎；左侧药柜中尚存两只封蜡完好的玉瓶。',
    choices: [
      {
        label: '默记鲛皮海图，顺势潜探深海暗礁',
        hint: '耗两月 · 追寻海底青铜鼎',
        cost: { month: 2 },
        outcome: {
          text: '你收起海图，循着潮信潜入百丈深海。越往下水压越重，远方暗礁间隐隐浮现一抹碧光。',
          effects: { attrs: { 神识: 4, 悟性: 3 }, flag: { 归墟海图: true } },
          goto: 'reg_guixu_wreck_3',
        },
      },
      {
        label: '借控傀印拆解船舱阵核，兼收丹药',
        hint: '需曾智控古傀 · 满载而归',
        require: 'flag("归墟控傀")',
        requireHint: '未掌握古傀阵印，强拆恐致船沉',
        outcome: {
          text: '你驱使古傀儡稳住船身，从容起出阵盘核心、星辰砂与一枚结金丹。潮水将至，你御风掠出海面。',
          effects: { items: ['xuantie', 'xingchen_sha', 'jiejin_dan'], stones: 600, attrs: { 悟性: 4 }, counter: { secrets: 1 } },
        },
      },
      {
        label: '取走药柜玉瓶，趁涨潮前速离楼船',
        hint: '落袋为安 · 得结金丹与大还丹',
        outcome: {
          text: '你不敢贪恋深海险地，收好结金丹、大还丹与一袋海市灵石，纵身跃上翻涌海面。',
          effects: { items: ['jiejin_dan', 'dahuan_dan'], stones: 420, counter: { secrets: 1 } },
        },
      },
    ],
  },
  {
    id: 'reg_guixu_wreck_3',
    title: '归墟 · 暗礁夜叉',
    region: 'guixu',
    pool: 'branch',
    tier: 5,
    weight: 0,
    text: '暗礁环抱的海谷之中，一尊青铜古鼎正吞吐着浓郁水灵。三头青面獠牙的海夜叉绕鼎盘旋，见你破水而入，领头夜叉发出一声刺耳水啸，钢叉裹挟漩涡直刺心口。',
    choices: [
      {
        label: '剑斩海夜叉，夺下青铜鼎中真宝',
        hint: '战海夜叉 · 得龙血精与结金丹',
        combat: {
          enemy: 'sea_yaksha',
          win: {
            text: '剑光分水十丈，海夜叉惨嚎着化作一团血雾。你掀开古鼎青盖，取出一瓶凝如琥珀的龙血精与结金丹。',
            effects: { stones: 900, items: ['longxue_jing', 'jiejin_dan'], reputation: 55, counter: { secrets: 1 } },
          },
          lose: {
            text: '海底水压本就沉重，又遭夜叉围攻。你硬受一叉后借暗流浮出海面，半月方才缓过气来。',
            effects: { hp: -100, injury: 1 },
          },
        },
      },
      {
        label: '借暗潮掩护，悄然摄取鼎畔灵粹即遁',
        hint: '神识与气运检定 · 避战夺材',
        roll: {
          p: 0.6,
          attrs: { 神识: 0.012, 气运: 0.012 },
          success: {
            text: '你趁暗流卷起海底泥沙，袖风一扫摄走鼎畔星辰砂与千年海草，身影随即隐入滔天白浪。',
            effects: { items: ['xingchen_sha', 'qiannian_lingcao'], expPct: 0.25, counter: { secrets: 1 } },
          },
          fail: {
            text: '一缕钢叉劲风擦过你肋下，划开护体灵光。你咬牙催动灵力冲出海面，空手而归。',
            effects: { hp: -72 },
          },
        },
      },
    ],
  },
  {
    id: 'reg_guixu_market',
    title: '归墟 · 珊瑚海市易宝',
    region: 'guixu',
    pool: 'world',
    tier: 4,
    weight: 7,
    minRealm: 2,
    maxRealm: 6,
    text: '朔月起雾，一座赤红珊瑚托起的水上坊市自东海浮现。鲛人、海外散修与金丹老怪皆戴骨面穿梭其间。\n\n一盏鲛油灯下，老海商掀开黑布，露出一只隐带龙腥的暗金玉瓶，压低嗓音问价。',
    choices: [
      {
        label: '掷八百灵石，赌下这枚龙腥玉瓶',
        hint: '800 灵石 · 气运检定博龙血精',
        require: 'stones >= 800',
        requireHint: '灵石不足八百',
        cost: { stones: 800 },
        roll: {
          p: 0.58,
          attrs: { 气运: 0.012, 神识: 0.01 },
          success: {
            text: '玉瓶甫开，龙威隐隐外泄，竟是海妖都垂涎的龙血精，瓶底还附着一枚结金丹！周边数道目光顿时炽热起来，你收瓶即走。',
            effects: { items: ['longxue_jing', 'jiejin_dan'], attrs: { 气运: 2 } },
          },
          fail: {
            text: '不过是沾了龙骨灰的寻常大还丹。老海商拱手赔笑，退了你两百灵石当作交个朋友。',
            effects: { items: ['dahuan_dan'], stones: 200 },
          },
        },
      },
      {
        label: '凭落霞暗契入海市暗阁交割旧约',
        hint: '需持落霞暗契 · 得化婴丹与重金',
        require: 'flag("落霞暗契") && !flag("海市交割")',
        requireHint: '未持落霞暗契或已交割',
        outcome: {
          text: '暗阁掌柜验过鲛皮副券，神色立刻恭敬三分，亲手奉上万宝阁预留的千二百灵石与一枚化婴丹。',
          effects: { stones: 1200, items: ['huaying_dan'], reputation: 45, flag: { 海市交割: true } },
        },
      },
      {
        label: '以一株千年灵草换取一枚结金丹',
        hint: '以物易物 · 消耗千年灵草',
        require: 'has("qiannian_lingcao")',
        requireHint: '行囊中无千年灵草',
        cost: { item: 'qiannian_lingcao' },
        outcome: {
          text: '海市丹师见这株千年灵草品相绝佳，当即换给你一枚结金丹，又补了一百八十灵石差价。',
          effects: { items: ['jiejin_dan'], stones: 180, reputation: 15 },
        },
      },
      {
        label: '漫步珊瑚长街听海外奇闻，买一瓶清心丹',
        hint: '200 灵石 · 增悟性、去心魔',
        require: 'stones >= 200',
        requireHint: '灵石不足二百',
        cost: { stones: 200 },
        outcome: {
          text: '你听鲛人唱了一曲归墟古调，买下清心丹静坐观雾，心头滞气随之散去。',
          effects: { items: ['qingxin_dan'], attrs: { 悟性: 2 }, demon: -12 },
        },
      },
    ],
  },
  {
    id: 'reg_guixu_tide',
    title: '归墟 · 潮汐金丹灵眼',
    region: 'guixu',
    pool: 'wild',
    tier: 4,
    weight: 6,
    minRealm: 2,
    maxRealm: 5,
    text: '秋分大潮将至，归墟外海百里海水向内倒卷，在苍穹与海面之间撑起一座晶莹灵气潮眼。\n\n潮眼灵气浓如水银，海底深处却不时掠过一道百丈黑影，显是有深渊巨兽亦在借潮吐纳。',
    choices: [
      {
        label: '直入潮眼中心，借百川灵气淬炼金丹',
        hint: '耗两月 · 根骨与道心检定',
        cost: { month: 2 },
        roll: {
          p: 0.58,
          attrs: { 根骨: 0.012, 道心: 0.01 },
          success: {
            text: '狂暴灵潮冲刷四肢百骸，你守住灵台如礁石不动。两月潮歇，丹田灵力精纯了整整一筹。',
            effects: { expPct: 0.45, attrs: { 根骨: 4, 道心: 3 }, lifespan: 15 },
          },
          fail: {
            text: '一道暗涌震乱了你的行气路线，经脉隐隐作痛。你只得提前退离潮眼，所幸仍汲取了些许灵气。',
            effects: { hp: -90, expPct: 0.16 },
          },
        },
      },
      {
        label: '直面潮底巨兽，搏杀争夺整座灵眼',
        hint: '极险 · 战深渊巨兽',
        combat: {
          enemy: 'abyss_leviathan',
          win: {
            text: '沧海翻腾三日，你终斩断巨兽独角，夺得其腹中温养的龙血精与化婴丹。归墟海面从此传颂你的名号。',
            effects: { items: ['longxue_jing', 'huaying_dan'], stones: 1200, reputation: 70, expPct: 0.3 },
          },
          lose: {
            text: '巨兽一尾掀翻百丈海浪，你护体灵光尽碎，顺着洋流漂出百里方才捡回一条命。',
            effects: { hp: -145, injury: 2 },
          },
        },
      },
      {
        label: '悬停潮眼外缘，静静吸纳逸散水灵',
        hint: '耗一月 · 稳步精进无风险',
        cost: { month: 1 },
        outcome: {
          text: '你御风悬于浪尖之外，不争潮心，只借漫天水雾润泽神魂。潮落时分，修为水到渠成。',
          effects: { expPct: 0.22, attrs: { 神识: 2 }, demon: -8 },
        },
      },
    ],
  },

  /* ===================== 五、北荒魔域（beihuang，元婴血原） ===================== */
  {
    id: 'reg_beihuang_battlefield_1',
    title: '北荒 · 血原古战场拾剑',
    region: 'beihuang',
    pool: 'wild',
    tier: 4,
    weight: 6,
    minRealm: 3,
    maxRealm: 7,
    once: true,
    text: '北荒赤原风沙如刀，黄沙半掩着千年前正魔大战遗下的断戟与枯骨。\n\n你行至一处低洼沙丘，沙下斜插的一柄裂纹古剑忽然发出清越哀鸣，剑锋遥指残月，似在等待能握住它的后来人。',
    choices: [
      {
        label: '握柄拔剑，硬承千年剑魂试炼',
        hint: '战古剑残影 · 锋芒证道',
        cost: { month: 1 },
        combat: {
          enemy: 'sword_phantom',
          win: {
            text: '残月之下百剑齐鸣，你以更决绝的一剑斩散虚影。古剑轻颤三声，化作一道凛冽剑韵没入你的脊骨。',
            effects: { attrs: { 根骨: 5, 悟性: 4 }, flag: { 血原拾剑: true } },
            goto: 'reg_beihuang_battlefield_2',
          },
          lose: {
            text: '千年煞气顺着剑柄倒灌，震伤你的心脉。你撒手后退，古剑再度沉入黄沙。',
            effects: { hp: -125, injury: 1, demon: 10 },
          },
        },
      },
      {
        label: '以神识安抚剑中英灵，倾听其临终遗言',
        hint: '神识 ≥ 24 · 渡魂得遗泽',
        require: 'char.attrs.神识 >= 24',
        requireHint: '神识不足二十四，难承英灵悲意',
        cost: { month: 1 },
        outcome: {
          text: '你在沙中看见千年前那场血战：剑主战至最后一刻，只盼有人把遗匣带离魔域。剑鸣渐歇，沙土自动分开。',
          effects: { karma: 28, attrs: { 道心: 5, 神识: 3 }, flag: { 血原安魂: true } },
          goto: 'reg_beihuang_battlefield_2',
        },
      },
      {
        label: '不碰凶剑，只收集战场散落的玄铁与星辰砂',
        hint: '稳妥 · 得高阶炼器灵材',
        outcome: {
          text: '你绕开杀气最盛的沙丘，在古战场外围拾得数块淬过煞气的玄铁与星辰砂。',
          effects: { items: ['xuantie', 'xingchen_sha'], stones: 450 },
        },
      },
    ],
  },
  {
    id: 'reg_beihuang_battlefield_2',
    title: '北荒 · 剑骨遗匣',
    region: 'beihuang',
    pool: 'branch',
    tier: 5,
    weight: 0,
    text: (s) => `裂纹古剑在风中寸寸化作寒光消散，${s.flags['血原安魂'] ? '临别前向你遥遥一礼，' : '余威震开三尺赤沙，'}露出埋于沙下的一只黑铁骨匣。\n\n匣中并无绝世神兵，只静放着一卷染血玉简、一枚护婴灵丹，以及一块泛着银辉的法则残片。`,
    choices: [
      {
        label: '就地参悟染血玉简中的古剑意',
        hint: '耗两月 · 悟性与法则残片兼得',
        cost: { month: 2 },
        outcome: {
          text: '你在血原风沙里枯坐六十日，将玉简中三式搏命剑意印入元神，又收好那块珍贵的法则残片。',
          effects: { expPct: 0.45, items: ['faze_canpian'], attrs: { 悟性: 5, 根骨: 3 }, reputation: 50, counter: { secrets: 1 } },
        },
      },
      {
        label: '收下元婴丹与法则残片，为枯骨筑起石冢',
        hint: '安葬英烈 · 道心澄明、心魔大减',
        outcome: {
          text: '你以剑掘沙，将散落的白骨聚为一冢。风沙掠过新坟，竟不再那么刺骨。',
          effects: { items: ['yuanying_dan', 'faze_canpian'], karma: 35, attrs: { 道心: 5 }, demon: -16, counter: { secrets: 1 } },
        },
      },
    ],
  },
  {
    id: 'reg_beihuang_tempt',
    title: '北荒 · 魔道长老收徒诱惑',
    region: 'beihuang',
    pool: 'world',
    tier: 5,
    weight: 6,
    minRealm: 3,
    maxRealm: 6,
    once: true,
    text: '枯骨崖巅血云低垂，一名身披暗红大氅的血魔宗长老负手而立，目光似刀落你肩头。\n\n「元婴境便敢孤身踏入北荒，倒不像那些正道蠢物。拜入本座门下，百年内保你化神，如何？」',
    choices: [
      {
        label: '「正魔殊途，阁下请回」——拔剑相向',
        hint: '战血魔长老 · 胜则名震北荒',
        combat: {
          enemy: 'blood_elder',
          win: {
            text: '血云被你一剑劈开数里，血魔长老冷哼一声化血遁走，仓促间遗落一枚化神丹与储物重宝。',
            effects: { reputation: 120, karma: 45, items: ['huashen_dan'], stones: 1500, attrs: { 道心: 6 } },
          },
          lose: {
            text: '血海滔天压下，你拼死斩断三道血链方才脱身。虽受重创，却未折半寸傲骨。',
            effects: { hp: -165, injury: 2, reputation: 25 },
          },
        },
      },
      {
        label: '虚与委蛇，顺势套取一门魔道炼体法',
        hint: '悟性与魅力检定 · 险中借法',
        roll: {
          p: 0.56,
          attrs: { 悟性: 0.012, 魅力: 0.012 },
          success: {
            text: '你假作心动，言辞间巧妙问出魔道淬骨的三处要诀，趁血云换气之际飘然远遁。',
            effects: { expPct: 0.4, attrs: { 根骨: 5 }, demon: 12, karma: -18 },
          },
          fail: {
            text: '魔老眼光毒辣，一眼看穿你的敷衍，袖中血掌凭空印来。你吐血退走，心头煞气难平。',
            effects: { hp: -115, demon: 15 },
          },
        },
      },
      {
        label: '俯首称徒，吞下其所赐血炼秘丹',
        hint: '修为暴涨、得化神丹 · 业力与心魔大增',
        outcome: {
          text: '秘丹入腹如熔铁奔流，你听见魔老在血雾里大笑。修为一日千里，只是镜中双瞳悄然泛起一丝赤芒。',
          effects: { expPct: 0.62, items: ['huashen_dan'], attrs: { 根骨: 6 }, karma: -80, demon: 28, flag: { 魔老赐丹: true } },
        },
      },
      {
        label: '以魔道同门之礼见之，换取修行资粮',
        hint: '魔道三宗专属 · 同道相济',
        require: 'sect() == "xuemo" || sect() == "youming" || sect() == "hehuan"',
        requireHint: '仅魔道宗门弟子可行',
        outcome: {
          text: '魔老瞥见你身上同源气息，哈哈大笑，随手抛来一袋灵石与一枚元婴丹：「既是一家人，便拿去好生打磨。」',
          effects: { contribution: 800, stones: 1200, items: ['yuanying_dan'], attrs: { 根骨: 3 } },
        },
      },
    ],
  },
  {
    id: 'reg_beihuang_rift',
    title: '北荒 · 幽冥裂隙斩魔念',
    region: 'beihuang',
    pool: 'wild',
    tier: 5,
    weight: 6,
    minRealm: 3,
    maxRealm: 7,
    text: '北荒尽头大地崩开一道漆黑裂隙，阴风呼啸而出，沙石触之尽化死灰。\n\n裂隙深处飘出一缕无形无相的域外魔念，化作凄厉低语直钻你眉心识海，诱你沉沦杀戮。',
    choices: [
      {
        label: '凝神识为剑，正面斩灭域外天魔',
        hint: '战域外天魔 · 斩之得法则残片',
        combat: {
          enemy: 'void_fiend',
          win: {
            text: '识海之中剑光如昼，域外魔念尖啸崩散，留下一块纯粹的法则残片。裂隙阴风亦随之收敛。',
            effects: { expPct: 0.38, items: ['faze_canpian', 'qingxin_dan'], demon: -22, attrs: { 神识: 5, 道心: 4 }, reputation: 70 },
          },
          lose: {
            text: '魔念在识海中掀起惊涛，你咬破舌尖强行逼退黑影，神魂仍被撕裂一角。',
            effects: { hp: -145, demon: 20, injury: 1 },
          },
        },
      },
      {
        label: '燃起灵台心灯，以不动道心化去魔音',
        hint: '道心与神识检定 · 以静制动',
        roll: {
          p: 0.6,
          attrs: { 道心: 0.012, 神识: 0.01 },
          success: {
            text: '任它千般幻象、万语诱惑，你灵台只守一点清光。魔念无隙可乘，自行消融于荒原狂风。',
            effects: { demon: -26, attrs: { 道心: 6 }, expPct: 0.25 },
          },
          fail: {
            text: '魔音终究勾起了你心底旧憾，你闷哼一声退开数里，耗费半月才压下心魔。',
            effects: { hp: -85, demon: 15 },
          },
        },
      },
      {
        label: '退至十里外立碑示警，暂避裂隙锋芒',
        hint: '审时度势 · 积善避祸',
        outcome: {
          text: '你以剑在青石上刻下「前有魔隙，慎入」六字，既免后来散修枉死，也守住了自身清明。',
          effects: { karma: 18, attrs: { 道心: 2 } },
        },
      },
    ],
  },

  /* ===================== 六、中州圣域（zhongzhou，化神论道） ===================== */
  {
    id: 'reg_zhongzhou_debate_1',
    title: '中州 · 天骄论道大会',
    region: 'zhongzhou',
    pool: 'world',
    tier: 5,
    weight: 6,
    minRealm: 4,
    maxRealm: 8,
    once: true,
    text: '中州白玉京百年一度开启天骄论道，九座浮空青玉道台悬于云海之上。各州大能与天骄云集，主坛白衣剑修抚剑环顾：「今日不问出身宗派，只论大道高低。谁敢先登第一台？」',
    choices: [
      {
        label: '踏云登台，以大道义理舌战群雄',
        hint: '耗两月 · 悟性与道心检定',
        cost: { month: 2 },
        roll: {
          p: 0.58,
          attrs: { 悟性: 0.012, 道心: 0.01 },
          success: {
            text: '你从炼气引灵讲到化神照虚，句句切中修行关节。满座天骄渐静，连主坛白衣剑修亦起身拱手称善。',
            effects: { reputation: 95, attrs: { 悟性: 5, 道心: 4 }, flag: { 中州文胜: true } },
            goto: 'reg_zhongzhou_debate_2',
          },
          fail: {
            text: '台下大宗真传辩才无碍，你在两处关窍略落下风，但言辞坦荡，仍赢得几声赞叹。',
            effects: { reputation: 28, attrs: { 悟性: 2 } },
            goto: 'reg_zhongzhou_debate_2',
          },
        },
      },
      {
        label: '拔剑登台，破白衣剑修凝化的太古剑影',
        hint: '以剑论道 · 战太古剑影',
        cost: { month: 1 },
        combat: {
          enemy: 'sword_phantom',
          win: {
            text: '云海剑气纵横三十里，你一剑斩碎太古剑影，白衣剑修抚掌大笑：「好锋芒！中州剑台当有道友一席！」',
            effects: { reputation: 115, attrs: { 根骨: 5 }, flag: { 中州武胜: true } },
            goto: 'reg_zhongzhou_debate_2',
          },
          lose: {
            text: '剑影凛冽非常，你退至台沿方才稳住身形。白衣剑修收势拱手：「道友剑心极正，来日可期。」',
            effects: { hp: -120, attrs: { 悟性: 3 } },
            goto: 'reg_zhongzhou_debate_2',
          },
        },
      },
      {
        label: '静坐云阶听道，默记诸家得失',
        hint: '耗两月 · 潜心沉淀不争虚名',
        cost: { month: 2 },
        outcome: {
          text: '你未曾登台，只听尽各州天骄三百场辩论，把别家破绽与长处尽数化为己用。',
          effects: { expPct: 0.34, attrs: { 悟性: 4, 神识: 3 } },
        },
      },
    ],
  },
  {
    id: 'reg_zhongzhou_debate_2',
    title: '中州 · 圣坛问心',
    region: 'zhongzhou',
    pool: 'branch',
    tier: 5,
    weight: 0,
    text: (s) => `论道将歇，圣域白发大长老袖袍一展，唤出一面照彻云海的古铜道鉴。${s.flags['中州文胜'] || s.flags['中州武胜'] ? '道鉴清光率先落在你身上，' : '道鉴缓缓扫过众修，'}老者声如洪钟：「尔等皆求长生，可长生之后，欲以何物镇住万年寂寞？」`,
    choices: [
      {
        label: '「以手中三尺剑，守世间未平事」',
        hint: '剑道本心 · 根骨与道心并进',
        outcome: {
          text: '道鉴清鸣一声，映出一道直贯九霄的青虹。大长老颔首：「锐气不折，可称剑修。」',
          effects: { attrs: { 根骨: 4, 道心: 5 }, karma: 30, flag: { 圣坛立剑誓: true } },
          goto: 'reg_zhongzhou_debate_3',
        },
      },
      {
        label: '「以双眼看尽天地尽头，不问归途」',
        hint: '问道本心 · 悟性与神识大涨',
        outcome: {
          text: '道鉴镜面波纹荡开，似有星河倒映。大长老轻叹：「好一个不问归途，此心合该问仙。」',
          effects: { attrs: { 悟性: 6, 神识: 4 }, expPct: 0.35, flag: { 圣坛立问道誓: true } },
          goto: 'reg_zhongzhou_debate_3',
        },
      },
      {
        label: '「凡尘一盏热灯，胜过九霄仙宫冷」',
        hint: '红尘本心 · 道心大涨、心魔尽消',
        outcome: {
          text: '众修微怔，大长老却罕见地露出一抹笑意：「修仙不忘来处，最难，亦最稳。」',
          effects: { attrs: { 道心: 7, 魅力: 3 }, demon: -25, flag: { 圣坛立红尘誓: true } },
          goto: 'reg_zhongzhou_debate_3',
        },
      },
    ],
  },
  {
    id: 'reg_zhongzhou_debate_3',
    title: '中州 · 玉盘赐礼',
    region: 'zhongzhou',
    pool: 'branch',
    tier: 5,
    weight: 0,
    text: '圣坛钟鼓齐鸣，执礼捧来一方白玉托盘，上置一枚流光溢彩的化神丹与一片刻有太古道纹的法则残片，全场修士无不侧目。',
    choices: [
      {
        label: '稽首受礼，携丹与法则残片名传中州',
        hint: '得化神丹、法则残片与中州称号',
        outcome: {
          text: '你接过玉盘向四方抱拳。自这一日起，中州九州茶肆皆传你登台论道之名。',
          effects: { items: ['huashen_dan', 'faze_canpian'], stones: 1800, reputation: 120, title: '中州论道客', counter: { secrets: 1 } },
        },
      },
      {
        label: '辞谢丹药，改求入圣域藏经阁观书一月',
        hint: '耗一月 · 悟性与修为暴涨',
        cost: { month: 1 },
        outcome: {
          text: '大长老欣赏你的定力，特许你独入藏经阁顶层三十日。出阁之时，你眼底神光内敛，已非昔比。',
          effects: { expPct: 0.5, attrs: { 悟性: 8, 神识: 5 }, reputation: 150, title: '中州论道客', counter: { secrets: 1 } },
        },
      },
    ],
  },
  {
    id: 'reg_zhongzhou_stele',
    title: '中州 · 太古法则残碑',
    region: 'zhongzhou',
    pool: 'wild',
    tier: 5,
    weight: 6,
    minRealm: 4,
    maxRealm: 8,
    text: '中州天柱峰绝顶立着半截焦黑古碑，碑面无字，唯流动着数道仿若割裂虚空的淡金裂纹。\n\n寻常修士离碑十丈便头痛欲裂，唯有神魂足够凝练者，方能窥见裂纹背后的天地纹理。',
    choices: [
      {
        label: '放开神识，强行拓印一道太古法则',
        hint: '耗三月 · 悟性与神识检定，可得法则残片',
        cost: { month: 3 },
        roll: {
          p: 0.56,
          attrs: { 悟性: 0.012, 神识: 0.012 },
          success: {
            text: '神识如刀刻入虚空，一道淡金法则纹路自碑面剥离，凝成残片落入你掌心。你周身灵气瞬间与天地呼应。',
            effects: { items: ['faze_canpian'], attrs: { 悟性: 6, 神识: 6 }, expPct: 0.42 },
          },
          fail: {
            text: '法则之威岂容轻窥，你识海如遭重锤，吐血跌坐雪地。虽未拓全，倒也记下半缕残韵。',
            effects: { hp: -155, demon: 10, attrs: { 神识: 2 } },
          },
        },
      },
      {
        label: '闭目静听残碑与虚空共振之音',
        hint: '耗两月 · 稳健悟道、涤清心魔',
        cost: { month: 2 },
        outcome: {
          text: '你退至三十步外闭目倾听，将碑韵化作静水融入心境，修为与道心皆更上一层。',
          effects: { expPct: 0.28, attrs: { 道心: 4, 悟性: 3 }, demon: -12 },
        },
      },
      {
        label: '以灵石布聚灵阵，借碑气淬炼法力',
        hint: '1500 灵石 · 速进修为与根骨',
        require: 'stones >= 1500',
        requireHint: '灵石不足一千五百',
        cost: { stones: 1500, month: 1 },
        outcome: {
          text: '灵石尽化灵雾，与古碑溢出的太古气息交融。一月阵散，你的肉身与法力皆凝练不少。',
          effects: { expPct: 0.48, attrs: { 根骨: 4 } },
        },
      },
    ],
  },
  {
    id: 'reg_zhongzhou_vein',
    title: '中州 · 灵脉拍卖暗战',
    region: 'zhongzhou',
    pool: 'world',
    tier: 5,
    weight: 6,
    minRealm: 4,
    maxRealm: 8,
    text: '中州天宝轩夜场灯火辉煌，压轴拍品是一枚自虚空灵脉剥离的虚空晶与化神丹。\n\n珠帘之后数股化神威压暗自碰撞，几大世家供奉更在私下传音施压，企图吓退其余竞拍者。',
    choices: [
      {
        label: '豪掷四千灵石，当场压服群豪拍下灵宝',
        hint: '4000 灵石 · 稳得虚空晶与化神丹',
        require: 'stones >= 4000',
        requireHint: '灵石不足四千',
        cost: { stones: 4000 },
        outcome: {
          text: '你举牌报出底价之上三成，珠帘后顿时一片沉寂。拍槌落定，天宝轩亲卫护送虚空晶与化神丹入你包厢。',
          effects: { items: ['xukong_jing', 'huashen_dan'], reputation: 80, attrs: { 气运: 3 } },
        },
      },
      {
        label: '散场后于城外截击仗势欺人的世家供奉',
        hint: '战强敌天庭使徒级供奉 · 险夺虚空晶',
        combat: {
          enemy: 'heaven_envoy',
          win: {
            text: '云外十里短兵交锋，那名骄横供奉护身法宝尽碎，弃宝遁逃。你收起虚空晶与一袋灵石，消失于夜色。',
            effects: { items: ['xukong_jing'], stones: 2500, karma: -15, reputation: 65 },
          },
          lose: {
            text: '世家供奉底牌尽出，一道金印将你震退百丈。你捂伤退入群山，只得作罢。',
            effects: { hp: -185, injury: 2 },
          },
        },
      },
      {
        label: '冷眼旁观，暗中向商行兜售各家底牌情报',
        hint: '魅力与神识检定 · 坐收渔利',
        roll: {
          p: 0.6,
          attrs: { 魅力: 0.012, 神识: 0.012 },
          success: {
            text: '你仅凭几句传音波动便摸清两家世家的灵石上限，转手卖与天宝轩管事，轻松赚得盆满钵满。',
            effects: { stones: 2200, attrs: { 神识: 3 } },
          },
          fail: {
            text: '走漏风声惹来世家不悦，管事匆匆付了四百灵石打发你离场。',
            effects: { stones: 400, reputation: -25 },
          },
        },
      },
    ],
  },

  /* ===================== 七、昆仑墟界（kunlun，合体古仙遗境） ===================== */
  {
    id: 'reg_kunlun_sanshi_1',
    title: '昆仑 · 仙宫斩三尸试炼',
    region: 'kunlun',
    pool: 'inner',
    tier: 6,
    weight: 5,
    minRealm: 6,
    maxRealm: 9,
    once: true,
    text: '昆仑墟界深处雪雾尽开，一座悬于罡风之上的白玉仙宫缓缓洞开大门。\n\n宫门内并无傀儡妖兽，唯有三丈冰晶古镜照彻元神。刹那间，你此生贪念、嗔怒与执妄自镜中走出，化作与你面容无二的三道黑影。',
    choices: [
      {
        label: '拔剑直面三尸幻影，以杀意斩断尘根',
        hint: '战心魔 · 破而后立',
        cost: { month: 3 },
        combat: {
          enemy: 'heart_demon',
          win: {
            text: '三剑落处，三道黑影先后化作青烟。你握剑立于冰镜之前，周身再无半点浮躁之气。',
            effects: { demon: -35, attrs: { 道心: 8, 根骨: 6 }, flag: { 昆仑斩三尸: true } },
            goto: 'reg_kunlun_sanshi_2',
          },
          lose: {
            text: '三尸知你每一处软肋，逼得你连退九步跌出仙宫。风雪扑面，你才惊觉冷汗湿透道袍。',
            effects: { hp: -260, demon: 20, injury: 2 },
          },
        },
      },
      {
        label: '盘坐冰镜前，以大定力一念照破虚妄',
        hint: '道心 ≥ 40 · 道心与悟性检定',
        require: 'char.attrs.道心 >= 40',
        requireHint: '道心不足四十，难定神魂',
        cost: { month: 3 },
        roll: {
          p: 0.65,
          attrs: { 道心: 0.01, 悟性: 0.01 },
          success: {
            text: '你不拔剑，亦不闭目，只静静注视三尸消长。三月光阴流过，黑影如雪见阳，悄然融归冰镜。',
            effects: { demon: -45, attrs: { 道心: 10, 悟性: 6 }, flag: { 昆仑化三尸: true } },
            goto: 'reg_kunlun_sanshi_2',
          },
          fail: {
            text: '一念之差，心湖起浪。你强行收功退出古镜范围，元神微微震荡。',
            effects: { hp: -180, demon: 15 },
          },
        },
      },
      {
        label: '暂退仙宫外廊，借寒风澄澈神魂',
        hint: '徐徐图之 · 稳固道心',
        outcome: {
          text: '你知此刻火候未足，在外廊静立三日便拱手退去，反倒避开一场大劫。',
          effects: { demon: -14, attrs: { 道心: 3 }, expPct: 0.18 },
        },
      },
    ],
  },
  {
    id: 'reg_kunlun_sanshi_2',
    title: '昆仑 · 仙殿赐果',
    region: 'kunlun',
    pool: 'branch',
    tier: 6,
    weight: 0,
    text: '冰晶古镜缓缓向两侧退开，露出仙殿深处一株扎根混沌青石的古树。\n\n枝头独悬一枚紫气氤氲的悟道果，树下玉盘中还静卧着一粒清辉流转的仙灵丹。',
    choices: [
      {
        label: '摘下悟道果，并收下玉盘仙灵丹',
        hint: '得悟道果、仙灵丹与百廿载寿元',
        outcome: {
          text: '你轻摘仙果，殿顶骤降一道清灵霞光笼罩全身。踏出昆仑仙宫时，你已隐隐触及大乘门径。',
          effects: { items: ['dao_fruit', 'xianling_dan'], expPct: 0.45, lifespan: 120, title: '昆仑斩尸客', counter: { secrets: 1 } },
        },
      },
      {
        label: '留仙灵丹予后来者，独在古树下参玄一载',
        hint: '耗十二月 · 全维度悟道暴涨',
        cost: { month: 12 },
        outcome: {
          text: '你只取悟道果，将仙灵丹原样留于玉盘，在混沌古树下枯坐整整一年。起身时，风雪皆随你呼吸起伏。',
          effects: { items: ['dao_fruit'], attrs: { 悟性: 10, 道心: 8, 神识: 8 }, expPct: 0.55, karma: 60, title: '昆仑斩尸客', counter: { secrets: 1 } },
        },
      },
    ],
  },
  {
    id: 'reg_kunlun_beast',
    title: '昆仑 · 混沌古兽守仙药',
    region: 'kunlun',
    pool: 'wild',
    tier: 6,
    weight: 5,
    minRealm: 6,
    maxRealm: 9,
    text: '昆仑裂谷尽头铅云低垂，一汪不冻灵泉旁生着一株通体晶莹的仙药，药香竟引得四周空间泛起细密涟漪。\n\n泉畔伏着一头生有双翼的混沌古兽，每一次吐息都掀起足以撕碎法宝的罡风。',
    choices: [
      {
        label: '迎着混沌罡风死战古兽，硬夺仙药',
        hint: '极险 · 战混沌古兽',
        combat: {
          enemy: 'chaos_beast',
          win: {
            text: '裂谷崩塌半壁，你终以无上法力击退混沌古兽，将仙药炼成仙灵丹，又于其巢穴拾得一枚悟道果。',
            effects: { items: ['xianling_dan', 'dao_fruit'], stones: 6000, reputation: 150, attrs: { 根骨: 8 } },
          },
          lose: {
            text: '混沌古兽振翼掀起万里雪暴，你拼尽护身法力方才逃出裂谷，元气大伤。',
            effects: { hp: -360, injury: 2 },
          },
        },
      },
      {
        label: '以虚空晶布下短距挪移阵，隔空摄药',
        hint: '消耗虚空晶 · 智取仙灵丹与天道莲子',
        require: 'has("xukong_jing")',
        requireHint: '行囊中无虚空晶',
        cost: { item: 'xukong_jing' },
        outcome: {
          text: '虚空晶悄然裂开寸许空间，趁古兽打盹之际，你将泉畔仙药与伴生莲子隔空摄回，未沾半分血光。',
          effects: { items: ['xianling_dan', 'tiandao_lotus'], attrs: { 悟性: 6, 气运: 4 } },
        },
      },
      {
        label: '隐匿气息，只借飘散的混沌药气吐纳两月',
        hint: '耗两月 · 安全增寿与修为',
        cost: { month: 2 },
        outcome: {
          text: '你伏于裂谷上风处静静吸纳逸散药雾，两月后悄然撤离，古兽至始至终未曾睁眼。',
          effects: { expPct: 0.35, attrs: { 根骨: 4, 神识: 4 }, lifespan: 45 },
        },
      },
    ],
  },
  {
    id: 'reg_kunlun_spacetime',
    title: '昆仑 · 上古时空裂隙',
    region: 'kunlun',
    pool: 'wild',
    tier: 6,
    weight: 5,
    minRealm: 6,
    maxRealm: 9,
    once: true,
    text: '昆仑雪原上空无声撕开一道百丈银隙，隙中映出万年前尚未崩毁的仙山琼楼。\n\n一具披着残破古仙甲的枯尸顺着时空乱流缓缓漂出，干枯五指间仍紧攥着一块微光闪烁的法则残片。',
    choices: [
      {
        label: '踏入乱流斩碎古尸执念，取其掌中法则',
        hint: '战上古古尸 · 得法则残片与虚空晶',
        combat: {
          enemy: 'ancient_corpse',
          win: {
            text: '古尸虽死万年，一掌仍有崩山之威。你将其最后执念彻底斩断，接住自其掌心滑落的法则残片与虚空晶。',
            effects: { items: ['faze_canpian', 'xukong_jing'], expPct: 0.4, attrs: { 悟性: 7, 神识: 6 }, counter: { secrets: 1 } },
          },
          lose: {
            text: '时空乱流反卷，古尸一指点散你的护体罡气。你拼死退出裂隙，双鬓竟平添一缕白霜。',
            effects: { hp: -320, lifespan: -30, injury: 2 },
          },
        },
      },
      {
        label: '驻足银隙之外，静观万年前仙界兴衰',
        hint: '耗半年 · 悟性与道心检定',
        cost: { month: 6 },
        roll: {
          p: 0.6,
          attrs: { 悟性: 0.01, 道心: 0.01 },
          success: {
            text: '你看见大日崩落、仙门倾颓，也看见尘埃中重新萌发的微光。半年如瞬，你对生死轮回有了全新体悟。',
            effects: { attrs: { 悟性: 9, 道心: 7 }, expPct: 0.45, lifespan: 80 },
          },
          fail: {
            text: '岁月长河气息太过沉重，令你气血微亏，但那一眼旧仙山仍烙印神魂。',
            effects: { attrs: { 悟性: 3 }, lifespan: -10 },
          },
        },
      },
      {
        label: '以法力封补裂隙一角，免令乱流吞没山河',
        hint: '护佑九州 · 大功德与道心精进',
        outcome: {
          text: '你散出满身清气织成符网，硬生生将裂隙收拢。冥冥中似有一缕天地功德垂落肩头。',
          effects: { karma: 80, reputation: 120, attrs: { 道心: 8 }, demon: -25 },
        },
      },
    ],
  },

  /* ===================== 八、九霄天门（jiuxiao，渡劫问仙） ===================== */
  {
    id: 'reg_jiuxiao_edict_1',
    title: '九霄 · 上界巡天法旨',
    region: 'jiuxiao',
    pool: 'world',
    tier: 6,
    weight: 5,
    minRealm: 8,
    maxRealm: 9,
    once: true,
    text: '九霄罡风之上，一座万丈白玉天门半掩于雷海深处。天门缝隙骤降一道炽金法旨，星甲巡天判官凌空俯视：\n\n「下界渡劫者，须先献三分道果、立下上界奴契，方可借天门引仙气飞升。」',
    choices: [
      {
        label: '「我修长生，岂为仙奴！」——挥剑劈碎金旨',
        hint: '死战巡天判官 · 震动九霄',
        combat: {
          enemy: 'sky_arbiter',
          win: {
            text: '剑光撕开九重雷云，炽金法旨寸寸化灰。巡天判官面色剧变，冷声抛下一句「好胆」，化作星虹退入天门。',
            effects: { reputation: 300, attrs: { 道心: 12, 根骨: 10 }, flag: { 斩碎天旨: true } },
            goto: 'reg_jiuxiao_edict_2',
          },
          lose: {
            text: '天威如狱，你被一记星辰法印震落百里云海。纵然喋血九霄，你手中之剑却始终未低半分。',
            effects: { hp: -500, injury: 2, reputation: 90 },
          },
        },
      },
      {
        label: '以大道公理驳斥法旨，迫巡天判官让步',
        hint: '悟性 ≥ 45 且道心 ≥ 45 · 论道退天官',
        require: 'char.attrs.悟性 >= 45 && char.attrs.道心 >= 45',
        requireHint: '悟性或道心未至四十五，难抗天官威压',
        roll: {
          p: 0.65,
          attrs: { 悟性: 0.008, 道心: 0.008 },
          success: {
            text: '你一言引动天地共鸣，质问上界何以私占大道。法旨金光剧颤，巡天判官沉默片刻，终是收旨让开天阶。',
            effects: { reputation: 240, attrs: { 悟性: 10, 道心: 10 }, flag: { 论退巡天: true } },
            goto: 'reg_jiuxiao_edict_2',
          },
          fail: {
            text: '判官冷笑拂袖，雷光劈落将你逼退三里：「下界蝼蚁，也配论天道？」',
            effects: { hp: -350, demon: 15 },
          },
        },
      },
      {
        label: '暂且敛锋，献两万灵石打点借道',
        hint: '20000 灵石 · 隐忍窥探天门虚实',
        require: 'stones >= 20000',
        requireHint: '灵石不足两万',
        cost: { stones: 20000 },
        outcome: {
          text: '星甲判官神色微缓，收起灵石不再刁难。你低眉拾级而上，却已将天门阵法的三处破绽尽收眼底。',
          effects: { attrs: { 神识: 8 }, flag: { 借道天门: true } },
          goto: 'reg_jiuxiao_edict_2',
        },
      },
    ],
  },
  {
    id: 'reg_jiuxiao_edict_2',
    title: '九霄 · 天门裂雷',
    region: 'jiuxiao',
    pool: 'branch',
    tier: 6,
    weight: 0,
    text: (s) => `${s.flags['斩碎天旨'] ? '金旨余烬未散，' : s.flags['论退巡天'] ? '判官退去，' : '你踏上白玉天阶，'}万丈天门轰然微启，一缕极其精纯的先天仙气垂落下来，紧随其后的却是一道紫霄试劫神雷。`,
    choices: [
      {
        label: '张臂硬接紫霄神雷，以雷火炼化仙气',
        hint: '耗三月 · 根骨与道心检定',
        cost: { month: 3 },
        roll: {
          p: 0.62,
          attrs: { 根骨: 0.008, 道心: 0.008 },
          success: {
            text: '紫雷贯体，仙气紧随其后重塑仙骨。三月雷歇，你周身已隐隐透出一缕超脱凡尘的清光。',
            effects: { expPct: 0.55, attrs: { 根骨: 10, 神识: 8 }, lifespan: 300 },
            goto: 'reg_jiuxiao_edict_3',
          },
          fail: {
            text: '神雷震焦你的道袍，所幸仍有半缕仙气入体护住生机。你喘息着迈向石碑前。',
            effects: { hp: -400, expPct: 0.25 },
            goto: 'reg_jiuxiao_edict_3',
          },
        },
      },
      {
        label: '吞服天劫丹化雷为用，从容纳尽仙气',
        hint: '消耗天劫丹 · 圆满淬体与大增寿元',
        require: 'has("tianjie_dan")',
        requireHint: '行囊中无天劫丹',
        cost: { item: 'tianjie_dan' },
        outcome: {
          text: '天劫丹于丹田炸开清凉雷意，与紫霄神雷里应外合。你将先天仙气滴水不漏地纳入元神。',
          effects: { expPct: 0.65, attrs: { 根骨: 8, 道心: 8, 悟性: 8 }, lifespan: 400 },
          goto: 'reg_jiuxiao_edict_3',
        },
      },
      {
        label: '退守天阶边缘，只截取一缕仙雷法则',
        hint: '稳妥 · 得法则残片与悟性',
        outcome: {
          text: '你避开雷心锋芒，伸指捉住逸散的一丝仙雷法则，凝成残片收入袖中。',
          effects: { items: ['faze_canpian'], attrs: { 悟性: 8 }, demon: -20 },
          goto: 'reg_jiuxiao_edict_3',
        },
      },
    ],
  },
  {
    id: 'reg_jiuxiao_edict_3',
    title: '九霄 · 天门刻名',
    region: 'jiuxiao',
    pool: 'branch',
    tier: 6,
    weight: 0,
    text: '雷海暂歇，天门前的太古青玉碑亮起万千古仙名讳，大多早已黯淡，唯余寥寥数笔仍灿如星辰。\n\n碑身空出一寸白玉，天风猎猎，静待你落笔。',
    choices: [
      {
        label: '以剑指刻下本名，立誓自开飞升大道',
        hint: '得仙灵丹、悟道果与九霄称号',
        outcome: {
          text: '笔锋落处，星辉倒灌百里。天门微震，赐下仙灵丹与悟道果，九州风云皆因你这一笔而动。',
          effects: { items: ['xianling_dan', 'dao_fruit'], reputation: 260, title: '九霄问天客', flag: { 天门留名: true }, counter: { secrets: 1 } },
        },
      },
      {
        label: '不留姓名，只刻一横剑痕便回望人间',
        hint: '超然物外 · 道心暴涨、得九转金丹',
        outcome: {
          text: '名号终究是身外物。你留下一道干净利落的横剑痕，袖中忽然多了一枚温润九转金丹。',
          effects: { attrs: { 道心: 12, 悟性: 8 }, demon: -35, items: ['jiuzhuan_dan'], reputation: 180, title: '无名登霄人', counter: { secrets: 1 } },
        },
      },
    ],
  },
  {
    id: 'reg_jiuxiao_platform',
    title: '九霄 · 接引古台问古仙',
    region: 'jiuxiao',
    pool: 'world',
    tier: 6,
    weight: 5,
    minRealm: 8,
    maxRealm: 9,
    once: true,
    text: '天门西侧悬着一座半塌的接引古台，台上盘坐着一位白发垂地、身形近乎透明的古仙残影。\n\n见你踏云而来，古仙缓缓抬眸：「三千年了，终于又有人走到这里。{name}，一路行来，可曾后悔？」',
    choices: [
      {
        label: '「大道难行，唯此心从未后悔」',
        hint: '明志问仙 · 得悟道果与道心大进',
        outcome: {
          text: '古仙微笑颔首，指尖一点清光落入你眉心，化作一枚凝香悟道果：「守住这句话，九重雷劫拦不住你。」',
          effects: { attrs: { 道心: 12, 悟性: 8 }, expPct: 0.45, items: ['dao_fruit'], demon: -30, flag: { 古台问道: true } },
        },
      },
      {
        label: '「前辈既已登仙，为何仍独守残台？」',
        hint: '耗半年 · 听上古仙界秘辛，得法则残片与仙灵丹',
        cost: { month: 6 },
        outcome: {
          text: '古仙望向云海深处，低声讲起上古飞升路断绝的旧事。半载清谈结束，残影化光散去，唯余法则残片与一粒仙灵丹。',
          effects: { attrs: { 悟性: 14, 神识: 10 }, items: ['faze_canpian', 'xianling_dan'], lifespan: 200, flag: { 古台听秘: true } },
        },
      },
      {
        label: '躬身请教硬渡九重天劫之法',
        hint: '求取渡劫重宝 · 得天劫丹与九转金丹',
        outcome: {
          text: '古仙轻笑：「倒是个实在人。」袖袍一拂，两枚世间罕见的绝品丹药便静静浮于你掌心。',
          effects: { items: ['tianjie_dan', 'jiuzhuan_dan'], expPct: 0.35, attrs: { 根骨: 6 } },
        },
      },
    ],
  },
  {
    id: 'reg_jiuxiao_obsession',
    title: '九霄 · 劫前斩执念',
    region: 'jiuxiao',
    pool: 'inner',
    tier: 6,
    weight: 5,
    minRealm: 8,
    maxRealm: 9,
    text: '天劫将至的前夜，九霄云海静得听不见一丝风声。\n\n你闭目调息，眼前却次第浮现初入仙途那年的破檐雨夜、中途别离的故人背影、未竟的旧约——尘世执念如潮水般涌上灵台。',
    choices: [
      {
        label: '以心剑斩断前尘执念，万念俱空',
        hint: '战终极心魔 · 胜则心魔尽扫',
        combat: {
          enemy: 'heart_demon',
          win: {
            text: '一剑挥落，所有旧影皆如朝露散去。灵台澄明无垢，再无一丝可供雷劫乘虚而入的裂隙。',
            effects: { demon: -50, attrs: { 道心: 12, 神识: 8 }, expPct: 0.45 },
          },
          lose: {
            text: '旧忆如丝缠住剑锋，你心神剧震，强行睁眼时嘴角已溢出一线鲜血。',
            effects: { hp: -300, demon: 25 },
          },
        },
      },
      {
        label: '不斩亦不弃，将人间烟火尽数收入道心',
        hint: '耗三月 · 道心与魅力检定',
        cost: { month: 3 },
        roll: {
          p: 0.65,
          attrs: { 道心: 0.008, 魅力: 0.008 },
          success: {
            text: '你向每一段旧影轻轻颔首，不再躲避。执念化作温暖底气沉入丹田，寿元与道心随之升华。',
            effects: { demon: -40, attrs: { 道心: 10, 气运: 6 }, lifespan: 150, expPct: 0.38 },
          },
          fail: {
            text: '红尘千绪终究沉重，你叹了口气收拢心神，仅平复了些许躁动。',
            effects: { demon: -10, attrs: { 道心: 4 } },
          },
        },
      },
      {
        label: '独酌一壶清酒，静看云海等雷来',
        hint: '从容以待 · 稳步平心',
        outcome: {
          text: '酒尽杯空，东方天际第一道雷光悄然亮起。你站起身，理了理衣袖。',
          effects: { demon: -20, attrs: { 道心: 6 }, expPct: 0.25 },
        },
      },
    ],
  },
];
