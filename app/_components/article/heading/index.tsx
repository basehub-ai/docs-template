'use client'

import * as React from 'react'
import { Link2Icon } from '@radix-ui/react-icons'
import { Box, Link, Heading as RadixHeading } from '@radix-ui/themes'

import NextLink from 'next/link'

import s from './heading.module.scss'

type HeadingProps = JSX.IntrinsicElements['h1'] & {
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  href?: string
}

export const Heading = ({ children, as, id, href }: HeadingProps) => {
  const size = as === 'h1' ? '8' : as === 'h2' ? '6' : as === 'h3' ? '4' : '3'
  const marginTop = as === 'h1' ? '8' : as === 'h2' ? '7' : '6'

  return (
    <RadixHeading
      as={as}
      id={id}
      className={s.heading}
      size={size}
      mb="3"
      mt={marginTop}
    >
      {!id ? (
        children
      ) : (
        <Link asChild>
          <NextLink
            href={href ?? `#${id}`}
            onClick={() => {
              if (href || !id) return

              navigator.clipboard.writeText(
                window.location.origin + window.location.pathname + `#${id}`
              )
            }}
          >
            {children}
            {!href && (
              <Box
                asChild
                display="inline-block"
                position="relative"
                ml="2"
                mb="1"
              >
                <Link2Icon width={15} height={15} />
              </Box>
            )}
          </NextLink>
        </Link>
      )}
    </RadixHeading>
  )
}
