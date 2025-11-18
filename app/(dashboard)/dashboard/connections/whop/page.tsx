import Link from "next/link";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlatformConnectForm } from "@/features/platforms/components/platform-connect-form";

export default function WhopConnectionPage() {
  return (
    <DashboardShell
      title="Whop"
      description="Manage subscription state and listen for webhook events."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>OAuth shell</CardTitle>
            <CardDescription>
              Placeholder flow for Whop OAuth. Real integration arrives in Step 8.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-charcoal">
              Use this to validate route wiring. The endpoint returns JSON with the generated state
              and callback path.
            </p>
            <Button asChild>
              <Link href="/api/platforms/oauth/whop/start" target="_blank">
                Start OAuth flow
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Manual credentials</CardTitle>
            <CardDescription>
              Supply the Whop API key and webhook secret used by billing webhooks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PlatformConnectForm provider="whop" />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Webhook endpoint</CardTitle>
          <CardDescription>Use this POST endpoint for membership events.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <code className="rounded bg-glass px-2 py-1 text-xs">
            /api/webhooks/platforms/whop
          </code>
          <Button asChild variant="outline">
            <Link href="/api/webhooks/platforms/whop" target="_blank">
              View webhook endpoint
            </Link>
          </Button>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}

