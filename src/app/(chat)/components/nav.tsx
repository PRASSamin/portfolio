"use client";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { Github } from "@/app/components/icons/github";
import Link from "next/link";
import Image from "next/image";
import { MenuLink } from "@/app/components/MenuItem";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";
import UserMenu, { Logout } from "./UserMenu";
import { useClerk } from "@clerk/nextjs";

const ChatNavBar = () => {
  const { signOut } = useClerk();
  const { theme } = useTheme();
  const pathname = usePathname();
  const navItems = [
    {
      href: "/",
      name: "Home",
    },
    {
      href: "/projects",
      name: "Projects",
    },
    {
      href: "/blogs",
      name: "Blogs",
    },
    {
      href: "/about",
      name: "About",
    },
  ];

  React.useEffect(() => {
    if (pathname) {
      document.getElementById("closeNav")?.click();
    }
  }, [pathname]);

  return (
    <header
      className={cn(
        "w-full h-16 bg-muted/50 backdrop-blur border-b py-4 relative z-20",
        pathname === "/chat/nova" && "z-50 bg-black text-white border-[#27272a]"
      )}
    >
      <div className="flex justify-between items-center w-[calc(100vw-2rem)] lg:container mx-auto h-full">
        <a className="h-full" href={"/"}>
          <Image
            style={pathname === "/chat/nova" ? { filter: "invert(100%)" } : {}}
            className="h-full w-auto pras-logo"
            src={"/logo-b.svg"}
            width={250}
            height={250}
            alt="pras-logo"
          />
        </a>
        <div className="flex items-center justify-center gap-10">
          <ul className="hidden lg:flex items-center justify-center gap-5">
            {navItems.map(({ href, name }, i) => {
              return <MenuLink key={i} href={href} name={name} />;
            })}
          </ul>
          <div className="hidden lg:block h-[40px] w-[1px] bg-muted-foreground/50" />
          <div className="flex gap-2 items-center justify-center">
            <Button
              className="cursor-pointer [&_svg]:size-5  p-0 aspect-square border border-muted-foreground/30 rounded group w-9 hover:w-[120px] transition-all duration-300"
              variant={"ghost"}
              asChild
            >
              <Link target="_blank" href={"https://github.com/PRASSamin"}>
                <Github className="ml-2 group-hover:ml-0 transition-all duration-300" />
                <span className="overflow-hidden">PRASSamin</span>
              </Link>
            </Button>
            {pathname !== "/chat/nova" && <ThemeSwitcher />}
          </div>
          <SignedIn>
            <UserButton
              userProfileMode="modal"
              userProfileProps={{
                appearance: {
                  layout: {
                    unsafe_disableDevelopmentModeWarnings: true,
                  },
                  baseTheme: theme === "dark" ? dark : undefined,
                },
              }}
              appearance={{
                layout: {
                  unsafe_disableDevelopmentModeWarnings: true,
                },
                elements: {
                  rootBox: "hidden lg:flex",
                  userButtonPopoverActionButton__signOut: "hidden",
                },
                baseTheme: theme === "dark" ? dark : undefined,
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Action
                  labelIcon={<Logout className={`size-4`} />}
                  label="Sign out"
                  onClick={() => {
                    signOut();
                    window.location.href = `/signin?redirect_url=${encodeURIComponent(
                      window.location.href
                    )}`;
                  }}
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>

          <div className="block lg:hidden h-[40px] w-[1px] bg-muted-foreground/50" />
          <Sheet>
            <SheetTrigger className="block lg:hidden">
              <Menu />
            </SheetTrigger>
            <SheetContent className="flex flex-col justify-between pt-5 pb-[15px] px-[15px]">
              <SheetHeader>
                <SheetTitle className="sr-only">mobile navigation</SheetTitle>
                <ul className="flex flex-col gap-2 items-center">
                  {navItems.map(({ href, name }, i) => {
                    return (
                      <MenuLink
                        className="text-lg"
                        key={i}
                        href={href}
                        name={name}
                      />
                    );
                  })}
                </ul>
              </SheetHeader>
              <SheetFooter>
                <SignedIn>
                  <UserMenu />
                </SignedIn>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default ChatNavBar;
