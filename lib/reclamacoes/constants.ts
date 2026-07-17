export const RECLAMACAO_CATEGORIES = [
  "VIA",
  "Frota+",
  "Atendimento ao cliente",
] as const;

export type ReclamacaoCategory = (typeof RECLAMACAO_CATEGORIES)[number];
