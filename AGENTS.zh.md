# AGENTS.md(中文对照)

> 这是根 [AGENTS.md](AGENTS.md) 的中文对照,供阅读方便。**英文原文是权威版本**,执行规则时以原文为准。
>
> 术语译法参照 dsh 自己的[术语表](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/i18n/terminology.md):`agent`、`skill`、`seam`、`waterfall`、`Agent Note`、`worktree` 等按约定保留英文;`plugin` 译作插件、`session` 译作会话、`capability` 译作能力、`prompt` 译作提示词、`tool` 译作工具、`snapshot` 译作快照。

DeepSeek Harness 是一个建立在 vendored Cordis 之上的插件化 agent harness(智能体框架):**一切皆插件**。改 `packages/` 之前先读 [docs/architecture.md](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md);文档工作遵循 [docs/AGENTS.md](docs/AGENTS.md)。

## 发布前的立场:地基优先于波及面

**在第一个打标签的发布时删掉这一节。** 目前没有外部消费者,所以优先要正确的地基,而不是兼容性垫片:可以自由重命名或重新分包,把所有引用一起改掉。后端拒绝旧的磁盘格式。SQLite 用单调递增的 `SCHEMA_VERSION`;`dsh-session` 把 `SESSION_FORMAT_VERSION` 保持在 `0`,不做兼容承诺。

## 仓库布局

英文原文的目录树按原样阅读(见 [AGENTS.md](AGENTS.md) 的 Repository layout 一节),要点是:

- `vendor/` —— 钉住版本的 Cordis 源码副本
- `packages/` —— `@deepseek-ai/dsh-<pkg>` 工作区,按 `packages/<group>/<pkg>/` 组织,其中 `core/` 是产品 API 主干(会话、系统提示词、工具、agent、agent loop)
- `python/`、`native/`、`examples/` —— Python SDK 与打包运行时、原生 landlock 启动器、可运行的 cordis.yml 叶子配置
- `.agents/` —— agent 工作流与 Agent Notes(`notes/`)
- `docs/` —— 架构、生成的目录、事故复盘、cookbook
- `scripts/` —— 仓库门禁与生成器
- `website/` —— 选定双语文档的 VitePress 投影

## 命令

命令清单按原样阅读(见原文 Commands 一节)。常用的有 `pnpm run test`(vitest 单元测试)、`pnpm run test:coverage`(CI 的覆盖率门禁,`packages/*/*/src` 逐文件 100%)、`pnpm run test:e2e`(真实 API 测试,没有 `DEEPSEEK_API_KEY` 时自动跳过)、`pnpm run test:snapshot`(无 key 的重放与预期输出比对)、`pnpm run typecheck`、`pnpm run lint`、`pnpm run build`、`pnpm run hygiene`、`pnpm run doc-sync`(全部文档门禁)。

### 宿主 sandbox 导致的失败

当必需的 `gh`、`pnpm`、构建、测试或生成器命令,是因为 agent sandbox 拦住了凭证、网络、IPC、文件监听或嵌套的 `sandbox-exec` 而失败时,先用最窄的宿主提权原样重试,再去诊断认证或项目本身的失败。要有 sandbox 的证据;绝不绕过真实的测试失败,也绝不绕过被测的产品 sandbox。

### 本地只跑相关的检查

推送前用 [dsh-pre-push-checks](.agents/skills/dsh-pre-push-checks/SKILL.md) 选检查;**只报告实际跑过的命令**。`gh stack sync` 之后立即验证;检查通过之前不要合并。

- 证据要对上改动面:行为改动用聚焦测试,模型或用户输出用快照,文档用 `doc-sync`,发布路径用 build/hygiene 与构建产物冒烟,provider 行为用真实 API e2e。
- 绝不为了提交或推送就默认跑整套,也不重复跑一个已经通过的检查。CI 负责穷尽覆盖与平台矩阵;只有在明确要求、诊断 CI,或者改动本身不可避免地覆盖整个仓库时,才在本地全排练一遍。
- CI 的覆盖率门禁是 `test:coverage`,不是 `test`([原因](docs/testing.md))。

## 密钥与 .env

真实 API 测试和 demo 读 `DEEPSEEK_API_KEY`、可选的 `DEEPSEEK_BASE_URL`,以及仓库根的 `.env`。cordis.yml 只在插件 `config` 与条目 `disabled` 下允许 `!!js`(绝不用 `!js`);其他元数据保持字面量,所以条件化组装也用 overlay([入门](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-primer.md#loader-configuration))。**绝不提交凭证。** 没有 key 时 CI 的 e2e 会跳过;key 的政策归 [testing.md](docs/testing.md) 所有。

## 约定

- 每个 npm 包都叫 `@deepseek-ai/dsh-<name>`;vendored 的包被重新划归作用域([映射](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/rescope.md))并且 `private: true`。`@deepseek-ai/cordis` 是每个 harness 包的 peerDependency(同时也是 dev 依赖)。
- 全面 ESM(`"type": "module"`)。跨包用包名引用,本地相对引用带 `.ts`。配置类子进程在纯 Node 下运行构建出的 `lib/`;源码回归测试用它们声明的启动器([测试政策](docs/testing.md#test-subprocess-launch-modes))。`dsh` CLI 的源码启动走 tsx 仅支持 ESM 的钩子(`node --import tsx/esm`),它能到达的模块必须保持 ESM(不能只有 CJS 导出)—— 因为在支持的引擎区间里,Node 原生的 TypeScript 模式不可用([源码启动契约](.agents/notes/implemented/architecture/2026-07-29-dsh-source-launch-tsx-esm.md))。Raw/Web 的 `cordis.yml` 里裸插件必须出现在其解析器 manifest 的 `dependencies` 中;`verify-cordis-config` 强制这一点。
- **注册即 effect**:每一处贡献都经由 `ctx.effect()` / `ctx.on()`;注册表的 `register()` 返回处置器。
- **运行时不变量断言的是「自己拥有的关系」。** 检查权威的事件流或可变数据,而不是服务或方法是否存在、插件的元数据或 effect、或者固定的纯示例。在不存在合理关系的情况下,一个给出解释的空伴生实现才是正确的([包的不变量规则](packages/AGENTS.md))。
- **类型化事件用声明合并**以及可合并扩展的映射。事件的 JSDoc 需要 `@mode` 和 payload 的 `@param`;payload 里没有的 scoped key 需要 `@dshScopeScan unsupported`。公开的服务方法要记录参数和非 void 的返回值。`SessionEventMap` 的成员默认是「读取时必需」的 —— 不认识其类型的构建会拒绝这份日志,除非该事件带上信封的 `ignorable: true`;只有结构性的格式变化才会提升 `SESSION_FORMAT_VERSION`([机制](.agents/notes/implemented/architecture/2026-08-10-session-log-version-mechanism.md))。
- **switch 按判别标签分派。** 封闭的 union 以 `assertNever` 收尾;可合并扩展的 union 走一个有文档的默认分支。
- **waterfall(瀑布式事件)的监听器必须调用 `next()`** 才能往下委托;不调用就直接返回会把整条链短路([语义](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-primer.md#cordis-waterfall-semantics))。
- **模型可见 ⟺ 已记录**:任何到达模型请求的东西都必须能从会话日志重建;新增一个模型可见的输入就需要一个会话事件。
- **改插件,不改循环**:新行为挂在有文档的扩展点上;改 `agent-loop` 就要同时更新 docs/architecture.md。
- **一个 capability seam 由 Service Definition / Service Provider / Consumer 三种角色构成。** 它是完整的整体,绝不是单一角色;只有当角色各自独立演化时才拆开([术语](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/glossary.md#capability-seam))。
- **在依赖确实能删掉自有代码和测试时,优先用维护良好的依赖而不是手写**([政策](.agents/notes/implemented/process/2026-07-26-dependencies-over-hand-rolling.md))。
- **在包的边界上显式优于隐式**:给默认值是拥有该实现的地方一个显式的 `resolve(request): Spec` 步骤,绝不是藏在 `run()` 里的 `?? default`(`dsh-shell` 的 request/spec 拆分就是范本)。
- **插件里不写硬编码的可调参数**:随部署变化的选择要做成经过校验、可从 cordis.yml 改的 `Config` 字段;一个 `DEFAULT_*` 常量或测试钩子不算可配置。协议常量、外部规范和安全不变量保持固定。
- **误配置要大声失败**:能自包含时在加载时失败,否则在最早能解析的那一点失败;绝不静默跳过一个缺失的引用目标。
- **跨边界的不透明 id 要打品牌**(用 `dsh-brand` 的 `Branded<B>`),绝不用裸 `string`。
- **在类型化的同进程边界上信任 TypeScript。** 不要仅仅为了静态接口本就要求的值,去加运行时校验、回退行为或敌意输入测试;要校验的是 parser/config、队列、模型/工具 JSON、持久化/文件、worker、进程以及 wire 这些边界。
- **源码平面与产物平面,绝不混用。** 静态门禁和测试通过 tsconfig 的 `paths` 把工作区引用解析到 `src`,并且在干净的树上就能通过;消费构建产物 `lib/` 的门禁要显式声明这个依赖([布局](docs/development.md#typescript-project-layout))。
- **保持编译器面显式。** 除 `api/remotes` 外,每个包只用一个 aggregate;跨仓库的程序以某个面的配置为种子,绝不用根 solution([布局](docs/development.md#typescript-project-layout))。
- **空的 `catch` 要写明它吞掉了什么**,以及为什么别的东西到不了这里;`try` 里只放一条语句。
- 不要为代码里显而易见的事实写注释。
- **并列的值优先保持对称**;没有解释的不对称通常意味着漏掉了一次抽取。
- **测试描述行为,不描述正确性。** 行为过时了就连同它的测试一起改;在 PR 里解释为什么。
- **非平凡改动必须在同一个 PR 里带一篇 Agent Note;** 只有机械性的、局部的编辑豁免([适用范围](.agents/notes/README.md#when-to-write-one))。归档的记录是冻结的:绝不编辑,也绝不当作当前依据([归档政策](.agents/notes/README.md#archiving-and-deletion))。
- **测试政策** —— [docs/testing.md](docs/testing.md)。每一个非平凡的、模型可见或产品用户可见的行为改动,都要在同一个 PR 里通过一个真实可运行的示例新增或更新一个无 key 快照;包级测试、只有 e2e 的断言,以及只用 mock 的 fixture,都不能替代组装后的应用 transcript。fixture 必须能在 macOS 与 Linux 上重放;修 fixture,不要修 normalizer。
- **工具的 UI 渲染意图是它设计的一部分**,要在一开始就定下来(`generic`/`terminal`/`diff`、`locations`);呈现方法是 `args` 的纯函数([cookbook](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cookbook/adding-a-tool.md))。
- **为 capability seam、生命周期路径和 transcript 输出规划单元、e2e 与快照覆盖**;缺少的快照框架支持要在同一次改动里补上。
- **两个 SDK 都是对循环的投影。** agent loop、会话生命周期以及 `SessionEventMap` 的改动,要在同一个 PR 里更新 TypeScript 与 Python SDK 的预期输出;`pnpm run test` 两者都不覆盖([涉及面](docs/testing.md#when-a-snapshot-test-is-required))。
- **有意识地选择 PR 历史。** 拆开互不相关的改动;在扩散之前先修引入问题的那个 PR。独立 PR 和官方栈在评审后可以 merge-forward 或 rebase。重写用 `--force-with-lease`,远端有移动就中止,绝不用裸 `--force`;进行中的 merge-forward 在取用更新的基线之前先保住它的检查点([理由](.agents/notes/implemented/process/2026-08-02-native-github-stacks-and-optional-rebases.md))。
- **标签:** 一个 PR 用一个 `kind/*`、所有实质相关的 `area/*`,以及原生的 Issue Type([分类法](.agents/notes/implemented/process/2026-08-08-unified-github-label-taxonomy.md))。
- TODO 标记:按紧急程度用 `FIXME`/`TODO`/`XXX`([语义](docs/development.md))。
- 文件以恰好一个换行结尾;`git diff --cached --check`(pre-commit)把关。

## 防御性模式

做生命周期、并发、子进程或拆除相关的工作之前,先读 [docs/defensive-patterns.md](docs/defensive-patterns.md)。

## 类型安全与文档

一切都在 `strict: true` 加 `noImplicitAny` 下编译;每一个残留的 `any` 都要解释为什么无法收窄。每个模块和导出都有简洁的 JSDoc 说明其不显然的契约;函数型的导出包含 `@param`/`@returns`,由 `verify-export-jsdoc` 强制。继承声明的成员、插件协议的槽位以及构造函数,把它们的文档留在声明它们的那个 Service Definition、协议或类上。

注释与文档陈述完整的契约与上下文,不是推理过程的记录。用直接、具体的词。不要用隐喻。在写下 `contract`、`boundary` 或 `shape` 之前,先问是否有更准确的词能点名这个对象:写 `response fields`、`JSON validation`、`ESM exports`,而不是 `response shape`、`validation boundary`、`module shape`。`contract` 留给前置条件、后置条件、不变量、兼容承诺,以及调用方、被调方、实现者、provider、生产者或消费者所依赖的其他义务。`boundary` 留给字面意义上的进程、wire、安全、事务或生命周期边界。不要叙述控制流或测试,不要保留评审历史,不要复述代码。保住行为、失败、时序、所有权与安全使用这些事实;理由用链接。判断依据用 [dsh-prose-standard](.agents/skills/dsh-prose-standard/SKILL.md)。把可机检的不变量焊进一个**会被执行的**顶层门禁,并且证明每条改动过的验收路径确实会拒绝一个非法输入。用窄而有理由的例外,而不是全局关掉一条规则。

文档伴随每一次代码改动:受影响的 README 与 JSDoc 契约一起更新。日常的双语工作遵循 [docs/AGENTS.md](docs/AGENTS.md);只有用户显式调用才可以运行 `dsh-translate-docs`。当前状态的行文、一段一物理行、一个事实一个家,以及字数预算,都在那里。

## 修改这份说明

`CLAUDE.md` 在根目录、`packages/` 和 `examples/` 软链到 `AGENTS.md`;**改真身**。每条规则保持自包含,同时链到高层文档。在清晰度不受损时压缩;只有必需内容确实需要更多空间时,才抬高 `verify-doc-budgets` 的上限。

## Vendoring 政策

`vendor/` 里的包是钉住版本的源码副本(带上游 SHA 的 manifest 在 [vendor/README.md](https://github.com/deepseek-ai/deepseek-harness/blob/master/vendor/README.md))。按那里的同步流程更新;重新应用或退役已记录的本地修改;然后重跑 `pnpm run test && pnpm run build`。
