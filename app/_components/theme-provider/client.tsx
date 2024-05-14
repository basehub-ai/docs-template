'use client'

import { useThemeContext } from '@radix-ui/themes'
import { ThemeSettingsFragment } from './server'
import * as React from 'react'

export const LiveThemeSwitcher = ({
  theme,
}: {
  theme: ThemeSettingsFragment['theme']
}) => {
  const {
    onAccentColorChange,
    onRadiusChange,
    onGrayColorChange,
    onScalingChange,
    onAppearanceChange,
  } = useThemeContext()

  React.useEffect(() => {
    onAccentColorChange(theme.accentColor as any)
    onRadiusChange(theme.radius as any)
    onGrayColorChange(theme.grayScale as any)
    onAppearanceChange(theme.appearance as any)
    onScalingChange(theme.scaling as any)
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
  ])

  return null
}
