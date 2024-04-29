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
import { siteOrigin } from '@/constants/routing'

export const generateStaticParams = async (): Promise<
  Array<{ params: { category: string; slug: string[] } }>
> => {
  const data = await basehub({ cache: 'no-store' }).query({
    pages: { items: PageFragment },
  })
  const result: Array<{ params: { category: string; slug: string[] } }> = []

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
      result.push({ params: { category, slug: updatedPath } })
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
  }).query({
    pages: pageBySlug(params.category),
    settings: {
      metadata: {
        pageTitleTemplate: true,
        sitename: true,
        favicon: { url: true },
      },
    },
  })

  const category = data.pages.items[0]
  if (!category) return {}

  const { item: activeSidebarItem } = getActiveSidebarItem({
    sidebar: category.articles,
    activeSlugs: params.slug ?? [],
  })
  if (!activeSidebarItem) return notFound()

  const title = {
    absolute: `${category._title} / ${activeSidebarItem.titleSidebarOverride ?? activeSidebarItem._title} ${data.settings.metadata.pageTitleTemplate}`,
  }
  const excerpt = activeSidebarItem.excerpt
  const description = !excerpt
    ? undefined
    : excerpt.length > 150
      ? excerpt.slice(0, 150) + '...'
      : excerpt
  const siteName = data.settings.metadata.sitename
  const categorySlug = params.category
  const activeSlugs = params.slug ?? []
  const lastModified =
    new Date(activeSidebarItem._sys.lastModifiedAt).getTime() +
    new Date(category._sys.lastModifiedAt).getTime()

  const images = [
    {
      url:
        siteOrigin +
        `/dynamic-og?category-slug=${categorySlug}&active-slugs=${activeSlugs.join(
          ','
        )}&last-modified=${lastModified}`,
      width: 1200,
      height: 630,
    },
  ]

  return {
    title,
    description,
    icons: {
      icon: data.settings.metadata.favicon.url,
      shortcut: data.settings.metadata.favicon.url,
      apple: data.settings.metadata.favicon.url,
    },
    openGraph: {
      title,
      description,
      siteName,
      locale: 'en-US',
      type: 'website',
      url: siteOrigin + `/docs/${params.slug?.join('/') ?? ''}`,
      images,
    },
  }
}

export function truncateString(str: string, maxLength: number) {
  if (str.length > maxLength) {
    return str.slice(0, maxLength) + '...'
  } else {
    return str
  }
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

        const {
          next,
          previous,
          item: activeSidebarItem,
        } = getActiveSidebarItem({
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

        return (
          <Article
            id={activeSidebarItem._id}
            breadcrumb={breadcrumb}
            prevArticle={
              previous
                ? {
                    title: previous.titleSidebarOverride ?? previous._title,
                    excerpt: previous.excerpt,
                    href:
                      page._slug + '/' + slugs.join('/') + '/' + previous._slug,
                  }
                : null
            }
            nextArticle={
              next
                ? {
                    title: next.titleSidebarOverride ?? next._title,
                    excerpt: next?.excerpt,
                    href: page._slug + '/' + slugs.join('/') + '/' + next._slug,
                  }
                : null
            }
          />
        )
      }}
    </Pump>
  )
}
