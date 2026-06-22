"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { loginAction, type LoginFormState } from "@/app/login/actions";
import { TriangleAlertIcon } from "lucide-react";

type LoginFormProps = {
  callbackUrl: string;
};

export function LoginForm({ callbackUrl }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState<
    LoginFormState,
    FormData
  >(loginAction, null);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      {state?.error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2"
        >
          <TriangleAlertIcon className="w-4 h-4" /> {state.error}
        </div>
      )}

      <Input
        label="E-mail"
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="email@pumangol.co.ao"
        disabled={isPending}
      />

      <Input
        label="Senha"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        placeholder="••••••••"
        disabled={isPending}
      />

      <Button
        type="submit"
        variant="primary"
        fullWidth
        disabled={isPending}
      >
        {isPending ? "A entrar..." : "Entrar"}
      </Button>
    </form>
  );
}
