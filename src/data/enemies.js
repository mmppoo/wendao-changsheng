import { REALMS } from './realms.js';
import { NEMESIS_ENEMIES } from './events/nemesis.js';

/**
 * 敌手（v8）：共 66 名敌手，覆盖炼气至真仙全部十境；名字按 docs/WORLD_CANON.md 换成五域实有之物。
 * 元婴以上的敌手都是世人只在传说、古籍残载里听过的东西（雁门古战场、前朝旧都、流沙、赤霞旧府）。
 * 数值按 REALMS[r].powerMult 严格标定：同阶 hp ≈ 150-210*pm，atk ≈ 14-19*pm，def ≈ 5-8*pm。
 */
export const ENEMIES = [
  // ==================== 炼气境 (realm 0, powerMult 1) ====================
  {
    id: 'wolf', name: '青背狼', realm: 0, hp: 75, atk: 10, def: 2, exp: 40, stones: 18,
    trait: '猛扑', isDemon: true,
    desc: '一头成了精的老狼，眼睛是绿的。',
  },
  {
    id: 'bandit', name: '劫道散修', realm: 0, hp: 115, atk: 14, def: 4, exp: 65, stones: 46,
    trait: '快刀',
    desc: '穿着洗得发白的道袍，手里那把刀倒是很快。',
  },
  // 凡俗对手：没有修为，只靠拳脚兵刃。开局场景里用，炼气一层打得过是合理的。
  {
    id: 'mortal_guard', name: '护院武夫', realm: 0, mortal: true, hp: 70, atk: 9, def: 3, exp: 20, stones: 10,
    trait: '横练',
    desc: '练了十几年硬功的凡人，膀大腰圆，出手只认蛮力。',
  },
  {
    id: 'mortal_swordsman', name: '剑馆武人', realm: 0, mortal: true, hp: 75, atk: 10, def: 3, exp: 22, stones: 12,
    trait: '快剑',
    desc: '凡俗剑馆出身，剑招练得熟，身上却没有一丝灵气。',
  },
  {
    id: 'rogue', name: '邪修', realm: 0, hp: 145, atk: 18, def: 5, exp: 95, stones: 68,
    trait: '噬灵', isDemon: true,
    desc: '身上有股甜腥味。他看你的眼神，像在看一味药。',
  },
  {
    id: 'wild_boar', name: '赤眼山猪', realm: 0, hp: 155, atk: 14, def: 7, exp: 62, stones: 26,
    trait: '护甲', isDemon: true,
    desc: '夜里下山拱东田灵稻的老野猪，獠牙弯得像镰刀，一身皮糙得刀砍不进。',
  },
  {
    id: 'mire_toad', name: '芦荡毒蟾', realm: 0, hp: 160, atk: 15, def: 5, exp: 76, stones: 40,
    trait: '毒煞', isDemon: true,
    desc: '伏在菱湖芦荡淤泥里的毒蟾，有磨盘大，鼓腮一喷就是一片腥臭瘴气。',
  },
  {
    id: 'bone_crow', name: '鹳滩黑鸦', realm: 0, hp: 135, atk: 17, def: 4, exp: 72, stones: 34,
    trait: '快刀', isDemon: true,
    desc: '芦洲鹳滩上吃腐肉吃成了气候的黑鸦，扑下来又快又准，专啄人眉心。',
  },
  {
    id: 'herb_thief', name: '黑风寨头目', realm: 0, hp: 175, atk: 16, def: 6, exp: 92, stones: 58,
    trait: '快刀', isDemon: true,
    desc: '在旧河闸口带着十几个水寇收过路钱的头目，学过几手邪门吐纳，专挑落单的采药人和行商下手。',
  },
  {
    id: 'creek_spirit', name: '骨甲鲵', realm: 0, hp: 195, atk: 18, def: 7, exp: 118, stones: 78,
    trait: '水煞', isDemon: true,
    desc: '藏在河湾堤下暗渠里的邪祟，灰白骨甲，倒刺骨尾，一甩尾就搅得人周身灵力发滞。',
  },

  // ==================== 筑基境 (realm 1, powerMult 2.8) ====================
  {
    id: 'ghost', name: '怨魂', realm: 1, hp: 320, atk: 34, def: 8, exp: 280, stones: 95,
    trait: '噬灵', isDemon: true,
    desc: '没有脚，飘在半空。它记得自己是怎么死的。',
  },
  {
    id: 'spirit_ape', name: '涧谷老猿', realm: 1, hp: 400, atk: 42, def: 14, exp: 360, stones: 120,
    trait: '猛扑', isDemon: true,
    desc: '七十二涧深处吃了多年灵芝的老猿，双臂过膝，筋骨硬如铁，擅长近身扑杀。',
  },
  {
    id: 'beast', name: '铁甲妖猪', realm: 1, hp: 480, atk: 38, def: 22, exp: 420, stones: 140,
    trait: '护甲', isDemon: true,
    desc: '皮比铁硬，冲起来像一座山。',
  },
  {
    id: 'poison_python', name: '骨鳞蟒', realm: 1, hp: 360, atk: 46, def: 12, exp: 400, stones: 160,
    trait: '毒煞', isDemon: true,
    desc: '五丈长、水桶粗的邪祟，灰白骨鳞上带着倒钩，毒涎能蚀穿砖石，怕烟怕火。盘在铜谷废矿的积水里。',
  },
  {
    id: 'cultivator', name: '筑基修士', realm: 1, hp: 440, atk: 50, def: 18, exp: 520, stones: 245,
    trait: '剑意',
    desc: '对方的灵气比你先动，说明他的筑基比你稳。',
  },
  {
    id: 'blood_bat', name: '废矿血蝠', realm: 1, hp: 450, atk: 48, def: 15, exp: 460, stones: 185,
    trait: '血煞', isDemon: true,
    desc: '倒挂在铜谷废矿洞顶的赤蝠，翼展一丈，叫声能震裂石头，吸了血越打越凶。',
  },
  {
    id: 'stone_golem', name: '失控炉傀', realm: 1, hp: 560, atk: 43, def: 22, exp: 510, stones: 210,
    trait: '护甲',
    desc: '铜谷炉坊早年试造的石铁傀儡，灵纹走岔，没人管得住，夜里自己出了坊，见活物就砸。',
  },
  {
    id: 'blade_rogue', name: '私矿打手', realm: 1, hp: 490, atk: 53, def: 17, exp: 580, stones: 275,
    trait: '快刀', isDemon: true,
    desc: '替铜谷私矿看场子的打手，背一把宽背刀，练过邪门刀法，出手从不留活口。',
  },

  // ==================== 结丹境 (realm 2, powerMult 7.5) ====================
  {
    id: 'sea_yaksha', name: '深水老蛟', realm: 2, hp: 1050, atk: 105, def: 36, exp: 1500, stones: 380,
    trait: '水煞', isDemon: true,
    desc: '盘在深潭大江底下几百年的老蛟，鳞甲青黑，一摆尾就卷起半潭冷水。',
  },
  {
    id: 'ancient_puppet', name: '古修机关傀', realm: 2, hp: 1350, atk: 96, def: 62, exp: 1800, stones: 480,
    trait: '护甲',
    desc: '古修留下的铜木石铁傀儡，前朝遗阵、古墓、流沙下的废城里都挖出过。没了号令也不认人，拳风沉重。',
  },
  {
    id: 'blood_cult', name: '赤霞遗脉门人', realm: 2, hp: 1150, atk: 124, def: 42, exp: 1900, stones: 560,
    trait: '血煞', isDemon: true,
    desc: '他在笑。笑的时候牙齿是红的。赤霞遗脉的掠灵法门，靠吸别人的血气养自己。',
  },
  {
    id: 'jindan_elder', name: '结丹长老', realm: 2, hp: 1480, atk: 142, def: 58, exp: 2600, stones: 940,
    trait: '剑意',
    desc: '对方只是抬了抬手，你脚下的地就陷了三寸。',
  },
  {
    id: 'coral_demon', name: '浊浆水魅', realm: 2, hp: 1320, atk: 118, def: 52, exp: 1980, stones: 620,
    trait: '水煞', isDemon: true,
    desc: '上游矿浆在涧底淤了几十年，淤出这样一团阴物。它裹着浊水扑人，沾上了，灵力就凝住。',
  },
  {
    id: 'thunder_roc', name: '九峰雷雕', realm: 2, hp: 1240, atk: 136, def: 45, exp: 2200, stones: 700,
    trait: '猛扑', isDemon: true,
    desc: '在玄衡九峰绝顶筑巢的大雕，翼展三丈，雷雨天出巢，爪下撕过不少结丹修士。',
  },
  {
    id: 'corpse_general', name: '古矿阴尸', realm: 2, hp: 1540, atk: 124, def: 59, exp: 2380, stones: 780,
    trait: '毒煞', isDemon: true,
    desc: '玄衡古矿塌方时压死的人，被阴脉泡了上百年，皮肉发黑不腐，一抬手便是一片尸毒黑雾。',
  },
  {
    id: 'sword_rogue', name: '沙道刀客', realm: 2, hp: 1360, atk: 142, def: 49, exp: 2520, stones: 860,
    trait: '剑意',
    desc: '从西陲流沙一路走到东岭的刀客，替沙道势力收过井钱，一生只练一刀。',
  },

  // ==================== 元婴境 (realm 3, powerMult 20) ====================
  {
    id: 'demon_general', name: '朔川狼王', realm: 3, hp: 3200, atk: 290, def: 125, exp: 8200, stones: 1350,
    trait: '猛扑', isDemon: true,
    desc: '朔部老人说草滩上有一头活了几百年的白狼，比马还高，冬天带着狼群袭牧帐。见过它的人不多，活下来的更少。',
  },
  {
    id: 'ghost_king', name: '千魂怨主', realm: 3, hp: 3600, atk: 330, def: 110, exp: 9600, stones: 1650,
    trait: '噬灵', isDemon: true,
    desc: '死在同一处的上千个人，怨气聚成了它。雁门关外、旧河闸底，老人都说有这样的东西。它开口时，你听见了一千个人的惨叫。',
  },
  {
    id: 'abyss_leviathan', name: '千年巨鳌', realm: 3, hp: 4400, atk: 310, def: 160, exp: 11500, stones: 2200,
    trait: '护甲', isDemon: true,
    desc: '老人说它睡在深水或冻土底下已有上千年，背甲比城砖还厚。它翻一回身，岸就塌一段，关墙就裂一道。',
  },
  {
    id: 'blood_elder', name: '掠灵血修', realm: 3, hp: 3800, atk: 360, def: 135, exp: 12000, stones: 2550,
    trait: '血煞', isDemon: true,
    desc: '把掠灵邪法修到元婴的老人，周身缠着血气，杀意重得压人。传说他的法门出自赤霞遗脉。',
  },
  {
    id: 'bone_dragon', name: '冰河骨蛟', realm: 3, hp: 3920, atk: 345, def: 146, exp: 10800, stones: 2050,
    trait: '水煞', isDemon: true,
    desc: '朔川冰河底下冻着的一副蛟骨，开春冰裂时会自己游动，浪头打上岸，就是一片冰碴。',
  },
  {
    id: 'soul_reaper', name: '古战场阴兵', realm: 3, hp: 3420, atk: 365, def: 118, exp: 10400, stones: 1850,
    trait: '噬灵', isDemon: true,
    desc: '雁门外古战场上夜里列队的阴兵，铁甲锈穿，锁链一抖，就抽走人的灵力。',
  },
  {
    id: 'iron_titan', name: '攻城古傀', realm: 3, hp: 4180, atk: 325, def: 158, exp: 11400, stones: 2350,
    trait: '护甲',
    desc: '军中传说宁高祖攻克旧都时，山中异人造过攻城的铁傀。雁门外还躺着一具残骸，高十丈，胸口的阵图仍在转。',
  },
  {
    id: 'crimson_sword', name: '血衣叛将', realm: 3, hp: 3580, atk: 378, def: 132, exp: 12600, stones: 2750,
    trait: '剑意', isDemon: true,
    desc: '前朝一位雁门守将开关降敌，被斩于关下。边军说他的刀意至今未散，那件红袍还在关外走。',
  },

  // ==================== 化神境 (realm 4, powerMult 55) ====================
  {
    id: 'demon_king', name: '妖王', realm: 4, hp: 9600, atk: 860, def: 360, exp: 42000, stones: 3600,
    trait: '天威', isDemon: true,
    desc: '古籍残载的妖王，说它在宁高祖起兵之前占着河洛以西的群山。它站起来的时候，天暗了一半。',
  },
  {
    id: 'sword_phantom', name: '剑冢残意', realm: 4, hp: 8800, atk: 980, def: 320, exp: 48000, stones: 4500,
    trait: '剑意',
    desc: '前朝旧都废墟里有一座剑冢，冢中一位古剑客的执念未散。人还没到，剑气先到。',
  },
  {
    id: 'star_golem', name: '观星台古铜人', realm: 4, hp: 10600, atk: 880, def: 415, exp: 46500, stones: 4100,
    trait: '护甲',
    desc: '观星台大观星台地底镇着的前朝铜人，体表嵌满磁砂。不动时稳如山岳，动起来快得惊人。',
  },
  {
    id: 'venom_wyrm', name: '毒渊老蛟', realm: 4, hp: 9900, atk: 935, def: 350, exp: 49500, stones: 4900,
    trait: '毒煞', isDemon: true,
    desc: '盘在深渊淤泥下的老蛟，河洛古漕渠、铜谷废矿的毒渊里都有人见过。吐一口气，两岸百里草木枯死。',
  },
  {
    id: 'blood_fiend_king', name: '血祭邪主', realm: 4, hp: 9400, atk: 995, def: 335, exp: 52500, stones: 5800,
    trait: '血煞', isDemon: true,
    desc: '古籍里记过的一种邪修，借血祭撕开裂缝吸取灵气，吞人生机如喝水。',
  },
  {
    id: 'void_stalker', name: '裂缝影祟', realm: 4, hp: 8600, atk: 1015, def: 305, exp: 51000, stones: 5300,
    trait: '虚空', isDemon: true,
    desc: '从空间裂缝里爬出来的邪祟，身形忽隐忽现，寻常神通打上去多半落空。',
  },
  {
    id: 'thunder_sovereign', name: '雷槐古灵', realm: 4, hp: 10200, atk: 965, def: 380, exp: 55000, stones: 6300,
    trait: '天威',
    desc: '郑邑郊外一株被雷劈了上千年仍未死的古槐，槐心里生出了雷灵，抬手就是一道天雷。',
  },

  // ==================== 炼虚境 (realm 5, powerMult 150) ====================
  {
    id: 'void_fiend', name: '裂缝魔物', realm: 5, hp: 25500, atk: 2350, def: 920, exp: 190000, stones: 8200,
    trait: '虚空', isDemon: true,
    desc: '观星台推算的大裂缝里渗出来的东西，没有定形，在虚实之间闪烁，专吃修士的法则感悟。',
  },
  {
    id: 'heaven_envoy', name: '前朝镇陵将', realm: 5, hp: 28500, atk: 2600, def: 1100, exp: 230000, stones: 11500,
    trait: '天威',
    desc: '前朝皇陵的守陵石将，传说以帝王之气养了上千年。它看来人的眼神，和看地上的蚂蚁没有两样。',
  },
  {
    id: 'abyss_kraken', name: '河洛古鼋', realm: 5, hp: 29800, atk: 2420, def: 1080, exp: 215000, stones: 9400,
    trait: '水煞', isDemon: true,
    desc: '河洛城下古渠深处的老鼋，背壳大如晒场，翻一回身，浊浪就漫过两岸。',
  },
  {
    id: 'blade_saint_shade', name: '苍和剑客遗影', realm: 5, hp: 24800, atk: 2820, def: 940, exp: 240000, stones: 12400,
    trait: '剑意',
    desc: '苍和末年群雄割据时，一位剑客死在中州。他早没了血肉，剑光还是冷的。',
  },
  {
    id: 'nether_marshal', name: '地宫殉葬将', realm: 5, hp: 27600, atk: 2560, def: 1040, exp: 225000, stones: 10600,
    trait: '噬灵', isDemon: true,
    desc: '前朝旧都地宫里殉葬的将军，长戟一挥，四下的灵气就被抽干。',
  },
  {
    id: 'mirror_demon', name: '魔种化身', realm: 5, hp: 26400, atk: 2680, def: 960, exp: 250000, stones: 13600,
    trait: '心魔', isDemon: true,
    desc: '被魔种吃空的人，只剩一张脸。它照得出旁人心里最怕的东西。',
  },

  // ==================== 合体境 (realm 6, powerMult 420) ====================
  {
    id: 'old_monster', name: '流沙老怪', realm: 6, hp: 74000, atk: 6800, def: 2800, exp: 920000, stones: 17500,
    trait: '噬灵', isDemon: true,
    desc: '它活了太久，久到已经不记得自己是什么。驼商说它住在沙州以西的流沙底下。',
  },
  {
    id: 'chaos_beast', name: '地脉古兽', realm: 6, hp: 86000, atk: 7400, def: 3400, exp: 1150000, stones: 22500,
    trait: '护甲', isDemon: true,
    desc: '赤霞旧府灵根崩毁以后，从地脉深处醒过来的古兽，西陲沙下、北境雪原都有人撞见过。它一喘气，罗盘乱转，四下灵气倒流。',
  },
  {
    id: 'kunlun_guardian', name: '沙州古玉傀', realm: 6, hp: 82000, atk: 7100, def: 3200, exp: 1050000, stones: 20500,
    trait: '护甲',
    desc: '沙州绿洲地底一座古城的守卫，用西陲美玉雕成，周身铭文不灭，持重戟守着城门。',
  },
  {
    id: 'crimson_asura', name: '白骨井魔', realm: 6, hp: 76000, atk: 7850, def: 2650, exp: 1180000, stones: 25500,
    trait: '血煞', isDemon: true,
    desc: '十三大井争水那些年，死在井边的人白骨露于野。白骨堆里聚出了这东西，浴血不休。',
  },
  {
    id: 'star_devourer', name: '沙暴妖影', realm: 6, hp: 79000, atk: 7500, def: 2900, exp: 1120000, stones: 24000,
    trait: '虚空', isDemon: true,
    desc: '驼商说沙暴里有东西。看不见形状，刀砍进去如砍空处，人马却一队一队地没了。',
  },
  {
    id: 'frost_empress', name: '雪山寒魄', realm: 6, hp: 72000, atk: 7650, def: 2750, exp: 1200000, stones: 27500,
    trait: '水煞',
    desc: '西陲雪山顶上一缕古修残魂，在冰里冻了几千年。她一抬手，雪水便停在半空结成冰。',
  },

  // ==================== 大乘境 (realm 7, powerMult 1200) ====================
  {
    id: 'ancient_corpse', name: '赤霞古修遗蜕', realm: 7, hp: 220000, atk: 20000, def: 8800, exp: 4800000, stones: 35000,
    trait: '毒煞', isDemon: true,
    desc: '赤霞旧府灵根崩毁那日死在大殿里的古修。灵智早已灭了，残存的威压仍叫人站不住。',
  },
  {
    id: 'immortal_sword_remnant', name: '流沙剑冢镇灵', realm: 7, hp: 205000, atk: 22400, def: 7800, exp: 5200000, stones: 39000,
    trait: '剑意',
    desc: '白驼废墟有一处剑冢，上百柄断剑埋在沙下，剑气聚成了它。剑意所到，法术尽断。',
  },
  {
    id: 'void_emperor', name: '裂缝彼端之物', realm: 7, hp: 235000, atk: 21200, def: 8400, exp: 5500000, stones: 45000,
    trait: '虚空', isDemon: true,
    desc: '观星台古档只记了一句：大裂缝的另一头有东西在看。偶尔它伸过一只手来，界壁就破一个洞。',
  },
  {
    id: 'blood_ocean_lord', name: '赤霞掠灵祖', realm: 7, hp: 242000, atk: 21800, def: 8200, exp: 5600000, stones: 48000,
    trait: '血煞', isDemon: true,
    desc: '赤霞遗脉奉为祖师的古修。传说他掠尽一方灵气养出一片血海，血海不干，他就不死。',
  },
  {
    id: 'golden_dragon_king', name: '沙海金鳞蛟', realm: 7, hp: 250000, atk: 20800, def: 9400, exp: 5900000, stones: 51000,
    trait: '天威', isDemon: true,
    desc: '驼商传说沙海底下有一条金鳞大蛟，顺着地脉游走。它抬头的地方，沙丘一夜之间就挪了位。',
  },
  {
    id: 'yin_yang_elder', name: '绿洲避世古修', realm: 7, hp: 228000, atk: 21500, def: 8600, exp: 5400000, stones: 42000,
    trait: '噬灵',
    desc: '在沙州绿洲深处避世三千年的古修，袖里藏一对阴阳鱼佩，吞吐之间化去旁人的神通灵力。',
  },

  // ==================== 渡劫境 (realm 8, powerMult 3500) ====================
  {
    id: 'sky_arbiter', name: '赤霞旧府守府傀儡', realm: 8, hp: 680000, atk: 62000, def: 26000, exp: 22000000, stones: 65000,
    trait: '天威',
    desc: '赤霞旧府山门前的守府巨傀，雷铠至今未锈，仍按几千年前的旧令拦住每一个来人。',
  },
  {
    id: 'thunder_tribulation_avatar', name: '天火余烬', realm: 8, hp: 640000, atk: 64500, def: 24000, exp: 24000000, stones: 78000,
    trait: '天威',
    desc: '当年赤霞诸派引下的天火没有烧尽，在流沙底下烧了几千年，聚成人形，手里握着一道雷火。',
  },
  {
    id: 'fallen_immortal', name: '赤霞末代剑主', realm: 8, hp: 610000, atk: 66000, def: 23000, exp: 25000000, stones: 84000,
    trait: '剑意',
    desc: '灵根崩毁那日没有逃走的剑修，剑里压着几千年的不甘。',
  },
  {
    id: 'chaos_leviathan', name: '地底巨兽', realm: 8, hp: 725000, atk: 59000, def: 27500, exp: 26500000, stones: 92000,
    trait: '护甲', isDemon: true,
    desc: '驼商和牧人都说过的地底巨兽，能一口吞下整支驼队，身躯横亘数里，鳞甲硬接雷火不损。',
  },
  {
    id: 'karmic_demon_lord', name: '崩脉怨魔', realm: 8, hp: 595000, atk: 63500, def: 22500, exp: 23500000, stones: 72000,
    trait: '心魔', isDemon: true,
    desc: '灵根崩毁时，千里沃壤里死去的人和物，怨念聚成了它。它专挑人心里最隐秘的怕。',
  },

  // ==================== 真仙境 (realm 9, powerMult 10000) ====================
  {
    id: 'celestial_warden', name: '赤霞镇殿古像', realm: 9, hp: 1750000, atk: 168000, def: 68000, exp: 90000000, stones: 118000,
    trait: '天威',
    desc: '赤霞旧府主殿的镇殿铜像，诸派合铸，传说灌过地心磁砂元精。它每一击都压着整座旧府的分量。',
  },
  {
    id: 'primordial_sword_immortal', name: '赤霞开府剑痕', realm: 9, hp: 1620000, atk: 186000, def: 62000, exp: 105000000, stones: 138000,
    trait: '剑意',
    desc: '赤霞旧府开府祖师留在殿壁上的一道剑痕，几千年过去，剑意仍在。走近的人会看见一个青衫背影抬起手来。',
  },
  {
    id: 'abyssal_immortal_demon', name: '磁砂元精之灵', realm: 9, hp: 1980000, atk: 178000, def: 74000, exp: 115000000, stones: 156000,
    trait: '虚空', isDemon: true,
    desc: '赤霞诸派当年争夺的那团地心磁砂元精，灵根崩毁之后有了灵性，虚实不定，一个念头就能毁掉一片绿洲。',
  },

  // ==================== 特殊：心魔（动态同步玩家当前境界 powerMult） ====================
  {
    id: 'heart_demon', name: '心魔', realm: 3, hp: 160, atk: 16, def: 6, exp: 90, stones: 0,
    special: 'heart', trait: '心魔', isDemon: true,
    desc: '它和你长得一模一样。它知道你所有的怕。',
  },
];

// v8：宿敌线的敌手（宿敌本人带 isRival，显示其名、不随境界缩放）
ENEMIES.push(...NEMESIS_ENEMIES);
export const ENEMY_BY_ID = Object.fromEntries(ENEMIES.map((e) => [e.id, e]));

export function scaleEnemy(def, realm) {
  const playerRealm = Math.min(Math.max(0, realm || 0), REALMS.length - 1);
  if (def.special === 'heart') {
    const pm = REALMS[playerRealm]?.powerMult || 1;
    return {
      ...def,
      realm: playerRealm,
      hp: Math.round(165 * pm),
      atk: Math.round(18 * pm),
      def: Math.round(6 * pm),
      exp: Math.round(100 * pm),
      stones: 0,
    };
  }
  const diff = Math.max(0, Math.min(1, playerRealm - (def.realm || 0)));
  const mult = 1 + diff * 0.15;
  return {
    ...def,
    hp: Math.round(def.hp * mult),
    atk: Math.round(def.atk * mult),
    def: Math.round(def.def * mult),
    exp: Math.round(def.exp * mult),
    stones: Math.round(def.stones * mult),
  };
}
