# Skills:可复用的判断,不只是步骤

这里 11 个 skill 从 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 原文移植(仅修正跨仓库链接)。

**先理解它们为什么值钱。** skill 的价值**不在「记录了步骤」**——步骤谁都会写。它值钱在:**每个 skill 都焊死了一条「AI 很容易做错、而且做错了当时不易发现」的判断**。否则这条判断每换一个 AI、每个 session 都要重教一遍,而且会飘。

共性公式:**一句可执行的判定 + 一张防过度的护栏**。护栏那半往往比判定更能体现功力——它拦住的正是「热心 AI 一删到底」。

## 索引

| Skill | 干什么 | 固化的那条「不显然判断」 | 可迁移度 |
|---|---|---|---|
| [dsh-trim-cot-leakage](dsh-trim-cot-leakage/SKILL.md) | 清理「思维链泄漏」 | 「只看 HEAD、拿不到会话记录的读者,能解析每个引用、验证每个论断吗?」不能就重写。**外加九条「什么不算泄漏」的保留规则** | ⭐ 高 |
| [dsh-prose-standard](dsh-prose-standard/SKILL.md) | 写 / 审 / 精简一切 prose | 「先枚举命题,再动笔」:每条命题(actor / 条件时序 / must-may-never / 负向保证 / 所有权后果)都要留住;**字数变少本身不是改进** | ⭐ 高 |
| [dsh-code-review](dsh-code-review/SKILL.md) | AI 审 AI | 「指南不是清单;一条有据的 blocker 胜过一堆 nits」+ 收到审查**逐条技术核实、可反驳,不许表演性同意** | ⭐ 高 |
| [dsh-find-simplifications](dsh-find-simplifications/SKILL.md) | 找可删 / 可合并的复杂度 | 「强候选 vs 水候选」:先把消费者分成生产 / 非生产 / 模糊三类看真实调用点;**双适配器、双后端是有意为之,别当低垂果实删** | ⭐ 高 |
| [dsh-merging-stacked-prs](dsh-merging-stacked-prs/SKILL.md) | 合并依赖成栈的多个 PR | 「让 GitHub 拥有栈语义」:必须用官方栈命令,绝不手工逐个 merge + retarget 模拟;没官方支持就**硬停** | ⭐ 高 |
| [record-browser-gif](record-browser-gif/SKILL.md) | 录 GUI 演示 GIF 附到 PR | GUI 改动必须附**从真实服务与模型流录制**的 GIF,不能用示意图糊过去 | ⭐ 高 |
| [dsh-archive-agent-notes](dsh-archive-agent-notes/SKILL.md) | 决策记录的归档 / 保留判断 | 按「未来决策价值」而非字数、年龄、配额来决定归档;**提案永不归档**(过时就否决);归档后**永久冻结** | 🔸 中 |
| [dsh-pre-push-checks](dsh-pre-push-checks/SKILL.md) | 推送前选最小检查集 | 选**恰好覆盖本次改动**的检查,不无脑跑全套;**只报告实际跑过的命令** | 🔸 中 |
| [dsh-doc-standards](dsh-doc-standards/SKILL.md) | 文档放哪、写多深 | 「一个事实一个家」+ 分层字数预算;红了先**搬走**、再**压缩**、最后才**抬上限** | 🔸 中 |
| [dsh-translate-docs](dsh-translate-docs/SKILL.md) | 双语文档同步 | 双语对**没有永久主语言**,任一侧都可为本次改动的作者侧;最小化改动对照页并重录配对 | ⚪ 低 |
| [dsh-doc-site-sync](dsh-doc-site-sync/SKILL.md) | 文档站点投影同步 | 站点是仓库文档的**投影**,不是第二份真相;页面缺失先查映射表 | ⚪ 低 |

**可迁移度说明:**

- ⭐ **高** —— 判断本身与技术栈无关,直接可用。只需把里面的项目专有命令替换成你们的。
- 🔸 **中** —— 判断可用,但需要替换成你们自己的门禁命令、文档分层或目录结构。
- ⚪ **低** —— 强依赖上游的双语配对机制 / VitePress 站点结构。当作**模式参考**读,不建议直接套用。

## 建议的阅读顺序

1. **[dsh-prose-standard](dsh-prose-standard/SKILL.md)** —— 其他几个 skill 都引用它的「完整命题」规则,先读它。
2. **[dsh-trim-cot-leakage](dsh-trim-cot-leakage/SKILL.md)** —— 最能体现「判定 + 护栏」范式;它的 [references/examples.md](dsh-trim-cot-leakage/references/examples.md) 有大量正反例校准。
3. **[dsh-code-review](dsh-code-review/SKILL.md)** —— 想让 AI 互审,先读它的六条硬性 blocking 项。
4. 其余按需。

## 怎么改造成你们自己的

1. **替换命令.** 搜 `pnpm run`,换成你们的门禁命令。
2. **替换路径引用.** 本库内的链接已经修好;若你把 skill 复制到别的仓库,再对一遍相对路径。
3. **保留判定与护栏,别删.** 移植时最容易犯的错是「只抄步骤、把护栏当啰嗦删掉」——那恰好丢掉了最值钱的部分。
4. **加你们自己的.** 先问:**我们团队有哪条判断,是 AI 反复做错、且做错了当时看不出来的?** 骨架:[templates/SKILL.md](../templates/SKILL.md)。

## 目录约定

```
skills/<name>/
  SKILL.md              主文件。frontmatter 的 description 用 "Use when …" 写清触发场景
  references/*.md       校准用的正反例、检索模式等(按需)
  scripts/*             skill 用到的脚本(按需)
  agents/openai.yaml    某些 AI 平台的展示元数据(可选,可删)
```

`SKILL.md` 的 frontmatter 决定了 AI 能否**自己判断何时加载**它——`description` 写得含糊,skill 就形同虚设。
