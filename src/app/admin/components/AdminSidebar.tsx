"use client";
import { Building2, FolderKanban, GraduationCap, Home } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Link } from "@/components/Link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserType } from "@/types";

const items = [
  {
    title: "Home",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Education",
    url: "/admin/educations",
    icon: GraduationCap,
  },
  {
    title: "Experience",
    url: "/admin/experiences",
    icon: Building2,
  },
  {
    title: "Storage",
    url: "/admin/storage",
    icon: FolderKanban,
  },
];

const AdminSidebar = ({
  children,
  user,
}: Readonly<{ children: React.ReactNode; user: UserType }>) => {
  const pathname = usePathname();
  return (
    <SidebarProvider>
      <Sidebar
        tClassName="md:w-[260px]! lg:w-(--sidebar-width)!"
        className="border-r md:w-[260px]! lg:w-(--sidebar-width)!"
      >
        <SidebarContent className="h-full justify-between">
          <SidebarGroup>
            <SidebarGroupLabel className="hidden md:flex">
              Admin
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-3 md:gap-1">
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={cn(
                          "flex items-center justify-center md:justify-start hover:bg-muted/25 transition-all duration-150",
                          pathname === item.url &&
                            "bg-muted/40 hover:bg-muted/40"
                        )}
                      >
                        <item.icon className="size-5!" />
                        <span className="hidden md:block">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarFooter>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar_url} alt={user.name} />
                <AvatarFallback className="rounded-lg">SP</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
            </SidebarMenuButton>
          </SidebarFooter>
        </SidebarContent>
      </Sidebar>
      {children}
    </SidebarProvider>
  );
};

export default AdminSidebar;
