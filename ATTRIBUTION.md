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
| `.agents/notes/**/*.md` | 132 篇真实的决策记录,选取范围见下 |
| `.agents/skills/*` | 11 个 skill,含 `references/` 与 `scripts/` |
| `docs/testing.md`、`docs/defensive-patterns.md`、`docs/development.md` | 测试策略、缺陷模式、贡献流程 |

保留原路径有两个作用:这个布局本身就是「分层就近」的样子;dsh 原文里的相对链接大部分能直接生效,不用改写,改得越少出错的机会越少。

## 决策记录为什么是 132 篇,不是 693 篇

上游有 693 篇。全部搬过来会塞进大量 dsh 产品内部的内容——Cordis 插件树、会话日志格式、TypeScript 构建配置,对外部读者用处不大。这里按三条规则选:

1. **`process` 和 `testing` 两类全收。** 这两类讲的是怎么工作:流程、工具、政策、测试策略,跟具体产品无关。包含 `implemented`、`proposed`、`rejected`、`archived` 全部四种生命周期。
2. **本仓库其他文件引用到的都收。** 这样规则文件里的引用不会落空。
3. **README 举的例子都收。**

其余按类别归属留在上游,`README.md` 与各文件里的链接会指过去。上游的中文对照页(`.zh.md`)与配对边车(`.i18n.yaml`)没有收录,那套机制依赖上游的 Git 合并驱动和门禁脚本。

## 唯一改动过的地方:跨仓库链接

- 这里收录了的目标,链接保持原样(379 条本地链接)。
- 没收录的目标,改成指向上游 GitHub 的绝对链接(407 条),点进去能看到原始内容,不会碰到断链。

行内代码里形如 `` `[English](foo.md)` `` 的示例不是链接,没动过。

## 本仓库自己写的

两份:`README.md`(教学文章)和 `ATTRIBUTION.md`(本文件)。

## 这些文件描述的是 dsh,不是本仓库

`AGENTS.md` 里的命令(`pnpm install`、`pnpm run test:coverage`)、目录(`packages/`、`vendor/`)、技术选择(Cordis、ESM、Typert)说的都是 dsh 那个仓库。它们是参考实现,不是本仓库的可执行指令。抄到自己项目时要换成自己的事实,顺序见 `README.md` 第七节。

## 哪些做法不容易搬

`README.md` 第五节的表格逐个标了 skill 的迁移难度:

- **直接可用**(换掉命令就行):`dsh-trim-cot-leakage`、`dsh-prose-standard`、`dsh-code-review`、`dsh-find-simplifications`、`dsh-merging-stacked-prs`、`record-browser-gif`
- **要换命令或目录**:`dsh-archive-agent-notes`、`dsh-pre-push-checks`、`dsh-doc-standards`
- **仅作参考**:`dsh-translate-docs`、`dsh-doc-site-sync`,它们强依赖 dsh 的双语配对机制和 VitePress 结构
