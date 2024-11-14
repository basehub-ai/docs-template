'use client'

import * as React from 'react'
import { search as searchRaw } from 'basehub/search'
import { useSearch, SearchBox, Hit } from 'basehub/react-search'
import { Cross1Icon, MagnifyingGlassIcon } from '@radix-ui/react-icons'
import {
  Box,
  Button,
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
import { clsx } from 'clsx'
import { getAritcleSlugFromSlugPath } from '@/basehub-helpers/util'
import { flushSync } from 'react-dom'

import s from './search.module.scss'

export const SearchProvider = ({
  _searchKey,
  searchCategories,
  children,
}: {
  _searchKey: string
  searchCategories: HeaderFragment['subNavLinks']['items']
  children: React.ReactNode
}) => {
  const [open, setOpen] = React.useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = React.useState('__all__')

  const search = useSearch({
    _searchKey,
    queryBy: ['_title', 'body', 'excerpt'],
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
        setOpen((p) => !p)
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
          _searchKey={_searchKey}
        />
      </SearchBox.Root>
    </Dialog.Root>
  )
}

const DialogContent = ({
  searchCategories,
  selectedCategoryId,
  onCategoryChange,
  _searchKey,
}: {
  searchCategories: HeaderFragment['subNavLinks']['items']
  selectedCategoryId: string
  onCategoryChange: (_id: string) => void
  _searchKey: string
}) => {
  const search = SearchBox.useContext()
  const inputRef = React.useRef<HTMLInputElement>(null)

  const selectedCategoryLabel =
    searchCategories.find(
      (category) => category.page?._id === selectedCategoryId
    )?.page?._title ?? 'All'

  return (
    <Dialog.Content
      maxWidth="min(100vw - var(--space-6), 550px)"
      className={s['search-dialog__content']}
    >
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
            <Button
              variant="ghost"
              type="button"
              style={{ cursor: 'default', alignSelf: 'center' }}
              onClick={(e) => {
                e.preventDefault()
                searchRaw(
                  'k19b3p50ue6irgvnp-1.a1.typesense.net:GgYNFpR4dI2LLmCb8erFh5Q97CIMHpOy:yJC5bzTqgSCGwIzeylItr__6cilu6IceejaWHUYQoIWC__GOSCkL1oxXpFlktOiuZY_',
                  search.query,
                  {
                    queryBy: ['__embedding'],
                    excludeFields: ['__embedding'],
                    // @ts-ignore
                    conversation: true,
                    conversation_model_id: 'conv-model-1',
                    // conversation_id: 'b87559a3-febc-4282-a580-b5df133d1fb4',
                  }
                )
              }}
            >
              <TextField.Slot style={{ cursor: 'default' }} gap="2">
                <Kbd style={{ marginBlock: 'auto' }}>Tab</Kbd>
                <Text size="2">to Ask AI</Text>
              </TextField.Slot>
            </Button>
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
              <Text size="1" weight="medium" mr="1" wrap="nowrap">
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
                <Select.Trigger className={s['search-dialog-category']}>
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
    <SearchBox.HitList>
      {isRecent && (
        <Text weight="medium" color="gray" size="1" ml="3" mb="1" as="p">
          Recent searches
        </Text>
      )}
      {hits.map((hit) => {
        let pathname = getAritcleSlugFromSlugPath(hit.document._slugPath ?? '')

        const bodyHighlight = hit._getFieldHighlight('body')

        if (
          bodyHighlight?.highlightedField?._type === 'rich-text-section' &&
          bodyHighlight.highlightedField._id
        ) {
          pathname += `#${bodyHighlight.highlightedField._id}`
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
                  fallbackFieldPaths={['excerpt']}
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
    </SearchBox.HitList>
  )
}

export const DialogTriggerMobile = () => {
  return (
    <Dialog.Trigger>
      <IconButton variant="soft" size="2">
        <MagnifyingGlassIcon width={16} height={16} />
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
