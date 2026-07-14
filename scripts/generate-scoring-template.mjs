/**
 * Gera modelo Excel para redefinição dos critérios de classificação de leads.
 * Peso em branco — máximo teórico por dimensão: 25 + 30 + 20 + 30 + 10 = 115
 */
import ExcelJS from "exceljs";
import { mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "docs", "Classificacao_Leads_FILDA_2026.xlsx");

const PRIMARY = "FF057143";
const PRIMARY_DARK = "FF045A36";
const MUTED = "FFF1F3F5";
const CAP_BG = "FFE8F5EE";

/** @type {Array<{ criterio: number; dimensao: string; maxDim: number; secao: string; campo: string; opcao: string; perfil: string; notas: string }>} */
const ROWS = [
  // ─── Critério 1 — Perfil (máx. 25) ───
  { criterio: 1, dimensao: "Perfil", maxDim: 25, secao: "Perfil do Visitante", campo: "profile", opcao: "Empresa", perfil: "—", notas: "Seleção única" },
  { criterio: 1, dimensao: "Perfil", maxDim: 25, secao: "Perfil do Visitante", campo: "profile", opcao: "Órgão Público", perfil: "—", notas: "Seleção única" },
  { criterio: 1, dimensao: "Perfil", maxDim: 25, secao: "Perfil do Visitante", campo: "profile", opcao: "Potencial Parceiro de Negócio", perfil: "—", notas: "Seleção única" },
  { criterio: 1, dimensao: "Perfil", maxDim: 25, secao: "Perfil do Visitante", campo: "profile", opcao: "Particular", perfil: "—", notas: "Seleção única" },
  { criterio: 1, dimensao: "Perfil", maxDim: 25, secao: "Perfil do Visitante", campo: "profile", opcao: "Potencial Fornecedor", perfil: "—", notas: "Fora do funil comercial — Portal KYC" },
  { criterio: 1, dimensao: "Perfil", maxDim: 25, secao: "Perfil do Visitante", campo: "profile", opcao: "Outro", perfil: "—", notas: "Seleção única" },

  // ─── Critério 2 — Interesse soluções (máx. 30, acumulativo com teto) ───
  { criterio: 2, dimensao: "Interesse", maxDim: 30, secao: "Soluções de Interesse", campo: "solutions", opcao: "Combustíveis", perfil: "Particular", notas: "Multi-seleção; soma com teto 30" },
  { criterio: 2, dimensao: "Interesse", maxDim: 30, secao: "Soluções de Interesse", campo: "solutions", opcao: "Lubrificantes", perfil: "Particular", notas: "Multi-seleção; soma com teto 30" },
  { criterio: 2, dimensao: "Interesse", maxDim: 30, secao: "Soluções de Interesse", campo: "solutions", opcao: "VIA", perfil: "Particular", notas: "Multi-seleção; soma com teto 30" },
  { criterio: 2, dimensao: "Interesse", maxDim: 30, secao: "Soluções de Interesse", campo: "solutions", opcao: "Cartão Presente", perfil: "Particular", notas: "Multi-seleção; soma com teto 30" },
  { criterio: 2, dimensao: "Interesse", maxDim: 30, secao: "Soluções de Interesse", campo: "solutions", opcao: "Serviço Frota+", perfil: "Particular", notas: "Multi-seleção; soma com teto 30" },
  { criterio: 2, dimensao: "Interesse", maxDim: 30, secao: "Soluções de Interesse", campo: "solutions", opcao: "Patrocínios", perfil: "Particular", notas: "Multi-seleção; soma com teto 30" },
  { criterio: 2, dimensao: "Interesse", maxDim: 30, secao: "Soluções de Interesse", campo: "solutions", opcao: "Outros", perfil: "Particular", notas: "Multi-seleção; soma com teto 30" },

  { criterio: 2, dimensao: "Interesse", maxDim: 30, secao: "Soluções de Interesse", campo: "solutions", opcao: "Combustíveis", perfil: "Empresa / Órgão Público", notas: "Multi-seleção; soma com teto 30" },
  { criterio: 2, dimensao: "Interesse", maxDim: 30, secao: "Soluções de Interesse", campo: "solutions", opcao: "Lubrificantes", perfil: "Empresa / Órgão Público", notas: "Multi-seleção; soma com teto 30" },
  { criterio: 2, dimensao: "Interesse", maxDim: 30, secao: "Soluções de Interesse", campo: "solutions", opcao: "Frota+", perfil: "Empresa / Órgão Público", notas: "Multi-seleção; soma com teto 30" },
  { criterio: 2, dimensao: "Interesse", maxDim: 30, secao: "Soluções de Interesse", campo: "solutions", opcao: "Cartão Presente", perfil: "Empresa / Órgão Público", notas: "Multi-seleção; soma com teto 30" },
  { criterio: 2, dimensao: "Interesse", maxDim: 30, secao: "Soluções de Interesse", campo: "solutions", opcao: "Betumes e Emulções", perfil: "Empresa / Órgão Público", notas: "Multi-seleção; soma com teto 30" },
  { criterio: 2, dimensao: "Interesse", maxDim: 30, secao: "Soluções de Interesse", campo: "solutions", opcao: "Aviação", perfil: "Empresa / Órgão Público", notas: "Multi-seleção; soma com teto 30" },
  { criterio: 2, dimensao: "Interesse", maxDim: 30, secao: "Soluções de Interesse", campo: "solutions", opcao: "Patrocínios", perfil: "Empresa / Órgão Público", notas: "Multi-seleção; soma com teto 30" },
  { criterio: 2, dimensao: "Interesse", maxDim: 30, secao: "Soluções de Interesse", campo: "solutions", opcao: "Outros", perfil: "Empresa / Órgão Público", notas: "Multi-seleção; soma com teto 30" },

  // ─── Critério 3 — Potencial (máx. 20, maior valor aplicável) ───
  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Combustíveis (condicional)", campo: "combustiveis_purpose", opcao: "Empresa", perfil: "Empresa / Órgão Público", notas: "Aparece se Combustíveis seleccionado" },
  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Combustíveis (condicional)", campo: "combustiveis_purpose", opcao: "Revenda", perfil: "Empresa / Órgão Público", notas: "Aparece se Combustíveis seleccionado" },
  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Combustíveis (condicional)", campo: "combustiveis_consumption", opcao: "Até 5.000 litros", perfil: "Empresa / Órgão Público", notas: "Dropdown — consumo mensal" },
  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Combustíveis (condicional)", campo: "combustiveis_consumption", opcao: "5.000 – 20.000 litros", perfil: "Empresa / Órgão Público", notas: "Dropdown — consumo mensal" },
  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Combustíveis (condicional)", campo: "combustiveis_consumption", opcao: "20.000 – 100.000 litros", perfil: "Empresa / Órgão Público", notas: "Dropdown — consumo mensal" },
  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Combustíveis (condicional)", campo: "combustiveis_consumption", opcao: "Superior a 100.000 litros", perfil: "Empresa / Órgão Público", notas: "Dropdown — consumo mensal" },

  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Lubrificantes (condicional)", campo: "lubricant_vehicle_count_empresa", opcao: "1 – 5", perfil: "Empresa / Órgão Público", notas: "Dropdown — nº viaturas/equipamentos" },
  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Lubrificantes (condicional)", campo: "lubricant_vehicle_count_empresa", opcao: "6 – 20", perfil: "Empresa / Órgão Público", notas: "Dropdown — nº viaturas/equipamentos" },
  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Lubrificantes (condicional)", campo: "lubricant_vehicle_count_empresa", opcao: "21 – 50", perfil: "Empresa / Órgão Público", notas: "Dropdown — nº viaturas/equipamentos" },
  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Lubrificantes (condicional)", campo: "lubricant_vehicle_count_empresa", opcao: "Mais de 50", perfil: "Empresa / Órgão Público", notas: "Dropdown — nº viaturas/equipamentos" },

  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Lubrificantes (condicional)", campo: "lubricant_vehicle_type_particular", opcao: "Viatura ligeira", perfil: "Particular", notas: "Aparece se Lubrificantes seleccionado" },
  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Lubrificantes (condicional)", campo: "lubricant_vehicle_type_particular", opcao: "Viatura pesada", perfil: "Particular", notas: "Aparece se Lubrificantes seleccionado" },
  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Lubrificantes (condicional)", campo: "lubricant_vehicle_type_particular", opcao: "Motociclo", perfil: "Particular", notas: "Aparece se Lubrificantes seleccionado" },
  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Lubrificantes (condicional)", campo: "lubricant_vehicle_type_particular", opcao: "Equipamento", perfil: "Particular", notas: "Aparece se Lubrificantes seleccionado" },
  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Lubrificantes (condicional)", campo: "lubricant_vehicle_type_particular", opcao: "Outro", perfil: "Particular", notas: "Aparece se Lubrificantes seleccionado" },

  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Frota+ (condicional)", campo: "frota_vehicle_count", opcao: "1–5", perfil: "Empresa / Órgão Público", notas: "Dropdown — quantidade de viaturas" },
  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Frota+ (condicional)", campo: "frota_vehicle_count", opcao: "6–20", perfil: "Empresa / Órgão Público", notas: "Dropdown — quantidade de viaturas" },
  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Frota+ (condicional)", campo: "frota_vehicle_count", opcao: "21–50", perfil: "Empresa / Órgão Público", notas: "Dropdown — quantidade de viaturas" },
  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Frota+ (condicional)", campo: "frota_vehicle_count", opcao: "Mais de 50", perfil: "Empresa / Órgão Público", notas: "Dropdown — quantidade de viaturas" },
  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Frota+ (condicional)", campo: "frota_interest", opcao: "Uso pessoal", perfil: "Empresa / Órgão Público", notas: "Aparece se Frota+ seleccionado" },
  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Frota+ (condicional)", campo: "frota_interest", opcao: "Gestão de frota", perfil: "Empresa / Órgão Público", notas: "Aparece se Frota+ seleccionado" },

  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Betumes e Emulções (condicional)", campo: "angobetumes_interest", opcao: "Projeto próprio", perfil: "Empresa / Órgão Público", notas: "Aparece se Betumes seleccionado" },
  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Betumes e Emulções (condicional)", campo: "angobetumes_interest", opcao: "Construção", perfil: "Empresa / Órgão Público", notas: "Aparece se Betumes seleccionado" },
  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Betumes e Emulções (condicional)", campo: "angobetumes_interest", opcao: "Revenda", perfil: "Empresa / Órgão Público", notas: "Aparece se Betumes seleccionado" },
  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Betumes e Emulções (condicional)", campo: "angobetumes_interest", opcao: "Parceria", perfil: "Empresa / Órgão Público", notas: "Aparece se Betumes seleccionado" },
  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Betumes e Emulções (condicional)", campo: "angobetumes_activity", opcao: "Construção Civil", perfil: "Empresa / Órgão Público", notas: "Dropdown — área de actividade" },
  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Betumes e Emulções (condicional)", campo: "angobetumes_activity", opcao: "Obras Públicas", perfil: "Empresa / Órgão Público", notas: "Dropdown — área de actividade" },
  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Betumes e Emulções (condicional)", campo: "angobetumes_activity", opcao: "Infra-estruturas Rodoviárias", perfil: "Empresa / Órgão Público", notas: "Dropdown — área de actividade" },
  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Betumes e Emulções (condicional)", campo: "angobetumes_activity", opcao: "Indústria", perfil: "Empresa / Órgão Público", notas: "Dropdown — área de actividade" },
  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Betumes e Emulções (condicional)", campo: "angobetumes_activity", opcao: "Distribuidor de Materiais", perfil: "Empresa / Órgão Público", notas: "Dropdown — área de actividade" },
  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Betumes e Emulções (condicional)", campo: "angobetumes_activity", opcao: "Outro", perfil: "Empresa / Órgão Público", notas: "Dropdown — área de actividade" },

  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Aviação (condicional)", campo: "aviacao_operation_type", opcao: "Companhia aérea", perfil: "Empresa / Órgão Público", notas: "Aparece se Aviação seleccionado" },
  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Aviação (condicional)", campo: "aviacao_operation_type", opcao: "Operador privado", perfil: "Empresa / Órgão Público", notas: "Aparece se Aviação seleccionado" },
  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Aviação (condicional)", campo: "aviacao_operation_type", opcao: "Governo", perfil: "Empresa / Órgão Público", notas: "Aparece se Aviação seleccionado" },
  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Aviação (condicional)", campo: "aviacao_operation_type", opcao: "Aeroporto", perfil: "Empresa / Órgão Público", notas: "Aparece se Aviação seleccionado" },
  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Aviação (condicional)", campo: "aviacao_operation_type", opcao: "Outro", perfil: "Empresa / Órgão Público", notas: "Aparece se Aviação seleccionado" },

  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Cartão Presente (condicional)", campo: "card_purpose_particular", opcao: "Uso pessoal", perfil: "Particular", notas: "Aparece se Cartão Presente seleccionado" },
  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Cartão Presente (condicional)", campo: "card_purpose_particular", opcao: "Oferta", perfil: "Particular", notas: "Aparece se Cartão Presente seleccionado" },
  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Cartão Presente (condicional)", campo: "card_purpose_empresa", opcao: "Colaboradores", perfil: "Empresa / Órgão Público", notas: "Aparece se Cartão Presente seleccionado" },
  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Cartão Presente (condicional)", campo: "card_purpose_empresa", opcao: "Clientes", perfil: "Empresa / Órgão Público", notas: "Aparece se Cartão Presente seleccionado" },
  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Cartão Presente (condicional)", campo: "card_purpose_empresa", opcao: "Campanhas promocionais", perfil: "Empresa / Órgão Público", notas: "Aparece se Cartão Presente seleccionado" },
  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Cartão Presente (condicional)", campo: "card_purpose_empresa", opcao: "Outro", perfil: "Empresa / Órgão Público", notas: "Aparece se Cartão Presente seleccionado" },

  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "VIA (condicional)", campo: "uses_via_app", opcao: "Sim — já utiliza a App VIA", perfil: "Particular", notas: "Aparece se VIA seleccionado" },
  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "VIA (condicional)", campo: "uses_via_app", opcao: "Não — ainda não utiliza", perfil: "Particular", notas: "Aparece se VIA seleccionado" },

  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Relação comercial existente", campo: "is_existing_client", opcao: "Sim — já é cliente", perfil: "Particular / Empresa", notas: "Opcional — pode pontuar se aplicável" },
  { criterio: 3, dimensao: "Potencial", maxDim: 20, secao: "Relação comercial existente", campo: "is_existing_client", opcao: "Não — ainda não é cliente", perfil: "Particular / Empresa", notas: "Opcional — pode pontuar se aplicável" },

  // ─── Critério 4 — Horizonte (máx. 30) ───
  { criterio: 4, dimensao: "Horizonte", maxDim: 30, secao: "Qualificação Comercial", campo: "purchase_timeline", opcao: "Imediatamente", perfil: "Todos (excepto Fornecedor)", notas: "Seleção única" },
  { criterio: 4, dimensao: "Horizonte", maxDim: 30, secao: "Qualificação Comercial", campo: "purchase_timeline", opcao: "Nos próximos 3 meses", perfil: "Todos (excepto Fornecedor)", notas: "Seleção única" },
  { criterio: 4, dimensao: "Horizonte", maxDim: 30, secao: "Qualificação Comercial", campo: "purchase_timeline", opcao: "Entre 3 e 6 meses", perfil: "Todos (excepto Fornecedor)", notas: "Seleção única" },
  { criterio: 4, dimensao: "Horizonte", maxDim: 30, secao: "Qualificação Comercial", campo: "purchase_timeline", opcao: "Entre 6 e 12 meses", perfil: "Todos (excepto Fornecedor)", notas: "Seleção única" },
  { criterio: 4, dimensao: "Horizonte", maxDim: 30, secao: "Qualificação Comercial", campo: "purchase_timeline", opcao: "Apenas estou a recolher informação", perfil: "Todos (excepto Fornecedor)", notas: "Seleção única" },

  // ─── Critério 5 — Contacto (máx. 10) ───
  { criterio: 5, dimensao: "Contacto", maxDim: 10, secao: "Qualificação Comercial", campo: "wants_contact", opcao: "Sim — pretende ser contactado", perfil: "Todos (excepto Fornecedor)", notas: "Seleção única" },
  { criterio: 5, dimensao: "Contacto", maxDim: 10, secao: "Qualificação Comercial", campo: "wants_contact", opcao: "Não — não pretende contacto", perfil: "Todos (excepto Fornecedor)", notas: "Seleção única" },
  { criterio: 5, dimensao: "Contacto", maxDim: 10, secao: "Qualificação Comercial", campo: "contact_preference", opcao: "Telefone", perfil: "Se wants_contact = Sim", notas: "Multi-seleção — opcional" },
  { criterio: 5, dimensao: "Contacto", maxDim: 10, secao: "Qualificação Comercial", campo: "contact_preference", opcao: "WhatsApp", perfil: "Se wants_contact = Sim", notas: "Multi-seleção — opcional" },
  { criterio: 5, dimensao: "Contacto", maxDim: 10, secao: "Qualificação Comercial", campo: "contact_preference", opcao: "E-mail", perfil: "Se wants_contact = Sim", notas: "Multi-seleção — opcional" },
];

function styleHeaderRow(row) {
  row.height = 22;
  row.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: PRIMARY } };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    cell.border = { bottom: { style: "thin", color: { argb: PRIMARY_DARK } } };
  });
}

function styleDataRow(row, dimensao) {
  row.eachCell((cell, col) => {
    cell.alignment = { vertical: "top", wrapText: true };
    if (col === 8) {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFDE7" } };
      cell.numFmt = "0";
    }
    if (col === 3) {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: CAP_BG } };
      cell.alignment = { horizontal: "center", vertical: "middle" };
    }
  });
}

const workbook = new ExcelJS.Workbook();
workbook.creator = "Pumangol FILDA 2026";
workbook.created = new Date();

// ── Folha 1: Instruções ──
const wsInfo = workbook.addWorksheet("Instruções", {
  properties: { defaultColWidth: 18 },
});
wsInfo.mergeCells("A1:F1");
wsInfo.getCell("A1").value = "Modelo de Classificação de Leads — FILDA 2026";
wsInfo.getCell("A1").font = { bold: true, size: 16, color: { argb: PRIMARY } };

const instructions = [
  "",
  "Como utilizar este ficheiro",
  "1. Preencha a coluna «Peso» na folha «Critérios de Pontuação» (valores numéricos inteiros).",
  "2. O somatório dos MÁXIMOS por dimensão deve ser 115 pontos (25 + 30 + 20 + 30 + 10).",
  "3. Critério 1 (Perfil): seleção única — o peso máximo de uma opção deve igualar 25.",
  "4. Critério 2 (Interesse): multi-seleção — soma acumulativa com TETO de 30 pontos.",
  "5. Critério 3 (Potencial): campos condicionais — usar o MAIOR peso aplicável, com TETO de 20.",
  "6. Critério 4 (Horizonte): seleção única — o peso máximo deve igualar 30.",
  "7. Critério 5 (Contacto): seleção única — o peso máximo deve igualar 10.",
  "8. Potencial Fornecedor: fora do funil comercial (Portal KYC).",
  "",
  "Dimensões e tetos",
];
instructions.forEach((line, i) => {
  wsInfo.getCell(`A${i + 2}`).value = line;
  if (i === 1 || i === 12) wsInfo.getCell(`A${i + 2}`).font = { bold: true, size: 12 };
});

const dimTableStart = instructions.length + 3;
wsInfo.getRow(dimTableStart).values = ["Dimensão", "Critério", "Máximo", "Regra de agregação"];
styleHeaderRow(wsInfo.getRow(dimTableStart));
[
  ["Perfil", 1, 25, "Valor da opção seleccionada (única)"],
  ["Interesse", 2, 30, "Soma das soluções seleccionadas, limitada a 30"],
  ["Potencial", 3, 20, "Máximo entre campos condicionais preenchidos, limitado a 20"],
  ["Horizonte", 4, 30, "Valor do horizonte seleccionado (único)"],
  ["Contacto", 5, 10, "Valor da intenção de contacto (única)"],
  ["TOTAL", "", 115, "Soma dos máximos das 5 dimensões"],
].forEach((r, i) => {
  const row = wsInfo.getRow(dimTableStart + 1 + i);
  row.values = r;
  if (i === 5) row.font = { bold: true };
});

wsInfo.getColumn(1).width = 42;
wsInfo.getColumn(4).width = 52;

// ── Folha 2: Classificação final ──
const wsClass = workbook.addWorksheet("Classificação Final", {
  views: [{ state: "frozen", ySplit: 1 }],
});
wsClass.columns = [
  { header: "Classificação", key: "class", width: 18 },
  { header: "Intervalo mínimo", key: "min", width: 16 },
  { header: "Intervalo máximo", key: "max", width: 16 },
  { header: "Características", key: "chars", width: 40 },
  { header: "Acção comercial", key: "action", width: 48 },
];
styleHeaderRow(wsClass.getRow(1));
[
  { class: "A+ (Muito Quente)", min: 90, max: 115, chars: "Empresa; soluções estratégicas; elevado potencial; compra iminente", action: "Contacto em 24h — agendar reunião — Gestor Comercial" },
  { class: "A (Quente)", min: 70, max: 89, chars: "Forte potencial; compra prevista até 3 meses", action: "Contacto até 72 horas" },
  { class: "B (Morna)", min: 40, max: 69, chars: "Interesse evidente; horizonte médio", action: "Campanhas de nutrição; follow-up nas semanas seguintes" },
  { class: "C (Fria)", min: 20, max: 39, chars: "Interesse exploratório; sem decisão imediata", action: "Marketing; newsletter; convites para eventos" },
  { class: "D", min: 0, max: 19, chars: "Visitante; sem intenção comercial", action: "Registo estatístico; sem prioridade comercial" },
  { class: "FORNECEDOR", min: "—", max: "—", chars: "Potencial fornecedor", action: "Encaminhar para Portal KYC" },
].forEach((r) => wsClass.addRow(r));

// ── Folha 3: Critérios de Pontuação (principal) ──
const ws = workbook.addWorksheet("Critérios de Pontuação", {
  views: [{ state: "frozen", ySplit: 1 }],
});

ws.columns = [
  { header: "Critério", key: "criterio", width: 10 },
  { header: "Dimensão", key: "dimensao", width: 14 },
  { header: "Máx. Dimensão", key: "maxDim", width: 14 },
  { header: "Secção do Formulário", key: "secao", width: 28 },
  { header: "Campo (BD)", key: "campo", width: 32 },
  { header: "Opção / Valor", key: "opcao", width: 36 },
  { header: "Perfil aplicável", key: "perfil", width: 24 },
  { header: "Peso", key: "peso", width: 10 },
  { header: "Notas / Regra", key: "notas", width: 38 },
];

styleHeaderRow(ws.getRow(1));

const firstDataRow = 2;
ROWS.forEach((r, i) => {
  const row = ws.addRow({
    criterio: r.criterio,
    dimensao: r.dimensao,
    maxDim: r.maxDim,
    secao: r.secao,
    campo: r.campo,
    opcao: r.opcao,
    perfil: r.perfil,
    peso: null,
    notas: r.notas,
  });
  styleDataRow(row, r.dimensao);

  // Separador visual entre critérios
  if (i > 0 && ROWS[i - 1].criterio !== r.criterio) {
    row.eachCell((cell) => {
      cell.border = { top: { style: "medium", color: { argb: PRIMARY_DARK } } };
    });
  }
});

const lastDataRow = firstDataRow + ROWS.length - 1;
const summaryStart = lastDataRow + 3;

ws.mergeCells(`A${summaryStart}:I${summaryStart}`);
ws.getCell(`A${summaryStart}`).value = "Validação dos tetos por dimensão (preencher pesos acima)";
ws.getCell(`A${summaryStart}`).font = { bold: true, size: 12 };

const summaryHeaderRow = summaryStart + 1;
ws.getRow(summaryHeaderRow).values = [
  "Dimensão", "Máx. permitido", "Maior peso definido", "Soma pesos (ref.)", "Estado", "", "", "", "",
];
styleHeaderRow(ws.getRow(summaryHeaderRow));

const dims = [
  { name: "Perfil", max: 25, c: 1, rule: "Maior peso = 25" },
  { name: "Interesse", max: 30, c: 2, rule: "Teto acumulativo = 30" },
  { name: "Potencial", max: 20, c: 3, rule: "Maior peso aplicável ≤ 20" },
  { name: "Horizonte", max: 30, c: 4, rule: "Maior peso = 30" },
  { name: "Contacto", max: 10, c: 5, rule: "Maior peso = 10" },
];

dims.forEach((d, i) => {
  const r = summaryHeaderRow + 1 + i;
  const critNum = i + 1;
  ws.getCell(`A${r}`).value = d.name;
  ws.getCell(`B${r}`).value = d.max;
  ws.getCell(`C${r}`).value = {
    formula: `MAXIFS(H$${firstDataRow}:H$${lastDataRow},A$${firstDataRow}:A$${lastDataRow},${critNum})`,
  };
  ws.getCell(`D${r}`).value = {
    formula: `SUMIF(A$${firstDataRow}:A$${lastDataRow},${critNum},H$${firstDataRow}:H$${lastDataRow})`,
  };
  ws.getCell(`E${r}`).value = {
    formula: `IF(C${r}="","Preencher pesos",IF(B${r}>=C${r},"OK","Verificar"))`,
  };
  ws.getCell(`F${r}`).value = d.rule;
});

const totalRow = summaryHeaderRow + 6;
ws.getCell(`A${totalRow}`).value = "TOTAL MÁXIMO";
ws.getCell(`A${totalRow}`).font = { bold: true };
ws.getCell(`B${totalRow}`).value = 115;
ws.getCell(`B${totalRow}`).font = { bold: true };
ws.getCell(`C${totalRow}`).value = {
  formula: `SUM(B${summaryHeaderRow + 1}:B${summaryHeaderRow + 5})`,
};
ws.getCell(`E${totalRow}`).value = "Soma dos máximos por dimensão = 115";
ws.getCell(`E${totalRow}`).font = { bold: true, italic: true };

ws.autoFilter = {
  from: { row: 1, column: 1 },
  to: { row: lastDataRow, column: 9 },
};

mkdirSync(dirname(OUT), { recursive: true });
await workbook.xlsx.writeFile(OUT);
console.log(`Gerado: ${OUT}`);
console.log(`Linhas de critérios: ${ROWS.length}`);
