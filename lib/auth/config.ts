export const SESSION_COOKIE = "pumangol_session";
export const SESSION_EXPIRY_DAYS = 7;

export const AUTH_ROUTES = {
  login: "/login",
  dashboard: "/dashboard",
  logout: "/api/auth/logout",
} as const;

export const PROTECTED_PREFIXES = ["/dashboard", "/leads"];
