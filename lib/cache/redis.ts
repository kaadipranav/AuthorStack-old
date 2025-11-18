import { Redis } from "@upstash/redis";
import { env } from "@/lib/env";

export const redis = env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

const QUEUE_KEY = "ingestion:queue";
const CACHE_PREFIX = "cache:";
const RATELIMIT_PREFIX = "ratelimit:";

export async function pingRedis() {
  if (!redis) {
    return { status: "skipped" as const, latencyMs: 0 };
  }

  try {
    const start = performance.now();
    await redis.ping();
    return { status: "pass" as const, latencyMs: Math.round(performance.now() - start) };
  } catch (error) {
    console.error("[Redis] Ping failed:", error);
    return { status: "fail" as const, latencyMs: 0 };
  }
}

// Queue Operations
export async function enqueueJob(jobId: string): Promise<void> {
  if (!redis) {
    throw new Error("Redis not configured");
  }

  try {
    await redis.lpush(QUEUE_KEY, jobId);
    console.log(`[Redis] ✓ Job enqueued: ${jobId}`);
  } catch (error) {
    console.error(`[Redis] Failed to enqueue job ${jobId}:`, error);
    throw error;
  }
}

export async function dequeueJob(): Promise<string | null> {
  if (!redis) {
    return null;
  }

  try {
    const jobId = await redis.rpop(QUEUE_KEY);
    if (jobId) {
      console.log(`[Redis] ✓ Job dequeued: ${jobId}`);
    }
    return jobId as string | null;
  } catch (error) {
    console.error("[Redis] Failed to dequeue job:", error);
    return null;
  }
}

export async function getQueueLength(): Promise<number> {
  if (!redis) {
    return 0;
  }

  try {
    const length = await redis.llen(QUEUE_KEY);
    return length || 0;
  } catch (error) {
    console.error("[Redis] Failed to get queue length:", error);
    return 0;
  }
}

// Caching Operations
export async function cacheApiResponse(
  key: string,
  data: unknown,
  ttlSeconds: number = 300
): Promise<void> {
  if (!redis) {
    return;
  }

  try {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    await redis.setex(cacheKey, ttlSeconds, JSON.stringify(data));
    console.log(`[Redis] ✓ Cached: ${cacheKey} (TTL: ${ttlSeconds}s)`);
  } catch (error) {
    console.error(`[Redis] Failed to cache ${key}:`, error);
  }
}

export async function getCachedResponse(key: string): Promise<unknown | null> {
  if (!redis) {
    return null;
  }

  try {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      console.log(`[Redis] ✓ Cache hit: ${cacheKey}`);
      return JSON.parse(cached as string);
    }
    
    return null;
  } catch (error) {
    console.error(`[Redis] Failed to get cached ${key}:`, error);
    return null;
  }
}

export async function invalidateCache(key: string): Promise<void> {
  if (!redis) {
    return;
  }

  try {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    await redis.del(cacheKey);
    console.log(`[Redis] ✓ Cache invalidated: ${cacheKey}`);
  } catch (error) {
    console.error(`[Redis] Failed to invalidate cache ${key}:`, error);
  }
}

// Rate Limiting
export async function incrementRateLimit(
  userId: string,
  limit: number = 100,
  windowSeconds: number = 3600
): Promise<number> {
  if (!redis) {
    return 0;
  }

  try {
    const key = `${RATELIMIT_PREFIX}${userId}`;
    const count = await redis.incr(key);
    
    if (count === 1) {
      await redis.expire(key, windowSeconds);
    }

    if (count > limit) {
      console.warn(`[Redis] Rate limit exceeded for ${userId}: ${count}/${limit}`);
    }

    return count || 0;
  } catch (error) {
    console.error(`[Redis] Failed to increment rate limit for ${userId}:`, error);
    return 0;
  }
}

export async function getRateLimitStatus(userId: string): Promise<number> {
  if (!redis) {
    return 0;
  }

  try {
    const key = `${RATELIMIT_PREFIX}${userId}`;
    const count = await redis.get(key);
    return (count as number) || 0;
  } catch (error) {
    console.error(`[Redis] Failed to get rate limit for ${userId}:`, error);
    return 0;
  }
}

export async function resetRateLimit(userId: string): Promise<void> {
  if (!redis) {
    return;
  }

  try {
    const key = `${RATELIMIT_PREFIX}${userId}`;
    await redis.del(key);
    console.log(`[Redis] ✓ Rate limit reset for ${userId}`);
  } catch (error) {
    console.error(`[Redis] Failed to reset rate limit for ${userId}:`, error);
  }
}

// Job Scheduling
export async function scheduleJob(jobId: string, delayMs: number): Promise<void> {
  if (!redis) {
    return;
  }

  try {
    const scheduledKey = "scheduled:jobs";
    const executeAt = Date.now() + delayMs;
    
    await redis.zadd(scheduledKey, {
      score: executeAt,
      member: jobId,
    });
    
    console.log(`[Redis] ✓ Job scheduled: ${jobId} (delay: ${delayMs}ms)`);
  } catch (error) {
    console.error(`[Redis] Failed to schedule job ${jobId}:`, error);
  }
}

export async function getScheduledJobs(): Promise<string[]> {
  if (!redis) {
    return [];
  }

  try {
    const scheduledKey = "scheduled:jobs";
    const now = Date.now();
    
    const jobs = await redis.zrange(scheduledKey, 0, now, {
      byScore: true,
    });
    return (jobs as string[]) || [];
  } catch (error) {
    console.error("[Redis] Failed to get scheduled jobs:", error);
    return [];
  }
}

export async function removeScheduledJob(jobId: string): Promise<void> {
  if (!redis) {
    return;
  }

  try {
    const scheduledKey = "scheduled:jobs";
    await redis.zrem(scheduledKey, jobId);
    console.log(`[Redis] ✓ Scheduled job removed: ${jobId}`);
  } catch (error) {
    console.error(`[Redis] Failed to remove scheduled job ${jobId}:`, error);
  }
}

