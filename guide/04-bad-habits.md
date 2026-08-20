# 四、针对 AI 坏习惯的规范

## 不做会怎样

AI 写的东西,单看每一处都通顺,攒起来会有几种固定的毛病:

注释里留着只有当时对话才懂的引用——`(decision 7)`、`按方案 B 处理`。半年后没人知道 decision 7 是什么。

文档里写「以前是 X,现在改成了 Y」。再改一次就变成「以前的以前」,读者要考古才能知道当前到底是什么。

最麻烦的是第三种:它说「我已经验证过了」,而它其实只是看了一眼代码觉得没问题。

这些毛病是有规律的,所以能一类一类立规矩去治。

## dsh 立了三条

### 一、别把推理过程写进产物

判定只有一句话:

> 一个只看当前代码、拿不到任何对话记录的读者,能不能解析每个引用、验证每个论断?

不能,就重写。完整规则在 [dsh-trim-cot-leakage](../.agents/skills/dsh-trim-cot-leakage/SKILL.md),下一篇会拿它当例子细讲。

这条判定的出处是一篇决策记录:[committed-artifact-citations](../.agents/notes/implemented/process/2026-08-09-committed-artifact-citations.md)。它规定引用必须指向已提交的东西——issue 号、文件路径、外部标准都行,「我们上次聊的那个方案」不行。

**好在哪。** 这条规则的边界不是靠感觉划的。比如 `#1470` 这种 issue 引用看着也像「外部上下文」,但它在任何时候都能解析,所以是允许的;而「按上次讨论的做法」不能解析,所以不允许。有了明确的判定,AI 不用猜,你也不用逐条评判。

### 二、测世界,别测 AI 自己的报告

[docs/testing.md](../docs/testing.md) 里有一节标题就是 "Verify the world, not the self-report":

> An e2e assertion re-runs the command or re-reads the file externally; a keyword probe on the agent's own output lets a cheating agent pass.

断言要重跑命令、重读文件来外部核验。如果靠在 AI 的输出里搜关键词,一个会作弊的 agent 说一句「已完成」就能过。

同一节还有一条更细的:

> Assert untouched files are byte-identical.

**好在哪。** 这条不只防作弊,也防真实的 bug。一个改文件的工具可能改对了目标文件,同时把旁边一个文件的换行符改了。断言「没动过的文件字节完全一致」能抓到这类副作用,而看 AI 的报告永远抓不到。

### 三、措辞要具体

不用隐喻,不用「gate」「surface」「shape」这类空词,点名具体的检查、类型、操作。出处:[concrete-prose-names-actors-and-recorded-facts](../.agents/notes/implemented/process/2026-08-09-concrete-prose-names-actors-and-recorded-facts.md)。

根 `AGENTS.md` 里给了替换示例:

> write `response fields`, `JSON validation`, or `ESM exports` instead of `response shape`, `validation boundary`, or `module shape`.

而且它不是一刀切禁用,而是「用之前先自问」。[dsh-prose-standard](../.agents/skills/dsh-prose-standard/SKILL.md) 的原话:

> Treat `contract`, `boundary`, `shape`, `surface`, `seam`, `gate`, and `vocabulary` as terms to check before use, not banned words.

**好在哪。** 空词会掩盖理解不到位。写「校验边界」的时候可以完全不知道校验的是什么;被迫写成「JSON 解析时校验字段类型」就必须知道。所以这条规则实际上是在逼作者(人或 AI)把事情想清楚,顺便让读者也省事。

保留的例外也有明确标准:当这个词确实命名了那个准确的技术对象时保留——调用方与被调方之间的契约、真实的进程或安全边界,这些场合 `contract` 和 `boundary` 就是最准的词。

## 自查清单

```
有没有只有当时对话才懂的引用?
注释是在说契约,还是在复述代码 / 叙述过程?
断言的是外部状态,还是 AI 自己的输出?
有没有空词可以换成具体的名字?
```

## 搬到自己项目

先把这四条塞进 `AGENTS.md`(每条一两行 + 一个链接),成本几乎为零。

等某一条开始需要反复解释边界——比如「什么算推理过程、什么算必要的历史信息」——再把它升级成一个 skill,把边界和反例写全。这是[下一篇](05-skills.md)的话题。

## 容易做错的地方

**不要用关键词探测 AI 的输出来判断成功,要重跑命令、重读文件外部核验。** 「回答里出现了『完成』就算过」等于把判卷权交给考生。

**不要放任「以前 / 现在」式的叙述,要只写当前状态。** 单看一处很自然,攒半年就成了考古现场。确实需要记一次变更,那属于决策记录或事故复盘,不属于代码注释。

**不要只告诉 AI 该删什么,要同时写清什么不该删。** 这是个真实的反向风险:AI 接到「清理」任务,很容易把 issue 号、豁免理由、实测数据一起删掉。下一篇会看到 dsh 是怎么处理这一点的。

---

上一篇:[机器门禁](03-gates.md) · 下一篇:[Skills](05-skills.md)
