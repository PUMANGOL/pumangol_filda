import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { getSessionOrPortal } from "@/lib/auth/portal";

export async function GET() {
  try {
    const auth = await getSessionOrPortal();
    if (!auth) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const rows = await db
      .select({
        fullName: leads.submittedByFullName,
        username: leads.submittedByUsername,
      })
      .from(leads)
      .where(
        sql`coalesce(${leads.submittedByFullName}, ${leads.submittedByUsername}) is not null`
      )
      .groupBy(leads.submittedByFullName, leads.submittedByUsername)
      .orderBy(
        sql`coalesce(${leads.submittedByFullName}, ${leads.submittedByUsername})`
      );

    const registrants = [
      ...new Set(
        rows.map(
          (r) => r.fullName?.trim() || r.username?.trim() || ""
        ).filter(Boolean)
      ),
    ].sort((a, b) => a.localeCompare(b, "pt"));

    return NextResponse.json({ registrants });
  } catch (error) {
    console.error("Get lead registrants error:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
