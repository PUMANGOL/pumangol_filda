import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const PROFILE_LABELS: Record<string, string> = {
  particular: "Particular",
  empresa: "Empresa",
  orgao_publico: "Órgão Público",
  fornecedor: "Potencial Fornecedor",
  parceiro: "Potencial Parceiro de Negócio",
  outro: "Outro",
};

export const BETUMES_EMULSAO_LABEL = "Betumes e Emulsão";

export const SOLUTION_LABELS: Record<string, string> = {
  combustiveis: "Combustíveis",
  lubrificantes: "Lubrificantes",
  via: "VIA",
  cartao_presente: "Cartão Presente",
  frota_mais: "Frota+",
  angobetumes: BETUMES_EMULSAO_LABEL,
  aviacao: "Aviação",
  patrocinios: "Patrocínios",
  outros: "Outros",
};

export const TIMELINE_LABELS: Record<string, string> = {
  imediatamente: "Imediatamente",
  ate_3_meses: "Nos próximos 3 meses",
  "3_6_meses": "Entre 3 e 6 meses",
  "6_12_meses": "Entre 6 e 12 meses",
  apenas_info: "Apenas estou a recolher informação",
};
