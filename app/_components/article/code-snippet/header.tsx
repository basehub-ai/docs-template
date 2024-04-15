'use client'

import { useCodeBlock } from './controller'

export const CodeBlockHeader = () => {
  const { activeSnippet, snippets, selectSnippet } = useCodeBlock()

  if (!activeSnippet) return null

  return (
    <header data-type="code-snippet-header">
      {snippets.length > 0
        ? snippets.map((snippet) => (
            <button
              key={snippet._id}
              onClick={() => {
                selectSnippet(snippet)
              }}
            >
              {snippet.fileName || 'Untitled'}
            </button>
          ))
        : activeSnippet.fileName || 'Untitled'}
    </header>
  )
}
