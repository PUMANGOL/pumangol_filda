"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { href: "#sobre", label: "Sobre" },
  { href: "#produtos", label: "Produtos" },
  { href: "#beneficios", label: "Benefícios" },
  { href: "#qr-code", label: "Registo" },
];

type HeaderProps = {
  isLoggedIn?: boolean;
};

export function Header({ isLoggedIn = false }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const ctaHref = isLoggedIn ? ROUTES.dashboard : ROUTES.registar;
  const ctaLabel = isLoggedIn ? "Dashboard" : "Registar Interesse";

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-white/95 backdrop-blur-md">
      <div className="container-main flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={ROUTES.home} className="flex items-center gap-2">
          <Image
            src="/pumangol-logo.png"
            alt="Pumangol"
            width={140}
            height={32}
            priority
            className="w-auto h-auto"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-pumangol-red"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button href={ctaHref} variant="outline" size="sm">
            {ctaLabel}
          </Button>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Button href={ctaHref} fullWidth>
              {ctaLabel}
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
