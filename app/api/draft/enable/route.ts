import { basehub } from '@/.basehub'
import { PageFragment } from '@/basehub-helpers/fragments'
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
    // we'll need to get the sidebar so we resolve the article path
    const data = await basehub({ cache: 'no-store' }).query({
      pages: {
        items: PageFragment,
      },
    })

    // we'll need to iterate recursively, building each path (as we do in generateStaticParams by the way) and use the path of the requested article.
    for (const page of data.pages.items) {
    }
  }

  redirect(redirectTo)
}
