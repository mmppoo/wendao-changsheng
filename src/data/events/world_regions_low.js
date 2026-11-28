/**
 * 九州下中四域风物奇遇录（ink 风格多段织网叙事）：
 * 覆盖青牛山脉（qingniu）、落霞仙城（luoxia）、苍茫妖森（yaosen）、东海归墟（guixu）四域。
 * 共计 180 个独立节点（每域 45 节点，含三条多段分支链与三十四段独立山海奇遇）。
 */
export const WORLD_REGIONS_LOW = [
  /* ============================================================================
   * 一、青牛山脉（qingniu · 炼气至金丹 · 45 节点）
   * ============================================================================ */

  /* ---------- 链一：古将荒冢（4 段） ---------- */
  {
    id: 'wrl_qn_tomb_1',
    title: '青牛 · 荒原断碑',
    region: 'qingniu',
    pool: 'wild',
    tier: 2,
    weight: 4,
    minRealm: 0,
    maxRealm: 2,
    once: true,
    text: '秋雨初霁，青牛山西麓一处塌陷的黄土坡下露出半截青铜戟尖。泥水中歪斜着一方无字石碣，碑侧压着几枝被山民插下的枯艾草。\n\n你俯身细看，断戟虽已生满铜绿，戟刃却仍透出一股久经沙场的金铁煞气，令腰间灵器隐隐作响。土坡裂缝深处，传来极淡的松脂与旧甲气味。',
    choices: [
      {
        label: '拔出青铜断戟，顺裂隙掘开墓道',
        hint: '根骨检定 · 探查凡朝古将荒冢',
        cost: { month: 1 },
        roll: {
          p: 0.6,
          attrs: { 根骨: 0.014, 气运: 0.01 },
          success: {
            text: '你运足气力起出断戟，土石轰然坠落，现出一条仅容一人弯腰通过的青砖甬道。壁上长明油灯早已干涸，却隐约留着昔年军阵刻痕。',
            effects: { exp: 55, flag: { 青牛古冢掘道: true } },
            goto: 'wrl_qn_tomb_2',
          },
          fail: {
            text: '断戟刚动，坡顶碎石便哗啦啦砸了下来，震得你虎口发麻。待尘埃落定，裂隙已被新泥封死大半，你只得另寻偏门钻入墓中。',
            effects: { hp: -18, exp: 35 },
            goto: 'wrl_qn_tomb_2',
          },
        },
      },
      {
        label: '绕土坡三匝，以神识寻前人盗洞',
        hint: '神识检定 · 避开正门流沙机关',
        roll: {
          p: 0.58,
          attrs: { 神识: 0.015, 悟性: 0.008 },
          success: {
            text: '神识掠过荆棘丛，果真在老槐树根下发现一处被藤蔓遮掩的狭口。洞壁光滑，显是早年曾有散修来过，却仓皇退走。',
            effects: { attrs: { 神识: 1 }, flag: { 青牛古冢盗洞: true } },
            goto: 'wrl_qn_tomb_2',
          },
          fail: {
            text: '荒草深处反惊起一群阴山骨鸦，尖啸着朝你面门扑来，非得先清了这群畜生不可。',
            combat: {
              enemy: 'bone_crow',
              win: {
                text: '剑光扫落数片黑羽，骨鸦群四散惊逃。你顺着鸦群筑巢的石缝，也摸到了通往古冢的耳室。',
                effects: { stones: 25, exp: 40 },
                goto: 'wrl_qn_tomb_2',
              },
              lose: {
                text: '鸦群啄得你衣袖破碎，只得退回山道喘息，荒冢入口转瞬又没入山雾。',
                effects: { hp: -22, injury: 1 },
              },
            },
          },
        },
      },
      {
        label: '焚三炷清香，掩土还礼后离去',
        hint: '敬畏古魂 · 积攒善业与道心',
        outcome: {
          text: '你取山间干草拭去断戟泥污，复又覆上一层新土。清风穿林而过，似有一声极轻的甲胄叩谢之音散在暮色里。',
          effects: { karma: 10, attrs: { 道心: 1 }, exp: 45 },
        },
      },
    ],
  },
  {
    id: 'wrl_qn_tomb_2',
    title: '青牛 · 兵俑残廊',
    region: 'qingniu',
    pool: 'branch',
    tier: 2,
    weight: 0,
    minRealm: 0,
    maxRealm: 2,
    text: (s) => `甬道尽头豁然开朗，乃是一座以青条石砌就的前殿。${s.flags['青牛古冢盗洞'] ? '耳室墙角遗落着一只破损药囊，显是先前闯入者慌忙逃命时丢下的。' : '正门石阶上积满厚灰，几支断箭斜插在梁柱之间，箭羽早已腐朽。'}\n\n殿中列着十二尊半人高的陶土兵俑，唯独居中那尊披铁甲的校尉俑眼眶里渗着微弱青火，拦在通往主棺室的石门前。`,
    choices: [
      {
        label: '循军阵缺口踏步穿行，不惊煞气',
        hint: '悟性检定 · 识破凡朝八门阵势',
        roll: {
          p: 0.52,
          attrs: { 悟性: 0.016, 神识: 0.01 },
          success: {
            text: '你默念古阵生门方位，足尖连点七步，竟从陶俑刀戈缝隙间安然穿过。那校尉俑眼眶青火微微一晃，复归沉寂。',
            effects: { lawExp: 8, lawId: 'array', exp: 65, flag: { 青牛破阵入室: true } },
            goto: 'wrl_qn_tomb_3',
          },
          fail: {
            text: '错踏死门半寸，铁甲校尉俑骤然挺枪刺来，阴冷煞气化作溪涧水煞般的怨灵扑面而至！',
            combat: {
              enemy: 'creek_spirit',
              win: {
                text: '你震碎校尉俑胸口聚阴铜镜，殿内阴风顿时一散，石门缓缓向内敞开。',
                effects: { stones: 40, items: ['chiyang_shi'] },
                goto: 'wrl_qn_tomb_3',
              },
              lose: {
                text: '阴煞透体，你连退数步撞开后墙裂口，狼狈逃出荒冢。',
                effects: { hp: -28, injury: 1 },
              },
            },
          },
        },
      },
      {
        label: '先以赤阳炎石火气驱散阴煞，再破石门',
        hint: '消耗赤阳炎石 · 稳妥破邪',
        cost: { item: 'chiyang_shi' },
        outcome: {
          text: '赤阳炎石一掷而出，炽热火光映红整座残廊。陶俑身上积蓄百年的阴晦之气滋滋作响，顷刻化作青烟，石门机括随之松动。',
          effects: { exp: 80, karma: 6, flag: { 青牛火破古冢: true } },
          goto: 'wrl_qn_tomb_3',
        },
      },
      {
        label: '顺手搜检耳室散修遗物便即退走',
        hint: '见好就收 · 不涉深险',
        outcome: {
          text: '你在墙角翻出几枚尚存药香的培元丹与散碎灵石，抬头望了一眼森冷石门，终究按下贪念，悄然退回阳光之下。',
          effects: { items: ['peiyuan_dan'], stones: 38 },
        },
      },
    ],
  },
  {
    id: 'wrl_qn_tomb_3',
    title: '青牛 · 铁甲石棺',
    region: 'qingniu',
    pool: 'branch',
    tier: 2,
    weight: 0,
    minRealm: 0,
    maxRealm: 2,
    text: '主室不大，四壁绘着斑驳的边关烽火图。正中停着一口无盖石棺，棺内并非朽骨，而是一具端坐如生的枯槁将躯，身披残破玄铁鳞甲，膝上横着一口三尺玄钢长剑。\n\n石壁角落竟还蜷着一名蒙面黑衣散修，手握短匕喘息不止，见你步入，眼神立时凶光毕露：「此冢是我先踩的点，识相的把身上丹药留下来！」',
    choices: [
      {
        label: '冷声拔剑，先除了这劫道黑修',
        hint: '除恶护冢 · 必有一战',
        combat: {
          enemy: 'herb_thief',
          win: {
            text: '数合交锋，黑修短匕脱手飞出，捂胸倒地伏诛。你从其怀中摸出几块带血的灵石，转身再望石棺，只觉棺中将躯威严更甚。',
            effects: { stones: 65, karma: 10, flag: { 青牛冢斩黑修: true } },
            goto: 'wrl_qn_tomb_4',
          },
          lose: {
            text: '黑修袖中暗箭刁钻，划破你肩胛。你借石柱遮挡踉跄退回甬道，听得身后传来猖狂冷笑。',
            effects: { hp: -32, injury: 1 },
          },
        },
      },
      {
        label: '允诺平分陪葬金银，只求阅览将冢碑铭',
        hint: '魅力与道心检定 · 暂息干戈',
        roll: {
          p: 0.55,
          attrs: { 魅力: 0.015, 道心: 0.01 },
          success: {
            text: '黑修见你气息沉稳，权衡片刻终是收匕退让：「成交！金银器皿归我，那些酸腐石刻与旧铁你自去瞧。」说罢捞起几件陪葬铜器便匆匆遁走。',
            effects: { reputation: 6, exp: 55 },
            goto: 'wrl_qn_tomb_4',
          },
          fail: {
            text: '黑修冷哼一声：「修仙界哪来的平分？」话音未落已挥刃扑来！',
            combat: {
              enemy: 'bandit',
              win: {
                text: '你早有防备，侧身一击震断其腕骨，将其逐出墓室。',
                effects: { stones: 45, exp: 60 },
                goto: 'wrl_qn_tomb_4',
              },
              lose: {
                text: '仓促迎敌失了先机，被一刀逼退至门外，只得恨恨离去。',
                effects: { hp: -26 },
              },
            },
          },
        },
      },
      {
        label: '以五十灵石买断此冢归属，打发其离去',
        hint: '耗 50 灵石 · 省却血斗',
        cost: { stones: 50 },
        outcome: {
          text: '灵石落地叮当作响，黑修眼睛一亮，抓起灵石揣入怀中，拱了拱手便钻入阴影消失不见。主室终于重归清静。',
          effects: { attrs: { 道心: 1 } },
          goto: 'wrl_qn_tomb_4',
        },
      },
    ],
  },
  {
    id: 'wrl_qn_tomb_4',
    title: '青牛 · 残将遗志',
    region: 'qingniu',
    pool: 'branch',
    tier: 3,
    weight: 0,
    minRealm: 0,
    maxRealm: 2,
    text: (s) => `主室重归寂静，唯有你掌中灵火映照着枯槁将躯。${s.flags['青牛冢斩黑修'] ? '棺中残将胸前那枚锈迹斑斑的虎符忽然轻颤，似在赞许你肃清宵小。' : '你走近石棺，才发觉石壁刻着一行铁画银钩的遗言：「生不能封狼居胥，死愿以残剑镇山妖。」'}\n\n石棺内侧暗格微开，露出玄钢长剑、一卷泛黄的炼体拓本，以及两块灵气充沛的玄铁。`,
    choices: [
      {
        label: '跪礼三拜，承其遗志取剑与拓本',
        hint: '得玄钢长剑与《铁牛搬山劲》传承',
        outcome: {
          text: '你向古将郑重三拜，取下膝上长剑与石匣拓本。拓本所载乃凡朝军中秘传炼体劲法，与修仙吐纳暗合，细读之下筋骨齐鸣。',
          effects: {
            items: ['tie_jian', 'xuantie'],
            karma: 12,
            attrs: { 根骨: 2 },
            techniques: [{
              id: 'wt_tieniu_ti', name: '《铁牛搬山劲》', grade: '凡',
              speed: 0.03, atk: 0.05, def: 0.06, lifespan: 6, lawId: 'blood', artName: '铁牛撼地撞',
            }],
          },
        },
      },
      {
        label: '只取暗格玄铁与灵石，留长剑陪葬古将',
        hint: '重义轻兵 · 增寿元与道心',
        outcome: {
          text: '英雄不可无剑。你只收下暗格中无主玄铁与古修遗落的几枚丹药，替石棺重新合上青石盖。出冢时忽觉神台澄澈，似有一缕浩然战意温养心神。',
          effects: { items: ['xuantie', 'peiyuan_dan', 'jingang_fu'], attrs: { 道心: 2, 气运: 1 }, karma: 18, expPct: 0.2 },
        },
      },
      {
        label: '于石壁烽火图前静坐一月，体悟沙场杀伐意',
        hint: '耗一月 · 悟剑意或战劲',
        cost: { month: 1 },
        outcome: {
          text: '一月幽暗静坐，你闭目倾听壁画中千军万马奔腾之声，竟从凡俗兵戈里悟出一缕凛冽剑道真意。出墓之日，山风飒飒，天地皆阔。',
          effects: { expPct: 0.28, lawExp: 14, lawId: 'sword', attrs: { 悟性: 2 }, items: ['peiyuan_dan'] },
        },
      },
    ],
  },

  /* ---------- 链二：幽篁鬼谷（4 段） ---------- */
  {
    id: 'wrl_qn_bamboo_1',
    title: '青牛 · 雾锁幽篁',
    region: 'qingniu',
    pool: 'wild',
    tier: 2,
    weight: 4,
    minRealm: 0,
    maxRealm: 2,
    once: true,
    text: '青牛山东南有一片十里墨竹林，白日里也常年笼着灰白冷雾。山脚樵夫皆称林中有「竹鬼哭嫁」，凡入林深处者十有八九迷失归途。\n\n此刻薄暮将至，林间却飘出一段清越断续的玉箫声，箫音婉转凄切，竟隐隐牵动你丹田灵气自主流转。',
    choices: [
      {
        label: '循箫声踏入墨竹林深处',
        hint: '道心检定 · 探寻鬼谷箫声由来',
        cost: { month: 1 },
        roll: {
          p: 0.58,
          attrs: { 道心: 0.015, 神识: 0.01 },
          success: {
            text: '你紧守灵台清明，任凭竹影如鬼魅摇曳，脚步分毫不乱。行出三里，冷雾忽开，现出一座竹篱茅舍。',
            effects: { exp: 55, attrs: { 道心: 1 }, flag: { 幽篁定心入林: true } },
            goto: 'wrl_qn_bamboo_2',
          },
          fail: {
            text: '箫音入耳渐化哀泣，四周墨竹仿佛活转过来。你猛咬舌尖强行破幻，虽惊出一身冷汗，却也寻到了雾阵缺口。',
            effects: { demon: 4, hp: -15, exp: 40 },
            goto: 'wrl_qn_bamboo_2',
          },
        },
      },
      {
        label: '在林口折枝插阵，先破迷雾再前行',
        hint: '悟性 ≥ 10 · 识破竹林聚阴阵',
        require: 'char.attrs.悟性 >= 10',
        requireHint: '悟性不足十，难辨林间阵脚',
        outcome: {
          text: '你一眼看穿这并非天成山雾，而是七株古竹暗合北斗所成的残缺聚阴阵。你拔去阵眼枯竹，冷雾如潮退散，一条石径直通谷心。',
          effects: { lawExp: 10, lawId: 'array', exp: 70, flag: { 幽篁破阵入林: true } },
          goto: 'wrl_qn_bamboo_2',
        },
      },
      {
        label: '在竹林外围采些露水竹荪与灵草便回',
        hint: '避开诡域 · 稳妥采药',
        outcome: {
          text: '君子不立危墙之下。你只在雾线之外采了一篮沾满灵露的百年灵草，听着林中箫声渐杳，转身踏上归途。',
          effects: { items: ['lingcao', 'jiexin_dan'], stones: 24 },
        },
      },
    ],
  },
  {
    id: 'wrl_qn_bamboo_2',
    title: '青牛 · 竹庐灯影',
    region: 'qingniu',
    pool: 'branch',
    tier: 2,
    weight: 0,
    minRealm: 0,
    maxRealm: 2,
    text: '竹篱小院清幽异常，石桌上放着一盏昏黄油灯与半壶尚温的竹叶青。一名青衣女子背对着你坐在竹阶上，指间握着半截裂开的碧玉箫。\n\n她并未回头，声音如竹叶摩挲：「百年无人踏足此谷。道友既能穿过雾林，是来替青牛山除祟的，还是来寻旧人遗物的？」',
    choices: [
      {
        label: '拱手致礼，细问她为何独困竹谷',
        hint: '温和攀谈 · 探听百年前旧怨',
        outcome: {
          text: '青衣女子缓缓转过身，眉目清秀却无半点血色——原是一缕寄于寒竹中的灵修残魂。她轻叹一声，道出当年与同门寻药遇袭、被邪修活埋谷底的往事。',
          effects: { karma: 8, attrs: { 魅力: 1 }, flag: { 幽篁听魂诉怨: true } },
          goto: 'wrl_qn_bamboo_3',
        },
      },
      {
        label: '祭起护身符箓，厉声喝问其真身',
        hint: '正道斩邪 · 恐激怒残魂化煞',
        roll: {
          p: 0.5,
          attrs: { 道心: 0.015, 根骨: 0.01 },
          success: {
            text: '符光一闪，女子身形剧颤却并未暴起伤人，只苦笑低眉：「我若害人，林口樵夫岂能活命？真正作祟的，是盘踞谷底寒潭的那头邪物。」',
            effects: { exp: 60, reputation: 6 },
            goto: 'wrl_qn_bamboo_3',
          },
          fail: {
            text: '符光激起女子积压百年的怨气，竹叶化刀漫天卷来，谷底水煞亦趁机现身！',
            combat: {
              enemy: 'creek_spirit',
              win: {
                text: '剑光斩散阴风，青衣女子身影变得几近透明，喃喃道：「道友既胜了我，便去谷底寒潭收了那邪修遗骸罢……」',
                effects: { exp: 75, stones: 35 },
                goto: 'wrl_qn_bamboo_3',
              },
              lose: {
                text: '漫天竹刃割破法袍，你借遁光冲出雾林，回头只见竹海幽暗如墨。',
                effects: { hp: -28, injury: 1 },
              },
            },
          },
        },
      },
      {
        label: '取出一枚清毒解障丹，助她抚平阴煞焦躁',
        hint: '消耗清毒解障丹 · 结下深厚善缘',
        cost: { item: 'jiexin_dan' },
        outcome: {
          text: '丹药化作清烟绕灯三匝，女子眉间郁结竟淡去大半。她盈盈一拜：「百年来头一回有人不把我当厉鬼看。谷底尚有仇敌留下的毒瘴阵眼，请道友随我一观。」',
          effects: { karma: 16, attrs: { 道心: 2 }, flag: { 幽篁赠丹结缘: true } },
          goto: 'wrl_qn_bamboo_3',
        },
      },
    ],
  },
  {
    id: 'wrl_qn_bamboo_3',
    title: '青牛 · 寒潭邪祭',
    region: 'qingniu',
    pool: 'branch',
    tier: 2,
    weight: 0,
    minRealm: 0,
    maxRealm: 2,
    text: '穿过竹庐后院，山壁下竟藏着一泓墨绿寒潭。潭心石台插着三面褪色白骨小幡，正源源不断抽取竹林木灵之气。一条磨盘大小的腐沼毒蟾伏在石台之上，双目泛着诡异红光，显是当年邪修留下的看阵妖兽。',
    choices: [
      {
        label: '跃上石台，斩杀腐沼毒蟾毁去骨幡',
        hint: '正面力战 · 彻底拔除鬼谷毒源',
        combat: {
          enemy: 'mire_toad',
          win: {
            text: '你避开毒雾一剑洞穿毒蟾咽喉，随手折断三面骨幡。墨绿潭水咕嘟冒泡，片刻后竟渐转澄澈，潭底隐隐浮起一道青翠灵光。',
            effects: { exp: 95, stones: 50, karma: 14, flag: { 幽篁斩蟾破祭: true } },
            goto: 'wrl_qn_bamboo_4',
          },
          lose: {
            text: '毒蟾喷出的腥瘴蚀穿护体灵光，你只得捂住口鼻退回竹林之外，浑身酸麻良久。',
            effects: { hp: -30, injury: 1 },
          },
        },
      },
      {
        label: '隔潭以灵力震断骨幡阵脚，借林气反噬妖蟾',
        hint: '神识与悟性检定 · 巧破邪阵',
        roll: {
          p: 0.54,
          attrs: { 神识: 0.015, 悟性: 0.014 },
          success: {
            text: '三道剑气分击骨幡底座，阵势瞬间崩塌。反噬的木灵清气化作青索，将毒蟾死死镇入潭底，再难兴风作浪。',
            effects: { exp: 85, lawExp: 10, lawId: 'array', karma: 12, flag: { 幽篁巧破邪阵: true } },
            goto: 'wrl_qn_bamboo_4',
          },
          fail: {
            text: '剑气偏了半分，反惊动毒蟾凌空扑来，避无可避！',
            combat: {
              enemy: 'mire_toad',
              win: {
                text: '激战良久，终于将毒蟾斩于潭畔，骨幡亦随之崩碎。',
                effects: { exp: 80, stones: 40 },
                goto: 'wrl_qn_bamboo_4',
              },
              lose: {
                text: '毒瘴扑面，你强提一口真气逃离幽篁谷，数日方才清去余毒。',
                effects: { hp: -26, injury: 1 },
              },
            },
          },
        },
      },
      {
        label: '趁毒蟾沉睡，暗取石台边一株吸毒而生的灵草便撤',
        hint: '气运检定 · 不解旧怨只图灵药',
        roll: {
          p: 0.62,
          attrs: { 气运: 0.015 },
          success: {
            text: '你屏息凝神摘得一株品相极佳的百年灵草，转身掠出谷外。身后玉箫声再起，比先前更添几分孤寂。',
            effects: { items: ['lingcao', 'ningqi_dan'], karma: -6 },
          },
          fail: {
            text: '脚下碎石滚落潭中，毒蟾猛然喷出一口毒液溅中你的鞋摆，你狼狈逃出竹海。',
            effects: { hp: -20, karma: -4 },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_qn_bamboo_4',
    title: '青牛 · 碧竹赠经',
    region: 'qingniu',
    pool: 'branch',
    tier: 3,
    weight: 0,
    minRealm: 0,
    maxRealm: 2,
    text: (s) => `邪祭既毁，十里幽篁的冷雾如雪消融，第一缕晨光斜斜洒进竹院。青衣女子立于晨风之中，身形渐化点点翠绿萤火。\n\n她将一枚温润竹简轻轻置于石桌：「${s.flags['幽篁赠丹结缘'] ? '蒙道友仁心相待，妾身执念已了。' : '大仇得报，滞留人世的因果总算尽了。'}此乃我师门辨药养气的心得，另有一件青木软甲沉于潭底，愿助道友仙途长安。」`,
    choices: [
      {
        label: '恭敬接过竹简与青木软甲，目送残魂往生',
        hint: '获青木软甲与《采药辨灵录》',
        outcome: {
          text: '你收起竹简与自潭底浮出的青木软甲，向晨风长揖。翠绿光点随风飘散于竹梢之间，幽篁谷自此再无哭箫。',
          effects: {
            items: ['qingmu_jia', 'lingcao'],
            karma: 15,
            expPct: 0.22,
            techniques: [{
              id: 'wt_baicao_lu', name: '《采药辨灵录》', grade: '凡',
              speed: 0.05, atk: 0.01, def: 0.03, lifespan: 10, lawId: 'pill', artName: '草木生息气',
            }],
          },
        },
      },
      {
        label: '就地为她立一座无字竹碑，诵静心诀超度',
        hint: '耗一月 · 获大功德与《黄庭养气简》',
        cost: { month: 1 },
        outcome: {
          text: '你砍青竹立碑，连诵三十日清音。满谷新篁沙沙作响，竟在碑前凝出一枚温润玉简与数滴竹心灵露。',
          effects: {
            items: ['yujian_yangshen', 'peiyuan_dan'],
            karma: 24,
            lifespan: 4,
            attrs: { 道心: 2, 悟性: 1 },
            expPct: 0.24,
          },
        },
      },
    ],
  },

  /* ---------- 链三：雨夜山驿（3 段） ---------- */
  {
    id: 'wrl_qn_inn_1',
    title: '青牛 · 雨夜野驿',
    region: 'qingniu',
    pool: 'world',
    tier: 2,
    weight: 4,
    minRealm: 0,
    maxRealm: 2,
    once: true,
    text: '瓢泼暴雨倾泻在青牛古道上，你推开半掩的「听松驿」木门。大堂仅点着三支昏暗牛油烛，灶边坐着个瘸腿掌柜，靠窗一桌围着三名佩刀汉子，角落里还有位抱着漆黑木匣、始终低垂斗笠的瘦削书生。\n\n你刚抖落蓑衣雨水，便觉堂中茶香里夹着一丝极淡的迷魂散气味。',
    choices: [
      {
        label: '不动声色落座，暗运灵力逼出茶雾',
        hint: '神识检定 · 静观雨夜群客动向',
        roll: {
          p: 0.6,
          attrs: { 神识: 0.015, 道心: 0.01 },
          success: {
            text: '你佯装饮茶，灵力悄悄绕喉而过。借烛影一瞥，发觉那三名佩刀汉子的目光全锁在角落书生怀里的黑木匣上，而掌柜脚边竟藏着半截缚灵绳。',
            effects: { exp: 45, attrs: { 神识: 1 }, flag: { 雨驿识破迷茶: true } },
            goto: 'wrl_qn_inn_2',
          },
          fail: {
            text: '迷烟比预想更烈，你头脑微沉，勉强咬破指尖稳住心神。三名佩刀汉子已按住刀柄站起身来。',
            effects: { mp: -20, exp: 30 },
            goto: 'wrl_qn_inn_2',
          },
        },
      },
      {
        label: '取出二十灵石拍在柜台，要一间上房闭门不出',
        hint: '耗 20 灵石 · 置身事外观察动静',
        cost: { stones: 20 },
        outcome: {
          text: '瘸腿掌柜见了灵石，眼底闪过一丝惊惧，忙引你上了二楼。你掩门吹灯，耳贴木板，只听楼下杯盏碎裂，一场夜变骤然爆发。',
          effects: { flag: { 雨驿二楼观变: true } },
          goto: 'wrl_qn_inn_2',
        },
      },
      {
        label: '直指茶中有毒，喝令掌柜交代来历',
        hint: '打草惊蛇 · 立刻引来恶战',
        combat: {
          enemy: 'bandit',
          win: {
            text: '你先发制人击翻为首刀客，瘸腿掌柜吓得缩到灶后。角落斗笠书生忽然抬头，露出一双亮得惊人的眸子。',
            effects: { stones: 42, reputation: 8, flag: { 雨驿先手制贼: true } },
            goto: 'wrl_qn_inn_2',
          },
          lose: {
            text: '几人合围太快，你被迫撞破窗棂遁入暴雨之中，衣衫尽湿。',
            effects: { hp: -24 },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_qn_inn_2',
    title: '青牛 · 黑匣真伪',
    region: 'qingniu',
    pool: 'branch',
    tier: 2,
    weight: 0,
    minRealm: 0,
    maxRealm: 2,
    text: (s) => `惊雷劈亮驿站窗纸。${s.flags['雨驿先手制贼'] ? '余下两名贼人见头领伏诛，正欲夺门而逃，却被书生袖中甩出的一张符箓定在门槛。' : '三名佩刀汉子果然暴起发难，直扑斗笠书生，瘸腿掌柜竟也抄起铁火钳封住了退路。'}\n\n混乱间，黑木匣盖震开一缝，竟透出淡淡檀香与赤色灵光——里面藏的并非金银，而是一枚残缺的丹霞古印！斗笠书生沉声道：「道友若助我保住此印，明日天亮必有厚报。」`,
    choices: [
      {
        label: '拔剑护在书生身前，击退黑店贼党',
        hint: '仗义援手 · 迎战背后邪修掌柜',
        combat: {
          enemy: 'rogue',
          win: {
            text: '那瘸腿掌柜竟是藏身古道的炼气邪修，铁火钳中暗藏毒针！你连破数招将其斩杀，余贼见势不妙冒雨奔逃。',
            effects: { stones: 65, karma: 14, reputation: 10, flag: { 雨驿救书生: true } },
            goto: 'wrl_qn_inn_3',
          },
          lose: {
            text: '邪修毒针难防，你闷哼一声退开数步，书生见大势已去，抛出一枚烟雷裹挟黑匣破壁而走。',
            effects: { hp: -30, injury: 1 },
          },
        },
      },
      {
        label: '趁乱夺下黑木匣，独吞古印',
        hint: '气运与身法检定 · 损业谋宝',
        roll: {
          p: 0.5,
          attrs: { 气运: 0.015, 根骨: 0.01 },
          success: {
            text: '你趁双方缠斗探手一捞，将黑木匣稳稳收入袖中，足尖一点掠出雨夜。身后怒骂声被雷鸣吞没。',
            effects: { karma: -18, demon: 5, flag: { 雨驿夺黑匣: true } },
            goto: 'wrl_qn_inn_3',
          },
          fail: {
            text: '指尖刚触木匣，便被书生反手一记掌心雷震退，掌心焦黑一片，只得空手退入雨幕。',
            effects: { hp: -26, karma: -10 },
          },
        },
      },
      {
        label: '高声点破古印乃赝品，惊退群贼再做计较',
        hint: '悟性 ≥ 11 · 虚实相激巧解危局',
        require: 'char.attrs.悟性 >= 11',
        requireHint: '悟性不足十一，难察印光虚实',
        outcome: {
          text: '你一眼看出匣中赤光浮躁，竟是朱砂涂抹的假印诱饵！你冷笑点破，贼众面面相觑之际，书生顺势祭出雷符逼退众人，对你投来佩服目光。',
          effects: { exp: 75, attrs: { 悟性: 1 }, flag: { 雨驿识假印: true } },
          goto: 'wrl_qn_inn_3',
        },
      },
    ],
  },
  {
    id: 'wrl_qn_inn_3',
    title: '青牛 · 晨钟赠符',
    region: 'qingniu',
    pool: 'branch',
    tier: 3,
    weight: 0,
    minRealm: 0,
    maxRealm: 2,
    text: (s) => s.flags['雨驿夺黑匣']
      ? '你在山洞中撬开黑木匣，却见里面所谓的「丹霞古印」不过是块涂了灵粉的赤阳炎石，唯独匣底暗层夹着两张保命符箓与一封密信——原来那书生本就是替落霞坊市钓鱼捉贼的暗桩。'
      : '雨歇天明，檐角滴水如珠。斗笠书生摘下斗笠，原是落霞城巡查暗桩，专以假印为饵清剿青牛古道黑店。他向你郑重作揖：「昨夜若非道友相助，险些折在这老邪修手里。这点微薄谢礼，请务必收下。」',
    choices: [
      {
        label: '收下灵丹与符箓，结交这位落霞暗桩',
        hideIf: 'flag("雨驿夺黑匣")',
        hint: '得宁气丹、护心符与声望',
        outcome: {
          text: '书生赠你一瓶宁气丹、一张护心符与五十灵石，又留下一枚落霞城通行玉牌。此后你行走青州坊市，倒多了几分耳目照应。',
          effects: { items: ['ningqi_dan', 'huxin_fu'], stones: 50, reputation: 14, karma: 10 },
        },
      },
      {
        label: '婉拒财物，只求他传授昨夜那手奇门步法',
        hideIf: 'flag("雨驿夺黑匣")',
        hint: '习得《流云踏雪步》或精进神识',
        outcome: {
          text: '书生朗笑一声，当即在雨后青石板上步步拆解身法要诀。你悟性颇佳，不过半日便将步法精义铭记于心。',
          effects: {
            expPct: 0.2,
            attrs: { 神识: 2 },
            techniques: [{
              id: 'wt_liuyun_bu', name: '《流云踏雪步》', grade: '凡',
              speed: 0.05, atk: 0.03, def: 0.04, lifespan: 2, lawId: 'space', artName: '踏雪无痕影',
            }],
          },
        },
      },
      {
        label: '收起匣中赤阳炎石与符箓，抹去行迹速离青牛道',
        require: 'flag("雨驿夺黑匣")',
        hint: '虽中空城计，仍有小利落袋',
        outcome: {
          text: '你自嘲一笑，收起赤阳炎石与两张神行符，将空木匣焚为灰烬。此番虽背了几分恶名，倒也得了脱身保命的本钱。',
          effects: { items: ['chiyang_shi', 'shenxing_fu', 'jingang_fu'], stones: 30 },
        },
      },
    ],
  },

  /* ---------- 青牛山脉 独立奇遇 01–14 ---------- */
  {
    id: 'wrl_qn_s01',
    title: '青牛 · 旱村求雨',
    region: 'qingniu',
    pool: 'world',
    tier: 1,
    weight: 4,
    minRealm: 0,
    maxRealm: 2,
    text: '大旱三月，青牛山南坡的柳树屯田地龟裂如网。十余名白发村老正抬着一尊泥塑龙王绕村哭祈，烈日炙烤得尘土滚烫。\n\n村口老槐树下，你察觉地下三丈竟压着一块赤阳矿脉残石，正不断蒸干附近水气。',
    choices: [
      {
        label: '运功掘出地下赤阳炎石，疏通暗泉',
        hint: '耗 25 灵力 · 救一村百姓兼得灵矿',
        cost: { mp: 25 },
        outcome: {
          text: '你以剑气剖开干井石壁，起出那块烫手的赤阳炎石。霎时暗泉喷涌而出，满村老幼跪地叩谢，香火愿力无声汇入你的神魂。',
          effects: { items: ['chiyang_shi'], karma: 18, reputation: 12, attrs: { 道心: 1 }, exp: 55 },
        },
      },
      {
        label: '以灵力凝云降雨，收百姓十斤灵米与银钱',
        hint: '小施法术 · 得薄酬与微名',
        cost: { mp: 15 },
        outcome: {
          text: '你挥袖聚来半亩山岚，化作一场救急小雨。村民倾囊献上供奉的几块粗灵石与干粮，对你感恩戴德。',
          effects: { stones: 35, karma: 8, reputation: 6 },
        },
      },
      {
        label: '尘缘易惹因果，只留一包干粮悄然离去',
        hint: '淡泊处世 · 稳固道心',
        outcome: {
          text: '你把随身干粮放在村口土地庙石阶上，未曾露面。修仙者本就该少涉凡俗命数，心中倒落得一片清净。',
          effects: { karma: 4, exp: 40, attrs: { 道心: 1 } },
        },
      },
    ],
  },
  {
    id: 'wrl_qn_s02',
    title: '青牛 · 采药老翁',
    region: 'qingniu',
    pool: 'wild',
    tier: 1,
    weight: 4,
    minRealm: 0,
    maxRealm: 2,
    text: '晨雾未散的峭壁栈道上，一名背着竹篓的白须老药农正伏在岩边喘息。他脚踝扭伤红肿，竹篓里滚出几株带泥的青叶草，其中竟混着一株年份颇足的百年灵草。\n\n远处崖壁传来野猪低沉的哼哧声，似有赤眼山猪嗅着药香寻来。',
    choices: [
      {
        label: '迎上前去驱杀赤眼山猪，护送老翁下山',
        hint: '力敌妖猪 · 得老翁珍藏药方',
        combat: {
          enemy: 'wild_boar',
          win: {
            text: '山猪轰然倒地，老药农连连作揖，执意把那株百年灵草与一瓶自制疗伤散塞进你手里，还指点了后山一处隐秘药谷。',
            effects: { items: ['lingcao', 'liaoshang_dan'], karma: 14, exp: 65 },
          },
          lose: {
            text: '山猪皮糙肉厚，撞得你气血翻腾。幸得你引开了妖兽，老翁趁机爬入石缝脱险。',
            effects: { hp: -24, karma: 8 },
          },
        },
      },
      {
        label: '以三十灵石向老翁换取灵草，并替他敷药正骨',
        hint: '耗 30 灵石 · 公平交易结善缘',
        cost: { stones: 30 },
        outcome: {
          text: '你轻施灵力替老翁正骨止痛，又按市价付足灵石。老翁感动不已，临别时悄悄附耳告之青牛山脉辨识毒草的诀窍。',
          effects: { items: ['lingcao', 'peiyuan_dan'], karma: 10, attrs: { 悟性: 1 } },
        },
      },
      {
        label: '施展神行步背起老翁速离险地',
        hint: '根骨检定 · 避战救人',
        roll: {
          p: 0.62,
          attrs: { 根骨: 0.014, 气运: 0.01 },
          success: {
            text: '你抢在山猪冲出灌木前背起老翁纵下栈道。老翁惊魂稍定，执意赠你一株百年灵草聊表谢意。',
            effects: { items: ['lingcao'], karma: 12, exp: 45 },
          },
          fail: {
            text: '山路湿滑，你脚下一绊摔进草甸，虽护住了老翁，自己却擦伤了臂膀。',
            effects: { hp: -16, karma: 8, stones: 15 },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_qn_s03',
    title: '青牛 · 废庙狐龛',
    region: 'qingniu',
    pool: 'wild',
    tier: 2,
    weight: 3,
    minRealm: 0,
    maxRealm: 2,
    text: '青牛岭背阴处藏着一座半塌的山神小庙，神像早已倾倒，供桌上却有人摆着三枚鲜红野果与一碟清泉。一只断尾白狐正蹲在神龛里对着月光吐纳，见你推门而入，竟不逃走，反而人立起前爪朝你作了一揖。',
    choices: [
      {
        label: '取出一枚引气丹赠与白狐，结一段异类善缘',
        hint: '消耗引气丹 · 或得灵狐报恩',
        cost: { item: 'yinqi_dan' },
        outcome: {
          text: '白狐嗅了嗅丹香，欣喜吞下，旋即钻入供桌底下叼出一只青玉小瓶推到你脚边——里面竟封着两枚培元丹与一张金刚护身符。',
          effects: { items: ['peiyuan_dan', 'jingang_fu'], karma: 15, attrs: { 气运: 2 } },
        },
      },
      {
        label: '静坐蒲团与白狐同承月华，各修各道',
        hint: '悟性检定 · 观妖类吐纳之妙',
        cost: { month: 1 },
        roll: {
          p: 0.58,
          attrs: { 悟性: 0.015, 道心: 0.01 },
          success: {
            text: '月影西移，你观白狐呼吸绵长与山岚合拍，忽觉自己平日行气过于急躁。一夜同修，经脉竟宽阔了一分。',
            effects: { expPct: 0.22, attrs: { 悟性: 1, 道心: 1 } },
          },
          fail: {
            text: '山风渐冷，白狐子时一过便跃窗而去，你独守空庙静坐至天明，修为略有长进。',
            effects: { exp: 75 },
          },
        },
      },
      {
        label: '趁其未成气候出手擒拿，取狐皮内丹',
        hint: '杀妖夺材 · 恐惹灵狐咒怨',
        outcome: {
          text: '白狐惊鸣一声化作白影遁入荒草，只留下一撮沾血白毛与几块散落神龛的碎灵石。庙梁忽断一木，似在警示杀戒过重。',
          effects: { stones: 48, karma: -14, demon: 4 },
        },
      },
    ],
  },
  {
    id: 'wrl_qn_s04',
    title: '青牛 · 古井龙吟',
    region: 'qingniu',
    pool: 'world',
    tier: 2,
    weight: 3,
    minRealm: 0,
    maxRealm: 2,
    text: '荒废数十年的石桥村中央，有一口青苔密布的八角古井。井沿刻着早被井绳磨圆的镇水云纹，每逢风过井口，井底便传出沉闷如牛哞、又似龙吟的奇异回响。\n\n你探头下望，水面幽黑如镜，竟隐约倒映出几颗白日星辰。',
    choices: [
      {
        label: '系绳垂入井底，探查水下秘境',
        hint: '根骨与神识检定 · 寒潭藏珍',
        roll: {
          p: 0.54,
          attrs: { 根骨: 0.012, 神识: 0.014 },
          success: {
            text: '井水寒彻骨髓，你在井壁三丈处摸到一只嵌入石缝的铜筒，内藏一枚回灵丹与一枚嵌着青翠灵玉的古戒，水气滋养得你神清气爽。',
            effects: { items: ['huiling_dan', 'biling_jie'], exp: 65 },
          },
          fail: {
            text: '刚潜入丈许，井底阴寒骤然化作水煞缠住脚踝！',
            combat: {
              enemy: 'creek_spirit', displayName: '井底水煞',
              win: {
                text: '剑气剖开井水，水煞哀嚎消散，井底露出一堆前人投下的祈福灵石。',
                effects: { stones: 78, exp: 70 },
              },
              lose: {
                text: '寒气攻心，你拼力攀绳爬回井口，半日方才驱尽寒毒。',
                effects: { hp: -26, injury: 1 },
              },
            },
          },
        },
      },
      {
        label: '向井中投掷十块灵石问卜前程',
        hint: '耗 10 灵石 · 气运玄妙难测',
        cost: { stones: 10 },
        roll: {
          p: 0.65,
          attrs: { 气运: 0.018 },
          success: {
            text: '灵石落水无声，井底忽然涌出一股清冽灵雾扑面而来，久滞的灵窍竟豁然松动，心魔随之淡去。',
            effects: { expPct: 0.16, demon: -6, attrs: { 气运: 1 } },
          },
          fail: {
            text: '井水仅泛起几圈涟漪便归于沉寂，十块灵石打了水漂，唯余清风拂面。',
            effects: { exp: 25 },
          },
        },
      },
      {
        label: '于井畔汲水烹茶，细听井底风声悟道',
        hint: '稳妥静心 · 小进修为与道心',
        outcome: {
          text: '井水甘冽异常。你独坐石磨旁饮完三杯清茶，听着井中隐约潮音，只觉浮躁之气尽消。',
          effects: { exp: 55, hpPct: 0.15, mpPct: 0.2, attrs: { 道心: 1 } },
        },
      },
    ],
  },
  {
    id: 'wrl_qn_s05',
    title: '青牛 · 货郎旧担',
    region: 'qingniu',
    pool: 'world',
    tier: 1,
    weight: 4,
    minRealm: 0,
    maxRealm: 2,
    text: '山道凉亭里歇着一名摇着拨浪鼓的瘦小货郎，扁担两头挂满针头线脑、胭脂水粉，偏生在竹筐最底层压着几枚蒙尘的灰扑扑符纸与半块生锈铁片。\n\n货郎见你气度不凡，搓着手嘿嘿笑道：「仙师瞧得上啥尽管拿，小的只要几块亮晶晶的石头！」',
    choices: [
      {
        label: '细辨竹筐旧物，花四十五灵石买下灰符与铁片',
        hint: '耗 45 灵石 · 神识识宝',
        cost: { stones: 45 },
        roll: {
          p: 0.62,
          attrs: { 神识: 0.016, 气运: 0.012 },
          success: {
            text: '拭去浮灰，那铁片竟是一块上好玄铁，灰符更是能保命的金刚护身符！货郎欢欢喜喜数着灵石挑担而去，宾主尽欢。',
            effects: { items: ['xuantie', 'jingang_fu'], exp: 40 },
          },
          fail: {
            text: '仔细一瞧，铁片只是寻常熟铁，唯有一张神行符尚存三成灵力，倒也不算血亏。',
            effects: { items: ['shenxing_fu'], attrs: { 悟性: 1 } },
          },
        },
      },
      {
        label: '买两枚山杏果脯，顺道打听青牛山近况',
        hint: '耗 10 灵石 · 探听市井秘闻',
        cost: { stones: 10 },
        outcome: {
          text: '货郎走南闯北消息灵通，絮絮叨叨讲了半个时辰山中妖兽出没与坊市药价涨跌，令你少走了许多弯路。',
          effects: { exp: 50, reputation: 4, attrs: { 气运: 1 } },
        },
      },
      {
        label: '察觉货郎袖口沾血，厉声盘查其来历',
        hint: '警惕防备 · 恐是伪装劫修',
        roll: {
          p: 0.55,
          attrs: { 神识: 0.015 },
          success: {
            text: '货郎脸色骤变，抓起担子便要逃！原来是个假扮货郎踩点的劫道散修，被你一眼看破，惊慌间丢下一瓶培元丹落荒而逃。',
            effects: { items: ['peiyuan_dan'], stones: 32, karma: 8 },
          },
          fail: {
            text: '货郎掀起袖口，原是刚杀完山鸡沾的鸡血，吓得连连告饶。你颇觉尴尬，赔了几块灵石安抚离去。',
            effects: { stones: -8, karma: -2 },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_qn_s06',
    title: '青牛 · 断桥神龛',
    region: 'qingniu',
    pool: 'wild',
    tier: 1,
    weight: 3,
    minRealm: 0,
    maxRealm: 2,
    text: '山洪冲垮了青石古桥，唯有桥头一尊残缺的石刻判官龛仍立在激流旁。石龛缝隙里塞着一卷用油布层层裹紧的旧纸，似是某位落魄修士临终前仓促藏下的。',
    choices: [
      {
        label: '踏浪过涧，取下油布密卷',
        hint: '根骨检定 · 激流险中取宝',
        roll: {
          p: 0.6,
          attrs: { 根骨: 0.015, 气运: 0.01 },
          success: {
            text: '你纵身掠过湍流，稳稳取下油布。里面竟是半册手抄《吐纳引气诀》心得与二十余块灵石，批注极见功力。',
            effects: {
              stones: 28,
              exp: 60,
              techniques: [{
                id: 'wt_yinqi_jue', name: '《吐纳引气诀》', grade: '凡',
                speed: 0.04, atk: 0.02, def: 0.03, lifespan: 4, lawId: 'pill', artName: '引气归元掌',
              }],
            },
          },
          fail: {
            text: '青苔湿滑，你落水呛了几口冰冷山溪，勉强抓回半卷浸湿残页，只堪堪辨出几句行气口诀。',
            effects: { hp: -16, exp: 45 },
          },
        },
      },
      {
        label: '以剑气伐倒岸边老松，搭木桥方便过客',
        hint: '举手行善 · 得功德与石龛福缘',
        cost: { mp: 20 },
        outcome: {
          text: '松木横架激流，恰好几名背柴山民路过，连声道谢。你顺道扶正倾斜的石龛，竟从底座滚出一枚圆润的凝气丹。',
          effects: { items: ['ningqi_dan'], karma: 16, reputation: 8 },
        },
      },
    ],
  },
  {
    id: 'wrl_qn_s07',
    title: '青牛 · 炭窑怪火',
    region: 'qingniu',
    pool: 'wild',
    tier: 2,
    weight: 3,
    minRealm: 0,
    maxRealm: 2,
    text: '深山一处废弃烧炭窑在子夜时分竟冒出幽幽青烟。你悄然走近，只见窑口堆着新砍的铁桦木，一名披头散发的赤脚修士正对着窑火疯狂塞入药草，嘴里念念有词，周身火毒煞气滚滚欲爆。',
    choices: [
      {
        label: '出手以水行灵气镇压炭窑，替其稳住丹火',
        hint: '悟性检定 · 化解炸炉险情',
        roll: {
          p: 0.56,
          attrs: { 悟性: 0.015, 神识: 0.012 },
          success: {
            text: '你一掌拍散狂暴火毒，窑内青烟转作醇厚药香。那疯癫散修如梦初醒，抹去满脸黑灰，竟捧出两枚刚成型的培元丹拱手相赠。',
            effects: { items: ['peiyuan_dan', 'peiyuan_dan'], lawExp: 8, lawId: 'pill', karma: 12 },
          },
          fail: {
            text: '轰然一声巨响，炭窑坍塌半边！散修恼羞成怒，认定你毁了他的宝贝丹药，抄起火棍便攻了过来！',
            combat: {
              enemy: 'rogue',
              win: {
                text: '制服这走火入魔的散修后，你在坍塌窑灰里扒出一块被地火淬炼过的赤阳炎石。',
                effects: { items: ['chiyang_shi'], stones: 40 },
              },
              lose: {
                text: '热浪与黑灰糊了满脸，你咳嗽着退入山林，只得作罢。',
                effects: { hp: -25 },
              },
            },
          },
        },
      },
      {
        label: '远远观摩他以土窑代炉的野路子炼丹法',
        hint: '旁观悟理 · 安全无虞',
        outcome: {
          text: '虽未凑近，但那人借山风抽火的土法颇具巧思。片刻后炭窑一声闷响熄了火，你却从中悟出几分控火之道。',
          effects: { lawExp: 6, lawId: 'pill', exp: 55, attrs: { 悟性: 1 } },
        },
      },
    ],
  },
  {
    id: 'wrl_qn_s08',
    title: '青牛 · 狼群围猎',
    region: 'qingniu',
    pool: 'wild',
    tier: 1,
    weight: 4,
    minRealm: 0,
    maxRealm: 2,
    text: '夕阳沉入山脊，林间骤然响起此起彼伏的凄厉狼嚎。七八头青背妖狼正将一匹驮着药箱的青骡逼至悬崖边，赶骡的落霞商行伙计已吓得面无人色，死死抱住药箱不放。',
    choices: [
      {
        label: '长啸持剑杀入狼群，先斩头狼',
        hint: '除妖护商 · 战青背狼',
        combat: {
          enemy: 'wolf',
          win: {
            text: '头狼伏诛，群狼夹尾四散。商行伙计千恩万谢，打开药箱取出疗伤丹与灵石酬谢，并称回到落霞城定为你扬名。',
            effects: { items: ['liaoshang_dan', 'peiyuan_dan'], stones: 45, reputation: 12, karma: 12 },
          },
          lose: {
            text: '群狼扑咬凶狠，你负伤护着伙计勉强退上巨石，待山风吹散血气才脱身。',
            effects: { hp: -22, karma: 6 },
          },
        },
      },
      {
        label: '燃起火符惊散狼群，借机低价收购药箱受损灵草',
        hint: '耗 25 灵石 · 机敏获利',
        cost: { stones: 25 },
        outcome: {
          text: '火光炸响，妖狼畏火而退。伙计惊魂未定，见你愿出灵石收下磕碰过的灵草与杂丹，乐得省去赔损之责。',
          effects: { items: ['lingcao', 'jiexin_dan'], exp: 40 },
        },
      },
      {
        label: '攀上古松暂避锋芒，待狼群退去再下树',
        hint: '明哲保身 · 毫无损耗',
        outcome: {
          text: '你敛息伏于高枝，看着青骡坠崖、狼群拖走残囊。林间重归寂静，你捡起商队遗落的几块碎灵石，心中却略觉沉重。',
          effects: { stones: 22, karma: -6, demon: 2 },
        },
      },
    ],
  },
  {
    id: 'wrl_qn_s09',
    title: '青牛 · 悬崖野茶',
    region: 'qingniu',
    pool: 'wild',
    tier: 2,
    weight: 3,
    minRealm: 0,
    maxRealm: 2,
    text: '云海翻涌的青牛绝壁石缝间，孤零零长着一株老态龙钟的石茶树。叶片翠若碧玉，叶脉间隐隐凝着清晨紫露，隔着十丈便闻到沁人心脾的清苦幽香。\n\n然而石壁上方栖着一窝阴山骨鸦，正虎视眈眈盯着任何靠近树冠的活物。',
    choices: [
      {
        label: '凌空踏壁，斩鸦采茶',
        hint: '险中求珍 · 战阴山骨鸦',
        combat: {
          enemy: 'bone_crow',
          win: {
            text: '剑光斩断黑羽，你稳稳采下三两紫露灵芽。当晚煎水一饮，满口回甘，灵力与神识顿时清明透亮。',
            effects: { expPct: 0.18, attrs: { 神识: 2, 悟性: 1 }, mpPct: 0.35 },
          },
          lose: {
            text: '峭壁难以借力，被骨鸦啄伤肩头，只摘得几片残叶便匆匆坠回崖顶。',
            effects: { hp: -20, exp: 35 },
          },
        },
      },
      {
        label: '抛出一把灵米引开鸦群，趁机速采嫩芽',
        hint: '耗 15 灵石 · 气运检定',
        cost: { stones: 15 },
        roll: {
          p: 0.64,
          attrs: { 气运: 0.015, 神识: 0.01 },
          success: {
            text: '鸦群争食之际，你如轻猿掠壁，神不知鬼不觉摘得满满一袖灵芽，泡茶饮之延年清心。',
            effects: { exp: 80, demon: -8, lifespan: 2, items: ['lingcao'] },
          },
          fail: {
            text: '山风突至卷散了灵米，鸦群瞬间折返，你被迫翻滚撤回山坡，衣襟撕开一道口子。',
            effects: { hp: -14, exp: 25 },
          },
        },
      },
      {
        label: '只立于崖巅嗅其茶香吐纳半日',
        hint: '清淡无争 · 小幅益气静心',
        outcome: {
          text: '灵树有灵，不必竭泽而渔。你在松风茶韵中打坐半日，尘念尽去。',
          effects: { exp: 55, demon: -5, attrs: { 道心: 1 } },
        },
      },
    ],
  },
  {
    id: 'wrl_qn_s10',
    title: '青牛 · 盲翁古渡',
    region: 'qingniu',
    pool: 'world',
    tier: 2,
    weight: 3,
    minRealm: 0,
    maxRealm: 2,
    text: '秋水漫过芦苇荡，渡口唯有一叶乌篷小舟，撑篙的是位双目蒙着白布的老翁。老翁虽看不见，一篙点在暗礁上却分毫不差，口中哼着苍凉古调：「渡人容易渡己难，一篙春水一篙寒。」',
    choices: [
      {
        label: '付五块灵石搭船，与老翁对饮听曲',
        hint: '耗 5 灵石 · 或遇隐世前辈点拨',
        cost: { stones: 5 },
        outcome: {
          text: '老翁接过灵石却又悄悄滑回你袖中，只取了一口葫芦浊酒，随口点拨了你两句灵力运转滞涩之处。下船回头时，芦苇荡空茫一片，哪还有什么渡船。',
          effects: { expPct: 0.2, attrs: { 悟性: 2, 道心: 1 } },
        },
      },
      {
        label: '以神识暗查老翁深浅',
        hint: '神识检定 · 慎防冲撞高人',
        roll: {
          p: 0.48,
          attrs: { 神识: 0.014, 气运: 0.01 },
          success: {
            text: '神识刚触竹篙，便如泥牛入海。老翁呵呵一笑：「娃娃眼力不差，送你两句晨钟咒罢。」声如洪钟入耳，令你灵台豁然一震。',
            effects: {
              demon: -12,
              exp: 70,
              techniques: [{
                id: 'wt_jingxin_zhou', name: '《晨钟静心咒》', grade: '凡',
                speed: 0.04, atk: 0.02, def: 0.05, lifespan: 8, lawId: 'karma', artName: '清音定心诀',
              }],
            },
          },
          fail: {
            text: '一股温和却不可抗拒的柔劲反震回来，你识海微痛，忙拱手告罪。老翁摆摆手，一篙把船撑进了迷雾。',
            effects: { mp: -18, attrs: { 道心: 1 } },
          },
        },
      },
      {
        label: '御风踏芦自渡寒江，不烦老翁',
        hint: '磨砺身法 · 自行渡水',
        outcome: {
          text: '你足尖轻点芦苇梢头，几起几落便跃至对岸。老翁在身后鼓掌笑道：「好俊的轻功！」',
          effects: { exp: 55, attrs: { 根骨: 1 }, reputation: 4 },
        },
      },
    ],
  },
  {
    id: 'wrl_qn_s11',
    title: '青牛 · 纸伞夜行',
    region: 'qingniu',
    pool: 'world',
    tier: 2,
    weight: 3,
    minRealm: 0,
    maxRealm: 2,
    text: '细雨霏霏的青石山阶上，迎面走来一位撑着红油纸伞的素服少女。奇的是雨珠落到伞沿三寸外便自行滑开，她鞋底一尘不染，经过你身旁时，淡淡问道：「道友可知前头青牛村的旧祠堂，如今还供着姓林的牌位么？」',
    choices: [
      {
        label: '如实相告旧祠已颓，愿替她捎一炷香去',
        hint: '心存悲悯 · 结幽冥善因',
        outcome: {
          text: '少女闻言默然良久，自腕间褪下一枚微凉玉环放入你掌心：「如此，便多谢道友了。」话音未落，油纸伞化作数片飘零红枫，散入细雨。',
          effects: { items: ['biling_jie'], karma: 15, attrs: { 魅力: 1 } },
        },
      },
      {
        label: '按剑戒备，喝问其究竟是人是鬼',
        hint: '道心检定 · 辨明是非',
        roll: {
          p: 0.6,
          attrs: { 道心: 0.015, 神识: 0.01 },
          success: {
            text: '少女轻叹一声，并不动怒，只言自己乃百年前离家求仙未归的村女残念。见你道心坚定，留下一张防身符纸便消散于烟雨之中。',
            effects: { items: ['jingang_fu'], exp: 60, attrs: { 道心: 1 } },
          },
          fail: {
            text: '阴寒之气骤然扑面，你心中一悸连退三步，待定睛再看，山阶上唯余满地湿滑落叶。',
            effects: { demon: 5, hp: -12 },
          },
        },
      },
      {
        label: '侧身避让，目不斜视径直前行',
        hint: '不沾怪异 · 平安无事',
        outcome: {
          text: '你合目敛息错身而过。身后雨声淅沥，再回头时山道空无一人，唯余一丝清冷梅香。',
          effects: { exp: 42, demon: -3 },
        },
      },
    ],
  },
  {
    id: 'wrl_qn_s12',
    title: '青牛 · 雷劈古松',
    region: 'qingniu',
    pool: 'wild',
    tier: 2,
    weight: 3,
    minRealm: 0,
    maxRealm: 2,
    text: '昨夜一场春雷劈中了青牛顶上的千年迎客松。半边树冠焦黑冒烟，劈裂的树心却竟流淌出琥珀般的金色松脂，隐隐缠绕着细碎紫电弧光。',
    choices: [
      {
        label: '以灵力护手，取下一截带雷意的树心木',
        hint: '根骨检定 · 恐遭残雷反噬',
        roll: {
          p: 0.52,
          attrs: { 根骨: 0.015, 气运: 0.012 },
          success: {
            text: '电弧顺着指尖钻入经脉，酥麻剧痛过后竟替你打通两处滞塞窍穴，更削下一小截品相不俗的雷击木与掌心雷纹！',
            effects: { items: ['leimu'], lawExp: 12, lawId: 'thunder', exp: 70 },
          },
          fail: {
            text: '残雷猛然炸开，震得你须发焦卷、虎口出血，只勉强刮下半瓶赤松灵脂。',
            effects: { hp: -24, items: ['peiyuan_dan'], lawExp: 5, lawId: 'thunder' },
          },
        },
      },
      {
        label: '盘坐焦松之下，以雷意淬炼拳脚与吐纳',
        hint: '耗一月 · 悟《春惊响雷拳》',
        cost: { month: 1 },
        outcome: {
          text: '你在微弱电弧间吐纳一月，每次出拳竟隐隐带起爆鸣之声，一套刚猛雷拳悄然成形。',
          effects: {
            expPct: 0.2,
            lawExp: 10,
            lawId: 'thunder',
            techniques: [{
              id: 'wt_chunjing_lei', name: '《春惊响雷拳》', grade: '凡',
              speed: 0.03, atk: 0.06, def: 0.02, lifespan: 0, lawId: 'thunder', artName: '惊蛰震空拳',
            }],
          },
        },
      },
      {
        label: '只收树皮下凝结的金色松脂，不伤树心生机',
        hint: '顺应自然 · 延寿养身',
        outcome: {
          text: '焦木逢春尚有一线生机。你仅取外溢松脂，吞服炼化后浑身暖洋洋的，寿元竟微增两载。',
          effects: { lifespan: 2, hpPct: 0.25, karma: 8, exp: 50 },
        },
      },
    ],
  },
  {
    id: 'wrl_qn_s13',
    title: '青牛 · 荒窑石磨',
    region: 'qingniu',
    pool: 'wild',
    tier: 1,
    weight: 3,
    minRealm: 0,
    maxRealm: 2,
    text: '半山腰废弃的草庐外，一盘青石磨竟在无人推动的情况下咯吱吱自行转动，磨缝间渗出细密如雪的银白粉末。你屏息细嗅，那不是面粉，而是被碾碎的劣质灵石渣与某种凝神草药。',
    choices: [
      {
        label: '以剑鞘抵住磨盘，掀开石盖一探究竟',
        hint: '果断查探 · 揭开古怪源头',
        roll: {
          p: 0.58,
          attrs: { 根骨: 0.012, 神识: 0.012 },
          success: {
            text: '石磨下竟压着一只微型聚灵石盘，被山泉暗流驱动了数十年。你拆下完好阵芯与一袋灵药粉，收获颇丰。',
            effects: { stones: 52, items: ['ningqi_dan'], lawExp: 6, lawId: 'array' },
          },
          fail: {
            text: '石磨一掀，盘踞其下的两只腐沼毒蟾受惊扑出！',
            combat: {
              enemy: 'mire_toad',
              win: {
                text: '斩杀毒蟾后，你在磨盘暗槽里找到前人遗留的几块灵石与一瓶清毒丹。',
                effects: { stones: 38, items: ['jiexin_dan'] },
              },
              lose: {
                text: '毒雾呛人，你掩袖退走，石磨又在身后咯吱吱转了起来。',
                effects: { hp: -20 },
              },
            },
          },
        },
      },
      {
        label: '不惊动石磨，只用玉瓶承接些许灵药粉',
        hint: '稳妥取巧 · 小进修为',
        outcome: {
          text: '灵粉虽杂，提纯后仍可助益行气。你装满一小瓶便悄然离去，未曾招惹麻烦。',
          effects: { exp: 65, items: ['yinqi_dan'] },
        },
      },
    ],
  },
  {
    id: 'wrl_qn_s14',
    title: '青牛 · 牧童竹笛',
    region: 'qingniu',
    pool: 'world',
    tier: 1,
    weight: 4,
    minRealm: 0,
    maxRealm: 2,
    text: '夕照漫山，青牛坡上骑着老黄牛归家的牧童横吹短笛。那笛声不成章法，却偏偏暗合山川呼吸之韵，连老黄牛眼角都泛着一丝淡淡灵光。\n\n见你驻足倾听，牧童咧嘴一笑：「哥哥也是山里找仙人的么？我爹说，这笛子是从后山石缝里捡的。」',
    choices: [
      {
        label: '赠牧童几枚铜钱与护身平安符，换来细观竹笛',
        hint: '消耗金刚护身符或灵石 · 结童稚善缘',
        cost: { stones: 20 },
        outcome: {
          text: '你接过竹笛细看，笛身内壁竟用蝇头小楷刻着半篇《石门奇门诀》。你暗记于心后将竹笛原物奉还，又送牧童些许碎银灵石。',
          effects: {
            karma: 12,
            exp: 55,
            techniques: [{
              id: 'wt_shimen_zhen', name: '《石门奇门诀》', grade: '凡',
              speed: 0.04, atk: 0.03, def: 0.05, lifespan: 2, lawId: 'array', artName: '石阵困敌印',
            }],
          },
        },
      },
      {
        label: '指点牧童几句吐纳窍门，替他种下一粒仙缘种子',
        hint: '广结善缘 · 增业力与声望',
        outcome: {
          text: '牧童虽懵懂，却记性极佳。临别时老黄牛竟朝你低头轻哞，自草丛里拱出一株鲜嫩百年灵草当作谢礼。',
          effects: { items: ['lingcao'], karma: 18, reputation: 8, attrs: { 道心: 1 } },
        },
      },
      {
        label: '以高价灵石强买竹笛，带回洞府拆解参悟',
        hint: '耗 40 灵石 · 得奇物却损些许道心',
        cost: { stones: 40 },
        outcome: {
          text: '牧童虽不舍，终究架不住白花花的钱财。你回府剖开竹笛，果然在笛膜下寻到一张珍贵的剑意封灵符。',
          effects: { items: ['jianqi_fu'], karma: -6 },
        },
      },
    ],
  },
  {
    id: 'wrl_qn_s15',
    title: '青牛 · 蜂崖石蜜',
    region: 'qingniu',
    pool: 'wild',
    tier: 1,
    weight: 3,
    minRealm: 0,
    maxRealm: 2,
    text: '向阳花谷的赤岩壁上挂着一座水缸大小的野生金蜂巢，蜜蜡滴落青石，引得百步外蜂蝶盘旋。这群青牛金蜂常年采食山间灵花，酿出的石崖灵蜜最宜炼气修士滋补气血。',
    choices: [
      {
        label: '以烟熏驱蜂，割取半块金黄蜜脾',
        hint: '气运与根骨检定 · 巧取灵蜜',
        roll: {
          p: 0.6,
          attrs: { 根骨: 0.012, 气运: 0.014 },
          success: {
            text: '艾草青烟袅袅升起，金蜂嗡嗡退避。你利落割下两斤温润如琥珀的灵蜜，当场含化一口，周身暖流涌动。',
            effects: { hpPct: 0.35, exp: 75, items: ['peiyuan_dan'] },
          },
          fail: {
            text: '山风忽转吹散艾烟，蜂群铺天盖地追着你蜇了半里地，满头满脸青肿如桃，只抢回一星半点蜜蜡。',
            effects: { hp: -22, exp: 30 },
          },
        },
      },
      {
        label: '撑起灵力护罩强行摘取蜂王浆',
        hint: '耗 30 灵力 · 稳得上品蜜露',
        cost: { mp: 30 },
        outcome: {
          text: '金蜂撞在灵罩上叮当作响却不得寸进。你从容取出一小瓶晶莹蜂王浆，又留足余蜜给蜂群过冬，不伤根本。',
          effects: { exp: 85, lifespan: 2, attrs: { 根骨: 1 }, karma: 6 },
        },
      },
      {
        label: '顺着金蜂采蜜路径反寻深山灵花圃',
        hint: '神识检定 · 舍近求远寻灵草',
        roll: {
          p: 0.56,
          attrs: { 神识: 0.015 },
          success: {
            text: '追踪三里翻过乱石岗，竟真在背风洼地里发现几株无人采摘的百年灵草！',
            effects: { items: ['lingcao', 'lingcao'], exp: 50 },
          },
          fail: {
            text: '蜂影没入乱云之中无迹可寻，你白走了一趟山路，倒也活动了筋骨。',
            effects: { exp: 35 },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_qn_s16',
    title: '青牛 · 孤峰烽燧',
    region: 'qingniu',
    pool: 'wild',
    tier: 1,
    weight: 3,
    minRealm: 0,
    maxRealm: 2,
    text: '青牛脉北巅残存着一座前朝乱世所筑的石砌烽火台，砖缝间长满枯黄狗尾草。台顶箭垛下竟刻着一行仓促剑字：「妖潮将至，吾守此三日，后来者勿忘收骨。」石垛角落靠着一副早已风化的白骨与半囊生锈铁箭。',
    choices: [
      {
        label: '收敛遗骨葬于松下，重修烽台石碑',
        hint: '厚葬先烈 · 得浩然正气与福缘',
        cost: { month: 1 },
        outcome: {
          text: '你挖坑敛骨立碑，在遗骸肋下发现一枚贴身佩戴的古旧铁戒与残破猎弓。收葬毕，恍觉肩头沉重一轻，心魔微退。',
          effects: { items: ['liegong', 'jingang_fu'], karma: 18, demon: -8, attrs: { 道心: 2 } },
        },
      },
      {
        label: '立于烽台观山川走势，推演古人布防阵理',
        hint: '悟性检定 · 观地势悟阵道',
        roll: {
          p: 0.58,
          attrs: { 悟性: 0.016 },
          success: {
            text: '俯瞰青牛山七道隘口，昔年守将依山就势的奇正之道历历在目，竟令你对天地阵势生出几分豁然开朗之感。',
            effects: { lawExp: 10, lawId: 'array', exp: 70, attrs: { 悟性: 1 } },
          },
          fail: {
            text: '山雾漫上来遮住了半数谷口，你仅看清几条捷径，记入舆图便下了烽台。',
            effects: { exp: 45 },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_qn_s17',
    title: '青牛 · 冰瀑灵鲤',
    region: 'qingniu',
    pool: 'wild',
    tier: 2,
    weight: 3,
    minRealm: 0,
    maxRealm: 2,
    text: '寒冬深涧，十丈飞瀑半数冻作晶莹冰帘。冰幕之后的深潭并未封冻，一尾通体赤红、额生微凸肉角的尺长灵鲤正顶着激流一次次跃向冰崖，每坠落一次便激起一圈淡金水雾。',
    choices: [
      {
        label: '挥出一道柔劲托举灵鲤跃过冰瀑',
        hint: '耗 20 灵力 · 助灵物化龙积大善缘',
        cost: { mp: 20 },
        outcome: {
          text: '赤鲤借你柔劲一跃冲破冰帘，于半空清啸一声竟尾鳍一扫，将潭底一只前人遗落的药囊拍上岸来，旋即顺上游灵泉远去。囊中是一枚回灵丹与一枚凝气丹。',
          effects: { items: ['huiling_dan', 'ningqi_dan'], karma: 16, attrs: { 气运: 2 }, exp: 65 },
        },
      },
      {
        label: '观灵鲤逆流不屈之姿，在冰潭边练剑悟势',
        hint: '悟性检定 · 借势悟剑',
        roll: {
          p: 0.56,
          attrs: { 悟性: 0.015, 道心: 0.012 },
          success: {
            text: '一跃再跃，百折不挠。你手中长剑随潭水激荡起舞，竟隐隐触到一丝顺逆相生的剑道真意。',
            effects: { lawExp: 12, lawId: 'sword', exp: 80, attrs: { 道心: 1 } },
          },
          fail: {
            text: '寒风凛冽，你挥剑半日手脚僵直，唯有气血比往日更耐寒了几分。',
            effects: { exp: 55, attrs: { 根骨: 1 } },
          },
        },
      },
      {
        label: '撒网擒下灵鲤，熬汤大补气血',
        hint: '杀生图补 · 强壮根骨却增业障',
        outcome: {
          text: '赤鲤虽滑溜，终究敌不过修士法力。当夜一锅红汤入腹，筋骨发热如炭，只是梦里总觉有寒水拍岸。',
          effects: { attrs: { 根骨: 2 }, hpPct: 0.4, karma: -14, demon: 5 },
        },
      },
    ],
  },
  {
    id: 'wrl_qn_s18',
    title: '青牛 · 苔碑负屃',
    region: 'qingniu',
    pool: 'wild',
    tier: 2,
    weight: 3,
    minRealm: 0,
    maxRealm: 2,
    text: '荒藤缠绕的山坳里卧着一尊半陷泥土的青石龟趺，碑身已断，唯独石龟背上还留着几行被苔藓遮蔽的古篆。抚去青苔，竟是三百年前某位散修刻下的《枯荣吐息经》总纲。',
    choices: [
      {
        label: '静心拓印石龟古篆，逐字推敲吐纳之法',
        hint: '悟性 ≥ 11 · 悟得黄阶养命功法',
        require: 'char.attrs.悟性 >= 11',
        requireHint: '悟性不足十一，难解古篆微言',
        cost: { month: 1 },
        outcome: {
          text: '一月寒暑交替，你观石龟旁草木荣枯，终于参透碑文所载的养命吐纳之理，灵力愈发绵长深厚。',
          effects: {
            expPct: 0.18,
            lifespan: 4,
            techniques: [{
              id: 'wt_chanyi_jue', name: '《枯荣吐息经》', grade: '黄',
              speed: 0.08, atk: 0.05, def: 0.07, lifespan: 22, lawId: 'time', artName: '秋叶枯荣印',
            }],
          },
        },
      },
      {
        label: '以神识叩击龟首，试探石趺中是否藏有暗匣',
        hint: '神识检定 · 探查石碑机关',
        roll: {
          p: 0.54,
          attrs: { 神识: 0.015, 气运: 0.01 },
          success: {
            text: '石龟颌下果然有一处机括！轻按三寸，吐出一只油纸小盒，内藏一枚凝气丹、一枚培元丹与三十块灵石。',
            effects: { items: ['ningqi_dan', 'peiyuan_dan'], stones: 30 },
          },
          fail: {
            text: '石龟纹丝不动，反惊起草丛里几条山蝰，你挥袖震散毒蛇，只采了几株周边药草。',
            effects: { items: ['lingcao'], exp: 35 },
          },
        },
      },
      {
        label: '清扫石龟四周荒藤，磕头谢过前辈留法之恩',
        hint: '敬贤重道 · 小幅增长悟性与业力',
        outcome: {
          text: '虽未全懂古篆，字里行间的淡泊之意已足以安神定志。清扫完毕，你神清气爽下山而去。',
          effects: { exp: 58, karma: 8, attrs: { 悟性: 1 } },
        },
      },
    ],
  },
  {
    id: 'wrl_qn_s19',
    title: '青牛 · 猎户铁夹',
    region: 'qingniu',
    pool: 'wild',
    tier: 1,
    weight: 4,
    minRealm: 0,
    maxRealm: 2,
    text: '枯叶铺满的兽径上，一只毛色如雪的小山獐被精铁捕兽夹死死咬住后腿，血迹已染红周边苔藓。不远处的老猎户正提着柴刀匆匆赶来，腰间却别着一块非金非铁的乌黑镇纸——细看竟是未开刃的玄铁原胚。',
    choices: [
      {
        label: '掏出二十五灵石买下山獐与那块乌黑铁块',
        hint: '耗 25 灵石 · 救生灵兼得玄铁',
        cost: { stones: 25 },
        outcome: {
          text: '老猎户大喜过望，不仅放了山獐，还爽快把拾来的黑铁镇纸一并相赠。你替山獐敷上金疮药放归山林，袖中已多了一块好玄铁。',
          effects: { items: ['xuantie'], karma: 14, exp: 40 },
        },
      },
      {
        label: '只出手替山獐止血，劝老猎户换些良善生计',
        hint: '慈悲济物 · 增善业与道心',
        outcome: {
          text: '你塞给老猎户几粒碎银，又以灵力合拢山獐伤口。山獐奔入密林前频频回首，竟衔来一株赤茎灵草放在你脚畔。',
          effects: { items: ['lingcao'], karma: 16, attrs: { 道心: 1 } },
        },
      },
      {
        label: '此乃山林弱肉强食常态，旁观片刻便离去',
        hint: '不涉凡俗因果 · 悟自然大道',
        outcome: {
          text: '万物相食本是天理。你收敛怜悯之心，步伐更显沉静稳重。',
          effects: { exp: 52, attrs: { 道心: 1 } },
        },
      },
    ],
  },
  {
    id: 'wrl_qn_s20',
    title: '青牛 · 路畔茶棚',
    region: 'qingniu',
    pool: 'world',
    tier: 1,
    weight: 4,
    minRealm: 0,
    maxRealm: 2,
    text: '官道岔口搭着一间茅草茶棚，三两赶路散修正围着缺口大碗高谈阔论，说的是青牛山深处近日现出古修洞府异象。棚角坐着个衣衫褴褛的瘦道人，自顾自啃着冷馍，桌上却摆着一面裂了角的旧铜镜。',
    choices: [
      {
        label: '替瘦道人添一壶热茶两碟卤肉，虚心请教',
        hint: '耗 15 灵石 · 慧眼识奇人',
        cost: { stones: 15 },
        outcome: {
          text: '瘦道人狼吞虎咽罢，抹抹嘴低声道：「那些人说的洞府早被挖空了，唯独东崖石隙里还有我早年埋下的一壶培元丹，送你罢。」言讫扬长而去。',
          effects: { items: ['peiyuan_dan', 'huiling_dan'], karma: 10, attrs: { 气运: 1 } },
        },
      },
      {
        label: '凑到散修桌旁套问洞府虚实',
        hint: '魅力检定 · 探听真假消息',
        roll: {
          p: 0.6,
          attrs: { 魅力: 0.015, 神识: 0.01 },
          success: {
            text: '几碗粗茶下肚，那几名散修便把山中禁制方位抖落了个干净，还顺手与你交换了几味炼丹灵草。',
            effects: { items: ['lingcao'], exp: 55, reputation: 6 },
          },
          fail: {
            text: '散修们见你是生面孔，嘴上胡诌了一通假话，险些把你引去毒蛇窝。幸得你及时察觉折返。',
            effects: { exp: 25 },
          },
        },
      },
      {
        label: '细观茶棚外过往商队，静待顺路护镖活计',
        hint: '务实赚取灵石 · 顺带历练',
        cost: { month: 1 },
        outcome: {
          text: '你接下一趟护送药材至山脚集镇的短镖，沿途顺手惊退两批山匪，稳稳赚得一笔报酬。',
          effects: { stones: 62, reputation: 8, exp: 48 },
        },
      },
    ],
  },
  {
    id: 'wrl_qn_s21',
    title: '青牛 · 破刹残钟',
    region: 'qingniu',
    pool: 'wild',
    tier: 2,
    weight: 3,
    minRealm: 0,
    maxRealm: 2,
    text: '荒烟蔓草掩映着一座倾颓古刹，唯有大殿废墟中悬着一口千斤青铜古钟，钟身爬满绿锈却毫无裂纹。山风穿过破窗，古钟竟无风微鸣，余韵悠长，震得你识海微微发清。',
    choices: [
      {
        label: '以掌力轻叩古钟三下，借钟声涤荡心魔',
        hint: '道心检定 · 震散郁结杂念',
        roll: {
          p: 0.62,
          attrs: { 道心: 0.015, 根骨: 0.01 },
          success: {
            text: '三声钟鸣如清泉洗耳，丹田滞涩与往日心魔尘垢竟被震散大半，连带着经脉也愈发通透。',
            effects: { demon: -14, exp: 75, attrs: { 道心: 2 } },
          },
          fail: {
            text: '用力稍猛，钟声反震得你耳膜嗡嗡作响，气血翻涌半晌方才平复。',
            effects: { hp: -18, demon: -5 },
          },
        },
      },
      {
        label: '细察古钟内壁，寻觅昔年高僧铭文',
        hint: '神识检定 · 窥探钟腹秘藏',
        roll: {
          p: 0.55,
          attrs: { 神识: 0.015, 悟性: 0.01 },
          success: {
            text: '钟腹内壁果真刻着佛门镇邪符纹，梁木缝隙里还压着一张未曾褪色的镇魔破邪符！',
            effects: { items: ['poxie_fu'], lawExp: 8, lawId: 'karma', exp: 55 },
          },
          fail: {
            text: '钟腹积满蝙蝠粪污，只摸出几枚前朝旧铜钱与一块微弱灵石。',
            effects: { stones: 24, exp: 35 },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_qn_s22',
    title: '青牛 · 伤鹤栖松',
    region: 'qingniu',
    pool: 'wild',
    tier: 2,
    weight: 3,
    minRealm: 0,
    maxRealm: 2,
    text: '青牛云崖老松枝头，落着一只羽翼染血的白羽灵鹤。它腿上系着半截刻有青云符纹的铜环，左翅插着一枚泛蓝的淬毒弩箭，此刻正警惕地缩颈盯着你，喉间发出清越而虚弱的哀鸣。',
    choices: [
      {
        label: '取疗伤丹替灵鹤拔箭疗毒，放归青冥',
        hint: '消耗疗伤丹 · 结仙禽奇缘',
        cost: { item: 'liaoshang_dan' },
        outcome: {
          text: '灵鹤通晓人性，任你拔箭敷药。片刻后伤势大好，绕你盘旋三周，自喙中吐出一枚清香四溢的凝气丹与一枚玉简，长鸣冲霄而去。',
          effects: { items: ['ningqi_dan', 'yujian_yangshen'], karma: 20, reputation: 10 },
        },
      },
      {
        label: '以自身灵力缓缓逼出箭毒，留守半月照料',
        hint: '耗一月 · 无丹亦救灵鹤',
        cost: { month: 1 },
        outcome: {
          text: '你每日引灵泉润洗鹤羽。月余后灵鹤展翅辞别，临行前用翼尖轻点你眉心，留下一缕轻灵御风真意。',
          effects: {
            karma: 16,
            expPct: 0.16,
            attrs: { 气运: 1 },
            techniques: [{
              id: 'wt_suofeng_jue', name: '《缩风御影诀》', grade: '黄',
              speed: 0.09, atk: 0.07, def: 0.06, lifespan: 6, lawId: 'space', artName: '御风裂影斩',
            }],
          },
        },
      },
      {
        label: '顺着毒箭来向搜索，揪出偷猎灵禽的邪修',
        hint: '追踪猎手 · 战采药黑修',
        combat: {
          enemy: 'herb_thief',
          win: {
            text: '你在崖下灌木丛中撞见持弩黑修，三剑将其伏诛，缴获解毒药粉替灵鹤疗伤，又得其积攒的灵石。',
            effects: { stones: 68, items: ['jiexin_dan'], karma: 15 },
          },
          lose: {
            text: '黑修见行踪败露抛下烟雾弹偷袭，你负伤退避，再回松枝时灵鹤已不知所踪。',
            effects: { hp: -26, injury: 1 },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_qn_s23',
    title: '青牛 · 雾市野笋',
    region: 'qingniu',
    pool: 'world',
    tier: 1,
    weight: 4,
    minRealm: 0,
    maxRealm: 2,
    text: '春雨过后，青牛镇集市一早便飘满清甜泥土气。几名山民挑着沾露的新鲜春笋叫卖，其中一只破竹筐角落里，混着两根通体泛着淡玉光泽、根须如银丝的「灵玉笋」——山民只当是长得怪些的嫩笋，标价不过数枚铜钱。',
    choices: [
      {
        label: '按灵材实价付给山民二十灵石，买下灵玉笋',
        hint: '耗 20 灵石 · 仁厚交易得灵珍',
        cost: { stones: 20 },
        outcome: {
          text: '山民捧着灵石惊得说不出话，连连把筐里最好的野菌也塞给你。当晚你清炖灵玉笋入腹，只觉木灵清气充盈四肢百骸。',
          effects: { exp: 90, lifespan: 2, karma: 12, hpPct: 0.3 },
        },
      },
      {
        label: '佯作不知，花几文散碎银钱捡漏买走',
        hint: '不耗灵石 · 占凡人小利',
        outcome: {
          text: '你随手丢下几枚碎银便抱走灵玉笋。虽炼化了不少精纯木灵气，心中却总觉占了老实山民便宜。',
          effects: { exp: 80, karma: -6, items: ['lingcao'] },
        },
      },
      {
        label: '点破此笋非凡，嘱咐山民拿去落霞药铺卖个好价',
        hint: '济贫扬善 · 得功德与好名声',
        outcome: {
          text: '山民千恩万谢，逢人便夸青牛山来了位活菩萨仙师。数日后你途经镇口，竟有热心乡绅赠你一瓶上好回灵丹。',
          effects: { items: ['huiling_dan'], karma: 18, reputation: 12 },
        },
      },
    ],
  },
  {
    id: 'wrl_qn_s24',
    title: '青牛 · 红土古窑',
    region: 'qingniu',
    pool: 'wild',
    tier: 1,
    weight: 3,
    minRealm: 0,
    maxRealm: 2,
    text: '山坳赤泥坡上坍塌着一座烧制瓦罐的旧土窑，窑壁经年累月受地火炙烤，凝结出一层晶莹如琉璃的赤红釉壳。窑底灰烬中，隐约露出半只烧裂却未融化的赤铜小鼎。',
    choices: [
      {
        label: '顶着残余地火热气，取出赤铜小鼎与红釉矿石',
        hint: '根骨检定 · 探火取材',
        roll: {
          p: 0.58,
          attrs: { 根骨: 0.014, 气运: 0.01 },
          success: {
            text: '小鼎虽已开裂难作法宝，却残留着半枚凝火符纹与两块上好赤阳炎石，颇值一笔灵石。',
            effects: { items: ['chiyang_shi', 'chiyang_shi'], lawExp: 6, lawId: 'pill', exp: 55 },
          },
          fail: {
            text: '窑顶松土骤塌，灼热灰烬烫伤手臂，你狼狈滚出窑口，只抓出一块赤阳炎石。',
            effects: { hp: -20, items: ['chiyang_shi'] },
          },
        },
      },
      {
        label: '借窑口地火温养随身法器与丹田真元',
        hint: '耗一月 · 稳固火行灵力',
        cost: { month: 1 },
        outcome: {
          text: '你在暖融融的红土窑前吐纳一月，只觉四肢百骸寒湿尽除，修为扎实推进一截。',
          effects: { expPct: 0.18, attrs: { 根骨: 1 }, hpPct: 0.3 },
        },
      },
    ],
  },
  {
    id: 'wrl_qn_s25',
    title: '青牛 · 山洪漂棺',
    region: 'qingniu',
    pool: 'wild',
    tier: 2,
    weight: 3,
    minRealm: 0,
    maxRealm: 2,
    text: '连日暴雨引发山洪，浑浊浪涛冲刷过乱石滩，竟将一口漆黑阴沉木棺椁搁浅在浅滩礁石上。棺盖钉着七枚锈蚀镇魂铜钉，如今已松脱两枚，缝隙里渗出缕缕寒雾。',
    choices: [
      {
        label: '重钉铜钉，择高燥阳坡将其重新安葬',
        hint: '平息阴患 · 获大功德与防身护符',
        outcome: {
          text: '你运力将七枚铜钉尽数敲回，移棺葬于向阳松坡。棺底泥沙中滑出一张金刚护身符与一枚培元丹，既无怨煞，反似故人答谢。',
          effects: { items: ['jingang_fu', 'peiyuan_dan'], karma: 20, demon: -8 },
        },
      },
      {
        label: '撬开棺盖一观，看是否乃古修坐化遗棺',
        hint: '冒险开棺 · 恐惊阴煞',
        combat: {
          enemy: 'creek_spirit', displayName: '棺中阴煞',
          win: {
            text: '棺中阴煞扑出即被你剑光斩散。待寒雾落尽，棺内枯骨旁竟放着一枚完好的凝气丹、一张护心符与一袋灵石。',
            effects: { items: ['ningqi_dan', 'huxin_fu'], stones: 65, karma: -10 },
          },
          lose: {
            text: '阴煞寒毒蚀入肺腑，你仓皇退走，连咳数口淤血。',
            effects: { hp: -30, injury: 1, karma: -6 },
          },
        },
      },
      {
        label: '以火行灵气焚化浮棺，免得顺流祸害下游村庄',
        hint: '耗 25 灵力 · 断绝后患',
        cost: { mp: 25 },
        outcome: {
          text: '烈火熊熊燃起，阴沉木化作焦炭，一缕黑烟凄厉消散于雨雾之中。火烬里唯余一块烧不化的玄铁块。',
          effects: { items: ['xuantie'], karma: 12, exp: 60 },
        },
      },
    ],
  },
  {
    id: 'wrl_qn_s26',
    title: '青牛 · 荒岭嫁女',
    region: 'qingniu',
    pool: 'world',
    tier: 2,
    weight: 3,
    minRealm: 0,
    maxRealm: 2,
    text: '晦朔无月之夜，青牛荒岭小径竟吹吹打打走来一支八人抬的朱红花轿队。唢呐声高亢凄厉，纸扎灯笼泛着惨绿微光，轿夫脚步轻飘如踏棉花。行至路口，纸人媒婆尖声笑道：「前头好俊的郎君，可愿讨一杯喜酒喝？」',
    choices: [
      {
        label: '拔剑诵清心诀，一剑斩破阴魅幻象',
        hint: '道心检定 · 破除荒岭山魅迷障',
        roll: {
          p: 0.58,
          attrs: { 道心: 0.015, 根骨: 0.01 },
          success: {
            text: '剑光如昼，花轿纸人顷刻化作满地枯叶与腐朽木偶！一头藏身树后的青背老狼见幻术被破，惨叫着丢下嘴里叼着的储物小袋夺路而逃。',
            effects: { stones: 55, items: ['jiexin_dan'], exp: 75, karma: 10 },
          },
          fail: {
            text: '绿灯骤亮，迷魂烟雾扑面而来，竟是一群劫道邪修借鬼神之名设伏！',
            combat: {
              enemy: 'rogue',
              win: {
                text: '斩杀装神弄鬼的邪修后，你收缴了他的法囊与两瓶丹药。',
                effects: { stones: 72, items: ['huiling_dan'], karma: 12 },
              },
              lose: {
                text: '中了迷烟力竭，你强行冲破包围逃出荒岭，损失不轻。',
                effects: { hp: -28, stones: -20 },
              },
            },
          },
        },
      },
      {
        label: '拱手贺喜，抛出一枚引气丹权当贺礼后速退',
        hint: '消耗引气丹 · 礼敬异类避祸',
        cost: { item: 'yinqi_dan' },
        outcome: {
          text: '花轿中传来一声轻盈女笑，素手掀帘抛出一张折叠精巧的神行符回礼。唢呐声渐行渐远，林间复归漆黑。',
          effects: { items: ['shenxing_fu', 'jingang_fu'], exp: 50 },
        },
      },
      {
        label: '屏息敛气伏于路边巨石之后，待其过境',
        hint: '神识隐匿 · 不沾是非',
        outcome: {
          text: '你以龟息法藏于石影中。送亲队擦肩而过，阴风刺骨却未察觉你的气息，半炷香后一切消散无踪。',
          effects: { exp: 48, attrs: { 神识: 1 } },
        },
      },
    ],
  },
  {
    id: 'wrl_qn_s27',
    title: '青牛 · 参娃遁土',
    region: 'qingniu',
    pool: 'wild',
    tier: 2,
    weight: 3,
    minRealm: 0,
    maxRealm: 2,
    text: '深秋红叶满坡，你在老桦树根下听见清脆稚童笑声。拨开腐叶，竟见一株长出人形胖藕般须根的老山参，顶着三枚红彤彤的籽实，刚与你对上眼便「吱」一声往泥里钻！',
    choices: [
      {
        label: '迅速抛下红绳缠住参茎，截断土脉擒获',
        hint: '身法与气运检定 · 采得百年灵参',
        roll: {
          p: 0.56,
          attrs: { 气运: 0.015, 神识: 0.012 },
          success: {
            text: '红绳如灵蛇锁住地气，肥嫩老山参再难遁走。你小心掘出完整参身，此乃足年份的珍稀灵药，生服或入药皆妙！',
            effects: { items: ['lingcao', 'peiyuan_dan'], lifespan: 3, exp: 70 },
          },
          fail: {
            text: '慢了半息，老山参倏地钻入磐石缝隙消失无踪，只在泥里留下一缕浓郁药香与几根细须。',
            effects: { exp: 45, hpPct: 0.15 },
          },
        },
      },
      {
        label: '不伤参体，只轻摘两枚成熟红籽便放它遁去',
        hint: '留其生机 · 得参籽与大福报',
        outcome: {
          text: '参娃察觉你并无恶意，怯生生探出半个身子，抖落三枚饱满红籽后钻入深土。你吞服红籽，气血充盈且心中坦荡。',
          effects: { hpPct: 0.35, exp: 75, karma: 14, attrs: { 气运: 1 } },
        },
      },
    ],
  },
  {
    id: 'wrl_qn_s28',
    title: '青牛 · 荒野试剑',
    region: 'qingniu',
    pool: 'wild',
    tier: 1,
    weight: 4,
    minRealm: 0,
    maxRealm: 2,
    text: '青牛岭平石坪上，一名身着洗得发白青衫的年轻散修正在晨风中反复演练一式平刺，汗透重衣。见你腰佩灵器路过，他收剑抱拳，眼中满是切磋之意：「山野寂寥，道友可愿与在下拆上十招，彼此印证剑路？」',
    choices: [
      {
        label: '欣然拔剑相迎，点到即止切磋武艺',
        hint: '以剑会友 · 战劫道同阶剑修（切磋无怨）',
        combat: {
          enemy: 'bandit',
          win: {
            text: '十余合后你一剑挑开他手中青钢剑，青衫散修哈哈大笑，甘拜下风，慷慨赠你一瓶自备回灵丹与几句练剑心得。',
            effects: { items: ['huiling_dan'], exp: 80, lawExp: 8, lawId: 'sword', reputation: 8 },
          },
          lose: {
            text: '对方基础剑招竟极为扎实，一式回马枪逼得你连退三步。他忙收锋致歉，赠你一粒疗伤丹后拱手作别。',
            effects: { items: ['liaoshang_dan'], exp: 55, attrs: { 悟性: 1 } },
          },
        },
      },
      {
        label: '指出他出剑时肩沉半寸的破绽，口头论剑',
        hint: '悟性检定 · 不动干戈亦增修为',
        roll: {
          p: 0.62,
          attrs: { 悟性: 0.015, 魅力: 0.01 },
          success: {
            text: '青衫散修依言再刺，剑风立时锐利三分！他欣喜若狂，将随身珍藏的一张剑意封灵符拱手相赠。',
            effects: { items: ['jianqi_fu'], reputation: 10, karma: 8, exp: 60 },
          },
          fail: {
            text: '二人各执己见争论了半个时辰，虽未说服对方，倒也互相启发了不少思路。',
            effects: { exp: 50, attrs: { 道心: 1 } },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_qn_s29',
    title: '青牛 · 落星枯松',
    region: 'qingniu',
    pool: 'wild',
    tier: 2,
    weight: 3,
    minRealm: 0,
    maxRealm: 2,
    text: '青牛山深处一处浅坑冒着微弱青烟，坑心焦土里嵌着一块拳头大小的暗银陨石，表面遍布蜂窝状纹路，在星光下竟隐隐散发清冷微芒。坑边已有一头赤眼山猪伏低身躯，似乎贪恋陨石温热，不肯离去。',
    choices: [
      {
        label: '驱杀赤眼山猪，起出天外陨石',
        hint: '激战妖猪 · 得炼器玄铁与星力感悟',
        combat: {
          enemy: 'wild_boar',
          win: {
            text: '妖猪伏诛，你撬出尚带余温的暗银陨铁。此物乃天外星铁与玄铁共生之材，捧在掌心隐隐牵动周天星气。',
            effects: { items: ['xuantie'], lawExp: 8, lawId: 'star', stones: 40, exp: 65 },
          },
          lose: {
            text: '妖猪獠牙横扫逼退你数丈，你唯恐引来更大妖兽，只得暂且退走。',
            effects: { hp: -24 },
          },
        },
      },
      {
        label: '夜间于浅坑旁观星吐纳，借陨石余辉引气',
        hint: '神识检定 · 避战引星辉',
        roll: {
          p: 0.58,
          attrs: { 神识: 0.014, 悟性: 0.012 },
          success: {
            text: '趁山猪酣睡，你隔着十丈静坐引气。星辉顺着陨石折射而下，令你灵力凝练不少，隐约窥见北斗步法之理。',
            effects: { expPct: 0.18, lawExp: 10, lawId: 'star', attrs: { 神识: 1 } },
          },
          fail: {
            text: '夜半乌云遮月，星辉散尽，山猪翻身低吼，你只得悄然离去。',
            effects: { exp: 42 },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_qn_s30',
    title: '青牛 · 药篓孤童',
    region: 'qingniu',
    pool: 'world',
    tier: 1,
    weight: 4,
    minRealm: 0,
    maxRealm: 2,
    text: '暮色四合，山坳破柴房里缩着一个八九岁的瘦弱孤童，正就着干草啃半块生山药。你灵目一扫，竟发觉这孩子眉心藏着一丝极淡的草木灵气，虽不足以惊动大宗，却也是难得的修道苗子。',
    choices: [
      {
        label: '赠他一瓶引气丹与几块灵石，指明去落霞仙城拜师之路',
        hint: '耗 25 灵石 · 种下善果',
        cost: { stones: 25 },
        outcome: {
          text: '孤童瞪大眼睛跪下连磕三个响头，把你的道号牢牢记在心底。山风清朗，你只觉道心愈发明亮。',
          effects: { karma: 20, reputation: 10, attrs: { 道心: 2 }, exp: 45 },
        },
      },
      {
        label: '留宿一夜，教他一套强身健体的吐纳呼吸法',
        hint: '不耗资财 · 传道解惑',
        outcome: {
          text: '一宿灯火，孤童学得极为认真。临别时他把自己藏在墙缝里的几株野灵草全塞进你背囊。',
          effects: { items: ['lingcao'], karma: 14, exp: 55 },
        },
      },
    ],
  },
  {
    id: 'wrl_qn_s31',
    title: '青牛 · 腐泽拾遗',
    region: 'qingniu',
    pool: 'wild',
    tier: 2,
    weight: 3,
    minRealm: 0,
    maxRealm: 2,
    text: '青牛山低洼处有一片终年冒着硫磺气泡的泥沼，枯枝间挂着半片染血的青色道袍，泥水中隐约露出一只鼓囊囊的皮革法囊。沼泽水面平静得诡异，唯有几处水草不自然地微微晃动。',
    choices: [
      {
        label: '以剑气挑起法囊，同时全神戒备水中伏击',
        hint: '果敢取物 · 战腐沼毒蟾',
        combat: {
          enemy: 'mire_toad',
          win: {
            text: '藏在泥下的毒蟾暴起偷袭，却早被你一剑斩断舌信！挑回法囊打开一看，竟有灵石数十与一枚碧灵聚气戒。',
            effects: { items: ['biling_jie', 'jiexin_dan'], stones: 55, exp: 75 },
          },
          lose: {
            text: '毒液糊住双眼，你只得舍弃法囊抽身急退，狼狈不堪。',
            effects: { hp: -26, injury: 1 },
          },
        },
      },
      {
        label: '先向泥沼投石试探，待毒物现身再远程施法驱赶',
        hint: '神识检定 · 谨慎图利',
        roll: {
          p: 0.6,
          attrs: { 神识: 0.015, 悟性: 0.01 },
          success: {
            text: '巨石砸起浪花，毒蟾受惊潜入深泥。你趁机用长藤钩回法囊，里头藏着一瓶培元丹与三十余灵石。',
            effects: { items: ['peiyuan_dan'], stones: 36, exp: 55 },
          },
          fail: {
            text: '长藤缠上了水底枯桩，用力一扯竟将法囊撕破，灵石沉入淤泥，仅捞回一张湿透的护身符纸。',
            effects: { items: ['jingang_fu'], exp: 30 },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_qn_s32',
    title: '青牛 · 溪石洗剑',
    region: 'qingniu',
    pool: 'wild',
    tier: 1,
    weight: 3,
    minRealm: 0,
    maxRealm: 2,
    text: '山涧白石如练，清溪冲刷出一块光滑如镜的青色磨剑石。石面上深深浅浅留着数十道不同年代的磨刃痕迹，细听流水撞石之声，竟与拔剑出鞘的铮鸣暗暗合拍。',
    choices: [
      {
        label: '掬清溪水拭剑，顺水流节奏演练剑招',
        hint: '耗一月 · 磨砺剑意与法力',
        cost: { month: 1 },
        outcome: {
          text: '流水不争先，争的是滔滔不绝。一月苦练下来，你出剑时的凝滞感尽散，剑道感悟悄然精进。',
          effects: { expPct: 0.2, lawExp: 10, lawId: 'sword', attrs: { 悟性: 1 } },
        },
      },
      {
        label: '沿着青石下游摸索，寻找古人失落的磨刀灵石',
        hint: '气运检定 · 沙中淘金',
        roll: {
          p: 0.58,
          attrs: { 气运: 0.016 },
          success: {
            text: '白沙底下竟真藏着一块被溪水打磨圆润的青锋剑坯与十余块细碎灵石！',
            effects: { items: ['qingfeng_jian'], stones: 24, exp: 45 },
          },
          fail: {
            text: '摸了半日只捡到几块冰凉鹅卵石，倒也洗去了满身风尘。',
            effects: { hpPct: 0.2, mpPct: 0.2, exp: 35 },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_qn_s33',
    title: '青牛 · 破屋借宿',
    region: 'qingniu',
    pool: 'world',
    tier: 1,
    weight: 4,
    minRealm: 0,
    maxRealm: 2,
    text: '大雪封山，你推开半塌的护林木屋避寒。屋内火塘边已坐着一位裹着羊皮袄的独臂老兵，正用铁锅煮着一锅雪水野姜汤。见你进门，他抬眼看了一眼你腰间剑穗，淡淡道：「火还旺，坐下烤烤罢，别动我那半坛烈酒就行。」',
    choices: [
      {
        label: '取出一枚疗伤丹化入姜汤，替老兵驱散陈年箭伤寒毒',
        hint: '消耗疗伤丹 · 雪夜暖人心',
        cost: { item: 'liaoshang_dan' },
        outcome: {
          text: '姜汤入腹，老兵断臂处隐痛顿消。他沉默良久，自怀里掏出一张泛黄皮革递给你——竟是他早年随商队进山时画下的灵草秘点图，另附一张神行符。',
          effects: { items: ['lingcao', 'shenxing_fu'], karma: 15, attrs: { 魅力: 1 }, exp: 60 },
        },
      },
      {
        label: '围炉夜话，听老兵讲半生沙场与山野见闻',
        hint: '静听沧桑 · 稳固道心',
        outcome: {
          text: '雪落无声，炉火噼啪。听罢凡人一世悲欢离合，你对长生二字反倒多了几分清醒与敬畏。',
          effects: { exp: 65, demon: -8, attrs: { 道心: 2 } },
        },
      },
    ],
  },
  {
    id: 'wrl_qn_s34',
    title: '青牛 · 霞光石缝',
    region: 'qingniu',
    pool: 'wild',
    tier: 2,
    weight: 3,
    minRealm: 0,
    maxRealm: 2,
    text: '清晨日出东岭，一束朝霞恰好斜射进青牛峰半腰一处狭窄石隙。刹那间石隙里折射出七彩微光，似有灵玉生辉，然缝隙幽深曲折，仅容一臂探入。',
    choices: [
      {
        label: '以神识先探虚实，再运灵力吸出缝中灵物',
        hint: '神识检定 · 谨防毒虫机关',
        roll: {
          p: 0.6,
          attrs: { 神识: 0.015, 气运: 0.012 },
          success: {
            text: '神识绕开两只蛰伏的毒蜈蚣，灵力精准卷出一枚蒙尘玉简与三块灵石——竟是失传已久的《青风剑谱玉简》！',
            effects: { items: ['yujian_qingfeng'], stones: 30, exp: 55 },
          },
          fail: {
            text: '指尖刚入缝隙便被潜伏的赤尾毒蝎蛰了一口，幸得你及时运功逼毒，只扯出几块普通水晶。',
            effects: { hp: -18, exp: 35 },
          },
        },
      },
      {
        label: '趁朝霞未散盘坐石缝前，吸纳一线先天紫气',
        hint: '稳妥修炼 · 增进修为与灵力',
        outcome: {
          text: '朝阳紫气借石壁灵玉折射，精纯无比。半个时辰吐纳，竟抵得上平日半月苦修。',
          effects: { expPct: 0.18, mpPct: 0.35, attrs: { 悟性: 1 } },
        },
      },
    ],
  },

  /* ============================================================================
   * 二、落霞仙城（luoxia · 炼气至元婴 · 45 节点）
   * ============================================================================ */

  /* ---------- 链一：地下鬼市（4 段） ---------- */
  {
    id: 'wrl_lx_ghost_1',
    title: '落霞 · 鬼市提灯',
    region: 'luoxia',
    pool: 'world',
    tier: 2,
    weight: 4,
    minRealm: 0,
    maxRealm: 3,
    once: true,
    text: '落霞仙城西坊有条终年潮湿的「无影巷」，白日里不过是几间卖粗瓷香烛的破铺子，唯有子夜打更声过，墙角枯井旁才会亮起一盏糊着青纸的竹骨灯笼。\n\n提灯人戴着青铜无面假面，哑着嗓子冲你伸出三根手指：「三十块灵石买张入场竹筹，里头卖的都是白日坊市见不得光的好东西。道友可敢下去瞧瞧？」',
    choices: [
      {
        label: '抛去三十灵石换取青竹筹，戴上面具入井',
        hint: '耗 30 灵石 · 堂堂正正踏入地下鬼市',
        cost: { stones: 30 },
        outcome: {
          text: '青竹筹入手冰凉。枯井侧壁无声滑开一道青石暗梯，往下十丈，竟是一座灯火昏黄、人影幢幢的地下洞天集市。',
          effects: { exp: 50, flag: { 落霞鬼市正入: true } },
          goto: 'wrl_lx_ghost_2',
        },
      },
      {
        label: '亮出神识威压试探提灯人，寻隙免费潜入',
        hint: '神识检定 · 省下灵石却易惹鬼市暗哨',
        roll: {
          p: 0.54,
          attrs: { 神识: 0.015, 魅力: 0.01 },
          success: {
            text: '提灯人面具下微不可察地一震，只当你是什么隐姓埋名的宗门老怪，忙躬身递过竹筹，分文不敢索取。',
            effects: { reputation: 6, flag: { 落霞鬼市威压入: true } },
            goto: 'wrl_lx_ghost_2',
          },
          fail: {
            text: '暗巷阴影里骤然亮起两柄淬毒短刀，鬼市看门散修冷笑道：「不交筹钱还想硬闯？」',
            combat: {
              enemy: 'bandit',
              win: {
                text: '你两招逼退守门刀客，提灯人见势不妙忙赔笑放行，你拾起竹筹径直走入地下暗梯。',
                effects: { stones: 35, exp: 55 },
                goto: 'wrl_lx_ghost_2',
              },
              lose: {
                text: '暗巷狭窄难展拳脚，你挨了一刀只得翻墙退回大街，回头已不见灯影。',
                effects: { hp: -26, injury: 1 },
              },
            },
          },
        },
      },
      {
        label: '黑市鱼龙混杂，记下位置便回坊市正街',
        hint: '谨守清净 · 不涉黑市风险',
        outcome: {
          text: '你转身步入灯火通明的主街，顺路在丹阁买茶歇脚，心中丝毫不染俗尘焦躁。',
          effects: { exp: 45, attrs: { 道心: 1 } },
        },
      },
    ],
  },
  {
    id: 'wrl_lx_ghost_2',
    title: '落霞 · 哑摊赌玉',
    region: 'luoxia',
    pool: 'branch',
    tier: 2,
    weight: 0,
    minRealm: 0,
    maxRealm: 3,
    text: '鬼市规矩奇特：摊主一概不开口，买卖全凭指尖比划灵石数目。你行至第三座石台前，黑布上摆着三件古怪旧物——一只缠满红绳的漆木匣、半柄断口发蓝的寒铁剑，以及一块沾着泥垢的残缺玉简。\n\n身旁一名戴着狐狸面具的筑基黑袍客正死死盯着那半柄断剑，似在盘算加价。',
    choices: [
      {
        label: '以神识暗扫三物，出八十灵石买下最隐晦的那块泥玉简',
        hint: '耗 80 灵石 · 神识检定辨真伪',
        cost: { stones: 80 },
        roll: {
          p: 0.62,
          attrs: { 神识: 0.016, 气运: 0.012 },
          success: {
            text: '泥垢之下灵纹完好，竟是一卷录有雷法的《奔雷掌秘典》残简！摊主哑然一瞬，终究愿赌服输将玉简推到你手边。',
            effects: { items: ['yujian_benlei'], flag: { 鬼市淘得真简: true } },
            goto: 'wrl_lx_ghost_3',
          },
          fail: {
            text: '擦去泥垢，玉简内字迹已毁去八成，仅余几句基础行气法门与一枚夹在泥里的回灵丹。',
            effects: { items: ['huiling_dan'], exp: 65 },
            goto: 'wrl_lx_ghost_3',
          },
        },
      },
      {
        label: '与狐面黑袍客竞价，抢下那半柄泛蓝断剑',
        hint: '耗 100 灵石 · 恐结下鬼市冤家',
        cost: { stones: 100 },
        outcome: {
          text: '你一锤定音夺下断剑，剑身虽断，寒霜铁材却极其精纯。狐面黑袍客冷哼一声，袖袍一甩，目光却阴森地锁定了你的背影。',
          effects: { items: ['hanbing_jian'], flag: { 鬼市夺剑结怨: true } },
          goto: 'wrl_lx_ghost_3',
        },
      },
      {
        label: '花五十灵石买走红绳漆木匣，赌一把未知气运',
        hint: '耗 50 灵石 · 开匣吉凶难料',
        cost: { stones: 50 },
        outcome: {
          text: '解开红绳，木匣中竟卧着一张镇魔破邪符与一枚碧血生肌丹，还夹着一张通往鬼市深处密室的赤铜令牌！',
          effects: { items: ['poxie_fu', 'bixue_dan'], flag: { 鬼市得密室令: true } },
          goto: 'wrl_lx_ghost_3',
        },
      },
    ],
  },
  {
    id: 'wrl_lx_ghost_3',
    title: '落霞 · 暗渠截杀',
    region: 'luoxia',
    pool: 'branch',
    tier: 3,
    weight: 0,
    minRealm: 0,
    maxRealm: 3,
    text: (s) => `你刚离开摊位转入鬼市通往城外暗渠的石廊，头顶青灯骤灭。${s.flags['鬼市夺剑结怨'] ? '那名狐面黑袍客果然按捺不住，带着两名手下封死了前后去路，冷笑道：「留下断剑与储物袋，饶你一具全尸！」' : '两名尾随多时的断魂刀客自水渠两侧纵身跃出，显是鬼市惯常黑吃黑的秃鹫，刀锋直指你的咽喉！'}`,
    choices: [
      {
        label: '冷笑拔剑，于暗渠水光中正面杀出一条血路',
        hint: '以杀立威 · 战筑基断魂刀客',
        combat: {
          enemy: 'blade_rogue', displayName: '鬼市劫修',
          win: {
            text: '剑光映亮漆黑暗渠，为首刀客胸口中剑坠入黑水，余党肝胆俱裂仓皇遁走。你在其尸身摸出一方刻着「冥灯」二字的暗市密令。',
            effects: { stones: 140, items: ['ningqi_dan'], reputation: 12, flag: { 鬼市暗渠反杀: true } },
            goto: 'wrl_lx_ghost_4',
          },
          lose: {
            text: '刀势狠辣逼人，你拼着硬受一刀借水遁逃出暗渠，险些折在黑市。',
            effects: { hp: -42, injury: 1 },
          },
        },
      },
      {
        label: '祭出神行符借暗渠岔道甩开追兵，直奔鬼市主事阁',
        hint: '消耗神行符 · 借鬼市规矩反制劫修',
        cost: { item: 'shenxing_fu' },
        outcome: {
          text: '你身化残影掠过暗渠，恰在鬼市巡逻执事面前露面。那几名劫修坏了市规，反被执事当场拿住，你则获主事阁单独召见。',
          effects: { exp: 80, reputation: 10, flag: { 鬼市借规反制: true } },
          goto: 'wrl_lx_ghost_4',
        },
      },
      {
        label: '亮出鬼市密室赤铜令，喝退拦路宵小',
        require: 'flag("鬼市得密室令")',
        requireHint: '未得密室赤铜令，难以震慑',
        hint: '持令震慑 · 不战而屈人之兵',
        outcome: {
          text: '赤铜令牌幽光一闪，两名刀客如遭雷击，噗通跪倒在地连连叩首让路。你冷哼一声，大步迈向鬼市最深处的黑玉阁。',
          effects: { reputation: 14, attrs: { 道心: 1 } },
          goto: 'wrl_lx_ghost_4',
        },
      },
    ],
  },
  {
    id: 'wrl_lx_ghost_4',
    title: '落霞 · 冥灯主事',
    region: 'luoxia',
    pool: 'branch',
    tier: 3,
    weight: 0,
    minRealm: 0,
    maxRealm: 3,
    text: '穿过水帘，一座雕着百鬼夜行图的黑玉小阁赫然在目。屏风后坐着一位摇着白骨扇的鬼市主事，声音不辨男女：「道友在吾这小池塘里搅动风云，倒有几分胆魄。这枚压仓底的古玉与一册散修秘录，今日便算与道友结个善缘——不知你要明面上的正道清名，还是暗地里的鬼市厚利？」',
    choices: [
      {
        label: '接过主事所赠厚礼，成为鬼市不记名贵客',
        hint: '得筑基丹、掌心五雷符与百余灵石',
        outcome: {
          text: '黑玉盘缓缓推来，其上放着一枚圆润筑基丹、一张掌心五雷符与百余灵石。自此落霞地下黑市对你敞开暗门，只是正道清誉略沾尘埃。',
          effects: { items: ['zhuji_dan', 'zhangxin_leifu'], stones: 120, karma: -8, flag: { 落霞鬼市贵客: true } },
        },
      },
      {
        label: '婉拒黑市重贿，只换取那册《五行杂气功》旧抄本',
        hint: '不染黑道因果 · 习得黄阶混沌秘典',
        outcome: {
          text: '屏风后传来一声意味深长的轻笑。旧抄本轻飘飘飞落你手中，走出枯井时东方已白，晨霞洒满落霞长街。',
          effects: {
            expPct: 0.22,
            attrs: { 道心: 2 },
            techniques: [{
              id: 'wt_wuxing_za', name: '《五行杂气功》', grade: '黄',
              speed: 0.08, atk: 0.07, def: 0.08, lifespan: 12, lawId: 'chaos', artName: '五行轮转掌',
            }],
          },
        },
      },
      {
        label: '暗记暗渠出口坐标，出城后密报落霞城守卫清剿劫修窝点',
        hint: '替天行道 · 获高额声望与城主府嘉奖',
        outcome: {
          text: '三日后落霞城卫雷霆出动，虽让鬼市主事闻风远遁，却将盘踞暗渠的劫修一网打尽。城主府悬赏发下，青州坊市皆传你义举。',
          effects: { stones: 180, reputation: 28, karma: 22, items: ['huxin_fu'] },
        },
      },
    ],
  },

  /* ---------- 链二：旧族遗玉（4 段） ---------- */
  {
    id: 'wrl_lx_clan_1',
    title: '落霞 · 典当残佩',
    region: 'luoxia',
    pool: 'world',
    tier: 2,
    weight: 4,
    minRealm: 0,
    maxRealm: 3,
    once: true,
    text: '落霞城南门「聚宝当铺」门前一阵喧哗。一名身着洗白锦缎的少年正死死攥着半块刻有「霜岳」古篆的青玉佩，与两名趾高气昂的赵家管事争执不休。\n\n原来林氏旧族十年前遭逢大变没落，少年为救病重老母不得不典当传家玉佩，赵家管事却故意将百石灵玉压价至十块碎石，还冷笑要强抢。',
    choices: [
      {
        label: '出面喝退赵家恶奴，按百块灵石公道价收下玉佩',
        hint: '耗 100 灵石 · 解旧族少年之危',
        cost: { stones: 100 },
        outcome: {
          text: '赵家管事忌惮你气度不凡，撂下狠话灰溜溜离去。少年含泪拜谢，临走前低声道：「恩公，这半块玉佩曾是我林氏藏剑阁的钥匙，若他日凑齐另一半，必有惊天机缘。」',
          effects: { karma: 18, reputation: 12, flag: { 落霞仗义买玉: true } },
          goto: 'wrl_lx_clan_2',
        },
      },
      {
        label: '一柄剑横在当铺门槛，迫赵家管事赔礼滚蛋，分文不取玉佩',
        hint: '拔刀相助 · 恐引赵家报复',
        combat: {
          enemy: 'bandit',
          win: {
            text: '几名护院打手被你三招扫出十步外，街坊哄然叫好。林氏少年感动莫名，执意将半块残佩塞入你怀中，只求你护其母子逃离赵家耳目。',
            effects: { karma: 22, reputation: 16, flag: { 落霞怒打赵奴: true } },
            goto: 'wrl_lx_clan_2',
          },
          lose: {
            text: '当铺内忽然窜出一名赵家供奉暗算，你肩头受创，只得护着少年挤入人群暂避。',
            effects: { hp: -28, karma: 10 },
          },
        },
      },
      {
        label: '静待赵家抢走玉佩后，尾随其管事寻机夺宝',
        hint: '袖手旁观 · 坐山观虎斗',
        outcome: {
          text: '你隐入巷角暗影。半炷香后赵家管事揣着玉佩大摇大摆转入僻静小巷，正撞上你冰冷的目光。',
          effects: { karma: -12, flag: { 落霞暗尾夺玉: true } },
          goto: 'wrl_lx_clan_2',
        },
      },
    ],
  },
  {
    id: 'wrl_lx_clan_2',
    title: '落霞 · 霜岳故宅',
    region: 'luoxia',
    pool: 'branch',
    tier: 2,
    weight: 0,
    minRealm: 0,
    maxRealm: 3,
    text: (s) => s.flags['落霞暗尾夺玉']
      ? '你在暗巷中一掌震晕赵家管事，摸出那半块「霜岳」玉佩，还顺手翻出一张标注着落霞城西荒废林氏老宅地窖的地形图。深夜踏入荒宅，枯井旁竟隐隐泛起剑气寒芒。'
      : '夜深人静，林氏少年领你来到落霞城西早已查封的林家旧宅。荒草齐腰的练武场尽头，半块残佩与石碑凹槽骤然发出清越共鸣，青石地砖向两侧滑开，露出一条冰霜凝结的密道。',
    choices: [
      {
        label: '率先步入冰霜密道，以灵力破开尘封剑禁',
        hint: '悟性检定 · 破解林氏护族剑阵',
        roll: {
          p: 0.56,
          attrs: { 悟性: 0.015, 神识: 0.012 },
          success: {
            text: '石壁上十六道残缺剑纹在你眼中渐成脉络。你挥剑连点三处生门，漫天霜气轰然散去，石门应声洞开。',
            effects: { lawExp: 12, lawId: 'sword', exp: 80, flag: { 林氏破霜阵: true } },
            goto: 'wrl_lx_clan_3',
          },
          fail: {
            text: '一道残留剑气割破你的袖袍，寒意透骨。幸得残佩及时发光护主，石门终究缓缓开启。',
            effects: { hp: -25, exp: 55 },
            goto: 'wrl_lx_clan_3',
          },
        },
      },
      {
        label: '察觉院墙外瓦片轻响，先伏击尾随而至的赵家密探',
        hint: '敏锐警觉 · 战筑基修士',
        combat: {
          enemy: 'cultivator',
          win: {
            text: '原来赵家早已派筑基供奉暗中盯梢！你抢先发难将其斩于荒院之中，搜出另半块「霜岳」玉佩，双佩合璧，密道禁制不攻自破！',
            effects: { stones: 145, items: ['juling_dan'], flag: { 落霞双佩合璧: true } },
            goto: 'wrl_lx_clan_3',
          },
          lose: {
            text: '赵家筑基供奉剑势凌厉，你边战边退护着玉佩跃出院墙，今夜只得暂罢。',
            effects: { hp: -38, injury: 1 },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_lx_clan_3',
    title: '落霞 · 藏剑密阁',
    region: 'luoxia',
    pool: 'branch',
    tier: 3,
    weight: 0,
    minRealm: 0,
    maxRealm: 3,
    text: '密道尽头是一座方圆三丈的寒玉石室。石台中央插着一柄霜纹流转的三尺古剑，剑侧玉匣内封存着林氏镇族玄阶剑典《青霜破岳诀》，还有三瓶保存完好的筑基灵药。\n\n然而刚踏入石室，地面忽然震动——赵家家主亲率数名精锐已破开院门杀入密道，喊杀声震彻地底！',
    choices: [
      {
        label: '拔出石台寒霜古剑，独守密道狭口迎战赵家强敌',
        hint: '一夫当关 · 战赵家筑基供奉',
        combat: {
          enemy: 'cultivator',
          win: {
            text: '寒霜剑在手如臂使指，狭道内一剑冻彻敌锋！赵家精锐死伤惨重，家主见势不可为，惊怒交加喝令退兵。',
            effects: { exp: 120, reputation: 20, karma: 12, flag: { 落霞守阁退赵: true } },
            goto: 'wrl_lx_clan_4',
          },
          lose: {
            text: '寡不敌众，你被逼退至石室暗门，只得抓起几瓶灵药借塌方暗渠遁走。',
            effects: { hp: -40, injury: 1, items: ['bixue_dan'] },
          },
        },
      },
      {
        label: '引爆石室自毁阵眼阻断追兵，携秘典与灵药从水脉撤离',
        hint: '神识检定 · 智脱重围',
        roll: {
          p: 0.6,
          attrs: { 神识: 0.015, 气运: 0.012 },
          success: {
            text: '轰隆巨响中，冰霜剑阵将密道彻底封死，挡住赵家众人。你带着林氏秘藏顺着地下暗河从容遁出城外。',
            effects: { exp: 95, flag: { 落霞智遁藏剑: true } },
            goto: 'wrl_lx_clan_4',
          },
          fail: {
            text: '冰石崩落慢了一步，赵家飞剑穿透烟尘擦伤你后背，幸好终究冲出了水脉暗口。',
            effects: { hp: -32, exp: 70 },
            goto: 'wrl_lx_clan_4',
          },
        },
      },
    ],
  },
  {
    id: 'wrl_lx_clan_4',
    title: '落霞 · 霜剑归宿',
    region: 'luoxia',
    pool: 'branch',
    tier: 3,
    weight: 0,
    minRealm: 0,
    maxRealm: 3,
    text: (s) => s.flags['落霞暗尾夺玉']
      ? '晨雾弥漫城外松林，你摊开林氏藏剑阁遗宝——寒霜古剑、《青霜破岳诀》与灵丹俱在手中。林家孤儿寡母此后命运如何，已与你渐行渐远。'
      : '城外竹亭中，林氏少年见你安然带出先祖遗宝，双膝跪地：「家母重病初愈，我资质愚钝守不住这泼天机缘。请恩公收下镇族剑典，只求留一两瓶丹药与几块灵石，容我母子隐姓埋名度日。」',
    choices: [
      {
        label: '赠少年百块灵石与疗伤药送其远走，自留《青霜破岳诀》',
        hideIf: 'flag("落霞暗尾夺玉")',
        hint: '耗 60 灵石 · 仁义两全获玄阶剑典',
        cost: { stones: 60 },
        outcome: {
          text: '你额外塞给少年六十灵石与一柄防身铁剑，护送母子登上南下商船。返身展开玉匣，寒霜剑意扑面而来，竟与你本源真元无比契合！',
          effects: {
            karma: 24,
            reputation: 18,
            items: ['hanbing_jian'],
            techniques: [{
              id: 'wt_qingshuang_jue', name: '《青霜破岳诀》', grade: '玄',
              speed: 0.13, atk: 0.19, def: 0.08, lifespan: 15, lawId: 'sword', artName: '青霜裂岳剑',
            }],
          },
        },
      },
      {
        label: '将寒霜古剑赠还林氏少年留作念想，只抄录剑典与取丹药',
        hideIf: 'flag("落霞暗尾夺玉")',
        hint: '君子不夺人所爱 · 获剑典与聚灵丹',
        outcome: {
          text: '少年捧剑痛哭，发誓永世铭记大恩。你手握拓本剑典与灵药，顿觉心胸坦荡，剑道之路豁然开朗。',
          effects: {
            karma: 28,
            items: ['juling_dan', 'jianqi_fu'],
            lawExp: 18,
            lawId: 'sword',
            techniques: [{
              id: 'wt_qingshuang_jue', name: '《青霜破岳诀》', grade: '玄',
              speed: 0.13, atk: 0.19, def: 0.08, lifespan: 15, lawId: 'sword', artName: '青霜裂岳剑',
            }],
          },
        },
      },
      {
        label: '独吞寒霜古剑与《青霜破岳诀》，抹尽首尾远遁',
        require: 'flag("落霞暗尾夺玉")',
        hint: '唯利是图 · 尽收旧族遗宝',
        outcome: {
          text: '修仙界弱肉强食，宝物唯德者居之——抑或唯强者居之。你收剑入鞘，将玄阶剑典牢记于心，转身融入茫茫人海。',
          effects: {
            karma: -20,
            demon: 8,
            items: ['hanbing_jian', 'juling_dan'],
            techniques: [{
              id: 'wt_qingshuang_jue', name: '《青霜破岳诀》', grade: '玄',
              speed: 0.13, atk: 0.19, def: 0.08, lifespan: 15, lawId: 'sword', artName: '青霜裂岳剑',
            }],
          },
        },
      },
    ],
  },

  /* ---------- 链三：茶楼说书人（3 段） ---------- */
  {
    id: 'wrl_lx_tea_1',
    title: '落霞 · 听雨茶肆',
    region: 'luoxia',
    pool: 'world',
    tier: 2,
    weight: 4,
    minRealm: 0,
    maxRealm: 3,
    once: true,
    text: '落霞城「听雨轩」茶楼高朋满座。醒木一拍，台上那位双鬓斑白、摇着破折扇的说书先生清了清嗓子，开口讲的竟不是凡朝演义，而是三百年前一位落霞金丹剑修孤身镇压城外赤蛟的旧闻。\n\n话到兴处，老先生忽然停扇望向你这一桌，似笑非笑添了一句：「可惜那枚镇蛟剑印至今还埋在落霞河底石龟口中，世人只当是戏言呢。」',
    choices: [
      {
        label: '赏二十灵石茶钱，散场后请说书先生雅间一叙',
        hint: '耗 20 灵石 · 探寻秘闻真假',
        cost: { stones: 20 },
        outcome: {
          text: '茶客散尽，老先生慢悠悠斟满一杯雨前龙井，压低嗓音道：「满堂数十修士，唯有道友眼皮跳了一下。今夜亥时落霞桥头，我带你去瞧一桩真假难辨的旧案。」',
          effects: { exp: 45, attrs: { 悟性: 1 }, flag: { 茶楼邀约夜探: true } },
          goto: 'wrl_lx_tea_2',
        },
      },
      {
        label: '以神识暗中探查老先生修为底细',
        hint: '神识检定 · 莫非隐世名宿？',
        roll: {
          p: 0.56,
          attrs: { 神识: 0.015, 道心: 0.01 },
          success: {
            text: '神识触及其身，竟如隔云望月般深不可测！老先生折扇轻敲桌面，传音入密：「小友神识颇佳，今晚子时城西旧河堤一见。」',
            effects: { attrs: { 神识: 2 }, flag: { 茶楼传音赴约: true } },
            goto: 'wrl_lx_tea_2',
          },
          fail: {
            text: '神识只探出他是个寻常炼气老头。老先生似乎察觉你的审视，微微一笑合扇退入后台，只留下一张写着「河堤」二字的茶签。',
            effects: { exp: 35 },
            goto: 'wrl_lx_tea_2',
          },
        },
      },
      {
        label: '权当茶余消遣，喝完残茶便回客栈打坐',
        hint: '不信风闻 · 安稳养神',
        outcome: {
          text: '红尘传闻十有九虚。你听罢满堂喝彩，心中生出几分看淡浮华之感，回房吐纳竟格外顺畅。',
          effects: { exp: 65, demon: -6, attrs: { 道心: 1 } },
        },
      },
    ],
  },
  {
    id: 'wrl_lx_tea_2',
    title: '落霞 · 河堤残碑',
    region: 'luoxia',
    pool: 'branch',
    tier: 2,
    weight: 0,
    minRealm: 0,
    maxRealm: 3,
    text: '夜色浓重，落霞河水拍打着废弃旧堤。说书先生已在石栏边等候多时，指着浑浊浪涛下若隐若现的一尊巨石赑屃：「三百年前我先祖亲眼见过那剑修沉印镇妖。只是近年河水阴煞渐重，怕是有邪修动了河底阵脚。」\n\n话音未落，河面轰然炸开水花，三道黑影破浪而出，为首者浑身湿漉漉冒着黑烟，竟是一名勾结水煞的邪修！',
    choices: [
      {
        label: '拔剑护住老先生，跃入浅滩斩杀毁阵邪修',
        hint: '正道除邪 · 战溪涧水煞或邪修',
        combat: {
          enemy: 'rogue',
          win: {
            text: '剑光撕裂河雾，邪修惨呼坠水。你顺势潜入浅滩扶正石龟口中偏斜的镇水剑印，河面阴气顿消，一道清越剑意自石碑涌入你眉心。',
            effects: { exp: 95, karma: 16, lawExp: 12, lawId: 'sword', flag: { 落霞重镇河印: true } },
            goto: 'wrl_lx_tea_3',
          },
          lose: {
            text: '河水冰寒刺骨，邪修借水势反击将你震回岸边。幸得老先生抛出一张雷符惊退恶徒，二人方才脱险。',
            effects: { hp: -28, injury: 1 },
          },
        },
      },
      {
        label: '以掌心五雷符隔空轰散河面阴煞，震退邪修',
        hint: '消耗掌心五雷符 · 雷霆破邪不费血力',
        cost: { item: 'zhangxin_leifu' },
        outcome: {
          text: '一道紫白雷光劈落河心，照亮半座落霞城！邪修与水煞在雷威下灰飞烟灭，石龟口中残印嗡鸣回应，绽出璀璨霞光。',
          effects: { exp: 110, karma: 20, reputation: 16, lawExp: 14, lawId: 'thunder', flag: { 落霞雷镇河印: true } },
          goto: 'wrl_lx_tea_3',
        },
      },
      {
        label: '趁邪修与河阵缠斗，只暗中拓印石龟背上剑诀便走',
        hint: '神识检定 · 渔翁得利',
        roll: {
          p: 0.52,
          attrs: { 神识: 0.015, 气运: 0.012 },
          success: {
            text: '你趁乱跃上龟背，飞速拓下几式残缺剑意，旋即抽身退上河堤。老先生见你虽未拼命却也惊退了邪修，摇头苦笑。',
            effects: { lawExp: 10, lawId: 'sword', exp: 75, karma: -4 },
            goto: 'wrl_lx_tea_3',
          },
          fail: {
            text: '浪头陡然拍来，你脚滑坠入暗流，险些被水草缠住，好容易才爬回岸边。',
            effects: { hp: -24, exp: 40 },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_lx_tea_3',
    title: '落霞 · 折扇遗篇',
    region: 'luoxia',
    pool: 'branch',
    tier: 3,
    weight: 0,
    minRealm: 0,
    maxRealm: 3,
    text: '河风拂晓，落霞城轮廓在朝雾中渐明。说书先生将那柄摇了半生的破纸折扇双手奉上：「老朽寿元无多，先祖托付看守河印的担子总算有了交代。这扇骨夹层里藏着当年那位剑修留下的《红尘问心诀》与一幅落霞剑谱，今日便托付给道友了。」',
    choices: [
      {
        label: '郑重收下折扇，承接《红尘问心诀》与《落霞分光剑》之一',
        hint: '习得《红尘问心诀》· 道心澄明',
        outcome: {
          text: '折扇展开，墨字淡雅却藏锋芒。三日后你再赴听雨轩，台前醒木依旧，那位斑白双鬓的老先生却已云游四海去了。',
          effects: {
            karma: 16,
            expPct: 0.22,
            items: ['qingxin_dan'],
            techniques: [{
              id: 'wt_hongchen_jian', name: '《红尘问心诀》', grade: '黄',
              speed: 0.09, atk: 0.06, def: 0.08, lifespan: 14, lawId: 'karma', artName: '问心清风掌',
            }],
          },
        },
      },
      {
        label: '专心参悟扇面剑画，领悟《落霞分光剑》',
        hint: '习得黄阶剑诀 · 霞光分影',
        outcome: {
          text: '扇面绘着落霞映江之景，细看之下每道云纹皆是剑路！你闭目体悟半日，挥剑竟已能化出三道霞光虚影。',
          effects: {
            expPct: 0.22,
            lawExp: 14,
            lawId: 'sword',
            items: ['jianqi_fu'],
            techniques: [{
              id: 'wt_luoxia_jian', name: '《落霞分光剑》', grade: '黄',
              speed: 0.07, atk: 0.11, def: 0.04, lifespan: 5, lawId: 'sword', artName: '落霞孤鹜斩',
            }],
          },
        },
      },
    ],
  },

  /* ---------- 落霞仙城 独立奇遇 01–14 ---------- */
  {
    id: 'wrl_lx_s01',
    title: '落霞 · 丹坊炸炉',
    region: 'luoxia',
    pool: 'world',
    tier: 1,
    weight: 4,
    minRealm: 0,
    maxRealm: 3,
    text: '长街东侧的「回春丹坊」忽然传出一声沉闷巨响，滚滚紫烟从雕花木窗喷涌而出，夹杂着刺鼻焦糊与浓烈药香。一名满脸黑灰的年轻丹童连滚带爬冲出大门，高喊：「掌柜被地火反噬困在里面了，谁来帮把手！」',
    choices: [
      {
        label: '逆烟冲入丹房，运灵力扑灭暴走地火救出掌柜',
        hint: '根骨与灵力检定 · 危急施救',
        cost: { mp: 25 },
        roll: {
          p: 0.62,
          attrs: { 根骨: 0.014, 道心: 0.01 },
          success: {
            text: '你一掌震断地火引管，背起昏迷的老掌柜冲出火海。掌柜苏醒后感激涕零，执意赠你两瓶压箱底的凝气丹与碧血生肌丹。',
            effects: { items: ['ningqi_dan', 'bixue_dan'], karma: 18, reputation: 14 },
          },
          fail: {
            text: '余火灼伤了你的衣袖与臂膀，幸好终究把老掌柜拖出了门外。丹坊赠你疗伤丹与灵石酬谢。',
            effects: { hp: -22, items: ['liaoshang_dan'], stones: 55, karma: 14 },
          },
        },
      },
      {
        label: '在外围布水幕隔绝火势蔓延，护住邻街铺面',
        hint: '稳妥行善 · 赢得街坊赞誉',
        cost: { mp: 15 },
        outcome: {
          text: '水雾及时压住火星，保住了整条药材街。事后坊市执事发下嘉奖灵石，邻铺茶商也赠你几包灵茶。',
          effects: { stones: 45, karma: 10, reputation: 10, exp: 45 },
        },
      },
      {
        label: '趁乱在丹房窗台顺手拾走几粒崩出来的残丹',
        hint: '浑水摸鱼 · 损德获微利',
        outcome: {
          text: '你趁众人忙于救火，飞快捡起一枚熏黑却药性犹存的培元丹和几块碎灵石揣入怀中，转身混入人群。',
          effects: { items: ['peiyuan_dan'], stones: 20, karma: -12, demon: 3 },
        },
      },
    ],
  },
  {
    id: 'wrl_lx_s02',
    title: '落霞 · 赝品玉简',
    region: 'luoxia',
    pool: 'world',
    tier: 1,
    weight: 4,
    minRealm: 0,
    maxRealm: 3,
    text: '城东旧货摊前挤着七八个看热闹的散修。一个尖嘴猴腮的摊贩正眉飞色舞兜售一卷声称「自古仙洞府出土」的发黄剑谱，标价一百二十灵石。你凝神一瞥，发觉玉简表面灵光浮躁，显是新近拿灵液熏烤做旧的赝品，唯有压在桌脚那块灰扑扑的镇纸石略显古怪。',
    choices: [
      {
        label: '不动声色，只出三十灵石买下压桌脚的灰镇纸',
        hint: '耗 30 灵石 · 慧眼捡漏',
        cost: { stones: 30 },
        roll: {
          p: 0.64,
          attrs: { 神识: 0.015, 气运: 0.012 },
          success: {
            text: '摊贩只当你是冤大头，爽快成交。回到客栈刮去外层石皮，里头竟包着一块精纯玄铁与半张古剑符！',
            effects: { items: ['xuantie', 'jianqi_fu'], exp: 55 },
          },
          fail: {
            text: '切开石皮却只是一块含铁量稍高的山岩，勉强值个十来块灵石，倒也长了份眼力教训。',
            effects: { stones: 12, attrs: { 悟性: 1 } },
          },
        },
      },
      {
        label: '当众点破玉简作假手法，免得新人散修上当',
        hint: '主持公道 · 恐惹摊贩怀恨',
        outcome: {
          text: '围观散修恍然大悟，纷纷散去，险些掏钱的年轻剑修朝你连连拱手道谢。摊贩气得吹胡子瞪眼，却慑于城中禁斗规矩不敢造次。',
          effects: { karma: 14, reputation: 12, exp: 45 },
        },
      },
      {
        label: '冷眼旁观，顺手记下坊市造假套路以自警',
        hint: '长一分世故 · 增神识悟性',
        outcome: {
          text: '人心险恶甚于妖森毒瘴。你看完整出双簧戏码，嘴角微扬，转身离去。',
          effects: { exp: 50, attrs: { 神识: 1 } },
        },
      },
    ],
  },
  {
    id: 'wrl_lx_s03',
    title: '落霞 · 悬赏石榜',
    region: 'luoxia',
    pool: 'world',
    tier: 2,
    weight: 4,
    minRealm: 0,
    maxRealm: 3,
    text: '城门瓮城石壁上新贴出一张朱砂悬赏令：近日有一名擅长使快刀的采药黑修屡屡在落霞城外十里官道劫杀孤身散修，万宝阁出价百余灵石与一枚丹药，悬赏其首级或擒拿归案。',
    choices: [
      {
        label: '揭下悬赏令，出城诱敌将其伏诛',
        hint: '领赏除害 · 战采药黑修',
        cost: { month: 1 },
        combat: {
          enemy: 'herb_thief',
          win: {
            text: '你佯装满载灵草独行林道，果真引出那黑修扑杀。三合定胜负，你携其腰牌返城领赏，满堂掌声不绝。',
            effects: { stones: 125, items: ['peiyuan_dan', 'huxin_fu'], reputation: 18, karma: 15 },
          },
          lose: {
            text: '黑修竟在官道设下绊索毒菱，你负伤突围返城，只得将悬赏令退回执事处。',
            effects: { hp: -32, injury: 1 },
          },
        },
      },
      {
        label: '细观悬赏令上勾勒的刀痕特征，记下其出招弱点',
        hint: '暂不接榜 · 增进实战见识',
        outcome: {
          text: '你对着画像揣摩半晌，将这路阴毒快刀的拆解之法熟记于心，日后城外行走更有底气。',
          effects: { exp: 65, attrs: { 悟性: 1 } },
        },
      },
    ],
  },
  {
    id: 'wrl_lx_s04',
    title: '落霞 · 屋檐夜追',
    region: 'luoxia',
    pool: 'world',
    tier: 2,
    weight: 3,
    minRealm: 0,
    maxRealm: 3,
    text: '皓月当空，落霞城万家灯火渐熄。你正在客栈窗畔打坐，忽见两道黑影踏瓦疾驰而过——前头那名身形纤瘦的夜行人怀抱一只描金锦盒，后头紧追不舍的却是城中世家护卫，箭矢呼啸擦瓦而过。\n\n恰在此时，那夜行人足下一滑，竟将锦盒顺手抛进了你敞开的窗棂，眨眼没入夜色！',
    choices: [
      {
        label: '立刻封窗敛息，待护卫过去后细察锦盒来历',
        hint: '神识检定 · 祸福相倚',
        roll: {
          p: 0.58,
          attrs: { 神识: 0.015, 气运: 0.012 },
          success: {
            text: '你以隐息诀骗过搜查。打开锦盒，里头竟是一份世家私通邪修的账册与两张掌心五雷符！次日你匿名投于城主府，自己留了符箓与暗中酬银。',
            effects: { items: ['zhangxin_leifu'], stones: 90, karma: 10 },
          },
          fail: {
            text: '窗外护卫闻声破门而入，认定你是同党，不由分说便拔刀相向！',
            combat: {
              enemy: 'bandit',
              win: {
                text: '你震晕护卫跳窗远遁，只来得及抓走锦盒里的两瓶宁气丹。',
                effects: { items: ['ningqi_dan'], stones: 40, reputation: -6 },
              },
              lose: {
                text: '仓促迎战吃了暗亏，锦盒被夺走不说，还赔了客栈一笔修窗灵石。',
                effects: { hp: -26, stones: -30 },
              },
            },
          },
        },
      },
      {
        label: '原封不动将锦盒抛回瓦面，高呼示警洗清干系',
        hint: '明哲保身 · 得世家谢礼',
        outcome: {
          text: '护卫首领稳稳接住失物，朝你窗前拱手致谢，次日派人送来五十灵石与一瓶清心丹作为酬谢。',
          effects: { stones: 50, items: ['qingxin_dan'], reputation: 8 },
        },
      },
    ],
  },
  {
    id: 'wrl_lx_s05',
    title: '落霞 · 符斋老笔',
    region: 'luoxia',
    pool: 'world',
    tier: 2,
    weight: 3,
    minRealm: 0,
    maxRealm: 3,
    text: '书画巷深处有间极不起眼的「墨云符斋」，白须老符师正伏案用狼毫蘸取妖血朱砂画符，手腕却因年迈隐隐发颤，连废三张黄纸，叹息不止。',
    choices: [
      {
        label: '主动替老符师研墨稳气，请教制符笔意',
        hint: '耗一月 · 悟阵符之道兼得赠符',
        cost: { month: 1 },
        outcome: {
          text: '你以柔和灵力助老符师稳住丹田浮火，一气呵成绘出三张上品符篆。老符师喜出望外，分你两张并传授几句落笔起阵的口诀。',
          effects: { items: ['jingang_fu', 'zhangxin_leifu'], lawExp: 10, lawId: 'array', karma: 10 },
        },
      },
      {
        label: '出八十灵石收购他废纸堆里灵纹尚存的残符',
        hint: '耗 80 灵石 · 悟性检定淘残符',
        cost: { stones: 80 },
        roll: {
          p: 0.6,
          attrs: { 悟性: 0.015, 气运: 0.012 },
          success: {
            text: '你在废纸堆中竟挑出一张只差最后一笔的护心符与一张剑意封灵符，自行补全灵纹后威力丝毫不减！',
            effects: { items: ['huxin_fu', 'jianqi_fu'], exp: 60 },
          },
          fail: {
            text: '大多残符灵性已泄，仅拼凑出一张神行符，倒是对符纹结构有了更深理解。',
            effects: { items: ['shenxing_fu'], lawExp: 8, lawId: 'array' },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_lx_s06',
    title: '落霞 · 灵酿地窖',
    region: 'luoxia',
    pool: 'world',
    tier: 2,
    weight: 3,
    minRealm: 0,
    maxRealm: 3,
    text: '落霞城有家百年老字号「醉仙楼」，掌柜正悬赏招募能耐住寒毒的修士下地窖取出一坛埋了八十年的「寒梅灵酒」——据说酒窖阴脉近日生变，连去两名伙计都冻僵着抬了出来。',
    choices: [
      {
        label: '运转真元入窖起酒，替醉仙楼解难',
        hint: '根骨检定 · 得灵酒与高额报酬',
        roll: {
          p: 0.6,
          attrs: { 根骨: 0.015, 道心: 0.01 },
          success: {
            text: '地窖寒霜扑面，你鼓荡气血硬顶霜气抱出尘封酒坛。掌柜大喜，不仅奉上百块灵石，还斟了两大碗八十年陈酿请你痛饮，灵力暴涨！',
            effects: { stones: 100, expPct: 0.16, hpPct: 0.3, mpPct: 0.3 },
          },
          fail: {
            text: '窖底阴脉竟凝出一股溪涧水煞缠身！你咬牙抱坛冲出地窖，虽赚得酬金，却也受了些寒气暗伤。',
            effects: { stones: 75, hp: -28, attrs: { 根骨: 1 } },
          },
        },
      },
      {
        label: '先向掌柜赊一壶普通灵酒在大堂细品，观人来人往',
        hint: '耗 15 灵石 · 放松心神涤心魔',
        cost: { stones: 15 },
        outcome: {
          text: '酒香清冽，听着邻桌商旅海阔天空地闲谈九州奇闻，你紧绷许久的心弦松弛下来，心魔暗退。',
          effects: { demon: -10, exp: 55, attrs: { 魅力: 1 } },
        },
      },
    ],
  },
  {
    id: 'wrl_lx_s07',
    title: '落霞 · 磨剑窄巷',
    region: 'luoxia',
    pool: 'world',
    tier: 2,
    weight: 3,
    minRealm: 0,
    maxRealm: 3,
    text: '城北铁匠巷尽头，叮当打铁声昼夜不歇。一名赤膊独眼老铁匠正用铁钳夹着一块烧得通红的玄铁反复锻打，见你腰悬佩剑走过，忽然停锤问道：「小子，你的剑沾过血么？敢不敢借老夫的寒水淬一淬锋芒？」',
    choices: [
      {
        label: '付六十灵石，请老铁匠替自己重淬佩剑',
        hint: '耗 60 灵石 · 悟剑锋之理并获兵刃',
        cost: { stones: 60 },
        outcome: {
          text: '寒水滋啦腾起白雾，老铁匠一锤震出满室火星！佩剑经他指点淬锋后寒光暴涨，他还顺手赠你一柄打废却依旧锋利的青锋剑与几句练剑诀窍。',
          effects: { items: ['qingfeng_jian'], lawExp: 12, lawId: 'sword', attrs: { 根骨: 1 }, exp: 65 },
        },
      },
      {
        label: '挽袖替老铁匠拉一个月风箱，以劳换艺',
        hint: '耗一月 · 炼体悟剑兼得锻造酬金',
        cost: { month: 1 },
        outcome: {
          text: '一月拉风箱抡重锤，虎口磨出血泡又结成厚茧。老铁匠满意点头，不仅结了工钱，还将一套护身《玄甲护体功》要诀口授于你。',
          effects: {
            stones: 55,
            attrs: { 根骨: 2 },
            techniques: [{
              id: 'wt_xuanjia_gong', name: '《玄甲护体功》', grade: '黄',
              speed: 0.06, atk: 0.05, def: 0.12, lifespan: 12, lawId: 'array', artName: '玄甲不动钟',
            }],
          },
        },
      },
    ],
  },
  {
    id: 'wrl_lx_s08',
    title: '落霞 · 测字瞎仙',
    region: 'luoxia',
    pool: 'world',
    tier: 1,
    weight: 4,
    minRealm: 0,
    maxRealm: 3,
    text: '城隍庙前老槐树下摆着一张缺腿木桌，桌后坐着个戴墨晶眼镜的干瘦老者，布幡上写着「铁口直断，一字十石」。过往散修多笑他江湖骗子，唯独你路过时，他忽然抬手朝你招了招：「道友眉心隐有紫气却带煞星，不测一字么？」',
    choices: [
      {
        label: '付十块灵石，提笔写下一个「道」字求测',
        hint: '耗 10 灵石 · 气运检定听谶语',
        cost: { stones: 10 },
        roll: {
          p: 0.65,
          attrs: { 气运: 0.016, 悟性: 0.01 },
          success: {
            text: '老者指腹抚过墨迹，忽叹一声：「首在走之，行则通，滞则厄。」寥寥八字如当头棒喝，令你心中积压的破境迷思豁然贯通！',
            effects: { breakBonus: 8, exp: 75, lawExp: 8, lawId: 'karma', attrs: { 道心: 1 } },
          },
          fail: {
            text: '老者摇头晃脑念了一堆模棱两可的吉祥话，你暗笑自己花了冤枉钱，却也顺带消解了几分焦虑。',
            effects: { demon: -5, exp: 30 },
          },
        },
      },
      {
        label: '付三十灵石求一张避凶趋吉的平安符',
        hint: '耗 30 灵石 · 得防身符箓',
        cost: { stones: 30 },
        outcome: {
          text: '老者随手从桌底摸出一张皱巴巴的金刚护身符递给你，嘿嘿笑道：「莫小瞧它，关键时刻能替你挡一劫。」',
          effects: { items: ['jingang_fu'], attrs: { 气运: 1 } },
        },
      },
      {
        label: '笑言「我命由我不由天」，拱手拂袖而去',
        hint: '傲骨铮铮 · 稳固自身道心',
        outcome: {
          text: '身后传来老者一声赞许朗笑：「好个不信命的小娃娃！」你步履愈发坚定。',
          effects: { exp: 55, attrs: { 道心: 2 } },
        },
      },
    ],
  },
  {
    id: 'wrl_lx_s09',
    title: '落霞 · 镖车遇伏',
    region: 'luoxia',
    pool: 'wild',
    tier: 2,
    weight: 4,
    minRealm: 0,
    maxRealm: 3,
    text: '落霞城外十里官道烟尘大起！三辆插着「镇远镖局」青旗的灵马镖车被数名蒙面劫修截在密林口，总镖头左肩中箭，正苦苦死守中间那口贴满封灵符的紫檀货箱。',
    choices: [
      {
        label: '仗剑冲入战团，助镇远镖局杀退劫修',
        hint: '义助镖队 · 战劫道散修',
        combat: {
          enemy: 'bandit',
          win: {
            text: '你斩落两名劫匪头目，余众作鸟兽散。总镖头捂伤抱拳，当场奉上百块灵石与一枚疗伤宝丹，承诺此后镇远镖局在落霞城唯你马首是瞻。',
            effects: { stones: 105, items: ['bixue_dan'], reputation: 18, karma: 16 },
          },
          lose: {
            text: '劫修早有埋伏，乱箭逼退你数步，幸而远处城卫马蹄声响起，贼人被迫撤走。',
            effects: { hp: -28, karma: 6 },
          },
        },
      },
      {
        label: '趁双方血拼，绕后偷袭劫修头领夺其储物袋便撤',
        hint: '气运检定 · 趁火打劫',
        roll: {
          p: 0.55,
          attrs: { 气运: 0.014, 根骨: 0.012 },
          success: {
            text: '你自树冠俯冲一击震昏断后的劫修管账，顺走其腰间鼓囊囊的法囊便远遁林海，谁也没看清你的面目。',
            effects: { stones: 110, items: ['huiling_dan'], karma: -6 },
          },
          fail: {
            text: '不料劫修暗哨就在树下，你反被横刀划伤小腿，狼狈逃回官道。',
            effects: { hp: -24, karma: -4 },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_lx_s10',
    title: '落霞 · 傀儡戏台',
    region: 'luoxia',
    pool: 'world',
    tier: 2,
    weight: 3,
    minRealm: 0,
    maxRealm: 3,
    text: '城隍夜市搭起一座彩绸戏台，台上并无伶人，唯有六具尺许高的木雕傀儡在丝线牵引下演着《白蛇盗仙草》，身段丝滑如活人。你凝神细察，发现那丝线并非蚕丝，而是极细的灵力银丝，操纵傀儡的老匠人正默默隐在幕布后调息。',
    choices: [
      {
        label: '赏五十灵石包场，请教灵丝控物之妙',
        hint: '耗 50 灵石 · 精进神识微操',
        cost: { stones: 50 },
        outcome: {
          text: '老匠人原是机关城流落青州的退役弟子。见你出手大方且眼神识货，便将如何以神识分缕御物的心得倾囊相授。',
          effects: { attrs: { 神识: 2, 悟性: 1 }, lawExp: 10, lawId: 'array', exp: 70 },
        },
      },
      {
        label: '静立台下看完整出戏，细辨傀儡步法玄机',
        hint: '悟性检定 · 偷师一二',
        roll: {
          p: 0.58,
          attrs: { 悟性: 0.015, 神识: 0.012 },
          success: {
            text: '傀儡腾挪闪转暗合奇门方位，你看得如痴如醉，散场时步法竟比先前轻灵许多。',
            effects: { exp: 75, attrs: { 悟性: 1 }, lawExp: 6, lawId: 'array' },
          },
          fail: {
            text: '锣鼓喧天看花了眼，只当看了场热闹好戏，心情倒是愉悦不少。',
            effects: { demon: -6, exp: 40 },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_lx_s11',
    title: '落霞 · 赌石青坊',
    region: 'luoxia',
    pool: 'world',
    tier: 2,
    weight: 4,
    minRealm: 0,
    maxRealm: 3,
    text: '万宝阁偏巷开着一间「开天赌石坊」，案台上堆满自深山开采出来的原矿石皮。人群围着切石刀叫好连连，刚有一名散修切出半块价值连城的赤阳炎石。摊主指着案角三块沾泥原石吆喝：「八十灵石一刀切，神仙难断寸玉！」',
    choices: [
      {
        label: '运神识细察石皮灵纹，花八十灵石切最沉重那块',
        hint: '耗 80 灵石 · 神识与气运赌石',
        cost: { stones: 80 },
        roll: {
          p: 0.56,
          attrs: { 神识: 0.016, 气运: 0.016 },
          success: {
            text: '石刀落下，一抹炽白霞光冲天而起！竟切出一块极品玄铁心与一枚天然凝成的聚灵玉髓，当场便有商贾愿高价收购！',
            effects: { items: ['xuantie', 'juling_dan'], stones: 140, reputation: 8 },
          },
          fail: {
            text: '一刀下去全是白花花的凡石渣，围观人群发出一阵惋惜哄笑。唯有石心夹着几粒碎灵石粉勉强回点本。',
            effects: { stones: 18, attrs: { 道心: 1 } },
          },
        },
      },
      {
        label: '花三十灵石买一块边角废料练手辨矿',
        hint: '耗 30 灵石 · 小赌怡情长见识',
        cost: { stones: 30 },
        roll: {
          p: 0.62,
          attrs: { 气运: 0.014 },
          success: {
            text: '废料里竟藏着一块拇指大小的赤阳炎石，净赚一笔！',
            effects: { items: ['chiyang_shi'], stones: 35 },
          },
          fail: {
            text: '石皮切开空空如也，你哈哈一笑拂袖离去，绝不恋赌。',
            effects: { exp: 40, attrs: { 道心: 1 } },
          },
        },
      },
      {
        label: '十赌九输，冷眼看几刀便转身离去',
        hint: '克制贪念 · 守心明志',
        outcome: {
          text: '见一名散修切垮后失魂落魄，你更觉修行当脚踏实地，不可妄求横财。',
          effects: { exp: 55, demon: -6, attrs: { 道心: 1 } },
        },
      },
    ],
  },
  {
    id: 'wrl_lx_s12',
    title: '落霞 · 绣楼密笺',
    region: 'luoxia',
    pool: 'world',
    tier: 2,
    weight: 3,
    minRealm: 0,
    maxRealm: 3,
    text: '傍晚走过云锦街，二楼雕花绣窗忽然悄无声息飘落一只折成千纸鹤的香笺，正好落在你肩头。抬头望去，绣帘微晃已无人影。纸鹤内写着娟秀小楷：「今夜子时，城南废弃药园有邪修以童男血炼丹，妾身力薄，祈路过义士搭救。」',
    choices: [
      {
        label: '子时准赴城南废药园，查明真相斩妖除魔',
        hint: '仗义赴约 · 战邪修',
        combat: {
          enemy: 'rogue',
          win: {
            text: '药园地窖果真关着三名昏迷孩童！你一剑斩杀正欲开炉的血袍邪修，救出孩童交与城卫。次日一早，客栈门缝里多了一瓶冰肌驻颜丹与匿名致谢信。',
            effects: { items: ['zhuyan_dan', 'qingxin_dan'], karma: 26, reputation: 22, stones: 85 },
          },
          lose: {
            text: '邪修在药园设了毒烟阵，你虽冲破阵脚放跑了孩童，自己却也身中一掌狼狈逃出。',
            effects: { hp: -32, injury: 1, karma: 14 },
          },
        },
      },
      {
        label: '谨防陷阱，先持香笺报予落霞城执事同往',
        hint: '稳妥周全 · 借城卫之力平患',
        outcome: {
          text: '城卫执事验过字迹立时带队合围废药园，一举端掉邪修巢穴。虽未独享首功，却也获赠一份协查酬金与城中赞誉。',
          effects: { stones: 65, karma: 16, reputation: 12, exp: 55 },
        },
      },
    ],
  },
  {
    id: 'wrl_lx_s13',
    title: '落霞 · 桥头灯谜',
    region: 'luoxia',
    pool: 'world',
    tier: 1,
    weight: 4,
    minRealm: 0,
    maxRealm: 3,
    text: '上元灯会，落霞河拱桥挂满千盏琉璃彩灯。桥心最高处悬着一盏三层走马宫灯，灯面上题着一则修仙界丹道谜题：「炉中无火偏生焰，水底藏金不沾尘，九转未成先破壳，打一炼丹枢机。」奖品是一枚筑基期亦眼热的清心丹。',
    choices: [
      {
        label: '凝神思索丹道古理，提笔写下谜底「真阳引汞」',
        hint: '悟性检定 · 夺走马宫灯彩头',
        roll: {
          p: 0.58,
          attrs: { 悟性: 0.016, 神识: 0.01 },
          success: {
            text: '满桥掌声雷动！灯会执事笑眯眯摘下彩头奉上，更有一位丹霞谷游历弟子朝你举杯致意，与你论道半夜。',
            effects: { items: ['qingxin_dan'], lawExp: 10, lawId: 'pill', reputation: 12, exp: 65 },
          },
          fail: {
            text: '答偏了一字，未能摘得头彩。不过与满桥道友共赏花灯，亦得了一枚寻常回灵丹作参与彩头。',
            effects: { items: ['huiling_dan'], exp: 45 },
          },
        },
      },
      {
        label: '不争头彩，只携酒倚栏看万家灯火倒映河心',
        hint: '闲适赏灯 · 抚平心魔增魅力',
        outcome: {
          text: '东风夜放花千树，人间烟火最抚道心。你在灯影长桥下独坐至更深，心境澄明无垢。',
          effects: { demon: -12, attrs: { 魅力: 1, 道心: 1 }, exp: 55 },
        },
      },
    ],
  },
  {
    id: 'wrl_lx_s14',
    title: '落霞 · 败剑武夫',
    region: 'luoxia',
    pool: 'world',
    tier: 2,
    weight: 3,
    minRealm: 0,
    maxRealm: 3,
    text: '城西演武场角落坐着一名满身旧疤的中年汉子，身边插着一柄豁口的铁剑，面前摆着个破碗却不讨钱，只写着「十灵石接我三剑，只比剑招、不动灵力，接住者赠《青山十三剑》全谱」。围观散修皆知他曾是筑基好手，如今丹田受损跌落炼气，剑意却仍凶狠得吓人。',
    choices: [
      {
        label: '丢下十块灵石，收住灵力，拔剑硬接他三记杀剑',
        hint: '耗 10 灵石 · 根骨与悟性检定',
        cost: { stones: 10 },
        roll: {
          p: 0.56,
          attrs: { 根骨: 0.014, 悟性: 0.014 },
          success: {
            text: '三剑快如电闪，震得你虎口裂血，却终究一步未退！独疤汉子畅快大笑，将贴身保存的《青山十三剑》剑谱与半瓶碧血生肌丹尽数抛给你。',
            effects: {
              hp: -15,
              items: ['bixue_dan'],
              lawExp: 10,
              lawId: 'sword',
              techniques: [{
                id: 'wt_qingshan_jian', name: '《青山十三剑》', grade: '凡',
                speed: 0.03, atk: 0.06, def: 0.02, lifespan: 0, lawId: 'sword', artName: '青山叠翠斩',
              }],
            },
          },
          fail: {
            text: '第二剑便被他势大力沉的崩剑震飞手中兵器。你虽落败，却在交锋间摸清了几分重剑发力窍门。',
            effects: { hp: -22, exp: 65, lawExp: 6, lawId: 'sword' },
          },
        },
      },
      {
        label: '赠他一枚培元丹疗养暗伤，请他喝一顿浊酒',
        hint: '消耗培元丹 · 敬重落魄剑客',
        cost: { item: 'peiyuan_dan' },
        outcome: {
          text: '汉子怔住良久，仰头吞下丹药，眼眶微红。酒过三巡，他主动在青石地上为你演练了一遍毕生剑路，令你获益匪浅。',
          effects: { expPct: 0.2, lawExp: 14, lawId: 'sword', karma: 14, reputation: 8 },
        },
      },
    ],
  },
  {
    id: 'wrl_lx_s15',
    title: '落霞 · 药铺讨债',
    region: 'luoxia',
    pool: 'world',
    tier: 2,
    weight: 3,
    minRealm: 0,
    maxRealm: 3,
    text: '青叶街口一阵药香混着哭嚎。两名浑身煞气的刀客堵在「百草堂」门前，踢翻了满地晒药簸箕，逼着老掌柜交出祖传《文武丹火诀》抵债。老掌柜颤声辩称当年只借了八十灵石，利滚利却被他们算成了五百石。',
    choices: [
      {
        label: '拔剑护在百草堂前，替老掌柜打发恶债主',
        hint: '行侠仗义 · 战断魂刀客',
        combat: {
          enemy: 'blade_rogue',
          win: {
            text: '恶客见你剑势凌厉，捂着断臂狼狈逃窜。老掌柜老泪纵横，执意将抄录好的《文武丹火诀》与两株灵草双手奉上。',
            effects: {
              items: ['lingcao', 'peiyuan_dan'],
              karma: 20,
              reputation: 16,
              techniques: [{
                id: 'wt_danlu_huo', name: '《文武丹火诀》', grade: '黄',
                speed: 0.08, atk: 0.06, def: 0.05, lifespan: 16, lawId: 'pill', artName: '赤焰灼灵掌',
              }],
            },
          },
          lose: {
            text: '刀客出手狠辣，你负伤勉强拖到坊市巡卫赶来，总算保住了百草堂药方。',
            effects: { hp: -34, injury: 1, karma: 12 },
          },
        },
      },
      {
        label: '拿出八十灵石本金拍在柜上，当众念出落霞商律令其签字销账',
        hint: '耗 80 灵石 · 依律服人免动干戈',
        cost: { stones: 80 },
        outcome: {
          text: '围观坊客纷纷附和，恶债主理亏又怕招来城主府卫队，只得咬牙收下本金滚蛋。老掌柜赠你一枚筑基期亦可服用的聚灵丹致谢。',
          effects: { items: ['juling_dan'], karma: 22, reputation: 18 },
        },
      },
    ],
  },
  {
    id: 'wrl_lx_s16',
    title: '落霞 · 漕船走私',
    region: 'luoxia',
    pool: 'wild',
    tier: 2,
    weight: 3,
    minRealm: 0,
    maxRealm: 3,
    text: '午夜雾锁落霞河码头，一艘熄了灯火的黑篷漕船正悄悄靠岸。几名蒙面散修抬下数只贴着血红封条的铁木箱，箱缝间竟渗出刺鼻的妖兽腥气与微弱灵光。',
    choices: [
      {
        label: '跃上船头喝破私货，与走私散修交手截获铁箱',
        hint: '劫富济己或除恶 · 战筑基修士',
        combat: {
          enemy: 'cultivator',
          win: {
            text: '领头走私修士伏诛，余人跳水遁走。你撬开铁木箱，里头竟是从妖森偷运进城的妖兽内丹与百余灵石！',
            effects: { items: ['yaoshou_neidan', 'bixue_dan'], stones: 130, karma: 8 },
          },
          lose: {
            text: '船上竟暗藏水阵，你立足不稳坠入寒江，湿漉漉游回岸边。',
            effects: { hp: -34, injury: 1 },
          },
        },
      },
      {
        label: '暗中记下接货商号徽记，次日向万宝阁管事换取线报酬金',
        hint: '神识检定 · 智取线报厚利',
        roll: {
          p: 0.62,
          attrs: { 神识: 0.015, 气运: 0.01 },
          success: {
            text: '你凭借灵目记清船头暗纹。次日万宝阁管事闻讯大喜，爽快赏你九十灵石与一张护心符。',
            effects: { stones: 90, items: ['huxin_fu'], reputation: 10 },
          },
          fail: {
            text: '河雾太浓，看岔了商号徽记，万宝阁管事只给了你些许茶水费便打发出来。',
            effects: { stones: 20, exp: 35 },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_lx_s17',
    title: '落霞 · 古钟旧铺',
    region: 'luoxia',
    pool: 'world',
    tier: 2,
    weight: 3,
    minRealm: 0,
    maxRealm: 3,
    text: '城北古玩街深处有家满是蛛网的铜器铺，角落积灰处倒扣着一只巴掌大小的青铜三足残炉，炉壁隐隐蚀刻着星斗云纹。打盹的老掌柜眯起眼懒洋洋道：「破铜烂铁一堆，看中了给七十灵石拿走。」',
    choices: [
      {
        label: '花七十灵石买下残炉，回府以灵火试炼',
        hint: '耗 70 灵石 · 悟性检定识古宝',
        cost: { stones: 70 },
        roll: {
          p: 0.58,
          attrs: { 悟性: 0.015, 气运: 0.014 },
          success: {
            text: '真元一催，绿锈剥落！炉腹竟藏着一枚古代丹师封存的聚灵丹，与一面巴掌大小、灵韵清明的照妖古镜。',
            effects: { items: ['juling_dan', 'qingming_jing'], lawExp: 10, lawId: 'pill' },
          },
          fail: {
            text: '绿锈褪去只余一只寻常香炉，唯独炉灰里夹着几块压底的赤阳炎石，聊胜于无。',
            effects: { items: ['chiyang_shi'], exp: 50 },
          },
        },
      },
      {
        label: '借故细抚炉壁星纹，只拓印纹路便拱手离去',
        hint: '不花灵石 · 静参古纹',
        outcome: {
          text: '你默记下残炉外壁的七处星斗节点，转身离店时灵台隐隐有所触动。',
          effects: { lawExp: 8, lawId: 'star', exp: 55 },
        },
      },
    ],
  },
  {
    id: 'wrl_lx_s18',
    title: '落霞 · 夕阳擂台',
    region: 'luoxia',
    pool: 'world',
    tier: 2,
    weight: 4,
    minRealm: 0,
    maxRealm: 3,
    text: '落霞广场东侧立着一座青石比武擂台，每逢残阳西下，总有各宗外门弟子与城中散修上台打擂赌彩。此刻台上一名身负双刀的狂傲散修已连胜三场，扬言：「落霞城炼气筑基辈，难道尽是缩头乌龟不成？」',
    choices: [
      {
        label: '缴三十灵石彩头登台应战，挫一挫其锐气',
        hint: '耗 30 灵石 · 擂台交锋战筑基修士',
        cost: { stones: 30 },
        combat: {
          enemy: 'cultivator',
          win: {
            text: '你一招破开双刀封锁，将其震出擂台之外！满场喝彩如雷，擂台庄家当场奉上双倍彩金与一瓶凝气丹。',
            effects: { stones: 160, items: ['ningqi_dan', 'jianqi_fu'], reputation: 22, exp: 95 },
          },
          lose: {
            text: '对手双刀绵密凌厉，你惜败一招跃下擂台，却也在切磋中看清了自己的攻防短板。',
            effects: { hp: -25, exp: 70, attrs: { 悟性: 1 } },
          },
        },
      },
      {
        label: '在台下细观各路修士攻防拆招，博采众长',
        hint: '旁观悟战 · 稳健增进修为',
        outcome: {
          text: '剑修凌厉、体修沉稳、符修诡谲。你在夕阳下观战一个时辰，胸中斗法思路活泛了不少。',
          effects: { exp: 75, attrs: { 悟性: 1 }, lawExp: 6, lawId: 'sword' },
        },
      },
    ],
  },
  {
    id: 'wrl_lx_s19',
    title: '落霞 · 暗街断阵',
    region: 'luoxia',
    pool: 'world',
    tier: 2,
    weight: 3,
    minRealm: 0,
    maxRealm: 3,
    text: '暴雨冲塌了城西一条青石老巷的地砖，露出半截刻满古阵灵纹的玉柱——原是落霞仙城护城大阵的一处百年辅眼，如今灵石槽已裂，灵气正丝丝外泄，引得周边几家商铺阵法频频失灵。',
    choices: [
      {
        label: '耗四十灵石与一缕神识，顺手修补好辅阵灵槽',
        hint: '耗 40 灵石 · 悟阵道兼得城主府嘉赏',
        cost: { stones: 40 },
        outcome: {
          text: '你以灵石重续阵眼，青石巷瞬间霞光微闪恢复如初。恰逢巡城阵师赶来目睹此景，赞不绝口，不仅双倍奉还灵石，更赠你一枚聚灵阵符拓片与声望。',
          effects: { stones: 95, lawExp: 14, lawId: 'array', reputation: 16, karma: 12 },
        },
      },
      {
        label: '趁无人察觉，盘坐巷角偷吸半个时辰外泄灵脉地气',
        hint: '零耗夺灵 · 修为大涨却微损公德',
        outcome: {
          text: '护城主脉灵气精纯远胜寻常灵石。你鲸吞半个时辰后悄然离去，修为精进甚速。',
          effects: { expPct: 0.2, mpPct: 0.4, karma: -6 },
        },
      },
    ],
  },
  {
    id: 'wrl_lx_s20',
    title: '落霞 · 乞丐奇人',
    region: 'luoxia',
    pool: 'world',
    tier: 2,
    weight: 3,
    minRealm: 0,
    maxRealm: 3,
    text: '酒楼后门臭水沟旁蜷着一个衣衫褴褛的癫狂老乞丐，嘴里嚼着半根冷鸭骨，却正用一根枯树枝在泥地上划出玄妙无比的剑气轨迹——每划一笔，泥水竟自行向两侧分开三寸。',
    choices: [
      {
        label: '买一壶烧刀子与一只烧鸡恭敬奉上，静坐一旁观其划泥',
        hint: '耗 25 灵石 · 礼贤下士遇奇缘',
        cost: { stones: 25 },
        outcome: {
          text: '老乞丐扯下鸡腿大嚼，含糊道：「满街瞎子只看衣裳，就你这娃看懂了老子手里的柴火棍。」临走时他用树枝在你眉心一点，一道凌厉剑意轰然灌顶！',
          effects: { lawExp: 18, lawId: 'sword', expPct: 0.18, attrs: { 悟性: 2 } },
        },
      },
      {
        label: '远远默记地上剑痕，不敢轻易打扰高人清修',
        hint: '悟性检定 · 隔岸悟剑',
        roll: {
          p: 0.58,
          attrs: { 悟性: 0.015 },
          success: {
            text: '虽只记下三笔起手式，已足够你受用良久。待你想上前拜谢时，臭水沟旁唯余半截枯枝。',
            effects: { lawExp: 10, lawId: 'sword', exp: 70 },
          },
          fail: {
            text: '一阵晚风吹皱泥水，轨迹瞬间模糊，你惋惜叹息一声离去。',
            effects: { exp: 40 },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_lx_s21',
    title: '落霞 · 戏班魅影',
    region: 'luoxia',
    pool: 'world',
    tier: 2,
    weight: 3,
    minRealm: 0,
    maxRealm: 3,
    text: '城南梨园近日来了个江南水袖戏班，头牌青衣一曲《牡丹亭》唱得满城修士如痴如醉。你坐在二楼包厢听戏，却发觉每当锣鼓收声，后台竟飘出丝丝摄魂阴风，几名打赏最阔绰的富家子弟印堂已然发黑。',
    choices: [
      {
        label: '散场后潜入后台查探，破除迷魂妖法',
        hint: '斩妖除祟 · 战溪涧水煞或邪修',
        combat: {
          enemy: 'creek_spirit', displayName: '戏服水魅',
          win: {
            text: '原是一只附于古戏服上的水魅借戏声采补阳气！你一剑劈碎古戏服，戏班班主吓得跪地磕头，献上珍藏的清心丹与百块灵石酬谢。',
            effects: { items: ['qingxin_dan'], stones: 95, karma: 18, reputation: 14 },
          },
          lose: {
            text: '水袖如索缠住手脚，你被阴风逼退至大堂，只得先去通报城中捉妖司。',
            effects: { hp: -28, demon: 4 },
          },
        },
      },
      {
        label: '以神识在台下暗施镇魂音，不动声色逼走阴魅',
        hint: '神识 ≥ 14 · 润物无声化灾厄',
        require: 'char.attrs.神识 >= 14',
        requireHint: '神识不足十四，难以隔空震慑水魅',
        outcome: {
          text: '你指叩茶盏轻吐一字清音，台上青衣身形骤僵，一缕黑烟自水袖仓皇遁走。戏班免遭血光之灾，你亦功德无量。',
          effects: { karma: 20, demon: -10, exp: 85, attrs: { 道心: 1 } },
        },
      },
    ],
  },
  {
    id: 'wrl_lx_s22',
    title: '落霞 · 屋顶对月',
    region: 'luoxia',
    pool: 'world',
    tier: 1,
    weight: 4,
    minRealm: 0,
    maxRealm: 3,
    text: '中秋之夜，你提壶独登落霞城最高的一座飞檐阁楼赏月。不料琉璃瓦脊上已坐着一位青衫束发的冷峻剑客，正对着一轮明月自斟自饮，腰间长剑嗡嗡轻鸣，似是刚刚突破瓶颈、剑意难平。',
    choices: [
      {
        label: '举壶相邀，与青衫剑客月下论剑共饮',
        hint: '魅力与悟性检定 · 结交高阶同道',
        roll: {
          p: 0.62,
          attrs: { 魅力: 0.014, 悟性: 0.012 },
          success: {
            text: '剑客本性孤傲，听你数语剑理竟大为击节！二人痛饮至天明，临别他赠你一张剑意封灵符与一卷《青风剑谱玉简》。',
            effects: { items: ['jianqi_fu', 'yujian_qingfeng'], exp: 80, reputation: 10 },
          },
          fail: {
            text: '剑客性情冷淡，只与你碰了一杯便御剑化虹离去。不过月色清朗，你独自吐纳亦有所得。',
            effects: { exp: 60, mpPct: 0.25 },
          },
        },
      },
      {
        label: '不发一言，各自背对明月静坐吐纳',
        hint: '君子之交淡如水 · 稳健修行',
        outcome: {
          text: '两道气息在屋脊上彼此映照而不相扰。天明时剑客已去，瓦片上留着一枚温润的回灵丹，权作今夜伴月之谢。',
          effects: { items: ['huiling_dan'], exp: 70, attrs: { 道心: 1 } },
        },
      },
    ],
  },
  {
    id: 'wrl_lx_s23',
    title: '落霞 · 暗拍漏网',
    region: 'luoxia',
    pool: 'world',
    tier: 2,
    weight: 4,
    minRealm: 0,
    maxRealm: 3,
    text: '万宝阁小拍刚刚散场，门外廊柱下却站着个神色焦急的散修，怀里抱着一件刚刚流拍的古旧铜镜，正压低嗓门向过往修士兜售：「八十五灵石！我师妹等着买筑基丹救命，这面镜子真是古墓里挖出来的！」',
    choices: [
      {
        label: '以神识辨明真伪后，出八十五灵石买下古铜镜',
        hint: '耗 85 灵石 · 神识检定',
        cost: { stones: 85 },
        roll: {
          p: 0.6,
          attrs: { 神识: 0.015, 气运: 0.012 },
          success: {
            text: '你注入一缕真元，铜镜骤然绽出朗朗清辉——竟是件蒙尘的玄阶法器清明照妖镜！散修得灵石救命，你得宝物护身，两全其美。',
            effects: { items: ['qingming_jing'], karma: 8, exp: 55 },
          },
          fail: {
            text: '细察之下镜心阵纹已碎了大半，仅能当作护身镜胚，倒也从镜背刮出两块附着的灵矿与一点善缘。',
            effects: { items: ['chiyang_shi'], karma: 10, exp: 45 },
          },
        },
      },
      {
        label: '直接赠他一瓶疗伤丹与二十灵石应急，不买铜镜',
        hint: '耗 20 灵石 · 雪中送炭积大德',
        cost: { stones: 20 },
        outcome: {
          text: '散修眼眶通红，硬塞给你一张贴身收藏的掌心五雷符答谢，连称来日必报大恩。',
          effects: { items: ['zhangxin_leifu'], karma: 18, reputation: 10 },
        },
      },
    ],
  },
  {
    id: 'wrl_lx_s24',
    title: '落霞 · 丹师试药',
    region: 'luoxia',
    pool: 'world',
    tier: 2,
    weight: 3,
    minRealm: 0,
    maxRealm: 3,
    text: '城东药王居贴出红榜，一位怪脾气丹师新研制出一炉「改良凝气散」，重金招募根骨强健的修士试服一粒以观药性，酬金一百二十灵石与一瓶上品丹药，只是后果自负。',
    choices: [
      {
        label: '仗着根骨扎实，毅然吞下试药丹丸',
        hint: '根骨检定 · 高风险高回报',
        roll: {
          p: 0.58,
          attrs: { 根骨: 0.016, 气运: 0.01 },
          success: {
            text: '丹药入腹宛如烈火烹油，你咬牙运转周天硬生生炼化药力！修为骤进一截，丹师狂喜拍案，当场兑现重金与聚灵丹。',
            effects: { stones: 120, items: ['juling_dan'], expPct: 0.18, attrs: { 根骨: 1 } },
          },
          fail: {
            text: '药性过于霸道，震得你经脉隐隐作痛、连吐两口黑血。丹师讪讪致歉，还是按约付了灵石与一瓶清毒解障丹。',
            effects: { hp: -35, stones: 90, items: ['jiexin_dan'] },
          },
        },
      },
      {
        label: '指出其药方中火草过盛之弊，不服药反论丹理',
        hint: '悟性 ≥ 13 · 以理服人获丹师赠礼',
        require: 'char.attrs.悟性 >= 13',
        requireHint: '悟性不足十三，难以窥破药方瑕疵',
        outcome: {
          text: '丹师闻言如遭醍醐灌顶，反复核对药渣后大笑三声，拱手奉上一瓶凝气丹、一瓶培元丹与八十灵石拜师礼般的谢金！',
          effects: { items: ['ningqi_dan', 'peiyuan_dan'], stones: 80, lawExp: 12, lawId: 'pill' },
        },
      },
    ],
  },
  {
    id: 'wrl_lx_s25',
    title: '落霞 · 城门税吏',
    region: 'luoxia',
    pool: 'world',
    tier: 1,
    weight: 4,
    minRealm: 0,
    maxRealm: 3,
    text: '暮春细雨，落霞城东门排起长龙。一名新上任的刻薄税吏正刁难几位背着山货进城的青牛山药农，硬说他们筐里的普通草药属于「灵材」，非要勒索十块灵石入城税，否则便没收全部货物。',
    choices: [
      {
        label: '亮出修士威压出面申斥，替药农讨回公道',
        hint: '仗义执言 · 增声望与善业',
        outcome: {
          text: '税吏见你灵压沉厚不敢造次，灰溜溜放行。药农们感激不尽，执意留下一束夹杂其中的真正百年灵草酬谢。',
          effects: { items: ['lingcao'], karma: 15, reputation: 12 },
        },
      },
      {
        label: '随手替药农垫付十块灵石息事宁人',
        hint: '耗 10 灵石 · 温和行善',
        cost: { stones: 10 },
        outcome: {
          text: '药农连声道谢，临别悄悄塞给你一张自家祖传的深山避瘴药方。',
          effects: { items: ['jiexin_dan'], karma: 12, attrs: { 魅力: 1 } },
        },
      },
    ],
  },
  {
    id: 'wrl_lx_s26',
    title: '落霞 · 飞贼遗囊',
    region: 'luoxia',
    pool: 'world',
    tier: 2,
    weight: 3,
    minRealm: 0,
    maxRealm: 3,
    text: '深更半夜，一条黑影从万宝阁高墙翻出，被护阁剑光削落半截衣袖，慌不择路窜入你所在的僻静客栈小院，顺手把一只沉甸甸的锦囊塞进了假山石缝里便翻墙逃远。',
    choices: [
      {
        label: '取出锦囊原物奉还万宝阁，换取正大光明的谢礼',
        hint: '拾金不昧 · 得声望与贵宾回礼',
        outcome: {
          text: '万宝阁大掌柜验明失物分毫未少，抚须赞叹你品行端方，当场回赠百块灵石与一张护心符，并录名贵宾册。',
          effects: { stones: 100, items: ['huxin_fu'], karma: 20, reputation: 20 },
        },
      },
      {
        label: '悄然取走锦囊中财物，抹去石缝痕迹装作不知',
        hint: '气运检定 · 谨防万宝阁追踪印记',
        roll: {
          p: 0.56,
          attrs: { 神识: 0.015, 气运: 0.012 },
          success: {
            text: '你细心抹去锦囊上的暗藏灵印，里面竟躺着一枚筑基丹与百余灵石！此后数日风平浪静。',
            effects: { items: ['zhuji_dan'], stones: 110, karma: -15, demon: 5 },
          },
          fail: {
            text: '未曾察觉囊底追踪粉，次日便被万宝阁供奉寻上门来，无奈交出失物还赔了五十灵石和解费。',
            effects: { stones: -50, reputation: -12, karma: -10 },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_lx_s27',
    title: '落霞 · 密信错投',
    region: 'luoxia',
    pool: 'world',
    tier: 2,
    weight: 3,
    minRealm: 0,
    maxRealm: 3,
    text: '客栈小二敲门送来一封无署名的火漆密函，只说是一位黑衣客嘱咐交给「甲字三号房的道爷」。你低头一看门牌，自己住的正是甲字三号——拆开蜡封，里头只有一张城外乱葬岗的地图与八个字：「亥时三刻，货到人散。」',
    choices: [
      {
        label: '将计就计赴乱葬岗一探究竟，截胡黑道交易',
        hint: '胆大心细 · 战断魂刀客',
        combat: {
          enemy: 'blade_rogue', displayName: '魔修暗桩头目',
          win: {
            text: '乱葬岗中两拨魔修暗桩正交接灵材，被你突然杀出打得措手不及！你斩杀头目缴获灵石、一枚妖兽内丹与一瓶碧血生肌丹，潇洒离去。',
            effects: { stones: 150, items: ['yaoshou_neidan', 'bixue_dan'], karma: 10 },
          },
          lose: {
            text: '对方早发觉暗号不对，埋伏反扑，你负伤突围逃回城内。',
            effects: { hp: -36, injury: 1 },
          },
        },
      },
      {
        label: '原样封好火漆，转交城中执法队免生是非',
        hint: '谨慎守正 · 得微酬与清名',
        outcome: {
          text: '执法队连夜出动端掉一处魔修暗桩，次日派人送来六十灵石线报赏金。',
          effects: { stones: 60, karma: 12, reputation: 10, exp: 45 },
        },
      },
    ],
  },
  {
    id: 'wrl_lx_s28',
    title: '落霞 · 寒门考校',
    region: 'luoxia',
    pool: 'world',
    tier: 1,
    weight: 4,
    minRealm: 0,
    maxRealm: 3,
    text: '落霞书院外石阶上，几名寒门出身的炼气小修正在苦苦演练基础御气诀，准备参加三日后的仙门外门选拔，却因无人指点屡屡岔气，愁眉苦脸。',
    choices: [
      {
        label: '停步驻足半日，替他们一一疏通错漏行气经脉',
        hint: '传道授业 · 教学相长增悟性',
        outcome: {
          text: '指点旁人反令你自身对基础吐纳之理有了更透彻的体悟。数名寒门弟子磕头拜谢，凑出几株自采灵草与一块赤阳炎石聊表心意。',
          effects: { items: ['lingcao', 'chiyang_shi'], exp: 80, karma: 16, reputation: 14, attrs: { 悟性: 1 } },
        },
      },
      {
        label: '赠予他们几粒引气丹助其冲关，飘然离去',
        hint: '消耗引气丹 · 广结善缘',
        cost: { item: 'yinqi_dan' },
        outcome: {
          text: '少年们捧着丹药如获至宝，齐声高呼前辈高义。你闻声微笑，顿觉神清气爽。',
          effects: { karma: 20, reputation: 16, demon: -8, attrs: { 道心: 1 } },
        },
      },
    ],
  },
  {
    id: 'wrl_lx_s29',
    title: '落霞 · 异域灵商',
    region: 'luoxia',
    pool: 'world',
    tier: 2,
    weight: 3,
    minRealm: 0,
    maxRealm: 3,
    text: '西市胡商客栈前，一位裹着海蓝头巾的东海行商正高声兜售几匣沾着海盐气息的奇物：半截晶莹珊瑚、一瓶海冰凝露，以及几张绘着怪异潮汐星图的残破羊皮。',
    choices: [
      {
        label: '出九十五灵石买下残破星图与海冰凝露',
        hint: '耗 95 灵石 · 提前结缘东海奇珍',
        cost: { stones: 95 },
        outcome: {
          text: '海冰凝露清凉沁脾，竟是一缕碧海玄冰髓碎屑！残图上更勾勒着几条东海归墟暗流走向，令你眼界大开。',
          effects: { items: ['qingxin_dan', 'huiling_dan'], lawExp: 10, lawId: 'star', exp: 70 },
        },
      },
      {
        label: '请行商喝两碗烈酒，打听东海归墟与苍茫妖森近况',
        hint: '耗 15 灵石 · 广闻博识',
        cost: { stones: 15 },
        outcome: {
          text: '行商酒酣耳热，绘声绘色讲述了东海海眼潮汐与妖森古庙传闻，听得你心驰神往。',
          effects: { exp: 65, attrs: { 悟性: 1, 神识: 1 } },
        },
      },
    ],
  },
  {
    id: 'wrl_lx_s30',
    title: '落霞 · 世家联姻',
    region: 'luoxia',
    pool: 'world',
    tier: 2,
    weight: 3,
    minRealm: 0,
    maxRealm: 3,
    text: '城中两大修仙世家——沈家与周家联姻，十里红妆铺满朱雀长街，沿街抛洒灵果喜钱。然而行至十字路口，一名浑身是血的散修青年忽然冲破仪仗高喊：「沈小姐是被逼嫁的！」周家护卫脸色铁青，当即祭出法器便要格杀！',
    choices: [
      {
        label: '凌空一剑格开护卫杀招，护住青年听明是非',
        hint: '救人于危 · 战筑基修士',
        combat: {
          enemy: 'cultivator', displayName: '周家供奉',
          win: {
            text: '花轿中沈家小姐果然掀帘而出，泣泪揭露族老强卖联姻之丑闻！满城哗然，周家颜面扫地撤回仪仗。二人双双拜谢，赠你一枚碧灵聚气戒、一枚冰肌驻颜丹与厚重灵石远走高飞。',
            effects: { items: ['biling_jie', 'zhuyan_dan'], stones: 80, karma: 22, reputation: 18 },
          },
          lose: {
            text: '周家供奉势大，你护着青年勉强杀出一条缺口助其遁走，自己却受了些轻伤。',
            effects: { hp: -32, karma: 14 },
          },
        },
      },
      {
        label: '世家恩怨难断清浊，只捡两颗喜果退入茶楼观望',
        hint: '明哲保身 · 不惹世家大祸',
        outcome: {
          text: '喧嚣很快被护卫压下，红妆继续前行。你吞下微甜灵果，暗叹红尘情劫比天劫更难渡。',
          effects: { exp: 58, hpPct: 0.2, attrs: { 道心: 1 } },
        },
      },
    ],
  },
  {
    id: 'wrl_lx_s31',
    title: '落霞 · 灵宠逃逸',
    region: 'luoxia',
    pool: 'world',
    tier: 1,
    weight: 4,
    minRealm: 0,
    maxRealm: 3,
    text: '「抓灵貂啊！谁替我截住这小祖宗，赏六十灵石！」城中御兽阁门前乱作一团，一只通体金毛、快如闪电的寻宝雪貂蹿房越脊，嘴里还叼着一只鼓囊囊的丹药锦袋，正朝你迎面扑来！',
    choices: [
      {
        label: '以柔劲灵力织网，不伤皮毛稳稳擒下雪貂',
        hint: '神识与身法检定 · 领御兽阁厚赏',
        roll: {
          p: 0.62,
          attrs: { 神识: 0.014, 根骨: 0.012 },
          success: {
            text: '雪貂被灵网温柔兜住，吱吱叫着毫不挣扎。御兽阁女执事欣喜赶来，不仅当场付清六十灵石，还另赠一瓶培元丹致谢。',
            effects: { stones: 60, items: ['peiyuan_dan'], reputation: 10, karma: 8 },
          },
          fail: {
            text: '小畜生滑不留手，反在你靴面上踩了一脚梅花印窜上屋顶。不过掉下了一枚从锦袋滚出来的回灵丹。',
            effects: { items: ['huiling_dan'], exp: 35 },
          },
        },
      },
      {
        label: '取出一枚百年灵草诱其停步，温和哄回御兽阁',
        hint: '消耗百年灵草 · 必成且得更丰回报',
        cost: { item: 'lingcao' },
        outcome: {
          text: '雪貂闻到药香立刻乖巧伏在你掌心啃食。御兽阁大喜过望，以百块灵石与一枚妖兽内丹作为谢礼！',
          effects: { stones: 100, items: ['yaoshou_neidan'], karma: 12, attrs: { 魅力: 1 } },
        },
      },
    ],
  },
  {
    id: 'wrl_lx_s32',
    title: '落霞 · 残碑书摊',
    region: 'luoxia',
    pool: 'world',
    tier: 2,
    weight: 3,
    minRealm: 0,
    maxRealm: 3,
    text: '落霞旧书肆屋檐下，落魄老秀才守着一摞发霉线装书打盹。你随手翻动几本修仙游记，忽然在一册《青州风物杂谈》的夹页里摸到一张质感奇异的薄兽皮，上面以极细银线绘着人体经脉行气图。',
    choices: [
      {
        label: '给老秀才三十灵石买下整摞旧书，细研兽皮行气图',
        hint: '耗 30 灵石 · 悟性检定',
        cost: { stones: 30 },
        roll: {
          p: 0.6,
          attrs: { 悟性: 0.015, 气运: 0.012 },
          success: {
            text: '原是一位筑基前辈留下的洗髓冲关手记！细细参详下来，经脉灵力运转圆融许多，破境感悟陡增。',
            effects: { expPct: 0.2, breakBonus: 8, attrs: { 悟性: 1 } },
          },
          fail: {
            text: '兽皮受潮严重，后半段经脉图已糊成一团，仅从前半段学到些许养气窍门。',
            effects: { exp: 65, lifespan: 2 },
          },
        },
      },
      {
        label: '只付五块灵石借阅半日，抄录有用游记便归还',
        hint: '耗 5 灵石 · 博闻强识',
        cost: { stones: 5 },
        outcome: {
          text: '书肆茶香袅袅，你半日翻遍九州山海志异，神识与见闻俱有长进。',
          effects: { exp: 60, attrs: { 神识: 1 } },
        },
      },
    ],
  },
  {
    id: 'wrl_lx_s33',
    title: '落霞 · 暗巷伤修',
    region: 'luoxia',
    pool: 'world',
    tier: 2,
    weight: 3,
    minRealm: 0,
    maxRealm: 3,
    text: '雨夜归客栈途中，你在窄巷墙角撞见一名胸口插着半截飞刀的黑衣女修，鲜血顺着雨水淌了一地。她强撑着最后一口气抬眼望你，沙哑低语：「救我一命……这枚秘藏玉佩与半数家当归你……城外血煞帮正在搜我……」',
    choices: [
      {
        label: '取碧血生肌丹或疗伤丹替她止血藏匿，待追兵散去再送出城',
        hint: '消耗疗伤丹 · 险中救美结厚缘',
        cost: { item: 'liaoshang_dan' },
        outcome: {
          text: '女修服丹稳住心脉，在你客栈密室避过一劫。三日后辞行，她将一枚价值不菲的聚灵丹、一张护心符与百余灵石尽数留下。',
          effects: { items: ['juling_dan', 'huxin_fu'], stones: 110, karma: 18, attrs: { 魅力: 1 } },
        },
      },
      {
        label: '不愿招惹血煞帮，只替她包扎止血后便悄然离去',
        hint: '仁至义尽 · 不沾血仇',
        outcome: {
          text: '你以灵力封住她两处大穴免于失血而亡，留下一句珍重便隐入雨幕。',
          effects: { karma: 10, exp: 55 },
        },
      },
      {
        label: '趁其重伤无力反抗，夺其储物袋扬长而去',
        hint: '趁人之危 · 得横财却滋生心魔',
        outcome: {
          text: '女修怨毒的目光刺在你背上。你掠走她身上的灵石与法器匆匆离巷，心底却泛起挥之不去的阴翳。',
          effects: { stones: 140, items: ['hanbing_jian'], karma: -25, demon: 10 },
        },
      },
    ],
  },
  {
    id: 'wrl_lx_s34',
    title: '落霞 · 晚霞悟剑',
    region: 'luoxia',
    pool: 'world',
    tier: 2,
    weight: 4,
    minRealm: 0,
    maxRealm: 3,
    text: '每逢秋分，落霞仙城西城墙皆被万丈火烧云映照得宛若仙境。数百名低阶散修齐聚城头迎霞吐纳，忽有一道剑虹自中州方向破云掠过，在晚霞中留下一道久久不散的金色剑痕。',
    choices: [
      {
        label: '凝神紧盯天际金色剑痕，捕捉那转瞬即逝的大能剑韵',
        hint: '悟性检定 · 观天外飞剑悟道',
        roll: {
          p: 0.56,
          attrs: { 悟性: 0.016, 神识: 0.012 },
          success: {
            text: '剑痕虽逝，那一往无前的锋锐却烙印在你识海深处！你拔剑轻挥，周遭晚霞灵气竟随剑锋微颤。',
            effects: { lawExp: 16, lawId: 'sword', expPct: 0.18, attrs: { 悟性: 1 } },
          },
          fail: {
            text: '大能剑威太过浩瀚，看得你双目刺痛流泪，只勉强记下几分御剑势头。',
            effects: { exp: 75, lawExp: 6, lawId: 'sword' },
          },
        },
      },
      {
        label: '不贪高远剑痕，专心汲取城头漫天晚霞火灵气',
        hint: '脚踏实地 · 稳步提升修为与灵力',
        outcome: {
          text: '霞光漫天，丹田灵海暖洋洋地充盈起来，一月苦功抵得平日两月。',
          effects: { expPct: 0.2, mpPct: 0.4, attrs: { 道心: 1 } },
        },
      },
    ],
  },

  /* ============================================================================
   * 三、苍茫妖森（yaosen · 筑基至化神 · 45 节点）
   * ============================================================================ */

  /* ---------- 链一：沉渊碧庙（4 段） ---------- */
  {
    id: 'wrl_ys_temple_1',
    title: '妖森 · 沉潭碧瓦',
    region: 'yaosen',
    pool: 'wild',
    tier: 3,
    weight: 4,
    minRealm: 1,
    maxRealm: 4,
    once: true,
    text: '苍茫妖森腹地浓雾终年不散，古藤如巨蟒缠绕着参天铁桦。你拨开半人高的毒蕨，脚下忽然一空——眼前是一片方圆百丈的碧绿沉渊，潭水清澈诡异，水底竟隐隐可见一座飞檐斗拱、铺满翡翠琉璃瓦的古修神庙！\n\n潭畔青石上盘踞着一条十丈长的碧磷毒蟒，猩红信子吞吐间，毒雾令周围草木尽数枯萎。',
    choices: [
      {
        label: '拔剑斩杀守潭碧磷毒蟒，抢占入潭先机',
        hint: '硬撼妖蟒 · 得蛇胆且开沉庙前路',
        combat: {
          enemy: 'poison_python',
          win: {
            text: '剑锋划开墨绿蛇鳞，毒蟒翻滚坠潭，腥血染红水面。你顺手剖出一枚温热碧磷蛇胆，潭底古庙石门恰于此时缓缓开启一线微光。',
            effects: { items: ['biling_yu'], exp: 180, flag: { 妖森斩蟒入庙: true } },
            goto: 'wrl_ys_temple_2',
          },
          lose: {
            text: '毒雾侵蚀护体灵光，你被蟒尾扫飞数丈撞断古松，只得先撤出毒渊疗伤。',
            effects: { hp: -65, injury: 1 },
          },
        },
      },
      {
        label: '服清毒解障丹闭气潜行，绕开毒蟒由侧洞滑入水底',
        hint: '消耗清毒解障丹 · 智避毒蟒',
        cost: { item: 'jiexin_dan' },
        outcome: {
          text: '丹力护住心脉，你如游鱼无声滑入碧潭暗流。毒蟒在岸上吐信巡视，浑然未觉你已穿过水幕，落足于古庙干燥的回廊石阶之上。',
          effects: { exp: 140, attrs: { 神识: 1 }, flag: { 妖森潜渊入庙: true } },
          goto: 'wrl_ys_temple_2',
        },
      },
      {
        label: '只在潭畔边缘采摘几株因毒气滋养的千年灵草便退',
        hint: '审慎图稳 · 不冒沉渊奇险',
        outcome: {
          text: '古庙深埋毒渊必有大凶。你趁毒蟒打盹小心采得一株品相极佳的千年灵草，迅速退回外林。',
          effects: { items: ['qiannian_lingcao'], exp: 110 },
        },
      },
    ],
  },
  {
    id: 'wrl_ys_temple_2',
    title: '妖森 · 翡翠丹廊',
    region: 'yaosen',
    pool: 'branch',
    tier: 3,
    weight: 0,
    minRealm: 1,
    maxRealm: 4,
    text: '水幕隔绝在庙门之外，殿廊竟干爽温暖，壁上嵌着拳头大的夜明灵珠。细看壁画，此地原是上古百草妖修一脉所建的「七花丹庙」，廊下整齐排列着十八尊青石丹童傀儡。\n\n你刚迈过门槛，居中两尊石傀眼窝骤燃碧火，沉重石拳挟着崩山之势砸来！',
    choices: [
      {
        label: '正面击碎古林石傀，强闯丹庙中殿',
        hint: '硬撼石傀 · 战古林石傀',
        combat: {
          enemy: 'stone_golem', displayName: '守廊石傀',
          win: {
            text: '石傀胸膛灵核崩裂，轰然化作满地青石碎块。你从碎石间拾得一堆精纯灵石与一块玄铁灵核，中殿大门随即洞开。',
            effects: { stones: 180, items: ['xuantie'], exp: 210, flag: { 碧庙破傀入殿: true } },
            goto: 'wrl_ys_temple_3',
          },
          lose: {
            text: '石傀力大无穷，震得你虎口崩血，被迫借水幕退回潭外。',
            effects: { hp: -72, injury: 1 },
          },
        },
      },
      {
        label: '以丹道灵火模拟七花印诀，安抚守廊石傀',
        hint: '悟性检定 · 巧用古庙礼仪避战',
        roll: {
          p: 0.56,
          attrs: { 悟性: 0.015, 神识: 0.012 },
          success: {
            text: '你依廊壁彩绘结出百草拜火手印，石傀眼眶碧火顿时转作柔和翠绿，竟缓缓退回廊柱两侧躬身让路！',
            effects: { lawExp: 16, lawId: 'pill', exp: 185, flag: { 碧庙印诀通廊: true } },
            goto: 'wrl_ys_temple_3',
          },
          fail: {
            text: '手印慢了半拍，石傀双拳已至面门，避无可避！',
            combat: {
              enemy: 'stone_golem', displayName: '守廊石傀',
              win: {
                text: '险之又险震毁石傀关节，终于杀入中殿。',
                effects: { stones: 150, exp: 190 },
                goto: 'wrl_ys_temple_3',
              },
              lose: {
                text: '重拳擦肩而过，你气血翻腾冲出水面逃生。',
                effects: { hp: -68, injury: 1 },
              },
            },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_ys_temple_3',
    title: '妖森 · 七花药鼎',
    region: 'yaosen',
    pool: 'branch',
    tier: 3,
    weight: 0,
    minRealm: 1,
    maxRealm: 4,
    text: '中殿中央矗立着一座丈高碧玉药鼎，鼎盖微启，七朵色泽各异的虚幻毒花在鼎口沉浮吐香。香风入鼻甜美异常，却暗藏蚀魂幻毒。\n\n药鼎后方阴影里，一缕披着翡翠羽衣的怨魂正冷冷注视着你，声音空洞：「闯庙者，要么留下半身精血温养药鼎，要么以神魂接我一缕七花幻瘴！」',
    choices: [
      {
        label: '祭出破邪灵力正面斩杀翡翠怨魂',
        hint: '破邪除祟 · 战怨魂',
        combat: {
          enemy: 'ghost', displayName: '翡翠怨魂',
          win: {
            text: '怨魂在凛冽正气下发出凄厉长啸，散作漫天青绿光点。七花药鼎嗡鸣一声彻底平静下来，鼎内丹香纯澈无毒！',
            effects: { exp: 230, karma: 14, flag: { 碧庙斩魂平鼎: true } },
            goto: 'wrl_ys_temple_4',
          },
          lose: {
            text: '怨魂噬灵刺骨，你神魂剧痛退回廊道，不敢再深入。',
            effects: { hp: -65, mp: -50, demon: 6 },
          },
        },
      },
      {
        label: '稳守道心硬抗七花幻瘴，以丹心与怨魂印证药理',
        hint: '道心检定 · 化解古修执念',
        roll: {
          p: 0.56,
          attrs: { 道心: 0.015, 悟性: 0.012 },
          success: {
            text: '万千幻象在眼前生灭，你灵台如青松不动。翡翠怨魂怔住片刻，叹息道：「千年矣，终见一位不为毒香所惑的丹道同路人。」说罢主动让开鼎畔玉座。',
            effects: { demon: -12, lawExp: 18, lawId: 'pill', karma: 18, flag: { 碧庙感化丹魂: true } },
            goto: 'wrl_ys_temple_4',
          },
          fail: {
            text: '幻瘴直冲神府，你一时失神险些堕入魔障，猛咬舌尖强行拔剑逼退怨魂才冲至鼎前。',
            effects: { demon: 8, hp: -45, exp: 130 },
            goto: 'wrl_ys_temple_4',
          },
        },
      },
      {
        label: '祭出镇魔破邪符，一符镇散七花怨煞',
        hint: '消耗镇魔破邪符 · 轻松度厄',
        cost: { item: 'poxie_fu' },
        outcome: {
          text: '金光梵文漫天洒下，翡翠怨魂合十低眉，在祥和佛光中安然往生，药鼎阵禁随之全解！',
          effects: { karma: 22, demon: -14, exp: 200, flag: { 碧庙超度丹魂: true } },
          goto: 'wrl_ys_temple_4',
        },
      },
    ],
  },
  {
    id: 'wrl_ys_temple_4',
    title: '妖森 · 碧庙真传',
    region: 'yaosen',
    pool: 'branch',
    tier: 4,
    weight: 0,
    minRealm: 1,
    maxRealm: 4,
    text: (s) => `碧玉药鼎缓缓沉降，露出鼎心珍藏的三件古修遗宝：一卷散发幽幽草木清香的《七花凝露经》真本、一匣历千年未散药性的宝丹，以及一株生机磅礴的千年灵草。\n\n${s.flags['碧庙感化丹魂'] || s.flags['碧庙超度丹魂'] ? '庙顶琉璃瓦洒下柔和翠光，似是上古庙主最后一份无私馈赠。' : '整座沉渊古庙因失去主阵维持已开始微微震颤，需速作决断离去！'}`,
    choices: [
      {
        label: '收下《七花凝露经》与千年灵草，携碧庙丹道传承出渊',
        hint: '习得玄阶丹经 · 寿元与炼丹齐进',
        outcome: {
          text: '你小心收好古经与灵药，破水而出时身后碧渊轰然合拢，千年古庙重归沉寂。细览经卷，只觉草木生克之道尽在掌握。',
          effects: {
            items: ['qiannian_lingcao', 'juling_dan'],
            lawExp: 20,
            lawId: 'pill',
            expPct: 0.24,
            techniques: [{
              id: 'wt_qihua_dan', name: '《七花凝露经》', grade: '玄',
              speed: 0.13, atk: 0.09, def: 0.12, lifespan: 32, lawId: 'pill', artName: '青焰缠丝印',
            }],
          },
        },
      },
      {
        label: '尽取鼎中大还丹、破障丹与碧血丹，换取实打实的破境资粮',
        hint: '重宝丹药 · 助推高阶突破',
        outcome: {
          text: '功法贵精不贵多，丹药才是救命破关的硬本钱！你收尽鼎中三枚珍贵宝丹，于庙宇崩塌前纵身跃出碧潭。',
          effects: { items: ['dahuan_dan', 'pozhang_dan', 'bixue_dan'], stones: 180, expPct: 0.18 },
        },
      },
    ],
  },

  /* ---------- 链二：妖王旧巢（4 段） ---------- */
  {
    id: 'wrl_ys_nest_1',
    title: '妖森 · 骨风峡谷',
    region: 'yaosen',
    pool: 'wild',
    tier: 3,
    weight: 4,
    minRealm: 1,
    maxRealm: 4,
    once: true,
    text: '苍茫妖森深处，风声穿过百丈高的巨大兽肋骨架构，发出如号角般的呜咽。此地曾是一尊陨落妖王的盘踞旧巢，虽已空置百年，残留妖威仍令寻常低阶妖兽不敢越雷池半步。\n\n峡谷入口碎石堆里，三名背刀猎妖散修正鬼鬼祟祟架设困兽索，显是盯上了巢穴深处的异宝。',
    choices: [
      {
        label: '趁其专心布索，先发制人抢先掠入旧巢',
        hint: '身法与神识检定 · 占尽先机',
        roll: {
          p: 0.58,
          attrs: { 神识: 0.015, 根骨: 0.012 },
          success: {
            text: '你如轻烟掠过骨拱，毫未惊动外头猎妖客，抢先一步潜入妖王旧巢外洞。',
            effects: { exp: 160, flag: { 妖巢先手潜入: true } },
            goto: 'wrl_ys_nest_2',
          },
          fail: {
            text: '脚下碎骨咔嚓脆响，为首的断魂刀客瞬间回头厉喝：「哪来的毛贼敢截胡？」',
            combat: {
              enemy: 'blade_rogue',
              win: {
                text: '数招斩翻为首刀客，余人骇然退散。你踩着战利品昂首步入妖巢。',
                effects: { stones: 190, exp: 180 },
                goto: 'wrl_ys_nest_2',
              },
              lose: {
                text: '猎妖客配合默契，你被逼退峡谷之外，只得先寻处隐蔽地界疗伤。',
                effects: { hp: -65, injury: 1 },
              },
            },
          },
        },
      },
      {
        label: '现身提议联手探巢，按出力平分洞中妖宝',
        hint: '魅力检定 · 借力探险但须防背刺',
        roll: {
          p: 0.6,
          attrs: { 魅力: 0.015, 道心: 0.01 },
          success: {
            text: '几名猎妖客见你修为不俗，正愁人手不足，爽快答应结伴而行。众人并肩踏入幽暗洞窟。',
            effects: { reputation: 8, flag: { 妖巢联手猎修: true } },
            goto: 'wrl_ys_nest_2',
          },
          fail: {
            text: '猎妖客眼神阴鸷，竟假意应允却在转身之际骤然拔刀偷袭！',
            combat: {
              enemy: 'blade_rogue',
              win: {
                text: '你早留三分防备，反手一剑将其伏诛，独身踏入骨风旧巢。',
                effects: { stones: 170, exp: 175 },
                goto: 'wrl_ys_nest_2',
              },
              lose: {
                text: '猝不及防肩头中刀，你愤然挥出一道剑气逼退众人，转身遁入林海。',
                effects: { hp: -70, injury: 1 },
              },
            },
          },
        },
      },
      {
        label: '在骨拱外围捡些风化妖兽残骨与灵草便走',
        hint: '避凶就吉 · 稳赚灵材',
        outcome: {
          text: '瘦死的骆驼比马大，妖王旧巢岂是易与之地？你采走几株伴骨而生的灵草，平安撤离。',
          effects: { items: ['qiannian_lingcao', 'yaoshou_neidan'], exp: 100 },
        },
      },
    ],
  },
  {
    id: 'wrl_ys_nest_2',
    title: '妖森 · 蝠窟血厅',
    region: 'yaosen',
    pool: 'branch',
    tier: 3,
    weight: 0,
    minRealm: 1,
    maxRealm: 4,
    text: (s) => `旧巢溶洞阴冷潮湿，穹顶倒悬着数百头丈翼嗜血蝠妖，腥臭血气令人作呕。${s.flags['妖巢联手猎修'] ? '同行的猎妖客一见蝠群顿时脸色惨白，悄悄把你往最前头推了半步。' : '洞厅深处泛着淡淡赤金霞光，隐约可见一座残破兽骨王座。'}\n\n火光惊动了领头的嗜血蝠王，凄厉声波瞬间震落满地碎石！`,
    choices: [
      {
        label: '持剑逆声波而上，斩杀领头嗜血蝠妖',
        hint: '正面力战 · 战嗜血蝠妖',
        combat: {
          enemy: 'blood_bat', displayName: '嗜血蝠王',
          win: {
            text: '血蝠头领哀鸣坠地，群蝠失了统率轰然四散！你在血厅石缝间寻得一枚泛着灵光的妖兽内丹。',
            effects: { items: ['yaoshou_neidan'], stones: 160, exp: 200, flag: { 妖巢斩血蝠: true } },
            goto: 'wrl_ys_nest_3',
          },
          lose: {
            text: '声波震荡神魂，血蝠围攻令你浑身挂彩，拼死杀出溶洞外口才喘过气来。',
            effects: { hp: -75, injury: 1 },
          },
        },
      },
      {
        label: '以掌心五雷符炸响雷音，一举震慑整窟蝠群',
        hint: '消耗掌心五雷符 · 雷克阴邪',
        cost: { item: 'zhangxin_leifu' },
        outcome: {
          text: '紫电在溶洞内轰然炸亮，刺耳雷鸣彻底压垮血蝠声波！群蝠抱头鼠窜，你毫发无损直抵内窟。',
          effects: { exp: 190, lawExp: 12, lawId: 'thunder', flag: { 妖巢雷破蝠窟: true } },
          goto: 'wrl_ys_nest_3',
        },
      },
    ],
  },
  {
    id: 'wrl_ys_nest_3',
    title: '妖森 · 铁甲守王',
    region: 'yaosen',
    pool: 'branch',
    tier: 3,
    weight: 0,
    minRealm: 1,
    maxRealm: 4,
    text: '溶洞最深处是一座宽阔地宫，正中白骨王座上盘踞着一头如小山般的铁甲妖猪——它吞食了昔年妖王残留的半滴真血，浑身鬃毛如玄铁钢针，正死死护着王座后的古铜石棺与一株结满赤红灵果的血阳树。',
    choices: [
      {
        label: '运足真元硬撼铁甲妖猪，夺取王座机缘',
        hint: '巅峰搏杀 · 战铁甲妖猪',
        combat: {
          enemy: 'beast',
          win: {
            text: '历经一番血战，你瞅准妖猪翻身间隙一剑贯入其下颌软肉！庞大妖躯轰然坍塌，地宫尽头宝光再无阻隔。',
            effects: { items: ['yaoshou_neidan', 'bixue_dan'], stones: 220, exp: 250, flag: { 妖巢斩铁猪: true } },
            goto: 'wrl_ys_nest_4',
          },
          lose: {
            text: '妖猪冲撞如山崩地裂，震断你两根肋骨，只得借遁符仓皇逃出骨风谷。',
            effects: { hp: -85, injury: 1 },
          },
        },
      },
      {
        label: '以玄铁盾姿游斗诱其撞向残阵石柱，借塌石镇压妖猪',
        hint: '悟性与根骨检定 · 以巧破力',
        roll: {
          p: 0.54,
          attrs: { 悟性: 0.015, 根骨: 0.012 },
          success: {
            text: '你接连引妖猪撞断三根承重阵柱！巨岩轰然压下，将皮糙肉厚的铁甲妖猪死死卡在乱石堆中动弹不得，你从容越过其头顶步向石棺！',
            effects: { exp: 220, lawExp: 10, lawId: 'array', flag: { 妖巢智困妖猪: true } },
            goto: 'wrl_ys_nest_4',
          },
          fail: {
            text: '石柱虽塌，妖猪却怒吼撞碎巨岩直扑而来，避无可避！',
            combat: {
              enemy: 'beast',
              win: {
                text: '妖猪负伤力减，终被你趁势斩于王座之前！',
                effects: { stones: 180, exp: 220 },
                goto: 'wrl_ys_nest_4',
              },
              lose: {
                text: '妖猪发狂反扑，你被迫弃宝突围逃出生天。',
                effects: { hp: -78, injury: 1 },
              },
            },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_ys_nest_4',
    title: '妖森 · 古棺炼体',
    region: 'yaosen',
    pool: 'branch',
    tier: 4,
    weight: 0,
    minRealm: 1,
    maxRealm: 4,
    text: '白骨王座之后的石棺并未落锁，内里并无尸骸，唯有昔年妖王斩杀的一位体修大能遗留的古铜战甲残片、一面玄武墨盾，以及刻在棺盖内壁的玄阶炼体奇功《古铜金刚体》。树上那三枚赤红血阳果亦正散发诱人芬芳。',
    choices: [
      {
        label: '摘食血阳果并参悟棺盖《古铜金刚体》，淬炼不坏之躯',
        hint: '习得玄阶体术 · 根骨与防御暴涨',
        outcome: {
          text: '血阳果化作滔天热流冲刷筋骨，配合棺壁古法吐纳一夜，你肌肤隐隐泛起古铜光泽，战力浑厚倍增！',
          effects: {
            attrs: { 根骨: 3 },
            lifespan: 8,
            expPct: 0.24,
            items: ['xuanwu_dun'],
            techniques: [{
              id: 'wt_jinzhong_ti', name: '《古铜金刚体》', grade: '玄',
              speed: 0.11, atk: 0.12, def: 0.19, lifespan: 25, lawId: 'blood', artName: '铜身镇岳撞',
            }],
          },
        },
      },
      {
        label: '收起玄武墨盾、雷击木与全部灵药，留待他日突破所用',
        hint: '重宝全收 · 得护盾、雷木与灵丹',
        outcome: {
          text: '你将玄武墨盾背于身后，又从王座夹层撬出一截被妖王镇压的雷击木与聚灵宝丹，满载而归！',
          effects: { items: ['xuanwu_dun', 'leimu', 'juling_dan', 'zhuji_dan'], stones: 240, expPct: 0.16 },
        },
      },
    ],
  },

  /* ---------- 链三：迷林孤徒（3 段） ---------- */
  {
    id: 'wrl_ys_rescue_1',
    title: '妖森 · 断剑求救',
    region: 'yaosen',
    pool: 'wild',
    tier: 2,
    weight: 4,
    minRealm: 1,
    maxRealm: 4,
    once: true,
    text: '苍茫妖森骤起血雾，林间传来三声短促凄厉的求救鹤哨。你循声疾掠三里，只见一株千年银杏树干上靠着一名浑身浴血的青袍宗门女弟子，断剑斜插脚畔，不远处一头双臂过膝的通臂灵猿正拍胸狂啸，一步步逼近！',
    choices: [
      {
        label: '毫不犹豫挥剑迎击通臂灵猿，救下孤立女弟子',
        hint: '仗义援手 · 战通臂灵猿',
        combat: {
          enemy: 'spirit_ape',
          win: {
            text: '灵猿双臂虽猛，终不敌你连绵剑势，哀嚎着跃入古树冠逃遁。青袍女弟子松了口气，勉强抱拳：「多谢道友救命之恩……我同门师兄还在前头毒沼被魔修围困！」',
            effects: { karma: 18, reputation: 12, exp: 165, flag: { 妖森救女修: true } },
            goto: 'wrl_ys_rescue_2',
          },
          lose: {
            text: '灵猿一拳砸震虎口，你被迫护着女弟子滚落坡下荆棘丛，勉强甩脱妖兽追击。',
            effects: { hp: -60, karma: 10 },
            goto: 'wrl_ys_rescue_2',
          },
        },
      },
      {
        label: '抛出烟雾雷符惊退灵猿，趁机背起女弟子遁入密林',
        hint: '根骨与气运检定 · 智救避战',
        roll: {
          p: 0.6,
          attrs: { 气运: 0.014, 根骨: 0.012 },
          success: {
            text: '巨响炸开，灵猿惊疑退避三步。你趁瞬息空当挟起女弟子疾驰出两里外，成功脱险。',
            effects: { karma: 14, exp: 135, flag: { 妖森智救女修: true } },
            goto: 'wrl_ys_rescue_2',
          },
          fail: {
            text: '灵猿识破虚招，怒啸扑来，你只得提剑硬接！',
            combat: {
              enemy: 'spirit_ape',
              win: {
                text: '斩伤灵猿右臂逼退强敌，女弟子感激涕零。',
                effects: { karma: 16, exp: 160 },
                goto: 'wrl_ys_rescue_2',
              },
              lose: {
                text: '力战不支，你负伤勉强逃离现场，回头只见血雾吞没银杏树。',
                effects: { hp: -68, injury: 1 },
              },
            },
          },
        },
      },
      {
        label: '妖森险恶，不欲卷入宗门恩怨，敛息绕道离去',
        hint: '明哲保身 · 避开未知麻烦',
        outcome: {
          text: '你悄然退入毒雾深处，片刻后身后鹤哨归于沉寂。修仙大道本就薄情，唯有活着才能走得更远。',
          effects: { exp: 95, karma: -10, demon: 4 },
        },
      },
    ],
  },
  {
    id: 'wrl_ys_rescue_2',
    title: '妖森 · 毒沼围猎',
    region: 'yaosen',
    pool: 'branch',
    tier: 3,
    weight: 0,
    minRealm: 1,
    maxRealm: 4,
    text: '女弟子服下止血散，领你穿过腐木林赶往黑泥毒沼。只见沼泽石礁上，一名断臂宗门师兄正背水一战，四面围着几名手持染血钢刀的筑基邪修，显然是专为猎杀入林试炼宗门弟子夺宝的「林鬼」匪帮！',
    choices: [
      {
        label: '如雷霆自天而降，突袭匪首解毒沼之围',
        hint: '果敢奇袭 · 战筑基修士',
        combat: {
          enemy: 'cultivator',
          win: {
            text: '匪首措手不及被你一剑穿肩，沼泽匪帮见势大乱四散溃逃！断臂师兄长舒一口气，与师妹一同向你深深一礼。',
            effects: { stones: 210, karma: 22, reputation: 18, exp: 210, flag: { 妖森破匪救师兄: true } },
            goto: 'wrl_ys_rescue_3',
          },
          lose: {
            text: '匪帮人多势众且熟稔毒沼地形，你掩护二人突围后亦身中暗算，狼狈逃出腐林。',
            effects: { hp: -72, injury: 1, karma: 14 },
          },
        },
      },
      {
        label: '先以神识破掉沼泽外围困阵，接应二人突围撤离',
        hint: '神识与悟性检定 · 救人为主不恋死战',
        roll: {
          p: 0.6,
          attrs: { 神识: 0.015, 悟性: 0.012 },
          success: {
            text: '你精准挑断三处藏于泥下的阵旗，困雾骤散！断臂师兄趁机御剑破围，三人汇合一处顺利摆脱追兵。',
            effects: { lawExp: 12, lawId: 'array', karma: 18, exp: 175, flag: { 妖森破阵救人: true } },
            goto: 'wrl_ys_rescue_3',
          },
          fail: {
            text: '毒沼暗箭冷不防射来，你挥剑格挡暴露行踪，被匪首缠住激战！',
            combat: {
              enemy: 'blade_rogue',
              win: {
                text: '血战斩退匪首，成功接应二人脱困。',
                effects: { stones: 165, karma: 16, exp: 190 },
                goto: 'wrl_ys_rescue_3',
              },
              lose: {
                text: '陷入重围难以力敌，你拼命护着女弟子杀出缺口逃生。',
                effects: { hp: -70, injury: 1 },
              },
            },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_ys_rescue_3',
    title: '妖森 · 宗门重谢',
    region: 'yaosen',
    pool: 'branch',
    tier: 3,
    weight: 0,
    minRealm: 1,
    maxRealm: 4,
    text: '护送两名伤疲弟子抵达妖森边缘的宗门接引哨所，坐镇哨所的筑基执事闻听前因后果，脸色肃然，向你郑重抱拳：「若非道友孤身仗义援手，我宗两位英才今日必葬身妖腹！这份情义，宗门绝不亏待。」',
    choices: [
      {
        label: '收下哨所赠予的破障丹、玄铁与宗门举荐声望',
        hint: '实惠厚赏 · 丹药、灵石与大义声名',
        outcome: {
          text: '执事奉上破障丹、碧血生肌丹与两百灵石，并将你的义举记入青州仙盟功劳簿。自此正道宗门闻你道号皆高看三分。',
          effects: { items: ['pozhang_dan', 'bixue_dan'], stones: 200, reputation: 28, karma: 24, contribution: 80 },
        },
      },
      {
        label: '谢绝金银财物，只求一阅哨所珍藏的《奇门遁甲篇》副本',
        hint: '以义换法 · 习得玄阶阵典',
        outcome: {
          text: '执事见你风骨清峻，慨然应允！你在哨所石阁闭关参详七日，将八门轮转之妙尽数收入胸中。',
          effects: {
            karma: 26,
            reputation: 24,
            lawExp: 18,
            lawId: 'array',
            techniques: [{
              id: 'wt_qimen_dun', name: '《奇门遁甲篇》', grade: '玄',
              speed: 0.14, atk: 0.13, def: 0.16, lifespan: 15, lawId: 'array', artName: '八门锁魂阵',
            }],
          },
        },
      },
    ],
  },

  /* ---------- 苍茫妖森 独立奇遇 01–14 ---------- */
  {
    id: 'wrl_ys_s01',
    title: '妖森 · 千年灵木',
    region: 'yaosen',
    pool: 'wild',
    tier: 2,
    weight: 4,
    minRealm: 1,
    maxRealm: 4,
    text: '穿过十里腐瘴，眼前忽现一片无毒净土。正中矗立着一株需十人合抱的千年青灵古树，垂落万千碧绿光丝，落叶化作淡淡木灵雾气滋养着周遭方圆百丈。树洞深处，似有温润玉液滴落石臼之声。',
    choices: [
      {
        label: '盘坐古树根下吐纳一月，汲取先天木灵生机',
        hint: '耗一月 · 延年益寿且大进修为',
        cost: { month: 1 },
        outcome: {
          text: '古树灵韵如春雨润物。一月下来，你旧伤暗疾尽去，寿元竟增五载，修为亦浑厚不少。',
          effects: { expPct: 0.22, lifespan: 5, heal: 1, attrs: { 根骨: 1 } },
        },
      },
      {
        label: '只取石臼溢出的半瓶古树玉液，不伤树心丝毫',
        hint: '取之有度 · 得珍药与善缘',
        outcome: {
          text: '树冠无风自摇，竟主动拂落一株寄生树杈的千年灵草赠予你。',
          effects: { items: ['qiannian_lingcao', 'huiling_dan'], karma: 12, exp: 120 },
        },
      },
      {
        label: '挥剑剖开树心，硬夺千年青木灵髓',
        hint: '竭泽而渔 · 收获丰厚却惹草木怨气',
        outcome: {
          text: '古树发出悲鸣，漫天碧叶顷刻枯黄。你收走蕴含浩瀚生机的灵髓，却觉心底莫名升起一丝躁郁。',
          effects: { expPct: 0.28, items: ['juling_dan', 'qiannian_lingcao'], karma: -22, demon: 8 },
        },
      },
    ],
  },
  {
    id: 'wrl_ys_s02',
    title: '妖森 · 兽潮前兆',
    region: 'yaosen',
    pool: 'wild',
    tier: 3,
    weight: 4,
    minRealm: 1,
    maxRealm: 4,
    text: '林海深处大地微微颤抖，无数飞鸟惊啼冲天！远处烟尘蔽日，数十头赤目妖兽正漫无目的地朝东狂奔——这是苍茫妖森十年一遇的小型兽潮！一头落单发狂的铁甲妖猪正顺着山坡朝你直冲而来！',
    choices: [
      {
        label: '正面迎斩狂躁铁甲妖猪，借势取其妖丹',
        hint: '险中求富贵 · 战铁甲妖猪',
        combat: {
          enemy: 'beast',
          win: {
            text: '剑锋撕裂妖猪厚甲，你迅速剖出热腾腾的妖兽内丹，在主力兽潮卷至前纵身跃上百丈古崖脱险。',
            effects: { items: ['yaoshou_neidan', 'bixue_dan'], exp: 200, stones: 150 },
          },
          lose: {
            text: '妖猪势若奔雷撞得你气血翻腾，幸得借坡滚入石缝才躲过后续兽蹄践踏。',
            effects: { hp: -72, injury: 1 },
          },
        },
      },
      {
        label: '迅速攀上参天古木隐蔽气息，俯瞰兽潮过境后捡漏',
        hint: '气运检定 · 坐收战后遗宝',
        roll: {
          p: 0.62,
          attrs: { 气运: 0.015, 神识: 0.012 },
          success: {
            text: '兽潮如黑洪般奔腾而过，烟尘散尽后，你在踩踏成泥的灌木间捡到一具被妖兽冲散的散修法囊与数株踏翻的灵草！',
            effects: { stones: 165, items: ['qiannian_lingcao', 'huxin_fu'], exp: 110 },
          },
          fail: {
            text: '两头妖猿路过树下险些发现你的气息，你屏息苦熬两个时辰才脱身，仅拾得几块碎灵石。',
            effects: { stones: 35, exp: 75 },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_ys_s03',
    title: '妖森 · 狐影茶宴',
    region: 'yaosen',
    pool: 'world',
    tier: 3,
    weight: 3,
    minRealm: 1,
    maxRealm: 4,
    text: '月光穿透古林枝桠，照出一片铺满银白落花的空地。三名身披素白狐裘的俊美男女正围坐石桌品茗赏月，酒壶无火自沸，丝竹之声空灵缥缈。为首白衣女修含笑举杯：「妖森夜寒，人族道友可愿共饮一盏青丘月华茶？」',
    choices: [
      {
        label: '坦然入席共饮月华茶，与狐族论道问心',
        hint: '道心与魅力检定 · 或获青丘奇缘',
        roll: {
          p: 0.58,
          attrs: { 道心: 0.015, 魅力: 0.014 },
          success: {
            text: '你举止从容，纵在幻境茶香中亦守住本心清明。白衣女修眼波流转大加赞赏，赠你一卷《青丘月华幻典》与一枚驻颜奇丹！',
            effects: {
              items: ['zhuyan_dan'],
              exp: 170,
              techniques: [{
                id: 'wt_qingqiu_huan', name: '《青丘月华幻典》', grade: '玄',
                speed: 0.16, atk: 0.15, def: 0.14, lifespan: 40, lawId: 'karma', artName: '九尾月华幻界',
              }],
            },
          },
          fail: {
            text: '茶香勾起你心底潜藏旧梦，大醉一宿醒来已在枯叶堆中，虽未损性命，随身灵石却少了些许，唯余眉间一缕清凉月气。',
            effects: { stones: -60, exp: 120, demon: -6 },
          },
        },
      },
      {
        label: '拱手致礼婉言谢绝，赠一株灵草后退入林影',
        hint: '消耗百年灵草 · 礼敬妖修保平安',
        cost: { item: 'lingcao' },
        outcome: {
          text: '白衣女修掩唇轻笑，回赠你一张镇魔破邪符与一瓶清心丹，赞你知进退、懂分寸。',
          effects: { items: ['poxie_fu', 'qingxin_dan'], karma: 10, attrs: { 道心: 1 } },
        },
      },
    ],
  },
  {
    id: 'wrl_ys_s04',
    title: '妖森 · 毒瘴丹墟',
    region: 'yaosen',
    pool: 'wild',
    tier: 3,
    weight: 3,
    minRealm: 1,
    maxRealm: 4,
    text: '紫黑色毒瘴笼罩着一片倒塌的丹房废墟，残垣断壁上隐约可见「药王别院」四字。半埋在腐土中的青铜药架上，尚留着几只封蜡未裂的赤玉丹瓶，只是四周地面爬满细密如针的五彩毒蚁。',
    choices: [
      {
        label: '以真元烈火清开毒蚁，搜检赤玉丹瓶',
        hint: '耗 40 灵力 · 火清毒虫取古丹',
        cost: { mp: 40 },
        outcome: {
          text: '烈火过处毒蚁化作焦灰。你揭开三只玉瓶封蜡，虽有两瓶已化作药粉，最后一瓶中竟静静躺着两枚完好的聚灵丹与清毒解障丹！',
          effects: { items: ['juling_dan', 'jiexin_dan'], exp: 145, lawExp: 10, lawId: 'pill' },
        },
      },
      {
        label: '以神识隔空摄物，同时警惕废墟深处毒物',
        hint: '神识检定 · 零灵耗巧取',
        roll: {
          p: 0.56,
          attrs: { 神识: 0.015, 气运: 0.012 },
          success: {
            text: '神识丝线精准勾回最完好的两只玉瓶，未惊动地底潜伏的碧磷巨蟒，潇洒脱身！',
            effects: { items: ['bixue_dan', 'qiannian_lingcao'], exp: 130 },
          },
          fail: {
            text: '玉瓶跌落发出脆响，废墟瓦砾下骤然窜出一头碧磷毒蟒！',
            combat: {
              enemy: 'poison_python',
              win: {
                text: '斩杀毒蟒后你从容收走整座药架遗珍。',
                effects: { items: ['biling_yu', 'juling_dan'], stones: 140 },
              },
              lose: {
                text: '毒瘴与蛇毒双重侵袭，你只得捏碎避毒散仓皇撤离。',
                effects: { hp: -70, injury: 1 },
              },
            },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_ys_s05',
    title: '妖森 · 蛛丝峡谷',
    region: 'yaosen',
    pool: 'wild',
    tier: 2,
    weight: 3,
    minRealm: 1,
    maxRealm: 4,
    text: '两座陡崖夹出一道昏暗一线天，半空中密密麻麻横亘着如手臂粗细的银白妖蛛丝，阳光照在丝网上泛出寒铁般的冷光。丝网中央赫然挂着一具身穿玄袍的筑基修士干尸，腰间储物袋与一柄宝剑仍在随风摇晃。',
    choices: [
      {
        label: '以剑气斩断蛛丝取宝，同时提防暗处妖物扑击',
        hint: '悟性与根骨检定 · 虎口夺食',
        roll: {
          p: 0.56,
          attrs: { 根骨: 0.014, 神识: 0.014 },
          success: {
            text: '三道凝练剑气齐发，精准削断悬丝！你凌空接住储物袋与寒霜古剑，在崖顶妖蛛尚未合围前扬长而去！',
            effects: { items: ['hanbing_jian', 'huiling_dan'], stones: 155, exp: 140 },
          },
          fail: {
            text: '蛛丝韧性惊人反缠住剑锋，惊动了栖息在崖洞里的嗜血蝠妖群！',
            combat: {
              enemy: 'blood_bat',
              win: {
                text: '杀散蝠妖后你割断蛛丝，取走干尸遗留的灵石与保命符箓。',
                effects: { stones: 170, items: ['huxin_fu'] },
              },
              lose: {
                text: '蛛丝粘身险象环生，你自断一截衣摆才堪堪脱身。',
                effects: { hp: -65, injury: 1 },
              },
            },
          },
        },
      },
      {
        label: '采一束粘性极强的银白妖蛛丝收作炼器布阵材料',
        hint: '稳妥取材 · 不惊干尸',
        outcome: {
          text: '你小心削下谷口几缕外围坚韧蛛丝，转手亦值不少灵石，更悟出几分以柔克刚的布阵巧思。',
          effects: { stones: 95, lawExp: 8, lawId: 'array', exp: 115 },
        },
      },
    ],
  },
  {
    id: 'wrl_ys_s06',
    title: '妖森 · 荧光菌沼',
    region: 'yaosen',
    pool: 'wild',
    tier: 2,
    weight: 4,
    minRealm: 1,
    maxRealm: 4,
    text: '夜幕降临，妖森低谷大片荧光蓝蘑菇次第亮起，宛如星河坠落腐泽。幽蓝孢子在林间缓缓飘荡，吸入一丝便令人昏昏欲睡，却偏偏在菌丛最中央长着一朵巴掌大的雪白「冰心菌王」。',
    choices: [
      {
        label: '屏息凝神踏步摘取冰心菌王',
        hint: '道心与根骨检定 · 抗孢子幻毒',
        roll: {
          p: 0.58,
          attrs: { 道心: 0.015, 根骨: 0.012 },
          success: {
            text: '你紧闭呼吸如掠水蜻蜓，瞬息摘得冰心菌王！此物清心宁神之效极佳，可炼化涤除积年心魔。',
            effects: { demon: -18, items: ['qingxin_dan'], exp: 150, attrs: { 道心: 2 } },
          },
          fail: {
            text: '不慎吸入几粒蓝孢，眼前顿时天旋地转，摔进泥沼半晌才凭灵力逼出迷毒。',
            effects: { hp: -42, demon: 5, exp: 75 },
          },
        },
      },
      {
        label: '在沼泽上风口静观荧光起灭，借宁静夜色吐纳',
        hint: '安稳修行 · 滋养神识',
        outcome: {
          text: '蓝光如潮汐明灭，与周天星辉遥相呼应。你盘坐至黎明，神识愈发敏锐通透。',
          effects: { exp: 140, attrs: { 神识: 2 }, mpPct: 0.35 },
        },
      },
    ],
  },
  {
    id: 'wrl_ys_s07',
    title: '妖森 · 雷击铁木',
    region: 'yaosen',
    pool: 'wild',
    tier: 3,
    weight: 3,
    minRealm: 1,
    maxRealm: 4,
    text: '焦黑盆地中央矗立着一截十丈高的巨型铁桦树桩，显是被上古渡劫天雷劈成两半，如今断裂处竟仍跳跃着细小紫红电蛇。断桩旁插着一柄生满铜绿的宽背古刀，刀身刻着「狂雷」二字。',
    choices: [
      {
        label: '硬抗残雷威压走近树桩，拔出古刀参悟雷法',
        hint: '根骨 ≥ 16 · 悟《狂雷断岳刀》与得雷击木',
        require: 'char.attrs.根骨 >= 16',
        requireHint: '根骨不足十六，难以抵御断桩残雷',
        cost: { hp: 40 },
        outcome: {
          text: '雷电贯体噼啪作响，你咬牙握住刀柄！刹那间一道狂暴雷刀意涌入识海，树桩亦震落一截极品雷击木！',
          effects: {
            items: ['leimu'],
            lawExp: 20,
            lawId: 'thunder',
            techniques: [{
              id: 'wt_kuanglei_dao', name: '《狂雷断岳刀》', grade: '玄',
              speed: 0.12, atk: 0.21, def: 0.07, lifespan: 8, lawId: 'thunder', artName: '狂雷劈山刀',
            }],
          },
        },
      },
      {
        label: '远远以神识临摹电蛇游走轨迹',
        hint: '稳妥悟雷 · 安全收获',
        outcome: {
          text: '雷霆刚烈无俦，你不敢强行近身，只在雷圈之外细观电纹三日，亦有所获，临走照着电纹画成了一张掌心五雷符。',
          effects: { items: ['zhangxin_leifu'], lawExp: 12, lawId: 'thunder', exp: 135 },
        },
      },
    ],
  },
  {
    id: 'wrl_ys_s08',
    title: '妖森 · 灵猿酿窟',
    region: 'yaosen',
    pool: 'wild',
    tier: 2,
    weight: 4,
    minRealm: 1,
    maxRealm: 4,
    text: '顺着一股令人垂涎欲滴的百果醇香摸进山坳石洞，竟撞见一处天然石槽，里头盛满琥珀色清亮猴儿酒，水面浮着数十种叫不出名字的灵果残瓣！洞外忽然传来一阵杂乱猿啸——这窝通臂灵猿刚采果归来！',
    choices: [
      {
        label: '速灌两大葫芦猴儿酒，迎战冲回洞口的通臂灵猿',
        hint: '贪酒硬闯 · 战通臂灵猿',
        combat: {
          enemy: 'spirit_ape', displayName: '通臂猿王',
          win: {
            text: '击退暴怒猴王后你痛饮一碗猴儿酒，醇厚果灵化作澎湃真元涌入气海，气血修为双双暴涨！',
            effects: { expPct: 0.22, hpPct: 0.4, lifespan: 3, stones: 110 },
          },
          lose: {
            text: '猴群砸石如雨，你护着一葫芦洒了一半的果酒狼狈滚下山坡。',
            effects: { hp: -58, exp: 95 },
          },
        },
      },
      {
        label: '留下一枚培元丹放在洞口石台上，只取一小杯猴儿酒便退',
        hint: '消耗培元丹 · 以礼换酒',
        cost: { item: 'peiyuan_dan' },
        outcome: {
          text: '老灵猿归来嗅见丹香大喜，竟从洞里抓出一株千年灵草抛给你作回礼！',
          effects: { expPct: 0.2, items: ['qiannian_lingcao'], karma: 14, attrs: { 气运: 1 } },
        },
      },
    ],
  },
  {
    id: 'wrl_ys_s09',
    title: '妖森 · 苍狼遗骨',
    region: 'yaosen',
    pool: 'wild',
    tier: 2,
    weight: 3,
    minRealm: 1,
    maxRealm: 4,
    text: '枯树盘根错节的岩隙下，倚着一具早已白骨化的邪道散修骸骨，十指死死抠着一块染血狼皮。狼皮上以血指刻着一套狠辣刚猛的搏命拳法《苍狼嗜血拳》，旁边散落着几块灵石与半瓶干涸药粉。',
    choices: [
      {
        label: '细研血皮上的《苍狼嗜血拳》，兼收洞中灵石',
        hint: '习得黄阶魔功 · 攻伐暴烈却略损寿元',
        outcome: {
          text: '拳意如孤狼撕喉，戾气森森。你收起灵石与拳谱，感觉出手杀意更添三分锋锐。',
          effects: {
            stones: 120,
            demon: 4,
            techniques: [{
              id: 'wt_langsha_quan', name: '《苍狼嗜血拳》', grade: '黄',
              speed: 0.1, atk: 0.12, def: 0.03, lifespan: -2, lawId: 'blood', artName: '苍狼裂喉爪',
            }],
          },
        },
      },
      {
        label: '以真火焚化血皮与白骨，不沾魔道嗜血戾气',
        hint: '守正辟邪 · 净心增业力',
        outcome: {
          text: '血皮化灰，一缕怨气随烟消散。唯余灰烬中一块烧不坏的玄铁与几粒灵石归于囊中。',
          effects: { items: ['xuantie'], stones: 65, karma: 14, demon: -8 },
        },
      },
    ],
  },
  {
    id: 'wrl_ys_s10',
    title: '妖森 · 骨铃界线',
    region: 'yaosen',
    pool: 'wild',
    tier: 2,
    weight: 3,
    minRealm: 1,
    maxRealm: 4,
    text: '古木枝头垂挂着一串串用兽骨打磨而成的惨白风铃，无风却微微颤动，发出慑人心魄的沙沙细响。树皮上用利爪刻着妖族警告古纹——再往前百步，便是大妖划分的血祭禁地，偏生界线内三丈长着一片猩红药花。',
    choices: [
      {
        label: '以神识定住骨铃不使发声，迅疾掠入采药即退',
        hint: '神识检定 · 偷采禁地灵药',
        roll: {
          p: 0.58,
          attrs: { 神识: 0.016, 气运: 0.01 },
          success: {
            text: '灵力裹住骨铃纹丝不动，你如鬼魅般摘走三株珍稀血灵花，毫发无损撤回界线之外！',
            effects: { items: ['qiannian_lingcao', 'bixue_dan'], exp: 145 },
          },
          fail: {
            text: '一串骨铃骤然大响！林荫深处扑出一道阴森怨魂与狂暴妖风！',
            combat: {
              enemy: 'ghost',
              win: {
                text: '斩散守界怨魂，你顺势采走猩红灵花并摸走骨铃上镶嵌的灵石。',
                effects: { items: ['qiannian_lingcao'], stones: 130, exp: 165 },
              },
              lose: {
                text: '铃音乱神，你捂耳急退，气血翻涌良久方平。',
                effects: { hp: -62, demon: 5 },
              },
            },
          },
        },
      },
      {
        label: '尊重妖族疆界，不越雷池半步，只观骨铃古纹悟阵',
        hint: '克制谨严 · 悟警戒禁制之理',
        outcome: {
          text: '妖族示警骨铃暗含传音阵法原理。你在界外默观半晌，收获颇丰。',
          effects: { lawExp: 12, lawId: 'array', exp: 120, attrs: { 悟性: 1 } },
        },
      },
    ],
  },
  {
    id: 'wrl_ys_s11',
    title: '妖森 · 食人藤桥',
    region: 'yaosen',
    pool: 'wild',
    tier: 2,
    weight: 3,
    minRealm: 1,
    maxRealm: 4,
    text: '深邃绝壁之间，唯有一座由数百条暗红粗藤自然缠绕而成的天然吊桥横跨悬崖。桥心垂挂着几颗鲜血般饱满的朱红浆果，细看桥藤表面竟布满倒刺与微弱蠕动，显然是开了灵智的嗜血妖藤！',
    choices: [
      {
        label: '御剑贴藤疾掠，借火符烧开藤刺夺取朱红血果',
        hint: '根骨与气运检定 · 险夺妖藤灵果',
        roll: {
          p: 0.56,
          attrs: { 根骨: 0.015, 气运: 0.012 },
          success: {
            text: '赤焰惊退狂舞妖藤，你反手削落三枚血灵果！吞服炼化后气血充盈如潮，筋骨强健一筹。',
            effects: { attrs: { 根骨: 2 }, hpPct: 0.5, exp: 160, items: ['bixue_dan'] },
          },
          fail: {
            text: '妖藤瞬间暴起鞭笞，抽得你护体灵光碎裂，拼力斩断数根巨藤才滚回对岸悬崖。',
            effects: { hp: -65, exp: 90 },
          },
        },
      },
      {
        label: '绕道上游涉水过涧，不贪妖藤血果',
        hint: '谨慎避险 · 另寻溪畔机缘',
        outcome: {
          text: '绕行虽费脚力，却在清澈上游浅滩捡到几块被山洪冲下来的玄铁碎矿。',
          effects: { items: ['xuantie'], stones: 70, exp: 105 },
        },
      },
    ],
  },
  {
    id: 'wrl_ys_s12',
    title: '妖森 · 孤峰古洞',
    region: 'yaosen',
    pool: 'wild',
    tier: 3,
    weight: 3,
    minRealm: 1,
    maxRealm: 4,
    text: '苍翠石崖半腰隐着一座石门半塌的古道修坐化洞府。蒲团上枯骨已化作尘灰，唯独石案上压着一卷未腐的玉丝卷轴，墨迹温润如新：「大道三元，精气神合一，后辈有缘得之，莫负苍生。」',
    choices: [
      {
        label: '焚香三拜前辈遗蜕，恭敬研读《三元合气诀》',
        hint: '耗一月 · 习得玄阶混沌心法',
        cost: { month: 1 },
        outcome: {
          text: '你在古洞静坐三十日，融汇精气神三元行气之理，灵力浑厚圆融无偏！',
          effects: {
            karma: 12,
            expPct: 0.22,
            techniques: [{
              id: 'wt_sanyuan_jue', name: '《三元合气诀》', grade: '玄',
              speed: 0.14, atk: 0.14, def: 0.15, lifespan: 28, lawId: 'chaos', artName: '三元归真印',
            }],
          },
        },
      },
      {
        label: '查验洞府丹室与储物石柜，收取前辈遗留资粮',
        hint: '寻觅实利 · 得丹药与灵石',
        outcome: {
          text: '石柜内整整齐齐放着聚灵丹、清心丹与两百余块上品灵石，还有一张护心符，令你身家立厚。',
          effects: { items: ['juling_dan', 'qingxin_dan', 'huxin_fu'], stones: 210, exp: 130 },
        },
      },
    ],
  },
  {
    id: 'wrl_ys_s13',
    title: '妖森 · 绯雾猎场',
    region: 'yaosen',
    pool: 'wild',
    tier: 3,
    weight: 3,
    minRealm: 1,
    maxRealm: 4,
    text: '赤色毒雾弥漫山谷，几名魔道散修正在林间围猎一头身负重伤的独角灵鹿。灵鹿泪眼盈盈，鹿角断了半截，灵光黯淡，仍拼死护着身后灌木里一只瑟瑟发抖的幼鹿。',
    choices: [
      {
        label: '怒喝拔剑杀退魔修，救下母子灵鹿',
        hint: '正道慈悲 · 战断魂刀客',
        combat: {
          enemy: 'blade_rogue', displayName: '魔道散修',
          win: {
            text: '魔修伏诛，母鹿低头轻蹭你掌心，用残角从灌木下拱出一株千年灵草与一只前人遗落的丹瓶赠你作谢，随后领着幼鹿奔入翠林深处。',
            effects: { items: ['qiannian_lingcao', 'bixue_dan'], karma: 26, lifespan: 4, exp: 185 },
          },
          lose: {
            text: '魔修手段狠辣，你虽吸引火力放跑了幼鹿，自己却负伤撤出绯雾谷。',
            effects: { hp: -70, injury: 1, karma: 14 },
          },
        },
      },
      {
        label: '祭出声东击西之策，引来林外嗜血蝠群搅乱战局助灵鹿脱身',
        hint: '神识检定 · 借力解围',
        roll: {
          p: 0.6,
          attrs: { 神识: 0.015, 悟性: 0.012 },
          success: {
            text: '你弹出一枚腥香弹丸炸在魔修脚下，林顶蝠群骤然俯冲！魔修大乱，母鹿趁机带着幼鹿遁逃，你亦顺手捡起一枚魔修掉落的储物囊。',
            effects: { stones: 145, karma: 18, exp: 150 },
          },
          fail: {
            text: '蝠群受惊连你一并锁定，你只得仓皇疾驰出谷，好在灵鹿也趁乱逃了出去。',
            effects: { hp: -48, karma: 12 },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_ys_s14',
    title: '妖森 · 碧茧古林',
    region: 'yaosen',
    pool: 'wild',
    tier: 2,
    weight: 3,
    minRealm: 1,
    maxRealm: 4,
    text: '幽暗古桑林间，上百枚人头大小的翡翠蚕茧垂挂枝头，在微风里轻轻搏动，隐约透出如玉般温润的灵气波动。地面积满厚厚白骨，显是这批灵蚕吞噬妖兽精血结茧蜕变之地。',
    choices: [
      {
        label: '趁灵蚕沉眠尚未破茧，小心割取三枚空壳灵丝与灵液',
        hint: '气运与神识检定 · 取冰蚕灵丝',
        roll: {
          p: 0.58,
          attrs: { 神识: 0.015, 气运: 0.012 },
          success: {
            text: '你动作轻柔毫未惊动桑林，割得一卷水火难侵的翡翠蚕丝，竟在树洞里还寻到一卷冰蚕丝帛书《玄冰心经残卷》！',
            effects: { items: ['yujian_xuanbing'], stones: 125, exp: 140 },
          },
          fail: {
            text: '指尖微颤惊醒数枚巨茧，破茧而出的毒蛾喷出漫天麻痹粉尘，你捂鼻急遁，颇为狼狈。',
            effects: { hp: -52, exp: 80 },
          },
        },
      },
      {
        label: '静立林边观摩灵蚕化茧吐息之韵，悟蜕变之道',
        hint: '顺应生灭 · 增悟性与破境成算',
        outcome: {
          text: '破茧成蝶，破境成仙，其理一也。你于桑林外静观半日，心中瓶颈竟松动几分。',
          effects: { breakBonus: 8, exp: 145, attrs: { 悟性: 2 } },
        },
      },
    ],
  },
  {
    id: 'wrl_ys_s15',
    title: '妖森 · 垂柳听风',
    region: 'yaosen',
    pool: 'wild',
    tier: 2,
    weight: 3,
    minRealm: 1,
    maxRealm: 4,
    text: '妖森深处一泓碧绿野湖旁，一株万条垂丝如翡翠帘幕的古柳无风自舞。细看水面倒影，垂柳下竟坐着个身着翠绿罗裙的赤足少女，正对着湖心梳头，每一根柳条轻拂水面便荡起一圈圈灵气波纹。',
    choices: [
      {
        label: '取灵泉清水浇灌柳根，向草木精灵致礼',
        hint: '友善结缘 · 得古柳馈赠',
        outcome: {
          text: '湖面倒影展颜一笑，柳梢轻抖，竟垂落三滴晶莹碧绿的柳心神露与一株百年灵草。饮下神露，神清气爽、伤势尽愈！',
          effects: { heal: 1, mpPct: 0.4, lifespan: 3, items: ['qiannian_lingcao'], karma: 14 },
        },
      },
      {
        label: '持清明照妖镜或神识识破其真身，防备木魅摄魂',
        hint: '神识检定 · 谨防陷阱',
        roll: {
          p: 0.58,
          attrs: { 神识: 0.015, 道心: 0.012 },
          success: {
            text: '原是一缕久修成精的古柳善灵！见你目光澄明并无杀意，便自湖底卷出一枚前人坠落的聚灵丹相赠。',
            effects: { items: ['juling_dan'], exp: 135, attrs: { 神识: 1 } },
          },
          fail: {
            text: '神识探查略带锋芒惹怒了古柳，百条柳丝化鞭抽来，你挥剑斩断数枝狼狈退出湖畔。',
            effects: { hp: -55, exp: 80 },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_ys_s16',
    title: '妖森 · 荒废哨塔',
    region: 'yaosen',
    pool: 'wild',
    tier: 2,
    weight: 4,
    minRealm: 1,
    maxRealm: 4,
    text: '藤蔓覆盖着一座百年前某大宗深入妖森建立的前哨石塔，塔门石匾已裂作两半。塔顶了望台仍残存着半座传讯灵台，底层兵器架上零散堆着几件锈蚀甲胄与一只上锁的精铁补给箱。',
    choices: [
      {
        label: '破开精铁补给箱，清理哨塔内潜伏的阴魂',
        hint: '搜寻军备 · 战怨魂',
        combat: {
          enemy: 'ghost',
          win: {
            text: '当年战死哨塔的守兵怨念散去，你撬开铁箱，获赠两张镇魔破邪符、一瓶碧血生肌丹与一百六十块战备灵石！',
            effects: { items: ['poxie_fu', 'bixue_dan'], stones: 160, karma: 8 },
          },
          lose: {
            text: '阴风自石阶倒灌，怨魂尖啸伤你心神，你只得翻窗撤出哨塔。',
            effects: { hp: -58, demon: 5 },
          },
        },
      },
      {
        label: '登上塔顶细查传讯灵台阵纹，临摹宗门古阵',
        hint: '悟性检定 · 参悟传讯阵道',
        roll: {
          p: 0.6,
          attrs: { 悟性: 0.015, 神识: 0.01 },
          success: {
            text: '残存阵纹精妙非凡，你静心临摹半日，对远程灵力牵引与布阵之术大有所悟！',
            effects: { lawExp: 14, lawId: 'array', exp: 150, attrs: { 悟性: 1 } },
          },
          fail: {
            text: '灵台核心早被风霜蚀毁，只勉强扣下两块完好的阵基灵石。',
            effects: { stones: 75, exp: 75 },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_ys_s17',
    title: '妖森 · 傀儡残坊',
    region: 'yaosen',
    pool: 'wild',
    tier: 3,
    weight: 3,
    minRealm: 1,
    maxRealm: 4,
    text: '断崖隐蔽石洞中，遍地散落着齿轮、青铜关节与刻满灵纹的木傀肢体。石案中央停着一具尚未完工的丈高青石战傀，胸口灵石槽空缺，而另一具完整的古林石傀则静立洞壁充当守卫。',
    choices: [
      {
        label: '硬撼守洞古林石傀，夺取工坊内留存的炼器珍材',
        hint: '强攻夺材 · 战古林石傀',
        combat: {
          enemy: 'stone_golem',
          win: {
            text: '轰碎石傀核心后，你从工坊密格中搜得玄铁、雷击木碎片与一百八十灵石，更带走一册机关布阵笔记！',
            effects: { items: ['xuantie', 'leimu'], stones: 180, lawExp: 12, lawId: 'array' },
          },
          lose: {
            text: '石傀双拳势若千钧，震退你数丈撞塌洞口，无奈暂撤。',
            effects: { hp: -72, injury: 1 },
          },
        },
      },
      {
        label: '嵌入六十灵石重启案台半成品战傀，令其与守洞石傀互搏',
        hint: '耗 60 灵石 · 悟性检定驱虎吞狼',
        cost: { stones: 60 },
        roll: {
          p: 0.62,
          attrs: { 悟性: 0.015, 神识: 0.012 },
          success: {
            text: '两具石傀轰然相撞、两败俱伤！你毫发无损走入工坊深处，尽数收走玄武墨盾坯件与聚灵丹！',
            effects: { items: ['xuanwu_dun', 'juling_dan'], lawExp: 14, lawId: 'array', exp: 165 },
          },
          fail: {
            text: '灵石槽早已错位，半成品战傀刚动两步便轰然散架，反惊醒了守洞石傀逼得你连夜退走。',
            effects: { hp: -42, exp: 80 },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_ys_s18',
    title: '妖森 · 巨兽陨骨',
    region: 'yaosen',
    pool: 'wild',
    tier: 3,
    weight: 3,
    minRealm: 1,
    maxRealm: 4,
    text: '林海空地横亘着一具长达百丈的太古凶兽化石骨架，肋骨如巨柱直插云雾。尽管不知死去几千年，胸腔中心那截玉化的龙形脊骨仍散发出令人气血翻涌的苍莽威压。',
    choices: [
      {
        label: '步入巨兽胸腔盘坐一月，借残存太古威压淬炼肉身',
        hint: '耗一月 · 强壮根骨与道心',
        cost: { month: 1 },
        outcome: {
          text: '沉重妖威压得骨骼咯咯作响，却也激发出你体内潜能。一月过后，肉身强度与修为皆迈上一个台阶！',
          effects: { expPct: 0.24, attrs: { 根骨: 2, 道心: 1 }, hpPct: 0.4 },
        },
      },
      {
        label: '削取一小块玉化脊骨髓粉，带回炼药或换取灵石',
        hint: '根骨检定 · 采太古兽骨珍材',
        roll: {
          p: 0.58,
          attrs: { 根骨: 0.015, 气运: 0.01 },
          success: {
            text: '你运足剑气削下三两如羊脂般的太古骨玉，刚一入手便觉血气滚烫，竟媲美高阶妖兽内丹！',
            effects: { items: ['yaoshou_neidan', 'bixue_dan'], stones: 140, exp: 130 },
          },
          fail: {
            text: '骨玉坚逾精钢，反震得你剑刃发麻，只刮下些许骨粉吞服补气。',
            effects: { hp: -28, exp: 95 },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_ys_s19',
    title: '妖森 · 毒花谷涧',
    region: 'yaosen',
    pool: 'wild',
    tier: 2,
    weight: 3,
    minRealm: 1,
    maxRealm: 4,
    text: '幽谷两侧开满姹紫嫣红的曼陀罗妖花，花香浓郁得化作肉眼可见的淡紫雾霭。溪涧中心一块白石上，孤零零长着三株以毒为养、反生至纯解毒灵性的「雪莲解厄草」。',
    choices: [
      {
        label: '服清毒解障丹强渡花雾，尽采三株雪莲解厄草',
        hint: '消耗清毒解障丹 · 满载稀世药材',
        cost: { item: 'jiexin_dan' },
        outcome: {
          text: '紫雾沾衣即散，你从容踏石采得全部解厄灵草，更于溪底拾得一枚清心宝丹！',
          effects: { items: ['qiannian_lingcao', 'qingxin_dan'], exp: 165, lawExp: 10, lawId: 'pill' },
        },
      },
      {
        label: '以剑气卷起寒风吹散花雾，凭屏息快步采摘一株',
        hint: '身法与根骨检定 · 险中采药',
        roll: {
          p: 0.56,
          attrs: { 根骨: 0.014, 神识: 0.012 },
          success: {
            text: '剑风劈开一条通道，你疾掠采得一株极品千年灵草迅速撤出谷口！',
            effects: { items: ['qiannian_lingcao'], exp: 130 },
          },
          fail: {
            text: '花雾合拢太快，吸入一缕紫气令你头晕目眩，忙撤至山涧外运功半日方解。',
            effects: { hp: -52, demon: 4 },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_ys_s20',
    title: '妖森 · 雷雨古松匣',
    region: 'yaosen',
    pool: 'wild',
    tier: 3,
    weight: 3,
    minRealm: 1,
    maxRealm: 4,
    text: '乌云压顶，苍茫妖森忽降倾盆雷雨。一道粗如水桶的青雷轰然劈裂百步外的悬崖老松，焦黑树根竟被炸出一只通体缠绕雷纹的紫铜石匣！',
    choices: [
      {
        label: '顶着漫天雷雨疾奔夺匣，参悟匣中雷法传承',
        hint: '气运与根骨检定 · 习得《引雷破煞指》',
        roll: {
          p: 0.58,
          attrs: { 根骨: 0.014, 气运: 0.014 },
          success: {
            text: '紫铜石匣触手生电，打开后竟藏着一卷雷修秘传《引雷破煞指》与两张掌心五雷符！',
            effects: {
              items: ['zhangxin_leifu'],
              lawExp: 14,
              lawId: 'thunder',
              techniques: [{
                id: 'wt_yinlei_zhi', name: '《引雷破煞指》', grade: '黄',
                speed: 0.07, atk: 0.11, def: 0.04, lifespan: 4, lawId: 'thunder', artName: '一指惊雷落',
              }],
            },
          },
          fail: {
            text: '余雷擦肩劈落震得你浑身焦麻，虽抱回石匣却已摔碎一半，唯余一张完好五雷符与半截雷木。',
            effects: { hp: -58, items: ['zhangxin_leifu'], lawExp: 8, lawId: 'thunder' },
          },
        },
      },
      {
        label: '避于岩洞静观雷雨洗林，感天地威严悟道',
        hint: '避雷静修 · 稳步提升雷霆感悟',
        outcome: {
          text: '暴雨洗尽毒瘴，电光映亮长空。你心境澄澈，借雷声震散胸中淤滞。',
          effects: { exp: 140, lawExp: 10, lawId: 'thunder', demon: -8 },
        },
      },
    ],
  },
  {
    id: 'wrl_ys_s21',
    title: '妖森 · 溶洞回音',
    region: 'yaosen',
    pool: 'wild',
    tier: 2,
    weight: 3,
    minRealm: 1,
    maxRealm: 4,
    text: '避雨误入一座深邃喀斯特溶洞，石钟乳滴水成音，竟在洞中激荡出奇异的九重回响。细听之下，水滴落石的节奏暗合某种极高明的吐纳心律，而洞壁深处还垂着数只警觉张翼的嗜血蝠妖。',
    choices: [
      {
        label: '先清剿洞顶嗜血蝠妖，独占这处天然清音洞府修炼',
        hint: '清洞静修 · 战嗜血蝠妖',
        combat: {
          enemy: 'blood_bat',
          win: {
            text: '除尽妖蝠后你在滴水声中静坐七日，灵力流转前所未有地顺畅，更在石乳池底捞出一枚前人遗落的回灵丹！',
            effects: { expPct: 0.2, stones: 150, items: ['huiling_dan'], attrs: { 神识: 1 } },
          },
          lose: {
            text: '洞内空间逼仄不利施展，被蝠妖尖啸震伤耳膜，只得退回雨幕。',
            effects: { hp: -62, injury: 1 },
          },
        },
      },
      {
        label: '敛息静坐洞口外沿，仅借洞内传出的水滴清音凝神调息',
        hint: '不惊蝠群 · 安静悟道',
        outcome: {
          text: '一滴一息，心如止水。待暴雨停歇，你法力充盈、心魔微消。',
          effects: { exp: 135, mpPct: 0.4, demon: -10 },
        },
      },
    ],
  },
  {
    id: 'wrl_ys_s22',
    title: '妖森 · 蛇神朽坛',
    region: 'yaosen',
    pool: 'wild',
    tier: 3,
    weight: 3,
    minRealm: 1,
    maxRealm: 4,
    text: '苔藓厚积的密林高台上，矗立着一座早已倾颓的远古蛇神祭坛，石柱盘绕着栩栩如生的巨蟒浮雕。祭坛中央石碗里积着半碗墨绿色灵液，散发出奇异腥甜，而石柱阴影下正盘着一头虎视眈眈的碧磷毒蟒。',
    choices: [
      {
        label: '斩杀守坛碧磷毒蟒，收走祭坛灵液与暗藏妖丹',
        hint: '正面对决 · 战碧磷毒蟒',
        combat: {
          enemy: 'poison_python',
          win: {
            text: '毒蟒伏诛，你取走蛇胆与石碗中的淬体蛇灵液，连带坛底供奉的百余灵石尽入囊中！',
            effects: { items: ['biling_yu', 'yaoshou_neidan'], stones: 155, exp: 195 },
          },
          lose: {
            text: '毒雾四起遮蔽视线，你被蛇尾抽飞数丈，只得撤离祭坛。',
            effects: { hp: -68, injury: 1 },
          },
        },
      },
      {
        label: '以玄阶阵理破除祭坛聚毒石柱，化毒气为木灵清气',
        hint: '悟性 ≥ 15 · 净坛积德',
        require: 'char.attrs.悟性 >= 15',
        requireHint: '悟性不足十五，难逆祭坛毒阵',
        outcome: {
          text: '你移开三块错位祭石，毒坛顷刻反转！守坛毒蟒不适清气惊逃而去，你沐浴纯净木灵清气，修为与业力齐升。',
          effects: { expPct: 0.2, karma: 18, lawExp: 14, lawId: 'array', items: ['qiannian_lingcao'] },
        },
      },
    ],
  },
  {
    id: 'wrl_ys_s23',
    title: '妖森 · 幽林竹筏',
    region: 'yaosen',
    pool: 'wild',
    tier: 2,
    weight: 3,
    minRealm: 1,
    maxRealm: 4,
    text: '妖森横贯着一条漆黑无波的暗河，岸边系着一叶老旧青竹筏。河心漂浮着几具发光的浮木灵芝，水中却隐约划过几道巨大的黑影，水花翻涌间透出筑基期水妖的凛冽寒意。',
    choices: [
      {
        label: '撑竹筏快掠河心，以剑气抄起浮木灵芝直抵对岸',
        hint: '身法与气运检定 · 险渡黑河',
        roll: {
          p: 0.58,
          attrs: { 气运: 0.015, 根骨: 0.012 },
          success: {
            text: '竹筏如离弦之箭破浪而过！你在水下黑影张口前挑起两株饱满千年灵芝，稳稳跃上对岸青岩！',
            effects: { items: ['qiannian_lingcao', 'bixue_dan'], exp: 150 },
          },
          fail: {
            text: '巨尾猛然拍碎竹筏！你凌空踏水勉强登岸，浑身湿透受了寒气暗创，仅抓回半株灵芝。',
            effects: { hp: -55, items: ['lingcao'], exp: 80 },
          },
        },
      },
      {
        label: '抛下几块血肉饵料引开水下妖物，从容渡河',
        hint: '耗 30 灵石采购饵料 · 稳妥渡河',
        cost: { stones: 30 },
        outcome: {
          text: '水下黑影争食翻腾，你趁隙安然撑筏过河，还顺手捞起一只随水漂来的散修防水铜筒，内藏灵石与丹药。',
          effects: { stones: 95, items: ['huiling_dan'], exp: 110 },
        },
      },
    ],
  },
  {
    id: 'wrl_ys_s24',
    title: '妖森 · 双猿争王',
    region: 'yaosen',
    pool: 'wild',
    tier: 3,
    weight: 4,
    minRealm: 1,
    maxRealm: 4,
    text: '苍翠山谷震天动地！两头毛色一金一黑的通臂灵猿正为争夺崖畔一株赤霞朱果展开生死搏杀，拳风扫断十余棵合抱古树，此刻双双浴血气喘，已至强弩之末！',
    choices: [
      {
        label: '坐山观虎斗，待两败俱伤时飞身摘果并斩残猿',
        hint: '鹬蚌相争 · 战重伤通臂灵猿',
        combat: {
          enemy: 'spirit_ape', displayName: '金毛灵猿',
          win: {
            text: '黑猿逃窜，金猿力竭伏诛！你独享三枚赤霞朱果与完整妖兽内丹，修为暴涨如潮！',
            effects: { expPct: 0.24, items: ['yaoshou_neidan', 'juling_dan'], karma: -6 },
          },
          lose: {
            text: '两猿见有人渔翁得利竟联手反扑，你措手不及负伤遁走。',
            effects: { hp: -70, injury: 1 },
          },
        },
      },
      {
        label: '隐身石后观摩双猿刚猛拳意，不夺灵果只悟体术',
        hint: '悟性检定 · 观妖兽搏杀悟道',
        roll: {
          p: 0.62,
          attrs: { 悟性: 0.016, 道心: 0.01 },
          success: {
            text: '灵猿举手投足浑然天成、蓄力如弓，看得你胸中血气沸腾，竟悟出几分近身搏杀发力至理！',
            effects: { attrs: { 根骨: 2, 悟性: 1 }, exp: 175 },
          },
          fail: {
            text: '一块飞石砸落身旁惊动了猴群外哨，你只得悄然撤退，略有小悟。',
            effects: { exp: 105 },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_ys_s25',
    title: '妖森 · 陨星浅坑',
    region: 'yaosen',
    pool: 'wild',
    tier: 3,
    weight: 3,
    minRealm: 1,
    maxRealm: 4,
    text: '妖森西缘林海莫名空出一片焦土圆坑，方圆三十丈古木尽数向外倾倒。坑心微热未散，半埋着几粒闪烁银辉的星辰砂与一块烧焦的古旧铁牌，隐隐传来星辰灵力波动。',
    choices: [
      {
        label: '迅速收集坑心星辰砂，同时戒备被异象吸引的同道',
        hint: '机缘难得 · 恐遇争夺筑基修士',
        combat: {
          enemy: 'cultivator',
          win: {
            text: '一名闻讯赶来的青袍筑基修士妄图抢夺星砂，被你连出重剑震退！整坑天外星辰砂尽归你手！',
            effects: { items: ['xingchen_sha'], stones: 185, lawExp: 14, lawId: 'star' },
          },
          lose: {
            text: '对方御剑极快抢占先机，你只抢回几粒碎星砂便负伤退走。',
            effects: { hp: -65, stones: 75, lawExp: 6, lawId: 'star' },
          },
        },
      },
      {
        label: '于夜半星辉落坑之时盘坐感悟，只取余辉不与人争',
        hint: '顺应星象 · 悟星辰法则',
        outcome: {
          text: '你避开白日纷争，夜深再临焦坑引星辉洗髓，神魂清明且星辰感悟大涨。',
          effects: { lawExp: 18, lawId: 'star', expPct: 0.18, attrs: { 神识: 2 } },
        },
      },
    ],
  },
  {
    id: 'wrl_ys_s26',
    title: '妖森 · 幽灯灵蛾',
    region: 'yaosen',
    pool: 'wild',
    tier: 2,
    weight: 3,
    minRealm: 1,
    maxRealm: 4,
    text: '子夜密林忽起漫天金色流萤——细看竟是成千上万只尾生灯光的「寻灵蛾」，正排成一条璀璨光河朝林海深处迁徙。修仙界传闻，寻灵蛾所聚之地必有天材地宝即将成熟。',
    choices: [
      {
        label: '收敛气息尾随金色蛾群，探寻成熟灵珍',
        hint: '气运与神识检定 · 追光寻宝',
        roll: {
          p: 0.6,
          attrs: { 气运: 0.015, 神识: 0.014 },
          success: {
            text: '跟随蛾群行出五里，竟见一株刚绽放的七彩玉兰，花蕊凝着三滴甘露与一枚破障丹级灵果！',
            effects: { items: ['pozhang_dan', 'qiannian_lingcao'], exp: 160 },
          },
          fail: {
            text: '蛾群却把你引到了一处满是腐瘴的死泥潭，原来它们贪恋的是泥下腐尸灵气。你暗骂一声晦气折返。',
            effects: { hp: -32, exp: 75 },
          },
        },
      },
      {
        label: '挥袖捉取几只寻灵蛾制成灵粉，留作日后探宝之用',
        hint: '稳妥取材 · 增进神识与灵石',
        outcome: {
          text: '寻灵蛾粉在坊市颇受寻宝散修追捧，你只取少许便放归蛾群，小赚一笔。',
          effects: { stones: 110, attrs: { 神识: 1 }, exp: 95 },
        },
      },
    ],
  },
  {
    id: 'wrl_ys_s27',
    title: '妖森 · 埋土铜鼎',
    region: 'yaosen',
    pool: 'wild',
    tier: 2,
    weight: 3,
    minRealm: 1,
    maxRealm: 4,
    text: '暴雨冲垮了一处山坡古泥，露出半截沉重无比的兽面青铜鼎耳。泥土里透出淡淡药香与铁锈味，鼎身镌刻着早已被历史淹没的古宗徽记。',
    choices: [
      {
        label: '耗费一月工力彻底掘出古鼎，探查鼎腹暗格',
        hint: '耗一月 · 根骨检定起古鼎',
        cost: { month: 1 },
        roll: {
          p: 0.62,
          attrs: { 根骨: 0.014, 气运: 0.012 },
          success: {
            text: '古鼎重逾数千斤，破土瞬间霞光微绽！鼎腹封蜡完好，竟藏着大还丹与一卷《奔雷掌秘典》残简！',
            effects: { items: ['dahuan_dan', 'yujian_benlei'], exp: 165 },
          },
          fail: {
            text: '掘到一半鼎底竟早已锈穿，仅从泥沙中筛出两块玄铁与几枚受潮灵石。',
            effects: { items: ['xuantie'], stones: 90, exp: 95 },
          },
        },
      },
      {
        label: '只拓印鼎耳上古宗铭文，不费力掘泥',
        hint: '省时省力 · 增悟性丹理',
        outcome: {
          text: '鼎耳铭文载着几句上古控火口诀，细细咀嚼大有启发。',
          effects: { lawExp: 12, lawId: 'pill', exp: 120, attrs: { 悟性: 1 } },
        },
      },
    ],
  },
  {
    id: 'wrl_ys_s28',
    title: '妖森 · 幻境樵夫',
    region: 'yaosen',
    pool: 'world',
    tier: 2,
    weight: 3,
    minRealm: 1,
    maxRealm: 4,
    text: '妖森腹地人迹罕至，浓雾里却忽然传来「叮叮当当」清脆伐木声。一名白发老樵夫正抡着生锈铁斧砍一棵参天古柏，奇的是斧刃落处木屑纷飞，树皮却瞬息愈合如初。老樵夫头也不抬：「年轻人，这棵树我砍了三百年，你替我砍一斧试试？」',
    choices: [
      {
        label: '接过锈铁斧，屏除杂念倾尽全力劈出一斧',
        hint: '道心与悟性检定 · 勘破光阴幻局',
        roll: {
          p: 0.58,
          attrs: { 道心: 0.015, 悟性: 0.014 },
          success: {
            text: '一斧落下，古柏、樵夫与浓雾轰然消散！你仍立于原地，掌心却多了一枚凝结着岁月清气的温润玉叶，寿元微增、光阴法则顿生感应！',
            effects: { lawExp: 16, lawId: 'time', lifespan: 6, expPct: 0.18 },
          },
          fail: {
            text: '一斧斩空，待回神时天色竟已过去三日，你惊出一身冷汗，忙运灵力震醒神魂退去。',
            effects: { exp: 110, attrs: { 道心: 1 } },
          },
        },
      },
      {
        label: '微笑拱手道「斧利不如心静」，转身破雾而去',
        hint: '不入幻阵 · 道心澄澈',
        outcome: {
          text: '身后传来老樵夫一声沧桑长笑：「好个通透娃娃！」雾气尽散，脚畔静放着一枚清心丹。',
          effects: { items: ['qingxin_dan'], demon: -14, attrs: { 道心: 2 }, exp: 130 },
        },
      },
    ],
  },
  {
    id: 'wrl_ys_s29',
    title: '妖森 · 刀客营地',
    region: 'yaosen',
    pool: 'wild',
    tier: 3,
    weight: 3,
    minRealm: 1,
    maxRealm: 4,
    text: '背风石壁下燃着一堆即将熄灭的篝火，烤架上焦黑的妖兽肉已冷，三名满身血腥的断魂刀客正围坐分赃——地布上摊着染血的宗门玉牌、两颗妖兽内丹与几只鼓囊储物袋。',
    choices: [
      {
        label: '趁其松懈纵剑突袭，替天行道并收缴赃物',
        hint: '黑吃黑或除暴 · 战断魂刀客',
        combat: {
          enemy: 'blade_rogue',
          win: {
            text: '一场疾风骤雨般的厮杀，三名恶徒伏诛！你收好妖兽内丹与二百余灵石，将遇害弟子的宗门玉牌妥善收起待日后送还。',
            effects: { items: ['yaoshou_neidan', 'bixue_dan'], stones: 215, karma: 18, reputation: 14 },
          },
          lose: {
            text: '刀客临危不乱联手反攻，你负伤借林木掩护脱身。',
            effects: { hp: -74, injury: 1 },
          },
        },
      },
      {
        label: '悄然于上风口散出迷香瘴粉，待其昏迷再收缴战利品',
        hint: '神识检定 · 智取恶徒',
        roll: {
          p: 0.58,
          attrs: { 神识: 0.015, 气运: 0.012 },
          success: {
            text: '毒瘴顺风飘散，片刻后三名刀客相继歪倒！你轻松缴获全部灵石与妖丹，又捆住恶徒挂上树梢留待妖森宗门巡使发落。',
            effects: { items: ['yaoshou_neidan'], stones: 195, karma: 14, exp: 145 },
          },
          fail: {
            text: '风向突转暴露了你的藏身处，只得拔剑硬拼！',
            combat: {
              enemy: 'blade_rogue',
              win: {
                text: '激战斩杀刀客，夺得赃物灵石。',
                effects: { stones: 180, karma: 12 },
              },
              lose: {
                text: '反受其害，狼狈逃入深林。',
                effects: { hp: -68, injury: 1 },
              },
            },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_ys_s30',
    title: '妖森 · 灵泉蛙鸣',
    region: 'yaosen',
    pool: 'wild',
    tier: 2,
    weight: 3,
    minRealm: 1,
    maxRealm: 4,
    text: '月照幽谷，一汪乳白色温泉水汽氤氲。泉石上蹲着七只通体碧玉般的巴掌灵蛙，正一唱一和鼓腮齐鸣。奇异的是，蛙鸣声清脆如编钟玉磬，听在耳中竟能抚平妖森毒瘴引起的气血烦躁。',
    choices: [
      {
        label: '脱靴浸足灵泉，伴玉蛙清音打坐一宿',
        hint: '修身养性 · 疗伤清魔且进修为',
        outcome: {
          text: '泉水暖流洗去满身疲惫与暗伤，玉蛙围着你的脚踝游弋嬉戏，一夜之间修为与灵力俱复巅峰！',
          effects: { heal: 1, mpPct: 0.5, demon: -14, exp: 155, karma: 8 },
        },
      },
      {
        label: '取出一粒培元丹捏碎洒入泉中喂食玉蛙',
        hint: '消耗培元丹 · 灵蛙衔宝报恩',
        cost: { item: 'peiyuan_dan' },
        outcome: {
          text: '七只玉蛙欢鸣跃入泉底，片刻后竟合抱顶出一枚温润洁白的冰心雪莲丹原料与两张聚灵残符！',
          effects: { items: ['qingxin_dan', 'huxin_fu'], karma: 14, attrs: { 气运: 1 } },
        },
      },
    ],
  },
  {
    id: 'wrl_ys_s31',
    title: '妖森 · 断崖剑意',
    region: 'yaosen',
    pool: 'wild',
    tier: 3,
    weight: 3,
    minRealm: 1,
    maxRealm: 4,
    text: '云雾缭绕的妖森千仞绝壁上，不知哪位剑道大能昔年曾一剑劈开山崖、斩杀祸世大妖，留下一道宽逾三尺、深不见底的笔直剑壑。时隔数百年，剑壑边缘草木依然寸草不生，锋锐气息割面生疼。',
    choices: [
      {
        label: '立于剑壑边缘迎风拔剑，与古仙残余剑意隔空交锋',
        hint: '耗一月 · 剑道法则大幅精进',
        cost: { month: 1 },
        roll: {
          p: 0.6,
          attrs: { 悟性: 0.015, 根骨: 0.012 },
          success: {
            text: '衣袍被剑气割裂数道口子，你双目却越来越亮！一月之后一剑挥出，竟已隐隐带出三分古壑开山之势！',
            effects: { lawExp: 24, lawId: 'sword', expPct: 0.22, attrs: { 悟性: 2 } },
          },
          fail: {
            text: '残存剑威过于霸道，震伤了你的腕脉经络。你咬牙调息数日，终究也悟出一缕凛然剑气。',
            effects: { hp: -48, lawExp: 12, lawId: 'sword', exp: 120 },
          },
        },
      },
      {
        label: '在剑壑下方的碎石滩寻觅沾染剑气的炼器奇铁',
        hint: '稳妥寻宝 · 得剑符与玄铁',
        outcome: {
          text: '经百年剑意日夜洗礼，崖底碎石中竟孕育出一块极品玄铁与一张天然凝纹的剑意封灵符！',
          effects: { items: ['xuantie', 'jianqi_fu'], exp: 115 },
        },
      },
    ],
  },
  {
    id: 'wrl_ys_s32',
    title: '妖森 · 药农迷途',
    region: 'yaosen',
    pool: 'world',
    tier: 2,
    weight: 3,
    minRealm: 1,
    maxRealm: 4,
    text: '妖森外缘毒雾骤起，三名结伴入林采药的散修误触天然迷阵，在方圆百丈的乱树丛里团团转了整整两日，灵力耗尽、面色发青，眼看便要撑不住倒在瘴气之中。',
    choices: [
      {
        label: '以神识引领他们走出迷雾，并分赠清毒丹药',
        hint: '救人一命 · 获谢礼与高额声望',
        outcome: {
          text: '三人死里逃生激动不已，当场把冒死采到的一株千年灵草与九十块灵石双手奉上，称回到落霞城定广传你的恩德！',
          effects: { items: ['qiannian_lingcao'], stones: 90, karma: 22, reputation: 18 },
        },
      },
      {
        label: '指明生门方向但不免费护送，索要一百灵石带路费',
        hint: '明码标价 · 稳赚灵石',
        outcome: {
          text: '性命攸关，三人咬牙凑齐一百灵石奉上。你将他们平安送出毒瘴林外，两不相欠。',
          effects: { stones: 100, exp: 95 },
        },
      },
    ],
  },
  {
    id: 'wrl_ys_s33',
    title: '妖森 · 树冠星台',
    region: 'yaosen',
    pool: 'wild',
    tier: 3,
    weight: 3,
    minRealm: 1,
    maxRealm: 4,
    text: '爬上一株高耸入云的太古巨杉树冠，竟发觉枝桠间用青藤与灵玉搭着一座古老的观星木台。台面刻满周天星辰方位，虽已荒废多载，每逢晴夜依旧能自行聚拢稀薄星华。',
    choices: [
      {
        label: '于高空树冠迎星打坐，借残阵引周天星力淬炼识海',
        hint: '耗一月 · 悟星辰与增神识',
        cost: { month: 1 },
        outcome: {
          text: '林海如涛在脚下翻滚，群星仿佛触手可及。一月苦修下来，你的神识与星辰感悟双双大涨！',
          effects: { expPct: 0.22, lawExp: 18, lawId: 'star', attrs: { 神识: 2, 悟性: 1 } },
        },
      },
      {
        label: '撬开木台中央玉盘暗格，查看古星修是否留有遗物',
        hint: '气运检定 · 探查星台秘格',
        roll: {
          p: 0.58,
          attrs: { 气运: 0.015, 神识: 0.012 },
          success: {
            text: '玉盘下竟压着一小袋银光闪烁的磁砂与一张护心符，堪称意外横财！',
            effects: { items: ['xingchen_sha', 'huxin_fu'], exp: 130 },
          },
          fail: {
            text: '暗格空空如也，只留几行前人观星感叹，你轻叹一声便顺藤滑回地面。',
            effects: { exp: 95, attrs: { 道心: 1 } },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_ys_s34',
    title: '妖森 · 血池祭坛',
    region: 'yaosen',
    pool: 'wild',
    tier: 3,
    weight: 3,
    minRealm: 1,
    maxRealm: 4,
    text: '恶臭扑鼻的隐蔽山坳里，竟藏着一池翻滚冒泡的暗红妖血池！一名身披黑袍的筑基邪修正在池畔催动邪阵，准备将数头捕获的妖兽精血炼成一枚血煞邪丹，池底隐隐浮沉着几块血光闪耀的灵石。',
    choices: [
      {
        label: '破阵诛邪，毁掉血池并斩杀黑袍邪修',
        hint: '正道除魔 · 战筑基修士',
        combat: {
          enemy: 'cultivator',
          win: {
            text: '剑气炸毁血池阵眼，邪修惨叫伏诛！你净化池底残留煞气，搜得两百灵石、聚灵丹与正道厚重功德。',
            effects: { stones: 210, items: ['juling_dan', 'poxie_fu'], karma: 26, reputation: 20 },
          },
          lose: {
            text: '邪修借血池煞气威能大涨，你硬接一掌吐血退走，不敢恋战。',
            effects: { hp: -76, injury: 1 },
          },
        },
      },
      {
        label: '趁邪修炼丹紧要关头夺走半成品血丹，反手引爆血池脱身',
        hint: '气运检定 · 魔道手段谋厚利',
        roll: {
          p: 0.54,
          attrs: { 气运: 0.015, 根骨: 0.012 },
          success: {
            text: '你凌空夺走那枚煞气滚滚的邪丹与百余灵石，反手一符引爆血池断后！吞炼药力虽增些许心魔，修为却暴涨一大截。',
            effects: { expPct: 0.26, stones: 130, karma: -14, demon: 8 },
          },
          fail: {
            text: '血池反噬炸得你气血翻腾，邪修暴怒扑来，你只得仓皇遁逃。',
            effects: { hp: -66, demon: 5 },
          },
        },
      },
    ],
  },

  /* ============================================================================
   * 四、东海归墟（guixu · 金丹至炼虚 · 45 节点）
   * ============================================================================ */

  /* ---------- 链一：沉海龙库（4 段） ---------- */
  {
    id: 'wrl_gx_dragon_1',
    title: '归墟 · 龙宫海眼',
    region: 'guixu',
    pool: 'wild',
    tier: 4,
    weight: 4,
    minRealm: 2,
    maxRealm: 5,
    once: true,
    text: '东海归墟万丈海眼骤起罕见「退渊大潮」，旋转百里的墨黑漩涡竟短暂裂开一道通向海底深渊的平静水道！透过碧蓝水壁，隐约可见深海之下矗立着一座被赤红珊瑚吞没半边的上古龙宫偏库，琉璃宫檐闪耀着沧海灵光。\n\n水道入口处，一名身披血红珊瑚重甲的海族妖将正手持长戟巡弋，森冷海潮令方圆十里鱼群绝迹。',
    choices: [
      {
        label: '御剑破浪，正面击溃守门珊瑚妖将闯入龙库',
        hint: '霸气强闯 · 战珊瑚妖将',
        combat: {
          enemy: 'coral_demon',
          win: {
            text: '剑光劈碎血红珊瑚甲，妖将长戟脱手坠入深渊。你顺手折下一截精纯归墟灵珊瑚，昂首踏入海底龙宫前庭！',
            effects: { items: ['guixu_shanhu'], exp: 520, flag: { 归墟斩将入龙库: true } },
            goto: 'wrl_gx_dragon_2',
          },
          lose: {
            text: '百丈寒潮如山压顶，你护体真元几近崩碎，只得借水遁冲出海面喘息。',
            effects: { hp: -165, injury: 1 },
          },
        },
      },
      {
        label: '催动缩地成寸符或空间隐匿术，避开海族巡哨潜入偏门',
        hint: '神识检定 · 巧潜海底龙宫',
        roll: {
          p: 0.58,
          attrs: { 神识: 0.015, 悟性: 0.012 },
          success: {
            text: '你贴着海沟暗流悄然游弋，借珊瑚丛掩护躲过珊瑚妖将巡视，自一处坍塌的水晶窗棂无声滑入龙库回廊！',
            effects: { exp: 420, lawExp: 14, lawId: 'space', flag: { 归墟潜行入龙库: true } },
            goto: 'wrl_gx_dragon_2',
          },
          fail: {
            text: '暗流卷起细沙暴露了你的身形，深海夜叉提叉杀出拦截！',
            combat: {
              enemy: 'sea_yaksha',
              win: {
                text: '三剑斩退深海夜叉，你趁大潮未合迅速钻入龙库偏门。',
                effects: { stones: 480, exp: 480 },
                goto: 'wrl_gx_dragon_2',
              },
              lose: {
                text: '海流汹涌难敌夜叉水煞，你被迫浮出海面暂避。',
                effects: { hp: -155, injury: 1 },
              },
            },
          },
        },
      },
      {
        label: '只在海眼外缘礁石拾取退潮露出的珊瑚与玄冰便退',
        hint: '稳健避险 · 不入深渊龙宫',
        outcome: {
          text: '归墟大潮说合就合，绝非久留之地。你飞速捡走一株归墟灵珊瑚便御虹远去，稳赚不赔。',
          effects: { items: ['guixu_shanhu'], stones: 320, exp: 320 },
        },
      },
    ],
  },
  {
    id: 'wrl_gx_dragon_2',
    title: '归墟 · 避水晶廊',
    region: 'guixu',
    pool: 'branch',
    tier: 4,
    weight: 0,
    minRealm: 2,
    maxRealm: 5,
    text: '龙库内部竟被避水结界隔绝出一片干燥晶莹的宫廊，穹顶镶嵌着早已黯淡的夜明鲸珠，四壁绘着太古真龙巡海镇压归墟海眼的壮阔壁画。\n\n宫廊尽头三丈青铜重门紧闭，门前静立着一具身披玄铁鳞甲、胸膛灵核仍在缓缓旋转的古修机关傀儡——它同时掌管着整座龙库的防盗海潮机关！',
    choices: [
      {
        label: '强攻毁去古修机关傀儡，暴力破开龙库铜门',
        hint: '力破千军 · 战古修机关傀儡',
        combat: {
          enemy: 'ancient_puppet',
          win: {
            text: '漫天火星四溅，千年机关傀儡胸口灵核轰然碎裂！青铜重门发出沉闷轰鸣，向内缓缓洞开。',
            effects: { stones: 620, items: ['xingchen_sha'], exp: 580, flag: { 龙库力破傀儡: true } },
            goto: 'wrl_gx_dragon_3',
          },
          lose: {
            text: '傀儡重拳蕴含惊天巨力，震得你五脏移位，只得退回水道冲出深海。',
            effects: { hp: -180, injury: 1 },
          },
        },
      },
      {
        label: '依穹顶龙纹推演八卦阵钥，停机解除傀儡戒备',
        hint: '悟性 ≥ 18 · 破古阵免死战',
        require: 'char.attrs.悟性 >= 18',
        requireHint: '悟性不足十八，难解太古避水八卦锁',
        outcome: {
          text: '你指尖连点廊柱八处龙鳞凸起，避水阵脉骤然一顿！玄铁傀儡眼中红芒熄灭，竟单膝跪地让出主库通道，令你对阵道精髓豁然贯通。',
          effects: { lawExp: 24, lawId: 'array', exp: 520, flag: { 龙库阵解傀儡: true } },
          goto: 'wrl_gx_dragon_3',
        },
      },
    ],
  },
  {
    id: 'wrl_gx_dragon_3',
    title: '归墟 · 血魔争库',
    region: 'guixu',
    pool: 'branch',
    tier: 4,
    weight: 0,
    minRealm: 2,
    maxRealm: 5,
    text: '踏入龙库主殿，眼前珠光宝气几乎令人目眩！无数海贝玉匣层叠如山，正中玉柱上托着一颗流转沧海虚影的避水宝珠。然而你并非唯一闯入者——两名身披猩红披风的血魔宗金丹弟子已先一步自另一条暗缝钻入，正挥舞血幡企图强行收取宝珠，见你进门，当即狞笑杀来！',
    choices: [
      {
        label: '冷哼挥剑迎击血魔宗弟子，岂容魔徒染指龙宫重宝',
        hint: '除魔护宝 · 战血魔宗弟子',
        combat: {
          enemy: 'blood_cult',
          win: {
            text: '你一剑斩断血河魔幡，血魔弟子惨号化作血雾伏诛！满殿龙宫秘藏再无敌手，任你择取！',
            effects: { stones: 750, karma: 24, reputation: 22, exp: 650, flag: { 龙库斩血魔: true } },
            goto: 'wrl_gx_dragon_4',
          },
          lose: {
            text: '血煞诡谲侵蚀法力，你拼力突围被大潮冲出龙库，错失主殿机缘。',
            effects: { hp: -190, injury: 1 },
          },
        },
      },
      {
        label: '先引动龙宫外围碧海寒气封住血魔退路，再借冰威压杀',
        hint: '耗碧海玄冰髓 · 冰封魔修占尽绝对先机',
        cost: { item: 'bihai_xuanbing' },
        outcome: {
          text: '万年寒髓化作漫天玄冰狂潮，血魔宗弟子护体血光瞬间冻裂！你不费吹灰之力便将其冰封斩杀，连玉柱上的避水宝珠亦似感念寒脉之韵而微微低鸣。',
          effects: { stones: 680, karma: 26, exp: 600, flag: { 龙库冰封血魔: true } },
          goto: 'wrl_gx_dragon_4',
        },
      },
    ],
  },
  {
    id: 'wrl_gx_dragon_4',
    title: '归墟 · 沧海遗珍',
    region: 'guixu',
    pool: 'branch',
    tier: 4,
    weight: 0,
    minRealm: 2,
    maxRealm: 5,
    text: '退渊大潮即将回涌，整座水晶龙宫发出不堪重负的咔嚓脆响！玉柱之上放着地阶法宝「沧海定水珠」，一旁贝壳玉案则供奉着刻有地阶绝学《北溟吞星诀》的深海玉碑，以及一匣专为金丹破境预备的结金丹与星辰砂。时间紧迫，你只能择其重者携出归墟！',
    choices: [
      {
        label: '夺取「沧海定水珠」与结金宝丹，凭定水神威破浪而出',
        hint: '获地阶法宝沧海定水珠与结金丹',
        outcome: {
          text: '定水珠入手，万丈回涌海涛竟自行向两侧分开十丈！你从容踏浪浮出东海海面，宝珠在手，从此纵横沧海再无水厄之忧。',
          effects: { items: ['canghai_zhu', 'jiejin_dan', 'guixu_shanhu'], stones: 520, expPct: 0.2 },
        },
      },
      {
        label: '以神识强拓玉碑《北溟吞星诀》，并扫走案上星辰砂与大还丹',
        hint: '习得地阶星辰功法 · 灵海深不可测',
        outcome: {
          text: '神识如刀将整篇《北溟吞星诀》刻入识海！最后一息你施展遁光冲破合拢的水壁，海面上星辉垂落，宛若北溟巨鲲吞吐星河。',
          effects: {
            items: ['xingchen_sha', 'dahuan_dan'],
            lawExp: 28,
            lawId: 'star',
            expPct: 0.24,
            techniques: [{
              id: 'wt_beiming_xing', name: '《北溟吞星诀》', grade: '地',
              speed: 0.22, atk: 0.26, def: 0.2, lifespan: 45, lawId: 'star', artName: '北溟星涡吞天式',
            }],
          },
        },
      },
    ],
  },

  /* ---------- 链二：幽冥鬼舫（4 段） ---------- */
  {
    id: 'wrl_gx_fleet_1',
    title: '归墟 · 雾海鬼帆',
    region: 'guixu',
    pool: 'world',
    tier: 4,
    weight: 4,
    minRealm: 2,
    maxRealm: 5,
    once: true,
    text: '无月黑夜，东海大雾漫天。海面忽然响起低沉悠长的古铜号角声，三艘破帆垂挂、船舷挂满幽绿灯笼的十丈古楼船无声破雾驶来！船身遍布海藻贝壳，甲板上却灯火通明，隐隐传来古装海商讨价还价的喧嚣——正是东海百年一遇的「幽冥鬼舫」秘市！',
    choices: [
      {
        label: '御剑落于头船甲板，踏入这百年难遇的海上鬼市',
        hint: '胆大艺高 · 登船探秘',
        outcome: {
          text: '双脚踏上湿滑沉木甲板，雾气骤然在身后合拢。一名戴着海螺面具的船夫提灯迎上，嘶哑低笑：「活人贵客登船，请先收起剑气，咱们楼船只认灵石与旧物。」',
          effects: { exp: 380, flag: { 归墟登鬼舫: true } },
          goto: 'wrl_gx_fleet_2',
        },
      },
      {
        label: '绕鬼舫盘旋一周，以神识探明其航向与阴气源头再登船',
        hint: '神识检定 · 先知己知彼',
        roll: {
          p: 0.6,
          attrs: { 神识: 0.015, 道心: 0.012 },
          success: {
            text: '神识扫过底舱，你竟发觉这鬼舫乃上古沉没的东海仙朝商船，船龙骨内封印着一尊金丹级阴煞尸将！你心中有数，从容落于主船舱门前。',
            effects: { attrs: { 神识: 2 }, exp: 420, flag: { 鬼舫洞悉底舱: true } },
            goto: 'wrl_gx_fleet_2',
          },
          fail: {
            text: '海雾诡异折返神识，一股阴寒气机顺着探查反卷而来，令你心神微震，忙稳住身形落于甲板。',
            effects: { demon: 5, mp: -60, exp: 320 },
            goto: 'wrl_gx_fleet_2',
          },
        },
      },
      {
        label: '鬼船阴气极重，只远远观望雾中海市奇景便御剑离开',
        hint: '敬而远之 · 安然保身',
        outcome: {
          text: '片刻后铜号再鸣，三艘巨船复没入漫天海雾。你在海风中拾得一只自船尾飘落的水密漂流玉瓶，内藏一枚回灵宝药。',
          effects: { items: ['dahuan_dan'], exp: 300 },
        },
      },
    ],
  },
  {
    id: 'wrl_gx_fleet_2',
    title: '归墟 · 珍珠哑市',
    region: 'guixu',
    pool: 'branch',
    tier: 4,
    weight: 0,
    minRealm: 2,
    maxRealm: 5,
    text: '中舱灯火迷离，摆着数十座以鲸骨雕成的摊位。摊主皆是面色青白、衣着古朴的前朝海客残灵，案上陈列着许多早已在现世绝迹的深海秘珍：万年玄冰髓、刻有空间秘纹的沉船铁匣、还有一瓶贴着结丹印记的养神玉清丹。',
    choices: [
      {
        label: '支付三百灵石，买下那只刻满空间古纹的沉船铁匣',
        hint: '耗 300 灵石 · 购得空间秘藏',
        cost: { stones: 300 },
        outcome: {
          text: '古灵摊主满意颔首，交出沉船铁匣。指尖拂去铜绿，匣内竟封存着玄阶空间绝学《幻星移位诀》与一张缩地成寸符！',
          effects: {
            items: ['suodi_fu'],
            lawExp: 18,
            lawId: 'space',
            flag: { 鬼舫购空间匣: true },
            techniques: [{
              id: 'wt_huanxing_yi', name: '《幻星移位诀》', grade: '玄',
              speed: 0.15, atk: 0.14, def: 0.12, lifespan: 18, lawId: 'space', artName: '移形换影刺',
            }],
          },
          goto: 'wrl_gx_fleet_3',
        },
      },
      {
        label: '以两百五十灵石换取玄冰髓与冰心雪莲丹',
        hint: '耗 250 灵石 · 换取克魔清心重宝',
        cost: { stones: 250 },
        outcome: {
          text: '古灵摊主接过灵石，双手奉上寒气氤氲的玉盒。正当交易完成，船身却骤然剧烈倾侧，底舱传来震天尸吼！',
          effects: { items: ['bihai_xuanbing', 'bingxin_dan'], flag: { 鬼舫购玄冰: true } },
          goto: 'wrl_gx_fleet_3',
        },
      },
      {
        label: '一石不花，顺着船舱暗梯悄然潜向鬼舫禁地底舱',
        hint: '胆大包天 · 直奔船底秘宝',
        outcome: {
          text: '你借人群掩护滑入吱呀作响的底舱木梯。越往下阴寒越重，空气里弥漫着千年尸毒与金铁腐朽气味！',
          effects: { exp: 380, flag: { 鬼舫潜入底舱: true } },
          goto: 'wrl_gx_fleet_3',
        },
      },
    ],
  },
  {
    id: 'wrl_gx_fleet_3',
    title: '归墟 · 龙骨尸将',
    region: 'guixu',
    pool: 'branch',
    tier: 4,
    weight: 0,
    minRealm: 2,
    maxRealm: 5,
    text: '船底暗舱竟被滔天黑雾淹没！一尊身披破碎金甲、眼眶燃着惨绿幽火的阴煞尸将正挣断龙骨上的镇海铁链，咆哮道：「百年怨海，今日借尔等活人精血重见天日！」满船海客残灵惊慌四散，幽冥鬼舫眼看就要拖着所有人沉入万丈归墟！',
    choices: [
      {
        label: '祭剑斩向挣脱束缚的阴煞尸将，稳住幽冥鬼舫龙骨',
        hint: '生死恶战 · 战阴煞尸将',
        combat: {
          enemy: 'corpse_general',
          win: {
            text: '剑意破开千年尸毒黑雾，你一剑贯碎金甲尸将眉心煞核！龙骨哀鸣渐止，船身缓缓恢复平稳，满船古灵竟齐齐朝你躬身行大礼！',
            effects: { stones: 820, karma: 30, reputation: 26, exp: 720, flag: { 鬼舫斩尸将: true } },
            goto: 'wrl_gx_fleet_4',
          },
          lose: {
            text: '尸毒蚀体剧痛难忍，你强催遁光破开船顶冲上夜空，回头只见鬼舫沉入海雾深处。',
            effects: { hp: -200, injury: 1 },
          },
        },
      },
      {
        label: '以紫霄雷法或镇魔破邪符重新焊死龙骨镇海铁链，借大阵镇压尸将',
        hint: '悟性与道心检定 · 巧修船阵镇尸',
        roll: {
          p: 0.56,
          attrs: { 悟性: 0.015, 道心: 0.014 },
          success: {
            text: '你连拍九道真元注入船底镇海大阵，断链重续如龙锁紧金甲尸将！滔天黑雾顷刻被阵纹吸纳镇压，满船古灵欢呼膜拜！',
            effects: { lawExp: 24, lawId: 'array', karma: 28, exp: 650, flag: { 鬼舫阵镇尸将: true } },
            goto: 'wrl_gx_fleet_4',
          },
          fail: {
            text: '大阵残损过甚，反震之力令你虎口流血，尸将趁隙猛扑上来！',
            combat: {
              enemy: 'corpse_general',
              win: {
                text: '血战良久终于彻底斩杀尸将，平定船祸！',
                effects: { stones: 700, karma: 24, exp: 680 },
                goto: 'wrl_gx_fleet_4',
              },
              lose: {
                text: '力战不敌，你咬牙捏碎逃生遁符冲出海雾。',
                effects: { hp: -185, injury: 1 },
              },
            },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_gx_fleet_4',
    title: '归墟 · 船主赠礼',
    region: 'guixu',
    pool: 'branch',
    tier: 4,
    weight: 0,
    minRealm: 2,
    maxRealm: 5,
    text: '天边露出一抹鱼肚白，鬼舫雾气渐淡。顶层船楼走出一位身着紫金古袍的沧桑船主虚影，捧着一只雕龙紫檀宝匣向你深深作揖：「老夫困守幽冥商船三百载，今日蒙道友力挽狂澜，此船方免覆灭之劫。匣中乃前朝遗留的镇船剑录与奇珍，愿赠恩公！」',
    choices: [
      {
        label: '收下《碧沙听潮剑》真传与养神玉清丹，拜别幽冥鬼舫',
        hint: '习得东海玄阶剑诀 · 叠浪剑意连绵',
        outcome: {
          text: '晨光破海，幽冥鬼舫化作点点青芒消散于万顷碧波。你凌空立于海面，掌中玉简与丹药沉甸甸，海涛声竟与体内剑意隐隐共鸣。',
          effects: {
            items: ['yangshen_dan', 'juling_zhenfu'],
            karma: 20,
            expPct: 0.22,
            techniques: [{
              id: 'wt_bisha_jian', name: '《碧沙听潮剑》', grade: '玄',
              speed: 0.14, atk: 0.18, def: 0.11, lifespan: 15, lawId: 'sword', artName: '潮生碧海剑',
            }],
          },
        },
      },
      {
        label: '择取宝匣中《周天星辰诀玉简》与紫霄雷铃，增强攻守底蕴',
        hint: '得地阶星辰玉简与紫霄雷铃法宝',
        outcome: {
          text: '船主朗笑一声，将玉简与雷铃递入你手。朝阳跃出海面，三艘巨船消隐无踪，唯余万丈金波耀眼。',
          effects: { items: ['yujian_xingchen', 'zixiao_ling'], stones: 480, expPct: 0.18 },
        },
      },
    ],
  },

  /* ---------- 链三：潮星孤屿（3 段） ---------- */
  {
    id: 'wrl_gx_star_1',
    title: '归墟 · 潮生孤屿',
    region: 'guixu',
    pool: 'wild',
    tier: 4,
    weight: 4,
    minRealm: 2,
    maxRealm: 5,
    once: true,
    text: '东海星月交辉之夜，潮汐退去百里，海心竟缓缓浮起一座平日深埋海底的黑曜石孤屿。岛巅矗立着一座残破星月石亭，亭中石桌摆着半局未竟的黑白星子残棋，四周暗礁却栖息着一头翼展十丈的裂云雷鹏，紫电绕身虎视眈眈！',
    choices: [
      {
        label: '御剑凌空激战裂云雷鹏，夺取潮星孤屿登岛资格',
        hint: '雷海争锋 · 战裂云雷鹏',
        combat: {
          enemy: 'thunder_roc',
          win: {
            text: '剑光撕裂紫电羽翼，雷鹏悲鸣一声震翼远遁云霄！你在礁石巢穴中拾得一截焦香雷击木，步上星月石亭。',
            effects: { items: ['leimu'], lawExp: 16, lawId: 'thunder', exp: 560, flag: { 潮屿战退雷鹏: true } },
            goto: 'wrl_gx_star_2',
          },
          lose: {
            text: '雷鹏电爪快逾闪电，劈得你护体灵光剧震，只得潜入海浪暂避锋芒。',
            effects: { hp: -175, injury: 1 },
          },
        },
      },
      {
        label: '趁雷鹏俯冲捕猎巨鲸之隙，施展遁术悄然登临石亭',
        hint: '身法与气运检定 · 避战登屿',
        roll: {
          p: 0.58,
          attrs: { 气运: 0.015, 神识: 0.012 },
          success: {
            text: '你耐心潜伏暗礁半个时辰，果见雷鹏振翅扑向十里外跃出海面的巨鲸！你身形如电掠上孤屿，稳稳立于星月残棋之前！',
            effects: { exp: 420, flag: { 潮屿潜登石亭: true } },
            goto: 'wrl_gx_star_2',
          },
          fail: {
            text: '雷鹏目力极锐，俯冲半途骤然折返，漫天电弧倾泻而下！',
            combat: {
              enemy: 'thunder_roc',
              win: {
                text: '险战击伤雷鹏翼骨将其逐走，终得登临石亭！',
                effects: { stones: 520, exp: 520 },
                goto: 'wrl_gx_star_2',
              },
              lose: {
                text: '身中数道电弧浑身焦黑，狼狈遁离孤屿。',
                effects: { hp: -170, injury: 1 },
              },
            },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_gx_star_2',
    title: '归墟 · 星棋残局',
    region: 'guixu',
    pool: 'branch',
    tier: 4,
    weight: 0,
    minRealm: 2,
    maxRealm: 5,
    text: '星月石亭中央，黑曜石棋盘上星辰砂凝成的棋子竟随海潮涨落自行明灭！棋盘边刻着一行飘逸剑字：「百廿载一浮潮星屿，若能以三子定星潮、破死劫者，可观吾毕生剑道与星海之秘。」\n\n正当你凝神推演棋局之际，一道斗笠孤影踏浪而来，背负三尺青锋，沙哑笑道：「巧了，这盘残棋，我也等了三十年！」',
    choices: [
      {
        label: '拔剑相迎孤鸿剑修，以剑道高低决定谁先落子',
        hint: '剑修论锋 · 战孤鸿剑修',
        combat: {
          enemy: 'sword_rogue', displayName: '孤鸿剑客',
          win: {
            text: '孤鸿一剑虽绝，仍逊你半分锐气！斗笠剑客收剑入鞘，朗笑拱手：「道友剑心通明，这盘残棋合该归你！」说罢踏浪潇洒离去。',
            effects: { lawExp: 22, lawId: 'sword', reputation: 22, exp: 650, flag: { 潮屿剑胜孤鸿: true } },
            goto: 'wrl_gx_star_3',
          },
          lose: {
            text: '孤鸿剑光如剪水惊鸿，逼得你连退十步跃下礁石。虽败犹荣，剑意却亦有精进。',
            effects: { hp: -165, lawExp: 14, lawId: 'sword', exp: 380 },
          },
        },
      },
      {
        label: '邀孤鸿剑修共参残局，彼此切磋星辰与剑道妙理',
        hint: '魅力与悟性检定 · 化干戈为同道',
        roll: {
          p: 0.58,
          attrs: { 魅力: 0.015, 悟性: 0.015 },
          success: {
            text: '斗笠剑客略一沉吟，竟欣然落座对弈！二人你一子、我一子，竟联手解开了百年死劫，星月石亭骤然冲起一道璀璨星柱直贯云霄！',
            effects: { lawExp: 18, lawId: 'star', karma: 14, exp: 580, flag: { 潮屿共解星棋: true } },
            goto: 'wrl_gx_star_3',
          },
          fail: {
            text: '孤鸿剑客性情孤僻冷哼道：「大道独行，岂容分润？」拔剑直刺你面门！',
            combat: {
              enemy: 'sword_rogue', displayName: '孤鸿剑客',
              win: {
                text: '剑锋相交激起漫天星火，你终以一招险胜，独享石亭机缘！',
                effects: { lawExp: 18, lawId: 'sword', exp: 600 },
                goto: 'wrl_gx_star_3',
              },
              lose: {
                text: '一招落败坠入海潮，只得望亭兴叹。',
                effects: { hp: -160, exp: 340 },
              },
            },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_gx_star_3',
    title: '归墟 · 沧海星剑',
    region: 'guixu',
    pool: 'branch',
    tier: 4,
    weight: 0,
    minRealm: 2,
    maxRealm: 5,
    text: (s) => `石棋应声而解，棋盘裂开显露出一块流光溢彩的星海玉璧。${s.flags['潮屿共解星棋'] ? '孤鸿剑客大笑三声，只取玉璧中半缕剑意便御剑冲霄而去，将完整传承留给了你。' : '海潮开始回涨，孤屿即将再次沉入百年深海！'}玉璧之上清晰镌刻着地阶星剑绝学《沧海潮汐星剑录》，凹槽里更嵌着星辰砂与两枚珍稀丹药！`,
    choices: [
      {
        label: '全神贯注铭记《沧海潮汐星剑录》，并携星辰砂御虹离岛',
        hint: '习得地阶星剑功法 · 潮星共鸣',
        outcome: {
          text: '星潮剑意轰然入脑，仿佛东海万里明月尽在剑锋之间！你在海水没过石亭前最后一瞬冲天而起，从此多了一门镇压同阶的地阶神通！',
          effects: {
            items: ['xingchen_sha', 'dahuan_dan'],
            lawExp: 26,
            lawId: 'star',
            expPct: 0.25,
            techniques: [{
              id: 'wt_canghai_jue', name: '《沧海潮汐星剑录》', grade: '地',
              speed: 0.22, atk: 0.27, def: 0.21, lifespan: 50, lawId: 'star', artName: '沧海明月星潮斩',
            }],
          },
        },
      },
      {
        label: '将石亭星辉悉数引入丹田冲击经脉，并取走全部破境珍药',
        hint: '修为与突破成算暴涨 · 获结金丹与聚灵阵符',
        outcome: {
          text: '整座石亭积蓄百年的星海灵机尽数灌入你丹田！孤屿沉入海底之际，你修为精进如飞，袖中更添数件压箱重宝。',
          effects: { items: ['jiejin_dan', 'juling_zhenfu', 'yangshen_dan'], expPct: 0.3, breakBonus: 12 },
        },
      },
    ],
  },

  /* ---------- 东海归墟 独立奇遇 01–09 ---------- */
  {
    id: 'wrl_gx_s01',
    title: '归墟 · 鲸落秘市',
    region: 'guixu',
    pool: 'world',
    tier: 3,
    weight: 4,
    minRealm: 2,
    maxRealm: 5,
    text: '一头寿终正寝的太古灵鲸浮尸东海浅滩，庞大如岛屿的鲸骨之间，短短三日便聚起数十名闻讯赶来的金丹散修与海岛商行，临时搭起一座喧闹无比的「鲸落坊市」，争相交易鲸脂、灵珠与深海异宝。',
    choices: [
      {
        label: '出三百灵石淘换一块鲸腹深处孕育的避水灵玉与玄冰髓',
        hint: '耗 300 灵石 · 气运检定淘海珍',
        cost: { stones: 300 },
        roll: {
          p: 0.62,
          attrs: { 神识: 0.015, 气运: 0.015 },
          success: {
            text: '你慧眼独具，剖开那块不起眼的灰白鲸蜡，里头竟包着一团极其精纯的碧海玄冰髓与一枚罕见大还丹！',
            effects: { items: ['bihai_xuanbing', 'dahuan_dan'], exp: 360 },
          },
          fail: {
            text: '鲸蜡内仅凝结了半块普通归墟灵珊瑚，不过转手卖给炼器师也足以保本。',
            effects: { items: ['guixu_shanhu'], stones: 160 },
          },
        },
      },
      {
        label: '立于鲸首之巅默哀送灵，吸纳太古巨兽散归天地的沧海残韵',
        hint: '敬畏生灵 · 增寿元与道心',
        outcome: {
          text: '一鲸落，万物生。你在海风中感受沧海轮回之浩瀚，竟悟出一缕光阴生息真意，寿元大增！',
          effects: { lifespan: 10, lawExp: 18, lawId: 'time', karma: 18, expPct: 0.16 },
        },
      },
    ],
  },
  {
    id: 'wrl_gx_s02',
    title: '归墟 · 海眼漩涡',
    region: 'guixu',
    pool: 'wild',
    tier: 4,
    weight: 4,
    minRealm: 2,
    maxRealm: 5,
    text: '晴空万里却狂涛骤卷，前方百里海域毫无征兆塌陷成一座漏斗状无尽漩涡！狂暴吸力拉扯着高空云层，漩涡边缘不时有远古沉船残片与闪烁灵光的宝匣被暗流抛上浪尖，转瞬又吞回渊底。',
    choices: [
      {
        label: '催动护体真元贴近漩涡边缘，御剑抢捞一只银光宝匣',
        hint: '根骨与气运检定 · 虎口抢宝',
        roll: {
          p: 0.56,
          attrs: { 根骨: 0.015, 气运: 0.014 },
          success: {
            text: '狂风几乎撕裂法袍，你剑尖一挑精准勾住银匣冲天而起！开匣竟得星辰砂与《伏羲八卦阵简》！',
            effects: { items: ['xingchen_sha', 'yujian_bagua'], exp: 480 },
          },
          fail: {
            text: '暗流拉扯力远超预估，你险些被卷入归墟底渊，拼着吐血爆发真元才挣脱升空。',
            effects: { hp: -160, exp: 260 },
          },
        },
      },
      {
        label: '凌空盘坐于漩涡百丈高空，观水势螺旋悟空间与阵道',
        hint: '耗一月 · 观天象大进法则',
        cost: { month: 1 },
        outcome: {
          text: '归墟海眼本就是天地自成的绝世空间大阵！你凌风观潮一月，空间与阵道领悟俱突飞猛进！',
          effects: { lawExp: 26, lawId: 'space', expPct: 0.22, attrs: { 悟性: 2 } },
        },
      },
    ],
  },
  {
    id: 'wrl_gx_s03',
    title: '归墟 · 雷岛古殿',
    region: 'guixu',
    pool: 'wild',
    tier: 4,
    weight: 3,
    minRealm: 2,
    maxRealm: 5,
    text: '东海外海有座终年雷云笼罩的黑礁孤岛，岛心废墟残存着一座上古雷宗大殿的半面照壁，紫白电弧在断壁雷篆间终日游走。岛畔礁石上，几名血魔宗探子正试图以邪法偷抽岛上雷气。',
    choices: [
      {
        label: '借岛上雷威斩杀血魔探子，静坐照壁前参悟正统雷典',
        hint: '破魔悟雷 · 战血魔宗弟子并习《九天应元雷经》',
        combat: {
          enemy: 'blood_cult',
          win: {
            text: '血魔伏诛，雷云仿佛认可你的正气而骤然和缓！照壁古篆大放光明，一部地阶正统雷典《九天应元雷经》清晰烙印在你神魂深处！',
            effects: {
              karma: 20,
              lawExp: 24,
              lawId: 'thunder',
              items: ['leimu'],
              techniques: [{
                id: 'wt_jiutian_lei', name: '《九天应元雷经》', grade: '地',
                speed: 0.22, atk: 0.3, def: 0.16, lifespan: 30, lawId: 'thunder', artName: '九天应元灭魔雷',
              }],
            },
          },
          lose: {
            text: '天雷与血煞交织险恶非常，你负伤冲出雷云圈，只得远远望岛兴叹。',
            effects: { hp: -175, injury: 1 },
          },
        },
      },
      {
        label: '只在外围海礁收集被天雷劈裂产出的雷击木便撤',
        hint: '避战稳收 · 得雷击木与雷符',
        outcome: {
          text: '雷岛核心险象环生，你只在外围海礁收起两截上好雷击木与一张雷纹残符便从容离去。',
          effects: { items: ['leimu', 'zhangxin_leifu'], exp: 340 },
        },
      },
    ],
  },
  {
    id: 'wrl_gx_s04',
    title: '归墟 · 海市蜃楼',
    region: 'guixu',
    pool: 'world',
    tier: 3,
    weight: 4,
    minRealm: 2,
    maxRealm: 5,
    text: '烈日当空，平静海面水汽蒸腾，骤然映出一座金碧辉煌的悬浮仙阁虚影——亭台楼阁间有白衣仙人羽化登仙，更有茶楼酒肆人声鼎沸。不少驾舟路过的低阶海修已然痴迷，竟要弃舟投海走入幻景！',
    choices: [
      {
        label: '以清越剑鸣震醒痴迷海修，同时细观蜃楼折射的古仙遗影',
        hint: '道心检定 · 救人兼悟因果幻象',
        roll: {
          p: 0.62,
          attrs: { 道心: 0.016, 神识: 0.012 },
          success: {
            text: '剑啸穿云，众海修如梦初醒吓出一身冷汗，纷纷朝你叩谢献礼！你则在幻景消散最后一刹，窥见了一丝古仙御空真韵。',
            effects: { stones: 460, karma: 22, reputation: 18, lawExp: 16, lawId: 'karma', exp: 420 },
          },
          fail: {
            text: '蜃楼幻力竟比寻常更诡，连你也恍惚了一瞬，险些耗损灵力。幸好咬破舌尖稳住神魂，救回了几名海修。',
            effects: { mp: -80, karma: 14, exp: 320 },
          },
        },
      },
      {
        label: '追寻蜃楼灵气折射源头，于海面下寻找成精的千年老蜃蚌',
        hint: '神识检定 · 猎奇寻珠',
        roll: {
          p: 0.56,
          attrs: { 神识: 0.015, 气运: 0.014 },
          success: {
            text: '顺着幻雾反溯三里，老蜃蚌受惊缩壳潜逃，竟在礁盘上遗落了一颗温润如月的千年幻灵珠与归墟灵珊瑚！',
            effects: { items: ['guixu_shanhu', 'yangshen_dan'], stones: 380 },
          },
          fail: {
            text: '幻雾散尽海面空空如也，白耗半日光阴，唯有海风拂面心旷神怡。',
            effects: { exp: 280, demon: -8 },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_gx_s05',
    title: '归墟 · 珊瑚迷宫',
    region: 'guixu',
    pool: 'wild',
    tier: 3,
    weight: 4,
    minRealm: 2,
    maxRealm: 5,
    text: '东海浅渊之下蔓延着方圆数十里的血红珊瑚丛林，高耸如城墙，枝杈交错成天然迷阵。一头巡海的深海夜叉正驱赶着几名被困迷宫的人族采珠散修，笑声桀桀刺耳。',
    choices: [
      {
        label: '跃入血红珊瑚林斩杀深海夜叉，引采珠散修脱困',
        hint: '深海除妖 · 战深海夜叉',
        combat: {
          enemy: 'sea_yaksha',
          win: {
            text: '三叉戟断作两截，夜叉沉尸海底！脱困的采珠散修感激涕零，将藏在袖中的极品归墟灵珊瑚与四百灵石悉数献上。',
            effects: { items: ['guixu_shanhu', 'bixue_dan'], stones: 420, karma: 22, reputation: 18 },
          },
          lose: {
            text: '珊瑚迷宫地形曲折不利剑招，你负伤冲破水围逃出海面。',
            effects: { hp: -155, injury: 1 },
          },
        },
      },
      {
        label: '于海面以阵道神识传音指点迷宫生门，助散修自行甩脱夜叉',
        hint: '悟性 ≥ 16 · 不战而救人',
        require: 'char.attrs.悟性 >= 16',
        requireHint: '悟性不足十六，难以俯瞰识破珊瑚迷宫阵路',
        outcome: {
          text: '数道传音精准指明出口，散修们顺利借暗礁甩开夜叉浮出海面，纷纷朝你抱拳拜谢并奉上厚礼！',
          effects: { stones: 350, items: ['guixu_shanhu'], karma: 18, lawExp: 14, lawId: 'array' },
        },
      },
    ],
  },
  {
    id: 'wrl_gx_s06',
    title: '归墟 · 寒渊冰脉',
    region: 'guixu',
    pool: 'wild',
    tier: 4,
    weight: 3,
    minRealm: 2,
    maxRealm: 5,
    text: '穿过滚烫的海底火山裂谷，前方百丈水温竟骤降如极北万年冰原！海底幽蓝裂隙中不断喷涌着刺骨寒流，缝壁凝结着晶莹剔透的「玄冰髓」，寒气甚至将半里外的海水冻成倒悬冰柱。',
    choices: [
      {
        label: '鼓荡丹田真元顶寒入渊，采掘两块万年玄冰髓',
        hint: '根骨检定 · 极寒取珍',
        roll: {
          p: 0.58,
          attrs: { 根骨: 0.015, 道心: 0.012 },
          success: {
            text: '寒气虽令经脉结霜，你却咬牙硬扛采得两块极品玄冰髓！事后运功化寒，肉身抗寒与灵力精纯度俱增！',
            effects: { items: ['bihai_xuanbing', 'bihai_xuanbing'], exp: 480, attrs: { 根骨: 2 } },
          },
          fail: {
            text: '玄冰寒脉骤然喷发，将你冻伤击退十丈，仅仓促摘得一枚冰心雪莲丹。',
            effects: { hp: -150, items: ['bingxin_dan'], exp: 320 },
          },
        },
      },
      {
        label: '坐于冷热海流交汇处，体悟水火相济与岁月冰封之理',
        hint: '耗一月 · 习得玄阶寒冰经或大进光阴感悟',
        cost: { month: 1 },
        outcome: {
          text: '左肩炽热如炉、右肩寒彻入骨。一月静坐冰火之间，你心如古井无波，竟悟透一卷寒冰静心大道！',
          effects: {
            expPct: 0.22,
            demon: -20,
            lawExp: 20,
            lawId: 'time',
            items: ['yujian_xuanbing'],
          },
        },
      },
    ],
  },
  {
    id: 'wrl_gx_s07',
    title: '归墟 · 岛宗问剑',
    region: 'guixu',
    pool: 'world',
    tier: 4,
    weight: 4,
    minRealm: 2,
    maxRealm: 5,
    text: '归墟边缘坐落着一座青松掩映的「听涛剑岛」，岛上剑修世家世代以海涛试剑。你御剑经过时，白须飘飘的岛主长老负手立于悬崖石碑旁，含笑传音：「远来皆是客，小友剑气颇有锋芒，可愿与老夫拆上十招助兴？」',
    choices: [
      {
        label: '欣然落岛抱拳，与听涛岛金丹长老切磋剑术',
        hint: '高阶论剑 · 战结丹长老',
        combat: {
          enemy: 'jindan_elder',
          win: {
            text: '十余合剑影翻飞，惊涛拍岸！你一剑震落长老袖边松针，白须长老抚掌大笑：「后生可畏！」当场赠你一枚结金丹与剑道感悟！',
            effects: { items: ['jiejin_dan', 'jianqi_fu'], lawExp: 28, lawId: 'sword', reputation: 30, exp: 680 },
          },
          lose: {
            text: '长老剑势如海啸连绵不绝，你落败半招却也受益匪浅。长老温言指点三处破绽，并赠大还丹疗伤。',
            effects: { items: ['dahuan_dan'], lawExp: 18, lawId: 'sword', exp: 420 },
          },
        },
      },
      {
        label: '婉拒动武，请长老饮一壶陆上佳酿，坐而论剑',
        hint: '耗 80 灵石置酒 · 文雅论道',
        cost: { stones: 80 },
        outcome: {
          text: '松下听涛，杯酒论剑。长老将东海剑派借潮蓄势的独门心得娓娓道来，令你剑意圆融不少。',
          effects: { lawExp: 20, lawId: 'sword', exp: 460, attrs: { 悟性: 2 } },
        },
      },
    ],
  },
  {
    id: 'wrl_gx_s08',
    title: '归墟 · 白骨灯塔',
    region: 'guixu',
    pool: 'wild',
    tier: 3,
    weight: 3,
    minRealm: 2,
    maxRealm: 5,
    text: '黑浪拍打着一座孤零零的海礁石塔，塔身竟是由巨鲸肋骨与青铜混筑而成，塔顶长明着一簇惨白鬼火，在茫茫黑夜里指引着不知通向何方的航道。塔门微掩，里头隐约传出铁链拖曳之声。',
    choices: [
      {
        label: '提剑入塔查看，净化塔内作祟的古海尸将',
        hint: '除祟镇海 · 战阴煞尸将',
        combat: {
          enemy: 'corpse_general',
          win: {
            text: '斩杀守塔尸将后，惨白鬼火骤然转作温暖金芒，重新成为护航明灯！你在塔顶灯座暗格寻得聚灵阵符与六百灵石！',
            effects: { items: ['juling_zhenfu', 'poxie_fu'], stones: 620, karma: 26, reputation: 22 },
          },
          lose: {
            text: '狭窄塔梯毒气弥漫，你中掌破窗跃出海面，狼狈遁走。',
            effects: { hp: -175, injury: 1 },
          },
        },
      },
      {
        label: '绕塔飞掠一圈，借鬼火余温测算周边暗礁海图后离开',
        hint: '谨慎为上 · 增神识与阅历',
        outcome: {
          text: '你默记下这片诡异暗礁区水文走势，日后往来归墟再不易迷航。',
          effects: { exp: 380, attrs: { 神识: 2 }, lawExp: 10, lawId: 'space' },
        },
      },
    ],
  },
  {
    id: 'wrl_gx_s09',
    title: '归墟 · 沉海钟楼',
    region: 'guixu',
    pool: 'wild',
    tier: 3,
    weight: 3,
    minRealm: 2,
    maxRealm: 5,
    text: '碧波之下二十丈，一座昔年沉没的东海仙宗钟楼斜插在海沙之中，巨型青铜道钟依旧悬于楼顶。每逢暗流涌过，铜钟便在深海发出沉闷浩荡的嗡鸣，震荡得方圆数里鱼虾静止、灵气凝滞。',
    choices: [
      {
        label: '潜入钟楼内盘坐听钟，借深海音波涤荡元神心魔',
        hint: '道心检定 · 音波洗魂',
        roll: {
          p: 0.62,
          attrs: { 道心: 0.015, 根骨: 0.012 },
          success: {
            text: '沉浑钟波如巨锤敲打神魂杂质，令你耳清目明、心魔尽退，连带修为亦精纯一截！',
            effects: { demon: -26, expPct: 0.2, attrs: { 道心: 2 } },
          },
          fail: {
            text: '深海水压叠加钟鸣震得你气血翻腾，只得匆匆浮出海面调息。',
            effects: { hp: -120, demon: -10, exp: 260 },
          },
        },
      },
      {
        label: '探查钟楼藏宝暗室，寻觅沉海前的宗门遗藏',
        hint: '避水寻宝 · 战古修机关傀儡',
        combat: {
          enemy: 'ancient_puppet',
          win: {
            text: '破开残损守库傀儡，你在防水玉匣中收得冰心雪莲丹、星辰砂与五百灵石！',
            effects: { items: ['bingxin_dan', 'xingchen_sha'], stones: 520, exp: 520 },
          },
          lose: {
            text: '海底水阻极重，被傀儡重拳逼退，无奈浮出水面。',
            effects: { hp: -165, injury: 1 },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_gx_s10',
    title: '归墟 · 寒江钓叟',
    region: 'guixu',
    pool: 'world',
    tier: 4,
    weight: 3,
    minRealm: 2,
    maxRealm: 5,
    text: '大雪纷飞的海峡冰礁上，一名披着破烂蓑衣的白须老叟独坐孤舟，手执无钩青竹竿垂钓黑水。奇异的是，风雪落到他斗笠三尺外便凝固停滞，仿佛光阴在他周身放慢了十倍。',
    choices: [
      {
        label: '恭立礁畔默观老叟垂钓半日，不发一言打扰',
        hint: '悟性与道心检定 · 获《寒江独钓经》真传',
        roll: {
          p: 0.6,
          attrs: { 悟性: 0.015, 道心: 0.015 },
          success: {
            text: '日落时分，老叟收竿微笑：「耐得住性子，便看得见光阴缝隙。」他随手抛来一卷冰蚕丝经书，扁舟轻点冰面，瞬息消隐于雪海尽头。',
            effects: {
              lawExp: 20,
              lawId: 'time',
              exp: 460,
              techniques: [{
                id: 'wt_hanjiang_jue', name: '《寒江独钓经》', grade: '玄',
                speed: 0.14, atk: 0.13, def: 0.15, lifespan: 38, lawId: 'time', artName: '孤舟凝岁钓',
              }],
            },
          },
          fail: {
            text: '寒风刺骨，你站到傍晚终究气血微颤露了破绽。老叟摇头轻笑，丢下一枚冰心雪莲丹便撑舟远去。',
            effects: { items: ['bingxin_dan'], exp: 340 },
          },
        },
      },
      {
        label: '温一壶烈酒隔冰敬献，请教东海岁月流变之理',
        hint: '耗 50 灵石 · 尊师重道得延寿点拨',
        cost: { stones: 50 },
        outcome: {
          text: '老叟仰首痛饮一口热酒，哈哈大笑，指点你两句缓衰老、固元神的吐纳法门，令你寿元大增！',
          effects: { lifespan: 12, lawExp: 16, lawId: 'time', attrs: { 道心: 2 }, exp: 420 },
        },
      },
    ],
  },
  {
    id: 'wrl_gx_s11',
    title: '归墟 · 盐晶峭壁',
    region: 'guixu',
    pool: 'wild',
    tier: 3,
    weight: 3,
    minRealm: 2,
    maxRealm: 5,
    text: '东海烈日炙烤着一座百丈雪白海崖，崖壁经万年海浪拍打蒸发，结出厚逾丈许的晶莹海盐灵晶，阳光折射下宛若琉璃仙山。峭壁半腰凹洞里，闪耀着一簇湛蓝如宝石的先天海盐精魄。',
    choices: [
      {
        label: '踏浪凌壁采掘湛蓝海盐精魄，兼提防空中雷禽突袭',
        hint: '悬崖争锋 · 战裂云雷鹏',
        combat: {
          enemy: 'thunder_roc',
          win: {
            text: '击退俯冲抢食的裂云雷鹏后，你稳稳采下湛蓝灵晶与两株岩缝珊瑚，此物炼丹淬体皆是上品！',
            effects: { items: ['guixu_shanhu', 'bihai_xuanbing'], stones: 480, exp: 540 },
          },
          lose: {
            text: '峭壁受风难借力，被雷鹏电翅扫落海面，狼狈潜泳脱险。',
            effects: { hp: -165, injury: 1 },
          },
        },
      },
      {
        label: '只在崖底潮水线收集晶莹灵盐砂，换取丰厚灵石',
        hint: '稳健采矿 · 安全盈利',
        outcome: {
          text: '归墟灵盐乃海上丹师调和丹火的紧俏辅材，你采满两袋，足以在海市换得不菲灵石。',
          effects: { stones: 410, exp: 320, lawExp: 8, lawId: 'pill' },
        },
      },
    ],
  },
  {
    id: 'wrl_gx_s12',
    title: '归墟 · 机关船坞',
    region: 'guixu',
    pool: 'wild',
    tier: 4,
    weight: 3,
    minRealm: 2,
    maxRealm: 5,
    text: '海雾散开，一座建于巨礁腹部的上古海上船坞呈现在眼前。干涸的石槽里停放着三艘未完工的玄铁破浪灵舟，船坞铭牌刻着「玄机」二字，四周却徘徊着数尊眼泛赤光的古修机关傀儡。',
    choices: [
      {
        label: '强破机关傀儡防线，搜寻船坞主控室里的古阵图谱',
        hint: '勇闯船坞 · 战古修机关傀儡',
        combat: {
          enemy: 'ancient_puppet',
          win: {
            text: '轰开主控室青铜门，石桌上赫然摊开一卷《千机八阵图录》与一张缩地成寸符与一包磁砂！',
            effects: {
              items: ['suodi_fu', 'xingchen_sha'],
              lawExp: 24,
              lawId: 'array',
              techniques: [{
                id: 'wt_qianji_zhen', name: '《千机八阵图录》', grade: '地',
                speed: 0.21, atk: 0.24, def: 0.27, lifespan: 45, lawId: 'array', artName: '千机连环杀阵',
              }],
            },
          },
          lose: {
            text: '船坞自卫阵法启动，傀儡联手围攻，你拼力撞破木栅逃出海面。',
            effects: { hp: -180, injury: 1 },
          },
        },
      },
      {
        label: '在外围船槽拆解几块未锈蚀的灵舟星铁与阵核便走',
        hint: '神识检定 · 见好就收',
        roll: {
          p: 0.62,
          attrs: { 神识: 0.015, 悟性: 0.012 },
          success: {
            text: '你绕开警戒范围拆下两枚完好阵核与一小盒磁砂，毫发无损扬长而去。',
            effects: { items: ['xingchen_sha', 'juling_zhenfu'], stones: 320, exp: 380 },
          },
          fail: {
            text: '触动警戒铜丝引来一阵箭雨，你急忙撑罩撤退，仅顺走几块玄铁。',
            effects: { hp: -115, items: ['xuantie'] },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_gx_s13',
    title: '归墟 · 血海祭礁',
    region: 'guixu',
    pool: 'wild',
    tier: 4,
    weight: 3,
    minRealm: 2,
    maxRealm: 5,
    text: '偏僻黑礁上竖着七根白骨血幡，一名血魔宗金丹弟子正将十余名俘获的东海采珠凡人与低阶散修绑在礁石柱上，趁血月涨潮准备举行「血潮招煞祭」，海水已被染得猩红发臭。',
    choices: [
      {
        label: '雷霆出手斩杀血魔宗弟子，劈断白骨血幡救下众生',
        hint: '替天行道 · 战血魔宗弟子',
        combat: {
          enemy: 'blood_cult',
          win: {
            text: '血幡尽断，妖潮顿息！获救的十余名散修与采珠人跪满黑礁感激泣涕，众人凑齐珍藏的灵珊瑚、丹药与重金拜谢，东海仙盟亦为你记下大功！',
            effects: { items: ['guixu_shanhu', 'dahuan_dan'], stones: 640, karma: 34, reputation: 30 },
          },
          lose: {
            text: '血魔借助潮汐煞阵威势滔天，你拼着重伤救走数名俘虏便被迫遁逃。',
            effects: { hp: -185, injury: 1, karma: 18 },
          },
        },
      },
      {
        label: '祭出紫霄雷法或镇魔破邪符先毁血阵，趁乱解救人质撤离',
        hint: '消耗镇魔破邪符 · 奇袭救人免血战',
        cost: { item: 'poxie_fu' },
        outcome: {
          text: '佛光金篆轰碎主血幡，魔修遭反噬吐血狂退！你迅速割断绳索护送众人乘舟撤离黑礁，功德无量！',
          effects: { stones: 420, karma: 30, reputation: 24, exp: 480 },
        },
      },
    ],
  },
  {
    id: 'wrl_gx_s14',
    title: '归墟 · 漂流玉瓶',
    region: 'guixu',
    pool: 'wild',
    tier: 3,
    weight: 4,
    minRealm: 2,
    maxRealm: 5,
    text: '浪花推着一只刻满古老空间封禁纹路的翡翠漂流瓶，悠悠荡荡撞在你脚下浮木旁。瓶塞以星辰蜡封死，摇晃之下里头似乎卷着一封薄如蝉翼的金箔书信与一颗光晕流转的灵丹。',
    choices: [
      {
        label: '以神识温柔解开空间封禁，细阅远古海修遗书',
        hint: '悟性与神识检定 · 谨防残存禁制反噬',
        roll: {
          p: 0.62,
          attrs: { 神识: 0.015, 悟性: 0.014 },
          success: {
            text: '封禁无声消融！金箔乃千年前一位横渡无尽海失踪的空间大修绝笔，不仅留下一枚完好大还丹，更附有其毕生空间折叠心法《空明缩界经》！',
            effects: {
              items: ['dahuan_dan'],
              lawExp: 22,
              lawId: 'space',
              techniques: [{
                id: 'wt_kongming_dun', name: '《空明缩界经》', grade: '地',
                speed: 0.24, atk: 0.25, def: 0.21, lifespan: 40, lawId: 'space', artName: '方寸断空指',
              }],
            },
          },
          fail: {
            text: '强破封禁触动了空间裂纹，震伤指尖！金箔化作飞灰，唯有那颗珍稀的养神玉清丹安然滚落掌心。',
            effects: { hp: -95, items: ['yangshen_dan'], lawExp: 10, lawId: 'space' },
          },
        },
      },
      {
        label: '暂不强拆，带往东海海市卖给专研古禁的奇珍商行',
        hint: '落袋为安 · 换取海量灵石',
        outcome: {
          text: '海市古玩大行见了星辰蜡封双目放光，爽快拍出七百五十灵石买断这只神秘漂流瓶。',
          effects: { stones: 750, exp: 320 },
        },
      },
    ],
  },
  {
    id: 'wrl_gx_s15',
    title: '归墟 · 鲛歌诡礁',
    region: 'guixu',
    pool: 'wild',
    tier: 3,
    weight: 3,
    minRealm: 2,
    maxRealm: 5,
    text: '月华如霜洒满银色礁盘，海雾中飘来宛转凄美、令人神魂酥软的远古鲛人歌声。几艘过路灵舟已迷失方向朝暗礁撞去，歌声深处隐约可见一尾银鳞鲛女倚石而歌，眼角滚落颗颗发光鲛珠。',
    choices: [
      {
        label: '紧守道心以清音剑啸应和鲛歌，化解迷魂魅意并警示过船',
        hint: '道心检定 · 护航结鲛人善缘',
        roll: {
          p: 0.6,
          attrs: { 道心: 0.016, 魅力: 0.012 },
          success: {
            text: '剑啸与鲛歌竟融作一曲荡气回肠的沧海清音！过路灵舟顿时清醒避开暗礁，银鳞鲛女亦止歌微笑，抛来一枚冰心雪莲丹、一块玄冰髓与一捧鲛珠，随即潜入深海。',
            effects: { items: ['bingxin_dan', 'bihai_xuanbing'], stones: 380, karma: 20, exp: 460 },
          },
          fail: {
            text: '鲛歌缠绵直击心扉，令你瞬间忆起尘世旧憾、心魔微涨，忙以冰水激面清醒过来，好在过舟已然惊觉转向。',
            effects: { demon: 8, exp: 310, karma: 10 },
          },
        },
      },
      {
        label: '封住六识悄然绕行，于下风礁滩拾取海浪冲来的散落鲛珠',
        hint: '克制稳妥 · 避开摄魂歌声',
        outcome: {
          text: '你封闭听觉御风绕过诡礁，在沙滩上捡到几粒晶莹鲛泪珠与灵珊瑚碎片，平平安安。',
          effects: { stones: 420, items: ['guixu_shanhu'], exp: 340 },
        },
      },
    ],
  },
  {
    id: 'wrl_gx_s16',
    title: '归墟 · 巨神断锚',
    region: 'guixu',
    pool: 'wild',
    tier: 3,
    weight: 3,
    minRealm: 2,
    maxRealm: 5,
    text: '退潮后的荒滩上斜插着一柄高达三十丈的玄铁巨锚，锚链断裂处犹自闪耀着锋利剑气，显是上古仙舟大战时被人一剑斩落海底。铁锚表面寄生着成片灵气盎然的深海灵贝，锚环内却盘着一尊警惕的珊瑚妖将。',
    choices: [
      {
        label: '跃上巨锚斩退珊瑚妖将，参悟断链处万年不散的上古剑意',
        hint: '夺宝悟剑 · 战珊瑚妖将',
        combat: {
          enemy: 'coral_demon', displayName: '珊瑚妖将',
          win: {
            text: '珊瑚妖将负伤遁海！你独坐巨锚顶端，细细体悟断链处那一剑截断星舟的霸绝锋芒，剑道感悟飙升，顺手刮下一包附在锚上的磁砂！',
            effects: { lawExp: 26, lawId: 'sword', items: ['xingchen_sha'], stones: 500, exp: 560 },
          },
          lose: {
            text: '海浪陡涨合围而来，你被妖将寒潮震下巨锚，负伤退回高礁。',
            effects: { hp: -165, injury: 1 },
          },
        },
      },
      {
        label: '于潮线外隔空临摹断链剑痕，不与海族起冲突',
        hint: '观剑悟道 · 毫无风险',
        outcome: {
          text: '那一剑虽过万载，凛冽神韵犹在！你于礁石静观三日，剑意大有长进。',
          effects: { lawExp: 18, lawId: 'sword', exp: 420, attrs: { 悟性: 1 } },
        },
      },
    ],
  },
  {
    id: 'wrl_gx_s17',
    title: '归墟 · 浮木剑决',
    region: 'guixu',
    pool: 'world',
    tier: 4,
    weight: 3,
    minRealm: 2,
    maxRealm: 5,
    text: '惊涛骇浪间漂浮着一根数十丈长的太古沉香浮木。一名黑衣斗笠剑客单足立于木端，随浪起伏却纹丝不动。见你飞剑掠空，他抬手弹剑发出一声清越龙吟：「沧海茫茫难遇敌手，道友敢不敢同踏此木，只以三招剑意决高下？」',
    choices: [
      {
        label: '落足浮木另一端，与孤鸿剑修海浪之上痛快一战',
        hint: '海天决剑 · 战孤鸿剑修',
        combat: {
          enemy: 'sword_rogue',
          win: {
            text: '浪花冲天百丈，三剑定乾坤！斗笠剑客抚掌长啸，解下腰间珍藏的紫霄雷铃与一瓶聚灵丹相赠：「痛快！他日中州圣域再会！」',
            effects: { items: ['zixiao_ling', 'juling_dan'], lawExp: 26, lawId: 'sword', reputation: 28, exp: 650 },
          },
          lose: {
            text: '浪头陡起失了重心，被对方一剑逼落海面。剑客亦抛来一枚大还丹笑道：「剑骨极佳，只是少了几分踏浪的从容。」',
            effects: { items: ['dahuan_dan'], lawExp: 16, lawId: 'sword', exp: 400 },
          },
        },
      },
      {
        label: '以一瓶灵酒抛去致意，立于半空观其独演海潮剑法',
        hint: '耗 60 灵石 · 观剑结交',
        cost: { stones: 60 },
        outcome: {
          text: '剑客接酒仰饮，兴致大发演练了一套劈浪断涛的绝妙剑路，看得你眉飞色舞、大呼过瘾！',
          effects: { lawExp: 20, lawId: 'sword', exp: 460, attrs: { 悟性: 2 } },
        },
      },
    ],
  },
  {
    id: 'wrl_gx_s18',
    title: '归墟 · 海底丹窟',
    region: 'guixu',
    pool: 'wild',
    tier: 4,
    weight: 3,
    minRealm: 2,
    maxRealm: 5,
    text: '海底火山地热裂口旁，竟凿有一座借助地火炼丹的上古洞府。禁制因岁月流逝已破开一道豁口，滚烫硫磺气息中透出沁人心脾的浓郁丹香，石架上残留着数枚火候极佳、结丹修士用的宝丹！',
    choices: [
      {
        label: '催动寒冰真元硬顶地火热浪，深入丹室尽取宝丹',
        hint: '根骨与气运检定 · 火中取丹',
        roll: {
          p: 0.58,
          attrs: { 根骨: 0.015, 气运: 0.014 },
          success: {
            text: '你身披水幕冲入赤红丹室，迅疾收走一包凝丹散、一枚破障丹与一袋灵石！退出来时地火轰然喷发，好险！',
            effects: { items: ['jiejin_dan', 'pozhang_dan'], stones: 360, lawExp: 16, lawId: 'pill' },
          },
          fail: {
            text: '地火骤喷烤焦了护体灵光，你咬牙抓起一瓶大还丹狼狈冲出洞窟，灼伤不轻。',
            effects: { hp: -155, items: ['dahuan_dan'], lawExp: 8, lawId: 'pill' },
          },
        },
      },
      {
        label: '以寒潭玄冰髓暂时镇压火山地火口，从容搜刮整座丹窟',
        hint: '消耗碧海玄冰髓 · 稳夺全窟重宝',
        cost: { item: 'bihai_xuanbing' },
        outcome: {
          text: '玄冰髓投入地火口，白雾翻腾竟令熔岩凝固半柱香！你慢条斯理扫空全部丹架，凝丹散、大还丹、养神玉清丹尽入囊中！',
          effects: { items: ['jiejin_dan', 'dahuan_dan', 'yangshen_dan'], stones: 520, lawExp: 22, lawId: 'pill' },
        },
      },
    ],
  },
  {
    id: 'wrl_gx_s19',
    title: '归墟 · 巨蚌赌珠',
    region: 'guixu',
    pool: 'world',
    tier: 3,
    weight: 4,
    minRealm: 2,
    maxRealm: 5,
    text: '东海珍珠岛集市人声鼎沸，海商们刚从归墟深渊打捞上来三头磨盘大小的千年玄贝巨蚌，壳缝紧闭、灵光隐现。岛主高声叫卖：「三百五十灵石开一蚌！开出避水灵珠一步登天，开出烂泥自认倒霉！」',
    choices: [
      {
        label: '运起神识细听三蚌内部灵波，花三百五十灵石拍下左侧黑壳老蚌',
        hint: '耗 350 灵石 · 神识与气运赌珠',
        cost: { stones: 350 },
        roll: {
          p: 0.6,
          attrs: { 神识: 0.016, 气运: 0.016 },
          success: {
            text: '贝壳撬开瞬间宝光冲天三丈！里头竟孕育着一颗堪比法宝的极品灵珠与两块归墟灵珊瑚，满场海商轰动抢购！',
            effects: { items: ['guixu_shanhu', 'yangshen_dan'], stones: 920, reputation: 14 },
          },
          fail: {
            text: '撬开壳缝只滚出几颗寻常珍珠与一团海泥，勉强卖回一百余灵石，众人哄笑散去。',
            effects: { stones: 120, attrs: { 道心: 1 } },
          },
        },
      },
      {
        label: '不参与高价赌蚌，只用五十灵石买几串海岛鲜灵贝打牙祭',
        hint: '耗 50 灵石 · 滋补气血静观世态',
        cost: { stones: 50 },
        outcome: {
          text: '炭烤灵贝鲜美无比，精纯水灵之气滋养得经脉通泰，看着旁人赌红眼倒更觉修行需守本心。',
          effects: { hpPct: 0.5, mpPct: 0.5, exp: 360, demon: -10 },
        },
      },
    ],
  },
  {
    id: 'wrl_gx_s20',
    title: '归墟 · 风眼静域',
    region: 'guixu',
    pool: 'wild',
    tier: 4,
    weight: 3,
    minRealm: 2,
    maxRealm: 5,
    text: '覆盖千里的海上飓风卷起百丈狂涛，雷电交加宛若末日。你驾驭法宝勉力冲入风暴最中心，竟蓦然置身一片晴空万里、海面如镜的奇异「风眼静域」——天地狂暴灵气在四周高墙般旋转，却唯独在中心汇成温顺灵柱！',
    choices: [
      {
        label: '盘坐风眼海面迎风吐纳，借飓风狂澜冲刷修为瓶颈',
        hint: '耗一月 · 极速增进修为与突破感悟',
        cost: { month: 1 },
        outcome: {
          text: '外头狂风怒号、内里风平浪静。动极生静之理在你心中豁然贯通，修为暴涨且下次破境成算大增！',
          effects: { expPct: 0.28, breakBonus: 14, attrs: { 道心: 2, 悟性: 1 } },
        },
      },
      {
        label: '于风眼海面仔细搜寻被风暴自海底卷起的珍奇异宝',
        hint: '气运检定 · 风暴拾遗',
        roll: {
          p: 0.6,
          attrs: { 气运: 0.016, 神识: 0.012 },
          success: {
            text: '平镜般的海面上果然漂浮着一截雷击木与一只密封古铜盒，内藏聚灵阵符与大还丹！',
            effects: { items: ['leimu', 'juling_zhenfu', 'dahuan_dan'], exp: 420 },
          },
          fail: {
            text: '风眼移动极快，你刚捞起两块灵石便被旋转风墙擦中衣袖，忙加速冲出云霄。',
            effects: { hp: -110, stones: 240 },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_gx_s21',
    title: '归墟 · 沉皇龙舟',
    region: 'guixu',
    pool: 'wild',
    tier: 4,
    weight: 3,
    minRealm: 2,
    maxRealm: 5,
    text: '东海断崖水下静卧着一艘百丈长的金漆古帝王楼船——传说千年前某凡朝大帝遣方士出海寻仙，全船宝物尽沉归墟。残破龙首舱门大开，隐约可见满地明珠玉器，却有一股森冷金丹级怨煞盘桓其间。',
    choices: [
      {
        label: '入龙舟镇压不甘散去的护舟阴煞尸将，收取古帝寻仙珍宝',
        hint: '深海探宝 · 战阴煞尸将',
        combat: {
          enemy: 'corpse_general',
          win: {
            text: '尸将化灰，千载寻仙执念终得安息！你在御书房暗匣里起出方士炼制的松鹤延寿丹配方灵药与八百灵石！',
            effects: { items: ['yanshou_dan', 'bingxin_dan'], stones: 820, karma: 16, exp: 640 },
          },
          lose: {
            text: '沉船木梁轰然塌落配合尸毒攻心，你狼狈破舱浮出海面。',
            effects: { hp: -185, injury: 1 },
          },
        },
      },
      {
        label: '只在前舱打捞些许无主灵珠玉器，不扰后舱帝王沉眠',
        hint: '克制守度 · 稳获厚利',
        outcome: {
          text: '你取走前舱几匣未经煞气侵染的古玉与灵石，默念一声往生咒便悄然离去。',
          effects: { stones: 520, karma: 10, exp: 360 },
        },
      },
    ],
  },
  {
    id: 'wrl_gx_s22',
    title: '归墟 · 藻海迷林',
    region: 'guixu',
    pool: 'wild',
    tier: 3,
    weight: 3,
    minRealm: 2,
    maxRealm: 5,
    text: '百里海域生长着如巨树般参天的翡翠海藻，遮天蔽日阻断日光，成群发光水母在藻叶间游弋。藻林深处飘来阵阵异香，似有一株吸收海水月华成精的「碧海青莲」即将绽放，然四周已围拢数头伺机而动的深海夜叉。',
    choices: [
      {
        label: '先下手为强斩杀深海夜叉，独摘盛放的碧海青莲',
        hint: '夺莲激战 · 战深海夜叉',
        combat: {
          enemy: 'sea_yaksha',
          win: {
            text: '夜叉鲜血染绿藻海，你摘得九瓣碧海青莲，花瓣入口化作滔天水灵清气，修为与法力大进！',
            effects: { expPct: 0.24, items: ['bihai_xuanbing'], mpPct: 0.6, stones: 460 },
          },
          lose: {
            text: '巨藻缠身配合夜叉暗袭，你斩断海藻负伤逃出藻海。',
            effects: { hp: -155, injury: 1 },
          },
        },
      },
      {
        label: '以神识暗中偷取三滴莲心清露便即隐退，不夺青莲本体',
        hint: '神识检定 · 智取灵露免死斗',
        roll: {
          p: 0.62,
          attrs: { 神识: 0.015, 气运: 0.012 },
          success: {
            text: '神识牵引灵瓶神不知鬼不觉收走三滴莲心清露！夜叉们浑然未觉，你服露吐纳，寿元与道心俱进！',
            effects: { lifespan: 6, demon: -16, exp: 460, karma: 8 },
          },
          fail: {
            text: '水流波动惊动了近处夜叉，你见机快一步施遁术脱身，只捞回两片莲叶。',
            effects: { exp: 310, hpPct: 0.2 },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_gx_s23',
    title: '归墟 · 月井环礁',
    region: 'guixu',
    pool: 'wild',
    tier: 3,
    weight: 3,
    minRealm: 2,
    maxRealm: 5,
    text: '新月如钩，东海一座环形珊瑚白沙礁正中央，天然围出一汪深不见底的湛蓝海井。每当月光垂直落入井心，整口海井便泛起银色光潮，精纯太阴月华凝而不散，宛如仙家玉池。',
    choices: [
      {
        label: '赤足踏波坐于月井灵脉之上，引太阴星辉洗练元神',
        hint: '耗一月 · 神识与星辰感悟飞跃',
        cost: { month: 1 },
        outcome: {
          text: '银色光潮包裹周身，识海清凉澄澈如洗。一月之后，神识感知范围扩大数倍，星辰法则感悟更上一层楼！',
          effects: { expPct: 0.22, lawExp: 22, lawId: 'star', attrs: { 神识: 3, 道心: 1 } },
        },
      },
      {
        label: '潜入月井底端寻觅凝结千年的太阴月华玉髓',
        hint: '气运检定 · 深井探宝',
        roll: {
          p: 0.6,
          attrs: { 气运: 0.015, 根骨: 0.012 },
          success: {
            text: '井底白沙下果真嵌着一枚晶莹月髓与一卷《周天星辰诀玉简》残本，堪称天赐良缘！',
            effects: { items: ['yujian_xingchen', 'bihai_xuanbing'], exp: 440 },
          },
          fail: {
            text: '井底暗流涌动将你推回海面，倒也顺手捞起几颗润泽灵珠。',
            effects: { stones: 360, exp: 320 },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_gx_s24',
    title: '归墟 · 灵雨飞鱼',
    region: 'guixu',
    pool: 'wild',
    tier: 3,
    weight: 4,
    minRealm: 2,
    maxRealm: 5,
    text: '霞光映海，数以万计通体银蓝的翼鳞飞鱼骤然跃出东海波涛，逆风滑翔数百丈！鱼群过处抖落漫天蕴含精纯水灵气的细密灵珠雨，整片海域顿时彩虹贯空，奇景壮丽非凡。',
    choices: [
      {
        label: '张开双臂御风随鱼群同翔，畅饮天降灵雨洗练法力',
        hint: '顺天应时 · 气血法力修为全丰收',
        outcome: {
          text: '漫天灵雨渗入肌理，连日征战的暗伤一扫而空！你凌风长啸，灵力充沛至极！',
          effects: { heal: 1, mpPct: 0.8, expPct: 0.2, demon: -14, attrs: { 气运: 1 } },
        },
      },
      {
        label: '凝神捕捉灵雨落水一瞬的空间波纹，参悟身法遁术',
        hint: '悟性检定 · 观鱼翔悟空间',
        roll: {
          p: 0.6,
          attrs: { 悟性: 0.015, 神识: 0.012 },
          success: {
            text: '万鱼破浪如箭，竟暗合缩地成寸的空间借力之法！你灵光乍现，空间法则感悟突飞猛进，更自鱼群跃浪处拾得一张古遁符！',
            effects: { lawExp: 22, lawId: 'space', items: ['suodi_fu'], exp: 460 },
          },
          fail: {
            text: '鱼群转瞬没入远浪，你只觉赏心悦目，心境豁达许多。',
            effects: { exp: 380, attrs: { 道心: 1 } },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_gx_s25',
    title: '归墟 · 古盘罗台',
    region: 'guixu',
    pool: 'wild',
    tier: 4,
    weight: 3,
    minRealm: 2,
    maxRealm: 5,
    text: '东海荒礁顶端嵌着一座丈许宽的青铜司南罗盘，盘面蚀刻着早已失传的太古海眼星图与八卦方位，指针却被厚重海盐与锈迹卡死在正北死位。',
    choices: [
      {
        label: '以真火除锈并注入星辰砂修复司南罗盘，窥探海眼隐秘',
        hint: '悟性检定 · 修古盘悟阵星大道',
        roll: {
          p: 0.58,
          attrs: { 悟性: 0.016, 神识: 0.012 },
          success: {
            text: '指针嗡然转动三周，一道光幕投射海空——竟标出三处归墟沉宝方位！你顺着最近一处礁洞起出《伏羲八卦阵简》与五百灵石！',
            effects: { items: ['yujian_bagua', 'xingchen_sha'], stones: 520, lawExp: 20, lawId: 'array' },
          },
          fail: {
            text: '真火稍猛震裂了半边指针，罗盘化作凡铜。不过你在修复过程中也摸清了古八卦定位之妙。',
            effects: { lawExp: 14, lawId: 'array', exp: 360 },
          },
        },
      },
      {
        label: '不动罗盘，仅拓印盘面太古星图与八卦铭文带回研读',
        hint: '稳健治学 · 双进阵道与星辰感悟',
        outcome: {
          text: '拓片墨香混合海风咸涩。你细细参详，对天地星阵呼应之理大有领悟。',
          effects: { lawExp: 16, lawId: 'star', exp: 420, attrs: { 悟性: 2 } },
        },
      },
    ],
  },
  {
    id: 'wrl_gx_s26',
    title: '归墟 · 采珠旧约',
    region: 'guixu',
    pool: 'world',
    tier: 3,
    weight: 3,
    minRealm: 2,
    maxRealm: 5,
    text: '海崖破茅屋前，一位双腿早年被海妖咬断的老采珠修者正在修补渔网。见你衣袂飘飘气质不凡，他长叹一声，从怀中摸出半块刻着海浪纹路的玉符：「道友若肯替老朽潜入十里外鬼哭礁，寻回亡妻当年沉海的定情寒玉镯，这半块归墟宝库残图与毕生积蓄全归你！」',
    choices: [
      {
        label: '慨然应诺，潜入鬼哭礁斩妖寻回寒玉镯交还老翁',
        hint: '重情守诺 · 战珊瑚妖将',
        combat: {
          enemy: 'coral_demon',
          win: {
            text: '斩杀盘踞鬼哭礁的海妖后，你终在淤泥中摸出那只完好无损的素白寒玉镯。老翁捧镯老泪纵横，依约奉上珍藏的聚灵阵符、碧海玄冰髓与六百灵石！',
            effects: { items: ['juling_zhenfu', 'bihai_xuanbing'], stones: 620, karma: 28, reputation: 22 },
          },
          lose: {
            text: '鬼哭礁暗流汹涌叠加海妖围攻，你负伤浮出海面，只得向老翁惭愧致歉。',
            effects: { hp: -160, karma: 10 },
          },
        },
      },
      {
        label: '赠老翁一枚疗伤丹与百块灵石颐养天年，劝其莫再执念亡物',
        hint: '耗 100 灵石 · 慈悲宽慰积善德',
        cost: { stones: 100 },
        outcome: {
          text: '老翁沉默良久，终究释然一笑，将那半块自己再也用不上的海图残玉送给了你，内蕴一缕空间奥妙。',
          effects: { lawExp: 18, lawId: 'space', karma: 24, attrs: { 道心: 2 }, exp: 420 },
        },
      },
    ],
  },
  {
    id: 'wrl_gx_s27',
    title: '归墟 · 鲨帮截商',
    region: 'guixu',
    pool: 'world',
    tier: 3,
    weight: 4,
    minRealm: 2,
    maxRealm: 5,
    text: '东海主航道浓烟滚滚！一艘挂着中州商旗的三桅灵船正遭两艘涂满鲨齿纹的黑船夹击，船上数名黑鲨海盗修士驾驭血煞法器肆意屠戮船员，商船主事高举重金玉牌向天呼救！',
    choices: [
      {
        label: '仗剑从天而降，斩杀黑鲨海盗头目解商船之围',
        hint: '扫荡海盗 · 战血魔宗弟子（海盗头领）',
        combat: {
          enemy: 'blood_cult',
          win: {
            text: '剑光斩断海盗黑帆，头目授首，余贼惊慌跳海逃窜！商船大管事感激涕零，当场奉上八百灵石、一枚结金丹与商行至高贵宾令！',
            effects: { stones: 800, items: ['jiejin_dan'], karma: 26, reputation: 28 },
          },
          lose: {
            text: '海盗船载有破甲弩炮，你击沉一艘偏舟后受创撤退，商船趁机全速冲出包围。',
            effects: { hp: -170, karma: 16, reputation: 12 },
          },
        },
      },
      {
        label: '暗中潜至海盗主船船底凿穿灵力阵枢，不露面智破海盗船',
        hint: '神识与悟性检定 · 暗助商船脱困',
        roll: {
          p: 0.6,
          attrs: { 神识: 0.015, 悟性: 0.014 },
          success: {
            text: '海盗主船轰然倾覆沉入波涛！商船趁机扬帆远去，你则顺手在水下打捞起海盗船沉没的财宝箱，神不知鬼不觉！',
            effects: { stones: 680, items: ['dahuan_dan'], karma: 18, exp: 460 },
          },
          fail: {
            text: '水下暗哨提前发现了你的身影，一场水底缠斗后你虽震伤敌手，自身也略耗元气。',
            effects: { hp: -120, stones: 320, karma: 12 },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_gx_s28',
    title: '归墟 · 断崖海隐',
    region: 'guixu',
    pool: 'world',
    tier: 4,
    weight: 3,
    minRealm: 2,
    maxRealm: 5,
    text: '万丈海蚀石柱绝顶，结着一间简陋的枯草茅亭。一名白发如雪、赤足披麻的老隐士正对着茫茫沧海磨一块巴掌大的海玉，见你飞近，头也不抬笑道：「世人皆往中州昆仑挤破头，倒少见你这般肯在海边看浪的娃儿。坐下来喝杯咸茶？」',
    choices: [
      {
        label: '敛去锋芒静坐茅亭，与海隐前辈共品咸茶谈古论今',
        hint: '虚怀若谷 · 获前辈醍醐灌顶',
        outcome: {
          text: '咸茶初苦后甘。老隐士谈及当年东海仙战与化神之道，字字珠玑，末了随手将磨好的海玉赠你作护神佩——竟蕴含浩瀚养神灵力！',
          effects: { items: ['yangshen_dan', 'bingxin_dan'], expPct: 0.22, attrs: { 悟性: 2, 道心: 2 } },
        },
      },
      {
        label: '恭敬请教前辈高阶破境心魔渡劫之秘',
        hint: '求道问劫 · 涤心魔并增破境成算',
        outcome: {
          text: '老隐士哈哈大笑：「心魔本是你自己吓自己！」指尖轻点海面激起千层雪浪，令你胸中郁结顷刻冰消瓦解！',
          effects: { demon: -30, breakBonus: 14, exp: 480, attrs: { 道心: 2 } },
        },
      },
    ],
  },
  {
    id: 'wrl_gx_s29',
    title: '归墟 · 潮汐试剑碑',
    region: 'guixu',
    pool: 'wild',
    tier: 4,
    weight: 3,
    minRealm: 2,
    maxRealm: 5,
    text: '东海怒潮拍打着一座三丈高的玄黑石碑，碑身光滑如镜，却在每逢涨潮巨浪劈落之际，隐隐浮现出九道纵横交错的银色剑气刻痕——传说乃千年前一位过海剑仙留下的「听潮试剑碑」。',
    choices: [
      {
        label: '踏浪直面百丈怒潮，以自身剑意与石碑九痕正面共鸣',
        hint: '悟性 ≥ 18 · 剑道法则大幅跃升',
        require: 'char.attrs.悟性 >= 18',
        requireHint: '悟性不足十八，难以承接剑仙九痕共鸣',
        cost: { month: 1 },
        outcome: {
          text: '狂涛扑面而剑心不动！九道银色剑痕骤然离碑飞舞，绕你周身盘旋三匝后化作璀璨剑意融于丹田！',
          effects: { lawExp: 32, lawId: 'sword', expPct: 0.24, attrs: { 悟性: 2 }, items: ['jianqi_fu'] },
        },
      },
      {
        label: '盘坐退潮礁石上细细摩挲碑文，循序渐进体会剑势',
        hint: '稳健悟剑 · 安全有效',
        outcome: {
          text: '潮起潮落间，你渐悟「剑随势生、势尽剑收」之理，收获匪浅。',
          effects: { lawExp: 18, lawId: 'sword', exp: 450, attrs: { 道心: 1 } },
        },
      },
    ],
  },
  {
    id: 'wrl_gx_s30',
    title: '归墟 · 雷鹏遗巢',
    region: 'guixu',
    pool: 'wild',
    tier: 4,
    weight: 3,
    minRealm: 2,
    maxRealm: 5,
    text: '雷云盘踞的绝崖石台之上，筑着一座由焦黑雷击木与青铜残剑搭成的巨大鸟巢。巢中空无大禽，唯有几枚泛着紫电纹路的脱落翎羽与两件被雷鹏当作筑巢材料的古修储物法宝正噼啪闪耀电花！',
    choices: [
      {
        label: '疾掠入巢尽收法宝与雷木，趁裂云雷鹏归巢前抽身遁走',
        hint: '气运与身法检定 · 虎口拔牙',
        roll: {
          p: 0.56,
          attrs: { 气运: 0.015, 根骨: 0.014 },
          success: {
            text: '你手疾眼快抓起紫霄雷铃、雷击木与近六百灵石便御剑冲入云层！数息后雷鹏归巢发出震天怒鸣，早已望尘莫及！',
            effects: { items: ['zixiao_ling', 'leimu'], stones: 580, exp: 480 },
          },
          fail: {
            text: '刚抓起宝物，天穹一声炸雷——裂云雷鹏恰好振翅归来，拦在崖口！',
            combat: {
              enemy: 'thunder_roc', displayName: '裂云雷鹏',
              win: {
                text: '恶战击退雷鹏，满巢雷宝尽归你手！',
                effects: { items: ['leimu', 'dahuan_dan'], stones: 640, lawExp: 18, lawId: 'thunder' },
              },
              lose: {
                text: '雷鹏电爪凶悍无比，你被迫弃宝滚落崖下海水逃命。',
                effects: { hp: -175, injury: 1 },
              },
            },
          },
        },
      },
      {
        label: '只拣取巢外跌落悬崖的紫电翎羽与残雷木，不闯巨巢',
        hint: '避凶趋吉 · 稳得雷材',
        outcome: {
          text: '外围雷羽亦蕴含精纯雷气，你收好战利品从容退离雷云区。',
          effects: { items: ['leimu'], lawExp: 14, lawId: 'thunder', stones: 280, exp: 360 },
        },
      },
    ],
  },
  {
    id: 'wrl_gx_s31',
    title: '归墟 · 蜃海茶坊',
    region: 'guixu',
    pool: 'world',
    tier: 3,
    weight: 4,
    minRealm: 2,
    maxRealm: 5,
    text: '东海群岛中转驿站「踏浪坊」里，建在水面木桩上的海风茶肆高朋满座。各路金丹散修、海商与中州游历弟子正聚在一起交换归墟密报，角落一张圆桌竟在私下以物易物换取高阶破境灵丹。',
    choices: [
      {
        label: '出四百灵石与茶坊东海商客私下换购一枚珍稀破障丹与聚灵阵符',
        hint: '耗 400 灵石 · 坊市淘珍',
        cost: { stones: 400 },
        outcome: {
          text: '那商客急需现成灵石修补受损楼船，爽快成交！你稳稳收下破障丹与聚灵阵符，远低于拍卖行市价。',
          effects: { items: ['pozhang_dan', 'juling_zhenfu'], exp: 340 },
        },
      },
      {
        label: '请满座同道喝一轮海岛青梅灵茶，广听东海与中州最新风云',
        hint: '耗 80 灵石 · 结交人脉增声望',
        cost: { stones: 80 },
        outcome: {
          text: '众修士见你豪爽大方，纷纷把各自知晓的秘境传闻与突破心得倾吐出来，令你受益良多！',
          effects: { exp: 480, reputation: 18, attrs: { 魅力: 2, 神识: 1 } },
        },
      },
    ],
  },
  {
    id: 'wrl_gx_s32',
    title: '归墟 · 海族迁徙',
    region: 'guixu',
    pool: 'wild',
    tier: 3,
    weight: 4,
    minRealm: 2,
    maxRealm: 5,
    text: '暮色苍茫，深海之下传来低沉宏大的千兽共鸣！成百上千头背生荧光珊瑚的巨型玄龟、沧海银蛟与灵鲸结成绵延数十里的浩荡长队，正朝归墟极深处缓缓迁徙，天地水灵气随之沸腾！',
    choices: [
      {
        label: '高悬九天静观万兽入渊，感应苍茫自然大道生息',
        hint: '顺应天地 · 增寿元、修为与混沌感悟',
        outcome: {
          text: '渺沧海之一粟，哀吾生之须臾。望着太古海族生生不息的壮阔迁徙，你心胸顿阔，混沌与光阴之道皆生玄妙共鸣！',
          effects: { expPct: 0.22, lawExp: 20, lawId: 'chaos', lifespan: 8, demon: -16 },
        },
      },
      {
        label: '护持一头掉队受伤的小玄龟躲过尾随的深海夜叉捕猎',
        hint: '慈悲护幼 · 战深海夜叉',
        combat: {
          enemy: 'sea_yaksha',
          win: {
            text: '斩杀偷袭幼龟的夜叉后，队尾一头庞大如山的老玄龟缓缓抬头向你点首致意，张口吐出一块万年碧海玄冰髓与一块厚重玄龟甲灵材！',
            effects: { items: ['bihai_xuanbing', 'xuanwu_dun'], karma: 30, lifespan: 10, exp: 560 },
          },
          lose: {
            text: '海浪翻涌间被夜叉逼退，好在老玄龟及时回头卷起巨浪惊走了夜叉，保住了幼龟。',
            effects: { hp: -155, karma: 14 },
          },
        },
      },
    ],
  },
  {
    id: 'wrl_gx_s33',
    title: '归墟 · 剑冢浮岛',
    region: 'guixu',
    pool: 'wild',
    tier: 4,
    weight: 3,
    minRealm: 2,
    maxRealm: 5,
    text: '浓雾裂隙间浮现出一座无根飘荡的荒凉石岛，岛上插满上千柄早已锈迹斑斑的残剑断戟，竟是上古海战陨落修士的海上剑冢。石岛中央立着一位白衣守墓大修，残魂凝实如生，冷目如电：「无剑心者，止步岛外！」',
    choices: [
      {
        label: '朗声拔剑登岛，以三招绝杀向守墓长老证自身剑心',
        hint: '以剑证道 · 战结丹长老',
        combat: {
          enemy: 'jindan_elder', displayName: '守墓长老',
          win: {
            text: '千柄锈剑齐齐震鸣致敬！守墓长老欣慰颔首，化作一道清亮剑光没入石碑，留下一包凝丹散、一撮磁砂与滔天剑道真意！',
            effects: { items: ['jiejin_dan', 'xingchen_sha'], lawExp: 32, lawId: 'sword', reputation: 28, exp: 720 },
          },
          lose: {
            text: '长老剑威如海啸镇压，你吐血退回岛外，心中却燃起更炽热的问剑斗志。',
            effects: { hp: -185, lawExp: 18, lawId: 'sword', exp: 420 },
          },
        },
      },
      {
        label: '向海上千柄先烈残剑躬身三拜，焚香祭酒而不强闯',
        hint: '敬重前贤 · 得善缘与清心剑意',
        outcome: {
          text: '白衣长老收去杀机，隔空抛出一张剑意封灵符与一枚冰心雪莲丹，浮岛随即隐回漫天海雾。',
          effects: { items: ['jianqi_fu', 'bingxin_dan'], karma: 18, lawExp: 16, lawId: 'sword', exp: 420 },
        },
      },
    ],
  },
  {
    id: 'wrl_gx_s34',
    title: '归墟 · 归潮拾星',
    region: 'guixu',
    pool: 'wild',
    tier: 3,
    weight: 4,
    minRealm: 2,
    maxRealm: 5,
    text: '星河倒悬的东海子夜，一轮银月低垂海平线。漫长白沙滩上随着每一次浪潮退去，竟留下一片片闪烁如星尘的细碎银辉——原是归墟深渊亿万年淘洗出来的稀世星辰砂随极潮浮岸！',
    choices: [
      {
        label: '施展神识磁引秘法，趁涨潮前疾速筛聚纯度最高的星辰砂',
        hint: '神识与气运检定 · 潮落拾星',
        roll: {
          p: 0.62,
          attrs: { 神识: 0.015, 气运: 0.014 },
          success: {
            text: '灵光卷沙去杂留精，不过一炷香便聚得满满一袋璀璨星辰砂与两百余灵石碎晶，堪作祭炼本命法宝之上材！',
            effects: { items: ['xingchen_sha', 'guixu_shanhu'], stones: 260, lawExp: 16, lawId: 'star' },
          },
          fail: {
            text: '大潮回涌比预想快了半刻，卷走了大半星砂，你只抢回少许碎砂与星辉余韵。',
            effects: { stones: 240, lawExp: 12, lawId: 'star', exp: 360 },
          },
        },
      },
      {
        label: '负手漫步银辉沙滩，仰望浩瀚银河与茫茫归墟共鸣吐纳',
        hint: '天人合一 · 修为道心双丰收',
        outcome: {
          text: '星河垂海，万物寂静。一缕太古浩然星韵自然涌入识海，令你道心坚如磐石，修为稳步精进。',
          effects: { expPct: 0.22, demon: -18, attrs: { 道心: 2, 神识: 1 }, lawExp: 16, lawId: 'star' },
        },
      },
    ],
  },
];
