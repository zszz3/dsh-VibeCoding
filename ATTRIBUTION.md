# 来源与授权

## 上游

这里的文件都来自 **DeepSeek Harness**:

- 仓库:https://github.com/deepseek-ai/deepseek-harness
- 授权:MIT License(Copyright (c) 2026 DeepSeek),见 [LICENSE](LICENSE)

MIT 允许再分发和改编,要求保留版权与许可声明,本仓库的 `LICENSE` 保留了上游原文。

## 收录了什么

都是 dsh 原文,放在原本的路径上,内容没改。

| 路径 | 内容 |
|---|---|
| `AGENTS.md` | 根常驻规则 |
| `docs/AGENTS.md`、`packages/AGENTS.md`、`scripts/AGENTS.md`、`.github/AGENTS.md` | 各子树的常驻规则 |
| `.agents/notes/AGENTS.md`、`README.md`、`implemented/AGENTS.md`、`archived/AGENTS.md` | 决策记录制度 |
| `.agents/notes/**/*.md` | 204 篇真实的决策记录,选取范围见下 |
| `.agents/skills/*` | 11 个 skill,含 `references/` 与 `scripts/` |
| `docs/testing.md`、`docs/defensive-patterns.md`、`docs/development.md` | 测试策略、缺陷模式、贡献流程 |

保留原路径有两个作用:这个布局本身就是「分层就近」的样子;dsh 原文里的相对链接大部分能直接生效,不用改写,改得越少出错的机会越少。

## 决策记录为什么是 204 篇,不是 693 篇

上游有 693 篇。全收会塞进大量 dsh 产品内部的内容——Cordis 插件树、会话日志格式、TypeScript 构建配置,对外部读者用处不大。这里按四条规则选,六个类别、四种生命周期都覆盖到:

1. **`process` 和 `testing` 两类全收。** 这两类讲的是怎么工作:流程、工具、政策、测试策略,跟具体产品无关。
2. **`proposed` 和 `rejected` 全收。** 数量不多,但能看到提案态和被否态的写法,以及被否的理由怎么记。
3. **`feature`、`bug-fix`、`simplification`、`architecture` 四类**,各从 `implemented` 里按文件日期均匀取十几篇,覆盖早期到近期。
4. **本仓库其他文件引用到的、以及 README 举例的,全部补齐**,这样引用不会落空。

没收的留在上游,`README.md` 与各文件里的链接会指过去。上游的中文对照页(`.zh.md`)与配对边车(`.i18n.yaml`)没有收录,那套机制依赖上游的 Git 合并驱动和门禁脚本。

## 改动过的地方

原件的正文一字未改,只动了两处:

**一、跨仓库链接。** 这里收录了的目标,链接保持原样(647 条本地链接);没收录的目标,改成指向上游 GitHub 的绝对链接,点进去能看到原始内容,不会碰到断链。行内代码里形如 `` `[English](foo.md)` `` 的示例不是链接,没动过。

**二、语言切换行。** 有中文对照的文件,在 H1 下面加了一行 `English | [中文](…)`;对照页那侧对称地写 `[English 原文](…) | 中文`。这是上游自己的写法(`.agents/notes/README.md` 就是这样),目的是两边都能一眼看到另一版在哪。

## 本仓库自己写的

- `README.md` —— 教学入口
- `guide/01` 到 `guide/07` —— 七篇教程
- `ATTRIBUTION.md` —— 本文件
- `site/` —— 文档网站(Astro Starlight),内容由 `site/scripts/project.mjs` 从仓库真实路径投影而来
- `.github/workflows/pages.yml` —— 网站部署

## 中文对照(本仓库新增的翻译)

上游给 693 篇 Agent Note 和 18 篇 docs 都做了 `.zh.md` 中文对照,但**六份 `AGENTS.md` 与 11 个 skill 是英文独有的**(它们是 agent 指令,不在上游的双语范围内)。

本仓库为这 20 份补了中文对照,文件名沿用上游的 `.zh.md` 约定,与英文原文同目录:

| 英文原文 | 中文对照 |
|---|---|
| `AGENTS.md`、`docs/AGENTS.md`、`packages/AGENTS.md`、`scripts/AGENTS.md`、`.github/AGENTS.md`、`.agents/notes/AGENTS.md` | 各自的 `AGENTS.zh.md` |
| `.agents/skills/*/SKILL.md`(11 个) | 各自的 `SKILL.zh.md` |
| `dsh-trim-cot-leakage/references/{examples,recall-batteries}.md`、`dsh-prose-standard/references/examples.md` | 各自的 `.zh.md` |

翻译遵循的规则:

- **英文原文是权威版本**,执行规则时以原文为准。这一点只在这里说明,不在每篇译文开头重复。
- 术语按上游[术语表](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/i18n/terminology.md):`agent`、`skill`、`seam`、`Agent Note`、`worktree`、`waterfall` 等保留英文;`plugin`→插件、`session`→会话、`capability`→能力、`prompt`→提示词、`tool`→工具、`snapshot`→快照。
- 结构逐节对应,代码/命令/路径/标识符原样保留。
- 链接指向对照版(如果目标有对照版),这样中文读者点进去不会突然跳回英文;每页顶部都能切回原文。
- 保住模态词(must→必须、never→绝不),不把「必须」弱化成「应该」。
- 译文不带 YAML frontmatter,以免被误当成可加载的 skill;原文 frontmatter 里的 `description` 在正文开头交代。
- 译文开头只留语言切换行。个别文件多一句提示,是因为那份文件本身有特殊处理(比如 `dsh-trim-cot-leakage/references/examples.zh.md` 里作为「病例标本」的英文句子一律不译)。

## 这些文件描述的是 dsh,不是本仓库

`AGENTS.md` 里的命令(`pnpm install`、`pnpm run test:coverage`)、目录(`packages/`、`vendor/`)、技术选择(Cordis、ESM、Typert)说的都是 dsh 那个仓库。它们是参考实现,不是本仓库的可执行指令。抄到自己项目时要换成自己的事实,顺序见 `README.md` 第七节。

## 哪些做法不容易搬

`README.md` 第五节的表格逐个标了 skill 的迁移难度:

- **直接可用**(换掉命令就行):`dsh-trim-cot-leakage`、`dsh-prose-standard`、`dsh-code-review`、`dsh-find-simplifications`、`dsh-merging-stacked-prs`、`record-browser-gif`
- **要换命令或目录**:`dsh-archive-agent-notes`、`dsh-pre-push-checks`、`dsh-doc-standards`
- **仅作参考**:`dsh-translate-docs`、`dsh-doc-site-sync`,它们强依赖 dsh 的双语配对机制和 VitePress 结构
