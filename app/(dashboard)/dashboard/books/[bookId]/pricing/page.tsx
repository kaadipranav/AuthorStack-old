export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireAuth } from "@/lib/auth/session";
import { services } from "@/lib/services";
import {
  AnalyticsService,
  PricingService,
} from "@/lib/modules/analytics/application/analytics-service";
import { BookAnalyticsChart } from "@/components/analytics/book-analytics-chart";
import { PricingSuggestions } from "@/components/analytics/pricing-suggestions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type PricingPageProps = {
  params: { bookId: string };
};

export default async function BookPricingPage({ params }: PricingPageProps) {
  const user = await requireAuth();
  const book = await services.book.getBookById(params.bookId);

  if (!book) {
    notFound();
  }

  const analyticsService = new AnalyticsService();
  const pricingService = new PricingService();

  // Fetch book-specific analytics
  const { data: bookData } = await analyticsService.getBookAnalytics(user.id, {
    bookId: params.bookId,
    granularity: "daily",
  });

  const chartData = bookData.map((item) => ({
    date: item.date,
    revenue: item.revenue,
    units: item.unitsSold,
  }));

  // Fetch pricing recommendations
  const recommendations = await pricingService.getPricingRecommendations(user.id, params.bookId);

  // Placeholder: Fetch current price from pricing_snapshots or book metadata
  // For now, using a placeholder
  const currentPrice = 9.99; // TODO: Fetch from pricing_snapshots

  return (
    <DashboardShell
      title={`${book.title} - Pricing`}
      description="Analytics and pricing recommendations for this book."
    >
      <div className="space-y-6">
        {/* Book Performance Chart */}
        <BookAnalyticsChart data={chartData} bookTitle={book.title} granularity="daily" />

        {/* Pricing Suggestions */}
        <PricingSuggestions
          recommendations={recommendations}
          currentPrice={currentPrice}
          bookTitle={book.title}
        />

        {/* Info Card */}
        <Card className="border border-stroke bg-glass">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-ink">Pricing Strategy Tips</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-charcoal space-y-2">
            <p>
              <strong>Rule-based recommendations:</strong> Compare your price to category averages
              and track sales impact after price changes.
            </p>
            <p>
              <strong>Phase 3+ features:</strong> Automated A/B testing, dynamic pricing based on
              demand, and competitor price monitoring.
            </p>
            <p>
              <strong>Best practices:</strong> Test small price changes incrementally. Monitor
              conversion rates and total revenue, not just units sold.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
