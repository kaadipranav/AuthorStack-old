import Link from "next/link";
import { ArrowRight, Check, BookOpen, Calendar, TrendingUp } from "lucide-react";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "AuthorStack - Unified Dashboard for Indie Authors",
  description: "A single pane of glass for indie authors: sales intelligence, launch readiness, and growth automations. Connect Amazon KDP, Gumroad, and Whop in minutes.",
  keywords: [
    "indie authors",
    "book publishing",
    "self-publishing",
    "sales tracking",
    "launch management",
    "author tools",
    "publishing dashboard",
    "royalty tracking",
    "book marketing",
    "author productivity"
  ],
  openGraph: {
    title: "AuthorStack - Unified Dashboard for Indie Authors",
    description: "A single pane of glass for indie authors: sales intelligence, launch readiness, and growth automations.",
    type: "website",
    locale: "en_US",
  },
};

const heroFeatures = [
  {
    icon: BookOpen,
    title: "Unified Dashboard",
    description: "One view for all your sales channels and launch progress",
  },
  {
    icon: Calendar,
    title: "Launch Playbooks",
    description: "Structured checklists to ship your next book on time",
  },
  {
    icon: TrendingUp,
    title: "Data Insights",
    description: "Real-time revenue tracking and competitive analysis",
  },
];

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
    <div className="min-h-screen bg-paper">
      {/* Hero Section */}
      <section className="container py-20 md:py-32">
        <div className="grid gap-16 lg:grid-cols-2 items-center">
          <div className="space-y-10">
            <div className="space-y-6">
              <p className="text-small uppercase tracking-widest text-burgundy font-semibold transition-colors duration-300 hover:text-burgundy/80">
                Indie authorship, operationalized
              </p>
              <h1 className="text-display text-ink leading-tight transition-all duration-300 hover:opacity-90">
                Keep every launch, sale, and superfAN in one calm workspace.
              </h1>
              <p className="text-2xl text-charcoal max-w-3xl transition-colors duration-300 hover:text-charcoal/80">
                Connect storefronts, automate ingestion, and run launches like a team of five. AuthorStack gives busy indie
                authors the cockpit they need to grow every series and membership.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-5">
              <button className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-medium text-surface transition-all duration-300 bg-burgundy rounded-lg hover:bg-burgundy/90 hover:scale-105">
                <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-in-out bg-burgundy/90 opacity-0 group-hover:opacity-100"></span>
                <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition-all duration-500 ease-in-out transform translate-x-24 rotate-45 translate-y-24 bg-surface opacity-10 group-hover:translate-x-0"></span>
                <span className="relative flex items-center text-lg font-semibold">
                  <Link href="/auth/sign-up" className="flex items-center">
                    Create your studio
                    <ArrowRight className="ml-3 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </span>
              </button>
              <Button asChild size="lg" variant="outline" className="border-stroke text-ink hover:bg-glass hover:scale-105 transition-all duration-300">
                <Link href="/auth/sign-in">I already have an account</Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-10">
              {heroFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={feature.title} 
                    className="text-center group cursor-pointer transition-all duration-300 hover:-translate-y-2"
                  >
                    <div className="mx-auto w-16 h-16 rounded-full bg-burgundy/10 flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-burgundy/20 group-hover:scale-110">
                      <Icon className="h-8 w-8 text-burgundy transition-all duration-300 group-hover:text-burgundy/80" />
                    </div>
                    <h3 className="text-2xl font-semibold text-ink mb-2 transition-colors duration-300 group-hover:text-burgundy">{feature.title}</h3>
                    <p className="text-base text-charcoal transition-colors duration-300 group-hover:text-charcoal/80">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="hidden lg:block relative">
            <div className="absolute inset-0 bg-burgundy/5 rounded-3xl transform rotate-3 transition-all duration-500 hover:rotate-6"></div>
            <div className="relative bg-surface border border-stroke rounded-3xl p-8 shadow-2xl transition-all duration-300 hover:shadow-3xl">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="h-5 w-32 bg-glass rounded transition-all duration-300 hover:bg-glass/80"></div>
                  <div className="h-10 w-10 rounded-full bg-burgundy/10 transition-all duration-300 hover:bg-burgundy/20"></div>
                </div>
                <div className="grid grid-cols-3 gap-5">
                  <div className="bg-glass border border-stroke rounded-xl p-5 transition-all duration-300 hover:bg-glass/80 hover:scale-105">
                    <div className="h-7 bg-burgundy/10 rounded mb-3 w-20 transition-all duration-300 hover:bg-burgundy/20"></div>
                    <div className="h-5 bg-glass rounded w-16 transition-all duration-300 hover:bg-glass/80"></div>
                  </div>
                  <div className="bg-glass border border-stroke rounded-xl p-5 transition-all duration-300 hover:bg-glass/80 hover:scale-105">
                    <div className="h-7 bg-burgundy/10 rounded mb-3 w-20 transition-all duration-300 hover:bg-burgundy/20"></div>
                    <div className="h-5 bg-glass rounded w-16 transition-all duration-300 hover:bg-glass/80"></div>
                  </div>
                  <div className="bg-glass border border-stroke rounded-xl p-5 transition-all duration-300 hover:bg-glass/80 hover:scale-105">
                    <div className="h-7 bg-burgundy/10 rounded mb-3 w-20 transition-all duration-300 hover:bg-burgundy/20"></div>
                    <div className="h-5 bg-glass rounded w-16 transition-all duration-300 hover:bg-glass/80"></div>
                  </div>
                </div>
                <div className="h-60 bg-glass border border-stroke rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-glass/80">
                  <span className="text-charcoal text-lg">Revenue Chart Visualization</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="container py-20 bg-surface border-y border-stroke">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h2 className="text-5xl font-bold text-ink mb-6 transition-all duration-300 hover:opacity-90">Everything you need to run a successful book launch</h2>
          <p className="text-2xl text-charcoal max-w-3xl mx-auto transition-colors duration-300 hover:text-charcoal/80">
            AuthorStack brings together all the tools indie authors need to manage their publishing business.
          </p>
        </div>
        
        <div className="grid gap-10 md:grid-cols-3">
          {valueProps.map((prop) => (
            <Card 
              key={prop.title} 
              className="border-stroke bg-surface h-full transition-all duration-300 hover:-translate-y-3 hover:shadow-xl"
            >
              <CardHeader>
                <CardTitle className="text-3xl text-ink transition-colors duration-300 hover:text-burgundy">{prop.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-charcoal transition-colors duration-300 hover:text-charcoal/80">{prop.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="container py-20">
        <div className="grid gap-16 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-5xl font-bold text-ink mb-6 transition-all duration-300 hover:opacity-90">Why authors switch to AuthorStack</h2>
            <p className="text-2xl text-charcoal mb-12 max-w-3xl transition-colors duration-300 hover:text-charcoal/80">
              Everything you need to run a book launch — minus the chaos.
            </p>
            
            <div className="space-y-8">
              {featureHighlights.map((feature) => (
                <div 
                  key={feature.title} 
                  className="p-8 rounded-2xl border border-stroke bg-glass transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <h3 className="text-3xl text-ink mb-4 transition-colors duration-300 hover:text-burgundy">{feature.title}</h3>
                  <ul className="space-y-3">
                    {feature.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-4">
                        <Check className="h-6 w-6 text-success mt-1 flex-shrink-0 transition-all duration-300 hover:scale-110" />
                        <span className="text-lg text-charcoal transition-colors duration-300 hover:text-charcoal/80">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-8">
            <Card className="border-stroke bg-surface transition-all duration-300 hover:shadow-xl">
              <CardHeader>
                <CardTitle className="text-3xl">Trusted by indie authors</CardTitle>
                <CardDescription className="text-lg">Publishing on their own terms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {testimonials.map((testimonial) => (
                  <blockquote 
                    key={testimonial.name} 
                    className="p-7 rounded-xl border border-stroke bg-glass transition-all duration-300 hover:shadow-lg"
                  >
                    <p className="text-lg italic text-ink mb-4 transition-colors duration-300 hover:text-charcoal">“{testimonial.quote}”</p>
                    <footer className="text-base font-medium text-charcoal transition-colors duration-300 hover:text-burgundy">
                      {testimonial.name} · {testimonial.role}
                    </footer>
                  </blockquote>
                ))}
              </CardContent>
            </Card>
            
            <Card className="border-stroke bg-surface transition-all duration-300 hover:shadow-xl">
              <CardHeader>
                <CardTitle className="text-3xl">Production-ready in a weekend</CardTitle>
                <CardDescription className="text-lg">Deploy with your own branding and launch playbooks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 rounded-xl border border-stroke bg-glass transition-all duration-300 hover:shadow-md">
                  <p className="text-small uppercase tracking-wider text-burgundy font-semibold mb-3 transition-colors duration-300 hover:text-burgundy/80">Getting started</p>
                  <p className="text-lg text-charcoal transition-colors duration-300 hover:text-charcoal/80">
                    Clone the repo, drop in Supabase, Upstash, Whop, and Resend keys, and push to Vercel.
                  </p>
                </div>
                <div className="p-6 rounded-xl border border-stroke bg-glass transition-all duration-300 hover:shadow-md">
                  <p className="text-small uppercase tracking-wider text-burgundy font-semibold mb-3 transition-colors duration-300 hover:text-burgundy/80">Launch ops</p>
                  <p className="text-lg text-charcoal transition-colors duration-300 hover:text-charcoal/80">
                    Checklists keep editors, cover designers, and VAs aligned with due dates and ownership.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20">
        <div className="max-w-4xl mx-auto text-center bg-surface border border-stroke rounded-3xl p-16 shadow-2xl transition-all duration-300 hover:shadow-3xl">
          <h2 className="text-5xl font-bold text-ink mb-6 transition-all duration-300 hover:opacity-90">Launch faster, write more</h2>
          <p className="text-2xl text-charcoal mb-12 max-w-3xl mx-auto transition-colors duration-300 hover:text-charcoal/80">
            Wire AuthorStack to your storefronts this weekend. When the next book drops, the dashboard, launch plan, and
            reader touchpoints are already in motion.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <button className="group relative inline-flex items-center justify-center px-10 py-5 overflow-hidden font-medium text-surface transition-all duration-300 bg-burgundy rounded-xl hover:bg-burgundy/90 hover:scale-105">
              <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-in-out bg-burgundy/90 opacity-0 group-hover:opacity-100"></span>
              <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition-all duration-500 ease-in-out transform translate-x-24 rotate-45 translate-y-24 bg-surface opacity-10 group-hover:translate-x-0"></span>
              <span className="relative flex items-center text-xl font-semibold">
                <Link href="/auth/sign-up">Create your studio</Link>
              </span>
            </button>
            <Button asChild size="lg" variant="outline" className="border-stroke text-ink hover:bg-glass hover:scale-105 transition-all duration-300 text-lg px-8 py-5">
              <Link href="/docs">See how deployment works</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
