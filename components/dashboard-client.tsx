"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/primitives/card";
import { Badge } from "@/components/ui/primitives/badge";
import { Button } from "@/components/ui/primitives/button";
import {
  Users,
  TrendingUp,
  Flame,
  Clock,
  RefreshCw,
  PlusCircle,
  Loader2,
  Activity,
} from "lucide-react";
import { formatDate, PROFILE_LABELS, SOLUTION_LABELS, TIMELINE_LABELS } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface DashboardData {
  total: number;
  today: number;
  byClassification: { classification: string; count: number }[];
  byProfile: { profile: string; count: number }[];
  bySolution: { solution: string; count: number }[];
  byTimeline: { purchaseTimeline: string; count: number }[];
  recentLeads: {
    id: number;
    fullName: string;
    email: string;
    profile: string;
    solutions: string[];
    totalScore: number;
    classification: string;
    submittedByFullName: string | null;
    createdAt: string;
  }[];
  generatedAt: string;
}

const CLASS_CONFIG = {
  "A+": { label: "A+ Muito Quente", color: "bg-red-600", textColor: "text-red-600", bg: "bg-red-50" },
  A: { label: "A Quente", color: "bg-orange-500", textColor: "text-orange-600", bg: "bg-orange-50" },
  B: { label: "B Morna", color: "bg-yellow-400", textColor: "text-yellow-600", bg: "bg-yellow-50" },
  C: { label: "C Fria", color: "bg-blue-400", textColor: "text-blue-600", bg: "bg-blue-50" },
  D: { label: "D", color: "bg-slate-400", textColor: "text-slate-500", bg: "bg-slate-50" },
  FORNECEDOR: { label: "Fornecedor", color: "bg-purple-600", textColor: "text-purple-600", bg: "bg-purple-50" },
};

const CLASSIFICATION_VARIANT: Record<string, "A+" | "A" | "B" | "C" | "D" | "FORNECEDOR"> = {
  "A+": "A+", A: "A", B: "B", C: "C", D: "D", FORNECEDOR: "FORNECEDOR",
};

function StatCard({ label, value, sub, icon: Icon, accent }: {
  label: string; value: number | string; sub?: string;
  icon: React.ElementType; accent?: string;
}) {
  return (
    <Card>
      <CardContent className="pt-5 pb-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">{label}</p>
            <p className={cn("text-3xl font-bold mt-1", accent ?? "text-slate-900")}>{value}</p>
            {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
          </div>
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", accent ? "bg-primary/10" : "bg-muted")}>
            <Icon className={cn("h-5 w-5", accent ?? "text-muted-foreground")} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ClassificationBar({ classification, count, total }: { classification: string; count: number; total: number }) {
  const cfg = CLASS_CONFIG[classification as keyof typeof CLASS_CONFIG] ?? CLASS_CONFIG.D;
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div className="flex items-center gap-3">
      <span className={cn("text-xs font-bold w-6 shrink-0", cfg.textColor)}>{classification}</span>
      <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700 flex items-center px-2", cfg.color)}
          style={{ width: `${Math.max(pct, pct > 0 ? 8 : 0)}%` }}
        >
          {pct > 10 && <span className="text-white text-xs font-bold">{count}</span>}
        </div>
      </div>
      <span className="text-xs text-slate-500 w-8 text-right shrink-0">{pct}%</span>
    </div>
  );
}

export function DashboardClient() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await fetch("/api/dashboard");
      if (!res.ok) {
        setData(null);
        return;
      }
      const d = await res.json();
      setData(d);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center gap-3 flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">A carregar dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const totalByClass = data.byClassification.reduce((s, c) => s + c.count, 0);
  const hotLeads = data.byClassification
    .filter((c) => c.classification === "A+" || c.classification === "A")
    .reduce((s, c) => s + c.count, 0);

  const avgScore =
    data.recentLeads.length > 0
      ? Math.round(data.recentLeads.reduce((s, l) => s + l.totalScore, 0) / data.recentLeads.length)
      : 0;

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            Actualizado{" "}
            {lastUpdated
              ? lastUpdated.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
              : "—"}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchData(true)}
            disabled={refreshing}
          >
            {refreshing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
            Actualizar
          </Button>
          <Link href="/leads/new">
            <Button size="sm">
              <PlusCircle className="h-3.5 w-3.5" />
              Nova Lead
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total de Leads"
          value={data.total}
          sub="desde o início do evento"
          icon={Users}
          accent="text-primary"
        />
        <StatCard
          label="Hoje"
          value={data.today}
          sub="leads registadas hoje"
          icon={Activity}
          accent="text-primary"
        />
        <StatCard
          label="Leads Quentes"
          value={hotLeads}
          sub="classificação A+ e A"
          icon={Flame}
          accent="text-orange-600"
        />
        <StatCard
          label="Score Médio (recentes)"
          value={avgScore}
          sub="pontuação média"
          icon={TrendingUp}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Classification breakdown */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Classificação de Leads</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(["A+", "A", "B", "C", "D"] as const).map((cls) => {
              const found = data.byClassification.find((c) => c.classification === cls);
              return (
                <ClassificationBar
                  key={cls}
                  classification={cls}
                  count={found?.count ?? 0}
                  total={totalByClass}
                />
              );
            })}
            <div className="pt-2 border-t border-slate-100 text-xs text-slate-400 flex justify-between">
              <span>Total</span>
              <span className="font-semibold text-slate-600">{totalByClass}</span>
            </div>
          </CardContent>
        </Card>

        {/* Profile breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Perfil dos Visitantes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.byProfile
              .sort((a, b) => b.count - a.count)
              .map(({ profile, count }) => {
                const pct = data.total > 0 ? Math.round((count / data.total) * 100) : 0;
                return (
                  <div key={profile} className="flex items-center justify-between gap-2">
                    <span className="text-sm text-slate-700 truncate flex-1">
                      {PROFILE_LABELS[profile] ?? profile}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 w-6 text-right">{count}</span>
                    </div>
                  </div>
                );
              })}
          </CardContent>
        </Card>

        {/* Timeline breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Horizonte de Compra</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.byTimeline
              .sort((a, b) => b.count - a.count)
              .map(({ purchaseTimeline, count }) => {
                const pct = data.total > 0 ? Math.round((count / data.total) * 100) : 0;
                return (
                  <div key={purchaseTimeline} className="flex items-center gap-2">
                    <span className="text-xs text-slate-600 flex-1 leading-tight">
                      {TIMELINE_LABELS[purchaseTimeline] ?? purchaseTimeline}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-pumangol-yellow rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 w-5 text-right">{count}</span>
                    </div>
                  </div>
                );
              })}
          </CardContent>
        </Card>
      </div>

      {/* Solutions popularity */}
      {data.bySolution.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Soluções Mais Procuradas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.bySolution.slice(0, 8).map(({ solution, count }) => (
                <div key={solution} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-sm font-medium text-slate-700">
                    {SOLUTION_LABELS[solution] ?? solution}
                  </span>
                  <span className="text-sm font-bold text-primary">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent leads */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Leads Recentes</CardTitle>
          <Link href="/leads">
            <Button variant="ghost" size="sm" className="text-primary hover:text-pumangol-red-dark">
              Ver todas
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {data.recentLeads.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">
              Nenhuma lead registada ainda
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-6 py-3 font-semibold text-slate-500">Nome</th>
                    <th className="text-left px-6 py-3 font-semibold text-slate-500 hidden sm:table-cell">Perfil</th>
                    <th className="text-left px-6 py-3 font-semibold text-slate-500 hidden md:table-cell">Soluções</th>
                    <th className="text-left px-6 py-3 font-semibold text-slate-500">Score</th>
                    <th className="text-left px-6 py-3 font-semibold text-slate-500">Class.</th>
                    <th className="text-left px-6 py-3 font-semibold text-slate-500 hidden lg:table-cell">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data.recentLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3">
                        <p className="font-medium text-slate-800">{lead.fullName}</p>
                        <p className="text-xs text-slate-400">{lead.email}</p>
                      </td>
                      <td className="px-6 py-3 hidden sm:table-cell">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs">
                          {PROFILE_LABELS[lead.profile] ?? lead.profile}
                        </span>
                      </td>
                      <td className="px-6 py-3 hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {(lead.solutions ?? []).slice(0, 2).map((s) => (
                            <span key={s} className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-xs font-medium">
                              {SOLUTION_LABELS[s] ?? s}
                            </span>
                          ))}
                          {(lead.solutions ?? []).length > 2 && (
                            <span className="text-xs text-slate-400">+{lead.solutions.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3 font-bold text-slate-800">{lead.totalScore}</td>
                      <td className="px-6 py-3">
                        <Badge variant={CLASSIFICATION_VARIANT[lead.classification]}>
                          {lead.classification}
                        </Badge>
                      </td>
                      <td className="px-6 py-3 hidden lg:table-cell text-xs text-slate-400 whitespace-nowrap">
                        {formatDate(lead.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Guia de Acção por Classificação
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {(["A+", "A", "B", "C", "D"] as const).map((cls) => {
            const cfg = CLASS_CONFIG[cls];
            const actions: Record<string, string> = {
              "A+": "Contacto em 24h — Gestor Comercial",
              A: "Contacto até 72h",
              B: "Nutrição — Follow-up nas próximas semanas",
              C: "Marketing — Newsletter — Eventos",
              D: "Registo estatístico",
            };
            return (
              <div key={cls} className={cn("rounded-lg p-3", cfg.bg)}>
                <span className={cn("text-xs font-bold", cfg.textColor)}>{cfg.label}</span>
                <p className="text-xs text-slate-500 mt-1 leading-tight">{actions[cls]}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
