export function getAritcleSlugFromSlugPath(
  slugPath: string,
  isInFirstCategory: boolean
) {
  // article _slugPath will have something like root pages <category> articles <page> children <page> children <page>...
  // remove root/pages and then filter out every other part
  let slug =
    '/' +
    slugPath
      .replace('root pages ', '')
      .split(' ')
      .filter((_part, index) => {
        return index % 2 === 0
      })
      .join('/')

  if (isInFirstCategory) {
    // remove the first segment
    slug = '/' + slug.split('/').slice(2).join('/')
  }

  return slug
}
