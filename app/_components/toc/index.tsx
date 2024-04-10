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

  React.useEffect(() => {
    const consoleLogCurrentScrollPercentage = () => {
      const scrollPercentage = Math.round(window.scrollY)
      console.log(scrollPercentage)
    }

    document.addEventListener('scroll', consoleLogCurrentScrollPercentage)

    return () => {
      document.removeEventListener('scroll', consoleLogCurrentScrollPercentage)
    }
  }, [])

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

      <button className="tracking-default bg-[rgba(244,244,245,0.64)] rounded-round mt-10 leading-4 p-1.5 pl-3 text-xs text-normal flex items-center">
        Back to top
        <span className='shadow-[0px_1px_2px_0px_rgba(9,9,11,0.04)] border border-info-border rounded-round bg-white ml-2 inline-flex items-center justify-center w-4 h-4'>
          <ChevronUpIcon width={10} height={10} />
        </span>
      </button>
    </aside>
  )
}
