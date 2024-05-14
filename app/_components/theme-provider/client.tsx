'use client'

import { useThemeContext } from '@radix-ui/themes'
import { ThemeSettingsFragment } from './server'
import * as React from 'react'
import { useTheme } from 'next-themes'

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
  const { setTheme } = useTheme()

  React.useEffect(() => {
    onAccentColorChange(theme.accentColor as any)
    onRadiusChange(theme.radius as any)
    onGrayColorChange(theme.grayScale as any)
    onAppearanceChange(theme.appearance as any)
    onScalingChange(theme.scaling as any)
    setTheme((p) => {
      const changed = p !== theme.appearance
      if (!changed) return p
      if (!theme.appearance || theme.appearance === 'system') return 'system'
      return theme.appearance
    })
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
  ])

  return null
}
