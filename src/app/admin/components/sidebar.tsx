"use client";
import {
  Building2,
  FolderGit2,
  GraduationCap,
  Home,
  Library,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils";

const items = [
  {
    title: "Home",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Project",
    url: "/admin/projects",
    icon: FolderGit2,
  },
  {
    title: "Blog",
    url: "/admin/blogs",
    icon: Library,
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
];

const AdminSidebar = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const pathname = usePathname();
  return (
    <SidebarProvider>
      <Sidebar
        tClassName="md:!w-[260px] lg:!w-[--sidebar-width]"
        className="border-r md:!w-[260px] lg:!w-[--sidebar-width]"
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
                        <item.icon className="!size-5" />
                        <span className="hidden md:block">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      {children}
    </SidebarProvider>
  );
};

export default AdminSidebar;
