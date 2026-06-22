import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/forms/LoginForm";
import { Card } from "@/components/ui/Card";
import { AUTH_ROUTES } from "@/lib/auth/config";
import { ROUTES } from "@/lib/constants";

export const metadata = {
  title: "Login | Pumangol FILDA 2026",
  description: "Acesso ao dashboard comercial da Pumangol FILDA 2026.",
};

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

function resolveCallbackUrl(value?: string): string {
  if (value?.startsWith("/") && !value.startsWith("//")) {
    return value;
  }
  return AUTH_ROUTES.dashboard;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-white">
        <div className="container-main flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href={ROUTES.home}>
            <Image
              src="/pumangol-logo.png"
              alt="Pumangol"
              width={130}
              height={30}
              className="h-auto w-auto"
            />
          </Link>
          <span className="rounded-full bg-pumangol-red/10 px-3 py-1 text-xs font-semibold text-pumangol-red">
            FILDA 2026
          </span>
        </div>
      </header>

      <main className="container-main section-padding !py-10">
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Entrar</h1>
            <p className="mt-3 text-muted">
              Acesso reservado à equipa comercial Pumangol.
            </p>
          </div>

          <Card padding="lg" className="shadow-lg">
            <LoginForm callbackUrl={resolveCallbackUrl(params.callbackUrl)} />
          </Card>
        </div>
      </main>
    </div>
  );
}
