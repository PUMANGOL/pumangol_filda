export interface LeadScoreInput {
  profile: string;
  solutions: string[];
  combustiveisConsumption?: string | null;
  lubricantVehicleCountEmpresa?: string | null;
  frotaVehicleCount?: string | null;
  purchaseTimeline: string;
  wantsContact: boolean;
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
  fornecedor: 0,
  outro: 5,
};

/** Per-solution scores depending on profile context */
function getSolutionScore(solution: string, profile: string): number {
  const isEmpresa =
    profile === "empresa" || profile === "orgao_publico";

  switch (solution) {
    case "combustiveis":
      return isEmpresa ? 20 : 5;
    case "lubrificantes":
      return isEmpresa ? 15 : 5;
    case "frota_mais":
      return 20;
    case "cartao_presente":
      return isEmpresa ? 10 : 5;
    case "angobetumes":
      return 20;
    case "aviacao":
      return 20;
    case "via":
      return 5;
    case "patrocinios":
      return 5;
    default:
      return 5;
  }
}

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

const TIMELINE_SCORES: Record<string, number> = {
  imediatamente: 30,
  ate_3_meses: 25,
  "3_6_meses": 15,
  "6_12_meses": 10,
  apenas_info: 0,
};

export function calculateScore(input: LeadScoreInput): ScoreResult {
  // Fornecedores não entram no funil comercial — encaminhar para Portal KYC
  if (input.profile === "fornecedor") {
    return {
      scoreProfile: 0,
      scoreInterest: 0,
      scorePotential: 0,
      scoreTimeline: 0,
      scoreContact: 0,
      totalScore: 0,
      classification: "FORNECEDOR",
    };
  }

  // Criterion 1: Profile
  const scoreProfile = PROFILE_SCORES[input.profile] ?? 5;

  // Criterion 2: Interest (capped at 30)
  const rawInterest = input.solutions.reduce(
    (sum, s) => sum + getSolutionScore(s, input.profile),
    0
  );
  const scoreInterest = Math.min(rawInterest, 30);

  // Criterion 3: Potential (max of applicable scores, capped at 20)
  const potentialCandidates: number[] = [];

  if (input.combustiveisConsumption) {
    potentialCandidates.push(
      CONSUMPTION_SCORES[input.combustiveisConsumption] ?? 0
    );
  }
  if (input.lubricantVehicleCountEmpresa) {
    potentialCandidates.push(
      VEHICLE_COUNT_SCORES[input.lubricantVehicleCountEmpresa] ?? 0
    );
  }
  if (input.frotaVehicleCount) {
    potentialCandidates.push(
      VEHICLE_COUNT_SCORES[input.frotaVehicleCount] ?? 0
    );
  }

  const scorePotential =
    potentialCandidates.length > 0 ? Math.min(Math.max(...potentialCandidates), 20) : 0;

  // Criterion 4: Timeline
  const scoreTimeline = TIMELINE_SCORES[input.purchaseTimeline] ?? 0;

  // Criterion 5: Contact
  const scoreContact = input.wantsContact ? 10 : 0;

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
