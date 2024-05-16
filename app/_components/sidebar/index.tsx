'use client'

import * as React from 'react'
import {
  ArticleMetaFragmentRecursive,
  SidebarArticleFragmentRecursive,
  SidebarFragment,
} from '@/basehub-helpers/fragments'
import NextLink from 'next/link'
import { getActiveSidebarItem } from '@/basehub-helpers/sidebar'
import { useParams, usePathname } from 'next/navigation'
import {
  Box,
  Button,
  Code,
  Flex,
  IconButton,
  Link,
  ScrollArea,
  Separator,
  Text,
  VisuallyHidden,
} from '@radix-ui/themes'
import { ChevronRightIcon } from '@radix-ui/react-icons'

import s from './sidebar.module.scss'

export type SidebarProps = {
  data: SidebarFragment['items'][number]['articles']
  level: number
  category: string
}

export const Sidebar = ({ data, level, category }: SidebarProps) => {
  const pathname = usePathname()
  const params = useParams()
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false)

  React.useLayoutEffect(() => {
    setMobileSidebarOpen(false)
  }, [pathname])

  const activeSlugs: string[] = React.useMemo(() => {
    const slugs = params.slug as string[] | undefined
    if (!slugs) return []
    return slugs
  }, [params.slug])

  const {
    current: { article: activeSidebarItem },
  } = React.useMemo(() => {
    return getActiveSidebarItem({
      sidebar: data,
      activeSlugs,
    })
  }, [activeSlugs, data])

  const toggleSidebar = () => {
    setMobileSidebarOpen((prevState) => !prevState)
  }

  React.useLayoutEffect(() => {
    const el = document.querySelector(`.${s.sidebar__item}[data-active="true"]`)
    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      })
    }
  }, [])

  return (
    <SidebarContext.Provider
      value={{
        activeSidebarItem: params.slug ? activeSidebarItem : null,
        activeSlugs,
      }}
    >
      <Box
        position="fixed"
        ml={{ initial: '-5', md: '0' }}
        overflowX="clip"
        className={s['sidebar__mobile-toggle']}
        width="100svw"
        display={{ initial: 'block', md: 'none' }}
      >
        <Flex
          display={{ initial: 'flex', md: 'none' }}
          justify="between"
          overflowX="auto"
          px="5"
          width="100%"
          asChild
        >
          <Button
            color="gray"
            variant="soft"
            radius="none"
            size="3"
            onClick={toggleSidebar}
          >
            <Text weight="medium">
              {activeSidebarItem?._title ?? 'Untitled article'}
            </Text>
            <Flex as="span" ml="auto">
              <ChevronRightIcon
                style={{
                  transform: mobileSidebarOpen ? 'rotate(90deg)' : 'none',
                }}
              />
            </Flex>
          </Button>
        </Flex>
      </Box>

      <Box
        className={s.sidebar}
        height={{ initial: 'auto', md: 'var(--sidebar)' }}
        position={{ initial: 'fixed', md: 'sticky' }}
        top="calc(var(--header) - 1px)"
        left={{ initial: '0', md: 'unset' }}
        display={{
          initial: mobileSidebarOpen ? 'block' : 'none',
          md: 'block',
        }}
        width={{ initial: '100svw', md: '320px' }}
        px={{ initial: '3', md: '0' }}
        ml={{ initial: '0', md: '-3' }}
      >
        <ScrollArea data-mobile-display={mobileSidebarOpen}>
          <Flex
            asChild
            ml="-3"
            pb={{ initial: '3', md: '7' }}
            pl="5"
            pr="3"
            pt="5"
            direction="column"
            gap="4"
          >
            <aside>
              {data.items.map((item) => (
                <SidebarItem
                  data={item}
                  key={item._id}
                  level={level}
                  pathname={`${category}/${item._slug}`}
                />
              ))}
            </aside>
          </Flex>
        </ScrollArea>
      </Box>

      <Box
        display={{ initial: mobileSidebarOpen ? 'block' : 'none', md: 'none' }}
      >
        <Separator size="4" />
      </Box>
    </SidebarContext.Provider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Item (recursive)
 * -----------------------------------------------------------------------------------------------*/

/**
 * We'll use this map to preserve collapsed state through navigation.
 */
const collapsedMap = new Map<string, boolean>()

const useCollapsedState = (key: string, initial: boolean) => {
  const [isCollapsed, setIsCollapsed] = React.useState(() => {
    if (initial === false) return false
    if (collapsedMap.has(key)) return collapsedMap.get(key)!
    return initial
  })

  // sync with map
  React.useEffect(() => {
    if (isCollapsed) {
      collapsedMap.set(key, true)
    } else {
      collapsedMap.set(key, false)
    }
  }, [isCollapsed, key])

  const toggleCollapsed = React.useCallback(() => {
    setIsCollapsed((p) => !p)
  }, [])

  const setNotCollapsed = React.useCallback(() => {
    setIsCollapsed(false)
  }, [])

  return { isCollapsed, toggleCollapsed, setNotCollapsed }
}

const SidebarItem = ({
  data,
  level,
  pathname,
}: {
  data: SidebarArticleFragmentRecursive
  level: number
  pathname: string
}) => {
  const isRootLevel = level === 0
  const { activeSidebarItem, activeSlugs } = useSidebarContext()
  const isActive = activeSidebarItem?._id === data._id
  const userCollapsedSidebar = React.useRef(false)
  const isActiveInPath = React.useMemo(
    () => activeSlugs.includes(data._slug),
    [activeSlugs, data._slug]
  )

  const { isCollapsed, toggleCollapsed, setNotCollapsed } = useCollapsedState(
    `sidebar-item-collapsed-${data._id}`,
    isRootLevel || isActiveInPath ? false : true
  )

  React.useEffect(() => {
    if (userCollapsedSidebar.current) {
      userCollapsedSidebar.current = false
      return
    }

    if (isActiveInPath && isCollapsed) setNotCollapsed()
  }, [isActiveInPath, isCollapsed, setNotCollapsed])

  const href = React.useMemo(() => {
    function getHrefFromArticle(
      article: SidebarArticleFragmentRecursive
    ): string | null {
      if (!article.children.items.length) {
        return pathname
      } else if (isRootLevel) {
        return null
      } else if (article.children.items[0]) {
        return getHrefFromArticle(article.children.items[0])
      } else {
        return null
      }
    }

    return getHrefFromArticle(data)
  }, [data, pathname, isRootLevel])

  const titleNode = React.useMemo(() => {
    const title = data.titleSidebarOverride ?? data._title

    if (href)
      return (
        <Flex asChild px="3" py="2" ml="-3" align="center" position="relative">
          <Link
            className={s.sidebar__item}
            data-active={isActive}
            size="2"
            weight="medium"
            color="gray"
            asChild
          >
            <NextLink href={href}>{title || 'Untitled article'}</NextLink>
          </Link>
        </Flex>
      )

    if (data.children.items.length <= 0)
      return (
        <Text className={s.sidebar__title}>{title || 'Untitled article'}</Text>
      )

    if (isRootLevel) {
      return (
        <Flex className={s.sidebar__divider} py="2" px="3">
          <Code
            variant="ghost"
            size="1"
            mx="-3"
            weight="medium"
            style={{ textTransform: 'uppercase', fontWeight: 600 }}
          >
            {data.titleSidebarOverride ?? data._title}
          </Code>
        </Flex>
      )
    }
    return (
      <button
        className={s.sidebar__title}
        onClick={() => {
          userCollapsedSidebar.current = true
          toggleCollapsed()
        }}
      >
        {title || 'Untitled article'}
      </button>
    )
  }, [
    data._title,
    data.children.items.length,
    data.titleSidebarOverride,
    href,
    isRootLevel,
    toggleCollapsed,
    isActive,
  ])

  // filter the empty pages to prevent linking to a 404
  if (level > 0 && !data.body) return null

  return (
    <Box>
      <Box position="relative">
        {titleNode}

        {level > 1 && (
          <Box
            position="absolute"
            className={s['sidebar__item--indicator']}
            data-active={isActive}
          />
        )}

        {data.children && data.children.items.length > 0 && !isRootLevel && (
          <Flex asChild align="center" justify="center">
            <IconButton
              data-collapsed={isCollapsed}
              variant="surface"
              color="gray"
              size="1"
              className={s['sidebar-item__collapse']}
              onClick={() => {
                userCollapsedSidebar.current = true
                toggleCollapsed()
              }}
            >
              <VisuallyHidden>
                {isCollapsed ? 'Expand' : 'Collapse'}
              </VisuallyHidden>
              <ChevronRightIcon
                style={{
                  transform: !isCollapsed ? 'rotate(90deg)' : 'none',
                }}
              />
            </IconButton>
          </Flex>
        )}
      </Box>

      <Box
        py="2"
        display={isCollapsed || !data.children.items.length ? 'none' : 'block'}
      >
        <Box position="relative" pl={!isRootLevel ? '5' : '0'}>
          {!isRootLevel && (
            <Box
              height="100%"
              className={s['sidebar__descendants-line']}
              position="absolute"
            />
          )}
          {data.children.items.map((item) => {
            return (
              <SidebarItem
                data={item}
                key={item._id}
                level={level + 1}
                pathname={`${pathname}/${item._slug}`}
              />
            )
          })}
        </Box>
      </Box>
    </Box>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Context
 * -----------------------------------------------------------------------------------------------*/

const SidebarContext = React.createContext<
  | undefined
  | {
      activeSidebarItem:
        | SidebarArticleFragmentRecursive
        | ArticleMetaFragmentRecursive
        | null
      activeSlugs: string[]
    }
>(undefined)

const useSidebarContext = () => {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebarContext must be used within SidebarContext')
  }
  return context
}
