"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import type { Lead } from "@/lib/db/schema";
import { Badge } from "@/components/ui/primitives/badge";
import { Button } from "@/components/ui/primitives/button";
import { formatDate, PROFILE_LABELS, SOLUTION_LABELS, TIMELINE_LABELS, ACADEMIA_TOPIC_LABELS } from "@/lib/utils";

const CLASSIFICATION_VARIANT: Record<string, "A+" | "A" | "B" | "C" | "D" | "FORNECEDOR"> = {
  "A+": "A+", A: "A", B: "B", C: "C", D: "D", FORNECEDOR: "FORNECEDOR",
};

interface LeadDetailModalProps {
  lead: Lead;
  onClose: () => void;
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-semibold text-slate-600 mb-2 text-sm">{title}</p>
      {children}
    </div>
  );
}

export function LeadDetailModal({ lead, onClose }: LeadDetailModalProps) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal
        aria-labelledby="lead-detail-title"
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-100 bg-white px-6 py-4">
          <div>
            <h2 id="lead-detail-title" className="text-lg font-bold text-slate-900">
              {lead.fullName}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">{lead.email}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant={CLASSIFICATION_VARIANT[lead.classification]}>
              {lead.classification}
            </Badge>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Fechar">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="px-6 py-5 grid sm:grid-cols-2 gap-5 text-sm">
          <DetailSection title="Contacto">
            <p className="text-slate-700">{lead.phone}</p>
            <p className="text-slate-700">{lead.email}</p>
            {lead.province && (
              <p className="text-slate-500 mt-1">
                {lead.province}
                {lead.municipality ? `, ${lead.municipality}` : ""}
              </p>
            )}
          </DetailSection>

          <DetailSection title="Perfil">
            <p className="text-slate-700">{PROFILE_LABELS[lead.profile] ?? lead.profile}</p>
            {lead.isExistingClient !== null && (
              <p className="text-slate-500 text-xs mt-1">
                {lead.isExistingClient ? "Cliente existente" : "Não é cliente"}
              </p>
            )}
          </DetailSection>

          {(lead.companyName || lead.sector || lead.jobTitle) && (
            <DetailSection title="Empresa">
              {lead.companyName && <p className="text-slate-700">{lead.companyName}</p>}
              {lead.sector && <p className="text-slate-500">{lead.sector}</p>}
              {lead.jobTitle && <p className="text-slate-500">{lead.jobTitle}</p>}
            </DetailSection>
          )}

          <DetailSection title="Soluções">
            <div className="flex flex-wrap gap-1">
              {((lead.solutions as string[]) ?? []).length > 0 ? (
                ((lead.solutions as string[]) ?? []).map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded-full bg-brand-light text-brand text-xs font-medium"
                  >
                    {SOLUTION_LABELS[s] ?? s}
                  </span>
                ))
              ) : (
                <span className="text-slate-400 text-xs">—</span>
              )}
            </div>
            {((lead.academiaTopics as string[]) ?? []).length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-slate-500 mb-1">Academia de Formação</p>
                <div className="flex flex-wrap gap-1">
                  {(lead.academiaTopics as string[]).map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs"
                    >
                      {ACADEMIA_TOPIC_LABELS[t] ?? t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </DetailSection>

          <DetailSection title="Qualificação">
            <p className="text-slate-700">
              {TIMELINE_LABELS[lead.purchaseTimeline] ?? lead.purchaseTimeline}
            </p>
            <p className="text-slate-500 text-xs mt-1">
              {lead.wantsContact ? "Pretende ser contactado" : "Não pretende ser contactado"}
            </p>
            {((lead.contactPreference as string[]) ?? []).length > 0 && (
              <p className="text-slate-500 text-xs mt-1">
                Prefere: {(lead.contactPreference as string[]).join(", ")}
              </p>
            )}
          </DetailSection>

          <DetailSection title="Pontuação">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-500">
              <span>Perfil</span>
              <span className="font-medium text-slate-700">{lead.scoreProfile}</span>
              <span>Interesse</span>
              <span className="font-medium text-slate-700">{lead.scoreInterest}</span>
              <span>Potencial</span>
              <span className="font-medium text-slate-700">{lead.scorePotential}</span>
              <span>Timeline</span>
              <span className="font-medium text-slate-700">{lead.scoreTimeline}</span>
              <span>Contacto</span>
              <span className="font-medium text-slate-700">{lead.scoreContact}</span>
              <span className="font-semibold text-slate-700">Total</span>
              <span className="font-bold text-brand">{lead.totalScore}/115</span>
            </div>
          </DetailSection>

          <DetailSection title="Metadados">
            <p className="text-slate-500 text-xs">{formatDate(lead.createdAt)}</p>
            <p className="text-slate-500 text-xs mt-1">
              Por: {lead.submittedByFullName ?? lead.submittedByUsername ?? "Externo"}
            </p>
            {lead.gdprConsent && (
              <span className="inline-flex items-center mt-2 px-1.5 py-0.5 rounded bg-green-100 text-green-700 text-xs">
                ✓ Consentimento RGPD
              </span>
            )}
          </DetailSection>

          {lead.notes && (
            <DetailSection title="Notas">
              <p className="text-slate-600 text-xs leading-relaxed">{lead.notes}</p>
            </DetailSection>
          )}
        </div>

        <div className="border-t border-slate-100 px-6 py-4 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
