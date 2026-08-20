# AGENTS.md — GitHub Actions(中文对照)

[English 原文](AGENTS.md) | 中文

任务在 Windows runner(`windows-*` 标签)上以原生 `pwsh` 运行。pull request 的 `windows` 任务是刻意的例外:它在托管的 Linux 上用 Wine 跑 Windows Node,并且阻塞 `all checks passed`;`windows-native` 会在 `windows-2025` 上自动运行(在 `DSH_CI_FAILOVER_WINDOWS=selfhosted` 下则用自托管的 `[self-hosted, dsh-win-ci, windows]` 池),但独立汇报结果。master 上的 `serial-windows` 常备任务持续验证自托管的故障转移目标 —— 见[故障转移操作手册](../.agents/notes/implemented/process/2026-07-26-ci-failover-runbook.md)。
