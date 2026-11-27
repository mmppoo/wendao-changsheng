/**
 * 可投身的势力（v8）：沿用 13 个宗门编号，按 docs/WORLD_CANON.md §4 换成第一纪元的宗门、衙门、军伍、商会与部族。
 * SECT_RANKS 是引擎通用的六级职阶（贡献门槛唯一真源）；各势力自己的叫法写在 sect.ranks，
 * 用 sectRankName(sectId, idx) 取用。每个势力有独立功法加成、任务池风味、专属事件与结局钩子。
 */
export const SECT_RANKS = [
  { name: '外门弟子', contribution: 0 },
  { name: '内门弟子', contribution: 500 },
  { name: '真传弟子', contribution: 2000 },
  { name: '执事', contribution: 6000 },
  { name: '长老', contribution: 15000 },
  { name: '太上长老', contribution: 40000 },
];

export const SECTS = [
  {
    id: 'taixuan', name: '玄衡宗', align: '正', element: '符',
    seat: '东岭·玄衡群峰',
    desc: '东岭大宗，以符阵立身，清虚主事。主峰护脉大阵要补，宗门向周边诸矿收税，也拿符器灵石结交朝廷，换开山采矿、招收弟子的特权。门规第一条：取矿必设阵涵养，不得竭泽而渔。',
    requirement: '根骨 ≥ 12 或 金/雷灵根',
    requireExpr: 'char.attrs.根骨 >= 12 || char.rootId === "jin" || char.rootId === "lei"',
    entry: '外门考校：在山门石阶下站满一日，由执事以测灵符验过根骨，再背出护脉戒条。',
    perks: { speed: 0.22, atk: 0.35, attrs: { 根骨: 2 } },
    technique: '《玄衡护脉诀》',
    taskFlavor: ['巡查诸矿', '补刻阵纹', '押解矿税', '追缉私采矿工'],
    ranks: ['外门弟子', '内门弟子', '真传弟子', '执事', '长老', '太上长老'],
    joinEffects: { attrs: { 根骨: 3 }, reputation: 20 },
    tags: ['符阵', '宗门', '正道'],
  },
  {
    id: 'qingyun', name: '观星台', align: '正', element: '星',
    seat: '中州·宁京（各州府设观测点）',
    desc: '宁朝观天测灵的衙门。记天象，录灵气消长，造测灵罗盘，在大城、关隘和各州府设观测点。监里不管钱粮，只问读数准不准。',
    requirement: '悟性 ≥ 10 且 道心 ≥ 5',
    requireExpr: 'char.attrs.悟性 >= 10 && char.attrs.道心 >= 5',
    entry: '考校：守一夜观测台，把每个时辰的星位和罗盘读数记下，次日与监里的底册对照，错一处就不收。',
    perks: { speed: 0.16, attrs: { 悟性: 2, 道心: 3 }, stones: 20 },
    technique: '《观天测灵录》',
    taskFlavor: ['值夜观星', '校验罗盘', '下州府查验观测点', '誊录天象底册'],
    ranks: ['监生', '司辰', '灵台郎', '监丞', '少监', '监正'],
    joinEffects: { attrs: { 道心: 5 }, reputation: 30 },
    tags: ['朝廷', '观测', '正道'],
  },
  {
    id: 'danxia', name: '青崖宗', align: '正', element: '木',
    seat: '东岭·青崖谷',
    desc: '前朝云和年间，散修在青崖谷结茅立派。宗门守着七十二涧的清流和谷中药田；上游开矿淘洗，浊浆一来药苗就枯，青崖宗为这条水和人争了几代。',
    requirement: '悟性 ≥ 8 或 火/木灵根',
    requireExpr: 'char.attrs.悟性 >= 8 || char.rootId === "huo" || char.rootId === "mu"',
    entry: '辨药：在药田边认出七味药，再说清其中哪一味最怕浊水。',
    perks: { speed: 0.1, alchemy: 0.35, attrs: { 悟性: 3 }, stones: 60 },
    technique: '《青崖药经》',
    taskFlavor: ['看守药炉', '巡查山涧水色', '采收灵芝与云母草', '给山民送药'],
    ranks: ['药童', '药师', '真传药师', '执事', '长老', '太上长老'],
    joinEffects: { items: ['huiling_dan', 'lingcao'], reputation: 10 },
    tags: ['丹道', '宗门', '正道'],
  },
  {
    id: 'tianyin', name: '青石祠庙', align: '正', element: '香',
    seat: '南泽·青石镇',
    desc: '青石镇的祠庙，受镇上香火，也管着一座义仓。灾年一到，镇上的人先往这里来。祠里修士少，香客多，守祠的人要能熬得住清苦。',
    requirement: '道心 ≥ 15',
    requireExpr: 'char.attrs.道心 >= 15',
    entry: '守祠：在祠里住满七日，扫地、添香、看管义仓，账上一粒米不差。',
    perks: { speed: 0.08, attrs: { 道心: 8, 神识: 4 }, demonResist: 0.4 },
    technique: '《守祠清心经》',
    taskFlavor: ['守夜添香', '清点义仓', '为病人安神', '替镇民料理丧事'],
    ranks: ['祠中杂役', '庙祝', '义仓司仓', '主祠', '祠老', '太上祠老'],
    joinEffects: { attrs: { 道心: 8 }, reputation: 25 },
    tags: ['民间', '香火', '正道'],
  },
  {
    id: 'wanxiang', name: '宁京客卿', align: '正', element: '阵',
    seat: '中州·宁京',
    desc: '朝廷供奉的修士，替内廷与户部办事：验仓、查账、护送朝官、勘验地脉。拿朝廷的俸禄，守朝廷的规矩，进出宁京凭的是官凭。',
    requirement: '悟性 ≥ 14',
    requireExpr: 'char.attrs.悟性 >= 14',
    entry: '应聘：在户部递上举荐文书，当堂布一座困人的小阵，由内廷供奉评定等第。',
    perks: { speed: 0.12, attrs: { 悟性: 5, 神识: 5 }, array: 0.4 },
    technique: '《供奉阵法要略》',
    taskFlavor: ['替户部验仓', '护送朝官', '勘验河洛地脉', '值守内廷'],
    ranks: ['候补供奉', '供奉', '上供奉', '客卿', '首席客卿', '太上客卿'],
    joinEffects: { attrs: { 悟性: 5, 神识: 5 }, reputation: 20 },
    tags: ['朝廷', '阵法', '正道'],
  },
  {
    id: 'hanshan', name: '北境边军', align: '正', element: '铁',
    seat: '北境·雁门关',
    desc: '林照麾下的边军，镇守雁门。朝廷欠饷已久，衣粮常缺，外堡一座座往里收。修士在这里淬兵刃、修关符、护粮道，空谈没人听，能御寒杀敌才有人服。',
    requirement: '道心 ≥ 12 或 冰/水灵根',
    requireExpr: 'char.attrs.道心 >= 12 || char.rootId === "bing" || char.rootId === "shui"',
    entry: '投军：在关下校场拉开一张硬弓，再顶着风雪守一夜烽燧，天亮时报出夜里过了几拨人马。',
    perks: { speed: 0.14, attrs: { 道心: 6, 神识: 2 }, lifespan: 30 },
    technique: '《边军淬兵诀》',
    taskFlavor: ['守夜烽燧', '淬炼兵刃', '修补关符', '护送粮车'],
    ranks: ['伍长', '什长', '队正', '校尉', '偏将', '副将'],
    joinEffects: { attrs: { 道心: 6 }, lifespan: 10 },
    tags: ['军伍', '正道'],
  },
  {
    id: 'wanbao', name: '通远商会', align: '中', element: '金',
    seat: '西陲·沙州（各地设商站）',
    desc: '百余年前，商贾之祖联合各部长老，以马换井，立石为誓，定下每驼纳水资三枚铜板的规矩，西陲商道由此通行。如今商路、货栈和十三大井的盟约都绕不开这家商会。',
    requirement: '灵石 ≥ 500 或 魅力 ≥ 10',
    requireExpr: 'char.stones >= 500 || char.attrs.魅力 >= 10',
    entry: '验资：把全部本钱摆上柜台，由掌柜看过，再定你能跟哪一路货。',
    perks: { speed: 0.1, stones: 120, trade: 0.25 },
    technique: '《井盟算经》',
    taskFlavor: ['押运货物', '核对井盟水资', '催收欠账', '与朔部议价'],
    ranks: ['伙计', '跑街', '掌柜', '大掌柜', '总号执事', '总号东家'],
    joinEffects: { stones: 300, reputation: 5 },
    tags: ['商道', '中立'],
  },
  {
    id: 'wanshou', name: '朔部', align: '中', element: '风',
    seat: '北境·朔川草滩',
    desc: '关外的部族联盟，控着朔川草滩和牧道，出良马与鹰。和边军互市，也为冬营与马道起冲突。阿史那岚是首领之一。',
    requirement: '根骨 ≥ 10 或 木灵根',
    requireExpr: 'char.attrs.根骨 >= 10 || char.rootId === "mu"',
    entry: '驯马：在草滩上驯服一匹没上过鞍的马，不许用鞭。',
    perks: { speed: 0.12, beast: 0.3, attrs: { 根骨: 3 }, lifespan: 20 },
    technique: '《朔川驯鹰法》',
    taskFlavor: ['放牧', '驯鹰', '护送互市马队', '争夺冬营'],
    ranks: ['牧人', '骑手', '百骑长', '千骑长', '部帅', '部族长老'],
    joinEffects: { attrs: { 根骨: 3 }, reputation: 10 },
    tags: ['部族', '御兽', '中立'],
  },
  {
    id: 'jiguan', name: '东岭炉坊', align: '中', element: '土',
    seat: '东岭·铜谷矿镇',
    desc: '秦铸的炉坊，接军令打兵刃，也打民用铁器。煤价一涨，炉火就难保。铜谷的炉子日夜不熄，坊里认手艺，不认出身。',
    requirement: '悟性 ≥ 12 或 土灵根',
    requireExpr: 'char.attrs.悟性 >= 12 || char.rootId === "tu"',
    entry: '试工：守一座炉子三天三夜，打出一把刃口不卷的刀。',
    perks: { speed: 0.09, craft: 0.35, attrs: { 悟性: 3, 根骨: 2 } },
    technique: '《铜谷炉火诀》',
    taskFlavor: ['看炉', '试新弩', '运煤', '修补矿车'],
    ranks: ['学徒', '匠工', '匠头', '炉头', '大匠', '总炉头'],
    joinEffects: { attrs: { 悟性: 3 }, items: ['xuantie'] },
    tags: ['器道', '工坊', '中立'],
  },
  {
    id: 'xuemo', name: '赤霞遗脉', align: '邪', element: '血',
    seat: '西陲·白驼废墟',
    desc: '赤霞旧府崩毁后流散下来的掠灵之法。吸他人气血、抽地脉灵气来养自己，进境快，代价落在别人身上。没有门规，活下来的就是门人。',
    requirement: '根骨 ≥ 8 或 血/暗灵根',
    requireExpr: 'char.attrs.根骨 >= 8 || char.rootId === "xue" || char.rootId === "an"',
    entry: '入门：在流沙残殿里和另一个求法者争一块磁砂，只有一个人能带着它出来。',
    perks: { speed: 0.3, atk: 0.45, attrs: { 根骨: 2 }, demon: 2 },
    technique: '《赤霞掠灵法》',
    taskFlavor: ['猎杀修士', '抽取地脉', '看守残殿', '挖掘磁砂'],
    ranks: ['求法者', '门人', '传人', '执法', '护法', '遗脉之主'],
    joinEffects: { attrs: { 根骨: 4 }, karma: -30, reputation: -20 },
    tags: ['古修', '邪道'],
  },
  {
    id: 'hehuan', name: '沙道势力', align: '邪', element: '沙',
    seat: '西陲·流沙道',
    desc: '耶律祁手下的沙盗，控着几口井，收过路钱，跟商队谈季节通行，也劫不肯交钱的驼队。在沙里，谁握着水井谁说了算。',
    requirement: '魅力 ≥ 8',
    requireExpr: 'char.attrs.魅力 >= 8',
    entry: '入伙：跟着去拦一支驼队，只凭一张嘴把过路钱谈下来，不许拔刀。',
    perks: { speed: 0.2, charm: 0.4, attrs: { 魅力: 5 }, lifespan: 30 },
    technique: '《沙道控井术》',
    taskFlavor: ['守井收钱', '打探驼队', '与商会谈价', '劫掠不交钱的客商'],
    ranks: ['喽啰', '刀手', '小头目', '头目', '大头目', '二当家'],
    joinEffects: { attrs: { 魅力: 5 }, lifespan: 10, karma: -10 },
    tags: ['沙盗', '邪道'],
  },
  {
    id: 'youming', name: '黑风寨', align: '邪', element: '水',
    seat: '南泽·芦洲旧河闸',
    desc: '韩彪的水寇，据芦洲旧河闸收过路钱，寨里屯着粮。官军围剿之前，韩彪总想先把过路钱谈下来；谈不下来，就在水下动手。',
    requirement: '神识 ≥ 14 或 暗灵根',
    requireExpr: 'char.attrs.神识 >= 14 || char.rootId === "an"',
    entry: '入寨：夜里在闸下排水桩，憋气摸黑，天亮前不许上岸。',
    perks: { speed: 0.18, attrs: { 神识: 7 }, demonResist: 0.2 },
    technique: '《黑风水下功》',
    taskFlavor: ['守闸收钱', '排水桩', '劫官粮船', '刺探官军动向'],
    ranks: ['喽啰', '水手', '小头目', '舵主', '大头目', '二寨主'],
    joinEffects: { attrs: { 神识: 7 }, karma: -20 },
    tags: ['水寇', '邪道'],
  },
  {
    id: 'sanxiu', name: '散修', align: '散', element: '无',
    seat: '五域各地，不入门户',
    desc: '不入任何门户。没有靠山，没有现成的功法，也没有月例。功法要自己找，命要自己保，想去哪就去哪。',
    requirement: '无',
    requireExpr: 'true',
    entry: '你没有拜谁，收拾好包袱就上路了。',
    perks: { speed: 0.06, freedom: 0.3, attrs: { 气运: 3 } },
    technique: '《引气诀残篇》',
    taskFlavor: ['替人跑腿', '摆摊卖药', '替人押货', '打听消息'],
    ranks: ['散修', '行脚客', '坐地散修', '一方名宿', '前辈', '耆宿'],
    joinEffects: { attrs: { 气运: 3 }, reputation: 0 },
    tags: ['散修'],
  },
];

export const SECT_BY_ID = Object.fromEntries(SECTS.map((s) => [s.id, s]));

/** 玩家开宗立派模板：创建自创仙宗时以此为基础生成宗门对象。 */
export const PLAYER_SECT_TEMPLATE = {
  id: 'player_sect',
  name: '自创仙宗',
  align: '中',
  element: '道',
  seat: '自辟洞天·宗门主峰',
  desc: '由你亲手开山立派的道统，规矩由你定，剑锋随你指。',
  requirement: '开宗立派',
  requireExpr: 'false',
  entry: '立碑刻名，聚拢散修与门徒，自成一方道统。',
  perks: { speed: 0.24, atk: 0.2, def: 0.15, stones: 180, attrs: { 道心: 4, 悟性: 4 } },
  technique: '《开宗大道总纲》',
  ranks: ['外门弟子', '内门弟子', '真传弟子', '执事', '长老', '宗主'],
  taskFlavor: ['招收新徒', '扩建灵脉', '讲道授业', '震慑群宗'],
  joinEffects: { reputation: 120 },
  tags: ['开宗立派', '自创'],
  defaultRank: 5,
  buildCustom(name, align = '中') {
    return {
      ...this,
      name: name || this.name,
      align: ['正', '中', '邪'].includes(align) ? align : '中',
    };
  },
};

/**
 * 势力自己的职阶叫法：sect.ranks[idx]，没有时回落到通用 SECT_RANKS。
 * 引擎显示职阶时应调用本函数（贡献门槛仍以 SECT_RANKS 为准）。
 */
export function sectRankName(sectId, idx) {
  const i = Math.max(0, Math.min(SECT_RANKS.length - 1, Number(idx) || 0));
  const sect = sectId === PLAYER_SECT_TEMPLATE.id ? PLAYER_SECT_TEMPLATE : SECT_BY_ID[sectId];
  return sect?.ranks?.[i] || SECT_RANKS[i].name;
}

/** 兼容薄封装：SECT_RANKS 为唯一真源；支持按职阶索引（0..5）或贡献值查询。 */
export function sectRank(rankIdxOrContribution) {
  const val = Number(rankIdxOrContribution) || 0;
  if (val >= 0 && val < SECT_RANKS.length && Number.isInteger(val)) {
    return { index: val, ...SECT_RANKS[val] };
  }
  let idx = 0;
  SECT_RANKS.forEach((r, i) => { if (val >= r.contribution) idx = i; });
  return { index: idx, ...SECT_RANKS[idx] };
}
