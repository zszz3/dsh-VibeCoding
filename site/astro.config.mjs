// @ts-check
import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'

export default defineConfig({
  site: 'https://zszz3.github.io',
  base: '/dsh-VibeCoding',
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
      editLink: {
        baseUrl: 'https://github.com/zszz3/dsh-VibeCoding/edit/main/',
      },
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
      sidebar: [
        { label: '教程', autogenerate: { directory: 'guide' } },
        {
          label: '常驻规则(六层)',
          items: [
            { label: '根:AGENTS.md', link: '/rules/root/' },
            { label: 'docs/ 文档规则', link: '/rules/docs/' },
            { label: 'packages/ 包规则', link: '/rules/packages/' },
            { label: 'scripts/ 脚本规则', link: '/rules/scripts/' },
            { label: '.github/ CI 与 PR', link: '/rules/github/' },
            { label: '.agents/notes/ 记录规则', link: '/rules/notes/' },
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
