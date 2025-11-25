import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { getDashboardService } from "@/lib/analytics/dashboard-service";

/**
 * GET /api/dashboard/stats?period=30
 * Get dashboard statistics
 */
export async function GET(req: Request) {
    try {
        const user = await requireAuth();
        const { searchParams } = new URL(req.url);
        const period = parseInt(searchParams.get("period") || "30");

        // Validate period
        if (period < 1 || period > 365) {
            return NextResponse.json(
                { error: "Period must be between 1 and 365 days" },
                { status: 400 }
            );
        }

        const dashboardService = getDashboardService();
        const stats = await dashboardService.getStats(user.id, period);

        return NextResponse.json({
            success: true,
            data: stats,
        });
    } catch (error) {
        console.error("[API] Dashboard stats error:", error);
        return NextResponse.json(
            {
                error: "Failed to fetch dashboard statistics",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
