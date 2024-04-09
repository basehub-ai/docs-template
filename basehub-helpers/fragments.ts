import { fragmentOn } from "@/.basehub";
import {
  ArticleComponent,
  ArticleComponentFilterInput,
} from "@/.basehub/schema";

/* -------------------------------------------------------------------------------------------------
 * Helpers
 * -----------------------------------------------------------------------------------------------*/

type RecursiveCollection<T, Key extends string> = T & {
  [key in Key]?: { items?: RecursiveCollection<T, Key> };
};

/* -------------------------------------------------------------------------------------------------
 * Article
 * -----------------------------------------------------------------------------------------------*/

export const ArticleMetaFragment = fragmentOn("ArticleComponent", {
  _id: true,
  _title: true,
  _slug: true,
  _sys: {
    lastModifiedAt: true,
  },
  titleSidebarOverride: true,
  body: { __typename: true },
});

export const ArticleBodyFragment = fragmentOn("BodyRichText", {
  content: true,
  blocks: {
    __typename: true,
    on_CalloutComponent: { _id: true },
    on_HeadingWithIconComponent: { _id: true },
  },
});

export const ArticleFragment = fragmentOn("ArticleComponent", {
  ...ArticleMetaFragment,
  body: {
    __typename: true,
    readingTime: true,
    json: ArticleBodyFragment,
  },
});

export type ArticleFragment = fragmentOn.infer<typeof ArticleFragment>;
export type ArticleMetaFragment = fragmentOn.infer<typeof ArticleMetaFragment>;

/**
 * GraphQL doesn't support recursive fragments so we'll manually do it up to a certain level.
 */
export function getArticleRecursive(options?: {
  levels?: number;
  path?: string[];
  includeBody?: boolean;
}) {
  let { levels = 5, path, includeBody } = options || {};
  includeBody = includeBody || path?.length === 0; // is edge

  let current = {
    ...(includeBody ? ArticleFragment : ArticleMetaFragment),
  } as RecursiveCollection<
    typeof ArticleMetaFragment | typeof ArticleFragment,
    "children"
  >;
  const currentSlug = path?.[0] || null;
  if (levels > 0) {
    const nextPath = path?.slice(1);
    current.children = {
      ...(currentSlug
        ? {
            __args: { first: 1, filter: { _sys_slug: { eq: currentSlug } } },
          }
        : {}),
      items: getArticleRecursive({
        levels: levels - 1,
        path: nextPath,
        includeBody,
      }),
    };
  }
  return current;
}

export type ArticleMetaFragmentRecursive = fragmentOn.infer<
  ReturnType<typeof getArticleRecursive>
>;

/* -------------------------------------------------------------------------------------------------
 * Page
 * -----------------------------------------------------------------------------------------------*/

export const PageFragment = fragmentOn("PagesItem", {
  _slug: true,
  articles: { items: getArticleRecursive() },
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
