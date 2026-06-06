"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  Users,
  BarChart2,
  PlusCircle,
  Sun,
  Moon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/leads", label: "All Leads", icon: Users, exact: false },
  { href: "/analytics", label: "Analytics", icon: BarChart2, exact: true },
  { href: "/leads/add", label: "Add Lead", icon: PlusCircle, exact: true },
];

export default function Appsidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border px-3 py-3 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-md bg-primary flex items-center justify-center shrink-0">
            <Users className="size-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            <span className="text-primary">Lead</span>CRM
          </span>
        </div>
        <SidebarTrigger className="size-8 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
            {nav.map(({ href, label, icon: Icon, exact }) => {
              const active = exact
                ? pathname === href
                : pathname === href ||
                (pathname.startsWith(href) && pathname !== "/leads/add");

              return (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    isActive={active}
                    className={
                      active
                        ? "bg-primary/15 text-foreground font-semibold border-l-2 border-primary"
                        : "text-muted-foreground hover:bg-accent/60 hover:text-sidebar-foreground"
                    }
                  >
                    <Link href={href} className="flex items-center gap-2 w-full">
                      <Icon className={`w-4 h-4 ${active ? "text-primary" : ""}`} />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-2 space-y-1">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-sidebar-foreground transition-colors"
        >
          {!mounted ? (
            <span className="w-4 h-4" />
          ) : theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
          <span>
            {!mounted ? "" : theme === "dark" ? "Light Mode" : "Dark Mode"}
          </span>
        </button>

        <div className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-accent cursor-pointer transition-colors">
          <div className="w-6 h-6 rounded-full bg-primary/20 text-primary text-[10px] font-semibold flex items-center justify-center shrink-0">
            AD
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium truncate">Admin</p>
            <p className="text-[10px] text-muted-foreground truncate">
              admin@crm.io
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}