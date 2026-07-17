"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import type { Reclamacao } from "@/lib/db/schema";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/primitives/button";

type ReclamacaoDetailModalProps = {
  reclamacao: Reclamacao;
  onClose: () => void;
};

export function ReclamacaoDetailModal({
  reclamacao,
  onClose,
}: ReclamacaoDetailModalProps) {
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
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal
        aria-labelledby="reclamacao-detail-title"
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-100 bg-white px-6 py-4">
          <div>
            <h2 id="reclamacao-detail-title" className="text-lg font-bold text-slate-900">
              {reclamacao.category}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              #{reclamacao.id} · {formatDate(reclamacao.createdAt)}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Fechar">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="px-6 py-5 space-y-4 text-sm">
          <div>
            <p className="font-semibold text-slate-600 mb-1">Registado por</p>
            <p className="text-slate-700">
              {reclamacao.submittedByFullName ??
                reclamacao.submittedByUsername ??
                "—"}
            </p>
          </div>
          <div>
            <p className="font-semibold text-slate-600 mb-2">Descrição</p>
            <div
              className="prose prose-sm max-w-none text-slate-800 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
              dangerouslySetInnerHTML={{ __html: reclamacao.description }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
