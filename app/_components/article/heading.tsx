'use client'

import * as React from 'react'
import { Link2Icon } from '@radix-ui/react-icons'
import { clsx } from 'clsx'
import Link from 'next/link'

type AnchorHeadingProps = JSX.IntrinsicElements['h1'] & {
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  href?: string
}

export const AnchorHeading = ({
  children,
  as,
  className,
  id,
  href,
  ...rest
}: AnchorHeadingProps) => {
  const Element: React.ElementType = as

  return (
    <Element
      {...rest}
      ref={href}
      id={id}
      className={clsx(
        className,
        'relative scroll-mt-[calc(var(--header-height)+theme(spacing.6))]'
      )}
    >
      {!id ? (
        children
      ) : (
        <Link
          href={href ?? `#${id}`}
          className="group"
          onClick={() => {
            if (href || !id) return

            navigator.clipboard.writeText(
              window.location.origin + window.location.pathname + `#${id}`
            )
          }}
        >
          {children}
          {!href && (
            <Link2Icon
              width={15}
              height={15}
              className="text-dark-muted relative mb-1 ml-2 inline-block translate-y-1 align-middle opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus:translate-y-0 group-focus:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
            />
          )}
        </Link>
      )}
    </Element>
  )
}
