import { Article } from '@/app/_components/article'
import {
  ArticleMetaFragmentRecursive,
  PageFragment,
  pageBySlug,
} from '@/basehub-helpers/fragments'
import { Pump } from '@/.basehub/react-pump'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getActiveSidebarItem, getBreadcrumb } from '@/basehub-helpers/sidebar'
import { basehub } from '@/.basehub'
import { draftMode } from 'next/headers'

export const dynamic = 'force-static'

export const generateStaticParams = async (): Promise<
  Array<{ category: string; slug: string[] }>
> => {
  const data = await basehub({ cache: 'no-store' }).query({
    pages: { items: PageFragment },
  })
  const result: Array<{ category: string; slug: string[] }> = []

  /**
   * Recursive function to process every level of nesting
   */
  function processArticle(
    path: string[],
    article: ArticleMetaFragmentRecursive,
    category: string
  ) {
    const updatedPath = [...path, article._slug]
    if (article.body?.__typename) {
      // has body, therefore is linkable and should be added to result
      result.push({ category, slug: updatedPath })
    }
    // recursively process children
    if (article.children.items && article.children.items.length > 0) {
      article.children.items.forEach((child) => {
        processArticle(updatedPath, child, category)
      })
    }
  }

  data.pages.items.map((page) => {
    page.articles.items.forEach((article) => {
      processArticle([], article, page._slug)
    })
  })

  return result
}

export const generateMetadata = async ({
  params,
}: {
  params: { category: string; slug: string[] | undefined }
}): Promise<Metadata> => {
  const data = await basehub({
    next: { revalidate: 30 },
    draft: draftMode().isEnabled,
  }).query({ pages: pageBySlug(params.category) })

  const page = data.pages.items[0]
  if (!page) return {}

  const { item: activeSidebarItem } = getActiveSidebarItem({
    sidebar: page.articles,
    activeSlugs: params.slug ?? [],
  })
  if (!activeSidebarItem) return notFound()

  return { title: activeSidebarItem._title }
}

export default function ArticlePage({
  params,
}: {
  params: { category: string; slug: string[] | undefined }
}) {
  const activeSlugs = params.slug ?? []

  return (
    <Pump
      queries={[{ pages: pageBySlug(params.category) }]}
      next={{ revalidate: 30 }}
      draft={draftMode().isEnabled}
    >
      {async ([data]) => {
        'use server'

        const page = data.pages.items[0]
        if (!page) notFound()

        const { item: activeSidebarItem } = getActiveSidebarItem({
          sidebar: page.articles,
          activeSlugs,
        })

        if (!activeSidebarItem) notFound()
        const { titles, slugs } = getBreadcrumb({
          sidebar: page.articles,
          activeSidebarItem,
        })

        const breadcrumb = [
          {
            title: page._title,
            slug: page._slug,
          },
          ...titles.map((item, index) => ({
            title: item,
            slug: slugs[index] ?? '#',
          })),
          {
            title: activeSidebarItem._title,
            slug: activeSidebarItem._slug,
          },
        ]

        return <Article id={activeSidebarItem._id} breadcrumb={breadcrumb} />
      }}
    </Pump>
  )
}
