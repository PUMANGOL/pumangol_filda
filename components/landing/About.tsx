import { Card } from "@/components/ui/Card";

const highlights = [
  {
    title: "Distribuição de Combustíveis",
    description: "Líder no abastecimento energético em Angola com qualidade e fiabilidade.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Rede Nacional de Postos",
    description: "Mais de 2.000 postos de abastecimento em todo o território nacional.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "Frota+",
    description: "Solução completa de gestão de frotas para empresas de todos os tamanhos.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10" />
      </svg>
    ),
  },
  {
    title: "Lubrificantes",
    description: "Gama completa de lubrificantes para veículos e equipamentos industriais.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    title: "Soluções Empresariais",
    description: "Pacotes corporativos personalizados para optimizar a sua operação.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    title: "Parcerias Comerciais",
    description: "Oportunidades de colaboração para crescer juntos no mercado angolano.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export function About() {
  return (
    <section id="sobre" className="section-padding bg-white">
      <div className="container-main">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-block rounded-full bg-pumangol-red/10 px-4 py-1 text-sm font-semibold text-pumangol-red">
              Sobre a Pumangol
            </span>
            <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Criamos boa energia para Angola
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              Somos uma empresa 100% angolana de energia. Vamos além da
              comercialização de combustíveis e lubrificantes — criamos boa
              energia que move pessoas, empresas e comunidades.
            </p>
            <p className="mt-4 text-muted leading-relaxed">
              Na FILDA 2026, apresentamos as nossas soluções empresariais mais
              inovadoras, desde a gestão de frotas com Frota+ até parcerias
              comerciais estratégicas em todo o território nacional.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {highlights.map((item) => (
              <Card key={item.title} hover padding="sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pumangol-red/10 text-pumangol-red">
                  {item.icon}
                </div>
                <h3 className="mt-3 font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-1 text-sm text-muted">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
