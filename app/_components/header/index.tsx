import { Pump } from '@/.basehub/react-pump'
import { PagesNav } from './pages-nav'
import NextLink from 'next/link'
import { draftMode } from 'next/headers'
import { Button, Container, Flex, Link, Text } from '@radix-ui/themes'
import { ThemeSwitcher } from '../theme-switcher'

import s from './header.module.scss'
import Search from './search'

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
            <Container size="4" px="8" height="100%">
              <Flex align="center" height="100%" justify="between">
                <NextLink href="/">
                  <span className="sr-only">Home</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logo} alt="logo" className={s['header__logo']} />
                </NextLink>
                <Search />
                <Flex align="center" justify="center">
                  <ThemeSwitcher />
                  <Button
                    asChild
                    ml="5"
                    radius="full"
                    className={s['header__main-cta']}
                    size="2"
                  >
                    <Link asChild>
                      <NextLink href="#">
                        <Text as="span" weight="medium">
                          Main CTA
                        </Text>
                      </NextLink>
                    </Link>
                  </Button>
                </Flex>
              </Flex>
            </Container>
            <PagesNav />
          </header>
        )
      }}
    </Pump>
  )
}
