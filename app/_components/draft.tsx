'use client'

import { Button, Flex, Separator, Text } from '@radix-ui/themes'

export const DraftModeHeader = () => {
  return (
    <Flex wrap="nowrap" align="center">
      <Separator orientation="vertical" mr="3" />
      <Text as="span" size="2" color="gray" mr="3">
        You are in draft mode
      </Text>
      &nbsp;
      <Button
        size="1"
        variant="surface"
        onClick={async () => {
          const res = await fetch('/api/draft/disable', { method: 'POST' })
          if (res.status === 200) {
            location.reload()
          }
        }}
      >
        Exit
      </Button>
    </Flex>
  )
}
