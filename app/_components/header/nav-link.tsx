"use client";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import s from "./nav-link.module.scss";

export const NavLink = ({
  children,
  href,
  isFirstPageLink,
}: {
  children?: React.ReactNode;
  href: string;
  isFirstPageLink?: boolean;
}) => {
  const pathname = usePathname();
  const isActive =
    pathname === "/" ? isFirstPageLink : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={clsx(
        "h-full flex text-gray-500 font-medium text-sm items-center relative",
        s.navLink
      )}
      data-active={isActive}
    >
      {children}
      <div
        className={clsx(
          "absolute w-full h-px bg-brand -bottom-px rounded-full",
          s.activeIndicator
        )}
      />
    </Link>
  );
};
