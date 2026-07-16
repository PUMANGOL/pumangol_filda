import { getPortalAccess } from "@/lib/auth/portal";
import { LeadForm } from "@/components/lead-form/lead-form";

export const metadata = { title: "Nova Lead — My Pumangol FILDA 2026" };

export default async function MyPumangolNewLeadPage() {
  const portal = await getPortalAccess();
  const submittedBy = portal?.email ?? "Portal";

  return (
    <div className="mx-auto w-full max-w-6xl px-2 md:px-3 lg:px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Nova Lead</h1>
        <p className="text-slate-500 text-sm mt-1">
          Preencha os dados do visitante. O formulário adapta-se automaticamente
          ao perfil seleccionado.
        </p>
      </div>
      <LeadForm submittedBy={submittedBy} />
    </div>
  );
}
