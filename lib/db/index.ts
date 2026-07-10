import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;
const isProd = process.env.NODE_ENV === "production";

const globalForDb = globalThis as typeof globalThis & {
  pgClient?: ReturnType<typeof postgres>;
};

const client =
  globalForDb.pgClient ??
  postgres(connectionString, {
    max: isProd ? 10 : 3,
    idle_timeout: isProd ? 30 : 10,
    connect_timeout: 10,
  });

if (!isProd) {
  globalForDb.pgClient = client;
}

export const db = drizzle(client, { schema });

/** Backward-compat alias for older modules. */
export const getDb = () => db;
