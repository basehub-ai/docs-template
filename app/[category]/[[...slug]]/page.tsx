import { Article, ArticleWrapper } from '@/app/_components/article'
import {
  ArticleMetaFragmentRecursive,
  PageFragment,
  pageBySlug,
} from '@/basehub-helpers/fragments'
import { Pump } from 'basehub/react-pump'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getActiveSidebarItem, getBreadcrumb } from '@/basehub-helpers/sidebar'
import { basehub } from 'basehub'
import { draftMode } from 'next/headers'
import { Toc } from '@/app/_components/toc'
import { ArticleIndex } from '@/app/_components/article/article-index'
import { OpenApi } from '@/app/_components/openapi'

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
    // add the category index
    result.push({ category: page._slug, slug: [] })
    // process articles recursively
    page.articles.items.forEach((article) => {
      processArticle([], article, page._slug)
    })
  })

  return result
}

export const generateMetadata = async ({
  params: _params,
}: {
  params: Promise<{ category: string; slug: string[] | undefined }>
}): Promise<Metadata> => {
  const params = await _params
  const data = await basehub({ draft: (await draftMode()).isEnabled }).query({
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
        url: category.ogImage.url,
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
        url: `/docs/${params.slug?.join('/') ?? ''}`,
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
  if (!article) return {}
  const { _title, titleSidebarOverride, excerpt } = article

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
      url: article.ogImage.url,
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
      url: `/docs/${params.slug?.join('/') ?? ''}`,
      images,
    },
  }
}

export default async function ArticlePage({
  params: _params,
}: {
  params: Promise<{ category: string; slug: string[] | undefined }>
}) {
  const params = await _params
  const activeSlugs = params.slug ?? []

  return (
    <Pump
      queries={[
        { pages: pageBySlug(params.category) },
        { pages: { __args: { first: 1 }, items: { _id: true } } },
      ]}
    >
      {async ([data, firstCategoryData]) => {
        'use server'

        const page = data.pages.items[0]
        if (!page) {
          notFound()
        }

        if (page.openApiSpec.enabled) {
          if (!page.openApiSpec.url) {
            throw new Error('OpenAPI spec URL is required')
          }
          return <OpenApi url={page.openApiSpec.url} />
        }

        const {
          current: { article: activeSidebarItem },
          next,
        } = getActiveSidebarItem({
          sidebar: page.articles,
          activeSlugs,
        })

        const isInFirstCategory =
          page._id === firstCategoryData.pages.items[0]?._id

        if (!params.slug?.length) {
          return (
            <>
              <ArticleWrapper
                title={page._title}
                lastModifiedAt={page._sys.lastModifiedAt ?? null}
                nextArticle={{
                  title:
                    activeSidebarItem?._title ?? activeSidebarItem?._slug ?? '',
                  href: isInFirstCategory
                    ? '/' + activeSidebarItem?._slug
                    : '/' + params.category + '/' + activeSidebarItem?._slug,
                }}
                breadcrumb={[{ title: page._title, slug: page._slug }]}
              >
                <ArticleIndex articles={page.articles.items} />
              </ArticleWrapper>

              <Toc>{[]}</Toc>
            </>
          )
        }

        if (!activeSidebarItem) {
          notFound()
        }

        const { titles, slugs } = getBreadcrumb({
          sidebar: page.articles,
          activeSidebarItem,
        })

        const breadcrumb = [
          { title: page._title, slug: isInFirstCategory ? '' : page._slug },
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
            href: isInFirstCategory
              ? '/' + next.path.join('/')
              : '/' + params.category + '/' + next.path.join('/'),
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
