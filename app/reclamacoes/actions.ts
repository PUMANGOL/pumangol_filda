"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { reclamacoes } from "@/lib/db/schema";
import { getSessionOrPortal } from "@/lib/auth/portal";
import { RECLAMACAO_CATEGORIES } from "@/lib/reclamacoes/constants";
import { isHtmlEffectivelyEmpty } from "@/lib/html";

const createSchema = z.object({
  category: z.enum(RECLAMACAO_CATEGORIES),
  description: z.string().min(1),
});

export type CreateReclamacaoInput = z.infer<typeof createSchema>;

export type CreateReclamacaoResult =
  | { success: true; id: number }
  | { success: false; error: string };

export async function createReclamacao(
  input: CreateReclamacaoInput
): Promise<CreateReclamacaoResult> {
  const auth = await getSessionOrPortal();
  if (!auth) {
    return { success: false, error: "Não autenticado." };
  }

  const parsed = createSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos. Verifique os campos." };
  }

  if (isHtmlEffectivelyEmpty(parsed.data.description)) {
    return { success: false, error: "A descrição é obrigatória." };
  }

  try {
    const [row] = await db
      .insert(reclamacoes)
      .values({
        category: parsed.data.category,
        description: parsed.data.description.trim(),
        submittedByUserId: auth.kind === "session" ? auth.userId : null,
        submittedByUsername:
          auth.kind === "session" ? auth.username : auth.email,
        submittedByFullName:
          auth.kind === "session" ? auth.fullName : auth.email,
      })
      .returning({ id: reclamacoes.id });

    return { success: true, id: row.id };
  } catch (err) {
    console.error("[createReclamacao]", err);
    return {
      success: false,
      error: "Erro ao guardar na base de dados.",
    };
  }
}
