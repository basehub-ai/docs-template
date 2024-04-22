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
    onPanelBackgroundChange,
    onScalingChange,
  } = useThemeContext()

  useEffect(() => {
    onAccentColorChange(theme.accentColor as any)
    onRadiusChange(theme.radius as any)
    onGrayColorChange(theme.grayScale as any)
    onPanelBackgroundChange(theme.panelBackground as any)
    onScalingChange(theme.scaling as any)
  }, [
    theme.accentColor,
    theme.radius,
    theme.grayScale,
    theme.panelBackground,
    theme.scaling,
    onAccentColorChange,
    onGrayColorChange,
    onPanelBackgroundChange,
    onRadiusChange,
    onScalingChange,
  ])

  return null
}
