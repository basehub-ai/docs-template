'use client'

import * as React from 'react'
import { Flex, Link } from '@radix-ui/themes'
import { useSelectedLayoutSegments } from 'next/navigation'
import NextLink from 'next/link'

import s from './nav.module.scss'

export const NavLink = React.forwardRef<
  HTMLAnchorElement,
  {
    children?: React.ReactNode
    href: string
    isFirstPageLink?: boolean
    segmentToMatch?: string
  } & React.JSX.IntrinsicElements['a']
>(({ children, href, isFirstPageLink, segmentToMatch, ...rest }, ref) => {
  const [category] = useSelectedLayoutSegments()
  const isActive = !category
    ? isFirstPageLink
    : href.startsWith(`/${category}`) || segmentToMatch === category

  return (
    <Flex height="100%" align="center" asChild px="2">
      <Link asChild>
        <NextLink
          {...rest}
          ref={ref}
          href={href}
          className={s.nav__link}
          data-active={isActive}
        >
          {children}
        </NextLink>
      </Link>
    </Flex>
  )
})
NavLink.displayName = 'NavLink'
