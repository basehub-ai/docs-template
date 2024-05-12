'use client'

import * as React from 'react'
import { useSearch, SearchBox, Hit } from 'basehub/react-search'
import { Cross1Icon, MagnifyingGlassIcon } from '@radix-ui/react-icons'
import {
  Box,
  Dialog,
  Flex,
  IconButton,
  Kbd,
  ScrollArea,
  Select,
  Separator,
  Text,
  TextField,
} from '@radix-ui/themes'
import NextLink from 'next/link'
import { HeaderFragment } from '../pages-nav'

import s from './search.module.scss'
import { clsx } from 'clsx'
import { getAritcleSlugFromSlugPath } from '@/basehub-helpers/util'
import { flushSync } from 'react-dom'

export const SearchProvider = ({
  _searchKey,
  searchCategories,
  children,
}: {
  _searchKey: string | null
  searchCategories: HeaderFragment['navLinks']['items']
  children: React.ReactNode
}) => {
  const [open, setOpen] = React.useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = React.useState('__all__')

  const search = useSearch({
    _searchKey,
    queryBy: ['_title', 'body'],
    ...(selectedCategoryId !== '__all__' && {
      filterBy: `_idPath:${selectedCategoryId}*`,
    }),
    saveRecentSearches: {
      key: 'docs-recent-searches',
      getStorage: () => localStorage,
    },
  })

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'k' && event.metaKey) {
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
      {children}
      <SearchBox.Root
        search={search}
        onHitSelect={() => {
          setOpen(false)
        }}
        key={open ? 'open' : 'closed'}
      >
        <DialogContent
          searchCategories={searchCategories}
          selectedCategoryId={selectedCategoryId}
          onCategoryChange={(id) => {
            flushSync(() => {
              setSelectedCategoryId(id)
            })
            // flushSync ^ so that we can reset the search with the new filterBy clause being applied
            if (search.valid) {
              search.onQueryChange(search.query)
            }
          }}
        />
      </SearchBox.Root>
    </Dialog.Root>
  )
}

const DialogContent = ({
  searchCategories,
  selectedCategoryId,
  onCategoryChange,
}: {
  searchCategories: HeaderFragment['navLinks']['items']
  selectedCategoryId: string
  onCategoryChange: (_id: string) => void
}) => {
  const search = SearchBox.useContext()
  const inputRef = React.useRef<HTMLInputElement>(null)

  const selectedCategoryLabel =
    searchCategories.find(
      (category) => category.page?._id === selectedCategoryId
    )?.page?._title ?? 'All'

  return (
    <Dialog.Content maxWidth="550px" className={s['search-dialog__content']}>
      <Flex direction="column" height="100%">
        <SearchBox.Input asChild>
          <TextField.Root
            ref={inputRef}
            placeholder="Search"
            mx="2"
            mt="2"
            size="3"
          >
            <TextField.Slot>
              <MagnifyingGlassIcon color="currentColor" />
            </TextField.Slot>
            <TextField.Slot>
              <Kbd style={{ marginBlock: 'auto' }}>Esc</Kbd>
            </TextField.Slot>
          </TextField.Root>
        </SearchBox.Input>
        <Separator size="4" mt="2" />
        <ScrollArea scrollbars="vertical" asChild>
          <Box
            className={s['search-dialog__results']}
            flexGrow="1"
            flexShrink="1"
            flexBasis="0%"
            px="2"
          >
            <SearchBox.Empty asChild>
              <Flex align="center" px="2" py="1">
                <Text
                  size="2"
                  color="gray"
                  className={s['search-dialog__empty-state']}
                >
                  No results for{' '}
                  <Text as="span" weight="bold">
                    &ldquo;{search.query}&rdquo;
                  </Text>
                </Text>
              </Flex>
            </SearchBox.Empty>
            <SearchBox.Placeholder asChild>
              {search.recentSearches?.hits?.length ? (
                <HitList hits={search.recentSearches?.hits ?? []} isRecent />
              ) : (
                <Flex align="center" px="2" py="1">
                  <Text
                    size="2"
                    color="gray"
                    className={s['search-dialog__empty-state']}
                  >
                    No recent searches.
                  </Text>
                </Flex>
              )}
            </SearchBox.Placeholder>

            <HitList hits={search.result?.hits ?? []} />
          </Box>
        </ScrollArea>

        {searchCategories.length && (
          <>
            <Separator size="4" />
            <Flex
              className={s['search-dialog-content__footer']}
              py="1"
              px="3"
              align="center"
            >
              <Text size="1" weight="medium" mr="1">
                Show results from:&nbsp;
              </Text>
              <Select.Root
                size="1"
                defaultValue="all"
                onValueChange={(id) => {
                  onCategoryChange(id)
                  setTimeout(() => {
                    inputRef.current?.focus()
                  }, 16)
                }}
                value={selectedCategoryId}
              >
                <Select.Trigger radius="large">
                  {selectedCategoryLabel}
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value={'__all__'}>All</Select.Item>
                  {searchCategories.map((category) => {
                    if (!category.page) return null
                    return (
                      <Select.Item
                        key={category.page._id}
                        value={category.page._id}
                      >
                        {category.page._title}
                      </Select.Item>
                    )
                  })}
                </Select.Content>
              </Select.Root>
            </Flex>
          </>
        )}
      </Flex>
    </Dialog.Content>
  )
}

const HitList = ({ hits, isRecent }: { hits: Hit[]; isRecent?: boolean }) => {
  const search = SearchBox.useContext()
  return (
    <SearchBox.HitsList>
      {isRecent && (
        <Text weight="medium" color="gray" size="1" ml="3" mb="1" as="p">
          Recent searches
        </Text>
      )}
      {hits.map((hit) => {
        let pathname = getAritcleSlugFromSlugPath(hit.document._slugPath ?? '')

        // TODO is there an opportunity to build a helper function in our SDK here? looks like a common usecase
        const bodyHighlight = hit.highlights
          .map((h) => {
            if (h.fieldPath.startsWith('body') === false) return
            const splitted = h.fieldPath.split('.').slice(0, 2)
            const fullField = hit._getField(splitted.join('.'))
            return fullField
          })
          .filter(Boolean)[0] as { _id: string | undefined } | undefined

        if (bodyHighlight?._id) {
          pathname += `#${bodyHighlight._id}`
        }

        return (
          <Box
            key={hit._key}
            className={clsx(
              s['search-dialog-content__result'],
              isRecent && s['search-dialog-content__result-recent']
            )}
          >
            <SearchBox.HitItem hit={hit} href={pathname} asChild>
              <NextLink
                href={pathname}
                className={s['search-dialog-content__result-link']}
              >
                <SearchBox.HitSnippet
                  fieldPath="_title"
                  components={{
                    container: ({ children }) => (
                      <Text size="2" weight="medium" as="p">
                        {children}
                      </Text>
                    ),
                    ...(isRecent ? { mark: ({ children }) => children } : {}),
                  }}
                />
                <SearchBox.HitSnippet
                  fieldPath="body"
                  components={{
                    container: ({ children }) => (
                      <Text size="1" mt="1" as="p">
                        {children}
                      </Text>
                    ),
                    ...(isRecent ? { mark: ({ children }) => children } : {}),
                  }}
                />
              </NextLink>
            </SearchBox.HitItem>
            {isRecent && (
              <IconButton
                variant="soft"
                color="gray"
                onClick={() => {
                  search.recentSearches?.remove(hit._key)
                }}
                className={s['search-dialog-content__remove']}
                aria-label="Remove recent search"
              >
                <Cross1Icon />
              </IconButton>
            )}
          </Box>
        )
      })}
    </SearchBox.HitsList>
  )
}

export const DialogTriggerMobile = () => {
  return (
    <Dialog.Trigger>
      <IconButton variant="soft">
        <MagnifyingGlassIcon />
      </IconButton>
    </Dialog.Trigger>
  )
}

export const DialogTriggerDesktop = () => {
  return (
    <Dialog.Trigger style={{ width: '100%' }}>
      <button
        style={{
          padding: 0,
          background: 'none',
          border: 'none',
        }}
        tabIndex={-1}
        onFocus={(e) => {
          e.preventDefault()
          e.currentTarget.querySelector('input')?.focus()
        }}
      >
        <TextField.Root
          readOnly
          placeholder="Search"
          size="2"
          radius="large"
          className={s['search-trigger']}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              e.currentTarget.closest('button')?.click()
            }
          }}
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
      </button>
    </Dialog.Trigger>
  )
}
