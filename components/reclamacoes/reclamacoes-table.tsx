"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
} from "lucide-react";
import type { Reclamacao } from "@/lib/db/schema";
import { formatDate } from "@/lib/utils";
import { htmlToPlainText } from "@/lib/html";
import { RECLAMACAO_CATEGORIES } from "@/lib/reclamacoes/constants";
import { Button } from "@/components/ui/primitives/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/primitives/select";
import { ReclamacaoDetailModal } from "@/components/reclamacoes/reclamacao-detail-modal";

export function ReclamacoesTable() {
  const [rows, setRows] = useState<Reclamacao[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selected, setSelected] = useState<Reclamacao | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([
    ...RECLAMACAO_CATEGORIES,
  ]);

  const limit = 20;

  useEffect(() => {
    let cancelled = false;
    fetch("/api/reclamacoes/categories")
      .then((res) => res.json())
      .then((data: { categories?: string[] }) => {
        if (!cancelled && data.categories?.length) {
          setCategoryOptions(data.categories);
        }
      })
      .catch(() => {
        /* keep defaults */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (search) params.set("search", search);
      if (filterCategory !== "all") params.set("category", filterCategory);

      const res = await fetch(`/api/reclamacoes?${params}`);
      const data = await res.json();
      setRows(data.reclamacoes ?? []);
      setTotal(data.total ?? 0);
    } finally {
      setLoading(false);
    }
  }, [page, search, filterCategory]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Pesquisar por nome, telefone, e-mail..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-xl border border-input bg-white text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/20"
            />
          </div>
          <Button type="submit" variant="secondary" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>

        <div className="flex gap-2">
          <Select
            value={filterCategory}
            onValueChange={(v) => {
              setFilterCategory(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categoryOptions.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={fetchRows} title="Actualizar">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="text-sm text-slate-500">
        {loading
          ? "A carregar..."
          : `${total} reclamação${total !== 1 ? "s" : ""} encontrada${total !== 1 ? "s" : ""}`}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-brand" />
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-2">
            <p>Nenhuma reclamação encontrada</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 whitespace-nowrap">
                    #
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 whitespace-nowrap">
                    Nome
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 whitespace-nowrap hidden md:table-cell">
                    Telefone / E-mail
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 whitespace-nowrap">
                    Categoria
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 whitespace-nowrap hidden sm:table-cell">
                    Posto
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 whitespace-nowrap">
                    Descrição
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 whitespace-nowrap hidden lg:table-cell">
                    Data
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 whitespace-nowrap hidden xl:table-cell">
                    Registado por
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((row, index) => {
                  const preview = htmlToPlainText(row.description);
                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => setSelected(row)}
                    >
                      <td className="px-4 py-3 text-slate-400">
                        {(page - 1) * limit + index + 1}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">{row.nome}</div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="text-slate-700 text-xs">{row.telefone}</div>
                        <div className="text-slate-400 text-xs">{row.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                          {row.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell text-slate-700 text-xs max-w-[12rem] truncate">
                        {row.postoNome}
                      </td>
                      <td className="px-4 py-3 max-w-md">
                        <p className="text-slate-800 line-clamp-2">{preview}</p>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-slate-500 text-xs whitespace-nowrap">
                        {formatDate(row.createdAt)}
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell text-slate-500 text-xs">
                        {row.submittedByFullName ?? row.submittedByUsername}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <ReclamacaoDetailModal
          reclamacao={selected}
          onClose={() => setSelected(null)}
        />
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
