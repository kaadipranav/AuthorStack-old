import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface BookAnalytics {
  bookId: string;
  date: string;
  revenue: number;
  unitsSold: number;
  platform: string;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  totalUnits: number;
  avgRevenuePerDay: number;
  dataPoints: number;
}

export interface FunnelData {
  impressions: number;
  clicks: number;
  conversions: number;
  clickThroughRate: number;
  conversionRate: number;
}

export interface PricingRecommendation {
  id: string;
  bookId: string;
  recommendationType: "increase" | "decrease" | "revert" | "maintain";
  suggestedPrice: number | null;
  reasoning: string;
  metadata: Record<string, unknown>;
  generatedAt: Date;
}

export class AnalyticsService {
  /**
   * Fetch book analytics with date range and granularity filtering
   */
  async getBookAnalytics(
    profileId: string,
    options: {
      bookId?: string;
      startDate?: Date;
      endDate?: Date;
      granularity?: "daily" | "weekly" | "monthly";
      platform?: string;
    } = {}
  ): Promise<{ data: BookAnalytics[]; summary: AnalyticsSummary }> {
    const supabase = await createSupabaseServerClient();

    const { bookId, startDate, endDate, granularity = "daily", platform } = options;

    const end = endDate || new Date();
    const start = startDate || new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

    let query;
    if (granularity === "weekly") {
      query = supabase
        .from("book_analytics_weekly")
        .select("book_id, platform, week_start as date, revenue, units_sold")
        .eq("profile_id", profileId)
        .gte("week_start", start.toISOString().split("T")[0])
        .lte("week_start", end.toISOString().split("T")[0]);
    } else if (granularity === "monthly") {
      query = supabase
        .from("book_analytics_monthly")
        .select("book_id, platform, month_start as date, revenue, units_sold")
        .eq("profile_id", profileId)
        .gte("month_start", start.toISOString().split("T")[0])
        .lte("month_start", end.toISOString().split("T")[0]);
    } else {
      query = supabase
        .from("book_analytics_daily")
        .select("book_id, platform, date, revenue, units_sold")
        .eq("profile_id", profileId)
        .gte("date", start.toISOString().split("T")[0])
        .lte("date", end.toISOString().split("T")[0]);
    }

    if (bookId) query = query.eq("book_id", bookId);
    if (platform) query = query.eq("platform", platform);

    query = query.order("date", { ascending: true });

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    const analytics: BookAnalytics[] = (data || []).map((row) => ({
      bookId: row.book_id,
      date: row.date,
      revenue: Number(row.revenue),
      unitsSold: Number(row.units_sold),
      platform: row.platform,
    }));

    const totalRevenue = analytics.reduce((sum, a) => sum + a.revenue, 0);
    const totalUnits = analytics.reduce((sum, a) => sum + a.unitsSold, 0);
    const avgRevenuePerDay = analytics.length > 0 ? totalRevenue / analytics.length : 0;

    return {
      data: analytics,
      summary: { totalRevenue, totalUnits, avgRevenuePerDay, dataPoints: analytics.length },
    };
  }

  /**
   * Get per-book revenue breakdown for a given time period
   */
  async getBookRevenueBreakdown(
    profileId: string,
    options: { startDate?: Date; endDate?: Date } = {}
  ): Promise<Array<{ bookId: string; bookTitle: string; revenue: number; units: number }>> {
    const supabase = await createSupabaseServerClient();

    const end = options.endDate || new Date();
    const start = options.startDate || new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

    const { data, error } = await supabase
      .from("book_analytics_daily")
      .select("book_id, revenue, units_sold, books!inner(title)")
      .eq("profile_id", profileId)
      .gte("date", start.toISOString().split("T")[0])
      .lte("date", end.toISOString().split("T")[0]);

    if (error) throw new Error(error.message);

    // Aggregate by book
    const bookMap = new Map<string, { bookId: string; bookTitle: string; revenue: number; units: number }>();

    (data || []).forEach((row: any) => {
      const bookId = row.book_id;
      const bookTitle = row.books?.title || "Unknown";
      const existing = bookMap.get(bookId) || { bookId, bookTitle, revenue: 0, units: 0 };

      existing.revenue += Number(row.revenue);
      existing.units += Number(row.units_sold);

      bookMap.set(bookId, existing);
    });

    return Array.from(bookMap.values()).sort((a, b) => b.revenue - a.revenue);
  }
}

export class FunnelService {
  /**
   * Get funnel conversion data
   */
  async getFunnelData(
    profileId: string,
    options: { bookId?: string; source?: string } = {}
  ): Promise<FunnelData> {
    const supabase = await createSupabaseServerClient();

    let query = supabase
      .from("funnel_conversion_summary")
      .select("*")
      .eq("profile_id", profileId);

    if (options.bookId) query = query.eq("book_id", options.bookId);
    if (options.source) query = query.eq("source", options.source);

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    const totals = (data || []).reduce(
      (acc, row) => ({
        impressions: acc.impressions + Number(row.impressions),
        clicks: acc.clicks + Number(row.clicks),
        conversions: acc.conversions + Number(row.conversions),
      }),
      { impressions: 0, clicks: 0, conversions: 0 }
    );

    return {
      ...totals,
      clickThroughRate: totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0,
      conversionRate: totals.clicks > 0 ? (totals.conversions / totals.clicks) * 100 : 0,
    };
  }

  /**
   * Record a funnel event (manual tracking)
   */
  async recordFunnelEvent(
    profileId: string,
    event: {
      bookId?: string;
      eventType: "impression" | "click" | "conversion";
      source: string;
      metadata?: Record<string, unknown>;
    }
  ): Promise<void> {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.from("funnel_events").insert({
      profile_id: profileId,
      book_id: event.bookId || null,
      event_type: event.eventType,
      source: event.source,
      metadata: event.metadata || {},
    });

    if (error) throw new Error(error.message);
  }
}

export class PricingService {
  /**
   * Get active pricing recommendations for a book
   */
  async getPricingRecommendations(profileId: string, bookId: string): Promise<PricingRecommendation[]> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("pricing_recommendations")
      .select("*")
      .eq("profile_id", profileId)
      .eq("book_id", bookId)
      .gt("expires_at", new Date().toISOString())
      .order("generated_at", { ascending: false });

    if (error) throw new Error(error.message);

    return (data || []).map((row) => ({
      id: row.id,
      bookId: row.book_id,
      recommendationType: row.recommendation_type,
      suggestedPrice: row.suggested_price,
      reasoning: row.reasoning,
      metadata: row.metadata,
      generatedAt: new Date(row.generated_at),
    }));
  }

  /**
   * Record a pricing snapshot
   */
  async recordPricingSnapshot(
    profileId: string,
    snapshot: { bookId: string; platform: string; price: number; currency?: string }
  ): Promise<void> {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.from("pricing_snapshots").insert({
      profile_id: profileId,
      book_id: snapshot.bookId,
      platform: snapshot.platform,
      price: snapshot.price,
      currency: snapshot.currency || "USD",
    });

    if (error) throw new Error(error.message);
  }
}
