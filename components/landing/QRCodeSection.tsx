"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ROUTES } from "@/lib/constants";

export function QRCodeSection() {
  const [registrationUrl, setRegistrationUrl] = useState<string | null>(null);

  useEffect(() => {
    setRegistrationUrl(`${window.location.origin}${ROUTES.registar}`);
  }, []);

  return (
    <section id="qr-code" className="section-padding bg-surface pattern-dots">
      <div className="container-main">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-pumangol-red/10 px-4 py-1 text-sm font-semibold text-pumangol-red">
            Registo Rápido
          </span>
          <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Escaneie e registe-se em segundos
          </h2>
          <p className="mt-4 text-lg text-muted">
            Escaneie o QR Code e registe-se para conhecer as soluções da
            Pumangol.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-lg">
          <Card padding="lg" className="text-center shadow-lg">
            <div className="qr-pulse mx-auto inline-block rounded-2xl border-4 border-pumangol-red bg-white p-6">
              {registrationUrl ? (
                <QRCode
                  value={registrationUrl}
                  size={200}
                  level="H"
                  fgColor="#212529"
                  bgColor="#FFFFFF"
                />
              ) : (
                <div
                  className="h-[200px] w-[200px] animate-pulse rounded-lg bg-gray-100"
                  aria-hidden
                />
              )}
            </div>

            <p className="mt-6 text-sm text-muted leading-relaxed">
              Aponte a câmara do seu telemóvel para o código e aceda
              automaticamente ao formulário de registo.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button href={ROUTES.registar} variant="primary">
                Abrir Formulário
              </Button>
              <Button href={ROUTES.registar} variant="outline">
                Registar Manualmente
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
