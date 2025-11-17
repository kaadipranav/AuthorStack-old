import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  LineChart,
  ShieldCheck,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { featureRoadmap } from "@/lib/config/features";
import { integrationVendors } from "@/lib/integrations/integrations";
import { siteConfig } from "@/lib/config/site";

const stats = [
  { label: "Connected platforms", value: "12", helper: "Amazon, Gumroad, Whop & more" },
  { label: "Sync reliability", value: "99.95%", helper: "Backed by Upstash retries" },
  { label: "Deploy-ready", value: "10 min", helper: "Only env vars required" },
];

const readinessChecklist = [
  "Supabase auth & profile migrations shipped",
  "Webhook-ready Whop billing helpers",
  "Health check covering DB + Redis + integrations",
  "Dark/light theme + responsive shell",
];

export default function Home() {
  return (
    <div className="space-y-16 pb-16 pt-10 md:pt-14">
      <section className="container grid gap-10 lg:grid-cols-[1.15fr,0.85fr]">
        <div className="space-y-8">
          <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Zap className="size-3 text-primary" />
            Production-ready out of the box
          </span>
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              {siteConfig.name}: Ship every book launch with confidence.
            </h1>
            <p className="text-lg text-muted-foreground">
              Centralize sales telemetry, launch runbooks, payments, and notifications without stitching together five dashboards. AuthorStack is wired for Supabase auth, Whop subscriptions, Upstash Redis, and Resend from day one.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href="/signup">
                Enter Launch Studio
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/docs">
                Review architecture
                <ShieldCheck className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {readinessChecklist.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-lg border bg-card/60 p-4">
                <CheckCircle2 className="mt-0.5 size-5 text-primary" />
                <p className="text-sm font-medium text-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border bg-muted/30 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <LineChart className="size-4" />
            Operational scorecard
          </div>
          <div className="mt-6 grid gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-lg border bg-background/80 p-4 shadow-sm">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-semibold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.helper}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-xl border bg-background/50 p-4">
            <p className="text-sm font-semibold">Health endpoints</p>
            <p className="text-xs text-muted-foreground">`/api/healthz` checks Supabase, Redis, Whop, and Resend wiring before every deploy.</p>
          </div>
        </div>
      </section>

      <section id="product" className="container space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase text-primary">Integrations that already work</p>
          <h2 className="text-2xl font-semibold">First-class tooling, zero glue code.</h2>
          <p className="text-muted-foreground">
            The integration surface is abstracted into dedicated helpers so you can focus on product logic rather than SDK plumbing.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {integrationVendors.map((vendor) => (
            <div key={vendor.name} className="rounded-xl border bg-card/70 p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-primary">{vendor.category}</p>
                  <h3 className="text-lg font-semibold">{vendor.name}</h3>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link href={vendor.url} target="_blank" rel="noreferrer">
                    Docs
                    <ArrowRight className="ml-1 size-4" />
                  </Link>
                </Button>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{vendor.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="leaderboard" className="container space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-primary">Roadmap</p>
            <h2 className="text-2xl font-semibold">Feature flags baked into the architecture.</h2>
          </div>
          <p className="max-w-xl text-sm text-muted-foreground">
            Toggle future modules through `NEXT_PUBLIC_FEATURES` without touching code. Every feature lives inside its own slice under `features/`.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {featureRoadmap.map((feature) => (
            <div key={feature.key} className="rounded-xl border bg-card/60 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold capitalize">{feature.title}</h3>
                <span className="text-xs font-medium uppercase text-muted-foreground">
                  {feature.status}
                </span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
