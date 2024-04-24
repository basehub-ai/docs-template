'use client'

import { VercelToolbar } from '@vercel/toolbar/next'

export const DraftModeHeader = () => {
  return (
    <div className="text-sm">
      <span>You are in draft mode.</span>{' '}
      <button
        className="underline"
        onClick={async () => {
          const res = await fetch('/api/draft/disable', { method: 'POST' })
          if (res.status === 200) {
            location.reload()
          }
        }}
      >
        Exit
      </button>
      .
      <VercelToolbar />
    </div>
  )
}
