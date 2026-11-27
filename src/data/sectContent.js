/**
 * 宗门深度内容（v5.0）：覆盖全部 13 宗门的 6 阶藏经阁功法（78 卷）、8 阶宗门宝库（104 件）、
 * 5 阶任务堂（65 项）与 5 阶晋升试炼。
 * 所有 itemId 严格对应 items.js，enemy 严格对应 enemies.js，lawId 严格对应 realms.js。
 */

export const SECT_LIBRARIES = {
  taixuan: [
    {
      id: 'tx_lib_1', name: '《青锋养剑诀》', grade: '黄', minRank: 0, cost: 180,
      speed: 0.08, atk: 0.1, def: 0.02, lifespan: 0, lawId: 'sword', artName: '青锋破空斩',
      desc: '外门基础剑诀，以灵力温养剑意，出剑凌厉三分。',
    },
    {
      id: 'tx_lib_2', name: '《流光七星剑》', grade: '玄', minRank: 1, cost: 850,
      speed: 0.14, atk: 0.2, def: 0.05, lifespan: 10, lawId: 'sword', artName: '七星分光剑阵',
      desc: '内门剑修必修，一剑化七芒，攻守兼备。',
    },
    {
      id: 'tx_lib_3', name: '《太玄真剑经》', grade: '地', minRank: 2, cost: 2800,
      speed: 0.22, atk: 0.34, def: 0.08, lifespan: 30, lawId: 'sword', artName: '太玄一剑断山河',
      desc: '真传镇峰剑典，剑心通明，斩破诸般护体神通。',
    },
    {
      id: 'tx_lib_3b', name: '《问剑归元录》', grade: '天', minRank: 3, cost: 5800,
      speed: 0.27, atk: 0.42, def: 0.11, lifespan: 55, lawId: 'sword', artName: '万剑归宗御天式',
      desc: '执事一脉秘传剑典，以神御万剑，剑势连绵若江海奔涌。',
    },
    {
      id: 'tx_lib_4', name: '《太虚斩道剑》', grade: '天', minRank: 4, cost: 12000,
      speed: 0.32, atk: 0.5, def: 0.14, lifespan: 80, lawId: 'sword', artName: '太虚斩天剑意',
      desc: '太玄历代剑尊感悟凝成的无上剑经，一剑出而法则震颤。',
    },
    {
      id: 'tx_lib_5', name: '《太玄开天仙剑典》', grade: '仙', minRank: 5, cost: 28000,
      speed: 0.42, atk: 0.64, def: 0.22, lifespan: 160, lawId: 'sword', artName: '太玄一剑开仙门',
      desc: '太上剑尊羽化前刻于剑冢绝壁的至高剑经，可斩天劫、断因果。',
    },
  ],
  qingyun: [
    {
      id: 'qy_lib_1', name: '《青云引灵诀》', grade: '黄', minRank: 0, cost: 160,
      speed: 0.1, atk: 0.05, def: 0.06, lifespan: 8, lawId: 'thunder', artName: '青云御风诀',
      desc: '中正平和的正道筑基心法，行气稳健不易生心魔。',
    },
    {
      id: 'qy_lib_2', name: '《玉清神雷诀》', grade: '玄', minRank: 1, cost: 800,
      speed: 0.16, atk: 0.16, def: 0.1, lifespan: 18, lawId: 'thunder', artName: '玉清落雷印',
      desc: '引九天清雷诛邪，对邪魔外道威势倍增。',
    },
    {
      id: 'qy_lib_3', name: '《太清通天录》', grade: '地', minRank: 2, cost: 2600,
      speed: 0.24, atk: 0.24, def: 0.18, lifespan: 45, lawId: 'thunder', artName: '通天紫霄雷',
      desc: '通天峰不传之秘，灵力绵长如海，可引紫霄神雷护体。',
    },
    {
      id: 'qy_lib_3b', name: '《七峰镇魔剑雷典》', grade: '天', minRank: 3, cost: 5600,
      speed: 0.29, atk: 0.3, def: 0.23, lifespan: 75, lawId: 'thunder', artName: '七峰天雷伏魔阵',
      desc: '青云执事统领七峰弟子合击之秘法，剑雷交织，正气沛然。',
    },
    {
      id: 'qy_lib_4', name: '《上清混元真经》', grade: '天', minRank: 4, cost: 11500,
      speed: 0.35, atk: 0.36, def: 0.28, lifespan: 110, lawId: 'chaos', artName: '混元青莲劫',
      desc: '青云祖师羽化前留下的终极传承，万法归元。',
    },
    {
      id: 'qy_lib_5', name: '《三清太上紫霄仙经》', grade: '仙', minRank: 5, cost: 27500,
      speed: 0.44, atk: 0.48, def: 0.38, lifespan: 220, lawId: 'chaos', artName: '三清紫霄灭劫雷',
      desc: '青云太上秘藏，融玉清、上清、太清三脉至理于一炉，万邪不侵。',
    },
  ],
  danxia: [
    {
      id: 'dx_lib_1', name: '《百草控火诀》', grade: '黄', minRank: 0, cost: 150,
      speed: 0.08, atk: 0.04, def: 0.05, lifespan: 15, lawId: 'pill', artName: '丹火焚邪掌',
      desc: '外门炼丹基础控火术，既稳炉火，亦可温养寿元。',
    },
    {
      id: 'dx_lib_2', name: '《赤霞灵焰经》', grade: '玄', minRank: 1, cost: 780,
      speed: 0.15, atk: 0.14, def: 0.08, lifespan: 30, lawId: 'pill', artName: '赤霞九火罩',
      desc: '化丹火为真焰，炼丹成丹率大增，斗法亦能焚敌护体。',
    },
    {
      id: 'dx_lib_3', name: '《九转造化丹典》', grade: '地', minRank: 2, cost: 2500,
      speed: 0.22, atk: 0.2, def: 0.16, lifespan: 65, lawId: 'pill', artName: '造化生生印',
      desc: '以天地为丹炉，服丹药效倍增，生机绵延不绝。',
    },
    {
      id: 'dx_lib_3b', name: '《三昧真火炼道诀》', grade: '天', minRank: 3, cost: 5500,
      speed: 0.26, atk: 0.26, def: 0.21, lifespan: 115, lawId: 'pill', artName: '三昧焚天丹火',
      desc: '丹霞执事执掌地火灵脉的密法，炼丹如烹小鲜，真火烧穿护体法宝。',
    },
    {
      id: 'dx_lib_4', name: '《太一长生药经》', grade: '天', minRank: 4, cost: 11000,
      speed: 0.3, atk: 0.3, def: 0.25, lifespan: 180, lawId: 'pill', artName: '太一净世真火',
      desc: '丹霞谷镇谷仙卷，传闻修至极境可以肉身成丹、寿比天地。',
    },
    {
      id: 'dx_lib_5', name: '《混元造化仙丹经》', grade: '仙', minRank: 5, cost: 27000,
      speed: 0.38, atk: 0.4, def: 0.34, lifespan: 320, lawId: 'pill', artName: '乾坤一炉炼万物',
      desc: '以天地阴阳为药、日月星辰为火的无上丹道仙经，生机永固。',
    },
  ],
  tianyin: [
    {
      id: 'ty_lib_1', name: '《金刚伏魔咒》', grade: '黄', minRank: 0, cost: 160,
      speed: 0.07, atk: 0.06, def: 0.12, lifespan: 10, lawId: 'karma', artName: '金刚狮子吼',
      desc: '护持心神、强健体魄，令邪祟不敢近身。',
    },
    {
      id: 'ty_lib_2', name: '《梵钟镇魂经》', grade: '玄', minRank: 1, cost: 820,
      speed: 0.13, atk: 0.14, def: 0.2, lifespan: 25, lawId: 'karma', artName: '大梵镇魔钟',
      desc: '观想梵钟入识海，神魂稳如磐石，音律震碎敌方灵脉。',
    },
    {
      id: 'ty_lib_3', name: '《大日如来印》', grade: '地', minRank: 2, cost: 2700,
      speed: 0.2, atk: 0.26, def: 0.28, lifespan: 55, lawId: 'karma', artName: '大日破妄金身',
      desc: '佛光普照，万魔退避，因果业火难伤分毫。',
    },
    {
      id: 'ty_lib_3b', name: '《八部天龙禅音录》', grade: '天', minRank: 3, cost: 5800,
      speed: 0.25, atk: 0.32, def: 0.35, lifespan: 95, lawId: 'karma', artName: '天龙梵音度厄咒',
      desc: '罗汉堂执事首座修习的镇寺禅音，一念诵经如千佛临凡。',
    },
    {
      id: 'ty_lib_4', name: '《大音希声真谛》', grade: '天', minRank: 4, cost: 12000,
      speed: 0.3, atk: 0.38, def: 0.42, lifespan: 140, lawId: 'karma', artName: '无相佛国降世',
      desc: '无声胜有声，一念度化因果，成就金刚不坏之躯。',
    },
    {
      id: 'ty_lib_5', name: '《须弥涅槃古佛经》', grade: '仙', minRank: 5, cost: 28000,
      speed: 0.38, atk: 0.48, def: 0.54, lifespan: 260, lawId: 'karma', artName: '掌中佛国镇九霄',
      desc: '天音寺开山古佛遗留的贝叶真经，万劫不磨，因果自清。',
    },
  ],
  wanxiang: [
    {
      id: 'wx_lib_1', name: '《浩然墨阵篇》', grade: '黄', minRank: 0, cost: 170,
      speed: 0.1, atk: 0.06, def: 0.08, lifespan: 5, lawId: 'array', artName: '墨笔定身阵',
      desc: '以灵墨书阵，落笔成纹，困敌于方寸之间。',
    },
    {
      id: 'wx_lib_2', name: '《周天八卦阵图》', grade: '玄', minRank: 1, cost: 860,
      speed: 0.16, atk: 0.16, def: 0.16, lifespan: 15, lawId: 'array', artName: '八卦锁灵杀阵',
      desc: '借天地八方灵气布阵，攻守转换妙到毫巅。',
    },
    {
      id: 'wx_lib_3', name: '《星河推演策》', grade: '地', minRank: 2, cost: 2800,
      speed: 0.25, atk: 0.26, def: 0.22, lifespan: 40, lawId: 'star', artName: '周天星斗大阵',
      desc: '观星台秘传，引九天星力入阵，推演敌手破绽于瞬息。',
    },
    {
      id: 'wx_lib_3b', name: '《春秋浩然兵书》', grade: '天', minRank: 3, cost: 5900,
      speed: 0.3, atk: 0.33, def: 0.29, lifespan: 70, lawId: 'array', artName: '春秋笔落镇山川',
      desc: '书院山长亲授执事先生的儒阵奇书，一字诛魔，一卷安澜。',
    },
    {
      id: 'wx_lib_4', name: '《万象乾坤圣卷》', grade: '天', minRank: 4, cost: 12500,
      speed: 0.36, atk: 0.4, def: 0.36, lifespan: 100, lawId: 'array', artName: '乾坤无极书海',
      desc: '一字成界，万法随言出法随，乃是儒阵双修极巅。',
    },
    {
      id: 'wx_lib_5', name: '《河图洛书先天阵典》', grade: '仙', minRank: 5, cost: 28500,
      speed: 0.45, atk: 0.52, def: 0.48, lifespan: 200, lawId: 'star', artName: '先天河洛镇天阵',
      desc: '万象书院镇院太古神图，推演周天星辰与山河地脉，化虚空为棋局。',
    },
  ],
  hanshan: [
    {
      id: 'hs_lib_1', name: '《寒潭照心诀》', grade: '黄', minRank: 0, cost: 160,
      speed: 0.09, atk: 0.05, def: 0.09, lifespan: 18, lawId: 'time', artName: '寒霜凝气指',
      desc: '观寒潭止水而悟静定，息躁安神，延年益寿。',
    },
    {
      id: 'hs_lib_2', name: '《玄冰太素经》', grade: '玄', minRank: 1, cost: 820,
      speed: 0.16, atk: 0.15, def: 0.18, lifespan: 40, lawId: 'time', artName: '太素冰封领域',
      desc: '玄冰之气冻结周身灵机，亦能令岁华流逝为之放缓。',
    },
    {
      id: 'hs_lib_3', name: '《坐忘春秋卷》', grade: '地', minRank: 2, cost: 2700,
      speed: 0.24, atk: 0.24, def: 0.25, lifespan: 90, lawId: 'time', artName: '一念枯荣剑气',
      desc: '无灯观核心道藏，于寂静黑暗中窥见光阴长河。',
    },
    {
      id: 'hs_lib_3b', name: '《无灯守夜玄经》', grade: '天', minRank: 3, cost: 5800,
      speed: 0.29, atk: 0.31, def: 0.32, lifespan: 140, lawId: 'time', artName: '永夜凝时寒锋',
      desc: '寒山执事长夜枯坐参得的幽玄道法，一念之下寒光封岁。',
    },
    {
      id: 'hs_lib_4', name: '《太上忘情真经》', grade: '天', minRank: 4, cost: 12000,
      speed: 0.34, atk: 0.38, def: 0.38, lifespan: 200, lawId: 'time', artName: '光阴静止之瞳',
      desc: '超脱尘念，与天地同寿，一念可令强敌神通停滞。',
    },
    {
      id: 'hs_lib_5', name: '《太古岁华归寂仙典》', grade: '仙', minRank: 5, cost: 28000,
      speed: 0.42, atk: 0.48, def: 0.48, lifespan: 360, lawId: 'time', artName: '岁月长河断古今',
      desc: '寒山祖师羽化前手书的无上光阴仙法，执掌枯荣，静观沧海桑田。',
    },
  ],
  wanbao: [
    {
      id: 'wb_lib_1', name: '《点石成金诀》', grade: '黄', minRank: 0, cost: 160,
      speed: 0.09, atk: 0.07, def: 0.06, lifespan: 5, lawId: 'space', artName: '落宝金光手',
      desc: '以灵石布微型聚灵阵助修，兼能辨识天下法宝破绽。',
    },
    {
      id: 'wb_lib_2', name: '《多宝御器录》', grade: '玄', minRank: 1, cost: 840,
      speed: 0.15, atk: 0.18, def: 0.14, lifespan: 15, lawId: 'space', artName: '百宝星雨轰',
      desc: '同时催动数件法器齐发，以财力碾压同阶劲敌。',
    },
    {
      id: 'wb_lib_3', name: '《须弥纳界诀》', grade: '地', minRank: 2, cost: 2700,
      speed: 0.23, atk: 0.26, def: 0.22, lifespan: 40, lawId: 'space', artName: '须弥袖里乾坤',
      desc: '参悟空间挪移妙法，既可随身藏宝，亦能折空间伤敌。',
    },
    {
      id: 'wb_lib_3b', name: '《金算盘镇界录》', grade: '天', minRank: 3, cost: 5700,
      speed: 0.28, atk: 0.33, def: 0.27, lifespan: 70, lawId: 'space', artName: '乾坤落宝金虹',
      desc: '万宝阁大掌柜一脉的护宝绝学，落敌法宝、移星换斗尽在弹指。',
    },
    {
      id: 'wb_lib_4', name: '《天机通宝仙典》', grade: '天', minRank: 4, cost: 12000,
      speed: 0.34, atk: 0.4, def: 0.32, lifespan: 100, lawId: 'space', artName: '万界聚宝大阵',
      desc: '万宝阁总舵密藏，通晓商道与空间法则，举手引动界域宝光。',
    },
    {
      id: 'wb_lib_5', name: '《诸天宝库太虚仙经》', grade: '仙', minRank: 5, cost: 28000,
      speed: 0.43, atk: 0.52, def: 0.42, lifespan: 200, lawId: 'space', artName: '万界虚空宝海镇',
      desc: '传说连通上界仙库的绝世奇经，虚空一开，千件灵宝齐镇乾坤。',
    },
  ],
  wanshou: [
    {
      id: 'ws_lib_1', name: '《百兽淬体功》', grade: '黄', minRank: 0, cost: 160,
      speed: 0.08, atk: 0.09, def: 0.08, lifespan: 12, lawId: 'blood', artName: '苍狼裂山爪',
      desc: '观摩妖兽搏杀之态锤炼筋骨，气血浑厚。',
    },
    {
      id: 'ws_lib_2', name: '《灵犀御兽经》', grade: '玄', minRank: 1, cost: 820,
      speed: 0.14, atk: 0.18, def: 0.16, lifespan: 28, lawId: 'blood', artName: '百兽奔腾啸',
      desc: '与伴生灵兽心神相连，借妖族血脉之力增幅自身战力。',
    },
    {
      id: 'ws_lib_3', name: '《真龙化形诀》', grade: '地', minRank: 2, cost: 2700,
      speed: 0.22, atk: 0.3, def: 0.26, lifespan: 65, lawId: 'blood', artName: '太古龙象镇狱',
      desc: '汲取太古神兽真意，一拳一脚皆具崩山裂岳之威。',
    },
    {
      id: 'ws_lib_3b', name: '《四象圣兽战经》', grade: '天', minRank: 3, cost: 5800,
      speed: 0.27, atk: 0.38, def: 0.32, lifespan: 110, lawId: 'blood', artName: '青龙白虎破天啸',
      desc: '百兽谷执事统御四方大妖的战典，血脉沸腾如洪荒神兽降世。',
    },
    {
      id: 'ws_lib_4', name: '《洪荒万妖圣典》', grade: '天', minRank: 4, cost: 12000,
      speed: 0.32, atk: 0.45, def: 0.38, lifespan: 160, lawId: 'chaos', artName: '洪荒祖兽法相',
      desc: '万兽山开山妖圣遗经，化身洪荒法相，号令天下群妖。',
    },
    {
      id: 'ws_lib_5', name: '《太古祖龙混沌仙经》', grade: '仙', minRank: 5, cost: 28000,
      speed: 0.41, atk: 0.58, def: 0.48, lifespan: 280, lawId: 'chaos', artName: '太古祖龙噬星河',
      desc: '万兽山秘传太上仙典，引太古祖龙真血入道，肉身成圣力破九霄。',
    },
  ],
  jiguan: [
    {
      id: 'jg_lib_1', name: '《墨家机巧录》', grade: '黄', minRank: 0, cost: 160,
      speed: 0.08, atk: 0.08, def: 0.1, lifespan: 5, lawId: 'array', artName: '连珠破甲弩',
      desc: '精研符文齿轮与傀儡构造，以器补道。',
    },
    {
      id: 'jg_lib_2', name: '《千机傀儡典》', grade: '玄', minRank: 1, cost: 840,
      speed: 0.15, atk: 0.18, def: 0.2, lifespan: 20, lawId: 'array', artName: '千机战傀齐鸣',
      desc: '炼制灵核战傀随行护法，铁壁难摧。',
    },
    {
      id: 'jg_lib_3', name: '《天工神兵谱》', grade: '地', minRank: 2, cost: 2800,
      speed: 0.22, atk: 0.3, def: 0.28, lifespan: 45, lawId: 'star', artName: '天工星陨炮',
      desc: '以星辰砂与法则铭文炼器，本命法宝威能倍增。',
    },
    {
      id: 'jg_lib_3b', name: '《百炼灵枢统御策》', grade: '天', minRank: 3, cost: 5900,
      speed: 0.27, atk: 0.37, def: 0.35, lifespan: 75, lawId: 'array', artName: '灵枢万弩覆苍穹',
      desc: '执掌机关城中枢灵脉的执事秘录，一念操纵百尊金丹战傀成阵。',
    },
    {
      id: 'jg_lib_4', name: '《造物巨城真图》', grade: '天', minRank: 4, cost: 12500,
      speed: 0.32, atk: 0.44, def: 0.42, lifespan: 110, lawId: 'array', artName: '九层机关天城降临',
      desc: '机关城主三百年未现世的终极蓝图，可化洞府为灭世战争堡垒。',
    },
    {
      id: 'jg_lib_5', name: '《太古天工造化仙图》', grade: '仙', minRank: 5, cost: 28500,
      speed: 0.4, atk: 0.56, def: 0.54, lifespan: 220, lawId: 'star', artName: '天工星辰战堡轰',
      desc: '以星辰为齿轮、法则为灵枢的仙道炼器总纲，巧夺天地造化。',
    },
  ],
  xuemo: [
    {
      id: 'xm_lib_1', name: '《燃血化灵诀》', grade: '黄', minRank: 0, cost: 170,
      speed: 0.14, atk: 0.12, def: 0.02, lifespan: -5, lawId: 'blood', artName: '猩红裂血斩',
      desc: '魔门速成之法，以气血催动暴烈灵力，攻伐无双。',
    },
    {
      id: 'xm_lib_2', name: '《血河吞天经》', grade: '玄', minRank: 1, cost: 860,
      speed: 0.22, atk: 0.24, def: 0.08, lifespan: 10, lawId: 'blood', artName: '血河滔天浪',
      desc: '以战养战，掠夺敌手精气反哺己身。',
    },
    {
      id: 'xm_lib_3', name: '《修罗血海真经》', grade: '地', minRank: 2, cost: 2900,
      speed: 0.32, atk: 0.38, def: 0.14, lifespan: 30, lawId: 'blood', artName: '修罗血狱降世',
      desc: '血魔宗镇宗魔典，化丹田为无边血海，血海不枯则身不灭。',
    },
    {
      id: 'xm_lib_3b', name: '《化血镇狱魔典》', grade: '天', minRank: 3, cost: 6000,
      speed: 0.38, atk: 0.47, def: 0.19, lifespan: 55, lawId: 'blood', artName: '化血神刀斩苍生',
      desc: '血魔执事统领血池杀阵的凶厉魔功，煞气蔽日，所向披靡。',
    },
    {
      id: 'xm_lib_4', name: '《冥河不灭血神经》', grade: '天', minRank: 4, cost: 12500,
      speed: 0.44, atk: 0.56, def: 0.24, lifespan: 90, lawId: 'blood', artName: '亿万血神子噬天',
      desc: '血魔老祖证道之法，滴血重生，一怒令千里山河化作赤海。',
    },
    {
      id: 'xm_lib_5', name: '《太古血海覆天仙经》', grade: '仙', minRank: 5, cost: 29000,
      speed: 0.54, atk: 0.68, def: 0.34, lifespan: 180, lawId: 'blood', artName: '无边血海吞九霄',
      desc: '血魔宗至高太上禁忌魔典，以杀证道、以血成仙，连天劫亦敢反噬。',
    },
  ],
  hehuan: [
    {
      id: 'hh_lib_1', name: '《红尘魅影诀》', grade: '黄', minRank: 0, cost: 160,
      speed: 0.11, atk: 0.07, def: 0.06, lifespan: 12, lawId: 'karma', artName: '迷心红绫缚',
      desc: '吐纳阴阳和合之气，身法缥缈，令人神魂摇曳。',
    },
    {
      id: 'hh_lib_2', name: '《阴阳双修宝录》', grade: '玄', minRank: 1, cost: 840,
      speed: 0.19, atk: 0.16, def: 0.12, lifespan: 35, lawId: 'karma', artName: '红尘情丝斩',
      desc: '采阴补阳、以情入道，修为进境远超寻常正道。',
    },
    {
      id: 'hh_lib_3', name: '《天魔妙音经》', grade: '地', minRank: 2, cost: 2700,
      speed: 0.28, atk: 0.28, def: 0.18, lifespan: 70, lawId: 'karma', artName: '天魔幻心大法',
      desc: '直指敌手道心破绽，于无声处惑乱元婴神魂。',
    },
    {
      id: 'hh_lib_3b', name: '《七情六欲锁心诀》', grade: '天', minRank: 3, cost: 5800,
      speed: 0.33, atk: 0.35, def: 0.23, lifespan: 110, lawId: 'karma', artName: '七情焚心红莲劫',
      desc: '合欢执事一脉秘典，引动敌手七情翻涌，于谈笑间瓦解战意。',
    },
    {
      id: 'hh_lib_4', name: '《极乐无上真情典》', grade: '天', minRank: 4, cost: 12000,
      speed: 0.38, atk: 0.42, def: 0.28, lifespan: 160, lawId: 'karma', artName: '红尘因果万劫丝',
      desc: '由情入道，终至无情而有情，执掌众生爱恨因果线。',
    },
    {
      id: 'hh_lib_5', name: '《太素红尘造化仙经》', grade: '仙', minRank: 5, cost: 28000,
      speed: 0.48, atk: 0.54, def: 0.38, lifespan: 280, lawId: 'karma', artName: '红尘三千劫火莲',
      desc: '合欢宗太上传承，化红尘众生念力为己用，情劫不侵、道果永驻。',
    },
  ],
  youming: [
    {
      id: 'ym_lib_1', name: '《黄泉引魂诀》', grade: '黄', minRank: 0, cost: 160,
      speed: 0.1, atk: 0.09, def: 0.05, lifespan: 8, lawId: 'space', artName: '阴风锁魂链',
      desc: '采九幽阴气淬炼神识，驱使阴魂助战。',
    },
    {
      id: 'ym_lib_2', name: '《百鬼夜行图》', grade: '玄', minRank: 1, cost: 850,
      speed: 0.17, atk: 0.2, def: 0.12, lifespan: 25, lawId: 'space', artName: '百鬼噬灵潮',
      desc: '神识分化百道鬼影，令敌手防不胜防。',
    },
    {
      id: 'ym_lib_3', name: '《十殿阎罗经》', grade: '地', minRank: 2, cost: 2800,
      speed: 0.26, atk: 0.32, def: 0.2, lifespan: 55, lawId: 'time', artName: '生死簿勾魂印',
      desc: '以黄泉之力执掌生死轮回，神识攻伐直碎元婴。',
    },
    {
      id: 'ym_lib_3b', name: '《判官生死玄笔录》', grade: '天', minRank: 3, cost: 5900,
      speed: 0.31, atk: 0.39, def: 0.26, lifespan: 95, lawId: 'time', artName: '勾魂夺寿幽冥判',
      desc: '幽冥鬼道执事判官修习的夺寿秘典，一笔勾销敌手生机。',
    },
    {
      id: 'ym_lib_4', name: '《九幽轮回大道卷》', grade: '天', minRank: 4, cost: 12200,
      speed: 0.36, atk: 0.46, def: 0.32, lifespan: 140, lawId: 'time', artName: '六道轮回寂灭盘',
      desc: '幽冥祖师于黄泉尽头悟得，一念开轮回，吞没万法。',
    },
    {
      id: 'ym_lib_5', name: '《太古冥府执道仙经》', grade: '仙', minRank: 5, cost: 28500,
      speed: 0.46, atk: 0.58, def: 0.42, lifespan: 260, lawId: 'time', artName: '黄泉倒悬镇六道',
      desc: '九幽冥主代代相传的太上仙经，超脱生死薄，执掌阴司轮回权柄。',
    },
  ],
  sanxiu: [
    {
      id: 'sx_lib_1', name: '《野狐吐纳杂录》', grade: '黄', minRank: 0, cost: 140,
      speed: 0.08, atk: 0.07, def: 0.07, lifespan: 8, lawId: 'space', artName: '草莽搏命斩',
      desc: '前辈散修拼凑出的保命法门，招式刁钻实用。',
    },
    {
      id: 'sx_lib_2', name: '《逍遥游云诀》', grade: '玄', minRank: 1, cost: 780,
      speed: 0.15, atk: 0.16, def: 0.15, lifespan: 25, lawId: 'space', artName: '流云断水步',
      desc: '散修联盟流传的轻身与斗法绝学，进可攻退可走。',
    },
    {
      id: 'sx_lib_3', name: '《百家问道集》', grade: '地', minRank: 2, cost: 2500,
      speed: 0.24, atk: 0.28, def: 0.22, lifespan: 55, lawId: 'chaos', artName: '百家合流破法式',
      desc: '兼采正魔各派之长，不拘一格，专为无门无派者所创。',
    },
    {
      id: 'sx_lib_3b', name: '《九州游侠剑气策》', grade: '天', minRank: 3, cost: 5500,
      speed: 0.3, atk: 0.36, def: 0.28, lifespan: 90, lawId: 'space', artName: '万里纵横孤鸿斩',
      desc: '散修盟执事议会汇集天下奇人异术编成，应变无方、破阵如风。',
    },
    {
      id: 'sx_lib_4', name: '《红尘独尊仙经》', grade: '天', minRank: 4, cost: 11000,
      speed: 0.36, atk: 0.44, def: 0.34, lifespan: 130, lawId: 'chaos', artName: '自在天地一指',
      desc: '无师自通、独步九州的散修传奇所留，天地为炉，万法为师。',
    },
    {
      id: 'sx_lib_5', name: '《无拘无束太虚仙典》', grade: '仙', minRank: 5, cost: 27000,
      speed: 0.46, atk: 0.56, def: 0.44, lifespan: 250, lawId: 'chaos', artName: '天地自在破万劫',
      desc: '散修盟太上客卿于红尘悟出的至高仙经，不借宗门气运，独证大自在。',
    },
  ],
};

export const SECT_TREASURY = {
  taixuan: [
    { itemId: 'qingfeng_jian', minRank: 0, cost: 180, note: '外门制式青锋，锋芒内敛' },
    { itemId: 'zhuji_dan', minRank: 0, cost: 420, note: '助外门剑修稳固筑基' },
    { itemId: 'jianqi_fu', minRank: 1, cost: 340, note: '问剑峰剑修亲封剑意玉符' },
    { itemId: 'leimu', minRank: 1, cost: 620, note: '祭炼本命飞剑的雷纹灵木' },
    { itemId: 'jiejin_dan', minRank: 1, cost: 1400, note: '内门结丹配额灵丹' },
    { itemId: 'huaying_dan', minRank: 2, cost: 4800, note: '真传弟子破境元婴赐药' },
    { itemId: 'taixu_jian', minRank: 3, cost: 9200, note: '执事配发通灵飞剑太虚斩虹' },
    { itemId: 'faze_canpian', minRank: 4, cost: 11000, note: '问剑峰剑冢孕育的大道残片' },
  ],
  qingyun: [
    { itemId: 'liaoshang_dan', minRank: 0, cost: 60, note: '下山除妖常备疗伤灵丹' },
    { itemId: 'qingxin_dan', minRank: 0, cost: 280, note: '澄净道心，驱除心魔' },
    { itemId: 'zhuji_dan', minRank: 0, cost: 400, note: '正道精炼上品筑基丹' },
    { itemId: 'jiejin_dan', minRank: 1, cost: 1350, note: '青云内门结丹赐药' },
    { itemId: 'zixiao_ling', minRank: 2, cost: 2800, note: '通天峰雷脉祭炼的紫霄雷铃' },
    { itemId: 'leiyuan_dan', minRank: 2, cost: 4200, note: '引玉清雷意炼成的法则宝丹' },
    { itemId: 'huashen_dan', minRank: 3, cost: 8500, note: '通天峰珍藏化神灵丹' },
    { itemId: 'tianjie_dan', minRank: 4, cost: 18000, note: '掌门私库镇压雷劫底牌' },
  ],
  danxia: [
    { itemId: 'lingcao', minRank: 0, cost: 35, note: '百草园日产百年灵草' },
    { itemId: 'juling_dan', minRank: 0, cost: 240, note: '宗门自炼聚灵丹，价格极优' },
    { itemId: 'qiannian_lingcao', minRank: 1, cost: 220, note: '丹霞谷内苑千年药王' },
    { itemId: 'dahuan_dan', minRank: 1, cost: 950, note: '丹霞秘制救命大还丹' },
    { itemId: 'xisui_dan', minRank: 2, cost: 1600, note: '洗髓易筋的绝品丹丸' },
    { itemId: 'yanshou_dan', minRank: 3, cost: 4600, note: '执事配额松鹤延寿丹' },
    { itemId: 'jiuzhuan_dan', minRank: 4, cost: 13000, note: '丹霞镇谷之宝九转金丹' },
    { itemId: 'changsheng_guo', minRank: 5, cost: 26000, note: '丹霞秘园万载结出的长生仙果' },
  ],
  tianyin: [
    { itemId: 'jingang_fu', minRank: 0, cost: 95, note: '寺中僧侣常备金刚护身符' },
    { itemId: 'qingxin_dan', minRank: 0, cost: 220, note: '梵钟香火熏炼的清心禅丹' },
    { itemId: 'huxin_fu', minRank: 0, cost: 240, note: '高僧开光护心金符' },
    { itemId: 'poxie_fu', minRank: 1, cost: 360, note: '梵钟崖朱砂手绘镇魔破邪符' },
    { itemId: 'dahuan_dan', minRank: 1, cost: 1100, note: '佛门大还妙药' },
    { itemId: 'huaying_dan', minRank: 2, cost: 4600, note: '助护法罗汉稳凝元婴' },
    { itemId: 'donghuang_zhong', minRank: 3, cost: 12000, note: '大梵镇狱古钟护寺灵宝' },
    { itemId: 'dao_fruit', minRank: 4, cost: 16000, note: '菩提古树结出的悟道灵果' },
  ],
  wanxiang: [
    { itemId: 'shenxing_fu', minRank: 0, cost: 50, note: '书院符阵堂精绘神行符' },
    { itemId: 'huiling_dan', minRank: 0, cost: 65, note: '布阵耗灵时的常备回灵丹' },
    { itemId: 'xingchen_sha', minRank: 1, cost: 1400, note: '观星台收集的布阵星砂' },
    { itemId: 'yujian_bagua', minRank: 2, cost: 3400, note: '阵堂秘藏伏羲八卦阵简' },
    { itemId: 'huashen_dan', minRank: 2, cost: 7800, note: '先生赐予真传的化神宝丹' },
    { itemId: 'faze_canpian', minRank: 3, cost: 10500, note: '万象碑拓印的大道残片' },
    { itemId: 'xinghe_shan', minRank: 3, cost: 11800, note: '观星台祭炼的星河羽扇' },
    { itemId: 'xukong_jing', minRank: 4, cost: 15000, note: '推演虚空大阵的核心灵晶' },
  ],
  hanshan: [
    { itemId: 'qingxin_dan', minRank: 0, cost: 240, note: '寒山静心丸，涤荡尘念' },
    { itemId: 'zhuji_dan', minRank: 0, cost: 420, note: '冰泉熬炼的上佳筑基丹' },
    { itemId: 'hanbing_jian', minRank: 1, cost: 850, note: '寒山雪铁锻造的寒霜古剑' },
    { itemId: 'jiejin_dan', minRank: 1, cost: 1400, note: '无灯观珍藏结金丹' },
    { itemId: 'bingxin_dan', minRank: 2, cost: 2100, note: '雪莲心蕊炼成的冰心丹' },
    { itemId: 'yuanying_dan', minRank: 2, cost: 5600, note: '闭关百年所需的元婴精丹' },
    { itemId: 'guangyin_lu', minRank: 3, cost: 9800, note: '寒潭晨凝的一滴岁月朝露' },
    { itemId: 'tiandao_lotus', minRank: 4, cost: 22000, note: '寒山冰池孕育的绝世天道莲' },
  ],
  wanbao: [
    { itemId: 'shenxing_fu', minRank: 0, cost: 45, note: '商队标配逃生神行符' },
    { itemId: 'xuantie', minRank: 0, cost: 120, note: '万宝阁批量收购的玄铁' },
    { itemId: 'huxin_fu', minRank: 0, cost: 230, note: '押镖保命护心符' },
    { itemId: 'pozhang_dan', minRank: 1, cost: 650, note: '坊市抢手的破障灵丹' },
    { itemId: 'xisui_dan', minRank: 2, cost: 1700, note: '拍卖行内部折价洗髓丹' },
    { itemId: 'suodi_fu', minRank: 2, cost: 1100, note: '商队秘藏空间遁行玉符' },
    { itemId: 'qiankun_jie', minRank: 3, cost: 14500, note: '内蕴灵脉的乾坤须弥戒' },
    { itemId: 'xianling_dan', minRank: 4, cost: 20000, note: '三十六号秘库压箱仙灵丹' },
  ],
  wanshou: [
    { itemId: 'liaoshang_dan', minRank: 0, cost: 55, note: '御兽厮杀必备外伤丹' },
    { itemId: 'yaoshou_neidan', minRank: 0, cost: 190, note: '百兽谷常备妖兽内丹' },
    { itemId: 'qiannian_lingcao', minRank: 1, cost: 250, note: '百兽谷深处采得的灵药' },
    { itemId: 'juling_dan', minRank: 1, cost: 280, note: '妖丹辅炼的聚灵丹' },
    { itemId: 'duangu_dan', minRank: 2, cost: 3100, note: '以兽血淬骨的锻骨龙象丹' },
    { itemId: 'huaying_dan', minRank: 2, cost: 4900, note: '真传长老配额化婴丹' },
    { itemId: 'longxue_jing', minRank: 3, cost: 6800, note: '万兽山镇山龙血真精' },
    { itemId: 'dao_fruit', minRank: 4, cost: 16500, note: '妖圣遗留的洪荒悟道果' },
  ],
  jiguan: [
    { itemId: 'xuantie', minRank: 0, cost: 100, note: '机关城矿脉精炼玄铁' },
    { itemId: 'huxin_fu', minRank: 0, cost: 240, note: '机关护盾玉符' },
    { itemId: 'leimu', minRank: 1, cost: 580, note: '制作雷傀儡的高阶雷击木' },
    { itemId: 'xuanwu_dun', minRank: 1, cost: 920, note: '工坊精铸玄武墨盾' },
    { itemId: 'xingchen_sha', minRank: 1, cost: 1300, note: '核心炉坊精粹星辰砂' },
    { itemId: 'bagua_xuanjia', minRank: 3, cost: 9600, note: '第九层秘库八卦玄黄甲' },
    { itemId: 'xukong_jing', minRank: 3, cost: 13500, note: '驱动机关城挪移的虚空晶' },
    { itemId: 'faze_canpian', minRank: 4, cost: 11500, note: '古天工铭刻的阵器法则碎片' },
  ],
  xuemo: [
    { itemId: 'yinqi_dan', minRank: 0, cost: 25, note: '血池副产的猛烈引气丹' },
    { itemId: 'pozhang_dan', minRank: 0, cost: 580, note: '魔宗最偏爱的强行破障丹' },
    { itemId: 'dahuan_dan', minRank: 1, cost: 1050, note: '以血精炼制的救命大还丹' },
    { itemId: 'xuesha_jing', minRank: 1, cost: 1900, note: '血池深处凝成的血煞魔核' },
    { itemId: 'yuanying_dan', minRank: 2, cost: 5200, note: '魔渊掠夺来的高阶元婴丹' },
    { itemId: 'longxue_jing', minRank: 2, cost: 6400, note: '淬炼魔体的太古龙血精' },
    { itemId: 'yujian_xuesha', minRank: 3, cost: 12500, note: '古修罗战意骨简秘典' },
    { itemId: 'tianjie_dan', minRank: 4, cost: 17500, note: '逆天硬抗雷劫的禁忌魔丹' },
  ],
  hehuan: [
    { itemId: 'huiling_dan', minRank: 0, cost: 60, note: '双修调息所需的回灵丹' },
    { itemId: 'zhuji_dan', minRank: 0, cost: 430, note: '以情花辅炼的筑基丹' },
    { itemId: 'zhuyan_dan', minRank: 1, cost: 1050, note: '合欢密炼冰肌驻颜丹' },
    { itemId: 'jiejin_dan', minRank: 1, cost: 1380, note: '内门仙子/圣子专供结金丹' },
    { itemId: 'xisui_dan', minRank: 1, cost: 1750, note: '驻颜易骨的洗髓灵丹' },
    { itemId: 'yangshen_dan', minRank: 2, cost: 2900, note: '温润神魂的养神玉清丹' },
    { itemId: 'huashen_dan', minRank: 3, cost: 8200, note: '合欢密库珍藏化神丹' },
    { itemId: 'jiuzhuan_dan', minRank: 4, cost: 14000, note: '青春永驻、续命三百载的金丹' },
  ],
  youming: [
    { itemId: 'qingxin_dan', minRank: 0, cost: 260, note: '防阴气反噬的定魂清心丹' },
    { itemId: 'huxin_fu', minRank: 0, cost: 250, note: '替死镇魂的阴司护心符' },
    { itemId: 'pozhang_dan', minRank: 1, cost: 680, note: '强冲鬼道瓶颈的破障丹' },
    { itemId: 'jiuyou_mingjing', minRank: 1, cost: 1550, note: '黄泉阴脉所产九幽冥晶' },
    { itemId: 'wanhun_fan', minRank: 2, cost: 3400, note: '鬼道真传标配万魂招煞幡' },
    { itemId: 'huaying_dan', minRank: 2, cost: 4700, note: '凝聚幽冥鬼婴的化婴丹' },
    { itemId: 'xukong_jing', minRank: 3, cost: 14000, note: '沟通阴阳两界的虚空晶' },
    { itemId: 'xianling_dan', minRank: 4, cost: 19500, note: '黄泉彼岸偶得的逆命仙丹' },
  ],
  sanxiu: [
    { itemId: 'shenxing_fu', minRank: 0, cost: 45, note: '跑路保命第一神器' },
    { itemId: 'liaoshang_dan', minRank: 0, cost: 60, note: '散修互助堂平价疗伤丹' },
    { itemId: 'peiyuan_dan', minRank: 0, cost: 70, note: '散修坊市口碑极佳的培元丹' },
    { itemId: 'zhuji_dan', minRank: 1, cost: 460, note: '散修联盟凑份子换来的筑基丹' },
    { itemId: 'dahuan_dan', minRank: 2, cost: 1150, note: '独行万里必备大还丹' },
    { itemId: 'jiejin_dan', minRank: 2, cost: 1500, note: '黑市渠道淘来的结金丹' },
    { itemId: 'juling_zhenfu', minRank: 3, cost: 850, note: '散修客卿自制聚灵阵符' },
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
    {
      id: 'tx_m4', tier: '执事统令', title: '中州截杀血衣叛剑', minRank: 3, minRealm: 5,
      months: 12, contribution: 2400, stones: 7800, reputation: 140, enemy: 'blade_saint_shade',
      desc: '中州古战场剑圣残影暴动，率领剑堂精锐布阵镇压，回收太古剑意。',
    },
    {
      id: 'tx_m5', tier: '长老秘诏', title: '昆仑剑冢问鼎仙灵', minRank: 4, minRealm: 7,
      months: 18, contribution: 5200, stones: 24000, reputation: 280, enemy: 'immortal_sword_remnant',
      desc: '掌教秘谕：携太玄剑令深入昆仑残界，正面击败仙剑冢镇灵以续剑脉。',
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
    {
      id: 'qy_m4', tier: '执事统令', title: '雷池降服紫霄异灵', minRank: 3, minRealm: 4,
      months: 12, contribution: 2200, stones: 6800, reputation: 145, enemy: 'thunder_sovereign',
      desc: '通天峰后山雷池异动，先天紫霄雷灵欲冲破禁制，需执事亲往镇封。',
    },
    {
      id: 'qy_m5', tier: '长老秘诏', title: '驰援中州诛灭虚空魔帝', minRank: 4, minRealm: 7,
      months: 18, contribution: 5400, stones: 26000, reputation: 320, enemy: 'void_emperor',
      desc: '域外魔帝投影窥伺中州灵脉，代表正道领袖出战，护九州万年苍生。',
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
    {
      id: 'dx_m4', tier: '执事统令', title: '北荒毒渊夺取龙胆', minRank: 3, minRealm: 4,
      months: 12, contribution: 2300, stones: 8200, reputation: 130, enemy: 'venom_wyrm',
      desc: '炼制化神圣药须以万毒黑龙之胆为君药，奉谷主令赴北荒取药。',
    },
    {
      id: 'dx_m5', tier: '长老秘诏', title: '昆仑绝巅护鼎成仙丹', minRank: 4, minRealm: 7,
      months: 18, contribution: 5100, stones: 28000, reputation: 260, enemy: 'golden_dragon_king',
      desc: '九转仙丹出炉引来太古金龙王垂涎，以长老之身护鼎力退龙王。',
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
    {
      id: 'ty_m4', tier: '执事统令', title: '净世梵音伏魔尊', minRank: 3, minRealm: 5,
      months: 12, contribution: 2450, stones: 7200, reputation: 175, enemy: 'mirror_demon',
      desc: '幻界心魔尊潜入中州惑乱僧俗，奉方丈法旨敲响梵钟破妄伏魔。',
    },
    {
      id: 'ty_m5', tier: '长老秘诏', title: '度化太古修罗战魔', minRank: 4, minRealm: 6,
      months: 18, contribution: 4900, stones: 21000, reputation: 310, enemy: 'crimson_asura',
      desc: '昆仑古战场修罗魔将苏醒，以无上佛法降魔除业，功德照彻九州。',
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
    {
      id: 'wx_m4', tier: '执事统令', title: '重启观星古殿星阵', minRank: 3, minRealm: 4,
      months: 12, contribution: 2250, stones: 7600, reputation: 145, enemy: 'star_golem',
      desc: '中州星宫遗址现世，破解上古星阵并制服失控的观星古守卫。',
    },
    {
      id: 'wx_m5', tier: '长老秘诏', title: '昆仑界海封印噬星妖', minRank: 4, minRealm: 6,
      months: 18, contribution: 5000, stones: 23000, reputation: 290, enemy: 'star_devourer',
      desc: '噬星天妖遮蔽中州星象，携书院河洛阵盘远征昆仑墟界镇杀此僚。',
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
    {
      id: 'hs_m4', tier: '执事统令', title: '冰崖问剑玄冥寒帝', minRank: 3, minRealm: 6,
      months: 15, contribution: 3100, stones: 12000, reputation: 195, enemy: 'frost_empress',
      desc: '寒山极北雪崖封存的玄冥女帝残魂苏醒，以坐忘道心平息万载寒煞。',
    },
    {
      id: 'hs_m5', tier: '长老秘诏', title: '九霄雪夜斩坠世散仙', minRank: 4, minRealm: 8,
      months: 18, contribution: 5800, stones: 32000, reputation: 340, enemy: 'fallen_immortal',
      desc: '一尊疯魔坠世散仙欲夺无灯观光阴灵泉，观主命你于云海截杀之。',
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
    {
      id: 'wb_m4', tier: '执事统令', title: '归墟深渊夺回沉船宝库', minRank: 3, minRealm: 5,
      months: 12, contribution: 2500, stones: 13500, reputation: 145, enemy: 'abyss_kraken',
      desc: '三百年前沉没归墟的万宝旗舰重现海眼，击退盘踞船骸的太虚魔章。',
    },
    {
      id: 'wb_m5', tier: '长老秘诏', title: '护送昆仑仙珍抵中州', minRank: 4, minRealm: 7,
      months: 18, contribution: 5400, stones: 42000, reputation: 290, enemy: 'yin_yang_elder',
      desc: '大乘古尊半路截杀万宝阁压轴仙珍，执总阁长老令将其击退以震商威。',
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
    {
      id: 'ws_m4', tier: '执事统令', title: '归墟收服冥海骨蛟', minRank: 3, minRealm: 3,
      months: 10, contribution: 2100, stones: 6400, reputation: 125, enemy: 'bone_dragon',
      desc: '东海骨蛟煞气冲霄、扰乱海兽迁徙，率兽堂执事将其降服抽骨。',
    },
    {
      id: 'ws_m5', tier: '长老秘诏', title: '九霄星海会猎吞界鲲', minRank: 4, minRealm: 8,
      months: 18, contribution: 5900, stones: 34000, reputation: 350, enemy: 'chaos_leviathan',
      desc: '万兽山万年一次的猎神大典：于九霄边缘采一缕混沌吞界鲲真血。',
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
    {
      id: 'jg_m4', tier: '执事统令', title: '实测元婴巨神战傀', minRank: 3, minRealm: 3,
      months: 10, contribution: 2150, stones: 6800, reputation: 130, enemy: 'iron_titan',
      desc: '新铸机关巨神傀试机暴走，须由执事正面压制并记录灵枢承压极限。',
    },
    {
      id: 'jg_m5', tier: '长老秘诏', title: '昆仑玉殿拓印神将甲纹', minRank: 4, minRealm: 6,
      months: 18, contribution: 5100, stones: 24000, reputation: 280, enemy: 'kunlun_guardian',
      desc: '昆仑古玉神将身负太古天工神纹，击败之并拓印其不朽战甲构造。',
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
    {
      id: 'xm_m4', tier: '执事统令', title: '吞并北荒血渊叛魔', minRank: 3, minRealm: 4,
      months: 12, contribution: 2400, stones: 8400, reputation: -40, enemy: 'blood_fiend_king',
      desc: '血渊魔主拥兵自立、拒纳血池贡赋，亲率魔卫踏平其老巢。',
    },
    {
      id: 'xm_m5', tier: '长老秘诏', title: '血海古渊夺祖脉魔权', minRank: 4, minRealm: 7,
      months: 18, contribution: 5600, stones: 29000, reputation: -120, enemy: 'blood_ocean_lord',
      desc: '沉睡万年的血海古祖苏醒欲夺宗门控制权，唯有杀穿血海方能称尊。',
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
    {
      id: 'hh_m4', tier: '执事统令', title: '破除裂界暗影袭杀', minRank: 3, minRealm: 4,
      months: 12, contribution: 2300, stones: 7800, reputation: 115, enemy: 'void_stalker',
      desc: '神秘暗影屡屡暗算我宗外派贵客，引蛇出洞并将其彻底抹除。',
    },
    {
      id: 'hh_m5', tier: '长老秘诏', title: '红尘情劫斩万劫魔皇', minRank: 4, minRealm: 8,
      months: 18, contribution: 5700, stones: 31000, reputation: 290, enemy: 'karmic_demon_lord',
      desc: '万劫心魔皇窥伺合欢红尘大阵，以无上真情之道将其反炼入阵。',
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
    {
      id: 'ym_m4', tier: '执事统令', title: '黄泉狱深处收服镇狱帅', minRank: 3, minRealm: 5,
      months: 12, contribution: 2550, stones: 8400, reputation: 120, enemy: 'nether_marshal',
      desc: '昔日冥府旧部镇狱帅不受调遣，执幽冥令旗将其收编或镇灭。',
    },
    {
      id: 'ym_m5', tier: '长老秘诏', title: '九霄边缘截杀域外魔仙', minRank: 4, minRealm: 9,
      months: 24, contribution: 6800, stones: 48000, reputation: 360, enemy: 'abyssal_immortal_demon',
      desc: '域外魔仙图谋倾覆黄泉轮回盘，九幽太上亲颁密诏，命你迎战仙魔。',
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
    {
      id: 'sx_m4', tier: '执事统令', title: '黑市血榜追斩血衣剑尊', minRank: 3, minRealm: 3,
      months: 10, contribution: 2150, stones: 7200, reputation: 135, enemy: 'crimson_sword',
      desc: '血衣剑尊连屠三座散修坊市，散修盟悬下重金，请你代天下散修讨债。',
    },
    {
      id: 'sx_m5', tier: '长老秘诏', title: '九霄问剑太古剑仙意念', minRank: 4, minRealm: 9,
      months: 24, contribution: 6500, stones: 45000, reputation: 400, enemy: 'primordial_sword_immortal',
      desc: '散修盟万载传说之试炼：登临九霄，向太古剑仙意念递出凡人散修的一剑。',
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
