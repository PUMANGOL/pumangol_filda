"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { destroySession } from "@/lib/auth/session";
import { AUTH_ROUTES } from "@/lib/auth/config";

const schema = z
  .object({
    currentPassword: z.string().min(1, "Senha actual é obrigatória"),
    newUsername: z
      .string()
      .trim()
      .min(3, "Utilizador deve ter pelo menos 3 caracteres")
      .transform((value) => value.toLowerCase()),
    newPassword: z.string(),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    const hasNewPassword = data.newPassword.length > 0;
    const hasConfirm = data.confirmPassword.length > 0;

    if (!hasNewPassword && !hasConfirm) return;

    if (!hasNewPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Indique a nova senha",
        path: ["newPassword"],
      });
    } else if (data.newPassword.length < 8) {
      ctx.addIssue({
        code: "custom",
        message: "Nova senha deve ter pelo menos 8 caracteres",
        path: ["newPassword"],
      });
    }

    if (!hasConfirm) {
      ctx.addIssue({
        code: "custom",
        message: "Confirme a nova senha",
        path: ["confirmPassword"],
      });
    } else if (hasNewPassword && data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "As senhas não coincidem",
        path: ["confirmPassword"],
      });
    }
  });

export type ChangeCredentialsState = {
  error?: string;
  fieldErrors?: Record<string, string>;
} | null;

export async function changeCredentialsAction(
  _prevState: ChangeCredentialsState,
  formData: FormData
): Promise<ChangeCredentialsState> {
  const session = await getSession();
  if (!session) {
    return { error: "Sessão expirada. Inicie sessão novamente." };
  }

  const parsed = schema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newUsername: formData.get("newUsername"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const [key, msgs] of Object.entries(parsed.error.flatten().fieldErrors)) {
      fieldErrors[key] = msgs?.[0] ?? "Campo inválido";
    }
    return { fieldErrors };
  }

  const { currentPassword, newUsername, newPassword } = parsed.data;
  const wantsPasswordChange = newPassword.length > 0;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (!user) {
    return { error: "Utilizador não encontrado." };
  }

  const validCurrent = await verifyPassword(currentPassword, user.passwordHash);
  if (!validCurrent) {
    return { fieldErrors: { currentPassword: "Senha actual incorrecta" } };
  }

  if (newUsername !== user.username) {
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, newUsername))
      .limit(1);

    if (existing) {
      return { fieldErrors: { newUsername: "Este nome de utilizador já está em uso" } };
    }
  }

  const sameUsername = newUsername === user.username;

  if (sameUsername && !wantsPasswordChange) {
    return { error: "Indique um novo utilizador ou uma nova senha." };
  }

  if (wantsPasswordChange) {
    const samePassword = await verifyPassword(newPassword, user.passwordHash);
    if (samePassword) {
      return { fieldErrors: { newPassword: "A nova senha deve ser diferente da actual." } };
    }
  }

  const updates: { username: string; passwordHash?: string } = { username: newUsername };
  if (wantsPasswordChange) {
    updates.passwordHash = await hashPassword(newPassword);
  }

  await db
    .update(users)
    .set(updates)
    .where(eq(users.id, user.id));

  await destroySession();
  redirect(`${AUTH_ROUTES.login}?credentialsUpdated=1`);
}
