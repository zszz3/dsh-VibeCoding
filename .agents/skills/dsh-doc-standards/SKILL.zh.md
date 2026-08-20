# Applying the DeepSeek Harness Documentation Standard(中文对照)

[English 原文](SKILL.md) | 中文

在 deepseek-harness 仓库里撰写、移动、审阅或审计文档时——不论是选择层级与详略、区分教程与参考资料、检查教程的循序渐进、削减文档冗余、回应 `verify-doc-budgets` 失败、还是诸如"改进文档"、"审计文档"、"这该记在哪里"、"这篇文档太长了"这类请求时,使用本 skill。

文档规则住在 [docs/AGENTS.md](../../../docs/AGENTS.zh.md)。本工作流覆盖 Markdown、JSDoc 与代码注释中的归属、语料审计、预算与验证。它是指导,而非脚本;把 [dsh-prose-standard](../dsh-prose-standard/SKILL.zh.md) 用于必需的覆盖与编辑判断,并且绝不把长度本身当成缺陷。

## 信源(阅读,不要重写摘要)

- [docs/AGENTS.md](../../../docs/AGENTS.zh.md)——层级、教程/参考资料形式、分类、预算与冗余清单。
- [.agents/notes/README.md](../../notes/README.md)——当一项决定值得记成 Agent Note 时、如何归档、以及 Note 里放什么(标题块、按生命周期骨架、 Alternatives-considered 强制要求,由 `verify-agent-note-format` 门禁);[docs/postmortem/README.md](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/postmortem/README.md)——何时一起事故值得复盘。
- [docs/i18n/README.md](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/i18n/README.md)——双语配对规则;修改一对中的任何一侧,都要求在同一个改动里同步对应侧。
- 根 [AGENTS.md](../../../AGENTS.zh.md)——其预算纪律被本 skill 守护的现行指令。
- [已归档 Agent Notes](../../notes/archived/AGENTS.md)——被冻结的历史快照,排除在编辑维护与演进中的文档门禁之外。

## 在 prose 之前审阅结构

把规范的撰写顺序应用到范围内每一份面向人类的文档。不要把该结构检查应用于 Agent Notes。把复盘归类为 scope 一场事故的参考资料;在保留其必需的时序证据时,不要把时序当成教学序列。

1. 在仓库与导航树中定位该文档。陈述它自身的主题,并确认其直接子项。
2. 设定允许的详略程度。保留关于该文档主题的全部细节,按目的、职责与高层行为概述直接子项,并把更深解释移到所属后代文档并附链接。把测试基础设施当作归后代所有,除非它是该文档的主题。
3. 按文档的预期用途、而非路径或标题来分类它。教程必须带人按序工作直到可观察的结果;参考资料必须在明确 scope 内支持查阅、而不必顺序阅读。
4. 对于教程,私下把起始读者与概念分类为初阶、中阶或高阶。把每个概念追溯到其前提,重新排序过早的材料,并把可选的高阶细节挪到更晚的教程或参考资料。
5. 拆分大型混合形式。把小规模的次要形式放进标签清晰的章节。

然后检查那些让归属变贵或出错的限制:

- 配对文档(`pnpm run verify-translation-pairing --list`)每次编辑都要付出 zh 对应方更新与一次 `--write` 重录的代价——优先为会频繁变更的内容选择未配对的归属。
- 生成的目录绝不手工编辑;如果事实归属那里,改其生成器的源。
- 重命名或移动任何文档之前,grep 入库引用:`verify-md-links` 既捕获 Markdown 链接目标也捕获指向 Markdown 文件的 `#fragment` 锚点(标题 slugs 与显式 `<a id>`),而 `verify-doc-refs` 捕获 TypeScript 注释里的 `docs/*.md` 引用;当锚点从 TypeScript 字符串引用、且其输出到不了门禁扫描的 Markdown 时,仍需要手动 grep。
- 移动是原子的:从旧归属移除、加到新归属、并在同一个改动里修复每条入库链接。

## 审计语料

结构检查之后,用最便宜的 probe 先 hunt 规范的冗余清单。核验并抓取 PR 的 live base,然后跑 `pnpm --silent run change-scope --base <verified-base-ref>` 在施加语义判断之前 identify 已提交与脏路径。在重定向或 base 合并之后,重跑该报告并审计由新 base 引入的 prose。

1. 度量:`pnpm run verify-doc-budgets --list`,然后 `git ls-files '*.md' ':(exclude)vendor/**' | xargs wc -w | sort -rn | head -30` 以发现无预算的离群值。
2. 用 [dsh-trim-cot-leakage](../dsh-trim-cot-leakage/SKILL.zh.md)hunt 推理转录泄漏——叙述式历史、已死的设计会议引用、review 编排、控制流叙述、测试 walkthrough——该 skill 定义了分类、回忆电池与保留/删除规则。只保留非显然的契约或耐久理由;同一理由在兄弟方法旁重复出现时保留一个归属。
3. 通过 grep distinctive 短语来 hunt 重复。保留一个归属,把其它副本换成链接。
4. 用手工编写的目录、测试/状态清单与 JSDoc 重述替换成权威的树、脚本或生成的参考资料。
5. 在 `implemented/` Agent Notes 中,移除迁移计划、验收任务清单与未来时态 spec 语言。保留简洁的验证契约——识别那些锚定已发布决定的行为与层级——以及命名的覆盖缺口。
6. 如果移除 prose 改变的是被承诺的行为而非其解释,先用 proposed Agent Note(遵循 [dsh-find-simplifications](../dsh-find-simplifications/SKILL.zh.md))。

把 `.agents/notes/archived/` 排除在语料审计与编辑之外。活跃 prose 可以修补、重定向或删除一条入库链接,但绝不跟着一次全归档清理进入被冻结的目标。

保留每条 load-bearing 规则,最好是一到三行加一个指向其理由的链接。砍掉叙事、重复、状态注记与推导出该规则的路径。不要为了 relocate 一次性推理就新建一条解释。

## 当 verify-doc-budgets 变红时

按 [docs/AGENTS.md](../../../docs/AGENTS.zh.md) 中的有序 relocate-condense-raise policy;本 skill 只提供上面的工作流 probes。

## 验证与 PR 卫生

至少跑 `pnpm run doc-sync`、`pnpm run lint` 与 `git diff --check`;JSDoc 改动可能重新生成目录。如果一对配对文档有改动,遵循[轻量例程路径](../../../docs/AGENTS.zh.md#writing-rules)并跑 `pnpm run verify-translation-pairing --write <pair>`。PR 体应给出字数 delta、解释任何刻意留长的例外,并列出门禁。
