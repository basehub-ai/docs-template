import { Pump } from '@/.basehub/react-pump'
import { PagesNav } from './pages-nav'
import Link from 'next/link'
import { draftMode } from 'next/headers'
import { Container, Flex } from '@radix-ui/themes'

import s from './header.module.scss'

export const Header = () => {
  return (
    <Pump
      queries={[{ settings: { logo: { url: true } } }]}
      next={{ revalidate: 30 }}
      draft={draftMode().isEnabled}
    >
      {async ([data]) => {
        'use server'
        const logo = data.settings.logo.url

        return (
          <header className={s.header}>
            <Flex align="center">
              <Container height="9" py="4" px="8" size="4">
                <Link href="/">
                  <span className="sr-only">Home</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logo} alt="logo" style={{ height: 24 }} />
                </Link>
              </Container>
            </Flex>
            <PagesNav />
          </header>
        )
      }}
    </Pump>
  )
}
