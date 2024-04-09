import { Article } from "@/app/_components/article";
import {
  ArticleFragment,
  ArticleMetaFragmentRecursive,
  PageFragment,
  getArticleRecursive,
  pageBySlug,
} from "@/basehub-helpers/fragments";
import { Pump } from "@/.basehub/react-pump";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getActiveSidebarItem } from "@/basehub-helpers/sidebar";
import { basehub } from "@/.basehub";

export const generateStaticParams = async (): Promise<
  Array<{ params: { slug: string[] } }>
> => {
  const data = await basehub({ cache: "no-store" }).query({
    pages: { items: PageFragment },
  });
  const result: Array<{ params: { slug: string[] } }> = [];

  /**
   * Recursive function to process every level of nesting
   */
  function processArticle(
    path: string[],
    article: ArticleMetaFragmentRecursive
  ) {
    const updatedPath = [...path, article._slug];
    if (article.body?.__typename) {
      // has body, therefore is linkable and should be added to result
      result.push({ params: { slug: updatedPath } });
    }
    // recursively process children
    if (article.children.items && article.children.items.length > 0) {
      article.children.items.forEach((child) => {
        processArticle(updatedPath, child);
      });
    }
  }

  data.pages.items.map((page) => {
    page.articles.items.forEach((article) => {
      processArticle([page._slug], article);
    });
  });

  return result;
};

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string[] | undefined };
}): Promise<Metadata> => {
  const activePageSlug = params.slug?.[0];
  const data = await basehub().query({ pages: pageBySlug(activePageSlug) });

  const page = data.pages.items[0];
  if (!page) notFound();

  const activeSidebarItem = getActiveSidebarItem({
    sidebar: page.articles,
    activeSlugs: params.slug?.slice(1) ?? [],
  });
  if (!activeSidebarItem) notFound();

  return {
    title: activeSidebarItem._title,
  };
};

export default function ArticlePage({
  params,
}: {
  params: { slug: string[] | undefined };
}) {
  const [activePageSlug, activeArticleSlug, ...path] = params.slug ?? [];

  return (
    <Pump
      queries={[
        {
          pages: {
            __args: {
              first: 1,
              ...(activePageSlug && {
                filter: { _sys_slug: { eq: activePageSlug } },
              }),
            },
            items: {
              _slug: true,
              articles: {
                __args: {
                  first: 1,
                  filter: { _sys_slug: { eq: activeArticleSlug } },
                },
                items: getArticleRecursive({ path }),
              },
            },
          },
        },
      ]}
    >
      {async ([data]) => {
        "use server";
        const articles = data.pages.items[0]?.articles.items[0];
        if (!articles) notFound();

        let edge: undefined | ArticleFragment;
        processArticle(articles, (article) => {
          if (edge) return;
          if (article.children.items.length < 1) {
            if (article.body && "json" in article.body) {
              // found the edge
              edge = article as ArticleFragment;
            }
          }
        });
        if (!edge) notFound();

        return <Article data={edge} />;
      }}
    </Pump>
  );
}

/**
 * Recursive function to process every level of nesting
 */
function processArticle(
  article: ArticleMetaFragmentRecursive,
  callback: (article: ArticleMetaFragmentRecursive) => void
) {
  callback(article);
  // recursively process children
  if (article.children.items && article.children.items.length > 0) {
    article.children.items.forEach((child) => {
      processArticle(child, callback);
    });
  }
}
