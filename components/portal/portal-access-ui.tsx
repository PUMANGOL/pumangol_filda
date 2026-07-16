"use client";

import { useEffect, useState } from "react";
import { Clock, ShieldOff } from "lucide-react";

type PortalExpiryBannerProps = {
  expiresAt: number;
};

function formatRemaining(ms: number): string {
  if (ms <= 0) return "0:00";
  const totalSec = Math.ceil(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function PortalExpiryBanner({ expiresAt }: PortalExpiryBannerProps) {
  const [remaining, setRemaining] = useState(() => expiresAt - Date.now());

  useEffect(() => {
    const tick = () => setRemaining(expiresAt - Date.now());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [expiresAt]);

  if (remaining <= 0) {
    return (
      <div className="border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-900">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 shrink-0" />
          <span>
            O acesso temporário via portal <strong>expirou</strong>. Volte ao{" "}
            <strong>portal.pumangol.co.ao</strong> e abra o link novamente.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-border bg-muted/60 px-4 py-2 text-xs text-muted-foreground">
      <div className="flex items-center gap-2">
        <Clock className="h-3.5 w-3.5 shrink-0" />
        <span>
          Acesso temporário via portal · expira em{" "}
          <span className="font-semibold tabular-nums text-foreground">
            {formatRemaining(remaining)}
          </span>
        </span>
      </div>
    </div>
  );
}

export function PortalAccessDenied() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-6">
      <div className="max-w-md rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
          <ShieldOff className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-bold text-foreground">Acesso restrito</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Não tem permissão para acessar esta área.
        </p>
      </div>
    </div>
  );
}

export function PortalExpiredScreen({ email }: { email?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-6">
      <div className="max-w-md rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-700">
          <Clock className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-bold text-foreground">Acesso expirado</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          O tempo de acesso temporário terminou
          {email ? (
            <>
              {" "}
              para <strong className="text-foreground">{email}</strong>
            </>
          ) : null}
          . Volte ao portal e abra o link novamente para continuar.
        </p>
      </div>
    </div>
  );
}
