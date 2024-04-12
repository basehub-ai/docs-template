import { fragmentOn } from '@/.basehub'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'

import { ArticleFragment } from '@/basehub-helpers/fragments'
import { RichText, RichTextProps } from '@/.basehub/react-rich-text'
import { Pump } from '@/.basehub/react-pump'

import {
  HeadingWithIconFragment,
  HeadingWithIconMark,
} from './heading-with-icon'
import { CalloutComponent, CalloutFragment } from './callout'
import { StepperComponent, StepperFragment } from './stepper'
import { CardsGridComponent, CardsGridFragment } from './cards-grid'
import { CodeGroupFragment, CodeSnippet, CodeSnippetFragmentRecursive, CodeSnippetGroup } from './code-snippet'
import { Video } from './video'
import { Image } from './image/handler'

import { Toc } from '../toc'

import s from './article.module.scss'

export const Article = ({ id }: { id: string }) => {
  return (
    <Pump
      queries={[
        {
          _componentInstances: {
            article: {
              __args: { first: 1, filter: { _sys_id: { eq: id } } },
              items: ArticleFragment,
            },
          },
        },
      ]}
      next={{ revalidate: 30 }}
      draft={draftMode().isEnabled}
    >
      {async ([data]) => {
        'use server'

        const article = data._componentInstances.article.items[0]
        if (!article?.body?.json) return notFound()

        return (
          <>
            <article className="flex flex-1 justify-center">
              <div className={s.body}>
                <h1>{article._title}</h1>
                <Body blocks={article.body.json.blocks}>
                  {article.body.json.content}
                </Body>
              </div>
            </article>
            <Toc>{article.body.json.toc}</Toc>
          </>
        )
      }}
    </Pump>
  )
}

export const ArticleBodyFragment = fragmentOn('BodyRichText', {
  content: true,
  toc: true,
  blocks: {
    __typename: true,
    on_CalloutComponent: CalloutFragment,
    on_HeadingWithIconComponent: HeadingWithIconFragment,
    on_CardsGridComponent: CardsGridFragment,
    on_StepperComponent: StepperFragment,
    on_CodeGroupComponent: CodeGroupFragment,
    on_CodeSnippetComponent: CodeSnippetFragmentRecursive,
  },
})

export type ArticleBodyFragment = fragmentOn.infer<typeof ArticleBodyFragment>

export const Body = (props: RichTextProps<ArticleBodyFragment['blocks']>) => {
  return (
    <RichText
      blocks={props.blocks}
      components={{
        StepperComponent,
        CalloutComponent,
        CardsGridComponent,
        CardsGridComponent_mark: CardsGridComponent,
        HeadingWithIconComponent_mark: HeadingWithIconMark,
        video: Video,
        img: Image,
        CodeSnippetComponent: CodeSnippet,
        CodeGroupComponent: (props) => (
          <CodeSnippetGroup snippets={props.codeSnippets.items} />
        ),
        code: ({ isInline, ...rest }) => {
          if (isInline) {
            return <code data-type="inline-code">{rest.children}</code>
          }

          return (
            <CodeSnippet
              _id="rich-text-code-snippet"
              fileName=""
              code={{ ...rest }}
            />
          )
        },
        pre: ({ children }) => <>{children}</>,
        ...props.components,
      }}
    >
      {props.children}
    </RichText>
  )
}
