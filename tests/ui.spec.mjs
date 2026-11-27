/**
 * 零依赖端到端 UI 测试（基于 Chrome DevTools Protocol + Node 22 原生 WebSocket/HTTP）：
 * 覆盖桌面 (1440×900) 与移动端 (390×844) 双端：
 * 标题绘卷 → 建角 → 八卦测灵根 → 主界面行动 → 键盘选择 → 储物袋服丹 →
 * 存档/读档/刷新恢复 → 剧情分支 & ch.combat 战斗 HUD → 天劫 HUD →
 * 结局 & 轮回 → 四栏图鉴（含隐藏成就遮蔽）→ 移动端五栏切换与零横向溢出 → 单文件离线版零报错。
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const ART = path.join(ROOT, 'tests', 'artifacts');
fs.mkdirSync(ART, { recursive: true });

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
};

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const cleanUrl = (req.url || '/').split('?')[0];
      const rel = cleanUrl === '/' ? 'index.html' : cleanUrl.replace(/^\/+/, '');
      const fp = path.join(ROOT, rel);
      if (!fp.startsWith(ROOT) || !fs.existsSync(fp) || fs.statSync(fp).isDirectory()) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      const ext = path.extname(fp).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      fs.createReadStream(fp).pipe(res);
    });
    server.listen(0, '127.0.0.1', () => {
      resolve({ server, url: `http://127.0.0.1:${server.address().port}` });
    });
  });
}

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean);
  for (const c of candidates) if (fs.existsSync(c)) return c;
  throw new Error('未找到 Chrome/Chromium，可设置 CHROME_PATH 环境变量');
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 0;
    this.pending = new Map();
    this.listeners = new Map();
  }
  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.addEventListener('open', resolve);
      this.ws.addEventListener('error', reject);
      this.ws.addEventListener('message', (ev) => {
        const msg = JSON.parse(String(ev.data));
        if (msg.id && this.pending.has(msg.id)) {
          const { res, rej } = this.pending.get(msg.id);
          this.pending.delete(msg.id);
          if (msg.error) rej(new Error(msg.error.message));
          else res(msg.result);
        } else if (msg.method && this.listeners.has(msg.method)) {
          for (const fn of this.listeners.get(msg.method)) fn(msg.params);
        }
      });
    });
  }
  on(method, fn) {
    if (!this.listeners.has(method)) this.listeners.set(method, []);
    this.listeners.get(method).push(fn);
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((res, rej) => {
      this.pending.set(id, { res, rej });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  async eval(expr) {
    const r = await this.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result?.value;
  }
  async screenshot(filePath) {
    const { data } = await this.send('Page.captureScreenshot', { format: 'jpeg', quality: 86 });
    fs.writeFileSync(filePath, Buffer.from(data, 'base64'));
  }
  close() { this.ws?.close(); }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitFor(fn, timeout = 6000) {
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    const v = await fn();
    if (v) return v;
    await sleep(60);
  }
  throw new Error('waitFor timeout');
}

async function launchChrome() {
  const bin = findChrome();
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wendao-cdp-'));
  const port = 9222 + Math.floor(Math.random() * 600);
  const proc = spawn(bin, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--window-size=1440,900',
    'about:blank',
  ], { stdio: 'ignore' });

  let targets = null;
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${port}/json`);
      if (r.ok) { targets = await r.json(); break; }
    } catch { /* retry */ }
    await sleep(100);
  }
  if (!targets) { proc.kill(); throw new Error('Chrome CDP 未启动'); }
  const pageTarget = targets.find((t) => t.type === 'page') || targets[0];
  const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await client.connect();
  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('Log.enable');
  return {
    proc,
    client,
    cleanup: () => {
      client.close();
      proc.kill();
      setTimeout(() => { try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch {} }, 250);
    },
  };
}

async function main() {
  const { server, url } = await startServer();
  const { client, cleanup } = await launchChrome();
  const results = [];
  const consoleErrors = [];

  client.on('Runtime.exceptionThrown', (p) => consoleErrors.push(p.exceptionDetails?.exception?.description || p.exceptionDetails?.text || 'exception'));
  client.on('Runtime.consoleAPICalled', (p) => {
    if (p.type === 'error') consoleErrors.push((p.args || []).map((a) => a.value || a.description).join(' '));
  });

  async function check(name, fn) {
    try {
      const detail = await fn();
      results.push({ name, pass: true, detail: detail || '' });
      console.log(`  ✔ ${name}${detail ? ` — ${detail}` : ''}`);
    } catch (e) {
      results.push({ name, pass: false, detail: e.message });
      console.error(`  ✖ ${name} — ${e.message}`);
    }
  }

  const goto = async (targetUrl) => {
    await client.send('Page.navigate', { url: targetUrl });
    await waitFor(() => client.eval('document.readyState === "complete"'));
    await sleep(250);
  };
  const setViewport = (width, height, mobile = false) =>
    client.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: mobile ? 2 : 1, mobile });
  const state = async () => JSON.parse(await client.eval('window.render_game_to_text()'));
  const finishTyping = async () => client.eval('window.advanceTime && window.advanceTime()');
  const click = async (sel) => {
    const ok = await client.eval(`(() => { const el = document.querySelector(${JSON.stringify(sel)}); if (!el || el.disabled) return false; el.click(); return true; })()`);
    if (!ok) throw new Error(`无法点击 ${sel}`);
    await sleep(80);
  };

  try {
    await setViewport(1440, 900, false);
    await goto(url);
    await client.eval('localStorage.clear()');
    await goto(url);
    await sleep(300);
    await client.screenshot(path.join(ART, '01-title-desktop.jpg'));

    await check('桌面标题页与实时像素山海画布渲染', async () => {
      const info = await client.eval(`(() => ({
        title: document.querySelector('.game-title')?.textContent?.trim(),
        canvasW: document.getElementById('title-pixel-canvas')?.width || 0,
        overflow: document.documentElement.scrollWidth > window.innerWidth
      }))()`);
      if (info.title !== '问道长生') throw new Error('标题错误 ' + info.title);
      if (info.canvasW < 200) throw new Error('像素标题画布缺失 width=' + info.canvasW);
      if (info.overflow) throw new Error('标题页横向溢出');
      return `${info.title} · pixelCanvas=${info.canvasW}px`;
    });

    await click('#btn-new');
    await sleep(200);
    await check('建角页出身卡、6大伴生金手指与按钮状态', async () => {
      const n = await client.eval('document.querySelectorAll(".origin-card").length');
      const gfs = await client.eval('document.querySelectorAll(".gf-card").length');
      const disabled = await client.eval('document.getElementById("btn-roll").disabled');
      if (n < 10 || gfs < 6 || !disabled) throw new Error(`n=${n}, gfs=${gfs}, disabled=${disabled}`);
      await click('.gf-card[data-gf="gf_sword_elder"]');
      return `${n}出身 · ${gfs}金手指`;
    });

    await click('.origin-card[data-origin="fallen_clan"]');
    await client.eval('document.getElementById("input-name").value = "沈砚"');
    await click('.seg[data-gender="男"]');
    await click('#btn-roll');

    await check('八卦测灵根动效与结果展示', async () => {
      await waitFor(() => client.eval(`(() => {
        const el = document.getElementById('roll-result');
        return el && el.textContent && el.textContent !== '……' && !el.classList.contains('spinning');
      })()`));
      await sleep(250);
      await client.screenshot(path.join(ART, '02-roll-desktop.jpg'));
      const res = await client.eval('document.getElementById("roll-result").textContent.trim()');
      const grade = await client.eval('document.getElementById("roll-grade").textContent.trim()');
      return `${res} (${grade})`;
    });

    await click('button[data-act="accept"]');
    await waitFor(() => client.eval('!document.getElementById("game-screen").hidden'));
    await finishTyping();
    await sleep(300);
    await client.screenshot(path.join(ART, '03-game-desktop.jpg'));

    await check('主界面实时像素实景、像素头像、风闻条与行动按钮', async () => {
      const s = await state();
      const canvasW = await client.eval('document.getElementById("scene-pixel-canvas")?.width || 0');
      const portraitW = await client.eval('document.getElementById("char-portrait")?.width || 0');
      const rumor = await client.eval('document.getElementById("rumor-bar")?.textContent?.trim() || ""');
      const overflow = await client.eval('document.documentElement.scrollWidth > window.innerWidth');
      if (s.char.name !== '沈砚' || !s.choices.length) throw new Error('主界面初始化异常');
      if (canvasW < 200 || portraitW < 32 || !rumor) throw new Error(`canvas=${canvasW} portrait=${portraitW}`);
      if (overflow) throw new Error('桌面端横向溢出');
      return `${s.char.name} · ${s.choices.length}项行动 · 像素实景=${canvasW}px`;
    });

    const before = await state();
    await click('#choices .choice:not([disabled])');
    await finishTyping();
    await check('选择推进、数值反馈与自动存档', async () => {
      const s = await state();
      const saved = await client.eval('Boolean(localStorage.getItem("wendao.v3.slot.0"))');
      if (s.text === before.text || !saved) throw new Error('状态未更新或未自动存档');
      return `scene=${s.scene} · exp=${s.char.exp}`;
    });

    await click('#choices .choice:not([disabled])');
    await finishTyping();

    await check('储物袋直接服丹互动', async () => {
      const beforeExp = (await state()).char.exp;
      await client.eval(`(() => {
        window.__game.state.char.inventory.push({ id: 'yinqi_dan', qty: 1 });
        window.__render();
      })()`);
      await click('button[data-use-item="yinqi_dan"]');
      const afterExp = (await state()).char.exp;
      if (afterExp <= beforeExp) throw new Error('服用引气丹未涨修为');
      return `exp ${beforeExp} → ${afterExp}`;
    });

    await click('#btn-save');
    await check('存档面板 5 槽（自动 + 4 手动）与 1 号槽写入', async () => {
      const n = await client.eval('document.querySelectorAll(".slot").length');
      if (n !== 5) throw new Error('槽位数量 ' + n);
      await click('button[data-act="save"][data-slot="1"]');
      const raw = await client.eval('localStorage.getItem("wendao.v3.slot.1")');
      if (!raw) throw new Error('1 号槽写入失败');
      return `${n} 槽位`;
    });
    await click('[data-close="save-overlay"]');

    await goto(url);
    await check('刷新恢复「继续今生」并读取 1 号档', async () => {
      const cont = await client.eval('!document.getElementById("btn-continue").hidden');
      if (!cont) throw new Error('继续按钮未显示');
      await click('#btn-continue');
      await finishTyping();
      await click('#btn-load');
      await click('button[data-act="load"][data-slot="1"]');
      await finishTyping();
      const s = await state();
      if (s.char.name !== '沈砚') throw new Error('读档角色名丢失');
      return `${s.char.name} 已恢复`;
    });

    await check('剧情分支与 ch.combat 战斗 HUD', async () => {
      await client.eval('window.__game.openScene("ev_fox_fire"); window.__render();');
      await finishTyping();
      await click('#choices .choice:nth-child(2)');
      await finishTyping();
      await sleep(250);
      await client.screenshot(path.join(ART, '04-combat-desktop.jpg'));
      const s = await state();
      const hudVis = await client.eval('!document.getElementById("scene-combat-hud").hidden');
      if (s.scene !== 'combat' || !hudVis) throw new Error(`未进入战斗 scene=${s.scene}`);
      return `${s.title} · HUD可见`;
    });

    await check('天劫九霄雷阵 HUD 渲染', async () => {
      await client.eval(`(() => {
        const g = window.__game;
        g.state.combat = null;
        g.state.char.realm = 2;
        g.startTribulation('');
        window.__render();
      })()`);
      await finishTyping();
      await sleep(250);
      await client.screenshot(path.join(ART, '05-tribulation-desktop.jpg'));
      const orbs = await client.eval('document.querySelectorAll(".trib-orb").length');
      if (orbs !== 3) throw new Error('天劫阵图缺失');
      return '三重雷劫阵图正常';
    });

    await check('飞升结局、轮回与四栏图鉴', async () => {
      await client.eval('window.__game.finishEnding("e_ascend"); window.__render();');
      await finishTyping();
      await sleep(250);
      await client.screenshot(path.join(ART, '06-ending-desktop.jpg'));
      await click('#choices .choice:not([disabled])');
      await waitFor(() => client.eval('!document.getElementById("create-screen").hidden'));
      await click('#btn-back-title');
      await click('#btn-gallery');
      const tabs = await client.eval('document.querySelectorAll("#codex-tabs .tab").length');
      const body = await client.eval('document.getElementById("codex-body").textContent');
      await click('#codex-tabs .tab[data-tab="sects"]');
      const sectText = await client.eval('document.getElementById("codex-body").textContent');
      if (tabs !== 4 || !body.includes('？？？') || !sectText.includes('太玄剑宗')) {
        throw new Error('图鉴内容异常');
      }
      await click('[data-close="codex-overlay"]');
      return '4栏图鉴 + 隐藏遮蔽正常';
    });

    // ---------------- 移动端 390×844 适配验证 ----------------
    await setViewport(390, 844, true);
    await goto(url);
    await sleep(250);
    await client.screenshot(path.join(ART, '07-title-mobile.jpg'));
    await click('#btn-continue');
    await sleep(220);
    // 回到洞府主界面截一张无滚动双列固定屏截图
    await client.eval('window.__game.state.combat = null; window.__game.state.scene = { id: "hub", result: null }; window.__render();');
    await sleep(220);
    await client.screenshot(path.join(ART, '08-game-mobile.jpg'));

    await check('移动端 390×844 固定单屏、无打字延迟、双列行动栏与零溢出', async () => {
      const m1 = await client.eval(`(() => ({
        hud: getComputedStyle(document.getElementById('mobile-hud')).display !== 'none',
        nav: getComputedStyle(document.getElementById('mobile-nav')).display !== 'none',
        hubGrid: document.getElementById('choices').classList.contains('is-hub-grid'),
        overflowX: document.documentElement.scrollWidth > window.innerWidth,
        overflowY: document.documentElement.scrollHeight > window.innerHeight + 2,
        textReady: (document.getElementById('scene-text').textContent || '').length > 10
      }))()`);
      if (!m1.hud || !m1.nav || !m1.hubGrid || m1.overflowX || m1.overflowY || !m1.textReady) {
        throw new Error(JSON.stringify(m1));
      }
      await click('#mobile-nav .mnav-btn[data-mtab="char"]');
      await sleep(150);
      await client.screenshot(path.join(ART, '09-char-mobile.jpg'));
      const charVis = await client.eval('getComputedStyle(document.getElementById("char-panel")).display !== "none"');
      await click('#mobile-nav .mnav-btn[data-mtab="bag"]');
      await sleep(120);
      await click('#mobile-nav .mnav-btn[data-mtab="log"]');
      await sleep(120);
      const logVis = await client.eval('getComputedStyle(document.getElementById("log-list")).display !== "none"');
      await click('#mobile-nav .mnav-btn[data-mtab="story"]');
      if (!charVis || !logVis) throw new Error(`charVis=${charVis}, logVis=${logVis}`);
      return '固定单屏 + 2列行动栏 + 零横纵溢出';
    });

    // ---------------- 单文件离线版验证 ----------------
    await setViewport(1440, 900, false);
    await goto(`${url}/dist/wendao-changsheng.html`);
    await check('单文件版 dist/wendao-changsheng.html 离线像素画布加载', async () => {
      const ok = await client.eval(`(() => ({
        title: document.querySelector('.game-title')?.textContent?.trim(),
        canvasW: document.getElementById('title-pixel-canvas')?.width || 0,
        hasDebug: typeof window.render_game_to_text === 'function'
      }))()`);
      if (ok.title !== '问道长生' || ok.canvasW < 200 || !ok.hasDebug) throw new Error(JSON.stringify(ok));
      return `离线单文件像素画布=${ok.canvasW}px`;
    });

    await check('全程零控制台错误', async () => {
      const real = consoleErrors.filter((e) => !e.includes('favicon'));
      if (real.length) throw new Error(real.slice(0, 3).join(' | '));
      return '0 error';
    });
  } finally {
    cleanup();
    server.close();
  }

  const passed = results.filter((r) => r.pass).length;
  console.log(`\n${passed}/${results.length} 通过`);
  fs.writeFileSync(path.join(ART, 'report.json'), JSON.stringify({ results, consoleErrors }, null, 2));
  if (passed !== results.length) process.exit(1);
}

main().catch((e) => {
  console.error('FATAL', e);
  process.exit(1);
});
