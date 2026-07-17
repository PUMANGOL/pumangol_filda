import { NextRequest, NextResponse } from "next/server";
import { desc, eq, like, or, and, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { reclamacoes } from "@/lib/db/schema";
import { getSessionOrPortal } from "@/lib/auth/portal";

export async function GET(request: NextRequest) {
  try {
    const auth = await getSessionOrPortal();
    if (!auth) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = parseInt(searchParams.get("limit") ?? "20", 10);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const offset = (page - 1) * limit;

    const conditions = [];

    if (category) {
      conditions.push(eq(reclamacoes.category, category));
    }
    if (search) {
      conditions.push(
        or(
          like(reclamacoes.description, `%${search}%`),
          like(reclamacoes.category, `%${search}%`),
          like(reclamacoes.nome, `%${search}%`),
          like(reclamacoes.telefone, `%${search}%`),
          like(reclamacoes.email, `%${search}%`)
        )
      );
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, countResult] = await Promise.all([
      db
        .select()
        .from(reclamacoes)
        .where(where)
        .orderBy(desc(reclamacoes.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(reclamacoes)
        .where(where),
    ]);

    return NextResponse.json({
      reclamacoes: rows,
      total: countResult[0]?.count ?? 0,
      page,
      limit,
    });
  } catch (error) {
    console.error("Get reclamacoes error:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
