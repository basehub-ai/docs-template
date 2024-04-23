'use client'

import { useTheme } from 'next-themes'
import { Button, Flex } from '@radix-ui/themes'
import { Half2Icon } from '@radix-ui/react-icons'
import { useHasRendered } from '@/hooks/use-has-rendered'

import { MoonIcon, SunIcon } from '../../icons'

import s from './theme-switcher.module.scss'

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme()
  const hasRendered = useHasRendered()

  return (
    <Flex
      className={s['theme-switcher__wrapper']}
      align="center"
      justify="center"
    >
      <Button
        size="1"
        onClick={() => setTheme('light')}
        data-active={hasRendered && theme === 'light'}
        className={s['theme-switcher__button']}
        radius="full"
      >
        <SunIcon width={16} height={16} color="currentColor" />
      </Button>
      <Button
        size="1"
        onClick={() => setTheme('system')}
        data-active={hasRendered && theme === 'system'}
        className={s['theme-switcher__button']}
        radius="full"
      >
        <Half2Icon width={16} height={16} color="currentColor" />
      </Button>
      <Button
        size="1"
        onClick={() => setTheme('dark')}
        data-active={hasRendered && theme === 'dark'}
        className={s['theme-switcher__button']}
        radius="full"
      >
        <MoonIcon width={16} height={16} color="currentColor" />
      </Button>
    </Flex>
  )
}
