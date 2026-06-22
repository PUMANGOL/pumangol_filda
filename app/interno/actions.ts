"use server";

import { eq, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { leads, registosInteresse } from "@/lib/db/schema";
import {
  extractLeadFormValues,
  parseLeadForm,
  zodFieldErrors,
  type LeadFormField,
  type LeadFormValues,
} from "@/lib/validations/lead";

export type InternoFormState = {
  success?: boolean;
  leadId?: string;
  error?: string;
  fieldErrors?: Partial<Record<LeadFormField, string>>;
  values?: LeadFormValues;
  submissionKey?: number;
} | null;

async function nextLeadId(
  tx: Parameters<Parameters<ReturnType<typeof getDb>["transaction"]>[0]>[0]
): Promise<string> {
  const result = await tx.execute<{ id: string }>(
    sql`SELECT 'LD-' || LPAD(nextval('lead_numero_seq')::text, 3, '0') AS id`
  );

  const row = result[0];
  if (!row?.id) {
    throw new Error("Falha ao gerar ID da lead.");
  }

  return row.id;
}

export async function guardarLead(
  _prevState: InternoFormState,
  formData: FormData
): Promise<InternoFormState> {
  const values = extractLeadFormValues(formData);
  const parsed = parseLeadForm(formData);

  if (!parsed.success) {
    return {
      success: false,
      error: "Corrija os campos assinalados e tente novamente.",
      fieldErrors: zodFieldErrors(parsed.error),
      values,
      submissionKey: Date.now(),
    };
  }

  const data = parsed.data;

  if (data.fkRegistoInteresse != null) {
    const [registo] = await getDb()
      .select({ id: registosInteresse.pkRegistosInteresse })
      .from(registosInteresse)
      .where(eq(registosInteresse.pkRegistosInteresse, data.fkRegistoInteresse))
      .limit(1);

    if (!registo) {
      return {
        success: false,
        error: "O registo de interesse seleccionado já não está disponível.",
        fieldErrors: {
          fkRegistoInteresse: "Seleccione um registo válido.",
        },
        values,
        submissionKey: Date.now(),
      };
    }
  }

  const origem = data.fkRegistoInteresse != null ? "publico" : "interno";

  try {
    const leadId = await getDb().transaction(async (tx) => {
      const id = await nextLeadId(tx);

      await tx.insert(leads).values({
        pkLead: id,
        empresa: data.empresa,
        nif: data.nif,
        sector: data.sector,
        colaboradores: data.colaboradores,
        localizacao: data.localizacao,
        nomeContacto: data.nome,
        cargo: data.cargo,
        telefone: data.telefone,
        email: data.email,
        tipo: data.tipo,
        comoConheceu: data.comoConheceu,
        nivelInteresse: data.nivelInteresse,
        produto: data.produto,
        horizonteCompra: data.horizonte,
        potencialNegocio: data.potencial,
        notas: data.comentarios,
        origem,
        fkRegistoInteresse: data.fkRegistoInteresse,
      });

      return id;
    });

    return { success: true, leadId };
  } catch (error) {
    console.error("Erro ao guardar lead:", error);

    const message =
      error instanceof Error ? error.message.toLowerCase() : "";

    if (message.includes("connect") || message.includes("econnrefused")) {
      return {
        success: false,
        error:
          "Não foi possível ligar à base de dados. Tente novamente mais tarde.",
        values,
        submissionKey: Date.now(),
      };
    }

    return {
      success: false,
      error: "Ocorreu um erro ao guardar a lead. Tente novamente.",
      values,
      submissionKey: Date.now(),
    };
  }
}
