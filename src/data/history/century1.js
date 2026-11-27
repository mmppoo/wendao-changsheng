/**
 * 第一纪元 · 第一百年（B001「山河未定」）的大历史事件。
 *
 * 原典（只读）：~/Desktop/game/packages/content/data/century1/
 *   timeline.json（80 件分域大事）、interventions.json（7 个干预节点）、
 *   disasters.json（主劫：南泽大水，baselineDemoYear 18）、endings.json（11 个百年结局）。
 *   文本取自 locales/zh-CN.json；原典 baseline 多为占位「按基准推进」，这里按
 *   B12 §9 分区域时间线与 §10 人物基准走向补写成一句话。
 *
 * ───────── 世界指标的刻度（照 B12 §7.5，原样沿用，不另换算） ─────────
 *   grainDays       临河粮储可支撑天数（日）。起始 18。
 *   routeCapacity   临河可稳定接粮的日运量（份/日）。起始 700。
 *   command         临河号令（守将权威、可控兵数、通信、军官），0–1000。起始 420。
 *   organization    里正、船工、医者、保长与劳力的组织程度，0–1000。起始 400。
 *   dikeHealth      河湾堤、南圩、旧闸综合耐久，0–1000。起始 280。
 *   boats           可用船只（艘）。起始 12。
 *   warningCoverage 预兆能传到村落的覆盖，0–1000。起始 200。
 *   responseCapacity 应对力，0–1000。起始 400（B20 由组织映射，原典未给初值，取与组织同值）。
 *   westRoute30dCapacity 西线三十日连续日运量（份/日）。起始 300。
 *   assetLossPermille 资产损失（‰）。起始 280（= 洪水模板 baseAssetLossPermille）。
 *   causeCoefficient 成因系数 C，0–1000。起始 1000。C = 粮暴露 300 + 预警缺口 250
 *                   + 路线失效 250 + 低地暴露 200；只有「先知」选项能削减，削到 0 即主劫消弭。
 *   mainDisasterFlood 本百年主劫是否为大水：恒为 1（本作把主劫固定为第 18 年临河大水）。
 *   顾淮存亡用世界印记 world.flags.guHuaiDead 表示（effects.world 只能加减数值）。
 *
 * 结局门槛照 endings.json 原值（粮 45、路 1200、号令 600、组织 650、堤 550、船 30 …）。
 * 南泽各事件的增减量：干预节点照 interventions.json 原值；时间线事件与预兆为本作补写。
 * 南泽以外的四个干预节点：原典字段全保留，但其中六项临河本地指标
 * （grainDays / routeCapacity / command / organization / boats / dikeHealth）按原值一成计入，
 * 因为这些字段在本作里是临河一地的快照（B12 §7.5「临河当前可稳定接粮……」）；
 * 预警、应对、西线、资产损失仍按原值。
 *
 * 不干预：指标停在起始值 → 粮 18 < 20 但路 700 不小于 700，「有将无粮」不中 → 落到「临河失守」，即原典基准。
 * 第一世尽力而不知前事：路线与号令都到不了门槛，最好是「有组织撤离」或「缺粮僵持」。
 * 第二世带着手札：先知选项补上路线与号令，可达「临河守住了」；五处先知把 C 削到 0 则「主劫消弭」。
 *
 * 金钱：原典以铜钱计（日工约 7 文），本作统一换成灵石，约 10 文折 1 灵石。
 * 南泽三个干预节点的先知项一律出力不出钱（前世所见能说动州府、里正出钱出人），寒门起手 0 灵石也能走通。
 * 南泽时间线大事的窗口起点取编号年（如 y003 取 3—5），原典窗口是基准年前后各 2 年，起点提前会让开局连弹几件大事。
 */
import { compileCondition, buildContext } from '../../engine/expr.js';

export const CENTURY1_WORLD_START = {
  grainDays: 18,
  routeCapacity: 700,
  command: 420,
  organization: 400,
  dikeHealth: 280,
  boats: 12,
  warningCoverage: 200,
  responseCapacity: 400,
  westRoute30dCapacity: 300,
  assetLossPermille: 280,
  totalDeathsPermille: 0,
  causeCoefficient: 1000,
  mainDisasterFlood: 1,
  // 四域的本地局势（本作补设，供各域后续事件读取）
  northSupply: 0,
  northCohesion: 0,
  donglingOrder: 0,
  qingyaWater: 0,
  courtCredit: 0,
  manorPower: 0,
  westOrder: 0,
  flags: {},
};

const SEER_LOCK = '前世手札未载';
const K_FLOOD = 'y018.nanze_baseline_flood';
const K_JUDGE = 'y019.century_judgement';

const SHORT = {
  g: 'grainDays', r: 'routeCapacity', c: 'command', o: 'organization', d: 'dikeHealth',
  b: 'boats', wc: 'warningCoverage', p: 'responseCapacity', a: 'assetLossPermille',
  k: 'causeCoefficient', west: 'westRoute30dCapacity', dead: 'totalDeathsPermille',
};

function W(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj || {})) out[SHORT[k] || k] = v;
  return out;
}

/** 效果简写：fx({ o: 30, c: 10 }, { relation: { 赵守: 8 } }) */
function fx(world, extra = {}) {
  const res = { ...extra };
  if (world && Object.keys(world).length) res.world = W(world);
  return res;
}

function key2id(key) {
  return `c1_${key.replace(/\./g, '_')}`;
}

function hist(key, title, h, text, choices) {
  return {
    id: key2id(key),
    title,
    pool: 'history',
    weight: 0,
    text,
    choices,
    history: {
      key,
      domain: h.domain ?? null,
      regions: h.regions || [],
      window: h.window,
      baseline: h.baseline,
      major: Boolean(h.major),
      minRealm: h.minRealm || 0,
    },
  };
}

/** 链上的后续节点：不带 history 字段，不会被当成另一件大事。 */
function link(id, title, text, choices) {
  return { id, title, pool: 'history', weight: 0, text, choices };
}

function opt(label, hint, text, effects, more = {}) {
  const { goto, ...rest } = more;
  return { label, hint, ...rest, outcome: { text, effects: effects || {}, ...(goto ? { goto } : {}) } };
}

function seer(gateKey, label, hint, text, effects, more = {}) {
  return opt(`【先知】${label}`, hint, text, effects, { ...more, require: `known("${gateKey}")`, requireHint: SEER_LOCK });
}

function wv(state, field) {
  return Number(state.world?.[field]) || 0;
}

// ─────────────────────────── 百年结局 ───────────────────────────
// 判定按 priority 从小到大，先中者为准（endings.json）。条件只读世界指标，不读主角位置。
// 主劫恒为大水；mainDisasterFlood 起始 1，写成 >= 0 是为了世界指标未初始化时仍判作大水。
const FLOOD = 'world("mainDisasterFlood") >= 0';
const NOFLOOD = 'world("mainDisasterFlood") < 0';

export const CENTURY1_OUTCOMES = [
  {
    id: 'disaster_eliminated', canonId: 'ending:b12.disaster_eliminated', name: '主劫消弭', priority: 1,
    // 加上 mainDisasterFlood >= 1：世界指标未初始化（全为 0）时不至于误判为消弭
    condition: 'world("mainDisasterFlood") >= 1 && world("causeCoefficient") <= 0',
    summary: '大水照样来了，没有成灾。',
    text: '第十八年的水比前世还大。水报一站站传下来，南圩的人早已住在高处，城北高仓里的粮一粒没湿，编了号的船赶在水头前把最后几户接了出来。\n\n水从堤外过去，在芦滩漫了几天，退了。临河没有淹死人。宋宜在账本上写：本年大水，城南淹田若干，人口无损。',
  },
  {
    id: 'linhe_holds', canonId: 'ending:b12.linhe_holds', name: '临河守住了', priority: 2,
    condition: `${FLOOD} && world("grainDays") >= 45 && world("routeCapacity") >= 1200 && world("command") >= 600 && world("organization") >= 650 && world("dikeHealth") >= 550`,
    summary: '堤没有决口，粮够，船够，兵也没散。',
    text: '第三弯的桩打得深，决口没有出现。水在堤外涨了七天，城里的粮够吃，船来来去去运粮接人，顾淮手下没有一个兵逃走。\n\n水退以后，南圩淹了几块田。临河城门照常开，粮码头照常卸粮。',
  },
  {
    id: 'orderly_evacuation', canonId: 'ending:b12.orderly_evacuation', name: '有组织撤离', priority: 3,
    condition: `${FLOOD} && world("organization") >= 650 && world("boats") >= 30 && (world("grainDays") < 45 || world("routeCapacity") < 1200 || world("command") < 600)`,
    summary: '城没有守住，人大多撤了出来。',
    text: '堤还是塌了。锣一响，南圩的人按片往高处走，船在两条路口接人。城没守住，人大多撤了出来。\n\n临河空了半年。水退后人们回来，房子塌了不少，人还在。',
  },
  {
    id: 'hungry_standoff', canonId: 'ending:b12.hungry_standoff', name: '缺粮僵持', priority: 4,
    condition: `${FLOOD} && world("grainDays") >= 60 && world("command") < 450`,
    summary: '仓里有粮，城里没有人说话算数。',
    text: '仓里有粮，城里却没有人说话算数。州府、守军、粮商各守各的仓门，水退后一个多月，粮没有发到逃难的人手里。\n\n城外的人饿着，城里的仓满着，两边僵了一个冬天。',
  },
  {
    id: 'command_without_grain', canonId: 'ending:b12.command_without_grain', name: '有将无粮', priority: 5,
    condition: `${FLOOD} && !world.flags.guHuaiDead && world("grainDays") < 20 && world("routeCapacity") < 700`,
    summary: '顾淮守住了城，仓里却没有粮，路也断了。',
    text: '顾淮守住了城，兵也还听他的，可仓里没有粮，路也断了。他每天在城头站一会儿，看下游有没有运粮的船。\n\n入冬前，城里开始拆门板，煮树皮。',
  },
  {
    id: 'two_routes', canonId: 'ending:b12.two_routes', name: '两路皆通', priority: 6,
    condition: `${NOFLOOD} && world("westRoute30dCapacity") >= 900 && world("grainDays") >= 30 && world("command") >= 500`,
    summary: '主劫不在水上，西线与河运两路都通。',
    text: '这一年的灾不在河上。西边的商道撑住了三十天的运量，南泽的粮也照常北上，两条路都没有断。',
    dormant: true,
  },
  {
    id: 'western_exodus', canonId: 'ending:b12.western_exodus', name: '西线流亡', priority: 7,
    condition: `${NOFLOOD} && world("westRoute30dCapacity") >= 900 && world("command") < 500`,
    summary: '西线通了，号令却散了，人顺着西线往外走。',
    text: '西边的路是通的，可没有人能把人留住。一家跟着一家，顺着沙道往西去了。',
    dormant: true,
  },
  {
    id: 'linhe_falls', canonId: 'ending:b12.linhe_falls', name: '临河失守', priority: 8, baseline: true,
    condition: FLOOD,
    summary: '第三弯决口，南仓泡毁，临河易主。',
    text: '第三弯决了口。水灌进南圩，泡了南仓，冲走了堤下的草棚。城里的粮撑了十几天，守军开始抢粮，州府的人连夜出了城。\n\n第二年开春，临河换了主人。',
  },
  {
    id: 'disaster_collapse', canonId: 'ending:b12.disaster_collapse', name: '灾后崩溃', priority: 9,
    condition: `${NOFLOOD} && (world("totalDeathsPermille") >= 20 || world("assetLossPermille") >= 250) && world("responseCapacity") < 500`,
    summary: '灾后死伤太重，应对不过来。',
    text: '灾过去了，人和房子损了一大片，能出来收拾的人太少。一个冬天过去，许多村子没有再点起灶火。',
    dormant: true,
  },
  {
    id: 'disaster_contained', canonId: 'ending:b12.disaster_contained', name: '灾情受控', priority: 10,
    condition: NOFLOOD,
    summary: '灾来了，控制住了。',
    text: '灾来了，损了些田舍，人大多保住了。第二年开春，各处照常下种。',
    dormant: true,
  },
  {
    id: 'normal_century', canonId: 'ending:b12.normal_century', name: '平年', priority: 11,
    condition: `${NOFLOOD} && false`,
    summary: '百年无主劫。',
    text: '这一百年里没有大灾。粮价起落，渡口换了几代人，日子照常过。',
    dormant: true,
  },
];

const OUTCOME_FN = CENTURY1_OUTCOMES.map((o) => ({ o, fn: compileCondition(o.condition) }));

/** 按优先级判出本世百年结局，返回结局对象。 */
export function evaluateCentury1Outcome(state) {
  const ctx = buildContext({ flags: {}, counters: {}, char: { inventory: [] }, ...state });
  for (const { o, fn } of OUTCOME_FN) {
    let ok = false;
    try { ok = fn(ctx); } catch { ok = false; }
    if (ok) return o;
  }
  return CENTURY1_OUTCOMES.find((o) => o.baseline);
}

/** 第 i 个结局「恰好命中」的条件：自己成立，且排在前面的都不成立。 */
function exclusiveCondition(i) {
  const before = CENTURY1_OUTCOMES.slice(0, i).map((o) => `!(${o.condition})`);
  return [`(${CENTURY1_OUTCOMES[i].condition})`, ...before].join(' && ');
}

const EV = [];

// ═══════════════════════════ 南泽 · 大水之前 ═══════════════════════════

EV.push(hist('y001.nanze_requisition_ferry', '南泽征粮与河湾渡', {
  domain: 'nanze', regions: ['qingniu'], window: [1, 3], major: true,
  baseline: '征粮令压到青石镇，河湾渡只剩一条能用的渡船，商路暂时受阻。',
}, '第一年开春，临河州府的征粮令贴在青石祠庙的墙上：每户加征三斗，限一月内运到临河粮码头。告示底下围了一圈人，识字的念一句，不识字的跟着骂一句。\n\n里正赵守蹲在告示底下算账，算一遍，叹一口气。河湾渡那边更乱，两条渡船坏了一条，何六一天只敢摆五趟，等着运粮的车从渡口排到了市集口。\n\n赵守抬头看见你：「你识字吧？过来帮我把各户的数记一记。」', [
  opt('坐下帮赵守记账', '花一整天。各户交了多少、欠了多少，一笔笔记清',
    '你和赵守对着各户的门牌记了一天。有三户的田早就卖了，册子上还挂着名字，赵守把这三户圈出来，说要拿去州府对。\n\n账记清了，镇上吵的人少了一半。',
    fx({ o: 30, c: 10 }, { relation: { 赵守: 8 }, flag: { c1_zhao_ledger: true } })),
  opt('去渡口帮何六修那条坏船', '桐油船钉先赊着，你出两日力气',
    '船底的缝比何六说的还长。你们把旧麻絮抠出来，塞进新的，再刷两遍桐油。第三天船下了水，不漏了。\n\n两条船轮着摆，渡口排的车当天清了一半。',
    fx({ b: 2, r: 40 }, { relation: { 何六: 8 } })),
  opt('劝赵守先照数交粮', '不花钱。州府那边少找麻烦，镇上有人会记恨',
    '赵守听了你的，当天就派人挨户收粮。临河的仓里多了几百石。\n\n镇上有两户人家连种子粮都交了出去。夜里有人往赵守家门上泼了泥。',
    fx({ g: 4, o: -20 }, { relation: { 赵守: -5 } })),
]));

EV.push(hist('y003.nanze_refugees', '南泽流民入镇', {
  domain: 'nanze', regions: ['qingniu', 'luoxia'], window: [3, 5], major: true,
  baseline: '北边逃荒的人沿河南下，挤在青石镇和临河城外的南圩空滩上，病的没人管。',
}, '这一年秋天，北边来的流民顺着河走到了青石镇。先是十几个，后来是几十个，背着锅，牵着孩子，在旧宅后面的空地上搭草棚。\n\n徐娘一早上看了二十多个病人，药箱见了底。赵守站在镇口，手里捏着临河送来的文书：守将顾淮要青石镇把能干活的流民送去临河修堤。\n\n「留下，镇上的粮不够。送走，一家人就拆散了。」赵守看着你，「你说怎么办？」', [
  opt('帮赵守给流民登记造册', '花三天。谁家几口人、会什么手艺，记清楚',
    '你们一户一户问：从哪来，几口人，会什么手艺。三天后造出一本册子，谁家能干活、谁家有病人，一翻就知道。\n\n流民里有两个会看水的老船工，你把名字单独记下了。',
    fx({ o: 40, wc: 20 }, { relation: { 赵守: 5 }, flag: { c1_refugee_register: true } })),
  opt('出钱搭棚，请徐娘看病', '约 15 灵石买竹子茅草和药',
    '你买了竹子和茅草，流民自己动手，五天搭起四排棚子。徐娘把病人分到最里面一排，熬了三大锅药。\n\n入冬时棚里没有死人。',
    fx({ o: 20, p: 30 }, { relation: { 徐娘: 10 } }), { cost: { stones: 15 } }),
  opt('把能干活的人送去临河修堤', '不花钱。临河多了人手，镇上少了口粮',
    '一百二十个青壮跟着临河来的兵走了，老人和孩子留在棚里。顾淮把他们编进修堤的队里，河湾那段堤加了一层土。\n\n棚里有个女人天天到渡口等，等了一个冬天。',
    fx({ d: 30, c: 10, o: -10 }, { relation: { 顾淮: 5 } })),
  opt('劝赵守堵住镇口，不收人', '镇上的粮能多撑几天',
    '镇口用大车堵上了。流民在河滩上待了几天，往下游去了。\n\n镇上的粮多撑了几天。后来有人在芦洲看见他们，说是投了黑风寨。',
    fx({ g: 3, o: -30 }, { karma: -10, flag: { c1_refused_refugees: true } })),
  seer(K_FLOOD, '把流民安置在废窑一带的高坡上', '前世第十八年的大水，南圩空滩上的草棚一夜之间全没了',
    '你没有让流民往南圩那边的空滩去。废窑后面那片高坡地薄，种不了粮，离河却远。\n\n赵守不明白你为什么非要选那里。你只说那边干。前世第十八年夏天南圩草棚的事，你没有说出口。',
    fx({ o: 30, p: 20, k: -100 }, { relation: { 赵守: 5 }, rewrite: '流民没有落户南圩低地，改住在废窑高坡' })),
]));

EV.push(hist('y005.nanze_linhe_grain_tight', '临河粮紧', {
  domain: 'nanze', regions: ['luoxia', 'qingniu'], window: [5, 7], major: true,
  baseline: '临河仓粮只够守军和城中一月，钱三等粮商收紧粮仓，粮价一月翻了一倍。',
}, '临河粮码头的告示换了三回，一回比一回写得少。州府仓里只剩一个月的粮，守军的饷已经拖了两个月。码头上卸粮的船一天比一天少。\n\n青石镇的钱三把仓门关了一半，每天只卖二十石，价钱一天一涨。粮仓吏宋宜拿着账本在码头上来回走，账上的数和仓里的数差了四百石，她查了三天没查出去向。\n\n守将顾淮派人来问你们几个常跑码头的：开不开城仓平粜？', [
  opt('劝顾淮开仓平粜', '城仓少一层粮，民心和军心稳一些',
    '城仓开了三天，粮价落回去一截。顾淮在码头上站了一上午，看着手下把粮一斗一斗量给百姓，没有人闹。\n\n仓里的粮又薄了一层。',
    fx({ g: -4, o: 30, c: 20 }, { relation: { 顾淮: 5 } })),
  opt('拿钱去钱三那里买粮补仓', '约 20 灵石',
    '钱三掂了掂你的钱袋，开了半扇仓门：「这个价，也就是你。」\n\n二十石粮装上船运到临河，宋宜在账上记了你的名字。',
    fx({ g: 6 }, { relation: { 钱三: 5, 宋宜: 3 } }), { cost: { stones: 20 } }),
  opt('帮宋宜定口粮配给', '省粮，东市会有人闹',
    '每人每日一升，守军一升半，按户发签。宋宜的签子一根根数过去，没有多发一根。\n\n粮省下来了。东市有人砸了两家粮铺，说配给的签子落不到穷人手里。',
    fx({ g: 5, o: -20 }, { relation: { 宋宜: 5 } })),
  seer('y015.nanze_city_granary_low', '趁钱三还没封仓，按旧价订下三个月的粮', '约 20 灵石。前世这年粮价一月翻倍，过几年城仓见底',
    '你赶在钱三关仓前一天上门，按旧价订了三个月的粮，先付了定钱。钱三看你的眼神有点怪，一个后生，怎么比他还急。\n\n半个月后粮价翻了一倍。契已经画了押，钱三只能照旧价发粮。',
    fx({ g: 12 }, { relation: { 钱三: 3, 宋宜: 5 }, rewrite: '临河在粮价翻倍之前订下了三个月的粮' }), { cost: { stones: 20 } }),
]));

EV.push(hist('y008.nanze_ferry_disrepair', '南泽渡船失修', {
  domain: 'nanze', regions: ['qingniu'], window: [8, 10],
  baseline: '河湾渡的船烂了没钱修，夜渡停了，青石到临河的货要绕平桥多走两天。',
}, '河湾渡的两条船都老了。一条船帮裂了缝，一条舵柄烂了半截。何六说修好要一笔木料钱，州府不给，镇上不出，船工的工钱也欠了两个月，有一个船工已经去临河码头扛包了。\n\n夜里没人敢渡。有急事的人只能绕去平桥的石拱渡，多走两天。前天夜里，东田一户人家的孩子发高热，背到渡口过不去，又背回镇上找徐娘。\n\n何六坐在缆桩上，一袋烟抽了半个时辰。', [
  opt('出钱补船', '约 15 灵石的木料',
    '你出了木料钱，跟何六一起把裂缝的船帮换了两块板，舵柄用的是沈砚铺里剩下的硬木。\n\n两条船又能一起摆了，青石到临河的货少绕了两天路。',
    fx({ b: 3, r: 60 }, { relation: { 何六: 5 } }), { cost: { stones: 15 } }),
  opt('出钱替何六雇两个船工', '约 20 灵石，半个月工钱',
    '你雇了两个流民里会撑船的汉子，工钱按天给。何六终于能歇口气，船也能多摆两趟。',
    fx({ b: 2, o: 10, p: 10 }, { relation: { 何六: 8 } }), { cost: { stones: 20 } }),
  opt('帮何六立下停夜渡的规矩', '不花钱。少淹死人，白天会更挤',
    '你和何六在渡口挂了两盏灯，立了块牌子：天黑停渡，急事敲锣。\n\n夜里泅水过河的人少了，白天的渡口更挤。',
    fx({ o: 20, wc: 10, r: -20 }, { relation: { 何六: 3 } })),
]));

EV.push(hist('y012.nanze_omen_dock_steps', '码头石阶上的水痕', {
  domain: 'nanze', regions: ['luoxia'], window: [11, 13],
  baseline: '临河粮码头的水痕一年比一年高，宋宜两次报州府，都没有回音。',
}, '宋宜带你去看粮码头的石阶。每年汛后，她都在最高的水痕上刻一道，旁边刻上年份。今年这一道比三年前高了两级，离码头的仓门只差五级。石阶缝里卡着去年冲上来的螺壳。\n\n「上游的河床在抬高，堤还是三十年前的堤。」她用指甲刮掉石阶上的青苔，「我报过两回州府，回文说知道了，就没有下文。」\n\n码头上扛包的人从她身边走过，没有人低头看一眼那些刻痕。', [
  opt('帮她把水痕和年份抄成一份，送给顾淮', '守将那边多一个心眼',
    '顾淮看了抄件，没说什么。第二天，他派了两个兵每月去码头量一次水。',
    fx({ wc: 30, c: 5 }, { relation: { 宋宜: 8 }, flag: { c1_omen_dock: true } })),
  opt('自己去河湾堤走一遍，看哪里渗水', '花半天。记下渗水的地方，日后修堤用得上',
    '你沿着河湾堤走了半天。第三弯那里，堤脚的草比别处绿，踩下去是软的。你在那里插了一根竹竿做记号。',
    fx({ wc: 10 }, { relation: { 宋宜: 3 }, flag: { c1_seen_seep: true } })),
]));

EV.push(hist('y012.nanze_south_grain_north', '南粮北运', {
  domain: 'nanze', regions: ['qingniu', 'luoxia'], window: [12, 14], major: true,
  baseline: '州府奉令把南泽的粮北运接济雁门，临河仓里只留下两成，青石粮价又涨一轮。',
}, '朝廷的公文到了临河：北境欠饷，南泽各州府限期北运粮米。州府长官顾衡把数分到各镇，青石镇摊了两千石。摊到各户，每户又是三斗。\n\n行商陆清在市集上骂了一上午。他的船被州府征去运粮，运费只给一半，路上的花销还要自己垫。钱三在等，看州府能出什么价。\n\n顾衡在码头上点船，看见你，招了招手：「你在青石跑过渡，北路你熟不熟？」', [
  opt('照州府的令把粮北运', '临河仓里空一块，朝廷记州府一功',
    '三十条船从临河粮码头出发。朝廷记了临河一功，州府拨钱把北去的纤道修了一遍。\n\n临河仓里空了一大块。',
    fx({ g: -6, c: 30, r: 50 }, { relation: { 顾衡: 5 } })),
  {
    label: '跟陆清的船走北路护粮', hint: '路上不太平，看身手',
    roll: {
      p: 0.6, attrs: { 根骨: 0.01 },
      success: {
        text: '一路上两回有人夜里摸船，都被你们赶走了。粮一石没少运到北边。陆清回来请你喝酒，把这一趟的运费分了你一份。\n\n州府从此走这条北路，船走得比以前快。',
        effects: fx({ r: 120, c: 20 }, { relation: { 陆清: 10 }, stones: 10 }),
      },
      fail: {
        text: '过芦洲旧河闸时船被拦住，黑风寨的人跳上船抢走两船粮。你挨了一刀，好歹把剩下的船带了出去。',
        effects: fx({ r: 60 }, { relation: { 陆清: 5 }, hp: -30, injury: 1 }),
      },
    },
  },
  opt('劝顾衡扣下一半粮不发', '临河留住粮，京里会不高兴',
    '顾衡上报说今年歉收，只运了一半。仓里的粮留住了。\n\n两个月后京里来了申饬的公文。州府的人见了顾衡，说话不像以前那样客气了。',
    fx({ g: 8, c: -40 }, { relation: { 顾衡: -5 } })),
  seer(K_FLOOD, '只发七成，三成以途耗之名存进城北高仓，北路由你押', '城北地高，前世那场大水没淹到那里',
    '你在顾衡面前把账摊开：七成按期北运，路上由你和陆清押船；剩下三成记成途耗，运进城北旧仓。\n\n顾衡盯着账看了很久，盖了印。朝廷收到了粮，临河也留下了粮，北路的船一趟比一趟快。',
    fx({ g: 8, c: 40, r: 150 }, { relation: { 顾衡: 5, 陆清: 8 }, rewrite: '南粮北运留下了三成，存在城北高仓' })),
]));

EV.push(hist('y014.nanze_omen_compass', '沈砚的罗盘', {
  domain: 'nanze', regions: ['qingniu'], window: [13, 15],
  baseline: '沈砚的测灵罗盘在河湾指向水脉，连日不稳，他只当是器物出了毛病。',
}, '沈砚把一面铜罗盘放在柜台上。盘心的针一直在抖，往河湾那边偏。他用手按住，一松手又偏回去。柜台上还摊着他画了一半的刻度图。\n\n「临河水脉在涨。」他用指节敲了敲盘边，「这种抖法，我在观星台的旧册子里见过，后头记的是大水。」\n\n说完这句，他把罗盘收进抽屉，回去拉风箱，不再提观星台的事。铺子外面有人来取修好的锄头，他头也没抬。', [
  opt('借罗盘去临河，给宋宜看', '宋宜管着码头的水痕，两样对得上',
    '宋宜把罗盘放在码头石阶上看了一下午，针一直朝上游偏。她把罗盘的读数和自己刻的水痕抄在一页上，送去了州府。',
    fx({ wc: 30 }, { relation: { 沈砚: 3, 宋宜: 5 }, flag: { c1_compass_shown: true } })),
  opt('出钱请沈砚多做几面测水的盘子，分给各渡口', '约 20 灵石',
    '沈砚做了五面，样子粗，只认水脉涨落。河湾渡、菱湖渡、石拱渡、沙湾渡各放一面，最后一面送去了临河粮码头。',
    fx({ wc: 60, p: 10 }, { relation: { 沈砚: 8 } }), { cost: { stones: 20 } }),
]));

EV.push(hist('y015.nanze_city_granary_low', '南泽城仓见底', {
  domain: 'nanze', regions: ['luoxia'], window: [15, 17], major: true,
  baseline: '临河城仓见底，账面与实存差了一千石，顾淮只能缩减守军口粮，城中人心浮动。',
}, '宋宜把账本摊在仓门口的石墩上。账上写着八千石，仓里实有不到七千，差的一千多石，是三年里一笔一笔不见的。她把每一笔都用朱笔圈了出来，圈了满满三页。\n\n顾淮的兵已经吃了半个月稀粥，城门口站岗的人腿都在打晃。城里有人传，州府的人把粮偷偷卖给了芦洲的黑风寨。\n\n顾淮站在仓门口，看着那三页朱圈：「你们说，现在怎么办？」', [
  opt('帮宋宜一仓一仓重新盘点', '花七天',
    '你们盘了七天。差的粮找到一半，堆在一个没登记的偏仓里，账是一个已经调走的仓吏做的。\n\n顾淮把账贴在码头上，谣言停了。',
    fx({ o: 30, c: 15, g: 4 }, { relation: { 宋宜: 8 }, flag: { c1_audit_done: true } })),
  opt('拿钱去平桥粮行买粮', '约 30 灵石',
    '平桥粮行的价比青石低一成。你买了五十石，雇车运回临河，路上走了三天。',
    fx({ g: 8 }, { relation: { 宋宜: 3 } }), { cost: { stones: 30 } }),
  opt('先排好撤城的路线和人手', '花几天。不添粮，添的是人手和路',
    '你和顾淮的副手把城里分成六片，每片定一个领头的人，备好灯和锣，看好往城北高地去的路。\n\n顾淮说，但愿用不上。',
    fx({ o: 60, b: 4, p: 20, wc: 20 }, { relation: { 顾淮: 3 } })),
  seer(K_FLOOD, '带宋宜去看前世的决口处，请顾淮调兵护仓', '前世决口在河湾第三弯',
    '你没有讲前世，只把宋宜带到河湾第三弯，让她看堤脚下的渗水。宋宜蹲下摸了摸泥，回头就去找顾淮。\n\n顾淮带人来看了一遍，当天调一队兵守仓，又派人每日巡这段堤。兵们听说是为了防水，干活不再拖。',
    fx({ g: 6, c: 70, o: 30 }, { relation: { 顾淮: 10, 宋宜: 10 }, worldFlag: { guHuaiWarned: true }, rewrite: '顾淮提前把兵调到了河湾堤，城仓有了守备' })),
]));

EV.push(hist('y016.nanze_omen_ferry_water', '何六说水不对', {
  domain: 'nanze', regions: ['qingniu'], window: [15, 17],
  baseline: '河湾渡的水提早发黄，何六说今年水不对，没有人听。',
}, '何六把篙插进水里，拔出来给你看。篙上的泥一指厚，颜色发黄，捏在手里是细沙。渡口的老船户都围过来看。\n\n「往年入夏才黄，今年开春就黄了。上游下了大雨，下了不止一两场。」他把篙在船帮上磕干净，「我爹那辈说过，水黄得早的年份，河湾要出事。」\n\n河堤柳林的树根露出来一截，前年还埋在土里。渡口下游，有人家已经把晒网的架子往坡上挪了。', [
  opt('帮何六把渔船都拉上岸，编号记下', '多几条随时能用的船',
    '河湾上下二十多条渔船，你们一条条编号，写上船主的名字，拴在高处的桩上。\n\n何六说，真到那时候，一条船能救一家人。',
    fx({ b: 6, o: 10 }, { relation: { 何六: 5 } })),
  opt('告诉赵守，让各户早收早储', '镇上多存几天粮',
    '赵守让各户把今年的麦子早割十天，晒干了存进祠庙后面的仓里。有人嫌麦子没熟透，赵守没理。',
    fx({ g: 3, o: 10 }, { relation: { 赵守: 3 } })),
]));

EV.push(hist('y017.nanze_omen_upstream', '上游来的信', {
  domain: 'nanze', regions: ['luoxia'], window: [16, 17],
  baseline: '宛丘、陈州一带连月大雨的消息传到临河，州府没有加修河堤。',
}, '宋宜收到一封从宛丘来的信，是她早年在观星台的一个旧识写的：宛丘、陈州一带下了四十天雨，河水漫过了两处低堤，有几个村子已经搬上了岗地。\n\n「水从上游下来，到临河要一个多月。」她把信折好，压在账本底下，「什么时候到，到多大，我算不出来。」\n\n州府长官顾衡还在为今年的税粮发愁，案上堆的全是催粮的公文，堤上的事没人管。', [
  opt('陪宋宜去州府，劝顾衡征民夫加堤', '堤高一点，民夫会有怨言',
    '顾衡被说动了，征了三百民夫。时间太紧，只在最低的两段堤上加了一层土。民夫们抱怨工钱拖着不发。',
    fx({ d: 40, o: -10 }, { relation: { 顾衡: -3, 宋宜: 5 } })),
  opt('劝顾淮先把南仓的粮往城里挪一部分', '粮离堤远一点',
    '顾淮挪了三成。南仓离堤太近，剩下的粮他说城里没有地方放。',
    fx({ g: 5, c: 10 }, { relation: { 顾淮: 5 } })),
  seer(K_FLOOD, '在上游设水报，一站接一站传到临河和青石', '出力，跑一个月。前世水头到临河时，城里还没有一个人知道',
    '你从宛丘到临河之间走了一个月，找了六处渡口和村子，跟里正、船户一处处说好：水涨到哪块石头就点烟、敲锣，往下传。\n\n宋宜把六处的名字抄在账本最后一页。她问你怎么知道水会走哪条路，你说听船工讲的。',
    fx({ wc: 200, o: 20, k: -250 }, { relation: { 宋宜: 8 }, rewrite: '临河有了从上游一站站传下来的水报' })),
]));

// ═══════════════════════════ 南泽 · 干预节点 ═══════════════════════════

EV.push(hist('intervention.qingshi_market_field', '青石镇市场与东田', {
  domain: 'nanze', regions: ['qingniu'], window: [2, 17],
  baseline: '东田的水渠塌了一段没人修，秋粮少收三成，钱三的粮价跟着涨。',
}, '青石镇的粮价一天一个样。北路断信之后，粮商钱三把仓门关了一半，每天只开一个时辰，门口排的人从粮铺排到了祠庙。有人背着空口袋排了一上午，排到跟前，仓门关了。\n\n东田的水渠去年冬天塌了一段，水漫进低处的灵田。里正赵守说，开春前修不好，秋粮要少三成；他手上的钱，只够买几捆麻绳。\n\n阿衡在田埂上看了你一眼：「你是来买粮的，还是来种地的？」', [
  opt('先去钱三那里买口粮', '约 15 灵石。趁粮价未涨，替东田几户囤一个半月的口粮',
    '你趁钱三还没涨价，买了够东田几户人家吃一个半月的口粮。讨价、过秤、搬运，忙到天黑。',
    fx({ g: 6 }, { relation: { 钱三: 3 } }), { cost: { stones: 15 }, goto: 'c1_iv_market_2' }),
  opt('不买粮，直接下东田', '',
    '你没有去市集，跟着阿衡下了田。',
    {}, { goto: 'c1_iv_market_2' }),
]));

EV.push(link('c1_iv_market_2', '东田', '东田那段渠塌了七八丈，水从缺口漫进低处，三亩灵田泡得发白。阿衡带着家里人在挖，挖一天，塌一点。\n\n赵守也在田边，手里拿着佃约的底稿：镇上有几块田没人种，愿意租的按年交租。', [
  opt('下田帮阿衡修渠', '出两日力气，麻绳竹筐用阿衡家的',
    '你跟阿衡挖了两天，把塌的那段用石头垒起来，外面糊泥。水从渠里走了，田里的积水两天就退了。\n\n阿衡没多说话，收工时把自家的锄头借给了你。',
    fx({ g: 8, r: 10, o: 15 }, { relation: { 阿衡: 10 } })),
  opt('跟赵守签下一块佃田', '约 8 灵石首年押租',
    '你签了一亩二分的佃约，首年押租先交。赵守在册子上添了你的名字。\n\n从此你算是青石镇种田的人了。',
    fx({ o: 20, c: 5, g: 5 }, { relation: { 赵守: 6 }, flag: { c1_tenant: true } }), { cost: { stones: 8 } }),
  opt('挨家说合，把东田的农户拢到一起', '约 12 灵石请饭备工具，跑三天',
    '你在东田跑了三天，请各家吃了两顿饭。最后定下来：各户按田亩出工修渠，渠修好后轮流守水，收了粮先存一部分进祠庙的义仓。\n\n二十几户人头一回坐在一处说话。赵守说这事他当里正十年没办成。',
    fx({ o: 80, g: 12, wc: 10, r: 30 }, { relation: { 赵守: 10, 阿衡: 5 }, flag: { c1_farmers_organized: true } }), { cost: { stones: 12 } }),
  seer(K_FLOOD, '拢起农户，再把义仓设在废窑高坡', '出力。前世祠庙后面的仓在大水里泡了，这话说出来，各家肯自带饭食出工',
    '你照样请各家吃饭、分工修渠。说到义仓放哪，大家都想放在祠庙后面，近。你坚持放到废窑那边的高坡上，宁可每回多走半里路。\n\n阿衡问你为什么。你说祠庙地势低。他想了想，带头把自家的粮先挑了上去。',
    fx({ o: 80, g: 16, wc: 30, r: 60, c: 5 }, { relation: { 赵守: 10, 阿衡: 8 }, flag: { c1_farmers_organized: true }, rewrite: '东田的义仓建在了废窑高坡上' })),
]));

EV.push(hist('intervention.hewan_ferry', '河湾渡口', {
  domain: 'nanze', regions: ['qingniu'], window: [4, 17],
  baseline: '河湾渡只剩一条漏水的渡船，夜里有人泅水过河淹死，渡口撑不过汛期。',
}, '河湾渡只剩一条能用的渡船，船底漏水，每天只敢摆三趟，舀水的木瓢就放在船尾。渡口的缆桩换过三回，最新的那根也裂了。岸上的车马挤成一团。\n\n渡口挤满了等着过河的人，有挑担的，有赶车的，有背着孩子的流民。夜里有人偷偷泅水过河，前天淹死了两个，尸首在下游的芦苇里找到。\n\n何六蹲在船头补缝，手上全是桐油：「再这样下去，这船撑不过入夏。」', [
  opt('出钱出力修渡船', '约 16 灵石桐油船钉木料，再跟何六补两日',
    '桐油、船钉、木料，你花了一笔钱，跟何六在船上补了两天缝。补好的船吃水稳了，一天能多摆四五趟。',
    fx({ b: 8, r: 15, p: 5 }, { relation: { 何六: 10 } }), { cost: { stones: 16 }, goto: 'c1_iv_ferry_2' }),
  opt('出钱雇两个船工帮何六', '约 21 灵石，两人半个月工钱',
    '两个船工半个月的工钱，你先付了。何六终于能把船分成早晚两班。',
    fx({ b: 5, o: 10, p: 10 }, { relation: { 何六: 4 } }), { cost: { stones: 21 }, goto: 'c1_iv_ferry_2' }),
  opt('先在渡口看一看', '',
    '你在渡口坐到天黑。',
    {}, { goto: 'c1_iv_ferry_2' }),
]));

EV.push(link('c1_iv_ferry_2', '夜渡', '天黑以后，渡口还有人在等。有人出高价求夜渡，也有人干脆脱了衣服往水里走。\n\n何六说，渡口该有个规矩，可他一个渡夫，说话没人听。', [
  opt('召集船户和流民头人，立夜渡规矩', '约 4 灵石灯笼更锣，花一日',
    '你买了灯笼和更锣，把河湾上下的船户、流民里的头人请到渡口。规矩是：天黑停渡，急病急事敲锣，轮值的船户出船，钱按日结。\n\n此后一个月，渡口没再淹死人。',
    fx({ b: 10, o: 20, wc: 15, p: 15 }, { relation: { 何六: 6 } }), { cost: { stones: 4 } }),
  opt('回镇上', '渡口的事还是何六一个人扛',
    '你回了镇上。渡口的事，还是何六一个人扛着。',
    {}),
  seer(K_FLOOD, '把河湾上下的船编成船队，与上游约好传水报', '出力。前世大水那几天，船都在，没有一条知道该往哪去',
    '你照着前世大水那几天的样子排：哪几条船去南圩接人，哪几条去粮码头运粮，哪几条留在青石。每条船编了号，船主按了手印。上游三处渡口约好了，见水涨就敲锣往下传。\n\n何六看着那张船单，问你是不是在别处管过船。你说没有，看得多。',
    fx({ b: 18, r: 200, o: 20, wc: 40, p: 20, k: -250 }, { relation: { 何六: 10 }, rewrite: '河湾渡有了编号的船队和水报，水来时船能马上出动' })),
]));

EV.push(hist('intervention.linhe_dike_granary', '临河堤与粮仓', {
  domain: 'nanze', regions: ['luoxia'], window: [6, 17],
  baseline: '河湾堤年久失修，堤下南仓的粮没有挪，州府说没钱，守军说没人。',
}, '临河城外的大堤是三十年前修的，河湾那一段已经能看见渗水，堤脚的草比别处长得旺。堤顶上的路被牛踩出了一道道沟。\n\n城南的粮仓就在堤下，离堤不到一里。守将顾淮说兵手不够，城防都排不满；粮仓吏宋宜说州府没钱修堤，修仓的钱也挪去北运了。\n\n堤上放牛的老人说，这条河几十年一大涨，上一回大水，城南淹到了屋檐，他家的牛是从房顶上牵下来的。', [
  opt('出钱出人加固河湾那段堤', '约 40 灵石土石草袋与雇工，亲自督工五日',
    '你买了土石草袋，雇了五十多个人工，在堤上督工五天。渗水最重的两段打了木桩，外面压了三层草袋。\n\n顾淮来看了一回，拨了一队兵帮着运土，又把城里能用的船编成了护堤的船队。',
    fx({ d: 320, o: 60, b: 12, r: 30, g: 10, a: -30 }, { relation: { 顾淮: 5 } }), { cost: { stones: 40 }, goto: 'c1_iv_dike_2' }),
  opt('照你插竹竿的地方修', '约 25 灵石。你在第三弯看过渗水，少走弯路',
    '你直接把人带到插竹竿的那段。堤脚一挖开，里面是空的。土石都填在了要紧处，钱比预计省了一截。',
    fx({ d: 320, o: 60, b: 12, r: 30, g: 10, a: -30 }, { relation: { 顾淮: 5, 宋宜: 3 } }),
    { cost: { stones: 25 }, require: 'flag("c1_seen_seep")', requireHint: '没去堤上看过', goto: 'c1_iv_dike_2' }),
  opt('在上游挖分水沟', '约 15 灵石，四日。大水来时分走一股，沟边的田要被淹',
    '你带人在上游挖了一条分水沟，四天挖了两里长。大水来时能分走一部分。沟边的几块田要被淹，田主骂了你好几天。',
    fx({ d: 100, g: 30, r: 10, a: -40 }, {}), { cost: { stones: 15 }, goto: 'c1_iv_dike_2' }),
  seer(K_FLOOD, '照前世的决口处修，木桩打在第三弯', '出力。前世是第三弯先塌的；你带顾淮去看，他肯出兵出料',
    '你没有去修渗水最重的那两段，直接把顾淮请到第三弯。那里看着最结实，前世的堤就是从那里塌的，里面早被水掏空了。\n\n你当着他的面让兵打桩。桩打下去第二根就没了顶，下面是空的。顾淮没说话，当天调了一半的兵、拨了州府存的土石过来，又让人在上游顺手挖了一道分水沟。',
    fx({ d: 380, o: 60, b: 12, r: 120, g: 30, a: -40, c: 30 }, { relation: { 顾淮: 10 }, rewrite: '河湾第三弯的决口处提前打了桩' }), { goto: 'c1_iv_dike_2' }),
  opt('先不动堤，去看堤下的粮仓', '',
    '你从堤上下来，往南仓走。',
    {}, { goto: 'c1_iv_dike_2' }),
]));

EV.push(link('c1_iv_dike_2', '堤下南仓', '堤下的南仓存着临河大半的粮。仓是旧仓，地基低，离堤不到一里。\n\n宋宜算过，把粮搬上城北要雇挑夫，搬两天。州府说城北的旧仓漏雨。', [
  opt('雇挑夫把粮搬上高处', '约 10 灵石',
    '一百多个挑夫搬了两天，南仓搬空了一半。城北旧仓漏雨的地方用油布盖上，宋宜每天去看一回。',
    fx({ g: 60, o: 30, r: 15, b: 5 }, { relation: { 宋宜: 8 } }), { cost: { stones: 10 }, goto: 'c1_iv_dike_3' }),
  opt('粮留在南仓', '南仓离码头近，发粮方便',
    '粮没有动。南仓离码头近，发粮方便。',
    {}, { goto: 'c1_iv_dike_3' }),
  seer(K_FLOOD, '全数搬进城北高仓，南仓只留空仓', '出力。前世水退后，南仓的粮泡了半个月，全发了霉',
    '你让宋宜把南仓全部搬空，一粒不留。宋宜说留一点方便发粮，你不肯，自己带着守军的辅兵扛了两天。\n\n城北旧仓修好了屋顶，仓底又垫了一尺高的石头。',
    fx({ g: 60, o: 30, r: 15, b: 5, k: -300 }, { relation: { 宋宜: 10 }, rewrite: '临河的粮全数搬上了城北高仓' }), { goto: 'c1_iv_dike_3' }),
]));

EV.push(link('c1_iv_dike_3', '南圩', '南圩田和芦滩田一带住着上千户人，地势比汛期的河面还低。真要来水，往高处去只有两条路，路窄，夜里看不清。', [
  opt('排好撤离路线和人手', '约 12 灵石灯火锣饭钱，花三天',
    '你花了三天，把南圩分成十几片，每片定好领头的人、去高处的路、敲锣的时辰。顾淮派兵在两条路口各设了一个哨。',
    fx({ o: 100, b: 20, wc: 50, p: 30, c: 20 }, { relation: { 顾淮: 5 } }), { cost: { stones: 12 } }),
  opt('不管南圩，回城', '',
    '你回了城。南圩的人照旧种田、晒网。',
    {}),
  seer(K_FLOOD, '汛前就把南圩的老弱迁去高处', '出力。前世锣响的时候，南圩的老人孩子走不动',
    '你没等水来，先把南圩的老人、孩子和病人一家家劝到城北高地，借住在亲戚家和祠堂里。青壮留下看田，路口的哨照样设。\n\n有几户死活不肯走，你让他们把船拴在门口。',
    fx({ o: 100, b: 20, wc: 50, p: 30, c: 40, k: -100 }, { relation: { 顾淮: 8 }, rewrite: '汛期之前，南圩的老弱已经住到了高处' })),
]));

// ═══════════════════════════ 南泽 · 第十八年大水 ═══════════════════════════

function floodOpening(state) {
  const d = wv(state, 'dikeHealth');
  const g = wv(state, 'grainDays');
  const b = wv(state, 'boats');
  const w = wv(state, 'warningCoverage');
  const lines = ['第十八年，入夏以后雨一直没停。河水三天里涨过了粮码头的第九级石阶，河湾堤上日夜有人敲锣。城南的人家把桌椅垫高，把孩子送去城北的亲戚家。'];
  lines.push(d >= 550 ? '河湾堤打过桩、压过草袋，堤顶还高出水面三尺。'
    : d >= 400 ? '堤修过几段，没修过的地方已经在冒水。'
      : '堤还是老样子，第三弯那里的堤脚泡软了。');
  lines.push(g >= 45 ? '城北高仓里的粮，够全城吃一个多月。'
    : g >= 20 ? '仓里的粮，够吃二十来天。'
      : '仓里的粮撑不过半个月。');
  lines.push(b >= 30 ? '河湾上下的船都编了号，拴在高处的桩上。' : '能用的船不过十几条。');
  lines.push(w >= 400 ? '上游的水报一站站传下来：水头还有两天到。' : '上游没有消息传下来，没人说得清水什么时候到。');
  return `${lines.join('\n\n')}\n\n顾淮在城头调兵，宋宜在粮码头点数。你得选一处去。`;
}

EV.push(hist(K_FLOOD, '临河大水', {
  domain: 'nanze', regions: ['qingniu', 'luoxia'], window: [18, 18], major: true,
  baseline: '第十八年夏，河湾堤在第三弯决口，南圩、芦滩尽成泽国，南仓存粮泡毁，临河城缺粮缺船。',
}, floodOpening, [
  opt('上河湾堤，跟着守军扛草袋', '堤上多一个人',
    '你把鞋脱了别在腰上，跟着守军往堤上走。',
    fx({ d: 30 }), { goto: 'c1_flood_dike' }),
  opt('去粮码头，帮宋宜把粮往城里运', '仓里的粮少泡一些',
    '宋宜把一串仓钥匙塞给你。码头上的粮袋一层层往车上码，车一辆接一辆往城里走。',
    fx({ g: 5, c: 5 }, { relation: { 宋宜: 5 } }), { goto: 'c1_flood_city' }),
  opt('撑何六的船，去南圩和芦滩接人', '人多出来一些',
    '何六已经把船推下了水。你们往南圩撑，雨打在脸上睁不开眼。',
    fx({ o: 20, p: 20 }, { relation: { 何六: 5 } }), { goto: 'c1_flood_city' }),
  opt('去芦洲旧河闸找韩彪，求他开闸分洪', '闸在黑风寨手里',
    '你借了一条小船，顺水往芦洲去。',
    {}, { goto: 'c1_flood_sluice' }),
  seer(K_JUDGE, '带兵去第三弯，赶在决口前合龙', '前世这一夜，第三弯是子时塌的',
    '你没去别处，直接找到顾淮，说第三弯撑不过今夜。顾淮看着你，把半数的兵和备好的木笼石都调了过去。\n\n子时前后，第三弯的堤脚开始冒浑水，木笼石一笼一笼沉下去，压住了。',
    fx({ d: 80, c: 20 }, { relation: { 顾淮: 10 }, rewrite: '第三弯在决口之前合了龙' }), { goto: 'c1_flood_dike' }),
]));

EV.push(link('c1_flood_dike', '堤上的夜', (state) => (wv(state, 'causeCoefficient') <= 0 && wv(state, 'dikeHealth') < 550
  ? '半夜水头到了。第三弯塌了一丈，水灌进南圩。南圩早就空了，田里只剩稻茬和锁着门的空屋，编了号的船停在高处的桩上，一条也没动。\n\n顾淮把刀解下来交给副手，要亲自带人下去堵口。'
  : wv(state, 'dikeHealth') >= 550
  ? '半夜水头到了。堤身晃了两下，草袋压住了，水在堤外打着旋往下游走。\n\n天快亮时，有人报第三弯下游又冒水了。顾淮把刀解下来交给副手，要亲自带人下去堵。'
  : '半夜水头到了。第三弯先塌了一丈，接着是两丈，水从缺口灌进南圩。堤后的草棚，一盏灯都没剩下。\n\n顾淮把刀解下来交给副手，要亲自带人下去堵口。'), [
  opt('拽住顾淮，让副手带人去', '顾淮会骂你，人能保住',
    '你拽住他的胳膊不放。顾淮骂了你一句，还是留在堤上指挥。副手带人下去，堵住了一半。',
    fx({ d: 20 }, { relation: { 顾淮: -3 } })),
  {
    label: '跟顾淮一起下水堵口', hint: '水急，看身手',
    roll: {
      p: 0.5, attrs: { 根骨: 0.01 },
      success: {
        text: '你们腰上拴着绳，把草袋一袋袋往缺口里填。一个浪打过来，你一把揪住顾淮的后领。天亮时口子堵住了。\n\n顾淮坐在泥里喘了半天，说了一句：「这条命算你的。」',
        effects: fx({ d: 60, c: 20 }, { relation: { 顾淮: 15 }, reputation: 10 }),
      },
      fail: {
        text: '一股浪把你们两人一起卷了出去。你被人用竹竿捞上来，顾淮没有。\n\n三天后在下游芦滩找到了他。守军没了主将，城里一下子乱了。',
        effects: fx({ c: -200 }, { worldFlag: { guHuaiDead: true }, hp: -40, injury: 1 }),
      },
    },
  },
]));

EV.push(link('c1_flood_city', '城里', (state) => {
  const g = wv(state, 'grainDays');
  const head = '水进了城南。逃上高处的人挤满了城北的街，祠堂、粮行、守军的营房都住了人。';
  return g >= 45 ? `${head}\n\n城北高仓开着，宋宜按户发粮，队排得很长，没有人抢。`
    : `${head}\n\n仓里的粮不多了。有人在营房外面喊，说守军藏了粮。`;
}, [
  opt('开仓给逃上高处的人发粥', '粮少几天，人心稳一些',
    '你和宋宜在城北支了六口大锅，一天两顿。粥稀，没有断过。',
    fx({ g: -5, o: 30, c: 5 }, { karma: 10 })),
  opt('守住仓门，粮先紧着守军', '兵稳住了，外面的人会骂',
    '你帮顾淮的副手守了三天仓门。守军吃上了干饭，城北街上的人看你的眼神变了。',
    fx({ c: 20, o: -30 }, { relation: { 顾淮: 3 } })),
  opt('把编了号的船都派出去接人', '船要够多',
    '编了号的船一条接一条出城，往南圩、芦滩去，傍晚回来时船舱里坐满了人。',
    fx({ o: 40, p: 20 }, { relation: { 何六: 5 } }), { require: 'world("boats") >= 30', requireHint: '船不够' }),
]));

EV.push(link('c1_flood_sluice', '旧河闸', '芦洲旧河闸在黑风寨手里。闸一开，河水从芦洲的老河道分走一股，临河这边能少涨两三尺；芦滩田、鹳滩一带就要被淹。\n\n韩彪坐在闸房门口，手边靠着一把鱼叉：「开闸？开了闸，我寨子里的粮往哪放？」', [
  opt('给他一笔钱，买他开闸', '约 50 灵石。临河少涨水，芦滩要淹',
    '韩彪数了钱，让人去绞闸。闸门一开，水往芦洲的老河道里涌。芦滩田的人还没来得及搬，骂了你半年。',
    fx({ d: 100 }, { relation: { 韩彪: 5 }, worldFlag: { luzhouFlooded: true } }), { cost: { stones: 50 } }),
  {
    label: '拿顾淮的名头压他', hint: '黑风寨不怕官，看你的胆气',
    roll: {
      p: 0.35, attrs: { 魅力: 0.01 },
      success: {
        text: '你说顾淮的兵就在下游，闸不开，水退了就来拆寨。韩彪盯着你看了半天，让人开了闸。\n\n走的时候他说，这笔账他记下了。',
        effects: fx({ d: 100, c: 5 }, { relation: { 韩彪: -10 }, worldFlag: { luzhouFlooded: true } }),
      },
      fail: {
        text: '韩彪笑了一声，让人把你扔进了河里。你抱着一根断桩漂了半里，爬上岸时天已经黑了。',
        effects: fx({}, { relation: { 韩彪: -15 }, hp: -30, injury: 1 }),
      },
    },
  },
  seer('y022.nanze_linhe_control', '答应替他向州府求一纸招安，帮他把寨粮搬上鹳滩高地', '前世大水之后，韩彪是借着运粮进的临河城',
    '前世韩彪要的是一个能上岸的名分，钱他不缺。你答应替他去顾衡那里求招安，又帮他把寨粮搬上鹳滩高地。\n\n闸开了。芦滩田的人前一天已经被你们赶上了高处。',
    fx({ d: 120 }, { relation: { 韩彪: 20 }, worldFlag: { hanBiaoPardonPromised: true }, rewrite: '黑风寨开闸分洪，韩彪得了招安的许诺' })),
]));

// ═══════════════════════════ 第十九年 · 百年判定 ═══════════════════════════

function judgementText(state) {
  const o = evaluateCentury1Outcome(state);
  const g = wv(state, 'grainDays');
  const r = wv(state, 'routeCapacity');
  const c = wv(state, 'command');
  const org = wv(state, 'organization');
  const d = wv(state, 'dikeHealth');
  const b = wv(state, 'boats');
  const rows = [
    `临河的粮，还够吃 ${g} 天；每日能运进城的粮，约 ${r} 份。`,
    `河湾堤${d >= 550 ? '撑住了' : d >= 400 ? '塌了几段' : '在第三弯决了口'}；能用的船 ${b} 条。`,
    `守军${c >= 600 ? '听号令' : c >= 450 ? '大体还听号令' : '号令不灵'}；镇上村里${org >= 650 ? '有人领头，各片有人管' : '各顾各的'}。`,
  ];
  return `第十九年开春，大水过去半年。州府把去年的账报了上来，宋宜在码头上一条条念。码头上站满了人，有的手里还提着从水里捞回来的东西。\n\n${rows.join('\n')}\n\n【${o.name}】${o.summary}`;
}

EV.push(hist(K_JUDGE, '大水之后', {
  domain: null, regions: [], window: [19, 40], major: true,
  baseline: '第十八年的大水之后，临河失守。',
}, judgementText, CENTURY1_OUTCOMES.map((o, i) => ({
  label: o.baseline ? '合上这一年的账' : `合上这一年的账（${o.name}）`,
  hint: '',
  hideIf: `!(${exclusiveCondition(i)})`,
  outcome: {
    text: o.text,
    effects: {
      worldFlag: { century1Outcome: o.id },
      flag: { [`第一百年:${o.name}`]: true },
      ...(o.id === 'disaster_eliminated' ? { reputation: 40 } : o.id === 'linhe_holds' ? { reputation: 25 } : o.id === 'orderly_evacuation' ? { reputation: 10 } : {}),
      ...(o.baseline ? {} : { rewrite: `第十八年的大水，结局成了「${o.name}」` }),
    },
  },
}))));

// ═══════════════════════════ 南泽 · 大水之后 ═══════════════════════════


EV.push(hist('y022.nanze_linhe_control', '临河控制权', {
  domain: 'nanze', regions: ['luoxia', 'qingniu'], window: [20, 24], major: true,
  baseline: '大水之后临河缺粮欠饷，守军哗变，黑风寨韩彪借运粮之名进城，州府名存实亡，临河易主。',
}, (state) => {
  const out = state.world?.flags?.century1Outcome;
  const held = out === 'linhe_holds' || out === 'disaster_eliminated';
  const head = held
    ? '大水过去两年，临河的城墙还在，州府的印也还在。可朝廷的饷还是不来，守军已经三个月没见过一个铜钱。\n\n芦洲那边，韩彪派人送来一封信：愿意出粮养兵，条件是旧河闸以下的水路归黑风寨收钱。'
    : '大水过去两年，临河城里的粮还是不够。守军欠饷半年，夜里有人砸开了东市的粮铺。\n\n芦洲的韩彪带着几十条运粮船停在码头外，说是来卖粮，船上站的都是带刀的人。';
  const gu = state.world?.flags?.guHuaiDead ? '顾淮死在大水里，守军换了三个头领，没有一个镇得住。' : '顾淮在城头站了一夜，没有下令开城门，也没有下令放箭。';
  return `${head}\n\n${gu}城里能拿刀的兵不到八百，东市的粮价一天三变。\n\n州府长官顾衡把你叫去。他的官袍下摆还沾着去年的泥：「你看这城，还守不守？」`;
}, [
  opt('守城：帮顾淮整兵，守住码头', '守军得还听号令',
    '你帮着把欠饷的兵按营点了一遍，先发了一个月的粮，再把码头的几处要口重新排了岗。韩彪的船在外面停了十天，走了。',
    fx({ c: 20 }, { relation: { 顾淮: 10 }, worldFlag: { linheHeld: true } }),
    { require: 'world("command") >= 500 && !world.flags.guHuaiDead', requireHint: '守军已经不听号令' }),
  opt('谈：放韩彪的船进城卖粮，换旧河闸以下的水路', '城里有粮，水路归了黑风寨',
    '韩彪的船进了城，粮价当天就落了。旧河闸以下的水路，从此过一条船交一份钱。\n\n州府的告示还贴着，说话算数的人换了。',
    fx({ g: 10, c: -50 }, { relation: { 韩彪: 10, 顾衡: -5 }, worldFlag: { linheShared: true } })),
  opt('撤：护着百姓往青石、平桥撤', '城丢了，人保住',
    '你和赵守的人在青石镇口接了三天人，平桥那边也接了一批。临河城里只剩下守仓的和走不动的。',
    fx({ o: 30 }, { relation: { 赵守: 5 }, worldFlag: { linheEvacuated: true } })),
  opt('兑现当年的许诺，替韩彪求一纸招安', '大水那夜你和韩彪有约',
    '你拿着韩彪开闸分洪的事去找顾衡，顾衡写了奏章，州府先行给了韩彪一个巡河的名分。黑风寨的人编进了临河守军，旧河闸归州府管。',
    fx({ c: 60, g: 5 }, { relation: { 韩彪: 10, 顾衡: 5 }, worldFlag: { linheHeld: true, heifengPardoned: true }, rewrite: '韩彪受了招安，黑风寨的人编进了临河守军' }),
    { require: 'world.flags.hanBiaoPardonPromised', requireHint: '没有和韩彪约过' }),
]));

EV.push(hist('y026.nanze_new_land_survey', '南泽新田清丈', {
  domain: 'nanze', regions: ['qingniu', 'luoxia'], window: [24, 28],
  baseline: '临河派人清丈大水后的新淤田，东田重新划界，阿衡家的三亩灵田被量走了一亩。',
}, '大水退后，河边淤出了一大片新田。临河派人下来清丈，拿着绳子和木尺一块块重新划界，要按新册收租。新册上的田亩比旧册多了一成，多出来的那一成，租子归临河。\n\n阿衡的三亩灵田挨着新淤地。丈量的人说他多占了一亩，那一亩得交出来，不交就补三年的租。阿衡蹲在田埂上，一句话也不说。\n\n赵守老了，拄着拐杖站在田头，说话已经没人听。', [
  opt('翻出当年帮赵守记的账去对', '第一年那本册子还在',
    '你翻出第一年帮赵守记的那本册子，阿衡家的田亩写得清清楚楚。丈量的人对了半天，把那一亩划了回来。',
    fx({ o: 10 }, { relation: { 阿衡: 10 } }), { require: 'flag("c1_zhao_ledger")', requireHint: '当年没有记过东田的账' }),
  opt('替阿衡出钱，按新册补交那一亩的租', '约 15 灵石',
    '你替阿衡交了三年的租。丈量的人在册子上把那一亩记在阿衡名下，另起一行写着「补租」。',
    fx({}, { relation: { 阿衡: 6 } }), { cost: { stones: 15 } }),
  opt('劝东田各户联名，要求和临河议佃约', '各户一起说话',
    '东田二十几户按了手印，推你把联名书送到临河。临河答应新淤田按旧租收三年，再议。',
    fx({ o: 20 }, { relation: { 赵守: 5 }, worldFlag: { eastFieldCompact: true } })),
]));

EV.push(hist('y030.nanze_local_assembly', '南泽地方议事', {
  domain: 'nanze', regions: ['qingniu', 'luoxia'], window: [28, 32],
  baseline: '青石、临河各镇推人议事，与州府分摊粮役，议了三回没有结果，各镇自管自的仓。',
}, '临河州府的人越来越少，许多事办不下来：堤没人修，渡口的钱各收各的，粮价一镇一个样。青石镇上商量，要推几个人出来，和临河、平桥、菱湖各镇一起议事：粮怎么摊，堤谁来修，渡口的钱怎么收。祠庙门口贴了张红纸，写着推举的日子。\n\n赵守已经过世了，祠庙里还收着他记了一辈子的账。镇上有人提你的名字。陆清也想坐那个位子，这几天往各家送了不少山货。', [
  opt('站出来做青石的议事人', '镇上人得信得过你',
    '你在祠庙里当着全镇的人应了下来。头一回议事，你把青石这些年的粮账摊在桌上，各镇的人看了半天。',
    fx({ o: 30 }, { reputation: 15, worldFlag: { qingshiAssembly: true } }),
    { require: 'reputation >= 30', requireHint: '镇上人还信不过你' }),
  opt('推陆清去，你在后面帮他算账', '商路会更通',
    '陆清坐上了位子，议事头一件就是把各镇的渡口钱统一。他每回议事前都来找你对一遍账。',
    fx({ r: 50 }, { relation: { 陆清: 10 }, worldFlag: { assemblyMerchant: true } })),
  opt('提议议事先定一笔修堤的钱', '日后修堤不用再到处求人',
    '各镇吵了两天，定下按田亩每年抽一点钱存着，专门修堤。钱放在临河，账由青石来管。',
    fx({ o: 10 }, { worldFlag: { dikeFund: true } })),
]));

EV.push(hist('y040.nanze_old_dike_damage', '南泽旧堤损伤', {
  domain: 'nanze', regions: ['luoxia'], window: [38, 42],
  baseline: '第十八年修补的堤段年久松动，河湾一带又开始渗水，州府无钱，只在最险处压了草袋。',
}, '河湾堤又开始渗水了。第十八年大水后补的那几段，土没夯实，二十年里被水一点点掏空，第三弯一带的堤脚又软了。堤脚下的獾洞一年比一年多，守堤的兵只剩六个，州府的修堤钱早挪去发饷了。\n\n顾淮的旧部如今在临河管城防，头发也白了。他带你去堤上看了一圈，蹲在第三弯，抓起一把泥：修，要一大笔钱，州府拿不出来；不修，下一个大水年就难说。', [
  opt('出钱修第三弯那一段', '约 40 灵石',
    '你雇人把第三弯的旧土挖开重夯，外面包了一层石头。修完那天下了一场雨，堤脚是干的。',
    fx({ d: 150 }, { worldFlag: { oldDikeRepaired: true } }), { cost: { stones: 40 } }),
  opt('动用议事时定下的修堤钱', '各镇存了十年的钱',
    '修堤钱存了十年，够修三段。你把账贴在码头上，各镇的人都来看过，没人说闲话。',
    fx({ d: 150, o: 10 }, { worldFlag: { oldDikeRepaired: true } }),
    { require: 'world.flags.dikeFund', requireHint: '议事时没有定修堤的钱' }),
  opt('开旧河闸，把水往芦洲老河道分', '临河省钱，芦洲的人会记恨',
    '旧河闸开了半扇，河湾那段的水压小了。芦洲的人来临河告了两回状。',
    fx({ d: 60 }, { worldFlag: { luzhouGrudge: true } })),
]));

EV.push(hist('y055.nanze_merchant_bargaining', '南泽商户议价', {
  domain: 'nanze', regions: ['qingniu', 'luoxia'], window: [53, 57],
  baseline: '钱家与几家粮行联手压价收粮、抬价卖粮，州府开不出平粜的粮，粮价三年里涨了一倍。',
}, '青石镇的钱家粮行，如今是钱三的孙子在管。他和临河东市的几家粮行约好，秋收时压价收，开春时抬价卖，一进一出，差价比他爷爷那时候还大。钱家粮行的新仓盖在城北高处，比州府的仓还大。东田有两户人家已经把田押给了钱家。\n\n东田的人秋天卖粮卖不上价，开春又买不起。临河派人来问各镇的意思：立粮价的约，开官仓平粜，还是干脆征粮。', [
  opt('撮合各家粮行立价约', '花几天说合',
    '你把几家粮行的掌柜请到一处，定下秋收的收价不低于几成、开春的卖价不高于几成。约写成三份，各镇存一份。',
    fx({ g: 5 }, { reputation: 5, worldFlag: { grainPriceCompact: true } })),
  opt('劝临河开官仓平粜', '临河得还握着官仓',
    '官仓开了半个月，粮价落了下来。钱家粮行的少掌柜来找你，脸色不好看。',
    fx({ o: 20 }, { worldFlag: { linhePublicGranary: true } }), { require: 'world.flags.linheHeld', requireHint: '临河早已没有官仓' }),
  opt('照临河的意思征粮', '粮多了，镇上会怨',
    '征粮的人挨家去了。仓里多了粮，镇上的人见了你绕着走。',
    fx({ g: 10, o: -30 }, { reputation: -5 })),
]));

EV.push(hist('y070.nanze_dike_repaired', '南泽堤成', {
  domain: 'nanze', regions: ['luoxia'], window: [68, 72],
  baseline: '临河各镇凑钱重修河湾堤，修了四年，堤成之日在堤上立了一块碑。',
}, '议了几十年的河湾堤，这一年终于凑齐了钱。各镇出人，临河出料，从第三弯一路修到南圩，用的是夯土包石，一层土一层石，夯到铁钎扎不进去为止。石料是从平桥一船船运来的，堤下堆得像小山。你当年插竹竿的那个地方，如今立着一根石桩。\n\n堤上搭了几十座工棚，青石、平桥、菱湖的人轮班上工。修堤的头领来找你：碑上要刻出过力的人和镇子，你要不要再出一份力。', [
  opt('出钱把堤一直修到芦洲那一段', '约 30 灵石',
    '多出来的那一段修了一年。芦洲的人头一回在碑上看见自己镇子的名字。',
    fx({ d: 100 }, { worldFlag: { dikeToLuzhou: true } }), { cost: { stones: 30 } }),
  opt('去堤上督工，盯紧夯土的层数', '花一个夏天',
    '你在堤上住了一个夏天，每一层土夯完都用铁钎扎一遍，扎不进去才许上下一层。',
    fx({ d: 60, o: 10 }, {})),
  opt('把第四十年补过的那段并进新堤', '当年修过的地方底子好',
    '第三弯当年包的石头还在，新堤顺着旧石接上去，省了半年工。',
    fx({ d: 120 }, {}), { require: 'world.flags.oldDikeRepaired', requireHint: '第四十年那段没有修过' }),
]));

EV.push(hist('y085.nanze_water_transport_alliance', '南泽水运同盟', {
  domain: 'nanze', regions: ['luoxia', 'qingniu'], window: [83, 87],
  baseline: '临河粮码头、菱湖渡、石拱渡的船帮结成水运同盟，统一运价，各渡口不再互相压价。',
}, '临河粮码头、菱湖渡、平桥的石拱渡，三处船帮争了几十年的货，压价、抢客、在河上撞船，结下的仇能说上三天三夜。这一年，三家坐到了一起，商量结成同盟：运价统一，船只互借，大水年一起出船。这几年河上撞沉了四条船，淹死了七个人。盟约的底稿写了三遍，每一遍都有人撕。\n\n何家渡如今是何六的后人在撑。陆家商号也派了人来，坐在桌子的另一头。', [
  opt('促成同盟，写明大水年船只互借', '运力大涨',
    '盟约写了七条，最后一条是你加的：大水年各渡的船听临河调。何家的后人第一个按了手印。',
    fx({ r: 200 }, { worldFlag: { waterAlliance: true } })),
  opt('不立盟，趁各家压价时包船运货', '你赚一笔，运力涨得少',
    '三家压价压到成本底下，你包了两个月的船，把青石的货全运了出去。',
    fx({ r: 50 }, { stones: 15 })),
  opt('交给临河官府统管运船', '临河得还握着城',
    '运船编进了州府的册子，船帮的头领拿州府的饷。',
    fx({ r: 150, c: 30 }, {}), { require: 'world.flags.linheHeld', requireHint: '临河不在州府手里' }),
]));

EV.push(hist('y096.nanze_record_dike_line', '南泽录堤线', {
  domain: 'nanze', regions: ['luoxia'], window: [94, 98],
  baseline: '临河把百年来的堤线、决口处与修补年份录成一册，存在州府，以备后人。',
}, '临河要把这一百年的堤线录成一册：哪年修的，哪里决过口，用了多少土石，谁出的钱。州府的书吏带着一箱旧文书来找你，因为你在堤上的年头比谁都长。第三弯那一段，旧文书上写了六回修补。书吏是临河人，他爷爷死在第十八年那场水里。\n\n旧文书里有一半被水泡过，字都糊了。书吏翻到第十八年那一页，抬头问你：这一年的事，你还记得多少？', [
  opt('把第三弯和第十八年的事详细录进去', '后人看得见',
    '你说了三天，录的人写了三天。第三弯那一页，你让他把堤里被掏空的样子也画了上去。',
    fx({ wc: 50 }, { worldFlag: { dikeRecordDetailed: true } })),
  opt('先把没修完的几段补上再录', '约 20 灵石',
    '你出钱把南圩那两段补了，录册上写的是修好的样子。',
    fx({ d: 80 }, {}), { cost: { stones: 20 } }),
  opt('趁录堤，把河边新淤地开成田', '多了粮，堤外少了一道缓坡',
    '新淤地开了三百亩，租子归各镇分。堤外那道缓坡没了，水直接拍在堤脚上。',
    fx({ g: 10, d: -40 }, { stones: 10 })),
]));

EV.push(hist('y100.nanze_year_end_snapshot', '南泽百年结算', {
  domain: 'nanze', regions: ['qingniu', 'luoxia'], window: [98, 100], major: true,
  baseline: '第一百年末，南泽各镇各自为政，临河只剩名义上的州府，青石镇已从镇升城。',
}, (state) => {
  const f = state.world?.flags || {};
  const o = CENTURY1_OUTCOMES.find((x) => x.id === f.century1Outcome);
  const lines = ['第一百年的冬天，青石已经筑起夯土墙，由镇升了城。河湾渡换了三代渡夫，东田的灵田还是那几块，阿衡家的后人在种。祠庙墙上当年贴征粮令的地方，如今贴着各镇议事的告示。', '临河粮码头的石阶上，宋宜当年刻的水痕还在，最高的那一道旁边刻着：第十八年。芦洲的旧河闸也还在，闸房改成了巡河的哨所。你走在街上，认得你的人已经不多了。'];
  if (o) lines.push(`第十八年那场大水，人们说起来还是那几个字：${o.name}。`);
  if (f.linheHeld) lines.push('临河的城门这些年没有换过主人。');
  else if (f.linheShared) lines.push('临河的水路，一半归了当年黑风寨的后人。');
  else if (f.linheEvacuated) lines.push('临河空过一阵，后来人又慢慢回去了。');
  if (f.waterAlliance) lines.push('三处船帮的盟约还在，大水年船只互借。');
  return lines.join('\n\n');
}, [
  opt('把这一百年的事记下来，存进青石祠庙', '后人翻得到',
    '你写了一个冬天。写到第十八年那一页，停了很久。',
    fx({}, { reputation: 10, worldFlag: { c1Recorded: true } })),
  opt('去河湾堤上走一走', '',
    '你从第三弯走到南圩。堤上的碑被雨水冲得发白，上面的名字还认得出。',
    fx({}, { attrs: { 道心: 2 } })),
]));

// ═══════════════════════════ 北境 · 雁门与朔川 ═══════════════════════════
// 本域指标：northSupply（雁门粮饷）、northCohesion（边军军心）；人物：林照、赵砚、阿史那岚。

const BJ = ['beihuang'];

EV.push(hist('y001.beijing_arrears', '北境欠饷与粮车催办', {
  domain: 'beijing', regions: BJ, window: [1, 3],
  baseline: '边军照旧催饷，转运司先保雁门粮车。',
}, '雁门关下，边军的饷已经欠了半年。统领林照每月往京里递一封催饷的文书，回来的只有一句「已知」。关下的铺子已经不肯再赊。\n\n转运司的粮车停在关外，押车的小吏说，钱只够一样：先发饷，粮就运不进关；先运粮，饷还得再欠。', [
  opt('帮林照的书吏把欠饷一营一营核清', '账清了，催饷才有底气',
    '你们核了五天，查出两营的空额吃了三个月的饷。林照把核清的账附在文书后面，一并递了上去。',
    fx({ northCohesion: 10 }, { relation: { 林照: 5 } })),
  opt('跟着粮车押运进关', '先保粮',
    '粮车走了四天进关。边军先吃上了饭，欠饷的事又往后压了一个月。',
    fx({ northSupply: 15 }, { relation: { 林照: 3 } })),
  opt('劝小吏先把饷钱发了，粮缓几天', '兵心先稳',
    '饷发了三成，兵们拿到钱，先去关下的铺子里赊了粮。关下的粮价当天涨了一截。',
    fx({ northCohesion: 15, northSupply: -10 }, {})),
]));

EV.push(hist('y003.beijing_grain_intercept', '粮道截留', {
  domain: 'beijing', regions: BJ, window: [1, 5],
  baseline: '运往雁门的粮车在朔川一带被朔部截下两成，阿史那岚换到了过冬的粮。',
}, '朔川道上，运往雁门的粮车又被拦了。拦车的是朔部的骑手，领头的是阿史那岚。骑手们把粮车围在当中，马鼻子里喷着白气。她的汉话说得很慢，一个字一个字往外吐。\n\n她没有放箭，只要两成粮做过路钱。押车的军官看着你们几个随车的人，拿不定主意。', [
  opt('劝军官给两成，换一条平安路', '粮少两成，路以后好走',
    '两成粮卸在路边。阿史那岚点了点头，带人走了。往后三个月，朔川道上没再出事。',
    fx({ northSupply: 5 }, { relation: { 阿史那岚: 8 } })),
  opt('掉头改走云中那条远路', '粮不少，晚到十天',
    '粮车绕云中走了十四天。进关时，关上的兵已经喝了十天稀粥。',
    fx({ northSupply: 10, northCohesion: -5 }, {})),
  opt('护着粮车硬闯过去', '看身手',
    '你们冲过去时折了两辆车，伤了五个人。粮大半进了关，朔部的人记下了这条道上的每一张脸。',
    fx({ northSupply: 15 }, { relation: { 阿史那岚: -10 }, hp: -20 })),
]));

EV.push(hist('y005.beijing_draw_troops', '北境抽兵', {
  domain: 'beijing', regions: BJ, window: [3, 7],
  baseline: '林照从外堡抽兵护粮，外堡空了一半，朔川的牧道无人巡守。',
}, '粮车接连出事，林照要从外堡抽一千人专门护粮。副将赵砚不肯：外堡一空，朔部的马就能直接放到关下。军帐外的雪下了一夜，帐里的炭盆烧得只剩红灰。赵砚拍了两回桌子。\n\n两人在军帐里争了半夜，林照问你这个常跑朔川道的人怎么看。', [
  opt('照林照的意思抽兵护粮', '粮道稳，外堡空',
    '一千人编成护粮营，粮车从此按期进关。外堡的烽火台空了一半。',
    fx({ northSupply: 15, northCohesion: -5 }, { relation: { 林照: 5 } })),
  opt('在关下招募乡勇护粮，外堡兵不动', '要花钱，约 20 灵石',
    '关下招了三百乡勇，你垫了头一个月的口粮钱。乡勇护粮不如兵，好在外堡没空。',
    fx({ northSupply: 10, northCohesion: 5 }, { relation: { 赵砚: 5 } }), { cost: { stones: 20 } }),
  opt('照赵砚的意思收缩防线，粮车只走近道', '少护几段路',
    '粮车只走关下五十里的近道，再往外的堡子自己想办法。',
    fx({ northCohesion: 10 }, { relation: { 赵砚: 5 } })),
]));

EV.push(hist('y008.beijing_deserters_forts', '北境逃兵与空堡', {
  domain: 'beijing', regions: BJ, window: [6, 10],
  baseline: '欠饷的边军逃散，代北几座外堡只剩老弱，赵砚收拢逃兵编成堡丁。',
}, '代北驿往北的三座外堡，兵跑了一大半。逃兵躲在山沟里，白天不敢出来，夜里下山找吃的。有个逃兵是赵砚的同乡，托人捎话回来，说只要给口饭吃，愿意回堡。林照把那张字条压在案上，三天没批。\n\n赵砚要收拢他们，林照的军法却写着逃兵当斩。', [
  opt('劝林照开恩，逃兵回堡既往不咎', '人回来，军法松了',
    '告示贴出去，十天里回来了二百多人。赵砚把他们编成堡丁，给的是半饷。',
    fx({ northCohesion: 10 }, { relation: { 赵砚: 5 }, worldFlag: { beijingAmnesty: true } })),
  opt('帮赵砚把逃兵编进外堡，按军法记过', '人回来，规矩还在',
    '回来的人都挨了二十军棍，编进最远的堡子。没人再跑，也没人说话。',
    fx({ northCohesion: 5, northSupply: 5 }, {})),
  opt('把空堡里的老弱撤回关内', '少守几座堡',
    '三座外堡只留烽火，老弱撤进了雁门。代北驿以北，从此是朔部的马道。',
    fx({ northSupply: 10, northCohesion: -5 }, {})),
]));

EV.push(hist('y012.beijing_lin_zhao_reinforcement', '林照增援北境', {
  domain: 'beijing', regions: BJ, window: [10, 14], major: true,
  baseline: '林照率主力增援北境外线，第十四年在朔川道上遇伏身亡，赵砚接掌边军。',
}, '外线的堡子被围，林照要亲率主力出关增援，走朔川道。赵砚劝他分兵两路，他没听。关下的百姓夹道送行，有人往兵手里塞干饼。\n\n出关前一天，林照在关楼上点名，点到你们这些随军的民夫时停了一下：「明天谁认得朔川的路，跟在前头。」', [
  opt('跟在前头带路', '朔川道上有伏兵',
    '你走在最前面，过第二道山口时看见崖上有马粪。你喊了一声，前军停了下来，伏兵提前放了箭。林照带人从侧坡绕了上去。\n\n这一仗打得狼狈，林照肩上中了一箭，人活着回了关。',
    fx({ northCohesion: 15 }, { relation: { 林照: 10 }, hp: -20, worldFlag: { linZhaoAlive: true }, rewrite: '林照在朔川道上中伏，活着回了雁门' }),
    { require: 'world.flags.linZhaoWarned || rel("林照") >= 15', requireHint: '林照不认得你' }),
  opt('劝林照分兵两路走', '主力少一半，伏兵也只能打一路',
    '林照想了一夜，分给赵砚一半人马走云中。朔川道上照样有伏，林照带的人少，死了三成，他自己被抬了回来，半年下不了床。赵砚那一路解了围。',
    fx({ northCohesion: 5, northSupply: 5 }, { relation: { 赵砚: 8 }, worldFlag: { linZhaoAlive: true } })),
  opt('留在关上运粮', '不去前线',
    '你留在关上运粮。半个月后，前军的人回来了一半，抬着林照的盔甲。赵砚接了印。',
    fx({ northSupply: 10 }, { worldFlag: { linZhaoDead: true } })),
]));

EV.push(hist('y015.beijing_grain_route_cut', '北境粮道断绝', {
  domain: 'beijing', regions: BJ, window: [13, 17],
  baseline: '北境粮道断绝，赵砚收缩防线，只保雁门关城。',
}, '南边来的粮船停在半路，北境的粮道断了。关里的存粮只够两个月，马料只够一个月，伙房已经开始往粥里掺麸皮。\n\n赵砚召集军官在关楼上议事，桌上摊着一张粮道图，断的那一段用墨涂黑了：缩防线，再派人去接一回粮，还是就地征粮。', [
  opt('缩防线，只守关城', '少吃一半粮',
    '外堡的兵全数撤回关城。关上的粮够撑四个月，关外的事管不了了。',
    fx({ northSupply: 10, northCohesion: -5 }, {})),
  opt('带一队人去接下一批粮车', '北境存粮够才敢去',
    '你们在朔川道上等了九天，接到了粮车，一路护进关。路上折了两个人。',
    fx({ northSupply: 20 }, { relation: { 赵砚: 5 } }), { require: 'world("northSupply") >= 20', requireHint: '关上的粮撑不到接粮的人回来' }),
  opt('就地向关下各村征粮', '粮有了，关下的人恨边军',
    '征粮的兵挨村去，关下的村子关了门。粮收上来一些，有两个村子的人连夜往南逃了。',
    fx({ northSupply: 15, northCohesion: -10 }, {})),
]));

EV.push(hist('y018.beijing_yanmen_hunger', '雁门饥荒', {
  domain: 'beijing', regions: BJ, window: [16, 20],
  baseline: '雁门关缺粮，守军每日一餐，外堡的人陆续逃回关内。',
}, '雁门关里每日只开一顿饭。马杀了一半，皮子煮了熬汤。关下的百姓拖家带口往关里挤，说外面更没吃的。城墙根下支着十几口锅，锅里煮的是草根和马骨。赵砚自己也一天一顿，脸瘦得颧骨都出来了。\n\n赵砚问你：中州那边还有没有路能要到粮？', [
  opt('帮赵砚定口粮，按人头分', '人人吃不饱，也饿不死',
    '你们按兵、民、老幼分了三等口粮，签子发到每个人手里。关里没有饿死人，也没有人有力气干活。',
    fx({ northCohesion: 10 }, {})),
  opt('替赵砚带信去宁京求粮', '路远',
    '你走了一个多月到宁京，在户部门外等了九天。批下来的粮只有求的三成，运到关上又过了两个月。',
    fx({ northSupply: 10 }, { relation: { 赵砚: 5 } })),
  opt('劝赵砚弃守外堡，把人全收进关', '少守地方，少吃粮',
    '最后两座外堡也撤了。关上的人更多，口粮更紧，外面却不用再派兵送粮。',
    fx({ northSupply: 5, northCohesion: -5 }, { worldFlag: { outerFortsEarlyAbandoned: true } })),
]));

EV.push(hist('y022.beijing_outer_forts_abandoned', '北境外堡弃守', {
  domain: 'beijing', regions: BJ, window: [20, 24], major: true,
  baseline: '赵砚下令弃守代北外堡，主力退入雁门，堡民随军内迁。',
}, '代北的外堡守了三年，粮断了两回。赵砚终于下令弃守：主力退回雁门，堡民跟着走。堡墙是他们的祖辈一锹一锹夯起来的，堡里的井还有水。赵砚给了三天，三天后不走的，边军不再管。\n\n堡里有几十户人家不肯走，他们的地在堡外，祖坟也在。', [
  opt('照令弃堡，护着堡民内迁', '主力保住',
    '你押着最后一批堡民进关。回头看时，代北驿的烽火台已经没有烟了。',
    fx({ northCohesion: 5 }, { relation: { 赵砚: 5 } })),
  opt('留下来帮不肯走的人守堡', '要有粮才守得住',
    '你和几十户人家守着一座堡过了一个冬天。朔部的人来看过两回，没有动手。',
    fx({ northCohesion: 10 }, { relation: { 阿史那岚: 5 } }), { require: 'world("northSupply") >= 30', requireHint: '堡里的粮撑不过冬' }),
  opt('先把堡里的妇孺送走，壮丁随军', '人分两路',
    '妇孺先走，壮丁编进边军。堡空了，人没散。',
    fx({ northCohesion: 5, northSupply: 5 }, {})),
]));

EV.push(hist('y026.beijing_frontier_localizes', '北境边务本地化', {
  domain: 'beijing', regions: BJ, window: [24, 28],
  baseline: '边军不再等京里的饷，就地屯田抽税，雁门的事由赵砚自决。',
}, '京里的饷两年没来了，关上的兵有一半在关下给人打短工。赵砚召集各营军官，要在关下屯田、抽商税，养兵不再靠京里。关下的田荒了一大片，是早年逃难的人丢下的。\n\n京里派来的监军坐在一旁，脸色发青。他说这是自立，要上奏，奏章已经写了一半。', [
  opt('帮赵砚定屯田抽税的章程', '边军自己养自己',
    '章程定了十二条，田按营分，商税按货抽。头一年秋收，边军吃上了自己种的粮。',
    fx({ northSupply: 15 }, { relation: { 赵砚: 8 }, worldFlag: { frontierLocalized: true } })),
  opt('替监军送奏章回京，求京里补饷', '走京里的路',
    '奏章送到了，京里回了一道嘉奖，饷还是没有。',
    fx({ northCohesion: -5 }, { relation: { 赵砚: -5 } })),
  opt('劝赵砚先不声张，屯田照做，名义上仍等京饷', '两头不得罪',
    '屯田的事做了，奏章上只写「试垦」。监军睁一只眼闭一只眼。',
    fx({ northSupply: 10 }, { relation: { 赵砚: 3 } })),
]));

EV.push(hist('y030.beijing_fort_joint_governance', '北境堡垒共治', {
  domain: 'beijing', regions: BJ, window: [28, 32],
  baseline: '各堡寨与边军合议，粮役兵役按堡分摊，号令出自堡主与赵砚。',
}, '关下新起的堡寨有二十多座，大的几百户，小的几十户，都有自己的堡主和堡丁。堡主们来雁门议事：粮役、兵役怎么摊，打起仗来谁说了算。有个堡主带来了自家的账本，一页页翻给赵砚看。\n\n赵砚想把号令收在关上，堡主们想各管各的堡，两边在关楼上吵到半夜。', [
  opt('撮合堡主与边军合议共治', '号令慢一些，人心齐一些',
    '议了七天，定下大事合议、小事各堡自决。堡主们按了手印。',
    fx({ northCohesion: 10 }, { worldFlag: { fortCouncil: true } })),
  opt('帮赵砚把号令收归关上', '号令快，堡主不服',
    '号令收上来了，有三个堡主当夜带人走了。',
    fx({ northSupply: 5, northCohesion: -5 }, { relation: { 赵砚: 5 } })),
  opt('劝赵砚放手，各堡自管', '关上省事',
    '各堡自己收粮、自己练丁。关上的兵少了一半，事也少了一半。',
    fx({ northCohesion: 5, northSupply: -5 }, {})),
]));

EV.push(hist('y040.beijing_defense_shrinks', '北境防线收缩', {
  domain: 'beijing', regions: BJ, window: [38, 42],
  baseline: '北境防线再缩，云中以北让给了朔部的牧道。',
}, '云中以北的烽火台一座座熄了。边军的人越来越少，一座烽台原该五个人，如今只剩两个，冬天轮不过来班，守不住那么长的线。烽台上的柴草湿了一半，点起来只冒白烟。\n\n军官们在关楼上商量：是再缩一次防线，还是派人去找一条新的粮路。', [
  opt('缩到云中，以北让给朔部放牧', '守得住的地方才守',
    '云中以北立了界石。朔部的人在界石那边放马，不再过来。',
    fx({ northCohesion: 5 }, { relation: { 阿史那岚: 5 } })),
  opt('派人去探一条新的粮路', '花两个月',
    '你带人往东走了两个月，找到一条沿河的老路。路远，好在没有伏兵。',
    fx({ northSupply: 10 }, {})),
  opt('劝军官们死守所有烽台', '兵力摊薄',
    '烽台都还亮着，每台只剩三个人。一个冬天冻死了十几个。',
    fx({ northCohesion: -5 }, {})),
]));

EV.push(hist('y055.beijing_border_town_autonomy', '北境边镇自治', {
  domain: 'beijing', regions: BJ, window: [53, 57],
  baseline: '雁门、云中各自立约自治，朝廷只派一名监军，名义上领边。',
}, '雁门、云中的堡主和军官要立一个约：边镇自治，粮兵自管，朝廷只派监军。约已经写好了，就差监军署名。\n\n京里的监军是新来的，拿不定主意，来问关上的老人们。老人们说，京里的饷几十年没来过，这个约签不签，关下都是这样过。', [
  opt('劝监军认下自治之约', '边镇安稳',
    '约立了，监军在约尾署了名。京里过了半年才知道。',
    fx({ northCohesion: 10 }, { worldFlag: { borderAutonomy: true } })),
  opt('提议边镇与朝廷共治', '两边都要让一步',
    '约里加了一条：大事报京。京里回文说可。',
    fx({ northCohesion: 5, northSupply: 5 }, {})),
  opt('替监军上奏，请京里收回边权', '京里没有兵来收',
    '奏章送上去，京里派了一个新监军来。新监军到关上住了一个月，回去了。',
    fx({ northCohesion: -5 }, {})),
]));

EV.push(hist('y070.beijing_veterans_decline', '北境老兵凋零', {
  domain: 'beijing', regions: BJ, window: [68, 72],
  baseline: '跟过林照、赵砚的老兵大多故去，边军靠堡丁子弟补员。',
}, '跟过林照、赵砚的老兵，活着的不到百人了。他们大多在关下的堡子里养老，有的瞎了一只眼，有的少了一条腿。关上的新兵大多是堡丁的子弟，没见过真仗。\n\n军官们想给老兵发养老的粮，请他们带一带新兵，又怕关上的粮不够分。', [
  opt('给老兵发养老粮，请他们带新兵', '粮少一些，新兵有人教',
    '老兵们在校场上教了三年。新兵学会了在朔川道上怎么看马粪。',
    fx({ northCohesion: 10, northSupply: -5 }, {})),
  opt('从堡丁里挑人顶上老兵的位子', '省粮',
    '新人顶了位子，关上的规矩换了一半。',
    fx({ northSupply: 5 }, {})),
  opt('裁撤一部分守军，省下的粮养老兵', '兵少了',
    '裁了五百人。老兵们吃上了饱饭，关上的岗少了一半。',
    fx({ northCohesion: 5, northSupply: 5 }, {})),
]));

EV.push(hist('y085.beijing_new_officers', '北境新军官', {
  domain: 'beijing', regions: BJ, window: [83, 87],
  baseline: '新一代军官接掌雁门，按堡寨推举，不再由京里任命。',
}, '雁门的老军官们要退了。接任的人是各堡推举的年轻人，京里没有派人来。新军官们最大的不过三十岁，最小的才二十出头，站在关楼上，腰杆挺得笔直。老军官们看着他们，想起自己年轻时跟着林照出关的样子。\n\n退下来的老军官问你，该不该把关上的旧账交给这些年轻人。', [
  opt('劝老军官把旧账和规矩一并交出去', '新人接得稳',
    '旧账装了三口箱子。新军官们看了一个月，把粮道和烽台的章程重新抄了一遍。',
    fx({ northCohesion: 10 }, {})),
  opt('劝老军官留几个人在关上看着', '新老交替慢一些',
    '三个老军官留在关上做参谋，事情慢了，没出错。',
    fx({ northCohesion: 5, northSupply: 5 }, {})),
]));

EV.push(hist('y096.beijing_record_border', '北境录边', {
  domain: 'beijing', regions: BJ, window: [94, 98],
  baseline: '雁门将百年来的边线、堡寨与互市之约录成一册。',
}, '雁门要把这一百年的边线、堡寨、与朔部的互市之约录成一册。录的人从各堡收来旧文书，堆了半间屋子，有的写在羊皮上，有的写在木牍上，还有几张是朔部的文字。最老的一张木牍，是林照那一年写的粮单。\n\n录的人找到你，问你朔川道上的旧事还记得多少。', [
  opt('把朔川道上的旧事一并录进去', '后人知道这条路上死过多少人',
    '你把记得的几仗、几次截粮、几回议和都说了。录册多了十几页。',
    fx({ northCohesion: 5 }, { worldFlag: { borderRecordDetailed: true } })),
  opt('劝雁门趁录边之机，与朔部重议互市', '花一个夏天',
    '朔部派人来了，互市的约改了三条，马价落了一成。',
    fx({ northSupply: 10 }, { relation: { 阿史那岚: 5 } })),
]));

EV.push(hist('y100.beijing_year_end_snapshot', '北境百年结算', {
  domain: 'beijing', regions: BJ, window: [98, 100],
  baseline: '第一百年末，北境由边镇与朔部分治，雁门关仍在，京里的号令只到关下。',
}, (state) => {
  const f = state.world?.flags || {};
  const lines = ['第一百年的冬天，雁门关上的旗还在。关下的堡寨各有各的主，朔部的马在界石那边吃草。互市的日子，关下比过年还热闹。京里的监军换了十几任，没有一个待满三年。关下的孩子已经不知道朔川道上死过人。'];
  if (f.linZhaoAlive) lines.push('关楼里挂着林照的盔甲，肩上那个箭孔还在。');
  else lines.push('关楼里供着林照的牌位，是赵砚当年立的。');
  return lines.join('\n\n');
}, [
  opt('把关上的实情写成一封信，送回南边', '',
    '信写了三页，最后一页写的是关下的粮价。',
    fx({ northCohesion: 5 }, { reputation: 5 })),
  opt('在关上住一冬，看完这一年', '',
    '你在关上过了一个冬天，跟守关的人一起扫雪。',
    fx({}, { attrs: { 道心: 2 } })),
]));

EV.push(hist('intervention.yanmen_grain_route', '雁门粮道', {
  domain: 'beijing', regions: BJ, window: [1, 9],
  baseline: '雁门军粮迟了两月，押粮车在朔川接连遇伏，林照的信没有回音。',
}, '雁门关的军粮已经迟了两个月。押粮的车队在朔川一带接连遇伏。关下的粮价已经涨到了平日的三倍。林照的第四封信，墨迹还没干。\n\n守关的林照写了三封信催粮，没有一封有回音。\n\n如果关上断粮，北境要往回缩，缩到哪里，谁也说不准。', [
  // 原典 indicatorEffects：临河本地指标按一成计入，其余照原值（见文件头）
  opt('替林照把信送到该送的人手里', '约 2 灵石干粮渡钱，奔走一日',
    '你揣着三封信跑了一天，交到转运司主事的手里。主事看完，当晚调了一批粮车。',
    fx({ wc: 30, c: 1, p: 10, northSupply: 10 }, { relation: { 林照: 8 } }), { cost: { stones: 2 }, goto: 'c1_iv_yanmen_2' }),
  opt('跟着粮车走一趟，护它进关', '约 3 灵石干粮，五日',
    '你跟着粮车走了五天，夜里轮班守车。粮进了关，一袋没少。',
    fx({ r: 6, g: 1, c: 2, northSupply: 20 }, { relation: { 林照: 8 } }), { cost: { stones: 3 }, goto: 'c1_iv_yanmen_2' }),
  opt('帮关上修补兵器', '约 25 灵石铁料炭火，两日',
    '关上的刀枪锈了一半。你买了铁料，跟军匠一起修了两天，修好了三百多件。',
    fx({ c: 2, r: 2, p: 5, northCohesion: 20 }, {}), { cost: { stones: 25 }, goto: 'c1_iv_yanmen_2' }),
]));

EV.push(link('c1_iv_yanmen_2', '朔川道', '朔川道上的伏兵不知道藏在哪里。朔部的骑手、逃散的边兵、过路的马贼，谁都有可能。\n\n林照的粮车三天后又要上路。', [
  opt('去朔川一带探路三日', '约 4 灵石干粮马料',
    '你在朔川的山沟里转了三天，找到两处有人扎过营的地方，画了图交给林照。下一批粮车绕开了这两处。',
    fx({ c: 4, r: 12, wc: 40, p: 20, west: 40, northSupply: 20 }, { relation: { 林照: 10 } }), { cost: { stones: 4 } }),
  opt('回关上', '',
    '你回了关上。三天后粮车照常上路。',
    {}),
  seer('y012.beijing_lin_zhao_reinforcement', '把前世林照遇伏的山口画给他', '前世第十四年，林照死在朔川道第二道山口',
    '你画的是第二道山口，崖上的那片背风坡。林照看了很久，问你从哪里听来的。你说是朔部的人说漏了嘴。\n\n他把图折好放进怀里，后来每一回出关，都先派人去那片坡上看一眼。',
    fx({ c: 4, r: 12, wc: 60, p: 20, west: 40, northSupply: 30, northCohesion: 20 }, { relation: { 林照: 15 }, worldFlag: { linZhaoWarned: true }, rewrite: '林照知道了朔川道上的伏兵所在' }), { cost: { stones: 4 } }),
]));

// ═══════════════════════════ 东岭 · 青崖、铜谷、玄衡 ═══════════════════════════
// 本域指标：donglingOrder（矿约与宗门法度）、qingyaWater（青崖药田水源）；人物：清虚、石泉、秦铸。

const DL = ['yaosen', 'guixu'];
const DL_VALLEY = ['yaosen'];

EV.push(hist('y001.dongling_mine_expansion', '东岭矿脉扩采', {
  domain: 'dongling', regions: DL, window: [1, 3],
  baseline: '玄衡宗与铜谷矿户按旧约扩采，铁料订单随之增加。',
}, '朝廷向东岭借钱补北境的军饷，抵押的是铁料。玄衡宗的执事下山，跟铜谷的矿户说要扩采三成。矿道口每天抬出来的矿石，比去年多了一半。秦铸在炉坊门口叹气。\n\n炉坊主秦铸接了一张军单，三千斤铁，限半年。矿道里的支木已经两年没换了。', [
  opt('劝矿户扩采前先换支木', '慢一个月，矿道稳',
    '支木换了一个月，扩采晚了。秦铸的军单延了期，没出塌方。',
    fx({ donglingOrder: 10 }, { relation: { 秦铸: 3 } })),
  opt('帮秦铸接下军单，照期交铁', '秦铸赚钱，矿工更累',
    '铁按期交了。秦铸分给你一份工钱，矿上有两个人被落石砸伤。',
    fx({ donglingOrder: -5 }, { relation: { 秦铸: 5 }, stones: 8 })),
  opt('劝清虚的执事少采一成，留着矿脉', '宗门少收钱',
    '执事听了，扩采只扩两成。宗门的账上少了一笔，矿脉多撑几年。',
    fx({ donglingOrder: 5, qingyaWater: 5 }, { relation: { 清虚: 3 } })),
]));

EV.push(hist('y003.dongling_mining_for_grain', '东岭以矿换粮', {
  domain: 'dongling', regions: ['guixu'], window: [1, 5],
  baseline: '清虚把一段矿权卖给铜谷商户换粮，补上了护脉大阵的缺口。',
}, '玄衡宗的护脉大阵缺了一角，要钱补，宗门的粮也不够过冬。主事清虚想把一段矿权卖给铜谷的商户，换粮换钱。宗门的粮仓只剩半仓，弟子们一天两顿稀饭。清虚在山门前站了一个早上。\n\n宗里有人反对：矿权一卖，往后宗门说话就不硬了。', [
  opt('劝清虚卖一段矿权换粮', '宗门过冬，矿权分出去',
    '矿权卖了一段，换回两千石粮。护脉大阵补上了。',
    fx({ donglingOrder: -5 }, { relation: { 清虚: 5 }, worldFlag: { xuanhengSoldRight: true } })),
  opt('劝清虚不卖，宗门节用过冬', '矿权保住，日子紧',
    '宗门停了半年的授徒，省下的粮勉强过了冬。',
    fx({ donglingOrder: 10 }, {})),
  opt('劝清虚与商户合股，矿权共持', '各占一份',
    '矿权分成四股，宗门占三股。商户出粮，宗门出人。',
    fx({ donglingOrder: 5 }, { relation: { 清虚: 3, 秦铸: 3 } })),
]));

EV.push(hist('y005.dongling_herb_water_dispute', '东岭药田争水', {
  domain: 'dongling', regions: DL_VALLEY, window: [3, 7],
  baseline: '矿水漫进青崖药田，石泉与矿户争水，药田减收三成。',
}, '铜谷的矿水顺着七十二涧流下来，青崖的药田发了黄。药农的头领石泉带人去矿上理论，被矿户推了出来。药田边的溪水泛着铁锈色，药苗的叶子卷了边。石泉的手上缠着布，是被矿户推倒时擦破的。\n\n两边的人都拿着锄头，站在石泉驿外的溪边。', [
  opt('提议按时辰分水：白天给药田，夜里给矿上', '两边都让一步',
    '分水的时辰刻在溪边的石头上。矿户夜里干活多点灯，药田白天能浇上清水。',
    fx({ qingyaWater: 15, donglingOrder: 5 }, { relation: { 石泉: 5 } })),
  opt('出钱从别处买水给药田', '约 15 灵石',
    '你雇人从石泉驿上游挑了半个月的水。药田缓过来一半。',
    fx({ qingyaWater: 10 }, { relation: { 石泉: 8 } }), { cost: { stones: 15 } }),
  opt('劝石泉少种两成药田', '省水，药农少收',
    '药田少了两成，剩下的浇得上水。石泉一整天没跟你说话。',
    fx({ qingyaWater: 5 }, { relation: { 石泉: -3 } })),
]));

EV.push(hist('y008.dongling_private_mines', '东岭私矿', {
  domain: 'dongling', regions: DL, window: [6, 10],
  baseline: '铜谷私矿遍地，玄衡宗的矿税收不上来。',
}, '铜谷的山上多了几十个私挖的矿洞，不交矿税，不报宗门。秦铸的炉坊也在收私矿的铁，价钱便宜一半。私矿的洞口用树枝遮着，走近了才看得见。洞里的人一天挣的钱，比明矿多一倍。\n\n玄衡宗的执事要封洞，私矿的矿工说封了洞就没饭吃。', [
  opt('帮执事封洞，按宗门的法度办', '矿税收上来，矿工没了活路',
    '封了二十三个洞。宗门的矿税收上来了，山下多了一群没饭吃的人。',
    fx({ donglingOrder: 15 }, { relation: { 清虚: 5 } })),
  opt('劝执事给私矿发照，按洞收税', '私矿变成明矿',
    '私矿领了照，按洞交钱。矿洞没少，账上多了一笔。',
    fx({ donglingOrder: 10 }, { relation: { 秦铸: 3 } })),
  opt('劝秦铸不收私矿的铁，与宗门分利', '秦铸少赚',
    '秦铸停了私铁，宗门许他多领一成官铁。',
    fx({ donglingOrder: 5 }, { relation: { 秦铸: 5, 清虚: 3 } })),
]));

EV.push(hist('y012.dongling_xuanheng_enforcement', '玄衡宗执法', {
  domain: 'dongling', regions: DL, window: [10, 14],
  baseline: '玄衡宗下山执法，封了七处私矿，矿户与宗门结下怨。',
}, '玄衡宗派了一队执法弟子下山，按旧约封矿、收税、拿人。铜谷的矿户聚在矿道口，青崖的药农在一旁看着。执法弟子穿着青灰色的道袍，腰间挂着宗门的木牌。矿户们手里拿的是镐和铁钎。\n\n清虚让人带话：谁挡着，就按宗门的法办。', [
  opt('帮执法弟子照约办事', '法度立住',
    '七处私矿封了，三个领头的被押上山。矿道口散了，矿户们没走远。',
    fx({ donglingOrder: 15 }, { relation: { 清虚: 5 } })),
  opt('居中说合，矿水与矿税一起谈', '慢，两边都留一口气',
    '你在石泉驿摆了一桌，请执事、矿户、药农坐下。谈了三天，矿税减了一成，矿水改道。',
    fx({ donglingOrder: 10, qingyaWater: 10 }, { relation: { 石泉: 5 } })),
  opt('帮矿户顶住执法弟子', '宗门记下你的名字',
    '执法弟子退了回去。山上传话下来，铜谷的事宗门不再管，矿税照收。',
    fx({ donglingOrder: -10 }, { relation: { 清虚: -10, 秦铸: 5 } })),
]));

EV.push(hist('y015.dongling_qingya_alliance', '青崖盟约', {
  domain: 'dongling', regions: DL_VALLEY, window: [13, 17],
  baseline: '石泉联合青崖各村结盟护水，与玄衡宗订下分时用水之约。',
}, '石泉要把青崖各村拢到一起结盟，护住七十二涧的溪水。十二个村子的头人都来了石泉驿，有的带着锄头，有的带着族谱。\n\n玄衡宗派人传话：溪水在宗门的地界上，结盟是对着宗门来的。石泉请你去做个见证，你是外乡人，两边都说得上话。', [
  opt('做见证，促成青崖结盟', '药农有了自己的约',
    '十二个村子的人在溪边按了手印。盟约第一条：溪水先供药田。',
    fx({ qingyaWater: 15 }, { relation: { 石泉: 8 }, worldFlag: { qingyaAlliance: true } })),
  opt('劝石泉先和宗门谈，不急着结盟', '少一场冲突',
    '石泉去了玄衡宗三趟，谈下分时用水。盟约的事放了下来。',
    fx({ qingyaWater: 5, donglingOrder: 5 }, {})),
  opt('劝几个村子去抢上游的水口', '水先抢到手',
    '药农们夜里去堵了矿上的水口。第二天，执法弟子下了山。',
    fx({ qingyaWater: 10, donglingOrder: -10 }, { relation: { 清虚: -5 } })),
]));

EV.push(hist('y018.dongling_furnace_stop', '东岭炉火停歇', {
  domain: 'dongling', regions: DL_VALLEY, window: [16, 20], major: true,
  baseline: '煤价飞涨，秦铸的炉坊停了军单，改做农具，半数炉火熄灭。',
}, '这一年煤价翻了两番。秦铸的炉坊烧不起，军单交不上，七座炉子灭了四座，炉膛里的灰都凉了。铜谷的街上，一下子多了许多闲人。\n\n炉坊的匠人蹲在门口，有的已经在收拾铺盖。秦铸在账房里坐了一夜，天亮时出来，等着有人给他出个主意。', [
  opt('出钱帮秦铸买一冬的煤', '约 30 灵石',
    '煤运来了，炉子重新点上。军单晚了一个月，交上了。',
    fx({ donglingOrder: 5 }, { relation: { 秦铸: 10 } }), { cost: { stones: 30 } }),
  opt('劝秦铸改做农具，卖给青崖和南边', '炉火小，饭碗保住',
    '炉坊改打锄头、镰刀、犁铧，一半卖去青崖，一半顺水卖到南泽。',
    fx({ qingyaWater: 5 }, { relation: { 秦铸: 5 }, worldFlag: { qinZhuCivilTools: true } })),
  opt('照原样停炉，等煤价落', '匠人散一半',
    '炉坊停了。匠人走了一半，去了外地。',
    fx({ donglingOrder: -5 }, {})),
  opt('照当年囤下的煤开炉', '你曾劝秦铸囤过煤',
    '秦铸的仓里还有一冬的煤。别家的炉都灭了，铜谷只有他这里冒烟，军单和民单都接了。',
    fx({ donglingOrder: 10 }, { relation: { 秦铸: 10 }, stones: 15, rewrite: '铜谷炉坊在煤价飞涨时没有停火' }),
    { require: 'world.flags.qinZhuCoal', requireHint: '炉坊没有囤煤' }),
]));

EV.push(hist('y022.dongling_miners_resist', '东岭矿户抗命', {
  domain: 'dongling', regions: DL, window: [20, 24],
  baseline: '铜谷矿户抗缴矿税，与玄衡宗执事在矿道口对峙。',
}, '铜谷的矿户不交矿税了。他们说煤贵、铁贱，上个月洞里塌方压死了三个人，宗门一文抚恤没出。矿道口支起了草棚，矿户的女人们轮流送饭。\n\n玄衡宗的执事带人堵在矿道口，矿户们坐在地上不起来。两边对着坐了三天，谁也不肯先走。', [
  opt('居中谈矿税，按年景定数', '两边都要让',
    '矿税改成按年景定，好年多交，坏年少交。矿户站起来回了洞。',
    fx({ donglingOrder: 10 }, { relation: { 秦铸: 3 } })),
  opt('帮执事照旧收税', '法度在，人心不在',
    '税收上来了，有两个洞的人连夜走了。',
    fx({ donglingOrder: 5 }, { relation: { 清虚: 3 } })),
  opt('劝宗门让出一成矿利给矿户', '宗门少收',
    '宗门让了一成。矿户们把那一成凑起来，修了一条新的排水道。',
    fx({ donglingOrder: 10, qingyaWater: 5 }, {})),
]));

EV.push(hist('y026.dongling_xuanheng_takeover', '玄衡宗接管', {
  domain: 'dongling', regions: DL, window: [24, 28],
  baseline: '玄衡宗接管铜谷矿道与水渠，东岭的事由宗门说了算。',
}, '朝廷的税吏好几年不来东岭了。玄衡宗在铜谷、青崖、石泉驿各贴了一张告示：铜谷矿道、七十二涧水渠，从今归宗门统管，矿税水钱都交到山上。\n\n石泉拿着告示来找你。青崖的药田靠的就是那几条渠，他问你，青崖该怎么办。', [
  opt('劝青崖认下宗门统管，换宗门护水', '少些麻烦',
    '青崖认了。宗门派人修了水渠，药田的水比往年足。',
    fx({ donglingOrder: 10, qingyaWater: 5 }, {})),
  opt('劝青崖与宗门分管，水归青崖，矿归宗门', '要先有青崖盟约',
    '盟约的十二个村子一起去了玄衡宗。谈了半个月，水归青崖，矿归宗门。',
    fx({ qingyaWater: 15 }, { relation: { 石泉: 5 } }), { require: 'world.flags.qingyaAlliance', requireHint: '青崖没有结过盟' }),
  opt('帮青崖拒不认账', '宗门会断水',
    '宗门断了青崖的水渠三个月。药田旱死了一半。',
    fx({ qingyaWater: -10, donglingOrder: -5 }, {})),
]));

EV.push(hist('y030.dongling_sect_co_management', '东岭宗门共管', {
  domain: 'dongling', regions: DL, window: [28, 32],
  baseline: '玄衡宗与青崖、铜谷共管矿水，立下分利之约。',
}, '玄衡宗管了几年，发现一家管不过来：矿上要人，渠上要人，账也对不上。清虚请青崖、铜谷的人上山，在宗门的议事堂里坐了一圈，商量共管矿水。议事堂外的松树下，三家的随从各站一边。\n\n青崖的人想多要水，铜谷的人想多要矿，宗门想两样都握在手里。', [
  opt('促成三家共管，按约分利', '各有一份',
    '分利之约写在玄衡宗的石壁上。三家各派一人管账。',
    fx({ donglingOrder: 15 }, { worldFlag: { donglingCoManaged: true } })),
  opt('劝宗门独管，青崖铜谷只出人', '号令快',
    '宗门独管。青崖和铜谷的人出工拿钱，不管账。',
    fx({ donglingOrder: 5 }, { relation: { 清虚: 5 } })),
]));

EV.push(hist('y040.dongling_herb_recovery', '东岭药田复苏', {
  domain: 'dongling', regions: DL_VALLEY, window: [38, 42],
  baseline: '矿水治住后，青崖药田慢慢复苏，石泉一带重新种满了药。',
}, '矿水治住了十年，青崖的药田慢慢缓了过来，溪边又能看见采药的人。石泉老了，腿脚不便，把药田交给了几个徒弟。溪水边新搭了几座晒药的竹架。\n\n徒弟们年轻，看着溪水足、药价好，想趁这几年多开田，来问你这个当年见过盟约的人。', [
  opt('劝他们先修灌渠，再开田', '稳',
    '灌渠修了两年，新田开了一百亩，浇得上水。',
    fx({ qingyaWater: 10 }, {})),
  opt('帮他们趁年景好多开田', '水会不够',
    '一下开了三百亩，头两年收成很好，第三年溪水跟不上了。',
    fx({ qingyaWater: -5 }, { stones: 10 })),
  opt('劝他们轮休一半药田', '地养一养',
    '药田一半种、一半歇。药少了一些，药性好了。',
    fx({ qingyaWater: 5, donglingOrder: 5 }, {})),
]));

EV.push(hist('y055.dongling_merchants_control_mines', '东岭商户控矿', {
  domain: 'dongling', regions: DL, window: [53, 57],
  baseline: '铜谷商户凑钱买下大半矿权，玄衡宗只收定额矿税。',
}, '铜谷的商户凑了一大笔钱，要从玄衡宗手里买下大半矿权。宗门这几年修阵、养徒，库里缺钱，议事堂里有一半的人动了心。商户们的钱装了十几口箱子，抬上山时走了一整天。\n\n矿户们听说了，担心换了东家矿税更重，托人来问你的意思。', [
  opt('劝宗门卖，只收定额矿税', '宗门有钱，矿归商户',
    '矿权过了手。宗门每年收一笔定额，不再管矿上的事。',
    fx({ donglingOrder: -5 }, { worldFlag: { merchantMines: true } })),
  opt('劝宗门留着矿权', '宗门手里有东西',
    '宗门没卖。商户们转头去西边买矿去了。',
    fx({ donglingOrder: 5 }, {})),
  opt('提议设一个矿务会，宗门、商户、矿户各占席位', '慢，各家都有话说',
    '矿务会设在铜谷，一年议两回。',
    fx({ donglingOrder: 10 }, {})),
]));

EV.push(hist('y070.dongling_forge_succession', '东岭炉主传承', {
  domain: 'dongling', regions: DL_VALLEY, window: [68, 72],
  baseline: '秦铸年老，炉坊传给徒弟，手艺丢了三成。',
}, '秦铸老了，握不住锤了，每天坐在炉坊门口看徒弟们打铁，看一会儿就摇头。炉坊要传下去，徒弟里没有一个学全了他的手艺，火候、淬水、配料，各会一样。炉坊的墙上挂着他用过的锤，锤柄磨得发亮。\n\n秦铸让人把你请来，问你这炉坊该怎么传。', [
  opt('劝秦铸把手艺一样样写下来，再传徒弟', '花一年',
    '秦铸口述，你记。写了一年，写满了四本册子。',
    fx({ donglingOrder: 5 }, { worldFlag: { qinZhuManual: true } })),
  opt('出钱从外地请一位炉师来带徒弟', '约 20 灵石',
    '外地的炉师来了，带了三年徒弟，手艺接上了一大半。',
    fx({ donglingOrder: 5 }, {}), { cost: { stones: 20 } }),
  opt('劝秦铸停炉，炉坊盘给商户', '炉坊换主',
    '炉坊盘给了铜谷的商户。秦铸搬去了青崖，种了半亩药田。',
    fx({ donglingOrder: -5 }, { stones: 10 })),
]));

EV.push(hist('y085.dongling_new_forge_master', '东岭新炉主', {
  domain: 'dongling', regions: DL_VALLEY, window: [83, 87],
  baseline: '新炉主接掌铜谷炉坊，开始给外地商会做器。',
}, '铜谷炉坊的新炉主接了印，是秦铸当年的小徒弟，如今也四十多了。外地的商会派人来订器，订的是测量用的铜器和农具，一订就是三年的量。炉坊里的七座炉子，如今都烧着。商会的人在门口等了两天。\n\n新炉主拿不准接不接这么大的单，来找你商量。', [
  opt('劝新炉主照秦铸的册子做器', '要有当年写下的册子',
    '照册子做出来的器，外地商会验了三遍，一件没退。',
    fx({ donglingOrder: 10 }, { stones: 10 }), { require: 'world.flags.qinZhuManual', requireHint: '秦铸的手艺没有写下来' }),
  opt('劝新炉主分出一半炉子另立门户', '炉坊分成两家',
    '炉坊分成两家，争着接单，价钱都落了。',
    fx({ donglingOrder: -5 }, {})),
  opt('帮新炉主接下外地商会的大单', '炉坊要扩',
    '炉坊扩了三座炉，招了二十个学徒。',
    fx({ donglingOrder: 5 }, { stones: 5 })),
]));

EV.push(hist('y096.dongling_record_mine_rights', '东岭录矿权', {
  domain: 'dongling', regions: DL, window: [94, 98],
  baseline: '东岭把百年来的矿权、水约录成一册，存在玄衡宗。',
}, '玄衡宗要把这一百年的矿权、水约录成一册。旧契有一半在商户手里，一半在宗门，还有几张压在青崖的祠堂里，年头久了，有的字迹已经认不清。有一张旧契上，还按着秦铸的手印。\n\n宗门的书记来请你帮着对一对，你在东岭的年头不短了。', [
  opt('帮着把旧契一张张对上', '账清',
    '对了三个月，有十几张旧契对不上，都按当年的水约补了注。',
    fx({ donglingOrder: 10 }, {})),
  opt('趁录矿权，劝各家重议矿约', '再吵一回',
    '各家吵了一个夏天，矿约改了五条。',
    fx({ donglingOrder: 5, qingyaWater: 5 }, {})),
]));

EV.push(hist('y100.dongling_year_end_snapshot', '东岭百年结算', {
  domain: 'dongling', regions: DL, window: [98, 100],
  baseline: '第一百年末，东岭由玄衡宗、青崖药农与铜谷商户共治，矿与水各有约。',
}, (state) => {
  const f = state.world?.flags || {};
  const lines = ['第一百年的冬天，玄衡群峰上的护脉大阵还亮着。铜谷的炉火、青崖的药田，各按各的约过日子。七十二涧的水分成了几股，哪一股归谁，溪边的石头上都刻着。玄衡宗的山门前，每月初一还有青崖的药农送药上山。'];
  if (f.qingyaAlliance) lines.push('青崖十二村的盟约还刻在溪边的石头上。');
  if (f.donglingCoManaged) lines.push('三家共管矿水的分利之约，玄衡宗的石壁上还看得清。');
  return lines.join('\n\n');
}, [
  opt('上玄衡宗，把东岭这些年的事说给清虚的后人听', '',
    '你说了一个下午。宗门的人把你说的记进了宗志。',
    fx({ donglingOrder: 5 }, { reputation: 5 })),
  opt('在青崖住一冬', '',
    '你帮药农翻了一冬的地。',
    fx({}, { attrs: { 道心: 2 } })),
]));

EV.push(hist('intervention.dongling_mines', '东岭矿场', {
  domain: 'dongling', regions: DL, window: [1, 15],
  baseline: '矿账对不上，矿水漫进青崖药田，铜谷、青崖两镇为矿道争执不下。',
}, '东岭的矿场名义上归玄衡宗，实际上铜谷、青崖两镇各占了一半矿道。青崖的药农举着发黄的药苗，在宗门山门外跪了一天。\n\n矿账对不上，矿水漫进了药田，青崖的药农已经告到了宗门。\n\n谁握住矿权，谁就握住了往后几十年东岭的法器和铜钱。', [
  opt('去查矿账，找出是谁在吞矿', '约 3 灵石纸墨，三日。会得罪人',
    '你对了三天矿账，查出一个执事和两个矿头联手虚报塌方，吞了半年的矿。账交给了清虚。',
    fx({ o: 3, c: 2, wc: 10, donglingOrder: 20 }, { relation: { 清虚: 5 } }), { cost: { stones: 3 }, goto: 'c1_iv_mines_2' }),
  opt('花大价钱买下一段矿权', '约 300 灵石',
    '你在玄衡宗立了契，买下一段矿道。从此你在铜谷有了自己的矿。',
    fx({ r: 4, o: 2, a: -20, donglingOrder: 10 }, { flag: { c1_own_mine: true } }), { cost: { stones: 300 }, goto: 'c1_iv_mines_2' }),
  opt('修通排水道，救下青崖的药田', '约 20 灵石，四日',
    '你带人挖了四天排水道，矿水改走老涧，不再往药田里漫。',
    fx({ r: 7, g: 1, o: 1, p: 10, qingyaWater: 30 }, { relation: { 石泉: 8 } }), { cost: { stones: 20 }, goto: 'c1_iv_mines_2' }),
]));

EV.push(link('c1_iv_mines_2', '矿道口', '铜谷和青崖的人又在矿道口对上了，两边都有人带了锄头和铁钎。秦铸的炉坊就在矿道下面，他站在门口看着。', [
  opt('在矿道上守五日，不让两镇的人打起来', '约 5 灵石干粮',
    '你在矿道口守了五天，谁也没动手。第六天两镇的头人坐下来谈了。',
    fx({ r: 10, west: 60, c: 3, p: 15, donglingOrder: 20 }, {}), { cost: { stones: 5 } }),
  opt('走开', '',
    '你走了。那天下午矿道口打伤了四个人。',
    {}),
  seer('y018.dongling_furnace_stop', '让秦铸趁煤价未涨，先囤一冬的煤', '前世几年后煤价翻了两番，铜谷的炉灭了一半',
    '你没去劝架，先去找了秦铸，让他把今年的煤多买一冬，钱不够你先垫。秦铸嫌你多事，还是买了。\n\n矿道口的人看见炉坊在囤煤，以为要打大仗，各自散了。',
    fx({ r: 10, west: 60, c: 3, p: 15, donglingOrder: 20 }, { relation: { 秦铸: 15 }, worldFlag: { qinZhuCoal: true }, rewrite: '铜谷炉坊在煤价飞涨之前囤足了煤' }), { cost: { stones: 10 } }),
]));

// ═══════════════════════════ 中州 · 宁京与河洛 ═══════════════════════════
// 本域指标：courtCredit（税册与朝廷信用）、manorPower（门阀势力）；人物：沈玉庭、魏承、萧承。

const ZZ = ['zhongzhou'];

EV.push(hist('y001.zhongzhou_tax_deficit', '中州税册亏空', {
  domain: 'zhongzhou', regions: ZZ, window: [1, 3],
  baseline: '官署先借债补账，税册仍不可靠。',
}, '宁京户部的账，入的比出的少了三成。北境要饷，南泽要赈，东岭的债还没还。户部的书吏连夜打算盘，算出来的数一回比一回难看。宁京的米价已经涨了两成。\n\n户部的人在议：向河洛的钱庄借债，查实亩，还是加税。朝官沈玉庭主张查实亩，没几个人附和。', [
  opt('帮户部的书吏算借债的利钱', '先把今年撑过去',
    '你算了三天，借债的利钱是一年两成。户部借了，账面平了，明年的窟窿更大。',
    fx({ courtCredit: -5 }, {})),
  opt('替沈玉庭抄一份隐田的旧案', '查实亩有了凭据',
    '旧案里记着河洛三县的隐田，加起来有两万多亩。沈玉庭拿着抄件去了户部。',
    fx({ courtCredit: 10, manorPower: -5 }, { relation: { 沈玉庭: 8 } })),
  opt('劝户部先加一成税', '钱来得快，民怨也来',
    '加税的告示贴出去，京畿的米价当月涨了一成。',
    fx({ courtCredit: -10 }, {})),
]));

EV.push(hist('y003.zhongzhou_actual_acre_audit', '中州实亩清丈', {
  domain: 'zhongzhou', regions: ZZ, window: [1, 5],
  baseline: '沈玉庭奏请清丈实亩，户部派员下河洛、宛丘，查出隐田却记不进册。',
}, '沈玉庭的奏章批下来了：清丈河洛、宛丘的实亩。户部派了十几个丈量官下去，你跟着去扛绳。丈量官们带着弓尺和绳子，一路走一路记。魏承的管家站在路边，看着他们笑。\n\n河洛门阀的首脑魏承派人送来一桌酒菜，请丈量官们歇两天再丈。', [
  opt('跟着丈量官照实丈量', '门阀记恨',
    '你们丈了一个月，宛丘一县就多出三千亩。魏承的人在路上拦过两回车。',
    fx({ courtCredit: 15, manorPower: -5 }, { relation: { 沈玉庭: 5, 魏承: -5 } })),
  opt('劝丈量官先丈小户，大庄后议', '少惹事，查出的少',
    '小户丈完了，大庄一亩没动。册子上多了几百亩。',
    fx({ courtCredit: 5 }, {})),
  opt('劝丈量官与魏承的人各退一步，按旧册加一成', '折中',
    '册子上加了一成，魏承那边没再拦车。',
    fx({ courtCredit: 5, manorPower: 5 }, { relation: { 魏承: 3 } })),
]));

EV.push(hist('y005.zhongzhou_manor_blocks_audit', '中州庄园阻丈', {
  domain: 'zhongzhou', regions: ZZ, window: [3, 7],
  baseline: '魏承的庄园拒绝丈量，颍川的清丈官被打伤，清丈停在半路。',
}, '颍川的清丈官被庄丁打伤了，抬回了河洛城。魏承的庄园关了门，说田是祖上传的，不许外人进。打人的庄丁跑回庄里，庄门外多了二十个拿棍的人。清丈官的腿断了，躺在床上骂了三天。\n\n沈玉庭要上奏请兵，户部的人劝他别把事闹大。', [
  opt('帮沈玉庭整理伤人的供词上奏', '朝廷得出面',
    '供词送上去，京里下了申饬，魏承交出两个庄丁抵罪，庄园照旧不让丈。',
    fx({ courtCredit: 5 }, { relation: { 沈玉庭: 5 } })),
  opt('去颍川县衙办一场就地审断', '在地方上讲理',
    '县衙审了三天，判庄园赔汤药钱，准许清丈官丈量庄外的田。',
    fx({ courtCredit: 10, manorPower: -5 }, {})),
  opt('劝沈玉庭先停丈，与魏承议和', '朝廷让一步',
    '清丈停了。魏承送了一份厚礼到沈玉庭府上，被退了回来。',
    fx({ manorPower: 10 }, { relation: { 魏承: 5 } })),
]));

EV.push(hist('y008.zhongzhou_court_struggle', '中州朝争', {
  domain: 'zhongzhou', regions: ZZ, window: [6, 10],
  baseline: '内廷与宰相争权，清丈与军饷的奏章都压在案上。',
}, '宁京宫里，内廷与宰相为了谁管户部争了半年。清丈的奏章、北境的饷单都压在案上，没人批。宫门外每天停着两拨人的车马，互不相让。北境的饷单已经压了四个月。\n\n萧承两边都不想得罪。沈玉庭托人问你，有没有门路把奏章送到萧承眼前。', [
  opt('替沈玉庭走宰相的门路', '宰相一派得势',
    '宰相把清丈的奏章递了上去，批了。内廷的人从此不跟沈玉庭说话。',
    fx({ courtCredit: 10 }, { relation: { 沈玉庭: 5 } })),
  opt('替沈玉庭走内廷的门路', '内廷一派得势',
    '内廷的人收了礼，奏章递上去，批了一半。',
    fx({ courtCredit: 5 }, {})),
  opt('劝两派各让一步，户部分管', '谁也不满意',
    '户部分成两块，内廷管钱，宰相管册。事情办得慢了。',
    fx({ courtCredit: 5, manorPower: 5 }, {})),
]));

EV.push(hist('y012.zhongzhou_army_pay_arrears', '中州军饷积欠', {
  domain: 'zhongzhou', regions: ZZ, window: [10, 14],
  baseline: '北境军饷积欠两年，户部卖官筹钱，仍不足数。',
}, '北境的军饷欠了两年。户部拿不出钱，有人提议卖官：一个县丞的缺，价钱是三百石米。卖官的榜文已经拟好，就等户部尚书盖印。北境来的文书，最近一封只写了四个字：粮尽，速饷。\n\n沈玉庭反对，说卖出去的官都要回本，回本靠的是百姓。', [
  opt('帮户部从隐田的账里挤出一部分饷', '要清丈有成效',
    '清丈查出的隐田，头一年的税全拨给了北境。饷补上了三成。',
    fx({ courtCredit: 10 }, { relation: { 沈玉庭: 5 } }), { require: 'world("courtCredit") >= 15', requireHint: '清丈没有查出东西' }),
  opt('照户部的意思卖官', '饷来得快',
    '卖了四十多个缺。饷补上了一半，河洛的县衙里多了不少新面孔。',
    fx({ courtCredit: -10, manorPower: 5 }, {})),
  opt('劝户部先拖着，再借一回债', '拖',
    '饷又拖了半年。北境的文书一封比一封急。',
    fx({ courtCredit: -5 }, {})),
]));

EV.push(hist('y015.zhongzhou_local_tax_capture', '中州地方截税', {
  domain: 'zhongzhou', regions: ZZ, window: [13, 17],
  baseline: '颍川、宛丘的门阀截留地方税，送进京里的不到三成。',
}, '颍川、宛丘今年送进京的税不到三成。县衙报的是歉收，可河洛的庄园刚起了三座新仓，粮车一车车往里拉。书吏里有一个是宛丘人，熟悉县里的门道。马是瘸的。\n\n沈玉庭要派人去查，户部只给了他两个书吏、一匹马。他把你也算了进去。', [
  opt('跟着书吏去颍川谈分成', '朝廷少收，至少收得到',
    '谈了半个月，颍川答应五成送京，五成留县。',
    fx({ courtCredit: 5, manorPower: 5 }, {})),
  opt('劝沈玉庭请禁军押税', '硬来',
    '禁军去了宛丘，税押回来了。路上有两队禁军被打散，粮车丢了一半。',
    fx({ courtCredit: 5, manorPower: -5 }, { relation: { 魏承: -5 } })),
  opt('劝户部认下地方截税，只求按年上缴定额', '朝廷税基缩一块',
    '户部认了。颍川按年送一笔定额，多的都留下了。',
    fx({ manorPower: 10 }, {})),
]));

EV.push(hist('y018.zhongzhou_tax_register_trial', '中州税册试行', {
  domain: 'zhongzhou', regions: ZZ, window: [16, 20],
  baseline: '沈玉庭在宛丘试行新税册，门阀阳奉阴违，试行半途而废。',
}, '沈玉庭在宛丘试行新税册：按实亩收税，大户小户一个算法。宛丘的大户们嘴上答应，私下把田分到家奴名下。沈玉庭在宛丘县衙里住了一年多，头发白了一半。他桌上的新册子，每一页都用朱笔改过。\n\n试行到第二年，册子上的田比丈量时少了一半。', [
  opt('帮沈玉庭把分到家奴名下的田一户户追回', '花一个冬天',
    '追回了七成。宛丘的新税册立住了，大户们去京里告了沈玉庭三回。',
    fx({ courtCredit: 15, manorPower: -5 }, { relation: { 沈玉庭: 8 }, worldFlag: { taxTrialHeld: true } }),
    { require: 'world("courtCredit") >= 20', requireHint: '户部不肯给人手' }),
  opt('劝沈玉庭降低税率，换大户照实报田', '少收一点，册子是真的',
    '税率降了两成，大户们报上来的田多了三成。',
    fx({ courtCredit: 10 }, {})),
  opt('劝沈玉庭收手，保住官位', '试行停下',
    '试行停了。沈玉庭调去了礼部，宛丘的新税册锁进了柜子。',
    fx({ courtCredit: -5, manorPower: 5 }, { relation: { 沈玉庭: -5 } })),
]));

EV.push(hist('y022.zhongzhou_gentry_tax_council', '中州士绅议税', {
  domain: 'zhongzhou', regions: ZZ, window: [20, 24],
  baseline: '河洛士绅合议税额，朝廷只能照议收税。',
}, '河洛的士绅要开一个议税的会：各县交多少，由士绅合议，报给朝廷。领头的是魏承，会就开在他家庄园的正堂里。士绅们的车马把庄园门口的路堵了半里。\n\n朝廷派来的官员在客栈里住了半个月，没人请他去。他问你，这个会该不该认。', [
  opt('劝官员认下议税会，求一个能收上来的数', '朝廷有钱，士绅有权',
    '议税会定下了数，比往年送京的多一成。魏承的话在河洛比县令管用。',
    fx({ courtCredit: 5, manorPower: 10 }, { relation: { 魏承: 5 } })),
  opt('劝朝廷委任士绅做地方官', '名分给出去',
    '十几个士绅领了官印。税是他们收，账也是他们记。',
    fx({ manorPower: 15 }, {})),
  opt('劝官员拖着不认', '两边僵着',
    '会开了，朝廷没认。那一年河洛的税一文没送进京。',
    fx({ courtCredit: -10 }, {})),
]));

EV.push(hist('y026.zhongzhou_tax_base_loss', '中州税基流失', {
  domain: 'zhongzhou', regions: ZZ, window: [24, 28],
  baseline: '朝廷税基流失大半，宁京仓廪只够京畿。',
}, '宁京的仓只够养京畿了。各地的税有的被截，有的被议，送进京的一年比一年少。户部的库房空了一半，书吏们拿着账本发呆。京畿的粮价一年比一年高，京里的人家开始往城外搬。\n\n户部的人来问：改税制，派兵催收，还是认了各地的权。', [
  opt('帮户部按宛丘新册改一县的税制', '要有当年试行的底子',
    '宛丘的新册拿出来用，一县的税收齐了。户部打算明年再推两县。',
    fx({ courtCredit: 15 }, {}), { require: 'world.flags.taxTrialHeld', requireHint: '宛丘的新税册没有立住' }),
  opt('劝户部派兵催收', '收上来一些，民变也来',
    '兵去了两县，税收上来一半。有一县的百姓围了县衙。',
    fx({ courtCredit: -5, manorPower: -5 }, {})),
  opt('劝户部认了各地的权，只求定额', '朝廷只剩名义',
    '各地按定额上缴，京里不再过问。',
    fx({ manorPower: 10 }, {})),
]));

EV.push(hist('y030.zhongzhou_succession_dispute', '中州继位之争', {
  domain: 'zhongzhou', regions: ZZ, window: [28, 32], major: true,
  baseline: '萧承无嗣立储，内廷与宰相各拥一人，京中分作两派。',
}, '萧承病了，储君还没定。内廷拥一位宗室，宰相拥另一位，宁京的禁军也分成了两拨，各守几座城门。宫门前的石狮子下面，每天都有人在递帖子。禁军的营房里，夜里也亮着灯。\n\n城里的米价一天涨三回。沈玉庭年纪大了，走路要人扶，托你去两边传话。', [
  opt('居中传话，促两派议出一个储君', '要有当年定下的约',
    '两派在沈玉庭府上谈了七天，按当年萧承定下的约，立了储君。京里没有动刀兵。',
    fx({ courtCredit: 15 }, { relation: { 沈玉庭: 5 } }),
    { require: 'world.flags.heirSettledEarly || world.flags.successionBrokered', requireHint: '萧承生前没有定下储君' }),
  opt('劝两派先立摄政，储君缓议', '拖几年',
    '摄政立了，是宰相。内廷的人退出了宁京。',
    fx({ courtCredit: 5 }, {})),
  opt('不掺和，离开宁京', '京里分作两派',
    '你出了宁京。半年后听说两派在宫门外打了一仗，朝廷分作两处发令。',
    fx({ courtCredit: -10, manorPower: 5 }, {})),
]));

EV.push(hist('y040.zhongzhou_manor_autonomy', '中州庄园自治', {
  domain: 'zhongzhou', regions: ZZ, window: [38, 42],
  baseline: '河洛、颍川的庄园自设私兵、自收私税，形同自治。',
}, '河洛、颍川的庄园都养了私兵，收私税，县令要进庄得先递帖子，等上半天。庄园里有自己的仓、自己的学堂，还有自己的刑堂。庄丁们穿着一样的号衣，比县衙的差役还齐整。\n\n朝廷派人来问魏承的后人，愿不愿意按年上缴一笔，换一个名分。', [
  opt('劝朝廷认下庄园自治，换按年上缴', '名分换钱',
    '庄园认了上缴，朝廷认了自治。',
    fx({ manorPower: 10, courtCredit: 5 }, {})),
  opt('劝朝廷再丈一回田', '要朝廷还有信用',
    '新丈的册子出来，庄园的田比旧册多了一倍。这一回庄园没敢拦。',
    fx({ courtCredit: 10, manorPower: -10 }, {}), { require: 'world("courtCredit") >= 40', requireHint: '朝廷说话已经没人听' }),
  opt('提议按田等定税，大庄多交', '慢慢谈',
    '税分三等。大庄交得多，小户交得少，谈了两年才定。',
    fx({ courtCredit: 5 }, {})),
]));

EV.push(hist('y055.zhongzhou_reform_pilot', '中州新政试点', {
  domain: 'zhongzhou', regions: ZZ, window: [53, 57],
  baseline: '新一代朝官在宛丘试点新政，税入略有起色。',
}, '新一代的朝官要在宛丘试新政：减税、清册、修渠，三样一起做。领头的人年轻，在户部翻过沈玉庭留下的宛丘旧册。宛丘的老人还记得沈玉庭当年住过的那间县衙偏房。\n\n老臣们在朝上说，这是沈玉庭那一套，当年就没成。新朝官来找你，问当年的事。', [
  opt('支持试点，帮着清册', '税入回升',
    '宛丘的册子清了一年，税入回了两成。',
    fx({ courtCredit: 10 }, {})),
  opt('劝试点只做修渠一样', '少惹人',
    '渠修好了，宛丘的田多收了一成，税没动。',
    fx({ courtCredit: 5 }, {})),
  opt('劝新朝官停手', '老臣满意',
    '试点停了。',
    fx({ manorPower: 5 }, {})),
]));

EV.push(hist('y070.zhongzhou_nominal_tax', '中州名义税赋', {
  domain: 'zhongzhou', regions: ZZ, window: [68, 72],
  baseline: '朝廷只剩名义上的税权，各地按约上缴定额。',
}, '朝廷的税权只剩一个名分了。各地按约上缴定额，多一文都要议，议一回就是半年。宁京的仓只够养京畿，户部的书吏有一半闲着。户部门口的石狮子缺了一只耳朵，没人修。各地的定额，十年没变过。\n\n户部的人来问你：是认了这个名分，还是再试一回。', [
  opt('劝户部认下名义税权', '安稳',
    '户部认了，各地的定额按时送到。',
    fx({ manorPower: 5 }, {})),
  opt('劝户部和各地重议一个新税', '要朝廷还有信用',
    '新税议了三年，比旧定额多两成。',
    fx({ courtCredit: 10 }, {}), { require: 'world("courtCredit") >= 40', requireHint: '各地不肯坐下来' }),
  opt('劝户部派兵催收', '打一仗',
    '兵去了颍川，败回来了。',
    fx({ courtCredit: -10 }, {})),
]));

EV.push(hist('y085.zhongzhou_old_new_compromise', '中州新旧妥协', {
  domain: 'zhongzhou', regions: ZZ, window: [83, 87],
  baseline: '新政派与门阀妥协，定下按亩分级的税。',
}, '新政派和门阀斗了几十年，斗到两边领头的人都换了一茬，谁也斗不动了。两边的人在宁京坐下来，要定一个按亩分级的税。宁京的茶楼里，说书的已经把这几十年的斗编成了段子。\n\n桌上摊着几十年的旧账，谁也不肯先开口。有人提议请你这个两边都打过交道的人先说。', [
  opt('促成按亩分级的税', '都让一步',
    '分级的税定下来了，刻在户部门口的石碑上。',
    fx({ courtCredit: 10, manorPower: 5 }, {})),
  opt('劝新政派再坚持几年', '不妥协',
    '新政派没让，宁京又吵了五年。',
    fx({ courtCredit: -5 }, {})),
  opt('劝门阀让出一部分私兵', '换朝廷少收税',
    '私兵撤了一半，税少收一成。',
    fx({ manorPower: -10, courtCredit: 5 }, {})),
]));

EV.push(hist('y096.zhongzhou_record_tax_register', '中州录税册', {
  domain: 'zhongzhou', regions: ZZ, window: [94, 98],
  baseline: '户部把百年来的税册重录一遍，实亩与旧册相差近半。',
}, '户部要把这一百年的税册重录一遍。旧册与实亩差了将近一半，有的县的册子上，田比人还少。最旧的那本册子，是第一年借债补账时写的，页边还有沈玉庭的批注。\n\n录册的书吏拿不定主意，抱着两摞册子来问你：该照实亩写，还是照旧册写。', [
  opt('照实亩录，旧册附后', '后人看得清',
    '新册照实亩录，旧册附在后面，两相对照，差在哪里一目了然。',
    fx({ courtCredit: 10 }, {})),
  opt('照旧册录，免得各地翻旧账', '少吵',
    '新册照旧册抄了一遍。',
    fx({ manorPower: 5 }, {})),
]));

EV.push(hist('y100.zhongzhou_year_end_snapshot', '中州百年结算', {
  domain: 'zhongzhou', regions: ZZ, window: [98, 100],
  baseline: '第一百年末，宁朝只剩名义税权，中州门阀各据一方。',
}, (state) => {
  const f = state.world?.flags || {};
  const lines = ['第一百年的冬天，宁京的宫门照常开关。户部门口的石碑上，刻着这些年议过的税。河洛的庄园还在，县衙也还在，各收各的钱。京里的号令出了城门，走不了多远。沈玉庭的旧宅门口，还长着他当年栽的那棵槐树。'];
  if (f.taxTrialHeld) lines.push('宛丘的新税册用了几十年，旁的县也在学。');
  if (f.heirSettledEarly) lines.push('萧承生前定下的储君，后来坐稳了位子。');
  return lines.join('\n\n');
}, [
  opt('去户部看一看那块石碑', '',
    '石碑上的字有一半是你当年在宁京时见过的事。',
    fx({ courtCredit: 5 }, { reputation: 5 })),
  opt('在河洛住一冬', '',
    '你在河洛城里过了一个冬天，听说书的人讲宁朝的旧事。',
    fx({}, { attrs: { 道心: 2 } })),
]));

EV.push(hist('intervention.zhongzhou_office_academy', '中州官署与书院', {
  domain: 'zhongzhou', regions: ZZ, window: [1, 27],
  baseline: '税册三年未清，军饷一拖再拖，书院里握着假账证据的人不敢交出。',
}, '中州的税册已经三年没有清过，军饷一拖再拖。户部的书吏夜里在账房烧过两回纸，被人看见了。书院的先生们聚在一处，说话都压着声。\n\n书院里有人握着官署做假账的证据，却不敢交出去。\n\n萧承年纪大了，储君的人选还没定下，各方都在拉人。', [
  opt('把证据呈到官署', '约 6 灵石誊抄递状，候一日。冒险',
    '你把誊抄的账递进了户部。三天后，两个书吏被拿了，户部开始清账。',
    fx({ c: 4, o: 2, wc: 10, courtCredit: 20 }, { relation: { 沈玉庭: 8 } }), { cost: { stones: 6 }, goto: 'c1_iv_office_2' }),
  opt('跟着清查税册', '约 4 灵石纸墨，五日',
    '你跟着清了五天税册，查出的隐田够补北境半年的饷。',
    fx({ o: 4, g: 1, c: 2, courtCredit: 30 }, {}), { cost: { stones: 4 }, goto: 'c1_iv_office_2' }),
  opt('为书院那个握着证据的人作保', '约 30 灵石押保银',
    '你押了保银，那个书生才敢出来作证。他后来进了户部做事。',
    fx({ o: 3, wc: 10, p: 10, courtCredit: 10 }, { relation: { 沈玉庭: 10 } }), { cost: { stones: 30 }, goto: 'c1_iv_office_2' }),
]));

EV.push(link('c1_iv_office_2', '储君', '萧承的储君还没有定。内廷和宰相各有人选，京里的禁军也在看风向。\n\n有人托你在两边之间走一走。', [
  opt('居中说和，七日奔走各家', '约 80 灵石酒席礼物',
    '你跑了七天，送了一圈礼。两派答应：储君的事，等萧承亲口定。',
    fx({ c: 12, o: 7, wc: 20, p: 20, courtCredit: 20 }, { worldFlag: { successionBrokered: true } }), { cost: { stones: 80 } }),
  opt('不涉此事', '',
    '你没有去。',
    {}),
  seer('y030.zhongzhou_succession_dispute', '趁萧承还能理事，促他早定储君', '约 30 灵石。前世萧承病倒后无嗣立储，京里分作两派',
    '你托沈玉庭递了一封折子，只说一件事：储君早定，京里少一场刀兵。萧承看了，召两派入宫，当面定了人。',
    fx({ c: 12, o: 7, wc: 20, p: 20, courtCredit: 40 }, { worldFlag: { heirSettledEarly: true }, relation: { 沈玉庭: 8 }, rewrite: '萧承提前定下了储君' }), { cost: { stones: 30 } }),
]));

// ═══════════════════════════ 西陲 · 玉门、沙州、白驼 ═══════════════════════════
// 本域指标：westRoute30dCapacity（原典字段，西线三十日连续日运量）、westOrder（沙道秩序）；人物：韩玉、沙吾提、耶律祁。

const XC = ['kunlun', 'jiuxiao'];

EV.push(hist('y001.xichui_route_probe', '西陲商道试探', {
  domain: 'xichui', regions: XC, window: [1, 3],
  baseline: '驼队按旧路试探水井与沙道，成本先由商户承担。',
}, '玉门关外，通远商会的驼队要试走沙州到白驼驿的旧路。路上有几口井还能不能用，没人说得准。驼队一共四十匹骆驼，驮的是南泽的茶和东岭的铁器。领队是通远商会的老人，上一回走这条路，是二十年前的事了。\n\n守将韩玉说，关可以开，出了事关军不管。', [
  opt('出钱雇一个向导带路', '约 15 灵石',
    '向导带着驼队走了二十天，找到四口还有水的井。',
    fx({ west: 60 }, { relation: { 韩玉: 3 } }), { cost: { stones: 15 } }),
  opt('跟着驼队护路', '路上有沙盗',
    '你们在沙州外遇上一伙沙盗，打了一场，丢了三匹骆驼。',
    fx({ west: 40, westOrder: 5 }, { hp: -20 })),
  opt('劝韩玉先封关，等井点探清', '慢',
    '关封了一个月，商会的人派了探子先去，回来说井大多干了。',
    fx({ westOrder: 10 }, { relation: { 韩玉: 5 } })),
]));

EV.push(hist('y003.xichui_first_shipment', '西陲首运', {
  domain: 'xichui', regions: XC, window: [1, 5],
  baseline: '首批货从沙州运到白驼驿，路上被耶律祁收了两成过路钱。',
}, '首批货从沙州起运，二十匹骆驼，驮的是盐和毛毡，要送到白驼驿。走到第六天，沙道势力的耶律祁派人拦住了驼队。骆驼们跪在沙里，等着人拿主意。\n\n拦路的人不多，个个骑着马，背着弓。他们要两成过路钱，说这是沙道的规矩。', [
  opt('护着货硬闯', '看身手',
    '你们冲过去了，货到了白驼驿。耶律祁的人从此专盯这条道。',
    fx({ west: 50, westOrder: -5 }, { relation: { 耶律祁: -10 } })),
  opt('交过路钱', '货平安到',
    '两成过路钱交了，货平安到了白驼驿。',
    fx({ west: 40 }, { relation: { 耶律祁: 5 } })),
  opt('绕南边的老路', '远，井少',
    '绕了八天，死了两匹骆驼，货到了。',
    fx({ west: 20 }, {})),
]));

EV.push(hist('y005.xichui_sand_checkpoint', '西陲沙道关卡', {
  domain: 'xichui', regions: XC, window: [3, 7],
  baseline: '耶律祁在沙道设卡，商队过一次交一次钱。',
}, '耶律祁在沙道上设了卡，就设在两口井中间，商队过一次交一次钱，不交就不给水。有个商队不肯交，被拦在井外渴了两天，最后还是交了。\n\n韩玉的关军不出关，说关外的事管不了。商会的护卫打不过，已经折了两回人。商会的领队来找你商量。', [
  opt('帮商会护卫打掉关卡', '沙道上结仇',
    '关卡拆了，耶律祁的人退到了更远的井边。',
    fx({ west: 40, westOrder: -5 }, { relation: { 耶律祁: -10 } })),
  opt('照交过路钱', '商队平安',
    '钱照交。商队算进了成本，货价涨了一成。',
    fx({ west: 20 }, {})),
  opt('去找耶律祁议季节通行', '要会说话',
    '你在他的帐篷里坐了一天，议下来：春秋两季，商队交半价。',
    fx({ west: 50, westOrder: 10 }, { relation: { 耶律祁: 8 } })),
]));

EV.push(hist('y008.xichui_well_price', '西陲井价', {
  domain: 'xichui', regions: XC, window: [6, 10],
  baseline: '白驼驿井水涨价，沙吾提限量供水，流民挤在井边。',
}, '白驼驿的井水涨价了，一桶水的价钱抵得上一斤米。井户的首领沙吾提说，井水一年比一年少，不涨价就不够分。井绳磨断了三根，换上的是新麻绳。\n\n流民挤在井边，一天打不上一桶。昨天有两家为了抢水打了起来，沙吾提的人把井口锁了一夜。', [
  opt('劝沙吾提定一个水价的上限', '流民喝得上水，井户少赚',
    '水价定了上限。井户们骂了沙吾提一个月。',
    fx({ westOrder: 10 }, { relation: { 沙吾提: 3 } })),
  opt('出钱帮井户再掘一口井', '约 25 灵石',
    '新井掘了二十天，出了水。井边的人少了一半。',
    fx({ west: 30, westOrder: 10 }, { relation: { 沙吾提: 8 } }), { cost: { stones: 25 } }),
  opt('帮沙吾提按人头配水', '公平，人人不够',
    '每人每日一瓢。流民里有人往沙州去了。',
    fx({ westOrder: 5 }, {})),
]));

EV.push(hist('y012.xichui_siege_omen', '西陲围城之兆', {
  domain: 'xichui', regions: ['kunlun'], window: [10, 14],
  baseline: '玉门关外沙盗聚集，韩玉缩关自守，关内存粮只够三月。',
}, '玉门关外聚了几百沙盗，帐篷扎在关外三里的沙梁后面，夜里能看见火。韩玉缩关自守，关门已经五天没开。关下的骆驼已经开始杀了吃。\n\n关里的粮只够三个月，水只靠关内两口井。韩玉站在城头，问你们这些困在关里的商人有什么法子。', [
  opt('帮韩玉加固关门', '守得久',
    '关门加了一层铁皮，城头多了两道拒马。',
    fx({ westOrder: 10 }, { relation: { 韩玉: 5 } })),
  opt('趁围城前运一批水粮进关', '要沙道还通',
    '你们抢在沙盗合围前，运进了一个月的水粮。',
    fx({ westOrder: 10, west: 20 }, { relation: { 韩玉: 8 } }), { require: 'world("westRoute30dCapacity") >= 400', requireHint: '沙道已经不通' }),
  opt('去找耶律祁谈，请他约束沙盗', '要和他有交情',
    '耶律祁的人散了一半。围城没有围起来。',
    fx({ westOrder: 15 }, { relation: { 耶律祁: 5 } }), { require: 'rel("耶律祁") >= 5', requireHint: '耶律祁不认得你' }),
]));

EV.push(hist('y015.xichui_alternative_route_full', '西陲备用路满载', {
  domain: 'xichui', regions: XC, window: [13, 17],
  baseline: '西陲唯一的替代商道满载，过路钱一涨再涨。',
}, '沙州到白驼驿的替代商道挤满了驼队，井边排着长队，草场被啃得精光，过路钱一涨再涨。驿站的掌柜把水价写在门板上，一天擦一回。\n\n商会的人在驿站里吵成一团：有人要拓路，有人要排班，有人说干脆涨价，少走一些人。他们请你也说一句。', [
  opt('帮商会再拓一段路', '约 20 灵石',
    '路宽了，井多掘了两口。驼队一天能多过十队。',
    fx({ west: 80 }, {}), { cost: { stones: 20 } }),
  opt('帮商会排驼队的班次', '少挤一些',
    '驼队按班次走，井边不再打架。',
    fx({ west: 30, westOrder: 10 }, {})),
  opt('劝商会涨过路钱', '少走一些人',
    '过路钱涨了，驼队少了三成，商会的账上多了一笔。',
    fx({ west: -20 }, { stones: 10 })),
]));

EV.push(hist('y018.xichui_caravan_reroute', '西陲商队改道', {
  domain: 'xichui', regions: XC, window: [16, 20], major: true,
  baseline: '商队改走白驼驿南面的老路，路远井少，死了几十匹骆驼。',
}, '一场沙暴把白驼驿北面的路埋了，刮了三天没停。商队只能改走南边的老路。老路二十年没人走，井在哪里没人记得清，向导们都不肯带。有几个老驼夫说，南路上的井，他们的爹走过。\n\n商会的领队在驿站里来回走，货压在这里，一天就是一天的钱。', [
  opt('跟着商队走老路', '路上会死骆驼',
    '走了二十八天，死了三十多匹骆驼。货到了沙州。',
    fx({ west: 30 }, { hp: -20 })),
  opt('帮商会护住还能走的那段北路', '能走一段是一段',
    '北路清出一半，商队走一半北路、一半南路。',
    fx({ west: 50, westOrder: 5 }, {})),
  opt('劝韩玉封关，等沙暴过去', '商路停一季',
    '关封了一季。商会的人在玉门关下等了三个月。',
    fx({ westOrder: 5, west: -30 }, {})),
  opt('照当年探好的井点走南路', '你曾带商队探过这条路',
    '你记得每一口井的位置。商队走了二十天，一匹骆驼没死。',
    fx({ west: 100, westOrder: 10 }, { relation: { 韩玉: 5 }, rewrite: '商队改走南路，一匹骆驼没死' }),
    { require: 'world.flags.westWellsOpened', requireHint: '南路的井点没人探过' }),
]));

EV.push(hist('y022.xichui_wells_expand', '西陲扩井', {
  domain: 'xichui', regions: XC, window: [20, 24],
  baseline: '沙吾提带人在白驼驿掘了两口新井，供水稍缓。',
}, '白驼驿的人越来越多，井不够用。沙吾提要掘新井，井户们却说，再往下掘，就要挖到别家的水脉，到时候两家都没水。井边的人家，夜里都把水桶锁在屋里。白驼驿的土屋，一年里多盖了三排。\n\n沙吾提请你去井边看一看，你见过的井多。', [
  opt('帮沙吾提掘新井', '约 20 灵石',
    '两口新井掘了一个月，出了水。',
    fx({ west: 40, westOrder: 5 }, { relation: { 沙吾提: 5 } }), { cost: { stones: 20 } }),
  opt('帮沙吾提定配水的章程', '水不多，分得公',
    '章程定了，按户按畜分水。',
    fx({ westOrder: 10 }, {})),
  opt('劝一部分人迁去沙州', '白驼驿的人少了',
    '三百多户迁去了沙州，白驼驿的井够用了。',
    fx({ westOrder: 5 }, {})),
]));

EV.push(hist('y026.xichui_merchant_army_tax', '西陲商军税', {
  domain: 'xichui', regions: XC, window: [24, 28],
  baseline: '玉门守军与商会争收商税，沙道上两家各设一卡。',
}, '玉门守军和通远商会都要收商税。沙道上一前一后两道卡，相隔不到十里，商队过一次交两次钱，交完还要被搜一遍货。两道卡上的兵和护卫，见面就吵。有个小商户把货卸在路边，不走了。\n\n小商户们不走了，驼队在玉门关下排了几里地，都等着有人出来说句话。', [
  opt('撮合守军和商会合收一道税', '两家分钱',
    '两道卡并成一道，钱按约分。商队少交了一回。',
    fx({ west: 50, westOrder: 10 }, { relation: { 韩玉: 3 } })),
  opt('帮商会顶住守军的卡', '商会记你的好',
    '守军的卡撤了，韩玉的人从此不给商会好脸色。',
    fx({ west: 20 }, { relation: { 韩玉: -5 } })),
  opt('劝两家立一个沙道之约', '慢，都有话说',
    '约议了半年，才定下来。',
    fx({ westOrder: 15 }, {})),
]));

EV.push(hist('y030.xichui_tariff_joint_stock', '西陲关税合股', {
  domain: 'xichui', regions: XC, window: [28, 32],
  baseline: '守军、商会与井户合股收关税，按股分钱。',
}, '守军、商会、井户三家要合股收关税，按股分钱。谁占几股，吵了三个月：守军说关是他们守的，商会说货是他们运的，井户说没有水谁也过不去。驿站的院子里摆了一张长桌，三家的人各坐一边，桌上的茶换了七回，没人喝。\n\n三家请你去做中人。', [
  opt('促成三家合股', '各有一份',
    '股份定下：守军四成，商会四成，井户两成。',
    fx({ westOrder: 15 }, { worldFlag: { westJointStock: true } })),
  opt('劝三家免收关税，招商队多来', '路上热闹，钱少',
    '关税免了一年，沙道上的驼队多了一倍。',
    fx({ west: 80 }, {})),
  opt('劝三家加税', '钱多，人少',
    '关税加了，驼队少了。',
    fx({ west: -30 }, { stones: 10 })),
]));

EV.push(hist('y040.xichui_west_route_normal', '西陲商道通行', {
  domain: 'xichui', regions: XC, window: [38, 42],
  baseline: '西陲商道通行如常，十三大井定额供水。',
}, '沙道通行如常了。十三大井定额供水，驼队按月往来，沙州城里的盐价十年没大动过。沙州城门口新立了一块碑，刻着十三大井的配水定额。驼队进出城门，不用再排半天。\n\n商会的人想再拓一段路，往白驼驿以西走，那边还有几口旧井，来问你值不值得。', [
  opt('帮商会维持现状', '稳',
    '路照常走，井照常供。',
    fx({ westOrder: 10 }, {})),
  opt('帮商会拓路', '约 20 灵石',
    '新路拓到白驼驿以西五十里，多了一口井。',
    fx({ west: 60 }, {}), { cost: { stones: 20 } }),
  opt('劝商会加收路税', '钱多',
    '路税加了一成。',
    fx({ west: -20 }, { stones: 10 })),
]));

EV.push(hist('y055.xichui_camel_shares', '西陲驼队合股', {
  domain: 'xichui', regions: XC, window: [53, 57],
  baseline: '驼队合股经营，小商户也能入一股走沙道。',
}, '小商户买不起整支驼队，一匹骆驼的价钱够他们吃三年。有人提议合股：一支驼队分十股，谁都能入，赚了按股分，赔了也按股赔。驿站的墙上贴着一张合股的单子，下面按了十几个手印。\n\n商会的人不乐意，说这样一来沙道上的货就乱了。', [
  opt('入一股，帮着管账', '约 20 灵石',
    '你入了一股，管了三年账。驼队走了十二趟，分了你一笔。',
    fx({ west: 30 }, { stones: 30 }), { cost: { stones: 20 } }),
  opt('劝商会自己开新路，不跟人合股', '争路',
    '商会另开一条路，跟合股的驼队抢货。',
    fx({ west: 40, westOrder: -5 }, {})),
]));

EV.push(hist('y070.xichui_sand_route_watch', '西陲沙道守望', {
  domain: 'xichui', regions: XC, window: [68, 72],
  baseline: '沙道沿途设守望台，沙暴与沙盗都提前示警。',
}, '沙道上要设守望台：沙暴来了点烟，沙盗来了敲锣。台子要修九座，每座要三个人常年守着。去年一场沙暴埋了两支驼队，一个人也没出来。商会的人说，要是有台子点烟，他们能躲。\n\n台子谁出钱修，谁派人守，商会和守军又吵了起来，一直吵到你住的驿站里。', [
  opt('帮着把守望台立起来', '约 15 灵石',
    '沿路立了九座台子，每座三个人。',
    fx({ westOrder: 15 }, {}), { cost: { stones: 15 } }),
  opt('劝守军派兵巡路，不立台子', '省钱',
    '守军每月巡一回。',
    fx({ westOrder: 5 }, {})),
  opt('劝商会放开通行，不设守望', '路上热闹，没人管',
    '路上的人多了，出事的也多了。',
    fx({ west: 30, westOrder: -10 }, {})),
]));

EV.push(hist('y085.xichui_sand_route_recognized', '西陲沙道正名', {
  domain: 'xichui', regions: XC, window: [83, 87],
  baseline: '耶律祁一系受了招安，沙道成了正经商路。',
}, '耶律祁的后人派人来玉门，带着一匹白骆驼做礼。他们愿意受招安，从此不再拦路收钱，条件是沙道上的井仍归他们管。使者是个年轻人，汉话说得很好。关楼下，守军的人把刀握得很紧。\n\n玉门的守将拿不定主意，请你去关楼上一起见使者。', [
  opt('劝韩玉的后任认下沙道，许他们管井', '沙道太平',
    '沙道成了正经商路，井归原主管。',
    fx({ westOrder: 15, west: 40 }, {})),
  opt('劝守军与沙道一系共管', '两家都有份',
    '井由两家共管，账按月对。',
    fx({ westOrder: 10 }, {})),
  opt('劝守军不认，收回井权', '要打',
    '守军出关打了一仗，井收回了三口。',
    fx({ westOrder: -10 }, {})),
]));

EV.push(hist('y096.xichui_record_trade_route', '西陲录商道', {
  domain: 'xichui', regions: XC, window: [94, 98],
  baseline: '沙州把百年来的商路、井点与过路之约录成一册。',
}, '沙州要把这一百年的商路、井点、过路之约录成一册。旧路上的井有一半已经干了，有一半被沙埋了，录的人只能问走过的人。录的人已经问了十几个老驼夫，说法各不相同，手里的图画了改，改了画。\n\n录的人找到你，问你老路上的井还记不记得。', [
  opt('把记得的井点一口口说给他', '后人用得上',
    '你说了二十七口井的位置，录册上画了一张图。',
    fx({ west: 20 }, { worldFlag: { routeRecordDetailed: true } })),
  opt('劝沙州趁录商道再开一口新井', '约 20 灵石',
    '新井在白驼驿以西，出了水。',
    fx({ west: 40 }, {}), { cost: { stones: 20 } }),
]));

EV.push(hist('y100.xichui_year_end_snapshot', '西陲百年结算', {
  domain: 'xichui', regions: XC, window: [98, 100],
  baseline: '第一百年末，玉门守军与通远商会共保沙道，十三大井定额供水。',
}, (state) => {
  const f = state.world?.flags || {};
  const lines = ['第一百年的冬天，玉门关外的驼队照常往来。十三大井定额供水，守望台上的烟一年点不了几回。沙州城里的盐价十年没大动过，白驼驿的井边又起了几排土屋。通远商会的会票，从沙州一路能用到临河。'];
  if (f.westJointStock) lines.push('守军、商会、井户三家合股的关税，账还是按月对。');
  return lines.join('\n\n');
}, [
  opt('跟最后一支驼队走一趟沙州', '',
    '你在沙州城外看了一回日落，驼铃声一直响到天黑。',
    fx({ west: 10 }, { reputation: 5 })),
  opt('在白驼驿住一冬', '',
    '你帮井户掏了一冬的井。',
    fx({}, { attrs: { 道心: 2 } })),
]));

EV.push(hist('intervention.xichui_wells_sand_route', '西陲水井与沙道', {
  domain: 'xichui', regions: XC, window: [1, 15],
  baseline: '玉门关外三口井干涸，商队只能走白驼驿一条道，过路钱越收越高。',
}, '西陲的沙暴一年比一年凶，玉门关外的水井干了三口。驿站里的水缸，一缸水要卖十个人。商队的骆驼趴在驿站外面，舌头伸得老长。\n\n去沙州的商队只能走白驼驿那一条道，过路钱越收越高。\n\n向导说，再往西还有一条老路，只是二十年没人走过了。', [
  opt('买水存进驿站', '约 20 灵石',
    '水连着驼运，价钱贵。驿站存够了一季的水，商队撑过了这一季。',
    fx({ g: 1, o: 1, p: 10, westOrder: 10 }, {}), { cost: { stones: 20 }, goto: 'c1_iv_wells_2' }),
  opt('雇向导去探那条老路', '约 28 灵石，二十日',
    '向导带你走了二十天，老路上有五口井还能出水。',
    fx({ r: 4, west: 100, wc: 20 }, {}), { cost: { stones: 28 }, goto: 'c1_iv_wells_2' }),
  opt('跟驿站签下通行约，压住过路费', '约 50 灵石押金',
    '通行约签了，过路费三年不涨。',
    fx({ west: 150, r: 3, o: 2 }, { relation: { 耶律祁: 5 } }), { cost: { stones: 50 }, goto: 'c1_iv_wells_2' }),
]));

EV.push(link('c1_iv_wells_2', '驼队', '通远商会的一支驼队要过沙道，护卫不够。领队问你肯不肯跟着走一趟。', [
  opt('护着商队过沙道十日', '约 4 灵石干粮水囊',
    '十天里遇上一回沙暴、一回沙盗。货到了沙州，领队多分了你一份。',
    fx({ west: 400, r: 20, c: 1, p: 20 }, { relation: { 韩玉: 5 } }), { cost: { stones: 4 } }),
  opt('不去', '',
    '驼队走了，你留在驿站。',
    {}),
  seer('y018.xichui_caravan_reroute', '领商队走前世改道后的那条南路，沿途井点提前掘开', '约 10 灵石。前世几年后沙暴埋了北路，商队在南路上死了几十匹骆驼',
    '你没走北路，领着驼队往南绕，每到一处前世记得的井点，就停下半天掘开井口、垒上石头。驼队晚到了五天，回来时商会的人照着你垒的石头又走了一趟。',
    fx({ west: 500, r: 20, c: 1, p: 20, westOrder: 30 }, { worldFlag: { westWellsOpened: true }, rewrite: '西陲南路的井点提前掘开了' }), { cost: { stones: 10 } }),
]));

// ═══════════════════════════ 青石镇与临河 · 日常营生（可重复） ═══════════════════════════
// pool 'wild'，只在本地区探索时出现。工钱与差价取自场景（日工约 7 文，十文折一灵石）。
// 会动世界指标的选项都用计数封顶，免得反复刷；不碰河湾堤（堤只能靠大事和干预节点修）。

const QN = 'region() == "qingniu"';
const LX = 'region() == "luoxia"';

function daily(id, title, region, require, weight, text, choices) {
  return { id, title, pool: 'wild', region, weight, minRealm: 0, require, text, choices };
}

const REGION_EVENTS = [
  daily('c1_r_ferry_help', '渡口帮工', 'qingniu', QN, 6,
    '天刚亮，河湾渡口就排起了队。何六一个人撑船，岸上卸货的人不够，挑担的、赶车的都在喊。\n\n何六冲你招手：「搭把手，按担算钱。」', [
      opt('帮着卸货', '一天下来挣几个工钱',
        '你从早卸到午，肩膀磨红了一块。何六按担数给了钱，一文没少。',
        { stones: 2 }),
      opt('留下半日，帮何六补船缝', '工钱少一半，船能多撑些日子',
        '你们把船翻过来，刮掉旧泥，塞麻絮，刷桐油。何六说这条船又能多撑一个汛期。',
        fx({ b: 1, r: 10 }, { stones: 1, relation: { 何六: 3 }, counter: { c1_boat_patch: 1 } }),
        { require: 'count("c1_boat_patch") < 3', requireHint: '船缝都补过了' }),
    ]),
  daily('c1_r_east_ditch', '东田水沟', 'qingniu', QN, 5,
    '东田的水沟又被淤泥堵了一截，阿衡挽着裤腿站在沟里，一锹一锹往外挖。\n\n「搭把手？」他直起腰，「中午管一顿饭。」', [
      opt('下沟帮他挖', '管一顿饭，阿衡记你的情',
        '你们挖到太阳偏西，沟里的水又流起来了。阿衡家的饭是糙米和咸菜，你吃了两碗。',
        fx({ g: 1 }, { relation: { 阿衡: 3 }, hp: 10, counter: { c1_ditch_help: 1 } }),
        { require: 'count("c1_ditch_help") < 3', requireHint: '这阵子已经做过了' }),
      opt('跟他换工：你挖沟，他教你看灵田', '学点种田的门道',
        '阿衡一边挖，一边告诉你灵田的水要浅，谷子抽穗前不能断水。你记在了心里。',
        { relation: { 阿衡: 2 }, attrs: { 悟性: 1 } }, { once: true }),
    ]),
  daily('c1_r_qian_san_price', '钱三的粮价', 'qingniu', `${QN} && year() <= 17`, 4,
    '钱三在粮铺门口挂了块木牌，今天的米价比昨天高了两文。他看见你，招手：「后生，有闲钱没有？跟我入一船粮，下个月出手，分你两成利。」', [
      {
        label: '入他一船粮', hint: '约 10 灵石，粮价涨了才赚',
        cost: { stones: 10 },
        roll: {
          p: 0.6,
          success: { text: '下个月粮价果然涨了。钱三按约分给你本钱和两成利，账算得清清楚楚。', effects: { stones: 12 } },
          fail: { text: '临河开仓平粜，粮价落了下来。钱三把本钱退给你，扣了一成的仓租。', effects: { stones: 9 } },
        },
      },
      opt('不入，只问问各处的粮价', '多知道一点行情',
        '钱三说了临河、平桥、菱湖三处的价，哪里贵哪里贱，你记下了。',
        { flag: { c1_knows_grain_price: true } }),
    ]),
  daily('c1_r_xu_niang_herbs', '徐娘缺药', 'qingniu', QN, 4,
    '徐娘的药柜空了三格。她说后山的车前草、蒲公英这几天正好采，可她走不开，镇上又有人发热。', [
      opt('上山采药卖给她', '按斤给钱',
        '你在后山采了一下午，背回来一筐。徐娘按斤付了钱，挑出一半晒上。',
        { stones: 3 }),
      opt('采了药送给她，不要钱', '镇上的病人用得上',
        '徐娘没推辞，把药收进柜子，留你喝了碗茶。',
        fx({ p: 5 }, { relation: { 徐娘: 4 }, karma: 3, counter: { c1_herb_gift: 1 } }),
        { require: 'count("c1_herb_gift") < 3', requireHint: '这阵子已经做过了' }),
      opt('请徐娘给你看一回伤', '约 5 灵石诊金药钱',
        '徐娘按了按你的旧伤，换了药，又包了三副让你回去煎。半个月后，伤好了。',
        { heal: 1 }, { cost: { stones: 5 } }),
    ]),
  daily('c1_r_shen_yan_workshop', '沈砚器铺', 'qingniu', QN, 4,
    '沈砚的器铺里，炉子烧得正旺。他手边压着一沓画满刻度的纸，抬头看了你一眼：「缺个拉风箱的，干不干？」', [
      opt('拉一天风箱', '挣一点工钱',
        '你拉了一天风箱，胳膊酸得抬不起来。沈砚付了工钱，没多说一个字。',
        { stones: 2 }),
      opt('留下来看他怎么校罗盘', '不拿工钱，学看刻度',
        '沈砚校一面罗盘，校了三遍，每遍都在纸上记一行数。你看着他记，慢慢看出了门道。',
        { relation: { 沈砚: 3 }, flag: { c1_learned_measure: true }, attrs: { 神识: 1 } }, { once: true }),
    ]),
  daily('c1_r_zhao_shou_levy', '赵守征粮', 'qingniu', `${QN} && year() <= 17`, 3,
    '赵守又在祠庙门口点粮了。州府这回的数比上回多一成，镇上有几户交不出来，蹲在墙根下不说话。', [
      opt('帮赵守核账', '花一天',
        '你帮着把交不出的几户一户户问清楚，有两户确实是遭了病，赵守在账上给他们缓了一个月。',
        fx({ o: 5 }, { relation: { 赵守: 2 }, counter: { c1_levy_help: 1 } }),
        { require: 'count("c1_levy_help") < 2', requireHint: '这阵子已经做过了' }),
      opt('替一户交不出的人垫上', '约 3 灵石',
        '那户人家的老汉给你磕了个头，你没让他磕完。',
        { relation: { 赵守: 1 }, karma: 5, reputation: 2, counter: { c1_levy_pay: 1 } }, { cost: { stones: 3 }, require: 'count("c1_levy_pay") < 3', requireHint: '这阵子已经做过了' }),
    ]),
  daily('c1_r_old_kiln', '废窑烧炭', 'qingniu', QN, 3,
    '镇西的废窑还能用。烧一窑炭要三天，卖到临河能挣一笔，就是要守着火，夜里不能睡。', [
      opt('烧一窑炭卖', '三天，挣几个钱',
        '你守了三天火，出了一窑炭，挑到市集卖了。脸上的黑灰洗了两遍才洗掉。',
        { stones: 4 }),
      opt('帮人修窑，换一窑的使用权', '多花力气，下回烧炭不用租',
        '你和几个烧炭的人把塌了的窑口重新砌好。他们答应下回烧窑让你先用。',
        { stones: 1, flag: { c1_kiln_right: true } }),
    ]),
  daily('c1_r_lu_qing_cargo', '陆清押货', 'qingniu', QN, 3,
    '行商陆清要往临河运一车山货，缺个押车的。他说路上不太平，给的钱是平日短工的两倍。', [
      {
        label: '跟着押车去临河', hint: '路上可能遇到拦路的',
        roll: {
          p: 0.7, attrs: { 根骨: 0.01 },
          success: { text: '一路平安。到了临河，陆清付了钱，又请你在东市吃了碗面。', effects: { stones: 6 } },
          fail: { text: '半路上有人拦车，你挨了一棍子，好在货没丢。陆清多给了你一份汤药钱。', effects: { stones: 5, hp: -20 } },
        },
      },
      opt('不去，帮他在市集看摊', '钱少，不冒险',
        '你替陆清看了一天摊，卖出去七八样山货。',
        { stones: 2 }),
    ]),
  daily('c1_r_refugee_shed', '流民棚', 'qingniu', `${QN} && year() >= 3 && year() <= 20`, 3,
    '旧宅后面的流民棚又多了几户。有个孩子坐在棚口，捧着空碗，一动不动。', [
      opt('送一斗米过去', '约 2 灵石',
        '你把米交给棚里管事的老人。老人点了点头，没说谢。',
        fx({ o: 5 }, { karma: 5, counter: { c1_shed_rice: 1 } }),
        { cost: { stones: 2 }, require: 'count("c1_shed_rice") < 3', requireHint: '这阵子已经做过了' }),
      opt('雇两个流民帮你干活', '工钱给得低，他们也肯',
        '两个流民跟你干了三天，你按市价的七成付了钱。他们没说什么，第四天没来。',
        { stones: 2, karma: -3 }),
    ]),
  daily('c1_r_after_flood', '灾后清淤', 'qingniu', `${QN} && year() >= 19 && year() <= 30`, 5,
    '大水退后，河边的田里淤了一层泥，渠也堵了。镇上按天雇人清淤。', [
      opt('按天去清淤', '挣工钱',
        '你清了一天淤，挖出半截船板和一只泡烂的鞋。',
        { stones: 3 }),
      opt('帮东田的人先把渠通了', '不拿钱，阿衡记你的情',
        '渠通了，东田的水又能进出。阿衡送了你一袋新谷。',
        { relation: { 阿衡: 3 }, hp: 10, counter: { c1_flood_ditch: 1 } }, { require: 'count("c1_flood_ditch") < 2', requireHint: '这阵子已经做过了' }),
    ]),
  daily('c1_r_grain_dock', '粮码头扛包', 'luoxia', LX, 6,
    '临河粮码头上停着三条粮船，扛包的人不够。宋宜站在码头边上点数，每过一袋就在账上画一笔。', [
      opt('扛一天包', '按袋算钱',
        '你扛了一百多袋，宋宜的账上画了一百多笔。工钱按袋结，一文不差。',
        { stones: 3 }),
      opt('帮宋宜对账', '工钱少，账清',
        '你和她对了一下午，账上的数和船上的数差了六袋。宋宜查出是一个船工夹带，记了下来。',
        fx({ o: 3 }, { stones: 1, relation: { 宋宜: 3 }, counter: { c1_dock_audit: 1 } }),
        { require: 'count("c1_dock_audit") < 3', requireHint: '这阵子已经做过了' }),
    ]),
  daily('c1_r_south_polder', '南圩抢收', 'luoxia', LX, 4,
    '南圩的稻子熟了，天却阴了下来。圩里的人家在抢收，按天雇短工。', [
      opt('帮着抢收', '挣工钱',
        '你割了一天稻子，傍晚雨下来时，最后一捆刚好挑进了屋。',
        { stones: 3 }),
      opt('帮圩里的人把收下的粮挑到高处的仓里', '少挣一点，粮少泡一点',
        '你们把粮挑到城北的仓里，走了四趟。',
        fx({ g: 1 }, { stones: 1, counter: { c1_polder_carry: 1 } }),
        { require: 'count("c1_polder_carry") < 3', requireHint: '这阵子已经做过了' }),
    ]),
  daily('c1_r_heifeng_toll', '黑风寨过路钱', 'luoxia', `${LX} && year() >= 3`, 4,
    '去芦洲的水路上，旧河闸前横着一条船。船头站着几个黑风寨的人，过一条船收一份钱。你搭的这条货船也被拦了下来。', [
      opt('照交过路钱', '约 2 灵石',
        '你交了钱。黑风寨的人挥挥手，船过去了。',
        {}, { cost: { stones: 2 } }),
      opt('跟他们讲价', '看你会不会说话',
        '你跟船头的人说了半天，说这船是给临河州府运粮的。他们收了一半的钱。',
        {}, { cost: { stones: 1 } }),
      {
        label: '不交，硬闯过去', hint: '看身手',
        roll: {
          p: 0.4, attrs: { 根骨: 0.01 },
          success: { text: '你一篙子把对方的船头撑开，货船冲了过去。后面有人骂了一路。', effects: { relation: { 韩彪: -5 } } },
          fail: { text: '你被人从船上推进了河里，货船还是交了钱。你爬上岸，浑身是泥。', effects: { hp: -20, stones: -2, relation: { 韩彪: -3 } } },
        },
      },
    ]),
  daily('c1_r_linhe_market', '临河东市', 'luoxia', LX, 3,
    '临河东市的铺子比青石多，货也贵。青石的山货、菱湖的鱼干，到这里都能多卖两成。', [
      {
        label: '贩一担菱湖鱼干来卖', hint: '约 6 灵石本钱',
        cost: { stones: 6 },
        roll: {
          p: 0.65,
          success: { text: '鱼干卖得快，一担卖完，多挣了两成。', effects: { stones: 8 } },
          fail: { text: '东市刚到了一船鱼干，价钱压了下来，你只卖回了本钱。', effects: { stones: 6 } },
        },
      },
      opt('在东市替人写信记账', '挣点小钱',
        '你在街口摆了张桌子，写了七封家书、两张欠条。',
        { stones: 2 }),
    ]),
  daily('c1_r_garrison_pay', '守军欠饷', 'luoxia', `${LX} && year() >= 5 && year() <= 22`, 3,
    '城门口有个守军拿着一副旧皮甲在卖，说饷欠了三个月，家里等米下锅。', [
      opt('买下皮甲', '约 4 灵石，比铺子里便宜一半',
        '皮甲旧了，护心的那块还结实。那个兵拿了钱，去东市买米了。',
        { attrs: { 根骨: 1 } }, { cost: { stones: 4 }, once: true }),
      opt('借他几个钱，不要皮甲', '约 2 灵石',
        '他把名字和营号告诉了你，说发饷那天还。一个月后，钱还回来了。',
        { relation: { 顾淮: 2 }, karma: 3, counter: { c1_lend_soldier: 1 } }, { cost: { stones: 2 }, require: 'count("c1_lend_soldier") < 2', requireHint: '这阵子已经做过了' }),
    ]),
  daily('c1_r_dike_patrol', '巡堤', 'luoxia', `${LX} && year() <= 18`, 3,
    '汛期前，州府雇人沿河湾堤巡查，看哪里冒水、哪里有獾洞。一天给几个钱，管一顿午饭。', [
      opt('巡一天堤', '挣工钱',
        '你从城南走到第三弯，又走回来。堤脚有两处獾洞，你插了树枝做记号，报给了守堤的兵。',
        { stones: 2, hp: 10 }),
      opt('巡堤时把渗水的地方一处处记下，交给宋宜', '工钱照拿，宋宜那边多一份底',
        '你记了七处，第三弯那一处最软。宋宜把你的单子夹进了账本。',
        fx({ wc: 10 }, { stones: 2, relation: { 宋宜: 2 }, flag: { c1_seen_seep: true }, counter: { c1_dike_note: 1 } }),
        { require: 'count("c1_dike_note") < 2', requireHint: '这阵子已经做过了' }),
    ]),
];

export const CENTURY1_EVENTS = EV;
export const CENTURY1_REGION_EVENTS = REGION_EVENTS;
