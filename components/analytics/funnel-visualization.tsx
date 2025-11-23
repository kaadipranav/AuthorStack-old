"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FunnelVisualizationProps {
  data: {
    impressions: number;
    clicks: number;
    conversions: number;
    clickThroughRate: number;
    conversionRate: number;
  };
  onAddEvent?: () => void;
}

export function FunnelVisualization({ data, onAddEvent }: FunnelVisualizationProps) {
  const { impressions, clicks, conversions, clickThroughRate, conversionRate } = data;

  // Calculate percentages for visual representation
  const maxValue = impressions || 1;
  const clicksPercentage = (clicks / maxValue) * 100;
  const conversionsPercentage = (conversions / maxValue) * 100;

  // Empty state
  if (impressions === 0 && clicks === 0 && conversions === 0) {
    return (
      <Card className="border border-stroke bg-surface shadow-soft rounded-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-heading-2 text-ink">Reader Funnel</CardTitle>
              <CardDescription className="text-small text-charcoal mt-1">
                Track impressions → clicks → conversions
              </CardDescription>
            </div>
            {onAddEvent && (
              <Button size="sm" onClick={onAddEvent}>
                Add Event
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex flex-col items-center justify-center text-center text-charcoal space-y-3">
            <p>No funnel data yet.</p>
            <p className="text-sm">
              Start tracking impressions, clicks, and conversions manually.
            </p>
            {onAddEvent && (
              <Button size="sm" variant="outline" onClick={onAddEvent}>
                Record Your First Event
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-stroke bg-surface shadow-soft rounded-lg overflow-hidden">
      <CardHeader className="pb-6 pt-6 px-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-heading-2 text-ink">Reader Funnel</CardTitle>
            <CardDescription className="text-small text-charcoal mt-1">
              Conversion metrics for the selected period
            </CardDescription>
          </div>
          {onAddEvent && (
            <Button size="sm" onClick={onAddEvent}>
              Add Event
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="space-y-6">
          {/* Funnel Stage 1: Impressions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-burgundy/10 text-burgundy border-burgundy/20">
                  Impressions
                </Badge>
                <span className="text-2xl font-bold text-ink">{impressions.toLocaleString()}</span>
              </div>
              <span className="text-sm text-charcoal">100%</span>
            </div>
            <div className="w-full h-12 bg-burgundy rounded-lg flex items-center justify-center text-white font-medium">
              {impressions.toLocaleString()} Views
            </div>
          </div>

          {/* Funnel Stage 2: Clicks */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-burgundy/10 text-burgundy border-burgundy/20">
                  Clicks
                </Badge>
                <span className="text-2xl font-bold text-ink">{clicks.toLocaleString()}</span>
              </div>
              <span className="text-sm text-charcoal">
                {clickThroughRate.toFixed(1)}% CTR
              </span>
            </div>
            <div
              className="h-10 bg-burgundy/80 rounded-lg flex items-center justify-center text-white font-medium transition-all"
              style={{ width: `${clicksPercentage}%`, minWidth: "120px" }}
            >
              {clicks.toLocaleString()} Clicks
            </div>
          </div>

          {/* Funnel Stage 3: Conversions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-burgundy/10 text-burgundy border-burgundy/20">
                  Conversions
                </Badge>
                <span className="text-2xl font-bold text-ink">{conversions.toLocaleString()}</span>
              </div>
              <span className="text-sm text-charcoal">
                {conversionRate.toFixed(1)}% CR
              </span>
            </div>
            <div
              className="h-10 bg-burgundy/60 rounded-lg flex items-center justify-center text-white font-medium transition-all"
              style={{ width: `${conversionsPercentage}%`, minWidth: "100px" }}
            >
              {conversions.toLocaleString()} Sales
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-stroke">
            <div className="text-center">
              <p className="text-sm text-charcoal">Click-Through Rate</p>
              <p className="text-xl font-bold text-ink mt-1">{clickThroughRate.toFixed(2)}%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-charcoal">Conversion Rate</p>
              <p className="text-xl font-bold text-ink mt-1">{conversionRate.toFixed(2)}%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-charcoal">Overall Conversion</p>
              <p className="text-xl font-bold text-ink mt-1">
                {impressions > 0 ? ((conversions / impressions) * 100).toFixed(2) : "0.00"}%
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
