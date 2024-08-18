import {
  CodeBlock,
  createCssVariablesTheme,
  Language,
} from 'basehub/react-code-block'

import { CopyButton } from './controller'
import { fragmentOn } from 'basehub'
import { CodeGroupHeader } from './header'
import { Box, Flex } from '@radix-ui/themes'

import s from './code-snippet.module.scss'

export const theme = createCssVariablesTheme({
  name: 'css-variables',
  variablePrefix: '--shiki-',
  variableDefaults: {},
  fontStyle: true,
})

export const CodeSnippetGroup = ({
  codeSnippets,
}: {
  codeSnippets: { items: CodeSnippetFragment[] }
}) => {
  return (
    <div className={s['code-snippet']}>
      <CodeBlock
        childrenTop={<CodeGroupHeader />}
        snippets={codeSnippets.items.map((snippet) => {
          return {
            code: snippet.code.code,
            label: snippet.fileName || 'Untitled',
            id: snippet._id,
            lang: snippet.code.language as Language,
          } as const
        })}
        theme={theme}
        components={{
          div: ({ children, ...rest }) => (
            <CodeSnippetItem {...rest}>{children}</CodeSnippetItem>
          ),
        }}
      />
    </div>
  )
}

export const CodeSnippetItem = ({
  children,
  ...rest
}: {
  children: React.ReactNode
}) => {
  return (
    <div {...rest} className={s['code-snippet']}>
      {children}
    </div>
  )
}

export const CodeSnippetSingle = (props: CodeSnippetFragment) => {
  return (
    <Box className={s['code-snippet']}>
      <CodeBlock
        childrenTop={
          <Flex asChild align="center" justify="between" p="2">
            <header className={s['code-snippet-header']}>
              {props.fileName || 'Untitled'}
              <CopyButton />
            </header>
          </Flex>
        }
        snippets={[
          {
            code: props.code.code,
            id: props._id,
            lang: props.code.language as Language,
          },
        ]}
        theme={theme}
        components={{
          div: ({ children, ...rest }) => (
            <CodeSnippetItem {...rest}>{children}</CodeSnippetItem>
          ),
        }}
      />
    </Box>
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
