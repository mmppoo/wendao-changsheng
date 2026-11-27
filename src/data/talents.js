/** 轮回天赋：用轮回点永久解锁，此后每一世都生效。 */
export const TALENTS = [
  {
    id: 't_suhui', name: '宿慧', cost: 2,
    desc: '前世读过的书，今生还记得大半。悟性 +10。',
    apply: { attrs: { 悟性: 10 } },
  },
  {
    id: 't_daozhong', name: '道种', cost: 1,
    desc: '心里埋着一颗种子，遇水就活。道心 +12。',
    apply: { attrs: { 道心: 12 } },
  },
  {
    id: 't_tongpi', name: '铜皮', cost: 1,
    desc: '上一世挨的打，长成了骨头。根骨 +10。',
    apply: { attrs: { 根骨: 10 } },
  },
  {
    id: 't_lingjue', name: '灵觉', cost: 1,
    desc: '闭着眼也能看见三尺外的东西。神识 +10。',
    apply: { attrs: { 神识: 10 } },
  },
  {
    id: 't_fuyuan', name: '福缘', cost: 1,
    desc: '天塌下来先砸别人，机缘却总往怀里钻。气运 +18，奇遇稀有度大幅提升。',
    apply: { attrs: { 气运: 18 } },
  },
  {
    id: 't_pinang', name: '皮囊', cost: 1,
    desc: '这张脸走到哪里都有人愿意让利三分。魅力 +15，坊市额外折扣 8%，道友好感增速 +25%。',
    apply: { attrs: { 魅力: 15 }, buffs: { npcAffinity: 0.25, shopDiscount: 0.08 } },
  },
  {
    id: 't_qianshi', name: '前世余财', cost: 1,
    desc: '前世埋下的秘藏只有你知道。开局灵石 +2000、引气丹 ×2，每次突破大境额外获得前世秘藏灵石。',
    apply: { stones: 2000, items: ['yinqi_dan', 'yinqi_dan'], flag: { 前世秘藏: true } },
  },
  {
    id: 't_jianxin', name: '剑心', cost: 3,
    desc: '你记得一柄剑的样子，虽然还没见过它。习得《无剑诀》并携青锋剑。',
    apply: {
      techniques: [{ id: 'wujian_jue', name: '《无剑诀》', atk: 0.22, speed: 0.08, align: '正', artName: '无剑心斩' }],
      items: ['qingfeng_jian'],
    },
  },
  {
    id: 't_danhuo', name: '丹火', cost: 2,
    desc: '掌心有一簇不灭的火，是上一世炉子里的。习得《长春功》且炼丹成丹率 +10%。',
    apply: {
      techniques: [{ id: 'changchun_gong', name: '《长春功》', lifespan: 40, speed: 0.08, align: '正', artName: '长春生机火' }],
      buffs: { alchemyBonus: 0.1 },
    },
  },
  {
    id: 't_niming', name: '逆命', cost: 3,
    desc: '你死过一次，知道天道在哪里下手。突破成功率 +6%。',
    apply: { buffs: { breakBonus: 6 } },
  },
  {
    id: 't_changsheng', name: '长生种', cost: 2,
    desc: '你的身体记得怎样活得更久。寿元 +60 年。',
    apply: { lifespan: 60 },
  },
  {
    id: 't_tianwai', name: '天外残卷', cost: 3,
    desc: '一段不属于这个世界的口诀，念起来极顺。修炼速度 +12%，开局习得《天外吐纳篇》。',
    apply: {
      buffs: { speed: 0.12 },
      techniques: [{ id: 'tianwai_canjuan', name: '《天外吐纳篇》', speed: 0, atk: 0.06, def: 0.06, lifespan: 10, align: '中', artName: '天外星引掌' }],
    },
  },
];

export const TALENT_BY_ID = Object.fromEntries(TALENTS.map((t) => [t.id, t]));
