import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'

import { ArticleFragment } from '@/basehub-helpers/fragments'
import {
  CustomBlocksBase,
  RichText,
  RichTextProps,
} from '@/.basehub/react-rich-text'
import { Pump } from '@/.basehub/react-pump'

import { HeadingWithIconComponent } from './heading-with-icon'
import { CalloutComponent } from './callout'
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
        if (!article?.body?.json) notFound()

        return (
          <>
            <article className="flex flex-1 justify-center">
              <div className={s.body}>
                <h1>{article._title}</h1>
                <Body
                  blocks={article.body.json.blocks}
                  components={{
                    CalloutComponent,
                    HeadingWithIconComponent_mark: HeadingWithIconComponent,
                    HeadingWithIconComponent,
                    video: Video,
                    img: Image,
                  }}
                >
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

export const Body = <CustomBlocks extends CustomBlocksBase>(
  props: RichTextProps<CustomBlocks>
) => {
  return (
    <RichText blocks={props.blocks} components={props.components}>
      {props.children}
    </RichText>
  )
}
