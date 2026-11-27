# 进度

Original prompt: 参考 github.com/inkle/ink 的互动叙事设计，制作修仙模拟器（灵根抽取、境界突破、随机奇遇、宗门选择、角色属性、隐藏成就、多个结局），检查交互按钮、剧情分支和存档功能；完成后建立公开 GitHub 仓库，预计游玩时长 100hrs。

## 已完成
- 引擎：种子随机、ink 风格表达式、状态、效果结算、叙事运行器、战斗、天劫、结局、成就、存档、轮回天赋
- 数据：10 境界 / 21 灵根 / 11 出身 / 13 宗门 / 24 结局 / 177 成就（63 隐藏）/ 278 叙事节点
- UI：标题、建角、抽灵根、主界面、图鉴、存档、轮回天赋、响应式
- 测试：25 项引擎单测 + 19 项 Playwright 端到端 + 内容校验 + 8 种子平衡模拟
- 发布：公开仓库 flowxai/wendao-changsheng，v1.0.0 Release 附单文件可玩版
- 文档：README、DESIGN（ink 映射）、CONTENT_SCHEMA、PLAYTEST

## 已知限制
- GitHub Pages 的 Actions 部署在当前账号下启动失败（账号邮箱未验证），已改为 Release 单文件分发；fork 后开启 Pages 即可在线玩。
