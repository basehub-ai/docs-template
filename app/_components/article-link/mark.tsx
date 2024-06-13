import * as React from 'react'
import { getAritcleSlugFromSlugPath } from '@/basehub-helpers/util'
import { Heading, HoverCard, Link, Text } from '@radix-ui/themes'
import { fragmentOn } from 'basehub'
import NextLink from 'next/link'

export const ArticleLinkFragment = fragmentOn('ArticleLinkComponent', {
  _id: true,
  __typename: true,
  target: {
    _slugPath: true,
    _title: true,
    titleSidebarOverride: true,
    excerpt: true,
  },
  anchor: true,
})

type ArticleLinkFragment = fragmentOn.infer<typeof ArticleLinkFragment>

export const ArticleLinkMark = ({
  children,
  target,
  anchor,
}: {
  children: React.ReactNode
} & ArticleLinkFragment) => {
  let href = getAritcleSlugFromSlugPath(target._slugPath)
  if (anchor) {
    href += `#${anchor.startsWith('#') ? anchor.slice(1) : anchor}`
  }

  return (
    <HoverCard.Root>
      <HoverCard.Trigger>
        <Link asChild>
          <NextLink href={href}>{children}</NextLink>
        </Link>
      </HoverCard.Trigger>
      <HoverCard.Content size="1">
        <Heading size="2" mb="1">
          {target.titleSidebarOverride || target._title}
        </Heading>
        {target.excerpt && (
          <Text
            size="2"
            color="gray"
            style={{
              maxWidth: 320,
              // line clamp
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3,
            }}
          >
            {target.excerpt}
          </Text>
        )}
      </HoverCard.Content>
    </HoverCard.Root>
  )
}
