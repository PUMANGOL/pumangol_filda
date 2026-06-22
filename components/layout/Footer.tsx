import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border bg-gray-900 text-gray-300">
      <div className="container-main section-padding !py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Image
              src="/pumangol-logo.png"
              alt="Pumangol"
              width={140}
              height={32}
              className="w-auto h-auto"
            />
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Empresa 100% angolana de energia. Vamos além da comercialização de
              combustíveis e lubrificantes — criamos boa energia.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              FILDA 2026
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={ROUTES.registar} className="hover:text-pumangol-yellow transition-colors">
                  Registar Interesse
                </Link>
              </li>
              <li>
                <Link href={ROUTES.interno} className="hover:text-pumangol-yellow transition-colors">
                  Área Colaboradores
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Contacto
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>www.pumangol.co.ao</li>
              <li>Luanda, Angola</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 sm:flex-row">
          <p className="text-xs text-gray-500">
            © 2026 Pumangol. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-pumangol-red" />
            <span className="h-2 w-2 rounded-full bg-pumangol-yellow" />
            <span className="text-xs text-gray-500">Boa Energia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
