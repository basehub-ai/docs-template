'use client'

import * as React from 'react'
import { Flex, Text } from '@radix-ui/themes'
import { HeaderFragment } from '.'
import { NavLink } from './nav-link'
import {
  ArticleSlugFragment,
  PageMetaFragment,
} from '@/basehub-helpers/fragments'

export const Nav = ({
  firstCategory,
  subNavLinks: _subNavLinks,
}: {
  firstCategory: PageMetaFragment | undefined
  subNavLinks: HeaderFragment['subNavLinks']
}) => {
  const navLinksRef = React.useRef<HTMLAnchorElement[]>([])

  let firstPageLinkId: string | null = null

  const getFirstHref = ({
    navLink,
    isFirstCategory,
  }: {
    navLink: HeaderFragment['subNavLinks']['items'][number]
    isFirstCategory: boolean
  }) => {
    const navLinkSlug = isFirstCategory ? '' : `/${navLink.page?._slug}`
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

  // include first category in subNavLinks
  const subNavLinks: typeof _subNavLinks.items = React.useMemo(() => {
    if (!firstCategory) return _subNavLinks.items
    return [
      {
        _id: firstCategory._id,
        label: firstCategory._title,
        href: null,
        page: firstCategory,
      },
      ..._subNavLinks.items,
    ]
  }, [_subNavLinks.items, firstCategory])

  return (
    <Flex asChild align="center" height="100%">
      <nav>
        {subNavLinks.map((navLink, i) => {
          const label = navLink.label ?? navLink.page?._title
          if (!label) return null

          const isPageLink = !!navLink.page
          if (!firstPageLinkId && isPageLink) {
            firstPageLinkId = navLink._id
          }

          if (firstCategory) {
            if (i > 0 && navLink.page?._id === firstCategory._id) return null
          }

          return (
            <NavLink
              ref={(ref) => {
                if (!ref) return
                if (navLinksRef.current.includes(ref)) return

                navLinksRef.current.push(ref)
              }}
              href={getFirstHref({ navLink, isFirstCategory: i === 0 })}
              key={navLink._id}
              isFirstPageLink={isPageLink && navLink._id === firstPageLinkId}
              segmentToMatch={navLink.page?._slug}
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
