import { NextResponse } from "next/server";

/**
 * POST /api/cron/master
 * Master cron job that orchestrates all scheduled tasks
 * Runs every 5 minutes and determines which jobs to execute
 * 
 * This bypasses Vercel's 2 cron job limit on free tier
 */
export async function POST(request: Request) {
    const cronSecret = request.headers.get("authorization");
    const vercelCronSecret = request.headers.get("x-vercel-cron-secret");

    const isAuthorized =
        (cronSecret && cronSecret === process.env.CRON_SECRET) ||
        (vercelCronSecret && vercelCronSecret === process.env.CRON_SECRET);

    if (!isAuthorized) {
        console.warn("[Cron] Unauthorized master cron request");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const results: Record<string, any> = {};

    console.log(`[Cron] Master cron executing at ${now.toISOString()}`);

    try {
        // Boost Status - Every 5 minutes (always runs)
        console.log("[Cron] Running boost status update...");
        const boostResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/cron/boost-status`, {
            method: "POST",
            headers: {
                "authorization": process.env.CRON_SECRET || "",
            },
        });
        results.boostStatus = await boostResponse.json();

        // Ingestion - Daily at midnight (00:00)
        if (hour === 0 && minute < 5) {
            console.log("[Cron] Running ingestion...");
            const ingestionResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/ingestion/cron`, {
                method: "POST",
                headers: {
                    "authorization": process.env.CRON_SECRET || "",
                },
            });
            results.ingestion = await ingestionResponse.json();
        }

        // Leaderboard - Daily at 2 AM (02:00)
        if (hour === 2 && minute < 5) {
            console.log("[Cron] Running leaderboard calculation...");
            const leaderboardResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/cron/leaderboard-weekly`, {
                method: "POST",
                headers: {
                    "authorization": process.env.CRON_SECRET || "",
                },
            });
            results.leaderboard = await leaderboardResponse.json();
        }

        // Analytics - Daily at 3 AM (03:00)
        if (hour === 3 && minute < 5) {
            console.log("[Cron] Running analytics aggregation...");
            const analyticsResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/cron/analytics`, {
                method: "POST",
                headers: {
                    "authorization": process.env.CRON_SECRET || "",
                },
            });
            results.analytics = await analyticsResponse.json();
        }

        console.log(`[Cron] ✓ Master cron completed successfully`);

        return NextResponse.json({
            status: "success",
            timestamp: now.toISOString(),
            executedJobs: Object.keys(results),
            results,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("[Cron] Master cron error:", errorMessage);

        return NextResponse.json(
            {
                status: "error",
                message: "Master cron failed",
                error: errorMessage,
                timestamp: now.toISOString(),
                partialResults: results,
            },
            { status: 500 }
        );
    }
}
