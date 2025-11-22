import Link from "next/link";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlatformConnectForm } from "@/features/platforms/components/platform-connect-form";

export default function LuluConnectionPage() {
    return (
        <DashboardShell
            title="Lulu Print API"
            description="Connect Lulu to track print-on-demand orders and calculate profit margins."
        >
            <div className="grid gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>API Connection</CardTitle>
                        <CardDescription>
                            Enter your Lulu API credentials to connect your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PlatformConnectForm provider="lulu" />
                        <div className="mt-4 space-y-2">
                            <p className="text-sm text-charcoal">
                                <strong>How to get your API credentials:</strong>
                            </p>
                            <ol className="list-decimal list-inside text-sm text-charcoal space-y-1">
                                <li>Visit <a href="https://developers.lulu.com" target="_blank" rel="noopener noreferrer" className="text-burgundy underline">Lulu Developer Portal</a></li>
                                <li>Create a developer account or sign in</li>
                                <li>Navigate to API Credentials</li>
                                <li>Create a new application</li>
                                <li>Copy the API Key and API Secret</li>
                                <li>Paste both values above (API Key in first field, API Secret in second)</li>
                            </ol>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>What Data is Synced</CardTitle>
                        <CardDescription>
                            Understanding your Lulu integration
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="space-y-2">
                            <p className="text-sm text-charcoal">
                                The Lulu integration tracks:
                            </p>
                            <ul className="list-disc list-inside text-sm text-charcoal space-y-1">
                                <li><strong>Print Jobs:</strong> All completed print orders</li>
                                <li><strong>Order Status:</strong> Track from created to shipped</li>
                                <li><strong>Print Costs:</strong> Actual printing and shipping costs</li>
                                <li><strong>Projects:</strong> Your book designs and products</li>
                            </ul>
                        </div>
                        <div className="rounded bg-amber/10 border border-amber/20 p-4">
                            <p className="text-sm text-charcoal">
                                <strong>Note:</strong> Only SHIPPED print jobs are counted as sales in your dashboard.
                                This integration is designed for sales tracking and profit analysis, not for creating new print jobs.
                            </p>
                        </div>
                        <Button asChild variant="outline">
                            <Link href="https://developers.lulu.com/" target="_blank" rel="noopener noreferrer">
                                View Lulu API Documentation
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Profit Tracking</CardTitle>
                        <CardDescription>
                            How profit margins are calculated
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="text-sm text-charcoal">
                            AuthorStack automatically calculates your profit margins:
                        </p>
                        <div className="bg-glass rounded p-4 text-sm font-mono">
                            <div>Profit = Selling Price - (Print Cost + Shipping + Tax)</div>
                        </div>
                        <p className="text-sm text-charcoal">
                            To see accurate profit margins, make sure to update your book selling prices in the Books section.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </DashboardShell>
    );
}
