'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Settings, GanttChartSquare, Mountain } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar'; // Corrected import path assuming sidebar.tsx is in ui
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', label: 'Incidències', icon: GanttChartSquare },
  { href: '/dashboard/config', label: 'Configuració', icon: Settings },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { open, setOpen, isMobile } = useSidebar();

  return (
    <Sidebar side="left" variant="sidebar" collapsible={isMobile ? "offcanvas" : "icon"}>
      <SidebarHeader className="border-b">
         <div className={cn("flex items-center gap-2", open || isMobile ? "justify-start" : "justify-center")}>
          <Button variant="link" className={cn("p-0 text-primary hover:no-underline", open || isMobile ? "" : "hidden" )} asChild>
            <Link href="/dashboard" className="flex items-center gap-2">
              <Mountain className="h-7 w-7" />
              <span className="text-xl font-bold font-headline">HotelFlow</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className={cn("text-primary", open || isMobile ? "hidden" : "")} asChild>
             <Link href="/dashboard"><Mountain className="h-7 w-7" /></Link>
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
                  tooltip={item.label}
                  onClick={() => { if (isMobile) setOpen(false);}}
                >
                  <a>
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mt-auto border-t p-2">
        <div className={cn("text-xs text-muted-foreground", open || isMobile ? "" : "text-center")}>
           <span className={cn(open || isMobile ? "" : "hidden")}>© {new Date().getFullYear()}</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
