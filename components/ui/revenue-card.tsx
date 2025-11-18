"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
            className="text-mini"
          >
            {trend === "up" ? "▲" : "▼"} {change}
          </Badge>
        </div>
        <p className="text-mini text-charcoal mt-1">{description}</p>
        
        {/* Sparkline visualization placeholder */}
        {sparklineData && (
          <div className="mt-3 h-10 w-full">
            <div className="h-full w-full rounded bg-glass border border-stroke flex items-end justify-between px-1">
              {sparklineData.map((value, index) => (
                <div 
                  key={index} 
                  className="w-1 bg-burgundy rounded-t"
                  style={{ height: `${(value / Math.max(...sparklineData)) * 100}%` }}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}