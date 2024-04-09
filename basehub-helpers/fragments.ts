import { fragmentOn } from "@/.basehub";
import { CalloutFragment } from "@/app/_components/article/callout";
import { HeadingWithIconFragment } from "@/app/_components/article/heading-with-icon";

/* -------------------------------------------------------------------------------------------------
 * Helpers
 * -----------------------------------------------------------------------------------------------*/

type RecursiveCollection<T, Key extends string> = T & {
  [key in Key]?: { items?: RecursiveCollection<T, Key> };
};

/* -------------------------------------------------------------------------------------------------
 * Article
 * -----------------------------------------------------------------------------------------------*/

export const ArticleBodyFragment = fragmentOn("BodyRichText", {
  content: true,
  blocks: {
    __typename: true,
    on_CalloutComponent: CalloutFragment,
    on_HeadingWithIconComponent: HeadingWithIconFragment,
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
    ...ArticleFragment,
  } as RecursiveCollection<typeof ArticleFragment, "children">;
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

export type ArticleFragmentRecursive = fragmentOn.infer<
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
