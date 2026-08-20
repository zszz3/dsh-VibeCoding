# Recall batteries (中文对照)

[English 原文](recall-batteries.md) | 中文

针对 [分类法](../SKILL.zh.md#taxonomy) 的探针,在 2026-08 清理期间经过校准。每个命中都需要语义判断 —— 这些电池在目的上过度匹配,在本质上又匹配不足:清理的每一轮 review 都发现了电池漏掉的情况,因此要把它们与对范围内最密集 prose 的无模式阅读配对。

## 调用规则

- 添加 `--hidden --glob '!.git/**'` 以便搜索 `.agents/`;ripgrep 默认跳过以点号开头的目录,而清理期间最大的遗漏风险是 Agent Note。
- 排除规则放在最后,这样后面的包含无法重新纳入它们:`--glob '!vendor/**' --glob '!node_modules/**' --glob '!.agents/notes/archived/**' --glob '!.agents/skills/dsh-trim-cot-leakage/**'`(该 skill 自身的文件把泄露的措辞作为 calibration 引用),以及在范围内的已记录 fixture 和快照目录。而该 [所属说明](../../../notes/implemented/process/2026-08-09-committed-artifact-citations.md) 也通过其引用的证据自匹配;把它判断为证据,而非使用。
- 自然语言行使用 `-i`,以便句首大写的命中("This PR adds…"、"Probably fine…");第一行匹配代码模式,保持大小写敏感 —— `-i` 会把 `\bT\d\b` 和 `\bP-I\b` 变成噪声。
- 零命中模式在你亲眼看到它命中之前证明不了任何东西:在信任否定结果之前,先用一个已知为正的字符串测试它。

## 英文电池

```sh
rg -n --hidden '\(decision \d|\(audit [A-Z]\d|design §|plan §|design ledger|\(B ruling|\bP-I\b|\bW\d\b|\bT\d\b' ...
rg -n --hidden -i 'this PR|this branch|this stack|later PR|previous commit|this commit' ...
rg -n --hidden -i 'used to |no longer|previously|the old |was renamed|was moved' ...
rg -n --hidden -i '\bv1\b|this cut|\bcut \d|\btoday\b|\bfor now\b|roadmap' ...
rg -n --hidden -i 'rejected in review|review round|reviewer|as of v\d' ...
rg -n --hidden -i 'probably |should be enough|should suffice|it simply|is safe —|is safe --' ...
rg -n --hidden '§\d' ...
```

## 中文电池

```sh
rg -n --hidden '设计稿|评审|上一?轮|旧版|老的|不再|以前|本版|遗留|私有' ...
rg -n --hidden '(^|[^a-zA-Z])端([^a-zA-Z]|$)' --glob '*.md' ...
```

## 已知误报家族

在清理期间判断并保留;预计会再次遇到:

- **工具性的 "used to"** —— "the key used to sign requests" 是工具性用法,不是时间性用法。时间性形式在它之前有一个主语状态("colors used to come from…")。
- **运行时的 old/new** —— "the old connection drains before the new one accepts" 命名的是交接期间的存活对象,不是仓库状态。
- **流程文档中的 "This PR"** —— *关于* PR workflow 的文档("the PR body should…"、模板、本仓库的流程说明) legitimately 使用 "PR";禁令针对的是一份文档借用某个单一 PR 的视角来议论代码。
- **作为协议或路径段的 `v1`** —— `/v1/chat` 端点和 wire-format 名称是标识符,不是版本戳记。
- **有 committed 所属的 `§N`** —— 外部标准(RFC 9110 §10.1.5)和拥有其 § 编号的 committed 文档,按节引用仍然有效。
- **对比性的 "actually" 和名词 "wait"** —— 普通英语,不是 hedging;没有 committed 行探测它们,所以只有当你用更宽的 hedging 模式扩展电池时,它们才会浮现。
- **生成时间戳和 CLI 输出样例中的 "Today"** —— 记录的输出保留它自己的声音。
- **中文 prose 中的 本版本** —— 在版本化制品上下文中这是对 "this release" 的合法转写;被禁止的索引词是 mirror "this cut" 的裸戳记 本版。
- **Alternatives-considered 章节** —— 在 Agent Note 的体裁槽位内部的 "rejected" 是被允许的归宿,而不是 review choreography。
