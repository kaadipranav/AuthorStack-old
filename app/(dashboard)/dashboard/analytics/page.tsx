export const dynamic = "force-dynamic";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireAuth } from "@/lib/auth/session";
import { AnalyticsService } from "@/lib/modules/analytics/application/analytics-service";
import { BookAnalyticsChart } from "@/components/analytics/book-analytics-chart";
import { BookRevenueBreakdown } from "@/components/analytics/book-revenue-breakdown";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AnalyticsPage() {
  const user = await requireAuth();
  const analyticsService = new AnalyticsService();

  // Fetch analytics data for last 30 days
  const { data: dailyData, summary } = await analyticsService.getBookAnalytics(user.id, {
    granularity: "daily",
  });

  // Get per-book revenue breakdown
  const bookBreakdown = await analyticsService.getBookRevenueBreakdown(user.id);

  // Aggregate daily data for chart (combine all books/platforms)
  const chartData = dailyData.reduce((acc, curr) => {
    const existing = acc.find((item) => item.date === curr.date);
    if (existing) {
      existing.revenue += curr.revenue;
      existing.units += curr.unitsSold;
    } else {
      acc.push({ date: curr.date, revenue: curr.revenue, units: curr.unitsSold });
    }
    return acc;
  }, [] as Array<{ date: string; revenue: number; units: number }>);

  return (
    <DashboardShell
      title="Book Analytics"
      description="Detailed sales performance and revenue trends for your books."
    >
      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border border-stroke bg-surface shadow-soft rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-charcoal">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-ink">
                ${summary.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-charcoal mt-1">Last 30 days</p>
            </CardContent>
          </Card>

          <Card className="border border-stroke bg-surface shadow-soft rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-charcoal">Units Sold</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-ink">{summary.totalUnits.toLocaleString()}</div>
              <p className="text-xs text-charcoal mt-1">Last 30 days</p>
            </CardContent>
          </Card>

          <Card className="border border-stroke bg-surface shadow-soft rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-charcoal">Avg Revenue/Day</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-ink">
                ${summary.avgRevenuePerDay.toFixed(2)}
              </div>
              <p className="text-xs text-charcoal mt-1">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Chart */}
        <BookAnalyticsChart data={chartData} granularity="daily" />

        {/* Book Revenue Breakdown */}
        <BookRevenueBreakdown books={bookBreakdown} />

        {/* Info Card */}
        <Card className="border border-stroke bg-glass">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-ink">About Analytics</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-charcoal space-y-2">
            <p>
              Analytics are aggregated from <code className="text-burgundy">sales_events</code> and
              cached in <code className="text-burgundy">book_analytics_daily</code> for fast queries.
            </p>
            <p>
              Use date range filters (coming soon) to analyze specific time periods. Weekly and
              monthly aggregations are also available.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
