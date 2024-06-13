'use client'
import * as React from 'react'
import { sendEvent } from 'basehub/analytics'

export const PageView = ({ _analyticsKey }: { _analyticsKey: string }) => {
  // On mount, send the event
  React.useEffect(() => {
    sendEvent({ _analyticsKey, name: 'view' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
