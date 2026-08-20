# Synchronizing the DeepSeek Harness Documentation Site(中文对照)

> 这是 [SKILL.md](SKILL.md) 的中文对照,供阅读方便。**英文原文是权威版本**,执行规则时以原文为准。

在发布、更新、移动或删除 DeepSeek Harness 文档站点页面时;编辑 website/docs.ts 映射或导航时;诊断 VitePress 站点上缺失的页面时;修复被投影(projection)的文档链接时;或在修改 website 内容之后运行 docs:dev、docs:check 与 doc-sync 工作流时,使用本 skill。

保持仓库 Markdown 作为唯一可编辑的内容源。把站点当作一个经过测试的投影(projection)对待:[website/docs.ts](https://github.com/deepseek-ai/deepseek-harness/blob/master/website/docs.ts)选择公共页面、[scripts/project-doc-site.ts](https://github.com/deepseek-ai/deepseek-harness/blob/master/scripts/project-doc-site.ts)把它们重写进一次性的 `website/.generated/` 树、而 VitePress 构建该树。

仓库翻译遵循兄弟配对契约:英文 `foo.md`、中文 `foo.zh.md` 与 `foo.i18n.yaml` 三者放在一起。绝不要为站点内容创建 `zh-CN/` 或其它的 locale 目录。站点路由树独立于该源码布局:`foo.zh.md` 投影到根路由,而 `foo.md` 投影到匹配的 `/en/` 路由。

## 阅读所属契约

- 阅读 [docs/AGENTS.md](../../../docs/AGENTS.md),并在决定内容归属或修改产品文档 prose 时使用 [dsh-doc-standards](../dsh-doc-standards/SKILL.md)。
- 对于已编辑的双语源文件,遵循 [docs/AGENTS.md](../../../docs/AGENTS.md#writing-rules) 中的轻量例程路径与[配对契约](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/i18n/README.md);绝不自动调用扩展翻译 skill。
- 在修改清单之前,先阅读当前的 `DocsPage` 类型与 [website/docs.ts](https://github.com/deepseek-ai/deepseek-harness/blob/master/website/docs.ts) 中的条目;不要依赖记忆中的字段集合。
- 在添加新的 section、sidebar 集合、locale 或顶级导航项之前,先阅读 [website/.vitepress/config.ts](https://github.com/deepseek-ai/deepseek-harness/blob/master/website/.vitepress/config.ts)。

## 归类改动

- **编辑已发布的页面**:只改其规范 Markdown 源文件。只要其路由或导航元数据不变,就不要碰清单。
- **发布新页面**:把它创建在所属的 `docs/` 层级,然后加一条清单条目。
- **重命名、移动或删除页面**:原子地更新规范文件、清单条目与入库链接。移除过期的清单条目;`docs:check` 会拒绝缺失的源文件。
- **发布生成的目录**:映射生成的 `docs/` 文件,但改其生成器或源元数据,而非手工编辑目录。
- **改动站点结构**:对普通页面更新清单;只有当现有的 sidebar、section 或 locale 模型无法表达该改动时,才更新 VitePress 配置。

绝不编辑或提交 `website/.generated/`、`website/.cache/` 或 `website/.dist/`。除 `website/AGENTS.md` 之外,绝不要在 `website/` 下添加 Markdown;`website/zh-CN/`、`website/en/`、`website/api/` 等 locale 与路由目录是无效的源码布局。把生成的目录保留在 `docs/` 下,在那里做新鲜度门禁(freshness-gate),并通过清单发布它们。

## 添加或更新清单条目

有意识地设置每个 `DocsPage` 字段:

- `source`:仓库相对的规范 Markdown 路径。对于完整的双语对,通过 `pairedPages()` 添加英文 `.md` 路径;它会推出同源 `.zh.md`、内容 locales 与对应别名。
- `route`:公共 VitePress 路径,包含 `.md` 后缀。
- `label`:sidebar 标签,不必是文档 H1。
- `sidebar`:除非信息架构(IA) genuinely 需要另一个集合,否则复用 `zh-guide`、`zh-develop` 或 `en-docs`。
- `section`:尽可能复用已有 section。如果要新增,还要把它放到 VitePress 配置的 `sectionOrder` 里。
- `order`:section 内的稳定顺序。
- `sourceAliases`:可选,其它应在链接被投影时解析到本页的入库路径。它不会创建另一个公共路由。

仅在源文件有意让两个路由树都回退到同一种可用语言时,才使用 `mirroredPages()`。在其对应条目添加时,把该条目转成 `pairedPages()`。让清单保持显式的公共白名单。不要只因 `docs/` 下存在 RFC、postmortem、测试指南、`AGENTS.md` 或维护者工作流,就发布它们;内部资料只有在用户明确扩大站点发布范围时才添加。

## 保留链接行为

在规范 docs 中写普通的仓库相对 Markdown 链接。投影器应用以下规则:

- 清单中存在的目标会变成站点相对路由。
- 清单外既有的目标会变成 GitHub 源码链接,包括支持的 line 后缀。
- 图片是例外:它的文件会被拷进生成的树并从那里引用,因此无论入库可见性如何站点都能提供它。它必须是入库内的一个常规文件。
- 外部 URL、站点绝对 URL、email 链接与纯片段链接保持不变。
- 缺失的仓库相对目标会投影失败,而不是静默产生坏链。
- 跨页片段以英文 GitHub 标题 id 作为其规范 id。如果某个手写标题产生了不同的 VitePress id,就在它紧前面放一个显式的 `<a id="..."></a>`;在所属生成器中添加生成的别名。

不要在规范 Markdown 中写站点专用路由去迎合 VitePress。对目录风格的入库链接(应解析到某映射索引页的),使用 `sourceAliases`。

## 预览与验证

编辑时跑本地预览:

```sh
pnpm docs:dev
```

dev 服务器看守被映射的源文件并重新投影它们。改变清单后若新源没能自动生效,就重启它。

在把映射当成有效之前,跑聚焦的站点门禁:

```sh
pnpm docs:check
```

如果 Markdown 链接检查通过但站点构建报缺失片段,遵循 `verify-doc-site-fragments` 的源路径与目标路径。在手写 Markdown 或所属生成器中用显式别名保留英文 GitHub id。

提交文档站点改动之前,跑:

```sh
pnpm run doc-sync
pnpm run lint
git diff --check
```

推送前使用 [dsh-pre-push-checks](../dsh-pre-push-checks/SKILL.md)。上报被改的规范文件、新增或移除的清单条目、受影响的公共路由,以及实际跑过的检查。

## 部署分开处理

把内容同步进 VitePress 构建并不会把它发布到互联网。不要添加 GitHub Pages 权限、部署工作流、自定义域名或公共托管,除非用户明确要求部署并确认托管策略。
