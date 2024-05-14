'use client'

import * as React from 'react'
import { Flex, Text } from '@radix-ui/themes'
import { ArticleSlugFragment, HeaderFragment } from '.'
import { NavLink } from './nav-link'

export const Nav = ({
  subNavLinks,
}: {
  subNavLinks: HeaderFragment['subNavLinks']
}) => {
  const navLinksRef = React.useRef<HTMLAnchorElement[]>([])

  let firstPageLinkId: string | null = null

  const getFirstHref = (
    navLink: HeaderFragment['subNavLinks']['items'][number]
  ) => {
    const navLinkSlug = `/${navLink.page?._slug}`
    const firstChild = navLink.page?.articles.items[0]
    const firstSlugs = firstChild
      ? `${navLinkSlug}/${firstChild._slug}`
      : navLinkSlug

    if (!firstChild) return firstSlugs

    const plusChildren =
      firstSlugs + recursivelyGetFirstChildrenSlugs(firstChild)

    return plusChildren
  }

  const recursivelyGetFirstChildrenSlugs = (
    article: ArticleSlugFragment
  ): string => {
    const firstChild = article.children.items?.[0]
    if (!firstChild) return ''
    if (!firstChild?.children.items.length) return `/${firstChild._slug}`

    return recursivelyGetFirstChildrenSlugs(firstChild)
  }

  return (
    <Flex asChild align="center" height="100%">
      <nav>
        {subNavLinks.items.map((navLink) => {
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
              href={getFirstHref(navLink)}
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
