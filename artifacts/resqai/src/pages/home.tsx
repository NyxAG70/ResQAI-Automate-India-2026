import {
  ArrowDownRight,
  ClipboardList,
  FileText,
  Layers3,
  ScanLine,
  ShieldCheck,
  UsersRound,
} from 'lucide-react';
import { AppShell, ArrowLink } from '@/components/app-shell';

const foundationSignals = [
  {
    icon: ScanLine,
    label: 'Signal intake',
    detail: 'A clear place for the first account.',
  },
  {
    icon: Layers3,
    label: 'Structured context',
    detail: 'The details responders need, kept together.',
  },
  {
    icon: UsersRound,
    label: 'Human handoff',
    detail: 'Decision support, never decision replacement.',
  },
];

export default function Home() {
  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-8 sm:pt-16 lg:px-10 lg:pb-24">
        <section className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20">
          <div className="fade-up">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-2 font-mono-ui text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
              <span className="size-1.5 rounded-full bg-accent" />
              Foundation build / 01
            </div>
            <h1 className="max-w-3xl font-display text-[clamp(3.5rem,8vw,6.9rem)] font-bold leading-[0.88] tracking-[-0.075em] text-primary">
              Make the
              <br />
              <span className="text-accent">first read</span>
              <br />
              count.
            </h1>
            <p className="mt-8 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              ResQAI gives human responders a steadier starting point when
              incident reports arrive fast, incomplete, and all at once.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <ArrowLink href="/report" testId="link-open-report-preview">
                Open report preview
              </ArrowLink>
              <span className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <ShieldCheck className="size-4 text-accent" />
                Human-led by design
              </span>
            </div>
          </div>

          <div className="fade-up-delay relative" data-testid="panel-foundation-signal">
            <div className="absolute -left-4 -top-4 hidden size-16 border-l border-t border-accent/50 sm:block" />
            <div className="absolute -bottom-4 -right-4 hidden size-16 border-b border-r border-primary/30 sm:block" />
            <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary p-5 text-primary-foreground shadow-[var(--shadow-md)] sm:p-7">
              <div className="flex items-start justify-between border-b border-primary-foreground/15 pb-5">
                <div>
                  <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-primary-foreground/60">
                    Field note 00
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em]">
                    The responder&apos;s first look
                  </h2>
                </div>
                <ClipboardList className="size-5 text-accent" />
              </div>

              <div className="py-6">
                <div className="mb-3 flex items-center justify-between font-mono-ui text-[10px] uppercase tracking-[0.14em] text-primary-foreground/55">
                  <span>Readiness signal</span>
                  <span className="text-accent">Preparing</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-primary-foreground/15">
                  <div className="h-full w-[72%] rounded-full bg-accent" />
                </div>
                <div className="mt-7 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/[0.07] p-4">
                    <p className="font-mono-ui text-[10px] uppercase tracking-[0.12em] text-primary-foreground/50">
                      Focus
                    </p>
                    <p className="mt-2 font-display text-xl font-semibold">
                      Context
                    </p>
                  </div>
                  <div className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/[0.07] p-4">
                    <p className="font-mono-ui text-[10px] uppercase tracking-[0.12em] text-primary-foreground/50">
                      Guardrail
                    </p>
                    <p className="mt-2 font-display text-xl font-semibold">
                      Human review
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 border-t border-primary-foreground/15 pt-5 text-sm text-primary-foreground/70">
                <span className="flex size-8 items-center justify-center rounded-full bg-accent text-primary">
                  <ArrowDownRight className="size-4" />
                </span>
                <span>One report at a time. Better signal, less noise.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-20 border-y border-border py-8 sm:mt-28 sm:py-10">
          <div className="grid gap-8 md:grid-cols-[0.65fr_1.35fr] md:items-start md:gap-12">
            <div>
              <p className="font-mono-ui text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                What is taking shape
              </p>
              <h2 className="mt-3 max-w-xs font-display text-3xl font-semibold leading-tight tracking-[-0.05em] text-primary">
                A calmer handoff under pressure.
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {foundationSignals.map((signal) => {
                const Icon = signal.icon;
                return (
                  <div
                    className="border-l border-border pl-4"
                    key={signal.label}
                    data-testid={`card-foundation-${signal.label
                      .toLowerCase()
                      .replaceAll(' ', '-')}`}
                  >
                    <Icon className="size-5 text-accent" strokeWidth={1.8} />
                    <h3 className="mt-5 text-sm font-bold text-foreground">
                      {signal.label}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {signal.detail}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:items-end lg:gap-16">
          <div>
            <div className="flex items-center gap-3">
              <FileText className="size-5 text-accent" />
              <p className="font-mono-ui text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                Current scope
              </p>
            </div>
            <h2 className="mt-4 max-w-lg font-display text-4xl font-semibold leading-[0.98] tracking-[-0.06em] text-primary sm:text-5xl">
              Start with the foundation. Keep the signal honest.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-6 text-muted-foreground">
              This first build establishes the ResQAI language and the report
              handoff. Operational views come after the foundation is verified.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-sm)]">
            <div className="grid grid-cols-[1fr_auto] border-b border-border px-5 py-4 font-mono-ui text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground sm:px-6">
              <span>Build area</span>
              <span>State</span>
            </div>
            <div
              className="grid grid-cols-[1fr_auto] items-center border-b border-border px-5 py-5 sm:px-6"
              data-testid="status-shell-build"
            >
              <div>
                <p className="text-sm font-bold text-foreground">ResQAI shell</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Brand, navigation, and route frame
                </p>
              </div>
              <span className="rounded-full bg-[#e2f0e8] px-3 py-1.5 font-mono-ui text-[10px] font-bold uppercase tracking-[0.12em] text-[#276344]">
                Ready
              </span>
            </div>
            <div
              className="grid grid-cols-[1fr_auto] items-center border-b border-border px-5 py-5 sm:px-6"
              data-testid="status-report-build"
            >
              <div>
                <p className="text-sm font-bold text-foreground">
                  Incident report
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Placeholder route for the next build
                </p>
              </div>
              <span className="rounded-full bg-accent/10 px-3 py-1.5 font-mono-ui text-[10px] font-bold uppercase tracking-[0.12em] text-accent">
                Next
              </span>
            </div>
            <div
              className="grid grid-cols-[1fr_auto] items-center px-5 py-5 sm:px-6"
              data-testid="status-operations-build"
            >
              <div>
                <p className="text-sm font-bold text-foreground">
                  Operations workspace
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Intentionally outside this foundation pass
                </p>
              </div>
              <span className="rounded-full bg-secondary px-3 py-1.5 font-mono-ui text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                Later
              </span>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}