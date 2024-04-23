'use client'

import * as React from 'react'
import { Box, Flex } from '@radix-ui/themes'
import { HeaderFragment } from '.'
import { NavLink } from './nav-link'
import { useSelectedLayoutSegment } from 'next/navigation'

import s from './nav.module.scss'

export const Nav = ({ navLinks }: HeaderFragment) => {
  const highligterRef = React.useRef<HTMLDivElement>(null)
  const navLinksRef = React.useRef<HTMLAnchorElement[]>([])
  const selectedCategory = useSelectedLayoutSegment()

  let firstPageLinkId: string | null = null

  React.useEffect(() => {
    if (!highligterRef.current || !window) return

    const activeNavElement = navLinksRef.current.find((navLink) => {
      const slug = navLink.getAttribute('data-slug')
      if (!slug) return false
      return selectedCategory === slug
    })

    const handleIndicatorChange = (
      opts: { transition: boolean } = { transition: true }
    ) => {
      if (!highligterRef.current || !window) return

      if (!activeNavElement || !(activeNavElement instanceof HTMLAnchorElement))
        return
      const activeButtonComputedStyles =
        window.getComputedStyle(activeNavElement)

      const transitionDuration = highligterRef.current.style.transitionDuration

      if (!opts.transition) {
        highligterRef.current.style.transitionDuration = '0s'
      }

      highligterRef.current.style.left = `calc(${activeNavElement.offsetLeft}px + ${activeButtonComputedStyles.paddingLeft})`
      highligterRef.current.style.width = `calc(${activeNavElement.offsetWidth}px - ${activeButtonComputedStyles.paddingLeft} - ${activeButtonComputedStyles.paddingRight})`

      highligterRef.current.style.transitionDuration = transitionDuration
    }

    handleIndicatorChange()
    const resizeChange = () => handleIndicatorChange({ transition: false })

    window.addEventListener('resize', resizeChange)

    return () => {
      window.removeEventListener('resize', resizeChange)
    }
  }, [selectedCategory, navLinks.items])

  return (
    <Flex asChild align="center" height="100%">
      <nav className={s.nav}>
        {navLinks.items.map((navLink) => {
          const label = navLink.label ?? navLink.page?._title
          const href =
            navLink.href ??
            (navLink.page?._slug ? `/${navLink.page._slug}` : '')
          if (!label || !href) return null

          const isPageLink = !!navLink.page
          if (!firstPageLinkId && isPageLink) {
            firstPageLinkId = navLink._id
          }

          return (
            <NavLink
              ref={(ref) => {
                if (!ref) return
                if (navLinksRef.current.includes(ref)) return

                navLinksRef.current.push(ref)
              }}
              href={href}
              data-slug={navLink.page?._slug}
              key={navLink._id}
              isFirstPageLink={isPageLink && navLink._id === firstPageLinkId}
            >
              {label}
            </NavLink>
          )
        })}

        <Box
          ref={highligterRef}
          height="1px"
          position="absolute"
          className={s['active-indicator']}
        />
      </nav>
    </Flex>
  )
}
