import { ArticleMetaFragmentRecursive } from '@/basehub-helpers/fragments'
import { basehub } from 'basehub'
import { originPlusBasePath } from '../_origin'

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
    headingLevel = 3
  ): string {
    if (article.children.items.length) {
      const children = article.children.items
        .map((child) => processArticleRecursive(child, headingLevel + 1))
        .join('\n')
      return `
${Array.from({ length: headingLevel })
  .map((_) => '#')
  .join('')} ${article._title}

${children}
`
    }

    return `- [${article._title}](${originPlusBasePath}/${article._slug})${article.excerpt ? `: ${article.excerpt}` : ''}`
  }

  return new Response(
    `# ${data.settings.metadata.sitename}

${data.pages.items
  .map((page) => {
    return `## ${page._title}${page.openApiSpec?.url ? `\n\nOpenAPI Spec: ${page.openApiSpec.url}` : ''}

${page.articles.items
  .map((article) => {
    return processArticleRecursive(article, 3)
  })
  .join('\n')}
`
  })
  .join('\n')}

`,
    { status: 200 }
  )
}
