# AGENTS.md

本仓库是一套「**人 + AI 协同开发**」的工程流程库,内容从 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)(MIT)移植与提炼而来。读者面向想把这套做法搬到自己团队的人。

**本仓库自己就按它所教的方式组织** —— 常驻规则在根目录、skills 在 `.agents/skills/`、决策记录在 `.agents/notes/`。这不是巧合,是刻意的:一个教人怎么做的库,如果自己不这么做,就没有说服力。方法论全文见 [docs/methodology.md](docs/methodology.md)。

## 布局

```
AGENTS.md            本文件 —— 常驻规则(CLAUDE.md 软链到它)
.agents/
  skills/            11 个可复用工作流(上游原文移植)
  notes/             决策记录:制度规则 + 本库自己的决策
docs/                方法论、采用路线、门禁指南 + 4 份上游规范原文
templates/           可直接抄走的骨架:AGENTS.md / 决策记录 / SKILL.md
```

## 命令

本仓库只有 Markdown,没有构建。唯一的门禁是链接校验:

```sh
python3 scripts/check-links.py    # 校验所有本地相对链接可解析;死链必须为 0
```

## 移植纪律

改动 `.agents/skills/` 或 `docs/` 里的**上游原文移植内容**时:

- **保留判定与护栏,不要只留步骤。** 移植时最容易犯的错是把「什么*不算*」的护栏当啰嗦删掉 —— 那恰好是最值钱的部分,它拦住的是「热心 AI 一删到底」。
- **规则文字不改写。** 唯一允许的改动是跨仓库链接修正。要补充解释,写在 `docs/` 的中文导读层,别改原文。
- **链接三条规则:** 位置与上游一致的目标 → 原样保留;本库改名过的 → 指向本库新路径;上游专有的(具体决策记录、双语配对机制、内部脚本)→ 指向上游 GitHub 绝对链接,让读者仍能读到原始理由。**不要简单删掉链接。**
- **行内代码里的示例链接不是链接。** 形如 `` `[English](foo.md)` `` 是在演示字面写法,校验脚本会跳过行内代码与代码块;不要为了让检查变绿而改动它。
- 每个 skill 的可迁移度在 [.agents/skills/README.md](.agents/skills/README.md) 标注;新增或改动 skill 时同步更新那张表。

## 写作纪律

- **文档只写当前状态。** 不写「以前 / 现在 / 不再」这类变更叙述,不写 `(decision N)` 这类只有当时对话才懂的引用。判定:一个只看当前内容、拿不到任何对话记录的读者,能否解析每个引用、验证每个论断?详见 [.agents/skills/dsh-trim-cot-leakage](.agents/skills/dsh-trim-cot-leakage/SKILL.md)。
- **改之前先枚举命题。** 每条命题(谁做什么、条件时序、must/may/never、负向保证、所有权与后果)都要留住才算改好;**字数变少本身不是改进**。详见 [.agents/skills/dsh-prose-standard](.agents/skills/dsh-prose-standard/SKILL.md)。
- **措辞具体。** 少用「某种机制」「这一层」这类空词,点名具体的文件、检查、操作。
- 中文导读层用中文;上游移植内容保留英文原貌(它们是实际在用的工作文档,改写会损失精确性)。

## 决策记录

**每个非平凡改动(结构调整、移植范围变化、门禁增减)在同一次提交里配一篇决策记录**,放 `.agents/notes/{proposed,implemented,rejected}/<类别>/`,骨架见 [templates/agent-note-implemented.md](templates/agent-note-implemented.md)。

`## Alternatives considered` 必填 —— 只记结论、不记「否掉了什么」的决策会招致反复争论。制度全文见 [.agents/notes/README.md](.agents/notes/README.md)。

纯排版、修错别字、补链接这类机械改动豁免。

## 提交

- 提交信息用中文,首行 `<type>: <做了什么>`(`feat` / `fix` / `docs` / `refactor`)。
- 推送前跑链接校验,**死链为 0 才推**;只报告实际跑过的检查。
- 本仓库的 git 身份已配置为 zszz3;别用兜底身份提交,否则 GitHub 不会归属到账号。

## 收到审查意见时

逐条核实,在技术层面修复或反驳,**不要表演性同意**。审查标准见 [.agents/skills/dsh-code-review](.agents/skills/dsh-code-review/SKILL.md)。
