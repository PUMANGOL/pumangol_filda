import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { reclamacoes } from "@/lib/db/schema";
import { getSessionOrPortal } from "@/lib/auth/portal";
import { htmlToPlainText } from "@/lib/html";

const PRIMARY_COLOR = "FF057143";
const PRIMARY_DARK = "FF045A36";

function submittedByLabel(
  fullName: string | null | undefined,
  username: string | null | undefined
): string {
  return fullName?.trim() || username?.trim() || "—";
}

export async function GET() {
  const auth = await getSessionOrPortal();
  if (!auth) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const rows = await db
    .select()
    .from(reclamacoes)
    .orderBy(desc(reclamacoes.createdAt));

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Pumangol FILDA 2026";
  workbook.created = new Date();

  const ws = workbook.addWorksheet("Reclamações FILDA 2026", {
    views: [{ state: "frozen", ySplit: 1 }],
  });

  ws.columns = [
    { header: "#", key: "ordem", width: 8 },
    { header: "Data/Hora", key: "createdAt", width: 20 },
    { header: "Categoria", key: "category", width: 24 },
    { header: "Posto", key: "postoNome", width: 28 },
    { header: "Descrição", key: "description", width: 48 },
    { header: "Registado por", key: "submittedByFullName", width: 22 },
  ];

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

  rows.forEach((row, i) => {
    const excelRow = ws.addRow({
      ordem: i + 1,
      createdAt: new Date(row.createdAt).toLocaleString("pt-PT"),
      category: row.category,
      postoNome: row.postoNome ?? "",
      description: htmlToPlainText(row.description),
      submittedByFullName: submittedByLabel(
        row.submittedByFullName,
        row.submittedByUsername
      ),
    });

    if (i % 2 === 0) {
      excelRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF8F8F8" },
        };
      });
    }

    excelRow.getCell("description").alignment = {
      vertical: "top",
      horizontal: "left",
      wrapText: true,
    };
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
      "Content-Disposition": `attachment; filename="reclamacoes-filda-2026-${Date.now()}.xlsx"`,
    },
  });
}
