# Landing an official GitHub PR stack(中文对照)

[English 原文](SKILL.md) | 中文

本 skill 触发场景:着一栈相互依赖的 GitHub PR(A ← B ← C,每个都基于它下面那个之上)上 master,合并一个 base 是另一个开放 PR 分支的 PR,或任何请求里提到 "stacked PRs"(栈式 PR)、"PR stack"、dependent PRs(相互依赖的 PR),或依次合并若干相关 PR 时。要求:上 master 前,仓库内每一组相互依赖链都必须用 GitHub 官方的 stacked-PR(栈式 PR)特性,让 GitHub 掌管全栈规则、CI、顺序、retarget(重定目标)与合并状态。

## Require native stack support(要求原生栈支持)

改变 GitHub 状态前先跑 `gh stack --version`。官方扩展或服务端栈特性不可用时硬停(直接停止),绝不回退到手写 `gh pr merge` 加 `gh pr edit` 一个一个地合并与 retarget。GitHub 栈要求每个 head 分支都落在同一个仓库里,因此跨 fork 链硬停。

用一个干净的专用 worktree。取回当前 PR 元数据与精确的 head OID,别信分支名或更早的报告:

```sh
gh pr view <pr> --json number,author,baseRefName,baseRefOid,headRefName,headRefOid,isCrossRepository,state,isDraft,reviewDecision,mergeStateStatus,statusCheckRollup
```

对每一团疑似链,至少取一个 PR 查 `PullRequest.stack` 与 `stackEntry.position`;这个官方 GitHub 对象,而不是单靠 base 分支推断,才是栈成员资格的唯一判据。`size` 超过单页返回时翻页 `entries`:

```sh
gh api graphql -F owner=<owner> -F name=<repo> -F number=<pr> -f query='
query($owner: String!, $name: String!, $number: Int!) {
  repository(owner: $owner, name: $name) {
    pullRequest(number: $number) {
      number
      author { login }
      baseRefName
      headRefName
      stackEntry { position }
      stack {
        number
        baseRefName
        size
        entries(first: 100) {
          nodes {
            position
            pullRequest { number author { login } baseRefName headRefName state isDraft }
          }
        }
      }
    }
  }
}'
```

按活的 PR base 确定自底向上的预期顺序:最底 target trunk(主干),往上的每个 PR target 它紧挨着下面那个的 head 分支。

## Link missing stack members(补连缺失的栈成员)

先把任何现存的栈条目与预期链对比。一个现存的栈可能只含预期链的保序子集;多个栈编号、意外条目、或冲突顺序,在动手改之前需要用户方向。

当任何相互依赖的 PR 还不在那个官方栈里时:

1. 逐个精确比对每个 `author.login`。
2. 若所有 author 一致,按自底向上顺序自动连链:

```sh
gh stack link --base <trunk> <bottom-pr> <next-pr> ... <top-pr>
```

3. 若 author 不同,或某个 author 不可用,在改 GitHub 状态前先问用户要不要连。
4. 重查 GraphQL,并要求:一个栈编号、预期的 trunk、完整的 PR 集合、预期的 position 与 base 链。

绝不自动拆解、重排或重建现存栈;`gh stack link` 是增量的,已合并或已排队的条目无法被 unstack。

## Refresh only when needed(只在需要时刷新)

别因为存在刷新机制就重写分支。当活的合并状态或仓库规则要求更新过的 trunk 时,任选下面允许的某段 history:

- **原生级联 rebase**:用 `gh stack checkout <pr-or-stack>` 切出远程栈(本地没跟踪时),再 `gh stack sync`。该命令在本地校验前可能 rebase 并对每一活跃层做租约保护的强推(force-push)。立刻检查被重写的作用域,对每一受影响层跑相关检查,过之前不合并、不宣称就绪。若 sync 检出 rebase 冲突,用 `gh stack rebase`、解决并校验它,再用 `gh stack push` 发布。若 checkout 或 sync 报本地与远程栈组成 diverges(发散),取消并问用户,不要自动删除或重建远程栈。
- **增量 merge-forward**:把 trunk merge 进最底受影响分支,再按自底向上把每个更新后的 parent 传播给它的 child,正常 push。若 merge 进行中 base 又往前走了,按[增量 retarget 注](../../notes/implemented/process/2026-07-26-incremental-pr-base-retargeting.md)所述,在合并那个更新后的 tip 前保住这个 checkpoint。

任何 history 重写在 review 之后都允许,但它会让 commit-OID 假设失效。push 之后重取精确 heads,并重审未决 review 线程、approvals、可合并性与检查。绝不裸用 `--force`,也不覆盖一个正 concurrent 前进的远程 head。

## Preflight the merge range(合并范围预检)

合并前立刻重查官方栈。要求每个被选 PR 都开放、非 draft、顺序正确、符合仓库的 review 与检查要求。各 PR 状态独立看待;最顶一层 ready 证明不了它的依赖也 ready。

"Land the stack"(落栈)选中整栈。部分落栈要求一个显式的边界 PR,并包含从最底到该边界的每一层。

## Merge through the stack API(走栈 API 合并)

按官方栈编号合并整栈:

```sh
gh stack merge <stack-number> --yes --merge
```

对于明确请求的部分落栈,走边界 PR 合并:

```sh
gh stack merge <boundary-pr> --yes --merge
```

不要传 `--delete-branch`、不要手 retarget 依赖方、也不要发逐 PR 合并命令。GitHub 自底向上合并选中范围,并对任何剩下的上层 retarget/rebase。栈合并是一整个或全不;当 trunk 用 merge queue,顺序入队的选中范围会被排成一组,但可能分若干组落地。

不要绕过合并要求。若原生合并报 blocker,通过所属 PR 检查并解决该 blocker,或停下汇报;绝不回退到 `gh pr merge`。

## Verify the landed state(校验落地后的状态)

等每个被选 PR 都报 `MERGED`;排队请求不等于落地完成:

```sh
gh pr view <pr> --json number,state,mergedAt,mergeCommit,baseRefName,headRefName
```

部分落栈时,重查官方栈,并校验每个剩下的 PR 仍按预期顺序连着、且 target 该栈 trunk 或它下面那层。重查当前 heads、review 状态与 CI,因为 GitHub 可能已 rebase 剩下的层。

分支删除只在对应 PR 报 `MERGED` 后的单独最后一步做。删每个分支前,要求 GitHub 报没有仍拿它当 base 的开放 PR:

```sh
gh pr list --state open --base <branch> --json number --jq length
```

任何非 `0` 都阻塞删除。

## Checklist(检查清单)

- [ ] 原生 `gh stack` 可用;每个 PR 分支在同一仓库。
- [ ] 活的 PR base 与精确 heads 确定一条自底向上的依赖链。
- [ ] GraphQL 报一个官方栈,含预期 trunk、entries 与顺序;符合条件且同 author 的未连成链的自动联过。
- [ ] 任何被重写层过了相关校验,且 review 线程、approvals、可合并性与检查事后重审过。
- [ ] 整栈,或显式有界前缀,经 `gh stack merge --yes --merge` 提交。
- [ ] 每个被选 PR 报 `MERGED`;任何剩下上层仍构成预期官方栈。
- [ ] 分支删除只在 merged 状态与零依赖校验之后做。
