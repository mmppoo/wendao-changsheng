/**
 * 平衡与百小时时长模拟（v4.0）：
 * 驱动智能策略走完整六大支柱（洞府吐纳/参悟法则、宗门任务/藏经阁/晋升、九州迁徙/探索、坊市/突破）。
 * 运行：node tests/simulate.mjs [runs]
 */
import { Game } from '../src/engine/game.js';
import { realmLabel } from '../src/data/realms.js';
import { canBreakthrough, bottleneckStatus, isRealmMaxLayer } from '../src/engine/state.js';

const RUNS = Number(process.argv[2] || 10);

function policy(g) {
  const s = g.state;
  const c = s.char;
  const list = g.choices().filter((ch) => !ch.disabled);
  const by = (kw) => list.find((ch) => ch.label.includes(kw));
  const byId = (id) => list.find((ch) => ch.id === id);
  if (s.scene.result) return { index: 0 };

  if (s.scene.id === 'combat') {
    if (c.hp < c.maxHp * 0.32) {
      const pill = by('服丹');
      if (pill) return pill;
      const flee = by('遁走');
      if (flee) return flee;
    }
    const art = by('绝招');
    if (art && c.mp > c.maxMp * 0.45) return art;
    return by('出手') || list[0];
  }
  if (s.scene.id === 'tribulation') return by('吞服天劫丹') || by('本命法宝') || by('肉身硬抗') || list[0];
  if (s.scene.id === 'breakthrough') {
    const bn = bottleneckStatus(s);
    if (!bn.ok) return by('暂缓破境') || list[list.length - 1];
    return by('服') || by('凝神冲关') || list[0];
  }
  if (s.scene.id === 'recruit') {
    const sect = list.find((ch) => ch.id !== 'recruit_later' && !ch.label.includes('散修'));
    return sect || by('暂不入宗') || list[0];
  }
  if (s.scene.id === 'cave') {
    if (canBreakthrough(c) && bottleneckStatus(s).ok) return by('步出洞府') || list[list.length - 1];
    if (c.demon >= 32 && by('静心涤魔')) return by('静心涤魔');
    const bn = bottleneckStatus(s);
    if (isRealmMaxLayer(c) && !bn.ok && by('参悟')) return by('参悟');
    if (s.turn % 7 === 0 && by('参悟')) return by('参悟');
    if (s.turn % 9 === 0 && by('祭炼法宝') && c.stones >= 500) return by('祭炼法宝');
    if (c.demon < 20 && by('闭关苦修')) return by('闭关苦修');
    return by('吐纳炼气') || by('步出洞府') || list[0];
  }
  if (s.scene.id === 'sectHall') {
    const prom = list.find((ch) => ch.label.includes('晋升考核'));
    if (prom && s.turn % 11 === 0) return prom;
    const targetTechs = Math.min(4, (c.sectRank || 0) + 1);
    if (c.contribution >= 180 && c.techniques.length < targetTechs && s.turn % 5 === 0) return by('藏经阁') || list[0];
    if (c.contribution >= 450 && s.turn % 7 === 0) return byId('sect_treasury') || list[0];
    if (c.contribution >= 200 && s.turn % 3 === 0 && by('灵脉聚灵阵')) return by('灵脉聚灵阵');
    if (c.contribution < 800 + (c.sectRank || 0) * 1500 && s.turn % 2 === 0) return by('任务堂') || list[0];
    return by('离开山门') || list[list.length - 1];
  }
  if (s.scene.id === 'sectLibrary') {
    const book = list.find((ch) => !ch.label.includes('离开'));
    return book || by('离开') || list[0];
  }
  if (s.scene.id === 'sectTreasury') {
    const item = list.find((ch) => ch.label.includes('丹') && !ch.label.includes('返回'));
    return item || by('返回') || list[0];
  }
  if (s.scene.id === 'sectMissions') {
    if (s.turn % 3 === 0) return by('返回大殿') || list[list.length - 1];
    return byId('sect_daily') || list[0];
  }
  if (s.scene.id === 'sectPromote') {
    return by('登台应考') || by('改日再来') || list[0];
  }
  if (s.scene.id === 'regionHub') {
    if (s.turn % 8 === 0 && byId('open_map')) return byId('open_map');
    return by('探索') || by('返回洞府') || list[0];
  }
  if (s.scene.id === 'regionMap') {
    const higher = list.filter((ch) => !ch.label.includes('返回'));
    return higher[higher.length - 1] || by('返回') || list[0];
  }
  if (s.scene.id === 'cityHub') return by('离开坊市') || list[list.length - 1];
  if (s.scene.id === 'market' || s.scene.id === 'auction' || s.scene.id === 'sell') return list[list.length - 1];
  if (s.scene.id !== 'hub') return list[0];

  // 主界面策略
  if (canBreakthrough(c) && bottleneckStatus(s).ok && by('冲击境界')) return by('冲击境界');
  if (!c.sectId && byId('find_sect')) return byId('find_sect');
  if (canBreakthrough(c) && !bottleneckStatus(s).ok && by('洞府修行')) return by('洞府修行');
  const mod = s.turn % 10;
  if (mod === 0 && byId('open_region')) return byId('open_region');
  if ((mod === 3 || mod === 6) && byId('open_sect')) return byId('open_sect');
  return by('洞府修行') || list[0];
}

function run(seed) {
  const g = new Game();
  g.newRun({ seed, name: '模拟', gender: '男', originId: 'scholar', rootId: 'shuangling', goldenFingerId: 'gf_bottle' });
  const seen = new Set();
  const uiScenes = new Set(['hub', 'cave', 'regionHub', 'regionMap', 'sectHall', 'sectMissions', 'sectLibrary', 'sectTreasury', 'sectPromote', 'cityHub', 'tianji', 'npcHub', 'npcDetail', 'market', 'auction', 'sell', 'recruit', 'combat', 'tribulation', 'breakthrough', 'delve', 'techEquip', 'alchemy', 'techShop', 'arena', 'faceSlap', 'fairHub', 'grudgeBook']);
  let guard = 0;
  const first = {};
  while (guard++ < 12000) {
    const s = g.state;
    if (s.scene.id === 'ending' || s.flags.finished) break;
    if (!uiScenes.has(s.scene.id)) seen.add(s.scene.id);
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
    atk: g.playerAtk(),
    sectRank: s.char.sectRank,
    techs: s.char.techniques.length,
    daoBase: s.char.daoBaseQuality,
    goldCore: s.char.goldenCoreQuality,
    ending: s.flags.endingId || null,
    events: seen.size,
    achievements: Object.keys(s.meta.achievements).length,
    first,
  };
}

const out = [];
for (let i = 0; i < RUNS; i++) {
  const seed = 1000 + i * 7919;
  out.push(run(seed));
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
  avgTechs: avg(out, 'techs'),
  maxRealm: Math.max(...out.map((r) => r.realmIndex)),
  maxAtk: Math.max(...out.map((r) => r.atk)),
  endings: out.reduce((acc, r) => { acc[r.ending || 'none'] = (acc[r.ending || 'none'] || 0) + 1; return acc; }, {}),
  milestoneYears: Object.fromEntries(Object.entries(milestones).map(([k, v]) => [k, Math.round(v.reduce((a, b) => a + b, 0) / v.length)])),
  sample: out.slice(0, 3),
}, null, 2));
