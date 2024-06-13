'use client'
import { Flex, IconButton } from '@radix-ui/themes'
import * as React from 'react'
import { ThumbsUp } from '../icons/thumbs-up'
import { ThumbsDown } from '../icons/thumns-down'
import { sendEvent } from 'basehub/analytics'

export const Feedback = ({
  analyticsKey: _analyticsKey,
}: {
  analyticsKey: string
}) => {
  const [bothFeedbackSent, setBothFeedbackSent] = React.useState(false)
  const [sentFeedback, setSentFeedback] = React.useState<
    'positive' | 'negative' | null
  >(null)

  const handleFeedback = (e: React.MouseEvent, type: 'positive' | 'negative') => {
    e.preventDefault()
    e.stopPropagation()
    if (sentFeedback === type) return
    // If the user has already given feedback twice, stop sending the event.
    !bothFeedbackSent && sendEvent({ _analyticsKey, name: `feedback:${type}` })
    if (sentFeedback) setBothFeedbackSent(true)
    setSentFeedback(type)
    window.localStorage.setItem(`feedback:${_analyticsKey}`, type)
  }

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const previousFeedback = window.localStorage.getItem(
      `feedback:${_analyticsKey}`
    ) as 'positive' | 'negative' | null

    setSentFeedback(previousFeedback)
  }, [_analyticsKey])

  return (
        <Flex gap="2" mr='4' position='relative' style={{ zIndex: 10 }}>
          <IconButton
            variant="ghost"
            mx="0 !important"
            color="gray"
            type='button'
            onClick={(e) => handleFeedback(e, 'negative')}
            aria-label="No, it did not."
          >
            <ThumbsDown
              height={14}
              width={14}
              fill={sentFeedback === 'negative' ? 'var(--accent-12)' : 'none'}
            />
          </IconButton>
          <IconButton
            variant="ghost"
            mx="0 !important"
            type='button'
            color="gray"
            onClick={(e) => handleFeedback(e, 'positive')}
            aria-label="Yes, the problem is solved."
          >
            <ThumbsUp
              height={14}
              width={14}
              fill={sentFeedback === 'positive' ? 'var(--accent-12)' : 'none'}
            />
          </IconButton>
        </Flex>


  )
}