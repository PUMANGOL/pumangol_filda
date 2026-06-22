"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { TriangleAlertIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  BUSINESS_POTENTIAL,
  CONTACT_TYPES,
  HOW_KNOWN_OPTIONS,
  INTEREST_LEVELS,
  PRODUCTS,
  PURCHASE_HORIZONS,
  ROUTES,
} from "@/lib/constants";
import type { RegistoInteresse } from "@/lib/types";
import { guardarLead, type InternoFormState } from "@/app/interno/actions";
import {
  emptyLeadFormValues,
  LEAD_REGISTO_NONE,
  type LeadFormField,
  type LeadFormValues,
} from "@/lib/validations/lead";

function mapAreaToProduto(area: string | undefined): string {
  if (!area) return "";
  if ((PRODUCTS as readonly string[]).includes(area)) {
    return area;
  }
  if (area === "Parcerias Comerciais") {
    return "Parcerias";
  }
  return "Outro";
}

function InternoFormSuccess({
  leadId,
  onNewLead,
}: {
  leadId?: string;
  onNewLead: () => void;
}) {
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
      <h2 className="mt-6 text-2xl font-bold text-gray-900">Lead guardada!</h2>
      <p className="mt-3 text-muted">
        A lead{" "}
        {leadId && (
          <span className="font-mono font-semibold text-gray-900">{leadId}</span>
        )}{" "}
        foi registada com sucesso. Pode consultá-la no dashboard comercial.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button href={ROUTES.dashboard} variant="primary">
          Ver Dashboard
        </Button>
        <Button type="button" variant="outline" onClick={onNewLead}>
          Registar Nova Lead
        </Button>
      </div>
    </div>
  );
}

function InternoFormFields({
  registos,
  onNewLead,
}: {
  registos: RegistoInteresse[];
  onNewLead: () => void;
}) {
  const [state, formAction, isPending] = useActionState<
    InternoFormState,
    FormData
  >(guardarLead, null);
  const [formValues, setFormValues] = useState<LeadFormValues>(
    emptyLeadFormValues
  );

  const registoOptions = useMemo(
    () => [
      { value: LEAD_REGISTO_NONE, label: "Nenhum — lead nova" },
      ...registos.map((registo) => ({
        value: String(registo.id),
        label: `#${registo.id} — ${registo.nome} (${registo.empresa})`,
      })),
    ],
    [registos]
  );

  const selectedRegisto = useMemo(() => {
    if (
      !formValues.fkRegistoInteresse ||
      formValues.fkRegistoInteresse === LEAD_REGISTO_NONE
    ) {
      return null;
    }
    return (
      registos.find(
        (registo) => String(registo.id) === formValues.fkRegistoInteresse
      ) ?? null
    );
  }, [formValues.fkRegistoInteresse, registos]);

  useEffect(() => {
    if (state?.values) {
      setFormValues(state.values);
    }
  }, [state?.submissionKey, state?.values]);

  const fieldErrors = state?.fieldErrors;
  const err = (field: LeadFormField) => fieldErrors?.[field];

  function updateField<K extends keyof LeadFormValues>(
    field: K,
    value: LeadFormValues[K]
  ) {
    setFormValues((current) => ({ ...current, [field]: value }));
  }

  function handleRegistoChange(registoId: string) {
    if (registoId === LEAD_REGISTO_NONE) {
      setFormValues((current) => ({
        ...current,
        fkRegistoInteresse: LEAD_REGISTO_NONE,
      }));
      return;
    }

    const registo = registos.find((item) => String(item.id) === registoId);
    if (!registo) {
      updateField("fkRegistoInteresse", registoId);
      return;
    }

    setFormValues((current) => ({
      ...current,
      fkRegistoInteresse: registoId,
      empresa: registo.empresa,
      nome: registo.nome,
      cargo: registo.cargo,
      telefone: registo.telefone,
      email: registo.email,
      tipo: registo.tipoContacto,
      comentarios: registo.observacoes ?? current.comentarios,
      produto: mapAreaToProduto(registo.areas[0]) || current.produto,
      comoConheceu: current.comoConheceu || "FILDA",
    }));
  }

  if (state?.success) {
    return <InternoFormSuccess leadId={state.leadId} onNewLead={onNewLead} />;
  }

  return (
    <form
      key={state?.submissionKey ?? "initial"}
      action={formAction}
      noValidate
      className="space-y-8"
    >
      {state?.error && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <TriangleAlertIcon className="h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}

      <div>
        <h2 className="flex items-center gap-2 border-b border-border pb-3 text-lg font-semibold text-gray-900">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-pumangol-red/10 text-sm font-bold text-pumangol-red">
            1
          </span>
          Ligação ao Registo Público
        </h2>
        <div className="mt-4 space-y-4">
          <Select
            label="Registo de Interesse"
            name="fkRegistoInteresse"
            selectOptions={registoOptions}
            placeholder="Seleccionar registo..."
            value={formValues.fkRegistoInteresse}
            onValueChange={handleRegistoChange}
            error={err("fkRegistoInteresse")}
            disabled={isPending}
          />
          {selectedRegisto && (
            <div className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted">
              <p>
                A lead será ligada ao registo público{" "}
                <span className="font-semibold text-gray-900">
                  #{selectedRegisto.id}
                </span>{" "}
                e marcada com origem{" "}
                <span className="font-semibold text-gray-900">público</span>.
              </p>
              {selectedRegisto.areas.length > 0 && (
                <p className="mt-2">
                  Áreas de interesse:{" "}
                  <span className="text-gray-900">
                    {selectedRegisto.areas.join(", ")}
                  </span>
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="flex items-center gap-2 border-b border-border pb-3 text-lg font-semibold text-gray-900">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-pumangol-red/10 text-sm font-bold text-pumangol-red">
            2
          </span>
          Dados da Empresa
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input
            label="Nome da Empresa"
            name="empresa"
            required
            value={formValues.empresa}
            onChange={(event) => updateField("empresa", event.target.value)}
            error={err("empresa")}
            disabled={isPending}
          />
          <Input
            label="NIF"
            name="nif"
            required
            value={formValues.nif}
            onChange={(event) => updateField("nif", event.target.value)}
            error={err("nif")}
            disabled={isPending}
          />
          <Input
            label="Sector de Actividade"
            name="sector"
            required
            value={formValues.sector}
            onChange={(event) => updateField("sector", event.target.value)}
            error={err("sector")}
            disabled={isPending}
          />
          <Input
            label="Número de Colaboradores"
            name="colaboradores"
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            required
            value={formValues.colaboradores}
            onChange={(event) =>
              updateField("colaboradores", event.target.value)
            }
            error={err("colaboradores")}
            disabled={isPending}
          />
          <div className="sm:col-span-2">
            <Input
              label="Localização"
              name="localizacao"
              required
              value={formValues.localizacao}
              onChange={(event) =>
                updateField("localizacao", event.target.value)
              }
              error={err("localizacao")}
              disabled={isPending}
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="flex items-center gap-2 border-b border-border pb-3 text-lg font-semibold text-gray-900">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-pumangol-red/10 text-sm font-bold text-pumangol-red">
            3
          </span>
          Dados do Contacto
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input
            label="Nome"
            name="nome"
            required
            value={formValues.nome}
            onChange={(event) => updateField("nome", event.target.value)}
            error={err("nome")}
            disabled={isPending}
          />
          <Input
            label="Cargo"
            name="cargo"
            required
            value={formValues.cargo}
            onChange={(event) => updateField("cargo", event.target.value)}
            error={err("cargo")}
            disabled={isPending}
          />
          <Select
            label="Tipo de Contacto"
            name="tipo"
            options={CONTACT_TYPES}
            required
            value={formValues.tipo}
            onValueChange={(value) => updateField("tipo", value)}
            error={err("tipo")}
            disabled={isPending}
          />
          <Input
            label="Telefone"
            name="telefone"
            type="tel"
            required
            value={formValues.telefone}
            onChange={(event) => updateField("telefone", event.target.value)}
            error={err("telefone")}
            disabled={isPending}
          />
          <div className="sm:col-span-2">
            <Input
              label="E-mail"
              name="email"
              type="email"
              required
              value={formValues.email}
              onChange={(event) => updateField("email", event.target.value)}
              error={err("email")}
              disabled={isPending}
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="flex items-center gap-2 border-b border-border pb-3 text-lg font-semibold text-gray-900">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-pumangol-red/10 text-sm font-bold text-pumangol-red">
            4
          </span>
          Qualificação
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Select
            label="Como conheceu a Pumangol?"
            name="comoConheceu"
            options={HOW_KNOWN_OPTIONS}
            required
            value={formValues.comoConheceu}
            onValueChange={(value) => updateField("comoConheceu", value)}
            error={err("comoConheceu")}
            disabled={isPending}
          />
          <Select
            label="Nível de Interesse"
            name="nivelInteresse"
            options={INTEREST_LEVELS}
            required
            value={formValues.nivelInteresse}
            onValueChange={(value) => updateField("nivelInteresse", value)}
            error={err("nivelInteresse")}
            disabled={isPending}
          />
          <Select
            label="Produto de Interesse"
            name="produto"
            options={PRODUCTS}
            required
            value={formValues.produto}
            onValueChange={(value) => updateField("produto", value)}
            error={err("produto")}
            disabled={isPending}
          />
          <Select
            label="Horizonte de Compra"
            name="horizonte"
            options={PURCHASE_HORIZONS}
            required
            value={formValues.horizonte}
            onValueChange={(value) => updateField("horizonte", value)}
            error={err("horizonte")}
            disabled={isPending}
          />
          <Select
            label="Potencial de Negócio"
            name="potencial"
            options={BUSINESS_POTENTIAL}
            required
            value={formValues.potencial}
            onValueChange={(value) => updateField("potencial", value)}
            error={err("potencial")}
            disabled={isPending}
          />
          <div className="sm:col-span-2">
            <Textarea
              label="Comentários Adicionais"
              name="comentarios"
              placeholder="Notas da conversa, necessidades específicas, próximos passos..."
              value={formValues.comentarios}
              onChange={(event) =>
                updateField("comentarios", event.target.value)
              }
              disabled={isPending}
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        disabled={isPending}
      >
        {isPending ? "A guardar..." : "Guardar Lead"}
      </Button>
    </form>
  );
}

export function InternoForm({ registos }: { registos: RegistoInteresse[] }) {
  const [formKey, setFormKey] = useState(0);

  return (
    <InternoFormFields
      key={formKey}
      registos={registos}
      onNewLead={() => setFormKey((key) => key + 1)}
    />
  );
}
