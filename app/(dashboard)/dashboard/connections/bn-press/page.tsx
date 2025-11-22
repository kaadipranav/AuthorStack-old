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

export default function BarnesNobleConnectionPage() {
    const [message, setMessage] = useState<string | null>(null);

    async function handleUpload(formData: FormData) {
        const result = await uploadCsvReportAction(formData, "bn_press");
        setMessage(result.message);
    }

    return (
        <DashboardShell
            title="Barnes & Noble Press"
            description="Upload B&N Press sales reports to track your Nook ebook sales."
        >
            <div className="grid gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Upload Barnes & Noble CSV Report</CardTitle>
                        <CardDescription>
                            Download and upload your sales report from Barnes & Noble Press.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={handleUpload} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="bnCsv">B&N Press Sales Report (CSV)</Label>
                                <Input id="bnCsv" name="file" type="file" accept=".csv" required />
                            </div>
                            {message ? <p className="text-sm text-charcoal">{message}</p> : null}
                            <FormSubmit pendingLabel="Uploading...">Upload CSV</FormSubmit>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>How to Export from B&N Press</CardTitle>
                        <CardDescription>
                            Step-by-step guide to download your sales report
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <ol className="list-decimal list-inside text-sm text-charcoal space-y-2">
                            <li>Log in to <a href="https://press.barnesandnoble.com" target="_blank" rel="noopener noreferrer" className="text-burgundy underline">Barnes & Noble Press</a></li>
                            <li>Go to <strong>Sales Dashboard</strong> or <strong>Reports</strong></li>
                            <li>Click on <strong>Download Sales Report</strong></li>
                            <li>Select your date range (monthly reports recommended)</li>
                            <li>Choose CSV format for download</li>
                            <li>Upload the file using the form above</li>
                        </ol>
                        <div className="rounded bg-amber/10 border border-amber/20 p-4 mt-4">
                            <p className="text-sm text-charcoal">
                                <strong>Expected Format:</strong> B&N Press reports include columns like Title, Net Units, Royalty/Earnings, and Sale Date.
                            </p>
                        </div>
                        <Button asChild variant="outline" className="mt-4">
                            <Link href="https://press.barnesandnoble.com" target="_blank" rel="noopener noreferrer">
                                Open B&N Press
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>About Barnes & Noble Press</CardTitle>
                        <CardDescription>
                            Platform information
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="text-sm text-charcoal">
                            Barnes & Noble Press (formerly NOOK Press) is B&N's self-publishing platform for ebooks and print books.
                            Sales reports provide detailed data from the Nook ecosystem.
                        </p>
                        <div className="rounded bg-glass border border-stroke p-4">
                            <p className="text-sm text-charcoal">
                                <strong>Tip:</strong> Download your reports monthly to keep your AuthorStack dashboard up to date with the latest Nook sales data.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardShell>
    );
}
