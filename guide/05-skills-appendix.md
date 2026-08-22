# 附:思维链泄漏的八类对照表

> 这是[第五篇](05-skills.md)的附录,备查用。判定怎么用、护栏为什么必要,在正文里讲;这里只放对照例子和搜索探针。
>
> 所有 before/after 都出自 dsh 2026-08 那次全仓库清理。每类给的是各自的修法,不是一律删。

## 一、死掉的引用

**引用有主 → 换成主人的名字和路径**

```
❌ Slash input resolves against the visible catalog (decision 21).
✅ …the plain-text-reference decision, owned by [the web input-machine note](…/2026-07-25-web-input-machine-and-slash-pipeline.md).
```

**引用没主,但带着事实 → 引用删掉,事实救出来**

```
❌ The registry rejects duplicate names (decision 7: names are flat, no namespacing).
✅ The registry rejects duplicate names; names are flat, with no namespacing.
```

仓库里没有任何东西叫 decision 7,但括号里「名字是平的、没有命名空间」是真事实。连它一起删,信息就丢了。

**整段一条事实都不带 → 直接删**

```
❌ Rendering is pure: same snapshot, same string (audit R3).
✅ Rendering is pure: same snapshot, same string.
```

**未提交草稿的章节号**

```
❌ Layering follows the design (v2 §3.2): `src/core/` is the pure core.
✅ Layering: `src/core/` is the pure core.
```

对比:`RFC 9110 §10.1.5` 要留 —— 外部标准天生在仓库外解析。仓库里自带 § 编号的已提交文档也可以按节引用。

**计划阶段代号** —— 修法是用那个阶段实际产出的东西替换代号:

```
❌ `src/client/` is the shell (T4); the P-I migration owns the adapters.
✅ `src/client/` is the shell; the adapters live in `src/client/adapters/`.
```

## 二、栈和 PR 视角

```
❌ A future remote backend implements this interface (the sandbox backend is a later PR in this stack).
✅ A remote backend can implement this interface without changing the render layer.
```

持久化的文字看不见那个栈。扩展点的契约保留,待做的工作它的家是 PR 本身、一个 `TODO`、或者一个 issue。

```
❌ This PR adds cursor-based pagination to the session list.
✅ The session list paginates by cursor.
```

README 比任何 PR 活得都长。

## 三、变更叙述和版本戳

**带 PR 号的战斗故事**

```
❌ Colors used to come from --widget-* tokens, which nothing defined, so it always
   rendered the fallbacks; the alias tokens fixed that (PR #88).
✅ Colors come from the alias tokens; an undefined token renders the fallbacks.
```

这里有**两个**活着的事实:当前机制,和一条仍然成立的失败行为。两个都改成现在时保留,bug 的传记归 PR 和决策记录。

(把「以前会出 bug」改写成「没有那个守卫就会出 bug」的**反事实现在时**,在[正文](05-skills.md)里单独讲了。)

**删除叙述**

```
❌ The `probe` field is gone with the removal cut; badges ride the generic projection pair now.
✅ Badges use the generic projection pair.
```

从没见过 `probe` 的读者,从它的缺席里学不到任何东西。那个 `now` 是在跟一个已被删掉的过去对比,也是版本戳。

**指示性版本戳** —— 合并那一刻就开始过期:

```
❌ Batch rendering is synchronous this cut; the async path is roadmap work.
✅ Batch rendering is synchronous.   ← 延后的部分放进调用点的 TODO(widget-batch):
```

一篇决策记录的变更故事一节里写「第一版交付了 X」是安全的(那是历史阶段的名字);`this cut` 这种指示形式永远不安全。

## 四、评审编排

这一类**不是删掉,是搬家**:

```
❌ Rejected in review: caching the resolved spec. We keep resolution per-call.
✅（搬进决策记录的 Alternatives considered)
   **Caching the resolved spec.** Rejected: the spec depends on per-call cwd,
   so a cache keyed by request would serve stale roots.
```

被否掉的备选方案有它法定的家。评审者是谁、第几轮否的,不是理由的一部分。

```
❌ As of v5 of this note, the loader also validates manifests.
✅ The loader validates manifests.
```

一篇已落地的记录陈述既成事实,它自己的修订史在 git 里。

## 五、面向评审者的自辩

```
❌ The cast is safe — the SDK constructed the object, it simply doesn't declare
   the optionals strictly enough.
✅ The SDK constructs this object with every optional populated; the declared type
   is looser than the runtime guarantee.
```

`it simply…` 是一个在回答「没人在 HEAD 提出过的反驳」的声音。改法是陈述维护者不能破坏的那条不变量;如果代码本身已经说明了,才删。

```
❌ This is correct because the reviewer confirmed the wrapping order.
✅（删掉;包裹顺序已经写在那个函数的 @returns 里)
```

正确性只能引用不变量或测试,**绝不引用人**。

## 六、复述和推导

```
❌ First we normalize the label, then we truncate it, then we wrap it.
✅（删掉;下面三行代码说的就是这个)
```

测试注释同理,只留那条不显然的断言理由:

```
❌ This test creates a session, sends two messages, waits for the second reply,
   and then asserts the log has four entries.
✅ Two round-trips must produce exactly four log entries — the projection dedupes
   the shared prefix.
```

「四」为什么是四,才是读者需要的。前一句只是把测试体又念了一遍。

## 七、对冲和计划残留

```
❌ A 64 KiB buffer should be enough for most cases.
✅ 64 KiB holds the largest observed frame (48 KiB) with headroom; a larger frame
   fails loudly in `decode`.
```

`should be enough` 掩盖的是**根本没人量过**。改完之后有了实测上界和越界时的行为:写的人被迫去查了,读的人也不用猜。

```
❌ Probably fine to render eagerly for now.
✅（删掉;这个延后已经有 TODO(widget-batch): 标记了)
```

没有主人的对冲就是计划残留。如果还没有标记,**写一个**(`TODO(name): coalesce per animation frame`),而不是留着这句话。

## 八、写作语言串味

```
❌ The renderer runs on the client 端; see the 设计稿 for spacing. ---- 私有 ----
✅ The renderer runs on the client side; spacing follows the Figma frame `widget-badges`.
```

工作语言的碎片和会话分隔符是转录残留。但 Figma frame 名保留 —— 那是天生在仓库外解析的外部出处。

## 怎么在自己仓库里找

dsh 备了一套 grep 探针,**故意过度匹配**,每个命中都要人再判断:

```sh
rg -n --hidden '\(decision \d|\(audit [A-Z]\d|design §|plan §|\bT\d\b|\bP-I\b'
rg -n --hidden -i 'this PR|this branch|this stack|later PR|previous commit'
rg -n --hidden -i 'used to |no longer|previously|the old |was renamed|was moved'
rg -n --hidden -i '\bv1\b|this cut|\btoday\b|\bfor now\b|roadmap'
rg -n --hidden -i 'rejected in review|review round|reviewer|as of v\d'
rg -n --hidden -i 'probably |should be enough|should suffice|it simply|is safe —'
rg -n --hidden '设计稿|评审|上一?轮|旧版|老的|不再|以前|本版|遗留|私有'
```

两个使用规则值得抄。

**`--hidden` 必须加。** 否则 ripgrep 默认跳过点目录,`.agents/` 整个搜不到 —— 那次清理最大的漏检风险就在这儿。

**零命中不能证明任何事,除非你亲眼见它匹配过。** 先拿一个已知的正例试一下,再去相信那个「没有问题」的结论。这条和[第三篇](03-gates.md)那句「引入回归、看它变红、再撤销」是同一个道理。

已知的假阳性别一刀切:

| 看着像 | 其实是 |
|---|---|
| `the key used to sign requests` | 工具性的 used to,不是时间义。时间义前面会有一个主语状态(`colors used to come from…`) |
| `the old connection drains before the new one accepts` | 交接期间的两个活对象,不是仓库的两个版本 |
| 流程文档里的 `this PR` | 讲 PR 工作流的文档本来就该说 PR;禁的是一篇讲代码的文档采用了某个 PR 的视角 |
| `/v1/chat` | 标识符,不是版本戳 |
| 生成的时间戳、CLI 输出样例里的 `today` | 录下来的输出保留它自己的口吻 |
| 决策记录 Alternatives 一节里的 `rejected` | 法定的家,不是评审编排 |

原件里还有更多校准例子和五步工作流:[SKILL.md](../.agents/skills/dsh-trim-cot-leakage/SKILL.zh.md)、[examples.md](../.agents/skills/dsh-trim-cot-leakage/references/examples.zh.md)、[recall-batteries.md](../.agents/skills/dsh-trim-cot-leakage/references/recall-batteries.zh.md)。

---

回到:[五、Skills](05-skills.md)
