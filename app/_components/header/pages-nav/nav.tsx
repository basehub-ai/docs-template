'use client'

import * as React from 'react'
import { Flex, Text } from '@radix-ui/themes'
import { HeaderFragment } from '.'
import { NavLink } from './nav-link'

export const Nav = ({ navLinks }: HeaderFragment) => {
  const navLinksRef = React.useRef<HTMLAnchorElement[]>([])

  let firstPageLinkId: string | null = null

  return (
    <Flex asChild align="center" height="100%">
      <nav>
        {navLinks.items.map((navLink) => {
          const label = navLink.label ?? navLink.page?._title
          const href =
            navLink.href ??
            (navLink.page?._slug ? `/${navLink.page._slug}` : '')
          if (!label || !href) return null

          const isPageLink = !!navLink.page
          if (!firstPageLinkId && isPageLink) {
            firstPageLinkId = navLink._id
          }

          return (
            <NavLink
              ref={(ref) => {
                if (!ref) return
                if (navLinksRef.current.includes(ref)) return

                navLinksRef.current.push(ref)
              }}
              href={href}
              data-slug={navLink.page?._slug}
              key={navLink._id}
              isFirstPageLink={isPageLink && navLink._id === firstPageLinkId}
            >
              <Text weight="medium" size="2" wrap="nowrap">
                {label}
              </Text>
            </NavLink>
          )
        })}
      </nav>
    </Flex>
  )
}
