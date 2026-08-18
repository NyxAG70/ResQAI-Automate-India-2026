import type { ReactNode } from 'react';
import { ArrowUpRight, CircleDot, ShieldCheck } from 'lucide-react';
import { Link } from 'wouter';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="noise-layer paper-grid min-h-[100dvh] bg-background">
      <header className="border-b border-border/80 bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-5 sm:px-8 lg:px-10">
          <Link
            href="/"
            className="group flex items-center gap-3"
            data-testid="link-brand-home"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:-rotate-3">
              <ShieldCheck className="size-5" strokeWidth={2.4} />
            </span>
            <span>
              <span className="block font-display text-[1.35rem] font-bold leading-none tracking-[-0.04em]">
                ResQAI
              </span>
              <span className="mt-1 block font-mono-ui text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                response intelligence
              </span>
            </span>
          </Link>

          <nav
            className="flex items-center gap-1.5 sm:gap-2"
            aria-label="Primary navigation"
          >
            <Link
              href="/"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              data-testid="link-navigation-foundation"
            >
              Foundation
            </Link>
            <Link
              href="/report"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              data-testid="link-navigation-report"
            >
              Report preview
            </Link>
            <span
              className="ml-1 hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-2 font-mono-ui text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground sm:flex"
              data-testid="status-prototype"
            >
              <CircleDot className="size-3 text-accent" strokeWidth={2.5} />
              Prototype
            </span>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="mx-auto flex max-w-6xl flex-col gap-2 border-t border-border/80 px-5 py-7 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
        <span className="font-mono-ui uppercase tracking-[0.16em]">
          ResQAI / foundation build
        </span>
        <span data-testid="text-human-review">
          Built for human responders. Human review stays in the loop.
        </span>
      </footer>
    </div>
  );
}

export function ArrowLink({
  href,
  children,
  testId,
}: {
  href: string;
  children: ReactNode;
  testId: string;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-[0_5px_0_hsl(var(--primary-border))] transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
      data-testid={testId}
    >
      {children}
      <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  );
}