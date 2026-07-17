"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/primitives/button";
import { Badge } from "@/components/ui/primitives/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/primitives/select";
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Loader2,
  RefreshCw,
  BrushCleaning,
} from "lucide-react";
import type { Lead } from "@/lib/db/schema";
import { formatDate, PROFILE_LABELS, SOLUTION_LABELS } from "@/lib/utils";
import { appPath, useAppBasePath } from "@/lib/navigation";
import { LeadDetailModal } from "@/components/leads/lead-detail-modal";

const CLASSIFICATION_VARIANT: Record<string, "A+" | "A" | "B" | "C" | "D" | "FORNECEDOR"> = {
  "A+": "A+", A: "A", B: "B", C: "C", D: "D", FORNECEDOR: "FORNECEDOR",
};

const SOLUTION_OPTIONS = Object.entries(SOLUTION_LABELS);

const dateInputClassName =
  "h-10 rounded-xl border border-input bg-white px-3 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/20";

export function LeadsList() {
  const basePath = useAppBasePath();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterProfile, setFilterProfile] = useState("all");
  const [filterClass, setFilterClass] = useState("all");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterSubmittedBy, setFilterSubmittedBy] = useState("all");
  const [filterSolution, setFilterSolution] = useState("all");
  const [registrants, setRegistrants] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [exporting, setExporting] = useState(false);

  const limit = 20;

  useEffect(() => {
    fetch("/api/leads/registrants")
      .then((res) => res.json())
      .then((data: { registrants?: string[] }) => {
        setRegistrants(data.registrants ?? []);
      })
      .catch(() => setRegistrants([]));
  }, []);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (search) params.set("search", search);
      if (filterProfile !== "all") params.set("profile", filterProfile);
      if (filterClass !== "all") params.set("classification", filterClass);
      if (filterDateFrom) params.set("dateFrom", filterDateFrom);
      if (filterDateTo) params.set("dateTo", filterDateTo);
      if (filterSubmittedBy !== "all") params.set("submittedBy", filterSubmittedBy);
      if (filterSolution !== "all") params.set("solution", filterSolution);

      const res = await fetch(`/api/leads?${params}`);
      const data = await res.json();
      setLeads(data.leads ?? []);
      setTotal(data.total ?? 0);
    } finally {
      setLoading(false);
    }
  }, [
    page,
    search,
    filterProfile,
    filterClass,
    filterDateFrom,
    filterDateTo,
    filterSubmittedBy,
    filterSolution,
  ]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }

  const hasActiveFilters =
    Boolean(search) ||
    Boolean(searchInput) ||
    filterProfile !== "all" ||
    filterClass !== "all" ||
    Boolean(filterDateFrom) ||
    Boolean(filterDateTo) ||
    filterSubmittedBy !== "all" ||
    filterSolution !== "all";

  function clearFilters() {
    setSearch("");
    setSearchInput("");
    setFilterProfile("all");
    setFilterClass("all");
    setFilterDateFrom("");
    setFilterDateTo("");
    setFilterSubmittedBy("all");
    setFilterSolution("all");
    setPage(1);
  }

  async function handleExport() {
    setExporting(true);
    try {
      const res = await fetch("/api/leads/export");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leads-filda-2026-${Date.now()}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Pesquisar por nome, e-mail, telefone..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-input bg-white text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/20"
              />
            </div>
            <Button type="submit" variant="secondary" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </form>

          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="icon" onClick={fetchLeads} title="Actualizar">
              <RefreshCw className="h-4 w-4" />
            </Button>

            <Button variant="outline" onClick={handleExport} disabled={exporting}>
              {exporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Exportar</span>
            </Button>

            <Link href={appPath(basePath, "/leads/new")}>
              <Button>
                <PlusCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Nova Lead</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select
            value={filterProfile}
            onValueChange={(v) => {
              setFilterProfile(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Perfil" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os perfis</SelectItem>
              <SelectItem value="particular">Particular</SelectItem>
              <SelectItem value="empresa">Empresa</SelectItem>
              <SelectItem value="orgao_publico">Órgão Público</SelectItem>
              <SelectItem value="fornecedor">Fornecedor</SelectItem>
              <SelectItem value="parceiro">Parceiro</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filterClass}
            onValueChange={(v) => {
              setFilterClass(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Classificação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="A+">A+ (Muito Quente)</SelectItem>
              <SelectItem value="A">A (Quente)</SelectItem>
              <SelectItem value="B">B (Morna)</SelectItem>
              <SelectItem value="C">C (Fria)</SelectItem>
              <SelectItem value="D">D</SelectItem>
              <SelectItem value="FORNECEDOR">Fornecedor (KYC)</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filterSolution}
            onValueChange={(v) => {
              setFilterSolution(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Solução" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as soluções</SelectItem>
              {SOLUTION_OPTIONS.map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filterSubmittedBy}
            onValueChange={(v) => {
              setFilterSubmittedBy(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Registado por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os registadores</SelectItem>
              {registrants.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 whitespace-nowrap" htmlFor="leads-date-from">
              De
            </label>
            <input
              id="leads-date-from"
              type="date"
              value={filterDateFrom}
              max={filterDateTo || undefined}
              onChange={(e) => {
                setFilterDateFrom(e.target.value);
                setPage(1);
              }}
              className={dateInputClassName}
            />
            <label className="text-xs text-slate-500 whitespace-nowrap" htmlFor="leads-date-to">
              Até
            </label>
            <input
              id="leads-date-to"
              type="date"
              value={filterDateTo}
              min={filterDateFrom || undefined}
              onChange={(e) => {
                setFilterDateTo(e.target.value);
                setPage(1);
              }}
              className={dateInputClassName}
            />
          </div>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="icon"
              onClick={clearFilters}
              title="Limpar filtros"
              aria-label="Limpar filtros"
            >
              <BrushCleaning className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="text-sm text-slate-500">
        {loading ? "A carregar..." : `${total} lead${total !== 1 ? "s" : ""} encontrada${total !== 1 ? "s" : ""}`}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-brand" />
          </div>
        ) : leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
            <p>Nenhuma lead encontrada</p>
            <Link href={appPath(basePath, "/leads/new")}>
              <Button variant="outline" size="sm">
                <PlusCircle className="h-4 w-4" />
                Registar primeira lead
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 whitespace-nowrap">#</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 whitespace-nowrap">Nome</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 whitespace-nowrap hidden md:table-cell">Perfil</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 whitespace-nowrap hidden lg:table-cell">Soluções</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 whitespace-nowrap">Score</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 whitespace-nowrap">Class.</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 whitespace-nowrap hidden xl:table-cell">Data</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 whitespace-nowrap hidden xl:table-cell">Registado por</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((lead, index) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedLead(lead)}
                    >
                      <td className="px-4 py-3 text-slate-400">{(page - 1) * limit + index + 1}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">{lead.fullName}</div>
                        <div className="text-xs text-slate-400">{lead.email}</div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                          {PROFILE_LABELS[lead.profile] ?? lead.profile}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {((lead.solutions as string[]) ?? []).slice(0, 3).map((s) => (
                            <span key={s} className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-xs">
                              {SOLUTION_LABELS[s] ?? s}
                            </span>
                          ))}
                          {((lead.solutions as string[]) ?? []).length > 3 && (
                            <span className="text-xs text-slate-400">+{((lead.solutions as string[]).length - 3)}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-slate-800">{lead.totalScore}</span>
                        <span className="text-slate-400 text-xs">/115</span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={CLASSIFICATION_VARIANT[lead.classification]}>
                          {lead.classification}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell text-slate-500 text-xs whitespace-nowrap">
                        {formatDate(lead.createdAt)}
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell text-slate-500 text-xs">
                        {lead.submittedByFullName ?? lead.submittedByUsername ?? "Externo"}
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedLead && (
        <LeadDetailModal lead={selectedLead} onClose={() => setSelectedLead(null)} />
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Página {page} de {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
