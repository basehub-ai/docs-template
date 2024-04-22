'use client'

import * as React from 'react'
import { CopyIcon } from '@radix-ui/react-icons'

import { CodeSnippetFragment } from './index'
import { createPortal } from 'react-dom'
import { useHasRendered } from '@/hooks/use-has-rendered'

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
      <div ref={groupRef} data-active-snippet={activeSnippet['_id']}>
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
  className,
  style,
}: {
  snippet: CodeSnippetFragment['code']['code']
  className?: string
  style?: JSX.IntrinsicElements['button']['style']
}) => {
  const [copied, setCopied] = React.useState(false)
  const copyButtonRef = React.useRef<HTMLButtonElement>(null)

  const [tooltipStyle, setTooltipStyle] = React.useState({}) // State to hold tooltip styles
  const tooltipRef = React.useRef<HTMLSpanElement>(null) // Ref for the tooltip element

  const [isHoveringButton, setIsHoveringButton] = React.useState(false)
  const hasRendered = useHasRendered()

  React.useEffect(() => {
    if (!isHoveringButton) return

    setCopied(false)
  }, [isHoveringButton])

  React.useEffect(() => {
    if (!copied) return

    const timeout = setTimeout(() => {
      setCopied(false)
    }, 2000)

    return () => clearTimeout(timeout)
  }, [copied])

  const calculateTooltipPosition = React.useCallback(() => {
    if (!copyButtonRef.current || !tooltipRef.current) return

    const { left, top } = copyButtonRef.current.getBoundingClientRect()
    const { width } = tooltipRef.current.getBoundingClientRect()
    const tooltipLeft = left - width / 3
    const tooltipTop = top - 28

    setTooltipStyle({
      position: 'fixed',
      left: `${tooltipLeft}px`,
      top: `${tooltipTop}px`,
      opacity: isHoveringButton ? '1' : '0',
      transitionDelay: isHoveringButton ? '0.1s' : '0',
    })
  }, [isHoveringButton])

  React.useEffect(() => {
    calculateTooltipPosition()
    if (!document || !window) return

    if (!document || !window) return

    window.addEventListener('resize', calculateTooltipPosition, {
      passive: true,
    })
    document.addEventListener('scroll', calculateTooltipPosition, {
      passive: true,
    })

    return () => {
      window.removeEventListener('resize', calculateTooltipPosition)
      document.removeEventListener('scroll', calculateTooltipPosition)
    }
  }, [calculateTooltipPosition])

  return (
    <button
      ref={copyButtonRef}
      className={className}
      style={style}
      data-type="copy-snippet"
      onMouseEnter={() => setIsHoveringButton(true)}
      onMouseLeave={() => setIsHoveringButton(false)}
      onClick={() => {
        setCopied(true)
        navigator.clipboard.writeText(snippet)
      }}
    >
      <CopyIcon width={12} height={12} />

      {hasRendered &&
        createPortal(
          <span ref={tooltipRef} style={tooltipStyle} data-type="tooltip">
            <span data-type="tooltip-content">Copy to Clipboard</span>
            {copied && <span data-type="tooltip-success">Copied</span>}
          </span>,
          document.body
        )}
    </button>
  )
}
