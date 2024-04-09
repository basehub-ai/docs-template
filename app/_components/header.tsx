import { Pump } from "@/.basehub/react-pump";
import { PagesNav } from "./pages-nav";
import Link from "next/link";

export const Header = () => {
  return (
    <Pump queries={[{ settings: { logo: { url: true } } }]}>
      {async ([data]) => {
        "use server";
        const logo = data.settings.logo.url;

        return (
          <header className="sticky top-0 bg-white z-50">
            <div className="h-site-nav flex items-center container mx-auto">
              <Link href="/">
                <span className="sr-only">Home</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo} alt="logo" className="h-6" />
              </Link>
            </div>
            <PagesNav />
          </header>
        );
      }}
    </Pump>
  );
};
