import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { z } from "zod";

// Query params schema
const funnelQuerySchema = z.object({
  bookId: z.string().uuid().optional(),
  source: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    const supabase = await createSupabaseServerClient();

    const searchParams = req.nextUrl.searchParams;
    const params = funnelQuerySchema.parse({
      bookId: searchParams.get("bookId") || undefined,
      source: searchParams.get("source") || undefined,
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
    });

    // Default to last 30 days
    const endDate = params.endDate ? new Date(params.endDate) : new Date();
    const startDate = params.startDate
      ? new Date(params.startDate)
      : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Query funnel conversion summary view
    let query = supabase
      .from("funnel_conversion_summary")
      .select("*")
      .eq("profile_id", user.id);

    if (params.bookId) {
      query = query.eq("book_id", params.bookId);
    }
    if (params.source) {
      query = query.eq("source", params.source);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Funnel query error:", error);
      return NextResponse.json({ error: "Failed to fetch funnel data" }, { status: 500 });
    }

    // Aggregate totals
    const totals = data.reduce(
      (acc, row) => ({
        impressions: acc.impressions + Number(row.impressions),
        clicks: acc.clicks + Number(row.clicks),
        conversions: acc.conversions + Number(row.conversions),
      }),
      { impressions: 0, clicks: 0, conversions: 0 }
    );

    const overallCTR =
      totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0;
    const overallCR =
      totals.clicks > 0 ? (totals.conversions / totals.clicks) * 100 : 0;

    return NextResponse.json({
      data,
      totals: {
        ...totals,
        clickThroughRate: overallCTR,
        conversionRate: overallCR,
      },
    });
  } catch (error) {
    console.error("Funnel endpoint error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid query parameters" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Create funnel event (manual tracking)
const funnelEventSchema = z.object({
  bookId: z.string().uuid().optional(),
  eventType: z.enum(["impression", "click", "conversion"]),
  source: z.string().min(1),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const supabase = await createSupabaseServerClient();

    const body = await req.json();
    const event = funnelEventSchema.parse(body);

    const { error } = await supabase.from("funnel_events").insert({
      profile_id: user.id,
      book_id: event.bookId || null,
      event_type: event.eventType,
      source: event.source,
      metadata: event.metadata || {},
    });

    if (error) {
      console.error("Funnel insert error:", error);
      return NextResponse.json({ error: "Failed to record funnel event" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Funnel POST error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request body", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
