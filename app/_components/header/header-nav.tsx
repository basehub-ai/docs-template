'use client'

import * as React from 'react'

import { Box, Button, Flex, IconButton, Link, Text } from '@radix-ui/themes'
import { Cross1Icon, HamburgerMenuIcon } from '@radix-ui/react-icons'
import NextLink from 'next/link'

import { ThemeSettingsFragment } from '../theme-provider/server'
import { HeaderFragment } from './pages-nav'
import { ThemeSwitcher } from '../theme-switcher'

export const TopRightNavMobile = ({
  appearance,
  topRightLinks,
}: {
  appearance: ThemeSettingsFragment['appearance']
  topRightLinks: HeaderFragment['topRightLinks']
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  return (
    <Flex align="center" gap="3">
      {appearance === 'system' && <ThemeSwitcher />}

      <IconButton
        variant="ghost"
        color="gray"
        size="3"
        onClick={() => setMobileMenuOpen((o) => !o)}
      >
        {mobileMenuOpen ? (
          <Cross1Icon width={16} height={16} />
        ) : (
          <HamburgerMenuIcon width={16} height={16} />
        )}
      </IconButton>

      {mobileMenuOpen && (
        <Box
          position="fixed"
          top="calc(var(--header-head) + 1px)"
          style={{
            zIndex: 50,
            background: 'var(--gray-2)',
            boxShadow: 'var(--shadow-4)',
            borderRadius: '0 0 var(--radius-5) var(--radius-5)',
          }}
          width="100svw"
          left="0"
          maxHeight="100svh"
        >
          <Flex justify="end" py="3" p="1" direction="column">
            {topRightLinks.items.map((item, i, { length }) => {
              const isLast = i === length - 1

              return (
                <Link
                  weight="medium"
                  key={item._id}
                  mx="5"
                  style={{ padding: 'var(--space-2) 0' }}
                  size="4"
                  color={!isLast ? 'gray' : undefined}
                  asChild
                >
                  <NextLink href={item.href}>
                    <Text as="span">{item.label}</Text>
                  </NextLink>
                </Link>
              )
            })}
          </Flex>
        </Box>
      )}
    </Flex>
  )
}

export const TopRightNavDesktop = ({
  appearance,
  topRightLinks,
}: {
  appearance: ThemeSettingsFragment['appearance']
  topRightLinks: HeaderFragment['topRightLinks']
}) => {
  return (
    <Flex align="center" justify="end" gap="4">
      {appearance === 'system' && <ThemeSwitcher />}
      {topRightLinks.items.map((item, i, { length }) => {
        const isLast = i === length - 1
        if (isLast) {
          return (
            <Button key={item._id} asChild size="2">
              <Link asChild>
                <NextLink href={item.href}>{item.label}</NextLink>
              </Link>
            </Button>
          )
        }

        return (
          <Link key={item._id} size="2" color="gray" asChild>
            <NextLink href={item.href}>
              <Text as="span">{item.label}</Text>
            </NextLink>
          </Link>
        )
      })}
    </Flex>
  )
}
