import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { services } from "@/lib/services";
import { requireAuth } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function SalesPage() {
    const user = await requireAuth();
    const salesStats = await services.sales.getSalesStats(user.id);

    return (
        <DashboardShell
            title="Sales & Revenue"
            description="Detailed breakdown of your book sales across all platforms."
        >
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-charcoal">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-ink">
                            ${salesStats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                        <p className="text-xs text-charcoal mt-1">Lifetime earnings</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-charcoal">Total Units</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-ink">{salesStats.totalUnits.toLocaleString()}</div>
                        <p className="text-xs text-charcoal mt-1">Books sold</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Latest sales events from all connected platforms.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-32 text-charcoal">
                        No recent transactions found.
                    </div>
                </CardContent>
            </Card>
        </DashboardShell>
    );
}
