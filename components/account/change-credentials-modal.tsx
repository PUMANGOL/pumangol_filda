"use client";

import { useActionState, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Eye, EyeOff, Loader2, X } from "lucide-react";
import {
  changeCredentialsAction,
  type ChangeCredentialsState,
} from "@/app/account/actions";
import { Button } from "@/components/ui/primitives/button";
import { Input } from "@/components/ui/primitives/input";
import { Label } from "@/components/ui/primitives/label";

type ChangeCredentialsModalProps = {
  open: boolean;
  currentUsername: string;
  onClose: () => void;
};

function PasswordField({
  id,
  name,
  label,
  error,
  disabled,
  required = true,
}: {
  id: string;
  name: string;
  label: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={name === "currentPassword" ? "current-password" : "new-password"}
          required={required}
          disabled={disabled}
          error={error}
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          tabIndex={-1}
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

export function ChangeCredentialsModal({
  open,
  currentUsername,
  onClose,
}: ChangeCredentialsModalProps) {
  const [state, formAction, isPending] = useActionState<
    ChangeCredentialsState,
    FormData
  >(changeCredentialsAction, null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isPending) onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, isPending, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => {
          if (!isPending) onClose();
        }}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal
        aria-labelledby="change-credentials-title"
        className="relative w-full max-w-md rounded-2xl border border-border bg-white shadow-xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
          <div>
            <h2 id="change-credentials-title" className="text-lg font-semibold text-foreground">
              Alterar credenciais
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Após guardar, a sessão será terminada automaticamente.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={isPending}
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form action={formAction} className="px-6 py-5 space-y-4">
          {state?.error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {state.error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="newUsername" required>
              Novo utilizador
            </Label>
            <Input
              id="newUsername"
              name="newUsername"
              type="text"
              defaultValue={currentUsername}
              autoComplete="username"
              required
              disabled={isPending}
              error={state?.fieldErrors?.newUsername}
            />
          </div>

          <PasswordField
            id="currentPassword"
            name="currentPassword"
            label="Senha actual"
            error={state?.fieldErrors?.currentPassword}
            disabled={isPending}
          />

          <PasswordField
            id="newPassword"
            name="newPassword"
            label="Nova senha"
            error={state?.fieldErrors?.newPassword}
            disabled={isPending}
            required={false}
          />

          <PasswordField
            id="confirmPassword"
            name="confirmPassword"
            label="Confirmar nova senha"
            error={state?.fieldErrors?.confirmPassword}
            disabled={isPending}
            required={false}
          />

          <p className="text-xs text-muted-foreground -mt-2">
            Deixe os campos de nova senha em branco se só quiser alterar o utilizador.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  A guardar...
                </>
              ) : (
                "Guardar e terminar sessão"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
