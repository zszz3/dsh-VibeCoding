// @ts-check
import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'

/**
 * 让 Markdown 正文里的链接在新标签打开,同页锚点除外。
 *
 * 只作用于 Markdown 渲染出的内容;侧边栏、目录、面包屑由 Starlight 组件生成,
 * 不经过这里,所以站内导航仍然原地跳转——否则读一篇教程会攒出一堆标签页。
 */
function openContentLinksInNewTab() {
  return (tree) => {
    const walk = (node) => {
      if (node.type === 'element' && node.tagName === 'a') {
        const href = node.properties?.href
        if (typeof href === 'string' && !href.startsWith('#')) {
          node.properties.target = '_blank'
          node.properties.rel = 'noopener noreferrer'
        }
      }
      for (const child of node.children ?? []) walk(child)
    }
    walk(tree)
  }
}

export default defineConfig({
  site: 'https://zszz3.github.io',
  base: '/dsh-VibeCoding',
  markdown: {
    rehypePlugins: [openContentLinksInNewTab],
  },
  integrations: [
    starlight({
      title: 'dsh-VibeCoding',
      description:
        'DeepSeek Harness 跟 AI 协同开发用的那套文件,加一份讲它们怎么用的教程。',
      defaultLocale: 'root',
      locales: { root: { label: '简体中文', lang: 'zh-CN' } },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/zszz3/dsh-VibeCoding' },
      ],
      // 不开「编辑此页」:站点内容是 scripts/project.mjs 投影出来的,那些路径不在
      // 版本库里,链过去只会 404;真正该编辑的是仓库里的原文。
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
      sidebar: [
        { label: '教程', autogenerate: { directory: 'guide' } },
        {
          // 侧边栏只列中文对照;英文原文仍然有独立页面,从每页顶部的链接进入
          label: '常驻规则(六层)',
          items: [
            { label: '根:AGENTS.md', link: '/rules/root-zh/' },
            { label: 'docs/ 文档规则', link: '/rules/docs-zh/' },
            { label: 'packages/ 包规则', link: '/rules/packages-zh/' },
            { label: 'scripts/ 脚本规则', link: '/rules/scripts-zh/' },
            { label: '.github/ CI 与 PR', link: '/rules/github-zh/' },
            { label: '.agents/notes/ 记录规则', link: '/rules/notes-zh/' },
          ],
        },
        { label: 'Skills', autogenerate: { directory: 'skills', collapsed: true } },
        { label: '规范文档', autogenerate: { directory: 'specs' } },
        { label: '决策记录', autogenerate: { directory: 'notes', collapsed: true } },
        { label: '来源与授权', link: '/attribution/' },
      ],
      customCss: ['./src/styles/custom.css'],
      head: [
        // Mermaid:投影时把 ```mermaid 转成 <div class="mermaid">,这里在浏览器端渲染
        {
          tag: 'script',
          attrs: { type: 'module' },
          content: `
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs'
const isDark = () => document.documentElement.dataset.theme === 'dark'
const render = async () => {
  const nodes = document.querySelectorAll('.mermaid:not([data-processed])')
  if (!nodes.length) return
  mermaid.initialize({ startOnLoad: false, theme: isDark() ? 'dark' : 'neutral' })
  try { await mermaid.run({ nodes }) } catch (e) { console.warn('mermaid', e) }
}
document.addEventListener('DOMContentLoaded', render)
document.addEventListener('astro:page-load', render)
`,
        },
      ],
    }),
  ],
})
