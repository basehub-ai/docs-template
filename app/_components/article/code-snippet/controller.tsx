'use client'

import * as React from 'react'
import { CheckIcon, CopyIcon } from '@radix-ui/react-icons'

import { CodeSnippetFragment } from './index'
import { Tooltip } from '@radix-ui/themes'

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

  return (
    <CodeBlockContext.Provider
      value={{ activeSnippet, snippets, selectSnippet: _setActiveSnippet }}
    >
      <div ref={groupRef} data-active-snippet={activeSnippet['_id']} className={s['code-snippet']}>
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
  snippet,
  style,
}: {
  snippet: CodeSnippetFragment['code']['code']
  style?: JSX.IntrinsicElements['button']['style']
}) => {
  const [copied, setCopied] = React.useState(false)
  const copyButtonRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    if (!copied) return

    const timeout = setTimeout(() => {
      setCopied(false)
    }, 2000)

    return () => clearTimeout(timeout)
  }, [copied])

  return (
    <Tooltip content={copied ? 'Copied!' : 'Copy to Clipboard'}>
      <button
        style={style}
        ref={copyButtonRef}
        className={s['code-snippet-header__copy']}
        onClick={() => {
          setCopied(true)
          navigator.clipboard.writeText(snippet)
        }}
      >
        {copied ? (
          <CheckIcon width={12} height={12} />
        ) : (
          <CopyIcon width={12} height={12} />
        )}
      </button>
    </Tooltip>
  )
}
