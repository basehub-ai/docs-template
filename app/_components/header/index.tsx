import { Pump } from '@/.basehub/react-pump'
import { HeaderFragment, PagesNav } from './pages-nav'
import NextLink from 'next/link'
import { draftMode } from 'next/headers'
import { Box, Button, Container, Flex, Grid, Link, Text } from '@radix-ui/themes'
import { ThemeSwitcher } from '../theme-switcher'
import { Search } from './search'
import { Logo } from '../logo'

import s from './header.module.scss'

export const Header = () => {
  return (
    <Pump
      queries={[
        { settings: { logo: { url: true }, logoDark: { url: true } } },
        { header: HeaderFragment },
      ]}
      next={{ revalidate: 30 }}
      draft={draftMode().isEnabled}
    >
      {async ([{ settings }, { header }]) => {
        'use server'
        const logoLight = settings.logo.url
        const logoDark = settings.logoDark.url

        return (
          <header className={s.header}>
            <Container
              size="4"
              px={{ initial: '5', md: '8' }}
              height="100%"
              className={s['header__head']}
              position="relative"
            >
              {/* mobile */}
              <Grid
                columns="3"
                align="center"
                height="100%"
                justify="between"
                display={{ initial: 'none', md: 'grid' }}
              >
                <Logo logoLight={logoLight} logoDark={logoDark} />
                <Flex maxWidth="300px" mx="auto">
                  <Search searchCategories={header.navLinks.items} />
                </Flex>
                <Flex align="center" justify="end">
                  <ThemeSwitcher />
                  <Button
                    asChild
                    ml="5"
                    radius="large"
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
              </Grid>

              {/* >= md */}
              <Flex
                align="center"
                height="100%"
                justify="between"
                display={{ initial: 'flex', md: 'none' }}
              >
                <Flex align="center" justify="end">
                  <Logo logoLight={logoLight} logoDark={logoDark} />
                  <Box ml="3">
                    <Search searchCategories={header.navLinks.items} />
                  </Box>
                </Flex>
                <Flex align="center" justify="end">
                  <ThemeSwitcher />
                  <Button
                    asChild
                    ml="5"
                    radius="large"
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
