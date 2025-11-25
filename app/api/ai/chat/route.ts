import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { AIAssistantService } from "@/lib/modules/ai/application/ai-services";
import { z } from "zod";

const chatRequestSchema = z.object({
  message: z.string().min(1).max(5000),
  sessionId: z.string().uuid().optional(),
});

const assistantService = new AIAssistantService();

/**
 * POST /api/ai/chat
 * Send message to AI assistant
 * Rate limited: 20 requests per hour
 */
export async function POST(req: Request) {
  try {
    // Check rate limit
    const { getRateLimiter, RATE_LIMITS } = await import("@/lib/rate-limit");
    const rateLimiter = getRateLimiter();

    const user = await requireAuth();
    const identifier = `user:${user.id}`;

    const rateLimit = await rateLimiter.checkLimit({
      ...RATE_LIMITS.AI_CHAT,
      identifier,
    });

    if (!rateLimit.success) {
      const retryAfter = Math.ceil((rateLimit.reset - Date.now()) / 1000);
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: `Too many AI requests. Please try again in ${retryAfter} seconds.`,
          limit: rateLimit.limit,
          remaining: rateLimit.remaining,
          reset: rateLimit.reset,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": rateLimit.limit.toString(),
            "X-RateLimit-Remaining": rateLimit.remaining.toString(),
            "X-RateLimit-Reset": rateLimit.reset.toString(),
            "Retry-After": retryAfter.toString(),
          },
        }
      );
    }

    const body = await req.json();
    const parsed = chatRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { message, sessionId } = parsed.data;

    const response = await assistantService.chat(user.id, message, sessionId);

    return NextResponse.json(
      {
        success: true,
        data: response,
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
    console.error("AI chat error:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ai/chat?sessionId=<uuid>
 * Get conversation history
 */
export async function GET(req: Request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId query parameter required" },
        { status: 400 }
      );
    }

    const history = await assistantService.getConversationHistory(user.id, sessionId);

    return NextResponse.json({
      success: true,
      data: { messages: history },
    });
  } catch (error) {
    console.error("Conversation history error:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversation history" },
      { status: 500 }
    );
  }
}
