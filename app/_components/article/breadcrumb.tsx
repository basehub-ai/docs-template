'use client'

import * as React from 'react'
import NextLink from 'next/link'
import { Flex, Link, Text } from '@radix-ui/themes'
import { SlashIcon } from '@radix-ui/react-icons'

export type ArticleBreadcrumb = { title: string; slug: string }[]

export const ArticleBreadcrumb = ({
  breadcrumb,
}: {
  breadcrumb: ArticleBreadcrumb
}) => {
  return (
    <Flex align="center" wrap="wrap">
      {breadcrumb.map((segment, index) => {
        const href = `/${breadcrumb
          .slice(0, index + 1)
          .map((segment) => segment.slug)
          .join('/')}`

        if (index === breadcrumb.length - 1) {
          return (
            <React.Fragment key={index}>
              <Text as="span" size="2" weight="medium" wrap="nowrap">
                {segment.title}
              </Text>
              {breadcrumb.length === 1 && (
                <SlashIcon color="gray" style={{ flexShrink: 0 }} />
              )}
            </React.Fragment>
          )
        }

        return (
          <React.Fragment key={index}>
            <Link asChild color="gray" size="2" wrap="nowrap">
              <NextLink href={href}>{segment.title}</NextLink>
            </Link>
            <SlashIcon color="gray" style={{ flexShrink: 0 }} />
          </React.Fragment>
        )
      })}
    </Flex>
  )
}
