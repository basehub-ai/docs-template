'use client'

import * as React from 'react'
import clsx from 'clsx'
import { CheckIcon, CopyIcon } from '@radix-ui/react-icons'

import { CodeSnippetFragment } from './index'

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
      selectSnippet: (snippet: ClientSnippet) => void
    }
  | undefined
>(undefined)

export const CodeBlockClientController = ({
  children,
  snippets,
}: CodeBlockClientControllerProps) => {
  const [activeSnippet, _setActiveSnippet] = React.useState<ClientSnippet>(
    snippets[0] as ClientSnippet
  )

  return (
    <CodeBlockContext.Provider
      value={{ activeSnippet, snippets, selectSnippet: _setActiveSnippet }}
    >
      {children}
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

export const CopyButton = () => {
  const { activeSnippet } = useCodeBlock()
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return

    const timeout = setTimeout(() => {
      setCopied(false)
    }, 2000)

    return () => clearTimeout(timeout)
  }, [copied])

  if (!activeSnippet) return null

  return (
    <button
      data-type="copy-snippet"
      onClick={() => {
        setCopied(true)
        navigator.clipboard.writeText(activeSnippet.code.code)
      }}
    >
      <CopyIcon
        width={12}
        height={12}
        className={clsx(
          'absolute transition-opacity duration-75 ease-linear',
          copied ? 'opacity-0' : 'opacity-100 delay-100'
        )}
      />
      <CheckIcon
        width={12}
        height={12}
        className={clsx(
          'absolute transition-opacity duration-75 ease-linear',
          copied ? 'opacity-100 delay-100' : 'opacity-0'
        )}
      />
    </button>
  )
}
