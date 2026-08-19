import { defineCollection } from 'astro:content'
import { docsLoader } from '@astrojs/starlight/loaders'
import { docsSchema } from '@astrojs/starlight/schema'

// astro 5.18 的 glob loader 生成的 id 带 .md 后缀,而 Starlight 按不带扩展名的
// slug 匹配路由,导致所有页面都取不到。这里显式剥掉扩展名。
const stripExtension = ({ entry }) => entry.replace(/\.(md|mdx|markdown)$/, '')

export const collections = {
  docs: defineCollection({
    loader: docsLoader({ generateId: stripExtension }),
    schema: docsSchema(),
  }),
}
