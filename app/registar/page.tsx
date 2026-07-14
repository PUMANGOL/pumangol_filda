import Image from "next/image";
import Link from "next/link";
import { LeadForm } from "@/components/lead-form/lead-form";
import { ROUTES } from "@/lib/constants";

export const metadata = {
  title: "Registar Interesse | Pumangol FILDA 2026",
  description: "Registe o seu interesse nas soluções empresariais da Pumangol na FILDA 2026.",
};

export default function RegistarPage() {
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-white">
        <div className="container-main flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href={ROUTES.home}>
            <Image src="/pumangol-logo.png" alt="Pumangol" width={130} height={30} className="w-auto h-auto" />
          </Link>
          <span className="rounded-full bg-pumangol-red/10 px-3 py-1 text-xs font-semibold text-pumangol-red">
            FILDA 2026
          </span>
        </div>
      </header>

      <main className="container-main section-padding !py-10">
        <div className="mx-auto w-full max-w-6xl px-2 md:px-3 lg:px-4">
          <div className="mb-6 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-slate-900">Registar Interesse</h1>
            <p className="text-slate-500 text-sm mt-1">
              Preencha o formulário para conhecer as soluções da Pumangol e
              ser contactado pela nossa equipa comercial. O formulário adapta-se
              automaticamente ao perfil seleccionado.
            </p>
          </div>
          <LeadForm />
        </div>
      </main>
    </div>
  );
}
