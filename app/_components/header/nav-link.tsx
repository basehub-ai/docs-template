'use client'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import s from './nav-link.module.scss'

export const NavLink = ({
  children,
  href,
  isFirstPageLink,
}: {
  children?: React.ReactNode
  href: string
  isFirstPageLink?: boolean
}) => {
  const pathname = usePathname()
  const isActive =
    pathname === '/' ? isFirstPageLink : pathname.startsWith(href)

  return (
    <Link
      href={href}
      className={clsx(
        'relative flex h-full items-center text-sm font-medium text-gray-500',
        s.navLink
      )}
      data-active={isActive}
    >
      {children}
      <div
        className={clsx(
          'absolute -bottom-px h-px w-full rounded-full bg-brand',
          s.activeIndicator
        )}
      />
    </Link>
  )
}
