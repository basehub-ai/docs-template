import { Pump } from '@/.basehub/react-pump'
import { HeaderFragment, PagesNav } from './pages-nav'
import NextLink from 'next/link'
import { draftMode } from 'next/headers'
import {
  Box,
  Button,
  Container,
  Dialog,
  Flex,
  Grid,
  IconButton,
  Kbd,
  Link,
  Text,
  TextField,
} from '@radix-ui/themes'
import { ThemeSwitcher } from '../theme-switcher'
import { SearchProvider } from './search'
import { Logo } from '../logo'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'

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
                      <Dialog.Trigger>
                        <IconButton variant="soft">
                          <MagnifyingGlassIcon />
                        </IconButton>
                      </Dialog.Trigger>
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
                    <Dialog.Trigger style={{ width: '100%' }}>
                      <TextField.Root
                        readOnly
                        placeholder="Search"
                        size="2"
                        radius="large"
                        className={s['search-trigger']}
                      >
                        <TextField.Slot>
                          <MagnifyingGlassIcon color="currentColor" />
                        </TextField.Slot>
                        <TextField.Slot>
                          <Flex align="center" justify="between" gap="1">
                            <Kbd>⌘</Kbd>
                            <Kbd>k</Kbd>
                          </Flex>
                        </TextField.Slot>
                      </TextField.Root>
                    </Dialog.Trigger>
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
