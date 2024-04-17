import { codeToHast, BundledLanguage, createCssVariablesTheme } from 'shiki'
import * as prod from 'react/jsx-runtime'
import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from '@shikijs/transformers'
import { toJsxRuntime, Components } from 'hast-util-to-jsx-runtime'

const production = { Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs }

type ComponentsToOverride = Pick<Components, 'pre' | 'code' | 'span'>

export type HighlighterProps = {
  children: string
  lang: BundledLanguage
  components?: Partial<ComponentsToOverride>
}

const theme = createCssVariablesTheme({
  name: 'css-variables',
  variablePrefix: '--shiki-',
  variableDefaults: {},
  fontStyle: true,
})

export const Highlighter = async ({
  children,
  lang,
  components,
}: HighlighterProps) => {
  const hast = await codeToHast(children, {
    lang,
    theme,
    transformers: [
      transformerNotationDiff(),
      transformerNotationErrorLevel(),
      transformerNotationHighlight(),
      {
        line(node, line) {
          node.children = [
            {
              type: 'element',
              tagName: 'span',
              properties: { class: 'line-indicator' },
              children: [
                {
                  type: 'text',
                  value: line.toString(),
                },
              ],
            },
            ...node.children,
          ]
        },
      },
      transformerNotationWordHighlight(),
    ],
  })

  // @ts-ignore
  const content = toJsxRuntime(hast, {
    ...production,
    components,
  })

  return content
}
