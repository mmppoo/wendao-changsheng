/** 境界体系：十境，每境分层。exp 为「进入下一层」所需的修为。 */
export const REALMS = [
  {
    id: 'lianqi', name: '炼气', layers: 9, exp: 120, growth: 1.18,
    lifespan: 120, monthly: 1, tribulation: false,
    layerNames: ['一层', '二层', '三层', '四层', '五层', '六层', '七层', '八层', '九层'],
    desc: '引气入体，打通经脉。凡人与修士的分野，就从这一口灵气开始。',
  },
  {
    id: 'zhuji', name: '筑基', layers: 4, exp: 1400, growth: 1.6,
    lifespan: 260, monthly: 10, tribulation: false,
    layerNames: ['初期', '中期', '后期', '圆满'],
    desc: '筑就道基，寿元大增。道基的品质，会在此后每一次天劫里回响。',
  },
  {
    id: 'jindan', name: '金丹', layers: 4, exp: 7200, growth: 1.7,
    lifespan: 520, monthly: 55, tribulation: true,
    layerNames: ['初期', '中期', '后期', '圆满'],
    desc: '一粒金丹吞入腹，我命由我不由天。丹成之日，雷劫必至。',
  },
  {
    id: 'yuanying', name: '元婴', layers: 4, exp: 34000, growth: 1.7,
    lifespan: 1000, monthly: 240, tribulation: true,
    layerNames: ['初期', '中期', '后期', '圆满'],
    desc: '元婴出窍，神魂可离体千里。此境的修士，已是一方老祖。',
  },
  {
    id: 'huashen', name: '化神', layers: 4, exp: 160000, growth: 1.75,
    lifespan: 2000, monthly: 1000, tribulation: true,
    layerNames: ['初期', '中期', '后期', '圆满'],
    desc: '化神者，化凡神为仙神。一念之间，山河变色。',
  },
  {
    id: 'lianxu', name: '炼虚', layers: 4, exp: 720000, growth: 1.8,
    lifespan: 4000, monthly: 4000, tribulation: true,
    layerNames: ['初期', '中期', '后期', '圆满'],
    desc: '炼虚合道，虚实之间再无界限。举手投足，皆合天道。',
  },
  {
    id: 'heti', name: '合体', layers: 4, exp: 3200000, growth: 1.8,
    lifespan: 8000, monthly: 16000, tribulation: true,
    layerNames: ['初期', '中期', '后期', '圆满'],
    desc: '法与身合，身与道合。此境修士，已难被杀死。',
  },
  {
    id: 'dacheng', name: '大乘', layers: 4, exp: 14000000, growth: 1.85,
    lifespan: 15000, monthly: 60000, tribulation: true,
    layerNames: ['初期', '中期', '后期', '圆满'],
    desc: '大乘之巅，只差一步飞升。可这一步，拦住了万古英杰。',
  },
  {
    id: 'dujie', name: '渡劫', layers: 3, exp: 60000000, growth: 2.0,
    lifespan: 30000, monthly: 200000, tribulation: true,
    layerNames: ['一劫', '二劫', '三劫'],
    desc: '九重天劫，一重一重地数。数完了，便是仙。',
  },
  {
    id: 'zhenxian', name: '真仙', layers: 1, exp: Infinity, growth: 1,
    lifespan: 999999, monthly: 1, tribulation: false,
    layerNames: ['仙'],
    desc: '飞升上界。此处之后，已非人间故事——但你可以继续走下去。',
  },
];

export const REALM_KEYS = REALMS.map((r) => r.id);

export function realmLabel(char) {
  const realm = REALMS[char.realm] || REALMS[0];
  if (realm.id === 'zhenxian') return '真仙';
  return `${realm.name}${realm.layerNames[Math.min(char.layer, realm.layerNames.length - 1)]}`;
}

export function expToNext(char) {
  const realm = REALMS[char.realm];
  if (!realm || !Number.isFinite(realm.exp)) return Infinity;
  return Math.round(realm.exp * Math.pow(realm.growth, char.layer));
}

export function totalExpCurve() {
  let total = 0;
  for (const realm of REALMS) {
    if (!Number.isFinite(realm.exp)) continue;
    for (let l = 0; l < realm.layers; l++) total += realm.exp * Math.pow(realm.growth, l);
  }
  return total;
}
