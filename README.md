# dsh-VibeCoding

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)(简称 dsh)是 DeepSeek 开源的 agent harness。它自己就是用 AI 开发的——仓库分支里能看到 `codex/`、`worktree/`、`agent/` 这些前缀,是不同 AI agent 提交的。

为了让 AI 真能干活,它在仓库里攒下了一整套配套文件:给 AI 每次开工读的规则、近七百篇决策记录、十一个把工作流固化下来的 skill、上百个自动门禁脚本。这些东西散在各个目录,不专门去翻很难注意到。

**这个仓库把它们挑出来放到一起,原样不动,再配一份讲怎么用的教程。**

## 先看一个例子

dsh 有 696 篇决策记录。「给这些记录做个总索引吧」是个很自然的念头——但这事早有定论,被否了,理由写在[一篇记录](.agents/notes/implemented/process/2026-07-19-remove-generated-agent-note-index.md)里:生成的索引会变成合并冲突热点,任何分支新增或改名一篇不相关的记录都要重写同一个文件;而它的内容只是重复了文件路径已有的信息;还多一套生成器要养。

所以下一个动这个念头的人,会先撞见这篇,然后要么被说服,要么拿出更强的理由。

**这就是这套东西在做的事:** 把「为什么当初这么定、否掉了什么」留在仓库里,让 AI 和几周后的你都不必重新推一遍、重新踩一遍。上面那篇记录只是 204 篇之一。

## 为什么需要这套东西

跟 AI 协同的麻烦不在智力,在三件事,而且换更强的模型也不会消失:

| 前提 | 具体表现 | 兜它的机制 |
|---|---|---|
| 没有记忆 | 每个 session 从零开始,上周定的规矩它不知道 | ① 常驻规则 ② 决策记录 |
| 产量太大 | 一晚上的 diff 你三天看不完,逐行人工审不现实 | ③ 机器门禁 |
| 会自我美化 | 没验证的事写成验证过了,推理过程当结论写进注释 | ④ 坏习惯规范 ⑤ Skills |
| (协作放大) | 几个 AI 同时改会互相覆盖,人审成为瓶颈 | ⑥ 隔离并行 + 互审 |

## 教程

一篇一个机制。每篇都拿仓库里能点开的真实文件举例,说明它好在哪。

| 篇 | 一句话 |
|---|---|
| [一、常驻规则](guide/01-agents-md.md) | 规矩写成 AI 每次开工自动读到的索引,而不是每次重新交代 |
| [二、决策记录](guide/02-agent-notes.md) | 每个非平凡决定写一篇,**必写否掉了哪些方案** |
| [三、机器门禁](guide/03-gates.md) | 能机器判断的规则一律焊成脚本,三道关卡逐级变严 |
| [四、坏习惯规范](guide/04-bad-habits.md) | 针对 AI 那几种固定毛病各立一条可执行的规矩 |
| [五、Skills](guide/05-skills.md) | 固化的不是步骤,是「AI 容易做错且当时看不出来」的那条判断 |
| [六、并行与互审](guide/06-parallel-and-review.md) | worktree 隔离、栈交给平台、AI 审 AI 但不许附和 |
| [七、怎么开始](guide/07-adoption.md) | 六步,每步单独也有用,停在第三步也是完整状态 |

按顺序读最省力,也可以直接跳到关心的那篇。

## 想直接翻原件

| 你想看 | 去哪 |
|---|---|
| 「给 AI 读的规则」长什么样 | [根 AGENTS.md](AGENTS.md);另有五份子目录专属的([docs](docs/AGENTS.md)、[packages](packages/AGENTS.md)、[scripts](scripts/AGENTS.md)、[.github](.github/AGENTS.md)、[notes](.agents/notes/AGENTS.md)),六份叠起来就是「分层就近」的实物 |
| 决策记录怎么写、怎么流转 | [制度全文](.agents/notes/README.md);`.agents/notes/` 下有 204 篇真实记录,六个类别、四种生命周期都有 |
| 一个 skill 里到底固化了什么 | [dsh-trim-cot-leakage](.agents/skills/dsh-trim-cot-leakage/SKILL.md) 最典型——一条判定加一张「什么不算泄漏」的护栏,后者拦的是 AI 清理时把 issue 号、豁免理由、实测数据一起删掉 |
| 测试上有什么讲究 | [测试策略](docs/testing.md),里面「验证世界而不是验证自我报告」那节值得单独看 |

## 抄之前要知道的一件事

这些原件是 dsh 的文件,里面的命令(`pnpm run test`)、目录(`packages/`)、技术选择(Cordis、ESM)说的都是 dsh 那个仓库,在这里不成立。当参考实现看,抄到自己项目时换成自己的事实,顺序见[第七篇](guide/07-adoption.md)。

内容一字未改,唯一动过的是跨仓库链接。收录范围、改了哪些链接、哪些 skill 不容易搬,都在 [ATTRIBUTION.md](ATTRIBUTION.md) 里。
