import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { PublicShell } from "@/components/layout/public-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/lib/config/site";

const valueProps = [
  {
    title: "One dashboard for every storefront",
    description:
      "Connect Amazon KDP, Gumroad, and Whop in minutes. AuthorStack syncs royalties, subscriptions, and refunds into a single view tailored for indie authors.",
  },
  {
    title: "Launch playbooks that actually ship",
    description:
      "Plan ARCs, newsletter swaps, Discord drops, and price promos with collaborative checklists, reminders, and status tracking.",
  },
  {
    title: "Peace of mind ops",
    description:
      "Background workers retry failed jobs, `/api/healthz` blocks bad deploys, and Resend notifications keep your readers and team in the loop.",
  },
];

const testimonials = [
  {
    quote:
      "AuthorStack replaced the messy spreadsheet that my launch team and I fought over. We track royalties, ready our promos, and know the exact KPI for every release night.",
    name: "Casey Lin",
    role: "Romantasy author, 6x Amazon Top 100",
  },
  {
    quote:
      "My Gumroad bundles, Whop memberships, and KDP paperbacks finally live in one place. Launch checklists keep my VA on task while I write.",
    name: "Mahesh Rao",
    role: "Non-fiction indie author",
  },
];

const featureHighlights = [
  {
    title: "Real-time sales telemetry",
    details: [
      "Royalty and unit charts across KDP, Gumroad, Whop, CSV uploads",
      "Segment by series, format, territory, or launch campaign",
      "Flag anomalies with Upstash-backed alerting",
    ],
  },
  {
    title: "Launch operations",
    details: [
      "Reusable checklists with deadlines, owners, and attachments",
      "Promotional calendar synced to your timezone",
      "ARC feedback rollups and post-launch retrospectives",
    ],
  },
  {
    title: "Audience + membership health",
    details: [
      "Track Whop subscription churn and upgrade paths",
      "Capture Gumroad upsell performance and refunds",
      "Trigger Resend emails when membership status changes",
    ],
  },
];

export default function Home() {
  return (
    <PublicShell mainClassName="flex flex-col gap-20">
      <section className="grid items-start gap-12 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="space-y-7">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Indie authorship, operationalized</p>
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Keep every launch, sale, and superfAN in one calm workspace.
            </h1>
            <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
              Connect storefronts, automate ingestion, and run launches like a team of five. AuthorStack gives busy indie
              authors the cockpit they need to grow every series and membership.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/auth/sign-up">
                  Create your studio
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/auth/sign-in">I already have an account</Link>
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {valueProps.map((prop) => (
                <Card key={prop.title} className="border-primary/10 bg-card/80 shadow-md shadow-primary/5">
                  <CardHeader>
                    <CardTitle className="text-left text-base font-semibold text-primary/90">{prop.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-left text-sm text-muted-foreground">{prop.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <Card className="h-full border-primary/10 bg-card/80 shadow-xl shadow-primary/10">
            <CardHeader>
              <CardTitle>Why authors switch to AuthorStack</CardTitle>
              <CardDescription>Everything you need to run a book launch — minus the chaos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              {featureHighlights.map((feature) => (
                <div key={feature.title} className="rounded-2xl border border-primary/10 bg-background/70 p-4">
                  <p className="text-sm font-semibold text-primary/90">{feature.title}</p>
                  <ul className="mt-2 space-y-2 text-xs text-muted-foreground">
                    {feature.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-2">
                        <Check className="mt-0.5 size-3 text-primary" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr,1.1fr]">
          <Card className="border-primary/10 bg-card/80">
            <CardHeader>
              <CardTitle>Trusted by indie authors publishing on their own terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-left text-sm text-muted-foreground">
              {testimonials.map((testimonial) => (
                <blockquote key={testimonial.name} className="rounded-2xl border border-primary/10 bg-background/70 p-5">
                  <p className="text-sm italic text-muted-foreground">“{testimonial.quote}”</p>
                  <footer className="mt-3 text-xs font-medium text-foreground">
                    {testimonial.name} · {testimonial.role}
                  </footer>
                </blockquote>
              ))}
            </CardContent>
          </Card>
          <Card className="border-primary/10 bg-card/80">
            <CardHeader>
              <CardTitle>Production-ready in a weekend</CardTitle>
              <CardDescription>Deploy with your own branding, domains, and launch playbooks.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm text-muted-foreground">
              <div className="rounded-2xl border border-primary/10 bg-background/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">Getting started</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Clone the repo, drop in Supabase, Upstash, Whop, and Resend keys, and push to Vercel.
                </p>
              </div>
              <div className="rounded-2xl border border-primary/10 bg-background/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">Launch ops</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Checklists keep editors, cover designers, and VAs aligned with due dates and ownership.
                </p>
              </div>
              <div className="rounded-2xl border border-primary/10 bg-background/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">Revenue clarity</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Monitor launch-day sales in real time and capture recurring membership health without spreadsheets.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="rounded-3xl border border-primary/10 bg-card/80 p-10 text-center shadow-lg shadow-primary/10">
          <h2 className="text-3xl font-semibold">Launch faster, write more</h2>
          <p className="mt-4 text-sm text-muted-foreground">
            Wire AuthorStack to your storefronts this weekend. When the next book drops, the dashboard, launch plan, and
            reader touchpoints are already in motion.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/auth/sign-up">Create your studio</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/docs">See how deployment works</Link>
            </Button>
          </div>
        </section>
    </PublicShell>
  );
}
