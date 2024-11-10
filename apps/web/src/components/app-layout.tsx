import React from "react";
import { AppSidebar } from "./app-sidebar";
import { Separator } from "./ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "./ui/sidebar";

export const AppLayout = ({
  children,
  title,
  actions,
}: {
  children: React.ReactNode;
  title: string;
  actions?: React.ReactNode;
}) => {
  return (
    <SidebarProvider className="block md:flex">
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 justify-between items-center gap-2 border-b p-4">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="text-sm font-medium">{title}</div>
          </div>
          {actions}
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};
