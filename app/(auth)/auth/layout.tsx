import Image from "next/image";
import type { ReactNode } from "react";

import { PublicShell } from "@/components/layout/public-shell";

const highlightItems = [
  "Supabase-authenticated sessions with RLS protection",
  "Ingestion queue visibility with Upstash QStash",
  "Launch checklist automation and reminders",
  "Production-ready CI/CD with GitHub Actions",
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <PublicShell
      hideAuthLinks
      mainClassName="flex min-h-[calc(100vh-160px)] flex-col justify-center gap-12 pb-24"
    >
      <div className="grid gap-10 rounded-3xl border border-primary/10 bg-card/80 p-6 shadow-2xl shadow-primary/10 lg:grid-cols-[1.1fr,0.9fr] lg:p-10">
        <aside className="relative hidden overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 text-sm text-muted-foreground lg:flex lg:flex-col lg:justify-between">
          <div className="space-y-8">
            <div className="relative h-12 w-12">
              <Image
                src="/logos/Light_logo.png"
                alt="AuthorStack logo"
                fill
                priority
                className="object-contain dark:hidden"
              />
              <Image
                src="/logos/Dark_logo.png"
                alt="AuthorStack logo"
                fill
                priority
                className="hidden object-contain dark:block"
              />
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">AuthorStack Launch Studio</p>
              <h2 className="text-2xl font-semibold text-foreground">
                Sign in to orchestrate launches, ingest royalties, and monitor subscriber health.
              </h2>
              <p>
                Every screen is wired to Supabase, Whop, Upstash, and Resend. Configure environment variables, deploy to
                Vercel, and your studio is ready to ship.
              </p>
            </div>
            <div className="space-y-3">
              {highlightItems.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl border border-primary/20 bg-card/70 p-3">
                  <span className="mt-1 inline-flex size-5 items-center justify-center rounded-full bg-primary/15 text-primary">
                    •
                  </span>
                  <p className="text-sm text-foreground/90">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-primary/10 bg-card/70 p-4 text-xs text-muted-foreground">
            <p className="font-semibold uppercase tracking-wide text-primary">On-call promise</p>
            <p className="mt-1">
              Health checks run before every deploy and ingestion queue telemetry is routed to Slack. If a sync fails, the
              team investigates before you notice.
            </p>
          </div>
          <div className="pointer-events-none absolute -right-16 bottom-12 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-10 top-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
        </aside>
        <section className="flex items-center justify-center">
          <div className="w-full max-w-md space-y-8 rounded-2xl border border-primary/10 bg-background p-8 shadow-xl shadow-primary/10">
            {children}
          </div>
        </section>
      </div>
    </PublicShell>
  );
}

