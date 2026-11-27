import { REALMS } from './realms.js';

/**
 * 敌手（v4.0）：数值按境界 powerMult 指数标定。
 * 同阶战斗约 4-7 回合见分晓；高阶修士对低阶敌手形成绝对碾压。
 */
export const ENEMIES = [
  // ---- 炼气境 (realm 0, powerMult 1) ----
  {
    id: 'wolf', name: '青背狼', realm: 0, hp: 75, atk: 10, def: 2, exp: 40, stones: 12,
    trait: '猛扑',
    desc: '一头成了精的老狼，眼睛是绿的。',
  },
  {
    id: 'bandit', name: '劫道散修', realm: 0, hp: 115, atk: 14, def: 4, exp: 65, stones: 45,
    trait: '快刀',
    desc: '穿着洗得发白的道袍，手里那把刀倒是很快。',
  },
  {
    id: 'rogue', name: '邪修', realm: 0, hp: 145, atk: 18, def: 5, exp: 95, stones: 75,
    trait: '噬灵',
    desc: '身上有股甜腥味。他看你的眼神，像在看一味药。',
  },

  // ---- 筑基境 (realm 1, powerMult 2.8) ----
  {
    id: 'ghost', name: '怨魂', realm: 1, hp: 320, atk: 34, def: 8, exp: 280, stones: 90,
    trait: '噬灵',
    desc: '没有脚，飘在半空。它记得自己是怎么死的。',
  },
  {
    id: 'spirit_ape', name: '通臂灵猿', realm: 1, hp: 400, atk: 42, def: 14, exp: 360, stones: 120,
    trait: '猛扑',
    desc: '双臂过膝，筋骨如铁。啸声震落林梢残叶，擅长近身搏杀。',
  },
  {
    id: 'beast', name: '铁甲妖猪', realm: 1, hp: 480, atk: 38, def: 22, exp: 420, stones: 140,
    trait: '护甲',
    desc: '皮比铁硬，冲起来像一座山。',
  },
  {
    id: 'poison_python', name: '碧磷毒蟒', realm: 1, hp: 360, atk: 46, def: 12, exp: 400, stones: 160,
    trait: '毒煞',
    desc: '盘踞于腐沼古木间的十丈大蟒，信子吐出的碧雾能蚀穿护体灵光。',
  },
  {
    id: 'cultivator', name: '筑基修士', realm: 1, hp: 440, atk: 50, def: 18, exp: 520, stones: 280,
    trait: '剑意',
    desc: '对方的灵气比你先动，说明他的筑基比你稳。',
  },

  // ---- 金丹境 (realm 2, powerMult 7.5) ----
  {
    id: 'sea_yaksha', name: '深海夜叉', realm: 2, hp: 1050, atk: 105, def: 36, exp: 1500, stones: 650,
    trait: '水煞',
    desc: '生于归墟暗流的鳞甲海妖，三叉戟卷起滔天黑浪。',
  },
  {
    id: 'ancient_puppet', name: '古修机关傀儡', realm: 2, hp: 1350, atk: 96, def: 62, exp: 1800, stones: 850,
    trait: '护甲',
    desc: '以玄铁与灵核铸成的千年守墓傀儡，无痛无惧，拳风如雷。',
  },
  {
    id: 'blood_cult', name: '血魔宗弟子', realm: 2, hp: 1150, atk: 124, def: 42, exp: 1900, stones: 900,
    trait: '血煞',
    desc: '他在笑。笑的时候牙齿是红的。',
  },
  {
    id: 'jindan_elder', name: '金丹长老', realm: 2, hp: 1480, atk: 142, def: 58, exp: 2600, stones: 1500,
    trait: '剑意',
    desc: '对方只是抬了抬手，你脚下的地就陷了三寸。',
  },

  // ---- 元婴境 (realm 3, powerMult 20) ----
  {
    id: 'demon_general', name: '妖将', realm: 3, hp: 3200, atk: 290, def: 125, exp: 8200, stones: 3600,
    trait: '猛扑',
    desc: '半人半兽，甲胄上挂着七颗头颅。',
  },
  {
    id: 'ghost_king', name: '鬼王', realm: 3, hp: 3600, atk: 330, def: 110, exp: 9600, stones: 4400,
    trait: '噬灵',
    desc: '它开口时，你听见了一千个人的惨叫。',
  },
  {
    id: 'abyss_leviathan', name: '归墟巨鲲', realm: 3, hp: 4400, atk: 310, def: 160, exp: 11500, stones: 5200,
    trait: '护甲',
    desc: '潜伏于无尽海眼之下的太古凶兽，一吸便吞尽百里灵气。',
  },
  {
    id: 'blood_elder', name: '血海长老', realm: 3, hp: 3800, atk: 360, def: 135, exp: 12000, stones: 6000,
    trait: '血煞',
    desc: '周身环绕九道血河幡影，元婴化作猩红骷髅，杀气凝若实质。',
  },

  // ---- 化神境 (realm 4, powerMult 55) ----
  {
    id: 'demon_king', name: '妖王', realm: 4, hp: 9600, atk: 860, def: 360, exp: 42000, stones: 16000,
    trait: '天威',
    desc: '它站起来的时候，天暗了一半。',
  },
  {
    id: 'sword_phantom', name: '太古剑灵残影', realm: 4, hp: 8800, atk: 980, def: 320, exp: 48000, stones: 20000,
    trait: '剑意',
    desc: '上古剑仙遗留在剑冢中的一缕执念，人未至，剑气已割裂虚空。',
  },

  // ---- 炼虚境 (realm 5, powerMult 150) ----
  {
    id: 'void_fiend', name: '域外虚空魔', realm: 5, hp: 25500, atk: 2350, def: 920, exp: 190000, stones: 55000,
    trait: '虚空',
    desc: '从界壁裂隙渗入的无相魔物，身形在虚实之间闪烁，专食修士法则。',
  },
  {
    id: 'heaven_envoy', name: '上界巡查使', realm: 5, hp: 28500, atk: 2600, def: 1100, exp: 230000, stones: 72000,
    trait: '天威',
    desc: '身披银甲、手持天律法旨的巡界使者，俯瞰下界生灵如视蝼蚁。',
  },

  // ---- 合体境 (realm 6, powerMult 420) ----
  {
    id: 'old_monster', name: '万古老怪', realm: 6, hp: 74000, atk: 6800, def: 2800, exp: 920000, stones: 180000,
    trait: '噬灵',
    desc: '它活了太久，久到已经不记得自己是什么。',
  },
  {
    id: 'chaos_beast', name: '太古混沌兽', realm: 6, hp: 86000, atk: 7400, def: 3400, exp: 1150000, stones: 240000,
    trait: '护甲',
    desc: '自昆仑墟深渊苏醒的洪荒遗种，吐息之间五行逆乱、法则崩塌。',
  },

  // ---- 大乘境 (realm 7, powerMult 1200) ----
  {
    id: 'ancient_corpse', name: '古仙尸傀', realm: 7, hp: 220000, atk: 20000, def: 8800, exp: 4800000, stones: 650000,
    trait: '毒煞',
    desc: '陨落于上古仙战的大能遗蜕，虽灵智已灭，残存仙威仍令天地战栗。',
  },

  // ---- 渡劫境 (realm 8, powerMult 3500) ----
  {
    id: 'sky_arbiter', name: '九霄天门裁决者', realm: 8, hp: 680000, atk: 62000, def: 26000, exp: 22000000, stones: 2000000,
    trait: '天威',
    desc: '镇守南天门外的无情雷铠巨人，唯有击败它，方有资格叩响真仙之门。',
  },

  // ---- 特殊：心魔（动态同步玩家当前境界 powerMult） ----
  {
    id: 'heart_demon', name: '心魔', realm: 3, hp: 160, atk: 16, def: 6, exp: 90, stones: 0,
    special: 'heart', trait: '心魔',
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
