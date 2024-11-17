import { SidebarFragment } from '@/basehub-helpers/fragments'
import { getActiveSidebarItem } from '@/basehub-helpers/sidebar'
import { basehub } from 'basehub'
import { draftMode } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import nextConfig from './next.config'

export async function middleware(request: NextRequest) {
  /**
   * Redirect to first category page.
   */
  const { pages } = await basehub({
    draft: (await draftMode()).isEnabled,
  }).query({ pages: { __args: { first: 1 }, items: SidebarFragment.items } })

  const firstCategory = pages.items?.[0]
  if (!firstCategory) return NextResponse.next()

  const url = new URL(request.url)

  if (firstCategory) {
    const {
      current: { article, path: firstArticlePath },
    } = getActiveSidebarItem({
      activeSlugs: [],
      sidebar: firstCategory.articles,
    })

    if (firstArticlePath) {
      return NextResponse.redirect(
        new URL(
          `${nextConfig.basePath ?? '/'}${firstArticlePath.join('/')}/${article?._slug}`.replace(
            /\/\//g,
            '/'
          ) +
            url.search +
            url.hash,
          url
        )
      )
    } else {
      return NextResponse.redirect(
        new URL(
          (nextConfig.basePath ?? '/') +
            firstCategory._slug +
            url.search +
            url.hash,
          url
        )
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/',
}
