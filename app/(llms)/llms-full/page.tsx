import * as React from 'react'
import { basehub, fragmentOn, fragmentOnRecursiveCollection } from 'basehub'
import { ArticleFragment } from '@/basehub-helpers/fragments'
import { Body } from '@/app/_components/article'

const ArticleFragmentRecursive = fragmentOnRecursiveCollection(
  'ArticleComponent',
  ArticleFragment,
  {
    levels: 5,
    recursiveKey: 'children',
  }
)

const LlmsFullHtmlPage = async () => {
  const data = await basehub().query({
    pages: {
      items: {
        _id: true,
        articles: {
          items: ArticleFragmentRecursive,
        },
      },
    },
  })

  return (
    <div id="llms-root">
      {data.pages.items.map((page) => {
        return (
          <React.Fragment key={page._id}>
            {page.articles.items.map((article) => {
              return <ArticleRecursive key={article._id} article={article} />
            })}
          </React.Fragment>
        )
      })}
    </div>
  )
}

const ArticleRecursive = ({
  article,
}: {
  article: fragmentOn.infer<typeof ArticleFragmentRecursive>
}) => {
  const hasContent = article.body?.json.content?.length

  return (
    <>
      {hasContent && (
        <>
          <h1>{article._title}</h1>
          <blockquote>{article.excerpt}</blockquote>
          <Body
            blocks={article.body?.json.blocks}
            content={article.body?.json.content}
          />
        </>
      )}
      {article.children.items.map((child) => {
        return <ArticleRecursive key={child._id} article={child} />
      })}
    </>
  )
}

export default LlmsFullHtmlPage
