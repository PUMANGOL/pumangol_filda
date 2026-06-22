import { desc, inArray, isNotNull, notInArray } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { leads, registoAreasInteresse, registosInteresse } from "@/lib/db/schema";
import { PIPELINE_STAGES } from "@/lib/constants";
import type {
  DashboardStats,
  Lead,
  PipelineStage,
  RegistoInteresse,
} from "@/lib/types";

function formatDate(value: Date | string | null | undefined): string | null {
  if (!value) return null;
  if (typeof value === "string") return value.slice(0, 10);
  return value.toISOString().slice(0, 10);
}

function toPipelineStage(value: string): PipelineStage {
  return (PIPELINE_STAGES as readonly string[]).includes(value)
    ? (value as PipelineStage)
    : "Captada";
}

function mapRowToLead(row: typeof leads.$inferSelect): Lead {
  return {
    id: row.pkLead,
    company: row.empresa,
    contactName: row.nomeContacto,
    email: row.email,
    phone: row.telefone,
    type: row.tipo ?? "Potencial Cliente",
    product: row.produto,
    stage: toPipelineStage(row.estagio),
    interestLevel: row.nivelInteresse ?? "Médio",
    businessPotential: row.potencialNegocio ?? "Médio",
    assignedTo: row.atribuidoA ?? "",
    createdAt: formatDate(row.criadoEm) ?? "",
    nextFollowUp: formatDate(row.proximoFollowup),
    lastContact: formatDate(row.ultimoContacto),
    notes: row.notas ?? "",
  };
}

export type PipelineCounts = Record<(typeof PIPELINE_STAGES)[number], number>;

function emptyPipelineCounts(): PipelineCounts {
  return Object.fromEntries(
    PIPELINE_STAGES.map((stage) => [stage, 0])
  ) as PipelineCounts;
}

function computeStats(leadList: Lead[]): DashboardStats {
  return {
    totalLeads: leadList.length,
    qualifiedLeads: leadList.filter((l) =>
      ["Qualificada", "Proposta Enviada", "Negociação"].includes(l.stage)
    ).length,
    potentialClients: leadList.filter(
      (l) => l.type === "Potencial Cliente"
    ).length,
    potentialPartners: leadList.filter((l) => l.type === "Parceiro").length,
    closedDeals: leadList.filter((l) => l.stage === "Convertida").length,
  };
}

function computePipelineCounts(leadList: Lead[]): PipelineCounts {
  const counts = emptyPipelineCounts();
  for (const lead of leadList) {
    if (lead.stage in counts) {
      counts[lead.stage]++;
    }
  }
  return counts;
}

export type DashboardData = {
  leads: Lead[];
  stats: DashboardStats;
  pipelineCounts: PipelineCounts;
};

export async function getDashboardData(): Promise<DashboardData> {
  const rows = await getDb()
    .select()
    .from(leads)
    .orderBy(desc(leads.criadoEm));

  const leadList = rows.map(mapRowToLead);

  return {
    leads: leadList,
    stats: computeStats(leadList),
    pipelineCounts: computePipelineCounts(leadList),
  };
}

export async function getRegistosInteresseDisponiveis(): Promise<
  RegistoInteresse[]
> {
  const db = getDb();

  const linkedRows = await db
    .select({ id: leads.fkRegistoInteresse })
    .from(leads)
    .where(isNotNull(leads.fkRegistoInteresse));

  const linkedIds = linkedRows
    .map((row) => row.id)
    .filter((id): id is number => id != null);

  const rows =
    linkedIds.length > 0
      ? await db
          .select()
          .from(registosInteresse)
          .where(
            notInArray(registosInteresse.pkRegistosInteresse, linkedIds)
          )
          .orderBy(desc(registosInteresse.criadoEm))
      : await db
          .select()
          .from(registosInteresse)
          .orderBy(desc(registosInteresse.criadoEm));

  if (rows.length === 0) {
    return [];
  }

  const ids = rows.map((row) => row.pkRegistosInteresse);
  const areaRows = await db
    .select()
    .from(registoAreasInteresse)
    .where(inArray(registoAreasInteresse.pkRegistoAreasInteresse, ids));

  const areasByRegisto = new Map<number, string[]>();
  for (const areaRow of areaRows) {
    const current = areasByRegisto.get(areaRow.pkRegistoAreasInteresse) ?? [];
    current.push(areaRow.area);
    areasByRegisto.set(areaRow.pkRegistoAreasInteresse, current);
  }

  return rows.map((row) => ({
    id: row.pkRegistosInteresse,
    nome: row.nome,
    empresa: row.empresa,
    cargo: row.cargo,
    telefone: row.telefone,
    email: row.email,
    tipoContacto: row.tipoContacto,
    areas: areasByRegisto.get(row.pkRegistosInteresse) ?? [],
    observacoes: row.observacoes,
    consentimentoRgpd: row.consentimentoRgpd,
    criadoEm: formatDate(row.criadoEm) ?? "",
  }));
}

export async function getRegistosInteresse(): Promise<RegistoInteresse[]> {
  const db = getDb();

  const rows = await db
    .select()
    .from(registosInteresse)
    .orderBy(desc(registosInteresse.criadoEm));

  if (rows.length === 0) {
    return [];
  }

  const ids = rows.map((row) => row.pkRegistosInteresse);
  const areaRows = await db
    .select()
    .from(registoAreasInteresse)
    .where(inArray(registoAreasInteresse.pkRegistoAreasInteresse, ids));

  const areasByRegisto = new Map<number, string[]>();
  for (const areaRow of areaRows) {
    const current = areasByRegisto.get(areaRow.pkRegistoAreasInteresse) ?? [];
    current.push(areaRow.area);
    areasByRegisto.set(areaRow.pkRegistoAreasInteresse, current);
  }

  return rows.map((row) => ({
    id: row.pkRegistosInteresse,
    nome: row.nome,
    empresa: row.empresa,
    cargo: row.cargo,
    telefone: row.telefone,
    email: row.email,
    tipoContacto: row.tipoContacto,
    areas: areasByRegisto.get(row.pkRegistosInteresse) ?? [],
    observacoes: row.observacoes,
    consentimentoRgpd: row.consentimentoRgpd,
    criadoEm: formatDate(row.criadoEm) ?? "",
  }));
}
