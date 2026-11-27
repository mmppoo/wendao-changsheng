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
];

export const ALL_STORY_TRIGGERS = [...STORY_TRIGGERS, ...WEBNOVEL_TRIGGERS];
export { ALL_STORY_TRIGGERS as STORY_TRIGGERS };

export const POOL_COUNTS = ALL_EVENTS.reduce((acc, ev) => {
  acc[ev.pool] = (acc[ev.pool] || 0) + 1;
  return acc;
}, {});
