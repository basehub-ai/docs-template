'use client'

import { Link, VisuallyHidden } from '@radix-ui/themes'
import NextLink from 'next/link'
import { useTheme } from 'next-themes'

import s from './header.module.scss'

export const Logo = ({
  logoLight,
  logoDark,
}: {
  logoLight: string
  logoDark: string
}) => {
  const { resolvedTheme } = useTheme()

  return (
    <Link asChild>
      <NextLink href="/">
        <VisuallyHidden>Home</VisuallyHidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoLight}
          alt="logo"
          className={s['header__logo']}
          style={{
            visibility: resolvedTheme === 'dark' ? 'hidden' : 'visible',
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoDark}
          alt="logo"
          className={s['header__logo']}
          style={{
            visibility: resolvedTheme === 'dark' ? 'visible' : 'hidden',
          }}
        />
      </NextLink>
    </Link>
  )
}
