# 设计说明：把 ink 的叙事结构搬进修仙模拟器

《问道长生》的骨架不是「游戏循环 + 弹窗」，而是 **ink 式的节点网络**：你永远站在某个节点上，读一段文字，做一个选择，然后被 divert 到下一个节点。回合制修炼只是这个大网络里的一层壳。

## 1. ink 概念 → 本作实现

| ink | 本作 | 代码位置 |
| --- | --- | --- |
| knot | 事件节点 `{ id, text, choices }` | `src/data/events/*.js` |
| stitch | 分支节点 `pool: 'branch'`，或 `goto` 指向的后续节点 | 同上 |
| choice | 带 `require` / `cost` / `once` 的选项 | `src/engine/narrative.js` |
| divert | `outcome.goto` | `src/engine/game.js#resolveOutcome` |
| weave | 选项结算后的 `result.text` + 效果行 | `src/engine/game.js#choose` |
| VAR / 条件 | 状态树 + 迷你表达式 `realm >= 3 && flag("入魔")` | `src/engine/expr.js` |
| external function | `flag() has() count() ach() sect() root()` | 同上 |
| 存档（ink save state） | 整个状态树 + RNG 状态序列化 | `src/engine/game.js#serialize` |

### 为什么不用 ink 运行时

ink 的编译产物（`.ink.json`）需要 `inkjs` 运行时。本作的目标是「双击 index.html 就能玩、GitHub Pages 零依赖」，所以用 150 行实现了一个够用的子集：

- 条件表达式：`&& || !`、比较、四则、括号、函数调用
- 没有列表（LIST）、没有 tunnel、没有 thread——用 `goto` 链和 flag 模拟
- 没有多行 weave 语法——文本直接写在数据里，支持函数式动态文本

代价是作者要写 JS 对象而不是 `.ink` 文本；收益是零构建、可测试、类型自由。

## 2. 节点执行流程

```
choose(i)
  ├─ 条件检查（require / cost / once）→ 不满足则按钮置灰
  ├─ 扣代价（时间、灵石、气血、物品）
  ├─ 应用 effects（修为、属性、flag、物品、成就…）
  ├─ roll 检定（属性加成）→ success / fail 分支
  ├─ combat → 进入战斗场景（多回合）
  └─ outcome
       ├─ text + 效果行 → 结果页
       ├─ goto → 直接进入下一个节点（剧情链）
       └─ ending → 结局页 + 轮回
```

所有状态变化都走 `applyEffects`，事件本身不直接改 `state`。这让「事件作者」和「数值系统」解耦，也让存档只依赖状态树。

## 3. 确定性随机

`RNG`（mulberry32）的状态 `{seed, s, calls}` 存进存档。读档后你会回到同一个卦象——同一场战斗的暴击、同一次突破的成败、同一个奇遇的抽取。这是 roguelite 叙事的基本礼貌。

随机只出现在三个地方：

1. 灵根抽取（权重表，见 `roots.js`）
2. 奇遇抽取（按 pool / 境界 / 条件过滤后加权，气运提高高 tier 权重）
3. 检定与战斗（`rng.chance`，受属性加成）

## 4. 境界与时间

- 10 境 × 3–9 层，修为曲线 `exp * growth^layer`
- 每次行动消耗 1–24 个月，寿元是硬约束
- 大境界突破必然触发天劫（3 重雷），失败会重伤、折寿，气血归零才死
- 寿元耗尽 / 心魔满值 / 气血归零 → 结局判定（按优先级取第一个命中的）

数值目标：一次完整人生约 **500 次选择、100–200 年**，6–9 小时；这是「一世」的粒度。

## 5. 宗门作为分支骨架

13 个宗门（6 正 / 3 中 / 3 邪 / 散修），每个宗门：

- 入门条件（属性 / 灵根 / 灵石）
- 独有功法加成（速度、攻击、丹道、阵法…）
- 任务风味文本（`taskFlavor`）
- 6 级晋升（外门 → 太上长老）
- 专属事件（`require: 'char.sectId == "taixuan"'`）

宗门不是「职业选择」，而是**叙事阵营**：正邪影响业力、声望、可触发的奇遇与结局。

## 6. 结局与轮回

- 24 个结局，按 `priority` 从高到低匹配条件
- 结局记入 `meta.unlockedEndings`，给轮回点
- 轮回点解锁 12 项永久天赋（属性、功法、突破加成、修炼速度）
- 灵根、宗门、结局、成就跨世累计，构成 meta 进度

## 7. 测试策略

| 层 | 工具 | 覆盖 |
| --- | --- | --- |
| 内容 | `tests/validate.mjs` | id 唯一、goto/结局/物品/敌人/成就引用、条件语法 |
| 引擎 | `node --test tests/engine.test.mjs` | 表达式、抽取、突破、天劫、战斗、存读档、成就 |
| 平衡 | `tests/simulate.mjs` | 多种子全流程模拟，输出回合/年份/结局分布 |
| UI | `tests/ui.spec.mjs` | 建角 → 抽灵根 → 选择 → 存/读/刷新 → 分支 → 结局 → 图鉴 |

## 8. 已知取舍

- 战斗是「叙事战斗」：四个按钮、伤害公式简单，不为策略深度服务，只为后果服务。
- 没有多人、没有服务端；存档在 localStorage，可导出 JSON。
- 文本量优先于系统复杂度：270+ 事件、24 结局、177 成就，而不是 30 个系统。
