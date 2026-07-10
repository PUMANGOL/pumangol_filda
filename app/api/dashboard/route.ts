import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { sql, desc, getTableName } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const leadsTable = getTableName(leads);

  try {
    const [
      totalResult,
      byClassification,
      byProfile,
      bySolution,
      recentLeads,
      todayResult,
      byTimeline,
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)::int` }).from(leads),

      db
        .select({
          classification: leads.classification,
          count: sql<number>`count(*)::int`,
        })
        .from(leads)
        .groupBy(leads.classification),

      db
        .select({
          profile: leads.profile,
          count: sql<number>`count(*)::int`,
        })
        .from(leads)
        .groupBy(leads.profile),

      db.execute(sql`
        SELECT s as solution, count(*)::int as count
        FROM ${sql.identifier(leadsTable)}, jsonb_array_elements_text(solutions) as s
        GROUP BY s
        ORDER BY count DESC
      `),

      db
        .select({
          id: leads.id,
          fullName: leads.fullName,
          email: leads.email,
          profile: leads.profile,
          solutions: leads.solutions,
          totalScore: leads.totalScore,
          classification: leads.classification,
          submittedByFullName: leads.submittedByFullName,
          createdAt: leads.createdAt,
        })
        .from(leads)
        .orderBy(desc(leads.createdAt))
        .limit(10),

      db
        .select({ count: sql<number>`count(*)::int` })
        .from(leads)
        .where(sql`date_trunc('day', created_at) = current_date`),

      db
        .select({
          purchaseTimeline: leads.purchaseTimeline,
          count: sql<number>`count(*)::int`,
        })
        .from(leads)
        .groupBy(leads.purchaseTimeline),
    ]);

    return NextResponse.json({
      total: totalResult[0]?.count ?? 0,
      today: todayResult[0]?.count ?? 0,
      byClassification,
      byProfile,
      bySolution: [...bySolution],
      byTimeline,
      recentLeads,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[GET /api/dashboard]", err);
    return NextResponse.json(
      { error: "Erro ao carregar dashboard" },
      { status: 500 }
    );
  }
}
