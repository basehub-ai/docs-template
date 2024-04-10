import { ArticleFragment } from '@/basehub-helpers/fragments'
import { RichText } from '@/.basehub/react-rich-text'
import { CalloutComponent } from './callout'
import { HeadingWithIconComponent } from './heading-with-icon'
import { Pump } from '@/.basehub/react-pump'
import { notFound } from 'next/navigation'
import s from './article.module.scss'
import { draftMode } from 'next/headers'

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
        if (!article) notFound()

        return (
          <article className="flex justify-center">
            <div className={s.body}>
              <h1>{article._title}</h1>
              <RichText
                blocks={article.body?.json.blocks}
                components={{ CalloutComponent, HeadingWithIconComponent }}
              >
                {article.body?.json.content}
              </RichText>
            </div>
          </article>
        )
      }}
    </Pump>
  )
}
