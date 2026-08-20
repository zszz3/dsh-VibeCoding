# Finding DeepSeek Harness Simplifications(中文对照)

[English 原文](SKILL.md) | 中文

> 这是英文原文的中文对照,供阅读方便。**英文原文是权威版本**,执行规则时以原文为准。

本 skill 在 deepseek-harness 仓库中寻找不显然的简化候选、撰写提议中的 Agent Note 或行内 TODO/FIXME/XXX 注释、审计或合并已被取代的 Agent Note、从另一 PR 吸纳有价值的简化思路时触发,尤其适用于已死的、重复的、投机性的、过度设计的、先增后删的,或本可用现成依赖却选择手写的曲面。

## 先从仓库上下文入手

- 阅读 `AGENTS.md`,尤其是其中的预发布立场(pre-release stance)与约定(包括 tests-are-not-golden-truth「测试不是金科玉律」与 Agent Notes-are-not-golden-truth「Agent Note 不是金科玉律」这两条原则),外加 [docs/defensive-patterns.md](../../../docs/defensive-patterns.md) 与 [docs/testing.md](../../../docs/testing.md)。
- 在判断 `packages/` 下任何内容之前,先浏览 [docs/architecture.md](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md);与服务图谱(service map)或事件分类(event taxonomy)相悖的简化需要额外证据。
- 借助 Agent Note 树及其 [规则](../../notes/README.md) 来理解有意为之的架构。最相关的已实施(implemented)示例见 [删除可变会话摘要](../../notes/implemented/simplification/2026-06-19-drop-mutable-session-summary.md)、[共享持久化写入协调器](../../notes/implemented/architecture/2026-06-18-shared-persistence-write-coordinator.md)、[能力 seam](../../notes/implemented/architecture/2026-06-13-capability-seams.md),以及 twin adapter / dual persistence backend 这两类 Agent Note。
- 默认将双 LLM 适配器与双持久化后端视为有意为之。只要用户没有明确推翻该约束,就不要以"low effort"(代价低)为由提议删除任意一侧的 twin/backend。但移除某个受保护 seam 内无人使用的方法或钩子,若不致使该受保护设计瓦解,仍可以是合理的。

## 什么算得上强候选

好的简化应当移除、折叠或降级某个真实存在的东西,并且有明确证据表明:当前设计付出的代价大于它带来的价值。

- 某个公共方法、事件、配置旋钮(config knob)、注册表通知、辅助函数、包、持久化事件(durable event)或测试制品,在生产中没有消费者。
- 测试或文档是仅有的消费者,且它们锁定的行为并不承重(load-bearing)。
- 两种表征镜像同一事实,尤其是在持久化会话事件(durable session events)与瞬时 `agent/*` 事件之间。
- 某个 seam 拥有一组每个实现都必须支持、却没有任何消费者使用的方法。
- 某个独立包仅为测试/演示/支持代码而存在,并额外带来发布或依赖开销。
- 某项功能实现了投机性(speculative)的产品通用性:多会话/会话加载(multi-session/session-load)、后台作业花名册(background job rosters)、实时注册表失效(live registry invalidation)、回合中转向(mid-turn steering)、工具拥有的 UI 渲染(tool-owned UI rendering),以及类似但无产品负责人的设计。
- 某个不变量(invariant)、回滚路径、预期输出集合或特例测试,其存在只是为了保护一个无人使用的 API。
- 手写(hand-rolled)代码重新实现了某个维护良好的外部包,或引擎底线(engine floor)上的 Node 内置(Node builtin)已经提供的能力,且替换之举将一并删除该实现及其专属测试([依赖政策](../../notes/implemented/process/2026-07-26-dependencies-over-hand-rolling.md))。
- 简化后的行为可能略有差异,但新行为仍然合理、更易解释。

单薄的候选通常不足以成为一条 Agent Note:例如删除一个拼写错误、运行一次 `knip`、移除某个被有意记录的后端/适配器,或在没有调用点(call-site)证据的情况下仅标注"this looks complex"。

## 广泛摸底

当用户要求广度或大量候选时,使用并行 subagents(子智能体)。给每个 agent(智能体)划定一个领域,并要求证据而非猜测。可用领域:

- agent 循环与会话日志:回合/步边界、转向(steering)、中止/取消、持久化事件(durable events)、回放(replay)、加载/恢复(load/resume)。
- ACP 自动化与人类 UI API:协议侧的提示词(prompt)结算与拆卸;UI 侧的文稿(transcript)渲染与交互状态。
- LLM/工具/系统提示词(system prompt):流式/生成 API、汇编器、注册表、工具 schema 默认值、呈现钩子(presentation hooks)。
- Bash 与工具执行:前台/后台分离、作业归属、输出溢出文件、执行器方法。
- 包/示例/脚本/测试:包拆分、静态清单、冗余快照(snapshot)预期输出、支持包。

如果 subagent 不可用,自行模拟同样的广度。不要让第一个不错的候选中断整个摸底。

从生产代码中最大的差异入手。一个在显而易见的无用符号之后就停下来的简化审计,会漏掉那些重复的生命周期或防御机制承担了大部分代价的文件。

## 审计信任与生命周期边界

对于每一份防御性副本、冻结(freeze)、校验器(validator)与回调捕获(callback capture),都要指明值来自何处、接下来归谁所有。同进程中的类型化服务/插件(same-process typed service/plugin)调用通常借用只读值;解析器、配置加载器、队列、模型/工具 JSON、持久化文件、worker、进程与 wire 解码器则拥有或校验各自的数据。围绕恶意 getter、伪造的类型对象、回调替换,或同进程交接之后发起的变更来构建的测试,只是证明该契约可能具有投机性(speculative)的证据,并不能因此自动成为保留它的理由。

对于复杂的异步代码,先绘制所有权图,将每个哨兵、就绪承诺、取消路径、处置器与状态标志,都对应到明确的所有者或转换。当若干机制在镜像同一活跃性或结算事实时,应提议改为由单一事务或生命周期(lifecycle)控制器统一处理。只有在需要保护同步发布与回滚、回调遏制、首个终端结果仲裁、worker/进程归属,或"处置到静止"(dispose-to-quiescence)之处,才保留各自的机制。

## 手写代码 与 依赖

引入依赖是一项有效的简化举措,而非政策例外:[依赖政策](../../notes/implemented/process/2026-07-26-dependencies-over-hand-rolling.md)规定了准入门槛。在摸底时,对协议解析器、帧构造器、重试/回退循环、glob 匹配器、diff 引擎及类似基础设施追问一句:某个维护良好的 npm 包,或仓库引擎底线(engine floor)上的 Node 内置(Node builtin),是否已经实现了这些能力?

像证明其他候选一样证明某个依赖替换候选,此外还需:

- 阅读该手写(hand-rolled)实现,指明该包所覆盖的确切表面积;包未覆盖的残留语义会抵消该替换的收益,并留在 Agent Note 中。
- 诚实地核查该包的活跃度(含维护、采用度、传递影响范围),并在引擎底线(engine floor)已提供内置方案时优先使用内置。
- 先查看 Agent Note 树:schemastery、vendored Cordis、twin 适配器与其他已记录的 seam 均已尘埃落定;欲瓦解其中之一的替换,必须胜过已记录的理由(rationale),而不能只引用政策。
- 权衡净删除量:实现 + 专属测试 + 文档,减去剩余的黏合代码(glue)。一个把同样复杂度挪了位置的 wrapper 并非真正的胜利。

## 证明或否决每个候选

对于每个符号或行为,在动笔前先对消费者分类:

- 生产语料(production corpus):`packages/*/src`、`examples/*/src`、`examples/**/*.yml`、运行时脚本与加载器/配置路径。
- 非生产语料(non-production corpus):测试、README/文档、Agent Note、快照(snapshot)、生成的预期输出,以及注释。
- 模糊语料(ambiguous corpus):可能属于产品冒烟路径(product smoke path)的示例与脚本。分类前先检查用法。

先用 `rg`。好的搜索包括:精确符号、事件名、包名、配置键(config key)、同时包含 `.name(` 与 `name(` 的方法名,以及任意 wire 字符串。然后阅读调用点(call-site)。`knip` 可以帮忙,但它替代不了对公共接口、动态事件名、测试、文档与 Cordis 加载器路径的理解。

在下列情况下否决或降级某个候选:

- 存在生产调用方,且该简化将是一项功能决策(feature decision),而非清理。
- 该 API 已由某条已实施的 Agent Note 或来之不易的防御模式明确支撑,且新证据无法胜过那条理由。
- 该移除会引发无关搅动(churn),却又并未真正削减公共 API 或必需行为。
- 想法本身没错,但太过微小。此时应改用有针对性的 TODO/FIXME/XXX,并按 [docs/development.md](../../../docs/development.md) 中的紧急度语义标注。

## 合并已被取代的 Agent Note

当用户要求减少或合并 Agent Note 树时,或当正在实施的简化致使某条所属 note 过期时,审计该树。不要将每次代码简化摸底都扩大成一次仓库范围的 note 审计。

使用 [`dsh-archive-agent-notes`](../dsh-archive-agent-notes/SKILL.zh.md) 进行留存判定与归档操作。未来价值低的已实施 note 以冻结三元组(frozen triplet)形式移入 `archived/{kind}`;提议中的 note 绝不归档;已无法防止某类诱人失误(tempting mistake)的已否决 note 予以删除。在简化当前文案或代码时,不要编辑已归档的 note。

遵循 [Agent Note 规则](../../notes/README.md#when-to-write-one)中的删除规则;不要在此重复或弱化它。对于每个候选链:

1. 从已交付代码、配置、生成的目录、包文档、更新的 Agent Note 以及入站链接中识别出当前 owner(所有者);日期与标题只是发现线索,而非证明。
2. 将旧 note 归类为完全取代或部分取代。任何留存下的行为、现行契约、持久化格式、兼容性义务,或独立仍具时效的已否决方案,都会使其成为部分取代。可以移交给当前 owner 的理由本身,并不会让取代关系因此变为部分取代。
3. 对于完全取代,把所有独特的理由、备选方案、后果、已交付验证证据,以及明确的覆盖率(coverage)缺口,都移交给当前 owner。一份只描述已删除实现机制(implementation mechanics)的清单,并不属于上述决策事实。
4. 修复所有入站链接,然后一并删除英文 note、中文对应版本与一致性记录。
5. 编辑之后,搜索精确的文件名、符号、配置键(config key)、事件名与 wire 字符串。让部分取代保持交叉链接且为最新。

"先增后删"的功能是常见的完全取代案例。只有在以下条件全部满足时,才让删除 note 承载历史:该功能在已交付代码、配置、schema、持久化或 wire 格式、迁移与兼容性行为中均已不存在;没有任何现行文档把它呈现为可用;也没有任何测试把它当作受支持行为来覆盖。删除理由与强制"不存在"(absence)的测试可以保留。保留该功能当初为何存在、当初的动机为何不再成立、完整删除之外的其他备选、放弃的能力、重新引入的条件,以及删除已完成的证据。那些只验证已删除行为的老测试与实现机制(implementation mechanics),并非现行验证证据。

在下列情况下拒绝合并:该删除只是某个功能的一种传输方式、默认值、实现或呈现;持久化数据或兼容性处理仍然存在;或该删除 note 尚未承载足够的理由(rationale)以防止意外重新引入。即使已删除的实现已不复存在,某项现行否定性设计决策也可能正当地需要它自己的 note。

## 编写 Agent Note

每个持久化提案在 `.agents/notes/<lifecycle>/<class>/yyyy-mm-dd-topic.md` 下创建一个文件,遵循 `.agents/notes/README.md` 中的生命周期(lifecycle)与分类规则。把文案(prose)段落保持在一行物理行内,并使用相对 Markdown 链接。

优先采用如下结构,在思路需要时调整:

- `# Agent Note: <action-oriented title>`
- `Status: proposed`
- `## Problem`(问题):指明当前 API,引用相关文件,并给出消费者证据。区分生产调用方与测试/文档。
- `## Proposal`(方案):准确说明要移除、折叠、降级或重新安放的内容。相关时一并纳入测试、文档、README、JSDoc、事件分类、快照与生成文件的清理。
- `## Why not keep it?`(为何不能保留)或 `## What we give up`(我们放弃什么):把最强的反对理由摊开来。
- `## Acceptance criteria`(验收标准):可观测的终态与门禁(gate)。
- `## Risks`(风险):公共 API 变更、行为变更、未来的产品诉求,以及为何该权衡仍然合理。

具体到实现 PR 能顺着线索跟进。避免"simplify this package"这类空泛的 Agent Note。当某个提案与现有 Agent Note 重叠时,把有用的细节合并到现有那条中,而不是另起一份重复的。

## 行内 TODO 注释

只把行内 TODO/FIXME/XXX 用于规模小、范围局部的清理,这些清理明显有用、但并非持久的 design 决策。保持它们简短且可操作:

- 用一个稳定的标签标出问题点,例如 `TODO(double-default)` 或 `XXX(unused-default)`。
- 解释为什么可以安全地回头处理,以及什么操作能简化它。
- 不要为投机性的抱怨(speculative complaints),或为需要 Agent Note 层面决策的行为添加 TODO。

## 合并另一个 PR 或分支时

将兄弟分支相对于 `origin/master` 求 diff,而不是相对当前 PR 分支,这样你能看到它独立的贡献。对每个条目:

- 迁移那些达到质量门槛(quality bar)且不重叠的 Agent Note 或 TODO。
- 把重叠的材料合并到掌管该主题的现有 Agent Note 中。
- 不要为了保住数量而移植重复的或信心较低的提案。
- 更新 PR 正文,让审阅者看到真实的候选数量与范围。
- 只有在用户要求你,或你确实掌管该善后工作时,才关闭重复 PR。

## 校验与 PR 规范

对于纯文档的 Agent Note 工作,至少运行 `pnpm run doc-sync`、`pnpm run lint` 与 `git diff --check`。对于代码注释或 skill 改动,在存在相关 validator 时也运行它。从即将发出的 diff 中选取其他证据;pre-push 钩子只贡献 typecheck。

在开启或更新 PR 时,概括:

- 新增、合并、作为部分取代保留或删除的 Agent Note 与行内 note 各有多少。
- 摸底过的主要区域。
- 有意排除的内容。
- 通过了哪些校验。

对于每一个合并组,列出旧 owner 与当前 owner,陈述完全取代的证据,并解释为何删除是安全的。如果一次"先增后删"扫描没有找到符合条件的 note,如实报告该结果,以及保留下来的代表性部分案例。

在摸底仍在扩展期间使用 draft PR;只在候选集、审阅反馈与校验都尘埃落定时再标记为就绪。
