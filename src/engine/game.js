import { RNG, clamp } from './rng.js';
import {
  createRun, advanceMonths, recomputeDerived, needExp, canBreakthrough, isRealmMaxLayer,
  breakthroughChance, monthlyExp, gainExp, isDead, addItem, removeItem, hasItem,
  qualityMultiplier, lawBonusSum, maxLawLevel, defaultLawFor, gainLawExp, bottleneckStatus,
  SAVE_VERSION,
} from './state.js';
import { applyEffects } from './effects.js';
import {
  EVENTS, buildRegistry, buildHub, choiceAvailable, markChoiceTaken, pickEvent,
  formatText, contextOf, registerEvents,
} from './narrative.js';
import { ALL_EVENTS, STORY_TRIGGERS } from '../data/events/index.js';
import { compileCondition } from './expr.js';
import {
  REALMS, realmLabel, LAWS, LAW_BY_ID, LAW_STAGES,
  DAO_BASE_QUALITIES, GOLDEN_CORE_QUALITIES,
} from '../data/realms.js';
import { ROOT_BY_ID } from '../data/roots.js';
import { SECTS, SECT_BY_ID, SECT_RANKS } from '../data/sects.js';
import { ITEM_BY_ID } from '../data/items.js';
import { ACHIEVEMENTS, ACHIEVEMENT_BY_ID } from '../data/achievements.js';
import { ENDINGS, ENDING_BY_ID, pickEnding } from '../data/endings.js';
import { ENEMY_BY_ID, scaleEnemy } from '../data/enemies.js';
import { GOLDEN_FINGER_BY_ID, PET_BY_ID } from '../data/golden_fingers.js';
import { REGIONS, REGION_BY_ID } from '../data/regions.js';
import {
  SECT_LIBRARIES, SECT_TREASURY, SECT_MISSIONS, SECT_PROMOTION_TRIALS,
} from '../data/sectContent.js';
import { WORLD_TECHNIQUES, WORLD_TECH_BY_ID } from '../data/techniques.js';
import { NPCS, NPC_BY_ID } from '../data/npcs.js';

const MONTHS = 1;
const ARTIFACT_TIERS = ['凡铁胚', '下品灵剑', '中品法宝', '上品通灵剑', '地阶灵宝', '太古仙剑'];

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

  newRun({ seed, name, gender, originId, rootId, goldenFingerId, meta } = {}) {
    const s = createRun({
      seed: seed ?? (Date.now() >>> 0), name, gender, originId, rootId, goldenFingerId,
      meta: meta || this.meta,
    });
    this.rng = new RNG(s.seed);
    this.state = s;
    this.meta = s.meta;
    this.state.scene = { id: 'hub', result: null };
    this.state.rumors = [`【天机阁风闻】青牛山脉又有一名${ROOT_BY_ID[s.char.rootId]?.name || '凡体'}少年踏入仙途，道号「${s.char.name}」。`];
    this.checkAchievements();
    this.emit();
    return s;
  }

  setState(state) {
    this.state = state;
    const c = state.char;
    if (!c.regionId) c.regionId = 'qingniu';
    if (!c.regionProgress) c.regionProgress = { [c.regionId]: 0 };
    if (!c.laws) c.laws = {};
    if (c.lawExp == null) c.lawExp = 0;
    if (c.sectRank == null) c.sectRank = 0;
    this.rng = new RNG(state.seed);
    this.rng.setState(state.rngState);
    this.meta = state.meta;
    recomputeDerived(c);
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
    switch (s.scene.id) {
      case 'hub': return buildHub(this);
      case 'cave': return this.buildCaveNode();
      case 'regionHub': return this.buildRegionNode();
      case 'regionMap': return this.buildRegionMapNode();
      case 'sectHall': return this.buildSectHallNode();
      case 'sectMissions': return this.buildSectMissionsNode();
      case 'sectLibrary': return this.buildSectLibraryNode();
      case 'sectTreasury': return this.buildSectTreasuryNode();
      case 'sectPromote': return this.buildSectPromoteNode();
      case 'cityHub': return this.buildCityNode();
      case 'techShop': return this.buildTechShopNode();
      case 'tianji': return this.buildTianjiNode();
      case 'npcHub': return this.buildNpcHubNode();
      case 'npcDetail': return this.buildNpcDetailNode();
      case 'combat': return this.buildCombatNode();
      case 'market': return this.buildMarketNode();
      case 'auction': return this.buildAuctionNode();
      case 'sell': return this.buildSellNode();
      case 'recruit': return this.buildRecruitNode();
      case 'breakthrough': return this.buildBreakthroughNode();
      case 'tribulation': return this.buildTribulationNode();
      case 'ending': return this.buildEndingNode();
      default: {
        const node = this.registry.get(s.scene.id);
        return node || buildHub(this);
      }
    }
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
    return formatText(node.text, this.state);
  }

  choices() {
    const node = this.currentNode();
    if (!node) return [];
    const s = this.state;
    if (s.scene.result && !s.scene.result.combatPrompt) {
      return [{ index: 0, label: s.scene.result.ending ? '观此生终章' : '继续前行', hint: '', action: 'continue', effect: 'primary' }];
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
      if (s.char.goldenFingerId === 'gf_karma_mirror') p += 0.08;
      p = clamp(p, 0.02, 0.98);
      const ok = this.rng.chance(p);
      outcome = (ok ? ch.roll.success : ch.roll.fail) || outcome;
      lines.push(ok ? '—— 成。' : '—— 败。');
    }

    const combatSpec = outcome?.combat || ch.combat;
    if (combatSpec) {
      return this.startCombat(combatSpec, { lines });
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
    const effects = outcome.effects || {};
    if (outcome.promoteRank != null) {
      s.char.sectRank = Math.max(s.char.sectRank || 0, outcome.promoteRank);
      const rName = SECT_RANKS[s.char.sectRank]?.name || '执事';
      const sName = SECT_BY_ID[s.char.sectId]?.name || '宗门';
      lines.push(`【宗门晋升】获赐「${sName}·${rName}」玉牌！`);
      this.pushRumor(`【仙门喜讯】「${s.char.name}」通过宗门大考，正式晋升${sName}${rName}！`);
    }
    if (outcome.ending) {
      if (effects && Object.keys(effects).length) {
        lines.push(...applyEffects(s, effects, this.effectCtx()));
      }
      const endingId = outcome.dynamicAscend ? this.pickNaturalEnding() : outcome.ending;
      s.scene.result = { text: formatText(outcome.text, s) || '', lines, ending: endingId, goto: null };
      this.finishEnding(endingId);
      return;
    }
    if (effects && Object.keys(effects).length) {
      lines.push(...applyEffects(s, effects, this.effectCtx()));
    }
    recomputeDerived(s.char);
    s.scene.result = {
      text: formatText(outcome.text, s),
      lines,
      goto: outcome.goto || null,
      returnTo: outcome.returnTo || null,
      fx: outcome.fx || null,
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
    const returnTo = result.returnTo;
    const extra = result.returnMeta || null;
    s.scene.result = null;
    if (goto) {
      this.openScene(goto);
    } else if (returnTo && !(returnTo === 'cave' && canBreakthrough(s.char))) {
      s.scene = { id: returnTo, result: null, ...(extra || {}) };
    } else {
      s.scene = { id: 'hub', result: null };
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

  /* ---------------- 支柱一：洞府修行 ---------------- */

  act_openCave() {
    this.state.scene = { id: 'cave', result: null };
    this.emit();
  }

  buildCaveNode() {
    const s = this.state;
    const c = s.char;
    const lid = defaultLawFor(c);
    const law = LAW_BY_ID[lid];
    const lawLvl = c.laws?.[lid] || 0;
    const choices = [
      { id: 'cultivate', label: '吐纳炼气', hint: '半年 · 稳步积攒修为，无心魔之忧', action: 'cultivate', params: { months: 6, returnTo: 'cave' }, effect: 'quiet' },
      { id: 'deep', label: '闭关苦修', hint: '两年 · 进境极快，须防心魔滋生', action: 'cultivate', params: { months: 24, demonRisk: true, returnTo: 'cave' } },
      { id: 'comprehend', label: `参悟${law?.name || '大道'}`, hint: `半年 · 悟性/道心 + 法则（${LAW_STAGES[lawLvl]}）`, action: 'comprehend', params: { returnTo: 'cave' } },
    ];
    if (c.demon > 0 || c.injuries > 0) {
      choices.push({ id: 'settle', label: '静心涤魔', hint: `三月 · 镇压心魔(${Math.round(c.demon)})，调理内伤`, action: 'settle', params: { returnTo: 'cave' } });
    }
    if (c.sectId === 'danxia' || hasItem(s, 'lingcao') || hasItem(s, 'qiannian_lingcao')) {
      choices.push({ id: 'alchemy', label: '开炉炼丹', hint: '一月 · 炼制丹药（有千年灵草可炼高阶丹）', action: 'alchemy', params: { returnTo: 'cave' } });
    }
    const refineCost = Math.round((240 + (c.artifactLevel || 0) * 360) * Math.pow(1.8, Math.max(0, c.artifactLevel || 0)));
    choices.push({
      id: 'refine',
      label: '祭炼法宝',
      hint: (c.artifactLevel || 0) >= ARTIFACT_TIERS.length - 1 ? '已臻太古仙剑之境' : `三月 · 温养「${c.artifactName}」（灵材或 ${refineCost} 灵石）`,
      action: 'refine',
      params: { returnTo: 'cave' },
      disabled: (c.artifactLevel || 0) >= ARTIFACT_TIERS.length - 1,
      reason: '法宝已达极境',
    });
    if (c.goldenFingerId === 'gf_bottle') {
      choices.push({ id: 'bottle_ripen', label: '绿瓶催灵', hint: '两月 · 催熟灵草凝丹', action: 'bottleRipen', params: { returnTo: 'cave' } });
    }
    if (c.rootId === 'xue') {
      choices.push({
        id: 'blood_cultivate', label: '燃血秘修', hint: '三月 · 焚血换取暴涨修为',
        action: 'bloodCultivate', params: { returnTo: 'cave' },
        require: 'char.hp > char.maxHp * 0.35', requireHint: '气血不足，强行燃血恐伤本源',
      });
    }
    if (c.realm >= 3 && !s.flags.开宗立派) {
      choices.push({ id: 'found_sect', label: '开宗立派', hint: '自立山门，扬名九州', action: 'foundSect' });
    }
    choices.push({ id: 'back_hub', label: '步出洞府', hint: '返回主界面', action: 'backHub' });

    const needText = Number.isFinite(needExp(c)) ? needExp(c).toLocaleString() : '∞';
    return {
      id: 'cave',
      title: '静室 · 洞府修行',
      text: `洞府禁制微光流转，灵脉之气如细雨般渗入蒲团。\n\n当前修为：${Math.floor(c.exp).toLocaleString()} / ${needText}（月修为 ${monthlyExp(s).toLocaleString()}）\n主修法则：${law?.name || '剑道'} · ${LAW_STAGES[lawLvl]} | 心魔：${Math.round(c.demon)} | 本命法宝：${c.artifactName}`,
      choices,
      subhub: true,
    };
  }

  /* ---------------- 支柱二：九州历练 ---------------- */

  act_openRegion() {
    this.state.scene = { id: 'regionHub', result: null };
    this.emit();
  }

  buildRegionNode() {
    const s = this.state;
    const c = s.char;
    const region = REGION_BY_ID[c.regionId] || REGION_BY_ID.qingniu;
    const prog = Math.min(100, Math.round(c.regionProgress?.[region.id] || 0));
    const choices = [
      {
        id: 'region_explore',
        label: `探索${region.name}`,
        hint: `三月 · 触发州域奇遇、猎妖寻宝（探索度 ${prog}%）`,
        action: 'regionExplore',
      },
      {
        id: 'region_hunt',
        label: '主动猎妖历战',
        hint: `两月 · 挑战${region.name}盘踞妖邪，磨砺战法`,
        action: 'regionHunt',
      },
      {
        id: 'region_secret',
        label: '闯入本州秘境',
        hint: '半年 · 深入古境夺造化（高危高回报）',
        action: 'secretRealm',
      },
      {
        id: 'open_map',
        label: '九州舆图 · 迁徙',
        hint: '前往其他已解锁州域（共八大灵域）',
        action: 'openRegionMap',
      },
      { id: 'back_hub', label: '返回洞府', hint: '回主界面', action: 'backHub' },
    ];
    return {
      id: 'regionHub',
      title: `九州历练 · ${region.name}`,
      text: `${region.desc}\n\n地界特产：${region.specialty}\n当前探索进度：${prog}% | 危险评级：${'★'.repeat(region.danger)}`,
      choices,
      subhub: true,
    };
  }

  act_regionExplore() {
    const s = this.state;
    const c = s.char;
    const region = REGION_BY_ID[c.regionId] || REGION_BY_ID.qingniu;
    const lines = advanceMonths(s, 3, this.rng);
    c.regionProgress = c.regionProgress || {};
    const prev = c.regionProgress[region.id] || 0;
    const gainProg = this.rng.int(9, 16);
    c.regionProgress[region.id] = Math.min(100, prev + gainProg);
    if (prev < 100 && c.regionProgress[region.id] >= 100) {
      const rewardItem = this.rng.pick(region.exploreRewards || ['lingcao']);
      addItem(s, rewardItem, 1);
      c.reputation += 25 + region.danger * 12;
      lines.push(`【州域踏破】${region.name}探索度圆满！声望大增，获赠「${ITEM_BY_ID[rewardItem]?.name || rewardItem}」！`);
      this.pushRumor(`【九州游侠】「${c.name}」踏遍${region.name}险地，令此地群修侧目。`);
    }

    const ev = pickEvent(s, this.rng, this, this.rng.chance(0.7) ? 'wild' : 'world', region.id);
    const evChance = c.rootId === 'kongjian' ? 0.85 : 0.68;
    if (ev && this.rng.chance(evChance)) {
      this.openEvent(ev);
      this.afterAction();
      this.emit();
      return;
    }

    // 未触大事件时，概率遇本州妖兽或采集本州特产
    if (this.rng.chance(0.45) && region.enemies?.length) {
      const eid = this.rng.pick(region.enemies);
      lines.push(`你在${region.name}深处撞见了盘踞此地的妖邪！`);
      return this.startCombat(eid, { lines });
    }
    const lootId = this.rng.pick(region.exploreRewards || ['lingcao']);
    const stones = Math.round((25 + region.danger * 45) * (REALMS[c.realm]?.powerMult || 1) * 0.4);
    c.stones += stones;
    addItem(s, lootId, 1);
    lines.push(`搜山寻幽有所收获：灵石 +${stones}，${ITEM_BY_ID[lootId]?.name || lootId} ×1（探索度 ${c.regionProgress[region.id]}%）。`);
    s.scene.result = {
      text: `你沿${region.name}古道深入数十里，拨开荒草断碑，竟于隐蔽石隙间寻得前人遗物。`,
      lines,
      returnTo: 'regionHub',
    };
    this.afterAction();
    this.emit();
  }

  act_regionHunt() {
    const s = this.state;
    const c = s.char;
    const region = REGION_BY_ID[c.regionId] || REGION_BY_ID.qingniu;
    const lines = advanceMonths(s, 2, this.rng);
    const eid = this.rng.pick(region.enemies || ['wolf']);
    lines.push(`你在${region.name}循着妖气追出十里，迎面撞上强敌！`);
    return this.startCombat(eid, { lines });
  }

  act_openRegionMap() {
    this.state.scene = { id: 'regionMap', result: null };
    this.emit();
  }

  buildRegionMapNode() {
    const s = this.state;
    const c = s.char;
    const travelMonths = c.rootId === 'kongjian' ? 3 : c.rootId === 'feng' ? 4 : 6;
    const choices = REGIONS.map((r) => {
      const unlocked = c.realm >= r.minRealm;
      const isHere = c.regionId === r.id;
      const prog = Math.min(100, Math.round(c.regionProgress?.[r.id] || 0));
      const reqName = REALMS[r.minRealm]?.name || '炼气';
      return {
        id: `goto_${r.id}`,
        label: `${r.name}${isHere ? '（当前）' : ''} · ${prog}%`,
        hint: unlocked ? `${r.specialty}` : `需达「${reqName}境」方可踏足`,
        action: 'gotoRegion',
        params: { regionId: r.id, months: travelMonths },
        disabled: !unlocked || isHere,
        reason: isHere ? '已在此地' : `需${reqName}境`,
      };
    });
    choices.push({ id: 'back_region', label: '返回', hint: '回九州历练', action: 'openRegion' });
    return {
      id: 'regionMap',
      title: '九州舆图 · 灵域迁徙',
      text: `九州浩瀚，灵气随地界由薄入厚。高阶灵域遍布稀世灵材与法则机缘，亦有凶险大妖盘踞。\n\n当前所在：${c.location}（迁徙耗时 ${travelMonths} 月）`,
      choices,
      subhub: true,
    };
  }

  act_gotoRegion(ch) {
    const s = this.state;
    const c = s.char;
    const region = REGION_BY_ID[ch.params?.regionId];
    if (!region) return;
    if (c.realm < region.minRealm) return { error: `需达${REALMS[region.minRealm]?.name}境方可前往` };
    const months = ch.params?.months || 6;
    const lines = advanceMonths(s, months, this.rng);
    c.regionId = region.id;
    c.location = region.name;
    c.regionProgress = c.regionProgress || {};
    if (c.regionProgress[region.id] == null) c.regionProgress[region.id] = 0;
    c.visitedLocations = c.visitedLocations || ['青牛山脉'];
    const isFirst = !c.visitedLocations.includes(region.name);
    if (isFirst) c.visitedLocations.push(region.name);
    lines.push(`跋涉${months}月，抵达「${region.name}」。`);
    if (isFirst && c.goldenFingerId === 'gf_signin') {
      const bonusStones = 180 + region.danger * 160;
      c.stones += bonusStones;
      const gift = region.exploreRewards?.[0] || 'yinqi_dan';
      addItem(s, gift, 1);
      lines.push(`【万界道碑】首临${region.name}，碑面赐下灵石 +${bonusStones}、${ITEM_BY_ID[gift]?.name || gift} ×1！`);
      this.pushRumor(`【九州异象】「${c.name}」初入${region.name}，天际似有古碑虚影一闪而逝。`);
    }
    const ev = pickEvent(s, this.rng, this, 'world', region.id);
    if (ev && this.rng.chance(0.55)) {
      this.openEvent(ev);
      this.afterAction();
      this.emit();
      return;
    }
    s.scene.result = { text: region.desc, lines, returnTo: 'regionHub' };
    this.afterAction();
    this.emit();
  }

  /* ---------------- 支柱三：仙门大殿 ---------------- */

  act_openSectHall() {
    if (!this.state.char.sectId) return this.act_sectRecruit();
    this.state.scene = { id: 'sectHall', result: null };
    this.emit();
  }

  buildSectHallNode() {
    const s = this.state;
    const c = s.char;
    const sect = SECT_BY_ID[c.sectId];
    if (!sect) return this.buildRecruitNode();
    const rankIdx = c.sectRank || 0;
    const rankInfo = SECT_RANKS[rankIdx] || SECT_RANKS[0];
    const nextTrial = SECT_PROMOTION_TRIALS.find((t) => t.fromRank === rankIdx);
    const veinCost = 80 + rankIdx * 50;
    const choices = [
      { id: 'sect_missions', label: '任务堂', hint: '接取外门/内门/真传三阶宗门悬赏', action: 'openSectMissions' },
      { id: 'sect_library', label: '藏经阁', hint: '以贡献参悟本宗四阶镇宗功法与神通', action: 'openSectLibrary' },
      { id: 'sect_treasury', label: '宗门宝库', hint: '以贡献兑换破境灵丹、高阶灵材与法器', action: 'openSectTreasury' },
      {
        id: 'sect_vein',
        label: '灵脉聚灵阵',
        hint: `一年 · 耗 ${veinCost} 贡献，借宗门灵脉加速闭关与悟道`,
        action: 'sectVein',
        disabled: c.contribution < veinCost,
        reason: `需 ${veinCost} 宗门贡献`,
      },
      {
        id: 'sect_promote',
        label: nextTrial ? `晋升考核 · ${nextTrial.rankName}` : '宗门极位 · 太上长老',
        hint: nextTrial ? `需${REALMS[nextTrial.minRealm]?.name}境 · ${nextTrial.contribution} 贡献` : '你已居宗门至高尊位',
        action: 'openSectPromote',
        disabled: !nextTrial,
        reason: '已至最高职阶',
      },
      { id: 'sect_leave', label: '叛出师门', hint: '卸下宗门身份重归散修（声望 -30，贡献清零）', action: 'sectLeave' },
      { id: 'back_hub', label: '离开山门', hint: '返回主界面', action: 'backHub' },
    ];
    return {
      id: 'sectHall',
      title: `${sect.name} · ${sect.seat}`,
      text: `${sect.desc}\n\n当前身份：${rankInfo.name}（职阶 ${rankIdx + 1}/${SECT_RANKS.length}）\n宗门贡献：${c.contribution.toLocaleString()} | 宗门传承：${sect.technique}`,
      choices,
      subhub: true,
    };
  }

  act_openSectMissions() {
    this.state.scene = { id: 'sectMissions', result: null };
    this.emit();
  }

  buildSectMissionsNode() {
    const s = this.state;
    const c = s.char;
    const sect = SECT_BY_ID[c.sectId];
    const list = SECT_MISSIONS[c.sectId] || SECT_MISSIONS.sanxiu;
    const choices = list.map((m) => {
      const okRank = (c.sectRank || 0) >= m.minRank;
      const okRealm = c.realm >= m.minRealm;
      const reqRank = SECT_RANKS[m.minRank]?.name || '外门弟子';
      const reqRealm = REALMS[m.minRealm]?.name || '炼气';
      return {
        id: `m_${m.id}`,
        label: `【${m.tier}】${m.title}`,
        hint: okRank && okRealm
          ? `${m.months}月 · 贡献 +${m.contribution} · 灵石 +${m.stones}${m.enemy ? ' · 含斗法' : ''}`
          : `需${reqRank}且达${reqRealm}境`,
        action: 'runSectMission',
        params: { missionId: m.id },
        disabled: !(okRank && okRealm),
        reason: !okRank ? `需${reqRank}` : `需${reqRealm}境`,
      };
    });
    choices.push({ id: 'sect_daily', label: '常规宗门杂务', hint: '三月 · 稳妥赚取基础贡献，无斗法风险', action: 'sectTask', params: { returnTo: 'sectMissions' } });
    choices.push({ id: 'back_sect', label: '返回大殿', hint: '', action: 'openSectHall' });
    return {
      id: 'sectMissions',
      title: `${sect?.name || '宗门'} · 任务堂`,
      text: '殿前玉璧悬着三阶榜文，自外门杂务至真传密令井然有序。贡献越高，越可入藏经阁深层与宝库核心。',
      choices,
      subhub: true,
    };
  }

  act_runSectMission(ch) {
    const s = this.state;
    const c = s.char;
    const list = SECT_MISSIONS[c.sectId] || SECT_MISSIONS.sanxiu;
    const m = list.find((x) => x.id === ch.params?.missionId);
    if (!m) return;
    const lines = advanceMonths(s, m.months || 3, this.rng);
    const expGain = Math.round(monthlyExp(s) * (m.months || 3) * 0.65);
    if (m.enemy) {
      lines.push(`接下「${m.title}」：${m.desc}`);
      return this.startCombat({
        enemy: m.enemy,
        win: {
          text: `差事圆满完成！「${m.title}」已交割任务堂，执事长老颔首记功。`,
          effects: {
            contribution: m.contribution,
            stones: m.stones,
            reputation: m.reputation || 0,
            exp: expGain,
          },
          returnTo: 'sectMissions',
          log: `宗门任务·${m.title}`,
        },
        lose: {
          text: '强敌难挡，你负伤退回山门，任务堂只得将此榜撤下。',
          effects: { hp: Math.max(10, Math.round(c.maxHp * 0.25)), injuries: 1 },
          returnTo: 'sectHall',
        },
      }, { lines });
    }
    c.contribution += m.contribution;
    c.stones += m.stones;
    c.reputation += (m.reputation || 0);
    const got = gainExp(s, expGain);
    lines.push(`${m.desc}\n任务圆满：贡献 +${m.contribution}，灵石 +${m.stones}，修为 +${got}。`);
    const ev = pickEvent(s, this.rng, this, 'sect');
    if (ev && this.rng.chance(0.32)) {
      this.openEvent(ev);
      this.afterAction();
      this.emit();
      return;
    }
    s.scene.result = { text: `你依宗门玉简圆满办妥「${m.title}」，回山交割功劳簿。`, lines, returnTo: 'sectMissions' };
    this.afterAction();
    this.emit();
  }

  act_openSectLibrary() {
    this.state.scene = { id: 'sectLibrary', result: null };
    this.emit();
  }

  buildSectLibraryNode() {
    const s = this.state;
    const c = s.char;
    const sect = SECT_BY_ID[c.sectId];
    const manuals = SECT_LIBRARIES[c.sectId] || SECT_LIBRARIES.sanxiu;
    const choices = manuals.map((m) => {
      const learned = c.techniques.some((t) => t.id === m.id);
      const okRank = (c.sectRank || 0) >= m.minRank;
      const okCost = c.contribution >= m.cost;
      const reqRank = SECT_RANKS[m.minRank]?.name || '外门弟子';
      const stats = `修炼+${Math.round(m.speed * 100)}% 攻+${Math.round(m.atk * 100)}% 防+${Math.round(m.def * 100)}% · 神通「${m.artName}」`;
      return {
        id: `lib_${m.id}`,
        label: `${m.name}${learned ? '（已参悟）' : `（${m.cost} 贡献）`}`,
        hint: learned ? stats : (!okRank ? `需${reqRank}方可借阅 · ${stats}` : stats),
        action: 'buySectManual',
        params: { manualId: m.id },
        disabled: learned || !okRank || !okCost,
        reason: learned ? '已习得' : !okRank ? `需${reqRank}` : `需 ${m.cost} 贡献`,
      };
    });
    choices.push({ id: 'back_sect', label: '离开藏经阁', hint: '', action: 'openSectHall' });
    return {
      id: 'sectLibrary',
      title: `${sect?.name || '宗门'} · 藏经阁`,
      text: `楼阁四重，玉简流光。参悟镇宗功法可永久提升修炼速度、攻防倍率、寿元，并解锁专属战斗绝招。\n\n当前职阶：${SECT_RANKS[c.sectRank || 0]?.name} | 可用贡献：${c.contribution.toLocaleString()}`,
      choices,
      subhub: true,
    };
  }

  act_buySectManual(ch) {
    const s = this.state;
    const c = s.char;
    const manuals = SECT_LIBRARIES[c.sectId] || SECT_LIBRARIES.sanxiu;
    const m = manuals.find((x) => x.id === ch.params?.manualId);
    if (!m) return;
    if (c.techniques.some((t) => t.id === m.id)) return { error: '已参悟此典' };
    if ((c.sectRank || 0) < m.minRank) return { error: `职阶不足（需${SECT_RANKS[m.minRank]?.name}）` };
    if (c.contribution < m.cost) return { error: `宗门贡献不足（需 ${m.cost}）` };
    c.contribution -= m.cost;
    c.techniques.push({
      id: m.id, name: m.name, speed: m.speed, atk: m.atk, def: m.def,
      lifespan: m.lifespan, lawId: m.lawId, artName: m.artName,
    });
    const lawLines = m.lawId ? gainLawExp(s, 45 + m.minRank * 25, m.lawId) : [];
    recomputeDerived(c);
    if (manuals.every((x) => c.techniques.some((t) => t.id === x.id))) {
      s.flags['读遍藏经阁'] = true;
    }
    this.pushLog(`藏经阁参悟${m.name}`);
    s.scene.result = {
      text: `你盘坐藏经阁静室，将${m.name}玉简贴于眉心。万千道纹如星河灌顶，领悟宗门绝学「${m.artName}」！\n\n${m.desc}`,
      lines: [`消耗贡献 ${m.cost}，永久习得 ${m.name}`, ...lawLines],
      fx: 'breakthrough',
      returnTo: 'sectLibrary',
    };
    this.afterAction();
    this.emit();
  }

  act_openSectTreasury() {
    this.state.scene = { id: 'sectTreasury', result: null };
    this.emit();
  }

  buildSectTreasuryNode() {
    const s = this.state;
    const c = s.char;
    const sect = SECT_BY_ID[c.sectId];
    const items = SECT_TREASURY[c.sectId] || SECT_TREASURY.sanxiu;
    const choices = items.map((entry, idx) => {
      const def = ITEM_BY_ID[entry.itemId];
      const okRank = (c.sectRank || 0) >= entry.minRank;
      const okCost = c.contribution >= entry.cost;
      const reqRank = SECT_RANKS[entry.minRank]?.name || '外门弟子';
      return {
        id: `tr_${idx}_${entry.itemId}`,
        label: `兑换 ${def?.name || entry.itemId}（${entry.cost} 贡献）`,
        hint: okRank ? `${entry.note} · ${def?.desc || ''}` : `需${reqRank}方可兑换`,
        action: 'buySectTreasury',
        params: { idx },
        disabled: !okRank || !okCost,
        reason: !okRank ? `需${reqRank}` : `需 ${entry.cost} 贡献`,
      };
    });
    choices.push({ id: 'back_sect', label: '返回大殿', hint: '', action: 'openSectHall' });
    return {
      id: 'sectTreasury',
      title: `${sect?.name || '宗门'} · 宗门宝库`,
      text: `宝库禁制森严，唯持本宗弟子令牌与功勋贡献方可换取破境灵丹与奇珍灵材。\n\n当前职阶：${SECT_RANKS[c.sectRank || 0]?.name} | 可用贡献：${c.contribution.toLocaleString()}`,
      choices,
      subhub: true,
    };
  }

  act_buySectTreasury(ch) {
    const s = this.state;
    const c = s.char;
    const items = SECT_TREASURY[c.sectId] || SECT_TREASURY.sanxiu;
    const entry = items[ch.params?.idx];
    if (!entry) return;
    if ((c.sectRank || 0) < entry.minRank) return { error: '职阶不足' };
    if (c.contribution < entry.cost) return { error: '贡献不足' };
    c.contribution -= entry.cost;
    const line = addItem(s, entry.itemId, 1);
    s.scene.result = {
      text: `执事长老划去玉牌上的功勋点，自架上取下封灵玉盒交到你手中。`,
      lines: [`消耗贡献 ${entry.cost}`, line],
      fx: 'alchemy',
      returnTo: 'sectTreasury',
    };
    this.afterAction();
    this.emit();
  }

  act_sectVein() {
    const s = this.state;
    const c = s.char;
    const rankIdx = c.sectRank || 0;
    const cost = 80 + rankIdx * 50;
    if (c.contribution < cost) return { error: `贡献不足（需 ${cost}）` };
    c.contribution -= cost;
    const lines = advanceMonths(s, 12, this.rng);
    const mult = 1.5 + rankIdx * 0.22;
    const got = gainExp(s, Math.round(monthlyExp(s) * 12 * mult));
    const lawLines = gainLawExp(s, 22 + rankIdx * 12);
    lines.push(`聚灵大阵全开一年：修为 +${got.toLocaleString()}（倍率 ${mult.toFixed(2)}×）`, ...lawLines);
    s.scene.result = {
      text: '宗门核心灵脉轰鸣运转，浓郁灵气化作乳白灵雾倾泻而下，周天搬运事半功倍。',
      lines,
      fx: 'breakthrough',
      returnTo: canBreakthrough(c) ? 'hub' : 'sectHall',
    };
    this.afterAction();
    this.emit();
  }

  act_openSectPromote() {
    this.state.scene = { id: 'sectPromote', result: null };
    this.emit();
  }

  buildSectPromoteNode() {
    const s = this.state;
    const c = s.char;
    const rankIdx = c.sectRank || 0;
    const trial = SECT_PROMOTION_TRIALS.find((t) => t.fromRank === rankIdx);
    if (!trial) return this.buildSectHallNode();
    const missing = [];
    if (c.realm < trial.minRealm) missing.push(`需达${REALMS[trial.minRealm]?.name}境`);
    if (c.contribution < trial.contribution) missing.push(`需 ${trial.contribution} 贡献（当前 ${c.contribution}）`);
    for (const [k, v] of Object.entries(trial.minAttrs || {})) {
      if ((c.attrs[k] || 0) < v) missing.push(`${k}需 ≥ ${v}（当前 ${Math.round(c.attrs[k] || 0)}）`);
    }
    const flavor = trial.sectFlavor?.[c.sectId] || trial.desc;
    return {
      id: 'sectPromote',
      title: trial.title,
      text: `${trial.desc}\n\n【本宗试炼】${flavor}\n\n考核条件：${REALMS[trial.minRealm]?.name}境 · 贡献 ≥ ${trial.contribution}${Object.entries(trial.minAttrs || {}).map(([k, v]) => ` · ${k} ≥ ${v}`).join('')}${missing.length ? `\n\n尚欠条件：${missing.join('；')}` : '\n\n条件已齐，即刻登台受考！'}`,
      choices: [
        {
          id: 'start_promote',
          label: `登台应考 · 冲击${trial.rankName}`,
          hint: missing.length ? missing[0] : '胜出即可获赐新职阶玉牌，解锁深层功法与宝库',
          action: 'sectPromote',
          disabled: missing.length > 0,
          reason: missing[0] || '',
          effect: 'primary',
        },
        { id: 'back_sect', label: '改日再来', hint: '', action: 'openSectHall' },
      ],
    };
  }

  act_sectPromote() {
    const s = this.state;
    const c = s.char;
    const trial = SECT_PROMOTION_TRIALS.find((t) => t.fromRank === (c.sectRank || 0));
    if (!trial) return;
    if (c.realm < trial.minRealm || c.contribution < trial.contribution) return { error: '晋升条件尚未满足' };
    for (const [k, v] of Object.entries(trial.minAttrs || {})) {
      if ((c.attrs[k] || 0) < v) return { error: `${k}不足` };
    }
    const flavor = trial.sectFlavor?.[c.sectId] || trial.desc;
    return this.startCombat({
      enemy: trial.enemy,
      win: {
        text: `钟鸣三响，全场静默！你凭借过硬修为力克考官，正式获封「${SECT_BY_ID[c.sectId]?.name} · ${trial.rankName}」！`,
        promoteRank: trial.toRank,
        effects: { reputation: 40 + trial.toRank * 30, attrs: { 道心: 3 } },
        returnTo: 'sectHall',
        fx: 'breakthrough',
        log: `晋升${trial.rankName}`,
      },
      lose: {
        text: '你未能接住考官杀招，拱手认负退下擂台。长老淡声道：「回去再磨三年罢。」',
        effects: { hp: Math.max(10, Math.round(c.maxHp * 0.35)) },
        returnTo: 'sectHall',
      },
    }, { lines: [`【${trial.title}】${flavor}`] });
  }

  act_sectLeave() {
    const s = this.state;
    const c = s.char;
    const oldName = SECT_BY_ID[c.sectId]?.name || '宗门';
    c.sectId = null;
    c.sectRank = 0;
    c.contribution = 0;
    c.reputation -= 30;
    s.flags['临阵脱逃'] = true;
    recomputeDerived(c);
    this.pushRumor(`【宗门叛离】「${c.name}」交还弟子令牌，悍然脱离${oldName}，震动山门。`);
    s.scene.result = {
      text: `你将染满岁月痕迹的${oldName}弟子玉牌置于山门石阶之上，转身步入漫漫烟云。\n\n从此天大地大，再无宗门庇护，亦无门规束缚。`,
      lines: [`脱离${oldName}，贡献清零，声望 -30`],
      returnTo: 'hub',
    };
    this.afterAction();
    this.emit();
  }

  /* ---------------- 支柱四：仙城坊市与天机阁 ---------------- */

  act_openCity() {
    this.state.scene = { id: 'cityHub', result: null };
    this.emit();
  }

  buildCityNode() {
    const s = this.state;
    const c = s.char;
    const region = REGION_BY_ID[c.regionId] || REGION_BY_ID.qingniu;
    return {
      id: 'cityHub',
      title: `${region.name} · 仙城坊市`,
      text: `长街灯火如昼，丹阁、器坊、拍卖行与天机茶楼鳞次栉比。\n\n当前身家：${c.stones.toLocaleString()} 灵石 | 州域货源随所在灵域品阶变化。`,
      choices: [
        { id: 'city_market', label: `${region.name}商行`, hint: '一月 · 买卖本州特产丹药、破境灵丹与炼器灵材', action: 'market' },
        { id: 'city_techs', label: '古籍秘阁', hint: '以灵石购藏九州散落功法典籍（凡→仙六品）', action: 'openTechShop' },
        { id: 'city_auction', label: '万宝阁 · 暗拍盛会', hint: '一月 · 竞拍洗髓丹、高阶破境宝丹与仙材', action: 'auction' },
        { id: 'city_tianji', label: '天机阁 · 潜龙榜', hint: '查阅九州排名、本界风闻与历世战力评估', action: 'openTianji' },
        { id: 'back_hub', label: '离开坊市', hint: '返回主界面', action: 'backHub' },
      ],
      subhub: true,
    };
  }

  act_openTechShop() {
    this.state.scene = { id: 'techShop', result: null };
    this.emit();
  }

  buildTechShopNode() {
    const s = this.state;
    const c = s.char;
    const gradeOrder = { 凡: 0, 黄: 1, 玄: 2, 地: 3, 天: 4, 仙: 6 };
    const gradePrice = { 凡: 180, 黄: 680, 玄: 2200, 地: 7500, 天: 26000, 仙: 95000 };
    const discount = (c.sectId === 'wanbao' ? 0.85 : 1) * (c.goldenFingerId === 'gf_karma_mirror' ? 0.88 : 1);
    const available = WORLD_TECHNIQUES.filter((t) => (gradeOrder[t.grade] ?? 0) <= c.realm + 1 && !c.techniques.some((x) => x.id === t.id));
    const shown = available.slice(0, 8);
    const choices = shown.map((t) => {
      const price = Math.round((gradePrice[t.grade] || 800) * discount);
      return {
        id: `wt_${t.id}`,
        label: `【${t.grade}】${t.name}（${price.toLocaleString()} 灵石）`,
        hint: `修炼+${Math.round(t.speed * 100)}% 攻+${Math.round(t.atk * 100)}% · 绝招「${t.artName}」`,
        action: 'buyWorldTech',
        params: { techId: t.id, price },
        disabled: c.stones < price,
        reason: `需 ${price.toLocaleString()} 灵石`,
      };
    });
    choices.push({ id: 'back_city', label: '离开秘阁', hint: '', action: 'openCity' });
    return {
      id: 'techShop',
      title: '仙城 · 古籍秘阁',
      text: `阁内玉简浩如烟海，收录九州散落之凡、黄、玄、地、天、仙六品功法。境界越高，阁主方肯取出更深层的镇阁孤本。\n\n已参悟功法：${c.techniques.length} 部 | 持有灵石：${c.stones.toLocaleString()}`,
      choices,
    };
  }

  act_buyWorldTech(ch) {
    const s = this.state;
    const c = s.char;
    const { techId, price } = ch.params || {};
    const t = WORLD_TECH_BY_ID[techId];
    if (!t) return;
    if (c.techniques.some((x) => x.id === t.id)) return { error: '已参悟此典' };
    if (c.stones < price) return { error: `灵石不足（需 ${price.toLocaleString()}）` };
    c.stones -= price;
    s.stats.goldSpent += price;
    c.techniques.push({
      id: t.id, name: t.name, speed: t.speed, atk: t.atk, def: t.def,
      lifespan: t.lifespan, lawId: t.lawId, artName: t.artName, grade: t.grade,
    });
    const lawLines = t.lawId ? gainLawExp(s, 30, t.lawId) : [];
    recomputeDerived(c);
    this.pushLog(`购藏参悟${t.name}`);
    s.scene.result = {
      text: `你拂去玉简微尘，神识沉入其中，瞬息领悟【${t.grade}品】${t.name}与绝招「${t.artName}」！\n\n${t.desc}`,
      lines: [`消耗 ${price.toLocaleString()} 灵石，习得 ${t.name}`, ...lawLines],
      fx: 'breakthrough',
      returnTo: 'techShop',
    };
    this.afterAction();
    this.emit();
  }

  act_openTianji() {
    this.state.scene = { id: 'tianji', result: null };
    this.emit();
  }

  buildTianjiNode() {
    const s = this.state;
    const c = s.char;
    const rankNum = Math.max(1, 108 - c.realm * 11 - Math.floor(Math.max(0, c.reputation) / 25) - s.stats.kills * 2);
    const rumors = (s.rumors || []).slice(0, 6).map((r) => `· ${r}`).join('\n');
    return {
      id: 'tianji',
      title: '天机阁 · 九州潜龙榜',
      text: `青铜榜单高悬阁顶，字迹由星辉自行改写。\n\n你的潜龙榜位次：第 ${rankNum} 位（声望 ${c.reputation} · 杀敌 ${s.stats.kills}）\n综合战力：攻 ${this.playerAtk().toLocaleString()} / 术 ${this.playerSpellAtk().toLocaleString()} / 防 ${this.playerDef().toLocaleString()}\n\n【近期九州风闻】\n${rumors || '· 近期风平浪静。'}`,
      choices: [
        { id: 'tianji_bounty', label: '接取天机悬赏', hint: '三月 · 迎战同境通缉强敌，大涨灵石与声望', action: 'regionHunt' },
        { id: 'back_city', label: '离开天机阁', hint: '', action: 'openCity' },
      ],
    };
  }

  /* ---------------- 支柱五：红尘道友 ---------------- */

  act_openNpcHub() {
    this.state.scene = { id: 'npcHub', result: null };
    this.emit();
  }

  buildNpcHubNode() {
    const s = this.state;
    const c = s.char;
    const choices = NPCS.map((npc) => {
      const rel = c.relations?.[npc.relationKey] || 0;
      const unlocked = c.realm >= npc.minRealm;
      const regName = REGION_BY_ID[npc.region]?.name || '九州';
      return {
        id: `npc_${npc.id}`,
        label: `${npc.name} · ${npc.title}（好感 ${rel}）`,
        hint: unlocked ? `常驻${regName} · ${npc.perkDesc}` : `需达${REALMS[npc.minRealm]?.name}境方可引见`,
        action: 'openNpc',
        params: { npcId: npc.id },
        disabled: !unlocked,
        reason: `需${REALMS[npc.minRealm]?.name}境`,
      };
    });
    choices.push({ id: 'back_hub', label: '暂别红尘', hint: '返回主界面', action: 'backHub' });
    return {
      id: 'npcHub',
      title: '红尘道友 · 九州名宿',
      text: '仙路漫漫，孤身独行终究寂寞。结交九州奇人异士，论道切磋、赠礼结缘，关键时或成生死助力。',
      choices,
      subhub: true,
    };
  }

  act_openNpc(ch) {
    const npcId = ch.params?.npcId;
    if (!NPC_BY_ID[npcId]) return;
    this.state.scene = { id: 'npcDetail', npcId, result: null };
    this.emit();
  }

  buildNpcDetailNode() {
    const s = this.state;
    const c = s.char;
    const npc = NPC_BY_ID[s.scene.npcId] || NPCS[0];
    const rel = c.relations?.[npc.relationKey] || 0;
    const likeNames = npc.likeItems.map((id) => ITEM_BY_ID[id]?.name || id).join(' / ');
    const giftItem = npc.likeItems.find((id) => hasItem(s, id));
    const choices = [
      { id: 'npc_chat', label: '品茶论道', hint: '两月 · 增进好感、悟性与道心', action: 'npcChat', params: { npcId: npc.id } },
      {
        id: 'npc_gift',
        label: giftItem ? `赠礼 · ${ITEM_BY_ID[giftItem]?.name}` : '赠礼结缘',
        hint: giftItem ? `送出心仪之物，好感 +14` : `喜好：${likeNames}`,
        action: 'npcGift',
        params: { npcId: npc.id, itemId: giftItem },
        disabled: !giftItem,
        reason: `无对方喜好之物（${likeNames}）`,
      },
      { id: 'npc_spar', label: '切磋试剑', hint: '一月 · 无论胜负皆获实战修为与好感', action: 'npcSpar', params: { npcId: npc.id } },
    ];
    const teachTech = npc.teachTechId ? WORLD_TECH_BY_ID[npc.teachTechId] : null;
    if (teachTech && rel >= 35 && !c.techniques.some((t) => t.id === teachTech.id)) {
      choices.push({
        id: 'npc_teach',
        label: `请教绝学 · ${teachTech.name}`,
        hint: `好感已深，获赠【${teachTech.grade}品】绝学「${teachTech.artName}」`,
        action: 'npcTeach',
        params: { npcId: npc.id, techId: teachTech.id },
        effect: 'primary',
      });
    }
    if (npc.id === 'npc_su' && rel >= 40 && !s.flags['道侣']) {
      choices.push({
        id: 'npc_bond',
        label: '执手立誓 · 结为道侣',
        hint: '情深意重，自此并肩问道，解锁道侣专属剧情与结局',
        action: 'npcBond',
        params: { npcId: npc.id },
        effect: 'primary',
      });
    }
    choices.push({ id: 'back_npc', label: '告辞离去', hint: '', action: 'openNpcHub' });
    return {
      id: 'npcDetail',
      title: `${npc.name} · ${npc.title}`,
      text: `${npc.desc}\n\n当前好感：${rel}${npc.id === 'npc_su' && s.flags['道侣'] ? '（道侣）' : ''}\n喜好之物：${likeNames}\n羁绊之益：${npc.perkDesc}`,
      choices,
    };
  }

  act_npcChat(ch) {
    const s = this.state;
    const c = s.char;
    const npc = NPC_BY_ID[ch.params?.npcId];
    if (!npc) return;
    const lines = advanceMonths(s, 2, this.rng);
    c.relations[npc.relationKey] = (c.relations[npc.relationKey] || 0) + 6;
    const rel = c.relations[npc.relationKey];
    const line = this.rng.pick(npc.chatLines);
    lines.push(`与${npc.name}对坐论道，好感 +6（当前 ${rel}）。`);
    if (npc.id === 'npc_su' && rel >= 20) {
      c.attrs.悟性 += 1; c.attrs.道心 += 1;
      lines.push('剑意相融，悟性 +1，道心 +1。');
    } else if (npc.id === 'npc_lu' && rel >= 30) {
      lines.push(...gainLawExp(s, 20, 'sword'));
    } else if (npc.id === 'npc_yao' && rel >= 25 && this.rng.chance(0.45)) {
      const pill = c.realm >= 2 ? 'dahuan_dan' : 'juling_dan';
      addItem(s, pill, 1);
      lines.push(`药尘子随手抛来一瓶「${ITEM_BY_ID[pill]?.name}」：「拿去，别浪费了！」`);
    } else if (npc.id === 'npc_gu') {
      c.attrs.神识 += 1;
      lines.push('聆听天机秘闻，神识 +1。');
    } else if (npc.id === 'npc_xuesha') {
      const got = gainExp(s, Math.round(monthlyExp(s) * 2.2));
      c.demon = clamp(c.demon + 2, 0, 100);
      lines.push(`沾染北荒血煞杀意，修为 +${got.toLocaleString()}，心魔 +2。`);
    }
    s.scene.result = {
      text: `${npc.name}斟茶相待，言谈间句句直指修行要害：\n\n${line}`,
      lines,
      returnTo: 'npcDetail',
      returnMeta: { npcId: npc.id },
    };
    this.afterAction();
    this.emit();
  }

  act_npcGift(ch) {
    const s = this.state;
    const c = s.char;
    const npc = NPC_BY_ID[ch.params?.npcId];
    const itemId = ch.params?.itemId;
    if (!npc || !itemId || !removeItem(s, itemId, 1)) return { error: '储物袋中无此物' };
    c.relations[npc.relationKey] = (c.relations[npc.relationKey] || 0) + 14;
    const def = ITEM_BY_ID[itemId];
    const lines = [`赠出 ${def?.name || itemId}，${npc.name}好感 +14（当前 ${c.relations[npc.relationKey]}）。`];
    if (npc.id === 'npc_yao') {
      c.attrs.悟性 += 1;
      lines.push('药尘子大喜，顺手点拨了你几句控火诀窍（悟性 +1）。');
    }
    s.scene.result = {
      text: `${npc.name}接过「${def?.name}」，神色微霁：「你倒是有心了。这份情谊，我记下。」`,
      lines,
      fx: 'heal',
      returnTo: 'npcDetail',
      returnMeta: { npcId: npc.id },
    };
    this.afterAction();
    this.emit();
  }

  act_npcSpar(ch) {
    const s = this.state;
    const c = s.char;
    const npc = NPC_BY_ID[ch.params?.npcId];
    if (!npc) return;
    const lines = advanceMonths(s, 1, this.rng);
    c.relations[npc.relationKey] = (c.relations[npc.relationKey] || 0) + 5;
    const expGain = Math.round(monthlyExp(s) * 2);
    return this.startCombat({
      enemy: npc.sparEnemy || 'cultivator',
      win: {
        text: `收剑归鞘，${npc.name}抚掌大笑：「好俊的功夫！此战痛快！」`,
        effects: { exp: expGain, attrs: { 根骨: 1 }, relation: { [npc.relationKey]: 5 } },
        returnTo: 'npcDetail',
        log: `与${npc.name}切磋获胜`,
      },
      lose: {
        text: `${npc.name}及时收招点到为止，将你扶起：「招式仍有破绽，回去再悟三日罢。」`,
        effects: { hp: Math.max(10, Math.round(c.maxHp * 0.45)), exp: Math.round(expGain * 0.6), attrs: { 悟性: 1 } },
        returnTo: 'npcDetail',
      },
    }, { lines: [...lines, `你向${npc.name}拱手请教，双方点到为止！`] });
  }

  act_npcTeach(ch) {
    const s = this.state;
    const c = s.char;
    const npc = NPC_BY_ID[ch.params?.npcId];
    const tech = WORLD_TECH_BY_ID[ch.params?.techId];
    if (!npc || !tech) return;
    if (c.techniques.some((t) => t.id === tech.id)) return { error: '已习得此绝学' };
    c.techniques.push({
      id: tech.id, name: tech.name, speed: tech.speed, atk: tech.atk, def: tech.def,
      lifespan: tech.lifespan, lawId: tech.lawId, artName: tech.artName, grade: tech.grade,
    });
    const lawLines = tech.lawId ? gainLawExp(s, 50, tech.lawId) : [];
    recomputeDerived(c);
    this.pushLog(`${npc.name}传授${tech.name}`);
    s.scene.result = {
      text: `${npc.name}沉吟片刻，以指代笔在虚空中划出七道微光道纹：「你我相交莫逆，这套【${tech.grade}品】${tech.name}便赠予你参悟罢！」\n\n${tech.desc}`,
      lines: [`习得 ${tech.name}（绝招：${tech.artName}）`, ...lawLines],
      fx: 'breakthrough',
      returnTo: 'npcDetail',
      returnMeta: { npcId: npc.id },
    };
    this.afterAction();
    this.emit();
  }

  act_npcBond(ch) {
    const s = this.state;
    const c = s.char;
    const npc = NPC_BY_ID[ch.params?.npcId];
    if (!npc) return;
    s.flags['道侣'] = true;
    c.relations['道侣'] = Math.max(c.relations['道侣'] || 0, c.relations[npc.relationKey] || 40);
    c.attrs.道心 += 8;
    c.demon = Math.max(0, c.demon - 15);
    this.pushRumor(`【仙途佳话】「${c.name}」与「${npc.name}」寒梅立誓，结为同生共死之道侣！`);
    s.scene.result = {
      text: `落霞漫天，寒梅微落。${npc.name}轻执你手，以神魂立下同心道誓：\n\n「此生无论身在人间抑或九霄，长生路远，我与你同行。」`,
      lines: ['结为道侣！道心 +8，心魔 -15'],
      fx: 'breakthrough',
      returnTo: 'npcDetail',
      returnMeta: { npcId: npc.id },
    };
    this.afterAction();
    this.emit();
  }

  /* ---------------- 核心修行动作（保留兼容调用） ---------------- */

  act_continue() { return this.proceed(); }

  act_cultivate(ch = {}) {
    const s = this.state;
    const months = ch.params?.months || MONTHS;
    const gain = monthlyExp(s) * months;
    const got = gainExp(s, gain);
    const lines = [`闭关${months}月，修为 +${got.toLocaleString()}。`];
    if (s.char.goldenFingerId === 'gf_bottle' && this.rng.chance(months >= 24 ? 0.72 : 0.35)) {
      const herb = s.char.realm >= 2 ? 'qiannian_lingcao' : 'lingcao';
      addItem(s, herb, 1);
      lines.push(`【掌天小绿瓶】月夜凝露，灵土催熟出一株${ITEM_BY_ID[herb]?.name}！`);
    }
    if (ch.params?.demonRisk && this.rng.chance(0.25 + s.char.demon * 0.005)) {
      let d = this.rng.int(2, 5);
      if (s.char.goldenFingerId === 'gf_stealth') d = Math.max(1, Math.round(d * 0.5));
      if (s.char.petId === 'pet_fox') d = Math.max(1, Math.round(d * 0.75));
      s.char.demon = clamp(s.char.demon + d, 0, 100);
      lines.push(`出关时神魂微颤，恍惚难辨梦醒。心魔 +${d}。`);
      s.counters.deep_streak = (s.counters.deep_streak || 0) + 1;
      if (s.char.demon >= 60) lines.push('识海深处那道低语，竟越来越像你自己的声音。');
    } else if (ch.params?.demonRisk) {
      s.counters.deep_streak = (s.counters.deep_streak || 0) + 1;
    } else {
      s.counters.deep_streak = 0;
    }
    lines.push(...advanceMonths(s, months, this.rng));
    if (months >= 24 && this.rng.chance(0.22)) {
      const innerEv = pickEvent(s, this.rng, this, 'inner');
      if (innerEv) {
        this.openEvent(innerEv);
        this.afterAction();
        this.emit();
        return;
      }
    }
    s.scene.result = {
      text: this.cultivationFlavor(months),
      lines,
      returnTo: ch.params?.returnTo || null,
    };
    this.afterAction();
    this.emit();
  }

  cultivationFlavor() {
    const c = this.state.char;
    const realm = REALMS[c.realm];
    const pool = [
      '灵气循周天经脉游走，如春水润物，缓缓沉入丹田气海。',
      '一呼一吸与山风相应，识海澄净，尘念俱消。',
      '丹田气旋又凝实了一圈，灵压隐隐外溢，衣袂无风自动。',
      '月升日落，静室灯火明灭，你双目微阖，神游太虚。',
      `灵力一遍遍冲刷着${realm.name}壁垒，虽未即刻破关，根基已更见浑厚。`,
    ];
    return pool[this.rng.int(0, pool.length - 1)];
  }

  act_explore() { return this.act_regionExplore(); }

  act_travel() {
    const s = this.state;
    const c = s.char;
    const months = c.rootId === 'kongjian' ? 3 : c.rootId === 'feng' ? 4 : 6;
    const unlocked = REGIONS.filter((r) => c.realm >= r.minRealm && r.id !== c.regionId);
    const target = unlocked.length ? this.rng.pick(unlocked) : REGIONS[0];
    return this.act_gotoRegion({ params: { regionId: target.id, months } });
  }

  act_bloodCultivate(ch = {}) {
    const s = this.state;
    const c = s.char;
    const hpCost = Math.max(10, Math.round(c.maxHp * 0.22));
    c.hp = Math.max(1, c.hp - hpCost);
    const gain = Math.round(monthlyExp(s) * 5.4);
    const got = gainExp(s, gain);
    c.demon = clamp(c.demon + 3, 0, 100);
    const lines = [`燃血苦修，气血 -${hpCost}，修为 +${got.toLocaleString()}，心魔 +3。`, ...advanceMonths(s, 3, this.rng)];
    s.scene.result = {
      text: '精血在经脉中倒流如沸，丹田炽热欲裂。你以肉身作薪，换来一日千里的进境。',
      lines,
      fx: 'combat_hit',
      returnTo: ch.params?.returnTo || null,
    };
    this.afterAction();
    this.emit();
  }

  act_alchemy(ch = {}) {
    const s = this.state;
    const c = s.char;
    const lines = advanceMonths(s, 1, this.rng);
    const usedMillennium = removeItem(s, 'qiannian_lingcao', 1);
    const usedHerb = usedMillennium || removeItem(s, 'lingcao', 1);
    if (!usedHerb && c.sectId !== 'danxia') {
      s.scene.result = { text: '丹炉已温，却少了灵草入药。你只好熄了炉火。', lines, returnTo: ch.params?.returnTo || null };
      this.emit();
      return;
    }
    const lawAlch = lawBonusSum(c, 'alchemy');
    const baseRate = 0.58 + c.attrs.悟性 * 0.008 + lawAlch + (c.rootId === 'huo' ? 0.15 : 0) + (c.sectId === 'danxia' ? 0.2 : 0);
    const ok = this.rng.chance(clamp(baseRate, 0.2, 0.96));
    if (ok) {
      s.counters.alchemy = (s.counters.alchemy || 0) + 1;
      let pillId;
      if (usedMillennium) {
        const highPool = c.realm >= 3 ? ['dahuan_dan', 'huaying_dan', 'huashen_dan', 'yuanying_dan'] : ['dahuan_dan', 'jiejin_dan', 'juling_dan', 'pozhang_dan'];
        pillId = this.rng.pick(highPool);
      } else {
        const pool = c.realm >= 1 ? ['huiling_dan', 'liaoshang_dan', 'juling_dan', 'zhuji_dan'] : ['yinqi_dan', 'huiling_dan', 'liaoshang_dan'];
        pillId = c.realm >= 2 && this.rng.chance(0.28) ? 'pozhang_dan' : this.rng.pick(pool);
      }
      addItem(s, pillId, 1);
      const pillName = ITEM_BY_ID[pillId]?.name || pillId;
      const lawNote = c.realm >= 1 ? gainLawExp(s, 12, 'pill') : [];
      lines.push(`丹成开炉：获得 ${pillName} ×1（累计炼丹 ${s.counters.alchemy} 次）。`, ...lawNote);
      s.scene.result = {
        text: '炉盖掀开时，一缕青烟笔直冲向梁顶。丹丸滚落玉盘，温润如珠，药香散满静室。',
        lines,
        fx: 'alchemy',
        returnTo: ch.params?.returnTo || null,
      };
    } else {
      s.counters.alchemy_fail = (s.counters.alchemy_fail || 0) + 1;
      const dmg = Math.round(c.maxHp * 0.08);
      c.hp = Math.max(1, c.hp - dmg);
      lines.push(`火候失衡，炸炉了！气血 -${dmg}。`);
      s.scene.result = {
        text: '一声闷响，丹炉盖子飞出去半丈，满室焦苦。你抹了一把脸上的炉灰，叹了口气。',
        lines,
        fx: 'combat_hit',
        returnTo: ch.params?.returnTo || null,
      };
    }
    this.afterAction();
    this.emit();
  }

  act_secretRealm() {
    const s = this.state;
    const region = REGION_BY_ID[s.char.regionId] || REGION_BY_ID.qingniu;
    const lines = advanceMonths(s, 6, this.rng);
    const localEntries = (region.secretRealms || []).filter((id) => this.registry.has(id) && !s.flags[`ev:${id}`]);
    const globalEntries = ['wn_blood_trial_1', 'ink_kunlun_1', 'ink_guixu_1', 'ink_jianzhong_1'].filter((id) => this.registry.has(id) && !s.flags[`ev:${id}`]);
    const entries = localEntries.length ? localEntries : globalEntries;
    if (entries.length) {
      const nextId = this.rng.pick(entries);
      s.counters.secrets = (s.counters.secrets || 0) + 1;
      this.openScene(nextId);
      this.afterAction();
      this.emit();
      return;
    }
    const ev = pickEvent(s, this.rng, this, 'wild', region.id);
    if (ev) {
      this.openEvent(ev);
      this.afterAction();
      this.emit();
      return;
    }
    s.scene.result = { text: '你循着古图深入断崖，只见阵纹早已熄灭。此地机缘已被前人取尽。', lines, returnTo: 'regionHub' };
    this.afterAction();
    this.emit();
  }

  act_revisitGate() {
    const s = this.state;
    if ((s.counters.refuse_ascend || 0) >= 3) {
      this.finishEnding('e_ascend_refuse');
      return;
    }
    this.openScene('story_ascend_1');
    this.emit();
  }

  useInventoryItem(id) {
    const s = this.state;
    if (!s || s.flags.finished) return { error: '此生已尽' };
    if (s.scene.id === 'combat' || s.scene.id === 'tribulation' || s.scene.id === 'ending') {
      return { error: '此刻分身乏术，无法开启储物袋' };
    }
    const def = ITEM_BY_ID[id];
    if (!def || !hasItem(s, id)) return { error: '储物袋里没有此物' };
    if (def.technique) {
      if (s.char.techniques.some((t) => t.id === id)) return { error: `已参悟过${def.name}` };
      removeItem(s, id, 1);
      s.char.techniques.push({ id, name: def.name, ...def.technique });
      const lines = [`习得功法 ${def.name}`];
      if (def.technique.attrs) lines.push(...applyEffects(s, { attrs: def.technique.attrs }, this.effectCtx()));
      recomputeDerived(s.char);
      this.pushLog(`研读${def.name}`);
      this.checkAchievements();
      this.emit();
      return { ok: true, fx: 'breakthrough', lines };
    }
    if (def.use) {
      removeItem(s, id, 1);
      if (def.type === '丹药') s.stats.pills = (s.stats.pills || 0) + 1;
      const eff = { ...def.use };
      if (def.type === '丹药' && s.char.goldenFingerId === 'gf_bottle') {
        if (eff.exp) eff.exp = Math.round(eff.exp * 1.3);
        if (eff.expPct) eff.expPct = Number((eff.expPct * 1.25).toFixed(2));
        if (eff.hp && eff.hp > 0) eff.hp = Math.round(eff.hp * 1.3);
        if (eff.hpPct) eff.hpPct = Math.min(1, eff.hpPct * 1.25);
      }
      const lines = applyEffects(s, eff, this.effectCtx());
      recomputeDerived(s.char);
      this.pushLog(`使用${def.name}`);
      this.checkAchievements();
      this.emit();
      return { ok: true, fx: 'heal', lines: lines.length ? lines : [`已使用 ${def.name}`] };
    }
    return { error: `${def.name}（${def.type}）随身佩戴或突破/炼器时自动生效` };
  }

  act_bottleRipen(ch = {}) {
    const s = this.state;
    if (s.char.goldenFingerId !== 'gf_bottle') return;
    const lines = advanceMonths(s, 2, this.rng);
    if (!removeItem(s, 'lingcao', 1)) {
      addItem(s, 'lingcao', 1);
      lines.push('绿瓶吞吐月华，为你凝出一株百年灵草。');
      s.scene.result = {
        text: '夜半月辉倾泻进墨绿瓶口，一滴翠绿灵液悄然落入药盆，嫩芽转眼抽枝成株。',
        lines,
        fx: 'alchemy',
        returnTo: ch.params?.returnTo || null,
      };
    } else {
      const reward = s.char.realm >= 4 ? 'yuanying_dan' : s.char.realm >= 2 ? 'jiejin_dan' : s.char.realm >= 1 ? 'zhuji_dan' : 'yinqi_dan';
      addItem(s, reward, 1);
      const got = gainExp(s, Math.round(monthlyExp(s) * 2.5));
      lines.push(`绿液催熟千年灵药！凝成 ${ITEM_BY_ID[reward].name} ×1，修为 +${got.toLocaleString()}。`);
      s.scene.result = {
        text: '一滴绿液滴落灵草根部，药香瞬间冲破石室禁制！百年灵草眨眼蜕变为千年药王，直接凝炼成丹。',
        lines,
        fx: 'alchemy',
        returnTo: ch.params?.returnTo || null,
      };
    }
    this.afterAction();
    this.emit();
  }

  act_refine(ch = {}) {
    const s = this.state;
    const c = s.char;
    const lvl = c.artifactLevel || 0;
    if (lvl >= ARTIFACT_TIERS.length - 1) {
      s.scene.result = { text: `你的本命法宝「${c.artifactName}」已达太古仙剑之境，再无瑕疵可炼。`, lines: [], returnTo: ch.params?.returnTo || null };
      this.emit();
      return;
    }
    const stoneCost = Math.round((240 + lvl * 360) * Math.pow(1.8, Math.max(0, lvl)));
    const hasMat = hasItem(s, 'longxue_jing') || hasItem(s, 'xingchen_sha') || hasItem(s, 'leimu') || hasItem(s, 'xuantie');
    if (c.stones < stoneCost && !hasMat) {
      s.scene.result = { text: `祭炼需玄铁/雷击木/星辰砂/龙血精或 ${stoneCost.toLocaleString()} 灵石，眼下灵材尚缺。`, lines: [], returnTo: ch.params?.returnTo || null };
      this.emit();
      return;
    }
    const lines = advanceMonths(s, 3, this.rng);
    let matUsed = '';
    if (removeItem(s, 'longxue_jing', 1)) matUsed = '龙血真精';
    else if (removeItem(s, 'xingchen_sha', 1)) matUsed = '星辰砂';
    else if (removeItem(s, 'leimu', 1)) matUsed = '雷击木';
    else if (removeItem(s, 'xuantie', 1)) matUsed = '玄铁';
    else { c.stones -= stoneCost; matUsed = `${stoneCost.toLocaleString()} 灵石`; }
    c.artifactLevel = lvl + 1;
    c.artifactName = ARTIFACT_TIERS[c.artifactLevel];
    s.counters.craft = (s.counters.craft || 0) + 1;
    if (c.artifactLevel >= 4) s.flags['得地阶法宝'] = true;
    lines.push(`消耗 ${matUsed}，本命法宝晋升为【${c.artifactName}】（基础攻防大幅跃升）。`);
    this.pushRumor(`【器道风闻】「${c.name}」以地火祭炼出「${c.artifactName}」，剑鸣传出三十里！`);
    s.scene.result = {
      text: `三昧真火昼夜不熄，你在剑胎上刻下最后一道本命道纹。\n\n清越剑鸣震落屋檐积灰——你的本命法宝已晋升为【${c.artifactName}】！`,
      lines,
      fx: 'breakthrough',
      returnTo: ch.params?.returnTo || null,
    };
    this.afterAction();
    this.emit();
  }

  act_auction() {
    const s = this.state;
    advanceMonths(s, 1, this.rng);
    s.scene = { id: 'auction', result: null };
    this.afterAction();
    this.emit();
  }

  buildAuctionNode() {
    const s = this.state;
    const c = s.char;
    const discount = (c.goldenFingerId === 'gf_karma_mirror' ? 0.85 : 1) * (c.sectId === 'wanbao' ? 0.88 : 1);
    const lots = [
      { id: 'zhuji_dan', base: 460, pitch: '极品筑基丹 · 铸上品/天道道基关键圣药' },
      { id: 'jiejin_dan', base: 1450, pitch: '结金丹 · 凝结九纹金丹压轴灵药' },
      { id: 'huaying_dan', base: 4600, pitch: '化婴丹 · 护持碎丹成婴、镇压心魔' },
      { id: 'huashen_dan', base: 11000, pitch: '化神丹 · 辅助元婴通天、沟通法则' },
      { id: 'faze_canpian', base: 14000, pitch: '大道法则残片 · 直接暴涨法则感悟' },
      { id: 'jiuzhuan_gong', base: 2400, pitch: '古修洞府残卷《九转元功》· 永久提速增根骨' },
      { id: 'tianjie_dan', base: 22000, pitch: '天字一号压轴 · 天劫丹，渡劫保命底牌' },
    ];
    const choices = lots.map((lot) => {
      const def = ITEM_BY_ID[lot.id];
      const price = Math.round(lot.base * discount);
      return {
        id: `bid_${lot.id}`,
        label: `竞拍 · ${def.name}（${price.toLocaleString()} 灵石）`,
        hint: lot.pitch,
        action: 'bidItem',
        params: { id: lot.id, price, highValue: lot.base >= 2400 },
      };
    });
    choices.push({ id: 'leave_auction', label: '低调离场', hint: '走万宝阁密道返回坊市', action: 'openCity' });
    return {
      id: 'auction',
      title: '万宝阁 · 暗拍盛会',
      text: '拍卖大厅灯火通明，二楼天字包厢尽是气息晦涩的金丹、元婴老怪。台下散修皆戴遮面斗笠，生怕露财。\n\n司仪敲响金槌：「诸位道友，今夜全是破境重宝与大道奇珍，价高者得——出阁之后，生死各安天命！」',
      choices,
    };
  }

  act_bidItem(ch) {
    const s = this.state;
    const { id, price, highValue } = ch.params;
    if (s.char.stones < price) return { error: `灵石不足（需 ${price.toLocaleString()} 灵石）` };
    s.char.stones -= price;
    s.stats.goldSpent += price;
    addItem(s, id, 1);
    const name = ITEM_BY_ID[id]?.name || id;
    this.pushRumor(`【万宝拍卖行】神秘修士「${s.char.name}」豪掷 ${price.toLocaleString()} 灵石拍下「${name}」，引得暗处数道贪婪神识锁定！`);
    if (highValue && s.char.goldenFingerId !== 'gf_stealth' && s.char.goldenFingerId !== 'gf_karma_mirror' && this.rng.chance(0.4)) {
      s.scene.result = {
        text: `你一锤定音拍下【${name}】，满场哗然。刚出侧门，便觉三道冰冷杀意如芒在背！`,
        lines: [`拍得 ${name}（-${price.toLocaleString()} 灵石）`, '【财不露白】遭遇暗中尾随！'],
        goto: 'wn_ambush_1',
        fx: 'alchemy',
      };
    } else {
      s.scene.result = {
        text: `「${price.toLocaleString()} 灵石，成交！」侍女捧着封禁玉盒送入包厢。你收好【${name}】，借密道悄然脱身。`,
        lines: [`拍得 ${name}（-${price.toLocaleString()} 灵石）`],
        fx: 'alchemy',
        returnTo: 'auction',
      };
    }
    this.afterAction();
    this.emit();
  }

  pushRumor(text) {
    const s = this.state;
    if (!s) return;
    s.rumors = s.rumors || [];
    s.rumors.unshift(text);
    if (s.rumors.length > 16) s.rumors.pop();
  }

  act_sectTask(ch = {}) {
    const s = this.state;
    const sect = SECT_BY_ID[s.char.sectId];
    const rankIdx = s.char.sectRank || 0;
    const lines = advanceMonths(s, 3, this.rng);
    const base = 35 + rankIdx * 45 + s.char.realm * 30;
    const contribution = base + this.rng.int(0, Math.round(base * 0.6));
    const stones = Math.round(contribution * 0.6);
    const exp = Math.round(monthlyExp(s) * 0.9);
    s.char.contribution += contribution;
    s.char.stones += stones;
    const got = gainExp(s, exp);
    const flavor = sect ? this.rng.pick(sect.taskFlavor) : '替人跑腿';
    lines.push(`${flavor}。贡献 +${contribution}，灵石 +${stones}，修为 +${got.toLocaleString()}。`);
    if (this.rng.chance(0.12)) s.counters.slack = (s.counters.slack || 0) + 1;
    const ev = pickEvent(s, this.rng, this, 'sect');
    if (ev && this.rng.chance(0.38)) {
      this.openEvent(ev);
      this.afterAction();
      this.emit();
      return;
    }
    s.scene.result = {
      text: '宗门杂务如细水磨刀，虽不惊天动地，日积月累却足见功勋。',
      lines,
      returnTo: ch.params?.returnTo || null,
    };
    this.afterAction();
    this.emit();
  }

  act_comprehend(ch = {}) {
    const s = this.state;
    const c = s.char;
    const lines = advanceMonths(s, 6, this.rng);
    const gain = 1 + (this.rng.chance(0.32) ? 1 : 0) + (c.goldenFingerId === 'gf_sword_elder' ? 1 : 0);
    c.attrs.悟性 += gain;
    c.attrs.道心 += 2;
    c.demon = Math.max(0, c.demon - 2);
    const lawAmt = 18 + Math.round(c.attrs.悟性 * 0.5) + c.realm * 8;
    const lawLines = gainLawExp(s, lawAmt);
    lines.push(`参悟半年，悟性 +${gain}，道心 +2，心魔 -2。`, ...lawLines);
    if (this.rng.chance(0.25)) {
      lines.push('灵光一闪，你豁然贯通一道滞涩多年的道纹（道心额外 +2）。');
      c.attrs.道心 += 2;
    }
    if (this.rng.chance(0.24)) {
      const innerEv = pickEvent(s, this.rng, this, 'inner');
      if (innerEv) {
        this.openEvent(innerEv);
        this.afterAction();
        this.emit();
        return;
      }
    }
    s.scene.result = {
      text: '你于静室中闭目内观，将平生所学与天地法则逐一印证，识海渐生清光。',
      lines,
      returnTo: ch.params?.returnTo || null,
    };
    this.afterAction();
    this.emit();
  }

  act_settle(ch = {}) {
    const s = this.state;
    const lines = advanceMonths(s, 3, this.rng);
    const d = this.rng.int(5, 11);
    s.char.demon = Math.max(0, s.char.demon - d);
    s.char.injuries = Math.max(0, s.char.injuries - 1);
    s.counters.settle = (s.counters.settle || 0) + 1;
    lines.push(`焚香调息三月，心魔 -${d}，内伤渐愈。`);
    s.scene.result = {
      text: '你熄去灵火，于静室中独坐听松。识海翻涌的杂念如潮退去，道心重归清朗。',
      lines,
      fx: 'heal',
      returnTo: ch.params?.returnTo || null,
    };
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
    const s = this.state;
    const c = s.char;
    const daoName = DAO_BASE_QUALITIES.find((q) => q.id === c.daoBaseQuality)?.name || '未筑基';
    const coreName = GOLDEN_CORE_QUALITIES.find((q) => q.id === c.goldenCoreQuality)?.name || '未结丹';
    const lawList = Object.entries(c.laws || {})
      .filter(([, lvl]) => lvl > 0)
      .map(([id, lvl]) => `${LAW_BY_ID[id]?.name || id}(${LAW_STAGES[lvl]})`)
      .join('、') || '尚未入门';
    this.state.scene.result = {
      text: '你静坐回望此生行止：道基、法则、功业与因果皆历历在目。',
      lines: [
        `战力评估：攻 ${this.playerAtk().toLocaleString()} · 术 ${this.playerSpellAtk().toLocaleString()} · 防 ${this.playerDef().toLocaleString()}`,
        `根基品阶：道基【${daoName}】· 金丹【${coreName}】（倍率 ${qualityMultiplier(c).toFixed(2)}×）`,
        `法则领悟：${lawList}`,
        `历世记录：抉择 ${s.stats.actions} 次 · 奇遇 ${s.stats.events} 次 · 杀敌 ${s.stats.kills} 尊 · 突破 ${s.stats.breakthroughs} 次`,
        `已解锁结局：${s.meta.unlockedEndings.length} / ${ENDINGS.length} · 成就：${Object.keys(s.meta.achievements).length} / ${ACHIEVEMENTS.length}`,
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
    s.char.reputation += 150;
    s.scene.result = {
      text: '你在无名灵峰立下山门石碑，刻上自己的道号。山风猎猎，自此一方道统因你而起。',
      lines: ['开宗立派：获得称号「开山祖师」，声望 +150。'],
      fx: 'breakthrough',
    };
    this.afterAction();
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
    s.char.sectRank = 0;
    s.char.contribution = 0;
    s.counters.sects_joined = (s.counters.sects_joined || 0) + 1;
    s.meta.sectsJoined = Array.from(new Set([...(s.meta.sectsJoined || []), sect.id]));
    s.flags[`入宗:${sect.id}`] = true;
    const lines = applyEffects(s, { ...(sect.joinEffects || {}), attrs: { ...(sect.joinEffects?.attrs || {}) } }, this.effectCtx());
    lines.push(`你成了${sect.name}的${SECT_RANKS[0].name}，可随时前往仙门大殿接任务、入藏经阁与宝库。`);
    s.scene.result = {
      text: `${sect.entry}\n\n考核通过。执事弟子递来一枚刻着宗门徽记的外门玉牌与素色道袍。`,
      lines,
      goto: null,
      returnTo: 'sectHall',
    };
    this.afterAction();
    this.emit();
  }

  /* ---------------- 境界 / 瓶颈 / 天劫 ---------------- */

  buildBreakthroughNode() {
    const s = this.state;
    const c = s.char;
    const p = breakthroughChance(s);
    const major = isRealmMaxLayer(c);
    const bn = bottleneckStatus(s);
    const needItemId = bn.bottleneck?.needItem || null;
    const needItemName = needItemId ? (ITEM_BY_ID[needItemId]?.name || needItemId) : null;
    const hasSpecPill = needItemId && hasItem(s, needItemId);
    const hasGenPill = hasItem(s, 'pozhang_dan') || (c.realm === 0 && hasItem(s, 'zhuji_dan'));
    const pillLabel = hasSpecPill ? `服${needItemName}破关` : '服丹辅助破关';
    const pillHint = hasSpecPill
      ? `消耗${needItemName}，成算 +28% 并大幅提升道基/金丹品阶`
      : (needItemName ? `推荐准备「${needItemName}」或破障丹` : '消耗破障丹/筑基丹，成算 +20%');

    const rawPenalty = major && c.realm >= 2 ? 0.25 : 0;
    const rawP = clamp(p - rawPenalty, 0.05, 0.97);
    const lines = [
      `你盘坐蒲团，敛息凝神。${realmLabel(c)}的壁垒就在眼前。`,
      major && bn.bottleneck ? `【大境瓶颈】${bn.bottleneck.trialDesc}` : '此次仅需破开小境隔膜，顺势进阶。',
      major && bn.missing.length
        ? `【尚未达标】${bn.missing.join('；')}（可前往洞府「参悟大道」提升道心与法则）`
        : `徒手冲关成算：${Math.round(rawP * 100)}%${rawPenalty > 0 && needItemName ? `（无「${needItemName}」护持，凶险倍增）` : ''}。`,
    ];

    return {
      id: 'breakthrough',
      title: major ? `大境叩关 · 冲击${REALMS[c.realm + 1]?.name || '仙境'}` : '小境叩关',
      text: lines.join('\n\n'),
      choices: [
        {
          label: '凝神冲关',
          hint: bn.ok ? `成功率 ${Math.round(rawP * 100)}%` : bn.missing[0],
          action: 'breakAttempt',
          params: { p: rawP },
          disabled: !bn.ok,
          reason: bn.missing[0] || '',
          effect: 'primary',
        },
        {
          label: pillLabel,
          hint: pillHint,
          action: 'breakWithPill',
          disabled: !bn.ok || (!hasSpecPill && !hasGenPill),
          reason: !bn.ok ? bn.missing[0] : `需 ${needItemName || '破障丹'}`,
        },
        { label: '暂缓破境', hint: '退回洞府继续打磨道心与灵材', action: 'backHub' },
      ],
    };
  }

  act_breakAttempt(ch) { return this.resolveBreakthrough(ch.params.p, '', 0); }

  act_breakWithPill() {
    const s = this.state;
    const bn = bottleneckStatus(s);
    const needItemId = bn.bottleneck?.needItem || null;
    let bonus = 0;
    let qualityBonus = 0;
    let usedName = '灵丹';
    if (needItemId && hasItem(s, needItemId)) {
      removeItem(s, needItemId, 1);
      bonus = 0.28;
      qualityBonus = 28;
      usedName = ITEM_BY_ID[needItemId]?.name || needItemId;
    } else if (hasItem(s, 'pozhang_dan')) {
      removeItem(s, 'pozhang_dan', 1);
      bonus = 0.22;
      qualityBonus = 16;
      usedName = '破障丹';
    } else if (hasItem(s, 'zhuji_dan')) {
      removeItem(s, 'zhuji_dan', 1);
      bonus = 0.2;
      qualityBonus = 18;
      usedName = '筑基丹';
    }
    s.stats.pills = (s.stats.pills || 0) + 1;
    s.buffs.breakBonus = (s.buffs.breakBonus || 0) + bonus * 100;
    return this.resolveBreakthrough(breakthroughChance(s), `你吞下${usedName}，磅礴药力化作洪流直冲瓶颈。`, qualityBonus);
  }

  resolveBreakthrough(p, prefix = '', qualityBonus = 0) {
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
        const extraMajor = [];
        // 筑基道基品质 / 金丹九纹品质评定
        if (c.realm === 1 && !c.daoBaseQuality) {
          const score = c.attrs.道心 + c.attrs.根骨 + c.attrs.悟性 * 0.5 + qualityBonus - c.demon * 0.4 + (c.rootId === 'tianling' || c.rootId === 'hundun' ? 24 : 0);
          let chosen = DAO_BASE_QUALITIES[0];
          for (const q of DAO_BASE_QUALITIES) if (score >= q.minScore) chosen = q;
          c.daoBaseQuality = chosen.id;
          extraMajor.push(`【道基天成】铸就「${chosen.name}」（全境战力永久 ×${chosen.mult}）——${chosen.desc}`);
          this.pushRumor(`【九州惊闻】「${c.name}」成功筑基，引动灵气潮汐，铸就「${chosen.name}」！`);
        } else if (c.realm === 2 && !c.goldenCoreQuality) {
          const score = c.attrs.道心 + c.attrs.悟性 * 0.8 + c.attrs.神识 * 0.5 + qualityBonus - c.demon * 0.4 + (c.daoBaseQuality === 'tiandao' ? 18 : c.daoBaseQuality === 'shang' ? 8 : 0);
          let chosen = GOLDEN_CORE_QUALITIES[0];
          for (const q of GOLDEN_CORE_QUALITIES) if (score >= q.minScore) chosen = q;
          c.goldenCoreQuality = chosen.id;
          extraMajor.push(`【丹成天象】凝结「${chosen.name}」（全境战力永久 ×${chosen.mult}）——${chosen.desc}`);
          this.pushRumor(`【九州震动】「${c.name}」丹成紫气东来，竟是万中无一的「${chosen.name}」！`);
        }
        c.lifespan = Math.max(c.lifespan, Math.round((80 + REALMS[c.realm].lifespan) * 12));
        recomputeDerived(c);
        if (REALMS[c.realm]?.tribulation) {
          s.stats.tribulations++;
          return this.startTribulation([prefix, ...extraMajor].filter(Boolean).join('\n'));
        }
        c.hp = c.maxHp;
        c.mp = c.maxMp;
        s.scene = {
          id: 'hub',
          result: {
            text: `${prefix ? `${prefix}\n\n` : ''}灵气化液，经脉拓宽如江河！你正式踏入【${realmLabel(c)}】，从此脱胎换骨！`,
            lines: [`大境突破：${realmLabel(c)}（战力倍率 ×${REALMS[c.realm].powerMult}）`, ...extraMajor],
            fx: 'breakthrough',
          },
        };
        this.pushLog(`突破大境·${REALMS[c.realm].name}`);
        this.afterAction();
        this.emit();
        return;
      }
      recomputeDerived(c);
      const extraLines = [`突破成功：${realmLabel(c)}（攻 ${this.playerAtk().toLocaleString()}）`];
      if (c.rootId === 'xingchen') {
        const pick = this.rng.pick(['悟性', '根骨', '神识', '道心']);
        c.attrs[pick] += 2;
        recomputeDerived(c);
        extraLines.push(`星辰窍穴共鸣：${pick} +2`);
      }
      s.scene.result = {
        text: `${prefix ? `${prefix}\n\n` : ''}壁垒轰然碎裂，灵气如春潮倒灌丹田。你睁开双目，天地气机较先前更清澈一分。`,
        lines: extraLines,
        fx: 'breakthrough',
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
        text: `${prefix ? `${prefix}\n\n` : ''}壁垒纹丝不动，反震之力令你喉头一甜。修为溃散 ${loss.toLocaleString()}，心魔趁隙滋长。\n\n留得青山在，重整旗鼓再叩关。`,
        lines: ['突破失败：修为 -35%，气血受损，心魔上升'],
        fx: 'combat_hit',
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
    const lawResist = lawBonusSum(s.char, 'tribulationResist');
    const p = clamp(0.88 - s.char.realm * 0.02 + s.char.attrs.道心 * 0.0022 + lawResist - s.char.demon * 0.002, 0.3, 0.96);
    return {
      id: 'tribulation',
      title: `九霄天劫 · 第${t.stage}重`,
      text: `天色骤暗，墨云压顶，紫霄神雷在云海翻滚。${realm.name}之劫，既是天道拷问，亦是脱凡洗礼。\n\n第${t.stage}重天雷正在凝聚。${t.logs?.length ? `\n\n${t.logs.slice(-2).join('\n')}` : ''}`,
      choices: [
        { label: '以肉身硬抗', hint: `成算 ${Math.round(p * 100)}% · 淬炼道体但气血消耗重`, action: 'tribulationStage', params: { p, mode: 'body' } },
        { label: '祭出本命法宝抵御', hint: '耗灵力，成算更高', action: 'tribulationStage', params: { p: Math.min(0.97, p + 0.1), mode: 'artifact' } },
        { label: '吞服天劫丹', hint: '消耗天劫丹，成算 +30%', action: 'tribulationStage', params: { p: Math.min(0.98, p + 0.3), mode: 'pill' }, require: 'has("tianjie_dan")', requireHint: '没有天劫丹' },
        { label: '散功求生', hint: '放弃此劫，境界跌落，保住性命', action: 'tribulationFlee' },
      ],
    };
  }

  act_tribulationStage(ch) {
    const s = this.state;
    const t = s.tribulation;
    const mode = ch.params.mode;
    if (mode === 'pill' && hasItem(s, 'tianjie_dan')) { removeItem(s, 'tianjie_dan'); s.stats.pills = (s.stats.pills || 0) + 1; }
    const lawResist = clamp(lawBonusSum(s.char, 'tribulationResist'), 0, 0.45);
    const rootDmgMult = (s.char.rootId === 'lei' ? 0.7 : s.char.rootId === 'hundun' ? 1.3 : 1) * (1 - lawResist);
    const ok = this.rng.chance(ch.params.p);
    if (!ok) {
      s.char.hp = Math.max(0, s.char.hp - Math.round(s.char.maxHp * 0.45 * rootDmgMult));
      s.char.injuries = (s.char.injuries || 0) + 2;
      s.char.demon = clamp(s.char.demon + 6, 0, 100);
      s.char.lifespan -= 120;
      t.logs.push(`第${t.stage}重紫雷劈落！你半边身躯焦黑，受创极重。`);
      s.scene.fx = 'tribulation_hit';
      if (s.char.hp <= 0) {
        s.flags['渡劫失败'] = true;
        return this.finishEnding('e_tribulation_death');
      }
      t.stage++;
      if (t.stage > t.total) {
        s.tribulation = null;
        s.scene = { id: 'hub', result: { text: '劫云散去。你虽捡回一命，此劫终未圆满，寿元折损十年。', lines: ['渡劫受创：寿元 -10 年'], fx: 'tribulation_hit' } };
        this.emit();
        return;
      }
      this.emit();
      return;
    }
    const baseDmg = mode === 'body' ? 0.28 : 0.12;
    const dmg = Math.round(s.char.maxHp * baseDmg * rootDmgMult);
    s.char.hp = Math.max(1, s.char.hp - dmg);
    s.char.mp = Math.max(0, s.char.mp - Math.round(s.char.maxMp * 0.25));
    if (mode === 'artifact') s.char.injuries = (s.char.injuries || 0) + 1;
    t.logs.push(`第${t.stage}重神雷为你硬生生震散！${s.char.rootId === 'lei' ? '雷灵根鲸吞余电，反淬经脉。' : ''}`);
    s.scene.fx = 'tribulation_pass';
    t.stage++;
    if (t.stage > t.total) {
      s.tribulation = null;
      s.char.attrs.道心 += s.char.rootId === 'hundun' ? 10 : 5;
      if (s.char.rootId === 'hundun') {
        s.char.attrs.根骨 += 2;
        s.char.attrs.悟性 += 2;
      }
      recomputeDerived(s.char);
      s.char.hp = s.char.maxHp;
      s.char.mp = s.char.maxMp;
      const extraTrib = [`渡劫圆满：踏入 ${realmLabel(s.char)}（战力倍率 ×${REALMS[s.char.realm].powerMult}）`];
      if (s.char.goldenFingerId === 'gf_signin') {
        const bonusStones = Math.round(350 * REALMS[s.char.realm].powerMult);
        s.char.stones += bonusStones;
        addItem(s, 'pozhang_dan', 1);
        extraTrib.push(`【万界道碑】破境赐宝：灵石 +${bonusStones.toLocaleString()}，破障丹 ×1`);
      }
      this.pushRumor(`【九州震动】「${s.char.name}」硬抗三重九霄天雷，正式踏入${REALMS[s.char.realm].name}之境！`);
      s.scene = {
        id: 'hub',
        result: {
          text: `劫云散尽，霞光漫天。你立于焦土之上，周身气机翻天覆地——你已真正踏入${REALMS[s.char.realm].name}之境！`,
          lines: extraTrib,
          fx: 'breakthrough',
        },
      };
      s.flags['渡过天劫'] = (s.flags['渡过天劫'] || 0) + 1;
      this.pushLog(`渡劫圆满·${REALMS[s.char.realm].name}`);
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
    s.scene = { id: 'hub', result: { text: '你散功避劫，劫云在头顶盘旋三匝后散去。境界跌落，心魔滋长，但你活了下来。', lines: ['境界跌落，心魔 +20'] } };
    this.emit();
  }

  act_breakthrough() {
    this.state.scene = { id: 'breakthrough', result: null };
    this.emit();
  }

  act_backHub() { this.state.scene = { id: 'hub', result: null }; this.emit(); }

  /* ---------------- 指数战力战斗系统 ---------------- */

  startCombat(spec, { lines = [] } = {}) {
    const s = this.state;
    const defId = typeof spec === 'string' ? spec : spec.enemy;
    const def = ENEMY_BY_ID[defId];
    if (!def) { this.state.scene.result = { text: '敌手见势不妙，早已远遁。', lines }; return; }
    const enemy = scaleEnemy(def, s.char.realm);
    s.combat = {
      enemy, hp: enemy.hp, maxHp: enemy.hp, turn: 1, log: [...lines],
      onWin: typeof spec === 'object' ? spec.win || null : null,
      onLose: typeof spec === 'object' ? spec.lose || null : null,
    };
    s.scene = { id: 'combat', result: null };
    this.emit();
  }

  bestSignatureArt() {
    const c = this.state.char;
    const withArt = (c.techniques || []).filter((t) => t.artName);
    if (withArt.length) return withArt[withArt.length - 1].artName;
    if (c.artifactLevel > 0) return `本命「${c.artifactName}」剑意绝杀`;
    return '周天灵压绝杀';
  }

  buildCombatNode() {
    const s = this.state;
    const cb = s.combat;
    if (!cb) return buildHub(this);
    const e = cb.enemy;
    const artName = this.bestSignatureArt();
    const traitTag = e.trait ? `【特性：${e.trait}】` : '';
    const realmTag = REALMS[e.realm]?.name || '炼气';
    return {
      id: 'combat',
      title: `斗法 · ${e.name}（${realmTag}）`,
      text: `${e.desc}${traitTag ? ` ${traitTag}` : ''}\n\n${cb.log.slice(-6).join('\n')}`,
      choices: [
        { label: '出剑', hint: `物理攻伐（攻 ${this.playerAtk().toLocaleString()}）`, action: 'combatAttack' },
        { label: '运使法术', hint: `耗 12% 灵力，神识破甲（术 ${this.playerSpellAtk().toLocaleString()}）`, action: 'combatSpell' },
        { label: `绝招 · ${artName}`, hint: '耗 24% 灵力，无视大半防御倾泻绝杀', action: 'combatArt', require: 'char.mp >= char.maxMp * 0.24', requireHint: '灵力不足以催动神通' },
        { label: '守势', hint: '减伤 60%，抵御毒煞/天威并回灵', action: 'combatGuard' },
        { label: '服丹', hint: '大还丹 / 疗伤丹 / 回灵丹（按百分比回复）', action: 'combatPill', require: 'has("dahuan_dan") || has("liaoshang_dan") || has("huiling_dan")', requireHint: '储物袋无战斗丹药' },
        { label: '遁走', hint: '风灵根/空间法则/神行符大幅提升遁速', action: 'combatFlee' },
      ],
    };
  }

  playerAtk() {
    const c = this.state.char;
    const pm = REALMS[c.realm]?.powerMult || 1;
    const layerMult = 1 + (c.layer || 0) * 0.1;
    const qMult = qualityMultiplier(c);
    const best = c.inventory.reduce((max, it) => Math.max(max, ITEM_BY_ID[it.id]?.equip?.atk || 0), 0);
    const artifactBase = (c.artifactLevel || 0) * 3.2;
    const sectAtk = SECT_BY_ID[c.sectId]?.perks?.atk || 0;
    const techAtk = (c.techniques || []).reduce((acc, t) => acc + (t.atk || 0), 0);
    const rootAtk = c.rootId === 'jin' ? 0.2 : c.rootId === 'xue' ? 0.15 : 0;
    const gfAtk = c.goldenFingerId === 'gf_sword_elder' ? 0.22 : 0;
    const petAtk = PET_BY_ID[c.petId]?.atkBonus || 0;
    const lawAtk = lawBonusSum(c, 'atk');
    const statTerm = Math.min(c.attrs.根骨, 160) * 0.65;
    return Math.round((14 + statTerm + best * 0.35 + artifactBase) * pm * layerMult * qMult * (1 + sectAtk + techAtk + rootAtk + gfAtk + petAtk + lawAtk));
  }

  playerSpellAtk() {
    const c = this.state.char;
    const pm = REALMS[c.realm]?.powerMult || 1;
    const layerMult = 1 + (c.layer || 0) * 0.1;
    const qMult = qualityMultiplier(c);
    const artifactBase = (c.artifactLevel || 0) * 2.5;
    const techAtk = (c.techniques || []).reduce((acc, t) => acc + (t.atk || 0), 0);
    const lawAtk = lawBonusSum(c, 'atk');
    const statTerm = Math.min(c.attrs.神识, 160) * 0.8;
    return Math.round((16 + statTerm + artifactBase) * pm * layerMult * qMult * (1 + techAtk * 0.75 + lawAtk));
  }

  playerDef() {
    const c = this.state.char;
    const pm = REALMS[c.realm]?.powerMult || 1;
    const layerMult = 1 + (c.layer || 0) * 0.1;
    const qMult = qualityMultiplier(c);
    const bestDef = c.inventory.reduce((max, it) => Math.max(max, ITEM_BY_ID[it.id]?.equip?.def || 0), 0);
    const artifactDef = (c.artifactLevel || 0) * 1.4;
    const techDef = (c.techniques || []).reduce((acc, t) => acc + (t.def || 0), 0);
    const lawDef = lawBonusSum(c, 'def');
    const statTerm = Math.min(c.attrs.根骨, 160) * 0.32;
    return Math.round((4 + statTerm + bestDef * 0.4 + artifactDef) * pm * layerMult * qMult * (1 + techDef + lawDef));
  }

  act_combatAttack() { return this.combatRound('attack'); }
  act_combatSpell() { return this.combatRound('spell'); }
  act_combatArt() { return this.combatRound('art'); }
  act_combatGuard() { return this.combatRound('guard'); }
  act_combatFlee() { return this.combatRound('flee'); }

  act_combatPill() {
    const s = this.state;
    const c = s.char;
    let used = '';
    const healMult = (c.rootId === 'mu' ? 1.3 : 1) * (c.goldenFingerId === 'gf_bottle' ? 1.2 : 1);
    if (hasItem(s, 'dahuan_dan') && (c.hp < c.maxHp * 0.55 || c.mp < c.maxMp * 0.4)) {
      removeItem(s, 'dahuan_dan', 1);
      const hpG = Math.round(c.maxHp * 0.75 * healMult);
      const mpG = Math.round(c.maxMp * 0.5);
      c.hp = Math.min(c.maxHp, c.hp + hpG);
      c.mp = Math.min(c.maxMp, c.mp + mpG);
      used = `大还丹（气血 +${hpG.toLocaleString()}，灵力 +${mpG.toLocaleString()}）`;
    } else if (hasItem(s, 'liaoshang_dan')) {
      removeItem(s, 'liaoshang_dan', 1);
      const hpG = Math.round(c.maxHp * 0.4 * healMult);
      c.hp = Math.min(c.maxHp, c.hp + hpG);
      used = `疗伤丹（气血 +${hpG.toLocaleString()}）`;
    } else if (hasItem(s, 'huiling_dan')) {
      removeItem(s, 'huiling_dan', 1);
      const mpG = Math.round(c.maxMp * 0.45);
      c.mp = Math.min(c.maxMp, c.mp + mpG);
      used = `回灵丹（灵力 +${mpG.toLocaleString()}）`;
    }
    if (used) s.stats.pills = (s.stats.pills || 0) + 1;
    s.combat.log.push(`你迅速吞服${used || '灵丹'}。`);
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
      const hasTalisman = (s.buffs.escape || 0) > 0 || hasItem(s, 'shenxing_fu');
      const stealthBonus = c.goldenFingerId === 'gf_stealth' ? 0.25 : 0;
      const spaceLaw = lawBonusSum(c, 'flee');
      const chance = (c.rootId === 'feng' || hasTalisman) ? 1 : clamp(0.45 + c.attrs.气运 * 0.01 + stealthBonus + spaceLaw, 0.2, 0.96);
      if (this.rng.chance(chance)) {
        if ((s.buffs.escape || 0) > 0) s.buffs.escape--;
        else if (c.rootId !== 'feng' && hasItem(s, 'shenxing_fu')) removeItem(s, 'shenxing_fu', 1);
        log.push(hasTalisman ? '神行符化作青风托身，你瞬息千里。' : '你脚踏遁光抽身而退。');
        s.stats.escapes = (s.stats.escapes || 0) + 1;
        s.combat = null;
        s.scene = { id: 'hub', result: { text: '你成功脱身。留得青山在，来日再论高低。', lines: [] } };
        this.emit();
        return;
      }
      log.push('敌手杀机封锁退路，遁术未能奏效！');
    }

    const demonicIds = new Set(['rogue', 'ghost', 'blood_cult', 'demon_general', 'ghost_king', 'demon_king', 'blood_elder', 'void_fiend']);
    const sunMult = c.rootId === 'taiyang' && demonicIds.has(e.id) ? 1.4 : 1;
    const armorMult = e.trait === '护甲' ? 1.35 : 1;
    const critChance = clamp(0.08 + c.attrs.气运 * 0.004 + lawBonusSum(c, 'crit'), 0.05, 0.65);
    const lifesteal = lawBonusSum(c, 'lifesteal');
    let dealt = 0;

    if (mode === 'attack') {
      if (e.trait === '虚空' && this.rng.chance(0.18)) {
        log.push(`${e.name}【虚空闪烁】化实为虚，你的平剑斩空了！`);
      } else {
        const crit = this.rng.chance(critChance);
        const dmg = Math.max(1, Math.round(this.playerAtk() * sunMult * (crit ? 1.75 : 1) - e.def * 0.45 * armorMult));
        cb.hp -= dmg;
        dealt = dmg;
        s.scene.fx = 'combat_slash';
        log.push(`${crit ? '剑光破空，正中要害！' : '你一剑斩出。'}造成 ${dmg.toLocaleString()} 伤害。`);
      }
    } else if (mode === 'art') {
      const cost = Math.round(c.maxMp * 0.24);
      c.mp = Math.max(0, c.mp - cost);
      const dmg = Math.max(2, Math.round((this.playerAtk() * 1.7 + this.playerSpellAtk() * 0.45) * sunMult - e.def * 0.15));
      cb.hp -= dmg;
      dealt = dmg;
      s.scene.fx = 'combat_slash';
      log.push(`【${this.bestSignatureArt()}】破开护体灵光，重创 ${dmg.toLocaleString()} 伤害！`);
    } else if (mode === 'spell') {
      const cost = Math.round(c.maxMp * 0.12);
      if (c.mp >= cost) {
        c.mp -= cost;
        const dmg = Math.max(1, Math.round(this.playerSpellAtk() * sunMult - e.def * 0.25));
        cb.hp -= dmg;
        dealt = dmg;
        s.scene.fx = 'combat_spell';
        log.push(`法诀引动天地灵气轰落，造成 ${dmg.toLocaleString()} 伤害。`);
      } else {
        log.push('灵力不济，法诀半途溃散。');
      }
    } else if (mode === 'guard') {
      c.mp = Math.min(c.maxMp, c.mp + Math.round(c.maxMp * 0.14));
      log.push('你收剑结印护体，化解来势并吐纳回灵。');
    } else if (mode === 'item') {
      s.scene.fx = 'heal';
    }

    if (dealt > 0 && lifesteal > 0) {
      const vamp = Math.max(1, Math.round(dealt * lifesteal));
      c.hp = Math.min(c.maxHp, c.hp + vamp);
      log.push(`【血海法则】汲取气血 +${vamp.toLocaleString()}。`);
    }

    if (cb.hp <= 0) {
      s.stats.kills++;
      if (e.id === 'demon_king') s.flags['斩妖王'] = true;
      if (e.id === 'demon_general' || e.id === 'demon_king') s.counters.demons_slain = (s.counters.demons_slain || 0) + 1;
      if (e.id === 'cultivator' && !c.inventory.some((it) => ITEM_BY_ID[it.id]?.equip)) s.flags['空手胜筑基'] = true;
      const exp = Math.round(e.exp * (1 + c.attrs.气运 * 0.01));
      const stones = Math.round(e.stones * (1 + (PET_BY_ID[c.petId]?.stonesBonus || 0)));
      c.stones += stones;
      const gained = gainExp(s, exp);
      log.push(`${e.name}伏诛！搜得灵石 +${stones.toLocaleString()}，实战修为 +${gained.toLocaleString()}。`);
      if (e.realm >= 2) this.pushRumor(`【潜龙战报】「${c.name}」于${c.location}力斩${e.name}，声威震动一方！`);
      const onWin = cb.onWin;
      s.combat = null;
      s.scene = { id: 'hub', result: null };
      if (onWin) {
        this.resolveOutcome(onWin, log);
      } else {
        s.scene.result = { text: '剑气散尽，你收剑调息，静待灵力平复。', lines: log };
      }
      this.afterAction();
      this.emit();
      return;
    }

    // 敌手反击与特性触发
    const defMult = (c.rootId === 'tu' ? 0.8 : 1)
      * (c.goldenFingerId === 'gf_stealth' ? 0.82 : 1)
      * (1 - (PET_BY_ID[c.petId]?.defBonus || 0));
    const guardMult = mode === 'guard' ? 0.4 : 1;
    let traitAtkMult = 1;
    let defIgnore = 1;
    let traitNote = '';

    if (e.trait === '猛扑' && this.rng.chance(0.26)) { traitAtkMult = 1.35; traitNote = '【猛扑】'; }
    else if (e.trait === '快刀' && this.rng.chance(0.28)) { traitAtkMult = 1.3; traitNote = '【快刀连斩】'; }
    else if (e.trait === '剑意') { defIgnore = 0.65; }
    else if (e.trait === '天威') { traitAtkMult = 1.18; if (mode !== 'guard') c.demon = clamp(c.demon + 1, 0, 100); }
    else if (e.trait === '水煞') { traitAtkMult = 1.1; c.mp = Math.max(0, c.mp - Math.round(c.maxMp * 0.06)); }
    else if (e.trait === '心魔') { traitAtkMult = 1 + c.demon * 0.004; }

    const effectiveDef = this.playerDef() * defIgnore;
    let edmg = Math.max(1, Math.round((e.atk * traitAtkMult * guardMult - effectiveDef * 0.55) * defMult));
    if (e.trait === '毒煞' && mode !== 'guard') {
      const poison = Math.max(1, Math.round(c.maxHp * 0.045));
      edmg += poison;
      traitNote = '【毒煞蚀体】';
    }
    c.hp -= edmg;
    if (e.trait === '噬灵') {
      const drain = Math.round(c.maxMp * 0.08);
      c.mp = Math.max(0, c.mp - drain);
      traitNote = '【噬灵】';
    }
    if (e.trait === '血煞') {
      const eHeal = Math.max(1, Math.round(edmg * 0.25));
      cb.hp = Math.min(cb.maxHp, cb.hp + eHeal);
      traitNote = `【血煞回气 +${eHeal.toLocaleString()}】`;
    }
    log.push(`${e.name}${traitNote}反击，你受了 ${edmg.toLocaleString()} 点伤。`);
    cb.turn++;

    if (c.hp <= 0) {
      if ((s.buffs.shield || 0) > 0 || hasItem(s, 'huxin_fu')) {
        if ((s.buffs.shield || 0) > 0) s.buffs.shield--;
        else removeItem(s, 'huxin_fu', 1);
        c.hp = Math.max(1, Math.round(c.maxHp * 0.18));
        log.push('怀中护心符轰然碎裂，一道金光替你挡下必杀一击！');
        s.scene.fx = 'heal';
        this.emit();
        return;
      }
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
    const extraKarma = s.char.goldenFingerId === 'gf_none' ? 2 : 0;
    s.meta.karmaPoints = (s.meta.karmaPoints || 0) + 1 + Math.floor(s.char.realm / 2) + extraKarma;
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
        `此生：奇遇 ${s.stats.events} 次 · 突破 ${s.stats.breakthroughs} 次 · 杀敌 ${s.stats.kills} 尊 · 终章「${ending.name}」`,
        '轮回点已记入命盘。你可以携此世功果，重开下一世轮回。',
      ].join('\n'),
      choices: [
        { label: '轮回转世', hint: '保留轮回点、天赋与已解锁结局', action: 'reincarnate', effect: 'primary' },
        { label: '回看此生', hint: '查看战力、法则与成就总览', action: 'fate' },
      ],
    };
  }

  act_reincarnate() {
    const s = this.state;
    s.meta.cycle = (s.meta.cycle || 1) + 1;
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

  /* ---------------- 坊市 / 招徒 ---------------- */

  buildSellNode() {
    const s = this.state;
    const sellable = s.char.inventory.filter((it) => (ITEM_BY_ID[it.id]?.price || 0) > 0 && it.qty > 0);
    const choices = sellable.map((it) => {
      const def = ITEM_BY_ID[it.id];
      const price = Math.round(def.price * 0.55);
      return {
        id: `sell_${it.id}`,
        label: `卖 ${def.name} ×1（${price.toLocaleString()} 灵石）`,
        hint: `持有 ${it.qty} 件`,
        action: 'sellItem',
        params: { id: it.id, price },
      };
    });
    choices.push({ id: 'back_market', label: '返回商行', hint: '', action: 'marketBack' });
    return {
      id: 'sell',
      title: '坊市 · 出售灵材',
      text: '老掌柜拨弄着算盘，只看成色不问来历。',
      choices,
    };
  }

  buildMarketNode() {
    const s = this.state;
    const region = REGION_BY_ID[s.char.regionId] || REGION_BY_ID.qingniu;
    const stock = region.marketItems?.length ? region.marketItems : ['liaoshang_dan', 'huiling_dan', 'yinqi_dan', 'zhuji_dan', 'huxin_fu', 'xuantie', 'leimu'];
    const choices = stock
      .map((id) => ITEM_BY_ID[id])
      .filter(Boolean)
      .map((it) => {
        const price = Math.round(it.price * (1 - Math.min(0.3, s.char.attrs.魅力 * 0.005)) * (s.char.sectId === 'wanbao' ? 0.85 : 1));
        return {
          id: `buy_${it.id}`,
          label: `买 ${it.name}（${price.toLocaleString()} 灵石）`,
          hint: it.desc,
          action: 'buyItem',
          params: { id: it.id, price },
          once: false,
        };
      });
    choices.push({ id: 'sell', label: '出售储物袋灵材', hint: '折价变现灵石', action: 'sellMenu' });
    choices.push({ id: 'back', label: '离开商行', hint: '返回坊市主街', action: 'openCity' });
    return {
      id: 'market',
      title: `${region.name} · 灵材商行`,
      text: `商行架上陈列着「${region.name}」当令丹药与奇珍。高阶州域坊市方可买到化婴、化神乃至大道残片。\n\n持有灵石：${s.char.stones.toLocaleString()}`,
      choices,
    };
  }

  act_marketBack() {
    this.state.scene = { id: 'market', result: null };
    this.emit();
  }

  act_buyItem(ch) {
    const s = this.state;
    const { id, price } = ch.params;
    if (s.char.stones < price) return { error: '灵石不够' };
    s.char.stones -= price;
    s.stats.goldSpent += price;
    addItem(s, id, 1);
    s.scene.result = {
      text: `你点清 ${price.toLocaleString()} 枚灵石推过柜台，掌柜将「${ITEM_BY_ID[id].name}」装入封灵玉盒递来。`,
      lines: [`购得 ${ITEM_BY_ID[id].name}`],
      returnTo: 'market',
    };
    this.emit();
  }

  act_sellMenu() {
    const s = this.state;
    const sellable = s.char.inventory.filter((it) => (ITEM_BY_ID[it.id]?.price || 0) > 0 && it.qty > 0);
    if (!sellable.length) {
      s.scene.result = { text: '你翻了翻储物袋，眼下并无多余可售之物。', lines: [], returnTo: 'market' };
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
    s.scene.result = {
      text: `掌柜验过成色，爽快奉上一袋灵石。`,
      lines: [`出售 ${ITEM_BY_ID[id]?.name || id}，灵石 +${price.toLocaleString()}`],
      returnTo: 'sell',
    };
    this.emit();
  }

  buildRecruitNode() {
    const s = this.state;
    const ctx = contextOf(s, this);
    const eligible = SECTS.filter((sect) => {
      if (sect.id === 'sanxiu') return true;
      try { return compileCondition(sect.requireExpr || 'true')(ctx); } catch { return true; }
    });
    const choices = eligible.map((sect) => ({
      label: `${sect.name}（${sect.align}）`,
      hint: `${sect.requirement} · ${sect.technique}`,
      action: 'joinSect',
      sectId: sect.id,
    }));
    choices.push({ label: '暂不入宗', hint: '天大地大，稍后再议', action: 'backHub' });
    return {
      id: 'recruit',
      title: '寻访仙门 · 十三宗山门',
      text: '你踏遍九州名山大川。正道剑峰云雾缭绕，丹谷药香十里，魔门血海翻腾——每一座山门皆有独门藏经阁、宗门宝库与晋升试炼。',
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
    plain.version = SAVE_VERSION;
    return plain;
  }
}
