/**
 * 网文特色深度剧情扩展包（凡人苟道 / 退婚三年之约 / 血色禁地黄雀在后 / 坊市捡漏 / 灵兽孵化 / 城外劫修 / 上界使者）
 * 全部遵循 ink knot -> stitch -> flag/金手指回调结构，与全量检验器完全兼容。
 */
export const WEBNOVEL_EXPANSION = [
  /* ===================== 一、三年之约 · 宿敌林昊（三段主线） ===================== */
  {
    id: 'wn_oath_1', title: '风波 · 退婚与三年之约', pool: 'world', tier: 3, weight: 10, minRealm: 0, maxRealm: 2,
    once: true,
    text: '落霞城茶楼外骤然寂静。三辆青铜灵马车停在阶前，林氏世家少主林昊居高临下，随手将一纸退婚退盟玉书掷在你脚边。\n\n「{name}，你一介{root}，也配与我林家攀附？拿了这五十块下品灵石，从此莫再提旧约。」\n\n四周看客窃窃私语，几名世家子弟嗤笑出声。',
    choices: [
      {
        label: '拾起玉书折断：「三十年河东，三年后问道台见！」', hint: '立下三年之约 · 热血打脸线，道心与战意大涨',
        outcome: {
          text: '你指节捏得发白，当众将玉书震作齑粉：「今日之辱，三年后当着全城修士的面，连本带利还你！」\n\n林昊冷笑拂袖而去。你转身离开时，满街酒客都记住了你的道号。',
          effects: { attrs: { 道心: 6, 根骨: 2 }, reputation: 35, flag: { 三年之约: true, 宿敌林昊: true }, title: '立约少年' },
          log: '与林昊立下三年之约',
        },
      },
      {
        label: '不动声色收下五十灵石，拱手赔笑（苟道忍辱）', hint: '龟息稳健流 · 先拿资源再暗中算账',
        outcome: {
          text: '你笑眯眯弯腰把灵石袋捡起来掂了掂：「林少主大气，这门亲事退得好。」\n\n众人只当你是软骨头。只有你自己知道，那张玉书背面沾了林昊一缕本命灵气——足够日后精准寻仇。',
          effects: { stones: 80, attrs: { 道心: 4, 悟性: 3 }, flag: { 忍辱藏锋: true, 宿敌林昊: true } },
          log: '收下退婚灵石，暗记林昊气息',
        },
      },
      {
        label: '【剑老传音】引动一缕残剑威压，震碎马车车辕', hint: '残剑老祖魂专属 · 当场反震全场！',
        require: 'flag("金手指_剑老")', requireHint: '需携有「残剑老祖魂」',
        outcome: {
          text: '识海里剑老冷哼一声：「区区世家小辈也敢吠叫？借你半息剑意！」\n\n你并指一划，无形剑气轰然劈断青铜车辕。灵马受惊长嘶，林昊脸色煞白连退三步：「你……你竟藏了高阶剑符？！」',
          effects: { reputation: 90, attrs: { 道心: 8, 根骨: 3 }, stones: 120, flag: { 三年之约: true, 剑震林昊: true, 宿敌林昊: true } },
          log: '借剑老威压当众震慑林昊',
        },
      },
    ],
  },
  {
    id: 'wn_oath_2', title: '决战 · 问道台赴约', pool: 'story', tier: 4, weight: 0, minRealm: 1,
    once: true,
    text: (s) => `三年期满，落霞城演武广场人山人海。\n\n高台之上，林昊一袭金纹法袍，已然筑基，脚下浮着一柄上品灵剑。见你缓步登台，他冷笑道：「${s.flags['忍辱藏锋'] ? '当日捡灵石的软脚虾，竟真敢来送死？' : '你若现在跪下磕三个头，我便只废你修为，留你一命。'}」`,
    choices: [
      {
        label: '拔剑登台，正面碾压！', hint: '宿命对决 · 击败筑基天骄林昊',
        combat: {
          enemy: 'cultivator',
          win: {
            text: '最后一剑挑飞林昊的灵剑，剑锋抵在他咽喉半寸前。演武场先是死寂，随即爆出震天哗然！\n\n林氏长老铁青着脸丢下赔礼灵石与一颗筑基丹，架起昏迷的林昊仓皇离去。自这一日起，你的名号传遍方圆千里。',
            effects: { stones: 600, reputation: 180, items: ['zhuji_dan', 'xuantie'], attrs: { 道心: 10 }, flag: { 败林昊: true }, counter: { arena_win: 2 }, title: '潜龙新星' },
            goto: 'wn_oath_3',
          },
          lose: {
            text: '林昊凭家族秘宝险胜半招。你抹去嘴角血渍，盯着他笑道：「记住今天，下次再见，没人保得住你。」',
            effects: { hp: -40, attrs: { 道心: 5, 悟性: 3 }, flag: { 约战惜败: true } },
          },
        },
      },
      {
        label: '【天机镜/苟道】先示弱诱其轻敌，再借阵反杀', hint: '智取破防 · 神识/气运检定',
        require: 'flag("金手指_天机镜") || flag("金手指_苟道") || char.attrs.神识 >= 18',
        requireHint: '需天机镜、龟息诀或神识 ≥ 18',
        roll: {
          p: 0.72, attrs: { 神识: 0.01, 气运: 0.008 },
          success: {
            text: '你故意露出气息虚浮之态。林昊大笑扑来，却一脚踏进你提前布下的困灵阵纹，护体灵光瞬间溃散，被你一掌震下高台！全场惊呼连连。',
            effects: { stones: 520, reputation: 160, items: ['zhuji_dan'], attrs: { 悟性: 6, 道心: 6 }, flag: { 败林昊: true }, counter: { arena_win: 2 }, title: '扮猪吃虎' },
            goto: 'wn_oath_3',
          },
          fail: {
            text: '林昊早有防备，祭出护身玉佩震碎阵纹。你只能仓促退下擂台，却摸清了林家的功法破绽。',
            effects: { hp: -35, attrs: { 悟性: 4 } },
          },
        },
      },
    ],
  },
  {
    id: 'wn_oath_3', title: '余波 · 林氏密函', pool: 'branch', tier: 4, weight: 0,
    text: '夜里你在客栈清点战利品，从林昊赔礼的储物袋夹层里抖出一封未拆的血漆密函——上面竟盖着某座上古秘境的入场令印，还提到「血色禁地」即将开启。',
    choices: [
      {
        label: '记下禁地坐标，焚毁密函', hint: '为后续血色禁地夺宝埋下先机',
        outcome: {
          text: '火苗吞没密函。你收起禁地令牌，嘴角微扬——林家替你探好的路，不走白不走。',
          effects: { expPct: 0.25, flag: { 禁地密图: true } },
        },
      },
    ],
  },

  /* ===================== 二、血色禁地 · 黄雀在后（三段夺宝） ===================== */
  {
    id: 'wn_blood_trial_1', title: '秘境 · 血色禁地试炼', pool: 'wild', tier: 4, weight: 7, minRealm: 1,
    once: true,
    text: '十年一开的血色禁地雾瘴弥漫，无数低阶修士为争夺筑基灵药杀红了眼。\n\n你潜行至一处石窟外，忽听里面剑气轰鸣——两名大宗真传弟子正为石台上一池「万年灵乳」拼得两败俱伤，双双灵力见底！',
    choices: [
      {
        label: '屏息潜伏，等他们拼完再当「黄雀」', hint: '凡人流经典操作 · 坐收渔翁之利',
        cost: { month: 1 },
        roll: {
          p: 0.65, attrs: { 神识: 0.01, 气运: 0.01 },
          success: {
            text: '半炷香后，两人同归于尽般倒在血泊中。你施施然走出石影，顺手补了两张火球符清理战场，将灵乳与两只沉甸甸的储物袋尽数收入囊中！',
            effects: { stones: 900, items: ['zhuji_dan', 'lingcao', 'xuantie'], expPct: 0.45, karma: -10, flag: { 禁地黄雀: true }, counter: { secrets: 1 } },
            goto: 'wn_blood_trial_2',
          },
          fail: {
            text: '你脚下踩碎一块枯骨，惊动了尚余一战之力的红衣真传！对方怒喝一声挥剑杀来！',
            combat: {
              enemy: 'blood_cult',
              win: {
                text: '恶战过后，你踩着满地碎剑独吞了万年灵乳，战利品比预想还丰厚三分。',
                effects: { stones: 750, items: ['zhuji_dan', 'huiling_dan'], expPct: 0.4, counter: { secrets: 1 } },
                goto: 'wn_blood_trial_2',
              },
              lose: { text: '你被一道血光逼退石窟，好在脱身及时，未丢性命。', effects: { hp: -60, injury: 1 } },
            },
          },
        },
      },
      {
        label: '【绿瓶催熟】趁乱取走石壁枯萎的伴生灵芝', hint: '掌天小绿瓶专属 · 众人眼皮底下拿走真正至宝',
        require: 'flag("金手指_绿瓶")', requireHint: '需携有「掌天小绿瓶」',
        outcome: {
          text: '那两人只盯着灵乳，却不知石壁缝里那株干枯药根才是上古紫芝！你悄无声息将其挖走，夜里滴上一滴绿液——紫光冲天，瞬间化作千年仙药！',
          effects: { items: ['xisui_dan', 'lingcao', 'lingcao'], lifespan: 30, expPct: 0.5, flag: { 万年灵草: true }, counter: { secrets: 1 } },
          goto: 'wn_blood_trial_2',
        },
      },
      {
        label: '高声示警，趁两人停手时平分灵乳', hint: '正道之风 · 结善缘赚声望',
        outcome: {
          text: '两宗弟子见有第三人坐镇，不敢再死斗，各自拱手分了灵乳离去。你虽少拿两份，却落得个公道美名。',
          effects: { expPct: 0.25, reputation: 65, karma: 25, attrs: { 道心: 4 }, counter: { secrets: 1 } },
        },
      },
    ],
  },
  {
    id: 'wn_blood_trial_2', title: '禁地 · 传送阵前截杀', pool: 'branch', tier: 4, weight: 0,
    text: '禁地即将关闭，唯一生门传送阵光芒大盛。阵前却横着三名蒙面劫修，刀口滴血：「想出禁地？把储物袋留下，滚进去！」',
    choices: [
      {
        label: '冷笑拔剑：「正好，我也嫌储物袋太轻！」', hint: '以杀止杀 · 反杀劫修摸尸',
        combat: {
          enemy: 'rogue',
          win: {
            text: '你踩过劫修尸身，顺手搜出三袋灵石与一张泛黄古方，大步踏入白光冲天的传送阵。',
            effects: { stones: 480, items: ['shenxing_fu', 'liaoshang_dan'], reputation: 50, attrs: { 根骨: 3 } },
          },
          lose: {
            text: '你硬吃一刀强行撞进传送阵，摔出禁地时浑身是血，好在保住了性命与宝物。',
            effects: { hp: -55, injury: 1 },
          },
        },
      },
      {
        label: '扔出一把假丹药烟雾弹，御风冲阵', hint: '机敏脱身',
        outcome: {
          text: '浓烟骤起，劫修以为是毒雾纷纷退避。你哈哈一笑，身形如箭窜入传送光柱！',
          effects: { attrs: { 气运: 3, 悟性: 2 }, expPct: 0.15 },
        },
      },
    ],
  },

  /* ===================== 三、坊市捡漏 · 残锈剑胎 ===================== */
  {
    id: 'wn_stall_leak_1', title: '坊市 · 角落摊位捡漏', pool: 'world', tier: 3, weight: 9, minRealm: 0,
    once: true,
    text: '坊市最偏僻的墙角，一个邋遢散修摆了块破布，上面堆着碎铜烂铁。最不起眼的角落压着一枚巴掌大、锈成暗红色的铁片，标价「三十灵石，概不还价」。\n\n你路过时，丹田里的灵力竟莫名轻颤了一下。',
    choices: [
      {
        label: '装作漫不经心，连同旁边两件破铜一并打包买下', hint: '耗 40 灵石 · 老江湖防露馅买法',
        require: 'stones >= 40', requireHint: '灵石不足 40',
        cost: { stones: 40 },
        outcome: {
          text: '你故意挑了半天破铁锅，最后随口把红锈铁片搭在一起付账。回洞府以灵火洗去铁锈——竟是一枚上古剑胎残片，还暗藏半篇炼器秘法！',
          effects: { items: ['xuantie', 'canjian'], attrs: { 悟性: 4, 气运: 3 }, flag: { 坊市捡漏: true, 得地阶法宝: true } },
          goto: 'wn_stall_leak_2',
        },
      },
      {
        label: '【天机镜/剑老】直接看穿真身，并反向杀价到十灵石', hint: '金手指专属 · 血赚捡漏',
        require: 'flag("金手指_天机镜") || flag("金手指_剑老")', requireHint: '需天机镜或残剑老祖魂',
        require2: '',
        cost: { stones: 10 },
        outcome: {
          text: '你一眼照出铁片内蕴的太古星金，面不改色地嫌弃它「铁质太脆」，十块灵石便将其拿下。摊主还暗自庆幸宰了只肥羊。',
          effects: { items: ['xuantie', 'leimu', 'canjian'], attrs: { 气运: 5, 神识: 3 }, flag: { 坊市捡漏: true, 得地阶法宝: true } },
          goto: 'wn_stall_leak_2',
        },
      },
      {
        label: '多半是骗局，转身离开', hint: '谨慎行事',
        outcome: {
          text: '修真界十漏九坑。你没有回头，但三天后听坊市传闻，有人在那摊位掏出了一块上古剑胎……你沉默了一盏茶功夫。',
          effects: { attrs: { 道心: 2 } },
        },
      },
    ],
  },
  {
    id: 'wn_stall_leak_2', title: '暗巷 · 财不露白', pool: 'branch', tier: 3, weight: 0,
    text: '刚出坊市三里，雾色渐浓。身后屋脊上传来两声轻笑：「道友刚买的铁片挺衬手，不如借兄弟们掌掌眼？」',
    choices: [
      {
        label: '反身拔剑：「我等你们很久了！」', hint: '反杀劫修 · 收获储物袋',
        combat: {
          enemy: 'bandit',
          win: {
            text: '劫修伏诛。你熟练地摸走对方储物袋，又弹指一团火球毁尸灭迹——凡人修仙第一课，莫留后患。',
            effects: { stones: 240, items: ['liaoshang_dan'], reputation: 20 },
          },
          lose: {
            text: '你拼着挨了一刀遁入密林，好在剑胎贴身藏好，未落入贼手。',
            effects: { hp: -35 },
          },
        },
      },
      {
        label: '祭出神行符，瞬间消失在夜雾中', hint: '安全撤离',
        outcome: {
          text: '青风卷起，你一掠数十丈，把两名劫修远远甩在身后。',
          effects: { attrs: { 气运: 2 } },
        },
      },
    ],
  },

  /* ===================== 四、石蛋奇缘 · 孵化伴生灵兽 ===================== */
  {
    id: 'wn_pet_egg_1', title: '奇遇 · 荒谷灵兽石蛋', pool: 'wild', tier: 4, weight: 8, minRealm: 0,
    once: true,
    require: '!char.petId',
    text: '你在断崖兽巢深处发现一枚布满金银纹路的温热石蛋。蛋壳轻轻跳动，像是感应到你的灵根，竟主动滚到你的鞋尖前。',
    choices: [
      {
        label: '滴血认主，以玄水灵气温养（孵化玄水灵龟）', hint: '得伴生灵兽「玄水灵龟」：护主减伤 + 寿元 +40年',
        cost: { hp: 20, month: 1 },
        outcome: {
          text: '蛋壳咔嚓裂开，一只巴掌大、背刻天然八卦纹的碧绿小龟探出头，亲昵地蹭了蹭你的手指。',
          effects: { pet: 'pet_turtle', lifespan: 40, attrs: { 道心: 3 }, flag: { 契约灵兽: true } },
          log: '孵化伴生灵兽「玄水灵龟」',
        },
      },
      {
        label: '以锋锐灵力催发（孵化青鸾雏鸟）', hint: '得伴生灵兽「青鸾雏鸟」：攻击 +14% + 气运 +5',
        cost: { mp: 20, month: 1 },
        outcome: {
          text: '清越凤鸣响彻山谷！一只尾羽带青电的雏鸟破壳而出，振翅落到你的肩头。',
          effects: { pet: 'pet_bird', attrs: { 气运: 5 }, flag: { 契约灵兽: true } },
          log: '孵化伴生灵兽「青鸾雏鸟」',
        },
      },
      {
        label: '以精血与玄铁喂养（孵化噬金灵虫）', hint: '得伴生灵兽「噬金灵虫」：破甲攻击 +20% + 灵石收益提升',
        cost: { hp: 25, month: 1 },
        outcome: {
          text: '金芒一闪，一只通体赤金的甲虫破壳而出，一口便把旁边一块矿石咬得粉碎！',
          effects: { pet: 'pet_beetle', attrs: { 根骨: 3 }, flag: { 契约灵兽: true } },
          log: '孵化伴生灵兽「噬金灵虫」',
        },
      },
      {
        label: '以神识温柔抚慰（孵化九尾白狐）', hint: '得伴生灵兽「九尾白狐」：心魔抗性 +25% + 魅力 +6',
        cost: { month: 1 },
        outcome: {
          text: '雪白幼狐钻出蛋壳，身后摇晃着三条毛茸茸的小尾巴，睁着琥珀般的眼睛望向你。',
          effects: { pet: 'pet_fox', attrs: { 魅力: 6 }, demon: -10, flag: { 契约灵兽: true } },
          log: '孵化伴生灵兽「九尾白狐」',
        },
      },
    ],
  },

  /* ===================== 五、上界使者降临 · 荒古秘辛（后期史诗） ===================== */
  {
    id: 'wn_upper_envoy_1', title: '天变 · 上界巡查使者', pool: 'story', tier: 5, weight: 0, minRealm: 4,
    once: true,
    text: '苍穹裂开百里金缝，三名身披白玉甲胄的「上界巡查使」踏云降临，威压笼罩九州。\n\n为首银甲使者俯视下界众宗，声音冷漠如宣旨：「下界灵脉衰减，即日起每百年收缴九成灵石与天骄骨血入仙库。{name}，你既已入化神，便替本使掌管征缴吧。」',
    choices: [
      {
        label: '冷笑抽剑：「下界的灵气，轮不到上界来割韭菜！」', hint: '逆天伐仙 · 硬撼上界金甲使者，名震万古',
        combat: {
          enemy: 'demon_king',
          win: {
            text: '你一剑劈碎金甲使者的仙诏玉牌！漫天金血洒落九州，无数下界修士仰望苍穹，齐声高呼你的道号。\n\n裂缝合拢前，一道恐怖神念锁定了你：「好一个下界蝼蚁，飞升之日，天门等你！」',
            effects: { reputation: 500, attrs: { 道心: 15, 根骨: 8, 悟性: 8 }, stones: 5000, items: ['tianjie_dan'], title: '斩使逆天', flag: { 斩上界使: true } },
            log: '当众斩杀上界巡查使，震动九州',
          },
          lose: {
            text: '上界仙器威能惊世，你浴血重伤退入云海。但这一剑已劈开了下界修士心里的枷锁。',
            effects: { hp: -200, reputation: 200, attrs: { 道心: 10 }, flag: { 逆抗上界: true } },
          },
        },
      },
      {
        label: '表面领旨周旋，暗中截留半数上界仙丹与古图', hint: '权谋隐忍 · 闷声发大财',
        outcome: {
          text: '你俯身领过玉牌，面上恭敬无比，暗地里却把上界赏赐的九转仙丹与飞升密道图尽数收入囊中。',
          effects: { stones: 3500, items: ['jiuzhuan_dan', 'pozhang_dan'], karma: -40, attrs: { 悟性: 6 }, flag: { 虚与委蛇: true } },
        },
      },
    ],
  },

  /* ===================== 六、诡秘道心劫 · 真假修仙界 ===================== */
  {
    id: 'wn_dao_heart_1', title: '异象 · 坐忘真假界', pool: 'inner', tier: 4, weight: 6, minRealm: 2,
    once: true,
    text: '闭关第七日，你忽然睁开眼——眼前的石洞竟化作一间白炽灯惨亮的病房，窗外车水马龙。穿白大褂的人叹了口气：「又犯病了，嘴里念叨什么金丹元婴呢。」\n\n可你掌心那枚温热的储物戒，分明还在微微发烫。',
    choices: [
      {
        label: '「假作真时真亦假，一剑斩破幻境！」', hint: '道心检定 · 破除诡秘心魔大劫',
        roll: {
          p: 0.6, attrs: { 道心: 0.01, 神识: 0.01 },
          success: {
            text: '你并指化剑，白炽灯与病房如琉璃般寸寸崩裂！你重回石洞蒲团，浑身大汗，识海却前所未有地澄明透亮。',
            effects: { demon: -30, attrs: { 道心: 12, 神识: 8 }, expPct: 0.4, flag: { 镜中人: true }, title: '破妄真人' },
          },
          fail: {
            text: '你分不清哪边才是真的，在两个世界的夹缝里游荡了整整三日才挣脱出来。',
            effects: { demon: 12, attrs: { 悟性: 5 }, flag: { 镜中人: true } },
          },
        },
      },
      {
        label: '在「现代病房」里静静坐一晚，记下梦里的只言片语', hint: '以奇异视角反观大道',
        outcome: {
          text: '你看着窗外的霓虹与车流，忽然笑了：「无论这是梦还是仙途，我走过的路都是真的。」天明时，病房化作晨雾散去。',
          effects: { attrs: { 悟性: 10, 道心: 6 }, demon: -12, flag: { 镜中人: true } },
        },
      },
    ],
  },

  /* ===================== 七、财不露白 · 拍卖后劫杀 ===================== */
  {
    id: 'wn_ambush_1', title: '截杀 · 财不露白', pool: 'world', tier: 3, weight: 6, minRealm: 1,
    require: 'stones >= 500',
    text: '刚出城门十里，三道黑影自古松跃下，结成三才杀阵堵住官道：「道友在坊市出手阔绰，不如留下储物袋买条活路！」',
    choices: [
      {
        label: '「正愁没处试剑，来得好！」', hint: '迎战劫修 · 反杀得财',
        combat: {
          enemy: 'cultivator',
          win: {
            text: '三名劫修尽数伏诛，你从头领怀里摸出一袋灵石与一枚破障丹，吹着口哨继续赶路。',
            effects: { stones: 380, items: ['pozhang_dan'], reputation: 35 },
          },
          lose: {
            text: '你丢出一把灵石扰乱对方视线，借机负伤突围。',
            effects: { stones: -180, hp: -45 },
          },
        },
      },
      {
        label: '【龟息诀/天机镜】早已看穿埋伏，引官道护卫巡逻队撞个正着', hint: '借刀杀人 · 无伤白嫖声望',
        require: 'flag("金手指_苟道") || flag("金手指_天机镜")', requireHint: '需龟息诀或天机镜',
        outcome: {
          text: '你早绕道引来落霞城执法队，三名劫修当场被擒。执法队长拱手谢你举报有功，赏下百枚灵石！',
          effects: { stones: 150, reputation: 45, attrs: { 悟性: 2 } },
        },
      },
    ],
  },
];

export const WEBNOVEL_TRIGGERS = [
  { id: 'wn_oath_2', when: 'flag("宿敌林昊") && realm >= 1 && !flag("story:wn_oath_2") && !flag("败林昊")' },
  { id: 'wn_upper_envoy_1', when: 'realm >= 4 && !flag("story:wn_upper_envoy_1")' },
];
