import Image from "next/image";
import Link from "next/link";
import { RegistarForm } from "@/components/forms/RegistarForm";
import { Card } from "@/components/ui/Card";
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
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Registar Interesse
            </h1>
            <p className="mt-3 text-muted">
              Preencha o formulário para conhecer as soluções da Pumangol e
              ser contactado pela nossa equipa comercial.
            </p>
          </div>

          <Card padding="lg" className="shadow-lg">
            <RegistarForm />
          </Card>
        </div>
      </main>
    </div>
  );
}
