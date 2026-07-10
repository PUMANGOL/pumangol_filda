/**
 * Legacy login module — re-exports from the new auth module.
 * Kept for backward compatibility with existing code.
 */
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth";
import { SESSION_COOKIE, SESSION_EXPIRY_DAYS } from "@/lib/auth/config";
import { cookies } from "next/headers";

export type LoginResult =
  | { ok: true }
  | { ok: false; error: string };

export async function authenticate(
  username: string,
  password: string
): Promise<LoginResult> {
  const normalized = username.trim().toLowerCase();
  if (!normalized || !password) {
    return { ok: false, error: "Credenciais inválidas." };
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, normalized))
    .limit(1);

  if (!user) {
    return { ok: false, error: "Credenciais inválidas." };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return { ok: false, error: "Credenciais inválidas." };
  }

  const sessionId = await createSession(user.id);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
  });

  return { ok: true };
}
