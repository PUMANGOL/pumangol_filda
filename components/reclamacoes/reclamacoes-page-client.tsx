"use client";

import { useState } from "react";
import { Download, Loader2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/primitives/button";
import { ReclamacoesTable } from "@/components/reclamacoes/reclamacoes-table";
import { AddReclamacaoModal } from "@/components/reclamacoes/add-reclamacao-modal";

export function ReclamacoesPageClient() {
  const [addOpen, setAddOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  async function handleExport() {
    setExporting(true);
    try {
      const res = await fetch("/api/reclamacoes/export");
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reclamacoes-filda-2026-${Date.now()}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reclamações</h1>
          <p className="text-slate-500 text-sm mt-1">
            Registo de reclamações por categoria no FILDA 2026
          </p>
        </div>
        <div className="flex shrink-0 gap-2 self-end sm:self-auto">
          <Button variant="outline" onClick={handleExport} disabled={exporting}>
            {exporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Exportar</span>
          </Button>
          <Button onClick={() => setAddOpen(true)}>
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Adicionar</span>
          </Button>
        </div>
      </div>

      <ReclamacoesTable key={refreshKey} />

      <AddReclamacaoModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={() => setRefreshKey((k) => k + 1)}
      />
    </>
  );
}
