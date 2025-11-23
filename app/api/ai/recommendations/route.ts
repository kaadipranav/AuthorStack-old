import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { RecommendationEngineService } from "@/lib/modules/ai/application/ai-services";
import { z } from "zod";

const feedbackSchema = z.object({
  recommendationId: z.string().uuid(),
  recommendationType: z.enum(["pricing", "marketing", "content", "strategic"]),
  actionTaken: z.enum(["accepted", "rejected", "modified", "deferred"]),
  feedbackText: z.string().optional(),
});

const recommendationService = new RecommendationEngineService();

/**
 * GET /api/ai/recommendations
 * Get AI-generated recommendations for profile
 */
export async function GET(req: Request) {
  try {
    const user = await requireAuth();

    const recommendations = await recommendationService.generateRecommendations(user.id);

    return NextResponse.json({
      success: true,
      data: { recommendations },
    });
  } catch (error) {
    console.error("Recommendations generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ai/recommendations/feedback
 * Record feedback on a recommendation
 */
export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    
    const body = await req.json();
    const parsed = feedbackSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { recommendationId, recommendationType, actionTaken, feedbackText } = parsed.data;

    await recommendationService.recordFeedback(
      user.id,
      recommendationId,
      recommendationType,
      actionTaken,
      feedbackText
    );

    return NextResponse.json({
      success: true,
      message: "Feedback recorded successfully",
    });
  } catch (error) {
    console.error("Feedback recording error:", error);
    return NextResponse.json(
      { error: "Failed to record feedback" },
      { status: 500 }
    );
  }
}
