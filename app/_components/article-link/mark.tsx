import * as React from 'react'
import { getArticleSlugFromSlugPath } from '@/basehub-helpers/util'
import { Heading, HoverCard, Link, Text } from '@radix-ui/themes'
import NextLink from 'next/link'
import { Pump } from '@/.basehub/react-pump'
import { ArticleLinkFragment } from './fragment'

export const ArticleLinkMark = async (
  props: {
    children: React.ReactNode
  } & ArticleLinkFragment
) => {
  return (
    <Pump queries={[{ pages: { __args: { first: 1 }, items: { _id: true } } }]}>
      {async ([{ pages }]) => {
        'use server'

        const isInFirstCategory = pages.items[0]
          ? props.target._idPath.includes(pages.items[0]._id)
          : false

        return (
          <ArticleLinkMarkImpl
            {...props}
            isInFirstCategory={isInFirstCategory}
          />
        )
      }}
    </Pump>
  )
}

const ArticleLinkMarkImpl = ({
  children,
  target,
  anchor,
  isInFirstCategory,
}: {
  children: React.ReactNode
  isInFirstCategory: boolean
} & ArticleLinkFragment) => {
  let href = getArticleSlugFromSlugPath(target._slugPath, isInFirstCategory)
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
          {target.sidebarOverrides.title || target._title}
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
