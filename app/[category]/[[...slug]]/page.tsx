import { Article } from '@/app/_components/article'
import {
  ArticleMetaFragmentRecursive,
  PageFragment,
  pageBySlug,
} from '@/basehub-helpers/fragments'
import { Pump } from '@/.basehub/react-pump'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getActiveSidebarItem } from '@/basehub-helpers/sidebar'
import { basehub } from '@/.basehub'
import { draftMode } from 'next/headers'

export const generateStaticParams = async (): Promise<
  Array<{ params: { slug: string[] } }>
> => {
  const data = await basehub({ cache: 'no-store' }).query({
    pages: { items: PageFragment },
  })
  const result: Array<{ params: { slug: string[] } }> = []

  /**
   * Recursive function to process every level of nesting
   */
  function processArticle(
    path: string[],
    article: ArticleMetaFragmentRecursive
  ) {
    const updatedPath = [...path, article._slug]
    if (article.body?.__typename) {
      // has body, therefore is linkable and should be added to result
      result.push({ params: { slug: updatedPath } })
    }
    // recursively process children
    if (article.children.items && article.children.items.length > 0) {
      article.children.items.forEach((child) => {
        processArticle(updatedPath, child)
      })
    }
  }

  data.pages.items.map((page) => {
    page.articles.items.forEach((article) => {
      processArticle([page._slug], article)
    })
  })

  return result
}

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string[] | undefined }
}): Promise<Metadata> => {
  const activePageSlug = params.slug?.[0]
  const data = await basehub().query({ pages: pageBySlug(activePageSlug) })

  const page = data.pages.items[0]
  if (!page) return {}

  const activeSidebarItem = getActiveSidebarItem({
    sidebar: page.articles,
    activeSlugs: params.slug?.slice(1) ?? [],
  })
  if (!activeSidebarItem) return notFound()

  return {
    title: activeSidebarItem._title,
  }
}

export default function ArticlePage({
  params,
}: {
  params: { slug: string[] | undefined; category: string }
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

        const activeSidebarItem = getActiveSidebarItem({
          sidebar: page.articles,
          activeSlugs,
        })

        if (!activeSidebarItem) notFound()

        return <Article id={activeSidebarItem._id} />
      }}
    </Pump>
  )
}
