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

function fresh(opts = {}) {
  const g = new Game();
  g.newRun({ seed: 12345, name: '阿禾', gender: '女', originId: 'farmer', rootId: 'shuangling', ...opts });
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
  g.choose(0); // 打坐
  assert.ok(g.state.char.exp > before);
  assert.ok(g.state.char.age > ageBefore);
  assert.ok(g.state.scene.result);
  g.proceed();
  assert.equal(g.state.scene.id, 'hub');
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

test('天劫失败会触发身死道消结局', () => {
  const g = fresh();
  const c = g.state.char;
  c.realm = 1;
  c.layer = 3;
  c.exp = needExp(c);
  g.resolveBreakthrough(1);
  assert.equal(g.state.scene.id, 'tribulation');
  g.act_tribulationStage({ params: { p: 0, mode: 'body' } });
  assert.equal(g.state.scene.id, 'ending');
  assert.equal(g.state.flags.endingId, 'e_tribulation_death');
});

test('结局判定：寿元耗尽与魔化', () => {
  const g = fresh();
  g.state.char.age = g.state.char.lifespan;
  g.afterAction();
  assert.equal(g.state.flags.endingId, 'e_old_age');

  const g2 = fresh();
  g2.state.char.demon = 100;
  g2.afterAction();
  assert.equal(g2.state.flags.endingId, 'e_demon_devour');
});

test('成就：条件满足后解锁且不重复', () => {
  const g = fresh();
  const unlocked = g.checkAchievements();
  assert.ok(Object.keys(g.state.meta.achievements).length > 0);
  const after = g.unlockAchievement('a_first_qi');
  assert.ok(after === null || typeof after === 'string');
  const count = Object.keys(g.state.meta.achievements).length;
  g.checkAchievements();
  assert.equal(Object.keys(g.state.meta.achievements).length, count);
});

test('宗门：可加入并累积贡献、晋升', () => {
  const g = fresh();
  g.state.char.sectId = 'qingyun';
  g.state.char.contribution = 600;
  g.state.char.sectRank = 0;
  g.act_sectTask({});
  assert.ok(g.state.char.contribution > 600);
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

test('寻访仙门：可按条件加入宗门并获得身份', () => {
  const g = fresh();
  g.state.char.attrs.悟性 = 30;
  g.state.char.attrs.道心 = 30;
  g.act_sectRecruit();
  assert.equal(g.state.scene.id, 'recruit');
  const cs = g.choices();
  assert.ok(cs.some((c) => c.label.includes('青云门')));
  const idx = cs.findIndex((c) => c.label.includes('青云门'));
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

test('宗门贡献晋升：贡献达标后 rank 提升', () => {
  const g = fresh();
  g.state.char.sectId = 'qingyun';
  g.state.char.contribution = 2100;
  g.act_sectTask({});
  assert.ok(g.state.char.sectRank >= 2, 'rank=' + g.state.char.sectRank);
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

  // 万宝拍卖会竞拍
  g.act_auction();
  assert.equal(g.state.scene.id, 'auction');
  const bid = g.choices().find((c) => c.label.includes('筑基丹'));
  assert.ok(bid);
  g.choose(bid.index);
  assert.ok(g.state.char.inventory.some((i) => i.id === 'zhuji_dan'));

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
