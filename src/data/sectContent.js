/**
 * 势力深度内容（v8 换成第一纪元势力，数值沿用 v5.0）：覆盖全部 13 个势力的 6 阶藏经阁功法（78 卷）、8 阶宗门宝库（104 件）、
 * 5 阶任务堂（65 项）与 5 阶晋升试炼。
 * 所有 itemId 严格对应 items.js，enemy 严格对应 enemies.js，lawId 严格对应 realms.js。
 */

export const SECT_LIBRARIES = {
  taixuan: [
    {
      id: 'tx_lib_1', name: '《青锋养剑诀》', grade: '黄', align: '正', minRank: 0, cost: 180,
      speed: 0.08, atk: 0.1, def: 0.02, lifespan: 0, lawId: 'sword', artName: '青锋破空斩',
      desc: '外门巡山弟子的基础剑诀，以灵力温养剑锋，出剑快三分。',
    },
    {
      id: 'tx_lib_2', name: '《玄衡巡山剑》', grade: '玄', align: '正', minRank: 1, cost: 850,
      speed: 0.14, atk: 0.2, def: 0.05, lifespan: 10, lawId: 'sword', artName: '九峰分光剑',
      desc: '内门执法弟子必修，剑走符纹，一剑分作数道剑光，攻守兼备。',
    },
    {
      id: 'tx_lib_3', name: '《符剑合璧经》', grade: '地', align: '正', minRank: 2, cost: 2800,
      speed: 0.22, atk: 0.34, def: 0.08, lifespan: 30, lawId: 'sword', artName: '护脉一剑断山',
      desc: '真传所修，以剑刻符、以符催剑，专破护体灵光。',
    },
    {
      id: 'tx_lib_3b', name: '《九峰齐诛剑录》', grade: '天', align: '正', minRank: 3, cost: 5800,
      speed: 0.27, atk: 0.42, def: 0.11, lifespan: 55, lawId: 'sword', artName: '九峰齐诛剑阵',
      desc: '执事一脉执行戒条时的合击剑录，取「违者受九峰齐诛」之意。',
    },
    {
      id: 'tx_lib_4', name: '《天机阁剑藏》', grade: '天', align: '正', minRank: 4, cost: 12000,
      speed: 0.32, atk: 0.5, def: 0.14, lifespan: 80, lawId: 'sword', artName: '断脉剑意',
      desc: '天机阁所藏古剑经，录自玄衡先祖，一剑能截断灵脉流向。',
    },
    {
      id: 'tx_lib_5', name: '《玄衡开山剑典》', grade: '仙', align: '正', minRank: 5, cost: 28000,
      speed: 0.42, atk: 0.64, def: 0.22, lifespan: 160, lawId: 'sword', artName: '一剑开峰',
      desc: '传说开山先祖以剑开峰、设阵涵养矿脉时留下的剑典，只在天机阁古卷中有残载。',
    },
  ],
  qingyun: [
    {
      id: 'qy_lib_1', name: '《观星引气诀》', grade: '黄', align: '正', minRank: 0, cost: 160,
      speed: 0.1, atk: 0.05, def: 0.06, lifespan: 8, lawId: 'thunder', artName: '星位定身诀',
      desc: '监生入门的吐纳法，按时辰与星位行气，稳健，不易生心魔。',
    },
    {
      id: 'qy_lib_2', name: '《测灵雷符诀》', grade: '玄', align: '正', minRank: 1, cost: 800,
      speed: 0.16, atk: 0.16, def: 0.1, lifespan: 18, lawId: 'thunder', artName: '引雷落符',
      desc: '以罗盘读数定方位，引天雷落符，对邪祟威力倍增。',
    },
    {
      id: 'qy_lib_3', name: '《灵台录》', grade: '地', align: '正', minRank: 2, cost: 2600,
      speed: 0.24, atk: 0.24, def: 0.18, lifespan: 45, lawId: 'thunder', artName: '灵台紫电',
      desc: '灵台郎所修，记录灵气消长时以身作引，灵力绵长，可引雷护体。',
    },
    {
      id: 'qy_lib_3b', name: '《诸州观测阵录》', grade: '天', align: '正', minRank: 3, cost: 5600,
      speed: 0.29, atk: 0.3, def: 0.23, lifespan: 75, lawId: 'thunder', artName: '八方测灵雷阵',
      desc: '监丞调度各州府观测点合测天象的法门，八方读数一合，雷阵自成。',
    },
    {
      id: 'qy_lib_4', name: '《浑天推衍经》', grade: '天', align: '正', minRank: 4, cost: 11500,
      speed: 0.35, atk: 0.36, def: 0.28, lifespan: 110, lawId: 'chaos', artName: '浑天归元',
      desc: '少监以上方可研读，推衍天象与地脉的总纲，万法归于一盘。',
    },
    {
      id: 'qy_lib_5', name: '《天象总录》', grade: '仙', align: '正', minRank: 5, cost: 27500,
      speed: 0.44, atk: 0.48, def: 0.38, lifespan: 220, lawId: 'chaos', artName: '周天断劫雷',
      desc: '历代监正积下的天象底册凝成的功法，传说读通的人能推算千年大劫。',
    },
  ],
  danxia: [
    {
      id: 'dx_lib_1', name: '《药田控火诀》', grade: '黄', align: '正', minRank: 0, cost: 150,
      speed: 0.08, atk: 0.04, def: 0.05, lifespan: 15, lawId: 'pill', artName: '药火焚邪掌',
      desc: '外门基础控火术，既稳炉火，也能温养寿元。',
    },
    {
      id: 'dx_lib_2', name: '《七十二涧灵泉经》', grade: '玄', align: '正', minRank: 1, cost: 780,
      speed: 0.15, atk: 0.14, def: 0.08, lifespan: 30, lawId: 'pill', artName: '涧水九火罩',
      desc: '借七十二涧的清流调和丹火，成丹率大增，斗法时也能护身。',
    },
    {
      id: 'dx_lib_3', name: '《青木灵润丹典》', grade: '地', align: '正', minRank: 2, cost: 2500,
      speed: 0.22, atk: 0.2, def: 0.16, lifespan: 65, lawId: 'pill', artName: '青木生生印',
      desc: '取「青木灵润」之意，服丹药效倍增，生机绵长。',
    },
    {
      id: 'dx_lib_3b', name: '《护源炼道诀》', grade: '天', align: '正', minRank: 3, cost: 5500,
      speed: 0.26, atk: 0.26, def: 0.21, lifespan: 115, lawId: 'pill', artName: '护源真火',
      desc: '执事一脉守护山泉水源时所修，真火能烧穿护体法器。',
    },
    {
      id: 'dx_lib_4', name: '《云和古药经》', grade: '天', align: '正', minRank: 4, cost: 11000,
      speed: 0.3, atk: 0.3, def: 0.25, lifespan: 180, lawId: 'pill', artName: '云和净世火',
      desc: '相传为云和年间结茅立派的散修所留，修到深处可以延寿百年。',
    },
    {
      id: 'dx_lib_5', name: '《青崖造化丹经》', grade: '仙', align: '正', minRank: 5, cost: 27000,
      speed: 0.38, atk: 0.4, def: 0.34, lifespan: 320, lawId: 'pill', artName: '一炉炼万物',
      desc: '传说中的青崖镇宗丹经，宗内只存残页，以天地为炉，生机不绝。',
    },
  ],
  tianyin: [
    {
      id: 'ty_lib_1', name: '《守祠护身咒》', grade: '黄', align: '正', minRank: 0, cost: 160,
      speed: 0.07, atk: 0.06, def: 0.12, lifespan: 10, lawId: 'karma', artName: '镇邪喝',
      desc: '守祠人护持心神、强健体魄的口诀，邪祟不敢近身。',
    },
    {
      id: 'ty_lib_2', name: '《香火安魂经》', grade: '玄', align: '正', minRank: 1, cost: 820,
      speed: 0.13, atk: 0.14, def: 0.2, lifespan: 25, lawId: 'karma', artName: '香火镇魂',
      desc: '观想香火入识海，神魂稳固，诵经声能扰乱敌手灵脉。',
    },
    {
      id: 'ty_lib_3', name: '《义仓济世篇》', grade: '地', align: '正', minRank: 2, cost: 2700,
      speed: 0.2, atk: 0.26, def: 0.28, lifespan: 55, lawId: 'karma', artName: '济世护身光',
      desc: '管义仓的人所修，施粥放粮积下的善缘越多，护身之力越厚。',
    },
    {
      id: 'ty_lib_3b', name: '《祠老夜诵录》', grade: '天', align: '正', minRank: 3, cost: 5800,
      speed: 0.25, atk: 0.32, def: 0.35, lifespan: 95, lawId: 'karma', artName: '长夜诵经度厄',
      desc: '历代祠老守夜时诵读的经文，诵起时满祠香火相应。',
    },
    {
      id: 'ty_lib_4', name: '《万家香火真谛》', grade: '天', align: '正', minRank: 4, cost: 12000,
      speed: 0.3, atk: 0.38, def: 0.42, lifespan: 140, lawId: 'karma', artName: '万家灯火护身',
      desc: '以一镇香火愿力护身，因果加身而心神不乱。',
    },
    {
      id: 'ty_lib_5', name: '《古祠无名经》', grade: '仙', align: '正', minRank: 5, cost: 28000,
      speed: 0.38, atk: 0.48, def: 0.54, lifespan: 260, lawId: 'karma', artName: '一祠镇八方',
      desc: '祠中供桌下压着的古卷，不知何人所留，传说修通的人因果自清。',
    },
  ],
  wanxiang: [
    {
      id: 'wx_lib_1', name: '《供奉入门阵篇》', grade: '黄', align: '正', minRank: 0, cost: 170,
      speed: 0.1, atk: 0.06, def: 0.08, lifespan: 5, lawId: 'array', artName: '定身小阵',
      desc: '候补供奉的入门阵法，落笔成纹，困敌于方寸之间。',
    },
    {
      id: 'wx_lib_2', name: '《验仓八门阵》', grade: '玄', align: '正', minRank: 1, cost: 860,
      speed: 0.16, atk: 0.16, def: 0.16, lifespan: 15, lawId: 'array', artName: '八门锁仓阵',
      desc: '替户部验仓时所布的阵，八方锁住，账实一目了然，也能锁人。',
    },
    {
      id: 'wx_lib_3', name: '《地脉清丈策》', grade: '地', align: '正', minRank: 2, cost: 2800,
      speed: 0.25, atk: 0.26, def: 0.22, lifespan: 40, lawId: 'star', artName: '周天星位阵',
      desc: '勘验河洛地脉时用的推演法，引星位入阵，算出敌手破绽。',
    },
    {
      id: 'wx_lib_3b', name: '《内廷值守阵录》', grade: '天', align: '正', minRank: 3, cost: 5900,
      speed: 0.3, atk: 0.33, def: 0.29, lifespan: 70, lawId: 'array', artName: '宫门镇守阵',
      desc: '客卿值守内廷所用的阵录，一阵封门，一卷安宅。',
    },
    {
      id: 'wx_lib_4', name: '《宁京城防阵图》', grade: '天', align: '正', minRank: 4, cost: 12500,
      speed: 0.36, atk: 0.4, def: 0.36, lifespan: 100, lawId: 'array', artName: '九门合围',
      desc: '首席客卿方可研读，以宁京城门为阵眼的城防总图。',
    },
    {
      id: 'wx_lib_5', name: '《高祖定鼎阵典》', grade: '仙', align: '正', minRank: 5, cost: 28500,
      speed: 0.45, atk: 0.52, def: 0.48, lifespan: 200, lawId: 'star', artName: '定鼎镇天阵',
      desc: '军中传闻宁高祖攻克旧都时曾得异人以阵法相助，此卷据说即其遗法，官修史书不载。',
    },
  ],
  hanshan: [
    {
      id: 'hs_lib_1', name: '《寒营守夜诀》', grade: '黄', align: '正', minRank: 0, cost: 160,
      speed: 0.09, atk: 0.05, def: 0.09, lifespan: 18, lawId: 'time', artName: '霜刃指',
      desc: '边军守夜的吐纳法，风雪里也能稳住气息，延年益寿。',
    },
    {
      id: 'hs_lib_2', name: '《雁门淬兵经》', grade: '玄', align: '正', minRank: 1, cost: 820,
      speed: 0.16, atk: 0.15, def: 0.18, lifespan: 40, lawId: 'time', artName: '冻土封锋',
      desc: '以寒气淬炼兵刃与筋骨，伤口不溃，岁月也慢上几分。',
    },
    {
      id: 'hs_lib_3', name: '《烽燧长夜卷》', grade: '地', align: '正', minRank: 2, cost: 2700,
      speed: 0.24, atk: 0.24, def: 0.25, lifespan: 90, lawId: 'time', artName: '一念枯荣刀',
      desc: '老卒在烽燧上熬出来的心法，在长夜里看清光阴流动。',
    },
    {
      id: 'hs_lib_3b', name: '《校尉守关录》', grade: '天', align: '正', minRank: 3, cost: 5800,
      speed: 0.29, atk: 0.31, def: 0.32, lifespan: 140, lawId: 'time', artName: '永夜封关',
      desc: '校尉以上修习的守关心法，一念之下寒光封住关门。',
    },
    {
      id: 'hs_lib_4', name: '《长塞镇北真经》', grade: '天', align: '正', minRank: 4, cost: 12000,
      speed: 0.34, atk: 0.38, def: 0.38, lifespan: 200, lawId: 'time', artName: '凝时之瞳',
      desc: '据说是修长塞时匠头营老匠留下的心法，一念能让敌手动作滞住。',
    },
    {
      id: 'hs_lib_5', name: '《雁门古塞经》', grade: '仙', align: '正', minRank: 5, cost: 28000,
      speed: 0.42, atk: 0.48, def: 0.48, lifespan: 360, lawId: 'time', artName: '岁月断关',
      desc: '传说前朝筑塞时埋在关基下的古卷，执掌枯荣，看尽关前兴废。',
    },
  ],
  wanbao: [
    {
      id: 'wb_lib_1', name: '《井盟算诀》', grade: '黄', align: '中', minRank: 0, cost: 160,
      speed: 0.09, atk: 0.07, def: 0.06, lifespan: 5, lawId: 'space', artName: '落宝金光手',
      desc: '伙计入门的心法，以灵石布小聚灵阵助修，也能看出法器的破绽。',
    },
    {
      id: 'wb_lib_2', name: '《驼队御器录》', grade: '玄', align: '中', minRank: 1, cost: 840,
      speed: 0.15, atk: 0.18, def: 0.14, lifespan: 15, lawId: 'space', artName: '百货星雨',
      desc: '同时催动数件法器齐发，靠家底压住同阶敌手。',
    },
    {
      id: 'wb_lib_3', name: '《货栈纳物诀》', grade: '地', align: '中', minRank: 2, cost: 2700,
      speed: 0.23, atk: 0.26, def: 0.22, lifespan: 40, lawId: 'space', artName: '袖里藏货',
      desc: '参悟空间挪移之法，既能随身藏货，也能折空伤敌。',
    },
    {
      id: 'wb_lib_3b', name: '《大掌柜护货录》', grade: '天', align: '中', minRank: 3, cost: 5700,
      speed: 0.28, atk: 0.33, def: 0.27, lifespan: 70, lawId: 'space', artName: '落宝金虹',
      desc: '大掌柜一脉护货的功法，弹指之间夺下敌手法器。',
    },
    {
      id: 'wb_lib_4', name: '《十三井盟秘典》', grade: '天', align: '中', minRank: 4, cost: 12000,
      speed: 0.34, atk: 0.4, def: 0.32, lifespan: 100, lawId: 'space', artName: '井盟聚宝阵',
      desc: '总号所藏，据说出自当年立石为誓的商贾之祖，通晓商道与空间。',
    },
    {
      id: 'wb_lib_5', name: '《通远万里经》', grade: '仙', align: '中', minRank: 5, cost: 28000,
      speed: 0.43, atk: 0.52, def: 0.42, lifespan: 200, lawId: 'space', artName: '万里货海',
      desc: '传说商会历代东家口口相传的功法，一念开处，千件货物随身。',
    },
  ],
  wanshou: [
    {
      id: 'ws_lib_1', name: '《草滩淬体功》', grade: '黄', align: '中', minRank: 0, cost: 160,
      speed: 0.08, atk: 0.09, def: 0.08, lifespan: 12, lawId: 'blood', artName: '苍狼裂山爪',
      desc: '照着狼群与马群的搏杀锤炼筋骨，气血浑厚。',
    },
    {
      id: 'ws_lib_2', name: '《驯鹰通灵经》', grade: '玄', align: '中', minRank: 1, cost: 820,
      speed: 0.14, atk: 0.18, def: 0.16, lifespan: 28, lawId: 'blood', artName: '群鹰扑击',
      desc: '与鹰马心神相连，借兽力增幅自身战力。',
    },
    {
      id: 'ws_lib_3', name: '《良马奔雷诀》', grade: '地', align: '中', minRank: 2, cost: 2700,
      speed: 0.22, atk: 0.3, def: 0.26, lifespan: 65, lawId: 'blood', artName: '万马踏营',
      desc: '一拳一脚带着马群冲阵的力道。',
    },
    {
      id: 'ws_lib_3b', name: '《冬营战经》', grade: '天', align: '中', minRank: 3, cost: 5800,
      speed: 0.27, atk: 0.38, def: 0.32, lifespan: 110, lawId: 'blood', artName: '冬营破围啸',
      desc: '千骑长统御部众争夺冬营的战法，血气沸腾如兽群出栏。',
    },
    {
      id: 'ws_lib_4', name: '《朔川祖灵经》', grade: '天', align: '中', minRank: 4, cost: 12000,
      speed: 0.32, atk: 0.45, def: 0.38, lifespan: 160, lawId: 'chaos', artName: '祖灵法相',
      desc: '部族长老口口相传的古经，化出祖灵法相号令兽群。',
    },
    {
      id: 'ws_lib_5', name: '《草滩万古经》', grade: '仙', align: '中', minRank: 5, cost: 28000,
      speed: 0.41, atk: 0.58, def: 0.48, lifespan: 280, lawId: 'chaos', artName: '苍天兽潮',
      desc: '传说朔部先祖留在草滩深处石堆下的经文，肉身成圣，力能开山。',
    },
  ],
  jiguan: [
    {
      id: 'jg_lib_1', name: '《炉坊机巧录》', grade: '黄', align: '中', minRank: 0, cost: 160,
      speed: 0.08, atk: 0.08, def: 0.1, lifespan: 5, lawId: 'array', artName: '连珠破甲弩',
      desc: '学徒先学的机巧与符纹，以器补道。',
    },
    {
      id: 'jg_lib_2', name: '《矿车铁傀典》', grade: '玄', align: '中', minRank: 1, cost: 840,
      speed: 0.15, atk: 0.18, def: 0.2, lifespan: 20, lawId: 'array', artName: '铁傀齐鸣',
      desc: '炼制灵核铁傀随身护法，铁壁难摧。',
    },
    {
      id: 'jg_lib_3', name: '《磁砂神兵谱》', grade: '地', align: '中', minRank: 2, cost: 2800,
      speed: 0.22, atk: 0.3, def: 0.28, lifespan: 45, lawId: 'star', artName: '磁砂星陨弩',
      desc: '以磁砂与铭文炼器，本命法器威力倍增。',
    },
    {
      id: 'jg_lib_3b', name: '《炉头统御策》', grade: '天', align: '中', minRank: 3, cost: 5900,
      speed: 0.27, atk: 0.37, def: 0.35, lifespan: 75, lawId: 'array', artName: '万弩覆谷',
      desc: '炉头掌管全坊炉火所用的秘录，一念操纵上百具铁傀成阵。',
    },
    {
      id: 'jg_lib_4', name: '《铜谷大炉图》', grade: '天', align: '中', minRank: 4, cost: 12500,
      speed: 0.32, atk: 0.44, def: 0.42, lifespan: 110, lawId: 'array', artName: '大炉镇谷',
      desc: '大匠以上才看得到的图谱，可将洞府改造成战时炉堡。',
    },
    {
      id: 'jg_lib_5', name: '《古修炼器总纲》', grade: '仙', align: '中', minRank: 5, cost: 28500,
      speed: 0.4, atk: 0.56, def: 0.54, lifespan: 220, lawId: 'star', artName: '星火战堡',
      desc: '据说从赤霞旧府残器上拓下的炼器总纲，巧夺天工。',
    },
  ],
  xuemo: [
    {
      id: 'xm_lib_1', name: '《燃血化灵诀》', grade: '黄', align: '邪', minRank: 0, cost: 170,
      speed: 0.14, atk: 0.12, def: 0.02, lifespan: -5, lawId: 'blood', artName: '猩红裂血斩',
      desc: '遗脉速成之法，以气血催动暴烈灵力，攻伐凶狠。',
    },
    {
      id: 'xm_lib_2', name: '《掠灵吞脉经》', grade: '玄', align: '邪', minRank: 1, cost: 860,
      speed: 0.22, atk: 0.24, def: 0.08, lifespan: 10, lawId: 'blood', artName: '血河滔天',
      desc: '以战养战，夺敌手精气反哺己身。',
    },
    {
      id: 'xm_lib_3', name: '《赤霞血海真经》', grade: '地', align: '邪', minRank: 2, cost: 2900,
      speed: 0.32, atk: 0.38, def: 0.14, lifespan: 30, lawId: 'blood', artName: '赤霞血狱',
      desc: '遗脉镇脉之典，化丹田为血海，血海不枯，身就不灭。',
    },
    {
      id: 'xm_lib_3b', name: '《天火化血录》', grade: '天', align: '邪', minRank: 3, cost: 6000,
      speed: 0.38, atk: 0.47, def: 0.19, lifespan: 55, lawId: 'blood', artName: '化血神刀',
      desc: '执法一脉的凶厉功法，取赤霞旧府妄引天火的旧法，煞气蔽日。',
    },
    {
      id: 'xm_lib_4', name: '《磁砂不灭血经》', grade: '天', align: '邪', minRank: 4, cost: 12500,
      speed: 0.44, atk: 0.56, def: 0.24, lifespan: 90, lawId: 'blood', artName: '血神子噬天',
      desc: '传说赤霞古修争夺地心磁砂时所修，滴血重生。',
    },
    {
      id: 'xm_lib_5', name: '《赤霞旧府覆天经》', grade: '仙', align: '邪', minRank: 5, cost: 29000,
      speed: 0.54, atk: 0.68, def: 0.34, lifespan: 180, lawId: 'blood', artName: '血海吞沙',
      desc: '遗脉至高禁典，据说正是令赤霞旧府灵根崩毁的那一路法门。',
    },
  ],
  hehuan: [
    {
      id: 'hh_lib_1', name: '《沙影迷步诀》', grade: '黄', align: '邪', minRank: 0, cost: 160,
      speed: 0.11, atk: 0.07, def: 0.06, lifespan: 12, lawId: 'karma', artName: '迷眼沙幕',
      desc: '在沙暴里来去的身法，叫人看不清虚实。',
    },
    {
      id: 'hh_lib_2', name: '《控井谈价录》', grade: '玄', align: '邪', minRank: 1, cost: 840,
      speed: 0.19, atk: 0.16, def: 0.12, lifespan: 35, lawId: 'karma', artName: '缚心牵丝',
      desc: '以言语与气机牵动人心，谈价时先占三分。',
    },
    {
      id: 'hh_lib_3', name: '《沙暴惑心经》', grade: '地', align: '邪', minRank: 2, cost: 2700,
      speed: 0.28, atk: 0.28, def: 0.18, lifespan: 70, lawId: 'karma', artName: '惑心大法',
      desc: '直指敌手心中破绽，于无声处扰乱神魂。',
    },
    {
      id: 'hh_lib_3b', name: '《七情锁心诀》', grade: '天', align: '邪', minRank: 3, cost: 5800,
      speed: 0.33, atk: 0.35, def: 0.23, lifespan: 110, lawId: 'karma', artName: '七情焚心',
      desc: '头目一脉的秘法，引动敌手七情翻涌，谈笑间瓦解战意。',
    },
    {
      id: 'hh_lib_4', name: '《井主因果典》', grade: '天', align: '邪', minRank: 4, cost: 12000,
      speed: 0.38, atk: 0.42, def: 0.28, lifespan: 160, lawId: 'karma', artName: '因果万劫丝',
      desc: '握着井的人握着过路人的命，此典以往来恩怨为丝。',
    },
    {
      id: 'hh_lib_5', name: '《流沙古誓经》', grade: '仙', align: '邪', minRank: 5, cost: 28000,
      speed: 0.48, atk: 0.54, def: 0.38, lifespan: 280, lawId: 'karma', artName: '古誓沙葬',
      desc: '传说十三大井立誓之前的沙道古法，违誓者沙暴活埋。',
    },
  ],
  youming: [
    {
      id: 'ym_lib_1', name: '《闸下闭气诀》', grade: '黄', align: '邪', minRank: 0, cost: 160,
      speed: 0.1, atk: 0.09, def: 0.05, lifespan: 8, lawId: 'space', artName: '暗水锁喉',
      desc: '水寇入门的闭气法，在水下待得比常人久，也能驱使水流缠敌。',
    },
    {
      id: 'ym_lib_2', name: '《芦荡百影图》', grade: '玄', align: '邪', minRank: 1, cost: 850,
      speed: 0.17, atk: 0.2, def: 0.12, lifespan: 25, lawId: 'space', artName: '芦荡百影',
      desc: '在芦荡里分出数道人影，让敌手防不胜防。',
    },
    {
      id: 'ym_lib_3', name: '《旧河闸生死诀》', grade: '地', align: '邪', minRank: 2, cost: 2800,
      speed: 0.26, atk: 0.32, def: 0.2, lifespan: 55, lawId: 'time', artName: '断闸夺命',
      desc: '掌握闸门启闭的时辰，以水势断人生路。',
    },
    {
      id: 'ym_lib_3b', name: '《舵主夜劫录》', grade: '天', align: '邪', minRank: 3, cost: 5900,
      speed: 0.31, atk: 0.39, def: 0.26, lifespan: 95, lawId: 'time', artName: '夜劫夺寿',
      desc: '舵主劫船时所修的秘录，一招削去敌手生机。',
    },
    {
      id: 'ym_lib_4', name: '《大江逆流经》', grade: '天', align: '邪', minRank: 4, cost: 12200,
      speed: 0.36, atk: 0.46, def: 0.32, lifespan: 140, lawId: 'time', artName: '逆流寂灭',
      desc: '据说是前朝治水老吏留下的残卷，被寨里改成了杀人的法门。',
    },
    {
      id: 'ym_lib_5', name: '《黑风古闸经》', grade: '仙', align: '邪', minRank: 5, cost: 28500,
      speed: 0.46, atk: 0.58, def: 0.42, lifespan: 260, lawId: 'time', artName: '大江倒悬',
      desc: '传说旧河闸初建时压在闸基下的古卷，执掌一江水势。',
    },
  ],
  sanxiu: [
    {
      id: 'sx_lib_1', name: '《野修吐纳杂录》', grade: '黄', align: '中', minRank: 0, cost: 140,
      speed: 0.08, atk: 0.07, def: 0.07, lifespan: 8, lawId: 'space', artName: '草莽搏命斩',
      desc: '前辈散修拼凑出的保命法门，招式刁钻实用。',
    },
    {
      id: 'sx_lib_2', name: '《行脚游云诀》', grade: '玄', align: '中', minRank: 1, cost: 780,
      speed: 0.15, atk: 0.16, def: 0.15, lifespan: 25, lawId: 'space', artName: '流云断水步',
      desc: '行脚散修流传的轻身与斗法功夫，打得过就打，打不过就走。',
    },
    {
      id: 'sx_lib_3', name: '《百家问道集》', grade: '地', align: '中', minRank: 2, cost: 2500,
      speed: 0.24, atk: 0.28, def: 0.22, lifespan: 55, lawId: 'chaos', artName: '百家合流破法式',
      desc: '兼采各家之长，不拘一格，专为无门无户的人所编。',
    },
    {
      id: 'sx_lib_3b', name: '《五域游侠剑气策》', grade: '天', align: '中', minRank: 3, cost: 5500,
      speed: 0.3, atk: 0.36, def: 0.28, lifespan: 90, lawId: 'space', artName: '万里孤鸿斩',
      desc: '各地散修互抄互补攒成的剑策，应变无方。',
    },
    {
      id: 'sx_lib_4', name: '《红尘独行经》', grade: '天', align: '中', minRank: 4, cost: 11000,
      speed: 0.36, atk: 0.44, def: 0.34, lifespan: 130, lawId: 'chaos', artName: '自在一指',
      desc: '据说是一位走遍五域的散修所留，天地为炉，万法为师。',
    },
    {
      id: 'sx_lib_5', name: '《无拘太虚经》', grade: '仙', align: '中', minRank: 5, cost: 27000,
      speed: 0.46, atk: 0.56, def: 0.44, lifespan: 250, lawId: 'chaos', artName: '天地自在',
      desc: '传说中散修独证大道的功法，不借宗门气运，只有残篇在坊间流传。',
    },
  ],
};

export const SECT_TREASURY = {
  taixuan: [
    { itemId: 'qingfeng_jian', minRank: 0, cost: 180, note: '外门巡山弟子的制式佩剑' },
    { itemId: 'zhuji_dan', minRank: 0, cost: 420, note: '助外门弟子稳固筑基' },
    { itemId: 'jianqi_fu', minRank: 1, cost: 340, note: '执法堂亲封的剑意玉符' },
    { itemId: 'leimu', minRank: 1, cost: 620, note: '刻护脉阵纹用的雷纹灵木' },
    { itemId: 'jiejin_dan', minRank: 1, cost: 1400, note: '内门结丹配额灵丹' },
    { itemId: 'huaying_dan', minRank: 2, cost: 4800, note: '真传弟子破境元婴的赐药' },
    { itemId: 'taixu_jian', minRank: 3, cost: 9200, note: '执事配发的通灵飞剑' },
    { itemId: 'faze_canpian', minRank: 4, cost: 11000, note: '天机阁收存的地脉残片' },
  ],
  qingyun: [
    { itemId: 'liaoshang_dan', minRank: 0, cost: 60, note: '下州府查验观测点时常备' },
    { itemId: 'qingxin_dan', minRank: 0, cost: 280, note: '值夜观星前服下，澄心静气' },
    { itemId: 'zhuji_dan', minRank: 0, cost: 400, note: '监中按例配发的筑基丹' },
    { itemId: 'jiejin_dan', minRank: 1, cost: 1350, note: '司辰以上的结丹配额' },
    { itemId: 'zixiao_ling', minRank: 2, cost: 2800, note: '观测台上测雷用的铜铃' },
    { itemId: 'leiyuan_dan', minRank: 2, cost: 4200, note: '引雷入体时所需的宝丹' },
    { itemId: 'huashen_dan', minRank: 3, cost: 8500, note: '监中秘藏，只赐监丞以上' },
    { itemId: 'tianjie_dan', minRank: 4, cost: 18000, note: '监中私库所藏，据说可抵雷劫' },
  ],
  danxia: [
    { itemId: 'lingcao', minRank: 0, cost: 35, note: '谷中药田日常收成' },
    { itemId: 'juling_dan', minRank: 0, cost: 240, note: '宗门自炼聚灵丹，价钱极低' },
    { itemId: 'qiannian_lingcao', minRank: 1, cost: 220, note: '七十二涧深处采得的老药' },
    { itemId: 'dahuan_dan', minRank: 1, cost: 950, note: '青崖秘制的救命大还丹' },
    { itemId: 'xisui_dan', minRank: 2, cost: 1600, note: '洗髓易筋的上品丹丸' },
    { itemId: 'yanshou_dan', minRank: 3, cost: 4600, note: '执事配额的延寿丹' },
    { itemId: 'jiuzhuan_dan', minRank: 4, cost: 13000, note: '青崖镇宗之丹，九转方成' },
    { itemId: 'changsheng_guo', minRank: 5, cost: 26000, note: '谷中古树数百年才结的一枚果子' },
  ],
  tianyin: [
    { itemId: 'jingang_fu', minRank: 0, cost: 95, note: '守祠人常备的护身符' },
    { itemId: 'qingxin_dan', minRank: 0, cost: 220, note: '香火熏过的清心丹' },
    { itemId: 'huxin_fu', minRank: 0, cost: 240, note: '祠老亲手画的护心符' },
    { itemId: 'poxie_fu', minRank: 1, cost: 360, note: '以朱砂手绘的镇邪符' },
    { itemId: 'dahuan_dan', minRank: 1, cost: 1100, note: '镇民捐进祠里的救命药' },
    { itemId: 'huaying_dan', minRank: 2, cost: 4600, note: '司仓以上破境所用' },
    { itemId: 'donghuang_zhong', minRank: 3, cost: 12000, note: '祠中镇邪的古钟' },
    { itemId: 'dao_fruit', minRank: 4, cost: 16000, note: '祠后老树结的果子，据说能开悟' },
  ],
  wanxiang: [
    { itemId: 'shenxing_fu', minRank: 0, cost: 50, note: '供奉出京办差的神行符' },
    { itemId: 'huiling_dan', minRank: 0, cost: 65, note: '布阵耗灵时的常备回灵丹' },
    { itemId: 'xingchen_sha', minRank: 1, cost: 1400, note: '布阵用的星砂，户部拨付' },
    { itemId: 'yujian_bagua', minRank: 2, cost: 3400, note: '内廷藏阁抄出的阵简' },
    { itemId: 'huashen_dan', minRank: 2, cost: 7800, note: '内廷赐给上供奉的宝丹' },
    { itemId: 'faze_canpian', minRank: 3, cost: 10500, note: '勘验地脉时取回的残片' },
    { itemId: 'xinghe_shan', minRank: 3, cost: 11800, note: '客卿值守内廷时所持的羽扇' },
    { itemId: 'xukong_jing', minRank: 4, cost: 15000, note: '推演城防大阵所需的灵晶' },
  ],
  hanshan: [
    { itemId: 'qingxin_dan', minRank: 0, cost: 240, note: '守夜防寒、稳心神的军药' },
    { itemId: 'zhuji_dan', minRank: 0, cost: 420, note: '军中按功配发的筑基丹' },
    { itemId: 'hanbing_jian', minRank: 1, cost: 850, note: '雁门匠头营淬过寒的长剑' },
    { itemId: 'jiejin_dan', minRank: 1, cost: 1400, note: '什长以上的结丹配额' },
    { itemId: 'bingxin_dan', minRank: 2, cost: 2100, note: '关外雪莲炼成的冰心丹' },
    { itemId: 'yuanying_dan', minRank: 2, cost: 5600, note: '队正以上闭关所需的元婴丹' },
    { itemId: 'guangyin_lu', minRank: 3, cost: 9800, note: '烽燧上晨凝的一滴朝露' },
    { itemId: 'tiandao_lotus', minRank: 4, cost: 22000, note: '关外雪山深处偶得的莲子' },
  ],
  wanbao: [
    { itemId: 'shenxing_fu', minRank: 0, cost: 45, note: '驼队遇沙暴时逃命用' },
    { itemId: 'xuantie', minRank: 0, cost: 120, note: '商会批量收进的玄铁' },
    { itemId: 'huxin_fu', minRank: 0, cost: 230, note: '押货保命的护心符' },
    { itemId: 'pozhang_dan', minRank: 1, cost: 650, note: '货栈里最抢手的破障丹' },
    { itemId: 'xisui_dan', minRank: 2, cost: 1700, note: '总号内部折价的洗髓丹' },
    { itemId: 'suodi_fu', minRank: 2, cost: 1100, note: '跑长路时省脚程的符' },
    { itemId: 'qiankun_jie', minRank: 3, cost: 14500, note: '能装下一整车货的须弥戒' },
    { itemId: 'xianling_dan', minRank: 4, cost: 20000, note: '总号库底压箱的丹药' },
  ],
  wanshou: [
    { itemId: 'liaoshang_dan', minRank: 0, cost: 55, note: '驯马驯鹰受伤时常备' },
    { itemId: 'yaoshou_neidan', minRank: 0, cost: 190, note: '猎得的兽丹，部族里拿来换粮' },
    { itemId: 'qiannian_lingcao', minRank: 1, cost: 250, note: '草滩深处采得的老药' },
    { itemId: 'juling_dan', minRank: 1, cost: 280, note: '以兽丹辅炼的聚灵丹' },
    { itemId: 'duangu_dan', minRank: 2, cost: 3100, note: '以兽血淬骨的锻骨丹' },
    { itemId: 'huaying_dan', minRank: 2, cost: 4900, note: '百骑长以上的破境药' },
    { itemId: 'longxue_jing', minRank: 3, cost: 6800, note: '部族世代珍藏的兽血精' },
    { itemId: 'dao_fruit', minRank: 4, cost: 16500, note: '长老们说是祖灵赐下的果子' },
  ],
  jiguan: [
    { itemId: 'xuantie', minRank: 0, cost: 100, note: '铜谷矿里精炼的玄铁' },
    { itemId: 'huxin_fu', minRank: 0, cost: 240, note: '炉坊自制的护身玉符' },
    { itemId: 'leimu', minRank: 1, cost: 580, note: '制作铁傀灵核的雷击木' },
    { itemId: 'xuanwu_dun', minRank: 1, cost: 920, note: '坊中精铸的墨盾' },
    { itemId: 'xingchen_sha', minRank: 1, cost: 1300, note: '炉中提炼的星砂' },
    { itemId: 'bagua_xuanjia', minRank: 3, cost: 9600, note: '总炉头亲手打的护甲' },
    { itemId: 'xukong_jing', minRank: 3, cost: 13500, note: '炼本命法器时所需的灵晶' },
    { itemId: 'faze_canpian', minRank: 4, cost: 11500, note: '古修残器上拆下的铭文碎片' },
  ],
  xuemo: [
    { itemId: 'yinqi_dan', minRank: 0, cost: 25, note: '以掠来的气血炼成的引气丹' },
    { itemId: 'pozhang_dan', minRank: 0, cost: 580, note: '遗脉最爱用的强行破障丹' },
    { itemId: 'dahuan_dan', minRank: 1, cost: 1050, note: '以血精炼制的大还丹' },
    { itemId: 'xuesha_jing', minRank: 1, cost: 1900, note: '残殿深处凝成的血煞之核' },
    { itemId: 'yuanying_dan', minRank: 2, cost: 5200, note: '从别人洞府里抢来的元婴丹' },
    { itemId: 'longxue_jing', minRank: 2, cost: 6400, note: '淬炼掠灵之体的兽血精' },
    { itemId: 'yujian_xuesha', minRank: 3, cost: 12500, note: '残殿中掘出的骨简' },
    { itemId: 'tianjie_dan', minRank: 4, cost: 17500, note: '硬抗雷劫的禁丹，用者多半疯魔' },
  ],
  hehuan: [
    { itemId: 'huiling_dan', minRank: 0, cost: 60, note: '守井熬夜时提神的回灵丹' },
    { itemId: 'zhuji_dan', minRank: 0, cost: 430, note: '从商队货里截下的筑基丹' },
    { itemId: 'zhuyan_dan', minRank: 1, cost: 1050, note: '沙风里护住面皮的驻颜丹' },
    { itemId: 'jiejin_dan', minRank: 1, cost: 1380, note: '刀手以上的结丹配额' },
    { itemId: 'xisui_dan', minRank: 1, cost: 1750, note: '劫来的洗髓丹，来路不问' },
    { itemId: 'yangshen_dan', minRank: 2, cost: 2900, note: '温养神魂的养神丹' },
    { itemId: 'huashen_dan', minRank: 3, cost: 8200, note: '二当家私库里的化神丹' },
    { itemId: 'jiuzhuan_dan', minRank: 4, cost: 14000, note: '据说劫自一支走错路的西荒驼队' },
  ],
  youming: [
    { itemId: 'qingxin_dan', minRank: 0, cost: 260, note: '水下憋气久了，用它定神' },
    { itemId: 'huxin_fu', minRank: 0, cost: 250, note: '劫船时贴在胸口的护心符' },
    { itemId: 'pozhang_dan', minRank: 1, cost: 680, note: '强冲瓶颈的破障丹' },
    { itemId: 'jiuyou_mingjing', minRank: 1, cost: 1550, note: '旧河闸底淤泥里捞出的阴寒晶石' },
    { itemId: 'wanhun_fan', minRank: 2, cost: 3400, note: '舵主劫船时插在船头的招煞幡' },
    { itemId: 'huaying_dan', minRank: 2, cost: 4700, note: '小头目以上破境所用的化婴丹' },
    { itemId: 'xukong_jing', minRank: 3, cost: 14000, note: '从沉船里捞出的灵晶' },
    { itemId: 'xianling_dan', minRank: 4, cost: 19500, note: '寨中库底压箱的丹药' },
  ],
  sanxiu: [
    { itemId: 'shenxing_fu', minRank: 0, cost: 45, note: '跑路保命头一件' },
    { itemId: 'liaoshang_dan', minRank: 0, cost: 60, note: '散修互相凑钱买的疗伤丹' },
    { itemId: 'peiyuan_dan', minRank: 0, cost: 70, note: '坊间口碑最好的培元丹' },
    { itemId: 'zhuji_dan', minRank: 1, cost: 460, note: '几个散修凑份子换来的筑基丹' },
    { itemId: 'dahuan_dan', minRank: 2, cost: 1150, note: '独行远路必备' },
    { itemId: 'jiejin_dan', minRank: 2, cost: 1500, note: '黑市里淘来的结丹丹药' },
    { itemId: 'juling_zhenfu', minRank: 3, cost: 850, note: '散修自制的聚灵阵符' },
    { itemId: 'faze_canpian', minRank: 4, cost: 12000, note: '旧战场遗落的残片' },
  ],
};

export const SECT_MISSIONS = {
  taixuan: [
    {
      id: 'tx_m1', tier: '外门差事', title: '巡查周边私矿', minRank: 0, minRealm: 0,
      months: 3, contribution: 90, stones: 80, reputation: 6, enemy: 'rogue',
      desc: '把偷采灵石的散修和邪修赶出玄衡矿界，顺手登记各矿产出，记进《外门物料录》。',
    },
    {
      id: 'tx_m2', tier: '内门悬赏', title: '追缉携图叛逃弟子', minRank: 1, minRealm: 1,
      months: 6, contribution: 340, stones: 420, reputation: 25, enemy: 'cultivator',
      desc: '一名弟子窃走护脉阵图往铜谷方向逃了，将他擒回，或就地正法。',
    },
    {
      id: 'tx_m3', tier: '真传密令', title: '镇压阵眼躁动古灵', minRank: 2, minRealm: 3,
      months: 9, contribution: 1250, stones: 2400, reputation: 80, enemy: 'sword_phantom',
      desc: '护脉大阵阵眼年久失修，阵中残存的古修剑意暴走，需真传以上入阵压制。',
    },
    {
      id: 'tx_m4', tier: '执事统令', title: '白驼残殿收回古剑意', minRank: 3, minRealm: 5,
      months: 12, contribution: 2400, stones: 7800, reputation: 140, enemy: 'blade_saint_shade',
      desc: '天机阁古卷记载白驼残殿里封着古修剑意，率执法弟子入沙，镇压暴动的残影。',
    },
    {
      id: 'tx_m5', tier: '长老秘诏', title: '赤霞旧府深处续剑脉', minRank: 4, minRealm: 7,
      months: 18, contribution: 5200, stones: 24000, reputation: 280, enemy: 'immortal_sword_remnant',
      desc: '掌门秘谕：持玄衡令深入赤霞旧府，击败镇守古剑的残灵，带回失传的剑脉。',
    },
  ],
  qingyun: [
    {
      id: 'qy_m1', tier: '监生差遣', title: '护送观测员下乡', minRank: 0, minRealm: 0,
      months: 3, contribution: 85, stones: 75, reputation: 10, enemy: 'wolf',
      desc: '护送观测员到青石镇一带量灵气，途中赶走扰人的山狼。',
    },
    {
      id: 'qy_m2', tier: '司辰差遣', title: '查封掠灵邪坛', minRank: 1, minRealm: 2,
      months: 6, contribution: 380, stones: 480, reputation: 35, enemy: 'blood_cult',
      desc: '南泽有人设坛抽取凡人气血，罗盘读数连日异常，奉命查清并拔除。',
    },
    {
      id: 'qy_m3', tier: '灵台密令', title: '驰援雁门观测点', minRank: 2, minRealm: 3,
      months: 9, contribution: 1300, stones: 2500, reputation: 95, enemy: 'demon_general',
      desc: '雁门外的观测点报来异兽冲关，随边军出关，斩杀领头的大妖。',
    },
    {
      id: 'qy_m4', tier: '监丞统令', title: '平息观测台雷灵', minRank: 3, minRealm: 4,
      months: 12, contribution: 2200, stones: 6800, reputation: 145, enemy: 'thunder_sovereign',
      desc: '宁京观测台引雷过度，雷中生出灵物冲撞禁制，需监丞亲往镇封。',
    },
    {
      id: 'qy_m5', tier: '监正秘诏', title: '封堵天象裂隙', minRank: 4, minRealm: 7,
      months: 18, contribution: 5400, stones: 26000, reputation: 320, enemy: 'void_emperor',
      desc: '天象底册记下一道裂隙正在扩大，奉监正密令赴白驼，镇杀从裂隙里走出来的东西。',
    },
  ],
  danxia: [
    {
      id: 'dx_m1', tier: '外门差事', title: '看守药炉', minRank: 0, minRealm: 0,
      months: 3, contribution: 90, stones: 110, reputation: 5, enemy: null,
      desc: '昼夜照看丹房炉火，调和药性，别让灵草焦了。',
    },
    {
      id: 'dx_m2', tier: '内门悬赏', title: '七十二涧采老药', minRank: 1, minRealm: 1,
      months: 6, contribution: 350, stones: 520, reputation: 20, enemy: 'poison_python',
      desc: '深入七十二涧采罕见的老药，提防盘在药丛里的毒蟒。',
    },
    {
      id: 'dx_m3', tier: '真传密令', title: '菱湖深水取药引', minRank: 2, minRealm: 3,
      months: 9, contribution: 1280, stones: 2800, reputation: 75, enemy: 'abyss_leviathan',
      desc: '炼一炉大丹缺一味菱湖深水里的药引，湖底有巨物守着，需真传下水周旋。',
    },
    {
      id: 'dx_m4', tier: '执事统令', title: '铜谷毒渊取胆', minRank: 3, minRealm: 4,
      months: 12, contribution: 2300, stones: 8200, reputation: 130, enemy: 'venom_wyrm',
      desc: '私矿废坑积成毒渊，坑底毒物之胆可作君药，奉宗主令前往。',
    },
    {
      id: 'dx_m5', tier: '长老秘诏', title: '护鼎成丹', minRank: 4, minRealm: 7,
      months: 18, contribution: 5100, stones: 28000, reputation: 260, enemy: 'golden_dragon_king',
      desc: '镇宗之丹出炉时异香引来古兽，以长老之身守在鼎边，把它逼退。',
    },
  ],
  tianyin: [
    {
      id: 'ty_m1', tier: '杂役差事', title: '乱坟岗安魂', minRank: 0, minRealm: 1,
      months: 3, contribution: 100, stones: 70, reputation: 15, enemy: 'ghost',
      desc: '大水过后，镇外乱坟岗夜里不安宁。去诵经烧纸，镇住执念不散的怨魂。',
    },
    {
      id: 'ty_m2', tier: '庙祝差事', title: '捣毁邪教香堂', minRank: 1, minRealm: 2,
      months: 6, contribution: 370, stones: 420, reputation: 40, enemy: 'blood_cult',
      desc: '有人借祠庙之名在灾民里拉人设坛，前去查明，捣毁香堂。',
    },
    {
      id: 'ty_m3', tier: '司仓密托', title: '镇压废窑凶灵', minRank: 2, minRealm: 3,
      months: 9, contribution: 1320, stones: 2200, reputation: 105, enemy: 'ghost_king',
      desc: '青石老窑深处出了凶物，接连有人失踪，主祠命你入窑镇压。',
    },
    {
      id: 'ty_m4', tier: '主祠统令', title: '破除惑心邪物', minRank: 3, minRealm: 5,
      months: 12, contribution: 2450, stones: 7200, reputation: 175, enemy: 'mirror_demon',
      desc: '一件邪物在宁京惑乱人心，镇民托祠里出面，入京除邪。',
    },
    {
      id: 'ty_m5', tier: '祠老秘托', title: '安葬古战场亡魂', minRank: 4, minRealm: 6,
      months: 18, contribution: 4900, stones: 21000, reputation: 310, enemy: 'crimson_asura',
      desc: '雁门外堡废垒下的古战魔醒了，以守祠经文降伏它，让关前亡魂入土。',
    },
  ],
  wanxiang: [
    {
      id: 'wx_m1', tier: '候补差遣', title: '校勘户部旧账', minRank: 0, minRealm: 0,
      months: 3, contribution: 88, stones: 85, reputation: 8, enemy: null,
      desc: '替户部核对旧年税册与实亩，顺带磨砺神识与悟性。',
    },
    {
      id: 'wx_m2', tier: '供奉差事', title: '勘验前朝遗阵', minRank: 1, minRealm: 2,
      months: 6, contribution: 380, stones: 520, reputation: 30, enemy: 'ancient_puppet',
      desc: '河洛清丈时挖出前朝遗阵，摧毁失控的守阵傀儡，把阵图带回户部。',
    },
    {
      id: 'wx_m3', tier: '上供奉密令', title: '封堵地脉裂隙', minRank: 2, minRealm: 5,
      months: 12, contribution: 1850, stones: 5500, reputation: 120, enemy: 'void_fiend',
      desc: '河洛地脉异变，地面开裂，率供奉封堵裂隙，斩杀从中爬出的邪物。',
    },
    {
      id: 'wx_m4', tier: '客卿统令', title: '重启苍和古内库', minRank: 3, minRealm: 4,
      months: 12, contribution: 2250, stones: 7600, reputation: 145, enemy: 'star_golem',
      desc: '河洛庄园地下露出苍和古内库，破解库门旧阵，制服失控的古守卫。',
    },
    {
      id: 'wx_m5', tier: '首席秘诏', title: '护送清丈新册入京', minRank: 4, minRealm: 6,
      months: 18, contribution: 5000, stones: 23000, reputation: 290, enemy: 'star_devourer',
      desc: '清丈新册关系天下税粮，有人请动古修半路截杀，奉旨护册入京。',
    },
  ],
  hanshan: [
    {
      id: 'hs_m1', tier: '伍长差遣', title: '雁门夜巡', minRank: 0, minRealm: 0,
      months: 3, contribution: 85, stones: 75, reputation: 9, enemy: 'bandit',
      desc: '熄火夜行三十里，清扫潜入关下劫掠屯田的散匪。',
    },
    {
      id: 'hs_m2', tier: '什长军令', title: '镇封旧营怨魂', minRank: 1, minRealm: 1,
      months: 6, contribution: 340, stones: 410, reputation: 26, enemy: 'ghost',
      desc: '雪崩冲开前朝旧营，冻死的兵魂夜夜作祟，以淬兵诀重设镇封。',
    },
    {
      id: 'hs_m3', tier: '队正军令', title: '外堡独挡大妖', minRank: 2, minRealm: 4,
      months: 12, contribution: 1550, stones: 3600, reputation: 110, enemy: 'demon_king',
      desc: '关外大妖冲撞外堡，奉统领令在雪原上独挡，掩护粮车入关。',
    },
    {
      id: 'hs_m4', tier: '校尉军令', title: '冰崖平息寒魂', minRank: 3, minRealm: 6,
      months: 15, contribution: 3100, stones: 12000, reputation: 195, enemy: 'frost_empress',
      desc: '云中以北冰崖下封着前朝古修的寒魂，醒来后冻毁烽燧，以守关心法将其平息。',
    },
    {
      id: 'hs_m5', tier: '副将密令', title: '关外截杀疯魔古修', minRank: 4, minRealm: 8,
      months: 18, contribution: 5800, stones: 32000, reputation: 340, enemy: 'fallen_immortal',
      desc: '一名疯魔古修要夺代北寒泉，统领命你出关截杀。',
    },
  ],
  wanbao: [
    {
      id: 'wb_m1', tier: '伙计差事', title: '临河至青石押货', minRank: 0, minRealm: 0,
      months: 3, contribution: 95, stones: 180, reputation: 6, enemy: 'bandit',
      desc: '护送一车灵材从临河运到青石镇，击退拦路的劫道散修。',
    },
    {
      id: 'wb_m2', tier: '跑街悬赏', title: '大江水路清障', minRank: 1, minRealm: 2,
      months: 6, contribution: 390, stones: 950, reputation: 28, enemy: 'sea_yaksha',
      desc: '江上水怪屡屡掀翻商会粮船，打通临河下游水路，重赏灵石。',
    },
    {
      id: 'wb_m3', tier: '掌柜密托', title: '讨回赖账', minRank: 2, minRealm: 3,
      months: 9, contribution: 1350, stones: 4200, reputation: 85, enemy: 'blood_elder',
      desc: '一名邪修赊走商会法器拒不偿还。商会的账，只认钱或血。',
    },
    {
      id: 'wb_m4', tier: '大掌柜统令', title: '菱湖打捞沉船货', minRank: 3, minRealm: 5,
      months: 12, contribution: 2500, stones: 13500, reputation: 145, enemy: 'abyss_kraken',
      desc: '一艘商会货船沉在菱湖深处，打退盘踞船骸的水怪，把货捞回来。',
    },
    {
      id: 'wb_m5', tier: '东家秘托', title: '护送玉门贡货入京', minRank: 4, minRealm: 7,
      months: 18, contribution: 5400, stones: 42000, reputation: 290, enemy: 'yin_yang_elder',
      desc: '一个古修老怪盯上了商会押往宁京的贡货，执东家令把他打退，保住商会的信誉。',
    },
  ],
  wanshou: [
    {
      id: 'ws_m1', tier: '牧人差事', title: '驱赶闯营野兽', minRank: 0, minRealm: 1,
      months: 3, contribution: 100, stones: 100, reputation: 8, enemy: 'beast',
      desc: '一头发狂的野兽冲撞营地马圈，将它制服。',
    },
    {
      id: 'ws_m2', tier: '骑手差事', title: '收服山中灵猿', minRank: 1, minRealm: 1,
      months: 6, contribution: 350, stones: 460, reputation: 24, enemy: 'spirit_ape',
      desc: '云中山里通灵的猿群偷马驹，进山与它们较量，赢下敬畏。',
    },
    {
      id: 'ws_m3', tier: '百骑长令', title: '雪原猎取古兽', minRank: 2, minRealm: 6,
      months: 12, contribution: 2400, stones: 9500, reputation: 150, enemy: 'chaos_beast',
      desc: '部族要古兽之血育马种，往极北雪原狩猎，只有最强的骑手能接。',
    },
    {
      id: 'ws_m4', tier: '千骑长令', title: '冰河降服骨蛟', minRank: 3, minRealm: 3,
      months: 10, contribution: 2100, stones: 6400, reputation: 125, enemy: 'bone_dragon',
      desc: '朔川冰河下的骨蛟煞气冲天，惊散迁徙的马群，率骑手将它降服。',
    },
    {
      id: 'ws_m5', tier: '部帅密令', title: '极北会猎', minRank: 4, minRealm: 8,
      months: 18, contribution: 5900, stones: 34000, reputation: 350, enemy: 'chaos_leviathan',
      desc: '部族几十年一回的大猎：往草滩以北极远处，取一缕吞地巨兽的血。',
    },
  ],
  jiguan: [
    {
      id: 'jg_m1', tier: '学徒活计', title: '检修水车与风箱', minRank: 0, minRealm: 0,
      months: 3, contribution: 92, stones: 105, reputation: 6, enemy: null,
      desc: '钻进炉坊底下清理积灰，替换磨损的轴承。',
    },
    {
      id: 'jg_m2', tier: '匠工活计', title: '拆解暴走铁傀', minRank: 1, minRealm: 2,
      months: 6, contribution: 390, stones: 600, reputation: 30, enemy: 'ancient_puppet',
      desc: '试炼场一具古修傀儡灵核失控，去拆解它，把核心回收。',
    },
    {
      id: 'jg_m3', tier: '匠头急单', title: '沙下截回古修尸傀', minRank: 2, minRealm: 7,
      months: 12, contribution: 2800, stones: 12000, reputation: 160, enemy: 'ancient_corpse',
      desc: '急单：去白驼沙下截回一具古修尸傀，研究它不朽的炼体法阵。',
    },
    {
      id: 'jg_m4', tier: '炉头大单', title: '实测巨型铁傀', minRank: 3, minRealm: 3,
      months: 10, contribution: 2150, stones: 6800, reputation: 130, enemy: 'iron_titan',
      desc: '新铸的巨型铁傀试机时暴走，正面压住它，记下灵枢承压的极限。',
    },
    {
      id: 'jg_m5', tier: '总炉头密单', title: '拓印古修甲纹', minRank: 4, minRealm: 6,
      months: 18, contribution: 5100, stones: 24000, reputation: 280, enemy: 'kunlun_guardian',
      desc: '玉门外流沙里现出一具古修石甲神将，击败它，拓下战甲的铭文构造。',
    },
  ],
  xuemo: [
    {
      id: 'xm_m1', tier: '求法差事', title: '残殿外猎杀散修', minRank: 0, minRealm: 0,
      months: 3, contribution: 105, stones: 110, reputation: -8, enemy: 'bandit',
      desc: '弱肉强食是遗脉的规矩，提着对手的储物袋回来领赏。',
    },
    {
      id: 'xm_m2', tier: '门人悬赏', title: '伏击结丹巡查', minRank: 1, minRealm: 2,
      months: 6, contribution: 420, stones: 680, reputation: -25, enemy: 'jindan_elder',
      desc: '玄衡宗一名结丹长老单身巡查西陲，设伏截杀，夺下他的法器。',
    },
    {
      id: 'xm_m3', tier: '传人密令', title: '截杀朝廷供奉', minRank: 2, minRealm: 5,
      months: 12, contribution: 1950, stones: 6200, reputation: -60, enemy: 'heaven_envoy',
      desc: '一名朝廷供奉奉命追查遗脉踪迹，斩下他的首级立威。',
    },
    {
      id: 'xm_m4', tier: '执法统令', title: '吞并叛脉', minRank: 3, minRealm: 4,
      months: 12, contribution: 2400, stones: 8400, reputation: -40, enemy: 'blood_fiend_king',
      desc: '一支叛出的遗脉拥地自立，不肯上缴掠来的灵材，率人踏平他们的巢穴。',
    },
    {
      id: 'xm_m5', tier: '护法秘令', title: '残殿血海夺权', minRank: 4, minRealm: 7,
      months: 18, contribution: 5600, stones: 29000, reputation: -120, enemy: 'blood_ocean_lord',
      desc: '沉睡在残殿深处的遗脉古祖醒了，要夺回遗脉之主的位子，只有杀穿血海才坐得稳。',
    },
  ],
  hehuan: [
    {
      id: 'hh_m1', tier: '喽啰差事', title: '打探驼队消息', minRank: 0, minRealm: 0,
      months: 3, contribution: 90, stones: 105, reputation: 4, enemy: null,
      desc: '天亮前到沙州茶棚坐一坐，打听这个月哪几支驼队要过井。',
    },
    {
      id: 'hh_m2', tier: '刀手差事', title: '清理叛逃刀手', minRank: 1, minRealm: 1,
      months: 6, contribution: 360, stones: 520, reputation: 15, enemy: 'cultivator',
      desc: '一名刀手卷了井钱投奔玉门守军，把他清理掉，不留痕迹。',
    },
    {
      id: 'hh_m3', tier: '头目密令', title: '夺回被占的井', minRank: 2, minRealm: 3,
      months: 9, contribution: 1320, stones: 2900, reputation: 45, enemy: 'blood_elder',
      desc: '一伙邪修占了寨里的一口井，奉大当家之命把井夺回来。',
    },
    {
      id: 'hh_m4', tier: '大头目统令', title: '揪出暗中下手的人', minRank: 3, minRealm: 4,
      months: 12, contribution: 2300, stones: 7800, reputation: 115, enemy: 'void_stalker',
      desc: '有人屡屡暗算来谈生意的客人，引蛇出洞，彻底除掉。',
    },
    {
      id: 'hh_m5', tier: '二当家密令', title: '沙暴深处斩心魔', minRank: 4, minRealm: 8,
      months: 18, contribution: 5700, stones: 31000, reputation: 290, enemy: 'karmic_demon_lord',
      desc: '传说沙暴最深处住着惑乱人心的东西，耶律祁要它的命，换十三大井一季安宁。',
    },
  ],
  youming: [
    {
      id: 'ym_m1', tier: '喽啰差事', title: '芦荡镇冤魂', minRank: 0, minRealm: 1,
      months: 3, contribution: 100, stones: 95, reputation: -5, enemy: 'ghost',
      desc: '芦荡里夜夜有哭声，寨里说是淹死的冤魂作怪，去把它镇住。',
    },
    {
      id: 'ym_m2', tier: '水手差事', title: '掘前朝治水墓', minRank: 1, minRealm: 2,
      months: 6, contribution: 380, stones: 560, reputation: -15, enemy: 'ancient_puppet',
      desc: '掘开旧河闸附近一座前朝治水官的墓，砸碎守墓的机关傀儡，取出陪葬晶石。',
    },
    {
      id: 'ym_m3', tier: '小头目密令', title: '镇压闸底凶灵', minRank: 2, minRealm: 3,
      months: 9, contribution: 1360, stones: 2700, reputation: 40, enemy: 'ghost_king',
      desc: '旧河闸底的凶灵扰得排桩的人不敢下水，把它炼进招煞幡。',
    },
    {
      id: 'ym_m4', tier: '舵主统令', title: '收服沉船旧将', minRank: 3, minRealm: 5,
      months: 12, contribution: 2550, stones: 8400, reputation: 120, enemy: 'nether_marshal',
      desc: '一艘前朝官船沉在大江里，船上旧将阴魂不散，执寨主令旗把它收服或镇灭。',
    },
    {
      id: 'ym_m5', tier: '寨主密令', title: '大江上游斩古魔', minRank: 4, minRealm: 9,
      months: 24, contribution: 6800, stones: 48000, reputation: 360, enemy: 'abyssal_immortal_demon',
      desc: '传说大江上游峡谷里压着一个古魔，它一翻身南泽就发大水。韩彪只信刀，命你去会它。',
    },
  ],
  sanxiu: [
    {
      id: 'sx_m1', tier: '红榜悬赏', title: '清剿害人邪修', minRank: 0, minRealm: 0,
      months: 3, contribution: 85, stones: 120, reputation: 10, enemy: 'rogue',
      desc: '临河城外贴出的红榜，专拿残害同道的邪修。',
    },
    {
      id: 'sx_m2', tier: '行脚悬赏', title: '探青崖废洞府', minRank: 1, minRealm: 1,
      months: 6, contribution: 350, stones: 540, reputation: 25, enemy: 'poison_python',
      desc: '和几个散修合买一张残图，斩杀守洞的毒蟒，平分洞府遗物。',
    },
    {
      id: 'sx_m3', tier: '黑榜悬赏', title: '斩杀为祸老怪', minRank: 2, minRealm: 6,
      months: 12, contribution: 2500, stones: 10000, reputation: 180, enemy: 'old_monster',
      desc: '散修中间传着一张天字悬赏：一个活了几百年的老怪为祸一方，斩了他，从此五域知名。',
    },
    {
      id: 'sx_m4', tier: '血榜悬赏', title: '追斩屠集剑修', minRank: 3, minRealm: 3,
      months: 10, contribution: 2150, stones: 7200, reputation: 135, enemy: 'crimson_sword',
      desc: '一名剑修连屠三处散修集市，散修们凑了重金，请你去讨这笔债。',
    },
    {
      id: 'sx_m5', tier: '散修传说', title: '向赤霞旧府递一剑', minRank: 4, minRealm: 9,
      months: 24, contribution: 6500, stones: 45000, reputation: 400, enemy: 'primordial_sword_immortal',
      desc: '散修中间流传最久的传说：赤霞旧府最深处留着一道古修剑意，向它递出一剑，就知道自己走到了哪里。',
    },
  ],
};

/**
 * 晋升试炼：通用职阶 外门(0)→内门(1)→真传(2)→执事(3)→长老(4)→太上长老(5)；
 * 各势力自己的叫法见 sects.js 的 sect.ranks，sectFlavor 里按势力写明。
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
    desc: '踏入筑基、积攒五百贡献后，须在擂台上击败同阶考官，方得晋升第二阶。',
    sectFlavor: {
      taixuan: '外门剑台上接住内门师兄三十六剑不败，换内门玉牌。',
      qingyun: '与司辰同守观测台，夜半有人来抢罗盘，打退他，领司辰腰牌。',
      danxia: '既比护炉身手，也当场辨认七十二味药的药性，过了才算药师。',
      tianyin: '在祠前接住庙祝三掌，心神不乱，方能执香做庙祝。',
      wanxiang: '在户部校场以阵困住考官，三炷香内不让他走出阵来，升为供奉。',
      hanshan: '雪地营中与什长对练，刀不脱手，便领什长腰牌。',
      wanbao: '押货考校：护住货匣，打退扮作劫匪的跑街，升为跑街。',
      wanshou: '在草滩上与骑手斗马斗刀，赢了便有一匹自己的马，做骑手。',
      jiguan: '用自己打的兵器对上匠工，三炷香内破其护甲，升为匠工。',
      xuemo: '在残殿里无规矩死斗，赢的人成为门人，输的人成为养料。',
      hehuan: '在井台上和一名刀手斗法，赢了拿刀，输了滚出沙道。',
      youming: '在闸下水里和老水手比憋气、比刀，赢了上船做水手。',
      sanxiu: '在临河城外击败同境的悬赏考官，从此行脚散修里有你一号。',
    },
  },
  {
    fromRank: 1,
    toRank: 2,
    rankName: '真传弟子',
    title: '结丹问道 · 晋升真传',
    contribution: 2000,
    minRealm: 2,
    minAttrs: { 道心: 20 },
    checkType: 'combat',
    enemy: 'jindan_elder',
    desc: '修成结丹、贡献满两千，须在长老化身压境之下撑住绝杀并胜出，方得晋升第三阶，阅览镇宗典籍。',
    sectFlavor: {
      taixuan: '登护脉大阵外围阵眼，以剑意击败守阵的结丹长老。',
      qingyun: '在宁京观测台接监中结丹前辈的考校，测准三处灵气消长，方为灵台郎。',
      danxia: '开炉成丹的同时迎战护炉长老，证明丹武双全。',
      tianyin: '独守义仓七夜，击退前来抢粮的结丹修士，升为义仓司仓。',
      wanxiang: '在内廷当着众供奉破开首席设下的结丹大阵，升为上供奉。',
      hanshan: '随军出关，在外堡前斩下一名结丹敌将，升为队正。',
      wanbao: '接手一桩结丹级的危局委托，保住商会信誉，升为掌柜。',
      wanshou: '降服部族长老放出的结丹猛兽，得百骑长的鹰旗。',
      jiguan: '在炉坊里拆解匠头打的结丹铁傀，升为匠头。',
      xuemo: '在护法注视下杀掉三名同辈，踩着他们做传人。',
      hehuan: '识破头目设下的局，反客为主，坐上小头目的位子。',
      youming: '闯过闸底三道水关，击败守关的结丹老寇，升为小头目。',
      sanxiu: '在临河城外连挑三位结丹散修，从此能坐地收徒，不必再四处行脚。',
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
    desc: '元婴既成、功勋卓著，须独当一面斩杀一名元婴级强敌，方能执掌一方。',
    sectFlavor: {
      taixuan: '代宗门出征北境，斩下一头犯关的元婴大妖，献于山门。',
      qingyun: '独守雁门观测点，斩杀冲关的元婴大妖，升为监丞。',
      danxia: '护送宗门药鼎出谷，途中亲斩觊觎宝鼎的元婴大妖。',
      tianyin: '只身入山，降伏祸害镇子的元婴凶物，升为主祠。',
      wanxiang: '在千里之外布阵，围杀犯境的元婴大妖，升为客卿。',
      hanshan: '单骑出关三百里，斩元婴大妖而还，升为校尉。',
      wanbao: '扫平商路上最大的祸患，斩杀截道的元婴凶物，升为大掌柜。',
      wanshou: '以武力压服挑衅冬营的元婴大妖，升为千骑长。',
      jiguan: '带着炉坊新打的战器出关，正面轰杀元婴大妖，升为炉头。',
      xuemo: '杀掉一名敌对的元婴修士，把他的元婴献给遗脉，升为执法。',
      hehuan: '瓦解围剿沙道的元婴强敌，斩杀领头的人，升为头目。',
      youming: '在大江上斩杀一头元婴水怪，夺其妖魂充实招煞幡，升为舵主。',
      sanxiu: '独力完成一桩元婴级血榜悬赏，成了一方名宿。',
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
    desc: '踏入化神、初窥天地法则，须在禁地击败古修留下的化神剑灵残影，方可开峰授徒、位列第五阶。',
    sectFlavor: {
      taixuan: '登天机阁禁地，与古修剑灵残影一决高下，得先祖认可。',
      qingyun: '入观测台底层，以化神法则斩碎古修残留的剑意，升为少监。',
      danxia: '以真火抗衡丹房禁地里的古修剑灵执念。',
      tianyin: '以香火愿力平息古战场上化神剑灵的怨念，升为祠老。',
      wanxiang: '在内廷藏阁接下古修残留的一缕化神剑意，升为首席客卿。',
      hanshan: '在外堡废垒深处坐守三年，斩灭缠绕关前的古修剑意，升为偏将。',
      wanbao: '平定总号库底镇库古剑的暴动，升为总号执事。',
      wanshou: '在祖灵石堆外斩退古修剑意残影，升为部帅。',
      jiguan: '以炉坊秘器硬撼化神剑灵，把剑意铭刻进大炉，升为大匠。',
      xuemo: '以血海吞下古修剑灵残魂，坐上护法之位。',
      hehuan: '以沙暴困杀化神剑灵残影，坐上大头目的位子。',
      youming: '把古修剑灵残魂镇在闸底，升为大头目。',
      sanxiu: '在宁京城外击败化神剑灵残影，散修里开始称你一声前辈。',
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
    desc: '修成合体、名动五域，须独斗一个活了万载的老怪物而不落下风，从此超然物外，成为本门的定海神针。',
    sectFlavor: {
      taixuan: '一剑压服觊觎护脉大阵的万年老怪，尊为太上长老。',
      qingyun: '在宁京城外独战万年老怪，此后天象底册由你执笔，尊为监正。',
      danxia: '炼成镇宗之丹，击退夺丹的合体老怪，尊为太上长老。',
      tianyin: '守着祠前一镇百姓，降伏乱世的万年老怪，尊为太上祠老。',
      wanxiang: '以城防大阵把万年老怪镇在宁京城下，尊为太上客卿。',
      hanshan: '在雁门关前重创万年老怪，边军上下唤你一声副将。',
      wanbao: '震住企图吞并商会的合体老怪，坐上总号东家的位子。',
      wanshou: '号令兽群击溃万年老怪，成为部族长老。',
      jiguan: '催动铜谷大炉全力碾压万年老怪，尊为总炉头。',
      xuemo: '吞下合体老怪的精元，成为遗脉之主。',
      hehuan: '逼得万年老怪退出流沙道，坐上二当家的位子。',
      youming: '引大江水势镇灭万年老怪，坐上二寨主的交椅。',
      sanxiu: '独斩合体老怪，五域散修共尊你为耆宿。',
    },
  },
];
