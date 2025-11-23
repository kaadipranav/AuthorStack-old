"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, AlertCircle } from "lucide-react";

interface PricingRecommendation {
  id: string;
  recommendationType: "increase" | "decrease" | "revert" | "maintain";
  suggestedPrice: number | null;
  reasoning: string;
  metadata: Record<string, unknown>;
}

interface PricingSuggestionsProps {
  recommendations: PricingRecommendation[];
  currentPrice?: number;
  bookTitle?: string;
}

const recommendationConfig = {
  increase: {
    icon: TrendingUp,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    label: "Consider Increase",
  },
  decrease: {
    icon: TrendingDown,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    label: "Consider Decrease",
  },
  revert: {
    icon: AlertCircle,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    label: "Revert Price",
  },
  maintain: {
    icon: Minus,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    label: "Maintain Price",
  },
};

export function PricingSuggestions({ recommendations, currentPrice, bookTitle }: PricingSuggestionsProps) {
  // Empty state
  if (recommendations.length === 0) {
    return (
      <Card className="border border-stroke bg-surface shadow-soft rounded-lg">
        <CardHeader>
          <CardTitle className="text-heading-2 text-ink">Pricing Assistant</CardTitle>
          <CardDescription className="text-small text-charcoal mt-1">
            AI-powered pricing recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-32 flex items-center justify-center text-charcoal">
            <p>No pricing data available. Add sales history to get recommendations.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-stroke bg-surface shadow-soft rounded-lg overflow-hidden">
      <CardHeader className="pb-6 pt-6 px-6">
        <div>
          <CardTitle className="text-heading-2 text-ink">Pricing Assistant</CardTitle>
          <CardDescription className="text-small text-charcoal mt-1">
            {bookTitle ? `Recommendations for ${bookTitle}` : "Rule-based pricing suggestions"}
          </CardDescription>
        </div>
        {currentPrice && (
          <div className="mt-4 p-3 bg-glass rounded-lg border border-stroke">
            <p className="text-sm text-charcoal">Current Price</p>
            <p className="text-2xl font-bold text-ink mt-1">${currentPrice.toFixed(2)}</p>
          </div>
        )}
      </CardHeader>
      <CardContent className="px-6 pb-6 space-y-4">
        {recommendations.map((rec) => {
          const config = recommendationConfig[rec.recommendationType];
          const Icon = config.icon;

          return (
            <div
              key={rec.id}
              className={`p-4 rounded-lg border ${config.borderColor} ${config.bgColor}`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 ${config.color} mt-0.5 flex-shrink-0`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant="outline"
                      className={`${config.color} ${config.borderColor} bg-white`}
                    >
                      {config.label}
                    </Badge>
                    {rec.suggestedPrice && (
                      <span className={`text-lg font-bold ${config.color}`}>
                        ${rec.suggestedPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-ink">{rec.reasoning}</p>

                  {/* Show metadata if available */}
                  {rec.metadata && Object.keys(rec.metadata).length > 0 && (
                    <div className="mt-3 p-2 bg-white/50 rounded text-xs text-charcoal">
                      <p className="font-medium mb-1">Analysis Details:</p>
                      {rec.metadata.previousPrice && typeof rec.metadata.previousPrice === "number" && (
                        <p>Previous: ${rec.metadata.previousPrice.toFixed(2)}</p>
                      )}
                      {rec.metadata.categoryAverage && typeof rec.metadata.categoryAverage === "number" && (
                        <p>Category Avg: ${rec.metadata.categoryAverage.toFixed(2)}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        <div className="mt-6 p-4 bg-glass rounded-lg border border-stroke">
          <p className="text-xs text-charcoal">
            <strong>Note:</strong> These are rule-based suggestions. Consider market conditions,
            competition, and your sales goals before making changes. Phase 3+ will introduce
            automated A/B testing and dynamic pricing.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
