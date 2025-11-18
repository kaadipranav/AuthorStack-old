import { env } from "@/lib/env";
import type { NavItem } from "@/types/navigation";

export const siteConfig = {
  name: "AuthorStack",
  description:
    "A single pane of glass for indie authors: sales intelligence, launch readiness, and growth automations.",
  url: env.NEXT_PUBLIC_APP_URL,
  supportEmail: "support@authorstack.app",
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
  author: "AuthorStack Team",
  links: {
    github: "https://github.com/authorstack",
    status: "https://status.authorstack.app",
    docs: "/docs",
  },
};

export const primaryNav: NavItem[] = [
  { title: "Product", href: "#product" },
  { title: "Pricing", href: "#pricing" },
  { title: "Security", href: "#security" },
  {
    title: "Leaderboard",
    href: "#leaderboard",
    badge: "Soon",
    featureFlag: "leaderboard",
  },
];

export const secondaryNav: NavItem[] = [
  {
    title: "Docs",
    href: "/docs",
  },
  {
    title: "Changelog",
    href: "https://github.com/authorstack/changelog",
    external: true,
  },
  {
    title: "Support",
    href: `mailto:${siteConfig.supportEmail}`,
  },
];

