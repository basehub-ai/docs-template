import { basehub, fragmentOn } from '@/.basehub'
import { Theme } from '@radix-ui/themes'
import { ThemeProvider as NextThemesThemeProvider } from 'next-themes'
import { Pump } from '@/.basehub/react-pump'
import { LiveThemeSwitcher } from './client'
import { draftMode } from 'next/headers'

import '@radix-ui/themes/styles.css'

export const ThemeSettingsFragment = fragmentOn('Settings', {
  theme: {
    accentColor: true,
    appearance: true,
    grayScale: true,
    panelBackground: true,
    radius: true,
    scaling: true,
  },
})

export type ThemeSettingsFragment = fragmentOn.infer<
  typeof ThemeSettingsFragment
>

export const ThemeProvider = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  const data = await basehub().query({
    settings: ThemeSettingsFragment,
  })

  return (
    <NextThemesThemeProvider attribute="class">
      <Theme
        accentColor={data.settings.theme.accentColor as any}
        grayColor={data.settings.theme.grayScale as any}
        radius={data.settings.theme.radius as any}
        scaling={data.settings.theme.scaling as any}
        panelBackground={data.settings.theme.panelBackground as any}
      >
        {children}
        <Pump
          queries={[{ settings: ThemeSettingsFragment }]}
          draft={draftMode().isEnabled}
        >
          {async ([data]) => {
            'use server'

            return <LiveThemeSwitcher theme={data.settings.theme} />
          }}
        </Pump>
      </Theme>
    </NextThemesThemeProvider>
  )
}
