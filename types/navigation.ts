import type { FeatureFlag } from "./features";

export type NavIntent = "primary" | "secondary" | "footer";

export interface NavItem {
  title: string;
  href: string;
  description?: string;
  external?: boolean;
  intent?: NavIntent;
  badge?: string;
  featureFlag?: FeatureFlag;
}

