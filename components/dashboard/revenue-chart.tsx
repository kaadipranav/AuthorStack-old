"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RevenueChartProps {
    data: Array<{ date: string; amount: number }>;
}

export function RevenueChart({ data }: RevenueChartProps) {
    // Format date for display (e.g., "Nov 22")
    const formattedData = data.map(item => ({
        ...item,
        displayDate: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    }));

    return (
        <Card className="border border-stroke bg-surface shadow-soft rounded-lg overflow-hidden">
            <CardHeader className="pb-6 pt-6 px-6">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-heading-2 text-ink">Revenue Overview</CardTitle>
                        <CardDescription className="text-small text-charcoal mt-1">
                            Last 30 days performance
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="text-xs px-3 h-8">7d</Button>
                        <Button size="sm" className="text-xs px-3 h-8 bg-burgundy hover:bg-burgundy/90">30d</Button>
                        <Button variant="outline" size="sm" className="text-xs px-3 h-8">90d</Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={formattedData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis
                                dataKey="displayDate"
                                tick={{ fontSize: 12, fill: "#64748B" }}
                                axisLine={false}
                                tickLine={false}
                                minTickGap={30}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: "#64748B" }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#FFFFFF",
                                    borderColor: "#E2E8F0",
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                                }}
                                itemStyle={{ color: "#1E293B", fontWeight: 500 }}
                                labelStyle={{ color: "#64748B", marginBottom: "4px" }}
                                formatter={(value: number) => [`$${value.toFixed(2)}`, "Revenue"]}
                            />
                            <Line
                                type="monotone"
                                dataKey="amount"
                                stroke="#701a2e" // Burgundy
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4, fill: "#701a2e", strokeWidth: 0 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
