import { Pump } from '@/.basehub/react-pump'
import { DraftModeHeader } from '../../draft'
import { Box, Container, Flex } from '@radix-ui/themes'
import { fragmentOn, fragmentOnRecursiveCollection } from '@/.basehub'
import { draftMode } from 'next/headers'
import { Nav } from './nav'

import s from './nav.module.scss'

export const ArticleSlugFragmentRecursive = fragmentOnRecursiveCollection(
  'ArticleComponent',
  { _slug: true },
  { levels: 5, recursiveKey: 'children' }
)

export type ArticleSlugFragment = fragmentOn.infer<
  typeof ArticleSlugFragmentRecursive
>

export const HeaderFragment = fragmentOn('Header', {
  navLinks: {
    items: {
      _id: true,
      page: {
        _title: true,
        _slug: true,
        articles: {
          __args: { first: 1 },
          items: ArticleSlugFragmentRecursive,
        },
      },
      label: true,
      href: true,
    },
  },
})

export const PagesNav = async () => {
  return (
    <Pump
      queries={[{ header: HeaderFragment }]}
      next={{ revalidate: 30 }}
      draft={draftMode().isEnabled}
    >
      {async ([data]) => {
        'use server'

        return (
          <Box className={s['pages-nav']} overflowX={{ md: 'visible' }}>
            <Flex
              asChild
              justify="between"
              align="center"
              gap="7"
              height="100%"
            >
              <Container
                height="100%"
                px={{ initial: '5', md: '8' }}
                overflowX={{ initial: 'auto', md: 'visible' }}
                overflowY={{ initial: 'clip', md: 'visible' }}
              >
                <Flex align="center" justify="between" height="100%">
                  <Nav navLinks={data.header.navLinks} />
                  {draftMode().isEnabled && <DraftModeHeader />}
                </Flex>
              </Container>
            </Flex>
          </Box>
        )
      }}
    </Pump>
  )
}

export type HeaderFragment = fragmentOn.infer<typeof HeaderFragment>
