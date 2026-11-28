/**
 * 选项提示只说「要付出什么、考验什么、是什么做法」，不说「会得到什么」。
 * 结果留给玩家自己选了之后看。这里统一把旧文案里剧透收获的半句去掉。
 */
const GAIN = /(胜则|败则|成则|涨|增|获|(^|[胜稳可或必斩便])得(?!罪)|习得|赏|大进|小进|双进|齐进|双收|大成|飞升|骤消|尽消|进账|暴富|传承|谢礼|垂青|登峰|登极|延寿|功德|大功|收益|开启.{0,8}线|主线|清零|大减|小悟|大悟|情谊|好感|成算|赠礼|赠物|零风险|社死|榨干|必得|打脸|流正统|稳收|丰厚|震动|扬威|收获|福缘|提升|加成|翻倍|大补|入账|结善缘|善缘$|反馈)/;
const LOOT_TAIL = /(与|和|及).{0,8}(丹|宝|石|符|材|木|果|卷|典|诀|剑)$/;
const COST = /(检定|≥|花费|消耗|耗|需)/;

function cleanPart(seg) {
  if (COST.test(seg)) {
    const m = seg.slice(1).search(/(获|，?得|换取|则)/);
    if (m >= 0) seg = seg.slice(0, m + 1).replace(/[，,]$/, '');
    return seg;
  }
  if (GAIN.test(seg) || LOOT_TAIL.test(seg)) return '';
  return seg;
}

export function cleanHint(hint) {
  if (typeof hint !== 'string' || !hint) return hint;
  // 主动挑选类（灵兽、功法明码标价）和带括号说明规则的提示原样保留
  if (/[：（+]/.test(hint)) return hint;
  return hint.split(/\s*·\s*/).map((seg) => {
    const subs = seg.split('，');
    if (subs.length > 1 && subs.some((x) => COST.test(x))) return subs.map(cleanPart).filter(Boolean).join('，');
    if (subs.length > 1) return subs.filter((x) => !GAIN.test(x) || /不|未|没/.test(x)).join('，') && (GAIN.test(seg) ? subs.filter((x) => !GAIN.test(x)).join('，') : seg);
    return cleanPart(seg);
  }).filter(Boolean).join(' · ').replace(/\s+，/g, '，');
}
