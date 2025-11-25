import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { RecommendationEngineService } from "@/lib/modules/ai/application/ai-services";
import { getRateLimiter, RATE_LIMITS } from "@/lib/rate-limit";

const recommendationService = new RecommendationEngineService();

/**
 * GET /api/ai/insights
 * Get AI-generated recommendations and insights
 * Rate limited: 10 requests per hour
 */
export async function GET(req: Request) {
    try {
        // Check rate limit
        const rateLimiter = getRateLimiter();
        const user = await requireAuth();
        const identifier = `user:${user.id}`;

        const rateLimit = await rateLimiter.checkLimit({
            ...RATE_LIMITS.AI_INSIGHTS,
            identifier,
        });

        if (!rateLimit.success) {
            const retryAfter = Math.ceil((rateLimit.reset - Date.now()) / 1000);
            return NextResponse.json(
                {
                    error: "Rate limit exceeded",
                    message: `Too many insight requests. Please try again in ${retryAfter} seconds.`,
                },
                {
                    status: 429,
                    headers: {
                        "Retry-After": retryAfter.toString(),
                    },
                }
            );
        }

        // Generate recommendations
        const recommendations = await recommendationService.generateRecommendations(user.id);

        return NextResponse.json(
            {
                success: true,
                data: {
                    recommendations,
                    generatedAt: new Date().toISOString(),
                },
            },
            {
                headers: {
                    "X-RateLimit-Limit": rateLimit.limit.toString(),
                    "X-RateLimit-Remaining": rateLimit.remaining.toString(),
                    "X-RateLimit-Reset": rateLimit.reset.toString(),
                },
            }
        );
    } catch (error) {
        console.error("[API] Insights error:", error);
        return NextResponse.json(
            {
                error: "Failed to generate insights",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

/**
 * POST /api/ai/insights/feedback
 * Record feedback on a recommendation
 */
export async function POST(req: Request) {
    try {
        const user = await requireAuth();
        const body = await req.json();

        const { recommendationId, recommendationType, actionTaken, feedbackText } = body;

        if (!recommendationId || !recommendationType || !actionTaken) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        await recommendationService.recordFeedback(
            user.id,
            recommendationId,
            recommendationType,
            actionTaken,
            feedbackText
        );

        return NextResponse.json({
            success: true,
            message: "Feedback recorded",
        });
    } catch (error) {
        console.error("[API] Feedback error:", error);
        return NextResponse.json(
            {
                error: "Failed to record feedback",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
