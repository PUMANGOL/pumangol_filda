"use server";

/**
 * Internal lead creation — superseded by /leads/new in the FILDA 2026 CRM.
 * Kept as a stub for backward compatibility.
 */

import type { LeadFormValues } from "@/lib/validations/lead";

export type InternoFormState = {
  success?: boolean;
  leadId?: string;
  error?: string;
  fieldErrors?: Partial<Record<string, string>>;
  values?: LeadFormValues;
  submissionKey?: number;
} | null;

export async function guardarLead(
  _prevState: InternoFormState,
  _formData: FormData
): Promise<InternoFormState> {
  return {
    success: false,
    error: "Este formulário foi substituído pelo novo sistema FILDA 2026. Aceda a /leads/new.",
  };
}
