/**
 * 成就（v8 · 宁朝五域）：check 为表达式，状态变化后统一求值。
 * hidden: true 的成就在解锁前只显示 ???，用于「隐藏成就」。
 * karmaReward：解锁时直接给的轮回点；未写时按品阶补（仙 2、天或隐藏 1）。
 *
 * v8 新增「轮回与大历史」一组（前世应验、改写历史、手札、纪年、越阶、劫数、兵解、遗泽、末法）。
 * 其中 count("foretold")、count("handbook_size")、count("mofa_breakthroughs") 三个计数需引擎写入，
 * 见文件末尾说明。
 */
const NPC_NAMES = ['宋宜', '顾淮', '徐娘', '沈砚', '韩彪', '阿衡', '石泉', '秦铸', '阿史那岚', '陆清', '林照', '清虚'];
const npcCount = (n) => `(${NPC_NAMES.map((x) => `(rel("${x}") >= ${n})`).join(' + ')})`;
const LAW_SUM = '(law("sword") + law("pill") + law("array") + law("thunder") + law("space") + law("time") + law("star") + law("karma") + law("blood") + law("chaos"))';

export const ACHIEVEMENTS = [
  // —— 境界 ——
  { id: 'a_first_qi', name: '引气入体', desc: '第一次成功引气入体。', check: 'realm >= 1 || layer >= 1' },
  { id: 'a_zhuji', name: '道基初成', desc: '踏入筑基境。', check: 'realm >= 1' },
  { id: 'a_jindan', name: '一粒丹成', desc: '结丹成功，从此我命由我。', check: 'realm >= 2' },
  { id: 'a_yuanying', name: '元婴出窍', desc: '元婴离体而不散。世人称之为陆地神仙。', check: 'realm >= 3' },
  { id: 'a_huashen', name: '化神', desc: '踏入化神。此后的路，古籍里只剩残载。', check: 'realm >= 4' },
  { id: 'a_lianxu', name: '炼虚合道', desc: '虚实之间，再无界限。', check: 'realm >= 5' },
  { id: 'a_heti', name: '法身合一', desc: '身与道合，难被杀死。', check: 'realm >= 6' },
  { id: 'a_dacheng', name: '大乘之巅', desc: '只差渡劫一步。', check: 'realm >= 7' },
  { id: 'a_dujie', name: '渡劫之人', desc: '开始数天劫。', check: 'realm >= 8' },
  { id: 'a_xian', name: '真仙在世', desc: '渡过天劫，成就真仙。没有天外可去，人仍在五域。', check: 'realm >= 9', tier: '仙' },
  { id: 'a_fast_jindan', name: '六十载结丹', desc: '六十岁前结丹。', check: 'realm >= 2 && age < 60' },
  { id: 'a_fast_yuanying', name: '百岁元婴', desc: '百岁前凝婴。', check: 'realm >= 3 && age < 100' },
  { id: 'a_slow_lianqi', name: '炼气期钉子户', desc: '在炼气期待满一百年。', check: 'realm === 0 && age >= 116', hidden: true },
  { id: 'a_old_xian', name: '老而不死', desc: '三千岁后仍在人间修行。', check: 'age >= 3000' },
  { id: 'a_no_break_fail', name: '一往无前', desc: '连续十次突破未失手。', check: 'counters.streak_break >= 10' },
  { id: 'a_break_fail_10', name: '天道弃子', desc: '连续十次突破失败。', check: 'counters.streak_fail >= 10', hidden: true },

  // —— 灵根 ——
  { id: 'a_root_tian', name: '天灵根', desc: '抽中万古一遇的天灵根。', check: 'char.rootId === "tianling"', tier: '仙' },
  { id: 'a_root_hundun', name: '混沌之体', desc: '抽中不容于天道的混沌灵根。', check: 'char.rootId === "hundun"', tier: '仙', hidden: true },
  { id: 'a_root_fake', name: '凡骨问道', desc: '以伪灵根踏入筑基。', check: 'char.rootId === "wulinggen" && realm >= 1', hidden: true },
  { id: 'a_root_lei', name: '雷种', desc: '雷灵根入门。', check: 'char.rootId === "lei"' },
  { id: 'a_root_xue', name: '血种', desc: '血灵根入门。', check: 'char.rootId === "xue"' },
  { id: 'a_root_kong', name: '裂空者', desc: '空间灵根入门。', check: 'char.rootId === "kongjian"' },
  { id: 'a_root_all', name: '万灵归一', desc: '在轮回中体验过八种以上灵根。', check: 'meta.rootsSeen.length >= 8', hidden: true },

  // —— 门户 ——
  { id: 'a_join_sect', name: '有了门户', desc: '投身一处宗门、衙门或势力。', check: 'sect() != ""' },
  { id: 'a_inner', name: '内门', desc: '晋升内门（或同等职级）。', check: 'char.sectRank >= 1' },
  { id: 'a_true', name: '真传', desc: '成为真传（或同等职级）。', check: 'char.sectRank >= 2' },
  { id: 'a_elder', name: '长老', desc: '坐上长老之位（或同等职级）。', check: 'char.sectRank >= 4' },
  { id: 'a_supreme', name: '太上', desc: '坐上门户里的最高位。', check: 'char.sectRank >= 5' },
  { id: 'a_all_sects', name: '十二门户', desc: '在轮回中投身过十二处不同的门户。', check: 'meta.sectsJoined.length >= 12', hidden: true },
  { id: 'a_sanxiu_100', name: '散修百年', desc: '无门无派修行百年。', check: '(sect() == "" || sect() == "sanxiu") && age >= 116', hidden: true },
  { id: 'a_betray', name: '叛门', desc: '离开曾经跪拜过的山门。', check: 'betrayCount >= 1 || flag("临阵脱逃")', hidden: true },

  // —— 战斗 ——
  { id: 'a_first_blood', name: '初染血', desc: '第一次杀死敌人。', check: 'stats.kills >= 1' },
  { id: 'a_kill_10', name: '手中有人命', desc: '杀敌十人。', check: 'stats.kills >= 10' },
  { id: 'a_kill_100', name: '杀伐果断', desc: '杀敌百人。', check: 'stats.kills >= 100' },
  { id: 'a_kill_1000', name: '一将功成', desc: '杀敌千人。', check: 'stats.kills >= 1000', tier: '天' },
  { id: 'a_kill_demon', name: '斩妖', desc: '斩杀第一头妖邪。', check: 'counter("demons_slain") >= 1' },
  { id: 'a_kill_demon_lord', name: '妖王授首', desc: '斩杀妖王。', check: 'flag("斩妖王")', tier: '地' },
  { id: 'a_escape', name: '三十六计', desc: '在必败之战中全身而退。', check: 'stats.escapes >= 1' },
  { id: 'a_no_weapon', name: '空手', desc: '不持法器击败筑基修士。', check: 'flag("空手胜筑基")', hidden: true },
  { id: 'a_duel_win', name: '擂台不败', desc: '擂台累计胜十场。', check: 'counters.arena_win >= 10' },

  // —— 奇遇 / 探索 ——
  { id: 'a_first_event', name: '出门', desc: '经历第一次奇遇。', check: 'stats.events >= 1' },
  { id: 'a_event_50', name: '见多识广', desc: '经历五十次奇遇。', check: 'stats.events >= 50' },
  { id: 'a_event_200', name: '人间走遍', desc: '经历二百次奇遇。', check: 'stats.events >= 200', tier: '天' },
  { id: 'a_secret_1', name: '秘境初探', desc: '进入一处古修秘境。', check: 'flag("洞天") || flag("禁地") || counters.secrets >= 1' },
  { id: 'a_secret_all', name: '秘境猎人', desc: '同一世通关五处不同的秘境。', check: 'char.secretsCleared.length >= 5' },
  { id: 'a_treasure', name: '拾得法宝', desc: '获得一件地阶以上法宝。', check: 'flag("得地阶法宝")' },
  { id: 'a_immortal_herb', name: '万年灵草', desc: '采到一株万年灵草。', check: 'flag("万年灵草")' },
  { id: 'a_ghost', name: '与鬼同行', desc: '在乱葬岗过一夜。', check: 'flag("掌心囍") || flag("祠堂牌位")', hidden: true },
  { id: 'a_star', name: '观星者', desc: '推演出一场天象。', check: 'flag("推演天象")' },

  // —— 丹器 ——
  { id: 'a_alchemy_1', name: '一炉丹成', desc: '第一次炼丹成功。', check: 'counters.alchemy >= 1' },
  { id: 'a_alchemy_50', name: '丹道中人', desc: '炼丹成功五十次。', check: 'counters.alchemy >= 50' },
  { id: 'a_alchemy_fail', name: '炸炉', desc: '炸掉一炉丹。', check: 'counters.alchemy_fail >= 1', hidden: true },
  { id: 'a_craft_1', name: '开炉', desc: '第一次祭炼本命法宝。', check: 'counters.craft >= 1' },
  { id: 'a_pill_100', name: '药罐子', desc: '服下一百枚丹药。', check: 'stats.pills >= 100' },
  { id: 'a_pill_overdose', name: '炸炉三次', desc: '累计炸掉三炉丹。', check: 'counter("alchemy_fail") >= 3', hidden: true },

  // —— 心魔 / 道心 ——
  { id: 'a_demon_1', name: '心魔初现', desc: '心魔缠身。', check: 'demon >= 10' },
  { id: 'a_demon_50', name: '魔念丛生', desc: '心魔深重。', check: 'demon >= 50' },
  { id: 'a_demon_90', name: '半人半魔', desc: '站在人的边缘。', check: 'demon >= 90', hidden: true },
  { id: 'a_pure', name: '道心澄澈', desc: '道心达到一百。', check: 'char.attrs.道心 >= 100' },
  { id: 'a_pure_200', name: '太上忘情', desc: '道心达到二百。', check: 'char.attrs.道心 >= 200', tier: '天' },
  { id: 'a_settle', name: '静坐', desc: '十次压下心魔。', check: 'counters.settle >= 10' },

  // —— 红尘 ——
  { id: 'a_lover', name: '道侣', desc: '与一人结为道侣。', check: 'flag("道侣")' },
  { id: 'a_lover_death', name: '白发人', desc: '看着道侣先你而去。', check: 'flag("道侣已故")', hidden: true },
  { id: 'a_disciple', name: '收徒', desc: '收下第一个弟子。', check: 'counters.disciples >= 1' },
  { id: 'a_disciple_10', name: '桃李满山', desc: '门下弟子十人。', check: 'counters.disciples >= 10' },
  { id: 'a_mortal_life', name: '红尘一遭', desc: '在凡人城镇生活满一年。', check: 'flag("红尘一年")', hidden: true },
  { id: 'a_wine', name: '一壶浊酒', desc: '与陌生人喝到天亮。', check: 'flag("喝到天亮")', hidden: true },

  // —— 财富 / 声望 ——
  { id: 'a_stone_1000', name: '小有积蓄', desc: '身家一千灵石。', check: 'stones >= 1000' },
  { id: 'a_stone_100k', name: '富可敌宗', desc: '身家十万灵石。', check: 'stones >= 100000' },
  { id: 'a_rep_100', name: '名声初起', desc: '声望一百。', check: 'reputation >= 100' },
  { id: 'a_rep_1000', name: '名动五域', desc: '声望一千。', check: 'reputation >= 1000', tier: '地' },
  { id: 'a_karma_good', name: '积善之家', desc: '业力达到 +300。', check: 'karma >= 300' },
  { id: 'a_karma_bad', name: '恶贯满盈', desc: '业力低于 -300。', check: 'karma <= -300' },
  { id: 'a_karma_999', name: '众生之敌', desc: '业力低于 -999。', check: 'karma <= -999', hidden: true },

  // —— 收集 ——
  { id: 'a_items_20', name: '百宝囊', desc: '同时持有二十种物品。', check: 'counters.inventory_kinds >= 20' },
  { id: 'a_technique_5', name: '博采众长', desc: '习得五部功法。', check: 'counters.techniques >= 5' },
  { id: 'a_technique_10', name: '万法归宗', desc: '习得十部功法。', check: 'counters.techniques >= 10', hidden: true },
  { id: 'a_title_5', name: '名号', desc: '获得五个称号。', check: 'counters.titles >= 5' },
  { id: 'a_ending_1', name: '一种结局', desc: '收录任意一个结局。', check: 'meta.unlockedEndings.length >= 1' },
  { id: 'a_ending_5', name: '五世轮回', desc: '收录五个不同结局。', check: 'meta.unlockedEndings.length >= 5' },
  { id: 'a_ending_all', name: '二十相归一', desc: '收录二十个不同结局。', check: 'meta.unlockedEndings.length >= 20', tier: '仙', hidden: true },

  // —— 整活 / 隐藏 ——
  { id: 'a_die_first', name: '出师未捷', desc: '第一次身死（或兵解），魂归第一年。', check: 'stats.deaths >= 1 || meta.totalDeaths >= 1' },
  { id: 'a_die_10', name: '十回渡口', desc: '累计十次魂归第一年。', check: 'meta.totalDeaths >= 10', hidden: true },
  { id: 'a_die_100', name: '不死不休', desc: '累计三十次魂归第一年。', check: 'meta.totalDeaths >= 30', hidden: true, tier: '天' },
  { id: 'a_click_100', name: '手不释卷', desc: '一世做出三百次选择。', check: 'stats.actions >= 300' },
  { id: 'a_idle', name: '山中无甲子', desc: '连续闭关十二次。', check: 'counters.deep_streak >= 12', hidden: true },
  { id: 'a_poor', name: '一文不名', desc: '身无分文地活过五十年。', check: 'stones === 0 && age >= 66', hidden: true },
  { id: 'a_frog', name: '井底之蛙', desc: '在同一个地区连住十年不挪窝。', check: 'counters.stay_home >= 10', hidden: true },
  { id: 'a_tea', name: '一盏茶', desc: '在茶摊听完一整段别人的故事。', check: 'flag("听完故事")', hidden: true },
  { id: 'a_rain', name: '听雨', desc: '在雨里站了一夜。', check: 'flag("听雨")', hidden: true },
  { id: 'a_chicken', name: '杀鸡', desc: '被一只凡鸡啄伤。', check: 'flag("被鸡啄")', hidden: true },
  { id: 'a_poem', name: '题壁', desc: '在客栈墙上留下一首诗。', check: 'flag("题壁")', hidden: true },
  { id: 'a_mirror', name: '照见', desc: '在镜中看见另一个自己。', check: 'flag("镜中人")', hidden: true },
  { id: 'a_cycle', name: '轮回者', desc: '完成第一次轮回。', check: 'meta.cycle >= 2' },
  { id: 'a_cycle_5', name: '五世为人', desc: '完成五次轮回。', check: 'meta.cycle >= 6', hidden: true },
  { id: 'a_talent', name: '天赋觉醒', desc: '在轮回中点亮一项天赋。', check: 'meta.talents.length >= 1' },
  { id: 'a_talent_all', name: '道果', desc: '点亮十二项轮回天赋。', check: 'meta.talents.length >= 12', tier: '仙', hidden: true },
  { id: 'a_night', name: '长夜', desc: '夜修功课累计满三百（静修一月记二，闭关记四）。', check: 'counters.night_cultivate >= 300', hidden: true },
  { id: 'a_mountain', name: '看山是山', desc: '修成真仙后，回到青石镇。', check: 'realm >= 9 && region() == "qingniu"', hidden: true },
  { id: 'a_ascend_demon', name: '魔念证道', desc: '心魔五十以上时成就真仙。', check: 'realm >= 9 && demon >= 50', hidden: true },
  { id: 'a_ascend_pure', name: '无垢', desc: '心魔为零时成就真仙。', check: 'realm >= 9 && demon === 0' },
  { id: 'a_true_name', name: '道号', desc: '得到自己的道号。', check: 'flag("道号")' },
  { id: 'a_sword', name: '一剑', desc: '一剑斩断一件地阶法宝。', check: 'flag("剑断法宝")', hidden: true },
  { id: 'a_fish', name: '摸鱼', desc: '在门户事务中偷懒十次。', check: 'counters.slack >= 10', hidden: true },
  { id: 'a_library', name: '书蠹', desc: '读遍藏经阁三层。', check: 'flag("读遍藏经阁")', hidden: true },
  { id: 'a_teacher', name: '好为人师', desc: '开坛讲道，听讲累计三百人次。', check: 'counters.teach >= 300', hidden: true },
  { id: 'a_eternal', name: '长生', desc: '活过一万岁。', check: 'age >= 10000', tier: '仙' },

  // —— 事件印记与轮回累计 ——
  { id: 'a2_sword_grave', name: '剑冢破灵', desc: '在剑冢里破了守剑之灵。', check: 'flag("剑冢破灵")', hidden: true },
  { id: 'a2_earth_artifact', name: '地阶在手', desc: '得到一件地阶法宝。', check: 'flag("得地阶法宝")' },
  { id: 'a2_mountain_god', name: '山神认可', desc: '被一座山认下了。', check: 'flag("山神认可")' },
  { id: 'a2_ghost_throne', name: '坐上鬼王座', desc: '在鬼王殿里坐了一次不该坐的椅子。', check: 'flag("坐过鬼王座")', hidden: true },
  { id: 'a2_hanging', name: '悬棺画', desc: '看过悬棺里的那幅画。', check: 'flag("悬棺画")', hidden: true },
  { id: 'a2_starfall', name: '星坠', desc: '亲眼看见一颗星落下来。', check: 'flag("星坠")' },
  { id: 'a2_wanted', name: '通缉在榜', desc: '名字上了官府的榜。', check: 'flag("通缉")', hidden: true },
  { id: 'a2_debt', name: '欠人情', desc: '欠下一份不好还的人情。', check: 'flag("欠人情")' },
  { id: 'a2_borrow', name: '借过灵石', desc: '向人借过灵石，还没还。', check: 'flag("借过灵石")' },
  { id: 'a2_drink', name: '喝到天亮', desc: '和人喝了一整夜。', check: 'flag("喝到天亮")' },
  { id: 'a2_wolf', name: '养狼人', desc: '养过一窝狼，又放回山里。', check: 'flag("养狼") && flag("放狼归山")', hidden: true },
  { id: 'a2_beast_live', name: '与兽同住', desc: '和一头兽住了三个月。', check: 'flag("与兽同住")', hidden: true },
  { id: 'a2_music', name: '琴楼知音', desc: '在琴楼听懂了一支曲子。', check: 'flag("琴楼知音")' },
  { id: 'a2_fox', name: '狐缘', desc: '欠了一只狐狸一段因果。', check: 'flag("狐缘")', hidden: true },
  { id: 'a2_lover_ship', name: '同船', desc: '同船半日，此后同行一世。', check: 'flag("同船") && flag("道侣")' },
  { id: 'a2_mother', name: '母魂', desc: '在井底寻到了母亲的下落。', check: 'flag("母魂") || flag("见母骸")', hidden: true },
  { id: 'a2_zhouye', name: '周野', desc: '结识周野。', check: 'flag("周野")' },
  { id: 'a2_elder', name: '长老托付', desc: '接过一位长老的托付。', check: 'flag("长老托付")' },
  { id: 'a2_arena', name: '大比魁首', desc: '门内大比拿了第一。', check: 'flag("大比魁首")' },
  { id: 'a2_library', name: '读遍藏经阁', desc: '把藏经阁读空了。', check: 'flag("读遍藏经阁")' },
  { id: 'a2_blood_pool', name: '破血池', desc: '破了一处掠灵的血池。', check: 'flag("破血池")' },
  { id: 'a2_slave', name: '砸了人市', desc: '砸了一处人市。', check: 'flag("砸过人市")' },
  { id: 'a2_gamble_bust', name: '识破赌坊', desc: '看穿了赌坊的机关。', check: 'flag("识破赌坊")' },
  { id: 'a2_emperor', name: '见过皇帝', desc: '见过一位皇帝。', check: 'flag("见过皇帝")' },
  { id: 'a2_rebel', name: '义军战功', desc: '在义军里立过功。', check: 'flag("义军战功")' },
  { id: 'a2_siege', name: '守过围城', desc: '守过一座被围的城。', check: 'flag("守过围城")' },
  { id: 'a2_justice', name: '平过冤案', desc: '替人平反过一桩冤案。', check: 'flag("平过冤案")' },
  { id: 'a2_porridge', name: '施粥', desc: '在灾年施过粥。', check: 'flag("施粥")' },
  { id: 'a2_plague', name: '救疫村', desc: '进过疫村，出来时还活着。', check: 'flag("救疫村")' },
  { id: 'a2_thunder', name: '雷池', desc: '在雷池里站过。', check: 'flag("雷池")', hidden: true },
  { id: 'a2_ice', name: '冰窟', desc: '从冰窟里活着出来。', check: 'flag("冰窟")' },
  { id: 'a2_gold_blood', name: '金血', desc: '血变成了金色。', check: 'flag("金血")', hidden: true },
  { id: 'a2_scale', name: '生鳞', desc: '身上长出了鳞。', check: 'flag("生鳞")', hidden: true },
  { id: 'a2_half', name: '半蜕', desc: '蜕了一半，停不下来。', check: 'flag("半蜕")', hidden: true },
  { id: 'a2_demon_name', name: '知心魔名', desc: '知道了自己心魔的名字。', check: 'flag("知心魔名")', hidden: true },
  { id: 'a2_refuse_demon', name: '拒过心魔', desc: '拒绝过一次心魔的提议。', check: 'flag("拒过心魔")' },
  { id: 'a2_see_death', name: '见过死期', desc: '看见了自己的死期。', check: 'flag("见过死期")', hidden: true },
  { id: 'a2_play_dead', name: '装死之课', desc: '学会了一门装死的本事。', check: 'flag("装死之课")', hidden: true },
  { id: 'a2_faceless', name: '无面之师', desc: '遇见过一个没有脸的师父。', check: 'flag("无面之师")', hidden: true },
  { id: 'a2_ask', name: '问过长生', desc: '问过「长生是什么」。', check: 'flag("问过长生")' },
  { id: 'a2_stele', name: '碑上名', desc: '名字被刻上了碑。', check: 'flag("碑上名")' },
  { id: 'a2_pagoda', name: '塔中名', desc: '名字留在了一座塔里。', check: 'flag("塔中名")' },
  { id: 'a2_list', name: '中过榜', desc: '上过一次榜。', check: 'flag("中过榜")' },
  { id: 'a2_army', name: '军中功', desc: '在军中挣过一份功。', check: 'flag("军中功")' },
  { id: 'a2_tax', name: '抗税', desc: '抗过一次税。', check: 'flag("抗税")' },
  { id: 'a2_books', name: '抹账', desc: '改过官府的账。', check: 'flag("抹账")', hidden: true },
  { id: 'a2_blame', name: '顶罪', desc: '替人顶过一次罪。', check: 'flag("顶罪")' },
  { id: 'a2_stop_duel', name: '止过决斗', desc: '拦下过一场生死斗。', check: 'flag("止过决斗")' },
  { id: 'a2_bargain', name: '捡漏', desc: '在坊市捡过一次漏。', check: 'flag("捡漏")' },
  { id: 'a2_fortune', name: '算命', desc: '让人算过一次命。', check: 'flag("算命")' },
  { id: 'a2_painting', name: '藏画烧画', desc: '藏过一幅画，又烧了它。', check: 'flag("藏画") && flag("烧画")', hidden: true },
  { id: 'a2_silent', name: '哑仆', desc: '遇见过一个不说话的仆人。', check: 'flag("哑仆")', hidden: true },
  { id: 'a2_pass', name: '走过险岭', desc: '走过一回黑风岭。', check: 'flag("走过黑风岭")' },
  { id: 'a2_snow', name: '雪地无痕', desc: '在雪地里走过，没有留下脚印。', check: 'flag("雪地无痕")', hidden: true },
  { id: 'a2_ridge', name: '雷脊', desc: '在雷脊上走过。', check: 'flag("雷脊")' },
  { id: 'a2_fog', name: '布雾退敌', desc: '用一场雾退过敌。', check: 'flag("布雾退敌")' },
  { id: 'a2_walk', name: '山行五度', desc: '在山里走过五趟。', check: 'count("山行") >= 5' },
  { id: 'a2_message', name: '传话三次', desc: '替人传过三次话。', check: 'count("传话") >= 3' },
  { id: 'a2_talent6', name: '天赋六点', desc: '点亮六项轮回天赋。', check: 'meta.talents.length >= 6' },
  { id: 'a2_endings5', name: '五种死法', desc: '收录五个结局。', check: 'meta.unlockedEndings.length >= 5' },
  { id: 'a2_runs10', name: '十世为人', desc: '走完十世。', check: 'meta.runs >= 10' },
  { id: 'a2_roots5', name: '五根尝遍', desc: '用过五种灵根。', check: 'meta.rootsSeen.length >= 5' },

  // —— 十道法则入门与圆满 ——
  { id: 'a3_law_sword_1', name: '剑道初窥', desc: '剑道法则迈入初窥门径。', check: 'law("sword") >= 1' },
  { id: 'a3_law_pill_1', name: '丹道初窥', desc: '丹道法则迈入初窥门径。', check: 'law("pill") >= 1' },
  { id: 'a3_law_array_1', name: '阵道初窥', desc: '阵道法则迈入初窥门径。', check: 'law("array") >= 1' },
  { id: 'a3_law_thunder_1', name: '雷霆初窥', desc: '雷霆法则迈入初窥门径。', check: 'law("thunder") >= 1' },
  { id: 'a3_law_space_1', name: '空间初窥', desc: '空间法则迈入初窥门径。', check: 'law("space") >= 1' },
  { id: 'a3_law_time_1', name: '光阴初窥', desc: '光阴法则迈入初窥门径。', check: 'law("time") >= 1' },
  { id: 'a3_law_star_1', name: '星辰初窥', desc: '星辰法则迈入初窥门径。', check: 'law("star") >= 1' },
  { id: 'a3_law_karma_1', name: '因果初窥', desc: '因果法则迈入初窥门径。', check: 'law("karma") >= 1' },
  { id: 'a3_law_blood_1', name: '血海初窥', desc: '血海法则迈入初窥门径。', check: 'law("blood") >= 1' },
  { id: 'a3_law_chaos_1', name: '混沌初窥', desc: '混沌法则迈入初窥门径。', check: 'law("chaos") >= 1', hidden: true },
  { id: 'a3_law_sword_5', name: '剑道圆满', desc: '剑道法则臻至圆满。', check: 'law("sword") >= 5', tier: '天' },
  { id: 'a3_law_pill_5', name: '丹道圆满', desc: '丹道法则臻至圆满。', check: 'law("pill") >= 5', tier: '天' },
  { id: 'a3_law_array_5', name: '阵道圆满', desc: '阵道法则臻至圆满。', check: 'law("array") >= 5', tier: '天' },
  { id: 'a3_law_thunder_5', name: '雷霆圆满', desc: '雷霆法则臻至圆满。', check: 'law("thunder") >= 5', tier: '天' },
  { id: 'a3_law_space_5', name: '空间圆满', desc: '空间法则臻至圆满。', check: 'law("space") >= 5', tier: '天', hidden: true },
  { id: 'a3_law_time_5', name: '光阴圆满', desc: '光阴法则臻至圆满。', check: 'law("time") >= 5', tier: '天', hidden: true },
  { id: 'a3_law_star_5', name: '星辰圆满', desc: '星辰法则臻至圆满。', check: 'law("star") >= 5', tier: '天' },
  { id: 'a3_law_karma_5', name: '因果圆满', desc: '因果法则臻至圆满。', check: 'law("karma") >= 5', tier: '天' },
  { id: 'a3_law_blood_5', name: '血海圆满', desc: '血海法则臻至圆满。', check: 'law("blood") >= 5', tier: '天', hidden: true },
  { id: 'a3_law_chaos_5', name: '混沌圆满', desc: '混沌法则臻至圆满，万法归源。', check: 'law("chaos") >= 5', tier: '仙', hidden: true },
  { id: 'a3_law_any_3', name: '融会贯通', desc: '任意一道法则达到融会贯通。', check: 'maxLaw() >= 3' },
  { id: 'a3_law_any_5', name: '大道圆满', desc: '任意一道法则臻至圆满。', check: 'maxLaw() >= 5', tier: '天' },
  { id: 'a3_law_dual', name: '双法同修', desc: '同时将两道互补法则修至融会贯通。', check: '(law("sword") >= 3 && law("thunder") >= 3) || (law("space") >= 3 && law("time") >= 3) || (law("pill") >= 3 && law("array") >= 3) || (law("star") >= 3 && law("karma") >= 3)', hidden: true },
  { id: 'a3_law_total_10', name: '万法兼通', desc: '十道法则总阶位达到十阶以上。', check: `${LAW_SUM} >= 10`, tier: '仙', hidden: true },

  // —— 道基与结丹品阶 ——
  { id: 'a3_daobase_shang', name: '上品道基', desc: '铸就上品以上道基。', check: 'char.daoBaseQuality == "shang" || char.daoBaseQuality == "tiandao"' },
  { id: 'a3_daobase_tiandao', name: '天道筑基', desc: '铸就无瑕天道道基。', check: 'char.daoBaseQuality == "tiandao"', tier: '地' },
  { id: 'a3_core_shang', name: '六纹丹', desc: '结成上品以上之丹。', check: 'char.goldenCoreQuality == "shang" || char.goldenCoreQuality == "jiuwen"' },
  { id: 'a3_core_jiuwen', name: '九纹丹', desc: '结成万中无一的九纹极品之丹。', check: 'char.goldenCoreQuality == "jiuwen"', tier: '天' },
  { id: 'a3_perfect_base_core', name: '无瑕道途', desc: '同一世同时成就天道筑基与九纹结丹。', check: 'char.daoBaseQuality == "tiandao" && char.goldenCoreQuality == "jiuwen"', tier: '仙', hidden: true },
  { id: 'a3_fan_to_huashen', name: '凡基化神', desc: '以凡品道基修至化神。', check: 'char.daoBaseQuality == "fan" && realm >= 4', hidden: true },

  // —— 五域行迹（引擎地区编号沿用，含义已换） ——
  { id: 'a3_region_luoxia', name: '初到临河', desc: '踏足南泽临河城与芦洲。', check: 'region() == "luoxia"' },
  { id: 'a3_region_yaosen', name: '入东岭', desc: '走进东岭青崖谷与铜谷。', check: 'region() == "yaosen"' },
  { id: 'a3_region_guixu', name: '玄衡群峰', desc: '登上玄衡宗所在的群峰。', check: 'region() == "guixu"' },
  { id: 'a3_region_beihuang', name: '出雁门', desc: '抵达北境雁门与朔川。', check: 'region() == "beihuang"' },
  { id: 'a3_region_zhongzhou', name: '入宁京', desc: '抵达中州宁京与河洛。', check: 'region() == "zhongzhou"' },
  { id: 'a3_region_kunlun', name: '过玉门', desc: '抵达西陲玉门与沙州。', check: 'region() == "kunlun"', tier: '地' },
  { id: 'a3_region_jiuxiao', name: '赤霞旧府', desc: '深入白驼流沙下的赤霞旧府。', check: 'region() == "jiuxiao"', tier: '天' },
  { id: 'a3_region_qingniu_high', name: '衣锦还乡', desc: '化神以上修为重回青石镇。', check: 'region() == "qingniu" && realm >= 4', hidden: true },
  { id: 'a3_region_beihuang_pure', name: '孤灯守关', desc: '身负大功德，独守北境。', check: 'region() == "beihuang" && karma >= 200', hidden: true },
  { id: 'a3_region_kunlun_low', name: '少年过玉门', desc: '两百岁前便抵达西陲玉门。', check: 'region() == "kunlun" && age < 200', hidden: true },

  // —— 功法、本命法宝与战力 ——
  { id: 'a3_tech_15', name: '藏经于腹', desc: '习得十五部功法。', check: 'counters.techniques >= 15', tier: '地' },
  { id: 'a3_tech_30', name: '万卷在胸', desc: '习得三十部功法。', check: 'counters.techniques >= 30', tier: '天', hidden: true },
  { id: 'a3_artifact_1', name: '初祭本命', desc: '首次祭炼本命法宝。', check: 'char.artifactLevel >= 1' },
  { id: 'a3_artifact_3', name: '灵宝成器', desc: '本命法宝祭炼至三重。', check: 'char.artifactLevel >= 3' },
  { id: 'a3_artifact_5', name: '通玄灵宝', desc: '本命法宝祭炼至四重。', check: 'char.artifactLevel >= 4', tier: '地' },
  { id: 'a3_artifact_8', name: '混沌仙兵', desc: '本命法宝祭炼至五重以上。', check: 'char.artifactLevel >= 5', tier: '仙', hidden: true },
  { id: 'a3_craft_10', name: '巧匠', desc: '祭炼本命法宝十次。', check: 'counters.craft >= 10' },
  { id: 'a3_alchemy_100', name: '丹火长明', desc: '炼丹成功一百次。', check: 'counters.alchemy >= 100', tier: '地' },
  { id: 'a3_attr_wuxing_100', name: '慧眼', desc: '悟性达到一百。', check: 'char.attrs.悟性 >= 100' },
  { id: 'a3_attr_all_50', name: '六边形', desc: '悟性、根骨、神识、道心同时达到五十。', check: 'char.attrs.悟性 >= 50 && char.attrs.根骨 >= 50 && char.attrs.神识 >= 50 && char.attrs.道心 >= 50', hidden: true },

  // —— 机缘与灵兽 ——
  { id: 'a3_gf_bottle', name: '瓶露催灵', desc: '借随身小瓶炼丹十炉以上。', check: 'char.goldenFingerId == "gf_bottle" && counters.alchemy >= 10' },
  { id: 'a3_gf_sword_elder', name: '戒中传剑', desc: '受戒中剑魂指点修至元婴。', check: 'char.goldenFingerId == "gf_sword_elder" && realm >= 3' },
  { id: 'a3_gf_karma_mirror', name: '古镜鉴宝', desc: '借古铜镜积攒两万灵石。', check: 'char.goldenFingerId == "gf_karma_mirror" && stones >= 20000' },
  { id: 'a3_gf_stealth', name: '藏锋三百年', desc: '携龟息藏锋诀活过三百岁且心魔为零。', check: 'char.goldenFingerId == "gf_stealth" && age >= 300 && demon == 0', hidden: true },
  { id: 'a3_gf_signin', name: '碑铭五域', desc: '识海石碑在身，修至化神。', check: 'char.goldenFingerId == "gf_signin" && realm >= 4' },
  { id: 'a3_gf_none_huashen', name: '赤手化神', desc: '不借任何外物机缘，踏入化神。', check: 'char.goldenFingerId == "gf_none" && realm >= 4', tier: '地', hidden: true },
  { id: 'a3_gf_none_ascend', name: '无挂真仙', desc: '不借任何外物机缘，成就真仙。', check: 'char.goldenFingerId == "gf_none" && realm >= 9', tier: '仙', hidden: true },
  { id: 'a3_pet_any', name: '灵兽相伴', desc: '孵化并契约一只伴生灵兽。', check: '!!char.petId' },
  { id: 'a3_pet_turtle', name: '灵龟护道', desc: '契约灵龟。', check: 'char.petId == "pet_turtle"' },
  { id: 'a3_pet_bird', name: '青鸾振翼', desc: '契约青鸾。', check: 'char.petId == "pet_bird"' },
  { id: 'a3_pet_beetle', name: '噬金成群', desc: '契约噬金虫。', check: 'char.petId == "pet_beetle"', hidden: true },
  { id: 'a3_pet_fox', name: '白狐', desc: '契约白狐。', check: 'char.petId == "pet_fox"', hidden: true },

  // —— 结局收集与轮回里程碑 ——
  { id: 'a3_ending_10', name: '十世尘缘', desc: '收录十个不同结局。', check: 'meta.unlockedEndings.length >= 10' },
  { id: 'a3_ending_25', name: '二十五劫', desc: '收录二十五个不同结局。', check: 'meta.unlockedEndings.length >= 25', tier: '地' },
  { id: 'a3_ending_50', name: '半百因果', desc: '收录五十个不同结局。', check: 'meta.unlockedEndings.length >= 50', tier: '天', hidden: true },
  { id: 'a3_ending_75', name: '五域百相', desc: '收录七十五个不同结局。', check: 'meta.unlockedEndings.length >= 75', tier: '天', hidden: true },
  { id: 'a3_ending_100', name: '百世问道', desc: '收录一百个不同结局。', check: 'meta.unlockedEndings.length >= 100', tier: '仙', hidden: true },
  { id: 'a3_cycle_20', name: '二十世轮回', desc: '步入第二十世。', check: 'meta.cycle >= 20', tier: '天' },

  // —— 红尘道友 ——
  { id: 'a3_npc_su_20', name: '仓前对账', desc: '与临河仓吏宋宜好感达到二十。', check: 'rel("宋宜") >= 20' },
  { id: 'a3_npc_su_40', name: '仓灯知己', desc: '与宋宜好感达到四十。', check: 'rel("宋宜") >= 40', tier: '地' },
  { id: 'a3_npc_lu_30', name: '城头论刀', desc: '与临河守将顾淮好感达到三十。', check: 'rel("顾淮") >= 30' },
  { id: 'a3_npc_yao_30', name: '药铺忘年', desc: '与青石镇医者徐娘好感达到三十。', check: 'rel("徐娘") >= 30' },
  { id: 'a3_npc_gu_30', name: '器铺留名', desc: '与器匠沈砚好感达到三十。', check: 'rel("沈砚") >= 30' },
  { id: 'a3_npc_xuesha_30', name: '旧闸座上宾', desc: '与黑风寨寨主韩彪好感达到三十。', check: 'rel("韩彪") >= 30', hidden: true },
  { id: 'a3_npc_lin_30', name: '雁门把酒', desc: '与北境统领林照好感达到三十。', check: 'rel("林照") >= 30' },
  { id: 'a3_npc_lin_win', name: '宿敌终胜', desc: '在终局一战里堂堂正正击败宿敌。', check: 'flag("宿敌_终胜")' },
  { id: 'a3_npc_bond_su', name: '临河并肩', desc: '与宋宜情投意合，结为道侣。', check: 'flag("道侣") && rel("宋宜") >= 40', hidden: true },
  { id: 'a3_npc_all_3', name: '八方结交', desc: '与三位以上五域人物结下深厚交情。', check: `${npcCount(15)} >= 3` },
  { id: 'a3_npc_all_6', name: '正邪皆友', desc: '同时与六位以上五域人物好感达到二十。', check: `${npcCount(20)} >= 6`, tier: '天', hidden: true },
  { id: 'a3_npc_su_high', name: '情比金坚', desc: '与宋宜好感达到八十。', check: 'rel("宋宜") >= 80', tier: '天', hidden: true },

  // —— 长线里程碑 ——
  { id: 'a3_actions_1000', name: '千次抉择', desc: '一世做出一千次选择。', check: 'stats.actions >= 1000' },
  { id: 'a3_actions_3000', name: '百时问道', desc: '一世做出三千次选择。', check: 'stats.actions >= 3000', tier: '天' },
  { id: 'a3_actions_10000', name: '万劫不倦', desc: '一世做出一万次选择。', check: 'stats.actions >= 10000', tier: '仙', hidden: true },
  { id: 'a3_age_1000', name: '千年老怪', desc: '活过一千岁。', check: 'age >= 1000' },
  { id: 'a3_age_5000', name: '五千春秋', desc: '活过五千岁。', check: 'age >= 5000', tier: '天' },
  { id: 'a3_stones_1m', name: '百万灵石', desc: '身家突破一百万灵石。', check: 'stones >= 1000000', tier: '天' },
  { id: 'a3_stones_10m', name: '富埒宁京', desc: '身家突破一千万灵石。', check: 'stones >= 10000000', tier: '仙', hidden: true },
  { id: 'a3_break_25', name: '步步登高', desc: '一世累计突破二十五次。', check: 'stats.breakthroughs >= 25' },
  { id: 'a3_break_50', name: '破关如饮水', desc: '一世累计突破五十次。', check: 'stats.breakthroughs >= 50', tier: '地' },
  { id: 'a3_trib_5', name: '五度天雷', desc: '一世累计渡过五次天劫。', check: 'stats.tribulations >= 5', hidden: true },
  { id: 'a3_rep_5000', name: '五域共仰', desc: '声望达到五千。', check: 'reputation >= 5000', tier: '天', hidden: true },
  { id: 'a3_karma_1000', name: '功德无量', desc: '业力达到 +1000。', check: 'karma >= 1000', tier: '天', hidden: true },
  { id: 'a3_fast_huashen', name: '二百载化神', desc: '两百岁前踏入化神。', check: 'realm >= 4 && age < 200', tier: '天', hidden: true },

  // =========================================================================
  // v8 新增：轮回与大历史（B24 爽点：先知、改写、看见）
  // =========================================================================
  // —— 先知：前世所记，今日应验 ——
  { id: 'a4_foretold_1', name: '前世所记', desc: '前世手札里记过的大事，在这一世应验。', check: 'count("foretold") >= 1' },
  { id: 'a4_foretold_10', name: '今日应验', desc: '一世之中，前世所记应验十次。', check: 'count("foretold") >= 10', tier: '地' },
  { id: 'a4_foretold_50', name: '先知', desc: '一世之中，前世所记应验五十次。', check: 'count("foretold") >= 50', tier: '天', karmaReward: 3 },
  // —— 改写 ——
  { id: 'a4_rewrite_1', name: '历史已改写', desc: '第一次让一件大事走上另一条路。', check: 'count("history_rewrites") >= 1' },
  { id: 'a4_rewrite_5', name: '五事改观', desc: '一世改写五件大事。', check: 'count("history_rewrites") >= 5', tier: '地' },
  { id: 'a4_rewrite_20', name: '天下易辙', desc: '一世改写二十件大事。', check: 'count("history_rewrites") >= 20', tier: '天', karmaReward: 3 },
  { id: 'a4_rewrite_century', name: '百年之内', desc: '第一个百年未过，已改写五件大事。', check: 'count("history_rewrites") >= 5 && year() <= 100', tier: '天', karmaReward: 2 },
  { id: 'a4_flood', name: '临河不没', desc: '挡住了前世淹没临河的那场大水。', check: 'outcome("y018.nanze_baseline_flood") == "changed"', tier: '地', karmaReward: 2 },
  { id: 'a4_linzhao', name: '雁门援至', desc: '让前世死在增援路上的林照活着进了雁门。', check: 'outcome("y012.beijing_lin_zhao_reinforcement") == "changed"', tier: '地', karmaReward: 2 },
  { id: 'a4_mortal_rewrite', name: '凡身改史', desc: '尚未引气入体，就改写了一件大事。', check: 'realm == 0 && layer == 0 && count("history_rewrites") >= 1', hidden: true, karmaReward: 2 },
  // —— 手札 ——
  { id: 'a4_handbook_10', name: '手札十事', desc: '前世手札记下十件大事。', check: 'count("handbook_size") >= 10' },
  { id: 'a4_handbook_50', name: '手札五十事', desc: '前世手札记下五十件大事。', check: 'count("handbook_size") >= 50', tier: '地' },
  { id: 'a4_handbook_200', name: '手札满卷', desc: '前世手札记下二百件大事。', check: 'count("handbook_size") >= 200', tier: '天', karmaReward: 3 },
  // —— 看见：活到哪一年 ——
  { id: 'a4_year_101', name: '百年之后', desc: '活到第一纪元第 101 年。', check: 'year() >= 101' },
  { id: 'a4_year_401', name: '宁祚之末', desc: '活到第 401 年，宁朝宗室绝嗣的那一百年。', check: 'year() >= 401' },
  { id: 'a4_year_1001', name: '千年会盟', desc: '活到第 1001 年。', check: 'year() >= 1001', tier: '地' },
  { id: 'a4_year_2901', name: '琳宫落世', desc: '活到第 2901 年，灵气鼎盛之世。', check: 'year() >= 2901', tier: '天' },
  { id: 'a4_year_4501', name: '机巧之世', desc: '活到第 4501 年，凡人自造机巧的年代。', check: 'year() >= 4501', tier: '天', karmaReward: 3 },
  { id: 'a4_year_8001', name: '灵潮复起', desc: '熬过末法，活到第 8001 年。', check: 'year() >= 8001', tier: '仙', karmaReward: 4 },
  { id: 'a4_year_10000', name: '万载玄极', desc: '活到第一纪元第 10000 年。', check: 'year() >= 10000', tier: '仙', karmaReward: 5 },
  { id: 'a4_maxyear_1000', name: '前世最远', desc: '历世之中，有一世活过了第一千年。', check: 'meta.maxYear >= 1000' },
  { id: 'a4_xian_jiqiao', name: '真仙入世', desc: '以真仙之身走进机巧之世。', check: 'realm >= 9 && year() >= 4501', tier: '仙', hidden: true, karmaReward: 3 },
  { id: 'a4_mofa_break', name: '末法修成', desc: '在灵气枯竭的末法年代，仍修成一层。', check: 'count("mofa_breakthroughs") >= 1', tier: '天', hidden: true, karmaReward: 3 },
  // —— 越阶与一招 ——
  { id: 'a4_yuejie_1', name: '越阶斩杀', desc: '第一次斩杀境界高于你的对手。', check: 'count("yuejie_kills") >= 1' },
  { id: 'a4_yuejie_10', name: '以下克上', desc: '一世越阶斩杀十次。', check: 'count("yuejie_kills") >= 10', tier: '地' },
  { id: 'a4_yuejie_50', name: '逆伐', desc: '一世越阶斩杀五十次。', check: 'count("yuejie_kills") >= 50', tier: '天', karmaReward: 2 },
  { id: 'a4_onehit_1', name: '一招毙敌', desc: '第一次一招斩落对手。', check: 'count("one_hit_kills") >= 1' },
  { id: 'a4_onehit_10', name: '出手即止', desc: '一世一招毙敌十次。', check: 'count("one_hit_kills") >= 10' },
  { id: 'a4_onehit_100', name: '一招定生死', desc: '一世一招毙敌一百次。', check: 'count("one_hit_kills") >= 100', tier: '天', karmaReward: 2 },
  // —— 宿敌 ——
  { id: 'a4_nemesis_yuejie', name: '越阶胜宿敌', desc: '越阶击败宿敌。', check: 'flag("宿敌_越阶") || flag("宿敌_越阶二")' },
  { id: 'a4_nemesis_win5', name: '五胜宿敌', desc: '一世之中五次胜过宿敌。', check: 'count("宿敌胜") >= 5', tier: '地' },
  { id: 'a4_nemesis_spare', name: '恕', desc: '终局一战后放过了宿敌。', check: 'flag("宿敌_恕")', hidden: true },
  { id: 'a4_nemesis_slay', name: '了断', desc: '终局一战后斩了宿敌。', check: 'flag("宿敌_斩")', hidden: true },
  // —— 劫数 ——
  { id: 'a4_jieshu_1', name: '入劫', desc: '在一重以上劫数下开始一世。', check: 'char.jieshu >= 1' },
  { id: 'a4_jieshu_4', name: '四重劫', desc: '在四重以上劫数下开始一世。', check: 'char.jieshu >= 4', tier: '地' },
  { id: 'a4_jieshu_8', name: '八重劫', desc: '在八重以上劫数下开始一世。', check: 'char.jieshu >= 8', tier: '天' },
  { id: 'a4_jieshu_12', name: '十二重劫', desc: '在十二重劫数下开始一世。', check: 'char.jieshu >= 12', tier: '天', karmaReward: 2 },
  { id: 'a4_jieshu_12_1000', name: '逆天改命', desc: '十二重劫数之下，活过第一千年。', check: 'char.jieshu >= 12 && year() >= 1000', tier: '仙', hidden: true, karmaReward: 5 },
  // —— 兵解 ——
  { id: 'a4_bingjie', name: '兵解入轮回', desc: '第一次自择时辰，了结一世。', check: 'flag("bingjie")' },
  { id: 'a4_bingjie_xian', name: '真仙兵解', desc: '以真仙之身兵解入轮回。', check: 'flag("bingjie") && realm >= 9', tier: '仙', hidden: true },
  { id: 'a4_bingjie_early', name: '百年未满', desc: '第一个百年未过便兵解重来。', check: 'flag("bingjie") && year() <= 100', hidden: true },
  // —— 前世遗泽 ——
  { id: 'a4_legacy_1', name: '前世遗泽', desc: '带着前世留下的东西开始一世。', check: 'legacyNotes.length >= 1' },
  { id: 'a4_legacy_3', name: '三样遗泽', desc: '带着前世留下的三样东西开始一世。', check: 'legacyNotes.length >= 3', tier: '地' },
  // —— 其他 ——
  { id: 'a4_regions_all', name: '走遍五域', desc: '一世之中踏足全部八处地区。', check: 'char.visitedLocations.length >= 8', tier: '地' },
  { id: 'a4_demon_50', name: '斩妖五十', desc: '一世斩杀五十头妖邪。', check: 'counter("demons_slain") >= 50' },
  { id: 'a4_disciple_30', name: '门徒三十', desc: '门下弟子三十人（化神以上方可收这么多）。', check: 'counters.disciples >= 30', tier: '地' },
  { id: 'a4_secret_10', name: '秘境十处', desc: '同一世通关十处不同的秘境。', check: 'char.secretsCleared.length >= 10', tier: '天' },
].map((a) => ({
  ...a,
  ...(a.karmaReward != null
    ? {}
    : a.tier === '仙'
      ? { karmaReward: 2 }
      : (a.tier === '天' || a.hidden)
        ? { karmaReward: 1 }
        : {}),
}));

export const ACHIEVEMENT_BY_ID = Object.fromEntries(ACHIEVEMENTS.map((a) => [a.id, a]));

/*
 * 需要引擎写入的计数（条件里已引用，现在恒为 0，不会报错）：
 * - counters.foretold：beginHistoryEvent 返回「前世所记，今日应验」时 +1。
 * - counters.handbook_size：checkAchievements 里同步 Object.keys(meta.handbook).length。
 * - counters.mofa_breakthroughs：突破（小层或大境）成功时，若 lingqiAt(当年) <= 10 则 +1。
 */
