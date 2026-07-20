import { NextResponse } from "next/server";
import { getSessionOrPortal } from "@/lib/auth/portal";
import { listReclamacaoCategories } from "@/lib/reclamacoes/categories";

export async function GET() {
  try {
    const auth = await getSessionOrPortal();
    if (!auth) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const categories = await listReclamacaoCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Get reclamacao categories error:", error);
    return NextResponse.json(
      { error: "Não foi possível carregar as categorias." },
      { status: 500 }
    );
  }
}
