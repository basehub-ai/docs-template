'use client'

import * as React from 'react'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import {
  Box,
  Card,
  Dialog,
  Flex,
  IconButton,
  Kbd,
  Link,
  Select,
  Separator,
  Text,
  TextField,
} from '@radix-ui/themes'
import NextLink from 'next/link'
import { usePointerIdle } from '@/hooks/use-pointer-idle'
import { HeaderFragment } from '../pages-nav'

import s from './search.module.scss'

const SEARCH_RESULTS = [
  'Getting started',
  'Guides',
  'Components',
  'API',
  'Examples',
  'More info',
  'Setup',
  'API Reference',
  'Tests',
  'Integrations',
  'Routing',
]

export const Search = ({
  searchCategories,
}: {
  searchCategories: HeaderFragment['navLinks']['items']
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'k' && event.metaKey) {
        event.preventDefault()
        setOpen((o) => !o)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === 'Enter' &&
        document.activeElement === inputRef.current
      ) {
        event.preventDefault()
        setOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {/* mobile */}
      <Dialog.Trigger tabIndex={-1}>
        <Box display={{ sm: 'none' }}>
          <IconButton variant="soft">
            <MagnifyingGlassIcon />
          </IconButton>
        </Box>
      </Dialog.Trigger>

      {/* >= md */}
      <Dialog.Trigger>
        <Box display={{ initial: 'none', sm: 'block' }}>
          <TextField.Root
            ref={inputRef}
            readOnly
            placeholder="Search"
            size="2"
            radius="large"
            onClick={() => setOpen(true)}
            className={s['search-trigger']}
          >
            <TextField.Slot>
              <MagnifyingGlassIcon color="currentColor" />
            </TextField.Slot>
            <TextField.Slot>
              <Flex align="center" justify="between" gap="1">
                <Kbd>⌘</Kbd>
                <Kbd>k</Kbd>
              </Flex>
            </TextField.Slot>
          </TextField.Root>
        </Box>
      </Dialog.Trigger>

      <DialogContent searchCategories={searchCategories} />
    </Dialog.Root>
  )
}

const DialogContent = ({
  searchCategories,
}: {
  searchCategories: HeaderFragment['navLinks']['items']
}) => {
  const searchResultsRef = React.useRef<HTMLDivElement>(null)
  const pointerIdle = usePointerIdle(1000)
  const [selectedResultIndex, setSelectedResultIndex] = React.useState(0)
  const [search, setSearch] = React.useState('')
  const [selectedSearchCategoryId, setSelectedSearchCategoryId] =
    React.useState(searchCategories?.[0]?._id ?? '')

  React.useEffect(() => {
    if (!searchResultsRef.current) return

    const selectedResultAnchor = searchResultsRef.current.querySelector(
      `a[data-index="${selectedResultIndex}"]`
    ) as HTMLElement

    const selectedResultElement = selectedResultAnchor.parentElement

    if (!selectedResultElement) return
    const containerHeight = searchResultsRef.current.offsetHeight
    const containerScrollTop = searchResultsRef.current.scrollTop
    const elementOffsetTop = selectedResultElement.offsetTop
    const elementOffsetHeight = selectedResultElement.offsetHeight
    const containerPaddingTop = parseInt(
      window.getComputedStyle(searchResultsRef.current).paddingTop
    )
    const containerPaddingBottom = parseInt(
      window.getComputedStyle(searchResultsRef.current).paddingBottom
    )

    if (
      elementOffsetTop < containerScrollTop + containerPaddingTop ||
      elementOffsetTop + elementOffsetHeight >
        containerScrollTop + containerHeight - containerPaddingBottom
    ) {
      selectedResultElement.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedResultIndex])

  const results = SEARCH_RESULTS.filter((item) => item.includes(search))
  const selectedCat = searchCategories.find(
    (category) => category._id === selectedSearchCategoryId
  )
  const selectedCategoryLabel =
    selectedCat?.label ?? selectedCat?.page?._title ?? 'Untitled Category'

  return (
    <Dialog.Content maxWidth="550px" className={s['search-dialog__content']}>
      <Flex direction="column" height="100%">
        <TextField.Root
          placeholder="Search"
          mx="2"
          mt="2"
          size="3"
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (!['ArrowDown', 'ArrowUp'].includes(e.key)) return

            setSelectedResultIndex((_selectedResultIndex) => {
              if (
                e.key === 'ArrowDown' &&
                _selectedResultIndex < SEARCH_RESULTS.length - 1
              ) {
                return _selectedResultIndex + 1
              } else if (e.key === 'ArrowUp' && _selectedResultIndex > 0) {
                return _selectedResultIndex - 1
              }

              return _selectedResultIndex
            })
          }}
        >
          <TextField.Slot>
            <MagnifyingGlassIcon color="currentColor" />
          </TextField.Slot>
          <TextField.Slot>
            <Kbd style={{ marginBlock: 'auto' }}>Esc</Kbd>
          </TextField.Slot>
        </TextField.Root>
        <Separator size="4" mt="2" />
        <Box
          className={s['search-dialog__results']}
          ref={searchResultsRef}
          flexGrow="1"
          flexShrink="1"
          flexBasis="0%"
          p="2"
        >
          {!results.length ? (
            <Flex align="center" px="2" py="1">
              <Text
                size="2"
                color="gray"
                className={s['search-dialog__empty-state']}
              >
                No results for{' '}
                <Text as="span" weight="bold">
                  &ldquo;{search}&rdquo;
                </Text>
              </Text>
            </Flex>
          ) : (
            results.map((item, index) => {
              return (
                <Box key={index} className={s['search-dialog-content__result']}>
                  <Card variant="ghost" size="2" asChild>
                    <Link asChild>
                      <NextLink
                        data-index={index}
                        data-selected={selectedResultIndex === index}
                        onMouseOver={() => {
                          if (pointerIdle) return
                          setSelectedResultIndex(index)
                        }}
                        tabIndex={-1}
                        className={s['search-dialog-content__result-link']}
                        href="#"
                      >
                        <Text size="2" weight="medium">
                          {item}
                        </Text>
                        <Text size="1" as="p" color="gray" mt="1">
                          Lorem ipsum dolor sit amet. Lorem ipsum dolor sit
                          amet.
                        </Text>
                      </NextLink>
                    </Link>
                  </Card>
                </Box>
              )
            })
          )}
        </Box>
        {searchCategories.length && (
          <>
            <Separator size="4" />
            <Box className={s['search-dialog-content__footer']} py="1" px="3">
              <Text size="2" weight="medium" mr="1">
                Show results from:&nbsp;
              </Text>
              <Select.Root
                size="1"
                defaultValue="all"
                onValueChange={setSelectedSearchCategoryId}
              >
                <Select.Trigger radius="large">
                  {selectedCategoryLabel}
                </Select.Trigger>
                <Select.Content>
                  {searchCategories.map((category) => (
                    <Select.Item key={category._id} value={category._id}>
                      {category.label ?? category.page?._title}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Box>
          </>
        )}
      </Flex>
    </Dialog.Content>
  )
}
