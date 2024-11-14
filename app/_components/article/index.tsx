import {
  ArticleBodyFragment,
  ArticleFragment,
} from '@/basehub-helpers/fragments'
import NextLink from 'next/link'
import {
  Blockquote,
  Em,
  Flex,
  Link,
  Heading as RadixHeading,
  Separator,
} from '@radix-ui/themes'
import { RichText, RichTextProps } from '@/.basehub/react-rich-text'
import { Pump } from '@/.basehub/react-pump'
import { Box, Code, Table, Text } from '@radix-ui/themes'

import { CalloutComponent } from './callout'
import { StepperComponent } from './stepper'
import { CardsGridComponent } from './cards-grid'
import { AccordionComponent } from './accordion'
import { notFound } from 'next/navigation'
import { Heading } from './heading'
import {
  CodeSnippetGroup,
  CodeSnippetItem,
  CodeSnippetSingle,
  theme,
} from './code-snippet'
import { Video } from './video'
import { Image } from './image/handler'
import { CopyButton } from './code-snippet/controller'
import { Toc } from '../toc'
import { ArticleBreadcrumb } from './breadcrumb'
import { ArticleFooter } from './footer'
import { ArticleIndex } from './article-index'
import { flattenRichTextNodes } from '../toc/utils'
import { ArticleLinkMark } from '../article-link/mark'
import headingStyles from './heading/heading.module.scss'
import { IFrameComponent } from './iframe'

import s from './article.module.scss'
import { PageView } from '../analytics/page-view'
import { CodeBlock, Language } from 'basehub/react-code-block'

export const Article = ({
  id,
  breadcrumb,
  nextArticle,
}: {
  id: string
  breadcrumb: ArticleBreadcrumb
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
    >
      {async ([data]) => {
        'use server'

        const article = data._componentInstances.article.items[0]
        if (!article) return notFound()

        const flattenedToc = flattenRichTextNodes(article?.body?.json.toc ?? [])
        const tocIsEmpty = !flattenedToc.some(
          (node) =>
            node.type === 'text' &&
            node.marks?.some((mark) => mark.type === 'link')
        )

        return (
          <>
            <PageView _analyticsKey={article._analyticsKey} />
            <ArticleWrapper
              title={article._title}
              excerpt={article.excerpt}
              lastModifiedAt={article._sys.lastModifiedAt}
              nextArticle={nextArticle}
              breadcrumb={breadcrumb}
              fullBleed={article.fullBleed}
              _analyticsKey={article._analyticsKey}
            >
              {article.body?.json.content ? (
                <Body blocks={article.body.json.blocks}>
                  {article.body.json.content}
                </Body>
              ) : article.children.items.length ? (
                <ArticleIndex articles={article.children.items} />
              ) : (
                <Text size="3" color="gray" style={{ opacity: 0.5 }}>
                  This article has no content yet.
                </Text>
              )}
            </ArticleWrapper>

            {!article.fullBleed && (
              <Toc>{tocIsEmpty ? [] : article?.body?.json.toc ?? []}</Toc>
            )}
          </>
        )
      }}
    </Pump>
  )
}

export const ArticleWrapper = ({
  title,
  excerpt,
  lastModifiedAt,
  children,
  breadcrumb,
  nextArticle,
  fullBleed,
  _analyticsKey,
}: {
  title: string
  excerpt?: string | null
  lastModifiedAt: string
  children: React.ReactNode
  breadcrumb: ArticleBreadcrumb
  nextArticle: ArticleFooter['nextArticle']
  fullBleed?: boolean
  _analyticsKey?: string
}) => {
  return (
    <Flex
      asChild
      justify="between"
      mx="auto"
      direction="column"
      width="100%"
      height="100%"
    >
      <article
        className={s.article}
        style={fullBleed ? { maxWidth: '100%', paddingRight: 0 } : undefined}
      >
        <Box>
          <Box mb="4">
            <ArticleBreadcrumb breadcrumb={breadcrumb} />
          </Box>
          <RadixHeading
            as="h1"
            size="8"
            className={headingStyles.heading}
            mt="0"
            mb={excerpt ? '1' : '7'}
          >
            {title}
          </RadixHeading>
          {excerpt && (
            <Text size="5" color="gray" mb="7" as="p" role="excerpt">
              {excerpt}
            </Text>
          )}
          {children}
        </Box>
        <ArticleFooter
          _analyticsKey={_analyticsKey}
          lastUpdatedAt={lastModifiedAt}
          nextArticle={nextArticle}
        />
      </article>
    </Flex>
  )
}

export const Body = (props: RichTextProps<ArticleBodyFragment['blocks']>) => {
  return (
    <div className={s.body}>
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
          table: (props) => <Table.Root {...props} size="2" layout="auto" />,
          em: (props) => <Em {...props} />,
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
          hr: () => <Separator size="4" my="7" color="gray" />,
          AccordionGroupComponent: AccordionComponent,
          CalloutComponent,
          CardsGridComponent,
          video: Video,
          img: Image,
          CodeSnippetComponent: CodeSnippetSingle,
          CodeGroupComponent: CodeSnippetGroup,
          ArticleLinkComponent_mark: ArticleLinkMark,
          StepperComponent,
          IFrameComponent: IFrameComponent,
          p: ({ children }) => (
            <Text as="p" size="3">
              {children}
            </Text>
          ),
          code: ({ isInline, ...rest }) => {
            if (isInline)
              return (
                <Code data-type="inline-code" variant="outline">
                  {rest.children}
                </Code>
              )

            return (
              <Box position="relative" data-code-snippet>
                <CodeBlock
                  snippets={[
                    {
                      code: rest.code,
                      lang: rest.language as Language,
                    },
                  ]}
                  theme={theme}
                  components={{
                    div: ({ children, ...rest }) => (
                      <CodeSnippetItem {...rest}>{children}</CodeSnippetItem>
                    ),
                  }}
                  childrenBottom={
                    <CopyButton
                      style={{
                        position: 'absolute',
                        right: 'var(--space-2)',
                        top: 'var(--space-2)',
                      }}
                    />
                  }
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
    </div>
  )
}
