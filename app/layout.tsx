import { Header } from './_components/header'
import { Footer } from './_components/footer'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { ThemeProvider } from './_components/theme-provider/server'
import { Toolbar } from 'basehub/next-toolbar'
import '../basehub.config'
import Script from 'next/script'

import './globals.css'

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}>
        <ThemeProvider>
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
        <Toolbar />

        <Script src="https://agent.basehub.com/main/HfmlGB2hmtEx4KB1hnewD/embed.js?session=eyJhbGciOiJIUzI1NiJ9.eyJ0b2tlbiI6ImJzaGJfcGtfeGtiNWhyN3p4Nm0wdXU4ZDRmYXJrYXJkZnllbmdyanYwdzExYTFtYTJzeDk3ZjFpejR1Njd0eTN3eTY2azRzdyIsInJlcG9JZCI6IlJ6d2N3R0tTaGNCMHBCbU9pVXNlWSIsImFnZW50SWQiOiJIZm1sR0IyaG10RXg0S0IxaG5ld0QifQ.e5blrlXzj-HtaQ5j--TIjZadKqaVsw20xiPCOeA2h8k" />
      </body>
    </html>
  )
}
