"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  href: string;
  activeClass?: string;
};
export default function LinkItem({ children, href, activeClass }: Props) {
  const pathName = usePathname();

  const classes = {
    linkItem: "font-[500] text-[#333]",
  };

  return (
    <Link
      className={`${classes.linkItem} ${
        pathName === href ? activeClass || "text-[#9e0d1d]" : ""
      }`}
      href={href}
    >
      {children}
    </Link>
  );
}
