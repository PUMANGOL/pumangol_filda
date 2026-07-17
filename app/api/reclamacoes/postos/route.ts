import { NextResponse } from "next/server";
import { getSessionOrPortal } from "@/lib/auth/portal";
import { listPostosAbastecimento } from "@/lib/reclamacoes/postos";

export async function GET() {
  try {
    const auth = await getSessionOrPortal();
    if (!auth) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const postos = await listPostosAbastecimento();
    return NextResponse.json({ postos });
  } catch (error) {
    console.error("Get postos error:", error);
    return NextResponse.json(
      { error: "Não foi possível carregar os postos." },
      { status: 500 }
    );
  }
}
