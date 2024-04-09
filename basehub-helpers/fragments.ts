import { fragmentOn, fragmentOnRecursiveCollection } from "@/.basehub";

/* -------------------------------------------------------------------------------------------------
 * Article
 * -----------------------------------------------------------------------------------------------*/

export const ArticleBodyFragment = fragmentOn("BodyRichText", {
  content: true,
  blocks: {
    __typename: true,
    on_CalloutComponent: { _id: true },
    on_HeadingWithIconComponent: { _id: true },
  },
});

export const ArticleFragment = fragmentOn("ArticleComponent", {
  _id: true,
  _title: true,
  _slug: true,
  _sys: {
    lastModifiedAt: true,
  },
  titleSidebarOverride: true,
  body: {
    __typename: true,
    readingTime: true,
    json: ArticleBodyFragment,
  },
});

export type ArticleFragment = fragmentOn.infer<typeof ArticleFragment>;

export const ArticleFragmentRecursive = fragmentOnRecursiveCollection(
  "ArticleComponent",
  ArticleFragment,
  {
    levels: 5,
    recursiveKey: "children",
  }
);

export type ArticleFragmentRecursive = fragmentOn.infer<
  typeof ArticleFragmentRecursive
>;

/* -------------------------------------------------------------------------------------------------
 * Page
 * -----------------------------------------------------------------------------------------------*/

export const PageFragment = fragmentOn("PagesItem", {
  _slug: true,
  articles: { items: ArticleFragmentRecursive },
});

export type PageFragment = fragmentOn.infer<typeof PageFragment>;

export const pageBySlug = (slug: string | undefined) => {
  return fragmentOn("Pages", {
    __args: {
      first: 1,
      ...(slug && {
        filter: { _sys_slug: { eq: slug } },
      }),
    },
    items: PageFragment,
  });
};
