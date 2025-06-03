'use client'
import * as React from 'react'
import {
  Popover,
  Button,
  Flex,
  Box,
  Text,
  TextField,
  IconButton,
} from '@radix-ui/themes'
import {
  PlusIcon,
  CounterClockwiseClockIcon,
  PaperPlaneIcon,
} from '@radix-ui/react-icons'
import { StartIcon } from './icons'

export const Assistant = () => {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('chat') === 'true') {
        setOpen(true)
      }
    }
  }, [])

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger>
        <IconButton
          variant="solid"
          size="3"
          aria-label={open ? 'Close chat' : 'Open chat'}
          style={{ position: 'fixed', bottom: 16, right: 16 }}
        >
          <StartIcon height={22} width={22} />
        </IconButton>
      </Popover.Trigger>
      <Popover.Content
        side="bottom"
        align="end"
        style={{ width: 350, maxWidth: '90vw', padding: 0 }}
      >
        <Flex direction="column" style={{ height: 480 }}>
          {/* Top bar */}
          <Flex
            align="center"
            justify="between"
            px="4"
            py="2"
            style={{ borderBottom: '1px solid var(--gray-a3)' }}
          >
            <Text weight="bold">START &ndash; BaseHub AI Agent</Text>
            <Flex gap="2">
              <IconButton variant="ghost" size="2" aria-label="New chat">
                <PlusIcon />
              </IconButton>
              <IconButton
                variant="ghost"
                size="2"
                aria-label="Past conversations"
              >
                <CounterClockwiseClockIcon />
              </IconButton>
            </Flex>
          </Flex>
          {/* Chat area */}
          <Box flexGrow="1" px="4" py="3" style={{ overflowY: 'auto' }}>
            <Flex direction="column" gap="3">
              <Box
                style={{
                  background: 'var(--gray-a2)',
                  borderRadius: 8,
                  padding: 8,
                }}
              >
                <Text size="2">
                  👋 Hi! I am your Assistant. Ask me anything!
                </Text>
              </Box>
              <Box
                style={{
                  background: 'var(--gray-a3)',
                  borderRadius: 8,
                  padding: 8,
                  marginLeft: 32,
                }}
              >
                <Text size="2">
                  By the way, you can create an agent like me for your website!
                  😯
                </Text>
              </Box>
            </Flex>
          </Box>
          {/* Suggested questions */}
          <Flex gap="2" wrap="wrap" px="4" pb="2">
            <Button variant="soft" size="1">
              What is this app?
            </Button>
            <Button variant="soft" size="1">
              How do I add data?
            </Button>
            <Button variant="soft" size="1">
              Is there a free plan?
            </Button>
            <Button variant="soft" size="1">
              What are AI actions?
            </Button>
          </Flex>
          {/* Message input */}
          <Flex align="center" gap="1" px="4" py="3" asChild>
            <form style={{ width: '100%' }}>
              <TextField.Root
                size="2"
                style={{ flex: 1, width: '100%' }}
                placeholder="Message..."
              />
              <IconButton
                type="submit"
                size="2"
                variant="solid"
                ml="2"
                aria-label="Send"
              >
                <PaperPlaneIcon />
              </IconButton>
            </form>
          </Flex>
        </Flex>
      </Popover.Content>
    </Popover.Root>
  )
}
