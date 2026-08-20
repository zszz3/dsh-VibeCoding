# AGENTS.md — Repository scripts

English | [中文](AGENTS.zh.md)

Gate scripts invoke pnpm shell-free, normalize repository-relative glob paths to `/` at ingestion, and keep platform adaptation in the gate that needs it instead of a shared platform layer.
