import { Pump } from '@/.basehub/react-pump'
import { DraftModeHeader } from '../../draft'
import { Box, Container, Flex } from '@radix-ui/themes'
import { fragmentOn } from '@/.basehub'
import { draftMode } from 'next/headers'
import { Nav } from './nav'

import s from './nav.module.scss'

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
          <Box height="40px" className={s['pages-nav']}>
            <Flex
              asChild
              justify="between"
              align="center"
              gap="7"
              height="100%"
            >
              <Container height="100%" px="8">
                <Nav navLinks={data.header.navLinks} />
                {draftMode().isEnabled && <DraftModeHeader />}
              </Container>
            </Flex>
          </Box>
        )
      }}
    </Pump>
  )
}

const HeaderFragment = fragmentOn('Header', {
  navLinks: {
    items: {
      _id: true,
      page: { _title: true, _slug: true },
      label: true,
      href: true,
    },
  },
})

export type HeaderFragment = fragmentOn.infer<typeof HeaderFragment>
