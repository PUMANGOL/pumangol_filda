"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, PlusCircle, Menu, X } from "lucide-react";
import { useState } from "react";
import type { User } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import { SidebarUserMenu } from "@/components/account/sidebar-user-menu";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/leads/new", label: "Nova Lead", icon: PlusCircle },
];

export function AppShell({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-border flex flex-col transition-transform duration-200",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex flex-col items-center px-6 py-6 border-b border-border">
          <Image
            src="/pumangol-logo.png"
            alt="Pumangol"
            width={160}
            height={40}
            className="h-30 w-auto -m-10"
            priority
          />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/leads/new"
                ? pathname === "/leads/new"
                : pathname === href || (href !== "/dashboard" && pathname.startsWith(href) && pathname !== "/leads/new");
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User menu */}
        <div className="px-3 py-4 border-t border-border">
          <SidebarUserMenu user={user} onLogout={handleLogout} />
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top bar (mobile) */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center gap-3 bg-white border-b border-border px-4 h-14 shadow-sm">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-muted-foreground hover:text-foreground"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
          <Image
            src="/pumangol-logo.png"
            alt="Pumangol"
            width={120}
            height={28}
            className="h-7 w-auto"
          />
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
