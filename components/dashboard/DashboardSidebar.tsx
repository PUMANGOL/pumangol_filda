"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/lib/constants";

const links = [
  { href: ROUTES.dashboard, label: "Leads", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: ROUTES.interno, label: "Nova Lead", icon: "M12 4v16m8-8H4" },
  { href: ROUTES.home, label: "Site FILDA", icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="relative hidden w-64 shrink-0 border-r border-border bg-white lg:block">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href={ROUTES.home}>
          <Image src="/pumangol-logo.png" alt="Pumangol" width={120} height={28} className="w-auto h-auto" />
        </Link>
      </div>
      <nav className="p-4">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted">
          FILDA 2026
        </p>
        <ul className="space-y-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-pumangol-red/10 text-pumangol-red"
                      : "text-gray-600 hover:bg-surface hover:text-gray-900"
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                  </svg>
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-0 w-64 border-t border-border p-4">
        <div className="rounded-xl bg-surface p-4">
          <p className="text-xs font-semibold text-gray-900">Agenda de Follow-up</p>
          <p className="mt-1 text-xs text-muted">5 contactos agendados para hoje</p>
        </div>
      </div>
    </aside>
  );
}
