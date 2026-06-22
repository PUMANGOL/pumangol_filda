"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DASHBOARD_NAV } from "./nav-links";

export function DashboardMobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 backdrop-blur-sm md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="mx-auto flex max-w-lg">
        {DASHBOARD_NAV.map((link) => {
          const active = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-[3.75rem] flex-1 flex-col items-center justify-center gap-0.5 px-2 py-2 transition-colors ${
                active ? "text-pumangol-red" : "text-gray-500 active:text-gray-700"
              }`}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                  active ? "bg-pumangol-red/10" : ""
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.25 : 2} />
              </span>
              <span className="text-[11px] font-medium leading-none">
                {link.shortLabel}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
