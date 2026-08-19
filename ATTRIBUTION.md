# 来源与改编说明

## 上游

本库的规范文档与 skills 移植自开源项目 **DeepSeek Harness**:

- 仓库:https://github.com/deepseek-ai/deepseek-harness
- 授权:MIT License(Copyright (c) 2026 DeepSeek),见 [LICENSE](LICENSE)

MIT 允许再分发与改编,要求保留版权与许可声明——本库的 `LICENSE` 保留了上游原文。

## 哪些是原文移植

以下文件是上游内容,保留英文原貌(它们是实际在用的工作文档,改写会损失精确性):

| 本库路径 | 上游路径 |
|---|---|
| `docs/doc-standards.md` | `docs/AGENTS.md` |
| `docs/testing-policy.md` | `docs/testing.md` |
| `docs/defensive-patterns.md` | `docs/defensive-patterns.md` |
| `docs/package-conventions.md` | `packages/AGENTS.md` |
| `agent-notes/README.md` | `.agents/notes/README.md` |
| `agent-notes/implemented-notes-rules.md` | `.agents/notes/implemented/AGENTS.md` |
| `skills/*` | `.agents/skills/*` |

**唯一的改动是链接修正**,规则文字未改:

- 能对应到本库的目标 → 改为本库相对路径(82 处)
- dsh 专有的目标(具体决策记录、归档记录、双语配对机制、内部脚本、website 配置)→ 改为上游 GitHub 绝对链接(95 处),读者仍可点进去读原始理由

## 哪些是本库新写

以下为本库新增的中文导读层,用于让方法论可被其他团队直接采用:

- `README.md`
- `docs/methodology.md` — 方法论全景剖析
- `docs/adoption-roadmap.md` — 采用路线
- `docs/gates.md` — 门禁实践指南
- `templates/*` — 可直接抄的骨架
- `skills/README.md` — skill 索引与可迁移度评估

## 移植时保留了什么、丢掉了什么

**保留:** 每条规则的完整表述、判定标准、反例清单、工作流步骤。上游 `dsh-prose-standard` 本身要求「保住完整命题」,移植时按同一标准执行。

**丢掉:**

- 上游的双语对照页(`.zh.md`)与配对边车(`.i18n.yaml`)—— 那套机制依赖上游的合并驱动和门禁脚本
- 依赖上游具体代码结构的部分(Cordis 插件树、包布局、`verify-*` 脚本实现)—— 本库只移植其**做法**,不移植实现
- 上游具体的决策记录(696 篇)—— 它们是 dsh 自己的历史,本库只移植**制度**;需要范例时点上游链接

## 有哪些 skill 不完全可迁移

`skills/README.md` 逐个标注了可迁移度。简要说:

- **高**:`dsh-trim-cot-leakage`、`dsh-prose-standard`、`dsh-code-review`、`dsh-find-simplifications`、`dsh-merging-stacked-prs`、`record-browser-gif`
- **中**:`dsh-archive-agent-notes`、`dsh-pre-push-checks`、`dsh-doc-standards`(需替换成你自己的门禁命令与文档分层)
- **低**:`dsh-translate-docs`、`dsh-doc-site-sync`(强依赖上游的双语配对机制与 VitePress 站点结构,仅作模式参考)
