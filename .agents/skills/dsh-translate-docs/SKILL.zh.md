# Translating DeepSeek-Harness docs(中文对照)

> 这是 [SKILL.md](SKILL.md) 的中文对照,供阅读方便。**英文原文是权威版本**,执行规则时以原文为准。

本 skill 在你通过名称显式调用 `dsh-translate-docs` 时触发,用于手动执行扩展的 DeepSeek Harness 双语文档工作流,包括生成的简报、委托式散文翻译、整文档翻译,以及限定范围的 pairing(配对)验证。普通文档翻译遵循 [docs/AGENTS.md](../../../docs/AGENTS.md) 中的一次性单遍规则,不要选择或加载本 skill。

## Invocation boundary(调用边界)

只有用户通过名称显式调用 `dsh-translate-docs` 时,才运行此扩展工作流。绝不因普通文档工作、从别的 skill,或推断出的翻译需求而去选择或加载它;常规翻译遵循 [docs/AGENTS.md](../../../docs/AGENTS.md) 中的一次性单遍规则。

## What this skill is(本 skill 是什么)

**本 skill 是工作流指引,不是翻译记忆库。** 它是用来保持 `foo.md ↔ foo.zh.md` 一对文件在两种语言中一致、自然的工作流地图。两种语言具有同等权威——改动以任意一侧为源起稿,那一侧就是本次更新的源。你是翻译者:下面的规则说的是必须守住什么,而不是某句话该怎么措辞——措辞判断交给你,术语不是。

## Triage by change type — this decides everything else(按改动类型分诊——这点决定其它所有事)

- **Update**(pair 已存在,一侧被编辑):走[更新路径](#the-update-path-briefing-driven)。它是简报驱动的,刻意做得便宜:不需要读指引语料、不做 git 考古, counterpart(对照方)只做最小编辑。绝不为了应用一次更新而重译整篇文档——最小更新保留所有未改动内容的审阅措辞;重译会把那次审阅作废。
- **New pair**(还没有 counterpart):走[整文档路径](#the-whole-document-path-new-pairs)。
- **Deleted or renamed doc**(被删除或重命名的文档):连带删除或重命名它的 counterpart 和 `.i18n.yaml`——不然门禁会报未配对完成。

`.agents/notes/archived/` 下冻结的 Agent Note 不属于翻译工作。它们完整的三元组由归档校验器密封;归档之后绝不更新、重录或修补任何一侧。

## The update path (briefing-driven)(更新路径——简报驱动)

简报驱动路径以指引语料同等质量、几分之一的成本达成;被简报过的更新 Agent Note 握有基准证据。

1. **生成简报**:`pnpm run gen-translation-brief <pair 中任意一个文件>`(不带参数则简报每一个失同步 pair)。简报以最窄且安全对齐的粒度映射改动——先是单个 Markdown 单元(段落、表行、列表项、标题),再是整个标题小节,最后是整篇文档;并包含源侧自上次确认一致以来的 diff、每个改动单元上次确认的源、当前源,以及当前 counterpart 文本(带行号)、改动涉及的术语行、首次出现位置移动说明,以及绑定更新规则的提要。
2. **纯机械 diff?用 `--apply` 应用。** 当所有改动都落在 pair 逐字相同的代码围栏内时,简报会如此说明;`pnpm run gen-translation-brief --apply <pair>` 把编辑后的围栏拼接进 counterpart,并在写入前做结构校验——不要 subagent,不要手改。
3. **散文 diff?委托 subagent,把简报传给它**(或生成简报的命令)。简报就是翻译者的全部工作面——subagent 不需要重读指引语料(规则提要、术语行、每个改动单元的三方上下文都内联),也不需要重新推导 diff。只有在简报对某个决定实在无法回答时它才上升到整文档路径的权威源——某个未列术语在上下文中无先例,或者是整文档简报(`BOTH sides changed`,即两边都改了;或单元与章节都对不齐),那永远意味着在 [translation-rules.md](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/i18n/translation-rules.md) 下手调对账。
4. **覆盖 diff 的最小编辑。** 保留 diff 没触及的所有审阅措辞,然后逐条逐句对照源校验改动块:不加、不漏,术语按内联行,代码 span 逐字保留。
5. **限定范围地记录与校验**:`pnpm run verify-translation-pairing --write <pair>` 然后 `pnpm run verify-translation-pairing <pair>`。`--write` 精确点名你确认过的 pair——它以 bare 形式拒绝运行,这样批量重录永远是一个显式的 `--all`。全语料库检查仍在 `doc-sync`/CI 中运行;不要每次更新都跑它。

## The whole-document path (new pairs)(整文档路径——新 pair)

当着翻译需要从零写起时,编排 agent 不亲自翻译:派生一个 subagent 去做翻译工作。翻译者先读下面的权威源,再把整篇文件译成另一种语言——长文档逐节翻译,边翻边把每节结构锁定到源,而不是最后再补结构。

### Sources of truth(权威源——读,不要重述)

- **[docs/i18n/README.md](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/i18n/README.md)**——pairing 契约:三文件 pair(`foo.md`、`foo.zh.md`、`foo.i18n.yaml`)、一致性记录的双方 blob hash、语言切换行、作用域与排除项。
- **[docs/i18n/translation-rules.md](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/i18n/translation-rules.md)**——怎么翻译:忠实度、结构保留、术语规范、排版(MUST/SHOULD 层级)。
- **[docs/i18n/terminology.md](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/i18n/terminology.md)**——术语表,双向绑定。译之前就读,不要等某个术语拿不准了才翻;你没留意到的那些术语,恰恰是会漂走的。
- **[docs/i18n/translation-prompt.md](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/i18n/translation-prompt.md)**——自动化流水线校准过的、供机器消费的模板。用本 skill 的 agent 不渲染它;术语表是自动化渲染器唯一注入的仓库文件,而本 skill 与 translation-rules.md 对 agent 撰写的翻译依然具约束力。
- **[dsh-prose-standard](../dsh-prose-standard/SKILL.md)**——必达的散文覆盖与编辑判断。把它运用到两边,不增不减源命题。

### Translate(翻译)

- **Pass 1——写,不要照搬。** 读一个语义单元,然后用最贴合[语言范例](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/i18n/style-samples.md)语气的母语技术写作者口吻重述它。保留要求的框架,但不强求逐句对应。
- **Pass 2——逐条逐句对照源校验。** 保真度在这里是验出来、不是写出来的:确认没增没漏、每个术语都跟表走、每个代码 span 都逐字存活。靠把句子 Rewrite 成地道的来修,不是往句子里塞词补字。
- **单独读译完的 counterpart。** 源对比之后,离开源单独读译文,把那种只有孤立时才显 awkward 的措辞改掉。
- **只把最终文本写进文件,绝不写草稿或笔记。**
- [terminology.md](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/i18n/terminology.md) 里的每个术语都精确按规格渲染。中文目标用中文列与首次出现列;未列术语需要可引用的中文开源/厂商先例,否则以英文列在「待定术语」下。英文目标用英文列与一个成型的英文技术术语;有歧义的源术语用短注保留并列为待定。绝不 inline 生造译法。
- 代码块在 pair 间逐字节相同,注释 included。相对链接保留它们的 `.md` 目标;只有切换行链向 `.zh.md`。配对门禁检查标题深度、围栏块、表行与表列数、列表类型、有序表起始、列表项数,以及链接目标。在 Pass 2 中人工校验列表与表的顺序、非规范列表编号、行内代码、强调、含义、术语与语气。

## Find the work(找到工作)

- `pnpm run verify-translation-pairing --list` 打印每一个在作用域内的文档为缺失 / 失同步 / 正常。缺失与失同步行是契约违规;常规检查拒绝它们。
- `pnpm run gen-translation-brief` 不带参数时为每一个失同步 pair 打印简报。
- 在编辑过配对文档的 PR 中,工作列表就是 diff 本身:一对中每个被改过的侧都需要更新 counterpart,并在同一个 PR 里重录这对;你忘了门禁就红。

## Finish the pair(完成 pair)

1. 切换行:中文文件 H1 之后立刻写 `[English](foo.md) | 中文`,英文文件 H1 之后写 `English | [中文](foo.zh.md)`——新 pair 两边都加,但生成器拥有的英文源逐字节保留生成器输出、omit 切换行,而中文 counterpart 仍链回它。
2. 记录一致性:`pnpm run verify-translation-pairing --write <pair>` 重算并把双方完整 blob hash 记入 `foo.i18n.yaml`。PR 里的 yaml diff 就是那句可审阅的「我确认这两边说的是同一件事」——只有你真的确认之后再跑它。
3. 普通文档不需要清册条目:每一个在作用域的源都需要一对。只在所属策略书面证明属于真正的生成式、教学式、或双语构建的排除时,才改 [scripts/translation-pairing.manifest.json](https://github.com/deepseek-ai/deepseek-harness/blob/master/scripts/translation-pairing.manifest.json)。
4. PR 之前:被碰的 pair 在限定范围检查下是绿的;`pnpm run doc-sync`(含全语料库配对检查与 `verify-md-wrap`/`verify-md-links`)在 PR 层级按[dsh-pre-push-checks](../dsh-pre-push-checks/SKILL.md)跑一次,不塞进每次翻译任务。
5. 保持 PR 可审阅:说明哪些 pair 是新的、哪些是最小更新,并突出列出「待定术语」。

## How to respond to translation review(如何回应翻译 Review)

按[code review 汇报指引](../dsh-code-review/SKILL.md#reporting-findings)处理:就事论事评估每条评论;对术语评论,记住术语表就是契约——把某次 reviewer 的译法决定应用到 [terminology.md](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/i18n/terminology.md),而不是只改一个文件。
