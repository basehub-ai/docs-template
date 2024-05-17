import { fragmentOn, fragmentOnRecursiveCollection } from '@/.basehub'
import { AccordionGroupFragment } from '@/app/_components/article/accordion'
import { CalloutFragment } from '@/app/_components/article/callout'
import { CardsGridFragment } from '@/app/_components/article/cards-grid'
import {
  CodeGroupFragment,
  CodeSnippetFragmentRecursive,
} from '@/app/_components/article/code-snippet'
import { StepperFragment } from '@/app/_components/article/stepper'

/* -------------------------------------------------------------------------------------------------
 * Article
 * -----------------------------------------------------------------------------------------------*/

export const ArticleMetaFragment = fragmentOn('ArticleComponent', {
  _id: true,
  _title: true,
  _slug: true,
  _sys: { lastModifiedAt: true },
  excerpt: true,
  titleSidebarOverride: true,
  body: { __typename: true },
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
  },
})

export type ArticleBodyFragment = fragmentOn.infer<typeof ArticleBodyFragment>

export const ArticleFragment = fragmentOn('ArticleComponent', {
  ...ArticleMetaFragment,
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
})

export const ArticlePlainTextFragment = fragmentOn('ArticleComponent', {
  ...ArticleMetaFragment,
  body: { plainText: true },
})

export type ArticleFragment = fragmentOn.infer<typeof ArticleFragment>

/* -------------------------------------------------------------------------------------------------
 * Page
 * -----------------------------------------------------------------------------------------------*/

export const PageFragment = fragmentOn('PagesItem', {
  _id: true,
  _slug: true,
  _title: true,
  _sys: { lastModifiedAt: true },
  articles: { items: ArticleMetaFragmentRecursive },
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
