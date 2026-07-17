import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

export async function listPostosAbastecimento(): Promise<string[]> {
  const result = await db.execute(
    sql`SELECT ts.designacao FROM tb_site ts WHERE ts.rtm IS NOT NULL`
  );

  const rows = result as unknown as { designacao: string | null }[];
  const names = new Set<string>();

  for (const row of rows) {
    const designacao = row.designacao?.trim();
    if (designacao) names.add(designacao);
  }

  return [...names].sort((a, b) => a.localeCompare(b, "pt"));
}
