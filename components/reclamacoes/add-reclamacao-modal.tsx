"use client";

import { useEffect, useState, useTransition } from "react";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { ReclamacaoCategory } from "@/lib/reclamacoes/constants";
import { RECLAMACAO_CATEGORIES } from "@/lib/reclamacoes/constants";
import { createReclamacao } from "@/app/reclamacoes/actions";
import { Button } from "@/components/ui/primitives/button";
import { Label } from "@/components/ui/primitives/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/primitives/select";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

type AddReclamacaoModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export function AddReclamacaoModal({
  open,
  onClose,
  onCreated,
}: AddReclamacaoModalProps) {
  const [category, setCategory] = useState<ReclamacaoCategory | "">("");
  const [description, setDescription] = useState("");
  const [editorKey, setEditorKey] = useState(0);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !pending) onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose, pending]);

  useEffect(() => {
    if (open) {
      setCategory("");
      setDescription("");
      setEditorKey((k) => k + 1);
    }
  }, [open]);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!category) {
      toast.error("Seleccione a categoria.");
      return;
    }

    startTransition(async () => {
      const result = await createReclamacao({ category, description });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Reclamação registada.");
      onCreated();
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => !pending && onClose()}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal
        aria-labelledby="add-reclamacao-title"
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 id="add-reclamacao-title" className="text-lg font-bold text-slate-900">
            Nova reclamação
          </h2>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={pending}
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="reclamacao-categoria">Categoria</Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as ReclamacaoCategory)}
            >
              <SelectTrigger id="reclamacao-categoria" className="w-full">
                <SelectValue placeholder="Seleccionar categoria" />
              </SelectTrigger>
              <SelectContent>
                {RECLAMACAO_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Descrição</Label>
            <RichTextEditor
              key={editorKey}
              value={description}
              onChange={setDescription}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={pending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  A guardar...
                </>
              ) : (
                "Registar"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
