/**
 * 百小时量尺：连续多世轮回模拟，估算真人游玩时长与内容新鲜度。
 * 运行：node tests/playtime.mjs [最多世数=40] [种子=1]
 *
 * 时长估算（真人口径，偏保守）：
 *   - 剧情/奇遇节点做选择：读正文（约 10 字/秒）+ 4 秒思考
 *   - 结算页「继续」：扫读（约 14 字/秒），至少 1.5 秒
 *   - 界面菜单点选：2.5 秒；斗法每回合：3 秒
 * 饱和判定：连续 3 世没有新结局、新成就、新奇遇，视为「玩腻」。
 */
import { Game } from '../src/engine/game.js';
import { ORIGINS } from '../src/data/origins.js';
import { GOLDEN_FINGERS } from '../src/data/golden_fingers.js';
import { ROOTS } from '../src/data/roots.js';
import { TALENTS } from '../src/data/talents.js';
import { ENDINGS } from '../src/data/endings.js';
import { ACHIEVEMENTS } from '../src/data/achievements.js';
import { policy } from './bot.mjs';
import { RNG } from '../src/engine/rng.js';
import * as meta from '../src/engine/meta.js';

const MAX_LIVES = Number(process.argv[2] || 40);
const SEED = Number(process.argv[3] || 1);

const UI_SCENES = new Set(['hub', 'cave', 'regionHub', 'regionMap', 'sectHall', 'sectMissions', 'sectLibrary', 'sectTreasury', 'sectPromote', 'cityHub', 'tianji', 'npcHub', 'npcDetail', 'market', 'auction', 'sell', 'recruit', 'combat', 'tribulation', 'breakthrough', 'delve', 'techEquip', 'alchemy', 'techShop', 'arena', 'playerSect']);

function stepSeconds(g, sceneId, hadResult) {
  const text = g.currentText() || '';
  if (hadResult) return Math.max(1.5, text.length / 14);
  if (sceneId === 'combat') return 3;
  if (UI_SCENES.has(sceneId)) return 2.5;
  return text.length / 10 + 4;
}

const rng = new RNG(SEED);
const seenEvents = new Set();
let metaState = {};
let totalSec = 0;
let stale = 0;
const lives = [];
let firstTechHours = null;
let firstReincarnationHours = null;
let cappedLives = 0;
let gapOver15Sec = 0; // 第一次活到第 4501 年（B046 机巧兴起）
let firstEraEndHours = null; // 第一次走完第一纪元
const beatGaps = [];
let gapScenes = {};
const gapBlame = {};

for (let life = 1; life <= MAX_LIVES; life++) {
  const g = new Game({ meta: metaState });
  // 买天赋：能买就买（贪心，按价从低到高）
  if (meta.autoSpend) meta.autoSpend(g.meta);
  else {
    for (const t of [...TALENTS].sort((a, b) => a.cost - b.cost)) {
      if (g.meta.talents.includes(t.id)) continue;
      if ((g.meta.karmaPoints || 0) >= t.cost) { g.meta.karmaPoints -= t.cost; g.meta.talents.push(t.id); }
    }
  }
  const originPool = meta.availableOrigins ? meta.availableOrigins(g.meta) : ORIGINS;
  const gfPool = meta.availableGoldenFingers ? meta.availableGoldenFingers(g.meta) : GOLDEN_FINGERS;
  const origin = originPool[rng.int(0, originPool.length - 1)];
  const gf = gfPool[rng.int(0, gfPool.length - 1)];
  const root = ROOTS[rng.int(0, ROOTS.length - 1)];
  const endingsBefore = g.meta.unlockedEndings.length;
  const achBefore = Object.keys(g.meta.achievements).length;
  const evBefore = seenEvents.size;
  g.newRun({ seed: SEED * 100003 + life * 7919, name: `第${life}世`, gender: '女', originId: origin.id, rootId: root.id, goldenFingerId: gf.id, meta: g.meta });

  let sec = 0;
  let steps = 0;
  const wantsRestart = rng.chance(0.5);
  let lastBeat = 0;
  const realm0 = () => g.state.char.realm * 10 + g.state.char.layer;
  let lastRealm = realm0();
  let cultivateClicks = 0;
  const systems = new Set();
  const lifeEvents = new Set();
  let capped = false;
  while (true) {
    if (steps++ >= 80000) { capped = true; break; }
    const s = g.state;
    if (!s || s.scene.id === 'ending' || s.flags.finished) break;
    const sceneId = s.scene.id;
    const hadResult = Boolean(s.scene.result);
    if (!UI_SCENES.has(sceneId) && !hadResult) { lifeEvents.add(sceneId); seenEvents.add(sceneId); }
    systems.add(sceneId);
    sec += stepSeconds(g, sceneId, hadResult);
    // 拍子（B25）：需要决定的大事、新篇章、突破、改写历史、宿敌
    const node = g.currentNode();
    const isBeat = !hadResult && (sceneId === 'chapter' || node?.history || node?.pool === 'story' || sceneId === 'breakthrough' || sceneId === 'tribulation')
      || realm0() > lastRealm;
    lastRealm = realm0();
    gapScenes[sceneId] = (gapScenes[sceneId] || 0) + stepSeconds(g, sceneId, hadResult);
    if (isBeat) {
      const gap = (sec - lastBeat) / 60;
      beatGaps.push(gap);
      if (gap > 15) { gapOver15Sec += gap * 60; for (const [k, v] of Object.entries(gapScenes)) gapBlame[k] = (gapBlame[k] || 0) + v; }
      gapScenes = {};
      lastBeat = sec;
    }
    let ch = policy(g);
    // 剧情节点：真人会随兴选择，不总选第一项
    if (!hadResult && !UI_SCENES.has(sceneId)) {
      const avail = g.choices().filter((c) => !c.disabled);
      if (avail.length) ch = avail[rng.int(0, avail.length - 1)];
    }
    if (!ch) break;
    if (ch.label && /吐纳|闭关|苦修/.test(ch.label)) cultivateClicks++;
    // 真人的第一世：看完临河大水的结局，多半会想回去改写（前三世里一半的人这样做）
    if (!hadResult && sceneId === 'hub' && (g.state.meta.cycle || 1) <= 3 && g.state.history?.['y019.century_judgement'] && !(g.state.rewrites || []).length && wantsRestart) {
      g.act_openCave();
      const bj = g.choices().find((c) => c.label.includes('了此一生') || c.label.includes('兵解'));
      if (bj) { g.choose(bj.index); break; }
    }
    // 高境界用长闭关跨越岁月（真人也会这样做）
    if (sceneId === 'cave' && !hadResult && s.char.realm >= 2) {
      const lng = g.choices().find((c) => c.label.includes('闭关至下一件大事') && !c.disabled);
      if (lng && !(ch.label || '').includes('涤魔') && rng.chance(0.6)) ch = lng;
    }
    if (process.env.DEBUG && steps > 19600) console.log('STUCK', life, sceneId, hadResult, ch.label, g.choices().map((c) => c.label + (c.disabled ? '(x)' : '')).join('/'));
    g.choose(ch.index);
    const yr = Math.floor((g.state.char.age - 192) / 12) + 1;
    if (firstTechHours == null && yr >= 4501) firstTechHours = (totalSec + sec) / 3600;
    if (firstEraEndHours == null && yr >= 10000) firstEraEndHours = (totalSec + sec) / 3600;
  }
  const s = g.state;
  if (firstReincarnationHours == null && !capped) firstReincarnationHours = (totalSec + sec) / 3600;
  // 结局页：择前世遗泽（能带几样带几样）
  if (s.scene.id === 'ending') {
    for (let k = 0; k < 3; k++) {
      const lg = g.choices().find((c) => c.label && !c.disabled && !c.label.startsWith('✓') && c.hint === '带入来世');
      if (!lg) break;
      g.choose(lg.index);
    }
  }
  metaState = s.meta;
  totalSec += sec;
  const newEndings = s.meta.unlockedEndings.length - endingsBefore;
  const newAch = Object.keys(s.meta.achievements).length - achBefore;
  const newEv = seenEvents.size - evBefore;
  lives.push({
    life, origin: origin.name, gf: gf.name,
    minutes: Math.round(sec / 60), actions: s.stats.actions,
    cultivateShare: +(cultivateClicks / Math.max(1, s.stats.actions)).toFixed(2),
    realm: s.char.realm, years: Math.floor(s.char.age / 12),
    ending: s.flags.endingId, newEndings, newAch, newEvents: newEv, lifeEvents: lifeEvents.size,
    systems: systems.size, karma: s.meta.karmaPoints, talents: s.meta.talents.length,
    jieshu: s.char.jieshu || 0,
    year: Math.floor((s.char.age - 192) / 12) + 1,
    handbook: Object.keys(s.meta.handbook || {}).length,
    rewrites: (s.rewrites || []).length,
    capped,
  });
  if (capped) cappedLives++;
  if (newEndings === 0 && newAch === 0 && newEv < 5) stale++; else stale = 0;
  if (stale >= 3) break;
  g.act_reincarnate();
}

const fmtH = (sec) => (sec / 3600).toFixed(1);
console.table(lives.map((l) => ({ 世: l.life, 出身: l.origin, 金手指: l.gf, 分钟: l.minutes, 行动: l.actions, 修炼占比: l.cultivateShare, 境界: l.realm, 寿: l.years, 结局: l.ending, 新结局: l.newEndings, 新成就: l.newAch, 新奇遇: l.newEvents, 活到第几年: l.year, 手札: l.handbook, 改写: l.rewrites })));
console.log(JSON.stringify({
  lives: lives.length,
  totalHours: Number(fmtH(totalSec)),
  avgMinutesPerLife: Math.round(totalSec / 60 / lives.length),
  endingsUnlocked: `${metaState.unlockedEndings.length}/${ENDINGS.length}`,
  achievements: `${Object.keys(metaState.achievements).length}/${ACHIEVEMENTS.length}`,
  uniqueEvents: seenEvents.size,
  saturatedAtLife: stale >= 3 ? lives.length : null,
  cappedLives,
  hoursToFirstReincarnation: firstReincarnationHours == null ? null : Number(firstReincarnationHours.toFixed(1)),
  shareOfTimeInGapsOver15min: Number((gapOver15Sec / totalSec).toFixed(2)),
  hoursToFirstTechEra: firstTechHours == null ? null : Number(firstTechHours.toFixed(1)),
  hoursToEra1End: firstEraEndHours == null ? null : Number(firstEraEndHours.toFixed(1)),
  longGapBlameMinutes: Object.fromEntries(Object.entries(gapBlame).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => [k, Math.round(v / 60)])),
  beatGapMinutes: (() => {
    const a = [...beatGaps].sort((x, y) => x - y);
    if (!a.length) return null;
    const q = (p) => Number(a[Math.min(a.length - 1, Math.floor(a.length * p))].toFixed(1));
    return { count: a.length, median: q(0.5), p90: q(0.9), max: Number(a[a.length - 1].toFixed(1)), over15: a.filter((x) => x > 15).length };
  })(),
}, null, 2));
