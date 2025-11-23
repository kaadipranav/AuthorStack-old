import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { z } from "zod";

// Query params schema
const analyticsQuerySchema = z.object({
  bookId: z.string().uuid().optional(),
  startDate: z.string().optional(), // ISO date string
  endDate: z.string().optional(), // ISO date string
  granularity: z.enum(["daily", "weekly", "monthly"]).default("daily"),
  platform: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    const supabase = await createSupabaseServerClient();

    // Parse query params
    const searchParams = req.nextUrl.searchParams;
    const params = analyticsQuerySchema.parse({
      bookId: searchParams.get("bookId") || undefined,
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
      granularity: searchParams.get("granularity") || "daily",
      platform: searchParams.get("platform") || undefined,
    });

    // Default to last 30 days if not specified
    const endDate = params.endDate ? new Date(params.endDate) : new Date();
    const startDate = params.startDate
      ? new Date(params.startDate)
      : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Build query based on granularity
    let query;
    if (params.granularity === "weekly") {
      query = supabase
        .from("book_analytics_weekly")
        .select("book_id, platform, week_start as date, revenue, units_sold")
        .eq("profile_id", user.id)
        .gte("week_start", startDate.toISOString().split("T")[0])
        .lte("week_start", endDate.toISOString().split("T")[0]);
    } else if (params.granularity === "monthly") {
      query = supabase
        .from("book_analytics_monthly")
        .select("book_id, platform, month_start as date, revenue, units_sold")
        .eq("profile_id", user.id)
        .gte("month_start", startDate.toISOString().split("T")[0])
        .lte("month_start", endDate.toISOString().split("T")[0]);
    } else {
      // Daily
      query = supabase
        .from("book_analytics_daily")
        .select("book_id, platform, date, revenue, units_sold")
        .eq("profile_id", user.id)
        .gte("date", startDate.toISOString().split("T")[0])
        .lte("date", endDate.toISOString().split("T")[0]);
    }

    // Apply filters
    if (params.bookId) {
      query = query.eq("book_id", params.bookId);
    }
    if (params.platform) {
      query = query.eq("platform", params.platform);
    }

    query = query.order("date", { ascending: true });

    const { data, error } = await query;

    if (error) {
      console.error("Analytics query error:", error);
      return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
    }

    // Calculate summary stats
    const totalRevenue = data.reduce((sum, row) => sum + Number(row.revenue), 0);
    const totalUnits = data.reduce((sum, row) => sum + Number(row.units_sold), 0);
    const avgRevenuePerDay = data.length > 0 ? totalRevenue / data.length : 0;

    return NextResponse.json({
      data,
      summary: {
        totalRevenue,
        totalUnits,
        avgRevenuePerDay,
        dataPoints: data.length,
      },
    });
  } catch (error) {
    console.error("Analytics endpoint error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid query parameters", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
