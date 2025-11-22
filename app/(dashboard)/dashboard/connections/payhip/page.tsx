import Link from "next/link";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlatformConnectForm } from "@/features/platforms/components/platform-connect-form";

export default function PayhipConnectionPage() {
    return (
        <DashboardShell
            title="Payhip"
            description="Connect your Payhip account to sync sales from digital and physical products."
        >
            <div className="grid gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>API Connection</CardTitle>
                        <CardDescription>
                            Enter your Payhip API key to connect your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PlatformConnectForm provider="payhip" />
                        <div className="mt-4 space-y-2">
                            <p className="text-sm text-charcoal">
                                <strong>How to get your API key:</strong>
                            </p>
                            <ol className="list-decimal list-inside text-sm text-charcoal space-y-1">
                                <li>Log in to your Payhip account</li>
                                <li>Go to Settings → API</li>
                                <li>Click "Generate API Key"</li>
                                <li>Copy and paste the key above</li>
                            </ol>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Webhook Configuration (Optional)</CardTitle>
                        <CardDescription>
                            Set up webhooks for real-time sales notifications.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="text-sm text-charcoal">
                            Configure this webhook URL in your Payhip settings to receive real-time sale events:
                        </p>
                        <code className="block rounded bg-glass px-3 py-2 text-xs break-all">
                            {typeof window !== "undefined" ? window.location.origin : "https://your-domain.com"}/api/webhooks/payhip
                        </code>
                        <div className="space-y-2">
                            <p className="text-sm text-charcoal">
                                <strong>Webhook Setup:</strong>
                            </p>
                            <ol className="list-decimal list-inside text-sm text-charcoal space-y-1">
                                <li>Go to Payhip Settings → Webhooks</li>
                                <li>Add the webhook URL above</li>
                                <li>Select events: sale, refund, subscription_payment</li>
                                <li>Copy the webhook secret and add to your environment variables</li>
                            </ol>
                        </div>
                        <Button asChild variant="outline">
                            <Link href="https://payhip.com/settings/api" target="_blank" rel="noopener noreferrer">
                                Open Payhip Settings
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </DashboardShell>
    );
}
