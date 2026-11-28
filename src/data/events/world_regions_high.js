/**
 * 高阶四域与仙界编年奇遇包（北荒魔域 · 中州圣域 · 昆仑墟界 · 九霄天门）
 * 共 180 个独立叙事节点（每域 45 节点，含三组多段分支链与 34 段独立奇遇），
 * 全部节点以 wrh_ 为前缀，严格遵循 ink 叙事数据结构与高阶法则体系。
 */
export const WORLD_REGIONS_HIGH = [
  /* ============================================================================
   * 一、北荒魔域（beihuang，45 节点，minRealm: 3, maxRealm: 6）
   * ============================================================================ */

  // ---------- 链一：血月魔坛围城（4 段） ----------
  {
    id: 'wrh_bh_altar_1',
    title: '北荒 · 血月魔坛起兵戈',
    region: 'beihuang',
    pool: 'world',
    tier: 4,
    weight: 4,
    minRealm: 3,
    maxRealm: 6,
    once: true,
    text: '赤月悬于北荒低空，百里焦土尽染暗红。黑石峡谷深处筑起一座九丈血祭魔坛，坛顶九根白骨幡柱正将方圆十里的灵脉煞气抽成漩涡。\n\n峡外三里，正道远征营的青色大阵摇摇欲坠，数名元婴修士御剑盘旋，却被魔坛外围列阵的妖将铁骑死死挡住。号角嘶鸣，血云压顶，大战已至一触即发之际。',
    choices: [
      {
        label: '御剑破开妖将锋线，为远征营撕出缺口',
        hint: '战妖将 · 扬名北荒，挺进魔坛外郭',
        cost: { month: 1 },
        combat: {
          enemy: 'demon_general',
          win: {
            text: '你化作一道惊鸿直插阵心，三合之内震碎妖将黑铁战戟。正道营中鼓声大作，数道剑虹随之涌入峡口。',
            effects: { reputation: 75, karma: 25, expPct: 0.22, flag: { 北荒破阵先锋: true } },
            goto: 'wrh_bh_altar_2',
          },
          lose: {
            text: '魔骑铁阵煞气连成一片，你被妖将重戟震得气血翻腾，退回正道大阵外围暂避锋芒。',
            effects: { hp: -220, injury: 1, reputation: 15 },
          },
        },
      },
      {
        label: '借血雾隐匿气息，孤身潜行摸近魔坛阵基',
        hint: '神识与气运检定 · 绕后窃取魔坛虚实',
        cost: { month: 1 },
        roll: {
          p: 0.56,
          attrs: { 神识: 0.012, 气运: 0.01 },
          success: {
            text: '你敛尽灵光，踩着枯骨阴影绕过巡哨，悄然潜至魔坛西南阵脚，赫然看清九根骨幡彼此牵引的灵纹脉络。',
            effects: { lawExp: 35, lawId: 'array', attrs: { 神识: 3 }, flag: { 北荒暗探阵基: true } },
            goto: 'wrh_bh_altar_2',
          },
          fail: {
            text: '坛畔血雾骤然翻涌，两道阴风锁链擦肩掠过。你强行催动遁光脱身，仅远远瞥见魔坛一角。',
            effects: { hp: -160, demon: 6 },
          },
        },
      },
      {
        label: '于高崖之上以神识推演血祭走势，暂不入局',
        hint: '稳妥观阵 · 悟得血煞与阵道玄机',
        cost: { month: 1 },
        outcome: {
          text: '你立于风蚀高崖静观半月，将正魔双方合击与破阵的得失尽数记于心中，并未轻易涉险。',
          effects: { expPct: 0.16, lawExp: 25, lawId: 'blood', attrs: { 悟性: 2 } },
        },
      },
    ],
  },
  {
    id: 'wrh_bh_altar_2',
    title: '北荒 · 骨鼓镇魂阵',
    region: 'beihuang',
    pool: 'branch',
    tier: 4,
    weight: 0,
    text: (s) => `${s.flags['北荒破阵先锋'] ? '正道修士借你撕开的缺口涌入峡谷，' : '你顺着魔坛阵脚潜入内圈，'}脚下焦土忽然裂开，七面以荒兽颅骨蒙皮的巨鼓破土而出。鼓槌无风自动，每一声闷响皆震得元婴震颤，黑烟之中一名勾魂使拖着漆黑铁索缓步走来。`,
    choices: [
      {
        label: '以雷法或剑意硬撼鼓音，斩杀勾魂使',
        hint: '战九幽勾魂使 · 震碎镇魂鼓阵',
        combat: {
          enemy: 'soul_reaper',
          win: {
            text: '你一击崩断锁魂黑链，顺势将七面骨鼓尽数劈作碎屑。峡谷中弥漫的摄魂魔音戛然而止，露出血坛石阶。',
            effects: { expPct: 0.24, items: ['jiuyou_mingjing'], reputation: 50 },
            goto: 'wrh_bh_altar_3',
          },
          lose: {
            text: '鼓声与锁链齐至，你识海一痛，护体灵光溃散大半，被涌来的血雾逼退百丈。',
            effects: { hp: -260, demon: 10, injury: 1 },
          },
        },
      },
      {
        label: '反推七鼓音律节点，以阵破阵',
        hint: '阵道或神识检定 · 借鼓煞反噬魔坛',
        roll: {
          p: 0.58,
          attrs: { 悟性: 0.012, 神识: 0.012 },
          success: {
            text: '你指诀翻飞，连打七道逆灵印落于鼓心。骨鼓声势陡转，反将魔坛外层血幕震得裂纹遍布。',
            effects: { lawExp: 45, lawId: 'array', attrs: { 悟性: 3 }, flag: { 逆转骨鼓阵: true } },
            goto: 'wrh_bh_altar_3',
          },
          fail: {
            text: '魔阵反震极烈，你喉头一甜，只得强行破开一角血幕继续上坛。',
            effects: { hp: -190, mpPct: -0.2 },
            goto: 'wrh_bh_altar_3',
          },
        },
      },
      {
        label: '祭出镇魔符箓护住元神，直冲血坛顶层',
        hint: '消耗护心符 · 无伤闯阵',
        require: 'has("huxin_fu")',
        requireHint: '行囊中无护心符',
        cost: { item: 'huxin_fu' },
        outcome: {
          text: '护心符化作清光笼罩元神，震魂鼓音如泥牛入海。你踏空疾掠，眨眼便已立于血坛石阶尽头。',
          effects: { expPct: 0.2, attrs: { 道心: 3 } },
          goto: 'wrh_bh_altar_3',
        },
      },
    ],
  },
  {
    id: 'wrh_bh_altar_3',
    title: '北荒 · 血海长老降坛',
    region: 'beihuang',
    pool: 'branch',
    tier: 4,
    weight: 0,
    text: (s) => `踏上九丈魔坛，坛心血池沸腾如浆。${s.flags['逆转骨鼓阵'] ? '因外阵反噬，血池灵光已现紊乱，' : ''}一名身披九幡血袍的老魔自血浪中缓缓升起，元婴化作猩红骷髅悬于脑后，冷笑道：「好大的胆子，竟敢坏本座血月炼宝之期！」`,
    choices: [
      {
        label: '亮剑争锋，在血月之下正面斩魔',
        hint: '战血海长老 · 决定魔坛归属',
        combat: {
          enemy: 'blood_elder',
          win: {
            text: '血浪与剑芒在半空轰然对撞，九道血河幡影寸寸焚毁。血海长老惊怒吐血，化作一道血虹仓皇遁入北荒深处。',
            effects: { reputation: 110, karma: 45, expPct: 0.3, items: ['xuesha_jing'], flag: { 击退血海长老: true } },
            goto: 'wrh_bh_altar_4',
          },
          lose: {
            text: '老魔血煞滔天，一幡卷碎你半数护体真元。所幸正道援军适时压境，你借乱势退下石坛。',
            effects: { hp: -320, injury: 2, demon: 8 },
          },
        },
      },
      {
        label: '引动自身剑意或雷法，直接轰碎血池阵眼',
        hint: '道心 ≥ 30 · 舍敌毁坛，以巧破力',
        require: 'char.attrs.道心 >= 30',
        requireHint: '道心不足三十，难在老魔威压下稳住神通',
        roll: {
          p: 0.6,
          attrs: { 道心: 0.012, 根骨: 0.01 },
          success: {
            text: '你不与老魔缠斗，所有法力凝作一击劈入血池核心。阵眼崩裂，血月倒灌之力反噬老魔自身，逼得他嘶吼遁走。',
            effects: { expPct: 0.26, lawExp: 40, lawId: 'sword', reputation: 85, flag: { 碎眼退老魔: true } },
            goto: 'wrh_bh_altar_4',
          },
          fail: {
            text: '老魔识破你的意图，挥袖挡下神通并将你震落石坛，血池却也被震裂半边。',
            effects: { hp: -240, reputation: 35 },
            goto: 'wrh_bh_altar_4',
          },
        },
      },
    ],
  },
  {
    id: 'wrh_bh_altar_4',
    title: '北荒 · 血坛余烬分宝',
    region: 'beihuang',
    pool: 'branch',
    tier: 4,
    weight: 0,
    text: '血月渐隐于铅云之后，九丈魔坛在阵法反噬中塌陷大半。干涸的池底静卧着一枚由千载灵血淬炼的魔核、一卷血纹骨简，以及正道诸修从魔窟中救出的数枚元婴宝丹。正道营主抱拳上前，请你先择战利。',
    choices: [
      {
        label: '焚毁魔坛余煞，只取凝婴玉露丹与正道酬谢',
        hint: '正道扬名 · 得凝婴玉露丹、灵石与称号',
        outcome: {
          text: '你拂袖燃起净火，将魔坛残煞焚烧殆尽。正道众修肃然起敬，奉上灵石与宝丹，自此北荒营中皆颂你威名。',
          effects: { items: ['ningying_dan', 'dahuan_dan'], stones: 4800, karma: 60, reputation: 120, demon: -18, title: '破坛镇魔尊', counter: { secrets: 1 } },
        },
      },
      {
        label: '暗取血纹骨简与血煞魔核，借魔道杀伐之理反哺己身',
        hint: '得《修罗战天录》与血煞魔核 · 略增心魔',
        outcome: {
          text: '你神色不动，袖袍一卷将池底骨简与魔核收入囊中。指尖触及骨简刹那，滔天战意在识海轰然炸开。',
          effects: { items: ['yujian_xuesha', 'xuesha_jing'], lawExp: 60, lawId: 'blood', demon: 12, reputation: 60, title: '血坛夺宝客', counter: { secrets: 1 } },
        },
      },
      {
        label: '将丹药尽数留与伤兵，独自参悟魔坛残存古阵一月',
        hint: '耗一月 · 功德与阵道法则双丰收',
        cost: { month: 1 },
        outcome: {
          text: '远征营伤卒纷纷拜谢。你在冷清的废坛上独坐三十日，把上古血祭阵化繁为简，竟悟出几分以煞化灵之妙。',
          effects: { karma: 90, reputation: 140, lawExp: 75, lawId: 'array', attrs: { 道心: 5, 悟性: 4 }, title: '北荒护道人', counter: { secrets: 1 } },
        },
      },
    ],
  },

  // ---------- 链二：冥骨龙冢（4 段） ----------
  {
    id: 'wrh_bh_dragon_1',
    title: '北荒 · 霜原现龙骨',
    region: 'beihuang',
    pool: 'wild',
    tier: 4,
    weight: 4,
    minRealm: 3,
    maxRealm: 6,
    once: true,
    text: '北荒极北的黑霜冻原上，狂风刮开百丈积灰，露出一排如山脊般绵延十里的惨白巨肋。\n\n肋骨缝隙间不断渗出幽蓝冥火，空气中弥漫着令元婴发紧的太古龙威。冻原边缘立着几座风化的魔门石碑，隐约刻着「冥龙陨处，生人勿入」八个古篆。',
    choices: [
      {
        label: '踏着巨龙脊骨深入冢心，探寻龙髓遗泽',
        hint: '耗一月 · 步入冥骨龙冢',
        cost: { month: 1 },
        outcome: {
          text: '你催动护体罡气抗住刺骨冥风，沿着蜿蜒如峡谷的龙脊步步深入，前方渐现一座幽蓝冰窟。',
          effects: { expPct: 0.14, attrs: { 根骨: 2 }, flag: { 踏入冥龙冢: true } },
          goto: 'wrh_bh_dragon_2',
        },
      },
      {
        label: '以神识先扫冢外石碑，破译古魔封禁',
        hint: '悟性与神识检定 · 预知冢内凶险',
        roll: {
          p: 0.6,
          attrs: { 悟性: 0.012, 神识: 0.012 },
          success: {
            text: '碑文虽残，你仍从中推演出冥火潮汐的停歇时辰，并顺手掘出埋于碑下的一块九幽冥晶。',
            effects: { items: ['jiuyou_mingjing'], attrs: { 神识: 3 }, flag: { 识破龙冢碑文: true } },
            goto: 'wrh_bh_dragon_2',
          },
          fail: {
            text: '石碑残存的魔念骤然反噬，震得你眉心生疼，只得硬着头皮直接入冢。',
            effects: { hp: -120, demon: 5 },
            goto: 'wrh_bh_dragon_2',
          },
        },
      },
      {
        label: '只在外围采集被龙威淬炼的冻土灵材便撤离',
        hint: '稳妥 · 得星辰砂与些许修为',
        outcome: {
          text: '你未贪深入之利，仅在龙肋外侧刮取数两凝结龙气的星辰砂，转身没入风沙。',
          effects: { items: ['xingchen_sha'], stones: 1200, expPct: 0.12 },
        },
      },
    ],
  },
  {
    id: 'wrh_bh_dragon_2',
    title: '北荒 · 冰窟阴潮与守墓鬼王',
    region: 'beihuang',
    pool: 'branch',
    tier: 4,
    weight: 0,
    text: (s) => `冰窟深处穹顶倒悬万千骨棱，阴风如泣。${s.flags['识破龙冢碑文'] ? '你恰好卡在冥火低潮的间隙潜入，' : '幽蓝冥火骤然暴涨，'}窟心黑冰王座上缓缓浮起一尊披着残破战甲的鬼王，空洞眼眶燃起两团鬼火，千百道怨嚎同时向你识海扑来。`,
    choices: [
      {
        label: '仗剑斩鬼王，清扫龙冢外障',
        hint: '战鬼王 · 胜则直抵龙心冰殿',
        combat: {
          enemy: 'ghost_king',
          win: {
            text: '清冽灵光斩开黑冰王座，鬼王发出不甘凄啸，身躯化作漫天阴灰消散，留下一道通往地底的青铜暗门。',
            effects: { expPct: 0.24, stones: 3200, karma: 20, attrs: { 道心: 3 } },
            goto: 'wrh_bh_dragon_3',
          },
          lose: {
            text: '鬼王怨嚎撕裂你的识海防线，你拼着一口精血撞开冰壁逃出冻原，狼狈不堪。',
            effects: { hp: -260, demon: 12, injury: 1 },
          },
        },
      },
      {
        label: '诵清心道诀安抚亡魂怨气，寻隙绕过王座',
        hint: '道心 ≥ 32 · 以静制动',
        require: 'char.attrs.道心 >= 32',
        requireHint: '道心未至三十二，难抗千魂哀嚎',
        roll: {
          p: 0.62,
          attrs: { 道心: 0.012, 悟性: 0.01 },
          success: {
            text: '道音如清泉涤过冰窟，鬼王周身怨焰微滞。你趁它一瞬失神掠过青铜暗门，反得一丝因果明悟。',
            effects: { lawExp: 45, lawId: 'karma', demon: -12, flag: { 渡魂入龙殿: true } },
            goto: 'wrh_bh_dragon_3',
          },
          fail: {
            text: '怨念积郁千年岂易平息，鬼王怒挥骨爪扫中你肩头，你顺势借力滚入暗门之内。',
            effects: { hp: -210, injury: 1 },
            goto: 'wrh_bh_dragon_3',
          },
        },
      },
    ],
  },
  {
    id: 'wrh_bh_dragon_3',
    title: '北荒 · 冥海骨蛟苏醒',
    region: 'beihuang',
    pool: 'branch',
    tier: 4,
    weight: 0,
    text: '青铜暗门之后是一座沉于地脉黑水中的巨大骨殿。殿心黑潭浮着一颗黯淡却仍隐隐搏动的赤金龙珠，潭水忽而翻起十丈恶浪——一头借太古龙骸与冥水复生的骨蛟破水而出，森白骨翼遮蔽整座穹顶！',
    choices: [
      {
        label: '催动全力与冥海骨蛟殊死一搏',
        hint: '战冥海骨蛟 · 胜则独得龙殿遗珍',
        combat: {
          enemy: 'bone_dragon',
          win: {
            text: '骨蛟脊骨被你轰作数截，哀吟着沉入黑潭。潭水骤静，那颗温热龙珠缓缓飘至你身前。',
            effects: { expPct: 0.3, reputation: 90, attrs: { 根骨: 4 }, flag: { 斩灭冥骨蛟: true } },
            goto: 'wrh_bh_dragon_4',
          },
          lose: {
            text: '骨蛟一尾横扫将你拍飞数十丈，冰柱崩塌掩埋半座殿堂，你勉强施展遁术保命。',
            effects: { hp: -310, injury: 2 },
          },
        },
      },
      {
        label: '祭出缩地成寸符，虚晃一招直摄潭心龙珠',
        hint: '消耗缩地成寸符 · 奇袭夺珠而退',
        require: 'has("suodi_fu")',
        requireHint: '行囊中无缩地成寸符',
        cost: { item: 'suodi_fu' },
        outcome: {
          text: '空间微褶，你在骨蛟巨吻合拢前刹那现身潭心，探手夺下龙珠并借余势退至高台石门处。',
          effects: { lawExp: 40, lawId: 'space', attrs: { 气运: 3 }, flag: { 巧夺冥龙珠: true } },
          goto: 'wrh_bh_dragon_4',
        },
      },
    ],
  },
  {
    id: 'wrh_bh_dragon_4',
    title: '北荒 · 真龙遗髓',
    region: 'beihuang',
    pool: 'branch',
    tier: 4,
    weight: 0,
    text: '随着黑潭灵气散尽，骨殿深处露出一截温润如玉的太古龙髓，髓心凝着两滴尚未枯竭的真龙精血，旁侧石案还留有一只封存完好的丹匣与半截古剑剑鞘。',
    choices: [
      {
        label: '收取龙血精与元婴丹，带出冻原徐徐炼化',
        hint: '得龙血精、元婴丹与锻骨龙象丹',
        outcome: {
          text: '你将龙血真精小心封入玉瓶，连同石案宝丹一并收起。走出黑霜冻原时，衣袍仍萦绕淡淡龙威。',
          effects: { items: ['longxue_jing', 'yuanying_dan', 'duangu_dan'], reputation: 95, title: '冥冢探龙客', counter: { secrets: 1 } },
        },
      },
      {
        label: '就地借黑潭龙威淬炼肉身两月，炼化龙髓入骨',
        hint: '耗两月 · 根骨与寿元大涨，得龙血精',
        cost: { month: 2 },
        outcome: {
          text: '你在骨殿寒潭畔枯坐六十日，引龙髓灵韵反复洗刷四肢百骸。出关之时筋骨隐作龙吟，寿元大增。',
          effects: { expPct: 0.36, attrs: { 根骨: 8, 道心: 4 }, lifespan: 45, items: ['longxue_jing'], title: '龙髓淬骨身', counter: { secrets: 1 } },
        },
      },
    ],
  },

  // ---------- 链三：黑骨魔市暗局（3 段） ----------
  {
    id: 'wrh_bh_market_1',
    title: '北荒 · 九灯黑骨魔市',
    region: 'beihuang',
    pool: 'world',
    tier: 4,
    weight: 4,
    minRealm: 3,
    maxRealm: 6,
    once: true,
    text: '北荒无风谷地底藏着一座只在朔月开启的黑骨魔市。九盏以妖蛟油脂燃起的青灯悬于洞顶，灯下尽是戴着骨面具的元婴散修与魔门执事。\n\n高台之上，司仪正高举一只刻满星纹的漆黑玉盒：「太古剑修遗物《太虚斩虹剑》半残灵胚，另附凝婴灵丹两粒，价高者得！」你却隐约察觉玉盒暗藏一缕诡异神魂印记。',
    choices: [
      {
        label: '豪掷五千灵石竞拍，静观幕后之人如何动作',
        hint: '5000 灵石 · 顺藤摸瓜入局',
        require: 'stones >= 5000',
        requireHint: '灵石不足五千',
        cost: { stones: 5000 },
        outcome: {
          text: '拍槌三落，漆黑玉盒落入你手。台下数道戴着铁面的身影互递眼色，悄然退出灯火范围。',
          effects: { reputation: 45, attrs: { 神识: 3 }, flag: { 魔市拍下黑盒: true } },
          goto: 'wrh_bh_market_2',
        },
      },
      {
        label: '以神识暗中截听高台后方传音，查明骗局底细',
        hint: '神识与悟性检定 · 揭开暗局',
        roll: {
          p: 0.58,
          attrs: { 神识: 0.012, 悟性: 0.01 },
          success: {
            text: '你截获数缕隐秘传音，原是黑市东家故意以追踪玉盒为饵，专在散场后伏杀携重金而来的元婴客商！',
            effects: { attrs: { 神识: 4, 悟性: 2 }, flag: { 识破魔市陷阱: true } },
            goto: 'wrh_bh_market_2',
          },
          fail: {
            text: '你的神识触及一道禁制暗纹，高台司仪目光如电扫来。你不动声色退入暗巷，背后却已缀上尾巴。',
            effects: { demon: 5, flag: { 魔市被盯上: true } },
            goto: 'wrh_bh_market_2',
          },
        },
      },
      {
        label: '冷眼旁观，只在偏摊低价淘换几块九幽冥晶便离去',
        hint: '800 灵石 · 避开浑水',
        require: 'stones >= 800',
        requireHint: '灵石不足八百',
        cost: { stones: 800 },
        outcome: {
          text: '你知魔市水深，在角落摊位换得一块成色极佳的九幽冥晶，趁灯火未熄提前遁出谷外。',
          effects: { items: ['jiuyou_mingjing'], attrs: { 气运: 2 } },
        },
      },
    ],
  },
  {
    id: 'wrh_bh_market_2',
    title: '北荒 · 骨巷截杀',
    region: 'beihuang',
    pool: 'branch',
    tier: 4,
    weight: 0,
    text: (s) => `朔月黑市散场，你刚步出无风谷口的白骨长巷，四壁阴影同时暴起！${s.flags['识破魔市陷阱'] ? '你早有防备，脚下阵步微错，' : '一道赤红剑光贴着咽喉斩来，'}一名身披血衣的堕落剑尊率众封死前后退路，阴恻恻道：「留下储物袋，本座赐你全尸。」`,
    choices: [
      {
        label: '拔剑迎战血衣剑尊，反杀黑市幕后黑手',
        hint: '战血衣剑尊 · 胜则直捣黑市密库',
        combat: {
          enemy: 'crimson_sword',
          win: {
            text: '长巷中剑鸣如雷，你连破血衣剑尊七式绝杀，一剑洞穿其护身魔甲。余众大骇四散，你从他腰间摘下一枚黑骨库钥。',
            effects: { expPct: 0.28, stones: 4500, lawExp: 45, lawId: 'sword', flag: { 斩杀血衣剑尊: true } },
            goto: 'wrh_bh_market_3',
          },
          lose: {
            text: '血衣剑尊剑势毒辣刁钻，你左肩挨了一记血剑，借一枚遁符撕开巷口血雾方才脱身。',
            effects: { hp: -280, injury: 2 },
          },
        },
      },
      {
        label: '当众喝破黑市杀客丑闻，引其余元婴客商合围反扑',
        hint: '魅力与神识检定 · 借刀杀人',
        roll: {
          p: 0.6,
          attrs: { 魅力: 0.012, 神识: 0.01 },
          success: {
            text: '你声音灌注真元响彻无风谷，抖出玉盒追踪印记。数名同遭暗算的元婴散修勃然大怒，纷纷倒戈杀向黑市伏兵！',
            effects: { reputation: 90, attrs: { 魅力: 4 }, flag: { 群修倒戈魔市: true } },
            goto: 'wrh_bh_market_3',
          },
          fail: {
            text: '北荒客商素来各扫门前雪，无人肯先出头。你被迫独抗数轮剑雨，杀出一条血路。',
            effects: { hp: -220, expPct: 0.16 },
            goto: 'wrh_bh_market_3',
          },
        },
      },
    ],
  },
  {
    id: 'wrh_bh_market_3',
    title: '北荒 · 黑骨密库启封',
    region: 'beihuang',
    pool: 'branch',
    tier: 4,
    weight: 0,
    text: '风波落定，无风谷地底的黑骨密库洞门大开。库中堆积着黑市数百年掠夺而来的灵石与秘藏：一柄寒光吞吐的太虚斩虹剑真品悬于石架，旁侧更有星玉简与凝婴丹药成排摆放。',
    choices: [
      {
        label: '取走太虚斩虹剑与凝婴玉露丹，扬长而去',
        hint: '得灵宝太虚斩虹剑与凝婴玉露丹',
        outcome: {
          text: '飞剑入掌清鸣不止，似久旱逢甘霖。你扫空石架珍品，拂袖离去，留下一座空荡的黑骨魔市。',
          effects: { items: ['taixu_jian', 'ningying_dan'], stones: 3800, reputation: 80, title: '黑市破局者', counter: { secrets: 1 } },
        },
      },
      {
        label: '取《周天星辰诀玉简》与灵石，余财散与受骗散修',
        hint: '得星辰玉简、大功德与厚重声望',
        outcome: {
          text: '你只取走最契合大道的星辰玉简与部分灵石，将余下赃物归还众客商。一时之间，北荒散修无不传颂你的名号。',
          effects: { items: ['yujian_xingchen', 'huaying_dan'], stones: 2500, karma: 55, reputation: 130, title: '北荒公道人', counter: { secrets: 1 } },
        },
      },
    ],
  },

  // ---------- 独立奇遇 34 段（wrh_bh_01 ~ wrh_bh_34） ----------
  {
    id: 'wrh_bh_01',
    title: '北荒 · 血月照枯城',
    region: 'beihuang',
    pool: 'wild',
    tier: 4,
    weight: 3,
    minRealm: 3,
    maxRealm: 6,
    text: '荒漠尽头矗立着一座早已断绝人烟的古城，城砖皆呈暗褐，仿佛浸透了千载兵燹之血。子夜血月升至中天时，城门无声洞开，十余盏白纸灯笼沿长街飘荡，鬼气森森却又夹杂着一缕极精纯的古阵灵光。',
    choices: [
      {
        label: '仗剑入城，斩散盘踞城楼的鬼王仪仗',
        hint: '战鬼王 · 净化枯城阴脉',
        combat: {
          enemy: 'ghost_king',
          win: {
            text: '剑光如昼撕裂血月阴霾，城楼鬼帅连同十余盏幽灯一并化灰。城心古井中浮出一枚温润的松鹤延寿丹。',
            effects: { items: ['yanshou_dan'], karma: 35, reputation: 65, expPct: 0.22 },
          },
          lose: {
            text: '古城怨煞借血月成势，你被阴风逼出南门，衣袍结满黑霜。',
            effects: { hp: -210, demon: 10 },
          },
        },
      },
      {
        label: '立于城垣高处，以神识临摹城砖上的镇煞古纹',
        hint: '耗一月 · 悟阵道与神识',
        cost: { month: 1 },
        outcome: {
          text: '你避开城中阴潮，绕行城墙三十日，将昔年筑城大修留下的镇魔符纹记入识海。',
          effects: { lawExp: 50, lawId: 'array', attrs: { 神识: 3, 悟性: 2 }, expPct: 0.16 },
        },
      },
      {
        label: '于城门口燃三炷静心香，超度无主枯骨',
        hint: '道心与业力提升 · 消减心魔',
        outcome: {
          text: '青烟袅袅升入血月之下，长街哭声渐歇。一道微弱却澄澈的功德金光落于你眉心。',
          effects: { karma: 45, demon: -20, attrs: { 道心: 4 } },
        },
      },
    ],
  },
  {
    id: 'wrh_bh_02',
    title: '北荒 · 千丈炼魂坑',
    region: 'beihuang',
    pool: 'wild',
    tier: 4,
    weight: 3,
    minRealm: 3,
    maxRealm: 6,
    text: '赤岩峡谷正中陷落出一口深不见底的漆黑天坑，坑壁插满锈蚀的镇魂钉，阴风自地心卷上，吹得崖边碎石咯吱作响。坑底隐隐透出漆黑晶芒，那是无数怨魂千载沉淀凝成的九幽冥晶。',
    choices: [
      {
        label: '御风直坠坑底，强行开采冥晶原矿',
        hint: '根骨与道心检定 · 险取九幽冥晶',
        roll: {
          p: 0.56,
          attrs: { 根骨: 0.012, 道心: 0.012 },
          success: {
            text: '你硬扛坑底噬魂阴风，一剑劈下两块拳大九幽冥晶，凌空一跃重返崖顶，周身气血反被阴风淬得愈发凝练。',
            effects: { items: [{ id: 'jiuyou_mingjing', qty: 2 }], attrs: { 根骨: 3 }, expPct: 0.2 },
          },
          fail: {
            text: '坑底怨潮突然反扑，你虽抢得一块冥晶，元神却遭阴煞蚀伤，不得不仓促退走。',
            effects: { items: ['jiuyou_mingjing'], hp: -190, demon: 12 },
          },
        },
      },
      {
        label: '以真火灼烧坑壁镇魂钉，引天雷净化炼魂坑',
        hint: '雷霆法则感悟 · 大涨业力与声望',
        cost: { month: 1 },
        outcome: {
          text: '你引动雷火沿坑壁倾泻而下，千载积郁的怨煞化作青烟散去，识海对雷霆镇邪之道豁然开朗。',
          effects: { lawExp: 55, lawId: 'thunder', karma: 50, reputation: 60, demon: -15 },
        },
      },
      {
        label: '盘坐坑缘借阴风磨砺元婴神识',
        hint: '耗一月 · 提升神识与法力',
        cost: { month: 1 },
        outcome: {
          text: '你守住灵台清明，任阴风刮过元婴外郭。一月之后，神识感知竟比往日多出数十里。',
          effects: { attrs: { 神识: 5, 道心: 2 }, expPct: 0.18 },
        },
      },
    ],
  },
  {
    id: 'wrh_bh_03',
    title: '北荒 · 正道远征营求援',
    region: 'beihuang',
    pool: 'world',
    tier: 4,
    weight: 4,
    minRealm: 3,
    maxRealm: 6,
    text: '赤沙岭背风处扎着一座正道联军前哨营，护营青幕已破损三处。营中丹师愁眉不展——昨日魔潮突袭，十余名结丹弟子身中血毒，营内疗伤灵丹却已告罄，营主正四处重金求援。',
    choices: [
      {
        label: '赠出一粒大还丹，并亲自出手拔除众修血毒',
        hint: '消耗大还丹 · 得丰厚灵石、声望与人情',
        require: 'has("dahuan_dan")',
        requireHint: '行囊中无大还丹',
        cost: { item: 'dahuan_dan' },
        outcome: {
          text: '丹药化作药雾散入营帐，你再以精纯灵力催毒出体。营主大喜过望，奉上军资灵石与一枚凝婴玉露丹相谢。',
          effects: { items: ['ningying_dan'], stones: 3200, karma: 55, reputation: 95, contribution: 120 },
        },
      },
      {
        label: '替营地出战一局，斩杀营外叫阵的魔道妖将',
        hint: '战妖将 · 稳住前哨士气',
        combat: {
          enemy: 'demon_general',
          win: {
            text: '你在阵前十合斩落妖将首级，魔军锐气大挫。营中欢声雷动，营主当场赠你三千余灵石与一张紫霄神雷符。',
            effects: { stones: 3600, reputation: 85, karma: 35, items: ['jiuxiao_leifu'] },
          },
          lose: {
            text: '妖将悍不畏死，你被迫退回营门，好在拖延了足够时辰让大阵合拢。',
            effects: { hp: -220, reputation: 25 },
          },
        },
      },
      {
        label: '留驻半月替营地修补护山阵基',
        hint: '耗一月 · 得贡献、灵石与阵道感悟',
        cost: { month: 1 },
        outcome: {
          text: '你重新梳理岭下地脉节点，令青幕重焕清辉。临别之际，联军奉上一袋灵石与阵法手札。',
          effects: { stones: 2400, lawExp: 45, lawId: 'array', reputation: 50, contribution: 80 },
        },
      },
    ],
  },
  {
    id: 'wrh_bh_04',
    title: '北荒 · 白骨关隘铁傀挡道',
    region: 'beihuang',
    pool: 'wild',
    tier: 4,
    weight: 3,
    minRealm: 3,
    maxRealm: 6,
    text: '通往北荒腹地的唯一险关「白骨隘」由两根太古凶兽肋骨搭成门楼。门楼下矗立着一尊十丈高的玄铁巨傀，胸口灵核嗡鸣作响——它是上古魔宗遗留的守关杀器，凡越线者不论正魔皆斩！',
    choices: [
      {
        label: '正面拆毁机关巨神傀，夺取其胸口玄核',
        hint: '战机关巨神傀 · 得丰厚灵石与高阶宝甲',
        combat: {
          enemy: 'iron_titan',
          win: {
            text: '重拳崩山裂石，你终觅得其关节破绽，一击洞穿胸膛阵图。巨傀轰然倾塌，滚出一件金乌火羽衣与大量灵石。',
            effects: { items: ['jinwu_yi'], stones: 4200, expPct: 0.26, attrs: { 根骨: 3 } },
          },
          lose: {
            text: '巨神傀铜皮铁骨难伤分毫，反震之力震得你虎口崩裂，只得绕道荒岭。',
            effects: { hp: -270, injury: 1 },
          },
        },
      },
      {
        label: '以神识逆推傀儡阵纹，趁换气间隙无声关停',
        hint: '悟性 ≥ 28 · 智取古傀灵核',
        require: 'char.attrs.悟性 >= 28',
        requireHint: '悟性不足二十八，难识上古机关阵纹',
        roll: {
          p: 0.6,
          attrs: { 悟性: 0.012, 神识: 0.01 },
          success: {
            text: '你一指精准点中巨傀颈后三寸死穴，十丈铁躯顿时僵立不动。你从容取下阵心星辰砂与秘藏灵石。',
            effects: { items: ['xingchen_sha', 'dahuan_dan'], stones: 2800, lawExp: 45, lawId: 'array' },
          },
          fail: {
            text: '落指差了半分，巨傀眼眶红光暴闪，一记扫腿逼得你狼狈遁走。',
            effects: { hp: -190 },
          },
        },
      },
      {
        label: '绕行绝壁羊肠小径，避开关隘锋芒',
        hint: '耗一月 · 稳健穿行北荒',
        cost: { month: 1 },
        outcome: {
          text: '你御风贴着悬崖峭壁绕过白骨隘，途中反倒在一处鹰巢石缝里拾得几株千年灵草。',
          effects: { items: [{ id: 'qiannian_lingcao', qty: 2 }], expPct: 0.14 },
        },
      },
    ],
  },
  {
    id: 'wrh_bh_05',
    title: '北荒 · 血海试炼池',
    region: 'beihuang',
    pool: 'wild',
    tier: 4,
    weight: 3,
    minRealm: 3,
    maxRealm: 6,
    text: '赤岩溶洞深处沸腾着一汪丈许方圆的猩红血池，池水并非凡血，而是太古凶兽陨落后沉入地脉的精元煞液。池畔石壁刻满血海魔功的残缺口诀，煞气熏人欲醉，却又藏着淬炼肉身的莫大机缘。',
    choices: [
      {
        label: '褪去外袍入池淬体，以大毅力镇压血煞入骨',
        hint: '耗两月 · 根骨暴涨与血海法则，易生心魔',
        cost: { month: 2 },
        roll: {
          p: 0.58,
          attrs: { 根骨: 0.012, 道心: 0.012 },
          success: {
            text: '煞液如钢针透体，你紧守灵台一线清明，生生将一池精元炼入筋骨。出池之时气血如龙，杀伐之意大成。',
            effects: { expPct: 0.3, attrs: { 根骨: 6 }, lawExp: 65, lawId: 'blood', demon: 10 },
          },
          fail: {
            text: '血煞凶烈远超预料，煞气险些冲垮神府。你急忙跃出池面吐出一口淤血，心神躁动难平。',
            effects: { hp: -240, demon: 18, attrs: { 根骨: 2 } },
          },
        },
      },
      {
        label: '以玉瓶抽取池心凝晶，炼成血煞魔核带走',
        hint: '得血煞魔核与灵石',
        outcome: {
          text: '你隔空施展摄物诀，将池心浮沉的血晶封入玉匣，未沾染半分池中暴戾之气。',
          effects: { items: ['xuesha_jing'], stones: 1800, lawExp: 25, lawId: 'blood' },
        },
      },
      {
        label: '以冰心诀冻封血池，断绝魔修借此害人之路',
        hint: '清心积德 · 道心与业力大进',
        outcome: {
          text: '寒气席卷溶洞，沸腾血池瞬息化作玄冰。你心中顿觉通透，久积的微末心魔随之冰释。',
          effects: { karma: 55, demon: -22, attrs: { 道心: 5 }, expPct: 0.16 },
        },
      },
    ],
  },
  {
    id: 'wrh_bh_06',
    title: '北荒 · 魔渊悬棺',
    region: 'beihuang',
    pool: 'wild',
    tier: 4,
    weight: 3,
    minRealm: 3,
    maxRealm: 6,
    text: '万丈魔渊两侧绝壁间垂着数十条粗如水桶的玄铁巨链，链端悬着九口刻满饕餮纹的青铜古棺。罡风吹过，古棺彼此撞击发出沉闷钟鸣，最下方那口棺盖已裂开三寸缝隙，渗出幽冷灵光。',
    choices: [
      {
        label: '踏链而下，撬开青铜古棺一探究竟',
        hint: '战九幽勾魂使 · 胜则得古棺重宝',
        combat: {
          enemy: 'soul_reaper',
          win: {
            text: '你于铁链之上凌空斩灭破棺而出的勾魂使，自棺底取出一面万魂招煞幡与两粒化婴丹。',
            effects: { items: ['wanhun_fan', 'huaying_dan'], expPct: 0.26, stones: 3000 },
          },
          lose: {
            text: '铁链在罡风中剧烈摇晃，勾魂使锁链趁隙缠住你护盾，你震断灵索方才飞回崖顶。',
            effects: { hp: -250, injury: 1 },
          },
        },
      },
      {
        label: '立于崖边倾听古棺撞击之韵，参悟幽冥音律',
        hint: '耗一月 · 悟性与神识增长',
        cost: { month: 1 },
        outcome: {
          text: '九棺碰撞竟暗合上古招魂九宫之数。你静听三十日，识海空明，神识防御平添三分。',
          effects: { expPct: 0.18, attrs: { 神识: 4, 悟性: 3 }, lawExp: 35, lawId: 'karma' },
        },
      },
    ],
  },
  {
    id: 'wrh_bh_07',
    title: '北荒 · 赤剑孤冢',
    region: 'beihuang',
    pool: 'wild',
    tier: 4,
    weight: 3,
    minRealm: 3,
    maxRealm: 6,
    text: '赤土丘顶斜插着一柄三尺赤红断剑，剑身虽裂，方圆百丈却寸草不生、妖魔不敢近步。墓碑无字，唯有剑鸣随北风呜咽——昔年一位深入魔域孤军奋战的剑尊葬身于此，临终剑意化魔亦化仙。',
    choices: [
      {
        label: '以剑叩冢，与残存的血衣剑尊执念交手印证剑道',
        hint: '战血衣剑尊 · 胜则剑道大进',
        combat: {
          enemy: 'crimson_sword',
          win: {
            text: '三百剑影交错如雨，你终以一记堂皇正剑压散赤芒。剑冢微震，一道精纯太古剑意与剑魄通明丹自墓中升起。',
            effects: { items: ['jianyi_dan'], lawExp: 75, lawId: 'sword', attrs: { 根骨: 3, 悟性: 3 }, reputation: 70 },
          },
          lose: {
            text: '古剑尊执念凶悍无比，你连退九步护体剑气尽碎，却也记下了他那惊艳一剑的起手式。',
            effects: { hp: -240, lawExp: 30, lawId: 'sword' },
          },
        },
      },
      {
        label: '斟一碗烈酒浇于剑前，静坐观剑意三日',
        hint: '敬悼前辈 · 稳得剑道感悟与道心',
        outcome: {
          text: '酒气化作红雾漫过断剑，凄厉剑鸣渐趋平和。你盘坐三日，道心澄澈，剑意隐隐精进。',
          effects: { lawExp: 45, lawId: 'sword', attrs: { 道心: 4 }, karma: 25, demon: -12 },
        },
      },
    ],
  },
  {
    id: 'wrh_bh_08',
    title: '北荒 · 寒煞玄矿脉',
    region: 'beihuang',
    pool: 'wild',
    tier: 4,
    weight: 3,
    minRealm: 3,
    maxRealm: 6,
    text: '北荒冰裂谷深处裸露出一条长达百丈的幽黑矿脉，矿脉表面覆着一层霜白寒煞，细看之下竟夹杂着点点银亮星砂与九幽冥晶。远处似有两拨魔修为了争夺矿权正在暗中调兵。',
    choices: [
      {
        label: '趁两拨魔修未至，倾尽法力速掘矿心精华',
        hint: '根骨与气运检定 · 抢采星辰砂与九幽冥晶',
        roll: {
          p: 0.6,
          attrs: { 根骨: 0.012, 气运: 0.012 },
          success: {
            text: '你挥剑如犁，连破三层寒岩，在魔修遁光现于天际前将最精纯的星辰砂与冥晶尽数收入储物袋。',
            effects: { items: ['xingchen_sha', 'jiuyou_mingjing'], stones: 2200 },
          },
          fail: {
            text: '矿脉寒煞骤然喷发，冻伤你半边经脉。你匆匆抓起一块冥晶便飞身离谷。',
            effects: { items: ['jiuyou_mingjing'], hp: -175 },
          },
        },
      },
      {
        label: '在矿口暗布一重离间幻阵，坐观魔修自相残杀',
        hint: '悟性 ≥ 26 · 智取渔利',
        require: 'char.attrs.悟性 >= 26',
        requireHint: '悟性不足二十六，阵法易露破绽',
        cost: { month: 1 },
        outcome: {
          text: '两拨魔修入阵后互疑暗算，大打出手死伤惨重。你待尘埃落定现身收拾残局，满载而归。',
          effects: { stones: 4600, items: ['jiuyou_mingjing'], lawExp: 35, lawId: 'array', karma: -10 },
        },
      },
    ],
  },
  {
    id: 'wrh_bh_09',
    title: '北荒 · 妖将点兵台',
    region: 'beihuang',
    pool: 'world',
    tier: 4,
    weight: 3,
    minRealm: 3,
    maxRealm: 6,
    text: '黑石高台之上狼烟滚滚，一员身披玄甲的元婴妖将正在检阅三百披甲妖骑，似欲趁月黑南下劫掠边境仙城。点兵台后方停着三辆贴满封印符纸的辎重铁车。',
    choices: [
      {
        label: '擒贼先擒王，直扑点兵台斩杀妖将',
        hint: '战妖将 · 瓦解南下妖军',
        combat: {
          enemy: 'demon_general',
          win: {
            text: '你如天雷降世砸碎帅旗，妖将措手不及败亡台下。群妖群龙无首溃散奔逃，你顺手接管了三辆灵石辎重车。',
            effects: { stones: 5200, reputation: 100, karma: 45, items: ['yuanying_dan'] },
          },
          lose: {
            text: '妖军弓弩齐发配以妖将重斧，你寡不敌众负伤突围。',
            effects: { hp: -260, injury: 1 },
          },
        },
      },
      {
        label: '火焚辎重铁车后远遁，断妖军南下粮草',
        hint: '神识与气运检定 · 奇袭建功',
        roll: {
          p: 0.65,
          attrs: { 神识: 0.012, 气运: 0.01 },
          success: {
            text: '三道赤焰悄然落入车阵，轰鸣声中军资付之一炬。你趁乱顺手牵走一匣凝婴丹，扬长而去。',
            effects: { items: ['ningying_dan'], karma: 35, reputation: 65 },
          },
          fail: {
            text: '铁车外层竟有防焰禁制，惊动巡逻妖骑。你仓促施展遁术甩开追兵，只烧毁了半辆偏车。',
            effects: { hp: -150, reputation: 20 },
          },
        },
      },
    ],
  },
  {
    id: 'wrh_bh_10',
    title: '北荒 · 地脉归墟暗河',
    region: 'beihuang',
    pool: 'wild',
    tier: 4,
    weight: 3,
    minRealm: 3,
    maxRealm: 6,
    text: '北荒赤土之下竟横贯着一条不知源头的漆黑暗河，河水冰寒刺骨，带着东海归墟特有的咸腥水灵。水面忽起百丈漩涡，一头顺着地脉海眼游至此处的归墟巨鲲探出青黑背脊，吞吐着海量天地灵气！',
    choices: [
      {
        label: '迎战归墟巨鲲，夺其腹中积攒的万年海珍',
        hint: '战归墟巨鲲 · 极险重赏',
        combat: {
          enemy: 'abyss_leviathan',
          win: {
            text: '你以无匹神通破开巨鲲鳞甲，巨兽悲鸣潜入暗河深处，水面浮起一颗沧海定水珠与一瓶龙血精。',
            effects: { items: ['canghai_zhu', 'longxue_jing'], expPct: 0.3, reputation: 90 },
          },
          lose: {
            text: '巨鲲一吸便卷碎你的护体灵罡，你险些被暗流拖入地心海眼，拼尽灵力才挣脱上岸。',
            effects: { hp: -300, mpPct: -0.35, injury: 2 },
          },
        },
      },
      {
        label: '隐于岸畔巨石后，借巨鲲吐纳外溢的精纯水灵修炼',
        hint: '耗两月 · 修为与灵力稳步大涨',
        cost: { month: 2 },
        outcome: {
          text: '巨鲲每吞吐一口，岸畔便灵雾如潮。你默运功法截留外溢灵气六十日，修为一日千里。',
          effects: { expPct: 0.32, mpPct: 0.5, attrs: { 根骨: 3 } },
        },
      },
    ],
  },
  {
    id: 'wrh_bh_11',
    title: '北荒 · 哭魂风峡',
    region: 'beihuang',
    pool: 'wild',
    tier: 4,
    weight: 3,
    minRealm: 3,
    maxRealm: 6,
    text: '两座铁黑色峭壁夹出一条三十里长峡，常年呼啸着能直接切割修士神魂的「哭魂风」。风声时而似故人低语，时而如厉鬼索命，无数心智不坚的修士在此走火入魔，化作峡底白骨。',
    choices: [
      {
        label: '逆风步行穿越长峡，借哭魂风千锤百炼神魂',
        hint: '道心 ≥ 30 · 耗两月，神识与道心暴涨',
        require: 'char.attrs.道心 >= 30',
        requireHint: '道心不足三十，恐遭哭魂风吹散神魂',
        cost: { month: 2 },
        roll: {
          p: 0.62,
          attrs: { 道心: 0.012, 神识: 0.01 },
          success: {
            text: '你步步生莲，任狂风刮骨而灵台不动。走出风峡那刻，你只觉神魂通透如琉璃，心魔涤尽。',
            effects: { attrs: { 神识: 6, 道心: 6 }, demon: -25, expPct: 0.25 },
          },
          fail: {
            text: '行至峡心一阵诡风勾起往昔遗憾，你强咬舌尖稳住神魂，虽闯出峡口却元气微损。',
            effects: { hp: -180, demon: 10, attrs: { 道心: 2 } },
          },
        },
      },
      {
        label: '于峡口背风石洞静听风声，参悟空间裂风之理',
        hint: '耗一月 · 空间法则与悟性提升',
        cost: { month: 1 },
        outcome: {
          text: '你细辨哭魂风在峭壁间折返穿梭的轨迹，竟窥见一丝空间褶皱的奥妙。',
          effects: { lawExp: 50, lawId: 'space', attrs: { 悟性: 3 }, expPct: 0.16 },
        },
      },
    ],
  },
  {
    id: 'wrh_bh_12',
    title: '北荒 · 血宗叛徒托孤简',
    region: 'beihuang',
    pool: 'world',
    tier: 4,
    weight: 3,
    minRealm: 3,
    maxRealm: 6,
    text: '荒沙残庙内，一名肋插黑箭的元婴魔修倚柱喘息，见你推门而入，竟不反抗反倒惨然一笑：「道友若肯护我遁出三十里甩开血堂追兵，我愿将昔年从血海古窟偷出的《修罗战天录》拓本奉上。」',
    choices: [
      {
        label: '答应交易，替他挡下追杀而来的血海长老',
        hint: '战血海长老 · 得《修罗战天录》',
        combat: {
          enemy: 'blood_elder',
          win: {
            text: '你挥袖截断血海长老的血河神通，迫使其退走。那名叛徒守信递上血纹玉简，抱拳消失于荒漠。',
            effects: { items: ['yujian_xuesha'], expPct: 0.24, reputation: 40 },
          },
          lose: {
            text: '血海长老杀意滔天，你被逼退数十步，回头看时残庙早已人去楼空。',
            effects: { hp: -260, injury: 1 },
          },
        },
      },
      {
        label: '魔修之言不可轻信，只赠其一粒疗伤丹各奔前程',
        hint: '消耗疗伤丹 · 结善缘、明道心',
        require: 'has("liaoshang_dan")',
        requireHint: '行囊中无疗伤丹',
        cost: { item: 'liaoshang_dan' },
        outcome: {
          text: '你抛下一粒疗伤丹便转身离去。那魔修愣了片刻，将一袋灵石与一枚九幽冥晶掷于你脚边权作回礼。',
          effects: { items: ['jiuyou_mingjing'], stones: 1800, karma: 20, attrs: { 道心: 2 } },
        },
      },
      {
        label: '冷眼拒绝，任由魔门自行清理门户',
        hint: '明哲保身 · 避开无谓因果',
        outcome: {
          text: '你未插手魔门内斗，绕道离去。不久后天际传来轰鸣雷火，与你再无干系。',
          effects: { demon: -6, attrs: { 道心: 2 } },
        },
      },
    ],
  },
  {
    id: 'wrh_bh_13',
    title: '北荒 · 六十载血莲开',
    region: 'beihuang',
    pool: 'wild',
    tier: 4,
    weight: 3,
    minRealm: 3,
    maxRealm: 6,
    text: '枯死的盐碱沼泽深处，一株三尺赤莲恰逢甲子花期，十二瓣莲叶红如燃血，花蕊托着三滴晶莹赤露，药香飘散十里。沼泽四周已有数道妖兽赤瞳在黑雾中若隐若现。',
    choices: [
      {
        label: '先发制人斩退潜伏妖兽，采尽赤莲与花露',
        hint: '战妖将 · 夺取元婴灵药',
        combat: {
          enemy: 'demon_general',
          win: {
            text: '你剑气横扫沼泽，将伺机抢药的妖将重创击退，从容摘下整株血莲炼化出化婴丹与凝婴玉露丹。',
            effects: { items: ['huaying_dan', 'ningying_dan'], expPct: 0.22 },
          },
          lose: {
            text: '妖将借沼泽毒瘴猛扑，你无暇采药，只得拔身遁离泥潭。',
            effects: { hp: -220, injury: 1 },
          },
        },
      },
      {
        label: '仅以灵气摄取三滴赤露，留莲根以待后世花开',
        hint: '气运与神识检定 · 巧取精华',
        roll: {
          p: 0.64,
          attrs: { 神识: 0.012, 气运: 0.012 },
          success: {
            text: '三滴赤露化作红线飞入玉瓶，整株血莲毫发无损。花露入腹，你的法力与丹道感悟齐齐一涨。',
            effects: { expPct: 0.26, lawExp: 45, lawId: 'pill', karma: 20 },
          },
          fail: {
            text: '灵气波动惊动了沼底妖气，你只摄到半滴花露便急忙抽身。',
            effects: { expPct: 0.1, hp: -110 },
          },
        },
      },
    ],
  },
  {
    id: 'wrh_bh_14',
    title: '北荒 · 九幽盲叟渡口',
    region: 'beihuang',
    pool: 'world',
    tier: 4,
    weight: 3,
    minRealm: 3,
    maxRealm: 6,
    text: '一条灰雾弥漫的冥水横断北荒古道，渡口停着一叶无帆乌篷船。船头坐着一位双目蒙着黑布的枯瘦老叟，轻敲船舷道：「过河不收灵石，只收一缕尘缘执念，或换你行囊里的一段因果。」',
    choices: [
      {
        label: '斩出一缕心魔杂念作渡资，登船听老叟论因果',
        hint: '消心魔 · 悟因果法则，得凝婴玉露丹',
        cost: { month: 1 },
        outcome: {
          text: '老叟伸指自你眉心抽走一缕黑丝纳入油灯，船过灰雾时低语三句因果真言。登岸之际，你袖中多了一粒凝婴玉露丹。',
          effects: { demon: -28, lawExp: 60, lawId: 'karma', items: ['ningying_dan'], attrs: { 道心: 4 } },
        },
      },
      {
        label: '以两千灵石强买船上悬着的玄幽铜灯',
        hint: '2000 灵石 · 得九幽冥晶与神识进益',
        require: 'stones >= 2000',
        requireHint: '灵石不足两千',
        cost: { stones: 2000 },
        outcome: {
          text: '老叟嘿嘿一笑，将灯芯凝结的一块九幽冥晶与半卷神魂秘录递与你手，随即撑篙没入迷雾。',
          effects: { items: ['jiuyou_mingjing', 'yangshen_dan'], attrs: { 神识: 4 } },
        },
      },
      {
        label: '不登鬼船，直接御空强渡灰雾冥水',
        hint: '耗法力 · 磨砺空间与道心',
        outcome: {
          text: '你腾空百丈硬闯冥雾，虽耗去三成真元，却凭自身本事稳稳落于对岸。',
          effects: { mpPct: -0.3, expPct: 0.18, lawExp: 30, lawId: 'space', attrs: { 道心: 3 } },
        },
      },
    ],
  },
  {
    id: 'wrh_bh_15',
    title: '北荒 · 残破镇魔金塔',
    region: 'beihuang',
    pool: 'wild',
    tier: 4,
    weight: 3,
    minRealm: 3,
    maxRealm: 6,
    text: '红沙漫卷的荒原上斜矗着一座半塌的七层佛道古塔，塔身梵文金漆剥落大半，塔底黑烟正顺着裂口源源不断渗出。一名被镇压五百年的魔头残魂在塔内低笑，诱惑你揭去塔顶最后一道金符。',
    choices: [
      {
        label: '以自身真元重续金塔封禁，再压魔魂三百年',
        hint: '耗一月 · 大功德、得冰心雪莲丹与阵道感悟',
        cost: { month: 1 },
        outcome: {
          text: '金色符纹随你灵力逐层点亮，塔底魔啸渐弱。塔顶舍利龛弹开一格，赠你一粒冰心雪莲丹与正道护符。',
          effects: { items: ['bingxin_dan', 'poxie_fu'], karma: 70, reputation: 80, lawExp: 50, lawId: 'array', demon: -20 },
        },
      },
      {
        label: '破塔放魔再当场诛杀，夺其积攒百年的血煞道果',
        hint: '战血海长老 · 险中求大利',
        combat: {
          enemy: 'blood_elder',
          win: {
            text: '残魂刚脱困便遭你雷霆压制，连本命法宝都未及催动便形神俱灭。你收起塔底遗留的血煞魔核与大量灵石。',
            effects: { items: ['xuesha_jing', 'yuanying_dan'], stones: 3800, expPct: 0.28 },
          },
          lose: {
            text: '魔头虽困五百年凶焰仍炽，挣脱后反手重创于你，化作黑风逃遁无踪。',
            effects: { hp: -290, karma: -40, injury: 2 },
          },
        },
      },
    ],
  },
  {
    id: 'wrh_bh_16',
    title: '北荒 · 地火魔炉铸剑谷',
    region: 'beihuang',
    pool: 'wild',
    tier: 4,
    weight: 3,
    minRealm: 3,
    maxRealm: 6,
    text: '赤红岩浆自裂谷深处涌出，热浪扭曲长空。裂谷正中悬着一座上古魔修遗留的玄铁炼炉，炉火千年未熄，隐约可见一柄灵宝剑胚在岩浆火柱中沉浮，剑气与地火交缠如龙。',
    choices: [
      {
        label: '投入西陲磁砂与自身精血，借地火重淬灵宝剑胚',
        hint: '消耗星辰砂 · 稳得灵宝太虚斩虹剑',
        require: 'has("xingchen_sha")',
        requireHint: '行囊中无星辰砂',
        cost: { item: 'xingchen_sha', month: 2 },
        outcome: {
          text: '磁砂融化如银瀑浇于剑胚之上，六十日烈火淬炼后，一柄长虹饮血般的太虚斩虹剑破炉飞入手中！',
          effects: { items: ['taixu_jian'], lawExp: 55, lawId: 'sword', attrs: { 根骨: 3 } },
        },
      },
      {
        label: '借地火余温凝练自身真元，顺便体悟炼丹火候',
        hint: '耗一月 · 丹道法则与修为俱进',
        cost: { month: 1 },
        outcome: {
          text: '你盘坐裂谷石台，引一丝温顺地火洗炼丹田灵气，对文武火候的拿捏更入化境。',
          effects: { expPct: 0.22, lawExp: 50, lawId: 'pill', attrs: { 根骨: 2, 悟性: 2 } },
        },
      },
    ],
  },
  {
    id: 'wrh_bh_17',
    title: '北荒 · 枯骨夜戏台',
    region: 'beihuang',
    pool: 'wild',
    tier: 4,
    weight: 3,
    minRealm: 3,
    maxRealm: 6,
    text: '浓雾锁荒原，前方竟亮起两排大红灯笼，一座朱漆戏台凭空立于白骨堆上。台上十余名衣袂飘飘的修士正咿呀唱着一折《仙侣反目》，台下却空无一人——细看台上戏子，眼眸全无瞳仁，竟是执念所化的百年幻影。',
    choices: [
      {
        label: '坐于台下听完此折，以道心点破戏中执念',
        hint: '道心与魅力检定 · 渡化幻境得奇缘',
        roll: {
          p: 0.6,
          attrs: { 道心: 0.012, 魅力: 0.01 },
          success: {
            text: '曲终人散时你轻叹一声道破因果，台上红衣花旦盈盈下拜，戏台化作漫天荧光，独留一卷养神玉清丹与因果感悟。',
            effects: { items: ['yangshen_dan', 'bingxin_dan'], lawExp: 55, lawId: 'karma', demon: -20 },
          },
          fail: {
            text: '悲腔哀怨直入肺腑，你险些陷入幻戏之中。猛然咬牙震散雾气，却觉心神疲惫。',
            effects: { demon: 10, mpPct: -0.2 },
          },
        },
      },
      {
        label: '一剑劈碎灯笼戏台，破除幽冥迷阵',
        hint: '斩妖除幻 · 得灵石与道心',
        outcome: {
          text: '剑光过处朱漆化尘，雾气尽散。白骨堆底露出一只被遗忘的储物锦囊，内藏灵石与符纸。',
          effects: { stones: 2400, items: ['poxie_fu'], attrs: { 道心: 3 } },
        },
      },
    ],
  },
  {
    id: 'wrh_bh_18',
    title: '北荒 · 噬灵魔藤林',
    region: 'beihuang',
    pool: 'wild',
    tier: 4,
    weight: 3,
    minRealm: 3,
    maxRealm: 6,
    text: '方圆三十里遍布碗口粗的紫黑魔藤，藤身倒刺闪烁血芒，所触灵气皆被强行抽干。魔藤深处却隐隐透出一股雄浑生机，似有一截坠落于此的真龙血脉正在被群藤蚕食。',
    choices: [
      {
        label: '以雷火开道杀入藤林核心，夺取龙血真精',
        hint: '根骨与雷法检定 · 险取龙血精',
        roll: {
          p: 0.56,
          attrs: { 根骨: 0.012, 悟性: 0.01 },
          success: {
            text: '紫雷烈焰焚尽十里魔藤，你在藤心枯木下掘出一块温热如玉的龙血精，生机澎湃令人震撼。',
            effects: { items: ['longxue_jing'], expPct: 0.22, lawExp: 35, lawId: 'thunder' },
          },
          fail: {
            text: '魔藤缠绕如网，抽走你近三成灵力。你斩断主藤狼狈脱困，仅拾得几株千年灵草。',
            effects: { items: ['qiannian_lingcao'], hp: -160, mpPct: -0.3 },
          },
        },
      },
      {
        label: '退守林外，静观魔藤吸纳灵气之法反推吐纳诀',
        hint: '耗一月 · 修为与悟性稳涨',
        cost: { month: 1 },
        outcome: {
          text: '魔藤虽恶，其鲸吞天地灵气的脉络却颇有可取之处。你去芜存菁，闭关一月修为大进。',
          effects: { expPct: 0.25, attrs: { 悟性: 3 } },
        },
      },
    ],
  },
  {
    id: 'wrh_bh_19',
    title: '北荒 · 远征残碑剑林',
    region: 'beihuang',
    pool: 'wild',
    tier: 4,
    weight: 4,
    minRealm: 3,
    maxRealm: 6,
    text: '八百年前正道十宗远征北荒，十三位元婴剑修战死于此，临终各以本命剑气刻碑留法。如今石碑大多残缺风化，唯余三块仍萦绕着凌厉无匹的剑意，令过往魔云皆为之绕行。',
    choices: [
      {
        label: '立于三碑之前闭目参剑两月',
        hint: '耗两月 · 剑道法则与悟性暴涨',
        cost: { month: 2 },
        outcome: {
          text: '十三道风格迥异的绝世剑意在识海交锋互印。两月后你睁眼一划，指风竟将十丈外黑岩削作平镜。',
          effects: { lawExp: 80, lawId: 'sword', attrs: { 悟性: 4, 道心: 3 }, expPct: 0.22 },
        },
      },
      {
        label: '扶正倒塌残碑并设下防风小阵，告慰英灵',
        hint: '功德深厚 · 得剑意封灵符与声望',
        outcome: {
          text: '最后一块残碑扶正瞬间，碑缝跌出一枚封存完好的剑魄通明丹，似是英灵隔世相赠。',
          effects: { items: ['jianyi_dan'], karma: 55, reputation: 70, demon: -15 },
        },
      },
    ],
  },
  {
    id: 'wrh_bh_20',
    title: '北荒 · 血云废丹阁',
    region: 'beihuang',
    pool: 'wild',
    tier: 4,
    weight: 3,
    minRealm: 3,
    maxRealm: 6,
    text: '一座半塌的黑曜石高塔坐落于死火山口，塔内丹香混杂着刺鼻硫磺味。顶层一尊三足青铜丹炉仍在地火上微微震颤，炉盖封条早已焦黑，不知其中凝着的是绝世灵丹，还是走火入魔的毒煞废丹。',
    choices: [
      {
        label: '以丹道手法分火泄压，稳妥启炉取丹',
        hint: '悟性与神识检定 · 得高阶元婴宝丹',
        roll: {
          p: 0.6,
          attrs: { 悟性: 0.012, 神识: 0.012 },
          success: {
            text: '你掐诀引出三缕燥火，炉盖轻启刹那清香满阁——炉底静静躺着两枚火候圆满的化婴丹与元婴丹！',
            effects: { items: ['huaying_dan', 'yuanying_dan'], lawExp: 50, lawId: 'pill' },
          },
          fail: {
            text: '地火反冲炸裂炉壁，毒烟扑面而来。你急忙护体后退，只在灰烬中抢出一粒大还丹。',
            effects: { items: ['dahuan_dan'], hp: -190 },
          },
        },
      },
      {
        label: '不碰凶险丹炉，转而搜寻丹阁残存古方玉简',
        hint: '稳妥 · 丹道感悟与灵石',
        outcome: {
          text: '你在倾倒的玉架下寻得数卷《魔域奇药录》与几瓶上好药材，顺手带走不少灵石。',
          effects: { lawExp: 45, lawId: 'pill', stones: 1800, items: ['qiannian_lingcao'] },
        },
      },
    ],
  },
  {
    id: 'wrh_bh_21',
    title: '北荒 · 幽冥骨车游商',
    region: 'beihuang',
    pool: 'world',
    tier: 4,
    weight: 4,
    minRealm: 3,
    maxRealm: 6,
    text: '风沙漫漫的北荒古道上，两头无皮骨马拉着一辆黑漆篷车悠然行过。车帘挑起，露出一个戴着笑面铜具的怪商：「荒野相逢皆是有缘。老夫车上有几样正道坊市绝迹的奇货，道友可愿一观？」',
    choices: [
      {
        label: '出四千灵石，购入《周天星辰诀玉简》',
        hint: '4000 灵石 · 得地阶星辰秘典',
        require: 'stones >= 4000',
        requireHint: '灵石不足四千',
        cost: { stones: 4000 },
        outcome: {
          text: '铜面怪商清点灵石，将一枚银辉闪烁的玉简抛入你手，笑道：「祝道友早日引星入体。」',
          effects: { items: ['yujian_xingchen'], attrs: { 气运: 2 } },
        },
      },
      {
        label: '以一块血煞魔核交换凝婴玉露丹与大还丹',
        hint: '消耗血煞魔核 · 以魔易正',
        require: 'has("xuesha_jing")',
        requireHint: '行囊中无血煞魔核',
        cost: { item: 'xuesha_jing' },
        outcome: {
          text: '怪商嗅了嗅血煞魔核，甚是满意，痛快递出两瓶贴着丹霞封条的极品宝丹。',
          effects: { items: ['ningying_dan', 'dahuan_dan'], reputation: 25 },
        },
      },
      {
        label: '拱手辞谢，只向怪商打听近期北荒秘境风闻',
        hint: '无耗 · 增广见闻与神识',
        outcome: {
          text: '怪商随口说了几处血渊与古冢的禁制异动，言罢鞭响车去，转瞬隐没黄沙。',
          effects: { attrs: { 神识: 2, 悟性: 2 }, expPct: 0.12 },
        },
      },
    ],
  },
  {
    id: 'wrh_bh_22',
    title: '北荒 · 陨星焦坑',
    region: 'beihuang',
    pool: 'wild',
    tier: 4,
    weight: 3,
    minRealm: 3,
    maxRealm: 6,
    text: '昨夜一道白虹划破北荒血云，在黑石戈壁砸出方圆五里的巨坑。坑心焦岩仍在滋滋作响，天外陨星带来的纯粹星力竟将周遭十里的魔域煞气涤荡一空，璀璨银辉如水银泻地。',
    choices: [
      {
        label: '跃入焦坑核心，趁星华未散盘坐引星淬体',
        hint: '耗一月 · 星辰法则大涨，得星辰砂',
        cost: { month: 1 },
        outcome: {
          text: '你迎着炽热星辉盘坐三十日，只觉周身窍穴齐开，宛若星河流淌四肢，临行还收起两捧星辰砂。',
          effects: { lawExp: 70, lawId: 'star', items: [{ id: 'xingchen_sha', qty: 2 }], expPct: 0.26, attrs: { 根骨: 3 } },
        },
      },
      {
        label: '破开陨星外壳，探查其中是否裹挟上古遗物',
        hint: '气运检定 · 或得罕世奇珍',
        roll: {
          p: 0.55,
          attrs: { 气运: 0.014, 神识: 0.01 },
          success: {
            text: '外层焦铁碎裂，星核之中竟封着一枚周天星辉丹与一块法则残片！',
            effects: { items: ['xinghui_dan', 'faze_canpian'], attrs: { 气运: 3 } },
          },
          fail: {
            text: '星核早已在坠落时焚化殆尽，唯余数斤上好玄铁与一捧星辰砂。',
            effects: { items: ['xingchen_sha', 'xuantie'], stones: 1500 },
          },
        },
      },
    ],
  },
  {
    id: 'wrh_bh_23',
    title: '北荒 · 九柱锁骨蛟',
    region: 'beihuang',
    pool: 'wild',
    tier: 4,
    weight: 3,
    minRealm: 3,
    maxRealm: 6,
    text: '干涸的古湖湖底矗立着九根三丈高的赤铁镇龙柱，柱间玄索紧锁着一头鳞骨尽裂的冥海骨蛟。骨蛟已被困数百载，煞气虚弱却仍双目猩红，见生人靠近便掀起狂沙怒吼。',
    choices: [
      {
        label: '趁其受困出手伏诛，取其内丹与龙骨精粹',
        hint: '战冥海骨蛟 · 胜得龙血精与丰厚灵石',
        combat: {
          enemy: 'bone_dragon',
          win: {
            text: '你借九柱阵势步步紧逼，终将骨蛟彻底镇杀。残骸化散后，湖底留下一滴精纯龙血精与大量灵石。',
            effects: { items: ['longxue_jing'], stones: 3800, expPct: 0.25, karma: 20 },
          },
          lose: {
            text: '骨蛟困兽犹斗竟震断一根赤铁柱，暴虐龙息扫得你气血大损，急忙飞退湖岸。',
            effects: { hp: -270, injury: 1 },
          },
        },
      },
      {
        label: '细察九根赤铁柱上的太古锁龙阵铭文',
        hint: '耗一月 · 阵道法则与悟性大涨',
        cost: { month: 1 },
        outcome: {
          text: '你绕行湖底九柱，一笔一画拆解古仙锁龙禁制。满月而归，对困敌大阵的领悟豁然贯通。',
          effects: { lawExp: 65, lawId: 'array', attrs: { 悟性: 4, 神识: 3 }, expPct: 0.18 },
        },
      },
    ],
  },
  {
    id: 'wrh_bh_24',
    title: '北荒 · 煞风古驿息戈酒',
    region: 'beihuang',
    pool: 'world',
    tier: 4,
    weight: 4,
    minRealm: 3,
    maxRealm: 6,
    text: '漫天红沙之中，一座孤零零的石屋挂着半面「息戈驿」破旗。屋内炭火融融，竟坐着一名青衫剑修与一名黑袍魔老——两人修为皆深不可测，此刻却相安无事地分饮一坛烈酒，见你入屋便抬手示意同坐。',
    choices: [
      {
        label: '落座共饮三碗，听正魔二老漫谈大道同归',
        hint: '耗一月 · 道心与悟性双升，心魔大减',
        cost: { month: 1 },
        outcome: {
          text: '一夜风沙三碗烈酒，正魔之争在长生大道前竟显得如此渺小。临别之时，二老各赠你一道法则体悟。',
          effects: { attrs: { 道心: 5, 悟性: 4 }, demon: -22, lawExp: 50, lawId: 'karma', expPct: 0.2 },
        },
      },
      {
        label: '以一粒松鹤延寿丹换取二老压箱底的修行心得',
        hint: '消耗松鹤延寿丹 · 修为暴涨',
        require: 'has("yanshou_dan")',
        requireHint: '行囊中无松鹤延寿丹',
        cost: { item: 'yanshou_dan' },
        outcome: {
          text: '两位老祖眼眸微亮，倾囊相授各自压箱底的破境窍门，令你少走数十年弯路。',
          effects: { expPct: 0.45, breakBonus: 15, attrs: { 悟性: 5, 神识: 4 } },
        },
      },
      {
        label: '向二人抱拳致意，只讨一碗热茶歇脚便继续赶路',
        hint: '无耗 · 恢复状态',
        outcome: {
          text: '热茶下肚，风沙寒意尽消。你谢过二老，趁沙暴暂歇迈出石屋。',
          effects: { hpPct: 0.5, mpPct: 0.5, demon: -8 },
        },
      },
    ],
  },
  {
    id: 'wrh_bh_25',
    title: '北荒 · 血雨葬原避劫窟',
    region: 'beihuang',
    pool: 'wild',
    tier: 4,
    weight: 3,
    minRealm: 3,
    maxRealm: 6,
    text: '苍穹血云骤合，倾盆而下的竟是能腐蚀法宝灵光的血煞酸雨。你闪身躲入一处天然石窟，却发现窟壁早被前代修士刻满聚灵古阵，洞底更静静坐着一具玉化的古修坐化遗骸。',
    choices: [
      {
        label: '向遗骸三拜行礼，承接其膝前玉匣与手札',
        hint: '敬贤得宝 · 得化婴丹与阵道修为',
        outcome: {
          text: '你恭敬礼拜后启开玉匣，内藏一粒化婴丹、两千灵石与一卷避煞心得。雨歇之时，你顺手以土石掩埋遗骸。',
          effects: { items: ['huaying_dan'], stones: 2200, karma: 30, expPct: 0.18 },
        },
      },
      {
        label: '趁外间血雨滂沱，借洞壁古阵闭关淬炼元神两月',
        hint: '耗两月 · 修为与道心双丰收',
        cost: { month: 2 },
        outcome: {
          text: '外间血雨敲石如鼓，洞内古阵清光如洗。两月静修后，你的真元浑厚了一大截。',
          effects: { expPct: 0.32, attrs: { 道心: 4, 神识: 3 }, demon: -15 },
        },
      },
    ],
  },
  {
    id: 'wrh_bh_26',
    title: '北荒 · 机关战傀废工坊',
    region: 'beihuang',
    pool: 'wild',
    tier: 4,
    weight: 3,
    minRealm: 3,
    maxRealm: 6,
    text: '魔域边缘隐藏着一座被风沙半埋的巨型地宫，大厅中倒伏着数十尊锈蚀战傀，唯有正中铸台上一尊机关巨神傀因灵脉渗漏重新苏醒，正挥舞玄铁重锤砸毁残存玉架。',
    choices: [
      {
        label: '抢先出手镇压失控巨傀，保全玉架上的古修珍藏',
        hint: '战机关巨神傀 · 得重宝与灵石',
        combat: {
          enemy: 'iron_titan',
          win: {
            text: '你一击崩碎巨傀能源灵核，成功保住三层玉架。架上静放着一套伏羲八卦阵简与数袋上品灵石。',
            effects: { items: ['yujian_bagua', 'dahuan_dan'], stones: 3600, lawExp: 40, lawId: 'array' },
          },
          lose: {
            text: '巨傀重锤势如山崩，震塌半座地宫。你护住要害冲出烟尘，一无所获。',
            effects: { hp: -260, injury: 1 },
          },
        },
      },
      {
        label: '隔空摄取几块玄铁与灵核碎片便果断撤离',
        hint: '稳妥 · 得玄铁与灵石',
        outcome: {
          text: '你趁巨傀转身之际卷走几块上佳炼器玄铁与散落灵石，未与这尊铁疙瘩硬碰硬。',
          effects: { items: [{ id: 'xuantie', qty: 3 }], stones: 1600, expPct: 0.12 },
        },
      },
    ],
  },
  {
    id: 'wrh_bh_27',
    title: '北荒 · 子夜阴兵借道',
    region: 'beihuang',
    pool: 'world',
    tier: 4,
    weight: 3,
    minRealm: 3,
    maxRealm: 6,
    text: '子夜无星，荒原尽头忽然响起整齐划一的铁甲铿锵声。一队不见首尾的玄甲阴兵踏着幽蓝鬼火横贯原野，旌旗上赫然绣着早已覆灭三千年的太古皇朝徽记。领军阴帅冷冷睨向你藏身之处。',
    choices: [
      {
        label: '收敛气息退避三里，拱手目送太古英灵过境',
        hint: '敬畏古礼 · 得因果感悟与道心',
        outcome: {
          text: '阴帅微微颔首，大军肃穆过境未犯丝毫。待马蹄声远去，原地竟落下一枚铭刻古篆的九幽冥晶。',
          effects: { items: ['jiuyou_mingjing'], lawExp: 45, lawId: 'karma', attrs: { 道心: 3 }, karma: 20 },
        },
      },
      {
        label: '拔剑拦截断后勾魂使，追查阴兵所赴之地',
        hint: '战九幽勾魂使 · 探得古战场秘闻',
        combat: {
          enemy: 'soul_reaper',
          win: {
            text: '你斩散断后阴将，在其魂火残片中窥见北荒深处一处古仙战场坐标，并收获大量灵石。',
            effects: { stones: 3400, expPct: 0.25, attrs: { 神识: 4 }, counter: { secrets: 1 } },
          },
          lose: {
            text: '阴军煞阵合围如潮，你被锁魂链划伤灵脉，急忙借风遁逃出十里。',
            effects: { hp: -240, demon: 10 },
          },
        },
      },
    ],
  },
  {
    id: 'wrh_bh_28',
    title: '北荒 · 拦截魔宫密使',
    region: 'beihuang',
    pool: 'world',
    tier: 4,
    weight: 3,
    minRealm: 3,
    maxRealm: 6,
    text: '一道裹挟血雾的赤虹自你头顶急掠而过，遁光虽快却略显仓皇。你神识一扫，认出那是魔宫专司传递密诏的血衣剑使，其怀中玉筒隐隐散发着元婴宝丹与兵符气息。',
    choices: [
      {
        label: '纵剑截杀魔使，截获魔宫密诏与军资',
        hint: '战血衣剑尊 · 胜得重宝与大声望',
        combat: {
          enemy: 'crimson_sword', displayName: '血衣剑使',
          win: {
            text: '云海之中剑气纵横，你断其血遁秘术将其伏诛。打开玉筒，竟是一份魔军偷袭路线图与一粒元婴丹！',
            effects: { items: ['yuanying_dan', 'jiuxiao_leifu'], stones: 3500, reputation: 95, karma: 40 },
          },
          lose: {
            text: '魔使拼死燃血爆出绝杀一剑，重创你后头也不回地遁入黑云。',
            effects: { hp: -260, injury: 1 },
          },
        },
      },
      {
        label: '不惊动魔使，只以神识烙印密诏气息暗中报与正道',
        hint: '神识检定 · 稳得声望与贡献',
        roll: {
          p: 0.65,
          attrs: { 神识: 0.012, 气运: 0.01 },
          success: {
            text: '你无声截取半段传讯波动，转交附近正道哨站，轻松换得丰厚功劳与灵石酬谢。',
            effects: { stones: 2400, reputation: 65, contribution: 100, karma: 25 },
          },
          fail: {
            text: '血雾屏蔽神识极强，你未能截全讯息，只得目送赤虹远去。',
            effects: { attrs: { 神识: 2 } },
          },
        },
      },
    ],
  },
  {
    id: 'wrh_bh_29',
    title: '北荒 · 焚心赤泉',
    region: 'beihuang',
    pool: 'wild',
    tier: 4,
    weight: 3,
    minRealm: 3,
    maxRealm: 6,
    text: '黑色火山岩缝中涌出一口滚烫赤泉，泉水赤红如霞，升腾的蒸汽中竟夹杂着灼烧神魂的炽烈火毒。然泉底石蕊却生着几朵火中青莲，乃淬炼根骨、涤荡沉疴的绝佳灵泉。',
    choices: [
      {
        label: '运转真元硬抗火毒，坐入赤泉洗髓两月',
        hint: '耗两月 · 根骨与气血大涨',
        cost: { month: 2 },
        roll: {
          p: 0.6,
          attrs: { 根骨: 0.012, 道心: 0.01 },
          success: {
            text: '赤泉烈焰一遍遍冲刷筋骨，旧伤暗疾尽数化作黑垢排出体外。出泉之时你浑身轻盈，如脱凡胎。',
            effects: { attrs: { 根骨: 6, 道心: 3 }, heal: 2, expPct: 0.24, lifespan: 20 },
          },
          fail: {
            text: '火毒攻心险些灼伤经脉，你急忙跃出泉眼调息，幸好仍炼化了几分火灵精气。',
            effects: { hp: -170, expPct: 0.14, demon: 6 },
          },
        },
      },
      {
        label: '只采泉底火中青莲炼化为清心灵丹',
        hint: '得冰心雪莲丹与丹道感悟',
        outcome: {
          text: '你以剑气裹挟清水隔空摘下青莲，就地以真火收汁，竟炼出一粒极品冰心雪莲丹。',
          effects: { items: ['bingxin_dan'], lawExp: 45, lawId: 'pill', demon: -14 },
        },
      },
    ],
  },
  {
    id: 'wrh_bh_30',
    title: '北荒 · 万旗无风古战场',
    region: 'beihuang',
    pool: 'wild',
    tier: 4,
    weight: 3,
    minRealm: 3,
    maxRealm: 6,
    text: '方圆五十里的赤褐平原上，密密麻麻插着数以万计的残破战旗。此刻明明万里无风，所有断旗却一齐猎猎作响，沙场杀伐之气冲霄而起，化作肉眼可见的血色罡风。',
    choices: [
      {
        label: '步入旗阵中央，借万古战意磨砺血海或剑道法则',
        hint: '耗两月 · 血海与剑道感悟齐升',
        cost: { month: 2 },
        outcome: {
          text: '你在呼啸战意中枯坐六十日，耳畔仿佛重响千军厮杀之声。起身一啸，杀伐法则再上一层台阶。',
          effects: { lawExp: 75, lawId: 'blood', expPct: 0.26, attrs: { 根骨: 4 } },
        },
      },
      {
        label: '循着最强剑意搜寻古将遗兵',
        hint: '气运与神识检定 · 或得高阶战利',
        roll: {
          p: 0.56,
          attrs: { 气运: 0.012, 神识: 0.012 },
          success: {
            text: '你在帅旗废墟下掘出一柄尚未完全锈蚀的太虚斩虹剑，剑身仍萦绕不屈战魂！',
            effects: { items: ['taixu_jian'], reputation: 55 },
          },
          fail: {
            text: '古兵大多在岁月与煞气中化作铁粉，你仅拾得几块玄铁与一瓶锻骨龙象丹。',
            effects: { items: ['duangu_dan', 'xuantie'], stones: 1200 },
          },
        },
      },
    ],
  },
  {
    id: 'wrh_bh_31',
    title: '北荒 · 血月鬼王嫁女阵',
    region: 'beihuang',
    pool: 'wild',
    tier: 4,
    weight: 3,
    minRealm: 3,
    maxRealm: 6,
    text: '荒原雾起，唢呐声凄厉刺耳。八名纸人抬着一顶猩红大轿踏雾而来，轿帘微掀，露出一张倾国倾城却毫无生气的苍白面容。轿后十余丈外，一尊鬼王正隐在黑云中等待活人修士自投罗网。',
    choices: [
      {
        label: '一眼看穿诱饵，直接凌空斩向黑云中的鬼王',
        hint: '战鬼王 · 破局得宝',
        combat: {
          enemy: 'ghost_king',
          win: {
            text: '鬼王没料到你直奔本体而来，仓促接战被你打得魂飞魄散。红轿随之瓦解，掉落一枚驻颜宝丹与九幽冥晶。',
            effects: { items: ['zhuyan_dan', 'jiuyou_mingjing'], stones: 3000, karma: 35, reputation: 65 },
          },
          lose: {
            text: '唢呐迷音配以鬼王阴爪令你防不胜防，你震散纸人强行破雾脱身。',
            effects: { hp: -240, demon: 12 },
          },
        },
      },
      {
        label: '祭出九霄神雷符轰散仪仗，不留半分余地',
        hint: '消耗九霄神雷符 · 雷霆诛邪',
        require: 'has("jiuxiao_leifu")',
        requireHint: '行囊中无九霄神雷符',
        cost: { item: 'jiuxiao_leifu' },
        outcome: {
          text: '紫雷如天瀑倾泻，纸人红轿连同黑云鬼王顷刻灰飞烟灭，天地一片清朗。',
          effects: { karma: 60, reputation: 80, lawExp: 55, lawId: 'thunder', stones: 2600 },
        },
      },
    ],
  },
  {
    id: 'wrh_bh_32',
    title: '北荒 · 天雷涤魔谷',
    region: 'beihuang',
    pool: 'wild',
    tier: 4,
    weight: 3,
    minRealm: 3,
    maxRealm: 6,
    text: '北荒绝域之中竟有一座终年雷鸣不止的青石峡谷，九天紫电时不时劈落谷底，将一切魔域黑雾轰得一干二净。谷壁焦黑古木间，隐约可见雷液汇成的晶莹小潭。',
    choices: [
      {
        label: '冒着天雷余威潜入谷底，汲取雷液淬炼元婴',
        hint: '耗两月 · 雷霆法则与根骨暴涨',
        cost: { month: 2 },
        roll: {
          p: 0.6,
          attrs: { 根骨: 0.012, 道心: 0.01 },
          success: {
            text: '紫电绕身而走，你以雷液洗去一身魔域阴煞，更顺手凝成一粒紫霄雷元丹。',
            effects: { items: ['leiyuan_dan'], lawExp: 70, lawId: 'thunder', attrs: { 根骨: 4 }, demon: -20 },
          },
          fail: {
            text: '一道偏雷擦着发梢劈下，震得你浑身焦麻，只得退回谷口调息。',
            effects: { hp: -210, lawExp: 25, lawId: 'thunder' },
          },
        },
      },
      {
        label: '在谷口收集被天雷劈过的万年雷击木',
        hint: '稳妥 · 得雷击木与九霄神雷符',
        outcome: {
          text: '你沿着谷缘细细寻觅，收获两截灵韵十足的雷击木，并借残余雷气画成一张神雷符。',
          effects: { items: [{ id: 'leimu', qty: 2 }, 'jiuxiao_leifu'], expPct: 0.16 },
        },
      },
    ],
  },
  {
    id: 'wrh_bh_33',
    title: '北荒 · 肋骨桥问剑',
    region: 'beihuang',
    pool: 'world',
    tier: 4,
    weight: 3,
    minRealm: 3,
    maxRealm: 6,
    text: '跨越千丈黑壑的天然骨桥中央，盘坐着一名赤袍染尘的独臂剑修。他身前横着一柄血色古剑，见你踏桥而来，缓缓抬眸：「吾名血鸿，困于瓶颈三百年。阁下若肯与我倾力一剑，胜负皆有厚赠。」',
    choices: [
      {
        label: '应下问剑之约，与血鸿倾力一战',
        hint: '战血衣剑尊 · 胜则剑道大成、得厚礼',
        combat: {
          enemy: 'crimson_sword', displayName: '独臂剑修血鸿',
          win: {
            text: '双剑交鸣震落崖石，血鸿大笑三声收剑归鞘：「痛快！这一剑让我看见了破境的门径！」言罢赠你剑魄通明丹与灵石。',
            effects: { items: ['jianyi_dan', 'ningying_dan'], stones: 3200, lawExp: 65, lawId: 'sword', reputation: 85 },
          },
          lose: {
            text: '血鸿一剑如虹斩断你的护身剑幕，却在咽喉三寸处稳稳收势，拱手叹道：「道友剑心尚需再磨。」',
            effects: { hp: -200, lawExp: 35, lawId: 'sword', attrs: { 道心: 3 } },
          },
        },
      },
      {
        label: '不以兵刃相向，与他坐于桥头以指画空论剑三日',
        hint: '耗一月 · 悟性与剑道稳进',
        cost: { month: 1 },
        outcome: {
          text: '二人以指为剑、以风为谱，在骨桥之上推演百余招杀伐变化。三日后血鸿抚掌离去，你亦获益匪浅。',
          effects: { lawExp: 55, lawId: 'sword', attrs: { 悟性: 4, 道心: 2 }, expPct: 0.18 },
        },
      },
    ],
  },
  {
    id: 'wrh_bh_34',
    title: '北荒 · 九州镇界古碑',
    region: 'beihuang',
    pool: 'world',
    tier: 4,
    weight: 3,
    minRealm: 3,
    maxRealm: 6,
    text: '北荒与中州交界处矗立着一座十丈白玉镇界碑，碑身布满刀劈斧凿的魔爪深痕，却仍稳如泰山，源源不断散出护佑九州的清正灵韵。数名游历至此的散修正在碑前静坐调息。',
    choices: [
      {
        label: '注入自身精纯法力温养界碑灵纹',
        hint: '护佑九州 · 得厚重功德、声望与心魔涤荡',
        outcome: {
          text: '白玉古碑嗡鸣回应，一道温润清辉反哺你周身经脉，北荒行旅积攒的血煞戾气一扫而空。',
          effects: { karma: 65, reputation: 75, demon: -28, attrs: { 道心: 4 }, expPct: 0.18 },
        },
      },
      {
        label: '于碑下闭关一月，临摹太古阵纹与空间封界法',
        hint: '耗一月 · 阵道与空间法则感悟',
        cost: { month: 1 },
        outcome: {
          text: '镇界碑实为一座缩小版的护州大阵。你凝神参悟三十日，对空间封锁与阵法呼应多有心得。',
          effects: { lawExp: 60, lawId: 'space', attrs: { 悟性: 3, 神识: 3 }, expPct: 0.2 },
        },
      },
    ],
  },

  /* ============================================================================
   * 二、中州圣域（zhongzhou，45 节点，minRealm: 4, maxRealm: 7）
   * ============================================================================ */

  // ---------- 链一：中州问道大比（4 段） ----------
  {
    id: 'wrh_zz_tourney_1',
    title: '中州 · 白玉京问道大比启幕',
    region: 'zhongzhou',
    pool: 'world',
    tier: 5,
    weight: 4,
    minRealm: 4,
    maxRealm: 7,
    once: true,
    text: '中州圣域白玉京钟鸣九响，三百六十座浮空青玉擂台在祥云间依次升起。九州各宗化神、炼虚天骄齐聚仙都，御街之上剑虹如织、宝光冲霄。\n\n司礼长老凌空展卷，声震百里：「今岁问道大比，不拘正魔散修，凡能过三关登临天枢玉台者，赐圣域重宝、准入太古法则碑林参悟！」',
    choices: [
      {
        label: '递上名帖踏上剑台，以实力搏取头筹',
        hint: '战太古剑灵残影 · 闯大比初试',
        cost: { month: 1 },
        combat: {
          enemy: 'sword_phantom',
          win: {
            text: '初试镇台剑灵被你十招斩散，满场惊呼四起。司礼长老颔首提笔，将你的名讳高高悬于玉榜前列。',
            effects: { reputation: 110, expPct: 0.24, lawExp: 45, lawId: 'sword', flag: { 中州大比晋级: true } },
            goto: 'wrh_zz_tourney_2',
          },
          lose: {
            text: '太古剑灵锋芒太盛，你衣袖尽裂被逼落玉台，虽止步初试，却也看清了中州天骄的底蕴。',
            effects: { hp: -320, lawExp: 25, lawId: 'sword', reputation: 25 },
          },
        },
      },
      {
        label: '先登万象文坛以大道义理夺魁，免战入复赛',
        hint: '悟性 ≥ 34 · 文斗惊四座',
        require: 'char.attrs.悟性 >= 34',
        requireHint: '悟性不足三十四，难压万象书院众儒',
        cost: { month: 1 },
        roll: {
          p: 0.62,
          attrs: { 悟性: 0.012, 道心: 0.01 },
          success: {
            text: '你从五行生克论至虚空生灭，言辞如珠玑落地，连万象书院首席亦起身长揖。主考当即特许你直入复试！',
            effects: { reputation: 120, attrs: { 悟性: 4, 道心: 3 }, flag: { 中州文坛魁首: true } },
            goto: 'wrh_zz_tourney_2',
          },
          fail: {
            text: '书院大儒引经据典步步紧逼，你险些词穷，只得以旁听客身份退居观礼席。',
            effects: { attrs: { 悟性: 2 }, expPct: 0.14 },
          },
        },
      },
      {
        label: '不入擂台争锋，只在观礼云台观摩各州绝学',
        hint: '耗一月 · 稳健吸收百家之长',
        cost: { month: 1 },
        outcome: {
          text: '你居高临下细观百场化神斗法，把剑阵、雷法与空间挪移的衔接拆解得明明白白。',
          effects: { expPct: 0.22, attrs: { 悟性: 3, 神识: 3 }, lawExp: 35, lawId: 'array' },
        },
      },
    ],
  },
  {
    id: 'wrh_zz_tourney_2',
    title: '中州 · 镜心台暗算',
    region: 'zhongzhou',
    pool: 'branch',
    tier: 5,
    weight: 0,
    text: (s) => `大比复试设于「镜心幻台」，需在古阵映出的千重虚妄中稳守道心。${s.flags['中州文坛魁首'] ? '你文坛夺魁招来世家嫉恨，' : '你初试锋芒毕露，'}刚入阵中便觉阴风袭神——竟有暗中作梗者将一尊幻界心魔尊引渡进了你的试炼阵眼！`,
    choices: [
      {
        label: '将计就计，当场斩杀幻界心魔尊震慑宵小',
        hint: '战幻界心魔尊 · 胜则直入天枢终战',
        combat: {
          enemy: 'mirror_demon',
          win: {
            text: '你道心如磐，反借镜心台清光将心魔尊逼出原形一举绞杀！观礼台上的大能们纷纷变色，当场查办了暗中动手的世家执事。',
            effects: { reputation: 140, demon: -30, attrs: { 道心: 5 }, flag: { 镜台破暗算: true } },
            goto: 'wrh_zz_tourney_3',
          },
          lose: {
            text: '心魔尊幻象层出不穷，你心神失守吐血跌出镜心台，虽性命无忧，却错失后续机缘。',
            effects: { hp: -360, demon: 18, injury: 1 },
          },
        },
      },
      {
        label: '以因果大道反溯阵眼丝线，将心魔反送回暗算者席间',
        hint: '道心 ≥ 38 且神识 ≥ 35 · 因果反噬',
        require: 'char.attrs.道心 >= 38 && char.attrs.神识 >= 35',
        requireHint: '道心或神识不足，难逆转心魔牵引',
        roll: {
          p: 0.65,
          attrs: { 道心: 0.01, 神识: 0.01 },
          success: {
            text: '你弹指拨动冥冥中的因果线，黑雾倒卷飞向贵宾席，那名世家公子当场失态狂笑，丑态毕露！满座哗然，你稳步晋级。',
            effects: { lawExp: 65, lawId: 'karma', reputation: 150, demon: -25, flag: { 因果反噬宵小: true } },
            goto: 'wrh_zz_tourney_3',
          },
          fail: {
            text: '因果反噬未竟全功，你强行震散镜台雾气保住晋级资格，神魂略受震荡。',
            effects: { hp: -220, demon: 8 },
            goto: 'wrh_zz_tourney_3',
          },
        },
      },
    ],
  },
  {
    id: 'wrh_zz_tourney_3',
    title: '中州 · 天枢台战剑圣残影',
    region: 'zhongzhou',
    pool: 'branch',
    tier: 5,
    weight: 0,
    text: '终战之日，万里长空碧洗如玉。最高的天枢玉台之上并无活人对手，白玉京之主亲手启封了一道万年前炼虚剑圣留下的无上道影。那道白衣残影缓缓抬剑，整座仙都十万柄佩剑齐齐嗡鸣出鞘三寸！',
    choices: [
      {
        label: '倾尽毕生所学，与陨落剑圣影堂堂正正决胜天枢',
        hint: '战陨落剑圣影 · 问鼎中州第一',
        combat: {
          enemy: 'blade_saint_shade',
          win: {
            text: '云海为之劈开百里！你硬接剑圣九式绝斩后反手一击碎其道影，残影散去前竟向你微微颔首。白玉京瞬间沸腾！',
            effects: { expPct: 0.36, reputation: 220, lawExp: 80, lawId: 'sword', flag: { 中州大比夺魁: true } },
            goto: 'wrh_zz_tourney_4',
          },
          lose: {
            text: '你与剑圣影鏖战三百回合终惜败半招。虽未登顶，圣主仍赞你风骨非凡，赐你观礼厚赠。',
            effects: { hp: -420, reputation: 100, lawExp: 45, lawId: 'sword' },
            goto: 'wrh_zz_tourney_4',
          },
        },
      },
      {
        label: '不求击碎剑圣道影，只求在其威压下撑过百息以证道心',
        hint: '稳健应战 · 根骨与道心检定',
        roll: {
          p: 0.64,
          attrs: { 根骨: 0.01, 道心: 0.012 },
          success: {
            text: '漫天剑雨落下，你如礁石屹立百息不退一步。香尽钟鸣，剑圣影收剑散去，四方长老无不抚须称叹。',
            effects: { expPct: 0.28, reputation: 150, attrs: { 根骨: 5, 道心: 5 }, flag: { 天枢台守百息: true } },
            goto: 'wrh_zz_tourney_4',
          },
          fail: {
            text: '第八十息时剑威骤暴，你被震退台沿，然此番历练已令你的护体真元凝实数分。',
            effects: { hp: -290, reputation: 80, attrs: { 道心: 3 } },
            goto: 'wrh_zz_tourney_4',
          },
        },
      },
    ],
  },
  {
    id: 'wrh_zz_tourney_4',
    title: '中州 · 圣殿赐宝名动九州',
    region: 'zhongzhou',
    pool: 'branch',
    tier: 5,
    weight: 0,
    text: (s) => `问道大比尘埃落定，白玉京圣殿内钟磬悠扬。${s.flags['中州大比夺魁'] ? '你力压九州英杰夺得大比魁首，圣主亲自捧出三件镇殿奇珍任你择一：' : '你在天枢玉台展现出的风采深得圣域赞赏，执事长老奉上玉盘请你择取赏赐：'}星河羽扇、镇狱古钟，抑或《天机因果秘录》与化神宝丹。`,
    choices: [
      {
        label: '择取天阶灵宝「星河羽扇」与周天星辉丹',
        hint: '攻守兼备 · 星辰灵宝与荣耀称号',
        outcome: {
          text: '星河羽扇入手轻若无物，一挥之间漫天星辉如瀑。你拜别圣殿，自此中州无人不识君名。',
          effects: { items: ['xinghe_shan', 'xinghui_dan'], stones: 8000, reputation: 160, title: '中州问鼎魁首', counter: { secrets: 1 } },
        },
      },
      {
        label: '择取「镇狱古钟」与太虚炼神丹，厚积薄发',
        hint: '重宝护道 · 防御灵宝与炼虚圣丹',
        outcome: {
          text: '玄黄古钟低鸣一声没入你袖中，厚重镇压之气令周身法力愈发稳固。',
          effects: { items: ['donghuang_zhong', 'lianxu_dan'], stones: 6500, reputation: 150, title: '白玉京座上宾', counter: { secrets: 1 } },
        },
      },
      {
        label: '择取《天机因果秘录》与法则残片，直指大道本源',
        hint: '秘典悟道 · 天阶因果玉简与法则残片',
        outcome: {
          text: '你接过无字天书般的因果秘录，圣主微笑颔首：「不恋器物而求大道，阁下他日必登九霄。」',
          effects: { items: ['yujian_yinguo', 'faze_canpian'], lawExp: 80, lawId: 'karma', reputation: 160, title: '圣域论道尊', counter: { secrets: 1 } },
        },
      },
    ],
  },

  // ---------- 链二：观星高塔秘谋（4 段） ----------
  {
    id: 'wrh_zz_star_1',
    title: '中州 · 观星塔星轨逆乱',
    region: 'zhongzhou',
    pool: 'world',
    tier: 5,
    weight: 4,
    minRealm: 4,
    maxRealm: 7,
    once: true,
    text: '中州极西的九层观星古塔今夜异象频生——本应顺时针运转的周天星盘竟陡然倒转，紫微星芒暗淡无光，一道隐秘银柱直刺云霄之外。\n\n塔外守卫却尽数面色木然，仿佛被无形神念篡改了灵智。你神识微动，隐约听见塔顶传来不属于下界语调的冷傲对话。',
    choices: [
      {
        label: '趁夜潜入观星塔底层，查探星轨逆乱之由',
        hint: '神识与气运检定 · 潜入古塔',
        roll: {
          p: 0.6,
          attrs: { 神识: 0.012, 气运: 0.01 },
          success: {
            text: '你借星影盲区无声穿过三层禁制，在阶梯暗壁上发现被人强行刻下的上界接引符纹。',
            effects: { lawExp: 45, lawId: 'star', attrs: { 神识: 3 }, flag: { 潜入观星塔: true } },
            goto: 'wrh_zz_star_2',
          },
          fail: {
            text: '禁制警铃骤响，数道星光箭矢贴身掠过。你硬破塔门冲入中层，惊动了塔内守卫。',
            effects: { hp: -220, flag: { 强闯观星塔: true } },
            goto: 'wrh_zz_star_2',
          },
        },
      },
      {
        label: '直接亮明化神以上威压，正面登塔质问星官',
        hint: '堂堂正正 · 步入塔中正殿',
        outcome: {
          text: '你一步跨出百丈，长啸震醒门外昏沉守卫，大步迈入星光璀璨的塔内大殿。',
          effects: { reputation: 50, attrs: { 道心: 3 }, flag: { 强闯观星塔: true } },
          goto: 'wrh_zz_star_2',
        },
      },
      {
        label: '暂不贸然登塔，只于塔外截留一丝逸散星华参悟',
        hint: '明哲保身 · 星辰法则小进',
        outcome: {
          text: '你深知涉及上界之事必有大凶险，在百丈外静吸星华三日便悄然退走。',
          effects: { lawExp: 40, lawId: 'star', expPct: 0.16 },
        },
      },
    ],
  },
  {
    id: 'wrh_zz_star_2',
    title: '中州 · 青铜星卫镇天阶',
    region: 'zhongzhou',
    pool: 'branch',
    tier: 5,
    weight: 0,
    text: (s) => `登上观星塔第五层，周天星图化作实质星河在头顶流转。${s.flags['强闯观星塔'] ? '警报大作，两尊沉眠千年的青铜守卫已持戈列阵，' : '你刚欲踏上六层玉阶，角落里一尊镶满星辰砂的青铜巨人骤然睁开银眸，'}沉声轰鸣：「非持星君法旨者，止步！」`,
    choices: [
      {
        label: '正面击溃观星古守卫，强闯第七层密室',
        hint: '战观星古守卫 · 夺路登顶',
        combat: {
          enemy: 'star_golem',
          win: {
            text: '星河灵力崩裂四散，你一击击碎青铜守卫胸口星核。巨人单膝跪地熄灭银光，通往塔顶的玉门轰然洞开。',
            effects: { expPct: 0.28, items: ['xingchen_sha'], stones: 5200 },
            goto: 'wrh_zz_star_3',
          },
          lose: {
            text: '青铜巨人防御如铁壁，一记重戟将你砸退三层阶梯。你呕血退出古塔，夜风冷冽刺骨。',
            effects: { hp: -350, injury: 2 },
          },
        },
      },
      {
        label: '以星辰法则共鸣星图，令青铜守卫误认己为星官',
        hint: '星辰法则 ≥ 1 或悟性 ≥ 38 · 智过星关',
        require: 'law("star") >= 1 || char.attrs.悟性 >= 38',
        requireHint: '需初窥星辰法则或悟性达到三十八',
        roll: {
          p: 0.66,
          attrs: { 悟性: 0.012, 神识: 0.01 },
          success: {
            text: '你指尖勾勒出北斗七星古印，青铜守卫银眸闪烁片刻，竟缓缓收戈侧身让出玉阶！',
            effects: { lawExp: 55, lawId: 'star', attrs: { 悟性: 3 }, flag: { 智过星卫: true } },
            goto: 'wrh_zz_star_3',
          },
          fail: {
            text: '古印差了一丝真意，青铜守卫震戟扫来，你硬扛一击借势窜入上层石门。',
            effects: { hp: -260 },
            goto: 'wrh_zz_star_3',
          },
        },
      },
    ],
  },
  {
    id: 'wrh_zz_star_3',
    title: '中州 · 上界巡使盗星脉',
    region: 'zhongzhou',
    pool: 'branch',
    tier: 5,
    weight: 0,
    text: '观星塔绝顶罡风猎猎，一名身披银甲的上界巡查使正以一座玉钵强行抽取中州九条主星脉的本源星髓！塔畔两名中州大星官已被其法旨定身不得动弹。\n\n见你现身，银甲巡使冷笑俯瞰：「下界蝼蚁也敢窥伺上界征税？跪下磕头，饶你元神不灭。」',
    choices: [
      {
        label: '「下界灵脉，岂容尔等私盗！」——拔剑血战巡查使',
        hint: '战上界巡查使 · 极险，护佑中州气运',
        combat: {
          enemy: 'heaven_envoy',
          win: {
            text: '银甲碎裂，法旨化灰！你一击震飞玉钵，将狂傲的上界巡查使重创逼得撕裂虚空狼狈逃回上界！九条星脉如龙归位。',
            effects: { expPct: 0.38, reputation: 260, karma: 100, attrs: { 道心: 8 }, flag: { 击退盗脉巡使: true } },
            goto: 'wrh_zz_star_4',
          },
          lose: {
            text: '上界巡使天威如山，一道星印将你轰下九层高塔。你摔落云海重伤垂危，只见银光一闪，那人已卷走半数星髓。',
            effects: { hp: -460, injury: 2, reputation: 60 },
          },
        },
      },
      {
        label: '不硬拼天威，趁其全神催动玉钵时直碎接引银柱',
        hint: '神识 ≥ 38 · 破阵逼退巡使',
        require: 'char.attrs.神识 >= 38',
        requireHint: '神识不足三十八，难觅接引银柱弱点',
        roll: {
          p: 0.62,
          attrs: { 神识: 0.012, 气运: 0.01 },
          success: {
            text: '你祭出全力轰断星盘核心银柱，接引通道骤然崩塌！巡使惧怕滞留凡间遭天地反噬，怒吼一声只得弃钵遁回上界。',
            effects: { reputation: 190, karma: 80, lawExp: 65, lawId: 'space', flag: { 毁柱逐巡使: true } },
            goto: 'wrh_zz_star_4',
          },
          fail: {
            text: '银柱只裂开半道缝隙，巡使反手一掌震得你吐血倒飞，好在接引已受干扰，他匆匆收手离去。',
            effects: { hp: -340, reputation: 90, karma: 40 },
            goto: 'wrh_zz_star_4',
          },
        },
      },
    ],
  },
  {
    id: 'wrh_zz_star_4',
    title: '中州 · 星盘复明受厚赠',
    region: 'zhongzhou',
    pool: 'branch',
    tier: 5,
    weight: 0,
    text: '九层观星古塔恢复朗朗星辉，重获自由的两位白发星官长揖到地：「若非道友挺身而出，中州百年星运险遭窃尽！此间巡使遗落的星髓玉钵与本阁珍藏，尽请道友笑纳。」',
    choices: [
      {
        label: '收下周天星辉丹、法则残片与《周天星辰诀玉简》',
        hint: '星辰大丰收 · 得称号「护星尊者」',
        outcome: {
          text: '星髓入体，周天星辰似与你呼吸共鸣。自这一夜起，中州观星阁将你尊为护星大客卿。',
          effects: { items: ['xinghui_dan', 'faze_canpian', 'yujian_xingchen'], lawExp: 85, lawId: 'star', reputation: 180, title: '护星尊者', counter: { secrets: 1 } },
        },
      },
      {
        label: '将星髓反哺中州星脉，只借观星顶层独悟半年',
        hint: '耗半年 · 全属性与星辰大道飞跃',
        cost: { month: 6 },
        outcome: {
          text: '你将整钵星髓倾回星盘，天地功德轰然垂落。随后半年闭关塔顶，你举手投足皆带星河气象。',
          effects: { expPct: 0.5, lawExp: 110, lawId: 'star', attrs: { 悟性: 7, 神识: 6, 道心: 5 }, karma: 110, title: '中州定星客', counter: { secrets: 1 } },
        },
      },
    ],
  },

  // ---------- 链三：裂界虚空封隙（3 段） ----------
  {
    id: 'wrh_zz_rift_1',
    title: '中州 · 玉带江上裂虚空',
    region: 'zhongzhou',
    pool: 'wild',
    tier: 5,
    weight: 4,
    minRealm: 4,
    maxRealm: 7,
    once: true,
    text: '浩荡玉带江上空毫无征兆地裂开一道三十丈漆黑缝隙，江水竟违背常理倒卷入天！裂缝边缘空间扭曲如破碎琉璃，数道隐于虚实夹缝中的诡谲暗影正顺着裂口渗入人间，两岸城郭警钟大作。',
    choices: [
      {
        label: '踏浪凌空，截杀率先钻出裂隙的裂界暗影',
        hint: '战裂界暗影 · 稳住江面战线',
        combat: {
          enemy: 'void_stalker',
          win: {
            text: '你识破其虚空折跃之法，一击将暗影钉死在浪涛之上。暗影消散，凝出一块虚空晶碎片，转眼便在江风中化作齑粉。',
            effects: { expPct: 0.25, lawExp: 45, lawId: 'space', reputation: 80, flag: { 玉江斩暗影: true } },
            goto: 'wrh_zz_rift_2',
          },
          lose: {
            text: '暗影神出鬼没，在你肋下划开一道蕴含空间割裂的伤痕。你急退江岸调息，错失封隙良机。',
            effects: { hp: -320, injury: 2 },
          },
        },
      },
      {
        label: '以精纯法力先于江面布下四象封界阵，延缓裂隙扩张',
        hint: '阵道或空间检定 · 稳控大局',
        roll: {
          p: 0.62,
          attrs: { 悟性: 0.012, 神识: 0.012 },
          success: {
            text: '四道清光柱自江心冲天而起，倒卷的江水霎时平息。裂隙虽未闭合，暗影却已难越雷池半步。',
            effects: { lawExp: 55, lawId: 'array', karma: 45, flag: { 江面布封阵: true } },
            goto: 'wrh_zz_rift_2',
          },
          fail: {
            text: '空间乱流撕毁了半边阵基，你强行稳住阵脚，随即感到一股更恐怖的域外魔威自裂隙深处探来。',
            effects: { hp: -210, mpPct: -0.25 },
            goto: 'wrh_zz_rift_2',
          },
        },
      },
    ],
  },
  {
    id: 'wrh_zz_rift_2',
    title: '中州 · 域外虚空魔破界',
    region: 'zhongzhou',
    pool: 'branch',
    tier: 5,
    weight: 0,
    text: (s) => `${s.flags['江面布封阵'] ? '封界清光剧烈震颤，' : '漆黑裂隙猛然暴涨三倍，'}一只无形无相、却令天地法则齐齐哀鸣的域外虚空魔硬生生挤出半个身躯！它周身浮现万千坍塌小界虚影，所过之处连灵气本身都被吞噬一空！`,
    choices: [
      {
        label: '以身作阵眼硬撼域外虚空魔，将其打回界海',
        hint: '战域外虚空魔 · 炼虚级生死恶战',
        combat: {
          enemy: 'void_fiend',
          win: {
            text: '你引动周身大道法则轰入魔躯核心，域外虚空魔发出无声尖啸，被硬生生轰回黑暗界海深处！',
            effects: { expPct: 0.36, reputation: 180, karma: 85, lawExp: 75, lawId: 'space', flag: { 斩退虚空魔: true } },
            goto: 'wrh_zz_rift_3',
          },
          lose: {
            text: '虚空魔吞噬法则之力太过诡异，你神通大半落空，吐血坠落江堤，好在圣域大能闻讯赶至将其逼退。',
            effects: { hp: -420, injury: 2, reputation: 50 },
          },
        },
      },
      {
        label: '抛出一块虚空晶引爆空间坍缩，强行合拢界壁',
        hint: '消耗虚空晶 · 以空补空，绝境封魔',
        require: 'has("xukong_jing")',
        requireHint: '行囊中无虚空晶',
        cost: { item: 'xukong_jing' },
        outcome: {
          text: '虚空晶在魔躯前轰然炸开，逆向空间漩涡将域外虚空魔连同百丈黑隙一并拽回界海，玉带江重归晴空！',
          effects: { reputation: 160, karma: 95, lawExp: 85, lawId: 'space', flag: { 晶爆封虚空: true } },
          goto: 'wrh_zz_rift_3',
        },
      },
    ],
  },
  {
    id: 'wrh_zz_rift_3',
    title: '中州 · 界壁凝晶得空间秘传',
    region: 'zhongzhou',
    pool: 'branch',
    tier: 5,
    weight: 0,
    text: '玉带江云开雾散，两岸万千百姓与修士齐齐焚香遥拜。界壁重新愈合之处，虚空灵韵凝结出两颗璀璨的虚空晶，一卷自界海乱流中跌出的古朴空间玉匣亦静静漂浮于江心。',
    choices: [
      {
        label: '收取《太虚挪移经》与虚空晶，参悟断界之道',
        hint: '得天阶空间玉简、虚空晶与称号',
        outcome: {
          text: '开启玉匣刹那，无数银色空间符纹映入识海。你收起虚空晶与秘典，举步之间已隐有缩地千里之象。',
          effects: { items: ['yujian_xukong', 'xukong_jing'], lawExp: 80, lawId: 'space', reputation: 140, title: '玉江封界尊', counter: { secrets: 1 } },
        },
      },
      {
        label: '炼化虚空残韵入体，并收取太虚炼神丹巩固境界',
        hint: '修为与炼虚宝丹双丰收',
        outcome: {
          text: '你将江心残余的界壁清气纳回紫府，又取走玉匣中封存的太虚炼神丹，破境之路豁然开朗。',
          effects: { items: ['lianxu_dan', 'xukong_jing'], expPct: 0.42, attrs: { 神识: 6, 悟性: 5 }, title: '镇空护道者', counter: { secrets: 1 } },
        },
      },
    ],
  },

  // ---------- 独立奇遇 34 段（wrh_zz_01 ~ wrh_zz_34） ----------
  {
    id: 'wrh_zz_01',
    title: '中州 · 白玉京御街剑鸣',
    region: 'zhongzhou',
    pool: 'world',
    tier: 5,
    weight: 3,
    minRealm: 4,
    maxRealm: 7,
    text: '白玉京十里青石御街之上，三座太古剑亭无风自鸣。一名白袍负剑的太玄剑宗太上长老正以指代剑，在长空划出三千里剑气长河，引得满城剑修驻足凝视，剑心共振。',
    choices: [
      {
        label: '拔剑回应长空剑鸣，与太上剑意隔空交锋',
        hint: '剑道检定 · 悟剑大进',
        roll: {
          p: 0.62,
          attrs: { 悟性: 0.012, 道心: 0.01 },
          success: {
            text: '你的剑意冲霄而起，竟在三千里剑河中劈开一道分流！白袍长老朗声大笑，隔空抛下一粒剑魄通明丹。',
            effects: { items: ['jianyi_dan'], lawExp: 75, lawId: 'sword', reputation: 90 },
          },
          fail: {
            text: '太上剑威浩如江海，你的剑意刚出十丈便被压散，然经此磨砺，剑心反倒更纯三分。',
            effects: { lawExp: 35, lawId: 'sword', attrs: { 道心: 2 } },
          },
        },
      },
      {
        label: '静立檐下细悟剑河起承转合，不争锋芒',
        hint: '耗一月 · 剑道与悟性稳步精进',
        cost: { month: 1 },
        outcome: {
          text: '剑河散尽后余韵仍在御街流连三十日。你日夜体悟，终明「剑在念先」之理。',
          effects: { lawExp: 60, lawId: 'sword', attrs: { 悟性: 4 }, expPct: 0.2 },
        },
      },
    ],
  },
  {
    id: 'wrh_zz_02',
    title: '中州 · 万象书院辩长生',
    region: 'zhongzhou',
    pool: 'world',
    tier: 5,
    weight: 4,
    minRealm: 4,
    maxRealm: 7,
    text: '万象书院百年一度的「杏坛讲道」于翠微峰举行，三百名化神、炼虚修士围坐古柏之下。大儒抛出命题：「天道无情而人有情，求长生者究竟当斩情合道，抑或携情渡劫？」',
    choices: [
      {
        label: '倡言「以情证道，无心何以载长生」',
        hint: '道心与魅力检定 · 涤荡心魔，得大儒嘉许',
        roll: {
          p: 0.64,
          attrs: { 道心: 0.012, 魅力: 0.01 },
          success: {
            text: '你娓娓道来红尘百态与仙途初心，满座动容。院长赠你一枚养神玉清丹与十载讲道灵茶。',
            effects: { items: ['yangshen_dan'], attrs: { 道心: 6, 魅力: 3 }, demon: -30, reputation: 100 },
          },
          fail: {
            text: '数位苦修太上忘情的剑修针锋相对，双方辩至日暮未分高下，各自心折而退。',
            effects: { attrs: { 道心: 3, 悟性: 2 }, expPct: 0.16 },
          },
        },
      },
      {
        label: '倡言「太上忘情，唯有澄空方纳天地法则」',
        hint: '悟性检定 · 悟性与法则感悟齐升',
        roll: {
          p: 0.64,
          attrs: { 悟性: 0.012, 神识: 0.01 },
          success: {
            text: '你以冰霜般冷静的推演拆解情劫之弊，引得数名炼虚老怪连连颔首，获赠一块法则残片。',
            effects: { items: ['faze_canpian'], attrs: { 悟性: 6, 神识: 4 }, expPct: 0.22 },
          },
          fail: {
            text: '你的论断虽锐利却略显偏颇，书院大儒轻叹点拨两句，令你若有所思。',
            effects: { attrs: { 悟性: 3 }, expPct: 0.16 },
          },
        },
      },
    ],
  },
  {
    id: 'wrh_zz_03',
    title: '中州 · 麒麟古族试炼殿',
    region: 'zhongzhou',
    pool: 'world',
    tier: 5,
    weight: 3,
    minRealm: 4,
    maxRealm: 7,
    text: '中州千年古族「麟川姜氏」开启祖祠玉殿，邀请九州英杰共试太古麒麟威压。殿心玉柱供奉着一截祥光流转的麒麟玉角，唯能踏过九重祥瑞压力而不屈膝者，方可得古族厚赐。',
    choices: [
      {
        label: '运转气血硬抗太古瑞兽威压，直登九重玉阶',
        hint: '根骨 ≥ 35 · 得奇珍麒麟玉角',
        require: 'char.attrs.根骨 >= 35',
        requireHint: '根骨不足三十五，难承九重麒麟威压',
        roll: {
          p: 0.64,
          attrs: { 根骨: 0.012, 气运: 0.01 },
          success: {
            text: '你挺脊如松，踏上第九级玉阶刹那，殿顶竟响起一声清越麒麟清鸣！族长亲自奉上麒麟玉角以结善缘。',
            effects: { items: ['qilin_jiao'], reputation: 110, attrs: { 根骨: 4, 气运: 3 } },
          },
          fail: {
            text: '行至第七阶时威压暴涨，你单膝微弯未能登顶，族长仍赠你三千灵石以慰劳苦。',
            effects: { stones: 3000, attrs: { 根骨: 2 }, hp: -180 },
          },
        },
      },
      {
        label: '以功德清气呼应祥瑞，温和登殿不逞血气之勇',
        hint: '业力 ≥ 50 · 以德感麟',
        require: 'karma >= 50',
        requireHint: '业力不足五十，难引祥瑞共鸣',
        outcome: {
          text: '你周身功德清辉一显，九重威压竟如春风化雪自动退让！麒麟玉角凌空飞落你掌，满殿姜氏长老无不肃然。',
          effects: { items: ['qilin_jiao'], karma: 40, reputation: 130, attrs: { 气运: 4 } },
        },
      },
    ],
  },
  {
    id: 'wrh_zz_04',
    title: '中州 · 紫霄雷池淬法身',
    region: 'zhongzhou',
    pool: 'wild',
    tier: 5,
    weight: 3,
    minRealm: 4,
    maxRealm: 7,
    text: '中州太岳山巅悬着一口方圆百丈的紫霄雷池，池中并非凡水，而是亿万年积聚的天劫液态雷浆。池心盘踞着一尊紫电凝形的先天雷灵，正吞吐雷光俯瞰众生。',
    choices: [
      {
        label: '入池斗战紫霄雷灵，夺取池心先天雷元',
        hint: '战紫霄雷灵 · 胜得雷元丹与九霄神雷符',
        combat: {
          enemy: 'thunder_sovereign',
          win: {
            text: '万钧雷霆炸裂长空，你将雷灵击散回纯正雷浆，顺势收走池心凝结的紫霄雷元丹与两张九霄神雷符。',
            effects: { items: ['leiyuan_dan', { id: 'jiuxiao_leifu', qty: 2 }], lawExp: 80, lawId: 'thunder', expPct: 0.28 },
          },
          lose: {
            text: '天罚雷威霸道绝伦，你护体法袍化作飞灰，焦头烂额逃下太岳山巅。',
            effects: { hp: -360, injury: 2 },
          },
        },
      },
      {
        label: '在雷池边缘借溢散电弧淬炼经脉两月',
        hint: '耗两月 · 雷霆法则与根骨稳涨',
        cost: { month: 2 },
        outcome: {
          text: '你以细微紫电一遍遍冲刷奇经八脉，虽痛彻骨髓，两月后肉身抗劫之力却暴增一大截。',
          effects: { lawExp: 65, lawId: 'thunder', attrs: { 根骨: 5 }, breakBonus: 12, expPct: 0.22 },
        },
      },
    ],
  },
  {
    id: 'wrh_zz_05',
    title: '中州 · 上界巡使勒索灵宗',
    region: 'zhongzhou',
    pool: 'world',
    tier: 5,
    weight: 3,
    minRealm: 4,
    maxRealm: 7,
    text: '云海仙山之上，一座传承两千年的中州丹道大宗正门庭紧闭。一名银甲上界巡查使脚踏金莲悬于山门之前，居高临下索要该宗镇山灵炉与十炉九转金丹，宗主白发苍苍却敢怒不敢言。',
    choices: [
      {
        label: '路见不平拔剑相助，硬撼上界巡查使',
        hint: '战上界巡查使 · 扬威中州，得九转金丹谢礼',
        combat: {
          enemy: 'heaven_envoy',
          win: {
            text: '你凌空截断银甲巡使的天律锁链，将其打得法甲龟裂遁逃九天。丹宗上下齐齐下拜，宗主含泪献上一粒镇宗九转金丹！',
            effects: { items: ['jiuzhuan_dan'], reputation: 220, karma: 90, expPct: 0.3 },
          },
          lose: {
            text: '上界巡使修为深不可测，你拼死接下三掌已力竭跌落山阶，丹宗只得割宝息事。',
            effects: { hp: -420, injury: 2, reputation: 70 },
          },
        },
      },
      {
        label: '以中州律法与上界巡天旧例据理力争，迫其收敛',
        hint: '魅力 ≥ 30 且道心 ≥ 38 · 以理服天官',
        require: 'char.attrs.魅力 >= 30 && char.attrs.道心 >= 38',
        requireHint: '魅力或道心不足，难以威慑上界使者',
        roll: {
          p: 0.6,
          attrs: { 魅力: 0.012, 道心: 0.01 },
          success: {
            text: '你字字珠玑点破其假公济私之嫌，扬言将此事刻入观星天录。巡使忌惮上界御史追究，冷哼一声拂袖而去。',
            effects: { items: ['huashen_dan'], stones: 6000, reputation: 150, karma: 70 },
          },
          fail: {
            text: '巡使根本不吃这套，冷笑挥袖震退于你，终究强夺了两炉灵丹离去。',
            effects: { hp: -220, reputation: 30 },
          },
        },
      },
    ],
  },
  {
    id: 'wrh_zz_06',
    title: '中州 · 紫微星河倒灌夜',
    region: 'zhongzhou',
    pool: 'wild',
    tier: 5,
    weight: 4,
    minRealm: 4,
    maxRealm: 7,
    text: '三百年一遇的「七星连珠」之夜，中州古观星台上方星河垂落如银瀑，将整座白玉山巅映成琉璃仙境。天地间星辰法则清晰得仿佛触手可及，无数修士早已抢占山头打坐。',
    choices: [
      {
        label: '独上绝顶迎着星瀑吐纳两月，凝炼周天星辉',
        hint: '耗两月 · 星辰法则暴涨，得周天星辉丹',
        cost: { month: 2 },
        outcome: {
          text: '银色星浆如百川归海灌入紫府，待星象消退，你掌中竟自发凝成一枚璀璨的周天星辉丹！',
          effects: { items: ['xinghui_dan'], lawExp: 85, lawId: 'star', expPct: 0.34, attrs: { 神识: 4 } },
        },
      },
      {
        label: '于山腰布设聚星玉阵，与众散修共享星辉',
        hint: '惠及同道 · 业力、声望与修为三赢',
        outcome: {
          text: '聚星阵将狂暴星瀑化作温润星雨洒遍山腰，百余散修同声称谢，你亦于众人共鸣中道心大明。',
          effects: { karma: 70, reputation: 110, expPct: 0.24, lawExp: 50, lawId: 'star', demon: -20 },
        },
      },
    ],
  },
  {
    id: 'wrh_zz_07',
    title: '中州 · 万毒黑龙破地渊',
    region: 'zhongzhou',
    pool: 'world',
    tier: 5,
    weight: 3,
    minRealm: 4,
    maxRealm: 7,
    text: '中州南麓地脉崩裂，一头沉睡数千年的万毒黑龙冲破封禁，墨绿毒雾瞬息笼罩方圆百里。下游三座凡人郡城与灵田眼看就要化作死域，附近仙门紧急鸣钟求援！',
    choices: [
      {
        label: '凌空拦在毒雾之前，孤身死战万毒黑龙',
        hint: '战万毒黑龙 · 救万民，得大功德与龙血精',
        combat: {
          enemy: 'venom_wyrm',
          win: {
            text: '剑雷交加撕裂百里毒云，万毒黑龙哀嚎坠入深渊伏诛。漫天清雨随之降下，你从龙尸逆鳞下取出一滴龙血精与大批灵石谢礼。',
            effects: { items: ['longxue_jing', 'huashen_dan'], stones: 6500, karma: 110, reputation: 170 },
          },
          lose: {
            text: '黑龙毒息蚀透护体罡气，你浑身发麻坠落山林，幸得附近丹宗长老赶来施救。',
            effects: { hp: -360, injury: 2, reputation: 40 },
          },
        },
      },
      {
        label: '施展丹道解毒真火先护下游百姓迁徙',
        hint: '丹道感悟 · 稳得大功德与声望',
        cost: { month: 1 },
        outcome: {
          text: '你连燃七日青色净火隔绝毒雾，护送十万百姓安然南迁。虽未亲手屠龙，人间香火却为你添上一层功德清辉。',
          effects: { karma: 95, reputation: 120, lawExp: 60, lawId: 'pill', demon: -25 },
        },
      },
    ],
  },
  {
    id: 'wrh_zz_08',
    title: '中州 · 丹崖朱雀遗巢',
    region: 'zhongzhou',
    pool: 'wild',
    tier: 5,
    weight: 3,
    minRealm: 4,
    maxRealm: 7,
    text: '赤霞染红的绝壁悬崖顶上，一株焦黑梧桐古树竟在烈火中抽出一枝嫩芽。树冠旧巢内静卧着一根燃着不灭赤金真炎的朱雀真羽，周遭十里飞禽皆伏地朝拜不敢飞越。',
    choices: [
      {
        label: '以真元化作净水清风，礼敬古巢迎取朱雀真羽',
        hint: '道心与气运检定 · 得奇珍朱雀真羽',
        roll: {
          p: 0.62,
          attrs: { 道心: 0.012, 气运: 0.012 },
          success: {
            text: '真炎感你心诚，竟温顺收敛锋芒。朱雀真羽化作一道赤金流光轻落掌心，令你周身气韵顿生华彩。',
            effects: { items: ['fenghuang_yu'], attrs: { 悟性: 3, 魅力: 3 }, expPct: 0.24 },
          },
          fail: {
            text: '离火骤燃如浪，将你衣袖焚毁半截。你急忙退下丹崖，仅借余火炼去几分体内寒煞。',
            effects: { hp: -220, demon: -12, attrs: { 根骨: 2 } },
          },
        },
      },
      {
        label: '在焦桐树下盘坐一月，借不灭真炎淬炼丹火',
        hint: '耗一月 · 丹道法则与寿元俱增',
        cost: { month: 1 },
        outcome: {
          text: '你在炙热离火中参悟涅槃生机，丹火精纯度暴涨，寿元亦悄然绵延三十载。',
          effects: { lawExp: 70, lawId: 'pill', lifespan: 30, expPct: 0.22 },
        },
      },
    ],
  },
  {
    id: 'wrh_zz_09',
    title: '中州 · 血渊魔主潜灵脉',
    region: 'zhongzhou',
    pool: 'world',
    tier: 5,
    weight: 3,
    minRealm: 4,
    maxRealm: 7,
    text: '中州灵气最盛的紫云山谷近来草木枯黄、灵泉发腥。你循脉深入地底千丈，赫然撞见北荒血渊魔主竟暗渡陈仓潜伏于此，正以血河大阵窃吸中州圣域的一条支脉灵龙！',
    choices: [
      {
        label: '趁其行功紧要关头突袭发难，斩杀血渊魔主',
        hint: '战血渊魔主 · 护圣域灵脉，获重赏',
        combat: {
          enemy: 'blood_fiend_king',
          win: {
            text: '地宫震裂，血河大阵应声而破！血渊魔主狂怒反扑却不敌你蓄势雷霆，终被斩于灵脉之前。中州大宗闻讯奉上重礼。',
            effects: { items: ['huashen_dan', 'xuesha_jing'], stones: 7200, reputation: 180, karma: 80 },
          },
          lose: {
            text: '魔主修为通天，一掌血海翻天将你震出地窟，待你寻来援兵，魔主早已遁回北荒。',
            effects: { hp: -380, injury: 2 },
          },
        },
      },
      {
        label: '以传讯玉符密报白玉京执法殿，自己外围截断血线',
        hint: '稳健智取 · 得灵石、贡献与阵道感悟',
        outcome: {
          text: '你悄然斩断三处外围血引，随即配合赶至的执法大能合围迫退魔主，毫不贪功却获厚赏。',
          effects: { stones: 4500, reputation: 110, contribution: 200, lawExp: 50, lawId: 'array' },
        },
      },
    ],
  },
  {
    id: 'wrh_zz_10',
    title: '中州 · 鎏金古镜藏心魔',
    region: 'zhongzhou',
    pool: 'world',
    tier: 5,
    weight: 3,
    minRealm: 4,
    maxRealm: 7,
    text: '中州洛氏仙族近日怪事频发，三位化神长老照过祖传「太虚鎏金镜」后相继癫狂闭关。族主重金延请高人查验，你刚步入镜堂，镜面波纹一荡，竟映出你心底最不愿面对的过往——镜中蛰伏着一尊幻界心魔尊！',
    choices: [
      {
        label: '一指点碎虚幻镜影，逼出幻界心魔尊就地伏诛',
        hint: '战幻界心魔尊 · 胜得重金与冰心宝丹',
        combat: {
          enemy: 'mirror_demon',
          win: {
            text: '古镜发出清越嗡鸣，寄生百年的心魔尊被你连根拔除。洛氏族主感激涕零，奉上六千灵石与一粒太虚炼神丹。',
            effects: { items: ['lianxu_dan', 'bingxin_dan'], stones: 6000, demon: -35, reputation: 130 },
          },
          lose: {
            text: '心魔尊借古镜折射出千重幻身，令你真假难辨、神魂受创，只得暂退镜堂。',
            effects: { hp: -340, demon: 20, injury: 1 },
          },
        },
      },
      {
        label: '不毁古镜，反借镜中幻象打磨自身道心一月',
        hint: '道心 ≥ 42 · 耗一月，道心暴涨',
        require: 'char.attrs.道心 >= 42',
        requireHint: '道心不足四十二，恐遭心魔反客为主',
        cost: { month: 1 },
        outcome: {
          text: '你面对镜中万千执念岿然不动，反把心魔尊逼得无隙可乘、自行溃散。古镜重归澄澈，你道心大成。',
          effects: { attrs: { 道心: 8, 神识: 4 }, demon: -40, stones: 4500, expPct: 0.28 },
        },
      },
    ],
  },
  {
    id: 'wrh_zz_11',
    title: '中州 · 断崖剑圣遗痕',
    region: 'zhongzhou',
    pool: 'wild',
    tier: 5,
    weight: 3,
    minRealm: 4,
    maxRealm: 7,
    text: '天柱山脉东壁被一记斜斩削平千丈，崖面光洁如镜，历经万年风雨仍隐隐吞吐霜寒剑气。传说万年前一位中州剑圣临飞升前在此试剑，凡剑心通明者立于崖下，皆可见其道影重现。',
    choices: [
      {
        label: '激发崖面剑痕，与陨落剑圣影过招悟剑',
        hint: '战陨落剑圣影 · 极险，剑道大成机缘',
        combat: {
          enemy: 'blade_saint_shade',
          win: {
            text: '漫天雪白剑光映亮半边山脉，你终以绝代锋芒斩断剑影。崖壁裂开寸许，飞出一枚法则残片与剑魄通明丹！',
            effects: { items: ['faze_canpian', 'jianyi_dan'], lawExp: 95, lawId: 'sword', attrs: { 悟性: 5 } },
          },
          lose: {
            text: '剑圣一击断空，你连人带剑被震飞百丈，然眉心却烙下了一道极珍贵的剑道轨迹。',
            effects: { hp: -380, lawExp: 45, lawId: 'sword' },
          },
        },
      },
      {
        label: '背手立于崖下静观剑痕两月，细细临摹其意',
        hint: '耗两月 · 稳获剑道法则与修为',
        cost: { month: 2 },
        outcome: {
          text: '朝迎霞光、暮送山岚，你在崖下枯立六十日，把那一剑的收放节奏彻底化入己身。',
          effects: { lawExp: 75, lawId: 'sword', expPct: 0.28, attrs: { 悟性: 4, 道心: 3 } },
        },
      },
    ],
  },
  {
    id: 'wrh_zz_12',
    title: '中州 · 黄泉帅越界索魂',
    region: 'zhongzhou',
    pool: 'world',
    tier: 5,
    weight: 3,
    minRealm: 4,
    maxRealm: 7,
    text: '中州名刹「净云观」上空黑云压境，一道阴司鬼门轰然洞开。身披黑甲的黄泉镇狱帅手执长戟步出鬼门，竟欲强行勾走尚有百年阳寿的净云观主元神，观中众弟子泣血死战却节节败退！',
    choices: [
      {
        label: '挡于鬼门之前，逼退越界行凶的黄泉镇狱帅',
        hint: '战黄泉镇狱帅 · 救古观，得寿元与因果厚报',
        combat: {
          enemy: 'nether_marshal',
          win: {
            text: '你破开黄泉倒灌之势，一举震退镇狱帅迫使其闭门回幽冥。观主转危为安，赠你松鹤延寿丹与《天机因果秘录》残悟。',
            effects: { items: ['yanshou_dan', 'huashen_dan'], karma: 100, reputation: 165, lifespan: 40 },
          },
          lose: {
            text: '黄泉阴戟吸走你大半灵力，你重伤退下石阶，眼睁睁看鬼门吞没观主虚影。',
            effects: { hp: -390, mpPct: -0.4, injury: 2 },
          },
        },
      },
      {
        label: '以因果法则质询生死簿契，查明观主阳寿真伪',
        hint: '因果法则 ≥ 1 或神识 ≥ 40 · 智断阴阳案',
        require: 'law("karma") >= 1 || char.attrs.神识 >= 40',
        requireHint: '需初窥因果法则或神识达到四十',
        roll: {
          p: 0.65,
          attrs: { 神识: 0.012, 悟性: 0.01 },
          success: {
            text: '你一眼识破鬼门乃阴司私卒伪造，当众喝破其律法罪责！镇狱帅心虚不敢多留，收戟仓皇遁回幽冥。',
            effects: { lawExp: 70, lawId: 'karma', reputation: 140, karma: 80, stones: 5000 },
          },
          fail: {
            text: '对方竟真亮出冥府铁印，你无从辩驳，只得护住净云观余众免遭波及。',
            effects: { karma: 35, reputation: 50, expPct: 0.14 },
          },
        },
      },
    ],
  },
  {
    id: 'wrh_zz_13',
    title: '中州 · 镜湖惊现太虚魔章',
    region: 'zhongzhou',
    pool: 'wild',
    tier: 5,
    weight: 3,
    minRealm: 4,
    maxRealm: 7,
    text: '素有「圣域明珠」之称的万里镜湖忽掀百丈黑涛，湖底通往东海归墟的古水门意外洞开。八条遮天蔽日的漆黑触腕破水而出——竟是一头炼虚级的太虚魔章顺水闯入中州腹地！',
    choices: [
      {
        label: '凌波御剑斩断魔触，将太虚魔章驱回古水门',
        hint: '战太虚魔章 · 炼虚海怪，重赏灵宝与灵石',
        combat: {
          enemy: 'abyss_kraken',
          win: {
            text: '镜湖之上寒潮炸裂，你连斩其三条巨腕，魔章吃痛潜回水门深处。风平浪静后，湖面浮出一颗虚空晶与海量珍珠灵石。',
            effects: { items: ['xukong_jing', 'lianxu_dan'], stones: 7500, reputation: 175, karma: 75 },
          },
          lose: {
            text: '八条巨腕如天罗地网合拢，你护体真元崩碎，险些被寒潮卷入湖底水眼。',
            effects: { hp: -410, injury: 2 },
          },
        },
      },
      {
        label: '引动空间与阵道之力，从外围先行锁死湖底古水门',
        hint: '耗一月 · 空间与阵道大进，稳妥封患',
        cost: { month: 1 },
        outcome: {
          text: '你不与巨兽正面死磕，专攻水门石柱。大阵合拢瞬间将魔章半身逼退归墟，镜湖重归清平。',
          effects: { lawExp: 65, lawId: 'space', reputation: 120, karma: 65, stones: 4200 },
        },
      },
    ],
  },
  {
    id: 'wrh_zz_14',
    title: '中州 · 妖王叩关讨旧盟',
    region: 'zhongzhou',
    pool: 'world',
    tier: 5,
    weight: 3,
    minRealm: 4,
    maxRealm: 7,
    text: '中州北境雄关外黑云蔽日，一尊身披兽皮大氅的妖王孤身立于阵前，手持半块三千年前人妖两族共刻的青铜盟碑：「昔年人族借吾族三条灵脉建城，许诺三千年后归还一脉。今期已至，中州可敢履约？」',
    choices: [
      {
        label: '出关与妖王一战，以拳剑重定人妖新约',
        hint: '战妖王 · 胜则压服妖族气焰',
        combat: {
          enemy: 'demon_king',
          win: {
            text: '惊天动地一战震碎关前十里焦岩，妖王虽败犹傲，仰天长啸：「人族尚有如此豪杰，旧盟再延千年又何妨！」',
            effects: { expPct: 0.3, reputation: 170, attrs: { 根骨: 5 }, stones: 5800 },
          },
          lose: {
            text: '妖王天威沉重如山，你虎口崩血退入雄关，守城大阵仓促开启方才稳住局势。',
            effects: { hp: -350, injury: 1, reputation: 40 },
          },
        },
      },
      {
        label: '出面斡旋，提议人妖共治边境灵脉、互开坊市',
        hint: '魅力 ≥ 32 · 以和为贵，大涨功德与声望',
        require: 'char.attrs.魅力 >= 32',
        requireHint: '魅力不足三十二，难以说动傲慢妖王',
        roll: {
          p: 0.64,
          attrs: { 魅力: 0.012, 悟性: 0.01 },
          success: {
            text: '你一番利弊陈词令妖王频频颔首，最终人妖双方在关前重立互市盟约，免去一场生灵涂炭的大战。',
            effects: { karma: 110, reputation: 180, items: ['qilin_jiao'], attrs: { 魅力: 4 } },
          },
          fail: {
            text: '妖王嗤笑人族诡辩，挥袖震裂盟碑拂袖离去，留下一片肃杀战云。',
            effects: { reputation: 35, attrs: { 道心: 2 } },
          },
        },
      },
    ],
  },
  {
    id: 'wrh_zz_15',
    title: '中州 · 乾坤须弥暗阁',
    region: 'zhongzhou',
    pool: 'world',
    tier: 5,
    weight: 3,
    minRealm: 4,
    maxRealm: 7,
    text: '白玉京深巷一扇看似寻常的朱漆木门内，实则以空间折叠藏着一座方圆十里的「须弥暗阁」。白发掌柜轻摇羽扇笑道：「此处只迎化神以上道友，凡阁中奇珍，皆可明码换取。」',
    choices: [
      {
        label: '豪掷两万灵石，购入空间灵宝「乾坤须弥戒」',
        hint: '20000 灵石 · 得天阶灵宝乾坤须弥戒',
        require: 'stones >= 20000',
        requireHint: '灵石不足两万',
        cost: { stones: 20000 },
        outcome: {
          text: '玉戒戴上指尖，一股浩瀚空间灵韵涌入经脉，你法力上限与攻防气象皆为之一振。',
          effects: { items: ['qiankun_jie'], lawExp: 45, lawId: 'space' },
        },
      },
      {
        label: '出八千灵石，买下一粒太虚炼神丹与一块法则残片',
        hint: '8000 灵石 · 破境悟道佳品',
        require: 'stones >= 8000',
        requireHint: '灵石不足八千',
        cost: { stones: 8000 },
        outcome: {
          text: '掌柜笑眯眯递上两只锦盒，另附赠一盏清神灵茶。',
          effects: { items: ['lianxu_dan', 'faze_canpian'], mpPct: 0.4 },
        },
      },
      {
        label: '细察暗阁空间折叠之术，与掌柜闲谈一盏茶便告辞',
        hint: '无耗 · 空间法则小悟',
        outcome: {
          text: '步出朱漆木门回首望去，陋巷空空如也。你闭目回味方才步距变化，颇有所得。',
          effects: { lawExp: 40, lawId: 'space', attrs: { 神识: 3 } },
        },
      },
    ],
  },
  {
    id: 'wrh_zz_16',
    title: '中州 · 天机阁青衣问卦',
    region: 'zhongzhou',
    pool: 'world',
    tier: 5,
    weight: 4,
    minRealm: 4,
    maxRealm: 7,
    text: '雨落青瓦，天机阁一袭青衣的执笔先生独坐长廊下推演铜钱。见你踏雨而来，他指尖三枚古钱骤然停于半空，轻笑道：「道友命格牵动九州风云，今日既逢一卦，不妨各取所需。」',
    choices: [
      {
        label: '请先生以因果秘术点破自身破境命门',
        hint: '耗五千灵石 · 大幅提升下次突破成算与因果感悟',
        require: 'stones >= 5000',
        requireHint: '灵石不足五千',
        cost: { stones: 5000 },
        outcome: {
          text: '青衣先生朱笔轻点你眉心，三句真言震彻识海。你眼前迷雾顿开，只觉下一道天劫瓶颈已松动三分。',
          effects: { breakBonus: 22, lawExp: 65, lawId: 'karma', attrs: { 悟性: 4, 气运: 3 } },
        },
      },
      {
        label: '以自身历练奇闻交换一卷因果参悟心得',
        hint: '无耗 · 悟因果法则，消减心魔',
        cost: { month: 1 },
        outcome: {
          text: '你与先生对坐品茗一月，以凡尘游历印证天机推演。临别时他赠你数页手书与清心灵韵。',
          effects: { lawExp: 60, lawId: 'karma', demon: -24, expPct: 0.2, attrs: { 道心: 3 } },
        },
      },
    ],
  },
  {
    id: 'wrh_zz_17',
    title: '中州 · 太古空间阵残碑',
    region: 'zhongzhou',
    pool: 'wild',
    tier: 5,
    weight: 3,
    minRealm: 4,
    maxRealm: 7,
    text: '中州荒废的古传送阵台中央立着半块银灰残碑，碑身被虚空乱流切出平整斜口。每逢日落，斜口处便会映出千年前九州连通上界的古阵光影，玄奥晦涩却直指空间与阵道本源。',
    choices: [
      {
        label: '守候日落残影两月，全力推演太古传送大阵',
        hint: '耗两月 · 阵道与空间法则齐涨',
        cost: { month: 2 },
        outcome: {
          text: '六十个黄昏转瞬即逝，你终将碑中残阵补全三成。袖袍一拂，身周尺许空间竟随之微微折叠。',
          effects: { lawExp: 80, lawId: 'array', expPct: 0.26, attrs: { 悟性: 5, 神识: 4 } },
        },
      },
      {
        label: '以虚空晶贴合碑口，引出碑内封存的太古阵眼残核',
        hint: '消耗虚空晶 · 得《太虚挪移经》',
        require: 'has("xukong_jing")',
        requireHint: '行囊中无虚空晶',
        cost: { item: 'xukong_jing' },
        outcome: {
          text: '虚空晶融入斜口刹那，古碑清鸣震天，吐出一卷封存万载的《太虚挪移经》玉简！',
          effects: { items: ['yujian_xukong'], lawExp: 65, lawId: 'space' },
        },
      },
    ],
  },
  {
    id: 'wrh_zz_18',
    title: '中州 · 玄黄器阁试灵甲',
    region: 'zhongzhou',
    pool: 'world',
    tier: 5,
    weight: 3,
    minRealm: 4,
    maxRealm: 7,
    text: '中州第一炼器世家「玄黄器阁」历经百年合铸出一副「八卦玄黄甲」，然宝甲器灵桀骜难驯，连三位化神器师都无法令其认主。阁主广邀天下强修入殿试甲：「谁能令玄黄甲主动护体，便以半价结缘！」',
    choices: [
      {
        label: '运转阵道与厚重真元压服器灵，再出九千灵石结缘',
        hint: '9000 灵石 · 根骨与悟性检定，得八卦玄黄甲',
        require: 'stones >= 9000',
        requireHint: '灵石不足九千',
        cost: { stones: 9000 },
        roll: {
          p: 0.66,
          attrs: { 根骨: 0.012, 悟性: 0.012 },
          success: {
            text: '玄黄宝甲嗡鸣腾空，八片八卦甲叶自动飞贴你周身，金光璀璨！阁主大喜过望，当场交付契书。',
            effects: { items: ['bagua_xuanjia'], reputation: 95, lawExp: 45, lawId: 'array' },
          },
          fail: {
            text: '器灵震散你的神念，宝甲重重坠回石台。阁主退还半数灵石并赠你两块磁砂作慰。',
            effects: { stones: 4500, items: [{ id: 'xingchen_sha', qty: 2 }], hp: -160 },
          },
        },
      },
      {
        label: '只在一旁观摩众修试甲，暗记炼器铭阵之道',
        hint: '无耗 · 阵道与悟性小涨',
        outcome: {
          text: '数名强者接连折戟，你却从器灵反震的频率中看出甲片阵法玄机，默默记下受益良多。',
          effects: { lawExp: 45, lawId: 'array', attrs: { 悟性: 3 }, expPct: 0.16 },
        },
      },
    ],
  },
  {
    id: 'wrh_zz_19',
    title: '中州 · 九转丹会开宝炉',
    region: 'zhongzhou',
    pool: 'world',
    tier: 5,
    weight: 3,
    minRealm: 4,
    maxRealm: 7,
    text: '药王圣殿于中州翠烟峰召开十年一度的「九转丹会」，九尊紫金大鼎同时燃起三昧真火，丹香飘散三百里。丹会正悬赏高阶丹师助阵控火，以防压轴的九转金丹在凝丹刹那炸炉。',
    choices: [
      {
        label: '登台接管巽位丹火，以神识精准调和药性',
        hint: '神识 ≥ 34 · 悟性与神识检定，获赠化神丹',
        require: 'char.attrs.神识 >= 34',
        requireHint: '神识不足三十四，难控九鼎真火',
        cost: { month: 1 },
        roll: {
          p: 0.64,
          attrs: { 神识: 0.012, 悟性: 0.012 },
          success: {
            text: '九道霞光冲破云霄，丹成九纹！丹会大长老抚掌赞叹，特赠你一粒化神丹与四千灵石酬金。',
            effects: { items: ['huashen_dan'], stones: 4000, lawExp: 70, lawId: 'pill', reputation: 110 },
          },
          fail: {
            text: '凝丹一刻火候微偏，虽勉强稳住炉身未致炸炉，成丹却失了两成药效。长老仍付了两千灵石谢礼。',
            effects: { stones: 2000, lawExp: 35, lawId: 'pill' },
          },
        },
      },
      {
        label: '在丹会外坊以六千灵石收购一炉刚出世的化神丹',
        hint: '6000 灵石 · 稳得化神丹与大还丹',
        require: 'stones >= 6000',
        requireHint: '灵石不足六千',
        cost: { stones: 6000 },
        outcome: {
          text: '丹香未散，你抢在诸宗管事出手前买下这瓶温热宝丹，收获颇丰。',
          effects: { items: ['huashen_dan', 'dahuan_dan'] },
        },
      },
    ],
  },
  {
    id: 'wrh_zz_20',
    title: '中州 · 白昼裂界刺杀案',
    region: 'zhongzhou',
    pool: 'world',
    tier: 5,
    weight: 3,
    minRealm: 4,
    maxRealm: 7,
    text: '中州青云长街人来人往，正午骄阳之下，一名刚出书院的炼虚儒修身侧空间突然裂开一道黑缝！一尊潜伏多时的裂界暗影无声刺出漆黑虚空刃，满街修士竟无一人来得及反应！',
    choices: [
      {
        label: '瞬间祭出神通截断虚空刃，当街斩杀裂界暗影',
        hint: '战裂界暗影 · 救大儒，获重谢与高声望',
        combat: {
          enemy: 'void_stalker',
          win: {
            text: '刀剑交鸣震碎十丈青砖，你步步紧逼将隐于虚空的刺客彻底逼杀！大儒拱手深谢，赠你虚空晶与五千灵石。',
            effects: { items: ['xukong_jing'], stones: 5000, reputation: 150, karma: 65, lawExp: 50, lawId: 'space' },
          },
          lose: {
            text: '暗影一击不中即刻反噬你周身破绽，你拼死护住大儒自身却挨了一记空间利刃。',
            effects: { hp: -320, injury: 2, reputation: 80, karma: 40 },
          },
        },
      },
      {
        label: '高喝预警并以护体清光替大儒挡下致命一刺',
        hint: '稳妥救人 · 获功德、灵石与法力体悟',
        outcome: {
          text: '暗影见偷袭落空即刻遁入空间缝隙无影无踪。大儒惊魂甫定，执意赠你一粒养神玉清丹与三千灵石。',
          effects: { items: ['yangshen_dan'], stones: 3000, karma: 55, reputation: 90, hp: -120 },
        },
      },
    ],
  },
  {
    id: 'wrh_zz_21',
    title: '中州 · 圣城古钟自鸣',
    region: 'zhongzhou',
    pool: 'world',
    tier: 5,
    weight: 3,
    minRealm: 4,
    maxRealm: 7,
    text: '暮色四合时，矗立于中州古都城楼之巅的玄黄镇狱大钟无风自鸣，厚重钟波化作金色涟漪席卷百里。城中妖邪无不抱头哀嚎，寻常修士闻之气血翻涌，唯有道心通透者能从钟声中听出太古安魂大道。',
    choices: [
      {
        label: '立于城楼之下迎着钟波盘坐调息一月',
        hint: '耗一月 · 心魔大消，根骨与道心并进',
        cost: { month: 1 },
        outcome: {
          text: '九十九声古钟余韵涤荡五脏六腑，你心中郁结尽消，肉身经脉亦在震荡中愈发坚韧。',
          effects: { demon: -35, attrs: { 道心: 5, 根骨: 4 }, expPct: 0.24 },
        },
      },
      {
        label: '施展神识探入钟身古篆，体悟镇压法则',
        hint: '神识检定 · 悟阵道与混沌法则',
        roll: {
          p: 0.6,
          attrs: { 神识: 0.012, 悟性: 0.012 },
          success: {
            text: '钟身铭文在识海中活过来般流转，你豁然领悟一丝以音镇阵的绝妙法门，更得法则残片共鸣。',
            effects: { lawExp: 75, lawId: 'array', attrs: { 神识: 4 }, expPct: 0.22 },
          },
          fail: {
            text: '古钟反震之音险些震伤元神，你急忙收回神识，耳畔仍嗡嗡作响三日不绝。',
            effects: { hp: -180, attrs: { 道心: 2 } },
          },
        },
      },
    ],
  },
  {
    id: 'wrh_zz_22',
    title: '中州 · 界外星舟坠荒原',
    region: 'zhongzhou',
    pool: 'wild',
    tier: 5,
    weight: 3,
    minRealm: 4,
    maxRealm: 7,
    text: '一道拖着七彩尾焰的残破玉舟划破中州夜空，轰然坠毁于无名丘陵。舟身刻满九州未见的奇异仙纹，船舱早已被界海罡风撕碎，唯有主舵台上的星核灯匣仍在微弱闪烁。',
    choices: [
      {
        label: '趁圣域执法使赶到前抢入船舱，开启星核灯匣',
        hint: '气运与神识检定 · 或得仙舟遗宝',
        roll: {
          p: 0.58,
          attrs: { 气运: 0.012, 神识: 0.012 },
          success: {
            text: '灯匣应手而开，里面静躺着一块虚空晶、一粒太虚炼神丹与半块刻有星图坐标的残玉！',
            effects: { items: ['xukong_jing', 'lianxu_dan'], lawExp: 55, lawId: 'space', counter: { secrets: 1 } },
          },
          fail: {
            text: '残舟禁制因撞击彻底崩毁爆燃，你急忙退避，只从余烬里抢出两捧星辰砂。',
            effects: { items: [{ id: 'xingchen_sha', qty: 2 }], hp: -190 },
          },
        },
      },
      {
        label: '细细拓印船身奇异仙纹后，主动通知万象书院接管',
        hint: '稳健结缘 · 得悟性、灵石与声望',
        outcome: {
          text: '万象书院大喜过望，不仅赠你四千灵石与法则研读手札，更对你无私之举大加赞誉。',
          effects: { stones: 4000, reputation: 100, attrs: { 悟性: 5 }, lawExp: 45, lawId: 'star' },
        },
      },
    ],
  },
  {
    id: 'wrh_zz_23',
    title: '中州 · 竹林古茶寮听道',
    region: 'zhongzhou',
    pool: 'world',
    tier: 5,
    weight: 4,
    minRealm: 4,
    maxRealm: 7,
    text: '中州紫竹林深处隐着一间茅顶茶寮，白衣老翁正用灵泉烹煮一壶青叶茶。茶香初闻淡雅，细嗅竟隐含光阴流转之韵——眼前老翁气息内敛如凡人，实则深不可测。',
    choices: [
      {
        label: '礼敬前辈，奉上千枚灵石求饮三杯岁月灵茶',
        hint: '1000 灵石 · 延寿悟光阴，修为精进',
        require: 'stones >= 1000',
        requireHint: '灵石不足一千',
        cost: { stones: 1000, month: 1 },
        outcome: {
          text: '三杯清茶入喉，眼前仿佛闪过四季枯荣百年一瞬。老翁笑道：「茶资免了，算结一段茶缘。」灵石竟原封未动留在你袖中，寿元反增五十载！',
          effects: { stones: 1000, lifespan: 50, lawExp: 70, lawId: 'time', expPct: 0.28, attrs: { 道心: 4 } },
        },
      },
      {
        label: '与老翁对弈一局烂柯棋，不问姓名只论玄机',
        hint: '悟性检定 · 胜则得岁月朝露',
        roll: {
          p: 0.58,
          attrs: { 悟性: 0.012, 道心: 0.01 },
          success: {
            text: '一局棋落三百六十子，老翁抚掌称妙，起身时将案头一滴光华流转的岁月朝露留予你手。',
            effects: { items: ['guangyin_lu'], attrs: { 悟性: 5, 道心: 3 } },
          },
          fail: {
            text: '棋至中盘你已满盘皆输，老翁微笑收枰，你却在覆盘中悟透几分进退大势。',
            effects: { attrs: { 悟性: 3 }, expPct: 0.18 },
          },
        },
      },
    ],
  },
  {
    id: 'wrh_zz_24',
    title: '中州 · 地脉裂断补灵源',
    region: 'zhongzhou',
    pool: 'wild',
    tier: 5,
    weight: 3,
    minRealm: 4,
    maxRealm: 7,
    text: '中州灵气主干之一的青龙地脉忽现百丈断层，狂暴地气喷涌而出，眼看就要震塌方圆百里的灵山洞府。几名宗门阵师拼死支撑却难以为继，正急呼同道驰援！',
    choices: [
      {
        label: '倾尽灵力施展阵道合脉术，稳住青龙地脉一月',
        hint: '耗一月 · 功德、声望与阵道法则暴涨',
        cost: { month: 1 },
        outcome: {
          text: '你以自身真元为桥梁贯通断层，整整三十日方令地脉重新续接。青龙灵气反哺而出，令你修为与声望双双大涨。',
          effects: { expPct: 0.3, lawExp: 75, lawId: 'array', karma: 95, reputation: 145, stones: 4500 },
        },
      },
      {
        label: '趁地气喷涌之际，以玄铁玉瓶收取逸散的先天灵煞',
        hint: '重利轻义 · 得大量修为与灵石，略损业力',
        outcome: {
          text: '你未理会阵师呼救，专心鲸吞喷涌而出的精纯地脉灵气，修为暴增却惹来周围修士怒目而视。',
          effects: { expPct: 0.42, stones: 3200, karma: -35, reputation: -40 },
        },
      },
    ],
  },
  {
    id: 'wrh_zz_25',
    title: '中州 · 剑气长城守夜人',
    region: 'zhongzhou',
    pool: 'world',
    tier: 5,
    weight: 3,
    minRealm: 4,
    maxRealm: 7,
    text: '中州极北矗立着一道由万千古剑气凝成的百里青墙，专司抵御域外罡风与魔渊渗漏。今夜星风狂暴，独守城头的独眼剑修老迈力竭，邀你替他共守三夜剑墙。',
    choices: [
      {
        label: '欣然登墙并肩守夜，以剑意补全剑墙缺口',
        hint: '耗一月 · 剑道暴涨，得剑魄通明丹与大功德',
        cost: { month: 1 },
        outcome: {
          text: '狂风如刀刮过百里剑墙，你的剑意在彻夜鏖战中百炼成钢。天明之际，独眼剑修郑重赠你一粒剑魄通明丹。',
          effects: { items: ['jianyi_dan'], lawExp: 80, lawId: 'sword', karma: 65, reputation: 110, attrs: { 道心: 4 } },
        },
      },
      {
        label: '留下一张九霄神雷符助其镇风，再赠两千灵石劳军',
        hint: '消耗九霄神雷符 · 功德与声望大涨',
        require: 'has("jiuxiao_leifu")',
        requireHint: '行囊中无九霄神雷符',
        cost: { item: 'jiuxiao_leifu' },
        outcome: {
          text: '神雷符悬于城头震慑百里妖风，独眼剑修抱拳长拜，将一枚自罡风中拾得的法则残片回赠于你。',
          effects: { items: ['faze_canpian'], karma: 80, reputation: 120 },
        },
      },
    ],
  },
  {
    id: 'wrh_zz_26',
    title: '中州 · 废弃星阁青铜暴走',
    region: 'zhongzhou',
    pool: 'wild',
    tier: 5,
    weight: 3,
    minRealm: 4,
    maxRealm: 7,
    text: '群山掩映着一座废弃数百年的观星偏阁，阁内禁制年久失修，一尊镇守偏阁的观星古守卫因星核过载彻底失控，挥舞青铜巨戟将古籍玉架砸得粉碎！',
    choices: [
      {
        label: '迎击失控的观星古守卫，抢救偏阁上古星典',
        hint: '战观星古守卫 · 得星辰重宝与灵石',
        combat: {
          enemy: 'star_golem',
          win: {
            text: '你摧毁过载星核令巨傀停机，抢下数卷完好星图与一粒周天星辉丹，并收获古守卫体表大量磁砂。',
            effects: { items: ['xinghui_dan', 'xingchen_sha'], stones: 4800, lawExp: 55, lawId: 'star' },
          },
          lose: {
            text: '青铜巨戟势沉力猛，你被震出阁门，眼睁睁看着古阁在轰鸣中化作废墟。',
            effects: { hp: -330, injury: 1 },
          },
        },
      },
      {
        label: '以空间摄物法抢出半部星典便即刻远离坍塌古阁',
        hint: '稳妥 · 星辰感悟与灵石',
        outcome: {
          text: '你精准摄出两块玉简与一袋磁砂，随即飞身离去，片刻后古阁轰然倾塌。',
          effects: { items: ['xingchen_sha'], lawExp: 45, lawId: 'star', stones: 1800 },
        },
      },
    ],
  },
  {
    id: 'wrh_zz_27',
    title: '中州 · 世家红线断恩仇',
    region: 'zhongzhou',
    pool: 'world',
    tier: 5,
    weight: 3,
    minRealm: 4,
    maxRealm: 7,
    text: '中州两大化神世家因三百年前一桩婚约与灵矿旧怨剑拔弩张，数百修士于云梦泽对峙。你开启神识细察，却见两家主脉上空缠绕着诡异猩红因果线——分明有人在暗中催动怨劫！',
    choices: [
      {
        label: '以因果或剑道神通当空斩断怨劫红线，平息两家血仇',
        hint: '悟性 ≥ 34 · 化干戈为玉帛，得重谢',
        require: 'char.attrs.悟性 >= 34',
        requireHint: '悟性不足三十四，难辨怨劫真线',
        outcome: {
          text: '清光斩过虚空，猩红怨丝寸寸化灰！两家老祖骤然惊醒，查出挑拨内奸后齐齐登门厚谢。',
          effects: { stones: 6200, karma: 90, reputation: 150, lawExp: 65, lawId: 'karma', items: ['huashen_dan'] },
        },
      },
      {
        label: '静坐云端观因果缠绕之象，不涉世家私怨',
        hint: '无耗 · 因果法则感悟',
        outcome: {
          text: '你袖手旁观因果聚散，对「种瓜得瓜、业火自燃」的法则多了一层冷峻体悟。',
          effects: { lawExp: 50, lawId: 'karma', attrs: { 道心: 3 } },
        },
      },
    ],
  },
  {
    id: 'wrh_zz_28',
    title: '中州 · 钦天监虚空魔伪装',
    region: 'zhongzhou',
    pool: 'world',
    tier: 5,
    weight: 3,
    minRealm: 4,
    maxRealm: 7,
    text: '圣域钦天监设宴款待九州名修，席间一位风度翩翩的紫袍副监频频向你敬酒。酒杯相碰刹那，你却毛骨悚然——他袖口竟没有影子，举手投足间周遭灵气都在悄无声息地被虚无吞噬！',
    choices: [
      {
        label: '骤然发难击碎紫袍伪装，当殿诛杀域外虚空魔',
        hint: '战域外虚空魔 · 炼虚强敌，震撼圣域',
        combat: {
          enemy: 'void_fiend',
          win: {
            text: '杯盏炸裂，紫袍人骤化漆黑无相魔躯！你力战三百合将其轰杀于御殿之前，钦天监震撼万分，倾囊奉上重宝！',
            effects: { items: ['xukong_jing', 'lianxu_dan', 'faze_canpian'], stones: 9000, reputation: 220, karma: 95 },
          },
          lose: {
            text: '虚空魔暴露即刻施展空间绝杀重创于你，随即撕裂殿顶虚空遁逃无踪。',
            effects: { hp: -420, injury: 2, reputation: 80 },
          },
        },
      },
      {
        label: '不动声色传音钦天监正，待大阵合围再共除魔物',
        hint: '神识检定 · 智破卧底，稳获厚酬',
        roll: {
          p: 0.65,
          attrs: { 神识: 0.012, 悟性: 0.01 },
          success: {
            text: '你以极隐秘神识线示警监正。霎时十二道镇界金柱升起，合众人之力将虚空魔镇杀，你居首功受赏！',
            effects: { items: ['xukong_jing'], stones: 5500, reputation: 150, karma: 70 },
          },
          fail: {
            text: '魔物嗅觉敏锐，察觉传音瞬间便掀翻宴席破窗逃遁，你虽未受伤却错失擒魔良机。',
            effects: { reputation: 50, attrs: { 神识: 3 } },
          },
        },
      },
    ],
  },
  {
    id: 'wrh_zz_29',
    title: '中州 · 秘境残钥争锋',
    region: 'zhongzhou',
    pool: 'wild',
    tier: 5,
    weight: 3,
    minRealm: 4,
    maxRealm: 7,
    text: '中州断云谷古松之下，半枚流淌银辉的秘境残钥破土而出，引来两尊大妖与数名邪修疯狂抢夺。残钥灵光直冲云霄，隐约指向一座尘封数千年的上古丹器秘藏。',
    choices: [
      {
        label: '横扫群雄，力斩领头妖王夺取残钥',
        hint: '战妖王 · 胜得秘藏重宝',
        combat: {
          enemy: 'demon_king',
          win: {
            text: '你一战震退群雄，执残钥开启古松下隐秘石室，独得一粒太虚炼神丹、一柄太虚斩虹剑与数千灵石！',
            effects: { items: ['lianxu_dan', 'taixu_jian'], stones: 5600, reputation: 120, counter: { secrets: 1 } },
          },
          lose: {
            text: '妖王率众合围，你寡不敌众负伤退走，残钥终落入妖族之手。',
            effects: { hp: -340, injury: 1 },
          },
        },
      },
      {
        label: '趁群修混战之际隔空拓印残钥空间频率，暗寻秘藏偏门',
        hint: '气运与神识检定 · 巧夺先机',
        roll: {
          p: 0.6,
          attrs: { 神识: 0.012, 气运: 0.012 },
          success: {
            text: '你抢在众人血拼前从后山空间缝隙潜入秘室，顺手收走一粒化神丹与一块法则残片，悄然退走。',
            effects: { items: ['huashen_dan', 'faze_canpian'], lawExp: 45, lawId: 'space' },
          },
          fail: {
            text: '秘室偏门早已被岁月封死，你只捡了些外围散落的灵石便抽身离去。',
            effects: { stones: 1800, expPct: 0.14 },
          },
        },
      },
    ],
  },
  {
    id: 'wrh_zz_30',
    title: '中州 · 枯荷古池剑灵问心',
    region: 'zhongzhou',
    pool: 'wild',
    tier: 5,
    weight: 3,
    minRealm: 4,
    maxRealm: 7,
    text: '皇城废苑深处有一口干涸的古荷池，池心插着一截青石剑碑。秋风吹过枯荷叶，一缕孤高清绝的太古剑灵残影自池底升起，轻声发问：「世人修剑多求杀伐称雄，阁下持剑，究竟为何？」',
    choices: [
      {
        label: '拔剑以招作答，与太古剑灵残影以剑论心',
        hint: '战太古剑灵残影 · 胜则剑心通明',
        combat: {
          enemy: 'sword_phantom',
          win: {
            text: '枯荷随剑气漫天飞舞，残影在最后一剑中含笑消散，留下一道无上剑道真意与剑魄通明丹。',
            effects: { items: ['jianyi_dan'], lawExp: 85, lawId: 'sword', attrs: { 道心: 5, 悟性: 4 } },
          },
          lose: {
            text: '残影剑意太纯，你略逊一筹败下阵来，然剑心却被洗去不少浮躁。',
            effects: { hp: -260, lawExp: 40, lawId: 'sword', demon: -12 },
          },
        },
      },
      {
        label: '收剑拱手答曰「一剑护己身，一剑斩不平，一剑问长生」',
        hint: '道心大进 · 稳获剑道感悟与清心',
        outcome: {
          text: '剑灵残影静静凝视你良久，微微颔首化作一缕青光没入你眉心。',
          effects: { lawExp: 65, lawId: 'sword', attrs: { 道心: 6 }, demon: -25, expPct: 0.22 },
        },
      },
    ],
  },
  {
    id: 'wrh_zz_31',
    title: '中州 · 秋分雷符秘殿',
    region: 'zhongzhou',
    pool: 'wild',
    tier: 5,
    weight: 3,
    minRealm: 4,
    maxRealm: 7,
    text: '秋分惊雷劈开云雾，中州天雷峰半山腰显露出一座仅在雷夜现世的古符秘殿。殿内石案上供奉着数张闪烁紫金电光的九霄神雷符，殿顶更有无数上古雷篆随电弧明灭不定。',
    choices: [
      {
        label: '硬抗殿门护法雷网，取走石案上的九霄神雷符',
        hint: '根骨检定 · 得九霄神雷符与雷元丹',
        roll: {
          p: 0.62,
          attrs: { 根骨: 0.012, 道心: 0.01 },
          success: {
            text: '你周身灵罡硬顶三道紫电，从容将两张九霄神雷符与一粒紫霄雷元丹收入行囊。',
            effects: { items: [{ id: 'jiuxiao_leifu', qty: 2 }, 'leiyuan_dan'], lawExp: 50, lawId: 'thunder' },
          },
          fail: {
            text: '护法雷网猛然收缩，你只抢出一张九霄神雷符便被弹飞出殿。',
            effects: { items: ['jiuxiao_leifu'], hp: -220 },
          },
        },
      },
      {
        label: '不贪符箓，只仰首临摹殿顶上古雷篆至天明',
        hint: '耗一月 · 雷霆法则暴涨',
        cost: { month: 1 },
        outcome: {
          text: '天明秘殿隐去，你识海中却已牢牢刻下三十六道太古正雷符纹，渡劫之威顿减三分。',
          effects: { lawExp: 85, lawId: 'thunder', attrs: { 悟性: 4 }, breakBonus: 10 },
        },
      },
    ],
  },
  {
    id: 'wrh_zz_32',
    title: '中州 · 圣域古药圃岁枯劫',
    region: 'zhongzhou',
    pool: 'world',
    tier: 5,
    weight: 3,
    minRealm: 4,
    maxRealm: 7,
    text: '中州皇家药圃突发怪异「岁枯劫」——圃中数十株三千年灵药竟在一夜之间迅速枯萎老化，仿佛被无形光阴偷走了寿元。药圃守使急得团团转，重金求高人稳住灵田！',
    choices: [
      {
        label: '引动光阴或丹道法则逆转药圃枯荣之气',
        hint: '光阴/丹道或悟性 ≥ 36 · 救药圃得厚赐',
        require: 'law("time") >= 1 || law("pill") >= 1 || char.attrs.悟性 >= 36',
        requireHint: '需初窥光阴/丹道法则或悟性达到三十六',
        cost: { month: 1 },
        outcome: {
          text: '你以指尖灵韵抚平药圃紊乱的时间流速，枯黄灵叶竟肉眼可见重焕青翠！守使大喜，奉上岁月朝露与大量灵石。',
          effects: { items: ['guangyin_lu'], stones: 5500, lawExp: 70, lawId: 'time', reputation: 125, karma: 60 },
        },
      },
      {
        label: '献出一粒松鹤延寿丹化作药雨浇灌药圃',
        hint: '消耗松鹤延寿丹 · 换取化神丹与九转金丹残方',
        require: 'has("yanshou_dan")',
        requireHint: '行囊中无松鹤延寿丹',
        cost: { item: 'yanshou_dan' },
        outcome: {
          text: '延寿药雨洒遍灵田，枯萎之势应声而止。药圃长老叹服你的大度，以化神丹、五千灵石与丹道秘悟回赠。',
          effects: { items: ['huashen_dan'], stones: 5000, lawExp: 65, lawId: 'pill', karma: 75 },
        },
      },
    ],
  },
  {
    id: 'wrh_zz_33',
    title: '中州 · 玉京星河画舫夜宴',
    region: 'zhongzhou',
    pool: 'world',
    tier: 5,
    weight: 4,
    minRealm: 4,
    maxRealm: 7,
    text: '星河倒映玉带江，一艘通体以白玉雕琢的凌空画舫在百丈高空缓缓游弋。舫上丝竹悠扬，汇聚了中州最负盛名的七位化神天骄与炼虚客卿，正以茶代酒交换各自对十大天地法则的独到见解。',
    choices: [
      {
        label: '登舫献上自身大道感悟，与七位天骄互相印证',
        hint: '耗一月 · 全方位悟道，声望与修为并进',
        cost: { month: 1 },
        outcome: {
          text: '一席夜宴论道至黎明，剑道、星辰、空间诸般妙理碰撞出璀璨火花。你与众天骄皆觉茅塞顿开，相约来日昆仑再会。',
          effects: { expPct: 0.3, attrs: { 悟性: 5, 魅力: 3, 神识: 3 }, lawExp: 60, lawId: 'star', reputation: 95 },
        },
      },
      {
        label: '以三千灵石换取画舫主人珍藏的法则残片',
        hint: '3000 灵石 · 稳得法则残片',
        require: 'stones >= 3000',
        requireHint: '灵石不足三千',
        cost: { stones: 3000 },
        outcome: {
          text: '画舫主人微笑收下灵石，递给你一枚温润如玉的法则残片，祝你早日破境炼虚。',
          effects: { items: ['faze_canpian'], reputation: 45 },
        },
      },
    ],
  },
  {
    id: 'wrh_zz_34',
    title: '中州 · 万宝顶楼玉简暗拍',
    region: 'zhongzhou',
    pool: 'world',
    tier: 5,
    weight: 3,
    minRealm: 4,
    maxRealm: 7,
    text: '中州万宝总阁顶层今夜仅发九枚鎏金请柬，压轴之物竟是两卷难得一见的天阶玉简——《太虚挪移经》与《天机因果秘录》，另附一枚极品炼虚宝丹。珠帘之后暗流涌动，皆是挥金如土的一方老祖。',
    choices: [
      {
        label: '豪掷一万五千灵石，一举竞下《太虚挪移经》',
        hint: '15000 灵石 · 得天阶空间秘典',
        require: 'stones >= 15000',
        requireHint: '灵石不足一万五千',
        cost: { stones: 15000 },
        outcome: {
          text: '你举牌定音，众老祖纷纷让步。侍者双手奉上虚空晶匣，天阶空间绝学自此归你所有。',
          effects: { items: ['yujian_xukong'], reputation: 110, lawExp: 45, lawId: 'space' },
        },
      },
      {
        label: '出价一万两千灵石，拍下太虚炼神丹与法则残片组',
        hint: '12000 灵石 · 得炼虚宝丹与法则残片',
        require: 'stones >= 12000',
        requireHint: '灵石不足一万二千',
        cost: { stones: 12000 },
        outcome: {
          text: '落槌声响，两件破境至宝稳稳收入囊中，令你冲击更高境界底气倍增。',
          effects: { items: ['lianxu_dan', 'faze_canpian'], reputation: 85 },
        },
      },
      {
        label: '只作壁上观，暗中结交邻席一位炼虚丹道名宿',
        hint: '无耗 · 魅力与丹道小进',
        outcome: {
          text: '你与邻席老丹师相谈甚欢，获赠一粒大还丹与数句丹道提点，满载而归。',
          effects: { items: ['dahuan_dan'], attrs: { 魅力: 3 }, lawExp: 35, lawId: 'pill' },
        },
      },
    ],
  },

  /* ============================================================================
   * 三、昆仑墟界（kunlun，45 节点，minRealm: 5, maxRealm: 8）
   * ============================================================================ */

  // ---------- 链一：太古玉虚仙宫（4 段） ----------
  {
    id: 'wrh_kl_palace_1',
    title: '昆仑 · 玉虚残宫破云现',
    region: 'kunlun',
    pool: 'wild',
    tier: 6,
    weight: 4,
    minRealm: 5,
    maxRealm: 8,
    once: true,
    text: '昆仑墟界九万里罡风忽分左右，一座断壁残垣却仍气势恢宏的白玉仙宫自时空迷雾中缓缓浮现。宫门牌匾「玉虚」二字虽被太古神通斩去半边，余韵却仍令天地灵气自主朝拜。\n\n白玉阶前满地皆是干涸万载的金色仙血与碎裂法宝残片，一缕穿透万古的沧桑钟声自大殿深处悠悠传来。',
    choices: [
      {
        label: '踏过仙血玉阶，直入玉虚残宫正殿',
        hint: '步入仙宫 · 探寻太古仙藏',
        cost: { month: 1 },
        outcome: {
          text: '你敛息凝神迈入白玉大门，身周空间骤然一沉——此地竟仍保留着太古时代十倍于下界的灵气浓度！',
          effects: { expPct: 0.22, attrs: { 道心: 3 }, flag: { 踏入玉虚仙宫: true } },
          goto: 'wrh_kl_palace_2',
        },
      },
      {
        label: '先以神识细察宫门剑痕，体悟上古仙战法则',
        hint: '悟性与神识检定 · 预得仙道体悟',
        roll: {
          p: 0.62,
          attrs: { 悟性: 0.01, 神识: 0.01 },
          success: {
            text: '你自牌匾残痕中窥见当年一剑破宫的太古剑意，识海豁然开朗，更提前看破殿前两处杀阵盲点。',
            effects: { lawExp: 65, lawId: 'sword', attrs: { 悟性: 4 }, flag: { 悟透玉虚门痕: true } },
            goto: 'wrh_kl_palace_2',
          },
          fail: {
            text: '残存仙威霸道绝伦，险些震散你的神识海。你强稳心神迈入宫门，气血微亏。',
            effects: { hp: -280, expPct: 0.14 },
            goto: 'wrh_kl_palace_2',
          },
        },
      },
      {
        label: '仅在阶前拾取数块染血仙石与法则残片便退走',
        hint: '稳妥 · 不犯古宫凶险',
        outcome: {
          text: '你深知太古仙宫步步杀机，于阶下拾得一块法则残片与些许仙晶灵石便飘然离去。',
          effects: { items: ['faze_canpian'], stones: 8500, expPct: 0.16 },
        },
      },
    ],
  },
  {
    id: 'wrh_kl_palace_2',
    title: '昆仑 · 古玉神将镇玉阶',
    region: 'kunlun',
    pool: 'branch',
    tier: 6,
    weight: 0,
    text: (s) => `玉虚前殿广逾十里，三十六根盘龙玉柱半数倾颓。${s.flags['悟透玉虚门痕'] ? '你巧避两处潜藏杀阵，' : '你刚踏过殿心太极图，'}一尊通体由昆仑暖玉雕琢的十丈神将骤然亮起古篆金纹！它手持玄玉重戟，虽灵智已失，仍本能地向闯入者轰出镇山河之威！`,
    choices: [
      {
        label: '施展法相神通硬撼昆仑古玉神将',
        hint: '战昆仑古玉神将 · 合体级恶战',
        combat: {
          enemy: 'kunlun_guardian',
          win: {
            text: '玉屑纷飞如雪，你一击碎其眉心古印。神将缓缓单膝跪地，手中重戟化作清光消散，露出通往内殿的玉虹长桥。',
            effects: { expPct: 0.34, stones: 18000, attrs: { 根骨: 5 }, flag: { 破玉虚神将: true } },
            goto: 'wrh_kl_palace_3',
          },
          lose: {
            text: '古玉神将坚逾仙金，一戟将你震飞出宫门百丈，周身经脉剧痛难当。',
            effects: { hp: -520, injury: 2 },
          },
        },
      },
      {
        label: '以空间与阵道法则错位挪移，越过神将直闯内殿',
        hint: '空间/阵道 ≥ 2 或神识 ≥ 48 · 智过玉将',
        require: 'law("space") >= 2 || law("array") >= 2 || char.attrs.神识 >= 48',
        requireHint: '需空间/阵道略有小成或神识达到四十八',
        roll: {
          p: 0.65,
          attrs: { 神识: 0.01, 悟性: 0.01 },
          success: {
            text: '你步踏虚空褶皱，在重戟劈落前毫厘间折跃至玉虹长桥之上，古玉神将因殿规所限只能止步怒吼。',
            effects: { lawExp: 75, lawId: 'space', attrs: { 神识: 4 }, flag: { 虚空越神将: true } },
            goto: 'wrh_kl_palace_3',
          },
          fail: {
            text: '重戟余波扫中护体罡气，你借反震之力强行冲入内殿玉门，口吐鲜血。',
            effects: { hp: -380, injury: 1 },
            goto: 'wrh_kl_palace_3',
          },
        },
      },
    ],
  },
  {
    id: 'wrh_kl_palace_3',
    title: '昆仑 · 剑冢镇灵试仙心',
    region: 'kunlun',
    pool: 'branch',
    tier: 6,
    weight: 0,
    text: '玉虹长桥尽头竟是一座悬于星渊之上的剑池，百余柄折断的太古仙剑斜插白玉池底，杀伐之气割得虚空不断渗出黑痕。剑池中央百剑残意合凝，化作一尊无面持剑的「仙剑冢镇灵」，冷冷指向你眉心！',
    choices: [
      {
        label: '以无畏道心直面仙剑冢镇灵，争锋太古仙剑意',
        hint: '战仙剑冢镇灵 · 大乘级死斗，极险重宝',
        combat: {
          enemy: 'immortal_sword_remnant',
          win: {
            text: '百剑哀鸣伏首！你竟以凡躯之剑斩碎太古镇灵，整座玉虚剑池清光大放，直指后殿太古仙库！',
            effects: { expPct: 0.42, lawExp: 110, lawId: 'sword', reputation: 280, flag: { 斩服玉虚剑灵: true } },
            goto: 'wrh_kl_palace_4',
          },
          lose: {
            text: '仙剑之威斩断万法，你拼尽护身底牌方保住元神不灭，重伤坠离白玉仙宫。',
            effects: { hp: -680, injury: 2, lawExp: 50, lawId: 'sword' },
          },
        },
      },
      {
        label: '凭道心硬承三剑，求取通行资格',
        hint: '道心 ≥ 55 · 耗两月，以守代攻',
        require: 'char.attrs.道心 >= 55',
        requireHint: '道心不足五十五，难承太古仙剑三斩',
        cost: { month: 2 },
        roll: {
          p: 0.64,
          attrs: { 道心: 0.009, 根骨: 0.009 },
          success: {
            text: '三道足以劈裂星辰的剑虹落下，你口吐金血却寸步未退。镇灵收剑化作清风散去，为你让开仙库石门！',
            effects: { hp: -260, attrs: { 道心: 7, 根骨: 5 }, lawExp: 70, lawId: 'sword', flag: { 硬承三剑过关: true } },
            goto: 'wrh_kl_palace_4',
          },
          fail: {
            text: '第三剑终究撕碎你的护体仙罡，你被剑气扫出剑池，只来得及捉住一缕飘散剑意。',
            effects: { hp: -480, injury: 2, lawExp: 35, lawId: 'sword' },
          },
        },
      },
    ],
  },
  {
    id: 'wrh_kl_palace_4',
    title: '昆仑 · 玉虚仙库择神兵',
    region: 'kunlun',
    pool: 'branch',
    tier: 6,
    weight: 0,
    text: '玉虚后殿空旷寂寥，万载时光令多数丹药化作飞灰，唯有三座先天玉台上的至宝历经沧桑仍神光不灭：一面定界「昆仑照界镜」、半截杀伐无双的「诛仙残剑」，以及玉碗中一颗霞光万丈的「悟道果」与「混元合道丹」。',
    choices: [
      {
        label: '收取仙器「诛仙残剑」与混元合道丹',
        hint: '太古杀伐仙器 · 称号「玉虚承剑尊」',
        outcome: {
          text: '诛仙残剑入手轰鸣，九天云海竟为之退避百里！你收起合道圣丹走出仙宫，天地大道尽在脚下。',
          effects: { items: ['zhuxian_canjian', 'heti_dan'], reputation: 260, lawExp: 90, lawId: 'sword', title: '玉虚承剑尊', counter: { secrets: 1 } },
        },
      },
      {
        label: '收取灵宝「昆仑照界镜」与悟道果',
        hint: '镇空神镜与太古道果 · 称号「照界仙君」',
        outcome: {
          text: '照界镜光一闪定住方圆十里罡风，你摘下悟道果飘然离宫，合体大乘之路再无阻隔。',
          effects: { items: ['kunlun_jing', 'dao_fruit'], reputation: 240, lawExp: 90, lawId: 'space', title: '照界仙君', counter: { secrets: 1 } },
        },
      },
    ],
  },

  // ---------- 链二：冰封岁月长河（4 段） ----------
  {
    id: 'wrh_kl_river_1',
    title: '昆仑 · 岁月冻河映古今',
    region: 'kunlun',
    pool: 'wild',
    tier: 6,
    weight: 4,
    minRealm: 5,
    maxRealm: 8,
    once: true,
    text: '昆仑极北雪渊深处横亘着一条千丈宽的琉璃冰河，河水早已凝固成透明玄冰，然冰层之下却清晰封冻着无数太古瞬影——展翅欲飞的火凤、劈开山岳的剑仙、甚至一朵正要绽放的混沌青莲，全被光阴法则冻结在半息之间！',
    choices: [
      {
        label: '踏上琉璃冻河，循着光阴气息逆流探寻源头',
        hint: '耗一月 · 步入冰封岁月长河',
        cost: { month: 1 },
        outcome: {
          text: '靴底踏冰无声，每迈一步周身岁月流速便忽快忽慢。你稳守丹田寿元，逆流深入雪渊腹地。',
          effects: { lawExp: 55, lawId: 'time', attrs: { 道心: 3 }, flag: { 踏入岁月冻河: true } },
          goto: 'wrh_kl_river_2',
        },
      },
      {
        label: '立于河岸俯瞰冰下万古众生相，静悟光阴长河',
        hint: '耗两月 · 稳获光阴法则与寿元',
        cost: { month: 2 },
        outcome: {
          text: '你未敢贸然涉河，只观冰中凝固的生灭百态六十日，竟延寿六十载，心境宛如古井无波。',
          effects: { lawExp: 75, lawId: 'time', lifespan: 60, expPct: 0.28 },
        },
      },
    ],
  },
  {
    id: 'wrh_kl_river_2',
    title: '昆仑 · 玄冥寒帝残魂醒',
    region: 'kunlun',
    pool: 'branch',
    tier: 6,
    weight: 0,
    text: '冻河中游冰崖如剑戟林立，崖畔冰莲座上骤然凝出一道白衣胜雪、眉目冷若霜华的太古女帝神魂。她素手轻抬，万里灵气刹那凝结成冰：「何方后辈，敢扰本帝封岁长眠？」',
    choices: [
      {
        label: '催动至阳真元破冰迎战玄冥寒帝残魂',
        hint: '战玄冥寒帝残魂 · 合体绝巅强敌',
        combat: {
          enemy: 'frost_empress',
          win: {
            text: '寒冰领域寸寸崩碎，女帝残魂轻叹一声化作漫天冰晶消散，临去前留下一滴晶莹剔透的岁月朝露。',
            effects: { items: ['guangyin_lu'], expPct: 0.34, lawExp: 70, lawId: 'time', flag: { 破寒帝残魂: true } },
            goto: 'wrh_kl_river_3',
          },
          lose: {
            text: '玄冥寒气几乎将你的元神彻底冰封，你燃烧一口真血震碎寒枷，踉跄退离雪渊。',
            effects: { hp: -500, lifespan: -25, injury: 2 },
          },
        },
      },
      {
        label: '以光阴法则或高深道心共鸣冰河，向女帝请教封岁之秘',
        hint: '光阴法则 ≥ 2 或道心 ≥ 52 · 论道感寒帝',
        require: 'law("time") >= 2 || char.attrs.道心 >= 52',
        requireHint: '需光阴法则略有小成或道心达到五十二',
        roll: {
          p: 0.66,
          attrs: { 道心: 0.009, 悟性: 0.01 },
          success: {
            text: '女帝冰冷眼眸闪过一丝异彩，收起寒意指点你三句封岁真诀，随即隐入冰崖让你安然溯流而上。',
            effects: { lawExp: 85, lawId: 'time', attrs: { 悟性: 5, 道心: 4 }, flag: { 寒帝指点封岁: true } },
            goto: 'wrh_kl_river_3',
          },
          fail: {
            text: '女帝嫌你领悟粗浅，挥袖冻伤你护体灵光，但终究未下杀手，放你继续前行。',
            effects: { hp: -310, attrs: { 悟性: 2 } },
            goto: 'wrh_kl_river_3',
          },
        },
      },
    ],
  },
  {
    id: 'wrh_kl_river_3',
    title: '昆仑 · 河源阴阳古尊拦路',
    region: 'kunlun',
    pool: 'branch',
    tier: 6,
    weight: 0,
    text: '抵达冻河尽头，冰层在此融化成一口黑白双鱼流转的灵潭，潭心竟生着一截通天建木嫩枝与九品青莲！然潭畔早有一位避世三万载的大乘「阴阳混元古尊」负手而立，笑道：「小友能走到此处着实不易，但潭中奇珍，须过老夫太极两仪关。」',
    choices: [
      {
        label: '倾力硬撼阴阳混元古尊，以战证道夺灵潭',
        hint: '战阴阳混元古尊 · 大乘老尊恶战',
        combat: {
          enemy: 'yin_yang_elder',
          win: {
            text: '太极双鱼被你强行劈开一道缺口！古尊抚须大笑收手：「后生可畏，万年难见！这口岁潭合该归你！」',
            effects: { expPct: 0.42, reputation: 250, attrs: { 悟性: 6 }, flag: { 胜阴阳古尊: true } },
            goto: 'wrh_kl_river_4',
          },
          lose: {
            text: '古尊太极圆融无瑕，将你诸般神通尽数化去。你力竭认输，古尊却仍允你采一滴朝露离去。',
            effects: { hp: -540, items: ['guangyin_lu'], attrs: { 悟性: 3 } },
          },
        },
      },
      {
        label: '不争胜负，以自身对生死阴阳的体悟与古尊坐论半年',
        hint: '耗半年 · 悟性 ≥ 50，智取古尊认可',
        require: 'char.attrs.悟性 >= 50',
        requireHint: '悟性不足五十，难以跟上大乘古尊思路',
        cost: { month: 6 },
        roll: {
          p: 0.68,
          attrs: { 悟性: 0.009, 道心: 0.009 },
          success: {
            text: '半年清谈直指阴阳未分之初，古尊闻言大畅，欣然让出潭畔宝座，挥袖步入雪雾深处。',
            effects: { expPct: 0.38, lawExp: 95, lawId: 'chaos', attrs: { 悟性: 7, 道心: 5 }, flag: { 论道服古尊: true } },
            goto: 'wrh_kl_river_4',
          },
          fail: {
            text: '论至深处终究差了一筹境界，古尊叹息一声独自取走半数潭珍，留余泽于你。',
            effects: { expPct: 0.25, lawExp: 55, lawId: 'time', items: ['guangyin_lu'] },
          },
        },
      },
    ],
  },
  {
    id: 'wrh_kl_river_4',
    title: '昆仑 · 建木生机与天道莲',
    region: 'kunlun',
    pool: 'branch',
    tier: 6,
    weight: 0,
    text: '黑白灵潭雾气散去，建木嫩枝滴落滚烫生机，一朵九品「天道莲」正在潭心缓缓舒展花瓣，涤荡一切心魔尘垢。岁月长河的浩瀚造化，尽悬于你指尖。',
    choices: [
      {
        label: '采下天道莲与昆仑建木枝，备作大乘破境底牌',
        hint: '得仙阶天道莲、昆仑建木枝与称号',
        outcome: {
          text: '天道莲与建木枝刚入玉匣，你便感寿元大增、道心清澈无瑕，已然立于问鼎大乘之巅。',
          effects: { items: ['tiandao_lotus', 'kunlun_shenmu'], lifespan: 120, demon: -35, reputation: 220, title: '岁河溯源客', counter: { secrets: 1 } },
        },
      },
      {
        label: '取岁月朝露与昆仑建木枝，于灵潭畔感悟光阴轮回一载',
        hint: '耗一年 · 光阴法则与寿元暴涨',
        cost: { month: 12 },
        outcome: {
          text: '灵潭一年胜过红尘百载。待你起身踏出冻河，发丝黑亮如墨，一念之间似可令风雪停滞。',
          effects: { items: ['guangyin_lu', 'kunlun_shenmu'], expPct: 0.55, lawExp: 130, lawId: 'time', lifespan: 220, attrs: { 悟性: 7, 道心: 7 }, title: '光阴执掌者', counter: { secrets: 1 } },
        },
      },
    ],
  },

  // ---------- 链三：混沌太初裂渊（3 段） ----------
  {
    id: 'wrh_kl_chaos_1',
    title: '昆仑 · 混沌渊口涌母气',
    region: 'kunlun',
    pool: 'wild',
    tier: 6,
    weight: 4,
    minRealm: 5,
    maxRealm: 8,
    once: true,
    text: '昆仑墟界最深处裂开一道深不见底的灰金大渊，渊内五行不存、时空混沌，一缕缕重若山岳的玄黄混沌母气自地底升腾而起。\n\n渊口盘踞着一头刚自太古沉眠中苏醒的混沌巨兽，鳞甲吞吐灰雾，正贪婪吸食着升腾的混沌母气！',
    choices: [
      {
        label: '迎击太古混沌兽，强占渊口混沌灵眼',
        hint: '战太古混沌兽 · 胜则深入太初渊底',
        combat: {
          enemy: 'chaos_beast',
          win: {
            text: '你在崩塌法则中生生击退混沌巨兽，一缕重如千钧的混沌母气顺势落入你掌心！渊底隐隐透出更耀眼的乳白灵光。',
            effects: { items: ['hundun_muqi'], expPct: 0.34, lawExp: 75, lawId: 'chaos', flag: { 渊口胜混沌兽: true } },
            goto: 'wrh_kl_chaos_2',
          },
          lose: {
            text: '混沌兽一口吐息令你护体神通尽数失效，你狼狈遁出大渊百里，元气大伤。',
            effects: { hp: -520, injury: 2 },
          },
        },
      },
      {
        label: '以混沌或五行归元法悄然分流母气，避兽锋芒滑入深渊',
        hint: '悟性 ≥ 46 且神识 ≥ 44 · 暗度陈仓',
        require: 'char.attrs.悟性 >= 46 && char.attrs.神识 >= 44',
        requireHint: '悟性或神识不足，难在混沌兽眼皮下潜入',
        roll: {
          p: 0.62,
          attrs: { 悟性: 0.01, 神识: 0.01 },
          success: {
            text: '你身化清浊灰气与渊雾融为一体，竟在混沌兽毫未察觉间悄然掠入深渊下层！',
            effects: { lawExp: 70, lawId: 'chaos', attrs: { 神识: 4 }, flag: { 潜入混沌渊底: true } },
            goto: 'wrh_kl_chaos_2',
          },
          fail: {
            text: '刚潜百丈便被混沌兽一尾扫中背脊，你借势坠入渊底，虽重伤却也摆脱了巨兽追击。',
            effects: { hp: -380, injury: 1 },
            goto: 'wrh_kl_chaos_2',
          },
        },
      },
    ],
  },
  {
    id: 'wrh_kl_chaos_2',
    title: '昆仑 · 虚空魔帝跨界投影',
    region: 'kunlun',
    pool: 'branch',
    tier: 6,
    weight: 0,
    text: '灰金渊底竟漂浮着一池乳白色的「混沌初开灵液」，池畔石壁刻满先天太初道文！然就在此刻，渊顶漆黑苍穹猛然撕裂——一只遮蔽天日的魔掌探入裂渊，大乘级「虚空魔帝」竟隔着界海投下分身，欲将整口混沌灵池连根掠走！',
    choices: [
      {
        label: '「下界机缘，岂容域外魔帝染指！」——死战虚空魔帝投影',
        hint: '战虚空魔帝 · 惊天动地的大乘死战',
        combat: {
          enemy: 'void_emperor',
          win: {
            text: '混沌与虚空两股至高法则剧烈对撞，魔帝投影轰然炸裂！裂天黑缝缓缓闭合，整座混沌渊底归你独掌！',
            effects: { expPct: 0.45, reputation: 300, karma: 120, lawExp: 110, lawId: 'chaos', flag: { 斩碎魔帝投影: true } },
            goto: 'wrh_kl_chaos_3',
          },
          lose: {
            text: '虚空魔帝投影之威犹胜寻常大乘，一掌震碎半座渊壁，你拼命逃出混沌渊，仅剩半条性命。',
            effects: { hp: -720, injury: 2, reputation: 80 },
          },
        },
      },
      {
        label: '引动渊底混沌母气自爆冲击界壁，斩断魔帝投影降临通道',
        hint: '消耗混沌母气 · 断界驱帝，奇谋制胜',
        require: 'has("hundun_muqi")',
        requireHint: '行囊中无混沌母气',
        cost: { item: 'hundun_muqi' },
        outcome: {
          text: '混沌母气轰然炸开玄黄风暴，生生将魔帝跨界通道震得粉碎！魔帝怒啸被隔绝在界海之外，渊底灵池安然无恙。',
          effects: { expPct: 0.35, reputation: 220, karma: 95, lawExp: 90, lawId: 'chaos', flag: { 爆气断魔帝路: true } },
          goto: 'wrh_kl_chaos_3',
        },
      },
    ],
  },
  {
    id: 'wrh_kl_chaos_3',
    title: '昆仑 · 太初石壁得仙典',
    region: 'kunlun',
    pool: 'branch',
    tier: 6,
    weight: 0,
    text: '渊底重归太古静谧，乳白混沌灵液氤氲飘香，石壁上《混沌太初仙典》的先天道文逐一亮起金光，仿佛等待了亿万年方迎来真正能承接混沌大道的传人。',
    choices: [
      {
        label: '拓印仙阶秘典《混沌太初仙典》，并收取混沌初开灵液',
        hint: '得仙阶混沌玉简、混沌灵液与至高称号',
        outcome: {
          text: '道文如星瀑涌入识海，灵液入瓶清香扑鼻。你一步踏出混沌裂渊，周身清浊流转，已有几分太古仙神气象。',
          effects: { items: ['yujian_hundun', 'hundun_lingye'], lawExp: 120, lawId: 'chaos', reputation: 260, title: '太初混沌传人', counter: { secrets: 1 } },
        },
      },
      {
        label: '就地饮尽半池混沌灵液，闭关脱胎换骨半年',
        hint: '耗半年 · 修为、全属性与混沌法则飞升',
        cost: { month: 6 },
        outcome: {
          text: '混沌灵液化作天地初开般的磅礴造化重塑你的筋骨元神。半年后你破渊而出，举手投足隐有开天之意。',
          effects: { expPct: 0.65, lawExp: 150, lawId: 'chaos', attrs: { 根骨: 8, 悟性: 8, 气运: 6 }, items: ['hundun_muqi'], title: '渊底重塑仙躯', counter: { secrets: 1 } },
        },
      },
    ],
  },

  // ---------- 独立奇遇 34 段（wrh_kl_01 ~ wrh_kl_34） ----------
  {
    id: 'wrh_kl_01',
    title: '昆仑 · 碎金天车遗骸',
    region: 'kunlun',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 5,
    maxRealm: 8,
    text: '黑曜石断峰之巅斜插着半截百丈黄金战车残骸，车轮曾碾碎星辰，如今却布满焦黑爪痕与凝固仙血。车厢破口处隐隐闪烁着宝丹霞光，一尊残破古玉神将仍忠心守在车辕之前。',
    choices: [
      {
        label: '击败护车昆仑古玉神将，清点太古天车遗珍',
        hint: '战昆仑古玉神将 · 得仙灵丹与丰厚灵石',
        combat: {
          enemy: 'kunlun_guardian',
          win: {
            text: '神将轰然倒塌，你步入残破车厢，从黄金暗格中取出一粒仙灵丹、一块虚空晶与海量上品灵石。',
            effects: { items: ['xianling_dan', 'xukong_jing'], stones: 22000, expPct: 0.28 },
          },
          lose: {
            text: '护车神将悍勇无匹，重戟震得你虎口淌血，只得退出断峰。',
            effects: { hp: -480, injury: 2 },
          },
        },
      },
      {
        label: '观摩车轮上残留的太古碾空符纹一月',
        hint: '耗一月 · 空间与阵道法则双进',
        cost: { month: 1 },
        outcome: {
          text: '黄金车轮铭刻着横渡星海的绝世古阵。你静悟三十日，对空间挪移的理解陡然精深。',
          effects: { lawExp: 80, lawId: 'space', attrs: { 悟性: 5 }, expPct: 0.22 },
        },
      },
    ],
  },
  {
    id: 'wrh_kl_02',
    title: '昆仑 · 通天建木枯桩',
    region: 'kunlun',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 5,
    maxRealm: 8,
    text: '传闻上古连通天地人三界的通天建木早于仙战中折断，如今在昆仑雾谷仍留有一截方圆十里的巨大树桩。枯桩断口处竟奇迹般抽出一枝翠绿嫩芽，周围生机浓郁得化作碧色灵雨。',
    choices: [
      {
        label: '以温润灵力轻折一截昆仑建木枝，反哺树桩灵脉',
        hint: '得奇珍昆仑建木枝与光阴感悟',
        outcome: {
          text: '你先以精纯灵力滋润古桩，随即取下那截翠绿嫩枝。枯桩微微轻颤，似对你的敬意报以祝福。',
          effects: { items: ['kunlun_shenmu'], lawExp: 65, lawId: 'time', lifespan: 50, karma: 40 },
        },
      },
      {
        label: '不折灵枝，只在碧色灵雨下静坐吐纳两月',
        hint: '耗两月 · 寿元暴增，伤势心魔尽愈',
        cost: { month: 2 },
        outcome: {
          text: '建木生机洗刷周身百骸，你多年暗伤尽数痊愈，寿元足足增长百廿载！',
          effects: { lifespan: 120, heal: 3, demon: -35, expPct: 0.34, attrs: { 根骨: 5 } },
        },
      },
    ],
  },
  {
    id: 'wrh_kl_03',
    title: '昆仑 · 血海古祖祭坛苏醒',
    region: 'kunlun',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 5,
    maxRealm: 8,
    text: '昆仑赤壑深处竟藏着一座太古魔渊祭坛，漫天红潮如帷幕垂落。祭坛正中，大乘级的「血海古祖」一缕神念借万年残血重聚魔躯，挥袖之间方圆百里皆化作滔天血海！',
    choices: [
      {
        label: '正面硬撼血海古祖，以无上神通蒸干太古血潮',
        hint: '战血海古祖 · 大乘恶战，重赏无双',
        combat: {
          enemy: 'blood_ocean_lord',
          win: {
            text: '剑雷焚海，血潮化作漫天赤雾散尽！血海古祖不甘咆哮着溃散，留下一粒大乘紫气丹与海量血道感悟。',
            effects: { items: ['dacheng_dan', 'xuesha_jing'], lawExp: 110, lawId: 'blood', reputation: 280, karma: 110 },
          },
          lose: {
            text: '血海不枯魔躯不灭，你被红潮卷得经脉欲裂，耗尽遁符才逃离赤壑。',
            effects: { hp: -650, injury: 2, demon: 15 },
          },
        },
      },
      {
        label: '在百里外静观血海法则运转，待潮汐退去便悄然离去',
        hint: '稳健避战 · 悟血海法则与道心',
        outcome: {
          text: '你知大乘魔祖不可轻犯，隐匿气息观摩血海生灭三日，将杀伐之理化入自身剑意。',
          effects: { lawExp: 65, lawId: 'blood', attrs: { 道心: 3 }, expPct: 0.2 },
        },
      },
    ],
  },
  {
    id: 'wrh_kl_04',
    title: '昆仑 · 噬星天妖吞月谷',
    region: 'kunlun',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 5,
    maxRealm: 8,
    text: '昆仑深谷夜空诡异漆黑，连星辰银辉都被一只盘踞山巅的异兽鲸吞入腹——那是横渡界海而来的「噬星天妖」，周身旋转着数道漆黑星涡，谷底散落着它消化不了的星辰仙玉。',
    choices: [
      {
        label: '斩杀噬星天妖，夺取谷底星辰秘藏',
        hint: '战噬星天妖 · 胜得星辉丹、法则残片与巨额灵石',
        combat: {
          enemy: 'star_devourer',
          win: {
            text: '你轰碎其周身星涡，将吞星异兽彻底镇杀！谷底夜空重现璀璨星河，你收获周天星辉丹与两块法则残片。',
            effects: { items: ['xinghui_dan', { id: 'faze_canpian', qty: 2 }], stones: 24000, lawExp: 85, lawId: 'star' },
          },
          lose: {
            text: '你的神通被星涡尽数吞噬反震，身受重创狼狈退出山谷。',
            effects: { hp: -520, injury: 2 },
          },
        },
      },
      {
        label: '趁天妖仰首吞星时潜入谷底暗取星核碎片',
        hint: '气运与神识检定 · 虎口拔牙',
        roll: {
          p: 0.58,
          attrs: { 神识: 0.01, 气运: 0.012 },
          success: {
            text: '你借黑影潜行至谷底，卷走一枚周天星辉丹与一块虚空晶，全身而退！',
            effects: { items: ['xinghui_dan', 'xukong_jing'], lawExp: 45, lawId: 'star' },
          },
          fail: {
            text: '星涡引力骤然扫过谷底，你被余威震飞出谷，幸好保住性命。',
            effects: { hp: -320, stones: 3000 },
          },
        },
      },
    ],
  },
  {
    id: 'wrh_kl_05',
    title: '昆仑 · 太古金龙王盘绝巅',
    region: 'kunlun',
    pool: 'world',
    tier: 6,
    weight: 3,
    minRealm: 5,
    maxRealm: 8,
    text: '昆仑万山祖脉极巅云雾翻涌，一头身长千丈的五爪金龙盘踞雪峰，每一片龙鳞皆如大日铸就。见你御空登临，金龙王缓缓睁开黄金竖瞳，龙威压得虚空咯吱作响：「人族修士，敢来本王龙庭何事？」',
    choices: [
      {
        label: '昂首向太古金龙王请教一战，以龙威锻打大乘体魄',
        hint: '战太古金龙王 · 大乘龙威试炼',
        combat: {
          enemy: 'golden_dragon_king',
          win: {
            text: '九霄龙吟震碎万里雪云！你竟生生接下五爪金龙王全力龙息并压其半筹！龙王大笑赏你真龙精血与仙灵丹！',
            effects: { items: ['longxue_jing', 'xianling_dan'], attrs: { 根骨: 8, 气运: 5 }, reputation: 300 },
          },
          lose: {
            text: '五爪金龙王实力深不可测，你虽被一爪拍落雪峰，然金龙王赞你胆气非凡，抛下一滴龙血精相赠。',
            effects: { hp: -580, items: ['longxue_jing'], reputation: 90 },
          },
        },
      },
      {
        label: '执古礼拱手相敬，献上一粒混元合道丹求换龙庭秘悟',
        hint: '消耗混元合道丹 · 获真龙赐福与长生果',
        require: 'has("heti_dan")',
        requireHint: '行囊中无混元合道丹',
        cost: { item: 'heti_dan' },
        outcome: {
          text: '金龙王见宝丹欣然大悦，吐出一口先天真龙紫气为你洗髓，更赐下一枚珍藏万载的太乙长生果！',
          effects: { items: ['changsheng_guo'], attrs: { 根骨: 7, 气运: 5 }, lifespan: 100, reputation: 150 },
        },
      },
      {
        label: '恭敬行礼后退下龙脉雪峰，远观真龙吐纳风云',
        hint: '稳妥 · 根骨与气运微增',
        outcome: {
          text: '金龙王微微闭目不再理会。你退至三十里外静观龙气吞吐三日，修为有所精进。',
          effects: { expPct: 0.22, attrs: { 根骨: 3, 气运: 2 } },
        },
      },
    ],
  },
  {
    id: 'wrh_kl_06',
    title: '昆仑 · 修罗血原战古魔',
    region: 'kunlun',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 5,
    maxRealm: 8,
    text: '昆仑西南一片焦赤原野上杀气冲天，一尊三头六臂、手持六件断仙兵的「修罗古战魔」正在仰天狂吼。它生于上古血战煞气之中，只求痛快一战，见你踏足原野便携血色风暴直扑而来！',
    choices: [
      {
        label: '拔剑迎击修罗古战魔，以杀止杀磨砺极境战意',
        hint: '战修罗古战魔 · 合体狂战，得重宝与血道法则',
        combat: {
          enemy: 'crimson_asura',
          win: {
            text: '六臂尽断，修罗古战魔临散前反而畅快大笑！原野煞气散去，显露出一粒混元合道丹与两万灵石。',
            effects: { items: ['heti_dan', 'xuesha_jing'], stones: 20000, lawExp: 90, lawId: 'blood', attrs: { 根骨: 5 } },
          },
          lose: {
            text: '古战魔越战越狂，六柄残兵轮番猛攻令你险象环生，只得撕裂空间远遁。',
            effects: { hp: -560, injury: 2 },
          },
        },
      },
      {
        label: '以空间挪移术引开战魔，避其锋芒另寻他路',
        hint: '耗灵力 · 空间法则小悟',
        outcome: {
          text: '你在原野上连踏七步空间折跃，成功甩开悍不畏死的修罗战魔。',
          effects: { mpPct: -0.35, lawExp: 50, lawId: 'space', expPct: 0.14 },
        },
      },
    ],
  },
  {
    id: 'wrh_kl_07',
    title: '昆仑 · 万古老怪煮星茶',
    region: 'kunlun',
    pool: 'world',
    tier: 6,
    weight: 3,
    minRealm: 5,
    maxRealm: 8,
    text: '雪崖半腰悬着一间歪斜草庐，庐前坐着一位浑身灰袍、连自己出身人族还是妖族都早已忘却的「万古老怪」。它正以三颗缩小星辰作炭火煮一壶清茶，浑浊老眼忽地转向你：「小家伙，陪老朽喝杯茶，还是给老朽当点心？」',
    choices: [
      {
        label: '从容落座共饮星茶，讲述当代九州风物换其欢心',
        hint: '魅力与道心检定 · 胜则得老怪重宝',
        roll: {
          p: 0.62,
          attrs: { 道心: 0.01, 魅力: 0.01 },
          success: {
            text: '老怪听得哈哈大笑，竟想起几分三万年前旧事，随手抛给你一枚悟道果与一壶星茶，令你修为大涨！',
            effects: { items: ['dao_fruit'], expPct: 0.36, lifespan: 80, attrs: { 悟性: 5 } },
          },
          fail: {
            text: '老怪听着听着忽然性情大变掀翻茶炉，你急忙瞬移退避百丈，衣袍焦黑。',
            effects: { hp: -300, demon: 8 },
          },
        },
      },
      {
        label: '不惧威压拔剑迎战万古老怪，以实力赢得平等对话',
        hint: '战万古老怪 · 合体老怪，胜则满载而归',
        combat: {
          enemy: 'old_monster',
          win: {
            text: '老怪连连拍手：「好小子，骨头够硬！」随即乖乖奉上混元合道丹与两万灵石，放你离去。',
            effects: { items: ['heti_dan', 'faze_canpian'], stones: 20000, reputation: 190 },
          },
          lose: {
            text: '万古老怪手段诡谲莫测，抽走你大半法力后懒洋洋将你丢出雪崖。',
            effects: { hp: -480, mpPct: -0.5, injury: 1 },
          },
        },
      },
    ],
  },
  {
    id: 'wrh_kl_08',
    title: '昆仑 · 百断仙剑共哀鸣',
    region: 'kunlun',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 5,
    maxRealm: 8,
    text: '昆仑剑谷中插满上百柄折断的太古仙剑，虽历经万古风霜，剑锋依然寒气逼人。每逢朔风吹过，百剑齐鸣如太古剑修悲歌，谷心剑气风暴已凝出半道无上仙剑法则。',
    choices: [
      {
        label: '独坐剑谷中心三个月，以元神承接百柄断仙剑意',
        hint: '耗三月 · 剑道法则暴涨，得剑魄通明丹',
        cost: { month: 3 },
        outcome: {
          text: '百道太古剑意轮番冲刷识海，你历经九十日蜕变，睁眼刹那双眸隐有剑芒吞吐！',
          effects: { lawExp: 110, lawId: 'sword', items: ['jianyi_dan'], expPct: 0.34, attrs: { 悟性: 5 } },
        },
      },
      {
        label: '挑动剑谷最深处那柄完整半刃，硬抗镇灵夺剑',
        hint: '战仙剑冢镇灵 · 极险，胜得诛仙残剑',
        combat: {
          enemy: 'immortal_sword_remnant',
          win: {
            text: '镇灵剑影崩散，那柄杀气滔天的诛仙残剑铮鸣一声化作流光落入你手！',
            effects: { items: ['zhuxian_canjian'], lawExp: 100, lawId: 'sword', reputation: 260 },
          },
          lose: {
            text: '百剑齐发如倾盆暴雨，你拼死杀出剑谷，周身留下数十道深可见骨的剑伤。',
            effects: { hp: -620, injury: 2 },
          },
        },
      },
    ],
  },
  {
    id: 'wrh_kl_09',
    title: '昆仑 · 永冬雪原古仙尸巡',
    region: 'kunlun',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 5,
    maxRealm: 8,
    text: '茫茫昆仑雪原之上，一具身披黄金残甲的古仙尸傀正机械地沿十里圆环日夜巡逻。尸傀生前必是大乘绝巅大能，虽死去万年，怀中仍死死护着一只密封完好的紫金丹瓶与法则玉简。',
    choices: [
      {
        label: '迎击古仙尸傀，超度大能遗蜕并继承其遗宝',
        hint: '战古仙尸傀 · 大乘死斗，得大乘紫气丹',
        combat: {
          enemy: 'ancient_corpse',
          win: {
            text: '你破除古尸护体尸毒将其安葬于雪丘之下，紫金丹瓶入手温热——竟是一粒大乘紫气丹与一块法则残片！',
            effects: { items: ['dacheng_dan', 'faze_canpian'], karma: 65, reputation: 220, expPct: 0.36 },
          },
          lose: {
            text: '古仙尸毒沾身如附骨之疽，你被尸傀一掌轰飞数里，狼狈逃离雪原。',
            effects: { hp: -620, injury: 2 },
          },
        },
      },
      {
        label: '向雪原古仙尸傀遥遥一拜，绕行十里不扰前辈安宁',
        hint: '敬畏古贤 · 道心与业力精进',
        outcome: {
          text: '古仙尸傀似乎微微顿足一瞬，旋即继续孤寂巡逻。你心中升起对万古英杰的敬意，道心愈固。',
          effects: { karma: 55, attrs: { 道心: 5 }, demon: -20, expPct: 0.16 },
        },
      },
    ],
  },
  {
    id: 'wrh_kl_10',
    title: '昆仑 · 双峰星石阴阳局',
    region: 'kunlun',
    pool: 'world',
    tier: 6,
    weight: 3,
    minRealm: 5,
    maxRealm: 8,
    text: '两座相距十里的雪峰之间横挂着一张由灵光织成的巨大棋盘，棋子皆是百丈大小的黑白陨星。大乘老尊「阴阳混元古尊」坐于东峰之上，隔空朝你招手：「此局残缺万年，小友可敢执黑子落下一着？」',
    choices: [
      {
        label: '御空至西峰执黑子破局，以大道推演应对古尊',
        hint: '悟性 ≥ 48 · 悟性与神识检定，得仙灵丹与混沌感悟',
        require: 'char.attrs.悟性 >= 48',
        requireHint: '悟性不足四十八，难撼万里星辰棋局',
        cost: { month: 2 },
        roll: {
          p: 0.64,
          attrs: { 悟性: 0.009, 神识: 0.009 },
          success: {
            text: '你一子落下竟令整座天元星阵起死回生！古尊拍案大喜，当空掷来一粒仙灵丹与一缕混沌大道妙悟！',
            effects: { items: ['xianling_dan'], lawExp: 100, lawId: 'chaos', attrs: { 悟性: 6, 神识: 5 }, reputation: 190 },
          },
          fail: {
            text: '弈至百手你终因底蕴稍逊投子认负，古尊仍赞你棋风清奇，赠你一粒混元合道丹作念。',
            effects: { items: ['heti_dan'], attrs: { 悟性: 3 } },
          },
        },
      },
      {
        label: '辞谢对弈，只请古尊允许在棋盘下观摩阴阳流转一月',
        hint: '耗一月 · 阵道与混沌稳涨',
        cost: { month: 1 },
        outcome: {
          text: '古尊含笑应允。你在黑白陨星纵横之间盘坐三十日，只觉对阵法生克之理豁然通透。',
          effects: { lawExp: 75, lawId: 'array', expPct: 0.24, attrs: { 悟性: 4 } },
        },
      },
    ],
  },
  {
    id: 'wrh_kl_11',
    title: '昆仑 · 玄冰峡女帝寒棺',
    region: 'kunlun',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 5,
    maxRealm: 8,
    text: '终年不见天日的玄冰裂谷底端停放着一具万载寒晶雕成的冰棺，棺中女子面容宛若生人，周身冰霜竟将方圆千丈内的空气凝成固态。棺椁四隅各嵌着一枚晶莹灵珍，冰寒杀意却暗藏其间。',
    choices: [
      {
        label: '唤醒冰棺守护残魂，以堂皇之战求取冰棺奇珍',
        hint: '战玄冥寒帝残魂 · 得岁月朝露与冰心至宝',
        combat: {
          enemy: 'frost_empress',
          win: {
            text: '女帝残魂于霜雪中微笑消散，冰棺四隅宝珠自动飞入你手，化作岁月朝露、冰心雪莲丹与海量灵石。',
            effects: { items: ['guangyin_lu', 'bingxin_dan'], stones: 21000, demon: -40, lawExp: 75, lawId: 'time' },
          },
          lose: {
            text: '冰棺寒潮爆发，冻裂你的护体真元，你急忙退回雪谷上方调息疗伤。',
            effects: { hp: -510, injury: 2 },
          },
        },
      },
      {
        label: '借冰棺外溢寒气静坐涤荡心魔两月',
        hint: '耗两月 · 心魔尽消，道心大进',
        cost: { month: 2 },
        outcome: {
          text: '极寒气息如明镜照心，你积攒多年的杂念心魔尽数冻碎化虚，神台澄澈无垢。',
          effects: { demon: -50, attrs: { 道心: 7, 神识: 4 }, expPct: 0.24 },
        },
      },
    ],
  },
  {
    id: 'wrh_kl_12',
    title: '昆仑 · 裂天魔影降墟界',
    region: 'kunlun',
    pool: 'world',
    tier: 6,
    weight: 3,
    minRealm: 5,
    maxRealm: 8,
    text: '昆仑墟界本就脆弱的苍穹再度撕开万里黑缝，一双冰冷魔瞳自域外俯瞰下方，大乘级的「虚空魔帝」投影踏空而下，试图攫取昆仑龙脉核心以炼化魔域！',
    choices: [
      {
        label: '横刀立马拦于龙脉之前，死战虚空魔帝',
        hint: '战虚空魔帝 · 护昆仑龙脉，获举世殊荣',
        combat: {
          enemy: 'void_emperor',
          win: {
            text: '天穹震裂，魔帝投影在你绝世神通下灰飞烟灭！昆仑龙脉发出一声欢欣长吟，赐下混沌母气与大乘紫气丹！',
            effects: { items: ['hundun_muqi', 'dacheng_dan'], karma: 150, reputation: 320, lawExp: 100, lawId: 'space' },
          },
          lose: {
            text: '魔帝一指点碎你的护体仙光，好在昆仑残阵及时复苏将其逼退，你捡回一命却重伤累累。',
            effects: { hp: -680, injury: 2, reputation: 85 },
          },
        },
      },
      {
        label: '激活附近上古昆仑残阵借天地之力联手驱魔',
        hint: '阵道 ≥ 2 或消耗虚空晶 · 智退魔帝',
        require: 'law("array") >= 2 || has("xukong_jing")',
        requireHint: '需阵道略有小成或持有虚空晶',
        cost: { month: 2 },
        outcome: {
          text: '你接续十二座残破仙柱，引动昆仑万里地脉化作金龙冲霄，生生将魔帝投影撞出界外！',
          effects: { lawExp: 95, lawId: 'array', karma: 120, reputation: 240, items: ['xukong_jing'] },
        },
      },
    ],
  },
  {
    id: 'wrh_kl_13',
    title: '昆仑 · 玄黄母气地喷泉',
    region: 'kunlun',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 5,
    maxRealm: 8,
    text: '荒凉石原正中忽地塌陷，一道粗如水缸的灰金色玄黄气柱冲天而起，所过之处巨岩瞬间化作齑粉——竟是一口千年难遇的混沌母气地泉喷发！每一缕母气重若山岳，寻常修士靠近即会被压爆肉身。',
    choices: [
      {
        label: '硬抗山岳重压踏近泉眼，强行截取一缕混沌母气',
        hint: '根骨 ≥ 46 · 根骨与道心检定，得仙阶混沌母气',
        require: 'char.attrs.根骨 >= 46',
        requireHint: '根骨不足四十六，肉身恐被玄黄重压碾碎',
        roll: {
          p: 0.62,
          attrs: { 根骨: 0.009, 道心: 0.009 },
          success: {
            text: '你周身骨骼咯吱作响却寸步不退，硬生生将一缕沉重玄黄混沌母气收入玉瓶，肉身亦借压蜕变！',
            effects: { items: ['hundun_muqi'], attrs: { 根骨: 6 }, lawExp: 70, lawId: 'chaos' },
          },
          fail: {
            text: '母气骤然狂涌，将你震飞数十丈吐血不止，好在仍吸纳了半缕外溢玄黄清气。',
            effects: { hp: -420, lawExp: 40, lawId: 'chaos', attrs: { 根骨: 2 } },
          },
        },
      },
      {
        label: '于十里外引散逸玄黄清气淬炼法宝与经脉两月',
        hint: '耗两月 · 稳健修为与混沌法则大进',
        cost: { month: 2 },
        outcome: {
          text: '你立于安全距离外吐纳玄黄余韵六十日，真元变得沉凝如岳，攻防威势齐涨。',
          effects: { expPct: 0.36, lawExp: 75, lawId: 'chaos', attrs: { 根骨: 4, 悟性: 3 } },
        },
      },
    ],
  },
  {
    id: 'wrh_kl_14',
    title: '昆仑 · 悬崖悟道花雨夜',
    region: 'kunlun',
    pool: 'wild',
    tier: 6,
    weight: 4,
    minRealm: 5,
    maxRealm: 8,
    text: '万丈孤峰峭壁间斜生着一株半枯半荣的太古悟道古树，今夜恰逢三千年一度的花落成实之期。漫天紫金花瓣随山风飘落如雨，每片花瓣上皆浮现一道天然大道真纹，枝头更结着一枚晶莹悟道果！',
    choices: [
      {
        label: '飞身摘取枝头悟道果，留作日后破境的圣药',
        hint: '得悟道果与悟性提升',
        outcome: {
          text: '你轻掠孤峰稳稳接住瓜熟蒂落的悟道果，清香透鼻，顿觉识海灵光如泉涌出。',
          effects: { items: ['dao_fruit'], attrs: { 悟性: 4, 气运: 3 }, expPct: 0.24 },
        },
      },
      {
        label: '不摘道果，只盘坐漫天花雨下听道三月',
        hint: '耗三月 · 全维度悟道与法则感悟飙升',
        cost: { month: 3 },
        outcome: {
          text: '三千道花落满肩头，化作无数天地法则涌入识海。起身之时，你对大道的领悟足足跃升一重！',
          effects: { expPct: 0.44, lawExp: 115, lawId: 'chaos', attrs: { 悟性: 8, 道心: 6, 神识: 6 }, karma: 50 },
        },
      },
    ],
  },
  {
    id: 'wrh_kl_15',
    title: '昆仑 · 照界古镜残台',
    region: 'kunlun',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 5,
    maxRealm: 8,
    text: '白玉废墟中央矗立着一座八角镜台，镜框空空如也，然台上残留的太古照界神光却仍将方圆百丈的落雪定格在半空之中——雪花悬停不动，时间与空间仿佛在此同时凝固。',
    choices: [
      {
        label: '步入凝固雪幕中推演定界法则，寻找古镜真身线索',
        hint: '神识与气运检定 · 或得天阶灵宝昆仑照界镜',
        roll: {
          p: 0.56,
          attrs: { 神识: 0.01, 气运: 0.012 },
          success: {
            text: '你循着镜光折射角度掘开台下三尺玉砖，赫然起出尘封万载的灵宝「昆仑照界镜」！',
            effects: { items: ['kunlun_jing'], lawExp: 75, lawId: 'space', counter: { secrets: 1 } },
          },
          fail: {
            text: '古镜真身早已随上古仙战遗失，你却自凝固雪幕中悟出不少空间定身之妙，并拾得一块虚空晶。',
            effects: { items: ['xukong_jing'], lawExp: 65, lawId: 'space' },
          },
        },
      },
      {
        label: '于镜台之外观摩雪花定格之象两月',
        hint: '耗两月 · 空间与光阴法则并进',
        cost: { month: 2 },
        outcome: {
          text: '你静观悬雪六十日，明悟了时空交错时那一线微不可察的停滞契机。',
          effects: { lawExp: 80, lawId: 'time', attrs: { 悟性: 5, 神识: 4 }, expPct: 0.25 },
        },
      },
    ],
  },
  {
    id: 'wrh_kl_16',
    title: '昆仑 · 太古丹仙废药池',
    region: 'kunlun',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 5,
    maxRealm: 8,
    text: '昆仑丹霞谷底沉睡着一座上古丹仙洗药用的白玉灵池，池水干涸大半，然池底淤积的万年药垢竟已化作赤紫晶髓，散发出令合体、大乘修士元神震颤的浓郁丹香！',
    choices: [
      {
        label: '以丹道真火提纯池底药髓，重炼太古宝丹',
        hint: '耗两月 · 悟性与丹道检定，得混元合道丹或大乘紫气丹',
        cost: { month: 2 },
        roll: {
          p: 0.62,
          attrs: { 悟性: 0.01, 神识: 0.01 },
          success: {
            text: '紫烟冲天，丹鸣震谷！你竟从万年药髓中生生提炼出一粒混元合道丹与一粒大乘紫气丹！',
            effects: { items: ['heti_dan', 'dacheng_dan'], lawExp: 90, lawId: 'pill' },
          },
          fail: {
            text: '古药药性过于狂暴，火候稍差炸散半炉，最终仍抢救出一粒混元合道丹。',
            effects: { items: ['heti_dan'], lawExp: 45, lawId: 'pill', hp: -220 },
          },
        },
      },
      {
        label: '直接以白玉池药雾浸泡肉身调息一月',
        hint: '耗一月 · 延寿疗伤、修为大涨',
        cost: { month: 1 },
        outcome: {
          text: '药髓化雾渗入百骸，你的气血法力瞬间充盈至巅峰，寿元平添八十载！',
          effects: { expPct: 0.32, lifespan: 80, heal: 3, hpPct: 1, mpPct: 1 },
        },
      },
    ],
  },
  {
    id: 'wrh_kl_17',
    title: '昆仑 · 逆流倒悬飞瀑',
    region: 'kunlun',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 5,
    maxRealm: 8,
    text: '千丈雪壁之上一条银练飞瀑竟违背常理自潭底倒卷冲天！几片枯黄落叶被水花卷入瀑中，升至半空竟奇迹般由枯转绿、化作春日嫩芽——此瀑分明浸透了太古光阴逆流之力！',
    choices: [
      {
        label: '立于倒悬飞瀑之下冲刷凡躯，逆转岁月沧桑',
        hint: '耗两月 · 寿元大涨，得岁月朝露与光阴法则',
        cost: { month: 2 },
        outcome: {
          text: '冰凉逆流瀑水冲去经脉积年陈垢，你发肤重焕青华，寿元激增百载，掌中更凝出一滴岁月朝露！',
          effects: { items: ['guangyin_lu'], lifespan: 100, lawExp: 85, lawId: 'time', attrs: { 魅力: 4 } },
        },
      },
      {
        label: '以玉瓶收集瀑心逆流灵水，反推岁月加速之法',
        hint: '悟性提升 · 修为大幅跃进',
        cost: { month: 1 },
        outcome: {
          text: '你借瀑边流速差苦修三十日，外界不过一月，你丹田内竟似历经十载寒暑！',
          effects: { expPct: 0.45, lawExp: 65, lawId: 'time', attrs: { 悟性: 5 } },
        },
      },
    ],
  },
  {
    id: 'wrh_kl_18',
    title: '昆仑 · 三百六十五星仙甲坛',
    region: 'kunlun',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 5,
    maxRealm: 8,
    text: '昆仑摘星峰顶矗立着一座由三百六十五根星石柱环绕的古坛，坛心悬浮着一副星光璀璨的「玄天星辰仙甲」。然星柱阵法尚存三成威能，唯有引动周天星力与之共鸣者方可破锁取甲。',
    choices: [
      {
        label: '以星辰法则与周天真元逐一点亮三百六十五星柱',
        hint: '星辰法则 ≥ 2 或悟性 ≥ 52 · 险取玄天星辰仙甲',
        require: 'law("star") >= 2 || char.attrs.悟性 >= 52',
        requireHint: '需星辰法则略有小成或悟性达到五十二',
        cost: { month: 2 },
        roll: {
          p: 0.62,
          attrs: { 悟性: 0.009, 神识: 0.009 },
          success: {
            text: '三百六十五颗古星虚影同时垂落银光！星锁应声崩解，仙器「玄天星辰仙甲」轰鸣飞落你身！',
            effects: { items: ['xuantian_baojia'], lawExp: 90, lawId: 'star', reputation: 220 },
          },
          fail: {
            text: '点亮至三百星柱时法力后继无力，古坛星光反震将你震退，仅落下一粒周天星辉丹与法则残片。',
            effects: { items: ['xinghui_dan', 'faze_canpian'], hp: -340 },
          },
        },
      },
      {
        label: '在星柱之间盘坐两月，借古坛星辉淬炼神魂气血',
        hint: '耗两月 · 星辰法则与根骨神识齐涨',
        cost: { month: 2 },
        outcome: {
          text: '星辰古坛清光沐浴周身六十日，你神魂与体魄皆染上一层不朽星芒。',
          effects: { lawExp: 85, lawId: 'star', attrs: { 根骨: 5, 神识: 5 }, expPct: 0.3 },
        },
      },
    ],
  },
  {
    id: 'wrh_kl_19',
    title: '昆仑 · 混沌莲池九品花',
    region: 'kunlun',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 5,
    maxRealm: 8,
    text: '浓雾锁住的雪谷中央有一汪暖气蒸腾的混沌灵池，池心独生一株九品青莲，莲瓣流转先天清气——正是大乘渡劫修士梦寐以求的仙珍「天道莲」！然池畔已伏着一头浑身煞气的太古混沌兽正虎视眈眈。',
    choices: [
      {
        label: '斩杀池畔太古混沌兽，堂堂正正摘取天道莲',
        hint: '战太古混沌兽 · 胜得天道莲与混沌灵液',
        combat: {
          enemy: 'chaos_beast',
          win: {
            text: '混沌兽哀嚎逃入雾谷深处，你步至池心轻摘九品天道莲，连池底一滴混沌初开灵液亦一并收走！',
            effects: { items: ['tiandao_lotus', 'hundun_lingye'], expPct: 0.32, reputation: 200 },
          },
          lose: {
            text: '混沌兽守护灵池死战不退，你被其巨爪拍碎护盾，只得饮恨退离雪谷。',
            effects: { hp: -540, injury: 2 },
          },
        },
      },
      {
        label: '以天阶玉简或两枚法则残片布下幻阵引开混沌兽再采莲',
        hint: '悟性 ≥ 50 · 智取天道莲',
        require: 'char.attrs.悟性 >= 50',
        requireHint: '悟性不足五十，幻阵难瞒太古凶兽',
        roll: {
          p: 0.64,
          attrs: { 悟性: 0.009, 气运: 0.01 },
          success: {
            text: '你于十里外伪造混沌母气异象成功调虎离山，趁机飞身摘下九品天道莲，未沾半分血光！',
            effects: { items: ['tiandao_lotus'], lawExp: 65, lawId: 'array', attrs: { 气运: 4 } },
          },
          fail: {
            text: '混沌兽灵觉惊人，一眼识破幻阵猛扑而来，你仓促闪避仅采得一片散落莲瓣。',
            effects: { hp: -320, demon: -20, lifespan: 30 },
          },
        },
      },
    ],
  },
  {
    id: 'wrh_kl_20',
    title: '昆仑 · 太古真仙回音壁',
    region: 'kunlun',
    pool: 'wild',
    tier: 6,
    weight: 4,
    minRealm: 5,
    maxRealm: 8,
    text: '两座晶莹玉壁夹出一条幽静回音谷，十万年前两位真仙曾在此论道三载。玉壁记下了他们如雷霆、如清泉的大道仙音，至今只要灵气触壁，便会再度回响诸天至理。',
    choices: [
      {
        label: '盘坐回音谷中静听太古真仙论道三月',
        hint: '耗三月 · 悟性、道心与修为暴涨',
        cost: { month: 3 },
        outcome: {
          text: '「仙不在九霄，而在一念通明。」两道太古仙音字字如金钟敲在元神之上，令你百日顿悟、瓶颈松动！',
          effects: { expPct: 0.48, attrs: { 悟性: 8, 道心: 7, 神识: 5 }, breakBonus: 18, demon: -30 },
        },
      },
      {
        label: '以神识逆溯仙音轨迹，摘取一缕太古因果真意',
        hint: '因果与混沌法则大进',
        cost: { month: 1 },
        outcome: {
          text: '你自真仙问答之间捉住一丝天道运转的因果脉络，灵台豁然澄明。',
          effects: { lawExp: 95, lawId: 'karma', attrs: { 神识: 5 }, expPct: 0.24 },
        },
      },
    ],
  },
  {
    id: 'wrh_kl_21',
    title: '昆仑 · 陨星浮空断桥',
    region: 'kunlun',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 5,
    maxRealm: 8,
    text: '昆仑虚空裂缝上方漂浮着九块崩碎的太古星辰碎片，彼此以无形引力牵引，形成一座通向彼岸浮岛的断续星桥。彼岸浮岛隐约可见一座古老药阁，然桥间空间乱流足以撕碎炼虚以下修士。',
    choices: [
      {
        label: '施展空间挪移踏星桥而过，探访彼岸浮岛药阁',
        hint: '神识与空间检定 · 夺得仙灵丹与虚空晶',
        roll: {
          p: 0.62,
          attrs: { 神识: 0.01, 悟性: 0.01 },
          success: {
            text: '你踏着九块星骸纵跃如龙，安然登上浮岛药阁，自玉柜中收获仙灵丹、虚空晶与上万灵石！',
            effects: { items: ['xianling_dan', 'xukong_jing'], stones: 15000, lawExp: 70, lawId: 'space' },
          },
          fail: {
            text: '行至第七块星骸时乱流突卷，你被罡风割裂法袍，强行折返原岸休养。',
            effects: { hp: -360, lawExp: 35, lawId: 'space' },
          },
        },
      },
      {
        label: '留在桥头采集星骸边缘剥落的星辰砂与虚空晶屑',
        hint: '稳妥 · 得虚空晶与星辰砂',
        outcome: {
          text: '你不冒断桥之险，沿第一块星骸细细搜刮，收获颇丰。',
          effects: { items: ['xukong_jing', 'xingchen_sha'], expPct: 0.18 },
        },
      },
    ],
  },
  {
    id: 'wrh_kl_22',
    title: '昆仑 · 冰川半截杀伐剑',
    region: 'kunlun',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 5,
    maxRealm: 8,
    text: '千里冰川被人从正中一剑劈作两半，裂口深达千丈，底部斜插着半截漆黑如墨的断剑。虽已折断万载，断刃吞吐的森然杀意仍令九天劫云不敢靠近半步。',
    choices: [
      {
        label: '以剑心压服断刃滔天杀意，将其拔出冰川',
        hint: '剑道 ≥ 2 且道心 ≥ 50 · 险取诛仙残剑',
        require: 'law("sword") >= 2 && char.attrs.道心 >= 50',
        requireHint: '需剑道略有小成且道心达到五十',
        roll: {
          p: 0.6,
          attrs: { 道心: 0.009, 根骨: 0.009 },
          success: {
            text: '剑啸穿云裂石！你顶住噬心杀意将半截神兵硬生生拔出冰川——竟是名震太古的仙器「诛仙断刃」！',
            effects: { items: ['zhuxian_canjian'], lawExp: 90, lawId: 'sword', demon: 10 },
          },
          fail: {
            text: '断刃杀意反噬识海，你虎口鲜血淋漓被迫松手，却也在这一握间悟透一式太古绝杀剑意。',
            effects: { hp: -380, demon: 12, lawExp: 70, lawId: 'sword' },
          },
        },
      },
      {
        label: '沿冰川裂口步行百里，细观昔年一剑开山之势',
        hint: '耗一月 · 剑道与修为稳进',
        cost: { month: 1 },
        outcome: {
          text: '你一步步丈量万里剑痕，只觉胸中剑气愈发厚重磅礴，心无杂念。',
          effects: { lawExp: 80, lawId: 'sword', expPct: 0.25, attrs: { 悟性: 4 } },
        },
      },
    ],
  },
  {
    id: 'wrh_kl_23',
    title: '昆仑 · 混元合道石碑林',
    region: 'kunlun',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 5,
    maxRealm: 8,
    text: '昆仑西麓立着九块高逾百丈的青灰石碑，碑面绘有人身紫府与元神法相合二为一的太古道图。碑林正中石案上留有一只未曾开启的石匣，显然是古修为后世冲击合体大境所留机缘。',
    choices: [
      {
        label: '循九碑道图运转周天两月，领悟身法合一之理',
        hint: '耗两月 · 修为、根骨与破境成算齐涨',
        cost: { month: 2 },
        outcome: {
          text: '六十日参悟下来，你肉身与元神之间的最后一丝隔阂彻底消融，气血灵力水乳交融！',
          effects: { expPct: 0.42, breakBonus: 20, attrs: { 根骨: 6, 悟性: 5 } },
        },
      },
      {
        label: '破开石案禁制，取走匣中混元合道丹与法则残片',
        hint: '得混元合道丹与法则残片',
        outcome: {
          text: '石匣禁制历经万载已然松动，你轻指一弹便揭开石盖，喜得合体圣丹与法则残片。',
          effects: { items: ['heti_dan', 'faze_canpian'], stones: 9500 },
        },
      },
    ],
  },
  {
    id: 'wrh_kl_24',
    title: '昆仑 · 洪荒异兽饮星潭',
    region: 'kunlun',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 5,
    maxRealm: 8,
    text: '陨石坑积蓄亿万年星辉形成一口银白星潭，一头浑身覆满混沌鳞片的太古巨兽正俯首痛饮星液。潭边灵气化作液态雾珠滚动，每一滴皆堪比高阶灵丹。',
    choices: [
      {
        label: '出手驱离太古混沌兽，独占整口星液灵潭',
        hint: '战太古混沌兽 · 胜得海量修为与周天星辉丹',
        combat: {
          enemy: 'chaos_beast',
          win: {
            text: '巨兽不敌败走雪山，你畅饮星液闭关一月，修为突飞猛进，临行更装走一瓶周天星辉丹！',
            effects: { items: ['xinghui_dan', 'heti_dan'], expPct: 0.4, lawExp: 80, lawId: 'star' },
          },
          lose: {
            text: '巨兽护食凶狂无比，将你追出五十里雪原方才罢休。',
            effects: { hp: -510, injury: 2 },
          },
        },
      },
      {
        label: '静候巨兽饮饱离去，再取潭边残余星液修炼',
        hint: '耗一月 · 稳健无伤，星辰与修为并进',
        cost: { month: 1 },
        outcome: {
          text: '半月后巨兽打着饱嗝沉入地裂，你从容步至潭畔炼化残余星液，安全又惬意。',
          effects: { expPct: 0.26, lawExp: 60, lawId: 'star', attrs: { 气运: 3 } },
        },
      },
    ],
  },
  {
    id: 'wrh_kl_25',
    title: '昆仑 · 墟界散修旧火塘',
    region: 'kunlun',
    pool: 'world',
    tier: 6,
    weight: 4,
    minRealm: 5,
    maxRealm: 8,
    text: '昆仑风雪之中竟透出一点温暖橘光——三名避世隐修的合体老怪在一座避风雪洞里燃起建木枯枝烤着灵兽肉，见你踏雪而至，举起酒葫芦笑道：「昆仑冷清了三百年，难得来个活人，坐下换换货、聊聊九州近况如何？」',
    choices: [
      {
        label: '以两万五千灵石向老怪换取一枚珍藏的悟道果',
        hint: '25000 灵石 · 稳得悟道果',
        require: 'stones >= 25000',
        requireHint: '灵石不足两万五千',
        cost: { stones: 25000 },
        outcome: {
          text: '老怪掂了掂灵石笑呵呵递上悟道果：「老夫寿元无多留着也是浪费，拿去冲大乘吧！」',
          effects: { items: ['dao_fruit'], reputation: 60 },
        },
      },
      {
        label: '分享中州与北荒最新秘闻，与三老围炉论道一月',
        hint: '耗一月 · 修为、悟性与神识大涨',
        cost: { month: 1 },
        outcome: {
          text: '风雪夜话三十日，三老各自道出探索昆仑墟界的保命诀窍与法则心得，令你受益匪浅。',
          effects: { expPct: 0.3, attrs: { 悟性: 5, 神识: 5, 道心: 4 }, demon: -20 },
        },
      },
    ],
  },
  {
    id: 'wrh_kl_26',
    title: '昆仑 · 碎裂太古时之沙漏',
    region: 'kunlun',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 5,
    maxRealm: 8,
    text: '玉石古广场正中倒伏着一座高逾十丈的水晶沙漏，漏身早已破裂，金灿灿的光阴流沙铺满半座广场。微风吹过流沙，竟在空中映出此地十万年前仙人往来的繁华旧景。',
    choices: [
      {
        label: '伸手掬起一捧光阴流沙，强行回溯当年仙战真相',
        hint: '道心与悟性检定 · 悟光阴法则，或得岁月朝露',
        roll: {
          p: 0.62,
          attrs: { 悟性: 0.01, 道心: 0.01 },
          success: {
            text: '金色流沙在指尖化作璀璨光影，你亲眼目睹了古仙界崩塌的一角秘辛，更凝出一滴岁月朝露！',
            effects: { items: ['guangyin_lu'], lawExp: 95, lawId: 'time', attrs: { 悟性: 6 }, counter: { secrets: 1 } },
          },
          fail: {
            text: '流沙反噬抽走了你二十载寿元，你急忙甩手后退，幸好仍记下一段光阴法则残韵。',
            effects: { lifespan: -20, lawExp: 50, lawId: 'time' },
          },
        },
      },
      {
        label: '静坐广场边缘观览万古兴衰画卷两月',
        hint: '耗两月 · 道心、悟性与寿元稳步增长',
        cost: { month: 2 },
        outcome: {
          text: '看尽十万年繁华落幕，你胸中万千执念随之化作云烟，寿元亦反增四十载。',
          effects: { demon: -35, attrs: { 道心: 6, 悟性: 4 }, lifespan: 40, lawExp: 65, lawId: 'time' },
        },
      },
    ],
  },
  {
    id: 'wrh_kl_27',
    title: '昆仑 · 仙灵丹雾弥天谷',
    region: 'kunlun',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 5,
    maxRealm: 8,
    text: '雪峰夹峙间有一条常年被五彩霞雾笼罩的幽谷，雾气入鼻甘甜清冽，竟是昔年丹殿崩塌后百炉仙丹灵气散逸万年不散所致！吸上一口便抵得过数月苦修。',
    choices: [
      {
        label: '深入谷心凝雾成丹，收取残存的绝品仙灵丹',
        hint: '耗两月 · 得仙灵丹与丹道感悟',
        cost: { month: 2 },
        outcome: {
          text: '你以聚灵阵收束满谷霞雾，六十日后终在掌心凝出一粒沾染上界仙气的仙灵丹！',
          effects: { items: ['xianling_dan'], lawExp: 80, lawId: 'pill', expPct: 0.3 },
        },
      },
      {
        label: '盘坐谷口敞开周身窍穴鲸吞霞雾一月',
        hint: '耗一月 · 修为暴涨、气血法力尽复',
        cost: { month: 1 },
        outcome: {
          text: '五彩丹雾如潮水涌入丹田，你的修为节节攀升，陈年暗疾亦一扫而空。',
          effects: { expPct: 0.44, heal: 2, hpPct: 1, mpPct: 1, lifespan: 40 },
        },
      },
    ],
  },
  {
    id: 'wrh_kl_28',
    title: '昆仑 · 太初先天玉璧',
    region: 'kunlun',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 5,
    maxRealm: 8,
    text: '昆仑深崖隐着一面天然生就的乳白巨璧，璧面并非人工雕凿，却自然生成九道宛若天地初开般的玄奥纹理。凡直视玉璧者，识海皆会响起洪钟大吕般的鸿蒙道音。',
    choices: [
      {
        label: '耗尽心血于玉璧前枯坐半年，拓印《混沌太初仙典》',
        hint: '悟性 ≥ 54 · 耗半年，极概率得仙阶混沌玉简',
        require: 'char.attrs.悟性 >= 54',
        requireHint: '悟性不足五十四，难以承载先天道文',
        cost: { month: 6 },
        roll: {
          p: 0.62,
          attrs: { 悟性: 0.009, 道心: 0.009 },
          success: {
            text: '半年苦悟终见开天真意！九道先天纹理化作金字飞入玉简，成就无上《混沌太初仙典》！',
            effects: { items: ['yujian_hundun'], lawExp: 115, lawId: 'chaos', attrs: { 悟性: 6 } },
          },
          fail: {
            text: '玉璧道文太过浩瀚，你仅拓下三成残篇，却也收获了一缕珍贵混沌母气与海量感悟。',
            effects: { items: ['hundun_muqi'], lawExp: 80, lawId: 'chaos', expPct: 0.3 },
          },
        },
      },
      {
        label: '只观第一道阴阳初分之纹两月，量力而行',
        hint: '耗两月 · 稳获混沌法则与悟性',
        cost: { month: 2 },
        outcome: {
          text: '贪多嚼不烂，你专攻一道先天纹理，六十日后神清气爽，收获极实。',
          effects: { lawExp: 85, lawId: 'chaos', attrs: { 悟性: 5, 道心: 4 }, expPct: 0.28 },
        },
      },
    ],
  },
  {
    id: 'wrh_kl_29',
    title: '昆仑 · 霜湖太古战鼓',
    region: 'kunlun',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 5,
    maxRealm: 8,
    text: '一面十丈方圆、以真龙皮蒙就的太古战鼓沉在清澈见底的霜湖湖底，鼓身缠绕着丝丝紫霄电光。传闻上古仙军出征前必敲此鼓三声，以振军魂、破万魔幻阵。',
    choices: [
      {
        label: '潜入霜湖击响太古战鼓三声，以鼓音淬炼神魂',
        hint: '根骨与道心检定 · 涤荡心魔，雷霆与气血大涨',
        roll: {
          p: 0.64,
          attrs: { 根骨: 0.009, 道心: 0.01 },
          success: {
            text: '三声闷雷般的鼓音震碎千里雪云！你浑身气血沸腾如沸，心魔尽散，更引动一缕紫雷入体！',
            effects: { demon: -45, attrs: { 根骨: 6, 道心: 6 }, lawExp: 80, lawId: 'thunder', expPct: 0.3 },
          },
          fail: {
            text: '鼓声反震令你双耳渗血，虽未能敲响第三声，仍觉战意昂扬不少。',
            effects: { hp: -280, attrs: { 道心: 3 }, demon: -15 },
          },
        },
      },
      {
        label: '在霜湖岸畔静坐观鼓一月，体会静极生动之势',
        hint: '耗一月 · 修为与道心稳涨',
        cost: { month: 1 },
        outcome: {
          text: '湖面无波，古鼓沉寂，你却于静默中听见万古战意回响，修为更进一层。',
          effects: { expPct: 0.24, attrs: { 道心: 4, 根骨: 3 } },
        },
      },
    ],
  },
  {
    id: 'wrh_kl_30',
    title: '昆仑 · 天地因果古秤',
    region: 'kunlun',
    pool: 'world',
    tier: 6,
    weight: 3,
    minRealm: 5,
    maxRealm: 8,
    text: '昆仑废墟半空悬浮着一架三丈高的白玉天平，两端托盘空无一物，却随着过往修士的一念善恶缓缓倾侧。古秤底座刻着八字古篆：「善恶有报，因果自偿。」',
    choices: [
      {
        label: '将一生行止坦然呈于古秤之前，接受天地因果裁量',
        hint: '业力 ≥ 80 得仙赐，否则亦明道心',
        require: 'karma >= 80',
        requireHint: '业力不足八十，难以引动古秤功德赐福',
        outcome: {
          text: '白玉天平骤放万丈金光！一道厚重功德垂落，天平托盘竟凭空凝出一枚悟道果与《天机因果秘录》真韵！',
          effects: { items: ['dao_fruit'], lawExp: 100, lawId: 'karma', demon: -45, lifespan: 80, reputation: 180 },
        },
      },
      {
        label: '放下一万灵石于左盘以偿尘世欠债，求一份因果清净',
        hint: '10000 灵石 · 心魔大消，因果与业力大增',
        require: 'stones >= 10000',
        requireHint: '灵石不足一万',
        cost: { stones: 10000 },
        outcome: {
          text: '灵石化作清风散入九州尘世，古秤恢复绝对平衡。你顿觉肩头无形枷锁尽去，一身轻松！',
          effects: { karma: 100, demon: -50, lawExp: 85, lawId: 'karma', attrs: { 道心: 6, 气运: 4 } },
        },
      },
      {
        label: '拱手致礼而不碰古秤，自言「我之因果，当由我剑自担」',
        hint: '孤高剑心 · 道心与剑道提升',
        outcome: {
          text: '古秤轻轻一晃仿佛失笑。你转身迈入风雪，心中无畏无惧。',
          effects: { attrs: { 道心: 5 }, lawExp: 55, lawId: 'sword', expPct: 0.2 },
        },
      },
    ],
  },
  {
    id: 'wrh_kl_31',
    title: '昆仑 · 紫霄劫雷残阵',
    region: 'kunlun',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 5,
    maxRealm: 8,
    text: '一座焦黑山坳内残存着上古雷仙布下的「九霄引雷阵」，阵心石柱上仍封存着几道万年未散的紫霄神雷，电弧跳跃间散发出令大乘修士心悸的毁灭气息。',
    choices: [
      {
        label: '以身入阵引紫霄神雷淬炼元神法相两月',
        hint: '耗两月 · 雷霆法则暴涨，得九霄紫雷核线索',
        cost: { month: 2 },
        roll: {
          p: 0.62,
          attrs: { 根骨: 0.009, 道心: 0.009 },
          success: {
            text: '紫电贯通百脉，你将石柱残雷悉数炼化为己用，更凝出一张太乙级神雷符与海量雷道感悟！',
            effects: { items: ['jiuxiao_leifu', 'leiyuan_dan'], lawExp: 105, lawId: 'thunder', breakBonus: 18 },
          },
          fail: {
            text: '神雷狂暴难驯，劈得你皮开肉绽退回山坳外，好在抗雷体魄仍强韧了几分。',
            effects: { hp: -390, lawExp: 50, lawId: 'thunder', attrs: { 根骨: 3 } },
          },
        },
      },
      {
        label: '拆解外围雷阵符石，收获高阶雷符与阵道心得',
        hint: '稳妥 · 得九霄神雷符与阵道感悟',
        outcome: {
          text: '你避开阵心暴雷，将外圈尚完好的符纹剥离制成两张九霄神雷符收入行囊。',
          effects: { items: [{ id: 'jiuxiao_leifu', qty: 2 }], lawExp: 65, lawId: 'array' },
        },
      },
    ],
  },
  {
    id: 'wrh_kl_32',
    title: '昆仑 · 仙崖长生残枝',
    region: 'kunlun',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 5,
    maxRealm: 8,
    text: '昆仑绝壁云雾散开一瞬，露出一株早已枯死万载的太古仙桃残干。令人震惊的是，枯干最末梢竟还垂着一枚金红剔透、犹如婴儿脉动般的「太乙长生果」，散发出令人垂涎的续命仙气！',
    choices: [
      {
        label: '不顾绝壁空间罡风，飞身摘取太乙长生果',
        hint: '气运与根骨检定 · 险夺仙珍太乙长生果',
        roll: {
          p: 0.6,
          attrs: { 根骨: 0.009, 气运: 0.012 },
          success: {
            text: '空间罡风在你护体真元上擦出连片火花，你稳稳摘下太乙长生果退回云巅，五百载寿元尽在掌中！',
            effects: { items: ['changsheng_guo'], expPct: 0.25, attrs: { 气运: 4 } },
          },
          fail: {
            text: '罡风骤烈卷碎仙枝，长生果坠入无尽星渊！你仅吸纳了漫天散开的仙果余香，也延寿五十载。',
            effects: { hp: -320, lifespan: 50, attrs: { 根骨: 3 } },
          },
        },
      },
      {
        label: '消耗一枚虚空晶隔空挪移摘果，万无一失',
        hint: '消耗虚空晶 · 必得太乙长生果',
        require: 'has("xukong_jing")',
        requireHint: '行囊中无虚空晶',
        cost: { item: 'xukong_jing' },
        outcome: {
          text: '虚空晶在仙枝旁无声开启寸许门户，你探手轻松取走太乙长生果，毫发无伤！',
          effects: { items: ['changsheng_guo'], lawExp: 55, lawId: 'space' },
        },
      },
    ],
  },
  {
    id: 'wrh_kl_33',
    title: '昆仑 · 紫气东来观日台',
    region: 'kunlun',
    pool: 'world',
    tier: 6,
    weight: 4,
    minRealm: 5,
    maxRealm: 8,
    text: '昆仑极东有一座伸出云海千丈的白玉祭坛，每逢百年鸿蒙初阳升起，三万里东来紫气便会率先汇于此台。今晨朝霞漫天，正值百年紫气大潮降临！',
    choices: [
      {
        label: '盘坐白玉祭坛迎纳三万里鸿蒙紫气',
        hint: '耗两月 · 得大乘紫气丹，修为暴涨',
        cost: { month: 2 },
        outcome: {
          text: '滚滚紫气如天河倒灌入你紫府，六十日后霞光敛尽，你身前竟凝成一粒流光溢彩的大乘紫气丹！',
          effects: { items: ['dacheng_dan'], expPct: 0.42, attrs: { 道心: 5, 气运: 4 } },
        },
      },
      {
        label: '散开紫气余韵洒向昆仑下界群山，自取一缕感悟大道',
        hint: '泽被苍生 · 功德、声望与悟性齐升',
        outcome: {
          text: '你袖袍一卷令紫气泽被九州山川，自身虽只留三分，却得天地功德加身、悟性大增！',
          effects: { karma: 130, reputation: 210, attrs: { 悟性: 7, 道心: 6 }, expPct: 0.28 },
        },
      },
    ],
  },
  {
    id: 'wrh_kl_34',
    title: '昆仑 · 望霄石门遥瞻九天',
    region: 'kunlun',
    pool: 'world',
    tier: 6,
    weight: 3,
    minRealm: 5,
    maxRealm: 8,
    text: '昆仑最高雪巅立着一座孤寂残破的青铜石门，穿过石门向上仰望，九霄云海尽头隐约可见雷光万丈的南天门虚影。古往今来无数大乘老祖在此驻足回首，或饮恨止步，或一去不返。',
    choices: [
      {
        label: '立于石门之下静观九霄雷海三月，提前磨砺渡劫道心',
        hint: '耗三月 · 道心与渡劫成算大幅提升',
        cost: { month: 3 },
        outcome: {
          text: '九霄罡风吹动衣袂，你眼望天门毫无惧色。三月过后，你已做好叩问九霄天门的万全准备！',
          effects: { breakBonus: 25, attrs: { 道心: 8, 神识: 6 }, demon: -35, expPct: 0.34 },
        },
      },
      {
        label: '在石门青铜柱上留下一句道偈，赠与后来问仙之人',
        hint: '留名青史 · 得声望、业力与仙符机缘',
        outcome: {
          text: '你以剑指在铜柱刻下平生悟道之言，铜柱嗡鸣回应，竟自基座弹出一张太乙护道仙符！',
          effects: { items: ['taiyi_hudaofu'], reputation: 190, karma: 80, attrs: { 道心: 4 } },
        },
      },
    ],
  },

  /* ============================================================================
   * 四、九霄天门（jiuxiao，45 节点，minRealm: 7, maxRealm: 9）
   * ============================================================================ */

  // ---------- 链一：九霄天门试炼（4 段） ----------
  {
    id: 'wrh_jx_gate_1',
    title: '九霄 · 登天雷阶初叩门',
    region: 'jiuxiao',
    pool: 'world',
    tier: 6,
    weight: 4,
    minRealm: 7,
    maxRealm: 9,
    once: true,
    text: '九万里云海之上，万丈白玉天门巍然耸立于紫电雷海深处。天门之前垂下九千九百九十九级星光玉阶，每一阶皆有紫霄罡雷翻涌。\n\n玉阶中段，一尊由劫雷凝成的「紫霄天劫法身」手握雷戟凌空而立，声如天宪：「欲叩天门者，先过吾身雷关！」',
    choices: [
      {
        label: '直踏玉阶迎击紫霄天劫法身，以无敌之姿开路',
        hint: '战紫霄天劫法身 · 渡劫第一关',
        combat: {
          enemy: 'thunder_tribulation_avatar',
          win: {
            text: '紫雷炸裂千里云海！你硬生生轰碎劫雷法身，整条登天玉阶为之震颤，九天清气纷纷向你垂落！',
            effects: { expPct: 0.35, lawExp: 110, lawId: 'thunder', reputation: 320, flag: { 踏破天门雷关: true } },
            goto: 'wrh_jx_gate_2',
          },
          lose: {
            text: '紫霄雷戟携九重天威劈落，你护体仙光寸寸崩裂，被轰落三千级玉阶吐血不止。',
            effects: { hp: -850, injury: 2, lawExp: 45, lawId: 'thunder' },
          },
        },
      },
      {
        label: '祭出九霄紫雷核或天劫丹引雷入体，化劫为资粮登阶',
        hint: '消耗天劫丹 · 稳渡雷关，根骨与雷法大进',
        require: 'has("tianjie_dan")',
        requireHint: '行囊中无天劫丹',
        cost: { item: 'tianjie_dan' },
        outcome: {
          text: '天劫丹化作万千引雷灵丝，竟将法身劈落的紫雷尽数导引淬炼仙骨！法身微微一滞，化电消散为你让路。',
          effects: { expPct: 0.32, lawExp: 95, lawId: 'thunder', attrs: { 根骨: 8 }, flag: { 化雷登天阶: true } },
          goto: 'wrh_jx_gate_2',
        },
      },
      {
        label: '立于玉阶之外静观紫雷起落三月，暂不强叩天门',
        hint: '耗三月 · 蓄势磨砺雷道与道心',
        cost: { month: 3 },
        outcome: {
          text: '你审时度势，在云海边缘凝神感悟紫霄劫雷九十日，抗劫底气平添三分。',
          effects: { lawExp: 85, lawId: 'thunder', breakBonus: 20, attrs: { 道心: 6 } },
        },
      },
    ],
  },
  {
    id: 'wrh_jx_gate_2',
    title: '九霄 · 天门裁决问大道',
    region: 'jiuxiao',
    pool: 'branch',
    tier: 6,
    weight: 0,
    text: (s) => `踏上第八千级玉阶，${s.flags['踏破天门雷关'] ? '劫雷余烬仍在你衣袂流转，' : '紫电绕身而走，'}前方云海骤然凝成一座万丈法庭。身披无情雷铠的「九霄天门裁决者」居高临下审视你的元神：「下界修士，汝一路逆天争命，杀伐无数，凭何称仙？」`,
    choices: [
      {
        label: '「大道本无私，成仙凭本心！」——挥剑战裁决者',
        hint: '战九霄天门裁决者 · 以战证道',
        combat: {
          enemy: 'sky_arbiter',
          win: {
            text: '天威裁判之剑被你正面斩断！裁决者雷铠龟裂，沉声退让半步：「好一个凭本心，准尔直面南天门！」',
            effects: { expPct: 0.4, reputation: 380, attrs: { 道心: 10 }, flag: { 战退天门裁决: true } },
            goto: 'wrh_jx_gate_3',
          },
          lose: {
            text: '裁决者引动天律镇压，你如背负十万大山单膝跪地，最终被雷光扫落云阶。',
            effects: { hp: -920, injury: 2, reputation: 120 },
          },
        },
      },
      {
        label: '展露自身圆满功德与澄澈道心，令天律无从挑剔',
        hint: '道心 ≥ 75 且业力 ≥ 100 · 以德合天律',
        require: 'char.attrs.道心 >= 75 && karma >= 100',
        requireHint: '道心不足七十五或业力不足一百，难过天律审视',
        outcome: {
          text: '万丈功德清光自你元神绽放，裁决者手中雷秤竟丝毫不偏！巨人缓缓收戈低首，为你敞开直通南天门的金光大道！',
          effects: { karma: 120, demon: -50, attrs: { 道心: 8, 气运: 6 }, flag: { 功德过裁决: true } },
          goto: 'wrh_jx_gate_3',
        },
      },
    ],
  },
  {
    id: 'wrh_jx_gate_3',
    title: '九霄 · 南天门仙将试真仙',
    region: 'jiuxiao',
    pool: 'branch',
    tier: 6,
    weight: 0,
    text: '终于立于九霄天门正前！门扇高逾十万丈，仙光透缝而出，凡尘一切仿佛微若尘埃。门前屹立着一尊真正的真仙守将——「南天门仙将」，金鳞仙甲流转不朽神辉，手持镇界长戈低喝：「过吾三百招，或败吾身，天门秘库为你而开！」',
    choices: [
      {
        label: '燃烧全部法则之力，与南天门仙将倾力一战！',
        hint: '战南天门仙将 · 真仙境巅峰试炼',
        combat: {
          enemy: 'celestial_warden',
          win: {
            text: '九霄云海倒卷万里！你竟以下界之身硬撼真仙守将而不落下风，一击震退镇界长戈！仙将收戈大笑：「万载以来，你是第一人！」',
            effects: { expPct: 0.55, reputation: 600, attrs: { 根骨: 12, 道心: 12 }, flag: { 胜南天门仙将: true } },
            goto: 'wrh_jx_gate_4',
          },
          lose: {
            text: '真仙威能终究浩瀚如渊，你虽倾尽底牌仍惜败于长戈之下。仙将赞你气魄绝代，赐你半缕仙气疗伤并准你一窥天门余泽。',
            effects: { hp: -1100, expPct: 0.25, reputation: 240 },
            goto: 'wrh_jx_gate_4',
          },
        },
      },
      {
        label: '祭出太乙护道仙符与全部护身底牌，死守三百招证不朽道骨',
        hint: '消耗太乙护道仙符 · 稳健过关',
        require: 'has("taiyi_hudaofu")',
        requireHint: '行囊中无太乙护道仙符',
        cost: { item: 'taiyi_hudaofu' },
        outcome: {
          text: '紫气三层护道不灭，你在真仙长戈如雨攻势中坚守整整三百招未退半步！仙将欣然收兵赞叹。',
          effects: { expPct: 0.42, attrs: { 根骨: 8, 道心: 8 }, reputation: 350, flag: { 守三百招过天门: true } },
          goto: 'wrh_jx_gate_4',
        },
      },
    ],
  },
  {
    id: 'wrh_jx_gate_4',
    title: '九霄 · 天门赐仙兵',
    region: 'jiuxiao',
    pool: 'branch',
    tier: 6,
    weight: 0,
    text: (s) => `南天门轰然裂开十丈金缝，漫天仙乐自上界倾泻而下。${s.flags['胜南天门仙将'] ? '因你正面胜过南天门仙将，天门赐下最高等阶的先天仙宝任你择一，' : '你以非凡道心通过天门考验，仙门降下两件惊世厚赐任你择一，'}更有渡劫玄黄丹伴随仙光飘落掌前。`,
    choices: [
      {
        label: '迎取先天仙器「混沌太初钟」与渡劫玄黄丹',
        hint: '攻防一体无上仙钟 · 称号「叩门问仙尊」',
        outcome: {
          text: '混沌太初钟轻鸣一声震散九天劫云，渡劫玄黄丹紧随落入玉匣。自今日起，九霄诸天皆铭刻你的真名！',
          effects: { items: ['hundun_zhong', 'dujie_shengdan'], reputation: 500, lifespan: 500, title: '叩门问仙尊', counter: { secrets: 1 } },
        },
      },
      {
        label: '迎取绝世仙兵「太初问道仙剑」与天道莲',
        hint: '太初大道仙剑 · 称号「九霄第一剑」',
        outcome: {
          text: '太初问道仙剑入手清越如龙吟，仿佛天地初开第一道剑光重现人间！你提剑望向无垠星海，仙路坦荡无阻。',
          effects: { items: ['taichu_xianjian', 'tiandao_lotus'], lawExp: 150, lawId: 'sword', reputation: 500, title: '九霄第一剑', counter: { secrets: 1 } },
        },
      },
    ],
  },

  // ---------- 链二：坠世散仙遗冢（4 段） ----------
  {
    id: 'wrh_jx_fallen_1',
    title: '九霄 · 坠仙云墓残剑歌',
    region: 'jiuxiao',
    pool: 'wild',
    tier: 6,
    weight: 4,
    minRealm: 7,
    maxRealm: 9,
    once: true,
    text: '九霄天门东南千里外漂浮着一片死寂灰云海，云海之上竟林立着数百座断剑冢——此处葬着古今飞升失败、转修九劫散仙却终究陨落于此的绝代剑修。\n\n墓园深处一具身披残破星袍的「古仙尸傀」缓缓站起，拦在通往核心仙陵的白玉桥前。',
    choices: [
      {
        label: '以礼拔剑，击败古仙尸傀踏入坠仙云墓深处',
        hint: '战古仙尸傀 · 启程探访坠世散仙传承',
        combat: {
          enemy: 'ancient_corpse',
          win: {
            text: '你一剑斩断缠绕古尸万年的尸煞执念，星袍大能微微颔首化作尘光散去，白玉长桥清辉顿开。',
            effects: { expPct: 0.3, karma: 60, items: ['faze_canpian'], flag: { 渡白玉云桥: true } },
            goto: 'wrh_jx_fallen_2',
          },
          lose: {
            text: '古仙尸傀纵死万年仍威压骇人，你被一掌逼退云海边缘，不得不暂缓探墓。',
            effects: { hp: -650, injury: 2 },
          },
        },
      },
      {
        label: '在墓园外围叩首三拜，听残剑风声参悟散仙遗恨',
        hint: '稳妥 · 剑道与道心双涨',
        cost: { month: 2 },
        outcome: {
          text: '数百断剑在罡风中低吟，道尽成仙之路的残酷与辉煌。你静立六十日，道心澄澈如洗。',
          effects: { lawExp: 90, lawId: 'sword', attrs: { 道心: 7 }, demon: -30, expPct: 0.25 },
        },
      },
    ],
  },
  {
    id: 'wrh_jx_fallen_2',
    title: '九霄 · 九劫坠世散仙拦剑',
    region: 'jiuxiao',
    pool: 'branch',
    tier: 6,
    weight: 0,
    text: '穿过百座残冢，中央云崖上斜倚着一位青衫染血、发丝雪白的「坠世散仙」。他曾距真仙仅差半步，却在第九重天劫中功亏一篑。见你走来，他拔出锈迹斑斑的断剑冷笑：「又一个做着飞升美梦的蠢货？接我一剑试试，看你配不配读先辈遗书！」',
    choices: [
      {
        label: '坦然拔剑迎战坠世散仙，以手中剑回应万古不甘',
        hint: '战坠世散仙 · 渡劫剑修巅峰交锋',
        combat: {
          enemy: 'fallen_immortal',
          win: {
            text: '双剑交鸣撕碎千里灰云！坠世散仙剑锋被你震脱，竟仰天大笑流下两行清泪：「好剑！看来后世终究有人能踏过那道门槛！」',
            effects: { expPct: 0.42, lawExp: 120, lawId: 'sword', reputation: 340, flag: { 剑服坠世散仙: true } },
            goto: 'wrh_jx_fallen_3',
          },
          lose: {
            text: '九劫散仙的寂灭剑意凌厉无匹，你身受重创跌下云崖，耳畔仍回荡着他苍凉的叹息。',
            effects: { hp: -880, injury: 2, lawExp: 55, lawId: 'sword' },
          },
        },
      },
      {
        label: '不拔兵刃，反献上一粒太乙长生果抚其万载残伤',
        hint: '消耗太乙长生果 · 以仁化恨，感动散仙',
        require: 'has("changsheng_guo")',
        requireHint: '行囊中无太乙长生果',
        cost: { item: 'changsheng_guo' },
        outcome: {
          text: '坠世散仙盯着手中温润仙果怔立良久，满身戾气瞬间消融。他收剑长叹一声，亲自引你走向墓园最深处的太古剑亭。',
          effects: { karma: 160, reputation: 280, attrs: { 道心: 10 }, flag: { 仙果渡散仙: true } },
          goto: 'wrh_jx_fallen_3',
        },
      },
    ],
  },
  {
    id: 'wrh_jx_fallen_3',
    title: '九霄 · 太古剑仙意念映亭',
    region: 'jiuxiao',
    pool: 'branch',
    tier: 6,
    weight: 0,
    text: (s) => `${s.flags['仙果渡散仙'] ? '坠世散仙躬身退于亭外，' : '坠世散仙含笑消散为星火，'}云海尽头竟浮现一座孤零零的青石剑亭。亭中虚坐着一缕映照九霄的「太古剑仙意念」，青衫微扬间星河倒悬，淡然道：「能过九劫遗冢者，可接吾一缕太初剑意否？」`,
    choices: [
      {
        label: '直面太古剑仙意念，以毕生剑道与法则印证真仙境界',
        hint: '战太古剑仙意念 · 真仙剑道至高试炼',
        combat: {
          enemy: 'primordial_sword_immortal',
          win: {
            text: '星河断流又复聚！你竟在真仙级剑意下悟透太初一剑，硬生生逼得太古剑仙意念抚掌赞叹：「此剑可斩九霄，吾道不孤！」',
            effects: { expPct: 0.55, lawExp: 180, lawId: 'sword', attrs: { 悟性: 12, 道心: 10 }, flag: { 印证太古剑仙: true } },
            goto: 'wrh_jx_fallen_4',
          },
          lose: {
            text: '太古剑仙随手一挥便令星辰坠落，你纵然落败，却在溃散前捕捉到那一剑的无上神韵，获益无穷！',
            effects: { hp: -1050, lawExp: 90, lawId: 'sword', attrs: { 悟性: 6 } },
            goto: 'wrh_jx_fallen_4',
          },
        },
      },
      {
        label: '恭敬拜师听剑半年，以谦逊之心承接太古剑仙指点',
        hint: '耗半年 · 剑道与悟性平稳暴涨',
        cost: { month: 6 },
        outcome: {
          text: '太古剑仙意念轻轻点头，以枯枝在云海划下三千道剑痕。半年清修如沐仙雨，你剑心彻底圆满。',
          effects: { expPct: 0.45, lawExp: 140, lawId: 'sword', attrs: { 悟性: 10, 道心: 8 } },
          goto: 'wrh_jx_fallen_4',
        },
      },
    ],
  },
  {
    id: 'wrh_jx_fallen_4',
    title: '九霄 · 剑亭赠仙缘',
    region: 'jiuxiao',
    pool: 'branch',
    tier: 6,
    weight: 0,
    text: '青石剑亭渐渐化作星雾消散于云海深处，唯留三件太古剑仙与坠世散仙留下的绝世重宝浮于你身前：一柄吞吐太初清光的仙剑、一枚续命五百载的太乙长生果，以及一卷先天混沌玉简。',
    choices: [
      {
        label: '承接「太初问道仙剑」与仙灵丹，誓以手中剑破开仙门',
        hint: '绝世仙剑与仙灵丹 · 称号「太古剑亭传人」',
        outcome: {
          text: '仙剑鸣空震动九霄，你背剑立于云崖回望九州，胸中豪气直贯天宇！',
          effects: { items: ['taichu_xianjian', 'xianling_dan'], reputation: 450, title: '太古剑亭传人', counter: { secrets: 1 } },
        },
      },
      {
        label: '承接《混沌太初仙典》与太乙长生果，万法归宗谋长生',
        hint: '仙阶混沌玉简与长生仙果 · 称号「九霄问剑客」',
        outcome: {
          text: '仙典入识海，长生果护寿元，你向空荡云崖深深一揖，飘然迈向无垠九霄。',
          effects: { items: ['yujian_hundun', 'changsheng_guo'], lifespan: 300, reputation: 400, title: '九霄问剑客', counter: { secrets: 1 } },
        },
      },
    ],
  },

  // ---------- 链三：纪元天劫异象（3 段） ----------
  {
    id: 'wrh_jx_omen_1',
    title: '九霄 · 血月劫云蔽星河',
    region: 'jiuxiao',
    pool: 'world',
    tier: 6,
    weight: 4,
    minRealm: 7,
    maxRealm: 9,
    once: true,
    text: '九霄星海突生罕见异象——原本金紫交辉的祥云竟在瞬间染成诡异暗红，万古渡劫败亡者的怨念汇成无边黑潮，一尊头戴业火王冠的「万劫心魔皇」踏着劫灰自云海升起，所过之处诸天星光尽皆黯淡！',
    choices: [
      {
        label: '以不灭道心直面万劫心魔皇，斩灭纪元劫煞',
        hint: '战万劫心魔皇 · 渡劫心魔至强考校',
        combat: {
          enemy: 'karmic_demon_lord',
          win: {
            text: '业火王冠在你清光之下寸寸崩碎！心魔皇凄厉尖啸着化散，暗红劫云裂开一道缝隙，却露出一双更恐怖的域外魔仙冷眸！',
            effects: { demon: -60, attrs: { 道心: 10 }, expPct: 0.38, reputation: 360, flag: { 斩灭万劫魔皇: true } },
            goto: 'wrh_jx_omen_2',
          },
          lose: {
            text: '古今失败者的绝望情绪如海啸灌入神府，你吐血退避千里，道心险些蒙尘。',
            effects: { hp: -860, demon: 30, injury: 2 },
          },
        },
      },
      {
        label: '祭出九品天道莲净化劫云怨念，瓦解心魔皇根基',
        hint: '消耗天道莲 · 净世清光破魔皇',
        require: 'has("tiandao_lotus")',
        requireHint: '行囊中无天道莲',
        cost: { item: 'tiandao_lotus' },
        outcome: {
          text: '九品青莲绽放亿万清辉，万载怨煞如冰雪消融，万劫心魔皇不战自溃！然而劫云深处骤然探出一只域外魔仙巨手！',
          effects: { demon: -70, karma: 180, reputation: 320, attrs: { 道心: 9 }, flag: { 青莲净魔皇: true } },
          goto: 'wrh_jx_omen_2',
        },
      },
    ],
  },
  {
    id: 'wrh_jx_omen_2',
    title: '九霄 · 域外魔仙窥下界',
    region: 'jiuxiao',
    pool: 'branch',
    tier: 6,
    weight: 0,
    text: '暗红劫云彻底撕裂，一尊自上界堕入界海深渊的真仙级「域外魔仙」现身九霄！他脚踏崩碎星辰，声音如寒冰刮骨：「这方下界灵气将枯，随本座堕入界海魔域，赐尔真仙永生；若敢阻拦，连尔带九州一并抹去！」',
    choices: [
      {
        label: '「宁折不弯，九州苍生岂容魔仙涂炭！」——血战域外魔仙',
        hint: '战域外魔仙 · 终极真仙死战，惊动诸天',
        combat: {
          enemy: 'abyssal_immortal_demon',
          win: {
            text: '一场打碎星河的绝世大战震撼九霄！你借九霄天雷与满身法则重创域外魔仙，硬生生将其逐回深渊界海！',
            effects: { expPct: 0.65, karma: 300, reputation: 800, attrs: { 道心: 15, 根骨: 12 }, flag: { 逐退域外魔仙: true } },
            goto: 'wrh_jx_omen_3',
          },
          lose: {
            text: '域外魔仙举念崩天，你燃尽精血死守九州门户，终撑到南天门仙雷齐落将其逼退，自身亦重伤垂死。',
            effects: { hp: -1200, injury: 2, karma: 150, reputation: 350 },
            goto: 'wrh_jx_omen_3',
          },
        },
      },
      {
        label: '以混沌法则强行引爆九霄紫雷云海，借天地天威同驱魔仙',
        hint: '混沌或雷霆法则 ≥ 4 · 借天威破魔仙',
        require: 'law("chaos") >= 4 || law("thunder") >= 4',
        requireHint: '需混沌或雷霆法则达登峰造极',
        roll: {
          p: 0.68,
          attrs: { 悟性: 0.008, 道心: 0.008 },
          success: {
            text: '你引动九重紫霄雷海如天河倾覆，连域外魔仙也不敢硬接天地反噬，怒骂一声撕裂界海退去！',
            effects: { expPct: 0.5, lawExp: 140, lawId: 'thunder', karma: 240, reputation: 600, flag: { 引天雷驱魔仙: true } },
            goto: 'wrh_jx_omen_3',
          },
          fail: {
            text: '天雷反噬同样重创于你，好在狂暴雷海仍将魔仙逼退界外，九州安然无恙！',
            effects: { hp: -900, karma: 180, reputation: 380 },
            goto: 'wrh_jx_omen_3',
          },
        },
      },
    ],
  },
  {
    id: 'wrh_jx_omen_3',
    title: '九霄 · 纪元功德天降瑞',
    region: 'jiuxiao',
    pool: 'branch',
    tier: 6,
    weight: 0,
    text: '暗红劫云尽散，九霄云海洒下万年未见的金色天道功德雨！九州凡间与仙门抬头望天，皆见云霞之上浮现你的法相虚影。天道嘉奖随之凝聚——九霄紫雷核、混沌初开灵液与太乙护道仙符齐齐垂落你身前！',
    choices: [
      {
        label: '恭领天道三宝，铸就九州万古护道传奇',
        hint: '得九霄紫雷核、混沌初开灵液、太乙护道仙符与至尊称号',
        outcome: {
          text: '三大仙珍入手生辉，你周身缠绕浩瀚天地功德，从此渡劫如履平地，万魔辟易！',
          effects: { items: ['jiuxiao_leijie', 'hundun_lingye', 'taiyi_hudaofu'], lifespan: 500, breakBonus: 35, reputation: 500, title: '九州护界仙尊', counter: { secrets: 1 } },
        },
      },
      {
        label: '将大半天道功德反哺下界衰竭灵脉，只留九霄紫雷核自用',
        hint: '无上大德 · 全属性暴涨，心魔永寂',
        outcome: {
          text: '九州枯竭千年的灵脉齐齐复苏，山川百花盛放！天道清辉再度加身，你的心魔彻底化作虚无，大道圆满无缺！',
          effects: { items: ['jiuxiao_leijie', 'dujie_shengdan'], karma: 400, demon: -100, attrs: { 悟性: 12, 根骨: 12, 道心: 15, 神识: 12, 气运: 10 }, title: '补天济世真仙', counter: { secrets: 1 } },
        },
      },
    ],
  },

  // ---------- 独立奇遇 34 段（wrh_jx_01 ~ wrh_jx_34） ----------
  {
    id: 'wrh_jx_01',
    title: '九霄 · 紫雷长廊锻仙骨',
    region: 'jiuxiao',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 7,
    maxRealm: 9,
    text: '两道万丈雷云墙在九霄云海夹出一条百里「紫雷长廊」，廊内永昼不息地游走着如真龙般粗细的紫霄神雷。廊心深处一颗拳头大小的「九霄紫雷核」在电浆中沉浮不定。',
    choices: [
      {
        label: '步入紫雷长廊硬抗九十九道神雷，直取九霄紫雷核',
        hint: '根骨 ≥ 60 · 根骨与道心检定，得仙珍九霄紫雷核',
        require: 'char.attrs.根骨 >= 60',
        requireHint: '根骨不足六十，难承紫雷长廊洗礼',
        cost: { month: 2 },
        roll: {
          p: 0.64,
          attrs: { 根骨: 0.008, 道心: 0.008 },
          success: {
            text: '九十九道神雷洗尽你体内最后一丝凡胎杂质！你安然走到廊心摘下九霄紫雷核，周身电光如龙盘绕！',
            effects: { items: ['jiuxiao_leijie'], lawExp: 120, lawId: 'thunder', attrs: { 根骨: 8 } },
          },
          fail: {
            text: '第八十一道神雷劈碎护体仙光，你焦头烂额跃出长廊，所幸仍悟得极深雷霆大道。',
            effects: { hp: -620, lawExp: 70, lawId: 'thunder', breakBonus: 15 },
          },
        },
      },
      {
        label: '盘坐长廊入口借溢散紫电温养仙躯两月',
        hint: '耗两月 · 雷霆法则与渡劫成算双涨',
        cost: { month: 2 },
        outcome: {
          text: '你徐徐引紫电淬炼筋骨六十日，抗劫之能大增，道心愈发沉稳。',
          effects: { lawExp: 95, lawId: 'thunder', breakBonus: 20, expPct: 0.34 },
        },
      },
    ],
  },
  {
    id: 'wrh_jx_02',
    title: '九霄 · 古散仙残碑林',
    region: 'jiuxiao',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 7,
    maxRealm: 9,
    text: '云海孤礁上立着三十六块风蚀玉碑，皆是昔年止步于九霄门外的渡劫大能临终手刻。碑文或狂傲、或苍凉，字里行间尽藏着他们以性命换来的渡劫教训与破境心得。',
    choices: [
      {
        label: '逐一诵读三十六块残碑，以先贤血泪鉴己身之道',
        hint: '耗三月 · 悟性、道心与破境成算暴涨',
        cost: { month: 3 },
        outcome: {
          text: '三十六位万古英杰的成败得失在识海一一重演。你合目长叹，避开了渡劫之时最致命的三处暗礁！',
          effects: { breakBonus: 30, attrs: { 悟性: 9, 道心: 8 }, expPct: 0.4, demon: -30 },
        },
      },
      {
        label: '整理残碑香火，拾起碑下前辈遗留的渡劫丹囊',
        hint: '敬贤得礼 · 得天劫丹与功德',
        outcome: {
          text: '你修补裂碑、燃香致意。最古那块玉碑裂口滑落一只锦囊，内藏一粒天劫丹与一粒大乘紫气丹。',
          effects: { items: ['tianjie_dan', 'dacheng_dan'], karma: 80, reputation: 160 },
        },
      },
    ],
  },
  {
    id: 'wrh_jx_03',
    title: '九霄 · 浮空道果仙园',
    region: 'jiuxiao',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 7,
    maxRealm: 9,
    text: '九霄金云托起一座残破的白玉药园，园中荒草尽是万年灵芝，中央两株古木分别悬着一枚霞光流转的「悟道果」与一枚延寿五百载的「太乙长生果」，空气中仙灵之气浓得化不开。',
    choices: [
      {
        label: '摘取太乙长生果与悟道果，并将园中枯泉重新引通',
        hint: '得仙阶长生果与悟道果 · 结下善果',
        outcome: {
          text: '你采果之余不忘疏通玉园灵泉，令两株太古仙树重焕勃勃生机，冥冥中倍增气运！',
          effects: { items: ['changsheng_guo', 'dao_fruit'], karma: 90, attrs: { 气运: 6 }, expPct: 0.28 },
        },
      },
      {
        label: '在仙园药香之中静坐悟道四月，不摘一果',
        hint: '耗四月 · 修为、全属性与法则大幅飞跃',
        cost: { month: 4 },
        outcome: {
          text: '你只吸纳仙园漫溢的先天道韵静修百二十日，起身时整座玉园灵树皆向你摇枝致意。',
          effects: { expPct: 0.58, lawExp: 130, lawId: 'pill', attrs: { 悟性: 8, 根骨: 8, 道心: 8 }, lifespan: 200 },
        },
      },
    ],
  },
  {
    id: 'wrh_jx_04',
    title: '九霄 · 斩三尸天镜台',
    region: 'jiuxiao',
    pool: 'wild',
    tier: 6,
    weight: 4,
    minRealm: 7,
    maxRealm: 9,
    text: '云海中央浮着一座无尘天镜台，镜面映出的并非你的容貌，而是善念、恶念、执念化形而出的「三尸」法身。太古真仙传言：唯有斩尽三尸、明见本我，方可在九霄天劫下元神不灭！',
    choices: [
      {
        label: '拔剑直斩三尸法身，以铁血道心断尽尘世拖累',
        hint: '战终极心魔 · 胜则心魔永消、道心暴涨',
        combat: {
          enemy: 'heart_demon',
          win: {
            text: '三剑落定，善恶执三尸尽数化作先天清气归于元神！你灵台通明无垢，宛如琉璃仙身！',
            effects: { demon: -100, attrs: { 道心: 14, 神识: 10 }, expPct: 0.48, breakBonus: 25 },
          },
          lose: {
            text: '三尸合击直指你最深沉的破绽，你心神剧震退下镜台，久久难平。',
            effects: { hp: -720, demon: 25, injury: 2 },
          },
        },
      },
      {
        label: '盘坐天镜前笑纳三尸归元，不斩亦不避，化执为道',
        hint: '道心 ≥ 80 · 耗三月，超然蜕变',
        require: 'char.attrs.道心 >= 80',
        requireHint: '道心不足八十，恐遭三尸反噬',
        cost: { month: 3 },
        outcome: {
          text: '「善恶皆是我，执妄亦本心。」三尸闻言相视一笑，竟主动化光融入你紫府！寿元与全维度道行骤增！',
          effects: { demon: -100, attrs: { 道心: 14, 悟性: 10, 魅力: 6 }, lifespan: 260, expPct: 0.5 },
        },
      },
    ],
  },
  {
    id: 'wrh_jx_05',
    title: '九霄 · 诸天业力星秤',
    region: 'jiuxiao',
    pool: 'world',
    tier: 6,
    weight: 3,
    minRealm: 7,
    maxRealm: 9,
    text: '九霄星河交汇处垂下一架星光凝成的巨秤，秤盘一端闪耀着你自炼气至今积下的所有善缘功德，另一端翻涌着一路杀伐沾染的血债因果。飞升之前，天地必作清算。',
    choices: [
      {
        label: '坦然步上星秤接受天地清算，无愧平生',
        hint: '业力 ≥ 120 获大仙赐，否则亦悟因果至理',
        require: 'karma >= 120',
        requireHint: '业力未至一百二十，难引星秤极致嘉奖',
        outcome: {
          text: '功德星盘金光冲破九重天！星秤赐下一粒渡劫玄黄丹与海量因果大道真悟，令你气运登峰造极！',
          effects: { items: ['dujie_shengdan'], lawExp: 140, lawId: 'karma', attrs: { 气运: 10, 道心: 8 }, demon: -50 },
        },
      },
      {
        label: '以一缕本命真元化作香火愿力回向九州，了却前尘旧债',
        hint: '耗三月 · 业力大涨、心魔尽扫、因果精进',
        cost: { month: 3 },
        outcome: {
          text: '愿力化雨落回万里人间，星秤两端瞬息平衡。你眉宇间煞气尽退，只余朗朗仙风。',
          effects: { karma: 150, demon: -60, lawExp: 110, lawId: 'karma', attrs: { 道心: 8 } },
        },
      },
    ],
  },
  {
    id: 'wrh_jx_06',
    title: '九霄 · 混沌吞界鲲遨云海',
    region: 'jiuxiao',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 7,
    maxRealm: 9,
    text: '无垠星海边缘忽现阴影遮蔽千里云涛——一头横亘星空的太初巨兽「混沌吞界鲲」正摆尾游弋，背脊鳞甲硬撼九霄仙雷毫发无损，尾鳍扫过之处竟洒落点点混沌初开灵液！',
    choices: [
      {
        label: '凌空挑战混沌吞界鲲，争夺太初凶兽护身的混沌宝液',
        hint: '战混沌吞界鲲 · 渡劫巨兽，胜得重宝',
        combat: {
          enemy: 'chaos_leviathan',
          win: {
            text: '你在星海翻腾间击碎巨鲲护体罡风，巨兽发出一声悠远长鸣转身潜入界海，留下一瓶混沌初开灵液与混沌母气！',
            effects: { items: ['hundun_lingye', 'hundun_muqi'], expPct: 0.45, lawExp: 120, lawId: 'chaos', reputation: 380 },
          },
          lose: {
            text: '巨鲲一尾扫出星河坍塌之势，你被震飞千里吐血不止，方知太初神兽之伟力。',
            effects: { hp: -920, injury: 2 },
          },
        },
      },
      {
        label: '御空尾随巨鲲三千里，默默拾取尾鳍散落的混沌灵珠',
        hint: '气运与空间检定 · 智取混沌奇珍',
        roll: {
          p: 0.65,
          attrs: { 气运: 0.009, 神识: 0.009 },
          success: {
            text: '巨鲲浑然不觉身后蝼蚁，你一路收取星海逸散的混沌精华，竟凝出一滴混沌初开灵液！',
            effects: { items: ['hundun_lingye'], lawExp: 80, lawId: 'space', expPct: 0.3 },
          },
          fail: {
            text: '巨鲲忽地翻身掀起空间乱流，你急忙远遁，仅收得一缕混沌余韵。',
            effects: { hp: -420, lawExp: 55, lawId: 'chaos' },
          },
        },
      },
    ],
  },
  {
    id: 'wrh_jx_07',
    title: '九霄 · 南天门仙将巡云海',
    region: 'jiuxiao',
    pool: 'world',
    tier: 6,
    weight: 3,
    minRealm: 7,
    maxRealm: 9,
    text: '九霄云海之上金鼓微鸣，一队天庭巡逻仙兵簇拥着一位真仙级「南天门仙将」巡视界壁。仙将目光如电扫过你周身道韵，停步长戈一点：「下界竟然出了如此道骨？可敢接本将十招试手？」',
    choices: [
      {
        label: '慨然应战，与南天门仙将在云海放手切磋',
        hint: '战南天门仙将 · 真仙交锋，得仙阶厚赏',
        combat: {
          enemy: 'celestial_warden',
          win: {
            text: '云涛万里皆碎！仙将收戈哈哈大笑，解下腰间一张太乙护道仙符与一粒渡劫玄黄丹郑重赠你！',
            effects: { items: ['taiyi_hudaofu', 'dujie_shengdan'], reputation: 520, expPct: 0.5, attrs: { 根骨: 10 } },
          },
          lose: {
            text: '仙将枪法如天雷压顶，你虽败下阵来，对方仍赞你可塑，随手赐下一粒仙灵丹勉励。',
            effects: { hp: -980, items: ['xianling_dan'], reputation: 180 },
          },
        },
      },
      {
        label: '拱手行礼请教上界仙域风貌，不逞无谓血气',
        hint: '稳妥 · 增广见闻、悟性与声望齐升',
        outcome: {
          text: '仙将见你进退有度，颇为赏识，随口指点了数句渡劫化仙诀窍与上界格局，便率兵乘云离去。',
          effects: { expPct: 0.32, attrs: { 悟性: 8, 神识: 6 }, breakBonus: 18, reputation: 150 },
        },
      },
    ],
  },
  {
    id: 'wrh_jx_08',
    title: '九霄 · 太古剑仙星河一划',
    region: 'jiuxiao',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 7,
    maxRealm: 9,
    text: '九霄夜空群星璀璨，唯独天河正中被一道十万年前留下的青色剑痕截断至今未能愈合。今夜星光汇聚，竟在剑痕之上重现了一缕「太古剑仙意念」挥剑断星河的无上风姿！',
    choices: [
      {
        label: '纵身跃入星河剑痕，与太古剑仙意念对剑问极境',
        hint: '战太古剑仙意念 · 胜则剑道登峰造极',
        combat: {
          enemy: 'primordial_sword_immortal',
          win: {
            text: '两道剑光映亮九重天！剑仙意念含笑散去，星河剑痕化作亿万剑意洗礼你身，更凝出仙灵丹与无上剑悟！',
            effects: { items: ['xianling_dan'], lawExp: 200, lawId: 'sword', attrs: { 悟性: 10, 道心: 10 }, reputation: 500 },
          },
          lose: {
            text: '星河断流一剑岂容凡躯轻易抗衡，你喋血云海，剑道却于生死之间暴涨一大截！',
            effects: { hp: -1020, lawExp: 110, lawId: 'sword', injury: 2 },
          },
        },
      },
      {
        label: '盘坐星河畔痴看那一剑起落三月，细细印证己身剑诀',
        hint: '耗三月 · 剑道法则与悟性大涨',
        cost: { month: 3 },
        outcome: {
          text: '三月如梦，你反复揣摩那一剑化繁为简的至高境界，抬指间已有断云裂空之威。',
          effects: { lawExp: 135, lawId: 'sword', attrs: { 悟性: 8, 神识: 6 }, expPct: 0.38 },
        },
      },
    ],
  },
  {
    id: 'wrh_jx_09',
    title: '九霄 · 界海魔仙抛魔枝',
    region: 'jiuxiao',
    pool: 'world',
    tier: 6,
    weight: 3,
    minRealm: 7,
    maxRealm: 9,
    text: '云海边缘空间幽暗，一道魔影隔着界海裂缝向你低语——竟是真仙级「域外魔仙」的一缕化身！他掷出一团跳动的紫黑魔元，诱惑道：「何必苦熬天门雷劫？吞下此元，即刻跳过渡劫，随吾纵横无尽魔界！」',
    choices: [
      {
        label: '怒叱魔仙妖言惑众，挥剑斩碎魔元正面迎战',
        hint: '战域外魔仙 · 守正道本心，得逆天重赏',
        combat: {
          enemy: 'abyssal_immortal_demon',
          win: {
            text: '正气与仙雷交织，魔仙化身在你手下灰飞烟灭！天道垂青，赐下渡劫玄黄丹与无上功德！',
            effects: { items: ['dujie_shengdan', 'tiandao_lotus'], karma: 260, demon: -80, reputation: 600 },
          },
          lose: {
            text: '魔仙化身临散前反扑极烈，将你震伤云海，然你道心毫不动摇，反获清光护体。',
            effects: { hp: -1050, attrs: { 道心: 10 }, karma: 100, demon: -30 },
          },
        },
      },
      {
        label: '心念不动，以因果神通直接封印裂缝断绝魔音',
        hint: '道心大涨 · 心魔尽消，因果与功德丰收',
        outcome: {
          text: '你连看都未多看那团魔元一眼，挥袖以清气封死界缝。魔音戛然而止，你的道心澄明更胜往昔。',
          effects: { demon: -60, karma: 140, lawExp: 100, lawId: 'karma', attrs: { 道心: 10 } },
        },
      },
    ],
  },
  {
    id: 'wrh_jx_10',
    title: '九霄 · 万劫怨云魔皇现',
    region: 'jiuxiao',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 7,
    maxRealm: 9,
    text: '一阵无声黑风吹过九霄云台，眼前仙山楼阁倏忽化作漫天焦土尸骸——渡劫大魔「万劫心魔皇」借你心中潜藏的一丝疲惫悄然现身，幻化出你昔日陨落同道与故人的泣血面容！',
    choices: [
      {
        label: '直破虚妄幻海，斩杀万劫心魔皇证不朽真我',
        hint: '战万劫心魔皇 · 胜则心魔永除、得大乘渡劫珍宝',
        combat: {
          enemy: 'karmic_demon_lord',
          win: {
            text: '黑风散尽，云台重明！万劫心魔皇化作一缕纯净无垢的太古道韵融入你眉心，天道莲香随之盈袖！',
            effects: { items: ['tiandao_lotus'], demon: -100, attrs: { 道心: 12, 神识: 8 }, expPct: 0.42 },
          },
          lose: {
            text: '旧日梦魇太重，你被魔皇趁隙撕裂心防，耗去数月方重新收束元神。',
            effects: { hp: -820, demon: 35, injury: 2 },
          },
        },
      },
      {
        label: '当场服下一粒九转金丹稳固神魂，闭目诵道经破幻',
        hint: '消耗九转金丹 · 稳破魔皇，寿元道心双升',
        require: 'has("jiuzhuan_dan")',
        requireHint: '行囊中无九转金丹',
        cost: { item: 'jiuzhuan_dan' },
        outcome: {
          text: '九转仙力冲散漫天魔障，万劫心魔皇无隙可钻只得怒啸退散，你的气血道心反臻化境！',
          effects: { demon: -80, attrs: { 道心: 10 }, lifespan: 180, expPct: 0.35 },
        },
      },
    ],
  },
  {
    id: 'wrh_jx_11',
    title: '九霄 · 雷柱之巅演天罚',
    region: 'jiuxiao',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 7,
    maxRealm: 9,
    text: '九霄雷海深处矗立着一根接天连地的紫金雷柱，柱顶「紫霄天劫法身」正日夜演练九重天罚枪法。枪影舞动间，每一式皆蕴含灭世与新生并存的雷霆至理。',
    choices: [
      {
        label: '跃上雷柱顶与紫霄天劫法身过招试劫',
        hint: '战紫霄天劫法身 · 胜得九霄紫雷核与大破境助力',
        combat: {
          enemy: 'thunder_tribulation_avatar',
          win: {
            text: '雷柱震响九天！法身于万道紫电中崩散，柱心露出一枚璀璨夺目的九霄紫雷核！',
            effects: { items: ['jiuxiao_leijie'], lawExp: 135, lawId: 'thunder', breakBonus: 28, expPct: 0.38 },
          },
          lose: {
            text: '天罚雷枪威不可挡，你被劈下雷柱焦黑狼狈，却记住了三成雷劫变招。',
            effects: { hp: -820, lawExp: 65, lawId: 'thunder', injury: 1 },
          },
        },
      },
      {
        label: '于雷柱十里外静观法身演武两月，细悟天罚节奏',
        hint: '耗两月 · 雷霆法则与渡劫成算稳涨',
        cost: { month: 2 },
        outcome: {
          text: '你把九重天罚每一息蓄力与落雷的间隙牢记于心，渡劫之时必能游刃有余。',
          effects: { lawExp: 105, lawId: 'thunder', breakBonus: 22, attrs: { 悟性: 6 } },
        },
      },
    ],
  },
  {
    id: 'wrh_jx_12',
    title: '九霄 · 裁决古殿论天律',
    region: 'jiuxiao',
    pool: 'world',
    tier: 6,
    weight: 3,
    minRealm: 7,
    maxRealm: 9,
    text: '白玉雷云凝聚出一座宏伟无朋的裁决古殿，「九霄天门裁决者」端坐天律王座，手持天道金册发问：「上界秩序森严，下界凡修却常逆天改命。若尔成仙，当顺天律，抑或开新道？」',
    choices: [
      {
        label: '「天律合道则顺，天律蔽民则斩！」——以拳剑明志',
        hint: '战九霄天门裁决者 · 震撼天庭，获重宝',
        combat: {
          enemy: 'sky_arbiter',
          win: {
            text: '裁决古殿在惊天碰撞中化作万丈金芒！巨人收剑深深望你一眼，抛下一粒渡劫玄黄丹消失云海。',
            effects: { items: ['dujie_shengdan'], reputation: 420, attrs: { 道心: 10 }, expPct: 0.4 },
          },
          lose: {
            text: '天律重压令你难以呼吸，虽被震出古殿，然你脊梁始终挺直如松。',
            effects: { hp: -880, attrs: { 道心: 6 }, reputation: 160 },
          },
        },
      },
      {
        label: '「天律本为护众生大道，顺逆皆在一心公道」',
        hint: '悟性 ≥ 70 且道心 ≥ 70 · 舌服裁决者',
        require: 'char.attrs.悟性 >= 70 && char.attrs.道心 >= 70',
        requireHint: '悟性或道心未至七十，难撼天律之辩',
        outcome: {
          text: '天道金册无风自动翻过数页，竟亮起一抹温润金辉！裁决者颔首赐下一张太乙护道仙符与大乘紫气丹。',
          effects: { items: ['taiyi_hudaofu', 'dacheng_dan'], karma: 140, reputation: 320, attrs: { 悟性: 8, 道心: 8 } },
        },
      },
    ],
  },
  {
    id: 'wrh_jx_13',
    title: '九霄 · 云崖散仙独酌酒',
    region: 'jiuxiao',
    pool: 'world',
    tier: 6,
    weight: 3,
    minRealm: 7,
    maxRealm: 9,
    text: '九霄罡风吹不到的背风云崖上，一名身负破旧葫芦的「坠世散仙」正对着下界星火独饮。见你路过，他扬手抛来一只青玉酒杯：「飞升失败一千年，最难熬的不是雷劫，是连个喝酒拆招的对手都没有！」',
    choices: [
      {
        label: '满饮仙酿，随后与坠世散仙在云崖酣畅斗剑一场',
        hint: '战坠世散仙 · 以武会友，得仙珍厚赠',
        combat: {
          enemy: 'fallen_immortal',
          win: {
            text: '三百回合剑雨洒满云海，散仙畅快大笑把腰间仙酿与一粒仙灵丹尽数抛给你：「痛快！这一战抵得过老夫千年枯坐！」',
            effects: { items: ['xianling_dan', 'dao_fruit'], lawExp: 120, lawId: 'sword', lifespan: 150, reputation: 320 },
          },
          lose: {
            text: '散仙剑老成精，三招破你护体剑幕后笑着收剑扶你起身，仍分你半壶延寿仙酿。',
            effects: { hp: -680, lifespan: 100, lawExp: 65, lawId: 'sword' },
          },
        },
      },
      {
        label: '只坐于云崖陪他痛饮一月，听他讲遍千年九霄旧闻',
        hint: '耗一月 · 延寿、悟道与心魔大消',
        cost: { month: 1 },
        outcome: {
          text: '酒过三巡，散仙把自己当年渡劫落败的每一处破绽倾囊相告。临别时你寿元大涨，渡劫成算飙升！',
          effects: { breakBonus: 26, lifespan: 120, demon: -45, expPct: 0.35, attrs: { 道心: 7 } },
        },
      },
    ],
  },
  {
    id: 'wrh_jx_14',
    title: '九霄 · 太初剑石余韵',
    region: 'jiuxiao',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 7,
    maxRealm: 9,
    text: '云海孤石之上留着一道三尺深、宽仅一指的剑槽。传闻太初时代「太初问道仙剑」曾插于此石千年，剑虽已入九霄深处，石槽中残留的一缕太初剑韵却仍能令大乘剑修原地顿悟。',
    choices: [
      {
        label: '以本命剑意探入石槽，接引那缕万古太初剑韵',
        hint: '剑道 ≥ 3 · 悟性检定，剑道法则暴涨',
        require: 'law("sword") >= 3',
        requireHint: '需剑道法则达融会贯通，方能承载太初剑韵',
        cost: { month: 2 },
        outcome: {
          text: '剑槽骤放白虹贯日！太初剑韵化作无上道意贯入你的元神，你的剑道已隐隐触摸到真仙极境！',
          effects: { lawExp: 165, lawId: 'sword', expPct: 0.45, attrs: { 悟性: 9, 根骨: 6 } },
        },
      },
      {
        label: '在剑石畔静坐一月，借石槽剑气打磨周身法力',
        hint: '耗一月 · 修为与剑道稳涨',
        cost: { month: 1 },
        outcome: {
          text: '三十日静修下来，你真元如千锤百炼之剑锋般凝练纯粹。',
          effects: { lawExp: 90, lawId: 'sword', expPct: 0.3, attrs: { 根骨: 5 } },
        },
      },
    ],
  },
  {
    id: 'wrh_jx_15',
    title: '九霄 · 太初钟音回响谷',
    region: 'jiuxiao',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 7,
    maxRealm: 9,
    text: '九霄星云聚成一座无形空谷，谷内每隔七日便会回荡起一声仿佛来自开天辟地之初的洪亮钟鸣——那是先天仙器「混沌太初钟」留于九霄的万古余音，一震可涤万法、定乾坤。',
    choices: [
      {
        label: '于谷心端坐七七四十九日，硬承七声太初钟音洗礼',
        hint: '耗两月 · 混沌法则暴涨，根骨道心飞跃',
        cost: { month: 2 },
        outcome: {
          text: '七声太初钟音震碎你体内一切滞涩与心魔杂尘！起身之时周身清浊交融，仿佛自成一小方混沌天地！',
          effects: { lawExp: 150, lawId: 'chaos', demon: -65, attrs: { 根骨: 9, 道心: 9 }, expPct: 0.42 },
        },
      },
      {
        label: '以玉瓶封存一缕钟音回响，炼化为护道底牌',
        hint: '得护体仙光与混沌母气',
        outcome: {
          text: '钟音凝实成一缕玄黄母气落入瓶中，更在你身周结下三重无形护体清光。',
          effects: { items: ['hundun_muqi'], shield: 3, lawExp: 75, lawId: 'chaos' },
        },
      },
    ],
  },
  {
    id: 'wrh_jx_16',
    title: '九霄 · 玄黄古丹炉遗台',
    region: 'jiuxiao',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 7,
    maxRealm: 9,
    text: '白玉浮台中央静立着一尊半融的玄黄仙炉，炉火早已熄灭万年，然炉壁内侧却沾染着一层流光溢彩的玄黄丹霜——分明曾在此炼制过绝世神丹「渡劫玄黄丹」！',
    choices: [
      {
        label: '以丹道法则与自身真火重燃残炉，刮霜再炼一炉玄黄宝丹',
        hint: '丹道 ≥ 2 或悟性 ≥ 65 · 耗两月，得渡劫玄黄丹',
        require: 'law("pill") >= 2 || char.attrs.悟性 >= 65',
        requireHint: '需丹道略有小成或悟性达到六十五',
        cost: { month: 2 },
        roll: {
          p: 0.65,
          attrs: { 悟性: 0.008, 神识: 0.008 },
          success: {
            text: '玄黄炉火再燃九霄！丹成之日霞光漫天，你竟真的凝出一粒举世罕见的渡劫玄黄丹！',
            effects: { items: ['dujie_shengdan'], lawExp: 130, lawId: 'pill' },
          },
          fail: {
            text: '残炉终究难承玄黄神火，轰然碎裂成灰，你急忙收拢丹气仍成一粒仙灵丹。',
            effects: { items: ['xianling_dan'], lawExp: 70, lawId: 'pill' },
          },
        },
      },
      {
        label: '直接刮取玄黄丹霜炼化入体，稳妥延寿增修',
        hint: '稳妥 · 修为暴涨、气血灵力尽复',
        outcome: {
          text: '玄黄丹霜入口即化，化作滚滚暖流冲刷百脉，你的寿元与修为双双跃升！',
          effects: { expPct: 0.44, lifespan: 180, hpPct: 1, mpPct: 1, demon: -25 },
        },
      },
    ],
  },
  {
    id: 'wrh_jx_17',
    title: '九霄 · 护道仙符诏坛',
    region: 'jiuxiao',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 7,
    maxRealm: 9,
    text: '云海高处悬浮着一座古仙遗留的紫玉符坛，坛上静静悬着两道紫气氤氲的「太乙护道仙符」。坛周布着重重古仙阵纹，唯有解开九宫锁阵方能无损请符。',
    choices: [
      {
        label: '以阵道与神识步步推演破开九宫锁阵，请下太乙护道仙符',
        hint: '神识与悟性检定 · 得太乙护道仙符',
        roll: {
          p: 0.66,
          attrs: { 神识: 0.008, 悟性: 0.008 },
          success: {
            text: '九宫仙纹应指而解！两道紫气浩荡的太乙护道仙符飘然落入手心，阵道感悟亦大进！',
            effects: { items: [{ id: 'taiyi_hudaofu', qty: 2 }], lawExp: 100, lawId: 'array' },
          },
          fail: {
            text: '最后一重锁阵反震毁去一道仙符，你稳住阵势终究成功请下一道太乙护道仙符。',
            effects: { items: ['taiyi_hudaofu'], hp: -380, lawExp: 55, lawId: 'array' },
          },
        },
      },
      {
        label: '临摹紫玉符坛阵纹两月，不强取仙符',
        hint: '耗两月 · 阵道法则暴涨',
        cost: { month: 2 },
        outcome: {
          text: '古仙符阵玄奥无穷，你苦心钻研六十日，举手布阵已有真仙气韵。',
          effects: { lawExp: 145, lawId: 'array', attrs: { 悟性: 7, 神识: 7 }, expPct: 0.32 },
        },
      },
    ],
  },
  {
    id: 'wrh_jx_18',
    title: '九霄 · 金云九品天道莲',
    region: 'jiuxiao',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 7,
    maxRealm: 9,
    text: '金色云海翻涌如麦浪，一朵扎根于混沌云髓中的九品「天道莲」顺着九霄清风缓缓漂过。莲瓣吞吐先天清光，所经之处连肆虐的九霄罡风都温顺如春风。',
    choices: [
      {
        label: '御风轻摘九品天道莲，留作渡劫飞升压箱之宝',
        hint: '得仙珍天道莲 · 涤心延寿',
        outcome: {
          text: '天道莲轻落玉匣，清雅莲香瞬间将你识海积存的微末心魔涤荡一空。',
          effects: { items: ['tiandao_lotus'], demon: -40, attrs: { 气运: 5 } },
        },
      },
      {
        label: '立于云海随天道莲同行一月，借先天莲韵冲关悟道',
        hint: '耗一月 · 全属性与修为飙升',
        cost: { month: 1 },
        outcome: {
          text: '你与九品仙莲并肩遨游云海三万里，待青莲化光回归天道，你已脱胎换骨、修为大进！',
          effects: { expPct: 0.5, lifespan: 180, demon: -60, attrs: { 道心: 9, 悟性: 7 } },
        },
      },
    ],
  },
  {
    id: 'wrh_jx_19',
    title: '九霄 · 司命星君棋影垂天',
    region: 'jiuxiao',
    pool: 'world',
    tier: 6,
    weight: 3,
    minRealm: 7,
    maxRealm: 9,
    text: '九霄穹顶忽现三百六十五颗大星垂落清辉，凝成一面横跨百里的虚幻星棋盘。星盘对端端坐着一道朦胧仙影——正是上界「司命星君」映照下界的一缕法念，含笑请你落子。',
    choices: [
      {
        label: '以周天星辰与因果大道落子应局，与星君隔界对弈',
        hint: '悟性 ≥ 68 · 胜则得星辰仙悟与周天星辉丹',
        require: 'char.attrs.悟性 >= 68',
        requireHint: '悟性未至六十八，难以承接司命星君棋势',
        cost: { month: 2 },
        roll: {
          p: 0.65,
          attrs: { 悟性: 0.008, 神识: 0.008 },
          success: {
            text: '你巧借星移斗转走出一步天外飞仙！星君法念抚掌大笑，赐你周天星辉丹与无上星辰法则真悟！',
            effects: { items: ['xinghui_dan', 'faze_canpian'], lawExp: 160, lawId: 'star', attrs: { 气运: 8, 悟性: 8 }, reputation: 340 },
          },
          fail: {
            text: '星君算尽诸天变数，你虽惜败三目，却也在复盘间洞悉了星辰运转的深层奥妙。',
            effects: { lawExp: 95, lawId: 'star', attrs: { 悟性: 5 }, expPct: 0.3 },
          },
        },
      },
      {
        label: '恭敬稽首，请星君赐下一句关于自身飞升劫数的箴言',
        hint: '稳妥 · 渡劫成算与气运大增',
        outcome: {
          text: '星君法念轻点你眉心留下一缕星辉：「劫从心生，亦由心灭。」言罢星盘散去，你气运与成算倍增！',
          effects: { breakBonus: 28, attrs: { 气运: 8, 道心: 6 }, demon: -35 },
        },
      },
    ],
  },
  {
    id: 'wrh_jx_20',
    title: '九霄 · 岁月尽头摆渡舟',
    region: 'jiuxiao',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 7,
    maxRealm: 9,
    text: '九霄极西云海静止不动，一叶无桨白玉孤舟缓缓驶过。舟上蓑衣老客气息与时间长河浑然一体，轻歌道：「万古英雄尽作土，唯余孤舟渡光阴。道友，可愿一观光阴尽头？」',
    choices: [
      {
        label: '登舟同行三月，在时间静止处参悟不朽光阴大道',
        hint: '耗三月 · 光阴法则与寿元飙升，得岁月朝露',
        cost: { month: 3 },
        outcome: {
          text: '玉舟行于无岁无月之地，你亲眼目睹星辰生灭如朝露一瞬。下舟时满鬓乌黑、寿元暴涨三百载！',
          effects: { items: ['guangyin_lu'], lawExp: 160, lawId: 'time', lifespan: 300, attrs: { 悟性: 8, 道心: 8 } },
        },
      },
      {
        label: '向孤舟老客献上一粒仙灵丹，求换一截建木光阴髓',
        hint: '消耗仙灵丹 · 得昆仑建木枝与光阴朝露',
        require: 'has("xianling_dan")',
        requireHint: '行囊中无仙灵丹',
        cost: { item: 'xianling_dan' },
        outcome: {
          text: '老客呵呵一笑收下仙丹，自船舱取出昆仑建木枝与岁月朝露赠你，转身撑篙消失在时间迷雾中。',
          effects: { items: ['kunlun_shenmu', 'guangyin_lu'], lifespan: 150, lawExp: 90, lawId: 'time' },
        },
      },
    ],
  },
  {
    id: 'wrh_jx_21',
    title: '九霄 · 残阙古仙跪天门',
    region: 'jiuxiao',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 7,
    maxRealm: 9,
    text: '一座崩塌半边的白玉牌楼下，一具身披金羽仙衣的「古仙尸傀」面朝南天门长跪万年。你走近瞬间，尸傀执念骤然复苏，竟误将你认作昔年阻它飞升的天庭仇敌，挥掌轰来！',
    choices: [
      {
        label: '全力迎击古仙尸傀，助其彻底解脱万年执怨',
        hint: '战古仙尸傀 · 得大乘紫气丹与仙灵丹',
        combat: {
          enemy: 'ancient_corpse',
          win: {
            text: '你破去古尸执念将其金羽遗蜕妥善收敛，牌楼石基中浮出一粒大乘紫气丹与一粒仙灵丹作为谢礼。',
            effects: { items: ['dacheng_dan', 'xianling_dan'], karma: 100, expPct: 0.35, reputation: 240 },
          },
          lose: {
            text: '古仙怨念化作剧毒掌罡，将你震飞数十里云海，伤势不轻。',
            effects: { hp: -720, injury: 2 },
          },
        },
      },
      {
        label: '以因果超度诀化解其万年怨气，不战而平执念',
        hint: '因果法则 ≥ 2 或道心 ≥ 72 · 慈悲渡古仙',
        require: 'law("karma") >= 2 || char.attrs.道心 >= 72',
        requireHint: '需因果法则略有小成或道心达到七十二',
        outcome: {
          text: '清越道音响彻残阙，古仙尸傀双眸猩红渐褪，长叹一声化作满天金光散去，留下一枚悟道果。',
          effects: { items: ['dao_fruit'], karma: 140, demon: -45, lawExp: 95, lawId: 'karma' },
        },
      },
    ],
  },
  {
    id: 'wrh_jx_22',
    title: '九霄 · 劫眼夺取紫雷核',
    region: 'jiuxiao',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 7,
    maxRealm: 9,
    text: '万里紫黑劫云在九霄极北疯狂旋转，形成一只直径十里的巨大风暴雷眼。雷眼正中并无狂暴电蛇，反而静谧得如同太古深海，一颗不断脉动的先天「九霄紫雷核」正在其中缓缓孕育！',
    choices: [
      {
        label: '孤身闯入劫云雷眼，趁其尚未引爆前强夺九霄紫雷核',
        hint: '神识与根骨检定 · 险夺仙珍九霄紫雷核',
        roll: {
          p: 0.62,
          attrs: { 根骨: 0.008, 神识: 0.008 },
          success: {
            text: '你在雷眼合拢前瞬息折跃而出，滚烫紫雷核稳稳握于掌中，九天劫云轰然消散！',
            effects: { items: ['jiuxiao_leijie'], lawExp: 120, lawId: 'thunder', expPct: 0.32 },
          },
          fail: {
            text: '劫眼提前暴走炸开万千紫电！你拼尽护身法宝逃出雷海，虽受重创却也淬炼出不凡雷体。',
            effects: { hp: -780, injury: 2, attrs: { 根骨: 6 }, lawExp: 70, lawId: 'thunder' },
          },
        },
      },
      {
        label: '在劫云外围以空间法则截取逸散雷液，炼化护身',
        hint: '稳妥 · 雷霆与空间法则并进',
        cost: { month: 1 },
        outcome: {
          text: '你避开风暴核心，从容炼化十余缕外溢雷液，既无性命之虞，又大增雷道感悟。',
          effects: { lawExp: 90, lawId: 'thunder', breakBonus: 18, expPct: 0.28 },
        },
      },
    ],
  },
  {
    id: 'wrh_jx_23',
    title: '九霄 · 界海混沌灵液泉',
    region: 'jiuxiao',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 7,
    maxRealm: 9,
    text: '九霄云海与域外虚空交界处悬着一团水球般的乳白泉眼，每一滴泉水落地皆会化生一缕阴阳二气——正是天地未分时残存至今的仙珍「混沌初开灵液」！',
    choices: [
      {
        label: '以先天玉瓶收取一瓶混沌初开灵液，并悟阴阳化生之理',
        hint: '得仙珍混沌初开灵液与混沌感悟',
        outcome: {
          text: '灵液入瓶重若万钧，你顺势参悟泉眼生灭数日，对混沌大道的体悟陡然跃升！',
          effects: { items: ['hundun_lingye'], lawExp: 110, lawId: 'chaos', attrs: { 悟性: 6 } },
        },
      },
      {
        label: '当场饮下三口混沌灵液，于界海边缘闭关重塑仙胎三月',
        hint: '耗三月 · 修为与全属性暴涨',
        cost: { month: 3 },
        outcome: {
          text: '乳白灵液化作天地初开般的洪流冲刷元神与肉身。三月后你破关而出，气机圆满直逼真仙！',
          effects: { expPct: 0.62, lawExp: 140, lawId: 'chaos', attrs: { 根骨: 10, 悟性: 10, 气运: 8 }, lifespan: 250 },
        },
      },
    ],
  },
  {
    id: 'wrh_jx_24',
    title: '九霄 · 仙凡星河断尘缘',
    region: 'jiuxiao',
    pool: 'world',
    tier: 6,
    weight: 4,
    minRealm: 7,
    maxRealm: 9,
    text: '一条清冽银亮的星河环绕南天门外围，名为「忘尘河」。上界古训云：渡此河者若饮一瓢忘尘水，便可彻底断绝凡间一切喜怒哀乐与恩怨羁绊，渡劫时再无心魔牵扯；若不饮，则须带着整个人间走上天阶。',
    choices: [
      {
        label: '俯身饮尽一瓢忘尘水，太上忘情以求极致仙途',
        hint: '心魔归零 · 悟性与破境成算暴涨',
        outcome: {
          text: '星河水入喉冰冷澄澈，尘世过往如退潮般远去。你眼神清冷如九天寒星，修为与悟性瞬息攀至绝巅！',
          effects: { demon: -100, breakBonus: 32, attrs: { 悟性: 12, 神识: 10 }, expPct: 0.45 },
        },
      },
      {
        label: '拂袖泼去忘尘水——「人间冷暖皆我道骨，一分不舍，一寸不忘！」',
        hint: '携情证道 · 道心与气运登峰造极，获长生寿元',
        outcome: {
          text: '星河微震，竟自你脚下绽开万千朵红尘金莲！不舍人间反成大圆满，你的道心坚不可摧！',
          effects: { attrs: { 道心: 15, 魅力: 8, 气运: 8 }, karma: 150, lifespan: 240, demon: -60, expPct: 0.4 },
        },
      },
    ],
  },
  {
    id: 'wrh_jx_25',
    title: '九霄 · 万阶回首望九州',
    region: 'jiuxiao',
    pool: 'world',
    tier: 6,
    weight: 4,
    minRealm: 7,
    maxRealm: 9,
    text: '立于九霄云海极巅俯瞰下界，茫茫九州缩成一幅掌中画卷：青牛山脉的晨雾、落霞仙城的灯火、东海归墟的怒涛、北荒血月与中州白玉京尽收眼底。百年沧桑如白驹过隙，初入仙途那年的青衫少年仿佛就在昨日。',
    choices: [
      {
        label: '隔空向青牛山脉与九州山河挥袖撒下一场灵雨，泽被后辈',
        hint: '无上善缘 · 大功德、声望与道心圆满',
        outcome: {
          text: '千里灵雨化作甘霖普降九州，无数炼气散修与凡人抬头欢呼。一缕璀璨人道气运逆流冲上九霄融入你身！',
          effects: { karma: 220, reputation: 400, attrs: { 道心: 12, 气运: 10 }, demon: -70, lifespan: 200 },
        },
      },
      {
        label: '静静凝望人间烟火三月，复盘一生修行点滴',
        hint: '耗三月 · 修为暴涨、全法则融会贯通',
        cost: { month: 3 },
        outcome: {
          text: '由凡入仙的每一道关窍在眼前豁然贯通，你轻轻一笑，转身面向九霄天门再无牵挂。',
          effects: { expPct: 0.55, lawExp: 130, lawId: 'karma', attrs: { 悟性: 10, 道心: 10 } },
        },
      },
    ],
  },
  {
    id: 'wrh_jx_26',
    title: '九霄 · 云海仙礁遗丹瓶',
    region: 'jiuxiao',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 7,
    maxRealm: 9,
    text: '一座漂浮于九霄雷云间隙的赤玉浮礁上，竟卡着两只自上界丹宫意外坠落的紫金宝瓶！瓶塞虽有细微裂纹，溢出的丝丝仙丹霞气已将整座浮礁染作七彩琉璃。',
    choices: [
      {
        label: '冒罡风之险稳稳摄回两只上界紫金丹瓶',
        hint: '气运与神识检定 · 获天劫丹与仙灵丹',
        roll: {
          p: 0.68,
          attrs: { 气运: 0.008, 神识: 0.008 },
          success: {
            text: '两只紫金宝瓶安然入掌，开封刹那仙香直透神府——竟是一粒天劫丹与一粒仙灵丹！',
            effects: { items: ['tianjie_dan', 'xianling_dan'], attrs: { 气运: 5 } },
          },
          fail: {
            text: '罡风掀翻了其中一只宝瓶，丹气散于云海，所幸你仍稳稳抢回了另一瓶仙灵丹！',
            effects: { items: ['xianling_dan'], expPct: 0.2 },
          },
        },
      },
      {
        label: '就地炼化浮礁四周已染满丹气的赤玉霞光一月',
        hint: '耗一月 · 稳健增长修为与寿元',
        cost: { month: 1 },
        outcome: {
          text: '你盘坐七彩赤玉礁吐纳三十日，气血法力充盈欲溢，寿元亦增百载。',
          effects: { expPct: 0.42, lifespan: 100, hpPct: 1, mpPct: 1 },
        },
      },
    ],
  },
  {
    id: 'wrh_jx_27',
    title: '九霄 · 无字因果天书石',
    region: 'jiuxiao',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 7,
    maxRealm: 9,
    text: '九霄天门北侧悬着一页十丈见方的先天玉书，书页洁白无字，然当你走近凝视，玉书表面竟自行浮现出你此生所有的抉择、奇遇、恩仇与未来无数条命运分叉！',
    choices: [
      {
        label: '以神识通读无字天书，洞穿三生因果脉络',
        hint: '耗两月 · 因果法则暴涨，得《天机因果秘录》真传',
        cost: { month: 2 },
        outcome: {
          text: '过去已定而未来无穷，你在亿万命运丝线中一把捉住最明亮的那条长生大道！',
          effects: { items: ['yujian_yinguo'], lawExp: 165, lawId: 'karma', attrs: { 悟性: 9, 气运: 8 }, demon: -45 },
        },
      },
      {
        label: '在天书空白处挥指题下「我命由我」四字便洒然离去',
        hint: '豪迈问道 · 道心暴涨、渡劫成算大增',
        outcome: {
          text: '四字落处金光四射，无字天书轰然共振！你的道心与破境威势攀上全新高峰！',
          effects: { attrs: { 道心: 12, 根骨: 6 }, breakBonus: 26, expPct: 0.36, reputation: 280 },
        },
      },
    ],
  },
  {
    id: 'wrh_jx_28',
    title: '九霄 · 诸天周星古阵图',
    region: 'jiuxiao',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 7,
    maxRealm: 9,
    text: '云海下方万丈虚空铭刻着一座运转了百万年的「周天封界仙阵」，正是这座旷世奇阵护佑着九州不致在界海风暴中解体。此刻阵图一角星光略显黯淡，似有细微岁月裂痕。',
    choices: [
      {
        label: '耗费两月法力修补仙阵裂痕，顺便参悟太古仙阵总纲',
        hint: '耗两月 · 阵道法则暴涨，大功德与丰厚仙赐',
        cost: { month: 2 },
        outcome: {
          text: '仙阵重现璀璨星光！你不仅收获护界大功德，更将太古周天阵理彻悟大半！',
          effects: { lawExp: 170, lawId: 'array', karma: 180, reputation: 340, attrs: { 悟性: 9, 神识: 8 } },
        },
      },
      {
        label: '以一块虚空晶嵌入受损星眼，瞬间补全仙阵',
        hint: '消耗虚空晶 · 得太乙护道仙符与大功德',
        require: 'has("xukong_jing")',
        requireHint: '行囊中无虚空晶',
        cost: { item: 'xukong_jing' },
        outcome: {
          text: '虚空晶完美填补裂隙，周天仙阵回馈出一道清光，竟凝成一张太乙护道仙符与海量空间阵道感悟！',
          effects: { items: ['taiyi_hudaofu'], lawExp: 130, lawId: 'space', karma: 160, reputation: 280 },
        },
      },
    ],
  },
  {
    id: 'wrh_jx_29',
    title: '九霄 · 上界先天仙露雨',
    region: 'jiuxiao',
    pool: 'world',
    tier: 6,
    weight: 4,
    minRealm: 7,
    maxRealm: 9,
    text: '南天门缝隙今日罕见地舒展了一瞬，一缕上界琼池仙水溢落九霄，化作绵绵金色仙露洒遍方圆千里云海。凡沐此仙露者，凡骨蜕仙、寿元延绵，连积年道伤亦能顷刻痊愈！',
    choices: [
      {
        label: '张开双臂痛快淋一场上界先天仙露雨',
        hint: '伤势尽愈 · 寿元、修为与全属性大涨',
        outcome: {
          text: '金色仙露渗入每一寸仙躯，你周身绽出淡淡仙芒，寿元暴增三百载，修为直冲云霄！',
          effects: { expPct: 0.52, lifespan: 300, heal: 5, hpPct: 1, mpPct: 1, attrs: { 根骨: 8, 魅力: 6, 气运: 6 }, demon: -40 },
        },
      },
      {
        label: '以玉壶广收仙露凝丹，留作日后决战或渡劫之用',
        hint: '得仙灵丹与太乙长生果',
        outcome: {
          text: '你催动丹道手法将漫天仙露收束凝实，竟收获仙灵丹与一粒生机浩瀚的太乙长生果！',
          effects: { items: ['xianling_dan', 'changsheng_guo'], lawExp: 90, lawId: 'pill' },
        },
      },
    ],
  },
  {
    id: 'wrh_jx_30',
    title: '九霄 · 劫灰深处青莲芽',
    region: 'jiuxiao',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 7,
    maxRealm: 9,
    text: '九霄天劫劈出的万丈焦黑劫灰堆中，死寂无声，寸灵不存。唯有你低头凝视时，竟见厚厚劫灰缝隙里顶出一株纤细却璀璨的青莲幼芽——毁灭之极处，恰是生机萌发之始。',
    choices: [
      {
        label: '盘坐劫灰之旁静观一芽破死而生，体悟毁灭与造化之道',
        hint: '耗两月 · 混沌与光阴法则齐进，道心升华',
        cost: { month: 2 },
        outcome: {
          text: '毁灭并非终点，天劫亦是造化！你看着青莲幼芽在雷光中舒展绿叶，心中对九重天劫再无半分畏惧！',
          effects: { lawExp: 145, lawId: 'chaos', breakBonus: 30, attrs: { 悟性: 9, 道心: 10 }, demon: -55 },
        },
      },
      {
        label: '洒下一捧自身精纯灵力滋养青莲幼芽，令其早日绽放',
        hint: '种下大因 · 获天道莲与海量功德',
        outcome: {
          text: '幼芽瞬息抽枝结蕾，化作一朵熠熠生辉的九品天道莲轻飘入你掌心！',
          effects: { items: ['tiandao_lotus'], karma: 150, attrs: { 气运: 8 }, lifespan: 120 },
        },
      },
    ],
  },
  {
    id: 'wrh_jx_31',
    title: '九霄 · 天门罡风磨剑崖',
    region: 'jiuxiao',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 7,
    maxRealm: 9,
    text: '九霄天门两侧终年吹拂着能将寻常灵宝瞬间吹作飞灰的「先天罡风」。无数剑仙飞升前皆曾在此以罡风砺剑，崖石早已被无数道无上剑风削得如镜面般寒光凛冽。',
    choices: [
      {
        label: '逆着先天罡风挥剑万次，磨去剑招中最后一丝滞涩',
        hint: '耗两月 · 剑道与根骨大成',
        cost: { month: 2 },
        outcome: {
          text: '罡风如刀割面，你的剑却越出越快、越出越轻。第六十日最后一剑挥出，竟将百里先天罡风硬生生劈断三息！',
          effects: { lawExp: 155, lawId: 'sword', attrs: { 根骨: 9, 道心: 7 }, expPct: 0.42 },
        },
      },
      {
        label: '顺着罡风流向参悟风空相融之理',
        hint: '耗两月 · 空间法则大进',
        cost: { month: 2 },
        outcome: {
          text: '你化刚为柔与九霄罡风同频穿梭，步法瞬息万里，空间大道豁然贯通！',
          effects: { lawExp: 150, lawId: 'space', attrs: { 悟性: 8, 神识: 8 }, expPct: 0.38 },
        },
      },
    ],
  },
  {
    id: 'wrh_jx_32',
    title: '九霄 · 太古雷帝断碑铭',
    region: 'jiuxiao',
    pool: 'wild',
    tier: 6,
    weight: 3,
    minRealm: 7,
    maxRealm: 9,
    text: '黑压压的雷云深处斜插着半截万丈紫金神碑，碑面刻着上古雷帝巡狩诸天时留下的十道灭劫雷篆。每一道雷篆皆在自行吞吐紫电，引得方圆千里雷海齐齐朝拜。',
    choices: [
      {
        label: '以元神直接拓印十道雷帝古篆，参悟灭劫神雷',
        hint: '耗两月 · 雷霆法则暴涨，得天劫丹',
        cost: { month: 2 },
        outcome: {
          text: '十道雷篆轰然烙入紫府，九霄雷海竟对你露出温顺之意！碑底更震出一粒太古遗留的天劫丹！',
          effects: { items: ['tianjie_dan'], lawExp: 170, lawId: 'thunder', breakBonus: 25, attrs: { 悟性: 7 } },
        },
      },
      {
        label: '借雷帝神碑之威洗刷肉身经脉一月',
        hint: '耗一月 · 根骨与抗劫体魄大涨',
        cost: { month: 1 },
        outcome: {
          text: '紫金雷纹绕体游走三十日，你的仙躯坚逾神铁，寻常劫雷再难伤你分毫。',
          effects: { attrs: { 根骨: 10, 道心: 6 }, expPct: 0.34, lawExp: 85, lawId: 'thunder' },
        },
      },
    ],
  },
  {
    id: 'wrh_jx_33',
    title: '九霄 · 云端仙吏秘珍阁',
    region: 'jiuxiao',
    pool: 'world',
    tier: 6,
    weight: 4,
    minRealm: 7,
    maxRealm: 9,
    text: '南天门外一朵不起眼的青云后藏着一座玉亭，两名值守仙库的白袍仙吏正偷偷摆开小案，笑眯眯招呼过往大能：「上界灵石不缺，缺的是下界奇珍与高阶灵晶。道友若有厚资，咱们不妨换几样渡劫保命的仙家货色？」',
    choices: [
      {
        label: '豪掷八万灵石，换取绝世神丹「渡劫玄黄丹」',
        hint: '80000 灵石 · 稳得渡劫玄黄丹',
        require: 'stones >= 80000',
        requireHint: '灵石不足八万',
        cost: { stones: 80000 },
        outcome: {
          text: '仙吏眉开眼笑收下灵石，双手奉上一只玄黄玉盒——渡劫底牌就此稳妥！',
          effects: { items: ['dujie_shengdan'], reputation: 120 },
        },
      },
      {
        label: '出价五万灵石，换取「太乙长生果」与「太乙护道仙符」',
        hint: '50000 灵石 · 延寿护道双至宝',
        require: 'stones >= 50000',
        requireHint: '灵石不足五万',
        cost: { stones: 50000 },
        outcome: {
          text: '仙吏痛快交付长生果与护道仙符，临走还附赠你一句上界近闻。',
          effects: { items: ['changsheng_guo', 'taiyi_hudaofu'], attrs: { 神识: 4 } },
        },
      },
      {
        label: '不涉仙吏私市，拱手一笑飘然离去',
        hint: '清高自守 · 道心与业力提升',
        outcome: {
          text: '你淡淡一笑婉拒私易，心中澄明无染，反觉道心更纯一分。',
          effects: { attrs: { 道心: 6 }, karma: 50, demon: -20 },
        },
      },
    ],
  },
  {
    id: 'wrh_jx_34',
    title: '九霄 · 星辰为鉴立仙誓',
    region: 'jiuxiao',
    pool: 'world',
    tier: 6,
    weight: 4,
    minRealm: 7,
    maxRealm: 9,
    text: '九霄星海万里无云，天门金光与漫天星辉交织成一道通天彻地的浩瀚光幕。修行至此，已立于人间最高之巅，距离推开真仙之门仅余咫尺。天风浩荡，吹动衣袍猎猎作响，诸天星辰正静待你许下成仙前最后一句大道誓言。',
    choices: [
      {
        label: '「吾愿以真仙之躯，护九州长存、开万世仙路！」',
        hint: '弘毅宏愿 · 功德、声望、道心与破境成算齐升',
        outcome: {
          text: '话音未落，九霄星海同明！天地大道回应你的宏愿，降下一道璀璨紫气灌注仙躯，令你距离圆满飞升仅一步之遥！',
          effects: { karma: 260, reputation: 480, breakBonus: 35, attrs: { 道心: 14, 气运: 10 }, expPct: 0.55, demon: -80 },
        },
      },
      {
        label: '「吾唯求大道极境，纵诸天星海尽头，亦要亲眼一观！」',
        hint: '问道至诚 · 悟性、神识、全法则感悟大幅飙升',
        outcome: {
          text: '群星轰鸣震荡，似被你一往无前的求道之心折服！一道太初星辉没入识海，你的法则与修为瞬间暴涨！',
          effects: { expPct: 0.6, lawExp: 160, lawId: 'star', attrs: { 悟性: 14, 神识: 12, 根骨: 8 }, breakBonus: 30, reputation: 360 },
        },
      },
    ],
  },
];
