import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'

import {
  ArticleBodyFragment,
  ArticleFragment,
} from '@/basehub-helpers/fragments'
import { RichText, RichTextProps } from '@/.basehub/react-rich-text'
import { Pump } from '@/.basehub/react-pump'

import { HeadingWithIconMark } from './heading-with-icon'
import { CalloutComponent } from './callout'
import { StepperComponent } from './stepper'
import { CardsGridComponent } from './cards-grid'
import { AccordionComponent } from './accordion'
import { Heading } from './heading'
import {
  CodeSnippet,
  CodeSnippetGroup,
  CodeSnippetSingle,
} from './code-snippet'
import { Video } from './video'
import { Image } from './image/handler'
import { CopyButton } from './code-snippet/controller'

import { Toc } from '../toc'

import s from './article.module.scss'
import { Box } from '@radix-ui/themes'

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

export const Body = (props: RichTextProps<ArticleBodyFragment['blocks']>) => {
  return (
    <RichText
      blocks={props.blocks}
      components={{
        h1: (props) => (
          <Heading as="h1" id={props.id}>
            {props.children}
          </Heading>
        ),
        h2: (props) => (
          <Heading as="h2" id={props.id}>
            {props.children}
          </Heading>
        ),
        h3: (props) => (
          <Heading as="h3" id={props.id}>
            {props.children}
          </Heading>
        ),
        h4: (props) => (
          <Heading as="h4" id={props.id}>
            {props.children}
          </Heading>
        ),
        h5: (props) => (
          <Heading as="h5" id={props.id}>
            {props.children}
          </Heading>
        ),
        h6: (props) => (
          <Heading as="h6" id={props.id}>
            {props.children}
          </Heading>
        ),
        StepperComponent,
        AccordionGroupComponent: AccordionComponent,
        CalloutComponent,
        CardsGridComponent,
        CardsGridComponent_mark: CardsGridComponent,
        HeadingWithIconComponent_mark: HeadingWithIconMark,
        video: Video,
        img: Image,
        CodeSnippetComponent: CodeSnippetSingle,
        CodeGroupComponent: CodeSnippetGroup,
        code: ({ isInline, ...rest }) => {
          if (isInline)
            return <code data-type="inline-code">{rest.children}</code>

          return (
            <Box position="relative">
              <CodeSnippet code={{ ...rest }} />
              <CopyButton
                snippet={rest.code}
                style={{
                  right: '4',
                  top: '4',
                  transform: 'translateY(0)',
                }}
              />
            </Box>
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
