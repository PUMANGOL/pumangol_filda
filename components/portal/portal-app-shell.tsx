"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, PlusCircle, Menu, X, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  PortalExpiryBanner,
  PortalExpiredScreen,
} from "@/components/portal/portal-access-ui";

const navItems = [
  { href: "/my-pumangol", label: "Dashboard", icon: LayoutDashboard },
  { href: "/my-pumangol/leads", label: "Leads", icon: Users },
  { href: "/my-pumangol/leads/new", label: "Nova Lead", icon: PlusCircle },
];

type PortalAppShellProps = {
  email: string;
  expiresAt: number;
  children: React.ReactNode;
};

export function PortalAppShell({
  email,
  expiresAt,
  children,
}: PortalAppShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expired, setExpired] = useState(() => expiresAt <= Date.now());

  useEffect(() => {
    if (expiresAt <= Date.now()) {
      setExpired(true);
      return;
    }
    const id = window.setTimeout(
      () => setExpired(true),
      Math.max(0, expiresAt - Date.now())
    );
    return () => window.clearTimeout(id);
  }, [expiresAt]);

  if (expired) {
    return <PortalExpiredScreen email={email} />;
  }

  return (
    <div className="min-h-screen flex bg-surface">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-border flex flex-col transition-transform duration-200",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
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

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/my-pumangol/leads/new"
                ? pathname === href
                : pathname === href ||
                  (href !== "/my-pumangol" &&
                    pathname.startsWith(href) &&
                    pathname !== "/my-pumangol/leads/new");
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

        <div className="px-3 py-4 border-t border-border">
          <div className="flex items-start gap-3 rounded-lg px-3 py-2.5 bg-muted/50">
            <Mail className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">
                Utilizador do portal
              </p>
              <p className="text-sm font-medium text-foreground truncate">
                {email}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <PortalExpiryBanner expiresAt={expiresAt} />

        <header className="lg:hidden sticky top-0 z-30 flex items-center gap-3 bg-white border-b border-border px-4 h-14 shadow-sm">
          <button
            type="button"
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
