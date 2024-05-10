export const runtime = 'edge'
export const revalidate = 60

import { basehub } from '@/.basehub'
import { ContentOGWrapperResponse } from './wrapper'
import { notFound } from 'next/navigation'
import { ArticlePlainTextFragment } from '@/basehub-helpers/fragments'
import { ThemeProps } from '@radix-ui/themes'

export const GET = async (request: Request) => {
  const searchParams = new URL(request.url).searchParams
  const id = searchParams.get('article')
  const pageType = searchParams.get('type')

  if (!id) return notFound()
  const ogData =
    pageType === 'category'
      ? await getCategoryOGData(id)
      : await getArticleOGData(id)

  if (!ogData) return notFound()

  const { title, subtitle, logo, theme, accentColor } = ogData

  return await ContentOGWrapperResponse({
    title,
    subtitle,
    logo,
    accentColor,
    theme,
  })
}

const getCategoryOGData = async (categoryId: string) => {
  const data = await basehub({
    next: { tags: ['basehub'] },
    cache: 'no-store',
  }).query({
    _componentInstances: {
      pagesItem: {
        __args: { first: 1, filter: { _sys_id: { eq: categoryId } } },
        items: { _title: true },
      },
    },
    settings: {
      theme: { accentColor: true, appearance: true },
      logo: { url: true, alt: true },
      logoDark: { url: true, alt: true },
      metadata: { sitename: true },
    },
  })

  const category = data._componentInstances.pagesItem.items[0]
  if (!category) return null

  const title = category._title
  const subtitle =
    data.settings.metadata.sitename + ' documentation / ' + category._title
  const theme = data.settings.theme.appearance as 'light' | 'dark' | 'system'
  const accentColor = data.settings.theme
    .accentColor as ThemeProps['accentColor']
  const logo = theme === 'dark' ? data.settings.logoDark : data.settings.logo

  return {
    title,
    subtitle,
    theme,
    logo,
    accentColor,
  }
}

const getArticleOGData = async (articleId: string) => {
  const data = await basehub({
    next: { tags: ['basehub'] },
    cache: 'no-store',
  }).query({
    _componentInstances: {
      article: {
        __args: { first: 1, filter: { _sys_id: { eq: articleId } } },
        items: ArticlePlainTextFragment,
      },
    },
    settings: {
      theme: { accentColor: true, appearance: true },
      logo: { url: true, alt: true },
      logoDark: { url: true, alt: true },
    },
  })

  const article = data._componentInstances.article.items[0]
  if (!article) return null

  const title = article.titleSidebarOverride ?? article._title
  const subtitle = article?.excerpt ?? article?.body?.plainText ?? ''
  const theme = data.settings.theme.appearance as 'light' | 'dark' | 'system'
  const accentColor = data.settings.theme
    .accentColor as ThemeProps['accentColor']
  const logo =
    data.settings.theme.appearance === 'light'
      ? data.settings.logo
      : data.settings.logoDark

  return { title, subtitle, theme, logo, accentColor }
}
