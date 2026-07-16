/**
 * Classificação de leads FILDA 2026
 * Fonte: docs/Classificacao_Leads_FILDA_2026.xlsx
 * Máximo teórico: Perfil 25 + Interesse 30 + Potencial 20 + Horizonte 30 + Contacto 10 = 115
 */

export interface LeadScoreInput {
  profile: string;
  solutions: string[];
  combustiveisPurpose?: string | null;
  combustiveisConsumption?: string | null;
  lubricantVehicleCountEmpresa?: string | null;
  lubricantVehicleTypeParticular?: string | null;
  frotaVehicleCount?: string | null;
  frotaInterest?: string | null;
  angobetumesInterest?: string | null;
  angobetumesActivity?: string | null;
  cardPurposeParticular?: string | null;
  cardPurposeEmpresa?: string | null;
  academiaTopics?: string[] | null;
  usesViaApp?: boolean | null;
  isExistingClient?: boolean | null;
  purchaseTimeline: string;
  wantsContact: boolean;
  contactPreference?: string[] | null;
}

export interface ScoreResult {
  scoreProfile: number;
  scoreInterest: number;
  scorePotential: number;
  scoreTimeline: number;
  scoreContact: number;
  totalScore: number;
  classification: "A+" | "A" | "B" | "C" | "D" | "FORNECEDOR";
}

const PROFILE_SCORES: Record<string, number> = {
  empresa: 25,
  orgao_publico: 20,
  parceiro: 20,
  particular: 10,
  fornecedor: 10,
  outro: 5,
};

/** Interesse — Particular (critério 2) */
const INTEREST_PARTICULAR: Record<string, number> = {
  combustiveis: 10,
  lubrificantes: 10,
  via: 10,
  cartao_presente: 5,
  academia: 10, // Academia no Excel está em Empresa; formulário expõe a Particular
  patrocinios: 5,
  outros: 5,
};

/** Interesse — Empresa / Órgão Público (critério 2) */
const INTEREST_EMPRESA: Record<string, number> = {
  combustiveis: 10,
  lubrificantes: 10,
  frota_mais: 10,
  cartao_presente: 5,
  angobetumes: 10,
  academia: 10,
  patrocinios: 5,
  outros: 5,
  aviacao: 5, // legado — já não no Excel; peso residual
};

function getSolutionScore(solution: string, profile: string): number {
  const isEmpresa = profile === "empresa" || profile === "orgao_publico";
  const table = isEmpresa ? INTEREST_EMPRESA : INTEREST_PARTICULAR;
  return table[solution] ?? 5;
}

const COMBUSTIVEIS_PURPOSE_SCORES: Record<string, number> = {
  empresa: 20,
  revenda: 15,
};

const CONSUMPTION_SCORES: Record<string, number> = {
  ate_5000: 5,
  "5000_20000": 10,
  "20000_100000": 15,
  mais_100000: 20,
};

const VEHICLE_COUNT_SCORES: Record<string, number> = {
  "1_5": 5,
  "6_20": 10,
  "21_50": 15,
  mais_50: 20,
};

/** Frota+ pesado (litros/mês) — não listado no Excel; escala alinhada ao teto 20 */
const FROTA_PESADO_LITROS_SCORES: Record<string, number> = {
  ate_1000: 5,
  "5000": 8,
  "5001_10000": 10,
  "10001_25000": 15,
  "25001_50000": 18,
  mais_50000: 20,
};

const LUBRICANT_TYPE_PARTICULAR_SCORES: Record<string, number> = {
  ligeira: 10,
  pesada: 15,
  motociclo: 5,
  equipamento: 20,
  outro: 5,
};

const ANGOBETUMES_INTEREST_SCORES: Record<string, number> = {
  projeto_proprio: 10,
  parceria: 10,
};

const ANGOBETUMES_ACTIVITY_SCORES: Record<string, number> = {
  construcao_civil: 10,
  obras_publicas: 20,
  infra_rodoviarias: 20,
  industria: 10,
  outro: 5,
};

const CARD_PURPOSE_PARTICULAR_SCORES: Record<string, number> = {
  uso_pessoal: 5,
  oferta: 10,
};

const CARD_PURPOSE_EMPRESA_SCORES: Record<string, number> = {
  colaboradores: 15,
  clientes: 15,
  campanhas: 20,
  outro: 5,
};

/**
 * Academia — pesos do Excel (categorias) + mapeamento dos tópicos actuais do formulário
 */
const ACADEMIA_TOPIC_SCORES: Record<string, number> = {
  // Categorias do Excel
  hsse_seguranca: 20,
  tecnologia_ia: 20,
  gestao_negocios: 15,
  lideranca: 15,
  atendimento_cliente: 10,
  comunicacao: 10,
  gestao_pessoas: 10,
  estrategia: 10,
  competencias_tecnicas: 10,
  // Tópicos actuais do formulário → categorias Excel
  conducao_defensiva: 20,
  empilhadores_equipamentos: 20,
  primeiros_socorros: 20,
  prevencao_combate_incendios: 20,
  inteligencia_artificial: 20,
  excel_power_bi: 20,
  gestao_projectos: 15,
  customer_experience: 10,
  outro: 5,
};

const TIMELINE_SCORES: Record<string, number> = {
  imediatamente: 30,
  ate_3_meses: 20,
  "3_6_meses": 10,
  "6_12_meses": 5,
  apenas_info: 0,
};

const CONTACT_PREFERENCE_SCORES: Record<string, number> = {
  telefone: 10,
  whatsapp: 5,
  email: 5,
};

function pushIfDefined(
  candidates: number[],
  table: Record<string, number>,
  value?: string | null
) {
  if (!value) return;
  const score = table[value];
  if (score !== undefined) candidates.push(score);
}

function getPotentialScore(input: LeadScoreInput): number {
  const candidates: number[] = [];

  pushIfDefined(candidates, COMBUSTIVEIS_PURPOSE_SCORES, input.combustiveisPurpose);
  pushIfDefined(candidates, CONSUMPTION_SCORES, input.combustiveisConsumption);
  pushIfDefined(
    candidates,
    VEHICLE_COUNT_SCORES,
    input.lubricantVehicleCountEmpresa
  );
  pushIfDefined(
    candidates,
    LUBRICANT_TYPE_PARTICULAR_SCORES,
    input.lubricantVehicleTypeParticular
  );

  if (input.frotaVehicleCount) {
    const frotaScore =
      VEHICLE_COUNT_SCORES[input.frotaVehicleCount] ??
      FROTA_PESADO_LITROS_SCORES[input.frotaVehicleCount];
    if (frotaScore !== undefined) candidates.push(frotaScore);
  }

  pushIfDefined(candidates, ANGOBETUMES_INTEREST_SCORES, input.angobetumesInterest);
  pushIfDefined(candidates, ANGOBETUMES_ACTIVITY_SCORES, input.angobetumesActivity);
  pushIfDefined(
    candidates,
    CARD_PURPOSE_PARTICULAR_SCORES,
    input.cardPurposeParticular
  );
  pushIfDefined(candidates, CARD_PURPOSE_EMPRESA_SCORES, input.cardPurposeEmpresa);

  if (input.academiaTopics?.length) {
    for (const topic of input.academiaTopics) {
      candidates.push(ACADEMIA_TOPIC_SCORES[topic] ?? 5);
    }
  }

  if (input.usesViaApp === true) candidates.push(10);
  if (input.usesViaApp === false) candidates.push(20);

  if (input.isExistingClient === true) candidates.push(10);
  if (input.isExistingClient === false) candidates.push(20);

  if (candidates.length === 0) return 0;
  return Math.min(Math.max(...candidates), 20);
}

function getContactScore(
  wantsContact: boolean,
  contactPreference?: string[] | null
): number {
  if (!wantsContact) return 0;

  if (contactPreference && contactPreference.length > 0) {
    const prefs = contactPreference.map(
      (p) => CONTACT_PREFERENCE_SCORES[p] ?? 5
    );
    return Math.min(Math.max(...prefs), 10);
  }

  // "Sim — pretende ser contactado" sem canal preferido
  return 10;
}

export function calculateScore(input: LeadScoreInput): ScoreResult {
  // Fornecedores não entram no funil comercial — encaminhar para Portal KYC
  if (input.profile === "fornecedor") {
    return {
      scoreProfile: PROFILE_SCORES.fornecedor,
      scoreInterest: 0,
      scorePotential: 0,
      scoreTimeline: 0,
      scoreContact: 0,
      totalScore: PROFILE_SCORES.fornecedor,
      classification: "FORNECEDOR",
    };
  }

  const scoreProfile = PROFILE_SCORES[input.profile] ?? 5;

  const rawInterest = input.solutions.reduce(
    (sum, s) => sum + getSolutionScore(s, input.profile),
    0
  );
  const scoreInterest = Math.min(rawInterest, 30);

  const scorePotential = getPotentialScore(input);
  const scoreTimeline = TIMELINE_SCORES[input.purchaseTimeline] ?? 0;
  const scoreContact = getContactScore(
    input.wantsContact,
    input.contactPreference
  );

  const totalScore =
    scoreProfile + scoreInterest + scorePotential + scoreTimeline + scoreContact;

  let classification: "A+" | "A" | "B" | "C" | "D";
  if (totalScore >= 90) classification = "A+";
  else if (totalScore >= 70) classification = "A";
  else if (totalScore >= 40) classification = "B";
  else if (totalScore >= 20) classification = "C";
  else classification = "D";

  return {
    scoreProfile,
    scoreInterest,
    scorePotential,
    scoreTimeline,
    scoreContact,
    totalScore,
    classification,
  };
}

export const CLASSIFICATION_LABELS: Record<string, string> = {
  "A+": "Lead A+ (Muito Quente)",
  A: "Lead A (Quente)",
  B: "Lead B (Morna)",
  C: "Lead C (Fria)",
  D: "Lead D",
  FORNECEDOR: "Fornecedor — Portal KYC",
};

export const CLASSIFICATION_COLORS: Record<string, string> = {
  "A+": "bg-red-600 text-white",
  A: "bg-orange-500 text-white",
  B: "bg-yellow-500 text-black",
  C: "bg-blue-400 text-white",
  D: "bg-slate-400 text-white",
  FORNECEDOR: "bg-purple-600 text-white",
};

export const CLASSIFICATION_ACTIONS: Record<string, string> = {
  "A+": "Contacto em 24 horas — Atribuir ao Gestor Comercial",
  A: "Contacto até 72 horas",
  B: "Inserção em campanhas de nutrição — Follow-up nas semanas seguintes",
  C: "Comunicação de marketing — Newsletter — Convites para eventos",
  D: "Registo estatístico — Sem prioridade comercial",
  FORNECEDOR: "Encaminhar para registo no Portal KYC — Fora do funil comercial",
};
