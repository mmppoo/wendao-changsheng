/**
 * ink 风格多段织网剧情扩展包：
 * 三大秘境（昆仑残墟 / 归墟海眼 / 太古剑冢）、红尘道侣线（苏晚晴）、宗门问道台、观星听雨。
 * 每个主链都采用 knot -> stitch -> flag 回调结构，支持多周目不同路线选择。
 */
export const INK_EXPANSION = [
  /* ===================== 秘境一：昆仑残墟（三段式织网） ===================== */
  {
    id: 'ink_kunlun_1', title: '秘境 · 昆仑残墟', pool: 'wild', tier: 4, weight: 5, minRealm: 1,
    once: true,
    text: '大雪封山处，一道断崖凭空裂开十丈，露出里面沉寂千年的白玉阶。\n\n石阶尽头悬着半块残匾，隐约可见「昆仑」二字。风从门内倒灌出来，带着极纯的古灵气，也带着铁锈般的血腥味。\n\n石柱下刻着一行极细的小字：「入此门者，留一念，取一物。」',
    choices: [
      {
        label: '以神识叩问残匾铭文', hint: '悟性/神识路线 · 影响深处守阵机关',
        require: 'char.attrs.神识 >= 14', requireHint: '神识不足十四，读不透古篆',
        cost: { month: 2 },
        outcome: {
          text: '你合目静立，把神识顺着残缺的笔画走了一遍。匾额轻震，落下一层霜雪，露出藏在字缝里的守阵口诀。\n\n白玉阶上的冰凌悄然退去，为你让出一条窄道。',
          effects: { attrs: { 悟性: 3, 神识: 3 }, flag: { 昆仑解铭: true }, counter: { secrets: 1 } },
          goto: 'ink_kunlun_2',
        },
      },
      {
        label: '拔剑破冰，强闯白玉阶', hint: '战意路线 · 触发护山残魂',
        cost: { month: 1 },
        combat: {
          enemy: 'ghost',
          win: {
            text: '最后一剑斩散白雾，石阶两侧的灯盏齐齐燃起青火。残魂散去前向你微微躬身，似乎认可了你的锋芒。',
            effects: { attrs: { 根骨: 3 }, expPct: 0.25, flag: { 昆仑破阵: true }, counter: { secrets: 1 } },
            goto: 'ink_kunlun_2',
          },
          lose: {
            text: '寒气封住了你的经脉，你被一股柔劲推出断崖。回头时，裂缝已在风雪中缓缓合拢。',
            effects: { hp: -40, injury: 1 },
          },
        },
      },
      {
        label: '仅采阶畔雪莲便退去', hint: '稳妥 · 得灵材与寿元',
        cost: { month: 1 },
        outcome: {
          text: '你没有贪心。摘下两株凝霜灵草后转身下山，身后传来一声若有若无的叹息。',
          effects: { items: ['lingcao', 'lingcao'], lifespan: 5, attrs: { 道心: 2 } },
        },
      },
    ],
  },
  {
    id: 'ink_kunlun_2', title: '昆仑 · 镜廊回响', pool: 'branch', tier: 4, weight: 0,
    text: '穿过白玉阶，是一条百步铜镜长廊。每一面镜子里都映着不同年岁的你：有白发苍苍的凡人，有脚踏飞剑的剑仙，也有浑身浴血的魔尊。\n\n廊尽头摆着两只玉匣，左匣刻「长生」，右匣刻「问道」。',
    choices: [
      {
        label: '以古诀启左匣「长生」', hint: '仅解开铭文者可无伤开启',
        require: 'flag("昆仑解铭")', requireHint: '未解开山门铭文，恐触禁制',
        outcome: {
          text: '你默念方才读出的古诀，左匣应声而开。里面静静躺着一枚温润金丹与半卷古经，匣底还留着一缕万年灵气。',
          effects: { items: ['zhuji_dan', 'jiuzhuan_gong'], lifespan: 25, expPct: 0.35, flag: { 昆仑得丹: true } },
          goto: 'ink_kunlun_3',
        },
      },
      {
        label: '推开右匣「问道」', hint: '道心检定 · 领悟上古剑意',
        roll: {
          p: 0.55, attrs: { 道心: 0.012, 悟性: 0.008 },
          success: {
            text: '右匣中并无宝物，只有一道凝而不散的剑光。剑光没入眉心，你仿佛看见千年前的昆仑剑修在云海练剑三百年。',
            effects: { attrs: { 悟性: 6, 道心: 5 }, expPct: 0.45, flag: { 昆仑得剑意: true } },
            goto: 'ink_kunlun_3',
          },
          fail: {
            text: '剑意太烈，震得你识海翻涌。你咬牙退了三步，只记住半式残招。',
            effects: { hp: -50, demon: 5, attrs: { 悟性: 2 } },
            goto: 'ink_kunlun_3',
          },
        },
      },
      {
        label: '两匣皆不取，直视铜镜中的自己', hint: '破除心魔，道心大进',
        outcome: {
          text: '你站在镜廊中央，看着千万个未来的自己，轻声说：「走一步看一步。」\n\n镜面寸寸化作流光，汇入你的丹田。',
          effects: { demon: -20, attrs: { 道心: 9 }, expPct: 0.3 },
          goto: 'ink_kunlun_3',
        },
      },
    ],
  },
  {
    id: 'ink_kunlun_3', title: '昆仑 · 残墟封门', pool: 'branch', tier: 5, weight: 0,
    text: (s) => `残墟深处的穹顶开始崩落，冰晶如星雨坠下。\n\n${s.flags['昆仑解铭'] ? '那块残匾化作一缕青烟缠绕在你袖口，护着你一路畅行无阻。' : '守阵古灵在身后发出低鸣，催你速速离去。'}\n\n石门外风雪正紧，你回头望去，千年昆仑再度隐入云雾。`,
    choices: [
      {
        label: '向残墟行一礼，踏雪归去', hint: '满载而归',
        outcome: {
          text: '你整了整衣襟，朝空山拜了一拜。此行所得，足以改变往后百年命数。',
          effects: { reputation: 40, title: '昆仑问古', flag: { 禁地: true } },
        },
      },
    ],
  },

  /* ===================== 秘境二：归墟海眼（真龙之约） ===================== */
  {
    id: 'ink_guixu_1', title: '秘境 · 归墟海眼', pool: 'wild', tier: 5, weight: 4, minRealm: 2,
    once: true,
    text: '东海极东处，海水向内塌陷成一座百里漩涡，却滴水不沾涡心。涡底沉着一座青铜古坛，坛上盘着一具绵延数里的白龙遗骨。\n\n龙骨眼眶里，竟然还亮着两点淡金色的光。',
    choices: [
      {
        label: '御风直下海眼', hint: '高风险高机缘 · 亲见真龙残魂',
        cost: { month: 2 },
        outcome: {
          text: '你迎着狂涛坠入涡心。百丈水墙在身侧轰鸣，却在三尺外被一股无形龙威排开。\n\n一个低沉如雷的声音直接在你骨髓里响起：「又来了一个问长生的小虫子。」',
          effects: { flag: { 见龙: true }, counter: { secrets: 1 } },
          goto: 'ink_guixu_2',
        },
      },
      {
        label: '在海面采集雷击珊瑚与万年海草', hint: '安全收获灵材',
        cost: { month: 1 },
        outcome: {
          text: '你绕着漩涡边缘拾得一段焦黑雷木与一株万年海草，心满意足地折返。',
          effects: { items: ['leimu', 'lingcao'], flag: { 万年灵草: true }, stones: 260 },
        },
      },
    ],
  },
  {
    id: 'ink_guixu_2', title: '归墟 · 龙问', pool: 'branch', tier: 5, weight: 0,
    text: '真龙残魂俯视着你，金瞳如两轮沉入海底的太阳。\n\n「本座困守归墟三万年，见过九百个想抽我龙筋的修士，也见过三个陪我下棋的疯子。{name}，你想要什么？」',
    choices: [
      {
        label: '「我想借前辈一缕龙气淬骨」', hint: '根骨与寿元大涨，须受龙威冲刷',
        roll: {
          p: 0.6, attrs: { 根骨: 0.012, 道心: 0.006 },
          success: {
            text: '真龙大笑，吐出一口炽白龙息将你吞没。剧痛之后，你听见骨骼节节重铸的清脆声响。',
            effects: { attrs: { 根骨: 10, 神识: 4 }, lifespan: 80, expPct: 0.5, flag: { 龙气淬骨: true } },
            goto: 'ink_guixu_3',
          },
          fail: {
            text: '龙威如山压下，你单膝跪地，嘴角溢血。真龙摇了摇头，只留给你一滴稀释的龙血。',
            effects: { hp: -80, attrs: { 根骨: 4 }, lifespan: 20 },
            goto: 'ink_guixu_3',
          },
        },
      },
      {
        label: '「晚辈愿听前辈讲讲三万年前的天地」', hint: '悟道路线 · 悟性与道心暴涨',
        cost: { month: 6 },
        outcome: {
          text: '真龙沉默良久，竟真的收起威压，与你隔坛而坐。\n\n你听它讲仙界崩裂、星河改道、旧神沉睡。半载光阴如一瞬，再抬头时，你眼中的世界已截然不同。',
          effects: { attrs: { 悟性: 10, 道心: 10 }, demon: -15, expPct: 0.4, flag: { 听龙论道: true } },
          goto: 'ink_guixu_3',
        },
      },
      {
        label: '趁其虚弱，拔剑夺取龙珠', hint: '极度危险 · 死战妖将级残灵',
        combat: {
          enemy: 'demon_general',
          win: {
            text: '海眼沸腾，你硬生生斩断龙魂最后一缕执念，夺下坛心那枚温热的龙珠。只是从此夜里，你总听见海啸声。',
            effects: { stones: 3000, items: ['jiuzhuan_dan'], karma: -60, demon: 15, flag: { 夺龙珠: true } },
            goto: 'ink_guixu_3',
          },
          lose: {
            text: '龙尾一扫，海墙倒塌。你拼尽全力才浮出海面，半条命留在了归墟里。',
            effects: { hp: -120, injury: 2, karma: -30 },
          },
        },
      },
    ],
  },
  {
    id: 'ink_guixu_3', title: '归墟 · 潮平', pool: 'branch', tier: 5, weight: 0,
    text: '海眼缓缓合拢，海面重归镜面般的宁静。天边升起一轮极红的朝阳，你的衣袍上还沾着归墟海底的银沙。',
    choices: [
      {
        label: '踏浪归去', hint: '记入此生行止',
        outcome: {
          text: '你知道，这世上真正见过真龙的修士，屈指可数。',
          effects: { reputation: 80, title: '归墟见龙' },
        },
      },
    ],
  },

  /* ===================== 秘境三：太古剑冢 ===================== */
  {
    id: 'ink_jianzhong_1', title: '秘境 · 太古剑冢', pool: 'wild', tier: 4, weight: 5, minRealm: 1,
    once: true,
    text: '荒原尽头，数万柄残剑斜插在赤红砂土里，像一片无边无际的铁林。风一吹，万剑同时低鸣，声音像千军万马在地下行军。\n\n剑林深处，有一柄未开锋的黑剑正在向你轻轻震颤。',
    choices: [
      {
        label: '一步步走向黑剑', hint: '承受万剑威压 · 根骨/道心检定',
        cost: { month: 2 },
        roll: {
          p: 0.55, attrs: { 根骨: 0.01, 道心: 0.01 },
          success: {
            text: '你顶着割面剑风走完三百步，握住剑柄的那一刻，漫山铁林忽然鸦雀无声。\n\n一缕太古剑意顺着掌心涌入四肢百骸。',
            effects: { items: ['wujian_jue'], attrs: { 根骨: 5, 道心: 4 }, flag: { 剑冢择剑: true, 得地阶法宝: true }, counter: { secrets: 1 } },
            goto: 'ink_jianzhong_2',
          },
          fail: {
            text: '走到第一百步，一道横空剑气割裂你的衣袖。你借势退开，倒也悟出几分剑理。',
            effects: { hp: -45, attrs: { 悟性: 3 }, counter: { secrets: 1 } },
            goto: 'ink_jianzhong_2',
          },
        },
      },
      {
        label: '静坐剑林外围观剑听风', hint: '无伤悟道',
        cost: { month: 3 },
        outcome: {
          text: '你在剑林外枯坐三月，听惯了万剑齐鸣，再听人间喧嚣，竟觉得无比安静。',
          effects: { expPct: 0.35, attrs: { 悟性: 5, 道心: 3 }, counter: { secrets: 1 } },
        },
      },
    ],
  },
  {
    id: 'ink_jianzhong_2', title: '剑冢 · 问锋', pool: 'branch', tier: 4, weight: 0,
    text: '荒原起雾，一名背负木剑的青衫剑客从残剑间走来，打量你片刻：「能走到这里的人不多。接我一剑，若接住了，这座剑冢便欠你一分情。」',
    choices: [
      {
        label: '「请赐教」', hint: '以剑会友 · 战斗',
        combat: {
          enemy: 'cultivator', displayName: '青衫剑客',
          win: {
            text: '青衫剑客收剑微笑，身形化作漫天剑影散去，只在地上留下一枚刻着「无尘」的剑令与一袋灵石。',
            effects: { stones: 600, reputation: 60, attrs: { 根骨: 4, 悟性: 4 }, flag: { 剑断法宝: true }, title: '剑冢客' },
          },
          lose: {
            text: '木剑点在你肩头，你连退七步。剑客叹了口气：「剑心不错，火候还浅。」说罢留下一枚疗伤丹离去。',
            effects: { items: ['liaoshang_dan'], attrs: { 悟性: 2 } },
          },
        },
      },
      {
        label: '拱手辞谢', hint: '不争一时之胜',
        outcome: {
          text: '剑客点点头：「知进退，也是剑道。」他转身没入雾中，剑风随之平息。',
          effects: { attrs: { 道心: 4 }, demon: -8 },
        },
      },
    ],
  },

  /* ===================== 红尘道侣线：苏晚晴（四段式织网） ===================== */
  {
    id: 'ink_su_1', title: '红尘 · 梅下茶摊', pool: 'world', tier: 3, weight: 8, minRealm: 0,
    once: true,
    text: '落雪的傍晚，你在山脚茶摊避风。邻桌坐着一位青衣女修/男修，名为苏晚晴，腰间悬着一柄缠了红绳的玉笛。\n\n茶摊只剩最后一壶热茶，对方推过来一只温热的粗陶碗：「道友也是赶夜路的人？分你一半。」',
    choices: [
      {
        label: '接过热茶，共饮到雪停', hint: '结下善缘 · 开启道侣长线',
        cost: { month: 1 },
        outcome: {
          text: '你们聊起各自离家的那一年，聊起山外不肯停的雪。临别时，苏晚晴把一根红绳系在你的茶碗耳上：「若来日有缘，梅开再见。」',
          effects: { attrs: { 道心: 3, 魅力: 2 }, flag: { 识苏晚晴: true, 喝到天亮: true }, relation: { 苏晚晴: 15 } },
        },
      },
      {
        label: '留下十枚灵石作茶资，独自离开', hint: '萍水相逢，不沾因果',
        cost: { stones: 10 },
        outcome: {
          text: '你起身踏入风雪，身后传来极轻的一声笛音，很快被风吹散。',
          effects: { attrs: { 道心: 2 } },
        },
      },
    ],
  },
  {
    id: 'ink_su_2', title: '红尘 · 荒村共厄', pool: 'world', tier: 3, weight: 9, minRealm: 1,
    once: true,
    require: 'flag("识苏晚晴")',
    text: '暴雨夜，你在破庙撞见浑身是伤的苏晚晴。庙外传来邪修的狞笑声，对方显然冲着她/他怀里那半卷古谱而来。\n\n苏晚晴握紧玉笛，看见你时愣了一瞬，随即压低声音：「你快走，别被我连累。」',
    choices: [
      {
        label: '挡在庙门前：「一起走」', hint: '并肩迎敌 · 大幅增进情谊',
        combat: {
          enemy: 'rogue',
          win: {
            text: '雨停时，邪修伏诛。你替苏晚晴包扎肩伤，火光照得对方耳尖微红。\n\n「从前我觉得长生路只能一个人走，」苏晚晴轻声说，「今晚好像不一样了。」',
            effects: { relation: { 苏晚晴: 25 }, karma: 20, attrs: { 道心: 4 }, flag: { 荒村相护: true } },
            goto: 'ink_su_3',
          },
          lose: {
            text: '你替苏晚晴挡下一记毒掌，对方吹响玉笛拼死带你杀出重围。醒来时你在山洞里，药香满室。',
            effects: { hp: -30, relation: { 苏晚晴: 20 }, flag: { 荒村相护: true } },
            goto: 'ink_su_3',
          },
        },
      },
      {
        label: '留下疗伤丹，引开追兵', hint: '以智脱险',
        cost: { month: 1 },
        outcome: {
          text: '你绕到庙后放出灵火引开邪修。三日后你在渡口收到一只折成仙鹤的纸符，上面写着：「欠你一命。」',
          effects: { relation: { 苏晚晴: 15 }, karma: 15, flag: { 荒村相护: true, 欠人情: true } },
        },
      },
    ],
  },
  {
    id: 'ink_su_3', title: '红尘 · 梅影定契', pool: 'branch', tier: 4, weight: 0,
    text: '翌年早春，寒梅初放。苏晚晴在山坡上等你，手里拿着两枚刻了彼此名字的青玉佩。\n\n「修仙百年，寿元再长，若无人同看一场花开，也怪冷清的。」对方看着你，眼睛清澈得像雪水，「{name}，愿不愿意与我结为道侣，此后同行？」',
    choices: [
      {
        label: '接过玉佩，结为道侣', hint: '结契同行 · 解锁双宿与红尘仙分支',
        outcome: {
          text: '你们在梅树下交换了玉佩。没有宾客，没有钟鼓，只有山风替你们作证。\n\n从此你的丹田里多了一份牵挂，也多了一份不怕天劫的底气。',
          effects: { flag: { 道侣: true }, relation: { 道侣: 40, 苏晚晴: 30 }, attrs: { 道心: 8 }, demon: -15, title: '梅下同行' },
        },
      },
      {
        label: '轻声婉拒：「我怕耽误你的仙途」', hint: '止于知己 · 无情道心境',
        outcome: {
          text: '苏晚晴沉默片刻，笑着把玉佩收进袖中：「好。那我们便做一世剑友，山高水长，各自珍重。」',
          effects: { attrs: { 道心: 6, 悟性: 4 }, relation: { 苏晚晴: 10 }, flag: { 剑友晚晴: true } },
        },
      },
    ],
  },

  /* ===================== 宗门大比 · 问道台 ===================== */
  {
    id: 'ink_arena_1', title: '宗门 · 问道台大比', pool: 'sect', tier: 3, weight: 9, minRealm: 0,
    require: 'char.sectId != null && char.sectId !== "sanxiu"',
    text: '钟鸣九声，宗门十年一度的问道台大比开场。高台四周挤满同门，主座长老垂目俯视。\n\n你的对手是内门有名的剑痴陆沉舟。他拱手道：「听闻{name}师兄/师姐进境极快，请不吝赐教。」',
    choices: [
      {
        label: '登台全力一战', hint: '实战较量 · 赢取贡献、声望与连胜记录',
        cost: { month: 1 },
        combat: {
          enemy: 'bandit',
          win: {
            text: '三招已过，你剑尖停在陆沉舟眉前三寸。台下爆出雷鸣喝彩，主座长老抚须颔首，赏下贡献与丹药。',
            effects: { contribution: 350, reputation: 45, stones: 180, items: ['huiling_dan'], counter: { arena_win: 1 } },
          },
          lose: {
            text: '陆沉舟的剑快得像一抹秋霜。你败下阵来，却在交手中看清了自己招式里的三处破绽。',
            effects: { attrs: { 悟性: 3 }, contribution: 80, expPct: 0.15 },
          },
        },
      },
      {
        label: '以意破招，点到为止', hint: '悟性检定 · 儒雅取胜',
        roll: {
          p: 0.55, attrs: { 悟性: 0.014, 神识: 0.008 },
          success: {
            text: '你仅以指风轻点对方剑脊，借力卸开剑势。陆沉舟收剑抱拳，心服口服。',
            effects: { contribution: 300, reputation: 50, attrs: { 悟性: 2, 道心: 2 }, counter: { arena_win: 1 } },
          },
          fail: {
            text: '你算差半寸，衣袖被剑气划开。虽输半招，风度仍在。',
            effects: { contribution: 100, attrs: { 悟性: 1 } },
          },
        },
      },
    ],
  },

  /* ===================== 意境小品：听雨 / 观星 / 传道 ===================== */
  {
    id: 'ink_rain_pavilion', title: '夜雨听檐', pool: 'inner', tier: 2, weight: 7, minRealm: 0,
    once: true,
    text: '连下三日秋雨，洞府外的石阶积满落叶。你推开木门，站到檐下，雨水冰凉地扑在脸上。\n\n忽然间，你不急着赶路，也不急着算寿元了。',
    choices: [
      {
        label: '在雨里站到天亮', hint: '涤荡心魔 · 隐藏成就钩子',
        cost: { month: 1 },
        outcome: {
          text: '天明雨歇，云开见山。你全身湿透，丹田里的灵气却清亮得像刚洗过的玉。',
          effects: { demon: -18, attrs: { 道心: 5, 悟性: 2 }, flag: { 听雨: true } },
        },
      },
      {
        label: '回屋煮茶读书', hint: '静心修持',
        outcome: {
          text: '一壶粗茶，半卷杂记。外面雨声淅沥，屋里灯火安静。',
          effects: { exp: 90, attrs: { 悟性: 2 }, demon: -6 },
        },
      },
    ],
  },
  {
    id: 'ink_star_observatory', title: '观星推演', pool: 'world', tier: 3, weight: 6, minRealm: 1,
    once: true,
    text: '绝顶荒台之上，古人刻下二十八宿星图。今夜银河低垂，星光竟与石面刻痕一一呼应，亮起淡银光丝。',
    choices: [
      {
        label: '顺着星轨推演天象', hint: '悟性/神识检定 · 星辰灵根大吉',
        cost: { month: 2 },
        roll: {
          p: 0.55, attrs: { 悟性: 0.012, 神识: 0.012 },
          success: {
            text: '你指尖拂过星轨，刹那间似乎听见天道齿轮转动之声。一颗流星擦过天际，落进你的识海。',
            effects: { attrs: { 悟性: 6, 神识: 6, 气运: 3 }, expPct: 0.35, flag: { 推演天象: true, 星坠: true } },
          },
          fail: {
            text: '天机深邃，强行窥探令你双目刺痛。你闭眼喘息片刻，只记下几道残星轨迹。',
            effects: { hp: -25, attrs: { 神识: 2 }, flag: { 星坠: true } },
          },
        },
      },
      {
        label: '只是仰头看一会儿星星', hint: '心境平和',
        outcome: {
          text: '星河不言，却照了人间几万年。你心里的焦躁散了一半。',
          effects: { attrs: { 道心: 4 }, demon: -10 },
        },
      },
    ],
  },
];
