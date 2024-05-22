'use client'

import * as React from 'react'
import { CheckIcon, CopyIcon } from '@radix-ui/react-icons'

import { CodeSnippetFragment } from './index'
import { IconButton } from '@radix-ui/themes'

import s from './code-snippet.module.scss'

type ClientSnippet = Omit<CodeSnippetFragment, '__typename'>

/* -------------------------------------------------------------------------------------------------
 * Context
 * -----------------------------------------------------------------------------------------------*/

type CodeBlockClientControllerProps = {
  children: React.ReactNode
  snippets: Array<ClientSnippet>
}

const CodeBlockContext = React.createContext<
  | {
      activeSnippet: ClientSnippet | undefined
      snippets: ClientSnippet[]
      // eslint-disable-next-line no-unused-vars
      selectSnippet: (snippet: ClientSnippet) => void
    }
  | undefined
>(undefined)

export const CodeBlockClientController = ({
  children,
  snippets,
}: CodeBlockClientControllerProps) => {
  const groupRef = React.useRef<HTMLDivElement>(null)
  const [activeSnippet, _setActiveSnippet] = React.useState<ClientSnippet>(
    snippets[0] as ClientSnippet
  )

  React.useEffect(() => {
    if (!groupRef.current) return

    const activeSnippetValue = groupRef.current.getAttribute(
      'data-active-snippet'
    )
    const matchingDiv = groupRef.current.querySelectorAll('[data-snippet-id]')

    matchingDiv.forEach((div) => {
      if (!(div instanceof HTMLElement)) return

      if (div.getAttribute('data-snippet-id') === activeSnippetValue) {
        div.style.display = 'block'
        div.setAttribute('data-active', 'true')
      } else {
        div.style.display = 'none'
        div.setAttribute('data-active', 'false')
      }
    })
  }, [activeSnippet])

  /**
   * Save snippet selection with localStorage.
   */
  const localStorageKey = `active-snippet-for-${snippets.map((s) => s.fileName).join('-')}`
  const [syncedWithLS, setSyncedWithLS] = React.useState(false)

  React.useEffect(() => {
    const activeSnippetFromLS = window.localStorage.getItem(localStorageKey)
    if (activeSnippetFromLS) {
      const snippet = snippets.find((s) => s.fileName === activeSnippetFromLS)
      if (snippet) _setActiveSnippet(snippet)
    }
    setSyncedWithLS(true)
  }, [localStorageKey, snippets])

  React.useEffect(() => {
    if (!syncedWithLS) return
    if (activeSnippet) {
      if (activeSnippet.fileName) {
        window.localStorage.setItem(localStorageKey, activeSnippet.fileName)
      } else {
        window.localStorage.removeItem(localStorageKey)
      }
    }
  }, [localStorageKey, activeSnippet, syncedWithLS])

  return (
    <CodeBlockContext.Provider
      value={{ activeSnippet, snippets, selectSnippet: _setActiveSnippet }}
    >
      <div
        ref={groupRef}
        data-active-snippet={activeSnippet['_id']}
        className={s['code-snippet']}
      >
        {children}
      </div>
    </CodeBlockContext.Provider>
  )
}

export default CodeBlockClientController

export const useCodeBlock = () => {
  const context = React.useContext(CodeBlockContext)
  if (!context) {
    throw new Error('useCodeBlock must be used within a CodeBlockProvider')
  }
  return context
}

/* -------------------------------------------------------------------------------------------------
 * Copy Button
 * -----------------------------------------------------------------------------------------------*/

export const CopyButton = ({
  activeSnippetId,
  style,
}: {
  activeSnippetId: CodeSnippetFragment['_id'] | null
  style?: JSX.IntrinsicElements['button']['style']
}) => {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return

    const timeout = setTimeout(() => {
      setCopied(false)
    }, 2000)

    return () => clearTimeout(timeout)
  }, [copied])

  return (
    <IconButton
      style={style}
      size="1"
      variant="surface"
      color="gray"
      onClick={(e) => {
        const snippet = activeSnippetId
          ? document.querySelector(`[data-snippet-id="${activeSnippetId}"]`)
              ?.textContent
          : e.currentTarget.closest<HTMLDivElement>(
              '[data-code-snippet="true"]'
            )?.textContent
        if (snippet) {
          navigator.clipboard.writeText(snippet)
          setCopied(true)
        }
      }}
    >
      {copied ? (
        <CheckIcon width={12} height={12} />
      ) : (
        <CopyIcon width={12} height={12} />
      )}
    </IconButton>
  )
}
