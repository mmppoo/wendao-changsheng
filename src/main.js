import { Game } from './engine/game.js';
import { SaveStore } from './engine/save.js';
import { ROOTS, ROOT_BY_ID, GRADE_ORDER } from './data/roots.js';
import { ORIGINS } from './data/origins.js';
import { REALMS, realmLabel } from './data/realms.js';
import { SECT_BY_ID, sectRank } from './data/sects.js';
import { ACHIEVEMENTS } from './data/achievements.js';
import { ENDINGS } from './data/endings.js';
import { ITEM_BY_ID } from './data/items.js';
import { TALENTS } from './data/talents.js';

const $ = (id) => document.getElementById(id);
const store = new SaveStore();
const game = new Game({ meta: store.meta() || {} });
const ui = {
  originId: null,
  gender: '女',
  rolledRoot: null,
  rerollUsed: false,
  typing: null,
  codexTab: 'achievements',
  saveMode: 'save',
};

/* ---------------------------------- 启动 ---------------------------------- */

function boot() {
  seedTitleMeta();
  initCreate();
  wireTopbar();
  wireOverlays();
  wireKeyboard();
  exposeDebug();
  window.addEventListener('beforeunload', () => {
    if (game.state && !game.state.flags.finished) store.save(0, game);
  });
}

function seedTitleMeta() {
  const meta = store.meta();
  const auto = store.load(0);
  if (auto) {
    $('btn-continue').hidden = false;
    $('btn-continue').textContent = `继续 · ${auto.state.char.name}`;
  }
  const counts = meta
    ? `轮回 ${meta.cycle || 1} 世 · 结局 ${(meta.unlockedEndings || []).length}/${ENDINGS.length} · 成就 ${Object.keys(meta.achievements || {}).length}/${ACHIEVEMENTS.length}`
    : '第一次来？先抽一根灵根。';
  $('title-meta').textContent = counts;
}

function showScreen(which) {
  $('title-screen').hidden = which !== 'title';
  $('create-screen').hidden = which !== 'create';
  $('game-screen').hidden = which !== 'game';
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
    btn.addEventListener('click', () => selectOrigin(o.id));
    grid.appendChild(btn);
  });

  document.querySelectorAll('.seg').forEach((seg) => {
    seg.addEventListener('click', () => {
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
  $('btn-back-title').addEventListener('click', () => showScreen('title'));
  $('btn-new').addEventListener('click', () => showScreen('create'));
  $('btn-continue').addEventListener('click', () => continueGame());
  $('btn-gallery').addEventListener('click', () => openCodex());

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
  toast(`天赋「${t.name}」点亮`, 'gold');
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
  $('roll-desc').textContent = '天意难测。';
  $('roll-actions').innerHTML = '';
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
  }, 70);
}

function settleRoll() {
  const root = weightedRoot();
  ui.rolledRoot = root;
  const el = $('roll-result');
  el.classList.remove('spinning');
  el.textContent = root.name;
  el.style.color = gradeColor(root.grade);
  $('roll-desc').innerHTML = `${root.desc}<br><span style="color:var(--gold-dim)">${root.quirk}</span>`;
  const canReroll = !ui.rerollUsed;
  $('roll-actions').innerHTML = `
    <button class="btn btn-primary" data-act="accept">就是它</button>
    <button class="btn btn-ghost" data-act="reroll" ${canReroll ? '' : 'disabled'}>再问一次天意</button>
  `;
}

function rerollRoot() {
  if (ui.rerollUsed) return;
  ui.rerollUsed = true;
  $('roll-actions').innerHTML = '';
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
  return { 凡: '#8d8272', 黄: '#bfb4a0', 玄: '#7f9e7a', 地: '#8fb0c9', 天: '#c8a45c', 仙: '#c85a45' }[grade] || '#c8a45c';
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
  showScreen('game');
  renderAll();
  toast(`灵根：${ROOT_BY_ID[opts.rootId].name}`, 'gold');
  store.save(0, game);
}

function continueGame() {
  const data = store.load(0);
  if (!data) return;
  game.setState(data.state);
  showScreen('game');
  renderAll();
  if (game.state.scene.id === 'hub') toast('接着上次的时辰。');
}

/* ---------------------------------- 渲染 ---------------------------------- */

function renderAll() {
  if (!game.state) return;
  renderCharPanel();
  renderStory();
  renderLog();
  $('top-realm').textContent = realmLabel(game.state.char);
  $('turn-line').textContent = `第 ${game.state.turn} 回合`;
  const node = game.currentNode();
  $('scene-kicker').textContent = kickerFor(node);
}

function kickerFor(node) {
  if (!node) return '人间';
  if (node.id === 'hub') return game.state.char.location;
  if (node.id === 'combat') return '斗法';
  if (node.id === 'tribulation') return '天劫';
  if (node.id === 'breakthrough') return '叩关';
  if (node.id === 'market') return '坊市';
  if (node.id === 'ending') return '此生';
  return node.pool === 'sect' ? '宗门' : node.pool === 'inner' ? '内景' : node.pool === 'story' ? '因果' : '奇遇';
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

  const titles = (c.titles || []).slice(-4).map((t) => `<span class="tag gold">${t}</span>`).join('');
  const inv = c.inventory
    .slice(0, 6)
    .map((it) => `<span class="tag" title="${ITEM_BY_ID[it.id]?.desc || ''}">${ITEM_BY_ID[it.id]?.name || it.id}${it.qty > 1 ? `×${it.qty}` : ''}</span>`)
    .join('');

  $('char-panel').innerHTML = `
    <div class="rail-head"><h3>此人</h3><span class="rail-sub">${c.gender} · ${c.originId ? originName(c.originId) : ''}</span></div>
    <h2 class="char-name">${escapeHtml(c.name)}</h2>
    <div class="char-sub">${realmLabel(c)}<span class="dot">·</span>${root?.name || '凡体'}<span class="dot">·</span>${sect ? `${sect.name}·${rank.name}` : '散修'}</div>

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
      <div class="meter-top"><span>心魔</span><b>${Math.round(c.demon)}</b></div>
      <div class="bar demon"><i style="width:${c.demon}%"></i></div>
    </div>` : ''}
    <div class="meter">
      <div class="meter-top"><span>寿元</span><b>${Math.floor(c.age / 12)} / ${Math.floor(c.lifespan / 12)} 岁</b></div>
      <div class="bar life"><i style="width:${lifePct}%"></i></div>
    </div>

    <div class="panel-block">
      <h4>根骨</h4>
      <div class="attr-grid">${attrs}</div>
    </div>

    <div class="panel-block">
      <h4>身家</h4>
      <div class="stat-line"><span>灵石</span><b>${c.stones}</b></div>
      <div class="stat-line"><span>声望</span><b>${c.reputation}</b></div>
      <div class="stat-line"><span>业力</span><b>${c.karma}</b></div>
      ${sect ? `<div class="stat-line"><span>贡献</span><b>${c.contribution}</b></div>` : ''}
      ${c.injuries ? `<div class="stat-line"><span>伤势</span><b>${c.injuries}</b></div>` : ''}
    </div>

    ${titles ? `<div class="panel-block"><h4>称号</h4><div class="tag-row">${titles}</div></div>` : ''}
    ${inv ? `<div class="panel-block"><h4>随身</h4><div class="tag-row">${inv}</div></div>` : ''}
  `;
}

function originName(id) {
  return ORIGINS.find((o) => o.id === id)?.name || '';
}

function renderStory() {
  const text = game.currentText();
  const node = game.currentNode();
  $('scene-title').textContent = node?.title || '';
  const el = $('scene-text');
  el.dataset.full = text;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = text;
    renderChoices();
    return;
  }
  typewrite(el, text, () => renderChoices());
  $('scene-lines').innerHTML = (game.state.scene.result?.lines || [])
    .filter(Boolean)
    .map((l) => `<span>${escapeHtml(l)}</span>`)
    .join('');
}

function typewrite(el, text, done) {
  clearInterval(ui.typing);
  el.textContent = '';
  let i = 0;
  const step = Math.max(1, Math.round(text.length / 220));
  ui.typing = setInterval(() => {
    i += step;
    el.textContent = text.slice(0, i);
    if (i >= text.length) {
      clearInterval(ui.typing);
      ui.typing = null;
      el.textContent = text;
      done?.();
    }
  }, 16);
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
    btn.className = 'choice' + (ch.effect === 'primary' ? ' is-primary' : '');
    btn.disabled = Boolean(ch.disabled);
    btn.dataset.index = String(i);
    btn.style.animationDelay = `${Math.min(i * 40, 240)}ms`;
    const reason = ch.disabled && ch.reason ? ` <span class="reason">（${escapeHtml(ch.reason)}）</span>` : '';
    btn.innerHTML = `
      <span class="num">${i + 1}</span>
      <span>
        <span class="label">${escapeHtml(ch.label)}</span>
        ${ch.hint ? `<span class="hint">${escapeHtml(ch.hint)}${reason}</span>` : reason ? `<span class="hint">${reason}</span>` : ''}
      </span>`;
    btn.addEventListener('click', () => pick(i));
    wrap.appendChild(btn);
  });
  const primary = wrap.querySelector('.choice.is-primary:not(:disabled)') || wrap.querySelector('.choice:not(:disabled)');
  primary?.focus({ preventScroll: true });
}

function renderLog() {
  const list = $('log-list');
  const entries = game.state.log.slice(-14).reverse();
  list.innerHTML = entries
    .map((l) => `<li><b>${escapeHtml(l.t)}</b><time>${ageLabel(l.at)}</time></li>`)
    .join('');
  $('log-sub').textContent = `${Math.floor(game.state.char.age / 12)}岁`;
}

function ageLabel(months) {
  return `${Math.floor(months / 12)}岁 · ${months % 12 + 1}月`;
}

function pick(index) {
  if (ui.typing) {
    const el = $('scene-text');
    clearInterval(ui.typing);
    ui.typing = null;
    el.textContent = el.dataset.full || el.textContent;
  }
  const res = game.choose(index);
  handleResult(res);
}

function handleResult(res) {
  if (res?.error) { toast(res.error); return; }
  if (res?.reincarnate) { startReincarnation(res.meta); return; }
  store.save(0, game);
  renderAll();
  announceNewAchievements();
  scrollStory();
}

function scrollStory() {
  const sc = $('story-scroll');
  sc.scrollTop = 0;
}

function announceNewAchievements() {
  const meta = game.state.meta.achievements || {};
  const now = Object.keys(meta).length;
  if (ui.lastAchCount == null) { ui.lastAchCount = now; return; }
  if (now > ui.lastAchCount) {
    const newest = ACHIEVEMENTS.filter((a) => meta[a.id]).slice(-1)[0];
    if (newest) toast(`成就 · ${newest.name}`, 'gold');
    ui.lastAchCount = now;
  }
}

function startReincarnation(meta) {
  store.saveMeta(meta);
  game.state = null;
  ui.rolledRoot = null;
  ui.originId = null;
  ui.rerollUsed = false;
  $('btn-roll').disabled = true;
  document.querySelectorAll('.origin-card').forEach((c) => c.classList.remove('is-active'));
  $('create-hint').textContent = `轮回点 ${meta.karmaPoints || 0}。选一个出身，重新开始。`;
  renderTalents();
  seedTitleMeta();
  showScreen('create');
  toast('喝下孟婆汤。前尘尽忘，唯有道心还在。', 'gold');
}

/* ---------------------------------- 顶栏 / 弹层 ---------------------------------- */

function wireTopbar() {
  $('btn-save').addEventListener('click', () => openSave('save'));
  $('btn-load').addEventListener('click', () => openSave('load'));
  $('btn-codex').addEventListener('click', () => openCodex());
  $('btn-menu').addEventListener('click', () => { $('menu-overlay').hidden = false; });
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
      toast(`已存入${slot === 0 ? '自动' : `第${slot}号`}存档`);
    } else if (btn.dataset.act === 'load') {
      const data = store.load(slot);
      if (!data) return;
      game.setState(data.state);
      $('save-overlay').hidden = true;
      showScreen('game');
      ui.lastAchCount = null;
      renderAll();
      toast('回来了。');
    } else if (btn.dataset.act === 'del') {
      store.remove(slot);
      renderSlots();
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
      renderAll();
      toast('存档已载入。');
    } catch (err) {
      toast('这个文件读不出来。');
    }
    e.target.value = '';
  });

  $('codex-tabs').addEventListener('click', (e) => {
    const tab = e.target.closest('.tab');
    if (!tab) return;
    document.querySelectorAll('.tab').forEach((t) => t.classList.remove('is-active'));
    tab.classList.add('is-active');
    ui.codexTab = tab.dataset.tab;
    renderCodex();
  });

  $('menu-restart').addEventListener('click', () => {
    $('menu-overlay').hidden = true;
    if (confirm('重开一世？当前进度会自动存进存档。')) {
      if (game.state) store.save(0, game);
      game.state = null;
      ui.lastAchCount = null;
      showScreen('create');
    }
  });
  $('menu-help').addEventListener('click', () => {
    $('menu-body').innerHTML = `
      <h4>怎么玩</h4>
      <p>每回合选一个行动，时间会往前走。修为满了可以「冲击境界」；大境界的关口会引来天劫。</p>
      <h4>按键</h4>
      <p>数字键 1–9 选择；空格/回车继续；Esc 关闭弹层。</p>
      <h4>存档</h4>
      <p>每次选择后自动存入「自动」槽，另有三个手动槽，可导出为 JSON 文件。</p>
      <h4>结局</h4>
      <p>死亡、寿元耗尽、飞升、堕魔都会抵达结局。结局会记进图鉴，并给下辈子一点轮回点。</p>
    `;
  });
  $('menu-about').addEventListener('click', () => {
    $('menu-body').innerHTML = `
      <h4>关于</h4>
      <p>《问道长生》是一个单文件优先的互动叙事实验，叙事结构参考 inkle 的 ink：knot、choice、divert、变量与 weave。</p>
      <p>所有随机都走可序列化的种子随机源，所以读档会回到同一个卦象。</p>
      <p>文本、代码与数值均为虚构。</p>
    `;
  });
}

function openSave(mode) {
  if (!game.state && mode === 'save') return;
  ui.saveMode = mode;
  $('save-title').textContent = mode === 'save' ? '存档' : '读档';
  $('save-overlay').hidden = false;
  renderSlots();
}

function renderSlots() {
  const list = store.list();
  $('slot-list').innerHTML = list
    .map((s) => {
      const name = s.slot === 0 ? '自动存档' : `第 ${s.slot} 号`;
      const info = s.info
        ? `${escapeHtml(s.info.name)} · ${s.info.realm} · ${s.info.age}岁 · 第${s.info.turn}回合`
        : '空';
      const date = s.savedAt ? new Date(s.savedAt).toLocaleString('zh-CN') : '';
      const loadBtn = !s.empty ? `<button class="mini" data-act="load" data-slot="${s.slot}">读取</button>` : '';
      const saveBtn = ui.saveMode === 'save' ? `<button class="mini" data-act="save" data-slot="${s.slot}">存入</button>` : '';
      const delBtn = !s.empty ? `<button class="mini" data-act="del" data-slot="${s.slot}">删除</button>` : '';
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
  const meta = game.state?.meta || store.meta() || { achievements: {}, unlockedEndings: [] };
  if (ui.codexTab === 'achievements') {
    body.innerHTML = `<div class="ach-grid">${ACHIEVEMENTS.map((a) => {
      const got = Boolean(meta.achievements?.[a.id]);
      const hidden = a.hidden && !got;
      return `<div class="ach ${got ? 'done' : 'locked'}">
        <b>${hidden ? '？？？' : a.name}</b>
        <p>${hidden ? '隐藏成就，尚未解锁。' : a.desc}</p>
      </div>`;
    }).join('')}</div>`;
  } else if (ui.codexTab === 'endings') {
    body.innerHTML = `<div class="ach-grid">${ENDINGS.map((e) => {
      const got = (meta.unlockedEndings || []).includes(e.id);
      const hidden = e.hidden && !got;
      return `<div class="ach ${got ? 'done' : 'locked'}">
        <b>${hidden ? '？？？' : e.name}</b>
        <p>${hidden ? '尚未抵达的结局。' : e.summary}</p>
      </div>`;
    }).join('')}</div>`;
  } else {
    body.innerHTML = `<div class="ach-grid">${ROOTS.map((r) => `
      <div class="ach ${GRADE_ORDER[r.grade] >= 3 ? 'done' : 'locked'}">
        <b>${r.name} · ${r.grade}</b>
        <p>${r.desc}</p>
      </div>`).join('')}</div>`;
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
