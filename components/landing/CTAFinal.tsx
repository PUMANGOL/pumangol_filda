import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/lib/constants";

export function CTAFinal() {
  return (
    <section className="section-padding gradient-brand relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-pumangol-yellow blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white blur-3xl" />
      </div>

      <div className="container-main relative text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Pronto para transformar a sua frota?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
          A nossa equipa comercial está na FILDA 2026 para apresentar soluções
          personalizadas ao seu negócio. Fale connosco hoje.
        </p>
        <div className="mt-8">
          <Button
            href={ROUTES.registar}
            variant="secondary"
            size="lg"
          >
            Quero falar com a equipa Pumangol
          </Button>
        </div>
      </div>
    </section>
  );
}
