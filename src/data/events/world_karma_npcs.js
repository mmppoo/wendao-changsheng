import { WORLD_TECH_BY_ID } from '../techniques.js';

/**
 * 红尘十二道友、十道天地法则、王朝兴衰与心魔天劫长篇事件库（180 节点）。
 * - 第一篇：十二红尘道友深度剧情线（72 节点，每人 3 段式个人主线 + 3 段独立羁绊/红尘奇遇）
 * - 第二篇：十道天地法则悟道与试炼（50 节点，每道 5 节点）
 * - 第三篇：红尘王朝兴衰（28 节点）、心魔幻境（18 节点）、天劫前兆与上界秘闻（12 节点）
 */
export const WORLD_KARMA_NPCS = [
  /* ========================================================================
   * 第一篇 · 十二红尘道友深度剧情线（72 节点）
   * ======================================================================== */

  /* ───────────── 1. 苏晚晴 · 寒梅剑修（6 节点） ───────────── */
  {
    id: 'wkn_npc_su_1', title: '晚晴 · 寒梅夜笛', pool: 'world', tier: 3, weight: 7, minRealm: 0, region: 'luoxia',
    once: true,
    text: '腊月深雪压断了落霞城北驿的旧梅枝。你避雪入亭，却见栏边倚着一位青衣女修，正以一管白玉笛吹着极冷的调子，雪花落到她肩头三寸便化作清霜。\n\n曲终时，她转过身来，眉目如雪后远山：「{name}？我见过你腰间的剑气。三日后城北断梅崖有一桩旧账要了，我缺个肯替我守住山道的人。」',
    choices: [
      {
        label: '「雪夜听笛已算缘分，断梅崖我陪你去」', hint: '随苏晚晴赴断梅崖 · 开启寒梅主线',
        cost: { month: 1 },
        outcome: {
          text: '苏晚晴凝望你片刻，眸中寒霜微融，抛来一枚带着冷梅香的玉佩：「既应承了，便莫问对方来历。」三日后风雪初歇，二人并肩踏上断梅崖石阶。',
          effects: { relation: { 苏晚晴: 16 }, attrs: { 道心: 2 }, flag: { 赴断梅崖: true } },
          goto: 'wkn_npc_su_2',
        },
      },
      {
        label: '赠她一株随身灵草，先问清仇家深浅', hint: '需百年灵草 · 谨慎周全',
        require: 'has("lingcao")', requireHint: '行囊中并无百年灵草',
        cost: { item: 'lingcao', month: 1 },
        outcome: {
          text: '苏晚晴收下灵草，微微颔首：「是昔年勾结邪修屠我师门的叛徒，如今已至筑基后期。你既细心，便由你断后。」风雪之中，两人袖袂同行。',
          effects: { relation: { 苏晚晴: 22 }, attrs: { 悟性: 2, 神识: 2 }, flag: { 赴断梅崖: true, 知断梅旧怨: true } },
          goto: 'wkn_npc_su_2',
        },
      },
      {
        label: '抱拳辞谢：「同门恩怨，外人不便插手」', hint: '明哲保身 · 留待后缘',
        outcome: {
          text: '她并未强留，只轻轻吹落笛孔里的残雪：「修仙之人大多如此，倒也不怪你。」青衣转入飞雪深处，唯余一缕冷香绕柱。',
          effects: { attrs: { 道心: 2 }, relation: { 苏晚晴: -4 } },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_su_2', title: '晚晴 · 断梅剑冢', pool: 'branch', tier: 4, weight: 0,
    text: (s) => `断梅崖顶插着七柄锈透的师门旧剑，雪下埋着十年前未干的血。灰袍叛徒早已带着两具阴煞埋伏在松林后，见苏晚晴独身赴约，发出尖利冷笑。\n\n${s.flags['知断梅旧怨'] ? '你早已防备山道两侧的阴风，率先横剑封住他的退路。' : '灰袍人袖中寒光骤起，竟先朝你这名「旁观者」疾射而来。'}苏晚晴玉笛一横，化作三尺秋水寒剑：「挡住他半刻，余下交给我！」`,
    choices: [
      {
        label: '正面迎击叛徒，为苏晚晴抢出绝杀剑势', hint: '战斗 · 断魂刀客 · 血战断梅崖',
        combat: {
          enemy: 'blade_rogue',
          win: {
            text: '刀剑崩出漫天星火，你硬生生逼退灰袍叛徒三步。刹那间梅雪倒卷，苏晚晴一剑如冰河倾泻，贯穿仇敌咽喉。雪地归于死寂。',
            effects: { expPct: 0.22, reputation: 28, karma: 18, relation: { 苏晚晴: 24 }, flag: { 断梅雪仇: true } },
            goto: 'wkn_npc_su_3',
          },
          lose: {
            text: '对方刀势凶戾，划破你左肩衣袍。苏晚晴眸色骤冷，不惜耗损本命剑气强斩叛徒，回头扶住摇摇欲坠的你。',
            effects: { hp: -45, injury: 1, relation: { 苏晚晴: 20 }, flag: { 断梅雪仇: true } },
            goto: 'wkn_npc_su_3',
          },
        },
      },
      {
        label: '以神识洞破松林埋伏，先毁其阴煞阵旗', hint: '神识检定 · 破阵助剑',
        roll: {
          p: 0.56, attrs: { 神识: 0.014, 悟性: 0.01 },
          success: {
            text: '你指尖剑气连点三株枯松，藏在树腹的聚阴旗应声炸碎。叛徒阵脚大乱，被苏晚晴连递七剑钉死于旧坟碑前。',
            effects: { expPct: 0.2, attrs: { 神识: 3, 悟性: 2 }, relation: { 苏晚晴: 22 }, flag: { 断梅雪仇: true } },
            goto: 'wkn_npc_su_3',
          },
          fail: {
            text: '阵旗反噬震得你气血翻涌，好在苏晚晴趁隙一剑封喉，未让仇敌遁走。',
            effects: { hp: -35, attrs: { 神识: 2 }, relation: { 苏晚晴: 16 }, flag: { 断梅雪仇: true } },
            goto: 'wkn_npc_su_3',
          },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_su_3', title: '晚晴 · 雪霁传剑', pool: 'branch', tier: 4, weight: 0,
    text: '大雪初霁，残阳把断梅崖照得通红。苏晚晴在七柄旧剑前跪拜三叩，起身时眼底沉郁十年的寒冰终于化开了一角。\n\n她解下腰间青丝剑穗，又取出一枚温凉如雪的剑意玉简递到你掌中：「师门传承，不该随我一同老死在雪里。若你不嫌弃寒梅剑路冷清，这一卷真诀，我亲手拆与你看。」',
    choices: [
      {
        label: '接过剑简，于梅崖同参三日《寒梅落雪剑诀》', hint: '习得地阶《寒梅落雪剑诀》· 剑道感悟大涨',
        cost: { month: 2 },
        outcome: {
          text: '三日剑影与落梅交错。你终于懂得她剑中的冷并非无情，而是把炽热藏在最深处。离别时，苏晚晴轻声道：「往后落霞城落雪，记得回来喝茶。」',
          effects: {
            techniques: [WORLD_TECH_BY_ID.wt_hanmei_jian],
            lawExp: 45, lawId: 'sword',
            attrs: { 悟性: 4, 道心: 4 },
            relation: { 苏晚晴: 24 },
            title: '寒梅知音',
            flag: { 获寒梅真传: true },
          },
        },
      },
      {
        label: '只取她一缕本命剑意淬炼己剑，将师门玉简留作她念想', hint: '以己道合寒梅 · 得寒霜古剑',
        cost: { month: 1 },
        outcome: {
          text: '苏晚晴怔了片刻，唇角浮出一抹极清浅的笑。她以笛引剑，替你斩去经脉间三丝滞气，又赠你一柄雪铁锻成的古剑护身。',
          effects: {
            items: ['hanbing_jian'],
            lawExp: 55, lawId: 'sword',
            attrs: { 根骨: 4, 道心: 5 },
            relation: { 苏晚晴: 28 },
            flag: { 获寒梅真传: true },
          },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_su_e1', title: '晚晴 · 残茶煮雪', pool: 'world', tier: 2, weight: 6, minRealm: 0, region: 'luoxia',
    require: 'rel("苏晚晴") >= 8',
    text: '落霞城西巷茶摊收摊前的最后半个时辰，苏晚晴正独坐炭炉边，拿松枝拨弄着一壶融雪煎出的粗茶。见你路过，她替你多烫了一只粗瓷碗。\n\n「外头都在传某处秘境开了，争得头破血流。你怎倒有闲情来喝这碗涩茶？」',
    choices: [
      {
        label: '坐下同饮，说起一路见过的山河旧事', hint: '静心养道 · 增进情谊',
        cost: { month: 1 },
        outcome: {
          text: '茶汤微苦，回甘却长。苏晚晴支颐听你说了半夜，临散时把一小袋回灵丹放在你碗边：「仙路急不得，慢半步，反倒看得见风景。」',
          effects: { items: ['huiling_dan'], demon: -8, attrs: { 道心: 3 }, relation: { 苏晚晴: 14 } },
        },
      },
      {
        label: '请她以茶水画剑势，指点近来瓶颈', hint: '剑道切磋 · 悟性剑意双进',
        cost: { month: 1 },
        outcome: {
          text: '她蘸茶在木桌上连划七笔，每一笔水痕未干便凝出霜意。你凝神细看，胸中积郁数月的滞涩豁然贯通。',
          effects: { expPct: 0.16, lawExp: 25, lawId: 'sword', attrs: { 悟性: 3 }, relation: { 苏晚晴: 10 } },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_su_e2', title: '晚晴 · 冰湖笛剑', pool: 'wild', tier: 3, weight: 5, minRealm: 2,
    require: 'rel("苏晚晴") >= 18',
    text: '深冬冰湖如镜，苏晚晴立于湖心独演寒梅十三式。你刚踏上湖畔，冰层下却骤然传出沉闷裂响——一头潜眠百年的水煞毒蛟被剑气惊醒，撞碎厚冰破水而出！',
    choices: [
      {
        label: '纵身掠入湖心，与她双剑合斩妖蛟', hint: '战斗 · 珊瑚妖将 · 联手御敌',
        combat: {
          enemy: 'coral_demon',
          win: {
            text: '笛声清越，剑霜如瀑。你与苏晚晴一左一右截断妖蛟退路，冰湖之上血雾瞬间冻作红梅。她收剑拭霜，轻声笑道：「你的剑，比从前稳多了。」',
            effects: { items: ['bihai_xuanbing'], expPct: 0.24, lawExp: 30, lawId: 'sword', relation: { 苏晚晴: 18 } },
          },
          lose: {
            text: '妖蛟尾劲震裂半面冰湖，苏晚晴疾退拉你上岸，二人皆溅了一身寒水，彼此相视倒忍不住失笑。',
            effects: { hp: -40, relation: { 苏晚晴: 14 }, attrs: { 根骨: 2 } },
          },
        },
      },
      {
        label: '在岸边布下引灵剑阵，封锁湖面灵机', hint: '悟性检定 · 智困妖蛟',
        roll: {
          p: 0.55, attrs: { 悟性: 0.012, 神识: 0.01 },
          success: {
            text: '湖面冰纹顺着你的剑气反锁妖身，苏晚晴顺势一剑穿心。湖底浮出一枚寒髓晶珠，她毫不迟疑分了你一半。',
            effects: { items: ['bihai_xuanbing'], attrs: { 悟性: 3, 神识: 2 }, relation: { 苏晚晴: 16 } },
          },
          fail: {
            text: '阵眼尚未合拢便被妖气冲散，苏晚晴独力逼退妖蛟，为你挡下余波。',
            effects: { hp: -25, relation: { 苏晚晴: 10 }, attrs: { 道心: 2 } },
          },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_su_e3', title: '晚晴 · 霜雪同舟', pool: 'world', tier: 5, weight: 5, minRealm: 3,
    require: 'rel("苏晚晴") >= 32',
    once: true,
    text: '百年一度的梅雪大寒之夜，落霞城外十里梅林无风自落。苏晚晴褪去了惯常的冷肃，站在灯影稀疏的画舫船头，发梢沾着细碎雪花。\n\n「{name}，旁人修仙越修越冷，怕动情误道。可我活了两百年，反倒觉得若连身旁之人都护不住，长生又有何趣？」她将半枚温热同心梅玉放入你手心。',
    choices: [
      {
        label: '握紧梅玉：「往后风雪漫长，你我同舟共渡」', hint: '许下道侣深盟 · 道心与气运大增',
        cost: { month: 2 },
        outcome: {
          text: '灯火摇曳间，她眼底泛起极轻的雾气，旋即化作清澈笑意。那一夜画舫顺寒江漂出三十里，两人剑意在雪夜交融为一，此后识海再无孤寒之苦。',
          effects: {
            items: ['dao_fruit'],
            attrs: { 道心: 8, 魅力: 5, 气运: 4 },
            demon: -25,
            relation: { 苏晚晴: 35 },
            title: '雪梅道侣',
            flag: { 晚晴同舟: true },
          },
        },
      },
      {
        label: '珍重收玉：「道途多劫，先以知己相守，待斩破天门再论白首」', hint: '克己重诺 · 彼此砥砺',
        outcome: {
          text: '苏晚晴轻轻点头，眼里却无半分失落：「好。那你可莫要死在我前头。」她吹起一曲清远玉笛，笛声送你破开层层寒雾。',
          effects: { attrs: { 道心: 7, 悟性: 4 }, expPct: 0.25, demon: -18, relation: { 苏晚晴: 25 }, flag: { 晚晴之约: true } },
        },
      },
    ],
  },

  /* ───────────── 2. 陆沉舟 · 太玄剑痴（6 节点） ───────────── */
  {
    id: 'wkn_npc_lu_1', title: '沉舟 · 孤鸿借铁', pool: 'world', tier: 3, weight: 7, minRealm: 0, region: 'zhongzhou',
    once: true,
    text: '中州官道旁的破铁匠铺里火光冲天。背负无鞘铁剑的陆沉舟正光着膀子抡锤，把一块赤红陨铁敲得火星四溅。见你停步，他甩掉额上汗水，眼中精芒如电。\n\n「正好！老铁匠扛不住我的剑气，这炉铁快凉了。{name}，借你三成真元压住炉火，换我欠你一场真正的试剑！」',
    choices: [
      {
        label: '运起灵力助他压住炉心，共锻剑胚', hint: '消耗灵力 · 开启陆沉舟主线',
        cost: { mp: 20, month: 1 },
        outcome: {
          text: '剑气与炉火在铁砧上轰然相撞，赤铁渐渐凝出一道孤绝青纹。陆沉舟拎起尚未冷透的剑胚大笑：「走！随我去百剑林开锋！」',
          effects: { relation: { 陆沉舟: 18 }, attrs: { 根骨: 3 }, flag: { 共锻孤鸿: true } },
          goto: 'wkn_npc_lu_2',
        },
      },
      {
        label: '解下随身玄铁抛入炉中助其成器', hint: '需玄铁 · 剑痴极喜',
        require: 'has("xuantie")', requireHint: '行囊中并无玄铁',
        cost: { item: 'xuantie', month: 1 },
        outcome: {
          text: '玄铁入炉的刹那，青光冲破屋瓦三丈！陆沉舟眼睛发亮，一把拍在你肩上差点把你拍进地里：「好大方！走，去百剑林，这剑第一战留给你看！」',
          effects: { relation: { 陆沉舟: 26 }, attrs: { 根骨: 4, 悟性: 2 }, flag: { 共锻孤鸿: true, 赠铁成剑: true } },
          goto: 'wkn_npc_lu_2',
        },
      },
      {
        label: '摇首婉拒：「我非炼器师，怕误了道友剑胚」', hint: '不涉风波',
        outcome: {
          text: '陆沉舟啧了一声，自己咬牙吐出一口精血浇在剑胚上，铁铺轰鸣震得街巷瓦片齐颤。你退至街角，只觉此人痴狂至极。',
          effects: { attrs: { 道心: 2 }, relation: { 陆沉舟: -4 } },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_lu_2', title: '沉舟 · 百剑试锋', pool: 'branch', tier: 4, weight: 0,
    text: (s) => `中州西郊百剑林立着古往今来三百座断剑冢。陆沉舟提着新锻的无鞘铁剑踏入林心，漫山残剑顿时感应到挑衅，齐齐嗡鸣震颤。\n\n${s.flags['赠铁成剑'] ? '因融入你的玄铁，新剑鸣音如鹤唳九皋，竟直接引动林深处一尊沉睡的古剑灵影！' : '铁剑锋芒尚带火气，却已惊醒了剑林深处一尊守林古剑客！'}陆沉舟不退反进，回眸对你咧嘴一笑：「一人一半，看谁先劈碎这团死剑气！」`,
    choices: [
      {
        label: '拔剑直冲剑灵影，与陆沉舟争锋比快', hint: '战斗 · 孤鸿剑修 · 剑心交锋',
        combat: {
          enemy: 'sword_rogue',
          win: {
            text: '两道剑光一前一后斩落，古剑灵影轰然崩作漫天银屑。陆沉舟收剑喘息，眼里满是棋逢对手的炽热：「痛快！这一剑比我快了半寸！」',
            effects: { expPct: 0.25, lawExp: 35, lawId: 'sword', attrs: { 根骨: 3, 悟性: 3 }, relation: { 陆沉舟: 24 } },
            goto: 'wkn_npc_lu_3',
          },
          lose: {
            text: '剑林古意凛冽，震得你虎口裂血。陆沉舟横剑替你架开致命一击，低喝道：「莫慌，看清他第三式收腕的破绽！」随后反手一剑破敌。',
            effects: { hp: -50, injury: 1, lawExp: 25, lawId: 'sword', relation: { 陆沉舟: 18 } },
            goto: 'wkn_npc_lu_3',
          },
        },
      },
      {
        label: '敛气凝神，专心拆解百剑林的古阵剑韵', hint: '悟性检定 · 观剑明理',
        roll: {
          p: 0.54, attrs: { 悟性: 0.015, 道心: 0.01 },
          success: {
            text: '你高呼三处阵眼方位，陆沉舟闻声便斩，三剑破尽百剑共鸣。山风停歇，二人并肩立于断碑之上。',
            effects: { expPct: 0.2, lawExp: 40, lawId: 'sword', attrs: { 悟性: 4 }, relation: { 陆沉舟: 22 } },
            goto: 'wkn_npc_lu_3',
          },
          fail: {
            text: '剑鸣声乱人心神，你只来得及看清两处破绽，陆沉舟凭一身蛮横剑骨硬劈出一条血路。',
            effects: { hp: -35, attrs: { 悟性: 2 }, relation: { 陆沉舟: 15 } },
            goto: 'wkn_npc_lu_3',
          },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_lu_3', title: '沉舟 · 孤鸿断空', pool: 'branch', tier: 5, weight: 0,
    text: '夕阳沉入百剑林尽头，陆沉舟盘腿坐在青石上拿烈酒擦拭新剑。他沉默了许久，忽然把一卷用剑尖刻在玄铁片上的剑经抛入你怀。\n\n「我这辈子没收过徒弟，也没打算收。但你这人出剑不虚浮、不怕死。这卷《孤鸿断空剑经》是我半生心血，拿去练——来日若连你都接不住我一剑，这中州也太无趣了。」',
    choices: [
      {
        label: '郑重收下玄铁剑经，与他以酒代誓共参三日', hint: '习得天阶《孤鸿断空剑经》· 剑道大涨',
        cost: { month: 2 },
        outcome: {
          text: '玄铁片上每一道刻痕都残留着陆沉舟斩空时的呼吸节奏。你默诵三日，识海中竟隐隐化出一只振翅断云的孤鸿剑影。',
          effects: {
            techniques: [WORLD_TECH_BY_ID.wt_guhong_jian],
            lawExp: 65, lawId: 'sword',
            attrs: { 根骨: 5, 悟性: 5 },
            relation: { 陆沉舟: 28 },
            title: '孤鸿剑友',
            flag: { 获孤鸿剑经: true },
          },
        },
      },
      {
        label: '只记其「破妄不留余地」一式真意，还他半坛剑酒', hint: '以己剑证孤鸿 · 获剑魄通明丹',
        cost: { month: 1 },
        outcome: {
          text: '陆沉舟大笑，仰头饮尽烈酒，反手把一枚珍藏多年的剑魄通明丹扔进你衣袖：「不拘泥于他人剑路，好！这才是大剑修的气象！」',
          effects: {
            items: ['jianyi_dan'],
            lawExp: 70, lawId: 'sword',
            attrs: { 道心: 6, 根骨: 4 },
            relation: { 陆沉舟: 30 },
            flag: { 获孤鸿剑经: true },
          },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_lu_e1', title: '沉舟 · 酒肆拆招', pool: 'world', tier: 2, weight: 6, minRealm: 1, region: 'zhongzhou',
    require: 'rel("陆沉舟") >= 10',
    text: '中州小酒馆里人声鼎沸，陆沉舟正用两根竹筷夹着一粒花生，对着空气比划昨夜悟出的新招。见你推门而入，他二话不说把另一双竹筷掷了过来。\n\n「别急着点菜！接我三筷，接住了今天酒钱全算我的！」',
    choices: [
      {
        label: '顺手抄起竹筷，于方寸酒桌拆他三式快剑', hint: '根骨与悟性检定 · 切磋长进',
        roll: {
          p: 0.52, attrs: { 根骨: 0.012, 悟性: 0.012 },
          success: {
            text: '三声清脆交击，桌上的酒壶纹丝未动，花生却被剑气削作两半。满堂酒客轰然叫好，陆沉舟拍案豪饮三碗。',
            effects: { expPct: 0.16, lawExp: 24, lawId: 'sword', attrs: { 悟性: 2, 根骨: 2 }, relation: { 陆沉舟: 15 } },
          },
          fail: {
            text: '第三筷快得肉眼难辨，削断了你半截竹筷。陆沉舟哈哈大笑，反倒顺手点破了你换气慢半拍的毛病。',
            effects: { lawExp: 18, lawId: 'sword', attrs: { 悟性: 3 }, relation: { 陆沉舟: 12 } },
          },
        },
      },
      {
        label: '笑着把筷子放下，先给他满上一海碗烧刀子', hint: '以酒会友 · 稳增情谊',
        cost: { stones: 40 },
        outcome: {
          text: '陆沉舟愣了一下，抓起大碗咕咚喝干：「好酒！难怪师兄总说我太急，喝口酒再出剑，倒真顺畅几分。」',
          effects: { demon: -6, attrs: { 魅力: 2, 道心: 2 }, relation: { 陆沉舟: 16 } },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_lu_e2', title: '沉舟 · 荒岭斩雷', pool: 'wild', tier: 4, weight: 5, minRealm: 3,
    require: 'rel("陆沉舟") >= 20',
    text: '暴雨倾盆的雷鸣荒岭上，陆沉舟竟然立在最高那块黑石上，举着无鞘铁剑直指阴沉天幕。一道水桶粗的苍雷轰然劈下，他竟不躲不避，硬以剑锋迎雷！',
    choices: [
      {
        label: '跃上黑石与他共承天雷，以雷淬剑', hint: '风险甚大 · 剑道与雷霆双悟',
        cost: { hp: 45, month: 1 },
        outcome: {
          text: '电光炸裂如银蛇狂舞，你与陆沉舟浑身焦黑却哈哈大笑。雷息散尽时，你们彼此的剑气里都多了一分刚猛无匹的雷意。',
          effects: { lawExp: 45, lawId: 'sword', attrs: { 根骨: 5, 道心: 4 }, expPct: 0.22, relation: { 陆沉舟: 22 } },
        },
      },
      {
        label: '在石下护法警戒，防宵小趁其受雷偷袭', hint: '沉稳护道 · 情义更深',
        outcome: {
          text: '果有两名魔修暗中摸近，被你一剑逼退。雷云散后，陆沉舟甩着冒烟的袖子跳下黑石，扔给你一截被天雷劈落的焦香雷击木。',
          effects: { items: ['leimu'], attrs: { 神识: 3, 道心: 3 }, relation: { 陆沉舟: 18 } },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_lu_e3', title: '沉舟 · 中州剑台之约', pool: 'world', tier: 5, weight: 5, minRealm: 4,
    require: 'rel("陆沉舟") >= 35',
    once: true,
    text: '中州白玉剑台之上，秋风卷起万千剑修衣袂。陆沉舟立在台心，周身已无昔年张扬锐气，反倒像一柄收入鞘中的太古重剑。\n\n「{name}，当年我说待你我入化神，必在此台一战。如今满城英杰都在台下看着——今日不问生死，只问你我半生剑道，究竟谁更近一步！」',
    choices: [
      {
        label: '登台出剑，倾尽毕生所学与陆沉舟巅峰一战', hint: '巅峰切磋 · 太古剑灵残影 · 名动中州',
        cost: { month: 1 },
        combat: {
          enemy: 'sword_phantom',
          win: {
            text: '百余合后，白玉台面尽裂，双剑同时停在彼此眉心一寸。陆沉舟放声大笑，声震百里：「今生有你作敌作友，陆某此生无憾！」',
            effects: {
              expPct: 0.4, lawExp: 90, lawId: 'sword',
              reputation: 120, attrs: { 根骨: 6, 悟性: 6, 道心: 5 },
              items: ['taixu_jian'],
              relation: { 陆沉舟: 35 },
              title: '中州双绝',
              flag: { 中州剑台之战: true },
            },
          },
          lose: {
            text: '他的孤鸿一剑终究快了半分，挑飞你的佩剑。陆沉舟伸手拉你起身，将自己珍藏的法则残片按入你掌心：「下一战，在九霄天门之前。」',
            effects: {
              hp: -60, expPct: 0.28, lawExp: 65, lawId: 'sword',
              reputation: 70, items: ['faze_canpian'],
              relation: { 陆沉舟: 30 },
              flag: { 中州剑台之战: true },
            },
          },
        },
      },
      {
        label: '以意会剑，二人静坐剑台隔空演剑三百招', hint: '神交大道 · 无伤大悟',
        cost: { month: 1 },
        outcome: {
          text: '台下观者只见两人静坐不动，却觉漫天剑气如潮汐碰撞。一炷香后二人同时睁眼，相视大笑，满城剑修齐声躬身致敬。',
          effects: { expPct: 0.3, lawExp: 75, lawId: 'sword', attrs: { 悟性: 7, 神识: 5 }, reputation: 85, relation: { 陆沉舟: 28 }, flag: { 中州剑台之战: true } },
        },
      },
    ],
  },

  /* ───────────── 3. 药尘子 · 怪癖丹尊（6 节点） ───────────── */
  {
    id: 'wkn_npc_yao_1', title: '药尘 · 妖森采奇', pool: 'world', tier: 3, weight: 7, minRealm: 1, region: 'yaosen',
    once: true,
    text: '苍茫妖森边缘的腐叶堆里突然钻出半个焦黑脑袋，满头乱发冒着青烟——正是药尘子。他手里死死攥着半株紫斑灵草，屁股后头追着三头怒吼的毒蟒。\n\n「小鬼！别傻站着！帮老夫把这几条长虫拦一拦，炉里那锅九转延寿丹正缺这味紫斑龙涎草！」',
    choices: [
      {
        label: '纵身拦下毒蟒，护药尘子退回草庐', hint: '战斗 · 碧磷毒蟒 · 开启药尘子主线',
        combat: {
          enemy: 'poison_python',
          win: {
            text: '剑光斩断毒蟒七寸，药尘子拍着屁股从树后蹦出来，竖起黑漆漆的大拇指：「好身手！走，回庐替老夫扇风看火去！」',
            effects: { items: ['biling_yu'], relation: { 药尘子: 20 }, flag: { 救药尘子: true } },
            goto: 'wkn_npc_yao_2',
          },
          lose: {
            text: '毒雾扑面呛得你连退数步，药尘子反手甩出一把辛辣药粉熏跑毒蟒，骂骂咧咧把你拽回了草庐。',
            effects: { hp: -35, relation: { 药尘子: 14 }, flag: { 救药尘子: true } },
            goto: 'wkn_npc_yao_2',
          },
        },
      },
      {
        label: '抛出随身清毒丹或灵草引开毒蟒嗅觉', hint: '智取退蛇 · 需百年灵草',
        require: 'has("lingcao")', requireHint: '行囊中并无百年灵草',
        cost: { item: 'lingcao' },
        outcome: {
          text: '你揉碎灵草抛向下风口，毒蟒果然转向扑去。药尘子眼睛一亮：「懂药性，不蛮干！快随老夫回庐，今日让你开开眼界！」',
          effects: { attrs: { 悟性: 3 }, relation: { 药尘子: 24 }, flag: { 救药尘子: true, 巧退毒蟒: true } },
          goto: 'wkn_npc_yao_2',
        },
      },
      {
        label: '拱手退开：「妖森凶险，晚辈实力低微」', hint: '避险而去',
        outcome: {
          text: '药尘子气得胡子直翘，一边往毒蟒嘴里塞雷火弹一边跑没了影，山谷里接连传来三声闷雷般的炸响。',
          effects: { relation: { 药尘子: -5 } },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_yao_2', title: '药尘 · 九孔控火', pool: 'branch', tier: 4, weight: 0,
    text: (s) => `药尘子的草庐中央架着一尊布满裂纹的九孔青铜古鼎，炉内青紫双火正狂躁翻腾，眼看又要炸炉。\n\n${s.flags['巧退毒蟒'] ? '老道咧嘴一笑：「你既懂草木生克，替老夫守住东南三孔文火，莫让寒热相冲！」' : '老道把一把铁扇塞进你手里：「别管那么多，按老夫喊的节奏往里灌灵力，炸了我俩一块上天！」'}`,
    choices: [
      {
        label: '凝神感应炉内药气，精准调和文武丹火', hint: '悟性与神识检定 · 炼成宝丹',
        cost: { month: 2 },
        roll: {
          p: 0.55, attrs: { 悟性: 0.014, 神识: 0.012 },
          success: {
            text: '七日七夜寸步未离，鼎中九孔同时吐出清雅莲香。药尘子掀盖大笑，三枚圆润紫丹腾空跃起，丹晕照亮整座草庐！',
            effects: { expPct: 0.22, lawExp: 45, lawId: 'pill', attrs: { 悟性: 4, 神识: 3 }, counter: { alchemy: 2 }, relation: { 药尘子: 26 }, flag: { 助药成丹: true } },
            goto: 'wkn_npc_yao_3',
          },
          fail: {
            text: '第六日火候微偏，古鼎「轰」地喷出一股黑烟，熏得二人如同灶王爷。好在药尘子临危拍掌收拢药力，仍抢出两枚焦边好丹。',
            effects: { hp: -30, lawExp: 25, lawId: 'pill', counter: { alchemy: 1 }, relation: { 药尘子: 18 } },
            goto: 'wkn_npc_yao_3',
          },
        },
      },
      {
        label: '以自身浑厚真元硬压暴躁丹火，护鼎不碎', hint: '消耗气血灵力 · 强行稳炉',
        cost: { hp: 35, mp: 30, month: 1 },
        outcome: {
          text: '你双掌抵住灼热鼎身，硬生生把狂躁火煞逼回炉底。药尘子啧啧称奇，趁机合盖封香，竟也炼成一炉药性极烈的好丹。',
          effects: { lawExp: 35, lawId: 'pill', attrs: { 根骨: 3 }, counter: { alchemy: 1 }, relation: { 药尘子: 22 } },
          goto: 'wkn_npc_yao_3',
        },
      },
    ],
  },
  {
    id: 'wkn_npc_yao_3', title: '药尘 · 百草真传', pool: 'branch', tier: 4, weight: 0,
    text: '丹烟散尽，药尘子盘坐在满地药渣里啃着灵桃，破天荒没再胡言乱语。他从怀里掏出一册油渍斑斑却字字如龙蛇的泛黄丹经，往你怀里一塞。\n\n「丹道不是为了卖灵石，是替自己和在意的人从老天爷手里多偷几年命。《神农百草丹经》老夫抄了一辈子，如今交给你——莫拿去炼害人的毒丹就行！」',
    choices: [
      {
        label: '叩谢丹尊，潜心研读《神农百草丹经》', hint: '习得地阶《神农百草丹经》· 丹道与寿元大增',
        cost: { month: 2 },
        outcome: {
          text: '经卷之中记录了三千灵草的寒热性味与丹火吐纳之妙。你掩卷长舒一口气，只觉周身经脉皆浮起温和生机。',
          effects: {
            techniques: [WORLD_TECH_BY_ID.wt_shennong_dan],
            lawExp: 60, lawId: 'pill',
            lifespan: 30, attrs: { 悟性: 5, 神识: 3 },
            items: ['yanshou_dan'],
            relation: { 药尘子: 26 },
            title: '百草传人',
            flag: { 获神农丹经: true },
          },
        },
      },
      {
        label: '请他将此炉新成的宝丹分赠一枚，兼悟丹火本源', hint: '得结金丹与丹道法则感悟',
        outcome: {
          text: '药尘子嘿嘿一笑，把最饱满的一枚紫丹连同两株千年灵草塞给你：「实惠人！拿着破境用罢！」',
          effects: {
            items: ['jiejin_dan', 'qiannian_lingcao'],
            lawExp: 55, lawId: 'pill',
            attrs: { 悟性: 4, 道心: 3 },
            relation: { 药尘子: 22 },
            flag: { 获神农丹经: true },
          },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_yao_e1', title: '药尘 · 焦边残丹', pool: 'world', tier: 2, weight: 6, minRealm: 1, region: 'yaosen',
    require: 'rel("药尘子") >= 10',
    text: '妖森外镇的破茶棚下，药尘子顶着半边烧焦的眉毛冲你招手，偷偷摸出一只黑瓷瓶塞进你袖口：「方才又炸了一炉！但这几枚虽然焦了外皮，里头药力足有八成，拿去吃还是拿去卖随便你，别跟外人说是老夫炼的！」',
    choices: [
      {
        label: '当场吞服一枚试其药力', hint: '胆识过人 · 根骨修为齐涨',
        outcome: {
          text: '丹药苦得你眉头紧锁，可片刻后一股醇厚暖流化入四肢百骸。药尘子在旁看得直点头：「成了成了，这回没泻肚子！」',
          effects: { expPct: 0.18, lawExp: 20, lawId: 'pill', attrs: { 根骨: 2 }, relation: { 药尘子: 14 } },
        },
      },
      {
        label: '仔细收起，并回赠些许灵石助他买新药炉', hint: '需 120 灵石 · 获赠好丹',
        require: 'stones >= 120', requireHint: '灵石不足一百二十',
        cost: { stones: 120 },
        outcome: {
          text: '药尘子眼睛笑成一条缝，反手又摸出一瓶碧血生肌丹和冰心丹塞回你怀里：「老夫最喜欢懂事的娃娃！」',
          effects: { items: ['bixue_dan', 'qingxin_dan'], relation: { 药尘子: 20 }, karma: 10 },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_yao_e2', title: '药尘 · 毒瘴辩药王', pool: 'wild', tier: 4, weight: 5, minRealm: 2, region: 'yaosen',
    require: 'rel("药尘子") >= 20',
    text: '妖森深处升起七彩毒瘴，药尘子领着你蹲在一块苔石后，指着沼泽中央一朵半白半紫的怪花压低嗓音：「那是千年双生莲！白花延寿，紫花剧毒，偏生一头化形妖将正守在泥潭底。」',
    choices: [
      {
        label: '联手斩杀守花妖将，连根采走双生莲', hint: '战斗 · 妖将 · 丰厚回报',
        combat: {
          enemy: 'demon_general',
          win: {
            text: '药尘子甩出三道镇毒符封住沼气，你一剑斩落妖将首级。老道喜滋滋挖出整株药王，当场分了你白莲主蕊。',
            effects: { items: ['qiannian_lingcao', 'dahuan_dan'], lifespan: 25, lawExp: 35, lawId: 'pill', relation: { 药尘子: 22 } },
          },
          lose: {
            text: '妖将掀起十丈毒浪，药尘子扯着你连遁十里，虽未采得莲花，却在逃亡路上教你一式解毒吐纳法。',
            effects: { hp: -55, items: ['jiexin_dan'], lawExp: 20, lawId: 'pill', relation: { 药尘子: 14 } },
          },
        },
      },
      {
        label: '只趁妖将换气刹那采走三片外瓣，不结死仇', hint: '神识检定 · 稳妥采药',
        roll: {
          p: 0.6, attrs: { 神识: 0.014, 气运: 0.01 },
          success: {
            text: '你指尖剑风轻掠，三片雪白花瓣无声落入玉匣。药尘子竖指称赞：「够用就好，留点根苗，百年后还能再采！」',
            effects: { items: ['qiannian_lingcao', 'yangshen_dan'], lawExp: 30, lawId: 'pill', relation: { 药尘子: 18 } },
          },
          fail: {
            text: '妖将惊觉挥爪扫来，只摘得一片残瓣便急急退走。',
            effects: { hp: -25, items: ['lingcao'], relation: { 药尘子: 10 } },
          },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_yao_e3', title: '药尘 · 炉边续命茶', pool: 'world', tier: 5, weight: 5, minRealm: 4,
    require: 'rel("药尘子") >= 35',
    once: true,
    text: '百年后再入妖森草庐，药尘子比昔年更显佝偻，连平日总冒烟的九孔青铜鼎也罕见地熄了火。他递来一只玉盒，里头静静躺着一枚霞光流转的仙灵丹。\n\n「老夫折腾了一辈子丹火，渡劫那步怕是走不过去了。这最后半炉压箱底的东西留给老头子也是糟蹋，{name}，你替老夫走去看看上界有没有更好的药草罢。」',
    choices: [
      {
        label: '郑重接丹，耗费三月修为替老道梳理多年丹毒暗伤', hint: '耗时三月 · 情深义重 · 业力道心暴涨',
        cost: { month: 3, mp: 40 },
        outcome: {
          text: '你以灵力替他拔出沉积经脉百年的火毒。老道红着眼眶硬骂你多管闲事，却把毕生丹道手札全数刻入你识海，寿元亦多续了一甲子。',
          effects: {
            items: ['xianling_dan', 'jiuzhuan_dan'],
            lawExp: 100, lawId: 'pill',
            karma: 60, attrs: { 道心: 8, 悟性: 6 },
            relation: { 药尘子: 40 },
            title: '丹尊挚友',
            flag: { 药尘托付: true },
          },
        },
      },
      {
        label: '收下仙灵丹，许诺必携上界神草归来相报', hint: '直承厚赠 · 破境助力',
        outcome: {
          text: '药尘子仰头大笑：「好！那老夫就再厚着脸皮多活五百年，在草庐里等你带回一株天界灵芝！」',
          effects: {
            items: ['xianling_dan'],
            lawExp: 80, lawId: 'pill',
            lifespan: 40, attrs: { 悟性: 5, 气运: 4 },
            relation: { 药尘子: 30 },
            flag: { 药尘托付: true },
          },
        },
      },
    ],
  },

  /* ───────────── 4. 顾青衣 · 天机执笔（6 节点） ───────────── */
  {
    id: 'wkn_npc_gu_1', title: '青衣 · 潜龙易名', pool: 'world', tier: 3, weight: 7, minRealm: 1, region: 'luoxia',
    once: true,
    text: '落霞城天机阁檐角铜铃无风自响。顾青衣凭栏展开新刻的《潜龙榜》，朱笔悬在你的名字上方半寸未落。\n\n「{name}，你近来风头渐起，若我把你写进前三十，赏识你的人会来，想要夺你机缘的人也会来。怎么写，你来选。」',
    choices: [
      {
        label: '「照实落笔，是龙是蛇总要见天日」', hint: '声名鹊起 · 开启顾青衣主线',
        outcome: {
          text: '朱笔轻轻一点，墨香化作一缕青烟散入落霞云端。顾青衣眸色微深：「既敢入局，便随我去一趟城外天机残阁，有人正在暗中涂改你的命格。」',
          effects: { reputation: 35, attrs: { 气运: 3, 道心: 2 }, relation: { 顾青衣: 18 }, flag: { 潜龙留名: true } },
          goto: 'wkn_npc_gu_2',
        },
      },
      {
        label: '「请仙子隐去我真名，留个无名散修代称」', hint: '韬光养晦 · 气运神识皆进',
        outcome: {
          text: '顾青衣唇角微扬：「难得有年轻人不贪虚名。」她收笔起袖：「不过就算匿了名，城外天机残阁的异动你也避不开，同去看看罢。」',
          effects: { attrs: { 神识: 3, 悟性: 3 }, demon: -5, relation: { 顾青衣: 22 }, flag: { 潜龙隐名: true } },
          goto: 'wkn_npc_gu_2',
        },
      },
      {
        label: '淡然离去：「榜单虚妄，不必劳烦女史费墨」', hint: '不入天机局',
        outcome: {
          text: '顾青衣望着你的背影轻叹一声，最终只以淡墨在榜末添了一行极小批注：「此子难测。」',
          effects: { attrs: { 道心: 3 }, relation: { 顾青衣: 4 } },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_gu_2', title: '青衣 · 残阁焚简', pool: 'branch', tier: 4, weight: 0,
    text: (s) => `城外荒山的天机旧阁阴风凄凄，十二尊失控的青铜守阁傀儡正围着一座星盘祭坛发出低沉嘶鸣，坛心竟燃着一卷刻有你生辰气机的借命竹简！\n\n${s.flags['潜龙隐名'] ? '顾青衣冷笑：「亏你藏了真名，否则今夜这借命术已成大半。」' : '顾青衣神色凝重：「有人借潜龙榜声望暗施厌胜之术，毁了星盘，否则你往后三十年气运皆为他人作嫁！」'}`,
    choices: [
      {
        label: '挥剑劈开青铜守傀，直捣星盘祭坛', hint: '战斗 · 古修机关傀儡 · 强破邪术',
        combat: {
          enemy: 'ancient_puppet',
          win: {
            text: '青铜巨傀轰然解体，顾青衣疾步上前以朱笔点碎祭坛核心，那卷借命竹简化作飞灰，一缕清亮气运倒卷归入你眉心。',
            effects: { expPct: 0.24, lawExp: 35, lawId: 'karma', attrs: { 气运: 4, 神识: 3 }, relation: { 顾青衣: 24 } },
            goto: 'wkn_npc_gu_3',
          },
          lose: {
            text: '青铜傀儡重拳震裂你的护体灵光，顾青衣挥袖抛出一道替命金符硬炸星盘，拉着你疾退阁外。',
            effects: { hp: -48, injury: 1, lawExp: 20, lawId: 'karma', relation: { 顾青衣: 20 } },
            goto: 'wkn_npc_gu_3',
          },
        },
      },
      {
        label: '以神识顺着因果红线反推施术阵眼', hint: '神识与气运检定 · 反噬暗敌',
        roll: {
          p: 0.55, attrs: { 神识: 0.015, 气运: 0.012 },
          success: {
            text: '你指尖倒划一道逆因符纹，星盘骤然倒转！千里之外传来一声遥远闷哼，借命反噬尽数还给暗中宵小。顾青衣眸中异彩连连。',
            effects: { expPct: 0.22, lawExp: 45, lawId: 'karma', attrs: { 神识: 4, 悟性: 3 }, relation: { 顾青衣: 28 } },
            goto: 'wkn_npc_gu_3',
          },
          fail: {
            text: '因果丝线错综复杂，反推时遭了一记轻伤，好在顾青衣及时落笔截断邪阵，护住了你的命格。',
            effects: { hp: -32, attrs: { 神识: 2 }, relation: { 顾青衣: 18 } },
            goto: 'wkn_npc_gu_3',
          },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_gu_3', title: '青衣 · 因果定册', pool: 'branch', tier: 5, weight: 0,
    text: '残阁外晨雾初散，顾青衣取出一方漆盒，盒中静卧着一卷天机阁从不外传的素帛秘册。\n\n「世人以为天机阁只知算命，其实我们修的是『借因改果』。{name}，你身上牵连着九州将来的大劫，若只靠蛮力，迟早要吃暗亏。这卷《天机因果策》，便当作今夜并肩的谢礼。」',
    choices: [
      {
        label: '接过素帛，请顾青衣亲解因果法则初义', hint: '习得天阶《天机因果策》· 因果法则大涨',
        cost: { month: 2 },
        outcome: {
          text: '她执笔在你掌心画下一道淡金命纹，又逐字讲透因果流转之妙。从此你再看红尘众生，隐约能察一丝吉凶先兆。',
          effects: {
            techniques: [WORLD_TECH_BY_ID.wt_tianji_ce],
            lawExp: 65, lawId: 'karma',
            attrs: { 神识: 5, 悟性: 5, 气运: 4 },
            relation: { 顾青衣: 28 },
            title: '天机执因',
            flag: { 获天机因果策: true },
          },
        },
      },
      {
        label: '只求她以天机笔替自己遮蔽十年天劫窥伺', hint: '获天机庇护 · 破境成算与法则残片',
        outcome: {
          text: '顾青衣含笑点头，提笔凌空一挥，为你斩去三丝晦暗煞气，又将一枚温养多年的法则残片赠予你参悟。',
          effects: {
            items: ['faze_canpian'],
            breakBonus: 18,
            lawExp: 55, lawId: 'karma',
            attrs: { 气运: 6, 道心: 4 },
            relation: { 顾青衣: 24 },
            flag: { 获天机因果策: true },
          },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_gu_e1', title: '青衣 · 雨巷评榜', pool: 'world', tier: 3, weight: 6, minRealm: 2, region: 'luoxia',
    require: 'rel("顾青衣") >= 12',
    text: '梅雨细密，落霞城长街茶楼二层临窗处，顾青衣正一边品明前灵茶，一边在竹简上勾画九州百宗强弱。见你上楼，她示意你坐到对面。\n\n「最近东海与北荒各有异象，你若想知道哪一处秘境最合自己胃口，陪我下完这半盘棋，我便告诉你。」',
    choices: [
      {
        label: '落子对弈，借棋局窥探九州大势', hint: '悟性检定 · 闻知秘闻',
        cost: { month: 1 },
        roll: {
          p: 0.54, attrs: { 悟性: 0.014, 神识: 0.01 },
          success: {
            text: '你一子妙手活出边角死龙。顾青衣投子微笑，低声点出三处尚未出世的古修灵脉方位，又赠你一枚养神玉清丹。',
            effects: { items: ['yangshen_dan'], lawExp: 28, lawId: 'karma', attrs: { 悟性: 3, 气运: 3 }, relation: { 顾青衣: 16 } },
          },
          fail: {
            text: '终究棋差一着，顾青衣却仍将一份手抄的九州风物秘录递与你，免得你行路走弯。',
            effects: { expPct: 0.14, attrs: { 悟性: 2, 神识: 2 }, relation: { 顾青衣: 12 } },
          },
        },
      },
      {
        label: '不问秘境，只问她近来可曾再受天机反噬', hint: '关切本心 · 情谊深厚',
        outcome: {
          text: '顾青衣执棋的手微微一顿，半晌才轻声道：「满城人都向我问机缘，问我痛不痛的，你是头一个。」她收起棋盘，与你静静听了一下午雨声。',
          effects: { demon: -10, attrs: { 道心: 3, 魅力: 3 }, relation: { 顾青衣: 22 } },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_gu_e2', title: '青衣 · 残碑校史', pool: 'wild', tier: 4, weight: 5, minRealm: 3,
    require: 'rel("顾青衣") >= 22',
    text: '荒原古碑林雷云密布，顾青衣竟不顾天威正俯身拓印一块被雷火劈裂的太古仙碑。碑文刚拓出半行，半空便垂下一道冰冷的淡金雷丝！',
    choices: [
      {
        label: '祭出全部灵力替她硬抗天机雷丝', hint: '以身护史 · 因果法则大进',
        cost: { hp: 50 },
        outcome: {
          text: '雷丝炸散在你肩头，留下一道淡金灼痕。顾青衣迅速合上拓本，眼眶微红却神色决然，当即将拓出的上古秘辛与你共享。',
          effects: { expPct: 0.25, lawExp: 55, lawId: 'karma', attrs: { 道心: 5, 神识: 4 }, relation: { 顾青衣: 26 } },
        },
      },
      {
        label: '以虚空或阵法扰乱碑周气机，瞒过天雷探查', hint: '悟性与神识检定 · 智避天威',
        roll: {
          p: 0.56, attrs: { 悟性: 0.014, 神识: 0.014 },
          success: {
            text: '你瞬息布下遮天小阵，雷云盘旋片刻竟寻不到气机自行散去。顾青衣收好完整拓本，赠你一块珍藏的虚空晶。',
            effects: { items: ['xukong_jing'], lawExp: 45, lawId: 'karma', attrs: { 悟性: 4 }, relation: { 顾青衣: 24 } },
          },
          fail: {
            text: '遮蔽慢了一瞬，雷丝擦过碑角毁了半截文字，好在二人俱未大碍。',
            effects: { hp: -25, attrs: { 神识: 3 }, relation: { 顾青衣: 16 } },
          },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_gu_e3', title: '青衣 · 改线赠命', pool: 'world', tier: 5, weight: 5, minRealm: 5,
    require: 'rel("顾青衣") >= 35',
    once: true,
    text: '星河垂落寒江之夜，顾青衣约你登临天机阁最顶层。四壁无墙，唯有漫天命星如棋布列。她取出那支用了五百年的狼毫朱笔，笔锋已隐隐生出裂纹。\n\n「{name}，你离渡劫已不远。我这一生替天下人记了太多结局，唯独你的那一页，我想替你多留一条生路。」',
    choices: [
      {
        label: '按住她的手腕：「不必折你寿元替我改命，我的劫我自己渡」', hint: '珍重情谊 · 道心圆满，因果通明',
        outcome: {
          text: '顾青衣望着你按在笔杆上的手，良久低笑一声，收笔入怀：「好一句自己渡。」反倒因她未强逆天机，二人共观星河一夜，竟双双悟透一重因果真意。',
          effects: {
            items: ['yujian_yinguo'],
            lawExp: 95, lawId: 'karma',
            attrs: { 道心: 9, 气运: 6, 神识: 5 },
            demon: -25,
            relation: { 顾青衣: 38 },
            title: '共观星命',
            flag: { 青衣共命: true },
          },
        },
      },
      {
        label: '受她最后一次点命之恩，以自身气运分担一半反噬', hint: '因果同担 · 破境成算暴涨',
        cost: { hp: 60, month: 2 },
        outcome: {
          text: '朱笔落处，你命盘上最凶险的一处劫星骤然黯淡。天威降下时你与她并肩分承，虽各自咳血，却觉彼此命线已紧紧缠作一处。',
          effects: {
            breakBonus: 32,
            lawExp: 110, lawId: 'karma',
            attrs: { 气运: 8, 神识: 6 },
            relation: { 顾青衣: 40 },
            flag: { 青衣共命: true },
          },
        },
      },
    ],
  },

  /* ───────────── 5. 血煞老祖 · 北荒魔尊（6 节点） ───────────── */
  {
    id: 'wkn_npc_xuesha_1', title: '血煞 · 赤帖邀饮', pool: 'world', tier: 4, weight: 6, minRealm: 2, region: 'beihuang',
    once: true,
    text: '北荒赤沙卷过残城，一封浸过妖龙血的玄铁请帖钉在你客栈门框上，余威震得整条街巷狗吠顿绝。帖上只有七个张狂大字：「血池酒温，速来一叙。」落款是一道猩红指印——血煞老祖。\n\n店小二吓得跪地发抖，而城外血云已沉沉压低三百丈。',
    choices: [
      {
        label: '拔下玄铁血帖，单身直赴北荒血池赴宴', hint: '胆气盖世 · 开启血煞老祖主线',
        cost: { month: 1 },
        outcome: {
          text: '血煞老祖端坐万骨王座，见你面不改色推开血雾而来，击掌大笑：「好！正道那些软脚虾见了请帖早逃出三千里，唯独你敢只身赴宴！」',
          effects: { relation: { 血煞老祖: 20 }, attrs: { 道心: 3 }, demon: 4, flag: { 赴血池宴: true } },
          goto: 'wkn_npc_xuesha_2',
        },
      },
      {
        label: '携一瓶血煞魔核或破障丹作伴手礼赴约', hint: '需血煞魔核 · 魔尊极喜',
        require: 'has("xuesha_jing")', requireHint: '行囊中并无血煞魔核',
        cost: { item: 'xuesha_jing', month: 1 },
        outcome: {
          text: '你随手将血煞魔核抛入血池激起百丈红浪。血煞老祖眯起眼抚须狂笑：「懂规矩，够狠辣！今晚本座亲手替你斟酒！」',
          effects: { relation: { 血煞老祖: 28 }, attrs: { 根骨: 3, 魅力: 2 }, demon: 5, flag: { 赴血池宴: true, 献核结魔: true } },
          goto: 'wkn_npc_xuesha_2',
        },
      },
      {
        label: '一剑将血帖劈作两截，冷然离城', hint: '誓不与魔伍 · 声望业力大增',
        outcome: {
          text: '血帖崩碎时爆出一声遥远冷哼，城外血云翻涌半刻终究散去。城中正道修士闻讯，皆对你肃然起敬。',
          effects: { reputation: 45, karma: 25, attrs: { 道心: 4 }, relation: { 血煞老祖: -12 } },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_xuesha_2', title: '血煞 · 血池淬胆', pool: 'branch', tier: 4, weight: 0,
    text: (s) => `北荒血池滚沸如岩浆，池中沉浮着上古凶兽遗骸。血煞老祖拎起一坛血酿浇入池心，回头森然一笑。\n\n${s.flags['献核结魔'] ? '「本座赏识你这股狠劲。' : '「光有胆子进来还不够。'}敢不敢跳进血池外围扛住一炷香煞气冲刷？或者——与本座座下血衣长老打一场生死赌斗，赢了，血河真传本座亲自递到你手上！」`,
    choices: [
      {
        label: '拔剑踏上血池骨桥，死战血海长老', hint: '战斗 · 血海长老 · 以杀证胆',
        combat: {
          enemy: 'blood_elder',
          win: {
            text: '血桥寸寸崩裂，你一剑逼得血海长老跪地吐血。王座上的血煞老祖拍案喝彩，满殿魔修噤若寒蝉！',
            effects: { expPct: 0.28, lawExp: 45, lawId: 'blood', attrs: { 根骨: 4 }, relation: { 血煞老祖: 26 }, flag: { 血池称雄: true } },
            goto: 'wkn_npc_xuesha_3',
          },
          lose: {
            text: '血海煞气如涛压顶，你被震下骨桥咳血不止。血煞老祖却亲自出手拦住补刀的长老：「够了！以弱搏强而不退半步，本座要的就是这股疯劲。」',
            effects: { hp: -65, injury: 1, lawExp: 25, lawId: 'blood', relation: { 血煞老祖: 18 } },
            goto: 'wkn_npc_xuesha_3',
          },
        },
      },
      {
        label: '纵身跃入血池外缘，硬以肉身炼化千年煞气', hint: '根骨与道心检定 · 极险淬体',
        cost: { hp: 50, month: 1 },
        roll: {
          p: 0.54, attrs: { 根骨: 0.015, 道心: 0.012 },
          success: {
            text: '滚烫血浪钻入骨髓，无数凶兽嘶吼在识海炸响，你咬破舌尖守住灵台清明，破池而出时周身血气凝若赤虹！',
            effects: { expPct: 0.25, lawExp: 50, lawId: 'blood', attrs: { 根骨: 6 }, demon: 8, relation: { 血煞老祖: 28 }, flag: { 血池称雄: true } },
            goto: 'wkn_npc_xuesha_3',
          },
          fail: {
            text: '煞气反噬冲得你经脉剧痛，被血煞老祖隔空拎出池面，笑骂一句「火候差半寸，筋骨倒算硬朗」。',
            effects: { hp: -40, demon: 12, attrs: { 根骨: 3 }, relation: { 血煞老祖: 16 } },
            goto: 'wkn_npc_xuesha_3',
          },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_xuesha_3', title: '血煞 · 血河焚天', pool: 'branch', tier: 5, weight: 0,
    text: '夜半血月正中，血煞老祖遣散满殿魔徒，独留你在池畔对饮。他摘下一枚刻满猩红太古篆文的血骨玉简，弹指送至你面前。\n\n「正道教你忍，教你敬天，可天劫劈下来的时候可曾饶过谁？《血河焚天魔功》是本座横行北荒千年的根本——怕心魔反噬就别碰，敢修，便让九天仙佛也尝尝血河倒卷的滋味！」',
    choices: [
      {
        label: '接过血骨玉简，直面魔念习练《血河焚天魔功》', hint: '习得天阶《血河焚天魔功》· 心魔与业力受染',
        cost: { month: 2 },
        outcome: {
          text: '猩红篆文烙入识海，刹那间仿佛听见太古战场万马奔腾。你强压翻涌杀意，彻底悟透血河杀伐真谛。血煞老祖大笑拂袖，赠你一瓶龙血精固本。',
          effects: {
            techniques: [WORLD_TECH_BY_ID.wt_xuehe_sha],
            items: ['longxue_jing'],
            lawExp: 70, lawId: 'blood',
            attrs: { 根骨: 6, 神识: 4 },
            demon: 16, karma: -35,
            relation: { 血煞老祖: 30 },
            title: '血河客卿',
            flag: { 获血河魔功: true },
          },
        },
      },
      {
        label: '只取其以血淬体之法，不沾噬魂夺寿邪路', hint: '借魔修道 · 无损业力，大进血海法则',
        cost: { month: 1 },
        outcome: {
          text: '血煞老祖嗤笑一声：「还留着半分正道洁癖？随你！」他却仍颇赏识你的清醒，挥手打入一缕纯正血海法则印记。',
          effects: {
            lawExp: 75, lawId: 'blood',
            attrs: { 道心: 6, 根骨: 5 },
            demon: 4,
            relation: { 血煞老祖: 22 },
            flag: { 获血河魔功: true },
          },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_xuesha_e1', title: '血煞 · 赤沙论正邪', pool: 'world', tier: 3, weight: 6, minRealm: 2, region: 'beihuang',
    require: 'rel("血煞老祖") >= 10',
    text: '北荒赤沙驿站的破屋檐下，血煞老祖竟化作寻常黑袍中年，正拿一块干饼喂路边野犬。见你走过，他抬眼笑道：「刚顺手宰了两个假借除魔之名洗劫凡人村落的正道金丹。{name}，你说这世上究竟谁才是魔？」',
    choices: [
      {
        label: '「正邪不在袍色，在手里那把剑指着谁」', hint: '畅所欲言 · 魔尊激赏',
        outcome: {
          text: '血煞老祖大笑，顺手将那两名败类遗留的储物袋踢到你脚边：「说得好！这些正道垃圾的东西本座嫌晦气，归你了。」',
          effects: { stones: 520, attrs: { 道心: 4 }, lawExp: 25, lawId: 'blood', relation: { 血煞老祖: 16 } },
        },
      },
      {
        label: '「正道有败类，魔道亦多屠戮，皆不可纵」', hint: '不偏不倚 · 守持本心',
        outcome: {
          text: '血煞老祖收起笑意，盯着你看了半晌，反而微微颔首：「怪不得你活到现在还没疯。」言罢踏沙而去，留下一枚清心丹。',
          effects: { items: ['qingxin_dan'], attrs: { 道心: 5 }, demon: -8, relation: { 血煞老祖: 12 } },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_xuesha_e2', title: '血煞 · 截杀伪君子', pool: 'wild', tier: 4, weight: 5, minRealm: 3, region: 'beihuang',
    require: 'rel("血煞老祖") >= 22',
    text: '北荒戈壁黑风怒号，三名打着正道旗号的元婴血衣剑修正在围攻一处散修矿脉，嘴里却高喊着「替天行道、收缴魔矿」。血煞老祖蹲在高崖上啃着灵果，冲你努努嘴：「去把那个最吵的砍了，矿底那截万年血精分你七成。」',
    choices: [
      {
        label: '纵剑下崖，斩杀为首血衣伪君子', hint: '战斗 · 血衣剑尊 · 除伪扬威',
        combat: {
          enemy: 'crimson_sword',
          win: {
            text: '剑光撕破伪善画皮，残余匪修望风而逃。血煞老祖纵身跃下矿洞，果然守诺将七成血煞精粹与灵石推到你面前。',
            effects: { items: ['xuesha_jing', 'longxue_jing'], stones: 900, lawExp: 40, lawId: 'blood', relation: { 血煞老祖: 24 } },
          },
          lose: {
            text: '对方剑势诡毒，你略落下风。血煞老祖冷哼一声弹指轰退强敌，嘲笑你「杀心还是不够重」。',
            effects: { hp: -60, lawExp: 20, lawId: 'blood', relation: { 血煞老祖: 14 } },
          },
        },
      },
      {
        label: '先掩护矿脉中的散修撤离，再毁矿断其贪念', hint: '仁智兼备 · 业力大涨',
        outcome: {
          text: '矿工们含泪叩谢而去。血煞老祖在崖上看得直撇嘴，却还是丢给你一瓶破障丹：「妇人之仁……罢了，总比那群伪君子顺眼。」',
          effects: { items: ['pozhang_dan'], karma: 40, reputation: 35, relation: { 血煞老祖: 12 } },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_xuesha_e3', title: '血煞 · 逆天血酒', pool: 'world', tier: 5, weight: 5, minRealm: 5,
    require: 'rel("血煞老祖") >= 36',
    once: true,
    text: '北荒雷云低垂之夜，血煞老祖独自坐在万丈绝巅，身前摆着两只用上古魔龙颅骨雕成的巨碗。他仰头看着云层后若隐若现的天威，神色竟有几分寂寥。\n\n「{name}，本座这辈子杀过正道盟主，也拆过上界巡使的法旨。往后九霄天劫下来，正魔两道都躲不过。来，干了这碗逆天血酒——若你先踏碎天门，替本座往那群仙官脸上吐口唾沫！」',
    choices: [
      {
        label: '举起龙骨碗一饮而尽，与魔尊共誓逆天证道', hint: '豪气冲霄 · 血海法则与修为暴涨',
        cost: { month: 1 },
        outcome: {
          text: '烈酒如岩浆滚过喉头，天地雷云仿佛被二人狂意激怒，轰隆作响却终究未落。血煞老祖解下珍藏千年的修罗古简抛入你怀：「走罢，别死在半道上！」',
          effects: {
            items: ['yujian_xuesha'],
            expPct: 0.35, lawExp: 100, lawId: 'blood',
            attrs: { 根骨: 7, 道心: 7 },
            demon: 10,
            relation: { 血煞老祖: 35 },
            title: '血海同狂',
            flag: { 逆天血酒: true },
          },
        },
      },
      {
        label: '以灵茶代血酒遥敬一杯：「天门我自会去闯，不借魔焰」', hint: '魔尊敬重 · 澄明道心',
        outcome: {
          text: '血煞老祖大笑震落山石：「好！各走各的独木桥，倒看谁先掀翻那张仙桌！」他顺手赠你一滴太古龙血精壮骨。',
          effects: {
            items: ['longxue_jing', 'dahuan_dan'],
            lawExp: 80, lawId: 'blood',
            attrs: { 道心: 8, 根骨: 5 },
            relation: { 血煞老祖: 28 },
            flag: { 逆天血酒: true },
          },
        },
      },
    ],
  },

  /* ───────────── 6. 林昊 · 落霞世家天骄（6 节点） ───────────── */
  {
    id: 'wkn_npc_lin_1', title: '林昊 · 世家傲锋', pool: 'world', tier: 3, weight: 7, minRealm: 0, region: 'luoxia',
    once: true,
    text: '落霞城林氏演武场外石灯长明。身着青霜锦袍的林昊刚一剑挑落三名世家客卿，目光穿过人群精准定在你身上。少年眉宇间尽是世家天骄的锐气与不服。\n\n「{name}！旁人都夸你散修出身却进境神速。林氏百年底蕴，容不得外人轻看——敢不敢上台接我三式青霜剑？」',
    choices: [
      {
        label: '纵身登台，正面接他三式青霜剑', hint: '战斗 · 筑基修士 · 开启林昊宿敌主线',
        combat: {
          enemy: 'cultivator',
          win: {
            text: '剑光交错十余合，你一剑点中他腕间旧隙，青霜剑嗡然脱手。满场林氏子弟哗然，林昊脸色由青转红，却咬牙抱拳：「是我小瞧了天下英杰！三日后城西古陵试炼，可敢同入一争高下？」',
            effects: { expPct: 0.2, reputation: 35, attrs: { 根骨: 2, 悟性: 2 }, relation: { 林昊: 18 }, flag: { 演武胜林昊: true } },
            goto: 'wkn_npc_lin_2',
          },
          lose: {
            text: '青霜剑势沉如山岳，将你逼下石台。林昊收剑俯视，却并无羞辱之意，反倒丢来一瓶培元丹：「根基不差，只是少了几分世家资源。三日后城西古陵，跟紧些，别被我甩远了。」',
            effects: { hp: -30, items: ['peiyuan_dan'], relation: { 林昊: 14 }, flag: { 演武试林昊: true } },
            goto: 'wkn_npc_lin_2',
          },
        },
      },
      {
        label: '立于台下指点他第三式转腕破绽，不动兵刃', hint: '悟性检定 · 以眼力折服天骄',
        roll: {
          p: 0.54, attrs: { 悟性: 0.014, 神识: 0.01 },
          success: {
            text: '你一语道破他灵力换气时的半息迟滞。林昊骤然僵住，随即目光灼灼步下高台：「好毒的眼力！城西古陵将启，我正缺个能看穿死局的对手。」',
            effects: { attrs: { 悟性: 3, 神识: 2 }, relation: { 林昊: 22 }, flag: { 演武折林昊: true } },
            goto: 'wkn_npc_lin_2',
          },
          fail: {
            text: '林昊冷哼一声当场变招封死你说的破绽，虽仍邀你同探城西古陵，眼神里却满是不服。',
            effects: { relation: { 林昊: 10 }, flag: { 演武试林昊: true } },
            goto: 'wkn_npc_lin_2',
          },
        },
      },
      {
        label: '拱手退开：「争一时意气，无益长生」', hint: '淡然避战',
        outcome: {
          text: '林昊冷笑拂袖：「没骨气的散修！」转身回府，却也悄悄记住了你的冷静。',
          effects: { attrs: { 道心: 2 }, relation: { 林昊: -5 } },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_lin_2', title: '林昊 · 古陵并肩', pool: 'branch', tier: 4, weight: 0,
    text: (s) => `城西古陵石门轰然闭合，阴煞雾气翻涌而出——竟有血魔宗余孽勾结林氏旁支长老，意图将林昊与所有入陵天骄一网打尽！\n\n${s.flags['演武胜林昊'] ? '林昊肩头已中一记阴掌，却硬挺着长剑挡在石道口，回头朝你冷笑：「别死在这里，我还没赢回来！」' : '林昊背靠石碑连斩两具阴傀，忽见毒刃从你背后袭来，竟毫不犹豫横剑替你格开！'}前方黑袍邪修狞笑逼近。`,
    choices: [
      {
        label: '背靠背迎战血魔宗邪徒，共破死局', hint: '战斗 · 血魔宗弟子 · 宿敌化战友',
        combat: {
          enemy: 'blood_cult',
          win: {
            text: '青霜剑气与你的攻势前后呼应，硬生生将血魔邪徒劈作两段！石门禁制随之崩解，二人浑身浴血相互搀扶着走出古陵。',
            effects: { expPct: 0.26, reputation: 45, karma: 20, relation: { 林昊: 28 }, flag: { 古陵共生死: true } },
            goto: 'wkn_npc_lin_3',
          },
          lose: {
            text: '邪修血煞太盛，林昊燃尽随身玉佩护符硬炸开一道石缝，拼死将你推了出去，自己亦险死还生。',
            effects: { hp: -55, injury: 1, relation: { 林昊: 26 }, flag: { 古陵共生死: true } },
            goto: 'wkn_npc_lin_3',
          },
        },
      },
      {
        label: '催动神识寻出古陵生门阵眼，携林昊突围', hint: '神识与悟性检定 · 智破绝阵',
        roll: {
          p: 0.56, attrs: { 神识: 0.014, 悟性: 0.012 },
          success: {
            text: '你一剑挑碎角落隐蔽的血纹石灯，整座杀阵瞬间反噬邪徒。林昊拍着你的肩大笑，昔日傲气尽化作惺惺相惜。',
            effects: { expPct: 0.22, attrs: { 神识: 3, 悟性: 3 }, relation: { 林昊: 24 }, flag: { 古陵共生死: true } },
            goto: 'wkn_npc_lin_3',
          },
          fail: {
            text: '生门石闸卡住半尺，你与林昊硬扛血刃强行撞出墓道，各自挂彩却保住了性命。',
            effects: { hp: -40, relation: { 林昊: 18 }, flag: { 古陵共生死: true } },
            goto: 'wkn_npc_lin_3',
          },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_lin_3', title: '林昊 · 青霜释怨', pool: 'branch', tier: 4, weight: 0,
    text: '古陵风波平息三日后，林昊设宴于落霞城最高酒楼，却只摆了两双筷子、一壶清酒。他亲手将林氏家传秘典《青霜破岳诀》的拓本推到你面前。\n\n「从前我总觉得世家血脉高人一等，直到差点死在自家旁支手里，才明白仙路上能把后背交出去的人有多难得。{name}，这卷剑诀换你我日后堂堂正正再战百场，如何？」',
    choices: [
      {
        label: '欣然收下拓本，以己身实战心得与他互证剑道', hint: '习得玄阶《青霜破岳诀》· 化敌为友',
        cost: { month: 1 },
        outcome: {
          text: '那一夜你们在落霞楼顶拆解了三十六式剑招，直到东方泛白。昔日最锋利的磨刀石，终成了此生最硬朗的同道挚友。',
          effects: {
            techniques: [WORLD_TECH_BY_ID.wt_qingshuang_jue],
            lawExp: 45, lawId: 'sword',
            attrs: { 根骨: 4, 悟性: 4 },
            relation: { 林昊: 28 },
            title: '霜岳知交',
            flag: { 获青霜破岳诀: true },
          },
        },
      },
      {
        label: '婉辞家传秘典，只取他赠予的筑基灵丹与剑意封灵符', hint: '重义守分 · 获实用重礼',
        outcome: {
          text: '林昊微愣，随即郑重抱拳：「你这般气度，林某服了！」他亲手将一枚林氏库藏的筑基丹与两道剑符放入你袖中。',
          effects: {
            items: ['zhuji_dan', 'jianqi_fu'],
            lawExp: 35, lawId: 'sword',
            attrs: { 道心: 5, 魅力: 3 },
            relation: { 林昊: 30 },
            flag: { 获青霜破岳诀: true },
          },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_lin_e1', title: '林昊 · 落霞对饮', pool: 'world', tier: 2, weight: 6, minRealm: 0, region: 'luoxia',
    require: 'rel("林昊") >= 10',
    text: '傍晚晚霞烧红了半座落霞城。你在城头歇脚时，林昊提着两坛桂花酿翻上垛口，丢来一坛：「家族那群老古董整日逼我联姻争权，烦得紧。陪我喝完这坛，顺便说说你最近在外面撞见什么厉害对手没？」',
    choices: [
      {
        label: '拍开泥封与他痛饮，共话九州风云', hint: '畅快舒怀 · 驱散心魔',
        outcome: {
          text: '酒过三巡，少年意气丝毫不减。林昊听得眼底发亮，临别顺手把一柄家库闲置的青锋剑连同几块玄铁塞给你作盘缠。',
          effects: { items: ['xuantie'], demon: -8, attrs: { 道心: 2, 魅力: 2 }, relation: { 林昊: 15 } },
        },
      },
      {
        label: '劝他先稳固境界，当场与他隔空拆解十招', hint: '互相砥砺 · 修为剑道齐进',
        cost: { month: 1 },
        outcome: {
          text: '城头晚风中两道剑气纵横呼应，引得城下凡人仰头惊叹。收剑时林昊神清气爽，连称痛快。',
          effects: { expPct: 0.16, lawExp: 22, lawId: 'sword', attrs: { 根骨: 2 }, relation: { 林昊: 14 } },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_lin_e2', title: '林昊 · 祖祠护脉', pool: 'world', tier: 4, weight: 5, minRealm: 2, region: 'luoxia',
    require: 'rel("林昊") >= 20',
    text: '深夜落霞城地脉震动，林氏祖祠灵井突然涌出漆黑魔气——原来是数十年前被林家先祖镇压的一具阴煞尸将破封欲出！林昊独撑祠堂护阵，嘴角已渗出鲜血，见你赶来顿时精神一振。',
    choices: [
      {
        label: '踏入祠堂联手斩杀阴煞尸将', hint: '战斗 · 阴煞尸将 · 力挽狂澜',
        combat: {
          enemy: 'corpse_general',
          win: {
            text: '剑光引动祖祠青灯净化尸煞，尸将灰飞烟灭。林氏族老含泪致谢，林昊笑得骄傲：「我说过，这位才是我请得动的真靠山！」',
            effects: { items: ['jiejin_dan'], stones: 600, reputation: 55, karma: 30, relation: { 林昊: 24 } },
          },
          lose: {
            text: '尸毒凛冽，你与林昊拼尽底牌才勉强重新封住灵井，虽负了轻伤却保住全城安宁。',
            effects: { hp: -50, reputation: 30, karma: 20, relation: { 林昊: 18 } },
          },
        },
      },
      {
        label: '在祠外布下镇邪符阵，助林昊重固封印', hint: '悟性检定 · 稳固地脉',
        roll: {
          p: 0.56, attrs: { 悟性: 0.014, 神识: 0.01 },
          success: {
            text: '青铜锁链随着阵光重新扣紧灵井，魔气尽数回缩。林昊擦去汗水，亲手奉上族中秘藏的聚灵丹与灵石酬谢。',
            effects: { items: ['juling_dan'], stones: 400, attrs: { 悟性: 3 }, relation: { 林昊: 20 } },
          },
          fail: {
            text: '阵法稍有偏差，耗费不少灵力才强行压住尸煞，却也赢得林氏上下敬重。',
            effects: { mp: -35, reputation: 25, relation: { 林昊: 14 } },
          },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_lin_e3', title: '林昊 · 九州同问鼎', pool: 'world', tier: 5, weight: 5, minRealm: 4,
    require: 'rel("林昊") >= 35',
    once: true,
    text: '百年后再见林昊，他早已不再是落霞城那个意气风发的世家少年，而是扛起整座落霞灵域防线的化神剑尊。他立于域外星碑下，玄袍猎猎，腰间仍挂着当年与你切磋时崩出缺口的旧剑。\n\n「上界巡使近来频频施压，九州不少大宗都低了头。{name}，当年我说元婴之前要胜你一回，如今看来，倒不如你我联手，把这片天给九州撑起来！」',
    choices: [
      {
        label: '拔剑与他剑尖相抵：「九州脊梁，你我共扛！」', hint: '并肩问道 · 声望与剑道大增',
        outcome: {
          text: '两道化神剑意直冲云霄，震散万里阴霾。林昊放声大笑，将一枚自己亲手祭炼的护道雷符与法则残片放入你掌心。',
          effects: {
            items: ['jiuxiao_leifu', 'faze_canpian'],
            expPct: 0.3, lawExp: 80, lawId: 'sword',
            reputation: 110, attrs: { 道心: 7, 根骨: 6 },
            relation: { 林昊: 35 },
            title: '九州同袍',
            flag: { 林昊共扛九州: true },
          },
        },
      },
      {
        label: '约他在星碑下畅快切磋百招，了却当年未尽之约', hint: '以剑铭志 · 根骨悟性暴涨',
        cost: { month: 1 },
        outcome: {
          text: '星光碎落满地，二人战至力竭方才收剑坐倒在古碑旁大笑。百年恩怨意气，尽数化作仙路上最踏实的底气。',
          effects: {
            expPct: 0.35, lawExp: 85, lawId: 'sword',
            attrs: { 根骨: 7, 悟性: 6 },
            demon: -20,
            relation: { 林昊: 32 },
            flag: { 林昊共扛九州: true },
          },
        },
      },
    ],
  },

  /* ───────────── 7. 云霓仙子 · 归墟听潮阁主（6 节点） ───────────── */
  {
    id: 'wkn_npc_yunni_1', title: '云霓 · 听潮逆舟', pool: 'world', tier: 4, weight: 7, minRealm: 2, region: 'guixu',
    once: true,
    text: '东海归墟海眼边缘雾涛翻涌，孤礁之上的白玉听潮阁在星光下宛如海市蜃楼。白衣云霓仙子立于飞檐之上，衣袂猎猎，脚下百丈海面正缓缓旋转出深不见底的漆黑漩涡。\n\n她回眸望向登礁的你，声音清越如珠落玉盘：「海眼三百年一次大退潮，海底古龙宫将露出一隅。阁中护法皆去镇守海商航道，{name}，你可愿随我乘逆潮灵舟同赴深渊？」',
    choices: [
      {
        label: '登舟同行：「早闻归墟龙宫奇伟，愿随阁主一探」', hint: '开启云霓仙子主线 · 深入海眼',
        cost: { month: 1 },
        outcome: {
          text: '云霓仙子素手轻挥，灵舟化作一道银白星弧扎入漆黑海眼！海水被阵光排开十丈，星辉竟随船底倒灌入深海。',
          effects: { relation: { 云霓仙子: 18 }, attrs: { 神识: 3 }, flag: { 同赴归墟: true } },
          goto: 'wkn_npc_yunni_2',
        },
      },
      {
        label: '赠上一株归墟灵珊瑚助灵舟加固避水禁制', hint: '需归墟灵珊瑚 · 仙子赞赏',
        require: 'has("guixu_shanhu")', requireHint: '行囊中并无归墟灵珊瑚',
        cost: { item: 'guixu_shanhu', month: 1 },
        outcome: {
          text: '灵珊瑚嵌上船首的瞬间，整艘灵舟水光澄澈如镜。云霓仙子展颜微笑：「道友心思缜密，此行胜算又多三分。」',
          effects: { relation: { 云霓仙子: 26 }, attrs: { 悟性: 3, 神识: 3 }, flag: { 同赴归墟: true, 珊瑚固舟: true } },
          goto: 'wkn_npc_yunni_2',
        },
      },
      {
        label: '拱手辞别：「海眼凶险，晚辈水性浅薄」', hint: '稳妥留岸',
        outcome: {
          text: '云霓仙子淡然颔首，独自御舟没入惊涛。你立于礁岸良久，只觉满耳星涛浩渺。',
          effects: { attrs: { 道心: 2 }, relation: { 云霓仙子: -3 } },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_yunni_2', title: '云霓 · 沉渊龙宫', pool: 'branch', tier: 4, weight: 0,
    text: (s) => `万丈深海之下，残破的琉璃龙宫倒映着穹顶星阵。殿心镇海玉柱已生裂纹，一头浑身缠绕冥海骨链的巨大海妖正疯狂撞击阵眼，欲放归墟暗流倒灌东海诸岛！\n\n${s.flags['珊瑚固舟'] ? '灵舟避水罩纹丝不动，云霓仙子轻叹：「幸亏有你的珊瑚固舟，否则海压早已压碎船骨。」' : '海水重压令灵舟嘎吱作响，云霓仙子白衣微湿，剑指前方。'}「我需以潮汐剑阵重封玉柱，请道友替我挡住这头孽畜！」`,
    choices: [
      {
        label: '踏浪迎敌，死战守护玉柱的冥海骨蛟', hint: '战斗 · 冥海骨蛟 · 力镇海眼',
        combat: {
          enemy: 'bone_dragon',
          win: {
            text: '剑气破开深海暗流，骨蛟哀鸣崩解作万千寒骨。云霓仙子玉指连弹，七道星辉剑阵瞬间合拢镇海玉柱，万里东海重归平静！',
            effects: { expPct: 0.28, lawExp: 45, lawId: 'star', karma: 35, reputation: 50, relation: { 云霓仙子: 26 }, flag: { 镇压海眼: true } },
            goto: 'wkn_npc_yunni_3',
          },
          lose: {
            text: '骨蛟巨尾横扫，震伤你的肺腑。云霓仙子不惜自损精元催动星潮剑阵强行逼退骨蛟，护住你退回灵舟。',
            effects: { hp: -60, injury: 1, lawExp: 25, lawId: 'star', relation: { 云霓仙子: 22 }, flag: { 镇压海眼: true } },
            goto: 'wkn_npc_yunni_3',
          },
        },
      },
      {
        label: '借龙宫残余星辰阵纹反引海压镇锁骨蛟', hint: '悟性与神识检定 · 借势镇海',
        roll: {
          p: 0.55, attrs: { 悟性: 0.015, 神识: 0.012 },
          success: {
            text: '你指尖点亮三枚海底古星碑，深海重压顿时倒扣在骨蛟脊背之上！云霓仙子趁势一剑定海，眼中流露出由衷钦佩。',
            effects: { expPct: 0.24, lawExp: 50, lawId: 'star', attrs: { 悟性: 4, 神识: 4 }, karma: 30, relation: { 云霓仙子: 28 }, flag: { 镇压海眼: true } },
            goto: 'wkn_npc_yunni_3',
          },
          fail: {
            text: '古碑年久失修只亮起两座，虽未能困死骨蛟，却也替云霓争取了封柱的宝贵三息。',
            effects: { hp: -38, lawExp: 25, lawId: 'star', relation: { 云霓仙子: 18 }, flag: { 镇压海眼: true } },
            goto: 'wkn_npc_yunni_3',
          },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_yunni_3', title: '云霓 · 沧海星潮', pool: 'branch', tier: 5, weight: 0,
    text: '灵舟破水重归海面时，恰逢东海月出。万顷碧波倒映漫天星斗，宛如置身银河中央。云霓仙子解下颈间那枚星辉流转的海玉玉简，双手奉至你面前。\n\n「海眼若塌，东海百万凡人与海商俱成鱼食。{name}，你今日救的不是听潮阁，是半片东海。这卷《沧海潮汐星剑录》乃阁中镇阁秘典，唯心海澄明之人可修——请你收下。」',
    choices: [
      {
        label: '于舟头迎月受简，共参《沧海潮汐星剑录》', hint: '习得地阶《沧海潮汐星剑录》· 星辰法则大涨',
        cost: { month: 2 },
        outcome: {
          text: '海风送来悠远涛声，你盘坐舟头以神识引动海面星影入体，丹田灵力顿时随潮汐涨落而圆融不竭。',
          effects: {
            techniques: [WORLD_TECH_BY_ID.wt_canghai_jue],
            lawExp: 65, lawId: 'star',
            attrs: { 神识: 5, 悟性: 5, 魅力: 3 },
            relation: { 云霓仙子: 28 },
            title: '听潮星客',
            flag: { 获沧海星剑录: true },
          },
        },
      },
      {
        label: '谢过秘典，请她赠一枚沧海定水珠作护海信物', hint: '获地阶法宝沧海定水珠 · 星辰感悟大增',
        outcome: {
          text: '云霓仙子含笑将定水灵珠系于你腰间：「持此珠行遍东海，万水皆为道友让路。」',
          effects: {
            items: ['canghai_zhu'],
            lawExp: 60, lawId: 'star',
            attrs: { 神识: 5, 道心: 4 },
            relation: { 云霓仙子: 26 },
            flag: { 获沧海星剑录: true },
          },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_yunni_e1', title: '云霓 · 礁楼听涛', pool: 'world', tier: 3, weight: 6, minRealm: 2, region: 'guixu',
    require: 'rel("云霓仙子") >= 10',
    text: '星夜海潮初涨，听潮阁二楼纱幔轻扬。云霓仙子正抚七弦海玉琴，琴音竟与浪涛拍礁的节拍分毫不差。见你踏阶而上，她指了指案上温好的碧海灵茶。',
    choices: [
      {
        label: '静坐听完一曲《归墟引》，以神识合拍', hint: '涤荡心神 · 星辰与神识齐涨',
        cost: { month: 1 },
        outcome: {
          text: '一曲终了，你只觉识海宛如被海水涤洗一新，所有烦躁心魔尽随退潮远去。云霓赠你一缕星辰砂助你祭宝。',
          effects: { items: ['xingchen_sha'], demon: -14, lawExp: 30, lawId: 'star', attrs: { 神识: 3 }, relation: { 云霓仙子: 16 } },
        },
      },
      {
        label: '与她探讨海面星象与内景星海的呼应之妙', hint: '论道解惑 · 修为悟性双收',
        cost: { month: 1 },
        outcome: {
          text: '二人对坐论道至晓星沉海，云霓随手指出的三处星脉节点令你灵台豁然大明。',
          effects: { expPct: 0.2, lawExp: 35, lawId: 'star', attrs: { 悟性: 4 }, relation: { 云霓仙子: 14 } },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_yunni_e2', title: '云霓 · 护航灵船', pool: 'wild', tier: 4, weight: 5, minRealm: 3, region: 'guixu',
    require: 'rel("云霓仙子") >= 20',
    text: '东海雾航之上，三艘满载药材与凡人水手的商船被一头遮天巨鲲掀起的黑浪团团困住。云霓仙子正踏浪布阵稳住船队，远远冲你传音：「借道友一剑斩断妖鲲吸灵漩涡！」',
    choices: [
      {
        label: '凌空斩入漩涡中心，硬撼归墟巨鲲', hint: '战斗 · 归墟巨鲲 · 护佑东海航道',
        combat: {
          enemy: 'abyss_leviathan',
          win: {
            text: '你与云霓一上一下合击妖鲲逆鳞，巨兽吃痛遁入万丈海沟。船队水手齐齐跪拜甲板，海商执事奉上厚礼致谢。',
            effects: { stones: 1200, items: ['guixu_shanhu'], karma: 45, reputation: 65, relation: { 云霓仙子: 24 } },
          },
          lose: {
            text: '巨鲲吸力骇人，虽被你们合力惊退保住船队，你却耗损了不少气血。云霓亲手以灵泉为你疗伤。',
            effects: { hp: -55, karma: 30, reputation: 35, relation: { 云霓仙子: 18 } },
          },
        },
      },
      {
        label: '以灵力护住三艘商船冲出暗流，暂避巨鲲锋芒', hint: '保民优先 · 稳妥脱险',
        cost: { mp: 40 },
        outcome: {
          text: '灵舟破雾而出，所有船客无一伤亡。云霓收剑赞道：「剑修能知进退、护苍生，最是难得。」',
          effects: { karma: 35, reputation: 40, attrs: { 道心: 4 }, relation: { 云霓仙子: 18 } },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_yunni_e3', title: '云霓 · 星海同归', pool: 'world', tier: 5, weight: 5, minRealm: 5,
    require: 'rel("云霓仙子") >= 35',
    once: true,
    text: '百年一现的「星河落海」奇观之夜，东海万里无波，天上星斗与海中倒影浑然难分。云霓仙子赤足踏在星辉水面上，白衣胜雪，转身向你伸出一只微凉的手。\n\n「守了听潮阁三百年，我头一回想把阁主玉印交与弟子，随一个人去看看归墟之外的星海尽头。{name}，你肯带我一程么？」',
    choices: [
      {
        label: '握住她的手，于星海倒影间共参周天大道', hint: '深盟同契 · 获星河羽扇与星辰大悟',
        cost: { month: 2 },
        outcome: {
          text: '星光化作漫天银絮绕二人旋转不休。那一夜天地寂静，云霓将温养百年的星河羽扇与周天星辉丹尽数托付于你，从此海角天涯互为照应。',
          effects: {
            items: ['xinghe_shan', 'xinghui_dan'],
            lawExp: 100, lawId: 'star',
            attrs: { 神识: 7, 魅力: 6, 道心: 6 },
            demon: -25,
            relation: { 云霓仙子: 38 },
            title: '星海同舟',
            flag: { 云霓同归: true },
          },
        },
      },
      {
        label: '与她共饮星露，许诺待平定九州劫数再同游界海', hint: '以道相许 · 彼此精进',
        outcome: {
          text: '云霓仙子眸光盈盈，轻轻颔首：「一言为定。我会在听潮阁为你留一盏永不熄灭的星灯。」',
          effects: {
            items: ['xinghui_dan'],
            expPct: 0.3, lawExp: 85, lawId: 'star',
            attrs: { 道心: 7, 神识: 6 },
            relation: { 云霓仙子: 30 },
            flag: { 云霓同归: true },
          },
        },
      },
    ],
  },

  /* ───────────── 8. 玄机老人 · 天工奇门宗师（6 节点） ───────────── */
  {
    id: 'wkn_npc_xuanji_1', title: '玄机 · 算盘问材', pool: 'world', tier: 4, weight: 7, minRealm: 2, region: 'zhongzhou',
    once: true,
    text: '中州百工坊深巷里「噼啪」声不绝于耳。独臂老者玄机老人正蹲在门槛上单手拨弄一只乌黑玄铁算盘，脚边排着八具巴掌大小的铜雀战傀，个个眼冒金光盯着来往行人。\n\n他忽然抬头瞄准你的储物袋，怪笑一声：「嘿！小家伙身上带着好东西啊！老夫的移动机关城地枢断了一根轴承，肯不肯随我去城下古窑搭把手？报酬嘛，保准比那群只会挥剑的莽夫阔绰！」',
    choices: [
      {
        label: '欣然应诺，随玄机老人探访机关行城', hint: '开启玄机老人主线 · 奇门天工',
        cost: { month: 1 },
        outcome: {
          text: '玄机老人把算盘往腰间一插，打个响指唤来一头青铜机关鹤载着你直飞中州地缝深处。一座藏在地下十里的宏伟青铜行城赫然眼前！',
          effects: { relation: { 玄机老人: 18 }, attrs: { 悟性: 2 }, flag: { 入机关行城: true } },
          goto: 'wkn_npc_xuanji_2',
        },
      },
      {
        label: '先赠他一块玄铁或星辰砂作见面礼', hint: '需星辰砂 · 宗师大喜',
        require: 'has("xingchen_sha")', requireHint: '行囊中并无星辰砂',
        cost: { item: 'xingchen_sha', month: 1 },
        outcome: {
          text: '玄机老人捧着星辰砂差点老泪纵横：「正愁星枢缺引子！走走走，今日让你瞧瞧什么叫天下第一天工绝阵！」',
          effects: { relation: { 玄机老人: 28 }, attrs: { 悟性: 4, 气运: 2 }, flag: { 入机关行城: true, 赠砂修城: true } },
          goto: 'wkn_npc_xuanji_2',
        },
      },
      {
        label: '婉言谢绝：「晚辈不通奇门机关之术」', hint: '不入地城',
        outcome: {
          text: '玄机老人翻了个白眼，嘀咕着「没眼光的娃娃」，带着八具铜雀一溜烟钻进了暗巷。',
          effects: { relation: { 玄机老人: -4 } },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_xuanji_2', title: '玄机 · 地枢试傀', pool: 'branch', tier: 4, weight: 0,
    text: (s) => `机关行城最深处的青铜地枢轰鸣转动，齿轮大如山岳。不料修复核心的一瞬，镇守地枢的十丈机关巨神傀因旧阵紊乱骤然苏醒，双目赤红，举起玄铁巨锤朝阵眼砸来！\n\n${s.flags['赠砂修城'] ? '玄机老人急喊：「星辰砂刚融进阵眼，快替老夫拖住这铁疙瘩三十息，别让它砸碎核心！」' : '玄机老人急得直跳脚：「这笨铁罐子认死理！快帮我压制它，我把备用阵纹接上去！」'}`,
    choices: [
      {
        label: '迎击十丈机关巨神傀，硬撼玄铁重锤', hint: '战斗 · 机关巨神傀 · 护城试阵',
        combat: {
          enemy: 'iron_titan',
          win: {
            text: '你一剑挑断巨傀背心三道灵力导管，玄机老人趁隙啪嗒一声扣上青铜阵锁！巨傀轰然单膝跪地，整座机关行城恢复沉稳低鸣。',
            effects: { expPct: 0.28, lawExp: 45, lawId: 'array', attrs: { 根骨: 3, 悟性: 3 }, relation: { 玄机老人: 26 }, flag: { 稳机关地枢: true } },
            goto: 'wkn_npc_xuanji_3',
          },
          lose: {
            text: '铁锤余波震得你双臂发麻，玄机老人干脆甩出玄铁算盘卡死巨傀膝关节，拉着你滚进避险通道，险险完成切换。',
            effects: { hp: -58, injury: 1, lawExp: 25, lawId: 'array', relation: { 玄机老人: 20 }, flag: { 稳机关地枢: true } },
            goto: 'wkn_npc_xuanji_3',
          },
        },
      },
      {
        label: '循着齿轮节拍切入巨傀胸口阵图，逆转灵核', hint: '悟性与神识检定 · 巧破天工阵',
        roll: {
          p: 0.56, attrs: { 悟性: 0.015, 神识: 0.012 },
          success: {
            text: '你凌空连点巨傀胸口八卦死门，十丈巨傀顿时如木偶般僵立不动。玄机老人看得目瞪口呆：「天生阵痴啊你！」',
            effects: { expPct: 0.24, lawExp: 55, lawId: 'array', attrs: { 悟性: 5, 神识: 3 }, relation: { 玄机老人: 30 }, flag: { 稳机关地枢: true } },
            goto: 'wkn_npc_xuanji_3',
          },
          fail: {
            text: '阵图灵光反震将你弹开，好在已拖足时间让玄机老人重掌地枢。',
            effects: { hp: -35, lawExp: 25, lawId: 'array', relation: { 玄机老人: 18 }, flag: { 稳机关地枢: true } },
            goto: 'wkn_npc_xuanji_3',
          },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_xuanji_3', title: '玄机 · 千机八阵', pool: 'branch', tier: 5, weight: 0,
    text: '地枢大厅重燃柔和灵光，玄机老人擦着满手黑油，神情却少见地郑重起来。他打开一只七重锁扣的玄铁秘匣，取出一卷以银丝织成的奇门阵图。\n\n「老夫这条断臂，是三百年前替机关城挡一位上界追兵留下的。往后九州大乱，单靠一身蛮力终究双拳难敌四手。《千机八阵图录》归你了——学会借山川为棋，就算孤身一人，也能抵得过千军万马！」',
    choices: [
      {
        label: '恭敬接过银丝阵图，潜心参悟《千机八阵图录》', hint: '习得地阶《千机八阵图录》· 阵道法则大涨',
        cost: { month: 2 },
        outcome: {
          text: '银丝在灵力催动下于半空化出八座连环杀阵虚影。你细细推演两月，举手投足已隐隐暗合奇门生克之理。',
          effects: {
            techniques: [WORLD_TECH_BY_ID.wt_qianji_zhen],
            lawExp: 65, lawId: 'array',
            attrs: { 悟性: 5, 神识: 5 },
            relation: { 玄机老人: 28 },
            title: '千机传人',
            flag: { 获千机八阵: true },
          },
        },
      },
      {
        label: '请宗师顺手替自己祭炼护身宝甲，兼学阵眼心诀', hint: '获天阶灵宝八卦玄黄甲 · 阵道感悟大增',
        cost: { month: 1 },
        outcome: {
          text: '玄机老人哈哈大笑，开炉七日替你锻出一副流光内敛的八卦玄黄甲：「穿着它，元婴老怪拿斧头劈都劈不开！」',
          effects: {
            items: ['bagua_xuanjia'],
            lawExp: 60, lawId: 'array',
            attrs: { 悟性: 4, 根骨: 4 },
            relation: { 玄机老人: 26 },
            flag: { 获千机八阵: true },
          },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_xuanji_e1', title: '玄机 · 古肆捡漏', pool: 'world', tier: 3, weight: 6, minRealm: 2, region: 'zhongzhou',
    require: 'rel("玄机老人") >= 10',
    text: '中州鬼市摊位昏暗，玄机老人正拿根焦木棍戳着一块锈成铁疙瘩的破铜盘，冲路过的你挤眉弄眼：「小家伙，借我三百灵石把这破铜盘买下来！里头包着上古阵修的聚灵星核，事成之后对半分！」',
    choices: [
      {
        label: '二话不说掏出三百灵石替他买下破铜盘', hint: '需 300 灵石 · 信任宗师眼力',
        require: 'stones >= 300', requireHint: '灵石不足三百',
        cost: { stones: 300 },
        outcome: {
          text: '刚出鬼市，玄机老人拿算盘一敲，锈壳剥落露出耀眼灵光！里头竟真藏着两张上古聚灵阵符与一撮星辰砂，老头爽快分你一半。',
          effects: { items: ['juling_zhenfu', 'xingchen_sha'], lawExp: 30, lawId: 'array', relation: { 玄机老人: 20 } },
        },
      },
      {
        label: '先以神识探查真伪，再与摊主压价成交', hint: '神识检定 · 智辨真宝',
        roll: {
          p: 0.56, attrs: { 神识: 0.014, 悟性: 0.01 },
          success: {
            text: '你不但看出内藏灵核，还随口挑出铜盘三处暗裂把价压到一百灵石。玄机老人笑得拍腿：「比老夫还会做买卖！」',
            effects: { stones: -100, items: ['juling_zhenfu'], attrs: { 神识: 3, 气运: 2 }, relation: { 玄机老人: 18 } },
          },
          fail: {
            text: '摊主见你们仔细打量反倒抬高了价码，玄机老人只得自己掏钱买下，顺手送你两块玄铁作谢。',
            effects: { items: ['xuantie'], relation: { 玄机老人: 12 } },
          },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_xuanji_e2', title: '玄机 · 绝谷修傀', pool: 'wild', tier: 4, weight: 5, minRealm: 3,
    require: 'rel("玄机老人") >= 22',
    text: '荒谷雷雨交加，玄机老人正躲在一座破洞府里抢修一具焦黑的破界灵傀，洞外却有两头被灵核气息引来的化神级观星古守卫正隆隆逼近！',
    choices: [
      {
        label: '出洞迎战观星古守卫，为老人争得修复时间', hint: '战斗 · 观星古守卫 · 护友夺阵',
        combat: {
          enemy: 'star_golem',
          win: {
            text: '古守卫青铜躯体炸裂的瞬间，洞内灵傀也恰好睁开双目！玄机老人大笑着把从古守卫胸口拆出的法则残片丢给了你。',
            effects: { items: ['faze_canpian', 'xingchen_sha'], expPct: 0.28, lawExp: 45, lawId: 'array', relation: { 玄机老人: 24 } },
          },
          lose: {
            text: '青铜守卫防御惊人，玄机老人提前启动半成品灵傀自爆才逼退强敌，虽心疼材料却更看重你的仗义。',
            effects: { hp: -65, lawExp: 25, lawId: 'array', relation: { 玄机老人: 20 } },
          },
        },
      },
      {
        label: '留洞助他以灵力续接残缺阵纹，合启洞府护禁', hint: '悟性检定 · 阵法御敌',
        cost: { mp: 45 },
        roll: {
          p: 0.56, attrs: { 悟性: 0.015, 神识: 0.01 },
          success: {
            text: '洞口护禁嗡然升起，将两头古守卫困入迷雾幻阵。玄机老人抚须赞叹，把一卷伏羲八卦阵简塞入你行囊。',
            effects: { items: ['yujian_bagua'], lawExp: 40, lawId: 'array', attrs: { 悟性: 4 }, relation: { 玄机老人: 22 } },
          },
          fail: {
            text: '护禁只撑了半个时辰便崩裂，二人趁隙从后洞遁走，倒也保住了那具灵傀核心。',
            effects: { hp: -30, attrs: { 悟性: 2 }, relation: { 玄机老人: 14 } },
          },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_xuanji_e3', title: '玄机 · 炉火淬天工', pool: 'world', tier: 5, weight: 5, minRealm: 5,
    require: 'rel("玄机老人") >= 35',
    once: true,
    text: '机关行城最深处的地心火炉罕见地燃起九彩仙焰。玄机老人挽起独袖，神采飞扬宛如少年，指着火炉中缓缓成形的一口玄黄古钟与一枚须弥阵盘。\n\n「老夫这一生修阵炼器八百年，最得意的不在城郭傀儡，而在今日替你铸这件压箱底的护道重宝！来，滴一滴你的本命精血，让它认主！」',
    choices: [
      {
        label: '逼出一滴心头精血入炉，见证镇狱古钟成器', hint: '耗损少许气血 · 得天阶灵宝镇狱古钟与阵道大悟',
        cost: { hp: 50, month: 2 },
        outcome: {
          text: '精血落火，古钟长鸣震彻地下十里！玄机老人哈哈大笑，亲手将钟收入你掌心：「有此钟护身，渡劫时雷劈下来也能当挠痒！」',
          effects: {
            items: ['donghuang_zhong'],
            lawExp: 100, lawId: 'array',
            attrs: { 悟性: 7, 根骨: 5, 气运: 4 },
            relation: { 玄机老人: 38 },
            title: '天工挚友',
            flag: { 玄机铸钟: true },
          },
        },
      },
      {
        label: '请他把火候留给须弥阵盘，自己只要一枚乾坤须弥戒与阵道真解', hint: '得乾坤须弥戒 · 神识阵道双进',
        cost: { month: 2 },
        outcome: {
          text: '玄机老人眼中露出赞许：「贪重器不如求善用！」七日后须弥戒成，内蕴十里灵韵，更刻满了他毕生阵法心得。',
          effects: {
            items: ['qiankun_jie'],
            lawExp: 95, lawId: 'array',
            attrs: { 神识: 7, 悟性: 6 },
            relation: { 玄机老人: 35 },
            flag: { 玄机铸钟: true },
          },
        },
      },
    ],
  },

  /* ───────────── 9. 墨衡 · 黄泉摆渡人（6 节点） ───────────── */
  {
    id: 'wkn_npc_moheng_1', title: '墨衡 · 乌舟渡资', pool: 'world', tier: 4, weight: 7, minRealm: 3, region: 'beihuang',
    once: true,
    text: '北荒大漠尽头没有水，却在子时浮出一条幽绿无波的雾河。河面漂来一叶无帆乌木舟，船尾立着青面玄袍的摆渡人墨衡，手中竹篙轻点，便在虚空划开细密黑纹。\n\n他提灯照了照你的眉心，声音低沉沙哑：「生人登舟要给渡资，死人登舟要留执念。{name}，雾河对岸困着一缕三百年前不肯散去的故人残魂，你可敢上我的船，替我押一趟阴司旧债？」',
    choices: [
      {
        label: '跃上乌木孤舟：「生前死后皆是一道，有何不敢」', hint: '开启墨衡主线 · 夜渡黄泉雾河',
        cost: { month: 1 },
        outcome: {
          text: '墨衡青面之下发出一声低笑，竹篙一点，乌舟竟直接沉入空间裂隙，瞬息间四周已化作幽火飘荡的忘川古渡。',
          effects: { relation: { 墨衡: 18 }, attrs: { 道心: 3, 神识: 2 }, flag: { 登黄泉舟: true } },
          goto: 'wkn_npc_moheng_2',
        },
      },
      {
        label: '递上一块九幽冥晶充作渡资，先问清对岸凶险', hint: '需九幽冥晶 · 摆渡人另眼相看',
        require: 'has("jiuyou_mingjing")', requireHint: '行囊中并无九幽冥晶',
        cost: { item: 'jiuyou_mingjing', month: 1 },
        outcome: {
          text: '墨衡接过冥晶嵌入船首灯笼，灯火骤然转为幽蓝：「懂阴司规矩的活人不多。对岸有九幽勾魂使截道，跟紧灯影，莫回头看水面。」',
          effects: { relation: { 墨衡: 26 }, attrs: { 神识: 4 }, flag: { 登黄泉舟: true, 冥晶点灯: true } },
          goto: 'wkn_npc_moheng_2',
        },
      },
      {
        label: '立于岸边拱手：「阳世未了，不敢轻涉黄泉」', hint: '守住生人气机',
        outcome: {
          text: '墨衡微微颔首，竹篙一撑，乌舟悄无声息没入黑雾。河岸转瞬重归荒漠黄沙，仿佛方才只是一场寒梦。',
          effects: { attrs: { 道心: 2 }, relation: { 墨衡: 2 } },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_moheng_2', title: '墨衡 · 忘川截魂', pool: 'branch', tier: 4, weight: 0,
    text: (s) => `乌木舟刚靠上忘川彼岸，岸边黑碑后便响起刺耳锁链拖拽声——一名九幽勾魂使率领阴兵拦住渡口，锁魂铁链直指船头那盏微弱魂灯！\n\n${s.flags['冥晶点灯'] ? '船首幽蓝灯火撑起三丈净土，墨衡冷哼：「阴司这群恶吏专抢未及超度的孤魂炼丹！守住灯火，莫让锁链近舟！」' : '墨衡撑篙稳住狂摇的孤舟，青面微寒：「此魂欠人间一句告别，债未了便归我渡！道友，借你阳世杀伐一用！」'}`,
    choices: [
      {
        label: '踏出舟首，以真元硬撼九幽勾魂使', hint: '战斗 · 九幽勾魂使 · 护魂过河',
        combat: {
          enemy: 'soul_reaper',
          win: {
            text: '锁魂链寸寸崩断，勾魂使化作黑烟遁逃。那缕孤魂朝你与墨衡深深一揖，化作一点清光穿破界缝飘回人间故里。',
            effects: { expPct: 0.28, lawExp: 45, lawId: 'space', karma: 35, attrs: { 神识: 4 }, relation: { 墨衡: 26 }, flag: { 忘川护魂: true } },
            goto: 'wkn_npc_moheng_3',
          },
          lose: {
            text: '阴司锁链寒气直侵元神，墨衡挥篙撕开一道空间裂口把勾魂使卷入乱流，反手将一缕温和幽冥气渡入你眉心护脉。',
            effects: { hp: -60, injury: 1, lawExp: 25, lawId: 'space', relation: { 墨衡: 20 }, flag: { 忘川护魂: true } },
            goto: 'wkn_npc_moheng_3',
          },
        },
      },
      {
        label: '循墨衡竹篙留下的空间折痕，强行斩断渡口界链', hint: '神识与悟性检定 · 裂空脱身',
        roll: {
          p: 0.55, attrs: { 神识: 0.015, 悟性: 0.012 },
          success: {
            text: '你指尖划破虚空，竟借阴司雾气将勾魂使的锁链反向引入界缝！乌舟安然掠过渡口，墨衡眼中露出一丝罕见惊艳。',
            effects: { expPct: 0.25, lawExp: 55, lawId: 'space', attrs: { 神识: 5, 悟性: 3 }, relation: { 墨衡: 28 }, flag: { 忘川护魂: true } },
            goto: 'wkn_npc_moheng_3',
          },
          fail: {
            text: '界缝合拢慢了半息，你替乌舟硬扛一记阴煞余劲，好在孤魂终得解脱。',
            effects: { hp: -42, lawExp: 25, lawId: 'space', relation: { 墨衡: 18 }, flag: { 忘川护魂: true } },
            goto: 'wkn_npc_moheng_3',
          },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_moheng_3', title: '墨衡 · 幽冥渡印', pool: 'branch', tier: 5, weight: 0,
    text: '雾河重归北荒月下，乌木孤舟静静泊在沙丘旁。墨衡摘下腰间那枚漆黑温润的幽冥玉印，连同一卷以阴沉木刻写的秘诀抛给你。\n\n「世人怕鬼，却不知天地生死本是一张纸的两面。我替亡魂撑船千年，唯独欣赏不惧幽冥、不欺弱魂之辈。《黄泉摆渡幽冥印》交给你——往后若遇强敌压境，便以此印开一寸黄泉界缝，叫他们瞧瞧死生之间的份量。」',
    choices: [
      {
        label: '接印受法，于沙海月下参悟《黄泉摆渡幽冥印》', hint: '习得地阶《黄泉摆渡幽冥印》· 空间法则大涨',
        cost: { month: 2 },
        outcome: {
          text: '阴沉木简上的古篆化作流影汇入识海。你抬手一按，身前虚空竟悄无声息裂开半寸幽黑缝隙，寒意森然却收放自如。',
          effects: {
            techniques: [WORLD_TECH_BY_ID.wt_huangquan_yin],
            lawExp: 65, lawId: 'space',
            attrs: { 神识: 6, 道心: 4 },
            relation: { 墨衡: 28 },
            title: '黄泉故交',
            flag: { 获黄泉幽冥印: true },
          },
        },
      },
      {
        label: '只收下他赠予的冰心雪莲丹与一诺赊寿之契', hint: '涤荡心魔 · 增寿与空间感悟',
        outcome: {
          text: '墨衡轻笑一声，将冰心丹抛入你手心，又在虚空写下你的名讳：「好。记着，将来寿尽之时若还不甘心，来雾河喊我一声。」',
          effects: {
            items: ['bingxin_dan'],
            lifespan: 35,
            lawExp: 55, lawId: 'space',
            demon: -18,
            relation: { 墨衡: 26 },
            flag: { 获黄泉幽冥印: true },
          },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_moheng_e1', title: '墨衡 · 寒灯赊寿', pool: 'world', tier: 3, weight: 6, minRealm: 3, region: 'beihuang',
    require: 'rel("墨衡") >= 12',
    text: '霜降寒夜，你在荒野破庙避风，忽见供桌旁多出一盏幽绿油灯。墨衡正慢条斯理地修剪灯芯，淡声道：「庙外那棵老槐树下埋着百年前一位散修的怨骨，你替它立块碑，我便替你拨旺命灯三十年。」',
    choices: [
      {
        label: '冒寒冒夜掘出遗骨，以灵木立碑超度', hint: '耗时一月 · 延寿增业力',
        cost: { month: 1 },
        outcome: {
          text: '石碑立定之际，老槐无风落叶如雨。墨衡轻轻拨亮命灯，一股温润生机顺着灯火融入你眉心：「阳世多一桩善因，阴司少一笔烂账。」',
          effects: { lifespan: 30, karma: 30, demon: -10, attrs: { 道心: 3 }, relation: { 墨衡: 18 } },
        },
      },
      {
        label: '只以神识引渡怨骨残气入空间裂隙，不沾凡土因果', hint: '空间法则小悟 · 神识提升',
        outcome: {
          text: '你指尖裂开一缕微缝送走残魂，墨衡瞥你一眼轻笑：「倒越来越像我这摆渡人了。」',
          effects: { lawExp: 32, lawId: 'space', attrs: { 神识: 3 }, relation: { 墨衡: 14 } },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_moheng_e2', title: '墨衡 · 界缝镇狱', pool: 'wild', tier: 4, weight: 5, minRealm: 4,
    require: 'rel("墨衡") >= 22',
    text: '北荒裂谷突现百丈幽冥天裂，一名身披玄甲的黄泉镇狱帅竟率阴潮冲出界缝，欲强行把方圆百里活物尽数拖入九幽！墨衡孤舟横亘裂口，青面渗血却寸步不退。',
    choices: [
      {
        label: '跃至孤舟之侧，与墨衡合战黄泉镇狱帅', hint: '战斗 · 黄泉镇狱帅 · 封堵天裂',
        combat: {
          enemy: 'nether_marshal',
          win: {
            text: '幽冥战戟崩碎，镇狱帅被墨衡一篙逼回界缝深处！天裂合拢之际，墨衡收起满舟寒雾，将一枚阴司掉落的虚空晶抛给了你。',
            effects: { items: ['xukong_jing'], expPct: 0.3, lawExp: 55, lawId: 'space', karma: 45, relation: { 墨衡: 26 } },
          },
          lose: {
            text: '镇狱帅战戟如山压落，你与墨衡拼死将裂口缩至三尺，随后借缩地成寸符抽身，险险阻止了阴潮蔓延。',
            effects: { hp: -70, injury: 1, items: ['suodi_fu'], karma: 25, relation: { 墨衡: 20 } },
          },
        },
      },
      {
        label: '以浑厚灵力稳住界缝边缘，助墨衡施展封渡秘阵', hint: '消耗灵力 · 协同封缝',
        cost: { mp: 55, month: 1 },
        outcome: {
          text: '空间褶皱在二人合力下缓缓缝合，阴潮尽退。墨衡收篙拱手：「这份情，黄泉记着。」',
          effects: { lawExp: 45, lawId: 'space', karma: 35, attrs: { 神识: 4 }, relation: { 墨衡: 22 } },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_moheng_e3', title: '墨衡 · 乌篷话生死', pool: 'world', tier: 5, weight: 5, minRealm: 5,
    require: 'rel("墨衡") >= 35',
    once: true,
    text: '万籁俱寂的寒江之夜，墨衡破例收起了幽冥灯笼，只燃起一炉人间松炭在乌篷船头煮茶。他难得摘下了半张青铜鬼面，露出底下眉目清癯、却满是沧桑的脸。\n\n「三千年前我也曾冲击大乘，败在心魔劫下，肉身尽毁才堕作黄泉摆渡人。{name}，你身上有我当年缺的那股透亮。这卷从界海捞起的《太虚挪移经》，留在孤舟上只会发霉，带去九霄罢。」',
    choices: [
      {
        label: '接过残经，举茶敬这位孤守黄泉三千载的故人', hint: '获天阶秘典《太虚挪移经》· 空间法则大涨',
        cost: { month: 1 },
        outcome: {
          text: '清茶入喉，寒江起雾。墨衡重新戴上鬼面，轻轻一撑竹篙，孤舟顺流远去，唯余一句话在江风里回荡：「若见真仙界，替我看看那里的月亮圆不圆。」',
          effects: {
            items: ['yujian_xukong'],
            lawExp: 100, lawId: 'space',
            attrs: { 神识: 8, 道心: 7 },
            demon: -25,
            relation: { 墨衡: 38 },
            title: '生死渡友',
            flag: { 墨衡托梦: true },
          },
        },
      },
      {
        label: '许诺飞升前必寻太古灵药助他重塑阳身', hint: '重情守诺 · 业力道心暴涨',
        outcome: {
          text: '墨衡愣了很久，青面之后传来低沉而久违的笑声：「重塑阳身……三千年了，头一回有人敢对我说这四个字。」他将一枚化婴丹与空间灵宝残晶赠予你。',
          effects: {
            items: ['xukong_jing', 'huaying_dan'],
            lawExp: 90, lawId: 'space',
            karma: 65, attrs: { 道心: 9, 气运: 5 },
            relation: { 墨衡: 42 },
            flag: { 墨衡重塑之约: true },
          },
        },
      },
    ],
  },

  /* ───────────── 10. 白幽 · 青丘月华妖尊（6 节点） ───────────── */
  {
    id: 'wkn_npc_baiyou_1', title: '白幽 · 月泉试目', pool: 'world', tier: 4, weight: 7, minRealm: 2, region: 'yaosen',
    once: true,
    text: '苍茫妖森深处升起如纱月雾，雾中隐约传来银铃轻笑。你踏入一处开满白莲的月泉古洞，泉畔石榻上斜倚着一位雪衣白尾的绝美狐尊——青丘白幽。\n\n洞中幻景瞬息万变，时而化作万两黄金，时而化作绝世仙侣。白幽托腮含笑望着纹丝不动的你：「哎呀，人族修士进我月泉洞，十个里有九个先迷了眼。{name}，你倒是眼神干净。敢不敢跟我做笔买卖，替青丘去古祠取回一件被封印的旧物？」',
    choices: [
      {
        label: '直视她含笑双眸：「说清旧物来历，若不伤无辜便帮你走一趟」', hint: '开启白幽主线 · 深入青丘古祠',
        cost: { month: 1 },
        outcome: {
          text: '白幽轻掩唇角一笑，九尾虚影在月光下一闪而逝：「放心，不是害人的魔物，而是我青丘一脉残存的祖灵月魄。随我来罢，小道友。」',
          effects: { relation: { 白幽: 18 }, attrs: { 道心: 2, 魅力: 2 }, flag: { 赴青丘古祠: true } },
          goto: 'wkn_npc_baiyou_2',
        },
      },
      {
        label: '赠她一瓶冰肌驻颜丹或千年灵草换取古洞详情', hint: '需千年灵草 · 妖尊欣喜',
        require: 'has("qiannian_lingcao")', requireHint: '行囊中并无千年灵草',
        cost: { item: 'qiannian_lingcao', month: 1 },
        outcome: {
          text: '白幽指尖轻嗅灵草清香，眼波流转：「真懂女儿家心思。走，今日便破例领人族修士踏入青丘禁地。」',
          effects: { relation: { 白幽: 26 }, attrs: { 魅力: 3, 气运: 2 }, flag: { 赴青丘古祠: true, 灵草结狐缘: true } },
          goto: 'wkn_npc_baiyou_2',
        },
      },
      {
        label: '谨守人妖之别，拱手退出月泉幻雾', hint: '谨慎自守',
        outcome: {
          text: '洞后传来一声幽幽叹息，月雾自动分开一条小径送你出林，并未加害。',
          effects: { attrs: { 道心: 3 }, relation: { 白幽: -2 } },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_baiyou_2', title: '白幽 · 古祠血契', pool: 'branch', tier: 4, weight: 0,
    text: (s) => `青丘古祠隐藏在万年古藤之后，祠堂供台上悬浮着一轮银白月魄。然祠外忽然杀出数名手持猎妖网的贪婪修士，领头一名元婴妖叛更勾结外敌，意图趁白幽解封虚弱之际夺魄炼丹！\n\n${s.flags['灵草结狐缘'] ? '白幽将一片护身月华花瓣贴在你眉心：「小道友，护我半炷香，外头那群贪心鬼便交给你打发了！」' : '白幽双尾燃起银炎稳住月魄，回首对你浅笑：「现在逃还来得及，若肯留下挡住那头叛妖，青丘欠你一桩大因果。」'}`,
    choices: [
      {
        label: '横剑立于古祠门前，正面迎战叛逃妖将', hint: '战斗 · 妖将 · 护青丘月魄',
        combat: {
          enemy: 'demon_general',
          win: {
            text: '剑光撕裂猎妖网，叛妖惨嚎伏诛，余众见势不妙仓皇逃入密林。月魄缓缓归入白幽眉心，古祠漫天飘落清凉月雪。',
            effects: { expPct: 0.28, lawExp: 45, lawId: 'karma', karma: 30, relation: { 白幽: 28 }, flag: { 护青丘月魄: true } },
            goto: 'wkn_npc_baiyou_3',
          },
          lose: {
            text: '敌势凶猛，你苦撑至最后一刻口吐鲜血。恰在此时月魄解封，白幽一念化出千里月华幻界，瞬间震晕群敌救下你。',
            effects: { hp: -55, injury: 1, lawExp: 25, lawId: 'karma', relation: { 白幽: 24 }, flag: { 护青丘月魄: true } },
            goto: 'wkn_npc_baiyou_3',
          },
        },
      },
      {
        label: '借古祠迷幻月雾布下反客为主的镜花幻阵', hint: '神识与魅力检定 · 智惑群敌',
        roll: {
          p: 0.56, attrs: { 神识: 0.014, 魅力: 0.012 },
          success: {
            text: '你引动石灯月华，令来犯之敌陷入自相残杀的幻境！待白幽收回月魄，敌阵已然溃不成军。狐尊掩口轻笑，对你赞不绝口。',
            effects: { expPct: 0.24, lawExp: 50, lawId: 'karma', attrs: { 神识: 4, 魅力: 4 }, relation: { 白幽: 30 }, flag: { 护青丘月魄: true } },
            goto: 'wkn_npc_baiyou_3',
          },
          fail: {
            text: '幻阵被叛妖一声狂啸震破，你硬扛一记妖风才撑到白幽解封出手。',
            effects: { hp: -38, attrs: { 神识: 2 }, relation: { 白幽: 18 }, flag: { 护青丘月魄: true } },
            goto: 'wkn_npc_baiyou_3',
          },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_baiyou_3', title: '白幽 · 月华幻典', pool: 'branch', tier: 5, weight: 0,
    text: '月泉古洞重归静谧。白幽亲手为你斟满一杯银辉流转的月华酒，又从袖中取出一卷用雪狐灵丝织就的古老秘典。\n\n「人族总说非我族类其心必异，可今日站在祠门外不肯后退的，却是个连我都看不透的人族修士。这卷《青丘月华幻典》记着我族窥心织梦之法——收好了，往后纵遇强敌，亦能借梦破心。」',
    choices: [
      {
        label: '饮下月华酒，潜心研读《青丘月华幻典》', hint: '习得玄阶《青丘月华幻典》· 因果与魅力大涨',
        cost: { month: 2 },
        outcome: {
          text: '酒香清冽，月华丝帛化作漫天银字印入识海。你闭目片刻，周身气韵陡然多出一分空灵出尘之态，心魔阴霾一扫而空。',
          effects: {
            techniques: [WORLD_TECH_BY_ID.wt_qingqiu_huan],
            lawExp: 55, lawId: 'karma',
            attrs: { 魅力: 6, 神识: 5, 气运: 4 },
            demon: -15,
            relation: { 白幽: 28 },
            title: '青丘月客',
            flag: { 获青丘幻典: true },
          },
        },
      },
      {
        label: '请她赠一瓶驻颜宝丹与妖森古修秘库地图', hint: '获驻颜丹与灵石珍宝 · 增寿提气运',
        outcome: {
          text: '白幽咯咯一笑，取出冰肌驻颜丹与两枚妖兽内丹放入你怀：「真是实诚人！往后来妖森，月泉洞的门随时为你开着。」',
          effects: {
            items: ['zhuyan_dan', 'yaoshou_neidan'],
            lifespan: 25,
            lawExp: 45, lawId: 'karma',
            attrs: { 魅力: 5, 气运: 5 },
            relation: { 白幽: 26 },
            flag: { 获青丘幻典: true },
          },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_baiyou_e1', title: '白幽 · 月酒换古图', pool: 'world', tier: 3, weight: 6, minRealm: 2, region: 'yaosen',
    require: 'rel("白幽") >= 10',
    text: '满月悬于古松梢头，白幽提着一坛白玉酒壶坐在树桠上晃着脚尖，见你走近便轻笑着抛下一枝带露白梅：「小道友，拿几株灵药换我一壶百年月华酒，顺带附赠一座前朝修士遗府的暗门机关图，划算得很哦。」',
    choices: [
      {
        label: '以灵石或百年灵草换取月华酒与秘图', hint: '需百年灵草 · 延寿得宝',
        require: 'has("lingcao")', requireHint: '行囊中并无百年灵草',
        cost: { item: 'lingcao' },
        outcome: {
          text: '饮下月华酒顿觉神清气爽，循着她画的暗门草图，你果真在林深处掘出一只尘封药匣！',
          effects: { items: ['dahuan_dan'], lifespan: 15, attrs: { 气运: 3, 魅力: 2 }, relation: { 白幽: 16 } },
        },
      },
      {
        label: '不换秘图，只跃上松枝陪她对月闲谈半夜', hint: '纯粹相交 · 妖尊欢喜',
        cost: { month: 1 },
        outcome: {
          text: '白幽眉眼弯弯，竟破例白白分你半壶月华酒，说起许多太古妖族与人族并肩抗劫的旧闻。',
          effects: { demon: -10, lawExp: 25, lawId: 'karma', attrs: { 悟性: 3, 魅力: 2 }, relation: { 白幽: 18 } },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_baiyou_e2', title: '白幽 · 林间驱猎修', pool: 'wild', tier: 4, weight: 5, minRealm: 3, region: 'yaosen',
    require: 'rel("白幽") >= 20',
    text: '妖森外谷火光冲天，一伙残忍的血魔宗猎妖修正在焚林逼出几只尚未化形的白狐幼崽。远处月影疾掠，白幽正赶来救援，却被一头血煞恶徒祭出的镇妖幡暂时缠住。',
    choices: [
      {
        label: '凌空斩断镇妖幡，与白幽共诛猎妖血徒', hint: '战斗 · 血海长老 · 护佑灵狐',
        combat: {
          enemy: 'blood_elder',
          win: {
            text: '黑幡化作飞灰，烈火被月华清露瞬间扑灭。几只受惊小白狐蹭着你裤脚呜咽致谢，白幽眸光柔和得像一汪秋水，亲手赠你一枚珍藏的麒麟玉角。',
            effects: { items: ['qilin_jiao'], karma: 50, reputation: 45, relation: { 白幽: 26 } },
          },
          lose: {
            text: '血徒拚死反扑伤了你臂膀，好在白幽脱困后一念成幻将其重创驱离，满怀歉意地替你敷上青丘秘药。',
            effects: { hp: -55, karma: 35, items: ['bixue_dan'], relation: { 白幽: 22 } },
          },
        },
      },
      {
        label: '先以神行身法救出林中所有幼狐撤往安全处', hint: '救弱为先 · 业力大增',
        cost: { mp: 35 },
        outcome: {
          text: '幼狐安然无恙，白幽随后也击退了恶徒。她摸着怀里小狐轻声道：「人族里若多几个像你这样的，这片山林也不至于常年见血。」',
          effects: { karma: 40, attrs: { 道心: 4, 魅力: 3 }, relation: { 白幽: 22 } },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_baiyou_e3', title: '白幽 · 九尾映明月', pool: 'world', tier: 5, weight: 5, minRealm: 4,
    require: 'rel("白幽") >= 35',
    once: true,
    text: '妖森千年不遇的银月潮汐之夜，月泉古洞白莲尽数绽放。白幽褪去往日戏谑慵懒，身后九道雪白狐尾在月辉中舒展如云，绝世芳华令天地失色。\n\n「{name}，九尾化仙最难过的不是雷劫，是红尘情劫。我守了青丘五百年，唯独见了你，才觉人妖殊途四个字其实并没那么冰冷。今晚我以青丘妖尊之名，赠你一缕本命月华——愿它护你九霄之上，莫忘月泉灯火。」',
    choices: [
      {
        label: '躬身接下本命月华，与她结下人妖两族生死盟约', hint: '获朱雀真羽与太古因果大悟 · 气运魅力暴涨',
        cost: { month: 2 },
        outcome: {
          text: '银辉融进你识海，所有幻术心魔从此再难惑你分毫。白幽笑靥如花，将压箱底的朱雀真羽与悟道果放入你手心，轻声道：「去更高处罢，我会在苍茫妖森看着你的星芒。」',
          effects: {
            items: ['fenghuang_yu', 'dao_fruit'],
            lawExp: 95, lawId: 'karma',
            attrs: { 魅力: 8, 气运: 7, 神识: 5 },
            demon: -25,
            relation: { 白幽: 38 },
            title: '青丘盟主',
            flag: { 白幽月华盟: true },
          },
        },
      },
      {
        label: '以自身一缕澄澈道意回赠，祝她早日渡过九尾妖劫', hint: '以诚相报 · 彼此增益',
        outcome: {
          text: '白幽指尖轻触那缕温和道意，眼底漾起盈盈星光：「小道友，这可是你欠我的，等你成了仙，记得回妖森讨酒喝。」',
          effects: {
            items: ['dao_fruit'],
            expPct: 0.3, lawExp: 85, lawId: 'karma',
            attrs: { 道心: 7, 魅力: 6, 气运: 5 },
            relation: { 白幽: 35 },
            flag: { 白幽月华盟: true },
          },
        },
      },
    ],
  },

  /* ───────────── 11. 青莲剑仙 · 昆仑遗世剑尊（6 节点） ───────────── */
  {
    id: 'wkn_npc_qinglian_1', title: '青莲 · 残殿浮白', pool: 'world', tier: 5, weight: 7, minRealm: 5, region: 'kunlun',
    once: true,
    text: '昆仑墟界云海苍茫，一座塌了半边飞檐的玉虚残殿前，青衫中年正斜倚断柱，仰头灌下一口翠玉葫芦里的烈酒。每一滴溅落的酒珠都在虚空中化作一朵三寸青莲，剑意锋寒得令周围万丈罡风自行绕道。\n\n他连眼皮都未抬，懒洋洋冲走近的你招手：「三千年没见着顺眼的小剑修了。{name}，坐下来陪老夫喝三碗酒——喝得下，我带你去断仙崖看一道三万年前留下的旧剑痕。」',
    choices: [
      {
        label: '席地而坐，连饮三碗蕴含剑意的太古烈酒', hint: '根骨与道心承压 · 开启青莲剑仙主线',
        cost: { hp: 50, month: 1 },
        outcome: {
          text: '酒液入喉宛如万柄微剑刮骨，你硬挺脊梁不吭一声，反借酒中剑意涤净丹田！青莲剑仙双目骤亮，拍腿大笑：「好骨头！走，上断仙崖！」',
          effects: { relation: { 青莲剑仙: 22 }, lawExp: 45, lawId: 'sword', attrs: { 根骨: 4, 道心: 4 }, flag: { 饮青莲酒: true } },
          goto: 'wkn_npc_qinglian_2',
        },
      },
      {
        label: '献上一枝昆仑建木枝或悟道果为前辈佐酒', hint: '需昆仑建木枝 · 剑尊大悦',
        require: 'has("kunlun_shenmu")', requireHint: '行囊中并无昆仑建木枝',
        cost: { item: 'kunlun_shenmu', month: 1 },
        outcome: {
          text: '青莲剑仙嗅着建木清香，把嫩枝浸入翠玉葫芦晃了晃，朗声大笑：「好茶不如好酒，好酒不如知己！走，今日老夫兴致大发，教你看看什么叫真正的剑！」',
          effects: { relation: { 青莲剑仙: 30 }, lawExp: 55, lawId: 'sword', attrs: { 悟性: 5, 气运: 3 }, flag: { 饮青莲酒: true, 建木佐酒: true } },
          goto: 'wkn_npc_qinglian_2',
        },
      },
      {
        label: '躬身行礼辞退：「前辈酒中剑威太盛，晚辈尚难消受」', hint: '敬畏远之',
        outcome: {
          text: '青莲剑仙摆摆手继续独酌，叹道：「谨小慎微能活得久，却斩不开南天门呐。」',
          effects: { attrs: { 道心: 2 }, relation: { 青莲剑仙: -3 } },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_qinglian_2', title: '青莲 · 断仙试锋', pool: 'branch', tier: 5, weight: 0,
    text: (s) => `昆仑断仙崖深不见底，崖壁上一道贯穿千里的剑痕至今仍在吞吐青光。青莲剑仙负手立于崖边，随手折下一截枯松枝指向云海。\n\n${s.flags['建木佐酒'] ? '「这截松枝只含我三成剑意，借崖壁太古剑痕化影。接住它，老夫便把压箱底的剑歌吟给你听！」' : '「当年上界仙将持诏来收割昆仑灵脉，就是被我一剑斩退于此。今日我借剑痕映出一缕残影——让我看看你配不配推开那扇门！」'}枯枝轻点，一尊气象森严的陨落剑圣残影踏云成型！`,
    choices: [
      {
        label: '拔剑冲霄，正面硬撼崖壁映出的剑圣残影', hint: '战斗 · 陨落剑圣影 · 问鼎剑道',
        combat: {
          enemy: 'blade_saint_shade',
          win: {
            text: '漫天剑莲在云海中层层炸裂，你一剑洞穿残影眉心！青莲剑仙手中枯枝应声化粉，他仰天长笑，震散昆仑百里积云：「后生可畏，后生可畏！」',
            effects: { expPct: 0.35, lawExp: 80, lawId: 'sword', attrs: { 根骨: 5, 悟性: 5 }, reputation: 90, relation: { 青莲剑仙: 28 }, flag: { 破断仙剑影: true } },
            goto: 'wkn_npc_qinglian_3',
          },
          lose: {
            text: '剑圣残影一式返璞归真震飞你的兵器，你单膝点地却双目不屈。青莲剑仙挥袖散去剑影，抚须赞道：「败于剑下却不折剑心，够格了！」',
            effects: { hp: -90, injury: 1, lawExp: 50, lawId: 'sword', attrs: { 道心: 5 }, relation: { 青莲剑仙: 22 }, flag: { 破断仙剑影: true } },
            goto: 'wkn_npc_qinglian_3',
          },
        },
      },
      {
        label: '闭目弃招，以纯粹神识共鸣崖壁三万年旧剑痕', hint: '悟性与道心检定 · 以心合剑',
        roll: {
          p: 0.54, attrs: { 悟性: 0.014, 道心: 0.014 },
          success: {
            text: '你竟未动兵刃，只立于崖风中与残影以意相交。刹那间一朵虚幻青莲在你眉心悄然盛开，残影冲你微微颔首自行消散！',
            effects: { expPct: 0.3, lawExp: 90, lawId: 'sword', attrs: { 悟性: 7, 道心: 6 }, relation: { 青莲剑仙: 32 }, flag: { 破断仙剑影: true } },
            goto: 'wkn_npc_qinglian_3',
          },
          fail: {
            text: '太古剑意冲击识海令你耳鼻溢血，青莲剑仙以葫芦轻敲你肩头唤回心神，笑道：「悟性不差，再磨百年必成大器。」',
            effects: { hp: -65, lawExp: 45, lawId: 'sword', relation: { 青莲剑仙: 20 }, flag: { 破断仙剑影: true } },
            goto: 'wkn_npc_qinglian_3',
          },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_qinglian_3', title: '青莲 · 剑歌绽空', pool: 'branch', tier: 6, weight: 0,
    text: '断仙崖暮色如金。青莲剑仙拍开酒葫芦，以剑气蘸着云霞，在万丈青天上龙飞凤舞写下一首气象磅礴的剑歌，字字落地皆化莲瓣旋转不休。\n\n「三万年前我斩退仙将，自己却也道基受创，困守昆仑再难飞升。《太古青莲剑歌》留在我这具残躯里终会蒙尘——{name}，带它去斩开那座虚伪的天门罢！」',
    choices: [
      {
        label: '仰观天字剑歌，全心铭记《太古青莲剑歌》', hint: '习得天阶绝学《太古青莲剑歌》· 剑道法则暴涨',
        cost: { month: 2 },
        outcome: {
          text: '天幕青字尽数化作流光没入你眉心。那一瞬你仿佛听见三万年前昆仑绝巅的剑鸣，剑道境界豁然迈入全新天地！',
          effects: {
            techniques: [WORLD_TECH_BY_ID.wt_qinglian_jian],
            lawExp: 110, lawId: 'sword',
            attrs: { 悟性: 7, 根骨: 6, 道心: 6 },
            relation: { 青莲剑仙: 32 },
            title: '青莲传人',
            flag: { 获青莲剑歌: true },
          },
        },
      },
      {
        label: '向剑仙讨教半式斩仙残意，另求他赐下诛仙残剑镇道', hint: '获仙器诛仙残剑 · 杀伐无双',
        cost: { month: 1 },
        outcome: {
          text: '青莲剑仙眼中寒光一闪，竟从断崖石缝里拔出一截缠绕太古煞气的断仙神剑抛给你：「拿着！它跟了我三万年，该换个敢挥剑的年轻人带它见血了。」',
          effects: {
            items: ['zhuxian_canjian'],
            lawExp: 95, lawId: 'sword',
            attrs: { 根骨: 7, 道心: 6 },
            relation: { 青莲剑仙: 30 },
            flag: { 获青莲剑歌: true },
          },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_qinglian_e1', title: '青莲 · 葫芦旧梦', pool: 'world', tier: 5, weight: 5, minRealm: 5, region: 'kunlun',
    require: 'rel("青莲剑仙") >= 14',
    text: '昆仑雪夜，青莲剑仙醉倒在玉虚殿石阶上，翠玉葫芦滚落一旁，溢出的酒雾竟在空中幻化出三万年前昆仑繁盛如仙境的幻影。他喃喃唤着几个早已无人记得的名字。',
    choices: [
      {
        label: '替他拾起葫芦披上外袍，静坐殿阶守到天明', hint: '敬重前贤 · 道心深沉',
        cost: { month: 1 },
        outcome: {
          text: '黎明雪停时，剑仙醒来瞥见肩头衣袍，沉默良久，屈指弹出一滴葫芦底沉淀万年的岁月朝露落入你掌心。',
          effects: { items: ['guangyin_lu'], demon: -16, attrs: { 道心: 5 }, relation: { 青莲剑仙: 20 } },
        },
      },
      {
        label: '借酒雾幻影细细观摩三万年前古仙论剑招式', hint: '悟性检定 · 窃悟太古剑意',
        roll: {
          p: 0.56, attrs: { 悟性: 0.014, 神识: 0.012 },
          success: {
            text: '酒雾中一招一式皆合天地至理，你看到忘神之际，剑仙醒来反倒顺手替你补全了最后三式收剑轨迹！',
            effects: { expPct: 0.24, lawExp: 65, lawId: 'sword', attrs: { 悟性: 5 }, relation: { 青莲剑仙: 16 } },
          },
          fail: {
            text: '酒雾转瞬消散，虽仅记下半式残招，亦觉受益匪浅。',
            effects: { lawExp: 35, lawId: 'sword', attrs: { 悟性: 2 }, relation: { 青莲剑仙: 10 } },
          },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_qinglian_e2', title: '青莲 · 剑斩天碑', pool: 'wild', tier: 6, weight: 5, minRealm: 6, region: 'kunlun',
    require: 'rel("青莲剑仙") >= 24',
    text: '昆仑绝巅降下一块散发傲慢仙威的上界镇界碑，碑文喝令下界大能上交灵脉。青莲剑仙提着葫芦大步走来，笑得肆意张狂：「上界那群老爷又来贴封条了？{name}，随老夫一块把这破石头劈了当柴烧！」',
    choices: [
      {
        label: '与青莲剑仙合剑劈碑，迎战碑中显化的镇灵神将', hint: '战斗 · 昆仑古玉神将 · 逆天斩碑',
        combat: {
          enemy: 'kunlun_guardian',
          win: {
            text: '双剑青光贯穿苍穹，镇界碑轰然炸作漫天玉屑！碑心滚出一枚昆仑照界镜与法则残片，青莲剑仙大笑全数推给你：「战利品归年轻人！」',
            effects: { items: ['kunlun_jing', 'faze_canpian'], expPct: 0.35, lawExp: 85, lawId: 'sword', reputation: 140, relation: { 青莲剑仙: 28 } },
          },
          lose: {
            text: '古玉神将重戟震天，青莲剑仙踏前一步以半口本源剑气将其连同镇界碑一同斩灭，自身却咳出淡金仙血。',
            effects: { hp: -95, lawExp: 55, lawId: 'sword', reputation: 70, relation: { 青莲剑仙: 22 } },
          },
        },
      },
      {
        label: '以剑意抹去镇界碑上天律铭文，不惊动上界本尊', hint: '神识与悟性检定 · 巧毁仙碑',
        roll: {
          p: 0.55, attrs: { 神识: 0.015, 悟性: 0.015 },
          success: {
            text: '你剑尖如游龙削去铭文阵眼，镇界碑无声化作一捧灵粉。青莲剑仙竖起拇指：「比老夫当年沉稳多了！」',
            effects: { items: ['faze_canpian'], lawExp: 70, lawId: 'sword', attrs: { 神识: 5, 悟性: 5 }, relation: { 青莲剑仙: 24 } },
          },
          fail: {
            text: '铭文反震震伤经脉，最终仍靠青莲剑仙一剑拍碎残碑。',
            effects: { hp: -55, lawExp: 40, lawId: 'sword', relation: { 青莲剑仙: 16 } },
          },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_qinglian_e3', title: '青莲 · 煮酒话飞升', pool: 'world', tier: 6, weight: 5, minRealm: 7,
    require: 'rel("青莲剑仙") >= 35',
    once: true,
    text: '大乘风雪漫天之日，青莲剑仙最后一次邀你于昆仑绝顶对饮。他的青衫比昔年淡薄许多，仿佛随时要化作一缕青烟散入天地。\n\n「老夫三万年残躯将尽，能在坐化前见到九州又出一位足以比肩太古的大剑修，此生足矣。{name}，若有一日你持剑立于九霄天门之前，莫回头，一剑斩开它！」言罢，他将毕生所藏的太初问道残韵尽数托付于你。',
    choices: [
      {
        label: '郑重三拜受剑意，立誓携青莲之名斩破南天门', hint: '承剑仙衣钵 · 剑道与修为大跃迁',
        cost: { month: 2 },
        outcome: {
          text: '漫天雪花化作万千青莲盛开又凋零。青莲剑仙含笑挥手，身形渐化清风，唯有一枚刻着「问道」二字的仙剑玉髓与大乘紫气丹静静悬浮在你掌心。',
          effects: {
            items: ['dacheng_dan', 'dao_fruit'],
            expPct: 0.42, lawExp: 140, lawId: 'sword',
            attrs: { 根骨: 8, 悟性: 8, 道心: 8 },
            demon: -30,
            relation: { 青莲剑仙: 40 },
            title: '青莲问道',
            flag: { 青莲托剑: true },
          },
        },
      },
      {
        label: '将自己参悟的一缕长生生机反渡于他，愿他再活千载观你飞升', hint: '以寿续前贤 · 需余寿超六十载 · 业力道心登极',
        require: 'lifespan - age > 60', requireHint: '余寿不足，难以渡寿',
        cost: { mp: 80, month: 2 },
        outcome: {
          text: '青莲剑仙大惊失色却挣脱不开你的灵力，半晌眼眶微热，破涕大笑：「你这疯徒儿！好，老夫便再多活五百年，亲眼看你一脚踹开九霄天门！」',
          effects: {
            lifespan: -50,
            items: ['changsheng_guo'],
            lawExp: 130, lawId: 'sword',
            karma: 100, attrs: { 道心: 10, 气运: 8 },
            relation: { 青莲剑仙: 50 },
            title: '续莲剑主',
            flag: { 续青莲寿: true },
          },
        },
      },
    ],
  },

  /* ───────────── 12. 司命星君 · 九霄观星谪仙（6 节点） ───────────── */
  {
    id: 'wkn_npc_siming_1', title: '司命 · 紫微命簿', pool: 'world', tier: 6, weight: 7, minRealm: 6, region: 'jiuxiao',
    once: true,
    text: '九霄星台悬浮于无尽雷云之上，四野星河倒卷如瀑。身披周天星斗玄袍的谪仙司命星君负手立于浑天古仪之前，指尖正悬着一册泛着紫金仙光的残破命簿。\n\n他回眸望向踏雷而来的你，眸中似有亿万星辰生灭：「{name}，你原不在上界准许飞升的名录之中。三百年前我私改了一笔，才让你一路走到这里。如今九霄天威已察觉异数，你可敢随我踏入星海试劫坛，亲手替自己把这行名字刻稳？」',
    choices: [
      {
        label: '「多谢星君昔年留线，今日我亲自去刻自己的名字！」', hint: '开启司命星君主线 · 踏入九霄星海',
        cost: { month: 1 },
        outcome: {
          text: '司命星君袖袍一拂，三百六十五颗古星虚影瞬间铺成星桥，直通雷云最深处的太古试劫坛！',
          effects: { relation: { 司命星君: 20 }, lawExp: 50, lawId: 'star', attrs: { 道心: 4, 神识: 4 }, flag: { 赴九霄星坛: true } },
          goto: 'wkn_npc_siming_2',
        },
      },
      {
        label: '奉上一枚九霄紫雷核或周天星辉丹助星君稳固星台', hint: '需周天星辉丹 · 谪仙赞许',
        require: 'has("xinghui_dan")', requireHint: '行囊中并无周天星辉丹',
        cost: { item: 'xinghui_dan', month: 1 },
        outcome: {
          text: '星辉丹化作银河光带绕浑天仪旋转一周，星台威压顿减三分。司命星君颔首微笑：「既知借星势，此番试劫胜算大增。」',
          effects: { relation: { 司命星君: 28 }, lawExp: 65, lawId: 'star', attrs: { 悟性: 5, 气运: 4 }, flag: { 赴九霄星坛: true, 星丹固台: true } },
          goto: 'wkn_npc_siming_2',
        },
      },
      {
        label: '暂退星台之外：「雷威尚烈，容晚辈再固道基」', hint: '暂缓试劫',
        outcome: {
          text: '司命星君合上命簿轻叹：「紫微星移不等人，莫让天门先关了。」',
          effects: { attrs: { 道心: 2 }, relation: { 司命星君: -2 } },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_siming_2', title: '司命 · 破雷试劫', pool: 'branch', tier: 6, weight: 0,
    text: (s) => `太古试劫坛悬于无尽星海中央，坛心紫雷交织如龙，一尊代天行罚的紫霄天劫法身缓缓睁开冰冷雷目，手中雷戟直指你眉心！\n\n${s.flags['星丹固台'] ? '司命星君以周天星光替你削去法身两成雷威：「只管放手一搏！若连这具法身都斩不破，南天门外便寸步难行！」' : '司命星君立于星阵之外高声长吟：「星辰为甲，道心为刃！向天证明，你的命不由命簿定，而由你自己定！」'}`,
    choices: [
      {
        label: '逆雷而上，以己身大道死战紫霄天劫法身', hint: '巅峰之战 · 紫霄天劫法身 · 逆命刻名',
        combat: {
          enemy: 'thunder_tribulation_avatar',
          win: {
            text: '雷戟崩断，紫霄法身在星河风暴中轰然瓦解！苍穹之上你的命星骤然大放光明，竟震得整座九霄星台齐齐共鸣！',
            effects: { expPct: 0.4, lawExp: 100, lawId: 'star', reputation: 160, attrs: { 根骨: 6, 道心: 7 }, relation: { 司命星君: 30 }, flag: { 斩破试劫法身: true } },
            goto: 'wkn_npc_siming_3',
          },
          lose: {
            text: '紫霄劫雷几乎劈碎你的护体道光，司命星君毅然踏入雷海，以谪仙残躯硬接最后一戟护你退回星台：「虽败犹荣，你的命星并未熄灭！」',
            effects: { hp: -120, injury: 2, lawExp: 65, lawId: 'star', attrs: { 道心: 6 }, relation: { 司命星君: 24 }, flag: { 斩破试劫法身: true } },
            goto: 'wkn_npc_siming_3',
          },
        },
      },
      {
        label: '引动周天三百六十五星辉反泄天劫雷力', hint: '悟性与神识检定 · 以星化雷',
        roll: {
          p: 0.54, attrs: { 悟性: 0.014, 神识: 0.014 },
          success: {
            text: '你身合周天星位，竟将狂暴紫雷尽数引入星海化为己用！天劫法身无雷可借自行溃散，司命星君抚掌叹服：「千年难遇的星道奇才！」',
            effects: { expPct: 0.35, lawExp: 110, lawId: 'star', attrs: { 悟性: 8, 神识: 7 }, relation: { 司命星君: 34 }, flag: { 斩破试劫法身: true } },
            goto: 'wkn_npc_siming_3',
          },
          fail: {
            text: '星位稍偏半寸，余雷劈得你浑身焦黑，好在司命星君及时出手收束雷海，保住你的元神无恙。',
            effects: { hp: -85, lawExp: 55, lawId: 'star', relation: { 司命星君: 20 }, flag: { 斩破试劫法身: true } },
            goto: 'wkn_npc_siming_3',
          },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_siming_3', title: '司命 · 周天仙经', pool: 'branch', tier: 6, weight: 0,
    text: '星海风暴渐歇，司命星君展开玄袍，袍面绣着的三百六十五颗银星竟一颗颗脱离布帛，悬在空中汇成一卷金辉流转的无上仙经！\n\n「被贬九霄十万载，我一直在等一个肯把天门当门槛、而不是当枷锁的下界修士。{name}，《周天星斗太古仙经》本就是为破界之人准备的——收好它，去把上界那潭死水搅个天翻地覆！」',
    choices: [
      {
        label: '跪受仙经，引周天星辰之力洗炼神魂', hint: '习得仙阶《周天星斗太古仙经》· 星辰法则大成',
        cost: { month: 2 },
        outcome: {
          text: '亿万星辉贯入紫府，你丹田之内仿佛开辟出微缩银河！从此举手投足皆带星辰镇界之威，渡劫之路一片坦途。',
          effects: {
            techniques: [WORLD_TECH_BY_ID.wt_zhoutian_xing],
            lawExp: 140, lawId: 'star',
            attrs: { 神识: 8, 悟性: 8, 气运: 7 },
            relation: { 司命星君: 35 },
            title: '周天星主',
            flag: { 获周天星斗仙经: true },
          },
        },
      },
      {
        label: '只领受仙经总纲，另请星君赐玄天星辰仙甲护持渡劫', hint: '获仙器玄天星辰仙甲 · 稳步登仙',
        outcome: {
          text: '司命星君含笑挥袖，三百六十五颗古星光核凝作一副流光仙甲覆于你身：「有此甲在身，九霄雷劫亦可横渡！」',
          effects: {
            items: ['xuantian_baojia'],
            lawExp: 120, lawId: 'star',
            attrs: { 根骨: 7, 神识: 7, 气运: 6 },
            relation: { 司命星君: 32 },
            flag: { 获周天星斗仙经: true },
          },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_siming_e1', title: '司命 · 星盘残局', pool: 'world', tier: 5, weight: 5, minRealm: 6, region: 'jiuxiao',
    require: 'rel("司命星君") >= 14',
    text: '九霄星台静谧无声，司命星君正对着一盘由真星微缩而成的残局苦思不解。见你登台，他抬手邀你落下一子：「此局模拟九州未来千年气运，黑子代表上界压境，白子乃下界生机——你来走这一手。」',
    choices: [
      {
        label: '弃边角而落子天元，以破釜沉舟之势反杀黑龙', hint: '悟性检定 · 惊艳星君',
        roll: {
          p: 0.54, attrs: { 悟性: 0.015, 气运: 0.012 },
          success: {
            text: '天元一子落下，整盘白星瞬间连成银河反吞黑势！司命星君抚掌大笑，顺手赠你一枚法则残片与天劫破境感悟。',
            effects: { items: ['faze_canpian'], breakBonus: 16, lawExp: 70, lawId: 'star', attrs: { 悟性: 5 }, relation: { 司命星君: 20 } },
          },
          fail: {
            text: '天元落子虽险，终究被黑势围死半壁，却也让星君看清了一处隐蔽劫眼，赐你星辰感悟酬谢。',
            effects: { lawExp: 45, lawId: 'star', attrs: { 悟性: 3 }, relation: { 司命星君: 14 } },
          },
        },
      },
      {
        label: '稳守四角生门，徐徐积蓄白星底蕴', hint: '稳扎稳打 · 寿元道心双进',
        outcome: {
          text: '司命星君微微点头：「守得住根基，才等得到破晓。」他引一缕星华温养你的元神。',
          effects: { lifespan: 40, lawExp: 50, lawId: 'star', attrs: { 道心: 5 }, relation: { 司命星君: 16 } },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_siming_e2', title: '司命 · 遮蔽仙眸', pool: 'wild', tier: 6, weight: 5, minRealm: 7, region: 'jiuxiao',
    require: 'rel("司命星君") >= 24',
    text: '九霄云海裂开一道万丈金缝，一只冷漠无情的上界天眼缓缓垂眸，正在巡查九州大乘修士气机！司命星君正全力催动浑天仪扰乱天机，星袍已被反噬撕裂数道。',
    choices: [
      {
        label: '立于浑天仪阵眼，以自身法力助星君遮蔽九州天机', hint: '消耗气血灵力 · 护全九州大修',
        cost: { hp: 80, mp: 80, month: 1 },
        outcome: {
          text: '漫天星雾骤起，终于瞒过冷漠仙眸，金缝缓缓闭合！司命星君长舒一口气，郑重赠你一枚九霄紫雷核作谢。',
          effects: { items: ['jiuxiao_leijie'], karma: 80, lawExp: 90, lawId: 'star', attrs: { 神识: 6, 道心: 6 }, relation: { 司命星君: 28 } },
        },
      },
      {
        label: '故意显露自身一丝凌厉剑意引走仙眸注视，再瞬息隐遁', hint: '神识与气运检定 · 险中求胜',
        roll: {
          p: 0.52, attrs: { 神识: 0.015, 气运: 0.015 },
          success: {
            text: '天眼被你孤胆气息吸引偏离星台，你旋即借空间星雾脱身，不仅护住星君更在天威之下悟透一层破劫玄机！',
            effects: { expPct: 0.32, breakBonus: 20, lawExp: 85, lawId: 'star', relation: { 司命星君: 30 } },
          },
          fail: {
            text: '天眼垂下一道余威劈伤你的神魂，好在成功保住了浑天仪不被毁去。',
            effects: { hp: -95, injury: 2, karma: 55, relation: { 司命星君: 22 } },
          },
        },
      },
    ],
  },
  {
    id: 'wkn_npc_siming_e3', title: '司命 · 天门赠星火', pool: 'world', tier: 6, weight: 5, minRealm: 7,
    require: 'rel("司命星君") >= 35',
    once: true,
    text: '南天门虚影在九霄尽头若隐若现。司命星君立于星台最边缘，将一枚燃烧着亿万年不灭紫火的太古星种托在掌心，递至你面前。\n\n「十万年前我因一念怜悯被贬下界，本以为此生再无望重见仙庭气象。如今看见你走到天门前，我方知那笔私改的命簿，改得值。{name}，收下这枚星火——待你推开天门之日，莫忘了九霄星台上还有位老友替你点着灯。」',
    choices: [
      {
        label: '接过太古星种，与司命星君击掌定下上界重逢之约', hint: '获渡劫玄黄丹与天劫丹 · 飞升成算大增',
        outcome: {
          text: '星火融于丹田，周身万劫皆轻。司命星君朗声大笑，将私藏万载的渡劫玄黄丹与天劫丹全数送入你袖中：「去罢，让仙界记住你的名字！」',
          effects: {
            items: ['dujie_shengdan', 'tianjie_dan'],
            breakBonus: 35,
            lawExp: 150, lawId: 'star',
            attrs: { 气运: 9, 道心: 8, 神识: 8 },
            demon: -30,
            relation: { 司命星君: 42 },
            title: '司命星契',
            flag: { 司命赠星火: true },
          },
        },
      },
      {
        label: '请星君随你同行闯关，共破那道禁锢十万载的贬谪枷锁', hint: '逆天大愿 · 业力与混沌星道齐涨',
        cost: { month: 2 },
        outcome: {
          text: '司命星君怔立良久，玄袍无风自动，竟第一次显露出昔年上界星君的绝代锋芒：「好！十万载牢笼，老夫便随你一同踏碎！」',
          effects: {
            items: ['tianjie_dan', 'hundun_muqi'],
            breakBonus: 28,
            lawExp: 160, lawId: 'star',
            karma: 100, attrs: { 道心: 10, 气运: 8 },
            relation: { 司命星君: 50 },
            title: '共碎天门',
            flag: { 司命同行飞升: true },
          },
        },
      },
    ],
  },

  /* ========================================================================
   * 第二篇 · 十道天地法则悟道与试炼（50 节点，每道 5 节点）
   * ======================================================================== */

  /* ───────────── 法则 1：剑道（sword，5 节点） ───────────── */
  {
    id: 'wkn_law_sword_1', title: '剑道 · 枯竹听锋', pool: 'inner', tier: 2, weight: 6, minRealm: 1,
    text: '夜雨敲打洞府外的荒竹林，万叶沙沙作响。你在入定间隙听见一截空心老竹在劲风中发出一声极清越的啸鸣，刹那间仿佛整片山谷的风都被劈成了两半。\n\n你忽然发觉，往日执着于招式繁复，反倒令剑气失了那一分直去直回的锐利。',
    choices: [
      {
        label: '闭目听风三昼夜，将万叶雨声化作一剑之势', hint: '悟性检定 · 剑道初悟',
        cost: { month: 1 },
        roll: {
          p: 0.58, attrs: { 悟性: 0.014, 根骨: 0.01 },
          success: {
            text: '第三夜雨歇时，你并指凌空轻划，案前孤灯焰心竟被无形剑意整齐剖作两瓣却未曾熄灭！剑道脉络豁然清明。',
            effects: { lawExp: 45, lawId: 'sword', attrs: { 悟性: 3, 根骨: 2 }, expPct: 0.14 },
          },
          fail: {
            text: '风声太杂，你只捕得一缕微弱锐气，虽未大成却令出剑少了两分迟疑。',
            effects: { lawExp: 22, lawId: 'sword', attrs: { 悟性: 1 } },
          },
        },
      },
      {
        label: '提剑入雨挥斩千次，以疲惫肉身逼出本能剑意', hint: '苦修铸锋 · 稳获剑道感悟',
        cost: { hp: 20, month: 1 },
        outcome: {
          text: '待到双臂酸麻得再抬不起剑时，最后那一记顺势垂落反而快得连雨水都来不及沾身。',
          effects: { lawExp: 32, lawId: 'sword', attrs: { 根骨: 3 } },
        },
      },
    ],
  },
  {
    id: 'wkn_law_sword_2', title: '剑道 · 断崖古碑痕', pool: 'wild', tier: 3, weight: 6, minRealm: 2,
    text: '荒岭绝壁之上横着一道长达百丈的平滑裂谷，崖石切口历经千年风雨仍光可鉴人——那是某位古剑修临走前随手试锋留下的剑痕。你走近十丈，眉心便隐隐生疼，仿佛有一柄无形利剑抵在额前。',
    choices: [
      {
        label: '迎着残留剑压静坐崖前，以神识临摹那一剑轨迹', hint: '神识与根骨检定 · 剑道大进',
        cost: { month: 1 },
        roll: {
          p: 0.54, attrs: { 神识: 0.014, 根骨: 0.012 },
          success: {
            text: '神识探入石痕的刹那，你眼前闪过一道劈开古夜的孤绝白光！醒来时额前冷汗涔涔，识海却多了一道凌厉剑印。',
            effects: { lawExp: 65, lawId: 'sword', attrs: { 根骨: 3, 神识: 3 }, items: ['jianqi_fu'] },
          },
          fail: {
            text: '太古剑压反冲识海，震得你喉头一甜，好在仍记住了半寸起手剑韵。',
            effects: { hp: -35, lawExp: 32, lawId: 'sword', attrs: { 道心: 2 } },
          },
        },
      },
      {
        label: '拔剑对着崖痕全力递出平生最强一剑，与古意相撞', hint: '以锋试锋 · 剑心激荡',
        cost: { mp: 30 },
        outcome: {
          text: '你的剑气撞上千年崖痕，激起漫天石屑与一声清越古鸣。那一瞬你听懂了古人留痕之意——剑无止境，唯有向前。',
          effects: { lawExp: 48, lawId: 'sword', attrs: { 道心: 3, 根骨: 2 }, expPct: 0.16 },
        },
      },
    ],
  },
  {
    id: 'wkn_law_sword_3', title: '剑道 · 剑冢镇灵试', pool: 'wild', tier: 4, weight: 5, minRealm: 4,
    once: true,
    text: '你误入一处藏于群山腹地的太古断剑冢，万柄锈剑插满焦土。冢心青石上盘坐着一道半透明的剑灵残影，周身缠绕实质化的剑道法则丝线。察觉你身负剑意，残影缓缓抬指并剑，向你发出无声邀战。',
    choices: [
      {
        label: '拔剑踏入冢心，与太古剑灵残影正面问剑', hint: '战斗 · 太古剑灵残影 · 剑道法则暴涨',
        combat: {
          enemy: 'sword_phantom',
          win: {
            text: '百招剑光倾泻，残影在你最后一剑下含笑崩解，化作一缕极精纯的太古剑道法则融入你紫府！冢心青石下更露出一枚剑魄通明丹。',
            effects: { lawExp: 110, lawId: 'sword', items: ['jianyi_dan'], expPct: 0.28, attrs: { 根骨: 5, 悟性: 4 }, flag: { 剑冢破灵: true } },
          },
          lose: {
            text: '残影一剑挑破你的护体罡气却未下杀手，点到即止化风散去，只留青石上一句剑意余音教你三处换气破绽。',
            effects: { hp: -65, lawExp: 55, lawId: 'sword', attrs: { 悟性: 4 } },
          },
        },
      },
      {
        label: '在冢外肃立观摩残影剑意呼吸，不惊古冢清眠', hint: '稳中求悟 · 获益不菲',
        cost: { month: 1 },
        outcome: {
          text: '残影见你守礼，隔空挥出一道柔和剑辉落在你肩头，替你洗去经脉三分驳杂灵气。',
          effects: { lawExp: 55, lawId: 'sword', attrs: { 道心: 4, 悟性: 2 } },
        },
      },
    ],
  },
  {
    id: 'wkn_law_sword_4', title: '剑道 · 无剑之境', pool: 'inner', tier: 5, weight: 5, minRealm: 5,
    once: true,
    text: '闭关第七载，你忽觉手中纵是神兵仙剑，出招时仍有一丝「器」的滞重。丹田内剑道法则剧烈震鸣，似要冲破有形之剑的藩篱——草木、清风、乃至一念目光，为何不可为剑？',
    choices: [
      {
        label: '散去周身所有剑形，尝试以纯念凝出无形法则之剑', hint: '悟性与道心检定 · 迈向无剑真境',
        cost: { month: 3 },
        roll: {
          p: 0.54, attrs: { 悟性: 0.015, 道心: 0.014 },
          success: {
            text: '洞府石壁在无声无息间浮出一道细如发丝的剑纹，你分明未抬一根手指！心中豁然大悟：器在手为下，意在心为上，法合天为极！',
            effects: { lawExp: 140, lawId: 'sword', attrs: { 悟性: 7, 道心: 6 }, expPct: 0.3, title: '心剑通神', flag: { 悟无剑境: true } },
          },
          fail: {
            text: '强散剑形令剑意失控反伤丹田，幸而及时收束，虽未破境却也窥见了无剑门槛。',
            effects: { hp: -70, lawExp: 65, lawId: 'sword', attrs: { 悟性: 3 } },
          },
        },
      },
      {
        label: '不强弃器剑，转而以神识打磨人剑合一之圆融', hint: '稳步精进 · 剑道夯实',
        cost: { month: 2 },
        outcome: {
          text: '人养剑，剑亦养人。你细细温养本命剑意两月，只觉出剑比往日轻灵三倍。',
          effects: { lawExp: 85, lawId: 'sword', attrs: { 根骨: 5, 神识: 4 } },
        },
      },
    ],
  },
  {
    id: 'wkn_law_sword_5', title: '剑道 · 仙剑冢斩天', pool: 'wild', tier: 6, weight: 4, minRealm: 7,
    once: true,
    text: '昆仑极深处浮现一座悬浮于星雾中的残破仙剑冢，百柄崩断的太古仙剑围成剑阵，中央凝出一尊冷漠森严的仙剑冢镇灵。唯有以极境剑道正面击败它，方能引动百剑齐鸣、窥见剑道圆满之境！',
    choices: [
      {
        label: '孤身步入百仙剑阵，以毕生剑道死战镇灵', hint: '巅峰战斗 · 仙剑冢镇灵 · 剑道登极',
        combat: {
          enemy: 'immortal_sword_remnant',
          win: {
            text: '百柄断仙剑齐齐低垂剑尖向你致意！镇灵化作一道璀璨太初剑芒没入你眉心，天地万物在你眼中皆现脉络破绽。',
            effects: { lawExp: 220, lawId: 'sword', items: ['faze_canpian'], expPct: 0.35, attrs: { 根骨: 8, 悟性: 8 }, title: '万剑俯首', flag: { 剑道登极: true } },
          },
          lose: {
            text: '百剑齐发威压太盛，你拼尽剑意斩开生路退回云海，浑身剑痕累累却觉剑骨前所未有地澄净。',
            effects: { hp: -120, injury: 2, lawExp: 110, lawId: 'sword', attrs: { 道心: 6 } },
          },
        },
      },
      {
        label: '立于阵外倾听百柄断仙剑的哀鸣与遗愿', hint: '以诚悟剑 · 无险深悟',
        cost: { month: 2 },
        outcome: {
          text: '百剑哀鸣渐化清越剑歌，数缕残留的太古剑意主动飘向你周身，助你省却百年苦悟。',
          effects: { lawExp: 120, lawId: 'sword', attrs: { 道心: 6, 悟性: 5 }, demon: -15 },
        },
      },
    ],
  },

  /* ───────────── 法则 2：丹道（pill，5 节点） ───────────── */
  {
    id: 'wkn_law_pill_1', title: '丹道 · 草木听息', pool: 'wild', tier: 2, weight: 6, minRealm: 1,
    text: '清晨山谷薄雾未散，你蹲在一片百年野灵草丛边歇脚。露珠滑落叶尖的刹那，你神识微动，竟隐约「听」见根须在泥土下汲取地脉灵气的轻柔呼吸，寒热燥湿之性如画卷在识海展开。',
    choices: [
      {
        label: '席地静坐一日，以神识细辨百草药性生克', hint: '悟性与神识检定 · 丹道初明',
        cost: { month: 1 },
        roll: {
          p: 0.58, attrs: { 悟性: 0.014, 神识: 0.012 },
          success: {
            text: '你终于悟透为何昔日炼丹总差一分火候——草木皆有灵性，顺其生机则成丹，强逼其性则成灰。临走还采得数株上好灵草。',
            effects: { lawExp: 45, lawId: 'pill', items: ['lingcao', 'qiannian_lingcao'], attrs: { 悟性: 3 } },
          },
          fail: {
            text: '草木气机纷杂难辨，你只勉强理清七八种常见药草的配伍，却也受益良多。',
            effects: { lawExp: 24, lawId: 'pill', items: ['lingcao'] },
          },
        },
      },
      {
        label: '采摘几株成熟灵草，就地以真火试炼一炉粗丹', hint: '以炼代悟 · 稳步提升',
        cost: { mp: 20 },
        outcome: {
          text: '丹火明灭之间，虽然只成了一枚培元丹，你对掌火分寸的拿捏却更圆融。',
          effects: { lawExp: 32, lawId: 'pill', items: ['peiyuan_dan'], counter: { alchemy: 1 } },
        },
      },
    ],
  },
  {
    id: 'wkn_law_pill_2', title: '丹道 · 地火古丹窟', pool: 'wild', tier: 3, weight: 6, minRealm: 2,
    text: '熔岩山腹深处藏着一座上古丹修遗留的地火丹窟，石壁刻满密密麻麻的控火口诀，地脉赤焰正沿着九道青石槽缓缓流淌，竟自成一座天然聚火阵，只是石槽旁盘踞着一头贪食火灵的毒煞凶兽。',
    choices: [
      {
        label: '驱逐毒兽，借地火天然阵势闭关参悟丹火法则', hint: '战斗 · 碧磷毒蟒 · 丹道大涨',
        combat: {
          enemy: 'poison_python', matchRealm: 'player',
          win: {
            text: '毒蟒伏诛，你独坐九道地火之间观火焰色泽由赤转青再化白，顿悟天地造化入炉之妙，更在丹灶灰烬中翻出一枚遗留丹药！',
            effects: { lawExp: 65, lawId: 'pill', items: ['juling_dan', 'chiyang_shi'], attrs: { 悟性: 3, 根骨: 2 } },
          },
          lose: {
            text: '地火炙热夹杂毒煞，你略受轻伤退到洞口，临走拓下半面壁上控火古诀。',
            effects: { hp: -35, lawExp: 30, lawId: 'pill' },
          },
        },
      },
      {
        label: '于窟口隔火遥观石壁古诀，不动地脉火兽', hint: '稳妥研习 · 丹理精进',
        cost: { month: 1 },
        outcome: {
          text: '你默背下七成控火口诀，从此运火炼丹少了几分躁气，寿元亦觉温润绵长。',
          effects: { lawExp: 45, lawId: 'pill', lifespan: 10, attrs: { 悟性: 2 } },
        },
      },
    ],
  },
  {
    id: 'wkn_law_pill_3', title: '丹道 · 紫府自成炉', pool: 'inner', tier: 4, weight: 5, minRealm: 3,
    once: true,
    text: '吐纳之间，你忽生奇想：外鼎终有器限，若将自身紫府丹田视作太古神鼎，纳天地灵气为药、以元神真火日夜温养，岂非时时刻刻皆在炼就长生金丹？',
    choices: [
      {
        label: '以身试法，在紫府内引动真火自炼先天药气', hint: '根骨与悟性检定 · 危险却大造化',
        cost: { month: 2 },
        roll: {
          p: 0.54, attrs: { 根骨: 0.014, 悟性: 0.014 },
          success: {
            text: '紫府之内轰然亮起一团柔和金焰，驳杂灵力尽化甘露！你周身溢出淡淡药香，寿元大涨，丹道法则迈出一大步。',
            effects: { lawExp: 95, lawId: 'pill', lifespan: 35, attrs: { 根骨: 4, 悟性: 4 }, expPct: 0.24, flag: { 紫府成炉: true } },
          },
          fail: {
            text: '真火在丹田险些失控，灼伤了半条灵脉，好在急服清水压下火毒，也算摸清了内炼火候。',
            effects: { hp: -55, lawExp: 45, lawId: 'pill', attrs: { 根骨: 2 } },
          },
        },
      },
      {
        label: '只以温和文火润养气海经脉，徐徐体悟造化生机', hint: '零风险 · 延寿养道',
        cost: { month: 1 },
        outcome: {
          text: '柔和药气游走百脉，陈年旧伤尽数平复，丹道感悟稳稳增长。',
          effects: { lawExp: 52, lawId: 'pill', heal: 2, lifespan: 18 },
        },
      },
    ],
  },
  {
    id: 'wkn_law_pill_4', title: '丹道 · 朽木回春劫', pool: 'wild', tier: 5, weight: 5, minRealm: 5,
    text: '一座被域外魔煞枯死的千里焦林中央，唯有一株焦黑古树心仍存一粒米粒大小的翠绿生机。你站在焦土上，感受到丹道至理正在呼唤：夺天地造化，非止炼丹成丸，更在逆转枯荣！',
    choices: [
      {
        label: '倾注自身丹道法则与灵力，试以造化真火唤醒枯林生机', hint: '耗灵力两月 · 悟造化丹道，业力大涨',
        cost: { mp: 70, month: 2 },
        outcome: {
          text: '焦木咔嚓裂开，抽出三寸嫩绿新芽，转瞬化作十里青烟蔓延荒原！天地反哺一缕浩瀚生机功德，你丹道感悟暴涨，更拾得一截古木新生的赤霞古木枝。',
          effects: { lawExp: 135, lawId: 'pill', items: ['kunlun_shenmu'], karma: 60, lifespan: 45, attrs: { 悟性: 5, 道心: 5 } },
        },
      },
      {
        label: '将那粒翠绿生机摄入玉瓶，炼作一炉绝品延寿圣丹', hint: '夺造化入药 · 得九转金丹',
        cost: { month: 2 },
        outcome: {
          text: '焦木彻底化作飞灰，而你掌中凝成一枚香气扑鼻的九转续命丹，丹道火候精进神速，心底却微生一丝愧意。',
          effects: { lawExp: 110, lawId: 'pill', items: ['jiuzhuan_dan'], karma: -15, counter: { alchemy: 2 } },
        },
      },
    ],
  },
  {
    id: 'wkn_law_pill_5', title: '丹道 · 兜率残火殿', pool: 'wild', tier: 6, weight: 4, minRealm: 6,
    once: true,
    text: '昆仑深渊云雾散开，露出一座坠落自太古上界的丹宫残殿。大殿中央悬浮着一朵永不熄灭的淡紫兜率残火，火旁立着一具守护丹宫的阴阳混元古尊傀影，目光如炬审视着踏入殿中的后辈。',
    choices: [
      {
        label: '正面击败丹宫守尊，引一缕太古兜率残火入体', hint: '巅峰战斗 · 阴阳混元古尊 · 丹道极境',
        combat: {
          enemy: 'yin_yang_elder',
          win: {
            text: '古尊虚影化作青烟散去，兜率残火温和地飞入你眉心紫府！殿角玉案上还留有一枚尘封万年的太乙长生果。',
            effects: { lawExp: 200, lawId: 'pill', items: ['changsheng_guo'], lifespan: 80, attrs: { 悟性: 7, 根骨: 6 }, title: '兜率火主', flag: { 得兜率残火: true } },
          },
          lose: {
            text: '阴阳二气几乎融化你的护体罡气，你强忍焦灼摘得一缕外焰退走，虽重创却仍收获惊人丹道感悟。',
            effects: { hp: -110, injury: 2, lawExp: 100, lawId: 'pill', lifespan: 25 },
          },
        },
      },
      {
        label: '在残火外静观阴阳火候流转，不惊动古尊执念', hint: '静悟火道 · 寿元丹道双收',
        cost: { month: 2 },
        outcome: {
          text: '紫火跃动间仿佛演尽九转成丹至理，你盘坐两月，醒来时白发转黑、生机如海。',
          effects: { lawExp: 120, lawId: 'pill', lifespan: 50, attrs: { 悟性: 6 } },
        },
      },
    ],
  },

  /* ───────────── 法则 3：阵道（array，5 节点） ───────────── */
  {
    id: 'wkn_law_array_1', title: '阵道 · 山川棋盘', pool: 'wild', tier: 2, weight: 6, minRealm: 1,
    text: '你立于青牛高岭极目远眺，秋雾散开，下方九座山峰竟隐隐排成洛书九宫之势，一条溪流蜿蜒穿过谷底，恰好勾连起天地灵气运转——山河本身，原来便是一座天然大阵。',
    choices: [
      {
        label: '以石子为阵旗，于岭顶仿山川地势推演三日', hint: '悟性检定 · 阵道启蒙',
        cost: { month: 1 },
        roll: {
          p: 0.58, attrs: { 悟性: 0.014, 神识: 0.012 },
          success: {
            text: '最后一颗石子落定，山顶雾气骤然向你汇聚成丈许聚灵小阵！你豁然明悟：布阵非逆天而为，乃借地脉之势。',
            effects: { lawExp: 45, lawId: 'array', attrs: { 悟性: 3, 神识: 2 }, expPct: 0.14 },
          },
          fail: {
            text: '石子摆了七八遍始终漏气，虽未成阵，却把地脉走向摸了个七七八八。',
            effects: { lawExp: 24, lawId: 'array', attrs: { 悟性: 1 } },
          },
        },
      },
      {
        label: '绘下九峰溪流地形图，留待日后慢慢拆解', hint: '稳扎稳打 · 收获阵道心得',
        outcome: {
          text: '你仔细记下山川气脉节点，此后行路破禁总比旁人多出一分直觉。',
          effects: { lawExp: 32, lawId: 'array', attrs: { 神识: 2 } },
        },
      },
    ],
  },
  {
    id: 'wkn_law_array_2', title: '阵道 · 迷雾古石林', pool: 'wild', tier: 3, weight: 6, minRealm: 2,
    text: '荒原深处矗立着一片天然八卦石林，凡误入其中的修士往往绕行七日仍回到原地。你踏入石林百步，前后浓雾翻涌，一具古林石傀悄然挡住生门。',
    choices: [
      {
        label: '不靠蛮力，以神识推演休生伤杜八门方位破阵而出', hint: '悟性与神识检定 · 智破古阵',
        roll: {
          p: 0.55, attrs: { 悟性: 0.015, 神识: 0.012 },
          success: {
            text: '你连踏三步逆八卦步，石傀竟自动退让两侧！石林中心露出一座石台，台面刻着半篇八卦阵简，旁边放着一张聚灵阵符。',
            effects: { lawExp: 65, lawId: 'array', items: ['juling_zhenfu'], attrs: { 悟性: 4, 神识: 3 } },
          },
          fail: {
            text: '错踏死门惊动石傀，被一拳震退十丈，狼狈破雾脱身，却也牢牢记住了错步之理。',
            effects: { hp: -35, lawExp: 30, lawId: 'array' },
          },
        },
      },
      {
        label: '直接出手击碎古林石傀，以力破阵拆解其阵核', hint: '战斗 · 古林石傀 · 拆核悟阵',
        combat: {
          enemy: 'stone_golem', matchRealm: 'player', displayName: '古林石傀',
          win: {
            text: '石傀崩塌后露出胸口一枚精致的八卦阵核，你细细拆解其中灵纹，阵道造诣大进，阵核上嵌着的灵石也一并收了！',
            effects: { lawExp: 58, lawId: 'array', stones: 320, attrs: { 悟性: 3, 根骨: 2 } },
          },
          lose: {
            text: '石傀铜皮铁骨难伤分毫，你只能顺着来时脚印退回荒原。',
            effects: { hp: -40, lawExp: 20, lawId: 'array' },
          },
        },
      },
    ],
  },
  {
    id: 'wkn_law_array_3', title: '阵道 · 一念成阵', pool: 'inner', tier: 4, weight: 5, minRealm: 4,
    once: true,
    text: '闭关之际，你凝视洞府四周密布的阵旗阵盘，忽然生出明悟：低阶阵修靠铁旗玉盘布阵，动辄耗时半日；若能以神识直接勾连天地灵机，抬手虚划即成困杀大阵，何须外物？',
    choices: [
      {
        label: '撤去洞府所有阵旗，尝试以纯神识凌空结成四象护阵', hint: '神识与悟性检定 · 踏入无旗成阵之境',
        cost: { mp: 50, month: 2 },
        roll: {
          p: 0.54, attrs: { 神识: 0.015, 悟性: 0.014 },
          success: {
            text: '指尖划过虚空，青龙白虎朱雀玄武四道灵纹竟凭空亮起，顷刻锁死方圆十里灵气！你仰首长笑，阵道终成大宗师气象。',
            effects: { lawExp: 110, lawId: 'array', attrs: { 神识: 6, 悟性: 5 }, expPct: 0.25, title: '虚空画阵', flag: { 一念成阵: true } },
          },
          fail: {
            text: '阵纹刚成三象便灵力反噬崩散，震得你识海嗡嗡作响，却已洞悉无旗布阵的关键节点。',
            effects: { hp: -55, lawExp: 55, lawId: 'array', attrs: { 神识: 3 } },
          },
        },
      },
      {
        label: '将阵法融入自身护体灵光，专研攻守一体之妙', hint: '稳妥精进 · 防御道基大固',
        cost: { month: 1 },
        outcome: {
          text: '护体灵光隐现八卦流转，从此临敌交手便如自带移动阵坛。',
          effects: { lawExp: 65, lawId: 'array', shield: 2, attrs: { 悟性: 3, 根骨: 3 } },
        },
      },
    ],
  },
  {
    id: 'wkn_law_array_4', title: '阵道 · 古战四象残坛', pool: 'wild', tier: 5, weight: 5, minRealm: 5,
    text: '中州荒漠地下掘出一座太古时期镇压域外魔潮的四象杀阵残坛。残坛虽已损毁七成，却仍困着一头蛰伏万载的域外虚空魔，阵光忽明忽暗，随时可能彻底崩溃！',
    choices: [
      {
        label: '借残坛余威亲手补全四象阵眼，将魔物彻底炼杀阵中', hint: '悟性与神识检定 · 惊天功德与阵道大悟',
        cost: { mp: 65, month: 2 },
        roll: {
          p: 0.54, attrs: { 悟性: 0.015, 神识: 0.015 },
          success: {
            text: '你以灵力代玉石连点四方阵枢，太古四象杀阵重绽万丈神光，将域外魔物瞬间绞灭！残坛留下的古阵真意尽数反哺于你。',
            effects: { lawExp: 145, lawId: 'array', items: ['faze_canpian'], karma: 65, reputation: 80, attrs: { 悟性: 6, 神识: 5 } },
          },
          fail: {
            text: '阵眼补全慢了半步，魔物破封而出，你只得仓促激战将其击退，好在阵坛并未全毁。',
            effects: { hp: -85, lawExp: 70, lawId: 'array', karma: 30 },
          },
        },
      },
      {
        label: '趁魔物被残阵虚弱，主动踏入阵心正面斩魔', hint: '战斗 · 域外虚空魔 · 阵中破敌',
        combat: {
          enemy: 'void_fiend', displayName: '域外虚空魔',
          win: {
            text: '你借四象残光步步压迫，亲手斩灭虚空魔！魔核碎裂处留下一枚晶莹虚空晶与完整的太古阵图铭刻。',
            effects: { lawExp: 140, lawId: 'array', items: ['xukong_jing'], expPct: 0.3, karma: 60 },
          },
          lose: {
            text: '虚空魔诡变莫测，你借残阵传送裂隙退回地面，只记下残坛大半阵纹。',
            effects: { hp: -90, injury: 1, lawExp: 65, lawId: 'array' },
          },
        },
      },
    ],
  },
  {
    id: 'wkn_law_array_5', title: '阵道 · 先天八卦玉璧', pool: 'wild', tier: 6, weight: 4, minRealm: 7,
    once: true,
    text: '昆仑玉虚秘殿尽头立着一面高达百丈的先天灵玉巨璧，璧上无字，唯有六十四道先天八卦光纹如星河自转。注视巨璧三息，你便觉自身天地法则竟被玉璧彻底锁死，必须以阵破阵方能走出玉璧映照出的独立小世界！',
    choices: [
      {
        label: '盘坐玉璧之前，以己身万法演先天八卦与之对弈', hint: '悟性检定 · 阵道圆满之契',
        cost: { month: 3 },
        roll: {
          p: 0.52, attrs: { 悟性: 0.016, 神识: 0.014 },
          success: {
            text: '三月不眠不休，你以一念化先天混元大阵反扣玉璧！巨璧发出一声清越龙吟，六十四道先天阵纹化作金雨尽数没入你识海！',
            effects: { lawExp: 220, lawId: 'array', items: ['dao_fruit'], expPct: 0.35, attrs: { 悟性: 9, 神识: 8 }, title: '先天阵尊', flag: { 破先天玉璧: true } },
          },
          fail: {
            text: '六十四卦变化无穷，你在第六十一卦被阵势反震出幻境，吐血却大笑——方才那一瞬已窥见先天真门！',
            effects: { hp: -100, lawExp: 120, lawId: 'array', attrs: { 悟性: 5 } },
          },
        },
      },
      {
        label: '只记下前十六卦守御阵理，谦逊退殿', hint: '稳健大悟 · 防御神识皆增',
        cost: { month: 1 },
        outcome: {
          text: '贪多嚼不烂，你细细吃透前十六卦玄机，护体阵威与神识俱获长足进步。',
          effects: { lawExp: 115, lawId: 'array', shield: 3, attrs: { 神识: 6, 道心: 5 } },
        },
      },
    ],
  },

  /* ───────────── 法则 4：雷霆（thunder，5 节点） ───────────── */
  {
    id: 'wkn_law_thunder_1', title: '雷霆 · 孤松引电', pool: 'wild', tier: 2, weight: 6, minRealm: 1,
    text: '盛夏暴雨骤至，黑云压顶如墨。山脊一株三百年老松被一道惨白惊雷劈中，焦木炸裂的瞬间，你却清晰看见雷光落地前那一刹那的曲折脉络——毁灭之中竟藏着一丝唤醒草木的至阳生机！',
    choices: [
      {
        label: '冒雨立于焦松旁，以掌心接引残余游离雷丝淬体', hint: '根骨检定 · 雷道初窥',
        cost: { hp: 20 },
        roll: {
          p: 0.56, attrs: { 根骨: 0.014, 道心: 0.01 },
          success: {
            text: '细密电弧游走周身经脉，酥麻过后竟觉肉身轻捷如风，更在焦松根下拾得一截蕴雷的老木！',
            effects: { lawExp: 45, lawId: 'thunder', items: ['leimu'], attrs: { 根骨: 3 } },
          },
          fail: {
            text: '余雷仍烈，电得你发梢倒竖、焦黑一片，却也摸到了几分雷霆走脉的窍门。',
            effects: { hp: -20, lawExp: 25, lawId: 'thunder', attrs: { 根骨: 1 } },
          },
        },
      },
      {
        label: '躲在岩洞内凝神默记雷光轨迹，画成五雷符纹', hint: '安稳参悟 · 获掌心五雷符',
        outcome: {
          text: '电光石火的脉络在识海反复重演，你顺手以灵墨画出一道品相极佳的五雷符。',
          effects: { lawExp: 32, lawId: 'thunder', items: ['zhangxin_leifu'], attrs: { 悟性: 2 } },
        },
      },
    ],
  },
  {
    id: 'wkn_law_thunder_2', title: '雷霆 · 裂云雷鹏巢', pool: 'wild', tier: 3, weight: 6, minRealm: 2,
    text: '雷鸣峡绝壁悬着一座紫电缠绕的巨巢，一头翼展十丈的裂云雷鹏正振翅吞吐苍穹落雷，巢畔石凹里积着一汪闪烁银芒的雷淬灵液。',
    choices: [
      {
        label: '御空直冲绝壁，与裂云雷鹏血战夺雷液', hint: '战斗 · 裂云雷鹏 · 雷霆法则大进',
        combat: {
          enemy: 'thunder_roc', displayName: '裂云雷鹏',
          win: {
            text: '雷鹏哀鸣坠谷，你仰首饮下大半汪雷淬灵液，余下的凝成一枚紫霄雷元丹！全身骨节噼啪作响，雷意奔腾如江河！',
            effects: { lawExp: 70, lawId: 'thunder', items: ['leiyuan_dan'], expPct: 0.24, attrs: { 根骨: 4 } },
          },
          lose: {
            text: '雷鹏紫羽电弧太过凌厉，你被震落峭壁，好在护身灵力尚存，捡回一命。',
            effects: { hp: -48, injury: 1, lawExp: 28, lawId: 'thunder' },
          },
        },
      },
      {
        label: '藏于崖下静观雷鹏如何吐纳劫雷，不夺其巢', hint: '观妖悟法 · 零伤获益',
        cost: { month: 1 },
        outcome: {
          text: '原来异兽并非硬抗天雷，而是借双翼引雷泄地！你大受启发，雷霆法则悄然精进。',
          effects: { lawExp: 48, lawId: 'thunder', attrs: { 悟性: 3, 道心: 2 } },
        },
      },
    ],
  },
  {
    id: 'wkn_law_thunder_3', title: '雷霆 · 雷池洗心魔', pool: 'inner', tier: 4, weight: 5, minRealm: 4,
    once: true,
    text: '入定之际，你以神识演化出一座雷霆内景。紫电煌煌照彻识海暗角，往日潜藏在心底的阴翳、怨念与畏惧在雷光下无所遁形，发出凄厉尖啸！',
    choices: [
      {
        label: '引九天至阳正雷轰入自身识海，连心魔带杂念一并劈碎', hint: '道心检定 · 涤魔悟雷',
        cost: { hp: 45, month: 1 },
        roll: {
          p: 0.56, attrs: { 道心: 0.015, 根骨: 0.01 },
          success: {
            text: '轰然一声巨响在紫府炸开！阴霾瞬间化作青烟，识海澄澈如万里晴空，雷霆法则借破邪之功突飞猛进！',
            effects: { lawExp: 105, lawId: 'thunder', demon: -30, attrs: { 道心: 6, 神识: 4 }, flag: { 雷洗识海: true } },
          },
          fail: {
            text: '雷力震伤元神令你耳鸣数日，好在终究烧去了大半心魔杂念。',
            effects: { hp: -40, demon: -14, lawExp: 50, lawId: 'thunder' },
          },
        },
      },
      {
        label: '以细微雷弧绕识海外围缓步游走，徐徐化煞', hint: '温和淬心 · 稳妥降魔',
        outcome: {
          text: '丝丝电弧如春风化雪，悄无声息净去了经年躁气，渡劫抗雷底气更增。',
          effects: { lawExp: 58, lawId: 'thunder', demon: -15, breakBonus: 8 },
        },
      },
    ],
  },
  {
    id: 'wkn_law_thunder_4', title: '雷霆 · 紫霄雷灵渊', pool: 'wild', tier: 5, weight: 5, minRealm: 4,
    text: '东海尽头的万年雷渊常年雷暴不息，渊心竟孕育出一尊人形紫霄雷灵！它周身紫电化作天罚长矛，凡靠近雷渊的修士皆会被它视作窃雷之贼而遭天雷轰击。',
    choices: [
      {
        label: '踏入万年雷渊，正面收服或斩灭紫霄雷灵', hint: '战斗 · 紫霄雷灵 · 得雷符与雷道暴涨',
        combat: {
          enemy: 'thunder_sovereign',
          win: {
            text: '紫霄雷灵溃散成漫天紫晶光雨，尽数融入你的紫府雷海！从此寻常劫雷落在你身上竟如清风拂面，渊底更得一道九霄神雷符。',
            effects: { lawExp: 135, lawId: 'thunder', items: ['jiuxiao_leifu'], breakBonus: 14, expPct: 0.28, attrs: { 根骨: 5, 道心: 5 } },
          },
          lose: {
            text: '雷渊之内雷灵几乎不死不灭，你被一道紫矛劈飞出百里，险些焦作炭人，却也记住了紫霄神雷的威韵。',
            effects: { hp: -80, injury: 1, lawExp: 60, lawId: 'thunder' },
          },
        },
      },
      {
        label: '于雷渊外围架设引雷阵，采撷溢散的紫霄雷气', hint: '悟性检定 · 智采雷精',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 悟性: 0.015, 气运: 0.01 },
          success: {
            text: '三缕精纯紫霄雷气顺着阵纹乖乖落入丹田，不仅炼出一枚紫霄雷元丹，雷道感悟亦大涨！',
            effects: { lawExp: 90, lawId: 'thunder', items: ['leiyuan_dan'], attrs: { 悟性: 4 } },
          },
          fail: {
            text: '引雷阵被一道偏雷劈得粉碎，只来得及收拢一缕余电。',
            effects: { hp: -30, lawExp: 42, lawId: 'thunder' },
          },
        },
      },
    ],
  },
  {
    id: 'wkn_law_thunder_5', title: '雷霆 · 九霄雷柱刻名', pool: 'wild', tier: 6, weight: 4, minRealm: 7,
    once: true,
    text: '九霄雷云最深处矗立着一根直通天门的太古紫霄雷柱，柱身铭刻着上古雷帝巡狩诸天的无上雷篆。传说能徒手按上雷柱扛过九息天罚者，便可令诸天劫雷俯首！',
    choices: [
      {
        label: '以身合雷，徒手按上太古紫霄雷柱硬抗九息灭世雷威', hint: '极险试炼 · 根骨道心检定 · 雷道圆满之机',
        cost: { hp: 110, month: 2 },
        roll: {
          p: 0.54, attrs: { 根骨: 0.015, 道心: 0.015 },
          success: {
            text: '九息宛如九百年！雷柱剧震，竟对你发出一声臣服般的低沉雷鸣，一枚九霄紫雷核自柱心剥落飞入你掌中！',
            effects: { lawExp: 220, lawId: 'thunder', items: ['jiuxiao_leijie'], breakBonus: 25, attrs: { 根骨: 8, 道心: 8 }, title: '万雷俯首', flag: { 雷柱刻名: true } },
          },
          fail: {
            text: '第八息时护体灵光崩碎，你被震飞千里咳血不止，然周身骨髓经此一淬已生淡紫雷纹，渡劫胜算大增！',
            effects: { hp: -90, injury: 2, lawExp: 115, lawId: 'thunder', breakBonus: 12 },
          },
        },
      },
      {
        label: '立于百丈之外以神识临摹雷柱外篆，不贪全功', hint: '稳妥大悟 · 雷道深进',
        cost: { month: 2 },
        outcome: {
          text: '虽未得雷核，却将半篇雷帝雷篆牢记于心，日后渡劫足以消去三成天威。',
          effects: { lawExp: 125, lawId: 'thunder', breakBonus: 14, attrs: { 悟性: 6, 神识: 5 } },
        },
      },
    ],
  },

  /* ───────────── 法则 5：空间（space，5 节点） ───────────── */
  {
    id: 'wkn_law_space_1', title: '空间 · 芥子观尘', pool: 'inner', tier: 2, weight: 6, minRealm: 1,
    text: '午后斜阳透过洞府石窗，一粒极细的微尘在光柱里缓缓打转。你凝神盯着它，忽然发觉微尘与洞府、山岳、乃至九州大地并无本质不同——大小远近，全在一念尺度的伸缩之间。',
    choices: [
      {
        label: '将神识缩至微尘大小，试探虚空褶皱缝隙', hint: '神识检定 · 空间初悟',
        cost: { month: 1 },
        roll: {
          p: 0.58, attrs: { 神识: 0.015, 悟性: 0.01 },
          success: {
            text: '一瞬间你「摸」到了空气背后那层冰凉无形的界膜！再睁眼时，抬手便能隔空摄来三丈外的茶杯。',
            effects: { lawExp: 45, lawId: 'space', attrs: { 神识: 3, 悟性: 2 }, escape: 1 },
          },
          fail: {
            text: '神识探得太深险些迷失在微尘幻象中，好在及时抽身，亦略有心得。',
            effects: { lawExp: 24, lawId: 'space', attrs: { 神识: 1 } },
          },
        },
      },
      {
        label: '反复揣摩储物袋内部阵纹，以器入道', hint: '务实钻研 · 稳获空间感悟',
        outcome: {
          text: '原来方寸乾坤袋便是最低阶的折空之术。你拆解透彻其中纹路，空间法则稳步增长。',
          effects: { lawExp: 34, lawId: 'space', attrs: { 悟性: 2 } },
        },
      },
    ],
  },
  {
    id: 'wkn_law_space_2', title: '空间 · 镜湖折影', pool: 'wild', tier: 3, weight: 6, minRealm: 2,
    text: '荒山深处有一泊无风古潭，水面映出的并非头顶灰云，而是千里之外另一座雪山的晴日！每逢午时，潭心便会裂开一道三尺宽的银白空间通道。',
    choices: [
      {
        label: '趁午时探手入通道，感应两界空间叠加之妙', hint: '气运与神识检定 · 奇遇缩地秘符',
        roll: {
          p: 0.55, attrs: { 神识: 0.014, 气运: 0.012 },
          success: {
            text: '指尖穿过冰冷界膜，竟从千里外雪山古洞摸出一枚尘封的缩地成寸符！空间折跃之理在你脑中豁然贯通。',
            effects: { lawExp: 65, lawId: 'space', items: ['suodi_fu'], attrs: { 神识: 3, 气运: 2 } },
          },
          fail: {
            text: '空间通道骤然合拢，险些削断你的袖口，好在抽手极快，只划破一层皮肉。',
            effects: { hp: -30, lawExp: 32, lawId: 'space' },
          },
        },
      },
      {
        label: '在潭畔静观午时空间裂合三次，以神识描摹折痕', hint: '零风险参悟 · 稳步提升',
        cost: { month: 1 },
        outcome: {
          text: '三次裂合令你看清虚空如帛、撕之有纹的奥妙，身法遁速骤添三分。',
          effects: { lawExp: 48, lawId: 'space', escape: 1, attrs: { 悟性: 3 } },
        },
      },
    ],
  },
  {
    id: 'wkn_law_space_3', title: '空间 · 裂界暗影伏', pool: 'wild', tier: 4, weight: 5, minRealm: 4,
    text: '行经乱石古峡时，你脚下的影子突然诡异地拉长并脱离地面——一头藏身空间夹缝的裂界暗影正无声贴近你的咽喉！唯有同样洞悉空间法则之人，方能捕捉它穿梭虚实的落点。',
    choices: [
      {
        label: '以空间感知预判其闪现落点，正面斩杀裂界暗影', hint: '战斗 · 裂界暗影 · 血战悟虚空',
        combat: {
          enemy: 'void_stalker', displayName: '裂界暗影',
          win: {
            text: '暗影尚未完全现身便被你一击封死虚空退路，当场崩解作一捧璀璨空间晶屑，凝出一枚稀世虚空晶！',
            effects: { lawExp: 115, lawId: 'space', items: ['xukong_jing'], expPct: 0.28, attrs: { 神识: 5, 悟性: 4 } },
          },
          lose: {
            text: '暗影神出鬼没，在你背心留下三道虚空割痕后隐入夹缝，你捂伤苦思其闪现节拍，反有所悟。',
            effects: { hp: -70, injury: 1, lawExp: 55, lawId: 'space' },
          },
        },
      },
      {
        label: '原地震荡灵力搅乱周遭空间稳定，逼退暗影', hint: '智避险战 · 空间法则小悟',
        cost: { mp: 45 },
        outcome: {
          text: '虚空如水波剧烈晃荡，裂界暗影无处立足发出一声尖啸遁走。你也借此摸清了锁空之法。',
          effects: { lawExp: 60, lawId: 'space', attrs: { 神识: 3 } },
        },
      },
    ],
  },
  {
    id: 'wkn_law_space_4', title: '空间 · 咫尺天涯步', pool: 'inner', tier: 5, weight: 5, minRealm: 5,
    once: true,
    text: '炼虚境神魂外游太虚，你俯瞰万里山河，忽觉九州之大亦不过脚下一步的距离。只要将脚下与远方的空间折叠贴合，咫尺便是天涯，天涯亦在咫尺！',
    choices: [
      {
        label: '强行撕开身前虚空踏入乱流，亲身演练咫尺天涯步', hint: '神识与气运检定 · 大成则空间跃迁',
        cost: { month: 2 },
        roll: {
          p: 0.54, attrs: { 神识: 0.015, 气运: 0.012 },
          success: {
            text: '一步迈出洞府，再睁眼竟已立于三千里外的东海孤礁之上，脚下连一粒尘土都未惊动！空间法则就此豁然贯通！',
            effects: { lawExp: 145, lawId: 'space', escape: 3, attrs: { 神识: 7, 悟性: 6 }, expPct: 0.3, title: '咫尺天涯', flag: { 悟咫尺天涯: true } },
          },
          fail: {
            text: '虚空乱流如钢刀刮体，将你甩在百里外荒山之中，衣衫破碎却也摸透了稳固坐标的法门。',
            effects: { hp: -85, lawExp: 70, lawId: 'space', attrs: { 神识: 4 } },
          },
        },
      },
      {
        label: '先以一缕分念探入虚空铺路，稳健推演缩界法门', hint: '零风险深悟 · 稳步提升',
        cost: { month: 2 },
        outcome: {
          text: '虽未一步万里，却已能在百丈方圆内随心移形换位，临战再难被围困。',
          effects: { lawExp: 90, lawId: 'space', escape: 2, attrs: { 神识: 4, 悟性: 4 } },
        },
      },
    ],
  },
  {
    id: 'wkn_law_space_5', title: '空间 · 界海古石刻', pool: 'wild', tier: 6, weight: 4, minRealm: 7,
    once: true,
    text: '大乘神识破开天地壁垒，你抵达九州尽头的无尽界海边缘。浪涛并非海水，而是无数生灭不定的破碎小世界！一块太古巨碑漂浮在界海漩涡之上，碑前盘踞着一尊妄图吞噬下界的虚空魔帝投影。',
    choices: [
      {
        label: '横渡界海斩灭虚空魔帝投影，独参太古界碑', hint: '巅峰战斗 · 虚空魔帝 · 空间法则登极',
        combat: {
          enemy: 'void_emperor',
          win: {
            text: '魔帝投影崩塌作虚无星粉！你踏碑而立，将太古界碑上关于「开辟界域」的至高空间法则尽数铭刻识海！',
            effects: { lawExp: 220, lawId: 'space', items: ['xukong_jing', 'faze_canpian'], expPct: 0.36, attrs: { 神识: 9, 悟性: 7 }, title: '裂界尊者', flag: { 界海参碑: true } },
          },
          lose: {
            text: '魔帝抬手便令百里空间塌陷，你拼死以空间断刃斩开退路遁回九州，伤重却带回半篇无上空间真义。',
            effects: { hp: -125, injury: 2, lawExp: 115, lawId: 'space', attrs: { 神识: 5 } },
          },
        },
      },
      {
        label: '隔着界海浪涛以神识遥拓碑文边角，不惊魔帝', hint: '智取退避 · 获空间大悟',
        cost: { month: 2 },
        outcome: {
          text: '仅是碑角三行残篆，便足以令你对虚空折叠的领悟再上一重台阶。',
          effects: { lawExp: 120, lawId: 'space', attrs: { 神识: 6, 悟性: 5 }, escape: 2 },
        },
      },
    ],
  },

  /* ───────────── 法则 6：光阴（time，5 节点） ───────────── */
  {
    id: 'wkn_law_time_1', title: '光阴 · 枯荣一刹', pool: 'inner', tier: 2, weight: 6, minRealm: 1,
    text: '洞府石阶缝里钻出一株只开半日便谢的朝露草。你入定前它尚是青芽，出定时已化作一撮枯灰。那一刻你忽觉凡人百年与蜉蝣一朝并无不同，长短不过是看客心跳的快慢。',
    choices: [
      {
        label: '放缓自身吐纳呼吸，试将一息拉长作半个时辰', hint: '悟性与道心检定 · 光阴初悟',
        cost: { month: 1 },
        roll: {
          p: 0.56, attrs: { 悟性: 0.014, 道心: 0.012 },
          success: {
            text: '当心跳慢至半刻一搏时，窗外坠落的枯叶竟在半空停顿了一刹！你初窥岁月流速之妙，寿元亦悄然绵长。',
            effects: { lawExp: 45, lawId: 'time', lifespan: 12, attrs: { 悟性: 3, 道心: 2 } },
          },
          fail: {
            text: '气机缓滞过头反倒憋闷胸口，只得长吐浊气恢复如常，但也记下了几分缓岁心得。',
            effects: { lawExp: 24, lawId: 'time', lifespan: 5 },
          },
        },
      },
      {
        label: '以灵气护住石阶下一粒新草籽，静观其春生秋杀', hint: '顺应四时 · 稳获光阴感悟',
        outcome: {
          text: '草木荣枯皆合天律。你静观数日，只觉浮躁心境沉淀下来，修炼进境越发绵长。',
          effects: { lawExp: 34, lawId: 'time', lifespan: 8, demon: -5 },
        },
      },
    ],
  },
  {
    id: 'wkn_law_time_2', title: '光阴 · 古观漏刻残碑', pool: 'wild', tier: 3, weight: 6, minRealm: 2,
    text: '深山塌陷的千年古观里，一座青铜水漏竟然至今仍在滴水——更诡异的是，水珠滴落的速度忽快忽慢，靠近水漏三尺内的野花一息盛开、一息枯萎，而铜漏下的青石却光洁如新！',
    choices: [
      {
        label: '伸手接住三滴逆时水珠，体会光阴倒流之触', hint: '气运与悟性检定 · 延寿悟时',
        roll: {
          p: 0.54, attrs: { 悟性: 0.014, 气运: 0.012 },
          success: {
            text: '三滴水珠没入掌心，你手背一道陈年剑疤竟然瞬间倒退消失！光阴法则在识海激起层层涟漪。',
            effects: { lawExp: 65, lawId: 'time', lifespan: 25, heal: 2, attrs: { 悟性: 3 } },
          },
          fail: {
            text: '水珠错撞顺时之流，竟瞬间催白了你三根鬓发，吓得你急忙缩手，却也因此摸清顺逆光阴的分界。',
            effects: { lifespan: -5, lawExp: 40, lawId: 'time', attrs: { 道心: 2 } },
          },
        },
      },
      {
        label: '立于三尺外细听铜漏滴水韵律，拓下碑侧铭文', hint: '稳健参悟 · 获玄冰心经残韵',
        cost: { month: 1 },
        outcome: {
          text: '滴答水声渐渐与你的脉搏共振，出观时你发觉自己已不知不觉省去数月苦修。',
          effects: { lawExp: 48, lawId: 'time', expPct: 0.16, lifespan: 12 },
        },
      },
    ],
  },
  {
    id: 'wkn_law_time_3', title: '光阴 · 南柯百年梦', pool: 'inner', tier: 4, weight: 5, minRealm: 4,
    once: true,
    text: '入定不过半炷香，你却在识海里骤然跌入一场长达百年的梦境：从垂髫学步到白发垂暮，娶妻生子、送别故交，最后卧于病榻合眼——醒来时炉中沉香才燃了不到一寸！',
    choices: [
      {
        label: '趁梦境未散，逆推那百年时光如何在半寸香火间折叠', hint: '悟性与神识检定 · 光阴法则骤进',
        cost: { month: 2 },
        roll: {
          p: 0.55, attrs: { 悟性: 0.015, 神识: 0.012 },
          success: {
            text: '一念百年，百年一念！你猛然睁眼，手中茶盏竟在指风下倒流回温热之态！光阴法则破壁跃升。',
            effects: { lawExp: 115, lawId: 'time', lifespan: 40, attrs: { 悟性: 6, 道心: 5 }, expPct: 0.28, flag: { 悟南柯百年: true } },
          },
          fail: {
            text: '梦中悲欢太过真实，几乎令你分不清今夕何夕，幸亏道心稳固未曾沉沦，却也耗去不少心神。',
            effects: { demon: 6, lawExp: 55, lawId: 'time', lifespan: 15 },
          },
        },
      },
      {
        label: '静静体味梦中凡人一生甘苦，将沧桑化作道心养料', hint: '涤心增寿 · 零风险获益',
        outcome: {
          text: '合眼再叹人间百年，许多急功近利的执念轰然化雪。你笑着续上一炷清香，道心圆融无瑕。',
          effects: { lawExp: 65, lawId: 'time', demon: -18, attrs: { 道心: 6 }, lifespan: 25 },
        },
      },
    ],
  },
  {
    id: 'wkn_law_time_4', title: '光阴 · 昆仑时之沙漏', pool: 'wild', tier: 5, weight: 5, minRealm: 5,
    text: '昆仑荒原冻土下露出一座倒悬的琉璃巨漏，漏中金沙并非向下流淌，而是逆着罡风缓缓上浮。每当金沙碰撞穹顶，周围百丈便会显化出上古玄冥女帝独战群妖的岁月残影！',
    choices: [
      {
        label: '步入倒流金沙之中，与岁月映出的寒帝残魂交手印证', hint: '战斗 · 玄冥寒帝残魂 · 夺岁月朝露',
        combat: {
          enemy: 'frost_empress',
          win: {
            text: '寒帝残魂在岁月沙雨中微微颔首消散，琉璃巨漏滴落一捧璀璨岁月朝露与昆仑建木枝，你对光阴凝滞之术领悟大进！',
            effects: { lawExp: 145, lawId: 'time', items: ['guangyin_lu', 'kunlun_shenmu'], lifespan: 55, expPct: 0.3 },
          },
          lose: {
            text: '寒帝素手一拂便冻结了你的时间流速，你拼力震碎寒霜退离巨漏，虽受重创却也窥见冻时玄机。',
            effects: { hp: -85, injury: 1, lawExp: 70, lawId: 'time', lifespan: 20 },
          },
        },
      },
      {
        label: '仅在沙漏边缘采撷三粒散落的岁月流沙参悟', hint: '稳妥获益 · 延寿增悟',
        cost: { month: 1 },
        outcome: {
          text: '金沙入手即化清凉流泉，为你洗去五十年岁月风尘，光阴法则亦大有长进。',
          effects: { lawExp: 85, lawId: 'time', lifespan: 50, attrs: { 悟性: 4 } },
        },
      },
    ],
  },
  {
    id: 'wkn_law_time_5', title: '光阴 · 岁月长河钓古今', pool: 'inner', tier: 6, weight: 4, minRealm: 7,
    once: true,
    text: '大乘极境神游太虚，你脚下云海轰然化作一条浩瀚无垠的灰金长河——那是冲刷万古仙神、连真仙亦不敢轻涉的岁月长河！河浪翻滚间，浮现出你从少年至今的每一个脚印，以及下游模糊不清的飞升剪影。',
    choices: [
      {
        label: '盘坐长河之畔，以神识化钓丝垂钓自身一缕未来道韵', hint: '道心与气运检定 · 光阴法则圆满之契',
        cost: { month: 3 },
        roll: {
          p: 0.52, attrs: { 道心: 0.015, 气运: 0.015 },
          success: {
            text: '钓丝剧颤，你竟从下游钓起一缕尚未到来的真仙清光！长河浪涛瞬间温顺如绸，你肉身岁月尽数定格，寿元暴涨二百载！',
            effects: { lawExp: 220, lawId: 'time', lifespan: 200, attrs: { 悟性: 8, 道心: 8, 气运: 6 }, expPct: 0.35, title: '长河钓岁', flag: { 长河钓古今: true } },
          },
          fail: {
            text: '长河反噬浪头几乎将你卷入洪流，幸亏斩断钓丝抽身极快，折损少许心血却也彻底看清岁月本貌！',
            effects: { hp: -110, lawExp: 120, lawId: 'time', lifespan: 60, attrs: { 道心: 5 } },
          },
        },
      },
      {
        label: '不贪未来，只于岸边挥手向河中过往旧影道一声无悔', hint: '斩断旧憾 · 圆满从容',
        outcome: {
          text: '上游所有苦痛悔恨随之化作清波远去。心魔尽消，光阴法则如水到渠成般迈入极境。',
          effects: { lawExp: 135, lawId: 'time', demon: -35, lifespan: 100, attrs: { 道心: 9 } },
        },
      },
    ],
  },

  /* ───────────── 法则 7：星辰（star，5 节点） ───────────── */
  {
    id: 'wkn_law_star_1', title: '星辰 · 寒夜引星辉', pool: 'inner', tier: 2, weight: 6, minRealm: 1,
    text: '秋夜无云，北斗七星悬于山巅清晰如银钉。你在露台打坐时，忽觉天灵盖微微清凉，竟有七缕细若蛛丝的冰凉银辉穿破夜幕垂落入体，与体内灵力交融出一股沉静绵厚的力量。',
    choices: [
      {
        label: '敞开周身三百六十窍穴，全力接引北斗星辉洗脉', hint: '根骨与神识检定 · 星辰初悟',
        cost: { month: 1 },
        roll: {
          p: 0.58, attrs: { 根骨: 0.014, 神识: 0.012 },
          success: {
            text: '星辉流遍百脉，气血与灵海齐齐壮大一圈！你睁眼时双眸隐含银芒，初窥星辰淬体之奥。',
            effects: { lawExp: 45, lawId: 'star', attrs: { 神识: 3, 根骨: 2 }, hpPct: 0.4, mpPct: 0.4 },
          },
          fail: {
            text: '星辉寒冽，一次引得太急令经脉微冻，急忙收功暖脉，倒也记住了引星节拍。',
            effects: { hp: -18, lawExp: 24, lawId: 'star' },
          },
        },
      },
      {
        label: '只引紫微一星清光温养识海，不求贪多', hint: '温和养神 · 稳步提升',
        outcome: {
          text: '一缕温润紫微星光在识海旋绕整夜，黎明时你神清气爽，法力精纯许多。',
          effects: { lawExp: 34, lawId: 'star', attrs: { 神识: 2 }, demon: -5 },
        },
      },
    ],
  },
  {
    id: 'wkn_law_star_2', title: '星辰 · 天外陨星坑', pool: 'wild', tier: 3, weight: 6, minRealm: 2,
    text: '昨夜一道银白流星划破九州天幕，坠落在荒原深处砸出百丈焦坑。你循迹赶到时，坑底尚在冒着青烟的漆黑陨铁心竟泛着周天星图般的银纹，只是周围灵兽已被星威惊得狂躁不安。',
    choices: [
      {
        label: '踏入炙热陨坑，徒手采掘核心星辰砂并参悟星纹', hint: '根骨与气运检定 · 得星辰砂与法则感悟',
        roll: {
          p: 0.55, attrs: { 根骨: 0.014, 气运: 0.012 },
          success: {
            text: '你硬抗残余天外罡火掘出一捧璀璨星辰砂，坑底星纹映入眼帘，令你星辰法则顿增一截！',
            effects: { lawExp: 65, lawId: 'star', items: ['xingchen_sha'], attrs: { 神识: 3, 根骨: 2 } },
          },
          fail: {
            text: '陨铁骤然炸裂溅出火星灼伤手掌，你抓了一把碎砂匆匆跃出陨坑。',
            effects: { hp: -35, lawExp: 32, lawId: 'star', stones: 240 },
          },
        },
      },
      {
        label: '盘坐陨坑边缘借助天外残留星压打磨气血灵海', hint: '零风险淬炼 · 气血灵力齐涨',
        cost: { month: 1 },
        outcome: {
          text: '天外星压厚重如岳，你借压吐纳一月，出关时经脉坚韧如铁、星辰感悟大进。',
          effects: { lawExp: 48, lawId: 'star', expPct: 0.16, attrs: { 根骨: 3 } },
        },
      },
    ],
  },
  {
    id: 'wkn_law_star_3', title: '星辰 · 观星古守殿', pool: 'wild', tier: 4, weight: 5, minRealm: 4,
    text: '中州断崖之上隐现一座仅在朔月之夜开启的上古观星台。台心石案摆着一卷《周天星辰诀玉简》，然案前两尊青铜铸就的观星古守卫骤然亮起星目，迈步挡在身前！',
    choices: [
      {
        label: '与青铜观星古守卫硬撼一场，凭实力取走星宫传承', hint: '战斗 · 观星古守卫 · 获玉简与星道大悟',
        combat: {
          enemy: 'star_golem', displayName: '观星古守卫',
          win: {
            text: '古守卫轰然跪倒化作星光散去！你踏上星台捧起玉简，漫天银辉倾泻而下为你灌顶！',
            effects: { lawExp: 115, lawId: 'star', items: ['yujian_xingchen'], expPct: 0.28, attrs: { 神识: 5, 悟性: 4 } },
          },
          lose: {
            text: '青铜重拳带着星辰巨力将你逼下石阶，幸而你以神识记下了守卫胸前星图运转之理。',
            effects: { hp: -70, injury: 1, lawExp: 55, lawId: 'star' },
          },
        },
      },
      {
        label: '效仿北斗步法在台下踏星致礼，以星辰共鸣换守卫放行', hint: '神识与悟性检定 · 不战而得星礼',
        roll: {
          p: 0.54, attrs: { 神识: 0.014, 悟性: 0.014 },
          success: {
            text: '七步踏完，古守卫竟收拳躬身让开通道！你从容阅览石案星诀，获赠一枚周天星辉丹。',
            effects: { lawExp: 95, lawId: 'star', items: ['xinghui_dan'], attrs: { 神识: 4, 悟性: 4 } },
          },
          fail: {
            text: '第六步星气微乱，守卫发出低吼逼你退下观星台，只得遥观一夜星斗离去。',
            effects: { lawExp: 42, lawId: 'star', attrs: { 神识: 2 } },
          },
        },
      },
    ],
  },
  {
    id: 'wkn_law_star_4', title: '星辰 · 界海噬星妖', pool: 'wild', tier: 5, weight: 5, minRealm: 6,
    text: '九霄星云低垂处，一头横渡界海而来的噬星天妖正张开巨口，将九州夜空三颗古星垂落的星辉硬生生吞噬殆尽！它腹中旋转的星涡一旦彻底成型，便会化作毁灭一方灵域的星爆！',
    choices: [
      {
        label: '御空斩入星涡核心，诛杀噬星天妖夺回星核', hint: '战斗 · 噬星天妖 · 夺太古星核',
        combat: {
          enemy: 'star_devourer',
          win: {
            text: '天妖凄厉崩灭，被吞噬的亿万星辉轰然反哺天地，更有三缕最精纯的古星本源汇入你丹田！',
            effects: { lawExp: 155, lawId: 'star', items: ['xinghui_dan', 'faze_canpian'], karma: 65, reputation: 95, attrs: { 神识: 6, 根骨: 5 } },
          },
          lose: {
            text: '星涡吞噬之力几乎抽干你的灵海，你拼命斩裂一角星幕脱身，却也借此悟出星力循环不竭的法门。',
            effects: { hp: -95, mp: -80, injury: 1, lawExp: 75, lawId: 'star' },
          },
        },
      },
      {
        label: '以周天星阵牵引天妖转向域外荒空，保全下界星辉', hint: '悟性与神识检定 · 智驱天妖',
        cost: { mp: 75, month: 1 },
        roll: {
          p: 0.55, attrs: { 悟性: 0.015, 神识: 0.015 },
          success: {
            text: '你化出九道虚幻星饵诱走天妖，三颗古星重放银辉，天地垂落甘霖奖赏你的护星之功。',
            effects: { lawExp: 115, lawId: 'star', karma: 55, attrs: { 悟性: 5, 气运: 4 } },
          },
          fail: {
            text: '星饵被天妖一爪拍碎，余波震伤你心脉，好在天妖也被惊扰遁入了界海深处。',
            effects: { hp: -60, lawExp: 55, lawId: 'star', karma: 25 },
          },
        },
      },
    ],
  },
  {
    id: 'wkn_law_star_5', title: '星辰 · 丹田辟星海', pool: 'inner', tier: 6, weight: 4, minRealm: 7,
    once: true,
    text: '这一夜，你仰望苍穹三百六十五颗主星，忽觉丹田气海与九天银河本是一体。若能在紫府方寸之间开辟出一座自转不息的微缩星海，从此法力便如群星恒耀，永无枯竭之忧！',
    choices: [
      {
        label: '引周天主星齐齐垂光，于紫府丹田开辟微缩星海', hint: '神识与根骨检定 · 星辰圆满之契',
        cost: { month: 3 },
        roll: {
          p: 0.52, attrs: { 神识: 0.015, 根骨: 0.015 },
          success: {
            text: '紫府轰然一震，三百六十五点星芒如烟火绽放并缓缓结成旋涡银河！你气血灵海暴增，星辰法则豁然圆满！',
            effects: { lawExp: 220, lawId: 'star', hpPct: 1, mpPct: 1, attrs: { 神识: 9, 根骨: 8 }, expPct: 0.36, title: '紫府星海', flag: { 丹田辟星海: true } },
          },
          fail: {
            text: '星芒汇聚至三百颗时险些失衡爆裂，你果断散去过盛星压保住丹田，虽受内伤却已奠定星海雏形！',
            effects: { hp: -115, lawExp: 120, lawId: 'star', attrs: { 神识: 5 } },
          },
        },
      },
      {
        label: '先凝北斗七星镇守气海七脉，循序渐进', hint: '稳步大成 · 无险深悟',
        cost: { month: 2 },
        outcome: {
          text: '七颗星印稳稳落位气海，法力运转如臂使指，星辰法则扎扎实实再登高楼。',
          effects: { lawExp: 130, lawId: 'star', attrs: { 神识: 6, 道心: 5 }, mpPct: 1 },
        },
      },
    ],
  },

  /* ───────────── 法则 8：因果（karma，5 节点） ───────────── */
  {
    id: 'wkn_law_karma_1', title: '因果 · 蛛网悬露', pool: 'inner', tier: 2, weight: 6, minRealm: 1,
    text: '清晨推开洞府木门，檐角一张细密蛛网挂满露珠。一只飞蛾撞破边缘一根丝，竟令整张网上的百颗露珠同时轻颤坠落。你凝视着震颤的丝线，心中骤然升起一缕玄妙感应——世间万物恩怨，原来皆系一网。',
    choices: [
      {
        label: '凝神以灵目内观，试着分辨缠绕自身的三缕红白因果线', hint: '神识与道心检定 · 因果初悟',
        cost: { month: 1 },
        roll: {
          p: 0.58, attrs: { 神识: 0.014, 道心: 0.012 },
          success: {
            text: '霎那间你瞥见肩头缠着几缕微不可察的淡金善缘与灰黑旧债，心中陡然透亮，从此避凶趋吉多了三分灵觉！',
            effects: { lawExp: 45, lawId: 'karma', attrs: { 气运: 3, 道心: 2 }, demon: -8 },
          },
          fail: {
            text: '丝线影影绰绰如雾里看花，看久了反觉目眩神摇，只捕得一丝模糊气韵。',
            effects: { lawExp: 24, lawId: 'karma', attrs: { 道心: 1 } },
          },
        },
      },
      {
        label: '伸手救下挂在网角的飞蛾，默念一句「有因必有果」', hint: '种下微善 · 业力因果俱进',
        outcome: {
          text: '飞蛾振翅没入晨光。一件极小之事，却令你识海泛起清凉宁静之意。',
          effects: { lawExp: 32, lawId: 'karma', karma: 15, demon: -6 },
        },
      },
    ],
  },
  {
    id: 'wkn_law_karma_2', title: '因果 · 古佛业火窟', pool: 'wild', tier: 3, weight: 6, minRealm: 3,
    text: '荒山塌庙地底藏着一处古佛坐化秘窟，石莲台上燃烧着一簇拳头大小的红莲业火。火光不烫血肉，却专门照出闯入者生平亏心与杀业——业债越重，烈焰焚心越痛！',
    choices: [
      {
        label: '盘坐莲台之前，主动引红莲业火焚炼自身过往业债', hint: '道心检定 · 浴火涤罪，因果大进',
        cost: { hp: 35, month: 1 },
        roll: {
          p: 0.55, attrs: { 道心: 0.015, 悟性: 0.01 },
          success: {
            text: '业火透胸而过，往昔所有杀伐躁气与悔意尽数化作青莲白烟！你睁眼时灵台纤尘不染，因果法则暴涨！',
            effects: { lawExp: 75, lawId: 'karma', demon: -24, karma: 25, attrs: { 道心: 4, 悟性: 3 }, items: ['qingxin_dan'] },
          },
          fail: {
            text: '火焰勾出昔年血腥旧忆灼得你神魂剧痛，急忙退下莲台大口喘息，却也烧去了几分虚妄心魔。',
            effects: { hp: -35, demon: -8, lawExp: 38, lawId: 'karma' },
          },
        },
      },
      {
        label: '于窟门合掌一礼，只取火光余韵静参善恶流转之理', hint: '安稳参悟 · 心境澄澈',
        outcome: {
          text: '红莲业火轻轻摇曳似作回应。你静坐三日离窟，觉得脚下吉凶分明许多。',
          effects: { lawExp: 50, lawId: 'karma', demon: -12, attrs: { 道心: 3 } },
        },
      },
    ],
  },
  {
    id: 'wkn_law_karma_3', title: '因果 · 幻界心魔尊', pool: 'inner', tier: 5, weight: 5, minRealm: 5,
    once: true,
    text: '闭关之际，一条漆黑因果丝线竟沿着你昔年斩杀强敌留下的怨念悄然钻入识海，在紫府深处凝成一尊冷笑连连的幻界心魔尊！「你欠下的债、你踩过的尸骨，今日该一并清算了！」',
    choices: [
      {
        label: '不避不逃，以因果法则正面迎战幻界心魔尊', hint: '战斗 · 幻界心魔尊 · 斩尽旧债',
        combat: {
          enemy: 'mirror_demon', displayName: '幻界心魔尊',
          win: {
            text: '心魔尊在清冽因果神光中寸寸瓦解！过往所有冤仇丝线尽数斩断化作精纯法则养料，你破关成算陡升！',
            effects: { lawExp: 135, lawId: 'karma', demon: -35, breakBonus: 16, attrs: { 道心: 6, 气运: 5 }, flag: { 斩因果心魔: true } },
          },
          lose: {
            text: '怨念幻象几乎吞噬你的识海，幸而最后一刻咬破舌尖守住清明强行逐魔，虽元气大伤却也识破心魔伪装。',
            effects: { hp: -85, demon: 8, lawExp: 65, lawId: 'karma' },
          },
        },
      },
      {
        label: '坦言过往是非皆由己担，反以无畏坦荡消融怨债', hint: '道心检定 · 化魔为道',
        roll: {
          p: 0.54, attrs: { 道心: 0.016, 悟性: 0.012 },
          success: {
            text: '「生杀因果，我一肩扛之，何须你代天讨债！」心魔尊闻言怔住，竟如冰雪见阳自行溃散！',
            effects: { lawExp: 120, lawId: 'karma', demon: -30, attrs: { 道心: 7, 气运: 4 }, flag: { 斩因果心魔: true } },
          },
          fail: {
            text: '话虽慷慨，心底仍有一丝愧疚被心魔抓住反噬，激战半夜方才将其镇压。',
            effects: { hp: -55, demon: 6, lawExp: 55, lawId: 'karma' },
          },
        },
      },
    ],
  },
  {
    id: 'wkn_law_karma_4', title: '因果 · 替人断死劫', pool: 'world', tier: 5, weight: 5, minRealm: 5,
    text: '路过中州古镇时，你因果灵目骤然刺痛——茶楼里一位素昧平生的清秀书生头顶竟缠着一道漆黑如墨的灭顶死劫，三日内必遭横祸，偏偏此人命格深处藏着半缕庇佑苍生的文曲清光。',
    choices: [
      {
        label: '暗中替他拨转三寸死劫红线，引走即将降临的横祸', hint: '承接天机微反噬 · 大功德与因果暴涨',
        cost: { hp: 50, month: 1 },
        outcome: {
          text: '三日后山石塌落擦着书生肩头滚过，他毫发无伤叩谢上苍，而你承受了三成天机反噬吐出一口瘀血。转瞬之间，一道金紫功德气运自苍穹垂落弥补因果！',
          effects: { lawExp: 135, lawId: 'karma', karma: 85, attrs: { 气运: 6, 道心: 5 }, breakBonus: 12 },
        },
      },
      {
        label: '只赠他一枚护身清心符并留一句警示，不强行逆改天命', hint: '顺应因果 · 稳妥获益',
        outcome: {
          text: '你递去一纸清符：「三日内莫走西山古道。」书生虽疑惑却依言改道，躲过塌方。你明悟「点化而不强夺」亦是因果上乘之道。',
          effects: { lawExp: 90, lawId: 'karma', karma: 45, attrs: { 悟性: 4, 气运: 3 } },
        },
      },
    ],
  },
  {
    id: 'wkn_law_karma_5', title: '因果 · 九霄无字天书碑', pool: 'wild', tier: 6, weight: 4, minRealm: 7,
    once: true,
    text: '九霄云海边缘漂浮着一块残缺无字碑，碑面空空如也，却在映出你身影的一瞬浮现出三生三世无数密密麻麻的因果脉络——每一条线都牵连着你爱过、救过、恨过、斩过的所有生灵。',
    choices: [
      {
        label: '伸指轻触碑面，理清此生万千因果丝线而不斩不断、任其归源', hint: '道心与气运检定 · 因果圆满之境',
        cost: { month: 3 },
        roll: {
          p: 0.52, attrs: { 道心: 0.016, 气运: 0.015 },
          success: {
            text: '万千丝线非但没有束缚你，反而在你身后织成一轮璀璨功德因果神环！天地劫数望风退避，你顿悟大因果轮回真谛！',
            effects: { lawExp: 220, lawId: 'karma', items: ['tiandao_lotus'], breakBonus: 26, demon: -40, attrs: { 道心: 9, 气运: 9 }, title: '执因断果', flag: { 参无字因果碑: true } },
          },
          fail: {
            text: '三生执念齐齐涌来几乎冲垮元神，你及时收手退离石碑，虽大汗淋漓却彻底看透了因果宿命的边界。',
            effects: { hp: -100, lawExp: 120, lawId: 'karma', demon: -15, attrs: { 道心: 5 } },
          },
        },
      },
      {
        label: '挥剑斩断碑上最沉重的三条死劫晦线，轻装渡劫', hint: '果断斩劫 · 大幅提升突破成算',
        outcome: {
          text: '三条黑线应剑而断，你顿觉肩头千钧重压瞬间一空，破境劫数大大减轻！',
          effects: { lawExp: 135, lawId: 'karma', breakBonus: 24, demon: -25, attrs: { 道心: 6 } },
        },
      },
    ],
  },

  /* ───────────── 法则 9：血海（blood，5 节点） ───────────── */
  {
    id: 'wkn_law_blood_1', title: '血海 · 战血沸脉', pool: 'inner', tier: 2, weight: 6, minRealm: 1,
    text: '一场恶战之后你独坐洞府运功疗伤，却发现周身滚烫鲜血在伤痛刺激下非但没有衰弱，反而发出潮汐般的低沉轰鸣——气血如海，愈临绝境，生命最原始的搏杀伟力愈发狂烈！',
    choices: [
      {
        label: '顺着滚烫气血催动周天，体悟以战养血的刚烈之道', hint: '根骨检定 · 血海初悟',
        cost: { hp: 20, month: 1 },
        roll: {
          p: 0.58, attrs: { 根骨: 0.015, 道心: 0.01 },
          success: {
            text: '气血在筋骨间轰然奔涌，伤口以肉眼可见的速度愈合如初！你初窥血海法则「生杀皆在气血」之奥。',
            effects: { lawExp: 45, lawId: 'blood', attrs: { 根骨: 4 }, hpPct: 0.5 },
          },
          fail: {
            text: '血气冲撞太烈令你鼻血长流，微添三分暴戾之气，却也摸到了催血增威的法门。',
            effects: { hp: -18, demon: 4, lawExp: 25, lawId: 'blood' },
          },
        },
      },
      {
        label: '以清心吐纳压下燥热血气，只留三分淬骨余韵', hint: '守心不堕魔 · 稳步提升',
        outcome: {
          text: '你稳稳收束滚烫气血，既淬炼了筋骨，又未让杀意染黑神台。',
          effects: { lawExp: 32, lawId: 'blood', attrs: { 根骨: 2, 道心: 2 } },
        },
      },
    ],
  },
  {
    id: 'wkn_law_blood_2', title: '血海 · 古战埋骨原', pool: 'wild', tier: 3, weight: 6, minRealm: 2,
    text: '北荒边缘有一片寸草不生的赤红荒原，传说三千年前十万修士在此血战陨落。每逢朔风吹过，泥土下便渗出丝丝腥甜血煞，连法器都会被染上暗红锈色。',
    choices: [
      {
        label: '拔剑立于赤原中央，引古战场残余战意淬炼自身血海法则', hint: '道心与根骨检定 · 战意蜕变',
        cost: { month: 1 },
        roll: {
          p: 0.54, attrs: { 根骨: 0.014, 道心: 0.014 },
          success: {
            text: '漫天残魂战吼中你傲然不屈，反将万千战意化作一缕精纯血海杀意归入丹田，更掘出一枚血煞魔核！',
            effects: { lawExp: 70, lawId: 'blood', items: ['xuesha_jing'], attrs: { 根骨: 4 }, demon: 5 },
          },
          fail: {
            text: '战魂怨煞冲入灵台令你双目赤红，幸亏及时撤出赤原才未走火入魔。',
            effects: { hp: -35, demon: 10, lawExp: 35, lawId: 'blood' },
          },
        },
      },
      {
        label: '挥剑立碑超度埋骨英魂，以阳刚正气涤散阴煞', hint: '以正克煞 · 业力与血海同进',
        outcome: {
          text: '残魂散去怨毒，唯留一缕纯粹刚勇的战血清气拂过你身周，令你气血如龙且不生心魔。',
          effects: { lawExp: 48, lawId: 'blood', karma: 25, attrs: { 道心: 3, 根骨: 2 } },
        },
      },
    ],
  },
  {
    id: 'wkn_law_blood_3', title: '血海 · 血渊魔主试', pool: 'wild', tier: 4, weight: 5, minRealm: 4,
    text: '北荒血渊沸腾如海，一尊盘踞此地千年的血渊魔主正欲借血祭突破炼虚。见你身上流转着不俗血气，魔主狞笑挥袖卷起百丈血浪：「好一具上等血囊！来，融进本座血海里罢！」',
    choices: [
      {
        label: '以杀止杀，直闯血浪死战血渊魔主', hint: '战斗 · 血渊魔主 · 以战证血海',
        combat: {
          enemy: 'blood_fiend_king',
          win: {
            text: '你的杀伐气血竟比魔主更纯更烈！一击轰碎其血海法相，魔主化作精纯血气被你炼去怨煞后尽数吸收，渊底更得龙血精！',
            effects: { lawExp: 120, lawId: 'blood', items: ['longxue_jing'], expPct: 0.28, attrs: { 根骨: 6 }, karma: 30 },
          },
          lose: {
            text: '血海吞噬生机骇人听闻，你拼死撕裂红潮逃出生天，浑身浴血却对血海杀伐多了刻骨体悟。',
            effects: { hp: -75, injury: 1, lawExp: 55, lawId: 'blood' },
          },
        },
      },
      {
        label: '隔空以剑气或雷法焚毁其血祭阵眼，断其魔源后远遁', hint: '智破魔祭 · 业力大增',
        cost: { mp: 45 },
        outcome: {
          text: '血祭大阵轰然崩毁，魔主狂怒却无暇追击。你在毁阵刹那亦看清了血海生灭的死穴。',
          effects: { lawExp: 62, lawId: 'blood', karma: 40, attrs: { 道心: 4 } },
        },
      },
    ],
  },
  {
    id: 'wkn_law_blood_4', title: '血海 · 修罗战魔殿', pool: 'wild', tier: 5, weight: 5, minRealm: 6,
    text: '太古修罗战场遗迹骤现于赤漠蜃楼之中。青铜殿门之内，一尊三头六臂的修罗古战魔手握血斧静立万载，唯有气血如海、敢于死战不退的绝世强者，方能赢取殿内太古炼体与血海传承！',
    choices: [
      {
        label: '不借外宝，以自身血气战意正面迎击修罗古战魔', hint: '巅峰战斗 · 修罗古战魔 · 血骨重生',
        combat: {
          enemy: 'crimson_asura', displayName: '修罗古战魔',
          win: {
            text: '修罗战魔轰然单膝叩首，化作一道赤金战纹烙入你胸膛！你气血奔腾如太古天河，滴血便蕴万钧伟力！',
            effects: { lawExp: 160, lawId: 'blood', items: ['duangu_dan', 'longxue_jing'], expPct: 0.32, attrs: { 根骨: 7, 道心: 5 }, title: '修罗血骨' },
          },
          lose: {
            text: '六臂血斧如狂风暴雨压得你骨裂吐血，战魔却在最后一击收斧转身——它敬你的死战之勇，留下一缕修罗血气赠你。',
            effects: { hp: -100, injury: 2, lawExp: 80, lawId: 'blood', attrs: { 根骨: 4 } },
          },
        },
      },
      {
        label: '在殿外体悟修罗雕像上凝固万年的战意呼吸，不冒死险', hint: '观战意悟血海 · 稳步大进',
        cost: { month: 2 },
        outcome: {
          text: '你凝视雕像两月，终于懂了修罗战意并非盲目嗜杀，而是明知必死仍敢挥拳的决绝。',
          effects: { lawExp: 95, lawId: 'blood', attrs: { 根骨: 4, 道心: 4 } },
        },
      },
    ],
  },
  {
    id: 'wkn_law_blood_5', title: '血海 · 冥河覆天碑', pool: 'wild', tier: 6, weight: 4, minRealm: 7,
    once: true,
    text: '域外魔渊边沿竖着一块沾满太古仙血的巨型骨碑，碑下竟坐镇着一尊血海古祖投影！血浪滔天百万里，仿佛要将整片下界苍穹拖入无边血海——但若能以己道镇压血祖、反掌血海生灭，便可证得血海法则圆满！',
    choices: [
      {
        label: '踏血浪而行，正面镇杀血海古祖投影以证至高杀伐之道', hint: '绝巅死战 · 血海古祖 · 血海法则登极',
        combat: {
          enemy: 'blood_ocean_lord',
          win: {
            text: '百万里血潮骤然凝固并向你臣服！血海古祖投影在赤金神芒中崩灭，一缕最纯粹的太古气血本源融入你四肢百骸！',
            effects: { lawExp: 220, lawId: 'blood', items: ['faze_canpian', 'longxue_jing'], hpPct: 1, expPct: 0.36, attrs: { 根骨: 9, 道心: 7 }, title: '血海不灭', flag: { 镇血海古祖: true } },
          },
          lose: {
            text: '血河滔天几乎将你吞没，你硬凭一口不灭战意劈浪而出，虽伤重却觉肉身再无凡胎之怯！',
            effects: { hp: -130, injury: 2, lawExp: 115, lawId: 'blood', attrs: { 根骨: 5 } },
          },
        },
      },
      {
        label: '于血潮外以道心观照生杀轮转，化嗜血魔意为不朽生机', hint: '以道御血 · 无魔大悟',
        cost: { month: 2 },
        outcome: {
          text: '血能杀敌，亦能养命。你反手将翻涌血煞炼化作澄澈长生气血，不染半点魔念！',
          effects: { lawExp: 130, lawId: 'blood', demon: -20, lifespan: 60, attrs: { 根骨: 6, 道心: 6 } },
        },
      },
    ],
  },

  /* ───────────── 法则 10：混沌（chaos，5 节点） ───────────── */
  {
    id: 'wkn_law_chaos_1', title: '混沌 · 五行归灰', pool: 'inner', tier: 3, weight: 5, minRealm: 2,
    text: '吐纳行功至深夜，你忽见丹田内流转的五行灵气在某个极微妙的刹那失去了青赤黄白黑的分野，化作一缕极淡的灰蒙蒙雾气。雾气极小，却沉重得仿佛能压塌整片气海！',
    choices: [
      {
        label: '屏息凝神，试着以神识包容并温养那缕初生混沌灰气', hint: '悟性与根骨检定 · 混沌初窥',
        cost: { month: 1 },
        roll: {
          p: 0.52, attrs: { 悟性: 0.015, 根骨: 0.012 },
          success: {
            text: '灰蒙雾气绕丹田缓缓旋了一周，所过之处诸般杂灵尽皆归顺！你欣喜莫名——万法之源，原来正在阴阳未分之际。',
            effects: { lawExp: 55, lawId: 'chaos', attrs: { 悟性: 3, 根骨: 3 }, expPct: 0.16 },
          },
          fail: {
            text: '灰气沉重得险些震裂经脉，你急忙散回五行原状，胸口闷痛却已铭记那种玄妙质感。',
            effects: { hp: -28, lawExp: 28, lawId: 'chaos' },
          },
        },
      },
      {
        label: '不强行融合，只静观五行相生相克间的灰色过渡刹那', hint: '稳妥参悟 · 混沌渐明',
        outcome: {
          text: '水火既济、阴阳互抱，你在那微不可察的转换缝隙里窥得一缕混沌先机。',
          effects: { lawExp: 38, lawId: 'chaos', attrs: { 悟性: 2, 道心: 2 } },
        },
      },
    ],
  },
  {
    id: 'wkn_law_chaos_2', title: '混沌 · 阴阳颠倒谷', pool: 'wild', tier: 4, weight: 5, minRealm: 3,
    text: '群山深处有一处诡异绝谷：谷左冰雪千里，谷右岩浆滚沸，而交界处十丈宽的石带上却既不冷也不热，只飘荡着浓得化不开的乳白玄黄气，凡踏入者体内单一五行灵力竟会骤然失灵！',
    choices: [
      {
        label: '散去护体五行灵光，赤身踏入玄黄交界静坐七日', hint: '根骨与道心检定 · 肉身悟混沌',
        cost: { month: 2 },
        roll: {
          p: 0.54, attrs: { 根骨: 0.014, 道心: 0.014 },
          success: {
            text: '冰火交替冲刷之下你竟无损分毫，反而引得一丝混沌灵液主动渗入百脉！起身时周身隐现玄黄清光。',
            effects: { lawExp: 85, lawId: 'chaos', attrs: { 根骨: 4, 悟性: 4, 道心: 3 }, expPct: 0.22 },
          },
          fail: {
            text: '冰火失衡瞬间冻伤半边身躯又灼伤右臂，你狼狈滚出石带，好在拾得几缕残留混沌气机。',
            effects: { hp: -55, lawExp: 42, lawId: 'chaos' },
          },
        },
      },
      {
        label: '在石带边缘以玉瓶小心收拢散溢的冰火交融雾气', hint: '稳妥采气 · 收获灵丹之效',
        outcome: {
          text: '冰火雾气在玉瓶内渐渐化作一滴清浊相融的灵露，饮下后不仅修为增进，混沌法则亦添一层感悟。',
          effects: { lawExp: 55, lawId: 'chaos', expPct: 0.16, attrs: { 悟性: 3 } },
        },
      },
    ],
  },
  {
    id: 'wkn_law_chaos_3', title: '混沌 · 昆仑混沌兽', pool: 'wild', tier: 5, weight: 5, minRealm: 6,
    text: '昆仑深渊裂开一道太古雾口，一头形似巨猊却无眼耳口鼻的太古混沌兽缓步踏出！它每吐息一次，方圆十里的剑气、雷光、阵纹便齐齐崩塌化作原始清浊之气，令无数高阶修士束手无策！',
    choices: [
      {
        label: '迎着法则崩塌的威压，以己身混沌真意正面搏杀太古混沌兽', hint: '巅峰战斗 · 太古混沌兽 · 获混沌母气',
        combat: {
          enemy: 'chaos_beast',
          win: {
            text: '混沌兽发出一声远古洪荒低鸣轰然化雾消散，原地凝出一缕重若山岳的先天混沌母气！你的混沌法则在死战中彻底升华！',
            effects: { lawExp: 165, lawId: 'chaos', items: ['hundun_muqi'], expPct: 0.34, attrs: { 根骨: 6, 悟性: 6 }, flag: { 斩混沌兽: true } },
          },
          lose: {
            text: '所有神通落在混沌兽身上皆被化作虚无，你拼尽全力才撕开雾墙撤走，虽伤重却彻底悟透了「万法归源」的恐怖之处。',
            effects: { hp: -105, injury: 2, lawExp: 80, lawId: 'chaos' },
          },
        },
      },
      {
        label: '敛去一切攻击法则，以最纯粹的呼吸韵律与混沌兽擦身共振', hint: '道心与气运检定 · 不战而获洪荒垂青',
        roll: {
          p: 0.52, attrs: { 道心: 0.015, 气运: 0.015 },
          success: {
            text: '混沌兽竟停步轻嗅你周身气机，随后吐出一滴混沌初开灵液落入你掌心，转身慢悠悠回返深渊！',
            effects: { lawExp: 145, lawId: 'chaos', items: ['hundun_lingye'], attrs: { 悟性: 6, 气运: 5 } },
          },
          fail: {
            text: '气机稍露一丝锋芒便引来混沌兽怒吼震飞百丈，好在它未曾追击。',
            effects: { hp: -65, lawExp: 60, lawId: 'chaos' },
          },
        },
      },
    ],
  },
  {
    id: 'wkn_law_chaos_4', title: '混沌 · 万法熔一炉', pool: 'inner', tier: 6, weight: 5, minRealm: 6,
    once: true,
    text: '闭关之际，你察觉自己所修诸般法则——无论剑意凌厉、雷霆刚猛，抑或光阴幽深——在更高境界上竟然彼此掣肘。一个大胆到近乎疯狂的念头浮上心头：何不以混沌为炉，将万法尽数熔归一点？',
    choices: [
      {
        label: '果断散开诸般法则壁垒，以神魂强行熔铸混沌元胎', hint: '悟性与道心检定 · 极险却可铸无上根基',
        cost: { hp: 80, month: 3 },
        roll: {
          p: 0.52, attrs: { 悟性: 0.016, 道心: 0.015 },
          success: {
            text: '万法在紫府剧烈碰撞炸出亿万星火，终在最后一刹凝成一粒温润无瑕的混沌道胎！从此诸法互生，再无滞碍！',
            effects: { lawExp: 180, lawId: 'chaos', attrs: { 悟性: 8, 道心: 8, 根骨: 6 }, expPct: 0.35, title: '万法归源', flag: { 万法熔炉: true } },
          },
          fail: {
            text: '法则冲突几乎撑裂元神，你急忙强行分开诸道才保住性命，经脉受损却已看见混沌熔炉的轮廓。',
            effects: { hp: -90, injury: 2, lawExp: 90, lawId: 'chaos' },
          },
        },
      },
      {
        label: '只以混沌为桥梁调和两道主修法则，稳步推进', hint: '稳健圆融 · 零险大悟',
        cost: { month: 2 },
        outcome: {
          text: '灰色混沌清气化作纽带，令你体内灵力与法则流转陡然顺滑三倍，实打实迈上一层新境。',
          effects: { lawExp: 115, lawId: 'chaos', attrs: { 悟性: 5, 道心: 5 }, demon: -15 },
        },
      },
    ],
  },
  {
    id: 'wkn_law_chaos_5', title: '混沌 · 太初开天石碑', pool: 'wild', tier: 6, weight: 4, minRealm: 7,
    once: true,
    text: '九州地脉极深处沉睡着一块据称早于天地开辟的太初石碑。碑前盘踞着一头吞天蔽日的混沌吞界鲲，碑面唯有简简单单一道裂痕——仿佛正是盘古开天时劈开鸿蒙的第一道清光！',
    choices: [
      {
        label: '激战混沌吞界鲲，亲赴太初石碑前参悟开天第一道神音', hint: '绝巅之战 · 混沌吞界鲲 · 混沌法则圆满',
        combat: {
          enemy: 'chaos_leviathan',
          win: {
            text: '吞界巨鲲在混沌神光中化作漫天清浊之气反哺天地！你伸掌轻按太初石碑，耳畔轰然响起开天辟地第一声大道神音！',
            effects: { lawExp: 240, lawId: 'chaos', items: ['yujian_hundun', 'hundun_muqi'], expPct: 0.4, attrs: { 悟性: 9, 根骨: 9, 气运: 8 }, title: '太初开天', flag: { 悟太初石碑: true } },
          },
          lose: {
            text: '巨鲲一尾扫断虚空，你拼死硬撼一记后借势掠过石碑，虽身受重创却已拓下那道开天裂痕的永恒神韵！',
            effects: { hp: -135, injury: 2, lawExp: 130, lawId: 'chaos', attrs: { 悟性: 6 } },
          },
        },
      },
      {
        label: '远观那道开天裂痕而不近巨鲲，以神魂遥聆太初余韵', hint: '敬畏洪荒 · 稳得混沌至悟',
        cost: { month: 2 },
        outcome: {
          text: '遥望裂痕两月，你心胸豁然宽广如太初苍穹，混沌法则浑然天成。',
          effects: { lawExp: 145, lawId: 'chaos', attrs: { 悟性: 7, 道心: 7 }, demon: -25 },
        },
      },
    ],
  },

  /* ========================================================================
   * 第三篇 · 红尘王朝更迭、心魔内景、天劫异象与轮回因果（58 节点）
   * 第一部：红尘众生与王朝兴衰（28 节点，pool: 'world'）
   * ======================================================================== */

  {
    id: 'wkn_mortal_1', title: '红尘 · 二百年前的一碗粥', pool: 'world', tier: 3, weight: 6, minRealm: 2,
    require: 'age >= 120',
    once: true,
    text: '路过一座早已改了国号的江畔小城，你在老字号米铺外听见一名白发老掌柜正指着梁上一方发黑的旧木牌教训孙儿：「祖上闹大饥荒时，是一位路过的青衫仙师施了一月米粥救活咱们一族！这行善的规矩，传十代也不许断！」\n\n你抬头看清旧木牌上模糊的轮廓，忽觉喉头微滞——那已是许多年前一场顺手而为的旧事。',
    choices: [
      {
        label: '不露仙迹，以凡人旅者之姿买一斗新米留下一块碎银', hint: '静观善果 · 道心与业力大进',
        outcome: {
          text: '老掌柜笑眯眯多抓了一把桂花糖塞给你。你走出巷口，耳畔仍是祖孙清脆的笑声——原来凡人寿短，却能把一份善意活得比许多修士更长久。',
          effects: { karma: 40, demon: -14, attrs: { 道心: 5, 气运: 3 }, lawExp: 30, lawId: 'karma' },
        },
      },
      {
        label: '暗中引一缕长青木灵气入铺中水井，庇佑其后人三代无病无灾', hint: '耗灵力续善缘 · 业力与寿元皆增',
        cost: { mp: 30 },
        outcome: {
          text: '井水骤然清甜如甘露。你悄然隐去身形，天道冥冥之中垂下一丝温润功德，润泽你的紫府道基。',
          effects: { karma: 55, lifespan: 15, attrs: { 道心: 4, 气运: 4 }, lawExp: 40, lawId: 'karma' },
        },
      },
    ],
  },
  {
    id: 'wkn_mortal_2', title: '红尘 · 大旱祈雨坛', pool: 'world', tier: 2, weight: 6, minRealm: 1,
    text: '中原大旱三年，千里赤地龟裂如枯骨。州府城外搭起三丈青石祈雨坛，白发老刺史脱去官袍赤脚跪在烈日下三日三夜，额头磕出血痂，身后数万百姓齐声哭求苍天降霖。',
    choices: [
      {
        label: '暗中施法引来远处云气，替黎民降下一场透雨', hint: '耗损灵力气血 · 惊天功德，声望业力暴涨',
        cost: { mp: 45, hp: 20, month: 1 },
        outcome: {
          text: '雷声滚滚，倾盆甘霖骤然洗刷焦土！数万百姓在雨中放声痛哭叩首，你收袖立于远处山头，只觉胸中一股清正浩然之气冲散所有心魔。',
          effects: { karma: 65, reputation: 50, demon: -18, attrs: { 道心: 4, 气运: 3 } },
        },
      },
      {
        label: '先去上游查清大旱的根由', hint: '战斗 · 溪涧水煞 · 治本除害',
        combat: {
          enemy: 'creek_spirit', matchRealm: 'player', displayName: '堵脉水煞',
          win: {
            text: '斩除暗中作祟的水煞，上游地下灵泉轰然复涌！不用逆天强求云雨，田渠自满，天地因果清正无损。',
            effects: { karma: 75, reputation: 60, expPct: 0.22, attrs: { 道心: 5, 悟性: 2 } },
          },
          lose: {
            text: '水煞狡猾借地势伤了你左臂，好在最终仍被你惊逃，地下泉眼缓缓复流。',
            effects: { hp: -30, karma: 40, reputation: 25 },
          },
        },
      },
      {
        label: '默然离去：「凡间旱涝自有天时，修士不宜妄动气运」', hint: '顺应自然 · 冷静克制',
        outcome: {
          text: '你合目掠过焦土，背后哭声渐渐远去。仙凡有别四字，今日念来格外沉重。',
          effects: { karma: -12, attrs: { 悟性: 2 } },
        },
      },
    ],
  },
  {
    id: 'wkn_mortal_3', title: '红尘 · 寒窗状元郎', pool: 'world', tier: 2, weight: 6, minRealm: 0,
    text: '春闱放榜之日，京城朱雀长街十里鞭炮震天。状元郎骑高头大马穿红袍游街，意气风发。人群边缘你却一眼认出——前些年雪夜冻僵在破庙里、靠你半块干粮和一丸驱寒草药捡回性命的穷书生，如今竟已高中状元。',
    choices: [
      {
        label: '在茶楼二层遥举清茶一盏，不打扰他的人间锦绣', hint: '笑看尘缘 · 涤荡心魔',
        outcome: {
          text: '状元郎似有所感，抬头望向茶楼窗口，目光在人群中寻了半晌，终究笑着整理衣冠策马前行。你饮尽杯中茶，眉宇间尽是从容。',
          effects: { demon: -10, karma: 20, attrs: { 道心: 3, 魅力: 2 } },
        },
      },
      {
        label: '趁夜留下一枚安神玉符于状元府书案，戒其莫忘寒门初心', hint: '消耗少许灵石 · 广种善因',
        cost: { stones: 50 },
        outcome: {
          text: '次日朝堂之上，新科状元第一道奏疏便是减免灾年赋税。三十年后人们传颂一代名相，唯有他书房常年供着一枚无名清玉。',
          effects: { karma: 45, attrs: { 气运: 3, 道心: 3 }, lawExp: 20, lawId: 'karma' },
        },
      },
    ],
  },
  {
    id: 'wkn_mortal_4', title: '红尘 · 荒村收徒', pool: 'world', tier: 3, weight: 6, minRealm: 1,
    text: '大雪封山的荒村村口，一个衣衫单薄的九岁孩童正拿一根枯树枝在雪地上反复画着什么。你凑近一看竟暗暗心惊——那孩子无师自通，仅凭观摩山风卷雪的走向，竟画出了半幅极粗糙的引气轨迹！他抬头望着你，眼里烧着一团不服输的火。',
    choices: [
      {
        label: '收其为记名弟子，赐下启蒙吐纳诀与护身灵草', hint: '开枝散叶 · 弟子数 +1，因果道心齐涨',
        cost: { stones: 80, month: 1 },
        outcome: {
          text: '孩童在雪地里磕了三个响头，把名字刻在你心上。你留下一卷手抄引气法与灵石安顿他双亲，嘱他十八岁若能引气入体便去仙城寻你。',
          effects: { counter: { disciples: 1 }, karma: 45, reputation: 30, attrs: { 道心: 4, 气运: 3 }, flag: { 荒村收徒: true } },
        },
      },
      {
        label: '摸摸他的头，指点三句呼吸窍门却不收作门徒', hint: '留下一线仙缘 · 随缘自化',
        outcome: {
          text: '「仙路苦寒，能否走出来看你自己造化。」你转身没入风雪，身后孩童一字不落地把那三句话念了整整十年。',
          effects: { karma: 25, attrs: { 悟性: 2, 道心: 2 } },
        },
      },
    ],
  },
  {
    id: 'wkn_mortal_5', title: '红尘 · 旧友白首', pool: 'world', tier: 3, weight: 6, minRealm: 2,
    require: 'age >= 70',
    once: true,
    text: '重返少年时曾寄宿过的山脚老镇，青石巷已塌了半截。茶铺门槛上坐着个满脸皱纹、耳朵背得厉害的干瘦老翁，手里摩挲着一只缺口陶碗。你轻唤出他的乳名，老翁浑浊的双眼呆了许久，忽然抖着手摸向你的脸——「你……你怎么一点都没老啊？」',
    choices: [
      {
        label: '坐到门槛旁剥着炒花生，陪他从午后聊到星子满天', hint: '重温旧年 · 心魔大减，道心澄澈',
        cost: { month: 1 },
        outcome: {
          text: '他唠唠叨叨说了半辈子琐事：哪年娶了媳妇、哪年发了洪水、哪年孙子考中了秀才。临走前你暗暗替他渡去一缕温润生机，愿他余生无病安眠。',
          effects: { demon: -18, karma: 35, attrs: { 道心: 6 }, lawExp: 30, lawId: 'time' },
        },
      },
      {
        label: '取出一枚疗伤丹化入粗茶递给他，替旧友调养身子', hint: '需疗伤丹或培元丹 · 留住凡间灯火',
        require: 'has("liaoshang_dan")', requireHint: '行囊中并无疗伤丹',
        cost: { item: 'liaoshang_dan' },
        outcome: {
          text: '茶水入喉，老翁原本佝偻的脊背竟舒展了不少，连夜里咳嗽的老毛病也消了。他笑着冲你挥手：「下回再来，我还能陪你喝一壶！」',
          effects: { karma: 50, demon: -15, attrs: { 道心: 5, 气运: 3 } },
        },
      },
    ],
  },
  {
    id: 'wkn_mortal_6', title: '红尘 · 盛世崩塌夜', pool: 'world', tier: 4, weight: 5, minRealm: 3,
    text: '你曾在百年前见过的那座繁华皇都，今夜化作了冲天火海。叛军撞破朱雀门，新旧王朝在血火中交替，昔日不可一世的帝王披头散发逃入枯井，而宫墙外难民如蚁群般涌向黑夜。',
    choices: [
      {
        label: '于城郊荒道撑起十里灵光避雨棚，护佑流离妇孺度过兵灾', hint: '耗灵力救苍生 · 功德无量',
        cost: { mp: 40, month: 1 },
        outcome: {
          text: '火光映红天幕，唯独城郊这一隅风平浪静。王朝倾覆非一人可挽，但这一夜你留住了三千条鲜活人命。',
          effects: { karma: 70, reputation: 55, attrs: { 道心: 5 }, lawExp: 35, lawId: 'karma' },
        },
      },
      {
        label: '潜入着火的皇家藏书阁，抢救三百年人文孤本与九州古志', hint: '承续文脉 · 悟性神识大涨',
        cost: { hp: 25 },
        outcome: {
          text: '你从烈焰中抱出三箱前朝秘志，竟在夹层里发现半卷古修绘制的九州灵脉变迁图！',
          effects: { expPct: 0.18, attrs: { 悟性: 5, 神识: 3 }, karma: 30 },
        },
      },
      {
        label: '立于九霄云端静观兴亡更迭，体悟岁月无常', hint: '以仙眼观红尘 · 光阴法则增长',
        outcome: {
          text: '三百年朱楼起，一夜青灰散。你在高空沉默良久，对光阴无情又多了几分洞彻。',
          effects: { lawExp: 45, lawId: 'time', attrs: { 道心: 3, 悟性: 2 } },
        },
      },
    ],
  },
  {
    id: 'wkn_mortal_7', title: '红尘 · 官仓硕鼠', pool: 'world', tier: 2, weight: 6, minRealm: 1,
    text: '北方大雪压塌民房，朝廷拨下的十万石赈灾粮却迟迟未发。你夜过州府官仓，神识一扫便见粮仓里堆满发霉陈米，而知府后院正灯火通明地用新米私酿美酒，甚至请了两名炼气邪修充作私兵看门。',
    choices: [
      {
        label: '夜闯知府后院斩杀贪官私兵，开仓放粮济民', hint: '战斗 · 邪修 · 除暴安良',
        combat: {
          enemy: 'rogue',
          win: {
            text: '邪修伏诛，贪官吓得尿裤跪地求饶。你一掌震碎官仓铁锁，鸣锣惊醒全城饥民。次日全州百姓皆传「青天剑仙夜开官仓」。',
            effects: { karma: 55, reputation: 50, stones: 180, attrs: { 道心: 4 } },
          },
          lose: {
            text: '私兵借府中阵盘反击，你略挂轻彩却仍烧毁贪官账册将其罪行昭告巡按。',
            effects: { hp: -28, karma: 30, reputation: 25 },
          },
        },
      },
      {
        label: '将贪官密账与私藏金银神不知鬼不觉搬去钦差行辕门前', hint: '神识检定 · 借凡法惩恶',
        roll: {
          p: 0.58, attrs: { 神识: 0.014, 悟性: 0.01 },
          success: {
            text: '三日后贪官满门抄斩、官仓大开，百姓皆赞法网恢恢，无人知晓那夜清风里曾有一道仙影掠过。',
            effects: { karma: 50, attrs: { 悟性: 3, 神识: 2 }, demon: -8 },
          },
          fail: {
            text: '钦差亦是蛇鼠一窝，竟将账册悄悄烧了！你怒不可遏，最终还是暗中截了贪官三车私粮分与乡邻。',
            effects: { karma: 35, demon: 3, attrs: { 道心: 2 } },
          },
        },
      },
    ],
  },
  {
    id: 'wkn_mortal_8', title: '红尘 · 无名石像庙', pool: 'world', tier: 3, weight: 5, minRealm: 2,
    require: 'reputation >= 80',
    once: true,
    text: '偏远山坳里多了一座简陋的青砖小庙，香火却旺得惊人。你好奇推门进去，竟被供桌上的石像震在原地——虽然匠人手艺粗糙，可那袭衣袍、那柄长剑的轮廓，分明就是当年你斩妖救村时的模样！',
    choices: [
      {
        label: '默然受下三缕纯净香火愿力，反以神识庇佑山村丰年', hint: '愿力滋养神魂 · 神识与气运大涨',
        outcome: {
          text: '纯净的百姓祈愿如暖泉汇入紫府，既无魔染又增神识。你在香炉下留下一枚聚灵小石，此后山村十里五谷丰登。',
          effects: { karma: 45, reputation: 40, attrs: { 神识: 4, 气运: 4 }, demon: -12 },
        },
      },
      {
        label: '暗中震碎石像留书劝告村民：「莫拜虚像，勤耕自强」', hint: '不贪香火因果 · 道心纯澈',
        outcome: {
          text: '香火虽甜，却最易绊住求仙脚步。你不愿受凡尘香火牵绊，飘然离去，灵台倍觉轻盈。',
          effects: { attrs: { 道心: 6 }, demon: -16, lawExp: 25, lawId: 'karma' },
        },
      },
    ],
  },
  {
    id: 'wkn_mortal_9', title: '红尘 · 边关老将辞仙丹', pool: 'world', tier: 3, weight: 5, minRealm: 2,
    text: '北疆雪原边关烽火方歇，守城四十年的老将军身中七箭仍拄枪立于城楼，大限将至。你敬他一生护境安民，暗中现身愿赠一枚续命灵丹，老将军却哈哈大笑把丹瓶推了回来。\n\n「仙师好意老夫心领了！可我手底下八千弟兄都埋在城外雪坡下，我若独自多活五十年，下去见着他们，哪有脸喝酒？」',
    choices: [
      {
        label: '肃立城楼朝老将军行修仙界最高道礼，送他最后一程', hint: '敬重凡人铁骨 · 道心剧震升华',
        outcome: {
          text: '残阳沉入大漠时，老将军含笑闭目，至死未倒。你立于北风中久久无言——有些凡人活不过百岁，脊梁却比许多千年老怪更直。',
          effects: { attrs: { 道心: 7 }, demon: -16, karma: 35, expPct: 0.16 },
        },
      },
      {
        label: '以一缕温和灵力止住他临终剧痛，并帮他把家书千里送达故乡', hint: '成全侠骨柔肠 · 业力与因果双增',
        cost: { month: 1 },
        outcome: {
          text: '老将军安详睡去，嘴角带着笑。你御剑千里将那封沾血的家书放上他妻儿门前石阶，天地清气随之入体。',
          effects: { karma: 55, attrs: { 道心: 5, 魅力: 3 }, lawExp: 30, lawId: 'karma' },
        },
      },
    ],
  },
  {
    id: 'wkn_mortal_10', title: '红尘 · 瞎眼说书人', pool: 'world', tier: 2, weight: 6, minRealm: 1,
    text: '江南码头破茶棚下，一位双目失明的白发说书人正拍响醒木，绘声绘色地讲着「青牛山脉一散修逆斩妖潮」的传奇故事——细听之下，讲的竟是你早年的经历，只不过经过几十年口口相传，你已被传成了身高九尺、三头六臂的怒目金刚。',
    choices: [
      {
        label: '笑着丢下一锭碎银听完满场，不拆穿自己的身份', hint: '游戏人间 · 心怀舒畅',
        outcome: {
          text: '老说书人抱拳致谢，讲得越发眉飞色舞。你喝着粗茶摇头失笑，原来自己在尘世早已成了一出下酒好戏。',
          effects: { demon: -10, attrs: { 道心: 3, 魅力: 2 }, reputation: 15 },
        },
      },
      {
        label: '散场后悄悄递去一丸清目灵药，治好老人的陈年眼疾', hint: '需疗伤丹或清毒解障丹 · 功德无声',
        require: 'has("jiexin_dan")', requireHint: '行囊中并无清毒解障丹',
        cost: { item: 'jiexin_dan' },
        outcome: {
          text: '三日后老人重见天日，激动得朝天连拜。他虽不知恩人是谁，却从此将每场故事的结局都改成「善有善报」。',
          effects: { karma: 50, attrs: { 气运: 4, 道心: 3 } },
        },
      },
    ],
  },
  {
    id: 'wkn_mortal_11', title: '红尘 · 山塾收顽徒', pool: 'world', tier: 3, weight: 6, minRealm: 2,
    text: '深山古村的私塾里传来朗朗书声。放学后，一名总被同窗嘲笑「傻大个」的十二岁铁匠之子独自蹲在后山搬大青石——你神识一扫却暗自吃惊：这少年天生奇异蛮骨，寻常炼体功法练三年都不及他徒手抡铁锤的根骨！',
    choices: [
      {
        label: '收作体修外门弟子，传他一套凡阶锻体搬山法', hint: '薪火相传 · 弟子数 +1，根骨业力齐涨',
        cost: { stones: 120, month: 1 },
        outcome: {
          text: '少年憨厚一笑，双膝砸在青石上响亮叩首。你教他如何借呼吸化铁石蛮力为真元，日后中州定多一员铁血体修！',
          effects: { counter: { disciples: 1 }, karma: 40, reputation: 35, attrs: { 根骨: 3, 道心: 3 }, flag: { 山塾收徒: true } },
        },
      },
      {
        label: '赠他父亲一块玄铁碎料，悄然助这孩子走好凡人武道', hint: '不强拉入仙途 · 随性自然',
        outcome: {
          text: '并非人人都适合孤寂仙途。这孩子日后成了名震一方的凡间大侠，娶妻生子安稳一生，未必比长生更差。',
          effects: { karma: 28, attrs: { 道心: 3 } },
        },
      },
    ],
  },
  {
    id: 'wkn_mortal_12', title: '红尘 · 百年古渠重修', pool: 'world', tier: 3, weight: 5, minRealm: 2,
    text: '你路过三百年前曾发过滔天大水的南江古道，只见昔日泥泞荒滩如今已化作纵横百里的沃野良田。堤坝石碑上密密麻麻刻着三代水利工匠的名字——原来没有仙人点化，凡人靠一锹一铲、父死子继，也硬生生制服了这条吞人的恶龙。',
    choices: [
      {
        label: '顺手以土系灵力加固最险要的一段老堤基，不留名姓', hint: '护民于无形 · 功德与阵道感悟',
        cost: { mp: 30 },
        outcome: {
          text: '百丈堤坝暗生玄石纹脉，足以再扛三百年洪峰。你观堤坝引水分流之巧，竟对阵道疏导灵气生出别样领悟！',
          effects: { karma: 50, lawExp: 35, lawId: 'array', attrs: { 悟性: 3, 道心: 3 } },
        },
      },
      {
        label: '在堤碑前静立半日，细读那些凡人匠师的生平铭刻', hint: '体悟愚公移山之志 · 道心大固',
        outcome: {
          text: '一世不行便三世，三世不行便十世。这份笨拙而倔强的恒心，令你对长生苦修陡然生出新的敬意。',
          effects: { attrs: { 道心: 5, 悟性: 2 }, demon: -10 },
        },
      },
    ],
  },
  {
    id: 'wkn_mortal_13', title: '红尘 · 雨夜嫁娶', pool: 'world', tier: 2, weight: 6, minRealm: 0,
    text: '秋雨绵绵的乡间小路上，一支简陋得只有四个轿夫的迎亲队伍正踩着泥水前行。新郎淋得像落汤鸡，却把唯一一把油纸伞死死遮在花轿帘缝上，嘴里还笑着喊：「快到了，灶上炖着姜汤呢！」',
    choices: [
      {
        label: '暗中运起灵力，替这支迎亲队伍遮一路风雨', hint: '成人之美 · 心情舒朗',
        outcome: {
          text: '新郎惊奇地发现落在轿顶的雨忽然稀了，一路欢呼着把新娘背进家门。你也忍不住笑出声来，眉间积郁散去大半。',
          effects: { karma: 22, demon: -10, attrs: { 魅力: 2, 气运: 2 } },
        },
      },
      {
        label: '静立路旁避雨，看着红轿晃晃悠悠消散在烟雨尽头', hint: '旁观尘缘 · 心境沉静',
        outcome: {
          text: '人间烟火最暖，却也最易逝。你转身踏入雨幕，步履比来时更稳了几分。',
          effects: { attrs: { 道心: 3 }, demon: -6 },
        },
      },
    ],
  },
  {
    id: 'wkn_mortal_14', title: '红尘 · 末代帝王陵', pool: 'world', tier: 4, weight: 5, minRealm: 3,
    text: '曾经统一中原八百年的大周皇朝早已淹没在史书里。荒草漫过皇陵神道，几名盗墓邪修正在用腐尸毒雾逼退守陵的最后一位老卒，妄图掘开地宫盗取传国龙气玉玺！',
    choices: [
      {
        label: '出手驱杀盗墓邪修，护住前朝皇陵安宁', hint: '战斗 · 怨魂 · 护陵得龙气反馈',
        combat: {
          enemy: 'ghost',
          win: {
            text: '邪修与所驱怨魂尽数灰飞烟灭！老卒老泪纵横叩谢离去，地宫深处竟溢出一缕残存的王朝龙气拂过你周身，气运大涨！',
            effects: { karma: 45, attrs: { 气运: 5, 道心: 3 }, expPct: 0.2 },
          },
          lose: {
            text: '地宫阴煞与怨魂联手逼退你半步，好在惊走了盗墓贼，皇陵主墓未遭破坏。',
            effects: { hp: -35, karma: 25 },
          },
        },
      },
      {
        label: '待邪修退散后，以神识遥感地宫兴衰龙气化散之理', hint: '观兴亡悟因果 · 因果法则精进',
        outcome: {
          text: '八百年帝业终归荒土一抔。你在断碑前枯坐一夜，因果法则悄然精进。',
          effects: { lawExp: 42, lawId: 'karma', attrs: { 悟性: 3, 道心: 3 } },
        },
      },
    ],
  },
  {
    id: 'wkn_mortal_15', title: '红尘 · 瘟疫老郎中的遗札', pool: 'world', tier: 2, weight: 6, minRealm: 1,
    text: '南岭疫病平息后的空村里，你在义庄木桌上翻到一册沾满药渍的粗糙手札。写手札的凡人老郎中没有任何修为，却硬凭尝百草试药救活了半县百姓，最后一页墨迹歪斜：「今日我也咳血了，方子已刻在门板上，来者照煎即可。」',
    choices: [
      {
        label: '将老郎中安葬于向阳山坡，亲手把他的药方抄送沿途十城医馆', hint: '传善续脉 · 丹道与业力齐进',
        cost: { month: 1 },
        outcome: {
          text: '十年后南岭再无大疫。你在整理他的凡俗草方时，竟意外从中看出两味寻常草药调和丹火的奇效！',
          effects: { karma: 60, lawExp: 35, lawId: 'pill', attrs: { 道心: 4, 悟性: 2 }, demon: -12 },
        },
      },
      {
        label: '在坟前烧一炷清香，静思凡人医者之心与修士求仙之别', hint: '以心自省 · 道心坚固',
        outcome: {
          text: '凡人以命换命，修士逆天夺命，殊途同归者唯有「不悔」二字。',
          effects: { attrs: { 道心: 5 }, demon: -10, karma: 25 },
        },
      },
    ],
  },
  {
    id: 'wkn_mortal_16', title: '红尘 · 雕木像的老匠', pool: 'world', tier: 2, weight: 6, minRealm: 1,
    text: '古镇木作铺里，一位瞎了左眼的老木匠正对着一块沉香木痴痴落刀，雕的竟是一位御剑凌风的白衣女仙。听你询问，老人笑道：「年轻时进山砍柴遇虎，就是这样一位仙人救了我。怕老了记不清她的眉眼，趁手还稳，雕下来陪着。」',
    choices: [
      {
        label: '以一丝灵力替他润泽沉香木纹，令木像百年不腐不裂', hint: '温情相助 · 魅力气运双增',
        cost: { mp: 15 },
        outcome: {
          text: '沉香木顿时泛起柔和微光，眉眼栩栩如生。老人喜极而泣，硬塞给你一块祖传的温润雷击木边角料作谢。',
          effects: { items: ['leimu'], karma: 30, attrs: { 魅力: 3, 道心: 2 } },
        },
      },
      {
        label: '坐看老人雕完最后一刀，以剑意模拟木匠落刀的笃定节奏', hint: '他山之石 · 悟性剑意精进',
        outcome: {
          text: '一刀深、一刀浅，全无半分迟疑。你从老匠人干枯的手腕里，反倒悟出一分出剑举重若轻的妙理！',
          effects: { lawExp: 30, lawId: 'sword', attrs: { 悟性: 3 } },
        },
      },
    ],
  },
  {
    id: 'wkn_mortal_17', title: '红尘 · 孤女拜师', pool: 'world', tier: 3, weight: 6, minRealm: 2,
    text: '连绵战火烧毁了边境小镇，一名浑身黑灰、手里却死死攥着半块破玉佩的十三岁孤女拦在你马前，不哭也不求饶，只直勾勾盯着你腰间长剑：「仙师，我不求荣华富贵，只求学一身能保护自己、不被人当草芥踩死的本事！」',
    choices: [
      {
        label: '测其灵根竟有几分冰水清韵，正式收入门墙悉心点化', hint: '再收佳徒 · 弟子数 +1，道心业力双进',
        cost: { stones: 150, month: 1 },
        outcome: {
          text: '孤女咬牙吞下洗脉药汤，疼得浑身发抖却没掉一滴泪。你心中暗赞此女心性坚韧，将她安顿在安稳仙城潜心筑基。',
          effects: { counter: { disciples: 1 }, karma: 50, reputation: 40, attrs: { 道心: 4, 气运: 3 }, flag: { 战火收孤女: true } },
        },
      },
      {
        label: '送她去城中清净女观安身，留足十年银钱与一道护身符', hint: '妥善安顿 · 善缘稳结',
        cost: { stones: 60 },
        outcome: {
          text: '你轻轻拭去她脸上黑灰：「先好好活着，再谈复仇与问仙。」小姑娘重重点头，牢牢记住了你的背影。',
          effects: { karma: 38, attrs: { 道心: 3 }, demon: -8 },
        },
      },
    ],
  },
  {
    id: 'wkn_mortal_18', title: '红尘 · 琴楼画师', pool: 'world', tier: 2, weight: 6, minRealm: 1,
    text: '临河秋月如水，画舫上名动京师的才女正对江挥毫，画的却不是风月仕女，而是一幅苍茫孤寂的《万里独行问道图》。画中山崖上那个背影竟与你有七分神似。',
    choices: [
      {
        label: '登舟替她在画角题下一句问道诗，赠一缕灵墨添神', hint: '风雅尘缘 · 魅力悟性皆涨',
        outcome: {
          text: '灵墨落纸，画中云雾竟如活物般缓缓流动！才女惊为天人，从此封笔不再作风月画，留名丹青史册。',
          effects: { attrs: { 魅力: 4, 悟性: 3 }, reputation: 25, demon: -8 },
        },
      },
      {
        label: '于岸边静赏明月与江舟，不扰才女清思', hint: '淡然出尘 · 心境恬淡',
        outcome: {
          text: '江风送来清雅琴声，你闭目吐纳片刻，修为竟在丝竹水声里水到渠成涨了一丝。',
          effects: { expPct: 0.12, demon: -10, attrs: { 道心: 2 } },
        },
      },
    ],
  },
  {
    id: 'wkn_mortal_19', title: '红尘 · 新朝开国宴', pool: 'world', tier: 4, weight: 5, minRealm: 3,
    text: '乱世平定，新朝开国大典设宴太和殿。那位曾经在荒野落魄时蒙你顺手搭救过的布衣英雄，如今头戴十二旒冕冠高坐龙椅。宴席过半，他悄悄避开文武百官登上城楼，朝虚空举杯长揖：「昔年一饭一剑之恩，不敢或忘！愿以国库半数珍藏奉仙师！」',
    choices: [
      {
        label: '踏风现身碰杯共饮，婉辞金银，只嘱其善待天下苍生', hint: '仙凡相敬 · 功德声望暴涨',
        outcome: {
          text: '新帝郑重起誓，次日大赦天下、轻徭薄赋，开启三百年盛世。人间紫气遥遥反哺，你的气运与道心齐齐攀升！',
          effects: { karma: 75, reputation: 70, attrs: { 气运: 5, 道心: 5 }, demon: -15 },
        },
      },
      {
        label: '取走国库中两件凡人无用的上古灵材，换赐新朝百年风调雨顺阵', hint: '各取所需 · 获灵材与阵道感悟',
        cost: { mp: 45 },
        outcome: {
          text: '皇帝大喜过望，亲手奉上宫中珍藏的玄铁与千年灵草，而你随手布下的润土小阵保了京畿百年丰稔。',
          effects: { items: ['xuantie', 'qiannian_lingcao'], lawExp: 38, lawId: 'array', karma: 40 },
        },
      },
    ],
  },
  {
    id: 'wkn_mortal_20', title: '红尘 · 荒原送葬队', pool: 'world', tier: 2, weight: 6, minRealm: 1,
    text: '北风卷着纸钱漫天飞舞。官道上一支送葬队伍被一伙凶狠山贼拦住，连死者的薄皮棺材都要被掀翻搜刮陪葬铜钱，孝子拼死扑在棺材上挨了数记闷棍。',
    choices: [
      {
        label: '弹指震飞山贼刀斧，护送这户人家安然下葬', hint: '举手之劳 · 业力道心皆增',
        outcome: {
          text: '山贼见你是飞天遁地的仙师吓得连滚带爬逃走。孝子满脸血污却不敢抬头，只重重磕了九个响头。',
          effects: { karma: 35, reputation: 20, attrs: { 道心: 3 }, demon: -6 },
        },
      },
      {
        label: '顺藤摸瓜端掉这伙勾结邪修的山贼老巢', hint: '战斗 · 劫道散修 · 彻底除患',
        combat: {
          enemy: 'bandit',
          win: {
            text: '山贼头目与幕后散修尽数伏诛，你把搜出的银钱还给沿途受害村民，自己留下几块灵石作路费。',
            effects: { stones: 160, karma: 50, reputation: 35, expPct: 0.16 },
          },
          lose: {
            text: '山寨机关阴险，你受了点皮外伤才杀出重围，好在贼窝已被彻底烧毁。',
            effects: { hp: -25, karma: 30 },
          },
        },
      },
    ],
  },
  {
    id: 'wkn_mortal_21', title: '红尘 · 弟子来信', pool: 'world', tier: 4, weight: 6, minRealm: 3,
    require: 'counter("disciples") >= 1',
    text: '一只略显笨拙的传信灵鹤摇摇晃晃落到你洞府石案上，爪下绑着一封写得工工整整的宣纸家书——是你早年随手点化收下的凡间弟子寄来的！信里说他已历尽艰辛筑基成功，在故乡开了一座小医馆兼授蒙童识字，末行附了一小包故乡晒干的新野茶。',
    choices: [
      {
        label: '泡一壶他寄来的粗野新茶，回寄一瓶聚灵丹与几页修行批注', hint: '师徒情深 · 涤心增业力，获因果感悟',
        cost: { stones: 100 },
        outcome: {
          text: '粗茶虽不及仙茶甘醇，入口却满是山野阳光的暖意。原来长生路上最慰人心者，莫过于薪火不灭、后继有人。',
          effects: { karma: 55, demon: -20, attrs: { 道心: 5, 气运: 4 }, lawExp: 38, lawId: 'karma' },
        },
      },
      {
        label: '欣慰饮茶，顺手替弟子推演一卦吉凶平安', hint: '以道护徒 · 神识悟性提升',
        outcome: {
          text: '卦象清泰平安。你笑着把信收入贴身玉匣，只觉长生之路再不似昔年那般孤寒。',
          effects: { demon: -14, attrs: { 道心: 4, 神识: 3 }, karma: 30 },
        },
      },
    ],
  },
  {
    id: 'wkn_mortal_22', title: '红尘 · 枯井童谣', pool: 'world', tier: 3, weight: 5, minRealm: 2,
    text: '傍晚走过一座荒废五十年的旧城，残墙下几个放牛娃拍手唱着一首古怪童谣，唱的是「白衣剑客斩魔龙，血染西河水不红」。你停步细听，竟是一段已被修仙界遗忘的旧年正邪血战，而凡人孩童的歌声成了唯一的墓碑。',
    choices: [
      {
        label: '循着童谣寻到西河旧战场，为无名死难修士重立青碑', hint: '慰藉英魂 · 得残余古剑意',
        cost: { month: 1 },
        outcome: {
          text: '荒泥之下果真埋着数十柄断剑。你焚香立碑之际，泥中一缕不灭浩然剑意冲天而起，向你躬身致意后汇入你识海！',
          effects: { karma: 50, lawExp: 45, lawId: 'sword', attrs: { 道心: 4 }, demon: -12 },
        },
      },
      {
        label: '分给放牛娃一包甜枣，听他们把整首童谣唱完', hint: '珍惜尘世记忆 · 悟性道心小进',
        outcome: {
          text: '晚霞把破墙染得通红。青史常由胜者书写，唯有乡野童谣还留着一点真话。',
          effects: { attrs: { 道心: 3, 悟性: 2 }, demon: -8 },
        },
      },
    ],
  },
  {
    id: 'wkn_mortal_23', title: '红尘 · 千年老城换新颜', pool: 'world', tier: 4, weight: 5, minRealm: 4,
    require: 'age >= 200',
    once: true,
    text: '距你上一次踏足这座中州大城，已过去了整整一百五十载。当年繁华的朱雀桥已塌成河底乱石，城门换了三茬铁匾，连口音都变得陌生。唯独城北那棵老银杏树又粗了一围，树下卖糖人的摊子，依然围满笑闹的稚童。',
    choices: [
      {
        label: '买一支糖人靠在银杏树下，静静体会沧海桑田', hint: '以长生眼观红尘 · 光阴法则大悟',
        outcome: {
          text: '糖丝甜得发腻，和一百五十年前一模一样。皇朝会灭、仙宗会衰，唯有这生生不息的人间烟火永不熄灭。你刹那明悟，光阴法则骤进！',
          effects: { lawExp: 75, lawId: 'time', demon: -22, attrs: { 道心: 6, 悟性: 5 }, lifespan: 25 },
        },
      },
      {
        label: '寻访当年银杏树下那户茶农的后人，暗赐一门养生吐纳法', hint: '绵延善缘 · 业力气运齐涨',
        outcome: {
          text: '当年茶农的第五代孙如今开了间小书铺。你借买书之名留下一册手抄《吐纳养生诀》，飘然远去。',
          effects: { karma: 65, attrs: { 气运: 5, 道心: 4 }, lawExp: 45, lawId: 'karma' },
        },
      },
    ],
  },
  {
    id: 'wkn_mortal_24', title: '红尘 · 渡口老船夫', pool: 'world', tier: 2, weight: 6, minRealm: 0,
    text: '大雾锁江，渡口只剩一位披蓑衣的老船夫守着孤舟。你上船后他并不问你去哪，只慢悠悠摇橹笑道：「客官步子轻得不沾泥，定是山上修仙的老爷。小的摇了一辈子船，渡过状元，渡过逃犯，今儿总算渡了一回神仙！」',
    choices: [
      {
        label: '解下随身灵茶与他分饮，一路闲聊大江水势', hint: '平易近人 · 悟性道心小进',
        outcome: {
          text: '老船夫指点江中暗礁旋涡如数家珍：「水猛的时候硬顶会翻船，顺着浪尖借力一撑就过去了。」你听得心中一动，竟从中悟出几分斗法卸力之妙！',
          effects: { attrs: { 悟性: 3, 道心: 2 }, expPct: 0.12, karma: 15 },
        },
      },
      {
        label: '下船时悄悄把灵石换成的十两足色雪花银留在船头', hint: '厚赏船资 · 积善成德',
        cost: { stones: 15 },
        outcome: {
          text: '老船夫发现白银时你早已隐入江雾。这十两银子够他安稳养老，不必再冒寒风摆渡。',
          effects: { karma: 28, attrs: { 气运: 2 } },
        },
      },
    ],
  },
  {
    id: 'wkn_mortal_25', title: '红尘 · 妖祸屠镇前夕', pool: 'world', tier: 3, weight: 5, minRealm: 2,
    text: '血月当空，山脚一座三千户的凡人集镇已进入梦乡，而镇外密林里正潜伏着一头化形吸血妖蝠，眼看便要冲入镇中大开杀戒！镇里并无一名修士驻守。',
    choices: [
      {
        label: '截杀于密林之外，不让妖血沾污集镇半寸瓦片', hint: '战斗 · 嗜血蝠妖 · 守护三千生灵',
        combat: {
          enemy: 'blood_bat', displayName: '吸血妖蝠',
          win: {
            text: '剑光无声斩落蝠妖，整场恶战未曾惊醒镇中一名睡梦里的婴孩。清晨鸡鸣响起，炊烟袅袅升空，你收剑拂衣而去。',
            effects: { karma: 65, reputation: 45, expPct: 0.22, attrs: { 道心: 4, 气运: 3 } },
          },
          lose: {
            text: '蝠妖声波震伤你的耳膜，好在你拼死将其重创驱入深山，三千镇民毫发无损。',
            effects: { hp: -42, karma: 45, attrs: { 道心: 3 } },
          },
        },
      },
      {
        label: '凌空布下一道辟邪警钟阵惊退妖蝠，保全自身', hint: '阵法御敌 · 稳妥护镇',
        cost: { mp: 30 },
        outcome: {
          text: '金光钟影骤然亮彻镇空，蝠妖忌惮高人坐镇尖啸遁逃。你虽未斩草除根，亦保了一镇今夜平安。',
          effects: { karma: 35, lawExp: 25, lawId: 'array' },
        },
      },
    ],
  },
  {
    id: 'wkn_mortal_26', title: '红尘 · 盲童听剑', pool: 'world', tier: 3, weight: 6, minRealm: 2,
    text: '破落道观廊下，一名天生双目失明的十岁孩童正仰着头，专注倾听风吹檐角铁马的叮当声。你走过时他忽然准确指着你腰间佩剑轻声问：「大哥哥，你的剑为什么在轻轻唱歌呀？它是不是想去很远的地方？」\n\n你心头猛震——这孩子虽无肉眼，天生神识却澄澈得堪比筑基修士！',
    choices: [
      {
        label: '收作关门心传弟子，教他以神识代目、以心听剑', hint: '慧眼识珠 · 弟子数 +1，神识剑道双涨',
        cost: { stones: 160, month: 1 },
        outcome: {
          text: '盲童郑重拜师。你教他闭目听风辨位之法，不出七日他竟能听声接住飘落的松针！从此世间多了一位奇才心剑弟子。',
          effects: { counter: { disciples: 1 }, karma: 55, lawExp: 35, lawId: 'sword', attrs: { 神识: 4, 道心: 4 }, flag: { 收盲童为徒: true } },
        },
      },
      {
        label: '赠他一枚养神灵丹温养其天生灵觉，嘱道观老道好生照拂', hint: '温和护苗 · 功德无量',
        cost: { stones: 80 },
        outcome: {
          text: '老道含泪拜谢，盲童对着你的方向深深一揖，此后终生未曾忘却那阵如水清越的剑鸣。',
          effects: { karma: 40, attrs: { 神识: 3, 气运: 3 } },
        },
      },
    ],
  },
  {
    id: 'wkn_mortal_27', title: '红尘 · 亡国公主的铜镜', pool: 'world', tier: 3, weight: 5, minRealm: 2,
    text: '荒野驿馆的冷雨夜里，一名衣衫破旧却气度端雅的年轻女子拿出祖传的古铜宝镜，恳请你替她暗杀篡位弑父的新朝权臣。你一眼认出那面古铜镜竟是一件蒙尘的玄阶法器——清明照妖镜！',
    choices: [
      {
        label: '不替她行刺，先借铜镜去照一照那权臣的底细', hint: '以神识察真相 · 除妖得清明照妖镜',
        roll: {
          p: 0.56, attrs: { 神识: 0.014, 道心: 0.01 },
          success: {
            text: '铜镜照出权臣皮囊下竟是一头窃国鬼妖！你一剑诛妖还朝堂清明，公主含泪将祖传宝镜相赠后飘然入道隐居。',
            effects: { items: ['qingming_jing'], karma: 60, reputation: 45, attrs: { 神识: 3, 道心: 3 } },
          },
          fail: {
            text: '妖邪察觉铜镜威压提前遁走，虽未斩绝后患，却也保住了女子性命。她把仅剩的盘缠塞给你作谢。',
            effects: { karma: 35, attrs: { 道心: 2 }, stones: 240 },
          },
        },
      },
      {
        label: '婉拒插手凡俗帝王仇杀，只护送她平安离开追兵追杀', hint: '守仙凡戒律 · 稳健善举',
        outcome: {
          text: '你击退几名追兵送她登舟南下。王朝恩怨终归尘土，活下来才是最要紧的事。',
          effects: { karma: 30, attrs: { 道心: 4 }, demon: -8 },
        },
      },
    ],
  },
  {
    id: 'wkn_mortal_28', title: '红尘 · 除夕万家灯', pool: 'world', tier: 4, weight: 5, minRealm: 3,
    text: '大雪除夕，你御剑掠过九州千山万壑。脚下无论边塞孤村还是中原大城，家家户户皆贴上红纸桃符、燃起守岁炭火，爆竹声与孩童嬉笑穿破寒夜升上云端。你在高空独行百年，忽然觉出一丝说不清的恍惚。',
    choices: [
      {
        label: '降落于一座寻常小镇酒肆，买一盘热饺子陪掌柜守岁到天明', hint: '身入红尘 · 彻底涤净孤寒心魔',
        cost: { stones: 20 },
        outcome: {
          text: '热腾腾的饺子下肚，掌柜一家拉着你聊了一整夜来年收成。子时钟声敲响，你推门步入初雪，道心前所未有地温润圆融。',
          effects: { demon: -24, attrs: { 道心: 6, 魅力: 3 }, expPct: 0.18, karma: 25 },
        },
      },
      {
        label: '立于万丈云巅静看千里人间灯火如星河铺地', hint: '以天地为怀 · 气运悟性大涨',
        outcome: {
          text: '「人间虽小，却也是大道一隅。」你俯瞰万家灯火长吟一句，胸中格局骤然开阔，星辰与因果二道隐隐共鸣。',
          effects: { lawExp: 45, lawId: 'karma', attrs: { 道心: 5, 悟性: 4 }, demon: -16 },
        },
      },
    ],
  },

  /* ========================================================================
   * 第二部：心魔幻境与道心叩问（18 节点，pool: 'inner'）
   * ======================================================================== */

  {
    id: 'wkn_demon_1', title: '心魔 · 归家幻灶', pool: 'inner', tier: 2, weight: 6, minRealm: 1,
    text: '入定深处，冷寂的石室忽然变成了你记忆里最温暖的旧屋。灶膛里柴火噼啪作响，桌上热腾腾摆着你最爱吃的三碟小菜，门帘一掀，故去多年的亲人笑着喊你回来吃饭，仿佛这些年修仙的苦寒只是一场噩梦。',
    choices: [
      {
        label: '含笑坐下吃完这顿幻境热饭，随后起身亲手推开幻门', hint: '道心检定 · 念旧而不沉沦',
        roll: {
          p: 0.56, attrs: { 道心: 0.015, 神识: 0.01 },
          success: {
            text: '「菜很香，可我的路还没走完。」你放下碗筷，屋舍化作漫天温柔金粉散去。睁眼时眼角微湿，道心却坚如磐石。',
            effects: { demon: -16, attrs: { 道心: 5 }, expPct: 0.14 },
          },
          fail: {
            text: '你在温暖幻境里流连了太久，醒来时炉火早已冰凉，心口空落落生出一丝心魔裂隙。',
            effects: { demon: 8, attrs: { 道心: 1 } },
          },
        },
      },
      {
        label: '一剑劈碎温情幻象：「死去之人岂会复生，休得惑我！」', hint: '果决斩妄 · 根骨与魔念并存',
        outcome: {
          text: '幻影尖啸碎裂，露出背后心魔狰狞的笑脸。你斩断了幻境，胸口却莫名冷了三分。',
          effects: { demon: -8, attrs: { 根骨: 2, 道心: 2 } },
        },
      },
    ],
  },
  {
    id: 'wkn_demon_2', title: '心魔 · 捷径耳语', pool: 'inner', tier: 3, weight: 6, minRealm: 2,
    require: 'demon >= 8',
    text: '闭关苦修毫无寸进的第七夜，识海暗角响起一个酷似你自己、却格外慵懒诱人的声音：「何必如此愚笨？你只需将那几座灵脉下的凡人精气暗中抽走一成，明日便可破境，神不知鬼不觉。」',
    choices: [
      {
        label: '斥退魔音，以自身心火将其逼出识海正面斩灭', hint: '战斗 · 心魔 · 彻底净化识海',
        combat: {
          enemy: 'heart_demon',
          win: {
            text: '心魔虚影惨嚎溃散，识海骤然亮如白昼！经此一战，那些潜伏已久的急躁念头尽数焚清。',
            effects: { demon: -24, attrs: { 道心: 5, 神识: 3 }, expPct: 0.18 },
          },
          lose: {
            text: '心魔趁虚占据半刻神智，醒来时你满手冷汗、灵力紊乱，需费力重新平复气海。',
            effects: { hp: -40, demon: 10 },
          },
        },
      },
      {
        label: '顺着魔音的思路反推其魔功破绽，化诡道为己用', hint: '危险参悟 · 悟性与修为涨，心魔大增',
        outcome: {
          text: '你没有动手抽人精气，却从那缕阴狠运功法门里窥见一丝极速炼灵之巧，修为陡进，心底亦种下一粒暗影。',
          effects: { expPct: 0.24, demon: 14, attrs: { 悟性: 4 } },
        },
      },
      {
        label: '服下一枚清心丹或默诵静心诀，任其自生自灭', hint: '清净守心 · 稳降心魔',
        outcome: {
          text: '魔音絮叨了整夜，见你始终不动如山，终究无趣地沉回暗影深处。',
          effects: { demon: -12, attrs: { 道心: 3 } },
        },
      },
    ],
  },
  {
    id: 'wkn_demon_3', title: '心魔 · 枯骨长廊', pool: 'inner', tier: 3, weight: 5, minRealm: 2,
    text: '识海梦境忽化一条望不到尽头的漆黑长廊。两侧站满昔日死在你剑下的妖兽、邪修、劫匪与争宝对手，他们无声地抬起残破手臂，齐齐指向你：「你我皆是求生之人，凭什么活下来的是你？」',
    choices: [
      {
        label: '昂首穿过长廊：「既入修途、拔剑相向，生死各安天命！」', hint: '坦荡直面 · 杀伐道心大定',
        outcome: {
          text: '你步履沉稳走过每一具亡影，既不炫耀亦不忏悔。长廊尽头大门轰开，所有枯骨化作清风散去。',
          effects: { demon: -15, attrs: { 道心: 5, 根骨: 2 }, lawExp: 25, lawId: 'blood' },
        },
      },
      {
        label: '驻足长廊中央，为其中误伤或无辜之魂默念往生咒', hint: '心存悲悯 · 业力与因果感悟齐涨',
        outcome: {
          text: '人群中几道怨念最深的黑影忽然松开执念，化作淡淡白烟消散。你的灵台亦随之温润清明。',
          effects: { demon: -18, karma: 30, attrs: { 道心: 4 }, lawExp: 30, lawId: 'karma' },
        },
      },
    ],
  },
  {
    id: 'wkn_demon_4', title: '心魔 · 窃寿之问', pool: 'inner', tier: 3, weight: 5, minRealm: 2,
    text: '深夜照水自省，你看见镜面里的自己容颜不老，而水面四周却浮出成百上千张迅速苍老死去的凡人面孔。一道冷酷念头刺入脑海：修士吞吐天地灵气，动辄活上千载，是不是本身就在窃取这方天地的生机？',
    choices: [
      {
        label: '「逆天争命本是万物本能，唯当成道后反哺天地！」', hint: '立宏大道誓 · 道心与业力大增',
        outcome: {
          text: '水面涟漪骤平，浮现出万里青山绿水之象。你心中大愿既定，天地灵气仿佛也对你亲近三分。',
          effects: { demon: -16, karma: 35, attrs: { 道心: 5, 气运: 3 }, expPct: 0.15 },
        },
      },
      {
        label: '「天地不仁，弱肉强食，何谈窃与不窃？」', hint: '冷峻独行 · 悟性与攻击气势涨',
        outcome: {
          text: '你甩袖震散水面倒影。修仙本就是争渡，多余的愧疚只会拖慢拔剑的速度。',
          effects: { attrs: { 悟性: 3, 根骨: 3 }, demon: 6 },
        },
      },
    ],
  },
  {
    id: 'wkn_demon_5', title: '心魔 · 双影分身', pool: 'inner', tier: 4, weight: 5, minRealm: 3,
    text: '神魂出窍内视紫府，你骤然发现蒲团上坐着两个一模一样的自己——左边的你眉目澄静、手捧清莲；右边的你唇角带血、双目赤红，正笑吟吟招手：「别装圣人了，你心里最想做的那些事，我替你全干了如何？」',
    choices: [
      {
        label: '引两道身影合二为一：「善念是我，恶念亦是我，俱受本心统御！」', hint: '道心与悟性检定 · 统合阴影，大破魔障',
        roll: {
          p: 0.54, attrs: { 道心: 0.015, 悟性: 0.014 },
          success: {
            text: '红白双影剧烈震颤后彻底融入你的本体！从此你不再畏惧心底幽暗，反倒将其炼作无坚不摧的魄力！',
            effects: { demon: -28, attrs: { 道心: 7, 神识: 4 }, expPct: 0.24, flag: { 统合心影: true } },
          },
          fail: {
            text: '恶念趁融合瞬间反扑识海，震得你灵台剧痛、魔念大涨，好在勉强压住未曾失控。',
            effects: { hp: -45, demon: 12, attrs: { 悟性: 2 } },
          },
        },
      },
      {
        label: '拔出神识之剑，亲手斩杀右侧赤目恶影', hint: '战斗 · 心魔 · 斩邪存正',
        combat: {
          enemy: 'heart_demon', displayName: '赤目恶影',
          win: {
            text: '恶影在清光中灰飞烟灭，神魂通体澄净无瑕！虽少了几分狠辣，道心却纯粹得如同冰晶。',
            effects: { demon: -26, karma: 30, attrs: { 道心: 6 }, expPct: 0.2 },
          },
          lose: {
            text: '恶影竟比你预想的更熟悉你的招式，反将你压制在识海角落苦战一夜才散去。',
            effects: { hp: -55, demon: 10 },
          },
        },
      },
    ],
  },
  {
    id: 'wkn_demon_6', title: '心魔 · 无尽独行路', pool: 'inner', tier: 3, weight: 5, minRealm: 3,
    require: 'age >= 100',
    text: '一场长关醒来，你梦见自己走在一片无边无际的白雪荒原上，回头看去，身后所有熟悉的人——师长、挚友、劲敌、凡间故交——全都化作一个个模糊的小黑点被甩在风雪里，越走越冷，越走越空。',
    choices: [
      {
        label: '在雪地里停下脚步，把每一位故人的名字默念一遍再继续前行', hint: '铭记羁绊 · 破除孤寒魔障',
        outcome: {
          text: '每念出一个名字，荒原便亮起一盏不灭的小灯。风雪未停，你心里却暖了起来。',
          effects: { demon: -18, attrs: { 道心: 5, 魅力: 3 } },
        },
      },
      {
        label: '转身把身后脚印尽数抹去：「大道独行，原该如此」', hint: '绝情求道 · 悟性与修为增进',
        outcome: {
          text: '白雪迅速覆盖了一切旧迹。心冷下来以后，吐纳灵气的速度竟真的快了几分。',
          effects: { expPct: 0.22, attrs: { 悟性: 4 }, demon: 6 },
        },
      },
    ],
  },
  {
    id: 'wkn_demon_7', title: '心魔 · 虚假飞升门', pool: 'inner', tier: 4, weight: 5, minRealm: 4,
    text: '化神入定时，漫天金云突然在识海铺开，仙乐袅袅，一座宏伟南天门轰然降临！门内数名仙官含笑招手：「{name}，你功德已满，不必再历千载苦劫，快随我等即刻飞升享受永生！」',
    choices: [
      {
        label: '冷笑一声直视仙官空洞眼眶：「连雷劫都未至，何来天门？」', hint: '神识检定 · 识破幻魔骗局',
        roll: {
          p: 0.56, attrs: { 神识: 0.015, 道心: 0.014 },
          success: {
            text: '金门瞬间腐朽化作漆黑魔口！你一指洞穿幻象核心，不仅逼退高阶心魔，更收获了一缕破妄神识！',
            effects: { demon: -24, attrs: { 神识: 6, 道心: 5 }, breakBonus: 10 },
          },
          fail: {
            text: '仙乐迷人心智，你迈出半步才猛然惊醒抽腿，险些被魔口吞去半缕元神！',
            effects: { hp: -55, demon: 10, attrs: { 神识: 2 } },
          },
        },
      },
      {
        label: '将计就计步入假门，于幻境最深处反杀设局的幻界心魔尊', hint: '战斗 · 幻界心魔尊 · 以险破妄',
        combat: {
          enemy: 'mirror_demon',
          win: {
            text: '假仙官撕下画皮现出狰狞心魔尊真身，却反被你蓄势已久的一击斩碎！识海从此百幻不侵！',
            effects: { demon: -35, expPct: 0.3, attrs: { 道心: 7, 神识: 5 }, breakBonus: 14 },
          },
          lose: {
            text: '幻界重重险些将你彻底困死，你拼死自爆一缕分魂才惊醒过来，大汗湿透重衣。',
            effects: { hp: -80, injury: 1, demon: 12 },
          },
        },
      },
    ],
  },
  {
    id: 'wkn_demon_8', title: '心魔 · 昔年遗憾镜', pool: 'inner', tier: 3, weight: 6, minRealm: 1,
    text: '打坐间隙，洞府墙面悄然浮出一面水银般的古镜。镜中映出的不是现在的你，而是你生平最遗憾的一次退缩或错失——倘若当年你多迈出那一步、多说那句话，结局会不会截然不同？',
    choices: [
      {
        label: '凝视镜中旧憾片刻，随后平静挥袖拂散水银镜面', hint: '接纳不完美 · 道心稳固',
        outcome: {
          text: '「没有当年那次跌倒，便没有今日站在这里的我。」镜面寸寸化作清辉融入识海。',
          effects: { demon: -14, attrs: { 道心: 4, 悟性: 2 } },
        },
      },
      {
        label: '伸手探入镜中，在幻梦里重写一次昔日结局', hint: '沉溺一瞬 · 悟性微涨，心魔暗生',
        outcome: {
          text: '你在镜梦里圆满了一桩心结，可退出来面对冰冷石壁时，那份失落反倒比从前更深了半分。',
          effects: { demon: 8, attrs: { 悟性: 3, 魅力: 2 } },
        },
      },
    ],
  },
  {
    id: 'wkn_demon_9', title: '心魔 · 贪念宝山', pool: 'inner', tier: 3, weight: 5, minRealm: 2,
    text: '神魂入梦，眼前堆起一座直插云霄的仙宝高山——无数仙器、神丹、太古功法唾手可得，唯独山脚刻着一行血字：「拿走你想要的，代价是忘掉你为什么修仙。」',
    choices: [
      {
        label: '大笑转身背山而行，一粒灵石也不曾多看', hint: '破除贪障 · 气运道心俱增',
        outcome: {
          text: '你走出三步，身后宝山轰然崩塌化作一堆森白枯骨。幸而本心未迷，一缕澄澈气运落上肩头。',
          effects: { demon: -16, attrs: { 道心: 5, 气运: 3 } },
        },
      },
      {
        label: '试探性抓起山脚半卷残破秘诀，看清贪欲究竟何物', hint: '以魔试心 · 修为微涨，心魔滋生',
        outcome: {
          text: '秘诀刚入手便化作毒蛇咬了你一口，疼得你立刻惊醒。虽得了一点偏门灵感，道心却染上燥气。',
          effects: { hp: -25, demon: 10, expPct: 0.14, attrs: { 悟性: 2 } },
        },
      },
    ],
  },
  {
    id: 'wkn_demon_10', title: '心魔 · 灵根之怨', pool: 'inner', tier: 3, weight: 5, minRealm: 1,
    text: '识海深处刮起阴冷酸风，一个尖刻声音不断质问你：「看看那些天灵根、混沌体，闭眼都能一日千里！你拼死拼活才摸到门槛，老天本就不公，何不干脆堕入魔道把天骄们的灵根活剥过来？」',
    choices: [
      {
        label: '稳稳按住丹田：「资质决定起点，心性才决定谁能走到终点！」', hint: '道心检定 · 彻底粉碎嫉妒心魔',
        roll: {
          p: 0.58, attrs: { 道心: 0.015, 悟性: 0.01 },
          success: {
            text: '酸风骤歇，丹田灵气前所未有地温顺服帖！你纵声长笑，从此再不羡他人天资。',
            effects: { demon: -18, attrs: { 道心: 5, 根骨: 2 }, expPct: 0.15 },
          },
          fail: {
            text: '话虽掷地有声，心底那丝不甘仍旧刺痛了灵台，好在并未铸成大错。',
            effects: { demon: 5, attrs: { 道心: 2 } },
          },
        },
      },
      {
        label: '以不甘为柴薪，燃起更烈的好胜斗志催动周天苦修', hint: '化怨为力 · 修为大进，微生燥气',
        cost: { month: 1 },
        outcome: {
          text: '你不肯输给天命，咬牙连冲三百周天！修为暴涨一截，双眸却隐隐多了一丝执拗寒光。',
          effects: { expPct: 0.24, demon: 7, attrs: { 根骨: 3 } },
        },
      },
    ],
  },
  {
    id: 'wkn_demon_11', title: '心魔 · 寿尽枯骨梦', pool: 'inner', tier: 4, weight: 5, minRealm: 3,
    text: '噩梦如潮涌来：你梦见自己卡在大境瓶颈整整千年，寿元耗尽，发齿俱落，只能蜷缩在阴暗洞府里听着洞外年轻修士意气风发的笑声，眼睁睁看着自己化作一捧无人问津的灰土。',
    choices: [
      {
        label: '于梦中枯坐坦然闭目：「朝闻道，夕死可矣，怕死便别问长生！」', hint: '参破生死怖 · 寿元道心双收',
        outcome: {
          text: '当你不再恐惧死亡的那一刻，梦中枯骨竟然生出满树春花！醒来后神清气爽，连寿元都隐隐绵长几载。',
          effects: { demon: -20, lifespan: 15, attrs: { 道心: 6 }, breakBonus: 8 },
        },
      },
      {
        label: '猛然惊醒抓起丹药拼命打坐，将惧死之迫化作苦修动力', hint: '急流勇进 · 修为大涨，微增心魔',
        cost: { month: 1 },
        outcome: {
          text: '你一夜未眠狂吸灵气，修为精进显著，只是眼底挥之不去那抹紧迫焦躁。',
          effects: { expPct: 0.24, demon: 8, attrs: { 悟性: 2 } },
        },
      },
    ],
  },
  {
    id: 'wkn_demon_12', title: '心魔 · 众生蝼蚁念', pool: 'inner', tier: 4, weight: 5, minRealm: 4,
    text: '踏入化神之后，你俯瞰山河，忽觉下方城池里的百万凡人乃至低阶修士，竟脆弱渺小得宛如脚边蚁群。一股居高临下、漠视一切生灵的冰冷傲慢悄然爬上你的眉心。',
    choices: [
      {
        label: '猛击灵台自警：「我亦曾是从泥土里爬出来的凡人！」', hint: '守住本心温度 · 涤荡傲慢魔障',
        outcome: {
          text: '冰冷傲慢如春雪消融。强者最易失者非力量，乃敬畏。你深深吐气，道心重归温厚澄明。',
          effects: { demon: -22, karma: 35, attrs: { 道心: 6, 魅力: 3 } },
        },
      },
      {
        label: '顺着这份超然冷漠体悟「天地不仁」的太上忘情之意', hint: '太上冷道 · 悟性与神识大进',
        outcome: {
          text: '褪去七情六欲的牵绊，你看世界的目光陡然变得锋利通透，只是眉宇间多了一层难近的寒霜。',
          effects: { attrs: { 悟性: 6, 神识: 5 }, demon: 8, expPct: 0.2 },
        },
      },
    ],
  },
  {
    id: 'wkn_demon_13', title: '心魔 · 墨莲蚀识海', pool: 'inner', tier: 4, weight: 5, minRealm: 4,
    require: 'demon >= 20',
    text: '因过往杀伐或执念积郁过深，你紫府灵湖中央竟悄无声息绽放出一朵十二瓣漆黑墨莲！墨莲根须扎入元神深处，每摇曳一次便令你战意狂涨，同时缓缓吞噬你的清明理智！',
    choices: [
      {
        label: '引体内全部正气灵力强行连根拔除墨莲，迎战反扑心魔', hint: '战斗 · 心魔 · 彻底根治魔患',
        combat: {
          enemy: 'heart_demon',
          win: {
            text: '漆黑根须寸寸断裂，墨莲在烈阳般道火中烧作青烟！紫府灵湖恢复清澈见底，修为不退反进！',
            effects: { demon: -35, attrs: { 道心: 7, 神识: 4 }, expPct: 0.22 },
          },
          lose: {
            text: '墨莲根须反缠元神令你痛不欲生，只能先斩去三片花瓣暂缓魔蚀。',
            effects: { hp: -65, demon: -10, injury: 1 },
          },
        },
      },
      {
        label: '不毁墨莲，反以大毅力将其镇压化作护道魔莲', hint: '道心与根骨检定 · 以魔养道，极险',
        roll: {
          p: 0.48, attrs: { 道心: 0.015, 根骨: 0.014 },
          success: {
            text: '墨莲边缘竟镶上一层金边，化作善恶共生的阴阳奇莲！你非但未入魔，战力与法则悟性齐齐跃升！',
            effects: { demon: -15, expPct: 0.3, lawExp: 65, lawId: 'chaos', attrs: { 根骨: 5, 悟性: 5 } },
          },
          fail: {
            text: '反噬来得猝不及防，墨莲疯长两瓣，你双目赤红吐出一口黑血方才压住躁动。',
            effects: { hp: -60, demon: 15 },
          },
        },
      },
    ],
  },
  {
    id: 'wkn_demon_14', title: '心魔 · 傀儡天地疑', pool: 'inner', tier: 5, weight: 5, minRealm: 5,
    text: '炼虚极深处，一个毛骨悚然的怀疑击中了你的元神：倘若整座九州、所有宗门秘境乃至你一路拼死挣来的机缘，不过是上界某位无上存在随手养在玉瓶里的棋局与药田，那你数百年的挣扎还有什么意义？',
    choices: [
      {
        label: '「纵是玉瓶中之鱼，我也要撞碎玉瓶、跃进九天真海！」', hint: '狂骨破妄 · 道心与破境大涨',
        outcome: {
          text: '话音落下，识海虚空竟轰然发出琉璃碎裂般的清响！一切虚无怀疑灰飞烟灭，你周身绽放出令天道侧目的锋芒！',
          effects: { demon: -26, breakBonus: 14, attrs: { 道心: 8, 气运: 4 }, expPct: 0.24 },
        },
      },
      {
        label: '顺着怀疑冷静审视天地法则缝隙，探寻下界真实边界', hint: '悟性与神识检定 · 洞穿虚实',
        roll: {
          p: 0.54, attrs: { 悟性: 0.015, 神识: 0.015 },
          success: {
            text: '你摒弃恐慌，以冷静神识剖开天地法则纹理，竟真的摸清了界壁最薄弱的玄妙规律！',
            effects: { lawExp: 80, lawId: 'space', attrs: { 神识: 6, 悟性: 6 }, demon: -14 },
          },
          fail: {
            text: '思虑过深反坠虚无迷雾，足足半月才重新找回呼吸的踏实感。',
            effects: { demon: 10, attrs: { 悟性: 2 } },
          },
        },
      },
    ],
  },
  {
    id: 'wkn_demon_15', title: '心魔 · 故人反目幻', pool: 'inner', tier: 4, weight: 5, minRealm: 4,
    text: '迷雾笼罩的识海高台上，所有与你并肩过的红尘挚友竟齐齐拔剑指向你的胸口，神色冰冷地说：「交出你的大道机缘与长生果，修仙界哪有什么真心，不过是各取所需罢了！」',
    choices: [
      {
        label: '放下兵器坦然一笑：「真故人不会这般眼神，假魔影休想离间我心！」', hint: '信任破魔 · 涤荡猜忌阴霾',
        outcome: {
          text: '幻影手中的剑光瞬间崩解作漫天萤火。修仙路虽多险诈，可那些雪夜温茶、绝境背靠的瞬间，魔头伪造不出来。',
          effects: { demon: -22, attrs: { 道心: 6, 魅力: 4 } },
        },
      },
      {
        label: '冷冷按上剑柄：「纵使举世皆敌，我亦可一剑独行！」', hint: '孤勇破幻 · 根骨剑意齐涨',
        outcome: {
          text: '孤绝剑气横扫高台，将满台幻影斩得一干二净。你破了魔幻，眉目却比往日更添三分凌厉。',
          effects: { demon: -10, lawExp: 45, lawId: 'sword', attrs: { 根骨: 4, 道心: 3 } },
        },
      },
    ],
  },
  {
    id: 'wkn_demon_16', title: '心魔 · 无字自省壁', pool: 'inner', tier: 4, weight: 5, minRealm: 3,
    text: '闭关百日，你以神识在洞府内景立起一面光洁无瑕的青玉壁，准备将此生所犯过错、所负之人、所贪之念一笔笔诚实写上去——落笔之时，竟发现比斩杀十头元婴妖兽还要沉重百倍。',
    choices: [
      {
        label: '咬牙诚实写满整面玉壁，不替自己辩解半句', hint: '剖心自省 · 大减心魔，道心厚重',
        cost: { month: 1 },
        outcome: {
          text: '写完最后一笔时，整面玉壁骤然绽放温润清光，字迹尽消。敢于直视自己污点的人，心魔便再无把柄可握。',
          effects: { demon: -28, attrs: { 道心: 7, 悟性: 3 }, karma: 20 },
        },
      },
      {
        label: '只写下三桩最难忘的教训，余者随风翻篇', hint: '张弛有度 · 轻松涤心',
        outcome: {
          text: '过分苛责自己亦会成执念。你记牢底线，轻装继续前行。',
          effects: { demon: -16, attrs: { 道心: 4, 悟性: 2 } },
        },
      },
    ],
  },
  {
    id: 'wkn_demon_17', title: '心魔 · 嗜血杀心涌', pool: 'inner', tier: 5, weight: 5, minRealm: 5,
    text: '数百年斗法搏杀积累的森然煞气，今夜终于在你闭关炼气时轰然反噬！你眼前所见一切草木山石皆化作猩红血色，掌心真元不受控制地想要撕裂眼前所有活物！',
    choices: [
      {
        label: '以冰雪清心诀强锁紫府三日三夜，硬生生熬尽煞火', hint: '道心检定 · 熬煞成钢',
        cost: { hp: 50, month: 1 },
        roll: {
          p: 0.55, attrs: { 道心: 0.015, 根骨: 0.012 },
          success: {
            text: '三日后煞火褪尽，余下的一缕纯白杀意如臂使指，出招既狠且静，再无半分狂躁失控！',
            effects: { demon: -28, attrs: { 道心: 7, 根骨: 4 }, lawExp: 55, lawId: 'blood' },
          },
          fail: {
            text: '煞火烧毁了洞府半面石壁，你耗尽灵力才勉强镇住狂性，心口余悸未消。',
            effects: { hp: -45, demon: 8 },
          },
        },
      },
      {
        label: '出洞直奔无人荒山妖窟，痛痛快快斩杀凶煞魔物泄去杀意', hint: '以战泄煞 · 战斗 · 魔将',
        combat: {
          enemy: 'demon_king',
          win: {
            text: '一场酣畅淋漓的死战将积郁煞气倾泻一空！恶妖伏诛，你归洞时胸怀澄澈如洗。',
            effects: { demon: -24, expPct: 0.28, karma: 40, attrs: { 根骨: 5 } },
          },
          lose: {
            text: '妖王凶焰滔天，你在血战中反而被剧痛唤回清明，抽身退回洞府调养。',
            effects: { hp: -75, demon: -12, injury: 1 },
          },
        },
      },
    ],
  },
  {
    id: 'wkn_demon_18', title: '心魔 · 万劫心魔皇临', pool: 'inner', tier: 6, weight: 4, minRealm: 7,
    once: true,
    text: '冲关前夕，整片识海骤然熄灭所有光明！一尊凝聚了古今所有渡劫败亡者绝望、怨恨与恐惧的万劫心魔皇降临紫府，冷笑震颤元神：「无数惊才绝艳之辈都死在最后一步，你凭什么觉得自己能活？」',
    choices: [
      {
        label: '燃尽毕生道心之火，于识海绝巅正面死战万劫心魔皇', hint: '终极心魔之战 · 万劫心魔皇 · 破则百魔不侵',
        combat: {
          enemy: 'karmic_demon_lord', displayName: '万劫心魔皇',
          win: {
            text: '万劫心魔皇在澄澈如日的道心神光中彻底灰飞烟灭！你紫府生出不灭金辉，此后渡劫再无心魔敢近半步！',
            effects: { demon: -100, breakBonus: 30, expPct: 0.35, attrs: { 道心: 12, 神识: 8 }, title: '万劫不磨', flag: { 斩万劫魔皇: true } },
          },
          lose: {
            text: '万古怨潮几乎淹没你的元神，最后关头你凭借一生羁绊与执念强撑到黎明驱散魔皇，虽伤重却也熬过最凶险的一劫！',
            effects: { hp: -120, injury: 2, demon: -20, attrs: { 道心: 6 } },
          },
        },
      },
      {
        label: '服下冰心雪莲丹，以清心道韵稳固紫府，徐徐炼化魔皇', hint: '需冰心雪莲丹 · 智化大劫',
        require: 'has("bingxin_dan")', requireHint: '行囊中并无冰心雪莲丹',
        cost: { item: 'bingxin_dan', month: 2 },
        outcome: {
          text: '冰心寒意锁住紫府灵台，你以两月静功将魔皇怨念层层抽丝剥茧炼作精纯神识！',
          effects: { demon: -60, breakBonus: 20, attrs: { 道心: 9, 神识: 7 }, flag: { 斩万劫魔皇: true } },
        },
      },
    ],
  },

  /* ========================================================================
   * 第三部：天劫前兆与上界秘闻（12 节点，minRealm: 4）
   * ======================================================================== */

  {
    id: 'wkn_trib_1', title: '天象 · 坠落残仙旨', pool: 'world', tier: 5, weight: 5, minRealm: 4,
    once: true,
    text: '白日惊雷响彻九州，一道燃烧着残余淡金仙焰的焦黑玉帛撕裂云层坠入荒谷！你抢先赶到时，玉帛上只剩半行模糊的上界仙篆：「……下界灵潮已熟，乙丑年遣巡使收……」余字被某种狂暴剑气生生抹去。',
    choices: [
      {
        label: '以神识强行还原残旨背后的上界气息与文字奥秘', hint: '神识检定 · 窥探上界仙律，得法则残片',
        roll: {
          p: 0.54, attrs: { 神识: 0.015, 悟性: 0.012 },
          success: {
            text: '残旨虽已枯竭，字缝里却留着一缕上界雷霆与星辰交织的仙律残纹！你将其拓入识海，对飞升之后的世界多了几分清醒警惕。',
            effects: { items: ['faze_canpian'], lawExp: 75, lawId: 'thunder', attrs: { 神识: 5, 悟性: 4 }, flag: { 见残仙旨: true } },
          },
          fail: {
            text: '仙旨余威震得你眉心刺痛渗血，玉帛随即自燃成灰，只记下那句令人心寒的「灵潮已熟」。',
            effects: { hp: -55, attrs: { 道心: 3 }, flag: { 见残仙旨: true } },
          },
        },
      },
      {
        label: '以真火彻底焚毁这份傲慢仙旨，将灰烬扬入罡风', hint: '不屈天威 · 道心暴涨',
        outcome: {
          text: '玉帛燃尽时苍穹隐隐传来一声闷雷警告，你却仰首冷笑——九州苍生不是谁的庄稼！',
          effects: { attrs: { 道心: 7 }, demon: -16, reputation: 50, flag: { 见残仙旨: true } },
        },
      },
    ],
  },
  {
    id: 'wkn_trib_2', title: '天象 · 三尸初显之善尸', pool: 'inner', tier: 5, weight: 5, minRealm: 5,
    once: true,
    text: '入定极深时，你泥丸宫中竟悄然浮出一道身披白袍、面容慈悲与你一模一样的虚影——那是太古大能口中的「善尸」！它合掌轻叹：「你救人太多、怜悯太重，带着这些沉重慈悲，怎能轻身登仙？」',
    choices: [
      {
        label: '「慈悲并非累赘，而是我异于无情仙官的脊梁——斩去执拗，留其本心！」', hint: '悟性与道心检定 · 善尸明悟',
        cost: { month: 2 },
        roll: {
          p: 0.54, attrs: { 道心: 0.015, 悟性: 0.014 },
          success: {
            text: '白袍善尸含笑化作一道纯净清光沉入你紫府灵台！你不仅初窥斩三尸妙门，破境劫数亦轻三分！',
            effects: { expPct: 0.3, lawExp: 90, lawId: 'karma', karma: 60, breakBonus: 16, attrs: { 道心: 7, 悟性: 5 }, flag: { 见善尸: true } },
          },
          fail: {
            text: '善尸执念难断，与你争辩整月方才缓缓散去，虽未彻底斩落却也令你道心通透不少。',
            effects: { demon: -15, attrs: { 道心: 4 }, flag: { 见善尸: true } },
          },
        },
      },
      {
        label: '暂不强斩善尸，先以神识与之对坐论道一月', hint: '温和参悟 · 延寿降魔',
        cost: { month: 1 },
        outcome: {
          text: '与自身最柔软的那一面平静对话，令你卸下百年疲惫，寿元与道心俱增。',
          effects: { lifespan: 30, demon: -20, attrs: { 道心: 5 }, flag: { 见善尸: true } },
        },
      },
    ],
  },
  {
    id: 'wkn_trib_3', title: '天象 · 三尸初显之恶尸', pool: 'inner', tier: 5, weight: 5, minRealm: 6,
    once: true,
    text: '闭关第七月，丹田杀机骤爆，一道身披玄甲、眉目冷戾的赤瞳虚影破体而出——正是潜藏识海深处的「恶尸」！它手握你最惯用的兵器，森然大笑：「斩我？没有我的狠绝与贪婪，你早死在炼气期荒野里了！」',
    choices: [
      {
        label: '以神魂迎战恶尸化身，用绝对实力令其臣服归鞘', hint: '战斗 · 心魔 · 伏魔证恶尸',
        combat: {
          enemy: 'heart_demon', displayName: '恶尸',
          win: {
            text: '玄甲恶尸轰然单膝叩地，化作一缕凌厉无双的玄金战意归入气海！从此杀伐由心、暴戾不侵！',
            effects: { expPct: 0.32, lawExp: 100, lawId: 'blood', demon: -25, breakBonus: 16, attrs: { 根骨: 7, 道心: 6 }, flag: { 伏恶尸: true } },
          },
          lose: {
            text: '恶尸攻势狠辣至极，震伤你的神魂后冷笑隐回暗处，只留一句「再练百年再来斩我」。',
            effects: { hp: -85, demon: 10, attrs: { 根骨: 3 } },
          },
        },
      },
      {
        label: '坦然承认为求生所行的一切锋芒，借浩然清气将其徐徐收束', hint: '以德御戾 · 稳妥降魔',
        cost: { month: 2 },
        outcome: {
          text: '恶尸见你并不虚伪推诿，冷哼一声敛去杀焰重归识海深处，你的道心愈发沉雄。',
          effects: { demon: -16, attrs: { 道心: 6, 根骨: 3 }, flag: { 伏恶尸: true } },
        },
      },
    ],
  },
  {
    id: 'wkn_trib_4', title: '天象 · 三尸终现之执念尸', pool: 'inner', tier: 6, weight: 4, minRealm: 7,
    once: true,
    text: '大乘之巅，天地俱静。你的识海中央悄然站立着第三道无面虚影——「执念尸」。它既不慈悲亦不凶戾，只握着你对长生、胜负、故人、天道的全部执着，低声问你：「倘若飞升需要彻底忘却尘世一切，你还走不走？」',
    choices: [
      {
        label: '「我带执念而生，亦带执念登仙！谁言仙人必得无心无念？」', hint: '道心检定 · 破三尸旧律，自辟大道',
        cost: { month: 2 },
        roll: {
          p: 0.54, attrs: { 道心: 0.016, 悟性: 0.015 },
          success: {
            text: '无面虚影缓缓浮出你自己的笑颜，向你深躬一礼化作鸿蒙紫气融入元神！三尸大关轰然贯通，渡劫成算暴增！',
            effects: { expPct: 0.36, breakBonus: 26, demon: -35, lawExp: 130, lawId: 'chaos', attrs: { 道心: 10, 悟性: 8 }, title: '自在道君', flag: { 破执念尸: true } },
          },
          fail: {
            text: '执念翻涌如潮几乎动摇紫府，你紧咬牙关守住灵台两月，终究将其安抚平息，亦获莫大裨益。',
            effects: { hp: -85, breakBonus: 12, attrs: { 道心: 5 }, flag: { 破执念尸: true } },
          },
        },
      },
      {
        label: '亲手斩落过往一切牵挂虚影，轻身化作纯粹无垢太上仙胎', hint: '太上忘情 · 极速破境',
        cost: { month: 2 },
        outcome: {
          text: '过往悲欢如蝉蜕剥落。你睁开双眼，眸光澄澈冷冽如九天星河，距离真仙之境仅余一步之遥！',
          effects: { expPct: 0.4, breakBonus: 24, demon: -40, attrs: { 悟性: 9, 神识: 8 }, flag: { 斩执念尸: true } },
        },
      },
    ],
  },
  {
    id: 'wkn_trib_5', title: '秘闻 · 九劫散仙的告诫', pool: 'world', tier: 5, weight: 5, minRealm: 5,
    once: true,
    text: '荒山破亭里坐着一名浑身缠绕破碎雷纹的独眼老者，看似行将就木，周身气息却令方圆十里空间微微塌陷——那是一位飞升失败、被迫转修散仙的绝世老怪！见你停步，他扔来一坛焦糊雷酒：「小娃娃，离渡劫还有几步？陪老夫喝一杯，我告诉你天门背后真正的死穴。」',
    choices: [
      {
        label: '席地敬酒，虚心请教渡劫与应对南天门裁决者的秘诀', hint: '耗时一月 · 破境成算与雷霆感悟大涨',
        cost: { month: 1 },
        outcome: {
          text: '老散仙详述九重紫霄雷劫的换气间隔，以及天门裁决者雷甲背后三寸旧伤：「记住，别光顾着挨劈，雷劫最怕敢拿剑往劫云眼里捅的疯子！」言罢赠你一枚天劫丹方心得。',
          effects: { breakBonus: 22, lawExp: 85, lawId: 'thunder', attrs: { 悟性: 6, 道心: 5 }, flag: { 闻散仙秘诀: true } },
        },
      },
      {
        label: '请这位九劫散仙递出一剑，亲身感受仙劫层次的恐怖威压', hint: '巅峰切磋 · 坠世散仙 · 惊天收获',
        combat: {
          enemy: 'fallen_immortal',
          win: {
            text: '老散仙大笑收剑，眼中爆出久违的炽热：「哈哈哈！连老夫九劫残剑都接得住，天门拦不住你！」他将私藏千年的渡劫仙丹抛入你怀！',
            effects: { items: ['tianjie_dan', 'faze_canpian'], expPct: 0.36, breakBonus: 28, reputation: 150, flag: { 胜九劫散仙: true } },
          },
          lose: {
            text: '散仙一剑几乎劈碎你的肉身，老头却及时收劲抛来疗伤仙药：「活下来了！记住这股疼，渡劫时才不会腿软！」',
            effects: { hp: -110, injury: 2, items: ['dahuan_dan'], breakBonus: 18, attrs: { 根骨: 5 } },
          },
        },
      },
    ],
  },
  {
    id: 'wkn_trib_6', title: '天象 · 苍穹血蚀', pool: 'world', tier: 5, weight: 5, minRealm: 4,
    text: '正午烈日毫无征兆地被一圈暗红日环吞噬，整片九州陷入诡异昏红。群山妖兽惶恐伏地，各大仙门护山大阵同时亮起警戒金光——天机阁急讯传遍天下：界壁薄弱处出现百年一遇的「血蚀天隙」，域外法则碎片正如流星雨般坠落！',
    choices: [
      {
        label: '御空直冲云霄，于血蚀罡风中截夺坠落的域外法则残片', hint: '根骨与气运检定 · 夺罕世奇珍',
        cost: { hp: 45 },
        roll: {
          p: 0.55, attrs: { 根骨: 0.014, 气运: 0.014 },
          success: {
            text: '你冒着裂空罡风凌空一抓，竟硬生生截下一块炽热的域外法则残片与数粒太古星辰砂！',
            effects: { items: ['faze_canpian', 'xingchen_sha'], expPct: 0.24, attrs: { 气运: 4 } },
          },
          fail: {
            text: '罡风割裂衣袍，残片擦指飞入深海，唯留一缕混乱空间气息助你小悟。',
            effects: { hp: -40, lawExp: 45, lawId: 'space' },
          },
        },
      },
      {
        label: '静立孤峰观察血蚀异象与天地灵潮起伏，推演大劫将至之兆', hint: '稳妥观天 · 星辰与神识双进',
        outcome: {
          text: '昏红天幕持续半个时辰方散。你已看清天穹裂纹的规律，对日后渡劫天象胸有成竹。',
          effects: { lawExp: 65, lawId: 'star', attrs: { 神识: 5, 悟性: 4 }, breakBonus: 10 },
        },
      },
    ],
  },
  {
    id: 'wkn_trib_7', title: '秘闻 · 渡劫前辈交易会', pool: 'world', tier: 5, weight: 5, minRealm: 5,
    text: '你收到一枚隐秘玉简邀请，抵达昆仑雪巅一处无名雾亭。亭中已坐着四位气息渊深如海、皆披斗篷的合体与大乘老怪——他们都是临近天劫、隐世不出的老前辈，在此秘密交换各自压箱底的保命秘宝与上界情报。',
    choices: [
      {
        label: '以三千灵石或珍材换取一卷上界护道秘符与劫雷弱点图录', hint: '需 3000 灵石 · 满载而归',
        require: 'stones >= 3000', requireHint: '灵石不足三千',
        cost: { stones: 3000 },
        outcome: {
          text: '一位黑袍大乘老怪收下灵石，递给你一道古仙遗留的九霄神雷符与一份手绘雷劫阵图：「祝道友早日掀翻南天门！」',
          effects: { items: ['jiuxiao_leifu'], breakBonus: 20, lawExp: 70, lawId: 'thunder', attrs: { 悟性: 4 } },
        },
      },
      {
        label: '不买重宝，只以自己参悟的一段大道心得换取诸位前辈的渡劫秘闻', hint: '以道易道 · 零花销大涨见识',
        cost: { month: 1 },
        outcome: {
          text: '五位绝巅修士围炉夜话，交换了彼此对上界仙庭、界海魔渊与斩三尸的独门见解，令你省却数百年摸索！',
          effects: { expPct: 0.25, breakBonus: 14, attrs: { 悟性: 6, 神识: 5, 道心: 4 } },
        },
      },
    ],
  },
  {
    id: 'wkn_trib_8', title: '天象 · 断柱天河倒挂', pool: 'wild', tier: 5, weight: 5, minRealm: 5,
    text: '极北冰原夜空突然撕开一道银白裂口，汹涌的九天银河之水竟然倒挂垂落三千丈！水幕之中隐约浮现出一根刻满仙文却从中断裂的擎天玉柱——传闻那是上古大能撑天时折断的一截旧柱。',
    choices: [
      {
        label: '顶着倒挂天河重压飞近断柱，拓印仙柱上残留的太古大道铭文', hint: '根骨与神识检定 · 获混沌星辰大悟',
        cost: { hp: 65, month: 1 },
        roll: {
          p: 0.54, attrs: { 根骨: 0.015, 神识: 0.014 },
          success: {
            text: '天河仙水冲刷肉身带来剧痛却洗尽凡垢！你成功记下柱身半篇太古仙铭，连带捞起一枚珍贵的太虚炼神丹！',
            effects: { items: ['lianxu_dan'], lawExp: 110, lawId: 'chaos', attrs: { 根骨: 6, 神识: 5 }, expPct: 0.28 },
          },
          fail: {
            text: '仙河水压重逾万钧将你震退冰原，虽未靠近玉柱，洗礼过肉身的几滴仙水仍令你寿元大涨！',
            effects: { hp: -55, lifespan: 35, lawExp: 55, lawId: 'star' },
          },
        },
      },
      {
        label: '立于冰原以玉瓶收集坠落的天河清露，不冒粉身之险', hint: '稳妥获宝 · 延寿增修为',
        outcome: {
          text: '三滴九天银河清露入腹，顿觉灵海如大江奔涌、神清气朗。',
          effects: { expPct: 0.22, lifespan: 30, mpPct: 1, attrs: { 神识: 4 } },
        },
      },
    ],
  },
  {
    id: 'wkn_trib_9', title: '秘闻 · 上界巡使截道', pool: 'wild', tier: 5, weight: 5, minRealm: 5,
    text: '你刚出秘境，头顶云层便降下一道冷漠银光！一名身披银甲、手持天律锁链的上界巡查使俯瞰于你，声音不带一丝情感：「下界修士{name}，你体内法则浓度已越下界限额。自封三成修为随我听候上界发落，或——就地格杀！」',
    choices: [
      {
        label: '拔剑直指苍穹：「我的修为乃百年血汗挣来，凭你也配收缴？」', hint: '死战 · 上界巡查使 · 逆天扬威',
        combat: {
          enemy: 'heaven_envoy',
          win: {
            text: '银甲碎裂，天律锁链被你一击震断！巡查使满脸难以置信地化作金光溃散。你收起他掉落的太虚秘宝与法则残片，仰天大笑！',
            effects: { items: ['faze_canpian', 'xukong_jing'], expPct: 0.36, reputation: 160, attrs: { 道心: 8, 根骨: 5 }, title: '逆律斩使' },
          },
          lose: {
            text: '上界仙律威压如山倾覆，你拼死燃烧底牌撕开虚空遁走千里，虽重伤吐血却更加看清上界嘴脸！',
            effects: { hp: -100, injury: 2, attrs: { 道心: 6 }, breakBonus: 10 },
          },
        },
      },
      {
        label: '施展空间与隐息秘术制造假死脱身，暂避上界耳目', hint: '神识与气运检定 · 智遁保身',
        roll: {
          p: 0.56, attrs: { 神识: 0.015, 气运: 0.014 },
          success: {
            text: '你留下一具气机逼真的灵力化身自爆，真身悄然潜入地脉万里之外！巡查使冷哼一声以为你已形神俱灭，拂袖返回云端。',
            effects: { escape: 2, lawExp: 70, lawId: 'space', attrs: { 神识: 5, 气运: 4 } },
          },
          fail: {
            text: '假身被仙眸一眼识破，你硬挨一记天律雷鞭才勉强遁入荒海保住性命。',
            effects: { hp: -75, injury: 1, attrs: { 神识: 3 } },
          },
        },
      },
    ],
  },
  {
    id: 'wkn_trib_10', title: '天象 · 紫气东来三万里', pool: 'inner', tier: 5, weight: 5, minRealm: 6,
    once: true,
    text: '闭关百日后的黎明，你推开洞府石门，竟见东方天际铺开三万里绵延不绝的鸿蒙紫气！紫气并非无主飘荡，而是隐隐朝你所在山峰缓缓倾泻，群山灵鹤齐鸣盘旋——此乃大境将近、天道初认之祥瑞！',
    choices: [
      {
        label: '立于绝巅大袖迎风，鲸吞三万里鸿蒙紫气淬炼混元法身', hint: '千载难逢 · 修为与突破成算暴涨',
        cost: { month: 2 },
        outcome: {
          text: '紫气如瀑布倒灌紫府，你周身骨骼透出淡金玉光，气血法力瞬间充盈至圆满极境！',
          effects: { expPct: 0.4, breakBonus: 22, hpPct: 1, mpPct: 1, attrs: { 气运: 7, 根骨: 6, 悟性: 6 }, flag: { 紫气东来: true } },
        },
      },
      {
        label: '只取三成鸿蒙紫气自用，余下七成散入方圆千里山川滋养苍生', hint: '广施天恩 · 功德无量，因果道心大成',
        outcome: {
          text: '千里荒山瞬间枯木抽芽、凡人百病皆消！冥冥之中亿万生灵的生机愿力反哺而来，令你的渡劫业障尽数冰消！',
          effects: { karma: 120, demon: -35, breakBonus: 20, lawExp: 110, lawId: 'karma', attrs: { 道心: 9, 气运: 8 }, flag: { 紫气散苍生: true } },
        },
      },
    ],
  },
  {
    id: 'wkn_trib_11', title: '天象 · 飞升前夜了尘债', pool: 'world', tier: 6, weight: 4, minRealm: 7,
    once: true,
    text: '九霄劫云已在你头顶万里之外隐隐汇聚，飞升之日近在咫尺。临行前夜，你独步重游当年初入仙途的青牛山脚与落霞长街——石阶上的青苔换了十茬，而你心中那些沉甸甸的恩怨旧债，也该做最后一次了断。',
    choices: [
      {
        label: '于青牛山巅留下自己半生修行手札与三座护村灵阵，惠及后世散修', hint: '功德圆满 · 突破成算与声望登极',
        cost: { stones: 1000, month: 1 },
        outcome: {
          text: '「后来者若见此石，莫怕出身微寒，大道从来不绝行路之人。」石碑立成之刻，万里劫云竟微微退散三成威压！',
          effects: { karma: 110, reputation: 160, breakBonus: 26, demon: -30, attrs: { 道心: 9, 气运: 7 }, title: '九州传灯', flag: { 青牛留碑: true } },
        },
      },
      {
        label: '立于落霞城外孤松下独饮三杯清酒：敬故土、敬故人、敬自己', hint: '无愧此生 · 灵台无瑕，心魔尽散',
        outcome: {
          text: '三杯酒尽，你掷杯大笑，转身御虹直冲九霄！身后再无一丝拖泥带水之憾！',
          effects: { demon: -40, breakBonus: 24, expPct: 0.3, attrs: { 道心: 10, 魅力: 6 }, flag: { 三杯别红尘: true } },
        },
      },
    ],
  },
  {
    id: 'wkn_trib_12', title: '天象 · 天门倒影照人间', pool: 'inner', tier: 6, weight: 4, minRealm: 7,
    once: true,
    text: '雷雨将至前的极静深夜，九州所有江河湖海同时如镜面般静止，水中清晰倒映出一座巍峨冷峻、缠绕紫雷的九霄南天门！门缝微开半寸，漏出一缕古老而陌生的真仙灵气，同时也传出一尊仙将冷漠的巡查神念。',
    choices: [
      {
        label: '主动放出自身极巅神念与天门仙将隔空一撞，试探真仙界深浅', hint: '神识与道心检定 · 惊动仙界，大悟登仙道',
        roll: {
          p: 0.54, attrs: { 神识: 0.016, 道心: 0.015 },
          success: {
            text: '两股神念在九霄之外无声炸响！那尊南天门仙将竟微微一滞，似对下界竟有如此人物生出忌惮。你趁机汲取一缕泄漏的太古仙气，距离真仙又近一步！',
            effects: { items: ['xianling_dan'], expPct: 0.38, breakBonus: 28, lawExp: 140, lawId: 'chaos', attrs: { 神识: 9, 道心: 8 }, title: '隔界问仙', flag: { 隔界撞仙念: true } },
          },
          fail: {
            text: '真仙神念重如星河倾泻，震得你神魂剧震咳血，却也彻底看清了南天门外第一道关卡的底细！',
            effects: { hp: -110, breakBonus: 20, attrs: { 神识: 6, 道心: 5 }, flag: { 隔界撞仙念: true } },
          },
        },
      },
      {
        label: '静静汲取那一缕散逸水面的真仙清气润养肉身元神，蓄势待发', hint: '稳步蓄锋 · 得渡劫玄黄丹韵与寿元',
        cost: { month: 2 },
        outcome: {
          text: '一缕真仙灵气入体胜过下界十年苦修！你不动声色敛尽锋芒，静候亲手叩开天门之日。',
          effects: { expPct: 0.35, breakBonus: 22, lifespan: 80, hpPct: 1, mpPct: 1, attrs: { 根骨: 7, 悟性: 7 }, flag: { 汲真仙气: true } },
        },
      },
    ],
  },
];
