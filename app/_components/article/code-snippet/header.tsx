'use client'

import { useCodeBlock } from './controller'

export const CodeBlockHeader = () => {
  const { activeSnippet } = useCodeBlock()

  return <div>Active: {activeSnippet?._id ?? 'none'}</div>
}
