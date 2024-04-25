'use client'

export const DraftModeHeader = () => {
  return (
    <div>
      <span>You are in draft mode.</span>{' '}
      <button
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
    </div>
  )
}
