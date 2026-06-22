"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { DASHBOARD_NAV } from "./nav-links";

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-dvh w-20 shrink-0 flex-col border-r border-border bg-white md:flex lg:w-64">
      <div className="flex h-14 shrink-0 items-center justify-center border-b border-border px-2 sm:h-16 lg:justify-start lg:px-6">
        <Link href={ROUTES.home} className="flex items-center">
          <Image
            src="/pumangol-logo.png"
            alt="Pumangol"
            width={200}
            height={40}
            loading="eager"
            className="hidden h-auto w-[11rem] lg:block"
          />
          <Image
            src="/pumangol-logo.png"
            alt="Pumangol"
            width={200}
            height={50}
            loading="eager"
            className="h-auto w-[4.75rem] object-contain object-left lg:hidden"
          />
        </Link>
      </div>

      <nav className="flex flex-1 flex-col overflow-y-auto p-2 lg:p-4">
        <p className="mb-2 hidden px-3 text-xs font-semibold uppercase tracking-wider text-muted lg:block">
          FILDA 2026
        </p>
        <ul className="space-y-1">
          {DASHBOARD_NAV.map((link) => {
            const active = pathname === link.href;
            const Icon = link.icon;

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  title={link.label}
                  aria-label={link.label}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center justify-center gap-3 rounded-xl px-2 py-2.5 transition-colors lg:justify-start lg:px-3 ${
                    active
                      ? "bg-pumangol-red/10 text-pumangol-red"
                      : "text-gray-600 hover:bg-surface hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" strokeWidth={active ? 2.25 : 2} />
                  <span className="hidden text-sm font-medium lg:inline">
                    {link.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
