import { Game } from './engine/game.js';
import { SaveStore } from './engine/save.js';
import { ROOTS, ROOT_BY_ID, GRADE_ORDER, ROOT_WEIGHT_TOTAL } from './data/roots.js';
import { ORIGINS } from './data/origins.js';
import { REALMS, realmLabel } from './data/realms.js';
import { SECTS, SECT_BY_ID, sectRank } from './data/sects.js';
import { ACHIEVEMENTS } from './data/achievements.js';
import { ENDINGS } from './data/endings.js';
import { ITEM_BY_ID } from './data/items.js';
import { TALENTS } from './data/talents.js';
import { SpiritCanvas, SoundFX, sceneArtFor, triggerScreenFx } from './ui/fx.js';

const $ = (id) => document.getElementById(id);
const store = new SaveStore();
const game = new Game({ meta: store.meta() || {} });
const fxCanvas = new SpiritCanvas($('fx-canvas'));
const sfx = new SoundFX();

const SPEED_MODES = [
  { id: 'normal', label: '墨', title: '文字速度：从容（点此切换）', ms: 16, div: 220 },
  { id: 'fast', label: '快', title: '文字速度：疾书（点此切换）', ms: 10, div: 75 },
  { id: 'instant', label: '瞬', title: '文字速度：瞬显（点此切换）', ms: 0, div: 1 },
];

const ui = {
  originId: null,
  gender: '女',
  rolledRoot: null,
  rerollUsed: false,
  typing: null,
  codexTab: 'achievements',
  saveMode: 'save',
  mobileTab: 'story',
  lastArtSrc: '',
  lastAchCount: null,
  lastSnapshot: null,
  speedIdx: 0,
};

try {
  const savedSpeed = Number(localStorage.getItem('wendao.v3.speed') || 0);
  if (savedSpeed >= 0 && savedSpeed < SPEED_MODES.length) ui.speedIdx = savedSpeed;
} catch { /* ignore */ }

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
  const sp = SPEED_MODES[ui.speedIdx];
  const btnSpeed = $('btn-speed');
  if (btnSpeed) {
    btnSpeed.textContent = sp.label;
    btnSpeed.title = sp.title;
    btnSpeed.classList.toggle('is-on', ui.speedIdx > 0);
  }
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
    : '初次踏入仙途？选一出身，开阵测灵根。';
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
  const o = ORIGINS.find((x) => x.id === id);
  $('btn-roll').disabled = false;
  $('create-hint').textContent = `${o.name}：${o.hook}`;
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
  return { 凡: '#a09585', 黄: '#d4c39e', 玄: '#8ab585', 地: '#84b4cf', 天: '#e0b762', 仙: '#e06c55' }[grade] || '#cfa95e';
}

function acceptRoot() {
  if (!ui.rolledRoot) return;
  $('roll-overlay').hidden = true;
  const name = $('input-name').value.trim() || '无名';
  startRun({ name, gender: ui.gender, originId: ui.originId, rootId: ui.rolledRoot.id });
}

function startRun(opts) {
  const seed = (Math.random() * 0xffffffff) >>> 0;
  game.newRun({ ...opts, seed, meta: store.meta() || game.meta });
  ui.lastSnapshot = snapshotChar();
  ui.lastAchCount = Object.keys(game.state.meta.achievements || {}).length;
  setMobileTab('story');
  showScreen('game');
  renderAll();
  toast(`灵根觉醒：${ROOT_BY_ID[opts.rootId].name}`, 'gold');
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
  renderStory(deltas);
  renderRightPanel();
  const c = game.state.char;
  $('top-realm').textContent = `${c.name} · ${realmLabel(c)}`;
  $('brand-mark').textContent = REALMS[c.realm]?.name?.[0] || '道';
  $('turn-line').textContent = `第 ${game.state.turn} 回合 · ${Math.floor(c.age / 12)}岁`;
}

function renderMobileHud() {
  const c = game.state.char;
  const realm = REALMS[c.realm];
  const expNeed = Number.isFinite(realm.exp) ? Math.round(realm.exp * Math.pow(realm.growth, c.layer)) : Infinity;
  const expPct = expNeed === Infinity ? 100 : Math.min(100, Math.floor((c.exp / expNeed) * 100));
  const remain = Math.max(0, Math.floor((c.lifespan - c.age) / 12));
  $('mobile-hud').innerHTML = `
    <div class="mhud-row">
      <div class="mhud-pills">
        <span class="c-hp">血 <b>${Math.round(c.hp)}/${c.maxHp}</b></span>
        <span class="c-mp">灵 <b>${Math.round(c.mp)}/${c.maxMp}</b></span>
        <span class="c-gold">石 <b>${c.stones}</b></span>
        <span>余寿 <b>${remain}年</b></span>
        ${c.demon > 0 ? `<span class="c-demon">魔 <b>${Math.round(c.demon)}</b></span>` : ''}
      </div>
    </div>
    <div class="mhud-exp">
      <div class="bar exp"><i style="width:${expPct}%"></i></div>
    </div>
  `;
}

function renderSceneBanner() {
  const node = game.currentNode();
  const art = sceneArtFor(node, game.state);
  const img = $('scene-art');
  if (art.src !== ui.lastArtSrc) {
    ui.lastArtSrc = art.src;
    img.classList.add('is-switching');
    setTimeout(() => {
      img.src = art.src;
      img.onload = () => img.classList.remove('is-switching');
      setTimeout(() => img.classList.remove('is-switching'), 180);
    }, 90);
  }
  fxCanvas.setMood(art.mood);
  $('scene-kicker').textContent = kickerFor(node);
  $('scene-banner-loc').textContent = `${game.state.char.location} · ${art.caption}`;

  const hud = $('scene-combat-hud');
  if (game.state.scene.id === 'combat' && game.state.combat) {
    const cb = game.state.combat;
    const pct = Math.max(0, Math.min(100, Math.round((cb.hp / cb.maxHp) * 100)));
    hud.hidden = false;
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
    hud.innerHTML = `
      <div class="combat-hud-row">
        <b>九霄雷阵 · ${REALMS[game.state.char.realm]?.name || ''}之劫</b>
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
    hud.innerHTML = '';
  }
}

function kickerFor(node) {
  if (!node) return '人间';
  if (node.id === 'hub') return game.state.char.location;
  if (node.id === 'combat') return '斗法';
  if (node.id === 'tribulation') return '天劫';
  if (node.id === 'breakthrough') return '叩关';
  if (node.id === 'market' || node.id === 'sell') return '坊市';
  if (node.id === 'recruit') return '仙门';
  if (node.id === 'ending') return '此生终章';
  return node.pool === 'sect' ? '宗门' : node.pool === 'inner' ? '内景' : node.pool === 'story' ? '宿命因果' : '机缘奇遇';
}

function renderBagMarkup() {
  const c = game.state.char;
  if (!c.inventory.length) {
    return '<p class="empty-tip">储物袋空空如也。去坊市置办些丹药，或外出历练寻些机缘吧。</p>';
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
  const rank = sectRank(c.contribution);
  const expNeed = Number.isFinite(realm.exp) ? Math.round(realm.exp * Math.pow(realm.growth, c.layer)) : Infinity;
  const expPct = expNeed === Infinity ? 100 : Math.min(100, Math.floor((c.exp / expNeed) * 100));
  const lifePct = Math.min(100, Math.floor((c.age / c.lifespan) * 100));

  const attrs = Object.entries(c.attrs)
    .map(([k, v]) => `<div class="attr"><span>${k}</span><b>${Math.round(v)}</b></div>`)
    .join('');

  const titles = (c.titles || []).slice(-6).map((t) => `<span class="tag gold">${escapeHtml(t)}</span>`).join('');
  const techs = (c.techniques || []).map((t) => `<span class="tag jade">${escapeHtml(t.name)}</span>`).join('');
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
      <div class="realm-emblem" style="border-color:${gradeColor(root?.grade)}">${realm.name}</div>
      <div>
        <h2 class="char-name">${escapeHtml(c.name)}</h2>
        <div class="char-sub">${realmLabel(c)}<span class="dot">·</span><span style="color:${gradeColor(root?.grade)}">${root?.name || '凡体'}</span><span class="dot">·</span>${sect ? `${sect.name}·${rank.name}` : '散修'}</div>
      </div>
    </div>

    <div class="meter">
      <div class="meter-top"><span>修为</span><b>${Math.floor(c.exp)} / ${expNeed === Infinity ? '∞' : expNeed}</b></div>
      <div class="bar exp"><i style="width:${expPct}%"></i></div>
    </div>
    <div class="meter">
      <div class="meter-top"><span>气血</span><b>${Math.round(c.hp)} / ${c.maxHp}</b></div>
      <div class="bar hp"><i style="width:${Math.max(0, (c.hp / c.maxHp) * 100)}%"></i></div>
    </div>
    <div class="meter">
      <div class="meter-top"><span>灵力</span><b>${Math.round(c.mp)} / ${c.maxMp}</b></div>
      <div class="bar mp"><i style="width:${Math.max(0, (c.mp / c.maxMp) * 100)}%"></i></div>
    </div>
    ${c.demon > 0 ? `
    <div class="meter">
      <div class="meter-top"><span>心魔</span><b>${Math.round(c.demon)} / 100</b></div>
      <div class="bar demon"><i style="width:${c.demon}%"></i></div>
    </div>` : ''}
    <div class="meter">
      <div class="meter-top"><span>寿元</span><b>${Math.floor(c.age / 12)} / ${Math.floor(c.lifespan / 12)} 岁</b></div>
      <div class="bar life"><i style="width:${lifePct}%"></i></div>
    </div>

    <div class="panel-block">
      <h4>根骨六维</h4>
      <div class="attr-grid">${attrs}</div>
    </div>

    <div class="panel-block">
      <h4>身家因果</h4>
      <div class="stat-line"><span>灵石</span><b>${c.stones}</b></div>
      <div class="stat-line"><span>声望</span><b>${c.reputation}</b></div>
      <div class="stat-line"><span>业力</span><b>${c.karma}</b></div>
      ${sect ? `<div class="stat-line"><span>宗门贡献</span><b>${c.contribution}</b></div>` : ''}
      ${c.injuries ? `<div class="stat-line"><span>伤势</span><b style="color:#e08878">${c.injuries}</b></div>` : ''}
    </div>

    ${buffs.length ? `<div class="panel-block"><h4>护持</h4><div class="tag-row">${buffs.join('')}</div></div>` : ''}
    ${techs ? `<div class="panel-block"><h4>功法</h4><div class="tag-row">${techs}</div></div>` : ''}
    ${rels ? `<div class="panel-block"><h4>红尘羁绊</h4>${rels}</div>` : ''}
    ${titles ? `<div class="panel-block"><h4>名号</h4><div class="tag-row">${titles}</div></div>` : ''}
  `;
}

function renderRightPanel() {
  const c = game.state.char;
  const bagWrap = $('right-bag-wrap');
  bagWrap.innerHTML = `
    <div class="rail-head" style="margin-bottom:0.6rem">
      <h3>储物袋</h3>
      <span class="rail-sub">${c.inventory.length} 种</span>
    </div>
    ${renderBagMarkup()}
  `;

  const list = $('log-list');
  const entries = game.state.log.slice(-24).reverse();
  if (!entries.length) {
    list.innerHTML = `<li><b>踏入仙途 · 初抵${escapeHtml(c.location)}</b><time>${ageLabel(c.age)}</time></li>`;
  } else {
    list.innerHTML = entries
      .map((l) => `<li><b>${escapeHtml(l.t)}</b><time>${ageLabel(l.at)}</time></li>`)
      .join('');
  }
  $('log-sub').textContent = `${Math.floor(c.age / 12)}岁`;
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
  el.dataset.full = text;
  const sp = SPEED_MODES[ui.speedIdx];
  if (sp.ms === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    clearInterval(ui.typing);
    ui.typing = null;
    el.textContent = text;
    renderChoices();
    return;
  }
  typewrite(el, text, sp, () => renderChoices());
}

function typewrite(el, text, sp, done) {
  clearInterval(ui.typing);
  el.textContent = '';
  let i = 0;
  const step = Math.max(1, Math.round(text.length / sp.div));
  ui.typing = setInterval(() => {
    i += step;
    el.textContent = text.slice(0, i);
    if (i >= text.length) {
      clearInterval(ui.typing);
      ui.typing = null;
      el.textContent = text;
      done?.();
    }
  }, sp.ms);
  el.onclick = () => {
    if (ui.typing) {
      clearInterval(ui.typing);
      ui.typing = null;
      el.textContent = text;
      done?.();
    }
  };
}

function renderChoices() {
  const wrap = $('choices');
  wrap.innerHTML = '';
  const list = game.choices();
  list.forEach((ch, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'choice' + (ch.effect === 'primary' || ch.effect === 'highlight' ? ' is-primary' : '');
    btn.disabled = Boolean(ch.disabled);
    btn.dataset.index = String(i);
    btn.style.animationDelay = `${Math.min(i * 35, 210)}ms`;
    const reason = ch.disabled && ch.reason ? ` <span class="reason">（${escapeHtml(ch.reason)}）</span>` : '';
    btn.innerHTML = `
      <span class="num">${i + 1}</span>
      <span class="choice-main">
        <span class="label">${escapeHtml(ch.label)}</span>
        ${ch.hint ? `<span class="hint">${escapeHtml(ch.hint)}${reason}</span>` : reason ? `<span class="hint">${reason}</span>` : ''}
      </span>
      <span class="arrow" aria-hidden="true">›</span>`;
    btn.addEventListener('click', () => pick(i));
    wrap.appendChild(btn);
  });
}

function ageLabel(months) {
  return `${Math.floor(months / 12)}岁 · ${(months % 12) + 1}月`;
}

function pick(index) {
  if (ui.typing) {
    const el = $('scene-text');
    clearInterval(ui.typing);
    ui.typing = null;
    el.textContent = el.dataset.full || el.textContent;
  }
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
    sfx.play(fx);
  } else if (curr && prev && (curr.realm > prev.realm || curr.layer > prev.layer)) {
    triggerScreenFx('breakthrough');
    fxCanvas.burst('breakthrough');
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
  if (window.innerWidth < 1100) window.scrollTo({ top: 0, behavior: 'smooth' });
}

function announceNewAchievements() {
  const meta = game.state.meta.achievements || {};
  const now = Object.keys(meta).length;
  if (ui.lastAchCount == null) { ui.lastAchCount = now; return; }
  if (now > ui.lastAchCount) {
    const newest = ACHIEVEMENTS.filter((a) => meta[a.id]).slice(-1)[0];
    if (newest) {
      toast(`成就解锁 · ${newest.name}`, 'gold');
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
  $('create-hint').textContent = `第 ${meta.cycle || 1} 世 · 轮回点 ${meta.karmaPoints || 0}。择一出身，再问仙途。`;
  renderTalents();
  seedTitleMeta();
  showScreen('create');
  sfx.play('breakthrough');
  toast('喝下孟婆汤。前尘尽忘，唯有道心还在。', 'gold');
}

/* ---------------------------------- 移动端导航 / 储物使用 ---------------------------------- */

function setMobileTab(tab) {
  if (tab === 'codex') {
    openCodex();
    return;
  }
  ui.mobileTab = tab;
  $('game-screen').dataset.mobileTab = tab;
  document.querySelectorAll('#mobile-nav .mnav-btn').forEach((b) => {
    b.classList.toggle('is-active', b.dataset.mtab === tab);
  });
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function wireMobileNav() {
  $('mobile-nav').addEventListener('click', (e) => {
    const btn = e.target.closest('.mnav-btn');
    if (!btn) return;
    sfx.play('click');
    setMobileTab(btn.dataset.mtab);
  });

  // 储物袋物品点击使用（桌面右栏 & 移动储物页共用）
  $('right-bag-wrap').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-use-item]');
    if (!btn || !game.state) return;
    const prev = snapshotChar();
    const res = game.useInventoryItem(btn.dataset.useItem);
    if (res?.error) {
      toast(res.error);
      return;
    }
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
  $('btn-speed').addEventListener('click', () => {
    ui.speedIdx = (ui.speedIdx + 1) % SPEED_MODES.length;
    try { localStorage.setItem('wendao.v3.speed', String(ui.speedIdx)); } catch { /* ignore */ }
    syncPreferenceButtons();
    toast(SPEED_MODES[ui.speedIdx].title.split('（')[0]);
  });
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
      <h4>修仙与突破</h4>
      <p>每回合选择行动推进光阴。修为满后点击高亮的「冲击境界」叩关；大境界关口将引动三重天劫。</p>
      <h4>储物与丹药</h4>
      <p>桌面右侧或手机底部「储物」页可直接服用丹药、激活护心符/神行符或研读古经功法。</p>
      <h4>快捷操作</h4>
      <p>桌面支持数字键 1–9 选择、空格/回车跳过打字或继续、S 存档、L 读档、C 图鉴、Esc 关闭弹窗；手机底部五栏一键切换。</p>
      <h4>存档与轮回</h4>
      <p>每回合自动保存，另有 4 个手动槽与 JSON 导入/导出。所有随机数状态一并序列化，读档后卦象一致。</p>
    `;
  });
  $('menu-about').addEventListener('click', () => {
    $('menu-body').innerHTML = `
      <h4>关于《问道长生》</h4>
      <p>参考 inkle/ink 节点叙事（knot / stitch / choice / divert / weave）构建的水墨修仙模拟器。</p>
      <p>内置 290+ 叙事节点、21 种灵根、13 座仙门、24 重结局、177 项成就（含 63 项隐藏）与 12 项跨世轮回天赋。</p>
      <p>纯静态前端运行，零后端依赖，适配手机与电脑双端游玩。</p>
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
  } else {
    const joined = new Set(meta.sectsJoined || []);
    sum.textContent = `历世已拜入 ${joined.size} / ${SECTS.length} 座仙门`;
    body.innerHTML = `<div class="ach-grid">${SECTS.map((s) => {
      const got = joined.has(s.id);
      return `<div class="ach ${got ? 'done' : 'locked'}">
        <b>${escapeHtml(s.name)}（${s.align}）</b>
        <p>${escapeHtml(s.desc)}</p>
        <small>条件：${escapeHtml(s.requirement)} · 功法：${escapeHtml(s.technique)}</small>
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
    if (ui.typing) {
      const el = $('scene-text');
      clearInterval(ui.typing);
      ui.typing = null;
      el.textContent = el.dataset.full || el.textContent;
      renderChoices();
      return;
    }
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
  window.advanceTime = () => {
    if (ui.typing) {
      clearInterval(ui.typing);
      ui.typing = null;
      const el = $('scene-text');
      el.textContent = el.dataset.full || el.textContent;
      renderChoices();
    }
  };
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
    renderAll();
    return realmLabel(c);
  };
}

boot();
