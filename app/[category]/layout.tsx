import { Pump } from '@/.basehub/react-pump'
import { SidebarFragment } from '@/basehub-helpers/fragments'
import { draftMode } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { Sidebar } from '../_components/sidebar'
import { Container, Flex } from '@radix-ui/themes'

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { category: string }
}) {
  return (
    <Container size="4" px={{ initial: '5', md: '8' }}>
      <Flex>
        <Pump
          queries={[{ pages: SidebarFragment }]}
          next={{ revalidate: 30 }}
          draft={draftMode().isEnabled}
        >
          {async ([data]) => {
            'use server'

            if (!data.pages.items.length) notFound()
            const page = data.pages.items.find(
              (page) => params.category === page._slug
            )
            const firstPage = data.pages.items[0]
            if (!firstPage) notFound()
            if (!page) redirect(firstPage._slug)

            return (
              <Sidebar
                data={page.articles}
                level={0}
                pathname={`/${page._slug}`}
              />
            )
          }}
        </Pump>
        {children}
      </Flex>
    </Container>
  )
}
