/**
 * 物品（v5.0）：丹药、法器、法宝、灵宝、仙器、灵材、奇珍、符箓、秘典玉简。
 * 共 105 件物品（完整保留原有 35 件 ID），use 效果由 engine/effects.js 的 applyEffects 统一结算。
 */
export const ITEMS = [
  // ==================== 原有 35 件物品（全部保留 ID） ====================
  {
    id: 'yinqi_dan', name: '引气丹', type: '丹药', tier: '凡', price: 30,
    desc: '炼气期最寻常的丹药，服下可省一月苦功。', use: { exp: 80 }, stack: true,
  },
  {
    id: 'huiling_dan', name: '回灵丹', type: '丹药', tier: '黄', price: 80,
    desc: '灵液凝成，服之灵力充盈，高阶修士亦可速复三成法力。', use: { mp: 50, mpPct: 0.3 }, stack: true,
  },
  {
    id: 'liaoshang_dan', name: '疗伤丹', type: '丹药', tier: '黄', price: 70,
    desc: '止血生肌，行走江湖必备，可恢复固定与两成半气血。', use: { hp: 80, hpPct: 0.25 }, stack: true,
  },
  {
    id: 'zhuji_dan', name: '筑基丹', type: '丹药', tier: '玄', price: 600,
    desc: '筑基之时服用，可大幅提升成功率并稳固道基。', use: { breakBonus: 18, lifespan: 5 }, stack: true,
  },
  {
    id: 'pozhang_dan', name: '破障丹', type: '丹药', tier: '玄', price: 900,
    desc: '冲关破障，硬生生把瓶颈撞开一道缝。', use: { breakBonus: 25, demon: 3 }, stack: true,
  },
  {
    id: 'xisui_dan', name: '洗髓丹', type: '丹药', tier: '地', price: 2600,
    desc: '洗经伐髓，改造资质。凡人也有一次重来的机会。', use: { attrs: { 根骨: 4, 悟性: 2 }, lifespan: 10 }, stack: true,
  },
  {
    id: 'jiuzhuan_dan', name: '九转金丹', type: '丹药', tier: '天', price: 30000,
    desc: '九转九炼，一丹可续命三百年，气血尽复。', use: { lifespan: 300, hp: 9999, hpPct: 1 }, stack: true,
  },
  {
    id: 'tianjie_dan', name: '天劫丹', type: '丹药', tier: '仙', price: 120000,
    desc: '以雷木为引，硬抗一道天雷。传说只有疯子才炼得出来。', use: { breakBonus: 40, hp: -500 }, stack: true,
  },
  {
    id: 'qingfeng_jian', name: '青锋剑', type: '法器', tier: '黄', price: 200,
    desc: '凡铁所铸，但剑身有一线青光。', equip: { atk: 6 },
  },
  {
    id: 'liegong', name: '祖传猎弓', type: '法器', tier: '凡', price: 60,
    desc: '桑木弓，弦是狼筋。你父亲留下的。', equip: { atk: 4, crit: 2 },
  },
  {
    id: 'canjian', name: '残剑', type: '法器', tier: '地', price: 0,
    desc: '你前世的本体。锈迹斑斑，握在手里却会轻轻震鸣。', equip: { atk: 18, crit: 8 },
  },
  {
    id: 'xueyu', name: '血玉牌', type: '法器', tier: '玄', price: 0,
    desc: '母亲的遗物。贴身带着，能听见很远的哭声。', equip: { mp: 30, demon: 2 },
  },
  {
    id: 'lingcao', name: '百年灵草', type: '灵材', tier: '黄', price: 45,
    desc: '山野间采得，炼丹主料。', stack: true,
  },
  {
    id: 'xuantie', name: '玄铁', type: '灵材', tier: '玄', price: 160,
    desc: '炼器上品，重逾千斤。', stack: true,
  },
  {
    id: 'leimu', name: '雷击木', type: '灵材', tier: '地', price: 800,
    desc: '被天雷劈过却未死的老木，蕴含雷意。', stack: true,
  },
  {
    id: 'huxin_fu', name: '护心符', type: '符箓', tier: '玄', price: 320,
    desc: '一次性护体，可挡致命一击。', use: { shield: 1 }, stack: true,
  },
  {
    id: 'shenxing_fu', name: '神行符', type: '符箓', tier: '黄', price: 60,
    desc: '日行千里。逃命、赶路、赴约，都用得上。', use: { escape: 1 }, stack: true,
  },
  {
    id: 'jiuzhuan_gong', name: '《九转元功》', type: '功法', tier: '天', price: 0,
    desc: '不知来历的残卷，每读一遍，经脉就宽一分。', technique: { speed: 0.25, attrs: { 根骨: 3 } },
  },
  {
    id: 'wujian_jue', name: '《无剑诀》', type: '功法', tier: '天', price: 0,
    desc: '剑不在手，剑在念。修至深处，草木皆剑。', technique: { atk: 0.3, speed: 0.1 },
  },
  {
    id: 'changchun_gong', name: '《长春功》', type: '功法', tier: '地', price: 0,
    desc: '木系养命之法，寿元绵长。', technique: { lifespan: 40, speed: 0.08 },
  },
  {
    id: 'jiejin_dan', name: '结金丹', type: '丹药', tier: '玄', price: 2200,
    desc: '凝液成丹的破境圣药，可大幅提升结丹成算并增进修为。',
    use: { breakBonus: 22, expPct: 0.12 }, stack: true,
  },
  {
    id: 'huaying_dan', name: '化婴丹', type: '丹药', tier: '地', price: 9500,
    desc: '碎丹成婴时护持元神的灵丹，助元婴稳固诞生并延寿十五载。',
    use: { breakBonus: 26, expPct: 0.12, lifespan: 15 }, stack: true,
  },
  {
    id: 'huashen_dan', name: '化神丹', type: '丹药', tier: '地', price: 36000,
    desc: '采九天罡气炼就，服之引动神魂与天地法则共鸣，大增化神契机。',
    use: { breakBonus: 28, lawExp: 35 }, stack: true,
  },
  {
    id: 'xukong_jing', name: '虚空晶', type: '灵材', tier: '天', price: 120000,
    desc: '自界壁裂缝凝结的稀世晶石，既可作炼虚破境阵眼，亦可直接炼化悟道。',
    use: { breakBonus: 30, lawExp: 60 }, stack: true,
  },
  {
    id: 'dao_fruit', name: '悟道果', type: '丹药', tier: '天', price: 320000,
    desc: '三千年一熟的先天道果，服之灵台清明，法则感悟如决堤奔涌。',
    use: { breakBonus: 32, lawExp: 100, attrs: { 悟性: 5, 道心: 5 } }, stack: true,
  },
  {
    id: 'tiandao_lotus', name: '天道莲', type: '丹药', tier: '仙', price: 900000,
    desc: '生于混沌灵池的九品青莲，可涤荡心魔、延寿百廿载并助冲击大乘。',
    use: { breakBonus: 36, lawExp: 160, lifespan: 120, demon: -25 }, stack: true,
  },
  {
    id: 'dahuan_dan', name: '大还丹', type: '丹药', tier: '地', price: 1800,
    desc: '高阶疗伤回灵宝丹，纵使身受重创亦能顷刻复原六成半气血与半数灵力。',
    use: { hp: 400, hpPct: 0.65, mp: 200, mpPct: 0.5 }, stack: true,
  },
  {
    id: 'qingxin_dan', name: '清心丹', type: '丹药', tier: '玄', price: 420,
    desc: '冰莲与静心草合炼，服之神识澄澈，驱散心魔躁动。',
    use: { demon: -18, attrs: { 道心: 1 } }, stack: true,
  },
  {
    id: 'juling_dan', name: '聚灵丹', type: '丹药', tier: '玄', price: 380,
    desc: '筑基与金丹修士常用的精进丹药，可省去数月苦修。',
    use: { exp: 900, expPct: 0.18 }, stack: true,
  },
  {
    id: 'yuanying_dan', name: '元婴丹', type: '丹药', tier: '地', price: 14000,
    desc: '以千年药王精炼而成，药力雄浑，专供元婴及化神大修增进修为。',
    use: { exp: 32000, expPct: 0.25 }, stack: true,
  },
  {
    id: 'xianling_dan', name: '仙灵丹', type: '丹药', tier: '仙', price: 180000,
    desc: '沾染一丝上界仙气的绝品宝丹，修为暴涨且可重塑生机、增寿五十载。',
    use: { expPct: 0.35, hpPct: 0.8, mpPct: 0.8, lifespan: 50 }, stack: true,
  },
  {
    id: 'qiannian_lingcao', name: '千年灵草', type: '灵材', tier: '玄', price: 320,
    desc: '历经十个甲子方成的灵药主材，炼制结金丹与高阶宝丹不可或缺。',
    stack: true,
  },
  {
    id: 'xingchen_sha', name: '星辰砂', type: '灵材', tier: '地', price: 2400,
    desc: '天外陨星坠落归墟所化的银辉灵砂，祭炼本命法宝可令锋芒大涨。',
    stack: true,
  },
  {
    id: 'longxue_jing', name: '龙血精', type: '灵材', tier: '天', price: 18000,
    desc: '太古蛟龙遗留的真血结晶，直接吞服可强筋壮骨、延寿三十载。',
    use: { attrs: { 根骨: 6 }, hpPct: 0.5, lifespan: 30 }, stack: true,
  },
  {
    id: 'faze_canpian', name: '法则残片', type: '灵材', tier: '天', price: 28000,
    desc: '古仙大战崩碎的大道印记，参悟吸收可大幅精进法则感悟与神识。',
    use: { lawExp: 80, attrs: { 神识: 3, 悟性: 3 } }, stack: true,
  },

  // ==================== 新增 20 种丹药（覆盖炼气至真仙全境） ====================
  {
    id: 'peiyuan_dan', name: '培元丹', type: '丹药', tier: '黄', price: 95,
    desc: '温养丹田经脉的温和灵丹，炼气期连服亦不伤根基，兼可小补气血。',
    use: { exp: 260, hpPct: 0.15 }, stack: true,
  },
  {
    id: 'ningqi_dan', name: '凝气丹', type: '丹药', tier: '黄', price: 140,
    desc: '采清晨紫露与百年灵草炼制，最宜炼气后期凝实真元、回充法力。',
    use: { exp: 420, mpPct: 0.25 }, stack: true,
  },
  {
    id: 'jiexin_dan', name: '清毒解障丹', type: '丹药', tier: '黄', price: 110,
    desc: '药王谷流传的解瘴良药，可祛除山泽毒煞、愈合暗伤并宁静心神。',
    use: { hpPct: 0.2, demon: -8, heal: 1 }, stack: true,
  },
  {
    id: 'bixue_dan', name: '碧血生肌丹', type: '丹药', tier: '玄', price: 520,
    desc: '以妖兽精血辅以灵参熬炼，刀剑重创之下服之顷刻止血生肌。',
    use: { hp: 220, hpPct: 0.45 }, stack: true,
  },
  {
    id: 'zhuyan_dan', name: '冰肌驻颜丹', type: '丹药', tier: '玄', price: 1800,
    desc: '合欢宗与丹霞谷皆视为奇珍的定颜宝丹，可令容颜不老、气韵生辉并延寿二十五载。',
    use: { attrs: { 魅力: 5 }, lifespan: 25 }, stack: true,
  },
  {
    id: 'bingxin_dan', name: '冰心雪莲丹', type: '丹药', tier: '地', price: 3200,
    desc: '采极北万年雪莲心蕊炼成，入腹寒彻神府，令积年心魔冰消瓦解。',
    use: { demon: -35, attrs: { 道心: 3 } }, stack: true,
  },
  {
    id: 'yangshen_dan', name: '养神玉清丹', type: '丹药', tier: '地', price: 4800,
    desc: '温润识海的玉清灵丹，服之耳目通明，神识与悟性皆有显著长进。',
    use: { attrs: { 神识: 4, 悟性: 3 }, mpPct: 0.4 }, stack: true,
  },
  {
    id: 'duangu_dan', name: '锻骨龙象丹', type: '丹药', tier: '地', price: 5200,
    desc: '体修梦寐以求的淬骨猛药，药力如奔雷贯体，过后筋骨坚若精金。',
    use: { attrs: { 根骨: 5 }, hpPct: 0.5, lifespan: 12 }, stack: true,
  },
  {
    id: 'jianyi_dan', name: '剑魄通明丹', type: '丹药', tier: '地', price: 6800,
    desc: '太玄剑冢百年剑气凝霜入炉所成，服之灵台如闻万剑齐鸣，大进剑道感悟。',
    use: { lawExp: 55, lawId: 'sword', attrs: { 根骨: 2 } }, stack: true,
  },
  {
    id: 'leiyuan_dan', name: '紫霄雷元丹', type: '丹药', tier: '地', price: 7200,
    desc: '引劫云初雷封入丹胎，吞服如饮电浆，能令雷霆法则感悟突飞猛进。',
    use: { lawExp: 55, lawId: 'thunder', attrs: { 道心: 2 } }, stack: true,
  },
  {
    id: 'yanshou_dan', name: '松鹤延寿丹', type: '丹药', tier: '地', price: 8500,
    desc: '采千年赤松脂与灵鹤朝露合炼，寿元将尽的老修宁倾家荡产亦求一粒。',
    use: { lifespan: 80, hpPct: 0.4 }, stack: true,
  },
  {
    id: 'ningying_dan', name: '凝婴玉露丹', type: '丹药', tier: '地', price: 11000,
    desc: '以地心玉乳调和元婴灵药，温养元婴法身，省却数载苦修之功。',
    use: { exp: 26000, expPct: 0.2, mpPct: 0.4 }, stack: true,
  },
  {
    id: 'xinghui_dan', name: '周天星辉丹', type: '丹药', tier: '天', price: 24000,
    desc: '于观星绝顶吸纳七七四十九夜星华凝丹，服之周身星光流转、星辰法则大涨。',
    use: { lawExp: 85, lawId: 'star', attrs: { 神识: 3 } }, stack: true,
  },
  {
    id: 'guangyin_lu', name: '岁月朝露', type: '丹药', tier: '天', price: 38000,
    desc: '昆仑古树晨间凝结的一滴光阴灵露，饮之恍若枯木逢春，窥见岁月流转之妙。',
    use: { lawExp: 90, lawId: 'time', lifespan: 45 }, stack: true,
  },
  {
    id: 'lianxu_dan', name: '太虚炼神丹', type: '丹药', tier: '天', price: 68000,
    desc: '炼虚大修闭关必备的虚空妙丹，引神魂游历太虚，修为与法则齐头并进。',
    use: { expPct: 0.28, lawExp: 45, mpPct: 0.5 }, stack: true,
  },
  {
    id: 'heti_dan', name: '混元合道丹', type: '丹药', tier: '天', price: 210000,
    desc: '调和肉身与元神的合体期圣丹，服之身法交融，周身气血如大江奔腾。',
    use: { expPct: 0.3, lawExp: 80, hpPct: 0.6 }, stack: true,
  },
  {
    id: 'hundun_lingye', name: '混沌初开灵液', type: '丹药', tier: '仙', price: 360000,
    desc: '自太古混沌缝隙渗出的乳白灵液，一滴便蕴阴阳造化，直指混沌大道本源。',
    use: { lawExp: 150, lawId: 'chaos', attrs: { 悟性: 4, 气运: 4 } }, stack: true,
  },
  {
    id: 'changsheng_guo', name: '太乙长生果', type: '丹药', tier: '仙', price: 420000,
    desc: '万载一花、万载一果的仙界灵珍，食之续命五百载，道骨重塑，气血法力尽复。',
    use: { lifespan: 500, attrs: { 根骨: 4, 道心: 4 }, hpPct: 1, mpPct: 1 }, stack: true,
  },
  {
    id: 'dacheng_dan', name: '大乘紫气丹', type: '丹药', tier: '仙', price: 560000,
    desc: '采东来三万里鸿蒙紫气炼成的绝世仙丹，专助大乘巅峰修士冲关问鼎。',
    use: { expPct: 0.35, lawExp: 120, breakBonus: 20 }, stack: true,
  },
  {
    id: 'dujie_shengdan', name: '渡劫玄黄丹', type: '丹药', tier: '仙', price: 1200000,
    desc: '玄黄母气与九霄劫雷淬炼出的无上神丹，渡劫真仙亦视若性命底牌。',
    use: { expPct: 0.4, hpPct: 0.9, mpPct: 0.9, breakBonus: 30, demon: -20 }, stack: true,
  },

  // ==================== 新增 20 件法器 / 法宝 / 灵宝 / 仙器 ====================
  {
    id: 'tie_jian', name: '玄钢长剑', type: '法器', tier: '凡', price: 120,
    desc: '百炼玄钢铸就的制式长剑，虽无华彩，却厚重耐砍，颇合炼气散修心意。',
    equip: { atk: 5, def: 2 },
  },
  {
    id: 'qingmu_jia', name: '青木软甲', type: '法器', tier: '黄', price: 260,
    desc: '以百年青灵藤编织而成的贴身软甲，轻若无物，能卸去三成妖爪劲力。',
    equip: { def: 7, mp: 10 },
  },
  {
    id: 'biling_jie', name: '碧灵聚气戒', type: '法器', tier: '黄', price: 340,
    desc: '戒面嵌着一颗青翠灵玉，时刻微引周遭灵气，可令佩者法力更显充沛。',
    equip: { def: 4, mp: 24 },
  },
  {
    id: 'hanbing_jian', name: '寒霜古剑', type: '法器', tier: '玄', price: 1200,
    desc: '寒山雪铁锻造的三尺秋水，剑未出鞘已有霜气凝眉，斩敌时寒气入骨。',
    equip: { atk: 12, def: 4 },
  },
  {
    id: 'xuanwu_dun', name: '玄武墨盾', type: '法器', tier: '玄', price: 1450,
    desc: '以深海玄龟背甲辅以玄铁祭炼的圆盾，灵力一催便化丈许玄光护壁。',
    equip: { def: 14, mp: 18 },
  },
  {
    id: 'qingming_jing', name: '清明照妖镜', type: '法器', tier: '玄', price: 1600,
    desc: '古铜宝镜，镜面刻满镇邪灵纹，照耀之下幻术无所遁形，攻守兼备。',
    equip: { atk: 9, def: 10, mp: 28 },
  },
  {
    id: 'zixiao_ling', name: '紫霄雷铃', type: '法宝', tier: '地', price: 4800,
    desc: '以雷击木心雕琢而成的三寸小铃，摇动时电蛇缠绕，震慑金丹邪祟。',
    equip: { atk: 20, def: 12, mp: 40 },
  },
  {
    id: 'jinwu_yi', name: '金乌火羽衣', type: '法宝', tier: '地', price: 5600,
    desc: '采赤阳火鸦真羽织就的法袍，水火不侵，举手投足隐有烈焰护身。',
    equip: { atk: 10, def: 24, mp: 35 },
  },
  {
    id: 'wanhun_fan', name: '万魂招煞幡', type: '法宝', tier: '地', price: 6200,
    desc: '幽冥鬼道祭炼的阴森黑幡，展幡时阴风怒号，威能骇人却微损心境。',
    equip: { atk: 25, mp: 45, demon: 2 },
  },
  {
    id: 'canghai_zhu', name: '沧海定水珠', type: '法宝', tier: '地', price: 8400,
    desc: '东海归墟深处孕育的避水灵珠，内蕴一汪沧海灵韵，镇浪护体皆妙。',
    equip: { atk: 18, def: 22, mp: 55 },
  },
  {
    id: 'taixu_jian', name: '太虚斩虹剑', type: '灵宝', tier: '天', price: 28000,
    desc: '星辰砂与天外玄铁合铸的通灵飞剑，出鞘如长虹贯日，可破元婴护罩。',
    equip: { atk: 38, def: 16, mp: 50 },
  },
  {
    id: 'bagua_xuanjia', name: '八卦玄黄甲', type: '灵宝', tier: '天', price: 32000,
    desc: '万象书院与机关城合铸的镇域宝甲，甲片自成八卦防御大阵，万法难侵。',
    equip: { atk: 16, def: 38, mp: 60 },
  },
  {
    id: 'xinghe_shan', name: '星河羽扇', type: '灵宝', tier: '天', price: 45000,
    desc: '轻摇之间星辉倾泻如瀑，既可卷起九天罡风伤敌，亦能化星幕护主。',
    equip: { atk: 42, def: 26, mp: 75 },
  },
  {
    id: 'donghuang_zhong', name: '镇狱古钟', type: '灵宝', tier: '天', price: 68000,
    desc: '仿太古神钟祭炼的玄黄重宝，钟声起处山河凝固，护体之威冠绝同阶。',
    equip: { atk: 36, def: 46, mp: 80 },
  },
  {
    id: 'qiankun_jie', name: '乾坤须弥戒', type: '灵宝', tier: '天', price: 88000,
    desc: '内蕴方圆十里灵脉小世界的空间灵宝，佩之法力如海、举重若轻。',
    equip: { atk: 30, def: 36, mp: 110 },
  },
  {
    id: 'kunlun_jing', name: '昆仑照界镜', type: '灵宝', tier: '天', price: 140000,
    desc: '昆仑墟界出土的上古仙镜，镜光定住虚空，可令大乘以下强敌寸步难行。',
    equip: { atk: 54, def: 44, mp: 120 },
  },
  {
    id: 'zhuxian_canjian', name: '诛仙残剑', type: '仙器', tier: '仙', price: 420000,
    desc: '上古仙战崩断的一截神剑，虽仅余半刃，杀伐之气仍令九天劫云退避。',
    equip: { atk: 76, def: 30, mp: 90 },
  },
  {
    id: 'xuantian_baojia', name: '玄天星辰仙甲', type: '仙器', tier: '仙', price: 480000,
    desc: '以三百六十五颗古星核心熔炼而成的仙道战甲，星辉加身，不朽不灭。',
    equip: { atk: 40, def: 62, mp: 130 },
  },
  {
    id: 'hundun_zhong', name: '混沌太初钟', type: '仙器', tier: '仙', price: 860000,
    desc: '先天混沌气孕育的绝世仙钟，一震破万法，二震定乾坤，镇压诸天劫数。',
    equip: { atk: 68, def: 66, mp: 150 },
  },
  {
    id: 'taichu_xianjian', name: '太初问道仙剑', type: '仙器', tier: '仙', price: 1500000,
    desc: '沾染太初大道真意的无上仙兵，剑鸣清越如闻古仙问道，所向无前。',
    equip: { atk: 96, def: 52, mp: 160 },
  },

  // ==================== 新增 12 种灵材 / 奇珍（覆盖八大灵域） ====================
  {
    id: 'chiyang_shi', name: '赤阳炎石', type: '灵材', tier: '黄', price: 75,
    desc: '青牛山脉阳坡深处掘出的炽热灵矿，既可助炼火系法器，亦可温炉炼丹。',
    stack: true,
  },
  {
    id: 'yaoshou_neidan', name: '妖兽内丹', type: '灵材', tier: '玄', price: 260,
    desc: '筑基以上妖兽毕生精元所凝，坊市常年紧俏的炼丹与布阵核心材料。',
    stack: true,
  },
  {
    id: 'biling_yu', name: '碧磷蛇胆', type: '灵材', tier: '玄', price: 380,
    desc: '苍茫妖森毒蟒所结灵胆，生服虽苦烈如火，却能壮骨清毒、滋补气血。',
    use: { attrs: { 根骨: 1 }, hpPct: 0.2 }, stack: true,
  },
  {
    id: 'guixu_shanhu', name: '归墟灵珊瑚', type: '灵材', tier: '地', price: 1100,
    desc: '生于东海海眼万丈深渊的赤玉珊瑚，久经潮汐冲刷，水灵之气精纯无比。',
    stack: true,
  },
  {
    id: 'bihai_xuanbing', name: '碧海玄冰髓', type: '灵材', tier: '地', price: 1900,
    desc: '海底寒脉万年凝结的湛蓝冰髓，炼化一缕可清心驱魔、速复灵力。',
    use: { demon: -12, mpPct: 0.35 }, stack: true,
  },
  {
    id: 'jiuyou_mingjing', name: '九幽冥晶', type: '灵材', tier: '地', price: 2800,
    desc: '北荒魔域深处黄泉阴脉所产漆黑晶石，乃祭炼鬼道法宝与空间阵基的上材。',
    stack: true,
  },
  {
    id: 'xuesha_jing', name: '血煞魔核', type: '灵材', tier: '地', price: 3600,
    desc: '北荒血池煞气凝聚的猩红魔晶，强行炼化可骤增修为，然易惹心魔滋生。',
    use: { expPct: 0.14, demon: 5 }, stack: true,
  },
  {
    id: 'qilin_jiao', name: '麒麟玉角', type: '奇珍', tier: '天', price: 16000,
    desc: '瑞兽麒麟蜕落的天生灵角，祥光氤氲，炼化可强健根骨、厚增气运与寿元。',
    use: { attrs: { 根骨: 4, 气运: 3 }, lifespan: 25 }, stack: true,
  },
  {
    id: 'fenghuang_yu', name: '朱雀真羽', type: '奇珍', tier: '天', price: 22000,
    desc: '不灭真炎缠绕的赤金神羽，持之百邪不侵，炼化可令悟性与气质双双升华。',
    use: { attrs: { 悟性: 3, 魅力: 3 }, hpPct: 0.6 }, stack: true,
  },
  {
    id: 'kunlun_shenmu', name: '昆仑建木枝', type: '奇珍', tier: '天', price: 54000,
    desc: '传说通天建木遗落昆仑墟界的一截嫩枝，生机浩瀚，蕴含光阴延绵之理。',
    use: { lifespan: 90, lawExp: 55, lawId: 'time' }, stack: true,
  },
  {
    id: 'hundun_muqi', name: '混沌母气', type: '奇珍', tier: '仙', price: 240000,
    desc: '天地未分时的玄黄清浊本源，一缕重若山岳，炼化可直悟混沌至理并脱胎换骨。',
    use: { lawExp: 110, lawId: 'chaos', attrs: { 根骨: 5, 悟性: 5 } }, stack: true,
  },
  {
    id: 'jiuxiao_leijie', name: '九霄紫雷核', type: '奇珍', tier: '仙', price: 380000,
    desc: '九霄天门劫云深处诞生的紫雷本源，炼化之日雷霆俯首，破境渡劫大增胜算。',
    use: { lawExp: 130, lawId: 'thunder', breakBonus: 25 }, stack: true,
  },

  // ==================== 新增 8 种符箓 ====================
  {
    id: 'jingang_fu', name: '金刚护身符', type: '符箓', tier: '黄', price: 120,
    desc: '佛门与正道通用的初级护身符篆，催动时金光罩体，并可稍抚伤势。',
    use: { shield: 1, hpPct: 0.15 }, stack: true,
  },
  {
    id: 'zhangxin_leifu', name: '掌心五雷符', type: '符箓', tier: '玄', price: 360,
    desc: '封存一道青云正雷的玉符，既可破邪除煞，亦可细细观摩其中雷纹轨迹。',
    use: { lawExp: 18, lawId: 'thunder', exp: 260 }, stack: true,
  },
  {
    id: 'jianqi_fu', name: '剑意封灵符', type: '符箓', tier: '玄', price: 420,
    desc: '金丹剑修随手封入一缕剑意的剑符，启封观悟可壮筋骨、明剑道。',
    use: { lawExp: 20, lawId: 'sword', attrs: { 根骨: 1 } }, stack: true,
  },
  {
    id: 'poxie_fu', name: '镇魔破邪符', type: '符箓', tier: '玄', price: 480,
    desc: '天音寺高僧以朱砂梵文绘就，贴于眉心可驱散心魔阴霾并凝一层护体佛光。',
    use: { demon: -22, shield: 1 }, stack: true,
  },
  {
    id: 'juling_zhenfu', name: '聚灵阵符', type: '符箓', tier: '地', price: 1200,
    desc: '将一座小型聚灵阵压缩于方寸符纸，祭出便可鲸吞方圆十里灵气入体。',
    use: { expPct: 0.22, mpPct: 0.5 }, stack: true,
  },
  {
    id: 'suodi_fu', name: '缩地成寸符', type: '符箓', tier: '地', price: 1600,
    desc: '刻有空间折跃古篆的高阶遁符，危难时可连遁千里，且助悟空间奥妙。',
    use: { escape: 2, lawExp: 25, lawId: 'space' }, stack: true,
  },
  {
    id: 'jiuxiao_leifu', name: '九霄神雷符', type: '符箓', tier: '天', price: 12000,
    desc: '化神雷修耗费心血炼成的护道雷符，引动两重雷罡护体并深悟雷霆法则。',
    use: { shield: 2, lawExp: 50, lawId: 'thunder' }, stack: true,
  },
  {
    id: 'taiyi_hudaofu', name: '太乙护道仙符', type: '符箓', tier: '仙', price: 85000,
    desc: '古仙遗留的护道符诏，启之紫气三层护身、可遁界海、涤心魔而助破关。',
    use: { shield: 3, escape: 2, demon: -30, breakBonus: 18 }, stack: true,
  },

  // ==================== 新增 10 卷秘典 / 玉简（可直接于行囊参悟） ====================
  {
    id: 'yujian_qingfeng', name: '《青风剑谱玉简》', type: '秘典', tier: '黄', price: 380,
    desc: '落霞城坊市偶见的古朴玉简，录有散修剑客三十六式清风轻灵剑法。',
    technique: { grade: '黄', speed: 0.06, atk: 0.09, def: 0.02, lifespan: 0, lawId: 'sword', artName: '清风拂柳剑' },
  },
  {
    id: 'yujian_yangshen', name: '《黄庭养气简》', type: '秘典', tier: '黄', price: 420,
    desc: '道门流传甚广的吐纳养命残简，虽少杀伐之威，却最利延年益寿、调和丹火。',
    technique: { grade: '黄', speed: 0.08, atk: 0.03, def: 0.05, lifespan: 15, lawId: 'pill', artName: '黄庭蕴灵气' },
  },
  {
    id: 'yujian_benlei', name: '《奔雷掌秘典》', type: '秘典', tier: '玄', price: 1600,
    desc: '焦黑雷纹封面的古籍，载有以掌引雷、震碎妖骨的刚猛雷法。',
    technique: { grade: '玄', speed: 0.11, atk: 0.15, def: 0.06, lifespan: 5, lawId: 'thunder', artName: '掌中惊雷爆' },
  },
  {
    id: 'yujian_xuanbing', name: '《玄冰心经残卷》', type: '秘典', tier: '玄', price: 1800,
    desc: '寒意森森的冰蚕丝帛书，修之灵力如玄冰沉静，既固防御亦缓岁华流逝。',
    technique: { grade: '玄', speed: 0.12, atk: 0.08, def: 0.14, lifespan: 25, lawId: 'time', artName: '冰河凝霜诀' },
  },
  {
    id: 'yujian_bagua', name: '《伏羲八卦阵简》', type: '秘典', tier: '地', price: 6800,
    desc: '以龟甲刻录的古阵玉简，参透后举手投足暗合八卦方位，进退皆如身处大阵。',
    technique: { grade: '地', speed: 0.16, atk: 0.15, def: 0.2, lifespan: 20, lawId: 'array', artName: '八卦定乾坤' },
  },
  {
    id: 'yujian_xingchen', name: '《周天星辰诀玉简》', type: '秘典', tier: '地', price: 9200,
    desc: '银辉点点的星玉简，教人夜引周天星力淬炼肉身神魂，攻守与寿元俱进。',
    technique: { grade: '地', speed: 0.18, atk: 0.2, def: 0.18, lifespan: 35, lawId: 'star', artName: '星陨九重天' },
  },
  {
    id: 'yujian_xukong', name: '《太虚挪移经》', type: '秘典', tier: '天', price: 42000,
    desc: '封于虚空晶匣中的上古秘卷，参悟后可借空间褶皱断界斩敌、瞬息千里。',
    technique: { grade: '天', speed: 0.24, atk: 0.26, def: 0.22, lifespan: 50, lawId: 'space', artName: '裂空断界斩' },
  },
  {
    id: 'yujian_yinguo', name: '《天机因果秘录》', type: '秘典', tier: '天', price: 56000,
    desc: '天机阁外流的一卷无字天书，唯有神识透纸方见满篇因果业火妙理。',
    technique: { grade: '天', speed: 0.25, atk: 0.24, def: 0.26, lifespan: 60, lawId: 'karma', artName: '因果业火劫' },
  },
  {
    id: 'yujian_xuesha', name: '《修罗战天录》', type: '秘典', tier: '天', price: 48000,
    desc: '北荒古战场出土的血纹骨简，录有修罗一脉以战养战、杀意焚天的绝学。',
    technique: { grade: '天', speed: 0.28, atk: 0.36, def: 0.12, lifespan: 15, lawId: 'blood', artName: '血狱修罗破' },
  },
  {
    id: 'yujian_hundun', name: '《混沌太初仙典》', type: '秘典', tier: '仙', price: 280000,
    desc: '昆仑深渊重见天日的先天玉璧拓本，字字皆蕴开天辟地之象，万法归宗。',
    technique: { grade: '仙', speed: 0.36, atk: 0.44, def: 0.36, lifespan: 120, lawId: 'chaos', artName: '太初混沌开天斩' },
  },
];

export const ITEM_BY_ID = Object.fromEntries(ITEMS.map((i) => [i.id, i]));

export function itemName(id) {
  return ITEM_BY_ID[id]?.name || id;
}
