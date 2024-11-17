import { Callout, Code, Heading, Link } from '@radix-ui/themes'
import NextLink from 'next/link'
import { RichText } from 'basehub/react-rich-text'
import {
  CheckCircledIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
  Pencil1Icon,
} from '@radix-ui/react-icons'
import { ArticleLinkMark } from '../article-link/mark'
import { CalloutFragment } from './callout-fragment'

export const CalloutComponent = (props: CalloutFragment) => {
  let calloutColor: React.ComponentProps<typeof Callout.Root>['color'] = 'gray'

  let icon
  switch (props.type) {
    default:
    case 'info':
      calloutColor = 'gray'
      icon = <InfoCircledIcon />
      break
    case 'check':
      calloutColor = 'green'
      icon = <CheckCircledIcon />
      break
    case 'warning':
      calloutColor = 'yellow'
      icon = <ExclamationTriangleIcon />
      break
    case 'danger':
      calloutColor = 'red'
      icon = <ExclamationTriangleIcon />
      break
    case 'note':
      calloutColor = 'blue'
      icon = <Pencil1Icon />
      break
  }

  return (
    <Callout.Root
      color={calloutColor}
      variant="surface"
      data-type="callout"
      my="4"
    >
      {icon && <Callout.Icon>{icon}</Callout.Icon>}
      <RichText
        {...props.content?.json}
        components={{
          p: ({ children }) => (
            <Callout.Text style={{ marginTop: 0 }}>{children}</Callout.Text>
          ),
          h1: ({ children }) => (
            <Heading as="h1" size="3" weight="medium">
              {children}
            </Heading>
          ),
          h2: ({ children }) => (
            <Heading as="h2" size="2" weight="medium">
              {children}
            </Heading>
          ),
          h3: ({ children }) => (
            <Heading as="h3" size="2" weight="medium">
              {children}
            </Heading>
          ),
          a: ({ children, ...rest }) => (
            <Link asChild>
              <NextLink {...rest}>{children}</NextLink>
            </Link>
          ),
          code: ({ children, isInline }) => {
            if (!isInline) return null
            return <Code>{children}</Code>
          },
          ArticleLinkComponent_mark: ArticleLinkMark,
        }}
      />
    </Callout.Root>
  )
}
