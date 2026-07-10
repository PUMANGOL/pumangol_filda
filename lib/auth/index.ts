import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { sessions, users } from "@/lib/db/schema";
import { eq, gt } from "drizzle-orm";
import { SESSION_COOKIE } from "./config";
import type { User } from "@/lib/db/schema";
import { randomUUID } from "crypto";

export async function createSession(userId: number): Promise<string> {
  const id = randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await db.insert(sessions).values({ id, userId, expiresAt });
  return id;
}

export async function deleteSession(sessionId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export async function getSession(): Promise<{
  user: User;
  sessionId: string;
} | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;

  try {
    const result = await db
      .select({ session: sessions, user: users })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(eq(sessions.id, sessionId))
      .limit(1);

    if (!result.length) {
      cookieStore.delete(SESSION_COOKIE);
      return null;
    }

    const { session, user } = result[0];
    if (session.expiresAt < new Date()) {
      try {
        await deleteSession(sessionId);
      } catch {
        // Sessão expirada — ignorar erro ao limpar na BD
      }
      cookieStore.delete(SESSION_COOKIE);
      return null;
    }

    return { user, sessionId };
  } catch (err) {
    console.error("[getSession]", err);
    cookieStore.delete(SESSION_COOKIE);
    return null;
  }
}

export async function requireAuth(): Promise<User> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function cleanExpiredSessions(): Promise<void> {
  await db.delete(sessions).where(gt(sessions.expiresAt, new Date()));
}
