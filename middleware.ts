import { SidebarFragment } from '@/basehub-helpers/fragments'
import { getActiveSidebarItem } from '@/basehub-helpers/sidebar'
import { basehub } from 'basehub'
import { draftMode } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  /**
   * Redirect to first category page.
   */
  const { header, pages } = await basehub({
    next: { revalidate: 30 },
    draft: draftMode().isEnabled,
  }).query({
    pages: SidebarFragment,
    header: {
      subNavLinks: {
        __args: { first: 1 },
        items: {
          page: {
            _slug: true,
          },
        },
      },
    },
  })

  const firstCategorySlug = header.subNavLinks.items?.[0]?.page?._slug
  if (!firstCategorySlug) return NextResponse.next()

  const page = pages.items.find((page) => page._slug === firstCategorySlug)

  if (page) {
    const {
      current: { article, path: firstArticlePath },
    } = getActiveSidebarItem({
      activeSlugs: [],
      sidebar: page.articles,
    })

    if (firstArticlePath) {
      return NextResponse.redirect(
        new URL(
          `/${page._slug}/${firstArticlePath.join('/')}/${article?._slug}`.replace(
            /\/\//g,
            '/'
          ),
          request.url
        )
      )
    } else {
      return NextResponse.redirect(new URL(page._slug, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/',
}
