"use client";
import React, { use, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { Logo } from "@/components/logo";
import GuestLanding from "@/components/auth/GuestLanding";
import router, { useRouter } from "next/router";

export default function ClientAppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();


  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="animate-pulse text-xl">Loading...</span>
      </div>
    );
  }

  console.log("useAuth", user);
 
  if (user) {
    const SidebarProvider = require("@/components/ui/sidebar").SidebarProvider;
    const Sidebar = require("@/components/ui/sidebar").Sidebar;
    const SidebarHeader = require("@/components/ui/sidebar").SidebarHeader;
    const SidebarContent = require("@/components/ui/sidebar").SidebarContent;
    const SidebarMenu = require("@/components/ui/sidebar").SidebarMenu;
    const SidebarMenuItem = require("@/components/ui/sidebar").SidebarMenuItem;
    const SidebarMenuButton = require("@/components/ui/sidebar").SidebarMenuButton;
    const SidebarInset = require("@/components/ui/sidebar").SidebarInset;
    const SidebarFooter = require("@/components/ui/sidebar").SidebarFooter;
    const { LayoutDashboard, FileText } = require("lucide-react");
    const Link = require("next/link");
    const Button = require("@/components/ui/button").Button;
    const { logout } = require("@/components/auth/AuthContext");
    return (
      <SidebarProvider>
        <Sidebar variant="sidebar" collapsible="icon">
          <SidebarHeader>
            <Logo className="text-sidebar-foreground" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={{ children: "Dashboard" }}>
                  <Link href="/">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={{ children: "Reports" }}>
                  <Link href="/reports">
                    <FileText />
                    <span>Reports</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <Button className="w-full flex items-center gap-2 py-3 px-4 rounded-lg text-base font-semibold text-sidebar-foreground bg-sidebar-background hover:bg-sidebar-hover transition-all shadow-sm border-0" variant="outline" onClick={logout}>
              <span className="">Logout</span>
            </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div className="h-full bg-background">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // No sidebar shown for guests
  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center">{children}</div>
  );
}