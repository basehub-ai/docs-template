import { draftMode } from 'next/headers'

export async function POST() {
  draftMode().disable()
  return new Response('Draft mode is disabled')
}
