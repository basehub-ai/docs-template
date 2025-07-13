import { basehub } from 'basehub'
import { search } from 'basehub/search'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export const POST = async (request: Request) => {
  const { query, page = 1, perPage = 10 } = await request.json()

  const {
    _componentInstances: {
      article: { _searchKey },
    },
  } = await basehub().query({
    _componentInstances: { article: { _searchKey: true } },
  })

  const result = await search(_searchKey, query, {
    queryBy: ['_title', 'body', 'excerpt'],
    page,
    perPage,
    // ...(selectedCategoryId !== '__all__' && {
    //   filterBy: `_idPath:${selectedCategoryId}*`,
    // }),
  })

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  })
}

export const OPTIONS = () => {
  return new Response(null, { status: 200, headers: { ...corsHeaders } })
}
