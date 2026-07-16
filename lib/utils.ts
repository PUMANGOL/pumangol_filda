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
  academia: "Academia de Formação",
  patrocinios: "Patrocínios",
  outros: "Outros",
};

export const ACADEMIA_TOPIC_LABELS: Record<string, string> = {
  conducao_defensiva: "Condução Defensiva",
  empilhadores_equipamentos: "Empilhadores e Equipamentos",
  primeiros_socorros: "Primeiros Socorros",
  prevencao_combate_incendios: "Prevenção e Combate a Incêndios",
  inteligencia_artificial: "Inteligência Artificial",
  excel_power_bi: "Excel / Power BI",
  lideranca: "Liderança",
  gestao_projectos: "Gestão de Projectos",
  atendimento_cliente: "Atendimento ao Cliente",
  customer_experience: "Customer Experience",
  comunicacao: "Comunicação",
  outro: "Outro",
};

/** Labels para quantidade Frota+ (ligeiro = viaturas, pesado = litros/mês) */
export const FROTA_LIGEIRO_COUNT_LABELS: Record<string, string> = {
  "1_5": "1–5",
  "6_20": "6–20",
  "21_50": "21–50",
  mais_50: "Mais de 50",
};

export const FROTA_PESADO_LITROS_LABELS: Record<string, string> = {
  ate_1000: "Até 1.000 L",
  "5000": "5.000 L",
  "5001_10000": "5.001 – 10.000 L",
  "10001_25000": "10.001 – 25.000 L",
  "25001_50000": "25.001 – 50.000 L",
  mais_50000: "Mais de 50.000 L",
};

export const TIMELINE_LABELS: Record<string, string> = {
  imediatamente: "Imediatamente",
  ate_3_meses: "Nos próximos 3 meses",
  "3_6_meses": "Entre 3 e 6 meses",
  "6_12_meses": "Entre 6 e 12 meses",
  apenas_info: "Apenas estou a recolher informação",
};
