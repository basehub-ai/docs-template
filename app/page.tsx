import { basehub } from '@/.basehub'
import { SidebarFragment } from '@/basehub-helpers/fragments'
import { getActiveSidebarItem } from '@/basehub-helpers/sidebar'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function RootPage() {
  const { header, pages } = await basehub({
    next: { tags: ['basehub'] },
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
  if (!firstCategorySlug) return null

  const page = pages.items.find((page) => page._slug === firstCategorySlug)

  if (page) {
    const {
      current: { article, path: firstArticlePath },
    } = getActiveSidebarItem({
      activeSlugs: [],
      sidebar: page.articles,
    })

    if (firstArticlePath) {
      redirect(`${page._slug}/${firstArticlePath.join('/')}/${article?._slug}`)
    } else {
      redirect(page._slug)
    }
  }
}
