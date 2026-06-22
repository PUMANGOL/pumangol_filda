import { sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { verifyPassword } from "./password";
import { createSession } from "./session";

export type LoginResult =
  | { ok: true }
  | { ok: false; error: string };

/** Autentica por email/senha. Mensagem genérica em falha (evita enumeração). */
export async function authenticate(
  email: string,
  password: string
): Promise<LoginResult> {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !password) {
    return { ok: false, error: "Credenciais inválidas." };
  }

  const [user] = await getDb()
    .select()
    .from(users)
    .where(sql`lower(${users.email}) = ${normalized}`)
    .limit(1);

  // Mesma mensagem quer o email exista ou não
  if (!user?.activo) {
    return { ok: false, error: "Credenciais inválidas." };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return { ok: false, error: "Credenciais inválidas." };
  }

  await createSession(user.pkUser);
  return { ok: true };
}
