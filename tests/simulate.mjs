/**
 * 平衡与时长模拟：用不同策略跑完整人生，统计回合数、耗时年份、境界进度、事件覆盖。
 * 运行：node tests/simulate.mjs [runs]
 */
import { Game } from '../src/engine/game.js';
import { REALMS, realmLabel } from '../src/data/realms.js';
import { canBreakthrough } from '../src/engine/state.js';
import { ALL_EVENTS } from '../src/data/events/index.js';

const RUNS = Number(process.argv[2] || 12);

function policy(g) {
  const s = g.state;
  const list = g.choices().filter((c) => !c.disabled);
  const by = (kw) => list.find((c) => c.label.includes(kw));
  if (s.scene.result) return { action: 'continue' };
  if (s.scene.id === 'combat') {
    const atk = by('出剑');
    if (s.char.hp < s.char.maxHp * 0.3) {
      const pill = by('服丹');
      if (pill) return pill;
      const flee = by('遁走');
      if (flee) return flee;
    }
    return atk || list[0];
  }
  if (s.scene.id === 'tribulation') return by('祭出法器') || by('以肉身硬接') || list[0];
  if (s.scene.id === 'breakthrough') {
    if (by('服丹辅助')) return by('服丹辅助');
    return by('凝神冲关') || list[0];
  }
  if (s.scene.id === 'market') return by('离开坊市') || list[0];
  if (s.scene.id === 'recruit') {
    const sect = list.find((c) => !c.label.includes('再想想') && !c.label.includes('散修'));
    return sect || by('再想想') || list[0];
  }
  if (s.scene.id !== 'hub') return list[0];

  if (canBreakthrough(s.char)) return by('冲击境界') || list[0];
  if (!s.char.sectId && by('寻访仙门')) return by('寻访仙门');
  if (s.char.demon > 40 && by('沉淀心境')) return by('沉淀心境');
  if (s.char.hp < s.char.maxHp * 0.4 && by('沉淀心境')) return by('沉淀心境');
  // 交替：修炼、历练、宗门事务
  const cycle = s.turn % 5;
  if (cycle === 0 && by('外出历练')) return by('外出历练');
  if (cycle === 1 && by('宗门事务')) return by('宗门事务');
  if (cycle === 2 && by('坊市走走')) return by('坊市走走');
  return by('打坐修炼') || list[0];
}

function run(seed) {
  const g = new Game();
  g.newRun({ seed, name: '模拟', gender: '男', originId: 'scholar', rootId: 'shuangling' });
  const seen = new Set();
  let guard = 0;
  let first = {};
  while (guard++ < 6000) {
    const s = g.state;
    if (s.scene.id === 'ending' || s.flags.finished) break;
    const before = s.scene.id;
    if (before !== 'hub' && before !== 'combat' && before !== 'tribulation' && before !== 'breakthrough') seen.add(before);
    const ch = policy(g);
    if (!ch) break;
    g.choose(ch.index);
    const c = g.state.char;
    if (first[`realm${c.realm}`] == null && c.realm > 0) first[`realm${c.realm}`] = Math.floor(c.age / 12);
    if (g.state.scene.id === 'ending') break;
  }
  const s = g.state;
  return {
    seed,
    turns: s.turn,
    years: Math.floor(s.char.age / 12),
    realm: realmLabel(s.char),
    realmIndex: s.char.realm,
    ending: s.flags.endingId || null,
    events: seen.size,
    achievements: Object.keys(s.meta.achievements).length,
    first: first,
    hp: Math.round(s.char.hp),
    demon: Math.round(s.char.demon),
    stones: s.char.stones,
  };
}

const out = [];
for (let i = 0; i < RUNS; i++) {
  const seed = 1000 + i * 7919;
  try {
    out.push(run(seed));
  } catch (e) {
    console.error('seed', seed, 'failed:', e.message);
    throw e;
  }
}

const avg = (arr, k) => Math.round(arr.reduce((a, b) => a + b[k], 0) / arr.length);
const milestones = {};
for (const r of out) for (const [k, v] of Object.entries(r.first)) {
  milestones[k] = milestones[k] || [];
  milestones[k].push(v);
}

console.log(JSON.stringify({
  runs: RUNS,
  avgTurns: avg(out, 'turns'),
  avgYears: avg(out, 'years'),
  avgEvents: avg(out, 'events'),
  avgAchievements: avg(out, 'achievements'),
  maxRealm: Math.max(...out.map((r) => r.realmIndex)),
  endings: out.reduce((acc, r) => { acc[r.ending || 'none'] = (acc[r.ending || 'none'] || 0) + 1; return acc; }, {}),
  milestoneYears: Object.fromEntries(Object.entries(milestones).map(([k, v]) => [k, Math.round(v.reduce((a, b) => a + b, 0) / v.length)])),
  sample: out.slice(0, 3),
  uniqueEvents: new Set(out.flatMap((r) => r.events)).size,
}, null, 2));
