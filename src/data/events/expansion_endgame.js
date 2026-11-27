/**
 * 终局事件池：九州风云、绝地尽头、识海深处。
 * 单节点，tier 4–5，minRealm 2–7。四十条，全是「已经走到这一步的人」才会遇见的事。
 */
export const ENDGAME_EXPANSION = [
  // ───────────────────────── pool: world ─────────────────────────
  {
    id: 'ev_e_sect_war', title: '宗门大战', pool: 'world', tier: 5, weight: 5, minRealm: 4,
    text: '太玄与万兽在云上撞了一夜。天亮时两座山门各少一角，云里的血落下来，落在凡人的屋顶上，像一场脏雨。\n\n掌门传话：三日之内，金丹以上者赴前线。你摸了摸自己的手，这双手昨天还在替人抄经，墨迹没洗净。',
    choices: [
      {
        label: '随军上云道', hint: '一月 · 守第七段',
        cost: { month: 1 },
        roll: {
          p: 0.5, attrs: { 道心: 0.006 },
          success: { text: '你守在第七段云道上。身后是同门，身前是兽潮，你只记得挥剑，挥到手腕发麻。收兵时有人替你数了：你挡了二十九次，一次没退。', effects: { contribution: 300, reputation: 20, attrs: { 道心: 4 }, expPct: 0.4, flag: { 宗门大战: true } } },
          fail: { text: '云道断在你脚下。你被两只妖鹤叼着摔进山谷，肋骨断了三根。醒来时战事已毕，没有人记得你站在哪一段。', effects: { hp: -90, injury: 2, demon: 8, relation: { 同门: -10 } } },
        },
      },
      {
        label: '背伤者下山', hint: '一月 · 无功',
        cost: { month: 1 },
        outcome: { text: '你背了十一个人下山。最后一个死在半路，你没有放下他，一直背到山脚的义庄。登记名册的执事问他的名字，你答不上来。', effects: { karma: 25, attrs: { 道心: 3 }, reputation: 10, relation: { 同门: 15 } } },
      },
      {
        label: '闭门不问', hint: '道心不稳',
        outcome: { text: '你把洞府的门从里面顶上，坐了七天。第七天云散了，战事结束。同门回来时没有人和你说话，你也没有问谁没有回来。', effects: { attrs: { 道心: -5 }, demon: 10, relation: { 同门: -25 } } },
      },
    ],
  },
  {
    id: 'ev_e_dynasty_end', title: '王朝末年', pool: 'world', tier: 4, weight: 6, minRealm: 3,
    text: '京城换了第三个皇帝，年号还没改完，城门已经关了两个月。城外的田荒着，路上有兵抢粮，也有修士抢兵。\n\n你站在官道边，看着一面旗落下来，风把它吹到沟里，没有人去扶。你自己也没有去扶，你在等人来收。',
    choices: [
      {
        label: '开仓分粮', hint: '一月 · 得罪守军',
        cost: { month: 1 },
        outcome: { text: '你劈开第三座粮仓时，守军已经跑完了。分米的人排了两里，没有人抢，排到天黑还剩半仓。你走的时候听见有人叫你菩萨，你没回头。', effects: { karma: 40, reputation: 25, attrs: { 道心: 3 } } },
      },
      {
        label: '带走十个孩子', hint: '两月 · 未必都活',
        cost: { month: 2 },
        roll: {
          p: 0.45, attrs: { 悟性: 0.006, 气运: 0.008 },
          success: { text: '十个孩子你带出去七个。三个死在路上，你用剑挖了坑，坑不深。活下来的七个在山下学种地，后来都记得你，只有两个记得你的名字。', effects: { karma: 35, attrs: { 道心: 4 }, exp: 300, flag: { 带出孩子: true } } },
          fail: { text: '第七天你们被溃兵围住。你杀开一条路，回头时孩子只剩三个。那三个不哭，只是拉着你的衣角，拉得很紧。', effects: { karma: 15, hp: -50, demon: 12 } },
        },
      },
      {
        label: '径直出城', hint: '与你无关',
        outcome: { text: '你从人群边上走过去。有个妇人拽住你的袖子，你抽开了。走出十里还能听见城里的声音，你没有回头。', effects: { karma: -15, demon: 6, attrs: { 道心: -3 } } },
      },
    ],
  },
  {
    id: 'ev_e_demon_south', title: '妖族南下', pool: 'world', tier: 5, weight: 5, minRealm: 5,
    text: '妖族南下，先到的不是妖，是风。风里有腥味，吹过一遍，田里的稻子都朝北边倒了。\n\n镇上的人还在收拾行李。你数了一下，能走的有三百多，能打的有七个，其中一个瘸着腿。风又吹了一遍，这回稻子没有倒，因为它们已经倒了。',
    choices: [
      {
        label: '守镇门', hint: '一战 · 妖将',
        combat: {
          enemy: 'demon_general',
          win: { text: '妖将的角断在镇门上，他退了三步，然后整支队伍都退了。镇里的人从门缝里看你，没有人敢先出来。你在门口坐到天亮。', effects: { reputation: 40, karma: 30, attrs: { 道心: 4 }, expPct: 0.5, flag: { 守过南镇: true } } },
          lose: { text: '你被撞进半座牌楼。镇门破了，妖没有进来——它们绕过镇子，往更大的城去了。你数了数活下来的人，一百一十。', effects: { hp: -100, injury: 3, karma: 10, demon: 10 } },
        },
      },
      {
        label: '引妖向北', hint: '一月 · 拿自己当饵',
        cost: { month: 1 },
        roll: {
          p: 0.4, attrs: { 根骨: 0.006, 气运: 0.008 },
          success: { text: '你带着那面破旗跑了二百里，妖跟了二百里。最后你把旗插在无人的荒滩上，妖在滩上转了三圈，散了。你躺下来，喘得像破风箱。', effects: { karma: 35, lifespan: -5, attrs: { 根骨: 3 }, expPct: 0.35 } },
          fail: { text: '第三天它们不追了。你回头看，它们掉头回了镇子。你赶回去时镇子已经烧了一半，剩下的一半正在烧。', effects: { hp: -60, karma: -10, demon: 15 } },
        },
      },
      {
        label: '只带一个人走', hint: '心里有数',
        outcome: { text: '你带走了瞎眼的老铁匠。他说他不走，你说你走。他一路没有说话，到了安全的地方才问：「镇上的人呢？」你说不知道。', effects: { karma: 5, demon: 8, relation: { 老铁匠: 30 } } },
      },
    ],
  },
  {
    id: 'ev_e_buddha_dao', title: '佛道之争', pool: 'world', tier: 4, weight: 5, minRealm: 4,
    text: '天音寺的钟敲了七天，青云门的剑阵也布了七天。两边都说自己是为了九州，两边都在等对方先退。\n\n山下的村子把门关死，谁也不站。村口的老槐树上挂着一口空钟，钟舌被人取走了。',
    choices: [
      {
        label: '站佛门那边', hint: '天音寺弟子 · 一月',
        require: 'char.sectId == "tianyin"', requireHint: '钟不认外人',
        cost: { month: 1 },
        outcome: { text: '你在钟下坐了七日，替寺里挡了三次剑气。第七日钟响，青云的剑阵退了三里。方丈把手按在你头顶，什么也没说，掌心的温度留了很久。', effects: { contribution: 400, attrs: { 道心: 6 }, relation: { 天音寺: 30 }, flag: { 佛道之争: true } } },
      },
      {
        label: '站道门那边', hint: '青云门弟子 · 一月',
        require: 'char.sectId == "qingyun"', requireHint: '阵不认外人',
        cost: { month: 1 },
        outcome: { text: '你在剑阵的第三门守了七日，替阵眼补了三次气。第七日钟停了，天音的僧人收拾经卷下山，走得很慢。掌门拍了拍你的肩，说：「记你一功。」', effects: { contribution: 400, attrs: { 悟性: 4 }, relation: { 青云门: 30 }, flag: { 佛道之争: true } } },
      },
      {
        label: '迁走村民', hint: '两月 · 两边都会记你',
        cost: { month: 2 },
        outcome: { text: '你一户一户敲门，把二百多口人迁到三十里外的废镇。第八天两派在山上打了一场，死了十一个。山下没有人死，也没有人知道你做过什么。', effects: { karma: 45, reputation: 10, attrs: { 道心: 4 }, relation: { 天音寺: -10, 青云门: -10 } } },
      },
    ],
  },
  {
    id: 'ev_e_alliance_call', title: '仙盟征召', pool: 'world', tier: 5, weight: 4, minRealm: 6,
    text: '仙盟的使者不带剑，带一册名册。名册翻到你的名字，他就把笔递过来，笔尖沾的不是墨，是朱砂。\n\n「签了，你的名字归九州。」他说，「不签，也归。」名册上已经有很多名字，有几个被划掉了。',
    choices: [
      {
        label: '签名', hint: '从此有召必应',
        outcome: { text: '你签了。朱砂落在纸上不散，像一小块干掉的血。他把名册合上，说：「半年后有人来请你。」你问请去哪里，他说到时候就知道了。', effects: { contribution: 200, reputation: 35, flag: { 仙盟在册: true }, attrs: { 道心: -2 } } },
      },
      {
        label: '不签', hint: '他会再来',
        outcome: { text: '你把笔放回他手里。他看了看你，把名册翻到另一页，用指甲在你名字旁边划了一道浅浅的痕。「不签的人，我们另有一册。」他走了。', effects: { karma: -5, demon: 8, flag: { 仙盟另册: true } } },
      },
      {
        label: '先问他一句', hint: '一月 · 悟性',
        cost: { month: 1 },
        roll: {
          p: 0.45, attrs: { 悟性: 0.008 },
          success: { text: '你问他名册上被划掉的人去了哪里。他沉默了很久，说：「填进去了。」你没听懂，他指了指天。你把笔接过来，签了，也问清了那一册的编号。', effects: { attrs: { 悟性: 4 }, reputation: 20, flag: { 仙盟在册: true, 知盟中事: true }, exp: 400 } },
          fail: { text: '他只笑了一下，说：「问了，就不好签了。」他把笔收回去，转身走了。你站在原地，忽然觉得那道朱砂的红色有点眼熟。', effects: { demon: 12, attrs: { 道心: -3 } } },
        },
      },
    ],
  },
  {
    id: 'ev_e_old_friend', title: '旧友重逢', pool: 'world', tier: 4, weight: 6, minRealm: 3,
    text: '酒肆里那个人背对着你，肩胛骨凸出来，像两片没收好的刀。他回头，先笑，笑得比二十年前慢。\n\n「你还活着。」他说，「我也活着。这就算成了。」他面前摆着两个碗，一个空的。',
    choices: [
      {
        label: '陪他喝完这壶', hint: '一月 · 什么也不问',
        cost: { month: 1 },
        outcome: { text: '你们喝到打烊。他说了很多人名，一半你不记得，一半已经死了。走的时候他扶了一下墙，说下次还在这儿。你后来去过很多次，他没再来。', effects: { relation: { 旧友: 30 }, attrs: { 道心: 3 }, demon: -6, flag: { 旧友重逢: true } } },
      },
      {
        label: '问他这些年去哪了', hint: '悟性 · 他未必肯说',
        roll: {
          p: 0.5, attrs: { 悟性: 0.006 },
          success: { text: '他说了。说得很平，像在讲别人的事。说到最后他停住，抬头看你：「你别去。」你答应了。三年后你还是去了，那地方和他讲的一样。', effects: { attrs: { 悟性: 3, 道心: 2 }, exp: 350, flag: { 知旧友旧事: true } } },
          fail: { text: '他把碗推到一边，说：「说了你就得替我办。」你没接话。他笑了一下，自己把话头绕开了，绕得很熟练。', effects: { relation: { 旧友: -5 }, demon: 5 } },
        },
      },
      {
        label: '装作不认识', hint: '走开',
        outcome: { text: '你从他身后走过去，走到门口，听见他叫了你的名字，很轻，像试探。你没有停。出门时风很大，你把领口拉紧了。', effects: { relation: { 旧友: -40 }, attrs: { 道心: -4 }, demon: 8 } },
      },
    ],
  },
  {
    id: 'ev_e_enemy_arrives', title: '仇家上门', pool: 'world', tier: 5, weight: 5, minRealm: 4,
    text: '他站在你洞府门口，站了三天。第三天你开门，他说的第一句话不是「报仇」，是「你老了」。\n\n他身后跟着两个金丹，一个提着刀，一个空着手。空手的那个一直在看你的院子，像在估价。',
    choices: [
      {
        label: '接下这一战', hint: '一战 · 旧怨',
        combat: {
          enemy: 'cultivator',
          win: { text: '他倒下时抓住你的衣襟，说了一句你听不清的话。空手的那个转身就走，走得很快。你把刀捡起来，插在他坟前，刀柄朝上。', effects: { expPct: 0.55, attrs: { 道心: 4 }, reputation: 25, karma: -10, items: [{ id: 'liaoshang_dan', qty: 2 }] } },
          lose: { text: '他没杀你。他把你按在地上，说：「我要你活着，慢慢想。」他走了，带走了你院子里那株养了八十年的树。', effects: { hp: -110, injury: 3, demon: 15, attrs: { 道心: -4 } } },
        },
      },
      {
        label: '请他进来坐', hint: '一月 · 谈',
        cost: { month: 1 },
        roll: {
          p: 0.5, attrs: { 道心: 0.006, 悟性: 0.004 },
          success: { text: '你们谈了一夜。天亮时他起身，说：「这事到我这代为止。」他走得比来时慢。你送到门口，看见他鞋底磨穿了一个洞。', effects: { karma: 30, attrs: { 道心: 5 }, relation: { 仇家: 20 }, flag: { 解仇: true } } },
          fail: { text: '他掀了桌子。刀劈在你左肩上，不深。他说：「你连道歉都不肯说一句。」走的时候把门也砸了。', effects: { hp: -70, injury: 2, karma: -10, relation: { 仇家: -30 } } },
        },
      },
      {
        label: '递他一壶酒', hint: '什么也不说',
        outcome: { text: '他接过酒，看了很久，没有喝。他把酒倒在门口的地上，说：「敬我师父。」然后带着人走了。地上的酒渗得很慢。', effects: { karma: 15, attrs: { 道心: 2 }, relation: { 仇家: 10 }, demon: -4 } },
      },
    ],
  },
  {
    id: 'ev_e_disciple_trouble', title: '徒弟出事', pool: 'world', tier: 4, weight: 5, minRealm: 5,
    text: '你徒弟的名字被人写在告示上，罪名是杀同门。告示贴了三处，每一处都盖着宗门的印。\n\n他跪在堂下，不辩，只抬头看你一眼，然后低下头去。堂上坐着七个人，其中三个当年是你带进门的。',
    choices: [
      {
        label: '以自身担保', hint: '耗贡献 · 宗门',
        cost: { month: 1 },
        require: 'char.attrs.道心 >= 20', requireHint: '道心不足，话没有分量',
        outcome: { text: '你把名字按在保书上，按了三次才按实。七个人里有两个当场起身走了。堂上最后判：禁足三年，逐出内门。他磕头时，你没有扶。', effects: { contribution: -500, relation: { 徒弟: 45 }, attrs: { 道心: 4 }, reputation: -15, flag: { 保过徒弟: true } } },
      },
      {
        label: '自己去查', hint: '两月 · 悟性',
        cost: { month: 2 },
        roll: {
          p: 0.45, attrs: { 悟性: 0.008 },
          success: { text: '你查到第七天，查出一件旧事：死的那个人先动的手，为的是一炉丹。你把证据摆在堂上，没有人说话。放人的时候，徒弟在你门口跪了一夜。', effects: { attrs: { 悟性: 4 }, relation: { 徒弟: 50 }, karma: 25, flag: { 徒弟清白: true } } },
          fail: { text: '你查到第三十天，线索断了。断得很干净，干净得像是有人提前扫过。判决照旧。行刑那天下着雨，你没有去。', effects: { demon: 15, attrs: { 道心: -4 }, relation: { 徒弟: -30 } } },
        },
      },
      {
        label: '按门规处置', hint: '门规比人重',
        outcome: { text: '你说了一个字：斩。堂上没有人反驳你。行刑时你在场，他看着你，没有喊。剑落之后你在原地站了很久，血渗进砖缝，后来一直没洗掉。', effects: { contribution: 300, attrs: { 道心: 6 }, relation: { 徒弟: -100 }, demon: 12, karma: -15 } },
      },
    ],
  },
  {
    id: 'ev_e_lover_illness', title: '道侣旧疾', pool: 'world', tier: 5, weight: 5, minRealm: 4,
    text: '她咳了半年，咳到第七个月开始咳血。药王谷的人说这不是病，是道基上的一道旧裂，裂开的时候她自己都不知道。\n\n她把手缩进袖子，说：「别看。」袖子口有一点红，被她压住了。',
    choices: [
      {
        label: '以寿元换她', hint: '二十年 · 不留话',
        cost: { month: 1 },
        outcome: { text: '你在丹房坐了七日，把二十年的寿数一寸寸挪出去。她醒来时脸色好了，问你为什么白了一半头发。你说路上风大。她看了你很久，没有拆穿。', effects: { lifespan: -20, relation: { 道侣: 50 }, flag: { 道侣: true }, attrs: { 道心: 5 }, demon: -8 } },
      },
      {
        label: '去求一炉九转丹', hint: '三月 · 耗丹材',
        cost: { month: 3, item: 'xisui_dan' },
        outcome: { text: '你把洗髓丹当药引押在炉里，守了三个月。开炉时丹只有一枚，比指甲盖小。她服下，咳声停了。剩下的药渣你收进袖里，一直留着。', effects: { removeItems: ['xisui_dan'], items: ['jiuzhuan_dan'], relation: { 道侣: 40 }, flag: { 道侣: true }, stones: -400 } },
      },
      {
        label: '什么也不做，陪着她', hint: '她的时间不多了',
        outcome: { text: '你搬了张椅子坐在她床边，坐了两年。第二年冬天她说话开始费劲，就用手在你掌心写字，写得很慢。最后一个字没写完，手就停了。', effects: { relation: { 道侣: 60 }, attrs: { 道心: 6 }, demon: 10, flag: { 道侣: true, 道侣已故: true }, karma: 10 } },
      },
    ],
  },
  {
    id: 'ev_e_old_friend_death', title: '故人之死', pool: 'world', tier: 4, weight: 4, minRealm: 5,
    text: '他的死讯是一只纸鹤送来的。纸鹤飞到一半就散了，落下来的纸片上只剩两个字：已殁。\n\n你去的时候坟已经封了。坟前放着一柄剑，剑柄上刻着你的名字，是他替你刻的，刻得很深，像怕你不认。',
    choices: [
      {
        label: '掘开看一眼', hint: '有风险 · 悟性',
        roll: {
          p: 0.45, attrs: { 悟性: 0.006, 气运: 0.006 },
          success: { text: '棺里没有尸首，只有一件叠好的衣服和半块玉。玉上刻着一个日期，是三个月后。你把玉收起来，把土填回去，填得比原来还平整。', effects: { attrs: { 悟性: 3 }, flag: { 故人未死: true, 见过死期: true }, demon: 8, exp: 400 } },
          fail: { text: '棺盖掀开的一瞬，里面积了三十年的尸气扑上来。你退了两步，还是吸进去一口。那晚你梦见他在笑，笑得很年轻。', effects: { hp: -60, demon: 15, attrs: { 道心: -3 } } },
        },
      },
      {
        label: '在坟前坐一夜', hint: '一月 · 他会来',
        cost: { month: 1 },
        outcome: { text: '后半夜他坐到你旁边，还是那副样子。他说：「我给你算过，你还有多少年。」他说了一个数，你记住了。天亮时坟前只有你一个人的影子。', effects: { attrs: { 道心: 5 }, flag: { 见过死期: true }, relation: { 故人: 20 }, demon: -10, lifespan: 5 } },
      },
      {
        label: '把剑拔走', hint: '留个念想',
        outcome: { text: '剑拔出来时带出一截木屑，是剑鞘烂在土里的。你把剑背在身上，走了三里才发现剑穗是他妻子编的，编得很笨。你没有解下来。', effects: { items: ['canjian'], attrs: { 道心: 2 }, relation: { 故人: 10 }, demon: 3 } },
      },
    ],
  },
  {
    id: 'ev_e_homecoming', title: '衣锦还乡', pool: 'world', tier: 4, weight: 6, minRealm: 3,
    text: '村口的老槐树还在，树干上你小时候刻的名字被树皮包住，只露出一个偏旁。\n\n你穿着外面的衣服走进村子，没有人认出你。有个孩子仰头问：「仙师找谁？」他的眉眼有点像你三叔。',
    choices: [
      {
        label: '报出自己的名字', hint: '一月 · 旧事重提',
        cost: { month: 1 },
        outcome: { text: '有人想起来，是个瘸腿的老汉。他说你小时候偷过他家的梨。你说记得。他笑得眼泪都出来了，拉着你去看你家的老屋，屋子已经塌了半边，他还留着钥匙。', effects: { attrs: { 道心: 4 }, karma: 15, relation: { 故里: 30 }, flag: { 还乡: true } } },
      },
      {
        label: '住一夜再走', hint: '带她一起来',
        cost: { month: 1 },
        outcome: { text: '你们在村口的祠堂借宿。她替你缝补衣角，村里的妇人隔着窗看她，说仙师的道侣真好看。她听见了，低头笑，针脚歪了一针。', effects: { relation: { 道侣: 25 }, flag: { 道侣: true, 还乡: true }, attrs: { 道心: 3 }, demon: -6 } },
      },
      {
        label: '留一袋灵石就走', hint: '不惊动人',
        outcome: { text: '你把灵石放在祠堂的供桌上，压了一张字条：修桥。出村时天没黑，你回头看了一眼，槐树在风里动，像在点头。', effects: { stones: -300, karma: 30, reputation: 10, attrs: { 道心: 2 } } },
      },
    ],
  },
  {
    id: 'ev_e_hometown_ruins', title: '故里成墟', pool: 'world', tier: 5, weight: 5, minRealm: 4,
    text: '村子没有了。地基还在，一圈一圈排着，像被谁用刀刻在地上。井还在，井水是黑的，照不出人。\n\n你在其中一圈地基上站了很久。那是你家的位置，门槛石还在，被磨得中间凹下去一块。',
    choices: [
      {
        label: '追查是谁做的', hint: '两月 · 未必查得到',
        cost: { month: 2 },
        roll: {
          p: 0.4, attrs: { 悟性: 0.008, 气运: 0.006 },
          success: { text: '你顺着车辙查了两百里，查到一个收魂的散修。他说他只收死人，人不是他杀的。杀人的那伙人往北去了。你记下方向，没有追。', effects: { attrs: { 悟性: 3 }, exp: 400, flag: { 仇家在北: true }, demon: 8 } },
          fail: { text: '你查了两个月，只查出一件事：村里死的那天，有人在十里外看见过一道剑光。剑光是什么颜色，那人说不清。', effects: { demon: 15, attrs: { 道心: -3 }, exp: 200 } },
        },
      },
      {
        label: '把井填了', hint: '一月 · 亲手',
        cost: { month: 1 },
        outcome: { text: '你搬了一整天石头。填到一半，井底有东西浮上来，是一只木碗，碗底刻着你娘的名字。你把碗洗干净，收进袖里，剩下的土一锹一锹填完。', effects: { karma: 30, attrs: { 道心: 5 }, items: ['liaoshang_dan'], demon: -10 } },
      },
      {
        label: '立一块无字碑', hint: '不写名字',
        outcome: { text: '你从后山背了一块青石，立在村口。刻字的时候停了很久，最后一笔也没刻。路过的商队问这是什么碑，你说：「这是没人记得的地方。」', effects: { karma: 20, attrs: { 道心: 4 }, reputation: 5, flag: { 无字碑: true } } },
      },
    ],
  },
  {
    id: 'ev_e_number_one', title: '天下第一', pool: 'world', tier: 5, weight: 4, minRealm: 7,
    text: '天下第一这四个字，是别人替你写在剑冢石壁上的。写完之后，来试剑的人一年比一年多，一年比一年弱。\n\n今年没有人来了。你在石壁前站了三天，风吹得字有点淡。石壁下堆着别人留下的剑，插得很深，剑柄都朝着你。',
    choices: [
      {
        label: '把字凿了', hint: '你不再需要它',
        cost: { month: 1 },
        outcome: { text: '你凿了两天。石屑落在脚边，堆成一小堆。凿完最后一道横，石壁上只剩一块空白，比原来干净。你退后看了很久，觉得这面墙终于像一面墙。', effects: { attrs: { 道心: 8 }, expPct: 0.3, flag: { 飞升抉择: true, 凿去天下第一: true }, karma: 10 } },
      },
      {
        label: '等一个人来', hint: '三月 · 等不到',
        cost: { month: 3 },
        outcome: { text: '你在剑冢守了三个月。来的只有风和一个找羊的孩子。孩子问你在这儿做什么，你说等人。他说：「人不会来的，我娘也不来。」你笑了一下。', effects: { attrs: { 道心: 5, 悟性: 2 }, lifespan: 3, flag: { 飞升抉择: true }, demon: -8 } },
      },
      {
        label: '下山去问还有谁', hint: '一问之下',
        roll: {
          p: 0.35, attrs: { 悟性: 0.006 },
          success: { text: '你走了九个州，问了十一个人。最后一个是个卖豆腐的老妇，她说：「你要问谁最能打？那没意思。你要问谁最不舍得死，我算一个。」你在她摊前站了很久。', effects: { attrs: { 悟性: 5, 道心: 4 }, expPct: 0.35, flag: { 飞升抉择: true } } },
          fail: { text: '你走了九个州，没有一个人敢接你的话。他们低头让路，让得很熟练。你走到最后忽然明白：天下第一不是打赢的，是没人敢打的。这个明白让你很难受。', effects: { attrs: { 道心: -5 }, demon: 12, expPct: 0.2 } },
        },
      },
    ],
  },
  {
    id: 'ev_e_eve_ascension', title: '飞升前夜', pool: 'world', tier: 5, weight: 3, minRealm: 7,
    text: '明天卯时，天门开一刻。该交代的都交代完了，该还的都还了。屋子里只剩一张桌子，两盏灯，一盏是你的，一盏不是。\n\n她坐在对面，没有说话，也没有走。灯芯爆了一下，她的影子晃了晃。',
    choices: [
      {
        label: '留下来', hint: '不走那一步',
        outcome: { text: '你把灯吹了。黑暗里她问：「不后悔？」你说：「我算过了，天上没有你。」她没有再问。第二天卯时，天门开了一刻，山下的人说那天云很厚，什么也没看见。', effects: { flag: { 飞升抉择: true, 道侣: true, 留世: true }, relation: { 道侣: 60 }, attrs: { 道心: 6 }, lifespan: 30, karma: 20 } },
      },
      {
        label: '独自上天', hint: '她不会拦',
        outcome: { text: '你把那盏灯留给她，自己走到院子里站到天亮。卯时天门开，你踏上去，没有回头。走到一半你听见身后有灯灭的声音，很轻，也很清楚。', effects: { flag: { 飞升抉择: true, 独升: true }, attrs: { 道心: 8, 悟性: 4 }, expPct: 1.2, relation: { 道侣: -40 }, demon: 8 } },
      },
      {
        label: '带她一起走', hint: '要她答应 · 有风险',
        require: 'flag("道侣")', requireHint: '没有可以带的人',
        roll: {
          p: 0.35, attrs: { 道心: 0.006, 气运: 0.008 },
          success: { text: '她握住你的手，说：「我早想去了，只怕拖累你。」卯时你们一起踏上天门。她的脚在第一级台阶上顿了一下，第二级就稳了。云在下面合拢，像合上一本书。', effects: { flag: { 飞升抉择: true, 双升: true }, relation: { 道侣: 80 }, attrs: { 道心: 10 }, expPct: 1.5, lifespan: 50 } },
          fail: { text: '天门只容一人。她上到第三级时被推了回来，退得很急。你伸手抓她，只抓到一角袖子。袖子在你手里，人已经落在云下了。', effects: { flag: { 飞升抉择: true, 独升: true }, relation: { 道侣: -60 }, demon: 30, attrs: { 道心: -6 }, expPct: 0.8 } },
        },
      },
    ],
  },

  // ───────────────────────── pool: wild ─────────────────────────
  {
    id: 'ev_e_immortal_rift', title: '仙界裂缝', pool: 'wild', tier: 5, weight: 4, minRealm: 6,
    text: '天上有一道裂缝，不宽，一臂左右。缝里没有黑，是很干净的白，白得让人想走进去。\n\n裂缝下面生着一片草，草都朝着裂缝长，长到三尺就断了，断口很齐，像被谁用尺量过。你伸手比了一下，裂缝比你的臂展窄一点，也深得多。',
    choices: [
      {
        label: '走进去', hint: '一脚之差',
        roll: {
          p: 0.3, attrs: { 气运: 0.01, 道心: 0.005 },
          success: { text: '里面没有上下，也没有远近。你走了七步，看见一整片没有名字的地方，那里的灵气浓得能拧出水。你退出来时，指甲缝里全是白的。', effects: { attrs: { 悟性: 8, 神识: 6 }, expPct: 1.0, lifespan: 20, flag: { 入裂缝: true } } },
          fail: { text: '白光把你这三年的修为照了一遍，照完就收走了。你退出来，境界还在，只是空了一块，像被谁挖走一勺。', effects: { expPct: -0.5, hp: -70, demon: 18, lifespan: -10 } },
        },
      },
      {
        label: '以神识探它', hint: '两月 · 消耗极大',
        cost: { month: 2, mp: 80 },
        outcome: { text: '你的神识伸进去，被拉得很长，长到你自己都数不清有多远。回来时它带回来一句话，不是人话，可你听懂了：门开着，但不开给你。', effects: { attrs: { 神识: 6, 悟性: 4 }, expPct: 0.5, flag: { 裂缝有语: true }, lifespan: -5 } },
      },
      {
        label: '记下位置，回去报', hint: '一月 · 换个人情',
        cost: { month: 1 },
        outcome: { text: '你把位置画在图上，交给仙盟。三个月后他们派人来封了那道缝，封得很认真。来人给了你一瓶丹，说：「这种事，越少人知道越好。」', effects: { items: [{ id: 'jiuzhuan_dan', qty: 1 }], reputation: 25, contribution: 200, karma: -5, flag: { 报裂缝: true } } },
      },
    ],
  },
  {
    id: 'ev_e_thunder_sea', title: '雷海', pool: 'wild', tier: 4, weight: 6, minRealm: 4,
    text: '雷海没有边。云是紫的，雷在云里走，走得比人慢。海面上浮着一层灰，是被雷劈碎的骨头，踩上去陷下去半寸。\n\n灰下面有东西在动。它一动，整片雷就往下压一寸。你把灵力收到最里，还是被压得退了半步。',
    choices: [
      {
        label: '借雷炼体', hint: '道心检定 · 伤身',
        roll: {
          p: 0.45, attrs: { 道心: 0.006, 根骨: 0.004 },
          success: { text: '第一道雷把你劈得跪进灰里，第二道你就站住了。到第九道，雷光顺着骨头走了一圈，走得很顺。你抬头，云里那东西退了。', effects: { attrs: { 根骨: 6, 道心: 3 }, hp: -40, lifespan: 10, expPct: 0.4 } },
          fail: { text: '雷不挑地方。你护住了心脉，护不住左手。抬起来时五个指头各朝一个方向，很久以后才慢慢归位。', effects: { hp: -90, injury: 2, demon: 10 } },
        },
      },
      {
        label: '捡一根雷木', hint: '一月 · 灰里翻',
        cost: { month: 1 },
        outcome: { text: '你在灰里翻了三天，翻出一截雷木，黑得像炭，握着却发烫。带出雷海的那天它裂了，裂口里还有一线紫光在走，走到尽头才熄。', effects: { items: ['leimu'], attrs: { 根骨: 2 }, demon: 4, karma: -5 } },
      },
      {
        label: '绕过去', hint: '不碰',
        outcome: { text: '你沿着雷海的边走了十天。第十天风停了，雷也停了，海面安静得像一块铁。你回头看了一眼，觉得它其实一直在等你走。', effects: { attrs: { 道心: 3 }, exp: 300, lifespan: 3 } },
      },
    ],
  },
  {
    id: 'ev_e_god_corpse', title: '古神尸骸', pool: 'wild', tier: 5, weight: 4, minRealm: 6,
    text: '山谷里躺着一具尸体，长三十里。肋骨一根根架着，架成一条能走的路。骨头上有字，字大到要退后百步才看得全。\n\n他死了很久，可指甲还在长，长得卷了起来。你顺着山坡走了半圈才找到他的头，脸朝下埋着，埋得很深。',
    choices: [
      {
        label: '顺着肋骨走过去', hint: '走到尽头',
        roll: {
          p: 0.4, attrs: { 道心: 0.006, 悟性: 0.005 },
          success: { text: '你走了两个时辰，走到心口的位置。那里有一个洞，不大，能容一个人坐下。你坐进去，听见很远的地方有人在数数，数到七就停了。', effects: { attrs: { 悟性: 6, 道心: 5 }, expPct: 0.6, lifespan: 15, flag: { 坐神心: true } } },
          fail: { text: '走到一半，肋骨上的字开始动。它们从骨头上爬到你身上，你没有痛，只是三天之后发现自己忘了一个人的名字，怎么想也想不起来。', effects: { attrs: { 悟性: 2, 神识: -4 }, demon: 15, lifespan: -10 } },
        },
      },
      {
        label: '把骨上的字拓下来', hint: '两月 · 悟性',
        require: 'char.attrs.悟性 >= 26', requireHint: '字太大，看不懂',
        cost: { month: 2 },
        outcome: { text: '你拓了四十七张。拓到第三十张时看出这是一份名单，名单上全是死人的名字，最后一个被涂掉了，涂得很用力。你把自己的名字添上去，看看合不合。', effects: { attrs: { 悟性: 7, 神识: 5 }, expPct: 0.7, flag: { 神骨名单: true }, demon: 10 } },
      },
      {
        label: '取一截指骨', hint: '贪 · 有报',
        outcome: { text: '你用剑砍了半个时辰才砍下一节，指骨比铁重，抱着走路要弯着腰。走出山谷的那天，你听见身后有指甲刮石头的声音，很慢，一直跟着你。', effects: { items: ['xuantie'], karma: -25, demon: 18, attrs: { 根骨: 3 }, flag: { 取神骨: true } } },
      },
    ],
  },
  {
    id: 'ev_e_ownerless_cave', title: '无主洞天', pool: 'wild', tier: 5, weight: 5, minRealm: 5,
    text: '洞天没有主人，也没有门。你走进去时，里面下着雨，雨落在身上是温的。\n\n药田还整整齐齐，七垄，垄沟里的水在流。石桌上摆着一副没下完的棋，白子还剩三颗。药田边摆着一双草鞋，摆得很正，鞋底还是湿的。',
    choices: [
      {
        label: '收药田', hint: '一月 · 药还活着',
        cost: { month: 1 },
        outcome: { text: '你采了两垄，留下五垄。采的时候发现每株药下面都压着一枚小石子，石子上有字。你把石子按原位摆好，药田看起来和没人动过一样。', effects: { items: [{ id: 'lingcao', qty: 4 }, { id: 'huiling_dan', qty: 2 }], karma: 10, attrs: { 悟性: 2 } } },
      },
      {
        label: '下完那盘棋', hint: '悟性 · 白子只剩三颗',
        roll: {
          p: 0.4, attrs: { 悟性: 0.008 },
          success: { text: '你执黑，下了三手，棋盘自己应了三手。第七手时你看出这不是棋，是一道推演。下到第五十四手，雨停了，药田的水也不再流。', effects: { attrs: { 悟性: 6, 神识: 4 }, expPct: 0.5, flag: { 完局: true }, lifespan: 8 } },
          fail: { text: '你下错一手，棋盘上所有的子同时倒了。雨大起来，药田里的水开始往外漫。你退出洞天时，那里已经积了半尺深。', effects: { demon: 12, attrs: { 道心: -4 }, hp: -30 } },
        },
      },
      {
        label: '把洞天封上', hint: '留给下一个走运的人',
        cost: { month: 1 },
        outcome: { text: '你在入口布了七道禁制，布到最后一道停了手，把禁制改得松散些。你想，总会有人进来，最好是个饿着的散修。走出去时雨声还在身后。', effects: { karma: 35, attrs: { 道心: 5 }, flag: { 封洞天: true }, exp: 300 } },
      },
    ],
  },
  {
    id: 'ev_e_time_loop', title: '时间回环', pool: 'wild', tier: 5, weight: 4, minRealm: 5,
    text: '这一条街你已经走了第四遍。卖面的在同一个位置抬头，说同一句话：「客官，面要辣吗？」\n\n第三遍你答了不辣。第四遍你还没开口，他先说了：「你昨天来过。」他的眼睛没有动。',
    choices: [
      {
        label: '掀了他的摊子', hint: '看它还能不能重来',
        roll: {
          p: 0.4, attrs: { 道心: 0.006 },
          success: { text: '热汤泼了一地，街角的孩子被烫哭。哭声一起，整条街停了半息，然后所有人同时转过头看你。第五遍没有再开始。你走出去，街在你身后散了。', effects: { attrs: { 道心: 4, 悟性: 3 }, expPct: 0.4, demon: 10, karma: -10, flag: { 破环: true } } },
          fail: { text: '你伸手的一瞬，汤已经回到碗里，摊子摆得整整齐齐。他抬头，又说：「客官，面要辣吗？」这次他的声音和你自己的一模一样。', effects: { demon: 20, attrs: { 道心: -5 }, lifespan: -5 } },
        },
      },
      {
        label: '问他今天是初几', hint: '不动声色',
        outcome: { text: '他想了想，说：「初七。」你前天问过，他也答初七。你把手按在桌上，桌面是温的。你忽然明白：这条街不是重复，是从来没有过去。', effects: { attrs: { 悟性: 4, 道心: 3 }, counter: { 回环: 1 }, exp: 400, flag: { 察觉回环: true } } },
      },
      {
        label: '坐下来吃完这碗面', hint: '一月 · 吃亏的是时间',
        cost: { month: 1 },
        outcome: { text: '面很烫，你吃得很慢。吃完放下筷子，街上的人少了一半。第二碗端上来时你已经不饿了，还是吃完了。第三碗之后街空了，只剩他和你。', effects: { attrs: { 道心: 5 }, demon: -10, counter: { 回环: 3 }, lifespan: -3, expPct: 0.3 } },
      },
    ],
  },
  {
    id: 'ev_e_sword_river', title: '剑意长河', pool: 'wild', tier: 5, weight: 5, minRealm: 5,
    text: '河床里流的不是水，是剑意。很细，比头发细，淌过去时把两岸的石头都磨成了镜面。\n\n有人在河边立了一块碑，碑上写：此河不渡人，渡剑。碑脚堆着几十柄断剑，插得很整齐。你蹲下去看那些断剑，断口都朝着一个方向，朝着下游。',
    choices: [
      {
        label: '以指试剑意', hint: '悟性 · 手会废',
        require: 'char.attrs.悟性 >= 24', requireHint: '看不细，摸到就是断',
        roll: {
          p: 0.45, attrs: { 悟性: 0.01 },
          success: { text: '你把指尖探进河里，剑意从指腹进去，从肘弯出来。你顺着它的路走了一遍，走完指尖没有伤，指甲薄了一层，薄得透光。', effects: { attrs: { 悟性: 6, 根骨: 3 }, expPct: 0.5, items: ['wujian_jue'], flag: { 试剑意: true } } },
          fail: { text: '剑意不认手，只认剑。你的三根手指留在了河里，伤口很齐，像被刀切过的豆腐。你捏着手站了很久，河还在流。', effects: { hp: -80, injury: 2, attrs: { 道心: -3 }, demon: 8 } },
        },
      },
      {
        label: '涉水过河', hint: '一月 · 伤身',
        cost: { month: 1 },
        outcome: { text: '你走了一炷香。上岸时衣袍成了布条，身上没有一道口子，可你摸到自己的经脉里有细细的凉意在走，走了很多年都没停。', effects: { hp: -60, attrs: { 根骨: 4 }, expPct: 0.35, injury: 1, flag: { 涉剑河: true } } },
      },
      {
        label: '在碑后刻一行字', hint: '留个话给后人',
        outcome: { text: '你刻：渡不过就别渡。刻完觉得太凶，又添了三个字：可以等。等什么你没写。刻完你退后看了看，字被剑意磨得很浅。', effects: { attrs: { 道心: 4, 悟性: 2 }, karma: 15, flag: { 剑河留字: true } } },
      },
    ],
  },
  {
    id: 'ev_e_star_road', title: '星路', pool: 'wild', tier: 5, weight: 3, minRealm: 7,
    text: '星路只在没有月的夜里出现，从东山铺到天上，每一级都是一颗星的影子。走上去不响，也不冷。\n\n走到第十一级，你回头，看见九州在下面，像一枚落在水里的棋子。云在脚下慢慢地转，转得比你想的慢，像有人在下面推。',
    choices: [
      {
        label: '继续往上走', hint: '走到哪算哪',
        roll: {
          p: 0.35, attrs: { 道心: 0.008, 悟性: 0.006 },
          success: { text: '你走到第三十七级，脚下忽然没有了路，也没有了天。你在那里站了很久，什么也没发生。等你再低头，九州已经不见了，你脚下是一片新的地。', effects: { attrs: { 道心: 10, 悟性: 6 }, expPct: 1.0, flag: { 飞升抉择: true, 星路尽头: true }, lifespan: 40 } },
          fail: { text: '第二十级开始变软，像踩在湿泥上。你退回来时天已经亮了，星路散成一层薄雾。你数了数，这一夜过去了十一年。', effects: { lifespan: -11, demon: 12, attrs: { 道心: 3 } } },
        },
      },
      {
        label: '停在第十一级看', hint: '一月 · 只看看',
        cost: { month: 1 },
        outcome: { text: '你坐下来，看了一整月。看山，看水，看一座城从亮到灭。你没有想什么，也没有不想什么。下山的路上你觉得身上轻了，轻得不像自己。', effects: { attrs: { 道心: 7, 悟性: 3 }, demon: -15, lifespan: 10, flag: { 星路坐: true } } },
      },
      {
        label: '折返', hint: '路不属于你',
        outcome: { text: '你一级一级走下东山。走到山脚回头，星路还在，正在慢慢淡下去。你站了一会儿，忽然想起很多年前有人问过你：想不想上去。当时你说想。', effects: { attrs: { 道心: 5 }, karma: 15, demon: -8, exp: 500 } },
      },
    ],
  },
  {
    id: 'ev_e_return_ruins', title: '归墟', pool: 'wild', tier: 5, weight: 4, minRealm: 5,
    text: '归墟不是深渊，是退潮后的滩。滩上搁着沉船的骨头、断掉的剑，还有几具没有烂完的仙人的身体。\n\n潮水每三百年回来一次。你到的时候，滩上还有一处水印没干。你踩着滩走了半里，脚下的东西一直在轻轻响，像在说话。',
    choices: [
      {
        label: '翻找沉船', hint: '有风险 · 东西未必能拿',
        roll: {
          p: 0.45, attrs: { 气运: 0.008 },
          success: { text: '第三艘船的舱底压着一只铁匣，锁早烂了。匣里是九枚丹药，药气还在。你收好匣子往岸上走，身后的船自己塌了，塌得很轻。', effects: { items: [{ id: 'jiuzhuan_dan', qty: 2 }, { id: 'tianjie_dan', qty: 1 }], karma: -5, expPct: 0.4 } },
          fail: { text: '你踏进船舱时，脚下那块甲板认了主，死死咬住你的靴子。你脱了靴子才出来，出来时潮水已经在涨，涨得比你想的快。', effects: { hp: -80, injury: 2, demon: 10, lifespan: -5 } },
        },
      },
      {
        label: '等一次潮', hint: '三月 · 看得见死期',
        cost: { month: 3 },
        outcome: { text: '第三个月的最后一天，潮来了。水是黑的，漫过滩，漫过你的膝盖，停在腰。水里映出你的脸，很老，比你现在老得多。潮退时那张脸还在水里，看着你。', effects: { attrs: { 道心: 6, 悟性: 4 }, flag: { 见过死期: true }, demon: 12, lifespan: -3 } },
      },
      {
        label: '读仙人身上的字', hint: '悟性',
        require: 'char.attrs.悟性 >= 22', requireHint: '字在皮上，读不出',
        cost: { month: 1 },
        outcome: { text: '那些字是刻在皮肉里的，写完又被愈合盖住，只剩浅浅一层。你读了三天，读出一段口诀，也读出一句抱怨：这里太安静了。', effects: { attrs: { 悟性: 5, 神识: 4 }, items: ['changchun_gong'], expPct: 0.45 } },
      },
    ],
  },
  {
    id: 'ev_e_meteor_iron', title: '天外陨铁', pool: 'wild', tier: 4, weight: 7, minRealm: 3,
    text: '陨铁落在麦田里，砸出一个三丈深的坑。坑边的麦子焦了一圈，圈外的麦子照常黄。\n\n村民围着坑不敢下。铁还热着，热得把空气顶起来，看什么都隔着一层抖。有个孩子想扔石头，被他娘按住了手。',
    choices: [
      {
        label: '下坑取铁', hint: '有风险 · 烫',
        roll: {
          p: 0.55, attrs: { 根骨: 0.006 },
          success: { text: '你用湿布裹手，把铁抠出来，抠了半个时辰。抱上来时布已经焦了，掌心起了一串泡。铁很沉，沉得像里面还压着别的东西。', effects: { items: ['xuantie'], hp: -30, attrs: { 根骨: 2 }, exp: 250 } },
          fail: { text: '铁在坑底翻了个身。你被燎到半边脸，眉毛烧没了，眼睛疼了七天才睁开。睁开时坑里已经没有铁了，只剩一圈黑。', effects: { hp: -80, injury: 1, demon: 6 } },
        },
      },
      {
        label: '以灵力镇住它', hint: '一月 · 慢慢凉',
        cost: { month: 1, mp: 50 },
        outcome: { text: '你在坑边坐了一个月，每天压一层灵力。铁凉下来那天，坑里长出了一株草，长得很快，一夜就到了膝盖。你把草连根挖走，铁留给了村子。', effects: { items: ['lingcao'], karma: 20, attrs: { 悟性: 2 }, relation: { 村民: 25 }, exp: 300 } },
      },
      {
        label: '教他们埋回去', hint: '不属于人的东西',
        cost: { month: 1 },
        outcome: { text: '你教他们用土一层层填，填完在上面踩实。老农问会不会不吉利，你说会。他们还是填了。第二年那块地麦子长得比别处高半尺。', effects: { karma: 30, attrs: { 道心: 3 }, reputation: 10, flag: { 埋陨铁: true } } },
      },
    ],
  },
  {
    id: 'ev_e_demon_grave', title: '万妖坟', pool: 'wild', tier: 5, weight: 5, minRealm: 4,
    text: '万妖坟是一道很长的沟，沟里插满骨。风从沟头灌进去，从沟尾出来时变成了低吼，一年只响一次。\n\n今年它响了。沟里有东西站了起来，站起来时，骨头在互相打招呼。你数了数，站起来的有七个，最高的那个还在长。',
    choices: [
      {
        label: '迎上去', hint: '一战 · 妖将',
        combat: {
          enemy: 'demon_general',
          win: { text: '它倒下时散成了一地骨头，骨头里有东西在滚，是一枚内丹。你捡起来，掌心烫了一下。沟里的低吼停了，今年不会再响。', effects: { items: ['jiuzhuan_dan'], expPct: 0.55, attrs: { 根骨: 4 }, reputation: 20, flag: { 平妖坟: true } } },
          lose: { text: '它把你按在骨堆上，看了你很久，然后松手走了。你躺在那堆骨头里，听见它们在说话，说的不是妖语，是你家乡的方言。', effects: { hp: -100, injury: 3, demon: 20 } },
        },
      },
      {
        label: '找坟心', hint: '两月 · 悟性',
        cost: { month: 2 },
        roll: {
          p: 0.4, attrs: { 悟性: 0.008 },
          success: { text: '坟心在沟尾第三道弯，是一块没有名字的石。你把灵力探进去，里面是空的，空得像一口井。你在井底摸到一柄断了半截的剑，剑上有妖血，干了很久。', effects: { items: ['canjian'], attrs: { 悟性: 4 }, expPct: 0.4, flag: { 得坟心剑: true } } },
          fail: { text: '你走错了三道弯。第三道弯里全是活的骨，它们不咬人，只跟着你走，跟了整整两天。你出来时鞋底磨穿了。', effects: { demon: 12, hp: -40, attrs: { 道心: -3 } } },
        },
      },
      {
        label: '退出沟外', hint: '不惹',
        outcome: { text: '你退到沟外，坐到那声低吼散尽。散尽之前它变了调，变得像哭。你听着，忽然想起你杀过的第一只妖，那时它也是这样叫的。', effects: { attrs: { 道心: 4 }, demon: -8, karma: 10, exp: 300 } },
      },
    ],
  },
  {
    id: 'ev_e_broken_palace', title: '残破仙宫', pool: 'wild', tier: 5, weight: 4, minRealm: 6,
    text: '仙宫塌了半边，另外半边还悬在云上，靠一根断柱撑着。宫里没有尘，桌上有茶，茶还是热的。\n\n有人在檐下走过，脚步很轻，转过去就不见了。你追到廊尽头，那里只有一面没有框的镜子。',
    choices: [
      {
        label: '追那个影子', hint: '看清楚是谁',
        roll: {
          p: 0.4, attrs: { 悟性: 0.006, 气运: 0.008 },
          success: { text: '你在第三进院子追上他。他回过头，你看见一张和你一样的脸，只是眉心有一点朱砂。他说：「别走错了。」然后就散了，散得像烟。', effects: { attrs: { 悟性: 6, 道心: 5 }, expPct: 0.6, flag: { 见仙宫影: true } } },
          fail: { text: '你追了三进院子，脚下的地忽然少了一块。你抓住檐角，吊了半炷香才爬上来。上来时茶已经凉了，凉得很快。', effects: { hp: -60, demon: 10, attrs: { 道心: -3 } } },
        },
      },
      {
        label: '坐下喝茶', hint: '一月 · 茶还热',
        cost: { month: 1 },
        outcome: { text: '茶是苦的，苦得很正。你喝完一盏，壶自己满了。喝到第七盏，你听懂了檐角的风声，那是一段很老的曲子，唱的是有人在这里等过谁。', effects: { attrs: { 道心: 6, 悟性: 3 }, demon: -12, lifespan: 8, expPct: 0.3 } },
      },
      {
        label: '取殿中的法器', hint: '贪 · 宫里有人看着',
        outcome: { text: '你拿了那面镜。走出殿门时听见身后有人叹了一口气，很轻。镜子里从此多了一个人，站在你身后半步，你回头时他不在，不回头时他在。', effects: { items: ['huxin_fu'], karma: -20, demon: 15, attrs: { 神识: 3 }, flag: { 仙宫镜: true } } },
      },
    ],
  },
  {
    id: 'ev_e_cloud_market', title: '云上集市', pool: 'wild', tier: 4, weight: 6, minRealm: 3,
    text: '云上集市每月开一次，摊子摆在云里，买卖不用灵石，用记忆。一段好记忆换一瓶丹，一段坏记忆换一张符。\n\n有个摊子只收一样东西：你还记得的最后一个亲人。摊主是个很老的女子，一直在数线。',
    choices: [
      {
        label: '卖一段记忆', hint: '换丹 · 忘了就没了',
        outcome: { text: '你卖了一段七岁的雪。钱货两清之后你站在原地想了很久，想自己为什么要站在这儿。手里多了一瓶丹，瓶是温的。你把丹收好，走了。', effects: { items: ['xisui_dan'], attrs: { 悟性: -2 }, demon: 8, flag: { 卖记忆: true } } },
      },
      {
        label: '买一张神行符', hint: '两百灵石 · 一月',
        cost: { stones: 200, month: 1 },
        outcome: { text: '摊主收了灵石，把符卷好递给你，说：「这符不认路，只认急。」你问她怎么知道谁急。她指了指自己的眼睛，那双眼睛很干净。', effects: { stones: -200, items: ['shenxing_fu'], attrs: { 气运: 2 } } },
      },
      {
        label: '什么也不卖，看一天', hint: '一月 · 看人交易',
        cost: { month: 1 },
        outcome: { text: '你看了一天。有人卖掉一整个童年，换了一柄剑，走的时候笑得很开心。也有人什么也不卖，只在摊子间走来走去。散市时云落下去，你跟着落到地上。', effects: { attrs: { 道心: 4, 悟性: 3 }, demon: -6, exp: 400, flag: { 逛云市: true } } },
      },
    ],
  },
  {
    id: 'ev_e_ferry', title: '无人渡口', pool: 'wild', tier: 4, weight: 6, minRealm: 3,
    text: '渡口没有船，也没有人。一块木牌立在岸边：渡资随缘，只渡一次。\n\n你站到日落，水面起了雾，雾里有一点灯，正朝这边来。灯很慢，慢得像在等你改主意。江面很宽，宽到看不见对岸，只有雾在那儿一层层堆着。',
    choices: [
      {
        label: '上船', hint: '只渡一次',
        roll: {
          p: 0.5, attrs: { 道心: 0.006, 气运: 0.006 },
          success: { text: '船上没有艄公，桨自己划。你坐在船头，看见水里游过很多张脸，都是你认识的人，都不看你。靠岸时天亮了，岸不是你来时的岸。', effects: { attrs: { 悟性: 5, 道心: 4 }, expPct: 0.5, lifespan: -5, flag: { 渡过忘川: true } } },
          fail: { text: '船到河心停了。雾里有人问你：「你要去哪？」你答不上来。船就把你送了回来，靠岸时还是那个渡口，木牌上的字淡了一点。', effects: { demon: 12, attrs: { 道心: -3 }, lifespan: -3 } },
        },
      },
      {
        label: '等第二趟', hint: '两月 · 等不到',
        cost: { month: 2 },
        outcome: { text: '你等了两个月。灯来过三次，每次停在你面前，你都没有上。第四次它没有来。你在木牌背面刻了自己的名字，刻完就走，走得很干脆。', effects: { attrs: { 道心: 5 }, demon: -10, exp: 350, flag: { 不渡: true } } },
      },
      {
        label: '把木牌拔了', hint: '断了这条路',
        outcome: { text: '木牌埋得不深，一拔就出来了。牌底压着一枚铜钱，钱上的字磨平了。你把牌扔进河里，它沉得很慢。那晚没有灯来，以后也没有。', effects: { karma: -15, demon: 8, attrs: { 道心: -2 }, flag: { 断渡口: true } } },
      },
    ],
  },
  {
    id: 'ev_e_last_herb', title: '最后一株药', pool: 'wild', tier: 4, weight: 5, minRealm: 5,
    text: '整座山只剩这一株药。它长在崖缝里，叶子很小，边缘有点焦。山下的药师说，等它开花还要三十年。\n\n你的道侣只剩三年。风把崖缝里的土吹出来一点，落在你手背上。你碰了碰叶子，它把叶子卷起来，卷得很慢。',
    choices: [
      {
        label: '现在摘', hint: '药性不足 · 只能撑一阵',
        outcome: { text: '你摘了，连根。根是断的，断口渗出一线白。你拿回去煎了，她喝了，脸色好了一阵子，好到第二年春天。第三年药性过了，一切照旧。', effects: { items: ['liaoshang_dan'], relation: { 道侣: 20 }, flag: { 道侣: true, 摘药: true }, demon: 8, karma: -10 } },
      },
      {
        label: '等它开花', hint: '三月 · 未必等得到',
        cost: { month: 3 },
        roll: {
          p: 0.3, attrs: { 气运: 0.01 },
          success: { text: '第三个月的最后一天它开了，花了半夜，开完就枯。你捧着那朵枯花回去，她还有气。药煎出来是甜的，她喝完说：「像小时候的糖。」', effects: { items: ['jiuzhuan_dan'], relation: { 道侣: 45 }, flag: { 道侣: true, 药开花: true }, lifespan: 10 } },
          fail: { text: '第二个月末下了一场霜，花苞冻黑了。你在崖下站了一夜，什么也没做。回去的时候她已经不太认人了。', effects: { demon: 20, relation: { 道侣: -10 }, flag: { 道侣: true }, lifespan: -3 } },
        },
      },
      {
        label: '凿宽崖缝', hint: '让它活',
        cost: { month: 1 },
        outcome: { text: '你凿了三天，把缝凿宽两指，又搬来山泥填上。走的时候它还在，叶子抬起了一点。你不知道它会不会活，也不知道三年后你在哪里。', effects: { karma: 35, attrs: { 道心: 5 }, flag: { 留药: true }, demon: -10 } },
      },
    ],
  },

  // ───────────────────────── pool: inner ─────────────────────────
  {
    id: 'ev_e_dao_crack', title: '道心裂痕', pool: 'inner', tier: 5, weight: 5, minRealm: 4,
    text: '你在打坐时听见一声脆响，很轻，像瓷碗裂了一道。响过之后什么都还在，只是运功到膻中时会慢一下。\n\n慢的那一下里，你想起一件早就忘了的事，想起了那个人当时的表情。那件事很小，小到你当年一句话就压下去了。',
    choices: [
      {
        label: '停功查看', hint: '一月 · 慢慢找',
        cost: { month: 1 },
        outcome: { text: '你花了一个月，把那道裂找出来，只有半寸长，在道基的背面。你没有补它。裂着也能走，只是每次过气都会经过它，像经过一道旧门。', effects: { attrs: { 道心: 5, 悟性: 3 }, expPct: 0.3, flag: { 留裂: true } } },
      },
      {
        label: '强行压过去', hint: '痛 · 可能更糟',
        roll: {
          p: 0.4, attrs: { 道心: 0.008 },
          success: { text: '你把灵力压成一条线，从裂缝上碾过去。碾了三遍，裂缝合了，合得很死。代价是那年冬天你一直在咳，咳出来的东西是灰的。', effects: { attrs: { 道心: 6 }, hp: -50, lifespan: -8, demon: 8, expPct: 0.4 } },
          fail: { text: '灵力从裂缝里漏了下去，漏得很快。你收功时丹田空了一半，坐在原处发抖。那道裂缝宽了一倍，从背面绕到了正面。', effects: { hp: -70, demon: 20, attrs: { 道心: -6 }, expPct: -0.3 } },
        },
      },
      {
        label: '顺着裂缝去找那件事', hint: '悟性 ≥ 20 · 疼',
        require: 'char.attrs.悟性 >= 20', requireHint: '想不进去',
        cost: { month: 2 },
        outcome: { text: '你顺着裂口往里走，走到那年冬天。她站在门口，说的最后一句是「你别来了」。你当时点头了。你现在才知道，那句「别来」不是让你走。', effects: { attrs: { 悟性: 6, 道心: 4 }, demon: 15, expPct: 0.5, flag: { 见旧因: true } } },
      },
    ],
  },
  {
    id: 'ev_e_memory_edited', title: '记忆被改', pool: 'inner', tier: 4, weight: 6, minRealm: 3,
    text: '你记得七岁那年的雪，记得雪里有人牵着你的手。可你数了数，那只手的指节比你的多一个。\n\n你没有七岁那年的记忆，你只有这一段。它太清楚了，清楚得不像记得。雪里有个人蹲下来，替你把领口拢紧，拢了两次。',
    choices: [
      {
        label: '去找记忆的主人', hint: '两月 · 未必有此人',
        cost: { month: 2 },
        roll: {
          p: 0.4, attrs: { 悟性: 0.006, 气运: 0.008 },
          success: { text: '你按着雪和那双手的样子找了两个村子，找到一个老太太。她说她丢过一个孩子，丢了很多年。她握住你的手，指节刚好比你多一个。', effects: { attrs: { 道心: 5, 悟性: 3 }, karma: 25, relation: { 生母: 40 }, flag: { 寻到旧忆: true } } },
          fail: { text: '你找了两个月，没有人认得那段雪。回来时你发现那段记忆淡了一点，像被谁从远处看着，看得不高兴了。', effects: { demon: 12, attrs: { 悟性: 2 } } },
        },
      },
      {
        label: '把这段记忆删了', hint: '干净',
        cost: { month: 1 },
        outcome: { text: '你把它从识海里摘出来，它很小，像一粒米。摘掉之后你七岁就空了，空得整整齐齐。你试着想那年冬天冷不冷，想不出来。', effects: { attrs: { 道心: -4, 神识: 2 }, demon: 8, flag: { 删忆: true }, exp: 200 } },
      },
      {
        label: '留着它', hint: '不管它是谁的',
        outcome: { text: '你把它放回原处，摆正。是假的也好，别人的也好，你只有这一段。晚上你又梦见那场雪，牵你的手很冷，你没有挣开。', effects: { attrs: { 道心: 5 }, demon: -8, karma: 10, flag: { 留假忆: true } } },
      },
    ],
  },
  {
    id: 'ev_e_another_self', title: '看见另一个自己', pool: 'inner', tier: 5, weight: 4, minRealm: 5,
    text: '镜子里的人比你慢半息。你抬手，他后抬；你放下，他后放。你看了半个时辰，他忽然先抬了手。\n\n他开口，用的是你的声音：「你还有十一年。」说完他就回到你身后去了。他低着头，像在等你先动，等得很有耐心。',
    choices: [
      {
        label: '问他是谁', hint: '他未必答',
        roll: {
          p: 0.45, attrs: { 悟性: 0.008, 道心: 0.004 },
          success: { text: '他又慢半息，然后说：「我是没走成的那条路。」你问他那条路上有什么，他说：「有个人还在等你。」说完他把手放下，跟上你的动作。', effects: { attrs: { 悟性: 5, 道心: 5 }, flag: { 镜中人: true, 道侣: true }, expPct: 0.5 } },
          fail: { text: '他不答，只是重复那句话：「你还有十一年。」重复了七遍，一遍比一遍轻。第八遍时镜子里只剩你自己，脸色比你差。', effects: { demon: 15, attrs: { 道心: -3 }, flag: { 见过死期: true } } },
        },
      },
      {
        label: '打碎镜子', hint: '碎片会记住你',
        outcome: { text: '镜子碎成十一块，每一块里都有一个你，姿势各不一样。你扫起来扔了，后来在别处的铜镜、水面、刀背上又见过他们，都没有再说话。', effects: { hp: -20, demon: 12, attrs: { 道心: -5 }, flag: { 碎镜: true } } },
      },
      {
        label: '记下这十一年', hint: '一月 · 从今天算',
        cost: { month: 1 },
        outcome: { text: '你找了块木牌，写下今年，又写下十一年后。写完挂在你打坐的地方。你每天看一眼。看到第三年，木牌上的字被你的目光磨浅了。', effects: { attrs: { 道心: 6 }, flag: { 见过死期: true, 记死期: true }, lifespan: 6, demon: -10 } },
      },
    ],
  },
  {
    id: 'ev_e_demon_yield', title: '心魔让位', pool: 'inner', tier: 4, weight: 6, minRealm: 3,
    text: '心魔在你识海里坐了很多年，坐得比你还稳。今天它站起来，让出半个蒲团，说：「你坐。」\n\n它不笑了。它不笑的时候，和你很像，连嘴角往下压的弧度都一样。蒲团是黑的，坐上去不软也不硬，像坐在自己身上。',
    choices: [
      {
        label: '坐下', hint: '道心 · 它可能在骗你',
        roll: {
          p: 0.45, attrs: { 道心: 0.008 },
          success: { text: '你坐下，它退到一边站着。你们一起坐了一天一夜，谁也没有说话。天亮时它说：「你比我想的能坐。」然后它就淡了，淡到只剩一点影子。', effects: { attrs: { 道心: 7 }, demon: -25, expPct: 0.4, flag: { 心魔让位: true } } },
          fail: { text: '你刚坐下，蒲团就变成了水。你沉下去，沉到识海底下，那里全是你不想再看的东西。爬上来用了三年，三年里你的头发白了一半。', effects: { demon: 25, attrs: { 道心: -6 }, lifespan: -6, hp: -50 } },
        },
      },
      {
        label: '问它为什么', hint: '悟性 ≥ 18',
        require: 'char.attrs.悟性 >= 18', requireHint: '问不出口',
        cost: { month: 1 },
        outcome: { text: '它想了很久，说：「我坐累了。我坐的是你的位置，看的是你的东西，连恨都是你的。」它说完就笑了一下，这次笑得和你不一样。', effects: { attrs: { 悟性: 5, 道心: 4 }, demon: -15, expPct: 0.3, flag: { 问心魔: true } } },
      },
      {
        label: '把蒲团掀了', hint: '不给它台阶',
        outcome: { text: '你一脚把蒲团踢翻。它站着没动，看了你一会儿，慢慢又坐回去，坐回了原来的位置。它重新笑起来，笑得比你熟。', effects: { demon: 15, attrs: { 道心: -4 }, expPct: 0.15 } },
      },
    ],
  },
  {
    id: 'ev_e_last_morning', title: '寿元将尽的清晨', pool: 'inner', tier: 5, weight: 4, minRealm: 2,
    text: '你醒得比往常早。窗纸是灰的，院子里有鸟在叫，叫得很急。\n\n你算了算，还剩四个月。这件事你知道很多年了，今天早上第一次觉得它只是一个数字，不重，也不轻。你掀开被角，看见院子里那棵树，今年开过一次花，你没有看到。',
    choices: [
      {
        label: '起身去做完那件事', hint: '一月 · 还来得及',
        cost: { month: 1 },
        outcome: { text: '你去了。那件事很小：把一柄剑还给一个人。剑还回去时他已经很老了，接过剑就哭了。你在他家门口站了一会儿，觉得可以了。', effects: { karma: 30, attrs: { 道心: 6 }, flag: { 见过死期: true, 事了: true }, demon: -12 } },
      },
      {
        label: '躺着听鸟叫', hint: '一上午',
        outcome: { text: '你躺到日头上来。鸟叫了很久，后来不叫了，院子里安静下来。你想，四个月也不算短，够看很多个这样的早上。这个念头让你有点高兴。', effects: { attrs: { 道心: 5 }, demon: -10, lifespan: 4, flag: { 见过死期: true } } },
      },
      {
        label: '写一封没人收的信', hint: '写给谁',
        cost: { month: 1 },
        outcome: { text: '你写了七张，都烧了。第八张只写了一句：我不怕。写完放在桌上，没有署名。四个月后有人收拾这间屋子，把这句念了一遍。', effects: { attrs: { 道心: 4 }, karma: 15, flag: { 飞升抉择: true }, demon: -8 } },
      },
    ],
  },
  {
    id: 'ev_e_no_fear_death', title: '不再怕死', pool: 'inner', tier: 4, weight: 5, minRealm: 4,
    text: '你发现自己不怕死了。不是想通了，是那种怕在你身上找不到落脚的地方，像风找不到墙。\n\n这本来该是好事。可你摸着胸口，那里安静得让你有点不安。你去井边打了半桶水，水面很稳，稳得像没有风。',
    choices: [
      {
        label: '承认这件事', hint: '一月 · 认了',
        cost: { month: 1 },
        outcome: { text: '你在心里把这句话说了一遍：我不怕死。说完等了一会儿，没有回声。你起身烧水，水开得很慢，你一直看着，没有走神。', effects: { attrs: { 道心: 7 }, demon: -15, lifespan: 8, flag: { 飞升抉择: true } } },
      },
      {
        label: '去找一件怕的事', hint: '别把自己弄丢了',
        roll: {
          p: 0.45, attrs: { 道心: 0.006 },
          success: { text: '你去找了。找到第七天，站在一处悬崖边上，风很大，你往下看，还是不怕。你蹲下来，忽然想起有个人还在等你回去，那一瞬心里紧了一下。', effects: { attrs: { 道心: 5, 悟性: 3 }, demon: -8, relation: { 道侣: 15 }, flag: { 飞升抉择: true } } },
          fail: { text: '你越找越不怕。最后你站在雷里，雷落在肩上，你只闻到焦味。你从雷里走出来时，眼睛比进去时更干。', effects: { attrs: { 道心: -4 }, hp: -60, demon: 15 } },
        },
      },
      {
        label: '去替别人挡一次', hint: '会疼',
        outcome: { text: '你替一个不认识的货郎挡了一刀。刀砍在背上，很疼，疼得你在地上趴了半炷香。你趴着的时候笑了：原来还是怕疼。这不丢人。', effects: { hp: -70, injury: 1, karma: 40, attrs: { 道心: 4 }, demon: -10 } },
      },
    ],
  },
  {
    id: 'ev_e_sword_out_of_control', title: '剑意失控', pool: 'inner', tier: 5, weight: 5, minRealm: 5,
    text: '剑在你手里自己动了。它先斩断一根竹子，再斩断你的袖子，然后停住，剑尖指着你身后。\n\n你身后什么也没有。你的手在抖，不是怕，是剑在抖。它抖得越来越快，像要说什么。你想起它上一次这样，是在一个你这辈子都不想再去的地方。',
    choices: [
      {
        label: '松手', hint: '让它去',
        outcome: { text: '你松开手。剑没有落地，悬在半空转了一圈，往西去了，去得很快。你站在原地，掌心有一道被剑柄磨出的红。后来你听说西边塌了一座山。', effects: { removeItems: ['qingfeng_jian'], attrs: { 道心: 5 }, expPct: 0.2, demon: 8, flag: { 放剑: true } } },
      },
      {
        label: '压住它', hint: '道心 · 压不住就伤',
        roll: {
          p: 0.45, attrs: { 道心: 0.008 },
          success: { text: '你两只手一起握住剑柄，把剑意一寸寸压回去。压到最后一寸，剑安静了，你的虎口裂开了。剑身上多了一道很细的纹，像被压出来的骨。', effects: { attrs: { 道心: 5, 根骨: 3 }, hp: -40, expPct: 0.35, flag: { 压剑: true } } },
          fail: { text: '剑意反冲上来，顺着你的手臂走了一圈。你的右臂从此抬不到肩以上，剑也再没有认过你，握着像握着一根别人的骨头。', effects: { hp: -90, injury: 2, attrs: { 道心: -5 }, demon: 15 } },
        },
      },
      {
        label: '顺着剑尖看过去', hint: '悟性 ≥ 22',
        require: 'char.attrs.悟性 >= 22', requireHint: '看不见它指的东西',
        cost: { month: 1 },
        outcome: { text: '你顺着剑尖看了一个月，看到第三十天，虚空里浮出一点黑。那是一个人的背影，正在走远。你认出了那个背影，是你自己十年前的。', effects: { attrs: { 悟性: 6, 神识: 4 }, expPct: 0.5, demon: 12, flag: { 剑指旧身: true } } },
      },
    ],
  },
  {
    id: 'ev_e_affection', title: '情之一字', pool: 'inner', tier: 4, weight: 6, minRealm: 2,
    text: '她替你把袖子上的线头剪了，剪完抬头，等你说话。你张了张嘴，说了一句关于天气的话。\n\n她低下头继续剪，剪得很慢，剪了很久。窗外有风，把她的头发吹起来一缕，她没有去理。',
    choices: [
      {
        label: '说清楚', hint: '一句就够',
        outcome: { text: '你说：「我不太会说这些。」她说：「我知道。」你说：「那你别走。」她把手里的剪刀放下，说：「你怎么现在才讲。」她的眼睛红了，但没有掉下来。', effects: { relation: { 道侣: 45 }, flag: { 道侣: true }, attrs: { 道心: 5 }, demon: -10 } },
      },
      {
        label: '什么也不说', hint: '她等了一会儿',
        outcome: { text: '她等了一会儿，把剪好的袖子叠起来放在桌上，起身走了。走到门口停了一下，没有回头。你把袖子拿起来，线头剪得很齐。', effects: { relation: { 道侣: -30 }, attrs: { 道心: -4 }, demon: 10 } },
      },
      {
        label: '走开', hint: '你怕说错 · 一月',
        cost: { month: 1 },
        outcome: { text: '你说你要去后山。她「嗯」了一声。你在后山站到天黑，回来时桌上留着一盏灯，灯罩上有一个指印。你把灯吹了，坐在黑里。', effects: { relation: { 道侣: -15 }, attrs: { 道心: -2 }, demon: 6, flag: { 错过: true } } },
      },
    ],
  },
  {
    id: 'ev_e_master_karma', title: '师徒因果', pool: 'inner', tier: 4, weight: 5, minRealm: 3,
    text: '师父死前留了一句话给三个人，你是最后一个听到的。前两个人听完都哭了，你听完没有。\n\n那句话是：「别学我。」他说完就闭了眼，手还搭在你腕上，搭得很轻。屋子里还有他的药味，很淡，淡到你觉得是自己想的。',
    choices: [
      {
        label: '去问前两个人', hint: '两月 · 他们未必说',
        cost: { month: 2 },
        outcome: { text: '大师兄说师父教他的是「别学我杀人」。二师姐说师父教她的是「别学我不说」。你回来坐在师父的旧屋里，想自己这一份是什么。想了很久，想到一句：别学我不敢。', effects: { attrs: { 悟性: 4, 道心: 4 }, relation: { 师门: 20 }, exp: 400 } },
      },
      {
        label: '照着做', hint: '不做他做过的事',
        outcome: { text: '你开始一件件避开他做过的事：不闭关，不立威，不收第二个徒弟。避开到第三年，你发现自己活得越来越像另一个人，那个人也不像你。', effects: { attrs: { 道心: 3 }, karma: 20, demon: 8, flag: { 避师道: true } } },
      },
      {
        label: '反过来做', hint: '偏要学',
        roll: {
          p: 0.45, attrs: { 道心: 0.006, 悟性: 0.005 },
          success: { text: '你把他做过的事一件件做了一遍，做的时候才知道他为什么那样做。做完你在他坟前说：「师父，我不怪你了。」坟上的草动了一下。', effects: { attrs: { 悟性: 6, 道心: 4 }, expPct: 0.45, demon: -15, flag: { 走师路: true } } },
          fail: { text: '你走到他当年走到的那个地方，站住了。那里很窄，只容一个人。你站了很久，忽然明白他为什么说别学我，也明白你已经学成了。', effects: { attrs: { 道心: -5 }, demon: 20, expPct: 0.3 } },
        },
      },
    ],
  },
  {
    id: 'ev_e_killing_intent', title: '杀意', pool: 'inner', tier: 4, weight: 6, minRealm: 4,
    text: '你想杀一个人。这个念头来得很干净，没有恨，也没有火气，像口渴。\n\n那人正在街角买炊饼，掏钱时掉了一枚，蹲下去捡，捡了两次才捡起来。他的后颈露在衣领外面，很薄。街上有孩子在追一只鸡，鸡跑得很急，孩子笑得很响。',
    choices: [
      {
        label: '走过去', hint: '一剑的事',
        roll: {
          p: 0.5, attrs: { 道心: 0.006 },
          success: { text: '你走过去，从他和炊饼摊之间穿过，没有停。走出十步你回头看，他还在捡那枚钱。你忽然不渴了，坐在路边的石阶上，坐了很久。', effects: { attrs: { 道心: 6 }, demon: -12, karma: 15, flag: { 收杀意: true } } },
          fail: { text: '你的手比念头快。他倒下时手里还捏着那枚钱。街静了一瞬，然后有人叫起来。你走出城，洗了三遍手，洗不掉。', effects: { karma: -60, demon: 25, attrs: { 道心: -8 }, flag: { 妄杀: true } } },
        },
      },
      {
        label: '转身', hint: '不问了',
        outcome: { text: '你转身走进另一条巷子，走得很快。走到巷尾停下来，手心全是汗。你不知道自己刚才为什么想杀他，也不知道为什么没有杀。这两件事都让你不安。', effects: { attrs: { 道心: 4 }, demon: 6, exp: 250, flag: { 未杀: true } } },
      },
      {
        label: '记住这张脸，改天', hint: '让它留着',
        outcome: { text: '你把那张脸记住了，记得很仔细。往后很多年，你在很多陌生人身上看见过他的一部分：一个后颈，一次弯腰。每次你都会停一下。', effects: { demon: 15, attrs: { 道心: -3 }, flag: { 留杀意: true } } },
      },
    ],
  },
  {
    id: 'ev_e_let_go', title: '放下', pool: 'inner', tier: 4, weight: 5, minRealm: 5,
    text: '你手里那件东西拿了很多年，拿得指节都变形了。今天你摊开手，它还在，只是不重了。\n\n你想起当年为什么要拿它，想了很久，没想起来。它在你掌心里躺着，像一件别人的东西。窗外的光落在手背上，是一小块暖的。',
    choices: [
      {
        label: '放下', hint: '一月 · 空着手',
        cost: { month: 1 },
        outcome: { text: '你把它放在石头上，走了。走出一里回头看，它还在那儿。你没有回去。第十天你发现自己的手能完全张开了，掌心的那道印淡了很多。', effects: { attrs: { 道心: 8, 悟性: 3 }, demon: -20, lifespan: 12, flag: { 放下: true } } },
      },
      {
        label: '再拿一会儿', hint: '还舍不得',
        outcome: { text: '你又握住它，握了一会儿。手很熟，熟得像长在一起。你把它收进袖里，对自己说下次。这句话你说过很多次，每次都是真的。', effects: { attrs: { 道心: 2 }, demon: 8, flag: { 未放: true }, exp: 200 } },
      },
      {
        label: '交给别人', hint: '有人需要它',
        outcome: { text: '你把它给了一个年轻人。他接过去时手抖了一下，问你为什么给他。你说：「因为你还想拿。」他听不懂，但抱得很紧。你看着他走远，觉得轻松。', effects: { karma: 30, attrs: { 道心: 6 }, relation: { 后辈: 30 }, demon: -12 } },
      },
    ],
  },
  {
    id: 'ev_e_last_question', title: '飞升前的最后一问', pool: 'inner', tier: 5, weight: 3, minRealm: 7,
    text: '天门开之前，会有人问你一句。问什么，从来没人说清过。\n\n你等了三天，没有人来。第四天早上，你在自己的声音里听见了那个问题：「你要去哪里？」很多年前也有人问过类似的话，那次你答得很快。',
    choices: [
      {
        label: '答「天上」', hint: '最省事的答案',
        outcome: { text: '你说完，四周安静了很久。然后那个声音说：「好。」就再没有别的话。你站在原地，觉得这个「好」有点轻，轻得像打发。', effects: { attrs: { 道心: 4, 悟性: 3 }, flag: { 飞升抉择: true }, expPct: 0.6 } },
      },
      {
        label: '答「回去」', hint: '有个人在等',
        require: 'flag("道侣")', requireHint: '没有可以回去的地方',
        outcome: { text: '你说完，那个声音笑了一下：「回去做什么？」你说：「她一个人。」笑声停了。云散开一线，露出一条很窄的路，是往回走的。', effects: { flag: { 飞升抉择: true, 道侣: true }, relation: { 道侣: 60 }, attrs: { 道心: 8 }, lifespan: 30, karma: 25 } },
      },
      {
        label: '不答', hint: '它还会问',
        roll: {
          p: 0.35, attrs: { 道心: 0.008, 悟性: 0.006 },
          success: { text: '你站着不说话。它问了七遍，一遍比一遍近。第八遍时你听出那是你自己的声音，你答：「我不知道。」它说：「那你留下来想。」天门就关了。', effects: { attrs: { 道心: 10, 悟性: 6 }, expPct: 0.8, flag: { 飞升抉择: true, 留在人间: true }, lifespan: 40 } },
          fail: { text: '你不答，它也等。等到第三天，你听见自己的骨头在响。你终于开口，可声音不是你的，说的是「天上」。话出口你就后悔了，门已经开了。', effects: { flag: { 飞升抉择: true }, demon: 20, attrs: { 道心: -4 }, expPct: 0.5 } },
        },
      },
    ],
  },
];
