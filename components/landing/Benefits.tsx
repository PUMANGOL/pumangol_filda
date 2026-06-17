import { BENEFITS } from "@/lib/constants";

export function Benefits() {
  return (
    <section id="beneficios" className="section-padding bg-white">
      <div className="container-main">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-pumangol-red/10 px-4 py-1 text-sm font-semibold text-pumangol-red">
            Vantagens
          </span>
          <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Porquê escolher a Pumangol?
          </h2>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {BENEFITS.map((benefit, index) => (
            <div key={benefit.title} className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pumangol-red to-pumangol-red-dark text-white shadow-lg">
                <span className="text-xl font-bold">{index + 1}</span>
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">
                {benefit.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
