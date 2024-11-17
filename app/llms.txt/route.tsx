import { ArticleMetaFragmentRecursive } from '@/basehub-helpers/fragments'
import { basehub } from 'basehub'

const origin =
  process.env.NODE_ENV === 'production'
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000'

export const GET = async () => {
  const data = await basehub().query({
    settings: { metadata: { sitename: true } },
    pages: {
      items: {
        _title: true,
        _slug: true,
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

    return `- [${article._title}](${origin}/${article._slug})${article.excerpt ? `: ${article.excerpt}` : ''}`
  }

  return new Response(
    `# ${data.settings.metadata.sitename}

${data.pages.items
  .map((page) => {
    return `## ${page._title}

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
