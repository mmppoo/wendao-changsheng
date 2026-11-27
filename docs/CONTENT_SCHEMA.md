# 内容节点 Schema（ink 风格）

本作把 ink 的「knot / stitch / choice / weave」压缩成数据节点。一个节点就是一段可渲染的叙事场景。

```js
{
  id: 'ev_old_well',        // 全局唯一
  title: '古井',             // 日志与场景标题
  pool: 'wild',             // wild | world | sect | inner | story | tribulation
  tier: 2,                  // 1 凡 · 2 黄 · 3 玄 · 4 地 · 5 天 · 6 仙（影响气运加权）
  weight: 6,                // 抽取权重
  minRealm: 0, maxRealm: 9, // 境界门槛（含）
  require: 'flag("寒门")',   // 可选表达式
  once: true,               // 只触发一次
  text: '……',              // 字符串（支持 {name} {realm} 占位）或 (state) => string
  onEnter: { exp: 10 },     // 进入即结算
  choices: [Choice]
}
```

## Choice

```js
{
  label: '下井看看',
  hint: '神识 ≥ 20 · 有风险',
  require: 'char.attrs.神识 >= 20',   // 不满足则按钮置灰
  requireHint: '神识不足',
  cost: { month: 1, stones: 50, hp: 20, mp: 20, item: 'huxin_fu' },
  effects: { expPct: 0.1, attrs: { 道心: 1 } },  // 无条件先结算
  roll: {                          // 可选：概率分支
    p: 0.45,
    attrs: { 悟性: 0.01, 气运: 0.005 },  // 每点属性加的概率
    success: Outcome,
    fail: Outcome,
  },
  outcome: Outcome,                // 无 roll 时使用
  combat: { enemy: 'wolf', win: Outcome, lose: Outcome }, // 可选
  action: 'xxx',                   // 引擎内置动作，数据节点一般不用
  once: true,                       // 同一节点只能选一次
  hideIf: 'expr',                   // 条件成立则不显示
}
```

## Outcome

```js
{
  text: '结果文本',
  effects: { items: ['lingcao'], flag: { 见过古井: true }, achievements: ['a_ghost'] },
  goto: 'ev_old_well_deep',   // 跳转到另一个节点（多段剧情）
  ending: 'e_demon_devour',   // 直接触发结局
}
```

## effects 全部字段

`exp` `expPct` `stones` `hp` `mp` `attrs` `lifespan`(年) `reputation` `contribution` `karma` `demon` `injury` `heal`
`items` `removeItems` `techniques` `title` `flag` `counter` `buff` `relation` `sect` `realmSet` `time`(月) `achievements`

## 条件表达式

支持 `&& || !`、比较、四则、括号；可访问 `char.*`、`realm`、`layer`、`age`、`lifespan`、`stones`、`exp`、`demon`、`karma`、`reputation`，以及函数
`flag("x")` `has("yinqi_dan")` `count("alchemy")` `ach("a_jindan")` `sect()` `root()` `min/max/abs/floor`。

示例：`has("yinqi_dan") && char.attrs.道心 > 30 && !flag("入魔")`

## 写作约束

- 每条事件 2–4 个选择，至少一个选择带代价或检定。
- 文本 60–180 字，第二人称「你」，克制、具体、少形容词堆砌。
- 有分支后果：属性、物品、flag、goto 链、战斗、结局。
- `goto` 与 `flag` 名字必须存在于本文件或已注册节点。
