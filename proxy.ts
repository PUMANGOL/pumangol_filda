import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  AUTH_ROUTES,
  PROTECTED_PREFIXES,
  SESSION_COOKIE,
} from "@/lib/auth/config";
import {
  PORTAL_COOKIE,
  PORTAL_EMAIL_HEADER,
  PORTAL_EXPIRES_HEADER,
  createPortalAccess,
  isRequestFromPortal,
  portalCookieOptions,
  readPortalAccessFromCookie,
  serializePortalCookie,
  type PortalAccess,
} from "@/lib/auth/portal";

const MY_PUMANGOL_PREFIX = "/my-pumangol";

function withPortalHeaders(
  request: NextRequest,
  access: PortalAccess,
  setCookie: boolean
): NextResponse {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(PORTAL_EMAIL_HEADER, access.email);
  requestHeaders.set(PORTAL_EXPIRES_HEADER, String(access.expiresAt));

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  if (setCookie) {
    response.cookies.set(
      PORTAL_COOKIE,
      serializePortalCookie(access),
      portalCookieOptions
    );
  }

  return response;
}

function handlePortalAccess(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith(MY_PUMANGOL_PREFIX)) return null;

  const existing = readPortalAccessFromCookie(
    request.cookies.get(PORTAL_COOKIE)?.value
  );
  const fromPortal = isRequestFromPortal(
    request.headers.get("referer"),
    request.headers.get("origin")
  );
  const emailParam = request.nextUrl.searchParams.get("email")?.trim() ?? "";

  // Acesso activo: actualiza email se vier no link; mantém expiração actual
  if (existing) {
    const access =
      emailParam && emailParam.toLowerCase() !== existing.email
        ? { ...existing, email: emailParam.toLowerCase() }
        : existing;
    return withPortalHeaders(
      request,
      access,
      access.email !== existing.email
    );
  }

  // Primeira entrada a partir do portal → cria cookie temporário
  if (fromPortal) {
    return withPortalHeaders(request, createPortalAccess(emailParam), true);
  }

  // Sem cookie e sem origem do portal → página mostra bloqueio
  return NextResponse.next();
}

/** Gate de rede: verifica cookie. Validação completa da sessão em app/dashboard/layout. */
export function proxy(request: NextRequest) {
  const portalResponse = handlePortalAccess(request);
  if (portalResponse) return portalResponse;

  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isProtected && !hasSession) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = AUTH_ROUTES.login;
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === AUTH_ROUTES.login && hasSession) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = AUTH_ROUTES.dashboard;
    dashboardUrl.search = "";
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/my-pumangol", "/my-pumangol/:path*"],
};
