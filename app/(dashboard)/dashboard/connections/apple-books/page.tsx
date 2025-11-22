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

export default function AppleBooksConnectionPage() {
    const [message, setMessage] = useState<string | null>(null);

    async function handleUpload(formData: FormData) {
        const result = await uploadCsvReportAction(formData, "apple_books");
        setMessage(result.message);
    }

    return (
        <DashboardShell
            title="Apple Books"
            description="Upload iTunes Connect sales reports to track your Apple Books sales."
        >
            <div className="grid gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Upload Apple Books CSV Report</CardTitle>
                        <CardDescription>
                            Download and upload your sales report from iTunes Connect.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={handleUpload} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="appleCsv">Apple Books Sales Report (CSV)</Label>
                                <Input id="appleCsv" name="file" type="file" accept=".csv" required />
                            </div>
                            {message ? <p className="text-sm text-charcoal">{message}</p> : null}
                            <FormSubmit pendingLabel="Uploading...">Upload CSV</FormSubmit>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>How to Export from iTunes Connect</CardTitle>
                        <CardDescription>
                            Step-by-step guide to download your sales report
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <ol className="list-decimal list-inside text-sm text-charcoal space-y-2">
                            <li>Log in to <a href="https://itunesconnect.apple.com" target="_blank" rel="noopener noreferrer" className="text-burgundy underline">iTunes Connect</a></li>
                            <li>Go to <strong>Sales and Trends</strong></li>
                            <li>Select <strong>Books</strong> tab</li>
                            <li>Choose your date range and filters</li>
                            <li>Click <strong>Download</strong> and select CSV format</li>
                            <li>Upload the file using the form above</li>
                        </ol>
                        <div className="rounded bg-amber/10 border border-amber/20 p-4 mt-4">
                            <p className="text-sm text-charcoal">
                                <strong>Expected Format:</strong> Apple Books reports include columns like Title, Units, Proceeds, and Report Date.
                            </p>
                        </div>
                        <Button asChild variant="outline" className="mt-4">
                            <Link href="https://itunesconnect.apple.com" target="_blank" rel="noopener noreferrer">
                                Open iTunes Connect
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Alternative: Reporter Command Line Tool</CardTitle>
                        <CardDescription>
                            For automated downloads
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="text-sm text-charcoal">
                            Apple provides a command-line tool called <strong>Reporter</strong> that can automate the download of sales reports.
                        </p>
                        <Button asChild variant="outline">
                            <Link
                                href="https://help.apple.com/itc/appsreporterguide/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                View Reporter Documentation
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </DashboardShell>
    );
}
