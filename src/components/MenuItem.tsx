"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

type MenuLinkProps = {
  name: string;
  href: string;
} & React.ComponentPropsWithoutRef<typeof Link>;

export const MenuLink = React.forwardRef<HTMLAnchorElement, MenuLinkProps>(
  ({ name, href, ...props }, ref) => {
    const pathname = usePathname();
    const isActive =
      pathname === href || (href !== "/" && pathname.startsWith(href));

    return (
      <Link {...props} href={href} ref={ref}>
        <li className={isActive ? "font-bold" : ""}>{name}</li>
      </Link>
    );
  }
);

MenuLink.displayName = "MenuLink";
