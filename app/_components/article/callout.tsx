import { fragmentOn } from '@/.basehub'
import { Body } from '.'

export const CalloutComponent = ({
  _title,
  content,
  type,
}: CalloutFragment) => (
  <div data-type="callout" callout-type={type}>
    <p>{_title}</p>
    <Body>{content?.json.content}</Body>
  </div>
)

export const CalloutFragment = fragmentOn('CalloutComponent', {
  _id: true,
  _title: true,
  content: { json: { content: true } },
  type: true,
})

type CalloutFragment = fragmentOn.infer<typeof CalloutFragment>
