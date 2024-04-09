import { SidebarProps } from "@/app/_components/sidebar";
import { ArticleFragmentRecursive } from "./fragments";

export function getActiveSidebarItem({
  sidebar,
  activeSlugs,
}: {
  sidebar: SidebarProps["data"];
  activeSlugs: string[];
}): ArticleFragmentRecursive | null {
  let current: ArticleFragmentRecursive | null = null;
  let currentItems = sidebar.items;
  let firstValidItem: ArticleFragmentRecursive | null = null;

  for (const slug of activeSlugs) {
    const item = currentItems.find((item) => {
      return item._slug === slug;
    });
    if (!item) continue;
    current = item;
    currentItems = item.children.items;
  }

  const shouldFallbackToFirstValidItem = activeSlugs.length === 0;
  if (!current && shouldFallbackToFirstValidItem) {
    sidebar.items.forEach((item) => {
      processArticle(item, (article) => {
        if (!firstValidItem && article.body?.json.content) {
          firstValidItem = article;
        }
      });
    });
  }

  return current ?? firstValidItem;
}

/**
 * Recursive function to process every level of nesting
 */
export function processArticle(
  article: ArticleFragmentRecursive,
  callback: (
    article: ArticleFragmentRecursive,
    meta: { level: number; path: string[]; index: number }
  ) => void,
  meta?: { level: number; path: string[]; index: number }
) {
  meta = meta || { level: 0, path: [], index: 0 };
  callback(article, meta);
  // recursively process children
  if (article.children.items && article.children.items.length > 0) {
    article.children.items.forEach((child, index) => {
      processArticle(child, callback, {
        level: meta.level + 1,
        path: [...meta.path, article._slug],
        index,
      });
    });
  }
}
