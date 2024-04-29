'use client'

import * as React from 'react'
import NextLink from 'next/link'
import { Flex, Link, Text } from '@radix-ui/themes'
import { SlashIcon } from '@radix-ui/react-icons'

export type ArticleBreadcrumb = { title: string; slug: string }[]

export const ArticleBreadcrumb = ({ breadcrumb }: { breadcrumb: ArticleBreadcrumb }) => {
  return (
    <Flex align="center">
      {breadcrumb.map((segment, index) => {
        const href =
          index === 0
            ? '/'
            : `/${breadcrumb
                .slice(0, index + 1)
                .map((segment) => segment.slug)
                .join('/')}`

        if (index === breadcrumb.length - 1) {
          return (
            <Text size="2" ml="1" weight="medium" key={index} wrap="nowrap">
              {segment.title}
            </Text>
          )
        }

        return (
          <React.Fragment key={index}>
            <Link
              asChild
              color="gray"
              size="2"
              ml={index > 0 ? '1' : '0'}
              mr={index < breadcrumb.length - 1 ? '1' : '0'}
              wrap="nowrap"
            >
              <NextLink href={href}>{segment.title}</NextLink>
            </Link>
            {index < breadcrumb.length - 1 && <SlashIcon color="gray" />}
          </React.Fragment>
        )
      })}
    </Flex>
  )
}
