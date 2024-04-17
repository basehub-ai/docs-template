import { fragmentOn, fragmentOnRecursiveCollection } from '@/.basehub'
import { ArticleBodyFragment } from '@/app/_components/article'

/* -------------------------------------------------------------------------------------------------
 * Article
 * -----------------------------------------------------------------------------------------------*/

export const ArticleMetaFragment = fragmentOn('ArticleComponent', {
  _id: true,
  _title: true,
  _slug: true,
  _sys: {
    lastModifiedAt: true,
  },
  titleSidebarOverride: true,
  body: {
    __typename: true,
  },
})

export type ArticleMetaFragment = fragmentOn.infer<typeof ArticleMetaFragment>

export const ArticleFragment = fragmentOn('ArticleComponent', {
  ...ArticleMetaFragment,
  body: {
    ...ArticleMetaFragment.body,
    readingTime: true,
    json: ArticleBodyFragment,
  },
})

export type ArticleFragment = fragmentOn.infer<typeof ArticleFragment>

export const ArticleMetaFragmentRecursive = fragmentOnRecursiveCollection(
  'ArticleComponent',
  ArticleMetaFragment,
  { levels: 5, recursiveKey: 'children' }
)

export type ArticleMetaFragmentRecursive = fragmentOn.infer<
  typeof ArticleMetaFragmentRecursive
>

/* -------------------------------------------------------------------------------------------------
 * Page
 * -----------------------------------------------------------------------------------------------*/

export const PageFragment = fragmentOn('PagesItem', {
  _id: true,
  _slug: true,
  articles: { items: ArticleMetaFragmentRecursive },
})

export type PageFragment = fragmentOn.infer<typeof PageFragment>

export const pageBySlug = (slug: string | undefined) => {
  return fragmentOn('Pages', {
    __args: {
      first: 1,
      ...(slug && {
        filter: { _sys_slug: { eq: slug } },
      }),
    },
    items: PageFragment,
  })
}

/* -------------------------------------------------------------------------------------------------
 * Sidebar
 * -----------------------------------------------------------------------------------------------*/

const SidebarArticleFragment = fragmentOn('ArticleComponent', {
  _id: true,
  _slug: true,
  __typename: true,
  _title: true,
  titleSidebarOverride: true,
  body: { __typename: true },
})

export type SidebarArticleFragment = fragmentOn.infer<
  typeof SidebarArticleFragment
>

export const SidebarArticleFragmentRecursive = fragmentOnRecursiveCollection(
  'ArticleComponent',
  SidebarArticleFragment,
  { levels: 5, recursiveKey: 'children' }
)

export type SidebarArticleFragmentRecursive = fragmentOn.infer<
  typeof SidebarArticleFragmentRecursive
>

export const SidebarFragment = fragmentOn('Pages', {
  items: {
    _id: true,
    _title: true,
    _slug: true,
    articles: { items: SidebarArticleFragmentRecursive },
  },
})

export type SidebarFragment = fragmentOn.infer<typeof SidebarFragment>
