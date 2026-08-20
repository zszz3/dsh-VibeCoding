# AGENTS.md — The documentation standard(中文对照)

[English 原文](AGENTS.md) | 中文

本文件定义文档结构、Markdown 分层、写作规则以及 `verify-doc-budgets` 的字数上限。放置位置与校验用 [dsh-doc-standards](../.agents/skills/dsh-doc-standards/SKILL.zh.md),必需覆盖与编辑判断用 [dsh-prose-standard](../.agents/skills/dsh-prose-standard/SKILL.zh.md);理由归 [doc-tiers 这篇 Agent Note](../.agents/notes/implemented/process/2026-07-04-doc-tiers-and-budgets.md) 所有。

## 文档结构

这些规则适用于面向人的文档;[Agent Notes](../.agents/notes/README.md) 不在其范围内。[事故复盘](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/postmortem/README.md)是以单次事故为范围的参考材料;其时间线记录的是证据,不是教学顺序。一篇文档的主题与它在树中的位置决定了它的范围:用适当的详细程度描述它自己的主题,而对直接子级只讲用途、职责和高层行为;更低层的细节链到拥有它的那个后代文档。文档类型不会放宽这个范围。参考类文档只允许对它自己的主题穷尽。测试机制、fixture 和测试框架属于拥有它们的最低层级;更高层的文档链过去。

把范围内的每篇文档划分为教程或参考。教程沿一条有序路径通向一个结果,每一步只引入这一步需要的东西。参考定义一个查阅范围和当前行为,不带教学顺序。篇幅可观的教程内容与参考内容要分开;其中一部分很小的时候,用小节标注即可。

写教程之前,先在心里判定读者的起点知识,以及每个概念属于初级、中级还是高级。先建立前置概念,再讲依赖它们的概念,难度逐步上升,把不必要的高级材料挪到后面的教程或参考里。

按这个顺序写作:先在树里给文档定位;定下它允许的详细程度;选择教程还是参考;若是教程,按前置关系与难度给概念排序;把该由后代文档拥有的细节挪走;把更低层的解释替换成指向其所有者的链接。

## 分层分类法:一个事实只有一个家

每个事实只有一个家 —— 也就是以它为职责的那个层级;在别处就链过去。

| 层级 | 职责 | 不属于这里的内容 |
|---|---|---|
| 根 `AGENTS.md` | 常驻命令:agent 在每个 session 都需要放进上下文的规则,每条一到三行,并链到它的家 | 故事、完整示例、情境化的操作步骤,以及任何从被链接的家里复述过来的内容 |
| 子树 `AGENTS.md`(`packages/`、`examples/`、`docs/`、`.agents/notes/`) | 专属于该子树的命令 | 根文件已经承载的仓库全局规则 |
| [architecture.md](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md) | 有序的地图:组装、核心包、循环、seam、扩展点;改 `packages/` 之前先读 | 类型定义(→ subsystems)、单个包的细节(→ 包 README)、决策理由(→ Agent Notes)、实现状态标注 |
| [subsystems/](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/README.md) | 每个子系统一页参考:类型定义、语义,以及生成的 Cordis API | 行为叙述(→ architecture.md) |
| [Agent Notes](../.agents/notes/README.md) | 活跃的决策记录:为什么、放弃了什么、以及必需的验证;`implemented/` 的记录用现在时描述已发布的现实 | 迁移计划、验收任务清单、fixture 走查,以及决策已经发布之后的规格式语气(「应该……」);归档的记录是冻结的历史,绝不是当前依据 |
| [postmortem/](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/postmortem/README.md) | 事故故事 —— 唯一允许写「战争故事」式叙述的层级 | — |
| [cookbook/](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cookbook/adding-a-package.md) | 带编号验证步骤的分步操作指南 | 设计理由(→ 每篇指南所链接的那篇 Agent Note) |
| [user/](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/index.md) | 由文档网站发布的面向产品的指南 | 生成的参考表格、贡献者操作步骤、决策历史 |
| 包 README | 每个包的契约:配置、语义、限制、扩展点,以及 [Model Experience](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cookbook/adding-a-package.md#4-write-the-package-readme) | 复述 JSDoc、复述生成的目录(事件/工具表格)、其他包的事情 |
| [development.md](development.md) | 贡献者环境搭建、日常工作流,以及 CI 的概要;它是[i18n 契约](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/i18n/README.md)下的一组双语对照 | 运行时/版本的理由(→ Agent Notes)、会与 `package.json` 脚本脱节的逐项检查清单 |
| 生成的参考:[subsystems/](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/README.md) 各页里的 `cordis-surface` 区块、[Cordis 核心 API 与继承层](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-api/context.md)、[tool-catalog](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/tool-catalog.md)、[config-catalog](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/config-catalog.md)、[persistence-catalog](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/persistence-catalog.md)、[module-graph.md](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/module-graph.md) | 从源码重新生成、并有时效门禁把关的穷尽式英文来源;经过审阅的中文对照走[配对工作流](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/i18n/README.md#scope-and-exclusions) | 手工编辑生成的英文来源或区块;中文对照只通过配对更新 |
| Skills(`.agents/skills/`) | 可复用的工作流与专门的决策标准 | 产品与运行时契约(→ 文档或源码) |

放置原则:缺陷 → 事故复盘;理由 → Agent Notes;操作步骤 → cookbook;类型定义 → subsystems;包的契约 → README;常驻命令 → 根 `AGENTS.md`,并附一个指向理由的链接。

## 写作规则

- **写当前状态,不写变更史。** 在持久的行文里避免「以前/现在/不再」、PR、commit 以及栈位置;点名当前生效的机制。变更故事放进 commit、PR、Agent Notes 或事故复盘;后两者可以引用已合并的 PR 与 issue 作为证据。
- **每个非平凡改动都在同一个 PR 里至少带一篇 Agent Note。** 更新拥有该决策的那篇,或者新增一篇;只有机械性的、局部的编辑豁免([适用范围](../.agents/notes/README.md#when-to-write-one))。
- **一段一物理行**(`verify-md-wrap`):靠编辑器软换行。代码块、表格和列表结构保持它们自己的格式;代码注释仍受 linter 的列宽限制。
- **围栏的 `ts` 代码块必须能编译**(`doc-typecheck`);粘贴的类型声明连同它原本的 JSDoc 用 ` ```ts type-equiv `,而去掉方法体的公开类声明用 ` ```ts public-api `;两者都要登记进 manifest,这样谁都不会漂移([机制](development.md#documenting-types-verbatim-ts-type-equiv))。
- **在重塑一个已记录类型的同一次改动里,更新拥有它的那个 [subsystems 页面](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/README.md)。** `verify-type-equiv` 抓的是漂移的粘贴,不是从未被记录过的新类型;一个类型记录在声明它的那个包组的页面上([页面归属](../.agents/notes/implemented/process/2026-08-03-package-anchored-subsystem-pages.md))。
- **双语对照一起更新**:由[术语表](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/i18n/terminology.md)指导,活跃 agent 的单趟工作会重新摆放首现标注、保留未改动的行文,并重新记录配对;`dsh-translate-docs` 仍然只由用户显式调用([契约](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/i18n/README.md))。
- **注释与 JSDoc 陈述完整的契约,不是推理过程的记录。** 保住行为、失败、时序、所有权、模态、例外、后果以及不显然的定位信息;删掉叙述、测试走查、评审分析和对代码的复述。保留本地的契约,并链到它的理由。细则见 [dsh-prose-standard](../.agents/skills/dsh-prose-standard/SKILL.zh.md)。
- 写得直接:点名行为主体与事实([决策](../.agents/notes/implemented/process/2026-08-09-concrete-prose-names-actors-and-recorded-facts.md))。`seam` 一词只留给它定义的那个能力。点名确切的检查、类型、API、操作或行为,而不是用「gate」「vocabulary」「surface」这类隐喻。

## 字数预算

[scripts/doc-budgets.manifest.json](https://github.com/deepseek-ai/deepseek-harness/blob/master/scripts/doc-budgets.manifest.json) 设定常设文档的上限;`pnpm run verify-doc-budgets` 会拒绝超额或缺失的文件。

门禁变红时:

1. **搬走**属于别的层级的内容;需要的话留一行链接。
2. **压缩**属于这里但可以更短的内容。
3. 只有在这些字确实需要空间时才**抬高**上限;并在 PR 里为 manifest 的这处改动给出理由。上限设得过低本身就是一个预算 bug。

上限是护栏,不是削减目标。在目标值以内时,至少保留 5% 余量;超过目标值时,冻结上限,直到搬迁或压缩把文档压回目标以内。只有在文档还有余量时才下调上限,而在内容否则就会被删掉时上调它。目标值:根 `AGENTS.md` ≤ 1,600 词;`architecture.md` ≤ 1,800;子树 `AGENTS.md` ≤ 600,其中 `packages/AGENTS.md` ≤ 650、本文件 ≤ 1,250 例外;`packages/README.md` ≤ 600。没有预算的层级由评审把关。

## 注水清单

在任何文档里搜查这些;[dsh-doc-standards](../.agents/skills/dsh-doc-standards/SKILL.zh.md) 会把这份清单当作一次审计来跑:

- 同一条规则出现在不止一个家里。用一个有特征的短语 grep 一下;保留一个家,其余改成链接。
- 叙述式的历史或战争故事:「以前」「现在」「不再」「过去是」「改名为」「被移动到」、PR 或 commit。陈述当前的事实;需要时链一篇 Agent Note 或事故复盘。
- 行文或图里的实现状态标注(「已实现!」「未来:……」)。状态会烂掉;仓库布局和包清单才承载它。
- 在源码或生成器才是权威的地方,手工复述目录、JSDoc,或者测试、包、状态的清单。
- 推理过程的记录:一步步的实现叙述、对显然分支的证明、测试走查,或者被否掉的局部备选方案。保留由此得出的契约或持久的理由;删掉推导它的那条路径。
- 理由被重复写在若干并列方法旁边,而不是在拥有它的那个能力或辅助函数处写一次。
- 段落墙:一段话里塞了好几条规则和插入语。把它拆开,或者把细节降级到它的家里。
- 强调通胀:到处都是加粗、全大写或「至关重要」,结果什么都不突出。强调只留给会改变行为的那个从句。
- `implemented/` 的 Agent Note 里出现规格式语气:「应该」、迁移计划、验收清单。一篇已实现的 Agent Note 描述的是「是什么」,依据是[已实现记录的说明](../.agents/notes/implemented/AGENTS.md)。

## 交叉引用用可机检的链接,绝不用自由行文

仓库内的引用用相对 Markdown 路径来链接,绝不用裸文件名或 Agent Note 编号。`verify-md-links` 会拒绝缺失的目标和失效的 `#fragment` 锚点([理由](../.agents/notes/implemented/process/2026-06-18-markdown-cross-link-lint.md))。
