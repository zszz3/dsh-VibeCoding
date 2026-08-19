# 一、常驻规则:AGENTS.md

## 不做会怎样

你跟 AI 说「我们项目提交信息用中文、测试放 tests/ 目录」,它照做。第二天新开一个 session,它又用英文提交、把测试塞进了 src/。因为上一次对话它不记得。

每次重新交代一遍是可行的,但你交代的东西会漂:今天说得细一点、明天忘了说一条,不同的人交代的还不一样。

## dsh 怎么做

把规矩写进仓库里的 `AGENTS.md`。AI 每进一个 session 会自己读它,相当于每次开工前都递上同一份准则。

这里有三个取舍值得单独说,因为它们不是显而易见的。

### 它是索引,不是教程

每条规则一两行给结论,后面挂一个链接指向详情。看 [dsh 的根 AGENTS.md](../AGENTS.md) 里「Conventions」那节,典型的一条是这样:

> **Registrations are effects**: every contribution goes through `ctx.effect()` / `ctx.on()`; a registry's `register()` returns the disposer.

一句话说清怎么做,不解释背后为什么。想知道为什么,顺着链接去决策记录里看。

**好在哪。** 这个文件每个 session 都要塞进 AI 的上下文。写成教程它就会膨胀到几千词,每次对话都在为这些字付费,而且真正要紧的几条被淹在里面。dsh 干脆给根文件设了约 1600 词的上限,用脚本卡住。

这条上限本身也有一篇决策记录:[doc-tiers-and-budgets](../.agents/notes/implemented/process/2026-07-04-doc-tiers-and-budgets.md)。它规定了超了之后的处理顺序——**先把内容搬到该去的地方,再压缩,最后才考虑抬上限**,而且抬上限要在 PR 里说明理由。

**这条记录的价值在于**:没有它,下一个人碰到门禁报红,最省事的做法就是把上限从 1600 改成 2000,门禁就此失效。有了它,改上限得先驳倒记录在案的顺序。

### 分层

根目录一份通用的,子目录各放一份该目录专属的,AI 在哪个目录干活就叠加哪一层。这个仓库里有六份,可以直接点开看:

| 文件 | 管什么 |
|---|---|
| [AGENTS.md](../AGENTS.md) | 根:项目定位、目录地图、命令表、代码约定 |
| [docs/AGENTS.md](../docs/AGENTS.md) | 文档:分层、一个事实一个家、字数预算 |
| [packages/AGENTS.md](../packages/AGENTS.md) | 包:插件导出形式、服务设计、边界校验 |
| [scripts/AGENTS.md](../scripts/AGENTS.md) | 脚本 |
| [.github/AGENTS.md](../.github/AGENTS.md) | CI 与 PR |
| [.agents/notes/AGENTS.md](../.agents/notes/AGENTS.md) | 决策记录 |

**好在哪。** 拿 [packages/AGENTS.md](../packages/AGENTS.md) 举例,它开头第一条就是:

> **Plugin exports:** service packages default-export their service class; function plugins named-export `name` / `inject` / `Config` / `apply` and have no default export.

这条只在写包的时候有意义,写文档的人不需要知道。如果所有规则都堆在根文件里,根文件会有几百条,而且每个 session 无论干什么都要读全部。分层之后,改文档的 AI 读到的是文档规则,改包的读到的是包规则。

顺带一提,这条规则后面挂的链接指向一篇事故复盘——混用两种导出形式会让 Loader 静默丢弃插件的命名空间。规则是从踩过的坑里长出来的,不是凭空定的。

### 不绑定某一家 AI

`CLAUDE.md` 是个软链接,指向 `AGENTS.md`。Claude Code 读前者,Codex 读后者,物理上是同一个文件。

**好在哪。** dsh 仓库的分支名里能同时看到 `codex/` 和 `worktree/` 前缀——不同厂商的 AI agent 在同一个仓库里干活,读的是同一份规则,不需要维护两份内容再担心它们不一致。

## 搬到自己项目

1. 仓库根建 `AGENTS.md`,`ln -s AGENTS.md CLAUDE.md`。
2. 先只写你最反复交代的那五六条,每条一两行。
3. 给它设一个字数上限,写进 CI(见[第三篇](03-gates.md))。
4. 等某个子目录的特殊规矩攒到三条以上,再给那个目录单开一份。

## 容易做错的地方

**写成教程。** 一膨胀就没人读,包括 AI——它会读,但重点被淹了。判断标准:一条规则超过三行,就该把详情搬走留个链接。

**只写「做什么」不写「哪里能查为什么」。** AI 会照做,但碰到规则没覆盖的情况就只能瞎猜。每条挂一个链接的成本很低。

**规则和现实脱节。** 命令改了、目录挪了,`AGENTS.md` 没跟着改,AI 就会按过时的信息干活,而且它不会怀疑。dsh 的做法是把这类文件纳入同一次改动的检查范围。

---

下一篇:[决策记录](02-agent-notes.md) —— 规则解决「怎么做」,决策记录解决「为什么当初这么定」。
