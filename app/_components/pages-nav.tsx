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

        return (
          <nav className="bg-gray-50 border-y border-gray-200 h-pages-nav">
            <div className="container mx-auto flex gap-4 items-center h-full">
              {data.header.navLinks.items.map((navLink) => {
                const label = navLink.label ?? navLink.page?._title;
                const href =
                  navLink.href ??
                  (navLink.page?._slug ? `/${navLink.page._slug}` : "");
                if (!label || !href) return null;
                return (
                  <NavLink href={href} key={navLink._id}>
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
