import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client);

const rows = await db.execute(
  sql`SELECT id, full_name, email, profile, solutions, total_score, classification, created_at
      FROM leads
      ORDER BY created_at DESC
      LIMIT 10`
);

console.log(`\nTotal registos encontrados: ${rows.length}`);
for (const r of rows) {
  console.log(`  [${r.id}] ${r.full_name} | ${r.email} | perfil: ${r.profile} | score: ${r.total_score} (${r.classification}) | ${r.created_at}`);
}

await client.end();
