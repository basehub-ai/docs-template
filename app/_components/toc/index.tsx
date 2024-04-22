'use client'

import * as React from 'react'
import Link from 'next/link'
import { RichText, RichTextProps } from 'basehub/react-rich-text'
import { ChevronUpIcon } from '@radix-ui/react-icons'

import { flattenRichTextNodes, getOffsetTop } from './utils'

import s from './toc.module.scss'
import { Box, Button, Flex, Text } from '@radix-ui/themes'

export type TocProps = RichTextProps & {
  currentSectionId?: string
  children: any
}

export const Toc = ({ blocks, children }: TocProps) => {
  const [currentSectionId, setCurrentSectionId] = React.useState('')
  const disabled = React.useRef(false)
  const tocRef = React.useRef<HTMLElement>(null)
  const backToTopButton = React.useRef<HTMLButtonElement>(null)

  const setHighlightedSection = React.useCallback((sectionId: string) => {
    setCurrentSectionId((prevState) => {
      if (disabled.current) return prevState
      return sectionId
    })
  }, [])

  const headingListLength = flattenRichTextNodes(children).filter((item) => {
    if (!('marks' in item)) return false

    return item?.marks?.some((mark) => mark.type === 'link')
  }).length

  React.useEffect(() => {
    const handleScroll = () => {
      let lastActive = ''
      const headingList = Array.from(
        document.querySelectorAll<HTMLHeadingElement>('h1, h2, h3, h4, h5, h6')
      ).filter((node) => node.id)

      if (
        window.innerHeight + Math.round(window.scrollY) >=
          document.documentElement.scrollHeight &&
        !window.location.hash
      ) {
        lastActive = headingList[headingListLength - 1]?.id ?? ''
      } else {
        for (const heading of headingList) {
          const element = document.getElementById(heading.id)
          const offsetTop = getOffsetTop(element)

          if (
            element &&
            // Element is scrolled to the half of the screen bottom
            offsetTop <= window.innerHeight / 2 + Math.round(window.scrollY)
          ) {
            lastActive = heading.id
          } else {
            break
          }
        }
      }

      setHighlightedSection(lastActive)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [headingListLength, setHighlightedSection])

  const handleScroll = React.useCallback(() => {
    if (!backToTopButton.current) return
    const scrollY = Math.round(window.scrollY)

    if (scrollY > 300) {
      backToTopButton.current.style.opacity = '1'
      backToTopButton.current.style.pointerEvents = 'auto'
    } else {
      backToTopButton.current.style.opacity = '0'
      backToTopButton.current.style.pointerEvents = 'none'
    }
  }, [])

  React.useEffect(() => {
    if (!backToTopButton.current) return

    handleScroll()
  }, [handleScroll])

  React.useEffect(() => {
    if (!tocRef.current) return

    const colorToRgb = (color: string) => {
      const match = /color\(display-p3\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/.exec(
        color
      )

      if (!match) return null

      const [_, r, g, b] = match
      if (r === undefined || g === undefined || b === undefined) return null

      return {
        r: Math.round(parseFloat(r) * 255),
        g: Math.round(parseFloat(g) * 255),
        b: Math.round(parseFloat(b) * 255),
      }
    }

    const accentIndicatorShade = colorToRgb(
      getComputedStyle(tocRef.current).getPropertyValue('--accent-indicator')
    )

    if (!accentIndicatorShade) return

    tocRef.current.style.setProperty(
      '--accent-indicator-r',
      accentIndicatorShade.r.toString()
    )
    tocRef.current.style.setProperty(
      '--accent-indicator-g',
      accentIndicatorShade.g.toString()
    )
    tocRef.current.style.setProperty(
      '--accent-indicator-b',
      accentIndicatorShade.b.toString()
    )
  }, [])

  React.useEffect(() => {
    if (!backToTopButton.current) return

    document.addEventListener('scroll', handleScroll)

    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  return (
    <aside ref={tocRef} className={s.toc}>
      {Boolean(children) && (
        <>
          <Text asChild size="2" weight="medium" mb="1">
            <p>On this page</p>
          </Text>
          <RichText
            blocks={blocks}
            components={{
              ol: ({ children, ...props }) => (
                <Box asChild position="relative">
                  <Text size="2" asChild>
                    <ol {...props}>{children}</ol>
                  </Text>
                </Box>
              ),
              li: ({ children }) => (
                <Box asChild pl="3">
                  <Text asChild size="2">
                    <li>{children}</li>
                  </Text>
                </Box>
              ),
              a: ({ href, children }) => {
                if (!children) return <></>
                const childrenAsString = children.toString()
                return (
                  <Link
                    href={href}
                    data-active={href === `#${currentSectionId}`}
                    onClick={() => {
                      setHighlightedSection(href.split('#')[1] as string)
                      disabled.current = true
                      setTimeout(() => (disabled.current = false), 400)
                    }}
                  >
                    <span>
                      {childrenAsString.length < 35
                        ? childrenAsString
                        : childrenAsString.slice(0, 35) + '...'}
                    </span>
                  </Link>
                )
              },
            }}
          >
            {children}
          </RichText>
        </>
      )}

      <Flex asChild align="center" gap="2">
        <Button
          mt="7"
          radius="full"
          color="gray"
          ref={backToTopButton}
          style={{ opacity: 0, pointerEvents: 'none' }}
          className={s['back-to-top']}
          onClick={() => {
            document.documentElement.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        >
          Back to top
          <Flex align="center" justify="center">
            <ChevronUpIcon width={10} height={10} />
          </Flex>
        </Button>
      </Flex>
    </aside>
  )
}
