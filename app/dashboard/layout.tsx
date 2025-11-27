"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, LayoutDashboard, ListChecks, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/mode-toggle";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Leads", href: "/dashboard/leads", icon: ListChecks },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* SIDEBAR */}
      <aside className="hidden md:flex md:flex-col w-64 border-r bg-card">
        <div className="h-16 px-6 border-b flex items-center gap-2">
          <Sun className="text-yellow-500" />
          <span className="font-bold text-xl">SunQuote AI</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={active ? "default" : "ghost"}
                  className="w-full justify-start gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-medium">Your Account</p>
            <p className="text-xs text-muted-foreground">
              {/* later: show user's email from session */}
              logged in
            </p>
          </div>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">
        {/* TOPBAR */}
        <header className="h-16 border-b px-4 md:px-6 flex items-center justify-between bg-background/80 backdrop-blur">
          <div className="flex items-center gap-2 md:hidden">
            <Sun className="text-yellow-500" />
            <span className="font-bold text-lg">SunQuote AI</span>
          </div>

          <div className="hidden md:block text-lg font-semibold">
            Dashboard
          </div>

          <div className="flex items-center gap-3">
            <ModeToggle />
            {/* later: add notifications / profile dropdown */}
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 md:p-6 bg-muted/30">
          {children}
        </main>
      </div>
    </div>
  );
}
