"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FilterSelect } from "@/components/ui/FilterSelect";
import { exportInteressesXlsx } from "@/lib/export/xlsx-export";
import type { RegistoInteresse } from "@/lib/types";

export function InteressesTable({ registos }: { registos: RegistoInteresse[] }) {
  const [search, setSearch] = useState("");
  const [tipoFilter, setTipoFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [selected, setSelected] = useState<RegistoInteresse | null>(null);
  const [exporting, setExporting] = useState(false);

  const tipoOptions = useMemo(() => {
    return [...new Set(registos.map((r) => r.tipoContacto))].sort();
  }, [registos]);

  const areaOptions = useMemo(() => {
    return [...new Set(registos.flatMap((r) => r.areas))].sort();
  }, [registos]);

  const filtered = useMemo(() => {
    return registos.filter((registo) => {
      const query = search.toLowerCase();
      const matchesSearch =
        !search ||
        registo.nome.toLowerCase().includes(query) ||
        registo.empresa.toLowerCase().includes(query) ||
        registo.email.toLowerCase().includes(query) ||
        String(registo.id).includes(query);
      const matchesTipo = !tipoFilter || registo.tipoContacto === tipoFilter;
      const matchesArea = !areaFilter || registo.areas.includes(areaFilter);
      return matchesSearch && matchesTipo && matchesArea;
    });
  }, [registos, search, tipoFilter, areaFilter]);

  async function handleExport() {
    setExporting(true);
    try {
      await exportInteressesXlsx(filtered);
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="search"
              placeholder="Pesquisar registos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border py-2.5 pl-10 pr-4 text-sm focus:border-pumangol-red focus:outline-none focus:ring-2 focus:ring-pumangol-red/20"
            />
          </div>
          <FilterSelect
            value={tipoFilter}
            onValueChange={setTipoFilter}
            allLabel="Todos os tipos"
            options={tipoOptions}
          />
          <FilterSelect
            value={areaFilter}
            onValueChange={setAreaFilter}
            allLabel="Todas as áreas"
            options={areaOptions}
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={exporting}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          {exporting ? "A exportar..." : "Exportar Excel"}
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-border bg-surface">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-700">ID</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Nome</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Empresa</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Tipo</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Áreas</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Registo</th>
                <th className="px-4 py-3 font-semibold text-gray-700"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((registo) => (
                <tr key={registo.id} className="transition-colors hover:bg-surface/50">
                  <td className="px-4 py-3 font-mono text-xs text-muted">
                    #{registo.id}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{registo.nome}</div>
                    <div className="text-xs text-muted">{registo.email}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-900">{registo.empresa}</td>
                  <td className="px-4 py-3">
                    <Badge variant="default">{registo.tipoContacto}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    {registo.areas.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {registo.areas.map((area) => (
                          <Badge key={area} variant="gray">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted">{registo.criadoEm}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setSelected(registo)}
                      className="text-xs font-medium text-pumangol-red hover:underline"
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
            Nenhum registo encontrado com os filtros seleccionados.
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selected.nome}</h3>
                <p className="text-sm text-muted">Registo #{selected.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-lg p-1 hover:bg-gray-100"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted">Empresa</p>
                  <p className="font-medium">{selected.empresa}</p>
                </div>
                <div>
                  <p className="text-muted">Cargo</p>
                  <p className="font-medium">{selected.cargo}</p>
                </div>
                <div>
                  <p className="text-muted">Telefone</p>
                  <p className="font-medium">{selected.telefone}</p>
                </div>
                <div>
                  <p className="text-muted">E-mail</p>
                  <p className="font-medium">{selected.email}</p>
                </div>
                <div>
                  <p className="text-muted">Tipo de contacto</p>
                  <p className="font-medium">{selected.tipoContacto}</p>
                </div>
                <div>
                  <p className="text-muted">Data de registo</p>
                  <p className="font-medium">{selected.criadoEm}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted">Áreas de interesse</p>
                {selected.areas.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selected.areas.map((area) => (
                      <Badge key={area} variant="default">
                        {area}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-muted">Nenhuma área seleccionada.</p>
                )}
              </div>

              {selected.observacoes && (
                <div>
                  <p className="text-sm text-muted">Observações</p>
                  <p className="mt-1 text-sm">{selected.observacoes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
