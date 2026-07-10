/**
 * Dashboard queries — updated to use the FILDA 2026 leads schema.
 */
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import type { PipelineStage } from "@/lib/types";

function formatDate(value: Date | string | null | undefined): string | null {
  if (!value) return null;
  if (typeof value === "string") return value.slice(0, 10);
  return value.toISOString().slice(0, 10);
}

import { PIPELINE_STAGES } from "@/lib/constants";

export type PipelineCounts = Record<(typeof PIPELINE_STAGES)[number], number>;

export type DashboardData = {
  leads: typeof leads.$inferSelect[];
  stats: {
    totalLeads: number;
    qualifiedLeads: number;
    potentialClients: number;
    potentialPartners: number;
    closedDeals: number;
  };
  pipelineCounts: Record<string, number>;
};

export type RegistoInteresse = {
  id: number;
  nome: string;
  empresa: string;
  cargo: string;
  telefone: string;
  email: string;
  tipoContacto: string;
  areas: string[];
  observacoes: string | null;
  consentimentoRgpd: boolean;
  criadoEm: string;
};

export async function getDashboardData(): Promise<DashboardData> {
  const rows = await db
    .select()
    .from(leads)
    .orderBy(desc(leads.createdAt));

  const stats = {
    totalLeads: rows.length,
    qualifiedLeads: rows.filter((l) =>
      ["A+", "A"].includes(l.classification)
    ).length,
    potentialClients: rows.filter((l) => l.profile === "empresa").length,
    potentialPartners: rows.filter((l) => l.profile === "parceiro").length,
    closedDeals: 0,
  };

  const pipelineCounts = rows.reduce<Record<string, number>>((acc, l) => {
    acc[l.classification] = (acc[l.classification] ?? 0) + 1;
    return acc;
  }, {});

  return { leads: rows, stats, pipelineCounts };
}

export async function getRegistosInteresseDisponiveis(): Promise<RegistoInteresse[]> {
  return [];
}

export async function getRegistosInteresse(): Promise<RegistoInteresse[]> {
  return [];
}
