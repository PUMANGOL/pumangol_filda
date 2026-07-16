import { getPortalAccess } from "@/lib/auth/portal";
import { PortalAppShell } from "@/components/portal/portal-app-shell";
import { PortalAccessDenied } from "@/components/portal/portal-access-ui";

export default async function MyPumangolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const portal = await getPortalAccess();

  if (!portal) {
    return <PortalAccessDenied />;
  }

  return (
    <PortalAppShell email={portal.email} expiresAt={portal.expiresAt}>
      {children}
    </PortalAppShell>
  );
}
