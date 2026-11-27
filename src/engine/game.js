import { RNG, clamp } from './rng.js';
import {
  createRun, advanceMonths, recomputeDerived, needExp, canBreakthrough, isRealmMaxLayer,
  breakthroughChance, monthlyExp, gainExp, isDead, addItem, removeItem, hasItem, itemCount,
  qualityMultiplier, lawBonusSum, maxLawLevel, defaultLawFor, gainLawExp, bottleneckStatus,
  maxTechSlots, activeTechniques, techCollectionBonus, techAlignmentConflict,
  equipTechnique, unequipTechnique, titleBonuses, petBonuses, lifespanAlert,
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
  REALMS, realmLabel, LAW_BY_ID, LAW_STAGES,
  DAO_BASE_QUALITIES, GOLDEN_CORE_QUALITIES,
} from '../data/realms.js';
import { ROOT_BY_ID } from '../data/roots.js';
import { SECTS, SECT_BY_ID, SECT_RANKS, PLAYER_SECT_TEMPLATE } from '../data/sects.js';
import { ITEM_BY_ID, ALCHEMY_RECIPES, ALCHEMY_RECIPE_BY_ID } from '../data/items.js';
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
const ARTIFACT_TIERS = [
  '凡铁胚', '下品灵剑', '中品法宝', '上品通灵剑', '极品法宝',
  '地阶灵宝', '天阶灵宝', '后天仙宝', '先天至宝', '太古混沌仙剑',
];
const CAVE_UPGRADE_COSTS = [0, 600, 2400, 9000, 32000, 110000, 360000, 1200000, 3800000];
const REFINE_MATS_BY_PRICE = ['xuantie', 'chiyang_shi', 'leimu', 'xingchen_sha', 'longxue_jing', 'kunlun_shenmu', 'hundun_muqi'];
const NPC_EXCLUSIVE_TECH_IDS = new Set(NPCS.map((n) => n.teachTechId).filter(Boolean));
const ROMANCEABLE_NPCS = new Set(['npc_su', 'npc_yunni', 'npc_baiyou', 'npc_lu']);

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
    if (!Array.isArray(c.equippedTechs)) c.equippedTechs = [];
    if (!c.caveLevel) c.caveLevel = 1;
    if (!c.petLevel) c.petLevel = 1;
    if (!c.sectBlacklist) c.sectBlacklist = {};
    if (!Array.isArray(c.secretsCleared)) c.secretsCleared = [];
    if (state.stats && state.stats.contribSpent == null) state.stats.contribSpent = 0;
    if (state.meta && state.meta.totalDeaths == null) state.meta.totalDeaths = state.meta.runs || 0;
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
        try { p = Number(compileCondition(ch.roll.expr)(contextOf(s, this))) || 0; } catch { /* ignore */ }
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
      const rName = SECT_RANKS[s.char.sectRank]?.name || '执事';
      const sName = this.currentSectName();
      lines.push(`【宗门晋升】获赐「${sName}·${rName}」玉牌！`);
      this.pushRumor(`【仙门喜讯】「${s.char.name}」通过宗门大考，正式晋升${sName}${rName}！`);
    }
    if (outcome.missionId && s.sectBoard?.slots) {
      const slot = s.sectBoard.slots.find((x) => x.missionId === outcome.missionId);
      if (slot) slot.done = true;
      s.counters.sect_missions_done = (s.counters.sect_missions_done || 0) + 1;
      if (outcome.remainMonths) lines.push(...advanceMonths(s, outcome.remainMonths, this.rng));
    }
    if (outcome.arenaWin) {
      s.counters.arena_win = (s.counters.arena_win || 0) + 1;
      lines.push(`【问道台连胜】当前擂台胜绩：${s.counters.arena_win} 场！`);
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
    return SECT_BY_ID[c.sectId]?.name || '宗门';
  }

  autoEquipIfSpace(techObj) {
    const c = this.state.char;
    c.equippedTechs = c.equippedTechs || [];
    if (c.equippedTechs.length < maxTechSlots(c.realm) && !c.equippedTechs.includes(techObj.id)) {
      c.equippedTechs.push(techObj.id);
      return true;
    }
    return false;
  }

  /* ---------------- 支柱一：洞府修行（功法槽位 / 丹方 / 法宝 / 灵脉 / 灵兽 / 讲道收徒） ---------------- */

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
    const choices = [
      { id: 'cultivate', label: '吐纳炼气', hint: '半年 · 稳步积攒修为，无心魔之忧', action: 'cultivate', params: { months: 6, returnTo: 'cave' }, effect: 'quiet' },
      { id: 'deep', label: '闭关苦修', hint: '两年 · 进境极快，须防心魔滋生', action: 'cultivate', params: { months: 24, demonRisk: true, returnTo: 'cave' } },
      { id: 'comprehend', label: `参悟${law?.name || '大道'}`, hint: `半年 · 悟性/道心 + 法则（${LAW_STAGES[lawLvl]}）`, action: 'comprehend', params: { returnTo: 'cave' } },
      {
        id: 'tech_equip',
        label: `功法运使（${active.length}/${slots}）`,
        hint: conflict.conflict ? '【真气冲突！】正邪混修，速调整功法槽位' : `藏经簿共 ${c.techniques.length} 部 · 切换主修与辅修`,
        action: 'openTechEquip',
      },
      { id: 'open_alchemy', label: '开炉炼丹', hint: '8 套自选丹方 · 定向炼制破境与疗伤丹', action: 'openAlchemy' },
    ];
    if (c.demon > 0 || c.injuries > 0) {
      choices.push({ id: 'settle', label: '静心涤魔', hint: `三月 · 镇压心魔(${Math.round(c.demon)})，调理内伤`, action: 'settle', params: { returnTo: 'cave' } });
    }
    const lvl = c.artifactLevel || 0;
    const refineCost = Math.round((260 + lvl * 420) * Math.pow(2.1, Math.max(0, lvl)));
    choices.push({
      id: 'refine',
      label: `祭炼法宝（${lvl}/${ARTIFACT_TIERS.length - 1}阶）`,
      hint: lvl >= ARTIFACT_TIERS.length - 1 ? '已臻太古混沌仙剑极境（全境战力+72%）' : `三月 · 升阶全境战力+8%（省料优先或 ${refineCost.toLocaleString()} 石）`,
      action: 'refine',
      params: { returnTo: 'cave' },
      disabled: lvl >= ARTIFACT_TIERS.length - 1,
      reason: '法宝已达极境',
    });

    const cLvl = c.caveLevel || 1;
    const caveCost = CAVE_UPGRADE_COSTS[cLvl] || 0;
    choices.push({
      id: 'upgrade_cave',
      label: cLvl >= 9 ? '洞府灵脉（九阶福地）' : `升级洞府灵脉（${cLvl}→${cLvl + 1}阶）`,
      hint: cLvl >= 9 ? '洞天福地极境 · 修炼增速 +144%' : `耗 ${caveCost.toLocaleString()} 灵石 · 永久修炼增速 +18%`,
      action: 'upgradeCave',
      disabled: cLvl >= 9 || c.stones < caveCost,
      reason: cLvl >= 9 ? '已达极境' : `需 ${caveCost.toLocaleString()} 灵石`,
    });

    if (c.petId && PET_BY_ID[c.petId]) {
      const pLvl = c.petLevel || 1;
      const petCost = Math.round(600 * Math.pow(3.2, pLvl - 1));
      choices.push({
        id: 'feed_pet',
        label: pLvl >= 5 ? `${PET_BY_ID[c.petId].name}（五阶圣兽）` : `喂养${PET_BY_ID[c.petId].name}（${pLvl}→${pLvl + 1}阶）`,
        hint: pLvl >= 5 ? '灵兽已臻圣兽极境' : `妖兽内丹或 ${petCost.toLocaleString()} 石 · 全面强化伴战特性`,
        action: 'feedPet',
        disabled: pLvl >= 5 || (c.stones < petCost && !hasItem(s, 'yaoshou_neidan')),
        reason: pLvl >= 5 ? '已臻极境' : `需妖兽内丹或 ${petCost.toLocaleString()} 石`,
      });
    }

    if (c.realm >= 1) {
      choices.push(
        { id: 'preach', label: '开坛讲道', hint: `三月 · 传道授业（累计 ${s.counters.teach || 0} 次），增道心与声望`, action: 'preach' },
        { id: 'recruit_disciple', label: '广收门徒', hint: `三月 · 择良才入门（门徒 ${s.counters.disciples || 0} 人）`, action: 'recruitDisciple' },
      );
    }
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
      choices.push({
        id: 'found_sect',
        label: '开宗立派',
        hint: c.sectId && (c.sectRank || 0) < 5 ? '须先脱离原宗或晋升太上长老方可分宗自立' : '耗 10,000 灵石 · 自建山门，广收门徒收月贡',
        action: 'foundSect',
        disabled: (Boolean(c.sectId) && (c.sectRank || 0) < 5) || c.stones < 10000,
        reason: c.sectId && (c.sectRank || 0) < 5 ? '须先脱离原宗或位列太上长老' : '需 10,000 灵石立山门',
      });
    }
    choices.push({ id: 'back_hub', label: '步出洞府', hint: '返回主界面', action: 'backHub' });

    const needText = Number.isFinite(needExp(c)) ? needExp(c).toLocaleString() : '∞';
    const life = lifespanAlert(c);
    return {
      id: 'cave',
      title: `洞府静室 · ${cLvl}阶灵脉`,
      text: `洞府聚灵阵微光流转，灵气如细雨沁入丹田。${life.level !== 'ok' ? `\n\n【${life.level === 'critical' ? '大限危警' : '寿元警示'}】${life.text}` : ''}\n\n当前修为：${Math.floor(c.exp).toLocaleString()} / ${needText}（月修 ${monthlyExp(s).toLocaleString()}）\n运使功法：${active.length}/${slots} 槽${conflict.conflict ? '【正邪冲突！】' : ''} | 主修法则：${law?.name || '剑道'}·${LAW_STAGES[lawLvl]} | 法宝：${c.artifactName}`,
      choices,
      subhub: true,
    };
  }

  act_openTechEquip() {
    this.state.scene = { id: 'techEquip', result: null };
    this.emit();
  }

  buildTechEquipNode() {
    const s = this.state;
    const c = s.char;
    const slots = maxTechSlots(c.realm);
    const active = activeTechniques(c);
    const activeIds = new Set(active.map((t) => t.id));
    const conflict = techAlignmentConflict(c);
    const choices = (c.techniques || []).map((t) => {
      const on = activeIds.has(t.id);
      const align = t.align || '中';
      const stats = `修炼+${Math.round((t.speed || 0) * 100)}% 攻+${Math.round((t.atk || 0) * 100)}% 防+${Math.round((t.def || 0) * 100)}%${t.lifespan ? ` 寿+${t.lifespan}` : ''}`;
      return {
        id: `teq_${t.id}`,
        label: `${on ? '【运使中】' : '【藏经簿】'}${t.name}（${align}）`,
        hint: `${on ? '点击卸下 · ' : active.length >= slots ? '槽位已满 · ' : '点击运使 · '}${stats}`,
        action: 'toggleTechEquip',
        params: { techId: t.id },
        disabled: !on && active.length >= slots,
        reason: `运使槽位已满（${active.length}/${slots}），请先卸下其他功法`,
        effect: on ? 'primary' : '',
      };
    });
    choices.push({ id: 'back_cave', label: '返回洞府', hint: '', action: 'openCave' });
    return {
      id: 'techEquip',
      title: `藏经簿 · 功法运使（${active.length}/${slots}）`,
      text: `修士经脉有数，同一时刻仅可运使 ${slots} 部功法（随大境突破解锁至 6 槽）。其余收藏功法提供武道底蕴（当前 +${Math.round(techCollectionBonus(c) * 1000) / 10}%，上限 15%）。\n\n正邪功法不可混修：${conflict.conflict ? '⚠️ 当前正邪真气冲撞，闭关将滋生心魔且突破 -8%！' : '当前真气融洽无碍。'}`,
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

  buildAlchemyNode() {
    const s = this.state;
    const c = s.char;
    const lawAlch = lawBonusSum(c, 'alchemy') + (titleBonuses(c).alchemy || 0) + (s.buffs?.alchemyBonus || 0);
    const baseBonus = c.attrs.悟性 * 0.006 + lawAlch + (c.rootId === 'huo' ? 0.12 : 0) + (c.sectId === 'danxia' ? 0.18 : 0);
    const choices = ALCHEMY_RECIPES.map((rec) => {
      const outDef = ITEM_BY_ID[rec.output];
      const rate = Math.round(clamp(rec.baseRate + baseBonus, 0.25, 0.97) * 100);
      const ingText = rec.ingredients.map((ing) => `${ITEM_BY_ID[ing.id]?.name || ing.id}×${ing.qty}(有${itemCount(s, ing.id)})`).join(' + ');
      const canAfford = c.realm >= rec.minRealm && rec.ingredients.every((ing) => itemCount(s, ing.id) >= ing.qty);
      return {
        id: `alch_${rec.id}`,
        label: `炼制 · ${outDef?.name || rec.output}（成丹 ${rate}%）`,
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
      title: '丹房 · 八大丹方开炉',
      text: `三昧地火在丹炉下静静跳动。择定丹方、配齐主辅药材方可定向成丹；丹道法则、火灵根与丹霞谷传承可显著提高成丹率。\n\n累计成丹：${s.counters.alchemy || 0} 炉 | 炸炉：${s.counters.alchemy_fail || 0} 次`,
      choices,
    };
  }

  act_brewRecipe(ch) {
    const s = this.state;
    const c = s.char;
    const rec = ALCHEMY_RECIPE_BY_ID[ch.params?.recipeId];
    if (!rec) return;
    if (c.realm < rec.minRealm) return { error: `需${REALMS[rec.minRealm]?.name}境` };
    if (!rec.ingredients.every((ing) => itemCount(s, ing.id) >= ing.qty)) return { error: '所需药材不足' };
    for (const ing of rec.ingredients) removeItem(s, ing.id, ing.qty);
    const lines = advanceMonths(s, 1, this.rng);
    const lawAlch = lawBonusSum(c, 'alchemy') + (titleBonuses(c).alchemy || 0) + (s.buffs?.alchemyBonus || 0);
    const rate = clamp(rec.baseRate + c.attrs.悟性 * 0.006 + lawAlch + (c.rootId === 'huo' ? 0.12 : 0) + (c.sectId === 'danxia' ? 0.18 : 0), 0.25, 0.97);
    if (this.rng.chance(rate)) {
      s.counters.alchemy = (s.counters.alchemy || 0) + 1;
      addItem(s, rec.output, 1);
      const pillName = ITEM_BY_ID[rec.output]?.name || rec.output;
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
      lines.push(`火候失衡，炸炉了！气血 -${dmg}。`);
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
    if (lvl >= 5) return { error: '灵兽已达五阶圣兽极境' };
    const cost = Math.round(600 * Math.pow(3.2, lvl - 1));
    let paid = '';
    if (removeItem(s, 'yaoshou_neidan', 1)) {
      paid = '妖兽内丹 ×1';
    } else if (c.stones >= cost) {
      c.stones -= cost;
      s.stats.goldSpent = (s.stats.goldSpent || 0) + cost;
      paid = `${cost.toLocaleString()} 灵石`;
    } else {
      return { error: `需妖兽内丹或 ${cost.toLocaleString()} 灵石` };
    }
    c.petLevel = lvl + 1;
    recomputeDerived(c);
    const lines = advanceMonths(s, 1, this.rng);
    lines.push(`消耗 ${paid}，伴生灵兽「${pet.name}」进阶至【${c.petLevel}阶】！全伴战特性显著增强。`);
    s.scene.result = {
      text: `${pet.name}吞下灵粹后周身宝光大盛，血脉枷锁轰然冲开一重，仰首清鸣！`,
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
    lines.push(`开坛讲道三月，受众顿悟！讲道累计 +${inc}（总计 ${s.counters.teach}），道心 +1，声望 +${10 + c.realm * 6}。`, ...lawLines);
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
    const add = (s.flags.开宗立派 || (c.sectRank || 0) >= 4) ? 2 : 1;
    s.counters.disciples = (s.counters.disciples || 0) + add;
    if (c.sectId === 'player_sect') c.playerSectDisciples = (c.playerSectDisciples || 0) + add;
    c.reputation += 8 * add;
    lines.push(`收下 ${add} 名良才美质入你门下（累计收徒 ${s.counters.disciples} 人），声望 +${8 * add}。`);
    s.scene.result = {
      text: '数名根骨不俗的少年跪拜奉茶。看着他们眼中的光，你恍惚看见了初入青牛山时的自己。',
      lines,
      returnTo: c.sectId === 'player_sect' && s.scene.id === 'sectHall' ? 'sectHall' : 'cave',
    };
    this.afterAction();
    this.emit();
  }

  /* ---------------- 支柱二：九州历练（严格秘境校验 / 距离耗时 / 首临奖励 / 满探索采撷） ---------------- */

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
        label: '闯入本州独有秘境',
        hint: '半年 · 深入本州古境夺造化（严格校验境界与条件）',
        action: 'secretRealm',
      },
    ];
    if (prog >= 100 && region.veinYield) {
      choices.push({
        id: 'region_vein',
        label: `灵脉采撷 · ${region.veinYield.label}`,
        hint: '半年 · 探索圆满专属！稳定采收本州稀世灵材与修为',
        action: 'regionVein',
        effect: 'primary',
      });
    }
    choices.push(
      { id: 'open_map', label: '九州舆图 · 迁徙', hint: '按距离耗时迁徙至其他已解锁州域', action: 'openRegionMap' },
      { id: 'back_hub', label: '返回洞府', hint: '回主界面', action: 'backHub' },
    );
    return {
      id: 'regionHub',
      title: `九州历练 · ${region.name}`,
      text: `${region.desc}\n\n地界特产：${region.specialty}\n当前探索进度：${prog}%${prog >= 100 ? '（已圆满，解锁灵脉采撷！）' : ''} | 危险评级：${'★'.repeat(region.danger)}`,
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
      lines.push(`【州域踏破】${region.name}探索度圆满！解锁本州「灵脉采撷」，获赠「${ITEM_BY_ID[rewardItem]?.name || rewardItem}」！`);
      this.pushRumor(`【九州游侠】「${c.name}」踏遍${region.name}险地，令此地群修侧目。`);
    }

    const ev = pickEvent(s, this.rng, this, this.rng.chance(0.7) ? 'wild' : 'world', region.id);
    const petExp = petBonuses(c).explore || 0;
    const evChance = clamp((c.rootId === 'kongjian' ? 0.85 : 0.68) + petExp, 0.2, 0.96);
    if (ev && this.rng.chance(evChance)) {
      this.openEvent(ev);
      this.afterAction();
      this.emit();
      return;
    }

    if (this.rng.chance(0.45) && region.enemies?.length) {
      const eid = this.rng.pick(region.enemies);
      lines.push(`你在${region.name}深处撞见了盘踞此地的妖邪！`);
      return this.startCombat(eid, { lines });
    }
    const lootId = this.rng.pick(region.exploreRewards || ['lingcao']);
    const stones = Math.round((30 + region.danger * 55) * Math.pow(REALMS[c.realm]?.powerMult || 1, 0.52));
    c.stones += stones;
    addItem(s, lootId, 1);
    lines.push(`搜山寻幽有所收获：灵石 +${stones.toLocaleString()}，${ITEM_BY_ID[lootId]?.name || lootId} ×1（探索度 ${c.regionProgress[region.id]}%）。`);
    s.scene.result = {
      text: `你沿${region.name}古道深入数十里，拨开荒草断碑，于隐蔽石隙间寻得前人遗物。`,
      lines,
      returnTo: 'regionHub',
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
    const item = this.rng.pick(vy.items || region.exploreRewards || ['lingcao']);
    const gotExp = gainExp(s, Math.round(needExp(c) * (vy.expPct || 0.08)));
    c.stones += vy.stones || 100;
    addItem(s, item, 1);
    lines.push(`【${vy.label}】灵石 +${(vy.stones || 100).toLocaleString()}，修为 +${gotExp.toLocaleString()}，采得「${ITEM_BY_ID[item]?.name || item}」×1！`);
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
    lines.push(`你在${region.name}循着妖气追出十里，迎面撞上强敌！`);
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
    choices.push({ id: 'back_region', label: '返回', hint: '回九州历练', action: 'openRegion' });
    return {
      id: 'regionMap',
      title: '九州舆图 · 灵域迁徙',
      text: `九州浩瀚，跨州耗时随距离增减（首次踏足新州可获首临见闻礼）。\n\n当前所在：${c.location} | 已踏足 ${(c.visitedLocations || []).length}/8 州`,
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
    c.visitedLocations = c.visitedLocations || ['青牛山脉'];
    const isFirst = !c.visitedLocations.includes(region.name);
    if (isFirst) {
      c.visitedLocations.push(region.name);
      const firstGift = region.exploreRewards?.[0] || 'lingcao';
      addItem(s, firstGift, 1);
      c.attrs.悟性 += 1;
      c.reputation += 10 + region.danger * 6;
      lines.push(`【首临见闻】初入${region.name}，眼界大开！悟性 +1，声望 +${10 + region.danger * 6}，获特产「${ITEM_BY_ID[firstGift]?.name || firstGift}」×1！`);
    }
    lines.push(`跋涉${months}月，抵达「${region.name}」。`);
    if (isFirst && c.goldenFingerId === 'gf_signin') {
      const bonusStones = 240 + region.danger * 220;
      c.stones += bonusStones;
      lines.push(`【万界道碑】首临赐宝：灵石 +${bonusStones.toLocaleString()}！`);
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
    const rankInfo = SECT_RANKS[rankIdx] || SECT_RANKS[0];
    const nextTrial = SECT_PROMOTION_TRIALS.find((t) => t.fromRank === rankIdx);
    const veinCost = 80 + rankIdx * 50;
    const choices = [
      { id: 'sect_missions', label: '任务堂（两年期榜文）', hint: '接取本周期限量宗门悬赏（防刷机制）', action: 'openSectMissions' },
      { id: 'sect_library', label: '藏经阁', hint: '以贡献参悟本宗六阶镇宗功法与神通', action: 'openSectLibrary' },
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
        hint: nextTrial ? `需${REALMS[nextTrial.minRealm]?.name}境 · ${nextTrial.contribution} 贡献（晋升消耗50%）` : '你已居宗门至高尊位',
        action: 'openSectPromote',
        disabled: !nextTrial,
        reason: '已至最高职阶',
      },
      { id: 'sect_leave', label: '叛出师门', hint: '永入原宗黑名单、5年禁入他宗、声望与业力重创', action: 'sectLeave' },
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

  buildPlayerSectHallNode() {
    const s = this.state;
    const c = s.char;
    const name = c.playerSectName || `${c.name}道宗`;
    const lvl = c.playerSectLevel || 1;
    const upCost = Math.round(15000 * Math.pow(3.5, lvl - 1));
    const choices = [
      {
        id: 'psect_upgrade',
        label: lvl >= 5 ? '山门护阵（五阶仙宗）' : `扩建山门（${lvl}→${lvl + 1}阶）`,
        hint: lvl >= 5 ? '已成九州第一等仙门道统' : `耗 ${upCost.toLocaleString()} 灵石 · 提升弟子月贡与聚灵阵威能`,
        action: 'upgradePlayerSect',
        disabled: lvl >= 5 || c.stones < upCost,
        reason: lvl >= 5 ? '已臻极境' : `需 ${upCost.toLocaleString()} 灵石`,
      },
      { id: 'psect_recruit', label: '开山广收门徒', hint: `三月 · 招收良才（当前门徒 ${s.counters.disciples || 0} 人）`, action: 'recruitDisciple' },
      { id: 'psect_preach', label: '大殿开坛讲道', hint: `三月 · 传道授业（累计 ${s.counters.teach || 0} 次），增道心与声望`, action: 'preach' },
      { id: 'psect_tribute', label: '收取门人岁贡', hint: `半年 · 按山门阶位与门徒数收取灵石与灵草`, action: 'collectTribute' },
      { id: 'sect_library', label: '宗门藏经楼', hint: '参悟散修百家秘典与自藏功法', action: 'openSectLibrary' },
      { id: 'sect_treasury', label: '自建宝库', hint: '以宗门底蕴兑换丹药灵材', action: 'openSectTreasury' },
      { id: 'back_hub', label: '步出祖师殿', hint: '返回主界面', action: 'backHub' },
    ];
    return {
      id: 'sectHall',
      title: `${name} · 祖师大殿（${lvl}阶）`,
      text: `${PLAYER_SECT_TEMPLATE.desc}\n\n当前身份：开山祖师（${lvl}阶山门 · 门徒 ${s.counters.disciples || 0} 人）\n宗门底蕴（贡献）：${c.contribution.toLocaleString()} | 灵石：${c.stones.toLocaleString()}`,
      choices,
      subhub: true,
    };
  }

  act_upgradePlayerSect() {
    const s = this.state;
    const c = s.char;
    const lvl = c.playerSectLevel || 1;
    if (lvl >= 5) return { error: '山门已达五阶仙宗' };
    const cost = Math.round(15000 * Math.pow(3.5, lvl - 1));
    if (c.stones < cost) return { error: `灵石不足（需 ${cost.toLocaleString()}）` };
    c.stones -= cost;
    s.stats.goldSpent = (s.stats.goldSpent || 0) + cost;
    c.playerSectLevel = lvl + 1;
    c.reputation += 80 * c.playerSectLevel;
    const lines = advanceMonths(s, 3, this.rng);
    lines.push(`耗费 ${cost.toLocaleString()} 灵石扩建灵峰大阵，${this.currentSectName()}晋升【${c.playerSectLevel}阶仙门】，声望 +${80 * c.playerSectLevel}！`);
    s.scene.result = { text: '护山大阵灵光冲霄，八方散修慕名来投，宗门气象焕然一新！', lines, fx: 'breakthrough', returnTo: 'sectHall' };
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
    lines.push(`门下弟子呈上岁贡：灵石 +${stones.toLocaleString()}，宗门底蕴 +${contrib}，灵草 ×1。`);
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
    // 筛选当前职阶/境界可达或略高 1 档的任务，随机抽取 3 个不重复任务
    const eligible = list.filter((m) => (c.sectRank || 0) >= m.minRank && c.realm >= m.minRealm);
    const pool = eligible.length >= 3 ? eligible : list;
    const shuffled = [...pool].sort(() => this.rng.next() - 0.5).slice(0, 3);
    s.sectBoard = {
      sectId: key,
      refreshAt: c.age + 24,
      slots: shuffled.map((m) => ({ missionId: m.id, done: false })),
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
      const reqRank = SECT_RANKS[m.minRank]?.name || '外门弟子';
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
    choices.push({ id: 'sect_daily', label: '常规宗门杂务', hint: '三月 · 稳妥赚取基础贡献，无斗法风险', action: 'sectTask', params: { returnTo: 'sectMissions' } });
    choices.push({ id: 'back_sect', label: '返回大殿', hint: '', action: 'openSectHall' });
    return {
      id: 'sectMissions',
      title: `${this.currentSectName()} · 任务堂`,
      text: `殿前玉璧每两载刷新三道限额榜文（距下次换榜：${remainM} 个月），完成即销榜不可连刷。\n\n累计完成宗门悬赏：${s.counters.sect_missions_done || 0} 次`,
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
          text: `差事圆满完成！「${m.title}」已交割任务堂，执事长老颔首记功。`,
          missionId: m.id,
          remainMonths: remainM,
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
          text: '强敌难挡，你及时抽身退回山门（仅耗筹备时日），任务堂暂将榜文挂回。',
          effects: { hp: Math.max(10, Math.round(c.maxHp * 0.25)), injuries: 1 },
          returnTo: 'sectHall',
        },
      }, { lines });
    }
    const lines = advanceMonths(s, totalM, this.rng);
    if (slot) slot.done = true;
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
    const key = c.sectId === 'player_sect' ? 'sanxiu' : c.sectId;
    const manuals = SECT_LIBRARIES[key] || SECT_LIBRARIES.sanxiu;
    const choices = manuals.map((m) => {
      const learned = c.techniques.some((t) => t.id === m.id);
      const okRank = (c.sectRank || 0) >= m.minRank;
      const okCost = c.contribution >= m.cost;
      const reqRank = SECT_RANKS[m.minRank]?.name || '外门弟子';
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
      text: `楼阁六重，玉简流光。参悟典籍收入藏经簿，可在洞府「功法运使」中择优装配（当前运使上限 ${maxTechSlots(c.realm)} 槽）。\n\n当前职阶：${SECT_RANKS[c.sectRank || 0]?.name} | 可用贡献：${c.contribution.toLocaleString()}`,
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
    if ((c.sectRank || 0) < m.minRank) return { error: `职阶不足（需${SECT_RANKS[m.minRank]?.name}）` };
    if (c.contribution < m.cost) return { error: `宗门贡献不足（需 ${m.cost}）` };
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
      text: `你将${m.name}玉简贴于眉心，万千道纹如星河灌顶，领悟绝学「${m.artName}」！\n\n${m.desc}`,
      lines: [
        `消耗贡献 ${m.cost}，习得 ${m.name}${equipped ? '（已自动运使）' : '（已收录藏经簿，可至洞府切换运使）'}`,
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
      title: `${this.currentSectName()} · 宗门宝库`,
      text: `宝库禁制森严，唯持本宗玉牌与功勋贡献方可换取破境灵丹与奇珍灵材。\n\n当前职阶：${SECT_RANKS[c.sectRank || 0]?.name} | 可用贡献：${c.contribution.toLocaleString()}`,
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
      text: '执事长老划去玉牌上的功勋点，自架上取下封灵玉盒交到你手中。',
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
    const payCost = Math.round(trial.contribution * 0.5);
    const flavor = trial.sectFlavor?.[c.sectId] || trial.desc;
    return {
      id: 'sectPromote',
      title: trial.title,
      text: `${trial.desc}\n\n【本宗试炼】${flavor}\n\n考核条件：${REALMS[trial.minRealm]?.name}境 · 贡献 ≥ ${trial.contribution}（胜出仪典消耗 ${payCost} 贡献）${Object.entries(trial.minAttrs || {}).map(([k, v]) => ` · ${k} ≥ ${v}`).join('')}${missing.length ? `\n\n尚欠条件：${missing.join('；')}` : '\n\n条件已齐，即刻登台受考！'}`,
      choices: [
        {
          id: 'start_promote',
          label: `登台应考 · 冲击${trial.rankName}`,
          hint: missing.length ? missing[0] : `胜出消耗 ${payCost} 贡献，获赐新职阶玉牌`,
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
        text: `钟鸣三响，全场静默！你凭借过硬修为力克考官，正式获封「${this.currentSectName()} · ${trial.rankName}」！`,
        promoteRank: trial.toRank,
        promoteCost: payCost,
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
    const oldId = c.sectId;
    if (!oldId || oldId === 'player_sect') return;
    const oldName = SECT_BY_ID[oldId]?.name || '宗门';
    c.sectBlacklist = c.sectBlacklist || {};
    c.sectBlacklist[oldId] = true;
    c.betrayCount = (c.betrayCount || 0) + 1;
    c.sectLeaveUntil = c.age + 60; // 5 年冷却
    const repLoss = 100 * c.betrayCount;
    const karmaLoss = 40 * c.betrayCount;
    // 卸下原宗未达真传的秘传功法
    c.equippedTechs = (c.equippedTechs || []).filter((tid) => {
      const t = c.techniques.find((x) => x.id === tid);
      return !(t && t.sectId === oldId);
    });
    c.sectId = null;
    c.sectRank = 0;
    c.contribution = 0;
    c.reputation -= repLoss;
    c.karma -= karmaLoss;
    s.sectBoard = null;
    s.flags['临阵脱逃'] = true;
    recomputeDerived(c);
    this.pushRumor(`【叛门通缉】「${c.name}」悍然叛离${oldName}（累计第${c.betrayCount}次），遭山门除名并悬赏五年！`);
    s.scene.result = {
      text: `你将${oldName}弟子玉牌震碎于山门石阶前，执法堂警钟骤鸣！\n\n${oldName}将你列入永不录用名册，九州各宗五年之内亦绝不接纳叛徒。`,
      lines: [`永入${oldName}黑名单`, `5年内禁入任何仙门`, `声望 -${repLoss}，业力 -${karmaLoss}，贡献清零`],
      returnTo: 'hub',
    };
    this.afterAction();
    this.emit();
  }

  /* ---------------- 支柱四：仙城坊市、十年拍卖、古籍秘阁、问道擂台与天机阁 ---------------- */

  act_openCity() {
    this.state.scene = { id: 'cityHub', result: null };
    this.emit();
  }

  buildCityNode() {
    const s = this.state;
    const c = s.char;
    const region = REGION_BY_ID[c.regionId] || REGION_BY_ID.qingniu;
    const nextAuc = s.auctionRound?.nextAt || 0;
    const aucOpen = !s.auctionRound || c.age >= nextAuc || (s.auctionRound.lots || []).some((l) => !l.sold);
    const aucHint = aucOpen
      ? '十年一届限量竞拍 · 4件重宝现场喊价'
      : `下届拍卖还需 ${Math.max(1, Math.ceil((nextAuc - c.age) / 12))} 年开启`;
    return {
      id: 'cityHub',
      title: `${region.name} · 仙城坊市`,
      text: `长街灯火如昼，丹阁、秘阁、拍卖行、问道擂台与天机茶楼鳞次栉比。\n\n当前身家：${c.stones.toLocaleString()} 灵石 | 州域货源随所在灵域品阶变化。`,
      choices: [
        { id: 'city_market', label: `${region.name}商行`, hint: '一月 · 买卖本州特产丹药、破境灵丹与炼器灵材', action: 'market' },
        { id: 'city_techs', label: '古籍秘阁', hint: '以灵石购藏九州散落功法（不含12道友唯一绝学）', action: 'openTechShop' },
        { id: 'city_auction', label: '万宝阁 · 十年拍卖', hint: aucHint, action: 'auction' },
        { id: 'city_arena', label: '问道擂台 · 比武', hint: `一月 · 同境擂台较技（已胜 ${s.counters.arena_win || 0} 场），赢声望灵石`, action: 'openArena' },
        { id: 'city_tianji', label: '天机阁 · 潜龙榜', hint: '查阅九州排名、本界风闻与历世战力评估', action: 'openTianji' },
        { id: 'back_hub', label: '离开坊市', hint: '返回主界面', action: 'backHub' },
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
      title: '仙城 · 问道擂台',
      text: `青石擂台四面观者如潮。守擂强敌「${def?.name || '散修高手'}」抱剑而立，战意凛然。\n\n当前擂台战绩：${s.counters.arena_win || 0} 胜 | 胜场奖励：声望 +${20 + c.realm * 10}、灵石 +${rewardStones.toLocaleString()}`,
      choices: [
        { id: 'arena_fight', label: `登台挑战 · ${def?.name || '擂主'}`, hint: '一月 · 点到为止不死，胜出计入大比胜场', action: 'arenaFight', params: { enemyId, rewardStones }, effect: 'primary' },
        { id: 'back_city', label: '暂不下场', hint: '', action: 'openCity' },
      ],
    };
  }

  act_arenaFight(ch) {
    const s = this.state;
    const c = s.char;
    const lines = advanceMonths(s, 1, this.rng);
    const { enemyId, rewardStones } = ch.params || {};
    return this.startCombat({
      enemy: enemyId || 'cultivator',
      win: {
        text: '一招定胜负！全场欢声雷动，擂台执事高声唱出你的道号并奉上彩头！',
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
    }, { lines: [...lines, '锣声一响，问道擂台斗法开启！'] });
  }

  act_openTechShop() {
    this.state.scene = { id: 'techShop', result: null };
    this.emit();
  }

  shopDiscountMult() {
    const s = this.state;
    const c = s.char;
    return (1 - Math.min(0.25, c.attrs.魅力 * 0.004))
      * (c.sectId === 'wanbao' ? 0.85 : 1)
      * (c.goldenFingerId === 'gf_karma_mirror' ? 0.85 : 1)
      * (1 - Math.min(0.15, s.buffs?.shopDiscount || 0));
  }

  buildTechShopNode() {
    const s = this.state;
    const c = s.char;
    const gradeOrder = { 凡: 0, 黄: 1, 玄: 2, 地: 3, 天: 4, 仙: 6 };
    const gradePrice = { 凡: 260, 黄: 1100, 玄: 3800, 地: 13500, 天: 48000, 仙: 180000 };
    const discount = this.shopDiscountMult();
    // 严格排除 12 位道友的唯一传艺功法
    const available = WORLD_TECHNIQUES.filter(
      (t) => !NPC_EXCLUSIVE_TECH_IDS.has(t.id) && (gradeOrder[t.grade] ?? 0) <= c.realm + 1 && !c.techniques.some((x) => x.id === t.id),
    );
    const shown = available.slice(0, 8);
    const choices = shown.map((t) => {
      const price = Math.round((gradePrice[t.grade] || 1200) * discount);
      return {
        id: `wt_${t.id}`,
        label: `【${t.grade}·${t.align || '中'}】${t.name}（${price.toLocaleString()} 石）`,
        hint: `修炼+${Math.round(t.speed * 100)}% 攻+${Math.round(t.atk * 100)}% · 「${t.artName}」`,
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
      text: `阁内收录九州散落孤本（十二位绝世名修之独门绝学不对外售卖，唯亲传可得）。购入后收录藏经簿，须至洞府槽位运使生效。\n\n已参悟功法：${c.techniques.length} 部 | 持有灵石：${c.stones.toLocaleString()}`,
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
      text: `你拂去玉简微尘，神识沉入其中，领悟【${t.grade}品】${t.name}与绝招「${t.artName}」！\n\n${t.desc}`,
      lines: [
        `消耗 ${price.toLocaleString()} 灵石，习得 ${t.name}${equipped ? '（已自动运使）' : '（已收录藏经簿）'}`,
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
      title: '天机阁 · 九州潜龙榜',
      text: `青铜榜单高悬阁顶，字迹由星辉自行改写。\n\n你的潜龙榜位次：第 ${rankNum} 位（声望 ${c.reputation} · 擂台 ${s.counters.arena_win || 0} 胜 · 杀敌 ${s.stats.kills}）\n综合战力：攻 ${this.playerAtk().toLocaleString()} / 术 ${this.playerSpellAtk().toLocaleString()} / 防 ${this.playerDef().toLocaleString()}\n\n【近期九州风闻】\n${rumors || '· 近期风平浪静。'}`,
      choices: [
        { id: 'tianji_bounty', label: '接取天机悬赏', hint: '两月 · 迎战本州通缉强敌，大涨灵石与声望', action: 'regionHunt' },
        { id: 'back_city', label: '离开天机阁', hint: '', action: 'openCity' },
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
      title: '红尘道友 · 九州十二名宿',
      text: '仙路漫漫，孤身独行终究寂寞。与九州十二位绝世名修论道切磋、按物赠礼，深交可获唯一不外传绝学，甚至结为道侣。',
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
    // 按价值从高到低展示可赠礼的喜好物
    const giftItem = npc.likeItems.find((id) => hasItem(s, id));
    const giftDef = giftItem ? ITEM_BY_ID[giftItem] : null;
    const giftGain = giftDef ? this.giftAffinityGain(giftDef) : 0;
    const choices = [
      { id: 'npc_chat', label: '品茶论道', hint: '两月 · 触发专属道友指点与好感 +6', action: 'npcChat', params: { npcId: npc.id } },
      {
        id: 'npc_gift',
        label: giftDef ? `赠礼 · ${giftDef.name}` : '赠礼结缘',
        hint: giftDef ? `一月 · 依物价增好感 +${giftGain}（上限100）` : `喜好：${likeNames}`,
        action: 'npcGift',
        params: { npcId: npc.id, itemId: giftItem },
        disabled: !giftItem || rel >= 100,
        reason: rel >= 100 ? '好感已至生死之交（100）' : `无对方喜好之物（${likeNames}）`,
      },
      { id: 'npc_spar', label: '切磋试剑', hint: '一月 · 迎战名宿本境实力，获专属法则感悟', action: 'npcSpar', params: { npcId: npc.id } },
    ];
    const teachTech = npc.teachTechId ? WORLD_TECH_BY_ID[npc.teachTechId] : null;
    if (teachTech && rel >= 35 && !c.techniques.some((t) => t.id === teachTech.id)) {
      choices.push({
        id: 'npc_teach',
        label: `请教唯一绝学 · ${teachTech.name}`,
        hint: `好感 ≥ 35 · 唯一亲传【${teachTech.grade}品】绝学「${teachTech.artName}」`,
        action: 'npcTeach',
        params: { npcId: npc.id, techId: teachTech.id },
        effect: 'primary',
      });
    }
    const bondThreshold = npc.id === 'npc_su' ? 40 : 60;
    if (ROMANCEABLE_NPCS.has(npc.id) && rel >= bondThreshold && !s.flags['道侣']) {
      choices.push({
        id: 'npc_bond',
        label: '执手立誓 · 结为道侣',
        hint: '情深意重，自此并肩问道（终生唯一道侣）',
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
    const mult = 1 + (this.state.buffs?.npcAffinity || 0);
    return clamp(Math.round(raw * mult), 4, 30);
  }

  act_npcChat(ch) {
    const s = this.state;
    const c = s.char;
    const npc = NPC_BY_ID[ch.params?.npcId];
    if (!npc) return;
    const lines = advanceMonths(s, 2, this.rng);
    const addRel = Math.round(6 * (1 + (s.buffs?.npcAffinity || 0)));
    c.relations[npc.relationKey] = clamp((c.relations[npc.relationKey] || 0) + addRel, -100, 100);
    const rel = c.relations[npc.relationKey];
    const line = this.rng.pick(npc.chatLines);
    lines.push(`与${npc.name}对坐论道，好感 +${addRel}（当前 ${rel}/100）。`);

    // 全部 12 位道友各自实装专属论道效果！
    switch (npc.id) {
      case 'npc_su':
        c.attrs.道心 += 1;
        if (rel >= 20) { c.attrs.悟性 += 1; lines.push('【寒梅剑意】剑心澄澈，悟性 +1，道心 +1。', ...gainLawExp(s, 14, 'sword')); }
        else lines.push('【梅下品茶】道心 +1。');
        break;
      case 'npc_lu':
        c.attrs.根骨 += 1;
        lines.push('【孤鸿论剑】根骨 +1。', ...gainLawExp(s, rel >= 30 ? 28 : 15, 'sword'));
        break;
      case 'npc_yao':
        lines.push(...gainLawExp(s, 18, 'pill'));
        if (rel >= 25 && this.rng.chance(0.45)) {
          const pill = c.realm >= 2 ? 'dahuan_dan' : 'juling_dan';
          addItem(s, pill, 1);
          lines.push(`【丹尊赐药】药尘子随手抛来一瓶「${ITEM_BY_ID[pill]?.name}」！`);
        }
        break;
      case 'npc_gu':
        c.attrs.神识 += 1;
        c.attrs.气运 += 1;
        lines.push('【天机推演】神识 +1，气运 +1。', ...gainLawExp(s, 16, 'karma'));
        break;
      case 'npc_xuesha': {
        const got = gainExp(s, Math.round(monthlyExp(s) * 2.2));
        c.demon = clamp(c.demon + 2, 0, 100);
        lines.push(`【血海杀意】修为 +${got.toLocaleString()}，心魔 +2。`, ...gainLawExp(s, 22, 'blood'));
        break;
      }
      case 'npc_lin':
        c.reputation += 12;
        c.attrs.根骨 += 1;
        lines.push('【世家论武】声望 +12，根骨 +1。', ...gainLawExp(s, 12, 'thunder'));
        break;
      case 'npc_yunni':
        c.attrs.神识 += 1;
        c.demon = Math.max(0, c.demon - 4);
        lines.push('【沧海潮音】神识 +1，心魔 -4。', ...gainLawExp(s, 22, 'space'));
        break;
      case 'npc_xuanji': {
        c.attrs.悟性 += 1;
        const tipStones = 180 + c.realm * 140;
        c.stones += tipStones;
        lines.push(`【千机演阵】悟性 +1，鉴宝分红灵石 +${tipStones}。`, ...gainLawExp(s, 24, 'array'));
        break;
      }
      case 'npc_moheng':
        c.attrs.神识 += 2;
        c.karma -= 3;
        lines.push('【黄泉炼魂】神识 +2，业力 -3。', ...gainLawExp(s, 26, 'time'));
        break;
      case 'npc_baiyou':
        c.attrs.魅力 += 1;
        c.attrs.气运 += 1;
        c.demon = Math.max(0, c.demon - 5);
        lines.push('【青丘幻梦】魅力 +1，气运 +1，心魔 -5。', ...gainLawExp(s, 18, 'karma'));
        break;
      case 'npc_qinglian':
        c.attrs.悟性 += 2;
        lines.push('【青莲剑歌】剑道感悟暴涨，悟性 +2！', ...gainLawExp(s, 45, 'sword'));
        break;
      case 'npc_siming':
        s.buffs.breakBonus = Math.min(25, (s.buffs.breakBonus || 0) + 6);
        c.bonusLifespan = (c.bonusLifespan || 0) + 12 * 10;
        recomputeDerived(c);
        lines.push('【星穹窥劫】窥破天劫玄机，下次破境成算 +6%、寿元微增！', ...gainLawExp(s, 45, 'star'));
        break;
      default:
        break;
    }

    s.scene.result = {
      text: `${npc.name}斟茶相待，言谈间直指大道真意：\n\n${line}`,
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
      lines.push('药尘子大喜，顺手点拨控火诀窍（悟性 +1）。');
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
    return this.startCombat({
      enemy: npc.sparEnemy || 'cultivator',
      preserveEnemyRealm: true,
      win: {
        text: `收剑归鞘，${npc.name}抚掌大笑：「好俊的功夫！此战痛快！」`,
        effects: { exp: expGain, attrs: { 根骨: 1 }, relation: { [npc.relationKey]: 8 }, lawExp: 25 + npc.minRealm * 6, lawId: sparLaw },
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
    }, { lines: [...lines, `你向${npc.name}拱手请教，双方以本境实力点到为止！`] });
  }

  act_npcTeach(ch) {
    const s = this.state;
    const c = s.char;
    const npc = NPC_BY_ID[ch.params?.npcId];
    const tech = WORLD_TECH_BY_ID[ch.params?.techId];
    if (!npc || !tech) return;
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
      text: `${npc.name}沉吟片刻，以指代笔在虚空中划出七道微光道纹：「这套【${tech.grade}品】${tech.name}乃我压箱底的唯一传承，今日便传予你罢！」\n\n${tech.desc}`,
      lines: [`习得唯一绝学 ${tech.name}（绝招：${tech.artName}）${equipped ? '（已自动运使）' : '（已收录藏经簿）'}`, ...lawLines],
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
    if (s.flags['道侣']) return { error: '此生已有道侣相伴' };
    s.flags['道侣'] = true;
    c.spouseNpcId = npc.id;
    c.relations['道侣'] = Math.max(c.relations['道侣'] || 0, c.relations[npc.relationKey] || 40);
    c.attrs.道心 += 8;
    c.demon = Math.max(0, c.demon - 15);
    this.pushRumor(`【仙途佳话】「${c.name}」与「${npc.name}」立下同心道誓，结为同生共死之道侣！`);
    s.scene.result = {
      text: `霞光漫天，清风拂袖。${npc.name}轻执你手，以神魂立下同心道誓：\n\n「此生无论身在人间抑或九霄，长生路远，我与你同行。」`,
      lines: [`与${npc.name}结为道侣！道心 +8，心魔 -15`],
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
    const gain = monthlyExp(s) * months;
    const got = gainExp(s, gain);
    s.counters.night_cultivate = (s.counters.night_cultivate || 0) + Math.max(1, Math.round(months / 3));
    const lines = [`闭关${months}月，修为 +${got.toLocaleString()}。`];
    if (s.char.goldenFingerId === 'gf_bottle' && this.rng.chance(months >= 24 ? 0.72 : 0.35)) {
      const herb = s.char.realm >= 2 ? 'qiannian_lingcao' : 'lingcao';
      addItem(s, herb, 1);
      lines.push(`【掌天小绿瓶】月夜凝露，灵土催熟出一株${ITEM_BY_ID[herb]?.name}！`);
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
      if (!c.secretsCleared.includes(nextId)) c.secretsCleared.push(nextId);
      s.counters.secrets = c.secretsCleared.length;
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
      const techObj = { id, name: def.name, ...def.technique };
      s.char.techniques.push(techObj);
      const eq = this.autoEquipIfSpace(techObj);
      const lines = [`习得功法 ${def.name}${eq ? '（已自动运使）' : '（已收录藏经簿）'}`];
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
      s.scene.result = { text: `你的本命法宝「${c.artifactName}」已臻太古混沌仙剑极境，再无瑕疵可炼。`, lines: [], returnTo: ch.params?.returnTo || null };
      this.emit();
      return;
    }
    const stoneCost = Math.round((260 + lvl * 420) * Math.pow(2.1, Math.max(0, lvl)));
    // 严格按最低价值优先消耗灵材，绝不误烧龙血精！
    const availMat = REFINE_MATS_BY_PRICE.find((id) => hasItem(s, id));
    if (c.stones < stoneCost && !availMat) {
      s.scene.result = { text: `祭炼需玄铁等炼器灵材或 ${stoneCost.toLocaleString()} 灵石，眼下灵材尚缺。`, lines: [], returnTo: ch.params?.returnTo || null };
      this.emit();
      return;
    }
    const lines = advanceMonths(s, 3, this.rng);
    let matUsed = '';
    if (availMat && removeItem(s, availMat, 1)) {
      matUsed = ITEM_BY_ID[availMat]?.name || availMat;
    } else {
      c.stones -= stoneCost;
      s.stats.goldSpent = (s.stats.goldSpent || 0) + stoneCost;
      matUsed = `${stoneCost.toLocaleString()} 灵石`;
    }
    c.artifactLevel = lvl + 1;
    c.artifactName = ARTIFACT_TIERS[c.artifactLevel];
    s.counters.craft = (s.counters.craft || 0) + 1;
    if (c.artifactLevel >= 5) s.flags['得地阶法宝'] = true;
    lines.push(`消耗 ${matUsed}，本命法宝晋升为【${c.artifactName}】（全境攻术防倍率永久 +${c.artifactLevel * 8}%）。`);
    this.pushRumor(`【器道风闻】「${c.name}」以地火祭炼出「${c.artifactName}」，剑鸣震彻云霄！`);
    s.scene.result = {
      text: `三昧真火昼夜不熄，你在剑胎上刻下最后一道本命道纹。\n\n清越剑鸣震落屋檐积灰——你的本命法宝已晋升为【${c.artifactName}】！`,
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
        label: lot.sold ? `【已成交】${def?.name || lot.id}` : `举牌竞价 · ${def?.name || lot.id}（${price.toLocaleString()} 石）`,
        hint: lot.sold ? `本届仅此一件，${remainYears} 年后换新` : `限量1件 · ${def?.desc || ''}（已叫价 ${lot.bids} 轮）`,
        action: 'bidItem',
        params: { idx, id: lot.id, price, highValue: (def?.price || 0) >= 4000 },
        disabled: lot.sold || c.stones < price,
        reason: lot.sold ? '已售罄' : `灵石不足（需 ${price.toLocaleString()}）`,
      };
    });
    choices.push({ id: 'leave_auction', label: '低调离场', hint: '走万宝阁密道返回坊市', action: 'openCity' });
    return {
      id: 'auction',
      title: `万宝阁 · 十年暗拍（余 ${remainYears} 年换届）`,
      text: `十年一度的万宝盛会灯火通明，每件奇珍全球限量一席，起拍溢价、老怪同场竞逐。\n\n当前身家：${c.stones.toLocaleString()} 灵石`,
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
        text: `你刚举起号牌，二楼天字包厢便传出一声冷笑，直接将「${ITEM_BY_ID[lot.id]?.name}」抬价至 ${lot.curPrice.toLocaleString()} 灵石！是否继续跟拍？`,
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
    this.pushRumor(`【万宝拍卖行】「${c.name}」豪掷 ${price.toLocaleString()} 灵石拍下限量奇珍「${name}」！`);
    if (ch.params.highValue && c.goldenFingerId !== 'gf_stealth' && c.goldenFingerId !== 'gf_karma_mirror' && this.rng.chance(0.35)) {
      s.scene.result = {
        text: `你一锤定音拍下【${name}】，满场哗然。刚出侧门，便觉三道冰冷杀意如芒在背！`,
        lines: [`拍得 ${name}（-${price.toLocaleString()} 灵石）`, '【财不露白】遭遇暗中尾随！'],
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
    s.counters.night_cultivate = (s.counters.night_cultivate || 0) + 2;
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
    const active = activeTechniques(c);
    this.state.scene.result = {
      text: '你静坐回望此生行止：道基、功法槽位、法则、功业与因果皆历历在目。',
      lines: [
        `战力评估：攻 ${this.playerAtk().toLocaleString()} · 术 ${this.playerSpellAtk().toLocaleString()} · 防 ${this.playerDef().toLocaleString()}`,
        `根基品阶：道基【${daoName}】· 金丹【${coreName}】（倍率 ${qualityMultiplier(c).toFixed(2)}×）· 功法运使 ${active.length}/${maxTechSlots(c.realm)}`,
        `法则领悟：${lawList}`,
        `历世记录：抉择 ${s.stats.actions} 次 · 奇遇 ${s.stats.events} 次 · 杀敌 ${s.stats.kills} 尊 · 灵石消费 ${(s.stats.goldSpent || 0).toLocaleString()}`,
        `已解锁结局：${s.meta.unlockedEndings.length} / ${ENDINGS.length} · 成就：${Object.keys(s.meta.achievements).length} / ${ACHIEVEMENTS.length}`,
      ],
    };
    this.emit();
  }

  act_foundSect() {
    const s = this.state;
    const c = s.char;
    if (s.flags.开宗立派) return;
    if (c.sectId && (c.sectRank || 0) < 5) return { error: '须先脱离原宗或晋升太上长老方可开宗立派' };
    if (c.stones < 10000) return { error: '开宗立派需 10,000 灵石立山门' };
    c.stones -= 10000;
    s.stats.goldSpent = (s.stats.goldSpent || 0) + 10000;
    s.flags.开宗立派 = true;
    s.flags.道号 = true;
    c.sectId = 'player_sect';
    c.playerSectName = `${c.name}道宗`;
    c.playerSectLevel = 1;
    c.sectRank = 5;
    if (!c.titles.includes('开山祖师')) c.titles.push('开山祖师');
    c.reputation += 200;
    recomputeDerived(c);
    this.pushRumor(`【开宗立派】「${c.name}」自立「${c.playerSectName}」，八方修士前来观礼！`);
    s.scene.result = {
      text: `你在灵峰绝顶立下山门石碑，亲手题刻「${c.playerSectName}」。自此你成为一宗开山祖师，可扩建山门、招收门徒、收取岁贡！`,
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
      return { error: `叛门通缉期内，还需 ${Math.ceil((c.sectLeaveUntil - c.age) / 12)} 年方可再入仙门` };
    }
    const sect = SECT_BY_ID[ch.sectId];
    if (sect.align === '正' && c.karma <= -150) return { error: '你业力深重（≤ -150），正道山门拒之门外' };
    const startRank = this.entryRankForRealm(c.realm);
    c.sectId = sect.id;
    c.sectRank = startRank;
    c.contribution = 0;
    s.sectBoard = null;
    s.counters.sects_joined = (s.counters.sects_joined || 0) + 1;
    s.meta.sectsJoined = Array.from(new Set([...(s.meta.sectsJoined || []), sect.id]));
    s.flags[`入宗:${sect.id}`] = true;
    const lines = applyEffects(s, { ...(sect.joinEffects || {}), attrs: { ...(sect.joinEffects?.attrs || {}) } }, this.effectCtx());
    const rankName = SECT_RANKS[startRank]?.name || '外门弟子';
    lines.push(startRank > 0
      ? `【按境礼聘】以${realmLabel(c)}之尊入宗，山门破格礼聘为「${sect.name}·${rankName}」！`
      : `你成了${sect.name}的${rankName}，可随时前往仙门大殿接任务、入藏经阁与宝库。`);
    s.scene.result = {
      text: startRank > 0
        ? `山门钟鸣九响，掌教亲迎！以你${realmLabel(c)}的威望，宗门特赐「${rankName}」尊位玉牌与专属灵峰！`
        : `${sect.entry}\n\n考核通过。执事弟子递来一枚刻着宗门徽记的外门玉牌与素色道袍。`,
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
    const conflict = techAlignmentConflict(c);
    const lines = [
      `你盘坐蒲团，敛息凝神。${realmLabel(c)}的壁垒就在眼前。`,
      major && bn.bottleneck ? `【大境瓶颈】${bn.bottleneck.trialDesc}` : '此次仅需破开小境隔膜，顺势进阶。',
      conflict.conflict ? '【真气冲突警告】当前同时运使正邪功法，破境成算 -8%！建议先至洞府调整功法槽位。' : '',
      major && bn.missing.length
        ? `【尚未达标】${bn.missing.join('；')}（可前往洞府「参悟大道」提升道心与法则）`
        : `徒手冲关成算：${Math.round(rawP * 100)}%${rawPenalty > 0 && needItemName ? `（无「${needItemName}」护持，凶险倍增）` : ''}。`,
    ].filter(Boolean);

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
      c.layer++;
      c.exp = 0;
      if (c.layer >= REALMS[c.realm].layers) {
        c.realm++;
        c.layer = 0;
        const extraMajor = [];
        if (s.flags['前世秘藏']) {
          const legacy = Math.round(1500 * Math.pow(REALMS[c.realm].powerMult || 1, 0.5));
          c.stones += legacy;
          extraMajor.push(`【前世秘藏】破境感应旧藏，灵石 +${legacy.toLocaleString()}`);
        }
        if (c.realm === 1 && !c.daoBaseQuality) {
          const score = c.attrs.道心 + c.attrs.根骨 + c.attrs.悟性 * 0.5 + qualityBonus - c.demon * 0.4 + (c.rootId === 'tianling' || c.rootId === 'hundun' ? 24 : 0);
          let chosen = DAO_BASE_QUALITIES[0];
          for (const q of DAO_BASE_QUALITIES) if (score >= q.minScore) chosen = q;
          c.daoBaseQuality = chosen.id;
          extraMajor.push(`【道基天成】铸就「${chosen.name}」（全境战力永久 ×${chosen.mult}）——${chosen.desc}`);
          this.pushRumor(`【九州惊闻】「${c.name}」成功筑基，铸就「${chosen.name}」！`);
        } else if (c.realm === 2 && !c.goldenCoreQuality) {
          const score = c.attrs.道心 + c.attrs.悟性 * 0.8 + c.attrs.神识 * 0.5 + qualityBonus - c.demon * 0.4 + (c.daoBaseQuality === 'tiandao' ? 18 : c.daoBaseQuality === 'shang' ? 8 : 0);
          let chosen = GOLDEN_CORE_QUALITIES[0];
          for (const q of GOLDEN_CORE_QUALITIES) if (score >= q.minScore) chosen = q;
          c.goldenCoreQuality = chosen.id;
          extraMajor.push(`【丹成天象】凝结「${chosen.name}」（全境战力永久 ×${chosen.mult}）——${chosen.desc}`);
          this.pushRumor(`【九州震动】「${c.name}」丹成紫气东来，竟是「${chosen.name}」！`);
        }
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
            text: `${prefix ? `${prefix}\n\n` : ''}灵气化液，经脉拓宽如江河！你正式踏入【${realmLabel(c)}】，功法运使槽位增至 ${maxTechSlots(c.realm)} 槽！`,
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
    const lawResist = lawBonusSum(s.char, 'tribulationResist') + (petBonuses(s.char).tribResist || 0);
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
    const lawResist = clamp(lawBonusSum(s.char, 'tribulationResist') + (petBonuses(s.char).tribResist || 0), 0, 0.5);
    const rootDmgMult = (s.char.rootId === 'lei' ? 0.7 : s.char.rootId === 'hundun' ? 1.3 : 1) * (1 - lawResist);
    const ok = this.rng.chance(ch.params.p);
    if (!ok) {
      s.char.hp = Math.max(0, s.char.hp - Math.round(s.char.maxHp * 0.45 * rootDmgMult));
      s.char.injuries = (s.char.injuries || 0) + 2;
      s.char.demon = clamp(s.char.demon + 6, 0, 100);
      s.char.bonusLifespan = (s.char.bonusLifespan || 0) - 120;
      recomputeDerived(s.char);
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
        const bonusStones = Math.round(450 * Math.pow(REALMS[s.char.realm].powerMult, 0.55));
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

  /* ---------------- 指数战力战斗系统（槽位功法 + 十阶法宝百分比 + 称号 + 灵兽全实装） ---------------- */

  startCombat(spec, { lines = [] } = {}) {
    const s = this.state;
    const defId = typeof spec === 'string' ? spec : spec.enemy;
    const def = ENEMY_BY_ID[defId];
    if (!def) { this.state.scene.result = { text: '敌手见势不妙，早已远遁。', lines }; return; }
    const preserve = typeof spec === 'object' && spec.preserveEnemyRealm;
    const enemy = preserve ? { ...def } : scaleEnemy(def, s.char.realm);
    s.stats.encounters = (s.stats.encounters || 0) + 1;
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
    const withArt = activeTechniques(c).filter((t) => t.artName);
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
    const artifactMult = 1 + (c.artifactLevel || 0) * 0.08;
    const sectAtk = SECT_BY_ID[c.sectId]?.perks?.atk || 0;
    const techAtk = activeTechniques(c).reduce((acc, t) => acc + (t.atk || 0), 0)
      + techCollectionBonus(c)
      + techAlignmentConflict(c).evilMasteryBonus;
    const rootAtk = c.rootId === 'jin' ? 0.2 : c.rootId === 'xue' ? 0.15 : 0;
    const gfAtk = c.goldenFingerId === 'gf_sword_elder' ? 0.14 : 0; // +0.06 starting tech = exact +20%
    const petAtk = petBonuses(c).atk || 0;
    const titleAtk = titleBonuses(c).atk || 0;
    const lawAtk = lawBonusSum(c, 'atk');
    const statTerm = Math.min(c.attrs.根骨, 160) * 0.65;
    return Math.round(
      (14 + statTerm + best * 0.35) * pm * layerMult * qMult * artifactMult
      * (1 + sectAtk + techAtk + rootAtk + gfAtk + petAtk + titleAtk + lawAtk),
    );
  }

  playerSpellAtk() {
    const c = this.state.char;
    const pm = REALMS[c.realm]?.powerMult || 1;
    const layerMult = 1 + (c.layer || 0) * 0.1;
    const qMult = qualityMultiplier(c);
    const artifactMult = 1 + (c.artifactLevel || 0) * 0.08;
    const techAtk = activeTechniques(c).reduce((acc, t) => acc + (t.atk || 0), 0) + techCollectionBonus(c);
    const lawAtk = lawBonusSum(c, 'atk');
    const titleAtk = titleBonuses(c).atk || 0;
    const statTerm = Math.min(c.attrs.神识, 160) * 0.8;
    return Math.round((16 + statTerm) * pm * layerMult * qMult * artifactMult * (1 + techAtk * 0.75 + lawAtk + titleAtk));
  }

  playerDef() {
    const c = this.state.char;
    const pm = REALMS[c.realm]?.powerMult || 1;
    const layerMult = 1 + (c.layer || 0) * 0.1;
    const qMult = qualityMultiplier(c);
    const artifactMult = 1 + (c.artifactLevel || 0) * 0.08;
    const bestDef = c.inventory.reduce((max, it) => Math.max(max, ITEM_BY_ID[it.id]?.equip?.def || 0), 0);
    const techDef = activeTechniques(c).reduce((acc, t) => acc + (t.def || 0), 0);
    const lawDef = lawBonusSum(c, 'def');
    const titleDef = titleBonuses(c).def || 0;
    const statTerm = Math.min(c.attrs.根骨, 160) * 0.32;
    return Math.round((4 + statTerm + bestDef * 0.4) * pm * layerMult * qMult * artifactMult * (1 + techDef + lawDef + titleDef));
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

    const sunMult = c.rootId === 'taiyang' && e.isDemon ? 1.4 : 1;
    const armorMult = e.trait === '护甲' ? 1.35 : 1;
    const critChance = clamp(0.08 + (c.attrs.气运 + (petBonuses(c).luck || 0)) * 0.004 + lawBonusSum(c, 'crit'), 0.05, 0.65);
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
      if (e.isDemon) s.counters.demons_slain = (s.counters.demons_slain || 0) + 1;
      if (e.id === 'cultivator' && !c.inventory.some((it) => ITEM_BY_ID[it.id]?.equip)) s.flags['空手胜筑基'] = true;
      const exp = Math.round(e.exp * (1 + c.attrs.气运 * 0.01));
      const stones = Math.round(e.stones * (1 + (petBonuses(c).stones || 0)));
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

    const defMult = (c.rootId === 'tu' ? 0.8 : 1)
      * (c.goldenFingerId === 'gf_stealth' ? 0.82 : 1)
      * (1 - Math.min(0.4, petBonuses(c).def || 0));
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

  /* ---------------- 结局 / 成就（跨世死亡计数 + 成就换轮回点） ---------------- */

  finishEnding(id) {
    const s = this.state;
    const ending = ENDING_BY_ID[id] || ENDINGS[ENDINGS.length - 1];
    if (s.flags.finished) return;
    s.flags.finished = true;
    s.flags.endingId = ending.id;
    s.scene = { id: 'ending', result: null };
    if (!s.meta.unlockedEndings.includes(ending.id)) s.meta.unlockedEndings.push(ending.id);
    s.meta.runs = (s.meta.runs || 0) + 1;
    s.meta.totalDeaths = (s.meta.totalDeaths || 0) + 1;
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
        `—— ${s.char.name}，享年 ${Math.floor(s.char.age / 12)} 岁（入道 ${Math.max(0, Math.floor((s.char.age - 192) / 12))} 年），${realmLabel(s.char)}。`,
        `此生：奇遇 ${s.stats.events} 次 · 突破 ${s.stats.breakthroughs} 次 · 杀敌 ${s.stats.kills} 尊 · 终章「${ending.name}」`,
        `当前可用轮回点：${s.meta.karmaPoints || 0}（历世累计结局 ${s.meta.unlockedEndings.length}/${ENDINGS.length} · 成就 ${Object.keys(s.meta.achievements).length}/${ACHIEVEMENTS.length}）。`,
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
    s.counters.laws = Object.values(s.char.laws || {}).reduce((a, b) => a + Number(b || 0), 0);
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
    choices.push({ id: 'back', label: '离开商行', hint: '返回坊市主街', action: 'openCity' });
    return {
      id: 'market',
      title: `${region.name} · 灵材商行`,
      text: `商行架上陈列着「${region.name}」当令丹药与奇珍（当前享受综合折扣 ${Math.round(discount * 100)}%）。\n\n持有灵石：${s.char.stones.toLocaleString()}`,
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
      text: '掌柜验过成色，爽快奉上一袋灵石。',
      lines: [`出售 ${ITEM_BY_ID[id]?.name || id}，灵石 +${price.toLocaleString()}`],
      returnTo: 'sell',
    };
    this.emit();
  }

  buildRecruitNode() {
    const s = this.state;
    const c = s.char;
    const ctx = contextOf(s, this);
    const inCooldown = Boolean(c.sectLeaveUntil && c.age < c.sectLeaveUntil);
    const cooldownY = inCooldown ? Math.ceil((c.sectLeaveUntil - c.age) / 12) : 0;
    const entryRank = this.entryRankForRealm(c.realm);
    const entryRankName = SECT_RANKS[entryRank]?.name || '外门弟子';
    const eligible = SECTS.filter((sect) => {
      if (sect.id === 'sanxiu') return true;
      try { return compileCondition(sect.requireExpr || 'true')(ctx); } catch { return true; }
    });
    const choices = eligible.map((sect) => {
      const banned = Boolean(c.sectBlacklist?.[sect.id]);
      const karmaBlocked = sect.align === '正' && c.karma <= -150;
      return {
        label: `${sect.name}（${sect.align}）${banned ? ' [已除名]' : ''}`,
        hint: banned ? '曾叛离此宗，永不录用' : karmaBlocked ? '业力深重，正道拒收' : `入宗直授「${entryRankName}」 · ${sect.technique}`,
        action: 'joinSect',
        sectId: sect.id,
        disabled: banned || karmaBlocked || inCooldown,
        reason: banned ? '原宗黑名单' : inCooldown ? `叛门冷却还剩 ${cooldownY} 年` : '业力不符',
      };
    });
    choices.push({ label: '暂不入宗', hint: '天大地大，稍后再议', action: 'backHub' });
    return {
      id: 'recruit',
      title: '寻访仙门 · 十三宗山门',
      text: `你踏遍九州名山大川。按你当前「${realmLabel(c)}」修为，拜入仙门将直接礼聘为【${entryRankName}】！${inCooldown ? `\n\n⚠️ 叛门通缉未满，还需 ${cooldownY} 年方可再入宗门。` : ''}`,
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
