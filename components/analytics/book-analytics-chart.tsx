"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BookAnalyticsChartProps {
  data: Array<{ date: string; revenue: number; units: number }>;
  bookTitle?: string;
  granularity?: "daily" | "weekly" | "monthly";
  onGranularityChange?: (granularity: "daily" | "weekly" | "monthly") => void;
}

export function BookAnalyticsChart({
  data,
  bookTitle,
  granularity = "daily",
  onGranularityChange,
}: BookAnalyticsChartProps) {
  const [metric, setMetric] = useState<"revenue" | "units">("revenue");

  // Format date for display
  const formattedData = data.map((item) => ({
    ...item,
    displayDate: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: granularity === "daily" ? "numeric" : undefined,
      year: granularity === "monthly" ? "numeric" : undefined,
    }),
  }));

  // Empty state
  if (data.length === 0) {
    return (
      <Card className="border border-stroke bg-surface shadow-soft rounded-lg">
        <CardHeader>
          <CardTitle className="text-heading-2 text-ink">
            {bookTitle ? `${bookTitle} Analytics` : "Book Analytics"}
          </CardTitle>
          <CardDescription className="text-small text-charcoal">
            No data available for the selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-charcoal">
            <p>Connect a platform and record sales to see analytics here.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-stroke bg-surface shadow-soft rounded-lg overflow-hidden">
      <CardHeader className="pb-6 pt-6 px-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="text-heading-2 text-ink">
              {bookTitle ? `${bookTitle} Analytics` : "Book Performance"}
            </CardTitle>
            <CardDescription className="text-small text-charcoal mt-1">
              {granularity.charAt(0).toUpperCase() + granularity.slice(1)} trends
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {/* Granularity toggles */}
            {onGranularityChange && (
              <>
                <Button
                  variant={granularity === "daily" ? "default" : "outline"}
                  size="sm"
                  className="text-xs px-3 h-8"
                  onClick={() => onGranularityChange("daily")}
                >
                  Daily
                </Button>
                <Button
                  variant={granularity === "weekly" ? "default" : "outline"}
                  size="sm"
                  className="text-xs px-3 h-8"
                  onClick={() => onGranularityChange("weekly")}
                >
                  Weekly
                </Button>
                <Button
                  variant={granularity === "monthly" ? "default" : "outline"}
                  size="sm"
                  className="text-xs px-3 h-8"
                  onClick={() => onGranularityChange("monthly")}
                >
                  Monthly
                </Button>
              </>
            )}
            {/* Metric toggles */}
            <Button
              variant={metric === "revenue" ? "default" : "outline"}
              size="sm"
              className="text-xs px-3 h-8"
              onClick={() => setMetric("revenue")}
            >
              Revenue
            </Button>
            <Button
              variant={metric === "units" ? "default" : "outline"}
              size="sm"
              className="text-xs px-3 h-8"
              onClick={() => setMetric("units")}
            >
              Units
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis
                dataKey="displayDate"
                tick={{ fontSize: 12, fill: "#64748B" }}
                axisLine={false}
                tickLine={false}
                minTickGap={20}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#64748B" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value: number) =>
                  metric === "revenue" ? `$${value}` : value.toString()
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#E2E8F0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                itemStyle={{ color: "#1E293B", fontWeight: 500 }}
                labelStyle={{ color: "#64748B", marginBottom: "4px" }}
                formatter={(value: number) =>
                  metric === "revenue" ? `$${value.toFixed(2)}` : value
                }
              />
              <Line
                type="monotone"
                dataKey={metric}
                stroke="#701a2e"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#701a2e", strokeWidth: 0 }}
                name={metric === "revenue" ? "Revenue" : "Units Sold"}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
