import { createClient } from "@supabase/supabase-js";

import { env } from "@/lib/env";

export const supabaseServiceClient =
  env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null;

export async function pingSupabase() {
  if (!supabaseServiceClient) {
    return { status: "skipped" as const, latencyMs: 0 };
  }

  const start = performance.now();
  const { error } = await supabaseServiceClient
    .from("profiles")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return { status: "pass" as const, latencyMs: Math.round(performance.now() - start) };
}

