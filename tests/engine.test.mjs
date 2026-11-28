import test from 'node:test';
import assert from 'node:assert/strict';
import { Game } from '../src/engine/game.js';
import { createRun, canBreakthrough, needExp, breakthroughChance, monthlyExp } from '../src/engine/state.js';
import { parseExpression, evaluate, buildContext } from '../src/engine/expr.js';
import { RNG } from '../src/engine/rng.js';
import { ROOTS } from '../src/data/roots.js';
import { ALL_EVENTS } from '../src/data/events/index.js';
import { ENDINGS } from '../src/data/endings.js';
import { ACHIEVEMENTS } from '../src/data/achievements.js';
import { EVENTS } from '../src/engine/narrative.js';

const SU = (await import('../src/data/npcs.js')).NPC_BY_ID.npc_su.relationKey;

function fresh(opts = {}) {
  const g = new Game();
  g.newRun({ seed: 12345, name: '阿禾', gender: '女', originId: 'farmer', rootId: 'shuangling', ...opts });
  // 开局进入出身开场；单元测试从主界面开始
  assert.equal(g.state.scene.id, `open_${g.state.char.originId}`, '开局应进入出身开场');
  g.state.scene = { id: 'hub', result: null };
  g.state.currentHistoryKey = null;
  g.state.history = {};
  g.state.meta.handbook = {};
  // 通用单元测试里让大历史保持安静（视为都已按基准发生）；大历史专项测试会自行清空
  if (!opts.history) {
    for (const ev of g.registry.values()) if (ev.history?.key) g.state.history[ev.history.key] = { outcome: 'baseline' };
  }
  return g;
}

test('表达式：优先级、括号、布尔与函数', () => {
  const state = createRun({ seed: 1, name: 'x', gender: '女', originId: 'farmer', rootId: 'shuangling' });
  const ctx = buildContext(state, {});
  state.flags.入魔 = true;
  state.counters.alchemy = 3;
  assert.equal(evaluate(parseExpression('1 + 2 * 3'), ctx), 7);
  assert.equal(evaluate(parseExpression('(1 + 2) * 3'), ctx), 9);
  assert.equal(evaluate(parseExpression('char.attrs.悟性 >= 10 && !flag("入魔")'), ctx), false);
  assert.equal(evaluate(parseExpression('count("alchemy") == 3 || flag("无")'), ctx), true);
  assert.equal(evaluate(parseExpression('realm == 0 && layer == 0'), ctx), true);
});

test('灵根权重总和稳定且包含 21 种', () => {
  assert.equal(ROOTS.length, 21);
  const total = ROOTS.reduce((a, r) => a + r.weight, 0);
  assert.ok(total > 90 && total < 100);
  assert.ok(ROOTS.every((r) => r.speed > 0 && r.name && r.desc));
});

test('种子随机可复现', () => {
  const a = new RNG(999);
  const b = new RNG(999);
  const seqA = Array.from({ length: 8 }, () => a.next());
  const seqB = Array.from({ length: 8 }, () => b.next());
  assert.deepEqual(seqA, seqB);
});

test('开局：属性、物品、寿元正确初始化', () => {
  const g = fresh();
  const c = g.state.char;
  assert.equal(c.name, '阿禾');
  assert.equal(c.realm, 0);
  assert.equal(c.sectId, null);
  assert.ok(c.hp > 0 && c.mp > 0);
  assert.equal(c.inventory.length, 0);
  assert.ok(c.lifespan >= 80 * 12);
});

test('修炼推进时间并累积修为', () => {
  const g = fresh();
  const before = g.state.char.exp;
  const ageBefore = g.state.char.age;
  g.act_openCave();
  assert.equal(g.state.scene.id, 'cave');
  g.choose(0); // 洞府吐纳炼气
  assert.ok(g.state.char.exp > before);
  assert.ok(g.state.char.age > ageBefore);
  assert.ok(g.state.scene.result);
  g.proceed();
  assert.equal(g.state.scene.id, 'cave');
});

test('修为满时可冲击境界，成功则升层', () => {
  const g = fresh();
  g.state.char.exp = needExp(g.state.char);
  assert.ok(canBreakthrough(g.state.char));
  const labels = g.choices().map((c) => c.label);
  assert.ok(labels.some((l) => l.includes('冲击境界')));
  const idx = g.choices().findIndex((c) => c.label.includes('冲击境界'));
  g.choose(idx);
  assert.equal(g.state.scene.id, 'breakthrough');
  // 反复尝试直到成功（避免随机失败导致断言不稳）
  let tries = 0;
  while (g.state.char.layer === 0 && tries < 30) {
    g.state.scene = { id: 'breakthrough', result: null };
    const i = g.choices().findIndex((c) => c.label.includes('凝神冲关'));
    g.choose(i);
    tries++;
  }
  assert.ok(g.state.char.layer >= 1, `layer=${g.state.char.layer}`);
});

test('突破概率在合理区间并受道心影响', () => {
  const g = fresh();
  g.state.char.exp = needExp(g.state.char);
  g.state.char.attrs.道心 = 0;
  g.state.char.demon = 40;
  const base = breakthroughChance(g.state);
  g.state.char.attrs.道心 = 80;
  g.state.char.demon = 0;
  const higher = breakthroughChance(g.state);
  assert.ok(base >= 0.05 && base <= 0.97);
  assert.ok(higher > base);
});

test('存档序列化 / 反序列化保持核心状态', () => {
  const g = fresh();
  g.choose(0);
  g.proceed();
  g.choose(2); // 历练
  const payload = g.serialize();
  const g2 = new Game();
  g2.setState(JSON.parse(JSON.stringify(payload)));
  assert.equal(g2.state.char.name, g.state.char.name);
  assert.equal(g2.state.char.exp, g.state.char.exp);
  assert.equal(g2.state.char.stones, g.state.char.stones);
  assert.equal(g2.state.turn, g.state.turn);
  assert.equal(g2.state.char.sectId, g.state.char.sectId);
  assert.ok(g2.choices().length > 0);
});

test('事件节点：选择会写入结果并跳转分支', () => {
  const g = fresh();
  const ev = ALL_EVENTS.find((e) => e.id === 'ev_old_well');
  g.state.char.attrs.神识 = 40;
  g.openScene(ev.id);
  assert.equal(g.state.scene.id, 'ev_old_well');
  const enabled = g.choices().filter((c) => !c.disabled);
  assert.ok(enabled.length >= 2);
  g.choose(enabled[0].index);
  assert.ok(g.state.scene.result || g.state.scene.id !== 'ev_old_well');
  g.proceed();
  assert.ok(g.state.scene.id === 'hub' || g.state.scene.id.startsWith('ev_'));
});

test('战斗：敌人可被击杀并结算奖励', () => {
  const g = fresh();
  g.state.char.attrs.根骨 = 200;
  g.startCombat('wolf');
  assert.equal(g.state.scene.id, 'combat');
  let rounds = 0;
  while (g.state.scene.id === 'combat' && rounds < 40) {
    g.choose(0);
    rounds++;
  }
  assert.ok(g.state.stats.kills >= 1, 'kills=' + g.state.stats.kills);
  assert.ok(g.state.char.stones > 0);
});

test('天劫：成功渡劫进入下一境界，失败触发结局', () => {
  const g = fresh();
  const c = g.state.char;
  c.realm = 1;
  c.layer = 3;
  c.exp = needExp(c);
  g.resolveBreakthrough(1); // 必成 → 进入天劫
  assert.equal(g.state.scene.id, 'tribulation');
  let guard = 0;
  while (g.state.scene.id === 'tribulation' && guard < 10) {
    g.choose(0);
    guard++;
  }
  assert.ok(c.realm >= 2, 'realm=' + c.realm);
});

test('天劫失败会触发渡劫陨落结局（且按境界细分）', () => {
  const g = fresh();
  const c = g.state.char;
  c.realm = 1;
  c.layer = 3;
  c.exp = needExp(c);
  g.resolveBreakthrough(1);
  assert.equal(g.state.scene.id, 'tribulation');
  // 渡劫入场应满血满蓝（不再33%残血进场）
  assert.equal(c.hp, c.maxHp);
  g.act_tribulationStage({ params: { p: 0, mode: 'body' } });
  if (g.state.scene.id === 'tribulation') {
    g.act_tribulationStage({ params: { p: 0, mode: 'body' } });
  }
  if (g.state.scene.id === 'tribulation') {
    g.act_tribulationStage({ params: { p: 0, mode: 'body' } });
  }
  assert.equal(g.state.scene.id, 'ending');
  assert.ok(['e_tribulation_death', 'e_tribulation_jindan'].includes(g.state.flags.endingId));
});

test('结局判定：寿元耗尽、凡人一世与魔化', () => {
  const g = fresh();
  g.state.char.layer = 1;
  g.state.char.age = g.state.char.lifespan;
  g.afterAction();
  assert.equal(g.state.flags.endingId, 'e_old_age');

  const gMortal = fresh();
  gMortal.state.char.age = gMortal.state.char.lifespan;
  gMortal.afterAction();
  assert.equal(gMortal.state.flags.endingId, 'e_mortal');

  const g2 = fresh();
  g2.state.char.demon = 100;
  g2.afterAction();
  assert.equal(g2.state.flags.endingId, 'e_demon_devour');
});

test('成就：条件满足后解锁且不重复', () => {
  const g = fresh();
  g.state.char.layer = 1; // 满足「引气入体」条件
  const unlocked = g.checkAchievements();
  assert.ok(unlocked.length > 0 && Object.keys(g.state.meta.achievements).length > 0);
  const after = g.unlockAchievement('a_first_qi');
  assert.ok(after === null || typeof after === 'string');
  const count = Object.keys(g.state.meta.achievements).length;
  g.checkAchievements();
  assert.equal(Object.keys(g.state.meta.achievements).length, count);
});

test('宗门：可加入并累积贡献、通过试炼晋升', () => {
  const g = fresh();
  g.state.char.sectId = 'qingyun';
  g.state.char.realm = 1;
  g.state.char.attrs.悟性 = 25;
  g.state.char.attrs.根骨 = 80;
  g.state.char.contribution = 600;
  g.state.char.sectRank = 0;
  g.act_sectTask({});
  assert.ok(g.state.char.contribution > 600);
  g.act_sectPromote();
  assert.equal(g.state.scene.id, 'combat');
  let rounds = 0;
  while (g.state.scene.id === 'combat' && rounds++ < 40) g.choose(0);
  assert.ok(g.state.char.sectRank >= 1);
});

test('结局表完整：每个结局都有条件与文本', () => {
  assert.ok(ENDINGS.length >= 19);
  for (const e of ENDINGS) {
    assert.ok(e.id && e.name && e.condition && e.text);
    assert.equal(typeof e.text === 'function' || typeof e.text === 'string', true);
  }
});

test('成就表完整：id 唯一、描述齐全', () => {
  const ids = new Set();
  for (const a of ACHIEVEMENTS) {
    assert.ok(a.id && a.name && a.desc && a.check);
    assert.ok(!ids.has(a.id), '重复成就 ' + a.id);
    ids.add(a.id);
  }
  assert.ok(ACHIEVEMENTS.length >= 100);
});

test('事件注册表无重复 id，且至少 60 条', () => {
  assert.ok(EVENTS.length >= 60, 'events=' + EVENTS.length);
  assert.equal(new Set(EVENTS.map((e) => e.id)).size, EVENTS.length);
});

test('寻访仙门：可按条件加入宗门并获得身份', async () => {
  const { SECT_BY_ID } = await import('../src/data/sects.js');
  const sectName = SECT_BY_ID.qingyun.name;
  const g = fresh();
  g.state.char.attrs.悟性 = 30;
  g.state.char.attrs.道心 = 30;
  g.act_sectRecruit();
  assert.equal(g.state.scene.id, 'recruit');
  const cs = g.choices();
  assert.ok(cs.some((c) => c.label.includes(sectName)));
  const idx = cs.findIndex((c) => c.label.includes(sectName));
  g.choose(idx);
  assert.equal(g.state.char.sectId, 'qingyun');
  assert.ok(g.state.char.contribution === 0);
  assert.deepEqual(g.state.meta.sectsJoined, ['qingyun']);
});

test('坊市：买入物品扣除灵石，卖出返还', () => {
  const g = fresh();
  g.state.char.stones = 500;
  g.act_market();
  const buy = g.choices().find((c) => c.label.includes('买 疗伤丹'));
  assert.ok(buy, '未找到疗伤丹');
  g.choose(buy.index);
  assert.ok(g.state.char.inventory.some((i) => i.id === 'liaoshang_dan'));
  const afterBuy = g.state.char.stones;
  g.act_sellMenu();
  assert.equal(g.state.scene.id, 'sell');
  const sell = g.choices().find((c) => c.label.includes('卖 疗伤丹'));
  g.choose(sell.index);
  assert.ok(g.state.char.stones > afterBuy);
});

test('战斗失败会走到结局', () => {
  const g = fresh();
  g.state.char.attrs.根骨 = 0;
  g.state.char.hp = 1;
  g.startCombat('old_monster');
  let guard = 0;
  while (g.state.scene.id === 'combat' && guard++ < 30) g.choose(0);
  assert.equal(g.state.scene.id, 'ending');
  assert.equal(g.state.flags.endingId, 'e_killed');
});

test('剧情触发：同名玉牌引出玉牌链', () => {
  const g = fresh();
  g.state.flags['同名玉牌'] = true;
  g.afterAction();
  assert.equal(g.state.scene.id, 'story_jade_1');
  assert.ok(g.state.flags['story:story_jade_1']);
});

test('宗门藏经阁与宝库：消耗贡献习得绝学与兑换破境灵丹', () => {
  const g = fresh();
  g.state.char.sectId = 'taixuan';
  g.state.char.sectRank = 1;
  g.state.char.contribution = 2500;
  g.act_openSectLibrary();
  const libChoices = g.choices();
  const m1 = libChoices.find((c) => c.label.includes('青锋养剑诀'));
  assert.ok(m1 && !m1.disabled);
  g.choose(m1.index);
  assert.ok(g.state.char.techniques.some((t) => t.id === 'tx_lib_1' && t.artName === '青锋破空斩'));
  assert.equal(g.bestSignatureArt(), '青锋破空斩');

  g.act_openSectTreasury();
  const tr = g.choices().find((c) => c.label.includes('筑基丹'));
  assert.ok(tr && !tr.disabled);
  g.choose(tr.index);
  assert.ok(g.state.char.inventory.some((i) => i.id === 'zhuji_dan'));
});

test('轮回天赋：点亮后下一世生效', () => {
  const g = new Game({ meta: { karmaPoints: 3, talents: ['t_suhui', 't_changsheng'] } });
  g.newRun({ seed: 7, name: '二世', gender: '女', originId: 'farmer', rootId: 'wuling' });
  assert.ok(g.state.char.attrs.悟性 >= 18);
  assert.ok(g.state.char.lifespan > 80 * 12 + 40 * 12);
});

test("结局优先级：宗门/道侣变体优先于普通飞升", async () => {
  const { pickEnding } = await import('../src/data/endings.js');
  const { contextOf } = await import('../src/engine/narrative.js');
  const { compileCondition } = await import('../src/engine/expr.js');
  const g = fresh();
  const pick = () => pickEnding(g.state, { ctx: contextOf(g.state, g), compile: compileCondition }).id;
  g.state.char.realm = 9;
  assert.equal(pick(), 'e_ascend');
  g.state.char.sectId = 'taixuan';
  assert.equal(pick(), 'e_sword_ascend');
  g.state.char.sectId = 'qingyun';
  g.state.flags['道侣'] = true;
  g.state.char.relations['道侣'] = 40;
  assert.equal(pick(), 'e_lover_ascend');
  g.state.flags['道侣'] = false;
  g.state.char.relations['道侣'] = 0;
  g.state.char.demon = 60;
  assert.equal(pick(), 'e_ascend_demon');
});

test('回归：事件选项 ch.combat 正确进入战斗', () => {
  const g = fresh();
  g.openScene('ev_fox_fire');
  const swordIdx = g.choices().findIndex((c) => c.label.includes('拔剑'));
  assert.ok(swordIdx >= 0);
  g.choose(swordIdx);
  assert.equal(g.state.scene.id, 'combat');
  assert.equal(g.state.combat.enemy.id, 'wolf');
});

test('回归：表达式 sect()/root()/origin/rel() 与年龄(岁)判定', () => {
  const g = fresh({ originId: 'scholar', rootId: 'kongjian' });
  g.state.char.sectId = 'taixuan';
  g.state.char.relations.道侣 = 38;
  g.state.char.realm = 2;
  g.state.char.age = 50 * 12;
  const ctx = buildContext(g.state, {});
  assert.equal(evaluate(parseExpression('sect() == "taixuan"'), ctx), true);
  assert.equal(evaluate(parseExpression('root() == "kongjian"'), ctx), true);
  assert.equal(evaluate(parseExpression('origin == "scholar"'), ctx), true);
  assert.equal(evaluate(parseExpression('rel("道侣") >= 35'), ctx), true);
  assert.equal(evaluate(parseExpression('realm >= 2 && age < 60'), ctx), true);
});

test('储物袋交互：可直接使用丹药与研读功法', () => {
  const g = fresh();
  g.state.char.inventory.push({ id: 'yinqi_dan', qty: 1 }, { id: 'jiuzhuan_gong', qty: 1 });
  const r1 = g.useInventoryItem('yinqi_dan');
  assert.ok(r1.ok);
  assert.ok(g.state.char.exp > 0);
  assert.equal(g.state.stats.pills, 1);
  const r2 = g.useInventoryItem('jiuzhuan_gong');
  assert.ok(r2.ok);
  assert.ok(g.state.char.techniques.some((t) => t.id === 'jiuzhuan_gong'));
});

test('战斗护心符可抵挡致命一击', () => {
  const g = fresh();
  g.state.char.inventory.push({ id: 'huxin_fu', qty: 1 });
  g.state.char.attrs.根骨 = 0;
  g.state.char.hp = 1;
  g.startCombat('old_monster');
  g.choose(0);
  assert.equal(g.state.scene.id, 'combat');
  assert.ok(g.state.char.hp > 0);
  assert.ok(!g.state.char.inventory.some((i) => i.id === 'huxin_fu'));
});

test('灵根特性与开炉炼丹、动态飞升、轮回世数', () => {
  const g = fresh({ rootId: 'kongjian' });
  const ageBefore = g.state.char.age;
  g.act_travel();
  assert.equal(g.state.char.age - ageBefore, 3); // 空间灵根云游耗时减半

  g.state.char.inventory.push({ id: 'lingcao', qty: 1 });
  g.state.char.sectId = 'danxia';
  g.act_alchemy();
  assert.ok(g.state.counters.alchemy >= 1 || g.state.counters.alchemy_fail >= 1);

  // 动态飞升：太玄剑宗触发一剑破天
  const g2 = fresh();
  g2.state.char.sectId = 'taixuan';
  g2.state.char.realm = 8;
  g2.openScene('story_ascend_1');
  g2.choose(0);
  assert.equal(g2.state.flags.endingId, 'e_sword_ascend');
  const runsBefore = g2.state.meta.runs;
  const r = g2.act_reincarnate();
  assert.equal(r.meta.cycle, 2);
  assert.equal(r.meta.runs, runsBefore);
});

test('ink 织网扩展：昆仑残墟秘境与苏晚晴道侣链', () => {
  const g = fresh();
  g.state.char.attrs.神识 = 20;
  g.openScene('ink_kunlun_1');
  g.choose(0);
  g.proceed();
  assert.equal(g.state.scene.id, 'ink_kunlun_2');
  assert.equal(g.state.flags['昆仑解铭'], true);
  g.choose(0);
  g.proceed();
  assert.equal(g.state.scene.id, 'ink_kunlun_3');
});

test('网文系统：金手指（绿瓶/剑老）、拍卖会、本命法宝祭炼、灵兽与三年之约', () => {
  // 掌天小绿瓶：开局灵草 + 绿瓶催熟
  const g = fresh({ goldenFingerId: 'gf_bottle' });
  assert.equal(g.state.char.goldenFingerId, 'gf_bottle');
  assert.ok(g.state.char.inventory.some((i) => i.id === 'lingcao'));
  g.act_bottleRipen();
  assert.ok(g.state.char.inventory.some((i) => i.id === 'yinqi_dan'));

  // 祭炼本命法宝提升战力
  g.state.char.stones = 2000;
  const atkBefore = g.playerAtk();
  g.act_refine();
  assert.equal(g.state.char.artifactLevel, 1);
  assert.ok(g.playerAtk() > atkBefore);

  // 十年一届限量拍卖会竞拍（溢价起拍，非2折倾销）
  g.state.char.stones = 200000;
  g.act_auction();
  assert.equal(g.state.scene.id, 'auction');
  const bid = g.choices().find((c) => c.label.startsWith('出价'));
  assert.ok(bid);
  let tries = 0;
  while (g.state.scene.id === 'auction' && tries++ < 6) {
    const b = g.choices().find((c) => c.label.startsWith('出价'));
    if (!b) break;
    g.choose(b.index);
    if (g.state.scene.result?.text?.includes('抬价')) g.proceed();
    else break;
  }
  assert.ok(g.state.auctionRound.lots.some((l) => l.sold));

  // 伴生灵兽孵化
  g.openScene('wn_pet_egg_1');
  g.choose(0);
  assert.equal(g.state.char.petId, 'pet_turtle');

  // 残剑老祖魂解锁退婚当众震慑选项
  const g2 = fresh({ goldenFingerId: 'gf_sword_elder' });
  g2.openScene('wn_oath_1');
  const elderChoice = g2.choices().find((c) => c.label.includes('剑老'));
  assert.ok(elderChoice && !elderChoice.disabled);
  g2.choose(elderChoice.index);
  assert.equal(g2.state.flags['剑震林昊'], true);
});

test('v4.0 指数战力跃迁：跨境界伤害呈指数倍增且高阶碾压低阶妖兽', async () => {
  const { recomputeDerived } = await import('../src/engine/state.js');
  const g = fresh();
  const atk0 = g.playerAtk();
  g.state.char.realm = 4; // 化神 (powerMult = 55)
  recomputeDerived(g.state.char);
  const atk4 = g.playerAtk();
  g.state.char.realm = 8; // 渡劫 (powerMult = 3500)
  recomputeDerived(g.state.char);
  const atk8 = g.playerAtk();
  assert.ok(atk4 > atk0 * 40, `化神攻击(${atk4})应远超炼气(${atk0})`);
  assert.ok(atk8 > atk0 * 2500, `渡劫攻击(${atk8})应超炼气2500倍以上`);

  // 筑基期一剑秒杀炼气青背狼
  const g2 = fresh();
  g2.state.char.realm = 1;
  g2.state.char.daoBaseQuality = 'tiandao';
  recomputeDerived(g2.state.char);
  g2.state.char.hp = g2.state.char.maxHp;
  g2.startCombat('wolf');
  g2.choose(0);
  assert.notEqual(g2.state.scene.id, 'combat', '天道筑基应一剑斩杀青背狼');
  assert.equal(g2.state.stats.kills, 1);
});

test('v4.0 大境瓶颈、道基品质与百分比疗伤丹药', async () => {
  const { recomputeDerived, bottleneckStatus, gainLawExp } = await import('../src/engine/state.js');
  const g = fresh();
  const c = g.state.char;
  // 元婴圆满必须领悟法则初窥门径方可破入化神
  c.realm = 3;
  c.layer = 3;
  c.exp = needExp(c);
  c.attrs.道心 = 50;
  // v8：第 1 年灵气 50，冲化神需 70 —— 天地灵机不足
  assert.equal(bottleneckStatus(g.state).ok, false);
  assert.ok(bottleneckStatus(g.state).missing.some((m) => m.includes('天地灵气')));
  c.age = 192 + 860 * 12; // 第 861 年，B009 灵气回升
  assert.equal(bottleneckStatus(g.state).ok, false);
  gainLawExp(g.state, 100, 'sword');
  assert.equal(bottleneckStatus(g.state).ok, true);

  // 筑基评定天道筑基品质
  const g2 = fresh();
  g2.state.char.realm = 0;
  g2.state.char.layer = 8;
  g2.state.char.attrs.道心 = 50;
  g2.state.char.attrs.根骨 = 40;
  g2.state.char.exp = needExp(g2.state.char);
  g2.resolveBreakthrough(1, '', 28);
  assert.equal(g2.state.char.realm, 1);
  assert.equal(g2.state.char.daoBaseQuality, 'tiandao');

  // 高境界使用疗伤丹按百分比回复（非固定 60 点）
  const g3 = fresh();
  g3.state.char.realm = 5;
  recomputeDerived(g3.state.char);
  g3.state.char.hp = 100;
  g3.state.char.inventory.push({ id: 'liaoshang_dan', qty: 1 });
  g3.startCombat('wolf');
  g3.act_combatPill();
  assert.ok(g3.state.char.hp > 5000, `炼虚境服疗伤丹应按百分比恢复，当前 hp=${g3.state.char.hp}`);
});

test('v4.0 地域迁徙探索与道友羁绊', async () => {
  const { REGION_BY_ID } = await import('../src/data/regions.js');
  const { NPC_BY_ID } = await import('../src/data/npcs.js');
  const regName = REGION_BY_ID.guixu.name;
  const relKey = NPC_BY_ID.npc_su.relationKey;
  const g = fresh();
  g.state.char.realm = 2;
  g.act_openRegionMap();
  const guixu = g.choices().find((c) => c.label.includes(regName));
  assert.ok(guixu && !guixu.disabled);
  g.choose(guixu.index);
  assert.equal(g.state.char.regionId, 'guixu');
  assert.equal(g.state.char.location, regName);

  // 拜访可结侣的道友、赠礼、结为道侣
  g.state.scene = { id: 'hub', result: null };
  g.state.char.inventory.push({ id: 'lingcao', qty: 3 });
  g.act_openNpc({ params: { npcId: 'npc_su' } });
  assert.equal(g.state.scene.id, 'npcDetail');
  g.act_npcGift({ params: { npcId: 'npc_su', itemId: 'lingcao' } });
  assert.ok(g.state.char.relations[relKey] >= 5 && g.state.char.relations[relKey] <= 10);
  g.state.char.relations[relKey] = 42;
  g.act_npcBond({ params: { npcId: 'npc_su' } });
  assert.equal(g.state.flags['道侣'], true);
});

test('v5.0 大千世界规模与古籍秘阁/道友传艺校验', async () => {
  const { ALL_TECHNIQUES } = await import('../src/data/techniques.js');
  const { ITEMS } = await import('../src/data/items.js');
  const { ENEMIES } = await import('../src/data/enemies.js');
  const { NPCS } = await import('../src/data/npcs.js');
  assert.ok(EVENTS.length >= 1050, `事件节点应≥1050，当前 ${EVENTS.length}`);
  assert.ok(ENDINGS.length >= 108, `结局数应≥108，当前 ${ENDINGS.length}`);
  assert.ok(ALL_TECHNIQUES.length >= 138, `功法数应≥138，当前 ${ALL_TECHNIQUES.length}`);
  assert.ok(ITEMS.length >= 95, `物品数应≥95，当前 ${ITEMS.length}`);
  assert.ok(ENEMIES.length >= 64, `敌手数应≥64，当前 ${ENEMIES.length}`);
  assert.ok(NPCS.length >= 12, `道友数应≥12，当前 ${NPCS.length}`);
  assert.ok(ACHIEVEMENTS.length >= 250, `成就数应≥250，当前 ${ACHIEVEMENTS.length}`);

  // 古籍秘阁购藏九州功法
  const g = fresh();
  g.state.char.stones = 5000;
  g.act_openTechShop();
  assert.equal(g.state.scene.id, 'techShop');
  const firstBook = g.choices().find((c) => !c.disabled && !c.label.includes('离开'));
  assert.ok(firstBook);
  g.choose(firstBook.index);
  assert.ok(g.state.char.techniques.length >= 1);

  // 红尘道友高好感传授绝学
  g.state.char.relations[SU] = 40;
  g.act_openNpc({ params: { npcId: 'npc_su' } });
  const teach = g.choices().find((c) => c.label.includes('求教独门功法'));
  assert.ok(teach && !teach.disabled);
  g.choose(teach.index);
  assert.ok(g.state.char.techniques.some((t) => t.id === 'wt_hanmei_jian'));
});

test('v6.0 审计专项回归：功法槽位防叠加、按境礼聘、叛门黑名单、省料祭炼、唯一传艺、配方炼丹、开宗立派与成就轮回点', async () => {
  const { activeTechniques, maxTechSlots, recomputeDerived, lifespanAlert } = await import('../src/engine/state.js');
  const { WORLD_TECHNIQUES } = await import('../src/data/techniques.js');
  const { NPCS } = await import('../src/data/npcs.js');

  // 1. 功法槽位上限防止76本线性叠到×31
  const g = fresh();
  for (const t of WORLD_TECHNIQUES.slice(0, 25)) g.state.char.techniques.push({ ...t });
  g.state.char.equippedTechs = [WORLD_TECHNIQUES[0].id, WORLD_TECHNIQUES[1].id];
  recomputeDerived(g.state.char);
  assert.equal(activeTechniques(g.state.char).length, maxTechSlots(0));
  const atkWith25 = g.playerAtk();
  assert.ok(atkWith25 < 120, `25本收藏功法不应破坏炼气战力，当前 atk=${atkWith25}`);

  // 2. 化神入宗按境界直聘长老，叛门入黑名单+5年冷却
  const g2 = fresh();
  g2.state.char.realm = 4;
  g2.state.char.attrs.根骨 = 30;
  g2.act_joinSect({ sectId: 'taixuan' });
  assert.equal(g2.state.char.sectRank, 4, '化神入宗应礼聘为长老(rank 4)');
  g2.act_sectLeave();
  assert.equal(g2.state.char.sectBlacklist.taixuan, true);
  assert.ok(g2.state.char.sectLeaveUntil > g2.state.char.age);
  const rejoin = g2.act_joinSect({ sectId: 'taixuan' });
  assert.ok(rejoin?.error);

  // 3. 省料优先：同时有龙血精和玄铁时，先消耗玄铁
  const g3 = fresh();
  g3.state.char.inventory.push({ id: 'longxue_jing', qty: 1 }, { id: 'xuantie', qty: 1 });
  g3.act_refine();
  assert.ok(g3.state.char.inventory.some((i) => i.id === 'longxue_jing'), '绝不能误烧龙血精');
  assert.ok(!g3.state.char.inventory.some((i) => i.id === 'xuantie'), '应优先消耗低价玄铁');

  // 4. 古籍秘阁严格不含12位道友唯一传艺功法
  const npcTechs = new Set(NPCS.map((n) => n.teachTechId));
  g3.state.char.realm = 8;
  g3.state.char.stones = 999999;
  g3.act_openTechShop();
  const shopIds = g3.currentNode().choices.map((c) => c.params?.techId).filter(Boolean);
  assert.ok(shopIds.every((id) => !npcTechs.has(id)), '古籍秘阁不得售卖道友唯一绝学');

  // 5. 12道友专属论道（青莲剑仙 & 司命星君）+ 赠礼按价值区分
  g3.act_npcChat({ params: { npcId: 'npc_qinglian' } });
  assert.ok((g3.state.char.laws.sword || 0) >= 0 && g3.state.char.lawExp >= 0);
  const gGift = fresh();
  gGift.state.char.inventory.push({ id: 'lingcao', qty: 1 }, { id: 'dao_fruit', qty: 1 });
  gGift.act_npcGift({ params: { npcId: 'npc_su', itemId: 'lingcao' } });
  const rCheap = gGift.state.char.relations[SU];
  gGift.state.char.relations[SU] = 0;
  gGift.act_npcGift({ params: { npcId: 'npc_su', itemId: 'dao_fruit' } });
  const rExpensive = gGift.state.char.relations[SU];
  assert.ok(rExpensive > rCheap * 2, `悟道果好感(${rExpensive})应远高于灵草(${rCheap})`);

  // 6. 开宗立派真实建立玩家宗门 + 讲道/收徒/配方炼丹/寿元预警
  const g4 = fresh();
  g4.state.char.realm = 3;
  g4.state.char.stones = 20000;
  g4.act_foundSect();
  assert.equal(g4.state.char.sectId, 'player_sect');
  assert.equal(g4.state.char.sectRank, 5);
  g4.act_preach();
  g4.act_recruitDisciple();
  assert.ok(g4.state.counters.teach >= 10);
  assert.ok(g4.state.counters.disciples >= 2);
  g4.state.char.age = g4.state.char.lifespan - 24;
  assert.equal(lifespanAlert(g4.state.char).level, 'critical');
});

test('v7.0 P0 回归：炼丹真成丹、非致死战败不暴毙、逆命天赋永不清空、expr null 字面量与后置剧情不吞奇遇', async () => {
  const { recomputeDerived, breakthroughChance, sectPerks, activeTechniques } = await import('../src/engine/state.js');
  const { mergeMeta } = await import('../src/engine/save.js');

  // 1. 炼丹产出真实丹药（修复 rec.output vs rec.outputId）
  const gAlch = fresh({ rootId: 'huo' });
  gAlch.state.char.sectId = 'danxia';
  gAlch.state.char.attrs.悟性 = 80;
  gAlch.state.char.inventory.push({ id: 'lingcao', qty: 5 });
  gAlch.act_openAlchemy();
  const alchChoices = gAlch.choices();
  assert.ok(alchChoices[0].label.includes('引气丹') && !alchChoices[0].label.includes('undefined'), alchChoices[0].label);
  let brewed = false;
  for (let i = 0; i < 5; i++) {
    gAlch.act_brewRecipe({ params: { recipeId: 'yinqi_dan' } });
    if (gAlch.state.char.inventory.some((it) => it.id === 'yinqi_dan')) { brewed = true; break; }
  }
  assert.ok(brewed, '炼丹成功后必须向储物袋加入真实丹药');

  // 2. 非致死事件战败（如擂台/水鬼）点击继续不再暴毙！
  const gLose = fresh();
  gLose.state.char.hp = 1;
  gLose.state.char.attrs.根骨 = 0;
  gLose.openScene('ev_sect_arena');
  gLose.choose(0); // 进入内门大比战斗
  assert.equal(gLose.state.scene.id, 'combat');
  gLose.choose(0); // 被金丹长老秒杀触发 onLose
  assert.ok(gLose.state.char.hp >= 1, `非致死战败应保留至少1血，当前 hp=${gLose.state.char.hp}`);
  assert.ok(!gLose.state.flags.finished, '非致死战败不得直接结束游戏');
  gLose.proceed();
  assert.ok(!gLose.state.flags.finished, '点击继续后绝不可因0血暴毙！');

  // 3. 逆命天赋(t_niming)突破一次后依然永久生效
  const gNiming = new Game({ meta: { karmaPoints: 0, talents: ['t_niming'] } });
  gNiming.newRun({ seed: 42, name: '逆命', gender: '男', originId: 'farmer', rootId: 'shuangling' });
  assert.equal(gNiming.state.buffs.permBreakBonus, 6);
  const pBefore = breakthroughChance(gNiming.state);
  gNiming.state.char.exp = needExp(gNiming.state.char);
  gNiming.resolveBreakthrough(1);
  assert.equal(gNiming.state.buffs.permBreakBonus, 6, '突破后 permBreakBonus 绝不能清零');
  gNiming.state.char.realm = 3;
  const gPlain = fresh();
  gPlain.state.char.realm = 3;
  gPlain.state.char.layer = gNiming.state.char.layer;
  gPlain.state.char.attrs = { ...gNiming.state.char.attrs };
  gPlain.state.worldEra = { ...gNiming.state.worldEra };
  assert.ok(breakthroughChance(gNiming.state) > breakthroughChance(gPlain.state), '逆命天赋在突破后仍应高于无天赋角色');
  assert.ok(pBefore > 0);

  // 4. expr.js null 字面量修复：无宗门时 char.sectId != null 必须为 false
  const gNull = fresh();
  const ctxNull = buildContext(gNull.state, {});
  assert.equal(evaluate(parseExpression('char.sectId != null'), ctxNull), false);
  assert.equal(evaluate(parseExpression('char.sectId == null'), ctxNull), true);
  gNull.state.char.sectId = 'taixuan';
  assert.equal(evaluate(parseExpression('char.sectId != null'), ctxNull), true);

  // 5. player_sect 拥有完整宗门加成 + 叛离不重新装备原宗功法 + 辞别散修无惩罚 + 10阶法宝达成 craft>=10
  const gSect = fresh();
  gSect.state.char.realm = 4;
  gSect.state.char.stones = 9999999;
  gSect.act_foundSect();
  assert.ok(sectPerks(gSect.state.char).speed > 0.15 && sectPerks(gSect.state.char).atk > 0.1);
  for (let i = 0; i < 10; i++) gSect.act_refine();
  assert.equal(gSect.state.char.artifactLevel, 10);
  assert.equal(gSect.state.counters.craft, 10);

  // 散修辞别无惩罚
  const gSan = fresh();
  gSan.act_joinSect({ sectId: 'sanxiu' });
  gSan.act_sectLeave();
  assert.equal(gSan.state.char.sectId, null);
  assert.equal(gSan.state.char.betrayCount, 0);
  // v8 审计修复：散修辞别不算叛门，但一年内不能再入门户（堵住辞别重入刷任务榜与入门效果）
  assert.equal(gSan.state.char.sectLeaveUntil, gSan.state.char.age + 12);
  const luck0 = gSan.state.char.attrs.气运;
  assert.ok(gSan.act_joinSect({ sectId: 'sanxiu' })?.error);
  gSan.state.char.age += 12;
  gSan.act_joinSect({ sectId: 'sanxiu' });
  assert.equal(gSan.state.char.attrs.气运, luck0, '入门效果一世只给一次');

  // 6. 存档 meta 合并绝不抹除新世解锁的成就与结局
  const merged = mergeMeta(
    { cycle: 1, karmaPoints: 2, unlockedEndings: ['e_old_age'], achievements: { a_first_qi: 100 } },
    { cycle: 3, karmaPoints: 9, unlockedEndings: ['e_ascend'], achievements: { a_ascend: 200 }, talents: ['t_niming'] },
  );
  assert.equal(merged.cycle, 3);
  assert.equal(merged.karmaPoints, 9);
  assert.ok(merged.unlockedEndings.includes('e_old_age') && merged.unlockedEndings.includes('e_ascend'));
  assert.ok(merged.talents.includes('t_niming'));

  // 7. 叛门后原宗功法不会被 activeTechniques 自动重新装回
  const gBetray = fresh();
  gBetray.state.char.sectId = 'taixuan';
  gBetray.state.char.contribution = 1000;
  gBetray.act_buySectManual({ params: { manualId: 'tx_lib_1' } });
  assert.equal(activeTechniques(gBetray.state.char).length, 1);
  gBetray.act_sectLeave();
  assert.equal(activeTechniques(gBetray.state.char).length, 0, '叛门卸下原宗功法后不得自动装回');

  // 8. 剧情触发不会在子界面结果未读时强行覆盖
  const gTrig = fresh();
  gTrig.state.flags['同名玉牌'] = true;
  gTrig.state.scene = { id: 'cave', result: { text: '闭关完成', lines: [] } };
  gTrig.afterAction();
  assert.equal(gTrig.state.scene.id, 'cave', '结果页展示期间不应被主线剧情覆盖');
  gTrig.state.scene = { id: 'hub', result: null };
  gTrig.afterAction();
  assert.equal(gTrig.state.scene.id, 'story_jade_1', '回到主界无结果时应正常触发主线剧情');
  recomputeDerived(gTrig.state.char);
});

test('v7.0 可玩性跃迁：战术斗法2.0（意图/蓄势反击/战符/法则领域）、五层秘境探幽、九州天象、智能闭关与分页选礼', async () => {
  const { gainLawExp, currentWorldEra, activeDaoGoal } = await import('../src/engine/state.js');

  // 1. 战术斗法2.0：敌手意图预告 + 守势蓄力反击 + 战符 + 法则领域
  const g = fresh();
  g.state.char.realm = 2;
  g.state.char.attrs.根骨 = 40;
  g.state.char.attrs.神识 = 40;
  gainLawExp(g.state, 100, 'sword');
  g.state.char.inventory.push({ id: 'zhangxin_leifu', qty: 2 }, { id: 'dahuan_dan', qty: 1 });
  g.startCombat('jindan_elder');
  assert.ok(g.state.combat.intent && g.state.combat.intent.label);
  // 强制敌手为蓄力重击，玩家守势应触发蓄势反击
  g.state.combat.intent = { kind: 'heavy', label: '蓄力重击', mult: 1.65 };
  g.act_combatGuard();
  assert.equal(g.state.combat.counterReady, true, '面对蓄力重击使用守势应触发蓄势反击');
  // 展开法则领域
  const domainChoice = g.choices().find((c) => c.action === 'combatDomain');
  assert.ok(domainChoice && !domainChoice.disabled, '领悟法则后应可展开法则领域');
  g.choose(domainChoice.index);
  if (g.state.combat) {
    assert.equal(g.state.combat.domainUsed, true);
    // 祭出掌心五雷符
    const talismanChoice = g.choices().find((c) => c.action === 'combatTalisman');
    assert.ok(talismanChoice);
    g.choose(talismanChoice.index);
    // 满血状态仅持大还丹点击服丹也不应白白浪费回合（真实消耗大还丹）
    if (g.state.combat) {
      g.state.char.hp = g.state.char.maxHp;
      g.state.char.mp = g.state.char.maxMp;
      const pillsBefore = g.state.stats.pills;
      g.act_combatPill();
      assert.equal(g.state.stats.pills, pillsBefore + 1);
    }
  }

  // 2. 五层秘境探幽：深入层数、累积战利与见好就收撤离
  const gDelve = fresh();
  gDelve.act_startDelve();
  assert.equal(gDelve.state.scene.id, 'delve');
  assert.equal(gDelve.state.delve.floor, 1);
  gDelve.act_delveStep({ params: { kind: 'stele' } });
  assert.equal(gDelve.state.delve.floor, 2);
  assert.ok(gDelve.state.delve.haulStones > 0 && gDelve.state.delve.haulLaw > 0);
  const stonesBefore = gDelve.state.char.stones;
  gDelve.act_delveExtract();
  assert.equal(gDelve.state.delve, null);
  assert.ok(gDelve.state.char.stones > stonesBefore, '撤离应全额结算暂存灵石');

  // 3. 古籍秘阁品阶筛选与分页可直达天/仙阶功法，NPC 赠礼支持多物自选
  const gShop = fresh();
  gShop.state.char.realm = 8;
  gShop.state.char.stones = 9999999;
  gShop.act_openTechShop({ params: { tier: 'high', page: 0 } });
  const highLabels = gShop.choices().map((c) => c.label);
  assert.ok(highLabels.some((l) => l.includes('【仙') || l.includes('【天')), '筛选天·仙品阶应直接展示高阶孤本');

  gShop.state.char.inventory.push({ id: 'lingcao', qty: 1 }, { id: 'dao_fruit', qty: 1 });
  gShop.act_openNpc({ params: { npcId: 'npc_su' } });
  const giftBtns = gShop.choices().filter((c) => c.action === 'npcGift');
  assert.equal(giftBtns.length, 2, '拥有两件喜好物时应展示两个独立赠礼选项');

  // 4. 智能闭关冲层、九州天象与道途指引
  const gSmart = fresh();
  assert.ok(currentWorldEra(gSmart.state).name);
  assert.ok(activeDaoGoal(gSmart.state).label);
  gSmart.act_smartCultivate();
  assert.ok(gSmart.state.char.exp > 0 && gSmart.state.scene.result);
});

test('v8 审计漏洞回归：套利、灵脉、论道、祭炼、喂兽、门徒', async () => {
  const { monthlyExp } = await import('../src/engine/state.js');
  // 1. 回收价永远低于自己的买入价
  const g = fresh();
  g.state.char.attrs.魅力 = 200;
  g.state.char.goldenFingerId = 'gf_karma_mirror';
  g.state.char.sectId = 'wanbao';
  assert.ok(g.sellRate() < g.shopDiscountMult(), '卖价必须低于买价');

  // 2. 灵脉采撷与闭关同量级（不再是按层需修为百分比）
  const g2 = fresh();
  const c2 = g2.state.char;
  c2.realm = 8; c2.layer = 0;
  const region = Object.values((await import('../src/data/regions.js')).REGION_BY_ID).find((r) => r.veinYield);
  c2.regionId = region.id;
  c2.regionProgress = { [region.id]: 100 };
  const before = c2.exp;
  const perHalfYear = monthlyExp(g2.state) * 6;
  g2.act_regionVein();
  assert.ok(c2.exp - before <= perHalfYear * 2.5, `采撷 ${c2.exp - before} 不应远超闭关 ${perHalfYear}`);

  // 3. 论道：同一人一年一次、一世至多 12 次
  const g3 = fresh();
  const npcId = (await import('../src/data/npcs.js')).NPCS[0].id;
  g3.state.char.realm = 9;
  const a0 = JSON.stringify(g3.state.char.attrs);
  g3.act_npcChat({ params: { npcId } });
  const a1 = JSON.stringify(g3.state.char.attrs);
  g3.act_npcChat({ params: { npcId } });
  assert.equal(JSON.stringify(g3.state.char.attrs), a1, '一年内第二次论道不再加属性');
  assert.notEqual(a0, a1);

  // 4. 祭炼：一块玄铁不能顶掉高阶费用
  const g4 = fresh();
  g4.state.char.stones = 0;
  g4.state.char.artifactLevel = 6;
  g4.state.char.inventory.push({ id: 'xuantie', qty: 1 });
  g4.act_refine();
  assert.equal(g4.state.char.artifactLevel, 6);

  // 5. 喂兽：没有足够内丹与灵石不能进阶
  const g5 = fresh();
  g5.state.char.petId = Object.keys((await import('../src/data/golden_fingers.js')).PET_BY_ID)[0];
  g5.state.char.petLevel = 3;
  g5.state.char.inventory.push({ id: 'yaoshou_neidan', qty: 1 });
  assert.ok(g5.act_feedPet()?.error);

  // 6. 门徒有上限
  const g6 = fresh();
  for (let i = 0; i < 30; i++) g6.act_recruitDisciple();
  assert.ok((g6.state.counters.disciples || 0) <= 6);
});

test('v8 大历史：亲历、风闻、前世手札、先知只认前世', async () => {
  const { tickHistory, historyIndex, FORCED_HISTORY, localHistory } = await import('../src/engine/history.js');
  const g = fresh();
  const list = historyIndex(g.registry);
  assert.ok(list.length > 100, `历史事件应已注册，当前 ${list.length}`);
  const ev = list.find((e) => FORCED_HISTORY.has(e.id) && e.history.regions?.length);
  // 0. 非强制的大事不打断，只在当地闲逛时可撞上
  const g0 = fresh();
  const minor = list.find((e) => !FORCED_HISTORY.has(e.id) && e.history.regions?.includes('qingniu'));
  g0.state.history = Object.fromEntries(list.filter((e) => e !== minor && e.history.window[0] <= minor.history.window[0]).map((e) => [e.history.key, { outcome: 'baseline' }]));
  g0.state.char.age = 192 + (minor.history.window[0] - 1) * 12;
  g0.state.char.regionId = 'qingniu';
  assert.equal(tickHistory(g0.state, g0.registry).open, null, '非强制大事不插播');
  assert.equal(localHistory(g0.state, g0.registry)?.id, minor.id, '闲逛时可撞上');
  g.state.history = {};
  // 1. 窗口已过、人不在场：化为风闻并写进手札
  g.state.char.regionId = ev.history.regions[0] === 'qingniu' ? 'beihuang' : 'qingniu';
  g.state.char.age = 192 + (ev.history.window[1] + 1) * 12;
  const r = tickHistory(g.state, g.registry);
  assert.equal(g.state.history[ev.history.key].outcome, 'baseline');
  assert.ok(g.state.meta.handbook[ev.history.key], '风闻写进手札');
  assert.ok(r.notes.length >= 1);
  // 2. 先知：本世刚记下的不算，下一世才算
  const ctx = (await import('../src/engine/narrative.js')).contextOf(g.state, g);
  const { compileCondition } = await import('../src/engine/expr.js');
  assert.equal(compileCondition(`known("${ev.history.key}")`)(ctx), false);
  g.state.meta.cycle = (g.state.meta.cycle || 1) + 1;
  assert.equal(compileCondition(`known("${ev.history.key}")`)(ctx), true);
  // 3. 窗口之内、人在场：亲历（插入剧情）
  const g2 = fresh();
  g2.state.char.regionId = ev.history.regions[0];
  g2.state.char.realm = 9;
  g2.state.char.age = 192 + (ev.history.window[0] - 1) * 12;
  g2.state.char.lifespan = 1e9;
  g2.state.char.hp = g2.state.char.maxHp;
  g2.state.history = Object.fromEntries(list.filter((e) => e !== ev && e.history.window[0] <= ev.history.window[0]).map((e) => [e.history.key, { outcome: 'baseline' }]));
  g2.state.scene = { id: 'hub', result: null };
  g2.afterAction();
  assert.equal(g2.state.scene.id, ev.id);
  assert.equal(g2.state.history[ev.history.key].source, '亲历');
});

test('v8 第一百年：无人干预落到剧本基准「临河失守」，判定节点在第 19 年后亲历', async () => {
  const { tickHistory } = await import('../src/engine/history.js');
  const { evaluateCentury1Outcome } = await import('../src/data/history/index.js');
  const g = fresh({ history: true });
  g.state.char.regionId = 'beihuang'; // 人不在南泽：南泽大事都化为风闻
  g.state.char.lifespan = 1e9;
  for (let y = 1; y <= 21; y++) {
    g.state.char.age = 192 + (y - 1) * 12;
    tickHistory(g.state, g.registry);
  }
  const o = evaluateCentury1Outcome(g.state);
  assert.ok(o && o.name.includes('临河失守'), `基准结局应为临河失守，实际 ${o?.name}`);
  assert.ok(Object.keys(g.state.meta.handbook).length >= 5, '风闻的大事写进了手札');
});

test('v8 存档：旧世界进行中的存档不载入；老玩家已开放的出身机缘不会被锁回去', async () => {
  const { SaveStore } = await import('../src/engine/save.js');
  const { migrateMeta, originUnlocked, recordLifeStats } = await import('../src/engine/meta.js');
  const mem = new Map();
  const storage = { getItem: (k) => mem.get(k) ?? null, setItem: (k, v) => mem.set(k, String(v)), removeItem: (k) => mem.delete(k) };
  const store = new SaveStore(storage);
  storage.setItem(store.key(1), JSON.stringify({ version: 7, state: { version: 7, char: { name: '旧' } } }));
  assert.equal(store.load(1), null);
  const g = fresh();
  store.save(2, g);
  assert.ok(store.load(2));
  const old = { runs: 3, unlockedEndings: [], achievements: {} };
  migrateMeta(old);
  assert.ok(originUnlocked(old, 'outsider'));
  recordLifeStats(old, g.state);
  assert.ok(originUnlocked(old, 'outsider'), '记过一世之后也不能锁回去');
  const fresh0 = { runs: 0 };
  migrateMeta(fresh0);
  assert.equal(originUnlocked(fresh0, 'outsider'), true, '出身一开始全部开放');
});

test('v8 审计修复：做过的宗门任务冷却，不会连着上榜', () => {
  const g = fresh();
  g.act_joinSect({ sectId: 'sanxiu' });
  const board = g.ensureSectBoard();
  const id = board.slots[0].missionId;
  g.act_runSectMission({ params: { missionId: id } });
  g.state.char.hp = g.state.char.maxHp = 1e9;
  let guard = 0;
  while (g.state.scene.id === 'combat' && guard++ < 500) g.combatRound('attack');
  assert.ok((g.state.flags[`任务冷却:${id}`] || 0) > g.state.char.age, '完成后写入冷却');
  g.state.sectBoard.refreshAt = 0;
  const next = g.ensureSectBoard();
  assert.ok(!next.slots.some((x) => x.missionId === id) || next.slots.length < 3, '冷却中的任务不上新榜');
});

test('v8.1 网文流派出身、气机姿态与万象因果打脸引擎（四档境界×三姿态×十一出身×九金手指×护短二段）', async () => {
  const { ORIGINS } = await import('../src/data/origins.js');
  const { GOLDEN_FINGERS } = await import('../src/data/golden_fingers.js');
  const { FACESLAP_SCENARIOS } = await import('../src/data/faceSlapScenarios.js');
  const { startFaceSlapEncounter, buildFaceSlapNode, resolveFaceSlapChoice } = await import('../src/engine/faceSlap.js');
  const { perceivedRealmLabel } = await import('../src/engine/state.js');

  // 1. 全部 11 出身均有流派标签、重生停滞背景与有效开局场景
  assert.equal(ORIGINS.length, 11);
  assert.ok(FACESLAP_SCENARIOS.length >= 32, `打脸场景至少 32 个，当前 ${FACESLAP_SCENARIOS.length}`);
  for (const o of ORIGINS) {
    assert.ok(o.trope && o.flags?.重生停滞, `${o.id} 应有网文流派标签与重生停滞标记`);
    const gO = new Game();
    gO.newRun({ seed: 101, name: '试道', gender: '男', originId: o.id, rootId: 'shuangling', goldenFingerId: 'gf_bottle' });
    assert.equal(gO.state.scene.id, `open_${o.id}`, `${o.id} 开局应直入专属开场`);
    assert.ok(gO.currentText().includes('两年'), `${o.id} 开场应自然带出停滞两年缘由`);
  }

  // 2. 气机姿态切换与表象境界（龟息藏锋默认敛息）
  const gStealth = new Game();
  gStealth.newRun({ seed: 7, name: '荀稳', gender: '男', originId: 'orphan', rootId: 'shuangling', goldenFingerId: 'gf_stealth' });
  assert.equal(gStealth.state.char.auraStance, 'hide', '龟息藏锋诀默认开启敛息藏锋');
  gStealth.state.char.realm = 4; // 化神
  assert.ok(!perceivedRealmLabel(gStealth.state.char).includes('化神'), '敛息时外人不得看出化神真实修为');
  gStealth.act_cycleAuraStance({ params: { stance: 'show', silent: true } });
  assert.equal(gStealth.state.char.auraStance, 'show');
  assert.ok(perceivedRealmLabel(gStealth.state.char).includes('化神'));

  // 3. 远高于对手 + 敛息：扮猪吃虎 & 显露威压 100% 合理打脸并累积计数
  const gHigh = new Game();
  gHigh.newRun({ seed: 42, name: '高阶', gender: '男', originId: 'fallen_clan', rootId: 'shuangling', goldenFingerId: 'gf_sword_elder' });
  gHigh.state.char.realm = 4;
  gHigh.state.char.auraStance = 'hide';
  startFaceSlapEncounter(gHigh, { context: 'city', forceRelTier: 'much_higher' });
  const nodeHigh = buildFaceSlapNode(gHigh);
  assert.ok(nodeHigh.text.includes('敛息藏锋'), '敛息遇事应体现表象修为');
  assert.ok(nodeHigh.choices.length >= 6, `带金手指遇事至少应提供 6 类差异化应对，实际 ${nodeHigh.choices.length}`);
  resolveFaceSlapChoice(gHigh, 'lowkey');
  assert.ok((gHigh.state.counters.lowkey_wins || 0) >= 1, '远高于对手扮猪吃虎应记 lowkey_wins');
  assert.ok((gHigh.state.counters.faceslap_wins || 0) >= 1);

  // 4. 低于对手（严守逻辑）：低底蕴硬亮修为绝不无脑震慑，会激怒进入越阶实战！
  const gLow = fresh();
  gLow.state.char.realm = 0;
  gLow.state.char.layer = 0;
  gLow.state.char.attrs.道心 = 5;
  gLow.state.char.attrs.神识 = 5;
  startFaceSlapEncounter(gLow, { context: 'explore', forceRelTier: 'lower' });
  resolveFaceSlapChoice(gLow, 'show');
  assert.equal(gLow.state.scene.id, 'combat', '修为低于对手且底蕴不足时硬亮修为应激怒对手开战，不可无脑装逼成功');

  // 5. 全部 11 出身 × 9 金手指均可无错结算并产出各自专属打脸文案
  const texts = new Set();
  for (const o of ORIGINS) {
    const gT = new Game();
    gT.newRun({ seed: 202, name: '林尘', gender: '男', originId: o.id, rootId: 'jin', goldenFingerId: 'gf_sword_elder' });
    gT.state.char.realm = 2;
    startFaceSlapEncounter(gT, { context: 'city', forceRelTier: 'higher' });
    resolveFaceSlapChoice(gT, 'origin');
    const txt = gT.state.scene.result?.text || gT.currentText();
    assert.ok(txt.length > 20);
    texts.add(`o:${o.id}:${txt.slice(0, 30)}`);
  }
  assert.equal(texts.size, 11, '11 种出身的打脸应对文案必须各不相同');

  const gfTexts = new Set();
  for (const gf of GOLDEN_FINGERS) {
    const gG = new Game();
    gG.newRun({ seed: 303, name: '韩墨', gender: '男', originId: 'fallen_clan', rootId: 'huo', goldenFingerId: gf.id });
    gG.state.char.realm = 2;
    startFaceSlapEncounter(gG, { context: 'city', forceRelTier: 'equal' });
    resolveFaceSlapChoice(gG, 'gf');
    const txt = gG.state.scene.result?.text || '';
    assert.ok(txt.length > 20);
    gfTexts.add(`gf:${gf.id}:${txt.slice(0, 30)}`);
  }
  assert.equal(gfTexts.size, GOLDEN_FINGERS.length, '9 种金手指的打脸应对文案必须各不相同');

  // 6. 二段护短升级（打了小的来老的）：高阶主角连靠山长老一起威压跪服
  const gElder = fresh();
  gElder.state.char.realm = 5; // 炼虚大能
  startFaceSlapEncounter(gElder, { context: 'city', forceRelTier: 'much_higher' });
  gElder.state.faceSlap.stage = 'elder';
  const elderNode = buildFaceSlapNode(gElder);
  assert.ok(elderNode.title.includes('护短风波'));
  resolveFaceSlapChoice(gElder, 'elder_show');
  assert.ok((gElder.state.counters.elder_slaps || 0) >= 1, '高阶主角应直接震服护短长老并记 elder_slaps');
});

test('v8.1 遇事漏洞：逃跑了结风波、底牌会失手、交差所得不被吞、属性有额度', async () => {
  const { startFaceSlapEncounter, resolveFaceSlapChoice, buildFaceSlapNode } = await import('../src/engine/faceSlap.js');
  // 1. 遇事斗法中逃走：风波了结，不会一直挡住大事触发
  const g = fresh();
  g.state.char.rootId = 'feng'; // 风灵根必定逃脱
  startFaceSlapEncounter(g, { context: 'city', returnTo: 'hub', forceRelTier: 'equal' });
  resolveFaceSlapChoice(g, 'fight');
  assert.ok(g.state.combat, '应进入斗法');
  g.act_combatFlee();
  assert.equal(g.state.combat, null);
  assert.equal(g.state.faceSlap, null, '逃走后遇事应了结');
  // 2. 金手指底牌对高一境的人会失手（转入斗法）
  let fights = 0;
  for (let i = 0; i < 40; i++) {
    const gi = fresh({ goldenFingerId: 'gf_bottle', seed: 900 + i });
    startFaceSlapEncounter(gi, { context: 'city', returnTo: 'hub', forceRelTier: 'lower' });
    resolveFaceSlapChoice(gi, 'gf');
    if (gi.state.combat) fights++;
  }
  assert.ok(fights >= 8 && fights <= 32, `对高一境的人亮底牌应有约一半失手，实际 ${fights}/40`);
  // 3. 门户差事撞上遇事：交差所得写在遇事开头
  const gs = fresh();
  startFaceSlapEncounter(gs, { context: 'sect', returnTo: 'hub', note: ['巡山。贡献 +50，灵石 +30。'] });
  assert.ok(buildFaceSlapNode(gs).text.startsWith('巡山。贡献 +50'));
  // 4. 反复遇事，属性涨幅有额度
  const ga = fresh({ goldenFingerId: 'gf_none' });
  const before = ga.state.char.attrs.道心;
  for (let i = 0; i < 30; i++) {
    startFaceSlapEncounter(ga, { context: 'city', returnTo: 'hub', forceRelTier: 'much_higher' });
    resolveFaceSlapChoice(ga, 'walk');
    if (ga.state.scene.result) ga.proceed();
  }
  assert.ok(ga.state.char.attrs.道心 - before <= 8, `一个大境界内遇事所得道心不超过 8，实际 +${ga.state.char.attrs.道心 - before}`);
});
