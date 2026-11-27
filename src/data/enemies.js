import { REALMS } from './realms.js';

/**
 * 敌手（v5.0）：共 66 名敌手（完整保留原有 25 名 ID），覆盖炼气至真仙全部十境。
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
  {
    id: 'rogue', name: '邪修', realm: 0, hp: 145, atk: 18, def: 5, exp: 95, stones: 68,
    trait: '噬灵', isDemon: true,
    desc: '身上有股甜腥味。他看你的眼神，像在看一味药。',
  },
  {
    id: 'wild_boar', name: '赤眼山猪', realm: 0, hp: 155, atk: 14, def: 7, exp: 62, stones: 26,
    trait: '护甲', isDemon: true,
    desc: '常年拱食青牛山灵根的巨彘，獠牙如弯刀，皮糙堪比熟铁。',
  },
  {
    id: 'mire_toad', name: '腐沼毒蟾', realm: 0, hp: 160, atk: 15, def: 5, exp: 76, stones: 40,
    trait: '毒煞', isDemon: true,
    desc: '潜伏于山谷腐泽的磨盘大蟾，鼓腮一喷便是漫天腥臭瘴气。',
  },
  {
    id: 'bone_crow', name: '阴山骨鸦', realm: 0, hp: 135, atk: 17, def: 4, exp: 72, stones: 34,
    trait: '快刀', isDemon: true,
    desc: '羽毛漆黑如铁的食腐妖禽，扑击迅若利箭，专啄修士眉心。',
  },
  {
    id: 'herb_thief', name: '采药黑修', realm: 0, hp: 175, atk: 16, def: 6, exp: 92, stones: 58,
    trait: '快刀', isDemon: true,
    desc: '游荡于落霞城外十里的蒙面散修，专门尾随采药新人杀人越货。',
  },
  {
    id: 'creek_spirit', name: '溪涧水煞', realm: 0, hp: 195, atk: 18, def: 7, exp: 118, stones: 78,
    trait: '水煞', isDemon: true,
    desc: '溺亡修士执念与阴寒泉眼合化的水鬼，所过之处灵力凝滞。',
  },

  // ==================== 筑基境 (realm 1, powerMult 2.8) ====================
  {
    id: 'ghost', name: '怨魂', realm: 1, hp: 320, atk: 34, def: 8, exp: 280, stones: 95,
    trait: '噬灵', isDemon: true,
    desc: '没有脚，飘在半空。它记得自己是怎么死的。',
  },
  {
    id: 'spirit_ape', name: '通臂灵猿', realm: 1, hp: 400, atk: 42, def: 14, exp: 360, stones: 120,
    trait: '猛扑', isDemon: true,
    desc: '双臂过膝，筋骨如铁。啸声震落林梢残叶，擅长近身搏杀。',
  },
  {
    id: 'beast', name: '铁甲妖猪', realm: 1, hp: 480, atk: 38, def: 22, exp: 420, stones: 140,
    trait: '护甲', isDemon: true,
    desc: '皮比铁硬，冲起来像一座山。',
  },
  {
    id: 'poison_python', name: '碧磷毒蟒', realm: 1, hp: 360, atk: 46, def: 12, exp: 400, stones: 160,
    trait: '毒煞', isDemon: true,
    desc: '盘踞于腐沼古木间的十丈大蟒，信子吐出的碧雾能蚀穿护体灵光。',
  },
  {
    id: 'cultivator', name: '筑基修士', realm: 1, hp: 440, atk: 50, def: 18, exp: 520, stones: 245,
    trait: '剑意',
    desc: '对方的灵气比你先动，说明他的筑基比你稳。',
  },
  {
    id: 'blood_bat', name: '嗜血蝠妖', realm: 1, hp: 450, atk: 48, def: 15, exp: 460, stones: 185,
    trait: '血煞', isDemon: true,
    desc: '倒悬于妖森溶洞顶端的丈翼赤蝠，声波裂石，吸人精血愈战愈勇。',
  },
  {
    id: 'stone_golem', name: '古林石傀', realm: 1, hp: 560, atk: 43, def: 22, exp: 510, stones: 210,
    trait: '护甲',
    desc: '古修洞府外残存的青石守卫，灵纹虽黯，双拳仍具开碑裂石之威。',
  },
  {
    id: 'blade_rogue', name: '断魂刀客', realm: 1, hp: 490, atk: 53, def: 17, exp: 580, stones: 275,
    trait: '快刀', isDemon: true,
    desc: '背负宽背鬼头刀的筑基恶徒，出刀狠辣决绝，从不留活口。',
  },

  // ==================== 金丹境 (realm 2, powerMult 7.5) ====================
  {
    id: 'sea_yaksha', name: '深海夜叉', realm: 2, hp: 1050, atk: 105, def: 36, exp: 1500, stones: 380,
    trait: '水煞', isDemon: true,
    desc: '生于归墟暗流的鳞甲海妖，三叉戟卷起滔天黑浪。',
  },
  {
    id: 'ancient_puppet', name: '古修机关傀儡', realm: 2, hp: 1350, atk: 96, def: 62, exp: 1800, stones: 480,
    trait: '护甲',
    desc: '以玄铁与灵核铸成的千年守墓傀儡，无痛无惧，拳风如雷。',
  },
  {
    id: 'blood_cult', name: '血魔宗弟子', realm: 2, hp: 1150, atk: 124, def: 42, exp: 1900, stones: 560,
    trait: '血煞', isDemon: true,
    desc: '他在笑。笑的时候牙齿是红的。',
  },
  {
    id: 'jindan_elder', name: '金丹长老', realm: 2, hp: 1480, atk: 142, def: 58, exp: 2600, stones: 940,
    trait: '剑意',
    desc: '对方只是抬了抬手，你脚下的地就陷了三寸。',
  },
  {
    id: 'coral_demon', name: '珊瑚妖将', realm: 2, hp: 1320, atk: 118, def: 52, exp: 1980, stones: 620,
    trait: '水煞', isDemon: true,
    desc: '身披血红珊瑚重甲的东海海族统领，挥戟可唤百丈寒潮压境。',
  },
  {
    id: 'thunder_roc', name: '裂云雷鹏', realm: 2, hp: 1240, atk: 136, def: 45, exp: 2200, stones: 700,
    trait: '猛扑', isDemon: true,
    desc: '翼展十丈的紫羽大禽，掠空时电弧炸响，爪下不知撕碎多少金丹修士。',
  },
  {
    id: 'corpse_general', name: '阴煞尸将', realm: 2, hp: 1540, atk: 124, def: 59, exp: 2380, stones: 780,
    trait: '毒煞', isDemon: true,
    desc: '古战场阴脉养出的金甲旱魃，举手黑雾弥漫，尸毒侵骨难解。',
  },
  {
    id: 'sword_rogue', name: '孤鸿剑修', realm: 2, hp: 1360, atk: 142, def: 49, exp: 2520, stones: 860,
    trait: '剑意',
    desc: '无门无派的斗笠金丹剑客，一生只修一剑，剑出如孤鸿剪水。',
  },

  // ==================== 元婴境 (realm 3, powerMult 20) ====================
  {
    id: 'demon_general', name: '妖将', realm: 3, hp: 3200, atk: 290, def: 125, exp: 8200, stones: 1350,
    trait: '猛扑', isDemon: true,
    desc: '半人半兽，甲胄上挂着七颗头颅。',
  },
  {
    id: 'ghost_king', name: '鬼王', realm: 3, hp: 3600, atk: 330, def: 110, exp: 9600, stones: 1650,
    trait: '噬灵', isDemon: true,
    desc: '它开口时，你听见了一千个人的惨叫。',
  },
  {
    id: 'abyss_leviathan', name: '归墟巨鲲', realm: 3, hp: 4400, atk: 310, def: 160, exp: 11500, stones: 2200,
    trait: '护甲', isDemon: true,
    desc: '潜伏于无尽海眼之下的太古凶兽，一吸便吞尽百里灵气。',
  },
  {
    id: 'blood_elder', name: '血海长老', realm: 3, hp: 3800, atk: 360, def: 135, exp: 12000, stones: 2550,
    trait: '血煞', isDemon: true,
    desc: '周身环绕九道血河幡影，元婴化作猩红骷髅，杀气凝若实质。',
  },
  {
    id: 'bone_dragon', name: '冥海骨蛟', realm: 3, hp: 3920, atk: 345, def: 146, exp: 10800, stones: 2050,
    trait: '水煞', isDemon: true,
    desc: '陨落蛟龙骸骨浸润归墟黑水千年复生，龙吟所至浪涌如山。',
  },
  {
    id: 'soul_reaper', name: '九幽勾魂使', realm: 3, hp: 3420, atk: 365, def: 118, exp: 10400, stones: 1850,
    trait: '噬灵', isDemon: true,
    desc: '玄袍锁链的九幽阴司战将，锁魂链一抖便直摄修士神魂灵力。',
  },
  {
    id: 'iron_titan', name: '机关巨神傀', realm: 3, hp: 4180, atk: 325, def: 158, exp: 11400, stones: 2350,
    trait: '护甲',
    desc: '高达十丈的玄铁灵核战傀，胸膛阵图流转，堪称元婴境移动堡垒。',
  },
  {
    id: 'crimson_sword', name: '血衣剑尊', realm: 3, hp: 3580, atk: 378, def: 132, exp: 12600, stones: 2750,
    trait: '剑意', isDemon: true,
    desc: '堕入魔道的前代剑宗弃徒，赤袍猎猎，每一剑皆斩向道心破绽。',
  },

  // ==================== 化神境 (realm 4, powerMult 55) ====================
  {
    id: 'demon_king', name: '妖王', realm: 4, hp: 9600, atk: 860, def: 360, exp: 42000, stones: 3600,
    trait: '天威', isDemon: true,
    desc: '它站起来的时候，天暗了一半。',
  },
  {
    id: 'sword_phantom', name: '太古剑灵残影', realm: 4, hp: 8800, atk: 980, def: 320, exp: 48000, stones: 4500,
    trait: '剑意',
    desc: '上古剑仙遗留在剑冢中的一缕执念，人未至，剑气已割裂虚空。',
  },
  {
    id: 'star_golem', name: '观星古守卫', realm: 4, hp: 10600, atk: 880, def: 415, exp: 46500, stones: 4100,
    trait: '护甲',
    desc: '上古星宫遗留的青铜巨人，体表镶嵌星辰砂，不动如岳、动若奔雷。',
  },
  {
    id: 'venom_wyrm', name: '万毒黑龙', realm: 4, hp: 9900, atk: 935, def: 350, exp: 49500, stones: 4900,
    trait: '毒煞', isDemon: true,
    desc: '盘踞北荒毒渊的化神孽龙，龙息过处百里草木化作枯骨。',
  },
  {
    id: 'blood_fiend_king', name: '血渊魔主', realm: 4, hp: 9400, atk: 995, def: 335, exp: 52500, stones: 5800,
    trait: '血煞', isDemon: true,
    desc: '统御北荒一方魔渊的化神巨擘，周身血浪翻涌，吞噬生机如饮甘露。',
  },
  {
    id: 'void_stalker', name: '裂界暗影', realm: 4, hp: 8600, atk: 1015, def: 305, exp: 51000, stones: 5300,
    trait: '虚空', isDemon: true,
    desc: '藏身空间夹缝的诡谲影魔，身形飘忽不定，寻常神通每每落空。',
  },
  {
    id: 'thunder_sovereign', name: '紫霄雷灵', realm: 4, hp: 10200, atk: 965, def: 380, exp: 55000, stones: 6300,
    trait: '天威',
    desc: '万年雷池孕育而成的先天雷灵，举手引动天罚雷威，慑人心魄。',
  },

  // ==================== 炼虚境 (realm 5, powerMult 150) ====================
  {
    id: 'void_fiend', name: '域外虚空魔', realm: 5, hp: 25500, atk: 2350, def: 920, exp: 190000, stones: 8200,
    trait: '虚空', isDemon: true,
    desc: '从界壁裂隙渗入的无相魔物，身形在虚实之间闪烁，专食修士法则。',
  },
  {
    id: 'heaven_envoy', name: '上界巡查使', realm: 5, hp: 28500, atk: 2600, def: 1100, exp: 230000, stones: 11500,
    trait: '天威',
    desc: '身披银甲、手持天律法旨的巡界使者，俯瞰下界生灵如视蝼蚁。',
  },
  {
    id: 'abyss_kraken', name: '太虚魔章', realm: 5, hp: 29800, atk: 2420, def: 1080, exp: 215000, stones: 9400,
    trait: '水煞', isDemon: true,
    desc: '沉眠于归墟最底层的太古魔蛸，八条触腕遮天蔽海，卷动无尽寒潮。',
  },
  {
    id: 'blade_saint_shade', name: '陨落剑圣影', realm: 5, hp: 24800, atk: 2820, def: 940, exp: 240000, stones: 12400,
    trait: '剑意',
    desc: '万年前陨落中州的绝世剑圣残影，虽无血肉，剑光依旧锋寒彻骨。',
  },
  {
    id: 'nether_marshal', name: '黄泉镇狱帅', realm: 5, hp: 27600, atk: 2560, def: 1040, exp: 225000, stones: 10600,
    trait: '噬灵', isDemon: true,
    desc: '九幽冥府坐镇一方的炼虚大帅，战戟挥落便引黄泉倒灌、灵元枯竭。',
  },
  {
    id: 'mirror_demon', name: '幻界心魔尊', realm: 5, hp: 26400, atk: 2680, def: 960, exp: 250000, stones: 13600,
    trait: '心魔', isDemon: true,
    desc: '以万千修士道心裂隙为食的无形魔尊，专能映出世人最深沉的执念。',
  },

  // ==================== 合体境 (realm 6, powerMult 420) ====================
  {
    id: 'old_monster', name: '万古老怪', realm: 6, hp: 74000, atk: 6800, def: 2800, exp: 920000, stones: 17500,
    trait: '噬灵', isDemon: true,
    desc: '它活了太久，久到已经不记得自己是什么。',
  },
  {
    id: 'chaos_beast', name: '太古混沌兽', realm: 6, hp: 86000, atk: 7400, def: 3400, exp: 1150000, stones: 22500,
    trait: '护甲', isDemon: true,
    desc: '自昆仑墟深渊苏醒的洪荒遗种，吐息之间五行逆乱、法则崩塌。',
  },
  {
    id: 'kunlun_guardian', name: '昆仑古玉神将', realm: 6, hp: 82000, atk: 7100, def: 3200, exp: 1050000, stones: 20500,
    trait: '护甲',
    desc: '守护昆仑玉虚遗殿的合体神将，浑身古玉铭文不灭，重戟镇山河。',
  },
  {
    id: 'crimson_asura', name: '修罗古战魔', realm: 6, hp: 76000, atk: 7850, def: 2650, exp: 1180000, stones: 25500,
    trait: '血煞', isDemon: true,
    desc: '三头六臂的太古修罗魔将，浴血狂战不休，每一击皆带血海倾覆之势。',
  },
  {
    id: 'star_devourer', name: '噬星天妖', realm: 6, hp: 79000, atk: 7500, def: 2900, exp: 1120000, stones: 24000,
    trait: '虚空', isDemon: true,
    desc: '横渡界海而来的吞星异兽，周身星涡旋转，能令攻击陷入无尽虚空。',
  },
  {
    id: 'frost_empress', name: '玄冥寒帝残魂', realm: 6, hp: 72000, atk: 7650, def: 2750, exp: 1200000, stones: 27500,
    trait: '水煞',
    desc: '冰封于昆仑雪崖的太古女帝神魂，素手轻拂便冻结万里灵气长河。',
  },

  // ==================== 大乘境 (realm 7, powerMult 1200) ====================
  {
    id: 'ancient_corpse', name: '古仙尸傀', realm: 7, hp: 220000, atk: 20000, def: 8800, exp: 4800000, stones: 35000,
    trait: '毒煞', isDemon: true,
    desc: '陨落于上古仙战的大能遗蜕，虽灵智已灭，残存仙威仍令天地战栗。',
  },
  {
    id: 'immortal_sword_remnant', name: '仙剑冢镇灵', realm: 7, hp: 205000, atk: 22400, def: 7800, exp: 5200000, stones: 39000,
    trait: '剑意',
    desc: '由昆仑百柄断仙剑合凝而成的无上剑灵，剑意纵横处万法皆断。',
  },
  {
    id: 'void_emperor', name: '虚空魔帝', realm: 7, hp: 235000, atk: 21200, def: 8400, exp: 5500000, stones: 45000,
    trait: '虚空', isDemon: true,
    desc: '端坐域外暗渊的大乘魔帝投影，抬手撕裂界壁，视下界苍生如草芥。',
  },
  {
    id: 'blood_ocean_lord', name: '血海古祖', realm: 7, hp: 242000, atk: 21800, def: 8200, exp: 5600000, stones: 48000,
    trait: '血煞', isDemon: true,
    desc: '太古血海孕育的滔天魔祖，挥袖红潮蔽日，血河不干则魔躯难灭。',
  },
  {
    id: 'golden_dragon_king', name: '太古金龙王', realm: 7, hp: 250000, atk: 20800, def: 9400, exp: 5900000, stones: 51000,
    trait: '天威', isDemon: true,
    desc: '盘踞昆仑龙脉极巅的五爪金龙，龙威浩荡如天宪，俯瞰天下妖族。',
  },
  {
    id: 'yin_yang_elder', name: '阴阳混元古尊', realm: 7, hp: 228000, atk: 21500, def: 8600, exp: 5400000, stones: 42000,
    trait: '噬灵',
    desc: '避世三万载的大乘老尊，袖藏太极双鱼，吞吐之间化去诸般神通灵力。',
  },

  // ==================== 渡劫境 (realm 8, powerMult 3500) ====================
  {
    id: 'sky_arbiter', name: '九霄天门裁决者', realm: 8, hp: 680000, atk: 62000, def: 26000, exp: 22000000, stones: 65000,
    trait: '天威',
    desc: '镇守南天门外的无情雷铠巨人，唯有击败它，方有资格叩响真仙之门。',
  },
  {
    id: 'thunder_tribulation_avatar', name: '紫霄天劫法身', realm: 8, hp: 640000, atk: 64500, def: 24000, exp: 24000000, stones: 78000,
    trait: '天威',
    desc: '九重天劫雷海显化的人形法身，手握紫霄雷戟，代天考验渡劫者道骨。',
  },
  {
    id: 'fallen_immortal', name: '坠世散仙', realm: 8, hp: 610000, atk: 66000, def: 23000, exp: 25000000, stones: 84000,
    trait: '剑意',
    desc: '飞升失败而转修九劫散仙的绝世剑修，剑中蕴含滔天不甘与寂灭仙意。',
  },
  {
    id: 'chaos_leviathan', name: '混沌吞界鲲', realm: 8, hp: 725000, atk: 59000, def: 27500, exp: 26500000, stones: 92000,
    trait: '护甲', isDemon: true,
    desc: '遨游于九霄星海边缘的太初巨兽，身躯横亘千里，鳞甲硬撼仙雷无损。',
  },
  {
    id: 'karmic_demon_lord', name: '万劫心魔皇', realm: 8, hp: 595000, atk: 63500, def: 22500, exp: 23500000, stones: 72000,
    trait: '心魔', isDemon: true,
    desc: '凝聚古今所有渡劫败亡者怨念的魔皇，直击道心最隐秘的畏惧。',
  },

  // ==================== 真仙境 (realm 9, powerMult 10000) ====================
  {
    id: 'celestial_warden', name: '南天门仙将', realm: 9, hp: 1750000, atk: 168000, def: 68000, exp: 90000000, stones: 118000,
    trait: '天威',
    desc: '身披九霄金鳞仙甲的天庭守将，手持镇界长戈，每一击皆带仙律镇压。',
  },
  {
    id: 'primordial_sword_immortal', name: '太古剑仙意念', realm: 9, hp: 1620000, atk: 186000, def: 62000, exp: 105000000, stones: 138000,
    trait: '剑意',
    desc: '留名青史的太古剑仙映照九霄的一缕道身，青衫一挥，星河为之断流。',
  },
  {
    id: 'abyssal_immortal_demon', name: '域外魔仙', realm: 9, hp: 1980000, atk: 178000, def: 74000, exp: 115000000, stones: 156000,
    trait: '虚空', isDemon: true,
    desc: '自上界堕入界海深渊的真仙级魔主，虚实莫测，举念可覆灭一方下界。',
  },

  // ==================== 特殊：心魔（动态同步玩家当前境界 powerMult） ====================
  {
    id: 'heart_demon', name: '心魔', realm: 3, hp: 160, atk: 16, def: 6, exp: 90, stones: 0,
    special: 'heart', trait: '心魔', isDemon: true,
    desc: '它和你长得一模一样。它知道你所有的怕。',
  },
];

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
