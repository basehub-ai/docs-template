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
  const [activeSnippet, setActiveSnippet] = React.useState<ClientSnippet>(
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

  React.useEffect(() => {
    const activeSnippetFromLS = window.localStorage.getItem(localStorageKey)
    if (activeSnippetFromLS) {
      const snippet = snippets.find((s) => s.fileName === activeSnippetFromLS)
      if (snippet) setActiveSnippet(snippet)
    }

    /**
     * Sync active snippet throughout multiple code snippets throughout the page.
     */
    function handleSnippetChange(
      event: CustomEvent<{ key: string; snippet: ClientSnippet }>
    ) {
      if (event.detail.key !== localStorageKey) return
      const newActiveSnippet = snippets.find(
        (s) => s.fileName === event.detail.snippet.fileName
      )
      if (newActiveSnippet) {
        setActiveSnippet(newActiveSnippet)
      }
    }

    // @ts-ignore
    window.addEventListener('snippet-change', handleSnippetChange)
    return () => {
      // @ts-ignore
      window.removeEventListener('snippet-change', handleSnippetChange)
    }
  }, [localStorageKey, snippets])

  const selectSnippet = React.useCallback(
    (snippet: ClientSnippet) => {
      setActiveSnippet(snippet)
      if (snippet.fileName) {
        window.localStorage.setItem(localStorageKey, snippet.fileName)
        const event = new CustomEvent('snippet-change', {
          detail: { key: localStorageKey, snippet },
        })
        window.dispatchEvent(event)
      } else {
        window.localStorage.removeItem(localStorageKey)
      }
    },
    [localStorageKey]
  )

  return (
    <CodeBlockContext.Provider
      value={{ activeSnippet, snippets, selectSnippet }}
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
