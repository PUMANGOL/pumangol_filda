"use client";

import { usePathname } from "next/navigation";

/** Prefixo de rotas quando o painel corre sob /my-pumangol (acesso portal). */
export function useAppBasePath(): string {
  const pathname = usePathname();
  return pathname.startsWith("/my-pumangol") ? "/my-pumangol" : "";
}

export function appPath(basePath: string, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalized}`;
}
