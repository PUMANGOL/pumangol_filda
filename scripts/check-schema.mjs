import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client);

// Check table columns
const cols = await db.execute(
  sql`SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'leads'
      ORDER BY ordinal_position`
);

console.log("\n=== leads table columns ===");
for (const c of cols) {
  const nullable = c.is_nullable === "YES" ? "nullable" : "NOT NULL";
  const def = c.column_default ? ` DEFAULT ${c.column_default}` : "";
  console.log(`  ${c.column_name} (${c.data_type}) ${nullable}${def}`);
}

// Try a manual insert to isolate the problem
console.log("\n=== Testing insert ===");
try {
  const result = await db.execute(sql`
    INSERT INTO leads (
      full_name, phone, email, profile,
      solutions, purchase_timeline, wants_contact, gdpr_consent,
      score_profile, score_interest, score_potential, score_timeline, score_contact,
      total_score, classification
    ) VALUES (
      'Teste Script', '+244900000000', 'teste@script.ao', 'outro',
      '["combustiveis"]'::jsonb, 'apenas_info', true, true,
      5, 5, 0, 0, 10,
      20, 'C'
    ) RETURNING id
  `);
  console.log("Insert OK — id:", result[0]?.id);

  // Clean up test record
  await db.execute(sql`DELETE FROM leads WHERE email = 'teste@script.ao'`);
  console.log("Test record cleaned up.");
} catch (err) {
  console.error("Insert FAILED:", err.message);
  console.error(err);
}

await client.end();
