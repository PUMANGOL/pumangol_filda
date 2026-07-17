"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { reclamacoes } from "@/lib/db/schema";
import { getSessionOrPortal } from "@/lib/auth/portal";
import {
  RECLAMACAO_CATEGORIES,
  categoryRequiresPosto,
} from "@/lib/reclamacoes/constants";
import { listPostosAbastecimento } from "@/lib/reclamacoes/postos";
import { isHtmlEffectivelyEmpty } from "@/lib/html";

const createSchema = z
  .object({
    nome: z.string().min(2, "Nome inválido."),
    telefone: z.string().optional(),
    email: z
      .string()
      .optional()
      .refine(
        (v) => !v?.trim() || z.string().email().safeParse(v.trim()).success,
        "E-mail inválido."
      ),
    category: z.enum(RECLAMACAO_CATEGORIES),
    description: z.string().min(1),
    postoNome: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (categoryRequiresPosto(data.category) && !data.postoNome?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Seleccione o posto de abastecimento.",
        path: ["postoNome"],
      });
    }
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

  let postoNome: string | null = null;
  if (categoryRequiresPosto(parsed.data.category)) {
    const allowed = await listPostosAbastecimento();
    const chosen = parsed.data.postoNome?.trim() ?? "";
    if (!allowed.includes(chosen)) {
      return { success: false, error: "Posto de abastecimento inválido." };
    }
    postoNome = chosen;
  }

  try {
    const [row] = await db
      .insert(reclamacoes)
      .values({
        nome: parsed.data.nome.trim(),
        telefone: parsed.data.telefone?.trim() || null,
        email: parsed.data.email?.trim() || null,
        category: parsed.data.category,
        postoNome,
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
