"use client";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const NavLink = ({
  children,
  href,
}: {
  children?: React.ReactNode;
  href: string;
}) => {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={clsx(
        "h-full flex text-gray-500 font-medium text-sm items-center relative",
        isActive && "!text-black"
      )}
    >
      {children}
      {isActive && (
        <div className="absolute w-full h-px bg-brand -bottom-px rounded-full" />
      )}
    </Link>
  );
};
