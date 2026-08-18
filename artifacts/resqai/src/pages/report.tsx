import { ArrowLeft, FileText, ShieldCheck } from 'lucide-react';
import { Link } from 'wouter';
import { AppShell } from '@/components/app-shell';

export default function Report() {
  return (
    <AppShell>
      <div className="mx-auto flex min-h-[calc(100dvh-174px)] max-w-6xl items-center px-5 py-16 sm:px-8 lg:px-10">
        <section className="w-full max-w-2xl">
          <div className="mb-7 flex size-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
            <FileText className="size-6" strokeWidth={1.8} />
          </div>
          <p className="font-mono-ui text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
            Incident report / next build
          </p>
          <h1
            className="mt-4 font-display text-5xl font-bold leading-[0.95] tracking-[-0.07em] text-primary sm:text-7xl"
            data-testid="heading-report-placeholder"
          >
            The report flow is being prepared.
          </h1>
          <p
            className="mt-7 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg"
            data-testid="text-report-placeholder"
          >
            This route is reserved for the future incident report experience.
            The form is intentionally not part of the ResQAI foundation build.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-bold text-foreground shadow-[var(--shadow-sm)] transition-transform hover:-translate-y-0.5"
              data-testid="link-back-to-foundation"
            >
              <ArrowLeft className="size-4" />
              Back to foundation
            </Link>
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <ShieldCheck className="size-4 text-accent" />
              Scope protected
            </span>
          </div>
        </section>
      </div>
    </AppShell>
  );
}