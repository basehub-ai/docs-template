import { siteUrl } from '@/lib/constants'
import { basehub } from '@/.basehub'
import type { MetadataRoute } from 'next'
import {
  PageFragment,
  ArticleMetaFragmentRecursive,
} from '@/basehub-helpers/fragments'

export const revalidate = 1800 // 30 minutes - adjust as needed

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await basehub().query({
    pages: {
      items: PageFragment,
    },
  })

  let index = 1

  // Generate sitemap entries for [category][[...slug]] routes
  const categoryRoutes: MetadataRoute.Sitemap = []

  function processArticle(
    path: string[],
    article: ArticleMetaFragmentRecursive,
    category: string
  ) {
    const updatedPath = [...path, article._slug]
    if (article.body?.__typename) {
      // has body, therefore is linkable and should be added to sitemap
      const url = `${siteUrl}/${category}/${updatedPath.join('/')}`
      categoryRoutes.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: index++,
      })
    }
    // recursively process children
    if (article.children.items && article.children.items.length > 0) {
      article.children.items.forEach((child: ArticleMetaFragmentRecursive) => {
        processArticle(updatedPath, child, category)
      })
    }
  }

  data.pages.items.forEach(
    (page: {
      _slug: string
      articles: { items: ArticleMetaFragmentRecursive[] }
    }) => {
      // add the category index
      categoryRoutes.push({
        url: `${siteUrl}/${page._slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: index++,
      })

      // process articles recursively
      page.articles.items.forEach((article: ArticleMetaFragmentRecursive) => {
        processArticle([], article, page._slug)
      })
    }
  )

  return categoryRoutes
}
