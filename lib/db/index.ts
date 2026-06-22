import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type Database = PostgresJsDatabase<typeof schema>;

const globalForDb = globalThis as unknown as {
  client: ReturnType<typeof postgres> | undefined;
  db: Database | undefined;
};

function createClient() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error(
      "Variável de ambiente DATABASE_URL em falta."
    );
  }

  return postgres(url, { prepare: false });
}

export function getDb(): Database {
  if (globalForDb.db) {
    return globalForDb.db;
  }

  const client = globalForDb.client ?? createClient();

  if (process.env.NODE_ENV !== "production") {
    globalForDb.client = client;
  }

  globalForDb.db = drizzle(client, { schema });
  return globalForDb.db;
}
