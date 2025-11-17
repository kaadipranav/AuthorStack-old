import { env } from "@/lib/env";

const WHOP_API_BASE = "https://api.whop.com/api/v3";

export type WhopWebhookPayload = {
  id: string;
  event: string;
  data: Record<string, unknown>;
};

export async function fetchWhop<T>(
  path: string,
  init?: RequestInit & { method?: "GET" | "POST" | "PATCH" | "DELETE" }
): Promise<T> {
  if (!env.WHOP_API_KEY) {
    throw new Error("WHOP_API_KEY missing. Add it to enable billing sync.");
  }

  const response = await fetch(`${WHOP_API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.WHOP_API_KEY}`,
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Whop API error (${response.status}): ${errorBody}`);
  }

  return response.json() as Promise<T>;
}

