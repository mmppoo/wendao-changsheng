/**
 * 九州舆图（v5.0）：八大梯度灵域，从炼气新手村直至渡劫九霄天门。
 * theme 对应像素画布场景主题：village / market / wild / sect / tribulation / ascend。
 * 所有 enemies / marketItems / exploreRewards 均严格对应 enemies.js 与 items.js。
 */
export const REGIONS = [
  {
    id: 'qingniu',
    name: '青牛山脉',
    minRealm: 0,
    danger: 1,
    theme: 'village',
    desc: '群山蜿蜒，灵气稀薄却少见大妖。青牛村与诸多凡人村落散落山麓，是无数修士仙途启程之地。',
    specialty: '灵草采集 · 凡俗奇遇 · 炼气历练',
    enemies: ['wolf', 'wild_boar', 'mire_toad', 'bone_crow', 'bandit', 'rogue'],
    secretRealms: ['wn_pet_egg_1', 'ink_rain_pavilion'],
    marketItems: [
      'yinqi_dan', 'peiyuan_dan', 'liaoshang_dan', 'huiling_dan', 'jiexin_dan',
      'shenxing_fu', 'jingang_fu', 'tie_jian', 'qingmu_jia', 'lingcao', 'chiyang_shi',
    ],
    exploreRewards: [
      'lingcao', 'chiyang_shi', 'yinqi_dan', 'peiyuan_dan', 'liaoshang_dan',
      'jingang_fu', 'xuantie', 'yujian_yangshen',
    ],
  },
  {
    id: 'luoxia',
    name: '落霞仙城',
    minRealm: 0,
    danger: 1,
    theme: 'market',
    desc: '青州第一散修坊市，万宝阁分号与各大宗门驻点林立。城中禁私斗，城外十里却常有劫修潜伏。',
    specialty: '坊市淘珍 · 拍卖盛会 · 宗门招徒',
    enemies: ['bandit', 'herb_thief', 'rogue', 'creek_spirit', 'cultivator'],
    secretRealms: ['wn_stall_leak_1', 'ink_su_1', 'ink_star_observatory'],
    marketItems: [
      'yinqi_dan', 'peiyuan_dan', 'ningqi_dan', 'huiling_dan', 'liaoshang_dan',
      'zhuji_dan', 'qingxin_dan', 'huxin_fu', 'shenxing_fu', 'zhangxin_leifu',
      'qingfeng_jian', 'biling_jie', 'hanbing_jian', 'yujian_qingfeng',
    ],
    exploreRewards: [
      'yinqi_dan', 'ningqi_dan', 'huiling_dan', 'qingxin_dan',
      'xuantie', 'jianqi_fu', 'biling_jie', 'yujian_qingfeng',
    ],
  },
  {
    id: 'yaosen',
    name: '苍茫妖森',
    minRealm: 1,
    danger: 2,
    theme: 'wild',
    desc: '古木遮天蔽日，毒瘴常年不散。筑基妖兽与古修遗迹隐于林海深处，是外门弟子试炼的血色禁地。',
    specialty: '千年灵药 · 筑基妖丹 · 血色禁地',
    enemies: ['ghost', 'spirit_ape', 'beast', 'poison_python', 'blood_bat', 'stone_golem', 'blade_rogue', 'cultivator'],
    secretRealms: ['wn_blood_trial_1', 'ink_jianzhong_1'],
    marketItems: [
      'liaoshang_dan', 'bixue_dan', 'huiling_dan', 'juling_dan', 'zhuji_dan',
      'qingxin_dan', 'zhuyan_dan', 'qiannian_lingcao', 'yaoshou_neidan', 'biling_yu',
      'huxin_fu', 'poxie_fu', 'xuanwu_dun', 'qingming_jing', 'yujian_benlei',
    ],
    exploreRewards: [
      'lingcao', 'qiannian_lingcao', 'yaoshou_neidan', 'biling_yu',
      'juling_dan', 'bixue_dan', 'xuantie', 'leimu', 'yujian_benlei',
    ],
  },
  {
    id: 'guixu',
    name: '东海归墟',
    minRealm: 2,
    danger: 3,
    theme: 'wild',
    desc: '万水所归的无尽海眼，海底沉眠着上古龙宫与失落洞府。潮汐起落间，常有星辰砂与雷击木浮现。',
    specialty: '海眼秘境 · 炼器星砂 · 金丹机缘',
    enemies: ['sea_yaksha', 'coral_demon', 'ancient_puppet', 'thunder_roc', 'corpse_general', 'blood_cult', 'sword_rogue', 'jindan_elder'],
    secretRealms: ['ink_guixu_1', 'wn_dao_heart_1'],
    marketItems: [
      'dahuan_dan', 'juling_dan', 'jiejin_dan', 'pozhang_dan', 'qingxin_dan',
      'bingxin_dan', 'yangshen_dan', 'leimu', 'xingchen_sha', 'guixu_shanhu',
      'bihai_xuanbing', 'juling_zhenfu', 'suodi_fu', 'zixiao_ling', 'canghai_zhu', 'yujian_xuanbing',
    ],
    exploreRewards: [
      'qiannian_lingcao', 'leimu', 'xingchen_sha', 'guixu_shanhu', 'bihai_xuanbing',
      'jiejin_dan', 'dahuan_dan', 'juling_zhenfu', 'yujian_bagua',
    ],
  },
  {
    id: 'beihuang',
    name: '北荒魔域',
    minRealm: 3,
    danger: 4,
    theme: 'tribulation',
    desc: '赤地千里，血月悬空。血魔宗与幽冥鬼道盘踞其间，煞气冲霄，唯元婴老祖方敢深入腹地。',
    specialty: '魔渊淬炼 · 龙血真精 · 元婴争锋',
    enemies: ['demon_general', 'ghost_king', 'abyss_leviathan', 'blood_elder', 'bone_dragon', 'soul_reaper', 'iron_titan', 'crimson_sword'],
    secretRealms: ['wn_blood_trial_1', 'ink_jianzhong_1'],
    marketItems: [
      'dahuan_dan', 'huaying_dan', 'ningying_dan', 'yuanying_dan', 'pozhang_dan',
      'xisui_dan', 'duangu_dan', 'yanshou_dan', 'longxue_jing', 'jiuyou_mingjing',
      'xuesha_jing', 'wanhun_fan', 'jinwu_yi', 'taixu_jian', 'yujian_xuesha',
    ],
    exploreRewards: [
      'xingchen_sha', 'longxue_jing', 'jiuyou_mingjing', 'xuesha_jing',
      'huaying_dan', 'ningying_dan', 'yuanying_dan', 'dahuan_dan', 'yujian_xingchen',
    ],
  },
  {
    id: 'zhongzhou',
    name: '中州圣域',
    minRealm: 4,
    danger: 5,
    theme: 'sect',
    desc: '九州灵脉汇聚之巅，太玄剑宗与万象书院主峰所在。化神大能论道观星，偶有上界巡查使降临。',
    specialty: '大道论剑 · 法则残片 · 上界风闻',
    enemies: [
      'demon_king', 'sword_phantom', 'star_golem', 'venom_wyrm', 'blood_fiend_king',
      'void_stalker', 'thunder_sovereign', 'void_fiend', 'heaven_envoy', 'abyss_kraken',
      'blade_saint_shade', 'nether_marshal', 'mirror_demon',
    ],
    secretRealms: ['wn_upper_envoy_1', 'ink_star_observatory', 'ink_arena_1'],
    marketItems: [
      'dahuan_dan', 'huashen_dan', 'yuanying_dan', 'jianyi_dan', 'leiyuan_dan',
      'xinghui_dan', 'lianxu_dan', 'xukong_jing', 'faze_canpian', 'qilin_jiao',
      'fenghuang_yu', 'jiuzhuan_dan', 'jiuxiao_leifu', 'bagua_xuanjia', 'xinghe_shan',
      'donghuang_zhong', 'qiankun_jie', 'yujian_xukong', 'yujian_yinguo',
    ],
    exploreRewards: [
      'faze_canpian', 'xukong_jing', 'huashen_dan', 'lianxu_dan',
      'longxue_jing', 'qilin_jiao', 'fenghuang_yu', 'jianyi_dan', 'xinghui_dan',
    ],
  },
  {
    id: 'kunlun',
    name: '昆仑墟界',
    minRealm: 6,
    danger: 6,
    theme: 'tribulation',
    desc: '上古仙战崩裂的残破小界，时间与空间在此错乱。合体与大乘老怪争相探寻太古悟道果与仙尸秘藏。',
    specialty: '太古悟道 · 混沌凶兽 · 仙遗秘藏',
    enemies: [
      'old_monster', 'chaos_beast', 'kunlun_guardian', 'crimson_asura', 'star_devourer',
      'frost_empress', 'ancient_corpse', 'immortal_sword_remnant', 'void_emperor',
      'blood_ocean_lord', 'golden_dragon_king', 'yin_yang_elder',
    ],
    secretRealms: ['ink_kunlun_1', 'ink_guixu_1'],
    marketItems: [
      'dao_fruit', 'heti_dan', 'dacheng_dan', 'guangyin_lu', 'xukong_jing',
      'faze_canpian', 'kunlun_shenmu', 'hundun_muqi', 'tiandao_lotus', 'jiuzhuan_dan',
      'xianling_dan', 'kunlun_jing', 'zhuxian_canjian', 'xuantian_baojia', 'yujian_hundun',
    ],
    exploreRewards: [
      'faze_canpian', 'dao_fruit', 'xukong_jing', 'kunlun_shenmu',
      'hundun_muqi', 'heti_dan', 'xianling_dan', 'guangyin_lu',
    ],
  },
  {
    id: 'jiuxiao',
    name: '九霄天门',
    minRealm: 8,
    danger: 7,
    theme: 'ascend',
    desc: '云海尽头，罡风如刀，紫霄神雷永昼不息。推开此门者，脱凡成仙；止步于此者，化作万古劫灰。',
    specialty: '九重天劫 · 天道仙莲 · 飞升成仙',
    enemies: [
      'ancient_corpse', 'sky_arbiter', 'thunder_tribulation_avatar', 'fallen_immortal',
      'chaos_leviathan', 'karmic_demon_lord', 'celestial_warden', 'primordial_sword_immortal',
      'abyssal_immortal_demon',
    ],
    secretRealms: ['ink_kunlun_1', 'wn_upper_envoy_1'],
    marketItems: [
      'tianjie_dan', 'dujie_shengdan', 'tiandao_lotus', 'xianling_dan', 'changsheng_guo',
      'hundun_lingye', 'dao_fruit', 'jiuzhuan_dan', 'jiuxiao_leijie', 'taiyi_hudaofu',
      'hundun_zhong', 'taichu_xianjian',
    ],
    exploreRewards: [
      'tiandao_lotus', 'xianling_dan', 'tianjie_dan', 'dujie_shengdan',
      'jiuxiao_leijie', 'hundun_lingye', 'changsheng_guo', 'faze_canpian',
    ],
  },
];

export const REGION_BY_ID = Object.fromEntries(REGIONS.map((r) => [r.id, r]));
