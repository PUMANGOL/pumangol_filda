import Image from "next/image";
import Link from "next/link";
import { InternoForm } from "@/components/forms/InternoForm";
import { Card } from "@/components/ui/Card";
import { ROUTES } from "@/lib/constants";
import { getRegistosInteresseDisponiveis } from "@/lib/dashboard/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Qualificar Lead | Pumangol FILDA 2026",
  description: "Formulário interno para colaboradores Pumangol qualificarem leads na FILDA 2026.",
};

export default async function InternoPage() {
  const registos = await getRegistosInteresseDisponiveis();
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-white">
        <div className="container-main flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href={ROUTES.home}>
            <Image src="/pumangol-logo.png" alt="Pumangol" width={130} height={30} className="w-auto h-auto" />
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full bg-gray-800 px-3 py-1 text-xs font-semibold text-white sm:inline">
              Área Colaboradores
            </span>
            <Link
              href={ROUTES.dashboard}
              className="text-sm font-medium text-pumangol-red hover:underline"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="container-main section-padding !py-10">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-pumangol-red/10 px-4 py-1 text-sm font-semibold text-pumangol-red">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Uso Interno
            </div>
            <h1 className="mt-4 text-3xl font-bold text-gray-900">
              Qualificar Lead
            </h1>
            <p className="mt-3 text-muted">
              Registe e qualifique leads durante conversas presenciais no stand
              da FILDA 2026.
            </p>
          </div>

          <Card padding="lg" className="shadow-lg">
            <InternoForm registos={registos} />
          </Card>
        </div>
      </main>
    </div>
  );
}
