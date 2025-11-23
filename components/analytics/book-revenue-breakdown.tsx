"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface BookRevenueBreakdownProps {
  books: Array<{ bookId: string; bookTitle: string; revenue: number; units: number }>;
}

const COLORS = ["#701a2e", "#8b2439", "#a62e44", "#c1384f", "#dc425a"];

export function BookRevenueBreakdown({ books }: BookRevenueBreakdownProps) {
  // Empty state
  if (books.length === 0) {
    return (
      <Card className="border border-stroke bg-surface shadow-soft rounded-lg">
        <CardHeader>
          <CardTitle className="text-heading-2 text-ink">Revenue by Book</CardTitle>
          <CardDescription className="text-small text-charcoal">
            No book sales data available
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-charcoal">
            <p>Add books and record sales to see breakdown.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format data for chart
  const chartData = books.slice(0, 10).map((book) => ({
    name: book.bookTitle.length > 25 ? book.bookTitle.slice(0, 25) + "..." : book.bookTitle,
    revenue: book.revenue,
    units: book.units,
  }));

  return (
    <Card className="border border-stroke bg-surface shadow-soft rounded-lg overflow-hidden">
      <CardHeader className="pb-6 pt-6 px-6">
        <CardTitle className="text-heading-2 text-ink">Revenue by Book</CardTitle>
        <CardDescription className="text-small text-charcoal mt-1">
          Top performing titles (last 30 days)
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#64748B" }}
                axisLine={false}
                tickLine={false}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#64748B" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value: number) => `$${value}`}
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
                formatter={(value: number) => `$${value.toFixed(2)}`}
              />
              <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Book list with stats */}
        <div className="mt-6 space-y-3">
          {books.slice(0, 5).map((book, idx) => (
            <div key={book.bookId} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                />
                <span className="text-ink font-medium truncate max-w-[200px]">{book.bookTitle}</span>
              </div>
              <div className="flex gap-6 text-charcoal">
                <span>${book.revenue.toFixed(2)}</span>
                <span>{book.units} units</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
