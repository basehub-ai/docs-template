import { fragmentOn, fragmentOnRecursiveCollection } from 'basehub'
import {
  ArticleLinkFragment,
  SidebarOverridesFragment,
} from '@/app/_components/article-link/fragment'
import { AccordionGroupFragment } from '@/app/_components/article/accordion/fragment'
import { CalloutFragment } from '@/app/_components/article/callout-fragment'
import { CardsGridFragment } from '@/app/_components/article/cards-grid-fragment'
import {
  CodeGroupFragment,
  CodeSnippetFragmentRecursive,
} from '@/app/_components/article/code-snippet/fragment'
import { IFrameFragment } from '@/app/_components/article/iframe/fragment'
import { StepperFragment } from '@/app/_components/article/stepper/fragment'

/* -------------------------------------------------------------------------------------------------
 * Article
 * -----------------------------------------------------------------------------------------------*/

export const ArticleMetaFragment = fragmentOn('ArticleComponent', {
  _id: true,
  _title: true,
  _slug: true,
  _sys: { lastModifiedAt: true },
  excerpt: true,
  sidebarOverrides: SidebarOverridesFragment,
  body: { __typename: true },
  ogImage: { url: true },
})

export type ArticleMetaFragment = fragmentOn.infer<typeof ArticleMetaFragment>

export const ArticleMetaFragmentRecursive = fragmentOnRecursiveCollection(
  'ArticleComponent',
  ArticleMetaFragment,
  { levels: 5, recursiveKey: 'children' }
)

export type ArticleMetaFragmentRecursive = fragmentOn.infer<
  typeof ArticleMetaFragmentRecursive
>

export const ArticleSlugFragmentRecursive = fragmentOnRecursiveCollection(
  'ArticleComponent',
  { _slug: true },
  { levels: 5, recursiveKey: 'children' }
)

export type ArticleSlugFragment = fragmentOn.infer<
  typeof ArticleSlugFragmentRecursive
>

export const ArticleBodyFragment = fragmentOn('BodyRichText', {
  content: true,
  toc: true,
  blocks: {
    __typename: true,
    on_CalloutComponent: CalloutFragment,
    on_CardsGridComponent: CardsGridFragment,
    on_AccordionGroupComponent: AccordionGroupFragment,
    on_StepperComponent: StepperFragment,
    on_CodeGroupComponent: CodeGroupFragment,
    on_CodeSnippetComponent: CodeSnippetFragmentRecursive,
    on_ArticleLinkComponent: ArticleLinkFragment,
    on_IFrameComponent: IFrameFragment,
  },
})

export type ArticleBodyFragment = fragmentOn.infer<typeof ArticleBodyFragment>

export const ArticleFragment = fragmentOn('ArticleComponent', {
  ...ArticleMetaFragment,
  _dashboardUrl: true,
  children: {
    items: {
      _title: true,
      _slug: true,
      _id: true,
      excerpt: true,
      body: { __typename: true },
    },
  },
  body: {
    ...ArticleMetaFragment.body,
    readingTime: true,
    json: ArticleBodyFragment,
  },
  fullBleed: true,
})

export const ArticlePlainTextFragment = fragmentOn('ArticleComponent', {
  ...ArticleMetaFragment,
  body: { plainText: true },
})

export type ArticleFragment = fragmentOn.infer<typeof ArticleFragment>

/* -------------------------------------------------------------------------------------------------
 * Page
 * -----------------------------------------------------------------------------------------------*/

export const PageMetaFragment = fragmentOn('PagesItem', {
  _id: true,
  _slug: true,
  _title: true,
  articles: {
    __args: { first: 1 },
    items: ArticleSlugFragmentRecursive,
  },
})

export type PageMetaFragment = fragmentOn.infer<typeof PageMetaFragment>

export const PageFragment = fragmentOn('PagesItem', {
  ...PageMetaFragment,
  _dashboardUrl: true,
  articles: { items: ArticleMetaFragmentRecursive },
  _sys: { lastModifiedAt: true },
  ogImage: { url: true },
  openApiSpec: { enabled: true, url: true },
})

export type PageFragment = fragmentOn.infer<typeof PageFragment>

export const pageBySlug = (slug: string | undefined) => {
  return fragmentOn('Pages', {
    __args: {
      first: 1,
      ...(slug && { filter: { _sys_slug: { eq: slug } } }),
    },
    items: PageFragment,
  })
}

/* -------------------------------------------------------------------------------------------------
 * Sidebar
 * -----------------------------------------------------------------------------------------------*/

export const SidebarFragment = fragmentOn('Pages', {
  items: {
    _id: true,
    _title: true,
    _slug: true,
    articles: { items: ArticleMetaFragmentRecursive },
  },
})

export type SidebarFragment = fragmentOn.infer<typeof SidebarFragment>
