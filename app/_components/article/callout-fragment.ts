import { fragmentOn } from 'basehub'
import { ArticleLinkFragment } from '../article-link/fragment'

export const CalloutFragment = fragmentOn('CalloutComponent', {
  _id: true,
  _title: true,
  content: {
    json: {
      content: true,
      blocks: {
        on_ArticleLinkComponent: ArticleLinkFragment,
      },
    },
  },
  type: true,
})

export type CalloutFragment = fragmentOn.infer<typeof CalloutFragment>
