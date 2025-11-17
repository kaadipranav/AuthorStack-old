import { env } from "@/lib/env";
import type { FeatureFlag, FeatureFlagMap } from "@/types/features";

const fallbackFlags: FeatureFlagMap = {
  leaderboard: false,
  mascot: false,
  community: false,
  distribution: false,
};

function parseFlags(raw: string | undefined): FeatureFlagMap {
  try {
    if (!raw) return fallbackFlags;
    const parsed = JSON.parse(raw) as Partial<FeatureFlagMap>;
    return { ...fallbackFlags, ...parsed };
  } catch {
    return fallbackFlags;
  }
}

export const featureFlags = parseFlags(env.NEXT_PUBLIC_FEATURES);

export function isFeatureEnabled(flag: FeatureFlag) {
  return Boolean(featureFlags[flag]);
}

export const featureRoadmap: ReadonlyArray<{
  key: FeatureFlag;
  title: string;
  description: string;
  status: "available" | "beta" | "planned";
}> = [
  {
    key: "leaderboard",
    title: "Author Leaderboard",
    description: "ProductHunt-style rankings to spotlight high-performing launches.",
    status: featureFlags.leaderboard ? "beta" : "planned",
  },
  {
    key: "mascot",
    title: "AI Mascot",
    description: "Conversational assistant that audits funnels and suggests next actions.",
    status: featureFlags.mascot ? "beta" : "planned",
  },
  {
    key: "community",
    title: "Community Hub",
    description: "Curated spaces for launch logs, critiques, and accountability groups.",
    status: featureFlags.community ? "beta" : "planned",
  },
  {
    key: "distribution",
    title: "Distribution Automations",
    description: "One-click handoff to POD, retailer feeds, and fulfillment partners.",
    status: featureFlags.distribution ? "beta" : "planned",
  },
];

