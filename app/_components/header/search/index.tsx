'use client'

import * as React from 'react'
import { useSearch, SearchBox } from 'basehub/react-search'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import {
  Box,
  Card,
  Dialog,
  Flex,
  Kbd,
  Link,
  Select,
  Separator,
  Text,
  TextField,
} from '@radix-ui/themes'
import NextLink from 'next/link'
import { HeaderFragment } from '../pages-nav'

import s from './search.module.scss'

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

  const search = useSearch({
    _searchKey,
    queryBy: ['_title', 'body'],
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
      <SearchBox.Root search={search}>
        <DialogContent
          searchCategories={searchCategories}
          onClose={() => {
            setOpen(false)
          }}
        />
      </SearchBox.Root>
    </Dialog.Root>
  )
}

const DialogContent = ({
  searchCategories,
  onClose,
}: {
  searchCategories: HeaderFragment['navLinks']['items']
  onClose: () => void
}) => {
  const search = SearchBox.useContext()

  const [selectedSearchCategoryId, setSelectedSearchCategoryId] =
    React.useState(searchCategories?.[0]?._id ?? '')

  const selectedCat = searchCategories.find(
    (category) => category._id === selectedSearchCategoryId
  )

  const selectedCategoryLabel =
    selectedCat?.label ?? selectedCat?.page?._title ?? 'Untitled Category'

  return (
    <Dialog.Content maxWidth="550px" className={s['search-dialog__content']}>
      <Flex direction="column" height="100%">
        <SearchBox.Input asChild>
          <TextField.Root placeholder="Search" mx="2" mt="2" size="3">
            <TextField.Slot>
              <MagnifyingGlassIcon color="currentColor" />
            </TextField.Slot>
            <TextField.Slot>
              <Kbd style={{ marginBlock: 'auto' }}>Esc</Kbd>
            </TextField.Slot>
          </TextField.Root>
        </SearchBox.Input>
        <Separator size="4" mt="2" />
        <Box
          className={s['search-dialog__results']}
          flexGrow="1"
          flexShrink="1"
          flexBasis="0%"
          p="2"
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
            <Flex align="center" px="2" py="1">
              <Text
                size="2"
                color="gray"
                className={s['search-dialog__empty-state']}
              >
                Start typing to search...
              </Text>
            </Flex>
          </SearchBox.Placeholder>
          <SearchBox.HitsList>
            {search.result?.hits.map((hit, index) => {
              let pathname =
                // TODO add this function to utils or something as it's being used in the draft enable route.

                // _slugPath will have something like root/pages/<category>/articles/<page>/children/<page>/children/<page>...
                // remove root/pages and then filter out every other part
                '/' +
                hit.document._slugPath
                  ?.replace('root/pages/', '')
                  .split('/')
                  .filter((_part, index) => {
                    return index % 2 === 0
                  })
                  .join('/')

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
                  className={s['search-dialog-content__result']}
                >
                  <Card variant="ghost" size="2" asChild>
                    <Link asChild>
                      <SearchBox.HitItem hit={hit} href={pathname} asChild>
                        <NextLink
                          data-index={index}
                          tabIndex={-1}
                          className={s['search-dialog-content__result-link']}
                          href={pathname}
                          onClick={onClose}
                        >
                          <SearchBox.HitSnippet
                            fieldPath="_title"
                            components={{
                              container: ({ children }) => (
                                <Text size="2" weight="medium">
                                  {children}
                                </Text>
                              ),
                            }}
                          />
                          <SearchBox.HitSnippet
                            fieldPath="body"
                            components={{
                              container: ({ children }) => (
                                <Text size="1" as="p" color="gray" mt="1">
                                  {children}
                                </Text>
                              ),
                            }}
                          />
                        </NextLink>
                      </SearchBox.HitItem>
                    </Link>
                  </Card>
                </Box>
              )
            })}
          </SearchBox.HitsList>
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
