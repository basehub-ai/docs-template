export function getAritcleSlugFromSlugPath(slugPath: string) {
  // article _slugPath will have something like root pages <category> articles <page> children <page> children <page>...
  // remove root/pages and then filter out every other part
  return (
    '/' +
    slugPath
      .replace('root pages ', '')
      .split(' ')
      .filter((_part, index) => {
        return index % 2 === 0
      })
      .join('/')
  )
}
