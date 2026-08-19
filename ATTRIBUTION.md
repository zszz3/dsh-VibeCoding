# 来源与授权

## 上游

本仓库的所有工件来自开源项目 **DeepSeek Harness**:

- 仓库:https://github.com/deepseek-ai/deepseek-harness
- 授权:MIT License(Copyright (c) 2026 DeepSeek),见 [LICENSE](LICENSE)

MIT 允许再分发与改编,要求保留版权与许可声明 —— 本仓库的 `LICENSE` 保留了上游原文。

## 哪些是原样移植

**全部工件都是 dsh 原文,放在它们原本的路径上,规则文字一字未改:**

| 路径 | 内容 |
|---|---|
| `AGENTS.md` | 根常驻规则 |
| `docs/AGENTS.md` · `packages/AGENTS.md` · `scripts/AGENTS.md` · `.github/AGENTS.md` | 各子树常驻规则 |
| `.agents/notes/AGENTS.md` · `README.md` · `implemented/AGENTS.md` · `archived/AGENTS.md` | 决策记录制度 |
| `.agents/skills/*`(11 个) | 可复用工作流,含 `references/` 与 `scripts/` |
| `docs/testing.md` · `docs/defensive-patterns.md` · `docs/development.md` | 测试策略、缺陷模式、贡献流程 |

保留原路径有两个作用:一是它本身就展示了「分层就近」的常驻规则布局;二是 dsh 原文里的相对链接**大部分直接生效**,不需要改写——改写越少,误伤越少。

## 唯一的改动:跨仓库链接

- **本仓库已收录的目标 → 原样保留**(120 处)。
- **未收录的目标 → 指向上游 GitHub 绝对链接**(112 处,涉及 77 个上游文件):具体决策记录、架构与子系统文档、生成的目录、内部脚本、website 配置、双语配对机制等。读者仍可点进去读原始内容,而不是碰到断链。

行内代码里形如 `` `[English](foo.md)` `` 的示例**不算链接**,未做改动。

## 哪些是本仓库新写

只有两份:

- `README.md` —— 教学文章,讲清这些工件背后的方法论与采用路线
- `ATTRIBUTION.md` —— 本文件

## 重要提醒:工件描述的是 dsh,不是本仓库

`AGENTS.md` 等文件里的命令(`pnpm install`、`pnpm run test:coverage`)、目录(`packages/`、`vendor/`)、技术选择(Cordis 插件树、ESM、Typert)描述的是 **dsh 那个仓库**。

它们是**参考实现**,不是本仓库的可执行指令。照抄到你自己项目时,要把这些替换成你的项目事实——`README.md` 的第八节给出了替换顺序。

## 哪些做法不完全可迁移

`README.md` 第六节的表格逐个标注了 skill 的迁移度。简要说:

- **⭐ 直接可用**(判断与技术栈无关,替换命令即可):`dsh-trim-cot-leakage`、`dsh-prose-standard`、`dsh-code-review`、`dsh-find-simplifications`、`dsh-merging-stacked-prs`、`record-browser-gif`
- **🔸 需替换**(门禁命令、文档分层、目录结构):`dsh-archive-agent-notes`、`dsh-pre-push-checks`、`dsh-doc-standards`
- **⚪ 仅作参考**(强依赖 dsh 的双语配对机制与 VitePress 站点结构):`dsh-translate-docs`、`dsh-doc-site-sync`

此外,上游的双语对照页(`.zh.md`)与配对边车(`.i18n.yaml`)未收录——那套机制依赖上游的 Git 合并驱动与门禁脚本;上游 696 篇具体决策记录也未收录,它们是 dsh 自己的历史,本仓库只呈现**制度**,需要范例时点 `README.md` 里的上游链接。
