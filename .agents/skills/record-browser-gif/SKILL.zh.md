# Record Browser GIF(中文对照)

[English 原文](SKILL.md) | 中文

> 这是英文原文的中文对照,供阅读方便。**英文原文是权威版本**,执行规则时以原文为准。

该 skill 的 frontmatter(name:`record-browser-gif`;description:使用可用的内置浏览器、基于状态的帧捕获与确定性编码,把浏览器或 Web UI 交互演示录制成经过优化的 GIF;当任务包含把 GIF 挂到某个 PR 时,再发布到专用 assets 分支)定义了它的触发场景:当接到制作、录制或生成 GIF 来演示浏览器工作流时,以及在任何更改产品用户可见 GUI 行为、因此必须附上一段从该 PR 真实 server 与 model 流程录制的 GIF 的 PR 上使用。

生成一段简短、真实(truthful)的 UI 演示作为本地 GIF,并且——只有在任务包含把 GIF 挂到某个 PR 上时——在本 skill 末尾通过 assets-branch 工作流发布它。录屏交互使用 browser-control skill;可重复的时序、尺寸与体积由自带编码器负责。

[evidence-chain 决策](../../notes/implemented/process/2026-08-08-browser-gif-evidence-chain.md) 说明了为什么一个 storyboard 对应一次隔离的运行,以及为什么发布时需要重新验证该 artifact 与被演示 PR 的 head。

## 每个 GUI PR 都要带一段 GIF

任何更改产品用户可见 GUI 行为的 PR,都必须用本 skill 录制一段演示 GIF,并通过 [assets-branch 工作流](#publish-to-an-assets-branch) 嵌入到 PR 正文里。

录制本身就是证据的一部分:使用从该 PR 分支树真实启动的 server、真实的 API key 与真实的 model 轮次。绝不可以用 fixture 查询、mock 传输、合成事件注入或仅测试可用的 hook 来替代,除非用户明确要求录制一段 fixture。在嵌入内容旁边,注明被演示的精确 commit SHA、提供该次录制的 tree 与 origin、任何模式标志或浏览器状态例外,以及是否跑了真实的 model 轮次,这样审查者才能准确知道这段录制证明了什么。

## 录屏与发布分离

- 录屏只产出帧图片和一段本地 `.gif` artifact;绝不修改远程状态。
- 发布——把 GIF 推到 assets 分支并嵌入 PR 正文——是单独的最终步骤,只有在任务包含把 GIF 挂到 PR 上时才执行。绝不改动 PR 自己的分支。
- 保留请求的录屏条件。真实 server 或真实 API 的演示绝不使用 fixture 查询、mock 传输、合成事件注入或仅测试可用的 hook。如果凭证或 server 不可用,就如实报告这一限制,而不要用 fixture 顶替。
- 绝不读取或泄露凭证值。使用应用的正常配置路径与一个无害的演示 prompt。

## 部署应用

针对特定 PR 的 GIF 演示的是该 PR 的 tree,因此按 PR 分别部署:

1. 要求 worktree 干净,用 `git rev-parse HEAD` 记录其精确 commit,然后构建这份被记录的 tree——此处为 `pnpm run build && pnpm run build:web`。对着另一个 commit 构建录制的 GIF 会错误地归因证据。
2. 从该 tree 为每个端口各启动一个 server,使用全新的 `DSH_HOME`、`DSH_AGENTS_HOME`、workspace 与会话状态。也给浏览器一个全新的隔离上下文或 profile;如果浏览器工作流无法创建,则在该 origin 跳转到页面之前清空它的 cookie 与站点存储,这样持久化的客户端状态才不会影响证据。通过应用正常配置路径加载根目录 `.env` 中的 API key;绝不回显该 key。
3. 把一个 storyboard 视为一次证据运行:所有发布的帧都来自该 server 以及那些状态根、workspace、会话与由 model 驱动的场景运行。如果截屏自动化失败,丢弃它的帧并从全新的根重新运行;绝不把多次运行的帧拼到一起。
4. 在 PR 之间切换时,通过 PID 或对命令行做精确匹配来停掉旧 server。宽泛的 `pkill -f` 模式会匹配并杀掉启动它的 shell——包括你自己。

## 录制流程

1. 调用可用的 browser-control skill,遵循它的 setup、interaction 与 cleanup 指令。只有在被要求或必需时才使用用户现有的 Chrome 状态;在 provenance 里注明该例外,且不要声称是全新的客户端状态。如果浏览器控制不可用,则在隔离的无头浏览器里使用仓库声明的 Playwright 依赖;不要安装别的驱动或启动用户的浏览器。在 provenance 里注明该降级方案。
2. 录制前,确认精确的 origin、应用是已构建还是开发中、传输方式,以及任何 fixture 或 mock 模式。只记录观察到的配置所能支撑的论断。
3. 当生产环境默认会打开无头自动化无法驱动的原生操作系统界面时,通过应用正常配置选择一个浏览器可操作的官方生产后端。在 provenance 里注明该覆盖;fixture、mock 传输或仅测试可用的 hook 都不是可接受的替代。
4. 挑出三到六个能讲清一个故事的状态,例如 typed、running、settled、detail。优先选语义上的状态变化,而非连续录制;省略对观看没帮助的加载抖动。
5. 每个帧保持同一个视口与裁剪,并按词汇命名帧:`00-initial.png`、`01-typed.png`,依此类推。
6. 把帧存到仓库被 gitignore 的 `.playwright-mcp/` 目录下——浏览器工具的截屏只能写入工具允许的根目录,相对文件名相对仓库根目录解析。先创建帧子目录(`mkdir -p .playwright-mcp/gif-frames-<label>`);在缺失目录里写入会在截屏时以 ENOENT 失败。
7. 每次截屏前,等待一个具体的 UI 条件,例如唯一标签、已启用的控件、变化的文档标题或已完成的响应。要求定位符精确解析到一个元素;对 Playwright 的 accessible-name 定位符,当本意是相等时使用 `exact: true`,因为后裔文本或 prompt 回显可能造成错误匹配。不要用固定延迟来证明应用已到达该状态。
8. 完成断言要匹配精确文本元素——例如某个修剪后文本等于预期回复的元素——绝不使用子串检查,如 `body.textContent.includes(...)`,用户自己的 prompt 回显也能满足它。
9. 当论断涉及工具调用、拒绝或恢复时,包含能显示工具身份、状态或稳定错误码,以及下游结果的详情帧或轨迹帧。纯聊天结果无法证明工具路径为何那样表现。
10. 通过驱动一个缓慢的前台操作——例如 `sleep 15` bash 命令——来捕获瞬时状态(旋转指示器、运行中行),并在单次浏览器脚本调用里轮询一个具体 DOM 标记(`data-*` 属性)的同时完成截屏。跨多次工具调用轮询的状态会丢失,因为回合(turn)在调用之间会稳定下来。
11. 设计 prompt,让你需要的状态真的发生:指示 model 在本来会后台运行慢命令时在前台等待,并给它一个完成哨兵,例如"reply with the single word done",来锚定完成断言。
12. 不捕获任何 secrets、个人数据、无关标签页或瞬时通知。在演示状态可见后尽早停掉任何不必要的漫长真实 API 运行。

使用浏览器自带的截屏 API。当它返回图片字节时,直接保存这些字节;编码器独立于文件名后缀检测图片内容。

## 编码 GIF

要求有 `python3`、`ffmpeg`、`ffprobe`。若任一媒体二进制缺失,如实报告该依赖,而不要在未经授权时安装软件。

在 python 命令之前单独一行导出本 skill 的绝对目录 `GIF_SKILL_DIR`——内联的 `GIF_SKILL_DIR=... python3 "$GIF_SKILL_DIR/..."` 赋值会失败,因为参数在赋值生效前就展开了:

```sh
export GIF_SKILL_DIR=/absolute/path/to/this/skill
python3 "$GIF_SKILL_DIR/scripts/encode_gif.py" \
  /absolute/path/to/frames \
  /absolute/path/to/demo.gif \
  --durations 1.5,1.5,1.5,3.5 \
  --fps 10 \
  --max-width 1200 \
  --colors 128
```

一个时长应用到所有帧;否则按帧提供一个逗号分隔的正数时长,让最终的稳定状态保持最久。编码器拒绝少于两帧、尺寸或时长不匹配、限制无效、意外覆盖、意外时长,以及超过 `--max-bytes` 的输出。

对于较大的 artifact,先减小 `--max-width`,再调 `--colors` 或 `--fps`;保留可读文本,并把最终状态保持足够久以便查看。仅在解析出精确输出路径后才使用 `--force`。

## 验证 artifact

1. 读取编码器的 JSON 摘要,确认输出路径、源帧与编码帧数量、尺寸、时长与字节体积。
2. 亲自查看编码后的 GIF 本身,而不只是源帧。确认过渡可读、最后状态保持足够久,且没有敏感内容出现。如果查看器只渲染首帧,用 `ffmpeg` 从编码后的 GIF 解码出代表帧并检查它们;编码前的截屏证明不了编码后的顺序、调色板与最终保持时长。
3. 运行 `git status --short`,确认帧与 artifact 只落在被忽略的路径下。
4. 返回 GIF 的绝对路径,在客户端支持本地媒体时渲染它,并说明录制使用的是真实 API、fixture 还是其他传输。当任务不包含把 GIF 挂到 PR 上时,到此为止。

## 发布到 assets 分支

本步骤只有在任务包含把 GIF 挂到 PR 上时才执行。

绝不把 GIF 提交到 PR 自己的分支或任何合并进长生命周期分支的分支:二进制媒体提交到那里会让仓库历史膨胀,拖慢每个未来的 clone 操作。GIF 存放在专用的孤立(orphan)assets 分支——一个没有父提交、只有媒体内容的分支——上,且一个 assets 分支为整个 PR 系列服务(命名为 `<series>-assets`;用 `git ls-remote --heads origin '*assets*'` 列出已有的)。

下面任一个工作流推送前,先验证 assets 分支只包含媒体,且待推送 GIF 的校验和与已验证的本地 artifact 一致。

对于已存在的 assets 分支,在浅层单分支 scratch clone 里操作,这样发布不会碰到你的工作树:

```sh
git clone --branch <assets-branch> --single-branch --depth 1 <repo-url> /tmp/assets-checkout
cp /absolute/path/to/demo.gif /tmp/assets-checkout/<name>.gif
cd /tmp/assets-checkout
git add <name>.gif
git commit -m "assets: <what it shows> gif (#<pr>)"
git push origin <assets-branch>
```

对于一个新系列,新建一个浅层 scratch clone(`git clone --depth 1 <repo-url> /tmp/assets-checkout`),用 `git switch --orphan <assets-branch>` 创建 orphan 分支,然后按同样方式添加 GIF、提交并推送。

推送后,用已认证的 GitHub API 或原始请求确认远程路径、字节体积、校验和、`200` 响应与 `image/gif` content type。匿名 `404` 不能推翻私有仓库的 asset;改用已认证验证。这证明的是仓库成员审查路径,而非公开可用性。

编辑 PR 正文前,立即重读其 live head,并与 GIF 旁记录的 commit 比较。一旦移动就停下并重新录制。编辑后,重读 live head,并要求它仍停留在该记录 commit。另外,通过 GitHub 的 Markdown API 渲染正文,确认预期的 `<img>` 存在。

用原始 blob URL 把 GIF 嵌入 PR 正文;必须带 `?raw=true` 后缀,因为 plain blob URL 渲染的是 GitHub 的文件页而非图片:

```markdown
![<alt text>](https://github.com/<owner>/<repo>/blob/<assets-branch>/<name>.gif?raw=true)
```

绝不删除或重写 assets 分支,也绝不强推它:合并后的 PR 正文会永远引用它的 URL。只追加新提交。
