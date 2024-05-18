'use client'

import * as React from 'react'
import { Flex, Tabs } from '@radix-ui/themes'
import { CopyButton, useCodeBlock } from './controller'

import s from './code-snippet.module.scss'

export const CodeGroupHeader = () => {
  const highligterRef = React.useRef<HTMLDivElement>(null)
  const { activeSnippet, snippets, selectSnippet } = useCodeBlock()

  React.useEffect(() => {
    if (!highligterRef.current) return

    const activeButton = highligterRef.current.parentElement?.querySelector(
      '[data-active="true"]'
    ) as HTMLButtonElement | null

    if (activeButton) {
      const activeButtonComputedStyles = window.getComputedStyle(activeButton)
      highligterRef.current.style.left = `calc(${activeButton.offsetLeft}px + ${activeButtonComputedStyles.paddingLeft})`
      highligterRef.current.style.width = `calc(${activeButton.offsetWidth}px - ${activeButtonComputedStyles.paddingLeft} - ${activeButtonComputedStyles.paddingRight})`
    }
  }, [activeSnippet])

  if (!activeSnippet) return null

  return (
    <Flex asChild align="center" justify="between" px="2" mt="4">
      <header className={s['code-snippet-header']}>
        {snippets.length > 1 ? (
          <Tabs.Root
            defaultValue={snippets?.[0]?._id}
            value={activeSnippet._id}
            onValueChange={(_id) => {
              const selectedSnippet = snippets.find(
                (snippet) => snippet._id === _id
              )
              if (selectedSnippet) selectSnippet(selectedSnippet)
            }}
          >
            <Tabs.List>
              {snippets.map((snippet) => (
                <Tabs.Trigger key={snippet._id} value={snippet._id}>
                  {snippet.fileName || 'Untitled'}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
          </Tabs.Root>
        ) : (
          activeSnippet.fileName || 'Untitled'
        )}

        <CopyButton snippet={activeSnippet.code.code} />
      </header>
    </Flex>
  )
}
