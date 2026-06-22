"use server";

import { getDb } from "@/lib/db";
import { registoAreasInteresse, registosInteresse } from "@/lib/db/schema";
import { CONTACT_TYPES, INTEREST_AREAS } from "@/lib/constants";

export type RegistarFormState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Partial<
    Record<
      | "nome"
      | "empresa"
      | "cargo"
      | "telefone"
      | "email"
      | "tipo_contacto"
      | "areas"
      | "consentimento_rgpd",
      string
    >
  >;
} | null;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function validateForm(formData: FormData) {
  const fieldErrors: NonNullable<RegistarFormState>["fieldErrors"] = {};

  const nome = getString(formData, "nome");
  const empresa = getString(formData, "empresa");
  const cargo = getString(formData, "cargo");
  const telefone = getString(formData, "telefone");
  const email = getString(formData, "email");
  const tipoContacto = getString(formData, "tipo_contacto");
  const observacoes = getString(formData, "observacoes");
  const consentimento = formData.get("consentimento_rgpd") === "on";
  const areas = formData
    .getAll("areas")
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean);

  if (!nome) fieldErrors.nome = "Indique o seu nome completo.";
  if (!empresa) fieldErrors.empresa = "Indique o nome da empresa.";
  if (!cargo) fieldErrors.cargo = "Indique o seu cargo.";
  if (!telefone) fieldErrors.telefone = "Indique um número de telefone.";
  if (!email) {
    fieldErrors.email = "Indique um endereço de e-mail.";
  } else if (!EMAIL_REGEX.test(email)) {
    fieldErrors.email = "Introduza um endereço de e-mail válido.";
  }
  if (!tipoContacto) {
    fieldErrors.tipo_contacto = "Seleccione o tipo de contacto.";
  } else if (!(CONTACT_TYPES as readonly string[]).includes(tipoContacto)) {
    fieldErrors.tipo_contacto = "Tipo de contacto inválido.";
  }

  const validAreas = areas.filter((area) =>
    (INTEREST_AREAS as readonly string[]).includes(area)
  );
  if (areas.length > 0 && validAreas.length !== areas.length) {
    fieldErrors.areas = "Uma ou mais áreas de interesse são inválidas.";
  }

  if (!consentimento) {
    fieldErrors.consentimento_rgpd =
      "É necessário autorizar o tratamento dos dados pessoais.";
  }

  return {
    fieldErrors,
    data: {
      nome,
      empresa,
      cargo,
      telefone,
      email,
      tipoContacto,
      observacoes: observacoes || null,
      consentimento,
      areas: validAreas,
    },
  };
}

export async function registarInteresse(
  _prevState: RegistarFormState,
  formData: FormData
): Promise<RegistarFormState> {
  const { fieldErrors, data } = validateForm(formData);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      error: "Corrija os campos assinalados e tente novamente.",
      fieldErrors,
    };
  }

  const hoje = new Date().toISOString().slice(0, 10);

  try {
    await getDb().transaction(async (tx) => {
      const [registo] = await tx
        .insert(registosInteresse)
        .values({
          nome: data.nome,
          empresa: data.empresa,
          cargo: data.cargo,
          telefone: data.telefone,
          email: data.email,
          tipoContacto: data.tipoContacto,
          observacoes: data.observacoes,
          consentimentoRgpd: true,
          consentimentoEm: hoje,
        })
        .returning({ id: registosInteresse.pkRegistosInteresse });

      if (data.areas.length > 0) {
        await tx.insert(registoAreasInteresse).values(
          data.areas.map((area) => ({
            pkRegistoAreasInteresse: registo.id,
            area,
          }))
        );
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Erro ao registar interesse:", error);

    const message =
      error instanceof Error ? error.message.toLowerCase() : "";

    if (message.includes("connect") || message.includes("econnrefused")) {
      return {
        success: false,
        error:
          "Não foi possível ligar à base de dados. Tente novamente mais tarde.",
      };
    }

    return {
      success: false,
      error:
        "Ocorreu um erro ao submeter o registo. Tente novamente ou contacte a equipa Pumangol.",
    };
  }
}
