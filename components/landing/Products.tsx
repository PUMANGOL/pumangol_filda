import { Card } from "@/components/ui/Card";
import { PRODUCTS_HIGHLIGHT } from "@/lib/constants";

const icons: Record<string, React.ReactNode> = {
  truck: (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-12h4l3 3v5a1 1 0 01-1 1h-1m-6-9v12" />
    </svg>
  ),
  card: (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  oil: (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  ),
  building: (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  handshake: (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
    </svg>
  ),
};

export function Products() {
  return (
    <section id="produtos" className="section-padding bg-surface">
      <div className="container-main">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-pumangol-yellow/20 px-4 py-1 text-sm font-semibold text-yellow-800">
            Produtos em Destaque
          </span>
          <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Soluções para o seu negócio
          </h2>
          <p className="mt-4 text-lg text-muted">
            Conheça as nossas principais ofertas empresariais apresentadas na
            FILDA 2026.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS_HIGHLIGHT.map((product, index) => (
            <Card
              key={product.title}
              hover
              className={index === 0 ? "sm:col-span-2 lg:col-span-1 ring-2 ring-pumangol-red/20" : ""}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-brand text-white">
                {icons[product.icon]}
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-900">
                {product.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {product.description}
              </p>
              {index === 0 && (
                <span className="mt-4 inline-block rounded-full bg-pumangol-red/10 px-3 py-1 text-xs font-semibold text-pumangol-red">
                  Destaque FILDA
                </span>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
