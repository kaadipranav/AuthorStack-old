import { Redis } from "@upstash/redis";

import { env } from "@/lib/env";

export const redis = env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

export async function pingRedis() {
  if (!redis) {
    return { status: "skipped" as const, latencyMs: 0 };
  }

  const start = performance.now();
  await redis.ping();
  return { status: "pass" as const, latencyMs: Math.round(performance.now() - start) };
}

