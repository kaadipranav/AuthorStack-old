"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface RevenueCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  description: string;
  sparklineData?: number[];
}

export function RevenueCard({ 
  title, 
  value, 
  change, 
  trend, 
  description,
  sparklineData 
}: RevenueCardProps) {
  return (
    <Card className="border-stroke bg-surface">
      <CardHeader className="pb-2">
        <CardDescription className="text-small text-charcoal">
          {title}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <p className="text-heading-2 font-bold text-ink">{value}</p>
          <Badge
            variant={trend === "up" ? "default" : "secondary"}
            className="text-mini gap-1 px-2.5 py-0.5"
          >
            {trend === "up" ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" />
            )}
            {change}
          </Badge>
        </div>
        <p className="text-mini text-charcoal mt-1">{description}</p>
        
        {/* Sparkline visualization placeholder */}
        {sparklineData && (
          <div className="mt-3 h-12 w-full">
            <div className="relative h-full w-full overflow-hidden rounded-md border border-stroke bg-gradient-to-b from-burgundy/10 via-transparent to-transparent">
              <div className="absolute inset-0 flex items-end justify-between px-1">
                {sparklineData.map((value, index) => (
                  <div
                    key={index}
                    className="w-1 rounded-t bg-burgundy/80"
                    style={{ height: `${(value / Math.max(...sparklineData)) * 100}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}