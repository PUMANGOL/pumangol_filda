export const RECLAMACAO_CATEGORIES = [
  "VIA",
  "Frota+",
  "Atendimento ao cliente",
] as const;

export type ReclamacaoCategory = (typeof RECLAMACAO_CATEGORIES)[number];

/** Posto só é obrigatório para estas categorias conhecidas (não para categorias livres). */
export function categoryRequiresPosto(category: string): boolean {
  return category === "Frota+" || category === "Atendimento ao cliente";
}
