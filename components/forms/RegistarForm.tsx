"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { CONTACT_TYPES, INTEREST_AREAS } from "@/lib/constants";
import {
  registarInteresse,
  type RegistarFormState,
} from "@/app/registar/actions";

export function RegistarForm() {
  const [state, formAction, isPending] = useActionState<
    RegistarFormState,
    FormData
  >(registarInteresse, null);
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success("O seu interesse foi registado com sucesso!", {
        description: "A equipa Pumangol entrará em contacto consigo brevemente.",
        duration: 6000,
      });
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  function setInterest(area: string, selected: boolean) {
    setInterests((prev) => {
      if (selected) {
        return prev.includes(area) ? prev : [...prev, area];
      }
      return prev.filter((a) => a !== area);
    });
  }

  if (state?.success) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="mt-6 text-2xl font-bold text-gray-900">
          O seu interesse foi registado com sucesso!
        </h2>
        <p className="mt-3 text-muted">
          Obrigado. A equipa Pumangol entrará em contacto consigo brevemente.
        </p>
        <Button href="/" variant="outline" className="mt-6">
          Voltar à Página Inicial
        </Button>
      </div>
    );
  }

  const fieldErrors = state?.fieldErrors;

  return (
    <form action={formAction} className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 border-b border-border pb-3">
          Dados Pessoais
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input
            label="Nome Completo"
            name="nome"
            required
            placeholder="O seu nome completo"
            error={fieldErrors?.nome}
            disabled={isPending}
          />
          <Input
            label="Empresa"
            name="empresa"
            required
            placeholder="Nome da empresa"
            error={fieldErrors?.empresa}
            disabled={isPending}
          />
          <Input
            label="Cargo"
            name="cargo"
            required
            placeholder="O seu cargo"
            error={fieldErrors?.cargo}
            disabled={isPending}
          />
          <Input
            label="Telefone"
            name="telefone"
            type="tel"
            required
            placeholder="+244 9XX XXX XXX"
            error={fieldErrors?.telefone}
            disabled={isPending}
          />
          <div className="sm:col-span-2">
            <Input
              label="E-mail"
              name="email"
              type="email"
              required
              placeholder="email@empresa.ao"
              error={fieldErrors?.email}
              disabled={isPending}
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 border-b border-border pb-3">
          Tipo de Contacto
        </h2>
        <div className="mt-4">
          <Select
            label="Tipo de Contacto"
            name="tipo_contacto"
            options={CONTACT_TYPES}
            required
            error={fieldErrors?.tipo_contacto}
            disabled={isPending}
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 border-b border-border pb-3">
          Áreas de Interesse
        </h2>
        {fieldErrors?.areas && (
          <p className="mt-4 text-sm text-destructive">{fieldErrors.areas}</p>
        )}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {INTEREST_AREAS.map((area) => (
            <Checkbox
              key={area}
              variant="card"
              name="areas"
              value={area}
              label={area}
              checked={interests.includes(area)}
              onCheckedChange={(selected) => setInterest(area, selected)}
              disabled={isPending}
            />
          ))}
        </div>
      </div>

      <div>
        <Textarea
          label="Observações"
          name="observacoes"
          placeholder="Partilhe informações adicionais sobre o seu interesse..."
          disabled={isPending}
        />
      </div>

      <Checkbox
        name="consentimento_rgpd"
        label={
          <>
            Autorizo o tratamento dos meus dados pessoais pela Pumangol, em
            conformidade com a legislação de proteção de dados aplicável, para
            efeitos de contacto comercial relacionado com a FILDA 2026.
          </>
        }
        required
        error={fieldErrors?.consentimento_rgpd}
        disabled={isPending}
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        disabled={isPending}
      >
        {isPending ? "A submeter..." : "Submeter Registo"}
      </Button>
    </form>
  );
}
