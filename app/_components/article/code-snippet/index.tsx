import { CodeBlock, createCssVariablesTheme } from 'basehub/react-code-block'

import { CopyButton } from './controller'
import { CodeGroupHeader } from './header'
import { Box, Flex } from '@radix-ui/themes'
import { CodeSnippetFragment } from './fragment'

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
            language: snippet.code.language,
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
            language: props.code.language,
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
