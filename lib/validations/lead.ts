import { z } from "zod";
import {
  BUSINESS_POTENTIAL,
  CONTACT_TYPES,
  HOW_KNOWN_OPTIONS,
  INTEREST_LEVELS,
  PRODUCTS,
  PURCHASE_HORIZONS,
} from "@/lib/constants";

const enumMsg = "Valor inválido.";

export const LEAD_REGISTO_NONE = "__none__";

export const leadFormSchema = z.object({
  fkRegistoInteresse: z
    .string()
    .trim()
    .optional()
    .transform((value) => {
      const raw = value ?? "";
      if (!raw || raw === LEAD_REGISTO_NONE) {
        return null;
      }
      const parsed = Number(raw);
      if (!Number.isInteger(parsed) || parsed <= 0) {
        return null;
      }
      return parsed;
    }),
  empresa: z.string().trim().min(1, "Indique o nome da empresa."),
  nif: z.string().trim().min(1, "Indique o NIF."),
  sector: z.string().trim().min(1, "Indique o sector de actividade."),
  colaboradores: z
    .string({ message: "Indique o número de colaboradores." })
    .trim()
    .min(1, "Indique o número de colaboradores.")
    .refine((v) => !Number.isNaN(Number(v)), {
      message: "Indique o número de colaboradores.",
    })
    .refine((v) => Number.isInteger(Number(v)), {
      message: "O número de colaboradores deve ser um valor inteiro.",
    })
    .refine((v) => Number(v) >= 0, {
      message: "O número de colaboradores deve ser maior ou igual a zero.",
    })
    .transform((v) => Number(v)),
  localizacao: z.string().trim().min(1, "Indique a localização."),
  nome: z.string().trim().min(1, "Indique o nome do contacto."),
  cargo: z.string().trim().min(1, "Indique o cargo."),
  telefone: z.string().trim().min(1, "Indique um telefone."),
  email: z.string().trim().email("Introduza um e-mail válido."),
  tipo: z.enum(CONTACT_TYPES, { message: enumMsg }),
  comoConheceu: z.enum(HOW_KNOWN_OPTIONS, { message: enumMsg }),
  nivelInteresse: z.enum(INTEREST_LEVELS, { message: enumMsg }),
  produto: z.enum(PRODUCTS, { message: enumMsg }),
  horizonte: z.enum(PURCHASE_HORIZONS, { message: enumMsg }),
  potencial: z.enum(BUSINESS_POTENTIAL, { message: enumMsg }),
  comentarios: z
    .string()
    .trim()
    .transform((v) => v || null)
    .optional()
    .nullable(),
});

export type LeadFormInput = z.infer<typeof leadFormSchema>;

export type LeadFormField =
  | keyof LeadFormInput
  | "comentarios";

/** Valores brutos do formulário (para repovoar após erro de validação). */
export type LeadFormValues = {
  fkRegistoInteresse: string;
  empresa: string;
  nif: string;
  sector: string;
  colaboradores: string;
  localizacao: string;
  nome: string;
  cargo: string;
  telefone: string;
  email: string;
  tipo: string;
  comoConheceu: string;
  nivelInteresse: string;
  produto: string;
  horizonte: string;
  potencial: string;
  comentarios: string;
};

export const emptyLeadFormValues: LeadFormValues = {
  fkRegistoInteresse: LEAD_REGISTO_NONE,
  empresa: "",
  nif: "",
  sector: "",
  colaboradores: "",
  localizacao: "",
  nome: "",
  cargo: "",
  telefone: "",
  email: "",
  tipo: "",
  comoConheceu: "",
  nivelInteresse: "",
  produto: "",
  horizonte: "",
  potencial: "",
  comentarios: "",
};

export function extractLeadFormValues(formData: FormData): LeadFormValues {
  const fkRegistoInteresse = String(
    formData.get("fkRegistoInteresse") ?? LEAD_REGISTO_NONE
  );

  return {
    fkRegistoInteresse,
    empresa: String(formData.get("empresa") ?? ""),
    nif: String(formData.get("nif") ?? ""),
    sector: String(formData.get("sector") ?? ""),
    colaboradores: String(formData.get("colaboradores") ?? ""),
    localizacao: String(formData.get("localizacao") ?? ""),
    nome: String(formData.get("nome") ?? ""),
    cargo: String(formData.get("cargo") ?? ""),
    telefone: String(formData.get("telefone") ?? ""),
    email: String(formData.get("email") ?? ""),
    tipo: String(formData.get("tipo") ?? ""),
    comoConheceu: String(formData.get("comoConheceu") ?? ""),
    nivelInteresse: String(formData.get("nivelInteresse") ?? ""),
    produto: String(formData.get("produto") ?? ""),
    horizonte: String(formData.get("horizonte") ?? ""),
    potencial: String(formData.get("potencial") ?? ""),
    comentarios: String(formData.get("comentarios") ?? ""),
  };
}

export function parseLeadForm(formData: FormData) {
  return leadFormSchema.safeParse({
    fkRegistoInteresse: formData.get("fkRegistoInteresse") ?? LEAD_REGISTO_NONE,
    empresa: formData.get("empresa"),
    nif: formData.get("nif"),
    sector: formData.get("sector"),
    colaboradores: String(formData.get("colaboradores") ?? ""),
    localizacao: formData.get("localizacao"),
    nome: formData.get("nome"),
    cargo: formData.get("cargo"),
    telefone: formData.get("telefone"),
    email: formData.get("email"),
    tipo: formData.get("tipo"),
    comoConheceu: formData.get("comoConheceu"),
    nivelInteresse: formData.get("nivelInteresse"),
    produto: formData.get("produto"),
    horizonte: formData.get("horizonte"),
    potencial: formData.get("potencial"),
    comentarios: formData.get("comentarios") ?? "",
  });
}

export function zodFieldErrors(
  error: z.ZodError
): Partial<Record<LeadFormField, string>> {
  const fieldErrors: Partial<Record<LeadFormField, string>> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !fieldErrors[field as LeadFormField]) {
      fieldErrors[field as LeadFormField] = issue.message;
    }
  }

  return fieldErrors;
}
