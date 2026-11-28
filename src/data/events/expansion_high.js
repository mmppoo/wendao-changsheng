/** 高阶事件池：上古秘境、九州风云、识海深处。tier 3–5，minRealm 2–6。 */
export const HIGH_EXPANSION = [
  {
    id: 'ev_h_ancient_cave', title: '上古洞府', pool: 'wild', tier: 5, weight: 5, minRealm: 5,
    text: '山腹裂开一道缝，缝里有光，不是火光，是阵法将熄未熄的冷光。\n\n石门上刻着三十六道禁制，最外一层早被磨平。门缝里伸出一截手指，白的，指节上套着一枚戒指。\n\n门后有什么在等你，不急。',
    choices: [
      {
        label: '以神识逐层读禁制', hint: '悟性 ≥ 26 · 两月 · 有风险',
        require: 'char.attrs.悟性 >= 26', requireHint: '悟性不足，读不通门上的字',
        cost: { month: 2, mp: 40 },
        roll: {
          p: 0.5, attrs: { 悟性: 0.01, 气运: 0.006 },
          success: { text: '第三十六道禁制散开时，门自己退了半寸。里面是一间石室，蒲团上坐着一个人，早已干了。他膝上摊着一册玉简，简上的字还亮。', effects: { items: ['jiuzhuan_gong'], attrs: { 悟性: 4, 神识: 3 }, expPct: 0.6, lifespan: 20, flag: { 得地阶法宝: true, 洞府开门: true } } },
          fail: { text: '禁制不是门锁，是刀。你读到第十九道，它先动，你的神识被齐齐削去一层，退回来时眼前全是白点。', effects: { hp: -60, demon: 8, attrs: { 神识: 1 } } },
        },
      },
      {
        label: '去摘那枚戒指',
        hint: '贪 · 无名指骨',
        roll: {
          p: 0.35, attrs: { 气运: 0.01 },
          success: { text: '戒指从指骨上滑下来，很轻。内壁刻着一行小字，是一句道歉。你把指骨放回门缝，退了三步。', effects: { items: [{ id: 'xisui_dan', qty: 2 }], attrs: { 气运: 2 }, karma: -10, flag: { 洞府戒: true } } },
          fail: { text: '你捏住戒指的一瞬，那截手指攥住了你的手腕。它没有力，可你的手三天抬不起来，掌纹里多了一道白线。', effects: { hp: -80, injury: 2, demon: 10 } },
        },
      },
      {
        label: '在门前坐一夜，什么也不做',
        hint: '一月',
        cost: { month: 1 },
        outcome: { text: '你坐到天亮，门没有开，光也淡了。起身时膝盖发麻，脑子里却干净得像被水洗过一遍。你把这件事记在心里，往后很多年都用得上。', effects: { attrs: { 道心: 4, 悟性: 2 }, exp: 200, flag: { 洞府前坐: true }, counter: { 守静: 1 } } },
      },
    ],
  },
  {
    id: 'ev_h_thunder_marsh', title: '雷泽', pool: 'wild', tier: 4, weight: 7, minRealm: 3,
    text: '雷泽没有晴天。云压在水面上，每隔几十息就落一道雷，落在同一片芦苇里。\n\n芦苇不烧，只亮一下，然后继续摇。水底下有东西在呼吸，一起一伏，与雷同一个节拍，比雷慢半拍。',
    choices: [
      {
        label: '踏着雷点走进去',
        hint: '雷灵根专属 · 一月',
        require: 'char.rootId == "lei"', requireHint: '雷不认你，会先劈你',
        cost: { month: 1 },
        outcome: { text: '你数着节拍走，雷落在身后一步，落在身侧半步。走到泽心，水底那东西翻了个身，把一整片雷都吞了下去，然后安静了。你站在水上，脚下是实的。', effects: { attrs: { 根骨: 6, 悟性: 3 }, expPct: 0.4, flag: { 雷泽行: true }, counter: { 雷行: 1 } } },
      },
      {
        label: '在泽边接雷炼体',
        hint: '根骨检定 · 伤身',
        roll: {
          p: 0.45, attrs: { 根骨: 0.008, 道心: 0.004 },
          success: { text: '第一道雷把你劈得跪进泥里，第二道你就站住了。到第七道，雷光在你骨头上走了一圈，你没有倒。', effects: { attrs: { 根骨: 5 }, hp: -30, lifespan: 8, expPct: 0.25 } },
          fail: { text: '雷不挑地方。你护住了心脉，护不住左手，抬起来时五个指头各朝一个方向。', effects: { hp: -70, injury: 2, demon: 6 } },
        },
      },
      {
        label: '取一瓶泽水带走',
        hint: '一月 · 炼雷',
        cost: { month: 1 },
        outcome: { text: '你灌了一瓶，塞紧。瓶子在怀里发烫，隔三天才凉。雷木是从泽底浮上来的，你把两样东西一起收着，路上没再打开。', effects: { items: ['leimu'], karma: -5, demon: 4, attrs: { 根骨: 2 } } },
      },
    ],
  },
  {
    id: 'ev_h_starfall_sea', title: '星陨海', pool: 'wild', tier: 5, weight: 5, minRealm: 5,
    text: '海面平得像一块铁。天上没有星，星都掉进了水里，沉在几十丈下发光。\n\n你在礁上看了三夜，看出那些光在移动，不是随波，是循着一种极慢的轨迹。有人在上面排了一盘棋，还没下完，落子很轻。',
    choices: [
      {
        label: '以海底星位推演',
        hint: '悟性 ≥ 24 · 三月 · 折寿',
        require: 'char.attrs.悟性 >= 24', requireHint: '不够，推不出第二步',
        cost: { month: 3, mp: 60 },
        outcome: { text: '你把三夜的星位画在沙上，画到第七张，两张叠起来的那道线指向西边偏北。那里此刻什么也没有，二十九年后会有一座山塌。你把这个日子记住了。', effects: { attrs: { 悟性: 6, 神识: 5 }, expPct: 0.5, lifespan: -10, flag: { 推演天象: true, 星陨海: true } } },
      },
      {
        label: '下水去捞最亮的那颗',
        hint: '水寒 · 有风险',
        roll: {
          p: 0.4, attrs: { 根骨: 0.008, 气运: 0.008 },
          success: { text: '那不是星，是一块从天上摔下来的铁，还带着余温。你抱着它浮上来，胸口被烫出一片红，铁上有一道箭痕。', effects: { items: ['xuantie'], expPct: 0.3, hp: -20, attrs: { 根骨: 3 } } },
          fail: { text: '你潜到一半，所有的星同时熄了。黑水里你找不到上下的方向，靠着一口气摸了很久才摸到礁石。', effects: { hp: -80, demon: 6, attrs: { 神识: 2 } } },
        },
      },
      {
        label: '记下星图就走',
        hint: '一月 · 稳妥',
        cost: { month: 1 },
        outcome: { text: '你把看到的都画下来，卷好塞进袖子。走的时候你没有回头，怕再看一眼就想留下。那张图后来救过你一次。', effects: { attrs: { 神识: 2, 悟性: 2 }, exp: 220, flag: { 星图: true } } },
      },
    ],
  },
  {
    id: 'ev_h_sword_tomb_rim', title: '剑冢外围', pool: 'wild', tier: 4, weight: 6, minRealm: 4,
    text: '剑冢外围插满断剑，剑柄朝上，像一片长错了的庄稼。风过时它们一起响，声音不齐，有一柄始终慢半拍。\n\n那柄剑没有锈，也没有主人。你走近，它自己出鞘三寸，露出的那一截极亮。',
    choices: [
      {
        label: '拔它出来',
        hint: '剑意检定 · 手会废一只',
        roll: {
          p: 0.45, attrs: { 悟性: 0.008, 道心: 0.005 },
          success: { text: '你握住剑柄，剑鸣压过整片剑冢。断剑出鞘，只剩半截，断口上还留着另一柄剑的牙印。它认你。', effects: { items: ['canjian'], attrs: { 根骨: 4, 悟性: 2 }, flag: { 得断剑: true }, expPct: 0.3 } },
          fail: { text: '剑没有出鞘，先出的是血。你的虎口裂到腕子，退开三步，那柄剑又慢慢归了鞘。', effects: { hp: -55, injury: 1, demon: 5 } },
        },
      },
      {
        label: '斩守冢的剑仆',
        hint: '战斗 · 剑仆持一件旧宝',
        combat: {
          enemy: 'cultivator', matchRealm: 'player', displayName: '守冢剑仆',
          win: { text: '他手里那件东西先碎了，然后才是他。碎片落在地上，还在自己拼合，拼到一半就散了。你收剑，剑冢里的响动一起停了。', effects: { flag: { 剑断法宝: true }, attrs: { 道心: 3 }, expPct: 0.35, stones: 300 } },
          lose: { text: '他不用剑，用那件东西挡。你的剑砍在上面，弹回来的力道卸在你自己的肩上。你退出剑冢时，刀口还朝着你。', effects: { hp: -70, injury: 2, demon: 8 } },
        },
      },
      {
        label: '替它们把剑插正',
        hint: '三月 · 无人看着',
        cost: { month: 3 },
        outcome: { text: '你插正了四十七柄。插到最后一柄时，风停了，整片剑冢安静得像在听你说话。你拍拍手走开，什么也没有带走。', effects: { karma: 20, attrs: { 道心: 6 }, exp: 260, flag: { 正剑: true }, counter: { 正剑: 1 } } },
      },
    ],
  },
  {
    id: 'ev_h_time_rift', title: '时间裂隙', pool: 'wild', tier: 5, weight: 4, minRealm: 6,
    text: '石阶上有一段路走不对。你抬脚，落地时已是三个时辰之后；再抬脚，鞋底还停在原处。\n\n裂隙只有一指宽，里面能看见你自己，坐在同一级台阶上，比你老，也比你年轻。他抬起头，也在看你。',
    choices: [
      {
        label: '伸手进去',
        hint: '一指点错就少活几十年',
        roll: {
          p: 0.3, attrs: { 气运: 0.01, 道心: 0.006 },
          success: { text: '指尖触到的不是冷，是慢。你把一段还没发生的事看完了，看完只用了一息。收手时指甲全黑，掌心的纹路换了方向。', effects: { attrs: { 悟性: 8, 神识: 4 }, lifespan: -20, expPct: 0.8, flag: { 触裂隙: true } } },
          fail: { text: '你抽手的时候慢了。手回来了，可有四十年没有跟着回来，它们从你命里被直接剪掉，剪口很齐，不疼。', effects: { lifespan: -40, demon: 15, hp: -40 } },
        },
      },
      {
        label: '绕开，从崖下走',
        hint: '两月 · 多走的路不白走',
        cost: { month: 2 },
        outcome: { text: '崖下没有路，你用两天踩出一条。回来时你想，绕开也是走过去的一种。那两天里你想通的一件小事，后来替你挡了一次劫。', effects: { exp: 260, attrs: { 道心: 3, 根骨: 2 }, flag: { 避开裂隙: true } } },
      },
      {
        label: '记下裂隙，回去推演',
        hint: '悟性 ≥ 30 · 四月',
        require: 'char.attrs.悟性 >= 30', requireHint: '看不懂那道缝，记了也没用',
        cost: { month: 4 },
        outcome: { text: '你画了七十六张图，只有一张对得上。那张图上多出一条线，是你自己的脚印，从裂隙里出来，往山下走。你不记得自己走过。', effects: { attrs: { 悟性: 5, 神识: 6 }, expPct: 0.4, demon: 8, flag: { 时间残页: true } } },
      },
    ],
  },
  {
    id: 'ev_h_vein_end', title: '地脉尽头', pool: 'wild', tier: 4, weight: 6, minRealm: 4,
    text: '你顺着地脉往深处走，灵气越来越薄，最后只剩石头。\n\n通道在一面石壁前断了，壁上有一道极细的缝，缝里透出温热。你把手贴上去，能感觉到下面有东西在动，很慢，像心跳，也像呼吸。',
    choices: [
      {
        label: '凿开石壁',
        hint: '两月 · 伤身',
        cost: { month: 2, hp: 30 },
        roll: {
          p: 0.5, attrs: { 根骨: 0.008 },
          success: { text: '壁后是一间空腔，腔底铺着一层黑亮的矿，中间嵌着几株不见天日的草。你装了两袋，回头时缝已经自己合上了。', effects: { items: ['xuantie', 'lingcao'], attrs: { 根骨: 4 }, exp: 300, flag: { 地脉尽头: true } } },
          fail: { text: '凿到第三下，壁里喷出一股热气。你退得快，眉毛没了，肺里像塞了一把沙，咳了半个月。', effects: { hp: -50, demon: 8, attrs: { 根骨: 1 } } },
        },
      },
      {
        label: '贴壁听一夜',
        hint: '一月 · 听',
        cost: { month: 1 },
        outcome: { text: '那声音有节律，一千二百息一轮。你跟着它调息，调到第七轮，自己的心跳也慢了下来，慢到和它一样。天亮时你不确定是谁在听谁。', effects: { attrs: { 神识: 3, 道心: 2 }, exp: 200, flag: { 听地脉: true } } },
      },
      {
        label: '把灵力灌回去，封住缝',
        hint: '耗灵力 · 无功无赏',
        cost: { mp: 80 },
        outcome: { text: '你把灵力一层一层抹上去，像给伤口结痂。缝合上时，底下那东西动了一下，然后不动了。你不知道它是在谢你，还是睡着了。', effects: { karma: 15, attrs: { 道心: 4 }, flag: { 封地脉: true }, exp: 180 } },
      },
    ],
  },
  {
    id: 'ev_h_orphan_garden', title: '无主药园', pool: 'wild', tier: 3, weight: 8, minRealm: 2,
    text: '园子荒了，篱笆倒在草里，药畦仍是一行一行的，看得出有人伺候过很久。\n\n最里一畦只剩一株。叶片有七重，每一重的颜色都不同，风过时它不摇，是周围的草在让它。土是干的，它却是活的。',
    choices: [
      {
        label: '连根挖走',
        hint: '有风险 · 业力',
        cost: { month: 1 },
        roll: {
          p: 0.5, attrs: { 气运: 0.008, 悟性: 0.006 },
          success: { text: '你挖到第七尺才见根。根是盘着的，像一只手握着什么。你把土抖干净，用布裹了三层，抱在怀里，一夜没敢松手。', effects: { items: [{ id: 'lingcao', qty: 3 }], expPct: 0.5, karma: -10, flag: { 万年灵草: true } } },
          fail: { text: '根断在第八尺。断口流出的汁液是清的，落在你手上，皮就没了。那株草在你怀里一寸一寸枯下去。', effects: { hp: -30, demon: 6, karma: -5 } },
        },
      },
      {
        label: '只取一片叶',
        hint: '留下它',
        outcome: { text: '你掐下最外一重的那片，缺口处立刻渗出一点白。叶子在你手里香了一路。你没有回头，怕回头就想整株搬走。', effects: { items: ['lingcao'], karma: 8, attrs: { 悟性: 2 }, flag: { 取一叶: true } } },
      },
      {
        label: '守着它，等它结籽',
        hint: '六月 · 长',
        cost: { month: 6 },
        outcome: { text: '你搭了个草棚，每日挑水。第五个月它开了一次花，花只开了一夜。第六个月结出九粒籽，你收了五粒，剩下四粒埋回原处。', effects: { items: [{ id: 'lingcao', qty: 2 }], attrs: { 道心: 5, 悟性: 3 }, expPct: 0.3, karma: 12, flag: { 守药园: true } } },
      },
    ],
  },
  {
    id: 'ev_h_wreck', title: '沉船', pool: 'wild', tier: 3, weight: 7, minRealm: 3,
    text: '退潮时露出一条船的脊骨，木头黑得发亮。不是海船，是楼船的一截。舱口还在，里面没有水，是干的。\n\n你探头，看见舱底摆着一张案，案上一只匣子。匣子前面坐着一个人，穿着几百年前的官服，坐得很正。',
    choices: [
      {
        label: '下舱去取匣子',
        hint: '有风险',
        roll: {
          p: 0.5, attrs: { 气运: 0.008, 根骨: 0.004 },
          success: { text: '匣子压在他膝上。你抽出来时，他的头跟着转了一下，随即塌成一堆沙。匣里是一卷功法，纸是新的，墨也是新的。', effects: { items: ['jiuzhuan_gong'], expPct: 0.4, flag: { 得地阶法宝: true, 沉船匣: true } } },
          fail: { text: '你的手刚碰到匣扣，舱里的空气就沉了下来，压得你跪在木板。爬出舱口时，你的膝盖留了两个印子在甲板上。', effects: { hp: -45, injury: 1, demon: 10 } },
        },
      },
      {
        label: '先向那人行礼',
        hint: '一月 · 礼',
        cost: { month: 1 },
        outcome: { text: '你行了三礼，说明来意。他没答，只是往前倾了一点，像是在让路。案角有一只小瓶，你取了瓶，其余原样不动。', effects: { items: ['liaoshang_dan'], karma: 10, attrs: { 道心: 3 }, flag: { 沉船礼: true }, exp: 150 } },
      },
      {
        label: '拆船上的铁钉去卖',
        hint: '一月 · 不干净的钱',
        cost: { month: 1 },
        outcome: { text: '钉子是阴铁，一共二百四十枚，卖了个好价。最后一枚拔出来时，整条船在你身后塌了，塌得没有声音。', effects: { stones: 320, items: ['xuantie'], karma: -8, demon: 4 } },
      },
    ],
  },
  {
    id: 'ev_h_snowfield', title: '雪原', pool: 'wild', tier: 3, weight: 8, minRealm: 2,
    text: '雪原上没有路。走半天，回头看见自己的脚印已经被填平了。\n\n风里有铃声，很轻，一会儿近一会儿远。你循声走了两个时辰，看见一队人和马，全冻在原地，脸上还带着赶路的神色。铃是其中一匹脖子上的。',
    choices: [
      {
        label: '取铃，继续走',
        hint: '有风险',
        roll: {
          p: 0.55, attrs: { 气运: 0.008, 根骨: 0.005 },
          success: { text: '铃是铜的，冻得粘手。你把它挂在腰上，走起来有声音，雪原就不再那么空了。铃里有半张护身符，纸已经脆了。', effects: { items: ['huxin_fu'], attrs: { 根骨: 2 }, lifespan: -5, flag: { 雪原铃: true } } },
          fail: { text: '你解铃时，那匹马忽然倒了下来。你被压在它身下，摸到它还有温度，然后温度也没了。', effects: { hp: -40, demon: 6, attrs: { 道心: 1 } } },
        },
      },
      {
        label: '为他们立雪坟',
        hint: '两月 · 名不留',
        cost: { month: 2 },
        outcome: { text: '你垒了九个雪堆，插上他们的马鞭。走到第十天回头看，雪堆已经平了，可你觉得该做的事做完了。那之后你在雪里再没有迷过路。', effects: { karma: 20, attrs: { 道心: 5 }, exp: 200, flag: { 雪坟: true } } },
      },
      {
        label: '原路退回',
        hint: '一月 · 退',
        cost: { month: 1 },
        outcome: { text: '你按着来时的方向退，退到第三天看见了官道的界石。你摸了一下那块石头，手心里全是汗，汗在冷里结成一层薄冰。', effects: { hp: -20, attrs: { 悟性: 2 }, exp: 120, flag: { 雪原退: true } } },
      },
    ],
  },
  {
    id: 'ev_h_crater', title: '火山口', pool: 'wild', tier: 4, weight: 6, minRealm: 3,
    text: '火山口没有烟，只有一层暗红的光，从底下照上来。石壁被烧成了琉璃，脚踩上去会响。\n\n岩缝里长着一株草，通体透明，根扎在最热的地方。你伸手，草叶没有温度，你的手先烫出了泡。',
    choices: [
      {
        label: '隔着灵力去摘',
        hint: '道心 ≥ 25 · 一月',
        require: 'char.attrs.道心 >= 25', requireHint: '手会抖，灵力护不住',
        cost: { month: 1, mp: 50 },
        outcome: { text: '你把灵力铺成一层薄膜，包住手掌，摘的时候没有碰叶。草离土即化，只留下一点白光。岩缝底下还卡着一截雷木，你一并取出。', effects: { items: ['lingcao', 'leimu'], attrs: { 根骨: 4, 道心: 2 }, flag: { 火中草: true }, exp: 220 } },
      },
      {
        label: '跳下去，借地火炼体',
        hint: '根骨检定 · 大险',
        roll: {
          p: 0.35, attrs: { 根骨: 0.012, 气运: 0.006 },
          success: { text: '你在熔浆上方的石台上坐了七日。皮烧掉一层，长出新的，新的烧不掉。上来时你走路的样子没变，可石头被你踩出裂纹。', effects: { attrs: { 根骨: 9, 神识: 3 }, lifespan: 12, expPct: 0.5, hp: -40 } },
          fail: { text: '石台在你坐下第三天塌了。你抓到壁上的琉璃，手指烧进石头里，靠这一抓才爬回来。', effects: { hp: -100, injury: 2, lifespan: -10 } },
        },
      },
      {
        label: '在口沿上打坐三日',
        hint: '一月 · 借势',
        cost: { month: 1 },
        outcome: { text: '热气从脚底往上走，走到百会就散了。你什么也没得到，只把体内一层旧寒逼了出来。下山时步子比上山轻。', effects: { attrs: { 道心: 3 }, demon: 5, exp: 260, heal: 1 } },
      },
    ],
  },
  {
    id: 'ev_h_battlefield', title: '古战场', pool: 'wild', tier: 4, weight: 7, minRealm: 4,
    text: '这里打过一场仗，打完没有人收。铁器和骨头混在土里，草长得比人高，颜色发黑。\n\n夜里能听见列阵的鼓，一遍一遍，从东边推到西边。鼓停下时，有人在很近的地方喊了一句，你听不清，但你的手先握紧了。',
    choices: [
      {
        label: '走进阵里去',
        hint: '战斗 · 列阵未散',
        combat: {
          enemy: 'ghost',
          win: { text: '它穿着整副甲，甲里是空的。你砍穿甲，它就散了，散之前朝你行了个军礼。地上留下一枚染血的血玉，还带着一点鼓的余震。', effects: { items: ['xueyu'], attrs: { 根骨: 4 }, expPct: 0.4, flag: { 入阵: true } } },
          lose: { text: '鼓声从四个方向同时压过来。你被按在土里，脸贴着几百年前的骨头。天亮时鼓停了，你爬出来，耳朵里响了一整天。', effects: { hp: -60, demon: 10, attrs: { 道心: 2 } } },
        },
      },
      {
        label: '捡兵器去卖',
        hint: '两月 · 业力',
        cost: { month: 2 },
        outcome: { text: '你熔了三百斤铁，铸成锭，卖了。买家问这是什么铁，你说山里的。他把锭敲了一下，声音很闷，他没再问。', effects: { stones: 400, items: ['xuantie'], karma: -12, demon: 3 } },
      },
      {
        label: '替他们收骨',
        hint: '三月 · 无人看见',
        cost: { month: 3 },
        outcome: { text: '你挖了三个大坑，收了十一天，剩下的实在收不完。埋好最后一捧土，你在坑边站了很久，忽然觉得自己的寿数没有那么紧了。', effects: { karma: 25, attrs: { 道心: 6 }, lifespan: 5, flag: { 收骨: true } } },
      },
    ],
  },
  {
    id: 'ev_h_yao_market', title: '妖市', pool: 'wild', tier: 3, weight: 7, minRealm: 3,
    text: '妖市开在干河床里，摊子用骨头搭，灯是活的，装在笼子里。买卖双方都不问来历，只问价钱和斤两。\n\n一个披着人皮的摊主朝你招手，掀开布。底下是一排眼睛，都还睁着，都在看不同的方向。',
    choices: [
      {
        label: '买那对最静的',
        hint: '花费 400 灵石',
        cost: { stones: 400 },
        outcome: { text: '他把眼睛取出来，装进一只小盒，嘱咐你不要在白天开。盒底还垫着一枚洗髓丹，算是添头。你收了，回去后神识确实清明了些，只是梦里总有人在别处看东西。', effects: { items: ['xisui_dan'], attrs: { 神识: 5 }, demon: 8, flag: { 妖市眼: true } } },
      },
      {
        label: '问眼睛的来历',
        hint: '有风险 · 他未必肯说',
        roll: {
          p: 0.5, attrs: { 悟性: 0.01, 道心: 0.005 },
          success: { text: '他说这些眼睛属于一类人：看过不该看的东西，又舍不得闭上。他送你一小瓶丹药，说算是封口费，也算提醒。', effects: { attrs: { 悟性: 4 }, items: ['huiling_dan'], flag: { 妖市来历: true }, exp: 180 } },
          fail: { text: '他笑了，把布掀得更开。那一排眼睛同时转过来，你退了两步，撞翻了后面的摊子，赔了钱才走脱。', effects: { demon: 12, hp: -30, stones: -100 } },
        },
      },
      {
        label: '把笼里的灯都放了',
        hint: '一月 · 惹事',
        cost: { month: 1 },
        outcome: { text: '笼门一开，灯全往河床上游飞。摊主们骂了半宿，没有追。你走出河床时，身后有一片光跟着，跟到天亮才散。', effects: { karma: 18, attrs: { 道心: 4 }, demon: -5, reputation: 10, flag: { 放灯: true } } },
      },
    ],
  },
  {
    id: 'ev_h_gate_afterimage', title: '天门残影', pool: 'wild', tier: 5, weight: 4, minRealm: 6,
    text: '云散开一线，天上悬着一道门的影子，没有实体，也不在任何一个方向。门框上有鳞，一片压一片，缓缓地动。\n\n那不是门。它在呼吸。你看了很久才明白，你看见的是它闭着的眼睛。',
    choices: [
      {
        label: '直视它，不退',
        hint: '道心 ≥ 40 · 一月',
        require: 'char.attrs.道心 >= 40', requireHint: '道心不稳，看久了会散',
        cost: { month: 1 },
        outcome: { text: '它睁开了。你看见的不是眼睛，是一条极长的、盘在云里的东西，头在门的另一边，尾巴在你脚下这片山河里。它看了你一眼，然后云合上了。', effects: { attrs: { 道心: 10, 神识: 8 }, expPct: 0.8, lifespan: 30, flag: { 见龙: true, 天门残影: true } } },
      },
      {
        label: '低头，退走',
        hint: '不看不问',
        outcome: { text: '你低头走了三里，才敢再抬起来。天上什么也没有了。你没有遗憾，只是从那天起，看山的时候总会多看一眼山顶。', effects: { attrs: { 道心: 4 }, exp: 220, karma: 5, flag: { 避天门: true } } },
      },
      {
        label: '叫它的名字',
        hint: '你不知道名字 · 极险',
        roll: {
          p: 0.25, attrs: { 悟性: 0.012, 气运: 0.01 },
          success: { text: '你开口，说出的不是自己想说的字，是一个很老的音节。云里的东西动了一下，鳞片翻过去一片，露出底下的金。你活下来了，也看见过了。', effects: { attrs: { 悟性: 8, 神识: 6 }, lifespan: -30, flag: { 见龙: true }, expPct: 0.6 } },
          fail: { text: '你叫错了。云里落下一线光，正正劈在你站的地方。你被掀出十几丈，醒来时嘴里的血是甜的，天上的门已经不见了。', effects: { demon: 20, hp: -80, lifespan: -10, injury: 1 } },
        },
      },
    ],
  },
  {
    id: 'ev_h_isle', title: '海中孤岛', pool: 'wild', tier: 4, weight: 5, minRealm: 4,
    text: '岛很小，走一圈不到半个时辰。岛上只有一块石头和一口井，井里有淡水。\n\n石头上刻着字，刻得很深，是有人用指甲抠出来的：我在这里等了四十年，船没有来。下面还有一行，字迹新一些：我也是。',
    choices: [
      {
        label: '在岛上等船',
        hint: '六月 · 也许等不到',
        cost: { month: 6 },
        roll: {
          p: 0.4, attrs: { 气运: 0.012, 道心: 0.006 },
          success: { text: '第五个月末，海面上出现一条黑线。船靠过来时，船上的人问你从哪里来，你答不上，只能说在这岛上住了半年。他们让你上船，没有多问。', effects: { exp: 320, attrs: { 道心: 8, 悟性: 3 }, flag: { 孤岛等船: true } } },
          fail: { text: '半年里你数过一千三百条经过的船，没有一条看见你。离开时你在石头上刻了第三行：我走了。', effects: { attrs: { 道心: 3 }, demon: 15, lifespan: -10, flag: { 孤岛: true } } },
        },
      },
      {
        label: '拆石取料，自己造船',
        hint: '三月 · 会有人不满意',
        cost: { month: 3 },
        outcome: { text: '石头是空的，里面裹着一层玄铁。你造了条只能坐一个人的筏子，划了十一天才见岸。石头上那两行字没有了。', effects: { items: ['xuantie'], stones: 200, karma: -10, attrs: { 根骨: 3 }, flag: { 造筏: true } } },
      },
      {
        label: '接着刻第三行',
        outcome: { text: '你刻：我来了，也走了，水是甜的。刻完你坐在石头旁边，觉得这三行字凑在一起，比任何一句遗言都体面。', effects: { flag: { 刻第三行: true }, attrs: { 悟性: 3, 道心: 4 }, karma: 5, exp: 180 } },
      },
    ],
  },

  {
    id: 'ev_h_immortal_ship', title: '海外仙舟', pool: 'world', tier: 4, weight: 6, minRealm: 3,
    text: '一艘船从云里驶出来，船身包着铜，比城楼还高。它不靠岸，只在海面上慢慢地走，甲板上站着人，都不说话。\n\n舷边垂下一根绳梯，绳结是新的，像是刚放下来，又像是在等一个人。',
    choices: [
      {
        label: '攀绳上去',
        hint: '三月 · 不知去哪',
        cost: { month: 3 },
        roll: {
          p: 0.5, attrs: { 气运: 0.01, 悟性: 0.006 },
          success: { text: '船上没有舱，只有一条走廊，走了很久才到尽头。尽头给你一杯水，喝完你就站在岸上了，手里多一只瓶子，衣服还是干的。', effects: { expPct: 0.5, attrs: { 悟性: 5, 神识: 2 }, items: ['huiling_dan'], flag: { 登仙舟: true } } },
          fail: { text: '绳梯在半空收了。你落进海里，船上的人一个也没有回头。你游回岸上时，天已经黑透了。', effects: { hp: -50, demon: 8, attrs: { 根骨: 2 } } },
        },
      },
      {
        label: '在岸上朝船行礼',
        hint: '什么也不求',
        outcome: { text: '你行了礼，船没有停。走出十几步，你听见甲上有铃声，很短。回头看，船已经进了云里，海面上留着一条很直的痕。', effects: { karma: 10, attrs: { 道心: 3 }, flag: { 仙舟礼: true }, exp: 150 } },
      },
      {
        label: '记下船行的方位',
        hint: '一月 · 用得上',
        cost: { month: 1 },
        outcome: { text: '你在海图上标了七个点，七点连起来是一条不闭合的线。后来有个老船工看了，说这条线是逆着洋流走的，走不通。你把它收了起来。', effects: { attrs: { 神识: 4, 悟性: 2 }, exp: 200, flag: { 仙舟方位: true } } },
      },
    ],
  },
  {
    id: 'ev_h_yao_peace', title: '妖族议和', pool: 'world', tier: 4, weight: 5, minRealm: 4,
    text: '人妖两边的使者在一座断桥上见面，中间摆一张案，案上只有一壶酒。\n\n妖族来的是个老人，穿着一身不合身的儒衫，行礼的手势很标准。他说：我们谈了六十年，这一次带了诚意，也带了刀。',
    choices: [
      {
        label: '替人族执笔记约',
        hint: '悟性 ≥ 20 · 两月',
        require: 'char.attrs.悟性 >= 20', requireHint: '记不住那么细的话',
        cost: { month: 2 },
        outcome: { text: '约文写了九条，第七条两边争了三个时辰。你落笔时把“永”改成了“暂”，没有人发现。这一字后来让两边都还有退路。', effects: { reputation: 30, attrs: { 悟性: 3, 道心: 3 }, flag: { 议和执笔: true }, exp: 260 } },
      },
      {
        label: '去看妖族带的刀',
        hint: '有风险',
        roll: {
          p: 0.5, attrs: { 根骨: 0.008, 悟性: 0.006 },
          success: { text: '刀裹在布里，抽出来时布里结了霜。老人让你握了一下，刀柄上有一道旧裂。他说这刀杀过七个结丹，裂是第八个留下的。临别他丢给你一张护心符，说握过这刀的人，多半用得着。', effects: { attrs: { 根骨: 3 }, items: ['huxin_fu'], flag: { 见妖刀: true }, exp: 200 } },
          fail: { text: '你伸手，老人的手先动了。刀没有出鞘，你的虎口先裂了。他收回手，说：诚意是给会谈用的。', effects: { hp: -40, demon: 8, attrs: { 道心: 2 } } },
        },
      },
      {
        label: '不参与，只听完',
        hint: '一月 · 听',
        cost: { month: 1 },
        outcome: { text: '你坐在桥墩上听了一天。散场时两边都朝你点了下头，像是你也算一份。你什么也没签，可你记住了第九条最后一句的停顿。', effects: { attrs: { 道心: 3, 神识: 2 }, exp: 220, flag: { 旁观议和: true } } },
      },
    ],
  },
  {
    id: 'ev_h_prodigy_rank', title: '天骄榜', pool: 'world', tier: 3, weight: 7, minRealm: 3,
    text: '榜立在城门口，绢是新的，名字用朱砂写，一共一百个。\n\n你从上往下看，看到第九十七个才是自己。榜下有人念出声，念到你的名字时停了一下，回头看了你一眼。那一眼里没有敬意，只有打量。',
    choices: [
      {
        label: '去挑战榜上第十',
        hint: '战斗 · 输了也留名',
        combat: {
          enemy: 'cultivator', matchRealm: 'player', displayName: '天骄榜第十',
          win: { text: '他撑了十九招。第二十招你把他的剑挑到了榜上，绢破了一道口子，正好划过他的名字。围观的人没有叫好，只是让开了一条路。', effects: { reputation: 40, expPct: 0.4, attrs: { 根骨: 4 }, flag: { 上榜: true } } },
          lose: { text: '第十招你就知道赢不了，还是撑到第三十招。他收剑时说了句什么，你没听清，也不想问。回去的路上没有人跟着你。', effects: { hp: -50, reputation: -10, attrs: { 道心: 3 } } },
        },
      },
      {
        label: '回去继续修行',
        hint: '三月 · 不看榜',
        cost: { month: 3 },
        outcome: { text: '你闭关三月，出来时榜已经换了三次，你的名字掉到榜尾之外。你去看了一眼，没有再往上找。', effects: { attrs: { 道心: 4, 悟性: 2 }, expPct: 0.3, flag: { 不看榜: true } } },
      },
      {
        label: '出钱买一个更前的位置',
        hint: '花费 800 灵石 · 业力',
        cost: { stones: 800 },
        outcome: { text: '你的名字挪到了第三十一。挪的时候抄榜的人手很稳，显然不是第一次。三个月后有人来挑战你，来了六个。', effects: { reputation: 20, karma: -15, demon: 5, flag: { 买榜: true }, counter: { 挑战: 1 } } },
      },
    ],
  },
  {
    id: 'ev_h_dynasty_fall', title: '王朝更替', pool: 'world', tier: 3, weight: 7, minRealm: 2,
    text: '城破那日下了雨。宫门烧了三天，第四天就有人在新朝的年号下摆摊卖旧朝的碗。\n\n一个老宦官抱着一只匣子蹲在墙角，见你穿道袍，把匣子往前推了推：真人，这个不认主了。',
    choices: [
      {
        label: '收下匣子',
        hint: '有风险 · 不干净',
        roll: {
          p: 0.5, attrs: { 气运: 0.008 },
          success: { text: '匣里是三枚筑基丹和一方旧印。丹药还成，印不能留。你把印扔进护城河，看着它沉下去，才觉得怀里轻了些。', effects: { items: [{ id: 'zhuji_dan', qty: 3 }], stones: 200, karma: -8, flag: { 旧朝匣: true } } },
          fail: { text: '匣盖一开，里面的东西先叫了一声。你听不出是人还是别的，合上时手在抖。那声音此后每逢雨夜就响一次。', effects: { demon: 10, hp: -25, attrs: { 道心: 1 } } },
        },
      },
      {
        label: '给他一笔钱，让他走',
        hint: '花费 300 灵石',
        cost: { stones: 300 },
        outcome: { text: '他接了钱，跪下磕了个头，磕得很实。走出十几步他回头说：真人是好人。你没有答，这句话在乱城里不算夸奖。', effects: { karma: 20, attrs: { 道心: 4 }, flag: { 宦官: true }, exp: 150 } },
      },
      {
        label: '问他宫里还有什么',
        hint: '一月 · 消息',
        cost: { month: 1 },
        outcome: { text: '他说西苑假山下有一条道，通到城外。你去看了，道口被砖封了，砖是新的。你撬开三块，摸到里面一截玄铁的扶手。', effects: { items: ['xuantie'], attrs: { 神识: 3 }, exp: 200, flag: { 旧宫: true } } },
      },
    ],
  },
  {
    id: 'ev_h_sect_war_ash', title: '宗门大战余波', pool: 'world', tier: 4, weight: 6, minRealm: 3,
    text: '两个宗门在野地里打了七天，第八天都撤了。地上剩下的东西比活人多：断旗、炉鼎、没炸完的符。\n\n一个穿内门服色的少年坐在尸堆里，还在给自己的剑上油。他抬头看你，问：你是哪一边的？',
    choices: [
      {
        label: '说：我路过的',
        hint: '一月',
        cost: { month: 1 },
        outcome: { text: '他点点头，继续上油。你走的时候他扔过来一只瓶子，说：路上小心，前面还有一波没撤。瓶子是疗伤的，还温着。', effects: { karma: 8, attrs: { 道心: 3 }, items: ['liaoshang_dan'], flag: { 战后路过: true } } },
      },
      {
        label: '帮他收尸',
        hint: '三月 · 两个宗门都不会谢你',
        cost: { month: 3 },
        outcome: { text: '你们埋了两百多人，他认得每一个的名字，念得很慢。埋完他说：我不打了。然后他把剑插进土里，走了。', effects: { karma: 25, attrs: { 道心: 5 }, reputation: 15, flag: { 收尸: true }, exp: 260 } },
      },
      {
        label: '搜刮炉鼎和符',
        hint: '一月 · 业力',
        cost: { month: 1 },
        outcome: { text: '炉鼎是三阶的，符还剩半叠。你把东西捆好，少年看着你，没有拦。走出很远你才想起他手里的剑一直没有抬起来。', effects: { stones: 350, items: ['pozhang_dan'], karma: -15, demon: 5 } },
      },
    ],
  },
  {
    id: 'ev_h_loose_union', title: '散修联盟', pool: 'world', tier: 3, weight: 7, minRealm: 2,
    text: '联盟设在一间茶棚里，入会要交三块灵石，发一块木牌，牌上刻着编号。\n\n管事的说：我们不保你活，只保你死了有人替你收尸。牌上的号就是他认你的凭据。今年发出去一千二百块，收回来四百。',
    choices: [
      {
        label: '入会',
        hint: '花费 3 灵石 · 一月',
        cost: { stones: 3, month: 1 },
        outcome: { text: '你的号是四百零一。管事的把号念了一遍，念得很平，像在念一个已经死了的人。木牌挂在腰上，走路时碰着剑鞘，一直响。', effects: { flag: { 散修联盟: true }, attrs: { 道心: 3 }, reputation: 10, items: ['yinqi_dan'] } },
      },
      {
        label: '问收尸的规矩',
        hint: '一月 · 学',
        cost: { month: 1 },
        outcome: { text: '他说凭牌认人，不认脸；说三十年无人认领的牌子会一起烧掉。你问烧的时候念不念名字，他说不念，念不完。', effects: { attrs: { 悟性: 3, 道心: 2 }, exp: 180, flag: { 问规矩: true } } },
      },
      {
        label: '替联盟跑一趟腿',
        hint: '两月 · 有报酬',
        cost: { month: 2 },
        outcome: { text: '你把一封信送到三百里外的另一间茶棚，路上遇见两拨劫道的，都绕开了。回来交了差，管事的多给了一块木牌，说：这块是给死人的。', effects: { stones: 250, reputation: 20, counter: { 跑腿: 1 }, flag: { 联盟差事: true }, exp: 200 } },
      },
    ],
  },
  {
    id: 'ev_h_auction', title: '拍卖会', pool: 'world', tier: 3, weight: 6, minRealm: 3,
    text: '拍场在地下的石窟里，灯只照台，不照人。台上那件东西盖着布，布下的轮廓会动。\n\n主持人说：底价三千，只收灵石，不收人情。他掀开布，是一件残缺的甲，甲缝里嵌着半截指骨。',
    choices: [
      {
        label: '出价',
        hint: '花费 3000 灵石',
        cost: { stones: 3000 },
        outcome: { text: '没有人跟你抢。落槌太快，快得像早就等着你举牌。甲是残的，穿不上身。心口那块空处塞着一张折好的护心符，指骨正压在符上。', effects: { items: ['huxin_fu'], attrs: { 根骨: 5 }, flag: { 拍得残甲: true }, demon: 5 } },
      },
      {
        label: '不出价，看谁买走',
        hint: '一月 · 看人',
        cost: { month: 1 },
        outcome: { text: '最后举牌的是三层楼上的一个影子，看不清脸。灯灭之后，你记住了他离场时先迈的左脚。这个细节后来帮了你一次。', effects: { attrs: { 神识: 4, 悟性: 2 }, exp: 200, flag: { 看客: true } } },
      },
      {
        label: '散场后跟着买主',
        hint: '有风险 · 业力',
        roll: {
          p: 0.4, attrs: { 气运: 0.008, 根骨: 0.006 },
          success: { text: '他在巷子里停下，从甲里摸出一只小瓶和五百灵石扔给你，说这些该给活人用。你愣着，他已经走了。', effects: { items: ['xisui_dan'], stones: 500, karma: -12, flag: { 拦买主: true } } },
          fail: { text: '你刚跟上，他就回过头来。巷子太窄，你没有退的地方。他收起手时，你的肋骨断了两根。', effects: { hp: -45, demon: 10, flag: { 被识破: true } } },
        },
      },
    ],
  },
  {
    id: 'ev_h_sea_caravan', title: '跨海商队', pool: 'world', tier: 3, weight: 7, minRealm: 2,
    text: '商队的车是铁皮的，轮子包着鲸骨，走起来没有声音。他们贩的东西写在木牌上：盐、铁、药、人。\n\n领队问你要不要搭一段。他说价钱好说，只要路上肯出一把力，出力的地方他会先说清楚。',
    choices: [
      {
        label: '搭车，出力护送',
        hint: '四月 · 会动手',
        cost: { month: 4 },
        combat: {
          enemy: 'bandit',
          win: { text: '劫道的是本地人，刀很旧，人不少。你打退了三拨，最后一拨没敢上来。领队分账时多给了你一份，说这是买命的价。', effects: { stones: 400, expPct: 0.3, attrs: { 根骨: 3 }, flag: { 随商队: true } } },
          lose: { text: '第四拨人带了专破护体灵光的破法弩。你替车挡了一箭，车队走了，把你留在了路边。三天后你才爬到一个村口。', effects: { hp: -40, injury: 1, karma: 5 } },
        },
      },
      {
        label: '买他们的药',
        hint: '花费 200 灵石',
        cost: { stones: 200 },
        outcome: { text: '药是海上的方子，苦得很，管用。领队多塞了两丸，说海上潮，带着不吃也会坏。你把它们收在最里层。', effects: { items: [{ id: 'huiling_dan', qty: 2 }], attrs: { 悟性: 1 } } },
      },
      {
        label: '问他们贩的人从哪里来',
        hint: '一月 · 不该问',
        cost: { month: 1 },
        outcome: { text: '领队看了你很久，说：从愿意卖的人手里。你追问，他就不说了，只把你的水囊灌满。那晚车队换了道，没有叫你。', effects: { karma: 5, attrs: { 道心: 2 }, demon: 3, flag: { 问人: true }, exp: 150 } },
      },
    ],
  },
  {
    id: 'ev_h_old_capital', title: '旧都', pool: 'world', tier: 3, weight: 6, minRealm: 3,
    text: '旧都的城墙还在，城里没有人。屋子的门都开着，桌上碗筷摆得整齐，饭早已成了灰。\n\n你走了半条街，听见有人在打更。转过街角，更夫提着灯笼站在那儿，衣裳很旧。见你来了，他把灯笼举高了一点，让你看清他的脸。',
    choices: [
      {
        label: '跟他走一程',
        hint: '有风险 · 他认得路',
        roll: {
          p: 0.55, attrs: { 道心: 0.008, 气运: 0.006 },
          success: { text: '他打了四更，走过七条街，最后在城隍庙前停下。庙里有一口钟，钟下压着一只小瓶。他指了指，然后就散了，灯笼落在地上，还是亮的。', effects: { exp: 260, attrs: { 神识: 4 }, items: ['huiling_dan'], flag: { 旧都更夫: true } } },
          fail: { text: '他走得太快，你跟丢了。回头时街景全变了，你在一座空城里转了三天才找到出城的路。', effects: { demon: 12, hp: -35, attrs: { 神识: 1 } } },
        },
      },
      {
        label: '进衙门翻卷宗',
        hint: '两月 · 字还在',
        cost: { month: 2 },
        outcome: { text: '卷宗烂了一半，剩下的一半能读。你翻到最后一册，是本城的人口簿，最后一页停在同一天，墨迹很新，写到第九行就断了。', effects: { attrs: { 悟性: 4, 神识: 2 }, exp: 240, flag: { 旧都卷宗: true } } },
      },
      {
        label: '退出城去',
        outcome: { text: '你退到城门，回头看了一眼。更声停了，灯笼还在街角，一动不动。你在城外坐到天亮才走。', effects: { karma: 5, attrs: { 道心: 3 }, flag: { 不入旧都: true }, exp: 120 } },
      },
    ],
  },
  {
    id: 'ev_h_border_pass', title: '边关', pool: 'world', tier: 3, weight: 7, minRealm: 2,
    text: '关墙上的砖被风磨圆了，箭孔里塞着草。守关的老兵问你有没有见着一支往北去的队伍，他说那是他儿子带的，走了四年。\n\n关外的天很低，云压在沙上，一眼看不到边。他说完就继续擦他的刀，没有催你答。',
    choices: [
      {
        label: '替他往北走一趟',
        hint: '五月 · 未必找得到',
        cost: { month: 5 },
        roll: {
          p: 0.45, attrs: { 气运: 0.01, 道心: 0.006 },
          success: { text: '你在第八天找到一片营地，人都不在了，锅还架着。一支断矛上刻着他儿子的名字。你带回去，老兵摸了半宿，第二天照常擦刀。', effects: { expPct: 0.35, attrs: { 道心: 6 }, karma: 15, items: ['shenxing_fu'], flag: { 北关寻人: true } } },
          fail: { text: '你走了两个月，走到的都是空营地。回来时老兵已经换了防，新来的兵不认识他，也说不出他去了哪。', effects: { hp: -50, attrs: { 道心: 3 }, flag: { 北关: true } } },
        },
      },
      {
        label: '在关上守一夜',
        hint: '一月 · 关外有东西',
        cost: { month: 1 },
        combat: {
          enemy: 'wolf',
          win: { text: '它们从沙里出来，来了四头。你守住了那段墙，天亮时墙下躺着两头。老兵递给你一壶酒，说这酒他存了四年。', effects: { exp: 240, attrs: { 根骨: 3 }, reputation: 15, flag: { 守关: true } } },
          lose: { text: '四头后面还跟着一头成了气候的狼王。你砍空了一刀，它一口咬穿你的护体灵光，把你拖下墙去。老兵用火把把狼群逼退，扶你上来时说：你还年轻。', effects: { hp: -35, injury: 1 } },
        },
      },
      {
        label: '给他留一袋干粮',
        hint: '一月',
        cost: { month: 1 },
        outcome: { text: '干粮是硬的，他没推辞，收进箱子最上面。你出关走了半里，听见身后关墙上有刀鞘敲石头的声音，敲了三下。', effects: { karma: 12, attrs: { 道心: 3 }, exp: 150, flag: { 留粮: true } } },
      },
    ],
  },
  {
    id: 'ev_h_academy_debate', title: '书院辩经', pool: 'world', tier: 3, weight: 6, minRealm: 3,
    text: '书院在山上，讲堂的窗全开着，听得见水声。今日辩的是：长生是不是一件好事。\n\n台上的人说，活得久的人最后都不说话了，因为说过的都错过了。底下有人笑，有人记。主持请你上去说一句。',
    choices: [
      {
        label: '上台说一句',
        hint: '悟性 ≥ 18 · 一月',
        require: 'char.attrs.悟性 >= 18', requireHint: '上台也是白站',
        cost: { month: 1 },
        outcome: { text: '你说：长生不是好事，活着才是。堂下静了一息，然后有人拍了一下手，只一下。主持记了下来，写在绢上，写得很慢。', effects: { reputation: 25, attrs: { 悟性: 4, 道心: 3 }, exp: 240, flag: { 辩经: true } } },
      },
      {
        label: '在下面坐着听完',
        hint: '两月 · 听到底',
        cost: { month: 2 },
        outcome: { text: '你听了两天，听到最后没有人再辩，只是各自坐着。散场时水声格外清楚。你回房打坐，第一次觉得呼吸这件事本身有味道。', effects: { attrs: { 道心: 4, 悟性: 2 }, exp: 200, flag: { 听经: true } } },
      },
      {
        label: '问台上的人：你怕死吗',
        hint: '一月 · 不客气',
        cost: { month: 1 },
        outcome: { text: '他停了很久，说：怕。堂下笑起来。他等笑声停了，又说：所以我才在这里辩。你记住了这两句，比整场辩经都管用。', effects: { attrs: { 悟性: 3, 道心: 4 }, exp: 220, reputation: 10, flag: { 问怕死: true } } },
      },
    ],
  },
  {
    id: 'ev_h_inn', title: '红尘客栈', pool: 'world', tier: 3, weight: 7, minRealm: 2,
    text: '客栈的招牌只剩一个红字。楼下有人在赌，赌注是各自的寿数，输一年就从命里划走一年。\n\n小二端上茶，说：客人要不要下一注？赢了拿走十年，输了也只少一年。他语气很平，像在说今天的菜价。',
    choices: [
      {
        label: '下一注',
        hint: '赌寿数',
        roll: {
          p: 0.45, attrs: { 气运: 0.012, 道心: 0.004 },
          success: { text: '庄家掀开碗，你赢了。十年寿数进账时没有感觉，只是忽然觉得屋子里暖了些。旁边输的那个看了你一眼，起身走了。', effects: { lifespan: 10, attrs: { 气运: 2 }, flag: { 赌寿赢: true } } },
          fail: { text: '你输了。说好只划一年，账上却划走了十二年，小二说多出的是利钱。划走的时候不疼，只是想起明年该做的事，好像少了一件，又想不起是哪件。', effects: { lifespan: -12, demon: 8, attrs: { 道心: 1 } } },
        },
      },
      {
        label: '看庄家的手法',
        hint: '悟性 ≥ 16 · 一月',
        require: 'char.attrs.悟性 >= 16', requireHint: '看不出门道',
        cost: { month: 1 },
        outcome: { text: '他的碗每次落桌都比别人慢半息，慢的那半息里，有东西从碗底溜走。你把这件事记下来，没有说破。走时他送了你一程，眼神很凉。', effects: { attrs: { 悟性: 3, 神识: 2 }, exp: 200, flag: { 看破赌局: true } } },
      },
      {
        label: '掀了赌桌',
        hint: '战斗 · 会得罪人',
        combat: {
          enemy: 'rogue', displayName: '赌坊庄家',
          win: { text: '桌子翻了，寿数散回各人身上，有人当场哭出来。庄家从后门走了。你在这间客栈的名字留了下来，好的坏的一半一半。', effects: { reputation: 20, karma: 10, attrs: { 道心: 3 }, flag: { 掀赌桌: true } } },
          lose: { text: '庄家一拍桌，满屋押上的寿数都成了他的护身之力，七八个人一起站起来，你只打断了两个的骨头。被扔出门时，招牌上的红字在你眼里晃了很久。', effects: { hp: -40, reputation: -15, demon: 5 } },
        },
      },
    ],
  },

  {
    id: 'ev_h_yuanying_out', title: '元婴出窍', pool: 'inner', tier: 5, weight: 5, minRealm: 5,
    text: '这一回出窍时，你从自己头顶飘起来，回头看见自己还坐着，坐得很端正。\n\n屋里的东西都在原位，只有一样不对：那具身体在呼吸，而你不需要呼吸了。你伸手去碰它，手穿了过去，没有声音。',
    choices: [
      {
        label: '往外走，看看山',
        hint: '一月 · 走远了回不来',
        cost: { month: 1, mp: 60 },
        roll: {
          p: 0.5, attrs: { 神识: 0.008, 道心: 0.006 },
          success: { text: '你从屋脊上掠过去，山在脚下变小，河像一根线。走到第三座山头，你看见自己的屋里亮着灯，忽然怕了，掉头回来。落回身体时，膝盖先疼。', effects: { attrs: { 神识: 8, 悟性: 4 }, expPct: 0.5, flag: { 出窍游山: true } } },
          fail: { text: '你走得太远，回头找不到那座山。等摸回来时，身体已经凉了半边，你钻进去用了很久才对上呼吸。', effects: { hp: -40, demon: 12, attrs: { 神识: 2 } } },
        },
      },
      {
        label: '立刻回去',
        hint: '不快，不慢',
        outcome: { text: '你退回去，坐正，睁眼。屋里一切如旧。你抬手摸了摸自己的脸，手是暖的。这件事你没有对任何人说。', effects: { attrs: { 道心: 4 }, exp: 200, flag: { 知返: true } } },
      },
      {
        label: '在屋梁上坐到天亮',
        hint: '一月 · 看自己',
        cost: { month: 1 },
        outcome: { text: '你看自己坐了一夜，看肩头怎么起伏，看眉间那道褶怎么一直不散。天亮时你想，原来我平时是这个样子。回去之后，那道褶浅了些。', effects: { attrs: { 神识: 4, 道心: 3 }, demon: 6, exp: 240, flag: { 梁上: true } } },
      },
    ],
  },
  {
    id: 'ev_h_memory_gap', title: '记忆错位', pool: 'inner', tier: 3, weight: 7, minRealm: 3, require: 'origin != "artifact_spirit"',
    text: '你记得八岁那年在河边捡到一块骨头，记得很清楚，连骨头上有一道裂都记得。\n\n可前些日子你路过儿时住的地方，河在山的另一侧，走过去要两个时辰，八岁的孩子走不了那么远。当年照看过你的老人说你从没去过河边，说那年你一直在发烧。',
    choices: [
      {
        label: '去河边找那块骨头',
        hint: '两月 · 有风险',
        cost: { month: 2 },
        roll: {
          p: 0.5, attrs: { 气运: 0.008, 神识: 0.006 },
          success: { text: '你在河湾的淤泥里摸到了它。那不是骨头，是一截锈透的断剑，裂也是一样的裂，只是比记忆里大了三倍。它在你手里低低震了一下。', effects: { items: ['canjian'], attrs: { 神识: 4 }, exp: 240, flag: { 骨头: true } } },
          fail: { text: '你在河边找了两个月，什么也没有。回去那天老人问你找什么，你张了张嘴，发现自己说不清那块骨头长什么样了。', effects: { demon: 10, hp: -25, attrs: { 悟性: 1 } } },
        },
      },
      {
        label: '把这段记忆封起来',
        hint: '道心',
        outcome: { text: '你把它折好，压进识海最底下的一层。此后提起八岁，你只记得一场高烧。这样干净，也这样省事。', effects: { attrs: { 道心: 5 }, demon: -6, flag: { 封忆: true }, exp: 150 } },
      },
      {
        label: '托人再去问那位老人',
        hint: '一月',
        cost: { month: 1 },
        outcome: { text: '回信只有半页，字是旁人代写的。老人说那年你确实病了很久，病中一直说河。信纸折了三折，纸上有水痕，不像雨。', effects: { attrs: { 悟性: 3, 道心: 2 }, karma: 5, exp: 180, flag: { 问母亲: true } } },
      },
    ],
  },
  {
    id: 'ev_h_dao_collapse', title: '道心崩解', pool: 'inner', tier: 4, weight: 5, minRealm: 4,
    text: '你在打坐时忽然想不起自己为什么要修行。这个念头一起来，体内的灵力就开始往下沉，一层，又一层，像退潮。\n\n你没有害怕，这才是最坏的地方——你连害怕都想不起来了。屋外的雪落在瓦上，声音很清楚。',
    choices: [
      {
        label: '强行压住',
        hint: '耗灵力 · 反噬',
        cost: { mp: 80 },
        roll: {
          p: 0.4, attrs: { 道心: 0.012 },
          success: { text: '你把灵力一层层按回去，按到最后一层时吐了一口血。血落在雪上，很快结成一块。你坐着，忽然想起自己为什么要修行了——理由很平常。', effects: { attrs: { 道心: 8 }, expPct: 0.2, hp: -25 } },
          fail: { text: '压不住。灵力一路退到丹田最底，你从蒲团上滑下来，趴在地上喘。三天后你才站起来，站起来时头发白了一片。', effects: { demon: 25, hp: -60, lifespan: -8, attrs: { 道心: 2 } } },
        },
      },
      {
        label: '任它退，退到哪算哪',
        hint: '三月 · 不求',
        cost: { month: 3 },
        outcome: { text: '你不拦，灵力退尽之后，识海里空出一大块地方，安静得能听见远处的雪。三个月后灵力慢慢回涨，你重新开始呼吸吐纳，第一个周天走得很慢，很稳。', effects: { attrs: { 道心: 12, 悟性: 6 }, lifespan: -5, demon: -10, flag: { 退境: true }, exp: 200 } },
      },
      {
        label: '去找一个能说话的人',
        hint: '两月',
        cost: { month: 2 },
        outcome: { text: '你走了两百里，找到一个卖茶的老修士。他听你说完，只说了一句：那就别修了，先吃饭。你在他那儿吃了一碗面，灵力没有马上回来，但你不慌了。', effects: { karma: 10, attrs: { 道心: 6 }, items: ['liaoshang_dan'], flag: { 求助: true } } },
      },
    ],
  },
  {
    id: 'ev_h_see_death', title: '看见自己的死', pool: 'inner', tier: 5, weight: 5, minRealm: 4,
    text: '入定的最后一层，你看见一个日子，和一个地方。\n\n画面里你躺在一处石台上，衣着整齐，身上没有伤。旁边站着几个人，脸都看不清。你数了一下，四个。你醒来时手指掐进掌心，掌心的印子到第二天才退。',
    choices: [
      {
        label: '记下日子和地方，不再想',
        hint: '一月',
        cost: { month: 1 },
        outcome: { text: '你把它写在一张纸上，压在经册底下。此后每翻到那一页，你都会停一下，然后继续读。日子一天一天近，你一天一天照常过。', effects: { attrs: { 道心: 8 }, lifespan: 10, exp: 240, flag: { 见死期: true } } },
      },
      {
        label: '提前去那个地方',
        hint: '四月 · 也许改得成',
        cost: { month: 4 },
        roll: {
          p: 0.35, attrs: { 悟性: 0.01, 道心: 0.008 },
          success: { text: '石台还在，四个人一个都没来。你在那儿坐了四个月，坐到那个日子过去，什么也没发生。你走的时候，把石台凿了。', effects: { attrs: { 悟性: 8, 道心: 4 }, lifespan: 25, expPct: 0.4, flag: { 改死期: true } } },
          fail: { text: '你在石台上坐满了日子。最后一夜，四个人站在你面前，都不说话。你被自己的影子压得吐血，醒来时天已经亮了。', effects: { hp: -70, demon: 20, lifespan: -15, attrs: { 道心: 3 } } },
        },
      },
      {
        label: '把这件事说出去',
        hint: '业力 · 名声',
        outcome: { text: '你把画面讲给三个人听，讲法一次比一次细。有人信，有人只当你在说境界。讲完之后你轻松了些，也觉得少了些。', effects: { reputation: 15, karma: 8, attrs: { 道心: 3 }, demon: 5, flag: { 说死期: true } } },
      },
    ],
  },
  {
    id: 'ev_h_demon_deal', title: '心魔谈判', pool: 'inner', tier: 4, weight: 6, minRealm: 4,
    text: '它在你的识海里坐着，用的是你的样子，比你干净一点。\n\n它说：我不要你的命，我要你承认一件事——你修行，从来不是为了长生。你只是想赢过某个人，而那个人早死了。它把话说完，就等你答。',
    choices: [
      {
        label: '承认',
        hint: '道心检定',
        roll: {
          p: 0.55, attrs: { 道心: 0.008, 悟性: 0.006 },
          success: { text: '你说：是。它笑了一下，笑得很像你。然后它往后退，退进识海深处，走的时候把它占的那块地方留给了你，那里很宽。', effects: { attrs: { 道心: 10 }, demon: -20, expPct: 0.4, flag: { 认了: true } } },
          fail: { text: '你说了是，可声音在抖。它抓住了那个抖，往前坐了半寸。你的胸口疼了一整夜，第二天照镜子，眼睛比平时深。', effects: { demon: 20, hp: -50, attrs: { 道心: 2 } } },
        },
      },
      {
        label: '反问它要什么',
        hint: '一月',
        cost: { month: 1 },
        outcome: { text: '它想了很久，说：我也不知道。你们对着坐了一整夜，谁也没再说话。天亮时它先散了，散得很慢，像舍不得。', effects: { attrs: { 悟性: 5, 道心: 3 }, demon: 8, exp: 220, flag: { 问心魔: true } } },
      },
      {
        label: '把它压回去',
        hint: '道心 ≥ 35 · 斗一场',
        require: 'char.attrs.道心 >= 35', requireHint: '压不住它，反被它压',
        cost: { mp: 70 },
        combat: {
          enemy: 'heart_demon',
          win: { text: '你们打了很久，打到最后它用的是你十六岁那年的招式，你用的是现在的。它散了，散时说了句什么，你没有听清，也不打算再问。', effects: { attrs: { 道心: 12 }, demon: -25, flag: { 降心魔: true }, expPct: 0.3 } },
          lose: { text: '它比你熟这间屋子。你被按在识海最底，看它站起来，用你的手脚走了半圈。醒来时，你的手在做一件你不记得要做的动作。', effects: { demon: 30, hp: -40, attrs: { 道心: 1 } } },
        },
      },
    ],
  },
  {
    id: 'ev_h_past_echo', title: '前世回声', pool: 'inner', tier: 4, weight: 6, minRealm: 4,
    text: '你在梦里听见一个声音，说的是一种你不认得的语言，可你每个字都懂。它在念一份名单，念到第三十七个时停下，等你接。\n\n你醒了，嘴里还留着那个名字的余味，像含过一块冷铁。',
    choices: [
      {
        label: '接着念下去',
        hint: '两月 · 不知念给谁听',
        cost: { month: 2 },
        roll: {
          p: 0.45, attrs: { 悟性: 0.01, 神识: 0.006 },
          success: { text: '你念到第五十四个，名单到头了。念完的一瞬，你看见一间很旧的屋子，屋里坐满人，都朝你点头。你醒来时在哭，不知道为什么。', effects: { attrs: { 悟性: 7, 神识: 5 }, expPct: 0.4, flag: { 前世名单: true } } },
          fail: { text: '你念错了三个字。名单断了，声音变成一片杂响，压得你耳膜发疼。此后很长时间，你听不清别人说话。', effects: { demon: 15, hp: -40, attrs: { 神识: 2 } } },
        },
      },
      {
        label: '去查这个名字',
        hint: '三月 · 世上也许真有此人',
        cost: { month: 3 },
        outcome: { text: '你在三个地方的旧志里找到同一个人：七百年前的守城校尉，死于城破那日。志上写着他的佩刀去向，你照着找，找到一柄埋在地里的刀。刀早朽了，刀鞘里却封着一只小瓶。', effects: { exp: 280, attrs: { 神识: 3 }, items: ['huiling_dan'], flag: { 查名: true } } },
      },
      {
        label: '不再念，也不再想',
        hint: '断',
        outcome: { text: '你把那个名字从嘴里吐出去，像吐掉一粒沙。那晚睡得很好，梦里什么也没有。第二天你照常起炉、煮茶、练剑。', effects: { attrs: { 道心: 5 }, demon: -8, exp: 160, flag: { 断前世: true } } },
      },
    ],
  },
  {
    id: 'ev_h_body_change', title: '身体异变', pool: 'inner', tier: 4, weight: 6, minRealm: 3,
    text: '你发现自己的血在夜里会发一点光，很淡，要熄了灯才看得见。\n\n用刀划开手指，血珠浮在半空，不落，也不散。你盯着它看了半夜，它慢慢凝成一个字的形状。你不认得那个字，但你认得笔画里的力道——是你自己的。',
    choices: [
      {
        label: '放掉一部分血，看会怎样',
        hint: '一月 · 伤身',
        cost: { month: 1, hp: 50 },
        roll: {
          p: 0.45, attrs: { 根骨: 0.01 },
          success: { text: '血放了半碗，字才散。半碗血在碗底自己分成了两层，上层清，下层沉。你把沉的收进玉瓶，第二天伤口已经好了。', effects: { attrs: { 根骨: 8 }, expPct: 0.35, flag: { 血光: true } } },
          fail: { text: '血一直流到天亮才停。你躺在床上，觉得身子被掏空了一半，养了三个月才回得来。那个字却还在，刻在碗底。', effects: { hp: -60, injury: 2, demon: 12 } },
        },
      },
      {
        label: '就当没看见',
        hint: '不管',
        outcome: { text: '你把袖子放下来，照常出门。此后每逢月缺，血会亮得久一些，你学会了不在那几天照镜子。', effects: { attrs: { 道心: 4 }, demon: 5, exp: 180, flag: { 不管: true } } },
      },
      {
        label: '去问宗门里的老人',
        hint: '一月 · 血魔宗才看得懂',
        require: 'char.sectId == "xuemo"', requireHint: '这具身体的毛病，别家看不明白',
        cost: { month: 1 },
        outcome: { text: '老人只看了一眼，说：这是好事，也是债。他教了你一套收血的口诀，说练成之后血不再外流，只是会更渴。你练了，也确实更渴了。', effects: { attrs: { 根骨: 5, 道心: 2 }, items: ['xisui_dan'], demon: 8, flag: { 问异变: true } } },
      },
    ],
  },
  {
    id: 'ev_h_sword_backlash', title: '剑意反噬', pool: 'inner', tier: 4, weight: 5, minRealm: 4,
    text: '你出剑时多用了半分力。剑光回来的比出去快，从你自己的肩头穿过去。\n\n伤口不流血，只有一线白。此后三日，你每次抬手，都先听见剑鸣，然后才想起自己要做什么。剑在你手里，也在你身体里。',
    choices: [
      {
        label: '把剑埋了',
        hint: '两月 · 空手',
        cost: { month: 2 },
        outcome: { text: '你在后山挖了个坑，把剑连鞘一起埋了，没有立碑。回来路上，抬手的毛病好了。空手走了两个月，你才发现自己的手本来也够用。', effects: { attrs: { 道心: 6 }, demon: -10, exp: 240, flag: { 埋剑: true } } },
      },
      {
        label: '以剑意反炼自身',
        hint: '悟性 ≥ 26 · 三月',
        require: 'char.attrs.悟性 >= 26', requireHint: '炼不动，只会更乱',
        cost: { month: 3, hp: 60 },
        roll: {
          p: 0.4, attrs: { 悟性: 0.01, 根骨: 0.008 },
          success: { text: '你不出剑，只让剑意在经脉里走。走到第九日，那一线白散了，肩头的伤口自己合上。此后你出剑，剑先动，你后动，快得不像自己的手。', effects: { attrs: { 根骨: 7, 悟性: 4 }, expPct: 0.5, flag: { 反炼: true } } },
          fail: { text: '剑意不走经脉，走骨头。你在地上滚了三天，起来时抬手要先想一遍顺序，想清楚了才抬得起来。', effects: { hp: -70, demon: 15, attrs: { 根骨: 2 } } },
        },
      },
      {
        label: '去找铸剑的人',
        hint: '两月 · 山北有位老匠人',
        cost: { month: 2 },
        outcome: { text: '老匠人把剑看了很久，说这不是剑的毛病，是你的。他给你换了剑柄上的缠绳，加了三分重量，说这样你出剑时就会省一点。', effects: { items: ['xuantie'], attrs: { 神识: 3, 根骨: 2 }, exp: 220, flag: { 问剑: true } } },
      },
    ],
  },
  {
    id: 'ev_h_life_end', title: '寿元将尽', pool: 'inner', tier: 5, weight: 4, minRealm: 5, require: 'lifespan - age <= 15',
    text: '你算了一下，剩下的日子已经屈指可数，如果不再受伤，也不再突破。\n\n这个数字很结实，不吃不喝也不会变。你把屋里该扔的东西扔了，留下三样：一柄剑，一册手抄的经，和一枚别人给的木牌。木牌上的号已经磨掉了。',
    choices: [
      {
        label: '用剩下的日子冲一次关',
        hint: '十二个月 · 生死各半',
        cost: { month: 12 },
        roll: {
          p: 0.3, attrs: { 悟性: 0.012, 道心: 0.01 },
          success: { text: '最后一夜，你体内的东西忽然通了。不是突破，是接上了什么。你睁眼，看见自己的手背上有细密的纹，寿数回来了，回来的比原来的多。', effects: { attrs: { 悟性: 10, 道心: 6 }, expPct: 1, lifespan: 40, flag: { 最后一关: true } } },
          fail: { text: '关口没有开。你耗掉一年，剩下的日子又被折去一截。醒来时窗外的树已经落了两回叶，你没有力气去数。', effects: { lifespan: -20, demon: 10, attrs: { 道心: 3 } } },
        },
      },
      {
        label: '把经抄完，留给后人',
        hint: '六月 · 不收回报',
        cost: { month: 6 },
        outcome: { text: '你抄了六册，抄到最后一页时手已经不抖了。你把书放在山门的石台上，压了一块石头。走的时候没有回头。', effects: { karma: 25, attrs: { 道心: 8 }, reputation: 20, lifespan: -6, flag: { 留经: true } } },
      },
      {
        label: '出门走一趟',
        hint: '四月 · 看看没看过的',
        cost: { month: 4 },
        outcome: { text: '你去了四个地方：第一次见到海，第一次喝醉，第一次在雪里睡着，第一次给人送葬。回来时剩下的日子又少了些，你把它们过得很慢。', effects: { exp: 280, karma: 10, attrs: { 道心: 5, 悟性: 3 }, flag: { 临终游: true } } },
      },
    ],
  },
  {
    id: 'ev_h_epiphany', title: '顿悟', pool: 'inner', tier: 5, weight: 5, minRealm: 4,
    text: '你在劈柴。斧头落下的一瞬，你忽然明白了一件事，说不清是什么，但整个身子都轻了。\n\n柴裂开的声音很干净。你站在院子里，听见山下的水、邻家的孩子、自己的心跳，全在同一个节拍上。节拍停下时，你还站着。',
    choices: [
      {
        label: '趁这一刻入定',
        hint: '三月 · 错过就没了',
        cost: { month: 3 },
        outcome: { text: '你原地坐下，坐到第三天才睁眼。境界没有跳，但经脉里的东西顺了，像一条堵了很久的渠被打通。你起身，把剩下的柴劈完了。', effects: { attrs: { 悟性: 8, 道心: 6 }, expPct: 0.8, flag: { 顿悟: true }, counter: { 顿悟: 1 } } },
      },
      {
        label: '把这一刻写成一句话',
        hint: '悟性 ≥ 22 · 一月',
        require: 'char.attrs.悟性 >= 22', requireHint: '写下来就不是那个意思了',
        cost: { month: 1 },
        outcome: { text: '你写了七个字，写完觉得不对，划掉，又写七个字。写到最后纸上只剩一句话，很短。这句话后来被别人抄走，传得比你远。', effects: { attrs: { 悟性: 4, 神识: 4 }, reputation: 15, exp: 260, flag: { 一句话: true } } },
      },
      {
        label: '继续劈柴',
        outcome: { text: '你把那一垛柴全劈了，劈到天黑。明白的那件事慢慢淡了，可你劈柴的手势变了，落斧之前会先停半息。这半息跟了你很多年。', effects: { attrs: { 道心: 5 }, exp: 280, flag: { 劈柴: true } } },
      },
    ],
  },
];
