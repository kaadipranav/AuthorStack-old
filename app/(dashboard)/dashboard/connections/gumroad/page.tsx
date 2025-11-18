import Link from "next/link";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlatformConnectForm } from "@/features/platforms/components/platform-connect-form";

export default function GumroadConnectionPage() {
  return (
    <DashboardShell
      title="Gumroad"
      description="Connect Gumroad via OAuth or API key to ingest orders."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>OAuth (recommended)</CardTitle>
            <CardDescription>
              Placeholder endpoint for OAuth initiation. Replace with live credentials later.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-charcoal">
              Step 8 will wire this button to Gumroad&apos;s real consent screen. Today it simply
              returns JSON so you can validate routing.
            </p>
            <Button asChild>
              <Link href="/api/platforms/oauth/gumroad/start" target="_blank">
                Start OAuth flow
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Manual API credentials</CardTitle>
            <CardDescription>Securely store credentials via Supabase secrets.</CardDescription>
          </CardHeader>
          <CardContent>
            <PlatformConnectForm provider="gumroad" />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Webhook endpoint</CardTitle>
          <CardDescription>Send test payloads here until ingestion is wired up.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <code className="rounded bg-glass px-2 py-1 text-xs">
            /api/webhooks/platforms/gumroad
          </code>
          <Button asChild variant="outline">
            <Link href="/api/webhooks/platforms/gumroad" target="_blank">
              View webhook endpoint
            </Link>
          </Button>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}

