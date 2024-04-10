import { Pump } from '@/.basehub/react-pump'
import { PagesNav } from './pages-nav'
import Link from 'next/link'
import { draftMode } from 'next/headers'

export const Header = () => {
  return (
    <Pump
      queries={[{ settings: { logo: { url: true } } }]}
      next={{ revalidate: 30 }}
      draft={draftMode().isEnabled}
    >
      {async ([data]) => {
        'use server'
        const logo = data.settings.logo.url

        return (
          <header className="sticky top-0 z-50 bg-white">
            <div className="container mx-auto flex h-site-nav items-center">
              <Link href="/">
                <span className="sr-only">Home</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo} alt="logo" className="h-6" />
              </Link>
            </div>
            <PagesNav />
          </header>
        )
      }}
    </Pump>
  )
}
