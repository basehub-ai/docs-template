import { Pump } from "@/.basehub/react-pump";
import { NavLink } from "./nav-link";

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
    >
      {async ([data]) => {
        "use server";

        let firstPageLinkId: string | null = null;

        return (
          <nav className="bg-gray-50 border-y border-gray-200 h-pages-nav">
            <div className="container mx-auto flex gap-4 items-center h-full">
              {data.header.navLinks.items.map((navLink) => {
                const label = navLink.label ?? navLink.page?._title;
                const href =
                  navLink.href ??
                  (navLink.page?._slug ? `/${navLink.page._slug}` : "");
                if (!label || !href) return null;

                const isPageLink = !!navLink.page;
                if (!firstPageLinkId && isPageLink) {
                  firstPageLinkId = navLink._id;
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
                );
              })}
            </div>
          </nav>
        );
      }}
    </Pump>
  );
};
