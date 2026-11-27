import { SECT_LIBRARIES } from './sectContent.js';
import { SECT_BY_ID } from './sects.js';

/**
 * 九州功法总录（v5.0）：
 * 收录 64 卷非宗门世间功法（凡 / 黄 / 玄 / 地 / 天 / 仙六阶），
 * 并汇总 13 宗门藏经阁 78 卷传承，总计 142 卷功法供典籍、奇遇、名宿授艺与图鉴系统调用。
 */
export const WORLD_TECHNIQUES = [
  // ==================== 凡阶功法 (8 卷) ====================
  {
    id: 'wt_yinqi_jue', name: '《吐纳引气诀》', grade: '凡', category: '吐纳', source: '青牛山脉散修传抄',
    speed: 0.04, atk: 0.02, def: 0.03, lifespan: 4, lawId: 'pill', artName: '引气归元掌',
    desc: '九州流传最广的启蒙吐纳法，清晨面东采紫气，缓而不伤经脉。',
  },
  {
    id: 'wt_qingshan_jian', name: '《青山十三剑》', grade: '凡', category: '剑诀', source: '落霞城旧书摊',
    speed: 0.03, atk: 0.06, def: 0.02, lifespan: 0, lawId: 'sword', artName: '青山叠翠斩',
    desc: '凡俗剑客窥得一丝灵气后自创的十三式快剑，轻灵中暗藏机锋。',
  },
  {
    id: 'wt_tieniu_ti', name: '《铁牛搬山劲》', grade: '凡', category: '体术', source: '青牛村古碑',
    speed: 0.03, atk: 0.05, def: 0.06, lifespan: 6, lawId: 'blood', artName: '铁牛撼地撞',
    desc: '效仿蛮牛蓄力之姿锤炼皮肉筋骨，力沉步稳，最宜炼气初期防身。',
  },
  {
    id: 'wt_baicao_lu', name: '《采药辨灵录》', grade: '凡', category: '丹经', source: '山野老药农',
    speed: 0.05, atk: 0.01, def: 0.03, lifespan: 10, lawId: 'pill', artName: '草木生息气',
    desc: '以草木清气入腑温养丹田，行气温和，偶能延长数载凡寿。',
  },
  {
    id: 'wt_liuyun_bu', name: '《流云踏雪步》', grade: '凡', category: '时空', source: '落霞坊市悬赏',
    speed: 0.05, atk: 0.03, def: 0.04, lifespan: 2, lawId: 'space', artName: '踏雪无痕影',
    desc: '步法轻捷如履浮云，避实击虚，乃游方散修保命常备之技。',
  },
  {
    id: 'wt_shimen_zhen', name: '《石门奇门诀》', grade: '凡', category: '阵典', source: '古驿道石刻',
    speed: 0.04, atk: 0.03, def: 0.05, lifespan: 2, lawId: 'array', artName: '石阵困敌印',
    desc: '以碎石枯枝顺地势布成简易迷阵，虽威力有限却极善脱身。',
  },
  {
    id: 'wt_chunjing_lei', name: '《春惊响雷拳》', grade: '凡', category: '雷法', source: '游方雷道士',
    speed: 0.03, atk: 0.06, def: 0.02, lifespan: 0, lawId: 'thunder', artName: '惊蛰震空拳',
    desc: '拳出如春雷乍响，震慑宵小，常令山野精怪胆寒。',
  },
  {
    id: 'wt_jingxin_zhou', name: '《晨钟静心咒》', grade: '凡', category: '因果', source: '荒山破庙残壁',
    speed: 0.04, atk: 0.02, def: 0.05, lifespan: 8, lawId: 'karma', artName: '清音定心诀',
    desc: '每日丑时默诵三遍，可抚平气血躁动，抵御初阶心魔侵扰。',
  },

  // ==================== 黄阶功法 (10 卷) ====================
  {
    id: 'wt_luoxia_jian', name: '《落霞分光剑》', grade: '黄', category: '剑诀', source: '落霞仙城剑阁',
    speed: 0.07, atk: 0.11, def: 0.04, lifespan: 5, lawId: 'sword', artName: '落霞孤鹜斩',
    desc: '借晚霞映照之势一剑分三影，剑光绚烂夺目，令对手难辨虚实。',
  },
  {
    id: 'wt_xuanjia_gong', name: '《玄甲护体功》', grade: '黄', category: '体术', source: '落霞镖局秘传',
    speed: 0.06, atk: 0.05, def: 0.12, lifespan: 12, lawId: 'array', artName: '玄甲不动钟',
    desc: '灵力覆体凝成淡青气甲，硬撼刀剑如击皮革，深得护镖散修喜爱。',
  },
  {
    id: 'wt_danlu_huo', name: '《文武丹火诀》', grade: '黄', category: '丹经', source: '坊市炼丹散修',
    speed: 0.08, atk: 0.06, def: 0.05, lifespan: 16, lawId: 'pill', artName: '赤焰灼灵掌',
    desc: '分文火温养、武火淬炼，不仅助益成丹，吐焰御敌亦不容小觑。',
  },
  {
    id: 'wt_yinlei_zhi', name: '《引雷破煞指》', grade: '黄', category: '雷法', source: '雷雨古松石匣',
    speed: 0.07, atk: 0.11, def: 0.04, lifespan: 4, lawId: 'thunder', artName: '一指惊雷落',
    desc: '聚天地游离雷机于指尖，点出之时电光乍现，专克阴魂邪煞。',
  },
  {
    id: 'wt_suofeng_jue', name: '《缩风御影诀》', grade: '黄', category: '时空', source: '青牛古道秘洞',
    speed: 0.09, atk: 0.07, def: 0.06, lifespan: 6, lawId: 'space', artName: '御风裂影斩',
    desc: '驭风借势而行，身法如燕掠寒潭，于闪转腾挪间递出杀招。',
  },
  {
    id: 'wt_chanyi_jue', name: '《枯荣吐息经》', grade: '黄', category: '时空', source: '深山古道观',
    speed: 0.08, atk: 0.05, def: 0.07, lifespan: 22, lawId: 'time', artName: '秋叶枯荣印',
    desc: '观四时草木枯荣而悟养生之理，行气悠长，益寿延年。',
  },
  {
    id: 'wt_beidou_bu', name: '《北斗七星步》', grade: '黄', category: '星辰', source: '观星野道人',
    speed: 0.08, atk: 0.08, def: 0.08, lifespan: 10, lawId: 'star', artName: '七星连珠击',
    desc: '踏天枢至摇光七步成势，步步引微弱星辉入体，攻守均衡。',
  },
  {
    id: 'wt_hongchen_jian', name: '《红尘问心诀》', grade: '黄', category: '因果', source: '茶摊白衣客',
    speed: 0.09, atk: 0.06, def: 0.08, lifespan: 14, lawId: 'karma', artName: '问心清风掌',
    desc: '不避尘世喧嚣，于市井百态中打磨道心，气机澄澈少障。',
  },
  {
    id: 'wt_langsha_quan', name: '《苍狼嗜血拳》', grade: '黄', category: '魔功', source: '苍茫妖森外围遗骨',
    speed: 0.1, atk: 0.12, def: 0.03, lifespan: -2, lawId: 'blood', artName: '苍狼裂喉爪',
    desc: '模仿妖狼搏命撕咬之态，气血翻涌时拳劲暴涨，霸道非常。',
  },
  {
    id: 'wt_wuxing_za', name: '《五行杂气功》', grade: '黄', category: '混沌', source: '五灵根前辈手札',
    speed: 0.08, atk: 0.07, def: 0.08, lifespan: 12, lawId: 'chaos', artName: '五行轮转掌',
    desc: '专为驳杂灵根修士所创，借五行相生之理徐徐化浊为清。',
  },

  // ==================== 玄阶功法 (12 卷) ====================
  {
    id: 'wt_qingshuang_jue', name: '《青霜破岳诀》', grade: '玄', category: '剑诀', source: '落霞林氏秘藏',
    speed: 0.13, atk: 0.19, def: 0.08, lifespan: 15, lawId: 'sword', artName: '青霜裂岳剑',
    desc: '落霞世家引以为傲的筑基剑典，剑势沉凝如山岳压顶，寒霜透甲。',
  },
  {
    id: 'wt_jinzhong_ti', name: '《古铜金刚体》', grade: '玄', category: '体术', source: '古战场石棺',
    speed: 0.11, atk: 0.12, def: 0.19, lifespan: 25, lawId: 'blood', artName: '铜身镇岳撞',
    desc: '以地火煞气反复淬炼肉身，成时肌肤隐泛古铜光泽，刀兵难伤。',
  },
  {
    id: 'wt_qihua_dan', name: '《七花凝露经》', grade: '玄', category: '丹经', source: '苍茫妖森药窟',
    speed: 0.13, atk: 0.09, def: 0.12, lifespan: 32, lawId: 'pill', artName: '青焰缠丝印',
    desc: '采七种毒瘴灵花提纯生机，丹火清幽绵长，疗伤解毒皆有奇效。',
  },
  {
    id: 'wt_qimen_dun', name: '《奇门遁甲篇》', grade: '玄', category: '阵典', source: '古修石室玉壁',
    speed: 0.14, atk: 0.13, def: 0.16, lifespan: 15, lawId: 'array', artName: '八门锁魂阵',
    desc: '休生伤杜景死惊开，八门轮转变化无穷，以弱胜强之绝佳阵典。',
  },
  {
    id: 'wt_kuanglei_dao', name: '《狂雷断岳刀》', grade: '玄', category: '雷法', source: '雷鸣峡断碑',
    speed: 0.12, atk: 0.21, def: 0.07, lifespan: 8, lawId: 'thunder', artName: '狂雷劈山刀',
    desc: '将雷霆之力灌注刀锋，势大力沉，一刀斩落雷音滚滚震裂十丈岩壁。',
  },
  {
    id: 'wt_huanxing_yi', name: '《幻星移位诀》', grade: '玄', category: '时空', source: '东海沉船铁匣',
    speed: 0.15, atk: 0.14, def: 0.12, lifespan: 18, lawId: 'space', artName: '移形换影刺',
    desc: '以神识牵引身周尺许空间错位，往往敌招将至而人已现于背后。',
  },
  {
    id: 'wt_qingqiu_huan', name: '《青丘月华幻典》', grade: '玄', category: '因果', source: '苍茫妖森白幽妖尊',
    speed: 0.16, atk: 0.15, def: 0.14, lifespan: 40, lawId: 'karma', artName: '九尾月华幻界',
    desc: '太古青丘妖族流传的月华秘法，引清辉编织梦境，摄人心魄于无形。',
  },
  {
    id: 'wt_hanjiang_jue', name: '《寒江独钓经》', grade: '玄', category: '时空', source: '雪江老钓叟',
    speed: 0.14, atk: 0.13, def: 0.15, lifespan: 38, lawId: 'time', artName: '孤舟凝岁钓',
    desc: '观江水东流不息而悟光阴缓急，出手静谧如霜雪无声，暗藏绝杀。',
  },
  {
    id: 'wt_ziwei_xing', name: '《紫微斗数引星诀》', grade: '玄', category: '星辰', source: '中州星台外阁',
    speed: 0.15, atk: 0.16, def: 0.14, lifespan: 22, lawId: 'star', artName: '紫微星芒坠',
    desc: '借紫微帝星之辉淬炼识海，法力凝练深厚，夜战威势更添三分。',
  },
  {
    id: 'wt_shixue_mo', name: '《嗜血化煞功》', grade: '玄', category: '魔功', source: '北荒散修黑市',
    speed: 0.18, atk: 0.22, def: 0.06, lifespan: 0, lawId: 'blood', artName: '血煞噬心掌',
    desc: '以敌血养煞、以煞催灵，修为进境奇快却最易招致正道围剿。',
  },
  {
    id: 'wt_sanyuan_jue', name: '《三元合气诀》', grade: '玄', category: '混沌', source: '古道修坐化洞府',
    speed: 0.14, atk: 0.14, def: 0.15, lifespan: 28, lawId: 'chaos', artName: '三元归真印',
    desc: '融精气神三元为一炉，灵力浑厚无偏，为后续修习高阶杂学奠基。',
  },
  {
    id: 'wt_bisha_jian', name: '《碧沙听潮剑》', grade: '玄', category: '剑诀', source: '东海海商秘闻',
    speed: 0.14, atk: 0.18, def: 0.11, lifespan: 15, lawId: 'sword', artName: '潮生碧海剑',
    desc: '效仿东海潮汐叠浪之势，剑势一浪高于一浪，连绵不绝难寻破绽。',
  },

  // ==================== 地阶功法 (12 卷) ====================
  {
    id: 'wt_hanmei_jian', name: '《寒梅落雪剑诀》', grade: '地', category: '剑诀', source: '寒梅剑修苏晚晴',
    speed: 0.21, atk: 0.29, def: 0.15, lifespan: 35, lawId: 'sword', artName: '寒梅映雪一剑寒',
    desc: '苏晚晴不传之秘，剑意清冽如傲雪寒梅，一剑递出万籁俱寂、冰封三尺。',
  },
  {
    id: 'wt_shennong_dan', name: '《神农百草丹经》', grade: '地', category: '丹经', source: '怪癖丹尊药尘子',
    speed: 0.2, atk: 0.18, def: 0.2, lifespan: 85, lawId: 'pill', artName: '百草回春真火',
    desc: '药尘子毕生心血所凝，通晓九州三千灵药生克，丹火蕴含浩瀚生机。',
  },
  {
    id: 'wt_canghai_jue', name: '《沧海潮汐星剑录》', grade: '地', category: '星辰', source: '东海云霓仙子',
    speed: 0.22, atk: 0.27, def: 0.21, lifespan: 50, lawId: 'star', artName: '沧海明月星潮斩',
    desc: '东海海阁镇阁秘典，引海月星潮入剑，剑光起处涛声如雷、星辉满空。',
  },
  {
    id: 'wt_qianji_zhen', name: '《千机八阵图录》', grade: '地', category: '阵典', source: '玄机老人亲传',
    speed: 0.21, atk: 0.24, def: 0.27, lifespan: 45, lawId: 'array', artName: '千机连环杀阵',
    desc: '玄机老人集古阵与机关术之大成，弹指布成连环奇阵，困杀元婴如探囊取物。',
  },
  {
    id: 'wt_huangquan_yin', name: '《黄泉摆渡幽冥印》', grade: '地', category: '时空', source: '墨衡鬼帝遗刻',
    speed: 0.23, atk: 0.29, def: 0.18, lifespan: 55, lawId: 'space', artName: '黄泉渡厄镇魂印',
    desc: '黄泉摆渡人所传幽冥秘印，可开启一寸阴司界缝，放逐强敌神通。',
  },
  {
    id: 'wt_longxiang_ti', name: '《太古龙象镇狱体》', grade: '地', category: '体术', source: '万兽古陵残碑',
    speed: 0.19, atk: 0.28, def: 0.28, lifespan: 70, lawId: 'blood', artName: '龙象般若镇狱拳',
    desc: '引太古巨象与神龙之影淬炼气血，一拳轰出隐闻龙吟象鸣、虚空震荡。',
  },
  {
    id: 'wt_jiutian_lei', name: '《九天应元雷经》', grade: '地', category: '雷法', source: '东海雷岛古殿',
    speed: 0.22, atk: 0.3, def: 0.16, lifespan: 30, lawId: 'thunder', artName: '九天应元灭魔雷',
    desc: '上古雷修宗门失传的正统雷典，掌中雷泽翻涌，渡劫时亦可借雷淬体。',
  },
  {
    id: 'wt_chunqiu_bi', name: '《春秋一梦岁月诀》', grade: '地', category: '时空', source: '中州古儒遗书',
    speed: 0.23, atk: 0.22, def: 0.22, lifespan: 95, lawId: 'time', artName: '南柯一梦断岁华',
    desc: '梦里百年、世间一瞬，修成者可借光阴余韵令敌手招式迟滞半息。',
  },
  {
    id: 'wt_beiming_xing', name: '《北溟吞星诀》', grade: '地', category: '星辰', source: '归墟深海玉碑',
    speed: 0.22, atk: 0.26, def: 0.2, lifespan: 45, lawId: 'star', artName: '北溟星涡吞天式',
    desc: '效仿北溟神鲲吞纳周天星辉，灵海深不见底，久战而不见疲态。',
  },
  {
    id: 'wt_yehuo_lian', name: '《红莲业火真经》', grade: '地', category: '因果', source: '古佛涅槃秘窟',
    speed: 0.21, atk: 0.28, def: 0.2, lifespan: 50, lawId: 'karma', artName: '红莲业火焚诸邪',
    desc: '引众生因果业力化作业火红莲，敌手孽债愈重，焚身之威愈烈。',
  },
  {
    id: 'wt_taiji_hun', name: '《太极两仪混元经》', grade: '地', category: '混沌', source: '中州太古道宫',
    speed: 0.23, atk: 0.24, def: 0.26, lifespan: 65, lawId: 'chaos', artName: '太极阴阳逆转掌',
    desc: '阴阳相济、刚柔并蓄，可借敌之力反制其身，深得道家自然妙谛。',
  },
  {
    id: 'wt_kongming_dun', name: '《空明缩界经》', grade: '地', category: '时空', source: '古空间修士秘藏',
    speed: 0.24, atk: 0.25, def: 0.21, lifespan: 40, lawId: 'space', artName: '方寸断空指',
    desc: '以空间折叠藏锋于无形，咫尺可作天涯，天涯亦可缩于指掌之间。',
  },

  // ==================== 天阶功法 (12 卷) ====================
  {
    id: 'wt_guhong_jian', name: '《孤鸿断空剑经》', grade: '天', category: '剑诀', source: '太玄剑痴陆沉舟',
    speed: 0.3, atk: 0.44, def: 0.16, lifespan: 65, lawId: 'sword', artName: '孤鸿一剑断长空',
    desc: '陆沉舟半生问剑凝出的绝世剑意，不借外物、不留余地，只求一剑破万法。',
  },
  {
    id: 'wt_tianji_ce', name: '《天机因果策》', grade: '天', category: '因果', source: '天机执笔顾青衣',
    speed: 0.32, atk: 0.34, def: 0.32, lifespan: 90, lawId: 'karma', artName: '天机朱笔定生死',
    desc: '天机阁秘传核心心法，洞穿敌手气运命门，落笔处因果倒转、吉凶易位。',
  },
  {
    id: 'wt_xuehe_sha', name: '《血河焚天魔功》', grade: '天', category: '魔功', source: '北荒血煞老祖',
    speed: 0.36, atk: 0.48, def: 0.18, lifespan: 50, lawId: 'blood', artName: '血河九重焚苍穹',
    desc: '血煞老祖压箱底的魔道奇功，血海翻腾三千里，以无尽杀意撼动天道法则。',
  },
  {
    id: 'wt_qinglian_jian', name: '《太古青莲剑歌》', grade: '天', category: '剑诀', source: '昆仑青莲剑仙',
    speed: 0.33, atk: 0.46, def: 0.22, lifespan: 110, lawId: 'sword', artName: '青莲绽空斩星河',
    desc: '青莲剑仙随手吟就的剑道真篇，一剑生青莲，莲开之处虚空尽碎。',
  },
  {
    id: 'wt_jiuzhuan_ti', name: '《九转不灭神魔体》', grade: '天', category: '体术', source: '昆仑神魔古冢',
    speed: 0.28, atk: 0.4, def: 0.4, lifespan: 140, lawId: 'blood', artName: '神魔九转破界拳',
    desc: '太古神魔一脉的不朽炼体天功，九转大成后滴血可复、硬撼灵宝无伤。',
  },
  {
    id: 'wt_danxin_zaohua', name: '《紫府造化丹神录》', grade: '天', category: '丹经', source: '上古丹帝遗迹',
    speed: 0.31, atk: 0.32, def: 0.3, lifespan: 165, lawId: 'pill', artName: '紫府仙火焚万厄',
    desc: '视自身紫府为太古神鼎，纳天地灵气日夜自炼金丹，寿元绵远如仙。',
  },
  {
    id: 'wt_zhuxian_zhen', name: '《四象诛魔古阵图》', grade: '天', category: '阵典', source: '中州古战阵碑',
    speed: 0.3, atk: 0.42, def: 0.34, lifespan: 80, lawId: 'array', artName: '四象绝杀剑阵',
    desc: '昔年镇压域外魔潮的太古杀阵，一人亦可化四象阵眼，威慑合体老怪。',
  },
  {
    id: 'wt_zixiao_shenlei', name: '《紫霄太清神雷典》', grade: '天', category: '雷法', source: '九霄雷碑拓本',
    speed: 0.31, atk: 0.43, def: 0.24, lifespan: 75, lawId: 'thunder', artName: '紫霄天罚降世雷',
    desc: '引动九霄最上层紫霄神雷的绝世雷典，邪祟闻声胆丧，天劫亦减其威。',
  },
  {
    id: 'wt_taixu_jie', name: '《太虚步界真经》', grade: '天', category: '时空', source: '虚空古兽腹中玉简',
    speed: 0.34, atk: 0.38, def: 0.3, lifespan: 95, lawId: 'space', artName: '太虚断界湮灭斩',
    desc: '横跨界海的大能所留，一念裂空万里，可将强敌神通放逐于域外虚空。',
  },
  {
    id: 'wt_guangyin_sha', name: '《光阴飞沙太素卷》', grade: '天', category: '时空', source: '昆仑时之沙漏',
    speed: 0.33, atk: 0.35, def: 0.33, lifespan: 180, lawId: 'time', artName: '岁月飞沙枯骨印',
    desc: '执掌一捧岁月流沙，撒落之处金石风化、寿元倒流，玄妙莫测。',
  },
  {
    id: 'wt_xingchen_bian', name: '《太古星辰变》', grade: '天', category: '星辰', source: '天外陨星古碑',
    speed: 0.33, atk: 0.41, def: 0.34, lifespan: 120, lawId: 'star', artName: '周天星海倾覆拳',
    desc: '于丹田开辟微缩星海，引群星生灭之力为己用，愈到高境威能愈惊人。',
  },
  {
    id: 'wt_hundun_dao', name: '《鸿蒙混元道经》', grade: '天', category: '混沌', source: '昆仑混沌灵池',
    speed: 0.35, atk: 0.42, def: 0.36, lifespan: 135, lawId: 'chaos', artName: '鸿蒙一气镇乾坤',
    desc: '引鸿蒙初分之气洗炼周身，万法归流，压制世间诸多单一五行神通。',
  },

  // ==================== 仙阶功法 (10 卷) ====================
  {
    id: 'wt_zhoutian_xing', name: '《周天星斗太古仙经》', grade: '仙', category: '星辰', source: '九霄司命星君',
    speed: 0.44, atk: 0.56, def: 0.48, lifespan: 260, lawId: 'star', artName: '三百六十五星辰镇界',
    desc: '司命星君珍藏的上界仙典，举手召唤周天大星垂落真火，镇压诸天劫难。',
  },
  {
    id: 'wt_zhuxian_jian', name: '《诛仙太初剑典》', grade: '仙', category: '剑诀', source: '昆仑仙剑残碑',
    speed: 0.44, atk: 0.68, def: 0.32, lifespan: 200, lawId: 'sword', artName: '诛仙一剑斩天道',
    desc: '太古杀伐第一仙剑秘典，非大毅力、大剑心者不可触碰，一剑出则仙神避锋。',
  },
  {
    id: 'wt_jiuzhuan_xuandan', name: '《太乙九转金丹仙经》', grade: '仙', category: '丹经', source: '上界丹宫坠落玉册',
    speed: 0.42, atk: 0.46, def: 0.44, lifespan: 420, lawId: 'pill', artName: '太乙兜率真火劫',
    desc: '以肉身元神合炼九转仙丹的无上法门，功成之日不老不死、百劫难侵。',
  },
  {
    id: 'wt_xiantian_bagua', name: '《先天混元大阵仙图》', grade: '仙', category: '阵典', source: '昆仑玉虚秘殿',
    speed: 0.43, atk: 0.54, def: 0.54, lifespan: 240, lawId: 'array', artName: '先天八卦封仙阵',
    desc: '刻画于先天灵玉之上的太古仙阵总纲，布阵成界，连真仙亦可困杀其中。',
  },
  {
    id: 'wt_jiuxiao_leidi', name: '《九霄雷帝灭劫仙经》', grade: '仙', category: '雷法', source: '九霄天门雷柱',
    speed: 0.45, atk: 0.62, def: 0.4, lifespan: 210, lawId: 'thunder', artName: '九霄雷帝灭世劫',
    desc: '上界雷帝巡狩诸天所修无上仙法，万雷俯首称臣，渡劫如沐春风。',
  },
  {
    id: 'wt_xukong_xian', name: '《太初虚空大道经》', grade: '仙', category: '时空', source: '界海尽头古石刻',
    speed: 0.46, atk: 0.56, def: 0.46, lifespan: 240, lawId: 'space', artName: '太虚崩界归寂指',
    desc: '执掌诸天空间本源的无上仙经，一步跨越星海，一指令方圆百里化作虚无。',
  },
  {
    id: 'wt_suiyue_xian', name: '《岁月长河不朽仙经》', grade: '仙', category: '时空', source: '昆仑建木神殿',
    speed: 0.45, atk: 0.52, def: 0.5, lifespan: 500, lawId: 'time', artName: '岁月倒流葬古仙',
    desc: '超脱时间长河冲刷的至高仙经，一念花开万载、一念桑田成海。',
  },
  {
    id: 'wt_yinguo_tianshu', name: '《大因果轮回仙书》', grade: '仙', category: '因果', source: '九霄天门无字碑',
    speed: 0.45, atk: 0.54, def: 0.5, lifespan: 280, lawId: 'karma', artName: '三生因果断宿命',
    desc: '记述三千大世界因果丝线的绝世仙书，斩断过去劫、把握未来果。',
  },
  {
    id: 'wt_minghe_xuezun', name: '《太古冥河血海仙经》', grade: '仙', category: '魔功', source: '域外魔渊坠落骨碑',
    speed: 0.52, atk: 0.66, def: 0.36, lifespan: 220, lawId: 'blood', artName: '太古冥河覆诸天',
    desc: '太古魔仙证道之法，血海化大千，杀伐之威足以令南天门仙将变色。',
  },
  {
    id: 'wt_kaishi_hundun', name: '《太初混沌开天仙经》', grade: '仙', category: '古传承', source: '混沌秘境太初石碑',
    speed: 0.5, atk: 0.64, def: 0.56, lifespan: 400, lawId: 'chaos', artName: '太初开天辟地印',
    desc: '传说天地初开时第一道大道神音所化，万法之母，修成可自辟一方仙界。',
  },
];

export const WORLD_TECH_BY_ID = Object.fromEntries(WORLD_TECHNIQUES.map((t) => [t.id, t]));

export const ALL_TECHNIQUES = [
  ...WORLD_TECHNIQUES.map((t) => ({ ...t, sectId: null, sectName: null })),
  ...Object.entries(SECT_LIBRARIES).flatMap(([sectId, list]) => {
    const sectName = SECT_BY_ID[sectId]?.name || sectId;
    return list.map((m) => ({
      ...m,
      grade: m.grade || '玄',
      category: '宗门传承',
      source: `${sectName}藏经阁`,
      sectId,
      sectName,
    }));
  }),
];

export const ALL_TECH_BY_ID = Object.fromEntries(ALL_TECHNIQUES.map((t) => [t.id, t]));
