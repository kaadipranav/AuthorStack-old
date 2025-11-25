import { Redis } from "@upstash/redis";
import { env } from "@/lib/env";

/**
 * Rate Limiter using Upstash Redis
 * Implements sliding window algorithm for accurate rate limiting
 */

export interface RateLimitConfig {
    maxRequests: number;
    windowMs: number;
    identifier: string; // user ID, IP, or combination
}

export interface RateLimitResult {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number; // timestamp when limit resets
}

class RateLimiter {
    private redis: Redis | null = null;

    constructor() {
        if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
            this.redis = new Redis({
                url: env.UPSTASH_REDIS_REST_URL,
                token: env.UPSTASH_REDIS_REST_TOKEN,
            });
        }
    }

    /**
     * Check if request is allowed under rate limit
     */
    async checkLimit(config: RateLimitConfig): Promise<RateLimitResult> {
        // If Redis not configured, allow all requests
        if (!this.redis) {
            console.warn("[RateLimit] Redis not configured, allowing request");
            return {
                success: true,
                limit: config.maxRequests,
                remaining: config.maxRequests,
                reset: Date.now() + config.windowMs,
            };
        }

        const key = `ratelimit:${config.identifier}`;
        const now = Date.now();
        const windowStart = now - config.windowMs;

        try {
            // Use Redis pipeline for atomic operations
            const pipeline = this.redis.pipeline();

            // Remove old entries outside the window
            pipeline.zremrangebyscore(key, 0, windowStart);

            // Count requests in current window
            pipeline.zcard(key);

            // Add current request
            pipeline.zadd(key, { score: now, member: `${now}:${Math.random()}` });

            // Set expiry on the key
            pipeline.expire(key, Math.ceil(config.windowMs / 1000));

            const results = await pipeline.exec();
            const count = (results[1] as number) || 0;

            const allowed = count < config.maxRequests;
            const remaining = Math.max(0, config.maxRequests - count - 1);

            return {
                success: allowed,
                limit: config.maxRequests,
                remaining,
                reset: now + config.windowMs,
            };
        } catch (error) {
            console.error("[RateLimit] Error checking limit:", error);
            // On error, allow the request (fail open)
            return {
                success: true,
                limit: config.maxRequests,
                remaining: config.maxRequests,
                reset: now + config.windowMs,
            };
        }
    }

    /**
     * Reset rate limit for an identifier
     */
    async resetLimit(identifier: string): Promise<void> {
        if (!this.redis) return;

        const key = `ratelimit:${identifier}`;
        try {
            await this.redis.del(key);
        } catch (error) {
            console.error("[RateLimit] Error resetting limit:", error);
        }
    }

    /**
     * Get current usage for an identifier
     */
    async getUsage(identifier: string, windowMs: number): Promise<number> {
        if (!this.redis) return 0;

        const key = `ratelimit:${identifier}`;
        const now = Date.now();
        const windowStart = now - windowMs;

        try {
            const count = await this.redis.zcount(key, windowStart, now);
            return count;
        } catch (error) {
            console.error("[RateLimit] Error getting usage:", error);
            return 0;
        }
    }
}

// Singleton instance
let rateLimiterInstance: RateLimiter | null = null;

export function getRateLimiter(): RateLimiter {
    if (!rateLimiterInstance) {
        rateLimiterInstance = new RateLimiter();
    }
    return rateLimiterInstance;
}

/**
 * Predefined rate limit configurations
 */
export const RATE_LIMITS = {
    AI_CHAT: { maxRequests: 20, windowMs: 60 * 60 * 1000 }, // 20 per hour
    AI_INSIGHTS: { maxRequests: 10, windowMs: 60 * 60 * 1000 }, // 10 per hour
    DATA_SYNC: { maxRequests: 10, windowMs: 60 * 60 * 1000 }, // 10 per hour
    PROMO_BOOST: { maxRequests: 5, windowMs: 60 * 60 * 1000 }, // 5 per hour
    COMPETITOR_SYNC: { maxRequests: 10, windowMs: 60 * 60 * 1000 }, // 10 per hour
    API_GENERAL: { maxRequests: 100, windowMs: 60 * 60 * 1000 }, // 100 per hour
} as const;
