'use client'

import { useTheme } from 'next-themes'
import { Button, Flex } from '@radix-ui/themes'
import { Half2Icon } from '@radix-ui/react-icons'

import { MoonIcon, SunIcon } from '../../icons'

import s from './theme-switcher.module.scss'

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme()

  return (
    <Flex
      className={s['theme-switcher__wrapper']}
      align="center"
      justify="center"
    >
      <Button
        onClick={() => setTheme('light')}
        data-active={theme === 'light'}
        className={s['theme-switcher__button']}
        radius="full"
      >
        <SunIcon width={16} height={16} color="currentColor" />
      </Button>
      <Button
        onClick={() => setTheme('system')}
        data-active={theme === 'system'}
        className={s['theme-switcher__button']}
        radius="full"
      >
        <Half2Icon width={16} height={16} color="currentColor" />
      </Button>
      <Button
        onClick={() => setTheme('dark')}
        data-active={theme === 'dark'}
        className={s['theme-switcher__button']}
        radius="full"
      >
        <MoonIcon width={16} height={16} color="currentColor" />
      </Button>
    </Flex>
  )
}
