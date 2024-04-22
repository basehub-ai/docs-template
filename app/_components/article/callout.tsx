import { fragmentOn } from '@/.basehub'
import { Callout } from '@radix-ui/themes'
import { Body } from '.'

export const CalloutComponent = (props: CalloutFragment) => {
  let calloutColor: React.ComponentProps<typeof Callout.Root>['color'] = 'gray'

  switch (props.type) {
    case 'info':
      calloutColor = 'gray'
      break
    case 'check':
      calloutColor = 'green'
      break
    case 'warning':
      calloutColor = 'yellow'
      break
    case 'danger':
      calloutColor = 'red'
      break
    case 'note':
      calloutColor = 'blue'
      break
  }

  return (
    <Callout.Root color={calloutColor} variant="surface" data-type="callout">
      <Body
        components={{
          p: ({ children }) => <Callout.Text size="1">{children}</Callout.Text>,
        }}
      >
        {props.content?.json.content}
      </Body>
    </Callout.Root>
  )
}

export const CalloutFragment = fragmentOn('CalloutComponent', {
  _id: true,
  _title: true,
  content: { json: { content: true } },
  type: true,
})

type CalloutFragment = fragmentOn.infer<typeof CalloutFragment>
