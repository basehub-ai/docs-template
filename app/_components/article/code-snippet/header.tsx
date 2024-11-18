'use client'

import * as React from 'react'
import { Flex, Tabs, VisuallyHidden } from '@radix-ui/themes'
import { useCodeBlockContext } from 'basehub/react-code-block/client'

import s from './code-snippet.module.scss'
import { CopyButton } from './controller'

export const CodeGroupHeader = () => {
  const highligterRef = React.useRef<HTMLDivElement>(null)
  const { activeSnippet, snippets, selectSnippet } = useCodeBlockContext()

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
    <>
      <Flex asChild align="center" justify="between" px="2" mt="4">
        <header className={s['code-snippet-header']} data-llms-ignore>
          {snippets.length > 1 ? (
            <Tabs.Root
              defaultValue={snippets?.[0]?.id}
              value={activeSnippet.id}
              onValueChange={(_id) => {
                const selectedSnippet = snippets.find(
                  (snippet) => snippet.id === _id
                )
                if (selectedSnippet) selectSnippet(selectedSnippet)
              }}
            >
              <Tabs.List>
                {snippets.map((snippet) => (
                  <Tabs.Trigger key={snippet.id} value={snippet.id}>
                    {snippet.label || 'Untitled'}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
            </Tabs.Root>
          ) : (
            activeSnippet.label || 'Untitled'
          )}

          <CopyButton />
        </header>
      </Flex>

      {/* llms only */}
      {snippets[0]?.label && (
        <VisuallyHidden>{snippets[0].label}</VisuallyHidden>
      )}
    </>
  )
}
