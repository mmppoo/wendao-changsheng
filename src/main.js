import { Game } from './engine/game.js';
import { SaveStore } from './engine/save.js';
import {
  recomputeDerived, qualityMultiplier, maxTechSlots, activeTechniques,
  techAlignmentConflict, lifespanAlert, titleBonuses,
} from './engine/state.js';
import { ROOTS, ROOT_BY_ID, GRADE_ORDER, ROOT_WEIGHT_TOTAL } from './data/roots.js';
import { ORIGINS } from './data/origins.js';
import {
  REALMS, realmLabel, LAW_BY_ID, LAW_STAGES, DAO_BASE_QUALITIES, GOLDEN_CORE_QUALITIES,
} from './data/realms.js';
import { SECTS, SECT_BY_ID, SECT_RANKS } from './data/sects.js';
import { REGIONS, REGION_BY_ID } from './data/regions.js';
import { ALL_TECHNIQUES } from './data/techniques.js';
import { NPCS } from './data/npcs.js';
import { ACHIEVEMENTS } from './data/achievements.js';
import { ENDINGS } from './data/endings.js';
import { ITEM_BY_ID } from './data/items.js';
import { TALENTS } from './data/talents.js';
import { GOLDEN_FINGERS, GOLDEN_FINGER_BY_ID, PET_BY_ID } from './data/golden_fingers.js';
import { SpiritCanvas, SoundFX, triggerScreenFx } from './ui/fx.js';
import { PixelStage, sceneThemeFor, renderPixelPortrait, PIXEL_ICONS } from './ui/pixelScene.js';

function formatNum(n) {
  if (!Number.isFinite(n)) return '∞';
  const abs = Math.abs(n);
  if (abs >= 1e8) return `${(n / 1e8).toFixed(2)}亿`;
  if (abs >= 1e4) return `${(n / 1e4).toFixed(1)}万`;
  return String(Math.round(n));
}

const $ = (id) => document.getElementById(id);
const store = new SaveStore();
const game = new Game({ meta: store.meta() || {} });
const fxCanvas = new SpiritCanvas($('fx-canvas'));
const sfx = new SoundFX();
const pixelStage = new PixelStage($('title-pixel-canvas'), $('scene-pixel-canvas'));

const ui = {
  originId: null,
  goldenFingerId: 'gf_bottle',
  gender: '女',
  rolledRoot: null,
  rerollUsed: false,
  codexTab: 'achievements',
  saveMode: 'save',
  mobileTab: 'story',
  logExpand: false,
  lastAchCount: null,
  lastSnapshot: null,
};

/* ---------------------------------- 启动 ---------------------------------- */

function boot() {
  seedTitleMeta();
  initCreate();
  wireTopbar();
  wireMobileNav();
  wireOverlays();
  wireKeyboard();
  exposeDebug();
  syncPreferenceButtons();
  window.addEventListener('beforeunload', () => {
    if (game.state && !game.state.flags.finished) store.save(0, game);
  });
}

function syncPreferenceButtons() {
  const btnSound = $('btn-sound');
  if (btnSound) {
    btnSound.textContent = sfx.enabled ? '声' : '静';
    btnSound.title = sfx.enabled ? '音效：已开启（点此静音）' : '音效：已静音（点此开启）';
    btnSound.classList.toggle('is-on', sfx.enabled);
  }
}

function seedTitleMeta() {
  const meta = store.meta();
  const auto = store.load(0);
  if (auto) {
    $('btn-continue').hidden = false;
    $('btn-continue').textContent = `继续今生 · ${auto.state.char.name}`;
  } else {
    $('btn-continue').hidden = true;
  }
  const counts = meta
    ? `第 ${meta.cycle || 1} 世轮回 · 结局 ${(meta.unlockedEndings || []).length}/${ENDINGS.length} · 成就 ${Object.keys(meta.achievements || {}).length}/${ACHIEVEMENTS.length}`
    : '初次踏入仙途？择一出身与伴生机缘，开启测灵阵。';
  $('title-meta').textContent = counts;
}

function showScreen(which) {
  $('title-screen').hidden = which !== 'title';
  $('create-screen').hidden = which !== 'create';
  $('game-screen').hidden = which !== 'game';
  if (which === 'title') fxCanvas.setMood('gold');
  window.scrollTo(0, 0);
}

/* ---------------------------------- 建角 ---------------------------------- */

function initCreate() {
  const grid = $('origin-grid');
  grid.innerHTML = '';
  ORIGINS.forEach((o) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'origin-card';
    btn.dataset.origin = o.id;
    btn.setAttribute('role', 'radio');
    btn.setAttribute('aria-checked', 'false');
    btn.innerHTML = `<h4>${o.name}</h4><p>${o.desc}</p><span class="origin-hook">${o.hook}</span>`;
    btn.addEventListener('click', () => { sfx.play('click'); selectOrigin(o.id); });
    grid.appendChild(btn);
  });

  const gfGrid = $('gf-grid');
  gfGrid.innerHTML = '';
  GOLDEN_FINGERS.forEach((gf) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'gf-card' + (gf.id === ui.goldenFingerId ? ' is-active' : '');
    btn.dataset.gf = gf.id;
    btn.setAttribute('role', 'radio');
    btn.setAttribute('aria-checked', String(gf.id === ui.goldenFingerId));
    btn.innerHTML = `
      <div class="gf-top"><b>${gf.name}</b><span class="gf-tag">${gf.tag}</span></div>
      <p>${gf.desc}</p>
      <span class="gf-perk">${gf.perk}</span>
    `;
    btn.addEventListener('click', () => { sfx.play('click'); selectGoldenFinger(gf.id); });
    gfGrid.appendChild(btn);
  });

  document.querySelectorAll('.seg').forEach((seg) => {
    seg.addEventListener('click', () => {
      sfx.play('click');
      document.querySelectorAll('.seg').forEach((s) => s.classList.remove('is-active'));
      seg.classList.add('is-active');
      ui.gender = seg.dataset.gender;
    });
  });

  $('btn-roll').addEventListener('click', openRoll);
  renderTalents();
  $('talent-grid').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-talent]');
    if (!btn) return;
    buyTalent(btn.dataset.talent);
  });
  $('btn-back-title').addEventListener('click', () => { seedTitleMeta(); showScreen('title'); });
  $('btn-new').addEventListener('click', () => { sfx.play('click'); renderTalents(); showScreen('create'); });
  $('btn-continue').addEventListener('click', () => { sfx.play('chime'); continueGame(); });
  $('btn-gallery').addEventListener('click', () => { sfx.play('click'); openCodex(); });

  $('roll-actions').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    if (btn.dataset.act === 'accept') acceptRoot();
    if (btn.dataset.act === 'reroll') rerollRoot();
  });
}

function selectGoldenFinger(id) {
  ui.goldenFingerId = id;
  document.querySelectorAll('.gf-card').forEach((c) => {
    const on = c.dataset.gf === id;
    c.classList.toggle('is-active', on);
    c.setAttribute('aria-checked', String(on));
  });
  updateCreateHint();
}

function updateCreateHint() {
  const o = ORIGINS.find((x) => x.id === ui.originId);
  const gf = GOLDEN_FINGER_BY_ID[ui.goldenFingerId];
  if (!o) {
    $('create-hint').textContent = `已择伴生机缘「${gf?.name || '掌天小绿瓶'}」，请再选中一个出身。`;
    return;
  }
  $('create-hint').textContent = `${o.name} × ${gf?.name || ''} — 点击开启测灵阵。`;
}

function renderTalents() {
  const meta = store.meta() || { karmaPoints: 0, talents: [] };
  const points = meta.karmaPoints || 0;
  const owned = meta.talents || [];
  $('karma-points').textContent = `轮回点 ${points} · 已点亮 ${owned.length}/${TALENTS.length}`;
  $('talent-grid').innerHTML = TALENTS.map((t) => {
    const on = owned.includes(t.id);
    const afford = points >= t.cost;
    return `<button type="button" class="talent ${on ? 'is-on' : ''}" data-talent="${t.id}"
      ${on || !afford ? 'disabled' : ''}>
      <b data-cost="${on ? '已点亮' : `${t.cost} 点`}">${t.name}</b>
      <span>${t.desc}</span>
    </button>`;
  }).join('');
}

function buyTalent(id) {
  const t = TALENTS.find((x) => x.id === id);
  const meta = store.meta() || { karmaPoints: 0, talents: [] };
  if (!t || (meta.talents || []).includes(id)) return;
  if ((meta.karmaPoints || 0) < t.cost) return;
  meta.karmaPoints = (meta.karmaPoints || 0) - t.cost;
  meta.talents = [...(meta.talents || []), id];
  store.saveMeta(meta);
  game.meta = meta;
  renderTalents();
  sfx.play('chime');
  toast(`轮回天赋「${t.name}」已点亮`, 'gold');
}

function selectOrigin(id) {
  ui.originId = id;
  document.querySelectorAll('.origin-card').forEach((c) => {
    const on = c.dataset.origin === id;
    c.classList.toggle('is-active', on);
    c.setAttribute('aria-checked', String(on));
  });
  $('btn-roll').disabled = false;
  updateCreateHint();
}

function openRoll() {
  if (!ui.originId) return;
  ui.rolledRoot = null;
  ui.rerollUsed = false;
  $('roll-overlay').hidden = false;
  $('roll-result').textContent = '……';
  $('roll-result').classList.add('spinning');
  $('roll-result').classList.remove('revealed');
  $('roll-grade').textContent = '测灵中';
  $('roll-stats').innerHTML = '';
  $('roll-desc').textContent = '八卦运转，五行聚气……';
  $('roll-actions').innerHTML = '';
  $('bagua-stage').classList.add('is-spinning');
  sfx.play('click');
  spinRoll();
}

function spinRoll() {
  const resultEl = $('roll-result');
  let ticks = 0;
  const timer = setInterval(() => {
    const r = ROOTS[Math.floor(Math.random() * ROOTS.length)];
    resultEl.textContent = r.name;
    ticks++;
    if (ticks > 14) {
      clearInterval(timer);
      settleRoll();
    }
  }, 65);
}

function settleRoll() {
  const root = weightedRoot();
  ui.rolledRoot = root;
  const el = $('roll-result');
  const col = gradeColor(root.grade);
  $('bagua-stage').classList.remove('is-spinning');
  el.classList.remove('spinning');
  el.classList.add('revealed');
  el.textContent = root.name;
  el.style.color = col;
  $('roll-grade').textContent = `${root.grade}品灵根`;
  $('roll-grade').style.color = col;
  $('roll-grade').style.borderColor = col;

  const pct = ((root.weight / ROOT_WEIGHT_TOTAL) * 100).toFixed(root.weight < 1 ? 2 : 1);
  $('roll-stats').innerHTML = `
    <span class="roll-stat">修炼 ×${root.speed}</span>
    <span class="roll-stat">突破 ${root.breakBonus >= 0 ? '+' : ''}${root.breakBonus}%</span>
    <span class="roll-stat">寿元 ${root.lifespan >= 0 ? '+' : ''}${root.lifespan}年</span>
    <span class="roll-stat">天命 ${pct}%</span>
  `;
  $('roll-desc').innerHTML = `${root.desc}<br><span style="color:var(--gold)">${root.quirk}</span>`;

  fxCanvas.burst('root_reveal', col);
  if (GRADE_ORDER[root.grade] >= 3) {
    triggerScreenFx('root_reveal');
    sfx.play('root_reveal');
  } else {
    sfx.play('chime');
  }

  const canReroll = !ui.rerollUsed;
  $('roll-actions').innerHTML = `
    <button class="btn btn-primary" data-act="accept">就是它，踏入仙途</button>
    <button class="btn btn-ghost" data-act="reroll" ${canReroll ? '' : 'disabled'}>再问一次天意</button>
  `;
}

function rerollRoot() {
  if (ui.rerollUsed) return;
  ui.rerollUsed = true;
  $('roll-actions').innerHTML = '';
  $('roll-result').classList.add('spinning');
  $('roll-result').classList.remove('revealed');
  $('roll-grade').textContent = '重测中';
  $('roll-stats').innerHTML = '';
  $('bagua-stage').classList.add('is-spinning');
  sfx.play('click');
  spinRoll();
}

function weightedRoot() {
  const total = ROOTS.reduce((a, r) => a + r.weight, 0);
  let roll = Math.random() * total;
  for (const r of ROOTS) {
    roll -= r.weight;
    if (roll <= 0) return r;
  }
  return ROOTS[0];
}

function gradeColor(grade) {
  return { 凡: '#a6acb8', 黄: '#d9c698', 玄: '#58b98a', 地: '#6cb4db', 天: '#e6b95c', 仙: '#f0715b' }[grade] || '#e6b95c';
}

function acceptRoot() {
  if (!ui.rolledRoot) return;
  $('roll-overlay').hidden = true;
  const name = $('input-name').value.trim() || '无名';
  startRun({
    name,
    gender: ui.gender,
    originId: ui.originId,
    rootId: ui.rolledRoot.id,
    goldenFingerId: ui.goldenFingerId,
  });
}

function startRun(opts) {
  const seed = (Math.random() * 0xffffffff) >>> 0;
  game.newRun({ ...opts, seed, meta: store.meta() || game.meta });
  ui.lastSnapshot = snapshotChar();
  ui.lastAchCount = Object.keys(game.state.meta.achievements || {}).length;
  setMobileTab('story');
  showScreen('game');
  renderAll();
  const gf = GOLDEN_FINGER_BY_ID[opts.goldenFingerId];
  toast(`觉醒：${ROOT_BY_ID[opts.rootId].name}${gf ? ` · ${gf.name}` : ''}`, 'gold');
  store.save(0, game);
}

function continueGame() {
  const data = store.load(0);
  if (!data) return;
  game.setState(data.state);
  ui.lastSnapshot = snapshotChar();
  ui.lastAchCount = Object.keys(game.state.meta.achievements || {}).length;
  setMobileTab('story');
  showScreen('game');
  renderAll();
  if (game.state.scene.id === 'hub') toast('接着上次的时辰。');
}

function snapshotChar() {
  const c = game.state?.char;
  if (!c) return null;
  return {
    exp: Math.floor(c.exp),
    hp: Math.round(c.hp),
    mp: Math.round(c.mp),
    stones: c.stones,
    demon: Math.round(c.demon),
    realm: c.realm,
    layer: c.layer,
    reputation: c.reputation,
    lifespan: Math.floor(c.lifespan / 12),
  };
}

function computeDeltas(prev, curr) {
  if (!prev || !curr) return [];
  const out = [];
  if (curr.realm > prev.realm || curr.layer > prev.layer) out.push({ text: '境界突破!', kind: '' });
  const dexp = curr.exp - prev.exp;
  if (dexp > 0) out.push({ text: `修为 +${dexp}`, kind: '' });
  const dstones = curr.stones - prev.stones;
  if (dstones !== 0) out.push({ text: `灵石 ${dstones > 0 ? '+' : ''}${dstones}`, kind: dstones > 0 ? '' : 'neg' });
  const dhp = curr.hp - prev.hp;
  if (Math.abs(dhp) >= 5 && curr.realm === prev.realm) out.push({ text: `气血 ${dhp > 0 ? '+' : ''}${dhp}`, kind: dhp > 0 ? 'jade' : 'neg' });
  const ddemon = curr.demon - prev.demon;
  if (ddemon !== 0) out.push({ text: `心魔 ${ddemon > 0 ? '+' : ''}${ddemon}`, kind: ddemon > 0 ? 'neg' : 'jade' });
  const drep = curr.reputation - prev.reputation;
  if (drep !== 0) out.push({ text: `声望 ${drep > 0 ? '+' : ''}${drep}`, kind: drep > 0 ? 'jade' : 'neg' });
  const dlife = curr.lifespan - prev.lifespan;
  if (dlife !== 0 && curr.realm === prev.realm) out.push({ text: `寿元 ${dlife > 0 ? '+' : ''}${dlife}年`, kind: dlife > 0 ? 'jade' : 'neg' });
  return out.slice(0, 4);
}

/* ---------------------------------- 渲染 ---------------------------------- */

function renderAll(deltas = []) {
  if (!game.state) return;
  renderMobileHud();
  renderCharPanel();
  renderSceneBanner();
  renderRumorBar();
  renderSubhubBar();
  renderStory(deltas);
  renderRightPanel();
  const c = game.state.char;
  $('top-realm').textContent = `${c.name} · ${realmLabel(c)}`;
  $('brand-mark').textContent = REALMS[c.realm]?.name?.[0] || '道';
  $('turn-line').textContent = `第 ${game.state.turn} 回合 · ${Math.floor(c.age / 12)}岁`;
}

function renderSubhubBar() {
  const bar = $('subhub-bar');
  if (!bar) return;
  const s = game.state;
  const id = s?.scene?.id;
  const c = s?.char;
  const meta = {
    cave: { icon: 'cave', title: `洞府静室 · ${c.caveLevel || 1}阶`, badge: `月修 ${formatNum(Math.round((REALMS[c.realm]?.monthly || 1) * 5))}+`, cls: '' },
    techEquip: { icon: 'book', title: '功法运使', badge: `${activeTechniques(c).length}/${maxTechSlots(c.realm)} 槽`, cls: '' },
    alchemy: { icon: 'pill', title: '丹房开炉', badge: `成丹 ${s.counters?.alchemy || 0}`, cls: 'jade' },
    regionHub: { icon: 'region', title: c.location, badge: `探索 ${Math.min(100, Math.round(c.regionProgress?.[c.regionId] || 0))}%`, cls: 'jade' },
    regionMap: { icon: 'region', title: '九州舆图', badge: `已游 ${(c.visitedLocations || []).length}/8 州`, cls: 'jade' },
    sectHall: { icon: 'sect', title: game.currentSectName(), badge: `贡献 ${formatNum(c.contribution)}`, cls: '' },
    sectMissions: { icon: 'mission', title: '宗门任务堂', badge: `贡献 ${formatNum(c.contribution)}`, cls: '' },
    sectLibrary: { icon: 'book', title: '宗门藏经阁', badge: `贡献 ${formatNum(c.contribution)}`, cls: '' },
    sectTreasury: { icon: 'treasury', title: '宗门宝库', badge: `贡献 ${formatNum(c.contribution)}`, cls: '' },
    sectPromote: { icon: 'promote', title: '晋升考核台', badge: `${SECT_RANKS[c.sectRank || 0]?.name || '外门'}`, cls: '' },
    cityHub: { icon: 'city', title: '仙城坊市', badge: `灵石 ${formatNum(c.stones)}`, cls: '' },
    market: { icon: 'city', title: `${c.location}商行`, badge: `灵石 ${formatNum(c.stones)}`, cls: '' },
    sell: { icon: 'city', title: '出售灵材', badge: `灵石 ${formatNum(c.stones)}`, cls: '' },
    techShop: { icon: 'book', title: '古籍秘阁', badge: `灵石 ${formatNum(c.stones)}`, cls: '' },
    auction: { icon: 'treasury', title: '十年暗拍', badge: `灵石 ${formatNum(c.stones)}`, cls: '' },
    arena: { icon: 'sword', title: '问道擂台', badge: `${s.counters?.arena_win || 0} 胜`, cls: '' },
    tianji: { icon: 'fate', title: '天机潜龙榜', badge: `声望 ${c.reputation}`, cls: 'jade' },
    npcHub: { icon: 'npc', title: '红尘道友', badge: `${NPCS.length} 位名宿`, cls: 'jade' },
    npcDetail: { icon: 'npc', title: '道友论道', badge: `灵石 ${formatNum(c.stones)}`, cls: 'jade' },
  }[id];
  if (!meta || s.scene.result) {
    bar.innerHTML = '';
    return;
  }
  bar.innerHTML = `
    <button type="button" class="subhub-back" data-subhub-back="1">← 主界</button>
    <span class="subhub-title">${PIXEL_ICONS[meta.icon] || ''}${escapeHtml(meta.title)}</span>
    <span class="subhub-badges"><span class="subhub-badge ${meta.cls}">${escapeHtml(meta.badge)}</span></span>
  `;
}

function renderRumorBar() {
  const rumors = game.state.rumors || [];
  const bar = $('rumor-bar');
  const fallback = `【天机阁风闻】${game.state.char.location}灵气微动，四方散修云集。`;
  bar.textContent = rumors[0] || fallback;
}

function renderMobileHud() {
  const c = game.state.char;
  const realm = REALMS[c.realm];
  const expNeed = Number.isFinite(realm.exp) ? Math.round(realm.exp * Math.pow(realm.growth, c.layer)) : Infinity;
  const expPct = expNeed === Infinity ? 100 : Math.min(100, Math.floor((c.exp / expNeed) * 100));
  const hpPct = Math.max(0, Math.min(100, Math.round((c.hp / c.maxHp) * 100)));
  const mpPct = Math.max(0, Math.min(100, Math.round((c.mp / c.maxMp) * 100)));
  const remain = Math.max(0, Math.floor((c.lifespan - c.age) / 12));
  const life = lifespanAlert(c);
  const lifeCls = life.level === 'critical' ? 'c-critical' : life.level === 'warn' ? 'c-warn' : '';
  $('mobile-hud').innerHTML = `
    <div class="mhud-bars">
      <div class="mhud-bar-item c-hp">
        <div class="mhud-bar-head"><span>血</span><b>${formatNum(c.hp)}/${formatNum(c.maxHp)}</b></div>
        <div class="bar hp"><i style="width:${hpPct}%"></i></div>
      </div>
      <div class="mhud-bar-item c-mp">
        <div class="mhud-bar-head"><span>灵</span><b>${formatNum(c.mp)}/${formatNum(c.maxMp)}</b></div>
        <div class="bar mp"><i style="width:${mpPct}%"></i></div>
      </div>
      <div class="mhud-bar-item c-exp">
        <div class="mhud-bar-head"><span>修</span><b>${expPct}%</b></div>
        <div class="bar exp"><i style="width:${expPct}%"></i></div>
      </div>
    </div>
    <div class="mhud-meta">
      <span class="c-gold">石 <b>${formatNum(c.stones)}</b></span>
      <span class="c-jade">攻 <b>${formatNum(game.playerAtk())}</b></span>
      <span class="${lifeCls}">寿 <b>${remain}年</b></span>
      <span>${escapeHtml(c.location)}</span>
      ${c.demon > 0 ? `<span class="c-demon">魔 <b>${Math.round(c.demon)}</b></span>` : ''}
    </div>
  `;
}

function renderSceneBanner() {
  const node = game.currentNode();
  const theme = sceneThemeFor(node, game.state);
  const c = game.state.char;
  pixelStage.setScene({
    theme,
    realm: c.realm,
    rootId: c.rootId,
    sectId: c.sectId,
    petId: c.petId,
    enemyId: game.state.combat?.enemy?.id || null,
    tribStage: game.state.tribulation?.stage || 1,
  });
  const moodMap = {
    combat: 'crimson', tribulation: 'violet', wild: 'jade',
    market: 'amber', auction: 'amber', breakthrough: 'inner', ascend: 'ascend', fall: 'fall',
  };
  fxCanvas.setMood(moodMap[theme.kind] || 'gold');
  $('scene-kicker').textContent = kickerFor(node);
  $('scene-banner-loc').textContent = `${c.location} · ${theme.caption}`;

  const hud = $('scene-combat-hud');
  const banner = $('scene-banner');
  if (game.state.scene.id === 'combat' && game.state.combat) {
    const cb = game.state.combat;
    const pct = Math.max(0, Math.min(100, Math.round((cb.hp / cb.maxHp) * 100)));
    hud.hidden = false;
    banner.classList.add('has-hud');
    hud.innerHTML = `
      <div class="combat-hud-row">
        <b>敌手 · ${escapeHtml(cb.enemy.name)}</b>
        <span>气血 ${Math.max(0, Math.round(cb.hp))} / ${cb.maxHp} · 第 ${cb.turn} 合</span>
      </div>
      <div class="bar hp"><i style="width:${pct}%"></i></div>
    `;
  } else if (game.state.scene.id === 'tribulation' && game.state.tribulation) {
    const t = game.state.tribulation;
    hud.hidden = false;
    banner.classList.add('has-hud');
    hud.innerHTML = `
      <div class="combat-hud-row">
        <b>九霄雷阵 · ${REALMS[c.realm]?.name || ''}之劫</b>
        <span>第 ${t.stage} / ${t.total} 重天雷</span>
      </div>
      <div class="trib-steps">
        ${[1, 2, 3].map((n) => `
          <div class="trib-orb ${n < t.stage ? 'is-done' : n === t.stage ? 'is-now' : ''}">
            ${n < t.stage ? `第${n}重 · 已渡` : n === t.stage ? `第${n}重 · 聚雷` : `第${n}重`}
          </div>
        `).join('')}
      </div>
    `;
  } else {
    hud.hidden = true;
    banner.classList.remove('has-hud');
    hud.innerHTML = '';
  }
}

function kickerFor(node) {
  if (!node) return '九州';
  const id = node.id;
  if (id === 'hub') return game.state.char.location;
  if (id === 'cave' || id === 'techEquip' || id === 'alchemy') return '洞府修行';
  if (id === 'regionHub' || id === 'regionMap') return '九州历练';
  if (id === 'sectHall' || id === 'sectMissions' || id === 'sectLibrary' || id === 'sectTreasury' || id === 'sectPromote') return '仙门大殿';
  if (id === 'cityHub' || id === 'tianji' || id === 'techShop' || id === 'arena') return '仙城坊市';
  if (id === 'npcHub' || id === 'npcDetail') return '红尘道友';
  if (id === 'combat') return '斗法';
  if (id === 'tribulation') return '九霄天劫';
  if (id === 'breakthrough') return '叩关破境';
  if (id === 'auction') return '万宝暗拍';
  if (id === 'market' || id === 'sell') return '灵材商行';
  if (id === 'recruit') return '寻访仙门';
  if (id === 'ending') return '此生终章';
  return node.pool === 'sect' ? '宗门' : node.pool === 'inner' ? '内景' : node.pool === 'story' ? '宿命因果' : '机缘奇遇';
}

function renderBagMarkup() {
  const c = game.state.char;
  if (!c.inventory.length) {
    return '<p class="empty-tip">储物袋空空如也。去坊市/拍卖会置办丹药，或历练摸尸寻些机缘吧。</p>';
  }
  return `<div class="bag-list">${c.inventory.map((it) => {
    const def = ITEM_BY_ID[it.id];
    const usable = Boolean(def?.use || def?.technique);
    const btnText = def?.technique ? '参悟' : def?.type === '符箓' ? '激活' : '服用';
    return `
      <div class="bag-item">
        <div class="bag-item-meta">
          <b>${escapeHtml(def?.name || it.id)}${it.qty > 1 ? ` ×${it.qty}` : ''}</b>
          <span>${escapeHtml(def?.desc || '')}</span>
        </div>
        ${usable
          ? `<button type="button" class="bag-use-btn" data-use-item="${it.id}">${btnText}</button>`
          : `<span class="bag-badge">${escapeHtml(def?.type || '物品')}</span>`}
      </div>`;
  }).join('')}</div>`;
}

function renderCharPanel() {
  const c = game.state.char;
  const root = ROOT_BY_ID[c.rootId];
  const realm = REALMS[c.realm];
  const sect = c.sectId ? SECT_BY_ID[c.sectId] : null;
  const rankName = sect ? (SECT_RANKS[c.sectRank || 0]?.name || '外门弟子') : '散修';
  const region = REGION_BY_ID[c.regionId] || REGION_BY_ID.qingniu;
  const regionProg = Math.min(100, Math.round(c.regionProgress?.[region.id] || 0));
  const gf = c.goldenFingerId ? GOLDEN_FINGER_BY_ID[c.goldenFingerId] : null;
  const pet = c.petId ? PET_BY_ID[c.petId] : null;
  const expNeed = Number.isFinite(realm.exp) ? Math.round(realm.exp * Math.pow(realm.growth, c.layer)) : Infinity;
  const expPct = expNeed === Infinity ? 100 : Math.min(100, Math.floor((c.exp / expNeed) * 100));
  const lifePct = Math.min(100, Math.floor((c.age / c.lifespan) * 100));

  const attrs = Object.entries(c.attrs)
    .map(([k, v]) => `<div class="attr"><span>${k}</span><b>${Math.round(v)}</b></div>`)
    .join('');

  const daoBase = DAO_BASE_QUALITIES.find((q) => q.id === c.daoBaseQuality);
  const goldCore = GOLDEN_CORE_QUALITIES.find((q) => q.id === c.goldenCoreQuality);
  const lawTags = Object.entries(c.laws || {})
    .filter(([, lvl]) => lvl > 0)
    .map(([id, lvl]) => `<span class="tag gold">${escapeHtml(LAW_BY_ID[id]?.name || id)} · ${LAW_STAGES[lvl]}</span>`)
    .join('');

  const activeSet = new Set(activeTechniques(c).map((t) => t.id));
  const conflict = techAlignmentConflict(c);
  const life = lifespanAlert(c);
  const lifeBarCls = life.level === 'critical' ? 'is-critical' : life.level === 'warn' ? 'is-warn' : '';
  const tBonus = titleBonuses(c);
  const titles = (c.titles || []).slice(-6).map((t) => `<span class="tag gold">${escapeHtml(t)}</span>`).join('');
  const techs = (c.techniques || []).map((t) => {
    const on = activeSet.has(t.id);
    return `<span class="tag ${on ? 'gold' : 'jade'}" title="${on ? '运使中' : '藏经簿'}">${on ? '★' : ''}${escapeHtml(t.name)}</span>`;
  }).join('');
  const buffs = [];
  if (game.state.buffs?.breakBonus) buffs.push(`<span class="tag gold">破境 +${Math.round(game.state.buffs.breakBonus)}%</span>`);
  if (game.state.buffs?.shield) buffs.push(`<span class="tag jade">护心金光 ×${game.state.buffs.shield}</span>`);
  if (game.state.buffs?.escape) buffs.push(`<span class="tag jade">神行遁符 ×${game.state.buffs.escape}</span>`);

  const rels = Object.entries(c.relations || {})
    .filter(([, v]) => v !== 0)
    .map(([k, v]) => `<div class="stat-line"><span>${escapeHtml(k)}</span><b>${v > 0 ? `+${v}` : v}</b></div>`)
    .join('');

  $('char-panel').innerHTML = `
    <div class="rail-head"><h3>道躯</h3><span class="rail-sub">${c.gender} · ${c.originId ? originName(c.originId) : ''} · 第${game.state.meta.cycle || 1}世</span></div>
    <div class="char-header">
      <canvas id="char-portrait" class="char-portrait" width="44" height="44" aria-label="像素角色像"></canvas>
      <div>
        <h2 class="char-name">${escapeHtml(c.name)}</h2>
        <div class="char-sub">${realmLabel(c)}<span class="dot">·</span><span style="color:${gradeColor(root?.grade)}">${root?.name || '凡体'}</span><span class="dot">·</span>${c.sectId ? `${escapeHtml(game.currentSectName())}·${c.sectId === 'player_sect' ? '开山祖师' : rankName}` : '散修'}</div>
      </div>
    </div>

    <div class="meter">
      <div class="meter-top"><span>修为</span><b>${formatNum(c.exp)} / ${formatNum(expNeed)}</b></div>
      <div class="bar exp"><i style="width:${expPct}%"></i></div>
    </div>
    <div class="meter">
      <div class="meter-top"><span>气血</span><b>${formatNum(c.hp)} / ${formatNum(c.maxHp)}</b></div>
      <div class="bar hp"><i style="width:${Math.max(0, (c.hp / c.maxHp) * 100)}%"></i></div>
    </div>
    <div class="meter">
      <div class="meter-top"><span>灵力</span><b>${formatNum(c.mp)} / ${formatNum(c.maxMp)}</b></div>
      <div class="bar mp"><i style="width:${Math.max(0, (c.mp / c.maxMp) * 100)}%"></i></div>
    </div>
    ${c.demon > 0 ? `
    <div class="meter">
      <div class="meter-top"><span>心魔</span><b>${Math.round(c.demon)} / 100</b></div>
      <div class="bar demon"><i style="width:${c.demon}%"></i></div>
    </div>` : ''}
    <div class="meter">
      <div class="meter-top"><span>寿元${life.level !== 'ok' ? `（${life.level === 'critical' ? '大限将至!' : '余寿告急'}）` : ''}</span><b class="${life.level === 'critical' ? 'c-critical' : life.level === 'warn' ? 'c-warn' : ''}">${Math.floor(c.age / 12)} / ${Math.floor(c.lifespan / 12)} 岁</b></div>
      <div class="bar life ${lifeBarCls}"><i style="width:${lifePct}%"></i></div>
    </div>

    <div class="panel-block">
      <h4>战力与根基</h4>
      <div class="stat-line"><span>攻 / 术 / 防</span><b style="color:var(--gold)">${formatNum(game.playerAtk())} / ${formatNum(game.playerSpellAtk())} / ${formatNum(game.playerDef())}</b></div>
      <div class="stat-line"><span>境界倍率</span><b>×${realm.powerMult} · 根基 ×${qualityMultiplier(c).toFixed(2)}</b></div>
      <div class="stat-line"><span>功法槽位</span><b style="${conflict.conflict ? 'color:#ff7163' : ''}">${activeSet.size} / ${maxTechSlots(c.realm)} 运使${conflict.conflict ? '（正邪冲突!）' : ''}</b></div>
      <div class="stat-line"><span>洞府灵脉</span><b>${c.caveLevel || 1} 阶（+${Math.round(((c.caveLevel || 1) - 1) * 18)}%）</b></div>
      ${daoBase ? `<div class="stat-line"><span>道基品质</span><b style="color:var(--jade)">${daoBase.name}</b></div>` : ''}
      ${goldCore ? `<div class="stat-line"><span>金丹品阶</span><b style="color:var(--gold)">${goldCore.name}</b></div>` : ''}
      <div class="stat-line"><span>所在州域</span><b>${escapeHtml(region.name)}（${regionProg}%）</b></div>
    </div>

    ${gf ? `<div class="panel-block"><h4>伴生机缘</h4><div class="gf-pill-card"><b>${escapeHtml(gf.name)}（${escapeHtml(gf.tag)}）</b><span>${escapeHtml(gf.perk)}</span></div></div>` : ''}

    <div class="panel-block">
      <h4>根骨六维</h4>
      <div class="attr-grid">${attrs}</div>
    </div>

    <div class="panel-block">
      <h4>身家法宝</h4>
      <div class="stat-line"><span>本命法宝</span><b style="color:var(--gold)">${escapeHtml(c.artifactName || '无名青锋')} (+${c.artifactLevel || 0})</b></div>
      ${pet ? `<div class="stat-line"><span>伴生灵兽</span><b style="color:var(--jade)">${escapeHtml(pet.name)}（${c.petLevel || 1}阶）</b></div>` : ''}
      <div class="stat-line"><span>灵石</span><b>${c.stones.toLocaleString()}</b></div>
      <div class="stat-line"><span>声望</span><b>${c.reputation}</b></div>
      <div class="stat-line"><span>业力</span><b>${c.karma}</b></div>
      ${sect ? `<div class="stat-line"><span>宗门贡献</span><b>${c.contribution.toLocaleString()}</b></div>` : ''}
      ${c.injuries ? `<div class="stat-line"><span>伤势</span><b style="color:#f28c7b">${c.injuries}</b></div>` : ''}
    </div>

    ${lawTags ? `<div class="panel-block"><h4>天地法则</h4><div class="tag-row">${lawTags}</div></div>` : ''}
    ${buffs.length ? `<div class="panel-block"><h4>护持</h4><div class="tag-row">${buffs.join('')}</div></div>` : ''}
    ${techs ? `<div class="panel-block"><h4>功法传承</h4><div class="tag-row">${techs}</div></div>` : ''}
    ${rels ? `<div class="panel-block"><h4>红尘羁绊</h4>${rels}</div>` : ''}
    ${titles ? `<div class="panel-block"><h4>名号${tBonus.atk || tBonus.speed || tBonus.lifespan ? `（攻+${Math.round(tBonus.atk * 100)}% 速+${Math.round(tBonus.speed * 100)}%）` : ''}</h4><div class="tag-row">${titles}</div></div>` : ''}
  `;

  renderPixelPortrait($('char-portrait'), c);
}

function renderRightPanel() {
  const c = game.state.char;
  const bagWrap = $('right-bag-wrap');
  bagWrap.innerHTML = `
    <div class="rail-head" style="margin-bottom:0.55rem">
      <h3>储物袋</h3>
      <span class="rail-sub">${c.inventory.length} 种</span>
    </div>
    ${renderBagMarkup()}
  `;

  const list = $('log-list');
  const allEntries = (game.state.log || []).slice().reverse();
  const shown = ui.logExpand ? allEntries : allEntries.slice(0, 24);
  const toolsHtml = allEntries.length > 0
    ? `<div class="log-tools">
        <button type="button" class="mini" data-log-act="toggle">${ui.logExpand ? '仅看近期(24)' : `展开全部(${allEntries.length})`}</button>
        <button type="button" class="mini" data-log-act="export">导出传记.txt</button>
      </div>`
    : '';
  if (!shown.length) {
    list.innerHTML = `<li><b>踏入仙途 · 初抵${escapeHtml(c.location)}</b><time>${ageLabel(c.age)}</time></li>`;
  } else {
    list.innerHTML = toolsHtml + shown
      .map((l) => `<li><b>${escapeHtml(l.t)}</b><time>${ageLabel(l.at)}</time></li>`)
      .join('');
  }
  $('log-sub').textContent = `${Math.floor(c.age / 12)}岁 · ${allEntries.length}条`;
}

function originName(id) {
  return ORIGINS.find((o) => o.id === id)?.name || '';
}

function renderStory(deltas = []) {
  const text = game.currentText();
  const node = game.currentNode();
  $('scene-title').textContent = node?.title || '';
  $('delta-strip').innerHTML = deltas
    .map((d) => `<span class="delta-pill ${d.kind}">${escapeHtml(d.text)}</span>`)
    .join('');

  $('scene-lines').innerHTML = (game.state.scene.result?.lines || [])
    .filter(Boolean)
    .map((l) => `<span>${escapeHtml(l)}</span>`)
    .join('');

  const el = $('scene-text');
  el.textContent = text;
  el.classList.remove('is-reveal');
  void el.offsetWidth;
  el.classList.add('is-reveal');
  renderChoices();
}

function choiceIconFor(ch) {
  const map = {
    breakthrough: 'breakthrough', revisitGate: 'breakthrough',
    openCave: 'cave', cultivate: 'cave', comprehend: 'book', settle: 'pill', openAlchemy: 'pill', brewRecipe: 'pill', alchemy: 'pill', refine: 'sword', upgradeCave: 'vein', feedPet: 'npc', preach: 'fate', recruitDisciple: 'sect', openTechEquip: 'book', toggleTechEquip: 'book', bottleRipen: 'pill', bloodCultivate: 'art',
    openRegion: 'region', regionExplore: 'region', regionHunt: 'sword', regionVein: 'vein', secretRealm: 'region', openRegionMap: 'region', gotoRegion: 'region',
    openSectHall: 'sect', sectRecruit: 'sect', joinSect: 'sect', upgradePlayerSect: 'vein', collectTribute: 'treasury',
    openSectMissions: 'mission', runSectMission: 'mission', sectTask: 'mission',
    openSectLibrary: 'book', buySectManual: 'book',
    openSectTreasury: 'treasury', buySectTreasury: 'treasury',
    sectVein: 'vein', openSectPromote: 'promote', sectPromote: 'promote',
    openCity: 'city', market: 'city', buyItem: 'city', sellMenu: 'city', sellItem: 'city', openTechShop: 'book', buyWorldTech: 'book', auction: 'treasury', bidItem: 'treasury', openArena: 'sword', arenaFight: 'sword', openTianji: 'fate',
    openNpcHub: 'npc', openNpc: 'npc', npcChat: 'npc', npcGift: 'treasury', npcSpar: 'sword', npcTeach: 'book', npcBond: 'npc',
    fate: 'fate',
    combatAttack: 'sword', combatSpell: 'spell', combatArt: 'art', combatGuard: 'guard', combatPill: 'pill', combatFlee: 'flee',
  };
  const key = map[ch.action];
  return key ? PIXEL_ICONS[key] : null;
}

function renderChoices() {
  const wrap = $('choices');
  wrap.innerHTML = '';
  const list = game.choices();
  const gridScenes = new Set(['hub', 'cave', 'regionHub', 'sectHall', 'cityHub', 'npcHub']);
  const isHubGrid = gridScenes.has(game.state.scene.id) && !game.state.scene.result && list.length > 3;
  wrap.classList.toggle('is-hub-grid', isHubGrid);
  list.forEach((ch, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'choice' + (ch.effect === 'primary' || ch.effect === 'highlight' ? ' is-primary' : '');
    btn.disabled = Boolean(ch.disabled);
    btn.dataset.index = String(i);
    const reason = ch.disabled && ch.reason ? ` <span class="reason">（${escapeHtml(ch.reason)}）</span>` : '';
    const iconSvg = choiceIconFor(ch);
    btn.innerHTML = `
      ${iconSvg ? `<span class="choice-icon" aria-hidden="true">${iconSvg}</span>` : `<span class="num">${i + 1}</span>`}
      <span class="choice-main">
        <span class="label">${escapeHtml(ch.label)}</span>
        ${ch.hint ? `<span class="hint">${escapeHtml(ch.hint)}${reason}</span>` : reason ? `<span class="hint">${reason}</span>` : ''}
      </span>
      <span class="arrow" aria-hidden="true">▶</span>`;
    btn.addEventListener('click', () => pick(i));
    wrap.appendChild(btn);
  });
}

function ageLabel(months) {
  return `${Math.floor(months / 12)}岁 · ${(months % 12) + 1}月`;
}

function pick(index) {
  const prev = snapshotChar();
  const res = game.choose(index);
  handleResult(res, prev);
}

function handleResult(res, prev = null) {
  if (res?.error) { toast(res.error); return; }
  if (res?.reincarnate) { startReincarnation(res.meta); return; }

  const curr = snapshotChar();
  const deltas = computeDeltas(prev || ui.lastSnapshot, curr);
  ui.lastSnapshot = curr;

  const fx = game.state.scene.result?.fx || game.state.scene.fx || null;
  if (game.state.scene.fx) delete game.state.scene.fx;
  if (fx) {
    triggerScreenFx(fx);
    fxCanvas.burst(fx);
    pixelStage.triggerFx(fx);
    sfx.play(fx);
  } else if (curr && prev && (curr.realm > prev.realm || curr.layer > prev.layer)) {
    triggerScreenFx('breakthrough');
    fxCanvas.burst('breakthrough');
    pixelStage.triggerFx('breakthrough');
    sfx.play('breakthrough');
  } else {
    sfx.play('click');
  }

  store.save(0, game);
  renderAll(deltas);
  announceNewAchievements();
  scrollStory();
}

function scrollStory() {
  const sc = $('story-scroll');
  if (sc) sc.scrollTop = 0;
}

function announceNewAchievements() {
  const meta = game.state.meta.achievements || {};
  const now = Object.keys(meta).length;
  if (ui.lastAchCount == null) { ui.lastAchCount = now; return; }
  if (now > ui.lastAchCount) {
    const newest = ACHIEVEMENTS.filter((a) => meta[a.id]).slice(-1)[0];
    if (newest) {
      toast(`道途留名 · ${newest.name}`, 'gold');
      sfx.play('chime');
    }
    ui.lastAchCount = now;
  }
}

function startReincarnation(meta) {
  store.saveMeta(meta);
  game.state = null;
  ui.rolledRoot = null;
  ui.originId = null;
  ui.rerollUsed = false;
  ui.lastSnapshot = null;
  $('btn-roll').disabled = true;
  document.querySelectorAll('.origin-card').forEach((c) => c.classList.remove('is-active'));
  $('create-hint').textContent = `第 ${meta.cycle || 1} 世 · 轮回点 ${meta.karmaPoints || 0}。重择出身与伴生机缘，再问仙途。`;
  renderTalents();
  seedTitleMeta();
  showScreen('create');
  sfx.play('breakthrough');
  toast('一碗忘川水落肚，前尘如烟散尽，唯有一缕道心长存。', 'gold');
}

/* ---------------------------------- 移动端导航 / 储物使用 ---------------------------------- */

function setMobileTab(tab) {
  if (tab === 'codex') { openCodex(); return; }
  ui.mobileTab = tab;
  $('game-screen').dataset.mobileTab = tab;
  document.querySelectorAll('#mobile-nav .mnav-btn').forEach((b) => {
    b.classList.toggle('is-active', b.dataset.mtab === tab);
  });
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function wireMobileNav() {
  const navIconMap = { story: 'cave', char: 'char', bag: 'bag', log: 'log', codex: 'codex' };
  document.querySelectorAll('#mobile-nav .mnav-btn').forEach((btn) => {
    const glyph = btn.querySelector('.mnav-glyph');
    const icon = PIXEL_ICONS[navIconMap[btn.dataset.mtab]];
    if (glyph && icon) glyph.innerHTML = icon;
  });

  $('mobile-nav').addEventListener('click', (e) => {
    const btn = e.target.closest('.mnav-btn');
    if (!btn) return;
    sfx.play('click');
    setMobileTab(btn.dataset.mtab);
  });

  $('subhub-bar')?.addEventListener('click', (e) => {
    if (!e.target.closest('[data-subhub-back]') || !game.state) return;
    sfx.play('click');
    game.act_backHub();
    renderAll();
  });

  $('log-list')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-log-act]');
    if (!btn || !game.state) return;
    if (btn.dataset.logAct === 'toggle') {
      ui.logExpand = !ui.logExpand;
      renderRightPanel();
    } else if (btn.dataset.logAct === 'export') {
      const c = game.state.char;
      const header = `《问道长生》修仙传记 · ${c.name}（${realmLabel(c)} · ${Math.floor(c.age / 12)}岁）\n========================================\n`;
      const body = (game.state.log || []).map((l) => `[${ageLabel(l.at)}] ${l.t}`).join('\n');
      const blob = new Blob([header + body], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wendao-biography-${c.name}.txt`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      toast('修仙传记已导出', 'gold');
    }
  });

  $('right-bag-wrap').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-use-item]');
    if (!btn || !game.state) return;
    const prev = snapshotChar();
    const res = game.useInventoryItem(btn.dataset.useItem);
    if (res?.error) { toast(res.error); return; }
    const curr = snapshotChar();
    const deltas = computeDeltas(prev, curr);
    ui.lastSnapshot = curr;
    if (res.fx) {
      triggerScreenFx(res.fx);
      fxCanvas.burst(res.fx);
      sfx.play(res.fx);
    }
    store.save(0, game);
    renderAll(deltas);
    announceNewAchievements();
    toast(res.lines?.join(' · ') || '已使用', 'gold');
  });
}

/* ---------------------------------- 顶栏 / 弹层 ---------------------------------- */

function wireTopbar() {
  $('btn-sound').addEventListener('click', () => {
    const on = sfx.toggle();
    syncPreferenceButtons();
    toast(on ? '仙音已启' : '已归静默');
  });
  $('btn-save').addEventListener('click', () => openSave('save'));
  $('btn-load').addEventListener('click', () => openSave('load'));
  $('btn-codex').addEventListener('click', () => openCodex());
  $('btn-menu').addEventListener('click', () => { $('menu-body').innerHTML = ''; $('menu-overlay').hidden = false; });
}

function wireOverlays() {
  document.querySelectorAll('[data-close]').forEach((btn) => {
    btn.addEventListener('click', () => { $(btn.dataset.close).hidden = true; });
  });
  document.querySelectorAll('.overlay').forEach((ov) => {
    ov.addEventListener('click', (e) => { if (e.target === ov) ov.hidden = true; });
  });

  $('slot-list').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-slot]');
    if (!btn) return;
    const slot = Number(btn.dataset.slot);
    if (btn.dataset.act === 'save') {
      store.save(slot, game);
      renderSlots();
      sfx.play('chime');
      toast(`已存入${slot === 0 ? '自动' : `第 ${slot} 号`}存档`, 'gold');
    } else if (btn.dataset.act === 'load') {
      const data = store.load(slot);
      if (!data) return;
      game.setState(data.state);
      $('save-overlay').hidden = true;
      showScreen('game');
      setMobileTab('story');
      ui.lastAchCount = Object.keys(game.state.meta.achievements || {}).length;
      ui.lastSnapshot = snapshotChar();
      renderAll();
      sfx.play('chime');
      toast('光阴倒转，回到彼时。', 'gold');
    } else if (btn.dataset.act === 'del') {
      store.remove(slot);
      renderSlots();
      toast('存档已抹去');
    }
  });

  $('btn-export').addEventListener('click', () => { if (game.state) store.exportToFile(game); });
  $('import-file').addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = store.importFromText(await file.text());
      game.setState(data.state);
      $('save-overlay').hidden = true;
      showScreen('game');
      setMobileTab('story');
      ui.lastSnapshot = snapshotChar();
      renderAll();
      sfx.play('chime');
      toast('存档已载入。', 'gold');
    } catch {
      toast('这个文件读不出来，请确认是有效的 JSON 存档。');
    }
    e.target.value = '';
  });

  $('codex-tabs').addEventListener('click', (e) => {
    const tab = e.target.closest('.tab');
    if (!tab) return;
    sfx.play('click');
    document.querySelectorAll('#codex-tabs .tab').forEach((t) => t.classList.remove('is-active'));
    tab.classList.add('is-active');
    ui.codexTab = tab.dataset.tab;
    renderCodex();
  });

  $('menu-restart').addEventListener('click', () => {
    $('menu-overlay').hidden = true;
    if (confirm('重开一世？当前进度会自动存入自动存档槽。')) {
      if (game.state) store.save(0, game);
      game.state = null;
      ui.lastAchCount = null;
      ui.lastSnapshot = null;
      renderTalents();
      showScreen('create');
    }
  });
  $('menu-title').addEventListener('click', () => {
    $('menu-overlay').hidden = true;
    if (game.state && !game.state.flags.finished) store.save(0, game);
    seedTitleMeta();
    showScreen('title');
  });
  $('menu-help').addEventListener('click', () => {
    $('menu-body').innerHTML = `
      <h4>六大支柱 · 百小时长生路</h4>
      <p><b>洞府修行</b>：吐纳炼气、闭关苦修、参悟十道天地法则、开炉炼丹与祭炼本命法宝。<br>
      <b>九州历练</b>：八大梯度灵域（青牛山脉→九霄天门），探索州域进度、猎妖历战、闯古境。<br>
      <b>仙门大殿</b>：十三宗皆设独立任务堂、藏经阁（四阶功法与专属战斗神通）、宗门宝库、灵脉聚灵阵与五阶晋升考核。<br>
      <b>仙城坊市与红尘道友</b>：随州域进化的灵材商行、万宝阁暗拍、天机阁潜龙榜，以及六位常驻名修论道赠礼与结侣。</p>
      <h4>境界瓶颈与战力跃迁</h4>
      <p>十重境界战力指数跃迁（1× 至 10,000×），筑基道基与九纹金丹品质永久铭刻；元婴之后须领悟天地法则方可叩开化神至真仙大门。</p>
      <h4>双端操作</h4>
      <p>电脑支持 1–9 选择、空格继续、S/L 存读档、C 图鉴；手机固定单屏布局，底部五栏切换问道、道躯、储物、行止与图鉴。</p>
    `;
  });
  $('menu-about').addEventListener('click', () => {
    $('menu-body').innerHTML = `
      <h4>关于《问道长生》v5.0 · 大千世界</h4>
      <p>16-bit HD-2D 国风像素仙侠 RPG × inkle/ink 互动叙事引擎，实时像素画布随八大州域、十重境界、宗门与灵兽动态演化。</p>
      <p>内置 1,090+ 叙事节点、123 重独立结局、142 部功法典籍、105 种奇珍丹器、66 类特性敌手、12 位红尘道友、八大九州灵域、十三宗六阶大殿与 270 项成就。</p>
    `;
  });
}

function openSave(mode) {
  if (!game.state && mode === 'save') return;
  ui.saveMode = mode;
  $('save-title').textContent = mode === 'save' ? '玉简存档' : '光阴读档';
  $('save-overlay').hidden = false;
  renderSlots();
}

function renderSlots() {
  const list = store.list();
  $('slot-list').innerHTML = list
    .map((s) => {
      const name = s.slot === 0 ? '自动存档' : `第 ${s.slot} 号玉简`;
      const rootName = s.info?.rootId ? (ROOT_BY_ID[s.info.rootId]?.name || '') : '';
      const sectName = s.info?.sectId ? (SECT_BY_ID[s.info.sectId]?.name || '散修') : '散修';
      const info = s.info
        ? `${escapeHtml(s.info.name)} · ${s.info.realm}${rootName ? ` · ${rootName}` : ''} · ${sectName} · ${s.info.age}岁 · 第${s.info.turn}回合`
        : '空玉简';
      const date = s.savedAt ? new Date(s.savedAt).toLocaleString('zh-CN') : '';
      const loadBtn = !s.empty ? `<button class="mini" data-act="load" data-slot="${s.slot}">读取</button>` : '';
      const saveBtn = ui.saveMode === 'save' ? `<button class="mini" data-act="save" data-slot="${s.slot}">存入</button>` : '';
      const delBtn = !s.empty ? `<button class="mini" data-act="del" data-slot="${s.slot}">抹除</button>` : '';
      return `
        <div class="slot">
          <div class="slot-info"><b>${name}</b><span>${info}${date ? ` · ${date}` : ''}</span></div>
          <div class="slot-actions">${saveBtn}${loadBtn}${delBtn}</div>
        </div>`;
    })
    .join('');
}

function openCodex() {
  $('codex-overlay').hidden = false;
  renderCodex();
}

function renderCodex() {
  const body = $('codex-body');
  const sum = $('codex-summary');
  const meta = game.state?.meta || store.meta() || { achievements: {}, unlockedEndings: [], rootsSeen: [], sectsJoined: [] };

  if (ui.codexTab === 'achievements') {
    const unlockedCount = ACHIEVEMENTS.filter((a) => meta.achievements?.[a.id]).length;
    const hiddenTotal = ACHIEVEMENTS.filter((a) => a.hidden).length;
    sum.textContent = `已印证 ${unlockedCount} / ${ACHIEVEMENTS.length}（含 ${hiddenTotal} 项隐藏成就）`;
    body.innerHTML = `<div class="ach-grid">${ACHIEVEMENTS.map((a) => {
      const got = Boolean(meta.achievements?.[a.id]);
      const hidden = a.hidden && !got;
      return `<div class="ach ${got ? 'done' : 'locked'}">
        <b>${hidden ? '？？？' : escapeHtml(a.name)}</b>
        <p>${hidden ? '隐藏成就，待机缘印证。' : escapeHtml(a.desc)}</p>
      </div>`;
    }).join('')}</div>`;
  } else if (ui.codexTab === 'endings') {
    const unlocked = meta.unlockedEndings || [];
    sum.textContent = `已抵达 ${unlocked.length} / ${ENDINGS.length} 重结局`;
    body.innerHTML = `<div class="ach-grid">${ENDINGS.map((e) => {
      const got = unlocked.includes(e.id);
      const hidden = e.hidden && !got;
      return `<div class="ach ${got ? 'done' : 'locked'}">
        <b>${hidden ? '？？？' : escapeHtml(e.name)}${!hidden && e.tier ? ` · ${e.tier}` : ''}</b>
        <p>${hidden ? '尚未抵达的隐藏终章。' : escapeHtml(e.summary)}</p>
      </div>`;
    }).join('')}</div>`;
  } else if (ui.codexTab === 'roots') {
    const seen = new Set(meta.rootsSeen || []);
    sum.textContent = `历世已觉醒 ${seen.size} / ${ROOTS.length} 种灵根`;
    body.innerHTML = `<div class="ach-grid">${ROOTS.map((r) => {
      const got = seen.has(r.id);
      const pct = ((r.weight / ROOT_WEIGHT_TOTAL) * 100).toFixed(r.weight < 1 ? 2 : 1);
      return `<div class="ach ${got ? 'done' : 'locked'}">
        <b style="color:${gradeColor(r.grade)}">${escapeHtml(r.name)} · ${r.grade}品</b>
        <p>${escapeHtml(r.desc)}</p>
        <small>修炼 ×${r.speed} · 突破 ${r.breakBonus >= 0 ? '+' : ''}${r.breakBonus}% · 概率 ${pct}%</small>
      </div>`;
    }).join('')}</div>`;
  } else if (ui.codexTab === 'sects') {
    const joined = new Set(meta.sectsJoined || []);
    sum.textContent = `历世已拜入 ${joined.size} / ${SECTS.length} 座仙门`;
    body.innerHTML = `<div class="ach-grid">${SECTS.map((s) => {
      const got = joined.has(s.id);
      return `<div class="ach ${got ? 'done' : 'locked'}">
        <b>${escapeHtml(s.name)}（${s.align}）</b>
        <p>${escapeHtml(s.desc)}</p>
        <small>条件：${escapeHtml(s.requirement)} · 传承：${escapeHtml(s.technique)}</small>
      </div>`;
    }).join('')}</div>`;
  } else if (ui.codexTab === 'techniques') {
    const owned = new Set((game.state?.char?.techniques || []).map((t) => t.id));
    sum.textContent = `本世已参悟 ${owned.size} / ${ALL_TECHNIQUES.length} 部九州功法（宗门 78 + 九州散落 64）`;
    body.innerHTML = `<div class="ach-grid">${ALL_TECHNIQUES.map((t) => {
      const got = owned.has(t.id);
      return `<div class="ach ${got ? 'done' : 'locked'}">
        <b style="color:${gradeColor(t.grade)}">${escapeHtml(t.name)} · ${t.grade}品</b>
        <p>${escapeHtml(t.desc)}</p>
        <small>来源：${escapeHtml(t.source || '九州秘传')} · 绝招「${escapeHtml(t.artName || '无')}」</small>
      </div>`;
    }).join('')}</div>`;
  } else {
    const progMap = game.state?.char?.regionProgress || {};
    const visited = new Set(game.state?.char?.visitedLocations || []);
    sum.textContent = `已踏足 ${visited.size} / ${REGIONS.length} 大九州灵域`;
    body.innerHTML = `<div class="ach-grid">${REGIONS.map((r) => {
      const pct = Math.min(100, Math.round(progMap[r.id] || 0));
      const got = visited.has(r.name) || pct > 0;
      return `<div class="ach ${got ? 'done' : 'locked'}">
        <b>${escapeHtml(r.name)}（探索 ${pct}%）</b>
        <p>${escapeHtml(r.desc)}</p>
        <small>门槛：${REALMS[r.minRealm]?.name || '炼气'}境 · 危险：${'★'.repeat(r.danger)} · ${escapeHtml(r.specialty)}</small>
      </div>`;
    }).join('')}</div>`;
  }
}

/* ---------------------------------- 键盘 / 调试 ---------------------------------- */

function wireKeyboard() {
  document.addEventListener('keydown', (e) => {
    if (e.target instanceof HTMLInputElement) return;
    if (e.key === 'Escape') {
      document.querySelectorAll('.overlay').forEach((ov) => { ov.hidden = true; });
      return;
    }
    if ($('game-screen').hidden) return;
    if (document.querySelector('.overlay:not([hidden])')) return;
    if (e.key === 's' || e.key === 'S') { e.preventDefault(); openSave('save'); return; }
    if (e.key === 'l' || e.key === 'L') { e.preventDefault(); openSave('load'); return; }
    if (e.key === 'c' || e.key === 'C') { e.preventDefault(); openCodex(); return; }
    if (e.key >= '1' && e.key <= '9') {
      const idx = Number(e.key) - 1;
      const btns = [...document.querySelectorAll('#choices .choice')];
      const btn = btns[idx];
      if (btn && !btn.disabled) { e.preventDefault(); btn.click(); }
    } else if (e.key === ' ' || e.key === 'Enter') {
      const btns = [...document.querySelectorAll('#choices .choice:not(:disabled)')];
      if (btns.length === 1) { e.preventDefault(); btns[0].click(); }
    }
  });
}

function toast(text, kind = '') {
  const el = document.createElement('div');
  el.className = `toast ${kind}`;
  el.textContent = text;
  $('toast-stack').appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function exposeDebug() {
  window.__game = game;
  window.advanceTime = () => {};
  window.render_game_to_text = () => JSON.stringify({
    screen: $('game-screen').hidden ? ($('create-screen').hidden ? 'title' : 'create') : 'game',
    scene: game.state?.scene?.id || null,
    title: game.currentNode()?.title || null,
    text: (game.state ? game.currentText() : '').slice(0, 600),
    choices: game.state ? game.choices().map((c) => ({ label: c.label, disabled: c.disabled, reason: c.reason })) : [],
    char: game.state ? {
      name: game.state.char.name,
      realm: game.state.char.realm,
      layer: game.state.char.layer,
      age: Math.floor(game.state.char.age / 12),
      root: game.state.char.rootId,
      sect: game.state.char.sectId,
      sectRank: game.state.char.sectRank || 0,
      regionId: game.state.char.regionId || 'qingniu',
      atk: game.playerAtk(),
      def: game.playerDef(),
      laws: game.state.char.laws || {},
      goldenFinger: game.state.char.goldenFingerId,
      pet: game.state.char.petId,
      artifactLevel: game.state.char.artifactLevel || 0,
      hp: Math.round(game.state.char.hp),
      exp: Math.round(game.state.char.exp),
      stones: game.state.char.stones,
      demon: game.state.char.demon,
    } : null,
    achievements: game.state ? Object.keys(game.state.meta.achievements || {}).length : 0,
    result: game.state?.scene?.result?.text || null,
    mobileTab: ui.mobileTab,
    debug: true,
  });
  window.__debugStart = (opts = {}) => {
    startRun({
      name: opts.name || '测试', gender: '女',
      originId: opts.originId || 'farmer',
      rootId: opts.rootId || 'shuangling',
      goldenFingerId: opts.goldenFingerId || 'gf_bottle',
    });
    return window.render_game_to_text();
  };
  window.__render = () => { renderAll(); return true; };
  window.__debugRealm = (realm, layer = 0) => {
    const c = game.state.char;
    c.realm = realm;
    c.layer = layer;
    c.exp = 0;
    c.lifespan = Math.max(c.lifespan, Math.round((80 + REALMS[realm].lifespan) * 12));
    recomputeDerived(c);
    c.hp = c.maxHp;
    c.mp = c.maxMp;
    renderAll();
    return realmLabel(c);
  };
}

boot();
