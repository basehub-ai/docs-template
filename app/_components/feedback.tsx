'use client'
import {
  Button,
  Flex,
  IconButton,
  Popover,
  Text,
  TextArea,
} from '@radix-ui/themes'
import * as React from 'react'
import { ThumbsUp } from './icons/thumbs-up'
import { ThumbsDown } from './icons/thumns-down'
import { parseFormData, sendEvent, EventSchema } from 'basehub/events'
import { Feedback as FeedbackType } from '@/.basehub/schema'
import { CheckCircledIcon } from '@radix-ui/react-icons'
import { usePathname } from 'next/navigation'

export const Feedback = ({
  ingestKey,
  schema,
}: {
  ingestKey: FeedbackType['submissions']['ingestKey']
  schema: FeedbackType['submissions']['schema']
}) => {
  const pathname = usePathname()

  const [intent, setIntent] = React.useState<
    EventSchema<typeof ingestKey>['intent'] | null
  >(null)
  const [submitting, setSubmitting] = React.useState(false)
  const [shouldThank, setShouldThank] = React.useState(false)
  const formRef = React.useRef<HTMLFormElement>(null)

  React.useEffect(() => {
    if (!shouldThank) return
    const timeout = window.setTimeout(() => {
      formRef.current?.reset()
      setSubmitting(false)
    }, 300)

    return () => window.clearTimeout(timeout)
  }, [shouldThank])

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault()
    const form = formRef.current
    if (!intent || !form || submitting) return
    const formData = new FormData(form)
    formData.set('intent', intent)
    formData.set('path', pathname)

    const parsed = parseFormData(ingestKey, schema, formData)
    if (!parsed.success) {
      console.error(parsed.errors)
      setShouldThank(true)
      return
    }

    setSubmitting(true)
    try {
      await sendEvent(ingestKey, parsed.data)
    } catch (e) {
      console.error(e)
    }
    setShouldThank(true)
  }

  return (
    <Flex gap="2" mr="4" position="relative" style={{ zIndex: 10 }}>
      <IconButton
        variant="ghost"
        mx="0 !important"
        color="gray"
        type="button"
        onClick={() => setIntent('Negative')}
        aria-label="Bad article"
      >
        <ThumbsDown
          height={14}
          width={14}
          fill={intent === 'Negative' ? 'var(--accent-12)' : 'none'}
        />
      </IconButton>
      <IconButton
        variant="ghost"
        mx="0 !important"
        type="button"
        color="gray"
        onClick={() => setIntent('Positive')}
        aria-label="Good article."
      >
        <ThumbsUp
          height={14}
          width={14}
          fill={intent === 'Positive' ? 'var(--accent-12)' : 'none'}
        />
      </IconButton>

      <Popover.Root
        open={!!intent}
        onOpenChange={(v) => {
          if (!v) {
            setIntent(null)
            setShouldThank(false)
          }
        }}
      >
        <Popover.Anchor
          style={{
            position: 'absolute',
            right: 0,
            top: '100%',
          }}
        />

        <Popover.Content align="end" size="1" asChild>
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            style={{ position: 'relative' }}
          >
            <Flex
              direction="column"
              gap="2"
              style={{
                opacity: shouldThank ? 0 : 1,
                pointerEvents: shouldThank ? 'none' : 'auto',
                transition: 'opacity 0.3s ease-in-out',
              }}
              aria-hidden={shouldThank}
            >
              <TextArea
                name="message"
                size="1"
                placeholder="Feedback"
                required
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.metaKey) {
                    e.preventDefault()
                    handleSubmit()
                  }
                }}
              />
              <Flex justify="end" gap="2">
                <Button type="button" size="1" variant="soft">
                  Cancel
                </Button>
                <Button type="submit" size="1" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit'}
                </Button>
              </Flex>
            </Flex>
            <Flex
              direction="column"
              align="center"
              justify="center"
              gap="1"
              width="100%"
              height="100%"
              style={{
                opacity: shouldThank ? 1 : 0,
                pointerEvents: shouldThank ? 'auto' : 'none',
                transform: shouldThank ? 'scale(1)' : 'scale(0.9)',
                transition:
                  'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
                transitionDelay: shouldThank ? '0.15s' : '0s',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
              aria-hidden={!shouldThank}
            >
              <Text color="green" style={{ display: 'flex' }}>
                <CheckCircledIcon width={24} height={24} />
              </Text>
              <Text align="center" wrap="pretty" size="2">
                Feedback sent,
                <br />
                thank you!
              </Text>
            </Flex>
          </form>
        </Popover.Content>
      </Popover.Root>
    </Flex>
  )
}
