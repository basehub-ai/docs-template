import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'

import {
  ArticleBodyFragment,
  ArticleFragment,
} from '@/basehub-helpers/fragments'
import NextLink from 'next/link'
import {
  Blockquote,
  Flex,
  Link,
  Heading as RadixHeading,
} from '@radix-ui/themes'
import { RichText, RichTextProps } from '@/.basehub/react-rich-text'
import { Pump } from '@/.basehub/react-pump'
import { Box, Code, Table, Text } from '@radix-ui/themes'

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
import { ArticleBreadcrumb } from './breadcrumb'
import { ArticleFooter } from './footer'

import headingStyles from './heading/heading.module.scss'
import s from './article.module.scss'

export const Article = ({
  id,
  breadcrumb,
  prevArticle,
  nextArticle,
}: {
  id: string
  breadcrumb: ArticleBreadcrumb
  prevArticle: ArticleFooter['prevArticle']
  nextArticle: ArticleFooter['nextArticle']
}) => {
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
            <Flex asChild justify="center" mx="auto" direction="column">
              <article>
                <Box className={s.body}>
                  <Box mb="4">
                    <ArticleBreadcrumb breadcrumb={breadcrumb} />
                  </Box>
                  <RadixHeading
                    as="h1"
                    size="8"
                    className={headingStyles.heading}
                    mt="0"
                    mb="5"
                  >
                    {article._title}
                  </RadixHeading>
                  <Body blocks={article.body.json.blocks}>
                    {article.body.json.content}
                  </Body>
                </Box>
                <ArticleFooter
                  lastUpdatedAt={article._sys.lastModifiedAt}
                  prevArticle={prevArticle}
                  nextArticle={nextArticle}
                />
              </article>
            </Flex>

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
        a: ({ children, ...rest }) => (
          <Link size="3" asChild>
            <NextLink {...rest}>{children}</NextLink>
          </Link>
        ),
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
        blockquote: ({ children }) => <Blockquote>{children}</Blockquote>,
        table: (props) => (
          <Table.Root {...props} size="2" variant="surface" layout="fixed" />
        ),
        tbody: (props) => <Table.Body {...props} />,
        tr: ({ children }) => <Table.Row>{children}</Table.Row>,
        th: ({ children, rowspan, colspan }) => (
          <Table.ColumnHeaderCell colSpan={colspan} rowSpan={rowspan}>
            {children}
          </Table.ColumnHeaderCell>
        ),
        td: ({ children, rowspan, colspan }) => (
          <Table.Cell colSpan={colspan} rowSpan={rowspan}>
            {children}
          </Table.Cell>
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
        p: ({ children }) => (
          <Text as="p" size="3">
            {children}
          </Text>
        ),
        code: ({ isInline, ...rest }) => {
          if (isInline)
            return (
              <Code data-type="inline-code" variant="soft">
                {rest.children}
              </Code>
            )

          return (
            <Box position="relative">
              <CodeSnippet code={{ ...rest }} />
              <CopyButton
                snippet={rest.code}
                style={{
                  position: 'absolute',
                  right: 'var(--space-3)',
                  top: 'var(--space-3)',
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
