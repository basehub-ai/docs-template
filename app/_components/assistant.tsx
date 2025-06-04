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
import { useChat } from '@ai-sdk/react'

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

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    setInput,
    status,
  } = useChat({
    api: 'http://localhost:3000/api/start/docs-assistant',
    initialMessages: [
      {
        id: 'init',
        role: 'assistant',
        content: '👋 Hi! I am your Assistant. Ask me anything!',
        parts: [
          {
            type: 'text',
            text: '👋 Hi! I am your Assistant. Ask me anything!',
          },
        ],
      },
    ],
  })

  const isLoading = status === 'submitted' || status === 'streaming'

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
              <IconButton
                variant="ghost"
                size="2"
                aria-label="New chat"
                onClick={() => {
                  setMessages([
                    {
                      id: 'init',
                      role: 'assistant',
                      content: '👋 Hi! I am your Assistant. Ask me anything!',
                      parts: [
                        {
                          type: 'text',
                          text: '👋 Hi! I am your Assistant. Ask me anything!',
                        },
                      ],
                    },
                  ])
                  setInput('')
                }}
              >
                <PlusIcon />
              </IconButton>
              <IconButton
                variant="ghost"
                size="2"
                aria-label="Past conversations"
                // onClick={...} // Implement as needed
              >
                <CounterClockwiseClockIcon />
              </IconButton>
            </Flex>
          </Flex>
          {/* Chat area */}
          <Box flexGrow="1" px="4" py="3" style={{ overflowY: 'auto' }}>
            <Flex direction="column" gap="3">
              {messages.map((msg, i) => (
                <Box
                  key={msg.id || i}
                  style={{
                    background:
                      msg.role === 'assistant'
                        ? 'var(--gray-a2)'
                        : 'var(--accent-a3)',
                    borderRadius: 8,
                    padding: 8,
                    marginLeft: msg.role === 'assistant' ? 0 : 32,
                    alignSelf:
                      msg.role === 'assistant' ? 'flex-start' : 'flex-end',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  <Text size="2">
                    {msg.parts.map((part, index) => {
                      if (part.type === 'text') {
                        return <div key={index}>{part.text}</div>
                      }
                      return null
                    })}
                  </Text>
                </Box>
              ))}
              {status === 'submitted' && (
                <Box
                  style={{
                    background: 'var(--gray-a3)',
                    borderRadius: 8,
                    padding: 8,
                    marginLeft: 0,
                  }}
                >
                  <Text size="2">Thinking...</Text>
                </Box>
              )}
            </Flex>
          </Box>
          {/* Suggested questions */}
          <Flex gap="2" wrap="wrap" px="4" pb="2">
            <Button
              variant="soft"
              size="1"
              onClick={() => setInput('What is this app?')}
            >
              What is this app?
            </Button>
            <Button
              variant="soft"
              size="1"
              onClick={() => setInput('How do I add data?')}
            >
              How do I add data?
            </Button>
            <Button
              variant="soft"
              size="1"
              onClick={() => setInput('Is there a free plan?')}
            >
              Is there a free plan?
            </Button>
            <Button
              variant="soft"
              size="1"
              onClick={() => setInput('What are AI actions?')}
            >
              What are AI actions?
            </Button>
          </Flex>
          {/* Message input */}
          <Flex align="center" gap="1" px="4" py="3" asChild>
            <form style={{ width: '100%' }} onSubmit={handleSubmit}>
              <TextField.Root
                size="2"
                style={{ flex: 1, width: '100%' }}
                placeholder="Message..."
                value={input}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <IconButton
                type="submit"
                size="2"
                variant="solid"
                ml="2"
                aria-label="Send"
                disabled={isLoading || !input.trim()}
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
