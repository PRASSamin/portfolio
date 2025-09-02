"use client";
import { Button } from "@/components/ui/button";
import { Github } from "./icons/github";
import { Link } from "@/components/Link";
import Image from "next/image";
import { Menu } from "lucide-react";
import React, { FC, useRef } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HomeIcon, FolderGit2, Library, User } from "lucide-react";
import { ThemeSwitcher } from "./ThemeSwitcher";

export const navItems = [
  {
    href: "/",
    name: "Home",
    icon: HomeIcon,
  },
  {
    href: "/projects",
    name: "Projects",
    icon: FolderGit2,
  },
  {
    href: "/blogs",
    name: "Blogs",
    icon: Library,
  },
  {
    href: "/about",
    name: "About",
    icon: User,
  },
  {
    href: "https://github.com/PRASSamin",
    name: "GitHub",
    icon: Github,
    isExternal: true,
  },
];

const NavigationBar: FC<React.ComponentPropsWithoutRef<"header">> = ({
  className,
  ...props
}) => {
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (pathname) {
      document.getElementById("closeNav")?.click();
    }
  }, [pathname]);

  return (
    <header
      className={cn(
        "w-full h-16 bg-background/50 backdrop-blur-sm border-b border-border/50 py-4 relative z-20",
        className
      )}
      {...props}
    >
      <div className="flex justify-between items-center w-[calc(100vw-2rem)] lg:container mx-auto h-full">
        <Link className="h-full" href={"/"}>
          <Image
            className="h-full w-auto pras-logo"
            src={"/logo.svg"}
            width={250}
            priority
            alt="PRAS"
            height={250}
          />
        </Link>
        <div className="flex items-center justify-center gap-4 md:gap-10">
          <ul className="hidden md:flex items-center justify-center gap-5">
            {navItems.map(({ href, name }, i) => {
              return <MenuLink key={i} href={href} name={name} />;
            })}
          </ul>
          <div className="hidden md:block h-[40px] w-px bg-muted-foreground/50" />
          <div className="hidden md:flex items-center gap-2">
            <ThemeSwitcher />
            <Button
              className="cursor-pointer [&_svg]:size-5  p-0 aspect-square  rounded group w-9 hover:w-[120px] transition-all duration-300 hidden md:flex"
              variant={"ghost"}
              asChild
            >
              <Link target="_blank" href={"https://github.com/PRASSamin"}>
                <Github className="ml-2 group-hover:ml-0 transition-all duration-300" />
                <span className="overflow-hidden">PRASSamin</span>
              </Link>
            </Button>
          </div>
          <ThemeSwitcher className="md:hidden" />
          <Popover>
            <PopoverTrigger asChild className="md:hidden">
              <button ref={mobileMenuRef}>
                <Menu className="cursor-pointer hover:bg-muted/50 h-8 w-8 p-1 rounded duration-300 transition-all" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 mt-4 mr-2 bg-popover/60 backdrop-blur-sm rounded-xl border-border/50 flex md:hidden flex-col gap-3">
              {navItems.map(({ href, name, icon: Icon, ...rest }) => {
                return (
                  <Link
                    href={href}
                    target={rest?.isExternal ? "_blank" : "_self"}
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
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
};

export default NavigationBar;

const MenuLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<typeof Link> & { name: string; href: string }
>(({ name, href, ...props }, ref) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link {...props} href={href} ref={ref}>
      <li className={isActive ? "font-bold" : ""}>{name}</li>
    </Link>
  );
});

MenuLink.displayName = "MenuLink";
