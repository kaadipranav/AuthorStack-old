"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, TrendingUp, Calendar, Check, ArrowRight } from "lucide-react";

// Mock book covers data
const bookCovers = [
  {
    id: 1,
    title: "The Silent Garden",
    cover: "/silent_garden_cover.png",
    badge: "#2 in YA Debuts",
    stacks: 147,
  },
  {
    id: 2,
    title: "Midnight Protocol",
    cover: "/midnight_protocol_cover.png",
    badge: "#1 in Techno-thriller",
    stacks: 289,
  },
  {
    id: 3,
    title: "Echoes of Tomorrow",
    cover: "/echoes_tomorrow_cover.png",
    badge: "#5 in Sci-Fi Romance",
    stacks: 203,
  },
];

// Live feed messages
const feedMessages = [
  "> syncing gumroad • 12 new sales • €284.30 earned",
  "> kobo report parsed • 3 books updated • momentum ↑ 12%",
  "> amazon kdp • 47 units sold • $156.89 royalties",
];

const features = [
  {
    icon: BookOpen,
    title: "Unified Dashboard",
    description: "Connect Amazon KDP, Gumroad, Kobo, Apple Books, and 9+ platforms. One view for all your sales channels.",
  },
  {
    icon: Calendar,
    title: "Launch Playbooks",
    description: "Structured checklists with deadlines, owners, and reminders. Ship your next book on time, every time.",
  },
  {
    icon: TrendingUp,
    title: "Real-Time Analytics",
    description: "Track revenue, units sold, and momentum across all platforms. Spot trends before they become problems.",
  },
];

const testimonials = [
  {
    quote: "AuthorStack replaced the messy spreadsheet that my launch team and I fought over. We track royalties, ready our promos, and know the exact KPI for every release night.",
    name: "Casey Lin",
    role: "Romantasy author, 6x Amazon Top 100",
  },
  {
    quote: "My Gumroad bundles, Whop memberships, and KDP paperbacks finally live in one place. Launch checklists keep my VA on task while I write.",
    name: "Mahesh Rao",
    role: "Non-fiction indie author",
  },
  {
    quote: "The platform breakdown shows me exactly where my readers are buying. I can finally make data-driven decisions about where to focus my marketing.",
    name: "Sarah Chen",
    role: "Sci-fi series author",
  },
];

const platforms = [
  "Amazon KDP",
  "Gumroad",
  "Payhip",
  "Lulu",
  "Kobo Writing Life",
  "Apple Books",
  "Google Play Books",
  "Barnes & Noble Press",
  "Whop",
];

export default function LandingPage() {
  const [currentFeedIndex, setCurrentFeedIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);
  const [currentBookIndex, setCurrentBookIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Track scroll position for watermark rotation
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Typewriter effect
  useEffect(() => {
    const currentMessage = feedMessages[currentFeedIndex];

    if (isTyping && displayedText.length < currentMessage.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(currentMessage.slice(0, displayedText.length + 1));
      }, 45);
      return () => clearTimeout(timeout);
    } else if (isTyping && displayedText.length === currentMessage.length) {
      const timeout = setTimeout(() => {
        setIsTyping(false);
        setDisplayedText("");
        setCurrentFeedIndex((prev) => (prev + 1) % feedMessages.length);
        setIsTyping(true);
      }, 2500);
      return () => clearTimeout(timeout);
    }
  }, [displayedText, isTyping, currentFeedIndex]);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Book carousel auto-rotate
  useEffect(() => {
    if (!isHovering) {
      const interval = setInterval(() => {
        setCurrentBookIndex((prev) => (prev + 1) % bookCovers.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [isHovering]);

  const currentBook = bookCovers[currentBookIndex];
  const isComplete = displayedText.length === feedMessages[currentFeedIndex].length;

  return (
    <div className="bg-paper">

      {/* Ink-blot watermark - bottom right */}
      <div
        className="fixed bottom-8 right-8 pointer-events-none z-0 opacity-10 transition-transform duration-100"
        style={{
          transform: scrollY > 0 ? `rotate(${(scrollY / 200) * 0.5}deg)` : undefined,
        }}
      >
        <svg
          width="80"
          height="80"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M50 10C35 10 25 20 25 35C25 45 30 50 35 55C32 58 30 62 30 67C30 75 35 82 45 85C42 88 40 92 40 97C40 100 42 102 45 102C48 102 50 100 50 97C50 92 48 88 45 85C55 82 60 75 60 67C60 62 58 58 55 55C60 50 65 45 65 35C65 20 55 10 50 10Z"
            fill="#11110F"
            opacity="0.8"
          />
          <circle cx="50" cy="35" r="8" fill="#11110F" opacity="0.6" />
          <ellipse cx="45" cy="67" rx="6" ry="8" fill="#11110F" opacity="0.5" />
          <path
            d="M35 45C38 48 42 50 46 50C50 50 54 48 57 45"
            stroke="#11110F"
            strokeWidth="2"
            opacity="0.4"
          />
        </svg>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex flex-col justify-center">
        <div className="container mx-auto px-6 py-20 max-w-6xl">

          {/* Live Data Feed */}
          <div className="mb-16" aria-live="polite" aria-atomic="true">
            <div className="font-mono text-sm md:text-base h-20 flex items-center bg-surface/50 backdrop-blur-sm border border-stroke rounded-lg px-6 shadow-sm">
              <span
                className={`transition-colors duration-300 ${isComplete ? "text-ink" : "text-charcoal"
                  }`}
              >
                {displayedText}
                {showCursor && <span className="inline-block w-2 h-4 bg-burgundy ml-1 animate-pulse" />}
              </span>
            </div>
          </div>

          {/* Serif headline */}
          <h1
            className="font-serif text-5xl md:text-6xl lg:text-7xl text-ink mb-6 leading-[1.1] tracking-tight"
            style={{ fontFamily: "Merriweather, serif" }}
          >
            Data That Tells<br />Your Story.
          </h1>

          <p className="text-xl md:text-2xl text-charcoal mb-12 max-w-3xl leading-relaxed">
            A modern editorial dashboard for indie authors. Track sales, manage launches, and grow your publishing business with calm, authoritative precision.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-20">
            <Button
              asChild
              size="lg"
              className="bg-burgundy hover:bg-burgundy/90 text-surface px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/auth/sign-up">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-stroke text-ink hover:bg-glass px-8 py-6 text-lg transition-all duration-300"
            >
              <Link href="/auth/sign-in">Already have an account?</Link>
            </Button>
          </div>

          {/* Dynamic book carousel */}
          <div className="flex justify-center">
            <div
              className="relative group cursor-pointer"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onFocus={() => setIsHovering(true)}
              onBlur={() => setIsHovering(false)}
              tabIndex={0}
              role="img"
              aria-label={`Book cover: ${currentBook.title}`}
            >
              <div
                className="w-64 h-96 md:w-80 md:h-[480px] bg-gradient-to-br from-surface to-glass border-2 border-stroke rounded-xl shadow-lg transition-all duration-600"
                style={{
                  transform: isHovering ? "translateY(-8px)" : "translateY(0)",
                  boxShadow: isHovering
                    ? "0 20px 40px rgba(17,17,15,0.12)"
                    : "0 8px 16px rgba(17,17,15,0.06)",
                  transitionTimingFunction: "cubic-bezier(.2,.9,.2,1)",
                }}
              >
                <div className="w-full h-full flex items-center justify-center text-charcoal rounded-xl">
                  <div className="text-center p-8">
                    <div className="text-7xl mb-6">📚</div>
                    <div className="font-serif text-xl font-semibold text-ink">{currentBook.title}</div>
                  </div>
                </div>
              </div>

              <div
                className="absolute -top-4 -right-4 bg-amber text-ink px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg border-2 border-surface"
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                {currentBook.badge} • {currentBook.stacks} Stacks
              </div>

              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 flex gap-2">
                {bookCovers.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBookIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${index === currentBookIndex ? "bg-burgundy w-8" : "bg-stroke w-2"
                      }`}
                    aria-label={`View book ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 bg-surface border-y border-stroke py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="font-serif text-4xl md:text-5xl text-ink mb-6 leading-tight">
              Everything you need to run<br />a successful book launch
            </h2>
            <p className="text-xl text-charcoal max-w-2xl mx-auto">
              AuthorStack brings together all the tools indie authors need to manage their publishing business.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="border-2 border-stroke bg-surface hover:shadow-xl hover:border-burgundy/20 transition-all duration-300 hover:-translate-y-2 group"
                >
                  <CardHeader className="pb-4">
                    <div className="w-14 h-14 rounded-xl bg-burgundy/10 flex items-center justify-center mb-6 group-hover:bg-burgundy/20 transition-colors duration-300">
                      <Icon className="h-7 w-7 text-burgundy" />
                    </div>
                    <CardTitle className="text-2xl group-hover:text-burgundy transition-colors duration-300">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-charcoal leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-ink mb-4">
              Connect all your platforms
            </h2>
            <p className="text-lg text-charcoal">
              9 integrations and counting. One dashboard to rule them all.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {platforms.map((platform) => (
              <div
                key={platform}
                className="bg-surface border border-stroke rounded-lg p-4 text-center hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <p className="text-sm font-medium text-ink">{platform}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 bg-surface border-y border-stroke py-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl text-ink mb-4">
              Trusted by indie authors
            </h2>
            <p className="text-lg text-charcoal">
              Publishing on their own terms
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="border-stroke bg-surface">
                <CardContent className="pt-6">
                  <p className="text-ink italic mb-4">"{testimonial.quote}"</p>
                  <div className="border-t border-stroke pt-4">
                    <p className="font-medium text-ink">{testimonial.name}</p>
                    <p className="text-sm text-charcoal">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="font-serif text-3xl md:text-5xl text-ink mb-6">
            Launch faster, write more
          </h2>
          <p className="text-xl text-charcoal mb-12 max-w-2xl mx-auto">
            Wire AuthorStack to your storefronts this weekend. When the next book drops, the dashboard, launch plan, and reader touchpoints are already in motion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-burgundy hover:bg-burgundy/90 text-surface px-8 py-6 text-lg"
            >
              <Link href="/auth/sign-up">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-stroke text-ink hover:bg-glass px-8 py-6 text-lg"
            >
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Bottom CTA Bar - Sticky */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-surface/95 border-t border-stroke py-4 px-6 z-50 backdrop-blur-sm"
      >
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div
            className="font-serif text-ink text-sm md:text-base"
            style={{ fontFamily: "Merriweather, serif" }}
          >
            Connect your first platform
          </div>

          <div className="flex gap-3">
            <Button
              asChild
              className="bg-burgundy hover:bg-burgundy/90 text-surface px-6 py-2 rounded-lg font-medium"
            >
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-stroke text-ink hover:bg-glass px-6 py-2 rounded-lg font-medium"
            >
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
          </div>

          <div
            className="flex items-center gap-2 text-xs text-charcoal"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            <span className="w-2 h-2 rounded-full bg-forest animate-pulse" />
            Last sync: 4m ago
          </div>
        </div>
      </div>
    </div>
  );
}
