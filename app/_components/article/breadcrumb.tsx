'use client'

import * as React from 'react'
import NextLink from 'next/link'
import { Link, Text } from '@radix-ui/themes'

export type Breadcrumb = { title: string; slug: string }[]

export const Breadcrumb = ({ breadcrumb }: { breadcrumb: Breadcrumb }) => {
  return breadcrumb.map((segment, index) => (
    <React.Fragment key={index}>
      <Link asChild color="gray" size="2">
        <NextLink href={'segment'}>{segment.title}</NextLink>
      </Link>
      <Text size="2" weight="medium" color="gray">
        {index < breadcrumb.length - 1 && ' / '}
      </Text>
    </React.Fragment>
  ))
}
