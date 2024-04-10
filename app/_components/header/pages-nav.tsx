import { Pump } from '@/.basehub/react-pump'
import { NavLink } from './nav-link'
import { draftMode } from 'next/headers'
import { DraftModeHeader } from '../draft'

export const PagesNav = async () => {
  return (
    <Pump
      queries={[
        {
          header: {
            navLinks: {
              items: {
                _id: true,
                page: {
                  _title: true,
                  _slug: true,
                },
                label: true,
                href: true,
              },
            },
          },
        },
      ]}
      next={{ revalidate: 30 }}
      draft={draftMode().isEnabled}
    >
      {async ([data]) => {
        'use server'

        let firstPageLinkId: string | null = null

        return (
          <div className="h-pages-nav border-y border-gray-200 bg-gray-50">
            <div className="container mx-auto flex h-full w-full items-center justify-between gap-4">
              <nav className="flex h-full items-center gap-4">
                {data.header.navLinks.items.map((navLink) => {
                  const label = navLink.label ?? navLink.page?._title
                  const href =
                    navLink.href ??
                    (navLink.page?._slug ? `/${navLink.page._slug}` : '')
                  if (!label || !href) return null

                  const isPageLink = !!navLink.page
                  if (!firstPageLinkId && isPageLink) {
                    firstPageLinkId = navLink._id
                  }

                  return (
                    <NavLink
                      href={href}
                      key={navLink._id}
                      isFirstPageLink={
                        isPageLink && navLink._id === firstPageLinkId
                      }
                    >
                      {label}
                    </NavLink>
                  )
                })}
              </nav>
              {draftMode().isEnabled && <DraftModeHeader />}
            </div>
          </div>
        )
      }}
    </Pump>
  )
}
