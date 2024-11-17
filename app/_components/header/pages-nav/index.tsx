import { Pump } from '@/.basehub/react-pump'
import { Box, Container, Flex } from '@radix-ui/themes'
import { fragmentOn } from 'basehub'
import { Nav } from './nav'
import {
  ArticleSlugFragmentRecursive,
  PageMetaFragment,
} from '@/basehub-helpers/fragments'

import s from './nav.module.scss'

export const HeaderFragment = fragmentOn('Header', {
  topRightLinks: {
    items: {
      _id: true,
      label: true,
      href: true,
    },
  },
  subNavLinks: {
    items: {
      _id: true,
      page: {
        _id: true,
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
      queries={[
        {
          header: HeaderFragment,
          pages: { __args: { first: 1 }, items: PageMetaFragment },
        },
      ]}
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
                  <Nav
                    firstCategory={data.pages.items[0]}
                    subNavLinks={data.header.subNavLinks}
                  />
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
