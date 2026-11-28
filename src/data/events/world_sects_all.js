/**
 * 九州十三宗门与阵营风云大合集（182 节点 · 全程 wsa_ 前缀）。
 * 覆盖全部十三宗门（每宗 14 节点：8 宗门专属日常/试炼/内政 + 3 跨宗阵营/九州风云 + 1 组三段式镇宗传承链）：
 * 1. 太玄剑宗 (taixuan)   2. 青云门 (qingyun)     3. 丹霞谷 (danxia)
 * 4. 天音寺 (tianyin)     5. 万象书院 (wanxiang)  6. 寒山道观 (hanshan)
 * 7. 万宝阁 (wanbao)      8. 万兽山 (wanshou)     9. 机关城 (jiguan)
 * 10. 血魔宗 (xuemo)      11. 合欢宗 (hehuan)     12. 幽冥鬼道 (youming)
 * 13. 散修联盟 (sanxiu)
 */
export const WORLD_SECTS_ALL = [
  /* ========================================================================
   * 一、太玄剑宗（taixuan · 14 节点）
   * 风味：清霜寒铁、剑骨孤傲、外峰内峰暗涌、北疆守山门、剑峰三段传承
   * ======================================================================== */
  {
    id: 'wsa_tx_01', title: '剑冢听鸣', pool: 'sect', tier: 2, weight: 8, minRealm: 0,
    require: 'sect() == "taixuan"',
    text: '霜降之夜，你提着铁扫帚巡过剑冢南坡。万柄旧剑斜插在乱草与碎雪之间，大多早已锈成钝铁。\n\n子时刚过，石阶尽头忽然响起一线极细的清鸣——不是风吹剑鞘，是某柄断刃在雪下轻颤，连你腰间佩剑也跟着发烫。守冢老卒缩在石亭里烤火，连头也没抬：「听见了？别乱摸，剑冢里的东西，认主之前先认血。」',
    choices: [
      {
        label: '循声拨雪，以掌心真元应和剑鸣', hint: '根骨与道心检定 · 悟一线剑意',
        cost: { month: 1 },
        roll: {
          p: 0.55, attrs: { 根骨: 0.012, 道心: 0.01 },
          success: {
            text: '霜雪之下露出一截三寸黑铁断锋。你真元甫一触及，一股冷冽如冰泉的剑意逆冲入臂，震开两处淤塞支脉，随后散作点点银屑归于泥土。',
            effects: { expPct: 0.14, lawExp: 18, lawId: 'sword', attrs: { 根骨: 2 }, contribution: 120 },
          },
          fail: {
            text: '那缕古剑残意过于凛冽，割得你掌心鲜血淋漓。老卒丢来一丸伤药，哼了一声：「筋骨未成，急什么。」',
            effects: { hp: -35, attrs: { 道心: 1 }, items: ['liaoshang_dan'], contribution: 50 },
          },
        },
      },
      {
        label: '就地盘坐三炷香，静听残锋余韵', hint: '稳妥参悟 · 剑道与心境渐进',
        cost: { month: 1 },
        outcome: {
          text: '你不动手，只阖目听那声清鸣在霜风里起落三回。待鸡鸣破晓，残锋彻底沉寂，你识海里却多了一道极直的剑影。',
          effects: { exp: 260, lawExp: 12, lawId: 'sword', attrs: { 悟性: 2, 道心: 1 }, contribution: 90 },
        },
      },
      {
        label: '向守冢老卒讨一碗烧刀子，打听旧剑来历', hint: '知晓剑宗秘闻 · 省力得赠剑符',
        outcome: {
          text: '老卒独眼一亮，倒了半碗浊酒给你：「三百年前北荒一战，那位师叔一剑断了血河，人没回来，剑自己飞回剑冢。」说罢塞给你一张发黄的剑符。',
          effects: { items: ['jianqi_fu'], attrs: { 悟性: 1 }, contribution: 70 },
        },
      },
    ],
  },
  {
    id: 'wsa_tx_02', title: '寒台试锋', pool: 'sect', tier: 2, weight: 8, minRealm: 1,
    require: 'sect() == "taixuan"',
    text: '问剑峰西侧的寒石台终年覆着一层薄霜。内门师兄沈孤云背剑立在台心，袖口沾着刚从北坡斩落的松雪。\n\n他朝你扬了扬下巴：「听说你在外门把《青锋养剑诀》练到了圆满？太玄的剑，不是对着空气比划出来的。上台接我三剑，赢了，这枚养剑丹归你；输了，替我抄十遍《剑戒》。」',
    choices: [
      {
        label: '拔剑登台，寸步不让', hint: '战斗 · 筑基剑修',
        cost: { month: 1 },
        combat: {
          enemy: 'cultivator',
          win: {
            text: '霜屑四溅，你硬借他第三剑的回劲挑落其剑穗。沈孤云收剑入鞘，罕见地勾了勾嘴角：「剑气不虚。来日内门大比，我等你。」',
            effects: { expPct: 0.18, contribution: 220, reputation: 25, attrs: { 根骨: 2 }, items: ['jianyi_dan'] },
          },
          lose: {
            text: '你只接住两剑，第三剑被震得虎口开裂，长剑脱手插进石缝。沈孤云将剑抛回给你：「腕力够，腰马浮了。」你老老实实抄完十遍《剑戒》，倒也理顺了不少剑理。',
            effects: { hp: -45, attrs: { 悟性: 2, 道心: 1 }, contribution: 80 },
          },
        },
      },
      {
        label: '以木剑代铁，专攻其剑势换气之隙', hint: '悟性检定 · 以巧论锋',
        cost: { month: 1 },
        roll: {
          p: 0.5, attrs: { 悟性: 0.015, 神识: 0.008 },
          success: {
            text: '木剑虽断成两截，断口却恰恰点在沈孤云收势的肘弯。他愣了一息，拱手道：「受教了。太玄多的是硬骨头，缺你这双看剑的眼。」',
            effects: { expPct: 0.16, lawExp: 20, lawId: 'sword', contribution: 200, attrs: { 悟性: 3 } },
          },
          fail: {
            text: '木剑甫一交击便被剑气削作漫天木屑，你连退五步才稳住下盘。沈孤云摇头：「小巧之技，遇上真杀招是要丢命的。」',
            effects: { hp: -30, attrs: { 根骨: 1 }, contribution: 60 },
          },
        },
      },
      {
        label: '抱拳辞战，请教一式破风剑步', hint: '谦逊求教 · 稳赚修为',
        outcome: {
          text: '沈孤云皱了皱眉，终究没为难你，随手在霜面上划出七个落脚点：「剑修可以认输，不能怕出剑。记住这步法，下月再来。」',
          effects: { exp: 320, attrs: { 道心: 1, 悟性: 1 }, contribution: 75 },
        },
      },
    ],
  },
  {
    id: 'wsa_tx_03', title: '断祖剑痕', pool: 'sect', tier: 3, weight: 7, minRealm: 1,
    require: 'sect() == "taixuan"',
    text: '北疆传回一具红漆剑匣，匣中静静躺着半截断裂的青铜古剑——据说是太玄第三代掌门佩剑「寒江」的残刃。剑身断口参差，残留着一缕挥之不去的北荒血煞。\n\n器堂长老正犯难：若以玄铁重铸，剑虽复形，却会抹去当年祖师临阵斩魔留下的那道无上剑痕；若留作残剑供奉，血煞又日夜侵蚀剑骨。',
    choices: [
      {
        label: '献出一块玄铁，助器堂稳住断剑本源', hint: '消耗玄铁 · 获重奖与剑道真意',
        cost: { item: 'xuantie', month: 1 },
        outcome: {
          text: '玄铁化液裹住断口，却刻意留出半寸古痕未曾遮盖。剑身忽然发出一声低沉嗡鸣，那缕百年血煞被生生逼出，化作青烟散去。器堂长老抚须赞叹不已。',
          effects: { contribution: 340, reputation: 35, lawExp: 28, lawId: 'sword', attrs: { 悟性: 3, 道心: 2 } },
        },
      },
      {
        label: '引自身剑气入匣，硬生生炼化残留血煞', hint: '根骨与道心检定 · 险中悟道',
        cost: { month: 1 },
        roll: {
          p: 0.5, attrs: { 根骨: 0.012, 道心: 0.012 },
          success: {
            text: '你的剑气与祖师残意合流，如雪峰崩落般碾碎那缕血煞。断剑虽未复原，却映出一幅祖师一剑断江的残影，烙进你的灵台。',
            effects: { expPct: 0.22, lawExp: 32, lawId: 'sword', contribution: 260, attrs: { 根骨: 3 } },
          },
          fail: {
            text: '血煞反噬顺着经脉窜入肺腑，你咳出一口暗红淤血。长老急忙出手镇压，叹息着赐下清心丹助你稳神。',
            effects: { hp: -55, demon: 6, items: ['qingxin_dan'], contribution: 110 },
          },
        },
      },
      {
        label: '临摹断口剑痕于玉简，建议原样封存剑阁', hint: '守旧存真 · 悟性提升',
        outcome: {
          text: '「剑折犹锋，正是太玄筋骨。」长老沉吟良久，采纳了你的提议，将断剑悬于剑阁正梁，并许你留存那份剑痕拓本。',
          effects: { contribution: 180, attrs: { 悟性: 3, 道心: 2 }, exp: 420 },
        },
      },
    ],
  },
  {
    id: 'wsa_tx_04', title: '外峰与内峰', pool: 'sect', tier: 3, weight: 7, minRealm: 1,
    require: 'sect() == "taixuan" && char.sectRank >= 1',
    text: '护脉大阵下的洗脉寒泉每逢冬至才开三日，泉水能涤去经脉杂质、温养灵根。可今年名额刚贴出，外门七峰便炸了锅——三十个席位，内峰世家出身的弟子竟占去二十四席。\n\n外峰几名寒门师弟攥着剑柄堵在执事堂台阶下，内峰领头的赵铭却冷笑连连：「寒泉按本事分座，弱者占着泉眼，不是糟蹋灵脉？」',
    choices: [
      {
        label: '立于两峰弟子之间：既按本事，便摆擂定席', hint: '战斗 · 孤鸿剑修',
        cost: { month: 1 },
        combat: {
          enemy: 'sword_rogue', displayName: '内峰弟子',
          win: {
            text: '你在碎雪里连胜内峰三名好手，剑尖垂地，无人再敢言声。戒律长老闻讯出面，当场划出十个寒门席位，外峰弟子看你的眼神从此不同。',
            effects: { contribution: 300, reputation: 45, karma: 15, attrs: { 道心: 3, 根骨: 2 }, flag: { 洗剑公道: true } },
          },
          lose: {
            text: '内峰底蕴终究深厚，你拼至灵力枯竭败下阵来。可外峰弟子扶起你时齐声叫好，戒律堂见群情激愤，亦勉强匀出五席。',
            effects: { hp: -60, injury: 1, reputation: 25, contribution: 140, attrs: { 道心: 3 } },
          },
        },
      },
      {
        label: '暗中查清执事堂偏私账册，呈报戒律堂长老', hint: '神识与魅力检定 · 以规制衡',
        cost: { month: 1 },
        roll: {
          p: 0.55, attrs: { 神识: 0.012, 魅力: 0.01 },
          success: {
            text: '三日前几笔来路不明的灵石贿赂被你一并翻出。执事堂主事被罚去思过崖面壁三年，寒泉重开公试，长老另赏你三百灵石，从此对你青眼有加。',
            effects: { contribution: 280, reputation: 35, stones: 300, attrs: { 神识: 2, 悟性: 2 } },
          },
          fail: {
            text: '账册早已被人誊改得天衣无缝，你反被赵铭倒打一耙，斥为挑动同门内斗，只得自认晦气退场。',
            effects: { contribution: -40, reputation: -10, attrs: { 道心: 2 } },
          },
        },
      },
      {
        label: '两不相帮，独自去后山冷溪磨剑', hint: '独善其身 · 心境清静',
        outcome: {
          text: '宗门里人多处必有是非。你提剑独坐寒溪，借流水冲刷剑锋，倒也避开了一场吃力不讨好的风波。',
          effects: { expPct: 0.14, demon: -5, attrs: { 道心: 2 } },
        },
      },
    ],
  },
  {
    id: 'wsa_tx_05', title: '剑炉淬心', pool: 'sect', tier: 3, weight: 7, minRealm: 2,
    require: 'sect() == "taixuan"',
    text: '赤铁谷深处的百炼剑炉轰鸣如雷。炉火不是寻常柴火，而是自地肺引出的庚金烈焰，赤中泛白，寻常法器靠得近了便会化作铁水。\n\n铸剑老怪赤着精铁般的臂膀，正用大钳夹出一枚通红剑胚，冲你吼道：「傻站着作甚？拿你的本命剑意来镇一锤！镇得住，剑炉分你三成精粹；镇不住，连你带剑一起烤成炭！」',
    choices: [
      {
        label: '催动满身剑意，迎着庚金烈焰狠落一锤', hint: '根骨与道心检定 · 淬炼剑骨',
        cost: { month: 2 },
        roll: {
          p: 0.55, attrs: { 根骨: 0.012, 道心: 0.01 },
          success: {
            text: '铁锤落下的刹那，火星如银河炸开。一缕精纯庚金之气反涌入你经脉，连佩剑也多了一层淡金寒芒。老怪大笑三声，抛来两块星辰砂。',
            effects: { items: ['xingchen_sha'], lawExp: 32, lawId: 'sword', attrs: { 根骨: 4 }, expPct: 0.18, contribution: 240 },
          },
          fail: {
            text: '烈焰扑面，灼得你眉发焦卷、经脉剧痛。虽未铸成绝品，老怪见你硬扛着没松手，仍丢给你一瓶碧血生肌丹。',
            effects: { hp: -65, items: ['bixue_dan'], attrs: { 根骨: 2 }, contribution: 110 },
          },
        },
      },
      {
        label: '投入一块赤阳炎石稳住炉温，细观锻打纹理', hint: '消耗赤阳炎石 · 悟剑器合一',
        cost: { item: 'chiyang_shi', month: 1 },
        outcome: {
          text: '炉火由暴烈转为澄明，剑胚表面浮现九道细密雷纹。你立在炉边看了整整七日，终于明白为何太玄古训说「器是剑之骨，意是剑之魂」。',
          effects: { expPct: 0.2, lawExp: 26, lawId: 'sword', attrs: { 悟性: 3 }, contribution: 260 },
        },
      },
      {
        label: '退至炉外替老怪拉风箱，换取炼器心得', hint: '踏实苦工 · 灵石与体魄小进',
        cost: { month: 1 },
        outcome: {
          text: '拉了一月玄铁风箱，双臂酸胀得几乎抬不起来，但呼吸却与剑炉吞吐合拍。老怪临别给了你一袋灵石与一把上好磨剑石。',
          effects: { stones: 450, attrs: { 根骨: 2 }, contribution: 150 },
        },
      },
    ],
  },
  {
    id: 'wsa_tx_06', title: '除锈旧训', pool: 'sect', tier: 3, weight: 6, minRealm: 2,
    require: 'sect() == "taixuan"',
    text: '清理思过崖旧窟时，你在石壁缝里摸出一柄被铁链锁死的重剑。剑鞘内侧刻着一行极深的指痕：「太玄历七百零四年，弟子谢无咎未降魔道，唯救凡村误违军令。」\n\n宗门卷宗上却分明写着：谢无咎临阵脱逃，勾结北荒魔修，削籍除名。石窟外风声呜咽，似在等一个迟到了两百年的公断。',
    choices: [
      {
        label: '带重剑上执事大殿，请求重查两百年前旧案', hint: '道心与魅力检定 · 触怒权贵或昭雪沉冤',
        cost: { month: 1 },
        roll: {
          p: 0.5, attrs: { 道心: 0.014, 魅力: 0.01 },
          success: {
            text: '当年主审那桩案子的长老早已坐化，掌门亲自启封密档，终于查明那年谢无咎孤身挡住血魔宗偏师三日，换来三千凡人迁徙。宗门重刻英名碑，你获赐谢氏遗留剑意玉简。',
            effects: { karma: 40, reputation: 50, contribution: 320, attrs: { 道心: 4 }, lawExp: 30, lawId: 'sword', items: ['yujian_qingfeng'] },
          },
          fail: {
            text: '戒律堂几名宿老面色铁青：「陈年旧账，动摇宗门威严，休要多言！」你虽被训斥罚俸，走出大殿时却觉胸中剑气前所未有地清朗。',
            effects: { contribution: -60, karma: 20, attrs: { 道心: 4 }, demon: -10 },
          },
        },
      },
      {
        label: '不惊动大殿，亲手为重剑除锈并立无名碑于剑冢', hint: '静守公义 · 心魔消散',
        cost: { month: 1 },
        outcome: {
          text: '你用了七日磨去重剑上的厚锈，青光重现那一刻，石窟里积郁百年的阴寒骤然散去。你替他在剑冢背风处埋下剑鞘，留下一壶清酒。',
          effects: { karma: 25, demon: -15, attrs: { 道心: 3 }, expPct: 0.16, contribution: 100 },
        },
      },
      {
        label: '只拓下剑身残留剑意，将重剑重新封入壁缝', hint: '明哲保身 · 稳得剑道感悟',
        outcome: {
          text: '死人已逝，活人的恩怨最难缠。你记住重剑上那股宁折不弯的劲道，合上石缝转身离去。',
          effects: { lawExp: 22, lawId: 'sword', attrs: { 悟性: 2 }, demon: 3 },
        },
      },
    ],
  },
  {
    id: 'wsa_tx_07', title: '守山阻魔', pool: 'sect', tier: 4, weight: 7, minRealm: 2,
    require: 'sect() == "taixuan" && char.sectRank >= 2',
    text: '黎明前最暗的一刻，太玄山门外的警戒剑钟连响九声！\n\n北荒血雾竟借大雪掩护摸至山脚，三百名血魔宗精锐结成血煞战阵，由一名血衣金丹魔修领衔，直扑护山剑阵的东南薄弱阵眼。此时掌门与大半长老正在闭关推演大阵，阵眼处只余你与十二名外门剑童。',
    choices: [
      {
        label: '孤身迎出剑阵外，斩其阵首挫敌锐气', hint: '血战 · 血魔宗金丹精锐',
        cost: { month: 1 },
        combat: {
          enemy: 'blood_cult',
          win: {
            text: '你一剑劈开血雾，将魔首钉死在山门石狮之下！魔军阵脚大乱，后山剑虹及时赶至，将残敌尽数绞杀。那一战后，外门剑童皆唤你「守门师兄」。',
            effects: { expPct: 0.28, contribution: 480, reputation: 65, karma: 30, lawExp: 35, lawId: 'sword', items: ['jiejin_dan'] },
          },
          lose: {
            text: '血煞刀气斩碎你的护体灵光，你拖着残躯死死抵住石门，直至长老剑光从天而降。虽身受重伤，山门终究寸步未失。',
            effects: { hp: -90, injury: 2, contribution: 280, reputation: 40, attrs: { 道心: 4 } },
          },
        },
      },
      {
        label: '率十二剑童结小周天剑阵，死守阵眼待援', hint: '悟性与道心检定 · 阵守无伤',
        cost: { month: 1 },
        roll: {
          p: 0.6, attrs: { 悟性: 0.012, 道心: 0.012 },
          success: {
            text: '十三柄飞剑连成一线霜墙，生生扛住血雾三轮猛攻，无一弟子折损。待主峰钟声大作、护山剑雨倾泻而下，长老当众记你首功。',
            effects: { contribution: 420, reputation: 50, karma: 25, expPct: 0.22, attrs: { 悟性: 3, 道心: 2 } },
          },
          fail: {
            text: '东南阵眼终被血雷炸开一道缺口，你拼死替两名剑童挡下一击，险险熬到援军合围。',
            effects: { hp: -70, injury: 1, contribution: 240, karma: 15, attrs: { 道心: 3 } },
          },
        },
      },
      {
        label: '激发压箱底剑符炸毁山道吊桥，断敌退路再请援', hint: '果决断桥 · 消耗灵石补修山道',
        cost: { stones: 300 },
        outcome: {
          text: '百丈玄铁吊桥轰然坠入雪谷，数十名魔修连同血幡一同跌入万丈冰涧。虽被后勤长老念叨了几句修桥费钱，战功却实打实记在你的玉牌上。',
          effects: { contribution: 340, reputation: 35, expPct: 0.16, attrs: { 悟性: 2 } },
        },
      },
    ],
  },
  {
    id: 'wsa_tx_08', title: '问剑碑刻', pool: 'sect', tier: 4, weight: 6, minRealm: 3,
    require: 'sect() == "taixuan" && char.sectRank >= 2',
    text: '问剑峰绝顶有一块十丈黑曜石碑，凡太玄历代元婴以上剑修，皆有资格在碑上留下一道剑痕，以供后辈观摩。\n\n石碑表面纵横交错着数百道前人剑气，有的霸道如崩雷，有的轻灵若游丝。今日云开雾散，执剑长老请来一盏寒茶，示意你提剑上前：「碑上还空着半尺青石，留一剑吧。」',
    choices: [
      {
        label: '倾尽平生剑意，斩出一道直破云海的孤锋', hint: '剑道大进 · 声望与称号',
        cost: { month: 2 },
        outcome: {
          text: '剑光落碑无声，三息之后，石碑斜裂三寸深痕，周围十丈云雾尽被削平。数十年后，仍有新入门的剑童在此碑前枯坐悟剑。',
          effects: { expPct: 0.26, lawExp: 55, lawId: 'sword', reputation: 80, contribution: 450, attrs: { 根骨: 3, 道心: 3 }, flag: { 问剑留痕: true } },
        },
      },
      {
        label: '以指代剑，轻描一道藏锋于拙的平淡刻痕', hint: '重返璞归真 · 悟性与道心大涨',
        cost: { month: 2 },
        outcome: {
          text: '外行看去只是一道寻常划痕，唯有执剑长老盯着那道细线看了半晌，长叹道：「锋芒尽收，已近无剑之境。」',
          effects: { expPct: 0.24, lawExp: 50, lawId: 'sword', attrs: { 悟性: 5, 道心: 4 }, contribution: 420, demon: -12 },
        },
      },
      {
        label: '暂不留痕，先观摩历代剑尊遗刻三月', hint: '厚积薄发 · 吸纳前人剑道',
        cost: { month: 3 },
        outcome: {
          text: '你对着黑曜石碑整整看了一个季度，从百位前辈的得失里照见自身破绽。虽未留名，手中剑却轻了三分、快了七分。',
          effects: { expPct: 0.3, lawExp: 65, lawId: 'sword', attrs: { 悟性: 4, 神识: 3 } },
        },
      },
    ],
  },
  {
    id: 'wsa_tx_09', title: '太玄剑令 · 截魔北道', pool: 'world', tier: 3, weight: 7, minRealm: 1,
    text: '暮雪封山，官道尽头插着三柄刻有「太玄」二字的青铜令剑。五名白衣剑修正在焦土上布设截杀阵，对面是十余名满身血气的北荒魔修，两方剑拔弩张。\n\n领头的太玄执事瞥见你路过，冷声喝道：「前方北道已被太玄剑令封锁！若非魔道余孽，速退三里——或者，拔剑助阵！」',
    choices: [
      {
        label: '拔剑并肩，助太玄剑修清剿魔道先锋', hint: '战斗 · 血魔宗弟子',
        combat: {
          enemy: 'blood_cult',
          win: {
            text: '刀剑交击之声响彻雪谷，你替那名执事挡下一记偷袭血刃，反手斩翻魔首。太玄执事破天荒地向你郑重抱拳，奉上剑宗谢礼。',
            effects: { expPct: 0.2, reputation: 45, karma: 25, stones: 380, items: ['jianqi_fu'], lawExp: 20, lawId: 'sword' },
          },
          lose: {
            text: '血煞漫天，你被魔修反扑震伤左肩。太玄剑修结阵将你救出重围，虽未全歼敌寇，却也记下了你这份义气。',
            effects: { hp: -55, reputation: 20, karma: 15, items: ['liaoshang_dan'] },
          },
        },
      },
      {
        label: '趁两方激战，暗中救下被魔修掳来的凡人药队', hint: '重义轻利 · 业力与道心双收',
        roll: {
          p: 0.65, attrs: { 神识: 0.01, 气运: 0.01 },
          success: {
            text: '你绕过正面剑雨，砍断囚车铁索，护着七名惊魂未定的药农逃入林间。老药农涕泪横流，把怀里藏着的一株千年灵草塞进你手里。',
            effects: { karma: 35, attrs: { 道心: 3 }, items: ['qiannian_lingcao'], reputation: 25 },
          },
          fail: {
            text: '一道流矢擦着你肋下飞过，好在仍护住了大半药农逃出生天。回望雪道，太玄剑虹已映红半边天。',
            effects: { hp: -35, karma: 25, attrs: { 道心: 2 } },
          },
        },
      },
      {
        label: '绕道三里避开锋芒，免得卷入正魔仇杀', hint: '明哲保身 · 顺路拾得残剑',
        outcome: {
          text: '太玄与血魔宗的旧账算不清。你顺着山脊绕过雪谷，只在枯松下捡到一张被风吹落的逃遁符箓。',
          effects: { items: ['shenxing_fu'], attrs: { 气运: 1 } },
        },
      },
    ],
  },
  {
    id: 'wsa_tx_10', title: '问剑天下 · 论锋青云', pool: 'world', tier: 4, weight: 6, minRealm: 2,
    text: '中州白玉台人声鼎沸。太玄剑宗与青云门每隔一甲子便要在此「论锋」——明为正道切磋，暗里却争着未来六十年九州正道盟主的话事权。\n\n台上太玄剑修一剑破云，青云弟子玉清神雷轰鸣，两宗长老在观礼亭里笑得云淡风轻，袖下的灵力却早已暗中较劲。',
    choices: [
      {
        label: '凝神观战三日，参悟剑道与雷法相激之妙', hint: '悟性大进 · 双法则感悟',
        cost: { month: 1 },
        outcome: {
          text: '你挤在石阶最前排看了三天三夜，剑虹斩雷电、雷光锁孤锋，一招一式皆成活教材。待大比散场，你只觉眼界豁然开朗。',
          effects: { expPct: 0.18, lawExp: 25, lawId: 'sword', attrs: { 悟性: 3, 神识: 2 } },
        },
      },
      {
        label: '借散场余兴登台叫阵，向正道天骄递出一招', hint: '战斗 · 金丹长老压境指点',
        combat: {
          enemy: 'jindan_elder',
          win: {
            text: '你一招破局，令观礼亭内两宗宿老同时起身！不论出身何门，今夜「{name}」二字已在中州坊市传开。',
            effects: { expPct: 0.25, reputation: 75, stones: 650, attrs: { 根骨: 2, 道心: 3 }, lawExp: 30, lawId: 'sword' },
          },
          lose: {
            text: '正道顶尖底蕴名不虚传，你三十招后败下阵来。可敢于当众向两宗递剑的胆魄，仍赢得满堂喝彩。',
            effects: { hp: -60, reputation: 35, attrs: { 悟性: 3 } },
          },
        },
      },
      {
        label: '在台下设局押注，顺便探听两宗暗流情报', hint: '气运与魅力检定 · 灵石进账',
        cost: { stones: 200 },
        roll: {
          p: 0.58, attrs: { 气运: 0.015, 悟性: 0.01 },
          success: {
            text: '你一眼看出青云那位真传暗伤未愈，果断反手压太玄险胜。盘口结算时，你兜里多了满满一袋上品灵石。',
            effects: { stones: 850, attrs: { 气运: 2 } },
          },
          fail: {
            text: '没料到青云弟子临阵破境引动紫霄雷，爆冷翻盘。你输了本钱，只买了个教训。',
            effects: { attrs: { 悟性: 1 } },
          },
        },
      },
    ],
  },
  {
    id: 'wsa_tx_11', title: '残剑哭山 · 剑宗悬赏', pool: 'world', tier: 4, weight: 6, minRealm: 3,
    text: '荒岭破庙外雨水如注，一名披着破烂赤袍的断臂剑修靠在石柱旁擦拭染血长剑——正是太玄剑宗悬赏三千灵石追杀的叛徒「血衣剑尊」。\n\n他抬眼看你，沙哑地笑了一声：「太玄的狗来得倒快。动手吧，不过动之前先听一句——我杀的那位长老，私底下拿外门弟子炼剑魄。」',
    choices: [
      {
        label: '无论缘由，持剑替太玄清理门户领赏', hint: '恶战 · 血衣剑尊',
        combat: {
          enemy: 'crimson_sword',
          win: {
            text: '雨夜里剑光交错数十合，血衣剑尊断剑脱手，临死前仍冷笑着指向太玄山方向。你携其佩剑换得厚赏，心底却留下一根极细的刺。',
            effects: { stones: 2600, reputation: 60, expPct: 0.28, items: ['taixu_jian'], demon: 4 },
          },
          lose: {
            text: '他虽断一臂，剑意却狠厉如疯狼。你肩头中剑退入雨幕，只听见他在庙里笑得咳血。',
            effects: { hp: -85, injury: 2, attrs: { 悟性: 2 } },
          },
        },
      },
      {
        label: '递出一瓶疗伤丹，换他手中的太玄黑幕密证', hint: '消耗疗伤丹 · 洞察隐秘与剑道',
        cost: { item: 'liaoshang_dan' },
        outcome: {
          text: '血衣剑尊盯着药瓶良久，忽然仰头吞下，抛给你一枚沾血玉简与半片剑意残纹：「带去给陆沉舟或者剑宗掌门，别给执法峰。」言罢消失于雨夜。',
          effects: { items: ['faze_canpian'], lawExp: 35, lawId: 'sword', karma: 20, relation: { 陆沉舟: 15 }, flag: { 血衣密证: true } },
        },
      },
      {
        label: '拱手退去，不掺和太玄剑宗的家丑', hint: '静观其变 · 道心安稳',
        outcome: {
          text: '宗门深处的肮脏事，外人插手最易招祸。你拉低斗笠转身入雨，身后破庙渐隐于雾中。',
          effects: { attrs: { 道心: 2 }, demon: -4 },
        },
      },
    ],
  },
  {
    id: 'wsa_tx_c1', title: '剑峰传承 · 霜阶问心', pool: 'sect', tier: 4, weight: 7, minRealm: 2,
    require: 'sect() == "taixuan"',
    once: true,
    text: '十年一启的「剑峰古阶」在问剑峰云端现形。三千级青霜石阶直通九天罡风，每一级都压着历代剑修留下的问心剑压。\n\n太玄剑痴陆沉舟难得收起了玩世不恭，抱着无鞘铁剑立在阶口看你：「太玄真正的镇宗传承不在藏经阁，在阶顶那座无字剑亭。走上去，别回头。」',
    choices: [
      {
        label: '不运护体灵光，单凭肉身与剑骨踏阶而上', hint: '根骨与道心检定 · 铸剑骨入二关',
        cost: { month: 1 },
        roll: {
          p: 0.58, attrs: { 根骨: 0.012, 道心: 0.01 },
          success: {
            text: '霜风如万千小刀刮过衣袍，你一步一血印，硬生生踩碎三千级剑压，登临半山断崖时周身剑鸣竟与群峰同频！',
            effects: { expPct: 0.2, attrs: { 根骨: 4, 道心: 3 }, lawExp: 25, lawId: 'sword', flag: { 霜阶纯骨: true } },
            goto: 'wsa_tx_c2',
          },
          fail: {
            text: '行至两千阶，你双膝剧震，终究不得不撑开剑气护体才勉强登崖。虽失了几分纯粹，剑心却被压得愈发紧实。',
            effects: { hp: -50, attrs: { 根骨: 2, 道心: 2 } },
            goto: 'wsa_tx_c2',
          },
        },
      },
      {
        label: '拔剑斩开扑面剑压，以攻代守强闯古阶', hint: '凌厉破局 · 直入断崖千锋',
        cost: { month: 1 },
        outcome: {
          text: '你一路递出一百零八剑，将前人残留的威压寸寸劈碎。阶口陆沉舟眼中亮起狂热战意：「好霸道的剑性！」',
          effects: { expPct: 0.18, lawExp: 22, lawId: 'sword', attrs: { 根骨: 3 }, relation: { 陆沉舟: 15 }, flag: { 霜阶斩压: true } },
          goto: 'wsa_tx_c2',
        },
      },
      {
        label: '自认火候未到，今日只观石阶剑势暂不登顶', hint: '缓图后进 · 错失此次传承链',
        outcome: {
          text: '云雾重新合拢，古阶隐去。你记住石阶上的剑压节奏，默默回到洞府闭关打磨根基。',
          effects: { expPct: 0.12, attrs: { 道心: 2 } },
        },
      },
    ],
  },
  {
    id: 'wsa_tx_c2', title: '剑峰传承 · 断崖千锋', pool: 'branch', tier: 5, weight: 0,
    text: (s) => `半山断崖风雪骤停，千柄无主光剑悬在云海之上，剑尖齐齐指向你眉心。\n\n${s.flags['霜阶纯骨'] ? '你周身剑骨清越作响，悬空千剑微微低垂三分，似在敬重纯正剑修。' : '千剑杀机锁定你全身死穴，稍有迟疑便会万剑穿心。'}\n\n崖畔虚空凝出一道模糊的太古剑灵残影，抬手虚握，整个断崖的空气瞬间化作森寒铁壁。`,
    choices: [
      {
        label: '正面迎战太古剑灵残影，夺取剑亭钥匙', hint: '生死试锋 · 太古剑灵残影',
        cost: { month: 1 },
        combat: {
          enemy: 'sword_phantom',
          win: {
            text: '你与残影对拼百招，终在电光石火间借断崖风势一剑贯穿其胸口！残影散作漫天清光，化作一枚白玉剑印落入你掌心，无字剑亭石门轰然洞开。',
            effects: { expPct: 0.28, lawExp: 40, lawId: 'sword', attrs: { 根骨: 3, 悟性: 3 }, flag: { 断崖胜灵: true } },
            goto: 'wsa_tx_c3',
          },
          lose: {
            text: '残影一剑挑飞你的长剑，剑气削落半截青衫。它却并未取你性命，反倒微微颔首，让开半步通路：「败而不折，准入剑亭。」',
            effects: { hp: -70, attrs: { 道心: 3 }, lawExp: 20, lawId: 'sword' },
            goto: 'wsa_tx_c3',
          },
        },
      },
      {
        label: '反手归剑入鞘，闭目以神识共鸣千剑剑意', hint: '悟性与神识检定 · 万剑朝宗',
        cost: { month: 1 },
        roll: {
          p: 0.55, attrs: { 悟性: 0.014, 神识: 0.012 },
          success: {
            text: '你弃锋不用，反令千剑失了敌意。刹那间千柄光剑齐鸣绕身，太古剑灵长笑一声化光消散，为你铺出一条直通剑亭的银虹。',
            effects: { expPct: 0.25, lawExp: 45, lawId: 'sword', attrs: { 悟性: 4, 神识: 3 }, flag: { 断崖胜灵: true } },
            goto: 'wsa_tx_c3',
          },
          fail: {
            text: '神识被千剑余威反震得头痛欲裂，好在剑灵见你胆气过人，终究挥袖放你过了断崖。',
            effects: { hp: -45, mp: -40, attrs: { 神识: 2 }, lawExp: 18, lawId: 'sword' },
            goto: 'wsa_tx_c3',
          },
        },
      },
    ],
  },
  {
    id: 'wsa_tx_c3', title: '剑峰传承 · 太玄一剑', pool: 'branch', tier: 5, weight: 0,
    text: (s) => `无字剑亭四面透风，亭中空无一物，唯有石桌上刻着太玄创派祖师的一句残问：「天下万剑归宗时，你手里握的是剑，还是苍生，抑或只是你自己？」\n\n${s.flags['断崖胜灵'] ? '你掌心白玉剑印骤然炽亮，亭顶浮现一道横贯九霄的先天剑意。' : '残存剑气在亭柱间缓缓流转，静待你落下一字之答。'}这一念，将定你日后剑道气象。`,
    choices: [
      {
        label: '「剑唯斩不平，护我心中所守之人」', hint: '侠剑证道 · 剑道法则与称号',
        cost: { month: 2 },
        outcome: {
          text: '石桌剑痕骤然大亮，一缕浩然清正的先天剑意垂落眉心。你走出剑亭时，太玄山七十二峰铁剑齐齐清鸣三声，恭迎新一代传灯剑修。',
          effects: { expPct: 0.35, lawExp: 80, lawId: 'sword', attrs: { 根骨: 4, 道心: 5 }, contribution: 600, reputation: 90, karma: 35, items: ['taixu_jian'], title: '问剑传灯', flag: { 太玄真传: true } },
        },
      },
      {
        label: '「剑无慈悲亦无偏私，唯斩前路一切樊笼」', hint: '孤锋极道 · 极致杀伐剑意',
        cost: { month: 2 },
        outcome: {
          text: '罡风刹那撕裂云海，你的剑意如孤峰拔地而起，锐不可当。亭外陆沉舟大笑拔剑遥敬，太玄一脉又出了一位只问极境的孤锋剑痴。',
          effects: { expPct: 0.38, lawExp: 90, lawId: 'sword', attrs: { 根骨: 6, 悟性: 3 }, contribution: 550, reputation: 80, items: ['jianyi_dan', 'faze_canpian'], title: '问剑传灯', flag: { 太玄真传: true } },
        },
      },
    ],
  },

  /* ========================================================================
   * 二、青云门（qingyun · 14 节点）
   * 风味：门规三百（不可欺师、不可负友）、七峰云海、玉清神雷、正道担当与妥协
   * ======================================================================== */
  {
    id: 'wsa_qy_01', title: '七峰论道会', pool: 'sect', tier: 2, weight: 8, minRealm: 0,
    require: 'sect() == "qingyun"',
    text: '春分七峰论道会在通天峰玉清殿外举行。龙首、落霞、大竹、风回等七峰弟子列座云台，明面是演法论经，暗里却为今年三条新探出的水灵脉归属争得面红耳赤。\n\n小竹峰一位女弟子轻声开口，却被龙首峰师兄挥袖打断：「小竹峰连年人丁稀少，分了上品灵脉也是暴殄天物！」',
    choices: [
      {
        label: '出列据理力争，按各峰历年除妖功绩重划灵脉', hint: '魅力与道心检定 · 赢得众峰敬重',
        cost: { month: 1 },
        roll: {
          p: 0.55, attrs: { 魅力: 0.012, 道心: 0.01 },
          success: {
            text: '你一笔笔念出近十年各峰下山除妖的伤亡簿，满场顿时鸦雀无声。掌门含笑颔首，拍板令小竹峰与大竹峰共分一脉，你也获赐青云玉露。',
            effects: { contribution: 200, reputation: 35, karma: 15, attrs: { 道心: 2, 魅力: 2 }, items: ['peiyuan_dan'] },
          },
          fail: {
            text: '龙首峰几名执事联手压下你的提议，只推说宗门自有考量。但散会后，小竹峰师姐悄悄赠你一瓶清心药丸聊表谢意。',
            effects: { contribution: 80, items: ['huiling_dan'], attrs: { 道心: 2 } },
          },
        },
      },
      {
        label: '提议七峰共享灵脉外围，设公共悟道亭', hint: '中正平和 · 契合青云门风',
        cost: { month: 1 },
        outcome: {
          text: '此议既保全大峰颜面，又让小峰弟子有处修行。七峰首座互望一眼，竟罕见地一致赞同。你趁势在论道会上演了一遍《青云诀》，心神豁达。',
          effects: { expPct: 0.16, contribution: 180, reputation: 25, attrs: { 悟性: 2, 道心: 2 } },
        },
      },
      {
        label: '静坐席末记录七峰法门异同，不涉派系争执', hint: '潜心悟法 · 提升修为与悟性',
        outcome: {
          text: '七峰争执不休时，你把各峰弟子施展的水雷双法默默拆解入心，反倒比上台吵架收获更大。',
          effects: { exp: 320, attrs: { 悟性: 3 }, lawExp: 12, lawId: 'thunder' },
        },
      },
    ],
  },
  {
    id: 'wsa_qy_02', title: '虹桥踏雾试', pool: 'sect', tier: 2, weight: 8, minRealm: 1,
    require: 'sect() == "qingyun"',
    text: '通天峰与朝阳峰之间架着一座十丈白虹云桥，桥下是深不见底的翻涌雾海。每逢弟子欲升内门，长老总会命其独行虹桥。\n\n你才行至桥心，雾气骤然化作往昔旧景：一个酷似你挚友的身影跌在断崖边呼救，而桥彼端传来长老焦急的催促——「误了时辰，便算试炼落第！」',
    choices: [
      {
        label: '明知多半是幻象，仍转身伸手相扶', hint: '重情守诺 · 契合青云第二条门规',
        cost: { month: 1 },
        outcome: {
          text: '你的手指触到对方袖口的刹那，幻境如琉璃碎裂。桥端白须长老抚掌大笑：「青云门规第二条，不可负友。纵使眼前是假，这颗心是真的。」',
          effects: { expPct: 0.18, attrs: { 道心: 4 }, demon: -12, contribution: 210, karma: 15 },
        },
      },
      {
        label: '以神识洞穿雾气阵眼，朗声破幻直行', hint: '神识与悟性检定 · 破妄通明',
        cost: { month: 1 },
        roll: {
          p: 0.55, attrs: { 神识: 0.014, 悟性: 0.01 },
          success: {
            text: '你一眼锁定桥栏下三枚幻阵玉符，指尖轻点清雷破雾。云桥重现真容，长老赞你灵台清澈、不为外相所惑。',
            effects: { expPct: 0.18, attrs: { 神识: 3, 悟性: 2 }, contribution: 220, lawExp: 18, lawId: 'thunder' },
          },
          fail: {
            text: '强破幻阵反引动桥底罡风，吹得你衣衫猎猎、灵力大耗，狼狈爬上彼端石阶。',
            effects: { mp: -45, hp: -25, attrs: { 道心: 2 }, contribution: 90 },
          },
        },
      },
      {
        label: '在桥心盘膝静坐，待迷雾自然散去', hint: '以静制动 · 锤炼道心',
        outcome: {
          text: '你不救不破，只守住灵台一点清明。半个时辰后云海自开，长老虽嫌你少了些锐气，却也承认你心性沉稳。',
          effects: { attrs: { 道心: 3 }, demon: -8, contribution: 130 },
        },
      },
    ],
  },
  {
    id: 'wsa_qy_03', title: '正魔边哨夜', pool: 'sect', tier: 3, weight: 8, minRealm: 1,
    require: 'sect() == "qingyun"',
    text: '细雨打湿了青云山南麓的边哨烽火台。今夜轮到你与两名师弟值守关卡，三更时分，山道浓雾里驶来一辆没有旗号的乌篷马车。\n\n掀帘一查，车夫竟是一名气息紊乱的魔道散修，怀里死死护着个高烧昏迷的六岁女童。「求仙长放行！」他跪在泥水里磕头，「这丫头不是魔修，只求去前方医馆抓副药！」',
    choices: [
      {
        label: '扣下魔修盘查，亲自取丹救治女童再送往医馆', hint: '法理与仁心兼顾 · 消耗疗伤丹',
        cost: { item: 'liaoshang_dan' },
        outcome: {
          text: '丹药化水服下，女童烧势渐退。细查之下，这魔修原是叛逃血魔宗的小卒，因不忍杀童才连夜逃命。你按规将其押回青云受审，却为他求了从轻发落。',
          effects: { karma: 35, reputation: 35, contribution: 220, attrs: { 道心: 3 }, demon: -8 },
        },
      },
      {
        label: '细察车厢暗格，提防魔道苦肉计偷袭边哨', hint: '战斗 · 潜伏邪修',
        combat: {
          enemy: 'rogue',
          win: {
            text: '果然！你剑尖挑开坐垫，暗格里竟藏着三张蚀阵魔符与一名潜伏的魔道刺客。一场苦战后你保住了边哨，亦妥善安置了被胁迫的孩童。',
            effects: { expPct: 0.2, contribution: 280, reputation: 40, karma: 20, stones: 240 },
          },
          lose: {
            text: '暗格刺客暴起偷袭，你仓促迎敌受了皮肉伤，幸得烽火台同门及时燃起警烟将贼人惊退。',
            effects: { hp: -50, contribution: 110, attrs: { 神识: 2 } },
          },
        },
      },
      {
        label: '严守边哨铁律，命其原路退回不得越界半步', hint: '铁面守规 · 稳妥无险',
        outcome: {
          text: '边哨重地岂容私放魔修。你冷脸挥剑逼退马车，听着雨夜里渐远的咳声，虽无过错，心头却莫名发沉。',
          effects: { contribution: 140, demon: 3, attrs: { 道心: 1 } },
        },
      },
    ],
  },
  {
    id: 'wsa_qy_04', title: '藏经密卷 · 旧案', pool: 'sect', tier: 3, weight: 7, minRealm: 2,
    require: 'sect() == "qingyun"',
    text: '替藏经阁整理霉损古籍时，一卷夹在《玉清雷谱》夹层里的密函滑落案头。墨迹已暗，落款却是两百年前青云一位已故戒律首座的私印。\n\n函中触目惊心地写着：当年被青云联手剿灭的「翠微山小宗」，并非勾结魔道，而是因不肯交出祖传雷脉而被扣上了通魔罪名。',
    choices: [
      {
        label: '持密函面呈掌门，请求暗中抚恤翠微后人', hint: '道心与魅力检定 · 直面宗门污点',
        cost: { month: 1 },
        roll: {
          p: 0.55, attrs: { 道心: 0.012, 魅力: 0.012 },
          success: {
            text: '掌门枯坐玉清殿半晌，长叹一声：「正道最怕的不是犯错，是知错而不敢认。」他暗中拨出灵石与丹药归还翠微遗脉，并赐你一枚雷纹玉符。',
            effects: { karma: 45, attrs: { 道心: 5 }, demon: -15, contribution: 300, items: ['zhangxin_leifu'] },
          },
          fail: {
            text: '掌门沉默收起密函，只淡淡道：「此事牵涉三宗旧盟，到此为止。」你退下石阶时，头一次看清名门正派衣袍下的阴影。',
            effects: { attrs: { 悟性: 3, 道心: 2 }, contribution: 120, demon: 3 },
          },
        },
      },
      {
        label: '抄录雷谱真意后，将密函封回暗格不张扬', hint: '潜心悟雷 · 避开政治旋涡',
        outcome: {
          text: '两百年前的血债，掀开来未必救得了死人，反倒可能牵连无辜弟子。你合上夹层，只把正文的玉清行雷法门牢记于心。',
          effects: { lawExp: 26, lawId: 'thunder', expPct: 0.16, attrs: { 悟性: 2 } },
        },
      },
      {
        label: '暗寻翠微山遗脉下落，私下赠其一卷养气玉简', hint: '私行公义 · 消耗灵石换来无愧于心',
        cost: { stones: 300, month: 1 },
        outcome: {
          text: '你在青云山下寻到那户早已沦为凡俗猎户的翠微后人，悄悄留下灵石与引气吐纳法。走出村口时，天际恰好放晴。',
          effects: { karma: 50, demon: -18, attrs: { 道心: 4, 气运: 2 } },
        },
      },
    ],
  },
  {
    id: 'wsa_qy_05', title: '门规三百 · 欺师与负友', pool: 'sect', tier: 3, weight: 7, minRealm: 1,
    require: 'sect() == "qingyun"',
    text: '青云门规三百条，头两条写在大殿照壁上：一曰不可欺师，二曰不可负友。\n\n可今夜这两条门规硬生生撞在了一处——与你一同入门的挚友林川跪在药堂外，怀里藏着一株私摘的百年灵草。他红着眼眶哑声道：「我娘在山下快撑不住了，师父闭关不批假，我若不偷这株草，天亮就没娘了！」巡山执事的灯笼已在十丈外晃动。',
    choices: [
      {
        label: '替他把灵草放回药圃，自己掏灵石去坊市买丹送下山', hint: '两全之策 · 消耗 260 灵石',
        cost: { stones: 260 },
        outcome: {
          text: '你拉住林川的手，把灵草悄悄栽回药畦，又将全部积蓄换成两瓶疗伤丹塞进他怀里。林川跪地磕了三个响头，从此成了你生死相托的过命之交。',
          effects: { karma: 35, attrs: { 道心: 4, 魅力: 2 }, demon: -12, contribution: 140, flag: { 青云义友: true } },
        },
      },
      {
        label: '替他引开巡山执事，事后自己去戒律堂领罚', hint: '不负挚友 · 损贡献而厚道心',
        outcome: {
          text: '你故意踩断枯枝引走执事，换来林川御剑下山救母。三日后你主动去戒律堂领了三十记戒鞭，师父看你的眼神虽严厉，却暗自放缓了力道。',
          effects: { hp: -40, contribution: -80, karma: 30, attrs: { 道心: 5 }, demon: -10 },
        },
      },
      {
        label: '拦下林川押交执事，再替他跪求师尊赐药', hint: '不欺师门 · 守正而险',
        roll: {
          p: 0.6, attrs: { 道心: 0.01, 魅力: 0.012 },
          success: {
            text: '师尊听完前因后果，虽罚林川面壁半年，却亲手赐下一枚青云回生丹派人送往山下。林川愧疚落泪，知你救了他两条路。',
            effects: { contribution: 200, reputation: 25, karma: 20, attrs: { 道心: 3 } },
          },
          fail: {
            text: '执事死板不通人情，拖延了两日才报呈长老，待药送下山时已迟了一步。林川从此与你形同陌路，你夜夜难安。',
            effects: { contribution: 120, demon: 10, attrs: { 道心: 1 } },
          },
        },
      },
    ],
  },
  {
    id: 'wsa_qy_06', title: '玉清演雷坪', pool: 'sect', tier: 3, weight: 7, minRealm: 2,
    require: 'sect() == "qingyun" && char.sectRank >= 1',
    text: '盛夏午后，通天峰后崖乌云压顶，电蛇在云腹里游走如龙。演雷坪上插着九根引雷铜柱，青云历代内门弟子皆在此借天然雷机淬炼《玉清神雷诀》。\n\n雷雨倾盆而下，铜柱已被电光染成刺目紫白，一名首座长老站在亭下高喝：「惧雷者退至石栏外，欲引雷入体者，踏坪！」',
    choices: [
      {
        label: '踏入铜柱中央，引一缕天雷贯通周天经脉', hint: '根骨与道心检定 · 雷霆法则暴涨',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 根骨: 0.012, 道心: 0.012 },
          success: {
            text: '紫电轰然劈落，你咬牙运转玉清心法将狂暴雷元收束丹田。焦烟散尽时，你指尖跳动着一朵清澈紫霄雷花，引得长老抚掌叫好！',
            effects: { expPct: 0.22, lawExp: 35, lawId: 'thunder', attrs: { 根骨: 3, 道心: 2 }, contribution: 260, items: ['leiyuan_dan'] },
          },
          fail: {
            text: '天雷过猛，炸得你衣袍焦黑、浑身酥麻跌出铜柱。好在长老及时挥袖泄去余威，只留下一身焦糊药香。',
            effects: { hp: -65, attrs: { 根骨: 2 }, lawExp: 15, lawId: 'thunder', contribution: 100 },
          },
        },
      },
      {
        label: '持雷击木立于坪边，借雷弧温养法器与雷符', hint: '消耗雷击木 · 稳得重宝雷符',
        cost: { item: 'leimu', month: 1 },
        outcome: {
          text: '雷击木在暴雨中绽出刺眼蓝芒，足足吸纳九道天雷余韵。雨过天晴，你亲手封成一张紫气隐隐的九霄神雷符。',
          effects: { items: ['jiuxiao_leifu'], lawExp: 28, lawId: 'thunder', contribution: 240, attrs: { 悟性: 2 } },
        },
      },
      {
        label: '在石栏外静观雷纹走向，临摹天雷轨迹', hint: '稳妥悟道 · 无损长进',
        cost: { month: 1 },
        outcome: {
          text: '你在雨幕里细看电蛇分叉合拢之理，虽未以身试雷，脑中却多出三套以雷破邪的变招。',
          effects: { expPct: 0.14, lawExp: 20, lawId: 'thunder', attrs: { 悟性: 3 } },
        },
      },
    ],
  },
  {
    id: 'wsa_qy_07', title: '调停双峰隙', pool: 'sect', tier: 4, weight: 7, minRealm: 2,
    require: 'sect() == "qingyun" && char.sectRank >= 2',
    text: '龙首峰与风回峰向来不睦，近月更因一桩山下除妖抢功的旧怨闹到拔剑相向。两峰真传约在落星涧私斗，消息一旦传出，青云七峰颜面扫地。\n\n掌门不便亲自下场偏袒，密令你以真传身份前去调停——既要压住火气，又不能寒了两边弟子的心。',
    choices: [
      {
        label: '一人独挡双峰剑锋，打完再坐下来分功过', hint: '战斗 · 金丹长老级试手',
        cost: { month: 1 },
        combat: {
          enemy: 'jindan_elder',
          win: {
            text: '你同时接住龙首峰的刚猛雷剑与风回峰的疾风阵，硬生生将两人逼退三步。双峰弟子心服口服，乖乖随你回殿重议功劳簿。',
            effects: { contribution: 380, reputation: 55, expPct: 0.22, attrs: { 道心: 3, 魅力: 2 } },
          },
          lose: {
            text: '两峰联手误伤于你，待他们回过神见你带伤仍寸步不让，羞愧难当，当场收剑认错。',
            effects: { hp: -65, contribution: 260, reputation: 35, attrs: { 道心: 4 } },
          },
        },
      },
      {
        label: '提一坛陈年青梅酒入涧，拆开妖尸查明真正致命一击', hint: '神识与魅力检定 · 智解嫌隙',
        cost: { month: 1 },
        roll: {
          p: 0.58, attrs: { 神识: 0.012, 魅力: 0.012 },
          success: {
            text: '你当场验出妖尸心脉是龙首峰雷法所震、咽喉为风回峰剑气所断——缺一不可。两峰弟子哑口无言，竟举碗共饮一坛梅酒，化干戈为玉帛。',
            effects: { contribution: 360, reputation: 50, karma: 20, attrs: { 魅力: 3, 神识: 2 }, stones: 400 },
          },
          fail: {
            text: '两方火气已上头，酒坛都被一剑劈碎。你只得亮出掌门玉牌强行押回山门，勉强止住血光。',
            effects: { contribution: 180, attrs: { 道心: 2 } },
          },
        },
      },
      {
        label: '请出山门外真正受难的村长当面致谢，以大义化私怨', hint: '正道感化 · 业力与道心双收',
        outcome: {
          text: '老村长颤巍巍递上一篮山杏：「没有几位仙师，俺们村早没了。」两峰真传面红耳赤，默默归剑入鞘。',
          effects: { contribution: 290, karma: 35, reputation: 40, attrs: { 道心: 3 }, demon: -10 },
        },
      },
    ],
  },
  {
    id: 'wsa_qy_08', title: '青云除魔诏', pool: 'sect', tier: 4, weight: 6, minRealm: 3,
    require: 'sect() == "qingyun" && char.sectRank >= 2',
    text: '玉清殿钟鸣七声，青云掌门亲颁「除魔诏」：东岭一座废弃灵石矿脉塌陷，底下渗出古战场阴煞，已聚起一头元婴境妖将率众肆虐三县。\n\n七峰各遣精锐会师矿口，掌门将一面青云镇雷旗交到你手中：「{name}，此去生死难料，唯愿你带多少师弟出去，便尽量带多少人回来。」',
    choices: [
      {
        label: '手持镇雷旗直捣矿心，斩杀妖将破煞源', hint: '硬仗 · 元婴妖将',
        cost: { month: 2 },
        combat: {
          enemy: 'demon_general',
          win: {
            text: '紫霄雷光炸碎矿窟黑雾，你一剑斩落妖将首级，镇雷旗插定灵脉之眼！七峰弟子齐声欢呼，三县百姓焚香遥拜青云山。',
            effects: { expPct: 0.3, contribution: 580, reputation: 85, karma: 45, lawExp: 45, lawId: 'thunder', items: ['zixiao_ling'] },
          },
          lose: {
            text: '矿底煞气极重，你拼着肋骨断裂才逼退妖将，掩护师弟们封死矿口撤离。掌门亲自为你疗伤，赞你当得起青云脊梁。',
            effects: { hp: -95, injury: 2, contribution: 320, reputation: 45, karma: 25, attrs: { 道心: 4 } },
          },
        },
      },
      {
        label: '先令七峰弟子布七星引雷阵净煞，再合围清剿', hint: '悟性与神识检定 · 谋定后动',
        cost: { month: 2 },
        roll: {
          p: 0.58, attrs: { 悟性: 0.012, 神识: 0.012 },
          success: {
            text: '七道天雷自矿顶齐落，阴煞未及成势便烟消云散，妖将在重创之下狼狈遁走。全军无一阵亡，此战被写入青云战典。',
            effects: { expPct: 0.26, contribution: 520, reputation: 70, karma: 40, lawExp: 38, lawId: 'thunder', items: ['dahuan_dan'] },
          },
          fail: {
            text: '妖将提前察觉阵眼偷袭西侧，虽最终击退魔潮，仍有数名师弟重伤，你自责不已。',
            effects: { hp: -55, contribution: 260, karma: 15, demon: 5, attrs: { 道心: 2 } },
          },
        },
      },
      {
        label: '先护送三县百姓迁离险境，再回师封矿', hint: '苍生为先 · 业力大增',
        cost: { month: 2 },
        outcome: {
          text: '你宁可放跑妖将，也要先把三县老幼护送到落霞城外。虽未夺得头功，可那一道道功德清气落入识海，令你心魔尽消。',
          effects: { karma: 65, demon: -20, reputation: 55, contribution: 310, attrs: { 道心: 5 } },
        },
      },
    ],
  },
  {
    id: 'wsa_qy_09', title: '青云巡山 · 义诊荒村', pool: 'world', tier: 2, weight: 7, minRealm: 1,
    text: '大旱后的荒村弥漫着诡异绿瘴，几名身穿月白道袍的青云巡山弟子正在井台边以玉清灵水替村民压毒，个个灵力见底、面色发白。\n\n村外林影晃动，一头借疫气滋生的碧磷毒蟒正吐着信子逼近井台。领头的青云师姐擦去额汗，望见你经过，抱拳高呼：「道友若念苍生不易，还请搭把手！」',
    choices: [
      {
        label: '迎击林外毒蟒，替青云弟子解围', hint: '战斗 · 碧磷毒蟒',
        combat: {
          enemy: 'poison_python',
          win: {
            text: '你斩落毒蟒七寸，村中绿瘴顿时散去大半。青云师姐感激涕零，将贴身携带的青云清毒丹与灵石赠你结缘。',
            effects: { expPct: 0.18, karma: 30, reputation: 35, items: ['jiexin_dan', 'biling_yu'], stones: 220 },
          },
          lose: {
            text: '毒雾呛入肺腑，你踉跄后退，幸得青云弟子合祭一道清雷逼走毒蟒。村子保住了，你也得了一场恶战历练。',
            effects: { hp: -45, karma: 20, items: ['jiexin_dan'] },
          },
        },
      },
      {
        label: '赠出一枚清毒解障丹，助其速解全村井毒', hint: '消耗清毒解障丹 · 功德无量',
        cost: { item: 'jiexin_dan' },
        outcome: {
          text: '丹丸化入井水，清香飘出三里，毒蟒闻味竟自行退入深山。青云弟子记下你的名号，回山后传为美谈。',
          effects: { karma: 45, reputation: 45, attrs: { 道心: 3, 气运: 2 }, demon: -10 },
        },
      },
      {
        label: '隔空丢去两张符纸提醒方位，自己不沾疫气', hint: '谨慎自保 · 留一份薄缘',
        outcome: {
          text: '你未曾涉险入村，只替他们指出毒蟒藏身的枯树。青云弟子遥遥抱拳致谢，你继续赶路。',
          effects: { karma: 10, attrs: { 神识: 1 } },
        },
      },
    ],
  },
  {
    id: 'wsa_qy_10', title: '正道盟书 · 碧落之约', pool: 'world', tier: 4, weight: 6, minRealm: 2,
    text: '北荒魔潮蠢动，青云门遣使遍走九州，于碧落江畔设「正道盟书」台，邀太玄、丹霞、天音、万象诸宗及四方豪杰歃血立约，共拒北荒血魔宗。\n\n然而席间暗流汹涌：有小宗门抱怨青云把最凶险的先锋位推给外人，却把灵脉战利品先划给大宗。',
    choices: [
      {
        label: '签下盟书并当众提议按斩敌实功分脉，打破大宗垄断', hint: '魅力与道心检定 · 名扬正道',
        cost: { month: 1 },
        roll: {
          p: 0.55, attrs: { 魅力: 0.014, 道心: 0.01 },
          success: {
            text: '满座中小宗门与散修齐声附和！青云特使沉吟片刻，当场改写盟约条款，并赠你一枚碧落正道玉佩以示拉拢。',
            effects: { reputation: 70, karma: 30, stones: 600, attrs: { 魅力: 3, 道心: 2 }, items: ['juling_dan'] },
          },
          fail: {
            text: '大宗执事冷笑打断：「无根浮萍也敢议九州大事？」虽未改约，台下却有不少散修暗暗记住了你的胆识。',
            effects: { reputation: 25, attrs: { 道心: 2 } },
          },
        },
      },
      {
        label: '只领一份北荒巡哨密图，不签死契保自由身', hint: '进退自如 · 得机缘情报',
        outcome: {
          text: '你不愿被大宗盟书绑住手脚，却也借机换得一份北荒灵脉与魔军动向图，日后行走九州大有用处。',
          effects: { expPct: 0.16, attrs: { 悟性: 2, 神识: 2 }, items: ['shenxing_fu'] },
        },
      },
      {
        label: '冷眼旁观正魔博弈，暗中买通记书吏探听各宗底牌', hint: '花费灵石 · 洞察九州暗局',
        cost: { stones: 300 },
        outcome: {
          text: '几杯薄酒下肚，那名小吏吐露了青云与太玄暗中争夺昆仑古钥的秘辛。你收好玉简，深觉九州水深。',
          effects: { attrs: { 神识: 3, 气运: 2 }, lawExp: 20, lawId: 'karma' },
        },
      },
    ],
  },
  {
    id: 'wsa_qy_11', title: '虹桥客至 · 论道青云', pool: 'world', tier: 4, weight: 6, minRealm: 3,
    text: '青云山外三十里云阶，合欢宗的七香宝辇竟大摇大摆停在山门牌坊下！车帘微挑，一位红衣美妇手持桃花扇笑吟吟递上拜帖：「听闻青云门规清严，妾身特来借贵派玉清雷水醒酒，顺便讨教一二。」\n\n山门守卫如临大敌，周围看热闹的九州修士挤满了石阶，谁都看得出这是魔道故意来试探青云虚实。',
    choices: [
      {
        label: '站出云阶接下桃花扇，以清正道意破其红尘魅音', hint: '道心与神识检定 · 扬正道清名',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 道心: 0.014, 神识: 0.01 },
          success: {
            text: '漫天粉雾在你一缕澄澈道音下尽数消散。红衣美妇收扇掩唇一笑：「好一个清净骨头，妾身记住你了。」宝辇调头离去，青云长老亲自奉茶致谢。',
            effects: { reputation: 70, attrs: { 道心: 4 }, demon: -15, stones: 750, items: ['bingxin_dan'] },
          },
          fail: {
            text: '那股幽香竟引动你心底旧念，神魂恍惚了一瞬，险些失态。幸得山门钟声响起将魅音震散。',
            effects: { demon: 8, attrs: { 道心: 2 } },
          },
        },
      },
      {
        label: '顺着合欢使者的话锋调侃两句，替两派递个台阶下', hint: '圆滑外交 · 魅力提升，两边结善缘',
        outcome: {
          text: '你笑着举杯邀两方共赏青云雾海，化解了眼看就要动手的僵局。红衣美妇临走前抛给你一瓶驻颜奇香，青云执事亦松了口气。',
          effects: { attrs: { 魅力: 4 }, stones: 500, items: ['zhuyan_dan'], reputation: 25 },
        },
      },
      {
        label: '静立云阶观摩两派气机交锋，悟水雷相济之理', hint: '旁观悟道 · 法则精进',
        outcome: {
          text: '红粉幻雾与玉清雷罡在山门前无声对撞半个时辰，你从气机起落里悟透不少攻守转换之道。',
          effects: { expPct: 0.2, lawExp: 30, lawId: 'thunder', attrs: { 悟性: 3 } },
        },
      },
    ],
  },
  {
    id: 'wsa_qy_c1', title: '通天雷洞 · 云海启封', pool: 'sect', tier: 4, weight: 7, minRealm: 2,
    require: 'sect() == "qingyun"',
    once: true,
    text: '通天峰绝壁之腹，藏着一处三百年才开启一次的「玉清雷洞」。洞口石门以七道青云镇印封死，门缝里不断泄出沉闷如远古战鼓的雷鸣。\n\n掌门亲自立于云台解印，回头望向随行诸真传：「当年祖师在洞中以天雷洗髓，悟出《太清通天录》。洞内雷罡不认辈分，只认道心——谁愿先入？」',
    choices: [
      {
        label: '步入雷雾洞口，以玉清诀引外围雷弧洗身', hint: '道心与根骨检定 · 稳步入雷池',
        cost: { month: 1 },
        roll: {
          p: 0.6, attrs: { 道心: 0.012, 根骨: 0.01 },
          success: {
            text: '石洞内电蛇如林，你心如明镜，竟将狂乱电弧引入周天脉络，肌肤隐现玉清宝光，顺着雷道直抵洞腹深处。',
            effects: { expPct: 0.2, lawExp: 26, lawId: 'thunder', attrs: { 道心: 3, 根骨: 2 }, flag: { 雷洞清明: true } },
            goto: 'wsa_qy_c2',
          },
          fail: {
            text: '一道暗雷擦肩炸裂，震得你气血翻腾、衣袖成灰，好在守住神台未曾倒下，咬牙迈进了第二重石廊。',
            effects: { hp: -55, attrs: { 根骨: 2 }, lawExp: 14, lawId: 'thunder' },
            goto: 'wsa_qy_c2',
          },
        },
      },
      {
        label: '以掌心五雷符先行探路，再借雷势疾进', hint: '消耗掌心五雷符 · 无伤闯关',
        cost: { item: 'zhangxin_leifu', month: 1 },
        outcome: {
          text: '五雷符在洞口炸出一条清亮通路，狂暴雷网竟如百川归海般被牵引至两壁。掌门颔首赞你用雷得法。',
          effects: { expPct: 0.18, lawExp: 30, lawId: 'thunder', attrs: { 悟性: 3 }, flag: { 雷洞清明: true } },
          goto: 'wsa_qy_c2',
        },
      },
      {
        label: '雷意太过凶险，留在洞口替同门护法观阵', hint: '稳健守成 · 错失后续传承',
        outcome: {
          text: '你守在云台外为入洞师兄稳住封印，虽未入雷洞深处，却也借外泄雷意修成半式护体雷环。',
          effects: { contribution: 180, lawExp: 16, lawId: 'thunder', attrs: { 道心: 2 } },
        },
      },
    ],
  },
  {
    id: 'wsa_qy_c2', title: '通天雷洞 · 玉清雷池', pool: 'branch', tier: 5, weight: 0,
    text: (s) => `洞腹豁然开朗，一汪丈许方圆的液态紫雷静静翻涌，水面漂着一朵含苞待放的雷莲。\n\n${s.flags['雷洞清明'] ? '你周身玉清宝光与雷池彼此呼应，紫液并未狂躁反扑。' : '你衣袍焦黑、灵力尚浮，雷池骤然卷起丈高电浪！'}\n\n池心雷雾凝成一尊双目如电的「紫霄雷灵」，手执雷戟审视着擅入祖地的后辈。`,
    choices: [
      {
        label: '以身试法，正面迎战紫霄雷灵', hint: '高阶雷战 · 紫霄雷灵',
        cost: { month: 1 },
        combat: {
          enemy: 'thunder_sovereign',
          win: {
            text: '雷戟在你的青云剑罡下崩作漫天星火！紫霄雷灵化作一缕精纯紫雷没入池心，那朵雷莲缓缓绽开，露出通往祖师道台的石梯。',
            effects: { expPct: 0.28, lawExp: 45, lawId: 'thunder', attrs: { 根骨: 3, 道心: 3 }, flag: { 雷池伏灵: true } },
            goto: 'wsa_qy_c3',
          },
          lose: {
            text: '紫雷贯体，你被震飞至洞壁吐血不止。可雷灵见你神台至终未染一丝邪念，收戟化雾退去，放你踏上道台。',
            effects: { hp: -75, attrs: { 道心: 4 }, lawExp: 22, lawId: 'thunder' },
            goto: 'wsa_qy_c3',
          },
        },
      },
      {
        label: '跃入雷池静坐诵读《青云诀》，以正气化雷煞', hint: '道心与悟性检定 · 雷池洗髓',
        cost: { month: 1 },
        roll: {
          p: 0.58, attrs: { 道心: 0.014, 悟性: 0.012 },
          success: {
            text: '雷液漫过胸膛却不伤筋骨，反将体内积年浊气与心魔尽数焚空！紫霄雷灵垂戟一礼，消散于池面。',
            effects: { expPct: 0.26, lawExp: 48, lawId: 'thunder', demon: -20, attrs: { 道心: 4, 悟性: 3 }, flag: { 雷池伏灵: true } },
            goto: 'wsa_qy_c3',
          },
          fail: {
            text: '雷液灼痛难忍，你几乎昏厥过去，全凭一口执念爬出雷池，却也脱去了一层凡胎浊气。',
            effects: { hp: -60, demon: -10, lawExp: 20, lawId: 'thunder', attrs: { 根骨: 2 } },
            goto: 'wsa_qy_c3',
          },
        },
      },
    ],
  },
  {
    id: 'wsa_qy_c3', title: '通天雷洞 · 紫霄问道', pool: 'branch', tier: 5, weight: 0,
    text: (s) => `道台之上，一尊青石蒲团蒙尘三百年，石壁刻着青云祖师羽化前最后的笔迹：「雷者，天之刑也，亦天之生机也。执雷之人，若只有怒，便成天灾；唯有慈与正，方见紫霄。」\n\n${s.flags['雷池伏灵'] ? '雷池莲蕊飞出一粒先天紫雷珠，静静悬于你掌心之上。' : '壁上雷篆微微亮起，映出你满身焦痕却澄澈的双眼。'}`,
    choices: [
      {
        label: '执天刑以诛妖邪，修刚猛紫霄灭魔雷', hint: '雷霆法则大成 · 得宝与称号',
        cost: { month: 2 },
        outcome: {
          text: '万钧紫电自洞顶垂落，化作一道雷印烙入你丹田。走出雷洞那日，青云七峰齐响清雷，掌门亲封你为通天峰掌雷传人。',
          effects: { expPct: 0.36, lawExp: 85, lawId: 'thunder', attrs: { 根骨: 4, 道心: 4 }, contribution: 600, reputation: 90, items: ['jiuxiao_leifu', 'leiyuan_dan'], title: '通天掌雷', flag: { 青云紫霄: true } },
        },
      },
      {
        label: '悟春雷生万物之理，融雷法入混元生机', hint: '雷霆与混沌兼修 · 寿元与道心大涨',
        cost: { month: 2 },
        outcome: {
          text: '你闭目体会雷雨之后万物勃发之妙，紫电化作绵绵生机反哺脏腑。出洞时你气息温润如玉，却令心怀鬼胎者不敢直视。',
          effects: { expPct: 0.32, lawExp: 65, lawId: 'thunder', attrs: { 道心: 5, 悟性: 5 }, lifespan: 40, demon: -20, contribution: 580, reputation: 85, items: ['yujian_benlei'], title: '通天掌雷', flag: { 青云紫霄: true } },
        },
      },
    ],
  },

  /* ========================================================================
   * 三、丹霞谷（danxia · 14 节点）
   * 风味：三百年不灭丹火、满谷药香、百草园、地火狂炉、丹道商战、九转丹鼎三段链
   * ======================================================================== */
  {
    id: 'wsa_dx_01', title: '百草园霜灾', pool: 'sect', tier: 2, weight: 8, minRealm: 0,
    require: 'sect() == "danxia"',
    text: '谷中三百年的丹火从未熄过，可今夜百草园却落下一场古怪的白霜。霜里藏着无数芝麻大小的「寒髓蛾」，一夜之间便啃枯了半亩百年灵草！\n\n管园的周药师急得胡子直翘：「这批灵草是下月开炉炼筑基丹的主料！用烈火硬烧会毁了药田地脉，可再拖两刻，三百株药苗全得死绝！」',
    choices: [
      {
        label: '以文火控焰化作药雾，将寒髓蛾尽数逼出药畦', hint: '悟性与神识检定 · 护全药田',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 悟性: 0.014, 神识: 0.01 },
          success: {
            text: '你细细调控丹火温度，温热药烟贴着叶尖掠过，寒髓蛾纷纷坠地化水，三百株灵草竟保住九成！周药师喜极而泣，当场分你两株上品灵草。',
            effects: { contribution: 200, expPct: 0.14, lawExp: 18, lawId: 'pill', items: ['lingcao', 'qiannian_lingcao'], attrs: { 悟性: 2 } },
          },
          fail: {
            text: '火候稍急，烤焦了外围十余株嫩芽，虽总算赶跑了寒蛾，仍被周药师心疼地数落了半宿。',
            effects: { contribution: 90, attrs: { 悟性: 1 }, items: ['lingcao'] },
          },
        },
      },
      {
        label: '徒手采摘将枯灵草，就地熬成一锅应急培元汤', hint: '止损得利 · 获培元丹',
        cost: { month: 1 },
        outcome: {
          text: '与其眼看药力烂在泥里，不如趁药性未散即刻封存。忙活到天明，你不仅替谷里挽回大半损失，还顺手凝出两枚温润的培元丹。',
          effects: { items: ['peiyuan_dan', 'huiling_dan'], contribution: 150, lawExp: 14, lawId: 'pill', attrs: { 悟性: 2 } },
        },
      },
      {
        label: '顺着寒霜气味追查源头，揪出暗中放虫的暗桩', hint: '战斗 · 采药黑修',
        combat: {
          enemy: 'herb_thief',
          win: {
            text: '果然是外头眼红丹霞生意的黑修暗放寒蛾！你在后山竹林将其拿获，起出半袋偷采灵草，大功一件。',
            effects: { contribution: 240, reputation: 25, stones: 220, items: ['lingcao'] },
          },
          lose: {
            text: '黑修撒出一把毒粉遁走山雾，你虽挂了点彩，总算惊跑了放虫之人。',
            effects: { hp: -35, contribution: 100 },
          },
        },
      },
    ],
  },
  {
    id: 'wsa_dx_02', title: '斗丹台试火', pool: 'sect', tier: 2, weight: 8, minRealm: 1,
    require: 'sect() == "danxia"',
    text: '赤霞坪上的斗丹台香烟缭绕，十二口青铜丹炉一字排开。谷中一年一度的「试火斗丹」今日开锣——所有参赛弟子蒙上双眼，全凭鼻尖药香与神识辨温，于一炷香内将七味相克灵药炼成一炉清心丹。\n\n你身旁是号称丹霞小天才的苏衡，他已率先拍开炉盖，赤金丹火腾起三尺，引得台下喝彩连连。',
    choices: [
      {
        label: '闭目凝神，以三昧文武交替之法慢火凝丹', hint: '悟性与神识检定 · 夺丹台魁首',
        cost: { month: 1 },
        roll: {
          p: 0.55, attrs: { 悟性: 0.015, 神识: 0.012 },
          success: {
            text: '香燃将尽，你轻拍炉腹，三枚通体无瑕、隐现丹晕的上品清心丹破雾飞出！苏衡盯着自己那枚微焦的丹丸怔了半晌，终究服气抱拳。',
            effects: { contribution: 260, reputation: 35, expPct: 0.16, lawExp: 26, lawId: 'pill', items: ['qingxin_dan', 'zhuji_dan'], attrs: { 悟性: 3 } },
          },
          fail: {
            text: '最后收丹时火势微抖，虽未炸炉，丹丸表面却多了两道裂纹，惜败于苏衡半筹。但丹堂长老仍夸你配药极准。',
            effects: { contribution: 130, lawExp: 14, lawId: 'pill', items: ['qingxin_dan'], attrs: { 悟性: 2 } },
          },
        },
      },
      {
        label: '剑走偏锋，刻意保留一缕寒药之性以毒攻毒', hint: '气运与悟性检定 · 炼出异品宝丹',
        cost: { month: 1 },
        roll: {
          p: 0.45, attrs: { 气运: 0.014, 悟性: 0.012 },
          success: {
            text: '炉顶冲起一缕罕见的碧青丹雾！开炉竟得一枚罕见冰心雪莲丹，连坐镇高台的丹尊都起身拍案叫绝！',
            effects: { contribution: 320, reputation: 45, lawExp: 32, lawId: 'pill', items: ['bingxin_dan'], attrs: { 悟性: 3, 气运: 2 } },
          },
          fail: {
            text: '一声闷响，丹炉炸开满面黑灰，把你熏成了花猫。台下哄堂大笑，你也只好摸着鼻子领了份清炉苦差。',
            effects: { hp: -25, contribution: 60, attrs: { 道心: 2 } },
          },
        },
      },
      {
        label: '不争魁首，稳稳炼出一炉中品丹药换取灵石', hint: '稳扎稳打 · 灵石与修为兼得',
        cost: { month: 1 },
        outcome: {
          text: '你按部就班控火出丹，虽无惊艳之举，却颗颗圆润饱满。管事按价收走成丹，给了你一笔可观灵石。',
          effects: { stones: 380, contribution: 140, lawExp: 14, lawId: 'pill', exp: 300 },
        },
      },
    ],
  },
  {
    id: 'wsa_dx_03', title: '地火炉驯焰', pool: 'sect', tier: 3, weight: 7, minRealm: 1,
    require: 'sect() == "danxia"',
    text: '丹霞谷地底三百丈有一条赤炎火脉，谷中三百年不灭的丹火皆源于此。今晨地脉翻身，第七号地火室的铜锁阵眼骤然发红，炽白火舌顺着烟道狂喷而出，整座丹房热得连青石板都开始龟裂。\n\n火室里还温养着长老炼了七七四十九日的半炉结金丹胚！若此刻关死火闸，整炉灵药立刻化灰。',
    choices: [
      {
        label: '顶着热浪冲入火室，以神识重刻地火控温阵', hint: '根骨与悟性检定 · 驯服暴焰保丹胚',
        cost: { month: 1 },
        roll: {
          p: 0.54, attrs: { 根骨: 0.012, 悟性: 0.014 },
          success: {
            text: '你汗如雨下却手稳如磐，九道灵诀打入火眼，狂躁的赤白火龙竟乖乖蜷回炉底！三日后丹成，长老豪爽地分你一枚结金丹。',
            effects: { contribution: 320, reputation: 40, lawExp: 30, lawId: 'pill', items: ['jiejin_dan'], attrs: { 根骨: 2, 悟性: 2 } },
          },
          fail: {
            text: '地火反扑灼伤你的双臂，你拼死拖出丹炉外罩，丹胚虽损了三成药力，总算保住了药室未塌。',
            effects: { hp: -60, contribution: 160, items: ['bixue_dan'], attrs: { 根骨: 2 } },
          },
        },
      },
      {
        label: '投入碧海玄冰髓压制火脉，以水火相济稳炉', hint: '消耗碧海玄冰髓 · 完美化解且悟丹道',
        cost: { item: 'bihai_xuanbing' },
        outcome: {
          text: '冰髓入火眼，轰鸣顿息，丹房内瞬间化作清亮的水火太极之象。长老惊叹连连，将一卷私藏火候手札赠予你。',
          effects: { contribution: 400, reputation: 50, lawExp: 40, lawId: 'pill', attrs: { 悟性: 4 }, expPct: 0.22 },
        },
      },
      {
        label: '果断拉下玄铁闸门封死火脉，先保同门性命', hint: '舍丹保人 · 稳妥无伤',
        outcome: {
          text: '闸门轰然落下，半炉丹胚化作焦炭。长老虽痛心疾首，叹了口气也没怪你：「丹毁了还能再炼，弟子烧没了可补不回来。」',
          effects: { contribution: 140, karma: 15, attrs: { 道心: 2 } },
        },
      },
    ],
  },
  {
    id: 'wsa_dx_04', title: '盗丹贼夜袭', pool: 'sect', tier: 3, weight: 7, minRealm: 1,
    require: 'sect() == "danxia"',
    text: '夜雨掩盖了谷口的药香。你照例巡视晾药阁，却闻到一股不属于任何灵草的铁锈腥味——三道黑影正从屋脊倒挂下来，手中钩爪直探阁内新炼成的筑基丹玉匣！\n\n为首那人背负鬼头厚刀，见你撞破行藏，冷笑一声：「丹霞谷的软脚药罐子，交出玉匣饶你一命！」',
    choices: [
      {
        label: '扬手洒出一把药火引爆烟障，提剑截杀盗丹贼', hint: '战斗 · 断魂刀客',
        combat: {
          enemy: 'blade_rogue',
          win: {
            text: '辛辣的赤阳药烟迷了贼人双眼，你趁势欺身斩断鬼头刀，将三名盗丹贼悉数捆在药柱上！丹堂重赏贡献与灵丹。',
            effects: { expPct: 0.2, contribution: 300, reputation: 35, stones: 320, items: ['zhuji_dan'] },
          },
          lose: {
            text: '刀客刀法极狠，划伤你胸口夺走一匣边角丹丸遁入雨夜。幸得你拼死护住了最珍贵的主匣。',
            effects: { hp: -55, injury: 1, contribution: 120, attrs: { 根骨: 2 } },
          },
        },
      },
      {
        label: '不动声色退至门外，拉响连环火油警铃锁死阁楼', hint: '以智擒贼 · 无伤建功',
        roll: {
          p: 0.62, attrs: { 悟性: 0.012, 气运: 0.01 },
          success: {
            text: '铁闸落下的刹那，阁内迷魂药雾齐发。不出一刻钟，三名凶悍刀客便软倒在地，你连汗都没出一滴便拿了头功。',
            effects: { contribution: 280, stones: 300, attrs: { 悟性: 2, 神识: 2 } },
          },
          fail: {
            text: '贼人警觉极高，破窗逃窜时顺手顺走两瓶回灵丹，好在未伤及谷中弟子。',
            effects: { contribution: 100, attrs: { 神识: 1 } },
          },
        },
      },
      {
        label: '故意放走一人，暗中撒上追踪药粉顺藤摸瓜', hint: '神识检定 · 端掉黑市接应点',
        roll: {
          p: 0.52, attrs: { 神识: 0.014, 气运: 0.01 },
          success: {
            text: '你循着夜光药粉一路追出三十里，竟牵出落霞坊市一家专门销赃的黑店！谷中执法队连夜端窝，分你三成赃款。',
            effects: { stones: 680, contribution: 320, reputation: 40, attrs: { 神识: 3 } },
          },
          fail: {
            text: '大雨冲淡了药粉气味，追出十里便失了踪迹，只捡到对方慌乱丢下的一袋灵草。',
            effects: { items: ['lingcao', 'lingcao'], contribution: 110 },
          },
        },
      },
    ],
  },
  {
    id: 'wsa_dx_05', title: '试药人风波', pool: 'sect', tier: 3, weight: 7, minRealm: 1,
    require: 'sect() == "danxia"',
    text: '丹霞谷的规矩，新方初成必先试药。焦须长老端着一粒泛着诡异紫晕的丹丸，笑眯眯堵在你洞府门前：「老夫新改的延寿丹，药性比古方烈三倍！寻常外门经脉太脆扛不住，我看你筋骨扎实——吞不吞？成了寿元大涨，翻车了老夫亲自替你洗胃！」',
    choices: [
      {
        label: '一口吞下，以自身真元慢慢化开霸道药力', hint: '根骨与气运检定 · 博大造化',
        cost: { month: 1 },
        roll: {
          p: 0.55, attrs: { 根骨: 0.012, 气运: 0.012 },
          success: {
            text: '丹药入腹如吞滚油，随即化作一股绵长青气游走四肢百骸！你筋骨噼啪作响，竟硬生生多出二十载寿元，长老激动得直拍大腿！',
            effects: { lifespan: 20, expPct: 0.2, attrs: { 根骨: 3 }, contribution: 260, stones: 300 },
          },
          fail: {
            text: '药力失控直冲天灵，你浑身起满红疹、连吐三日绿水。长老尴尬地赔了你一瓶大还丹和两百灵石封口。',
            effects: { hp: -50, items: ['dahuan_dan'], stones: 200, contribution: 150 },
          },
        },
      },
      {
        label: '先掰下一丝药屑研末验性，指出其中两味相冲之药', hint: '悟性检定 · 显露丹道慧眼',
        roll: {
          p: 0.55, attrs: { 悟性: 0.015, 神识: 0.01 },
          success: {
            text: '「赤阳花遇冰蚕露必生燥毒，长老少了一钱甘草作引！」长老闻言如雷灌顶，当场收你做半月丹童，倾囊传授调药秘诀。',
            effects: { lawExp: 32, lawId: 'pill', attrs: { 悟性: 4 }, contribution: 280, items: ['yanshou_dan'] },
          },
          fail: {
            text: '你猜错了药引配比，被长老吹胡子瞪眼训了一通：「纸上谈兵！」好在他也忘了逼你吞药。',
            effects: { attrs: { 悟性: 1 }, contribution: 70 },
          },
        },
      },
      {
        label: '婉言推辞，替长老捉一头耐毒妖猪来试药', hint: '稳健机敏 · 无险得酬',
        outcome: {
          text: '那头铁甲猪吞药后先是浑身冒烟，半个时辰后竟精神抖擞撞塌半堵墙。长老大喜过望，分了你一笔跑腿灵石。',
          effects: { stones: 280, contribution: 120, attrs: { 气运: 1 } },
        },
      },
    ],
  },
  {
    id: 'wsa_dx_06', title: '丹毒反噬', pool: 'sect', tier: 3, weight: 7, minRealm: 2,
    require: 'sect() == "danxia" && char.sectRank >= 1',
    text: '丹霞弟子最怕的不是斗法，是「丹毒积脉」。内门师姐柳如烟为冲金丹瓶颈连吞九枚破障丹，今夜丹毒骤然爆发，她蜷在冰玉榻上浑身青紫、神智迷乱，经脉随时可能寸断。\n\n药堂长老恰好外出采药，值守丹房里只剩你一人。',
    choices: [
      {
        label: '以自身真火配合银针，替她一点点逼出淤积丹毒', hint: '悟性与神识检定 · 救人且悟药理',
        cost: { month: 1 },
        roll: {
          p: 0.58, attrs: { 悟性: 0.012, 神识: 0.014 },
          success: {
            text: '整整六个时辰，你额头青筋暴起，终于将九缕黑紫丹毒尽数引出她掌心。柳如烟苏醒后感激不尽，赠你家传养神玉清丹，你也彻底明白了过犹不及的丹道铁律。',
            effects: { karma: 35, contribution: 300, lawExp: 30, lawId: 'pill', items: ['yangshen_dan'], attrs: { 神识: 2, 道心: 2 } },
          },
          fail: {
            text: '一缕残毒反窜入你经脉，好在最终稳住了柳如烟心脉，待长老归来一并将你二人救治妥当。',
            effects: { hp: -55, karma: 25, contribution: 200, attrs: { 道心: 2 } },
          },
        },
      },
      {
        label: '取出清心丹与冰心药引合煎，先护住她的神魂', hint: '消耗清心丹 · 稳妥救治',
        cost: { item: 'qingxin_dan' },
        outcome: {
          text: '冰凉药汁入喉，柳如烟狂乱的灵息迅速平复。三日后长老归谷，赞你处置得当，补赐双倍贡献。',
          effects: { karma: 30, contribution: 320, reputation: 30, attrs: { 道心: 3 }, demon: -8 },
        },
      },
      {
        label: '急放传讯火鹤呼唤别峰长老，自己守榻压脉', hint: '谨慎行事 · 小耗灵力无大险',
        cost: { mp: 40 },
        outcome: {
          text: '你以温和木火护住她心口半个时辰，终等来别峰长老出手解毒。虽未居首功，却也稳妥保全了同门性命。',
          effects: { contribution: 160, karma: 15, exp: 380 },
        },
      },
    ],
  },
  {
    id: 'wsa_dx_07', title: '药王旧方残页', pool: 'sect', tier: 4, weight: 6, minRealm: 2,
    require: 'sect() == "danxia" && char.sectRank >= 2',
    text: '丹霞祖师阁修缮屋顶时，梁木暗匣里掉出半张焦黄残纸，上头记载着失传已久的「九转回春方」。\n\n可惜最关键的三味辅药早已被火烤成黑洞，只留下一句耐人寻味的批注：「生机极处藏死气，死气绝处生春芽。」谷中几位长老争论七日仍莫衷一是。',
    choices: [
      {
        label: '闭关两月反复推演药性生克，补全残缺三味药', hint: '悟性检定 · 丹道大突破',
        cost: { month: 2 },
        roll: {
          p: 0.54, attrs: { 悟性: 0.015, 神识: 0.01 },
          success: {
            text: '你陡然拍案——那缺失的三味竟是极寒毒草与枯松灰！以毒激生，方成回春真意。照方开炉试炼，竟一次成丹，满谷药香三日不散！',
            effects: { expPct: 0.25, lawExp: 48, lawId: 'pill', contribution: 480, reputation: 60, items: ['yujian_yangshen', 'dahuan_dan'], attrs: { 悟性: 4 } },
          },
          fail: {
            text: '连废七炉灵草仍差最后一线火候，虽未彻底补全古方，你对阴阳药理的理解却深了一大截。',
            effects: { expPct: 0.16, lawExp: 24, lawId: 'pill', contribution: 160, attrs: { 悟性: 2 } },
          },
        },
      },
      {
        label: '携残页拜访苍茫妖森怪癖丹尊药尘子，求老前辈指点', hint: '结缘药尘子 · 换丹经妙理',
        cost: { month: 1, stones: 300 },
        outcome: {
          text: '药尘子拿烟袋敲了敲残页，怪笑两声随手写下三个歪扭大字：「白痴，连霜枯草都想不到？」你恍然大悟，重谢老丹尊后携方回谷。',
          effects: { relation: { 药尘子: 25 }, lawExp: 40, lawId: 'pill', contribution: 380, attrs: { 悟性: 3 }, items: ['juling_dan'] },
        },
      },
      {
        label: '将残页公之于丹堂石壁，集全谷弟子之力共参', hint: '胸怀坦荡 · 声望与贡献俱佳',
        outcome: {
          text: '你未将古方藏私，反倒激发了全谷钻研热潮。半年后集众人之智补全八成，丹堂将你的名字刻于方首。',
          effects: { contribution: 360, reputation: 50, karma: 25, attrs: { 道心: 3, 魅力: 2 } },
        },
      },
    ],
  },
  {
    id: 'wsa_dx_08', title: '丹霞开炉大典', pool: 'sect', tier: 4, weight: 6, minRealm: 3,
    require: 'sect() == "danxia" && char.sectRank >= 2',
    text: '十年一度的丹霞开炉大典，九州诸宗皆遣重使来观礼求丹。高台之上，重逾万斤的「赤霞神鼎」轰鸣预热，谷主因闭关稳境，特命你代为主持第一炉元婴宝丹的开火仪式。\n\n然而开炉前夕，你敏锐地察觉主药「千年灵草」竟被人悄悄调包成灵气枯竭的伪品！若贸然下药，满城贵客面前炸炉，丹霞三百年清誉将毁于一旦。',
    choices: [
      {
        label: '当机立断以自身珍藏千年灵草顶上，事后再暗查内鬼', hint: '消耗千年灵草 · 完美成丹扬威九州',
        cost: { item: 'qiannian_lingcao', month: 1 },
        outcome: {
          text: '赤霞神鼎丹云冲霄，九枚元婴玉露丹腾空绕台三匝！九州使者赞叹不绝。大典后你顺藤摸瓜揪出收受万宝阁黑钱的药库内奸，谷主重赏灵丹与重权。',
          effects: { contribution: 560, reputation: 85, lawExp: 50, lawId: 'pill', items: ['ningying_dan'], stones: 1200, attrs: { 道心: 3, 悟性: 3 } },
        },
      },
      {
        label: '故意拖延开炉半个时辰，当众验药揭穿内奸与幕后黑手', hint: '神识与魅力检定 · 雷霆震慑',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 神识: 0.014, 魅力: 0.012 },
          success: {
            text: '你手托伪草步上高台，一语道破调包手法，满场哗然！那名暗使脸色煞白当场遁逃未遂。换上真药后一炉成丹，丹霞威严反增三分。',
            effects: { contribution: 520, reputation: 80, lawExp: 42, lawId: 'pill', stones: 900, attrs: { 神识: 3, 魅力: 3 } },
          },
          fail: {
            text: '虽揪出了伪草避免炸炉，大典却不得不延期三日，引来几名他宗长老暗中讥讽。',
            effects: { contribution: 240, reputation: 15, attrs: { 道心: 2 } },
          },
        },
      },
      {
        label: '改用残缺灵草强行压火改方，化腐朽为神奇', hint: '悟性极高者可破局 · 险中证丹道',
        cost: { month: 1 },
        roll: {
          p: 0.45, attrs: { 悟性: 0.016, 道心: 0.01 },
          success: {
            text: '你临场拆解药方，以地火精粹强补药力缺口，竟在众目睽睽下把伪草炼出七成药效的奇丹！满座丹修起身长揖。',
            effects: { expPct: 0.28, lawExp: 65, lawId: 'pill', contribution: 600, reputation: 95, attrs: { 悟性: 5 } },
          },
          fail: {
            text: '丹鼎终究发出一声闷雷般的炸响，药烟呛散半场宾客。你引咎领罚，从此更懂丹道不容半点侥幸。',
            effects: { hp: -60, contribution: -80, reputation: -25, attrs: { 道心: 3 } },
          },
        },
      },
    ],
  },
  {
    id: 'wsa_dx_09', title: '丹霞采药队 · 妖森遇险', pool: 'world', tier: 2, weight: 7, minRealm: 1,
    text: '苍茫妖森雾气弥漫，一支背着竹篓的丹霞谷采药队正被一群狂躁妖兽围在枯木坡上。丹霞弟子多精于控火而不善搏杀，眼看一头通臂灵猿挥拳砸碎了他们的护体火罩。\n\n领队药师背着一筐沾泥的百年灵草，朝路过的你嘶声喊道：「道友救命！只要护我们出林，篓里灵草任挑三株！」',
    choices: [
      {
        label: '拔兵杀入兽群，击退通臂灵猿护送药队突围', hint: '战斗 · 通臂灵猿',
        combat: {
          enemy: 'spirit_ape',
          win: {
            text: '你硬接灵猿数拳，一招将其震退山谷。采药队千恩万谢，不仅送你上好灵草，还塞来两瓶丹霞自产回灵丹。',
            effects: { expPct: 0.18, karma: 25, reputation: 30, items: ['qiannian_lingcao', 'huiling_dan'] },
          },
          lose: {
            text: '灵猿力大无穷，震得你虎口崩裂，好在替药队争取了喘息之机，一行人狼狈逃出雾林。',
            effects: { hp: -45, karma: 15, items: ['lingcao', 'liaoshang_dan'] },
          },
        },
      },
      {
        label: '抛出一把辛辣烟火惊散兽群，趁乱引药队从溪涧脱身', hint: '智取解围 · 轻松获酬',
        roll: {
          p: 0.62, attrs: { 悟性: 0.012, 气运: 0.01 },
          success: {
            text: '烟火炸响，灵猿一时失措。你领着药队贴着溪水掩盖气味安然出林，药师奉上灵石与丹药酬谢。',
            effects: { stones: 280, items: ['lingcao', 'peiyuan_dan'], karma: 20, attrs: { 悟性: 2 } },
          },
          fail: {
            text: '烟火反倒激怒了灵猿，你一路狂奔才甩掉追兵，好在药队也趁乱逃了出去。',
            effects: { hp: -25, stones: 150, karma: 15 },
          },
        },
      },
      {
        label: '按兵不动，待两败俱伤后捡漏散落灵草', hint: '冷血逐利 · 损业力得灵草',
        outcome: {
          text: '你隐在树冠冷眼旁观，待丹霞弟子燃尽底牌符箓杀出重围后，悄然落坡拾走两株散落的灵草。',
          effects: { items: ['lingcao', 'lingcao'], karma: -18, demon: 4 },
        },
      },
    ],
  },
  {
    id: 'wsa_dx_10', title: '丹药禁运 · 丹霞与万宝', pool: 'world', tier: 3, weight: 7, minRealm: 2,
    text: '落霞城坊市一夜之间筑基丹暴涨三倍！原来万宝阁囤积了大半灵草强压丹霞谷供价，丹霞谷一怒之下宣布停售全部成丹，两宗商战波及九州。\n\n街头巷尾无数散修买不到续命丹药叫苦连天，而你恰好撞见万宝阁车队与丹霞谷弟子在城门外对峙。',
    choices: [
      {
        label: '替两宗牵线折中价目，换取城内丹药平价开仓', hint: '魅力与悟性检定 · 居中调停名利双收',
        cost: { month: 1 },
        roll: {
          p: 0.55, attrs: { 魅力: 0.014, 悟性: 0.012 },
          success: {
            text: '你算清双方耗下去的灵石死账，提出「以成丹换海路奇草」的折中契约。两宗执事各退半步，坊市丹价应声回落，两边各赠你一份厚礼。',
            effects: { stones: 750, reputation: 55, karma: 30, items: ['zhuji_dan'], attrs: { 魅力: 3 } },
          },
          fail: {
            text: '两宗正打到火头上，谁也不肯听外人说教，你只得悻悻退场。',
            effects: { attrs: { 悟性: 1 } },
          },
        },
      },
      {
        label: '趁低价收一批散落灵草转卖丹霞，狠赚一笔差价', hint: '商机敏锐 · 消耗 300 灵石大赚',
        cost: { stones: 300 },
        outcome: {
          text: '你在乡野小市高价收草再转手交给焦头烂额的丹霞管事，一进一出净赚翻倍灵石，还顺手换了枚聚灵丹。',
          effects: { stones: 950, items: ['juling_dan'], attrs: { 气运: 2 } },
        },
      },
      {
        label: '自掏腰包赠几枚疗伤丹给重伤买不起药的散修', hint: '雪中送炭 · 业力与人缘大涨',
        cost: { item: 'liaoshang_dan' },
        outcome: {
          text: '那名散修握着丹瓶红了眼眶，临走前把一张自己探得的野药谷地图塞进你手里。',
          effects: { karma: 40, reputation: 35, items: ['qiannian_lingcao'], attrs: { 道心: 3 } },
        },
      },
    ],
  },
  {
    id: 'wsa_dx_11', title: '残炉药香 · 求丹丹霞', pool: 'world', tier: 4, weight: 6, minRealm: 3,
    text: '丹霞谷外十里的迎客亭挤满了各方大修——太玄的剑长老、万兽山的驯兽客、甚至还有裹着黑袍的散仙，全为求取丹霞谷三年才开一炉的「天阶续命丹」。\n\n丹童捧着玉盘走出山门：「谷主说了，灵石我们不缺。唯有一件——谁能答出丹火为何三百年不灭，谁便排头号炉位。」',
    choices: [
      {
        label: '「非薪尽火传，乃求药之人惜命之心不绝」', hint: '切中丹道本心 · 获头号求丹礼遇',
        cost: { stones: 600 },
        outcome: {
          text: '山门内传来一声苍老朗笑！丹童连忙奉上一枚尚带余温的松鹤延寿丹，并传话称丹霞谷随时欢迎你来论丹。',
          effects: { items: ['yanshou_dan'], lawExp: 35, lawId: 'pill', reputation: 50, attrs: { 悟性: 3, 道心: 2 } },
        },
      },
      {
        label: '不争头炉，借迎客亭与各方丹修交换丹方秘闻', hint: '广结丹缘 · 悟性与法则精进',
        cost: { month: 1 },
        outcome: {
          text: '你在亭中煮茶听诸宗丹师争锋，一夜便胜过十年苦读，识海里多出数门控火奇技。',
          effects: { expPct: 0.2, lawExp: 38, lawId: 'pill', attrs: { 悟性: 4 } },
        },
      },
      {
        label: '趁众人争抢头炉，悄悄买下丹童倒出的半盆灵药渣', hint: '慧眼拾遗 · 气运检定',
        cost: { stones: 180 },
        roll: {
          p: 0.6, attrs: { 气运: 0.015, 悟性: 0.01 },
          success: {
            text: '旁人嫌弃的焦黑药渣里，竟沉着一粒未曾化开的九转丹胎精粹！你回洞府二次提炼，修为与生机大涨。',
            effects: { expPct: 0.24, lifespan: 15, lawExp: 25, lawId: 'pill' },
          },
          fail: {
            text: '药渣里的灵气早已散尽，只熬出两碗苦涩无比的清火茶。',
            effects: { demon: -6, attrs: { 道心: 1 } },
          },
        },
      },
    ],
  },
  {
    id: 'wsa_dx_c1', title: '九转丹鼎 · 封火初启', pool: 'sect', tier: 4, weight: 7, minRealm: 2,
    require: 'sect() == "danxia"',
    once: true,
    text: '丹霞谷最深处的「红莲地窟」里，供奉着创派祖师留下的九转丹鼎。鼎身九条火龙浮雕沉睡百年，唯当谷中出现丹心澄明之辈，鼎耳才会自鸣。\n\n今日你步入地窟添火，九龙竟齐齐吐出赤金火丝！守窟老药婆佝偻着背递来三味主药：「九转鼎醒，非福即祸。开炉，还是退步？」',
    choices: [
      {
        label: '接过三味主药，引自身丹火点燃九转鼎首转', hint: '悟性与神识检定 · 开启九转丹道',
        cost: { month: 1 },
        roll: {
          p: 0.58, attrs: { 悟性: 0.014, 神识: 0.01 },
          success: {
            text: '鼎腹轰鸣，九条火龙如活物般游走鼎壁。第一转药液凝作琥珀清露，老药婆眼中精光暴涨：「稳住心神，地火三昧要来了！」',
            effects: { expPct: 0.18, lawExp: 28, lawId: 'pill', attrs: { 悟性: 3 }, flag: { 九转初成: true } },
            goto: 'wsa_dx_c2',
          },
          fail: {
            text: '炉火骤然窜高三丈，烤得你双掌起泡。好在你死守神识未让药液焦枯，勉强拖进了第二转火候。',
            effects: { hp: -45, lawExp: 16, lawId: 'pill', attrs: { 道心: 2 } },
            goto: 'wsa_dx_c2',
          },
        },
      },
      {
        label: '先投一株千年灵草作火引，平顺度过首转', hint: '消耗千年灵草 · 稳入二关',
        cost: { item: 'qiannian_lingcao', month: 1 },
        outcome: {
          text: '灵草化作漫天青雾裹住暴烈火龙，九转丹鼎发出清越钟鸣，首转竟成十成药力！',
          effects: { expPct: 0.2, lawExp: 32, lawId: 'pill', attrs: { 悟性: 3 }, flag: { 九转初成: true } },
          goto: 'wsa_dx_c2',
        },
      },
      {
        label: '向老药婆躬身告退，自认火候未足以御神鼎', hint: '守拙退出 · 止步此链',
        outcome: {
          text: '火龙重新敛入鼎身。老药婆轻叹：「知进退亦是药理。」顺手赐你一瓶培元丹。',
          effects: { items: ['peiyuan_dan'], attrs: { 道心: 2 } },
        },
      },
    ],
  },
  {
    id: 'wsa_dx_c2', title: '九转丹鼎 · 三昧炼心', pool: 'branch', tier: 5, weight: 0,
    text: (s) => `炉火行至第五转，红莲地窟竟凭空生出奇异幻香——那不是药香，而是你平生所有未竟执念与贪欲化成的「丹心魔火」。\n\n${s.flags['九转初成'] ? '鼎内琥珀药液清亮稳固，替你挡住了大半灼心幻焰。' : '鼎内药液剧烈沸腾，一丝心魔顺着丹火倒灌进你的识海！'}\n\n「以身为炉，炼丹先炼心。」老药婆的声音远在雾外，眼前已凝出一尊与你一模一样的心魔幻影。`,
    choices: [
      {
        label: '斩碎丹心幻影，不让杂念污了半寸药液', hint: '心魔死战 · 心魔',
        cost: { month: 1 },
        combat: {
          enemy: 'heart_demon',
          win: {
            text: '三昧真火化作清莲在识海绽放，心魔惨嚎着化为精纯燃料反哺丹鼎！鼎壁六转至八转雷纹一气贯通！',
            effects: { expPct: 0.26, lawExp: 42, lawId: 'pill', demon: -20, attrs: { 道心: 4 }, flag: { 丹心无垢: true } },
            goto: 'wsa_dx_c3',
          },
          lose: {
            text: '你被心魔扯入往事泥潭，险些松开控火印诀。危急关头老药婆敲响青铜药杵将你震醒，鼎内残焰犹存一线生机。',
            effects: { hp: -55, demon: 6, lawExp: 20, lawId: 'pill', attrs: { 道心: 2 } },
            goto: 'wsa_dx_c3',
          },
        },
      },
      {
        label: '不斩心魔，反引心魔之火为薪，以欲炼丹', hint: '道心与悟性检定 · 化魔为火',
        cost: { month: 1 },
        roll: {
          p: 0.55, attrs: { 道心: 0.014, 悟性: 0.014 },
          success: {
            text: '「毒药亦是良药，贪念亦是火种！」你大笑收束心魔火丝投入丹鼎，炉火骤由赤金转为澄澈青紫，臻至八转大成！',
            effects: { expPct: 0.28, lawExp: 48, lawId: 'pill', demon: -15, attrs: { 悟性: 4, 道心: 3 }, flag: { 丹心无垢: true } },
            goto: 'wsa_dx_c3',
          },
          fail: {
            text: '心火险些反客为主烧毁经脉，你连吐两口淤血才勉强稳住鼎温，总算撑到了九转临门。',
            effects: { hp: -60, demon: 8, lawExp: 22, lawId: 'pill' },
            goto: 'wsa_dx_c3',
          },
        },
      },
    ],
  },
  {
    id: 'wsa_dx_c3', title: '九转丹鼎 · 丹成九转', pool: 'branch', tier: 5, weight: 0,
    text: (s) => `七七四十九日将满，红莲地窟穹顶竟浮现一抹丹霞瑞云！九转丹鼎发出清越龙吟，炉盖自动浮起三寸，一粒流转九道金纹的绝世宝丹正欲破鼎飞遁。\n\n${s.flags['丹心无垢'] ? '宝丹嗅到你澄澈丹心，竟主动盘旋在你掌心之上不肯离去。' : '宝丹灵性暴烈，眼看便要化虹冲破地窟！'}\n\n老药婆浑浊的双眼落下两行热泪：「三百年了，丹霞谷总算又炼出九转真丹！」`,
    choices: [
      {
        label: '当场吞服半缕丹霞本源，将成丹献归谷中镇派', hint: '丹道法则大进 · 功德、贡献与称号',
        cost: { month: 1 },
        outcome: {
          text: '一缕先天药气融入肺腑，你寿元骤增、丹火永固。九转金丹供入丹霞祖殿，谷主亲赐你「丹霞真火」尊号，全谷药师莫不俯首。',
          effects: { expPct: 0.34, lawExp: 85, lawId: 'pill', lifespan: 60, attrs: { 悟性: 5, 道心: 4 }, contribution: 650, reputation: 95, items: ['dahuan_dan', 'yanshou_dan'], title: '丹霞真火', flag: { 九转丹成: true } },
        },
      },
      {
        label: '以玉瓶亲自收走这枚九转金丹，留作此生渡劫底牌', hint: '独得九转金丹 · 仙途无忧',
        cost: { month: 1 },
        outcome: {
          text: '你指诀一收，将流光溢彩的九转金丹收入白玉瓶中。老药婆笑着摆手：「谁炼的便是谁的造化，拿去吧！」',
          effects: { expPct: 0.3, lawExp: 75, lawId: 'pill', attrs: { 悟性: 4, 气运: 3 }, contribution: 450, reputation: 80, items: ['jiuzhuan_dan'], title: '丹霞真火', flag: { 九转丹成: true } },
        },
      },
    ],
  },

  /* ========================================================================
   * 四、天音寺（tianyin · 14 节点）
   * 风味：寺中不供佛只供一口古钟、梵钟崖枯坐、镇魔塔异动、因果机锋、大梵古钟三段链
   * ======================================================================== */
  {
    id: 'wsa_ty_01', title: '梵钟崖枯坐', pool: 'sect', tier: 2, weight: 8, minRealm: 0,
    require: 'sect() == "tianyin"',
    text: '天音寺没有泥塑金身的大雄宝殿，山崖尽头只悬着一口青绿铜斑的巨大古钟。山风灌过钟口，发出一声声似有若无的低嗡，听久了竟叫人胸口发闷、往事翻涌。\n\n扫地老僧敲了敲你面前的青石：「今夜值崖。听见哭声别回头，听见佛号别合掌——都是你心里长出来的草。」',
    choices: [
      {
        label: '敛目数息，任钟声震荡骨髓涤尽杂念', hint: '道心检定 · 固本清心',
        cost: { month: 1 },
        roll: {
          p: 0.58, attrs: { 道心: 0.014, 神识: 0.008 },
          success: {
            text: '三更之后，风中果然传出故人唤你小名的低语。你不应不辨，只听那口古钟嗡鸣归于沉寂，黎明时分浑身如水洗般透亮。',
            effects: { expPct: 0.16, demon: -16, attrs: { 道心: 3, 神识: 2 }, lawExp: 18, lawId: 'karma', contribution: 140 },
          },
          fail: {
            text: '耳畔杂音越来越响，你险些顺着心火站起身来。老僧在背后轻拍你肩头，那一掌冰凉如秋水，把你拉回石台。',
            effects: { demon: -5, attrs: { 道心: 2 }, contribution: 75 },
          },
        },
      },
      {
        label: '以指节轻叩石面，与山风钟鸣应和成律', hint: '悟性检定 · 初窥梵音杀伐',
        cost: { month: 1 },
        roll: {
          p: 0.52, attrs: { 悟性: 0.014, 神识: 0.01 },
          success: {
            text: '指尖叩石的微响竟与十丈铜钟产生共鸣，方圆三丈碎雪骤然悬停半空！老僧驻足看了你三息：「你听出钟里的杀机了。」',
            effects: { expPct: 0.18, lawExp: 24, lawId: 'karma', attrs: { 悟性: 2, 神识: 2 }, contribution: 180 },
          },
          fail: {
            text: '音律差了半拍，反震得你耳膜嗡嗡作响，鼻端渗出一缕淡血。',
            effects: { hp: -25, attrs: { 神识: 1 }, contribution: 70 },
          },
        },
      },
      {
        label: '借清凉钟韵默默抄完一卷《大音希声》残章', hint: '踏实修行 · 稳增修为与贡献',
        cost: { month: 1 },
        outcome: {
          text: '墨香混着冷雾，一夜写满十二页禅纸。虽无顿悟奇象，丹田灵力却比平日沉实了一圈。',
          effects: { exp: 320, contribution: 120, demon: -8, attrs: { 道心: 1 } },
        },
      },
    ],
  },
  {
    id: 'wsa_ty_02', title: '镇魔塔异动', pool: 'sect', tier: 3, weight: 8, minRealm: 1,
    require: 'sect() == "tianyin"',
    text: '三更天，后山九层镇魔塔忽然传来铁链崩响！塔底镇压着百年前从北荒捉回的怨煞恶魂，今夜恰逢朔月阴盛，第三层的朱砂佛印裂开了一道手指宽的缝。\n\n浓黑怨气从石缝里嘶嘶涌出，如无数双枯手抓向塔廊灯火。值夜的武僧师兄满头大汗地按住经轮：「快！压不住这口阴眼，塔里三百厉鬼都要翻身！」',
    choices: [
      {
        label: '踏入塔廊正面迎击逸出的怨魂头目，将其逼回锁链', hint: '战斗 · 怨魂',
        cost: { month: 1 },
        combat: {
          enemy: 'ghost',
          win: {
            text: '你口诵伏魔咒印，掌风夹着清越钟音劈碎黑雾，将厉鬼硬生生拍回塔心石棺！武僧趁势补全朱砂佛印，塔身重归死寂。',
            effects: { expPct: 0.2, contribution: 260, karma: 25, demon: -10, lawExp: 22, lawId: 'karma', items: ['poxie_fu'] },
          },
          lose: {
            text: '阴寒怨气钻入护体灵光，冻得你四肢僵麻。幸得罗汉堂长老及时敲响山巅古钟，一声钟鸣震散残魂。',
            effects: { hp: -50, contribution: 110, attrs: { 道心: 2 } },
          },
        },
      },
      {
        label: '贴出镇魔破邪符封住石缝，合力诵经度化怨气', hint: '消耗镇魔破邪符 · 慈悲渡厄',
        cost: { item: 'poxie_fu' },
        outcome: {
          text: '金红符纸化作一轮梵文光轮堵死裂缝，塔内凄厉尖啸竟渐渐转作低沉呜咽。那一夜有七缕沉怨自行散去，化作功德清光绕你周身。',
          effects: { karma: 45, demon: -18, contribution: 300, attrs: { 道心: 4 }, lawExp: 26, lawId: 'karma' },
        },
      },
      {
        label: '急奔梵钟崖撞响三声警钟，调动全寺罗汉封塔', hint: '守序无险 · 稳妥止灾',
        outcome: {
          text: '三声厚重钟鸣滚过山谷，十里内草木皆震，塔底怨煞瞬间萎靡大半。方丈赞你临危不乱，记你一笔守夜功。',
          effects: { contribution: 160, reputation: 20, attrs: { 道心: 2 } },
        },
      },
    ],
  },
  {
    id: 'wsa_ty_03', title: '讲经石机锋', pool: 'sect', tier: 2, weight: 8, minRealm: 1,
    require: 'sect() == "tianyin"',
    text: '秋叶铺满讲经石。戒律堂三位白眉禅师盘坐松下，每逢十五便考校门下弟子禅机。前头三名内门师兄背诵经文滚瓜烂熟，却全被老禅师一竹杖敲了回去。\n\n轮到你上前，居中的枯荣禅师只敲了敲空荡荡的木鱼：「天音寺既不供佛，也不念经求生西天。那老衲问你——钟响时，是谁在听？」',
    choices: [
      {
        label: '不发一言，上前伸手按住仍在微颤的木鱼', hint: '无言破执 · 禅机最高',
        outcome: {
          text: '木鱼声戛然而止。满院落叶无声。枯荣禅师盯着你的手看了许久，忽然哈哈大笑，从袖中取出一串百年檀木念珠递来：「大音希声，你倒比那几个背书的省事。」',
          effects: { expPct: 0.2, lawExp: 28, lawId: 'karma', attrs: { 悟性: 3, 道心: 3 }, demon: -14, contribution: 240 },
        },
      },
      {
        label: '「妖魔听见惧怕，苦人听见安稳，我只听见铜铁相击」', hint: '实相清净 · 道心大进',
        outcome: {
          text: '三位禅师相视颔首。「不着鬼神，不着虚妄，是好根器。」枯荣禅师亲手为你点破一处神识滞涩之穴。',
          effects: { expPct: 0.16, attrs: { 道心: 4, 神识: 2 }, contribution: 200, demon: -10 },
        },
      },
      {
        label: '援引《梵钟镇魂经》典故，条分缕析音律震魂之理', hint: '重术轻禅 · 悟性小进',
        outcome: {
          text: '老禅师听完轻轻摇头：「法理通了，人还站在门外。」倒也没敲你竹杖，只罚你多抄两卷清心咒。',
          effects: { exp: 340, attrs: { 悟性: 2 }, contribution: 110 },
        },
      },
    ],
  },
  {
    id: 'wsa_ty_04', title: '苦行僧因果试', pool: 'sect', tier: 3, weight: 7, minRealm: 1,
    require: 'sect() == "tianyin"',
    text: '云游布道途中，你在破败山神庙避雨，一名满脸刀疤的壮汉跪在门前磕得头破血流——他曾是横行三县的悍匪，半年前金盆洗手救下一村水灾，今夜却被当年仇家之子一路追杀至此。\n\n门外雨幕里，那名提着豁口柴刀的少年双目赤红，浑身发抖地盯着庙门：「和尚！他杀了我爹娘全家！你护着他，天音寺的钟声还管不管冤魂？」',
    choices: [
      {
        label: '不拦少年复仇，也不任壮汉白死，请二人立生死状只决此身因果', hint: '不代天断业 · 因果法则感悟',
        outcome: {
          text: '你收起佛光退至檐下：「前孽是你种，今日是你收；仇恨报于此人，不得再连累他救过的无辜人。」最终悍匪弃刀受死，少年痛哭焚刀离去。你立在雨里，头一次看清因果丝线何其冰冷又公允。',
          effects: { lawExp: 32, lawId: 'karma', attrs: { 道心: 4, 悟性: 2 }, expPct: 0.16, contribution: 180 },
        },
      },
      {
        label: '护住悍匪命其随你回寺削发为奴终生赎罪，再以灵石安抚少年余生', hint: '以慈悲止杀 · 消耗 260 灵石',
        cost: { stones: 260 },
        outcome: {
          text: '少年咬牙恨你多管闲事，却终究接过灵石背着年幼妹妹去了镇上。那悍匪在天音寺挑了三十年水，临终前微笑闭目。可那根因果丝，却系到了你的肩头。',
          effects: { karma: 35, attrs: { 道心: 3 }, demon: -8, contribution: 210 },
        },
      },
      {
        label: '合掌诵一声往生钟咒，劝少年放下屠刀', hint: '魅力与道心检定 · 渡化怨毒',
        roll: {
          p: 0.5, attrs: { 道心: 0.012, 魅力: 0.012 },
          success: {
            text: '沉静钟音涤去少年眉间黑气，他跪在泥水里大哭一场，终究未让仇恨毁掉自己后半生，那悍匪亦自断一臂以谢血债。',
            effects: { karma: 45, demon: -16, lawExp: 28, lawId: 'karma', attrs: { 道心: 4 }, contribution: 240 },
          },
          fail: {
            text: '「未经他人苦，莫劝他人善！」少年嘶声斥你虚伪，转身冲入暴雨。你掌心念珠冰凉，一时无言。',
            effects: { demon: 6, attrs: { 悟性: 2 }, contribution: 80 },
          },
        },
      },
    ],
  },
  {
    id: 'wsa_ty_05', title: '抄经血墨', pool: 'sect', tier: 3, weight: 7, minRealm: 1,
    require: 'sect() == "tianyin"',
    text: '祠庙后殿供着一卷古怪的无字旧经。每逢雨夜，经卷便会渗出微弱哭声——据说是早年一位老庙祝收拢的战乱遗孤执念，唯有以至诚真元研磨朱砂金墨重写经文，方能安抚其灵。\n\n前两位庙祝抄到一半便被经卷里的悲意勾动心魔，呕血退了出来。',
    choices: [
      {
        label: '咬破指尖混入朱砂，以自身精血与定力一笔抄完三千字', hint: '耗气血换大功德 · 因果与神识俱进',
        cost: { hp: 40, month: 1 },
        outcome: {
          text: '笔锋落罢最后一划，旧经金光大盛，殿内呜咽化作清朗童谣随风散去。经卷反哺一缕古老的清净之意，令你神识清明倍增。',
          effects: { expPct: 0.2, karma: 40, demon: -18, lawExp: 28, lawId: 'karma', attrs: { 神识: 3, 道心: 3 }, contribution: 260 },
        },
      },
      {
        label: '取养神玉露静心研墨，分两个月徐徐缮写', hint: '稳扎稳打 · 耗时两月无损圆满',
        cost: { month: 2 },
        outcome: {
          text: '你每日只写百字，不急不躁。两月之后经成卷合，祠老抚卷叹息，赐你一枚清心丹与厚厚一笔贡献。',
          effects: { items: ['qingxin_dan'], contribution: 220, attrs: { 道心: 3 }, demon: -12 },
        },
      },
      {
        label: '以一声断喝直接震散经中执念，快刀斩乱麻', hint: '刚猛破邪 · 略损慈悲得战意',
        outcome: {
          text: '一声断喝如闷雷炸响后殿，哭声立止，旧经却也暗淡了三分。祠老皱眉看你一眼，终究只叹了一声「怒目亦是法」。',
          effects: { expPct: 0.14, attrs: { 根骨: 2 }, karma: -5, contribution: 120 },
        },
      },
    ],
  },
  {
    id: 'wsa_ty_06', title: '狮子吼破妄', pool: 'sect', tier: 3, weight: 7, minRealm: 2,
    require: 'sect() == "tianyin" && char.sectRank >= 1',
    text: '天音寺后山的回音峡终年浓雾不散，峡壁天然回荡百倍声波。罗汉堂弟子欲成《梵钟镇魂经》小成，必入峡中迎着乱石回声练就「金刚狮子吼」。\n\n可近来峡深处潜入了一头擅织幻雾的妖兽，借回音放大迷魂之音，已令两名内门僧人迷失其中。',
    choices: [
      {
        label: '深吸一口真元踏入峡心，以狮吼音浪硬撼妖雾', hint: '战斗 · 裂云雷鹏',
        cost: { month: 1 },
        combat: {
          enemy: 'thunder_roc',
          win: {
            text: '你的梵音狮吼撞上雷鹏长啸，竟借峡壁九重回音将其震得羽翼翻飞、狼狈逃窜！两名昏迷同门安然获救，你亦借此把音律神通推升一境。',
            effects: { expPct: 0.24, contribution: 340, reputation: 40, lawExp: 32, lawId: 'karma', attrs: { 根骨: 2, 神识: 3 } },
          },
          lose: {
            text: '狂风电鸣反震得你气血翻涌，好在强提一口禅音惊醒了两名同门，三人结阵退出了雾峡。',
            effects: { hp: -65, contribution: 180, attrs: { 道心: 2 } },
          },
        },
      },
      {
        label: '闭耳绝听，专凭神识捕捉峡谷气流寻人救出', hint: '神识检定 · 巧避正面恶战',
        cost: { month: 1 },
        roll: {
          p: 0.58, attrs: { 神识: 0.014, 道心: 0.01 },
          success: {
            text: '你封住六识听觉，任凭幻音如潮却毫发无伤，悄无声息将两名同门背出回音峡，罗汉堂首座赞你定力过人。',
            effects: { contribution: 280, karma: 25, attrs: { 神识: 4, 道心: 2 }, items: ['jingang_fu'] },
          },
          fail: {
            text: '雾峡迷路耗去大半灵力，虽终将同门寻回，自己却累得险些虚脱。',
            effects: { mp: -55, contribution: 150, attrs: { 神识: 2 } },
          },
        },
      },
      {
        label: '在峡口立铜钹布聚音小阵，隔空震醒同门', hint: '悟性破局 · 稳健圆满',
        outcome: {
          text: '你借铜钹聚音直入峡腹，清亮禅音如一柄利刃剖开幻雾，两名师兄应声清醒奔出峡口。',
          effects: { contribution: 220, lawExp: 22, lawId: 'karma', attrs: { 悟性: 3 } },
        },
      },
    ],
  },
  {
    id: 'wsa_ty_07', title: '渡化古战场', pool: 'sect', tier: 4, weight: 7, minRealm: 2,
    require: 'sect() == "tianyin" && char.sectRank >= 2',
    text: '中州西陲的「饮马川」曾是千年前正魔决战古战场，入秋后阴气反涌，每到子时便见断戟寒光、阴兵列阵，方圆百里农田尽荒。\n\n天音寺奉九州之请设七日水陆法会超度亡魂，可法会行至第六夜，地底竟钻出一尊披挂残甲的金丹阴煞尸将，执戈直劈法坛！',
    choices: [
      {
        label: '提禅杖步下法坛，以佛门金身正面镇压尸将', hint: '恶战 · 阴煞尸将',
        cost: { month: 1 },
        combat: {
          enemy: 'corpse_general',
          win: {
            text: '金色掌印拍碎玄黑尸甲，尸将眼眶中千年不甘的幽火终于熄灭，缓缓单膝跪地化作一捧黄沙。漫天阴兵齐齐放下断戈，随黎明钟声消散于天际。',
            effects: { expPct: 0.28, karma: 55, contribution: 480, reputation: 65, lawExp: 42, lawId: 'karma', items: ['donghuang_zhong'] },
          },
          lose: {
            text: '尸毒侵蚀护体佛光，你呕血退回法坛，凭全寺众僧合力诵经才勉强将其重新压回地底。',
            effects: { hp: -85, injury: 2, karma: 25, contribution: 240, attrs: { 道心: 3 } },
          },
        },
      },
      {
        label: '端坐法坛纹丝不动，高诵《大日如来印》度化千年战魂', hint: '道心与神识检定 · 无兵刃而伏强煞',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 道心: 0.015, 神识: 0.012 },
          success: {
            text: '尸将重戈悬在你眉心半寸却再也劈不下去——那股磅礴无私的禅意照见它生前也是护土忠魂。一声长叹后，千军化作点点金萤直上九霄！',
            effects: { expPct: 0.26, karma: 70, demon: -25, contribution: 500, reputation: 75, lawExp: 50, lawId: 'karma', attrs: { 道心: 5 } },
          },
          fail: {
            text: '千年戾气实在太重，佛音险些被反冲震裂识海，幸得身边师兄及时敲响引魂磬助你撑过此劫。',
            effects: { hp: -55, mp: -50, karma: 25, contribution: 220 },
          },
        },
      },
      {
        label: '撤回法坛外围改布八卦封魂阵，徐图百年化解', hint: '以阵锁煞 · 稳妥少损',
        outcome: {
          text: '你知强渡恐生大变，果断改度为封。虽未彻底平息饮马川阴气，却保住了百余名随行僧众性命。',
          effects: { contribution: 280, karma: 20, lawExp: 22, lawId: 'array', attrs: { 悟性: 2 } },
        },
      },
    ],
  },
  {
    id: 'wsa_ty_08', title: '戒律堂断业', pool: 'sect', tier: 4, weight: 6, minRealm: 3,
    require: 'sect() == "tianyin" && char.sectRank >= 2',
    text: '戒律堂香烟肃穆。一名年轻武僧玄明跪在青砖上，僧衣血迹斑斑——他在山下目睹三名邪修屠村，因来不及请示寺中，竟动了杀戒将三贼格杀当场，还一怒毁了贼首元神。\n\n依天音寺古戒，蓄意杀生灭魂者须废去半身佛力、逐出山门。戒律首座闭目不语，将判笔递到你手中：「{name}，你如今已是寺中栋梁，这一笔你来落。」',
    choices: [
      {
        label: '「杀贼护民，罪在破戒，功在苍生」——罚面壁三年而不废修为', hint: '明辨本末 · 赢得寺中人心',
        outcome: {
          text: '你落笔如铁，满堂武僧无不松了口气。戒律首座睁眼望你良久，微微颔首：「戒律是护心之栏，不是绑死手脚的绳。你懂得天音寺的钟为何而鸣。」',
          effects: { contribution: 460, reputation: 70, karma: 40, attrs: { 道心: 5, 魅力: 3 }, lawExp: 38, lawId: 'karma' },
        },
      },
      {
        label: '依古戒重责玄明，唯准其带罪下山护佑百村以赎杀业', hint: '法不容情却留生路 · 因果深悟',
        outcome: {
          text: '玄明含泪叩首领命，此后十年孤身走遍北岭斩妖护民，竟修成一尊怒目金刚。戒律堂记你处事公允老辣。',
          effects: { contribution: 420, karma: 35, lawExp: 45, lawId: 'karma', attrs: { 悟性: 3, 道心: 3 }, items: ['yujian_yinguo'] },
        },
      },
      {
        label: '替玄明担下破戒因果，亲往梵钟崖替他枯坐悔过三月', hint: '以身代业 · 心魔尽涤',
        cost: { month: 3 },
        outcome: {
          text: '你在冷风钟声里静坐九十日，将旁人杀业化入自身禅定之中。下崖那日，全寺僧众合掌相迎，你双目澄明如古井无波。',
          effects: { karma: 65, demon: -30, attrs: { 道心: 6 }, expPct: 0.25, contribution: 500, reputation: 80 },
        },
      },
    ],
  },
  {
    id: 'wsa_ty_09', title: '钟声十里 · 佛道除祟', pool: 'world', tier: 2, weight: 7, minRealm: 1,
    text: '夜半落霞驿站鬼哭啾啾，镇上三家客栈接连有行商丢了魂魄。两名赤脚草鞋的天音寺云游僧正托着一只青铜小钟立在街心，每摇一响，满街黑雾便退缩三尺。\n\n可惜小钟裂了一道细缝，压不住屋顶盘踞的阴魂群。年长僧人望向灯下独坐的你，合掌微笑：「施主眉间灵气清亮，可愿借三分真元助贫僧稳住钟声？」',
    choices: [
      {
        label: '渡去三分真元注入铜钟，联手震散满镇祟气', hint: '消耗灵力 · 结佛门善缘',
        cost: { mp: 35 },
        outcome: {
          text: '铜钟嗡然大作，清亮音浪荡出十里，屋顶群祟如雪消融！老僧合掌长揖，赠你一张天音寺亲绘的镇魔破邪符。',
          effects: { karma: 35, reputation: 35, items: ['poxie_fu'], demon: -12, attrs: { 道心: 2 } },
        },
      },
      {
        label: '飞身跃上客栈屋脊，直接斩杀兴风作浪的怨魂主脑', hint: '战斗 · 怨魂',
        combat: {
          enemy: 'ghost',
          win: {
            text: '你凌空一击打散鬼雾，镇上昏睡的行商纷纷苏醒。驿站商贾凑出灵石厚谢，两名僧人亦赞你果决侠义。',
            effects: { expPct: 0.18, stones: 320, karma: 30, reputation: 35 },
          },
          lose: {
            text: '怨魂尖啸震伤你心神，幸得街心铜钟骤响将其逼退，保住了小镇平安。',
            effects: { hp: -40, karma: 15, demon: -5 },
          },
        },
      },
      {
        label: '闭门不出，静听铜钟音律暗中参悟安神诀窍', hint: '清静自修 · 抚平心魔',
        outcome: {
          text: '你在窗内细听那穿透夜雨的禅音，不觉心火尽消，待天明时客栈外已风平浪静。',
          effects: { demon: -10, attrs: { 神识: 2 }, lawExp: 14, lawId: 'karma' },
        },
      },
    ],
  },
  {
    id: 'wsa_ty_10', title: '梵音斗幽冥 · 阴山渡厄', pool: 'world', tier: 4, weight: 6, minRealm: 2,
    text: '阴山乱葬岗上空，金光与鬼火撕裂了夜幕！\n\n天音寺十二罗汉敲响行军梵钟，欲将百年前战死的三千孤魂尽数超度；而幽冥鬼道的黑袍执事却摇动万魂幡，冷笑着要收这批煞魂回黄泉渡祭炼鬼兵。「秃驴多管闲事！」鬼修尖笑，「他们死都不愿散，凭什么由你们剃度？」',
    choices: [
      {
        label: '站在天音寺一边，助梵音击退幽冥鬼修', hint: '战斗 · 幽冥鬼修（金丹战力）',
        combat: {
          enemy: 'corpse_general',
          win: {
            text: '金光破开万魂黑雾，幽冥执事咬牙收幡遁走。三千战魂随梵钟化雨归天，天音寺领队禅师合掌赠你佛门重礼。',
            effects: { expPct: 0.24, karma: 45, reputation: 55, demon: -15, lawExp: 30, lawId: 'karma', items: ['bingxin_dan'] },
          },
          lose: {
            text: '鬼幡煞气汹涌，你负伤退入罗汉阵中，虽未全胜，终究保住了大半孤魂免沦为鬼奴。',
            effects: { hp: -65, karma: 25, reputation: 25 },
          },
        },
      },
      {
        label: '暗助幽冥鬼道稳住阵脚，换取黄泉阴市奇珍', hint: '偏袒鬼道 · 业力下降得冥晶与法宝',
        outcome: {
          text: '你一记冷招打断天音僧众结阵节拍，鬼修趁势卷走大半精魄。临遁前黑袍执事抛来两块九幽冥晶与一袋灵石：「识时务，黄泉渡欠你一份人情。」',
          effects: { karma: -35, demon: 8, stones: 650, items: ['jiuyou_mingjing'], lawExp: 25, lawId: 'space' },
        },
      },
      {
        label: '步入两阵之间，令战魂自选去往轮回还是留世再战', hint: '道心与神识检定 · 超然破局',
        roll: {
          p: 0.54, attrs: { 道心: 0.014, 神识: 0.012 },
          success: {
            text: '你高声一喝，竟然让混乱煞潮安静一瞬！两千倦魂随佛光散去，八百执念未消者自愿随幽冥而去。佛鬼两宗执事惊异于你的气魄，竟同时收手退兵。',
            effects: { expPct: 0.22, lawExp: 40, lawId: 'karma', reputation: 65, attrs: { 道心: 4, 魅力: 3 } },
          },
          fail: {
            text: '战魂早已神智迷失，两宗也不买你的账，险些被余波卷入，只得狼狈抽身。',
            effects: { hp: -40, attrs: { 悟性: 2 } },
          },
        },
      },
    ],
  },
  {
    id: 'wsa_ty_11', title: '借钟镇心魔', pool: 'world', tier: 4, weight: 6, minRealm: 3,
    text: '临近大境突破的修士最惧心魔反噬，于是每逢岁末，天音寺山门外便排起长队——连素来傲气的散修老怪与世家家主都肯放低身段，只求登梵钟崖听老方丈亲手敲响一次古钟。\n\n山门知客僧微笑相迎：「撞钟不收灵石，只问施主肯舍去心里哪一样执念。」',
    choices: [
      {
        label: '合掌闭目，诚心求听一声古钟涤荡积年心魔', hint: '心魔大减 · 突破成算提升',
        cost: { month: 1 },
        outcome: {
          text: '「铛——」浑厚铜音如春雷滚过识海，积郁经年的焦躁、杀意与畏惧被震得片甲不留！下山时你步履轻快，破境瓶颈竟松动了几分。',
          effects: { demon: -35, breakBonus: 12, attrs: { 道心: 4 }, lawExp: 25, lawId: 'karma' },
        },
      },
      {
        label: '向寺中捐献香火灵石，换取在梵钟下独坐三日的资格', hint: '消耗 800 灵石 · 顿悟与神识大涨',
        cost: { stones: 800, month: 1 },
        outcome: {
          text: '知客僧收下灵石转作山下赈灾粮款。你在古钟下枯坐三昼夜，识海宽阔了整整一圈，寿元亦添数载。',
          effects: { expPct: 0.24, attrs: { 神识: 4, 道心: 3 }, lifespan: 15, karma: 30, demon: -20 },
        },
      },
      {
        label: '笑言「我的心魔自己斩，不劳古钟代劳」，与方丈清茶论道', hint: '自信傲骨 · 悟性与声望兼得',
        outcome: {
          text: '老方丈闻言朗声大笑，竟破例邀你入禅房喝了一壶山泉野茶。茶毕你虽未听钟，道心却凭空多了几分定力。',
          effects: { attrs: { 道心: 4, 悟性: 3 }, reputation: 45, expPct: 0.18 },
        },
      },
    ],
  },
  {
    id: 'wsa_ty_c1', title: '大梵古钟 · 无相听音', pool: 'sect', tier: 4, weight: 7, minRealm: 2,
    require: 'sect() == "tianyin"',
    once: true,
    text: '天音寺开山古钟已三十年未曾主动齐鸣，今日黎明却无风自响九声，震落满崖松雪！\n\n方丈合掌步出空殿，神色凝重地望向你：「古钟自择传人。凡敢入钟腹枯坐七日者，若能熬过百相心魔与九重梵音，便可承接寺中镇派密印《大音希声》真谛。{name}，你敢进这口暗钟吗？」',
    choices: [
      {
        label: '卸去一切法宝，赤足步入漆黑钟腹盘膝合掌', hint: '道心检定 · 净身入钟启三关',
        cost: { month: 1 },
        roll: {
          p: 0.6, attrs: { 道心: 0.014, 神识: 0.01 },
          success: {
            text: '厚重钟壁落下，外界天光瞬间隔绝。一片绝对沉寂之中，你的心跳声竟如惊雷炸响，随即与古钟铭文产生奇妙共振。',
            effects: { expPct: 0.2, demon: -15, lawExp: 26, lawId: 'karma', attrs: { 道心: 3 }, flag: { 钟腹澄明: true } },
            goto: 'wsa_ty_c2',
          },
          fail: {
            text: '漆黑与死寂如潮水压迫神魂，你喘息渐重，险些按捺不住推壁而出，好在默诵清心咒撑过了头三日。',
            effects: { hp: -40, demon: 5, attrs: { 道心: 2 } },
            goto: 'wsa_ty_c2',
          },
        },
      },
      {
        label: '先服一枚冰心雪莲丹护住神府，再步入钟腹', hint: '消耗冰心雪莲丹 · 稳入二关',
        cost: { item: 'bingxin_dan', month: 1 },
        outcome: {
          text: '冰凉药意如明月悬照识海，钟腹内的压抑瞬间化作清凉禅境。古钟内壁万千古梵文齐齐绽出淡金微光！',
          effects: { expPct: 0.2, demon: -25, lawExp: 32, lawId: 'karma', attrs: { 道心: 3, 神识: 2 }, flag: { 钟腹澄明: true } },
          goto: 'wsa_ty_c2',
        },
      },
      {
        label: '自省禅定未足，向方丈请辞再修十年', hint: '守拙退步 · 止步此次传承',
        outcome: {
          text: '方丈微笑合掌：「不贪禅机，亦是禅机。」古钟缓缓归寂。',
          effects: { attrs: { 道心: 2 }, demon: -8, contribution: 120 },
        },
      },
    ],
  },
  {
    id: 'wsa_ty_c2', title: '大梵古钟 · 心魔百相', pool: 'branch', tier: 5, weight: 0,
    text: (s) => `钟腹第五日，外头方丈轻轻撞下第一记钟槌！\n\n轰然巨响在狭小钟腔里翻卷百倍，漆黑虚空竟映出你此生最畏惧的百般幻相——寿尽枯骨、挚友背叛、道基尽毁、沦为魔奴。${s.flags['钟腹澄明'] ? '你神府澄澈，看得出幻相边缘隐约的铜绿纹路。' : '钟音如重锤直砸眉心，百相心魔已化作实质扑面而来！'}`,
    choices: [
      {
        label: '以金刚法相迎战钟内魔影，一念镇百魔', hint: '死战 · 心魔',
        cost: { month: 1 },
        combat: {
          enemy: 'heart_demon',
          win: {
            text: '一记大日如来印拍碎虚妄，百相心魔齐齐化作金烟消散！古钟发出清越悠长的龙吟，内壁现出创寺古佛留下的最后一卷音纹。',
            effects: { expPct: 0.28, demon: -25, lawExp: 45, lawId: 'karma', attrs: { 道心: 4, 神识: 3 }, flag: { 钟内破魔: true } },
            goto: 'wsa_ty_c3',
          },
          lose: {
            text: '心魔利爪撕裂你的禅意，你呕出一口心头淤血，却死死没有挪动半步蒲团。幻相终在黎明前不甘散去。',
            effects: { hp: -65, demon: -5, lawExp: 20, lawId: 'karma', attrs: { 道心: 3 } },
            goto: 'wsa_ty_c3',
          },
        },
      },
      {
        label: '不抗不逃，任百相幻灭于眼前，唯守一念无我', hint: '道心与悟性检定 · 慈悲化魔',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 道心: 0.015, 悟性: 0.012 },
          success: {
            text: '你向心魔合掌微笑：「你也是我，坐下听钟吧。」话音未落，狰狞魔影顿失凭依，化作漫天金莲反哺你的神魂！',
            effects: { expPct: 0.26, demon: -30, lawExp: 50, lawId: 'karma', attrs: { 道心: 5, 悟性: 3 }, flag: { 钟内破魔: true } },
            goto: 'wsa_ty_c3',
          },
          fail: {
            text: '一念动摇，幻相险些夺舍神台，危急时刻外头方丈连撞三钟将你震醒。虽险些失守，总算熬到了第七日。',
            effects: { hp: -50, demon: 5, lawExp: 22, lawId: 'karma' },
            goto: 'wsa_ty_c3',
          },
        },
      },
    ],
  },
  {
    id: 'wsa_ty_c3', title: '大梵古钟 · 大音希声', pool: 'branch', tier: 5, weight: 0,
    text: (s) => `第七日破晓，古钟缓缓升起三尺，万丈晨光倾泻而入。你盘坐青石之上，周身尘埃不染。\n\n${s.flags['钟内破魔'] ? '你眉心隐现一枚淡金色古钟印记，方圆百里妖魔齐齐感到一阵源自灵魂深处的战栗。' : '你衣袍微破，双目却澄澈得能照见人心底细。'}\n\n方丈率全寺三百僧众于崖畔合掌相迎：「七日已满，{name}，你从钟里听到了什么？」`,
    choices: [
      {
        label: '「无声处听惊雷，愿以禅音渡尽天下苦厄」', hint: '大慈大悲 · 因果法则、寿元与称号',
        cost: { month: 1 },
        outcome: {
          text: '话音落地，天音古钟不敲自鸣，清音传出百里，山谷百花逆季绽放。方丈赐你镇狱古钟法宝，全寺尊你为「听钟证寂」传灯尊者。',
          effects: { expPct: 0.35, lawExp: 85, lawId: 'karma', karma: 60, demon: -35, lifespan: 50, attrs: { 道心: 6, 神识: 4 }, contribution: 650, reputation: 95, items: ['donghuang_zhong'], title: '听钟证寂', flag: { 天音传灯: true } },
        },
      },
      {
        label: '「钟响止魔，钟寂明心，吾道只在当下这一息」', hint: '枯禅明心 · 极致悟性与道心',
        cost: { month: 1 },
        outcome: {
          text: '满崖寂然无声，唯有松风过耳。你一念通透因果轮回之理，突破瓶颈再无心魔之忧。',
          effects: { expPct: 0.34, lawExp: 90, lawId: 'karma', demon: -40, breakBonus: 18, attrs: { 道心: 6, 悟性: 5 }, contribution: 600, reputation: 90, items: ['yujian_yinguo', 'tiandao_lotus'], title: '听钟证寂', flag: { 天音传灯: true } },
        },
      },
    ],
  },

  /* ========================================================================
   * 五、万象书院（wanxiang · 14 节点）
   * 风味：不练剑练字，字成阵阵杀人、观星台、禁书楼、儒将外交、观星大阵三段链
   * ======================================================================== */
  {
    id: 'wsa_wx_01', title: '墨阵大考', pool: 'sect', tier: 2, weight: 8, minRealm: 0,
    require: 'sect() == "wanxiang"',
    text: '清明小雨落进墨池院，书院一年一度的「一字定阵」考校在青石长廊摆开。考官先生袖手立于廊端，将三十六张白宣铺在风口，身后则是六尊蓄势待发的机关弩傀。\n\n「万象弟子不练铁剑，练笔锋。」先生淡声道，「半炷香内，各写一字成阵。能挡住三轮灵箭不破宣纸者，入内院。」',
    choices: [
      {
        label: '饱蘸灵墨挥毫写就一个「镇」字，引地脉之气化作墨墙', hint: '悟性与神识检定 · 以稳破锐',
        cost: { month: 1 },
        roll: {
          p: 0.58, attrs: { 悟性: 0.014, 神识: 0.01 },
          success: {
            text: '黑墨离纸三寸凝成铁画银钩，三轮灵箭撞上墨墙纷纷折断坠地！考官先生抚须赞道：「笔沉气厚，已有大家气象。」',
            effects: { expPct: 0.16, lawExp: 20, lawId: 'array', attrs: { 悟性: 2, 神识: 2 }, contribution: 180 },
          },
          fail: {
            text: '第三轮灵箭穿透了右下角墨纹，宣纸撕裂半寸。先生摇头批了个「中下」，指点你运笔收尾太急。',
            effects: { attrs: { 悟性: 2 }, contribution: 85, exp: 260 },
          },
        },
      },
      {
        label: '反其道而行，一笔疾书「移」字，将飞箭尽数挪转射回靶心', hint: '悟性极高者可惊艳全场 · 阵道与空间兼悟',
        cost: { month: 1 },
        roll: {
          p: 0.48, attrs: { 悟性: 0.016, 气运: 0.01 },
          success: {
            text: '宣纸轻颤，十八支灵箭竟在墨光中凭空折返，精准钉碎了机关弩臂！三位主考先生齐齐起身拍案：「字成杀阵，奇才！」',
            effects: { expPct: 0.2, lawExp: 28, lawId: 'array', reputation: 35, contribution: 260, attrs: { 悟性: 3, 神识: 2 } },
          },
          fail: {
            text: '阵纹过于繁复，灵力衔接慢了半拍，反震得你虎口发麻、墨汁溅了一脸。',
            effects: { hp: -25, attrs: { 悟性: 2 }, contribution: 70 },
          },
        },
      },
      {
        label: '规规矩矩画下《万象阵图》标准八卦守纹，求稳过关', hint: '稳妥稳进 · 必得贡献与修为',
        cost: { month: 1 },
        outcome: {
          text: '八卦墨纹中规中矩撑过三轮箭雨。考官点点头：「虽无新意，根基扎实。」给你记了内院考评优等。',
          effects: { exp: 340, lawExp: 14, lawId: 'array', contribution: 140, attrs: { 道心: 1 } },
        },
      },
    ],
  },
  {
    id: 'wsa_wx_02', title: '禁书楼残简', pool: 'sect', tier: 3, weight: 8, minRealm: 1,
    require: 'sect() == "wanxiang"',
    text: '深秋校勘古籍时，你在万象禁书楼三层角落发现一卷用红绳死死缠绕的漆黑竹简。绳结早已脆化，竹简竟自行翻开一页，墨字如游蛇般爬动，直往你眼底钻。\n\n那上面记载的竟是百年前被书院列为禁术的「逆阵噬灵篇」——不借天地灵气，而是强行抽取阵中活人精元催动大阵！',
    choices: [
      {
        label: '借其逆向阵理反推护阵破绽，却绝不习练噬灵邪法', hint: '悟性与道心检定 · 化邪为正',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 悟性: 0.014, 道心: 0.012 },
          success: {
            text: '你看破邪阵七处反噬死穴，提笔在空白竹简写下克制之法，呈给山长后获大赏，阵道造诣骤增一截！',
            effects: { expPct: 0.2, lawExp: 32, lawId: 'array', contribution: 300, karma: 20, attrs: { 悟性: 3, 道心: 2 } },
          },
          fail: {
            text: '黑字里残留的怨念险些扰乱你的神识，你连忙合卷退开，额头已被冷汗浸透。',
            effects: { demon: 8, attrs: { 神识: 2 }, contribution: 90 },
          },
        },
      },
      {
        label: '暗自记下几式噬灵奇阵，留作绝境保命底牌', hint: '魔阵诱惑 · 修为暴涨而染心魔',
        outcome: {
          text: '你合上竹简时，指尖残留着一丝冰凉黑墨。虽损了几分儒门正气，可那几招险恶杀阵确实令你实力大增。',
          effects: { expPct: 0.26, lawExp: 30, lawId: 'array', demon: 12, karma: -20, attrs: { 悟性: 2 } },
        },
      },
      {
        label: '不看第二眼，立刻取新朱砂封条重新封印呈报守楼先生', hint: '守礼明慎 · 得赠古阵玉简',
        outcome: {
          text: '守楼老先生接过竹简长舒一口气：「前任整理书库的弟子就是多看了一页，疯了十年。你守得住好奇心，难得。」顺手赐你一卷正统养神丹。',
          effects: { contribution: 200, demon: -10, attrs: { 道心: 3 }, items: ['yangshen_dan'] },
        },
      },
    ],
  },
  {
    id: 'wsa_wx_03', title: '星图失窃案', pool: 'sect', tier: 3, weight: 7, minRealm: 1,
    require: 'sect() == "wanxiang"',
    text: '观星台西偏殿警铃大作！书院珍藏的《周天星斗残图》竟在雨夜不翼而飞，守殿阵法完好无损，唯有窗棂上留着半个泛着银光的虚空脚印。\n\n大先生面色沉凝：「能不触动八卦锁灵阵便进出西殿，贼人必通空间遁法，多半尚未逃出书院三十里山界！{name}，你速带罗盘截人！」',
    choices: [
      {
        label: '以神识锁定窗棂残余星辉，提笔封空截杀盗图贼', hint: '战斗 · 裂界暗影（外围斥候：断魂刀客）',
        cost: { month: 1 },
        combat: {
          enemy: 'blade_rogue',
          win: {
            text: '你在十里竹林一笔「锁」字截断对方遁光！一场恶斗后夺回《周天星斗残图》，贼人咬碎毒囊前供出背后竟有域外暗影插手。',
            effects: { expPct: 0.22, contribution: 340, reputation: 45, lawExp: 26, lawId: 'star', items: ['xingchen_sha'] },
          },
          lose: {
            text: '贼人借空间符纸逃脱，你挨了一记暗刀，好在扯下了半片沾着星辉的地图边角。',
            effects: { hp: -55, contribution: 140, lawExp: 14, lawId: 'star' },
          },
        },
      },
      {
        label: '不去硬追，直接登上观星台逆推星轨锁死三十里护山大阵', hint: '悟性与神识检定 · 瓮中捉鳖',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 悟性: 0.014, 神识: 0.012 },
          success: {
            text: '三十六根观星石柱齐放银芒，山界虚空顿时凝如铁板！盗贼一头撞在无形阵壁上被生擒活捉，大先生大喜过望，赏你观星秘录。',
            effects: { contribution: 360, reputation: 50, lawExp: 32, lawId: 'star', attrs: { 悟性: 3, 神识: 2 }, items: ['yujian_xingchen'] },
          },
          fail: {
            text: '锁阵慢了三息，盗贼终究撕裂界缝逃出山界。你虽未能截住贼人，反倒借这次推演摸清了不少阵眼枢纽。',
            effects: { contribution: 110, lawExp: 18, lawId: 'array', attrs: { 悟性: 2 } },
          },
        },
      },
      {
        label: '查验西偏殿守卫值班册，揪出暗中关掉一息警阵的内应', hint: '冷静破案 · 除内患获重赏',
        outcome: {
          text: '你一眼看出外盗必有内应，连夜查出一名被万宝阁重金收买的杂役学子，顺藤摸瓜在渡口截回了原图。',
          effects: { contribution: 300, stones: 450, reputation: 35, attrs: { 神识: 3 } },
        },
      },
    ],
  },
  {
    id: 'wsa_wx_04', title: '儒将出使', pool: 'sect', tier: 3, weight: 7, minRealm: 2,
    require: 'sect() == "wanxiang"',
    text: '中州边境两座凡人诸侯国因争夺一条灵矿河谷连年征战，背后竟各有一批散修与小宗门暗中推波助澜。战火一起，流民十万，连书院在山脚设的蒙学堂都被烧了三座。\n\n山长亲手为你换上一袭青衿儒袍、递来书院铁令：「以力压人易，以理定局难。此去两军阵前，把这场仗给我停下来。」',
    choices: [
      {
        label: '单人独骑入两军中军大帐，以利害大势迫双方签下停战河约', hint: '魅力与悟性检定 · 不战屈人之兵',
        cost: { month: 1 },
        roll: {
          p: 0.58, attrs: { 魅力: 0.015, 悟性: 0.012 },
          success: {
            text: '你摊开中州水文灵脉图，当众算清再战三月两军必遭北荒魔修渔翁得利。两位主帅冷汗涔涔，当夜撤兵三百里！十万凡人免遭涂炭。',
            effects: { karma: 55, reputation: 70, contribution: 420, attrs: { 魅力: 4, 道心: 3 }, stones: 600 },
          },
          fail: {
            text: '其中一方的散修客卿恼羞成怒掀翻帅案，险些动武。你只得亮出书院杀阵玉符强压局面，勉强换来半年休战。',
            effects: { karma: 25, reputation: 30, contribution: 220, attrs: { 道心: 2 } },
          },
        },
      },
      {
        label: '夜袭背后煽风点火的散修客卿营帐，斩首示警再议和', hint: '战斗 · 孤鸿剑修',
        cost: { month: 1 },
        combat: {
          enemy: 'sword_rogue',
          win: {
            text: '一笔「惊雷」墨阵破开营帐，你三招制服唯恐天下不乱的幕后客卿。次日两军见靠山倒台，乖乖在河畔签下休战盟书。',
            effects: { expPct: 0.24, karma: 35, reputation: 60, contribution: 400, stones: 500 },
          },
          lose: {
            text: '对方早有防备，你负伤撤回驿馆，虽未一举建功，也吓得两军收敛了攻势。',
            effects: { hp: -65, contribution: 180, attrs: { 悟性: 2 } },
          },
        },
      },
      {
        label: '在两军之间的灵矿河谷布下百里迷雾隔绝大阵，令战火无路可通', hint: '以阵止战 · 阵道大进',
        cost: { month: 2, stones: 350 },
        outcome: {
          text: '你沿河立起七十二根青玉阵桩，一夜之间白雾锁谷，兵马入内便原地打转。两军无奈罢兵，书院将你的「隔尘阵」收录阵典。',
          effects: { lawExp: 40, lawId: 'array', karma: 40, contribution: 380, reputation: 50, attrs: { 悟性: 3 } },
        },
      },
    ],
  },
  {
    id: 'wsa_wx_05', title: '凡城开蒙', pool: 'sect', tier: 2, weight: 8, minRealm: 1,
    require: 'sect() == "wanxiang"',
    text: '万象书院有个古老规矩：凡内院弟子，皆须去凡人边城做一季蒙学先生。你在白河镇破庙教三十个泥腿孩童识字，却在某晚夜读时察觉镇底地气隐隐发颤。\n\n原来白河镇下压着一条濒临枯竭的古龙支脉，一旦崩塌，全镇三千凡人将被阴寒地裂吞没。',
    choices: [
      {
        label: '白日照常教孩童朗读诗书，入夜独步全镇以墨阵补全地脉', hint: '耗时两月 · 浩然功德与阵道双收',
        cost: { month: 2 },
        outcome: {
          text: '你把阵纹藏在镇口石碑、学堂门联与井台青砖之中。两个月后孩童琅琅书声响起，竟隐隐与地底龙脉共鸣，危局消弭于无形。',
          effects: { karma: 45, demon: -16, lawExp: 30, lawId: 'array', contribution: 280, attrs: { 道心: 3, 悟性: 3 } },
        },
      },
      {
        label: '挑选两名具微薄灵根的孩童亲授吐纳，助镇子立下护脉世家', hint: '传道授业 · 因果结缘',
        cost: { month: 1 },
        outcome: {
          text: '那两个手沾泥巴的孩子竟极有韧性。数十年后白河镇出了一对护乡修士，常在书院门前供奉你的长生牌位。',
          effects: { karma: 40, reputation: 35, contribution: 220, attrs: { 魅力: 3, 道心: 2 }, lifespan: 10 },
        },
      },
      {
        label: '直接以灵石买通附近驿站迁走镇民，省去修阵之劳', hint: '耗资 320 灵石 · 务实救急',
        cost: { stones: 320 },
        outcome: {
          text: '三千百姓虽舍不得故土，终究保住了性命。次月地裂发生，空无一人的老镇陷落三尺，镇民纷纷向你磕头谢恩。',
          effects: { karma: 35, reputation: 30, contribution: 180 },
        },
      },
    ],
  },
  {
    id: 'wsa_wx_06', title: '校勘天机残碑', pool: 'sect', tier: 3, weight: 7, minRealm: 2,
    require: 'sect() == "wanxiang" && char.sectRank >= 1',
    text: '书院从昆仑外围运回七块裂纹密布的太古星阵碑。七块石碑年代各异、字迹互有矛盾，三名宿老校勘半年仍理不出头绪。\n\n你提灯走过石碑，忽觉碑文排列并非寻常文字，倒像是从高空俯瞰星海的阵眼投影——若按凡人习惯从右往左读，自然句句不通。',
    choices: [
      {
        label: '悬身半空俯瞰七碑，以星辰方位重排残文', hint: '悟性与神识检定 · 破译太古星阵',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 悟性: 0.015, 神识: 0.012 },
          success: {
            text: '当你凌空三丈垂目望去，七块残碑上的笔锋竟瞬间连成一幅璀璨北斗杀阵！宿老们惊叹不已，书院赐你《伏羲八卦阵简》以嘉殊功。',
            effects: { expPct: 0.22, lawExp: 38, lawId: 'star', contribution: 380, reputation: 50, items: ['yujian_bagua'], attrs: { 悟性: 4 } },
          },
          fail: {
            text: '星光在识海里搅成一团乱麻，你头晕目眩落回青砖，虽只解出三成碑文，仍令宿老们眼前一亮。',
            effects: { mp: -45, lawExp: 20, lawId: 'star', contribution: 180, attrs: { 悟性: 2 } },
          },
        },
      },
      {
        label: '携碑文拓片请教天机阁执笔顾青衣，交换推演心得', hint: '结缘顾青衣 · 星阵与因果同进',
        cost: { month: 1 },
        outcome: {
          text: '顾青衣朱笔轻点，三言两语便点破了其中两处古星历差。她笑言万象书院总算出了个不死读书的聪明人。',
          effects: { relation: { 顾青衣: 25 }, lawExp: 32, lawId: 'star', contribution: 320, attrs: { 神识: 3, 悟性: 2 } },
        },
      },
      {
        label: '逐字抄录拓本留存档案，不妄加臆断古人之意', hint: '严谨治学 · 稳赚修为与贡献',
        cost: { month: 1 },
        outcome: {
          text: '你老老实实做完七碑注疏，虽未破译全阵，却也在一笔一画里打磨出一手极稳的神识控墨之功。',
          effects: { expPct: 0.16, contribution: 210, attrs: { 神识: 3 } },
        },
      },
    ],
  },
  {
    id: 'wsa_wx_07', title: '护山墨阵大修', pool: 'sect', tier: 4, weight: 7, minRealm: 2,
    require: 'sect() == "wanxiang" && char.sectRank >= 2',
    text: '百年一遇的月蚀将至，万象书院方圆三十六里的护山墨阵正迎来灵气潮汐低谷。一旦月蚀之时大阵出现缺口，潜伏中州多年的域外暗影与魔宗探子必会趁虚而入。\n\n阵堂将最险峻的「天枢崖」阵眼交由你主持重绘——此地罡风如刀，寻常笔墨一落纸便会吹散。',
    choices: [
      {
        label: '以星辰砂调和灵墨，迎着罡风在百丈绝壁重绘天枢阵眼', hint: '消耗星辰砂 · 大阵焕新获重赏',
        cost: { item: 'xingchen_sha', month: 1 },
        outcome: {
          text: '银辉混墨入石三分，狂风竟被笔势生生锁住！月蚀降临时，三十六里书院文光冲霄，令暗处窥伺的魔修望风而逃。',
          effects: { contribution: 520, reputation: 70, lawExp: 48, lawId: 'array', attrs: { 悟性: 4, 神识: 3 }, items: ['bagua_xuanjia'] },
        },
      },
      {
        label: '凝神以自身剑指虚空代笔，强行压住天枢罡风续阵', hint: '悟性与根骨检定 · 苦修成大阵',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 悟性: 0.014, 根骨: 0.01 },
          success: {
            text: '罡风割破你的袖袍，却割不断你凝于指尖的浩然阵纹！三日三夜之后，天枢阵眼大亮，满院学子齐声诵经致敬。',
            effects: { expPct: 0.25, contribution: 460, reputation: 60, lawExp: 42, lawId: 'array', attrs: { 悟性: 3, 根骨: 2 } },
          },
          fail: {
            text: '一阵横风吹歪了收尾一笔，阵眼灵力倒灌震伤你的肺腑，好在副手及时补全，未误月蚀吉时。',
            effects: { hp: -70, contribution: 240, lawExp: 20, lawId: 'array' },
          },
        },
      },
      {
        label: '率三十名外院学子结文阵共绘，以众志分担罡风', hint: '聚众成阵 · 稳妥且得人心',
        cost: { month: 1 },
        outcome: {
          text: '三十支狼毫同时落壁，虽不如独笔惊艳，却浑厚稳固如山岳。大修圆满落成，外院学子从此对你唯命是从。',
          effects: { contribution: 380, reputation: 50, attrs: { 魅力: 3, 悟性: 2 }, lawExp: 28, lawId: 'array' },
        },
      },
    ],
  },
  {
    id: 'wsa_wx_08', title: '书院策论 · 仙凡之辩', pool: 'sect', tier: 4, weight: 6, minRealm: 3,
    require: 'sect() == "wanxiang" && char.sectRank >= 2',
    text: '万象书院明伦堂座无虚席，三位百年不曾开口的大先生并排端坐屏风之前。今年大策之题只有八个字——「仙凡殊途，何以为护？」\n\n前排几名高阶真传皆引经据典，大谈修士超然物外、不应沾染凡尘因果，听得堂外几名出身寒微的外院学子默默攥紧了拳头。轮到你登堂作答，三双古井般的眼睛齐齐落在你身上。',
    choices: [
      {
        label: '「若无凡尘万家灯火，修成真仙也不过孤魂野鬼」', hint: '浩然正气 · 三位先生起立相揖',
        cost: { month: 1 },
        outcome: {
          text: '话音震动梁尘，三位先生沉默良久，竟齐齐离座向你长揖一礼！「入我万象门，本就不是为了忘却人间。」明伦堂为你悬笔刻碑，道心与法则齐飞！',
          effects: { expPct: 0.28, karma: 55, demon: -20, reputation: 85, contribution: 540, lawExp: 48, lawId: 'karma', attrs: { 道心: 5, 魅力: 4 } },
        },
      },
      {
        label: '「仙护凡以安世，凡供仙以薪火，本是大道共生之阵」', hint: '以阵解世 · 悟性与阵道大进',
        cost: { month: 1 },
        outcome: {
          text: '你将整个九州看作一座阴阳相济的宏大阵局，仙为阵眼、凡为地基，无基则眼崩。大先生抚掌赞绝，赐你《星河羽扇》以为信物。',
          effects: { expPct: 0.26, lawExp: 55, lawId: 'array', reputation: 75, contribution: 520, items: ['xinghe_shan'], attrs: { 悟性: 5 } },
        },
      },
      {
        label: '「仙凡皆苦，唯破界飞升方能改写天律」', hint: '孤傲问道 · 剑走偏锋却振聋发聩',
        cost: { month: 1 },
        outcome: {
          text: '满堂哗然，三位先生却并未斥你狂妄，只幽幽叹道：「好一个改写天律……只是这条路，尸骨累累。」你走出明伦堂，破境之心愈发炽烈。',
          effects: { expPct: 0.3, breakBonus: 14, lawExp: 45, lawId: 'star', attrs: { 悟性: 4, 道心: 3 }, contribution: 440 },
        },
      },
    ],
  },
  {
    id: 'wsa_wx_09', title: '墨阵封妖 · 书生拦路', pool: 'world', tier: 2, weight: 7, minRealm: 1,
    text: '官道竹桥前，一名手持折扇、衣摆沾泥的万象书院年轻书生正狼狈地往后倒退，手中狼毫在青石板上飞快画着墨线，勉强困住一头红眼狂暴的铁甲妖猪。\n\n墨线已开始崩裂，书生苦笑着朝你高喊：「这位兄台！小生墨汁快干了，烦请帮忙补一刀或者借半瓶灵墨，事后必以阵符相报！」',
    choices: [
      {
        label: '提兵入阵，趁妖猪被墨线束缚一举将其格杀', hint: '战斗 · 铁甲妖猪',
        combat: {
          enemy: 'beast',
          win: {
            text: '妖猪轰然倒地，书生擦去额汗连声道谢，从书箱里摸出一张珍藏的聚灵阵符塞进你手里。',
            effects: { expPct: 0.18, karma: 20, items: ['juling_zhenfu'], reputation: 25, stones: 180 },
          },
          lose: {
            text: '妖猪撞断墨线把你顶飞三丈，好在书生拼尽灵力补画「困」字将其逼入山林。',
            effects: { hp: -45, karma: 15, items: ['huiling_dan'] },
          },
        },
      },
      {
        label: '凌空指点他阵纹东南角一处死结，助其以墨反杀', hint: '悟性检定 · 阵道交流',
        roll: {
          p: 0.56, attrs: { 悟性: 0.015, 神识: 0.01 },
          success: {
            text: '书生依言补上一捺，八卦墨线骤然收紧，竟硬生生将妖猪压晕在地！他拱手敬你如师，奉上灵石与手抄阵诀。',
            effects: { lawExp: 24, lawId: 'array', stones: 320, attrs: { 悟性: 2 }, reputation: 30 },
          },
          fail: {
            text: '你喊错了一处方位，反令墨阵提前崩散，两人只好抱头鼠窜爬上古松避难。',
            effects: { hp: -20, attrs: { 气运: 1 } },
          },
        },
      },
      {
        label: '扔出一张神行符助书生脱身，自己也不与蛮兽缠斗', hint: '消耗神行符 · 洒脱结缘',
        cost: { item: 'shenxing_fu' },
        outcome: {
          text: '书生贴符化风而去，临走不忘反手抛来一枚碧玉阵戒：「青山不改，中州见！」',
          effects: { items: ['biling_jie'], karma: 20, reputation: 20 },
        },
      },
    ],
  },
  {
    id: 'wsa_wx_10', title: '阵道与机关 · 双城论巧', pool: 'world', tier: 4, weight: 6, minRealm: 2,
    text: '中州洛水之滨，万象书院的青衫大儒竟与机关城的铜甲墨师摆开擂台「论巧」——一边挥毫以墨阵御天地灵气，一边齿轮轰鸣令十丈巨傀破阵强拆！\n\n围观的九州散修挤满河岸，谁都知道这是两大智道巨擘在争夺下一代大型传送阵的主导权。',
    choices: [
      {
        label: '细观墨阵与铜傀交锋，悟出阵纹与机括互补之法', hint: '耗时一月 · 悟性与阵道双升',
        cost: { month: 1 },
        outcome: {
          text: '「阵以虚引气，器以实承压。」你在河畔石墩上看足三日，竟隐隐悟出以器载阵的奇思，修为与法则同步精进。',
          effects: { expPct: 0.2, lawExp: 35, lawId: 'array', attrs: { 悟性: 4, 神识: 2 } },
        },
      },
      {
        label: '献上一计融合墨阵灵枢与机关核心，赢得两宗同敬', hint: '悟性与魅力检定 · 双宗重赏',
        roll: {
          p: 0.52, attrs: { 悟性: 0.015, 魅力: 0.01 },
          success: {
            text: '大儒与墨师听完你的构想同时沉默半晌，随即齐声叫绝！两方各赠玄铁与阵典，邀你做双城客卿。',
            effects: { stones: 800, reputation: 65, items: ['xuantie', 'juling_zhenfu'], lawExp: 32, lawId: 'array', attrs: { 悟性: 3 } },
          },
          fail: {
            text: '两方文人相轻、匠师傲骨，反而异口同声嫌你的构想「不伦不类」，你只得摸着鼻子下台。',
            effects: { attrs: { 悟性: 2 } },
          },
        },
      },
      {
        label: '借比试落幕收购两宗淘汰下来的残破阵盘与机关零件', hint: '耗灵石 350 · 捡漏奇材',
        cost: { stones: 350 },
        outcome: {
          text: '你在一堆废铁废纸里翻出一块星辰砂碎片与半张完整的八卦符纸，转手便值回三倍本钱。',
          effects: { items: ['xingchen_sha', 'huxin_fu'], attrs: { 气运: 2 } },
        },
      },
    ],
  },
  {
    id: 'wsa_wx_11', title: '潜龙榜评 · 书院执笔', pool: 'world', tier: 4, weight: 6, minRealm: 3,
    text: '中州听雨楼，万象书院的史官与天机阁执笔顾青衣正围炉重修《九州潜龙榜》。案上堆满十三宗门天骄战报，连北荒魔修与东海散修的隐秘战绩都在其列。\n\n见你推门入楼，一名万象史官搁下朱笔笑道：「正议到阁下名次呢。阁下是想名列前茅扬威九州，还是愿隐去锋芒省却麻烦？」',
    choices: [
      {
        label: '朗声报出此生战绩，堂堂正正争一个九州前列席位', hint: '声望大涨 · 得天机重礼',
        outcome: {
          text: '朱笔落纸生辉，你的名号次日便随飞鸽传遍八大灵域！虽少不了暗中忌惮的目光，九州同道对你的敬重亦水涨船高。',
          effects: { reputation: 90, attrs: { 魅力: 3, 道心: 2 }, stones: 600, relation: { 顾青衣: 15 } },
        },
      },
      {
        label: '自谦浅薄，请史官将自己名次压低十位以藏锋养晦', hint: '韬光养晦 · 气运与悟性提升',
        outcome: {
          text: '顾青衣抬眼笑了笑：「木秀于林，风必摧之。懂得收锋的人，往往活得最久。」她暗中赠你一缕星辰推演心得。',
          effects: { attrs: { 气运: 4, 悟性: 3 }, demon: -10, lawExp: 32, lawId: 'star', relation: { 顾青衣: 20 } },
        },
      },
      {
        label: '借阅案上十三宗门隐秘卷宗，摸清未来九州劫数走向', hint: '消耗 600 灵石润笔费 · 窥探天机',
        cost: { stones: 600 },
        outcome: {
          text: '你通宵翻阅了三大箱九州密报，对上界巡查使与北荒魔渊的暗流了如指掌，识海豁然开朗。',
          effects: { expPct: 0.22, lawExp: 40, lawId: 'karma', attrs: { 神识: 4, 悟性: 3 } },
        },
      },
    ],
  },
  {
    id: 'wsa_wx_c1', title: '观星大阵 · 落墨定枢', pool: 'sect', tier: 4, weight: 7, minRealm: 2,
    require: 'sect() == "wanxiang"',
    once: true,
    text: '岁星凌空之夜，万象书院最高处的观星台九层灯火尽熄，唯余满天星斗倒映在百丈黑玉水镜之中。\n\n山长亲手捧来一支万年紫毫古笔：「每逢甲子岁星归位，书院便择一弟子执笔重演《周天星河阵》。画得成，可借星海窥破大道玄机；画不成，笔锋反噬将折损十年神识。」',
    choices: [
      {
        label: '接过万年紫毫，引北斗七星之辉落墨水镜定阵枢', hint: '悟性与神识检定 · 启观星三关',
        cost: { month: 1 },
        roll: {
          p: 0.58, attrs: { 悟性: 0.015, 神识: 0.012 },
          success: {
            text: '七笔落下，黑玉水镜骤然化作浩瀚星穹！漫天星光顺着笔杆奔涌入你识海，一座太古星河棋局在虚空徐徐展开。',
            effects: { expPct: 0.2, lawExp: 30, lawId: 'star', attrs: { 悟性: 3, 神识: 3 }, flag: { 观星定枢: true } },
            goto: 'wsa_wx_c2',
          },
          fail: {
            text: '星力重若山岳，险些震断你腕骨，虽歪斜了两笔，水镜依然被强行撕开了一道通往星河棋局的门户。',
            effects: { hp: -45, mp: -45, lawExp: 16, lawId: 'star', attrs: { 神识: 2 } },
            goto: 'wsa_wx_c2',
          },
        },
      },
      {
        label: '以星辰砂铺洒水镜定住星位，再从容落笔', hint: '消耗星辰砂 · 稳步入星局',
        cost: { item: 'xingchen_sha', month: 1 },
        outcome: {
          text: '银砂落水化作三百六十五枚微缩星子，笔锋所过如鱼得水。山长击节赞叹：「善借外物而不为外物所役！」',
          effects: { expPct: 0.22, lawExp: 35, lawId: 'star', attrs: { 悟性: 3, 神识: 2 }, flag: { 观星定枢: true } },
          goto: 'wsa_wx_c2',
        },
      },
      {
        label: '拱手退让，留待神识更为深厚之日再执紫毫', hint: '审慎止步 · 错失此次传承',
        outcome: {
          text: '你退出观星台，在石阶下仰望星海半宿，虽未入大阵，倒也借星辉涤静了识海。',
          effects: { expPct: 0.14, attrs: { 神识: 2 }, contribution: 120 },
        },
      },
    ],
  },
  {
    id: 'wsa_wx_c2', title: '观星大阵 · 星河棋局', pool: 'branch', tier: 5, weight: 0,
    text: (s) => `踏入水镜，周遭已无山河书院，唯见脚下三百六十一条银色阵线交织成无边星棋。\n\n${s.flags['观星定枢'] ? '天枢七星高悬你头顶垂下庇护银光，整座星局脉络纤毫毕现。' : '星轨错乱轰鸣，无数陨星碎片正朝你当头坠落！'}\n\n棋局彼端，一尊体表镶嵌星辰砂的「观星古守卫」迈步而出，双掌合十，欲以千钧星压考校执笔者的筋骨与阵道！`,
    choices: [
      {
        label: '执墨笔化星剑，正面击溃观星古守卫破局', hint: '硬仗 · 观星古守卫',
        cost: { month: 1 },
        combat: {
          enemy: 'star_golem',
          win: {
            text: '你一笔点碎古守卫胸口紫微星核！青铜巨人轰然跪伏化作星尘，棋局尽头浮现一卷悬浮于星河中央的《万象总纲》。',
            effects: { expPct: 0.28, lawExp: 45, lawId: 'star', attrs: { 悟性: 3, 根骨: 3 }, flag: { 星局破守: true } },
            goto: 'wsa_wx_c3',
          },
          lose: {
            text: '青铜重拳震碎你三层墨盾，你吐血退至天元棋位，却借势画成半座反震八卦阵迫停了古守卫的追击，险险过关。',
            effects: { hp: -75, lawExp: 24, lawId: 'array', attrs: { 悟性: 3 } },
            goto: 'wsa_wx_c3',
          },
        },
      },
      {
        label: '不与傀儡角力，以自身为棋子落于天元逆转周天星局', hint: '悟性与神识检定 · 以阵破阵',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 悟性: 0.015, 神识: 0.014 },
          success: {
            text: '一子落而满盘活！三百六十五颗大星顺你心意倒转半周，古守卫瞬间被阵势锁死动弹不得，朝你躬身行礼让开星路。',
            effects: { expPct: 0.26, lawExp: 50, lawId: 'array', attrs: { 悟性: 5, 神识: 3 }, flag: { 星局破守: true } },
            goto: 'wsa_wx_c3',
          },
          fail: {
            text: '星盘推演错算了一步，反遭两颗流星星辉擦伤肩背，好在仍借残阵勉强抢渡至总纲石台。',
            effects: { hp: -55, mp: -45, lawExp: 22, lawId: 'star' },
            goto: 'wsa_wx_c3',
          },
        },
      },
    ],
  },
  {
    id: 'wsa_wx_c3', title: '观星大阵 · 万象归笔', pool: 'branch', tier: 5, weight: 0,
    text: (s) => `星河中央的青玉书案上，《万象总纲》无风自动，书页上并非死板文字，而是山川、星辰、草木、人心万般阵纹的生灭演化。\n\n${s.flags['星局破守'] ? '紫微帝星垂下一道银柱灌入你手中的紫毫古笔，整座书院的护山大阵竟随你呼吸明灭！' : '总纲泛起温和清光，静待你以平生所学写下属于自己的一页新阵。'}`,
    choices: [
      {
        label: '以星河为墨，专精推演《周天星斗杀阵》镇压诸邪', hint: '星辰法则大成 · 得宝与称号',
        cost: { month: 2 },
        outcome: {
          text: '银笔收锋，满天星斗齐齐大亮！你走出观星台时，山长率全院先生躬身授印，从此九州皆知万象书院出了位「观星执墨」大阵师。',
          effects: { expPct: 0.36, lawExp: 88, lawId: 'star', attrs: { 悟性: 5, 神识: 5 }, contribution: 650, reputation: 95, items: ['xinghui_dan', 'xinghe_shan'], title: '观星执墨', flag: { 万象执墨: true } },
        },
      },
      {
        label: '融山河地脉入笔端，创出进退自如的《万象无极阵》', hint: '阵道法则大成 · 防守与悟性登峰',
        cost: { month: 2 },
        outcome: {
          text: '一念落墨，方圆十里草木砖石皆可为阵眼！你神识大成，此后哪怕赤手空拳立于荒野，举手投足亦是天罗地网。',
          effects: { expPct: 0.34, lawExp: 90, lawId: 'array', attrs: { 悟性: 6, 道心: 4 }, contribution: 620, reputation: 90, items: ['bagua_xuanjia', 'yujian_bagua'], title: '观星执墨', flag: { 万象执墨: true } },
        },
      },
    ],
  },

  /* ========================================================================
   * 六、寒山道观（hanshan · 14 节点）
   * 风味：观中不点灯（灯会让人忘记黑暗里有什么）、无灯夜守、冰湖观岁、雪暴孤寒、坐忘春秋三段链
   * ======================================================================== */
  {
    id: 'wsa_hs_01', title: '无灯夜守', pool: 'sect', tier: 2, weight: 8, minRealm: 0,
    require: 'sect() == "hanshan"',
    text: '寒山道观入夜从不点灯。老道士们说，灯火只照亮方寸暖处，却会让人忘了黑暗里蹲着什么。\n\n子夜大雪封门，你独自值守漆黑的三清偏殿。殿外雪地上明明没有脚印，门廊下却响起极轻的木屐声，一步一步停在你背后三尺处，带起一阵比冰雪更冷的风。',
    choices: [
      {
        label: '不回头、不燃符，只在漆黑中静听那缕寒意呼吸', hint: '道心与神识检定 · 寒山正统坐忘',
        cost: { month: 1 },
        roll: {
          p: 0.58, attrs: { 道心: 0.014, 神识: 0.01 },
          success: {
            text: '你屏息凝神，竟辨出那并非鬼祟，而是三百年前一位师祖遗留在门槛上的护观寒意。它绕你转了半圈便悄然散去，留下一缕精纯玄冰灵气钻入你眉心。',
            effects: { expPct: 0.16, demon: -14, attrs: { 道心: 3, 神识: 2 }, lifespan: 5, contribution: 150 },
          },
          fail: {
            text: '寒气冻得你牙关打颤，终究没忍住回头望了一眼——背后空空如也，只因心神一乱，白白吹散了那一缕机缘。',
            effects: { hp: -20, attrs: { 道心: 2 }, contribution: 75 },
          },
        },
      },
      {
        label: '反手一记冰剑斩向门廊黑影，宁杀错不放过', hint: '战斗 · 怨魂',
        combat: {
          enemy: 'ghost',
          win: {
            text: '原是一只趁雪夜摸进山门的雪山阴魅！你一剑将其冻裂，拂晓时观主见殿外冰渣，淡淡夸了一句「眼不盲」。',
            effects: { expPct: 0.18, contribution: 200, stones: 180, attrs: { 根骨: 2 } },
          },
          lose: {
            text: '黑影滑不留手，反抓伤你的肩头遁入雪幕。天亮后观主递来一碗热姜汤：「在黑里出剑，不能光靠眼睛。」',
            effects: { hp: -40, attrs: { 神识: 2 }, contribution: 80 },
          },
        },
      },
      {
        label: '摸黑给冰冷的香炉添三根未燃的松枝香，淡然入定', hint: '无为自安 · 稳增修为与寿元',
        outcome: {
          text: '门廊下的脚步声在松香气息里渐渐远去。你一夜安眠无梦，醒来时只觉气血绵长了许多。',
          effects: { exp: 300, lifespan: 6, demon: -8, contribution: 110 },
        },
      },
    ],
  },
  {
    id: 'wsa_hs_02', title: '冰湖观倒影', pool: 'sect', tier: 2, weight: 8, minRealm: 1,
    require: 'sect() == "hanshan"',
    text: '寒山后崖有一口三丈深的黑冰湖，腊月时湖面冻出三尺透明厚冰，低下却仍有几尾雪白冰鲤极慢、极慢地游动，仿佛湖底的光阴比世间慢了十倍。\n\n玄霜道长裹着破旧灰棉袍坐在冰面钓鱼，钓钩上没有饵，鱼线冻在冰窟里：「别看鱼。看你自己冻在冰里的影子，是不是比去年老了一点。」',
    choices: [
      {
        label: '效仿道长枯坐冰面七日，观冰下光阴缓急之妙', hint: '悟性与道心检定 · 窥见光阴法则',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 悟性: 0.014, 道心: 0.012 },
          success: {
            text: '雪花落在你肩头竟像停顿了半息才化开！你骤然明悟寒山延寿真意：外急而内缓，岁华自慢。道长临走丢给你半瓶冰雪朝露。',
            effects: { expPct: 0.18, lawExp: 26, lawId: 'time', lifespan: 15, attrs: { 道心: 3, 悟性: 2 }, contribution: 200 },
          },
          fail: {
            text: '寒气透骨冻得你灵脉僵直，只坐了三天便狼狈起身跑回暖室烤火，但也记住了那份彻骨清醒。',
            effects: { hp: -30, lifespan: 5, lawExp: 12, lawId: 'time', contribution: 85 },
          },
        },
      },
      {
        label: '以神识潜入黑冰湖底，探查为何此湖光阴迟滞', hint: '神识检定 · 偶获湖底冰髓',
        cost: { month: 1 },
        roll: {
          p: 0.52, attrs: { 神识: 0.014, 气运: 0.01 },
          success: {
            text: '湖底淤泥下竟沉着一块万年玄冰髓！你以隔空取物诀悄然摄起半块，玄霜道长只睁一只眼笑笑：「见者有份，莫涸泽而渔。」',
            effects: { items: ['bihai_xuanbing'], lawExp: 18, lawId: 'time', attrs: { 神识: 2 }, contribution: 160 },
          },
          fail: {
            text: '湖底寒脉骤然反吸你的神识，险些把魂魄冻在冰下，你急忙斩断神识退回，头痛了一整日。',
            effects: { mp: -45, attrs: { 神识: 2 }, contribution: 75 },
          },
        },
      },
      {
        label: '替道长扫净冰面新雪，听他讲三百年前寒山旧事', hint: '淡泊听道 · 消心魔增道心',
        outcome: {
          text: '道长说寒山历代道士飞升的不多，活得比别宗老祖久的却不少。「别人争着往天上爬，咱们先把脚下的雪看明白。」',
          effects: { demon: -14, attrs: { 道心: 3 }, lifespan: 10, contribution: 130 },
        },
      },
    ],
  },
  {
    id: 'wsa_hs_03', title: '寒山雪暴救人', pool: 'sect', tier: 3, weight: 8, minRealm: 1,
    require: 'sect() == "hanshan"',
    text: '大寒之夜暴雪封山，能见度不足三步。你奉观主之命下山寻找失联的采药山民，却在半山枯松下同时发现了两拨快被冻僵的人——\n\n左边是三个蜷缩发抖的凡人采药汉，右边是个胸口插着半截正道飞剑、气息奄奄的血魔宗年轻弟子。风雪越刮越烈，你的灵力只够背起一边穿过雪崖。',
    choices: [
      {
        label: '毫不犹豫先护三名凡人山民回观取暖', hint: '舍魔救凡 · 业力与道心大增',
        cost: { month: 1 },
        outcome: {
          text: '你脱下道袍裹住三个冻得青紫的山民，顶着风雪背回无灯观。天亮后山民们捡回一命，枯松下那名魔修早已化作冰雕，只留一柄寒光铁剑。',
          effects: { karma: 40, reputation: 30, contribution: 220, attrs: { 道心: 3 }, demon: -10 },
        },
      },
      {
        label: '燃尽半数真元化作冰穹护罩，把两拨人一并拖进避风岩洞熬过雪暴', hint: '消耗灵力与气血 · 不分正邪皆救',
        cost: { hp: 35, mp: 45, month: 1 },
        outcome: {
          text: '漫长雪夜里，山民与魔修靠在同一堆枯枝旁谁也没动手。雪停后那魔修沉默地留下两百灵石与一瓶血煞避寒药，低声道：「寒山道士果然和别处不一样。」',
          effects: { karma: 50, demon: -16, stones: 240, contribution: 260, attrs: { 道心: 4, 根骨: 2 } },
        },
      },
      {
        label: '救起山民之余搜走魔修身上的储物袋，留其自生自灭', hint: '冷峻务实 · 得灵石而略损业力',
        outcome: {
          text: '雪夜里讲究不得太多温情。你背着山民回观，顺手摸走魔修腰间一袋灵石与符纸，天亮时风雪已埋平了枯松。',
          effects: { karma: 5, stones: 380, items: ['shenxing_fu'], contribution: 140 },
        },
      },
    ],
  },
  {
    id: 'wsa_hs_04', title: '被遗忘的旧祖', pool: 'sect', tier: 3, weight: 7, minRealm: 2,
    require: 'sect() == "hanshan"',
    text: '追寻走失灵鹤误入寒山极北的冰裂谷，你在一条雪封石缝深处发现了一座没有门扉的冰窟。窟内坐着一名须发结满冰凌的枯瘦老道，气息微弱得几乎与岩石融为一体。\n\n听见你的脚步声，他慢吞吞睁开一只浑浊的眼：「外面……现在是哪一年了？青云山那帮小孩，还在争谁做正道盟主么？」你翻遍观中谱牒，竟从未见过这位活化石般的太上旧祖！',
    choices: [
      {
        label: '恭敬奉上一壶热雪茶，细细讲清这六百年九州兴衰', hint: '尊老敬道 · 获旧祖指点延寿与秘卷',
        cost: { month: 1 },
        outcome: {
          text: '老道听完轻轻笑了一声，指尖在冰面上划出三道玄冰行气路线：「原来过去六百年了，真快啊。这半卷《玄冰心经》你拿去，别告诉观主我还活着，省得他们天天来吵。」',
          effects: { items: ['yujian_xuanbing'], lifespan: 30, lawExp: 35, lawId: 'time', expPct: 0.22, attrs: { 道心: 4, 悟性: 3 }, flag: { 寒山旧祖: true } },
        },
      },
      {
        label: '请教旧祖为何寒山千年立下「观中不点灯」的古戒', hint: '洞察大秘 · 神识与因果大涨',
        cost: { month: 1 },
        outcome: {
          text: '老道眼中罕见地闪过一丝凛然冷光：「因为天上盯着下界的眼睛，只追着光亮走。谁点最亮的灯，谁最早被摘掉。」你听得背脊发凉，对九州仙途忽然有了截然不同的见解。',
          effects: { attrs: { 神识: 4, 悟性: 4 }, lawExp: 32, lawId: 'time', expPct: 0.2, contribution: 240, flag: { 无灯真意: true } },
        },
      },
      {
        label: '悄然退出冰缝封回雪口，不打扰老人清修', hint: '顺其自然 · 心境空明',
        outcome: {
          text: '你深深一拜，退回风雪之外。身后的冰缝悄无声息合拢，仿佛方才只是一场大雪里的幻梦。',
          effects: { demon: -18, attrs: { 道心: 4 }, lifespan: 12 },
        },
      },
    ],
  },
  {
    id: 'wsa_hs_05', title: '霜钟煮雪茶', pool: 'sect', tier: 2, weight: 7, minRealm: 1,
    require: 'sect() == "hanshan"',
    text: '立冬初雪，无灯观的偏院里只支着一只泥炭小炉。沉默寡言的执事师叔叫住你，递来一只粗糙陶碗，里面是以松针初雪煮出的淡青茶汤，热气在冷空气里散得极慢。\n\n师叔盯着碗面浮冰：「寒山弟子最容易犯的错，是把冷清修成了冷酷。喝完这碗茶，说说你心里还有什么热着的东西。」',
    choices: [
      {
        label: '「山门外的万家炊烟，还有尚未走完的长生路」', hint: '冷外热内 · 契合道门真意',
        outcome: {
          text: '师叔嘴角难得扬起半寸：「很好。冻不死的火种，才配进寒山门。」他将一枚温润的冰心雪莲丹悄悄滑进你袖口。',
          effects: { items: ['bingxin_dan'], attrs: { 道心: 3 }, demon: -12, contribution: 180 },
        },
      },
      {
        label: '「没有什么热着的了，唯求大道如冰、不增不减」', hint: '太上忘情 · 根骨与定力大进',
        outcome: {
          text: '师叔叹了口气没反驳你：「太上忘情不是错，只是太冷了，容易断。」那一夜你的玄冰真元却骤然精纯了一大截。',
          effects: { expPct: 0.18, lawExp: 20, lawId: 'time', attrs: { 道心: 2, 神识: 2 }, contribution: 150 },
        },
      },
      {
        label: '不答虚言，将碗中热茶一饮而尽，再替师叔添满一碗', hint: '当下即道 · 寿元与心境双收',
        outcome: {
          text: '热茶落腹化作一缕暖流游走丹田。师叔失笑摇头，与你对坐听了一夜松雪落瓦，什么也没说，却什么都讲了。',
          effects: { lifespan: 12, demon: -14, exp: 380, contribution: 160 },
        },
      },
    ],
  },
  {
    id: 'wsa_hs_06', title: '山民驱寒祟', pool: 'sect', tier: 3, weight: 7, minRealm: 2,
    require: 'sect() == "hanshan" && char.sectRank >= 1',
    text: '寒山脚下的冻河村连着七夜鸡犬不宁，几户人家的水缸一夜结成黑冰，两个孩童发起高烧胡言乱语。村长踩着齐膝深雪爬上石阶，跪在无灯观外求道士下山驱邪。\n\n观里没人讲究排场，你拎起一把桃木旧剑与三张符纸便独自进了村，却在枯井底感应到一股阴毒的溪涧水煞与潜伏怨魂。',
    choices: [
      {
        label: '跃入枯井斩杀寒煞水祟，替村子清净水源', hint: '战斗 · 怨魂（借井脉成势）',
        combat: {
          enemy: 'ghost',
          win: {
            text: '寒光劈碎井底黑冰，邪祟嘶鸣消散！天亮时水缸冰融，孩童退烧。村民端来一锅滚烫山鸡汤，你只喝了一口便悄然上山。',
            effects: { karma: 40, reputation: 35, contribution: 280, expPct: 0.2, demon: -12, attrs: { 道心: 3 } },
          },
          lose: {
            text: '井底阴煞比预想更重，你肩头冻伤才险险将其封死在井眼之下，总算护住了全村平安。',
            effects: { hp: -50, karma: 25, contribution: 160, attrs: { 道心: 2 } },
          },
        },
      },
      {
        label: '取清心咒法绕井诵经七匝，以寒山清气引其散去', hint: '道心与神识检定 · 无伤平祟',
        roll: {
          p: 0.58, attrs: { 道心: 0.014, 神识: 0.012 },
          success: {
            text: '原来井底只是个当年冻毙的卖炭老人执念。你以清净寒意安抚其魂，一炷香后黑冰尽化春水。',
            effects: { karma: 45, demon: -16, contribution: 260, lawExp: 24, lawId: 'karma', attrs: { 道心: 3 } },
          },
          fail: {
            text: '寒祟不听劝化反扑井口，逼得你耗去大半灵力才将其逼退回深井。',
            effects: { mp: -50, karma: 20, contribution: 140 },
          },
        },
      },
      {
        label: '布下简易锁寒符阵封井，叮嘱村民另掘新井', hint: '务实省力 · 稳妥保平安',
        outcome: {
          text: '你没多逞强，连夜在村东另寻了一处阳脉泉眼。村民虽不懂仙法，却都记住了那个不留姓名的寒山道士。',
          effects: { karma: 25, contribution: 190, attrs: { 悟性: 2 } },
        },
      },
    ],
  },
  {
    id: 'wsa_hs_07', title: '熄灯戒 · 破妄见真', pool: 'sect', tier: 4, weight: 7, minRealm: 2,
    require: 'sect() == "hanshan" && char.sectRank >= 2',
    text: '中州正道盟遣来一名盛气凌人的金丹特使商议北荒防务。特使嫌无灯观漆黑寒酸，竟不顾劝阻，亲手在议事堂点起一盏耀眼夺目的「九阳灵灯」，照得大殿纤毫毕现。\n\n就在灯光最盛的一刹那，你凭多年暗中守夜练就的直觉，猛然发觉特使身后拉长的影子里，竟多出了一只没有头颅的虚空暗爪！',
    choices: [
      {
        label: '挥袖吹灭九阳灵灯，在骤然降临的黑暗里一剑刺向影中魔物', hint: '战斗 · 裂界暗影（化形影魔：阴煞尸将同阶）',
        cost: { month: 1 },
        combat: {
          enemy: 'corpse_general',
          win: {
            text: '灯灭的刹那，那只借光藏身的影魔无所遁形，发出凄厉尖叫被你斩碎！重见星光时特使瘫坐蒲团冷汗直流，从此再不敢轻视寒山「不点灯」的古训！',
            effects: { expPct: 0.26, contribution: 460, reputation: 70, karma: 30, lawExp: 35, lawId: 'time', items: ['qingming_jing'] },
          },
          lose: {
            text: '影魔在暗中凶狠反扑划伤你的胸膛，幸得观主及时出手以玄冰封魂。特使羞愧难当，奉上灵石赔罪。',
            effects: { hp: -75, stones: 600, contribution: 260, reputation: 35 },
          },
        },
      },
      {
        label: '不动声色递过一碗寒山醒神茶，暗中以神识锁死影魔退路', hint: '神识检定 · 智擒影魔',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 神识: 0.015, 悟性: 0.012 },
          success: {
            text: '待特使低头饮茶，你骤然掐灭灵灯同时激发冰封阵！影魔连声都没出便被冻成冰雕，特使惊魂未定，对寒山佩服得五体投地。',
            effects: { contribution: 440, reputation: 65, stones: 700, attrs: { 神识: 4, 悟性: 2 }, lawExp: 30, lawId: 'space' },
          },
          fail: {
            text: '影魔嗅到杀机提前撕裂影子遁走山外，只留下一缕阴寒虚空气息，令人心悸。',
            effects: { contribution: 180, attrs: { 神识: 2 }, lawExp: 18, lawId: 'space' },
          },
        },
      },
      {
        label: '冷声喝令特使立刻熄灯离观，免得把祸水留在山门', hint: '冷峻拒客 · 护山无伤',
        outcome: {
          text: '特使怒拂袖而去，次日山下却传来他遇袭重伤的消息。观主只淡淡说了句：「不肯信暗处有狼的人，拦不住。」',
          effects: { contribution: 220, attrs: { 道心: 3 }, demon: -8 },
        },
      },
    ],
  },
  {
    id: 'wsa_hs_08', title: '寒潭冰髓脉', pool: 'sect', tier: 4, weight: 6, minRealm: 3,
    require: 'sect() == "hanshan" && char.sectRank >= 2',
    text: '寒山雪线之上有一处隐秘冰髓灵脉，乃是全观道士延寿静修的根本。今秋地脉轻震，灵气外泄百里，竟引来一伙北荒魔修与贪婪散修结伴偷掘冰脉！\n\n观主正值坐忘破关紧要关头，长老们各守山界，你提着一柄寒霜古剑独自立于雪崖之上，俯瞰崖下十余名正挥镐掘冰的闯入者。',
    choices: [
      {
        label: '孤身落入寒潭，以冰脉地利硬撼为首元婴魔修', hint: '恶战 · 血海长老',
        cost: { month: 1 },
        combat: {
          enemy: 'blood_elder',
          win: {
            text: '极寒潭水冻结了漫天血雾，你借千年冰髓之威一剑重创血海长老，余众望风溃逃！保住护观灵脉后，冰髓反哺一缕先天寒精入你紫府。',
            effects: { expPct: 0.3, contribution: 560, reputation: 80, lifespan: 30, lawExp: 45, lawId: 'time', items: ['bihai_xuanbing', 'hanbing_jian'] },
          },
          lose: {
            text: '血煞巨掌击碎你的玄冰护罩，你拼死引动寒潭阵眼冰封谷口，虽负重伤，终究没让他们挖走半块冰髓。',
            effects: { hp: -95, injury: 2, contribution: 340, reputation: 45, attrs: { 道心: 4 } },
          },
        },
      },
      {
        label: '悄然潜入冰脉下游引动雪崩，借天威掩埋入侵者而不露面', hint: '悟性与神识检定 · 无声退敌',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 悟性: 0.014, 神识: 0.012 },
          success: {
            text: '三道细若游丝的剑气切开崖顶冰檐，万钧雪浪轰然倾泻！闯入者死伤过半仓皇逃出寒山，连是谁动的手都没看清。',
            effects: { contribution: 500, reputation: 55, expPct: 0.24, attrs: { 悟性: 4, 神识: 2 }, items: ['bihai_xuanbing'] },
          },
          fail: {
            text: '雪崩被对方大修强行轰散，虽惊退了大半散修，也耗去你不少真元。',
            effects: { mp: -60, contribution: 260, attrs: { 悟性: 2 } },
          },
        },
      },
      {
        label: '现身与对方谈判，以三块散落玄冰换其立誓永不踏足寒山', hint: '止戈息事 · 消耗灵石打点',
        cost: { stones: 600 },
        outcome: {
          text: '对方见寒山深不可测，不愿硬拼死磕，收下外围寒玉便退走了。虽被几名年轻师弟嫌软弱，观主出关后却称你护住了全观元气。',
          effects: { contribution: 320, attrs: { 道心: 3 }, lifespan: 15 },
        },
      },
    ],
  },
  {
    id: 'wsa_hs_09', title: '无灯道士 · 雪夜借宿', pool: 'world', tier: 2, weight: 7, minRealm: 1,
    text: '大雪封路的山岭破亭里，你刚生起一堆干柴，一个背着竹笠的灰袍道士踩雪进来，二话不说抓起一捧雪把你的火堆给灭了。\n\n你正待发作，他竖指抵唇轻声道：「别出声，别点灯。往东边松林看——有东西正顺着火光找活人呢。」借着雪光望去，松林里果然晃动着三双惨绿妖瞳。',
    choices: [
      {
        label: '立刻敛息静坐，随这名寒山道士在黑暗里熬过妖物巡山', hint: '顺从奇人 · 悟得敛息与道心',
        outcome: {
          text: '整整半个时辰，惨绿妖瞳就在亭外十丈徘徊，却始终寻不到你们踪迹。妖物退去后，灰袍道士拱手笑道：「寒山清微，多谢道友忍住没拔剑。」赠你一瓶清心药丸。',
          effects: { items: ['qingxin_dan'], demon: -12, attrs: { 道心: 3, 神识: 2 }, exp: 320 },
        },
      },
      {
        label: '不屑躲藏，提兵冲入松林把那头窥伺妖兽宰了再烤火', hint: '战斗 · 铁甲妖猪',
        combat: {
          enemy: 'beast',
          win: {
            text: '你提着染血妖核走回破亭，灰袍道士无奈失笑，重新替你生起一堆火：「好霸气的路子，倒是我多事了。」顺手分你半壶暖身松酒。',
            effects: { expPct: 0.18, items: ['yaoshou_neidan'], reputation: 25, attrs: { 根骨: 2 } },
          },
          lose: {
            text: '林里妖兽比你估的凶悍许多，灰袍道士叹着气出手一指将其冻退，把你拖回暗处敷了伤药。',
            effects: { hp: -45, items: ['liaoshang_dan'], attrs: { 道心: 1 } },
          },
        },
      },
      {
        label: '在黑暗里与道士低声清谈长生与寒山坐忘之术', hint: '雪夜论道 · 增寿与光阴感悟',
        outcome: {
          text: '这一夜没有灯火，两人的声音却格外清澈。天亮分别时，你只觉肺腑如饮冰雪，竟添了数载寿元。',
          effects: { lifespan: 12, lawExp: 20, lawId: 'time', attrs: { 悟性: 2, 道心: 2 } },
        },
      },
    ],
  },
  {
    id: 'wsa_hs_10', title: '冰火之争 · 寒山与丹霞', pool: 'world', tier: 3, weight: 7, minRealm: 2,
    text: '苍茫山脉深处新现一处罕见的「冰火双生洞」，左壁凝玄冰髓、右壁涌地心赤焰。丹霞谷药师想引火炼丹，寒山道士欲守冰静修，两派正道向来井水不犯河水，今夜却在洞口剑拔弩张。\n\n丹霞执事满脸通红：「冰脉紧挨火眼，不早早疏导地火，整座山都要炸！」寒山道长冷眼回应：「你们一开火炉，万年冰髓三天就得化光！」',
    choices: [
      {
        label: '提议于洞心画阴阳隔灵阵，左寒右火互不相侵、两宗共分', hint: '悟性与魅力检定 · 完美调停获双礼',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 悟性: 0.014, 魅力: 0.012 },
          success: {
            text: '你在冰火交界处刻下阴阳鱼阵眼，寒热二气竟反倒彼此循环生生不息！两宗执事大喜过望，各赠冰髓与灵丹谢你大才。',
            effects: { items: ['bihai_xuanbing', 'juling_dan'], reputation: 60, stones: 600, lawExp: 28, lawId: 'chaos', attrs: { 悟性: 3 } },
          },
          fail: {
            text: '阵纹刚刻到一半便被冰火冲撞震裂，两宗各自冷哼一声，只得轮流按月开采。',
            effects: { hp: -30, attrs: { 悟性: 2 } },
          },
        },
      },
      {
        label: '帮丹霞谷压住寒山道士，换取开炉头批成丹分红', hint: '偏向丹霞 · 得丹药与灵石',
        outcome: {
          text: '你帮丹霞弟子稳住火眼引道，丹霞管事豪爽地奉上一枚碧血生肌丹与厚礼，寒山道长则默默记了你一眼转身入雪。',
          effects: { items: ['bixue_dan'], stones: 550, lawExp: 22, lawId: 'pill', reputation: 15 },
        },
      },
      {
        label: '帮寒山道观护住玄冰寒脉，换取延寿静修之缘', hint: '偏向寒山 · 增寿与冰道感悟',
        outcome: {
          text: '寒山道长并未多言谢字，只将一滴采自冰眼的寒露点在你眉心，刹那清凉直透丹田。',
          effects: { lifespan: 20, demon: -16, lawExp: 24, lawId: 'time', attrs: { 道心: 3 } },
        },
      },
    ],
  },
  {
    id: 'wsa_hs_11', title: '黑暗里有什么', pool: 'world', tier: 4, weight: 6, minRealm: 3,
    text: '九州诸宗大能齐聚中州饮宴庆功，偏偏寒山道观送来一封无字黑笺——唯有熄灭殿内所有灯火，以神识扫过黑笺，才见一行冰冷小字：「界海之外，黑暗正在靠近。灯越亮，来得越快。」\n\n殿内不少高阶修士嗤之以鼻，笑寒山道士闭门造车、故弄玄虚。',
    choices: [
      {
        label: '独自熄灯细参黑笺中残留的虚空冰纹，查探真相', hint: '神识与悟性检定 · 提前洞悉界海劫机',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 神识: 0.015, 悟性: 0.012 },
          success: {
            text: '你骤然在黑笺纹路里窥见一丝域外虚空裂隙的真实坐标！虽冷汗湿背，却也借此领悟了空间与光阴交错之理。',
            effects: { expPct: 0.24, lawExp: 42, lawId: 'space', attrs: { 神识: 4, 悟性: 3 }, items: ['suodi_fu'], flag: { 寒山暗警: true } },
          },
          fail: {
            text: '黑笺上的寒意反噬神识，令你眼前发黑半刻，只隐约记住那份令人窒息的压迫感。',
            effects: { mp: -50, attrs: { 神识: 2 }, lawExp: 18, lawId: 'space' },
          },
        },
      },
      {
        label: '当众替寒山发声，呼吁诸宗暗查九州灵脉边缘裂隙', hint: '力排众议 · 声望与业力提升',
        outcome: {
          text: '虽有几名大宗长老面露不悦，天机阁与万象书院却暗中赞同你的警觉，赠你法则残片共研应对之策。',
          effects: { reputation: 65, karma: 30, items: ['faze_canpian'], attrs: { 道心: 3, 魅力: 2 } },
        },
      },
      {
        label: '置身事外，只顾自扫门前雪、暗备渡劫退路', hint: '明哲保身 · 得护身逃遁底牌',
        outcome: {
          text: '天塌下来有大乘老祖顶着，你默记寒山警示，回坊市悄悄多备了一张保命符箓。',
          effects: { items: ['huxin_fu'], attrs: { 气运: 2 } },
        },
      },
    ],
  },
  {
    id: 'wsa_hs_c1', title: '坐忘春秋 · 无灯初雪', pool: 'sect', tier: 4, weight: 7, minRealm: 2,
    require: 'sect() == "hanshan"',
    once: true,
    text: '腊月初一，寒山无灯观后院那棵枯死三百年的老梅树忽然在无灯之夜冒出一朵冰晶白花。\n\n观主合掌立于雪中，破天荒地亲口唤你入「坐忘雪窟」：「老梅开花，是光阴回潮之兆。入窟枯坐，熬过三载春秋幻雪，便能接续寒山最深一脉《坐忘春秋诀》。」',
    choices: [
      {
        label: '褪去锦袍只着单衣，赤手步入无灯雪窟坐忘', hint: '道心与根骨检定 · 启坐忘三关',
        cost: { month: 1 },
        roll: {
          p: 0.58, attrs: { 道心: 0.014, 根骨: 0.01 },
          success: {
            text: '雪窟之内既无灯火，也无日夜。你呼吸渐缓，仿佛与百年坚冰融为一体，耳畔听见花开雪融的细微声响，悄然滑入光阴冰湖。',
            effects: { expPct: 0.2, lifespan: 15, lawExp: 28, lawId: 'time', attrs: { 道心: 3 }, flag: { 坐忘初寂: true } },
            goto: 'wsa_hs_c2',
          },
          fail: {
            text: '严寒一度冻裂你的唇角，心火险些失控，全靠默念无灯古训才稳住神台，艰难迈入第二重幻雪。',
            effects: { hp: -50, lifespan: 8, lawExp: 16, lawId: 'time', attrs: { 道心: 2 } },
            goto: 'wsa_hs_c2',
          },
        },
      },
      {
        label: '携一缕碧海玄冰髓温养丹田，以寒制寒入雪窟', hint: '消耗碧海玄冰髓 · 稳入二关',
        cost: { item: 'bihai_xuanbing', month: 1 },
        outcome: {
          text: '玄冰髓化作一汪清泉护住心脉，雪窟严寒反倒成了最温顺的吐纳灵源，你从容踏入光阴深境。',
          effects: { expPct: 0.22, lifespan: 20, lawExp: 32, lawId: 'time', attrs: { 道心: 3, 神识: 2 }, flag: { 坐忘初寂: true } },
          goto: 'wsa_hs_c2',
        },
      },
      {
        label: '唯恐坐忘迷失岁月，向观主辞谢暂不入窟', hint: '惜身止步 · 错失此次传承',
        outcome: {
          text: '观主并未挽留，只折下那枝冰梅赠你：「凡心未冷，便多看几年人间。」',
          effects: { lifespan: 10, demon: -10, contribution: 120 },
        },
      },
    ],
  },
  {
    id: 'wsa_hs_c2', title: '坐忘春秋 · 冰湖岁影', pool: 'branch', tier: 5, weight: 0,
    text: (s) => `雪窟尽头化作一面无边漆黑冰镜。镜面上，你的倒影正在以肉眼可见的速度经历春华秋实——须臾白发苍苍、须臾重返垂髫。\n\n${s.flags['坐忘初寂'] ? '你心湖沉静，未曾被岁月的流逝激起一丝惶恐。' : '衰老的恐惧顺着寒风钻入骨缝，冰镜里走出一道凝霜般的冷酷身影！'}\n\n那是太古玄冥寒意所化的「岁影残魂」，抬手之间便要冻结你的寿元长河！`,
    choices: [
      {
        label: '拔剑斩碎冰镜岁影，向天道夺回自身光阴', hint: '强敌试炼 · 心魔（岁影化身）',
        cost: { month: 1 },
        combat: {
          enemy: 'heart_demon',
          win: {
            text: '寒光劈碎漆黑冰镜，漫天岁月碎片化作点点银露汇入你丹田！镜后露出一座无灯雪亭，亭心悬着一滴不化朝露。',
            effects: { expPct: 0.28, lifespan: 25, lawExp: 45, lawId: 'time', attrs: { 道心: 4, 根骨: 2 }, flag: { 冰湖证岁: true } },
            goto: 'wsa_hs_c3',
          },
          lose: {
            text: '寒意侵体令你瞬生数缕白发，你咬破舌尖强提清明逼退岁影，跌跌撞撞闯进了无灯雪亭。',
            effects: { hp: -65, lifespan: -5, lawExp: 22, lawId: 'time', attrs: { 道心: 3 } },
            goto: 'wsa_hs_c3',
          },
        },
      },
      {
        label: '静看镜中自己由盛转衰、由枯转荣，欣然接纳岁月无常', hint: '道心与悟性检定 · 顺时化劫',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 道心: 0.015, 悟性: 0.014 },
          success: {
            text: '当你不再畏惧老去，冰镜岁影竟朝你微笑稽首，化作一缕春风拂过面颊！枯雪消融，无灯雪亭近在咫尺。',
            effects: { expPct: 0.26, lifespan: 35, demon: -25, lawExp: 50, lawId: 'time', attrs: { 道心: 5, 悟性: 3 }, flag: { 冰湖证岁: true } },
            goto: 'wsa_hs_c3',
          },
          fail: {
            text: '一念不舍红尘华年，光阴反震让你吐出一口寒气，好在守住本心未堕魔障，终步入雪亭。',
            effects: { hp: -50, demon: 4, lawExp: 24, lawId: 'time' },
            goto: 'wsa_hs_c3',
          },
        },
      },
    ],
  },
  {
    id: 'wsa_hs_c3', title: '坐忘春秋 · 独照幽冥', pool: 'branch', tier: 5, weight: 0,
    text: (s) => `无灯雪亭没有灯盏，亭顶却自然流淌着一缕清冷如月色的太古光阴。${s.flags['冰湖证岁'] ? '那滴不化朝露落入你眉心，你刹那听懂了寒山千年枯坐的真义：长生不是逃避黑暗，而是在无边长夜里自己成为那双清醒的眼。' : '雪亭寒气柔和下来，为你洗去尘世浮躁。'}\n\n走出雪窟那日，外界竟只过了一夜，可你的道行与寿元已然换了天地。`,
    choices: [
      {
        label: '承接《坐忘春秋》长生真传，以光阴温养万古道躯', hint: '光阴法则大成 · 巨幅延寿与称号',
        cost: { month: 1 },
        outcome: {
          text: '一滴岁月朝露化作滔滔生机归于紫府，观主在雪阶前向你微笑稽首：「从今日起，寒山的夜，你也看得见了。」',
          effects: { expPct: 0.34, lawExp: 88, lawId: 'time', lifespan: 120, demon: -30, attrs: { 道心: 6, 神识: 4 }, contribution: 650, reputation: 85, items: ['guangyin_lu'], title: '寒山坐忘', flag: { 寒山真传: true } },
        },
      },
      {
        label: '融极寒剑意入光阴停滞之理，修成「一剑冻春秋」', hint: '寒冰剑道与光阴双修 · 攻守兼备',
        cost: { month: 1 },
        outcome: {
          text: '你指尖轻弹，漫天飞雪悬停三息！寒山道观万年少见的杀伐奇才就此诞生，观主赐你极品寒霜神兵与古卷。',
          effects: { expPct: 0.36, lawExp: 78, lawId: 'time', lifespan: 65, attrs: { 悟性: 5, 根骨: 4, 道心: 4 }, contribution: 600, reputation: 90, items: ['hanbing_jian', 'yujian_xuanbing'], title: '寒山坐忘', flag: { 寒山真传: true } },
        },
      },
    ],
  },

  /* ========================================================================
   * 七、万宝阁（wanbao · 14 节点）
   * 风味：天下没有不卖的东西（包括人）、三十六号库鉴宝、伪玉简黑帮、海路商队、盲匣拍、万宝总账三段链
   * ======================================================================== */
  {
    id: 'wsa_wb_01', title: '三十六号库鉴宝', pool: 'sect', tier: 2, weight: 8, minRealm: 0,
    require: 'sect() == "wanbao"',
    text: '万宝阁三十六号暗库终年点着鲛油长明灯，空气里混着沉香、灵石粉与旧铜味。大掌柜拨着紫檀算盘，将九件刚从北荒收来的古物一字排开——青铜残镜、血纹骨笛、枯木剑鞘，件件灵光逼人。\n\n大掌柜头也不抬：「九件里头，七件真古珍、一件高仿赝品、一件带着噬主鬼咒的凶物。挑出凶物封库，赏三百灵石；挑错了，自己掏腰包赔库损。」',
    choices: [
      {
        label: '以神识逐一轻叩器灵脉络，细辨阴寒咒意', hint: '神识与悟性检定 · 练就鉴宝火眼',
        cost: { month: 1 },
        roll: {
          p: 0.58, attrs: { 神识: 0.014, 悟性: 0.012 },
          success: {
            text: '你指尖停在那支温润如玉的旧玉簪前——表面祥和，内里却藏着三缕吸魂怨丝！大掌柜啪地拨响算盘珠，露出一丝笑意：「好眼力，没被外头那根吓人的血骨笛唬住。」',
            effects: { stones: 420, contribution: 180, expPct: 0.14, attrs: { 神识: 2, 悟性: 2 } },
          },
          fail: {
            text: '你指错了那柄锈迹斑斑的剑鞘，结果一摸玉簪差点被怨咒咬掉半截手指。掌柜摇头扣了你一笔见习赏钱。',
            effects: { hp: -25, stones: -80, attrs: { 悟性: 2 }, contribution: 60 },
          },
        },
      },
      {
        label: '借清明照妖镜逐一照过九件古物，省心省力', hint: '有清明照妖镜必成 · 或靠气运蒙中',
        roll: {
          p: 0.5, attrs: { 气运: 0.016, 神识: 0.008 },
          success: {
            text: '灯影一晃，那支玉簪竟在案上投出一道无头影！你顺手连那件高仿赝品也一并揪出，掌柜破例多发了双倍红利。',
            effects: { stones: 620, contribution: 220, reputation: 25, attrs: { 气运: 2 } },
          },
          fail: {
            text: '忙中出错，把真古珍当成了赝品打回，虽没中鬼咒，还是挨了掌柜一顿毒舌数落。',
            effects: { contribution: 70, attrs: { 悟性: 1 } },
          },
        },
      },
      {
        label: '老实禀明暂缺高阶鉴宝经验，自请记账观摩大掌柜出手', hint: '稳妥学艺 · 涨眼力得工钱',
        outcome: {
          text: '大掌柜倒没嘲笑你，亲手演示了听声、闻煞、验灵纹三绝，末了塞给你一袋月例灵石：「在万宝阁，不懂装懂死得最快。」',
          effects: { stones: 200, attrs: { 悟性: 2 }, contribution: 110 },
        },
      },
    ],
  },
  {
    id: 'wsa_wb_02', title: '伪玉简黑帮', pool: 'sect', tier: 3, weight: 8, minRealm: 1,
    require: 'sect() == "wanbao"',
    text: '近半月来，落霞坊市接连有七名散修练功走火入魔，手里攥着的竟全是盖着「万宝阁火漆印」的低价剑谱玉简！\n\n柜上查验后震怒：有人在城南暗巷搭了私窑，专仿万宝阁印记兜售篡改经脉的毒玉简。若不三日内清剿，万宝阁百年金字招牌将荡然无存！',
    choices: [
      {
        label: '乔装散修买家摸入城南黑窑，人赃并获一锅端', hint: '战斗 · 断魂刀客',
        cost: { month: 1 },
        combat: {
          enemy: 'blade_rogue',
          win: {
            text: '你踹翻作坊木门，斩断黑帮护法鬼头刀，当场查封三百枚伪玉简与私刻火漆印！大掌柜大悦，除重赏灵石外更赠你真品剑谱。',
            effects: { stones: 680, contribution: 300, reputation: 40, items: ['yujian_qingfeng'], expPct: 0.18 },
          },
          lose: {
            text: '黑帮设了连环弩机埋伏，你带伤杀出暗巷，好在及时引来阁中护卫捣毁了窝点。',
            effects: { hp: -55, stones: 260, contribution: 140 },
          },
        },
      },
      {
        label: '先贴告示高价回收全部伪玉简稳住口碑，再借药粉追踪货源', hint: '商道手腕 · 消耗 300 灵石大赚声望与线索',
        cost: { stones: 300, month: 1 },
        outcome: {
          text: '万宝阁「假一赔三」的告示一出，非但没损信誉，反令九州客商交口称赞！你顺着回收玉简上的硫磺味端掉上游私窑，连本带利赚回双倍灵石。',
          effects: { stones: 900, reputation: 55, contribution: 340, attrs: { 魅力: 3, 悟性: 2 } },
        },
      },
      {
        label: '放风声给黑帮背后金主，暗中谈判逼其交出双倍赔款换一条生路', hint: '以商制盗 · 灵石暴涨而略损正气',
        roll: {
          p: 0.58, attrs: { 魅力: 0.014, 气运: 0.01 },
          success: {
            text: '那金主竟是落霞城一家落魄世家，见事迹败露吓得连夜送来一千灵石与珍稀灵材求和。算盘一响，万宝阁滴血未流净赚一笔。',
            effects: { stones: 1050, contribution: 260, karma: -10, attrs: { 魅力: 2 } },
          },
          fail: {
            text: '对方狗急跳墙放火烧了作坊逃之夭夭，虽止住了伪简流入，却落了个两手空空。',
            effects: { contribution: 110, attrs: { 悟性: 1 } },
          },
        },
      },
    ],
  },
  {
    id: 'wsa_wb_03', title: '海路商队遇伏', pool: 'sect', tier: 3, weight: 8, minRealm: 1,
    require: 'sect() == "wanbao"',
    text: '万宝阁三艘铁木楼船满载归墟珊瑚与东海玄冰驶过黑礁海峡，夜雾骤起，海面下忽然翻出数十道黑鳞身影——竟是一群深海夜叉截船劫货！\n\n更糟的是，你一眼瞥见船尾护航的副镖头正偷偷掐灭传讯信号灯，显然早已与海妖暗中勾结！',
    choices: [
      {
        label: '先一招擒下内奸副镖头，再跃上船头死战深海夜叉', hint: '硬仗 · 深海夜叉',
        cost: { month: 1 },
        combat: {
          enemy: 'sea_yaksha',
          win: {
            text: '你反手敲晕内奸，提剑劈碎夜叉三叉戟！海妖见内应失效、货船炮弩齐发，嘶吼着潜回深海。三船奇珍丝毫无损，阁中按货值分你重红！',
            effects: { stones: 980, contribution: 360, reputation: 45, expPct: 0.22, items: ['guixu_shanhu'] },
          },
          lose: {
            text: '黑浪卷上甲板，你肩头挨了一戟，拼死护住主舱玉匣退回船舱，直至海城巡航宝船赶至才解危局。',
            effects: { hp: -70, injury: 1, stones: 420, contribution: 180 },
          },
        },
      },
      {
        label: '将计就计丢出一箱装满爆炎符的假货诱海妖入网，连内奸一并收拾', hint: '悟性与气运检定 · 智保海船',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 悟性: 0.014, 气运: 0.012 },
          success: {
            text: '轰然巨响炸翻黑礁海面，夜叉群被赤焰震得七荤八素，内奸也在火光里暴露原形束手就擒！整趟海路利润暴增。',
            effects: { stones: 1100, contribution: 340, reputation: 40, attrs: { 悟性: 3 }, items: ['canghai_zhu'] },
          },
          fail: {
            text: '火药受海雾潮气只响了半数，虽惊退了海妖，仍被抢走两箱普通灵矿。',
            effects: { stones: 320, contribution: 140, attrs: { 悟性: 1 } },
          },
        },
      },
      {
        label: '以一箱灵石抛海与夜叉头目当场议价买路，保主船人货平安', hint: '万宝商道 · 消耗 350 灵石止血保本',
        cost: { stones: 350 },
        outcome: {
          text: '「做买卖讲究算总账，拿三百灵石保三万的货，划算！」夜叉头目掂了掂灵石袋竟真的挥叉放行。大掌柜听后连夸你有大商风范。',
          effects: { stones: 820, contribution: 280, attrs: { 魅力: 3 } },
        },
      },
    ],
  },
  {
    id: 'wsa_wb_04', title: '盲匣豪赌拍', pool: 'sect', tier: 3, weight: 7, minRealm: 2,
    require: 'sect() == "wanbao"',
    text: '万宝阁每年秋分最癫狂的节目莫过于「三匣盲拍」——三只以隔绝神识的黑玄铁封死的古匣摆上红毡台，阁规明言：里头必有一件无价上古奇珍、一件一文不值的朽木废铁、一件随时可能反噬开匣者的魔道凶物。\n\n今夜台下豪客云集，阁主特许内门执事亦可用贡献与灵石下场参拍一匣。',
    choices: [
      {
        label: '屏息感受三匣微弱气机流转，豪掷 500 灵石拍下最沉的左匣', hint: '气运与神识检定 · 一夜暴富或血本无归',
        cost: { stones: 500 },
        roll: {
          p: 0.55, attrs: { 气运: 0.016, 神识: 0.01 },
          success: {
            text: '黑铁封条撕开的刹那，璀璨金光映红整座拍卖厅——里头竟是一枚太古龙血精与一袋上品灵石！全场轰动！',
            effects: { items: ['longxue_jing'], stones: 1200, reputation: 45, attrs: { 气运: 3 }, contribution: 200 },
          },
          fail: {
            text: '匣盖弹开，里面只躺着半块发霉的破碑砖，还喷出一股辛辣黑烟把你呛得直咳嗽。好在阁里退了你些许安慰贡献。',
            effects: { hp: -30, contribution: 90, attrs: { 道心: 2 } },
          },
        },
      },
      {
        label: '不赌匣内珍宝，反手在台下帮豪客鉴匣抽成收顾问费', hint: '稳赚不赔 · 魅力与悟性检定',
        roll: {
          p: 0.6, attrs: { 魅力: 0.012, 悟性: 0.012 },
          success: {
            text: '「赌匣十赌九输，卖水稳赚不赔。」你替三位世家公子排掉了那只冒煞气的右匣，三家各奉厚酬，你笑眯眯数灵石数到手软。',
            effects: { stones: 950, contribution: 240, attrs: { 悟性: 2, 魅力: 2 } },
          },
          fail: {
            text: '那位公子开了中匣只摸出几块旧铜钱，气得没给你赏钱，只白跑了一趟嘴皮子。',
            effects: { stones: 120, contribution: 80 },
          },
        },
      },
      {
        label: '买下流拍的最丑旧木匣，拆解匣身本身竟另有玄机', hint: '慧眼识珠 · 消耗 260 灵石',
        cost: { stones: 260 },
        outcome: {
          text: '里头果然空空如也，可你敲开双层匣底，木料本身竟是万年雷击木所雕！大掌柜看得直摇头：「好家伙，连匣子都让你赚走了。」',
          effects: { items: ['leimu'], attrs: { 悟性: 3, 气运: 2 }, contribution: 180 },
        },
      },
    ],
  },
  {
    id: 'wsa_wb_05', title: '讨债血契', pool: 'sect', tier: 3, weight: 7, minRealm: 1,
    require: 'sect() == "wanbao"',
    text: '万宝阁的灵石好借，可逾期不还的债，连元婴老怪都赖不掉。\n\n账房丢给你一纸按着血指印的十年旧契：青川陈氏家主当年为求筑基丹借走八百灵石，如今家主渡劫身死，陈氏只剩老妇与几名炼气小辈守着半亩灵田。账房冷冰冰道：「今天是最后期限。要么拿回千二本息，要么把那半亩灵田连同老宅收归阁下。」',
    choices: [
      {
        label: '不收老宅，改签长契让陈氏今后十年以所产灵草分期抵债', hint: '留人活路亦保商利 · 魅力与业力双丰收',
        outcome: {
          text: '陈氏老妇涕泪叩谢，不仅按年按季交足上品灵草，日后陈家子弟出息了还成了万宝阁最忠实的灵药供应商。大掌柜算完长远账，破例夸你眼光毒辣。',
          effects: { karma: 35, contribution: 260, stones: 420, items: ['lingcao', 'qiannian_lingcao'], attrs: { 魅力: 3, 道心: 2 } },
        },
      },
      {
        label: '铁面无私按血契封门收田，替万宝阁立下讨债威名', hint: '冷酷守契 · 灵石丰厚而损业力',
        outcome: {
          text: '你面无表情钉下万宝阁封条，把哭喊的陈氏族人请出院门。当月全城欠债商号闻风丧胆，纷纷提前还清旧账，账房重赏你一笔高额提成。',
          effects: { stones: 1100, contribution: 320, karma: -30, demon: 6, reputation: 20 },
        },
      },
      {
        label: '查明当年压榨陈氏的竟是阁内放高利贷的贪执事，反手追回黑账', hint: '悟性与神识检定 · 清肃内蠹',
        roll: {
          p: 0.55, attrs: { 神识: 0.014, 悟性: 0.012 },
          success: {
            text: '原契本利早已还清，是账房恶执事私篡利息想吞陈氏灵田！你将假账摔在大掌柜桌上，既救了陈家，又分得抄没执事家产的赏金。',
            effects: { karma: 45, stones: 750, contribution: 340, reputation: 45, attrs: { 道心: 3, 神识: 2 } },
          },
          fail: {
            text: '恶执事后台极硬，反咬你办事不力，你只得自己垫了些灵石了结此契。',
            effects: { stones: -180, karma: 20, attrs: { 道心: 2 } },
          },
        },
      },
    ],
  },
  {
    id: 'wsa_wb_06', title: '妖族议价席', pool: 'sect', tier: 3, weight: 7, minRealm: 2,
    require: 'sect() == "wanbao" && char.sectRank >= 1',
    text: '万宝阁做生意不问人妖。苍茫妖森边缘的「白骨议价棚」里，一头化形半截、披着熊皮的金丹妖将一巴掌拍碎红木茶几，震得茶碗乱跳。\n\n「人族奸商！拿三百斤劣质玄铁就想换本王十枚妖兽内丹？当我妖族不识数么？今天不加三倍灵药，就把你留下来下酒！」',
    choices: [
      {
        label: '面不改色推开碎桌，亮出万宝阁炼器奇珍与丹药样本重新压价', hint: '魅力与道心检定 · 商海舌战定大单',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 魅力: 0.015, 道心: 0.012 },
          success: {
            text: '你一眼看出妖将右臂旧伤未愈，随手推过一瓶疗伤宝丹笑道：「玄铁加一成，另送大王两瓶克制剑伤的碧血丹，换您十二枚内丹如何？」妖将狂笑拍腿，痛快画押！',
            effects: { stones: 1150, contribution: 380, reputation: 45, items: ['yaoshou_neidan', 'bixue_dan'], attrs: { 魅力: 4 } },
          },
          fail: {
            text: '妖将脾气暴躁根本不听绕弯子，摔杯翻脸把你轰出了白骨棚，这单生意险些黄掉。',
            effects: { hp: -35, contribution: 80, attrs: { 道心: 2 } },
          },
        },
      },
      {
        label: '先以武力压住妖将嚣张气焰，再坐下来按公道价签契', hint: '战斗 · 珊瑚妖将同阶妖统领',
        cost: { month: 1 },
        combat: {
          enemy: 'coral_demon',
          win: {
            text: '妖族最敬强者！你三招震麻妖将双爪，它反倒咧嘴大笑敬你烈酒，爽快按万宝阁原价交割全部内丹！',
            effects: { stones: 1050, contribution: 420, reputation: 50, expPct: 0.22, items: ['yaoshou_neidan'] },
          },
          lose: {
            text: '妖将蛮力骇人，震伤你虎口。好在万宝阁暗卫及时亮旗压阵，双方勉强按折中价成交。',
            effects: { hp: -65, stones: 450, contribution: 180 },
          },
        },
      },
      {
        label: '大方让利两成灵石，换取该妖部今后三十年独家皮毛矿脉供货权', hint: '放长线钓大鱼 · 消耗 400 灵石获大功',
        cost: { stones: 400 },
        outcome: {
          text: '妖将见你痛快不抠唆，拍着胸脯立下血誓，今后妖森深处的紫雷矿与内丹只卖给万宝阁一家。总阁传令嘉奖！',
          effects: { contribution: 440, reputation: 45, stones: 900, attrs: { 悟性: 3 } },
        },
      },
    ],
  },
  {
    id: 'wsa_wb_07', title: '活人抵押契', pool: 'sect', tier: 4, weight: 7, minRealm: 2,
    require: 'sect() == "wanbao" && char.sectRank >= 2',
    text: '万宝阁牌匾下刻着一句令九州人又恨又敬的话：「天下没有万宝阁不卖的东西，包括人。」\n\n暴雨夜，一名浑身湿透的年轻女修跪在典当柜台前，颤抖着将一纸「百年卖身死契」推了进来——她身负上品水灵根，只求典当自己百年自由，换一枚九千灵石的救命化婴丹去救垂死师尊。柜台后的白发当官平静望向你：「这笔买卖稳赚十倍，签不签？」',
    choices: [
      {
        label: '撕毁百年死契，改以雇佣供奉契借丹与她，限期以战功炼器还债', hint: '商亦有道 · 业力大涨，结生死忠仆',
        cost: { stones: 600 },
        outcome: {
          text: '女修怔怔看着被撕碎的卖身契，伏地泣不成声。数月后她师尊脱险，师徒二人齐齐入万宝阁客卿堂效力，替你赚回十倍灵石！',
          effects: { karma: 55, reputation: 65, contribution: 440, stones: 1400, demon: -16, attrs: { 道心: 4, 魅力: 3 } },
        },
      },
      {
        label: '按阁规收下死契放丹，将上品灵根人才纳入自己麾下培养', hint: '冷酷商道 · 灵石与宗门贡献大涨',
        outcome: {
          text: '「万宝阁不做善堂，只认契约。」白发当官赞许颔首。这笔买卖记入你的功绩簿，阁主亲批重赏，唯你夜里偶觉袖底血契沉手。',
          effects: { contribution: 520, stones: 1600, karma: -35, demon: 10, attrs: { 气运: 2 } },
        },
      },
      {
        label: '告知她化婴丹治标不治本，指点她改购一瓶冰心丹配大还丹救师', hint: '实诚指路 · 省钱救人得善缘',
        outcome: {
          text: '你一眼看出她师尊症结在于心魔碎丹而非灵气枯竭。女修千恩万谢买走平价对症之药，临走把祖传的一块法则残片硬塞给你作谢礼。',
          effects: { karma: 45, items: ['faze_canpian'], reputation: 50, contribution: 280, attrs: { 悟性: 3, 道心: 3 } },
        },
      },
    ],
  },
  {
    id: 'wsa_wb_08', title: '灵石挤兑潮', pool: 'sect', tier: 4, weight: 6, minRealm: 3,
    require: 'sect() == "wanbao" && char.sectRank >= 2',
    text: '中州谣言一夜沸腾，传闻万宝阁总库在东海沉船亏空千万灵石！天刚蒙蒙亮，上千名修士手攥「万宝通兑玉票」把中州分号围得水泄不通，高喊着立刻兑现上品灵石。\n\n账房面如死灰：库里现存灵石只够应付六成玉票，若是午时前止不住挤兑，不止分号倒闭，连万宝阁百年商信都要崩塌！',
    choices: [
      {
        label: '敞开库门把全部灵石堆成小山摆在街心，同时高息开卖「百年宝券」', hint: '魅力与悟性检定 · 惊天商战逆转危机',
        cost: { month: 1 },
        roll: {
          p: 0.58, attrs: { 魅力: 0.015, 悟性: 0.014 },
          success: {
            text: '人们见灵石堆得像山一样高，又听说此刻不取反而多送一成利息与丹药优先购权，顿时一半人收起玉票、另一半人甚至反手存进更多灵石！危机瞬间化作大捷！',
            effects: { stones: 2400, contribution: 600, reputation: 90, attrs: { 魅力: 4, 悟性: 4 }, items: ['qiankun_jie'] },
          },
          fail: {
            text: '人群里混着敌宗雇来的托儿起哄砸店，虽勉强稳住大半储户，分号还是元气大伤，你贴进去不少私人灵石。',
            effects: { stones: -500, contribution: 260, attrs: { 道心: 3 } },
          },
        },
      },
      {
        label: '派暗卫连夜揪出散播谣言的幕后黑手，当街游示并罚没其家产补库', hint: '铁腕清场 · 战斗（敌宗暗桩：孤鸿剑修）',
        cost: { month: 1 },
        combat: {
          enemy: 'sword_rogue',
          win: {
            text: '你在酒楼雅间生擒背后搅局的世家供奉与三名说客，追出巨额做空赌注当场充库！谣言不攻自破，全城客商拍手称快！',
            effects: { stones: 2100, contribution: 560, reputation: 80, expPct: 0.26, attrs: { 神识: 3 } },
          },
          lose: {
            text: '供奉剑法刁钻将你击伤遁走，好在谣言源头既已曝光，挤兑风潮也随之平息。',
            effects: { hp: -80, contribution: 300, reputation: 35 },
          },
        },
      },
      {
        label: '紧急调出镇阁压箱法宝当街平价拍卖，以珍宝充抵玉票回笼灵石', hint: '壮士断腕 · 稳保商信不倒',
        cost: { month: 1 },
        outcome: {
          text: '三件罕见灵宝一出，挤兑的人群立刻变成了狂热的竞拍客！半日之间非但平息挤兑，账上还多出一大笔流水。',
          effects: { stones: 1200, contribution: 480, reputation: 65, attrs: { 悟性: 3 } },
        },
      },
    ],
  },
  {
    id: 'wsa_wb_09', title: '万宝黑市 · 暗价交易', pool: 'world', tier: 2, weight: 7, minRealm: 1,
    text: '无月之夜，荒岭古渡口忽然亮起十二盏幽蓝灯笼，三艘不挂旗号的万宝阁黑篷船悄然靠岸。船头戴着铜面的执事轻摇铃铛：「子时开市，寅时散场。不问来历，不记姓名，只认灵石与真货。」\n\n摊位上摆着正道坊市绝迹的奇珍，也混着真假难辨的残卷古匣。',
    choices: [
      {
        label: '花 400 灵石淘一枚沾着海泥的无名玉简，赌一把眼力', hint: '消耗 400 灵石 · 气运与神识检定',
        cost: { stones: 400 },
        roll: {
          p: 0.6, attrs: { 气运: 0.014, 神识: 0.012 },
          success: {
            text: '洗净海泥，里头竟藏着半卷完整的上古丹药秘方与一枚珍稀聚灵阵符！血赚！',
            effects: { items: ['juling_zhenfu', 'juling_dan'], expPct: 0.16, attrs: { 气运: 2 } },
          },
          fail: {
            text: '回去一查，里面只录了几篇残缺的杂谈游记，好在封匣的灵玉还能拆下来卖点钱。',
            effects: { stones: 160, attrs: { 悟性: 1 } },
          },
        },
      },
      {
        label: '向铜面执事出售手头多余灵草，顺便打探各宗暗中悬赏', hint: '消耗百年灵草 · 换高价灵石与情报',
        cost: { item: 'lingcao' },
        outcome: {
          text: '黑市收草价竟比寻常坊市高出三倍！铜面执事收下灵草，额外附赠你一条隐藏秘境的传闻线索。',
          effects: { stones: 380, attrs: { 神识: 2, 气运: 2 }, exp: 280 },
        },
      },
      {
        label: '只逛不买，细观黑市各方势力的暗号手势增长见闻', hint: '空手白嫖见识 · 悟性与神识微升',
        outcome: {
          text: '你在灯影里认出了合欢宗的暗香、幽冥鬼道的鬼币与机关城的铜牌，对九州地下商网有了全新认知。',
          effects: { attrs: { 神识: 2, 悟性: 2 }, exp: 240 },
        },
      },
    ],
  },
  {
    id: 'wsa_wb_10', title: '商道无正邪 · 军火走私', pool: 'world', tier: 4, weight: 6, minRealm: 2,
    text: '北荒前线正魔战火方酣，你却在峡谷暗道撞见一支挂着万宝阁暗旗的秘密商队——十辆铁车装得满满当当，前五车是运给青云门的破邪雷符，后五车竟是运给血魔宗的嗜血玄铁刀！\n\n领队管事笑呵呵迎上来拱手：「这位道友，万宝阁只做买卖，不问正邪。这十车货你没看见，这袋灵石便是封口茶钱——如何？」',
    choices: [
      {
        label: '冷笑拔剑烧毁运往血魔宗的后五车魔器，绝不助纣为虐', hint: '正义凛然 · 战斗（护商金丹客卿：孤鸿剑修）',
        combat: {
          enemy: 'sword_rogue',
          win: {
            text: '烈焰吞没魔器铁车！万宝阁管事铁青着脸率残部仓皇逃走。此事传到正道大营，诸宗对你大加赞赏，赠你正道厚礼。',
            effects: { karma: 50, reputation: 65, expPct: 0.24, items: ['zhangxin_leifu', 'dahuan_dan'] },
          },
          lose: {
            text: '商队护卫出手极狠，你受了伤仍毁掉两车魔刃，虽结怨万宝阁，胸中正气却毫不弯折。',
            effects: { hp: -65, karma: 30, reputation: 30, attrs: { 道心: 3 } },
          },
        },
      },
      {
        label: '收下封口灵石，并趁机按成本价挑走两件上好护身宝物', hint: '实利至上 · 巨额灵石与法宝，略损业力',
        outcome: {
          text: '「识时务者为俊杰。」管事眉开眼笑塞给你一袋沉甸甸的灵石和一面玄武墨盾，商队悄无声息消失在峡谷暮色里。',
          effects: { stones: 1100, items: ['xuanwu_dun'], karma: -25, demon: 5 },
        },
      },
      {
        label: '既不收钱也不烧车，只记下两批货的交接时间转卖给正魔双方情报网', hint: '比万宝阁更懂生意 · 魅力与气运检定',
        roll: {
          p: 0.54, attrs: { 魅力: 0.014, 气运: 0.012 },
          success: {
            text: '你两头卖消息赚得盆满钵满，还顺手让两批军火在半路撞成一团乱麻，自己早已脱身千里之外。',
            effects: { stones: 1500, attrs: { 悟性: 3, 气运: 2 }, karma: -10 },
          },
          fail: {
            text: '消息漏得太快，两边都没给钱反倒派人查你底细，只好赶紧用神行符溜之大吉。',
            effects: { reputation: -15, attrs: { 气运: 1 } },
          },
        },
      },
    ],
  },
  {
    id: 'wsa_wb_11', title: '东海沉宝拍', pool: 'world', tier: 4, weight: 6, minRealm: 3,
    text: '万宝阁在东海巨鲸岛举办十年一度的「沉宝大拍」，整座珊瑚海宫灯火如昼，十三宗门代表、归墟海族长老与无名散仙齐聚一堂。\n\n压轴拍品揭开红绸——竟是一块沾染上古仙气的法则残片与半瓶太虚炼神丹！拍卖台下叫价声此起彼伏，灵石如流水般翻滚。',
    choices: [
      {
        label: '豪掷 1600 灵石参与竞拍，压下全场拿下压轴法则残片', hint: '消耗 1600 灵石 · 必得顶级重宝',
        cost: { stones: 1600 },
        outcome: {
          text: '三声铜锤落定！全场目光聚焦于你所在的包厢，你从容收下法则残片与太虚灵丹，财力与气度令海内外群修侧目！',
          effects: { items: ['faze_canpian', 'lianxu_dan'], reputation: 80, attrs: { 魅力: 3 } },
        },
      },
      {
        label: '不拼灵石，借拍卖会间隙以物易物换取稀有奇珍', hint: '精明淘货 · 气运与魅力检定',
        roll: {
          p: 0.58, attrs: { 魅力: 0.014, 气运: 0.012 },
          success: {
            text: '你在偏厅遇到一位急需灵石的东海散修，花极小代价便换到一颗罕见的沧海定水珠与一瓶养神丹！',
            effects: { items: ['canghai_zhu', 'yangshen_dan'], stones: 300, attrs: { 气运: 2 } },
          },
          fail: {
            text: '海宫里人精遍地，你转了一圈没占到便宜，倒也白蹭了一顿极鲜的东海灵鱼宴。',
            effects: { hpPct: 0.3, mpPct: 0.3, attrs: { 魅力: 1 } },
          },
        },
      },
      {
        label: '在包厢静观十三宗门竞价暗流，摸清各宗真正紧缺的命门', hint: '洞察九州格局 · 悟性与神识大进',
        cost: { month: 1 },
        outcome: {
          text: '谁在狂扫雷击木、谁在暗收九幽冥晶、谁囊中羞涩——一场拍卖会看下来，九州未来十年的风向已被你尽收眼底。',
          effects: { expPct: 0.22, attrs: { 神识: 4, 悟性: 3 }, lawExp: 32, lawId: 'karma' },
        },
      },
    ],
  },
  {
    id: 'wsa_wb_c1', title: '万宝总账 · 验资启匣', pool: 'sect', tier: 4, weight: 7, minRealm: 2,
    require: 'sect() == "wanbao"',
    once: true,
    text: '三十六号暗库最深处的玄铁石门今夜为你一人敞开。白发大阁主端坐鎏金算盘之后，面前摆着一本以蛟龙皮装帧的《九州万宝总账》——里面记着十三宗门欠下万宝阁的所有隐秘人情、灵脉抵押与古宝去向。\n\n阁主轻推算盘：「想接掌总账副印，先按老规矩『验资』——拿出你最值钱的筹码押在柜台，敢不敢赌自己走出这间库房？」',
    choices: [
      {
        label: '押上 800 灵石与半身声望作保，昂首接过总账副印', hint: '消耗 800 灵石 · 豪气验资入二关',
        cost: { stones: 800, month: 1 },
        outcome: {
          text: '阁主眼中闪过赞赏：「财散人聚，连本钱都不敢押的，成不了大掌柜。」石壁滑开，露出一条刻满空间封锁铭文的暗账密道。',
          effects: { contribution: 300, attrs: { 魅力: 3, 气运: 2 }, flag: { 验资豪押: true } },
          goto: 'wsa_wb_c2',
        },
      },
      {
        label: '不押灵石，反将自己此生一道大道因果誓言押上柜台', hint: '道心与魅力检定 · 空手套白狼',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 魅力: 0.015, 道心: 0.012 },
          success: {
            text: '「灵石有价，一位未来化神大修的诺言无价！」阁主拍案大笑，竟真的收下你的口头道誓，推开了暗账密道！',
            effects: { contribution: 340, lawExp: 28, lawId: 'karma', attrs: { 魅力: 4, 道心: 2 }, flag: { 验资豪押: true } },
            goto: 'wsa_wb_c2',
          },
          fail: {
            text: '阁主嗤笑一声：「空话谁不会说？先欠着五百灵石利息吧。」虽丢了点面子，他终究还是放你进了密道。',
            effects: { contribution: 120, attrs: { 悟性: 2 } },
            goto: 'wsa_wb_c2',
          },
        },
      },
      {
        label: '权衡利弊后婉拒副印，只做个自由自在的金牌掌柜', hint: '稳健退步 · 错失总账传承',
        outcome: {
          text: '阁主淡淡收起总账：「不贪大权，倒也长命。」顺手分你一笔年终分红。',
          effects: { stones: 500, contribution: 160 },
        },
      },
    ],
  },
  {
    id: 'wsa_wb_c2', title: '万宝总账 · 暗账追魂', pool: 'branch', tier: 5, weight: 0,
    text: (s) => `踏入总账密道，万千悬空玉简竟齐齐震颤！原来三百年前一笔被赖掉的「鬼道巨债」化作一道索命阴契反噬总库，一尊披着黑链的「九幽勾魂使」正从总账裂缝里踏出，冷喝道：「三百年前你们万宝阁卖了阴司一座灵矿，今日连本带利拿守库人的魂来抵！」\n\n${s.flags['验资豪押'] ? '你掌心的总账副印金光大盛，调动三十六号暗库全部禁制为你助阵！' : '副印微弱闪烁，你只能凭真本事扛住这笔百年死账！'}`,
    choices: [
      {
        label: '亮出镇库兵刃正面击溃勾魂使，用实力告诉阴司谁才是债主', hint: '硬仗 · 九幽勾魂使',
        cost: { month: 1 },
        combat: {
          enemy: 'soul_reaper',
          win: {
            text: '锁魂铁链被你硬生生斩断！勾魂使骇然退回阴裂，那笔三百年的鬼账当场勾销，暗库深处的「乾坤通宝殿」大门轰然开启！',
            effects: { expPct: 0.28, stones: 1800, lawExp: 40, lawId: 'space', attrs: { 根骨: 3, 魅力: 2 }, flag: { 暗账销魂: true } },
            goto: 'wsa_wb_c3',
          },
          lose: {
            text: '阴司锁链抽得你神魂剧痛，好在紧急激发总库护阵将勾魂使逼退，虽挂重彩，总算守住了总账未毁。',
            effects: { hp: -75, mp: -50, attrs: { 道心: 3 }, lawExp: 20, lawId: 'karma' },
            goto: 'wsa_wb_c3',
          },
        },
      },
      {
        label: '翻开总账细查三百年前原契漏洞，以商法因果反将勾魂使一军', hint: '悟性与魅力检定 · 一张嘴逼退阴差',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 悟性: 0.015, 魅力: 0.014 },
          success: {
            text: '你指着账页冷笑：「契上写明甲子年交割，可当年阴司自己迟交了三百斤冥晶！真要算复利，是你们九幽欠我们万宝阁八万灵石！」勾魂使算盘一拨竟哑口无言，仓皇遁走！',
            effects: { expPct: 0.26, stones: 2200, lawExp: 48, lawId: 'karma', attrs: { 悟性: 4, 魅力: 4 }, flag: { 暗账销魂: true } },
            goto: 'wsa_wb_c3',
          },
          fail: {
            text: '勾魂使不吃文绉绉那一套，挥链扫伤你的肩头，最后你只得丢出一批库藏冥晶勉强打发走了这位瘟神。',
            effects: { hp: -55, stones: -300, lawExp: 20, lawId: 'karma' },
            goto: 'wsa_wb_c3',
          },
        },
      },
    ],
  },
  {
    id: 'wsa_wb_c3', title: '万宝总账 · 九州通宝', pool: 'branch', tier: 5, weight: 0,
    text: (s) => `乾坤通宝殿中既无金银也无俗玉，唯有中央悬着一杆以天外玄星打造的「九州因果秤」。秤盘一端盛着天下灵石灵宝，另一端空无一物。\n\n${s.flags['暗账销魂'] ? '大阁主步入殿中抚掌长笑：「算得清利，镇得住鬼，九州通宝之脉后继有人了！」' : '大阁主轻抚铜秤：「商道极处，秤的早已不是灵石，而是人心与气运。」'}`,
    choices: [
      {
        label: '以九州商路为脉、乾坤戒为库，承接「万宝执秤」大权', hint: '海量灵石、乾坤须弥戒与称号',
        cost: { month: 1 },
        outcome: {
          text: '因果秤微微一倾，万道金辉没入你识海！从此九州十三宗但凡大宗交易，皆须过你掌心一秤。你手握海量财源与须弥空间，仙途再无资粮之忧！',
          effects: { expPct: 0.34, stones: 6800, lawExp: 80, lawId: 'space', attrs: { 魅力: 5, 气运: 5 }, contribution: 680, reputation: 95, items: ['qiankun_jie'], title: '万宝执秤', flag: { 万宝通脉: true } },
        },
      },
      {
        label: '借因果秤参悟万物流通与等价交换之大道至理', hint: '因果法则大成 · 悟性与气运登峰',
        cost: { month: 1 },
        outcome: {
          text: '你骤然看透世间万物皆可交易、一切机缘皆有代价。天地法则在你眼中宛如清晰账本，破境与修为一路畅通无阻！',
          effects: { expPct: 0.36, stones: 3600, lawExp: 88, lawId: 'karma', attrs: { 悟性: 5, 气运: 4, 神识: 3 }, contribution: 600, reputation: 85, items: ['faze_canpian', 'dao_fruit'], title: '万宝执秤', flag: { 万宝通脉: true } },
        },
      },
    ],
  },

  /* ========================================================================
   * 八、万兽山（wanshou · 14 节点）
   * 风味：兽骨拱门、不许用强而契兽、百兽谷惊潮、孵化古卵、猎兽盗团、祖兽古陵三段链
   * ======================================================================== */
  {
    id: 'wsa_ws_01', title: '草滩惊潮', pool: 'sect', tier: 2, weight: 8, minRealm: 0,
    require: 'sect() == "wanshou"',
    text: '立秋清晨，朔川草滩地底突然发出一声沉闷地鸣，裂隙里冒出刺鼻硫磺黑烟！部里圈养的三百头半驯灵兽瞬间红了眼，铁甲猪、青背狼、独角灵鹿乱作一团，卷起漫天烟尘直冲营地木栅！\n\n一旦兽潮冲破营栅，牧道下游两个凡人屯子瞬间便会化作废墟。部族长老的骨笛在狂风里吹得嘶哑，却压不住最前头那头狂躁领头兽！',
    choices: [
      {
        label: '纵身拦在兽潮正前方，吹响安魂骨哨并与领头妖兽以血脉共鸣', hint: '根骨与魅力检定 · 化狂潮为静谧',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 根骨: 0.012, 魅力: 0.012 },
          success: {
            text: '狂奔的铁蹄就在你鼻尖三尺处硬生生刹住！你伸手抚上领头兽滚烫的额头，渡去一缕温和木灵气。一声低沉兽鸣传遍草滩，三百灵兽竟齐齐调头退回安全草坡！',
            effects: { expPct: 0.16, contribution: 220, karma: 25, attrs: { 根骨: 2, 魅力: 2 }, lifespan: 8 },
          },
          fail: {
            text: '领头妖兽已被黑烟熏疯，一肩膀将你撞飞数丈摔进灌木丛。好在你这一拦拖住了三息，让长老及时落下了封营木闸。',
            effects: { hp: -45, contribution: 110, attrs: { 根骨: 2 } },
          },
        },
      },
      {
        label: '出手擒王，正面硬撼领头铁甲妖猪迫使兽群止步', hint: '战斗 · 铁甲妖猪',
        combat: {
          enemy: 'beast',
          win: {
            text: '你赤手按住妖猪獠牙将其掀翻在泥潭！群兽见王被制，顿时畏缩停步。部族长老擦着汗赞你筋骨够硬，赏你灵兽内丹。',
            effects: { expPct: 0.18, contribution: 240, items: ['yaoshou_neidan'], attrs: { 根骨: 3 } },
          },
          lose: {
            text: '妖猪皮糙肉厚把你顶得肋骨生疼，幸得部里几名骑手齐放捆兽索才稳住局面。',
            effects: { hp: -50, contribution: 90, attrs: { 根骨: 1 } },
          },
        },
      },
      {
        label: '急奔地裂烟口投掷灵草与清毒药粉，先断掉惊兽的硫磺源头', hint: '治本止潮 · 消耗百年灵草',
        cost: { item: 'lingcao' },
        outcome: {
          text: '清凉药气盖过刺鼻黑烟，不出半刻钟狂躁兽群便渐渐清醒过来。长老夸你懂得照看兽性根本，而非一味打杀。',
          effects: { contribution: 230, karma: 20, attrs: { 悟性: 2, 道心: 2 }, lifespan: 6 },
        },
      },
    ],
  },
  {
    id: 'wsa_ws_02', title: '古兽遗卵', pool: 'sect', tier: 3, weight: 8, minRealm: 1,
    require: 'sect() == "wanshou"',
    text: '清理草滩边的温泉泥沼时，你摸出一枚足有石磨大小的灰褐色巨卵。卵壳布满龟裂纹路，贴耳细听，里头竟传来极缓慢、却如闷雷般的心跳声。\n\n部里驯鹰的老翁端详了半晌，啧啧称奇：「这颗卵少说埋了五百年，生机只剩游丝，怕是孵化不出个全须全尾的小东西。养，费灵草灵血；扔，又可惜了这点太古血脉。」',
    choices: [
      {
        label: '日夜以自身灵力与温热灵草泥精心孵养两月，赌它破壳新生', hint: '消耗百年灵草与时间 · 气运与根骨检定',
        cost: { item: 'lingcao', month: 2 },
        roll: {
          p: 0.6, attrs: { 气运: 0.014, 根骨: 0.01 },
          success: {
            text: '咔嚓一声脆响！一头通体赤鳞、额生细角的幼兽顶破卵壳，湿漉漉地蹭了蹭你的掌心！它吐出一口先天灵雾反哺于你，筋骨与寿元大涨！它额上蜕下的那截玉色胎角，你收了起来。',
            effects: { expPct: 0.22, lifespan: 20, attrs: { 根骨: 4, 气运: 2 }, contribution: 300, items: ['qilin_jiao'], flag: { 古兽破壳: true } },
          },
          fail: {
            text: '两月苦守后，卵内微弱心跳终究还是停了。你将卵壳磨粉配药，倒也炼出一炉极滋补筋骨的锻骨药膏。',
            effects: { attrs: { 根骨: 2 }, lifespan: 8, contribution: 120 },
          },
        },
      },
      {
        label: '直接将古卵上交部族长老，换取部里的重赏', hint: '稳妥落袋 · 贡献与灵石兼得',
        outcome: {
          text: '部族长老大喜过望，称卵壳铭文蕴含太古龙象遗韵，当场批了厚厚一笔贡献与锻骨龙象丹。',
          effects: { contribution: 280, stones: 400, items: ['duangu_dan'] },
        },
      },
      {
        label: '临摹卵壳天然太古血纹，悟出以气血淬体之妙', hint: '借物悟道 · 血海法则与根骨提升',
        cost: { month: 1 },
        outcome: {
          text: '你对着巨卵上的苍莽纹路参详一月，气血奔涌竟隐有龙吟象鸣之象！',
          effects: { expPct: 0.16, lawExp: 24, lawId: 'blood', attrs: { 根骨: 3, 悟性: 1 }, contribution: 150 },
        },
      },
    ],
  },
  {
    id: 'wsa_ws_03', title: '驯服倔强灵猿', pool: 'sect', tier: 2, weight: 8, minRealm: 1,
    require: 'sect() == "wanshou"',
    text: '万兽山入门铁律：契兽不许用强。可后崖桃林里新来了一头通臂白猿，脾气犟得像块茅坑石头——三天打跑了五个想强行下契的内门弟子，还把戒律师兄的道冠挂上了最高松枝。\n\n白猿蹲在青石上啃着野桃，朝你龇牙咧嘴比划拳头，分明是在挑衅。',
    choices: [
      {
        label: '卸去法器空手跃上青石，与白猿堂堂正正肉搏百招赢它敬重', hint: '战斗 · 通臂灵猿',
        cost: { month: 1 },
        combat: {
          enemy: 'spirit_ape',
          win: {
            text: '拳拳到肉打到夕阳西下，白猿抹了把嘴角，竟咧嘴大笑递来半颗最甜的灵桃！从此它常跟在你身后练拳，助你筋骨日渐精进。',
            effects: { expPct: 0.2, attrs: { 根骨: 4 }, contribution: 260, reputation: 30, lifespan: 10 },
          },
          lose: {
            text: '白猿双臂如铁把你摔进桃树堆，却并未下狠手，反倒丢给你一颗青桃嘲笑。你揉着青肿爬起来，筋骨竟比先前耐打了不少。',
            effects: { hp: -45, attrs: { 根骨: 2, 道心: 1 }, contribution: 100 },
          },
        },
      },
      {
        label: '不打不哄，搬一坛烈猴儿酒坐在十丈外自斟自饮，任它自己凑过来', hint: '魅力与道心检定 · 不强求而自契',
        cost: { stones: 120, month: 1 },
        roll: {
          p: 0.6, attrs: { 魅力: 0.014, 道心: 0.01 },
          success: {
            text: '才喝到第三碗，白猿终究没忍住酒香溜下石崖，一屁股坐你对面抢过酒坛痛饮！一人一猿醉倒桃林，醒来时白猿已悄悄递出一缕本命眉心毛。',
            effects: { contribution: 280, attrs: { 魅力: 3, 根骨: 2 }, lifespan: 12, expPct: 0.16, items: ['peiyuan_dan'] },
          },
          fail: {
            text: '白猿趁你打盹连酒坛带果子一锅端跑上树梢，气得你哭笑不得。',
            effects: { attrs: { 道心: 2 }, contribution: 70 },
          },
        },
      },
      {
        label: '帮它拔掉左掌掌心暗藏的一截陈年毒刺，解其隐痛', hint: '神识检定 · 仁心结兽缘',
        roll: {
          p: 0.58, attrs: { 神识: 0.014, 悟性: 0.01 },
          success: {
            text: '原来白猿性情暴躁是因为掌心扎了猎兽者的断毒针！你替它挑刺敷药，这头傲气灵猿竟低头舔了舔你的手背，捧来一株藏在洞里的千年灵草。',
            effects: { karma: 30, items: ['qiannian_lingcao'], contribution: 260, attrs: { 神识: 2, 魅力: 2 } },
          },
          fail: {
            text: '你刚靠近它左掌便遭一巴掌拍开，野兽防心极重，只得慢慢图之。',
            effects: { hp: -25, contribution: 80 },
          },
        },
      },
    ],
  },
  {
    id: 'wsa_ws_04', title: '猎兽盗团夜袭', pool: 'sect', tier: 3, weight: 8, minRealm: 1,
    require: 'sect() == "wanshou"',
    text: '残月如钩，育兽谷外围警铃骤响！一伙装备着铁网与麻醉毒弩的猎兽盗团竟敢摸上万兽山，专挑刚产崽的灵狐与幼麟下手，欲活剖内丹卖往中州黑市！\n\n血腥味混着幼兽哀鸣飘过松林，万兽山上下最恨的便是这种剥皮拆骨的盗猎恶徒！',
    choices: [
      {
        label: '怒吹猎杀骨号，率同门灵兽正面撕碎盗团防线', hint: '恶战 · 断魂刀客（盗团头目）',
        cost: { month: 1 },
        combat: {
          enemy: 'blade_rogue',
          win: {
            text: '漫山妖啸如潮，你一举斩杀盗团首领、劈开囚笼救出十二只幼兽！母兽们哀鸣转为欢啸，山门长老重赏贡献与灵石。',
            effects: { expPct: 0.22, karma: 35, contribution: 320, reputation: 45, stones: 460, items: ['bixue_dan'] },
          },
          lose: {
            text: '毒弩暗箭伤及你大腿，你咬牙挡在幼兽笼前寸步不退，终等来兽堂长老带巨熊碾碎贼众。',
            effects: { hp: -60, injury: 1, karma: 25, contribution: 180 },
          },
        },
      },
      {
        label: '潜行绕后割断盗团退路吊索，再放迷瘴草烟瓮中捉鳖', hint: '悟性与神识检定 · 零伤亡全歼',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 悟性: 0.014, 神识: 0.012 },
          success: {
            text: '盗团刚想扛笼逃窜，却发现山道早被毒藤封死！一伙恶徒束手就擒，缴获的赃款与灵材全数归你处置。',
            effects: { stones: 620, contribution: 340, karma: 30, attrs: { 悟性: 2, 神识: 2 }, items: ['xuantie'] },
          },
          fail: {
            text: '盗团放火烧林借烟遁走，虽救下了全部幼兽，未能把这帮畜生彻底留住。',
            effects: { contribution: 180, karma: 20 },
          },
        },
      },
      {
        label: '留盗团副手一条活口，严审出中州黑市买家名单呈报宗门', hint: '追根溯源 · 绝后患获大功',
        outcome: {
          text: '万兽山凭你审出的名单直接派长老踏平了两家黑市商行，此后十年无人再敢打万兽山幼兽的主意！',
          effects: { contribution: 300, reputation: 50, karma: 25, stones: 350 },
        },
      },
    ],
  },
  {
    id: 'wsa_ws_05', title: '寻回走失幼崽', pool: 'sect', tier: 2, weight: 7, minRealm: 1,
    require: 'sect() == "wanshou"',
    text: '万兽山镇山神兽「紫电灵豹」昨夜丢了一只刚满月的小豹崽！老豹急得在兽骨拱门前团团打转，喉间雷鸣滚滚，吓得外门弟子谁也不敢靠近。\n\n你在山涧泥地上发现了几枚梅花状焦黑小脚印，一路延伸进雾气森森的裂风竹谷。',
    choices: [
      {
        label: '循着焦痕深入竹谷，从毒蟒口下抢回浑身发抖的小雷豹', hint: '战斗 · 碧磷毒蟒',
        combat: {
          enemy: 'poison_python',
          win: {
            text: '你劈开毒蟒缠绕，一把捞起炸毛的小豹崽送回兽骨门！紫电灵豹低头在你掌心轻轻一蹭，竟吐出一截珍贵雷击木相报！',
            effects: { items: ['leimu', 'biling_yu'], contribution: 280, reputation: 35, karma: 25, expPct: 0.18 },
          },
          lose: {
            text: '毒雾灼伤你的手臂，你拼着硬挨一尾扫击抱起小豹跃出竹谷，险险交还母豹。',
            effects: { hp: -50, contribution: 200, items: ['jiexin_dan'], karma: 20 },
          },
        },
      },
      {
        label: '模仿幼豹奶声轻啸，悄然将贪玩躲在岩缝里的豹崽引出来', hint: '魅力与气运检定 · 零冲突寻回',
        roll: {
          p: 0.6, attrs: { 魅力: 0.014, 气运: 0.012 },
          success: {
            text: '小豹崽听见动静一蹦一跳钻出岩洞，还叼着一株不知从哪刨来的灵草！母豹见子归来欣喜若狂，赏你一道温润雷意洗脉。',
            effects: { lawExp: 20, lawId: 'thunder', items: ['qiannian_lingcao'], contribution: 240, attrs: { 魅力: 2 } },
          },
          fail: {
            text: '学得太像反倒引来了两头觅食的山狼，一番缠斗后好不容易才把吓傻的小豹抱回山门。',
            effects: { hp: -25, contribution: 160, attrs: { 根骨: 1 } },
          },
        },
      },
      {
        label: '回山邀兽堂同门结伴搜谷，稳妥起见平分功劳', hint: '协作稳进 · 稳赚贡献与人缘',
        outcome: {
          text: '五名同门撒开大网半日便寻回了贪玩的豹崽，虽贡献平分，倒也结交了几位靠谱师兄弟。',
          effects: { contribution: 150, attrs: { 魅力: 1 }, exp: 280 },
        },
      },
    ],
  },
  {
    id: 'wsa_ws_06', title: '兽王谈判', pool: 'sect', tier: 3, weight: 7, minRealm: 2,
    require: 'sect() == "wanshou" && char.sectRank >= 1',
    text: '万兽山虽御万兽，却从未妄想统治妖森深处的真正大妖。入冬食少，黑风谷的一头元婴境妖王领着群妖压至兽骨拱门外三里，咆哮着要求万兽山交出东坡十里灵果林过冬。\n\n山主闭关未出，长老们商议不休——硬打，两败俱伤便宜了虎视眈眈的正魔大宗；白给，万兽山颜面扫地。你主动请缨出骨门与兽王一谈。',
    choices: [
      {
        label: '孤身提一坛百年灵果酿出骨门，以互保灵脉之约说动兽王共防盗猎', hint: '魅力与道心检定 · 化敌为盟',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 魅力: 0.015, 道心: 0.012 },
          success: {
            text: '兽王铜铃巨目盯着你丝毫不怯的双眼，忽然仰天长啸：「万兽山总算出了个带种的崽！」双方立约共享三成冬果，黑风群妖反过来替万兽山巡守北界！',
            effects: { contribution: 420, reputation: 60, attrs: { 魅力: 4, 道心: 3 }, lifespan: 15, items: ['duangu_dan'] },
          },
          fail: {
            text: '兽王一爪拍碎酒坛震退你十步，只冷哼着丢下一句「十日后我再来讨说法」便撤回深林。',
            effects: { hp: -45, contribution: 160, attrs: { 道心: 2 } },
          },
        },
      },
      {
        label: '向兽王麾下金丹先锋发起兽道斗战，打服妖群再议界碑', hint: '战斗 · 裂云雷鹏',
        cost: { month: 1 },
        combat: {
          enemy: 'thunder_roc',
          win: {
            text: '你生生撕裂雷鹏风幕将其震落尘埃！兽王见万兽山真传战力惊人，收敛爪牙，只讨了两筐疗伤灵药便心满意足退兵。',
            effects: { expPct: 0.25, contribution: 450, reputation: 65, attrs: { 根骨: 3 }, items: ['yaoshou_neidan'] },
          },
          lose: {
            text: '雷鹏双爪抓裂你的护甲，你浴血死战不退半步，兽王敬你血性，终究没再逼迫万兽山割林。',
            effects: { hp: -70, injury: 1, contribution: 240, reputation: 30, attrs: { 根骨: 2 } },
          },
        },
      },
      {
        label: '以谷中多余灵草与玄铁矿石折价换停战，不沾一滴血', hint: '消耗 350 灵石 · 务实息争',
        cost: { stones: 350 },
        outcome: {
          text: '兽王领着满载冬粮与疗伤草的妖群退回黑风谷，山门免了一场腥风血雨。',
          effects: { contribution: 300, karma: 20, attrs: { 悟性: 2 } },
        },
      },
    ],
  },
  {
    id: 'wsa_ws_07', title: '血脉返祖阵', pool: 'sect', tier: 4, weight: 7, minRealm: 2,
    require: 'sect() == "wanshou" && char.sectRank >= 2',
    text: '万兽山核心秘术「血脉返祖」凶险无比——须将灵兽置于上古兽骨祭坛中央，以精血与灵药激发其潜藏的太古洪荒血脉。一旦成功，灵兽脱胎换骨；稍有不慎，便会爆体疯魔。\n\n今日轮到你为一名重伤频危、却仍不肯认命的老契兽主持返祖大阵。老兽目光浑浊却倔强地望着你，将性命全然相托。',
    choices: [
      {
        label: '投入龙血精温和引动太古血脉，以自身神识护住老兽灵智', hint: '消耗龙血精 · 必成返祖奇迹',
        cost: { item: 'longxue_jing', month: 1 },
        outcome: {
          text: '赤金血雾冲天而起！老兽枯槁皮毛尽数脱落，竟化出一头威风凛凛的赤鳞瑞兽！它反哺你一缕太古生机，连带着你对血海与混沌大道都有了惊人感悟！',
          effects: { expPct: 0.28, lifespan: 40, lawExp: 45, lawId: 'blood', attrs: { 根骨: 4, 道心: 3 }, contribution: 500, reputation: 65 },
        },
      },
      {
        label: '引自身三成气血入阵共担反噬之痛，硬扛返祖血雷', hint: '根骨与道心检定 · 患难同契',
        cost: { hp: 50, month: 1 },
        roll: {
          p: 0.58, attrs: { 根骨: 0.014, 道心: 0.012 },
          success: {
            text: '你与老兽气血相连，在狂暴兽威里咬牙挺过七个时辰！一声震谷长啸后老兽重获新生，万兽山众长老无不肃然起敬！',
            effects: { expPct: 0.26, lifespan: 25, lawExp: 38, lawId: 'blood', attrs: { 根骨: 4, 道心: 3 }, contribution: 460, reputation: 55 },
          },
          fail: {
            text: '返祖血雷反噬震碎祭坛一角，虽没能让老兽彻底蜕变，总算保住了它一条性命与半数生机。',
            effects: { hp: -65, contribution: 200, attrs: { 根骨: 2 } },
          },
        },
      },
      {
        label: '改启温和养命阵放弃强行返祖，保老兽安度百年余生', hint: '慈悲护生 · 业力与寿元增长',
        outcome: {
          text: '老兽似乎听懂了你的心意，温顺地伏在祭坛蹭着你的膝头。虽未惊天动地，你却悟得万兽契最质朴的本心。',
          effects: { karma: 40, demon: -16, lifespan: 18, contribution: 260, attrs: { 道心: 3 } },
        },
      },
    ],
  },
  {
    id: 'wsa_ws_08', title: '兽骨门誓', pool: 'sect', tier: 4, weight: 6, minRealm: 3,
    require: 'sect() == "wanshou" && char.sectRank >= 2',
    text: '北荒正魔大战胶着，正道联军竟遣来一队全副武装的使团堵在万兽山兽骨拱门外，傲慢宣读盟令：「大敌当前，万兽山须即刻交出五百头三阶灵兽充作前线冲阵炮灰，违者视同通魔！」\n\n拱门之内，成百上千头通灵异兽发出愤怒低吼，万兽山弟子个个眼眶发红——灵兽是同生死共呼吸的伙伴，岂能当牲口送去填刀口！',
    choices: [
      {
        label: '踏出兽骨拱门，一战震退趾高气扬的联军元婴督战使', hint: '硬仗 · 妖将同阶（联军元婴督战使：血衣剑尊战力）',
        cost: { month: 1 },
        combat: {
          enemy: 'crimson_sword',
          win: {
            text: '你携百兽啸音一拳轰碎督战使护体剑罡，冷声喝道：「万兽山愿派弟子与伙伴并肩抗魔，但谁敢把我们的伙伴当炮灰，先问过这扇兽骨门！」使团灰溜溜撤退，全山弟子振臂高呼！',
            effects: { expPct: 0.3, contribution: 580, reputation: 90, karma: 35, attrs: { 根骨: 4, 道心: 4 }, items: ['qilin_jiao'] },
          },
          lose: {
            text: '你浴血倒在骨门石阶前，百兽齐齐冲出挡在你身前怒视使团！联军见激怒万兽山必酿大祸，终究不敢强抢，收回狂言退去。',
            effects: { hp: -90, injury: 2, contribution: 360, reputation: 55, attrs: { 道心: 4 } },
          },
        },
      },
      {
        label: '当众提出万兽山愿率真传与契兽组成独立突击队参战，但绝不交兽权', hint: '不卑不亢 · 魅力与道心检定',
        cost: { month: 1 },
        roll: {
          p: 0.58, attrs: { 魅力: 0.015, 道心: 0.012 },
          success: {
            text: '你一番话有理有节、既保大义又护尊严，使团无从发作只得应允！战后万兽山独立战功赫赫，从此九州无人敢轻慢御兽一脉。',
            effects: { contribution: 520, reputation: 80, karma: 35, stones: 900, attrs: { 魅力: 4, 道心: 3 } },
          },
          fail: {
            text: '使团死咬盟令不松口，双方在山门僵持半月，直到青云掌门亲自传书调停才算收场。',
            effects: { contribution: 260, reputation: 25, attrs: { 道心: 2 } },
          },
        },
      },
      {
        label: '封山开启百兽护山大阵，宣布万兽山中立不涉正魔纷争', hint: '彻底中立 · 护全山安宁',
        outcome: {
          text: '万兽咆哮震彻苍茫妖森，兽骨拱门轰然闭合。纵使外界议论纷纷，山中万千生灵却得以安然度过战火。',
          effects: { contribution: 340, lifespan: 20, demon: -12, attrs: { 道心: 3 } },
        },
      },
    ],
  },
  {
    id: 'wsa_ws_09', title: '妖森借道 · 御兽客', pool: 'world', tier: 2, weight: 7, minRealm: 1,
    text: '深入苍茫妖森采药时，雾林里突然窜出一头雪白巨狼挡住去路，狼背上却坐着一名嘴里叼着草根的万兽山年轻御兽客。\n\n他拍拍狼头朝你扬手：「前边三里是赤尾妖王的产崽地，外人闯进去九死一生。想绕道还是想捡它蜕下的妖皮？给十块灵石买路，或者陪我这大白练两手！」',
    choices: [
      {
        label: '痛快抛给他 100 灵石请教安全捷径与妖森灵药点位', hint: '消耗 100 灵石 · 省险得宝',
        cost: { stones: 100 },
        outcome: {
          text: '御兽客笑呵呵接过灵石，领你钻过一条隐秘兽道，不仅避开妖王领地，还顺手采到一株百年灵草与几颗灵果。',
          effects: { items: ['lingcao', 'peiyuan_dan'], attrs: { 气运: 2 }, exp: 280 },
        },
      },
      {
        label: '哈哈大笑卸兵上前，与雪白巨狼切磋筋骨', hint: '战斗 · 通臂灵猿同阶灵兽（雪狼）',
        combat: {
          enemy: 'spirit_ape',
          win: {
            text: '巨狼被你几招按住后颈，委屈地呜咽一声。御兽客惊叹你体魄强悍，爽快送你一枚妖兽内丹结交朋友！',
            effects: { expPct: 0.18, items: ['yaoshou_neidan'], attrs: { 根骨: 3 }, reputation: 25 },
          },
          lose: {
            text: '巨狼扑击极快将你掀翻草地，御兽客吹哨唤回灵狼，丢来一瓶伤药笑道：「下次练硬了再来！」',
            effects: { hp: -40, items: ['liaoshang_dan'], attrs: { 根骨: 2 } },
          },
        },
      },
      {
        label: '拱手谢过提醒，顺着他指的南坡原路绕行', hint: '谨慎自保 · 平安无事',
        outcome: {
          text: '多一事不如少一事，你按他所指安全走出雾林，省下一场无妄之灾。',
          effects: { attrs: { 道心: 1, 神识: 1 }, exp: 200 },
        },
      },
    ],
  },
  {
    id: 'wsa_ws_10', title: '妖潮合围 · 万兽与青云', pool: 'world', tier: 4, weight: 6, minRealm: 2,
    text: '妖森外缘的落枫谷正上演一场令人错愕的对峙：一队青云门除妖弟子正把几头伤痕累累的灵兽逼入绝境，而几名万兽山御兽客却挡在妖兽身前怒目拔刀！\n\n青云弟子喝道：「此妖昨夜踏毁山下三亩灵田，当诛！」万兽山弟子嘶吼：「它是被北荒血修惊疯的契兽，已经恢复神智，你们凭什么见妖就杀！」',
    choices: [
      {
        label: '查明灵兽身上确有血魔宗毒针，力劝两宗联手先杀幕后血修', hint: '神识与魅力检定 · 化解两宗干戈',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 神识: 0.014, 魅力: 0.012 },
          success: {
            text: '你当场拔出妖兽后腿一枚猩红骨针！真相大白，两宗弟子羞愧收兵，转头联手端了山谷里的血修暗桩，各赠你厚礼谢恩！',
            effects: { karma: 45, reputation: 65, stones: 650, items: ['bixue_dan', 'qingxin_dan'], attrs: { 神识: 3, 魅力: 2 } },
          },
          fail: {
            text: '两方火气太旺根本听不进去，还是打成了一团，你只得趁乱护着重伤幼兽退出了山谷。',
            effects: { hp: -35, karma: 20, attrs: { 道心: 2 } },
          },
        },
      },
      {
        label: '替万兽山赔给青云弟子两百灵石补足农损，换契兽一条生路', hint: '消耗 200 灵石 · 功德无量',
        cost: { stones: 200 },
        outcome: {
          text: '青云弟子见凡人损失有了着落便收剑退去。万兽山御兽客深深抱拳，赠你一枚碧磷蛇胆与灵兽毛护符。',
          effects: { karma: 40, items: ['biling_yu'], reputation: 45, attrs: { 道心: 3 } },
        },
      },
      {
        label: '助青云弟子强斩狂妖，绝不留妖患近凡村', hint: '偏向正道除妖 · 战斗（铁甲妖猪）',
        combat: {
          enemy: 'beast',
          win: {
            text: '妖兽伏诛，青云弟子赞你嫉恶如仇奉上灵石，万兽山弟子却红着眼骂你冷血，双方恩怨更深。',
            effects: { stones: 480, reputation: 30, expPct: 0.18, karma: -10 },
          },
          lose: {
            text: '契兽临死反扑极其惨烈，你挂彩退场，深感人妖之争绝非黑白两字能断。',
            effects: { hp: -50, attrs: { 悟性: 2 } },
          },
        },
      },
    ],
  },
  {
    id: 'wsa_ws_11', title: '百兽夜哭 · 寻药救兽', pool: 'world', tier: 4, weight: 6, minRealm: 3,
    text: '秋风卷过苍茫妖森，万兽山方圆百里传出凄厉绵长的兽泣声——一种罕见的「腐骨兽瘟」自北荒随迁徙妖禽传入百兽谷，上百头高阶灵兽奄奄一息！\n\n万兽山急悬千金重榜，广邀九州丹修、医修与奇人入山共抗兽瘟。',
    choices: [
      {
        label: '献出珍藏大还丹与清毒丹方，助万兽山熬制百兽解瘟汤', hint: '消耗大还丹 · 获绝世瑞兽奇珍报答',
        cost: { item: 'dahuan_dan', month: 1 },
        outcome: {
          text: '药汤顺着百兽谷灵泉流遍全山，七日之后兽瘟尽止！万兽山主亲自出骨门相送，将一枚罕见朱雀真羽赠予你！',
          effects: { karma: 65, reputation: 85, items: ['fenghuang_yu'], lifespan: 25, attrs: { 魅力: 3, 道心: 3 } },
        },
      },
      {
        label: '凭高深神识深入疫源洞窟，斩杀散播瘟毒的万毒黑龙残影', hint: '恶战 · 妖将（毒疫魔兽）',
        cost: { month: 1 },
        combat: {
          enemy: 'demon_general',
          win: {
            text: '你摧毁洞窟毒囊、斩杀散疫妖物，百兽谷瘴气顿时消散！万兽山奉上千枚灵石与锻骨重宝酬谢大恩！',
            effects: { expPct: 0.28, stones: 1400, karma: 55, reputation: 80, items: ['duangu_dan'] },
          },
          lose: {
            text: '毒瘴入肺险些夺命，好在击碎了半数毒囊遏制了瘟势，万兽山连忙抬你出洞悉心救治。',
            effects: { hp: -85, karma: 35, items: ['jiexin_dan'], stones: 500 },
          },
        },
      },
      {
        label: '运来大批平价药草按市价售卖给焦急的万兽山管事', hint: '消耗 400 灵石备货 · 稳赚差价与人情',
        cost: { stones: 400 },
        outcome: {
          text: '你没趁火打劫，平价供草解了燃眉之急。万兽山感念厚道，结算了丰厚灵石并赠你两枚妖兽内丹。',
          effects: { stones: 980, items: ['yaoshou_neidan', 'yaoshou_neidan'], karma: 25, reputation: 35 },
        },
      },
    ],
  },
  {
    id: 'wsa_ws_c1', title: '祖兽古陵 · 骨门听啸', pool: 'sect', tier: 4, weight: 7, minRealm: 2,
    require: 'sect() == "wanshou"',
    once: true,
    text: '万兽山最深处的禁地「祖兽古陵」以一头太古巨龙的完整肋骨搭成拱门，唯有每代最得百兽信任的真传，方有资格在月圆之夜踏入古陵接受「万兽同契」大试。\n\n今夜百兽齐鸣，白发山主为你系上兽骨环：「祖兽英灵不喜奴役，更不喜软骨头。走进骨门，让它们听听你血里的声音。」',
    choices: [
      {
        label: '撤去护体法衣，迎着太古兽威仰天长啸迈入骨门', hint: '根骨与道心检定 · 血气震陵启三关',
        cost: { month: 1 },
        roll: {
          p: 0.58, attrs: { 根骨: 0.014, 道心: 0.01 },
          success: {
            text: '你的长啸竟激起漫山白骨共鸣！拱门之上亮起远古金纹，狂暴兽压瞬间化作浩荡暖流涌入四肢，引你步入陵墓深处。',
            effects: { expPct: 0.2, lifespan: 15, lawExp: 26, lawId: 'blood', attrs: { 根骨: 4 }, flag: { 骨门震啸: true } },
            goto: 'wsa_ws_c2',
          },
          fail: {
            text: '太古威压如泰山压顶，震得你膝骨咯咯作响、唇角溢血，却仍咬牙一步步跨过了骨门门槛。',
            effects: { hp: -55, attrs: { 根骨: 2, 道心: 2 } },
            goto: 'wsa_ws_c2',
          },
        },
      },
      {
        label: '献上一枚珍贵妖兽内丹祭告先兽英灵，肃穆入陵', hint: '消耗妖兽内丹 · 敬意通关',
        cost: { item: 'yaoshou_neidan', month: 1 },
        outcome: {
          text: '内丹化作清光散于骨门，古陵内传出一声慈和低鸣，漫天苍莽雾气自动向两侧分开迎你入内。',
          effects: { expPct: 0.18, lifespan: 15, lawExp: 28, lawId: 'blood', attrs: { 魅力: 3, 根骨: 2 }, flag: { 骨门震啸: true } },
          goto: 'wsa_ws_c2',
        },
      },
      {
        label: '唯恐镇不住太古凶兽残灵，向山主抱拳辞谢', hint: '审慎退步 · 错失祖兽传承',
        outcome: {
          text: '山主点头收起骨环：「御兽先御己心，不急。」赐你一瓶锻骨药汤。',
          effects: { attrs: { 根骨: 2 }, contribution: 120 },
        },
      },
    ],
  },
  {
    id: 'wsa_ws_c2', title: '祖兽古陵 · 血脉共鸣', pool: 'branch', tier: 5, weight: 0,
    text: (s) => `古陵中心是一座被万兽遗骸环绕的巨大祭潭，潭心盘踞着一头由太古龙象与洪荒妖王残意凝聚的「冥海骨蛟」。\n\n${s.flags['骨门震啸'] ? '你周身沸腾的浩荡血气令骨蛟眼中闪过一丝激赏，并未第一时间下杀手。' : '骨蛟甩尾掀起滔天白骨浪涛，冷漠审视着你这名渺小人族！'}\n\n「人族小辈，想借我族万古灵脉？先接住太古洪荒的怒火！」`,
    choices: [
      {
        label: '以身化洪荒巨兽之姿，正面硬撼冥海骨蛟', hint: '硬仗 · 冥海骨蛟',
        cost: { month: 1 },
        combat: {
          enemy: 'bone_dragon',
          win: {
            text: '你赤手崩裂骨蛟龙爪，震得整座古陵尘埃落定！骨蛟发出畅快龙吟，俯下巨大头颅将一枚太古祖兽印推到你面前！',
            effects: { expPct: 0.28, lawExp: 45, lawId: 'blood', attrs: { 根骨: 4, 道心: 3 }, flag: { 祖陵伏蛟: true } },
            goto: 'wsa_ws_c3',
          },
          lose: {
            text: '蛟尾扫得你筋骨欲断，你死死抱住龙角绝不松手。骨蛟大笑松开爪牙：「够蛮，够倔，配进祖坛！」',
            effects: { hp: -80, attrs: { 根骨: 3, 道心: 3 }, lawExp: 24, lawId: 'blood' },
            goto: 'wsa_ws_c3',
          },
        },
      },
      {
        label: '散去全部杀意，以《万兽契》本源心声与万兽残灵平等对话', hint: '魅力与神识检定 · 万灵共鸣',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 魅力: 0.015, 神识: 0.012 },
          success: {
            text: '「我不做万兽之主，只做万兽之友。」话音落，千百道太古兽影同时发出温和低鸣！骨蛟收起煞气低首致意，祖兽坛石门应声而开！',
            effects: { expPct: 0.26, lifespan: 25, lawExp: 48, lawId: 'chaos', attrs: { 魅力: 4, 神识: 3 }, flag: { 祖陵伏蛟: true } },
            goto: 'wsa_ws_c3',
          },
          fail: {
            text: '洪荒兽灵性情暴烈，险些震伤你识海，幸亏你临危稳住血气才勉强熬过考校踏上祖坛。',
            effects: { hp: -55, mp: -45, lawExp: 20, lawId: 'blood' },
            goto: 'wsa_ws_c3',
          },
        },
      },
    ],
  },
  {
    id: 'wsa_ws_c3', title: '祖兽古陵 · 万兽俯首', pool: 'branch', tier: 5, weight: 0,
    text: (s) => `祖兽坛顶，一缕金红交织的太古洪荒元气如长虹悬空。${s.flags['祖陵伏蛟'] ? '万千兽影齐齐伏地，连山外的百兽谷也同时响起震彻云霄的恭迎兽潮之啸！' : '洪荒元气缓缓垂落，等待你以肉身与道心承接万兽山万载薪火。'}\n\n这一刻，天地草木禽兽的呼吸仿佛尽在你一念之间。`,
    choices: [
      {
        label: '引洪荒精血淬炼肉身，修成万劫难伤的太古兽王之体', hint: '根骨与血海法则飙升 · 获龙血精与称号',
        cost: { month: 2 },
        outcome: {
          text: '筋骨爆鸣如雷，你周身气血化作真龙巨象虚影！走出古陵之日，山门万兽齐齐俯首，山主授你「万兽同契」最高骨令！',
          effects: { expPct: 0.36, lawExp: 88, lawId: 'blood', lifespan: 65, attrs: { 根骨: 7, 道心: 3 }, contribution: 650, reputation: 95, items: ['longxue_jing', 'duangu_dan'], title: '万兽同契', flag: { 万兽传人: true } },
        },
      },
      {
        label: '融万灵生息于混沌大道，追求人兽共生、寿比山海之境', hint: '混沌法则与巨额寿元 · 得麒麟玉角',
        cost: { month: 2 },
        outcome: {
          text: '浩瀚生机涌入紫府，你寿元暴涨、气息温润如春风过林，此后行走九州妖森如履平地，无一妖兽敢犯！',
          effects: { expPct: 0.34, lawExp: 82, lawId: 'chaos', lifespan: 100, attrs: { 根骨: 4, 魅力: 5, 气运: 4 }, contribution: 620, reputation: 90, items: ['qilin_jiao', 'fenghuang_yu'], title: '万兽同契', flag: { 万兽传人: true } },
        },
      },
    ],
  },

  /* ========================================================================
   * 九、机关城（jiguan · 14 节点）
   * 风味：会自己走路的城、三百年未露面的城主、巨型青铜齿轮、失控傀儡、天工图纸大比、九层核室三段链
   * ======================================================================== */
  {
    id: 'wsa_jg_01', title: '行城主轴卡齿', pool: 'sect', tier: 2, weight: 8, minRealm: 0,
    require: 'sect() == "jiguan"',
    text: '整座机关城忽然剧烈一震，青石街道发出刺耳的金属摩擦声——十二条支撑巨城行走的玄铁巨足之中，左前第三足的地下传动主轴卡死在了一道花岗岩暗缝里！\n\n齿轮舱内蒸汽滚烫、铜轮火花四溅。墨师长老抹了把黑油喊道：「别停主炉！一停火整座城得陷进泥沼！谁能钻进三尺窄缝把卡住的玄铁销钉敲松，头功记他名下！」',
    choices: [
      {
        label: '挟着玄铁锤钻入轰鸣齿轮暗缝，凭精准眼力松动卡死销钉', hint: '悟性与根骨检定 · 巧手定城基',
        cost: { month: 1 },
        roll: {
          p: 0.58, attrs: { 悟性: 0.014, 根骨: 0.01 },
          success: {
            text: '你在随时可能合拢的巨齿间隙里冷静连敲七锤，卡死的销钉应声弹出！巨城轰然迈出下一步，满舱墨师吹响铜哨为你欢呼！',
            effects: { expPct: 0.16, contribution: 220, stones: 320, attrs: { 悟性: 2, 根骨: 2 }, items: ['xuantie'] },
          },
          fail: {
            text: '一根滚烫蒸汽管擦破了你的手臂，好在销钉终究被震松了一半，师兄们趁势拉起了铁链。',
            effects: { hp: -40, contribution: 100, attrs: { 根骨: 2 } },
          },
        },
      },
      {
        label: '献上一块上品玄铁现铸缓冲楔片，一劳永逸加固主轴', hint: '消耗玄铁 · 墨堂重赏与阵道感悟',
        cost: { item: 'xuantie', month: 1 },
        outcome: {
          text: '你飞快雕出三枚自带灵纹的玄铁楔片卡入齿槽，巨足运行竟比从前还要顺滑三分！墨师长老当场将你的改良画进了城志。',
          effects: { contribution: 300, reputation: 35, lawExp: 22, lawId: 'array', attrs: { 悟性: 3 }, stones: 280 },
        },
      },
      {
        label: '留在外舱稳住灵石蒸汽阀，替钻缝的师兄护航', hint: '稳扎稳打 · 必得贡献与修为',
        outcome: {
          text: '你双手紧握铜阀精准控压，配合里头同门顺利排障，既无险情又摸透了行城蒸汽动力之理。',
          effects: { contribution: 140, exp: 300, attrs: { 悟性: 2 } },
        },
      },
    ],
  },
  {
    id: 'wsa_jg_02', title: '失控古傀儡', pool: 'sect', tier: 3, weight: 8, minRealm: 1,
    require: 'sect() == "jiguan"',
    text: '机关城第三层工坊火光冲天！一尊刚从古修遗迹挖回来拆解的千年玄铁傀儡，竟在注入灵石测验时突然灵核暴走，双目亮起刺目猩红，挥舞丈长铁臂砸塌了半座炉房！\n\n工坊里堆满尚未封存的火药雷珠与珍贵图纸，一旦被它闯进东侧仓库，整层工坊都要飞上天！',
    choices: [
      {
        label: '迎面截住发狂古傀儡，强行拆下它后颈的失控灵核', hint: '硬仗 · 古修机关傀儡',
        cost: { month: 1 },
        combat: {
          enemy: 'ancient_puppet',
          win: {
            text: '金铁交鸣火花四溅！你借一记巧劲撬开傀儡肩甲，一把扯出滚烫灵核！古傀儡轰然跪地，工坊保住，你更从它内部结构里偷学到一门失传上古机括术！',
            effects: { expPct: 0.22, contribution: 340, reputation: 40, lawExp: 28, lawId: 'array', items: ['xuantie', 'xuanwu_dun'] },
          },
          lose: {
            text: '古傀儡铁拳沉如山岳，震得你虎口裂血退开三步，幸得你顺手锁死了东仓铁门，拖到了重弩队赶来将其制伏。',
            effects: { hp: -65, injury: 1, contribution: 160, attrs: { 根骨: 2 } },
          },
        },
      },
      {
        label: '观察其关节转动死角，以细玄铁索绊倒傀儡再断灵路', hint: '悟性与神识检定 · 以巧克刚',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 悟性: 0.015, 神识: 0.012 },
          success: {
            text: '你三根铁索精准套住它膝弯传动轮，这尊万斤巨物竟轰隆摔了个狗啃泥，彻底哑火！工坊众匠师齐声喝彩！',
            effects: { contribution: 320, stones: 450, lawExp: 26, lawId: 'array', attrs: { 悟性: 3, 神识: 2 } },
          },
          fail: {
            text: '铁索被傀儡一把扯断，反抽伤你的肩头，最后靠众弟子齐砸磁铁砂才勉强拖停它。',
            effects: { hp: -45, contribution: 130, attrs: { 悟性: 1 } },
          },
        },
      },
      {
        label: '先抢出东仓最珍贵的《天工》孤本图纸，放任傀儡撞墙耗尽灵石', hint: '保全核心 · 稳妥止损',
        outcome: {
          text: '你护着孤本图纸撤出工坊，半个时辰后傀儡砸烂三堵石墙自己灵力耗尽停机。虽赔了些墙砖钱，核心传承一页未丢。',
          effects: { contribution: 200, attrs: { 悟性: 2 }, stones: 180 },
        },
      },
    ],
  },
  {
    id: 'wsa_jg_03', title: '天工图纸大比', pool: 'sect', tier: 3, weight: 8, minRealm: 1,
    require: 'sect() == "jiguan"',
    text: '机关城最热闹的不是比武，而是五年一度的「天工制图大比」。第七层演器大厅里，百名墨徒埋首铜案，沙漏倒计时三日——考题只有一句：「以百斤玄铁、十枚中品灵石为限，造一件能救同门性命之物。」\n\n有人拼命堆砌连发重弩，有人雕琢巨型铁盾，你铺开空白蓝图，脑中灵光一闪。',
    choices: [
      {
        label: '设计「无声摺叠护心甲」，遇袭瞬间自动弹开八卦铁幕', hint: '悟性与神识检定 · 巧夺天工魁首',
        cost: { month: 1 },
        roll: {
          p: 0.58, attrs: { 悟性: 0.015, 神识: 0.01 },
          success: {
            text: '试器场上，一记金丹重箭射来，你那件轻若蝉翼的铁甲刹那叠成八卦玄盾硬生生卸开全部劲道！大匠师击节叹赏，重赏贡献并赐你成品宝甲！',
            effects: { contribution: 340, reputation: 45, lawExp: 28, lawId: 'array', items: ['qingmu_jia', 'huxin_fu'], attrs: { 悟性: 3 } },
          },
          fail: {
            text: '弹开枢纽慢了半息，虽挡下了箭矢，却把甲片震裂了两块，惜获三等评阶。',
            effects: { contribution: 140, attrs: { 悟性: 2 }, stones: 200 },
          },
        },
      },
      {
        label: '造一具「缩地弹射逃生傀」，危难时可替主人引爆脱身', hint: '奇思妙想 · 空间与机关结合',
        cost: { month: 1 },
        outcome: {
          text: '评委们看得目瞪口呆——逃命机关竟然也能造得如此精妙！此图当场被城中暗卫买断，付了你一笔丰厚专利灵石！',
          effects: { stones: 680, contribution: 260, lawExp: 22, lawId: 'space', items: ['shenxing_fu'], attrs: { 悟性: 2, 气运: 2 } },
        },
      },
      {
        label: '踏实改良现役制式连弩的防卡箭机括，惠及全城守卒', hint: '实用为王 · 贡献与声望双收',
        cost: { month: 1 },
        outcome: {
          text: '虽不花哨，却让城墙守卒连射速度提升三成且永不卡弦！城防营全体匠卒举杯敬你，记你大功一件。',
          effects: { contribution: 280, reputation: 35, karma: 15, attrs: { 悟性: 2, 道心: 2 } },
        },
      },
    ],
  },
  {
    id: 'wsa_jg_04', title: '机关堡垒守城', pool: 'sect', tier: 4, weight: 7, minRealm: 2,
    require: 'sect() == "jiguan"',
    text: '行城每三年须在戈壁荒原停步七日更换脚踝耐磨铜瓦。偏偏就在停城检修的第四夜，一伙垂涎机关城宝库的魔道与劫修联军借沙暴掩护扑上城垣，数百道黑钩铁索瞬间搭上了外墙！\n\n巨城此时动弹不得，而主炮阵尚未蓄满灵能！你奉命镇守西侧第三炮塔，三名魔道精锐已踏着铁索杀上垛口！',
    choices: [
      {
        label: '死守炮塔手刃登城魔修，撑到主炮齐鸣轰碎沙暴敌阵', hint: '血战 · 血魔宗弟子',
        cost: { month: 1 },
        combat: {
          enemy: 'blood_cult',
          win: {
            text: '你在垛口血战半个时辰，终听脚下传出震天动地的灵炉轰鸣！十二门玄铁巨炮齐射，将城外劫修轰得灰飞烟灭！你获城防首功！',
            effects: { expPct: 0.25, contribution: 440, reputation: 60, stones: 650, items: ['xuantie', 'bixue_dan'] },
          },
          lose: {
            text: '魔刀斩开你的护肩，你拉响炮塔自毁油闸逼退敌人，总算保住了主炮枢纽未落敌手。',
            effects: { hp: -70, injury: 1, contribution: 240, reputation: 30 },
          },
        },
      },
      {
        label: '飞快改接西塔副阵灵脉，将防御护罩逆转为高压雷电网烤焦铁索', hint: '悟性与神识检定 · 匠师神操作',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 悟性: 0.015, 神识: 0.012 },
          success: {
            text: '刹那蓝电沿着铁索倒窜而下，整面西墙化作雷霆炼狱，数十名登城劫修连城砖都没摸着便焦黑坠崖！城防大将目瞪口呆。',
            effects: { contribution: 460, reputation: 65, lawExp: 34, lawId: 'thunder', attrs: { 悟性: 4 }, stones: 550 },
          },
          fail: {
            text: '灵脉超载炸碎了半座铜炉，虽成功震断了敌军铁索，你也挨了场不轻的电弧反震。',
            effects: { hp: -55, contribution: 200, lawExp: 16, lawId: 'array' },
          },
        },
      },
      {
        label: '指挥十尊战傀结铁壁阵顶在垛口，自己退回后方抢修主炮灵枢', hint: '分工有序 · 稳妥保城',
        outcome: {
          text: '铁傀虽折损三尊，却替你争取了宝贵时间。主炮提前一刻钟蓄满开火，一举击溃来敌！',
          effects: { contribution: 340, reputation: 40, attrs: { 悟性: 2, 道心: 2 } },
        },
      },
    ],
  },
  {
    id: 'wsa_jg_05', title: '踏砖无声试', pool: 'sect', tier: 2, weight: 7, minRealm: 1,
    require: 'sect() == "jiguan"',
    text: '机关城入门时要从第九层走到第一层不碰响一块砖，而内城还有一条更刁钻的「千响暗廊」——昨日一名师兄取灵核时失手坠入廊底，昏迷在机关阵中央。\n\n暗廊青砖下埋着千根牵一发而动全身的毒针铜丝，唯有脚步轻重与呼吸频率精准卡在齿轮咬合间隙，方能一步步把人完好背出来。',
    choices: [
      {
        label: '闭耳听墙内齿轮律动，踩着铜轴空隙无声潜入背出同门', hint: '神识与悟性检定 · 身法与眼力大进',
        cost: { month: 1 },
        roll: {
          p: 0.58, attrs: { 神识: 0.014, 悟性: 0.012 },
          success: {
            text: '三百步暗廊，未响一声机括！你背着师兄走出铁门时，守廊老匠师默默竖起一根大拇指，塞给你一卷奇门步法心得。',
            effects: { karma: 30, contribution: 280, expPct: 0.18, attrs: { 神识: 3, 悟性: 2 }, items: ['shenxing_fu'] },
          },
          fail: {
            text: '回程最后三步踩偏半寸，两根冷箭擦着你小腿飞过，好在仍拼死把师兄护出了暗廊。',
            effects: { hp: -40, karma: 25, contribution: 180, attrs: { 道心: 2 } },
          },
        },
      },
      {
        label: '自上方通风铜管垂下玄铁钩索，隔空将师兄吊出陷阱区', hint: '另辟蹊径 · 智者不走死路',
        outcome: {
          text: '「谁规定救人一定要走地板？」你拆开天花通风栅，三两下就把昏迷师兄平安拉上廊顶。老匠师哭笑不得，却也佩服你脑子活络。',
          effects: { contribution: 240, karma: 20, attrs: { 悟性: 3 }, stones: 220 },
        },
      },
      {
        label: '用三块磁石同时吸附廊底铜丝强行卡死机关，再大步走入救人', hint: '消耗 200 灵石置办强磁 · 稳妥霸道',
        cost: { stones: 200 },
        outcome: {
          text: '机括铜丝被强磁吸得纹丝不动，你背着师兄大摇大摆走出暗廊，顺便把师兄落下的灵核也一并捡回。',
          effects: { contribution: 260, karma: 25, items: ['xuantie'] },
        },
      },
    ],
  },
  {
    id: 'wsa_jg_06', title: '城主密信', pool: 'sect', tier: 3, weight: 7, minRealm: 2,
    require: 'sect() == "jiguan" && char.sectRank >= 1',
    text: '机关城主三百年没露过面，整座城却仍在按他的意志一步步往西北挪动。今晨一只巴掌大的青铜机关雀忽然落在你窗台，吐出一枚刻着城主暗印的黄铜密筒。\n\n密筒未封蜡，纸条上只有简短一行墨字：「三日后子时，送至万象书院观星台。沿途莫拆第三重铜扣。」你刚收好密筒，便察觉窗外屋檐掠过两道窥伺黑影！',
    choices: [
      {
        label: '谨守城主之命绝不偷窥，杀退沿途截信刺客按时送抵观星台', hint: '战斗 · 断魂刀客（截信暗刺）',
        cost: { month: 1 },
        combat: {
          enemy: 'blade_rogue',
          win: {
            text: '你在荒岭斩落两名截信黑衣人，子时整将完好密筒交入万象大先生之手。回城那日，窗台又飞来两只铜雀，衔着珍稀星辰砂与城主密赏！',
            effects: { expPct: 0.22, contribution: 400, reputation: 45, items: ['xingchen_sha'], stones: 550, flag: { 城主信使: true } },
          },
          lose: {
            text: '刺客毒镖划伤你肋下，你借机关烟雾遁走，拼着半条命仍把密筒按时送到了观星台。',
            effects: { hp: -65, contribution: 260, stones: 300 },
          },
        },
      },
      {
        label: '好奇心起，以极精巧手法悄悄拆开第三重铜扣一窥究竟再复原', hint: '悟性与神识检定 · 窥见行城去向大秘',
        cost: { month: 1 },
        roll: {
          p: 0.52, attrs: { 悟性: 0.015, 神识: 0.014 },
          success: {
            text: '你竟完好复原了三重机括锁！信中赫然画着昆仑界壁裂缝坐标——原来这座巨城三百年来一直往西北走，是为了在终局之日堵住界海缺口！你心头巨震，收获惊人！',
            effects: { expPct: 0.24, lawExp: 36, lawId: 'space', contribution: 340, attrs: { 悟性: 4, 神识: 3 }, flag: { 行城大秘: true } },
          },
          fail: {
            text: '第三重铜扣内藏微型雷符，咔哒一声把密信烧成了灰烬！你脸色惨白回城领罚，幸而城主只传下一声冷哼并未取你性命。',
            effects: { hp: -35, contribution: -100, attrs: { 悟性: 2 } },
          },
        },
      },
      {
        label: '雇一只隐形机关鸽暗度陈仓先行送信，自己扮诱饵引开追兵', hint: '声东击西 · 无伤立功',
        cost: { month: 1 },
        outcome: {
          text: '追兵围住你搜了半天只搜出一块砖头，此时真正的铜筒早已安然落在观星台案头！大先生与墨堂皆赞你机变百出。',
          effects: { contribution: 360, reputation: 40, stones: 450, attrs: { 悟性: 3 } },
        },
      },
    ],
  },
  {
    id: 'wsa_jg_07', title: '灵核过载', pool: 'sect', tier: 4, weight: 7, minRealm: 2,
    require: 'sect() == "jiguan" && char.sectRank >= 2',
    text: '机关城最底层的「太初灵炉」是整座行走巨城的心脏。今夜城足跨越一条炙热地火峡谷时，灵炉意外吸入过量狂暴地火，炉壁瞬间烧得通体透明，压力铜表指针死死顶在红线尽头！\n\n一旦主炉炸毁，整座机关城连同城内三万匠师与凡民都将化作荒原铁灰！',
    choices: [
      {
        label: '投入碧海玄冰髓给主炉紧急降温，同时手动重排灵流分管', hint: '消耗碧海玄冰髓 · 化险为夷记头功',
        cost: { item: 'bihai_xuanbing', month: 1 },
        outcome: {
          text: '玄冰髓化作漫天寒霜裹住通红炉壁，狂暴地火竟被驯服为纯净动力，巨城步速暴增一倍！全城匠师鸣钟致谢，赐你重宝！',
          effects: { contribution: 540, reputation: 75, karma: 40, lawExp: 40, lawId: 'array', items: ['bagua_xuanjia'], stones: 900 },
        },
      },
      {
        label: '冒死爬上滚烫炉顶，以阵道与肉身硬引过剩灵能导入地底排泄管', hint: '根骨与悟性检定 · 以身救城',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 根骨: 0.014, 悟性: 0.014 },
          success: {
            text: '炙热灵流烤焦了你的法袍，却被你九指连弹顺畅引入十二条废热铜管！红表回落那一刻，全城响起经久不息的铁锤敲击致敬声！',
            effects: { expPct: 0.28, contribution: 520, reputation: 80, karma: 45, attrs: { 根骨: 3, 悟性: 3 }, lawExp: 38, lawId: 'array' },
          },
          fail: {
            text: '泄压管爆开一团烈焰灼伤你胸背，好在及时压住了主炉爆炸，保住了满城性命。',
            effects: { hp: -85, injury: 2, karma: 35, contribution: 340, reputation: 50 },
          },
        },
      },
      {
        label: '果断切掉第六至第八层非核心工坊的灵能支线，以局部损毁保主城', hint: '断腕求生 · 务实止灾',
        outcome: {
          text: '数座偏炉闷响报废，主炉压力骤降一半！虽损失了些许外围工坊，整座机关城稳稳跨过了火焰峡谷。',
          effects: { contribution: 340, reputation: 40, attrs: { 道心: 3 } },
        },
      },
    ],
  },
  {
    id: 'wsa_jg_08', title: '傀儡有心否', pool: 'sect', tier: 4, weight: 6, minRealm: 3,
    require: 'sect() == "jiguan" && char.sectRank >= 2',
    text: '你在废弃的旧城第九层边缘，遇见一尊早已断了一臂、本该被熔炼回炉的老旧青铜守卫傀儡。它既没有攻击你，也没有回炉报废，而是每逢清晨便咯吱作响地提着半个破铜瓢，一滴一滴浇灌石缝里一株枯黄的小青苔。\n\n查遍铭文才知道，三百年前造它的那位匠师临终前曾随口叮嘱了一句：「替我看好窗台那盆绿。」匠师早化作白骨，这具死铁却守了三百年。',
    choices: [
      {
        label: '亲手取上品玄铁与星辰砂替它补全断臂、换上百年新灵核', hint: '消耗玄铁 · 器魂觉醒，悟透器道本心',
        cost: { item: 'xuantie', month: 1 },
        outcome: {
          text: '新灵核亮起微光，老傀儡抬起崭新铁臂凝视半晌，忽然向你极缓慢地躬身行了一个三百年前的古礼，随后从胸腔暗格递出旧匠师遗留的绝世器道法则残片！',
          effects: { karma: 45, demon: -18, items: ['faze_canpian'], lawExp: 50, lawId: 'array', attrs: { 道心: 4, 悟性: 4 }, contribution: 420 },
        },
      },
      {
        label: '陪老傀儡在断墙边静坐三日，感悟「死铁何以长情」的器道玄机', hint: '不动外物 · 道心与悟性双升',
        cost: { month: 1 },
        outcome: {
          text: '「人铸器，器亦映人。」你恍然明白为何机关城城主三百年未露面，城却仍在往前走——执念与承诺一旦刻入灵纹，便比血肉更长久。',
          effects: { expPct: 0.24, lawExp: 45, lawId: 'time', attrs: { 道心: 5, 悟性: 3 }, demon: -15, contribution: 340 },
        },
      },
      {
        label: '替它把那株小青苔移栽到阳光充足的城顶花圃，让老傀儡安然停机', hint: '温柔送别 · 业力与寿元微增',
        outcome: {
          text: '见到青苔重新舒展绿意，老傀儡眼眶里的红光渐渐黯淡熄灭，安详地坐化在断墙边。你心头微酸，亦觉通透。',
          effects: { karma: 40, lifespan: 15, demon: -16, attrs: { 道心: 4 }, contribution: 280 },
        },
      },
    ],
  },
  {
    id: 'wsa_jg_09', title: '行城过境 · 借路费', pool: 'world', tier: 2, weight: 7, minRealm: 1,
    text: '大地隆隆震颤，连茶碗里的水都泛起细密波纹！你走出荒野客栈，只见地平线尽头烟尘蔽日——一座长达十里、生着十二条百丈玄铁巨足的青铜巨城正缓缓踏过山谷！\n\n每迈出一步，巨城垂下的吊篮便顺手向路过修士兜售新式机关弩与修补法器，也会随手丢下几袋灵石赔偿被城足踩平的田埂。',
    choices: [
      {
        label: '趁行城放缓脚步，花 300 灵石搭吊篮换一件机关城精造玄武墨盾', hint: '消耗 300 灵石 · 买到超值精品法器',
        cost: { stones: 300 },
        outcome: {
          text: '吊篮上的黑脸墨师爽快把一面刚下炉的玄武墨盾递下来，还附赠了一瓶保养灵油，转眼巨城又轰隆迈向远方。',
          effects: { items: ['xuanwu_dun'], attrs: { 气运: 1 } },
        },
      },
      {
        label: '站在山坡静观十二巨足交替踩踏的阵法节奏，暗中偷师', hint: '悟性检定 · 领悟阵道与移山之力',
        roll: {
          p: 0.56, attrs: { 悟性: 0.015, 神识: 0.01 },
          success: {
            text: '你竟从巨城迈步的震颤频率里看穿了「借地脉托重物」的奇阵妙理，修为与阵道感悟大进！',
            effects: { expPct: 0.16, lawExp: 24, lawId: 'array', attrs: { 悟性: 3 } },
          },
          fail: {
            text: '烟尘扑面迷了双眼，只觉这铁疙瘩吵得震耳欲聋，没看出太多门道。',
            effects: { attrs: { 悟性: 1 } },
          },
        },
      },
      {
        label: '顺着巨城踩出的深坑捡拾震松出来的灵矿碎铁', hint: '务实拾遗 · 白捡玄铁与赤阳石',
        outcome: {
          text: '巨城百丈铁足一脚踩裂了地下浅层矿脉，你美滋滋捡起一块玄铁和两块赤阳炎石装进储物袋。',
          effects: { items: ['xuantie', 'chiyang_shi'], stones: 120 },
        },
      },
    ],
  },
  {
    id: 'wsa_jg_10', title: '铁傀围剿 · 机关与血魔', pool: 'world', tier: 4, weight: 6, minRealm: 2,
    text: '北荒赤沙坡上血雾翻滚，一队血魔宗劫掠团试图伏击机关城外出采矿的运输队，却一头撞上了机关城护航的「玄铁巨神傀」方阵！\n\n血魔宗的噬血邪功对无血无肉的铁疙瘩毫无作用，五尊十丈巨傀迈着整齐铁步，正把一众魔修逼得节节败退、惨叫连连！',
    choices: [
      {
        label: '助机关城墨师截断血魔宗后路，彻底歼灭这股北荒魔匪', hint: '战斗 · 血魔宗弟子',
        combat: {
          enemy: 'blood_cult',
          win: {
            text: '魔匪腹背受敌瞬间崩溃！运输队墨师大喜，大方分给你两块玄铁与厚厚一袋灵石酬谢。',
            effects: { expPct: 0.22, karma: 30, reputation: 45, stones: 620, items: ['xuantie', 'xuesha_jing'] },
          },
          lose: {
            text: '一名魔修拼死反扑划伤你左臂，幸得巨傀一记重炮将其轰退。',
            effects: { hp: -55, stones: 240, karma: 15 },
          },
        },
      },
      {
        label: '趁战局混乱从魔修尸体旁抢先捞走一枚血煞魔核与机关残件', hint: '火中取栗 · 气运检定',
        roll: {
          p: 0.58, attrs: { 气运: 0.015, 神识: 0.01 },
          success: {
            text: '你眼疾手快摸走血煞魔核与一只完好的小型灵能弩匣，在双方打扫战场前飘然远去！',
            effects: { items: ['xuesha_jing', 'xuantie'], stones: 380 },
          },
          fail: {
            text: '刚伸手就被一尊战傀当成偷矿贼差点一炮轰飞，狼狈逃窜三里。',
            effects: { hp: -40, attrs: { 气运: 1 } },
          },
        },
      },
      {
        label: '在一旁细看机关傀儡如何克制血道秘法，记录实战心得', hint: '静观战阵 · 阵道与悟性提升',
        outcome: {
          text: '无血之躯克血煞、联阵炮火压散修——这场不对称的碾压之战让你对高阶斗法有了全新领悟。',
          effects: { expPct: 0.16, lawExp: 24, lawId: 'array', attrs: { 悟性: 3 } },
        },
      },
    ],
  },
  {
    id: 'wsa_jg_11', title: '废弃傀儡残骸', pool: 'world', tier: 4, weight: 6, minRealm: 3,
    text: '大漠流沙之下露出一截长达五丈的玄铁巨臂——那是百年前机关城抵御域外魔潮时主动断尾求生舍弃的一尊元婴级战傀残骸。\n\n消息走漏，已有几伙拾荒散修和炼器师围着巨臂争吵不休，谁都想撬开巨臂掌心里紧握的那颗半亮灵核，却又忌惮残骸内尚未失效的自毁机关。',
    choices: [
      {
        label: '凭精湛神识拆解三道自毁锁扣，完好取出战傀掌心灵核', hint: '悟性与神识检定 · 技压群雄得重宝',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 悟性: 0.015, 神识: 0.014 },
          success: {
            text: '咔嗒三声轻响，巨臂五指缓缓松开，露出一块稀世星辰砂与完整灵宝护甲残件！四周散修看得目瞪口呆，无人敢抢！',
            effects: { items: ['xingchen_sha', 'bagua_xuanjia'], lawExp: 35, lawId: 'array', reputation: 60, attrs: { 悟性: 3 } },
          },
          fail: {
            text: '最后一道铜丝挑偏，残骸轰然自爆腾起百丈黑烟，把你震飞出去灰头土脸。',
            effects: { hp: -70, attrs: { 悟性: 2 } },
          },
        },
      },
      {
        label: '直接以强横战力震慑拾荒散修，独力破开巨臂铁壳', hint: '战斗 · 孤鸿剑修（领头拾荒强修）',
        combat: {
          enemy: 'sword_rogue',
          win: {
            text: '击退竞争者后你从容剖开战傀臂腔，收获大批极品玄铁与灵石！',
            effects: { stones: 1200, items: ['xuantie', 'xingchen_sha'], expPct: 0.24, reputation: 45 },
          },
          lose: {
            text: '对方人数占优合围伤你，只得放弃残骸退入沙丘疗伤。',
            effects: { hp: -75, attrs: { 根骨: 2 } },
          },
        },
      },
      {
        label: '传讯通知机关城回收残骸，换取一份正大光明的谢礼', hint: '结善缘 · 稳赚灵石与声望',
        outcome: {
          text: '三日后机关城派飞舟收走战傀残臂，领队墨师感激你保全了同门核心机密，奉上重金与一枚聚灵阵符。',
          effects: { stones: 950, items: ['juling_zhenfu'], reputation: 50, karma: 20 },
        },
      },
    ],
  },
  {
    id: 'wsa_jg_c1', title: '九层核室 · 铜门千锁', pool: 'sect', tier: 4, weight: 7, minRealm: 2,
    require: 'sect() == "jiguan"',
    once: true,
    text: '机关城最隐秘的第九层中枢，一道刻满一千零八十道联动铜锁的巨大圆门已经三百年没向弟子敞开过。今夜圆门忽然吐出一行赤金刻字——唤的正是你的名字。\n\n白须大墨师颤声扶住石栏：「三百年了……城主当年留下的『九层核室大考』终于重新亮灯！过得去，你便是机关城新一代天工执枢；过不去，便永远留在铁墙外。」',
    choices: [
      {
        label: '屏息拨动一千零八十道铜锁，以纯粹阵理与手艺一气解开', hint: '悟性与神识检定 · 巧开铜门入二关',
        cost: { month: 1 },
        roll: {
          p: 0.58, attrs: { 悟性: 0.015, 神识: 0.012 },
          success: {
            text: '千锁齐鸣如编钟奏响！厚重铜门缓缓向两侧滑开，你掌心隐隐印上一道天工灵纹，步入轰鸣回荡的核心巨厅！',
            effects: { expPct: 0.2, lawExp: 28, lawId: 'array', attrs: { 悟性: 3, 神识: 2 }, flag: { 千锁巧开: true } },
            goto: 'wsa_jg_c2',
          },
          fail: {
            text: '解至第九百锁时一处暗针弹伤指腹，虽略失优雅，你仍凭死磕劲头硬把最后一排铜环拧开了！',
            effects: { hp: -45, attrs: { 悟性: 2, 道心: 2 } },
            goto: 'wsa_jg_c2',
          },
        },
      },
      {
        label: '以星辰砂作灵墨灌入锁孔缝隙，令千锁自动显露生门轨迹', hint: '消耗星辰砂 · 稳步入核室',
        cost: { item: 'xingchen_sha', month: 1 },
        outcome: {
          text: '银辉流过千锁，所有死锁尽暗、唯有七处关键主锁大亮！你七指连点，巨门无声敞开，大墨师看得叹为观止！',
          effects: { expPct: 0.22, lawExp: 32, lawId: 'array', attrs: { 悟性: 3, 神识: 2 }, flag: { 千锁巧开: true } },
          goto: 'wsa_jg_c2',
        },
      },
      {
        label: '自认火候未及第九层禁地，向大墨师拱手退下', hint: '稳健辞考 · 错失此次传承',
        outcome: {
          text: '铜门上的赤金刻字缓缓熄灭。大墨师轻叹：「天工难求，留待有缘。」',
          effects: { contribution: 140, attrs: { 悟性: 2 } },
        },
      },
    ],
  },
  {
    id: 'wsa_jg_c2', title: '九层核室 · 巨傀试器', pool: 'branch', tier: 5, weight: 0,
    text: (s) => `核室穹顶高悬着一轮模拟日月运转的青铜浑天仪，仪下矗立着一尊高达十丈的镇城「机关巨神傀」！\n\n${s.flags['千锁巧开'] ? '你掌心天工灵纹亮起，巨神傀胸膛的毁灭炮口缓缓收拢，仅以纯正战傀之威向你试招。' : '巨神傀浑身齿轮怒鸣，十丈铁拳裹挟雷光轰然砸落！'}\n\n冰冷浑厚的留音在穹顶回荡：「造物者，必先能制伏自己所造之物！」`,
    choices: [
      {
        label: '迎面硬撼十丈机关巨神傀，击碎其胸口试炼护罩', hint: '巅峰傀战 · 机关巨神傀',
        cost: { month: 1 },
        combat: {
          enemy: 'iron_titan',
          win: {
            text: '你在漫天蒸汽与电弧里凌空踏上巨傀肩头，一击震开胸膛核心闸门！十丈巨神轰然单膝跪地，恭迎新任天工执枢步入城主留座！',
            effects: { expPct: 0.28, lawExp: 45, lawId: 'array', attrs: { 根骨: 3, 悟性: 3 }, flag: { 核室伏傀: true } },
            goto: 'wsa_jg_c3',
          },
          lose: {
            text: '巨傀铁掌震碎你的护身灵光，你咳血倒退却顺势卡死了它脚踝主齿轮令其僵立当场。穹顶留音赞了一声「可堪大用」，放你过关。',
            effects: { hp: -80, attrs: { 悟性: 3, 道心: 2 }, lawExp: 22, lawId: 'array' },
            goto: 'wsa_jg_c3',
          },
        },
      },
      {
        label: '绕至浑天仪下方改写核室中枢指令，令巨神傀反戈自锁', hint: '悟性与神识检定 · 以技御巨傀',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 悟性: 0.015, 神识: 0.014 },
          success: {
            text: '三息之间，你连改十二道灵纹回路！十丈巨神傀铁拳悬停在你发梢前寸许，随即乖乖收拳垂首，化作你掌中听令重器！',
            effects: { expPct: 0.26, lawExp: 50, lawId: 'array', attrs: { 悟性: 5, 神识: 3 }, flag: { 核室伏傀: true } },
            goto: 'wsa_jg_c3',
          },
          fail: {
            text: '改写指令时遭遇反制雷击，虽终究令巨神停机，自己也被电得衣衫焦黑、灵力枯竭。',
            effects: { hp: -55, mp: -50, lawExp: 24, lawId: 'array' },
            goto: 'wsa_jg_c3',
          },
        },
      },
    ],
  },
  {
    id: 'wsa_jg_c3', title: '九层核室 · 天工承脉', pool: 'branch', tier: 5, weight: 0,
    text: (s) => `核室最里端的城主铜座空无一人，案上却静静放着一枚旋转不息的「虚空齿轮核心」，以及城主三百年前亲刻的一行小字：「凡人血肉终朽，唯有巧思与大阵可撼天门。若有一日我未能归来，便由后来者替我领着这座城，走完最后一步。」\n\n${s.flags['核室伏傀'] ? '整座十里行走巨城同时发出低沉轰鸣，仿佛一头沉睡三百年的钢铁巨兽终于认出了新的舵手！' : '虚空齿轮缓缓停在你掌心上方，散发着浩瀚空间与阵法道韵。'}`,
    choices: [
      {
        label: '执掌虚空齿轮核心，将机关城大阵与阵道法则彻底融会贯通', hint: '阵道法则大成 · 得重甲与称号',
        cost: { month: 2 },
        outcome: {
          text: '万千机括图纸化作流光涌入识海！走出第九层时，大墨师率全城三千匠师敲响玄铁锤礼，尊你为机关城「天工执枢」！',
          effects: { expPct: 0.36, lawExp: 90, lawId: 'array', attrs: { 悟性: 6, 根骨: 3 }, contribution: 680, reputation: 95, items: ['bagua_xuanjia', 'xuantie'], title: '天工执枢', flag: { 机关执枢: true } },
        },
      },
      {
        label: '参悟虚空齿轮折叠万里空间的玄机，专精空间大道与须弥炼器', hint: '空间法则大成 · 得虚空晶与须弥戒',
        cost: { month: 2 },
        outcome: {
          text: '原来整座行城之腹本就藏着空间折跃仙阵！你顿悟虚空至理，此后咫尺天涯、炼器藏界皆成等闲。',
          effects: { expPct: 0.34, lawExp: 88, lawId: 'space', attrs: { 悟性: 5, 神识: 4 }, contribution: 620, reputation: 90, items: ['xukong_jing', 'qiankun_jie'], title: '天工执枢', flag: { 机关执枢: true } },
        },
      },
    ],
  },

  /* ========================================================================
   * 十、血魔宗（xuemo · 14 节点）
   * 风味：没有门规（活下来的就是弟子）、北荒血池、长老派系暗杀、劫掠正道灵矿、血幡祭炼、修罗血海三段链
   * ======================================================================== */
  {
    id: 'wsa_xm_01', title: '血池生死试', pool: 'sect', tier: 2, weight: 8, minRealm: 0,
    require: 'sect() == "xuemo"',
    text: '北荒血池滚烫腥甜，暗红泡沫里沉浮着不知哪代失败者的白骨。今夜是外门每季一次的「血池淬骨」——二十名新弟子跳进同一口药血潭，必须在沸腾煞气里泡满三昼夜。\n\n第二天子夜，离你三步远的一名疤脸师兄浑身发抖、眼眶赤红，手掌已悄悄摸向池底一块尖锐断骨——宗门明言：熬不住三天，杀一个同池之人吸其精气，也能算过关。',
    choices: [
      {
        label: '抢在他动骨刺之前反手按入血潭，夺其精气淬炼己身', hint: '狠辣魔道本色 · 战斗（劫道散修同阶新徒）',
        cost: { month: 1 },
        combat: {
          enemy: 'bandit',
          win: {
            text: '暗红水花四溅，你踩着对方冰冷的尸身站直脊背，将翻涌血煞尽数纳入丹田！池畔监试执事露出满意的森白牙齿：「很好，够狠。」',
            effects: { expPct: 0.24, contribution: 200, attrs: { 根骨: 3 }, karma: -25, demon: 6, stones: 180 },
          },
          lose: {
            text: '对方拼死在你肋下捅出一道深口子，你咬碎牙关反咬断他手腕才逼退他，浑身浴血爬出池边。',
            effects: { hp: -50, attrs: { 根骨: 2 }, demon: 5, contribution: 90 },
          },
        },
      },
      {
        label: '冷冷盯住他眼睛喝道「滚远点」，独自硬扛满三昼夜沸血煎熬', hint: '根骨与道心检定 · 霸气淬骨而不滥杀',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 根骨: 0.014, 道心: 0.01 },
          success: {
            text: '疤脸师兄被你眼里的冷意镇住，终究没敢扑上来。你咬破舌尖硬生生熬完三日，破水而出时周身皮肤泛起暗金血光，筋骨蜕变！',
            effects: { expPct: 0.2, attrs: { 根骨: 4, 道心: 2 }, contribution: 180, demon: 3, lawExp: 18, lawId: 'blood' },
          },
          fail: {
            text: '第三夜煞气攻心，你险些晕死在池底，被执事像拖死狗一样拽上岸丢进乱石堆。',
            effects: { hp: -45, demon: 6, attrs: { 根骨: 2 }, contribution: 75 },
          },
        },
      },
      {
        label: '低声提议联手背靠背防备池中其他疯子，撑过第三夜各走各路', hint: '魔宗罕见合纵 · 魅力与气运检定',
        roll: {
          p: 0.55, attrs: { 魅力: 0.012, 气运: 0.012 },
          success: {
            text: '疤脸汉子愣了一息，森然一笑把断骨扔回泥底。你们联手打退了两波偷袭者，双双活着走出雪雾血池，在冷酷魔宗里多了一个暂且能交后背的狠角色。',
            effects: { expPct: 0.18, contribution: 190, attrs: { 根骨: 2, 魅力: 2 }, stones: 220 },
          },
          fail: {
            text: '天亮前他还是趁你换气偷袭了一掌！好在你早留了一手护心灵力，反手打断他两根肋骨才脱身。',
            effects: { hp: -35, attrs: { 悟性: 2 }, demon: 4, contribution: 100 },
          },
        },
      },
    ],
  },
  {
    id: 'wsa_xm_02', title: '长老派系暗杀', pool: 'sect', tier: 3, weight: 8, minRealm: 1,
    require: 'sect() == "xuemo"',
    text: '血魔宗没有师徒温情，只有白骨堂与血幡堂两派长老永无止境的火并。半夜你刚练完功，房门缝里悄悄塞进两封截然相反的血漆密令——\n\n白骨堂主许诺三百灵石与一颗破障丹，要你明夜下毒暗杀血幡堂的得意门生；而血幡堂主竟也递来密信，命你提着白骨堂巡夜执事的人头去换内门席位！',
    choices: [
      {
        label: '接下血幡堂之令，月夜伏杀白骨堂执事以血铺路', hint: '狠辣站队 · 战斗（断魂刀客）',
        cost: { month: 1 },
        combat: {
          enemy: 'blade_rogue',
          win: {
            text: '血雾散去，你提着沾血铁牌踏入血幡堂大殿。血幡堂主哈哈大笑拍着你肩头：「这才是本座要的刀！」重赏如雨落下。',
            effects: { expPct: 0.22, contribution: 340, stones: 520, karma: -35, demon: 8, items: ['xuesha_jing'] },
          },
          lose: {
            text: '白骨堂执事早有防备，你反中暗算逃回乱坟坡，两头落空还招了死仇。',
            effects: { hp: -60, injury: 1, contribution: -50, demon: 6 },
          },
        },
      },
      {
        label: '两头吃定金，再把双方的暗杀密信偷偷调包塞给血煞老祖案头', hint: '悟性与气运检定 · 借老祖之手渔翁得利',
        cost: { month: 1 },
        roll: {
          p: 0.54, attrs: { 悟性: 0.015, 气运: 0.012 },
          success: {
            text: '次日拂晓，血煞老祖怒极出手把两个阳奉阴违的长老各抽碎半边魔躯，却对机敏告密、且滴血未沾的你大加赞赏！',
            effects: { contribution: 360, stones: 680, relation: { 血煞老祖: 20 }, attrs: { 悟性: 3 }, items: ['pozhang_dan'] },
          },
          fail: {
            text: '送信途中被白骨堂暗哨拦截，你只得烧毁密信硬杀出一条血路，险险保住性命。',
            effects: { hp: -50, contribution: 80, demon: 5 },
          },
        },
      },
      {
        label: '烧掉两封血信连夜请缨去前线掠矿，绝不卷入宗门内耗', hint: '远离漩涡 · 稳健求生',
        outcome: {
          text: '三天后白骨堂与血幡堂火并死了十七名精锐，而你早已在北荒外围稳稳捞了一笔战利品。魔宗里活得最久的，往往是不替人当枪的聪明人。',
          effects: { stones: 340, expPct: 0.16, attrs: { 道心: 2, 悟性: 2 }, contribution: 140 },
        },
      },
    ],
  },
  {
    id: 'wsa_xm_03', title: '劫掠正道灵矿', pool: 'sect', tier: 3, weight: 8, minRealm: 1,
    require: 'sect() == "xuemo"',
    text: '赤雾弥漫北疆边境，血魔宗三支魔骑突袭青云门管辖的黑石灵矿！正道守矿阵法已被血雷轰开缺口，矿道里堆满闪闪发光的中品灵石与玄铁原矿。\n\n然而山岭后方已升起三道求援青虹——太玄与青云的援军至多两刻钟便会合围！而矿洞角落还缩着二十名吓破胆的凡人矿工。',
    choices: [
      {
        label: '只卷走最精纯的灵石与玄铁，无视凡人矿工趁援军合围前疾撤', hint: '干脆利落 · 高收益且不造无谓屠戮',
        outcome: {
          text: '「灵石能换修为，杀几个凡人矿工既招业火又耽误撤退！」你装满储物袋率先冲出矿口，身后青虹刚至，你已扬长而去！',
          effects: { stones: 780, items: ['xuantie'], contribution: 280, expPct: 0.16, karma: -10 },
        },
      },
      {
        label: '殿后狙击率先赶到的正道先锋，替魔宗主力多拖一炷香搬空主矿', hint: '恶战 · 孤鸿剑修（正道先锋）',
        cost: { month: 1 },
        combat: {
          enemy: 'sword_rogue',
          win: {
            text: '血浪劈碎正道剑光，你独力拖住援军先锋令魔宗满载而归！战后论功行赏，你分得三成矿脉红利与血魔宗重赏！',
            effects: { stones: 1050, contribution: 420, reputation: 50, expPct: 0.24, karma: -25, demon: 6, items: ['xuesha_jing'] },
          },
          lose: {
            text: '正道剑意极烈，一剑洞穿你的肩胛。你借血遁秘法狼狈逃回北荒，好在主力已顺利搬空矿脉。',
            effects: { hp: -70, injury: 1, stones: 350, contribution: 200 },
          },
        },
      },
      {
        label: '趁乱杀尽矿口残兵并血祭矿脉震慑正道，狂吸战意煞气', hint: '极度血腥 · 血海法则暴涨，业力骤降',
        outcome: {
          text: '整座黑石矿化作修罗场，滚烫杀气灌满你的肺腑！正道从此将你的名字列上了北疆必杀黑榜，北荒众魔却对你敬畏有加。',
          effects: { expPct: 0.28, lawExp: 34, lawId: 'blood', stones: 820, contribution: 360, karma: -60, demon: 15, reputation: 35 },
        },
      },
    ],
  },
  {
    id: 'wsa_xm_04', title: '血幡祭炼', pool: 'sect', tier: 3, weight: 7, minRealm: 2,
    require: 'sect() == "xuemo"',
    text: '血魔宗真传人人须祭炼一面本命「血煞幡」。幡布已以百年血蚕丝织就，唯差最后一步「开锋血祭」——执事长老笑吟吟指着地牢铁笼，里面关着十名刚抓来的正道俘虏，而旁边石案上则摆着三枚从凶兽腹中剖出的狂暴血煞魔核。\n\n「拿活人神魂祭幡，威力最快最毒；拿凶兽魔核祭幡，反噬极烈十有八九炸幡。你自己挑。」',
    choices: [
      {
        label: '不碰地牢活人，强行以狂暴血煞魔核与自身精血硬炼血幡', hint: '根骨与道心检定 · 魔道亦有底线',
        cost: { hp: 45, month: 1 },
        roll: {
          p: 0.56, attrs: { 根骨: 0.014, 道心: 0.012 },
          success: {
            text: '你怒吼着以肉身硬扛魔核反震，七窍溢血却生生将三颗兽核压进幡骨！血幡展动时竟无半分冤鬼哀嚎，唯余纯粹霸道的太古兽血杀意！',
            effects: { expPct: 0.24, lawExp: 36, lawId: 'blood', items: ['wanhun_fan'], attrs: { 根骨: 3, 道心: 3 }, contribution: 340, demon: -5 },
          },
          fail: {
            text: '兽核暴走炸碎半截幡杆，震伤你的脏腑。执事长老嗤笑一声：「在血魔宗讲仁慈，迟早死在心软上。」',
            effects: { hp: -65, contribution: 120, lawExp: 18, lawId: 'blood' },
          },
        },
      },
      {
        label: '直接以战俘怨血祭炼魔幡，换取速成无上凶威', hint: '极恶祭器 · 修为与法则暴涨，业力大损',
        cost: { month: 1 },
        outcome: {
          text: '惨叫声在祭坛回荡半宿，漆黑血幡终于染作妖异猩红，挥动间鬼哭神嚎、煞气滔天！你力量骤增，可每逢午夜耳畔总似有铁链拖地之声。',
          effects: { expPct: 0.3, lawExp: 44, lawId: 'blood', items: ['wanhun_fan'], contribution: 380, karma: -55, demon: 18 },
        },
      },
      {
        label: '放过战俘只取其一滴心头血破阵，另花灵石购入大量妖兽精血补齐', hint: '消耗 450 灵石 · 折中炼幡',
        cost: { stones: 450, month: 1 },
        outcome: {
          text: '你既没违背魔宗规矩，也没造下灭绝人性的血孽。成幡威能虽稍逊一筹，却灵动顺手、毫无反噬心魔之忧。',
          effects: { expPct: 0.18, lawExp: 26, lawId: 'blood', contribution: 260, attrs: { 悟性: 2 } },
        },
      },
    ],
  },
  {
    id: 'wsa_xm_05', title: '吞并小宗', pool: 'sect', tier: 3, weight: 7, minRealm: 1,
    require: 'sect() == "xuemo"',
    text: '北荒边缘有个百余人的小家族宗门「苍松派」，守着一口清冽的中品灵泉。血魔宗大军压境，苍松派老掌门颤巍巍跪在山门青石上，双手高举护山阵牌求饶：「魔宗大人开恩！灵泉、灵石我们双手奉上，只求饶过门下老幼一条生路！」\n\n随行的十余名血魔宗狂徒舔着嘴唇，等你下令屠门抢宝。',
    choices: [
      {
        label: '收编苍松派全宗作血魔宗外附矿奴，留其活口年年上供灵泉灵石', hint: '霸道务实 · 长远利益最大化',
        outcome: {
          text: '「死人挖不出灵石，活着的奴才才值钱。」你一脚踢开急着砍人的魔徒，命苍松老掌门立下血誓归降。此后该地年年上贡，宗门大赞你御下有术！',
          effects: { stones: 650, contribution: 320, reputation: 30, attrs: { 魅力: 2, 悟性: 2 }, karma: -10 },
        },
      },
      {
        label: '只拆走灵泉核心与库藏灵丹，放苍松老幼自行逃往中州', hint: '魔中有仁 · 业力回升而略惹魔徒不满',
        outcome: {
          text: '老掌门涕泪横流带着弟子连夜南逃。虽有两名魔徒暗骂你妇人之仁，却被你一个冰冷眼神逼得闭了嘴。',
          effects: { stones: 420, items: ['juling_dan'], karma: 25, demon: -10, contribution: 200, attrs: { 道心: 3 } },
        },
      },
      {
        label: '任由麾下魔徒大开杀戒、洗劫一空以立血魔宗北荒凶威', hint: '穷凶极恶 · 掠夺海量灵石与杀气',
        outcome: {
          text: '冲天火光映红北荒夜空，方圆五百里小宗闻风颤栗，纷纷主动献上灵石求庇护。你荷包暴涨，脚下白骨亦多了一层。',
          effects: { stones: 1100, contribution: 360, karma: -50, demon: 15, expPct: 0.2, lawExp: 22, lawId: 'blood' },
        },
      },
    ],
  },
  {
    id: 'wsa_xm_06', title: '血煞反噬镇心', pool: 'sect', tier: 3, weight: 7, minRealm: 2,
    require: 'sect() == "xuemo" && char.sectRank >= 1',
    text: '血魔宗功法进境冠绝九州，代价却是日夜如影随形的「血疯」。今夜你于赤岩洞府冲击小阶，经脉中积攒的滚烫血煞骤然冲破泥丸宫——眼前石壁尽化血肉，耳边全是狂笑与尖叫，仿佛有一股暴虐欲念逼你提刀冲出去屠尽眼前一切活物！',
    choices: [
      {
        label: '反锁石门，以神魂迎战识海中沸腾的血煞心魔', hint: '生死镇心 · 心魔',
        cost: { month: 1 },
        combat: {
          enemy: 'heart_demon',
          win: {
            text: '你在识海血浪里硬生生掰断心魔脖颈！「煞气是我养的狗，岂容狗咬主人？」醒来时双目猩红尽褪，魔功反倒大进一重！',
            effects: { expPct: 0.26, demon: -24, lawExp: 34, lawId: 'blood', attrs: { 道心: 4, 根骨: 2 }, contribution: 240 },
          },
          lose: {
            text: '血煞冲垮识海堤防，你失控轰塌半座洞府才精疲力竭昏死过去，醒来浑身是伤、心魔更重。',
            effects: { hp: -75, demon: 12, attrs: { 根骨: 2 } },
          },
        },
      },
      {
        label: '吞服一枚清心丹压制心火，借寒玉石床强行冰镇血脉', hint: '消耗清心丹 · 稳妥化劫',
        cost: { item: 'qingxin_dan', month: 1 },
        outcome: {
          text: '冰凉药意顺着喉咙滑入丹田，沸腾血海顿时风平浪静。你将失控的煞气重新收束入骨，境界稳固如铁！',
          effects: { expPct: 0.2, demon: -25, attrs: { 道心: 3 }, contribution: 180 },
        },
      },
      {
        label: '干脆冲出洞府找北荒妖兽大战三天三夜，将满腔狂暴杀意泄个痛快', hint: '以战泄煞 · 耗气血换修为与战意',
        cost: { hp: 55, month: 1 },
        outcome: {
          text: '你赤手空拳在赤岩荒原撕碎了一整群嗜血妖蝠，浑身浴血大笑归洞，满腔憋闷杀气泄得干干净净！',
          effects: { expPct: 0.22, demon: -14, lawExp: 26, lawId: 'blood', attrs: { 根骨: 3 }, items: ['yaoshou_neidan'] },
        },
      },
    ],
  },
  {
    id: 'wsa_xm_07', title: '叛徒剥皮令', pool: 'sect', tier: 4, weight: 7, minRealm: 2,
    require: 'sect() == "xuemo" && char.sectRank >= 2',
    text: '血魔宗悬下最高级别「剥皮令」：一名负责看管暗库的金丹内门弟子韩墨，竟盗走半卷《血海真经》与北荒防务图，正逃往青云门地界准备叛魔投正！\n\n你一路血遁疾追三千里，终于在界河渡口堵住了这名神色仓皇的叛徒。韩墨拔剑苦笑：「{name}，你真以为正道赢了我们能活，或者血魔宗赢了老祖会放过我们这些耗材？让我走，防务图归你，经卷咱俩分！」',
    choices: [
      {
        label: '废话少说，斩下叛徒首级夺回真经与防务图复命', hint: '硬仗 · 血魔宗弟子（叛逃精锐）',
        cost: { month: 1 },
        combat: {
          enemy: 'blood_cult',
          win: {
            text: '界河岸边血花飞溅！你提着叛徒首级与完好真经回山复命，血煞老祖大悦，亲赐血海秘宝与海量贡献！',
            effects: { expPct: 0.26, contribution: 500, reputation: 65, stones: 900, relation: { 血煞老祖: 20 }, items: ['xuesha_jing', 'jiejin_dan'] },
          },
          lose: {
            text: '韩墨拼死自爆法宝炸伤你的胸膛，跳入界河顺流遁走，只留下半张染血防务图。',
            effects: { hp: -75, injury: 1, contribution: 180 },
          },
        },
      },
      {
        label: '夺回北荒防务图与真经原卷，却故意放韩墨重伤跳河逃生', hint: '留一线余地 · 复命同时暗结后路',
        outcome: {
          text: '你一剑削断他一条手臂夺走全部宗门机密，冷声道：「滚出九州别让我再看见你。」回去只报其坠河尸骨无存，既拿了重赏，又留了份隐秘人情。',
          effects: { contribution: 380, stones: 600, karma: 15, attrs: { 悟性: 3, 道心: 2 }, flag: { 放生韩墨: true } },
        },
      },
      {
        label: '私下抄录真经最核心的秘章后再杀韩墨灭口，独吞两头好处', hint: '极度狡诈 · 悟性与血海法则大涨',
        cost: { month: 1 },
        outcome: {
          text: '你假意答应分赃套出韩墨的秘法感悟，随即反手一刀毙命、拿其首级领赏！魔宗里谁讲信义谁死得快。',
          effects: { expPct: 0.28, lawExp: 38, lawId: 'blood', contribution: 460, stones: 800, karma: -35, demon: 10 },
        },
      },
    ],
  },
  {
    id: 'wsa_xm_08', title: '血煞老祖召见', pool: 'sect', tier: 4, weight: 6, minRealm: 3,
    require: 'sect() == "xuemo" && char.sectRank >= 2',
    text: '北荒血池之巅终年笼罩在暗红雷云之下。今日血池深处传来一声苍老却震人心魄的召唤——千年魔擘「血煞老祖」竟破例独召你踏上白骨王座台阶！\n\n老祖披着血色大氅，指尖轻敲骨座扶手，笑声低沉如雷：「{name}，你在宗里杀出了一片天。本座只问一句——若有一日正道联军攻破北荒，你是随本座把天捅个窟窿，还是趁乱踩着本座尸骨另立新宗？」',
    choices: [
      {
        label: '直视老祖猩红双瞳朗声道：「若老祖压不住天，弟子便踩着天也踩着老祖上去！」', hint: '极合魔祖胃口 · 暴涨好感与天阶秘典感悟',
        cost: { month: 1 },
        outcome: {
          text: '死寂一息之后，血煞老祖竟放声狂笑，震得血池掀起十丈红浪！「好！好一个不甘人下的魔崽子！本座最恨磕头拍马的废物！」他随手弹出一道血光打入你识海，竟是《修罗战天录》核心精义！',
          effects: { expPct: 0.3, lawExp: 55, lawId: 'blood', relation: { 血煞老祖: 35 }, contribution: 560, reputation: 85, items: ['yujian_xuesha'], attrs: { 根骨: 4, 道心: 3 } },
        },
      },
      {
        label: '抱拳冷笑：「正道伪君子还没死绝，弟子先陪老祖杀穿中州再算后账！」', hint: '并肩狂战 · 得血海重宝与大赏',
        cost: { month: 1 },
        outcome: {
          text: '老祖眼中战意炽烈，挥袖赐你一枚太古龙血精与千枚上品灵石：「痛快！中州那帮老古董，早该见见北荒的血了！」',
          effects: { expPct: 0.28, lawExp: 45, lawId: 'blood', relation: { 血煞老祖: 28 }, contribution: 540, stones: 1500, items: ['longxue_jing'] },
        },
      },
      {
        label: '躬身请老祖赐教一招，以魔道规矩用拳头答话', hint: '压境试手 · 血海长老（老祖化身）',
        combat: {
          enemy: 'blood_elder',
          win: {
            text: '你竟硬生生劈散老祖三成灵力所化血影！血煞老祖抚掌长叹：「北荒后继有人！」亲手替你打通两道隐脉！',
            effects: { expPct: 0.34, lawExp: 60, lawId: 'blood', attrs: { 根骨: 5 }, relation: { 血煞老祖: 40 }, contribution: 600, reputation: 90 },
          },
          lose: {
            text: '老祖化身一指震飞你十丈，却并未责罚，反而丢来一瓶九转大还丹：「筋骨还差三分，回去再杀十年！」',
            effects: { hp: -85, items: ['dahuan_dan'], relation: { 血煞老祖: 18 }, lawExp: 25, lawId: 'blood' },
          },
        },
      },
    ],
  },
  {
    id: 'wsa_xm_09', title: '北荒血雾 · 魔修拦路', pool: 'world', tier: 2, weight: 7, minRealm: 1,
    text: '北荒赤土荒道暮色如血。三名身穿暗红骨甲的血魔宗巡山狩猎者斜倚在枯骨路碑下，手中宽刀滴着不知是妖兽还是修士的鲜血。\n\n见你独行经过，为首魔修舔了舔猩红牙齿笑道：「这地界叫血魔宗的菜园子。两条路——留下三百灵石买条命，或者留下你一身精血给爷爷们补补！」',
    choices: [
      {
        label: '二话不说拔兵砍过去，谁是谁的菜打过才知道', hint: '战斗 · 断魂刀客（血魔狩猎者）',
        combat: {
          enemy: 'blade_rogue',
          win: {
            text: '你斩翻魔修首领，其余两人见踢到铁板惨叫逃遁！你搜刮战利品，竟摸出一颗罕见血煞魔核与一袋赃款！',
            effects: { expPct: 0.2, stones: 460, items: ['xuesha_jing'], karma: 25, reputation: 35 },
          },
          lose: {
            text: '三名魔修结血阵围攻伤你肩背，你强燃一张遁符拼死逃出赤土荒道。',
            effects: { hp: -55, stones: -120, attrs: { 根骨: 1 } },
          },
        },
      },
      {
        label: '扔出一袋灵石买路，绝不跟北荒疯狗拼命', hint: '消耗 250 灵石 · 破财消灾',
        cost: { stones: 250 },
        outcome: {
          text: '魔修掂了掂灵石袋大笑放行：「算你懂北荒的规矩！」你头也不回加快脚程离开险地。',
          effects: { attrs: { 悟性: 1 } },
        },
      },
      {
        label: '冷冷报出血煞老祖或魔道狠人名号反诈对方一通', hint: '魅力与道心检定 · 狐假虎威',
        roll: {
          p: 0.54, attrs: { 魅力: 0.014, 道心: 0.012 },
          success: {
            text: '你煞有介事扔出一枚暗红旧玉牌冷喝：「耽误了血池大事，拿你们三条命填？」三个蠢货吓得脸色发白连忙躬身让道，还孝敬了你两瓶疗伤丹！',
            effects: { items: ['liaoshang_dan', 'huiling_dan'], stones: 180, attrs: { 魅力: 2 } },
          },
          fail: {
            text: '魔修一眼看出你在胡扯，骂骂咧咧挥刀追杀你三里地，跑得你气喘吁吁。',
            effects: { hp: -35, attrs: { 气运: 1 } },
          },
        },
      },
    ],
  },
  {
    id: 'wsa_xm_10', title: '正魔血战 · 断龙峡', pool: 'world', tier: 4, weight: 6, minRealm: 2,
    text: '断龙峡上空风云变色！太玄剑宗的白虹剑阵、青云门的紫霄天雷，正与血魔宗漫天翻涌的九幽血雾撞得天崩地裂！\n\n峡谷两壁尸骨枕藉，断剑与破损血幡散落满地。一场牵动九州格局的百人正魔遭遇战正在你脚下惨烈展开！',
    choices: [
      {
        label: '加入正道联军侧翼，斩杀血魔宗精锐破其血雾阵眼', hint: '硬仗 · 血魔宗弟子',
        combat: {
          enemy: 'blood_cult',
          win: {
            text: '你一击击穿血雾阵眼，正道剑虹趁势长驱直入！战后太玄与青云联军首领重赏你灵石、灵丹与正道赫赫声望！',
            effects: { expPct: 0.25, karma: 50, reputation: 70, stones: 750, items: ['jianyi_dan'] },
          },
          lose: {
            text: '血煞狂潮反扑震伤你肺腑，幸得正道援军掩护撤回山崖。',
            effects: { hp: -70, karma: 25, reputation: 30 },
          },
        },
      },
      {
        label: '趁正道剑阵露怯偷袭其后营，助血魔宗反杀换取魔道厚礼', hint: '倒向魔道 · 战斗（正道金丹长老）',
        combat: {
          enemy: 'jindan_elder',
          win: {
            text: '正道后营大乱溃退！血魔宗统领大喜过望，分你大批缴获灵石与血道重宝，唯你从此上了正道通缉名录！',
            effects: { expPct: 0.28, stones: 1100, items: ['xuesha_jing', 'wanhun_fan'], karma: -55, demon: 12, reputation: 40 },
          },
          lose: {
            text: '正道长老剑威凛凛将你重创击退，你狼狈逃入荒野疗伤。',
            effects: { hp: -80, karma: -20, demon: 6 },
          },
        },
      },
      {
        label: '隐匿气息于断崖缝隙观战，待两败俱伤后捡走无主灵器与储物袋', hint: '渔翁得利 · 气运与神识检定',
        roll: {
          p: 0.58, attrs: { 气运: 0.014, 神识: 0.012 },
          success: {
            text: '硝烟散尽后你悄然滑落峡谷，从乱石堆里摸出一袋上品灵石、一瓶大还丹与残存剑意符！',
            effects: { stones: 680, items: ['dahuan_dan', 'jianqi_fu'], attrs: { 气运: 2 } },
          },
          fail: {
            text: '被一道流弹般的血雷余波扫中，灰头土脸逃离断龙峡，只捡到些碎灵石。',
            effects: { hp: -45, stones: 180 },
          },
        },
      },
    ],
  },
  {
    id: 'wsa_xm_11', title: '魔宗弃徒的密信', pool: 'world', tier: 4, weight: 6, minRealm: 3,
    text: '荒漠枯井旁躺着一名咽气前的血魔宗暗探，他浑身插满同门的追魂毒针，枯瘦手指死死攥着半块染血羊皮图。\n\n临终前他盯着你惨笑：「老子替血魔宗卖命八十年，就因为探到一座上古血矿，反被长老杀人灭口……拿去吧，不管是卖给万宝阁还是自己去掘，别便宜那帮畜生！」',
    choices: [
      {
        label: '亲身按羊皮图深入北荒暗窟，硬闯血矿机关夺取太古血宝', hint: '硬仗 · 血海长老（闻讯赶来的守矿魔修）',
        cost: { month: 1 },
        combat: {
          enemy: 'blood_elder',
          win: {
            text: '你抢先斩杀闻讯赶来的血魔宗长老，掘空整座隐秘矿脉核心！龙血精、血煞魔核与如山灵石尽入你手！',
            effects: { expPct: 0.3, stones: 2200, items: ['longxue_jing', 'xuesha_jing'], lawExp: 38, lawId: 'blood', reputation: 65 },
          },
          lose: {
            text: '血海长老威势滔天，你被轰出暗窟吐血不止，好在顺手抓了一把矿壁灵晶没空手而归。',
            effects: { hp: -85, stones: 600, attrs: { 根骨: 2 } },
          },
        },
      },
      {
        label: '将血矿坐标高价卖给正道盟与万宝阁两家竞拍，稳赚不沾血', hint: '智者生财 · 零风险暴富',
        outcome: {
          text: '两家闻讯疯狂加价，你稳稳落袋一千八百灵石抽身离去。半月后正魔在北荒为了那座矿打得头破血流，与你毫无干系。',
          effects: { stones: 1800, attrs: { 悟性: 3, 气运: 2 } },
        },
      },
      {
        label: '替这名苦命暗探挖坑掩埋，按他遗愿把坐标焚毁不惹血祸', hint: '止戈积德 · 心魔大减',
        outcome: {
          text: '黄沙掩骨，羊皮化灰。你在埋骨石下意外摸到他生前藏着的一枚护身符与养神丹，似是他最后的谢礼。',
          effects: { karma: 45, demon: -20, items: ['huxin_fu', 'yangshen_dan'], attrs: { 道心: 3 } },
        },
      },
    ],
  },
  {
    id: 'wsa_xm_c1', title: '修罗血海试 · 骨阶饮煞', pool: 'sect', tier: 4, weight: 7, minRealm: 2,
    require: 'sect() == "xuemo"',
    once: true,
    text: '北荒血池每隔百年彻底干涸一次，露出池底深达千丈的白骨旋梯——直通太古修罗魔主遗留的「修罗血海试炼场」。\n\n血煞老祖负手立于断崖俯瞰众真传：「百年前下去十二个，爬上来两个，其中一个成了今天的大长老。想在魔道登顶，便踏上骨阶——活下来，血海认你作主！」',
    choices: [
      {
        label: '划破手腕以自身鲜血引动骨阶共鸣，大步踏入千丈血渊', hint: '根骨与道心检定 · 霸烈启试入二关',
        cost: { hp: 40, month: 1 },
        roll: {
          p: 0.58, attrs: { 根骨: 0.014, 道心: 0.012 },
          success: {
            text: '狂暴修罗煞气化作赤红披风卷在你身周！千丈骨阶竟未曾压弯你的脊梁半寸，你周身战意如火直抵血海祭台！',
            effects: { expPct: 0.22, lawExp: 30, lawId: 'blood', attrs: { 根骨: 4 }, demon: 6, flag: { 骨阶战意: true } },
            goto: 'wsa_xm_c2',
          },
          fail: {
            text: '修罗煞气如万千钢针刺穿经脉，你连咳三口黑血几乎跌落深渊，全凭一股疯劲硬生生爬上了祭台。',
            effects: { hp: -65, demon: 10, attrs: { 根骨: 2 }, lawExp: 18, lawId: 'blood' },
            goto: 'wsa_xm_c2',
          },
        },
      },
      {
        label: '吞服一颗血煞魔核提前化煞护体，从容走完千丈骨阶', hint: '消耗血煞魔核 · 稳健入二关',
        cost: { item: 'xuesha_jing', month: 1 },
        outcome: {
          text: '以煞制煞！魔核精粹与血渊威压完美抵消，你气定神闲跨过白骨长阶，连血煞老祖都挑眉赞了一声「够稳」。',
          effects: { expPct: 0.24, lawExp: 34, lawId: 'blood', attrs: { 根骨: 3, 悟性: 2 }, flag: { 骨阶战意: true } },
          goto: 'wsa_xm_c2',
        },
      },
      {
        label: '审时度势觉得今日凶多吉少，退回池畔冷眼看同门去送死', hint: '惜命止步 · 错失此次传承',
        outcome: {
          text: '活着才是魔宗第一条铁律。你没下去送命，反而在池畔趁乱捡了几件死去同门留下的灵石法器。',
          effects: { stones: 450, contribution: 120 },
        },
      },
    ],
  },
  {
    id: 'wsa_xm_c2', title: '修罗血海试 · 血影斩己', pool: 'branch', tier: 5, weight: 0,
    text: (s) => `血渊尽头是一片无边无际的暗红镜海，海面缓缓升起一尊三丈血魔虚影——那是血海收集你生平所有杀戮与暴虐凝成的「血渊魔主」化身！\n\n${s.flags['骨阶战意'] ? '你周身沸腾的修罗战意竟与血海隐隐共振，魔主化身眼里闪过一丝兴奋。' : '魔主化身狂笑着掀翻百丈血浪，势要将你吞噬化作血海新养料！'}\n\n「要么吞了我执掌血海，要么被我吞了永沉池底！」`,
    choices: [
      {
        label: '迎着百丈血浪狂笑着正面劈杀，以战养战碾碎血魔化身', hint: '生死狂战 · 血海长老（血渊化身）',
        cost: { month: 1 },
        combat: {
          enemy: 'blood_elder',
          win: {
            text: '刀光劈断血浪，你生生将魔主化身撕作漫天精纯血雾尽数吞入丹田！无边血海轰然分流，一座猩红修罗王座自海底缓缓升起！',
            effects: { expPct: 0.3, lawExp: 48, lawId: 'blood', attrs: { 根骨: 4, 道心: 3 }, demon: -10, flag: { 血海斩魔: true } },
            goto: 'wsa_xm_c3',
          },
          lose: {
            text: '你浑身筋骨寸断跌落血水，却在濒死刹那反咬住魔影咽喉硬生生扯下它半团本源！魔影惨嚎散去，承认了你这股宁死不屈的疯劲。',
            effects: { hp: -85, demon: 8, attrs: { 根骨: 3 }, lawExp: 26, lawId: 'blood' },
            goto: 'wsa_xm_c3',
          },
        },
      },
      {
        label: '以绝对清醒的道心强行吞炼魔影煞气，将其炼作己用而非杀戮傀儡', hint: '道心与根骨检定 · 以心驭血',
        cost: { month: 1 },
        roll: {
          p: 0.54, attrs: { 道心: 0.014, 根骨: 0.014 },
          success: {
            text: '「血海再大，也大不过握刀的手！」你张口鲸吞整团血影却眼神冰冷清明，修罗血海瞬间温顺如仆，托起王座迎你登临！',
            effects: { expPct: 0.28, lawExp: 50, lawId: 'blood', demon: -18, attrs: { 道心: 4, 根骨: 3 }, flag: { 血海斩魔: true } },
            goto: 'wsa_xm_c3',
          },
          fail: {
            text: '反噬煞气差点烧坏神府，你连喷三口血雾才勉强稳住心神，拖着残躯踏上王座石阶。',
            effects: { hp: -65, demon: 12, lawExp: 24, lawId: 'blood' },
            goto: 'wsa_xm_c3',
          },
        },
      },
    ],
  },
  {
    id: 'wsa_xm_c3', title: '修罗血海试 · 血海称尊', pool: 'branch', tier: 5, weight: 0,
    text: (s) => `猩红王座之上悬浮着一滴凝聚太古修罗战意的「不灭真血」。${s.flags['血海斩魔'] ? '千丈血海为你翻腾咆哮，池外等候的血煞老祖猛然抬头望向地底，露出震动神色！' : '不灭真血微微颤动，静待活下来的强者伸手撷取。'}\n\n魔道从来不问出身善恶，只问你敢不敢把整片血海扛在肩上。`,
    choices: [
      {
        label: '一口吞下太古修罗真血，以杀证道、血海不枯吾身不灭', hint: '血海法则大成 · 极致战力与称号',
        cost: { month: 2 },
        outcome: {
          text: '冲天血柱破开北荒黑云！你破池而出那日，血魔宗三千魔修齐齐单膝跪地，血煞老祖亲封你为「血海修罗」少尊！',
          effects: { expPct: 0.38, lawExp: 95, lawId: 'blood', attrs: { 根骨: 6, 道心: 3 }, contribution: 700, reputation: 95, relation: { 血煞老祖: 30 }, items: ['yujian_xuesha', 'longxue_jing'], title: '血海修罗', flag: { 血海称尊: true } },
        },
      },
      {
        label: '炼化真血却斩尽其中嗜血暴戾，走出一条清醒霸道的「无魔血道」', hint: '血海与道心兼修 · 清心破魔',
        cost: { month: 2 },
        outcome: {
          text: '你只取血海澎湃生机与战意，将残存疯狂尽数斩于池底！从此纵使身处魔宗，心魔亦难侵你分毫，进境快绝九州却根基稳如泰山！',
          effects: { expPct: 0.35, lawExp: 85, lawId: 'blood', demon: -30, lifespan: 45, attrs: { 根骨: 4, 道心: 5, 悟性: 3 }, contribution: 640, reputation: 90, items: ['duangu_dan', 'faze_canpian'], title: '血海修罗', flag: { 血海称尊: true } },
        },
      },
    ],
  },

  /* ========================================================================
   * 十一、合欢宗（hehuan · 14 节点）
   * 风味：以情为引以欲为炉、南疆桃花幻阵、敌宗夜宴谍影、照心古镜、红尘丝阵三段链
   * ======================================================================== */
  {
    id: 'wsa_hh_01', title: '桃花幻阵', pool: 'sect', tier: 2, weight: 8, minRealm: 0,
    require: 'sect() == "hehuan"',
    text: '南疆合欢林四季桃花不败，风一吹便落得满肩胭脂色。入门头一课，执事师姐把你推进三里「痴情桃花阵」里，笑得眼波流转：「宗门说无情之人炼不出最烈的药。走出去吧——不过阵里的花瓣，会挑你心里最放不下那张脸来跟你说话。」\n\n刚走百步，雾色渐浓，一个温柔得令你鼻酸的熟悉背影果然提着纸灯在桃树下回过头来。',
    choices: [
      {
        label: '明知是幻仍温柔相视一笑，坦然承认心中执念再从容挥手道别', hint: '入情而能出情 · 契合合欢大道上乘',
        cost: { month: 1 },
        outcome: {
          text: '「多谢你陪我走过这一程。」话音落，桃花幻影含笑化作漫天灵瓣融入你的眉心！师姐拍手笑道：「不逃避情，也不被情困住——你是块修情道的好玉。」',
          effects: { expPct: 0.18, attrs: { 魅力: 3, 道心: 2 }, demon: -12, contribution: 180, lifespan: 8 },
        },
      },
      {
        label: '冷哼一声挥袖斩碎桃花幻影，硬凭神识强破阵眼', hint: '神识与道心检定 · 决绝破阵',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 神识: 0.014, 道心: 0.01 },
          success: {
            text: '花雾四散，你一步踏出阵外。师姐微微挑眉：「心够狠，只是太绝情的人，练《合欢双修录》容易伤到自己哦。」仍按规给了你高阶赏格。',
            effects: { expPct: 0.16, attrs: { 神识: 2, 道心: 2 }, contribution: 170, lawExp: 16, lawId: 'karma' },
          },
          fail: {
            text: '斩碎一朵幻花反生出十朵，越斩心头越乱，直到天明阵法自停你才喘着粗气走出花林。',
            effects: { demon: 6, attrs: { 魅力: 1 }, contribution: 75 },
          },
        },
      },
      {
        label: '在桃树下陪幻影共饮一盏落花茶，细品情丝牵引法力的奥妙', hint: '以情入道 · 魅力与寿元双增',
        cost: { month: 1 },
        outcome: {
          text: '你借这场温柔旧梦把体内灵气行了三个大周天，出阵时眼波含春、神韵大增，连花林灵蜂都绕你飞舞。',
          effects: { exp: 340, attrs: { 魅力: 4 }, lifespan: 12, contribution: 150 },
        },
      },
    ],
  },
  {
    id: 'wsa_hh_02', title: '敌宗夜宴谍影', pool: 'sect', tier: 3, weight: 8, minRealm: 1,
    require: 'sect() == "hehuan"',
    text: '合欢宗从不只靠刀剑争天下，九州各宗的机密一半是在酒杯与香风里流出来的。\n\n今夜你化名落霞城富商之子，混入青云外围一家世家执事的寿宴。丝竹靡靡、酒香微醺，你的任务是从那名戒心极重的执事嘴里套出下月正道押运灵石矿车的暗道时辰，却发现席间竟还有一名眼神锐利的太玄剑修一直盯着你的酒杯！',
    choices: [
      {
        label: '妙语连珠敬酒调笑，借醉意巧套出暗道口风后再从容脱身', hint: '魅力与悟性检定 · 完美情报战',
        cost: { month: 1 },
        roll: {
          p: 0.58, attrs: { 魅力: 0.015, 悟性: 0.012 },
          success: {
            text: '三杯青梅酿下肚，你滴水不漏地捧得那执事飘飘然说漏了嘴，还顺势朝那名太玄剑修遥遥举杯一笑，令对方反倒疑心尽消！回宗后香阁重赏！',
            effects: { contribution: 340, stones: 620, attrs: { 魅力: 3, 悟性: 2 }, expPct: 0.18, items: ['zhuyan_dan'] },
          },
          fail: {
            text: '太玄剑修一眼看破你袖口残留的南疆情花香，当场拔剑发难！你丢出烟雾香囊狼狈翻窗逃出寿宴。',
            effects: { hp: -45, contribution: 90, attrs: { 魅力: 1 } },
          },
        },
      },
      {
        label: '索性主动坐到太玄剑修桌旁谈剑论酒，借灯下黑暗让同门盗走账本', hint: '胆大包天 · 魅力与神识检定',
        cost: { month: 1 },
        roll: {
          p: 0.54, attrs: { 魅力: 0.014, 神识: 0.012 },
          success: {
            text: '最危险的地方最安全！你把那剑修聊得兴起忘了巡查，同门顺顺利利拓印了整本押运密账！香阁长老笑得花枝乱颤，记你头功！',
            effects: { contribution: 380, stones: 700, reputation: 35, attrs: { 魅力: 3, 神识: 2 } },
          },
          fail: {
            text: '那剑修是个油盐不进的石头木头，聊了三句便觉不对劲拉响警铃，害你们空手逃窜。',
            effects: { hp: -35, contribution: 80 },
          },
        },
      },
      {
        label: '察觉风险太高，悄悄在执事马车下放一只听音香虫便提前离席', hint: '稳健潜伏 · 零风险得大半情报',
        outcome: {
          text: '三天后香虫传回半段模糊暗道名称，虽不够详尽，胜在全身而退、无人察觉合欢宗曾来过。',
          effects: { contribution: 200, stones: 280, attrs: { 神识: 2 } },
        },
      },
    ],
  },
  {
    id: 'wsa_hh_03', title: '双修诱惑与真假情', pool: 'sect', tier: 3, weight: 8, minRealm: 1,
    require: 'sect() == "hehuan"',
    text: '红烛摇曳的香阁内，内门最负盛名、也最危险的师兄（或师姐）晏无尘赤足踏过软毯，指尖轻挑起你的下颌，眼尾一抹桃花红晕醉人心魄。\n\n「{name}，你卡在瓶颈也有几月了吧？」对方呵气如兰，丝绸袖底却暗藏一丝隐秘的采补灵丝，「今夜陪我共参《合欢双修录》，借我阴阳真元助你破关——不过，究竟是你借我的火，还是我采你的元，得看谁先动了真心。」',
    choices: [
      {
        label: '欣然赴约，却以更高明的阴阳调和手法反客为主、互惠共进', hint: '魅力与道心检定 · 双赢破境大进',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 魅力: 0.014, 道心: 0.014 },
          success: {
            text: '红烛燃尽三寸，晏无尘原本暗藏的采补灵丝竟被你四两拨千斤化作阴阳大循环！对方睁眼时眼底罕见地多了几分真切惊艳与敬重，两人修为齐齐暴涨、寿元大增！',
            effects: { expPct: 0.28, lifespan: 20, attrs: { 魅力: 4, 道心: 2 }, contribution: 280, breakBonus: 10 },
          },
          fail: {
            text: '你终究险些着了对方的道，被悄悄抽走一缕元阳精气，好在及时咬破舌尖抽身，只当交了一笔昂贵的红尘学费。',
            effects: { mp: -55, hp: -35, attrs: { 道心: 2 }, demon: 5 },
          },
        },
      },
      {
        label: '笑着轻轻拨开对方指尖，坦言「炉鼎生意免谈，平等论情则可」', hint: '守住本心 · 赢得尊重与真心结交',
        outcome: {
          text: '晏无尘先是一愣，随即收起那套勾人把戏，大笑着给你倒了一杯清茶：「合欢宗里难得见个既不装正人君子、也不贪便宜的明白人。」那夜你们只谈情道不越雷池，反倒收获极大。',
          effects: { expPct: 0.18, demon: -14, attrs: { 道心: 3, 魅力: 3 }, contribution: 220, items: ['zhuyan_dan'] },
        },
      },
      {
        label: '识破对方藏在香炉里的迷情散，反手下绊讹走对方一瓶丹药', hint: '魔宗老狐狸 · 悟性与神识检定',
        roll: {
          p: 0.55, attrs: { 神识: 0.014, 悟性: 0.012 },
          success: {
            text: '你指尖弹出香炉暗格里的迷药，笑吟吟敲了对方一瓶聚灵丹作赔罪礼！晏无尘咬牙切齿却又无可奈何，从此见你绕道走。',
            effects: { items: ['juling_dan'], stones: 360, attrs: { 神识: 2, 悟性: 2 }, contribution: 180 },
          },
          fail: {
            text: '翻脸太急反倒吃了一记桃花掌，揉着肩膀退出香阁。',
            effects: { hp: -40, attrs: { 悟性: 1 } },
          },
        },
      },
    ],
  },
  {
    id: 'wsa_hh_04', title: '照心古镜试', pool: 'sect', tier: 3, weight: 7, minRealm: 2,
    require: 'sect() == "hehuan"',
    text: '合欢宗南阁供着一面边角斑驳的「照心古镜」。传闻凡步入镜前者，镜面不会映出你的皮囊，只会映出你最深处赤裸裸的欲望——贪权、好色、畏死、求爱、或对某人的执念。\n\n宗主隔着珠帘轻笑：「合欢弟子可以有千百种欲念，唯独不能骗自己。站过去，看看镜子里那个你，敢不敢认。」',
    choices: [
      {
        label: '直视镜中赤裸欲望，朗声大笑「这便是我，何须掩饰」', hint: '坦荡本真 · 心魔骤消，魅力与道心飞升',
        cost: { month: 1 },
        outcome: {
          text: '镜面刹那绽出温润华光，竟将你心底所有扭曲羞耻照得烟消云散！珠帘后宗主击掌赞叹：「正道把欲藏在袍子里发霉，我们把它晒在太阳下炼丹——你入门了！」',
          effects: { expPct: 0.24, demon: -26, attrs: { 道心: 4, 魅力: 4 }, lawExp: 32, lawId: 'karma', contribution: 340 },
        },
      },
      {
        label: '以神识逆照古镜深处，探究照心镜为何能窥破人心因果', hint: '悟性与神识检定 · 参悟红尘因果丝',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 悟性: 0.014, 神识: 0.014 },
          success: {
            text: '你竟透过镜面看到了连接九州众生的万千猩红因果情丝！一念通明，合欢情道与因果法则在你体内悄然合流！',
            effects: { expPct: 0.22, lawExp: 38, lawId: 'karma', attrs: { 神识: 3, 悟性: 3 }, contribution: 320, items: ['qingming_jing'] },
          },
          fail: {
            text: '反窥古镜反被镜中千百前人的痴怨洪流冲得头昏眼花，休养了半月才缓过劲来。',
            effects: { mp: -50, demon: 6, attrs: { 神识: 2 }, contribution: 120 },
          },
        },
      },
      {
        label: '在镜前轻拭眼角一滴旧泪，将心中一段陈年心结就此放下', hint: '情断意明 · 寿元与心境齐升',
        outcome: {
          text: '镜中那个执拗的影子终于朝你挥了挥手，慢慢隐入铜光。你走出南阁，竟觉肩头轻了百斤。',
          effects: { lifespan: 20, demon: -20, attrs: { 道心: 4 }, contribution: 240 },
        },
      },
    ],
  },
  {
    id: 'wsa_hh_05', title: '采摘情花瘴', pool: 'sect', tier: 2, weight: 7, minRealm: 1,
    require: 'sect() == "hehuan"',
    text: '南疆十万大山深处的「醉梦谷」，唯有每年芒种黎明前的一刻钟，绝壁上的七叶情花才会吐蕊盛放。此花是合欢宗炼制驻颜丹与魅香的绝品主药，可花开同时必伴随极致命的七彩迷魂毒瘴！\n\n同行的两名小师妹才刚靠近谷口，呼吸便已紊乱、神色迷离地朝万丈深渊走去！',
    choices: [
      {
        label: '先用冰心诀唤醒两名迷失师妹送至安全坡，再冒瘴抢采情花', hint: '道心与根骨检定 · 救人采药两不误',
        cost: { month: 1 },
        roll: {
          p: 0.58, attrs: { 道心: 0.014, 根骨: 0.01 },
          success: {
            text: '你两掌震醒师妹，随后屏息化风掠过绝壁，在朝阳刺破瘴气前一息采下三朵极品七叶情花！回宗后获重赏驻颜宝丹与贡献！',
            effects: { karma: 25, contribution: 280, items: ['zhuyan_dan', 'qiannian_lingcao'], attrs: { 魅力: 2, 道心: 2 }, lifespan: 10 },
          },
          fail: {
            text: '护住师妹耽搁了半刻，花瓣在晨风里凋零了大半，自己也吸了一口毒瘴咳嗽不止，好在人皆平安。',
            effects: { hp: -35, karma: 20, contribution: 140, items: ['lingcao'] },
          },
        },
      },
      {
        label: '服下清毒解障丹强闯浓瘴，连花带根一举挖走谷底花王', hint: '消耗清毒解障丹 · 独获绝品灵药',
        cost: { item: 'jiexin_dan' },
        outcome: {
          text: '七彩毒瘴遇清毒药气退避三舍！你顺手扶回师妹，更在谷底掘出百年难遇的情花王，卖给丹堂赚得盆满钵满！',
          effects: { stones: 680, contribution: 300, items: ['qiannian_lingcao'], attrs: { 魅力: 3 } },
        },
      },
      {
        label: '趁毒瘴吸引来一头守护毒蟒，斩杀妖蟒取胆采花一石二鸟', hint: '战斗 · 碧磷毒蟒',
        combat: {
          enemy: 'poison_python',
          win: {
            text: '毒蟒毙命，腥风反倒吹散了半谷花瘴！你满载蛇胆与情花而归，香阁众弟子无不佩服！',
            effects: { expPct: 0.2, items: ['biling_yu', 'qiannian_lingcao'], contribution: 300, stones: 320 },
          },
          lose: {
            text: '毒蟒吐雾封路，你掩护师妹狼狈撤出醉梦谷，只捡了几片散落花瓣。',
            effects: { hp: -50, contribution: 110 },
          },
        },
      },
    ],
  },
  {
    id: 'wsa_hh_06', title: '为师姐护法', pool: 'sect', tier: 3, weight: 7, minRealm: 2,
    require: 'sect() == "hehuan" && char.sectRank >= 1',
    text: '合欢宗大长老座下首徒霓裳师姐今夜于荷花水榭冲击元婴瓶颈，正值最忌惊扰的元神交融之刻，特邀你守在纱帘外护法。\n\n然而三更鼓响，水榭池底竟悄无声息钻出三名身穿黑衣的杀手——竟是霓裳当年戏弄过的一名中州世家少主重金聘来的复仇剑客，三口毒剑直刺纱帘！',
    choices: [
      {
        label: '一步不退死守荷花廊桥，血战来袭金丹刺客绝不惊动师姐破境', hint: '硬仗 · 孤鸿剑修',
        cost: { month: 1 },
        combat: {
          enemy: 'sword_rogue',
          win: {
            text: '你在静悄悄的月色下生生压住所有刀剑响动将刺客斩落荷塘！黎明时分水榭灵光冲霄，霓裳师姐破境成婴，盈盈一拜赠你丰厚重礼与延寿珍药！',
            effects: { expPct: 0.25, contribution: 420, reputation: 50, stones: 750, lifespan: 15, items: ['yanshou_dan'], attrs: { 魅力: 3 } },
          },
          lose: {
            text: '你硬生生用后背替纱帘挡下一剑，震耳的落水声终于惊动外山长老赶来绞杀刺客。师姐虽破境险些受惊，对你拼死护法之恩铭记于心。',
            effects: { hp: -75, injury: 1, contribution: 300, stones: 500, items: ['dahuan_dan'] },
          },
        },
      },
      {
        label: '袖手洒出七情幻丝将刺客诱入偏殿假人房，不动声色反锁困杀', hint: '魅力与悟性检定 · 合欢巧技退敌',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 魅力: 0.014, 悟性: 0.014 },
          success: {
            text: '三名杀手一头撞进你织好的红尘迷丝，竟互相把同伴看成了仇人拼得两败俱伤！水榭纱帘连晃都没晃一下，师姐破境圆满！',
            effects: { contribution: 400, stones: 680, lawExp: 30, lawId: 'karma', attrs: { 魅力: 3, 悟性: 3 } },
          },
          fail: {
            text: '刺客领头者意志极坚撕断了幻丝，逼得你硬接数招挂了彩才将其逼退。',
            effects: { hp: -55, contribution: 220 },
          },
        },
      },
      {
        label: '高声点破刺客背后雇主世家名号，以合欢宗百倍报复相威慑逼其退兵', hint: '攻心为上 · 声威退敌',
        outcome: {
          text: '「动了霓裳，明夜你们少主床头便会多出三张合欢请帖。」黑衣杀手忌惮合欢宗防不胜防的暗杀手段，权衡片刻竟然恨恨退入水底！',
          effects: { contribution: 320, reputation: 40, attrs: { 魅力: 3, 道心: 2 } },
        },
      },
    ],
  },
  {
    id: 'wsa_hh_07', title: '断情与入情', pool: 'sect', tier: 4, weight: 7, minRealm: 2,
    require: 'sect() == "hehuan" && char.sectRank >= 2',
    text: '合欢宗派去青云门卧底十年的女弟子苏晴，今夜却独自逃回南疆跪在执事堂外请罪——她没有带回青云雷谱，反倒在十年朝夕相处里，真的爱上了那位替她挡过三道妖爪的青云内门师兄，并在宗门伏击前悄悄给对方送了信！\n\n刑堂长老冷笑亮出断情鞭：「卧底动了真情，坏了宗门大事！{name}，你来定夺——是按宗规抽散她一身修为，还是拿她做饵把那青云傻小子引过来一网打尽？」',
    choices: [
      {
        label: '替苏晴求情保其修为，只削其谍籍放她远走天涯去寻真情', hint: '以情恕情 · 损些许贡献，道心与因果暴涨',
        outcome: {
          text: '「宗门天天讲以情为引，真有人修出了至情，我们倒要抽死她？」你一句反问叫刑堂长老一时语塞。苏晴含泪叩首离去，数月后寄来两枚珍奇灵果与一道清净祝福。',
          effects: { karma: 55, demon: -20, contribution: -60, attrs: { 道心: 5, 魅力: 3 }, lawExp: 36, lawId: 'karma', items: ['bingxin_dan'] },
        },
      },
      {
        label: '不动刑罚，反劝苏晴坦然告知青云剑修真实身份——看对方是否仍愿相守', hint: '红尘试真情 · 魅力与悟性检定',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 魅力: 0.014, 悟性: 0.014 },
          success: {
            text: '那名青云弟子得知真相竟孤身闯入南疆合欢林，宁肯自罚戒鞭也要护苏晴周全！连冷面的刑堂长老都看得沉默良久，放二人双宿双飞，你更借这场红尘大戏悟透情道极境！',
            effects: { expPct: 0.26, lawExp: 45, lawId: 'karma', karma: 45, contribution: 380, reputation: 55, attrs: { 魅力: 4, 悟性: 3 } },
          },
          fail: {
            text: '青云弟子得知被骗十年后绝望斩袖而去。苏晴大哭一场后竟借极痛彻底勘破情劫，一举破入元婴，反而感激你让她早日梦醒。',
            effects: { contribution: 320, lawExp: 30, lawId: 'karma', attrs: { 悟性: 3 } },
          },
        },
      },
      {
        label: '冷酷按刑堂之计，拿苏晴传书设伏重创来援的青云剑修立功', hint: '铁血魔道 · 高额贡献与灵石，业力骤降',
        outcome: {
          text: '你设下天罗地网生擒了孤身赴约的青云真传，换回大批正道赎金与雷法玉简。刑堂大赞你冷血干练，唯有苏晴看你的眼神彻底死灰一片。',
          effects: { contribution: 520, stones: 1200, items: ['zhangxin_leifu'], karma: -50, demon: 14 },
        },
      },
    ],
  },
  {
    id: 'wsa_hh_08', title: '南疆香阁密报', pool: 'sect', tier: 4, weight: 6, minRealm: 3,
    require: 'sect() == "hehuan" && char.sectRank >= 2',
    text: '合欢宗之所以屹立九州千年不倒，靠的不止双修之术，更是遍布十三宗门的无形香网。\n\n秋分之夜，七只白羽信鸽同时落在南疆香阁，吐出七方浸染不同花香的丝帕——太玄剑宗内峰失和、万宝阁东海沉船、血魔宗老祖密谋北伐、乃至上界巡查使暗中现身中州！阁主将朱砂笔递给你：「七方密报，今夜放哪三条出去搅动风云，压哪三条留着自用？」',
    choices: [
      {
        label: '放出血魔宗北伐与太玄失和消息，促成正魔互耗、合欢渔翁得利', hint: '纵横捭阖 · 灵石与宗门贡献爆涨',
        cost: { month: 1 },
        outcome: {
          text: '不出半月，正魔两道在边境打得不可开交，纷纷高价向南疆采购解毒丹药与情报！合欢宗坐山观虎斗净赚数万灵石，你分红丰厚！',
          effects: { stones: 1800, contribution: 560, reputation: 70, attrs: { 悟性: 4, 魅力: 3 }, karma: -20 },
        },
      },
      {
        label: '将上界巡查使暗临中州的密报秘赠万象书院与天机阁，为九州留一线生机', hint: '魔宗亦有苍生格局 · 大义结缘顾青衣',
        cost: { month: 1 },
        outcome: {
          text: '顾青衣收到暗香丝帕后亲自回信致谢：「合欢宗里竟有如此通透人物。」你既替宗门结下中州最深暗盟，亦悟得因果天机大势！',
          effects: { karma: 55, reputation: 80, relation: { 顾青衣: 30 }, lawExp: 48, lawId: 'karma', contribution: 480, items: ['faze_canpian'] },
        },
      },
      {
        label: '把七方密报交叉比对，挖出其中暗藏的一座古仙双修秘境坐标独享', hint: '神识与悟性检定 · 独得仙缘',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 神识: 0.015, 悟性: 0.014 },
          success: {
            text: '七块丝帕拼合竟露出一处上古芳华仙窟！你悄然前往取走万年驻颜灵液与太虚丹，修为与寿元双双暴涨！',
            effects: { expPct: 0.3, lifespan: 40, items: ['lianxu_dan', 'zhuyan_dan'], attrs: { 魅力: 4, 气运: 3 }, contribution: 420 },
          },
          fail: {
            text: '拼错了两处花香暗码，扑了个空只寻到几株百年灵草，好在七方情报仍卖了个好价钱。',
            effects: { stones: 750, items: ['qiannian_lingcao'], contribution: 260 },
          },
        },
      },
    ],
  },
  {
    id: 'wsa_hh_09', title: '桃花酒肆 · 合欢织网', pool: 'world', tier: 2, weight: 7, minRealm: 1,
    text: '中州边境的「春风渡」酒肆挂着一串桃木风铃。柜台后的红衣老板娘手摇团扇，明明笑语盈盈，你却敏锐地嗅到酒坛下压着南疆合欢宗独有的情花暗香。\n\n老板娘端来一壶免费桃花酿，眨眼笑道：「这位俊俏客官，打听九州哪家宗门的糗事、或者想换一瓶驻颜延寿的妙药？奴家这里不光收灵石，也收一个你心里藏着的小秘密哦。」',
    choices: [
      {
        label: '大方付 260 灵石换取她手里一份秘境残图与清心醒酒茶', hint: '消耗 260 灵石 · 稳妥买情报',
        cost: { stones: 260 },
        outcome: {
          text: '老板娘笑嘻嘻收下灵石，递来一张标着野生千年灵草谷的丝帕地图，还叮嘱你夜里千万别一个人进北坡。',
          effects: { items: ['qiannian_lingcao', 'qingxin_dan'], attrs: { 神识: 2 }, exp: 280 },
        },
      },
      {
        label: '陪老板娘对饮三杯，借调笑周旋反套她几句南疆魔道近况', hint: '魅力与道心检定 · 情场反杀',
        roll: {
          p: 0.56, attrs: { 魅力: 0.015, 道心: 0.01 },
          success: {
            text: '你酒量与口才丝毫不逊合欢老手，反而逗得老板娘咯咯直笑，破例免费送你一瓶驻颜奇药并透露了血魔宗近期的动向！',
            effects: { items: ['zhuyan_dan'], attrs: { 魅力: 3 }, reputation: 25, exp: 320 },
          },
          fail: {
            text: '桃花酿后劲奇大，你晕乎乎多嘴说了两句自家底细，醒来时桌上的灵石袋莫名轻了一小半。',
            effects: { stones: -120, attrs: { 道心: 1 } },
          },
        },
      },
      {
        label: '婉拒美酒只喝一碗白水，冷眼记下酒肆暗记转身离去', hint: '清心寡欲 · 防微杜渐',
        outcome: {
          text: '老板娘目送你背影啧啧摇头：「真是个不解风情的木头。」你走出酒肆，心境倒比先前沉稳了两分。',
          effects: { demon: -8, attrs: { 道心: 2 } },
        },
      },
    ],
  },
  {
    id: 'wsa_hh_10', title: '红尘离间计 · 正道生隙', pool: 'world', tier: 4, weight: 6, minRealm: 2,
    text: '落霞城听雪楼二层，太玄与青云两位负责联合巡防的金丹执事正为了楼中一名绝色琴姬争风吃醋、拍案拔剑！\n\n你只扫了一眼那名泪眼婆娑的琴姬腕间丝绦，便认出她是合欢宗极擅「织情丝」的高阶谍修——她弹的每一记琴音都在暗中放大两名正道执事心底的傲气与猜忌，眼看正道联防就要在酒楼里自相残杀！',
    choices: [
      {
        label: '清啸一声以灵力震断琴弦，当众点破合欢迷情曲救下两宗和气', hint: '正义破局 · 道心与神识检定',
        roll: {
          p: 0.58, attrs: { 道心: 0.014, 神识: 0.012 },
          success: {
            text: '七根冰蚕琴弦应声齐断！两名执事瞬间如梦初醒、冷汗湿背，琴姬掩唇冷笑化作漫天花瓣遁走。两宗执事羞愧重谢你化解大祸！',
            effects: { karma: 45, reputation: 65, stones: 720, items: ['bingxin_dan'], attrs: { 道心: 3 } },
          },
          fail: {
            text: '那琴姬身法诡谲反手甩出一袖催情毒香，害你呛得灵力紊乱，好在总算打断了两人拔剑火并。',
            effects: { hp: -40, demon: 5, karma: 25, reputation: 30 },
          },
        },
      },
      {
        label: '不动声色替合欢琴姬补上一缕灵音推波助澜，事后向她索要分红', hint: '暗助合欢 · 损业力得厚礼与魅力',
        outcome: {
          text: '两宗执事彻底翻脸大打出手，正道边境防线瞬间松动。夜半琴姬翻窗而来，笑吟吟奉上一瓶驻颜丹与六百灵石：「阁下真懂风雅。」',
          effects: { stones: 650, items: ['zhuyan_dan'], attrs: { 魅力: 3 }, karma: -35, demon: 8 },
        },
      },
      {
        label: '悄悄给琴姬传音「收手吧，别闹出人命」，换她卖你个人情各自退场', hint: '中立圆融 · 两不得罪得善缘',
        outcome: {
          text: '琴姬眼波微动，顺水推舟装晕退席，楼中风波平息。临别她塞给你一枚传音香囊，算结下一段南疆隐秘人脉。',
          effects: { attrs: { 魅力: 2, 气运: 2 }, reputation: 30, stones: 300 },
        },
      },
    ],
  },
  {
    id: 'wsa_hh_11', title: '情花酿 · 南疆夜邀', pool: 'world', tier: 4, weight: 6, minRealm: 3,
    text: '中秋月圆之夜，合欢宗大开南疆「红尘花月宴」，广撒请帖邀九州元婴以上俊杰赴宴——无论正道剑尊、中立巨商还是魔道老怪，凡入合欢林者皆须暂放刀剑，共饮三百年一酿的「忘忧情花酒」。\n\n月下灯船浮满湖面，花香醉人，谁都知道这杯酒里既藏着延寿机缘，也藏着最柔情的试探。',
    choices: [
      {
        label: '欣然登船满饮三盏情花酒，与南疆诸大修畅谈红尘与长生', hint: '风流洒脱 · 寿元、魅力与修为大增',
        cost: { month: 1 },
        outcome: {
          text: '佳酿入喉如春风化雪，满湖丝竹间你谈笑风生、气度折服四座！花宴散场时你不仅寿元大涨，更获合欢长老回赠延寿奇珍！',
          effects: { expPct: 0.24, lifespan: 30, attrs: { 魅力: 5, 道心: 2 }, reputation: 65, items: ['yanshou_dan'] },
        },
      },
      {
        label: '借赴宴之机与暗中潜来的各宗高阶修士密谈，交换稀有灵材', hint: '以宴为市 · 耗 500 灵石换稀世奇珍',
        cost: { stones: 500 },
        outcome: {
          text: '花月宴实则是九州顶级大修的隐秘交换会。你趁夜色换到一颗稀世法则残片与半瓶玉露丹，不虚此行！',
          effects: { items: ['faze_canpian', 'ningying_dan'], attrs: { 气运: 2 } },
        },
      },
      {
        label: '拒绝入林饮酒，只立于湖畔孤石静观红尘众生醉态悟道', hint: '众人皆醉我独醒 · 道心与心魔净化',
        outcome: {
          text: '看尽灯船里名门正派的掩饰、魔道巨擘的狂放与凡尘痴怨，你忽觉心境通透明澈，心魔尽消！',
          effects: { demon: -25, attrs: { 道心: 5, 悟性: 3 }, lawExp: 32, lawId: 'karma' },
        },
      },
    ],
  },
  {
    id: 'wsa_hh_c1', title: '红尘丝阵 · 落花织梦', pool: 'sect', tier: 4, weight: 7, minRealm: 2,
    require: 'sect() == "hehuan"',
    once: true,
    text: '合欢林最深处的千年情花古树忽然满树落英如雨，织出一座通往云端的绯红丝桥——合欢宗创派老祖留下的镇宗秘境「红尘丝阵」为你开启了！\n\n宗主轻摇团扇，神色少有地郑重起来：「世人笑我合欢宗只会床笫采补，却不知情到极致可织因果、梦到深处可逆光阴。踏上红丝桥，若能走过万情镜廊而不迷失本我，宗门至高传承便归你！」',
    choices: [
      {
        label: '轻挽一缕桃花风步上红丝桥，以本心迎接万丈红尘幻梦', hint: '魅力与道心检定 · 从容入红尘三关',
        cost: { month: 1 },
        roll: {
          p: 0.58, attrs: { 魅力: 0.014, 道心: 0.012 },
          success: {
            text: '漫天花雨缠绕你周身却不沾半点尘埃，你眼波澄澈含情而不迷醉，红丝桥自动绽开莲步迎你踏入万情镜廊！',
            effects: { expPct: 0.2, lifespan: 15, lawExp: 28, lawId: 'karma', attrs: { 魅力: 3, 道心: 2 }, flag: { 红尘清醒: true } },
            goto: 'wsa_hh_c2',
          },
          fail: {
            text: '花香勾起数段深埋旧梦，你脚步微晃险些坠下丝桥，咬破唇瓣强提清醒才步入镜廊。',
            effects: { hp: -40, demon: 6, attrs: { 魅力: 2 } },
            goto: 'wsa_hh_c2',
          },
        },
      },
      {
        label: '先服一枚冰肌驻颜丹调和阴阳气息，光华流转步入丝桥', hint: '消耗冰肌驻颜丹 · 完美契合入二关',
        cost: { item: 'zhuyan_dan', month: 1 },
        outcome: {
          text: '驻颜丹化作绝美灵韵绕体，整座红尘丝阵竟如遇知音般温柔展开！宗主轻笑赞叹：「天生情道圣胎！」',
          effects: { expPct: 0.22, lifespan: 25, lawExp: 32, lawId: 'karma', attrs: { 魅力: 4 }, flag: { 红尘清醒: true } },
          goto: 'wsa_hh_c2',
        },
      },
      {
        label: '唯恐深陷情劫无法自拔，向宗主行礼退下', hint: '守心止步 · 错失此次传承',
        outcome: {
          text: '绯红丝桥化作落花散去。宗主叹息一声：「不敢入情者，终难登情道极巅。」',
          effects: { demon: -10, contribution: 120 },
        },
      },
    ],
  },
  {
    id: 'wsa_hh_c2', title: '红尘丝阵 · 万情镜廊', pool: 'branch', tier: 5, weight: 0,
    text: (s) => `踏入镜廊，千面铜镜映出你一千种可能的人生——有的儿孙满堂却寿尽凡尘，有的独霸九州却孤老无人，有的与挚爱并肩却惨死劫云之下。\n\n${s.flags['红尘清醒'] ? '你指尖轻抚镜面，看透千般幻生皆是情丝倒影，丝毫不为所动。' : '千面镜中同时伸出柔软却致命的绯红情丝，化作一尊绝美而诡谲的「幻界心魔」！'}\n\n「何必苦修长生？留在我编织的温柔梦里，永远不痛不老，不好吗？」`,
    choices: [
      {
        label: '挥袖斩断漫天绯红情丝，亲手击碎贪恋安逸的温柔心魔', hint: '心魔死战 · 心魔',
        cost: { month: 1 },
        combat: {
          enemy: 'heart_demon',
          win: {
            text: '千面铜镜同时轰然炸裂！绝美魔影化作漫天灵光汇入你掌心，镜廊尽头露出合欢老祖留下的「芳华道台」！',
            effects: { expPct: 0.28, demon: -24, lawExp: 45, lawId: 'karma', attrs: { 道心: 4, 魅力: 3 }, flag: { 镜廊破梦: true } },
            goto: 'wsa_hh_c3',
          },
          lose: {
            text: '你一度沉溺温柔乡险些丢掉道剑，终在最后一刻记起长生初心，吐血挣脱情丝撞开道台大门！',
            effects: { hp: -65, demon: 5, attrs: { 道心: 3 }, lawExp: 22, lawId: 'karma' },
            goto: 'wsa_hh_c3',
          },
        },
      },
      {
        label: '反手将千面镜中悲欢爱恨尽数收入掌心丝线，化万情为己用', hint: '魅力与悟性检定 · 万情归丝',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 魅力: 0.015, 悟性: 0.014 },
          success: {
            text: '「梦是我造的，岂容梦来留我！」你轻弹指尖，千面铜镜竟齐齐听你号令化作万丈红尘丝海，恭送你踏上芳华道台！',
            effects: { expPct: 0.28, lifespan: 25, lawExp: 50, lawId: 'karma', attrs: { 魅力: 5, 悟性: 3 }, flag: { 镜廊破梦: true } },
            goto: 'wsa_hh_c3',
          },
          fail: {
            text: '情丝反缠险些锁死神魂，耗去大半灵力才勉强脱身步上道台。',
            effects: { mp: -55, hp: -45, lawExp: 22, lawId: 'karma' },
            goto: 'wsa_hh_c3',
          },
        },
      },
    ],
  },
  {
    id: 'wsa_hh_c3', title: '红尘丝阵 · 情尽道生', pool: 'branch', tier: 5, weight: 0,
    text: (s) => `芳华道台之上，一朵永不凋零的先天青莲静静绽放在绯红情海中央。${s.flags['镜廊破梦'] ? '合欢老祖的一缕笑声穿越千年落入耳畔：「入过红尘，尝过爱恨，仍敢仰望长生——这才是真正的合欢大道！」' : '道台花雨徐徐落下，为你洗尽浮华俗气，唯余绝世风华。'}`,
    choices: [
      {
        label: '执掌红尘因果情丝，以众生喜怒哀乐为炉炼就无上魅力与因果道', hint: '因果法则大成 · 魅力、寿元与称号',
        cost: { month: 2 },
        outcome: {
          text: '漫天绯红丝线化作一道隐秘金纹融入你眸光。走出合欢林那日，十万桃花齐齐低枝致敬，合欢宗尊你为「红尘织梦」圣使！',
          effects: { expPct: 0.36, lawExp: 90, lawId: 'karma', lifespan: 80, demon: -28, attrs: { 魅力: 7, 道心: 4 }, contribution: 680, reputation: 95, items: ['zhuyan_dan', 'yujian_yinguo'], title: '红尘织梦', flag: { 合欢圣传: true } },
        },
      },
      {
        label: '悟芳华永驻、岁华不侵之理，将情道熔入光阴长生大道', hint: '光阴法则大成 · 巨幅延寿与绝品灵露',
        cost: { month: 2 },
        outcome: {
          text: '容颜永驻、生机不朽！你从盛放与凋零之间窥见光阴秘钥，寿元暴涨百载，战力与神韵皆臻化境！',
          effects: { expPct: 0.34, lawExp: 84, lawId: 'time', lifespan: 110, attrs: { 魅力: 5, 悟性: 4, 气运: 3 }, contribution: 620, reputation: 90, items: ['guangyin_lu', 'yanshou_dan'], title: '红尘织梦', flag: { 合欢圣传: true } },
        },
      },
    ],
  },

  /* ========================================================================
   * 十二、幽冥鬼道（youming · 14 节点）
   * 风味：鬼道弟子不葬（死后会自己走回黄泉渡）、黄泉渡行舟、镇压叛逆鬼王、古冢掘骨、魂灯暗市、十殿阎罗试三段链
   * ======================================================================== */
  {
    id: 'wsa_ym_01', title: '阴水渡口行舟', pool: 'sect', tier: 2, weight: 8, minRealm: 0,
    require: 'sect() == "youming"',
    text: '芦洲旧河闸下游有一段阴水渡，终年飘着骨灰般的冷雾，黑水无风自流，水面浮着盏盏惨绿引魂灯。寨里的老规矩，中元前后要替水里的冤魂撑船，今夜轮到你撑这条乌篷船，船头坐着三道不肯投胎的游魂——一个攥着半块破玉佩的书生、一名断了枪杆的边军老卒、一个哭着寻娘的稚童。\n\n老摆渡人靠在枯柳下抽着阴烟：「渡魂的规矩记牢：问清执念，收半缕阴息当船资。问错了，他们会把你拉进黑水里替他们撑船。」',
    choices: [
      {
        label: '逐一静听三魂遗言，以神识化作短暂旧景圆其最后心愿再渡对岸', hint: '神识与道心检定 · 圆满渡魂得阴德',
        cost: { month: 1 },
        roll: {
          p: 0.58, attrs: { 神识: 0.014, 道心: 0.01 },
          success: {
            text: '书生见了考榜，老卒听见归乡号角，稚童闻到熟悉粥香。三魂含笑化作青烟飘过黑水，反赠你三缕极精纯的清灵鬼息，神识豁然大涨！',
            effects: { expPct: 0.18, karma: 25, demon: -12, attrs: { 神识: 3, 道心: 2 }, contribution: 180 },
          },
          fail: {
            text: '老卒见旧景反激起战死怨气，猛地扑翻乌篷船！你浑身湿透冻得发抖爬上岸，被老摆渡人拎着竹篙敲了一记。',
            effects: { hp: -35, attrs: { 神识: 1 }, contribution: 75 },
          },
        },
      },
      {
        label: '不问前尘恩怨，直接摇响招魂青铃强行锁魂压过阴水', hint: '铁腕鬼修 · 省力而增煞气',
        cost: { month: 1 },
        outcome: {
          text: '铃音冷冽如冰，三魂哀鸣着被铁链拖至彼岸交差。老摆渡人吐出口白烟：「手够狠，只是以后你自己过河，怕是没人替你撑伞。」',
          effects: { expPct: 0.16, contribution: 160, stones: 200, karma: -15, demon: 5 },
        },
      },
      {
        label: '向书生换取他生前牢记的半篇奇门口诀，免去三人船资送渡彼岸', hint: '交易渡魂 · 悟性与法则收益',
        outcome: {
          text: '书生大喜过望，将生前牢记的半篇奇门口诀尽数倾吐。船抵彼岸时，你只觉挪移方位、缩地换步之理隐隐通透。',
          effects: { exp: 320, lawExp: 18, lawId: 'space', attrs: { 悟性: 2, 神识: 2 }, contribution: 140 },
        },
      },
    ],
  },
  {
    id: 'wsa_ym_02', title: '镇压叛逆鬼王', pool: 'sect', tier: 3, weight: 8, minRealm: 1,
    require: 'sect() == "youming"',
    text: '九幽葬魂坑深处响起令人牙酸的锁链崩断声！一头被镇压百年的「裂颅鬼将」趁阴潮暴涨挣脱了玄铁棺椁，浑身黑雾滚滚，吞噬了两名看守外门弟子的灵力后，正狂笑着朝黄泉渡总坛扑来！\n\n一旦让它冲破外坛，整座黄泉渡圈养的数千鬼奴都要跟着暴动！',
    choices: [
      {
        label: '手执招魂幡孤身截住暴走鬼将，将其生生打服重新锁回棺椁', hint: '恶战 · 阴煞尸将同阶（暴走鬼将）',
        cost: { month: 1 },
        combat: {
          enemy: 'corpse_general',
          win: {
            text: '你一记幽冥镇魂印砸碎鬼将头冠，黑链缠身将其拖回葬魂坑！众鬼奴骇然伏地，宗门长老重赏九幽冥晶与海量贡献！',
            effects: { expPct: 0.24, contribution: 360, reputation: 45, items: ['jiuyou_mingjing'], attrs: { 神识: 3 } },
          },
          lose: {
            text: '鬼将凶焰滔天震伤你神魂，你咬牙引爆两张阴雷符炸塌坑道拖住脚步，直至总坛长老出手镇压。',
            effects: { hp: -65, mp: -45, contribution: 160, attrs: { 道心: 2 } },
          },
        },
      },
      {
        label: '布下九幽摄魂小阵反抽其阴气，以神识强行抹去叛逆烙印', hint: '神识与悟性检定 · 收鬼为奴',
        cost: { month: 1 },
        roll: {
          p: 0.55, attrs: { 神识: 0.015, 悟性: 0.012 },
          success: {
            text: '幽绿阵纹自脚下展开，狂躁鬼将在你的绝对神识压制下渐渐嘶吼转低，竟屈膝献出一缕本命鬼火！你不仅平叛，更炼成一面镇煞宝幡！',
            effects: { expPct: 0.22, contribution: 340, lawExp: 28, lawId: 'space', items: ['wanhun_fan'], attrs: { 神识: 3 } },
          },
          fail: {
            text: '神魂交锋稍逊半筹，反被鬼将尖啸震得耳鼻溢血，狼狈退至总坛护阵之内。',
            effects: { hp: -50, mp: -40, contribution: 100 },
          },
        },
      },
      {
        label: '抛出一块九幽冥晶诱鬼将停步吞食，趁其炼化间隙偷袭落锁', hint: '消耗九幽冥晶 · 巧镇叛鬼',
        cost: { item: 'jiuyou_mingjing' },
        outcome: {
          text: '鬼将见极品冥晶果然失了理智埋头大嚼，你趁势催动棺椁锁链一举将其捆成铁粽！长老笑骂你舍得下本钱，赏了双倍贡献补你亏空。',
          effects: { contribution: 420, stones: 700, attrs: { 悟性: 2 } },
        },
      },
    ],
  },
  {
    id: 'wsa_ym_03', title: '古冢掘骨', pool: 'sect', tier: 3, weight: 8, minRealm: 1,
    require: 'sect() == "youming"',
    text: '幽冥鬼道弟子素来干着外人最忌讳的营生——掘古修大冢、收万年阴骨。北荒冻土之下新塌出一座两千年前的金丹剑修古墓，石棺保存完好，棺中遗骸胸口压着一枚灵气逼人的「镇墓玉印」，而棺壁却刻着一行森冷遗嘱：\n\n「生前斩魔百人，死后唯求清静。扰吾长眠者，断子绝孙、剑煞缠魂。」',
    choices: [
      {
        label: '先向石棺恭敬行三拜古礼，只取棺外无主陪葬灵材，不动前辈尸骨与玉印', hint: '盗亦有道 · 意外获前辈残魂赠礼',
        outcome: {
          text: '你三拜起身正欲退出墓室，石棺竟发出一声极轻的叹息。一缕清冽剑意浮出棺缝，化作一枚剑意封灵符与一袋古灵石落在你脚边——原来死去两千年的剑修，唯独不恨懂礼数的人。',
          effects: { karma: 30, demon: -12, items: ['jianqi_fu'], stones: 420, attrs: { 道心: 3, 神识: 2 }, contribution: 180 },
        },
      },
      {
        label: '管他生前何等英雄，撬棺强夺镇墓玉印与万年阴骨回宗炼宝', hint: '纯正鬼修手段 · 战斗（怨魂残煞）',
        combat: {
          enemy: 'ghost',
          win: {
            text: '你碾碎棺中涌出的残存剑煞怨灵，一把抄起镇墓玉印与上等阴骨！回宗交差换得大笔灵石与贡献，唯手掌隐隐发寒。',
            effects: { stones: 760, contribution: 320, items: ['jiuyou_mingjing'], karma: -35, demon: 8, expPct: 0.2 },
          },
          lose: {
            text: '千年剑煞凌厉得吓人，一击削破你的法袍将你轰出墓道，空手狼狈逃命。',
            effects: { hp: -60, karma: -15, demon: 5 },
          },
        },
      },
      {
        label: '以《幽冥渡魂经》先超度石棺内郁结两千年的不散剑煞，再合情取走玉印', hint: '神识检定 · 既成其安息又得重宝',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 神识: 0.014, 悟性: 0.012 },
          success: {
            text: '绵长鬼道渡魂咒荡开墓室死气，残存剑意化作青虹飞散天际。你坦然收起已无执念的玉印与灵丹，业力不损反增！',
            effects: { expPct: 0.22, karma: 20, stones: 550, contribution: 280, items: ['juling_dan'], lawExp: 24, lawId: 'karma' },
          },
          fail: {
            text: '超度半途激怒了残留剑意，逼得你抱头退出石室，只顺手摸走墓门旁几块灵石。',
            effects: { hp: -35, stones: 180, contribution: 90 },
          },
        },
      },
    ],
  },
  {
    id: 'wsa_ym_04', title: '魂灯暗市', pool: 'sect', tier: 3, weight: 7, minRealm: 1,
    require: 'sect() == "youming"',
    text: '每月十五子时，黄泉渡黑水河畔都会浮现一排没有面孔的「阴司货郎」。他们不收人间金银，摊位上摆满奇异的青灯与冥晶——每盏灯里都封着一段死去大修残留的记忆碎片、功法残篇或秘宝藏点。\n\n一名高瘦货郎用枯指推来两盏绿火摇曳的魂灯：「换吗？三百灵石买左边这盏，或者拿你一段最难忘的凡尘记忆，换右边这盏亮得吓人的紫灯。」',
    choices: [
      {
        label: '花 350 灵石买下左盏绿灯，绝不拿自己的记忆跟阴司做买卖', hint: '消耗 350 灵石 · 稳妥买宝',
        cost: { stones: 350 },
        outcome: {
          text: '捏碎绿灯，里面竟封着一名上古散修临死前记下的空间挪移心得与一颗九幽冥晶！稳赚不亏！',
          effects: { items: ['jiuyou_mingjing'], lawExp: 24, lawId: 'space', expPct: 0.16, attrs: { 神识: 2 } },
        },
      },
      {
        label: '割舍一段无关紧要的年少虚荣旧梦，换取右盏诡异紫灯', hint: '以忆换道 · 悟性与神识暴涨，略增心魔',
        outcome: {
          text: '你眉心一痛，似乎忘了某个早年曾让你辗转反侧的名字，却换来紫灯中一位化神鬼修毕生参悟的半缕法则本源！',
          effects: { expPct: 0.26, lawExp: 38, lawId: 'space', attrs: { 神识: 4, 悟性: 3 }, demon: 6, items: ['faze_canpian'] },
        },
      },
      {
        label: '反手拿出一枚多余灵丹与货郎讨价还价，探听九幽深处近况', hint: '魅力与神识检定 · 阴市老油条',
        roll: {
          p: 0.56, attrs: { 神识: 0.012, 魅力: 0.012 },
          success: {
            text: '货郎被你砍价砍得发出一阵干涩笑声，破例白送你一盏残缺魂灯与一份黄泉阴矿坐标！',
            effects: { stones: 450, items: ['yangshen_dan'], contribution: 180, attrs: { 神识: 2 } },
          },
          fail: {
            text: '货郎嫌你啰嗦，一吹灯火化作青烟消失在雾里，只留下满地冷露。',
            effects: { attrs: { 神识: 1 } },
          },
        },
      },
    ],
  },
  {
    id: 'wsa_ym_05', title: '渡不肯走之魂', pool: 'sect', tier: 2, weight: 7, minRealm: 1,
    require: 'sect() == "youming"',
    text: '黄泉渡东坡老槐树下蹲着一个身穿破烂皮甲的年轻亡魂，已经整整赖了七年不肯上渡船。不管谁去劝，他都死死抱住一截锈铁箭头不松手：「俺娘眼睛瞎了，俺走之前答应过她秋收回家修屋顶！不把屋顶修好，天王老子来俺也不投胎！」\n\n执事堂嫌他赖在渡口占地方，命你三日内把这倔鬼送走。',
    choices: [
      {
        label: '亲自御风飞去三百里外他老家，悄悄替瞎眼老母修好茅屋并留下一袋银钱，再带片新瓦回来', hint: '耗时一月 · 仁义鬼修，功德与道心暴涨',
        cost: { month: 1, stones: 120 },
        outcome: {
          text: '你将那片沾着阳光气息的新青瓦放在亡魂掌心。年轻兵卒捧着瓦片哭得像个孩子，朝你磕了三个响头，自己转身大步踏上了黄泉渡船。那一瞬，天降一缕温润功德没入你神魂！',
          effects: { karma: 50, demon: -20, attrs: { 道心: 4, 神识: 2 }, contribution: 240, lifespan: 10 },
        },
      },
      {
        label: '用幽冥幻术化作他母亲安康无恙的虚像哄他安心上船', hint: '善意谎言 · 省力完成任务',
        outcome: {
          text: '亡魂看着幻象里含笑缝衣的老妇，终于松开锈箭头安详散去。你收起招魂幡，心里却隐隐有点不是滋味。',
          effects: { contribution: 180, exp: 320, attrs: { 神识: 2 }, demon: 2 },
        },
      },
      {
        label: '请他留在黄泉渡当三十年护渡阴兵，由宗门按月派凡俗暗桩照料他老母余生', hint: '两全契约 · 既守鬼道规矩又安人子之心',
        outcome: {
          text: '兵卒擦干眼泪一口答应！从此黄泉渡多了一名最忠心耿耿的阴兵小将，执事堂大赞你把死活人的账算得滴水不漏！',
          effects: { contribution: 280, karma: 30, reputation: 30, attrs: { 魅力: 3, 神识: 2 } },
        },
      },
    ],
  },
  {
    id: 'wsa_ym_06', title: '阴司换契', pool: 'sect', tier: 3, weight: 7, minRealm: 2,
    require: 'sect() == "youming" && char.sectRank >= 1',
    text: '幽冥鬼道与真正的九幽阴司并非一家，而是隔着一条黑水河签下百年贡契的交易伙伴。今年恰逢百年换契之期，阴司派来的玄袍判官却骤然狮子大开口，要求鬼道今后每年的灵魂税翻倍，否则就切断黄泉渡的阴脉灵气！\n\n掌教命你带三箱冥晶赴黑水河心画舫谈判，既要压住阴司气焰，又不可真的彻底撕破脸。',
    choices: [
      {
        label: '亮出鬼道私藏的三座上古战场未收煞魂筹码，迫使判官按旧约续签', hint: '魅力与神识检定 · 鬼道铁腕外交',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 神识: 0.014, 魅力: 0.014 },
          success: {
            text: '你笑吟吟推开玉匣露出古战场阴图：「翻倍可以，但这三万古魂我们可就送给天音寺超度去了。」玄袍判官脸色骤变，咬牙乖乖按旧契落印，还反赠一柄阴司魂幡！',
            effects: { contribution: 420, reputation: 55, stones: 800, items: ['wanhun_fan'], attrs: { 神识: 3, 魅力: 3 } },
          },
          fail: {
            text: '判官冷笑不吃威胁，拍案掀翻茶盏，你只得多贴了三百灵石才勉强把贡契压回涨两成。',
            effects: { stones: -300, contribution: 180, attrs: { 悟性: 2 } },
          },
        },
      },
      {
        label: '当舫挑战判官座下勾魂使，用鬼道神通打赢一场「阴司斗法」定契', hint: '硬仗 · 九幽勾魂使',
        cost: { month: 1 },
        combat: {
          enemy: 'soul_reaper',
          win: {
            text: '黑水翻涌百丈，你一掌震断勾魂使锁链！玄袍判官眸光凝重，终于收起轻慢之心，不仅免去加税更奉上九幽冥晶以示结盟！',
            effects: { expPct: 0.26, contribution: 480, reputation: 65, items: ['jiuyou_mingjing'], lawExp: 35, lawId: 'space' },
          },
          lose: {
            text: '勾魂链抽伤你的元神，你稳住画舫不退半步，判官见鬼道尚有硬骨头，终究只微调了一成贡额。',
            effects: { hp: -75, mp: -50, contribution: 220, attrs: { 道心: 3 } },
          },
        },
      },
      {
        label: '另辟蹊径提出用丹霞灵丹与人族法器替代魂税，开启阴阳商路', hint: '奇思妙想 · 悟性与灵石双收',
        cost: { stones: 400 },
        outcome: {
          text: '阴司差役其实早就馋人间丹药法器！判官眼睛一亮爽快签字，从此黄泉渡成了阴阳两界最大走私枢纽，你赚得盆满钵满！',
          effects: { stones: 1250, contribution: 400, attrs: { 悟性: 3, 魅力: 2 } },
        },
      },
    ],
  },
  {
    id: 'wsa_ym_07', title: '尸将反噬', pool: 'sect', tier: 4, weight: 7, minRealm: 2,
    require: 'sect() == "youming" && char.sectRank >= 2',
    text: '血月凌空之夜，幽冥养尸崖底的九口玄铜大棺齐齐震响！当年你门中长老耗费六十年祭炼的「金甲旱魃」尸将竟在血月照耀下生出一丝嗜血恶智，挣碎贴在额头的控尸黄符，反手重创了原主人，正挥舞玄铜战戟杀向养尸崖外门药圃！',
    choices: [
      {
        label: '孤身迎战暴走旱魃尸将，以《幽冥渡魂经》重钉镇魂钉', hint: '恶战 · 阴煞尸将',
        cost: { month: 1 },
        combat: {
          enemy: 'corpse_general',
          win: {
            text: '七根玄铁镇魂钉精准贯入旱魃七窍！尸将仰天怒号一声终于屈服，被你彻底收编为护山重器！受伤长老感激涕零，赠你珍藏养神宝丹！',
            effects: { expPct: 0.26, contribution: 480, reputation: 65, items: ['yangshen_dan', 'jiuyou_mingjing'], attrs: { 神识: 3 } },
          },
          lose: {
            text: '旱魃尸毒透甲入骨，你拼死将其拖进寒泉陷阱才阻止了外门血案。',
            effects: { hp: -80, injury: 1, contribution: 260, items: ['jiexin_dan'] },
          },
        },
      },
      {
        label: '布起聚阴遮月阵挡住血月红光，切断旱魃暴走源头再行收服', hint: '悟性与神识检定 · 智破血月煞',
        cost: { month: 1 },
        roll: {
          p: 0.58, attrs: { 悟性: 0.014, 神识: 0.014 },
          success: {
            text: '黑雾大阵升空蔽月，金甲旱魃眼眶血光瞬间黯淡，乖乖退回玄铜棺中沉眠！宗门上下赞你沉着老辣！',
            effects: { contribution: 440, reputation: 55, lawExp: 34, lawId: 'array', attrs: { 悟性: 3, 神识: 3 }, stones: 600 },
          },
          fail: {
            text: '阵法刚起便被旱魃一戟劈碎一角，你只得硬扛着尸风拖到执法长老赶来合围。',
            effects: { hp: -55, contribution: 200 },
          },
        },
      },
      {
        label: '直接以烈火雷符将这具生出反骨的尸将彻底焚毁，永绝后患', hint: '果决毁尸 · 虽惹长老心疼，却获门下拥护',
        cost: { item: 'zhangxin_leifu' },
        outcome: {
          text: '一道五雷正火将金甲旱魃烧作焦灰，满崖外门弟子欢呼保命！原主人虽肉痛多年心血，却也不敢违背宗门大义，反倒记你救人有功。',
          effects: { karma: 30, contribution: 340, reputation: 50, demon: -12, attrs: { 道心: 3 } },
        },
      },
    ],
  },
  {
    id: 'wsa_ym_08', title: '归渡老同门', pool: 'sect', tier: 4, weight: 6, minRealm: 3,
    require: 'sect() == "youming" && char.sectRank >= 2',
    text: '幽冥鬼道最令人毛骨悚然却又莫名凄美的传统写在校场石碑上：「鬼道弟子不葬。他们死后，会自己走回黄泉渡。」\n\n秋雨绵绵的黄昏，渡口迷雾里果然一步步走来一具浑身插满断剑、双眼空洞却脊梁笔直的青衫残躯——那是五年前孤身赴东海探险失踪的沈师兄！他默默走到你面前，僵硬地从怀里掏出一卷沾满海水与黑血的玉简递过来，随即整具身躯化作一缕青灰，安详地飘向了黑水彼岸。',
    choices: [
      {
        label: '接过染血玉简，面向黑水长揖三拜，替沈师兄点一盏百年长明引魂灯', hint: '重情送归 · 得空间秘典与大道感悟',
        cost: { month: 1 },
        outcome: {
          text: '你展开玉简，里面是沈师兄拼死从东海裂缝拓回的《太虚挪移经》残章与他对生死的最后一句感言：「走了一万里，还是回家好。」那一夜你神魂大进，鬼道再无阴郁晦气，唯有苍凉豪情。',
          effects: { expPct: 0.3, lawExp: 52, lawId: 'space', demon: -20, attrs: { 神识: 4, 道心: 4 }, contribution: 480, items: ['yujian_xukong'] },
        },
      },
      {
        label: '追查沈师兄身上的断剑来历，立誓将来替老同门讨回东海血债', hint: '铭记血仇 · 战意与修为大增',
        cost: { month: 1 },
        outcome: {
          text: '你认出断剑上刻着上界巡查使暗桩的徽记！收起玉简与断剑，你眼中寒意凝如玄冰，破境之心从未如此坚定！',
          effects: { expPct: 0.32, breakBonus: 14, lawExp: 45, lawId: 'space', attrs: { 根骨: 3, 神识: 3 }, contribution: 460, reputation: 65, flag: { 沈兄断剑: true } },
        },
      },
      {
        label: '将玉简公之于黄泉渡藏经阁，以沈师兄之名立传令全宗铭记', hint: '扬同门英名 · 声望与业力大涨',
        outcome: {
          text: '幽冥鬼道虽被称为魔道，却也有自己的忠义风骨。全宗弟子齐聚渡口为沈师兄点起千盏绿灯，灯火映红整条黄泉河。',
          effects: { karma: 40, reputation: 80, contribution: 540, attrs: { 魅力: 3, 道心: 3 }, lawExp: 36, lawId: 'karma' },
        },
      },
    ],
  },
  {
    id: 'wsa_ym_09', title: '鬼灯夜行 · 百鬼借道', pool: 'world', tier: 2, weight: 7, minRealm: 1,
    text: '荒岭浓雾锁道，三更时分忽闻一阵清脆却瘆人的铜铃声。官道前方漂浮着十二盏惨绿灯笼，一名斗笠黑袍的幽冥鬼道引魂客正领着数十道透明亡魂缓缓前行，逢人便低声唱喝：\n\n「生人回避，百鬼借道——莫回头，莫吹灯，莫问队伍里有没有你的故人。」',
    choices: [
      {
        label: '依古礼退至路旁三步熄火垂目，静待引魂队伍安然通过', hint: '守夜行礼数 · 获引魂客隔空回礼',
        outcome: {
          text: '阴风擦面而过，黑袍引魂客走到你身前略停半息，悄然丢下一颗微温的养神小丹与一枚九幽冥晶碎块：「懂规矩的活人，走夜路少碰晦气。」',
          effects: { items: ['jiuyou_mingjing'], demon: -8, attrs: { 神识: 2, 道心: 2 } },
        },
      },
      {
        label: '仗着正道修为挥兵拦截，查验队伍里是否混着被强拘的活人生魂', hint: '战斗 · 怨魂（引魂护卫）',
        combat: {
          enemy: 'ghost',
          win: {
            text: '你劈开鬼雾一看，果然有两个刚被恶修勾走的凡人活魂混在队尾！引魂客冷哼遁走，你救回生魂送返肉身，功德清气大涨！',
            effects: { expPct: 0.2, karma: 45, reputation: 40, demon: -12, stones: 260 },
          },
          lose: {
            text: '百鬼齐啸震伤你的识海，引魂客冷笑拂袖领队远去，留你在雾里头痛欲裂。',
            effects: { hp: -45, mp: -35, attrs: { 神识: 1 } },
          },
        },
      },
      {
        label: '远远抛出五十灵石向引魂客讨一盏「避祟小绿灯」护身赶夜路', hint: '消耗 50 灵石 · 购得实用阴符',
        cost: { stones: 50 },
        outcome: {
          text: '引魂客接过灵石哑声一笑，抛来一张护心鬼符：「往后进了乱葬岗，小鬼见它绕道走。」',
          effects: { items: ['huxin_fu'], attrs: { 气运: 1 } },
        },
      },
    ],
  },
  {
    id: 'wsa_ym_10', title: '冥河截魂 · 鬼道与天音', pool: 'world', tier: 4, weight: 6, minRealm: 2,
    text: '中州白骨渡口风云翻卷！一名昔年力战北荒魔潮而陨落的元婴英雄残魂刚刚浮出江面，幽冥鬼道与天音寺竟同时赶到——\n\n幽冥黑袍执事祭出九幽招魂幡欲将其接入黄泉渡修鬼仙再续一世；天音寺僧众则敲响铜钟，坚称唯有立刻佛光超度方免堕落魔道！两派隔江对峙，那缕英雄残魂在钟声与鬼雾拉扯间痛苦颤抖。',
    choices: [
      {
        label: '护住残魂喝止两派拉扯，直接问英雄残魂自己愿投胎还是修鬼仙', hint: '尊重死者遗愿 · 道心与魅力检定',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 道心: 0.014, 魅力: 0.012 },
          success: {
            text: '英雄残魂苦笑抱拳：「北荒未平，我还没杀够——愿随幽冥再执一次枪！」天音寺僧众闻言合掌叹息退步，幽冥执事惊异于你的公允，与英雄残魂双双赠你重宝！',
            effects: { karma: 40, reputation: 70, items: ['jiuyou_mingjing', 'poxie_fu'], lawExp: 32, lawId: 'karma', attrs: { 道心: 3, 魅力: 3 } },
          },
          fail: {
            text: '两宗各有执念谁都不肯听你调解，冲突余波震散了半缕残魂，令你唏嘘不已。',
            effects: { hp: -40, attrs: { 悟性: 2 } },
          },
        },
      },
      {
        label: '出手助天音寺斩断招魂幡锁链，护送英雄英灵安然超度', hint: '站在佛门 · 战斗（阴煞尸将同阶鬼修）',
        combat: {
          enemy: 'corpse_general',
          win: {
            text: '金光笼罩江面，英雄残魂含笑化虹归天！天音寺奉上重谢，正道声望大增！',
            effects: { expPct: 0.24, karma: 50, reputation: 65, demon: -18, items: ['bingxin_dan'] },
          },
          lose: {
            text: '鬼道阴风刺骨将你击伤，好在拖延的片刻已足够天音梵音完成半数超度。',
            effects: { hp: -70, karma: 25, reputation: 25 },
          },
        },
      },
      {
        label: '暗助幽冥鬼道顺走英雄残魂，换取鬼道阴市稀缺宝物', hint: '偏向幽冥 · 得冥晶与法宝，略损业力',
        outcome: {
          text: '你一招惊乱天音铜钟节奏，幽冥执事趁势收魂入灯大笑遁走，临行丢来一袋灵石与万魂招煞幡相谢。',
          effects: { stones: 750, items: ['wanhun_fan'], karma: -35, demon: 8 },
        },
      },
    ],
  },
  {
    id: 'wsa_ym_11', title: '幽冥阴市 · 魂灯问故人', pool: 'world', tier: 4, weight: 6, minRealm: 3,
    text: '中元节子夜，幽冥鬼道破例在落霞城外十里孤丘支起一座「问故人灯棚」。棚中只点着一盏惨白长生灯，守棚鬼婆沙哑开口：「凡尘修仙动辄数百年，总有那么一两个早就化作黄土的故人，你临别没来得及说上一句话吧？六百灵石，点一盏溯魂灯，准你隔着阴阳说三句。」',
    choices: [
      {
        label: '放下 600 灵石点亮溯魂灯，向早逝故人低语三句未尽之言', hint: '消耗 600 灵石 · 尽释尘缘，心魔清零般大减',
        cost: { stones: 600 },
        outcome: {
          text: '灯影摇晃间，那张早已模糊在岁月里的笑脸竟真的朝你轻轻点了点头。三句话毕灯火熄灭，你眼眶微湿却浑身轻松，积郁百年的心魔执念顷刻烟消云散！',
          effects: { demon: -40, attrs: { 道心: 6, 神识: 3 }, breakBonus: 14, lawExp: 35, lawId: 'karma' },
        },
      },
      {
        label: '不问私情，改向鬼婆买一盏上古陨落剑修的残灯参悟遗法', hint: '消耗 600 灵石 · 务实求道',
        cost: { stones: 600 },
        outcome: {
          text: '残灯青烟里现出三式凌厉绝伦的断空古剑与半缕空间感悟，助你修为与法则齐头并进！',
          effects: { expPct: 0.26, lawExp: 42, lawId: 'space', attrs: { 悟性: 3, 神识: 3 } },
        },
      },
      {
        label: '淡然摇头「死者已矣，生者前行」，在棚外静坐品茶观世人悲欢', hint: '大彻大悟 · 稳增道心与寿元',
        outcome: {
          text: '你看了一夜前来点灯的王侯、剑客与老妪，忽然读懂了长生路上最重的不是孤单，而是记得。',
          effects: { demon: -18, lifespan: 20, attrs: { 道心: 4, 悟性: 2 } },
        },
      },
    ],
  },
  {
    id: 'wsa_ym_c1', title: '十殿阎罗试 · 鬼门初叩', pool: 'sect', tier: 4, weight: 7, minRealm: 2,
    require: 'sect() == "youming"',
    once: true,
    text: '九幽黑水尽头，终年隐没在阴雾里的巨大青铜「鬼门关」今夜轰然洞开！门内隐隐传来十殿阎罗殿的威严判官木声——这是幽冥鬼道历代唯有最得九幽垂青的真传方能踏入的「十殿试炼」。\n\n掌教提着一盏苍白魂灯立于渡口：「活着走进鬼门关，再活着走出来，你便是黄泉执灯人；走不出来，便早些替宗门守门吧。」',
    choices: [
      {
        label: '接过掌教苍白魂灯，独步踏过森寒彻骨的青铜鬼门关', hint: '神识与道心检定 · 稳执魂灯入二关',
        cost: { month: 1 },
        roll: {
          p: 0.58, attrs: { 神识: 0.015, 道心: 0.012 },
          success: {
            text: '鬼门关万千阴风扑面，你掌中魂灯却纹丝不动、青光暴涨三尺！两侧阴兵齐齐垂戟致意，为你让开通往孽镜殿的黄泉古道！',
            effects: { expPct: 0.22, lawExp: 28, lawId: 'space', attrs: { 神识: 3, 道心: 2 }, flag: { 鬼门灯明: true } },
            goto: 'wsa_ym_c2',
          },
          fail: {
            text: '阴风吹熄了半截灯芯，无数鬼手自石砖下伸出拉扯你的脚踝！你强催元神震碎黑爪，喘息着闯进了孽镜殿。',
            effects: { hp: -50, mp: -45, attrs: { 神识: 2 }, lawExp: 16, lawId: 'space' },
            goto: 'wsa_ym_c2',
          },
        },
      },
      {
        label: '以一块九幽冥晶投入灯盏稳固魂火，从容过关', hint: '消耗九幽冥晶 · 轻松踏入二关',
        cost: { item: 'jiuyou_mingjing', month: 1 },
        outcome: {
          text: '冥晶化作湛蓝幽火照亮十里黑雾，鬼门关内阴煞退避三舍，你闲庭信步踏入十殿核心！',
          effects: { expPct: 0.22, lawExp: 34, lawId: 'space', attrs: { 神识: 3, 悟性: 2 }, flag: { 鬼门灯明: true } },
          goto: 'wsa_ym_c2',
        },
      },
      {
        label: '自省元神尚未稳固，暂退渡口待修为更深再来叩关', hint: '稳妥止步 · 错失十殿传承',
        outcome: {
          text: '青铜鬼门缓缓合拢。掌教轻拍你肩头：「生死之门，不怕晚，只怕急。」',
          effects: { attrs: { 神识: 2 }, contribution: 140 },
        },
      },
    ],
  },
  {
    id: 'wsa_ym_c2', title: '十殿阎罗试 · 孽镜照魂', pool: 'branch', tier: 5, weight: 0,
    text: (s) => `孽镜高悬十丈，幽光照彻你生平一切善恶功过！镜前立着一尊身披冥铁重甲、手持断魂大戟的「鬼王」守殿者，开口便如千人齐哭。\n\n${s.flags['鬼门灯明'] ? '你掌中魂灯亮如明月，竟将孽镜的摄魂威压挡开大半！' : '孽镜幽光直照识海深处，勾动你平生一切罪业与恐惧化作实质枷锁！'}\n\n「生人擅闯十殿，先过孽镜，再过本王手中锁魂戟！」`,
    choices: [
      {
        label: '提魂灯化利刃正面迎战守殿鬼王，以绝强元神将其镇压', hint: '硬仗 · 鬼王',
        cost: { month: 1 },
        combat: {
          enemy: 'ghost_king',
          win: {
            text: '幽冥神光劈裂冥铁重甲！鬼王仰天长啸轰然跪伏，孽镜轰鸣开启，露出十殿深处悬着判官朱笔的「轮回石台」！',
            effects: { expPct: 0.28, lawExp: 45, lawId: 'space', attrs: { 神识: 4, 根骨: 2 }, flag: { 孽镜伏王: true } },
            goto: 'wsa_ym_c3',
          },
          lose: {
            text: '鬼王断魂戟震裂你的护魂光幕，你呕出一口阴血却死死托住魂灯不灭！鬼王赞叹一声「硬骨头」，退开半步放行。',
            effects: { hp: -80, mp: -50, attrs: { 道心: 3 }, lawExp: 24, lawId: 'space' },
            goto: 'wsa_ym_c3',
          },
        },
      },
      {
        label: '直面孽镜朗声自陈生平善恶绝无半句欺瞒，以坦荡因果破镜镇鬼', hint: '道心与神识检定 · 无愧于心',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 道心: 0.015, 神识: 0.014 },
          success: {
            text: '「善是我做，恶亦我担，何须你这面破镜替我记账！」孽镜骤然发出清越鸣响主动让路，鬼王收戟躬身相送！',
            effects: { expPct: 0.26, demon: -26, lawExp: 50, lawId: 'karma', attrs: { 道心: 5, 神识: 3 }, flag: { 孽镜伏王: true } },
            goto: 'wsa_ym_c3',
          },
          fail: {
            text: '孽镜照出几处深藏心结，反震伤你神魂，好在拼尽灵力守住了灵台清明，跌跌撞撞闯入轮回石台。',
            effects: { hp: -55, mp: -55, demon: 5, lawExp: 22, lawId: 'karma' },
            goto: 'wsa_ym_c3',
          },
        },
      },
    ],
  },
  {
    id: 'wsa_ym_c3', title: '十殿阎罗试 · 判官执笔', pool: 'branch', tier: 5, weight: 0,
    text: (s) => `轮回石台之上没有阎罗王，唯有一支凌空旋转的「阴阳判官笔」与一册空白生死簿。${s.flags['孽镜伏王'] ? '判官笔发出欣喜清鸣自动落入你掌心，九幽黄泉河水竟为你倒流三尺！' : '判官笔微微垂落，等待通过考验的鬼道真传落下自己的一笔。'}\n\n「生者知死之重，死者念生之贵——这便是幽冥鬼道最深处的真经。」`,
    choices: [
      {
        label: '执阴阳判官笔勾勒九幽裂隙，专精空间折跃与放逐大道', hint: '空间法则大成 · 得《太虚挪移经》与称号',
        cost: { month: 2 },
        outcome: {
          text: '笔锋一划，九幽与阳世的界壁在你眼前宛如薄纸！走出鬼门关之日，百鬼俯首、全宗鸣灯，尊你为「黄泉执灯」尊者！',
          effects: { expPct: 0.36, lawExp: 90, lawId: 'space', attrs: { 神识: 6, 悟性: 4 }, contribution: 680, reputation: 95, items: ['yujian_xukong', 'xukong_jing'], title: '黄泉执灯', flag: { 黄泉执灯: true } },
        },
      },
      {
        label: '在生死簿上添写众生因果轮回真意，以鬼道参透生死延寿之秘', hint: '因果法则与寿元大进 · 得奇珍玉简',
        cost: { month: 2 },
        outcome: {
          text: '你从生死交界处偷得一缕不朽生机，不仅寿元暴涨、神魂堪比鬼仙，更洞悉万千因果命数！',
          effects: { expPct: 0.34, lawExp: 88, lawId: 'karma', lifespan: 85, demon: -28, attrs: { 神识: 5, 道心: 5 }, contribution: 640, reputation: 90, items: ['yujian_yinguo', 'tiandao_lotus'], title: '黄泉执灯', flag: { 黄泉执灯: true } },
        },
      },
    ],
  },

  /* ========================================================================
   * 十三、散修联盟（sanxiu · 14 节点）
   * 风味：无靠山无月例唯有一条命与自由、互助酒肆、秘境分赃、护镇抗世家、赏金猎盟、逍遥散盟三段链
   * ======================================================================== */
  {
    id: 'wsa_sx_01', title: '散修互助酒肆', pool: 'sect', tier: 2, weight: 8, minRealm: 0,
    require: 'sect() == "sanxiu"',
    text: '落霞城外西十里的「破碗居」没有大宗的雕梁画栋，只有一块被刀剑砍得坑坑洼洼的榆木悬赏板，和一坛三块下品灵石管够的糙米烧酒。\n\n今夜酒肆挤满了风尘仆仆的散修：墙角一个断了半截小指的炼气老散修正咳嗽着摊开一张发黄兽皮图，压低嗓音吆喝：「青牛北坡新塌了个古修洞口，一个人进去十死无生！缺个手脚利索的搭伙，得了东西对半分——谁敢跟我喝这碗壮行酒？」',
    choices: [
      {
        label: '端起粗瓷碗一饮而尽，与老散修搭伙探那处塌陷古洞', hint: '气运与神识检定 · 散修拼的就是胆气',
        cost: { month: 1 },
        roll: {
          p: 0.58, attrs: { 气运: 0.014, 神识: 0.01 },
          success: {
            text: '洞里果然藏着两头毒蟾与半间完好药室！你们背靠背杀出洞口，老散修居然是个讲信义的硬汉，真的把灵草与灵石一分不差劈成两半！',
            effects: { expPct: 0.18, stones: 340, items: ['lingcao', 'peiyuan_dan'], contribution: 180, attrs: { 气运: 2 } },
          },
          fail: {
            text: '古洞早已塌得只剩半截空石室，还惊动了窝毒蜂蜇得你们满头包，两人回到酒肆对着苦笑又干了两碗糙酒。',
            effects: { hp: -25, attrs: { 根骨: 1 }, contribution: 80 },
          },
        },
      },
      {
        label: '不贪古洞横财，花五十灵石请满屋散修喝一轮热酒换取各地野路消息', hint: '消耗 50 灵石 · 结交草莽人脉',
        cost: { stones: 50 },
        outcome: {
          text: '酒肆里顿时哄堂叫好！你一晚听全了青牛山野药点、落霞城黑市暗价与避开大宗巡查的野道，比啃三年玉简都管用！',
          effects: { exp: 320, attrs: { 魅力: 2, 悟性: 2 }, reputation: 25, contribution: 140 },
        },
      },
      {
        label: '细查榆木悬赏板，挑一桩无人肯接的护送凡人药商苦差挣稳当钱', hint: '踏实跑腿 · 稳赚灵石与经验',
        cost: { month: 1 },
        outcome: {
          text: '大宗弟子嫌赚得少，恶修嫌油水薄，正好便宜了你。一路风餐露宿护着药商平安进城，拿到实在灵石与两瓶回灵丹。',
          effects: { stones: 280, items: ['huiling_dan'], karma: 15, contribution: 150 },
        },
      },
    ],
  },
  {
    id: 'wsa_sx_02', title: '秘境分赃局', pool: 'sect', tier: 3, weight: 8, minRealm: 1,
    require: 'sect() == "sanxiu"',
    text: '你们五个互不相识的散修拼死杀出荒谷秘境，躲进一处火把摇曳的潮湿岩洞清点战利品——石地上摆着一枚珍贵筑基丹、两瓶聚灵丹、和八百块灵石，却少了整整两份！\n\n洞内空气骤然凝固。刚才并肩抗兽的红脸刀客手指悄悄按上刀柄，瘦猴阵修也暗中捏紧了符纸——散修组队最凶险的从来不是妖兽，而是出洞后的「分赃局」。',
    choices: [
      {
        label: '朗声提议当场竞价：谁要筑基丹，谁给另外四人补足灵石', hint: '魅力与道心检定 · 镇住人心立散修规矩',
        roll: {
          p: 0.58, attrs: { 魅力: 0.014, 道心: 0.012 },
          success: {
            text: '众人愣了一息，竟齐齐松开兵刃点头称善！最急需破境的瘦猴拿走筑基丹、掏空积蓄补了你们一大笔灵石，五人破天荒地没动刀子，反倒成了固定搭伙班底！',
            effects: { stones: 680, contribution: 280, reputation: 40, attrs: { 魅力: 3, 道心: 2 }, items: ['juling_dan'] },
          },
          fail: {
            text: '红脸刀客冷哼一声不买账，抄起筑基丹便想抢跑！一阵混战后大家各自抓了一把散落灵石不欢而散。',
            effects: { hp: -40, stones: 260, contribution: 90 },
          },
        },
      },
      {
        label: '先发制人震慑最有杀意的红脸刀客，以实力主掌分赃次序', hint: '硬碰硬 · 战斗（断魂刀客）',
        combat: {
          enemy: 'blade_rogue', displayName: '红脸刀客',
          win: {
            text: '你三招卸掉刀客鬼头刀，踩着他胸口冷声道：「按出力分，谁敢黑吃黑先过我这关！」其余三人顿时服服帖帖，将头彩筑基丹拱手让给你！',
            effects: { expPct: 0.22, items: ['zhuji_dan'], stones: 480, contribution: 320, reputation: 35 },
          },
          lose: {
            text: '刀客与另一人暗中早有勾结围攻于你，你拼死扯过一瓶聚灵丹跳崖遁走，暗暗记住散修江湖人心险恶。',
            effects: { hp: -60, items: ['juling_dan'], attrs: { 道心: 2 } },
          },
        },
      },
      {
        label: '趁他们剑拔弩张时主动放弃筑基丹，只拿稳妥的三百来块灵石和一瓶聚灵丹先行离洞', hint: '不贪绝头 · 聪明保命',
        outcome: {
          text: '你退让得痛快，无人拦你。走出三里后听见身后岩洞炸响法术轰鸣，你摸了摸怀里热乎乎的灵石，轻笑一声继续赶路。',
          effects: { stones: 320, items: ['juling_dan'], attrs: { 悟性: 2, 气运: 2 }, contribution: 140 },
        },
      },
    ],
  },
  {
    id: 'wsa_sx_03', title: '护镇抗世家', pool: 'sect', tier: 3, weight: 8, minRealm: 1,
    require: 'sect() == "sanxiu"',
    text: '白沙镇是几百名底层散修好不容易在荒原边缘搭起来的安身坊市，不交大宗门税，彼此守望相助。可今晨镇口却来了二十名骑着灵马的落霞世家供奉，一脚踹翻了牌坊！\n\n领头执事居高临下扬起地契：「这片灵脉从今日起归我族管辖！所有野狗散修，要么每月交五成收益当保护费，要么天黑前滚出白沙镇！」镇民与散修们攥紧了锈剑，却没人敢先出头对抗筑基后期的世家强修。',
    choices: [
      {
        label: '第一个站上碎牌坊迎战世家领头供奉，替白沙镇散修争一口尊严', hint: '血战 · 筑基修士（世家供奉）',
        cost: { month: 1 },
        combat: {
          enemy: 'cultivator',
          win: {
            text: '你一招击碎世家供奉锦袍护罩，满镇散修顿时热血沸腾齐声呐喊拔刃！世家骑队见犯了众怒讨不到便宜，灰溜溜夹着尾巴逃回落霞城！从此白沙镇奉你为头号客卿！',
            effects: { expPct: 0.22, karma: 35, reputation: 55, contribution: 360, stones: 520, attrs: { 道心: 3, 魅力: 3 }, flag: { 白沙护镇: true } },
          },
          lose: {
            text: '你被供奉打得吐血跌下石阶，可满镇散修被你的血性彻底激醒，数十人一拥而上硬把世家狗腿赶出了镇口！',
            effects: { hp: -65, injury: 1, karma: 30, reputation: 45, contribution: 240, attrs: { 道心: 3 } },
          },
        },
      },
      {
        label: '连夜联络周边三个散修集市联名立「互保盟约」，逼世家知难而退', hint: '魅力与悟性检定 · 聚散成势',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 魅力: 0.015, 悟性: 0.012 },
          success: {
            text: '次日黎明，三百名各路散修提着杂牌法器把镇口围得水泄不通！世家执事脸都绿了，赶紧赔笑说「误会一场」连夜撤走！散修联盟雏形由你一手撑起！',
            effects: { reputation: 60, contribution: 380, karma: 30, stones: 450, attrs: { 魅力: 4, 悟性: 2 } },
          },
          fail: {
            text: '散修们向来一盘散沙，大半不肯为了别镇得罪世家。最后大家只能凑钱交了一笔买路灵石暂缓风波。',
            effects: { stones: -180, contribution: 120, attrs: { 道心: 2 } },
          },
        },
      },
      {
        label: '暗中摸清这支世家供奉的私盐走私丑闻，直接递给正道执法队借刀赶人', hint: '智斗世家 · 滴血不流解镇围',
        outcome: {
          text: '三天后世家大宅自家后院起火，忙着应付正道追查，哪还顾得上吞并白沙镇！镇上老掌柜笑得合不拢嘴，送你一瓶上好疗伤丹与灵石。',
          effects: { contribution: 280, stones: 380, items: ['bixue_dan'], attrs: { 悟性: 3 } },
        },
      },
    ],
  },
  {
    id: 'wsa_sx_04', title: '赏金猎盟', pool: 'sect', tier: 3, weight: 7, minRealm: 1,
    require: 'sect() == "sanxiu"',
    text: '中州各大坊市联名贴出千金红榜：臭名昭著的嗜血魔修「血蝠道人」连屠三支商队，躲进苍茫山溶洞疗伤。大宗弟子嫌钻毒洞脏手，倒成了散修赏金猎人眼里的肥肉！\n\n三名身怀绝技的散修——一个善追踪的老猎户、一个精毒药的瘸腿女医、一个背巨斧的体修大汉——邀你凑齐四人小队共分赏金。',
    choices: [
      {
        label: '担任正面主攻杀入溶洞，配合队友毒烟陷阱斩杀嗜血妖徒', hint: '恶战 · 嗜血蝠妖（血蝠道人本命妖身）',
        cost: { month: 1 },
        combat: {
          enemy: 'blood_bat',
          win: {
            text: '四人配合竟比大宗战阵还要刁钻凶狠！你一击断其妖翼，大汉补斧了结！领回千金红榜后按功平分，你独得一大笔赏金与名声！',
            effects: { expPct: 0.22, stones: 780, reputation: 50, karma: 30, contribution: 340, items: ['bixue_dan'] },
          },
          lose: {
            text: '溶洞狭窄被血蝠声波震伤耳膜，幸亏瘸腿女医撒出解瘴烟掩护四人逃出生天。',
            effects: { hp: -60, items: ['jiexin_dan'], contribution: 130 },
          },
        },
      },
      {
        label: '提议不硬闯毒洞，改在洞口布下连环陷坑与赤阳火油逼其自投罗网', hint: '悟性与神识检定 · 低损领赏',
        cost: { month: 1 },
        roll: {
          p: 0.58, attrs: { 悟性: 0.014, 神识: 0.012 },
          success: {
            text: '浓烟灌进溶洞，血蝠道人呛得一头冲出洞口正中巨网与火阵，连大招都没放出便束手就擒！四人欢天喜地进城领赏大醉三日！',
            effects: { stones: 720, contribution: 320, karma: 25, attrs: { 悟性: 3 }, reputation: 45 },
          },
          fail: {
            text: '血蝠道人另掘了后洞逃之夭夭，只留下一窝发臭蝠粪，四人白忙活了半个月。',
            effects: { contribution: 90, attrs: { 神识: 2 } },
          },
        },
      },
      {
        label: '察觉那名巨斧大汉眼神闪烁恐有黑吃黑之意，婉拒组队独自去捡漏外围贼赃', hint: '散修直觉 · 谨慎避险小赚一笔',
        outcome: {
          text: '果然！半月后听说那支小队分赏时内讧死了两个。而你早在外围顺手摸走了血蝠道人埋在枯树下的一小箱赃款灵石。',
          effects: { stones: 420, attrs: { 神识: 2, 气运: 2 }, contribution: 150 },
        },
      },
    ],
  },
  {
    id: 'wsa_sx_05', title: '摆摊易物', pool: 'sect', tier: 2, weight: 8, minRealm: 0,
    require: 'sect() == "sanxiu"',
    text: '落霞城外十里的「鬼灯夜集」专门供没钱租坊市铺面的散修席地摆摊。你铺开一块破油布，摆出几捆山草与闲置杂物，隔壁摊主是个缺了门牙的老散修，正愁眉苦脸地叫卖三块黑漆漆的奇异矿石与半卷被虫蛀了边角的旧功法。\n\n老散修瞥了你一眼：「小兄弟，大宗弟子眼高于顶看不上咱这破烂。咱俩以物易物，或者拿百来块灵石捡个漏？」',
    choices: [
      {
        label: '细细以神识扫过那三块黑矿与虫蛀旧卷，花 180 灵石精准淘货', hint: '消耗 180 灵石 · 气运与神识检定捡大漏',
        cost: { stones: 180 },
        roll: {
          p: 0.62, attrs: { 气运: 0.015, 神识: 0.012 },
          success: {
            text: '刮掉外面一层黑泥，里面竟是一块上好玄铁与一卷完好无损的《黄庭养气简》！你激动得心跳加速，散修夜集果然卧虎藏龙！',
            effects: { items: ['xuantie', 'yujian_yangshen'], attrs: { 气运: 2 }, contribution: 140 },
          },
          fail: {
            text: '回去一洗才发现矿石只是普通乌铁，旧卷缺了最关键的运功口诀，倒也练了回眼力。',
            effects: { attrs: { 悟性: 2 }, contribution: 60 },
          },
        },
      },
      {
        label: '高声吆喝帮自己和老散修一起兜售杂货，靠口才把烂货卖出好价钱', hint: '魅力检定 · 练就坊市营生本事',
        roll: {
          p: 0.6, attrs: { 魅力: 0.015, 气运: 0.01 },
          success: {
            text: '你三寸不烂之舌把几株寻常山草夸出花来，连路过的世家仆役都爽快买单！散摊时你数着鼓囊囊的灵石袋，老散修塞给你两张神行符当谢礼！',
            effects: { stones: 460, items: ['shenxing_fu'], attrs: { 魅力: 2 }, contribution: 160 },
          },
          fail: {
            text: '吆喝得嗓子冒烟也没几个冤大头上钩，只勉强卖出了几十块灵石填饱肚子。',
            effects: { stones: 95, attrs: { 魅力: 1 }, contribution: 70 },
          },
        },
      },
      {
        label: '拿一株百年灵草与老散修互换他多年的荒野保命杂记', hint: '消耗百年灵草 · 稳涨见识与修为',
        cost: { item: 'lingcao' },
        outcome: {
          text: '老散修感动不已，把一本写满荒野避妖、辨毒、假死脱身诀窍的油纸册子郑重交给你。翻完一遍，你的修为与气运悄然见长！',
          effects: { exp: 380, attrs: { 气运: 2, 悟性: 2 }, contribution: 150 },
        },
      },
    ],
  },
  {
    id: 'wsa_sx_06', title: '散修义诊与换丹', pool: 'sect', tier: 3, weight: 7, minRealm: 2,
    require: 'sect() == "sanxiu"',
    text: '没有宗门丹堂撑腰，散修冲关破境最难的就是凑齐一颗筑基丹或结金丹。五名常在白沙镇碰头的老散修凑在一起，把各自压箱底的千年灵草、妖兽内丹全摊在木桌上，打算合资请一位路过的丹霞谷隐世老丹师开一炉宝丹。\n\n然而开炉灵材还差最后一味灵石与护炉人手，老丹师脾气古怪：「药材凑齐，还须找个信得过的人守炉七日——炸炉风险大伙平摊，成丹按股分！」',
    choices: [
      {
        label: '出资 360 灵石入股并亲自守炉七日，与众散修共赌这一炉破境仙丹', hint: '消耗 360 灵石 · 悟性与气运检定',
        cost: { stones: 360, month: 1 },
        roll: {
          p: 0.62, attrs: { 悟性: 0.012, 气运: 0.014 },
          success: {
            text: '七日炉开，竟罕见地一次凝出六枚浑圆饱满的结金丹！五名老散修喜极而泣跪谢苍天，分你最亮的一枚成丹与老丹师随手传下的控火诀窍！',
            effects: { items: ['jiejin_dan'], lawExp: 26, lawId: 'pill', contribution: 340, reputation: 45, attrs: { 气运: 2, 悟性: 2 } },
          },
          fail: {
            text: '第五日地火微偏，成丹只得两枚残次聚灵丹。众散修叹了口气仍按约分给你一瓶，没人埋怨半句——这便是散修的命。',
            effects: { items: ['juling_dan'], contribution: 160, attrs: { 道心: 2 } },
          },
        },
      },
      {
        label: '免费替众散修护炉防备外敌觊觎，不占主丹只求几瓶疗伤回灵边角药', hint: '仗义疏财 · 业力与人望暴涨',
        cost: { month: 1 },
        outcome: {
          text: '七日里你独自击退两波闻香摸来的窃贼，众散修感激不尽，不仅送你大还丹与清心丹，更在白沙镇立誓日后你有难必倾力相助！',
          effects: { karma: 45, reputation: 60, contribution: 380, items: ['dahuan_dan', 'qingxin_dan'], attrs: { 魅力: 3, 道心: 2 } },
        },
      },
      {
        label: '帮老丹师改良控火风道换取他私下指点半月丹理', hint: '偷师丹道 · 悟性与法则成长',
        cost: { month: 1 },
        outcome: {
          text: '老丹师没想到草莽散修里还有这等灵慧之人，欣然留你喝茶聊丹半月，让你省去数年摸索之苦！',
          effects: { expPct: 0.2, lawExp: 32, lawId: 'pill', attrs: { 悟性: 3 }, contribution: 220 },
        },
      },
    ],
  },
  {
    id: 'wsa_sx_07', title: '无门之耻与傲骨', pool: 'sect', tier: 3, weight: 7, minRealm: 2,
    require: 'sect() == "sanxiu"',
    text: '中州灵脉大开，一家名门大宗的外事管事巡查坊市时看中了你的修为与根骨，摇着折扇满脸施舍地抛来一块外门杂役玉牌：「散修终究是野路子，没功法没靠山，走到头也就这点出息。跪下磕三个头、交出你一半身家当拜师礼，本管事破例赏你一个扫山杂役名额！」\n\n茶楼里十几名散修听得齐齐停下筷子，目光复杂地看着你。',
    choices: [
      {
        label: '笑着一脚把玉牌踢回管事脚下：「天地为宗、自由为剑，你家山门太小，装不下我！」', hint: '不屈傲骨 · 战斗（挑衅护卫：孤鸿剑修同阶）',
        combat: {
          enemy: 'sword_rogue', displayName: '大宗护卫',
          win: {
            text: '三招击溃管事护卫，全楼散修轰然拍案叫绝！管事脸色铁青落荒而逃，你大笑买单请全楼共饮，散修自由风骨响彻坊市！',
            effects: { expPct: 0.24, reputation: 70, contribution: 420, demon: -18, attrs: { 道心: 5, 气运: 2 } },
          },
          lose: {
            text: '大宗护卫法宝精良将你震退撞翻茶桌，你擦去嘴角血丝却笑得更狂：「今日我记住了，他日我亲自上你山门还礼！」满楼散修起立扶你，敬意更甚！',
            effects: { hp: -70, reputation: 45, contribution: 260, attrs: { 道心: 4 } },
          },
        },
      },
      {
        label: '不怒不吵，端起粗茶淡淡道「道不同不相为谋，管事请便」，转身洒脱离去', hint: '宠辱不惊 · 道心与心境双修',
        outcome: {
          text: '管事一拳打在棉花上讪讪收起玉牌。茶楼角落一名隐世的结丹老散修朝你举杯致敬，顺手塞给你一枚私藏的聚灵阵符：「不气不馁，散修最珍贵的就是这副清醒骨头。」',
          effects: { items: ['juling_zhenfu'], demon: -14, attrs: { 道心: 4, 悟性: 2 }, contribution: 240 },
        },
      },
      {
        label: '反问管事「贵宗真传月例几何？不如我出灵石雇你们外门替我跑腿？」当众戏谑回击', hint: '魅力与气运检定 · 满堂爆笑扬名',
        roll: {
          p: 0.56, attrs: { 魅力: 0.015, 气运: 0.012 },
          success: {
            text: '一句话惹得满楼散修笑倒一片，把那趾高气扬的管事臊得满脸通红抱头鼠窜！你这句话传遍中州茶馆，声望暴涨！',
            effects: { reputation: 65, contribution: 320, attrs: { 魅力: 4, 气运: 2 }, stones: 300 },
          },
          fail: {
            text: '管事恼羞成怒甩出一道法术震翻你的茶碗扬长而去，虽出了口恶气也差点挨打。',
            effects: { hp: -25, reputation: 25, contribution: 140 },
          },
        },
      },
    ],
  },
  {
    id: 'wsa_sx_08', title: '老散修遗匣', pool: 'sect', tier: 4, weight: 6, minRealm: 3,
    require: 'sect() == "sanxiu"',
    text: '荒原客栈里，曾与你共饮过几回浊酒的独眼老散修陈九终于熬到了寿元大限。他没有宗门收尸，也没有子孙披麻，临终前笑着把一只满是刀痕的黑铁匣推进你怀里。\n\n「老头子修了一百八十年，连元婴边都没摸到，可走遍了九州八大灵域，没给任何人磕过一次头，值了！」老陈闭眼前轻声道，「匣子里是我一辈子攒的逃命符、藏宝图和散修杂学，别让大宗那帮老爷糟蹋了。」',
    choices: [
      {
        label: '亲手背着老陈埋在面向落日的高坡，立无字石碑敬三碗烈酒，再启铁匣继承遗志', hint: '薪火相传 · 得遁符、法宝与巨额气运',
        cost: { month: 1 },
        outcome: {
          text: '铁匣打开，里头整整齐齐码着三张缩地成寸符、一瓶养神玉清丹、两千块攒了一辈子的碎灵石，以及一本写满血泪智慧的《散修百活录》！你迎着落日仰头干杯，接过了这份自由却沉重的薪火。',
          effects: { expPct: 0.3, stones: 2000, items: ['suodi_fu', 'yangshen_dan'], lawExp: 45, lawId: 'space', karma: 40, demon: -20, attrs: { 气运: 4, 道心: 4 }, contribution: 520 },
        },
      },
      {
        label: '把铁匣里一半灵石与秘闻捐给白沙镇散修互助堂，惠及天下无门寒修', hint: '大义传灯 · 声望、业力与道心飞跃',
        cost: { month: 1 },
        outcome: {
          text: '老陈一生最恨大宗垄断传承，你把他的《散修百活录》抄录百份免费贴满散修酒肆！无数底层散修因此多了一条活命路，九州散修从此尊你为精神领袖！',
          effects: { expPct: 0.26, stones: 1000, karma: 65, reputation: 90, contribution: 600, demon: -25, attrs: { 魅力: 5, 道心: 4 }, items: ['suodi_fu'] },
        },
      },
      {
        label: '按老陈遗匣中最后一张未探完的险地草图，替他走完此生最后一场冒险', hint: '以冒险送老友 · 战斗（古修机关傀儡）',
        cost: { month: 1 },
        combat: {
          enemy: 'ancient_puppet',
          win: {
            text: '你击碎秘窟守卫傀儡，替老陈推开了那扇他梦了一辈子的古修石门！门后一枚稀世法则残片与长生灵果静静等候有缘人！',
            effects: { expPct: 0.32, items: ['faze_canpian', 'yanshou_dan'], lawExp: 48, lawId: 'chaos', reputation: 70, contribution: 540 },
          },
          lose: {
            text: '古傀儡凶猛异常将你震出石窟，你擦血一笑：果然是老陈敢挑的硬骨头，等境界高了再替他来拆！',
            effects: { hp: -75, stones: 600, attrs: { 根骨: 3 } },
          },
        },
      },
    ],
  },
  {
    id: 'wsa_sx_09', title: '散修集市 · 野路消息', pool: 'world', tier: 2, weight: 7, minRealm: 1,
    text: '三岔古道旁的枯槐树下，几十名无门无派的散修撑起破布篷组成了一日一散的「露水集」。这里没有大宗巡逻，也没人问你出身正邪，从妖兽碎骨到残缺地图什么都有人摆出来换灵石。\n\n一个戴着斗笠的散修客正压低声音兜售三条刚打听来的九州绝密风声。',
    choices: [
      {
        label: '花 150 灵石买下全部三条野路消息，再顺手淘几张便宜符纸', hint: '消耗 150 灵石 · 稳获机缘与实用符箓',
        cost: { stones: 150 },
        outcome: {
          text: '野路消息虽粗俗却极其管用！你不仅摸清了附近秘境的避险路线，还低价捡到一张神行符与一瓶培元丹。',
          effects: { items: ['shenxing_fu', 'peiyuan_dan'], attrs: { 气运: 2, 神识: 1 }, exp: 280 },
        },
      },
      {
        label: '在露水集摆开一壶粗茶，免费指点几名卡在炼气瓶颈的小散修换取江湖人情', hint: '结善缘 · 业力、魅力与声望双收',
        outcome: {
          text: '几个小散修听得如获至宝，临散场凑出两株刚挖的新鲜百年灵草硬塞给你：「前辈不嫌俺们出身野，这点山货务必收下！」',
          effects: { karma: 30, reputation: 35, items: ['lingcao', 'lingcao'], attrs: { 魅力: 2, 道心: 2 } },
        },
      },
      {
        label: '留心集市里混进来的扒手黑修，当场捉贼帮摊主追回灵石', hint: '战斗 · 采药黑修',
        combat: {
          enemy: 'herb_thief',
          win: {
            text: '你一脚踹翻偷袋黑修，满集市散修拍手叫好，摊主们豪爽凑出灵石谢你仗义出手！',
            effects: { stones: 340, karma: 25, reputation: 35, expPct: 0.16 },
          },
          lose: {
            text: '黑修撒了一把石灰迷眼逃窜，好在被你一掌逼得丢下了大半偷来的钱袋。',
            effects: { hp: -25, karma: 15, stones: 120 },
          },
        },
      },
    ],
  },
  {
    id: 'wsa_sx_10', title: '大宗封山 · 散修争脉', pool: 'world', tier: 4, weight: 6, minRealm: 2,
    text: '中州西岭地壳隆起，竟喷涌出一条无主上品灵脉！消息才传开三天，三家名门大宗便联手立起百里禁制石碑封死山谷，宣称「无籍散修擅入者格杀勿论」。\n\n石碑外已经聚起上千名怒火中烧的散修联盟好手，高喊着「天地灵脉本无主，凭什么你们大宗吃肉连汤都不让散修喝！」眼看一场大宗与散修联盟的血腥冲突一触即发！',
    choices: [
      {
        label: '站在散修联盟一边，带头以奇阵破开大宗封山禁制一角为众修争路', hint: '对抗垄断 · 悟性与道心检定',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 悟性: 0.014, 道心: 0.012 },
          success: {
            text: '你一眼看破禁制东南死角，率百名散修齐攻一点轰开缺口！大宗见群情难遏只得妥协划出外围三成灵脉供散修轮流吐纳，全场千人齐声高呼你的名号！',
            effects: { expPct: 0.26, reputation: 80, karma: 35, stones: 750, attrs: { 道心: 3, 魅力: 3 }, items: ['juling_dan'] },
          },
          fail: {
            text: '封山禁制反震极其凶猛，震得你虎口裂血退回人群，好在大宗也忌惮冲突扩大，最终稍微放宽了外山准入。',
            effects: { hp: -60, reputation: 35, attrs: { 道心: 2 } },
          },
        },
      },
      {
        label: '居中调停，提出大宗占主脉、散修联盟凭采矿功劳分外脉的折中方案', hint: '魅力检定 · 止血争名利双收',
        roll: {
          p: 0.58, attrs: { 魅力: 0.015, 悟性: 0.01 },
          success: {
            text: '大宗省了镇压血耗，散修得了实打实灵气机缘！两方代表竟同时向你抱拳致谢，各赠重礼！',
            effects: { stones: 900, reputation: 70, karma: 40, items: ['qiannian_lingcao', 'dahuan_dan'], attrs: { 魅力: 3 } },
          },
          fail: {
            text: '双方早结深怨，两头都不买你的账，骂你和稀泥，只得黯然退场。',
            effects: { attrs: { 悟性: 2 } },
          },
        },
      },
      {
        label: '趁两方在正门对峙喧闹，悄悄从后山瀑布暗洞独享一缕刚泄出的灵脉初精', hint: '不问是非 · 独吞机缘，修为暴涨',
        cost: { month: 1 },
        outcome: {
          text: '外面吵得震天响，你独自在暗洞里畅快鲸吞了整整半月无主上品灵气，神清气爽悄悄溜走！',
          effects: { expPct: 0.3, attrs: { 气运: 3 }, lawExp: 24, lawId: 'chaos' },
        },
      },
    ],
  },
  {
    id: 'wsa_sx_11', title: '逍遥酒约 · 论自由', pool: 'world', tier: 4, weight: 6, minRealm: 3,
    text: '东海绝壁老松下，一名背着破葫芦、穿着洗白麻衣的元婴老散修正自斟自饮，笑看远方天际御剑而过的宗门大舰。\n\n他朝路过的你晃了晃酒葫芦：「大宗门有灵脉有靠山，可你看看他们——长老发话就得去拼命，盟约一签就得站队，连爱谁恨谁都要过戒律堂。来，喝一口野酒，说说你修仙图的是长生大位，还是图个想去哪就去哪的痛快？」',
    choices: [
      {
        label: '大笑坐上断崖接过酒葫芦：「天地之大，能管住我的，只有我自己！」', hint: '意气相投 · 获逍遥老散修倾囊相授',
        cost: { month: 1 },
        outcome: {
          text: '老散修抚掌狂笑，笑声惊起满崖海鸥！二人对饮至月上中天，他随手在松皮上刻下三道自由无拘的混沌遁法与缩地真意，飘然踏浪而去！',
          effects: { expPct: 0.26, lawExp: 45, lawId: 'space', demon: -22, attrs: { 气运: 4, 道心: 4 }, items: ['suodi_fu'] },
        },
      },
      {
        label: '坦然道：「自由虽好，唯实力够硬才守得住自由——请前辈赐教三招！」', hint: '以战会友 · 孤鸿剑修（压境老散修）',
        combat: {
          enemy: 'sword_rogue',
          win: {
            text: '三招过后酒葫芦毫发无损，老散修眼中亮起惊叹光芒：「好本事！有这份拳头，天下确实随你去！」赠你一瓶珍藏元婴灵露！',
            effects: { expPct: 0.3, items: ['ningying_dan'], reputation: 65, attrs: { 根骨: 3, 悟性: 3 } },
          },
          lose: {
            text: '老散修仅凭一根松枝便点破你三处破绽，却大笑着拍去你肩头尘土，塞给你一壶增寿仙酿。',
            effects: { hp: -55, lifespan: 18, attrs: { 悟性: 4 } },
          },
        },
      },
      {
        label: '笑言「宗门与自由未必水火不容，心若自在，身在庙堂亦逍遥」', hint: '圆融超脱 · 混沌法则与道心齐进',
        outcome: {
          text: '老散修怔了半晌，缓缓举起酒葫芦向你一敬：「是我着相了。大隐隐于市，大自在不在无门，而在无缚。」',
          effects: { expPct: 0.24, lawExp: 42, lawId: 'chaos', demon: -20, attrs: { 道心: 5, 悟性: 3 } },
        },
      },
    ],
  },
  {
    id: 'wsa_sx_c1', title: '逍遥散盟 · 荒原聚义', pool: 'sect', tier: 4, weight: 7, minRealm: 2,
    require: 'sect() == "sanxiu"',
    once: true,
    text: '北荒魔潮与正道大宗圈地夹击之下，中州数万无门散修眼看再无容身之所！白沙镇外百里荒原，三百名来自五湖四海的散修头领今夜燃起百堆篝火，推举一位能镇住场子、又绝不骑在兄弟头上的「逍遥散盟」旗主！\n\n篝火映红一张张风霜脸庞，一名独臂老散修把一面以破道袍缝成的「天地为宗」大旗插在你身前：「{name}，你一路走来没背弃过散修傲骨！这面破旗重逾千斤——你敢不敢扛？」',
    choices: [
      {
        label: '一把拔起「天地为宗」大旗，誓言立一不收苛税、唯守互助的自由散盟', hint: '魅力与道心检定 · 聚义荒原启三关',
        cost: { month: 1 },
        roll: {
          p: 0.58, attrs: { 魅力: 0.014, 道心: 0.012 },
          success: {
            text: '三百散修齐齐摔碗高呼！篝火连天彻夜不熄，散修们头一次不再是任人揉捏的一盘散沙——可黎明未至，山岗之外已亮起密密麻麻的敌宗合围火把！',
            effects: { expPct: 0.2, reputation: 65, contribution: 320, attrs: { 魅力: 3, 道心: 3 }, flag: { 荒原聚义: true } },
            goto: 'wsa_sx_c2',
          },
          fail: {
            text: '几名刺头散修高声质疑你资历尚浅，争吵未休之际，山岗外却骤然射来数道大宗清剿令箭，众人瞬间被迫背靠背迎敌！',
            effects: { reputation: 25, contribution: 140, attrs: { 道心: 2 } },
            goto: 'wsa_sx_c2',
          },
        },
      },
      {
        label: '散尽 600 灵石置办疗伤丹药与阵盘分给在场各路散修，以实利聚人心', hint: '消耗 600 灵石 · 财散人聚入二关',
        cost: { stones: 600, month: 1 },
        outcome: {
          text: '「空口大义不如实在灵丹！」众人见你如此敞亮豪气，顿时心悦诚服齐认大旗！然而大宗与世家联军已在荒原外围收紧铁网！',
          effects: { reputation: 70, contribution: 360, attrs: { 魅力: 4, 气运: 2 }, flag: { 荒原聚义: true } },
          goto: 'wsa_sx_c2',
        },
      },
      {
        label: '笑言「散修图的就是不扛旗不受累」，婉拒盟主之位独游天地', hint: '彻底逍遥 · 错失散盟传承',
        outcome: {
          text: '你摆摆手喝干最后一碗烈酒消失在荒原夜风里，虽未成一方霸主，却守住了最纯粹的孤身自在。',
          effects: { demon: -16, attrs: { 气运: 3 }, lifespan: 15 },
        },
      },
    ],
  },
  {
    id: 'wsa_sx_c2', title: '逍遥散盟 · 破围立旗', pool: 'branch', tier: 5, weight: 0,
    text: (s) => `荒原四面杀声震天！几家唯恐散修坐大的贪婪世家竟勾结北荒劫修组成围剿联军，由一名元婴级血衣剑尊领衔，狂笑喝道：「一群无根野草也配开盟立旗？今夜把你们连同这面破布一起烧成灰！」\n\n${s.flags['荒原聚义'] ? '三百散修齐声怒吼结成野战乱阵死死护住你两侧，气势竟丝毫不输名门大宗！' : '营地仓促遇袭阵脚微乱，全凭你一人高举大旗稳住生死一线！'}`,
    choices: [
      {
        label: '手持大旗亲自迎战联军元婴领首，以散修野路杀招硬斩名门傲气', hint: '巅峰血战 · 血衣剑尊',
        cost: { month: 1 },
        combat: {
          enemy: 'crimson_sword',
          win: {
            text: '破旗卷碎漫天血剑！你当着数千双眼睛一举重创血衣剑尊，联军主帅胆寒溃逃！荒原篝火重燃，散修联盟彻底在九州立住了血火威名！',
            effects: { expPct: 0.3, reputation: 85, contribution: 500, lawExp: 45, lawId: 'chaos', attrs: { 根骨: 3, 道心: 4 }, flag: { 荒原破围: true } },
            goto: 'wsa_sx_c3',
          },
          lose: {
            text: '你浑身浴血大旗却始终未倒！三百散修红着眼齐齐引爆珍藏符箓炸退联军，硬生生把你背出了重围，保住了这面不屈旗帜！',
            effects: { hp: -85, reputation: 55, contribution: 300, attrs: { 道心: 4 }, lawExp: 24, lawId: 'chaos' },
            goto: 'wsa_sx_c3',
          },
        },
      },
      {
        label: '化整为零令三百散修四散袭扰联军粮草与后阵，以散修最擅长的游击困死强敌', hint: '悟性与气运检定 · 散修神兵法',
        cost: { month: 1 },
        roll: {
          p: 0.58, attrs: { 悟性: 0.015, 气运: 0.014 },
          success: {
            text: '「跟大宗拼正面那是傻子！」三百散修如群狼散入黑夜，一夜烧光联军七座辎重营！联军不战自乱仓皇退兵，九州从此再不敢小觑野路散修！',
            effects: { expPct: 0.28, reputation: 80, contribution: 480, stones: 1200, lawExp: 45, lawId: 'space', attrs: { 悟性: 4, 气运: 3 }, flag: { 荒原破围: true } },
            goto: 'wsa_sx_c3',
          },
          fail: {
            text: '联军反扑凶猛截住你率领的诱饵小队，一番死战负伤才勉强突围与大队汇合。',
            effects: { hp: -65, contribution: 240, lawExp: 22, lawId: 'space' },
            goto: 'wsa_sx_c3',
          },
        },
      },
    ],
  },
  {
    id: 'wsa_sx_c3', title: '逍遥散盟 · 天地为宗', pool: 'branch', tier: 5, weight: 0,
    text: (s) => `晨光照亮硝烟散尽的百里荒原，那面补丁摞补丁的「天地为宗」大旗迎风猎猎作响。\n\n${s.flags['荒原破围'] ? '天际竟有万千无形红尘愿力汇成清风拂过你周身——那不是某座仙山灵脉的馈赠，而是九州亿万无门无派、却依然不肯向命运低头的普通修士共同燃起的气运星火！' : '幸存的散修们围拢在破旗之下举起残缺酒碗，脸上满是浴火重生的倔强笑意。'}\n\n从此九州十三宗的格局里，真正多了一席属于自由散修的天地！`,
    choices: [
      {
        label: '集百家野路杂学熔于一炉，自创无拘无束的「混沌逍遥大道」', hint: '混沌法则大成 · 全能成长、悟道果与称号',
        cost: { month: 2 },
        outcome: {
          text: '无门无派，便以天下万法为师！剑、丹、阵、符、遁五脉野路真意在你体内融作混沌清光！九州散修共尊你为「逍遥散盟主」！',
          effects: { expPct: 0.38, lawExp: 92, lawId: 'chaos', attrs: { 气运: 6, 悟性: 5, 道心: 4 }, contribution: 700, reputation: 100, items: ['dao_fruit', 'qiankun_jie'], title: '逍遥散盟主', flag: { 逍遥盟主: true } },
        },
      },
      {
        label: '将散盟规矩立为「来去自由、有难同当」，化万里天地为空间遁道', hint: '空间法则与气运登峰 · 得太虚宝典与缩地符',
        cost: { month: 2 },
        outcome: {
          text: '你不设戒律堂、不收一分贡税，只留一盏荒原互助长明灯！从此九州八大灵域处处皆是你的耳目与落脚点，天高海阔任你纵横！',
          effects: { expPct: 0.35, lawExp: 88, lawId: 'space', lifespan: 60, demon: -30, attrs: { 气运: 7, 魅力: 5, 神识: 3 }, contribution: 650, reputation: 100, stones: 3200, items: ['suodi_fu', 'yujian_xukong'], title: '逍遥散盟主', flag: { 逍遥盟主: true } },
        },
      },
    ],
  },
];
