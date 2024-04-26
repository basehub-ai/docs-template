'use client'

import { Link, VisuallyHidden } from '@radix-ui/themes'
import NextLink from 'next/link'
import { useTheme } from 'next-themes'
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
  const { resolvedTheme } = useTheme()
  const resolvedSizeClassName = clsx({
    [s['logo--sm'] as string]: size === 'sm',
    [s['logo--md'] as string]: size === 'md',
    [s['logo--lg'] as string]: size === 'lg',
  })

  return (
    <Link asChild>
      <NextLink href="/">
        <VisuallyHidden>Home</VisuallyHidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoLight}
          alt="logo"
          className={clsx(s.logo, resolvedSizeClassName)}
          style={{
            visibility: resolvedTheme === 'dark' ? 'hidden' : 'visible',
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoDark}
          alt="logo"
          className={clsx(s.logo, resolvedSizeClassName)}
          style={{
            visibility: resolvedTheme === 'dark' ? 'visible' : 'hidden',
          }}
        />
      </NextLink>
    </Link>
  )
}
