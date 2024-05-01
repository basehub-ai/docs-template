import { basehub } from '@/.basehub'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function RootPage() {
  const { header } = await basehub({
    next: { tags: ['basehub'] },
  }).query({
    header: {
      navLinks: {
        __args: { first: 1 },
        items: { page: { _slug: true } },
      },
    },
  })

  const firstCategory = header.navLinks.items?.[0]?.page
  if (!firstCategory) return null

  redirect(firstCategory._slug)
}
