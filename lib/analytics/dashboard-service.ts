import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Dashboard Analytics Service
 * Aggregates sales data and calculates KPIs for dashboard display
 */

export interface DashboardStats {
    totalRevenue: number;
    totalUnits: number;
    revenueGrowth: number; // percentage
    unitsGrowth: number; // percentage
    platformBreakdown: Array<{
        platform: string;
        revenue: number;
        units: number;
        percentage: number;
    }>;
    topBooks: Array<{
        id: string;
        title: string;
        revenue: number;
        units: number;
        trend: "up" | "down" | "stable";
    }>;
    revenueByDay: Array<{
        date: string;
        revenue: number;
        units: number;
    }>;
}

export class DashboardService {
    /**
     * Get dashboard statistics for a profile
     */
    async getStats(profileId: string, periodDays: number = 30): Promise<DashboardStats> {
        const supabase = await createSupabaseServerClient();
        const now = new Date();
        const periodStart = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);
        const previousPeriodStart = new Date(periodStart.getTime() - periodDays * 24 * 60 * 60 * 1000);

        // Get current period sales
        const { data: currentSales } = await supabase
            .from("sales_events")
            .select("platform, amount, quantity, occurred_at, raw_payload")
            .eq("profile_id", profileId)
            .gte("occurred_at", periodStart.toISOString())
            .order("occurred_at", { ascending: true });

        // Get previous period sales for growth calculation
        const { data: previousSales } = await supabase
            .from("sales_events")
            .select("amount, quantity")
            .eq("profile_id", profileId)
            .gte("occurred_at", previousPeriodStart.toISOString())
            .lt("occurred_at", periodStart.toISOString());

        // Calculate totals
        const totalRevenue = currentSales?.reduce((sum, sale) => sum + Number(sale.amount), 0) || 0;
        const totalUnits = currentSales?.reduce((sum, sale) => sum + Number(sale.quantity), 0) || 0;

        const prevRevenue = previousSales?.reduce((sum, sale) => sum + Number(sale.amount), 0) || 0;
        const prevUnits = previousSales?.reduce((sum, sale) => sum + Number(sale.quantity), 0) || 0;

        // Calculate growth
        const revenueGrowth = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;
        const unitsGrowth = prevUnits > 0 ? ((totalUnits - prevUnits) / prevUnits) * 100 : 0;

        // Platform breakdown
        const platformMap = new Map<string, { revenue: number; units: number }>();
        currentSales?.forEach((sale) => {
            const existing = platformMap.get(sale.platform) || { revenue: 0, units: 0 };
            platformMap.set(sale.platform, {
                revenue: existing.revenue + Number(sale.amount),
                units: existing.units + Number(sale.quantity),
            });
        });

        const platformBreakdown = Array.from(platformMap.entries()).map(([platform, data]) => ({
            platform,
            revenue: data.revenue,
            units: data.units,
            percentage: totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0,
        })).sort((a, b) => b.revenue - a.revenue);

        // Top books
        const { data: books } = await supabase
            .from("books")
            .select("id, title")
            .eq("profile_id", profileId);

        const bookMap = new Map<string, { revenue: number; units: number }>();
        currentSales?.forEach((sale) => {
            const bookTitle = (sale.raw_payload as any)?.title || "Unknown";
            const existing = bookMap.get(bookTitle) || { revenue: 0, units: 0 };
            bookMap.set(bookTitle, {
                revenue: existing.revenue + Number(sale.amount),
                units: existing.units + Number(sale.quantity),
            });
        });

        const topBooks = Array.from(bookMap.entries())
            .map(([title, data]) => {
                const book = books?.find((b) => b.title === title);
                return {
                    id: book?.id || title,
                    title,
                    revenue: data.revenue,
                    units: data.units,
                    trend: "stable" as const, // TODO: Calculate actual trend
                };
            })
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        // Revenue by day
        const dayMap = new Map<string, { revenue: number; units: number }>();
        currentSales?.forEach((sale) => {
            const day = new Date(sale.occurred_at).toISOString().split("T")[0];
            const existing = dayMap.get(day) || { revenue: 0, units: 0 };
            dayMap.set(day, {
                revenue: existing.revenue + Number(sale.amount),
                units: existing.units + Number(sale.quantity),
            });
        });

        const revenueByDay = Array.from(dayMap.entries())
            .map(([date, data]) => ({
                date,
                revenue: data.revenue,
                units: data.units,
            }))
            .sort((a, b) => a.date.localeCompare(b.date));

        return {
            totalRevenue,
            totalUnits,
            revenueGrowth,
            unitsGrowth,
            platformBreakdown,
            topBooks,
            revenueByDay,
        };
    }

    /**
     * Aggregate sales data into daily analytics
     * Should be run by cron job
     */
    async aggregateDailyAnalytics(profileId: string, date: Date): Promise<void> {
        const supabase = await createSupabaseServerClient();
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 1);

        // Get sales for the day
        const { data: sales } = await supabase
            .from("sales_events")
            .select("platform, amount, quantity, raw_payload")
            .eq("profile_id", profileId)
            .gte("occurred_at", dayStart.toISOString())
            .lt("occurred_at", dayEnd.toISOString());

        if (!sales || sales.length === 0) return;

        // Group by book
        const bookMap = new Map<string, { revenue: number; units: number; platform: string }>();
        sales.forEach((sale) => {
            const bookTitle = (sale.raw_payload as any)?.title || "Unknown";
            const existing = bookMap.get(bookTitle) || { revenue: 0, units: 0, platform: sale.platform };
            bookMap.set(bookTitle, {
                revenue: existing.revenue + Number(sale.amount),
                units: existing.units + Number(sale.quantity),
                platform: sale.platform,
            });
        });

        // Get book IDs
        const { data: books } = await supabase
            .from("books")
            .select("id, title")
            .eq("profile_id", profileId);

        // Insert/update daily analytics
        for (const [title, data] of bookMap.entries()) {
            const book = books?.find((b) => b.title === title);
            if (!book) continue;

            await supabase
                .from("book_analytics_daily")
                .upsert({
                    profile_id: profileId,
                    book_id: book.id,
                    date: dayStart.toISOString().split("T")[0],
                    revenue: data.revenue,
                    units_sold: data.units,
                    platform: data.platform,
                }, {
                    onConflict: "profile_id,book_id,date,platform",
                });
        }
    }
}

// Singleton instance
let dashboardServiceInstance: DashboardService | null = null;

export function getDashboardService(): DashboardService {
    if (!dashboardServiceInstance) {
        dashboardServiceInstance = new DashboardService();
    }
    return dashboardServiceInstance;
}
