import { Article, ArticleWrapper } from '@/app/_components/article'
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
import { Toc } from '@/app/_components/toc'
import { ArticleIndex } from '@/app/_components/article/article-index'

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
  const siteName = data.settings.metadata.sitename

  if (!params.slug?.length) {
    const title = `${category._title} ${data.settings.metadata.pageTitleTemplate}`
    const description = siteName + ' documentation / ' + category._title
    const images = [
      {
        url: siteOrigin + `/dynamic-og?article=${category._id}&type=category`,
        width: 1200,
        height: 630,
      },
    ]

    return {
      title,
      description: siteName + ' documentation / ' + category._title,
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

  const {
    current: { article },
  } = getActiveSidebarItem({
    sidebar: category.articles,
    activeSlugs: params.slug ?? [],
  })
  if (!article) return notFound()
  const { _id, _title, titleSidebarOverride, excerpt } = article

  const title = {
    absolute: `${category._title} / ${titleSidebarOverride ?? _title} ${data.settings.metadata.pageTitleTemplate}`,
  }
  const description = !excerpt
    ? undefined
    : excerpt.length > 150
      ? excerpt.slice(0, 150) + '...'
      : excerpt

  const images = [
    {
      url: siteOrigin + `/dynamic-og?article=${_id}`,
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
          current: { article: activeSidebarItem },
          next,
        } = getActiveSidebarItem({
          sidebar: page.articles,
          activeSlugs,
        })

        if (!params.slug?.length) {
          return (
            <>
              <ArticleWrapper
                title={page._title}
                lastModifiedAt={page._sys.lastModifiedAt ?? null}
                nextArticle={{
                  title:
                    activeSidebarItem?._title ?? activeSidebarItem?._slug ?? '',
                  href: '/' + params.category + '/' + activeSidebarItem?._slug,
                }}
                breadcrumb={[{ title: page._title, slug: page._slug }]}
              >
                <ArticleIndex articles={page.articles.items} />
              </ArticleWrapper>

              <Toc>{[]}</Toc>
            </>
          )
        }

        if (!activeSidebarItem) notFound()

        const { titles, slugs } = getBreadcrumb({
          sidebar: page.articles,
          activeSidebarItem,
        })

        const breadcrumb = [
          { title: page._title, slug: page._slug },
          ...titles.map((item, index) => ({
            title: item,
            slug: slugs[index] ?? '#',
          })),
          { title: activeSidebarItem._title, slug: activeSidebarItem._slug },
        ]

        let nextArticle = null
        if (next.article) {
          nextArticle = {
            title: next.article.titleSidebarOverride ?? next.article._title,
            href: '/' + params.category + '/' + next.path.join('/'),
          }
        }

        return (
          <Article
            id={activeSidebarItem._id}
            breadcrumb={breadcrumb}
            nextArticle={nextArticle}
          />
        )
      }}
    </Pump>
  )
}
