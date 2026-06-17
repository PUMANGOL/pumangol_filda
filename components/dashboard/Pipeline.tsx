import { PIPELINE_STAGES } from "@/lib/constants";

type PipelineCounts = Record<string, number>;

const stageColors = [
  "bg-gray-400",
  "bg-blue-400",
  "bg-indigo-500",
  "bg-purple-500",
  "bg-pumangol-yellow",
  "bg-green-500",
];

export function Pipeline({ counts }: { counts: PipelineCounts }) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">Pipeline de Vendas</h3>
      <p className="mt-1 text-sm text-muted">
        Acompanhamento por etapa do funil comercial FILDA 2026
      </p>

      <div className="mt-6 flex h-3 overflow-hidden rounded-full">
        {PIPELINE_STAGES.map((stage, i) => {
          const count = counts[stage] || 0;
          const width = total > 0 ? (count / total) * 100 : 0;
          if (width === 0) return null;
          return (
            <div
              key={stage}
              className={`${stageColors[i]} transition-all`}
              style={{ width: `${width}%` }}
              title={`${stage}: ${count}`}
            />
          );
        })}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PIPELINE_STAGES.map((stage, i) => (
          <div
            key={stage}
            className="flex items-center justify-between rounded-xl border border-border px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span className={`h-3 w-3 rounded-full ${stageColors[i]}`} />
              <span className="text-sm font-medium text-gray-700">{stage}</span>
            </div>
            <span className="text-lg font-bold text-gray-900">
              {counts[stage] || 0}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
