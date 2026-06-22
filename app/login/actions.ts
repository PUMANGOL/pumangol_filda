"use server";

import { redirect } from "next/navigation";
import { authenticate } from "@/lib/auth/login";
import { destroySession } from "@/lib/auth/session";
import { AUTH_ROUTES } from "@/lib/auth/config";

export type LoginFormState = {
  error?: string;
} | null;

function safeCallbackUrl(value: string | null): string {
  if (value && value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }
  return AUTH_ROUTES.dashboard;
}

export async function loginAction(
  _prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const callbackUrl = safeCallbackUrl(
    String(formData.get("callbackUrl") ?? "")
  );

  const result = await authenticate(email, password);
  if (!result.ok) {
    return { error: result.error };
  }

  redirect(callbackUrl);
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect(AUTH_ROUTES.login);
}
