import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { PredictionEngineService } from "@/lib/modules/ai/application/ai-services";
import { z } from "zod";

const predictionRequestSchema = z.object({
  bookId: z.string().uuid(),
  predictionType: z.enum(["revenue_forecast", "churn_risk"]),
  timeHorizonDays: z.number().int().min(1).max(365).optional(),
});

const predictionService = new PredictionEngineService();

/**
 * POST /api/ai/predictions
 * Generate predictions for a book
 */
export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    
    const body = await req.json();
    const parsed = predictionRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { bookId, predictionType, timeHorizonDays } = parsed.data;

    let prediction;
    if (predictionType === "revenue_forecast") {
      prediction = await predictionService.generateRevenueForecast(
        user.id,
        bookId,
        timeHorizonDays || 30
      );
    } else if (predictionType === "churn_risk") {
      prediction = await predictionService.detectChurnRisk(user.id, bookId);
    }

    return NextResponse.json({
      success: true,
      data: { prediction },
    });
  } catch (error: any) {
    console.error("Prediction generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate prediction" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ai/predictions?bookId=<uuid>&type=<type>
 * Get predictions for a book or profile
 */
export async function GET(req: Request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(req.url);
    
    const bookId = searchParams.get("bookId") || undefined;
    const type = searchParams.get("type") || undefined;

    const predictions = await predictionService.getPredictions(user.id, {
      bookId,
      type,
    });

    return NextResponse.json({
      success: true,
      data: { predictions },
    });
  } catch (error) {
    console.error("Predictions fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch predictions" },
      { status: 500 }
    );
  }
}
