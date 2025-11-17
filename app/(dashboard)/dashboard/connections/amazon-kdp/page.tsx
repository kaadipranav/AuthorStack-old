import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  KdpUploadForm,
  PlatformConnectForm,
} from "@/features/platforms/components/platform-connect-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AmazonKdpConnectionPage() {
  return (
    <DashboardShell
      title="Amazon KDP"
      description="Connect Kindle Direct Publishing or upload CSV exports."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>API connection</CardTitle>
            <CardDescription>Use an OAuth client or vendor-provided token.</CardDescription>
          </CardHeader>
          <CardContent>
            <PlatformConnectForm provider="amazon_kdp" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Manual CSV uploads</CardTitle>
            <CardDescription>Queue ingestion jobs using exported spreadsheets.</CardDescription>
          </CardHeader>
          <CardContent>
            <KdpUploadForm />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Webhook endpoint (placeholder)</CardTitle>
          <CardDescription>
            Use this endpoint for manual testing until real ingestion is enabled.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>The endpoint accepts POST payloads at:</p>
          <code className="rounded bg-muted px-2 py-1 text-xs">
            /api/webhooks/platforms/amazon-kdp
          </code>
          <Button asChild variant="outline">
            <Link href="/api/webhooks/platforms/amazon-kdp" target="_blank">
              View webhook endpoint
            </Link>
          </Button>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}

