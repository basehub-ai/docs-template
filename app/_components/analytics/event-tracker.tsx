'use client'


'use client'
import { Slot } from '@radix-ui/react-slot'

import { sendEvent } from 'basehub/analytics'

export const EventTracker = ({
  children,
  eventName = 'click',
  _analyticsKey,
  metadata,
}: {
  children: React.ReactNode
  eventName?: string
  _analyticsKey: string
  metadata?: Record<string, any>
}) => {
  return (
    <Slot
      onClick={() =>
        sendEvent({
          name: eventName,
          _analyticsKey,
          metadata,
        })
      }
    >
      {children}
    </Slot>
  )
}
