import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/lib/constants";

type HeroProps = {
  isLoggedIn?: boolean;
};

export function Hero({ isLoggedIn = false }: HeroProps) {
  return (
    <section className="relative overflow-hidden gradient-hero">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-pumangol-red blur-3xl" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-pumangol-red blur-3xl" />
      </div>

      <div className="absolute inset-0 opacity-10">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container-main relative section-padding">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="animate-fade-in-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-pumangol-red/30 bg-pumangol-red/10 px-4 py-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-pumangol-red" />
              <span className="text-sm font-medium text-white">
                FILDA 2026 · Luanda
              </span>
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Energia que move o seu{" "}
              <span className="text-pumangol-red">negócio</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-300">
              Descubra as soluções empresariais da Pumangol na FILDA 2026.
              Frota+, combustíveis, lubrificantes e parcerias estratégicas para
              impulsionar a sua empresa.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button
                href={isLoggedIn ? ROUTES.dashboard : ROUTES.registar}
                variant="primary"
                size="lg"
              >
                {isLoggedIn ? "Dashboard" : "Registar Interesse"}
              </Button>
              <Button href={ROUTES.registar} variant="outline" size="lg" className="!border-white !text-white hover:!bg-white hover:!text-gray-900">
                Quero ser Contactado
              </Button>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-pumangol-red/80 via-gray-800 to-pumangol-red/40" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <h3 className="text-2xl font-bold text-white">Stand Pumangol</h3>
                <p className="mt-2 text-sm text-gray-300">FILDA 2026 · Pavilhão Central</p>
                <div className="mt-6 flex gap-3">
                  <div className="h-3 w-3 rounded-full bg-pumangol-red" />
                  <div className="h-3 w-3 rounded-full bg-pumangol-red/60" />
                  <div className="h-3 w-3 rounded-full bg-white" />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 rounded-2xl bg-pumangol-red px-6 py-4 shadow-xl">
              <p className="text-3xl font-bold text-white">80+</p>
              <p className="text-xs font-medium text-white/80">Postos de Abastecimento</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
