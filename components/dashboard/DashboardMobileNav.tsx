"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/lib/constants";

const links = [
  { href: ROUTES.dashboard, label: "Leads" },
  { href: ROUTES.interno, label: "Nova" },
  { href: ROUTES.home, label: "Site" },
];

export function DashboardMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-border bg-white lg:hidden">
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-1 flex-col items-center py-3 text-xs font-medium ${
              active ? "text-pumangol-red" : "text-gray-500"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
