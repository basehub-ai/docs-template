'use client'

import { useThemeContext } from '@radix-ui/themes'
import { ThemeSettingsFragment } from './server'
import * as React from 'react'
import { useTheme } from 'next-themes'
import { useHasRendered } from '@/hooks/use-has-rendered'

export const LiveThemeSwitcher = ({
  theme,
}: {
  theme: ThemeSettingsFragment
}) => {
  const {
    onAccentColorChange,
    onRadiusChange,
    onGrayColorChange,
    onScalingChange,
    onAppearanceChange,
  } = useThemeContext()
  const { setTheme, theme: activeTheme } = useTheme()
  const activeThemeRef = React.useRef(activeTheme)
  activeThemeRef.current = activeTheme
  const hasRendered = useHasRendered()

  React.useEffect(() => {
    // wait for first render to happen before re-syncing theme
    if (!hasRendered) return
    onAccentColorChange(theme.accentColor as any)
    onRadiusChange(theme.radius as any)
    onGrayColorChange(theme.grayScale as any)
    onAppearanceChange(theme.appearance as any)
    onScalingChange(theme.scaling as any)

    const themeChanged =
      activeThemeRef.current !== theme.appearance &&
      theme.appearance !== 'inherit' &&
      theme.appearance !== 'system'
    if (themeChanged && theme.appearance) {
      if (!theme.appearance || theme.appearance === 'inherit') {
        setTheme('system')
      }
      return setTheme(theme.appearance)
    }
  }, [
    theme.accentColor,
    theme.radius,
    theme.grayScale,
    theme.appearance,
    theme.scaling,
    onAccentColorChange,
    onGrayColorChange,
    onAppearanceChange,
    onRadiusChange,
    onScalingChange,
    setTheme,
    hasRendered,
  ])

  return null
}
