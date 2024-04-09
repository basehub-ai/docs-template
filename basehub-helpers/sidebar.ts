import { SidebarProps } from "@/app/_components/sidebar";
import { ArticleMetaFragmentRecursive } from "./fragments";

export function getActiveSidebarItem({
  sidebar,
  activeSlugs,
}: {
  sidebar: SidebarProps["data"];
  activeSlugs: string[];
}): ArticleMetaFragmentRecursive | null {
  let current: ArticleMetaFragmentRecursive | null = null;
  let currentItems = sidebar.items;
  for (const slug of activeSlugs) {
    const item = currentItems.find((item) => item._slug === slug);
    if (!item) return null;
    current = item;
    currentItems = item.children.items;
  }
  return current;
}

/**
 * Recursive function to process every level of nesting
 */
export function processArticle(
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
