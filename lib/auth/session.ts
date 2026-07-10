/**
 * Legacy session module — bridges old code to the new auth module.
 */
import { cookies } from "next/headers";
import {
  createSession,
  deleteSession,
  getSession as getSessionNew,
} from "@/lib/auth";
import { SESSION_COOKIE } from "./config";

export { createSession };

/** Backward-compat: destroySession with no arguments (reads cookie internally). */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (sessionId) {
    await deleteSession(sessionId);
    cookieStore.delete(SESSION_COOKIE);
  }
}

export type AuthUser = {
  id: number;
  username: string;
  /** Legacy alias for fullName */
  nome: string;
  fullName: string;
  role: string;
};

/** Backward-compatible getSession that returns the old AuthUser shape. */
export async function getSession(): Promise<AuthUser | null> {
  const session = await getSessionNew();
  if (!session) return null;
  return {
    id: session.user.id,
    username: session.user.username,
    nome: session.user.fullName,
    fullName: session.user.fullName,
    role: session.user.role,
  };
}
