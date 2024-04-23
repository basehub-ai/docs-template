'use client'

import * as React from 'react'

import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Box, Dialog, Flex, TextField } from '@radix-ui/themes'

import s from './search.module.scss'

const Search = () => {
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

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Flex asChild align="center" justify="between">
          <button className={s['search__button']}>
            <Flex align="center" justify="between" gap="2">
              <MagnifyingGlassIcon />
              Search
            </Flex>
            <Flex align="center" justify="between" gap="1">
              <Box as="span" className={s['search__keycap']}>
                ⌘
              </Box>
              <Box as="span" className={s['search__keycap']}>
                k
              </Box>
            </Flex>
          </button>
        </Flex>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Flex direction="column" gap="3">
          <label>
            <TextField.Root placeholder="Search" />
          </label>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default Search
