# Distilled prose examples (中文对照)

[English 原文](examples.md) | 中文

> 这是英文原文的中文对照,供阅读方便。**英文原文是权威版本**,判断时以原文为准。

用这些示例识别支配性原则,而非当作文本模板。"Balanced" 在每个位置用最少的解释保留每个承重命题。

## 保留每个事实子句

**原文:** “The coordinator carefully serializes writes per session, flushes buffered events before disposal resolves, and reports backend failures to the caller.”

**删过头:** “The coordinator serializes persistence.”

**均衡:** “The coordinator carefully serializes writes per session, flushes buffered events before disposal resolves, and reports backend failures to the caller.”

删掉装饰和重复,不是命题。执行者、按会话范围、处置顺序、失败可见性,是各自独立的事实。

## 明确的 skill 范围具有功能性

**删过头:** “Read the sources and use judgment.”

**均衡:** “This skill is guidance, not a complete checklist. Use judgment beyond the named checks; documented requirements still apply.”

**过细:** 为清单无法取代独立推理辩护的若干段落。

保留这个明确限制,因为它改变 agent(智能体)应用该工作流的方式。削减重复的劝说,不要削减护栏。

## cookbook 保留动作与验证

**删过头:** “Add tests for the tool.”

**均衡:** “Test registration and disposal at unit level, exercise the tool through the real loader path, and add a snapshot when its rendered output changes. Verify the assertion observes the external result rather than the model's report.”

**过细:** 对示例代码中已然可见的每个 fixture 文件和断言的逐一走查。

保留测试分级、必需动作、真实入口路径和可观测验证。删掉对 fixture 的叙述。

## 保留归属与时机

**删过头:** “Provider work is cancelled during teardown.”

**均衡:** “The runtime requests provider cancellation before releasing the child scope; the provider remains responsible for joining its workers before disposal resolves.”

**过细:** 用于实现拆除的每个 promise 和 callback 的按时间顺序的叙述。

执行者、顺序、归属变更点、完成保证,是各自独立的事实子句。

## 事件 JSDoc 保留边界时机

**删过头:** “Composes and caches the session prefix.”

**均衡:** “Composes the session prefix once before the first pre-step and model request. Listener appends join the current request, and pre-step pressure accounting receives the composed prefix.”

**过细:** 实现该排序的循环辅助函数、缓存字段和 promise 回调的逐一走查。

事件顺序及其对当前请求的后果是调用者可见的行为,不是实现叙述。

## 引导复杂代码而不叙述它

**删过头:** “Worker realm support.”

**均衡:** “Owns the worker realm and its host bridge. Realm initialization is single-shot; disposal terminates the worker and rejects later calls. See the worker-isolation Agent Note for the protocol rationale.”

**过细:** 对下方类和辅助函数的逐段预览。

保留模块的角色、依赖、职责和非显然生命周期行为。链接架构原理,让代码展示局部控制流。

## 公共 JSDoc 包含失败情形

**删过头:** “Returns the realm global.”

**均衡:** “Returns the initialized realm global. Throws if initialization has not completed or the realm has already been disposed.”

**过细:** 导致每个 throw 的内部状态机分支和精确辅助调用。

throws 和状态前置条件是调用者可见的契约事实。

## 保留简洁的实现映射

**删过头:** “Search provider backed by an external API.”

**均衡:** “Maps each provider result to the shared search-result fields, preserving the title, URL, and text while omitting provider-only ranking metadata.”

**过细:** 对映射代码的逐字段重述,包括名称相同和明显赋值的字段。

保留映射细节,用来说明适配器在何处丢弃或更改信息。

## 链接原理但保留本地契约

**删过头:** “Disposal is documented in the lifecycle Agent Note.”

**均衡:** “Disposal aborts the run and waits for provider quiescence. See the lifecycle Agent Note for ownership and race handling.”

**过细:** 在每个 disposer 旁边重复 Agent Note 的 promise 编排和被否定的归属模型。

在调用者需要的地方保留行为和完成保证。对算法和原理积极链接;链接不能替代本地契约。

## 已实现的 Agent Note 保留验证契约

**删过头:** Deleting the entire Testing section because the Agent Note has already shipped.

**均衡:** “Unit tests cover cancellation before and after publication, disposal quiescence, and provider reload. A built-entry smoke covers the real loader path; snapshot coverage is deferred because the transport is process-specific.”

**过细:** 对 fixture 和断言的逐文件走查,没有额外的行为区分。

删掉迁移任务和测试叙述。保留分级、它们锁定的行为、真实入口路径和已命名的覆盖空缺。

## 安全边界可能需要一个具体示例

**删过头:** “Mounted plugins share the host's authority.”

**均衡:** “Mounted plugins share the host's authority; for example, access to `ctx.shell` permits commands with the host executor's privileges.”

**过细:** 一个插件可能滥用的每个服务以及每个假设性漏洞的清单。

当一个示例让原本抽象的安全限制在操作层面清晰时,保留它。

## 完整删除推理记录

**过细:** “First the loop checks whether the value is absent. If it is absent, the next branch returns early. Otherwise it continues, which is why the final assertion is safe.”

**均衡:** "No comment when the code already expresses those branches. If the early return protects a non-obvious invariant, state only that invariant."

不要把推理记录压缩成更短的叙述;删掉它。

## 配置注释解释树无法展示的内容

**过细:** “This entry loads the local filesystem provider, followed by the policy plugin, followed by the read, write, and edit tools," when the adjacent entries already show that order.

**均衡:** "Load policy before the model-facing tools so their write and edit calls pass through the read-before-mutation gate."

保留顺序的后果、令人惊讶的范围规则或安全边界。让配置展示它自己的清单。

## 不要仅为词数而削减

**当前:** “The adapter converts provider errors into the shared error type so callers can handle authentication, rate-limit, and transient failures uniformly.”

**更短但更差:** “The adapter normalizes provider errors.”

**均衡决策:** 保留当前句子,除非链接或周围契约已经列出失败类别。更短版本失去了后果和区分,却没有改善结构。

## 模型可见文本遵循归属

**删过头:** “The tool returns errors when a call fails.”

**过细:** 把另一个包的 schema 和渲染器字符串复制到这个后端的 README 中。

**均衡:** "Quote stable prompt, result, and error text owned by this package. Link the generated tool catalog for schemas and the consumer README for text another package owns; state only this package's conditions or deltas locally."

到达模型的措辞是行为,但重复仍会漂移。精确性属于拥有者。

## 生成摘要必须自立

**删过头:** “Approval request and policy service.” The owner explains policy order and audit logging later, but the catalog exports only its first sentence.

**均衡:** “Approval service that applies session policy before answerers and logs every ask/outcome pair to the requesting session.” Keep non-catalog detail in later sentences.

**过细:** 把该服务的完整生命周期和 prompt-notice 行为挪进提取出的句子中。

了解生成器提取什么。那个片段必须保留其生成输出所需的契约。

## 限制是契约,不是债务清单

**删过头:** Omitting a process-lifetime cache that makes configuration changes require plugin reload.

**过细:** Listing private helper cleanup and unused test-only accessors with no caller or maintainer consequence.

**均衡:** "Provider selection is cached for the plugin lifetime; installing or repairing a provider requires reload." Keep ordinary cleanup in its TODO or Agent Note.

保留影响使用或安全维护的缺口和非显然约束。包 README 不是 backlog 堆放场。
