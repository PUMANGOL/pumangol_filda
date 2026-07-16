import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { getSessionOrPortal } from "@/lib/auth/portal";
import { PROFILE_LABELS, SOLUTION_LABELS, TIMELINE_LABELS, ACADEMIA_TOPIC_LABELS } from "@/lib/utils";
import ExcelJS from "exceljs";
import { desc } from "drizzle-orm";

const PRIMARY_COLOR = "FF057143";
const PRIMARY_DARK = "FF045A36";

function submittedByLabel(
  fullName: string | null | undefined,
  username: string | null | undefined
): string {
  return fullName?.trim() || username?.trim() || "Externo";
}

export async function GET(request: NextRequest) {
  const auth = await getSessionOrPortal();
  if (!auth) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const rows = await db.select().from(leads).orderBy(desc(leads.createdAt));

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Pumangol FILDA 2026";
  workbook.created = new Date();

  const ws = workbook.addWorksheet("Leads FILDA 2026", {
    views: [{ state: "frozen", ySplit: 1 }],
  });

  ws.columns = [
    { header: "#", key: "ordem", width: 8 },
    { header: "Data/Hora", key: "createdAt", width: 20 },
    { header: "Nome", key: "fullName", width: 28 },
    { header: "Telefone", key: "phone", width: 16 },
    { header: "E-mail", key: "email", width: 30 },
    { header: "Província", key: "province", width: 18 },
    { header: "Município", key: "municipality", width: 18 },
    { header: "Perfil", key: "profile", width: 22 },
    { header: "Empresa", key: "companyName", width: 28 },
    { header: "Sector", key: "sector", width: 22 },
    { header: "Cargo", key: "jobTitle", width: 22 },
    { header: "Já cliente?", key: "isExistingClient", width: 12 },
    { header: "Soluções de Interesse", key: "solutions", width: 40 },
    { header: "Academia de Formação", key: "academiaTopics", width: 36 },
    { header: "Timeline de Compra", key: "purchaseTimeline", width: 28 },
    { header: "Quer Contacto?", key: "wantsContact", width: 15 },
    { header: "Preferência Contacto", key: "contactPreference", width: 28 },
    { header: "Pontuação Total", key: "totalScore", width: 15 },
    { header: "Classificação", key: "classification", width: 14 },
    { header: "Score Perfil", key: "scoreProfile", width: 12 },
    { header: "Score Interesse", key: "scoreInterest", width: 14 },
    { header: "Score Potencial", key: "scorePotential", width: 14 },
    { header: "Score Timeline", key: "scoreTimeline", width: 14 },
    { header: "Score Contacto", key: "scoreContact", width: 14 },
    { header: "Registado por", key: "submittedByFullName", width: 22 },
  ];

  // Header style — cor primária
  ws.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: PRIMARY_COLOR },
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      bottom: { style: "thin", color: { argb: PRIMARY_DARK } },
    };
  });

  const classificationColors: Record<string, string> = {
    "A+": "FFFF0000",
    A: "FFFF6600",
    B: "FFFFCC00",
    C: "FF6699FF",
    D: "FF999999",
    FORNECEDOR: "FF9333EA",
  };

  rows.forEach((lead, i) => {
    const solutions = (lead.solutions as string[]) ?? [];
    const contactPreference = (lead.contactPreference as string[]) ?? [];

    const row = ws.addRow({
      ordem: i + 1,
      createdAt: new Date(lead.createdAt).toLocaleString("pt-PT"),
      fullName: lead.fullName,
      phone: lead.phone,
      email: lead.email,
      province: lead.province ?? "",
      municipality: lead.municipality ?? "",
      profile: PROFILE_LABELS[lead.profile] ?? lead.profile,
      companyName: lead.companyName ?? "",
      sector: lead.sector ?? "",
      jobTitle: lead.jobTitle ?? "",
      isExistingClient:
        lead.isExistingClient === true
          ? "Sim"
          : lead.isExistingClient === false
            ? "Não"
            : "",
      solutions: solutions
        .map((s) => SOLUTION_LABELS[s] ?? s)
        .join(", "),
      academiaTopics: ((lead.academiaTopics as string[]) ?? [])
        .map((t) => ACADEMIA_TOPIC_LABELS[t] ?? t)
        .join(", "),
      purchaseTimeline: TIMELINE_LABELS[lead.purchaseTimeline] ?? lead.purchaseTimeline,
      wantsContact: lead.wantsContact ? "Sim" : "Não",
      contactPreference: contactPreference.join(", "),
      totalScore: lead.totalScore,
      classification: lead.classification,
      scoreProfile: lead.scoreProfile,
      scoreInterest: lead.scoreInterest,
      scorePotential: lead.scorePotential,
      scoreTimeline: lead.scoreTimeline,
      scoreContact: lead.scoreContact,
      submittedByFullName: submittedByLabel(
        lead.submittedByFullName,
        lead.submittedByUsername
      ),
    });

    if (i % 2 === 0) {
      row.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF8F8F8" },
        };
      });
    }

    const classCell = row.getCell("classification");
    const color = classificationColors[lead.classification];
    if (color) {
      classCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: color },
      };
      classCell.font = {
        bold: true,
        color: {
          argb: lead.classification === "B" ? "FF000000" : "FFFFFFFF",
        },
      };
    }

    const scoreCell = row.getCell("totalScore");
    scoreCell.font = { bold: true };
  });

  ws.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: ws.columns.length },
  };

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="leads-filda-2026-${Date.now()}.xlsx"`,
    },
  });
}
