import { Pump } from '@/.basehub/react-pump'
import { HeaderFragment, PagesNav } from './pages-nav'
import { Box, Container, Flex, Grid } from '@radix-ui/themes'
import {
  DialogTriggerDesktop,
  DialogTriggerMobile,
  SearchProvider,
} from './search'
import { Logo } from '../logo'
import { TopRightNavDesktop, TopRightNavMobile } from './header-nav'
import { PageMetaFragment } from '@/basehub-helpers/fragments'

import s from './header.module.scss'

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
          header: HeaderFragment,
          _componentInstances: { article: { _searchKey: true } },
          pages: { items: PageMetaFragment },
        },
      ]}
    >
      {async ([
        {
          settings,
          header,
          _componentInstances: {
            article: { _searchKey },
          },
          pages,
        },
      ]) => {
        'use server'

        const logoLight = settings.logo.url
        const logoDark = settings.logoDark.url

        return (
          <SearchProvider
            _searchKey={_searchKey}
            searchCategories={pages.items}
            firstCategoryId={pages.items[0]?._id}
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
                  <Flex align="center" justify="end" gapX="3">
                    <Logo logoLight={logoLight} logoDark={logoDark} />
                    <DialogTriggerMobile />
                  </Flex>

                  <TopRightNavMobile
                    appearance={settings.theme.appearance}
                    topRightLinks={header.topRightLinks}
                  />
                </Flex>

                {/* desktop */}
                <Grid
                  columns={{ initial: 'auto 1fr auto', lg: '3' }}
                  gapX="5"
                  align="center"
                  height="100%"
                  justify="between"
                  display={{ initial: 'none', md: 'grid' }}
                >
                  <Logo logoLight={logoLight} logoDark={logoDark} />
                  <Box>
                    <Flex
                      maxWidth="300px"
                      mr={{ lg: 'auto' }}
                      ml={{ lg: 'auto' }}
                      width="100%"
                      justify="start"
                    >
                      <DialogTriggerDesktop />
                    </Flex>
                  </Box>

                  <TopRightNavDesktop
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
