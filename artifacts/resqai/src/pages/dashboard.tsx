import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  MapPin,
  Radio,
  ShieldCheck,
  Users,
  Waves,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

type Incident = {
  id: string;
  title: string;
  description: string;
  confidence: number;
  peopleAffected: number;
  source: string;
  priorityScore: number;
  priorityLevel: "low" | "medium" | "high" | "critical";
  incidentType: string;
};

type DashboardData = {
  incidents: Incident[];
  stats: {
    activeIncidents: number;
    criticalIncidents: number;
    affectedPopulation: number;
    activeOperations: number;
    incomingReports: number;
  };
  summary: string;
  recommendations: Array<{
    id: string;
    action: string;
    reason: string;
    targetLocation: string;
  }>;
  isDemo: boolean;
};

const priorityColor = {
  critical: "#ef6a4d",
  high: "#f0a34a",
  medium: "#e4c55a",
  low: "#65b88c",
};

function PriorityMap({
  incidents,
  onSelect,
}: {
  incidents: Incident[];
  onSelect: (incident: Incident) => void;
}) {
  return (
    <div
      className="relative min-h-[390px] overflow-hidden rounded-2xl border border-border bg-[#14213b]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(151,174,205,.16) 1px,transparent 1px),linear-gradient(90deg,rgba(151,174,205,.16) 1px,transparent 1px)",
        backgroundSize: "42px 42px",
      }}
    >
      <div className="absolute inset-x-[18%] inset-y-[20%] rotate-12 rounded-[48%] border-2 border-cyan-300/20 bg-cyan-400/5" />
      <div className="absolute right-4 top-4 rounded-lg border border-white/10 bg-[#14213b]/90 px-3 py-2 font-mono-ui text-[10px] font-bold uppercase tracking-widest text-slate-300">
        GIS view · demo data
      </div>
      {incidents.map((incident, index) => (
        <button
          key={incident.id}
          aria-label={incident.title}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white p-1 shadow-lg transition-transform hover:scale-150"
          style={{
            left: `${14 + ((index * 19) % 72)}%`,
            top: `${20 + ((index * 31) % 64)}%`,
            backgroundColor: priorityColor[incident.priorityLevel],
          }}
          onClick={() => onSelect(incident)}
        />
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [selected, setSelected] = useState<Incident | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((response) => response.json())
      .then(setData)
      .catch(() => setData(null));
  }, []);

  if (!data) {
    return (
      <AppShell>
        <main className="mx-auto max-w-7xl px-5 py-20 text-muted-foreground">
          Loading operational picture…
        </main>
      </AppShell>
    );
  }

  const stats = [
    ["Active incidents", data.stats.activeIncidents, Activity],
    ["Critical zones", data.stats.criticalIncidents, AlertTriangle],
    ["People affected", data.stats.affectedPopulation, Users],
    ["Rescue operations", data.stats.activeOperations, Waves],
    ["Incoming reports", data.stats.incomingReports, Radio],
  ] as const;

  return (
    <AppShell>
      <main className="mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-8 lg:px-10">
        <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-2 font-mono-ui text-[10px] font-bold uppercase tracking-widest text-accent">
              <ShieldCheck className="size-3" />
              Authority dashboard
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-primary sm:text-6xl">
              Sense. Prioritize. Respond.
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Incoming reports become a shared operational picture for human responders.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
            <Radio className="size-4 text-accent" />
            {data.isDemo ? "DEMO STREAM" : "LIVE"}
          </div>
        </header>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map(([label, value, Icon]) => (
            <div key={label} className="rounded-xl border border-border bg-card p-4">
              <Icon className="mb-3 size-4 text-accent" />
              <div className="font-mono-ui text-3xl font-bold text-primary">{value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-primary">Priority map</h2>
              <span className="text-xs text-muted-foreground">
                {data.incidents.length} zones plotted
              </span>
            </div>
            <PriorityMap incidents={data.incidents} onSelect={setSelected} />
          </section>

          <section className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">
                Data-driven situation summary
              </div>
              <p className="leading-7 text-foreground">{data.summary}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="font-display text-2xl font-bold text-primary">Next actions</h2>
              <div className="mt-4 space-y-4">
                {data.recommendations.map((recommendation) => (
                  <div key={recommendation.id} className="border-l-2 border-accent pl-3">
                    <div className="text-sm font-bold text-primary">
                      {recommendation.action}
                    </div>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {recommendation.targetLocation} · {recommendation.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-2xl border border-border bg-card">
          <div className="border-b border-border p-5">
            <h2 className="font-display text-2xl font-bold text-primary">
              Incoming incident stream
            </h2>
            <p className="text-sm text-muted-foreground">
              Priority uses exposure, urgency, access, and severity.
            </p>
          </div>
          <div className="divide-y divide-border">
            {[...data.incidents]
              .sort((a, b) => b.priorityScore - a.priorityScore)
              .map((incident) => (
                <button
                  key={incident.id}
                  className="grid w-full gap-3 p-4 text-left transition-colors hover:bg-secondary/60 sm:grid-cols-[1fr_130px_90px_100px] sm:items-center"
                  onClick={() => setSelected(incident)}
                >
                  <div>
                    <div className="flex items-center gap-2 font-semibold text-primary">
                      <span
                        className="size-2 rounded-full"
                        style={{ backgroundColor: priorityColor[incident.priorityLevel] }}
                      />
                      {incident.title}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="size-3" />
                      {incident.source} · {incident.peopleAffected} people
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">{incident.incidentType}</div>
                  <div
                    className="font-mono-ui text-sm font-bold"
                    style={{ color: priorityColor[incident.priorityLevel] }}
                  >
                    {incident.priorityScore}/10
                  </div>
                  <div className="text-right text-xs font-bold uppercase text-muted-foreground">
                    {incident.priorityLevel}
                  </div>
                </button>
              ))}
          </div>
        </section>

        {selected && (
          <div className="fixed inset-x-4 bottom-4 z-30 mx-auto max-w-xl rounded-2xl border border-accent/40 bg-[#182743] p-5 text-slate-100 shadow-2xl">
            <button
              className="float-right px-2 text-xl text-slate-300"
              onClick={() => setSelected(null)}
            >
              ×
            </button>
            <div className="font-mono-ui text-[10px] font-bold uppercase tracking-widest text-accent">
              Incident detail · {selected.source}
            </div>
            <h3 className="mt-2 font-display text-2xl font-bold">{selected.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">{selected.description}</p>
            <div className="mt-4 grid grid-cols-3 gap-3 border-t border-white/10 pt-4 text-xs">
              <div>
                Priority
                <strong
                  className="block text-lg"
                  style={{ color: priorityColor[selected.priorityLevel] }}
                >
                  {selected.priorityScore}/10
                </strong>
              </div>
              <div>
                Confidence
                <strong className="block text-lg">{Math.round(selected.confidence * 100)}%</strong>
              </div>
              <div>
                Affected
                <strong className="block text-lg">{selected.peopleAffected}</strong>
              </div>
            </div>
          </div>
        )}
      </main>
    </AppShell>
  );
}