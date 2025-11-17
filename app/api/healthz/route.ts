import { NextResponse } from "next/server";

import { pingRedis } from "@/lib/cache/redis";
import { env } from "@/lib/env";
import { pingSupabase } from "@/lib/supabase/service";

type CheckStatus = {
  status: "pass" | "fail" | "skipped";
  latencyMs: number;
  error?: string;
};

async function safeCheck(fn: () => Promise<CheckStatus>): Promise<CheckStatus> {
  try {
    return await fn();
  } catch (error) {
    return {
      status: "fail",
      latencyMs: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function GET() {
  const [supabase, redis] = await Promise.all([
    safeCheck(pingSupabase),
    safeCheck(pingRedis),
  ]);

  const integrations = {
    whop: env.WHOP_API_KEY && env.WHOP_WEBHOOK_SECRET ? "configured" : "missing",
    resend: env.RESEND_API_KEY && env.FROM_EMAIL ? "configured" : "missing",
  };

  const degraded =
    [supabase, redis].some((check) => check.status === "fail") ||
    Object.values(integrations).some((value) => value === "missing");

  return NextResponse.json({
    status: degraded ? "degraded" : "ok",
    timestamp: new Date().toISOString(),
    region: process.env.VERCEL_REGION ?? "local",
    checks: {
      supabase,
      redis,
      integrations,
    },
  });
}

