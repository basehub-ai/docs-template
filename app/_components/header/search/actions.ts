'use server'

import { basehub } from 'basehub'

export const searchNeue = async (query: string) => {
  const result = await basehub().query({
    _componentInstances: {
      article: {
        __args: {
          search: {
            q: query,
            by: ['_title', 'body', 'excerpt'],
          },
        },
        items: {
          _id: true,
          _slugPath: true,
          _title: true,
          _highlight: {
            by: true,
            snippet: true,
          },
        },
      },
    },
  })

  console.log(result)

  return result
}
