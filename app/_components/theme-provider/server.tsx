import { basehub, fragmentOn } from '@/.basehub'
import { Theme, ThemeProps } from '@radix-ui/themes'
import { ThemeProvider as NextThemesThemeProvider } from 'next-themes'
import { Pump } from '@/.basehub/react-pump'
import { LiveThemeSwitcher } from './client'
import { draftMode } from 'next/headers'

import '@radix-ui/themes/styles.css'

export const ThemeSettingsFragment = fragmentOn('Settings', {
  theme: {
    accentColor: true,
    grayScale: true,
    appearance: true,
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
  const data = await basehub({
    next: { revalidate: 30 },
    draft: draftMode().isEnabled,
  }).query({ settings: ThemeSettingsFragment })

  return (
    <NextThemesThemeProvider attribute="class">
      <Theme
        accentColor={
          data.settings.theme.accentColor as ThemeProps['accentColor']
        }
        grayColor={data.settings.theme.grayScale as ThemeProps['grayColor']}
        radius={data.settings.theme.radius as ThemeProps['radius']}
        scaling={data.settings.theme.scaling as ThemeProps['scaling']}
        appearance={
          (data.settings.theme.appearance === 'inherit'
            ? undefined
            : data.settings.theme.appearance) as ThemeProps['appearance']
        }
      >
        {children}
        <Pump
          queries={[{ settings: ThemeSettingsFragment }]}
          next={{ revalidate: 30 }}
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
