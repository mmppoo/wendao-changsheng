/**
 * 坊间盛会（v8.2）：赌石鉴宝、丹器斗法、五域天骄茶会三大公开打脸专场。
 *
 * 设计纪律：
 * - 每项盛会严格 12 个月冷却（state.fairCooldowns），杜绝刷钱刷属性。
 * - 属性涨幅共用 faceSlap.js 的每大境总额度（FS_ATTR_BUDGET = 8）。
 * - 真实读角色构筑：赌石看神识/气运/鉴宝流/天机镜/器灵；丹器看真实炼丹数/法宝阶数/火灵根/青崖宗/炉坊/小绿瓶；
 *   天骄茶会看战力/法则/道基结丹品质/儒道文气/敛息反差（末席惊艳全场）。
 * - 严守宁朝五域专名，不含任何旧世界禁用词。
 */
import { clamp } from './rng.js';
import { REALMS, realmLabel, LAW_STAGES } from '../data/realms.js';
import { REGION_BY_ID } from '../data/regions.js';
import { ITEM_BY_ID } from '../data/items.js';
import { PROVOKER_SURNAMES, PROVOKER_GIVENS } from '../data/faceSlapScenarios.js';
import {
  advanceMonths, addItem, gainExp, gainLawExp, monthlyExp, perceivedRealmLabel, maxLawLevel,
} from './state.js';
import { bumpFaceSlapAttr, foundationScore } from './faceSlap.js';

function fairCost(char, base) {
  const pm = REALMS[char.realm]?.powerMult || 1;
  return Math.round(base * Math.pow(pm, 0.45));
}

function cooldownLeftMonths(state, kind) {
  const until = state.fairCooldowns?.[kind] || 0;
  return Math.max(0, until - (state.char?.age || 0));
}

export function buildFairHubNode(game) {
  const s = game.state;
  const c = s.char;
  const region = REGION_BY_ID[c.regionId] || REGION_BY_ID.qingniu;
  const stoneCost = fairCost(c, 180);
  const craftCost = fairCost(c, 120);
  const salonCost = fairCost(c, 100);

  const cdStone = cooldownLeftMonths(s, 'stone');
  const cdCraft = cooldownLeftMonths(s, 'craft');
  const cdSalon = cooldownLeftMonths(s, 'salon');

  const isAppraiser = c.originId === 'merchant' || c.originId === 'artifact_spirit' || c.goldenFingerId === 'gf_karma_mirror' || c.originId === 'outsider';
  const isHide = (c.auraStance || 'normal') === 'hide';

  const choices = [
    {
      id: 'fair_stone_steady',
      label: `赌石鉴宝 · 细观灵纹择良石（入场 ${stoneCost.toLocaleString()} 石）`,
      hint: cdStone > 0
        ? `今年已开过石，还需 ${cdStone} 月`
        : `稳健神识鉴宝${isAppraiser ? ' · 出身/机缘大幅加成' : ''} · 胜则赢回赌注与奇珍`,
      action: 'fairPlay',
      params: { kind: 'stone', mode: 'steady', cost: stoneCost },
      disabled: cdStone > 0 || c.stones < stoneCost,
      reason: cdStone > 0 ? `还需 ${cdStone} 月` : `需 ${stoneCost.toLocaleString()} 灵石`,
    },
    {
      id: 'fair_stone_gamble',
      label: `赌石鉴宝 · 豪赌角落废料原石（入场 ${stoneCost.toLocaleString()} 石）`,
      hint: cdStone > 0
        ? `今年已开过石，还需 ${cdStone} 月`
        : '众人只当你买了块废石',
      action: 'fairPlay',
      params: { kind: 'stone', mode: 'gamble', cost: stoneCost },
      disabled: cdStone > 0 || c.stones < stoneCost,
      reason: cdStone > 0 ? `还需 ${cdStone} 月` : `需 ${stoneCost.toLocaleString()} 灵石`,
      effect: isAppraiser && cdStone === 0 && c.stones >= stoneCost ? 'primary' : '',
    },
    {
      id: 'fair_craft',
      label: `丹器斗法台 · 当众开炉试锋（押金 ${craftCost.toLocaleString()} 石）`,
      hint: cdCraft > 0
        ? `今年已登过台，还需 ${cdCraft} 月`
        : `检验真本事：已炼丹 ${s.counters.alchemy || 0} 炉 · 法宝 ${c.artifactLevel || 0} 阶`,
      action: 'fairPlay',
      params: { kind: 'craft', cost: craftCost },
      disabled: cdCraft > 0 || c.stones < craftCost,
      reason: cdCraft > 0 ? `还需 ${cdCraft} 月` : `需 ${craftCost.toLocaleString()} 灵石`,
    },
    {
      id: 'fair_salon_duel',
      label: `天骄茶会 · ${isHide ? '末席藏锋，反手惊艳全场' : '演武论道，力压同辈'}（帖资 ${salonCost.toLocaleString()} 石）`,
      hint: cdSalon > 0
        ? `今年已赴过会，还需 ${cdSalon} 月`
        : isHide
          ? `你正敛息显「${perceivedRealmLabel(c)}」，会被排到末席`
          : `凭底蕴（${foundationScore(s)}）与法则（${LAW_STAGES[maxLawLevel(c)]}）压服诸域才俊`,
      action: 'fairPlay',
      params: { kind: 'salon', mode: isHide ? 'underdog' : 'prestige', cost: salonCost },
      disabled: cdSalon > 0 || c.stones < salonCost,
      reason: cdSalon > 0 ? `还需 ${cdSalon} 月` : `需 ${salonCost.toLocaleString()} 灵石`,
      effect: isHide && cdSalon === 0 && c.stones >= salonCost ? 'primary' : '',
    },
    { id: 'back_city', label: '离开盛会', hint: '回市集坊间', action: 'openCity' },
  ];

  return {
    id: 'fairHub',
    title: `${region.name} · 坊间盛会`,
    text: `街口红绸高挂，原石坊、丹器斗法台与茶楼雅集正热闹非凡。各路世家子弟、外门骄子都在此处一争高下，每项盛会每年可登台一回。\n\n战绩：赌石 ${s.counters.fair_stone_wins || 0} 胜 · 丹器 ${s.counters.fair_craft_wins || 0} 胜 · 茶会 ${s.counters.fair_salon_wins || 0} 胜`,
    choices,
    subhub: true,
  };
}

export function resolveFairPlay(game, params = {}) {
  const s = game.state;
  const c = s.char;
  const rng = game.rng;
  const region = REGION_BY_ID[c.regionId] || REGION_BY_ID.qingniu;
  const { kind = 'stone', mode = 'steady', cost = 100 } = params;

  if (cooldownLeftMonths(s, kind) > 0) return { error: '此项盛会今年已参与过' };
  if (c.stones < cost) return { error: `灵石不足（需 ${cost.toLocaleString()}）` };

  c.stones -= cost;
  s.stats.goldSpent = (s.stats.goldSpent || 0) + cost;
  s.fairCooldowns = s.fairCooldowns || {};
  s.fairCooldowns[kind] = c.age + 12;
  const lines = advanceMonths(s, 1, rng);
  const rival = rng.pick(PROVOKER_SURNAMES) + rng.pick(PROVOKER_GIVENS);
  const rarePool = region.veinYield?.items?.length ? region.veinYield.items : (region.exploreRewards || ['lingcao']);
  const commonPool = region.exploreRewards?.length ? region.exploreRewards : ['lingcao', 'yinqi_dan'];

  // ==================== 一、赌石鉴宝 ====================
  if (kind === 'stone') {
    const mirror = c.goldenFingerId === 'gf_karma_mirror';
    const merchant = c.originId === 'merchant';
    const spirit = c.originId === 'artifact_spirit';
    const outsider = c.originId === 'outsider';
    const specialBonus = (mirror ? 0.24 : 0) + (merchant ? 0.16 : 0) + (spirit ? 0.14 : 0) + (outsider ? 0.1 : 0);
    const statBonus = (c.attrs.神识 || 10) * 0.007 + (c.attrs.气运 || 5) * 0.006;

    if (mode === 'gamble') {
      const p = clamp(0.24 + statBonus + specialBonus, 0.2, 0.88);
      if (rng.chance(p)) {
        const jackpot = rng.pick(rarePool);
        const prizeStones = Math.round(cost * 2.6);
        c.stones += prizeStones;
        addItem(s, jackpot, 1);
        c.reputation += 35 + c.realm * 8;
        s.counters.fair_stone_wins = (s.counters.fair_stone_wins || 0) + 1;
        s.counters.faceslap_wins = (s.counters.faceslap_wins || 0) + 1;
        bumpFaceSlapAttr(game, '神识', 1);
        const clueText = mirror
          ? '天机因果镜在袖中微微一烫，直指废料堆最底下一块满是裂纹的灰石。'
          : merchant
            ? '你三代药商炼出的毒眼一眼看透石皮下的隐隐灵脉，毫不犹豫指向那块人人嫌弃的边角废料。'
            : spirit
              ? '你指尖轻触废料堆，识海里顿时响起一丝极细微的器韵共鸣。'
              : '你在满地嘲笑声中挑中角落里那块灰扑扑的废料原石。';
        const itemName = ITEM_BY_ID[jackpot]?.name || jackpot;
        lines.push(`【一刀惊全场】切出稀世奇珍「${itemName}」×1，赢下对赌灵石 +${prizeStones.toLocaleString()}，声望 +${35 + c.realm * 8}。`);
        game.pushRumor(`【坊间奇闻】「${c.name}」在${region.name}赌石坊专挑废料原石，一刀切出「${itemName}」，把对赌的${rival}气得吐血。`);
        s.scene.result = {
          text: `${clueText}\n\n一旁的世家阔少${rival}捂着肚子大笑：「花${cost}灵石买块垫脚石，还要跟本少爷加赌？切不出灵光你把石渣吞下去。」\n\n解石刀落下第三寸，一道耀眼宝光骤然冲破棚顶，整块「${itemName}」完整显露。满场死寂两息后轰然炸开，${rival}脸色由红转白，乖乖拍出赌资灰溜溜钻出了人群。`,
          lines,
          fx: 'breakthrough',
          returnTo: 'fairHub',
        };
      } else {
        lines.push(`废料原石切开只见半块碎玄铁，损失入场灵石 ${cost.toLocaleString()}。`);
        s.scene.result = {
          text: `解石刀一路切到底，那块灰扑扑的废料里只藏了一点微弱灵渣。${rival}得意地收走彩头嗤笑而去，你也暗暗记下这一回走眼的教训。`,
          lines,
          returnTo: 'fairHub',
        };
      }
    } else {
      const p = clamp(0.45 + statBonus + specialBonus * 0.8, 0.35, 0.92);
      if (rng.chance(p)) {
        const item = rng.pick(commonPool);
        const prizeStones = Math.round(cost * 1.55);
        c.stones += prizeStones;
        addItem(s, item, 1);
        c.reputation += 20 + c.realm * 5;
        s.counters.fair_stone_wins = (s.counters.fair_stone_wins || 0) + 1;
        const itemName = ITEM_BY_ID[item]?.name || item;
        lines.push(`【稳操胜券】切出「${itemName}」×1，连本带利收回灵石 +${prizeStones.toLocaleString()}，声望 +${20 + c.realm * 5}。`);
        s.scene.result = {
          text: `你闭目以神识细细扫过石皮脉络，避开几块金玉其外的假料，挑出一块灵气内敛的青皮原石。解石刀落，清光流转，「${itemName}」成色十足。先前嘲笑你挑挑拣拣的${rival}切出一块空心石，脸色黑得像锅底。`,
          lines,
          fx: 'alchemy',
          returnTo: 'fairHub',
        };
      } else {
        const back = Math.round(cost * 0.45);
        c.stones += back;
        lines.push(`原石成色平平，折价回血 ${back.toLocaleString()} 灵石。`);
        s.scene.result = {
          text: `石皮切开后灵气散了大半，只够勉强折回近半本钱。你在原石坊外站了片刻，细细回想方才石纹的误判之处。`,
          lines,
          returnTo: 'fairHub',
        };
      }
    }
    game.afterAction();
    game.emit();
    return;
  }

  // ==================== 二、丹器斗法台 ====================
  if (kind === 'craft') {
    const alchemySkill = Math.min(30, (s.counters.alchemy || 0) * 4) + (c.laws?.pill || 0) * 10;
    const forgeSkill = Math.min(30, (c.artifactLevel || 0) * 5);
    const sectBoost = (c.sectId === 'danxia' || c.sectId === 'jiguan') ? 16 : 0;
    const rootBoost = c.rootId === 'huo' ? 14 : 0;
    const gfBoost = c.goldenFingerId === 'gf_bottle' ? 18 : c.originId === 'artifact_spirit' ? 16 : 0;
    const mastery = Math.max(alchemySkill, forgeSkill) + sectBoost + rootBoost + gfBoost + (c.attrs.悟性 || 10) * 0.6;
    const p = clamp(0.18 + mastery * 0.011, 0.15, 0.94);

    if (rng.chance(p)) {
      const rewardItem = rng.pick(rarePool);
      const prizeStones = Math.round(cost * 2.1);
      c.stones += prizeStones;
      addItem(s, rewardItem, 1);
      c.reputation += 32 + c.realm * 8;
      s.counters.fair_craft_wins = (s.counters.fair_craft_wins || 0) + 1;
      s.counters.faceslap_wins = (s.counters.faceslap_wins || 0) + 1;
      const lawLines = gainLawExp(s, 18 + c.realm * 5, 'pill');
      const itemName = ITEM_BY_ID[rewardItem]?.name || rewardItem;
      lines.push(`【技惊四座】力压斗法台骄子，赢彩头灵石 +${prizeStones.toLocaleString()}、「${itemName}」×1，声望 +${32 + c.realm * 8}。`, ...lawLines);
      game.pushRumor(`【丹器风闻】「${c.name}」在${region.name}丹器斗法台一手控火成丹之术惊艳满座，令自诩天才的${rival}当场认输。`);
      s.scene.result = {
        text: `台上丹坊少主${rival}正洋洋得意炫耀自己的控火手法，见你登台便嗤笑：「哪来的野路子，别在台上炸了炉丢人现眼。」\n\n你不语，抬手引火落炉、灵力稳如止水。半柱香后炉盖掀开，清香直透半条长街，成色比对方高出整整一筹。几位白须评委当场起身鼓掌，${rival}看着自己那炉焦边废丹，涨红着脸拂袖下台。`,
        lines,
        fx: 'breakthrough',
        returnTo: 'fairHub',
      };
    } else {
      const lawLines = gainLawExp(s, 10 + c.realm * 3, 'pill');
      lines.push(`火候差了一线，惜败于台上老手。平日还需多开炉炼丹、祭炼法宝或参悟丹道。`, ...lawLines);
      s.scene.result = {
        text: `你虽尽力控火，却因平日丹器磨砺不足，成色终究逊了台上浸淫多年的${rival}半筹。对方得意地收下彩头，你记下他提火收丹的窍门，心中已有计较。`,
        lines,
        returnTo: 'fairHub',
      };
    }
    game.afterAction();
    game.emit();
    return;
  }

  // ==================== 三、五域天骄茶会 ====================
  const fScore = foundationScore(s);
  const lawLv = maxLawLevel(c);
  const scholarBoost = c.originId === 'scholar' ? 14 : c.originId === 'royal' ? 10 : 0;
  const totalScore = fScore + lawLv * 8 + scholarBoost + (c.attrs.悟性 || 10) * 0.4;
  const p = clamp(0.24 + totalScore * 0.008, 0.2, 0.94);

  if (rng.chance(p)) {
    const prizeStones = Math.round(cost * 2.2);
    const expGain = gainExp(s, Math.round(monthlyExp(s) * 1.4));
    c.stones += prizeStones;
    c.reputation += 40 + c.realm * 10;
    s.counters.fair_salon_wins = (s.counters.fair_salon_wins || 0) + 1;
    s.counters.faceslap_wins = (s.counters.faceslap_wins || 0) + 1;
    if (mode === 'underdog') s.counters.lowkey_wins = (s.counters.lowkey_wins || 0) + 1;
    else s.counters.flex_wins = (s.counters.flex_wins || 0) + 1;
    bumpFaceSlapAttr(game, '道心', 2);
    const lawLines = gainLawExp(s, 20 + c.realm * 6);
    const body = mode === 'underdog'
      ? `因你敛息只显「${perceivedRealmLabel(c)}」，茶会执事顺手把你塞到门口最末一席。主座上的门阀才俊${rival}举杯调侃：「如今茶会门槛这么低，连这等小辈都能进来混茶喝了？」\n\n论道过半，你放下茶盏淡淡开口，一语点破对方苦思三年的功法死结，顺势散开一缕${realmLabel(c)}浑厚道韵。满堂茶杯同时轻鸣，先前嘲笑你的人僵在座椅上，连执事都慌忙躬身请你移步上座。`
      : `茶会上群英毕集，门阀骄子${rival}自恃根基深厚，接连压服数人，傲然环顾满座。你从容起身接话，论道句句切中大道筋骨，一身浑厚底蕴与法则气象更令对方气机受制。满座诸修齐齐起身拱手敬茶，茶会头筹的灵石与名望尽归你手。`;
    lines.push(`【惊艳满座】夺得天骄茶会头筹：灵石 +${prizeStones.toLocaleString()}，修为 +${expGain.toLocaleString()}，声望 +${40 + c.realm * 10}，道心 +2。`, ...lawLines);
    game.pushRumor(`【茶会风闻】「${c.name}」在${region.name}天骄茶会上${mode === 'underdog' ? '自末席一言压服全场' : '力压群雄夺得头筹'}，风头一时无两。`);
    s.scene.result = {
      text: body,
      lines,
      fx: 'breakthrough',
      returnTo: 'fairHub',
    };
  } else {
    const expGain = gainExp(s, Math.round(monthlyExp(s) * 0.7));
    lines.push(`茶会高手如云，你虽未夺魁，听诸修论道仍有所得：修为 +${expGain.toLocaleString()}。`);
    s.scene.result = {
      text: `席间果然藏龙卧虎，${rival}一手门阀秘传根基扎实，你一番交锋落了半步下风。好在听完诸家法门印证，对自身破境反倒生出几分新悟。`,
      lines,
      returnTo: 'fairHub',
    };
  }
  game.afterAction();
  game.emit();
}
