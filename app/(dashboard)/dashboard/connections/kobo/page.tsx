"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormSubmit } from "@/components/forms/form-submit";
import { uploadCsvReportAction } from "@/lib/platforms/actions";

export default function KoboConnectionPage() {
    const [message, setMessage] = useState<string | null>(null);

    async function handleUpload(formData: FormData) {
        const result = await uploadCsvReportAction(formData, "kobo");
        setMessage(result.message);
    }

    return (
        <DashboardShell
            title="Kobo Writing Life"
            description="Upload CSV sales reports from Kobo Writing Life to sync your ebook sales data."
        >
            <div className="grid gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Upload Kobo CSV Report</CardTitle>
                        <CardDescription>
                            Download and upload your sales report from Kobo Writing Life dashboard.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={handleUpload} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="koboCsv">Kobo Sales Report (CSV)</Label>
                                <Input id="koboCsv" name="file" type="file" accept=".csv" required />
                            </div>
                            {message ? <p className="text-sm text-charcoal">{message}</p> : null}
                            <FormSubmit pendingLabel="Uploading...">Upload CSV</FormSubmit>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>How to Export from Kobo</CardTitle>
                        <CardDescription>
                            Step-by-step guide to download your sales report
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <ol className="list-decimal list-inside text-sm text-charcoal space-y-2">
                            <li>Log in to your Kobo Writing Life account</li>
                            <li>Go to the <strong>Dashboard</strong> or <strong>Sales</strong> section</li>
                            <li>Click on <strong>Payment Information</strong> or <strong>Download Report</strong></li>
                            <li>Select your date range (monthly reports recommended)</li>
                            <li>Download the CSV file</li>
                            <li>Upload the file using the form above</li>
                        </ol>
                        <div className="rounded bg-amber/10 border border-amber/20 p-4 mt-4">
                            <p className="text-sm text-charcoal">
                                <strong>Expected Format:</strong> Kobo CSV reports typically include columns like Date, Title, ISBN, Units, Revenue, and Currency.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardShell>
    );
}
