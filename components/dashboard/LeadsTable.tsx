"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FilterSelect } from "@/components/ui/FilterSelect";
import { PIPELINE_STAGES } from "@/lib/constants";
import { exportLeadsXlsx } from "@/lib/export/xlsx-export";
import type { Lead } from "@/lib/types";

function stageVariant(stage: string): "default" | "red" | "yellow" | "green" | "blue" | "gray" {
  const map: Record<string, "default" | "red" | "yellow" | "green" | "blue" | "gray"> = {
    Captada: "gray",
    Contactada: "blue",
    Qualificada: "default",
    "Proposta Enviada": "yellow",
    Negociação: "red",
    Convertida: "green",
  };
  return map[stage] || "default";
}

export function LeadsTable({ leads }: { leads: Lead[] }) {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [exporting, setExporting] = useState(false);

  const typeOptions = useMemo(() => {
    return [...new Set(leads.map((lead) => lead.type))].sort();
  }, [leads]);

  const filtered = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        !search ||
        lead.company.toLowerCase().includes(search.toLowerCase()) ||
        lead.contactName.toLowerCase().includes(search.toLowerCase()) ||
        lead.email.toLowerCase().includes(search.toLowerCase()) ||
        lead.id.toLowerCase().includes(search.toLowerCase());
      const matchesStage = !stageFilter || lead.stage === stageFilter;
      const matchesType = !typeFilter || lead.type === typeFilter;
      return matchesSearch && matchesStage && matchesType;
    });
  }, [leads, search, stageFilter, typeFilter]);

  const upcomingFollowUps = leads.filter(
    (l) => l.nextFollowUp && l.stage !== "Convertida"
  ).length;

  async function handleExport() {
    setExporting(true);
    try {
      await exportLeadsXlsx(filtered);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              placeholder="Pesquisar leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border py-2.5 pl-10 pr-4 text-sm focus:border-pumangol-red focus:outline-none focus:ring-2 focus:ring-pumangol-red/20"
            />
          </div>
          <FilterSelect
            value={stageFilter}
            onValueChange={setStageFilter}
            allLabel="Todas as etapas"
            options={PIPELINE_STAGES}
          />
          <FilterSelect
            value={typeFilter}
            onValueChange={setTypeFilter}
            allLabel="Todos os tipos"
            options={typeOptions}
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={exporting}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {exporting ? "A exportar..." : "Exportar Excel"}
        </Button>
      </div>

      {upcomingFollowUps > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-pumangol-yellow/30 bg-pumangol-yellow/10 px-4 py-3">
          <svg className="h-5 w-5 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <p className="text-sm font-medium text-yellow-800">
            {upcomingFollowUps} follow-ups pendentes para os próximos dias
          </p>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-border bg-surface">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-700">ID</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Empresa</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Contacto</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Produto</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Etapa</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Interesse</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Follow-up</th>
                <th className="px-4 py-3 font-semibold text-gray-700"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((lead) => (
                <tr key={lead.id} className="hover:bg-surface/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-muted">{lead.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{lead.company}</td>
                  <td className="px-4 py-3">
                    <div>{lead.contactName}</div>
                    <div className="text-xs text-muted">{lead.email}</div>
                  </td>
                  <td className="px-4 py-3 text-muted">{lead.product}</td>
                  <td className="px-4 py-3">
                    <Badge variant={stageVariant(lead.stage)}>{lead.stage}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted">{lead.interestLevel}</td>
                  <td className="px-4 py-3">
                    {lead.nextFollowUp ? (
                      <span className="text-xs font-medium text-pumangol-red">
                        {lead.nextFollowUp}
                      </span>
                    ) : (
                      <span className="text-xs text-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setSelectedLead(lead)}
                      className="text-pumangol-red hover:underline text-xs font-medium"
                    >
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted">
            Nenhuma lead encontrada com os filtros seleccionados.
          </div>
        )}
      </div>

      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selectedLead.company}</h3>
                <p className="text-sm text-muted">{selectedLead.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="rounded-lg p-1 hover:bg-gray-100"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted">Contacto</p>
                  <p className="font-medium">{selectedLead.contactName}</p>
                </div>
                <div>
                  <p className="text-muted">Telefone</p>
                  <p className="font-medium">{selectedLead.phone}</p>
                </div>
                <div>
                  <p className="text-muted">Responsável</p>
                  <p className="font-medium">{selectedLead.assignedTo}</p>
                </div>
                <div>
                  <p className="text-muted">Potencial</p>
                  <p className="font-medium">{selectedLead.businessPotential}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted">Histórico de Contactos</p>
                <div className="mt-2 space-y-2">
                  {selectedLead.lastContact && (
                    <div className="rounded-lg bg-surface px-3 py-2 text-sm">
                      <span className="font-medium">{selectedLead.lastContact}</span>
                      <span className="text-muted"> — Último contacto registado</span>
                    </div>
                  )}
                  <div className="rounded-lg bg-surface px-3 py-2 text-sm">
                    <span className="font-medium">{selectedLead.createdAt}</span>
                    <span className="text-muted"> — Lead captada na FILDA</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted">Notas</p>
                <p className="mt-1 text-sm">{selectedLead.notes}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
