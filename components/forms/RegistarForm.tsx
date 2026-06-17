"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { CONTACT_TYPES, INTEREST_AREAS } from "@/lib/constants";

export function RegistarForm() {
  const [submitted, setSubmitted] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);

  function toggleInterest(area: string) {
    setInterests((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  }

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
        <h2 className="mt-6 text-2xl font-bold text-gray-900">
          Registo submetido com sucesso!
        </h2>
        <p className="mt-3 text-muted">
          Obrigado pelo seu interesse. A equipa Pumangol entrará em contacto
          consigo brevemente.
        </p>
        <Button href="/" variant="outline" className="mt-6">
          Voltar à Página Inicial
        </Button>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 border-b border-border pb-3">
          Dados Pessoais
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input label="Nome Completo" name="nome" required placeholder="O seu nome completo" />
          <Input label="Empresa" name="empresa" required placeholder="Nome da empresa" />
          <Input label="Cargo" name="cargo" required placeholder="O seu cargo" />
          <Input label="Telefone" name="telefone" type="tel" required placeholder="+244 9XX XXX XXX" />
          <div className="sm:col-span-2">
            <Input label="E-mail" name="email" type="email" required placeholder="email@empresa.ao" />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 border-b border-border pb-3">
          Tipo de Contacto
        </h2>
        <div className="mt-4">
          <Select label="Tipo de Contacto" name="tipo" options={CONTACT_TYPES} required />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 border-b border-border pb-3">
          Áreas de Interesse
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {INTEREST_AREAS.map((area) => (
            <label
              key={area}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                interests.includes(area)
                  ? "border-pumangol-red bg-pumangol-red/5"
                  : "border-border hover:border-gray-300"
              }`}
            >
              <input
                type="checkbox"
                checked={interests.includes(area)}
                onChange={() => toggleInterest(area)}
                className="h-4 w-4 rounded text-pumangol-red focus:ring-pumangol-red"
              />
              <span className="text-sm font-medium text-gray-700">{area}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <Textarea
          label="Observações"
          name="observacoes"
          placeholder="Partilhe informações adicionais sobre o seu interesse..."
        />
      </div>

      <Checkbox
        label={
          <>
            Autorizo o tratamento dos meus dados pessoais pela Pumangol, em
            conformidade com a legislação de proteção de dados aplicável, para
            efeitos de contacto comercial relacionado com a FILDA 2026.
          </>
        }
        required
      />

      <Button type="submit" variant="primary" size="lg" fullWidth>
        Submeter Registo
      </Button>
    </form>
  );
}
