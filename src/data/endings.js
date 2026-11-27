/**
 * 结局（v8 · 宁朝五域）：一世终了时，在所有满足条件的结局里优先落入「尚未收录」的那一个，
 * 同为未收录时按 priority 从高到低（见 engine/meta.js chooseEnding）。
 * condition 为表达式；text 可以是字符串或 (state) => string。
 *
 * 此世不离尘世。境界到了真仙，人仍在五域，一个纪元一个纪元地活下去；
 * 一世只有两种了结：身死，或结丹以上自择「兵解入轮回」（flag("bingjie")）。
 * 无论哪一种，魂识都回到第一纪元第 1 年的青石镇河湾渡。
 *
 * 七篇：
 * 一、证道篇（真仙一世的了结，按道途区分）
 * 二、宗门与势力篇
 * 三、法则证果篇
 * 四、红尘羁绊篇
 * 五、五域行迹与奇遇篇
 * 六、陨落与无常篇
 * 七、轮回与大历史篇（v8 新增：改写历史、纪元、兵解、凡人营生、前世手札；另收宿敌线终局 NEMESIS_ENDINGS）
 *
 * 写条件的规矩：结局会在「任何死因」下被候选，凡是文本写了死法的，条件里必须带上死因
 * （hp <= 0、age >= lifespan、demon >= 100、flag("渡劫失败")、flag("bingjie")）；
 * 不限死因的结局，文本末尾用 endLine(s) 按真实死因补一句。
 */
import { ERA1_CHAPTERS } from './history/chronicle.js';
import { NEMESIS_ENDINGS } from './events/nemesis.js';

const START_AGE = 192;
const yearOf = (s) => Math.max(1, Math.floor(((s.char?.age ?? START_AGE) - START_AGE) / 12) + 1);
const chapterOf = (s) => {
  const y = yearOf(s);
  return ERA1_CHAPTERS.find((c) => y >= c.from && y <= c.to) || ERA1_CHAPTERS[ERA1_CHAPTERS.length - 1];
};
const era = (s) => (yearOf(s) > 10000 ? '第一纪元之后' : `「${chapterOf(s).name}」之世`);

function causeOf(s) {
  if (s.flags?.bingjie) return 'bingjie';
  if (s.flags?.['渡劫失败']) return 'trib';
  if ((s.char?.demon || 0) >= 100) return 'demon';
  if ((s.char?.hp ?? 1) <= 0) return 'killed';
  return 'old';
}

const CAUSE_LINE = {
  bingjie: (s) => `第${yearOf(s)}年，你挑了一个日子，散尽一身修为，兵解入轮回。`,
  trib: (s) => `第${yearOf(s)}年，天劫落下，你没有扛过去。`,
  demon: (s) => `第${yearOf(s)}年，心魔破关而出，你再没能把它压回去。`,
  killed: (s) => `第${yearOf(s)}年，你死在一场斗战里。`,
  old: (s) => `第${yearOf(s)}年，你的寿数走到了头。`,
};

/** 按真实死因补一句收尾。 */
const endLine = (s) => CAUSE_LINE[causeOf(s)](s);
/** 轮回回声：魂识回到第一年。 */
const BACK = '魂识沉下去。再睁眼时，耳边是第一年青石镇河湾渡的水声，何六正在解缆。';

const NPC_NAMES = ['宋宜', '顾淮', '徐娘', '沈砚', '韩彪', '阿衡', '石泉', '秦铸', '阿史那岚', '陆清', '林照', '清虚'];
const npcCount = (n) => `(${NPC_NAMES.map((x) => `(rel("${x}") >= ${n})`).join(' + ')})`;

const MORTAL = 'realm == 0 && layer == 0';

export const ENDINGS = [
  // =========================================================================
  // 一、证道篇：修到真仙，人还在五域；这一世终有了结
  // =========================================================================
  {
    id: 'e_chaos_ascend', name: '混沌证道', priority: 115, tier: '仙', hidden: true,
    condition: 'realm >= 9 && (root() == "hundun" || law("chaos") >= 5)',
    summary: '混沌一脉修成真仙，天地也认不出你是什么。',
    text: (s) => `渡劫那日，雷云在你头顶停了很久，最后散了。天道认不出你身上的东西，只好放你过去。

此后你在五域又走了许多年。灵气涨的时候你不显眼，灵气落的时候你也不枯，周身那一团说不清颜色的气，跟谁都不像。

${endLine(s)}

玄衡宗《天机阁藏本》后来添了一条批注：${era(s)}，有一人身负混沌，未入任何门户，来去无迹。`,
  },
  {
    id: 'e_ten_laws_ascend', name: '万法朝宗', priority: 114, tier: '仙', hidden: true,
    condition: 'realm >= 9 && maxLaw() >= 5 && (law("sword") + law("pill") + law("array") + law("thunder") + law("space") + law("time") + law("star") + law("karma") + law("blood") + law("chaos")) >= 12',
    summary: '十道法则在一人身上收拢，渡劫成了顺理成章的事。',
    text: (s) => `你成就真仙那年，五域各地都出了怪事：铜谷的炉火自己旺了三刻，玄衡群峰的护脉大阵亮了一夜，观星台的罗盘指针同时转向东岭。

你没有去看。十道法则在指间一道道合拢，最后只剩一盏不太亮的灯。

此后你提着那盏灯，在五域住了很多年，教过人，也躲过人。

${endLine(s)}`,
  },
  {
    id: 'e_body_saint_ascend', name: '肉身成圣', priority: 113, tier: '仙', hidden: true,
    condition: 'realm >= 9 && root() == "wulinggen"',
    summary: '无灵根，硬是用一副凡骨扛过了九重雷劫。',
    text: (s) => `十六岁那年，测灵的人看了你一眼，说回家种田吧。

你没有灵根，就熬筋骨；引不动灵气，就拿血肉去扛。第一道雷劈断了你两根肋骨，第九道雷落下来时，你的拳头已经比雷硬。

此后五域再测灵根，青石镇的老人总要补一句：当年有个凡骨，后来成了真仙。

${endLine(s)}`,
  },
  {
    id: 'e_perfect_foundation_ascend', name: '无瑕道体', priority: 112, tier: '仙',
    condition: 'realm >= 9 && char.daoBaseQuality == "tiandao" && char.goldenCoreQuality == "jiuwen"',
    summary: '天道筑基，九纹结丹，一路走来没有欠下一笔账。',
    text: (s) => `许多人修到渡劫，要把早年仓促破境留下的暗伤一并还给天劫。

你不用。天道筑基打下的底子，九纹结丹垂落的紫气，一层层托着你走过元婴、化神、大乘。九重雷劫洗过灵台，只洗掉一层灰。

你成了真仙，身上连一道旧疤都找不出来。

${endLine(s)}`,
  },
  {
    id: 'e_star_emperor_ascend', name: '观星证道', priority: 111, tier: '仙',
    condition: 'realm >= 9 && (root() == "xingchen" || law("star") >= 5)',
    summary: '周天星辰你一颗颗数过，渡劫选在了子夜。',
    text: (s) => `渡劫选在子夜，天上没有云。

雷落下来时散成了一场流星，一颗颗从你肩头擦过去。观星台宁京大观星台的值夜官那一夜搁了笔，因为星图上多了一颗从来没记过的星。

此后几百年，那颗星一直在。观星台的人不知道，它就在他们观星台下的茶摊上喝茶。

${endLine(s)}`,
  },
  {
    id: 'e_time_sovereign_ascend', name: '光阴证道', priority: 110, tier: '仙',
    condition: 'realm >= 9 && law("time") >= 5',
    summary: '你在一刹那里坐完千年，又在千年之后回看那一刹那。',
    text: (s) => `最后一道劫雷停在你眉心三寸。你把那一瞬拉长了一万年，借着雷光，把此生的路一段段看过去：青石镇的炊烟，临河的大水，雁门的雪。

看完，你松开手诀，雷光落下又退回云里。

后来你看着五域换了一个又一个百年。一个王朝没了，一条河改了道，人间造出了不用灵气也能跑的车。

${endLine(s)}`,
  },
  {
    id: 'e_artifact_ascend', name: '器道通玄', priority: 109, tier: '仙',
    condition: 'realm >= 9 && char.artifactLevel >= 5',
    summary: '一件本命法宝陪你温养了一生，最后替你吃下了八成劫火。',
    text: (s) => `「${s.char.artifactName || '无名青锋'}」本来是一块凡铁，被你拿灵石、砂料和心血一寸寸祭炼到今天。

天雷砸下来时，它横在你头顶，替你吞下八成劫火，器身裂出一道道纹路。劫云散尽，器成，人也成了真仙。

此后它跟着你走遍五域。铜谷炉坊的匠人见了它，总要停下手里的活看很久。

${endLine(s)}`,
  },
  {
    id: 'e_pure_mortal_ascend', name: '赤手证道', priority: 108, tier: '仙', hidden: true,
    condition: 'realm >= 9 && char.goldenFingerId == "gf_none"',
    summary: '无异宝，无残魂，没有半点天降的机缘。',
    text: (s) => `世人都说，能修到真仙的，身上必有古宝，背后必有高人。

你什么都没有。你靠的是一夜夜枯坐吐纳，是一次次在生死边上自己爬起来，跌倒一百回再试第一百零一回。

渡劫过后，你摊开两只空手看了一会儿，然后去青石镇市集买了一碗面。

${endLine(s)}`,
  },
  {
    id: 'e_karma_ascend', name: '功德证道', priority: 107, tier: '仙',
    condition: 'realm >= 9 && karma >= 500 && demon == 0',
    summary: '救下的人太多，天劫落到你头上时也轻些。',
    text: (s) => `你渡劫那天，青石祠庙的香火一夜没断。来烧香的人里，有你从大水里拉上来的，有吃过你粥的，有被你从黑风寨赎回来的。

九重雷劫落得很轻。你成了真仙，心里干干净净，一点魔念都没有。

此后你常在各处义仓、渡口出没。没人认得你，只是那几处地方，灾年总比别处少死人。

${endLine(s)}`,
  },
  {
    id: 'e_sword_ascend', name: '一剑长存', priority: 106, tier: '仙',
    condition: 'realm >= 9 && (sect() == "taixuan" || law("sword") >= 5)',
    summary: '剑意或阵纹，最后都收进了一柄剑里。',
    text: (s) => `${s.char.sectId === 'taixuan'
      ? '你是玄衡宗出来的人。玄衡宗以符阵立宗，你却把护脉大阵的阵纹一笔笔刻进了剑脊。渡劫那天，剑出鞘三寸，九重雷劫被它引进了群峰的地脉里。'
      : '你的剑道走到了尽头。渡劫那天，剑出鞘三寸，九重雷劫被剑气从中劈开，落在身后两侧的山上。'}

此后这柄剑一直在你身边。五域有好几处崖壁上留着同一道剑痕，后人刻碑记下，却说不清是哪一年留的。

${endLine(s)}`,
  },
  {
    id: 'e_dan_ascend', name: '丹道证道', priority: 105, tier: '仙',
    condition: 'realm >= 9 && count("alchemy") >= 100',
    summary: '炉火烧了一辈子，你把自己也炼成了一炉丹。',
    text: (s) => `你一生开炉上百次。渡劫那天，你把丹炉架在了身前，九重雷劫被炉火一道道吞进去，炉盖跳了九下。

开炉时满山药香。你成了真仙，炉里是一颗什么也不治的丹，你一口吞了。

此后青崖谷的药农说，药田最旺的那几年，常有个人在田埂上蹲着看苗。

${endLine(s)}`,
  },
  {
    id: 'e_lover_ascend', name: '双修长生', priority: 104, tier: '天',
    condition: 'realm >= 9 && flag("道侣") && rel("道侣") >= 35',
    summary: '劫雷落下时，有一只手按在你后背上。',
    text: (s) => `渡劫那天，道侣站在你身后，一只手按在你背上。第九道雷落下来，你们一起往前迈了一步。

成了真仙以后，日子反而过得慢。你们在五域换着地方住，有时在南泽看荷，有时在北境看雪。

${endLine(s)}

道侣替你收了骨灰。那一世余下的年月，一个人过的。`,
  },
  {
    id: 'e_ascend_demon', name: '魔念证道', priority: 103, tier: '仙', hidden: true,
    condition: 'realm >= 9 && demon >= 50',
    summary: '你带着半身魔念过了天劫，天道没能拦住你。',
    text: (s) => `雷劫落下时，你身上的魔念比雷更黑。天道拦了九次，九次都没拦住。

你成了真仙，心魔也跟着成了真仙。它住在你识海里，替你记着每一笔仇。

五域的修士后来提起你，多半压低声音。

${endLine(s)}`,
  },
  {
    id: 'e_ascend_refuse', name: '看山还是山', priority: 102, tier: '天', hidden: true,
    condition: 'realm >= 9 && flag("bingjie") && region() == "qingniu"',
    summary: '修到真仙，你回到青石镇河湾渡，亲手了结了这一世。',
    text: (s) => `成了真仙以后，你走过五域很多地方，最后还是回到了青石镇。

河湾渡的缆桩换过很多根了，渡船也不是何六那条。你在渡口坐了一个下午，看人上船、下船，看对岸的东田换了几茬庄稼。

第${yearOf(s)}年的一个傍晚，你在渡口散去了一身修为。

${BACK}

你看着他，他看着你，问了一句：过河？`,
  },
  {
    id: 'e_qingyun_ascend', name: '星台长明', priority: 101, tier: '仙',
    condition: 'realm >= 9 && sect() == "qingyun"',
    summary: '观星台出了一位真仙，大观星台的灯从此不灭。',
    text: (s) => `你在观星台从一个记天象的小吏做起，测过灵气，修过罗盘，推过大劫。

成了真仙以后，你没有离开宁京。大观星台顶上那盏灯，此后几百年都是你点的。观星台的典册里，每一任监正的名字都换过，只有夜值一栏的笔迹一直没变。

${endLine(s)}`,
  },
  {
    id: 'e_danxia_ascend', name: '药田千顷', priority: 101, tier: '仙',
    condition: 'realm >= 9 && sect() == "danxia"',
    summary: '青崖宗出了一位真仙，七十二涧的水一直是清的。',
    text: (s) => `青崖宗守的是下游清流。你在宗里种了一辈子药，守了一辈子水。

渡劫那天，七十二涧的水同时涨了一寸，又退回去。你成了真仙，此后青崖谷上游再有人凿山淘石，第二天总会发现凿子断在石缝里。

${endLine(s)}`,
  },
  {
    id: 'e_tianyin_ascend', name: '祠火不熄', priority: 101, tier: '仙',
    condition: 'realm >= 9 && sect() == "tianyin"',
    summary: '青石祠庙的一个守庙人，修成了真仙。',
    text: (s) => `你在青石祠庙守过香火，管过义仓，大水那年在祠里煮过三个月的粥。

成了真仙以后，你还是常回祠庙扫地。镇上的人换了一代又一代，只记得祠里有个扫地的，年纪看不出来。

${endLine(s)}`,
  },
  {
    id: 'e_wanxiang_ascend', name: '客卿不老', priority: 101, tier: '仙',
    condition: 'realm >= 9 && sect() == "wanxiang"',
    summary: '宁京客卿里出了一位真仙，户部的账册翻过了几百本。',
    text: (s) => `你替宁京内廷和户部办了一辈子差：清过实亩，押过军饷，在河洛门阀的庄园里吃过闭门羹。

成了真仙以后，宁朝没了，你还在宁京。后来的会盟、公局，案牍里时不时冒出一个署名，笔迹和几百年前户部旧档里的一模一样。

${endLine(s)}`,
  },
  {
    id: 'e_hanshan_ascend', name: '雁门不倒', priority: 101, tier: '仙',
    condition: 'realm >= 9 && sect() == "hanshan"',
    summary: '北境边军里出了一位真仙，雁门关此后再没破过。',
    text: (s) => `你在雁门关修过关符，押过粮车，在外堡里熬过断粮的冬天。

成了真仙以后，你仍旧常在关城上走。边军换了一代又一代统领，关墙上的冻缝每年开春都有人连夜补好，没人见过补墙的是谁。

${endLine(s)}`,
  },
  {
    id: 'e_wanbao_ascend', name: '会票通天', priority: 101, tier: '仙',
    condition: 'realm >= 9 && sect() == "wanbao"',
    summary: '通远商会里出了一位真仙，商路一走就是几千年。',
    text: (s) => `你在通远商会从押驼做起，算过井价，签过盟约，在沙州茶棚里跟耶律祁讨过过路钱。

成了真仙以后，你还在做买卖。商会推行会票的那一年，第一张票上的押记，是你亲手刻的。

${endLine(s)}`,
  },
  {
    id: 'e_wanshou_ascend', name: '朔川鹰影', priority: 101, tier: '仙',
    condition: 'realm >= 9 && sect() == "wanshou"',
    summary: '朔部里出了一位真仙，草滩上的鹰一代代都认得你。',
    text: (s) => `你跟着朔部在草滩上转场，驯过马，放过鹰，跟阿史那岚一起截过粮道，也放过粮车。

成了真仙以后，你仍在朔川。牧民说，冬天最冷的那几夜，总有一只白鹰落在走失的羊群前头。

${endLine(s)}`,
  },
  {
    id: 'e_jiguan_ascend', name: '炉火传世', priority: 101, tier: '仙',
    condition: 'realm >= 9 && sect() == "jiguan"',
    summary: '东岭炉坊里出了一位真仙，后来的机巧都从这炉火里来。',
    text: (s) => `你在铜谷秦铸的炉坊里拉过风箱，改过农具，接过军令。

成了真仙以后，你看着炉坊变成金石行会，看着行会造出水力的锻锤、火轮的车。每一代匠人开炉前都要拜一拜炉神，没人知道炉神就坐在门口抽旱烟。

${endLine(s)}`,
  },
  {
    id: 'e_xuemo_ascend', name: '赤霞余烬', priority: 101, tier: '仙',
    condition: 'realm >= 9 && sect() == "xuemo"',
    summary: '赤霞旧府掠灵之法，在你身上修到了头。',
    text: (s) => `赤霞旧府当年为了地心磁砂，把千里沃土烧成了流沙。你从废墟里捡起了那门掠灵之法。

渡劫时，你吸干了方圆百里的灵气，白驼的沙海又往外推了十里。

你成了真仙。玄衡宗的戒条里，多了你的名字。

${endLine(s)}`,
  },
  {
    id: 'e_hehuan_ascend', name: '井主万年', priority: 101, tier: '仙',
    condition: 'realm >= 9 && sect() == "hehuan"',
    summary: '沙道上出了一位真仙，十三大井的水由你说了算。',
    text: (s) => `你跟着耶律祁在流沙里控井收钱，也跟玉门守军打过几场。

成了真仙以后，沙道的规矩换过很多次，招安过，又反过。只有一条没变：过客每驼纳水资，钱最后去了哪里，没人敢问。

${endLine(s)}`,
  },
  {
    id: 'e_youming_ascend', name: '旧闸长夜', priority: 101, tier: '仙',
    condition: 'realm >= 9 && sect() == "youming"',
    summary: '芦洲旧河闸上的水寇，修成了真仙。',
    text: (s) => `你在黑风寨跟着韩彪据闸收钱，夜里在芦荡里撑船，见过官军围剿，也见过大水把旧闸冲开。

成了真仙以后，黑风寨早没了，旧河闸也废了。芦洲的船家夜里过闸，还会往水里丢一枚铜钱。

${endLine(s)}`,
  },
  {
    id: 'e_sanxiu_ascend', name: '独行真仙', priority: 101, tier: '仙',
    condition: 'realm >= 9 && sect() == "sanxiu"',
    summary: '不入任何门户，一个人修到了真仙。',
    text: (s) => `你没有拜过山门，也没有领过谁的差事。引气诀残篇是在旧书摊上买的，第一颗辟谷丹是拿三天的工钱换的。

成了真仙以后，你仍旧一个人走。五域的散修之间流传一个说法：路上要是遇见一个话少、出手大方的行客，别问他名字。

${endLine(s)}`,
  },
  {
    id: 'e_ascend', name: '真仙在世', priority: 100, tier: '仙',
    condition: 'realm >= 9',
    summary: '渡过天劫，成就真仙。人还在这片天地里。',
    text: (s) => `九重天劫过去，雷云散了。没有接引，也无处可去，你还站在原地，脚下是五域的土。

你成了真仙，寿元长得数不清。此后你看着一个个百年过去，看着熟人一个个老去，看着青石镇从棚屋长成城。

${endLine(s)}

${BACK}`,
  },

  // =========================================================================
  // 二、宗门与势力篇
  // =========================================================================
  {
    id: 'e_demon_lord', name: '血海尸山', priority: 95, tier: '天',
    condition: 'realm >= 7 && karma <= -500',
    summary: '你踩着无数人的命，走到了大乘。',
    text: (s) => `你杀过的人，能把临河粮码头填满。五域的父母拿你的名字吓唬孩子。

你修到了大乘，身后跟着一大群想杀你的人，没有一个追得上。

${endLine(s)}`,
  },
  {
    id: 'e_orthodox_demon_lord', name: '五域共尊', priority: 69, tier: '天', hidden: true,
    condition: 'realm >= 7 && reputation >= 1200 && abs(karma) <= 50',
    summary: '正道敬你，邪道也怕你，你两边都不站。',
    text: (s) => `玄衡宗请你主持过论道，黑风寨也托你调停过水路。官府和水寇都肯听你一句话。

你不行大善，也不作大恶。五域有事，双方都先派人来问你的意思。

${endLine(s)}`,
  },
  {
    id: 'e_taixuan_patriarch', name: '玄衡太上', priority: 68, tier: '天',
    condition: 'sect() == "taixuan" && char.sectRank >= 5 && realm >= 5',
    summary: '你坐上了玄衡宗太上长老的位子，护脉大阵由你执掌。',
    text: (s) => `你在玄衡宗坐到了太上长老。护脉大阵的阵眼钥匙挂在你腰上，矿税账册每月送到你案头。

清虚当年修完大阵时对你说过一句话：阵是护山的，也是困人的。你守了这座阵很多年，到最后才懂。

${endLine(s)}`,
  },
  {
    id: 'e_qingyun_head', name: '观星台正', priority: 68, tier: '天',
    condition: 'sect() == "qingyun" && char.sectRank >= 4 && realm >= 4',
    summary: '你做了观星台的监正，天下的灵气涨落都记在你的册子上。',
    text: (s) => `你做了观星台监正。各地观测点的罗盘读数每旬送进宁京，你一份份看过，批过。

你推算过千年大劫的日子，上书朝廷，没人信。你把那份奏疏抄了一份，锁进大观星台的铜匣里。

${endLine(s)}`,
  },
  {
    id: 'e_danxia_ancestry', name: '青崖药祖', priority: 68, tier: '天',
    condition: 'sect() == "danxia" && char.sectRank >= 4 && counters.alchemy >= 25',
    summary: '你成了青崖宗的药祖，药田和丹炉都按你的法子来。',
    text: (s) => `青崖宗的丹房里挂着你写的炉规，药田边上立着你定的分水石。

你跟石泉一起排过分水的时辰，跟铜谷的矿工吵过架。下游清流在你手上守住了。

${endLine(s)}`,
  },
  {
    id: 'e_tianyin_abbot', name: '青石庙祝', priority: 68, tier: '天',
    condition: 'sect() == "tianyin" && char.sectRank >= 4 && char.attrs.道心 >= 80',
    summary: '你做了青石祠庙的庙祝，镇上的香火和义仓都归你管。',
    text: (s) => `你做了青石祠庙的庙祝。义仓的钥匙在你手里，灾年开不开仓，你说了算。

赵守老了以后，镇上的大事都先来祠里问你。你不多说话，只把账一笔笔记清楚。

${endLine(s)}`,
  },
  {
    id: 'e_wanxiang_dean', name: '首席客卿', priority: 68, tier: '天',
    condition: 'sect() == "wanxiang" && char.sectRank >= 4 && char.attrs.悟性 >= 60',
    summary: '你成了宁京客卿之首，内廷和户部的难事都落在你身上。',
    text: (s) => `你做了宁京客卿之首。沈玉庭请你去清丈河洛的实亩，萧承请你守京城的宫门。

两头的差事你都办了，两头都不全信你。你在宁京住的那座小院，后来被史馆收作了档房。

${endLine(s)}`,
  },
  {
    id: 'e_hanshan_keeper', name: '雁门守将', priority: 68, tier: '天',
    condition: 'sect() == "hanshan" && char.sectRank >= 4 && realm >= 4',
    summary: '你在北境边军里坐到了统领身边，雁门关的防务由你分担。',
    text: (s) => `你在北境边军里做到了一路守将。林照把雁门外堡交给你，赵砚管粮，你管人。

粮车误期的冬天，你领着兵在关外屯田，跟朔部换过冬粮。那几年雁门一个人也没有饿死。

${endLine(s)}`,
  },
  {
    id: 'e_wanbao_magnate', name: '通远大掌柜', priority: 68, tier: '天',
    condition: 'sect() == "wanbao" && char.sectRank >= 4 && stones >= 50000',
    summary: '你做了通远商会的大掌柜，西陲的商路都要看你脸色。',
    text: (s) => `你做了通远商会的大掌柜。十三大井的盟约你重签过一次，玉门守军的饷银有一半走你的账。

韩玉请你喝过酒，耶律祁派人送过刀。你两样都收了，商路照走。

${endLine(s)}`,
  },
  {
    id: 'e_wanshou_king', name: '朔川鹰主', priority: 68, tier: '天',
    condition: 'sect() == "wanshou" && char.sectRank >= 4 && realm >= 4',
    summary: '你在朔部里有了自己的帐，草滩上的鹰和马都听你的。',
    text: (s) => `你在朔部有了自己的帐和自己的马群。阿史那岚截不截粮道，要先来帐里跟你商量。

你放过几次粮车，也截过几次。草滩上的人说，跟着你走，冬天不会饿死。

${endLine(s)}`,
  },
  {
    id: 'e_jiguan_master', name: '铜谷炉主', priority: 68, tier: '天',
    condition: 'sect() == "jiguan" && char.sectRank >= 4 && counters.craft >= 10',
    summary: '你接下了秦铸的炉坊，铜谷的炉火由你来看。',
    text: (s) => `秦铸老了，把炉坊交给你。你接军令，也改民用的犁头和水车。

煤价涨的那年，别家停了炉，你没有。铜谷的匠人后来立了一块碑，碑上刻着一句：炉火不能断。

${endLine(s)}`,
  },
  {
    id: 'e_xuemo_sovereign', name: '赤霞遗主', priority: 68, tier: '天',
    condition: 'sect() == "xuemo" && char.sectRank >= 4 && realm >= 4',
    summary: '你成了赤霞遗脉的主人，白驼废墟下的东西归你了。',
    text: (s) => `你成了赤霞遗脉之主。白驼流沙下的旧府由你打开，掠灵之法由你传下去。

玄衡宗派人来过三次，三次都没回去。

${endLine(s)}`,
  },
  {
    id: 'e_hehuan_matriarch', name: '沙道井主', priority: 68, tier: '天',
    condition: 'sect() == "hehuan" && char.sectRank >= 4 && realm >= 4',
    summary: '你成了沙道上说得上话的人，几口大井归你收钱。',
    text: (s) => `你在沙道上有了自己的井。过路的驼队交水资，交给你的人，不交给耶律祁的人。

后来朝廷来招安，你没去；耶律祁去了。沙道的规矩，从那以后是你定的。

${endLine(s)}`,
  },
  {
    id: 'e_youming_ferryman', name: '旧闸之主', priority: 68, tier: '天',
    condition: 'sect() == "youming" && char.sectRank >= 4 && realm >= 3',
    summary: '你坐上了黑风寨的头把交椅，芦洲旧河闸由你收钱。',
    text: (s) => `韩彪之后，黑风寨的插翅水蝎旗挂在了你的船上。旧河闸由你开，由你关。

官军来剿过，你谈下了过路钱；大水来过，你开闸放了南圩的人。芦洲的船家怕你，也有人记你的情。

${endLine(s)}`,
  },
  {
    id: 'e_sanxiu_legend', name: '散修之首', priority: 67, tier: '地',
    condition: '(sect() == "sanxiu" || sect() == "") && realm >= 6 && reputation >= 600',
    summary: '你没有门户，却是五域散修里最有名的那一个。',
    text: (s) => `你没有山门，没有师承，修到了合体。五域散修聚会，主位总给你空着。

你很少去坐。散修们说你脾气怪，有事去求你，你却从来没推过。

${endLine(s)}`,
  },
  {
    id: 'e_sect_renegade', name: '叛门独行', priority: 66, tier: '地', hidden: true,
    condition: '(betrayCount >= 1 || flag("临阵脱逃")) && realm >= 4',
    summary: '你叛出过山门，后来走得比留下的人都远。',
    text: (s) => `你离开山门那天，执事当众撕了你的名牌，说你这辈子到头了。

后来你修到了化神。当年那位执事老了来求你一颗丹，你给了，没说话。

${endLine(s)}`,
  },
  {
    id: 'e_sect_founder', name: '一代宗师', priority: 66, tier: '地',
    condition: 'flag("开宗立派") && reputation >= 500',
    summary: '你自立山门，开宗立派。',
    text: (s) => `你开了自己的山门。头一年只有三个徒弟，住在漏雨的草棚里。

后来草棚换成了石屋，石屋换成了殿。你的门规只有一条，刻在山门石上：灾年开仓。

${endLine(s)}`,
  },
  {
    id: 'e_pill_master', name: '丹道圣手', priority: 69, tier: '地',
    condition: 'sect() == "danxia" && count("alchemy") >= 100',
    summary: '你在青崖宗开炉上百次，丹方传遍东岭。',
    text: (s) => `你在青崖宗的丹房里开炉上百次。你改过的丹方，青崖宗用了几百年。

徐娘当年在青石镇给人看病缺药，你送过她一匣丹。她回了一封信，你一直收着。

${endLine(s)}`,
  },
  {
    id: 'e_sword_grave', name: '护阵执法', priority: 67, tier: '地',
    condition: 'sect() == "taixuan" && stats.kills >= 100',
    summary: '你替玄衡宗执法，私矿、盗脉的人死在你手上的过了百数。',
    text: (s) => `玄衡宗执法堂的簿子上，你的名字后面跟着一长串私矿和盗脉的案子。

铜谷的矿户见了你绕道走，东岭的山路却从此太平了许多。

${endLine(s)}`,
  },

  // =========================================================================
  // 三、法则证果篇
  // =========================================================================
  {
    id: 'e_law_chaos', name: '混沌圣尊', priority: 66, tier: '仙', hidden: true,
    condition: 'law("chaos") >= 4 && realm >= 5',
    summary: '你摸到了万法之前的那团东西。',
    text: (s) => `混沌法则在你手里成了形。你一抬手，桌上的茶水分不清是冷是热。

观星台的罗盘到了你身边就乱转，测灵的人说你身上没有灵根，也不像有。

${endLine(s)}`,
  },
  {
    id: 'e_law_space_time', name: '时空之主', priority: 66, tier: '仙', hidden: true,
    condition: 'law("space") >= 3 && law("time") >= 3 && realm >= 5',
    summary: '空间和光阴在你手里打了一个结。',
    text: (s) => `你一步能从青石镇走到雁门，一念能把一个时辰拉成一天。

有人说在同一天里，同时在宁京和沙州见过你。

${endLine(s)}`,
  },
  {
    id: 'e_law_chaos_origin', name: '阴阳未分', priority: 66, tier: '仙', hidden: true,
    condition: 'law("chaos") >= 3 && (law("time") >= 2 || law("space") >= 2) && realm >= 5',
    summary: '你从混沌里看见了光阴和空间分开以前的样子。',
    text: (s) => `你在混沌里坐了很久，看见过光阴和空间还没分开时的样子。

出关后你说话很少，问你看见了什么，你只说：一锅还没开的水。

${endLine(s)}`,
  },
  {
    id: 'e_law_sword_thunder', name: '雷剑双绝', priority: 66, tier: '天',
    condition: 'law("sword") >= 3 && law("thunder") >= 3 && realm >= 4',
    summary: '剑带雷声，雷走剑路。',
    text: (s) => `你的剑出鞘时带着雷声。雁门关外的雷雨夜，边军常看见山脊上有一道光来回走。

${endLine(s)}`,
  },
  {
    id: 'e_law_pill_array', name: '丹阵双圣', priority: 66, tier: '天',
    condition: 'law("pill") >= 3 && law("array") >= 3 && realm >= 4',
    summary: '你以阵为炉，以地脉为火。',
    text: (s) => `你把丹炉架在阵眼上，借地脉的火来炼丹。玄衡宗和青崖宗都派人来学，你都教了。

${endLine(s)}`,
  },
  {
    id: 'e_law_star_karma', name: '天机星宿', priority: 66, tier: '天',
    condition: 'law("star") >= 3 && law("karma") >= 3 && realm >= 4',
    summary: '你看星象，也看人的因果。',
    text: (s) => `你夜里看星，白天看人。谁的因果缠在谁身上，你看一眼就知道。

玄衡宗天机阁请你去坐过一年，你走的时候把阁里的旧卦全改了一遍。

${endLine(s)}`,
  },
  {
    id: 'e_law_sword_blood', name: '血剑', priority: 66, tier: '天', hidden: true,
    condition: 'law("sword") >= 3 && law("blood") >= 3 && realm >= 4',
    summary: '你的剑喝过太多血，剑身是暗红的。',
    text: (s) => `你的剑身是暗红色的，擦不掉。剑出鞘的时候，周围的人会闻到一股铁锈味。

${endLine(s)}`,
  },
  {
    id: 'e_law_sword', name: '剑意通神', priority: 65, tier: '天',
    condition: 'law("sword") >= 4 && realm >= 4',
    summary: '你的剑意摸到了神识的边。',
    text: (s) => `你不用拔剑了。心里起了剑意，三丈外的竹子就断。

顾淮当年在临河城头教过你一招刀，你后来把它化进了剑里。

${endLine(s)}`,
  },
  {
    id: 'e_law_pill', name: '九转丹圣', priority: 65, tier: '天',
    condition: 'law("pill") >= 4 && realm >= 4',
    summary: '你炼成了九转之丹。',
    text: (s) => `九转之丹出炉那天，丹房外的药田一夜之间全开了花。

你没有自己吃，送去了青石镇，给一个快要病死的孩子。

${endLine(s)}`,
  },
  {
    id: 'e_law_array', name: '周天阵祖', priority: 65, tier: '天',
    condition: 'law("array") >= 4 && realm >= 4',
    summary: '你布下的阵，护住了一整座城。',
    text: (s) => `你在临河城外布过一座阵，大水来的那年，河水绕着城走了。

玄衡宗的护脉大阵后来也按你的法子改过一次。

${endLine(s)}`,
  },
  {
    id: 'e_law_thunder', name: '掌雷天君', priority: 65, tier: '天',
    condition: 'law("thunder") >= 4 && realm >= 4',
    summary: '你掌中有雷。',
    text: (s) => `你一招手，晴天也能落雷。铜谷的私矿主怕你，见了阴天就收工。

${endLine(s)}`,
  },
  {
    id: 'e_law_space', name: '虚空行者', priority: 65, tier: '天',
    condition: 'law("space") >= 4 && realm >= 4',
    summary: '五域的路，对你来说只有一步。',
    text: (s) => `你一步从玉门走到宁京。通远商会想请你押货，你说不干，太快了没意思。

${endLine(s)}`,
  },
  {
    id: 'e_law_time', name: '岁月长河', priority: 65, tier: '天',
    condition: 'law("time") >= 4 && realm >= 4',
    summary: '你看得见光阴往哪里流。',
    text: (s) => `你看得见光阴的流向。哪一年会发大水，哪一年会断粮，你比观星台算得还准。

你没有告诉别人。你只是在那些年份之前，多买了些粮。

${endLine(s)}`,
  },
  {
    id: 'e_law_star', name: '摘星圣手', priority: 65, tier: '天',
    condition: 'law("star") >= 4 && realm >= 4',
    summary: '你能借星力。',
    text: (s) => `你夜里借星力修行，白天替观星台校星图。宁京大观星台的旧图，有三处是你改的。

${endLine(s)}`,
  },
  {
    id: 'e_law_karma', name: '执掌红线', priority: 65, tier: '天',
    condition: 'law("karma") >= 4 && realm >= 4',
    summary: '你看得见人和人之间的因果线。',
    text: (s) => `你看得见人和人之间的线。谁欠谁，谁会害谁，一目了然。

你剪断过几根，也系上过几根。

${endLine(s)}`,
  },
  {
    id: 'e_law_blood', name: '血海修罗', priority: 65, tier: '天',
    condition: 'law("blood") >= 4 && realm >= 4',
    summary: '血海法则在你身上翻腾。',
    text: (s) => `你一身血气重得压不住，走过的地方草都发红。

赤霞遗脉的人来找过你，你没去，他们也没再来。

${endLine(s)}`,
  },

  // =========================================================================
  // 四、红尘羁绊篇
  // =========================================================================
  {
    id: 'e_all_friends', name: '五域皆故人', priority: 64, tier: '天', hidden: true,
    condition: `${npcCount(20)} >= 4`,
    summary: '五域走一圈，处处有人认得你。',
    text: (s) => `你走到青石镇，何六要渡你过河不收钱；走到临河，宋宜从仓里给你拿一包新米；走到雁门，林照请你喝酒；走到铜谷，秦铸送你一把刀。

你这一世没有白活。

${endLine(s)}`,
  },
  {
    id: 'e_npc_su_bond', name: '仓灯共白头', priority: 64, tier: '天',
    condition: 'rel("宋宜") >= 50 && realm >= 3',
    summary: '临河粮码头的仓吏宋宜，陪你走完了这一世。',
    text: (s) => `宋宜管了一辈子仓，账从来没错过一笔。你帮她对过账，替她挡过来截赈粮的人。

后来她不管仓了，跟你在临河旧宅住下。夜里她点着灯核观星台的读数，你在旁边打坐。

${endLine(s)}`,
  },
  {
    id: 'e_npc_lu_duel', name: '城头同守', priority: 64, tier: '地',
    condition: 'rel("顾淮") >= 45 && realm >= 3',
    summary: '你和临河守将顾淮一起守过城。',
    text: (s) => `大水那年，你和顾淮在临河城头守了三天三夜。他管兵，你管堤。

后来顾淮老了，把他那把刀给了你，说：城你替我看着。

${endLine(s)}`,
  },
  {
    id: 'e_npc_yao_heir', name: '徐娘传方', priority: 64, tier: '地',
    condition: 'rel("徐娘") >= 45 && counters.alchemy >= 15',
    summary: '青石镇的医者徐娘，把她的药方传给了你。',
    text: (s) => `徐娘在青石镇行医一辈子，药方都在她脑子里。临终前，她一张张念给你听，你一张张记下。

此后你开炉，丹方的头一页写的都是她的名字。

${endLine(s)}`,
  },
  {
    id: 'e_npc_gu_chronicle', name: '罗盘传人', priority: 64, tier: '地',
    condition: 'rel("沈砚") >= 45 && counters.craft >= 5',
    summary: '沈砚把测灵罗盘的做法教给了你。',
    text: (s) => `沈砚在青石镇开了一辈子器铺，藏了一辈子观星台器匠的身份。他把测灵罗盘的盘心做法教给了你，只说了一句：别卖给门阀。

你没有卖。五域各州府后来用的罗盘，盘心都是按他的法子做的。

${endLine(s)}`,
  },
  {
    id: 'e_npc_xuesha_pact', name: '旧闸同盟', priority: 64, tier: '地', hidden: true,
    condition: 'rel("韩彪") >= 45 && karma <= -200',
    summary: '黑风寨寨主韩彪拿你当自己人。',
    text: (s) => `韩彪拿你当兄弟。你们一起据闸收钱，一起跟官军谈价，一起在芦荡里喝过酒。

官府的通缉榜上，你们的名字挨在一起。

${endLine(s)}`,
  },
  {
    id: 'e_npc_lin_reconcile', name: '宿敌化知己', priority: 64, tier: '地',
    condition: 'flag("宿敌_恕") && realm >= 3',
    summary: '斗了半辈子的宿敌，最后你放过了他。',
    text: (s) => `你和那个人斗了半辈子。最后一战你赢了，剑尖停在他喉前，没有刺下去。

他走了。很多年后，他托人给你送来一坛酒，没有留话。

${endLine(s)}`,
  },
  {
    id: 'e_npc_lin_triumph', name: '雪耻', priority: 64, tier: '地',
    condition: '(flag("宿敌_斩") || flag("宿敌_终胜")) && realm >= 3',
    summary: '当年欺你辱你的那个人，最后败在你手里。',
    text: (s) => `当年他当众羞辱你，你一句话都没说。

后来你一场场打回来，最后一场当着所有人的面。他倒下去的时候，你还记得当年他说过的每一个字。

${endLine(s)}`,
  },
  {
    id: 'e_master_of_disciples', name: '桃李满五域', priority: 64, tier: '地',
    condition: 'counter("disciples") >= 24 && realm >= 3',
    summary: '你收过的徒弟，散在五域各处。',
    text: (s) => `你收过的徒弟有好几十个。有人去了玄衡宗，有人进了观星台，有人回青石镇种田。

逢年过节，你门口总有几坛不知谁送来的酒。

${endLine(s)}`,
  },
  {
    id: 'e_imperial_preceptor', name: '帝王之师', priority: 64, tier: '地',
    condition: '(flag("见过皇帝") || origin == "royal") && realm >= 4 && reputation >= 300',
    summary: '宁朝的皇帝向你请教过治国。',
    text: (s) => `萧承请你进过宫，问过你南泽的粮、北境的饷、河洛的地。

你说了实话。他没全听，但听了一半。

${endLine(s)}`,
  },
  {
    id: 'e_richest_cultivator', name: '富甲五域', priority: 64, tier: '地',
    condition: 'stones >= 100000 && realm >= 2',
    summary: '你攒下的灵石，够买下半个临河城。',
    text: (s) => `你攒下的家底够买下半个临河城。通远商会的会票上，你的押记最值钱。

钱三当年在青石镇市集卖粮，借过你五十个铜钱。你一直没让他还。

${endLine(s)}`,
  },
  {
    id: 'e_npc_su_regret', name: '临河旧账', priority: 63, tier: '玄', hidden: true,
    condition: 'rel("宋宜") >= 25 && !flag("道侣") && age >= 200',
    summary: '你和宋宜之间，有一笔一直没算清的账。',
    text: (s) => `你认识宋宜的时候，她在临河粮码头对账。你们说过很多话，但有一句一直没说。

她老死在临河旧宅，你在外面赶不回来。她桌上的账本最后一页，记着你的名字。

${endLine(s)}`,
  },
  {
    id: 'e_chivalrous_heart', name: '侠骨丹心', priority: 63, tier: '地',
    condition: 'karma >= 300 && (flag("平过冤案") || flag("施粥") || flag("砸过人市"))',
    summary: '你平过冤案，施过粥，砸过人市。',
    text: (s) => `你砸过人市，施过粥，替人平过冤。你没有门派撑腰，也不图名声。

那些被你救过的人，后来在青石祠庙给你立了一块无字的牌位。

${endLine(s)}`,
  },
  {
    id: 'e_lonely_gravekeeper', name: '孤灯守墓', priority: 63, tier: '玄', hidden: true,
    condition: '(flag("道侣已故") || (flag("道侣") && age >= 400)) && realm >= 3',
    summary: '道侣先你而去，你守着那座坟过了很多年。',
    text: (s) => `道侣走的那年，你在坟边搭了一间草屋。

此后每天夜里你都在坟前点一盏灯。镇上的人换了几代，只知道山坡上有一盏灯，从来没灭过。

${endLine(s)}`,
  },
  {
    id: 'e_return_qingniu', name: '归隐青石', priority: 63, tier: '玄',
    condition: 'origin == "farmer" && region() == "qingniu" && realm >= 3 && age >= 120',
    summary: '你是农家出身，修成元婴以上，最后回了青石镇。',
    text: (s) => `修成之后，你回了青石镇。东田的灵田还在，阿衡的孙子在种。

你帮他修好了那条老漏水的沟。他问你是谁，你说是路过的。

${endLine(s)}`,
  },
  {
    id: 'e_hermit', name: '山中无甲子', priority: 62, tier: '玄',
    condition: 'char.attrs.道心 >= 80 && realm >= 3',
    summary: '你在山里一坐就是许多年。',
    text: (s) => `你在山里一坐就是许多年。山下换了几个百年，你只数了几回花开。

${endLine(s)}`,
  },
  {
    id: 'e_red_dust', name: '红尘仙', priority: 62, tier: '天', hidden: true,
    condition: 'flag("道侣") && rel("道侣") >= 35',
    summary: '修行一世，你最记得的是身边那个人。',
    text: (s) => `你修了一辈子行，最后记得最清楚的，是道侣早起煮粥的样子。

${endLine(s)}`,
  },
  {
    id: 'e_karma_saint', name: '功德圆满', priority: 64, tier: '地',
    condition: 'karma >= 500 && realm >= 4',
    summary: '你这一世，救下的人比杀的人多得多。',
    text: (s) => `你这一世救过的人，自己也数不清。灾年你开仓，大水你修堤，瘟疫你进村。

${endLine(s)}`,
  },
  {
    id: 'e_hermit_low', name: '归隐', priority: 61, tier: '玄',
    condition: 'realm >= 2 && char.attrs.道心 >= 60 && age >= 80',
    summary: '结丹之后，你找了个地方住下，不再出山。',
    text: (s) => `结丹以后，你在菱湖边上找了间屋子住下，打鱼，种藕，偶尔替人看看病。

${endLine(s)}`,
  },

  // =========================================================================
  // 五、五域行迹与奇遇篇
  // =========================================================================
  {
    id: 'e_gf_bottle_master', name: '瓶中药圣', priority: 63, tier: '天',
    condition: 'char.goldenFingerId == "gf_bottle" && counters.alchemy >= 25 && realm >= 3',
    summary: '那只墨色小瓶陪你炼了一辈子药。',
    text: (s) => `那只墨色小瓶每夜承一滴露。你拿它催熟过灵草，救过人，也换过钱。

到最后你也不知道它是从哪里来的。

${endLine(s)}`,
  },
  {
    id: 'e_gf_sword_elder_legacy', name: '承剑', priority: 63, tier: '天',
    condition: 'char.goldenFingerId == "gf_sword_elder" && realm >= 5',
    summary: '戒中那缕剑魂，把它一生的剑都教给了你。',
    text: (s) => `戒指里那缕剑魂骂了你一辈子，也教了你一辈子。

你修到炼虚那年，它说了最后一句话：剑你拿稳了。然后就再也没出声。

${endLine(s)}`,
  },
  {
    id: 'e_gf_karma_mirror_sage', name: '古镜鉴世', priority: 63, tier: '天',
    condition: 'char.goldenFingerId == "gf_karma_mirror" && (stones >= 50000 || stats.events >= 40) && realm >= 3',
    summary: '那面古铜镜照了你一生的吉凶。',
    text: (s) => `那面古铜镜照过你一生的吉凶。你靠它躲过死劫，也靠它在坊市里捡过漏。

镜面最后一次亮起来，照出来的是你自己。

${endLine(s)}`,
  },
  {
    id: 'e_gf_stealth_eternal', name: '藏锋长生', priority: 63, tier: '天', hidden: true,
    condition: 'char.goldenFingerId == "gf_stealth" && age >= 500 && realm >= 4',
    summary: '你藏了五百年，没人看清过你的修为。',
    text: (s) => `你藏了五百年。人人都当你是个炼气的老散修，没人看清过你。

你看着那些锋芒毕露的人一个个倒下，自己活了下来。

${endLine(s)}`,
  },
  {
    id: 'e_gf_signin_stele', name: '碑上记事', priority: 63, tier: '天',
    condition: 'char.goldenFingerId == "gf_signin" && realm >= 5',
    summary: '识海里那座无字石碑，记下了你走过的每一处地方。',
    text: (s) => `识海里那座无字石碑，你每到一处新地方，碑上就多一道纹。

到最后碑面刻满了。你走过的五域，一处不少。

${endLine(s)}`,
  },
  {
    id: 'e_jade_token_fate', name: '玉牌刻碑', priority: 63, tier: '天', hidden: true,
    condition: 'flag("同名玉牌") && realm >= 5',
    summary: '那块刻着你名字的玉牌，原来是你自己留下的。',
    text: (s) => `那块刻着你名字的玉牌，你追查了一辈子。

最后你在一处古修遗址里找到了另一块，字迹是你自己的。你不记得什么时候刻过它。也许是哪一世。

${endLine(s)}`,
  },
  {
    id: 'e_region_jiuxiao', name: '赤霞守府人', priority: 63, tier: '天',
    condition: 'region() == "jiuxiao" && realm >= 6',
    summary: '你在白驼流沙下的赤霞旧府住了下来。',
    text: (s) => `你在白驼流沙下找到了赤霞旧府的正殿，在那里住了下来。

古修当年犯过的错，殿壁上刻得清清楚楚。你每天读一段，读完就在沙海里种一棵树。

${endLine(s)}`,
  },
  {
    id: 'e_region_kunlun', name: '玉门守井人', priority: 63, tier: '天',
    condition: 'region() == "kunlun" && realm >= 5',
    summary: '你在西陲守了一辈子井。',
    text: (s) => `你在沙州守十三大井。沙吾提老了以后，井户都来找你分水。

你定下的配水规矩，西陲用了几百年。

${endLine(s)}`,
  },
  {
    id: 'e_region_zhongzhou', name: '宁京供奉', priority: 62, tier: '天',
    condition: 'region() == "zhongzhou" && realm >= 5',
    summary: '你在宁京住了下来，看了好几代人的朝争。',
    text: (s) => `你在宁京住了很多年，看沈玉庭清丈，看魏承阻丈，看萧承立储。

宁朝没了以后，你还在宁京。新来的人问你从前的事，你一件件说给他们听。

${endLine(s)}`,
  },
  {
    id: 'e_region_beihuang', name: '雁门长城客', priority: 62, tier: '地',
    condition: 'region() == "beihuang" && realm >= 4',
    summary: '你在北境的关墙上走了很多年。',
    text: (s) => `你在雁门关的关墙上走了很多年。冬天补冻缝，春天巡烽燧。

关城上的老兵都认得你，叫不出你的名字。

${endLine(s)}`,
  },
  {
    id: 'e_region_guixu', name: '玄衡山中客', priority: 62, tier: '地',
    condition: 'region() == "guixu" && realm >= 4',
    summary: '你在玄衡群峰里找了一处洞府，住下不走了。',
    text: (s) => `你在玄衡群峰深处开了一处洞府，护脉大阵的边上。

玄衡宗的人知道你在，也不来打扰。阵眼松动的那几年，是你替他们稳住的。

${endLine(s)}`,
  },
  {
    id: 'e_region_yaosen', name: '青崖巡山人', priority: 62, tier: '地',
    condition: 'region() == "yaosen" && realm >= 3 && stats.kills >= 40',
    summary: '你在青崖谷和铜谷之间巡山，私矿和妖邪都怕你。',
    text: (s) => `你在青崖谷和铜谷之间巡了很多年山。盗采的、偷药的、山里的妖邪，死在你手上的不下几十。

药农和矿工吵架，也来找你评理。

${endLine(s)}`,
  },
  {
    id: 'e_region_luoxia', name: '临河隐主', priority: 62, tier: '地',
    condition: 'region() == "luoxia" && realm >= 3 && stones >= 30000',
    summary: '临河城里有一半的铺子，暗地里是你的。',
    text: (s) => `临河城东市有一半的铺子，暗地里是你的。粮码头的船，也有你的份。

州府换了几任长官，都要来拜你。

${endLine(s)}`,
  },
  {
    id: 'e_region_qingniu', name: '青石土地', priority: 62, tier: '玄',
    condition: 'region() == "qingniu" && realm >= 4 && karma >= 100',
    summary: '你守着青石镇，镇上的人把你当了土地。',
    text: (s) => `你守着青石镇很多年。大水来的那年，河湾渡一条船都没翻。

镇上的人在祠庙边上给你立了个小龛，叫你土地。你没拦着。

${endLine(s)}`,
  },
  {
    id: 'e_pet_turtle_sage', name: '灵龟镇寿', priority: 62, tier: '地',
    condition: 'char.petId == "pet_turtle" && realm >= 4',
    summary: '那只灵龟比你活得还长。',
    text: (s) => `你养的那只灵龟慢吞吞跟了你一辈子。你死的时候，它趴在你身边，一动不动。

后来有人在河湾渡的石头上见过它晒太阳。

${endLine(s)}`,
  },
  {
    id: 'e_pet_bird_soar', name: '青鸾扶摇', priority: 62, tier: '地',
    condition: 'char.petId == "pet_bird" && realm >= 4',
    summary: '那只青鸾驮着你走遍了五域。',
    text: (s) => `那只青鸾驮着你飞过雁门的雪、西陲的沙、南泽的水。

你死后，它在你坟上绕了三圈，往北飞走了。

${endLine(s)}`,
  },
  {
    id: 'e_pet_beetle_swarm', name: '噬金虫潮', priority: 62, tier: '地',
    condition: 'char.petId == "pet_beetle" && realm >= 4',
    summary: '你的噬金虫繁衍成了一片虫潮。',
    text: (s) => `你的噬金虫繁衍成了一片虫潮，所过之处金铁全无。铜谷的私矿主见了你就跪。

${endLine(s)}`,
  },
  {
    id: 'e_pet_fox_immortal', name: '白狐护道', priority: 62, tier: '地',
    condition: 'char.petId == "pet_fox" && realm >= 4',
    summary: '那只白狐替你挡过一劫。',
    text: (s) => `那只白狐跟了你一辈子，替你挡过一次死劫，断了一条尾巴。

你死后，它化成人形，在你坟前守了三年。

${endLine(s)}`,
  },
  {
    id: 'e_emperor', name: '宁祚不绝', priority: 65, tier: '天', hidden: true,
    condition: 'origin == "royal" && realm >= 5 && year() >= 501',
    summary: '宁朝亡了，你这个宗亲还活着。',
    text: (s) => `第四百年后，宁朝宗室绝嗣，天下没了共主。史书上写：宁祚终。

史书没写的是，宁室还有一个人活着。你看着宁京的宫阙改成会盟的公所，没有去争。

${endLine(s)}`,
  },
  {
    id: 'e_outsider', name: '天外归客', priority: 108, tier: '仙', hidden: true,
    condition: 'origin == "outsider" && realm >= 9',
    summary: '你从天外来，在这里成了真仙，没有回去。',
    text: (s) => `你不是这个世界的人。你从很远的地方来，带着另一个世界的记忆。

你在这里成了真仙。有人问你想不想回去，你想了很久，说：这里有我认识的人。

${endLine(s)}`,
  },
  {
    id: 'e_sword_spirit', name: '器灵归位', priority: 65, tier: '地', hidden: true,
    condition: 'origin == "artifact_spirit" && realm >= 6',
    summary: '你前生是一件器物的灵，这一世终于想起来了。',
    text: (s) => `修到合体那年，你想起来了：你前生是一件器物里的灵。

那件器物还在东岭某座废窑底下。你去把它挖了出来，擦干净，放在了床头。

${endLine(s)}`,
  },

  // =========================================================================
  // 六、陨落与无常篇
  // =========================================================================
  {
    id: 'e_tribulation_dacheng', name: '一步之遥', priority: 83, tier: '天',
    condition: 'flag("渡劫失败") && realm >= 7',
    summary: '你离真仙只差一步，倒在了最后一道雷下。',
    text: (s) => `你修到了大乘，离真仙只差一步。

最后一道雷落下来的时候，你看见了很多东西：青石镇的渡口，临河的大水，那些你认识的人。

然后什么都没有了。

${BACK}`,
  },
  {
    id: 'e_tribulation_chaos', name: '天妒异数', priority: 82, tier: '天', hidden: true,
    condition: 'flag("渡劫失败") && root() == "hundun"',
    summary: '混沌灵根，天道容不下你。',
    text: (s) => `你身负混沌，天劫比别人重三倍。

雷落下来的时候，你笑了一下。这一世不行，还有下一世。

${BACK}`,
  },
  {
    id: 'e_tribulation_jindan', name: '丹碎雷下', priority: 81, tier: '玄',
    condition: 'flag("渡劫失败") && realm >= 2 && realm <= 3',
    summary: '结丹的雷劫，你没有扛过去。',
    text: (s) => `丹成的那一刻，雷劫落了下来。你扛了两道，第三道劈碎了刚结的丹。

${BACK}`,
  },
  {
    id: 'e_tribulation_death', name: '身死道消', priority: 80, tier: '玄',
    condition: 'flag("渡劫失败")',
    summary: '天劫之下，你没有活下来。',
    text: (s) => `雷劫落下来，你没有扛住。

${BACK}`,
  },
  {
    id: 'e_demon_high_fall', name: '大能堕魔', priority: 79, tier: '地', hidden: true,
    condition: 'demon >= 100 && realm >= 5',
    summary: '修到炼虚，你还是被心魔吃了。',
    text: (s) => `你的修为一路往上走，心魔也跟着往上走。

最后一夜，它坐在你的位子上，用你的声音说话。五域的人以为你还活着，其实已经不是你了。

${BACK}`,
  },
  {
    id: 'e_demon_blood_fall', name: '血气焚心', priority: 79, tier: '玄', hidden: true,
    condition: 'demon >= 100 && (sect() == "xuemo" || karma <= -300)',
    summary: '杀孽太重，血气从里面烧了起来。',
    text: (s) => `你杀的人太多，血气从心口烧起来，压不住。

你在白驼的沙地上烧了三天三夜，最后只剩一把灰。

${BACK}`,
  },
  {
    id: 'e_demon_devour', name: '心魔噬体', priority: 78, tier: '玄', hidden: true,
    condition: 'demon >= 100',
    summary: '心魔把你吃干净了。',
    text: (s) => `心魔一点点把你吃干净了。到最后，你连自己叫什么都想不起来。

${BACK}`,
  },
  {
    id: 'e_killed_high_realm', name: '老祖陨落', priority: 74, tier: '地',
    condition: 'hp <= 0 && realm >= 5',
    summary: '你修到了炼虚，还是死在了别人手里。',
    text: (s) => `你修到了炼虚以上，以为天下没几个人能杀你。

杀你的那个人，你到死都没看清他的脸。

${BACK}`,
  },
  {
    id: 'e_killed_beihuang', name: '埋骨雁门', priority: 73, tier: '玄',
    condition: 'hp <= 0 && region() == "beihuang"',
    summary: '你死在了北境，雪把你埋了。',
    text: (s) => `你死在雁门关外。北境的雪下了一夜，把你埋了。

开春雪化，边军收尸的人在你身上找到半块干饼。

${BACK}`,
  },
  {
    id: 'e_killed_guixu', name: '殁于群峰', priority: 73, tier: '玄',
    condition: 'hp <= 0 && region() == "guixu"',
    summary: '你死在了玄衡群峰里。',
    text: (s) => `你死在玄衡群峰深处，护脉大阵的边上。阵光照着你，一夜没灭。

${BACK}`,
  },
  {
    id: 'e_killed_karma_fire', name: '业火焚身', priority: 72, tier: '玄', hidden: true,
    condition: 'hp <= 0 && karma <= -400',
    summary: '恶事做尽，报应来了。',
    text: (s) => `你做了太多恶事。杀你的人，是你多年前害死的那家人的孩子。

${BACK}`,
  },
  {
    id: 'e_killed_hunter', name: '杀人者人恒杀之', priority: 71, tier: '黄',
    condition: 'hp <= 0 && stats.kills >= 50',
    summary: '你杀了很多人，最后也被人杀了。',
    text: (s) => `你杀了很多人。最后一个找上门的，你没打过。

${BACK}`,
  },
  {
    id: 'e_killed', name: '死于非命', priority: 70, tier: '黄',
    condition: 'hp <= 0',
    summary: '你死在了半路上。',
    text: (s) => `你死在了半路上。没人知道你叫什么，也没人知道你本来要去哪里。

${BACK}`,
  },
  {
    id: 'e_old_age_ancient', name: '万古坐化', priority: 61, tier: '天',
    condition: 'age >= lifespan && realm >= 7',
    summary: '你修到了大乘，寿元还是到了头。',
    text: (s) => `你修到了大乘，活了很久很久。最后一天，你坐在洞府门口，看了一整天的山。

天黑的时候，你闭上了眼睛。

${BACK}`,
  },
  {
    id: 'e_old_age_alchemy_ash', name: '炸炉成灰', priority: 61, tier: '玄', hidden: true,
    condition: 'age >= lifespan && counters.alchemy_fail >= 10',
    summary: '炸了一辈子炉，寿元也耗在了炉边。',
    text: (s) => `你一生炸过的丹炉不下十口。寿元将尽那天，你还在开炉。

这一炉成了。你没来得及看。

${BACK}`,
  },
  {
    id: 'e_old_age_destitute', name: '穷困坐化', priority: 61, tier: '黄', hidden: true,
    condition: 'age >= lifespan && stones == 0 && realm >= 1',
    summary: '修了一辈子，身无分文地走了。',
    text: (s) => `你修了一辈子，到死身上一块灵石都没有。

收尸的人翻遍你的储物袋，只找到一本翻烂了的引气诀残篇。

${BACK}`,
  },
  {
    id: 'e_old_age_disperse', name: '散功归凡', priority: 61, tier: '玄',
    condition: 'age >= lifespan && realm >= 2 && char.attrs.道心 >= 50 && karma >= 50',
    summary: '寿元将尽，你把修为散回了天地。',
    text: (s) => `寿元将尽的时候，你没有去找延寿的丹。你把一身修为散回天地，变回一个普通老人。

最后几天，你在青石镇市集上卖了几天菜。

${BACK}`,
  },
  {
    id: 'e_old_age', name: '寿元耗尽', priority: 60, tier: '玄',
    condition: 'age >= lifespan',
    summary: '寿元到了头。',
    text: (s) => `你的寿元到了头。你躺下的时候，窗外的天还亮着。

${BACK}`,
  },
  {
    id: 'e_mortal', name: '凡人一世', priority: 62, tier: '凡',
    condition: 'realm === 0 && layer === 0 && stats.breakthroughs === 0 && age >= lifespan * 0.95',
    summary: '你没有修行，做了一辈子凡人。',
    text: (s) => `你没有修行，过了一辈子凡人的日子。种过田，挑过担，娶过亲，生过孩子。

临死前你想，这样也挺好。

${BACK}`,
  },
  {
    id: 'e_slaughter', name: '杀孽', priority: 65, tier: '玄', hidden: true,
    condition: 'stats.kills >= 1000',
    summary: '你这一世杀了一千个以上的人。',
    text: (s) => `你这一世杀了一千个以上的人。到后来，你连他们的脸都记不住了。

${endLine(s)}`,
  },

  // =========================================================================
  // 七、轮回与大历史篇（v8 新增）
  // =========================================================================
  // —— 纪元：活到哪一年，就看见哪一段历史 ——
  {
    id: 'e_era_jieshu', name: '逆天改命', priority: 121, tier: '仙', hidden: true,
    condition: 'char.jieshu >= 12 && year() >= 1000',
    summary: '十二重劫数之下，你活过了第一千年。',
    text: (s) => `十二重劫数压在身上，天地处处与你为难。灵气比别人薄，雷劫比别人重，寿元比别人短。

你还是活过了第一千年，看见了五域会盟。

${endLine(s)}`,
  },
  {
    id: 'e_hist_tongji', name: '名入通纪', priority: 120, tier: '仙', hidden: true,
    condition: 'year() >= 9801 && count("history_rewrites") >= 5',
    summary: '宁京史馆总纂《万年通纪》，里面有你。',
    text: (s) => `第九千八百年后，宁京史馆总纂万年大史，刊成《万年通纪》。

你在史馆的书架前翻过这部书。临河那场大水，记的是堤守住了；雁门那年的援军，记的是到了。执笔的史官不知道，这些年份原本不是这样写的。

卷末附了一段闲笔：五域市井相传有扶桑长生叟，死而复生，知数代旧事。史官说不可考。

${endLine(s)}`,
  },
  {
    id: 'e_era_wannian', name: '万载玄极', priority: 119, tier: '仙',
    condition: 'year() >= 10000',
    summary: '你活过了整整一个纪元。',
    text: (s) => `第一纪元第一万年。你从十六岁的青石镇少年，一直走到了这一年。

你见过宁朝的灭亡，见过灵气枯竭，见过凡人造出不用灵气的车，也见过灵潮重新涌回来。

纪元之末的劫兆一次次来，你一次次站在原地。

${endLine(s)}`,
  },
  {
    id: 'e_era_lingchao', name: '灵潮复起', priority: 118, tier: '仙',
    condition: 'year() >= 8001',
    summary: '你熬过了几千年的末法，看见灵气重新涌回来。',
    text: (s) => `灵气枯了几千年。那些年里你修为一寸寸往下掉，跟凡人一起挤火轮车，一起排公局的队。

第八千年后的一个春天，你在铜谷的山坡上坐着，觉得风里有一点甜。百草一夜之间长高了半尺，老宗门的残阵开始自己鸣响。

灵潮回来了。你等到了。

${endLine(s)}`,
  },
  {
    id: 'e_era_tianzhu', name: '天柱崩折', priority: 116, tier: '天', hidden: true,
    condition: 'year() >= 8701 && year() <= 8800 && region() == "zhongzhou"',
    summary: '宁京天柱崩折那年，你在宁京。',
    text: (s) => {
      // 与 B088 天柱崩折的三种处置对齐：事先撤空 / 坠石下救人 / 默认
      const f = s.flags || {};
      const body = f.e1d_tianzhu_che
        ? '凡世公局联合东岭仙门，在宁京立天柱，要引罡风。你早看出柱上的裂隙，崩折前一夜把柱下坊巷撤空了。\n\n一柱崩折，坠石砸进空巷，没有压死一个人。'
        : f.e1d_tianzhu_jiu
          ? '凡世公局联合东岭仙门，在宁京立天柱，要引罡风。你劝过，没人听。\n\n一柱崩折，坠石砸毁了半条坊巷。你在烟尘里抱出了十几个人。'
          : '凡世公局联合东岭仙门，在宁京立天柱，要引罡风。\n\n一柱崩折，坠石砸毁了半条坊巷。那天你在宁京，听见了那一声。';
      return `${body}\n\n${endLine(s)}`;
    },
  },
  {
    id: 'e_era_jiqiao', name: '机巧之世', priority: 117, tier: '天',
    condition: 'year() >= 4501',
    summary: '灵气枯了，凡人造出了自己的力量。你混在他们中间活着。',
    text: (s) => `第四千五百年后，灵气薄得几乎感觉不到。宗门封了山，功法锁进了石室。

凡人没有等。他们造水力的锻锤，挖南北的运河，烧火轮的车。青石镇通了水运，长成了一座机巧城。

你在城里赁了一间屋子，没人知道隔壁这个沉默的手艺人，修为曾经能移山。

${endLine(s)}`,
  },
  {
    id: 'e_era_mofa', name: '藏真入匣', priority: 96, tier: '地',
    condition: 'year() >= 4401 && year() <= 4500',
    summary: '诸派封存功法的那一百年，你也走到了头。',
    text: (s) => `灵枯的大势已经看得清了。玄衡宗、青崖宗把功法器典一卷卷装进铜匣，藏进名山石室。

你去送过一卷，是你自己写的。

${endLine(s)}`,
  },
  {
    id: 'e_era_kuyong', name: '绝刃争余', priority: 95, tier: '地',
    condition: 'hp <= 0 && year() >= 4201 && year() <= 4300',
    summary: '为了最后一处灵源，五域打起来了。你死在那场仗里。',
    text: (s) => `灵源只剩最后几处。东岭宗门和中州诸邑联军为此兵戎相见。

你死在那场仗里。你本来是去劝和的。

${BACK}`,
  },
  {
    id: 'e_era_tianhe', name: '天河易轨', priority: 87, tier: '玄',
    condition: 'year() >= 4301 && year() <= 4400 && (region() == "qingniu" || region() == "luoxia")',
    summary: '大洪决口，南泽的河改了道。那一百年你在南泽。',
    text: (s) => `第四千三百年后，大洪决口，漫过平川。南泽的河道整个挪了位置，临河城一半泡进了水里。

你在青石镇的高地上，看着当年的河湾渡变成了一片芦荡。

${endLine(s)}`,
  },
  {
    id: 'e_era_qiannian', name: '千年一梦', priority: 90, tier: '地',
    condition: 'year() >= 1001 && realm < 9',
    summary: '你活过了第一千年。',
    text: (s) => `第九百年后，五域头一回订了跨域互保的盟约。到第一千年，会盟的公所已经开始抽厘平准、修驿路栈闸。

你从第一年活到了这一年。宁朝早没了，青石镇已经是城，你认识的人全都不在了。

${endLine(s)}`,
  },
  {
    id: 'e_era_dingzuo', name: '鼎祚终歇', priority: 88, tier: '玄',
    condition: 'year() >= 401 && year() <= 500',
    summary: '宁朝宗室绝嗣、天下失了共主的那一百年，你走到了头。',
    text: (s) => `第四百年后，宁朝宗室绝嗣，府库见底。宁京的诏书出不了城门，各地盟府各立纲纪。

你看见了一个王朝怎么没的。没有大战，只是一年年账对不上，一年年粮运不到。

${endLine(s)}`,
  },
  {
    id: 'e_era_century_end', name: '百年之末', priority: 86, tier: '玄', hidden: true,
    condition: 'year() == 100',
    summary: '你在第一百年走到了头，刚好一章。',
    text: (s) => `第一百年。五域各自收拾这一百年留下的账：北境记边防，东岭记矿权，南泽记堤线。

你也在这一年了结。一百年，刚好一章。

${endLine(s)}`,
  },

  // —— 改写历史 ——
  {
    id: 'e_hist_flood', name: '临河不没', priority: 89, tier: '玄',
    condition: 'outcome("y018.nanze_baseline_flood") == "changed" && year() <= 100',
    summary: '前世淹了临河的那场大水，这一世被你挡住了。',
    text: (s) => `前世那场大水，你记得很清楚：河湾堤从南圩那一段溃口，临河粮仓水深五尺，青石镇挤满了逃难的人。

这一世你提前去了。堤加了，粮挪了，低处的人先撤了。水还是来了，城没有没。

${endLine(s)}

${BACK}`,
  },
  {
    id: 'e_hist_linzhao', name: '雁门援至', priority: 89, tier: '玄',
    condition: 'outcome("y012.beijing_lin_zhao_reinforcement") == "changed"',
    summary: '前世死在增援路上的林照，这一世活着到了雁门。',
    text: (s) => `前世，林照在增援北境的路上遇袭，死在了雁门关外，赵砚接了他的位子。

这一世你提前报了信。林照绕开了那条路，带着援军进了关城。

${endLine(s)}`,
  },
  {
    id: 'e_hist_century_rewrite', name: '百年易辙', priority: 88, tier: '地',
    condition: 'count("history_rewrites") >= 5 && year() <= 100',
    summary: '第一个百年没走完，你已经改了五件大事。',
    text: (s) => `你带着前世的记忆回来，第一个百年还没过完，已经有五件大事走了另一条路。

你死的时候，五域的人不会知道，原本的第一百年是什么样子。

${endLine(s)}

${BACK}`,
  },
  {
    id: 'e_hist_thirty', name: '万年改史', priority: 92, tier: '天',
    condition: 'count("history_rewrites") >= 30',
    summary: '这一世，你改写了三十件以上的大事。',
    text: (s) => `这一世你改写的大事，已经超过三十件。前世手札里记的历史，和你眼前的五域对不上了。

你翻着手札，一条条划掉，又一条条写上新的。

${endLine(s)}`,
  },
  {
    id: 'e_hist_twelve', name: '天下易容', priority: 87, tier: '地',
    condition: 'count("history_rewrites") >= 12',
    summary: '十二件大事因你而不同。',
    text: (s) => `十二件大事因你走了另一条路。有些变好了，有些变得更难说。

${endLine(s)}`,
  },
  {
    id: 'e_hist_five', name: '五事改观', priority: 86, tier: '玄',
    condition: 'count("history_rewrites") >= 5',
    summary: '五件大事因你而不同。',
    text: (s) => `五件大事因你走了另一条路。你记得它们原来的样子，别人不记得。

${endLine(s)}`,
  },
  {
    id: 'e_hist_first', name: '一事不同', priority: 85, tier: '黄',
    condition: 'count("history_rewrites") >= 1',
    summary: '这一世，有一件大事因你而不同。',
    text: (s) => `这一世，有一件前世记得的大事，结局变了。只有一件，但它是因为你变的。

${endLine(s)}`,
  },
  {
    id: 'e_hist_none', name: '一切照旧', priority: 56, tier: '黄', hidden: true,
    condition: 'count("history_rewrites") == 0 && meta.cycle >= 3 && year() >= 101',
    summary: '你明明知道会发生什么，却什么都没改。',
    text: (s) => `前世手札上记的事，这一世一件件照旧发生了。大水照旧来，粮照旧断，人照旧死。

你知道，你只是没有去。

${endLine(s)}`,
  },

  // —— 兵解：自己挑的时辰 ——
  {
    id: 'e_bingjie_chapter', name: '章末兵解', priority: 92, tier: '玄', hidden: true,
    condition: 'flag("bingjie") && year() % 100 == 0',
    summary: '你在一个百年的最后一年兵解。',
    text: (s) => `第${yearOf(s)}年，一个百年的最后一年。${era(s)}到这里收尾。

你等它收完了尾，才散去修为。

${BACK}`,
  },
  {
    id: 'e_bingjie_peak', name: '盛年兵解', priority: 91, tier: '地',
    condition: 'flag("bingjie") && realm >= 6 && age * 2 < lifespan',
    summary: '寿元还剩大半，修为正盛，你自己了结了这一世。',
    text: (s) => `你修为正盛，寿元还剩大半。所有人都以为你会一直活下去。

你自己挑了一天，把这一世了结了。前世手札上还有太多事等着重来。

${BACK}`,
  },
  {
    id: 'e_bingjie_lastday', name: '大限之前', priority: 90, tier: '玄',
    condition: 'flag("bingjie") && lifespan - age <= 1',
    summary: '寿元只剩最后一点，你没有等它耗完。',
    text: (s) => `寿元只剩最后几个月。你没有等它耗完，选了个晴天，兵解入轮回。

${BACK}`,
  },
  {
    id: 'e_bingjie_early', name: '百年未满', priority: 84, tier: '黄',
    condition: 'flag("bingjie") && year() <= 100',
    summary: '第一个百年还没过完，你就选择了重来。',
    text: (s) => `第${yearOf(s)}年，第一个百年还没过完。你看清了这一世走不到想要的地方，不再往下熬。

${BACK}

这一次，你知道该先去哪里。`,
  },
  {
    id: 'e_bingjie_ferry', name: '渡口兵解', priority: 83, tier: '玄',
    condition: 'flag("bingjie") && region() == "qingniu" && realm < 9',
    summary: '你回到青石镇河湾渡，在那里兵解。',
    text: (s) => `你回到青石镇河湾渡，在每一世醒来的地方坐了一会儿，然后散去了修为。

闭眼和睁眼，看见的是同一条河。

${BACK}`,
  },
  {
    id: 'e_bingjie', name: '兵解入轮回', priority: 58, tier: '黄',
    condition: 'flag("bingjie")',
    summary: '你主动了结了这一世。',
    text: (s) => `${CAUSE_LINE.bingjie(s)}

${BACK}`,
  },

  // —— 凡人营生：不修行，也是一世（以出身为营生） ——
  {
    id: 'e_mortal_flood', name: '凡人守堤', priority: 90, tier: '地', hidden: true,
    condition: `${MORTAL} && outcome("y018.nanze_baseline_flood") == "changed"`,
    summary: '你没有修为，却挡住了那场大水。',
    text: (s) => `你一辈子没引过一口灵气。前世那场大水，你记得哪一段堤会溃。

这一世你挑着土，喊着人，跟着顾淮的兵在河湾堤上守了三天。堤没有溃。

没有人知道是一个凡人先看出来的。

${endLine(s)}`,
  },
  {
    id: 'e_mortal_rewrite', name: '凡身改史', priority: 86, tier: '玄',
    condition: `${MORTAL} && count("history_rewrites") >= 1`,
    summary: '不修行的凡人，也能让一件大事走另一条路。',
    text: (s) => `你没有修行。你手里只有前世的记忆，和一张会说话的嘴。

你提前报了一次信，提前囤了一次粮。一件大事因此走了另一条路。

${endLine(s)}`,
  },
  {
    id: 'e_mortal_killed', name: '乱世草芥', priority: 69, tier: '凡',
    condition: `${MORTAL} && hp <= 0 && year() <= 100`,
    summary: '第一个百年里，一个凡人死得很容易。',
    text: (s) => `第一个百年，征粮、流民、水寇、大水。一个凡人死得很容易。

你倒下的地方，第二天就有别人走过去。

${BACK}`,
  },
  {
    id: 'e_mortal_farmer', name: '东田三亩', priority: 61, tier: '凡',
    condition: `origin == "farmer" && ${MORTAL} && age >= lifespan`,
    summary: '你种了一辈子田。',
    text: (s) => `你在东田种了一辈子灵田，跟阿衡家隔着一条沟。修水沟、存粮、躲大水，一年年过去。

你死的时候是秋天，田里的稻子刚收完。

${BACK}`,
  },
  {
    id: 'e_mortal_merchant', name: '市集行商', priority: 61, tier: '凡',
    condition: `origin == "merchant" && ${MORTAL} && age >= lifespan`,
    summary: '你做了一辈子小买卖。',
    text: (s) => `你跟着陆清跑过几趟货，后来自己在青石镇市集支了个药摊。粮价涨的年头少赚，药价涨的年头多赚。

账本攒了一箱子。你死后，儿子拿去当了柴。

${BACK}`,
  },
  {
    id: 'e_mortal_hunter', name: '山中猎户', priority: 61, tier: '凡',
    condition: `origin == "hunter" && ${MORTAL} && age >= lifespan`,
    summary: '你打了一辈子猎。',
    text: (s) => `你在山里打了一辈子猎，认得每一条兽道。逃难的人进山，都是你领的路。

最后一次进山，你没有再出来，就坐在常歇脚的那块石头上。

${BACK}`,
  },
  {
    id: 'e_mortal_scholar', name: '塾中先生', priority: 61, tier: '凡',
    condition: `origin == "scholar" && ${MORTAL} && age >= lifespan`,
    summary: '你教了一辈子书。',
    text: (s) => `你在青石镇开了个小塾，教孩子认字、算账。教过的孩子里，有人后来做了里正，有人去临河管了仓。

你死后，他们凑钱给你立了块碑，碑上的字写得都不太好。

${BACK}`,
  },
  {
    id: 'e_mortal_orphan', name: '渡口船工', priority: 61, tier: '凡',
    condition: `origin == "orphan" && ${MORTAL} && age >= lifespan`,
    summary: '你在河湾渡撑了一辈子船。',
    text: (s) => `何六收留了你，教你撑船。他老了以后，河湾渡的船归你撑。

你渡过征粮的官差，渡过逃难的流民，也渡过不说话的行客。最后一趟，你把船拴好，坐在缆桩边上睡着了。

${BACK}`,
  },
  {
    id: 'e_mortal_wanderer', name: '五域行脚', priority: 61, tier: '黄',
    condition: `${MORTAL} && char.visitedLocations.length >= 5`,
    summary: '你没有修行，却一步步走过了五域的许多地方。',
    text: (s) => `你没有修为，靠两只脚走过了很多地方。雁门的雪，沙州的井，宁京的城门，铜谷的炉火，你都见过。

回到青石镇时，你已经走不动了。你把一路记的事讲给渡口的孩子们听。

${endLine(s)}`,
  },

  // —— 轮回与前世手札 ——
  {
    id: 'e_loop_handbook', name: '手札满卷', priority: 85, tier: '地',
    condition: 'count("handbook_size") >= 60',
    summary: '前世手札上记了六十件大事，你翻了一遍又一遍。',
    text: (s) => `前世手札上已经记了六十多件大事：哪一年，哪里，出了什么事，结局怎样。

你每一世醒来，先把它从头翻一遍，再起身去渡口。

${endLine(s)}`,
  },
  {
    id: 'e_loop_foretold', name: '前世所记', priority: 84, tier: '玄',
    condition: 'count("foretold") >= 10',
    summary: '这一世，前世记下的事一件件应验了十次。',
    text: (s) => `前世所记，今日应验。这句话你在心里说过十次。

每一次你都比别人早一步。

${endLine(s)}`,
  },
  {
    id: 'e_loop_tenth', name: '十世同渡', priority: 82, tier: '玄',
    condition: 'meta.cycle >= 10',
    summary: '你在河湾渡醒来了十次。',
    text: (s) => `这是你第十次在河湾渡醒来。何六解缆的动作，你闭着眼都能说出下一步。

十世里，你做过农夫、商人、修士、水寇。每一世都从同一条河开始。

${endLine(s)}`,
  },
  {
    id: 'e_loop_yuejie', name: '以下克上', priority: 80, tier: '地',
    condition: 'count("yuejie_kills") >= 20',
    summary: '你这一世越阶斩杀过二十个以上的对手。',
    text: (s) => `你总在打比自己境界高的人，也总能赢。二十多回，回回都有人不信。

${endLine(s)}`,
  },
  {
    id: 'e_loop_onehit', name: '一招定生死', priority: 79, tier: '玄',
    condition: 'count("one_hit_kills") >= 100',
    summary: '死在你一招之下的对手，过了一百个。',
    text: (s) => `死在你一招之下的人，过了一百个。后来没人再敢跟你动手，你也就很少出手了。

${endLine(s)}`,
  },
  {
    id: 'e_loop_legacy', name: '三世遗泽', priority: 78, tier: '玄',
    condition: 'legacyNotes.length >= 3 && realm >= 4',
    summary: '你带着前世留下的三样东西，走得比前世更远。',
    text: (s) => `这一世开局，你手里就有前世留下的东西：一部功法，一件宝物，或者一缕道韵。

你靠它们少走了很多弯路，走得比前世更远。

${endLine(s)}`,
  },

  // —— 宿敌线终局（文本由 events/nemesis.js 提供，此处只收录） ——
  ...NEMESIS_ENDINGS,

  // —— 兜底：任何死因都说得通 ——
  {
    id: 'e_lonely', name: '独行', priority: 61, tier: '黄',
    condition: 'age >= lifespan && !flag("道侣") && sect() == "" && counters.disciples == 0 && realm >= 1',
    summary: '一个人来，一个人走。',
    text: (s) => `你这一世没有道侣，没有门派，没有徒弟。一个人来，一个人走。

${endLine(s)}

${BACK}`,
  },
];

export const ENDING_BY_ID = Object.fromEntries(ENDINGS.map((e) => [e.id, e]));

export function pickEnding(state, ctx) {
  const sorted = [...ENDINGS].sort((a, b) => b.priority - a.priority);
  for (const e of sorted) {
    try {
      if (ctx.compile(e.condition)(ctx.ctx)) return e;
    } catch (err) {
      console.warn('结局条件错误', e.id, err.message);
    }
  }
  return ENDINGS[ENDINGS.length - 1];
}
