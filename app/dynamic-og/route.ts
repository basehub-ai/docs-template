export const runtime = 'edge'
export const revalidate = 60

import { basehub } from '@/.basehub'
import { ContentOGWrapperResponse } from './wrapper'
import { notFound } from 'next/navigation'
import { pageBySlug } from '@/basehub-helpers/fragments'
import { getActiveSidebarItem } from '@/basehub-helpers/sidebar'

export const GET = async (request: Request) => {
  const searchParams = new URL(request.url).searchParams

  const categorySlug = searchParams.get('category-slug')
  const activeSlugs = searchParams.get('active-slugs')

  if (!categorySlug || !activeSlugs) return notFound()

  const data = await basehub({ next: { tags: ['basehub'] } }).query({
    pages: pageBySlug(categorySlug),
    settings: { theme: { accentColor: true }, logo: { url: true, alt: true } },
  })

  const category = data.pages.items[0]
  if (!category) notFound()
  const { item: activePage } = getActiveSidebarItem({
    sidebar: category.articles,
    activeSlugs: activeSlugs.split(','),
  })

  if (!category || !activePage) return notFound()

  const title = activePage.titleSidebarOverride ?? activePage._title
  return await ContentOGWrapperResponse({
    title,
    subtitle: activePage.excerpt ?? '',
    logo: data.settings.logo,
    accentColor: data.settings.theme.accentColor,
  })
}
