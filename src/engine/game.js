import { RNG, clamp } from './rng.js';
import {
  createRun, advanceMonths, recomputeDerived, needExp, canBreakthrough, isRealmMaxLayer,
  breakthroughChance, monthlyExp, gainExp, isDead, addItem, removeItem, hasItem,
} from './state.js';
import { applyEffects } from './effects.js';
import {
  EVENTS, buildRegistry, buildHub, choiceAvailable, markChoiceTaken, pickEvent,
  formatText, contextOf, poolForAction, registerEvents,
} from './narrative.js';
import { ALL_EVENTS, STORY_TRIGGERS } from '../data/events/index.js';
import { compileCondition } from './expr.js';
import { REALMS, realmLabel } from '../data/realms.js';
import { ROOT_BY_ID } from '../data/roots.js';
import { SECTS, SECT_BY_ID, sectRank } from '../data/sects.js';
import { ITEMS, ITEM_BY_ID } from '../data/items.js';
import { ACHIEVEMENTS, ACHIEVEMENT_BY_ID } from '../data/achievements.js';
import { ENDINGS, ENDING_BY_ID, pickEnding } from '../data/endings.js';
import { ENEMY_BY_ID, scaleEnemy } from '../data/enemies.js';

const MONTHS = 1;

if (EVENTS.length === 0) registerEvents(ALL_EVENTS);

export class Game {
  constructor({ meta = {}, registry = null } = {}) {
    this.meta = {
      cycle: 1, karmaPoints: 0, talents: [], unlockedEndings: [], achievements: {},
      runs: 0, ...meta,
    };
    this.registry = registry || buildRegistry();
    this.state = null;
    this.rng = new RNG(Date.now() >>> 0);
    this.lastLines = [];
    this.onChange = null;
  }

  /* ---------------- lifecycle ---------------- */

  newRun({ seed, name, gender, originId, rootId, meta } = {}) {
    const s = createRun({
      seed: seed ?? (Date.now() >>> 0), name, gender, originId, rootId,
      meta: meta || this.meta,
    });
    this.rng = new RNG(s.seed);
    this.state = s;
    this.meta = s.meta;
    this.state.scene = { id: 'hub', result: null };
    this.checkAchievements();
    this.emit();
    return s;
  }

  setState(state) {
    this.state = state;
    this.rng = new RNG(state.seed);
    this.rng.setState(state.rngState);
    this.meta = state.meta;
    recomputeDerived(state.char);
    this.emit();
    return state;
  }

  emit() {
    if (this.state) this.state.rngState = this.rng.getState();
    if (this.onChange) this.onChange(this);
  }

  snapshotRng() { this.state.rngState = this.rng.getState(); }

  /* ---------------- nodes & choices ---------------- */

  currentNode() {
    const s = this.state;
    if (!s) return null;
    if (s.scene.id === 'hub') return buildHub(this);
    if (s.scene.id === 'combat') return this.buildCombatNode();
    if (s.scene.id === 'market') return this.buildMarketNode();
    if (s.scene.id === 'sell') return this.buildSellNode();
    if (s.scene.id === 'recruit') return this.buildRecruitNode();
    if (s.scene.id === 'breakthrough') return this.buildBreakthroughNode();
    if (s.scene.id === 'tribulation') return this.buildTribulationNode();
    if (s.scene.id === 'ending') return this.buildEndingNode();
    const node = this.registry.get(s.scene.id);
    if (!node) return buildHub(this);
    return node;
  }

  currentText() {
    const node = this.currentNode();
    if (!node) return '';
    const result = this.state.scene.result;
    if (result) {
      const parts = [formatText(result.text, this.state)];
      if (result.lines?.length) parts.push(result.lines.join('\n'));
      return parts.filter(Boolean).join('\n\n');
    }
    const base = formatText(node.text, this.state);
    if (this.state.scene.id === 'combat') return base;
    return base;
  }

  choices() {
    const node = this.currentNode();
    if (!node) return [];
    const s = this.state;
    if (s.scene.result && !s.scene.result.combatPrompt) {
      return [{ index: 0, label: s.scene.result.ending ? '看完此生' : '继续', hint: '', action: 'continue', effect: 'primary' }];
    }
    const list = node.choices || [];
    const out = [];
    const ctx = contextOf(s, this);
    list.forEach((ch, i) => {
      if (ch.hideIf) {
        try { if (compileCondition(ch.hideIf)(ctx)) return; } catch { /* ignore */ }
      }
      const avail = choiceAvailable(s, node, ch, this);
      out.push({
        index: i,
        label: typeof ch.label === 'function' ? ch.label(s) : ch.label,
        hint: ch.hint || '',
        disabled: !avail.ok,
        reason: avail.reason || '',
        action: ch.action || 'choose',
        effect: ch.effect || '',
      });
    });
    return out;
  }

  choose(index) {
    const node = this.currentNode();
    if (!node) return;
    const s = this.state;
    if (s.scene.result) return this.proceed();
    const ch = (node.choices || [])[index];
    if (!ch) return;
    const avail = choiceAvailable(s, node, ch, this);
    if (!avail.ok) return { error: avail.reason };

    s.stats.actions++;
    s.turn++;
    markChoiceTaken(s, node, ch);

    if (ch.action && ch.action !== 'choose') {
      const handler = this[`act_${ch.action}`];
      if (handler) return handler.call(this, ch, node);
      return;
    }

    // 通用数据节点
    const lines = [];
    const cost = ch.cost || {};
    if (cost.stones) s.char.stones -= cost.stones;
    if (cost.hp) s.char.hp -= cost.hp;
    if (cost.mp) s.char.mp -= cost.mp;
    if (cost.item) removeItem(s, cost.item, 1);
    if (ch.effects) lines.push(...applyEffects(s, ch.effects, this.effectCtx()));

    let outcome = ch.outcome || null;
    if (ch.roll) {
      let p = ch.roll.p ?? 0.5;
      for (const [k, v] of Object.entries(ch.roll.attrs || {})) p += (s.char.attrs[k] || 0) * v;
      if (ch.roll.expr) {
        try { p = Number(compileCondition(ch.roll.expr)(contextOf(s, this))) || 0; } catch { /* ignore */ }
      }
      p = clamp(p, 0.02, 0.98);
      const ok = this.rng.chance(p);
      outcome = (ok ? ch.roll.success : ch.roll.fail) || outcome;
      lines.push(ok ? '—— 成。' : '—— 败。');
    }

    if (outcome?.combat) {
      return this.startCombat(outcome.combat, { lines });
    }

    const months = cost.month || ch.months || 0;
    if (months) lines.push(...advanceMonths(s, months, this.rng));

    const res = this.resolveOutcome(outcome, lines);
    this.afterAction();
    this.emit();
    return res;
  }

  resolveOutcome(outcome, lines = []) {
    const s = this.state;
    if (!outcome) {
      s.scene.result = { text: '', lines };
      return;
    }
    let effects = outcome.effects || {};
    if (outcome.ending) {
      s.scene.result = { text: outcome.text || '', lines, ending: outcome.ending, goto: null };
      this.finishEnding(outcome.ending);
      return;
    }
    if (effects && Object.keys(effects).length) {
      lines.push(...applyEffects(s, effects, this.effectCtx()));
    }
    s.scene.result = {
      text: formatText(outcome.text, s),
      lines,
      goto: outcome.goto || null,
    };
    if (outcome.log) this.pushLog(outcome.log);
  }

  proceed() {
    const s = this.state;
    const result = s.scene.result;
    if (!result) return;
    if (result.ending) {
      s.scene = { id: 'ending', result: null };
      this.emit();
      return;
    }
    const goto = result.goto;
    s.scene.result = null;
    if (goto) {
      this.openScene(goto);
    } else {
      s.scene.id = 'hub';
    }
    this.afterAction();
    this.emit();
  }

  openScene(id) {
    const s = this.state;
    if (id === 'hub') { s.scene = { id: 'hub', result: null }; return; }
    const node = this.registry.get(id);
    if (!node) {
      console.warn('未找到节点', id);
      s.scene = { id: 'hub', result: null };
      return;
    }
    s.scene = { id, result: null };
    if (node.once) s.flags[`ev:${id}`] = true;
    if (node.pool === 'story') s.flags[`story:${id}`] = true;
    if (node.onEnter) {
      const lines = applyEffects(s, node.onEnter, this.effectCtx());
      if (lines.length) s.scene.lines = lines;
    }
    s.stats.events++;
    this.pushLog(node.title || id);
  }

  openEvent(ev) {
    if (!ev) return;
    this.openScene(ev.id);
  }

  effectCtx() {
    return {
      rng: this.rng,
      unlockAchievement: (id) => this.unlockAchievement(id),
    };
  }

  /* ---------------- actions ---------------- */

  act_continue() { return this.proceed(); }

  act_cultivate(ch) {
    const s = this.state;
    const months = ch.params?.months || MONTHS;
    const gain = monthlyExp(s) * months;
    const got = gainExp(s, gain);
    const lines = [`闭关${months}月，修为 +${got}。`];
    if (ch.params?.demonRisk && this.rng.chance(0.25 + s.char.demon * 0.005)) {
      const d = this.rng.int(2, 5);
      s.char.demon = clamp(s.char.demon + d, 0, 100);
      lines.push(`出关时你分不清自己是醒着还是做梦。心魔 +${d}。`);
      s.counters.deep_streak = (s.counters.deep_streak || 0) + 1;
      if (s.char.demon >= 60) lines.push('识海里那个声音，开始用你的语气说话了。');
    } else if (ch.params?.demonRisk) {
      s.counters.deep_streak = (s.counters.deep_streak || 0) + 1;
    } else {
      s.counters.deep_streak = 0;
    }
    lines.push(...advanceMonths(s, months, this.rng));
    s.scene.result = { text: this.cultivationFlavor(months), lines };
    this.afterAction();
    this.emit();
  }

  cultivationFlavor(months) {
    const c = this.state.char;
    const realm = REALMS[c.realm];
    const pool = [
      '灵气顺着经脉走了一圈，像一条温热的蛇。',
      '你听见自己的血流声，慢慢和呼吸对上了。',
      '丹田里的那团气又大了一点，边缘变得清晰。',
      '窗外从黑到白，你没有睁眼。',
      '有一瞬间，你觉得自己不是坐在蒲团上，而是浮在半空。',
      `${realm.name}的关口像一堵墙，你每天用额头撞它一下，墙没动，你也没退。`,
    ];
    return pool[this.rng.int(0, pool.length - 1)];
  }

  act_explore(ch) {
    const s = this.state;
    const lines = [];
    lines.push(...advanceMonths(s, 3, this.rng));
    const ev = pickEvent(s, this.rng, this, 'wild');
    if (ev && this.rng.chance(0.62)) {
      this.openEvent(ev);
      this.afterAction();
      this.emit();
      return;
    }
    const flavor = [
      '你在山道上走了半日，只遇见一个挑柴的老翁。他看了你一眼，说：年轻人，山里有雾。',
      '溪水很凉。你洗了把脸，看见水里自己的影子比昨天瘦。',
      '林子里有野兽的脚印，比你的手掌还大。你跟了一段，脚印消失了。',
      '你在破庙里躲雨，神像的脸被人凿掉了。供桌上还有半块冷掉的饼。',
      '远处的城镇亮着灯。你忽然不想过去。',
    ];
    s.scene.result = { text: this.rng.pick(flavor), lines };
    this.afterAction();
    this.emit();
  }

  act_travel(ch) {
    const s = this.state;
    const lines = advanceMonths(s, 6, this.rng);
    const places = ['青牛村', '落霞城', '北荒边缘', '南疆雨林', '东海渡口', '寒山脚下', '乱葬岗', '万宝坊市'];
    const next = this.rng.pick(places.filter((p) => p !== s.char.location));
    s.char.location = next;
    lines.push(`你到了${next}。`);
    const ev = pickEvent(s, this.rng, this, 'world');
    if (ev && this.rng.chance(0.55)) {
      this.openEvent(ev);
      this.afterAction();
      this.emit();
      return;
    }
    s.scene.result = { text: '路上没有遇到什么大事。这在这里算好事。', lines };
    this.afterAction();
    this.emit();
  }

  act_sectTask(ch) {
    const s = this.state;
    const sect = SECT_BY_ID[s.char.sectId];
    const rank = sectRank(s.char.contribution);
    const lines = advanceMonths(s, 3, this.rng);
    const base = 20 + rank.index * 18 + s.char.realm * 12;
    const contribution = base + this.rng.int(0, base);
    const stones = Math.round(contribution * 0.4);
    const exp = Math.round(monthlyExp(s) * 0.8);
    s.char.contribution += contribution;
    s.char.stones += stones;
    gainExp(s, exp);
    const flavor = sect ? this.rng.pick(sect.taskFlavor) : '替人跑腿';
    lines.push(`${flavor}。贡献 +${contribution}，灵石 +${stones}，修为 +${exp}。`);
    if (this.rng.chance(0.12)) s.counters.slack = (s.counters.slack || 0) + 1;
    const ev = pickEvent(s, this.rng, this, 'sect');
    if (ev && this.rng.chance(0.4)) {
      this.openEvent(ev);
      this.afterAction();
      this.emit();
      return;
    }
    s.scene.result = { text: '宗门的日子像磨刀，一天一天，刀刃薄下去，也亮起来。', lines };
    this.afterAction();
    this.emit();
  }

  act_comprehend(ch) {
    const s = this.state;
    const lines = advanceMonths(s, 6, this.rng);
    const gain = 1 + (this.rng.chance(0.3) ? 1 : 0);
    s.char.attrs.悟性 += gain;
    s.char.attrs.道心 += 1;
    s.char.demon = Math.max(0, s.char.demon - 2);
    lines.push(`参悟三月，悟性 +${gain}，道心 +1，心魔 -2。`);
    if (this.rng.chance(0.25)) {
      lines.push('你忽然想通了一个卡了很久的问题：原来「不做什么」也是一种修行。');
      s.char.attrs.道心 += 2;
    }
    s.scene.result = { text: '你把学过的东西在脑子里过了一遍，像把一柜子旧书搬出来晒。', lines };
    this.afterAction();
    this.emit();
  }

  act_settle(ch) {
    const s = this.state;
    const lines = advanceMonths(s, 3, this.rng);
    const d = this.rng.int(3, 8);
    s.char.demon = Math.max(0, s.char.demon - d);
    s.char.injuries = Math.max(0, s.char.injuries - 1);
    s.counters.settle = (s.counters.settle || 0) + 1;
    lines.push(`你静坐一月，心魔 -${d}。`);
    s.scene.result = { text: '你什么也没做。这很难。', lines };
    this.afterAction();
    this.emit();
  }

  act_market() {
    const s = this.state;
    s.scene = { id: 'market', result: null };
    advanceMonths(s, 1, this.rng);
    this.afterAction();
    this.emit();
  }

  act_fate() {
    this.state.scene.result = {
      text: '你把这辈子的事在心里过了一遍。有些记得，有些像别人的故事。',
      lines: [
        `选择次数：${this.state.stats.actions}`,
        `奇遇：${this.state.stats.events} 次`,
        `杀敌：${this.state.stats.kills} 人`,
        `突破：${this.state.stats.breakthroughs} 次，失手 ${this.state.stats.failures} 次`,
        `已解锁结局：${this.state.meta.unlockedEndings.length} / ${ENDINGS.length}`,
      ],
    };
    this.emit();
  }

  act_foundSect() {
    const s = this.state;
    if (s.flags.开宗立派) return;
    s.flags.开宗立派 = true;
    s.flags.道号 = true;
    s.char.titles.push('开山祖师');
    s.char.reputation += 100;
    s.scene.result = {
      text: '你在无名山立了一块石碑，刻上自己的名字。没有人为你鼓掌，山风把你的衣角吹得笔直。',
      lines: ['开宗立派：声望 +100。从此你不再只是一个人。'],
    };
    this.emit();
  }

  act_sectRecruit() {
    const s = this.state;
    if (s.char.sectId) return;
    advanceMonths(s, 1, this.rng);
    s.scene = { id: 'recruit', result: null };
    this.afterAction();
    this.emit();
  }

  act_joinSect(ch) {
    const s = this.state;
    if (!ch || !ch.sectId) return;
    const sect = SECT_BY_ID[ch.sectId];
    s.char.sectId = sect.id;
    s.char.contribution = 0;
    s.counters.sects_joined = (s.counters.sects_joined || 0) + 1;
    s.meta.sectsJoined = Array.from(new Set([...(s.meta.sectsJoined || []), sect.id]));
    s.flags[`入宗:${sect.id}`] = true;
    const lines = applyEffects(s, { ...(sect.joinEffects || {}), attrs: { ...(sect.joinEffects?.attrs || {}) } }, this.effectCtx());
    lines.push(`你成了${sect.name}的${sectRank(0).name}。`);
    s.scene.result = {
      text: `${sect.entry}\n\n你通过了。有人递给你一套洗得发白的宗门服，衣领上有别人的汗味。`,
      lines,
      goto: null,
    };
    this.afterAction();
    this.emit();
  }

  /* ---------------- 境界 / 天劫 ---------------- */

  buildBreakthroughNode() {
    const s = this.state;
    const c = s.char;
    const p = breakthroughChance(s);
    const major = isRealmMaxLayer(c);
    return {
      id: 'breakthrough',
      title: '叩关',
      text: `你盘坐在蒲团上，把呼吸放到最慢。\n\n${realmLabel(c)}的瓶颈就在眼前，像一层薄冰。\n\n${major ? '这一次跨过去，就是另一个境界。天不会让你轻松过去。' : '这一次只是推一扇门。'}\n\n成算：${Math.round(p * 100)}%。`,
      choices: [
        {
          label: '凝神冲关', hint: `成功率 ${Math.round(p * 100)}%`,
          action: 'breakAttempt', params: { p },
        },
        {
          label: '服丹辅助', hint: '消耗一枚筑基丹/破障丹，成功率 +18%',
          action: 'breakWithPill', require: 'has("zhuji_dan") || has("pozhang_dan")',
          requireHint: '没有辅助丹药',
        },
        { label: '再等等', hint: '退回洞府，继续打磨', action: 'backHub' },
      ],
    };
  }

  act_breakAttempt(ch) { return this.resolveBreakthrough(ch.params.p); }
  act_breakWithPill(ch) {
    const s = this.state;
    let bonus = 0;
    if (hasItem(s, 'zhuji_dan')) { removeItem(s, 'zhuji_dan'); bonus = 0.18; }
    else if (hasItem(s, 'pozhang_dan')) { removeItem(s, 'pozhang_dan'); bonus = 0.25; }
    s.buffs.breakBonus = (s.buffs.breakBonus || 0) + bonus * 100;
    return this.resolveBreakthrough(breakthroughChance(s), `丹药入腹，一股暖流撞向瓶颈。`);
  }

  resolveBreakthrough(p, prefix = '') {
    const s = this.state;
    const c = s.char;
    const ok = this.rng.chance(p);
    s.buffs.breakBonus = 0;
    if (ok) {
      s.stats.breakthroughs++;
      s.counters.streak_break = (s.counters.streak_break || 0) + 1;
      s.counters.streak_fail = 0;
      const major = isRealmMaxLayer(c);
      c.layer++;
      c.exp = 0;
      if (c.layer >= REALMS[c.realm].layers) {
        c.realm++;
        c.layer = 0;
        s.stats.tribulations++;
        c.lifespan = Math.max(c.lifespan, Math.round((80 + REALMS[c.realm].lifespan) * 12));
        recomputeDerived(c);
        return this.startTribulation(prefix);
      }
      recomputeDerived(c);
      s.scene.result = {
        text: `${prefix}\n\n冰面裂了。灵气涌进来，像春天化雪。\n\n你睁开眼，世界比之前清楚了一点——这就是${major ? '境界' : '一层'}的分量。`,
        lines: [`突破成功：${realmLabel(c)}`],
      };
    } else {
      s.stats.failures++;
      s.counters.streak_fail = (s.counters.streak_fail || 0) + 1;
      s.counters.streak_break = 0;
      const loss = Math.round(c.exp * 0.35);
      c.exp = Math.max(0, c.exp - loss);
      c.hp = Math.max(1, c.hp - Math.round(c.maxHp * 0.2));
      c.demon = clamp(c.demon + this.rng.int(3, 9), 0, 100);
      s.scene.result = {
        text: `${prefix}\n\n冰没有裂。你被弹了回来，喉咙里一股腥甜。\n\n修为散了 ${loss}，心魔又重了几分。\n\n但你还活着。活着就还有下一次。`,
        lines: ['突破失败：修为 -35%，气血受损，心魔上升'],
      };
    }
    this.afterAction();
    this.emit();
  }

  startTribulation(prefix = '') {
    const s = this.state;
    s.scene = { id: 'tribulation', result: null };
    s.tribulation = { stage: 1, total: 3, logs: [prefix].filter(Boolean) };
    this.emit();
  }

  buildTribulationNode() {
    const s = this.state;
    const t = s.tribulation || { stage: 1, total: 3, logs: [] };
    const realm = REALMS[s.char.realm];
    const p = clamp(0.9 - s.char.realm * 0.022 + s.char.attrs.道心 * 0.0022 - s.char.demon * 0.002, 0.3, 0.96);
    return {
      id: 'tribulation',
      title: `天劫 · 第${t.stage}重`,
      text: `天忽然黑了。\n\n云层压到山顶，紫色的电在云里翻。${realm.name}的雷劫，不是给你渡的，是给你看的——看你还敢不敢往上走。\n\n第${t.stage}重雷正在聚。${t.logs?.length ? '\n\n' + t.logs.slice(-2).join('\n') : ''}`,
      choices: [
        { label: '以肉身硬接', hint: `成算 ${Math.round(p * 100)}% · 受伤但省力`, action: 'tribulationStage', params: { p, mode: 'body' } },
        { label: '祭出法器抵挡', hint: '消耗灵力，成算更高', action: 'tribulationStage', params: { p: Math.min(0.97, p + 0.1), mode: 'artifact' } },
        { label: '服天劫丹', hint: '消耗天劫丹，成算 +30%', action: 'tribulationStage', params: { p: Math.min(0.98, p + 0.3), mode: 'pill' }, require: 'has("tianjie_dan")', requireHint: '没有天劫丹' },
        { label: '散功求生', hint: '放弃此劫，境界跌落，但保住性命', action: 'tribulationFlee' },
      ],
    };
  }

  act_tribulationStage(ch) {
    const s = this.state;
    const t = s.tribulation;
    const mode = ch.params.mode;
    if (mode === 'pill' && hasItem(s, 'tianjie_dan')) removeItem(s, 'tianjie_dan');
    const ok = this.rng.chance(ch.params.p);
    if (!ok) {
      s.char.hp = Math.max(0, s.char.hp - Math.round(s.char.maxHp * 0.45));
      s.char.injuries = (s.char.injuries || 0) + 2;
      s.char.demon = clamp(s.char.demon + 6, 0, 100);
      s.char.lifespan -= 120; // 十年
      t.logs.push(`第${t.stage}重雷没有散。你被劈进土里，半边身子是焦的。`);
      if (s.char.hp <= 0) {
        s.flags['渡劫失败'] = true;
        return this.finishEnding('e_tribulation_death');
      }
      t.stage++;
      if (t.stage > t.total) {
        s.tribulation = null;
        s.scene = { id: 'hub', result: { text: '雷散了。你活着，但这一劫不算渡完。\n\n境界停在原处，寿元短了十年。', lines: ['渡劫未成：气血大损，寿元 -10 年'] } };
        this.emit();
        return;
      }
      this.emit();
      return;
    }
    const dmg = mode === 'body' ? Math.round(s.char.maxHp * 0.3) : Math.round(s.char.maxHp * 0.12);
    s.char.hp = Math.max(1, s.char.hp - dmg);
    s.char.mp = Math.max(0, s.char.mp - Math.round(s.char.maxMp * 0.25));
    if (mode === 'artifact') s.char.injuries = (s.char.injuries || 0) + 1;
    t.logs.push(`第${t.stage}重雷散了。你吐了一口血，血是黑的。`);
    t.stage++;
    if (t.stage > t.total) {
      s.tribulation = null;
      s.char.attrs.道心 += 5;
      s.scene = { id: 'hub', result: null };
      s.flags['渡过天劫'] = (s.flags['渡过天劫'] || 0) + 1;
      this.pushLog('天劫散尽');
      this.checkAchievements();
      this.emit();
      return;
    }
    this.emit();
  }

  act_tribulationFlee() {
    const s = this.state;
    s.tribulation = null;
    s.char.realm = Math.max(0, s.char.realm - 1);
    s.char.layer = 0;
    s.char.exp = 0;
    s.char.lifespan = Math.round((80 + REALMS[s.char.realm].lifespan) * 12);
    s.char.demon = clamp(s.char.demon + 20, 0, 100);
    recomputeDerived(s.char);
    s.scene = { id: 'hub', result: null };
    s.scene.result = { text: '你散了功。雷在头顶转了三圈，走了。\n\n境界跌回原处，寿元短了一截。但你还活着。', lines: ['境界跌落，心魔 +20'] };
    this.emit();
  }

  act_breakthrough() {
    const s = this.state;
    s.scene = { id: 'breakthrough', result: null };
    this.emit();
  }

  act_backHub() { this.state.scene = { id: 'hub', result: null }; this.emit(); }

  /* ---------------- 战斗 ---------------- */

  startCombat(spec, { lines = [] } = {}) {
    const s = this.state;
    const defId = typeof spec === 'string' ? spec : spec.enemy;
    const def = ENEMY_BY_ID[defId];
    if (!def) { this.state.scene.result = { text: '敌人跑了。', lines }; return; }
    const enemy = scaleEnemy(def, s.char.realm);
    s.combat = {
      enemy, hp: enemy.hp, maxHp: enemy.hp, turn: 1, log: [...lines],
      onWin: typeof spec === 'object' ? spec.win || null : null,
      onLose: typeof spec === 'object' ? spec.lose || null : null,
    };
    s.scene = { id: 'combat', result: null };
    this.emit();
  }

  buildCombatNode() {
    const s = this.state;
    const cb = s.combat;
    if (!cb) return buildHub(this);
    const e = cb.enemy;
    return {
      id: 'combat',
      title: `战 · ${e.name}`,
      text: `${e.desc}\n\n${cb.log.slice(-6).join('\n')}`,
      choices: [
        { label: '出剑', hint: '以气血与根骨硬拼', action: 'combatAttack' },
        { label: '运使法术', hint: '耗灵力，伤害更高', action: 'combatSpell' },
        { label: '守势', hint: '少受伤害，回一口灵力', action: 'combatGuard' },
        { label: '服丹', hint: '疗伤丹 / 回灵丹', action: 'combatPill', require: 'has("liaoshang_dan") || has("huiling_dan")', requireHint: '没有丹药' },
        { label: '遁走', hint: '风灵根必成，其余看运气', action: 'combatFlee' },
      ],
    };
  }

  playerAtk() {
    const c = this.state.char;
    const best = c.inventory.reduce((max, it) => Math.max(max, ITEM_BY_ID[it.id]?.equip?.atk || 0), 0);
    return 9 + c.attrs.根骨 * 1.4 + c.realm * 12 + best;
  }

  act_combatAttack() { return this.combatRound('attack'); }
  act_combatSpell() { return this.combatRound('spell'); }
  act_combatGuard() { return this.combatRound('guard'); }
  act_combatFlee() { return this.combatRound('flee'); }
  act_combatPill() {
    const s = this.state;
    let used = '';
    if (hasItem(s, 'liaoshang_dan')) { removeItem(s, 'liaoshang_dan'); s.char.hp = Math.min(s.char.maxHp, s.char.hp + 60); used = '疗伤丹'; }
    else if (hasItem(s, 'huiling_dan')) { removeItem(s, 'huiling_dan'); s.char.mp = Math.min(s.char.maxMp, s.char.mp + 40); used = '回灵丹'; }
    s.combat.log.push(`你吞下一枚${used}。`);
    return this.combatRound('item');
  }

  combatRound(mode) {
    const s = this.state;
    const cb = s.combat;
    if (!cb) return;
    const c = s.char;
    const e = cb.enemy;
    const log = cb.log;

    if (mode === 'flee') {
      const chance = c.rootId === 'feng' ? 1 : 0.45 + c.attrs.气运 * 0.01;
      if (this.rng.chance(chance)) {
        log.push('你转身就跑，跑得比来时快。');
        s.stats.escapes = (s.stats.escapes || 0) + 1;
        s.combat = null;
        s.scene = { id: 'hub', result: { text: '你逃了。活着比面子重要。', lines: [] } };
        this.emit();
        return;
      }
      log.push('你转身要跑，脚下却被什么东西绊住了。');
    }

    if (mode === 'attack') {
      const crit = this.rng.chance(0.08 + c.attrs.气运 * 0.004);
      let dmg = Math.max(1, Math.round(this.playerAtk() * (crit ? 1.8 : 1) - e.def * 0.5));
      cb.hp -= dmg;
      log.push(`${crit ? '剑光一闪，正中要害！' : '你一剑劈出。'}造成 ${dmg} 伤害。`);
    } else if (mode === 'spell') {
      const cost = Math.round(c.maxMp * 0.12);
      if (c.mp >= cost) {
        c.mp -= cost;
        const dmg = Math.max(1, Math.round((12 + c.attrs.神识 * 1.8 + c.realm * 14) - e.def * 0.3));
        cb.hp -= dmg;
        log.push(`灵力化作一道光。造成 ${dmg} 伤害。`);
      } else {
        log.push('灵力不济，法术散了。');
      }
    } else if (mode === 'guard') {
      c.mp = Math.min(c.maxMp, c.mp + Math.round(c.maxMp * 0.1));
      log.push('你收剑守势，灵力回了一点。');
    } else if (mode === 'item') {
      log.push('你握紧了手里的东西。');
    }

    if (cb.hp <= 0) {
      s.stats.kills++;
      if (e.id === 'demon_king') s.flags['斩妖王'] = true;
      if (e.id === 'cultivator' && !c.inventory.some((it) => ITEM_BY_ID[it.id]?.equip)) s.flags['空手胜筑基'] = true;
      const exp = Math.round(e.exp * (1 + c.attrs.气运 * 0.01));
      const stones = e.stones;
      c.stones += stones;
      const gained = gainExp(s, exp);
      log.push(`${e.name}倒下了。修为 +${gained}，灵石 +${stones}。`);
      const onWin = cb.onWin;
      s.combat = null;
      s.scene = { id: 'hub', result: null };
      if (onWin) {
        this.resolveOutcome(onWin, log);
      } else {
        s.scene.result = { text: '你站在原地，等呼吸慢下来。', lines: log };
      }
      this.afterAction();
      this.emit();
      return;
    }

    // 敌人反击
    const edmg = Math.max(1, Math.round(e.atk * (mode === 'guard' ? 0.45 : 1) - c.attrs.根骨 * 0.25));
    c.hp -= edmg;
    log.push(`${e.name}反手一击，你受了 ${edmg} 点伤。`);
    cb.turn++;
    if (c.hp <= 0) {
      const onLose = cb.onLose;
      s.combat = null;
      s.scene = { id: 'hub', result: null };
      if (onLose) this.resolveOutcome(onLose, log);
      else this.finishEnding('e_killed');
      this.emit();
      return;
    }
    this.emit();
  }

  /* ---------------- 结局 / 成就 ---------------- */

  finishEnding(id) {
    const s = this.state;
    const ending = ENDING_BY_ID[id] || ENDINGS[ENDINGS.length - 1];
    if (s.flags.finished) return;
    s.flags.finished = true;
    s.flags.endingId = ending.id;
    s.scene = { id: 'ending', result: null };
    if (!s.meta.unlockedEndings.includes(ending.id)) s.meta.unlockedEndings.push(ending.id);
    s.meta.runs = (s.meta.runs || 0) + 1;
    s.meta.karmaPoints = (s.meta.karmaPoints || 0) + 1 + Math.floor(s.char.realm / 2);
    s.stats.deaths++;
    this.pushLog(`结局：${ending.name}`);
    this.checkAchievements();
    this.emit();
  }

  buildEndingNode() {
    const s = this.state;
    const ending = ENDING_BY_ID[s.flags.endingId] || ENDINGS[ENDINGS.length - 1];
    return {
      id: 'ending',
      title: ending.name,
      text: [
        formatText(ending.text, s),
        '',
        `—— ${s.char.name}，享年 ${Math.floor(s.char.age / 12)} 岁，${realmLabel(s.char)}。`,
        `此生：奇遇 ${s.stats.events} 次 · 突破 ${s.stats.breakthroughs} 次 · 杀敌 ${s.stats.kills} 人 · 结局「${ending.name}」`,
        '轮回点 +1。你可以带着这一点，重新投一次胎。',
      ].join('\n'),
      choices: [
        { label: '轮回转世', hint: '保留轮回点与已解锁结局', action: 'reincarnate', effect: 'primary' },
        { label: '回看这一生', hint: '查看成就与结局图鉴', action: 'fate' },
      ],
    };
  }

  act_reincarnate() {
    const s = this.state;
    s.meta.runs = (s.meta.runs || 0) + 1;
    this.state = null;
    this.emit();
    return { reincarnate: true, meta: s.meta };
  }

  checkAchievements() {
    const s = this.state;
    if (!s) return [];
    s.counters.inventory_kinds = s.char.inventory.length;
    s.counters.techniques = s.char.techniques.length;
    s.counters.titles = s.char.titles.length;
    s.counters.endings_seen = s.meta.unlockedEndings.length;
    s.counters.roots_seen = (s.counters.roots_seen || 0);
    const ctx = contextOf(s, this);
    const unlocked = [];
    for (const a of ACHIEVEMENTS) {
      if (s.meta.achievements[a.id] || s.achievements[a.id]) continue;
      let ok = false;
      try { ok = Boolean(compileCondition(a.check)(ctx)); } catch (e) { console.warn('成就条件错误', a.id, e.message); }
      if (ok) {
        this.unlockAchievement(a.id);
        unlocked.push(a);
      }
    }
    return unlocked;
  }

  unlockAchievement(id) {
    const s = this.state;
    const a = ACHIEVEMENT_BY_ID[id];
    if (!a) return null;
    if (s.meta.achievements[id]) return null;
    s.meta.achievements[id] = Date.now();
    s.achievements[id] = true;
    if (this.meta && this.meta !== s.meta) this.meta.achievements[id] = s.meta.achievements[id];
    return a.name;
  }

  hasAchievement(id) {
    return Boolean(this.state?.meta.achievements?.[id]);
  }

  /* ---------------- 场景：坊市 / 招徒 / 结局入口 ---------------- */

  buildSellNode() {
    const s = this.state;
    const sellable = s.char.inventory.filter((it) => (ITEM_BY_ID[it.id]?.price || 0) > 0 && it.qty > 0);
    const choices = sellable.map((it) => {
      const def = ITEM_BY_ID[it.id];
      const price = Math.round(def.price * 0.55);
      return {
        id: `sell_${it.id}`, label: `卖 ${def.name} ×1（${price} 灵石）`,
        hint: `持有 ${it.qty} 件`, action: 'sellItem', params: { id: it.id, price },
      };
    });
    choices.push({ id: 'back_market', label: '不卖了', hint: '', action: 'marketBack' });
    return {
      id: 'sell',
      title: '坊市 · 出手',
      text: '老头伸出手，掌心朝上。他连眼皮都没抬。',
      choices,
    };
  }

  buildMarketNode() {
    const s = this.state;
    const stock = ['liaoshang_dan', 'huiling_dan', 'yinqi_dan', 'zhuji_dan', 'huxin_fu', 'xuantie', 'leimu'];
    const choices = stock
      .map((id) => ITEM_BY_ID[id])
      .filter(Boolean)
      .map((it) => {
        const price = Math.round(it.price * (1 - Math.min(0.3, s.char.attrs.魅力 * 0.005)) * (s.char.sectId === 'wanbao' ? 0.85 : 1));
        return {
          id: `buy_${it.id}`,
          label: `买 ${it.name}（${price} 灵石）`,
          hint: it.desc,
          action: 'buyItem', params: { id: it.id, price },
          once: false,
          hideIf: null,
        };
      });
    choices.push({
      id: 'sell', label: '卖些东西', hint: '折价出售储物袋里的材料',
      action: 'sellMenu',
    });
    choices.push({ id: 'back', label: '离开坊市', hint: '', action: 'backHub' });
    return {
      id: 'market',
      title: '坊市',
      text: '坊市里什么都有：丹药、法器、消息、人。\n\n摊主是个独眼老头，他不看你，只看你的储物袋。',
      choices,
    };
  }

  act_marketBack() {
    this.state.scene = { id: 'market', result: null };
    this.emit();
  }

  act_buyItem(ch, node) {
    const s = this.state;
    const { id, price } = ch.params;
    if (s.char.stones < price) return { error: '灵石不够' };
    s.char.stones -= price;
    s.stats.goldSpent += price;
    addItem(s, id, 1);
    s.scene.result = { text: `你把${price}枚灵石推过去。老头数都没数，把东西推了回来。`, lines: [`购得 ${ITEM_BY_ID[id].name}`] };
    this.emit();
  }

  act_sellMenu() {
    const s = this.state;
    const sellable = s.char.inventory.filter((it) => (ITEM_BY_ID[it.id]?.price || 0) > 0 && it.qty > 0);
    if (!sellable.length) {
      s.scene.result = { text: '你翻了翻储物袋，没什么能卖的。', lines: [] };
      this.emit();
      return;
    }
    s.scene = { id: 'sell', result: null };
    this.emit();
  }

  act_sellItem(ch) {
    const s = this.state;
    const { id, price } = ch.params;
    if (!removeItem(s, id, 1)) return { error: '没有这件东西' };
    s.char.stones += price;
    s.scene.result = { text: `你把${ITEM_BY_ID[id]?.name || id}推过去。老头掂了掂，扔给你一袋灵石。`, lines: [`灵石 +${price}`] };
    this.emit();
  }

  buildRecruitNode() {
    const s = this.state;
    const c = s.char;
    const ctx = contextOf(s, this);
    const eligible = SECTS.filter((sect) => {
      if (sect.id === 'sanxiu') return true;
      try { return compileCondition(sect.requireExpr || 'true')(ctx); } catch { return true; }
    });
    const choices = eligible.map((sect) => ({
      label: `${sect.name}（${sect.align}）`,
      hint: `${sect.requirement} · ${sect.technique}`,
      action: 'joinSect', sectId: sect.id,
    }));
    choices.push({ label: '再想想', hint: '不入宗门，天大地大', action: 'backHub' });
    return {
      id: 'recruit',
      title: '寻访仙门',
      text: `你把周围的山头走了一遍。\n\n有的山门高得看不见顶，有的只是一间漏雨的观。守门人问你的第一句话都差不多：你为什么要修仙？\n\n你答不上来。他们也不在意。`,
      choices,
    };
  }

  pushLog(text) {
    const s = this.state;
    if (!text) return;
    s.log.push({ t: text, at: s.char.age });
    if (s.log.length > 120) s.log.shift();
  }

  afterAction() {
    const s = this.state;
    if (!s || s.flags.finished) return;
    if (s.char.demon >= 100) return this.finishEnding('e_demon_devour');
    if (isDead(s)) {
      if (s.char.hp <= 0) return this.finishEnding('e_killed');
      return this.finishEnding(this.pickNaturalEnding());
    }
    this.checkAchievements();
    if (s.scene.result?.goto) return;
    const pending = this.pendingStory();
    if (pending) this.openScene(pending);
  }

  pendingStory() {
    const s = this.state;
    if (!s) return null;
    const ctx = contextOf(s, this);
    for (const t of STORY_TRIGGERS) {
      let ok = false;
      try { ok = Boolean(compileCondition(t.when)(ctx)); } catch (e) { console.warn('剧情触发条件错误', t.id, e.message); }
      if (ok) return t.id;
    }
    return null;
  }

  pickNaturalEnding() {
    const s = this.state;
    const ctx = contextOf(s, this);
    const e = pickEnding(s, { ctx, compile: compileCondition });
    return e.id;
  }

  /* ---------------- 存档 ---------------- */

  serialize() {
    const s = this.state;
    const plain = JSON.parse(JSON.stringify(s, (k, v) => (k === 'rng' ? undefined : v)));
    plain.rngState = this.rng.getState();
    plain.version = 3;
    return plain;
  }
}
