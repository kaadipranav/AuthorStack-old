import { NextResponse } from "next/server";
import { getDashboardService } from "@/lib/analytics/dashboard-service";

/**
 * POST /api/cron/analytics
 * Daily analytics aggregation cron job
 * Aggregates sales_events into book_analytics_daily
 */
export async function POST(request: Request) {
    const cronSecret = request.headers.get("authorization");
    const vercelCronSecret = request.headers.get("x-vercel-cron-secret");

    const isAuthorized =
        (cronSecret && cronSecret === process.env.CRON_SECRET) ||
        (vercelCronSecret && vercelCronSecret === process.env.CRON_SECRET);

    if (!isAuthorized) {
        console.warn("[Cron] Unauthorized analytics cron request");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        console.log("[Cron] Starting daily analytics aggregation");
        const dashboardService = getDashboardService();

        // Get yesterday's date
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        // Get all profiles with sales events
        const { createSupabaseServiceClient } = await import("@/lib/supabase/service");
        const supabase = await createSupabaseServiceClient();

        const { data: profiles } = await supabase
            .from("profiles")
            .select("id")
            .limit(1000); // Process in batches if needed

        if (!profiles || profiles.length === 0) {
            return NextResponse.json({
                status: "success",
                message: "No profiles to process",
            });
        }

        let processed = 0;
        for (const profile of profiles) {
            try {
                await dashboardService.aggregateDailyAnalytics(profile.id, yesterday);
                processed++;
            } catch (error) {
                console.error(`[Cron] Failed to aggregate for profile ${profile.id}:`, error);
            }
        }

        console.log(`[Cron] ✓ Aggregated analytics for ${processed} profiles`);

        return NextResponse.json({
            status: "success",
            message: `Aggregated analytics for ${processed} profiles`,
            profilesProcessed: processed,
            date: yesterday.toISOString().split("T")[0],
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("[Cron] Analytics aggregation error:", errorMessage);

        return NextResponse.json(
            {
                status: "error",
                message: "Analytics aggregation failed",
                error: errorMessage,
            },
            { status: 500 }
        );
    }
}
