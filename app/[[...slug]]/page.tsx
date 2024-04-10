import { Article } from '@/app/_components/article'
import {
  ArticleMetaFragment,
  ArticleMetaFragmentRecursive,
  PageFragment,
  pageBySlug,
} from '@/basehub-helpers/fragments'
import { Pump } from '@/.basehub/react-pump'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getActiveSidebarItem, processArticle } from '@/basehub-helpers/sidebar'
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
  if (!activeSidebarItem) return {}

  return {
    title: activeSidebarItem._title,
  }
}

export default function ArticlePage({
  params,
}: {
  params: { slug: string[] | undefined }
}) {
  const [activePageSlug, activeArticleSlug, ...path] = params.slug ?? []
  const edgeSlug = path[path.length - 1]

  return (
    <Pump
      queries={[
        {
          pages: {
            __args: {
              first: 1,
              ...(activePageSlug && {
                filter: { _sys_slug: { eq: activePageSlug } },
              }),
            },
            items: {
              _slug: true,
              articles: {
                __args: {
                  first: 1,
                  filter: { _sys_slug: { eq: activeArticleSlug } },
                },
                items: ArticleMetaFragmentRecursive,
              },
            },
          },
        },
      ]}
      next={{ revalidate: 30 }}
      draft={draftMode().isEnabled}
    >
      {async ([data]) => {
        'use server'
        const articles = data.pages.items[0]?.articles.items[0]
        if (!articles) notFound()

        let first: undefined | ArticleMetaFragment
        let edge: undefined | ArticleMetaFragment
        let lastEdgeLevel = 0
        processArticle(articles, (article, { level }) => {
          if (edge && lastEdgeLevel >= level) return

          if (!first && article.body?.__typename) {
            first = article as ArticleMetaFragment
          }

          if (article._slug === edgeSlug) {
            edge = article as ArticleMetaFragment
            lastEdgeLevel = level
          }
        })

        edge = edge || first

        if (!edge) notFound()

        return <Article id={edge._id} />
      }}
    </Pump>
  )
}
