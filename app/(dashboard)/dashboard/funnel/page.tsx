export const dynamic = "force-dynamic";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireAuth } from "@/lib/auth/session";
import { FunnelService } from "@/lib/modules/analytics/application/analytics-service";
import { FunnelVisualization } from "@/components/analytics/funnel-visualization";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function FunnelPage() {
  const user = await requireAuth();
  const funnelService = new FunnelService();

  // Fetch funnel data
  const funnelData = await funnelService.getFunnelData(user.id);

  return (
    <DashboardShell
      title="Reader Funnel"
      description="Track impressions, clicks, and conversions for your marketing campaigns."
    >
      <div className="space-y-6">
        {/* Funnel Visualization */}
        <FunnelVisualization data={funnelData} />

        {/* Instructions Card */}
        <Card className="border border-stroke bg-glass">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-ink">How to Use</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-charcoal space-y-3">
            <div>
              <p className="font-medium text-ink mb-1">Manual Tracking (Phase 2)</p>
              <p>
                Record funnel events via the API or dashboard. Track impressions (views), clicks
                (link clicks), and conversions (purchases) for each marketing source.
              </p>
            </div>
            <div>
              <p className="font-medium text-ink mb-1">Example Sources</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>facebook_ad</li>
                <li>email_campaign</li>
                <li>instagram_story</li>
                <li>amazon_ad</li>
                <li>organic_search</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-ink mb-1">Phase 3+ Automation</p>
              <p>
                Future versions will automatically track events via tracking pixels, webhook
                integrations, and UTM parameters.
              </p>
            </div>
            <div className="mt-4 p-3 bg-surface rounded border border-stroke">
              <p className="font-medium text-ink mb-2">API Example:</p>
              <code className="block text-xs bg-white p-2 rounded">
                POST /api/funnel<br />
                {`{ "eventType": "impression", "source": "facebook_ad", "bookId": "..." }`}
              </code>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
