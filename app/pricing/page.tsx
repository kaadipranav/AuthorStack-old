"use client";

import Link from "next/link";
import type { Route } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DimModeToggle } from "@/components/ui/dim-mode-toggle";
import { Logo } from "@/components/ui/logo";
import { Check, ArrowRight, Sparkles, X, Zap, Crown } from "lucide-react";

const plans = [
  {
    name: "Free",
    description: "Perfect for getting started",
    price: "$0",
    period: "forever",
    icon: Zap,
    features: [
      { text: "2 platform connections", included: true },
      { text: "Basic sales dashboard", included: true },
      { text: "Launch checklists", included: true },
      { text: "Community access", included: true },
      { text: "Book management", included: true },
      { text: "AI chat (5 messages/day)", included: true },
      { text: "Revenue forecasting", included: false },
      { text: "Competitor tracking", included: false },
      { text: "A/B testing tools", included: false },
      { text: "Priority support", included: false },
    ],
    cta: "Get Started Free",
    href: "/auth/sign-up?plan=free" as Route,
    popular: false,
  },
  {
    name: "Pro",
    description: "For serious indie authors",
    price: "$29",
    period: "/month",
    icon: Crown,
    features: [
      { text: "Unlimited platform connections", included: true },
      { text: "Advanced analytics dashboard", included: true },
      { text: "Launch checklists + calendar", included: true },
      { text: "Community access + badges", included: true },
      { text: "Unlimited book management", included: true },
      { text: "AI chat assistant (unlimited)", included: true },
      { text: "Revenue forecasting & predictions", included: true },
      { text: "Competitor tracking (25 books)", included: true },
      { text: "A/B testing tools", included: true },
      { text: "Email support (24h response)", included: true },
    ],
    cta: "Start 14-Day Free Trial",
    href: "/auth/sign-up?plan=pro" as Route,
    popular: true,
  },
];

const faqs = [
  {
    question: "Can I switch plans anytime?",
    answer: "Yes! You can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, your new rate starts at the next billing cycle.",
  },
  {
    question: "What platforms do you support?",
    answer: "We support Amazon KDP, Gumroad, Payhip, Lulu, Kobo Writing Life, Apple Books, Google Play Books, Barnes & Noble Press, and more. We're constantly adding new integrations.",
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We use bank-level encryption, never share your data with third parties, and our AI models don't train on your private information. All data is stored in SOC 2 compliant infrastructure.",
  },
  {
    question: "What's the AI assistant?",
    answer: "Our AI assistant is a context-aware publishing consultant that knows your books, sales history, and market trends. Ask it anything about your publishing business and get instant, data-backed answers.",
  },
  {
    question: "Do you offer refunds?",
    answer: "Yes, we offer a 14-day money-back guarantee on all paid plans. If you're not satisfied, contact us for a full refund, no questions asked.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="border-b border-stroke bg-surface/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-8 w-8" />
            <span className="font-serif text-xl text-ink">AuthorStack</span>
          </Link>
          <div className="flex items-center gap-4">
            <DimModeToggle />
            <Button asChild variant="outline" className="border-stroke">
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
            <Button asChild className="bg-burgundy hover:bg-burgundy/90 text-surface">
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 bg-burgundy/10 border border-burgundy/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-burgundy" />
            <span className="text-sm font-semibold text-burgundy">Simple, transparent pricing</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ink mb-6">
            Choose the plan that fits<br />your publishing journey
          </h1>
          <p className="text-xl text-charcoal max-w-2xl mx-auto">
            Start free, upgrade when you&apos;re ready. All plans include our core platform features.
            No credit card required for free tier.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8">
            {plans.map((plan) => {
              const Icon = plan.icon;
              return (
                <Card
                  key={plan.name}
                  className={`relative border-2 ${
                    plan.popular
                      ? "border-burgundy shadow-xl scale-105"
                      : "border-stroke hover:border-burgundy/30"
                  } transition-all duration-300`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-burgundy text-surface px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <div className={`w-14 h-14 rounded-xl ${plan.popular ? "bg-burgundy" : "bg-burgundy/10"} flex items-center justify-center mx-auto mb-4`}>
                      <Icon className={`h-7 w-7 ${plan.popular ? "text-surface" : "text-burgundy"}`} />
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="pt-4">
                      <span className="text-4xl font-bold text-ink">{plan.price}</span>
                      <span className="text-charcoal">{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          {feature.included ? (
                            <Check className="h-5 w-5 text-forest flex-shrink-0 mt-0.5" />
                          ) : (
                            <X className="h-5 w-5 text-charcoal/40 flex-shrink-0 mt-0.5" />
                          )}
                          <span className={feature.included ? "text-ink" : "text-charcoal/60"}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      asChild
                      className={`w-full ${
                        plan.popular
                          ? "bg-burgundy hover:bg-burgundy/90 text-surface"
                          : "bg-surface border-2 border-stroke text-ink hover:bg-glass"
                      }`}
                      size="lg"
                    >
                      <Link href={plan.href}>
                        {plan.cta}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Annual discount note */}
          <p className="text-center text-charcoal mt-8">
            💡 Save 20% with annual billing — contact us for annual plans
          </p>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-20 px-6 bg-surface border-y border-stroke">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-serif text-3xl text-ink text-center mb-12">
            Compare all features
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stroke">
                  <th className="text-left py-4 px-4 font-medium text-charcoal">Feature</th>
                  <th className="text-center py-4 px-4 font-medium text-charcoal">Free</th>
                  <th className="text-center py-4 px-4 font-medium text-burgundy">Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stroke">
                <tr>
                  <td className="py-4 px-4 text-ink">Platform connections</td>
                  <td className="py-4 px-4 text-center text-charcoal">2</td>
                  <td className="py-4 px-4 text-center text-ink font-medium">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-ink">AI chat messages</td>
                  <td className="py-4 px-4 text-center text-charcoal">5/day</td>
                  <td className="py-4 px-4 text-center text-ink font-medium">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-ink">Revenue forecasting</td>
                  <td className="py-4 px-4 text-center text-charcoal">—</td>
                  <td className="py-4 px-4 text-center"><Check className="h-5 w-5 text-forest mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-ink">Competitor tracking</td>
                  <td className="py-4 px-4 text-center text-charcoal">—</td>
                  <td className="py-4 px-4 text-center text-ink font-medium">25 books</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-ink">A/B testing</td>
                  <td className="py-4 px-4 text-center text-charcoal">—</td>
                  <td className="py-4 px-4 text-center"><Check className="h-5 w-5 text-forest mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-ink">Calendar & scheduling</td>
                  <td className="py-4 px-4 text-center text-charcoal">Basic</td>
                  <td className="py-4 px-4 text-center"><Check className="h-5 w-5 text-forest mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-ink">Leaderboard badges</td>
                  <td className="py-4 px-4 text-center text-charcoal">—</td>
                  <td className="py-4 px-4 text-center"><Check className="h-5 w-5 text-forest mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-ink">Support</td>
                  <td className="py-4 px-4 text-center text-charcoal">Community</td>
                  <td className="py-4 px-4 text-center text-ink font-medium">Email (24h)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-serif text-3xl text-ink text-center mb-12">
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-stroke">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-charcoal">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-burgundy">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-surface mb-6">
            Ready to take control of your publishing business?
          </h2>
          <p className="text-xl text-surface/80 mb-8">
            Join thousands of indie authors using AI to grow their book sales.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-surface text-burgundy hover:bg-surface/90 px-8 py-6 text-lg"
            >
              <Link href="/auth/sign-up">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-surface/30 text-surface hover:bg-surface/10 px-8 py-6 text-lg"
            >
              <Link href="/docs">View Documentation</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-surface border-t border-stroke">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo className="h-6 w-6" />
            <span className="font-serif text-ink">AuthorStack</span>
          </div>
          <p className="text-sm text-charcoal">
            © {new Date().getFullYear()} AuthorStack. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-charcoal">
            <Link href="/docs" className="hover:text-ink">Docs</Link>
            <Link href="/pricing" className="hover:text-ink">Pricing</Link>
            <Link href="/community" className="hover:text-ink">Community</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
