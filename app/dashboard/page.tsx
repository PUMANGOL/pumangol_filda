import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardMobileNav } from "@/components/dashboard/DashboardMobileNav";
import { DashboardUserMenu } from "@/components/dashboard/DashboardUserMenu";
import { LeadsTable } from "@/components/dashboard/LeadsTable";
import { Pipeline } from "@/components/dashboard/Pipeline";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { getSession } from "@/lib/auth/session";
import { getDashboardData } from "@/lib/dashboard/queries";

export const metadata = {
  title: "Dashboard Comercial | Pumangol FILDA 2026",
  description: "Gestão e acompanhamento de leads captadas na FILDA 2026.",
};

export default async function DashboardPage() {
  const [user, { leads, stats, pipelineCounts }] = await Promise.all([
    getSession(),
    getDashboardData(),
  ]);

  return (
    <div className="flex min-h-screen bg-surface">
      <DashboardSidebar />

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-white px-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-lg font-bold text-gray-900 lg:hidden">
              Dashboard FILDA
            </h1>
            <p className="hidden text-sm text-muted lg:block">
              Gestão de Leads · FILDA 2026
            </p>
          </div>
          <DashboardUserMenu nome={user?.nome ?? ""} />
        </header>

        <main className="flex-1 overflow-auto p-4 pb-[calc(4.75rem+env(safe-area-inset-bottom,0px))] sm:p-6 md:pb-6 lg:p-8 lg:pb-8">
          <div className="mb-6 hidden lg:block">
            <h1 className="text-2xl font-bold text-gray-900">
              Dashboard Comercial
            </h1>
            <p className="mt-1 text-muted">
              Acompanhamento de leads e pipeline de vendas FILDA 2026
            </p>
          </div>

          <div className="space-y-6">
            <StatsCards stats={stats} />
            <Pipeline counts={pipelineCounts} />
            <div>
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Leads Registadas
              </h2>
              <LeadsTable leads={leads} />
            </div>
          </div>
        </main>
      </div>
      <DashboardMobileNav />
    </div>
  );
}
