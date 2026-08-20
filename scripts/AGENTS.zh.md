# AGENTS.md — Repository scripts(中文对照)

[English 原文](AGENTS.md) | 中文

门禁脚本调用 pnpm 时不经过 shell,在读入时把仓库相对的 glob 路径统一成 `/`,并且把平台适配留在需要它的那个门禁里,而不是抽出一个共用的平台层。
