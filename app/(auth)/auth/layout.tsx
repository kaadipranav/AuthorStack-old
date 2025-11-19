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
      <div className="grid gap-10 rounded-3xl border border-burgundy/10 bg-surface/80 p-6 shadow-2xl shadow-burgundy/10 lg:grid-cols-[1.1fr,0.9fr] lg:p-10">
        <aside className="relative hidden overflow-hidden rounded-2xl border border-burgundy/10 bg-gradient-to-br from-burgundy/10 via-burgundy/5 to-paper p-8 text-sm text-charcoal lg:flex lg:flex-col lg:justify-between">
          <div className="space-y-8">
            <div className="relative h-16 w-16 transition-transform duration-300 hover:scale-105">
              <Image
                src="/logos/Light_logo.png"
                alt="AuthorStack logo"
                fill
                priority
                className="object-contain"
              />
            </div>
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-burgundy transition-colors duration-300 hover:text-burgundy/80">AuthorStack Launch Studio</p>
              <h2 className="text-3xl font-semibold text-ink leading-tight">
                Sign in to orchestrate launches, ingest royalties, and monitor subscriber health.
              </h2>
              <p className="transition-colors duration-300 hover:text-charcoal/80">
                Every screen is wired to Supabase, Whop, Upstash, and Resend. Configure environment variables, deploy to
                Vercel, and your studio is ready to ship.
              </p>
            </div>
            <div className="space-y-4">
              {highlightItems.map((item) => (
                <div 
                  key={item} 
                  className="flex items-start gap-3 rounded-xl border border-burgundy/20 bg-surface/70 p-3 transition-all duration-300 hover:border-burgundy/40 hover:bg-surface/90 hover:shadow-md"
                >
                  <span className="mt-1 inline-flex size-5 items-center justify-center rounded-full bg-burgundy/15 text-burgundy transition-all duration-300 hover:bg-burgundy/25">
                    •
                  </span>
                  <p className="text-sm text-ink/90 transition-colors duration-300 hover:text-ink">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-burgundy/10 bg-surface/70 p-4 text-xs text-charcoal transition-all duration-300 hover:border-burgundy/20 hover:bg-surface/80">
            <p className="font-semibold uppercase tracking-wide text-burgundy transition-colors duration-300 hover:text-burgundy/80">On-call promise</p>
            <p className="mt-1 transition-colors duration-300 hover:text-charcoal/80">
              Health checks run before every deploy and ingestion queue telemetry is routed to Slack. If a sync fails, the
              team investigates before you notice.
            </p>
          </div>
          <div className="pointer-events-none absolute -right-16 bottom-12 h-56 w-56 rounded-full bg-burgundy/10 blur-3xl transition-all duration-500 hover:opacity-70" />
          <div className="pointer-events-none absolute -left-10 top-10 h-40 w-40 rounded-full bg-burgundy/5 blur-3xl transition-all duration-500 hover:opacity-70" />
        </aside>
        <section className="flex items-center justify-center">
          <div className="w-full max-w-md space-y-8 rounded-2xl border border-burgundy/10 bg-surface p-8 shadow-xl shadow-burgundy/10 transition-all duration-300 hover:shadow-2xl">
            {children}
          </div>
        </section>
      </div>
    </PublicShell>
  );
}