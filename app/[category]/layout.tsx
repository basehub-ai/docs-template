import { Pump } from '@/.basehub/react-pump'
import { SidebarFragment } from '@/basehub-helpers/fragments'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { Sidebar } from '../_components/sidebar'

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { category: string }
}) {
  return (
    <div className="container mx-auto flex gap-8">
      <div className="w-80">
        <Pump
          queries={[{ pages: SidebarFragment }]}
          next={{ revalidate: 30 }}
          draft={draftMode().isEnabled}
        >
          {async ([data]) => {
            'use server'

            const page = data.pages.items.find(
              (page) => params.category === page._slug
            )
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
      {children}
    </div>
  )
}
