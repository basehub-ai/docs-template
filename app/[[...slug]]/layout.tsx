import { pageBySlug } from '@/basehub-helpers/fragments'
import { notFound } from 'next/navigation'
import { Sidebar } from '../_components/sidebar'
import { Pump } from '@/.basehub/react-pump'
import { draftMode } from 'next/headers'

export default async function ArticleLayout({
  children,
  params,
}: {
  children?: React.ReactNode
  params: { slug: string | undefined }
}) {
  const activePageSlug = params.slug?.[0]

  return (
    <div className="container mx-auto flex gap-8">
      <div className="w-80">
        <Pump
          queries={[{ pages: pageBySlug(activePageSlug) }]}
          next={{ revalidate: 30 }}
          draft={draftMode().isEnabled}
        >
          {async ([data]) => {
            'use server'

            const page = data.pages.items[0]
            if (!page) notFound()

            return (
              <Sidebar
                data={page.articles}
                level={0}
                pathname={`/${page._slug}`}
              />
            )
          }}
        </Pump>
      </div>
      <main className="flex items-start min-h-screen w-full gap-x-8 py-8">{children}</main>
    </div>
  )
}
