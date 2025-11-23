import { createSupabaseServerClient } from "@/lib/supabase/server";

// ============================================================================
// Types
// ============================================================================

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  metadata?: Record<string, any>;
}

export interface ChatContext {
  profileId: string;
  books?: any[];
  recentSales?: any[];
  competitors?: any[];
  activeGoals?: string[];
  userNotes?: any[];
}

export interface ChatResponse {
  message: string;
  suggestions?: string[];
  metadata?: Record<string, any>;
}

export interface Prediction {
  id: string;
  bookId: string | null;
  predictionType: "revenue_forecast" | "churn_risk" | "engagement_score" | "sales_trend";
  predictionValue: number;
  confidenceScore: number;
  timeHorizonDays: number | null;
  featuresUsed: Record<string, any>;
  validFrom: Date;
  validUntil: Date | null;
}

export interface AIInsight {
  id: string;
  insightType: "sales_trend" | "competitor_analysis" | "marketing_opportunity" | "performance_alert" | "strategic_recommendation";
  title: string;
  summary: string;
  details: Record<string, any>;
  priority: "low" | "medium" | "high" | "critical";
  status: "active" | "dismissed" | "acted_upon";
  relatedBookIds: string[];
  relatedCompetitorIds: string[];
}

export interface Recommendation {
  type: "pricing" | "marketing" | "content" | "strategic";
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  expectedImpact: string;
  actionItems: string[];
  confidence: number;
  metadata?: Record<string, any>;
}

// ============================================================================
// AI Assistant Service
// ============================================================================

export class AIAssistantService {
  /**
   * Send message to AI assistant with context
   */
  async chat(
    profileId: string,
    message: string,
    sessionId?: string
  ): Promise<ChatResponse> {
    const supabase = await createSupabaseServerClient();

    // Store user message
    const newSessionId = sessionId || crypto.randomUUID();
    await supabase.from("ai_conversations").insert({
      profile_id: profileId,
      session_id: newSessionId,
      role: "user",
      content: message,
    });

    // Build context for AI
    const context = await this.buildContext(profileId);

    // Call AI provider (OpenRouter/Anthropic)
    const aiResponse = await this.callAIProvider(message, context, newSessionId);

    // Store assistant response
    await supabase.from("ai_conversations").insert({
      profile_id: profileId,
      session_id: newSessionId,
      role: "assistant",
      content: aiResponse.message,
      metadata: aiResponse.metadata,
    });

    return aiResponse;
  }

  /**
   * Get conversation history for session
   */
  async getConversationHistory(
    profileId: string,
    sessionId: string
  ): Promise<ChatMessage[]> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("ai_conversations")
      .select("role, content, metadata, created_at")
      .eq("profile_id", profileId)
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (error) throw new Error(`Failed to fetch conversation history: ${error.message}`);

    return (data || []).map((msg) => ({
      role: msg.role as "user" | "assistant" | "system",
      content: msg.content,
      metadata: msg.metadata,
    }));
  }

  /**
   * Build context from user's data
   */
  private async buildContext(profileId: string): Promise<ChatContext> {
    const supabase = await createSupabaseServerClient();

    // Fetch user's books
    const { data: books } = await supabase
      .from("books")
      .select("id, title, format, status, launch_date")
      .eq("profile_id", profileId)
      .limit(10);

    // Fetch recent sales data
    const { data: recentSales } = await supabase
      .from("book_analytics_daily")
      .select("book_id, date, revenue, units_sold, platform")
      .eq("profile_id", profileId)
      .gte("date", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order("date", { ascending: false })
      .limit(50);

    // Fetch competitors
    const { data: competitors } = await supabase
      .from("competitors")
      .select("id, title, author, platform")
      .eq("profile_id", profileId)
      .limit(5);

    // Fetch user notes
    const { data: userNotes } = await supabase
      .from("user_notes")
      .select("content, note_type, tags, created_at")
      .eq("profile_id", profileId)
      .order("created_at", { ascending: false })
      .limit(10);

    return {
      profileId,
      books: books || [],
      recentSales: recentSales || [],
      competitors: competitors || [],
      userNotes: userNotes || [],
    };
  }

  /**
   * Call AI provider (placeholder for OpenRouter/Anthropic integration)
   */
  private async callAIProvider(
    message: string,
    context: ChatContext,
    sessionId: string
  ): Promise<ChatResponse> {
    // TODO: Integrate with OpenRouter/Anthropic API
    // This is a placeholder that will be replaced with actual AI API calls

    const systemPrompt = `You are an AI assistant for AuthorStack, helping indie authors with book launches, pricing, marketing, and sales optimization.

User Context:
- Books: ${context.books?.length || 0} books tracked
- Recent Sales: Last 30 days of sales data available
- Competitors: ${context.competitors?.length || 0} competitors tracked
- User Notes: ${context.userNotes?.length || 0} manual observations

Provide helpful, actionable advice specific to book publishing and marketing.`;

    // Placeholder response logic
    const response: ChatResponse = {
      message: "AI integration pending. Add OPENROUTER_API_KEY or ANTHROPIC_API_KEY to environment variables.",
      suggestions: [
        "Check your book analytics",
        "Review pricing recommendations",
        "Analyze competitor data",
      ],
      metadata: {
        model: "placeholder",
        sessionId,
      },
    };

    return response;
  }
}

// ============================================================================
// Prediction Engine Service
// ============================================================================

export class PredictionEngineService {
  /**
   * Generate revenue forecast for a book
   */
  async generateRevenueForecast(
    profileId: string,
    bookId: string,
    timeHorizonDays: number = 30
  ): Promise<Prediction> {
    const supabase = await createSupabaseServerClient();

    // Fetch historical sales data
    const { data: salesData } = await supabase
      .from("book_analytics_daily")
      .select("date, revenue, units_sold")
      .eq("profile_id", profileId)
      .eq("book_id", bookId)
      .gte("date", new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())
      .order("date", { ascending: true });

    if (!salesData || salesData.length === 0) {
      throw new Error("Insufficient historical data for forecasting");
    }

    // Simple moving average prediction (replace with ML model)
    const recentRevenue = salesData.slice(-30);
    const avgDailyRevenue =
      recentRevenue.reduce((sum, day) => sum + Number(day.revenue), 0) / recentRevenue.length;
    const predictedRevenue = avgDailyRevenue * timeHorizonDays;

    // Calculate confidence based on data consistency
    const variance = this.calculateVariance(recentRevenue.map((d) => Number(d.revenue)));
    const confidence = Math.max(0.3, Math.min(0.95, 1 - variance / (avgDailyRevenue * 2)));

    // Store prediction
    const { data: prediction, error } = await supabase
      .from("ai_predictions")
      .insert({
        profile_id: profileId,
        book_id: bookId,
        prediction_type: "revenue_forecast",
        prediction_value: predictedRevenue,
        confidence_score: confidence,
        time_horizon_days: timeHorizonDays,
        features_used: {
          historical_days: salesData.length,
          avg_daily_revenue: avgDailyRevenue,
          trend: "stable",
        },
        model_version: "simple_moving_average_v1",
        valid_from: new Date(),
        valid_until: new Date(Date.now() + timeHorizonDays * 24 * 60 * 60 * 1000),
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to store prediction: ${error.message}`);

    return this.mapToPrediction(prediction);
  }

  /**
   * Detect churn risk for a book
   */
  async detectChurnRisk(profileId: string, bookId: string): Promise<Prediction> {
    const supabase = await createSupabaseServerClient();

    // Fetch recent sales trends
    const { data: salesData } = await supabase
      .from("book_analytics_daily")
      .select("date, revenue, units_sold")
      .eq("profile_id", profileId)
      .eq("book_id", bookId)
      .gte("date", new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString())
      .order("date", { ascending: true });

    if (!salesData || salesData.length < 14) {
      throw new Error("Insufficient data for churn analysis");
    }

    // Calculate trend (declining sales = higher churn risk)
    const firstHalf = salesData.slice(0, Math.floor(salesData.length / 2));
    const secondHalf = salesData.slice(Math.floor(salesData.length / 2));

    const firstHalfAvg =
      firstHalf.reduce((sum, d) => sum + Number(d.revenue), 0) / firstHalf.length;
    const secondHalfAvg =
      secondHalf.reduce((sum, d) => sum + Number(d.revenue), 0) / secondHalf.length;

    const churnRisk = Math.max(
      0,
      Math.min(1, (firstHalfAvg - secondHalfAvg) / firstHalfAvg)
    );

    // Store prediction
    const { data: prediction, error } = await supabase
      .from("ai_predictions")
      .insert({
        profile_id: profileId,
        book_id: bookId,
        prediction_type: "churn_risk",
        prediction_value: churnRisk,
        confidence_score: salesData.length > 30 ? 0.8 : 0.6,
        features_used: {
          first_half_avg: firstHalfAvg,
          second_half_avg: secondHalfAvg,
          trend: secondHalfAvg < firstHalfAvg ? "declining" : "growing",
        },
        model_version: "trend_comparison_v1",
        valid_from: new Date(),
        valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to store churn prediction: ${error.message}`);

    return this.mapToPrediction(prediction);
  }

  /**
   * Get all predictions for a profile
   */
  async getPredictions(
    profileId: string,
    filters?: { bookId?: string; type?: string }
  ): Promise<Prediction[]> {
    const supabase = await createSupabaseServerClient();

    let query = supabase
      .from("ai_predictions")
      .select("*")
      .eq("profile_id", profileId)
      .order("created_at", { ascending: false });

    if (filters?.bookId) {
      query = query.eq("book_id", filters.bookId);
    }

    if (filters?.type) {
      query = query.eq("prediction_type", filters.type);
    }

    const { data, error } = await query;

    if (error) throw new Error(`Failed to fetch predictions: ${error.message}`);

    return (data || []).map(this.mapToPrediction);
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map((val) => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  }

  private mapToPrediction(data: any): Prediction {
    return {
      id: data.id,
      bookId: data.book_id,
      predictionType: data.prediction_type,
      predictionValue: Number(data.prediction_value),
      confidenceScore: Number(data.confidence_score),
      timeHorizonDays: data.time_horizon_days,
      featuresUsed: data.features_used || {},
      validFrom: new Date(data.valid_from),
      validUntil: data.valid_until ? new Date(data.valid_until) : null,
    };
  }
}

// ============================================================================
// Recommendation Engine Service
// ============================================================================

export class RecommendationEngineService {
  /**
   * Generate comprehensive recommendations for a profile
   */
  async generateRecommendations(profileId: string): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    // Pricing recommendations
    const pricingRecs = await this.generatePricingRecommendations(profileId);
    recommendations.push(...pricingRecs);

    // Marketing recommendations
    const marketingRecs = await this.generateMarketingRecommendations(profileId);
    recommendations.push(...marketingRecs);

    // Performance recommendations
    const performanceRecs = await this.generatePerformanceRecommendations(profileId);
    recommendations.push(...performanceRecs);

    return recommendations;
  }

  /**
   * Generate pricing recommendations
   */
  private async generatePricingRecommendations(
    profileId: string
  ): Promise<Recommendation[]> {
    const supabase = await createSupabaseServerClient();
    const recommendations: Recommendation[] = [];

    // Fetch books with recent sales
    const { data: books } = await supabase
      .from("books")
      .select("id, title")
      .eq("profile_id", profileId);

    if (!books || books.length === 0) return recommendations;

    // Check each book for pricing opportunities
    for (const book of books) {
      const { data: recentSales } = await supabase
        .from("book_analytics_daily")
        .select("revenue, units_sold, date")
        .eq("book_id", book.id)
        .gte("date", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order("date", { ascending: false });

      if (recentSales && recentSales.length > 0) {
        const totalRevenue = recentSales.reduce((sum, s) => sum + Number(s.revenue), 0);
        const totalUnits = recentSales.reduce((sum, s) => sum + Number(s.units_sold), 0);

        if (totalUnits > 0) {
          const avgPrice = totalRevenue / totalUnits;

          // Simple rule: if high volume, suggest price test
          if (totalUnits > 100) {
            recommendations.push({
              type: "pricing",
              title: `Price optimization opportunity: ${book.title}`,
              description: `Your book is selling well (${totalUnits} units in 30 days). Consider A/B testing a 10-15% price increase to maximize revenue.`,
              priority: "medium",
              expectedImpact: `Potential 8-12% revenue increase`,
              actionItems: [
                `Create A/B test with current price ($${avgPrice.toFixed(2)}) vs. increased price`,
                `Monitor conversion rates over 2 weeks`,
                `Implement winning price`,
              ],
              confidence: 0.7,
              metadata: {
                bookId: book.id,
                currentAvgPrice: avgPrice,
                suggestedTestPrice: avgPrice * 1.12,
              },
            });
          }
        }
      }
    }

    return recommendations;
  }

  /**
   * Generate marketing recommendations
   */
  private async generateMarketingRecommendations(
    profileId: string
  ): Promise<Recommendation[]> {
    const supabase = await createSupabaseServerClient();
    const recommendations: Recommendation[] = [];

    // Fetch funnel data
    const { data: funnelData } = await supabase
      .from("funnel_events")
      .select("event_type, source")
      .eq("profile_id", profileId)
      .gte("occurred_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (funnelData && funnelData.length > 10) {
      const impressions = funnelData.filter((e) => e.event_type === "impression").length;
      const clicks = funnelData.filter((e) => e.event_type === "click").length;
      const conversions = funnelData.filter((e) => e.event_type === "conversion").length;

      const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;

      if (conversionRate < 2) {
        recommendations.push({
          type: "marketing",
          title: "Low conversion rate detected",
          description: `Your funnel conversion rate is ${conversionRate.toFixed(1)}%, below the 2-3% industry average for self-published authors. Improve landing page copy and book description.`,
          priority: "high",
          expectedImpact: "2-3x conversion rate increase possible",
          actionItems: [
            "Review and optimize book description with clear value propositions",
            "Add social proof (reviews, testimonials)",
            "Test different cover images",
            "Add urgency elements (limited-time offers)",
          ],
          confidence: 0.75,
          metadata: {
            currentConversionRate: conversionRate,
            targetConversionRate: 2.5,
          },
        });
      }
    }

    return recommendations;
  }

  /**
   * Generate performance recommendations
   */
  private async generatePerformanceRecommendations(
    profileId: string
  ): Promise<Recommendation[]> {
    const supabase = await createSupabaseServerClient();
    const recommendations: Recommendation[] = [];

    // Identify underperforming books
    const { data: books } = await supabase
      .from("books")
      .select("id, title, launch_date")
      .eq("profile_id", profileId);

    if (!books || books.length === 0) return recommendations;

    for (const book of books) {
      if (!book.launch_date) continue;

      const daysSinceLaunch = Math.floor(
        (Date.now() - new Date(book.launch_date).getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceLaunch > 30 && daysSinceLaunch < 90) {
        const { data: salesData } = await supabase
          .from("book_analytics_daily")
          .select("revenue, units_sold")
          .eq("book_id", book.id);

        const totalRevenue = salesData?.reduce((sum, s) => sum + Number(s.revenue), 0) || 0;

        if (totalRevenue < 100) {
          recommendations.push({
            type: "strategic",
            title: `Boost needed: ${book.title}`,
            description: `This book launched ${daysSinceLaunch} days ago but has generated only $${totalRevenue.toFixed(2)}. Consider a relaunch strategy.`,
            priority: "high",
            expectedImpact: "3-5x revenue increase with focused marketing",
            actionItems: [
              "Run a promotional campaign (BookBub, Freebooksy)",
              "Refresh cover and description",
              "Engage with readers on social media",
              "Request reviews from early readers",
            ],
            confidence: 0.65,
            metadata: {
              bookId: book.id,
              daysSinceLaunch,
              currentRevenue: totalRevenue,
            },
          });
        }
      }
    }

    return recommendations;
  }

  /**
   * Record feedback on a recommendation
   */
  async recordFeedback(
    profileId: string,
    recommendationId: string,
    recommendationType: string,
    actionTaken: "accepted" | "rejected" | "modified" | "deferred",
    feedbackText?: string
  ): Promise<void> {
    const supabase = await createSupabaseServerClient();

    await supabase.from("recommendation_feedback").insert({
      profile_id: profileId,
      recommendation_id: recommendationId,
      recommendation_type: recommendationType,
      action_taken: actionTaken,
      feedback_text: feedbackText,
    });
  }
}
