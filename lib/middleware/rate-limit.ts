import { NextRequest, NextResponse } from "next/server";
import { getRateLimiter, RateLimitConfig } from "@/lib/rate-limit";

/**
 * Rate limiting middleware for API routes
 * Usage: wrap your API handler with withRateLimit
 */

export function withRateLimit(
    handler: (req: NextRequest) => Promise<NextResponse>,
    config: RateLimitConfig
) {
    return async (req: NextRequest): Promise<NextResponse> => {
        const rateLimiter = getRateLimiter();

        // Get identifier (user ID from auth or IP address)
        const identifier = await getIdentifier(req);
        const fullConfig = { ...config, identifier };

        // Check rate limit
        const result = await rateLimiter.checkLimit(fullConfig);

        // Add rate limit headers
        const headers = new Headers();
        headers.set("X-RateLimit-Limit", result.limit.toString());
        headers.set("X-RateLimit-Remaining", result.remaining.toString());
        headers.set("X-RateLimit-Reset", result.reset.toString());

        if (!result.success) {
            const retryAfter = Math.ceil((result.reset - Date.now()) / 1000);
            headers.set("Retry-After", retryAfter.toString());

            return NextResponse.json(
                {
                    error: "Rate limit exceeded",
                    message: `Too many requests. Please try again in ${retryAfter} seconds.`,
                    limit: result.limit,
                    reset: result.reset,
                },
                { status: 429, headers }
            );
        }

        // Call the handler
        const response = await handler(req);

        // Add rate limit headers to successful response
        headers.forEach((value, key) => {
            response.headers.set(key, value);
        });

        return response;
    };
}

/**
 * Get identifier for rate limiting
 * Prefers user ID from session, falls back to IP address
 */
async function getIdentifier(req: NextRequest): Promise<string> {
    // Try to get user ID from session
    try {
        const { requireAuth } = await import("@/lib/auth/session");
        const user = await requireAuth();
        if (user?.id) {
            return `user:${user.id}`;
        }
    } catch {
        // Not authenticated, use IP
    }

    // Fall back to IP address
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : req.headers.get("x-real-ip") || "unknown";
    return `ip:${ip}`;
}

/**
 * Simple rate limit check without middleware wrapper
 * Useful for checking limits without blocking the request
 */
export async function checkRateLimit(
    req: NextRequest,
    config: Omit<RateLimitConfig, "identifier">
) {
    const rateLimiter = getRateLimiter();
    const identifier = await getIdentifier(req);
    return rateLimiter.checkLimit({ ...config, identifier });
}
