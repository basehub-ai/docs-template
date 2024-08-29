import { Pump } from '@/.basehub/react-pump'
import { SidebarFragment } from '@/basehub-helpers/fragments'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { Sidebar } from '../_components/sidebar'
import { Container, Flex } from '@radix-ui/themes'
import { Toolbar } from 'basehub/next-toolbar'

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { category: string }
}) {
  return (
    <Container
      size="4"
      px={{ initial: '5', md: '8' }}
      mt={{ initial: 'var(--header)', md: '0' }}
      id="content-container"
    >
      <Flex
        direction={{ initial: 'column', md: 'row' }}
        id="content-container-inner"
      >
        <Toolbar />
        <Pump
          queries={[{ pages: SidebarFragment }]}
          next={{ revalidate: 30 }}
          draft={draftMode().isEnabled}
        >
          {async ([data]) => {
            'use server'

            if (!data.pages.items.length) notFound()
            const category = data.pages.items.find(
              (page) => params.category === page._slug
            )
            if (!category) notFound()

            return (
              <Sidebar
                data={category.articles}
                level={0}
                category={`/${category._slug}`}
              />
            )
          }}
        </Pump>
        <Flex
          asChild
          width="100%"
          align="start"
          justify="between"
          gapX="6"
          pt="6"
          pb="9"
        >
          <main>{children}</main>
        </Flex>
      </Flex>
    </Container>
  )
}
