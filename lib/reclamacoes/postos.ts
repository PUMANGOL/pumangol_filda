import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

const POSTO_NAME_KEYS = [
  "nome",
  "nm_site",
  "name",
  "designacao",
  "ds_site",
  "site_name",
  "titulo",
  "descricao",
] as const;

function extractPostoNome(row: Record<string, unknown>): string | null {
  for (const key of POSTO_NAME_KEYS) {
    const lower = row[key];
    if (typeof lower === "string" && lower.trim()) {
      return lower.trim();
    }
    const upper = row[key.toUpperCase()];
    if (typeof upper === "string" && upper.trim()) {
      return upper.trim();
    }
  }
  return null;
}

export async function listPostosAbastecimento(): Promise<string[]> {
  const result = await db.execute(
    sql`SELECT * FROM tb_site ts WHERE ts.rtm IS NOT NULL`
  );

  const rows = result as unknown as Record<string, unknown>[];
  const names = new Set<string>();

  for (const row of rows) {
    const nome = extractPostoNome(row);
    if (nome) names.add(nome);
  }

  return [...names].sort((a, b) => a.localeCompare(b, "pt"));
}
