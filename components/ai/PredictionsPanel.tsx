"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, AlertCircle, RefreshCw } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface Prediction {
  id: string;
  bookId: string | null;
  bookTitle?: string;
  predictionType: string;
  predictionValue: number;
  confidenceScore: number;
  timeHorizonDays: number | null;
  validFrom: string;
}

interface PredictionsPanelProps {
  bookId?: string;
}

export function PredictionsPanel({ bookId }: PredictionsPanelProps) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchPredictions();
  }, [bookId]);

  const fetchPredictions = async () => {
    try {
      const params = new URLSearchParams();
      if (bookId) params.set("bookId", bookId);
      
      const response = await fetch(`/api/ai/predictions?${params}`);
      if (!response.ok) throw new Error("Failed to fetch");
      
      const { data } = await response.json();
      setPredictions(data.predictions || []);
    } catch (error) {
      console.error("Failed to fetch predictions:", error);
    } finally {
      setLoading(false);
    }
  };

  const generatePrediction = async (type: "revenue_forecast" | "churn_risk") => {
    if (!bookId) return;
    
    setGenerating(true);
    try {
      const response = await fetch("/api/ai/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId,
          predictionType: type,
          timeHorizonDays: type === "revenue_forecast" ? 30 : undefined,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate");
      
      await fetchPredictions();
    } catch (error) {
      console.error("Failed to generate prediction:", error);
    } finally {
      setGenerating(false);
    }
  };

  const revenuePredictions = predictions.filter((p) => p.predictionType === "revenue_forecast");
  const churnPredictions = predictions.filter((p) => p.predictionType === "churn_risk");

  if (loading) {
    return (
      <Card className="border-stroke bg-surface">
        <CardHeader>
          <CardTitle className="text-heading-3 text-ink">AI Predictions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <RefreshCw className="h-6 w-6 animate-spin text-charcoal" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Revenue Forecasts */}
      <Card className="border-stroke bg-surface">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-heading-3 text-ink flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-burgundy" />
                Revenue Forecasts
              </CardTitle>
              <CardDescription className="text-charcoal">
                30-day revenue predictions based on historical data
              </CardDescription>
            </div>
            {bookId && (
              <Button
                onClick={() => generatePrediction("revenue_forecast")}
                disabled={generating}
                size="sm"
                variant="outline"
              >
                {generating ? "Generating..." : "Generate New"}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {revenuePredictions.length === 0 ? (
            <div className="text-center py-8 text-charcoal">
              <p>No revenue forecasts available</p>
              {bookId && (
                <Button
                  onClick={() => generatePrediction("revenue_forecast")}
                  disabled={generating}
                  className="mt-4"
                  variant="outline"
                >
                  Generate Forecast
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {revenuePredictions.map((pred) => (
                <div key={pred.id} className="rounded-lg border border-stroke p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-ink">
                      ${pred.predictionValue.toFixed(2)}
                    </span>
                    <span className="text-sm text-charcoal">
                      {pred.timeHorizonDays} days
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <div
                        className="h-2 w-16 rounded-full bg-stroke"
                        style={{
                          background: `linear-gradient(to right, var(--burgundy) ${
                            pred.confidenceScore * 100
                          }%, var(--stroke) ${pred.confidenceScore * 100}%)`,
                        }}
                      />
                      <span className="text-charcoal">
                        {(pred.confidenceScore * 100).toFixed(0)}% confidence
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Churn Risk */}
      <Card className="border-stroke bg-surface">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-heading-3 text-ink flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-burgundy" />
                Churn Risk Analysis
              </CardTitle>
              <CardDescription className="text-charcoal">
                Detect declining sales trends and engagement
              </CardDescription>
            </div>
            {bookId && (
              <Button
                onClick={() => generatePrediction("churn_risk")}
                disabled={generating}
                size="sm"
                variant="outline"
              >
                {generating ? "Analyzing..." : "Analyze Now"}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {churnPredictions.length === 0 ? (
            <div className="text-center py-8 text-charcoal">
              <p>No churn analysis available</p>
              {bookId && (
                <Button
                  onClick={() => generatePrediction("churn_risk")}
                  disabled={generating}
                  className="mt-4"
                  variant="outline"
                >
                  Analyze Churn Risk
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {churnPredictions.map((pred) => {
                const riskLevel =
                  pred.predictionValue > 0.7
                    ? "high"
                    : pred.predictionValue > 0.4
                    ? "medium"
                    : "low";
                const riskColor =
                  riskLevel === "high"
                    ? "text-danger"
                    : riskLevel === "medium"
                    ? "text-warning"
                    : "text-success";

                return (
                  <div key={pred.id} className="rounded-lg border border-stroke p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-semibold ${riskColor}`}>
                        {(pred.predictionValue * 100).toFixed(1)}% risk
                      </span>
                      <span className="text-sm text-charcoal capitalize">
                        {riskLevel} risk
                      </span>
                    </div>
                    <p className="text-sm text-charcoal">
                      {riskLevel === "high"
                        ? "Significant decline detected. Consider a relaunch campaign."
                        : riskLevel === "medium"
                        ? "Sales trending downward. Monitor closely and refresh marketing."
                        : "Sales stable or growing. Keep current strategy."}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
