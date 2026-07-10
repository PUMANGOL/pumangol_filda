"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { calculateScore } from "@/lib/scoring";

const schema = z.object({
  nome: z.string().min(2, "Nome obrigatório"),
  empresa: z.string().min(1, "Empresa obrigatória"),
  cargo: z.string().min(1, "Cargo obrigatório"),
  telefone: z.string().min(6, "Telefone obrigatório"),
  email: z.string().email("E-mail inválido"),
  tipo_contacto: z.string().min(1, "Tipo de contacto obrigatório"),
  areas: z
    .union([z.string(), z.array(z.string())])
    .transform((v) => (Array.isArray(v) ? v : [v]))
    .optional()
    .default([]),
  observacoes: z.string().optional(),
  consentimento_rgpd: z
    .string()
    .transform((v) => v === "on")
    .refine((v) => v === true, { message: "É necessário dar consentimento" }),
});

const PROFILE_MAP: Record<string, string> = {
  Cliente: "particular",
  "Potencial Cliente": "particular",
  Parceiro: "parceiro",
  Fornecedor: "fornecedor",
  Investidor: "outro",
  Outro: "outro",
};

const SOLUTION_MAP: Record<string, string> = {
  "Frota+": "frota_mais",
  Combustíveis: "combustiveis",
  Lubrificantes: "lubrificantes",
  "Rede de Postos": "via",
  "Soluções Empresariais": "combustiveis",
  "Parcerias Comerciais": "patrocinios",
};

export type RegistarFormState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
} | null;

export async function registarInteresse(
  _prevState: RegistarFormState,
  formData: FormData
): Promise<RegistarFormState> {
  const raw = {
    nome: formData.get("nome"),
    empresa: formData.get("empresa"),
    cargo: formData.get("cargo"),
    telefone: formData.get("telefone"),
    email: formData.get("email"),
    tipo_contacto: formData.get("tipo_contacto"),
    areas: formData.getAll("areas"),
    observacoes: formData.get("observacoes") ?? "",
    consentimento_rgpd: formData.get("consentimento_rgpd"),
  };

  const parsed = schema.safeParse(raw);

  const fieldErrors: Record<string, string> = {};

  if (!parsed.success) {
    for (const [key, msgs] of Object.entries(
      parsed.error.flatten().fieldErrors
    )) {
      fieldErrors[key] = msgs?.[0] ?? "Campo inválido";
    }
  }

  if (!raw.areas || (raw.areas as string[]).length === 0) {
    fieldErrors.areas = "Seleccione pelo menos uma área de interesse";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const { nome, empresa, cargo, telefone, email, tipo_contacto, areas, observacoes } =
    parsed.data!;

  const profile = PROFILE_MAP[tipo_contacto] ?? "outro";
  const solutions = (areas as string[]).map((a) => SOLUTION_MAP[a] ?? a);

  const scoreInput = {
    profile,
    solutions,
    purchaseTimeline: "apenas_info",
    wantsContact: true,
  };

  const score = calculateScore(scoreInput);

  try {
    await db.insert(leads).values({
      fullName: nome,
      phone: telefone,
      email,
      profile,
      companyName: empresa,
      jobTitle: cargo,
      solutions,
      notes: observacoes || null,
      purchaseTimeline: "apenas_info",
      wantsContact: true,
      gdprConsent: true,
      ...score,
    });

    return { success: true };
  } catch (err) {
    console.error("[registarInteresse] INSERT ERROR:", err);
    return { error: "Erro ao registar. Por favor tente novamente." };
  }
}
