/**
 * 端到端：新建角色 → 抽灵根 → 选择推进 → 存档 / 读档 / 刷新恢复 → 结局触发。
 * 运行：node tests/ui.spec.mjs   （需先 npm run serve）
 */
import pw from '/Users/yskj/node_modules/playwright/index.js';
import fs from 'node:fs';
import path from 'node:path';

const { chromium } = pw;
const BASE = process.env.BASE_URL || 'http://127.0.0.1:4173';
const ART = path.resolve('tests/artifacts');
fs.mkdirSync(ART, { recursive: true });

const results = [];
const consoleErrors = [];
let browser;

function ok(name, detail = '') {
  results.push({ name, pass: true, detail });
  console.log(`  ✔ ${name}${detail ? ` — ${detail}` : ''}`);
}
function fail(name, detail = '') {
  results.push({ name, pass: false, detail });
  console.error(`  ✖ ${name}${detail ? ` — ${detail}` : ''}`);
}
async function check(name, fn) {
  try { const d = await fn(); ok(name, d || ''); } catch (e) { fail(name, e.message); }
}

const state = async (page) => JSON.parse(await page.evaluate(() => window.render_game_to_text()));
const finishTyping = async (page) => page.evaluate(() => window.advanceTime && window.advanceTime());

async function main() {
  browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'zh-CN' });
  const page = await context.newPage();
  page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  page.on('pageerror', (err) => consoleErrors.push('pageerror: ' + err.message));

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(ART, '01-title.png') });

  await check('标题页渲染', async () => {
    const title = await page.textContent('.game-title');
    if (!title.includes('问道长生')) throw new Error('标题缺失: ' + title);
    return title.trim();
  });

  await page.click('#btn-new');
  await page.screenshot({ path: path.join(ART, '02-create.png') });
  await check('出身卡存在', async () => {
    const n = await page.locator('.origin-card').count();
    if (n < 10) throw new Error('出身卡数量 ' + n);
    return `${n} 个出身`;
  });
  await check('未选出身时抽灵根禁用', async () => {
    if (!(await page.isDisabled('#btn-roll'))) throw new Error('按钮应禁用');
  });

  await page.click('.origin-card[data-origin="fallen_clan"]');
  await page.fill('#input-name', '沈砚');
  await page.click('.seg[data-gender="男"]');
  await page.click('#btn-roll');

  await check('灵根抽取动画与结果', async () => {
    await page.waitForFunction(() => {
      const el = document.getElementById('roll-result');
      return el && el.textContent && el.textContent !== '……' && !el.classList.contains('spinning');
    }, { timeout: 5000 });
    const root = (await page.textContent('#roll-result')).trim();
    const desc = (await page.textContent('#roll-desc')).trim();
    if (!root) throw new Error('无灵根结果');
    await page.screenshot({ path: path.join(ART, '03-roll.png') });
    return `${root} · ${desc.slice(0, 18)}…`;
  });

  await page.click('button[data-act="accept"]');
  await page.waitForSelector('#game-screen:not([hidden])');
  await finishTyping(page);
  await page.screenshot({ path: path.join(ART, '04-game-hub.png') });

  await check('进入游戏：角色与行动按钮', async () => {
    const s = await state(page);
    if (s.char.name !== '沈砚') throw new Error('名字不对: ' + s.char.name);
    if (!s.choices.length) throw new Error('没有选项');
    return `${s.char.name} · ${s.char.root} · ${s.choices.length} 个行动`;
  });

  await check('属性面板显示境界与修为', async () => {
    const txt = await page.textContent('#char-panel');
    if (!txt.includes('修为') || !txt.includes('寿元')) throw new Error('面板缺少字段');
    return txt.replace(/\s+/g, ' ').slice(0, 40);
  });

  // 点第一个行动，验证文本替换与自动存档
  const before = await state(page);
  await page.click('#choices .choice:not([disabled])');
  await finishTyping(page);
  await page.screenshot({ path: path.join(ART, '05-after-action.png') });
  await check('选择后剧情推进', async () => {
    const s = await state(page);
    if (s.text === before.text && s.scene === before.scene) throw new Error('文本未变化');
    const hasSave = await page.evaluate(() => Boolean(localStorage.getItem('wendao.v3.slot.0')));
    if (!hasSave) throw new Error('自动存档未写入');
    return `scene=${s.scene}`;
  });

  // 继续按钮
  await check('结果页出现「继续」并可返回 hub', async () => {
    const s1 = await state(page);
    if (!s1.result) return '本次直接进入事件，无需继续';
    await page.click('#choices .choice');
    await finishTyping(page);
    const s2 = await state(page);
    if (s2.scene === s1.scene && s2.result === s1.result) throw new Error('继续无效');
    return `→ ${s2.scene}`;
  });

  // 键盘数字选择
  await check('数字键 1 可选择', async () => {
    const s = await state(page);
    if (!s.choices.filter((c) => !c.disabled).length) throw new Error('无可选项');
    await page.keyboard.press('1');
    await finishTyping(page);
    const s2 = await state(page);
    if (s2.text === s.text) throw new Error('键盘选择无效');
    return s2.scene;
  });

  // 存档到 1 号位
  await page.click('#btn-save');
  await page.waitForSelector('#save-overlay:not([hidden])');
  await page.screenshot({ path: path.join(ART, '06-save.png') });
  await check('存档面板列出手动槽', async () => {
    const slots = await page.locator('.slot').count();
    if (slots < 4) throw new Error('槽位数量 ' + slots);
    return `${slots} 个槽`;
  });
  await page.click('button[data-act="save"][data-slot="1"]');
  await check('写入 1 号存档', async () => {
    const raw = await page.evaluate(() => localStorage.getItem('wendao.v3.slot.1'));
    if (!raw) throw new Error('未写入');
    const d = JSON.parse(raw);
    if (!d.state?.char?.name) throw new Error('存档结构不对');
    return `${d.state.char.name} · 第${d.state.turn}回合`;
  });
  await page.click('[data-close="save-overlay"]');

  // 刷新后继续
  await page.reload({ waitUntil: 'networkidle' });
  await check('刷新后出现「继续」', async () => {
    const label = await page.textContent('#btn-continue');
    if (!label.includes('继续')) throw new Error('按钮文案 ' + label);
    return label.trim();
  });
  await page.click('#btn-continue');
  await page.waitForSelector('#game-screen:not([hidden])');
  await finishTyping(page);
  await check('继续后状态恢复', async () => {
    const s = await state(page);
    if (s.char.name !== '沈砚') throw new Error('名字丢失');
    return `${s.char.name} · ${s.scene}`;
  });

  // 读档
  await page.click('#btn-load');
  await page.click('button[data-act="load"][data-slot="1"]');
  await finishTyping(page);
  await check('从 1 号存档读取', async () => {
    const s = await state(page);
    if (s.char.name !== '沈砚') throw new Error('读取失败');
    return `${s.char.name} · 第${s.scene}场`;
  });

  // 分支：直接驱动一次事件并验证按钮/效果
  await check('事件分支：古井神识检定', async () => {
    await page.evaluate(() => {
      const g = window.__game;
      g.state.char.attrs.神识 = 40;
      g.openScene('ev_old_well');
    });
    await finishTyping(page);
    const s1 = await state(page);
    const usable = s1.choices.filter((c) => !c.disabled);
    if (usable.length < 2) throw new Error('可用选项不足');
    await page.click('#choices .choice:not([disabled])');
    await finishTyping(page);
    const s2 = await state(page);
    if (s2.text === s1.text) throw new Error('分支未推进');
    await page.screenshot({ path: path.join(ART, '07-branch.png') });
    return '选择生效';
  });

  // 结局
  await check('结局页与轮回入口', async () => {
    await page.evaluate(() => {
      const g = window.__game;
      g.finishEnding('e_ascend');
      window.__render();
    });
    await finishTyping(page);
    const s = await state(page);
    if (s.scene !== 'ending') throw new Error('未进入结局: ' + s.scene);
    const title = await page.textContent('#scene-title');
    const text = await page.textContent('#scene-text');
    if (!text.includes('天门')) throw new Error('结局文本缺失');
    await page.screenshot({ path: path.join(ART, '08-ending.png') });
    return title.trim();
  });

  await check('轮回回到建角并保留图鉴', async () => {
    await page.click('#choices .choice:not([disabled])');
    await page.waitForSelector('#create-screen:not([hidden])');
    const meta = await page.evaluate(() => JSON.parse(localStorage.getItem('wendao.v3.meta') || 'null'));
    if (!meta?.unlockedEndings?.includes('e_ascend')) throw new Error('结局未记录');
    return `结局 ${meta.unlockedEndings.length} 个`;
  });

  await check('图鉴可打开并显示隐藏成就', async () => {
    await page.click('#btn-back-title');
    await page.click('#btn-gallery');
    await page.waitForSelector('#codex-overlay:not([hidden])');
    const text = await page.textContent('#codex-body');
    if (!text.includes('？？？')) throw new Error('隐藏项未遮蔽');
    await page.screenshot({ path: path.join(ART, '09-codex.png') });
    return '已渲染';
  });

  await check('无控制台错误', async () => {
    const real = consoleErrors.filter((e) => !e.includes('favicon'));
    if (real.length) throw new Error(real.slice(0, 3).join(' | '));
    return '0 error';
  });

  await browser.close();

  const passed = results.filter((r) => r.pass).length;
  console.log(`\n${passed}/${results.length} 通过`);
  fs.writeFileSync(path.join(ART, 'report.json'), JSON.stringify({ results, consoleErrors }, null, 2));
  if (passed !== results.length) process.exit(1);
}

main().catch(async (e) => {
  console.error('FATAL', e);
  if (browser) await browser.close();
  process.exit(1);
});
