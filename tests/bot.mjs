/** 共享模拟策略（simulate.mjs 与 playtime.mjs 共用）。 */
import { canBreakthrough, bottleneckStatus, isRealmMaxLayer } from '../src/engine/state.js';

export function policy(g) {
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
    return by('出剑') || list[0];
  }
  if (s.scene.id === 'tribulation') return by('吞服天劫丹') || by('本命法宝') || by('肉身硬抗') || list[0];
  if (s.scene.id === 'breakthrough') {
    const bn = bottleneckStatus(s);
    if (!bn.ok) return by('暂缓破境') || list[list.length - 1];
    return by('服') || by('凝神冲关') || list[0];
  }
  if (s.scene.id === 'recruit') {
    const sect = list.find((ch) => !ch.label.includes('暂不入宗') && !ch.label.includes('散修'));
    return sect || by('暂不入宗') || list[0];
  }
  if (s.scene.id === 'cave') {
    if (canBreakthrough(c) && bottleneckStatus(s).ok) return by('步出洞府') || list[list.length - 1];
    if (c.demon >= 32 && by('静心涤魔')) return by('静心涤魔');
    const bn = bottleneckStatus(s);
    if (isRealmMaxLayer(c) && !bn.ok && by('参悟')) return by('参悟');
    if (s.turn % 7 === 0 && by('参悟')) return by('参悟');
    if (s.turn % 9 === 0 && by('祭炼法宝') && c.stones >= 500) return by('祭炼法宝');
    if (c.demon < 30 && by('闭关冲层') && s.turn % 3 !== 0) return by('闭关冲层');
    if (c.demon < 20 && by('闭关苦修')) return by('闭关苦修');
    return by('吐纳炼气') || by('步出洞府') || list[0];
  }
  if (s.scene.id === 'sectHall') {
    const prom = list.find((ch) => ch.label.includes('晋升考核'));
    if (prom && s.turn % 11 === 0) return prom;
    const targetTechs = Math.min(4, (c.sectRank || 0) + 1);
    if (c.contribution >= 180 && c.techniques.length < targetTechs && s.turn % 5 === 0) return by('藏经阁') || list[0];
    if (c.contribution >= 450 && s.turn % 7 === 0) return by('宗门宝库') || list[0];
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
    return by('常规宗门杂务') || list[0];
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
  // 真人在高境界会用长闭关跨越无事的岁月
  // 瓶颈缺的不是天地灵机（道心、法则不够）就去洞府参悟；只缺灵机才闭关等
  const bnNow = bottleneckStatus(s);
  const onlyWaitingQi = canBreakthrough(c) && !bnNow.ok && bnNow.missing.every((m) => m.includes('天地灵机'));
  if (canBreakthrough(c) && !bnNow.ok && !onlyWaitingQi && by('洞府修行')) return by('洞府修行');
  if (byId('long_seclusion') && (onlyWaitingQi || !canBreakthrough(c)) && s.turn % 4 !== 0) return byId('long_seclusion');
  const mod = s.turn % 10;
  if (mod === 0 && byId('open_region')) return byId('open_region');
  if ((mod === 3 || mod === 6) && byId('open_sect')) return byId('open_sect');
  return by('洞府修行') || list[0];
}

