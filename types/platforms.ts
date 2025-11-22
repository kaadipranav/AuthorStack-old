export type PlatformProvider = "amazon_kdp" | "gumroad" | "whop" | "shopify" | "payhip" | "lulu" | "kobo" | "apple_books" | "google_play" | "bn_press";

export interface PlatformConnection {
  id: string;
  provider: PlatformProvider;
  status: "connected" | "pending" | "error";
  lastSyncedAt?: string;
}

