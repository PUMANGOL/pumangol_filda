import { LeadsList } from "@/components/leads-list";

export const metadata = { title: "Leads — My Pumangol FILDA 2026" };

export default function MyPumangolLeadsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
        <p className="text-slate-500 text-sm mt-1">
          Todas as leads captadas no evento FILDA 2026
        </p>
      </div>
      <LeadsList />
    </div>
  );
}
