/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { usePathname } from "next/navigation";
import Image from "next/image";
import type { UserRole } from "@/lib/permissions";
import { buildSidebarItems } from "./user/buildSidebar";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { data, isLoading, isError } = useUserInfoQuery(undefined);

  const { isMobile, setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
        Loading sidebar...
      </div>
    );
  }

  if (isError || !data?.data?.role) {
    return (
      <div className="flex items-center justify-center h-full text-red-500 text-sm">
        Failed to load user info
      </div>
    );
  }

  const userRole = (data?.data?.role as UserRole) || "MODERATOR";
  const customPermissions = (data?.data?.permissions as any[]) || undefined;

  const sidebarItems = buildSidebarItems(userRole, customPermissions);

  return (
    <Sidebar {...props}>
      <SidebarHeader className="ml-5">
        <Link href="/" onClick={handleLinkClick}>
          <Image
            src={"/assets/Farin-Fusion-Logo.jpeg"}
            alt="Farin Fusion Logo"
            width={500}
            height={500}
            quality={90}
            className="w-full h-16 rounded-md"
            priority
          />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="max-h-[90vh] pr-2">
          <SidebarGroup>
            <SidebarGroupLabel className="text-amber-700 dark:text-amber-400 font-semibold">
              {userRole === "ADMIN" ? "Admin Panel" : `${userRole} Access`}
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {sidebarItems.map((item, idx) => {
                  const isActive = pathname === item.href;
                  return (
                    <SidebarMenuItem
                      key={idx}
                      className="transition-all duration-200"
                    >
                      <SidebarMenuButton
                        asChild
                        className={`hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors ${
                          isActive
                            ? "bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100 font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {item.href === "#logout" ? (
                          <button
                            onClick={handleLinkClick}
                            className="w-full flex items-center gap-2"
                            type="button"
                            title={item.description}
                          >
                            {item.icon}
                            <span>{item.title}</span>
                          </button>
                        ) : (
                          <Link
                            href={item.href}
                            onClick={handleLinkClick}
                            className="w-full flex items-center gap-2"
                            title={item.description}
                          >
                            {item.icon}
                            <span>{item.title}</span>
                          </Link>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}