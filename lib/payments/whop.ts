import { env } from "@/lib/env";

const WHOP_API_BASE = "https://api.whop.com/api/v3";

export type WhopWebhookPayload = {
  id: string;
  event: string;
  data: Record<string, unknown>;
};

export interface WhopCustomer {
  id: string;
  email: string;
  name?: string;
  created_at: string;
}

export interface WhopMembership {
  id: string;
  customer_id: string;
  plan_id: string;
  status: string;
  current_period_end?: string;
  created_at: string;
}

export async function fetchWhop<T>(
  path: string,
  init?: RequestInit & { method?: "GET" | "POST" | "PATCH" | "DELETE" }
): Promise<T> {
  if (!env.WHOP_API_KEY) {
    throw new Error("WHOP_API_KEY missing. Add it to enable billing sync.");
  }

  try {
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
      console.error(`[Whop] API error (${response.status}):`, errorBody);
      throw new Error(`Whop API error (${response.status}): ${errorBody}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error("[Whop] Fetch error:", error);
    throw error;
  }
}

export async function fetchWhopCustomer(customerId: string): Promise<WhopCustomer> {
  console.log(`[Whop] Fetching customer: ${customerId}`);
  const customer = await fetchWhop<WhopCustomer>(`/customers/${customerId}`);
  console.log(`[Whop] ✓ Customer fetched: ${customer.email}`);
  return customer;
}

export async function fetchWhopMemberships(customerId: string): Promise<WhopMembership[]> {
  console.log(`[Whop] Fetching memberships for customer: ${customerId}`);
  const response = await fetchWhop<{ data: WhopMembership[] }>(
    `/memberships?customer_id=${customerId}`
  );
  const memberships = response.data || [];
  console.log(`[Whop] ✓ Fetched ${memberships.length} memberships`);
  return memberships;
}

export async function fetchWhopMembershipDetails(
  membershipId: string
): Promise<WhopMembership> {
  console.log(`[Whop] Fetching membership details: ${membershipId}`);
  const membership = await fetchWhop<WhopMembership>(`/memberships/${membershipId}`);
  console.log(`[Whop] ✓ Membership fetched: ${membership.status}`);
  return membership;
}

