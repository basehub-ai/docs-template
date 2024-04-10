'use client'
import * as React from 'react'
import {
  ArticleMetaFragmentRecursive,
  PageFragment,
} from '@/basehub-helpers/fragments'
import Link from 'next/link'
import { getActiveSidebarItem } from '@/basehub-helpers/sidebar'
import { useParams } from 'next/navigation'
import { clsx } from 'clsx'

/* -------------------------------------------------------------------------------------------------
 * Root
 * -----------------------------------------------------------------------------------------------*/

export type SidebarProps = {
  data: PageFragment['articles']
  level: number
  pathname: string
}

export const Sidebar = ({ data, level, pathname }: SidebarProps) => {
  const params = useParams()

  const activeSlugs: string[] = React.useMemo(() => {
    const slugs = params.slug as string[] | undefined
    if (!slugs) return []
    return slugs.slice(1)
  }, [params.slug])

  const activeSidebarItem = React.useMemo(() => {
    return getActiveSidebarItem({
      sidebar: data,
      activeSlugs,
    })
  }, [activeSlugs, data])

  return (
    <SidebarContext.Provider value={{ activeSidebarItem, activeSlugs }}>
      <aside className="sticky top-header -ml-3 flex h-sidebar w-full flex-col gap-3 overflow-auto border-r border-gray-200 pb-12 pl-3 pr-3 pt-6">
        {data.items.map((item) => {
          return (
            <SidebarItem
              data={item}
              key={item._id}
              level={level}
              pathname={`${pathname}/${item._slug}`}
            />
          )
        })}
      </aside>
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
  const [isCollapsed, setIsCollapsed_INTERNAL] = React.useState(() => {
    if (initial === false) return false
    if (collapsedMap.has(key)) return collapsedMap.get(key)!
    return initial
  })

  const toggleCollapsed = React.useCallback(() => {
    setIsCollapsed_INTERNAL((p) => {
      const newValue = !p
      collapsedMap.set(key, newValue)
      return newValue
    })
  }, [key])

  return { isCollapsed, toggleCollapsed }
}

const SidebarItem = ({
  data,
  level,
  pathname,
}: {
  data: ArticleFragmentRecursive
  level: number
  pathname: string
}) => {
  const isRootLevel = level === 0
  const { activeSidebarItem, activeSlugs } = useSidebarContext()
  const isActive = activeSidebarItem?._id === data._id
  const isActiveInPath = activeSlugs.includes(data._slug)

  const { isCollapsed, toggleCollapsed } = useCollapsedState(
    `sidebar-item-collapsed-${data._id}`,
    isRootLevel || isActiveInPath ? false : true
  )

  const href = React.useMemo(() => {
    function getHrefFromArticle(
      article: ArticleFragmentRecursive
    ): string | null {
      if (article.body?.__typename) {
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
    const className =
      'text-gray-500 font-medium text-sm items-center relative py-2 px-3 -mx-3 flex leading-4 transition-colors w-[calc(100%+12px)]'

    if (href)
      return (
        <Link
          href={href}
          className={clsx(
            'rounded-lg hover:text-black',
            className,
            isActive && 'bg-gray-100 !text-black'
          )}
        >
          {title}
        </Link>
      )
    if (data.children.items.length <= 0) {
      return <p className={className}>{title}</p>
    }
    if (isRootLevel) {
      return (
        <div className="mb-1 border-b border-gray-200">
          <p
            className={clsx(
              className,
              'font-mono !text-[11px] font-bold uppercase tracking-wider !text-black'
            )}
          >
            {data.titleSidebarOverride ?? data._title}
          </p>
        </div>
      )
    }
    return (
      <button onClick={toggleCollapsed} className={className}>
        {title}
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

  return (
    <div>
      <div className={clsx('relative', isActive && 'text-brand')}>
        {titleNode}

        <div
          className={clsx(
            'absolute -left-5 top-0 h-full w-px rounded-full bg-brand transition',
            isActive && level > 1 ? '' : 'invisible opacity-0'
          )}
        />

        {data.children && data.children.items.length > 0 && !isRootLevel && (
          <button
            className="boder-gray-200 absolute right-2 top-1/2 flex -translate-y-1/2 cursor-default items-center justify-center rounded-md border bg-white p-0.5 text-gray-500 shadow-sm hover:border-gray-300 hover:text-gray-800"
            onClick={toggleCollapsed}
          >
            <span className="sr-only">
              {isCollapsed ? 'Expand' : 'Collapse'}
            </span>
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={clsx(
                'transition-transform',
                isCollapsed === false && 'rotate-90'
              )}
            >
              <path
                d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>

      <div
        className={clsx(
          'pb-2 pt-1',
          (isCollapsed || data.children.items.length < 1) && 'hidden'
        )}
      >
        <div className={clsx('relative', !isRootLevel && 'pl-5')}>
          {!isRootLevel && (
            <div className="absolute left-0 top-0 h-full w-px rounded-full bg-gray-200" />
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
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Context
 * -----------------------------------------------------------------------------------------------*/

const SidebarContext = React.createContext<
  | undefined
  | {
      activeSidebarItem: ArticleFragmentRecursive | null
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
