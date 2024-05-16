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
import { ThemeSettingsFragment } from '../theme-provider/server'

import s from './header.module.scss'
import { Icon } from '../icon'

export const Header = () => {
  return (
    <Pump
      queries={[
        {
          settings: {
            logo: { url: true },
            logoDark: { url: true },
            theme: { appearance: true },
          },
        },
        { header: HeaderFragment },
        { _componentInstances: { article: { _searchKey: true } } },
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
            searchCategories={header.subNavLinks.items}
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
                    <Icon name={'accessibility-icon'} />
                  </Flex>

                  <TopRightNav
                    appearance={settings.theme.appearance}
                    topRightLinks={header.topRightLinks}
                  />
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

                  <TopRightNav
                    appearance={settings.theme.appearance}
                    topRightLinks={header.topRightLinks}
                  />
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

const TopRightNav = ({
  appearance,
  topRightLinks,
}: {
  appearance: ThemeSettingsFragment['appearance']
  topRightLinks: HeaderFragment['topRightLinks']
}) => {
  return (
    <Flex align="center" justify="end" gap="4">
      {appearance === 'system' && <ThemeSwitcher />}
      {topRightLinks.items.map((item, i, { length }) => {
        const isLast = i === length - 1
        if (isLast) {
          return (
            <Button key={item._id} asChild size="2">
              <Link asChild>
                <NextLink href={item.href}>{item.label}</NextLink>
              </Link>
            </Button>
          )
        }

        return (
          <Link key={item._id} size="2" color="gray" asChild>
            <NextLink href={item.href}>
              <Text as="span">{item.label}</Text>
            </NextLink>
          </Link>
        )
      })}
    </Flex>
  )
}
