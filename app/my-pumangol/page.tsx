import { DashboardClient } from "@/components/dashboard-client";

export const metadata = { title: "My Pumangol — FILDA 2026" };

export default function MyPumangolPage() {
  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Visão em tempo real das leads captadas no FILDA 2026
          </p>
        </div>
      </div>
      <DashboardClient />
    </div>
  );
}
