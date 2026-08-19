# dsh-VibeCoding

一套「**人 + AI 协同开发**」的工程流程库,从开源项目 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)(MIT)提炼与移植而来。

它回答一个问题:**当 AI 每天产出的代码量远超人能逐行审阅时,怎么让它既高速、又可控?**

核心主张:

> 不要假设 AI 可靠。把它当成一个「**会忘、会滥产、会自欺**」的高速贡献者,针对这三个现实各建一套工程机制去兜底。

**本仓库自己就按它所教的方式组织** —— 常驻规则在根 [AGENTS.md](AGENTS.md)、skills 在 `.agents/skills/`、决策记录在 `.agents/notes/`。一个教人怎么做的库,如果自己不这么做,就没有说服力([这个决定的记录](.agents/notes/implemented/architecture/2026-08-19-mirror-upstream-layout.md))。

## 为什么是这三个现实

不是「AI 不够聪明」——能力会随模型升级自己变好。这三个是**架构级**的,换更强的模型也不会消失:

| 现实 | 表现 | 兜它的机制 |
|---|---|---|
| **会忘** | 每个 session 都是白纸,上周的约定、上个月的决策都不记得 | ① 常驻规则 ② 决策记忆 |
| **会滥产** | 一晚上产出你三天看不完的 diff,人肉把关必然崩 | ③ 机器门禁 |
| **会自欺** | 编造事实、把推理过程当结论写、自我美化「我测过了」 | ④ 坏习惯规范 ⑤ 判断固化 |
| (协作放大) | 多个 AI 并行会互相踩踏;人审成为瓶颈 | ⑥ 隔离并行 + AI 互审 |

## 六个机制

| # | 机制 | 一句话 | 看哪里 |
|---|---|---|---|
| ① | **常驻规则** | 每个 session 都自动读到的规则索引,只放结论 + 链接 | [AGENTS.md](AGENTS.md)(本库现行)· [templates/AGENTS.md](templates/AGENTS.md)(给你抄的骨架) |
| ② | **决策记忆** | 每个非平凡改动配一篇决策记录,**必写「否掉了什么」** | [.agents/notes/README.md](.agents/notes/README.md) |
| ③ | **机器门禁** | 规则焊成脚本,三道关卡逐级变严,检查取代信任 | [docs/gates.md](docs/gates.md) |
| ④ | **坏习惯规范** | 治「思维链泄漏」「自我报告」「含糊措辞」 | [dsh-trim-cot-leakage](.agents/skills/dsh-trim-cot-leakage/SKILL.md) |
| ⑤ | **判断固化** | 把「AI 容易做错且不易发现」的判断写成可自动触发的 skill | [.agents/skills/README.md](.agents/skills/README.md) |
| ⑥ | **隔离并行 + 互审** | worktree 隔离、stacked PR、AI 审 AI 且不许表演性同意 | [dsh-code-review](.agents/skills/dsh-code-review/SKILL.md) |

完整剖析见 **[docs/methodology.md](docs/methodology.md)**。

## 怎么用

**不必一次上全套。** 六步采用路线在 [docs/adoption-roadmap.md](docs/adoption-roadmap.md),每步都能独立见效:

1. 立 `AGENTS.md`(抄 [templates/AGENTS.md](templates/AGENTS.md))—— 当天见效
2. 加决策记录规矩(抄 [templates/agent-note-implemented.md](templates/agent-note-implemented.md))
3. 焊两三道门禁(照 [docs/gates.md](docs/gates.md) 的清单)
4. 列 AI 坏习惯清单,先进 `AGENTS.md`
5. 把高频活做成 skill(抄 [templates/SKILL.md](templates/SKILL.md),参考 [.agents/skills/](.agents/skills/README.md))
6. 多 AI 隔离并行 + 互审

前三步是地基,后三步靠它撑 —— 顺序不是随意排的,理由在采用路线里。

## 布局

```
AGENTS.md              本库现行规则(CLAUDE.md 软链到它)—— 同时是活范例
.agents/
  skills/              11 个可复用工作流 †,README.md 是索引与可迁移度评估
  notes/               决策记录制度 † + 本库自己的决策记录
docs/
  methodology.md       方法论全景:三个现实 → 六个机制(先读这篇)
  adoption-roadmap.md  六步采用路线,每步的产出、验收与依赖关系
  gates.md             机器门禁:三道关卡、清单、怎么验证它真的挡得住
  doc-standards.md     文档标准:分层、一个事实一个家、字数预算 †
  testing-policy.md    测试策略:验证世界而非自我报告、真实入口 †
  defensive-patterns.md  生命周期 / 并发 / 子进程 / teardown 的缺陷模式 †
  package-conventions.md 模块与包的编写约定 †
templates/             可直接抄走的骨架:AGENTS.md / 决策记录 / SKILL.md
scripts/check-links.py 唯一的门禁:本地链接校验,死链必须为 0
```

† = 从 DeepSeek Harness 原文移植,保留英文原貌(它们是实际在用的工作文档);本库新写的导读与方法论层为中文。

**两份 `AGENTS.md` 的分工:** 根目录那份是本库**现行生效**的规则,也是一份活范例;`templates/` 那份是给采用者**填空的空壳**。

## 来源与授权

内容源自 [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness),MIT 授权。移植时保留原文规则,仅修正跨仓库链接:与上游同名同位的原样保留,本库改名过的指向本库,上游专有的(具体决策记录、双语机制、内部脚本)指向上游 GitHub,读者仍可点进去看原始理由。

详见 [ATTRIBUTION.md](ATTRIBUTION.md) 与 [LICENSE](LICENSE)。
