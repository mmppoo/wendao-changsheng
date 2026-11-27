/** 内容校验：所有 id / goto / 条件 / 物品 / 成就 / 敌人 引用必须落地。 */
import { ALL_EVENTS, STORY_TRIGGERS } from '../src/data/events/index.js';
import { ACHIEVEMENTS } from '../src/data/achievements.js';
import { ENDINGS } from '../src/data/endings.js';
import { ITEM_BY_ID } from '../src/data/items.js';
import { ENEMY_BY_ID } from '../src/data/enemies.js';
import { ROOTS } from '../src/data/roots.js';
import { SECTS } from '../src/data/sects.js';
import { parseExpression } from '../src/engine/expr.js';

const errors = [];
const warns = [];
const ids = new Set();
const achIds = new Set(ACHIEVEMENTS.map((a) => a.id));
const endingIds = new Set(ENDINGS.map((e) => e.id));

for (const ev of ALL_EVENTS) {
  if (ids.has(ev.id)) errors.push(`重复 id: ${ev.id}`);
  ids.add(ev.id);
}

const validPools = new Set(['wild', 'world', 'sect', 'inner', 'story', 'branch']);
const checkExpr = (src, where) => {
  if (!src || typeof src !== 'string') return;
  try { parseExpression(src); } catch (e) { errors.push(`${where} 条件语法错误: ${src} → ${e.message}`); }
};

function checkEffects(effects, where) {
  if (!effects) return;
  for (const id of effects.items || []) {
    const key = typeof id === 'string' ? id : id.id;
    if (!ITEM_BY_ID[key]) errors.push(`${where} 物品不存在: ${key}`);
  }
  for (const id of effects.removeItems || []) {
    const key = typeof id === 'string' ? id : id.id;
    if (!ITEM_BY_ID[key]) errors.push(`${where} 移除物品不存在: ${key}`);
  }
  for (const id of effects.achievements || []) {
    if (!achIds.has(id)) errors.push(`${where} 成就不存在: ${id}`);
  }
  if (effects.achievement && !achIds.has(effects.achievement)) {
    errors.push(`${where} 成就字段写错（应为 achievements 数组）: ${effects.achievement}`);
  }
  if (effects.counters) warns.push(`${where} effects.counters 不是有效字段（应为 counter）`);
  if (effects.sect && !SECTS.some((s) => s.id === effects.sect)) errors.push(`${where} 宗门不存在: ${effects.sect}`);
  if (effects.realmSet != null && (effects.realmSet < 0 || effects.realmSet > 9)) errors.push(`${where} 境界越界`);
  for (const t of effects.techniques || []) if (!t.id || !t.name) errors.push(`${where} 功法缺字段`);
}

function checkOutcome(outcome, where) {
  if (!outcome) return;
  checkEffects(outcome.effects, where);
  if (outcome.goto && !ids.has(outcome.goto)) errors.push(`${where} goto 目标不存在: ${outcome.goto}`);
  if (outcome.ending && !endingIds.has(outcome.ending)) errors.push(`${where} 结局不存在: ${outcome.ending}`);
  if (outcome.combat) {
    const eid = typeof outcome.combat === 'string' ? outcome.combat : outcome.combat.enemy;
    if (!ENEMY_BY_ID[eid]) errors.push(`${where} 敌人不存在: ${eid}`);
  }
}

for (const ev of ALL_EVENTS) {
  const where = `[${ev.id}]`;
  if (!ev.pool || !validPools.has(ev.pool)) errors.push(`${where} pool 非法: ${ev.pool}`);
  if (!ev.text) errors.push(`${where} 缺 text`);
  if (!Array.isArray(ev.choices) || ev.choices.length === 0) errors.push(`${where} 缺 choices`);
  if (ev.require) checkExpr(ev.require, where);
  checkEffects(ev.onEnter, where);
  for (const [i, ch] of (ev.choices || []).entries()) {
    const w = `${where} choice#${i}(${ch.label})`;
    if (!ch.label) errors.push(`${w} 缺 label`);
    if (ch.require) checkExpr(ch.require, w);
    if (ch.hideIf) checkExpr(ch.hideIf, w);
    if (ch.cost?.item && !ITEM_BY_ID[ch.cost.item]) errors.push(`${w} cost.item 不存在: ${ch.cost.item}`);
    checkEffects(ch.effects, w);
    if (ch.roll) {
      for (const key of ['success', 'fail']) checkOutcome(ch.roll[key], `${w}.roll.${key}`);
      if (ch.roll.expr) checkExpr(ch.roll.expr, w);
    }
    checkOutcome(ch.outcome, `${w}.outcome`);
    if (ch.combat) {
      const eid = typeof ch.combat === 'string' ? ch.combat : ch.combat.enemy;
      if (!ENEMY_BY_ID[eid]) errors.push(`${w} combat.enemy 不存在: ${eid}`);
      if (typeof ch.combat === 'object') {
        checkOutcome(ch.combat.win, `${w}.combat.win`);
        checkOutcome(ch.combat.lose, `${w}.combat.lose`);
      }
    }
    if (!ch.outcome && !ch.roll && !ch.combat && !ch.action) errors.push(`${w} 没有任何结果`);
  }
}

for (const a of ACHIEVEMENTS) checkExpr(a.check, `[成就 ${a.id}]`);
for (const e of ENDINGS) checkExpr(e.condition, `[结局 ${e.id}]`);
for (const t of STORY_TRIGGERS) {
  if (!ids.has(t.id)) errors.push(`剧情触发目标不存在: ${t.id}`);
  checkExpr(t.when, `[触发 ${t.id}]`);
}
for (const s of SECTS) checkExpr(s.requireExpr, `[宗门 ${s.id}]`);

const totalWeight = ROOTS.reduce((a, r) => a + r.weight, 0);
const pools = {};
for (const ev of ALL_EVENTS) pools[ev.pool] = (pools[ev.pool] || 0) + 1;

const report = {
  events: ALL_EVENTS.length,
  pools,
  achievements: ACHIEVEMENTS.length,
  hiddenAchievements: ACHIEVEMENTS.filter((a) => a.hidden).length,
  endings: ENDINGS.length,
  roots: ROOTS.length,
  sects: SECTS.length,
  rootWeight: Math.round(totalWeight * 100) / 100,
  errors,
  warnings: warns,
};

console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exitCode = 1;
