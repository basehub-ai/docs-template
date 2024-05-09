export const runtime = 'edge'
export const revalidate = 60

import { basehub } from '@/.basehub'
import { ContentOGWrapperResponse } from './wrapper'
import { notFound } from 'next/navigation'
import { ArticlePlainTextFragment } from '@/basehub-helpers/fragments'
import { ThemeProps } from '@radix-ui/themes'

export const GET = async (request: Request) => {
  const searchParams = new URL(request.url).searchParams
  const articleId = searchParams.get('article')

  if (!articleId) return notFound()
  const data = await basehub({ next: { tags: ['basehub'] } }).query({
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

  const [article] = data._componentInstances.article.items
  if (!article) return notFound()

  const title = article.titleSidebarOverride ?? article._title
  if (!article.body) return notFound()
  const articleSubtitle = article.excerpt ?? article.body?.plainText ?? ''
  const subtitle =
    articleSubtitle.length > 138
      ? articleSubtitle.slice(0, 138) + '...'
      : articleSubtitle
  const theme = data.settings.theme.appearance as 'light' | 'dark' | 'system'

  return await ContentOGWrapperResponse({
    title,
    subtitle,
    logo: theme === 'dark' ? data.settings.logoDark : data.settings.logo,
    accentColor: data.settings.theme.accentColor as ThemeProps['accentColor'],
    theme,
  })
}
