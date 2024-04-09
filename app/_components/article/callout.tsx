import { fragmentOn } from '@/.basehub'
import { RichText } from 'basehub/react-rich-text'
import clsx from 'clsx'
import Link from 'next/link'

export const CalloutComponent = ({
  _title,
  content,
  type,
}: CalloutFragment) => (
  <div
    className={clsx(
      {
        'text-warning bg-warning-light border-warning-border':
          type === 'warning',
        'text-danger bg-danger-light border-danger-border': type === 'danger',
        'text-check bg-check-light border-check-border': type === 'check',
        'text-note bg-note-light border-note-border': type === 'note',
        'text-info bg-info-light border-info-border': type === 'info',
      },
      'rounded-lg border p-3 space-y-1.5 shadow-soft'
    )}
  >
    <p className="!text-inherit !text-xs !leading-4 !tracking-[-0.26px] !font-medium">
      {_title}
    </p>
    <RichText
      components={{
        p: ({ children }) => (
          <p className="!text-xs !leading-4 text-[#52525B]">{children}</p>
        ),
        a: ({ children, ...rest }) => (
          <Link
            {...rest}
            className="!text-[#18181B] !border-none hover:underline"
          >
            {children}
          </Link>
        ),
      }}
    >
      {content?.json.content}
    </RichText>
  </div>
)

export const CalloutFragment = fragmentOn('CalloutComponent', {
  _id: true,
  _title: true,
  content: { json: { content: true } },
  type: true,
})

type CalloutFragment = fragmentOn.infer<typeof CalloutFragment>
