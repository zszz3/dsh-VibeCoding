# DSH Pre-Push Checks(中文对照)

[English 原文](SKILL.md) | 中文

在推送(包括 force push)、标记 ready for review、或宣称某 deepseek-harness 分支的检查已通过之前,以及在 `gh stack sync` 发布了重写后的各层分支之后立即,使用本 skill,用于为正在 outgoing 的改动或刚发布的改动选出覆盖面最小、能起到证据作用的本地检查集,而不是无脑跑整个仓库。

本 skill 的本地证据只跑一次。唯一的顺序例外是 `gh stack sync`,它可能在重写后的各层被验证之前就先发布一次级联重基(rebase);此时要在发布后立即验证各层,且在所有证据通过之前绝不合并。Git hooks 故意收得很窄:pre-commit 修复 staged 的 lint、检查 staged 的空白、并守护 vendored 源文件的元数据;pre-push 只跑增量仓库级 typecheck。穷尽式覆盖率与平台矩阵归 CI 所有。

## 检查 outgoing 改动

1. 核对 checkout 与分支。

```sh
git status --short --branch
git rev-parse --show-toplevel
```

2. 核验 live 的 PR base 或 stack 父分支,抓取该 ref,并对照它检查完整 scope。

```sh
pnpm --silent run change-scope --base <verified-base-ref>
```

该命令绝不凭空猜测或抓取 base。从当前 remote 或 stack 状态中核验出 ref 再提供给命令;检查非 `HEAD` 的提交时使用 `--head <ref>`。它的带版本 JSON 记录的是相对已解析 merge base 的已提交路径,而 staged、unstaged 与 untracked 路径描述的是当前 worktree。在合并了一个改动过的 base 之后,重跑该报告,重新评估合并后的 scope 能影响哪些行为,并且只重跑被该合并作废的检查。

## 选择相关证据

除了 hooks 之外,不存在通用的本地基线。每一项行为改动都需要能抓到其回归、且尽量窄的测试或专为该用途构建的检查;仅当 diff 确实触及某个面时,才扩大检查范围。

- **包或脚本行为**:跑所属的 Vitest 文件或聚焦的测试名。当共享契约变更时,补上相邻包的测试;把仓库级穷尽覆盖率留给 CI,除非改动确是跨仓的,或用户主动要求。
- **文档、Agent Notes、目录、或文档-linked 注释**:跑 `pnpm run doc-sync`;当文档工作流需要时跑完整 lint。
- **对模型、编辑器、CLI 或终端可见的输出**:跑能归属该输出的、聚焦的 keyless 快照,或真实可运行的示例场景。
- **包清单、公共导出、构建配置、worker/bin 入口、或构建后的运行时路径**:跑 `pnpm run build`、相关 hygiene 检查、以及所属构建产物冒烟。
- **真实的 provider 或 agent 行为**:有凭证时跑对应的 `pnpm run test:e2e` 目标;绝不打印 secrets。

不要只因 commit 或 push 接踵而至,就手动重跑一遍已通过的检查。特别地,不要为了在推送前复跑 pre-push hook 而就在紧贴推送前跑 typecheck。

### 把单元覆盖率聚焦到受影响的源码

测试选择与覆盖率选择是两回事。Vitest 文件过滤决定跑哪些测试,而仓库配置除此之外还测量 `packages/*/*/src/**/*.ts` 下的每个文件。当单元覆盖率相关时,要同时点名所属测试,以及这些测试必须证明覆盖率的源文件或包:

```sh
pnpm exec vitest run packages/<group>/<package>/tests/<behavior>.spec.ts \
  --coverage \
  --coverage.include='packages/<group>/<package>/src/**/*.ts'
```

当行为真正 confined 在一个模块时,使用精确的源文件。对多个受影响的文件或包,重复 `--coverage.include`,并传入所有需要的所属测试文件以覆盖该 scope。在选定的源 scope 内部,既定的每文件 100% 阈值仍然适用。

当所属测试不明确时,用 Vitest 的依赖图找出候选集,然后在把该运行当作证据之前,先审阅选定的测试:

```sh
pnpm exec vitest related packages/<group>/<package>/src/<changed>.ts \
  --run \
  --coverage \
  --coverage.include='packages/<group>/<package>/src/<changed>.ts'
```

`vitest related` 无法发现仅通过配置、动态加载、子进程、worker、构建产物或外部 provider 才达到的行为;要显式选择那些所属测试。不要为了掩盖某个未覆盖的受影响文件,就使用 `--passWithNoTests`、降低覆盖率阈值、或缩窄 `--coverage.include`。如果某个选定的包 scope 因某一个聚焦测试未覆盖它而失败,那就补上其它相关所属测试,或仅在受影响模块不可能被该改动影响时,才缩窄源 scope。

## 完整本地排练

仅在用户明确要求时、在诊断 CI 失败时、或改动波及仓库如此之广以至于任何更窄的集合都不可信时,才运行完整的本地近似。把当前工作流与包脚本当作清单;不要重建已移除的 `check:pre-push` 聚合。

## 守护会重写历史的 push

rebase 对独立 PR 分支与 stacked PR 分支都允许,包括复审之后。在对一次独立历史重写之前,抓取当前 remote 分支并记录其精确 OID;用 `--force-with-lease=<branch>:<observed-oid>` 发布,这样并发更新会中止该 push。`gh stack push` 与 `gh stack sync` 为它们管理的分支提供租约保护。永远不允许使用原生 `--force`。

在任何重写后的 push 之后,重新抓取当前 heads 并重新审计未解决的复审评论线、审批、可合并性与检查。重写之前的提交哈希与内联评论锚点不再是当前证据。

### Post-sync 验证

`gh stack sync` 把抓取、级联重基与 push 合并成一次操作,因此它无法在重写与发布之间插入本地验证。运行它之前,要求 worktree 干净,并记录官方 stack 顺序与精确的 remote heads。它返回之后:

1. 重新查询每个分支 head 与官方 GitHub stack 顺序。
2. 对照其当前 PR base 检查每个重写层的改动 scope。
3. 为每个受影响的层运行本 skill 选出的相关证据。
4. 在所有选中检查通过之前,让每个 PR 保持未合并,并把验证上报为待处理。

如果 post-sync 证据失败,让带租约保护的已发布 heads 保留在原地,修复该失败,验证修复,再发布修正。不要只因 sync 命令成功就宣称 stack 已就绪。

## 处理失败

如果某项相关检查在一次普通 push 之前失败,停下并修复或解释该阻塞。不要 push 并且指望 CI 会不同。对于 post-sync 例外,阻断合并并遵循上述修复流程。

如果失败看起来是环境特有的,证实它:

- 记录精确的命令、失败的测试、与平台特有的不匹配。
- 确认相关的非平台证据。
- 当检查是必需时,优先修复跨平台不确定性。
- 仅在用户明确要求或同意时才绕过本地 hook,并准确上报失败内容与 CI 预期为何不同。

## Push 流程

对于普通 push 与独立 rebase push:

1. 跑一次选定的相关检查。
2. 正常 commit,并在继续之前审阅 pre-commit 自动修复后改动的任何文件。
3. 正常 push,或对授权过的重写分支使用精确的租约,让增量 typecheck hook 运行。
4. 核验 remote ref 与本地 `HEAD` 一致。

```sh
git rev-parse HEAD origin/$(git branch --show-current)
```

对于 GitHub PR,在 push 之后检查 remote CI:

```sh
gh pr checks
```

pending 的检查就上报为 pending。在把失败归因于分支或环境之前,先审阅失败。

对于 `gh stack sync`,使用 post-sync 验证序列,而不要假装普通顺序曾经可行过。
