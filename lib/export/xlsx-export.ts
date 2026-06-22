"use client";

import ExcelJS from "exceljs";
import { BRAND } from "@/lib/constants";
import type { Lead, RegistoInteresse } from "@/lib/types";

const BRAND_HEX = BRAND.red.replace("#", "FF");
const SURFACE_HEX = "FFF8F9FA";
const LOGO_PATH = "/pumangol-logo.png";
const LOGO_COLUMN_COUNT = 4;
const LOGO_COLUMN_WIDTH = 26;
const LOGO_NATIVE_WIDTH = 2400;
const LOGO_NATIVE_HEIGHT = 1349;
const LOGO_ROW_HEIGHT_PT = 88;
const HEADER_ROW_NUMBER = 6;

function pointsToPixels(points: number): number {
  return Math.round(points * (96 / 72));
}

function estimateColumnWidthPx(columnWidth: number): number {
  return columnWidth * 7;
}

function computeLogoSize() {
  const maxHeight = Math.round(pointsToPixels(LOGO_ROW_HEIGHT_PT) * 0.97);
  const maxWidth = Math.round(
    LOGO_COLUMN_COUNT * estimateColumnWidthPx(LOGO_COLUMN_WIDTH) * 0.97
  );

  const widthFromHeight = Math.round(
    (maxHeight * LOGO_NATIVE_WIDTH) / LOGO_NATIVE_HEIGHT
  );
  const heightFromWidth = Math.round(
    (maxWidth * LOGO_NATIVE_HEIGHT) / LOGO_NATIVE_WIDTH
  );

  if (widthFromHeight <= maxWidth) {
    return { width: widthFromHeight, height: maxHeight };
  }

  return { width: maxWidth, height: heightFromWidth };
}

function computeLogoColumnOffset(logoWidth: number): number {
  const areaWidth = LOGO_COLUMN_COUNT * estimateColumnWidthPx(LOGO_COLUMN_WIDTH);
  const offsetPx = Math.max(0, (areaWidth - logoWidth) / 2);
  return offsetPx / estimateColumnWidthPx(LOGO_COLUMN_WIDTH);
}

const GRID_BORDER: Partial<ExcelJS.Borders> = {
  top: { style: "thin", color: { argb: "FFDEE2E6" } },
  left: { style: "thin", color: { argb: "FFDEE2E6" } },
  bottom: { style: "thin", color: { argb: "FFDEE2E6" } },
  right: { style: "thin", color: { argb: "FFDEE2E6" } },
};

type ExportColumn<T> = {
  header: string;
  width?: number;
  accessor: (row: T) => string | number | null | undefined;
};

type BrandedExportOptions<T> = {
  filename: string;
  sheetName: string;
  title: string;
  subtitle: string;
  columns: ExportColumn<T>[];
  rows: T[];
};

function formatExportTimestamp(date: Date): string {
  return date.toLocaleString("pt-PT", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

function triggerDownload(buffer: ArrayBuffer, filename: string) {
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

async function loadLogoBuffer(): Promise<ArrayBuffer> {
  const response = await fetch(
    `${window.location.origin}${LOGO_PATH}`,
    { cache: "force-cache" }
  );

  if (!response.ok) {
    throw new Error("Não foi possível carregar o logótipo para exportação.");
  }

  return response.arrayBuffer();
}

export async function exportBrandedXlsx<T>({
  filename,
  sheetName,
  title,
  subtitle,
  columns,
  rows,
}: BrandedExportOptions<T>): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Pumangol FILDA 2026";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet(sheetName, {
    views: [{ showGridLines: true }],
  });

  const logoEndLetter = sheet.getColumn(LOGO_COLUMN_COUNT).letter;
  const lastColumnLetter = sheet.getColumn(columns.length).letter;
  const headerRowNumber = HEADER_ROW_NUMBER;
  const dataStartRow = headerRowNumber + 1;
  const { width: logoWidth, height: logoHeight } = computeLogoSize();

  for (let col = 1; col <= LOGO_COLUMN_COUNT; col++) {
    sheet.getColumn(col).width = LOGO_COLUMN_WIDTH;
  }

  sheet.mergeCells(`A1:${logoEndLetter}1`);
  sheet.mergeCells(`A2:${lastColumnLetter}2`);
  sheet.mergeCells(`A3:${lastColumnLetter}3`);
  sheet.mergeCells(`A4:${lastColumnLetter}4`);
  sheet.mergeCells(`A5:${lastColumnLetter}5`);

  sheet.getRow(1).height = LOGO_ROW_HEIGHT_PT;
  sheet.getRow(2).height = 26;
  sheet.getRow(3).height = 22;
  sheet.getRow(4).height = 18;
  sheet.getRow(5).height = 10;
  sheet.getRow(headerRowNumber).height = 24;

  const logoCell = sheet.getCell("A1");
  logoCell.alignment = { vertical: "middle", horizontal: "center" };
  logoCell.border = GRID_BORDER;

  try {
    const logoBuffer = await loadLogoBuffer();
    const imageId = workbook.addImage({
      buffer: logoBuffer,
      extension: "png",
    });

    sheet.addImage(imageId, {
      tl: { col: computeLogoColumnOffset(logoWidth), row: 0.02 },
      ext: { width: logoWidth, height: logoHeight },
    });
  } catch {
    logoCell.value = "Pumangol";
    logoCell.font = {
      bold: true,
      size: 16,
      color: { argb: BRAND_HEX },
    };
  }

  const titleCell = sheet.getCell("A2");
  titleCell.value = title;
  titleCell.font = { bold: true, size: 16, color: { argb: BRAND_HEX } };
  titleCell.alignment = { vertical: "middle", horizontal: "left" };

  const subtitleCell = sheet.getCell("A3");
  subtitleCell.value = subtitle;
  subtitleCell.font = { size: 12, color: { argb: "FF495057" } };
  subtitleCell.alignment = { vertical: "middle", horizontal: "left" };

  const metaCell = sheet.getCell("A4");
  metaCell.value = `Exportado em ${formatExportTimestamp(new Date())} · ${rows.length} registo${rows.length === 1 ? "" : "s"}`;
  metaCell.font = { size: 10, italic: true, color: { argb: "FF6C757D" } };
  metaCell.alignment = { vertical: "middle", horizontal: "left" };

  const footerCell = sheet.getCell("A5");
  footerCell.value =
    "FILDA 2026 · Documento gerado automaticamente pelo dashboard Pumangol.";
  footerCell.font = { size: 9, color: { argb: "FF6C757D" } };
  footerCell.alignment = { vertical: "middle", horizontal: "left" };

  const headerRow = sheet.getRow(headerRowNumber);
  columns.forEach((column, index) => {
    const cell = headerRow.getCell(index + 1);
    cell.value = column.header;
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: BRAND_HEX },
    };
    cell.alignment = { vertical: "middle", horizontal: "left", wrapText: true };
    cell.border = GRID_BORDER;
    sheet.getColumn(index + 1).width = column.width ?? 18;
  });

  for (let col = 1; col <= LOGO_COLUMN_COUNT; col++) {
    sheet.getColumn(col).width = LOGO_COLUMN_WIDTH;
  }

  rows.forEach((row, rowIndex) => {
    const excelRow = sheet.getRow(dataStartRow + rowIndex);
    columns.forEach((column, columnIndex) => {
      const value = column.accessor(row);
      const cell = excelRow.getCell(columnIndex + 1);
      cell.value = value ?? "";
      cell.alignment = { vertical: "top", horizontal: "left", wrapText: true };
      cell.border = GRID_BORDER;

      if (rowIndex % 2 === 1) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: SURFACE_HEX },
        };
      }
    });
  });

  if (rows.length === 0) {
    const emptyRow = sheet.getRow(dataStartRow);
    sheet.mergeCells(`A${dataStartRow}:${lastColumnLetter}${dataStartRow}`);
    const emptyCell = emptyRow.getCell(1);
    emptyCell.value = "Sem registos para os filtros seleccionados.";
    emptyCell.font = { italic: true, color: { argb: "FF6C757D" } };
    emptyCell.alignment = { horizontal: "center", vertical: "middle" };
  }

  sheet.autoFilter = {
    from: { row: headerRowNumber, column: 1 },
    to: { row: headerRowNumber, column: columns.length },
  };

  const buffer = await workbook.xlsx.writeBuffer();
  triggerDownload(buffer, filename);
}

export async function exportLeadsXlsx(leads: Lead[]): Promise<void> {
  const date = new Date().toISOString().split("T")[0];

  await exportBrandedXlsx({
    filename: `leads-filda-${date}.xlsx`,
    sheetName: "Leads",
    title: "Pumangol · FILDA 2026",
    subtitle: "Relatório de Leads Comerciais",
    columns: [
      { header: "ID", width: 12, accessor: (lead) => lead.id },
      { header: "Empresa", width: 28, accessor: (lead) => lead.company },
      { header: "Contacto", width: 24, accessor: (lead) => lead.contactName },
      { header: "E-mail", width: 28, accessor: (lead) => lead.email },
      { header: "Telefone", width: 18, accessor: (lead) => lead.phone },
      { header: "Tipo", width: 18, accessor: (lead) => lead.type },
      { header: "Produto", width: 18, accessor: (lead) => lead.product },
      { header: "Etapa", width: 18, accessor: (lead) => lead.stage },
      { header: "Nível de Interesse", width: 18, accessor: (lead) => lead.interestLevel },
      { header: "Potencial de Negócio", width: 18, accessor: (lead) => lead.businessPotential },
      { header: "Data de Criação", width: 16, accessor: (lead) => lead.createdAt },
      { header: "Próximo Follow-up", width: 16, accessor: (lead) => lead.nextFollowUp ?? "" },
      { header: "Último Contacto", width: 16, accessor: (lead) => lead.lastContact ?? "" },
      { header: "Notas", width: 36, accessor: (lead) => lead.notes },
    ],
    rows: leads,
  });
}

export async function exportInteressesXlsx(
  registos: RegistoInteresse[]
): Promise<void> {
  const date = new Date().toISOString().split("T")[0];

  await exportBrandedXlsx({
    filename: `interesses-filda-${date}.xlsx`,
    sheetName: "Interesses",
    title: "Pumangol · FILDA 2026",
    subtitle: "Registos de Interesse da Landing Page",
    columns: [
      { header: "ID", width: 10, accessor: (registo) => registo.id },
      { header: "Nome", width: 24, accessor: (registo) => registo.nome },
      { header: "Empresa", width: 28, accessor: (registo) => registo.empresa },
      { header: "Cargo", width: 22, accessor: (registo) => registo.cargo },
      { header: "E-mail", width: 28, accessor: (registo) => registo.email },
      { header: "Telefone", width: 18, accessor: (registo) => registo.telefone },
      { header: "Tipo de Contacto", width: 20, accessor: (registo) => registo.tipoContacto },
      {
        header: "Áreas de Interesse",
        width: 32,
        accessor: (registo) => registo.areas.join(", "),
      },
      {
        header: "Observações",
        width: 36,
        accessor: (registo) => registo.observacoes ?? "",
      },
      { header: "Data de Registo", width: 16, accessor: (registo) => registo.criadoEm },
    ],
    rows: registos,
  });
}
