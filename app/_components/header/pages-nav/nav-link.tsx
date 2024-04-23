'use client'

import * as React from 'react'
import { Flex, Link, Text } from '@radix-ui/themes'
import { usePathname } from 'next/navigation'
import NextLink from 'next/link'

import s from './nav.module.scss'

export const NavLink = React.forwardRef<
  HTMLAnchorElement,
  {
    children?: React.ReactNode
    href: string
    isFirstPageLink?: boolean
  } & JSX.IntrinsicElements['a']
>(({ children, href, isFirstPageLink, ...rest }, ref) => {
  const pathname = usePathname()
  const isActive =
    pathname === '/' ? isFirstPageLink : pathname.startsWith(href)

  return (
    <Flex height="100%" align="center" asChild>
      <Link asChild color="gray">
        <Text size="2" asChild>
          <NextLink
            {...rest}
            ref={ref}
            href={href}
            className={s.nav__link}
            data-active={isActive}
          >
            {children}
          </NextLink>
        </Text>
      </Link>
    </Flex>
  )
})
NavLink.displayName = 'NavLink'
