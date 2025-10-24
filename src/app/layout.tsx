import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Logo } from '@/components/logo';
import { AuthProvider, useAuth } from "@/components/auth/AuthContext";

// Moved to its own file for client-only usage
function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  // Show a loading skeleton while auth state is loading
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center"><span className="animate-pulse text-xl">Loading...</span></div>
    );
  }

  // Only show sidebar and dashboard when authenticated
  if (user) {
    const SidebarProvider = require('@/components/ui/sidebar').SidebarProvider;
    const Sidebar = require('@/components/ui/sidebar').Sidebar;
    const SidebarHeader = require('@/components/ui/sidebar').SidebarHeader;
    const SidebarContent = require('@/components/ui/sidebar').SidebarContent;
    const SidebarMenu = require('@/components/ui/sidebar').SidebarMenu;
    const SidebarMenuItem = require('@/components/ui/sidebar').SidebarMenuItem;
    const SidebarMenuButton = require('@/components/ui/sidebar').SidebarMenuButton;
    const SidebarInset = require('@/components/ui/sidebar').SidebarInset;
    const SidebarFooter = require('@/components/ui/sidebar').SidebarFooter;
    const { LayoutDashboard, FileText } = require('lucide-react');
    const Link = require('next/link');
    return (
      <SidebarProvider>
        <Sidebar variant="sidebar" collapsible="icon">
          <SidebarHeader>
            <Logo className="text-sidebar-foreground" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={{ children: 'Dashboard' }}>
                  <Link href="/">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={{ children: 'Reports' }}>
                  <Link href="/reports">
                    <FileText />
                    <span>Reports</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter />
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

export const metadata: Metadata = {
  title: 'StockPilot',
  description: 'Your smart inventory management co-pilot.',
};

// Ensure this is a server component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Dynamically import client AppLayout to isolate useAuth to client
  const ClientAppLayout = require('./ClientAppLayout').default;
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased h-full')}>
        <AuthProvider>
          <ClientAppLayout>{children}</ClientAppLayout>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
