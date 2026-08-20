# AGENTS.md — Harness Packages(中文对照)

[English 原文](AGENTS.md) | 中文

> 这是英文原文的中文对照,供阅读方便。**英文原文是权威版本**,执行规则时以原文为准。术语译法参照 dsh 自己的约定:`agent`、`skill`、`seam`、`Agent Note`、`worktree` 等保留英文。

以下是针对包的规则,是对仓库全局[约定](../AGENTS.zh.md#约定)的补充。

- **插件导出形式:** service 包默认导出它的 service 类;function 插件具名导出 `name` / `inject` / `Config` / `apply`,并且没有默认导出。两种形式混用会让 Loader 丢弃 function 插件的命名空间([事故复盘](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/postmortem/0001-acp-default-export-drops-inject.md))。
- **可选服务用 `ctx.get(name)`。** `ctx.<name>` 只留给声明过的注入;属性代理对拓扑敏感,而严格的 `ctx.get` 读的是全局服务存储([事故复盘](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/postmortem/0001-acp-default-export-drops-inject.md))。
- **产品可见的插件必须有非 unit 的真实组装测试。** 手搭的 `ctx.plugin(...)` 套件不够。要通过 Loader 和 app/process 启动仅供测试的 `cordis.yml`;只 mock 外部服务或不确定的输入,并断言模型可见、持久或用户可见的输出。别把 opt-in 的东西放进随产品发布的默认值里。[政策](../docs/testing.md)。
- **由 initiator 拥有的私有链条先派生、再捕获。** 在 `ctx.agents.withInitiator()` 之下,在每个编排入口处取回 Agent、派生出 `agent.session`,再让操作局部的辅助函数闭包捕获它。在生命周期、会话日志、服务、授权、worker/进程、持久化以及 wire 接口上,`Agent` 与 `Session` 都保持显式;不要仅仅为了隐藏一个参数,就把某个叶子辅助函数的入参从 `Session` 放宽成 `Context`([理由](../.agents/notes/implemented/architecture/2026-07-15-agent-initiator-scope.md))。
- **一个异步操作用一个生命周期控制器或事务来表示。** 独立的就绪、取消、处置、预留或哨兵状态,必须有独立的所有者或结算点;否则就把它折叠掉,同时保住回滚、回调收敛与静默(quiescence)。
- **Service Definition 要面向当前全部 Consumer 来设计。** 工具 schema、Loader、UI、传输以及 provider 特有的行为都留在 Consumer 或 provider 里;不要让某一个 Consumer 决定服务契约([capability seam 的理由](../.agents/notes/implemented/architecture/2026-06-13-capability-seams.md))。反向的坏味道:一个公开服务方法只有一个内部调用者 —— 这时应改为传入一个私有的能力闭包(`RunCodeBridgeOptions`)。
- **要求有当前的所有者和需求。** 每个抽象、状态机、选项、防御性拷贝和兼容路径,都要挂到一个当前的契约或生产消费者上,并且把行为留在拥有它的那个插件或服务里。
- **公开选择要有证据。** 「可配置」不能用来正当化一个没有依据的默认值、公开操作集、格式或引入的外部概念。要用当前消费者的证据或相关的既有实践;否则就要求显式给值,或者把这个选择推迟。
- **面向模型的契约要从模型的视角写。** 提示词、工具 schema、结果和诊断信息里只包含与任务相关的概念,不包含 UI、传输或实现的词汇。稳定的模型可见文本要逐字钉住,动态行为则通过快照或端到端覆盖来钉。
- **在做出决定的那个操作里强制该决定。** 当直接调用者或旁路调用者能够绕过时,schema 省略、提示词过滤、facade、wrapper 以及监听器顺序都不算强制;要通过 executor 来测试「拒绝」。
- **状态只在它的提交点发布。** 每条通知和派生状态的更新,都只在操作成功之后才发出;缓存、提示词、UI 回显、replay 和查询视图都从同一个权威来源派生。
- **边界要作用在完整结果上。** 在完整的发出值或保留值(含 wrapper 与元数据)已知的地方,强制字节、token、条目和时间上限;要测极小值与恰好等于上限的情况、超大的单个 chunk,以及多字节文本下的字节上限。
- **注册表的贡献要证明能被处置**,通过[测试政策](../docs/testing.md)要求的 HMR 安全测试:处置那个 fiber,然后观察它确实被移除。
- **每个包都拥有 `./invariant`。** 注册 manifest 名称;检查一条事件/数据关系,或者给空的 installer 写上该包专属的 `No runtime invariant:` 理由。生成的伴生文件、没有解释的空实现以及被忽略的 reporter 都会让 [`verify-package-invariants`](../.agents/notes/implemented/architecture/2026-07-19-package-invariant-runtime-contracts.md) 失败。

[命名规则](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cookbook/adding-a-package.md#name-the-role-that-exists):

- **包的 tsconfig:** 继承 `tsconfig.base.json`(Client 侧继承 `tsconfig.base.client.json`),使用 `rootDir: src`、`outDir: lib/types`,并且引用每一个 workspace 依赖以及 `runtime-diagnostics/invariants`;只注册进恰好一个 aggregate。只有 `api/remotes` 为了生成的契约而拆分;普通的双入口 Client 插件不拆([布局](../docs/development.md#typescript-project-layout))。
- `src/types.ts` 只放类型 —— 不含运行时代码。
- 测试放在包一级的 `tests/` 下,不放 `src/__tests__/`。
- 包的 README 和 JSDoc 是改动的一部分:行为变了(配置键、默认值、错误码、wire 字段)就在同一个提交里更新它们。`doc-sync` 能卡住的它会卡;完整而精炼的行文参照 [dsh-prose-standard](../.agents/skills/dsh-prose-standard/SKILL.zh.md),并对着代码核实准确性。
- 包的 README 用[规范的 Model Experience 格式](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cookbook/adding-a-package.md#4-write-the-package-readme)记录对模型、token 和 KV 缓存的影响。
- 包的 README 把持久存在的消费者缺口和不显然的维护者约束放在 `## Known Limitations and Deferred Work` 下;普通的清理工作留在它的 TODO 或 Agent Note 里。一条都没有的包使用一条有理由的[允许列表条目](https://github.com/deepseek-ai/deepseek-harness/blob/master/scripts/verify-package-readme-limitations.ts)([理由](../.agents/notes/implemented/process/2026-07-10-readme-known-limitations-gate.md))。
