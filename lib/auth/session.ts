import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { eq, lt } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { sessions, users } from "@/lib/db/schema";
import { SESSION_COOKIE, SESSION_TTL_MS } from "./config";

export type AuthUser = {
  id: number;
  email: string;
  nome: string;
};

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function generateToken(): string {
  return randomBytes(32).toString("base64url");
}

/** Cria sessão na BD e define cookie httpOnly. */
export async function createSession(userId: number): Promise<void> {
  const token = generateToken();
  const expiraEm = new Date(Date.now() + SESSION_TTL_MS);

  await getDb().insert(sessions).values({
    fkUser: userId,
    tokenHash: hashToken(token),
    expiraEm,
  });

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiraEm,
  });
}

/** Valida cookie contra a BD. Retorna null se inválida ou expirada. */
export async function getSession(): Promise<AuthUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const rows = await getDb()
    .select({
      id: users.pkUser,
      email: users.email,
      nome: users.nome,
      activo: users.activo,
      expiraEm: sessions.expiraEm,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.fkUser, users.pkUser))
    .where(eq(sessions.tokenHash, hashToken(token)))
    .limit(1);

  const row = rows[0];
  if (!row || !row.activo || row.expiraEm <= new Date()) {
    await destroySession();
    return null;
  }

  return { id: row.id, email: row.email, nome: row.nome };
}

/** Remove sessão da BD e limpa cookie. */
export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;

  if (token) {
    await getDb()
      .delete(sessions)
      .where(eq(sessions.tokenHash, hashToken(token)));
  }

  jar.delete(SESSION_COOKIE);
}

/** Limpeza oportunista de sessões expiradas (fire-and-forget). */
export function purgeExpiredSessions(): void {
  void getDb()
    .delete(sessions)
    .where(lt(sessions.expiraEm, new Date()));
}
