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

  useEffect(() => {
    if (!document) return

    const colorToRgb = (color: string) => {
      const match = /color\(display-p3\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/.exec(
        color
      )

      if (!match) return null

      const [_, r, g, b] = match
      if (r === undefined || g === undefined || b === undefined) return null

      return {
        r: Math.round(parseFloat(r) * 255),
        g: Math.round(parseFloat(g) * 255),
        b: Math.round(parseFloat(b) * 255),
      }
    }

    const rootTheme = document.querySelector('div[data-is-root-theme="true"]')
    if (!rootTheme) return
    const accentIndicatorShade = colorToRgb(
      getComputedStyle(rootTheme).getPropertyValue('--accent-indicator')
    )

    if (!accentIndicatorShade) return

    document.documentElement.style.setProperty(
      '--accent-indicator-r',
      accentIndicatorShade.r.toString()
    )
    document.documentElement.style.setProperty(
      '--accent-indicator-g',
      accentIndicatorShade.g.toString()
    )
    document.documentElement.style.setProperty(
      '--accent-indicator-b',
      accentIndicatorShade.b.toString()
    )
  }, [theme.accentColor])

  return null
}
