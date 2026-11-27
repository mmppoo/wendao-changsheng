/** 敌手：战斗场景用。hp/atk 随境界缩放，由 encounter 侧再乘系数。 */
export const ENEMIES = [
  { id: 'wolf', name: '青背狼', realm: 0, hp: 60, atk: 8, def: 2, exp: 30, stones: 5,
    desc: '一头成了精的老狼，眼睛是绿的。' },
  { id: 'bandit', name: '劫道散修', realm: 0, hp: 90, atk: 11, def: 3, exp: 50, stones: 40,
    desc: '穿着洗得发白的道袍，手里那把刀倒是很快。' },
  { id: 'rogue', name: '邪修', realm: 0, hp: 110, atk: 13, def: 4, exp: 70, stones: 60,
    desc: '身上有股甜腥味。他看你的眼神，像在看一味药。' },
  { id: 'ghost', name: '怨魂', realm: 1, hp: 160, atk: 16, def: 2, exp: 120, stones: 20,
    desc: '没有脚，飘在半空。它记得自己是怎么死的。' },
  { id: 'beast', name: '铁甲妖猪', realm: 1, hp: 260, atk: 20, def: 12, exp: 180, stones: 30,
    desc: '皮比铁硬，冲起来像一座山。' },
  { id: 'cultivator', name: '筑基修士', realm: 1, hp: 220, atk: 24, def: 10, exp: 200, stones: 150,
    desc: '对方的灵气比你先动，说明他的筑基比你稳。' },
  { id: 'blood_cult', name: '血魔宗弟子', realm: 2, hp: 480, atk: 42, def: 18, exp: 600, stones: 400,
    desc: '他在笑。笑的时候牙齿是红的。' },
  { id: 'jindan_elder', name: '金丹长老', realm: 2, hp: 620, atk: 50, def: 24, exp: 800, stones: 800,
    desc: '对方只是抬了抬手，你脚下的地就陷了三寸。' },
  { id: 'demon_general', name: '妖将', realm: 3, hp: 1600, atk: 90, def: 40, exp: 2000, stones: 1500,
    desc: '半人半兽，甲胄上挂着七颗头颅。' },
  { id: 'ghost_king', name: '鬼王', realm: 3, hp: 2000, atk: 110, def: 35, exp: 2600, stones: 2000,
    desc: '它开口时，你听见了一千个人的惨叫。' },
  { id: 'demon_king', name: '妖王', realm: 4, hp: 6000, atk: 220, def: 90, exp: 8000, stones: 6000,
    desc: '它站起来的时候，天暗了一半。' },
  { id: 'old_monster', name: '万古老怪', realm: 6, hp: 30000, atk: 600, def: 300, exp: 40000, stones: 30000,
    desc: '它活了太久，久到已经不记得自己是什么。' },
  { id: 'heart_demon', name: '心魔', realm: 3, hp: 1, atk: 0, def: 0, exp: 0, stones: 0, special: 'heart',
    desc: '它和你长得一模一样。它知道你所有的怕。' },
];

export const ENEMY_BY_ID = Object.fromEntries(ENEMIES.map((e) => [e.id, e]));

export function scaleEnemy(def, realm) {
  const diff = Math.max(0, realm - (def.realm || 0));
  const mult = Math.pow(2.1, diff * 0.6);
  return {
    ...def,
    hp: Math.round(def.hp * mult),
    atk: Math.round(def.atk * mult),
    def: Math.round(def.def * mult),
    exp: Math.round(def.exp * mult),
    stones: Math.round(def.stones * mult),
  };
}
