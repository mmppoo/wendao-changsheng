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
export const LEGACY_TERMS = ['九州', '青牛', '落霞', '妖森', '归墟', '北荒', '昆仑', '九霄', '天门', '飞升', '太玄', '青云', '丹霞', '天音', '万象', '寒山', '万宝', '万兽', '机关城', '血魔', '合欢', '幽冥', '苏晚晴', '陆沉舟', '药尘子', '顾青衣', '血煞', '林昊', '云霓', '玄机老人', '墨衡', '白幽', '青莲', '司命', '掌天', '绿瓶', '残剑', '剑老', '道碑', '东海', '中州圣域', '魔域', '仙城', '大梁', '仙界', '上界', '仙帝'];
export const LEGACY_EVENT_IDS = new Set(ALL_EVENTS.filter((ev) => {
  const txt = JSON.stringify(ev, (k, v) => (typeof v === 'function' ? v.toString() : v));
  return LEGACY_TERMS.some((t) => txt.includes(t));
}).map((ev) => ev.id));

export const ALL_STORY_TRIGGERS = [...STORY_TRIGGERS, ...WEBNOVEL_TRIGGERS, ...NEMESIS_TRIGGERS].filter((t) => !LEGACY_EVENT_IDS.has(t.id));
export { ALL_STORY_TRIGGERS as STORY_TRIGGERS };

export const POOL_COUNTS = ALL_EVENTS.reduce((acc, ev) => {
  acc[ev.pool] = (acc[ev.pool] || 0) + 1;
  return acc;
}, {});
