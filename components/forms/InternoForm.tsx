"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import {
  BUSINESS_POTENTIAL,
  HOW_KNOWN_OPTIONS,
  INTEREST_LEVELS,
  PRODUCTS,
  PURCHASE_HORIZONS,
} from "@/lib/constants";

export function InternoForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <Card padding="lg" className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="mt-6 text-2xl font-bold text-gray-900">Lead guardada!</h2>
        <p className="mt-3 text-muted">
          A lead foi registada com sucesso no sistema. Pode consultá-la no
          dashboard comercial.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button href="/dashboard" variant="primary">
            Ver Dashboard
          </Button>
          <Button
            variant="outline"
            onClick={() => setSubmitted(false)}
          >
            Registar Nova Lead
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 border-b border-border pb-3 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-pumangol-red/10 text-sm font-bold text-pumangol-red">1</span>
          Dados da Empresa
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input label="Nome da Empresa" name="empresa" required />
          <Input label="NIF" name="nif" required />
          <Input label="Sector de Actividade" name="sector" required />
          <Input label="Número de Colaboradores" name="colaboradores" type="number" required />
          <div className="sm:col-span-2">
            <Input label="Localização" name="localizacao" required />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 border-b border-border pb-3 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-pumangol-red/10 text-sm font-bold text-pumangol-red">2</span>
          Dados do Contacto
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input label="Nome" name="nome" required />
          <Input label="Cargo" name="cargo" required />
          <Input label="Telefone" name="telefone" type="tel" required />
          <Input label="E-mail" name="email" type="email" required />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 border-b border-border pb-3 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-pumangol-red/10 text-sm font-bold text-pumangol-red">3</span>
          Qualificação
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Select
            label="Como conheceu a Pumangol?"
            name="comoConheceu"
            options={HOW_KNOWN_OPTIONS}
            required
          />
          <Select
            label="Nível de Interesse"
            name="nivelInteresse"
            options={INTEREST_LEVELS}
            required
          />
          <Select
            label="Produto de Interesse"
            name="produto"
            options={PRODUCTS}
            required
          />
          <Select
            label="Horizonte de Compra"
            name="horizonte"
            options={PURCHASE_HORIZONS}
            required
          />
          <Select
            label="Potencial de Negócio"
            name="potencial"
            options={BUSINESS_POTENTIAL}
            required
          />
          <div className="sm:col-span-2">
            <Textarea
              label="Comentários Adicionais"
              name="comentarios"
              placeholder="Notas da conversa, necessidades específicas, próximos passos..."
            />
          </div>
        </div>
      </div>

      <Button type="submit" variant="primary" size="lg" fullWidth>
        Guardar Lead
      </Button>
    </form>
  );
}
