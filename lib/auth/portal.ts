import { cookies, headers } from "next/headers";

/** Domínio do portal empresarial que pode abrir o painel sem login. */
export const PORTAL_HOST = "portal.pumangol.co.ao";

export const PORTAL_COOKIE = "pumangol_portal";

/** Headers internos (proxy → RSC) para o 1.º pedido, antes do cookie existir. */
export const PORTAL_EMAIL_HEADER = "x-portal-email";
export const PORTAL_EXPIRES_HEADER = "x-portal-expires";

/** Duração do acesso via portal (fase inicial). */
export const PORTAL_ACCESS_TTL_MS = 30 * 60 * 1000; // 30 minutos

export type PortalAccess = {
  email: string;
  expiresAt: number; // unix ms
};

function parseCookieValue(raw: string | undefined): PortalAccess | null {
  if (!raw) return null;
  try {
    const decoded = decodeURIComponent(raw);
    const sep = decoded.indexOf("|");
    if (sep <= 0) return null;
    const expiresAt = Number(decoded.slice(0, sep));
    const email = decoded.slice(sep + 1).trim();
    if (!Number.isFinite(expiresAt) || !email) return null;
    return { email, expiresAt };
  } catch {
    return null;
  }
}

export function serializePortalCookie(access: PortalAccess): string {
  return encodeURIComponent(`${access.expiresAt}|${access.email}`);
}

export function isPortalHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return host === PORTAL_HOST || host.endsWith(`.${PORTAL_HOST}`);
}

/** Verifica Referer / Origin da requisição (spoofável — fase inicial). */
export function isRequestFromPortal(
  referer: string | null,
  origin: string | null
): boolean {
  for (const value of [referer, origin]) {
    if (!value) continue;
    try {
      if (isPortalHost(new URL(value).hostname)) return true;
    } catch {
      // ignore invalid URL
    }
  }
  return false;
}

export function readPortalAccessFromCookie(
  raw: string | undefined
): PortalAccess | null {
  const access = parseCookieValue(raw);
  if (!access) return null;
  if (access.expiresAt <= Date.now()) return null;
  return access;
}

export function createPortalAccess(email: string): PortalAccess {
  return {
    email: email.trim().toLowerCase() || "portal@pumangol.co.ao",
    expiresAt: Date.now() + PORTAL_ACCESS_TTL_MS,
  };
}

export const portalCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: Math.floor(PORTAL_ACCESS_TTL_MS / 1000),
};

/** Sessão portal válida (cookie ou headers do proxy no 1.º pedido). */
export async function getPortalAccess(): Promise<PortalAccess | null> {
  const cookieStore = await cookies();
  const fromCookie = readPortalAccessFromCookie(
    cookieStore.get(PORTAL_COOKIE)?.value
  );
  if (fromCookie) return fromCookie;

  const h = await headers();
  const email = h.get(PORTAL_EMAIL_HEADER)?.trim();
  const expiresRaw = h.get(PORTAL_EXPIRES_HEADER);
  if (!email || !expiresRaw) return null;
  const expiresAt = Number(expiresRaw);
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) return null;
  return { email: email.toLowerCase(), expiresAt };
}

/**
 * Autenticação alternativa: sessão normal OU acesso portal válido.
 * Usado pelas APIs partilhadas com /my-pumangol.
 */
export async function getSessionOrPortal(): Promise<
  | { kind: "session"; userId: number; username: string; fullName: string }
  | { kind: "portal"; email: string; expiresAt: number }
  | null
> {
  const { getSession } = await import("@/lib/auth");
  const session = await getSession();
  if (session) {
    return {
      kind: "session",
      userId: session.user.id,
      username: session.user.username,
      fullName: session.user.fullName,
    };
  }

  const portal = await getPortalAccess();
  if (portal) {
    return {
      kind: "portal",
      email: portal.email,
      expiresAt: portal.expiresAt,
    };
  }

  return null;
}

/** Headers da navegação actual (útil em layout / debug). */
export async function getRequestPortalHints(): Promise<{
  fromPortal: boolean;
  referer: string | null;
  origin: string | null;
}> {
  const h = await headers();
  const referer = h.get("referer");
  const origin = h.get("origin");
  return {
    fromPortal: isRequestFromPortal(referer, origin),
    referer,
    origin,
  };
}
