# Few-shot leakage examples(中文对照)

[English 原文](examples.md) | 中文

> **本文里带 `Leaked:` / `Fixed:` / `Keep:` 标记的英文句子是「病例标本」,一律保留原文未译** —— 翻译它们会让读者失去识别这些措辞的能力。每条标本后面的中文是对它的解释。

从 2026-08 那次全仓库清理及其各轮评审中提炼出来。用它们来识别背后的原则,而不是当成文本模板照搬。本文刻意引用了泄漏的措辞作为校准材料 —— [召回探针](recall-batteries.zh.md)会排除本 skill 自己的目录,而这里的措辞不构成在别处这么写的许可。

## 已失效的引用

### 带有已提交所有者的决策序号

**Leaked:** "Slash input resolves against the visible catalog (decision 21)."

**Fixed:** "Slash input resolves against the visible catalog — the plain-text-reference decision, owned by [the web input-machine note](../../../notes/implemented/architecture/2026-07-25-web-input-machine-and-slash-pipeline.md)."

那个序号在 HEAD 上什么都解析不到,而决策的名字与所属记录的路径可以。每个文件里至少点名一次所属记录的路径 —— 在支持链接的表面上就写成链接 —— 之后再提到时可以只用那个可搜索的名字。

### 没有所有者的决策序号

**Leaked:** "The registry rejects duplicate names (decision 7: names are flat, no namespacing)."

**Fixed:** "The registry rejects duplicate names; names are flat, with no namespacing."

没有任何已提交的产物拥有「decision 7」,所以这个引用被删掉 —— 但它的事实性子句(名字是扁平的)要重述成能独立成立,不能跟着一起删。

### 审计项代号

**Leaked:** "Rendering is pure: same snapshot, same string (audit R3)."

**Fixed:** "Rendering is pure: same snapshot, same string."

仓库里没有审计文档;这个代号纯粹是当时会话的速记,不承载任何命题。

### 未提交草稿的章节号

**Leaked:** "Layering follows the design (v2 §3.2): `src/core/` is the pure core."

**Fixed:** "Layering: `src/core/` is the pure core."

没人提交过的草稿的 `§N` 无法解析。对照:"escapes per RFC 9110 §10.1.5" 要保留 —— 一个外部标准按设计就在仓库之外解析,而一份自己拥有 § 编号的已提交文档也可以按章节引用。

### 计划阶段的标签

**Leaked:** "`src/client/` is the shell (T4); the P-I migration owns the adapters."

**Fixed:** "`src/client/` is the shell; the adapters live in `src/client/adapters/`."

阶段标签索引的是一份从未落地的计划。把标签换成那个阶段产出了什么。

## 栈与 PR 视角

### 持久行文里的栈位置

**Leaked:** "A future remote backend implements this interface (the sandbox backend is a later PR in this stack)."

**Fixed:** "A remote backend can implement this interface without changing the render layer."

持久的行文看不到那个栈。保留扩展点的契约;待做工作的家是 PR 本身、一个 `TODO`,或者一个 issue。

### README 里的「本 PR」

**Leaked:** "This PR adds cursor-based pagination to the session list."

**Fixed:** "The session list paginates by cursor."

README 比每一个 PR 都活得久;把机制作为当前事实来陈述。

## 变更叙述与版本戳

### 带 PR 编号的战争故事

**Leaked:** "Colors used to come from `--widget-*` tokens, which nothing defined, so it always rendered the fallbacks; the alias tokens fixed that (PR #88)."

**Fixed:** "Colors come from the alias tokens; an undefined token renders the fallbacks."

两条当前有效的事实都幸存下来了 —— 当前的机制,以及那条仍然成立的失败行为 —— 都用现在时重述。这个 bug 的传记属于那个 PR 和它的 Agent Note。

### 移除叙述

**Leaked:** "The `probe` field is gone with the removal cut; badges ride the generic projection pair now."

**Fixed:** "Badges use the generic projection pair."

从没见过 `probe` 的读者,从它的缺席里学不到任何东西。用来跟一个已删除的过去做对比的「now」是一个版本戳。

### 已修的回归 → 现在时的反事实

**Leaked:** "This used to double-encode multibyte labels."

**Fixed:** "Without the byte-length guard, multibyte labels double-encode."

那颗回归钉子作为一句现在时的反事实幸存下来,并且点名了那个守卫;而「used to」把它钉在了仓库考古上。

### 指示性的版本戳

**Leaked:** "Batch rendering is synchronous this cut; the async path is roadmap work."

**Fixed:** "Batch rendering is synchronous."(那处推迟活在调用点的 `TODO(widget-batch):` 里。)

「this cut」/「v1」/「today」在合并的那一刻就过时了。一篇 Agent Note 的变更故事小节里的历史阶段名(「the first cut shipped X」)是当前状态安全的;而指示性的写法永远不是。

## 评审编排

### 把评审结论写成行文

**Leaked:** "Rejected in review: caching the resolved spec. We keep resolution per-call."

**Fixed(写在一篇 Agent Note 的 Alternatives considered 里):** "**Caching the resolved spec.** Rejected: the spec depends on per-call cwd, so a cache keyed by request would serve stale roots."

alternatives-considered 这个体裁才是被认可的家;评审者是谁、在第几轮,都不是理由的一部分。

### 草稿序号

**Leaked:** "As of v5 of this note, the loader also validates manifests."

**Fixed:** "The loader validates manifests."

一篇已实现的记录陈述的是已发布的现实;它自己的修订历史活在 git 里。

## 面向评审者的自辩

### 为一次 cast 辩护

**Leaked:** "The cast is safe — the SDK constructed the object, it simply doesn't declare the optionals strictly enough."

**Fixed:** "The SDK constructs this object with every optional populated; the declared type is looser than the runtime guarantee."

陈述维护者绝不能破坏的那条不变量。「It simply…」是一种在回答「HEAD 上没有人提出过的反驳」的口吻。如果那条不变量在代码里是可见的,那就直接删掉这段注释。

### 诉诸评审权威

**Leaked:** "This is correct because the reviewer confirmed the wrapping order."

**Fixed:**(删掉;换行顺序已经写在该函数的 `@returns` 里。)

正确性的论断引用的是不变量或测试,绝不是人。

## 复述与推导

### 控制流叙述

**Leaked:** "First we normalize the label, then we truncate it, then we wrap it."

**Fixed:**(删掉。)

注释下面那三行代码说的是同一件事。

### 测试走查

**Leaked:** "This test creates a session, sends two messages, waits for the second reply, and then asserts the log has four entries."

**Fixed:** "Two round-trips must produce exactly four log entries — the projection dedupes the shared prefix."

只保留那条不显然的断言理由;走查复述的是测试体本身。

## 对冲与计划残留

### 没有标记的推迟

**Leaked:** "Probably fine to render eagerly for now."

**Fixed:**(删掉;这处推迟已经有它的 `TODO(widget-batch):` 标记。)

一句没有所有者的对冲就是计划残留。如果没有标记,就写一个(`TODO(name): coalesce per animation frame`),而不是留着那句对冲。

### 含糊的容量说法

**Leaked:** "A 64 KiB buffer should be enough for most cases."

**Fixed:** "64 KiB holds the largest observed frame (48 KiB) with headroom; a larger frame fails loudly in `decode`."

把对冲换成实际的边界,以及超出这个边界时的失败行为。

## 写作语言串味

**Leaked:** "The renderer runs on the client 端; see the 设计稿 for spacing. ---- 私有 ----"

**Fixed:** "The renderer runs on the client side; spacing follows the Figma frame `widget-badges`."

工作语言的残片和会话分隔线都是转录残留。Figma 帧名要保留:那是按设计就在仓库之外解析的外部来源。

## 应当保留的

### issue 引用在任何表面上都是持久有效的

**Keep:** "The cap applies to the complete rendered value, wrappers included (issue #1470 owns the follow-up)."

一次没有辅助的清理把这句删掉了,理由是「issue 引用属于 Agent Note」。方向错了:issue 从任何表面都能在 HEAD 上解析,而「#N owns the follow-up」正是 README 里安放待做工作的、被认可的家。Agent Note 与事故复盘额外被认可的,是引用**已合并的 PR** 作为证据。

### 已失效的名字提及不算「点名所有者」

**Delete:** "Badge renderer over the widget seam (see the widget-rendering RFC)."

一次没有辅助的清理把它当成「按主题点名了所属文档」而保留了下来。判定标准是可解析性,不是形式:没有任何已提交的文件叫作「the widget-rendering RFC」,所以这个指针是死的。如果存在已提交的所有者就把它重新指过去;否则删掉。

### 抑制项的理由

**Keep(修正之后):** `// oxlint-disable-next-line no-non-null-assertion -- the one-element literal guarantees index 0.`

那条理由子句是必需的 prose。当写出来的理由是假的时候(原文写的是「the loop guard above proves a frame exists」,而周围根本没有循环),要去修那个理由;绝不删掉它。

### 实测得出的边界

**Keep:** "Depth cap (measured: 512 nests ≈ 0.15s synchronous; 4096 blocks the loop)."

这次测量把这个常量钉住,防止不明就里的重新调参;而「measured」正是把数据与猜测区分开来的那个来源标记。

### 运行时的新旧不是变更史

**Keep:** "The old connection drains before the new one accepts."

这里的「old」和「new」点名的是交接期间两个活着的运行时对象,不是仓库的两个状态。对变更叙述的禁令针对的是仓库历史,不是生命周期词汇。

## 矫枉过正的陷阱

下面每一个陷阱都在最初那次清理里真实发生过,并在评审中被抓出来。在精简一段话之前,先枚举它的各条命题。

### 把一项义务翻转成了背书

**Original:** "These direct registrations are exceptions pending migration to slots."

**Overcorrected:** "These direct registrations are sanctioned exceptions."

**Right:** "These direct registrations are exceptions pending migration to slots."

「pending migration」是一项义务;「sanctioned」是给现状发了祝福。这次精简在缩短句子的同时把它的模态反转了。

### 把一个假设升格成了已发布的特性

**Original:** "A future IPC-based shell subclasses the executor and overrides `spawn`."

**Overcorrected:** "An IPC-based shell subclasses the executor and overrides `spawn`."

**Right:** "A hypothetical IPC-based shell — no such shell exists — would subclass the executor and override `spawn`."

只把表示「将来」的标记删掉,就会让一段设计说明变成「这个类已经发布」的论断。要显式地标出这是假设,而不是仅仅去掉「将来」。

### 把一条真事实连同它周围的草稿一起删了

**Original:** "The gate notice narrates the check order; the notice text is also what `verify-doc-typecheck` compiles against."

**Overcorrected:** "…"(整句当成叙述删掉了。)

**Right:** "The notice text is what `verify-doc-typecheck` compiles against."

这句话一半是叙述,另一半是一处承重的耦合关系。当多条命题共处一行时,删子句,不要删整句。

### 保住了数字却丢掉了来源

**Original:** "The 4 MiB ceiling is measured: the largest generated `py-types` module is 3.1 MiB."

**Overcorrected:** "The ceiling is 4 MiB; the largest generated `py-types` module is 3.1 MiB."

**Right:** 保留「measured」。

没有「measured」,那个 3.1 MiB 读起来就像一个定义而不是一次观测,于是没人会在抬高上限之前重新测一遍。
