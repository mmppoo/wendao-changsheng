import { WILD_EVENTS } from './wild.js';
import { WORLD_EVENTS } from './world.js';
import { SECT_EVENTS } from './sect.js';
import { INNER_EVENTS } from './inner.js';
import { STORY_EVENTS, STORY_TRIGGERS } from './story.js';
import { WILD_EXPANSION } from './expansion_wild.js';
import { SECT_EXPANSION } from './expansion_sect.js';
import { HIGH_EXPANSION } from './expansion_high.js';
import { ENDGAME_EXPANSION } from './expansion_endgame.js';
import { INK_EXPANSION } from './expansion_ink.js';
import { WEBNOVEL_EXPANSION, WEBNOVEL_TRIGGERS } from './expansion_webnovel.js';
import { REGION_EXPANSION } from './expansion_regions.js';
import { SECT_DEEP_EXPANSION } from './expansion_sects_deep.js';
import { WORLD_REGIONS_LOW } from './world_regions_low.js';
import { WORLD_REGIONS_HIGH } from './world_regions_high.js';
import { WORLD_SECTS_ALL } from './world_sects_all.js';
import { WORLD_KARMA_NPCS } from './world_karma_npcs.js';
import { NEMESIS_EVENTS, NEMESIS_TRIGGERS } from './nemesis.js';
import { ORIGIN_OPENINGS } from './origin_openings.js';
import { ORIGIN_COMEBACK_EVENTS, ORIGIN_COMEBACK_TRIGGERS } from './origin_comebacks.js';
import { ERA1_EVENTS_A } from '../history/era1_b002_b025.js';
import { ERA1_EVENTS_B } from '../history/era1_b026_b050.js';
import { ERA1_EVENTS_C } from '../history/era1_b051_b075.js';
import { ERA1_EVENTS_D } from '../history/era1_b076_b100.js';
import { HISTORY_EVENTS, HISTORY_REGION_EVENTS } from '../history/index.js';

export const ALL_EVENTS = [
  ...WILD_EVENTS,
  ...WORLD_EVENTS,
  ...SECT_EVENTS,
  ...INNER_EVENTS,
  ...STORY_EVENTS,
  ...WILD_EXPANSION,
  ...SECT_EXPANSION,
  ...HIGH_EXPANSION,
  ...ENDGAME_EXPANSION,
  ...INK_EXPANSION,
  ...WEBNOVEL_EXPANSION,
  ...REGION_EXPANSION,
  ...SECT_DEEP_EXPANSION,
  ...WORLD_REGIONS_LOW,
  ...WORLD_REGIONS_HIGH,
  ...WORLD_SECTS_ALL,
  ...WORLD_KARMA_NPCS,
  ...NEMESIS_EVENTS,
  ...ORIGIN_OPENINGS,
  ...ORIGIN_COMEBACK_EVENTS,
  ...ERA1_EVENTS_A,
  ...ERA1_EVENTS_B,
  ...ERA1_EVENTS_C,
  ...ERA1_EVENTS_D,
  ...HISTORY_EVENTS,
  ...HISTORY_REGION_EVENTS,
];

/**
 * v8：世界换成宁朝五域。带旧九州专名的事件一律撤出随机池与主线触发（代码保留，
 * 日后按新世界改写后再放回）。判定口径：事件全文含下列任一旧专名。
 */
export const LEGACY_TERMS = ['九州', '青牛', '落霞', '妖森', '归墟', '北荒', '昆仑', '九霄', '天门', '飞升', '太玄', '青云', '丹霞', '天音', '万象', '寒山', '万宝', '万兽', '机关城', '血魔', '合欢', '幽冥', '苏晚晴', '陆沉舟', '药尘子', '顾青衣', '血煞', '林昊', '云霓', '玄机老人', '墨衡', '白幽', '青莲', '司命', '东海', '中州圣域', '魔域', '仙城', '大梁', '仙界', '上界', '仙帝'];
/**
 * 境界上限补丁：凡人世界里能伤到你、或者把你当打零工后生的事件，境界高了还撞上就说不通
 * （化神被护院砸晕、元婴被差役架出县衙）。这里统一补上 maxRealm，不改各文件原文。
 */
const REALM_CAPS = {
  // 只在炼气期：凡人、野兽、地痞就能伤到你或拿捏你
  ev_road_bandit: 0, ev_x_chicken: 0, ev_x_wolf_pack: 0, ev_x_slave_market: 0, ev_x_prisoner_escort: 0,
  ev_x_magistrate: 0, ev_x_conscription: 0, ev_x_dice_house: 0, ev_x_escort_job: 0, ev_x_arena: 0,
  ev_x_river_pirates: 0, ev_x_herb_slope: 0, ev_herb_garden: 0,
  // 青石镇一带的短工与镇上琐事：扛包、拉风箱、押车、巡堤
  c1_r_ferry_help: 0, c1_r_east_ditch: 0, c1_r_qian_san_price: 0, c1_r_xu_niang_herbs: 0, c1_r_shen_yan_workshop: 0,
  c1_r_zhao_shou_levy: 0, c1_r_old_kiln: 0, c1_r_lu_qing_cargo: 0, c1_r_refugee_shed: 0, c1_r_after_flood: 0,
  c1_r_grain_dock: 0, c1_r_south_polder: 0, c1_r_heifeng_toll: 0, c1_r_linhe_market: 0, c1_r_garrison_pay: 0,
  c1_r_dike_patrol: 0,
  // 到筑基为止：蛇窟、同门欺生
  ev_x_snake_den: 1, ev_sect_bully: 1,
  // 到结丹为止：外门差事、杂役、守炉试药之类
  ev_sect_mission: 2, ev_sect_library: 2, ev_sect_pill_room: 2,
  ev_s_taixuan_borrow_sword: 2, ev_s_danxia_watch_fire: 2, ev_s_danxia_taste_drug: 2, ev_s_danxia_herb_garden: 2,
  ev_s_tianyin_sutra: 2, ev_s_wanxiang_frozen_ink: 2, ev_s_hanshan_snow_house: 2, ev_s_wanbao_ledger: 2,
  ev_s_wanshou_cub: 2, ev_s_wanshou_three_months: 2, ev_s_youming_ferry: 2, ev_s_youming_grave: 2,
  ev_s_monthly_wage: 2, ev_s_chore_board: 2, ev_s_law_hall: 2, wsa_ws_01: 2, wsa_ym_01: 2, wsa_sx_02: 2,
  wsa_sx_07: 3,
};
for (const ev of ALL_EVENTS) {
  const cap = REALM_CAPS[ev.id];
  if (cap != null && (ev.maxRealm == null || ev.maxRealm > cap)) ev.maxRealm = cap;
}

export const LEGACY_EVENT_IDS = new Set(ALL_EVENTS.filter((ev) => {
  const txt = JSON.stringify(ev, (k, v) => (typeof v === 'function' ? v.toString() : v));
  return LEGACY_TERMS.some((t) => txt.includes(t));
}).map((ev) => ev.id));

export const ALL_STORY_TRIGGERS = [...STORY_TRIGGERS, ...WEBNOVEL_TRIGGERS, ...NEMESIS_TRIGGERS, ...ORIGIN_COMEBACK_TRIGGERS].filter((t) => !LEGACY_EVENT_IDS.has(t.id));
export { ALL_STORY_TRIGGERS as STORY_TRIGGERS };

export const POOL_COUNTS = ALL_EVENTS.reduce((acc, ev) => {
  acc[ev.pool] = (acc[ev.pool] || 0) + 1;
  return acc;
}, {});
