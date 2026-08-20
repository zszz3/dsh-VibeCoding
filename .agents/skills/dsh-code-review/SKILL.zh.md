# Reviewing a DeepSeek-Harness PR(中文对照)

[English 原文](SKILL.md) | 中文

该 skill 的 frontmatter(name:`dsh-code-review`;description:在 deepseek-harness 仓库审查 PR 时使用——向审查者阐明本代码库的规范(AGENTS.md 约定、防御模式、ADR、质量门禁)以及仅靠代码看不出的审查专用检查)定义了它的触发场景:当审查 deepseek-harness 仓库里的 PR 时使用。

**本 skill 是指导,不是完整清单。** 在阅读 diff 与足以理解设计的周边代码之前,先验证并获取 PR 的实时 base 与精确 head,然后运行 `pnpm --silent run change-scope --base <verified-base-ref> --head <verified-head-ref>`。该报告会识别路径与脏层,但不能替代语义审查。在 retarget(重定位)或 merge(合并)之后,重新建立 base 并重跑它。把正确性、生命周期、安全性与被破坏的必需行为放在样式之前;一条有据的 blocker 胜过一堆 nit。

## 可信来源

- [AGENTS.md](../../../AGENTS.zh.md) 与 [packages/AGENTS.md](../../../packages/AGENTS.zh.md): 仓库与包的长期编写规范。
- [docs/defensive-patterns.md](../../../docs/defensive-patterns.md): subprocess(子进程)、callback(回调)、async-state(异步状态)与 disposal(处置)的 bug 类型。
- [docs/AGENTS.md](../../../docs/AGENTS.zh.md): 文档放置位置与文案规范。
- [dsh-prose-standard](../dsh-prose-standard/SKILL.zh.md): 对注释、文档、prompt 与可见字符串的必备覆盖与编辑判断。
- [docs/testing.md](../../../docs/testing.md) 与 [质量门禁 Agent Note](../../notes/implemented/process/2026-06-11-quality-gates.md): 必备测试分级与门禁。
- [Agent Notes](../../notes/README.md): 设计依据。把对某条 Agent Note 的异议视为设计讨论,而非自动否决。
- 对于双语变更,阅读 [translation-rules.md](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/i18n/translation-rules.md) 与 [terminology.md](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/i18n/terminology.md);扩展的翻译 skill 不在自动审查范围内,只在用户显式调用时运行。

## 阻断性要求

1. **新文案接受语义审查。** 用 [dsh-prose-standard](../dsh-prose-standard/SKILL.zh.md) 严格审查每段新增或变更的 Markdown 段落、JSDoc、注释、prompt、描述、诊断与可见字符串。对照所属代码或行为,验证必备覆盖、准确性、位置与编辑质量;自动化检查建立不了这些性质。
2. **文档与代码一致。** 配置、默认值、错误、wire 字段、事件与公共行为在同一个 diff 里更新包 README 与 JSDoc。注释注明不直观的契约;把实现叙述、测试 walkthrough、审查历史与重复的依据标记为删除,或链接到它们唯一归属处。
3. **核心类型文档一致。** 对 spine 或 seam 词汇的变更更新对应的 [子体系页](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/README.md) 与任何 `type-equiv` 条目。内部类型不需要目录条目。
4. **注册要清理。** 确认每个新 registry 贡献都通过了 [packages/AGENTS.md](../../../packages/AGENTS.zh.md) 要求的 disposal 测试。
5. **invariant 伴生(companion)要是语义的。** 对每个被触碰的 `./invariant`,要求在该包能观察到它的位置有一个 owner 事件流(event-stream)或可变数据(mutable-data)关系;service 或方法存在性、plugin 元数据或 effects,以及固定的纯示例应置于类型、加载或单元测试之中。当某条空 installer(安装器)的包相关理由能证明不存在合理的运行时关系时接受它;不要为了消除空而发明检查([仓库规范](../../../AGENTS.zh.md#conventions);[包 invariant 规范](../../../packages/AGENTS.zh.md))。
6. **必备证据存在。** 确认作者为该 diff 运行过 [相关本地检查](../../../AGENTS.zh.md#run-relevant-checks-locally),且 CI 覆盖了穷尽矩阵;审查这两者都检测不到的语义漏洞。

## 人工检查

- **意图与接口契约:** 追溯每个被改接口的双方。确认实现与 PR 及任何 Agent Note 一致,包括错误、取消、所有权与 disposal。
- **生命周期与并发:** 对异步 setup、callback、进程或 teardown,应用 [defensive-patterns.md](../../../docs/defensive-patterns.md)。发布前检查竞态、await 期间的取消、独立错误报告、callback 隔离、重入前的所有权、完整的 detach 清理,以及静止(quiescent) disposal。
- **能力与消费者契合:** 追溯每个现有 consumer,然后按 [包规范](../../../packages/AGENTS.zh.md) 标记泄漏到接口里的 consumer 专属行为。反过来也标记:某个通用 service(registry、session、agent)上新增的公共方法,若其唯一调用方是某个内部 consumer,则是不必要的 API 扩张——要求改为在构造时把一个私有能力闭包交给该 consumer。
- **scope、ownership 与必要性:** 把每个抽象、状态机、选项、防御性拷贝与兼容路径映射到其当前契约、生产 consumer 与所属 plugin 或 service。挑战无关功能与投机性通用化,再用 [根规范](../../../AGENTS.zh.md#conventions) 检验 PR。
- **配置与公共选择:** 问每个默认、公共操作集、格式或导入的外部概念有哪些当前 consumer 证据或先例支持。在该证据缺失时要求显式选择或 deferred(推迟)。
- **模型视角:** 检查受影响模式下模型收到的精确 prompt、tool schemas、结果与诊断。标记模型任务之外的概念,然后通过快照或 e2e 覆盖验证稳定文本逐字与动态行为。
- **执行(Enforcement):** 沿着每条拒绝路径追到执行它的 operation;测试能绕过 schemas、prompt、facades、wrappers 或 listener 顺序的直接与备用调用方。
- **借用与派生状态:** 在包契约下判断每个被保留的取值是借用还是自有,然后把通知与每个 cache、prompt、UI echo、replay 与查询视图追溯到文档化的成功点与权威来源。
- **边界覆盖最终操作:** 定位完整已发出或已保留结果——包括 wrappers 与 metadata——的 owner。探测极小与精确边界、超大单块与多字节文本的字节边界。
- **真实入口路径:** 测试在相关位置检验已发版的(shipped) Loader、bin、worker、ACP bridge 或 subprocess。手动挂载的 plugin 抓不到无效的 Loader 导出;函数 plugin 必须具名导出其命名空间且无默认导出。
- **测试强度:** 断言应在目标回归上失败,并验证外部状态、日志、事件或 disposal,而非复述实现或相信 agent 的报告。coverage 是必需的,但并非场景正确的证据。
- **invariant 生命周期与否定对照:** 在可能时验证候选观察在发布前被拒绝、与 session 相关的检查在 late 加载或 HMR 后重建可复用历史,以及故意无效的用例通过真实 runner 对目标规则失败。
- **已实现的 Agent Note 与已发版的(shipped)现实一致:** 当 PR 实现了某条被提议的 Agent Note 时,在同一 diff 里把它迁移并改写成现在时态的 shipped 状态,再对照实现验证路径、名称与机制。
- **转写稿变更:** 编辑器可见或模型可见的变更更新快照,或解释为何不适用快照。把预期输出 diff 当作行为变更而非格式噪音来审查。
- **双语变更:** 对照双方的语义与术语;绿色的配对哈希证明不了翻译质量。

## 报告发现

陈述缺陷、位置、影响与证据。把局部缺陷放在最紧的相关 diff 区间内;对跨体系的 architecture、scope 或审查级综合用 PR 级评论。阻断项与建议分开,省略已被绿色门禁强制的那些问题。用现有的 GitHub 审查线程回复。收到审查意见时,逐条技术核实每条论断,并在技术依据上修复或反驳它,不要表演性同意。
