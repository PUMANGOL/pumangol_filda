import { redirect } from "next/navigation";
import { AUTH_ROUTES } from "@/lib/auth/config";
import { getSession, purgeExpiredSessions } from "@/lib/auth/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  purgeExpiredSessions();

  const user = await getSession();
  if (!user) {
    redirect(`${AUTH_ROUTES.login}?callbackUrl=${AUTH_ROUTES.dashboard}`);
  }

  return children;
}
