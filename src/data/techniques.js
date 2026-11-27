import { SECT_LIBRARIES } from './sectContent.js';
import { SECT_BY_ID } from './sects.js';

/**
 * 世间功法总录（v8，按 docs/WORLD_CANON.md 换成第一纪元五域）：
 * 收录 64 卷非宗门功法（凡 / 黄 / 玄 / 地 / 天 / 仙六阶）。功法稀缺（B27）：凡、黄、玄阶散在市井与旧碑，
 * 地阶以上多是古籍残卷，只存于天机阁、观星台旧档、赤霞旧府遗址等寥寥几处；12 门由道友亲授。
 * 并汇总 13 个势力的 78 卷传承，总计 142 卷功法供典籍、奇遇、名宿授艺与图鉴系统调用。
 */
export const WORLD_TECHNIQUES = [
  // ==================== 凡阶功法 (8 卷) ====================
  {
    id: 'wt_yinqi_jue', name: '《引气诀残篇》', grade: '凡', align: '正', category: '吐纳', source: '青石镇散修学徒传抄',
    speed: 0.04, atk: 0.02, def: 0.03, lifespan: 4, lawId: 'pill', artName: '引气归元掌',
    desc: '散修学徒手里最常见的入门吐纳法，传抄了不知多少手，后半卷早已缺失。清晨面东行气，进境慢，却不伤经脉。',
  },
  {
    id: 'wt_qingshan_jian', name: '《青山十三剑》', grade: '凡', align: '正', category: '剑诀', source: '临河旧书摊',
    speed: 0.03, atk: 0.06, def: 0.02, lifespan: 0, lawId: 'sword', artName: '青山叠翠斩',
    desc: '临河城一个护院武师引气入体后改出来的十三式快剑，在旧书摊上论斤卖。招式粗糙，胜在出手快。',
  },
  {
    id: 'wt_tieniu_ti', name: '《铁牛搬山劲》', grade: '凡', align: '中', category: '体术', source: '青石井旁旧碑',
    speed: 0.03, atk: 0.05, def: 0.06, lifespan: 6, lawId: 'blood', artName: '铁牛撼地撞',
    desc: '刻在青石井旁一块旧碑背面的炼体法，照着耕牛拉犁时的蓄力锤炼皮肉筋骨。力沉步稳，炼气初期拿来防身最合用。',
  },
  {
    id: 'wt_baicao_lu', name: '《采药辨灵录》', grade: '凡', align: '正', category: '丹经', source: '青崖谷老药农口传',
    speed: 0.05, atk: 0.01, def: 0.03, lifespan: 10, lawId: 'pill', artName: '草木生息气',
    desc: '东岭药农一代代口传的辨药法，后来有人记成了册。以草木清气温养丹田，行气平和，偶尔能多活几年。',
  },
  {
    id: 'wt_liuyun_bu', name: '《流云踏雪步》', grade: '凡', align: '中', category: '时空', source: '临河东市悬赏榜',
    speed: 0.05, atk: 0.03, def: 0.04, lifespan: 2, lawId: 'space', artName: '踏雪无痕影',
    desc: '步法轻快，专走避实击虚的路子。临河东市的悬赏榜上常有人拿它抵赏钱，走江湖的散修多半会几步。',
  },
  {
    id: 'wt_shimen_zhen', name: '《石门奇门诀》', grade: '凡', align: '中', category: '阵典', source: '平桥石拱渡旧石刻',
    speed: 0.04, atk: 0.03, def: 0.05, lifespan: 2, lawId: 'array', artName: '石阵困敌印',
    desc: '用碎石枯枝顺着地势摆成迷阵，威力有限，用来脱身却够了。刻在平桥石拱渡的桥墩上，船工都见过，看得懂的没几个。',
  },
  {
    id: 'wt_chunjing_lei', name: '《春惊响雷拳》', grade: '凡', align: '正', category: '雷法', source: '青石祠庙游方道士',
    speed: 0.03, atk: 0.06, def: 0.02, lifespan: 0, lawId: 'thunder', artName: '惊蛰震空拳',
    desc: '拳出时带一声闷响。早年一个在青石祠庙借住的游方道士留下的，镇上人说能吓退山里的野物。',
  },
  {
    id: 'wt_jingxin_zhou', name: '《晨钟静心咒》', grade: '凡', align: '正', category: '因果', source: '青石祠庙残壁',
    speed: 0.04, atk: 0.02, def: 0.05, lifespan: 8, lawId: 'karma', artName: '清音定心诀',
    desc: '抄在青石祠庙后墙上的几行咒文。每日丑时默诵三遍，能压住气血躁动，挡一挡初起的心魔。',
  },

  // ==================== 黄阶功法 (10 卷) ====================
  {
    id: 'wt_luoxia_jian', name: '《柳林分光剑》', grade: '黄', align: '正', category: '剑诀', source: '临河城武馆旧谱',
    speed: 0.07, atk: 0.11, def: 0.04, lifespan: 5, lawId: 'sword', artName: '柳林三影斩',
    desc: '借河面反光一剑分出三道影子，叫人看不清哪一剑是实的。临河城里练剑的人，十个有八个学过前三式。',
  },
  {
    id: 'wt_xuanjia_gong', name: '《玄甲护体功》', grade: '黄', align: '中', category: '体术', source: '通远商会护商队秘传',
    speed: 0.06, atk: 0.05, def: 0.12, lifespan: 12, lawId: 'array', artName: '玄甲不动钟',
    desc: '灵力覆体凝成一层淡青气甲，刀剑砍上去如砍厚皮。通远商会护商的修士多练这一门。',
  },
  {
    id: 'wt_danlu_huo', name: '《文武丹火诀》', grade: '黄', align: '正', category: '丹经', source: '青崖镇炼丹散修',
    speed: 0.08, atk: 0.06, def: 0.05, lifespan: 16, lawId: 'pill', artName: '赤焰灼灵掌',
    desc: '分文火温养、武火淬炼两路。青崖镇上几个炼丹散修靠它糊口，既助成丹，吐火御敌也够用。',
  },
  {
    id: 'wt_yinlei_zhi', name: '《引雷破煞指》', grade: '黄', align: '正', category: '雷法', source: '松岭寨古松石匣',
    speed: 0.07, atk: 0.11, def: 0.04, lifespan: 4, lawId: 'thunder', artName: '一指惊雷落',
    desc: '聚游离雷气于指尖，点出时电光一闪，专克邪祟阴物。原本封在松岭寨一棵雷劈古松下的石匣里。',
  },
  {
    id: 'wt_suofeng_jue', name: '《缩风御影诀》', grade: '黄', align: '中', category: '时空', source: '石泉驿后山石洞',
    speed: 0.09, atk: 0.07, def: 0.06, lifespan: 6, lawId: 'space', artName: '御风裂影斩',
    desc: '借风势而行，身法快，出手多在闪转之间。石泉驿的脚夫在后山石洞里避雨时找到的。',
  },
  {
    id: 'wt_chanyi_jue', name: '《枯荣吐息经》', grade: '黄', align: '中', category: '时空', source: '青崖谷旧茅庵',
    speed: 0.08, atk: 0.05, def: 0.07, lifespan: 22, lawId: 'time', artName: '秋叶枯荣印',
    desc: '青崖宗立派以前，谷中散修结茅时留下的旧物。观四时草木枯荣悟出的养生法，行气悠长，能延寿数。',
  },
  {
    id: 'wt_beidou_bu', name: '《北斗七星步》', grade: '黄', align: '中', category: '星辰', source: '观星台观测点旧吏',
    speed: 0.08, atk: 0.08, def: 0.08, lifespan: 10, lawId: 'star', artName: '七星连珠击',
    desc: '从天枢踏到摇光，七步成势，每一步引一点星辉入体，攻守均衡。原是观星台外派观测的人夜里防身用的。',
  },
  {
    id: 'wt_hongchen_jian', name: '《红尘问心诀》', grade: '黄', align: '正', category: '因果', source: '沙州茶棚说书人',
    speed: 0.09, atk: 0.06, def: 0.08, lifespan: 14, lawId: 'karma', artName: '问心清风掌',
    desc: '不避市井喧嚣，在人来人往里磨道心，气机清楚，少生魔障。沙州茶棚一个说书人讲了半辈子，才把它传出去。',
  },
  {
    id: 'wt_langsha_quan', name: '《苍狼嗜血拳》', grade: '黄', align: '邪', category: '魔功', source: '朔川草滩牧人遗骨',
    speed: 0.1, atk: 0.12, def: 0.03, lifespan: -2, lawId: 'blood', artName: '苍狼裂喉爪',
    desc: '学草原狼搏命撕咬的架势，气血一翻，拳劲就涨。打法凶，伤人也伤己。',
  },
  {
    id: 'wt_wuxing_za', name: '《五行杂气功》', grade: '黄', align: '中', category: '混沌', source: '青石老窑野修手札',
    speed: 0.08, atk: 0.07, def: 0.08, lifespan: 12, lawId: 'chaos', artName: '五行轮转掌',
    desc: '写给灵根驳杂之人的功法，借五行相生慢慢化浊为清。手札藏在青石老窑窑壁的暗格里，是早年借窑火烧陶符的野修留下的。',
  },

  // ==================== 玄阶功法 (12 卷) ====================
  {
    id: 'wt_qingshuang_jue', name: '《东田耕气诀》', grade: '玄', align: '正', category: '剑诀', source: '青石镇阿衡家传',
    speed: 0.13, atk: 0.19, def: 0.08, lifespan: 15, lawId: 'sword', artName: '犁锋开垄',
    desc: '阿衡家几代种灵田传下来的行气法，原是翻土挖沟时省力用的。镰锄起落自有章法，换成刀剑使出来，同样沉得住。阿衡自己只叫它「锄地的劲」。',
  },
  {
    id: 'wt_jinzhong_ti', name: '《古铜金刚体》', grade: '玄', align: '中', category: '体术', source: '雁门外古战场石棺',
    speed: 0.11, atk: 0.12, def: 0.19, lifespan: 25, lawId: 'blood', artName: '铜身镇岳撞',
    desc: '以地火煞气反复淬炼肉身，练成后皮色发铜，刀兵难伤。石棺里的人穿着前朝甲胄。',
  },
  {
    id: 'wt_qihua_dan', name: '《七花凝露经》', grade: '玄', align: '正', category: '丹经', source: '青崖谷七十二涧药窟',
    speed: 0.13, atk: 0.09, def: 0.12, lifespan: 32, lawId: 'pill', artName: '青焰缠丝印',
    desc: '采涧谷里七种带毒的灵花提纯生机，丹火清而绵长，疗伤解毒都好用。',
  },
  {
    id: 'wt_qimen_dun', name: '《奇门遁甲篇》', grade: '玄', align: '中', category: '阵典', source: '玄衡宗外门旧库',
    speed: 0.14, atk: 0.13, def: 0.16, lifespan: 15, lawId: 'array', artName: '八门锁魂阵',
    desc: '休生伤杜景死惊开，八门轮转，可以弱胜强。玄衡外门弟子抄录时漏了几页，抄本流到了山下。',
  },
  {
    id: 'wt_kuanglei_dao', name: '《狂雷断岳刀》', grade: '玄', align: '正', category: '雷法', source: '黑石峡断碑',
    speed: 0.12, atk: 0.21, def: 0.07, lifespan: 8, lawId: 'thunder', artName: '狂雷劈山刀',
    desc: '把雷气灌进刀口，势大力沉，一刀下去能劈开岩壁。断碑立在黑石峡的石壁下，一半没在水里。',
  },
  {
    id: 'wt_huanxing_yi', name: '《幻星移位诀》', grade: '玄', align: '中', category: '时空', source: '菱湖沉船铁匣',
    speed: 0.15, atk: 0.14, def: 0.12, lifespan: 18, lawId: 'space', artName: '移形换影刺',
    desc: '以神识牵着身周尺许空间错开，敌招到时，人已在对方背后。',
  },
  {
    id: 'wt_qingqiu_huan', name: '《行商察人术》', grade: '玄', align: '中', category: '因果', source: '青石镇行商陆清所传',
    speed: 0.16, atk: 0.15, def: 0.14, lifespan: 40, lawId: 'karma', artName: '察言辨色',
    desc: '陆清跑商路多年攒下的看人本事，后来又从一位西陲老驼商那里换得半卷心法，两样合在一处。观气色、听口风，对手出招前的那点念头也瞒不过去。',
  },
  {
    id: 'wt_hanjiang_jue', name: '《寒江独钓经》', grade: '玄', align: '中', category: '时空', source: '菱湖渡老渔翁',
    speed: 0.14, atk: 0.13, def: 0.15, lifespan: 38, lawId: 'time', artName: '孤舟凝岁钓',
    desc: '看湖水涨落悟出光阴快慢。出手很静，杀招藏在后面。',
  },
  {
    id: 'wt_ziwei_xing', name: '《紫微斗数引星诀》', grade: '玄', align: '中', category: '星辰', source: '观星台外阁旧档',
    speed: 0.15, atk: 0.16, def: 0.14, lifespan: 22, lawId: 'star', artName: '紫微星芒坠',
    desc: '借紫微星辉淬炼识海，法力凝练，夜里交手威势更足。',
  },
  {
    id: 'wt_shixue_mo', name: '《嗜血化煞功》', grade: '玄', align: '邪', category: '魔功', source: '芦洲米市暗档',
    speed: 0.18, atk: 0.22, def: 0.06, lifespan: 0, lawId: 'blood', artName: '化煞噬心掌',
    desc: '以敌血养煞、以煞催灵，进境极快，也最容易招来围剿。芦洲米市的暗档里偶尔有人出手，价钱不低。',
  },
  {
    id: 'wt_sanyuan_jue', name: '《三元合气诀》', grade: '玄', align: '中', category: '混沌', source: '东岭古修坐化洞府',
    speed: 0.14, atk: 0.14, def: 0.15, lifespan: 28, lawId: 'chaos', artName: '三元归真印',
    desc: '融精气神三元为一炉，灵力浑厚无偏，为日后修习高阶杂学打底。',
  },
  {
    id: 'wt_bisha_jian', name: '《碧沙听潮剑》', grade: '玄', align: '正', category: '剑诀', source: '沙湾渡船家口传',
    speed: 0.14, atk: 0.18, def: 0.11, lifespan: 15, lawId: 'sword', artName: '潮生碧海剑',
    desc: '学江潮一浪推一浪的势头，剑势一浪高过一浪，连绵不断，难寻破绽。',
  },

  // ==================== 地阶功法 (12 卷) ====================
  {
    id: 'wt_hanmei_jian', name: '《观星台护身剑》', grade: '地', align: '正', category: '剑诀', source: '观星台旧档（宋宜所藏）',
    speed: 0.21, atk: 0.29, def: 0.15, lifespan: 35, lawId: 'sword', artName: '观星护盘剑',
    desc: '观星台外派观测的人随身护盘的剑法，旧档只录给入了册的人。宋宜在临河管仓，平日只拨算盘，这卷剑谱压在她账箱最底下。剑路短而准，专护身前三尺。',
  },
  {
    id: 'wt_shennong_dan', name: '《青石百草方》', grade: '地', align: '正', category: '丹经', source: '青石镇徐娘手录',
    speed: 0.2, atk: 0.18, def: 0.2, lifespan: 85, lawId: 'pill', artName: '百草回春火',
    desc: '徐娘行医二十多年记下的方子，夹着她师父留下的半本古方，据说源头是青崖宗立派前的旧传。哪味药从哪条涧采、路上耽搁几天要减几成药性，都写在页边。',
  },
  {
    id: 'wt_canghai_jue', name: '《石泉引水诀》', grade: '地', align: '中', category: '星辰', source: '东岭药农口传（石泉所授）',
    speed: 0.22, atk: 0.27, def: 0.21, lifespan: 50, lawId: 'star', artName: '七十二涧引水式',
    desc: '东岭药农分水护溪传下的行气法，按星位定开闸时辰，七十二涧的水势都算在里面。石泉守溪几十年，夜里看星定水，把它练成了一门能伤人的功夫。',
  },
  {
    id: 'wt_qianji_zhen', name: '《铜谷千锤阵》', grade: '地', align: '中', category: '阵典', source: '铜谷炉坊秘传（秦铸所授）',
    speed: 0.21, atk: 0.24, def: 0.27, lifespan: 45, lawId: 'array', artName: '千锤连环阵',
    desc: '铜谷炉坊几代坊主守炉护坊的阵法，炉、砧、锤各占阵位，一处起火，处处相应。秦铸只传给肯守炉的人。',
  },
  {
    id: 'wt_huangquan_yin', name: '《朔川鹰游印》', grade: '地', align: '邪', category: '时空', source: '朔部首领口传（阿史那岚所授）',
    speed: 0.23, atk: 0.29, def: 0.18, lifespan: 55, lawId: 'space', artName: '鹰游断道印',
    desc: '朔部历代首领驯鹰巡道时用的秘印。鹰飞多远，印就能把人送出多远，也能把敌人截在多远。手法狠辣，边军一向当它是邪术。',
  },
  {
    id: 'wt_longxiang_ti', name: '《太古龙象镇狱体》', grade: '地', align: '中', category: '体术', source: '前朝皇陵神道残碑',
    speed: 0.19, atk: 0.28, def: 0.28, lifespan: 70, lawId: 'blood', artName: '龙象般若镇狱拳',
    desc: '刻在前朝皇陵神道一块残碑上的炼体法，引巨象之力淬炼气血。碑文缺了一角，至今没人练全过。',
  },
  {
    id: 'wt_jiutian_lei', name: '《九天应元雷经》', grade: '地', align: '正', category: '雷法', source: '天机阁藏本残页',
    speed: 0.22, atk: 0.3, def: 0.16, lifespan: 30, lawId: 'thunder', artName: '九天应元灭魔雷',
    desc: '天机阁藏本里夹着的几页残经，说是赤霞旧府流出的雷法正典。掌中能引雷，渡劫时也可借雷淬体。',
  },
  {
    id: 'wt_chunqiu_bi', name: '《春秋一梦岁月诀》', grade: '地', align: '中', category: '时空', source: '河洛门阀族塾旧藏',
    speed: 0.23, atk: 0.22, def: 0.22, lifespan: 95, lawId: 'time', artName: '南柯一梦断岁华',
    desc: '河洛一家门阀的族塾里压了几百年的旧书。梦里百年、世间一瞬，修成后能让对手的招式慢上半息。',
  },
  {
    id: 'wt_beiming_xing', name: '《北溟吞星诀》', grade: '地', align: '中', category: '星辰', source: '沙州盐湖湖底玉碑',
    speed: 0.22, atk: 0.26, def: 0.2, lifespan: 45, lawId: 'star', artName: '北溟星涡吞天式',
    desc: '盐湖退水那一年露出的一块玉碑，碑上刻着吞纳星辉的心法。练成者灵海深，久战不乏。',
  },
  {
    id: 'wt_yehuo_lian', name: '《红莲业火真经》', grade: '地', align: '正', category: '因果', source: '白驼驿外石窟',
    speed: 0.21, atk: 0.28, def: 0.2, lifespan: 50, lawId: 'karma', artName: '红莲业火焚诸邪',
    desc: '白驼驿外一处石窟壁上的经文，说是赤霞旧府鼎盛时一位古修所留。引因果业力化火，对手造的孽越重，烧得越狠。',
  },
  {
    id: 'wt_taiji_hun', name: '《太极两仪混元经》', grade: '地', align: '中', category: '混沌', source: '宛丘废观梁上',
    speed: 0.23, atk: 0.24, def: 0.26, lifespan: 65, lawId: 'chaos', artName: '太极阴阳逆转掌',
    desc: '阴阳相济、刚柔并用，可借敌之力反制其身。宛丘一座废观的房梁上藏着这卷经，拆梁的木匠拿它换了两斗米。',
  },
  {
    id: 'wt_kongming_dun', name: '《空明缩界经》', grade: '地', align: '中', category: '时空', source: '观星台旧档·裂缝卷',
    speed: 0.24, atk: 0.25, def: 0.21, lifespan: 40, lawId: 'space', artName: '方寸断空指',
    desc: '观星台记录空间裂缝的旧档后面附了这一卷，讲如何把锋芒折进方寸之间，咫尺可作千里。',
  },

  // ==================== 天阶功法 (12 卷) ====================
  {
    id: 'wt_guhong_jian', name: '《临河守城剑》', grade: '天', align: '正', category: '剑诀', source: '临河城守将顾淮所传',
    speed: 0.3, atk: 0.44, def: 0.16, lifespan: 65, lawId: 'sword', artName: '封门一剑',
    desc: '临河城历代守将传下的剑法，最早一页的落款还是前朝年号，嘉澜年间大水时险些泡烂。只守不追，一剑只为封住城门那一丈地。顾淮常说，守城的人第一刀要留着。',
  },
  {
    id: 'wt_tianji_ce', name: '《测灵罗盘心诀》', grade: '天', align: '中', category: '因果', source: '观星台器匠旧传（沈砚所藏）',
    speed: 0.32, atk: 0.34, def: 0.32, lifespan: 90, lawId: 'karma', artName: '盘针定穴',
    desc: '沈砚在观星台做器匠时从旧档里抄出的心诀，原是校测灵罗盘盘心用的：神识随盘针走，看清气机流向。用在人身上，对手的命门在哪，针就指向哪。',
  },
  {
    id: 'wt_xuehe_sha', name: '《黑风血刀》', grade: '天', align: '邪', category: '魔功', source: '黑风寨寨主韩彪所传',
    speed: 0.36, atk: 0.48, def: 0.18, lifespan: 50, lawId: 'blood', artName: '血刀断闸',
    desc: '黑风寨据闸之前就有的刀法，传说出自赤霞遗脉一个逃出来的人。以血催刀，越杀越凶。韩彪靠它坐稳了旧河闸。',
  },
  {
    id: 'wt_qinglian_jian', name: '《雁门斩马剑》', grade: '天', align: '正', category: '剑诀', source: '北境边军历代统领口传（林照所授）',
    speed: 0.33, atk: 0.46, def: 0.22, lifespan: 110, lawId: 'sword', artName: '斩马破阵',
    desc: '雁门边军历代统领只传一人的剑法，肇宁年间修关时就有了。一剑横斩，专断马腿。阵上看的是谁站得住，林照把它改得更省力。',
  },
  {
    id: 'wt_jiuzhuan_ti', name: '《九转不灭体》', grade: '天', align: '中', category: '体术', source: '白驼废墟古冢',
    speed: 0.28, atk: 0.4, def: 0.4, lifespan: 140, lawId: 'blood', artName: '神魔九转破界拳',
    desc: '白驼废墟一座古冢里的炼体法，九转练成后伤口自合，硬接法宝不伤。世上见过全本的人不出三个。',
  },
  {
    id: 'wt_danxin_zaohua', name: '《紫府造化丹神录》', grade: '天', align: '正', category: '丹经', source: '赤霞旧府丹房残简',
    speed: 0.31, atk: 0.32, def: 0.3, lifespan: 165, lawId: 'pill', artName: '紫府仙火焚万厄',
    desc: '以紫府为鼎，日夜吐纳自炼，寿元极长。残简出自赤霞旧府丹房，天机阁存了一份抄本，从不外借。',
  },
  {
    id: 'wt_zhuxian_zhen', name: '《四象诛魔古阵图》', grade: '天', align: '中', category: '阵典', source: '前朝旧都城下残碑',
    speed: 0.3, atk: 0.42, def: 0.34, lifespan: 80, lawId: 'array', artName: '四象绝杀剑阵',
    desc: '军中传说宁高祖攻克旧都时，山中异人布的就是这座阵。官修史书不载，残碑至今埋在旧都城根下。一人可作四象阵眼。',
  },
  {
    id: 'wt_zixiao_shenlei', name: '《紫霄太清神雷典》', grade: '天', align: '正', category: '雷法', source: '玄衡主峰雷碑拓本',
    speed: 0.31, atk: 0.43, def: 0.24, lifespan: 75, lawId: 'thunder', artName: '紫霄天罚降世雷',
    desc: '玄衡主峰绝顶一块雷碑的拓本，引最上层的紫霄雷。邪祟闻声即退，渡天劫时也能削弱雷威。',
  },
  {
    id: 'wt_taixu_jie', name: '《太虚步界真经》', grade: '天', align: '中', category: '时空', source: '空间裂缝旁拾得的玉简',
    speed: 0.34, atk: 0.38, def: 0.3, lifespan: 95, lawId: 'space', artName: '太虚断界湮灭斩',
    desc: '观星台记过一次裂缝崩开，事后有人在边上拾到这卷玉简。一念可裂开空间，把对手的神通引到别处。',
  },
  {
    id: 'wt_guangyin_sha', name: '《光阴飞沙太素卷》', grade: '天', align: '中', category: '时空', source: '白驼流沙古城铜沙漏',
    speed: 0.33, atk: 0.35, def: 0.33, lifespan: 180, lawId: 'time', artName: '岁月飞沙枯骨印',
    desc: '流沙下一座古城里，一只铜沙漏中封着这卷书。执一捧流沙，撒落处金石风化、寿元倒流。',
  },
  {
    id: 'wt_xingchen_bian', name: '《太古星辰变》', grade: '天', align: '中', category: '星辰', source: '西陲陨星坑古碑',
    speed: 0.33, atk: 0.41, def: 0.34, lifespan: 120, lawId: 'star', artName: '周天星海倾覆拳',
    desc: '于丹田开辟一片小星海，引群星生灭为己用，境界越高越见威力。',
  },
  {
    id: 'wt_hundun_dao', name: '《鸿蒙混元道经》', grade: '天', align: '中', category: '混沌', source: '赤霞旧府灵池残碑',
    speed: 0.35, atk: 0.42, def: 0.36, lifespan: 135, lawId: 'chaos', artName: '鸿蒙一气镇乾坤',
    desc: '引天地初分之气洗炼全身，万法归流，能压住单一五行的神通。碑在赤霞旧府已经干涸的灵池边。',
  },

  // ==================== 仙阶功法 (10 卷) ====================
  {
    id: 'wt_zhoutian_xing', name: '《天机阁周天图》', grade: '仙', align: '中', category: '星辰', source: '玄衡宗天机阁秘藏（清虚所掌）',
    speed: 0.44, atk: 0.56, def: 0.48, lifespan: 260, lawId: 'star', artName: '周天星图镇脉',
    desc: '天机阁最深处的一幅星图，传说是玄衡先祖从赤霞旧府废墟里带出来的，护脉大阵的阵眼就按它排布。历代主事只许一人参看，清虚守了它半辈子。',
  },
  {
    id: 'wt_zhuxian_jian', name: '《诛仙太初剑典》', grade: '仙', align: '正', category: '剑诀', source: '赤霞旧府剑冢残碑',
    speed: 0.44, atk: 0.68, def: 0.32, lifespan: 200, lawId: 'sword', artName: '诛仙一剑斩天道',
    desc: '古籍残载的杀伐剑典。碑在赤霞旧府剑冢深处，字迹多半已被流沙磨平。非大毅力者不可练。',
  },
  {
    id: 'wt_jiuzhuan_xuandan', name: '《太乙九转还丹经》', grade: '仙', align: '正', category: '丹经', source: '赤霞旧府丹宫玉册',
    speed: 0.42, atk: 0.46, def: 0.44, lifespan: 420, lawId: 'pill', artName: '太乙兜率真火劫',
    desc: '以肉身元神合炼九转还丹的古法，天机阁藏本只录了一页目录。传说功成之日不老不死，无人能证真假。',
  },
  {
    id: 'wt_xiantian_bagua', name: '《先天混元大阵仙图》', grade: '仙', align: '中', category: '阵典', source: '赤霞旧府主殿地宫',
    speed: 0.43, atk: 0.54, def: 0.54, lifespan: 240, lawId: 'array', artName: '先天八卦封仙阵',
    desc: '刻在一块灵玉上的古阵总纲，布阵成界，真仙入阵也难脱身。玄衡护脉大阵据说只学到其中一角。',
  },
  {
    id: 'wt_jiuxiao_leidi', name: '《雷帝灭劫经》', grade: '仙', align: '正', category: '雷法', source: '白驼废墟焦黑石柱',
    speed: 0.45, atk: 0.62, def: 0.4, lifespan: 210, lawId: 'thunder', artName: '雷帝灭世劫',
    desc: '白驼废墟一根焦黑石柱上的铭文，古籍说是赤霞诸派引天火时所刻。修成者万雷俯首，渡劫如常。',
  },
  {
    id: 'wt_xukong_xian', name: '《太初虚空大道经》', grade: '仙', align: '中', category: '时空', source: '大观星台地基石刻',
    speed: 0.46, atk: 0.56, def: 0.46, lifespan: 240, lawId: 'space', artName: '太虚崩界归寂指',
    desc: '观星台修大观星台打地基时挖出的古石刻，列为禁档。一步可越千里，一指可让方圆百里化为虚无。',
  },
  {
    id: 'wt_suiyue_xian', name: '《岁月长河不朽仙经》', grade: '仙', align: '中', category: '时空', source: '赤霞旧府古木殿',
    speed: 0.45, atk: 0.52, def: 0.5, lifespan: 500, lawId: 'time', artName: '岁月倒流断光阴',
    desc: '古籍残载，讲人如何不被光阴冲走。一念花开万载，一念桑田成海。',
  },
  {
    id: 'wt_yinguo_tianshu', name: '《大因果轮回仙书》', grade: '仙', align: '正', category: '因果', source: '雁门关下无字碑',
    speed: 0.45, atk: 0.54, def: 0.5, lifespan: 280, lawId: 'karma', artName: '三生因果断宿命',
    desc: '雁门关下一块无字碑。传说神识能透进石里的人会看见满篇文字，讲因果丝线如何牵连三世。',
  },
  {
    id: 'wt_minghe_xuezun', name: '《赤霞血海经》', grade: '仙', align: '邪', category: '魔功', source: '赤霞遗脉骨碑',
    speed: 0.52, atk: 0.66, def: 0.36, lifespan: 220, lawId: 'blood', artName: '血海覆沙',
    desc: '赤霞遗脉奉为根本的掠灵古法，以血海化万物。杀伐太重，古籍里只敢记下一个名字。',
  },
  {
    id: 'wt_kaishi_hundun', name: '《太初混沌开天仙经》', grade: '仙', align: '中', category: '古传承', source: '赤霞旧府地心石碑',
    speed: 0.5, atk: 0.64, def: 0.56, lifespan: 400, lawId: 'chaos', artName: '太初开天辟地印',
    desc: '传说是天地初开时第一道道音所化，万法之母。赤霞诸派为争地心磁砂元精妄引天火地脉，据说就是想参透这块碑；灵根崩毁之后，碑沉进了流沙。',
  },
];

export const WORLD_TECH_BY_ID = Object.fromEntries(WORLD_TECHNIQUES.map((t) => [t.id, t]));

export const ALL_TECHNIQUES = [
  ...WORLD_TECHNIQUES.map((t) => ({ ...t, align: t.align || '中', sectId: null, sectName: null })),
  ...Object.entries(SECT_LIBRARIES).flatMap(([sectId, list]) => {
    const sect = SECT_BY_ID[sectId];
    const sectName = sect?.name || sectId;
    const defaultAlign = sect?.align === '正' ? '正' : sect?.align === '邪' ? '邪' : '中';
    return list.map((m) => ({
      ...m,
      align: m.align || defaultAlign,
      grade: m.grade || '玄',
      category: '宗门传承',
      source: `${sectName}所传`,
      sectId,
      sectName,
    }));
  }),
];

export const ALL_TECH_BY_ID = Object.fromEntries(ALL_TECHNIQUES.map((t) => [t.id, t]));
