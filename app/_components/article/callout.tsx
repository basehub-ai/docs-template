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
        'border-warning-border bg-warning-light text-warning':
          type === 'warning',
        'border-danger-border bg-danger-light text-danger': type === 'danger',
        'border-check-border bg-check-light text-check': type === 'check',
        'border-note-border bg-note-light text-note': type === 'note',
        'border-info-border bg-info-light text-info': type === 'info',
      },
      'space-y-1.5 rounded-lg border p-3 shadow-soft'
    )}
  >
    <p className="!text-xs !font-medium !leading-4 !tracking-[-0.26px] !text-inherit">
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
            className="!border-none !text-[#18181B] hover:underline"
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
