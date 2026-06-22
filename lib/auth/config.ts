export const SESSION_COOKIE = "mfilda_session";
export const SESSION_TTL_MS = 1 * 24 * 60 * 60 * 1000; // 24 horas

export const AUTH_ROUTES = {
  login: "/login",
  dashboard: "/dashboard",
} as const;

export const PROTECTED_PREFIXES = ["/dashboard"] as const;
