import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { routes } from "@/routes";
import { BookAudio } from "lucide-react";
import { Link } from "react-router-dom";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link to="/books" className="flex items-center gap-2 h-12">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <BookAudio className="size-4" />
          </div>
          <span className="font-bold">Library</span>
        </Link>
        <hr className="-mx-2" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {routes.map((route) => {
                  if (route.showInSidebar) {
                    return (
                      <SidebarMenuItem key={route.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={route.path === location.pathname}
                        >
                          <Link to={route.path}>{route.title}</Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  }
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
