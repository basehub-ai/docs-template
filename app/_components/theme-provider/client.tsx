'use client'

import { useThemeContext } from '@radix-ui/themes'
import { ThemeSettingsFragment } from './server'
import { useEffect } from 'react'

export const LiveThemeSwitcher = ({
  theme,
}: {
  theme: ThemeSettingsFragment['theme']
}) => {
  const {
    onAccentColorChange,
    onRadiusChange,
    onGrayColorChange,
    onAppearanceChange,
    onPanelBackgroundChange,
    onScalingChange,
  } = useThemeContext()

  useEffect(() => {
    onAccentColorChange(theme.accentColor as any)
    onRadiusChange(theme.radius as any)
    onGrayColorChange(theme.grayScale as any)
    onAppearanceChange(theme.appearance as any)
    onPanelBackgroundChange(theme.panelBackground as any)
    onScalingChange(theme.scaling as any)
  }, [
    theme.accentColor,
    theme.radius,
    theme.grayScale,
    theme.appearance,
    theme.panelBackground,
    theme.scaling,
    onAccentColorChange,
    onAppearanceChange,
    onGrayColorChange,
    onPanelBackgroundChange,
    onRadiusChange,
    onScalingChange,
  ])

  return null
}
