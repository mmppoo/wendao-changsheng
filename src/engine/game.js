import { RNG, clamp } from './rng.js';
import {
  createRun, advanceMonths, recomputeDerived, needExp, canBreakthrough, isRealmMaxLayer,
  breakthroughChance, monthlyExp, gainExp, isDead, addItem, removeItem, hasItem, itemCount,
  qualityMultiplier, lawBonusSum, maxLawLevel, defaultLawFor, gainLawExp, bottleneckStatus,
  maxTechSlots, activeTechniques, techCollectionBonus, techAlignmentConflict, techAlign,
  equipTechnique, unequipTechnique, autoEquipBestTechniques, titleBonuses, petBonuses,
  lifespanAlert, sectPerks, currentWorldEra, activeDaoGoal, SAVE_VERSION, lingqiAt, lingqiWord,
  perceivedRealmLabel,
} from './state.js';
import {
  startFaceSlapEncounter, buildFaceSlapNode, resolveFaceSlapChoice, AURA_STANCES,
  buildGrudgeBookNode, startGrudgeRevenge, addFactionDread, recordGrudge, settleGrudge,
} from './faceSlap.js';
import { buildFairHubNode, resolveFairPlay } from './fair.js';
import { applyEffects } from './effects.js';
import {
  EVENTS, buildRegistry, buildHub, choiceAvailable, markChoiceTaken, pickEvent,
  formatText, contextOf, registerEvents,
} from './narrative.js';
import { ALL_EVENTS, STORY_TRIGGERS } from '../data/events/index.js';
import { compileCondition, parseExpression, evaluate } from './expr.js';
import {
  REALMS, realmLabel, LAW_BY_ID, LAW_STAGES,
  DAO_BASE_QUALITIES, GOLDEN_CORE_QUALITIES,
} from '../data/realms.js';
import { ROOT_BY_ID } from '../data/roots.js';
import { SECTS, SECT_BY_ID, SECT_RANKS, PLAYER_SECT_TEMPLATE, sectRankName } from '../data/sects.js';
import { ITEM_BY_ID, ALCHEMY_RECIPES, ALCHEMY_RECIPE_BY_ID } from '../data/items.js';
import { ACHIEVEMENTS, ACHIEVEMENT_BY_ID } from '../data/achievements.js';
import { ENDINGS, ENDING_BY_ID, pickEnding } from '../data/endings.js';
import { ENEMY_BY_ID, scaleEnemy } from '../data/enemies.js';
import { tickHistory, beginHistoryEvent, worldYear, localHistory } from './history.js';
import { NEMESIS_ARCHETYPES } from '../data/events/nemesis.js';
import { freshCentury1World } from '../data/history/index.js';
import { jieshuMods, chooseEnding, endingKarma, recordLifeStats, refreshUnlocks, legacyOptions, setLegacy } from './meta.js';
import { GOLDEN_FINGER_BY_ID, PET_BY_ID } from '../data/golden_fingers.js';
import { REGIONS, REGION_BY_ID } from '../data/regions.js';
import {
  SECT_LIBRARIES, SECT_TREASURY, SECT_MISSIONS, SECT_PROMOTION_TRIALS,
} from '../data/sectContent.js';
import { WORLD_TECHNIQUES, WORLD_TECH_BY_ID } from '../data/techniques.js';
import { NPCS, NPC_BY_ID } from '../data/npcs.js';

const MONTHS = 1;
const ARTIFACT_TIERS = [
  '凡铁胚', '下品灵剑', '中品法宝', '上品通灵剑', '极品法宝',
  '地阶灵宝', '天阶灵宝', '后天仙宝', '先天至宝', '太古混沌仙剑', '太初问道仙兵',
];
const CAVE_UPGRADE_COSTS = [0, 600, 2400, 9000, 32000, 110000, 360000, 1200000, 3800000];
const REFINE_MATS_BY_PRICE = ['xuantie', 'chiyang_shi', 'leimu', 'xingchen_sha', 'longxue_jing', 'kunlun_shenmu', 'hundun_muqi'];
const NPC_EXCLUSIVE_TECH_IDS = new Set(NPCS.map((n) => n.teachTechId).filter(Boolean));
const ROMANCEABLE_NPCS = new Set(['npc_su']); // v8：原典里可结侣的只有宋宜
const TECH_GRADE_ORDER = { 凡: 0, 黄: 1, 玄: 2, 地: 3, 天: 4, 仙: 6 };
const COMBAT_TALISMAN_IDS = ['taiyi_hudaofu', 'jiuxiao_leifu', 'poxie_fu', 'jianqi_fu', 'zhangxin_leifu'];
const DELVE_THEMES = {
  qingniu:   { name: '青石老窑', floors: ['窑口', '储灵瓦罐层', '野修旧室', '窑底灵田残脉', '老窑最深处'] },
  luoxia:    { name: '芦洲旧河闸', floors: ['闸口', '暗渠', '水寇旧仓', '闸底石室', '前朝闸祠'] },
  yaosen:    { name: '铜谷塌方私矿', floors: ['矿口', '支巷', '塌方区', '地下水脉', '灵石矿心'] },
  guixu:     { name: '玄衡护脉大阵', floors: ['外阵', '符廊', '阵枢', '灵脉主流', '阵眼'] },
  beihuang:  { name: '雁门外堡废垒', floors: ['废堡', '烽燧', '地道', '旧粮窖', '前朝将台'] },
  zhongzhou: { name: '苍和旧都残垣', floors: ['外郭', '倾圮官署', '地下府库', '旧宫暗道', '苍和旧殿'] },
  kunlun:    { name: '十三大井·干涸古井', floors: ['井口', '井壁石阶', '地下暗河', '旧盟石室', '井底'] },
  jiuxiao:   { name: '赤霞旧府', floors: ['流沙废殿', '磁砂回廊', '天火残阵', '灵根崩毁处', '旧府正殿'] },
};

if (EVENTS.length === 0) registerEvents(ALL_EVENTS);

export class Game {
  constructor({ meta = {}, registry = null } = {}) {
    this.meta = {
      cycle: 1, karmaPoints: 0, talents: [], unlockedEndings: [], achievements: {},
      runs: 0, totalDeaths: 0, achKarmaGranted: 0, ...meta,
    };
    this.registry = registry || buildRegistry();
    this.state = null;
    this.rng = new RNG(Date.now() >>> 0);
    this.lastLines = [];
    this.onChange = null;
  }

  /* ---------------- lifecycle ---------------- */

  newRun({ seed, name, gender, originId, rootId, goldenFingerId, meta, jieshu = 0 } = {}) {
    const s = createRun({
      seed: seed ?? (Date.now() >>> 0), name, gender, originId, rootId, goldenFingerId,
      meta: meta || this.meta, jieshu,
    });
    this.rng = new RNG(s.seed);
    this.state = s;
    this.meta = s.meta;
    this.state.scene = { id: 'hub', result: null };
    this.state.rumors = [`【风闻】又有一个${ROOT_BY_ID[s.char.rootId]?.name || '凡体'}的少年人踏上了仙途，名叫「${s.char.name}」。`];
    this.state.rumorAt = s.char.age;
    // v8：每一世分到一个宿敌（六种之一），名字按原型的姓名池生成
    const mix = Math.imul((s.seed >>> 0) ^ 0x9e3779b9, 2654435761) >>> 0;
    const arch = NEMESIS_ARCHETYPES[mix % NEMESIS_ARCHETYPES.length];
    if (arch) {
      this.state.flags['宿敌'] = arch.id;
      this.state.flags['宿敌名'] = this.rng.pick(arch.surnames) + this.rng.pick(arch.givenNames);
    }
    // 开局进入出身开场
    this.state.chapterId = 'B001';
    this.state.lingqiWord = lingqiWord(lingqiAt(1));
    this.openScene(`open_${this.state.char.originId}`);
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
    if (!Array.isArray(c.equippedTechs)) c.equippedTechs = [];
    if (!c.caveLevel) c.caveLevel = 1;
    if (!c.petLevel) c.petLevel = 1;
    if (!c.sectBlacklist) c.sectBlacklist = {};
    if (!Array.isArray(c.secretsCleared)) c.secretsCleared = [];
    if (state.stats && state.stats.contribSpent == null) state.stats.contribSpent = 0;
    if (state.meta && state.meta.totalDeaths == null) state.meta.totalDeaths = state.meta.runs || 0;
    if (state.meta && !Array.isArray(state.meta.techniquesSeen)) {
      state.meta.techniquesSeen = (c.techniques || []).map((t) => t.id);
    }
    if (state.delve === undefined) state.delve = null;
    if (state.faceSlap === undefined) state.faceSlap = null;
    if (!Array.isArray(state.faceSlapRecent)) state.faceSlapRecent = [];
    if (!Array.isArray(state.grudges)) state.grudges = [];
    if (!state.factionDread || typeof state.factionDread !== 'object') state.factionDread = {};
    if (!state.factionTributeAt || typeof state.factionTributeAt !== 'object') state.factionTributeAt = {};
    if (!state.fairCooldowns || typeof state.fairCooldowns !== 'object') state.fairCooldowns = {};
    if (!c.auraStance) c.auraStance = c.goldenFingerId === 'gf_stealth' ? 'hide' : 'normal';
    if (!state.world) state.world = freshCentury1World();
    if (!state.history) state.history = {};
    if (state.buffs && (state.meta?.talents || []).includes('t_niming') && !state.buffs.permBreakBonus) {
      state.buffs.permBreakBonus = 6;
    }
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
      case 'techEquip': return this.buildTechEquipNode();
      case 'alchemy': return this.buildAlchemyNode();
      case 'regionHub': return this.buildRegionNode();
      case 'regionMap': return this.buildRegionMapNode();
      case 'delve': return this.buildDelveNode();
      case 'faceSlap': return buildFaceSlapNode(this) || buildHub(this);
      case 'grudgeBook': return buildGrudgeBookNode(this);
      case 'fairHub': return buildFairHubNode(this);
      case 'sectHall': return this.buildSectHallNode();
      case 'sectMissions': return this.buildSectMissionsNode();
      case 'sectLibrary': return this.buildSectLibraryNode();
      case 'sectTreasury': return this.buildSectTreasuryNode();
      case 'sectPromote': return this.buildSectPromoteNode();
      case 'cityHub': return this.buildCityNode();
      case 'techShop': return this.buildTechShopNode();
      case 'tianji': return this.buildTianjiNode();
      case 'arena': return this.buildArenaNode();
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
    const body = formatText(node.text, this.state);
    return this.state.scene.preface ? `${this.state.scene.preface}\n\n${body}` : body;
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
        id: ch.id || null,
        label: typeof ch.label === 'function' ? ch.label(s) : ch.label,
        hint: ch.hint || '',
        disabled: !avail.ok,
        reason: avail.reason || '',
        action: ch.action || 'choose',
        effect: ch.effect || '',
        urgent: Boolean(ch.urgent),
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
    if (cost.stones) {
      s.char.stones -= cost.stones;
      s.stats.goldSpent = (s.stats.goldSpent || 0) + cost.stones;
    }
    if (cost.hp) s.char.hp -= cost.hp;
    if (cost.mp) s.char.mp -= cost.mp;
    if (cost.item) removeItem(s, cost.item, 1);
    if (ch.effects) lines.push(...applyEffects(s, ch.effects, this.effectCtx()));

    let outcome = ch.outcome || null;
    if (ch.roll) {
      let p = ch.roll.p ?? 0.5;
      for (const [k, v] of Object.entries(ch.roll.attrs || {})) p += (s.char.attrs[k] || 0) * v;
      if (ch.roll.expr) {
        try { p = Number(evaluate(parseExpression(ch.roll.expr), contextOf(s, this))) || 0; } catch { /* ignore */ }
      }
      if (s.char.goldenFingerId === 'gf_karma_mirror') p += 0.08;
      p += (petBonuses(s.char).luck || 0) * 0.005;
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
      if (outcome.promoteCost) {
        const pay = Math.min(s.char.contribution, outcome.promoteCost);
        s.char.contribution -= pay;
        s.stats.contribSpent = (s.stats.contribSpent || 0) + pay;
      }
      s.char.sectRank = Math.max(s.char.sectRank || 0, outcome.promoteRank);
      const rName = sectRankName(s.char.sectId, s.char.sectRank);
      const sName = this.currentSectName();
      lines.push(`【升职】升为「${sName} · ${rName}」。`);
      this.pushRumor(`【门户消息】「${s.char.name}」通过考核，升为${sName}${rName}。`);
    }
    if (outcome.missionId && s.sectBoard?.slots) {
      const slot = s.sectBoard.slots.find((x) => x.missionId === outcome.missionId);
      if (slot) slot.done = true;
      s.flags[`任务冷却:${outcome.missionId}`] = s.char.age + Math.max(12, (outcome.missionMonths || 6) * 4);
      s.counters.sect_missions_done = (s.counters.sect_missions_done || 0) + 1;
      if (outcome.remainMonths) lines.push(...advanceMonths(s, outcome.remainMonths, this.rng));
    }
    if (outcome.arenaWin) {
      s.counters.arena_win = (s.counters.arena_win || 0) + 1;
      lines.push(`【擂台】已胜 ${s.counters.arena_win} 场。`);
    }
    if (outcome.delveAdvance && s.delve) {
      const da = outcome.delveAdvance;
      s.delve.haulStones += da.stones || 0;
      s.delve.haulExp += da.exp || 0;
      s.delve.haulLaw += da.law || 0;
      if (da.item) s.delve.haulItems.push(da.item);
      if (da.kind === 'boss') {
        lines.push(...this.bankDelveHaul(1, true));
      } else {
        s.delve.floor = Math.min(s.delve.maxFloor, s.delve.floor + 1);
        s.delve.log.push(`斩敌得宝（灵石 +${(da.stones || 0).toLocaleString()}），踏入第 ${s.delve.floor} 层。`);
        lines.push(`暂存战利：灵石 +${(da.stones || 0).toLocaleString()}，${ITEM_BY_ID[da.item]?.name || da.item} ×1`);
      }
    }
    if (outcome.delveEscape && s.delve) {
      lines.push(...this.bankDelveHaul(0.5, false));
    }
    if (outcome.faceSlapAttrSpend) {
      s.faceSlapAttr = s.faceSlapAttr || {};
      s.faceSlapAttr[s.char.realm] = (s.faceSlapAttr[s.char.realm] || 0) + outcome.faceSlapAttrSpend;
    }
    if (outcome.faceSlapDread?.backingId) {
      addFactionDread(s, outcome.faceSlapDread.backingId, outcome.faceSlapDread.delta || 1);
    }
    if (outcome.faceSlapSettleGrudge) {
      const doneG = settleGrudge(s, outcome.faceSlapSettleGrudge);
      if (doneG) lines.push(`【旧怨了结】第${doneG.year}年的账已一笔勾销。`);
    }
    if (outcome.faceSlapRecordGrudge && s.faceSlap) {
      recordGrudge(s, s.faceSlap, outcome.faceSlapRecordGrudge);
    }
    if (outcome.faceSlapEscalate && s.faceSlap) {
      s.faceSlap.stage = 'elder';
      lines.push('【风波升级】打了小的来了老的，对方的靠山闻讯杀到。');
    } else if (outcome.faceSlapClear) {
      s.faceSlap = null;
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
      returnMeta: outcome.returnMeta || null,
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
    // 归来清算时对方会认出你的修为：敛息着的话，此刻主动散去敛息（文中交代一句）
    if (node.revealsRealm && s.char.auraStance === 'hide') {
      s.char.auraStance = 'normal';
      s.scene.preface = '你散去敛息，不再藏着修为。';
    }
    s.stats.events++;
    s.stats.encounters = (s.stats.encounters || 0) + 1;
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

  currentSectName() {
    const c = this.state?.char;
    if (!c?.sectId) return '散修';
    if (c.sectId === 'player_sect') return c.playerSectName || `${c.name}道宗`;
    return SECT_BY_ID[c.sectId]?.name || '门户';
  }

  autoEquipIfSpace(techObj) {
    const c = this.state.char;
    c.equippedTechs = c.equippedTechs || [];
    if (this.state.meta && techObj?.id) {
      this.state.meta.techniquesSeen = Array.from(new Set([...(this.state.meta.techniquesSeen || []), techObj.id]));
    }
    if (c.equippedTechs.length < maxTechSlots(c.realm) && !c.equippedTechs.includes(techObj.id)) {
      c.equippedTechs.push(techObj.id);
      c._manualUnequip = false;
      return true;
    }
    return false;
  }

  refineStoneCost() {
    const s = this.state;
    const c = s.char;
    const lvl = c.artifactLevel || 0;
    const raw = (260 + lvl * 420) * Math.pow(2.05, Math.max(0, lvl));
    const craftDisc = 1 - Math.min(0.4, sectPerks(c).craft || 0);
    const fireDisc = c.rootId === 'huo' ? 0.85 : 1;
    const eraDisc = 1 - (currentWorldEra(s).refineDiscount || 0);
    return Math.max(80, Math.round(raw * craftDisc * fireDisc * eraDisc));
  }

  /* ---------------- 支柱一：洞府修行（功法槽位 / 丹方 / 法宝 / 灵脉 / 灵兽 / 智能闭关 / 讲道收徒） ---------------- */

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
    const active = activeTechniques(c);
    const slots = maxTechSlots(c.realm);
    const conflict = techAlignmentConflict(c);
    const bnCave = bottleneckStatus(s);
    const choices = [
      // 修为已满：洞府里直接给出破境入口，不必先退回主界面
      ...(canBreakthrough(c) ? [{
        id: 'cave_breakthrough',
        label: bnCave.ok ? '冲击境界' : '冲击境界（瓶颈未解）',
        hint: bnCave.ok ? '修为已满，可以冲关' : (bnCave.missing[0] || '瓶颈未解'),
        action: 'breakthrough',
        effect: 'primary',
      }] : []),
      { id: 'cultivate', label: '吐纳炼气', hint: '半年 · 稳妥，无心魔', action: 'cultivate', params: { months: 6, returnTo: 'cave' }, effect: 'quiet' },
      { id: 'deep', label: '闭关苦修', hint: `两年 · 进境快，有心魔${c.rootId === 'taiyin' ? ' · 太阴加成' : ''}`, action: 'cultivate', params: { months: 24, demonRisk: true, returnTo: 'cave' } },
      { id: 'smart_cult', label: '闭关到修为满', hint: '至多五年 · 有事自动出关', action: 'smartCultivate', effect: canBreakthrough(c) ? '' : 'quiet' },
      { id: 'comprehend', label: `参悟${law?.name || '大道'}`, hint: `半年 · 长悟性道心 · ${LAW_STAGES[lawLvl]}`, action: 'comprehend', params: { returnTo: 'cave' } },
      {
        id: 'tech_equip',
        label: `功法（${active.length}/${slots}）`,
        hint: conflict.conflict ? '正邪相冲，需要调整' : `已学 ${c.techniques.length} 部 · 选哪几部在用`,
        action: 'openTechEquip',
      },
      {
        id: 'aura_stance',
        label: `气机姿态 · ${AURA_STANCES[c.auraStance || 'normal']?.name || '顺其自然'}`,
        hint: c.auraStance === 'hide'
          ? `对外仅显「${perceivedRealmLabel(c)}」· 点此切换（扮猪吃虎/如常/威压外放）`
          : c.auraStance === 'show'
            ? '威压外放：闲逛少遇挑衅和野怪，敢来的多是同阶以上 · 点此切换'
            : '如实显露当前境界 · 点此切换为敛息藏锋或威压外放',
        action: 'cycleAuraStance',
      },
      { id: 'open_alchemy', label: '开炉炼丹', hint: '照丹方炼破境、疗伤丹', action: 'openAlchemy' },
    ];
    if (c.demon > 0 || c.injuries > 0) {
      choices.push({ id: 'settle', label: '静心涤魔', hint: `三月 · 压心魔、养内伤`, action: 'settle', params: { returnTo: 'cave' } });
    }
    const lvl = c.artifactLevel || 0;
    const refineCost = this.refineStoneCost();
    choices.push({
      id: 'refine',
      label: `祭炼法宝（${lvl}阶）`,
      hint: lvl >= ARTIFACT_TIERS.length - 1
        ? '已到顶阶'
        : `三月 · 战力 +8% · ${refineCost.toLocaleString()} 灵石`,
      action: 'refine',
      params: { returnTo: 'cave' },
      disabled: lvl >= ARTIFACT_TIERS.length - 1,
      reason: '法宝已到顶阶',
    });

    const cLvl = c.caveLevel || 1;
    const caveCost = CAVE_UPGRADE_COSTS[cLvl] || 0;
    choices.push({
      id: 'upgrade_cave',
      label: cLvl >= 9 ? '洞府（已到九阶）' : `升级洞府灵脉（${cLvl}→${cLvl + 1}阶）`,
      hint: cLvl >= 9 ? '洞府已到顶阶（修炼加快 144%）' : `耗 ${caveCost.toLocaleString()} 灵石 · 修炼再快 18%`,
      action: 'upgradeCave',
      disabled: cLvl >= 9 || c.stones < caveCost,
      reason: cLvl >= 9 ? '已到顶阶' : `需 ${caveCost.toLocaleString()} 灵石`,
    });

    if (c.petId && PET_BY_ID[c.petId]) {
      const pLvl = c.petLevel || 1;
      const petCost = Math.round(600 * Math.pow(3.2, pLvl - 1));
      choices.push({
        id: 'feed_pet',
        label: pLvl >= 5 ? `${PET_BY_ID[c.petId].name}（已到五阶）` : `喂养${PET_BY_ID[c.petId].name}（${pLvl}→${pLvl + 1}阶）`,
        hint: pLvl >= 5 ? '灵兽已到顶阶' : `妖兽内丹或 ${petCost.toLocaleString()} 灵石 · 灵兽助战更强`,
        action: 'feedPet',
        disabled: pLvl >= 5 || (c.stones < petCost && !hasItem(s, 'yaoshou_neidan')),
        reason: pLvl >= 5 ? '已到顶阶' : `需妖兽内丹或 ${petCost.toLocaleString()} 灵石`,
      });
    }

    if (c.realm >= 1) {
      choices.push(
        { id: 'preach', label: '开坛讲道', hint: `三月 · 传道授业（累计 ${s.counters.teach || 0} 次），增道心与声望`, action: 'preach' },
        { id: 'recruit_disciple', label: '广收门徒', hint: `三月 · 择良才入门（门徒 ${s.counters.disciples || 0} 人）`, action: 'recruitDisciple' },
      );
    }
    if (c.goldenFingerId === 'gf_bottle') {
      choices.push({ id: 'bottle_ripen', label: `${GOLDEN_FINGER_BY_ID.gf_bottle?.name || '机缘'} · 催灵`, hint: '两月 · 催熟灵草凝丹', action: 'bottleRipen', params: { returnTo: 'cave' } });
    }
    if (c.rootId === 'xue') {
      choices.push({
        id: 'blood_cultivate', label: '燃血秘修', hint: '三月 · 以气血换修为，伤身',
        action: 'bloodCultivate', params: { returnTo: 'cave' },
        require: 'char.hp > char.maxHp * 0.35', requireHint: '气血不足，强行燃血恐伤本源',
      });
    }
    if (c.realm >= 3 && !s.flags.开宗立派) {
      choices.push({
        id: 'found_sect',
        label: '开宗立派',
        hint: c.sectId && (c.sectRank || 0) < 5 ? '须先离开原门户，或升到最高职阶' : '耗 10,000 灵石 · 自立门户，收门徒、收月贡',
        action: 'foundSect',
        disabled: (Boolean(c.sectId) && (c.sectRank || 0) < 5) || c.stones < 10000,
        reason: c.sectId && (c.sectRank || 0) < 5 ? '须先离开原门户，或升到最高职阶' : '需 10,000 灵石',
      });
    }
    if (c.realm >= 1) {
      choices.push({ id: 'long_seclusion', label: '闭关至下一件大事', hint: '跳过平淡岁月，有事出关', action: 'longSeclusion', effect: 'quiet' });
    }
    choices.push(c.realm >= 2
      ? { id: 'bingjie', label: '兵解入轮回', hint: '了结此生，回到第一年', action: 'bingjie' }
      : { id: 'bingjie', label: '了此一生，魂归第一年', hint: '带着记忆回到第一年', action: 'bingjie' });
    choices.push({ id: 'back_hub', label: '出洞府', hint: '回主界', action: 'backHub' });

    const needText = Number.isFinite(needExp(c)) ? needExp(c).toLocaleString() : '∞';
    const life = lifespanAlert(c);
    return {
      id: 'cave',
      title: `洞府静室 · ${cLvl}阶灵脉`,
      text: `静室里只有一盏灯。${life.level !== 'ok' ? `\n\n【${life.level === 'critical' ? '大限将至' : '寿元不多'}】${life.text}` : ''}\n\n修为 ${Math.floor(c.exp).toLocaleString()} / ${needText}　·　每月 +${monthlyExp(s).toLocaleString()}${conflict.conflict ? '\n【功法相冲】正邪功法同修，需要调整' : ''}`,
      choices,
      subhub: true,
    };
  }

  act_smartCultivate() {
    const s = this.state;
    const c = s.char;
    if (canBreakthrough(c)) {
      s.scene.result = {
        text: '你刚入定便觉气海充盈欲溢，修为已至当前层数圆满，可直接出关叩关破境。',
        lines: ['修为已满，无须继续枯坐'],
        returnTo: 'hub',
      };
      this.emit();
      return;
    }
    let totalMonths = 0;
    let totalExp = 0;
    let stopReason = '五年期满，平稳出关';
    const notes = [];
    for (let step = 0; step < 10; step++) {
      const m = 6;
      const got = gainExp(s, monthlyExp(s) * m);
      totalExp += got;
      totalMonths += m;
      s.counters.night_cultivate = (s.counters.night_cultivate || 0) + 2;
      if (c.goldenFingerId === 'gf_bottle' && this.rng.chance(0.32)) {
        const herb = c.realm >= 2 ? 'qiannian_lingcao' : 'lingcao';
        addItem(s, herb, 1);
        notes.push(`【${GOLDEN_FINGER_BY_ID.gf_bottle?.name || '机缘'}】催熟 ${ITEM_BY_ID[herb]?.name} ×1`);
      }
      const tickNotes = advanceMonths(s, m, this.rng);
      for (const n of tickNotes) {
        if (n.includes('纪元') || n.includes('冲突')) notes.push(n);
      }
      if (isDead(s) || c.demon >= 100) {
        this.afterAction();
        this.emit();
        return;
      }
      if (this.pendingStory()) {
        this.afterAction();
        this.emit();
        return;
      }
      if (canBreakthrough(c)) {
        stopReason = '修为圆满，破境契机已至。';
        break;
      }
      if (c.demon >= 45) {
        stopReason = `心魔升至 ${Math.round(c.demon)}，警觉停关调息`;
        break;
      }
      if (lifespanAlert(c).level !== 'ok' && step >= 1) {
        stopReason = '寿元告警，提前出关谋求破境或延寿';
        break;
      }
      if (step >= 2 && this.rng.chance(0.14)) {
        const innerEv = pickEvent(s, this.rng, this, 'inner');
        if (innerEv) {
          this.openEvent(innerEv);
          this.afterAction();
          this.emit();
          return;
        }
      }
    }
    const yearsStr = totalMonths >= 12 ? `${(totalMonths / 12).toFixed(totalMonths % 12 ? 1 : 0)} 年` : `${totalMonths} 个月`;
    s.scene.result = {
      text: `你闭关潜修 ${yearsStr}，气海周天绵绵不绝。\n\n【出关缘由】${stopReason}`,
      lines: [`累计修为 +${totalExp.toLocaleString()}`, ...notes.slice(0, 4)],
      fx: canBreakthrough(c) ? 'breakthrough' : null,
      returnTo: canBreakthrough(c) ? 'hub' : 'cave',
    };
    this.afterAction();
    this.emit();
  }

  /** v8：长闭关——按年推进，遇大事即出关（给高境界跨越漫长岁月用）。 */
  act_longSeclusion() {
    const s = this.state;
    const c = s.char;
    // 卡在瓶颈（修为已满但天地灵机或道心、法则未到）时照样能闭关等待；瓶颈一解即出关
    if (canBreakthrough(c) && bottleneckStatus(s).ok) return this.act_smartCultivate();
    const waitingBottleneck = canBreakthrough(c);
    const startYear = worldYear(s);
    let years = 0;
    let totalExp = 0;
    let stopReason = '百年期满，出关一观世事';
    const heard = [];
    for (let step = 0; step < 100; step++) {
      totalExp += gainExp(s, monthlyExp(s) * 12);
      years++;
      const notes = advanceMonths(s, 12, this.rng);
      if (isDead(s) || c.demon >= 100) { this.afterAction(); this.emit(); return; }
      const hist = tickHistory(s, this.registry);
      for (const n of hist.notes) { this.pushRumor(n); heard.push(n); }
      if (hist.open) { stopReason = `身边将有大事：${hist.open.title}`; break; }
      if (canBreakthrough(c) && bottleneckStatus(s).ok) { stopReason = waitingBottleneck ? '瓶颈已解（天地灵机已足），可以冲关了' : '修为圆满，破境契机已至'; break; }
      if (c.demon >= 45) { stopReason = `心魔升至 ${Math.round(c.demon)}，停关调息`; break; }
      if (lifespanAlert(c).level !== 'ok') { stopReason = '寿元告警，出关谋求破境或延寿'; break; }
    }
    s.scene.result = {
      text: `你闭关 ${years} 年（第${startYear}年 → 第${worldYear(s)}年）。\n\n【出关缘由】${stopReason}`,
      lines: [`累计修为 +${Math.round(totalExp).toLocaleString()}`, ...heard.slice(-6)],
      returnTo: 'hub',
    };
    this.afterAction();
    this.emit();
  }

  /** v8：兵解入轮回——主动结束此生。 */
  act_bingjie() {
    const s = this.state;
    s.flags.bingjie = true;
    this.pushLog(`第${worldYear(s)}年，兵解入轮回`);
    return this.finishEnding(this.pickNaturalEnding());
  }

  act_openTechEquip(ch = {}) {
    const page = Math.max(0, Number(ch?.params?.page) || 0);
    this.state.scene = { id: 'techEquip', page, result: null };
    this.emit();
  }

  act_autoEquipTech() {
    const s = this.state;
    const c = s.char;
    const picked = autoEquipBestTechniques(c);
    s.scene.result = {
      text: `已为你选好 ${picked.length} 部功法（最多 ${maxTechSlots(c.realm)} 部）。`,
      lines: [`当前攻 ${this.playerAtk().toLocaleString()} · 防 ${this.playerDef().toLocaleString()} · 月修 ${monthlyExp(s).toLocaleString()}`],
      returnTo: 'techEquip',
    };
    this.emit();
  }

  buildTechEquipNode() {
    const s = this.state;
    const c = s.char;
    const slots = maxTechSlots(c.realm);
    const active = activeTechniques(c);
    const activeIds = new Set(active.map((t) => t.id));
    const conflict = techAlignmentConflict(c);
    const sorted = [...(c.techniques || [])].sort((a, b) => {
      const ea = activeIds.has(a.id) ? 1 : 0;
      const eb = activeIds.has(b.id) ? 1 : 0;
      if (ea !== eb) return eb - ea;
      const ga = TECH_GRADE_ORDER[a.grade] ?? 1;
      const gb = TECH_GRADE_ORDER[b.grade] ?? 1;
      if (ga !== gb) return gb - ga;
      return ((b.atk || 0) + (b.speed || 0)) - ((a.atk || 0) + (a.speed || 0));
    });
    const perPage = 8;
    const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
    const page = clamp(Number(s.scene.page) || 0, 0, totalPages - 1);
    const slice = sorted.slice(page * perPage, (page + 1) * perPage);

    const choices = [];
    if (sorted.length > 0) {
      choices.push({
        id: 'teq_auto',
        label: '自动选择最合适的功法',
        hint: '按品阶挑选，不会正邪相冲',
        action: 'autoEquipTech',
        effect: conflict.conflict ? 'primary' : '',
      });
    }
    for (const t of slice) {
      const on = activeIds.has(t.id);
      const align = techAlign(t);
      const stats = `${t.grade || '玄'}品 · 修炼+${Math.round((t.speed || 0) * 100)}% 攻+${Math.round((t.atk || 0) * 100)}% 防+${Math.round((t.def || 0) * 100)}%${t.lifespan ? ` 寿+${t.lifespan}` : ''}`;
      choices.push({
        id: `teq_${t.id}`,
        label: `${on ? '【在用】' : '【未用】'}${t.name}（${align}）`,
        hint: `${on ? '点击卸下 · ' : active.length >= slots ? '已满 · ' : '点击选用 · '}${stats}`,
        action: 'toggleTechEquip',
        params: { techId: t.id, page },
        disabled: !on && active.length >= slots,
        reason: '在用功法已满，请先卸下一部',
        effect: on ? 'primary' : '',
      });
    }
    if (totalPages > 1) {
      if (page > 0) choices.push({ id: 'teq_prev', label: `上一页（${page}/${totalPages}）`, hint: '翻看前页功法', action: 'openTechEquip', params: { page: page - 1 } });
      if (page < totalPages - 1) choices.push({ id: 'teq_next', label: `下一页（${page + 2}/${totalPages}）`, hint: '翻看更多收藏功法', action: 'openTechEquip', params: { page: page + 1 } });
    }
    choices.push({ id: 'back_cave', label: '返回洞府', hint: '', action: 'openCave' });
    return {
      id: 'techEquip',
      title: `功法（在用 ${active.length}/${slots}）${totalPages > 1 ? ` · 第${page + 1}/${totalPages}页` : ''}`,
      text: `同一时间最多修 ${slots} 部功法，境界越高可修越多（最多 6 部）。没在修的功法也略有助益。\n\n正邪功法不能同修：${conflict.conflict ? '当前正邪相冲，闭关会生心魔，破境更难。' : '眼下没有相冲。'}`,
      choices,
    };
  }

  act_toggleTechEquip(ch) {
    const s = this.state;
    const c = s.char;
    const id = ch.params?.techId;
    if (!id) return;
    const isOn = (c.equippedTechs || []).includes(id);
    const res = isOn ? unequipTechnique(c, id) : equipTechnique(c, id);
    if (!res.ok) return { error: res.reason };
    recomputeDerived(c);
    this.emit();
  }

  act_openAlchemy() {
    this.state.scene = { id: 'alchemy', result: null };
    this.emit();
  }

  alchemyBonus() {
    const s = this.state;
    const c = s.char;
    const lawAlch = lawBonusSum(c, 'alchemy') + (titleBonuses(c).alchemy || 0) + (s.buffs?.alchemyBonus || 0);
    const sectAlch = Math.min(0.25, sectPerks(c).alchemy || 0);
    const rootAlch = c.rootId === 'huo' ? 0.15 : 0;
    const eraAlch = currentWorldEra(s).alchemy || 0;
    return c.attrs.悟性 * 0.006 + lawAlch + rootAlch + sectAlch + eraAlch;
  }

  buildAlchemyNode() {
    const s = this.state;
    const c = s.char;
    const baseBonus = this.alchemyBonus();
    const choices = ALCHEMY_RECIPES.map((rec) => {
      const outId = rec.outputId || rec.output;
      const outDef = ITEM_BY_ID[outId];
      const rate = Math.round(clamp(rec.baseRate + baseBonus, 0.25, 0.97) * 100);
      const ingText = rec.ingredients.map((ing) => `${ITEM_BY_ID[ing.id]?.name || ing.id}×${ing.qty}(有${itemCount(s, ing.id)})`).join(' + ');
      const canAfford = c.realm >= rec.minRealm && rec.ingredients.every((ing) => itemCount(s, ing.id) >= ing.qty);
      return {
        id: `alch_${rec.id}`,
        label: `炼制 · ${outDef?.name || rec.name || outId}（成丹 ${rate}%）`,
        hint: `需 ${ingText}`,
        action: 'brewRecipe',
        params: { recipeId: rec.id },
        disabled: !canAfford,
        reason: c.realm < rec.minRealm ? `需${REALMS[rec.minRealm]?.name}境` : '药材不足',
      };
    });
    choices.push({ id: 'back_cave', label: '熄火离开', hint: '返回洞府', action: 'openCave' });
    return {
      id: 'alchemy',
      title: '丹房',
      text: `三昧地火在丹炉下静静跳动。择定丹方、配齐主辅药材方可定向成丹；丹道法则、火灵根、青崖宗传承都能提高成丹率。\n\n累计成丹：${s.counters.alchemy || 0} 炉 · 炸炉：${s.counters.alchemy_fail || 0} 次`,
      choices,
    };
  }

  act_brewRecipe(ch) {
    const s = this.state;
    const c = s.char;
    const rec = ALCHEMY_RECIPE_BY_ID[ch.params?.recipeId];
    if (!rec) return;
    const outId = rec.outputId || rec.output;
    if (!outId || !ITEM_BY_ID[outId]) return { error: '丹方产物无效' };
    if (c.realm < rec.minRealm) return { error: `需${REALMS[rec.minRealm]?.name}境` };
    if (!rec.ingredients.every((ing) => itemCount(s, ing.id) >= ing.qty)) return { error: '所需药材不足' };
    for (const ing of rec.ingredients) removeItem(s, ing.id, ing.qty);
    const lines = advanceMonths(s, 1, this.rng);
    const rate = clamp(rec.baseRate + this.alchemyBonus(), 0.25, 0.97);
    if (this.rng.chance(rate)) {
      s.counters.alchemy = (s.counters.alchemy || 0) + 1;
      addItem(s, outId, 1);
      const pillName = ITEM_BY_ID[outId]?.name || rec.name || outId;
      const lawNote = gainLawExp(s, 14 + rec.minRealm * 8, 'pill');
      lines.push(`开炉丹成：获得 ${pillName} ×1（累计炼丹 ${s.counters.alchemy} 次）。`, ...lawNote);
      s.scene.result = {
        text: `炉盖掀开，青烟笔直冲梁。一枚圆润饱满的「${pillName}」落入玉盘，丹香盈室。`,
        lines,
        fx: 'alchemy',
        returnTo: 'alchemy',
      };
    } else {
      s.counters.alchemy_fail = (s.counters.alchemy_fail || 0) + 1;
      const dmg = Math.round(c.maxHp * 0.08);
      c.hp = Math.max(1, c.hp - dmg);
      lines.push(`火候失衡，炸炉了。气血 -${dmg}。`);
      s.scene.result = {
        text: '一声闷响，炉盖掀飞半丈，满室焦苦。你拂去袖上灰烟，记下火候失误。',
        lines,
        fx: 'combat_hit',
        returnTo: 'alchemy',
      };
    }
    this.afterAction();
    this.emit();
  }

  act_upgradeCave() {
    const s = this.state;
    const c = s.char;
    const lvl = c.caveLevel || 1;
    if (lvl >= 9) return { error: '洞府灵脉已臻九阶福地' };
    const cost = CAVE_UPGRADE_COSTS[lvl];
    if (c.stones < cost) return { error: `灵石不足（需 ${cost.toLocaleString()}）` };
    c.stones -= cost;
    s.stats.goldSpent = (s.stats.goldSpent || 0) + cost;
    c.caveLevel = lvl + 1;
    const lines = advanceMonths(s, 3, this.rng);
    lines.push(`耗费 ${cost.toLocaleString()} 灵石重塑聚灵大阵，洞府晋升【${c.caveLevel}阶灵脉】（修炼增速 +${Math.round((c.caveLevel - 1) * 18)}%）。`);
    s.scene.result = {
      text: '数道灵石阵柱轰然嵌入洞府四壁，天地灵气倒灌成雾，静室如置仙家洞天。',
      lines,
      fx: 'breakthrough',
      returnTo: 'cave',
    };
    this.afterAction();
    this.emit();
  }

  act_feedPet() {
    const s = this.state;
    const c = s.char;
    const pet = PET_BY_ID[c.petId];
    if (!pet) return { error: '尚未契约伴生灵兽' };
    const lvl = c.petLevel || 1;
    if (lvl >= 5) return { error: '灵兽已到顶阶' };
    const cost = Math.round(600 * Math.pow(3.2, lvl - 1));
    // 审计修复：原先一颗内丹顶掉任意阶的灵石。改为：每进一阶需内丹 (阶数) 颗，再付灵石
    const needCores = lvl;
    const haveCores = itemCount(s, 'yaoshou_neidan');
    if (haveCores < needCores || c.stones < cost) {
      return { error: `进阶需妖兽内丹 ×${needCores}（有 ${haveCores}）与 ${cost.toLocaleString()} 灵石` };
    }
    removeItem(s, 'yaoshou_neidan', needCores);
    c.stones -= cost;
    s.stats.goldSpent = (s.stats.goldSpent || 0) + cost;
    const paid = `妖兽内丹 ×${needCores}、${cost.toLocaleString()} 灵石`;
    c.petLevel = lvl + 1;
    recomputeDerived(c);
    const lines = advanceMonths(s, 1, this.rng);
    lines.push(`消耗 ${paid}，伴生灵兽「${pet.name}」进阶至【${c.petLevel}阶】。全伴战特性显著增强。`);
    s.scene.result = {
      text: `${pet.name}吞下灵粹后周身宝光大盛，血脉枷锁轰然冲开一重，仰首清鸣。`,
      lines,
      fx: 'breakthrough',
      returnTo: 'cave',
    };
    this.afterAction();
    this.emit();
  }

  act_preach() {
    const s = this.state;
    const c = s.char;
    const lines = advanceMonths(s, 3, this.rng);
    const inc = 4 + c.realm * 2 + (s.flags.开宗立派 ? 4 : 0);
    s.counters.teach = (s.counters.teach || 0) + inc;
    c.attrs.道心 += 1;
    c.reputation += 10 + c.realm * 6;
    const lawLines = gainLawExp(s, 10 + c.realm * 4);
    lines.push(`开坛讲道三月，受众顿悟。讲道累计 +${inc}（总计 ${s.counters.teach}），道心 +1，声望 +${10 + c.realm * 6}。`, ...lawLines);
    s.scene.result = {
      text: '你于山门石阶前开坛论道，言及周天行气与大道本源，听讲的散修与凡俗弟子如痴如醉。',
      lines,
      returnTo: c.sectId === 'player_sect' && s.scene.id === 'sectHall' ? 'sectHall' : 'cave',
    };
    this.afterAction();
    this.emit();
  }

  act_recruitDisciple() {
    const s = this.state;
    const c = s.char;
    const lines = advanceMonths(s, 3, this.rng);
    // 审计修复：门徒无上限、岁贡线性无限涨。门下至多 (境界+1)×6 人
    const cap = (c.realm + 1) * 6;
    if ((s.counters.disciples || 0) >= cap) return { error: `以你${REALMS[c.realm]?.name}之境，门下至多 ${cap} 人` };
    const add = Math.min(cap - (s.counters.disciples || 0), (s.flags.开宗立派 || (c.sectRank || 0) >= 4) ? 2 : 1);
    s.counters.disciples = (s.counters.disciples || 0) + add;
    if (c.sectId === 'player_sect') c.playerSectDisciples = (c.playerSectDisciples || 0) + add;
    c.reputation += 8 * add;
    lines.push(`收下 ${add} 名良才美质入你门下（累计收徒 ${s.counters.disciples} 人），声望 +${8 * add}。`);
    s.scene.result = {
      text: '数名根骨不俗的少年跪拜奉茶。看着他们眼中的光，你恍惚看见了当年在青石镇河湾渡口的自己。',
      lines,
      returnTo: c.sectId === 'player_sect' && s.scene.id === 'sectHall' ? 'sectHall' : 'cave',
    };
    this.afterAction();
    this.emit();
  }

  /* ---------------- 支柱二：五域行走（严格秘境校验 / 距离耗时 / 首临奖励 / 满探索采撷） ---------------- */

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
        hint: `三月 · 遇人遇事 · 已走 ${prog}%`,
        action: 'regionExplore',
      },
      {
        id: 'region_delve',
        label: `下秘境 · ${DELVE_THEMES[region.id]?.name || '五层险地'}`,
        hint: '五层险地，越深越值钱',
        action: 'startDelve',
      },
      {
        id: 'region_hunt',
        label: '找妖物斗一场',
        hint: '两月 · 练手、得材料',
        action: 'regionHunt',
      },
      {
        id: 'region_secret',
        label: '寻访当地古迹',
        hint: '半年 · 当地特有的奇遇',
        action: 'secretRealm',
      },
    ];
    if (prog >= 100 && region.veinYield) {
      choices.push({
        id: 'region_vein',
        label: `灵脉采撷 · ${region.veinYield.label}`,
        hint: '半年 · 采当地灵材',
        action: 'regionVein',
      });
    }
    choices.push(
      { id: 'open_map', label: '远行他乡', hint: '去别的地方', action: 'openRegionMap' },
      { id: 'back_hub', label: '回主界', hint: '', action: 'backHub' },
    );
    return {
      id: 'regionHub',
      title: region.name,
      text: `${region.desc}\n\n出产：${region.specialty}　·　已走过 ${prog}%${prog >= 100 ? '（可采灵脉）' : ''}　·　凶险 ${'★'.repeat(region.danger)}`,
      choices,
      subhub: true,
    };
  }

  act_regionExplore(ch = {}) {
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
      lines.push(`【走遍${region.name}】此地已走遍，可以采灵脉了。获赠「${ITEM_BY_ID[rewardItem]?.name || rewardItem}」。`);
      this.pushRumor(`【风闻】${c.name}走遍了${region.name}。`);
    }

    // 剧本里的当地大事：闲逛时偶尔撞上
    if (this.rng.chance(0.15)) {
      const hev = localHistory(s, this.registry);
      if (hev) {
        const preface = beginHistoryEvent(s, hev);
        this.openScene(hev.id);
        if (preface) s.scene.preface = preface;
        this.afterAction();
        this.emit();
        return;
      }
    }
    // v8.1 万象因果遇事：按境界/气机姿态/出身/金手指动态演化打脸与博弈
    // 敛息藏锋招惹是非；威压外放则宵小不敢近身
    const fsChance = c.auraStance === 'hide' ? 0.36 : c.auraStance === 'show' ? 0.12 : 0.26;
    if (this.rng.chance(fsChance)) {
      startFaceSlapEncounter(this, { context: 'explore', returnTo: ch.params?.returnTo || 'regionHub', note: lines });
      this.afterAction();
      this.emit();
      return;
    }
    const ev = pickEvent(s, this.rng, this, this.rng.chance(0.7) ? 'wild' : 'world', region.id);
    const petExp = petBonuses(c).explore || 0;
    const freedomBonus = (sectPerks(c).freedom || 0) * 0.35;
    const evChance = clamp((c.rootId === 'kongjian' ? 0.85 : 0.68) + petExp + freedomBonus, 0.2, 0.96);
    if (ev && this.rng.chance(evChance)) {
      this.openEvent(ev);
      this.afterAction();
      this.emit();
      return;
    }

    if (this.rng.chance(c.auraStance === 'show' ? 0.22 : 0.45) && region.enemies?.length) {
      const eid = this.rng.pick(region.enemies);
      lines.push(`你在${region.name}深处撞见了盘踞此地的妖邪。`);
      return this.startCombat(eid, { lines });
    }
    const lootId = this.rng.pick(region.exploreRewards || ['lingcao']);
    const eraLoot = 1 + (currentWorldEra(s).combatLoot || 0);
    const stones = Math.round((30 + region.danger * 55) * Math.pow(REALMS[c.realm]?.powerMult || 1, 0.52) * eraLoot * (1 + freedomBonus));
    c.stones += stones;
    addItem(s, lootId, 1);
    lines.push(`搜山寻幽有所收获：灵石 +${stones.toLocaleString()}，${ITEM_BY_ID[lootId]?.name || lootId} ×1（探索度 ${c.regionProgress[region.id]}%）。`);
    s.scene.result = {
      text: `你沿${region.name}古道深入数十里，拨开荒草断碑，于隐蔽石隙间寻得前人遗物。`,
      lines,
      returnTo: ch.params?.returnTo || 'regionHub',
    };
    this.afterAction();
    this.emit();
  }

  /* ---------------- 五层秘境探幽（Roguelike 风险回报爬塔） ---------------- */

  act_startDelve() {
    const s = this.state;
    const c = s.char;
    const region = REGION_BY_ID[c.regionId] || REGION_BY_ID.qingniu;
    const theme = DELVE_THEMES[region.id] || DELVE_THEMES.qingniu;
    const lines = advanceMonths(s, 3, this.rng);
    s.delve = {
      regionId: region.id,
      name: theme.name,
      floor: 1,
      maxFloor: 5,
      haulStones: 0,
      haulExp: 0,
      haulLaw: 0,
      haulItems: [],
      log: [...lines, `踏入「${theme.name}」第一层，禁制森严，越深处重宝越多。`],
    };
    s.scene = { id: 'delve', result: null };
    this.afterAction();
    this.emit();
  }

  delveMultiplier(floor) {
    return [1.0, 1.4, 1.9, 2.6, 3.5][clamp((floor || 1) - 1, 0, 4)];
  }

  buildDelveNode() {
    const s = this.state;
    const c = s.char;
    const dv = s.delve;
    if (!dv) return this.buildRegionNode();
    const region = REGION_BY_ID[dv.regionId] || REGION_BY_ID.qingniu;
    const theme = DELVE_THEMES[region.id] || DELVE_THEMES.qingniu;
    const fName = theme.floors[dv.floor - 1] || `第${dv.floor}层`;
    const mult = this.delveMultiplier(dv.floor);
    const isBoss = dv.floor >= dv.maxFloor;
    const haulNames = dv.haulItems.length
      ? dv.haulItems.map((id) => ITEM_BY_ID[id]?.name || id).slice(-5).join('、')
      : '暂无';

    const choices = [];
    if (isBoss) {
      choices.push({
        id: 'delve_boss',
        label: '挑战守殿强敌 · 取最深处的秘藏',
        hint: '凶险 · 胜则收获最丰，还有当地珍稀之物；败则逃出，丢一半所得',
        action: 'delveStep',
        params: { kind: 'boss' },
        effect: 'primary',
      });
    } else {
      choices.push(
        {
          id: 'delve_fight',
          label: '击退守卫 · 取灵藏',
          hint: '斗法清障 · 胜则获丰厚灵石、奇珍并直入下一层',
          action: 'delveStep',
          params: { kind: 'fight' },
        },
        {
          id: 'delve_chest',
          label: '破解禁制 · 探暗格',
          hint: '神识/气运检定 · 成则斩获稀世灵材，败则触动禁制受创',
          action: 'delveStep',
          params: { kind: 'chest' },
        },
        {
          id: 'delve_stele',
          label: '参悟古碑 · 稳步深入',
          hint: '安全推进 · 积攒法则感悟与实战修为，并进入下一层',
          action: 'delveStep',
          params: { kind: 'stele' },
        },
      );
    }
    choices.push({
      id: 'delve_extract',
      label: dv.floor === 1 && !dv.haulStones && !dv.haulItems.length ? '退出秘境' : '见好就收 · 携宝撤离',
      hint: `稳妥带出全部未结算战利（灵石 ${dv.haulStones.toLocaleString()} · 奇珍 ${dv.haulItems.length} 件）`,
      action: 'delveExtract',
      effect: dv.haulItems.length >= 2 ? 'primary' : '',
    });

    return {
      id: 'delve',
      title: `${dv.name} · 第 ${dv.floor}/${dv.maxFloor} 层【${fName}】`,
      text: `地宫幽深，灵光与煞气交织。越往深处，收获越多。\n\n【身上带着（尚未带出）】灵石 ${dv.haulStones.toLocaleString()} · 修为 ${dv.haulExp.toLocaleString()} · 法则 +${dv.haulLaw} · 奇珍：${haulNames}\n\n${dv.log.slice(-4).join('\n')}`,
      choices,
      subhub: true,
    };
  }

  act_delveStep(ch) {
    const s = this.state;
    const c = s.char;
    const dv = s.delve;
    if (!dv) return this.act_openRegion();
    const kind = ch.params?.kind || 'stele';
    const region = REGION_BY_ID[dv.regionId] || REGION_BY_ID.qingniu;
    const mult = this.delveMultiplier(dv.floor);
    const eraDelve = 1 + (currentWorldEra(s).delveLoot || 0);
    const pm = REALMS[c.realm]?.powerMult || 1;
    const baseStones = Math.round((55 + region.danger * 70) * Math.pow(pm, 0.5) * mult * eraDelve);
    const baseExp = Math.round(monthlyExp(s) * (1.2 + dv.floor * 0.45) * eraDelve);
    const rewardPool = region.exploreRewards?.length ? region.exploreRewards : ['lingcao'];

    if (kind === 'fight' || kind === 'boss') {
      const enemies = region.enemies || ['wolf'];
      const eid = kind === 'boss'
        ? enemies[enemies.length - 1]
        : this.rng.pick(enemies.slice(Math.min(enemies.length - 1, Math.floor(dv.floor / 2))));
      const item = this.rng.pick(kind === 'boss' ? (region.veinYield?.items || rewardPool) : rewardPool);
      const stoneWin = kind === 'boss' ? Math.round(baseStones * 1.9) : baseStones;
      const expWin = kind === 'boss' ? Math.round(baseExp * 1.8) : baseExp;
      const lawWin = kind === 'boss' ? 32 + region.danger * 8 : 10 + dv.floor * 4;
      return this.startCombat({
        enemy: eid,
        win: {
          text: kind === 'boss'
            ? `镇殿强敌轰然倒地。秘境最深处的封印洞开，满殿奇珍灵石尽入你囊中。`
            : `斩灭守关妖邪。你搜刮秘室灵藏，沿石阶继续向第 ${dv.floor + 1} 层迈进。`,
          delveAdvance: { kind, stones: stoneWin, exp: expWin, law: lawWin, item },
          returnTo: kind === 'boss' ? 'regionHub' : 'delve',
          fx: kind === 'boss' ? 'breakthrough' : 'alchemy',
        },
        lose: {
          text: '秘境守卫煞威滔天。危急关头你捏碎逃生玉符破阵遁出——性命无忧，却遗落了半数未带出的秘境战利。',
          delveEscape: true,
          effects: { injury: 1 },
          returnTo: 'regionHub',
        },
      }, { lines: [`【${dv.name}·第${dv.floor}层】强敌现身拦路。`] });
    }

    if (kind === 'chest') {
      const p = clamp(0.46 + c.attrs.神识 * 0.008 + c.attrs.气运 * 0.008 + (c.goldenFingerId === 'gf_karma_mirror' ? 0.12 : 0), 0.25, 0.92);
      if (this.rng.chance(p)) {
        const item = this.rng.pick(rewardPool);
        const stones = Math.round(baseStones * 1.15);
        dv.haulStones += stones;
        dv.haulItems.push(item);
        dv.haulExp += Math.round(baseExp * 0.6);
        dv.floor = Math.min(dv.maxFloor, dv.floor + 1);
        dv.log.push(`破禁得手。暂存灵石 +${stones.toLocaleString()}、${ITEM_BY_ID[item]?.name || item} ×1，踏入第 ${dv.floor} 层。`);
        s.scene.result = {
          text: `你神识如丝拆解了三道古禁，暗格弹开，露出灵光湛湛的「${ITEM_BY_ID[item]?.name || item}」与满匣灵石。`,
          lines: [`暂存战利：灵石 +${stones.toLocaleString()}，${ITEM_BY_ID[item]?.name || item} ×1`, `已深入第 ${dv.floor}/${dv.maxFloor} 层`],
          fx: 'alchemy',
          returnTo: 'delve',
        };
      } else {
        const dmg = Math.max(1, Math.round(c.maxHp * 0.16));
        c.hp = Math.max(1, c.hp - dmg);
        c.injuries = (c.injuries || 0) + 1;
        dv.floor = Math.min(dv.maxFloor, dv.floor + 1);
        dv.log.push(`禁制反噬。气血 -${dmg}，你咬牙冲过暗道进入第 ${dv.floor} 层。`);
        s.scene.result = {
          text: '古禁突生变故，数道赤色阵雷炸裂。你仓促护体受了皮外伤，顺势跃入下一层石廊。',
          lines: [`气血 -${dmg}，伤势 +1`, `已深入第 ${dv.floor}/${dv.maxFloor} 层`],
          fx: 'combat_hit',
          returnTo: 'delve',
        };
      }
      this.afterAction();
      this.emit();
      return;
    }

    // kind === 'stele'
    // 审计修复：参悟原本不耗时，零风险刷修为。每层参悟耗时两个月（与闭关同口径对比，收益约 1.35 倍而非 2.8 倍）
    advanceMonths(s, 2, this.rng);
    const lawGain = 14 + dv.floor * 5 + region.danger * 3;
    dv.haulLaw += lawGain;
    dv.haulExp += Math.round(baseExp * 0.9);
    dv.haulStones += Math.round(baseStones * 0.45);
    dv.floor = Math.min(dv.maxFloor, dv.floor + 1);
    dv.log.push(`残碑悟道。暂存法则 +${lawGain}、修为 +${Math.round(baseExp * 0.9).toLocaleString()}，进入第 ${dv.floor} 层。`);
    s.scene.result = {
      text: '石壁残碑上留着前代大能的剑痕道韵。你驻足静观一炷香，受益匪浅，随后从容踏入更深处。',
      lines: [`暂存战利：法则感悟 +${lawGain}，修为 +${Math.round(baseExp * 0.9).toLocaleString()}`, `已深入第 ${dv.floor}/${dv.maxFloor} 层`],
      returnTo: 'delve',
    };
    this.afterAction();
    this.emit();
  }

  bankDelveHaul(ratio = 1, clearedAll = false) {
    const s = this.state;
    const c = s.char;
    const dv = s.delve;
    if (!dv) return [];
    const lines = [];
    const stones = Math.round(dv.haulStones * ratio);
    const exp = Math.round(dv.haulExp * ratio);
    const law = Math.round(dv.haulLaw * ratio);
    if (stones > 0) { c.stones += stones; lines.push(`带出灵石 +${stones.toLocaleString()}`); }
    if (exp > 0) { const got = gainExp(s, exp); if (got) lines.push(`沉淀修为 +${got.toLocaleString()}`); }
    if (law > 0) lines.push(...gainLawExp(s, law));
    const keepCount = Math.ceil(dv.haulItems.length * ratio);
    const kept = dv.haulItems.slice(0, keepCount);
    for (const id of kept) {
      addItem(s, id, 1);
      lines.push(`收入储物袋：${ITEM_BY_ID[id]?.name || id} ×1`);
    }
    if (clearedAll) {
      s.counters.delves = (s.counters.delves || 0) + 1;
      s.counters.secrets = (s.counters.secrets || 0) + 1;
      c.reputation += 25 + (REGION_BY_ID[dv.regionId]?.danger || 1) * 10;
      lines.push(`【五层秘境通关】累计通关 ${s.counters.delves} 次，声望大涨。`);
      this.pushRumor(`【秘境】「${c.name}」走完了「${dv.name}」五层。`);
    }
    s.delve = null;
    return lines;
  }

  act_delveExtract() {
    const s = this.state;
    const dv = s.delve;
    if (!dv) return this.act_openRegion();
    const name = dv.name;
    const floor = dv.floor;
    const lines = this.bankDelveHaul(1, false);
    s.scene = {
      id: 'regionHub',
      result: {
        text: lines.length
          ? `你见好就收，于「${name}」第 ${floor} 层激发传送玉符安然退回地面，所有战利分毫不失。`
          : `你审时度势，退出了「${name}」。`,
        lines,
        fx: lines.length ? 'alchemy' : null,
        returnTo: 'regionHub',
      },
    };
    this.afterAction();
    this.emit();
  }

  act_regionVein() {
    const s = this.state;
    const c = s.char;
    const region = REGION_BY_ID[c.regionId] || REGION_BY_ID.qingniu;
    if ((c.regionProgress?.[region.id] || 0) < 100 || !region.veinYield) return { error: '须探索度满 100% 方可采撷' };
    const lines = advanceMonths(s, 6, this.rng);
    const vy = region.veinYield;
    const eraVein = currentWorldEra(s).veinMult || 1;
    const item = this.rng.pick(vy.items || region.exploreRewards || ['lingcao']);
    // 审计修复：原按「当前层所需修为」的百分比给，高境界时是闭关的上百倍。改为与闭关同口径：六个月月修为 × 灵眼倍率
    const veinMult = Math.min(1.6, 1 + (vy.expPct || 0.08) * 3);
    const gotExp = gainExp(s, Math.round(monthlyExp(s) * 6 * veinMult * eraVein));
    const gotStones = Math.round((vy.stones || 100) * eraVein);
    c.stones += gotStones;
    addItem(s, item, 1);
    lines.push(`【${vy.label}】灵石 +${gotStones.toLocaleString()}，修为 +${gotExp.toLocaleString()}，采得「${ITEM_BY_ID[item]?.name || item}」×1。`);
    s.scene.result = {
      text: `你熟门熟路潜入${region.name}核心灵眼，趁潮汐吐纳之机采撷灵粹，满载而归。`,
      lines,
      fx: 'alchemy',
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
    lines.push(`你在${region.name}循着妖气追出十里，迎面撞上强敌。`);
    return this.startCombat(eid, { lines });
  }

  act_openRegionMap() {
    this.state.scene = { id: 'regionMap', result: null };
    this.emit();
  }

  travelMonthsTo(targetRegion) {
    const c = this.state.char;
    const cur = REGION_BY_ID[c.regionId] || REGION_BY_ID.qingniu;
    const dist = Math.max(1, Math.abs((targetRegion.distIndex ?? 0) - (cur.distIndex ?? 0)));
    let months = Math.min(12, Math.max(3, dist * 3));
    if (c.rootId === 'kongjian') months = Math.max(2, Math.round(months * 0.5));
    else if (c.rootId === 'feng') months = Math.max(2, Math.round(months * 0.7));
    if (sectPerks(c).freedom) months = Math.max(2, months - 1);
    return months;
  }

  buildRegionMapNode() {
    const s = this.state;
    const c = s.char;
    const choices = REGIONS.map((r) => {
      const unlocked = c.realm >= r.minRealm;
      const isHere = c.regionId === r.id;
      const prog = Math.min(100, Math.round(c.regionProgress?.[r.id] || 0));
      const reqName = REALMS[r.minRealm]?.name || '炼气';
      const months = this.travelMonthsTo(r);
      const isNew = !(c.visitedLocations || []).includes(r.name);
      return {
        id: `goto_${r.id}`,
        label: `${r.name}${isHere ? '（当前）' : ''} · ${prog}%${isNew && unlocked ? ' [新]' : ''}`,
        hint: unlocked ? `${months}月 · ${r.specialty}` : `需达「${reqName}境」方可踏足`,
        action: 'gotoRegion',
        params: { regionId: r.id, months },
        disabled: !unlocked || isHere,
        reason: isHere ? '已在此地' : `需${reqName}境`,
      };
    });
    choices.push({ id: 'back_region', label: '返回', hint: '回五域行走', action: 'openRegion' });
    return {
      id: 'regionMap',
      title: '远行他乡',
      text: `五域辽阔，远行耗时随路程增减（初到一地可得当地见闻）。\n\n当前所在：${c.location} | 已踏足 ${(c.visitedLocations || []).length}/8 地`,
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
    const months = ch.params?.months || this.travelMonthsTo(region);
    const lines = advanceMonths(s, months, this.rng);
    c.regionId = region.id;
    c.location = region.name;
    c.stayRegionMonths = 0; // 换州重置同地驻留计数
    c.regionProgress = c.regionProgress || {};
    if (c.regionProgress[region.id] == null) c.regionProgress[region.id] = 0;
    c.visitedLocations = c.visitedLocations || ['青石镇'];
    const isFirst = !c.visitedLocations.includes(region.name);
    if (isFirst) {
      c.visitedLocations.push(region.name);
      const firstGift = region.exploreRewards?.[0] || 'lingcao';
      addItem(s, firstGift, 1);
      c.attrs.悟性 += 1;
      c.reputation += 10 + region.danger * 6;
      lines.push(`【初到${region.name}】眼界大开。悟性 +1，声望 +${10 + region.danger * 6}，获特产「${ITEM_BY_ID[firstGift]?.name || firstGift}」×1。`);
    }
    lines.push(`跋涉${months}月，抵达「${region.name}」。`);
    if (isFirst && c.goldenFingerId === 'gf_signin') {
      const bonusStones = 240 + region.danger * 220;
      c.stones += bonusStones;
      lines.push(`【${GOLDEN_FINGER_BY_ID.gf_signin?.name || '机缘'}】初到此地：灵石 +${bonusStones.toLocaleString()}。`);
      this.pushRumor(`【五域风闻】「${c.name}」初入${region.name}，当地人多了一桩谈资。`);
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

  /* ---------------- 支柱三：仙门大殿（境界礼聘 / 两年刷新限量任务板 / 真开宗立派 / 叛门黑名单） ---------------- */

  act_openSectHall() {
    if (!this.state.char.sectId) return this.act_sectRecruit();
    this.state.scene = { id: 'sectHall', result: null };
    this.emit();
  }

  buildSectHallNode() {
    const s = this.state;
    const c = s.char;
    if (!c.sectId) return this.buildRecruitNode();
    if (c.sectId === 'player_sect') return this.buildPlayerSectHallNode();
    const sect = SECT_BY_ID[c.sectId];
    if (!sect) return this.buildRecruitNode();
    const rankIdx = c.sectRank || 0;
        const nextTrial = SECT_PROMOTION_TRIALS.find((t) => t.fromRank === rankIdx);
    const veinCost = 80 + rankIdx * 50;
    const choices = [
      { id: 'sect_missions', label: '差事榜', hint: '每两年换一批差事', action: 'openSectMissions' },
      { id: 'sect_library', label: '藏经阁', hint: '用贡献换本门功法', action: 'openSectLibrary' },
      { id: 'sect_treasury', label: '宝库', hint: '用贡献换破境丹药、灵材与法器', action: 'openSectTreasury' },
      {
        id: 'sect_vein',
        label: '灵脉聚灵阵',
        hint: `一年 · 耗 ${veinCost} 贡献，借门中灵脉加快修炼与参悟`,
        action: 'sectVein',
        disabled: c.contribution < veinCost,
        reason: `需 ${veinCost} 贡献`,
      },
      {
        id: 'sect_promote',
        label: nextTrial ? `晋升考核 · ${sectRankName(c.sectId, nextTrial.toRank)}` : '已到最高职阶',
        hint: nextTrial ? `需${REALMS[nextTrial.minRealm]?.name}、${nextTrial.contribution} 贡献（升职后扣一半）` : `你已是${sectRankName(c.sectId, rankIdx)}`,
        action: 'openSectPromote',
        disabled: !nextTrial,
        reason: '已至最高职阶',
      },
      {
        id: 'sect_leave',
        label: c.sectId === 'sanxiu' ? '不再做散修' : '脱离门户',
        hint: c.sectId === 'sanxiu'
          ? '散修来去自由，可另投门户，没有惩罚'
          : '原门户永不再收，五年内别处也不收，声望大跌',
        action: 'sectLeave',
      },
      { id: 'back_hub', label: '离开', hint: '返回主界面', action: 'backHub' },
    ];
    return {
      id: 'sectHall',
      title: `${sect.name} · ${sect.seat}`,
      text: `${sect.desc}\n\n当前身份：${sectRankName(c.sectId, rankIdx)}（第 ${rankIdx + 1}/${SECT_RANKS.length} 级）\n贡献：${c.contribution.toLocaleString()}　·　本门传承：${sect.technique}`,
      choices,
      subhub: true,
    };
  }

  buildPlayerSectHallNode() {
    const s = this.state;
    const c = s.char;
    const name = c.playerSectName || `${c.name}道宗`;
    const lvl = c.playerSectLevel || 1;
    const upCost = Math.round(15000 * Math.pow(3.5, lvl - 1));
    const choices = [
      {
        id: 'psect_upgrade',
        label: lvl >= 5 ? '门户（已到五阶）' : `扩建门户（${lvl}→${lvl + 1}阶）`,
        hint: lvl >= 5 ? '已到顶阶' : `耗 ${upCost.toLocaleString()} 灵石 · 提升弟子月贡与聚灵阵威能`,
        action: 'upgradePlayerSect',
        disabled: lvl >= 5 || c.stones < upCost,
        reason: lvl >= 5 ? '已到顶阶' : `需 ${upCost.toLocaleString()} 灵石`,
      },
      { id: 'psect_recruit', label: '开山广收门徒', hint: `三月 · 招收良才（当前门徒 ${s.counters.disciples || 0} 人）`, action: 'recruitDisciple' },
      { id: 'psect_preach', label: '大殿开坛讲道', hint: `三月 · 传道授业（累计 ${s.counters.teach || 0} 次），增道心与声望`, action: 'preach' },
      { id: 'psect_tribute', label: '收取门人岁贡', hint: `半年 · 按山门阶位与门徒数收取灵石与灵草`, action: 'collectTribute' },
      { id: 'sect_library', label: '藏经阁', hint: '参悟散修秘典与自藏功法', action: 'openSectLibrary' },
      { id: 'sect_treasury', label: '宝库', hint: '用门户积蓄换丹药灵材', action: 'openSectTreasury' },
      { id: 'back_hub', label: '步出祖师殿', hint: '返回主界面', action: 'backHub' },
    ];
    return {
      id: 'sectHall',
      title: `${name} · 祖师大殿（${lvl}阶）`,
      text: `${PLAYER_SECT_TEMPLATE.desc}\n\n当前身份：开山祖师（${lvl}阶山门 · 门徒 ${s.counters.disciples || 0} 人）\n门户积蓄：${c.contribution.toLocaleString()}　·　灵石：${c.stones.toLocaleString()}`,
      choices,
      subhub: true,
    };
  }

  act_upgradePlayerSect() {
    const s = this.state;
    const c = s.char;
    const lvl = c.playerSectLevel || 1;
    if (lvl >= 5) return { error: '门户已到五阶' };
    const cost = Math.round(15000 * Math.pow(3.5, lvl - 1));
    if (c.stones < cost) return { error: `灵石不足（需 ${cost.toLocaleString()}）` };
    c.stones -= cost;
    s.stats.goldSpent = (s.stats.goldSpent || 0) + cost;
    c.playerSectLevel = lvl + 1;
    c.reputation += 80 * c.playerSectLevel;
    const lines = advanceMonths(s, 3, this.rng);
    lines.push(`耗费 ${cost.toLocaleString()} 灵石扩建灵峰大阵，${this.currentSectName()}升为 ${c.playerSectLevel} 阶，声望 +${80 * c.playerSectLevel}。`);
    s.scene.result = { text: '护山大阵重新布过，各地散修慕名来投。', lines, fx: 'breakthrough', returnTo: 'sectHall' };
    this.afterAction();
    this.emit();
  }

  act_collectTribute() {
    const s = this.state;
    const c = s.char;
    const lines = advanceMonths(s, 6, this.rng);
    const lvl = c.playerSectLevel || 1;
    const disc = Math.max(1, s.counters.disciples || 1);
    const stones = Math.round((250 + disc * 120) * lvl * Math.pow(REALMS[c.realm]?.powerMult || 1, 0.35));
    const contrib = 120 * lvl + disc * 25;
    c.stones += stones;
    c.contribution += contrib;
    addItem(s, c.realm >= 2 ? 'qiannian_lingcao' : 'lingcao', 1);
    lines.push(`门下弟子呈上岁贡：灵石 +${stones.toLocaleString()}，门户积蓄 +${contrib}，灵草 ×1。`);
    s.scene.result = { text: '诸堂执事依次呈上灵脉账簿与药园收成，山门运转井井有条。', lines, returnTo: 'sectHall' };
    this.afterAction();
    this.emit();
  }

  ensureSectBoard() {
    const s = this.state;
    const c = s.char;
    const key = c.sectId === 'player_sect' ? 'sanxiu' : c.sectId;
    const list = SECT_MISSIONS[key] || SECT_MISSIONS.sanxiu;
    if (s.sectBoard && s.sectBoard.sectId === key && c.age < s.sectBoard.refreshAt) {
      return s.sectBoard;
    }
    // 筛选当前职阶/境界可达的任务；确保至少有 1 项可执行悬赏，避免炼气新人整榜全锁
    // 审计修复：做过的任务按工期四倍冷却，冷却中的不上榜（原先长任务做完新榜已出，顶档可连着接）
    const cooling = (m) => (s.flags[`任务冷却:${m.id}`] || 0) > c.age;
    const eligible = list.filter((m) => (c.sectRank || 0) >= m.minRank && c.realm >= m.minRealm && !cooling(m));
    const lowFallback = [...list].filter((m) => !cooling(m)).sort((a, b) => (a.minRealm - b.minRealm) || (a.minRank - b.minRank));
    let picked = [];
    if (eligible.length >= 3) {
      picked = [...eligible].sort(() => this.rng.next() - 0.5).slice(0, 3);
    } else if (eligible.length > 0) {
      const rest = lowFallback.filter((m) => !eligible.some((e) => e.id === m.id)).sort(() => this.rng.next() - 0.5);
      picked = [...eligible, ...rest].slice(0, 3);
    } else {
      picked = lowFallback.slice(0, 3);
    }
    s.sectBoard = {
      sectId: key,
      refreshAt: c.age + 36,
      slots: picked.map((m) => ({ missionId: m.id, done: false })),
    };
    return s.sectBoard;
  }

  act_openSectMissions() {
    this.ensureSectBoard();
    this.state.scene = { id: 'sectMissions', result: null };
    this.emit();
  }

  buildSectMissionsNode() {
    const s = this.state;
    const c = s.char;
    const board = this.ensureSectBoard();
    const key = c.sectId === 'player_sect' ? 'sanxiu' : c.sectId;
    const list = SECT_MISSIONS[key] || SECT_MISSIONS.sanxiu;
    const remainM = Math.max(1, board.refreshAt - c.age);
    const choices = board.slots.map((slot) => {
      const m = list.find((x) => x.id === slot.missionId);
      if (!m) return null;
      const okRank = (c.sectRank || 0) >= m.minRank;
      const okRealm = c.realm >= m.minRealm;
      const reqRank = sectRankName(c.sectId, m.minRank);
      const reqRealm = REALMS[m.minRealm]?.name || '炼气';
      return {
        id: `m_${m.id}`,
        label: `${slot.done ? '【已交割】' : `【${m.tier}】`}${m.title}`,
        hint: slot.done
          ? `本期已完成，待 ${remainM} 月后换榜`
          : okRank && okRealm
            ? `${m.months}月 · 贡献 +${m.contribution} · 灵石 +${m.stones}${m.enemy ? ' · 含斗法' : ''}`
            : `需${reqRank}且达${reqRealm}境`,
        action: 'runSectMission',
        params: { missionId: m.id },
        disabled: slot.done || !(okRank && okRealm),
        reason: slot.done ? '本期已完成' : !okRank ? `需${reqRank}` : `需${reqRealm}境`,
      };
    }).filter(Boolean);
    choices.push({ id: 'sect_daily', label: '日常差事', hint: '三月 · 稳妥攒贡献，不用斗法', action: 'sectTask', params: { returnTo: 'sectMissions' } });
    choices.push({ id: 'back_sect', label: '返回大殿', hint: '', action: 'openSectHall' });
    return {
      id: 'sectMissions',
      title: `${this.currentSectName()} · 差事榜`,
      text: `每两年换三件差事（距下次还有 ${remainM} 个月），每件只能做一次。\n\n累计完成差事：${s.counters.sect_missions_done || 0} 次`,
      choices,
      subhub: true,
    };
  }

  act_runSectMission(ch) {
    const s = this.state;
    const c = s.char;
    const board = this.ensureSectBoard();
    const key = c.sectId === 'player_sect' ? 'sanxiu' : c.sectId;
    const list = SECT_MISSIONS[key] || SECT_MISSIONS.sanxiu;
    const m = list.find((x) => x.id === ch.params?.missionId);
    const slot = board.slots.find((x) => x.missionId === ch.params?.missionId);
    if (!m || slot?.done) return { error: '该榜文已销榜' };
    const totalM = m.months || 3;
    const expGain = Math.round(monthlyExp(s) * totalM * 0.55);
    if (m.enemy) {
      // 战斗任务：先扣一半筹备耗时，战败不再白扣全额耗时
      const prepM = Math.max(1, Math.floor(totalM / 2));
      const remainM = totalM - prepM;
      const lines = advanceMonths(s, prepM, this.rng);
      lines.push(`接下「${m.title}」（筹备${prepM}月）：${m.desc}`);
      return this.startCombat({
        enemy: m.enemy,
        win: {
          text: `差事办完了。「${m.title}」已经交差，记下一笔功劳。`,
          missionId: m.id,
          missionMonths: totalM,
          remainMonths: remainM,
          effects: {
            contribution: m.contribution,
            stones: m.stones,
            reputation: m.reputation || 0,
            exp: expGain,
          },
          returnTo: 'sectMissions',
          log: `差事·${m.title}`,
        },
        lose: {
          text: '强敌难挡，你及时抽身退回（只耗了准备的时日），这件差事仍挂在榜上。',
          effects: { hp: Math.max(10, Math.round(c.maxHp * 0.25)), injury: 1 },
          returnTo: 'sectHall',
        },
      }, { lines });
    }
    const lines = advanceMonths(s, totalM, this.rng);
    if (slot) slot.done = true;
    s.flags[`任务冷却:${m.id}`] = c.age + Math.max(12, totalM * 4);
    s.counters.sect_missions_done = (s.counters.sect_missions_done || 0) + 1;
    c.contribution += m.contribution;
    c.stones += m.stones;
    c.reputation += (m.reputation || 0);
    const got = gainExp(s, expGain);
    lines.push(`${m.desc}\n任务圆满：贡献 +${m.contribution}，灵石 +${m.stones}，修为 +${got.toLocaleString()}。`);
    const ev = pickEvent(s, this.rng, this, 'sect');
    if (ev && this.rng.chance(0.32)) {
      this.openEvent(ev);
      this.afterAction();
      this.emit();
      return;
    }
    s.scene.result = { text: `你办妥了「${m.title}」，回去交了差。`, lines, returnTo: 'sectMissions' };
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
    const key = c.sectId === 'player_sect' ? 'sanxiu' : c.sectId;
    const manuals = SECT_LIBRARIES[key] || SECT_LIBRARIES.sanxiu;
    const choices = manuals.map((m) => {
      const learned = c.techniques.some((t) => t.id === m.id);
      const okRank = (c.sectRank || 0) >= m.minRank;
      const okCost = c.contribution >= m.cost;
      const reqRank = sectRankName(c.sectId, m.minRank);
      const stats = `${m.grade || '玄'}品·${m.align || '中'} · 修炼+${Math.round(m.speed * 100)}% 攻+${Math.round(m.atk * 100)}% · 「${m.artName}」`;
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
      title: `${this.currentSectName()} · 藏经阁`,
      text: `楼阁六重，玉简流光。学会后到洞府「功法」里选用（最多同时用 ${maxTechSlots(c.realm)} 部）。\n\n当前职阶：${sectRankName(c.sectId, c.sectRank || 0)}　·　可用贡献：${c.contribution.toLocaleString()}`,
      choices,
      subhub: true,
    };
  }

  act_buySectManual(ch) {
    const s = this.state;
    const c = s.char;
    const key = c.sectId === 'player_sect' ? 'sanxiu' : c.sectId;
    const manuals = SECT_LIBRARIES[key] || SECT_LIBRARIES.sanxiu;
    const m = manuals.find((x) => x.id === ch.params?.manualId);
    if (!m) return;
    if (c.techniques.some((t) => t.id === m.id)) return { error: '已参悟此典' };
    if ((c.sectRank || 0) < m.minRank) return { error: `职阶不足（需${sectRankName(c.sectId, m.minRank)}）` };
    if (c.contribution < m.cost) return { error: `贡献不足（需 ${m.cost}）` };
    c.contribution -= m.cost;
    s.stats.contribSpent = (s.stats.contribSpent || 0) + m.cost;
    const techObj = {
      id: m.id, name: m.name, speed: m.speed, atk: m.atk, def: m.def,
      lifespan: m.lifespan, lawId: m.lawId, artName: m.artName, grade: m.grade, align: m.align, sectId: key,
    };
    c.techniques.push(techObj);
    const equipped = this.autoEquipIfSpace(techObj);
    const lawLines = m.lawId ? gainLawExp(s, 45 + m.minRank * 25, m.lawId) : [];
    recomputeDerived(c);
    if (manuals.every((x) => c.techniques.some((t) => t.id === x.id))) {
      s.flags['读遍藏经阁'] = true;
    }
    this.pushLog(`藏经阁参悟${m.name}`);
    s.scene.result = {
      text: `你将${m.name}玉简贴于眉心，万千道纹如星河灌顶，领悟绝学「${m.artName}」。\n\n${m.desc}`,
      lines: [
        `消耗贡献 ${m.cost}，习得 ${m.name}${equipped ? '（已自动选用）' : '（可到洞府「功法」里选用）'}`,
        ...lawLines,
      ],
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
    const key = c.sectId === 'player_sect' ? 'sanxiu' : c.sectId;
    const items = SECT_TREASURY[key] || SECT_TREASURY.sanxiu;
    const choices = items.map((entry, idx) => {
      const def = ITEM_BY_ID[entry.itemId];
      const okRank = (c.sectRank || 0) >= entry.minRank;
      const okCost = c.contribution >= entry.cost;
      const reqRank = sectRankName(c.sectId, entry.minRank);
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
      title: `${this.currentSectName()} · 宝库`,
      text: `宝库禁制森严，凭本门腰牌和贡献才能换取破境丹药与灵材。\n\n当前职阶：${sectRankName(c.sectId, c.sectRank || 0)}　·　可用贡献：${c.contribution.toLocaleString()}`,
      choices,
      subhub: true,
    };
  }

  act_buySectTreasury(ch) {
    const s = this.state;
    const c = s.char;
    const key = c.sectId === 'player_sect' ? 'sanxiu' : c.sectId;
    const items = SECT_TREASURY[key] || SECT_TREASURY.sanxiu;
    const entry = items[ch.params?.idx];
    if (!entry) return;
    if ((c.sectRank || 0) < entry.minRank) return { error: '职阶不足' };
    if (c.contribution < entry.cost) return { error: '贡献不足' };
    c.contribution -= entry.cost;
    s.stats.contribSpent = (s.stats.contribSpent || 0) + entry.cost;
    const line = addItem(s, entry.itemId, 1);
    s.scene.result = {
      text: '管事记下你用掉的贡献，从架上取下东西交到你手中。',
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
    s.stats.contribSpent = (s.stats.contribSpent || 0) + cost;
    s.counters.night_cultivate = (s.counters.night_cultivate || 0) + 4;
    const lines = advanceMonths(s, 12, this.rng);
    const mult = 1.5 + rankIdx * 0.22;
    const got = gainExp(s, Math.round(monthlyExp(s) * 12 * mult));
    const lawLines = gainLawExp(s, 22 + rankIdx * 12);
    lines.push(`聚灵大阵全开一年：修为 +${got.toLocaleString()}`, ...lawLines);
    s.scene.result = {
      text: '门中灵脉全力运转，灵气浓如白雾，修炼事半功倍。',
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
    const payCost = Math.round(trial.contribution * 0.5);
    const flavor = trial.sectFlavor?.[c.sectId] || trial.desc;
    return {
      id: 'sectPromote',
      title: `晋升考核 · ${sectRankName(c.sectId, trial.toRank)}`,
      text: `${trial.desc}\n\n【本门考核】${flavor}\n\n考核条件：${REALMS[trial.minRealm]?.name}境 · 贡献 ≥ ${trial.contribution}（胜出后扣 ${payCost}）${Object.entries(trial.minAttrs || {}).map(([k, v]) => ` · ${k} ≥ ${v}`).join('')}${missing.length ? `\n\n尚欠条件：${missing.join('；')}` : '\n\n条件已齐，可以登台应考。'}`,
      choices: [
        {
          id: 'start_promote',
          label: `登台应考 · ${sectRankName(c.sectId, trial.toRank)}`,
          hint: missing.length ? missing[0] : `胜出后扣 ${payCost} 贡献，升任新职`,
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
    const payCost = Math.round(trial.contribution * 0.5);
    return this.startCombat({
      enemy: trial.enemy,
      win: {
        text: `钟鸣三响。你胜过考官，正式升为「${this.currentSectName()} · ${sectRankName(c.sectId, trial.toRank)}」。`,
        promoteRank: trial.toRank,
        promoteCost: payCost,
        effects: { reputation: 40 + trial.toRank * 30, attrs: { 道心: 3 } },
        returnTo: 'sectHall',
        fx: 'breakthrough',
        log: `晋升${sectRankName(c.sectId, trial.toRank)}`,
      },
      lose: {
        text: '你未能接住考官杀招，拱手认负退下擂台。长老淡声道：「回去再磨三年罢。」',
        effects: { hp: Math.max(10, Math.round(c.maxHp * 0.35)) },
        returnTo: 'sectHall',
      },
    }, { lines: [`【晋升考核】${flavor}`] });
  }

  act_sectLeave() {
    const s = this.state;
    const c = s.char;
    const oldId = c.sectId;
    if (!oldId || oldId === 'player_sect') return;
    if (oldId === 'sanxiu') {
      c.sectId = null;
      c.sectRank = 0;
      c.contribution = 0;
      s.sectBoard = null;
      // 审计修复：辞别再重入可无限重抽任务榜、叠入门效果。散修辞别后一年内不能再入任何门户
      c.sectLeaveUntil = c.age + 12;
      recomputeDerived(c);
      s.scene.result = {
        text: '你与散修同道作别。一年之后，再择门户不迟。',
        lines: ['已辞别散修（一年内不可再入门户）'],
        returnTo: 'hub',
      };
      this.afterAction();
      this.emit();
      return;
    }
    const oldName = SECT_BY_ID[oldId]?.name || '原门户';
    c.sectBlacklist = c.sectBlacklist || {};
    c.sectBlacklist[oldId] = true;
    c.betrayCount = (c.betrayCount || 0) + 1;
    c.sectLeaveUntil = c.age + 60; // 5 年冷却
    const repLoss = 100 * c.betrayCount;
    const karmaLoss = 40 * c.betrayCount;
    // 卸下原宗未达真传的秘传功法，防止 activeTechniques 自动重新装回原宗功法
    c.equippedTechs = (c.equippedTechs || []).filter((tid) => {
      const t = c.techniques.find((x) => x.id === tid);
      return !(t && t.sectId === oldId);
    });
    if (c.equippedTechs.length === 0) {
      const nonSect = c.techniques.filter((t) => t.sectId !== oldId).slice(0, maxTechSlots(c.realm));
      c.equippedTechs = nonSect.map((t) => t.id);
      if (c.equippedTechs.length === 0) c._manualUnequip = true;
    }
    c.sectId = null;
    c.sectRank = 0;
    c.contribution = 0;
    c.reputation -= repLoss;
    c.karma -= karmaLoss;
    s.sectBoard = null;
    s.flags['临阵脱逃'] = true;
    recomputeDerived(c);
    this.pushRumor(`【门户除名】「${c.name}」叛离${oldName}，被除名。`);
    s.scene.result = {
      text: `你交还了${oldName}的腰牌，转身离去。\n\n${oldName}将你除名，永不再收；五年之内，别的门户也不会收你。`,
      lines: [`${oldName}永不再收`, `五年内不能投身任何门户`, `声望 -${repLoss}，业力 -${karmaLoss}，贡献清零`],
      returnTo: 'hub',
    };
    this.afterAction();
    this.emit();
  }

  /* ---------------- 支柱四：市集坊间、十年拍卖、书肆残卷、问道擂台与天机阁 ---------------- */

  act_openCity() {
    this.state.scene = { id: 'cityHub', result: null };
    this.emit();
  }

  /** v8.1：坊间走动，触发酒楼/摊位/丹坊/拍卖等网文打脸遇事。 */
  act_cityEncounter(ch = {}) {
    const s = this.state;
    const lines = advanceMonths(s, 2, this.rng);
    startFaceSlapEncounter(this, { context: 'city', returnTo: ch.params?.returnTo || 'cityHub', note: lines });
    this.afterAction();
    this.emit();
  }

  /** v8.2：坊间盛会（赌石鉴宝 / 丹器斗法 / 天骄茶会）。 */
  act_openFair() {
    this.state.scene = { id: 'fairHub', result: null };
    this.emit();
  }

  act_fairPlay(ch = {}) {
    return resolveFairPlay(this, ch.params || {});
  }

  /** v8.2：恩怨簿（查看未报旧怨并主动登门清算 + 查看六大靠山威慑）。 */
  act_openGrudgeBook() {
    this.state.scene = { id: 'grudgeBook', result: null };
    this.emit();
  }

  act_grudgeRevenge(ch = {}) {
    const s = this.state;
    const gid = ch.params?.grudgeId;
    if (!gid) return this.act_openGrudgeBook();
    const lines = advanceMonths(s, 1, this.rng);
    const fs = startGrudgeRevenge(this, gid, { returnTo: 'grudgeBook', note: lines });
    if (!fs) return this.act_openGrudgeBook();
    this.afterAction();
    this.emit();
  }

  /** v8.1：动态遇事（万象打脸引擎）策略结算入口。 */
  act_faceSlapResolve(ch = {}) {
    return resolveFaceSlapChoice(this, ch.params?.tactic || 'walk');
  }

  /** v8.1：切换气机姿态（敛息藏锋 / 顺其自然 / 威压外放），零时间损耗。 */
  act_cycleAuraStance(ch = {}) {
    const s = this.state;
    const c = s.char;
    const order = ['hide', 'normal', 'show'];
    const cur = c.auraStance || 'normal';
    const next = (ch.params?.stance && order.includes(ch.params.stance))
      ? ch.params.stance
      : order[(order.indexOf(cur) + 1) % order.length];
    c.auraStance = next;
    const info = AURA_STANCES[next] || AURA_STANCES.normal;
    if (ch.params?.silent) {
      this.emit();
      return info;
    }
    const detail = next === 'hide'
      ? `你运起敛息之法，将真实修为深藏于丹田。此刻在外人眼中，你只显露「${perceivedRealmLabel(c)}」的气机——更容易引来不长眼之辈主动挑衅，正合扮猪吃虎。`
      : next === 'show'
        ? `你不再收敛周身灵压，${realmLabel(c)}的气机透体而出。低阶宵小多半不敢轻犯，但也更容易引来同阶天骄与护短长老试探锋芒。`
        : `你收起刻意造作，气机顺其自然，如实显露「${realmLabel(c)}」之境。`;
    s.scene.result = {
      text: detail,
      lines: [`气机姿态已切换为【${info.name}】`],
      returnTo: s.scene.id === 'cave' ? 'cave' : null,
    };
    this.emit();
    return info;
  }

  buildCityNode() {
    const s = this.state;
    const c = s.char;
    const region = REGION_BY_ID[c.regionId] || REGION_BY_ID.qingniu;
    const nextAuc = s.auctionRound?.nextAt || 0;
    const aucOpen = !s.auctionRound || c.age >= nextAuc || (s.auctionRound.lots || []).some((l) => !l.sold);
    const aucHint = aucOpen
      ? '十年一次，四件拍品'
      : `下一次还需 ${Math.max(1, Math.ceil((nextAuc - c.age) / 12))} 年`;
    const pendingGrudges = (s.grudges || []).filter((g) => g.status === 'owe').length;
    return {
      id: 'cityHub',
      title: `${region.name} · 市集坊间`,
      text: `长街灯火通明，商行、书肆、商会拍卖、坊间盛会与擂台都在这里。\n\n身上灵石：${c.stones.toLocaleString()}　·　各地货色不同。`,
      choices: [
        { id: 'city_market', label: `${region.name}商行`, hint: '一月 · 买卖当地特产、丹药与灵材', action: 'market' },
        { id: 'city_stroll', label: '坊间走动 · 听风遇事', hint: '两月 · 酒楼/摊位/丹坊/拍卖风云，撞见不长眼之辈', action: 'cityEncounter', effect: 'primary' },
        { id: 'city_fair', label: '坊间盛会 · 赌石 / 斗丹 / 茶会', hint: '一月 · 每年可登台一回，凭真本事与眼光打脸夺彩', action: 'openFair' },
        { id: 'city_grudge', label: pendingGrudges ? `恩怨簿（待报 ${pendingGrudges} 笔）` : '恩怨簿 · 五域威慑', hint: pendingGrudges ? '点此查看旧怨，随时登门清算' : '查看昔日恩怨与各地靠山对你的忌惮', action: 'openGrudgeBook' },
        { id: 'city_techs', label: '书肆', hint: '用灵石买功法残卷', action: 'openTechShop' },
        { id: 'city_auction', label: '通远商会 · 拍卖', hint: aucHint, action: 'auction' },
        { id: 'city_arena', label: '问道擂台', hint: `一月 · 与同境界的人比试（已胜 ${s.counters.arena_win || 0} 场），赢声望与灵石`, action: 'openArena' },
        { id: 'city_tianji', label: '坊间名录', hint: '看看坊间怎么排你', action: 'openTianji' },
        { id: 'back_hub', label: '离开', hint: '返回主界面', action: 'backHub' },
      ],
      subhub: true,
    };
  }

  act_openArena() {
    this.state.scene = { id: 'arena', result: null };
    this.emit();
  }

  buildArenaNode() {
    const s = this.state;
    const c = s.char;
    const region = REGION_BY_ID[c.regionId] || REGION_BY_ID.qingniu;
    const enemyId = region.enemies?.[region.enemies.length - 1] || 'cultivator';
    const def = ENEMY_BY_ID[enemyId];
    const rewardStones = Math.round(120 * Math.pow(REALMS[c.realm]?.powerMult || 1, 0.55));
    return {
      id: 'arena',
      title: '坊间 · 问道擂台',
      text: `青石擂台四面观者如潮。守擂强敌「${def?.name || '散修高手'}」抱剑而立，战意凛然。\n\n当前擂台战绩：${s.counters.arena_win || 0} 胜 | 胜场奖励：声望 +${20 + c.realm * 10}、灵石 +${rewardStones.toLocaleString()}`,
      choices: [
        { id: 'arena_fight', label: `登台挑战 · ${def?.name || '擂主'}`, hint: '一月 · 点到为止，胜场计入擂台战绩', action: 'arenaFight', params: { enemyId, rewardStones }, effect: 'primary' },
        { id: 'back_city', label: '暂不下场', hint: '', action: 'openCity' },
      ],
    };
  }

  act_arenaFight(ch) {
    const s = this.state;
    const c = s.char;
    const lines = advanceMonths(s, 1, this.rng);
    const { enemyId, rewardStones } = ch.params || {};
    // 审计修复：守擂者随你的境界换人（同境对手），不再是高境界白拿彩头
    return this.startCombat({
      enemy: enemyId || 'cultivator',
      matchRealm: c.realm,
      win: {
        text: '胜负已分。擂台执事高声报出你的名号，奉上彩头。',
        arenaWin: true,
        effects: { stones: rewardStones || 150, reputation: 20 + c.realm * 10, exp: Math.round(monthlyExp(s) * 1.5) },
        returnTo: 'arena',
        fx: 'breakthrough',
        log: '问道擂台获胜',
      },
      lose: {
        text: '你力竭退下擂台，虽失一城，实战所得亦颇丰。',
        effects: { hp: Math.max(10, Math.round(c.maxHp * 0.4)), exp: Math.round(monthlyExp(s) * 0.8) },
        returnTo: 'cityHub',
      },
    }, { lines: [...lines, '锣声一响，比试开始。'] });
  }

  act_openTechShop(ch = {}) {
    const page = Math.max(0, Number(ch?.params?.page) || 0);
    const tier = ch?.params?.tier || 'all';
    this.state.scene = { id: 'techShop', page, tier, result: null };
    this.emit();
  }

  shopDiscountMult() {
    const s = this.state;
    const c = s.char;
    const eraDisc = currentWorldEra(s).shopDiscount || 0;
    return Math.max(0.5, (1 - Math.min(0.25, c.attrs.魅力 * 0.004))
      * (c.sectId === 'wanbao' ? 0.85 : 1)
      * (c.goldenFingerId === 'gf_karma_mirror' ? 0.85 : 1)
      * (1 - Math.min(0.15, s.buffs?.shopDiscount || 0))
      * (1 - eraDisc));
  }

  buildTechShopNode() {
    const s = this.state;
    const c = s.char;
    const gradeOrder = TECH_GRADE_ORDER;
    const gradePrice = { 凡: 260, 黄: 1100, 玄: 3800, 地: 13500, 天: 48000, 仙: 180000 };
    const discount = this.shopDiscountMult();
    const tier = s.scene.tier || 'all';
    const tierSets = { all: null, low: new Set(['凡', '黄']), mid: new Set(['玄', '地']), high: new Set(['天', '仙']) };
    const tierNames = { all: '全部', low: '凡·黄', mid: '玄·地', high: '天·仙' };
    const nextTier = { all: 'low', low: 'mid', mid: 'high', high: 'all' }[tier] || 'all';

    // 严格排除 12 位道友的唯一传艺功法，按品阶由高到低排列，支持分页与品阶筛选
    const available = WORLD_TECHNIQUES.filter((t) => {
      if (NPC_EXCLUSIVE_TECH_IDS.has(t.id)) return false;
      if ((gradeOrder[t.grade] ?? 0) > c.realm + 1) return false;
      if (c.techniques.some((x) => x.id === t.id)) return false;
      if (tierSets[tier] && !tierSets[tier].has(t.grade)) return false;
      return true;
    }).sort((a, b) => (gradeOrder[b.grade] ?? 0) - (gradeOrder[a.grade] ?? 0));

    const perPage = 6;
    const totalPages = Math.max(1, Math.ceil(available.length / perPage));
    const page = clamp(Number(s.scene.page) || 0, 0, totalPages - 1);
    const shown = available.slice(page * perPage, (page + 1) * perPage);

    const choices = shown.map((t) => {
      const price = Math.round((gradePrice[t.grade] || 1200) * discount);
      return {
        id: `wt_${t.id}`,
        label: `【${t.grade}·${t.align || '中'}】${t.name}（${price.toLocaleString()} 灵石）`,
        hint: `修炼+${Math.round(t.speed * 100)}% 攻+${Math.round(t.atk * 100)}% 防+${Math.round((t.def || 0) * 100)}% · 「${t.artName}」`,
        action: 'buyWorldTech',
        params: { techId: t.id, price, page, tier },
        disabled: c.stones < price,
        reason: `需 ${price.toLocaleString()} 灵石`,
      };
    });
    if (totalPages > 1) {
      if (page > 0) choices.push({ id: 'ts_prev', label: `上一页（${page}/${totalPages}）`, hint: '浏览前页孤本', action: 'openTechShop', params: { page: page - 1, tier } });
      if (page < totalPages - 1) choices.push({ id: 'ts_next', label: `下一页（${page + 2}/${totalPages}）`, hint: `余下可购共 ${available.length} 部`, action: 'openTechShop', params: { page: page + 1, tier } });
    }
    choices.push({
      id: 'ts_filter',
      label: `品阶：${tierNames[tier]}（点此换成 ${tierNames[nextTier]}）`,
      hint: '按品阶筛选',
      action: 'openTechShop',
      params: { page: 0, tier: nextTier },
    });
    choices.push({ id: 'back_city', label: '离开书肆', hint: '', action: 'openCity' });
    return {
      id: 'techShop',
      title: `书肆（${tierNames[tier]} · 第${page + 1}/${totalPages}页）`,
      text: `店里收着各地散落的功法残卷。故人的独门功法不卖，只能由本人传授。\n\n可买：${available.length} 部　·　已学：${c.techniques.length} 部　·　身上灵石：${c.stones.toLocaleString()}`,
      choices,
    };
  }

  act_buyWorldTech(ch) {
    const s = this.state;
    const c = s.char;
    const { techId, price } = ch.params || {};
    const t = WORLD_TECH_BY_ID[techId];
    if (!t || NPC_EXCLUSIVE_TECH_IDS.has(t.id)) return { error: '此绝学非卖品' };
    if (c.techniques.some((x) => x.id === t.id)) return { error: '已参悟此典' };
    if (c.stones < price) return { error: `灵石不足（需 ${price.toLocaleString()}）` };
    c.stones -= price;
    s.stats.goldSpent = (s.stats.goldSpent || 0) + price;
    const techObj = {
      id: t.id, name: t.name, speed: t.speed, atk: t.atk, def: t.def,
      lifespan: t.lifespan, lawId: t.lawId, artName: t.artName, grade: t.grade, align: t.align,
    };
    c.techniques.push(techObj);
    const equipped = this.autoEquipIfSpace(techObj);
    const lawLines = t.lawId ? gainLawExp(s, 30, t.lawId) : [];
    recomputeDerived(c);
    this.pushLog(`购藏参悟${t.name}`);
    s.scene.result = {
      text: `你拂去玉简微尘，神识沉入其中，领悟【${t.grade}品】${t.name}与绝招「${t.artName}」。\n\n${t.desc}`,
      lines: [
        `消耗 ${price.toLocaleString()} 灵石，习得 ${t.name}${equipped ? '（已自动选用）' : '（可到洞府「功法」里选用）'}`,
        ...lawLines,
      ],
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
    const rankNum = Math.max(1, 108 - c.realm * 11 - Math.floor(Math.max(0, c.reputation) / 25) - s.stats.kills * 2 - (s.counters.arena_win || 0) * 3);
    const rumors = (s.rumors || []).slice(0, 6).map((r) => `· ${r}`).join('\n');
    return {
      id: 'tianji',
      title: '坊间名录',
      text: `坊间按名声排的名录。\n\n你排在第 ${rankNum} 位（声望 ${c.reputation} · 擂台 ${s.counters.arena_win || 0} 胜 · 斩敌 ${s.stats.kills}）\n战力：攻 ${this.playerAtk().toLocaleString()} / 术 ${this.playerSpellAtk().toLocaleString()} / 防 ${this.playerDef().toLocaleString()}\n\n【近期五域风闻】\n${rumors || '· 近期风平浪静。'}`,
      choices: [
        { id: 'tianji_bounty', label: '接官府悬赏', hint: '两月 · 追捕当地通缉要犯，得灵石与声望', action: 'regionHunt' },
        { id: 'back_city', label: '离开', hint: '', action: 'openCity' },
      ],
    };
  }

  /* ---------------- 支柱五：十二红尘道友（全 12 人专属论道 / 按价赠礼 / 唯一传艺 / 多道友结侣） ---------------- */

  act_openNpcHub() {
    this.state.scene = { id: 'npcHub', result: null };
    this.emit();
  }

  buildNpcHubNode() {
    const s = this.state;
    const c = s.char;
    // 只列出现在见得到、以及下一个境界就能见到的故人；更远的留作以后的惊喜
    const choices = NPCS.filter((npc) => npc.minRealm <= c.realm + 1).map((npc) => {
      const rel = c.relations?.[npc.relationKey] || 0;
      const unlocked = c.realm >= npc.minRealm;
      const regName = REGION_BY_ID[npc.region]?.name || '五域';
      return {
        id: `npc_${npc.id}`,
        label: `${npc.name}${rel ? ` · 好感 ${rel}` : ''}`,
        hint: unlocked ? `${npc.title} · ${regName}` : `${REALMS[npc.minRealm]?.name}以后才见得到`,
        action: 'openNpc',
        params: { npcId: npc.id },
        disabled: !unlocked,
        reason: '',
      };
    });
    choices.push({ id: 'back_hub', label: '回主界', hint: '', action: 'backHub' });
    return {
      id: 'npcHub',
      title: '故人',
      text: '与五域故人往来：论道、切磋、赠礼。交情深了，对方会传你压箱底的本事，也可能结为道侣。',
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
    // 展示储物袋中所有对方喜爱的物品（按价值由高到低排序），任君挑选不再锁死首项
    const ownedGifts = npc.likeItems
      .filter((id) => hasItem(s, id))
      .sort((a, b) => (ITEM_BY_ID[b]?.price || 0) - (ITEM_BY_ID[a]?.price || 0));
    const choices = [
      { id: 'npc_chat', label: '品茶论道', hint: '两月 · 听对方指点，交情加深', action: 'npcChat', params: { npcId: npc.id } },
    ];
    if (ownedGifts.length) {
      for (const gid of ownedGifts) {
        const gdef = ITEM_BY_ID[gid];
        const gain = this.giftAffinityGain(gdef);
        choices.push({
          id: `npc_gift_${gid}`,
          label: `赠礼 · ${gdef?.name || gid}（有${itemCount(s, gid)}）`,
          hint: `一月 · 估价 ${(gdef?.price || 0).toLocaleString()} 石，好感 +${gain}（上限100）`,
          action: 'npcGift',
          params: { npcId: npc.id, itemId: gid },
          disabled: rel >= 100,
          reason: '好感已至生死之交（100）',
        });
      }
    } else {
      choices.push({
        id: 'npc_gift_none',
        label: '赠礼结缘',
        hint: `喜好：${likeNames}`,
        action: 'npcGift',
        params: { npcId: npc.id, itemId: null },
        disabled: true,
        reason: rel >= 100 ? '好感已至生死之交（100）' : `无对方喜好之物（${likeNames}）`,
      });
    }
    choices.push({ id: 'npc_spar', label: '切磋试剑', hint: '一月 · 与对方点到为止地过招', action: 'npcSpar', params: { npcId: npc.id } });
    const teachTech = npc.teachTechId ? WORLD_TECH_BY_ID[npc.teachTechId] : null;
    if (teachTech && rel >= 35 && !c.techniques.some((t) => t.id === teachTech.id)) {
      choices.push({
        id: 'npc_teach',
        label: `求教独门功法 · ${teachTech.name}`,
        hint: `交情够深才肯教 · ${teachTech.grade}品，绝招「${teachTech.artName}」`,
        action: 'npcTeach',
        params: { npcId: npc.id, techId: teachTech.id },
        effect: 'primary',
      });
    }
    const bondThreshold = npc.id === 'npc_su' ? 40 : 60;
    if (ROMANCEABLE_NPCS.has(npc.id) && rel >= bondThreshold && !s.flags['道侣']) {
      choices.push({
        id: 'npc_bond',
        label: '结为道侣',
        hint: '此后同行（一生只能结一次）',
        action: 'npcBond',
        params: { npcId: npc.id },
        effect: 'primary',
      });
    }
    choices.push({ id: 'back_npc', label: '告辞离去', hint: '', action: 'openNpcHub' });
    const isSpouse = c.spouseNpcId === npc.id || (npc.id === 'npc_su' && s.flags['道侣'] && !c.spouseNpcId);
    return {
      id: 'npcDetail',
      title: `${npc.name} · ${npc.title}`,
      text: `${npc.desc}\n\n当前好感：${rel} / 100${isSpouse ? '（道侣）' : ''}\n喜好之物：${likeNames}\n羁绊之益：${npc.perkDesc}`,
      choices,
    };
  }

  giftAffinityGain(itemDef) {
    const price = Math.max(10, itemDef?.price || 30);
    const raw = Math.round(3 + Math.log2(price / 10) * 1.8);
    const charmMult = 1 + (this.state.buffs?.npcAffinity || 0) + (sectPerks(this.state.char).charm ? 0.25 : 0);
    return clamp(Math.round(raw * charmMult), 4, 32);
  }

  act_npcChat(ch) {
    const s = this.state;
    const c = s.char;
    const npc = NPC_BY_ID[ch.params?.npcId];
    if (!npc) return;
    const lines = advanceMonths(s, 2, this.rng);
    const charmMult = 1 + (s.buffs?.npcAffinity || 0) + (sectPerks(c).charm ? 0.25 : 0);
    const addRel = Math.round(6 * charmMult);
    c.relations[npc.relationKey] = clamp((c.relations[npc.relationKey] || 0) + addRel, -100, 100);
    const rel = c.relations[npc.relationKey];
    const line = this.rng.pick(npc.chatLines);
    lines.push(`与${npc.name}对坐论道，好感 +${addRel}（当前 ${rel}/100）。`);

    // 审计修复：论道无冷却无上限可无限刷属性。同一人一年只有一次真正的「论道所得」，一世至多十二次
    const cdKey = `论道冷却:${npc.id}`;
    const cntKey = `论道:${npc.id}`;
    const onCooldown = (s.flags[cdKey] || 0) > c.age;
    const exhausted = (s.counters[cntKey] || 0) >= 12;
    const minRealm = npc.minRealm || 0;
    if (onCooldown || exhausted || c.realm < minRealm) {
      lines.push(exhausted ? '该说的话都已说尽，此番只是叙旧。' : (c.realm < minRealm ? '对方境界远在你之上，只当寻常晚辈招待。' : '一年之内已论过一回，此番只是叙旧。'));
      s.scene.result = { text: `${npc.name}与你闲谈片刻。\n\n${line}`, lines, returnTo: 'npcDetail', returnMeta: { npcId: npc.id } };
      this.afterAction();
      this.emit();
      return;
    }
    s.flags[cdKey] = c.age + 12;
    s.counters[cntKey] = (s.counters[cntKey] || 0) + 1;

    // 全部 12 位道友各自实装专属论道效果！
    switch (npc.id) {
      case 'npc_su':
        c.attrs.道心 += 1;
        if (rel >= 20) { c.attrs.悟性 += 1; lines.push(`【${npc.name}】剑心澄澈，悟性 +1，道心 +1。`, ...gainLawExp(s, 14, 'sword')); }
        else lines.push(`【${npc.name}】道心 +1。`);
        break;
      case 'npc_lu':
        c.attrs.根骨 += 1;
        lines.push(`【${npc.name}】根骨 +1。`, ...gainLawExp(s, rel >= 30 ? 28 : 15, 'sword'));
        break;
      case 'npc_yao':
        lines.push(...gainLawExp(s, 18, 'pill'));
        if (rel >= 25 && this.rng.chance(0.45)) {
          const pill = c.realm >= 2 ? 'dahuan_dan' : 'juling_dan';
          addItem(s, pill, 1);
          lines.push(`【${npc.name}】临走塞给你一瓶「${ITEM_BY_ID[pill]?.name}」。`);
        }
        break;
      case 'npc_gu':
        c.attrs.神识 += 1;
        c.attrs.气运 += 1;
        lines.push(`【${npc.name}】神识 +1，气运 +1。`, ...gainLawExp(s, 16, 'karma'));
        break;
      case 'npc_xuesha': {
        const got = gainExp(s, Math.round(monthlyExp(s) * 2.2));
        c.demon = clamp(c.demon + 2, 0, 100);
        lines.push(`【${npc.name}】修为 +${got.toLocaleString()}，心魔 +2。`, ...gainLawExp(s, 22, 'blood'));
        break;
      }
      case 'npc_lin':
        c.reputation += 12;
        c.attrs.根骨 += 1;
        lines.push(`【${npc.name}】声望 +12，根骨 +1。`, ...gainLawExp(s, 12, 'thunder'));
        break;
      case 'npc_yunni':
        c.attrs.神识 += 1;
        c.demon = Math.max(0, c.demon - 4);
        lines.push(`【${npc.name}】神识 +1，心魔 -4。`, ...gainLawExp(s, 22, 'space'));
        break;
      case 'npc_xuanji': {
        c.attrs.悟性 += 1;
        const tipStones = 180 + c.realm * 140;
        c.stones += tipStones;
        lines.push(`【${npc.name}】悟性 +1，鉴宝分红灵石 +${tipStones}。`, ...gainLawExp(s, 24, 'array'));
        break;
      }
      case 'npc_moheng':
        c.attrs.神识 += 2;
        c.karma -= 3;
        lines.push(`【${npc.name}】神识 +2，业力 -3。`, ...gainLawExp(s, 26, 'time'));
        break;
      case 'npc_baiyou':
        c.attrs.魅力 += 1;
        c.attrs.气运 += 1;
        c.demon = Math.max(0, c.demon - 5);
        lines.push(`【${npc.name}】魅力 +1，气运 +1，心魔 -5。`, ...gainLawExp(s, 18, 'karma'));
        break;
      case 'npc_qinglian':
        c.attrs.悟性 += 2;
        lines.push(`【${npc.name}】剑道感悟暴涨，悟性 +2。`, ...gainLawExp(s, 45, 'sword'));
        break;
      case 'npc_siming':
        s.buffs.breakBonus = Math.max(s.buffs.breakBonus || 0, Math.min(45, (s.buffs.breakBonus || 0) + 6));
        c.bonusLifespan = (c.bonusLifespan || 0) + 12 * 10;
        recomputeDerived(c);
        lines.push(`【${npc.name}】窥破天劫玄机，下次破境成算 +6%、寿元微增。`, ...gainLawExp(s, 45, 'star'));
        break;
      default:
        break;
    }

    s.scene.result = {
      text: `${npc.name}与你对坐，说起近来的事：\n\n${line}`,
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
    const def = ITEM_BY_ID[itemId];
    const gain = this.giftAffinityGain(def);
    const lines = advanceMonths(s, 1, this.rng);
    c.relations[npc.relationKey] = clamp((c.relations[npc.relationKey] || 0) + gain, -100, 100);
    lines.push(`赠出 ${def?.name || itemId}（估价 ${def?.price || 0} 石），${npc.name}好感 +${gain}（当前 ${c.relations[npc.relationKey]}/100）。`);
    if (npc.id === 'npc_yao') {
      c.attrs.悟性 += 1;
      lines.push(`${npc.name}收下礼，顺手指点了几句（悟性 +1）。`);
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
    const sparLaw = WORLD_TECH_BY_ID[npc.teachTechId]?.lawId || 'sword';
    const expGain = Math.round(monthlyExp(s) * (1.8 + npc.minRealm * 0.25));
    const sparEnemyId = npc.sparEnemy || 'cultivator';
    // 审计修复：对手随你的境界变强（以对方修为压你半境），同一人一年只算一次「切磋所得」
    const targetRealm = Math.max(c.realm, npc.minRealm || 0);
    const cdKey = `切磋冷却:${npc.id}`;
    const fresh = (s.flags[cdKey] || 0) <= c.age;
    s.flags[cdKey] = c.age + 12;
    const winEffects = fresh
      ? { exp: expGain, attrs: { 根骨: 1 }, relation: { [npc.relationKey]: 8 }, lawExp: 25 + npc.minRealm * 6, lawId: sparLaw }
      : { exp: Math.round(expGain * 0.3), relation: { [npc.relationKey]: 2 } };
    return this.startCombat({
      enemy: sparEnemyId,
      matchRealm: targetRealm,
      displayName: npc.name,
      win: {
        text: `收剑归鞘，${npc.name}抚掌大笑：「好俊的功夫，此战痛快！」${fresh ? '' : '（一年内再战，所得有限）'}`,
        effects: winEffects,
        returnTo: 'npcDetail',
        returnMeta: { npcId: npc.id },
        log: `与${npc.name}切磋获胜`,
      },
      lose: {
        text: `${npc.name}及时收招点到为止，将你扶起：「招式仍有破绽，回去再悟三日罢。」`,
        effects: { hp: Math.max(10, Math.round(c.maxHp * 0.45)), exp: Math.round(expGain * 0.6), attrs: { 悟性: 1 }, relation: { [npc.relationKey]: 3 }, lawExp: 12, lawId: sparLaw },
        returnTo: 'npcDetail',
        returnMeta: { npcId: npc.id },
      },
    }, { lines: [...lines, `你向${npc.name}拱手请教，双方以本境实力点到为止。`] });
  }

  act_npcTeach(ch) {
    const s = this.state;
    const c = s.char;
    const npc = NPC_BY_ID[ch.params?.npcId];
    const tech = WORLD_TECH_BY_ID[ch.params?.techId];
    if (!npc || !tech) return;
    if ((c.relations?.[npc.relationKey] || 0) < 35) return { error: `与${npc.name}好感尚不足 35` };
    if (c.techniques.some((t) => t.id === tech.id)) return { error: '已习得此绝学' };
    const techObj = {
      id: tech.id, name: tech.name, speed: tech.speed, atk: tech.atk, def: tech.def,
      lifespan: tech.lifespan, lawId: tech.lawId, artName: tech.artName, grade: tech.grade, align: tech.align,
    };
    c.techniques.push(techObj);
    const equipped = this.autoEquipIfSpace(techObj);
    const lawLines = tech.lawId ? gainLawExp(s, 50, tech.lawId) : [];
    recomputeDerived(c);
    this.pushLog(`${npc.name}亲传唯一绝学${tech.name}`);
    s.scene.result = {
      text: `${npc.name}沉吟片刻，以指代笔在虚空中划出七道微光道纹：「这套【${tech.grade}品】${tech.name}乃我压箱底的唯一传承，今日便传予你罢。」\n\n${tech.desc}`,
      lines: [`习得唯一绝学 ${tech.name}（绝招：${tech.artName}）${equipped ? '（已自动选用）' : '（可到洞府「功法」里选用）'}`, ...lawLines],
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
    const threshold = npc.id === 'npc_su' ? 40 : 60;
    if (!ROMANCEABLE_NPCS.has(npc.id)) return { error: '对方无意结为道侣' };
    if ((c.relations?.[npc.relationKey] || 0) < threshold) return { error: `与${npc.name}好感需达 ${threshold} 方可结侣` };
    if (s.flags['道侣']) return { error: '此生已有道侣相伴' };
    s.flags['道侣'] = true;
    c.spouseNpcId = npc.id;
    c.relations['道侣'] = Math.max(c.relations['道侣'] || 0, c.relations[npc.relationKey] || 40);
    c.attrs.道心 += 8;
    c.demon = Math.max(0, c.demon - 15);
    this.pushRumor(`【风闻】「${c.name}」与「${npc.name}」结为道侣。`);
    s.scene.result = {
      text: `霞光漫天，清风拂袖。${npc.name}轻执你手，以神魂立下同心道誓：\n\n「此生无论身在人间抑或山巅，长生路远，我与你同行。」`,
      lines: [`与${npc.name}结为道侣。道心 +8，心魔 -15`],
      fx: 'breakthrough',
      returnTo: 'npcDetail',
      returnMeta: { npcId: npc.id },
    };
    this.afterAction();
    this.emit();
  }

  /* ---------------- 核心修行动作 ---------------- */

  act_continue() { return this.proceed(); }

  act_cultivate(ch = {}) {
    const s = this.state;
    const months = ch.params?.months || MONTHS;
    const taiyinMult = (s.char.rootId === 'taiyin' && months >= 24) ? 1.3 : 1;
    const gain = Math.round(monthlyExp(s) * months * taiyinMult);
    const got = gainExp(s, gain);
    s.counters.night_cultivate = (s.counters.night_cultivate || 0) + Math.max(1, Math.round(months / 3));
    const lines = [`闭关${months}月${taiyinMult > 1 ? '（太阴月华 +30%）' : ''}，修为 +${got.toLocaleString()}。`];
    if (s.char.goldenFingerId === 'gf_bottle' && this.rng.chance(months >= 24 ? 0.72 : 0.35)) {
      const herb = s.char.realm >= 2 ? 'qiannian_lingcao' : 'lingcao';
      addItem(s, herb, 1);
      lines.push(`【${GOLDEN_FINGER_BY_ID.gf_bottle?.name || '机缘'}】月夜凝露，催熟出一株${ITEM_BY_ID[herb]?.name}。`);
    }
    const petDemRes = petBonuses(s.char).demonResist || 0;
    if (ch.params?.demonRisk && this.rng.chance(0.25 + s.char.demon * 0.005)) {
      let d = this.rng.int(2, 5);
      if (s.char.goldenFingerId === 'gf_stealth') d = Math.max(1, Math.round(d * 0.5));
      if (petDemRes > 0) d = Math.max(1, Math.round(d * (1 - petDemRes)));
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
    const unlocked = REGIONS.filter((r) => c.realm >= r.minRealm && r.id !== c.regionId);
    const target = unlocked.length ? this.rng.pick(unlocked) : REGIONS[0];
    const months = c.rootId === 'kongjian' ? 3 : this.travelMonthsTo(target);
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

  // 兼容直调单炉炼丹（测试及快捷调用）
  act_alchemy() {
    if (hasItem(this.state, 'lingcao') && ALCHEMY_RECIPES[0]) {
      return this.act_brewRecipe({ params: { recipeId: ALCHEMY_RECIPES[0].id } });
    }
    return this.act_openAlchemy();
  }

  act_secretRealm() {
    const s = this.state;
    const c = s.char;
    const region = REGION_BY_ID[c.regionId] || REGION_BY_ID.qingniu;
    const ctx = contextOf(s, this);
    const lines = advanceMonths(s, 6, this.rng);
    // 严格校验每个候选秘境事件的 minRealm / maxRealm / require，杜绝绕过条件！
    const validEntry = (id) => {
      if (s.flags[`ev:${id}`]) return false;
      const ev = this.registry.get(id);
      if (!ev) return false;
      if (ev.minRealm != null && c.realm < ev.minRealm) return false;
      if (ev.maxRealm != null && c.realm > ev.maxRealm) return false;
      if (ev.require) {
        try { if (!compileCondition(ev.require)(ctx)) return false; } catch { return false; }
      }
      return true;
    };
    const entries = (region.secretRealms || []).filter(validEntry);
    if (entries.length) {
      const nextId = this.rng.pick(entries);
      c.secretsCleared = c.secretsCleared || [];
      if (!c.secretsCleared.includes(nextId)) {
        c.secretsCleared.push(nextId);
        s.counters.secrets = Math.max((s.counters.secrets || 0) + 1, c.secretsCleared.length);
      }
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
    s.scene.result = { text: `你循着古图深入${region.name}禁地，眼下契合你境界与身份的古境阵纹均已沉寂。`, lines, returnTo: 'regionHub' };
    this.afterAction();
    this.emit();
  }

  act_revisitGate() {
    // v8：此世无飞升，天门已不存在
    return this.act_backHub();
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
      const techObj = { id, name: def.name, ...def.technique };
      s.char.techniques.push(techObj);
      const eq = this.autoEquipIfSpace(techObj);
      const lines = [`习得功法 ${def.name}${eq ? '（已自动选用）' : '（可到洞府「功法」里选用）'}`];
      if (def.technique.attrs) lines.push(...applyEffects(s, { attrs: def.technique.attrs }, this.effectCtx()));
      if (def.technique.lawId) lines.push(...gainLawExp(s, 28, def.technique.lawId));
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
      // 非战斗服丹/启符不会自损致死，至少保留 1 点气血
      if (s.char.hp <= 0) s.char.hp = 1;
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
      lines.push('夜里吐纳的灵气沉进器中，凝出一株百年灵草。');
      s.scene.result = {
        text: '夜半，器中积下的一点灵液滴进药盆，嫩芽转眼抽枝成株。',
        lines,
        fx: 'alchemy',
        returnTo: ch.params?.returnTo || null,
      };
    } else {
      const reward = s.char.realm >= 4 ? 'yuanying_dan' : s.char.realm >= 2 ? 'jiejin_dan' : s.char.realm >= 1 ? 'zhuji_dan' : 'yinqi_dan';
      addItem(s, reward, 1);
      const got = gainExp(s, Math.round(monthlyExp(s) * 2.5));
      lines.push(`绿液催熟千年灵药。凝成 ${ITEM_BY_ID[reward].name} ×1，修为 +${got.toLocaleString()}。`);
      s.scene.result = {
        text: '一滴绿液滴落灵草根部，药香瞬间冲破石室禁制。百年灵草眨眼蜕变为千年药王，直接凝炼成丹。',
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
      s.scene.result = { text: `你的本命法宝「${c.artifactName}」已到顶阶「${ARTIFACT_TIERS[ARTIFACT_TIERS.length - 1]}」，无法再炼。`, lines: [], returnTo: ch.params?.returnTo || null };
      this.emit();
      return;
    }
    const stoneCost = this.refineStoneCost();
    // 审计修复：原先只要有一块灵材就免掉整阶灵石。改为灵材按市价四倍折抵，便宜的先用，不足部分付灵石
    let remaining = stoneCost;
    const usedMats = [];
    for (const id of REFINE_MATS_BY_PRICE) {
      while (remaining > 0 && hasItem(s, id)) {
        const worth = Math.max(1, (ITEM_BY_ID[id]?.price || 50) * 4);
        if (worth > remaining * 1.5 && usedMats.length) break; // 别拿贵料去补零头
        removeItem(s, id, 1);
        usedMats.push(ITEM_BY_ID[id]?.name || id);
        remaining -= worth;
      }
      if (remaining <= 0) break;
    }
    remaining = Math.max(0, remaining);
    if (c.stones < remaining) {
      // 退回已扣的灵材
      for (const name of usedMats) {
        const id = REFINE_MATS_BY_PRICE.find((x) => (ITEM_BY_ID[x]?.name || x) === name);
        if (id) addItem(s, id, 1);
      }
      s.scene.result = { text: `此阶祭炼需折合 ${stoneCost.toLocaleString()} 灵石（灵材按市价四倍折抵），还差 ${(remaining - c.stones).toLocaleString()} 灵石。`, lines: [], returnTo: ch.params?.returnTo || null };
      this.emit();
      return;
    }
    const lines = advanceMonths(s, 3, this.rng);
    c.stones -= remaining;
    s.stats.goldSpent = (s.stats.goldSpent || 0) + remaining;
    const matUsed = [usedMats.length ? `灵材 ${usedMats.length} 份` : '', remaining ? `${remaining.toLocaleString()} 灵石` : ''].filter(Boolean).join(' + ');
    c.artifactLevel = lvl + 1;
    c.artifactName = ARTIFACT_TIERS[c.artifactLevel];
    s.counters.craft = (s.counters.craft || 0) + 1;
    if (c.artifactLevel >= 5) s.flags['得地阶法宝'] = true;
    lines.push(`消耗 ${matUsed}，本命法宝晋升为【${c.artifactName}】（战力共 +${c.artifactLevel * 8}%）。`);
    this.pushRumor(`【器道风闻】「${c.name}」以地火祭炼出「${c.artifactName}」，剑鸣震彻云霄。`);
    s.scene.result = {
      text: `三昧真火昼夜不熄，你在剑胎上刻下最后一道本命道纹。\n\n清越剑鸣震落屋檐积灰——你的本命法宝已晋升为【${c.artifactName}】。`,
      lines,
      fx: 'breakthrough',
      returnTo: ch.params?.returnTo || null,
    };
    this.afterAction();
    this.emit();
  }

  /* ---------------- 十年一届限量竞价拍卖会 ---------------- */

  ensureAuctionRound() {
    const s = this.state;
    const c = s.char;
    if (s.auctionRound && c.age < s.auctionRound.nextAt) return s.auctionRound;
    const pool = [
      'zhuji_dan', 'jiejin_dan', 'huaying_dan', 'huashen_dan', 'faze_canpian',
      'jiuzhuan_gong', 'xisui_dan', 'dao_fruit', 'xukong_jing', 'tiandao_lotus', 'tianjie_dan',
    ];
    const picked = [...pool].sort(() => this.rng.next() - 0.5).slice(0, 4);
    const lots = picked.map((id) => {
      const def = ITEM_BY_ID[id];
      const base = def?.price || 1000;
      // 溢价起拍：市价 1.05x–1.35x（不再 2 折倾销！）
      const startPrice = Math.round(base * (1.05 + this.rng.next() * 0.3));
      return { id, startPrice, curPrice: startPrice, sold: false, bids: 0 };
    });
    s.auctionRound = { nextAt: c.age + 120, lots };
    return s.auctionRound;
  }

  act_auction() {
    const s = this.state;
    advanceMonths(s, 1, this.rng);
    this.ensureAuctionRound();
    s.scene = { id: 'auction', result: null };
    this.afterAction();
    this.emit();
  }

  buildAuctionNode() {
    const s = this.state;
    const c = s.char;
    const round = this.ensureAuctionRound();
    const remainYears = Math.max(1, Math.ceil((round.nextAt - c.age) / 12));
    const discount = this.shopDiscountMult();
    const choices = round.lots.map((lot, idx) => {
      const def = ITEM_BY_ID[lot.id];
      const price = Math.round(lot.curPrice * discount);
      return {
        id: `bid_${lot.id}`,
        label: lot.sold ? `【已成交】${def?.name || lot.id}` : `出价 · ${def?.name || lot.id}（${price.toLocaleString()} 灵石）`,
        hint: lot.sold ? `本届仅此一件，${remainYears} 年后换新` : `${def?.desc || ''}（已叫价 ${lot.bids} 轮）`,
        action: 'bidItem',
        params: { idx, id: lot.id, price, highValue: (def?.price || 0) >= 4000 },
        disabled: lot.sold || c.stones < price,
        reason: lot.sold ? '已售罄' : `灵石不足（需 ${price.toLocaleString()}）`,
      };
    });
    choices.push({ id: 'leave_auction', label: '低调离场', hint: '从商会后门离开', action: 'openCity' });
    return {
      id: 'auction',
      title: `通远商会 · 拍卖（${remainYears} 年后换下一批）`,
      text: `商会十年一次的拍卖。每件只有一份，来竞价的多是各地有名的人物。\n\n当前身家：${c.stones.toLocaleString()} 灵石`,
      choices,
    };
  }

  act_bidItem(ch) {
    const s = this.state;
    const c = s.char;
    const round = this.ensureAuctionRound();
    const lot = round.lots[ch.params?.idx];
    if (!lot || lot.sold) return { error: '此拍品已成交' };
    const price = ch.params.price;
    if (c.stones < price) return { error: `灵石不足（需 ${price.toLocaleString()} 灵石）` };

    // 真实 NPC 竞价抬价（前两轮有概率被二楼老怪加价竞争）
    const rivalChance = lot.bids === 0 ? 0.45 : lot.bids === 1 ? 0.22 : 0;
    const mirrorSuppress = c.goldenFingerId === 'gf_karma_mirror' ? 0.5 : 1;
    if (this.rng.chance(rivalChance * mirrorSuppress)) {
      lot.bids++;
      lot.curPrice = Math.round(lot.curPrice * (1.14 + this.rng.next() * 0.1));
      s.scene.result = {
        text: `你刚举起号牌，二楼天字包厢便传出一声冷笑，直接将「${ITEM_BY_ID[lot.id]?.name}」抬价至 ${lot.curPrice.toLocaleString()} 灵石。是否继续跟拍？`,
        lines: [`对手加价竞争，当前叫价升至 ${lot.curPrice.toLocaleString()} 灵石`],
        returnTo: 'auction',
      };
      this.emit();
      return;
    }

    c.stones -= price;
    s.stats.goldSpent = (s.stats.goldSpent || 0) + price;
    lot.sold = true;
    addItem(s, lot.id, 1);
    const name = ITEM_BY_ID[lot.id]?.name || lot.id;
    this.pushRumor(`【通远商会】「${c.name}」以 ${price.toLocaleString()} 灵石拍得「${name}」。`);
    if (ch.params.highValue && c.goldenFingerId !== 'gf_stealth' && c.goldenFingerId !== 'gf_karma_mirror' && this.rng.chance(0.35)) {
      s.scene.result = {
        text: `你一锤定音拍下【${name}】，满场哗然。刚出侧门，便觉三道冰冷杀意如芒在背。`,
        lines: [`拍得 ${name}（-${price.toLocaleString()} 灵石）`, '【财不露白】遭遇暗中尾随。'],
        goto: 'wn_ambush_1',
        fx: 'alchemy',
      };
    } else {
      s.scene.result = {
        text: `「${price.toLocaleString()} 灵石，成交！」金槌落下，侍女捧着封禁玉盒送入包厢。你收好【${name}】，借密道悄然脱身。`,
        lines: [`拍得限量奇珍 ${name}（-${price.toLocaleString()} 灵石）`],
        fx: 'alchemy',
        returnTo: 'auction',
      };
    }
    this.afterAction();
    this.emit();
  }

  pushRumor(text) {
    const s = this.state;
    if (!s || !text) return;
    s.rumors = s.rumors || [];
    s.rumorAt = s.char?.age ?? null;
    const base = text.replace(/ ×\d+$/, '');
    const idx = s.rumors.findIndex((r) => r.replace(/ ×\d+$/, '') === base);
    if (idx >= 0) {
      const m = s.rumors[idx].match(/ ×(\d+)$/);
      const count = (m ? Number(m[1]) : 1) + 1;
      s.rumors.splice(idx, 1);
      s.rumors.unshift(`${base} ×${count}`);
    } else {
      s.rumors.unshift(base);
    }
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
    const flavor = sect ? this.rng.pick(sect.taskFlavor) : '巡山杂务';
    lines.push(`${flavor}。贡献 +${contribution}，灵石 +${stones}，修为 +${got.toLocaleString()}。`);
    if (this.rng.chance(0.12)) s.counters.slack = (s.counters.slack || 0) + 1;
    if (this.rng.chance(0.22)) {
      startFaceSlapEncounter(this, { context: 'sect', returnTo: ch.params?.returnTo || 'sectHall', note: lines });
      this.afterAction();
      this.emit();
      return;
    }
    const ev = pickEvent(s, this.rng, this, 'sect');
    if (ev && this.rng.chance(0.38)) {
      this.openEvent(ev);
      this.afterAction();
      this.emit();
      return;
    }
    s.scene.result = {
      text: '日常差事虽然平淡，日积月累也是功劳。',
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
    s.counters.night_cultivate = (s.counters.night_cultivate || 0) + 2;
    // 审计修复：参悟加属性原本没有上限，卡在瓶颈前几百年会把道心、悟性刷到几千。
    // 静坐所得只到「本境所能领会」为止（30 + 境界×15），再往上只涨法则感悟
    const attrCap = 30 + c.realm * 15;
    let gain = 1 + (this.rng.chance(0.32) ? 1 : 0) + (c.goldenFingerId === 'gf_sword_elder' ? 1 : 0);
    gain = Math.max(0, Math.min(gain, attrCap - c.attrs.悟性));
    const dao = Math.max(0, Math.min(2, attrCap - c.attrs.道心));
    c.attrs.悟性 += gain;
    c.attrs.道心 += dao;
    c.demon = Math.max(0, c.demon - 2);
    const lawAmt = 18 + Math.round(Math.min(c.attrs.悟性, 200) * 0.5) + c.realm * 8;
    const lawLines = gainLawExp(s, lawAmt);
    lines.push(gain || dao ? `参悟半年，悟性 +${gain}，道心 +${dao}，心魔 -2。` : '参悟半年，心境已到此境所能及，只在法则上有所进益。心魔 -2。', ...lawLines);
    if (dao > 0 && this.rng.chance(0.25)) {
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
    const active = activeTechniques(c);
    this.state.scene.result = {
      text: '你静坐回望此生：道基、功法、法则、功业与因果，历历在目。',
      lines: [
        `战力评估：攻 ${this.playerAtk().toLocaleString()} · 术 ${this.playerSpellAtk().toLocaleString()} · 防 ${this.playerDef().toLocaleString()}`,
        `根基：道基【${daoName}】· 结丹【${coreName}】· 在用功法 ${active.length}/${maxTechSlots(c.realm)}`,
        `法则领悟：${lawList}`,
        `此生记录：抉择 ${s.stats.actions} 次 · 奇遇 ${s.stats.events} 次 · 斩敌 ${s.stats.kills} · 花费灵石 ${(s.stats.goldSpent || 0).toLocaleString()}`,
        `遇事打脸：胜 ${s.counters.faceslap_wins || 0} 次（扮猪吃虎 ${s.counters.lowkey_wins || 0} · 威压震场 ${s.counters.flex_wins || 0} · 连收拾靠山 ${s.counters.elder_slaps || 0} · 清算旧怨 ${s.counters.revenge_wins || 0}）`,
        `坊间盛会：赌石 ${s.counters.fair_stone_wins || 0} 胜 · 丹器 ${s.counters.fair_craft_wins || 0} 胜 · 茶会 ${s.counters.fair_salon_wins || 0} 胜 · 待报旧怨 ${(s.grudges || []).filter((g) => g.status === 'owe').length} 笔`,
        `已解锁结局：${s.meta.unlockedEndings.length} / ${ENDINGS.length} · 成就：${Object.keys(s.meta.achievements).length} / ${ACHIEVEMENTS.length}`,
      ],
    };
    this.emit();
  }

  act_foundSect() {
    const s = this.state;
    const c = s.char;
    if (s.flags.开宗立派) return;
    if (c.sectId && (c.sectRank || 0) < 5) return { error: '须先离开原门户，或升到最高职阶，才能自立门户' };
    if (c.stones < 10000) return { error: '自立门户需 10,000 灵石' };
    c.stones -= 10000;
    s.stats.goldSpent = (s.stats.goldSpent || 0) + 10000;
    s.flags.开宗立派 = true;
    s.flags.道号 = true;
    c.sectId = 'player_sect';
    c.playerSectName = `${c.name}道宗`;
    c.playerSectLevel = 1;
    c.playerSectDisciples = Math.max(c.playerSectDisciples || 0, s.counters.disciples || 0);
    c.sectRank = 5;
    s.sectBoard = null;
    if (!c.titles.includes('开山祖师')) c.titles.push('开山祖师');
    c.reputation += 200;
    recomputeDerived(c);
    this.pushRumor(`【开宗立派】「${c.name}」自立「${c.playerSectName}」，八方修士前来观礼。`);
    s.scene.result = {
      text: `你在灵峰绝顶立下山门石碑，亲手题刻「${c.playerSectName}」。自此你成为一宗开山祖师，可扩建山门、招收门徒、收取岁贡。`,
      lines: [`正式建立「${c.playerSectName}」`, '获得称号「开山祖师」，声望 +200'],
      fx: 'breakthrough',
      returnTo: 'sectHall',
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

  entryRankForRealm(realm) {
    if (realm >= 6) return 5;
    if (realm >= 4) return 4;
    if (realm === 3) return 3;
    if (realm === 2) return 2;
    if (realm === 1) return 1;
    return 0;
  }

  act_joinSect(ch) {
    const s = this.state;
    const c = s.char;
    if (!ch || !ch.sectId) return;
    if (c.sectBlacklist?.[ch.sectId]) return { error: '你曾叛离此宗，已被永除名籍' };
    if (c.sectLeaveUntil && c.age < c.sectLeaveUntil) {
      return { error: `叛离原门户未满五年，还需 ${Math.ceil((c.sectLeaveUntil - c.age) / 12)} 年才能再投身` };
    }
    const sect = SECT_BY_ID[ch.sectId];
    if (!sect) return;
    if (c.sectId) return { error: '你已有门户在身' };
    if (sect.requireExpr) {
      try { if (!compileCondition(sect.requireExpr)(contextOf(s, this))) return { error: sect.requirement || '不合入门条件' }; } catch { /* 条件错误由校验脚本报告 */ }
    }
    if (sect.align === '正' && c.karma <= -150) return { error: '你恶行太多，正道门户不收' };
    const startRank = this.entryRankForRealm(c.realm);
    c.sectId = sect.id;
    c.sectRank = startRank;
    c.contribution = 0;
    s.sectBoard = null;
    s.counters.sects_joined = (s.counters.sects_joined || 0) + 1;
    s.meta.sectsJoined = Array.from(new Set([...(s.meta.sectsJoined || []), sect.id]));
    s.flags[`入宗:${sect.id}`] = true;
    // 审计修复：入门效果每一世每个门户只给一次（防止辞别重入叠属性）
    const firstJoin = !s.flags[`入门礼:${sect.id}`];
    s.flags[`入门礼:${sect.id}`] = true;
    const lines = firstJoin ? applyEffects(s, { ...(sect.joinEffects || {}), attrs: { ...(sect.joinEffects?.attrs || {}) } }, this.effectCtx()) : [];
    const rankName = sectRankName(sect.id, startRank);
    lines.push(startRank > 0
      ? `【破格录用】以你${realmLabel(c)}的修为，直接录为「${sect.name} · ${rankName}」。`
      : `你成了${sect.name}的${rankName}，可随时到主界「门户」接差事、学功法、换物资。`);
    s.scene.result = {
      text: startRank > 0
        ? `${sect.name}的首领亲自接见，授你「${rankName}」之职。`
        : `${sect.entry}\n\n考核通过。你成了${sect.name}的${rankName}。`,
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
      ? `消耗${needItemName}，成功率更高，根基也更好`
      : (needItemName ? `推荐准备「${needItemName}」或破障丹` : '消耗破障丹或筑基丹，成功率更高');

    const rawPenalty = major && c.realm >= 2 ? 0.25 : 0;
    const rawP = clamp(p - rawPenalty, 0.05, 0.97);
    const conflict = techAlignmentConflict(c);
    const lines = [
      `你盘坐蒲团，敛息凝神。${realmLabel(c)}的壁垒就在眼前。`,
      major && bn.bottleneck ? `【大境瓶颈】${bn.bottleneck.trialDesc}` : '此次仅需破开小境隔膜，顺势进阶。',
      conflict.conflict ? '正邪功法同修，破境更难。建议先到洞府「功法」里调整。' : '',
      major && bn.missing.length
        ? `【尚未达标】${bn.missing.join('；')}（可到洞府「参悟」提升道心与法则）`
        : `不服丹，成功率约 ${Math.round(rawP * 100)}%${rawPenalty > 0 && needItemName ? `（无「${needItemName}」护持，凶险倍增）` : ''}。`,
    ].filter(Boolean);

    return {
      id: 'breakthrough',
      title: major ? `大境叩关 · 冲击${REALMS[c.realm + 1]?.name || '下一境'}` : '小境叩关',
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
        { label: '暂不冲关', hint: '回主界', action: 'backHub' },
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
      c.layer++;
      c.exp = 0;
      if (lingqiAt(worldYear(s)) <= 10) s.counters.mofa_breakthroughs = (s.counters.mofa_breakthroughs || 0) + 1;
      if (c.layer >= REALMS[c.realm].layers) {
        c.realm++;
        c.layer = 0;
        const extraMajor = [];
        if (c.goldenFingerId === 'gf_panel') {
          c.attrs.悟性 += 2;
          extraMajor.push('【修仙面板】大境界突破，悟性 +2。');
        }
        if (s.flags['前世秘藏'] && !s.flags[`秘藏已领:${c.realm}`]) {
          s.flags[`秘藏已领:${c.realm}`] = true;
          const legacy = Math.round(1500 * Math.pow(REALMS[c.realm].powerMult || 1, 0.5));
          c.stones += legacy;
          extraMajor.push(`【前世秘藏】破境感应旧藏，灵石 +${legacy.toLocaleString()}`);
        }
        if (c.realm === 1 && !c.daoBaseQuality) {
          const score = c.attrs.道心 + c.attrs.根骨 + c.attrs.悟性 * 0.5 + qualityBonus - c.demon * 0.4 + (c.rootId === 'tianling' || c.rootId === 'hundun' ? 24 : 0);
          let chosen = DAO_BASE_QUALITIES[0];
          for (const q of DAO_BASE_QUALITIES) if (score >= q.minScore) chosen = q;
          c.daoBaseQuality = chosen.id;
          extraMajor.push(`【筑基】道基为「${chosen.name}」，此后战力长久提升。${chosen.desc}`);
          this.pushRumor(`【五域风闻】「${c.name}」筑基，道基为「${chosen.name}」。`);
        } else if (c.realm === 2 && !c.goldenCoreQuality) {
          const score = c.attrs.道心 + c.attrs.悟性 * 0.8 + c.attrs.神识 * 0.5 + qualityBonus - c.demon * 0.4 + (c.daoBaseQuality === 'tiandao' ? 18 : c.daoBaseQuality === 'shang' ? 8 : 0);
          let chosen = GOLDEN_CORE_QUALITIES[0];
          for (const q of GOLDEN_CORE_QUALITIES) if (score >= q.minScore) chosen = q;
          c.goldenCoreQuality = chosen.id;
          extraMajor.push(`【结丹】结成「${chosen.name}」，此后战力长久提升。${chosen.desc}`);
          this.pushRumor(`【五域风闻】「${c.name}」结丹，丹成「${chosen.name}」。`);
        }
        recomputeDerived(c);
        c.hp = c.maxHp;
        c.mp = c.maxMp;
        if (REALMS[c.realm]?.tribulation) {
          s.stats.tribulations++;
          return this.startTribulation([prefix, ...extraMajor].filter(Boolean).join('\n'));
        }
        s.scene = {
          id: 'hub',
          result: {
            text: `${prefix ? `${prefix}\n\n` : ''}灵气化液，经脉拓宽。你踏入【${realmLabel(c)}】，可同时修的功法增至 ${maxTechSlots(c.realm)} 部。`,
            lines: [`大境突破：${realmLabel(c)}`, ...extraMajor],
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
    // v8：天劫随境界加重（结丹/元婴三重，化神起四重，大乘起五重）
    const r = s.char.realm || 0;
    const total = 3 + (r >= 4 ? 1 : 0) + (r >= 7 ? 1 : 0);
    s.tribulation = { stage: 1, total, logs: [prefix].filter(Boolean) };
    this.emit();
  }

  buildTribulationNode() {
    const s = this.state;
    const t = s.tribulation || { stage: 1, total: 3, logs: [] };
    const realm = REALMS[s.char.realm];
    const lawResist = lawBonusSum(s.char, 'tribulationResist') + (petBonuses(s.char).tribResist || 0);
    // v8：天劫要有真风险（原先成算 88%、连败三次才会死，等于必过）
    const jPen = jieshuMods(s.char.jieshu || 0).breakPenalty / 100;
    const p = clamp(0.8 - s.char.realm * 0.03 + Math.min(s.char.attrs.道心, 100) * 0.0015 + lawResist - s.char.demon * 0.003 - jPen, 0.25, 0.95);
    return {
      id: 'tribulation',
      title: `天劫 · 第${t.stage}重`,
      text: `天色骤暗，墨云压顶，紫霄神雷在云海翻滚。${realm.name}之劫，既是天道拷问，亦是脱凡洗礼。\n\n第${t.stage}重天雷正在凝聚。${t.logs?.length ? `\n\n${t.logs.slice(-2).join('\n')}` : ''}`,
      choices: [
        { label: '以肉身硬抗', hint: `成算 ${Math.round(p * 100)}% · 淬炼道体但气血消耗重`, action: 'tribulationStage', params: { p, mode: 'body' } },
        { label: '祭出本命法宝抵御', hint: '耗三成灵力，成算 +6%，护身减伤', action: 'tribulationStage', params: { p: Math.min(0.95, p + 0.06), mode: 'artifact' }, require: 'char.mp >= char.maxMp * 0.3', requireHint: '灵力不足以御使法宝' },
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
    const lawResist = clamp(lawBonusSum(s.char, 'tribulationResist') + (petBonuses(s.char).tribResist || 0), 0, 0.5);
    const rootDmgMult = (s.char.rootId === 'lei' ? 0.7 : s.char.rootId === 'hundun' ? 1.3 : 1) * (1 - lawResist);
    const ok = this.rng.chance(ch.params.p);
    if (!ok) {
      s.char.hp = Math.max(0, s.char.hp - Math.round(s.char.maxHp * 0.5 * rootDmgMult));
      s.char.injuries = (s.char.injuries || 0) + 2;
      s.char.demon = clamp(s.char.demon + 6, 0, 100);
      s.char.bonusLifespan = (s.char.bonusLifespan || 0) - 120;
      recomputeDerived(s.char);
      t.logs.push(`第${t.stage}重紫雷劈落。你半边身躯焦黑，受创极重。`);
      s.scene.fx = 'tribulation_hit';
      if (s.char.hp <= 0) {
        s.flags['渡劫失败'] = true;
        return this.finishEnding(this.pickNaturalEnding());
      }
      t.stage++;
      if (t.stage > t.total) {
        s.tribulation = null;
        s.flags['渡过天劫'] = (s.flags['渡过天劫'] || 0) + 1;
        s.scene = { id: 'hub', result: { text: '劫云散去。你虽捡回一命，此劫终未圆满，寿元折损十年。', lines: ['渡劫受创：寿元 -10 年'], fx: 'tribulation_hit' } };
        this.afterAction();
        this.emit();
        return;
      }
      this.emit();
      return;
    }
    const baseDmg = mode === 'body' ? 0.22 : 0.1;
    const dmg = Math.round(s.char.maxHp * baseDmg * rootDmgMult);
    s.char.hp = Math.max(1, s.char.hp - dmg);
    if (mode === 'artifact') s.char.mp = Math.max(0, s.char.mp - Math.round(s.char.maxMp * 0.3));
    if (mode === 'body' && dmg > s.char.maxHp * 0.25) s.char.injuries = (s.char.injuries || 0) + 1;
    t.logs.push(`第${t.stage}重神雷为你硬生生震散。${s.char.rootId === 'lei' ? '雷灵根鲸吞余电，反淬经脉。' : ''}`);
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
      const extraTrib = [`渡劫圆满：踏入 ${realmLabel(s.char)}`];
      if (s.char.goldenFingerId === 'gf_signin') {
        const bonusStones = Math.round(450 * Math.pow(REALMS[s.char.realm].powerMult, 0.55));
        s.char.stones += bonusStones;
        addItem(s, 'pozhang_dan', 1);
        extraTrib.push(`【${GOLDEN_FINGER_BY_ID.gf_signin?.name || '机缘'}】破境所得：灵石 +${bonusStones.toLocaleString()}，破障丹 ×1`);
      }
      this.pushRumor(`【五域风闻】「${s.char.name}」渡过三重天雷，踏入${REALMS[s.char.realm].name}之境。`);
      s.scene = {
        id: 'hub',
        result: {
          text: `劫云散尽，霞光漫天。你立于焦土之上，周身气机翻天覆地——你已真正踏入${REALMS[s.char.realm].name}之境。`,
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
    s.char.demon = clamp(s.char.demon + 20, 0, 100);
    recomputeDerived(s.char);
    s.scene = { id: 'hub', result: { text: '你散功避劫，劫云在头顶盘旋三匝后散去。境界跌落，心魔滋长，但你活了下来。', lines: ['境界跌落，心魔 +20'] } };
    this.afterAction();
    this.emit();
  }

  act_breakthrough() {
    this.state.scene = { id: 'breakthrough', result: null };
    this.emit();
  }

  act_backHub() { this.state.scene = { id: 'hub', result: null }; this.emit(); }

  /* ---------------- 战术斗法 2.0（敌手意图预告 + 守势蓄力反击 + 战斗符箓 + 法则领域 + 全特性实装） ---------------- */

  rollEnemyIntent(enemy, turn, hpRatio = 1) {
    if (turn % 3 === 0) {
      return { kind: 'heavy', label: '蓄力重击（可用守势化解并反击）', mult: 1.65 };
    }
    if (hpRatio < 0.5 && turn > 1 && this.rng.chance(0.32)) {
      return { kind: 'heal', label: '聚气疗伤（绝招或符箓可打断）', mult: 0.72 };
    }
    if (enemy.trait && turn % 2 === 0 && this.rng.chance(0.65)) {
      return { kind: 'special', label: `施展【${enemy.trait}】秘术`, mult: 1.15 };
    }
    return { kind: 'strike', label: '常规攻伐', mult: 1.0 };
  }

  bestCombatTalisman() {
    return COMBAT_TALISMAN_IDS.find((id) => hasItem(this.state, id)) || null;
  }

  startCombat(spec, { lines = [] } = {}) {
    const s = this.state;
    const defId = typeof spec === 'string' ? spec : spec.enemy;
    const def = ENEMY_BY_ID[defId];
    if (!def) { this.state.scene.result = { text: '敌手见势不妙，早已远遁。', lines }; return; }
    const preserve = typeof spec === 'object' && spec.preserveEnemyRealm;
    const customRealm = typeof spec === 'object' && spec.customRealm != null ? spec.customRealm : null;
    let enemy = (preserve || def.isRival) ? { ...def } : scaleEnemy(def, customRealm != null ? customRealm : s.char.realm);
    // 匹配境界：按境界战力倍率把敌手整体换算到指定境界（切磋、擂台用，避免高境界一招秒杀照拿全额奖励）
    if (typeof spec === 'object' && spec.matchRealm != null) {
      const from = REALMS[def.realm || 0]?.powerMult || 1;
      const to = REALMS[spec.matchRealm]?.powerMult || 1;
      const k = to / from;
      enemy = { ...enemy, realm: spec.matchRealm, hp: Math.round(def.hp * k), atk: Math.round(def.atk * k), def: Math.round(def.def * k), exp: Math.round(def.exp * k), stones: Math.round(def.stones * k) };
    }
    if (typeof spec === 'object' && spec.scaleMult != null && spec.scaleMult !== 1) {
      const sm = spec.scaleMult;
      enemy = { ...enemy, hp: Math.max(12, Math.round(enemy.hp * sm)), atk: Math.max(4, Math.round(enemy.atk * sm)), def: Math.max(1, Math.round(enemy.def * sm)) };
    }
    // v8：宿敌显示其名；劫数让敌手更凶
    if (def.isRival && s.flags['宿敌名']) enemy.name = s.flags['宿敌名'];
    if (typeof spec === 'object' && spec.displayName) enemy.name = spec.displayName;
    const jm = jieshuMods(s.char.jieshu || 0);
    if (jm.enemyMult > 1) {
      enemy.hp = Math.round(enemy.hp * jm.enemyMult);
      enemy.atk = Math.round(enemy.atk * jm.enemyMult);
    }
    s.stats.encounters = (s.stats.encounters || 0) + 1;
    const intent = this.rollEnemyIntent(enemy, 1, 1);
    s.combat = {
      enemy, hp: enemy.hp, maxHp: enemy.hp, turn: 1, log: [...lines], introCount: lines.length,
      intent,
      counterReady: false,
      domainTurns: 0,
      domainUsed: false,
      onWin: typeof spec === 'object' ? spec.win || null : null,
      onLose: typeof spec === 'object' ? spec.lose || null : null,
    };
    s.scene = { id: 'combat', result: null };
    this.emit();
  }

  bestSignatureArt() {
    const c = this.state.char;
    const withArt = activeTechniques(c).filter((t) => t.artName);
    if (withArt.length) return withArt[withArt.length - 1].artName;
    if (c.artifactLevel > 0) return `本命「${c.artifactName}」剑意绝杀`;
    return '周天灵压绝杀';
  }

  buildCombatNode() {
    const s = this.state;
    const cb = s.combat;
    if (!cb) return buildHub(this);
    const c = s.char;
    const e = cb.enemy;
    const artName = this.bestSignatureArt();
    const traitTag = e.trait ? `【特性：${e.trait}】` : '';
    const realmTag = REALMS[e.realm]?.name || '炼气';
    if (!cb.intent) cb.intent = this.rollEnemyIntent(e, cb.turn || 1, cb.hp / Math.max(1, cb.maxHp));
    const statusTags = [];
    if (cb.counterReady) statusTags.push('【可反击：下一击必中要害】');
    if (cb.domainTurns > 0) statusTags.push(`【领域：余 ${cb.domainTurns} 合】`);
    const talismanId = this.bestCombatTalisman();
    const talismanDef = talismanId ? ITEM_BY_ID[talismanId] : null;
    const mainLaw = LAW_BY_ID[defaultLawFor(c)];
    const canDomain = maxLawLevel(c) >= 1 && !cb.domainUsed;

    const choices = [
      {
        label: cb.counterReady ? '反击' : '出剑',
        hint: cb.counterReady
          ? `反击，必中要害（攻 ${this.playerAtk().toLocaleString()}）`
          : `以兵刃攻击（攻 ${this.playerAtk().toLocaleString()}）`,
        action: 'combatAttack',
        effect: cb.counterReady ? 'primary' : '',
      },
      { label: '施展法术', hint: `耗 12% 灵力，神识破甲（术 ${this.playerSpellAtk().toLocaleString()}）`, action: 'combatSpell', require: 'char.mp >= char.maxMp * 0.12', requireHint: '灵力不足以施展法术' },
      {
        label: `绝招 · ${artName}`,
        hint: cb.intent.kind === 'heal' ? '耗 24% 灵力 · 可打断对方疗伤' : '耗 24% 灵力，大半防御挡不住',
        action: 'combatArt',
        require: 'char.mp >= char.maxMp * 0.24',
        requireHint: '灵力不足以施展绝招',
      },
      {
        label: cb.intent.kind === 'heavy' ? '守势化劲' : '守势',
        hint: cb.intent.kind === 'heavy' ? '挡下大半伤害，下一合可反击' : '挡下大半伤害，抵御毒煞并回些灵力',
        action: 'combatGuard',
        effect: cb.intent.kind === 'heavy' ? 'primary' : '',
      },
    ];
    if (talismanDef) {
      choices.push({
        label: `祭符 · ${talismanDef.name}`,
        hint: '用掉一张符 · 破甲，并打断对方蓄力或疗伤',
        action: 'combatTalisman',
        params: { itemId: talismanId },
      });
    }
    if (canDomain) {
      choices.push({
        label: `展开 · ${mainLaw?.name || '大道'}法则领域`,
        hint: '每战一次 · 三合内攻守大增',
        action: 'combatDomain',
        effect: 'primary',
      });
    }
    choices.push(
      {
        label: '服丹',
        hint: '大还丹 / 碧血丹 / 疗伤丹 / 回灵丹',
        action: 'combatPill',
        require: 'has("dahuan_dan") || has("bixue_dan") || has("liaoshang_dan") || has("huiling_dan") || has("jiexin_dan")',
        requireHint: '储物袋无战斗丹药',
      },
      { label: '遁走', hint: '风灵根/空间法则/神行符大幅提升遁速', action: 'combatFlee' },
    );

    return {
      id: 'combat',
      title: `斗法 · ${e.name}（${realmTag}）`,
      // 敌手意图已在场景上方的战况条里显示，正文只留描述和最近四句交手
      text: `${e.desc}${traitTag ? ` ${traitTag}` : ''}${statusTags.length ? `\n${statusTags.join(' ')}` : ''}\n\n${cb.log.slice(Math.max(cb.introCount || 0, cb.log.length - 4)).join('\n')}`,
      choices,
    };
  }

  /** 战后只留要紧的：开打前的交代、最后两句交手、所有【】标出的大事和战利。 */
  combatSummary(log, cb) {
    const intro = log.slice(0, cb?.introCount || 0);
    const rest = log.slice(cb?.introCount || 0);
    const key = rest.filter((l) => l.startsWith('【') || /伏诛|搜得|灵石|修为 \+/.test(l));
    const tail = rest.filter((l) => !key.includes(l)).slice(-2);
    return [...intro, ...tail, ...key];
  }

  playerAtk() {
    const c = this.state.char;
    const pm = REALMS[c.realm]?.powerMult || 1;
    const layerMult = 1 + (c.layer || 0) * 0.1;
    const qMult = qualityMultiplier(c);
    const best = c.inventory.reduce((max, it) => Math.max(max, ITEM_BY_ID[it.id]?.equip?.atk || 0), 0);
    const craftBoost = sectPerks(c).craft ? 1.1 : 1;
    const artifactMult = 1 + (c.artifactLevel || 0) * 0.08 * craftBoost;
    const sectAtk = sectPerks(c).atk || 0;
    const techAtk = activeTechniques(c).reduce((acc, t) => acc + (t.atk || 0), 0)
      + techCollectionBonus(c)
      + techAlignmentConflict(c).evilMasteryBonus;
    const rootAtk = c.rootId === 'jin' ? 0.2 : c.rootId === 'xue' ? 0.15 : 0;
    const gfAtk = c.goldenFingerId === 'gf_sword_elder' ? 0.14 : 0; // +0.06 starting tech = exact +20%
    const petAtk = petBonuses(c).atk || 0;
    const titleAtk = titleBonuses(c).atk || 0;
    const lawAtk = lawBonusSum(c, 'atk');
    const domainMult = (this.state.combat?.domainTurns || 0) > 0 ? 1.3 : 1;
    const statTerm = Math.min(c.attrs.根骨, 160) * 0.65;
    return Math.round(
      (14 + statTerm + best * 0.35) * pm * layerMult * qMult * artifactMult * domainMult
      * (1 + sectAtk + techAtk + rootAtk + gfAtk + petAtk + titleAtk + lawAtk),
    );
  }

  playerSpellAtk() {
    const c = this.state.char;
    const pm = REALMS[c.realm]?.powerMult || 1;
    const layerMult = 1 + (c.layer || 0) * 0.1;
    const qMult = qualityMultiplier(c);
    const craftBoost = sectPerks(c).craft ? 1.1 : 1;
    const artifactMult = 1 + (c.artifactLevel || 0) * 0.08 * craftBoost;
    const techAtk = activeTechniques(c).reduce((acc, t) => acc + (t.atk || 0), 0) + techCollectionBonus(c);
    const lawAtk = lawBonusSum(c, 'atk');
    const titleAtk = titleBonuses(c).atk || 0;
    const arrayBoost = sectPerks(c).array ? 0.12 : 0;
    const rootSpell = c.rootId === 'jin' ? 0.2 : 0;
    const domainMult = (this.state.combat?.domainTurns || 0) > 0 ? 1.3 : 1;
    const statTerm = Math.min(c.attrs.神识, 160) * 0.8;
    return Math.round((16 + statTerm) * pm * layerMult * qMult * artifactMult * domainMult * (1 + techAtk * 0.75 + lawAtk + titleAtk + arrayBoost + rootSpell));
  }

  playerDef() {
    const c = this.state.char;
    const pm = REALMS[c.realm]?.powerMult || 1;
    const layerMult = 1 + (c.layer || 0) * 0.1;
    const qMult = qualityMultiplier(c);
    const craftBoost = sectPerks(c).craft ? 1.1 : 1;
    const artifactMult = 1 + (c.artifactLevel || 0) * 0.08 * craftBoost;
    const bestDef = c.inventory.reduce((max, it) => Math.max(max, ITEM_BY_ID[it.id]?.equip?.def || 0), 0);
    const sectDef = sectPerks(c).def || 0;
    const techDef = activeTechniques(c).reduce((acc, t) => acc + (t.def || 0), 0);
    const lawDef = lawBonusSum(c, 'def');
    const titleDef = titleBonuses(c).def || 0;
    const domainMult = (this.state.combat?.domainTurns || 0) > 0 ? 1.3 : 1;
    const statTerm = Math.min(c.attrs.根骨, 160) * 0.32;
    return Math.round((4 + statTerm + bestDef * 0.4) * pm * layerMult * qMult * artifactMult * domainMult * (1 + sectDef + techDef + lawDef + titleDef));
  }

  act_combatAttack() { return this.combatRound('attack'); }
  act_combatSpell() { return this.combatRound('spell'); }
  act_combatArt() { return this.combatRound('art'); }
  act_combatGuard() { return this.combatRound('guard'); }
  act_combatFlee() { return this.combatRound('flee'); }

  act_combatTalisman(ch = {}) {
    const id = ch.params?.itemId || this.bestCombatTalisman();
    if (!id || !hasItem(this.state, id)) return { error: '储物袋无可用战符' };
    return this.combatRound('talisman', { itemId: id });
  }

  act_combatDomain() {
    const s = this.state;
    const cb = s.combat;
    if (!cb || cb.domainUsed || maxLawLevel(s.char) < 1) return { error: '尚未展开法则领域条件' };
    return this.combatRound('domain');
  }

  act_combatPill() {
    const s = this.state;
    const c = s.char;
    let used = '';
    const healMult = (c.rootId === 'mu' ? 1.3 : 1) * (c.goldenFingerId === 'gf_bottle' ? 1.2 : 1);
    const useDahuan = () => {
      removeItem(s, 'dahuan_dan', 1);
      const hpG = Math.round(c.maxHp * 0.75 * healMult);
      const mpG = Math.round(c.maxMp * 0.5);
      c.hp = Math.min(c.maxHp, c.hp + hpG);
      c.mp = Math.min(c.maxMp, c.mp + mpG);
      return `大还丹（气血 +${hpG.toLocaleString()}，灵力 +${mpG.toLocaleString()}）`;
    };
    if (hasItem(s, 'dahuan_dan') && (c.hp < c.maxHp * 0.55 || c.mp < c.maxMp * 0.4)) {
      used = useDahuan();
    } else if (hasItem(s, 'bixue_dan') && c.hp < c.maxHp * 0.85) {
      removeItem(s, 'bixue_dan', 1);
      const hpG = Math.round(c.maxHp * 0.45 * healMult);
      c.hp = Math.min(c.maxHp, c.hp + hpG);
      used = `碧血生肌丹（气血 +${hpG.toLocaleString()}）`;
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
    } else if (hasItem(s, 'jiexin_dan')) {
      removeItem(s, 'jiexin_dan', 1);
      const hpG = Math.round(c.maxHp * 0.25 * healMult);
      c.hp = Math.min(c.maxHp, c.hp + hpG);
      c.demon = Math.max(0, c.demon - 8);
      used = `清毒解障丹（气血 +${hpG.toLocaleString()}，心魔 -8）`;
    } else if (hasItem(s, 'dahuan_dan')) {
      used = useDahuan();
    } else {
      return { error: '储物袋无战斗丹药' };
    }
    s.stats.pills = (s.stats.pills || 0) + 1;
    s.combat.log.push(`你迅速吞服${used}。`);
    return this.combatRound('item');
  }

  combatRound(mode, extra = {}) {
    const s = this.state;
    const cb = s.combat;
    if (!cb) return;
    const c = s.char;
    const e = cb.enemy;
    const log = cb.log;
    const intent = cb.intent || { kind: 'strike', mult: 1 };
    let interrupted = false;

    if (mode === 'flee') {
      const hasTalisman = (s.buffs.escape || 0) > 0 || hasItem(s, 'shenxing_fu');
      const stealthBonus = c.goldenFingerId === 'gf_stealth' ? 0.25 : 0;
      const spaceLaw = lawBonusSum(c, 'flee');
      const chance = (c.rootId === 'feng' || hasTalisman) ? 1 : clamp(0.45 + c.attrs.气运 * 0.01 + stealthBonus + spaceLaw, 0.2, 0.96);
      if (this.rng.chance(chance)) {
        if (c.rootId !== 'feng') {
          if ((s.buffs.escape || 0) > 0) s.buffs.escape--;
          else if (hasItem(s, 'shenxing_fu')) removeItem(s, 'shenxing_fu', 1);
        }
        log.push(c.rootId === 'feng' ? '风灵根御风而起，瞬息千里脱身。' : hasTalisman ? '神行符化作青风托身，你瞬息千里。' : '你寻隙抽身而退。');
        s.stats.escapes = (s.stats.escapes || 0) + 1;
        s.combat = null;
        s.faceSlap = null; // 逃出遇事斗法，这场风波就算了结
        if (s.delve) {
          const escapeLines = this.bankDelveHaul(0.5, false);
          s.scene = { id: 'regionHub', result: { text: '你催动遁术强行脱离秘境，保住性命并带出半数战利。', lines: [...log.slice(-1), ...escapeLines], returnTo: 'regionHub' } };
        } else {
          s.scene = { id: 'hub', result: { text: '你成功脱身。留得青山在，来日再论高低。', lines: log.slice(-2) } };
        }
        this.emit();
        return;
      }
      log.push('敌手杀机封锁退路，遁术未能奏效。');
    }

    const sunMult = c.rootId === 'taiyang' && e.isDemon ? 1.4 : 1;
    const armorMult = e.trait === '护甲' ? 1.35 : 1;
    const bestEquipCrit = c.inventory.reduce((m, it) => Math.max(m, ITEM_BY_ID[it.id]?.equip?.crit || 0), 0) / 100;
    const eraCrit = currentWorldEra(s).crit || 0;
    const critChance = clamp(0.08 + (c.attrs.气运 + (petBonuses(c).luck || 0)) * 0.004 + lawBonusSum(c, 'crit') + bestEquipCrit + eraCrit, 0.05, 0.72);
    const lifesteal = lawBonusSum(c, 'lifesteal');
    let dealt = 0;

    if (mode === 'attack') {
      const counter = cb.counterReady;
      cb.counterReady = false;
      if (!counter && e.trait === '虚空' && this.rng.chance(0.18)) {
        log.push(`${e.name}【虚空闪烁】化实为虚，你的平剑斩空了。`);
      } else {
        const crit = counter || this.rng.chance(critChance);
        const cMult = counter ? 1.55 : 1;
        const dmg = Math.max(1, Math.round(this.playerAtk() * sunMult * cMult * (crit ? 1.75 : 1) - e.def * (counter ? 0.2 : 0.45) * armorMult));
        cb.hp -= dmg;
        dealt = dmg;
        s.scene.fx = 'combat_slash';
        log.push(`${counter ? '【蓄势反击】剑随身走破尽破绽。' : crit ? '剑光破空，正中要害。' : '你一剑斩出。'}造成 ${dmg.toLocaleString()} 伤害。`);
      }
    } else if (mode === 'art') {
      const counter = cb.counterReady;
      cb.counterReady = false;
      const cost = Math.round(c.maxMp * 0.24);
      c.mp = Math.max(0, c.mp - cost);
      const dmg = Math.max(2, Math.round((this.playerAtk() * 1.7 + this.playerSpellAtk() * 0.45) * sunMult * (counter ? 1.35 : 1) - e.def * 0.15));
      cb.hp -= dmg;
      dealt = dmg;
      if (intent.kind === 'heal') interrupted = true;
      s.scene.fx = 'combat_slash';
      log.push(`【${this.bestSignatureArt()}】破开护体灵光，重创 ${dmg.toLocaleString()} 伤害${interrupted ? '并打断敌手疗伤。' : '。'}`);
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
    } else if (mode === 'talisman') {
      const tid = extra.itemId;
      if (removeItem(s, tid, 1)) {
        const tdef = ITEM_BY_ID[tid];
        let mult = 1.9;
        if (tid === 'jianqi_fu') mult = 2.0;
        else if (tid === 'poxie_fu') { mult = e.isDemon ? 2.4 : 1.7; c.demon = Math.max(0, c.demon - 8); s.buffs.shield = (s.buffs.shield || 0) + 1; }
        else if (tid === 'jiuxiao_leifu') { mult = 2.6; s.buffs.shield = (s.buffs.shield || 0) + 1; }
        else if (tid === 'taiyi_hudaofu') { mult = 3.2; s.buffs.shield = (s.buffs.shield || 0) + 2; c.hp = Math.min(c.maxHp, c.hp + Math.round(c.maxHp * 0.35)); }
        const dmg = Math.max(2, Math.round(Math.max(this.playerAtk(), this.playerSpellAtk()) * mult * sunMult - e.def * 0.1));
        cb.hp -= dmg;
        dealt = dmg;
        interrupted = true;
        s.scene.fx = 'combat_spell';
        log.push(`祭出【${tdef?.name || tid}】。神光炸裂轰出 ${dmg.toLocaleString()} 破甲伤害并震散敌手蓄势。`);
      }
    } else if (mode === 'domain') {
      cb.domainUsed = true;
      cb.domainTurns = 3;
      const mainLaw = LAW_BY_ID[defaultLawFor(c)];
      const lawLvl = Math.max(1, maxLawLevel(c));
      const dmg = Math.max(2, Math.round((this.playerAtk() * 1.1 + this.playerSpellAtk() * 0.9) * (1 + lawLvl * 0.15) - e.def * 0.1));
      cb.hp -= dmg;
      dealt = dmg;
      interrupted = true;
      s.scene.fx = 'breakthrough';
      log.push(`【${mainLaw?.name || '大道'}法则领域】轰然展开（持续 3 合，攻防 +30%）。法则威压震伤 ${dmg.toLocaleString()} 并打断敌招。`);
    } else if (mode === 'guard') {
      c.mp = Math.min(c.maxMp, c.mp + Math.round(c.maxMp * 0.16));
      if (intent.kind === 'heavy') {
        cb.counterReady = true;
        log.push('你稳扎马步以守待攻，看破敌手蓄力破绽——【蓄势反击】已就绪。');
      } else {
        log.push('你收剑结印护体，化解来势并吐纳回灵。');
      }
    } else if (mode === 'item') {
      s.scene.fx = 'heal';
    }

    if (dealt > 0 && lifesteal > 0) {
      const vamp = Math.max(1, Math.round(dealt * lifesteal));
      c.hp = Math.min(c.maxHp, c.hp + vamp);
      log.push(`【血海法则】汲取气血 +${vamp.toLocaleString()}。`);
    }

    if (cb.hp <= 0 && e.isRival) {
      // 宿敌：多数段落里对方是败走而非伏诛，不计击杀、不发「力斩」传闻；斩不斩由剧情选项决定
      const onWin = cb.onWin;
      log.push(`${e.name}落败。`);
      s.counters.rival_wins = (s.counters.rival_wins || 0) + 1;
      s.combat = null;
      s.scene = { id: 'hub', result: null };
      if (onWin) this.resolveOutcome(onWin, log);
      else s.scene.result = { text: '胜负已分。', lines: this.combatSummary(log, cb) };
      this.afterAction();
      this.emit();
      return;
    }

    if (cb.hp <= 0) {
      s.stats.kills++;
      if (e.id === 'demon_king') s.flags['斩妖王'] = true;
      if (e.isDemon) s.counters.demons_slain = (s.counters.demons_slain || 0) + 1;
      if (e.id === 'cultivator' && !c.inventory.some((it) => ITEM_BY_ID[it.id]?.equip)) s.flags['空手胜筑基'] = true;
      const eraLoot = 1 + (currentWorldEra(s).combatLoot || 0);
      // v8：越阶斩杀重赏；一招毙敌与境界压制单独播报
      const gap = (c.realm || 0) - (e.realm || 0);
      const upset = gap < 0 ? 1 + 0.8 * Math.min(3, -gap) : 1;
      const jLoot = jieshuMods(c.jieshu || 0).lootMult;
      const devour = c.goldenFingerId === 'gf_devour';
      const exp = Math.round(e.exp * (1 + c.attrs.气运 * 0.01) * eraLoot * upset * (devour ? 1.6 : 1));
      const stones = Math.round(e.stones * (1 + (petBonuses(c).stones || 0)) * eraLoot * upset * jLoot);
      c.stones += stones;
      const gained = gainExp(s, exp);
      if (cb.turn <= 1 && dealt >= cb.maxHp) {
        s.counters.one_hit_kills = (s.counters.one_hit_kills || 0) + 1;
        log.push(gap >= 1
          ? `【境界压制】${e.name}在你的气机之下连护体灵光都未能撑起，一招毙命。`
          : `【一击毙敌】${e.name}尚未出手，已被你一招斩落。`);
        s.scene.fx = 'breakthrough';
      }
      if (gap < 0) {
        s.counters.yuejie_kills = (s.counters.yuejie_kills || 0) + 1;
        s.flags['越阶斩敌'] = true;
        log.push(`【越阶斩杀】以${REALMS[c.realm]?.name}之身斩落${REALMS[e.realm]?.name || '强敌'}，所得更丰。`);
        this.pushRumor(`【风闻】「${c.name}」以${REALMS[c.realm]?.name}修为越阶斩了${e.name}。`);
      }
      log.push(`${e.name}伏诛。搜得灵石 +${stones.toLocaleString()}，实战修为 +${gained.toLocaleString()}。`);
      if (devour) {
        c.demon = Math.min(100, (c.demon || 0) + 2);
        if (this.rng.chance(0.25)) {
          const k = this.rng.chance(0.5) ? '根骨' : '神识';
          c.attrs[k] += 1;
          log.push(`【吞天魔功】吞下${e.name}残存的精元，${k} +1。心魔 +2。`);
        } else log.push('【吞天魔功】精元入体，修为涨得更快。心魔 +2。');
      }
      if (e.realm >= 2) this.pushRumor(`【风闻】「${c.name}」在${c.location}斩了${e.name}。`);
      const onWin = cb.onWin;
      s.combat = null;
      s.scene = { id: 'hub', result: null };
      if (onWin) {
        this.resolveOutcome(onWin, log);
      } else {
        s.scene.result = { text: `交手 ${cb.turn} 合，${e.name}倒下了。你收势调息。`, lines: this.combatSummary(log, cb) };
      }
      this.afterAction();
      this.emit();
      return;
    }

    // 敌手回合结算（结合意图与打断）
    if (intent.kind === 'heal' && !interrupted) {
      const eHeal = Math.max(1, Math.round(cb.maxHp * 0.12));
      cb.hp = Math.min(cb.maxHp, cb.hp + eHeal);
      log.push(`${e.name}聚气疗伤，回复气血 +${eHeal.toLocaleString()}。`);
    }

    const defMult = (c.rootId === 'tu' ? 0.8 : 1)
      * (c.goldenFingerId === 'gf_stealth' ? 0.82 : 1)
      * (1 - Math.min(0.45, petBonuses(c).def || 0));
    const guardMult = mode === 'guard' ? (intent.kind === 'heavy' ? 0.3 : 0.4) : 1;
    let traitAtkMult = interrupted ? 0.72 : (intent.mult || 1);
    let defIgnore = 1;
    let traitNote = intent.kind === 'heavy' && !interrupted ? '【蓄力重击】' : '';

    if (!interrupted) {
      if (e.trait === '猛扑' && this.rng.chance(0.26)) { traitAtkMult *= 1.25; traitNote += '【猛扑】'; }
      else if (e.trait === '快刀' && this.rng.chance(0.28)) { traitAtkMult *= 1.22; traitNote += '【快刀连斩】'; }
      else if (e.trait === '剑意') { defIgnore = 0.65; }
      else if (e.trait === '天威') { traitAtkMult *= 1.12; if (mode !== 'guard') c.demon = clamp(c.demon + 1, 0, 100); }
      else if (e.trait === '水煞') { traitAtkMult *= 1.08; c.mp = Math.max(0, c.mp - Math.round(c.maxMp * 0.06)); traitNote += '【水煞】'; }
      else if (e.trait === '心魔') { traitAtkMult *= 1 + c.demon * 0.004; }
    }

    const effectiveDef = this.playerDef() * defIgnore;
    let edmg = Math.max(1, Math.round((e.atk * traitAtkMult * guardMult - effectiveDef * 0.55) * defMult));
    if (e.trait === '毒煞' && mode !== 'guard' && !interrupted) {
      const poison = Math.max(1, Math.round(c.maxHp * 0.045));
      edmg += poison;
      traitNote += '【毒煞蚀体】';
    }
    c.hp -= edmg;
    if (e.trait === '噬灵' && !interrupted) {
      const drain = Math.round(c.maxMp * 0.08);
      c.mp = Math.max(0, c.mp - drain);
      traitNote += '【噬灵】';
    }
    if (e.trait === '血煞' && !interrupted) {
      const eHeal = Math.max(1, Math.round(edmg * 0.25));
      cb.hp = Math.min(cb.maxHp, cb.hp + eHeal);
      traitNote += `【血煞回气 +${eHeal.toLocaleString()}】`;
    }
    log.push(`${e.name}${traitNote}反击，你受了 ${edmg.toLocaleString()} 点伤。`);
    cb.turn++;
    if (cb.domainTurns > 0) cb.domainTurns--;
    cb.intent = this.rollEnemyIntent(e, cb.turn, cb.hp / Math.max(1, cb.maxHp));

    if (c.hp <= 0) {
      if ((s.buffs.shield || 0) > 0 || hasItem(s, 'huxin_fu')) {
        if ((s.buffs.shield || 0) > 0) s.buffs.shield--;
        else removeItem(s, 'huxin_fu', 1);
        c.hp = Math.max(1, Math.round(c.maxHp * 0.18));
        log.push('怀中护心符轰然碎裂，一道金光替你挡下必杀一击。');
        s.scene.fx = 'heal';
        this.emit();
        return;
      }
      const onLose = cb.onLose;
      s.combat = null;
      s.scene = { id: 'hub', result: null };
      if (onLose) {
        // 关键修复：所有非致死事件战败分支（如切磋/擂台/逃脱）保留残血，绝不再于点击继续时暴毙！
        if (!onLose.ending) c.hp = Math.max(1, Math.round(c.maxHp * 0.12));
        this.resolveOutcome(onLose, log);
        if (!onLose.ending && c.hp <= 0) c.hp = 1;
      } else {
        this.finishEnding(this.pickNaturalEnding());
      }
      this.emit();
      return;
    }
    this.emit();
  }

  /* ---------------- 结局 / 成就（跨世死亡计数 + 成就换轮回点） ---------------- */

  finishEnding(id) {
    const s = this.state;
    const ending = ENDING_BY_ID[id] || ENDINGS[ENDINGS.length - 1];
    if (s.flags.finished) return;
    s.flags.finished = true;
    s.flags.endingId = ending.id;
    s.scene = { id: 'ending', result: null };
    const firstTime = !s.meta.unlockedEndings.includes(ending.id);
    if (firstTime) s.meta.unlockedEndings.push(ending.id);
    s.meta.runs = (s.meta.runs || 0) + 1;
    s.meta.totalDeaths = (s.meta.totalDeaths || 0) + 1;
    // v8：轮回点 = 保底 + 境界 + 首见结局（按品阶）× 劫数倍率
    const karma = endingKarma({
      ending, firstTime, realm: s.char.realm, jieshu: s.char.jieshu || 0, pureMortal: s.char.goldenFingerId === 'gf_none',
    });
    s.meta.karmaPoints = (s.meta.karmaPoints || 0) + karma.total;
    recordLifeStats(s.meta, s);
    const unlocks = refreshUnlocks(s.meta);
    s.endingReport = { firstTime, karma, unlocks };
    s.stats.deaths++;
    this.pushLog(`结局：${ending.name}`);
    this.checkAchievements();
    this.emit();
  }

  buildEndingNode() {
    const s = this.state;
    const ending = ENDING_BY_ID[s.flags.endingId] || ENDINGS[ENDINGS.length - 1];
    const rep = s.endingReport || {};
    const year = worldYear(s);
    const rewrites = s.rewrites || [];
    const slots = jieshuMods(s.char.jieshu || 0).legacySlots;
    const picked = s.legacyPicks || [];
    const opts = legacyOptions(s);
    const lines = [
      formatText(ending.text, s),
      '',
      `—— ${s.char.name}，殁于第一纪元第 ${year} 年，享年 ${Math.floor(s.char.age / 12)} 岁，${realmLabel(s.char)}。${rep.firstTime ? '（新收录结局）' : ''}`,
      `此生：亲历大事 ${Object.values(s.history || {}).filter((h) => h.source === '亲历').length} 件 · 改写历史 ${rewrites.length} 件 · 突破 ${s.stats.breakthroughs} 次 · 斩敌 ${s.stats.kills}`,
      ...rewrites.slice(-5).map((r) => `　第${r.year}年：${r.text}`),
      rep.karma ? `轮回点 +${rep.karma.total}${rep.karma.first ? `（其中新结局 ${rep.karma.first}）` : ''}` : '',
      rep.unlocks?.length ? `新解锁：${rep.unlocks.join('、')}` : '',
      `前世手札已记 ${Object.keys(s.meta.handbook || {}).length} 件大事 · 结局 ${s.meta.unlockedEndings.length}/${ENDINGS.length}`,
      opts.length ? `\n【前世遗泽】可带入来世 ${slots} 样（已择 ${picked.length}）：` : '',
    ].filter((x) => x !== '');
    const choices = opts.map((o) => {
      const on = picked.some((p) => p.kind === o.kind && p.id === o.id);
      return {
        label: `${on ? '✓ ' : ''}${o.label}`,
        hint: on ? '已择，再点取消' : (picked.length >= slots ? '名额已满' : '带入来世'),
        action: 'pickLegacy',
        params: { kind: o.kind, id: o.id },
        disabled: !on && picked.length >= slots,
      };
    });
    choices.push({ label: '魂归第一年', hint: '带着手札与遗泽，回到青石镇河湾渡口', action: 'reincarnate', effect: 'primary' });
    choices.push({ label: '回看此生', hint: '查看战力、法则与成就总览', action: 'fate' });
    return { id: 'ending', title: ending.name, text: lines.join('\n'), choices };
  }

  act_pickLegacy(ch) {
    const s = this.state;
    const { kind, id } = ch.params || {};
    const picked = s.legacyPicks || [];
    const idx = picked.findIndex((p) => p.kind === kind && p.id === id);
    if (idx >= 0) picked.splice(idx, 1);
    else if (picked.length < jieshuMods(s.char.jieshu || 0).legacySlots) {
      const opt = legacyOptions(s).find((o) => o.kind === kind && o.id === id);
      if (opt) picked.push(opt);
    }
    s.legacyPicks = picked;
    setLegacy(s.meta, picked);
    this.emit();
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
    s.counters.laws = Object.values(s.char.laws || {}).reduce((a, b) => a + Number(b || 0), 0);
    s.counters.handbook_size = Object.keys(s.meta?.handbook || {}).length;
    s.counters.max_faction_dread = Math.max(0, ...Object.values(s.factionDread || {}).map(Number));
    // v8：第一纪元终局（五种纪元结局）记进跨世存档
    if (s.flags.e1d_end && !(s.meta.era1Endings || []).includes(s.flags.e1d_end)) {
      s.meta.era1Endings = [...(s.meta.era1Endings || []), s.flags.e1d_end];
    }
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
    // 成就奖励轮回点：隐藏/天/仙阶直接赐予 + 每累计5项成就额外 +1 轮回点
    let karmaAdd = a.karmaReward || 0;
    const totalAch = Object.keys(s.meta.achievements).length;
    const expectedBuckets = Math.floor(totalAch / 5);
    const grantedBuckets = s.meta.achKarmaGranted || 0;
    if (expectedBuckets > grantedBuckets) {
      karmaAdd += (expectedBuckets - grantedBuckets);
      s.meta.achKarmaGranted = expectedBuckets;
    }
    if (karmaAdd > 0) {
      s.meta.karmaPoints = (s.meta.karmaPoints || 0) + karmaAdd;
    }
    if (this.meta && this.meta !== s.meta) {
      this.meta.achievements[id] = s.meta.achievements[id];
      this.meta.karmaPoints = s.meta.karmaPoints;
      this.meta.achKarmaGranted = s.meta.achKarmaGranted;
    }
    return a.name;
  }

  hasAchievement(id) {
    return Boolean(this.state?.meta.achievements?.[id]);
  }

  /* ---------------- 坊市 / 招徒 ---------------- */

  sellRate() {
    const s = this.state;
    const tradeBonus = sectPerks(s.char).trade ? 0.15 : 0;
    const eraBonus = currentWorldEra(s).sellBonus || 0;
    const raw = Math.min(0.85, 0.55 + tradeBonus + eraBonus * 0.5);
    // 审计修复：折扣叠满时买入价可低于回收价，买卖不耗时即可凭空刷钱。回收价永远不高于自己买入价的九成
    return Math.min(raw, this.shopDiscountMult() * 0.9);
  }

  buildSellNode() {
    const s = this.state;
    const rate = this.sellRate();
    const sellable = s.char.inventory.filter((it) => (ITEM_BY_ID[it.id]?.price || 0) > 0 && it.qty > 0);
    const perPage = 8;
    const totalPages = Math.max(1, Math.ceil(sellable.length / perPage));
    const page = clamp(Number(s.scene.page) || 0, 0, totalPages - 1);
    const slice = sellable.slice(page * perPage, (page + 1) * perPage);
    const choices = slice.map((it) => {
      const def = ITEM_BY_ID[it.id];
      const price = Math.round(def.price * rate);
      return {
        id: `sell_${it.id}`,
        label: `卖 ${def.name} ×1（${price.toLocaleString()} 灵石）`,
        hint: `持有 ${it.qty} 件 · 回收价 ${Math.round(rate * 100)}%`,
        action: 'sellItem',
        params: { id: it.id, price, page },
      };
    });
    if (totalPages > 1) {
      if (page > 0) choices.push({ id: 'sell_prev', label: `上一页（${page}/${totalPages}）`, hint: '', action: 'sellMenu', params: { page: page - 1 } });
      if (page < totalPages - 1) choices.push({ id: 'sell_next', label: `下一页（${page + 2}/${totalPages}）`, hint: '', action: 'sellMenu', params: { page: page + 1 } });
    }
    const lowExtras = sellable.filter((it) => {
      const def = ITEM_BY_ID[it.id];
      return def && (def.tier === '凡' || def.tier === '黄') && def.type === '灵材' && it.qty > 2;
    });
    if (lowExtras.length) {
      choices.push({
        id: 'sell_bulk_low',
        label: '卖掉多余的低品灵材',
        hint: '每种保留 2 份备用，其余折价变现',
        action: 'sellBulkLow',
      });
    }
    choices.push({ id: 'back_market', label: '返回商行', hint: '', action: 'marketBack' });
    return {
      id: 'sell',
      title: `出售灵材${totalPages > 1 ? `（第${page + 1}/${totalPages}页）` : ''}`,
      text: `老掌柜拨弄着算盘，只看成色不问来历（按原价 ${Math.round(rate * 100)}% 收）。`,
      choices,
    };
  }

  buildMarketNode() {
    const s = this.state;
    const region = REGION_BY_ID[s.char.regionId] || REGION_BY_ID.qingniu;
    const stock = region.marketItems?.length ? region.marketItems : ['liaoshang_dan', 'huiling_dan', 'yinqi_dan', 'zhuji_dan', 'huxin_fu', 'xuantie', 'leimu'];
    const discount = this.shopDiscountMult();
    const choices = stock
      .map((id) => ITEM_BY_ID[id])
      .filter(Boolean)
      .map((it) => {
        const price = Math.round(it.price * discount);
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
    choices.push({ id: 'back', label: '离开商行', hint: '回市集坊间', action: 'openCity' });
    return {
      id: 'market',
      title: `${region.name} · 灵材商行`,
      text: `商行架上陈列着「${region.name}」当令丹药与奇珍（眼下比原价便宜 ${Math.round(discount * 100)}%）。\n\n持有灵石：${s.char.stones.toLocaleString()}`,
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
    s.stats.goldSpent = (s.stats.goldSpent || 0) + price;
    addItem(s, id, 1);
    s.scene.result = {
      text: `你点清 ${price.toLocaleString()} 枚灵石推过柜台，掌柜将「${ITEM_BY_ID[id].name}」装入封灵玉盒递来。`,
      lines: [`购得 ${ITEM_BY_ID[id].name}`],
      returnTo: 'market',
    };
    this.checkAchievements();
    this.emit();
  }

  act_sellMenu(ch = {}) {
    const s = this.state;
    const sellable = s.char.inventory.filter((it) => (ITEM_BY_ID[it.id]?.price || 0) > 0 && it.qty > 0);
    if (!sellable.length) {
      s.scene.result = { text: '你翻了翻储物袋，眼下并无多余可售之物。', lines: [], returnTo: 'market' };
      this.emit();
      return;
    }
    const page = Math.max(0, Number(ch?.params?.page) || 0);
    s.scene = { id: 'sell', page, result: null };
    this.emit();
  }

  act_sellItem(ch) {
    const s = this.state;
    const { id, price, page = 0 } = ch.params;
    if (!removeItem(s, id, 1)) return { error: '没有这件东西' };
    s.char.stones += price;
    s.scene.result = {
      text: '掌柜验过成色，爽快奉上一袋灵石。',
      lines: [`出售 ${ITEM_BY_ID[id]?.name || id}，灵石 +${price.toLocaleString()}`],
      returnTo: 'sell',
      returnMeta: { page },
    };
    this.checkAchievements();
    this.emit();
  }

  act_sellBulkLow() {
    const s = this.state;
    const rate = this.sellRate();
    let total = 0;
    let count = 0;
    for (const it of [...s.char.inventory]) {
      const def = ITEM_BY_ID[it.id];
      if (!def || !(def.tier === '凡' || def.tier === '黄') || def.type !== '灵材' || it.qty <= 2) continue;
      const sellQty = it.qty - 2;
      if (removeItem(s, it.id, sellQty)) {
        total += Math.round(def.price * rate) * sellQty;
        count += sellQty;
      }
    }
    s.char.stones += total;
    s.scene.result = {
      text: count ? '掌柜拨动算盘清点成箱灵材，将整袋灵石推到你面前。' : '储物袋里没有多余的低品灵材。',
      lines: count ? [`卖出 ${count} 件低品灵材，收入灵石 +${total.toLocaleString()}`] : [],
      returnTo: 'sell',
    };
    this.checkAchievements();
    this.emit();
  }

  buildRecruitNode() {
    const s = this.state;
    const c = s.char;
    const ctx = contextOf(s, this);
    const inCooldown = Boolean(c.sectLeaveUntil && c.age < c.sectLeaveUntil);
    const cooldownY = inCooldown ? Math.ceil((c.sectLeaveUntil - c.age) / 12) : 0;
    const entryRank = this.entryRankForRealm(c.realm);
        const eligible = SECTS.filter((sect) => {
      if (sect.id === 'sanxiu') return true;
      try { return compileCondition(sect.requireExpr || 'true')(ctx); } catch { return true; }
    });
    const choices = eligible.map((sect) => {
      const banned = Boolean(c.sectBlacklist?.[sect.id]);
      const karmaBlocked = sect.align === '正' && c.karma <= -150;
      return {
        label: `${sect.name}（${sect.align}）${banned ? ' [已除名]' : ''}`,
        hint: banned ? '曾叛离此处，永不录用' : karmaBlocked ? '恶行太多，正道不收' : `入门即为「${sectRankName(sect.id, entryRank)}」 · ${sect.technique}`,
        action: 'joinSect',
        sectId: sect.id,
        disabled: banned || karmaBlocked || inCooldown,
        reason: banned ? '已被除名' : inCooldown ? `还需 ${cooldownY} 年` : '恶行太多',
      };
    });
    choices.push({ id: 'recruit_later', label: '暂不投身', hint: '以后再说', action: 'backHub' });
    return {
      id: 'recruit',
      title: '投身门户',
      text: `以下门户可以投身。${entryRank > 0 ? `以你${realmLabel(c)}的修为，入门可破格录用。` : '入门后从最低一级做起。'}${inCooldown ? `\n\n叛离原门户未满五年，还需 ${cooldownY} 年才能再投身。` : ''}`,
      choices,
    };
  }

  pushLog(text) {
    const s = this.state;
    if (!text) return;
    s.log.push({ t: text, at: s.char.age });
    if (s.log.length > 500) s.log.shift();
  }

  afterAction() {
    // 遇事若已离场（逃走、读档、被别的场景顶掉）而没结算，就地了结，免得一直挡住大事与剧情触发
    if (this.state?.faceSlap && !this.state.combat && this.state.scene?.id !== 'faceSlap' && this.state.scene?.result?.returnTo !== 'faceSlap') {
      this.state.faceSlap = null;
    }
    const s = this.state;
    if (!s || s.flags.finished) return;
    if (s.char.demon >= 100) return this.finishEnding(this.pickNaturalEnding());
    if (isDead(s)) {
      return this.finishEnding(this.pickNaturalEnding());
    }
    this.checkAchievements();
    // v8：第一纪元终局（第 10000 年）落定后，此世随纪元一同终结（无尽纪元尚未开放）
    if (s.flags.e1d_end && !s.scene.result && worldYear(s) >= 10000) {
      return this.finishEnding(this.pickNaturalEnding());
    }
    if (worldYear(s) > 10000 && !s.flags.e1d_end) {
      s.flags.e1d_end = 'era1_xiezuo';
      return this.finishEnding(this.pickNaturalEnding());
    }
    // v8 大历史：到年份的大事——不在场则化为风闻，在场则亲历
    const hist = tickHistory(s, this.registry);
    for (const n of hist.notes) {
      this.pushRumor(n);
      if (s.scene.result) s.scene.result.lines = [...(s.scene.result.lines || []), n];
    }
    // 仅在返回主界且无结果弹屏/战斗/天劫/秘境探幽/遇事交锋时才触发主线插播，绝不吞掉刚打开的奇遇或结果文本！
    const calm = !s.scene.result && !s.combat && !s.tribulation && !s.delve && !s.faceSlap;
    s.pendingChapter = null;
    if (calm && hist.open && (s.scene.id === 'hub' || s.scene.id === 'regionHub' || s.scene.id === 'cave')) {
      const preface = beginHistoryEvent(s, hist.open);
      this.openScene(hist.open.id);
      if (preface) s.scene.preface = preface;
      return;
    }
    if (s.scene.id !== 'hub' || !calm) return;
    const pending = this.pendingStory();
    if (pending) this.openScene(pending);
  }

  /** 开局：本地第一件大事直接开场（没有就停在主界）。 */
  openFirstHistory() {
    const s = this.state;
    const hist = tickHistory(s, this.registry);
    if (!hist.open) return;
    const preface = beginHistoryEvent(s, hist.open);
    this.openScene(hist.open.id);
    if (preface) s.scene.preface = preface;
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

  /** v8：在所有满足条件的结局里，优先落入尚未收录的那一个。 */
  pickNaturalEnding() {
    const s = this.state;
    const ctx = contextOf(s, this);
    const matches = [];
    for (const e of ENDINGS) {
      try { if (compileCondition(e.condition)(ctx)) matches.push(e); } catch { /* 条件错误由校验脚本报告 */ }
    }
    if (!matches.length) return pickEnding(s, { ctx, compile: compileCondition }).id;
    const { ending, candidates } = chooseEnding(s.meta, matches);
    s.flags.endingCandidates = candidates.length;
    return ending.id;
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
