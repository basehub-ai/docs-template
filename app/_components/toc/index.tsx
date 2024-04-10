'use client'

import * as React from 'react'
import Link from 'next/link'
import { RichText, RichTextProps } from 'basehub/react-rich-text'
import { ChevronUpIcon } from '@radix-ui/react-icons'

import { flattenRichTextNodes, getOffsetTop } from './utils'

import s from './toc.module.scss'

export type TocProps = RichTextProps & {
  currentSectionId?: string
  children: any
}

export const Toc = ({ blocks, children }: TocProps) => {
  const [currentSectionId, setCurrentSectionId] = React.useState('')
  const disabled = React.useRef(false)
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
    if (!backToTopButton.current) return

    document.addEventListener('scroll', handleScroll)

    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  return (
    <aside className={s.toc}>
      {Boolean(children) && (
        <>
          <p className="mb-1 flex items-center text-sm font-medium leading-normal text-strong">
            On this page
          </p>
          <RichText
            blocks={blocks}
            components={{
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

      <button
        ref={backToTopButton}
        style={{ opacity: 0, pointerEvents: 'none' }}
        onClick={() => {
          document.documentElement.scrollTo({ top: 0, behavior: 'smooth' })
        }}
        className="tracking-default bg-light rounded-round mt-10 flex items-center bg-opacity-65 p-1.5 pl-3 text-xs leading-4 text-normal transition-[opacity,background-color] duration-300 hover:bg-opacity-100"
      >
        Back to top
        <span className="rounded-round ml-2 inline-flex h-4 w-4 items-center justify-center border border-info-border bg-white shadow-[0px_1px_2px_0px_rgba(9,9,11,0.04)]">
          <ChevronUpIcon width={10} height={10} />
        </span>
      </button>
    </aside>
  )
}
