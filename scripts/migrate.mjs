// One-shot migration script — run with: node scripts/migrate.mjs
import postgres from "postgres";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(join(__dirname, "../sql/init.sql"), "utf8");

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:Pumangol2023%21@localhost:5432/my_pumangol_portal";

const client = postgres(connectionString, { max: 1 });

try {
  console.log("Running migration...");
  await client.unsafe(sql);
  console.log("✓ Migration complete");
} catch (err) {
  console.error("Migration failed:", err.message);
  process.exit(1);
} finally {
  await client.end();
}
