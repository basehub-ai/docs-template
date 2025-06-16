import { ArticleMetaFragmentRecursive } from '@/basehub-helpers/fragments'
import { basehub } from 'basehub'
import { originPlusBasePath } from '../_origin'
import { getArticleSlugFromSlugPath } from '@/basehub-helpers/util'

export const GET = async () => {
  const data = await basehub().query({
    settings: { metadata: { sitename: true } },
    pages: {
      items: {
        _title: true,
        _slug: true,
        openApiSpec: { url: true },
        articles: { items: ArticleMetaFragmentRecursive },
      },
    },
  })

  function processArticleRecursive(
    article: ArticleMetaFragmentRecursive,
    headingLevel = 3,
    isInFirstCategory = false
  ): string {
    if (article.children.items.length) {
      const children = article.children.items
        .map((child) =>
          processArticleRecursive(child, headingLevel + 1, isInFirstCategory)
        )
        .join('\n')
      return `
${Array.from({ length: headingLevel })
  .map((_) => '#')
  .join('')} ${article._title}

${children}
`
    }

    return `- [${article._title}](${originPlusBasePath}${getArticleSlugFromSlugPath(article._slugPath, isInFirstCategory)})${article.excerpt ? `: ${article.excerpt}` : ''}`
  }

  return new Response(
    `# ${data.settings.metadata.sitename}

${data.pages.items
  .map((page, i) => {
    return `## ${page._title}${page.openApiSpec?.url ? `\n\nOpenAPI Spec: ${page.openApiSpec.url}` : ''}

${page.articles.items
  .map((article) => {
    return processArticleRecursive(article, 3, i === 0)
  })
  .join('\n')}
`
  })
  .join('\n')}

`,
    { status: 200 }
  )
}
