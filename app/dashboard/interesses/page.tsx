import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardMobileNav } from "@/components/dashboard/DashboardMobileNav";
import { DashboardUserMenu } from "@/components/dashboard/DashboardUserMenu";
import { InteressesTable } from "@/components/dashboard/InteressesTable";
import { getSession } from "@/lib/auth/session";
import { getRegistosInteresse } from "@/lib/dashboard/queries";

export const metadata = {
  title: "Registos de Interesse | Pumangol FILDA 2026",
  description: "Consulta de registos de interesse submetidos na landing page FILDA 2026.",
};

export default async function InteressesPage() {
  const [user, registos] = await Promise.all([
    getSession(),
    getRegistosInteresse(),
  ]);

  return (
    <div className="flex min-h-screen bg-surface">
      <DashboardSidebar />

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-white px-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-lg font-bold text-gray-900 lg:hidden">
              Interesses
            </h1>
            <p className="hidden text-sm text-muted lg:block">
              Registos da Landing Page · FILDA 2026
            </p>
          </div>
          <DashboardUserMenu nome={user?.nome ?? ""} />
        </header>

        <main className="flex-1 overflow-auto p-4 pb-[calc(4.75rem+env(safe-area-inset-bottom,0px))] sm:p-6 md:pb-6 lg:p-8 lg:pb-8">
          <div className="mb-6 hidden lg:block">
            <h1 className="text-2xl font-bold text-gray-900">
              Registos de Interesse
            </h1>
            <p className="mt-1 text-muted">
              Submissões efectuadas na landing page FILDA 2026
            </p>
          </div>

          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
              <p className="text-3xl font-bold text-gray-900">{registos.length}</p>
              <p className="mt-1 text-sm text-muted">Total de registos</p>
            </div>
            <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
              <p className="text-3xl font-bold text-gray-900">
                {registos.filter((r) => r.areas.length > 0).length}
              </p>
              <p className="mt-1 text-sm text-muted">Com áreas de interesse</p>
            </div>
            <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
              <p className="text-3xl font-bold text-gray-900">
                {new Set(registos.map((r) => r.tipoContacto)).size}
              </p>
              <p className="mt-1 text-sm text-muted">Tipos de contacto</p>
            </div>
          </div>

          <InteressesTable registos={registos} />
        </main>
      </div>
      <DashboardMobileNav />
    </div>
  );
}
