# Agent Note: 本库按它所教的布局组织自身

Status: implemented

## Problem

移植初版把常驻规则放在 `templates/AGENTS.md`,把 skills 放在 `skills/`、决策记录制度放在 `agent-notes/`。这带来三个具体故障:

**一、指向「真实规则」的链接落到了占位符上。** 上游 `dsh-code-review` 里写「standing repository rules」、`implemented/AGENTS.md` 里写「the root instructions」、`docs/testing.md` 里写「Commands live in root AGENTS.md」——这些链接被重映射到 `templates/AGENTS.md`,而那是一份全是 `<占位符>` 的空骨架。AI 加载审查 skill 时,拿不到任何可执行标准。

**二、库自身不遵守它教的做法。** 库通篇要求「仓库根目录放 `AGENTS.md`,软链 `CLAUDE.md`」,而它自己根目录没有。用 AI 改这个库时,AI 读不到任何规则。

**三、平白增加了链接改写量。** 上游 skills 之间、skills 到 `.agents/notes/` 的相对链接,在原布局下全部失效,需要逐条重映射;每一次重映射都是一次可能引入错误的机会,初版就因此误伤过 `dsh-translate-docs` 里的示例文件名。

## Decision

仓库镜像上游的功能性布局:

- `AGENTS.md` 在根目录,`CLAUDE.md` 软链到它。内容是**本库自己现行生效的规则**(移植纪律、写作纪律、决策记录要求、提交要求),不是空骨架。
- `.agents/skills/` 放 11 个 skill,`.agents/notes/` 放决策记录制度与本库自己的决策记录 —— 与上游同名同位。
- `docs/` 放中文导读层(方法论、采用路线、门禁指南)与四份上游规范原文,后者用描述性文件名(`doc-standards.md`、`testing-policy.md`、`package-conventions.md`)因为本库没有对应的 `packages/` 子树。
- `templates/` 保留可抄走的骨架,含 `templates/AGENTS.md`。它与根 `AGENTS.md` 分工明确:根文件是本库现行规则、也是活范例;模板是给采用者填空的空壳。

链接按三条规则处理:与上游同名同位的目标**原样保留**(46 处),本库改名过的指向本库(22 处),上游专有的指向上游 GitHub 绝对链接(99 处)。

链接校验脚本跳过行内代码与代码块,因为形如 `` `[English](foo.md)` `` 是在演示字面写法,不是可解析的链接。

## Alternatives considered

**保留 `templates/AGENTS.md` 作为唯一的 AGENTS.md,并在归属说明里注明它兼作约定参考。** 成本最低,但三个故障一个都没修:审查 skill 仍然指向占位符,库仍然不遵守自己教的做法。把已知缺陷写进说明文档不等于修复它。

**只在根目录补一份 `AGENTS.md`,skills 与决策记录仍留在 `skills/`、`agent-notes/`。** 修掉了「自己不遵守」和「链接指向占位符」,但保留了大量本可避免的相对链接重映射,而每次重映射都可能误伤。既然要动,不如让布局一次对齐。

**根目录放上游那份真实的 `AGENTS.md`,不写本库自己的。** 上游那份讲的是 Cordis 插件树、包布局、`pnpm` 命令,对本库全是错的事实。常驻规则必须描述**当前仓库**,否则会主动误导 AI。

**把上游四份规范也按原名放在原位(`docs/AGENTS.md`、`packages/AGENTS.md`)。** 完全镜像可以让链接零改写,但本库没有 `packages/` 子树,放一份管理不存在目录的子树规则是虚假事实;而 `docs/AGENTS.md` 与本库 `docs/` 的真实内容(中文导读层)也不匹配。这两处的准确性优先于链接便利。

## Consequences

- 打开本库的 AI 会自动读到根 `AGENTS.md`,拿到移植纪律与写作纪律;审查 skill 的「standing rules」链接现在指向真实规则。
- 46 处上游链接不再需要改写,减少了误伤面;初版误伤的示例文件名问题不再复现,因为校验脚本按语法跳过行内代码。
- 代价:仓库里存在两份 `AGENTS.md`(根目录的现行规则、`templates/` 的空骨架)。两者用途不同且互相说明,但读者第一次浏览时需要一句话区分 —— 由 README 与本记录承担。
- 代价:`.agents/` 是点目录,在 GitHub 网页上默认不显眼,skills 的可发现性依赖 README 与 `.agents/skills/README.md` 的导航。这是为「skills 必须放在功能位置才能被 AI 加载」付出的代价。
