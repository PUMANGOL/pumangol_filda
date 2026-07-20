import { asc, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { reclamacoes } from "@/lib/db/schema";
import { RECLAMACAO_CATEGORIES } from "@/lib/reclamacoes/constants";

/** Categorias pré-definidas + categorias já usadas em reclamações. */
export async function listReclamacaoCategories(): Promise<string[]> {
  const rows = await db
    .selectDistinct({ category: reclamacoes.category })
    .from(reclamacoes)
    .where(sql`trim(${reclamacoes.category}) <> ''`)
    .orderBy(asc(reclamacoes.category));

  const fromDb = rows.map((r) => r.category.trim()).filter(Boolean);
  return Array.from(new Set([...RECLAMACAO_CATEGORIES, ...fromDb]));
}
