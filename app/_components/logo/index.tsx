'use client'

import { Flex, Link, VisuallyHidden } from '@radix-ui/themes'
import NextLink from 'next/link'
import clsx from 'clsx'

import s from './logo.module.scss'

export const Logo = ({
  logoLight,
  logoDark,
  size = 'md',
}: {
  logoLight: string
  logoDark: string
  size?: 'sm' | 'md' | 'lg'
}) => {
  const resolvedSizeClassName = clsx({
    [s['logo--sm'] as string]: size === 'sm',
    [s['logo--md'] as string]: size === 'md',
    [s['logo--lg'] as string]: size === 'lg',
  })

  return (
    <Flex position="relative" className={resolvedSizeClassName}>
      <Link asChild>
        <NextLink href="/">
          <VisuallyHidden>Home</VisuallyHidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            data-light-only
            src={logoLight}
            alt="logo"
            className={clsx(s.logo, resolvedSizeClassName)}
            style={{ position: 'absolute' }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            data-dark-only
            src={logoDark}
            alt="logo"
            className={clsx(s.logo, resolvedSizeClassName)}
          />
        </NextLink>
      </Link>
    </Flex>
  )
}
