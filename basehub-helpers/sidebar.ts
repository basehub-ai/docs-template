import { SidebarProps } from '@/app/_components/sidebar'
import {
  ArticleMetaFragmentRecursive,
  PageFragment,
  SidebarArticleFragmentRecursive,
} from './fragments'

export const getBreadcrumb = ({
  sidebar,
  activeSidebarItem,
}: {
  sidebar: SidebarProps['data'] | PageFragment['articles']
  activeSidebarItem:
    | SidebarArticleFragmentRecursive
    | ArticleMetaFragmentRecursive
}) => {
  const breadcrumb = sidebar.items.reduce<{
    titles: string[]
    slugs: string[]
  }>(
    (acc, item) => {
      processArticle(item, (article, meta) => {
        if (article._id === activeSidebarItem._id) {
          acc.titles = meta.titlesPath
          acc.slugs = meta.path
        }
      })
      return acc
    },
    { titles: [], slugs: [] }
  )
  return breadcrumb
}

export type SidebarItem =
  | SidebarArticleFragmentRecursive
  | ArticleMetaFragmentRecursive

export function getActiveSidebarItem({
  sidebar,
  activeSlugs,
}: {
  sidebar: SidebarProps['data'] | PageFragment['articles']
  activeSlugs: string[]
}): {
  previous: SidebarItem | null
  item: SidebarItem | null
  next: SidebarItem | null
  path: string[]
} {
  let previous: SidebarItem | null = null
  let current: SidebarItem | null = null
  let next: SidebarItem | null = null
  let currentItems = sidebar.items
  let firstValidItem: SidebarItem | null = null
  let firstValidNext: SidebarItem | null = null

  for (const slug of activeSlugs) {
    const index = currentItems.findIndex((item) => {
      return item._slug === slug
    })
    const item = currentItems[index]
    if (!item) continue
    previous = currentItems[index - 1] ?? previous
    current = item
    next = currentItems[index + 1] ?? null
    currentItems = item.children.items
  }

  let fallbackPath: string[] = []
  const shouldFallbackToFirstValidItem = activeSlugs.length === 0
  if (!current && shouldFallbackToFirstValidItem) {
    sidebar.items.forEach((item) => {
      processArticle(item, (article, { path }) => {
        if (firstValidItem && !firstValidNext) {
          firstValidNext = article
        }
        if (!firstValidItem && article.body?.__typename) {
          firstValidItem = article
          fallbackPath = path
        }
      })
    })
  }

  return {
    previous,
    item: current ?? firstValidItem,
    next: next ?? firstValidNext,
    path: current ? activeSlugs : fallbackPath,
  }
}

/**
 * Recursive function to process every level of nesting
 */
export function processArticle(
  article: SidebarArticleFragmentRecursive | ArticleMetaFragmentRecursive,
  callback: (
    _article: SidebarArticleFragmentRecursive | ArticleMetaFragmentRecursive,
    _meta: Meta
  ) => void,
  meta?: Meta
) {
  meta = meta || { level: 0, path: [], titlesPath: [], index: 0 }
  callback(article, meta)
  // recursively process children
  if (article.children.items && article.children.items.length > 0) {
    article.children.items.forEach((child, index) => {
      processArticle(child, callback, {
        level: meta.level + 1,
        path: [...meta.path, article._slug],
        titlesPath: [...meta.titlesPath, article._title],
        index,
      })
    })
  }
}

type Meta = {
  level: number
  path: string[]
  titlesPath: string[]
  index: number
}
