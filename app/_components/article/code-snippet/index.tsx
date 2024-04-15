import { Highlighter, HighlighterProps } from './highlighter'

import { CodeBlockClientController, CopyButton } from './controller'
import { fragmentOn } from '@/.basehub'
import { CodeBlockHeader } from './header'
import { BundledLanguage, createCssVariablesTheme } from 'shiki'

export const CodeSnippetGroup = ({
  snippets,
}: {
  snippets: CodeSnippetFragment[]
}) => {
  return (
    <CodeBlockClientController snippets={snippets}>
      <CodeBlockHeader />
      {snippets.map((snippet) => {
        return (
          <CodeSnippet
            key={snippet._id}
            _id={snippet._id}
            code={snippet.code}
            fileName={snippet.fileName}
          />
        )
      })}
    </CodeBlockClientController>
  )
}

export const CodeSnippet = ({
  _id,
  code,
  fileName,
}: Omit<CodeSnippetFragment, '__typename'>) => {
  return (
    <CodeBlockClientController snippets={[{ _id, fileName, code }]}>
      <div className="relative">
        {fileName !== null && <CodeBlockHeader />}
        <Highlighter id={_id} lang={code.language as BundledLanguage}>
          {code.code}
        </Highlighter>
        <CopyButton />
      </div>
    </CodeBlockClientController>
  )
}

export const CodeSnippetFragment = fragmentOn('CodeSnippetComponent', {
  _id: true,
  __typename: true,
  code: {
    code: true,
    language: true,
  },
  fileName: true,
})

export const CodeSnippetFragmentRecursive = fragmentOn('CodeSnippetComponent', {
  _id: true,
  __typename: true,
  code: {
    __typename: true,
    code: true,
    language: true,
  },
  fileName: true,
  targetOptionalToReuse: CodeSnippetFragment,
})

export const CodeGroupFragment = fragmentOn('CodeGroupComponent', {
  _id: true,
  __typename: true,
  codeSnippets: { items: CodeSnippetFragmentRecursive },
})

export type CodeSnippetFragment = fragmentOn.infer<typeof CodeSnippetFragment>
