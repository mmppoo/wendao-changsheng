/** 轮回天赋：用轮回点永久解锁，此后每一世都生效。 */
export const TALENTS = [
  {
    id: 't_suhui', name: '宿慧', cost: 1,
    desc: '前世读过的书，今生还记得一点。悟性 +8。',
    apply: { attrs: { 悟性: 8 } },
  },
  {
    id: 't_daozhong', name: '道种', cost: 1,
    desc: '心里埋着一颗种子，遇水就活。道心 +10。',
    apply: { attrs: { 道心: 10 } },
  },
  {
    id: 't_tongpi', name: '铜皮', cost: 1,
    desc: '上一世挨的打，长成了骨头。根骨 +8。',
    apply: { attrs: { 根骨: 8 } },
  },
  {
    id: 't_lingjue', name: '灵觉', cost: 1,
    desc: '闭着眼也能看见三尺外的东西。神识 +8。',
    apply: { attrs: { 神识: 8 } },
  },
  {
    id: 't_fuyuan', name: '福缘', cost: 2,
    desc: '天塌下来先砸别人。气运 +10。',
    apply: { attrs: { 气运: 10 } },
  },
  {
    id: 't_pinang', name: '皮囊', cost: 1,
    desc: '这张脸，走到哪里都有人愿意多听一句。魅力 +8。',
    apply: { attrs: { 魅力: 8 } },
  },
  {
    id: 't_qianshi', name: '前世余财', cost: 2,
    desc: '死的时候没花完，藏在只有你知道的地方。开局 500 灵石、三枚引气丹。',
    apply: { stones: 500, items: ['yinqi_dan', 'yinqi_dan', 'yinqi_dan'] },
  },
  {
    id: 't_jianxin', name: '剑心', cost: 3,
    desc: '你记得一柄剑的样子，虽然还没见过它。习得《无剑诀》。',
    apply: { techniques: [{ id: 'wujian_jue', name: '《无剑诀》', atk: 0.3, speed: 0.1 }], items: ['qingfeng_jian'] },
  },
  {
    id: 't_danhuo', name: '丹火', cost: 2,
    desc: '掌心有一簇不灭的火，是上一世炉子里的。习得《长春功》。',
    apply: { techniques: [{ id: 'changchun_gong', name: '《长春功》', lifespan: 40, speed: 0.08 }] },
  },
  {
    id: 't_niming', name: '逆命', cost: 3,
    desc: '你死过一次，知道天道在哪里下手。突破成功率 +5%。',
    apply: { buffs: { breakBonus: 5 } },
  },
  {
    id: 't_changsheng', name: '长生种', cost: 2,
    desc: '你的身体记得怎样活得更久。寿元 +50 年。',
    apply: { lifespan: 50 },
  },
  {
    id: 't_tianwai', name: '天外残卷', cost: 3,
    desc: '一段不属于这个世界的口诀，念起来很顺。修炼速度 +15%。',
    apply: { buffs: { speed: 0.15 } },
  },
];

export const TALENT_BY_ID = Object.fromEntries(TALENTS.map((t) => [t.id, t]));
