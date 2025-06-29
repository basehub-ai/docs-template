import { Header } from './_components/header'
import { Footer } from './_components/footer'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { ThemeProvider } from './_components/theme-provider/server'
import { Toolbar } from 'basehub/next-toolbar'
import Script from 'next/script'
import { basehub } from 'basehub'

import '../basehub.config'
import './globals.css'

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const data = await basehub().query({
    _agents: {
      docsAi: {
        embedUrl: true,
      },
    },
  })

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}>
        <ThemeProvider>
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
        <Toolbar />

        <Script src={data._agents.docsAi.embedUrl} />
      </body>
    </html>
  )
}
