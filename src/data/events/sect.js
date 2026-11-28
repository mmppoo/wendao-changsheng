/** 宗门内部事件：同门、长老、任务、禁地、大比、宗门战争。 */
export const SECT_EVENTS = [
  {
    id: 'ev_sect_bully', title: '同门', pool: 'sect', tier: 1, weight: 10, minRealm: 0,
    require: 'char.sectId != null',
    text: '你在演武场练剑，三个内门弟子围了过来。\n\n「新来的？」为首的那个用剑鞘敲了敲你的肩，「这地方，内门弟子先练。」',
    choices: [
      {
        label: '让开', hint: '忍',
        outcome: { text: '你退到角落。他们练了一个时辰，走的时候故意撞了你一下。\n\n你扶着墙，把这一下记住了。', effects: { attrs: { 道心: 2 }, demon: 2 } },
      },
      {
        label: '不让', hint: '战斗 · 筑基修士',
        combat: {
          enemy: 'cultivator',
          win: { text: '你把他打趴下了。围观的人很多，没有人说话。\n\n从那天起，演武场没人再赶你。', effects: { exp: 150, reputation: 30, contribution: 60, attrs: { 根骨: 2 } } },
          lose: { text: '你被打断了三根肋骨，在床上躺了半个月。', effects: { hp: -50, injury: 2, reputation: -10 } },
        },
      },
      {
        label: '说：一起练？', hint: '魅力检定',
        roll: {
          p: 0.45, attrs: { 魅力: 0.012, 道心: 0.005 },
          success: { text: '他愣了一下，然后笑了：「行啊。」\n\n那天你们练到天黑。他叫周野，后来成了你在宗门里唯一的朋友。', effects: { attrs: { 魅力: 2 }, relation: { 周野: 30 }, flag: { 周野: true } } },
          fail: { text: '「谁跟你一起。」他推了你一把。你退了两步，没倒。\n\n他看了你一眼，走了。', effects: { attrs: { 道心: 1 } } },
        },
      },
    ],
  },
  {
    id: 'ev_sect_mission', title: '除妖', pool: 'sect', tier: 2, weight: 9, minRealm: 0,
    require: 'char.sectId != null',
    text: '任务堂的牌子上新挂了一条：\n\n「西山黑风寨，妖修三人，劫掠商道。取首级者，贡献三百。」\n\n下面已经围了七八个人，没人揭。',
    choices: [
      {
        label: '揭榜', hint: '战斗 · 邪修',
        combat: {
          enemy: 'rogue',
          win: {
            text: '你提着三颗头回山。任务堂的老执事数了数，在册子上画了个勾。\n\n「不错。」他说。这是他第一次夸人。',
            effects: { contribution: 300, stones: 200, exp: 200, reputation: 40, karma: 15 },
          },
          lose: { text: '你被那三人围住，靠一张神行符才逃回来。榜被撕了，换了个更强的师兄去。', effects: { hp: -60, injury: 2, reputation: -10 } },
        },
      },
      {
        label: '找个人一起', hint: '分贡献，但更稳',
        require: 'flag("周野")', requireHint: '没有信得过的同门',
        outcome: { text: '周野二话不说就跟你走了。你们两个人打三个，赢得不算漂亮，但都活着回来了。\n\n贡献对半分，他请你喝了一顿酒。', effects: { contribution: 180, stones: 120, exp: 120, relation: { 周野: 20 }, attrs: { 道心: 2 } } },
      },
      { label: '不接', hint: '', outcome: { text: '你转身走了。榜在那儿挂了七天，最后被一个外门弟子揭了。\n\n他没能回来。', effects: { demon: 2 } } },
    ],
  },
  {
    id: 'ev_sect_library', title: '藏经阁', pool: 'sect', tier: 2, weight: 8, minRealm: 0,
    require: 'char.sectId != null',
    text: '藏经阁三层以上要真传令牌。你只有外门令牌。\n\n守阁的老头在打瞌睡，钥匙就挂在他腰上。',
    choices: [
      {
        label: '偷钥匙', hint: '风险',
        roll: {
          p: 0.4, attrs: { 气运: 0.01, 根骨: 0.005 },
          success: {
            text: '你摸上三楼，在最里层的架子上找到一卷没有名字的功法。\n\n翻开第一页，只有一行字：此法不传外门，因为外门弟子看不懂。\n\n你看懂了。',
            effects: { items: ['jiuzhuan_gong'], expPct: 0.2, flag: { 读遍藏经阁: true }, achievements: ['a_library'] },
          },
          fail: { text: '老头的手抓住了你的手腕。他没睁眼，只说了一句：「明天开始，扫三个月的阁。」', effects: { contribution: -50, attrs: { 道心: 2 } } },
        },
      },
      {
        label: '求他', hint: '魅力',
        roll: {
          p: 0.5, attrs: { 魅力: 0.012 },
          success: { text: '老头睁开一只眼，看了你很久，然后解下钥匙：「看完放回去。别弄折了页角。」', effects: { expPct: 0.15, attrs: { 悟性: 2 }, items: ['changchun_gong'] } },
          fail: { text: '「规矩就是规矩。」他闭上眼，又睡了。', effects: {} },
        },
      },
      {
        label: '老老实实做任务换令牌', hint: '贡献 +200',
        outcome: { text: '你在任务堂泡了两个月，攒够了贡献。\n\n拿到真传令牌那天，你忽然觉得三楼的楼梯也没那么高。', effects: { contribution: 200, attrs: { 道心: 2 } } },
      },
    ],
  },
  {
    id: 'ev_sect_elder', title: '长老', pool: 'sect', tier: 3, weight: 6, minRealm: 1,
    require: 'char.sectId != null && char.sectRank >= 1',
    text: '长老院传你去问话。\n\n你跪在蒲团上，长老背对着你，正在给一盆兰花浇水。\n\n「你最近进境很快。」他说，「快到让我有点不安。」',
    choices: [
      {
        label: '如实说', hint: '',
        outcome: { text: '你把修炼的法子一五一十说了。长老听完，转过身，眼睛里有一点笑意。\n\n「很好。宗门里最怕的不是天才，是藏着的天才。」\n\n他给了你一瓶丹药。', effects: { items: ['pozhang_dan'], contribution: 150, attrs: { 道心: 3 } } },
      },
      {
        label: '说自己只是运气好', hint: '谦',
        outcome: { text: '「运气。」长老重复了一遍，笑了，「你信吗？」\n\n他没再问，挥手让你走了。', effects: { attrs: { 道心: 2 }, reputation: 10 } },
      },
      {
        label: '反问他为何不安', hint: '胆量',
        roll: {
          p: 0.4, attrs: { 道心: 0.01, 魅力: 0.008 },
          success: { text: '长老沉默了很久，然后说：「因为我年轻时也这么快。」\n\n他从袖子里取出一枚玉简，「拿着。别走我的路。」', effects: { items: ['jiuzhuan_gong'], attrs: { 悟性: 4 }, flag: { 长老托付: true } } },
          fail: { text: '「放肆。」一股威压压下来，你趴在地上，半天起不来。', effects: { hp: -30, reputation: -20 } },
        },
      },
    ],
  },
  {
    id: 'ev_sect_traitor', title: '叛徒', pool: 'sect', tier: 3, weight: 6, minRealm: 1,
    require: 'char.sectId != null',
    text: '半夜，你看见一个熟悉的身影翻出后山墙。\n\n是周野。他怀里抱着一个包裹，正往山下走。\n\n宗门规定：私通外敌者，废去修为，逐出山门。',
    choices: [
      {
        label: '拦住他', hint: '道心',
        outcome: {
          text: '他看见你，站住了。\n\n「我娘被血魔宗抓了。」他说，「他们要《青云诀》前三层。」\n\n你看着他，他也看着你。后山的风很冷。',
          effects: { attrs: { 道心: 2 } },
          goto: 'ev_sect_traitor_2',
        },
      },
      {
        label: '放他走', hint: '背叛宗门',
        require: 'flag("周野")', requireHint: '你们不熟',
        outcome: { text: '你侧身让开路。他走过你身边时，低声说了句「谢谢」。\n\n第二天宗门查人，你说没看见。\n\n从那以后，你的名字在宗门档案里多了一行小字。', effects: { flag: { 放走周野: true }, karma: 10, demon: 5, reputation: -20 } },
      },
      {
        label: '报告长老', hint: '',
        outcome: { text: '长老带人追下山，在天亮前把周野带了回来。\n\n他被废了修为，跪在山门口，一直看着你。\n\n你没有回头。', effects: { contribution: 400, reputation: 20, attrs: { 道心: -3 }, demon: 8, flag: { 周野被废: true } } },
      },
    ],
  },
  {
    id: 'ev_sect_traitor_2', title: '后山墙下', pool: 'branch', tier: 3, weight: 0,
    text: '他把包裹放在地上，慢慢跪了下来。\n\n「你要抓我，我不还手。」他说，「但我娘等不了。」\n\n包裹散开，里面是半部手抄的功法，纸边被翻得起了毛。',
    choices: [
      {
        label: '帮他救娘', hint: '凶险 · 得罪宗门',
        outcome: { text: '你们连夜下山。在血魔宗的分坛里，你找到了他娘——一个被吊在梁上的老妇人，还有一口气。\n\n你们把她救了出来。回山时，天已经亮了。\n\n宗门知道了。你被罚跪三个月，但没被逐出。', effects: { contribution: -500, reputation: -30, karma: 40, attrs: { 道心: 5 }, relation: { 周野: 60 }, flag: { 救周野娘: true } } },
      },
      {
        label: '让他把功法留下，人走', hint: '两全？',
        outcome: { text: '他犹豫了很久，把包裹推给你，然后翻墙走了。\n\n你把功法交给长老，说是自己追回来的。\n\n长老看了你很久，收下了。', effects: { contribution: 300, reputation: 15, demon: 5, flag: { 周野逃走: true } } },
      },
      {
        label: '按门规办', hint: '',
        outcome: { text: '你把他押到执法堂。他没有反抗，也没有再看你。\n\n三个月后，你听说他死在了思过崖。', effects: { contribution: 500, reputation: 30, demon: 12, karma: -30, flag: { 周野死: true } } },
      },
    ],
  },
  {
    id: 'ev_sect_arena', title: '内门大比', pool: 'sect', tier: 3, weight: 7, minRealm: 1,
    require: 'char.sectId != null && char.sectRank >= 1',
    once: false,
    text: '十年一度的内门大比。擂台下站满了人。\n\n签筒传到你面前，你抽到的对手是——上一届的第三名。',
    choices: [
      {
        label: '上台', hint: '战斗 · 上届大比第三名',
        combat: {
          enemy: 'jindan_elder', displayName: '上届大比第三名',
          win: {
            text: '你赢了。台下静了一瞬，然后炸开。\n\n长老在台上站起来，第一次正眼看你。',
            effects: { contribution: 800, reputation: 100, exp: 500, counter: { arena_win: 1 }, title: '大比魁首', flag: { 大比魁首: true } },
          },
          lose: { text: '你输了，输得很干脆。下台时有人拍你的肩：「十年后再来。」', effects: { exp: 200, contribution: 100, attrs: { 道心: 3 } } },
        },
      },
      {
        label: '认输', hint: '保存实力',
        outcome: { text: '你抱拳认输。台下有人嘘你。\n\n你走下台，觉得这也没什么。', effects: { attrs: { 道心: 2 }, reputation: -10 } },
      },
    ],
  },
  {
    id: 'ev_sect_forbidden', title: '禁地', pool: 'sect', tier: 4, weight: 4, minRealm: 2,
    require: 'char.sectId != null',
    once: true,
    text: '后山禁地，宗门立了三块碑，每块都写着「入者死」。\n\n但今夜，禁地深处有光。',
    choices: [
      {
        label: '进去', hint: '大机缘 · 大凶险',
        roll: {
          p: 0.4, attrs: { 气运: 0.012, 道心: 0.006 },
          success: {
            text: '禁地深处是一间石室，石室里只有一面墙，墙上刻满了名字。\n\n你在最下面找到一行小字：「后来者，替我看看外面。」\n\n你把手按在墙上。墙上的名字一个一个亮了。',
            effects: { expPct: 0.8, attrs: { 悟性: 6, 道心: 5 }, lifespan: 50, title: '禁地归来', flag: { 禁地: true } },
          },
          fail: { text: '你触动了禁制。三道剑气从墙里射出，你躲过两道，第三道穿过了你的肩。', effects: { hp: -80, injury: 3, demon: 8 } },
        },
      },
      {
        label: '报告长老', hint: '',
        outcome: { text: '长老带人封了禁地。他看了你一眼，说：「你很好。」\n\n但你总觉得，他说这话时有点可惜。', effects: { contribution: 300, attrs: { 道心: 1 } } },
      },
      { label: '回去睡觉', hint: '', outcome: { text: '你回去睡了。第二天听说禁地里的光消失了，没人知道那是什么。', effects: { attrs: { 道心: 1 } } } },
    ],
  },
  {
    id: 'ev_sect_war', title: '宗门之战', pool: 'sect', tier: 4, weight: 5, minRealm: 2,
    require: 'char.sectId != null && char.sectRank >= 2',
    once: true,
    text: '血魔宗倾巢来犯，山门外的护山大阵已经裂了三道口子。\n\n掌门站在阵眼上，回头看了你们一眼：\n\n「真传以上，随我出阵。」',
    choices: [
      {
        label: '出阵', hint: '战斗 · 血魔宗弟子',
        combat: {
          enemy: 'blood_cult',
          win: {
            text: '你杀了三个血魔宗弟子。第四个人的刀砍在你背上时，援军到了。\n\n战后清点，宗门死了两百多人。你的名字被刻在英烈碑的旁边，活着的那一栏。',
            effects: { contribution: 2000, reputation: 300, exp: 1200, title: '守山者', flag: { 宗门之战: true }, achievements: ['a_kill_demon'] },
          },
          lose: { text: '你被一掌打下山崖。醒来时战争已经结束，宗门守住了，但你错过了后半场。', effects: { hp: -100, injury: 4, contribution: 500 } },
        },
      },
      {
        label: '守阵眼', hint: '保住阵，但不出彩',
        outcome: { text: '你在阵眼守了三天三夜，把裂开的阵纹一道道补回去。\n\n没有人看见你做了什么。但阵没破。', effects: { contribution: 800, attrs: { 悟性: 3, 道心: 4 }, flag: { 守阵: true } } },
      },
      {
        label: '带人撤走', hint: '保命 · 声望受损',
        outcome: { text: '你带着三十几个外门弟子从后山撤了。\n\n宗门守住了。回来以后，没有人再叫你师兄。', effects: { reputation: -100, karma: -20, demon: 8, flag: { 临阵脱逃: true } } },
      },
    ],
  },
  {
    id: 'ev_sect_pill_room', title: '丹房', pool: 'sect', tier: 2, weight: 7, minRealm: 0,
    require: 'char.sectId === "danxia"',
    text: '丹房的炉子又炸了。你冲进去时，师兄满脸黑灰，正对着一炉废丹发呆。\n\n「第七次了。」他说，「火候总是差一点。」',
    choices: [
      {
        label: '帮他看火', hint: '丹道',
        roll: {
          p: 0.6, attrs: { 悟性: 0.01 },
          success: { text: '你盯着炉火看了半日，忽然说：「停。」\n\n师兄手一抖，收了火。丹炉里躺着三枚浑圆的丹。\n\n「你……」他看了你半天，「你怎么知道？」\n\n你也说不清。他把其中一枚塞进了你手里。', effects: { counter: {}, items: ['zhuji_dan'], attrs: { 悟性: 3 }, contribution: 100 } },
          fail: { text: '你说「停」的时候，炉子正好炸了。药渣糊了你一脸。', effects: { hp: -20, attrs: { 悟性: 1 } } },
        },
      },
      {
        label: '自己开一炉', hint: '炼丹 · 消耗灵草',
        require: 'has("lingcao")', requireHint: '没有灵草',
        cost: { item: 'lingcao' },
        roll: {
          p: 0.55, attrs: { 悟性: 0.01 },
          success: { text: '你炼成了。虽然只有一枚，但那是你自己炼的。', effects: { items: ['yinqi_dan'], exp: 60, flag: { 炼丹: true } } },
          fail: { text: '炸炉。你的眉毛少了一半。', effects: { hp: -15, flag: { 炼丹: true } } },
        },
      },
    ],
  },
];
