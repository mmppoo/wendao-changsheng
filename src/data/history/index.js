/**
 * 大历史事件总入口（v8）。
 * HISTORY_EVENTS：所有带 history 字段的大事节点，以及它们 goto 到的链上节点（pool 'history'，权重 0）。
 * HISTORY_REGION_EVENTS：青石镇、临河的日常营生（pool 'wild'，按地区随机出现，可重复）。
 * CENTURY1_WORLD_START：第一百年开局的世界指标（新一世开局时写入 state.world）。
 * CENTURY1_OUTCOMES：第一百年的 11 个结局，按 priority 判定；evaluateCentury1Outcome(state) 给出本世结局。
 */
import {
  CENTURY1_EVENTS,
  CENTURY1_REGION_EVENTS,
  CENTURY1_OUTCOMES,
  CENTURY1_WORLD_START,
  evaluateCentury1Outcome,
} from './century1.js';

export const HISTORY_EVENTS = [...CENTURY1_EVENTS];
export const HISTORY_REGION_EVENTS = [...CENTURY1_REGION_EVENTS];
export { CENTURY1_OUTCOMES, CENTURY1_WORLD_START, evaluateCentury1Outcome };

/** 新一世开局用：返回一份可写的世界指标副本。 */
export function freshCentury1World() {
  return { ...CENTURY1_WORLD_START, flags: {} };
}
