"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, 
  DollarSign, 
  TrendingUp, 
  Target, 
  ThumbsUp, 
  ThumbsDown,
  RefreshCw 
} from "lucide-react";

interface Recommendation {
  id: string;
  type: "pricing" | "marketing" | "content" | "strategic";
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  expectedImpact: string;
  actionItems: string[];
  confidence: number;
  metadata?: any;
}

export function RecommendationsPanel() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch("/api/ai/recommendations");
      if (!response.ok) throw new Error("Failed to fetch");
      
      const { data } = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRecommendations();
  };

  const handleFeedback = async (
    recId: string,
    recType: string,
    action: "accepted" | "rejected"
  ) => {
    try {
      await fetch("/api/ai/recommendations/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recommendationId: recId,
          recommendationType: recType,
          actionTaken: action,
        }),
      });

      // Remove recommendation after feedback
      setRecommendations((prev) => prev.filter((r) => r.id !== recId));
    } catch (error) {
      console.error("Failed to record feedback:", error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pricing":
        return <DollarSign className="h-5 w-5" />;
      case "marketing":
        return <TrendingUp className="h-5 w-5" />;
      case "strategic":
        return <Target className="h-5 w-5" />;
      default:
        return <Lightbulb className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-danger text-surface";
      case "medium":
        return "bg-warning text-ink";
      default:
        return "bg-stroke text-ink";
    }
  };

  if (loading) {
    return (
      <Card className="border-stroke bg-surface">
        <CardHeader>
          <CardTitle className="text-heading-3 text-ink">AI Recommendations</CardTitle>
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
    <Card className="border-stroke bg-surface">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-heading-3 text-ink flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-burgundy" />
              AI Recommendations
            </CardTitle>
            <CardDescription className="text-charcoal">
              Personalized suggestions to improve your publishing business
            </CardDescription>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            size="sm"
            variant="outline"
          >
            {refreshing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              "Refresh"
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <Lightbulb className="h-12 w-12 text-charcoal/50 mx-auto" />
            <p className="text-charcoal">No recommendations available yet</p>
            <p className="text-sm text-charcoal/70">
              Add more sales data and book information to receive AI insights
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="rounded-lg border border-stroke p-4 hover:border-burgundy/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-0.5 text-burgundy">
                      {getTypeIcon(rec.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-ink">{rec.title}</h4>
                        <Badge className={getPriorityColor(rec.priority)}>
                          {rec.priority}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {rec.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-charcoal">{rec.description}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-ink">Expected Impact:</span>
                    <span className="text-charcoal">{rec.expectedImpact}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-ink">Confidence:</span>
                    <div className="flex items-center gap-2 flex-1">
                      <div
                        className="h-2 w-24 rounded-full bg-stroke"
                        style={{
                          background: `linear-gradient(to right, var(--burgundy) ${
                            rec.confidence * 100
                          }%, var(--stroke) ${rec.confidence * 100}%)`,
                        }}
                      />
                      <span className="text-charcoal">
                        {(rec.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>

                {rec.actionItems.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-ink mb-2">Action Items:</p>
                    <ul className="space-y-1 text-sm text-charcoal">
                      {rec.actionItems.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-burgundy mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-2 pt-3 border-t border-stroke">
                  <Button
                    onClick={() => handleFeedback(rec.metadata?.bookId || rec.id, rec.type, "accepted")}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Helpful
                  </Button>
                  <Button
                    onClick={() => handleFeedback(rec.metadata?.bookId || rec.id, rec.type, "rejected")}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    Not Helpful
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
