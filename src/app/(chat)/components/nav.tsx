"use client";
import { Button } from "@/components/ui/button";
import { Github } from "@/components/icons/github";
import Link from "next/link";
import Image from "next/image";
import { MenuLink } from "@/components/MenuItem";
import { Menu } from "lucide-react";
import React, { useRef } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/utils";
import { UserMenu, UserMenuButton } from "../../../components/UserMenu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { navItems } from "@/components/nav";
import { useUser } from "@/hooks/useUser";

const ChatNavBar = () => {
  const { isSignedIn } = useUser();
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (pathname) {
      mobileMenuRef.current?.click();
    }
  }, [pathname]);

  return (
    <header
      className={cn(
        "w-full h-16 bg-muted/50 backdrop-blur border-b py-4 relative z-20"
      )}
    >
      <div className="flex justify-between items-center w-[calc(100vw-2rem)] lg:container mx-auto h-full">
        <a className="h-full" href={"/"}>
          <Image
            className="h-full w-auto pras-logo"
            src={"/logo-b.svg"}
            width={250}
            height={250}
            alt="pras-logo"
          />
        </a>
        <div className="flex items-center justify-center gap-10">
          <ul className="hidden md:flex items-center justify-center gap-5">
            {navItems.map(({ href, name }, i) => {
              return <MenuLink key={i} href={href} name={name} />;
            })}
          </ul>
          <div className="hidden md:block h-[40px] w-[1px] bg-muted-foreground/50" />
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
          </div>
          {isSignedIn && <UserMenuButton />}

          <div className="block md:hidden h-[40px] w-[1px] bg-muted-foreground/50" />

          <Popover>
            <PopoverTrigger asChild className="md:hidden">
              <button id="navToggler" ref={mobileMenuRef}>
                <Menu className="cursor-pointer hover:bg-muted/50 h-8 w-8 p-1 rounded duration-300 transition-all" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 mt-6 mr-2 bg-popover/60 backdrop-blur rounded-xl flex md:hidden flex-col gap-3">
              {navItems.map(({ href, name, icon: Icon }) => {
                return (
                  <Link
                    href={href}
                    key={name}
                    className="bg-muted/50 hover:bg-muted/70 p-2 rounded-lg flex items-center gap-2"
                    onClick={() => {
                      if (mobileMenuRef.current) {
                        mobileMenuRef.current?.click();
                      }
                    }}
                  >
                    {Icon && (
                      <Icon className="h-[34px] w-[34px] text-muted-foreground bg-background/50 rounded-lg p-2" />
                    )}
                    <span className="text-foreground text-sm">{name}</span>
                  </Link>
                );
              })}

              {isSignedIn && <UserMenu />}
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
};

export default ChatNavBar;
