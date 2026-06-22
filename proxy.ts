import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  AUTH_ROUTES,
  PROTECTED_PREFIXES,
  SESSION_COOKIE,
} from "@/lib/auth/config";

/** Gate de rede: verifica cookie. Validação completa da sessão em app/dashboard/layout. */
export function proxy(request: NextRequest) {
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
  matcher: ["/dashboard/:path*", "/login"],
};
