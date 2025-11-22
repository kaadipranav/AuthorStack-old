"use client";

import { useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormSubmit } from "@/components/forms/form-submit";
import { uploadCsvReportAction } from "@/lib/platforms/actions";

export default function GooglePlayConnectionPage() {
    const [message, setMessage] = useState<string | null>(null);

    async function handleUpload(formData: FormData) {
        const result = await uploadCsvReportAction(formData, "google_play");
        setMessage(result.message);
    }

    return (
        <DashboardShell
            title="Google Play Books"
            description="Upload Partner Center CSV reports to sync your Google Play Books sales."
        >
            <div className="grid gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Upload Google Play CSV Report</CardTitle>
                        <CardDescription>
                            Download and upload your sales report from Google Play Partner Center.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={handleUpload} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="googleCsv">Google Play Books Sales Report (CSV)</Label>
                                <Input id="googleCsv" name="file" type="file" accept=".csv" required />
                            </div>
                            {message ? <p className="text-sm text-charcoal">{message}</p> : null}
                            <FormSubmit pendingLabel="Uploading...">Upload CSV</FormSubmit>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>How to Export from Google Play Partner Center</CardTitle>
                        <CardDescription>
                            Step-by-step guide to download your sales report
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <ol className="list-decimal list-inside text-sm text-charcoal space-y-2">
                            <li>Log in to <a href="https://play.google.com/books/publish" target="_blank" rel="noopener noreferrer" className="text-burgundy underline">Google Play Partner Center</a></li>
                            <li>Go to <strong>Orders</strong> or <strong>Reports</strong> section</li>
                            <li>Select <strong>Transaction History</strong> or <strong>Sales Report</strong></li>
                            <li>Choose your date range</li>
                            <li>Click <strong>Export</strong> and select CSV format</li>
                            <li>Upload the file using the form above</li>
                        </ol>
                        <div className="rounded bg-amber/10 border border-amber/20 p-4 mt-4">
                            <p className="text-sm text-charcoal">
                                <strong>Expected Format:</strong> Google Play reports include columns like Book Title, Quantity, Buyer Revenue, Currency, and Transaction Date.
                            </p>
                        </div>
                        <Button asChild variant="outline" className="mt-4">
                            <Link href="https://play.google.com/books/publish" target="_blank" rel="noopener noreferrer">
                                Open Partner Center
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>About Google Play Books</CardTitle>
                        <CardDescription>
                            Platform information
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="text-sm text-charcoal">
                            Google Play Books reaches readers across 75+ countries through the Google Play ecosystem.
                            CSV reports provide detailed transaction data for all your ebook sales.
                        </p>
                        <div className="rounded bg-forest/10 border border-forest/20 p-4">
                            <p className="text-sm text-charcoal">
                                <strong>Note:</strong> Google Play does not offer a public API for individual authors.
                                CSV export from Partner Center is the official method for accessing sales data.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardShell>
    );
}
