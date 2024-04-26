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

export function getActiveSidebarItem({
  sidebar,
  activeSlugs,
}: {
  sidebar: SidebarProps['data'] | PageFragment['articles']
  activeSlugs: string[]
}): {
  item: SidebarArticleFragmentRecursive | ArticleMetaFragmentRecursive | null
  path: string[]
} {
  let current:
    | SidebarArticleFragmentRecursive
    | ArticleMetaFragmentRecursive
    | null = null
  let currentItems = sidebar.items
  let firstValidItem:
    | SidebarArticleFragmentRecursive
    | ArticleMetaFragmentRecursive
    | null = null

  for (const slug of activeSlugs) {
    const item = currentItems.find((item) => {
      return item._slug === slug
    })
    if (!item) continue
    current = item
    currentItems = item.children.items
  }

  let fallbackPath: string[] = []
  const shouldFallbackToFirstValidItem = activeSlugs.length === 0
  if (!current && shouldFallbackToFirstValidItem) {
    sidebar.items.forEach((item) => {
      processArticle(item, (article, { path }) => {
        if (!firstValidItem && article.body?.__typename) {
          firstValidItem = article
          fallbackPath = path
        }
      })
    })
  }

  return {
    item: current ?? firstValidItem,
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
