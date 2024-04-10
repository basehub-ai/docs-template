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
  if (next) {
    // prevent open redirect attacks
    const parsedNext = new URL(next, request.url)
    redirectTo = parsedNext.pathname + parsedNext.search + parsedNext.hash
  }

  redirect(redirectTo)
}
