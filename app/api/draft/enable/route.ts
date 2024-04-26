import { basehub } from '@/.basehub'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')

  if (secret !== 'TODO_SECRET') {
    return new Response('Invalid token', { status: 401 })
  }

  draftMode().enable()

  let redirectTo = '/'
  const next = searchParams.get('next')
  const articleId = searchParams.get('article')
  if (next) {
    // prevent open redirect attacks
    const parsedNext = new URL(next, request.url)
    redirectTo = parsedNext.pathname + parsedNext.search + parsedNext.hash
  } else if (articleId) {
    const data = await basehub({ draft: true }).query({
      _componentInstances: {
        article: {
          __args: { first: 1, filter: { _sys_id: { eq: articleId } } },
          items: {
            _slugPath: true,
          },
        },
      },
    })

    const article = data._componentInstances.article.items[0]
    if (article) {
      // _slugPath will have something like root/pages/<category>/articles/<page>/children/<page>/children/<page>...
      // remove root/pages and then filter out every other part
      redirectTo =
        '/' +
        article._slugPath
          .replace('root/pages/', '')
          .split('/')
          .filter((_part, index) => {
            return index % 2 === 0
          })
          .join('/')
    }
  }

  redirect(redirectTo)
}
