"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { calculateScore } from "@/lib/scoring";

const leadSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(7),
  email: z.string().email(),
  province: z.string().optional(),
  municipality: z.string().optional(),
  profile: z.enum([
    "particular",
    "empresa",
    "orgao_publico",
    "fornecedor",
    "parceiro",
    "outro",
  ]),
  companyName: z.string().optional(),
  sector: z.string().optional(),
  jobTitle: z.string().optional(),
  isExistingClient: z.boolean().nullish(),
  existingClientAreas: z.array(z.string()).optional(),
  solutions: z.array(z.string()).default([]),
  lubricantVehicleTypeParticular: z.string().optional(),
  usesViaApp: z.boolean().nullish(),
  cardPurposeParticular: z.string().optional(),
  combustiveisPurpose: z.string().optional(),
  combustiveisConsumption: z.string().optional(),
  lubricantVehicleCountEmpresa: z.string().optional(),
  frotaVehicleCount: z.string().optional(),
  frotaInterest: z.string().optional(),
  angobetumesInterest: z.string().optional(),
  angobetumesActivity: z.string().optional(),
  aviacaoOperationType: z.string().optional(),
  cardPurposeEmpresa: z.string().optional(),
  supplierArea: z.string().optional(),
  partnerArea: z.string().optional(),
  purchaseTimeline: z.enum([
    "imediatamente",
    "ate_3_meses",
    "3_6_meses",
    "6_12_meses",
    "apenas_info",
  ]),
  wantsContact: z.boolean(),
  contactPreference: z.array(z.string()).optional(),
  gdprConsent: z.boolean(),
  notes: z.string().optional(),
});

export type CreateLeadInput = z.infer<typeof leadSchema>;

export type CreateLeadResult =
  | { success: true; leadId: number; classification: string; totalScore: number }
  | { success: false; error: string };

export async function createLead(input: CreateLeadInput): Promise<CreateLeadResult> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Sessão expirada. Inicie sessão novamente." };
  }

  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) {
    console.error("[createLead] validation:", parsed.error.flatten());
    return { success: false, error: "Dados inválidos. Verifique os campos obrigatórios." };
  }

  const data = parsed.data;

  if (!data.gdprConsent) {
    return { success: false, error: "É necessário o consentimento RGPD." };
  }

  const score = calculateScore({
    profile: data.profile,
    solutions: data.solutions,
    combustiveisConsumption: data.combustiveisConsumption,
    lubricantVehicleCountEmpresa: data.lubricantVehicleCountEmpresa,
    frotaVehicleCount: data.frotaVehicleCount,
    purchaseTimeline: data.purchaseTimeline,
    wantsContact: data.wantsContact,
  });

  try {
    const [lead] = await db
      .insert(leads)
      .values({
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        province: data.province,
        municipality: data.municipality,
        profile: data.profile,
        companyName: data.companyName,
        sector: data.sector,
        jobTitle: data.jobTitle,
        isExistingClient: data.isExistingClient ?? null,
        existingClientAreas: data.existingClientAreas,
        solutions: data.solutions,
        lubricantVehicleTypeParticular: data.lubricantVehicleTypeParticular,
        usesViaApp: data.usesViaApp ?? null,
        cardPurposeParticular: data.cardPurposeParticular,
        combustiveisPurpose: data.combustiveisPurpose,
        combustiveisConsumption: data.combustiveisConsumption,
        lubricantVehicleCountEmpresa: data.lubricantVehicleCountEmpresa,
        frotaVehicleCount: data.frotaVehicleCount,
        frotaInterest: data.frotaInterest,
        angobetumesInterest: data.angobetumesInterest,
        angobetumesActivity: data.angobetumesActivity,
        aviacaoOperationType: data.aviacaoOperationType,
        cardPurposeEmpresa: data.cardPurposeEmpresa,
        supplierArea: data.supplierArea,
        partnerArea: data.partnerArea,
        purchaseTimeline: data.purchaseTimeline,
        wantsContact: data.wantsContact,
        contactPreference: data.contactPreference,
        gdprConsent: data.gdprConsent,
        notes: data.notes,
        scoreProfile: score.scoreProfile,
        scoreInterest: score.scoreInterest,
        scorePotential: score.scorePotential,
        scoreTimeline: score.scoreTimeline,
        scoreContact: score.scoreContact,
        totalScore: score.totalScore,
        classification: score.classification,
        submittedByUserId: session.user.id,
        submittedByUsername: session.user.username,
        submittedByFullName: session.user.fullName,
      })
      .returning({ id: leads.id });

    return {
      success: true,
      leadId: lead.id,
      classification: score.classification,
      totalScore: score.totalScore,
    };
  } catch (err) {
    console.error("[createLead] INSERT ERROR:", err);
    return {
      success: false,
      error: "Erro ao guardar na base de dados. Verifique a ligação à BD.",
    };
  }
}
