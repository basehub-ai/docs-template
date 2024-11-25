import { Header } from './_components/header'
import { Footer } from './_components/footer'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { ThemeProvider } from './_components/theme-provider/server'
import { Toolbar } from 'basehub/next-toolbar'

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
      </body>
    </html>
  )
}
