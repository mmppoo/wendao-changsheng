/**
 * 宗门深度内容（v4.0）：覆盖全部 13 宗门的藏经阁功法、宗门宝库、三阶任务堂与晋升试炼。
 * 所有 itemId 严格对应 items.js，enemy 严格对应 enemies.js，lawId 严格对应 realms.js。
 */

export const SECT_LIBRARIES = {
  taixuan: [
    {
      id: 'tx_lib_1', name: '《青锋养剑诀》', minRank: 0, cost: 180,
      speed: 0.08, atk: 0.1, def: 0.02, lifespan: 0, lawId: 'sword', artName: '青锋破空斩',
      desc: '外门基础剑诀，以灵力温养剑意，出剑凌厉三分。',
    },
    {
      id: 'tx_lib_2', name: '《流光七星剑》', minRank: 1, cost: 850,
      speed: 0.14, atk: 0.2, def: 0.05, lifespan: 10, lawId: 'sword', artName: '七星分光剑阵',
      desc: '内门剑修必修，一剑化七芒，攻守兼备。',
    },
    {
      id: 'tx_lib_3', name: '《太玄真剑经》', minRank: 2, cost: 2800,
      speed: 0.22, atk: 0.34, def: 0.08, lifespan: 30, lawId: 'sword', artName: '太玄一剑断山河',
      desc: '真传镇峰剑典，剑心通明，斩破诸般护体神通。',
    },
    {
      id: 'tx_lib_4', name: '《太虚斩道剑》', minRank: 4, cost: 12000,
      speed: 0.32, atk: 0.5, def: 0.14, lifespan: 80, lawId: 'sword', artName: '太虚斩天剑意',
      desc: '太玄历代剑尊感悟凝成的无上剑经，一剑出而法则震颤。',
    },
  ],
  qingyun: [
    {
      id: 'qy_lib_1', name: '《青云引灵诀》', minRank: 0, cost: 160,
      speed: 0.1, atk: 0.05, def: 0.06, lifespan: 8, lawId: 'thunder', artName: '青云御风诀',
      desc: '中正平和的正道筑基心法，行气稳健不易生心魔。',
    },
    {
      id: 'qy_lib_2', name: '《玉清神雷诀》', minRank: 1, cost: 800,
      speed: 0.16, atk: 0.16, def: 0.1, lifespan: 18, lawId: 'thunder', artName: '玉清落雷印',
      desc: '引九天清雷诛邪，对邪魔外道威势倍增。',
    },
    {
      id: 'qy_lib_3', name: '《太清通天录》', minRank: 2, cost: 2600,
      speed: 0.24, atk: 0.24, def: 0.18, lifespan: 45, lawId: 'thunder', artName: '通天紫霄雷',
      desc: '通天峰不传之秘，灵力绵长如海，可引紫霄神雷护体。',
    },
    {
      id: 'qy_lib_4', name: '《上清混元真经》', minRank: 4, cost: 11500,
      speed: 0.35, atk: 0.36, def: 0.28, lifespan: 110, lawId: 'chaos', artName: '混元青莲劫',
      desc: '青云祖师羽化前留下的终极传承，万法归元。',
    },
  ],
  danxia: [
    {
      id: 'dx_lib_1', name: '《百草控火诀》', minRank: 0, cost: 150,
      speed: 0.08, atk: 0.04, def: 0.05, lifespan: 15, lawId: 'pill', artName: '丹火焚邪掌',
      desc: '外门炼丹基础控火术，既稳炉火，亦可温养寿元。',
    },
    {
      id: 'dx_lib_2', name: '《赤霞灵焰经》', minRank: 1, cost: 780,
      speed: 0.15, atk: 0.14, def: 0.08, lifespan: 30, lawId: 'pill', artName: '赤霞九火罩',
      desc: '化丹火为真焰，炼丹成丹率大增，斗法亦能焚敌护体。',
    },
    {
      id: 'dx_lib_3', name: '《九转造化丹典》', minRank: 2, cost: 2500,
      speed: 0.22, atk: 0.2, def: 0.16, lifespan: 65, lawId: 'pill', artName: '造化生生印',
      desc: '以天地为丹炉，服丹药效倍增，生机绵延不绝。',
    },
    {
      id: 'dx_lib_4', name: '《太一长生药经》', minRank: 4, cost: 11000,
      speed: 0.3, atk: 0.3, def: 0.25, lifespan: 180, lawId: 'pill', artName: '太一净世真火',
      desc: '丹霞谷镇谷仙卷，传闻修至极境可以肉身成丹、寿比天地。',
    },
  ],
  tianyin: [
    {
      id: 'ty_lib_1', name: '《金刚伏魔咒》', minRank: 0, cost: 160,
      speed: 0.07, atk: 0.06, def: 0.12, lifespan: 10, lawId: 'karma', artName: '金刚狮子吼',
      desc: '护持心神、强健体魄，令邪祟不敢近身。',
    },
    {
      id: 'ty_lib_2', name: '《梵钟镇魂经》', minRank: 1, cost: 820,
      speed: 0.13, atk: 0.14, def: 0.2, lifespan: 25, lawId: 'karma', artName: '大梵镇魔钟',
      desc: '观想梵钟入识海，神魂稳如磐石，音律震碎敌方灵脉。',
    },
    {
      id: 'ty_lib_3', name: '《大日如来印》', minRank: 2, cost: 2700,
      speed: 0.2, atk: 0.26, def: 0.28, lifespan: 55, lawId: 'karma', artName: '大日破妄金身',
      desc: '佛光普照，万魔退避，因果业火难伤分毫。',
    },
    {
      id: 'ty_lib_4', name: '《大音希声真谛》', minRank: 4, cost: 12000,
      speed: 0.3, atk: 0.38, def: 0.42, lifespan: 140, lawId: 'karma', artName: '无相佛国降世',
      desc: '无声胜有声，一念度化因果，成就金刚不坏之躯。',
    },
  ],
  wanxiang: [
    {
      id: 'wx_lib_1', name: '《浩然墨阵篇》', minRank: 0, cost: 170,
      speed: 0.1, atk: 0.06, def: 0.08, lifespan: 5, lawId: 'array', artName: '墨笔定身阵',
      desc: '以灵墨书阵，落笔成纹，困敌于方寸之间。',
    },
    {
      id: 'wx_lib_2', name: '《周天八卦阵图》', minRank: 1, cost: 860,
      speed: 0.16, atk: 0.16, def: 0.16, lifespan: 15, lawId: 'array', artName: '八卦锁灵杀阵',
      desc: '借天地八方灵气布阵，攻守转换妙到毫巅。',
    },
    {
      id: 'wx_lib_3', name: '《星河推演策》', minRank: 2, cost: 2800,
      speed: 0.25, atk: 0.26, def: 0.22, lifespan: 40, lawId: 'star', artName: '周天星斗大阵',
      desc: '观星台秘传，引九天星力入阵，推演敌手破绽于瞬息。',
    },
    {
      id: 'wx_lib_4', name: '《万象乾坤圣卷》', minRank: 4, cost: 12500,
      speed: 0.36, atk: 0.4, def: 0.36, lifespan: 100, lawId: 'array', artName: '乾坤无极书海',
      desc: '一字成界，万法随言出法随，乃是儒阵双修极巅。',
    },
  ],
  hanshan: [
    {
      id: 'hs_lib_1', name: '《寒潭照心诀》', minRank: 0, cost: 160,
      speed: 0.09, atk: 0.05, def: 0.09, lifespan: 18, lawId: 'time', artName: '寒霜凝气指',
      desc: '观寒潭止水而悟静定，息躁安神，延年益寿。',
    },
    {
      id: 'hs_lib_2', name: '《玄冰太素经》', minRank: 1, cost: 820,
      speed: 0.16, atk: 0.15, def: 0.18, lifespan: 40, lawId: 'time', artName: '太素冰封领域',
      desc: '玄冰之气冻结周身灵机，亦能令岁华流逝为之放缓。',
    },
    {
      id: 'hs_lib_3', name: '《坐忘春秋卷》', minRank: 2, cost: 2700,
      speed: 0.24, atk: 0.24, def: 0.25, lifespan: 90, lawId: 'time', artName: '一念枯荣剑气',
      desc: '无灯观核心道藏，于寂静黑暗中窥见光阴长河。',
    },
    {
      id: 'hs_lib_4', name: '《太上忘情真经》', minRank: 4, cost: 12000,
      speed: 0.34, atk: 0.38, def: 0.38, lifespan: 200, lawId: 'time', artName: '光阴静止之瞳',
      desc: '超脱尘念，与天地同寿，一念可令强敌神通停滞。',
    },
  ],
  wanbao: [
    {
      id: 'wb_lib_1', name: '《点石成金诀》', minRank: 0, cost: 160,
      speed: 0.09, atk: 0.07, def: 0.06, lifespan: 5, lawId: 'space', artName: '落宝金光手',
      desc: '以灵石布微型聚灵阵助修，兼能辨识天下法宝破绽。',
    },
    {
      id: 'wb_lib_2', name: '《多宝御器录》', minRank: 1, cost: 840,
      speed: 0.15, atk: 0.18, def: 0.14, lifespan: 15, lawId: 'space', artName: '百宝星雨轰',
      desc: '同时催动数件法器齐发，以财力碾压同阶劲敌。',
    },
    {
      id: 'wb_lib_3', name: '《须弥纳界诀》', minRank: 2, cost: 2700,
      speed: 0.23, atk: 0.26, def: 0.22, lifespan: 40, lawId: 'space', artName: '须弥袖里乾坤',
      desc: '参悟空间挪移妙法，既可随身藏宝，亦能折空间伤敌。',
    },
    {
      id: 'wb_lib_4', name: '《天机通宝仙典》', minRank: 4, cost: 12000,
      speed: 0.34, atk: 0.4, def: 0.32, lifespan: 100, lawId: 'space', artName: '万界聚宝大阵',
      desc: '万宝阁总舵密藏，通晓商道与空间法则，举手引动界域宝光。',
    },
  ],
  wanshou: [
    {
      id: 'ws_lib_1', name: '《百兽淬体功》', minRank: 0, cost: 160,
      speed: 0.08, atk: 0.09, def: 0.08, lifespan: 12, lawId: 'blood', artName: '苍狼裂山爪',
      desc: '观摩妖兽搏杀之态锤炼筋骨，气血浑厚。',
    },
    {
      id: 'ws_lib_2', name: '《灵犀御兽经》', minRank: 1, cost: 820,
      speed: 0.14, atk: 0.18, def: 0.16, lifespan: 28, lawId: 'blood', artName: '百兽奔腾啸',
      desc: '与伴生灵兽心神相连，借妖族血脉之力增幅自身战力。',
    },
    {
      id: 'ws_lib_3', name: '《真龙化形诀》', minRank: 2, cost: 2700,
      speed: 0.22, atk: 0.3, def: 0.26, lifespan: 65, lawId: 'blood', artName: '太古龙象镇狱',
      desc: '汲取太古神兽真意，一拳一脚皆具崩山裂岳之威。',
    },
    {
      id: 'ws_lib_4', name: '《洪荒万妖圣典》', minRank: 4, cost: 12000,
      speed: 0.32, atk: 0.45, def: 0.38, lifespan: 160, lawId: 'chaos', artName: '洪荒祖兽法相',
      desc: '万兽山开山妖圣遗经，化身洪荒法相，号令天下群妖。',
    },
  ],
  jiguan: [
    {
      id: 'jg_lib_1', name: '《墨家机巧录》', minRank: 0, cost: 160,
      speed: 0.08, atk: 0.08, def: 0.1, lifespan: 5, lawId: 'array', artName: '连珠破甲弩',
      desc: '精研符文齿轮与傀儡构造，以器补道。',
    },
    {
      id: 'jg_lib_2', name: '《千机傀儡典》', minRank: 1, cost: 840,
      speed: 0.15, atk: 0.18, def: 0.2, lifespan: 20, lawId: 'array', artName: '千机战傀齐鸣',
      desc: '炼制灵核战傀随行护法，铁壁难摧。',
    },
    {
      id: 'jg_lib_3', name: '《天工神兵谱》', minRank: 2, cost: 2800,
      speed: 0.22, atk: 0.3, def: 0.28, lifespan: 45, lawId: 'star', artName: '天工星陨炮',
      desc: '以星辰砂与法则铭文炼器，本命法宝威能倍增。',
    },
    {
      id: 'jg_lib_4', name: '《造物巨城真图》', minRank: 4, cost: 12500,
      speed: 0.32, atk: 0.44, def: 0.42, lifespan: 110, lawId: 'array', artName: '九层机关天城降临',
      desc: '机关城主三百年未现世的终极蓝图，可化洞府为灭世战争堡垒。',
    },
  ],
  xuemo: [
    {
      id: 'xm_lib_1', name: '《燃血化灵诀》', minRank: 0, cost: 170,
      speed: 0.14, atk: 0.12, def: 0.02, lifespan: -5, lawId: 'blood', artName: '猩红裂血斩',
      desc: '魔门速成之法，以气血催动暴烈灵力，攻伐无双。',
    },
    {
      id: 'xm_lib_2', name: '《血河吞天经》', minRank: 1, cost: 860,
      speed: 0.22, atk: 0.24, def: 0.08, lifespan: 10, lawId: 'blood', artName: '血河滔天浪',
      desc: '以战养战，掠夺敌手精气反哺己身。',
    },
    {
      id: 'xm_lib_3', name: '《修罗血海真经》', minRank: 2, cost: 2900,
      speed: 0.32, atk: 0.38, def: 0.14, lifespan: 30, lawId: 'blood', artName: '修罗血狱降世',
      desc: '血魔宗镇宗魔典，化丹田为无边血海，血海不枯则身不灭。',
    },
    {
      id: 'xm_lib_4', name: '《冥河不灭血神经》', minRank: 4, cost: 12500,
      speed: 0.44, atk: 0.56, def: 0.24, lifespan: 90, lawId: 'blood', artName: '亿万血神子噬天',
      desc: '血魔老祖证道之法，滴血重生，一怒令千里山河化作赤海。',
    },
  ],
  hehuan: [
    {
      id: 'hh_lib_1', name: '《红尘魅影诀》', minRank: 0, cost: 160,
      speed: 0.11, atk: 0.07, def: 0.06, lifespan: 12, lawId: 'karma', artName: '迷心红绫缚',
      desc: '吐纳阴阳和合之气，身法缥缈，令人神魂摇曳。',
    },
    {
      id: 'hh_lib_2', name: '《阴阳双修宝录》', minRank: 1, cost: 840,
      speed: 0.19, atk: 0.16, def: 0.12, lifespan: 35, lawId: 'karma', artName: '红尘情丝斩',
      desc: '采阴补阳、以情入道，修为进境远超寻常正道。',
    },
    {
      id: 'hh_lib_3', name: '《天魔妙音经》', minRank: 2, cost: 2700,
      speed: 0.28, atk: 0.28, def: 0.18, lifespan: 70, lawId: 'karma', artName: '天魔幻心大法',
      desc: '直指敌手道心破绽，于无声处惑乱元婴神魂。',
    },
    {
      id: 'hh_lib_4', name: '《极乐无上真情典》', minRank: 4, cost: 12000,
      speed: 0.38, atk: 0.42, def: 0.28, lifespan: 160, lawId: 'karma', artName: '红尘因果万劫丝',
      desc: '由情入道，终至无情而有情，执掌众生爱恨因果线。',
    },
  ],
  youming: [
    {
      id: 'ym_lib_1', name: '《黄泉引魂诀》', minRank: 0, cost: 160,
      speed: 0.1, atk: 0.09, def: 0.05, lifespan: 8, lawId: 'space', artName: '阴风锁魂链',
      desc: '采九幽阴气淬炼神识，驱使阴魂助战。',
    },
    {
      id: 'ym_lib_2', name: '《百鬼夜行图》', minRank: 1, cost: 850,
      speed: 0.17, atk: 0.2, def: 0.12, lifespan: 25, lawId: 'space', artName: '百鬼噬灵潮',
      desc: '神识分化百道鬼影，令敌手防不胜防。',
    },
    {
      id: 'ym_lib_3', name: '《十殿阎罗经》', minRank: 2, cost: 2800,
      speed: 0.26, atk: 0.32, def: 0.2, lifespan: 55, lawId: 'time', artName: '生死簿勾魂印',
      desc: '以黄泉之力执掌生死轮回，神识攻伐直碎元婴。',
    },
    {
      id: 'ym_lib_4', name: '《九幽轮回大道卷》', minRank: 4, cost: 12200,
      speed: 0.36, atk: 0.46, def: 0.32, lifespan: 140, lawId: 'time', artName: '六道轮回寂灭盘',
      desc: '幽冥祖师于黄泉尽头悟得，一念开轮回，吞没万法。',
    },
  ],
  sanxiu: [
    {
      id: 'sx_lib_1', name: '《野狐吐纳杂录》', minRank: 0, cost: 140,
      speed: 0.08, atk: 0.07, def: 0.07, lifespan: 8, lawId: 'space', artName: '草莽搏命斩',
      desc: '前辈散修拼凑出的保命法门，招式刁钻实用。',
    },
    {
      id: 'sx_lib_2', name: '《逍遥游云诀》', minRank: 1, cost: 780,
      speed: 0.15, atk: 0.16, def: 0.15, lifespan: 25, lawId: 'space', artName: '流云断水步',
      desc: '散修联盟流传的轻身与斗法绝学，进可攻退可走。',
    },
    {
      id: 'sx_lib_3', name: '《百家问道集》', minRank: 2, cost: 2500,
      speed: 0.24, atk: 0.28, def: 0.22, lifespan: 55, lawId: 'chaos', artName: '百家合流破法式',
      desc: '兼采正魔各派之长，不拘一格，专为无门无派者所创。',
    },
    {
      id: 'sx_lib_4', name: '《红尘独尊仙经》', minRank: 4, cost: 11000,
      speed: 0.36, atk: 0.44, def: 0.34, lifespan: 130, lawId: 'chaos', artName: '自在天地一指',
      desc: '无师自通、独步九州的散修传奇所留，天地为炉，万法为师。',
    },
  ],
};

export const SECT_TREASURY = {
  taixuan: [
    { itemId: 'qingfeng_jian', minRank: 0, cost: 180, note: '外门制式青锋，锋芒内敛' },
    { itemId: 'zhuji_dan', minRank: 0, cost: 420, note: '助外门剑修稳固筑基' },
    { itemId: 'jiejin_dan', minRank: 1, cost: 1400, note: '内门结丹配额灵丹' },
    { itemId: 'leimu', minRank: 1, cost: 620, note: '祭炼本命飞剑的雷纹灵木' },
    { itemId: 'huaying_dan', minRank: 2, cost: 4800, note: '真传弟子破境元婴赐药' },
    { itemId: 'faze_canpian', minRank: 4, cost: 11000, note: '问剑峰剑冢孕育的大道残片' },
  ],
  qingyun: [
    { itemId: 'liaoshang_dan', minRank: 0, cost: 60, note: '下山除妖常备疗伤灵丹' },
    { itemId: 'qingxin_dan', minRank: 0, cost: 280, note: '澄净道心，驱除心魔' },
    { itemId: 'zhuji_dan', minRank: 0, cost: 400, note: '正道精炼上品筑基丹' },
    { itemId: 'jiejin_dan', minRank: 1, cost: 1350, note: '青云内门结丹赐药' },
    { itemId: 'huashen_dan', minRank: 3, cost: 8500, note: '通天峰珍藏化神灵丹' },
    { itemId: 'tianjie_dan', minRank: 4, cost: 18000, note: '掌门私库镇压雷劫底牌' },
  ],
  danxia: [
    { itemId: 'lingcao', minRank: 0, cost: 35, note: '百草园日产百年灵草' },
    { itemId: 'qiannian_lingcao', minRank: 1, cost: 220, note: '丹霞谷内苑千年药王' },
    { itemId: 'juling_dan', minRank: 0, cost: 240, note: '宗门自炼聚灵丹，价格极优' },
    { itemId: 'dahuan_dan', minRank: 1, cost: 950, note: '丹霞秘制救命大还丹' },
    { itemId: 'xisui_dan', minRank: 2, cost: 1600, note: '洗髓易筋的绝品丹丸' },
    { itemId: 'jiuzhuan_dan', minRank: 4, cost: 13000, note: '丹霞镇谷之宝九转金丹' },
  ],
  tianyin: [
    { itemId: 'qingxin_dan', minRank: 0, cost: 220, note: '梵钟香火熏炼的清心禅丹' },
    { itemId: 'huxin_fu', minRank: 0, cost: 240, note: '高僧开光护心金符' },
    { itemId: 'dahuan_dan', minRank: 1, cost: 1100, note: '佛门大还妙药' },
    { itemId: 'huaying_dan', minRank: 2, cost: 4600, note: '助护法罗汉稳凝元婴' },
    { itemId: 'dao_fruit', minRank: 4, cost: 16000, note: '菩提古树结出的悟道灵果' },
  ],
  wanxiang: [
    { itemId: 'huiling_dan', minRank: 0, cost: 65, note: '布阵耗灵时的常备回灵丹' },
    { itemId: 'shenxing_fu', minRank: 0, cost: 50, note: '书院符阵堂精绘神行符' },
    { itemId: 'xingchen_sha', minRank: 1, cost: 1400, note: '观星台收集的布阵星砂' },
    { itemId: 'huashen_dan', minRank: 2, cost: 7800, note: '先生赐予真传的化神宝丹' },
    { itemId: 'faze_canpian', minRank: 3, cost: 10500, note: '万象碑拓印的大道残片' },
    { itemId: 'xukong_jing', minRank: 4, cost: 15000, note: '推演虚空大阵的核心灵晶' },
  ],
  hanshan: [
    { itemId: 'qingxin_dan', minRank: 0, cost: 240, note: '寒山静心丸，涤荡尘念' },
    { itemId: 'zhuji_dan', minRank: 0, cost: 420, note: '冰泉熬炼的上佳筑基丹' },
    { itemId: 'jiejin_dan', minRank: 1, cost: 1400, note: '无灯观珍藏结金丹' },
    { itemId: 'yuanying_dan', minRank: 2, cost: 5600, note: '闭关百年所需的元婴精丹' },
    { itemId: 'tiandao_lotus', minRank: 4, cost: 22000, note: '寒山冰池孕育的绝世天道莲' },
  ],
  wanbao: [
    { itemId: 'shenxing_fu', minRank: 0, cost: 45, note: '商队标配逃生神行符' },
    { itemId: 'huxin_fu', minRank: 0, cost: 230, note: '押镖保命护心符' },
    { itemId: 'xuantie', minRank: 0, cost: 120, note: '万宝阁批量收购的玄铁' },
    { itemId: 'pozhang_dan', minRank: 1, cost: 650, note: '坊市抢手的破障灵丹' },
    { itemId: 'xisui_dan', minRank: 2, cost: 1700, note: '拍卖行内部折价洗髓丹' },
    { itemId: 'xianling_dan', minRank: 4, cost: 20000, note: '三十六号秘库压箱仙灵丹' },
  ],
  wanshou: [
    { itemId: 'liaoshang_dan', minRank: 0, cost: 55, note: '御兽厮杀必备外伤丹' },
    { itemId: 'qiannian_lingcao', minRank: 1, cost: 250, note: '百兽谷深处采得的灵药' },
    { itemId: 'juling_dan', minRank: 1, cost: 280, note: '妖丹辅炼的聚灵丹' },
    { itemId: 'longxue_jing', minRank: 2, cost: 6800, note: '万兽山镇山龙血真精' },
    { itemId: 'huaying_dan', minRank: 2, cost: 4900, note: '真传长老配额化婴丹' },
    { itemId: 'dao_fruit', minRank: 4, cost: 16500, note: '妖圣遗留的洪荒悟道果' },
  ],
  jiguan: [
    { itemId: 'xuantie', minRank: 0, cost: 100, note: '机关城矿脉精炼玄铁' },
    { itemId: 'leimu', minRank: 1, cost: 580, note: '制作雷傀儡的高阶雷击木' },
    { itemId: 'xingchen_sha', minRank: 1, cost: 1300, note: '核心炉坊精粹星辰砂' },
    { itemId: 'huxin_fu', minRank: 0, cost: 240, note: '机关护盾玉符' },
    { itemId: 'xukong_jing', minRank: 3, cost: 13500, note: '驱动机关城挪移的虚空晶' },
    { itemId: 'faze_canpian', minRank: 4, cost: 11500, note: '古天工铭刻的阵器法则碎片' },
  ],
  xuemo: [
    { itemId: 'yinqi_dan', minRank: 0, cost: 25, note: '血池副产的猛烈引气丹' },
    { itemId: 'pozhang_dan', minRank: 0, cost: 580, note: '魔宗最偏爱的强行破障丹' },
    { itemId: 'dahuan_dan', minRank: 1, cost: 1050, note: '以血精炼制的救命大还丹' },
    { itemId: 'longxue_jing', minRank: 2, cost: 6400, note: '淬炼魔体的太古龙血精' },
    { itemId: 'yuanying_dan', minRank: 2, cost: 5200, note: '魔渊掠夺来的高阶元婴丹' },
    { itemId: 'tianjie_dan', minRank: 4, cost: 17500, note: '逆天硬抗雷劫的禁忌魔丹' },
  ],
  hehuan: [
    { itemId: 'huiling_dan', minRank: 0, cost: 60, note: '双修调息所需的回灵丹' },
    { itemId: 'zhuji_dan', minRank: 0, cost: 430, note: '以情花辅炼的筑基丹' },
    { itemId: 'xisui_dan', minRank: 1, cost: 1750, note: '驻颜易骨的洗髓灵丹' },
    { itemId: 'jiejin_dan', minRank: 1, cost: 1380, note: '内门仙子/圣子专供结金丹' },
    { itemId: 'huashen_dan', minRank: 3, cost: 8200, note: '合欢密库珍藏化神丹' },
    { itemId: 'jiuzhuan_dan', minRank: 4, cost: 14000, note: '青春永驻、续命三百载的金丹' },
  ],
  youming: [
    { itemId: 'qingxin_dan', minRank: 0, cost: 260, note: '防阴气反噬的定魂清心丹' },
    { itemId: 'huxin_fu', minRank: 0, cost: 250, note: '替死镇魂的阴司护心符' },
    { itemId: 'pozhang_dan', minRank: 1, cost: 680, note: '强冲鬼道瓶颈的破障丹' },
    { itemId: 'huaying_dan', minRank: 2, cost: 4700, note: '凝聚幽冥鬼婴的化婴丹' },
    { itemId: 'xukong_jing', minRank: 3, cost: 14000, note: '沟通阴阳两界的虚空晶' },
    { itemId: 'xianling_dan', minRank: 4, cost: 19500, note: '黄泉彼岸偶得的逆命仙丹' },
  ],
  sanxiu: [
    { itemId: 'liaoshang_dan', minRank: 0, cost: 60, note: '散修互助堂平价疗伤丹' },
    { itemId: 'shenxing_fu', minRank: 0, cost: 45, note: '跑路保命第一神器' },
    { itemId: 'zhuji_dan', minRank: 1, cost: 460, note: '散修联盟凑份子换来的筑基丹' },
    { itemId: 'jiejin_dan', minRank: 2, cost: 1500, note: '黑市渠道淘来的结金丹' },
    { itemId: 'dahuan_dan', minRank: 2, cost: 1150, note: '独行万里必备大还丹' },
    { itemId: 'faze_canpian', minRank: 4, cost: 12000, note: '古战场遗落的法则残片' },
  ],
};

export const SECT_MISSIONS = {
  taixuan: [
    {
      id: 'tx_m1', tier: '外门差事', title: '巡守剑冢外围', minRank: 0, minRealm: 0,
      months: 3, contribution: 90, stones: 80, reputation: 6, enemy: 'rogue',
      desc: '驱逐企图偷盗古剑残铁的散修与邪修，顺便感应剑冢余威。',
    },
    {
      id: 'tx_m2', tier: '内门悬赏', title: '追缉叛门剑徒', minRank: 1, minRealm: 1,
      months: 6, contribution: 340, stones: 420, reputation: 25, enemy: 'cultivator',
      desc: '一名外逃弟子窃走剑谱遁入妖森，将其擒回或就地正法。',
    },
    {
      id: 'tx_m3', tier: '真传密令', title: '镇压剑冢躁动古灵', minRank: 2, minRealm: 3,
      months: 9, contribution: 1250, stones: 2400, reputation: 80, enemy: 'sword_phantom',
      desc: '深层剑冢古意暴走，需真传以上剑修入阵以剑压剑。',
    },
  ],
  qingyun: [
    {
      id: 'qy_m1', tier: '外门差事', title: '青牛山麓除妖安民', minRank: 0, minRealm: 0,
      months: 3, contribution: 85, stones: 75, reputation: 10, enemy: 'wolf',
      desc: '下山清剿作祟凡人村落的妖狼，扬我青云正道清名。',
    },
    {
      id: 'qy_m2', tier: '内门悬赏', title: '清剿苍茫妖森邪坛', minRank: 1, minRealm: 2,
      months: 6, contribution: 380, stones: 480, reputation: 35, enemy: 'blood_cult',
      desc: '血魔宗暗桩在山外设坛掠夺凡人精血，奉掌门令连根拔除。',
    },
    {
      id: 'qy_m3', tier: '真传密令', title: '北荒前线截杀妖将', minRank: 2, minRealm: 3,
      months: 9, contribution: 1300, stones: 2500, reputation: 95, enemy: 'demon_general',
      desc: '兽潮南侵，随正道盟约驰援北荒防线，阵斩领军妖将。',
    },
  ],
  danxia: [
    {
      id: 'dx_m1', tier: '外门差事', title: '看守三昧药炉', minRank: 0, minRealm: 0,
      months: 3, contribution: 90, stones: 110, reputation: 5, enemy: null,
      desc: '昼夜照看丹房地火，调和药性，严防灵草焦毁。',
    },
    {
      id: 'dx_m2', tier: '内门悬赏', title: '毒沼采摘千年灵药', minRank: 1, minRealm: 1,
      months: 6, contribution: 350, stones: 520, reputation: 20, enemy: 'poison_python',
      desc: '深入妖森毒瘴采摘罕见灵草，须防守护药田的碧磷毒蟒。',
    },
    {
      id: 'dx_m3', tier: '真传密令', title: '归墟猎取太古龙涎', minRank: 2, minRealm: 3,
      months: 9, contribution: 1280, stones: 2800, reputation: 75, enemy: 'abyss_leviathan',
      desc: '炼制九转仙丹缺一味海眼奇珍，需赴归墟与深渊巨兽周旋。',
    },
  ],
  tianyin: [
    {
      id: 'ty_m1', tier: '外门差事', title: '乱葬岗超度怨灵', minRank: 0, minRealm: 1,
      months: 3, contribution: 100, stones: 70, reputation: 15, enemy: 'ghost',
      desc: '敲响木鱼诵念往生经，镇压执念不散的凶戾怨魂。',
    },
    {
      id: 'ty_m2', tier: '内门悬赏', title: '封印古刹血魔祭坛', minRank: 1, minRealm: 2,
      months: 6, contribution: 370, stones: 420, reputation: 40, enemy: 'blood_cult',
      desc: '废寺沦为魔窟，携梵钟分影前往镇魔净化。',
    },
    {
      id: 'ty_m3', tier: '真传密令', title: '九幽渡口镇压鬼王', minRank: 2, minRealm: 3,
      months: 9, contribution: 1320, stones: 2200, reputation: 105, enemy: 'ghost_king',
      desc: '鬼门裂隙大开，降服作乱一方的元婴鬼王，功德无量。',
    },
  ],
  wanxiang: [
    {
      id: 'wx_m1', tier: '外门差事', title: '校勘藏经阁阵图残卷', minRank: 0, minRealm: 0,
      months: 3, contribution: 88, stones: 85, reputation: 8, enemy: null,
      desc: '修补古籍中失传的灵纹节点，顺带磨砺神识与悟性。',
    },
    {
      id: 'wx_m2', tier: '内门悬赏', title: '破解东海古修遗阵', minRank: 1, minRealm: 2,
      months: 6, contribution: 380, stones: 520, reputation: 30, enemy: 'ancient_puppet',
      desc: '勘测归墟边缘现世的古修遗址，摧毁失控的守阵傀儡。',
    },
    {
      id: 'wx_m3', tier: '真传密令', title: '修补中州域外裂隙', minRank: 2, minRealm: 5,
      months: 12, contribution: 1850, stones: 5500, reputation: 120, enemy: 'void_fiend',
      desc: '天象异变，界壁松动，率阵堂弟子封堵裂隙并斩杀虚空魔。',
    },
  ],
  hanshan: [
    {
      id: 'hs_m1', tier: '外门差事', title: '寒山夜巡驱邪', minRank: 0, minRealm: 0,
      months: 3, contribution: 85, stones: 75, reputation: 9, enemy: 'bandit',
      desc: '熄灯夜行三十里，清扫潜入寒山脚下劫掠山民的宵小。',
    },
    {
      id: 'hs_m2', tier: '内门悬赏', title: '冰谷镇封古怨魂', minRank: 1, minRealm: 1,
      months: 6, contribution: 340, stones: 410, reputation: 26, enemy: 'ghost',
      desc: '雪崩冲开前朝古墓，需以寒山玄冰诀重塑镇魂禁制。',
    },
    {
      id: 'hs_m3', tier: '真传密令', title: '孤身迎击北荒妖王', minRank: 2, minRealm: 4,
      months: 12, contribution: 1550, stones: 3600, reputation: 110, enemy: 'demon_king',
      desc: '大妖窥伺寒山灵脉，奉观主法旨于无灯雪原独挡强敌。',
    },
  ],
  wanbao: [
    {
      id: 'wb_m1', tier: '外门差事', title: '落霞商队武装押运', minRank: 0, minRealm: 0,
      months: 3, contribution: 95, stones: 180, reputation: 6, enemy: 'bandit',
      desc: '护送满载灵材的车队穿越青牛古道，击退拦路劫修。',
    },
    {
      id: 'wb_m2', tier: '内门悬赏', title: '东海航路清剿夜叉', minRank: 1, minRealm: 2,
      months: 6, contribution: 390, stones: 950, reputation: 28, enemy: 'sea_yaksha',
      desc: '深海夜叉频频截胡万宝阁灵船，打通东海商路重奖灵石。',
    },
    {
      id: 'wb_m3', tier: '真传密令', title: '讨回血海长老欠债', minRank: 2, minRealm: 3,
      months: 9, contribution: 1350, stones: 4200, reputation: 85, enemy: 'blood_elder',
      desc: '血魔宗长老赊走天阶灵宝拒不偿还——万宝阁的账，从来只认血或钱。',
    },
  ],
  wanshou: [
    {
      id: 'ws_m1', tier: '外门差事', title: '安抚百兽谷狂躁妖猪', minRank: 0, minRealm: 1,
      months: 3, contribution: 100, stones: 100, reputation: 8, enemy: 'beast',
      desc: '灵兽园外围铁甲妖猪发狂冲撞阵法，将其制服。',
    },
    {
      id: 'ws_m2', tier: '内门悬赏', title: '收服妖森通臂灵猿', minRank: 1, minRealm: 1,
      months: 6, contribution: 350, stones: 460, reputation: 24, enemy: 'spirit_ape',
      desc: '深入苍茫妖森试探异种通臂灵猿，以武会兽赢取敬畏。',
    },
    {
      id: 'ws_m3', tier: '真传密令', title: '昆仑墟界狩猎混沌遗种', minRank: 2, minRealm: 6,
      months: 12, contribution: 2400, stones: 9500, reputation: 150, enemy: 'chaos_beast',
      desc: '宗门欲采太古混沌兽真血以育镇山圣兽，唯顶尖大能可接此令。',
    },
  ],
  jiguan: [
    {
      id: 'jg_m1', tier: '外门差事', title: '检修九层传动灵枢', minRank: 0, minRealm: 0,
      months: 3, contribution: 92, stones: 105, reputation: 6, enemy: null,
      desc: '深入城底齿轮群清理积尘、替换耗尽灵力的玄铁轴承。',
    },
    {
      id: 'jg_m2', tier: '内门悬赏', title: '镇压暴走古修战傀', minRank: 1, minRealm: 2,
      months: 6, contribution: 390, stones: 600, reputation: 30, enemy: 'ancient_puppet',
      desc: '第七层试炼场一尊古傀儡灵核失控，速去拆解回收核心。',
    },
    {
      id: 'jg_m3', tier: '真传密令', title: '夺取古仙遗蜕炼器图谱', minRank: 2, minRealm: 7,
      months: 12, contribution: 2800, stones: 12000, reputation: 160, enemy: 'ancient_corpse',
      desc: '城主密诏：于昆仑深处截获一具古仙尸傀，研究其不朽炼体法阵。',
    },
  ],
  xuemo: [
    {
      id: 'xm_m1', tier: '外门差事', title: '血池外围猎杀散修', minRank: 0, minRealm: 0,
      months: 3, contribution: 105, stones: 110, reputation: -8, enemy: 'bandit',
      desc: '弱肉强食是血魔宗铁律，提着对手的储物袋回来领赏。',
    },
    {
      id: 'xm_m2', tier: '内门悬赏', title: '伏击正道金丹巡山使', minRank: 1, minRealm: 2,
      months: 6, contribution: 420, stones: 680, reputation: -25, enemy: 'jindan_elder',
      desc: '正道联盟金丹长老单骑探察北荒，设伏截杀并掠其法宝。',
    },
    {
      id: 'xm_m3', tier: '真传密令', title: '血洗上界巡查使行宫', minRank: 2, minRealm: 5,
      months: 12, contribution: 1950, stones: 6200, reputation: -60, enemy: 'heaven_envoy',
      desc: '狂妄的上界巡查使竟敢勒索我血魔宗贡品，老祖命你斩其首级立威！',
    },
  ],
  hehuan: [
    {
      id: 'hh_m1', tier: '外门差事', title: '南疆密林采摘情花', minRank: 0, minRealm: 0,
      months: 3, contribution: 90, stones: 105, reputation: 4, enemy: null,
      desc: '于晨雾散尽前采摘七色情花，顺便打探途经各派弟子的动向。',
    },
    {
      id: 'hh_m2', tier: '内门悬赏', title: '色诱并擒拿宗门叛徒', minRank: 1, minRealm: 1,
      months: 6, contribution: 360, stones: 520, reputation: 15, enemy: 'cultivator',
      desc: '叛逃修士携合欢秘药投奔正道，将其神不知鬼不觉地清理干净。',
    },
    {
      id: 'hh_m3', tier: '真传密令', title: '周旋北荒并斩血海宿敌', minRank: 2, minRealm: 3,
      months: 9, contribution: 1320, stones: 2900, reputation: 45, enemy: 'blood_elder',
      desc: '血魔宗长老强抢我宗灵脉，奉宗主之命以柔克刚，斩草除根。',
    },
  ],
  youming: [
    {
      id: 'ym_m1', tier: '外门差事', title: '黄泉渡口拘捕逃魂', minRank: 0, minRealm: 1,
      months: 3, contribution: 100, stones: 95, reputation: -5, enemy: 'ghost',
      desc: '新死厉鬼不肯入渡，用锁魂链将其强行拘回鬼狱炼化。',
    },
    {
      id: 'ym_m2', tier: '内门悬赏', title: '古墓掘取阴煞玄核', minRank: 1, minRealm: 2,
      months: 6, contribution: 380, stones: 560, reputation: -15, enemy: 'ancient_puppet',
      desc: '掘开千年前大修衣冠冢，击碎守墓机关傀儡夺取镇墓冥晶。',
    },
    {
      id: 'ym_m3', tier: '真传密令', title: '镇压叛乱冥域鬼王', minRank: 2, minRealm: 3,
      months: 9, contribution: 1360, stones: 2700, reputation: 40, enemy: 'ghost_king',
      desc: '一尊元婴鬼王拥兵自重、拒纳阴司香火，将其炼入百鬼幡中。',
    },
  ],
  sanxiu: [
    {
      id: 'sx_m1', tier: '外门差事', title: '坊市悬赏清剿邪修', minRank: 0, minRealm: 0,
      months: 3, contribution: 85, stones: 120, reputation: 10, enemy: 'rogue',
      desc: '落霞城散修联盟贴出的红榜悬赏，专治残害同道的黑心邪修。',
    },
    {
      id: 'sx_m2', tier: '内门悬赏', title: '探索妖森失落洞府', minRank: 1, minRealm: 1,
      months: 6, contribution: 350, stones: 540, reputation: 25, enemy: 'poison_python',
      desc: '与几名道友合买残破地图，斩杀护洞毒蟒，平分洞府遗泽。',
    },
    {
      id: 'sx_m3', tier: '真传密令', title: '九州通缉斩杀万古老怪', minRank: 2, minRealm: 6,
      months: 12, contribution: 2500, stones: 10000, reputation: 180, enemy: 'old_monster',
      desc: '散修盟天字一号悬赏！若能斩杀为祸一方的万古老怪，从此名震九州。',
    },
  ],
};

/**
 * 宗门晋升试炼：覆盖 外门(0)→内门(1)→真传(2)→执事(3)→长老(4)→太上长老(5)。
 * contribution 门槛与 sects.js 中的 SECT_RANKS 严格对齐。
 */
export const SECT_PROMOTION_TRIALS = [
  {
    fromRank: 0,
    toRank: 1,
    rankName: '内门弟子',
    title: '外门大比 · 晋升内门',
    contribution: 500,
    minRealm: 1,
    minAttrs: { 悟性: 12 },
    checkType: 'combat',
    enemy: 'cultivator',
    desc: '踏入筑基、积攒五百宗门贡献后，须于宗门擂台击败同阶执剑考官，方得赐下内门玉牌。',
    sectFlavor: {
      taixuan: '问剑峰外门剑台之上，接住内门师兄三十六剑不败。',
      qingyun: '青云七峰会武，于虹桥之上击败守关筑基师兄。',
      danxia: '既要比斗护丹身手，亦要当场辨识七十二味灵药药性。',
      tianyin: '梵钟崖下接住罗汉堂武僧三掌，禅心不动。',
      wanxiang: '于演武墨阵中以字成兵，破去考官设下的四象阵。',
      hanshan: '无灯雪院之中迎战师兄，剑气不惊檐下残雪。',
      wanbao: '押镖模拟试炼：护住灵匣击退内门扮作的筑基劫修。',
      wanshou: '独身入百兽谷斗兽场，击败受契驭兽的内门考官。',
      jiguan: '操纵自制灵器迎战内门机关师，三炷香内破其护甲。',
      xuemo: '血池擂台无规则死斗，赢者晋升内门，败者沦为血食。',
      hehuan: '红绫擂台斗法，既试灵力亦试心境，败敌而不伤和气。',
      youming: '黄泉渡口斗魂试炼，以神识压垮守关鬼修。',
      sanxiu: '散修联盟资格战：在落霞城外击败同境悬赏考官，获颁银牌客卿令。',
    },
  },
  {
    fromRank: 1,
    toRank: 2,
    rankName: '真传弟子',
    title: '金丹问道 · 晋升真传',
    contribution: 2000,
    minRealm: 2,
    minAttrs: { 道心: 20 },
    checkType: 'combat',
    enemy: 'jindan_elder',
    desc: '凝结金丹且贡献满两千，须在长老化身压境考校下撑过绝杀并胜出，方可位列真传、阅览镇宗秘典。',
    sectFlavor: {
      taixuan: '登临剑冢第二重，以本命剑意击败守冢金丹剑长老。',
      qingyun: '通天峰祖师祠前接掌教座下金丹长老考校。',
      danxia: '开炉成丹的同时迎战丹火护法，证己丹武双全。',
      tianyin: '入十八铜人佛阵，正面降服金丹境护寺首座。',
      wanxiang: '观星台论道布阵，亲手破开书院祭酒的金丹大阵。',
      hanshan: '冰湖独坐七日后拔剑，斩开长老凝出的百丈寒冰界。',
      wanbao: '接手万宝阁一桩金丹级危局委托，力挫强敌保住商誉。',
      wanshou: '降服百兽谷暴走金丹妖将级守山长老，获真传兽印。',
      jiguan: '于机关城第五层拆解大师级金丹战傀。',
      xuemo: '在血海长老注视下屠戮三名同辈竞争者，踏血登真传。',
      hehuan: '于合欢秘境中识破长老幻境并反客为主，赢取圣子/圣女位。',
      youming: '闯过九幽鬼狱第三层，击败镇狱金丹判官。',
      sanxiu: '于落霞大会连挑三位金丹名宿，获散修盟「金牌客卿」尊位。',
    },
  },
  {
    fromRank: 2,
    toRank: 3,
    rankName: '执事',
    title: '元婴立威 · 晋升执事',
    contribution: 6000,
    minRealm: 3,
    minAttrs: { 神识: 28 },
    checkType: 'combat',
    enemy: 'demon_general',
    desc: '元婴既成、功勋卓著，须独当一面斩杀一尊元婴级强敌，方能执掌一堂权柄。',
    sectFlavor: {
      taixuan: '代剑宗出征北荒，阵斩一尊犯境元婴妖将献首山门。',
      qingyun: '独镇青云外域灵矿，斩杀来袭元婴妖将护一方太平。',
      danxia: '护送宗门九品药鼎途中，亲斩觊觎宝鼎的元婴妖将。',
      tianyin: '降妖伏魔试炼：只身度化或诛灭元婴凶将。',
      wanxiang: '布下星河杀阵，于千里之外围杀犯境妖将。',
      hanshan: '单骑出寒山三千里，斩元婴妖将而归，滴血不沾道袍。',
      wanbao: '为万宝阁扫平商路最大祸患，阵斩拦截商船的元婴凶将。',
      wanshou: '以绝对武力压服挑衅山门的狂暴元婴妖将。',
      jiguan: '携最新机关城战器试锋，正面对轰轰杀元婴妖将。',
      xuemo: '虐杀一尊敌对元婴强者，以其元婴献祭血池。',
      hehuan: '瓦解敌宗元婴围剿，斩杀领军大将以震慑四方。',
      youming: '于生死界缝斩杀叛逃元婴妖将，夺其妖魂充实鬼幡。',
      sanxiu: '独力完成九州元婴级血榜悬赏，跻身散修盟执事议会。',
    },
  },
  {
    fromRank: 3,
    toRank: 4,
    rankName: '长老',
    title: '化神证道 · 晋升长老',
    contribution: 15000,
    minRealm: 4,
    minAttrs: { 道心: 40, 悟性: 30 },
    checkType: 'combat',
    enemy: 'sword_phantom',
    desc: '踏入化神、初窥天地法则，须于禁地击败上古遗留的化神剑灵残影，方可开峰授徒、位列宗门长老。',
    sectFlavor: {
      taixuan: '登剑冢绝顶，与太古剑灵残影一决高下，获剑尊认可。',
      qingyun: '入青云幻月古洞，以化神法则斩碎上古剑意残影。',
      danxia: '以九转丹火抗衡丹塔禁地中的化神剑灵执念。',
      tianyin: '以佛门因果法则平息古战场化神剑灵怨念。',
      wanxiang: '于书院后山碑林接下太古剑修残留的一缕化神法相。',
      hanshan: '无灯观深处坐忘三载，斩灭缠绕寒山万年的剑意残影。',
      wanbao: '平定三十六号秘库镇库古剑暴动，获总阁长老实权。',
      wanshou: '于祖兽冢外斩退入侵的化神剑意残影，受万兽朝拜。',
      jiguan: '以天工秘器硬撼化神剑灵，将剑意铭刻于机关城核心。',
      xuemo: '以修罗血海吞噬正道上古剑仙残魂，登临血魔长老宝座。',
      hehuan: '以红尘幻阵困杀化神剑灵残影，执掌合欢一脉长老印。',
      youming: '拘禁上古化神剑灵残魂镇于黄泉渡，晋位幽冥大长老。',
      sanxiu: '于中州圣域论剑台上击败化神残影，获尊「九州散仙长老」。',
    },
  },
  {
    fromRank: 4,
    toRank: 5,
    rankName: '太上长老',
    title: '合体问鼎 · 晋升太上长老',
    contribution: 40000,
    minRealm: 6,
    minAttrs: { 道心: 65, 神识: 55 },
    checkType: 'combat',
    enemy: 'old_monster',
    desc: '修成合体、名动九州，须独斗一尊存活万载的老怪物而不落下风，从此超然物外，尊为宗门定海神针。',
    sectFlavor: {
      taixuan: '一剑压服窥伺太玄剑脉的万古老怪，封号太玄太上剑尊。',
      qingyun: '护山大阵外独战万古老怪，一战奠定青云万年基业。',
      danxia: '炼成仙品宝丹并击退夺丹的合体老怪，尊为丹霞太上。',
      tianyin: '敲响九声大梵天钟，降服乱世万古老怪，成就活佛果位。',
      wanxiang: '以乾坤圣卷镇压万古老怪于观星台下，尊为书院太上夫子。',
      hanshan: '于时光静默中重创万古老怪，成为无灯观万年不熄之灯。',
      wanbao: '震慑企图吞并万宝阁的合体老怪，执掌万界商会最高席位。',
      wanshou: '号令百兽法相击溃万古老怪，成为万兽山无上妖尊。',
      jiguan: '催动九层机关城全功率碾压万古老怪，获封天工太上。',
      xuemo: '生吞合体老怪精元，血海覆盖北荒，称尊血魔太上老祖。',
      hehuan: '令万古老怪折服于红尘大道之下，坐镇合欢无上莲台。',
      youming: '引六道轮回盘镇灭万古老怪，尊号九幽太上冥主。',
      sanxiu: '独斩合体老怪扬威九州，受天下散修共尊「无极太上」！',
    },
  },
];
