import { Pump } from '@/.basehub/react-pump'
import { HeaderFragment, PagesNav } from './pages-nav'
import NextLink from 'next/link'
import { draftMode } from 'next/headers'
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Link,
  Text,
} from '@radix-ui/themes'
import { ThemeSwitcher } from '../theme-switcher'
import {
  DialogTriggerDesktop,
  DialogTriggerMobile,
  SearchProvider,
} from './search'
import { Logo } from '../logo'

import s from './header.module.scss'

export const Header = () => {
  return (
    <Pump
      queries={[
        { settings: { logo: { url: true }, logoDark: { url: true } } },
        { header: HeaderFragment },
        {
          _componentInstances: {
            article: { _searchKey: true },
          },
        },
      ]}
      next={{ revalidate: 30 }}
      draft={draftMode().isEnabled}
    >
      {async ([
        { settings },
        { header },
        {
          _componentInstances: {
            article: { _searchKey },
          },
        },
      ]) => {
        'use server'

        const logoLight = settings.logo.url
        const logoDark = settings.logoDark.url

        return (
          <SearchProvider
            _searchKey={_searchKey}
            searchCategories={header.navLinks.items}
          >
            <header className={s.header}>
              <Container
                size="4"
                px={{ initial: '5', md: '8' }}
                height="100%"
                className={s['header__head']}
                position="relative"
              >
                {/* mobile */}
                <Flex
                  align="center"
                  height="100%"
                  justify="between"
                  display={{ initial: 'flex', md: 'none' }}
                >
                  <Flex align="center" justify="end">
                    <Logo logoLight={logoLight} logoDark={logoDark} />
                    <Box ml="3">
                      <DialogTriggerMobile />
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

                {/* desktop */}
                <Grid
                  columns="3"
                  align="center"
                  height="100%"
                  justify="between"
                  display={{ initial: 'none', md: 'grid' }}
                >
                  <Logo logoLight={logoLight} logoDark={logoDark} />
                  <Flex maxWidth="300px" mx="auto" width="100%">
                    <DialogTriggerDesktop />
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
              </Container>
              <PagesNav />
            </header>
          </SearchProvider>
        )
      }}
    </Pump>
  )
}
