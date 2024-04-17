import { BundledLanguage } from 'shiki'

import { Highlighter } from './highlighter'

import { CodeBlockClientController, CopyButton } from './controller'
import { fragmentOn } from '@/.basehub'
import { CodeGroupHeader } from './header'

export const CodeSnippetGroup = ({
  codeSnippets,
}: {
  codeSnippets: { items: CodeSnippetFragment[] }
}) => {
  return (
    <CodeBlockClientController snippets={codeSnippets.items}>
      <CodeGroupHeader />
      {codeSnippets.items.map((snippet) => {
        return (
          <CodeSnippet
            key={snippet._id}
            _id={snippet._id}
            code={snippet.code}
          />
        )
      })}
    </CodeBlockClientController>
  )
}

export const CodeSnippetSingle = (props: CodeSnippetFragment) => {
  return (
    <>
      <header data-type="code-snippet-header" className="p-3 pr-10">
        {props.fileName || 'Untitled'}
        <CopyButton snippet={props.code.code} />
      </header>

      <CodeSnippet {...props} />
    </>
  )
}

export const CodeSnippet = ({
  _id = '',
  code,
}: Omit<CodeSnippetFragment, '__typename' | 'fileName' | '_id'> & {
  _id?: CodeSnippetFragment['_id']
}) => {
  return (
    <div data-snippet-id={_id}>
      <Highlighter lang={code.language as BundledLanguage}>
        {code.code}
      </Highlighter>
    </div>
  )
}

export const CodeSnippetFragment = fragmentOn('CodeSnippetComponent', {
  _id: true,
  __typename: true,
  code: { code: true, language: true },
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
