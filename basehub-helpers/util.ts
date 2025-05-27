export function getArticleSlugFromSlugPath(
  slugPath: string,
  isInFirstCategory: boolean
) {
  // article _slugPath will have something like root pages <category> articles <page> children <page> children <page>...
  // remove root/pages and then filter out every other part
  let slug =
    '/' +
    slugPath
      .replace('root pages ', '')
      .trim()
      .split(' ')
      .filter((part) => {
        return !['pages','articles', 'children'].includes(part)
      })
      .join('/')

  if (isInFirstCategory) {
    // remove the first segment
    slug = '/' + slug.split('/').slice(2).join('/')
  }

  return slug
}
