# AuthorStack Phase 3 Architecture - AI Layer

**Status:** Implementation Complete  
**Version:** Phase 3.0  
**Date:** November 23, 2025

---

## Overview

Phase 3 adds AI-powered intelligence to AuthorStack, building on Phase 2 analytics. All features are **backward-compatible** and optional (controlled by feature flags).

**Phase 3 Features:**
1. **AI Assistant / Mascot** - Context-aware chat interface for author guidance
2. **AI-Powered Insights** - Sales trends, competitor intelligence, performance alerts
3. **AI Recommendations** - Pricing, marketing, and strategic suggestions
4. **Machine Learning Predictions** - Revenue forecasts and churn detection

---

## Database Schema Extensions

### New Tables

#### `ai_conversations`
Store AI assistant chat history for context continuity.

```sql
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id UUID NOT NULL,
  role TEXT CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX ai_conversations_profile_idx ON ai_conversations (profile_id, created_at DESC);
CREATE INDEX ai_conversations_session_idx ON ai_conversations (session_id, created_at ASC);
```

**Purpose:** Enable multi-turn conversations with context persistence.

---

#### `ai_predictions`
Store ML-generated forecasts (revenue, churn, engagement).

```sql
CREATE TABLE ai_predictions (
  id UUID PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  prediction_type TEXT CHECK (prediction_type IN ('revenue_forecast', 'churn_risk', 'engagement_score', 'sales_trend')),
  prediction_value NUMERIC(12,2) NOT NULL,
  confidence_score NUMERIC(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  time_horizon_days INTEGER,
  features_used JSONB DEFAULT '{}',
  model_version TEXT,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX ai_predictions_profile_idx ON ai_predictions (profile_id, prediction_type, created_at DESC);
CREATE INDEX ai_predictions_book_idx ON ai_predictions (book_id, prediction_type, valid_from DESC);
```

**Purpose:** Cache predictions for fast retrieval, track model versions for A/B testing.

---

#### `ai_insights`
AI-generated summaries, trends, and strategic alerts.

```sql
CREATE TABLE ai_insights (
  id UUID PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  insight_type TEXT CHECK (insight_type IN ('sales_trend', 'competitor_analysis', 'marketing_opportunity', 'performance_alert', 'strategic_recommendation')),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'dismissed', 'acted_upon')),
  related_book_ids UUID[],
  related_competitor_ids UUID[],
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX ai_insights_profile_idx ON ai_insights (profile_id, status, priority, generated_at DESC);
CREATE INDEX ai_insights_type_idx ON ai_insights (insight_type, status);
```

**Purpose:** Provide actionable intelligence without overwhelming users.

---

#### `user_notes`
Manual observations for AI context enrichment.

```sql
CREATE TABLE user_notes (
  id UUID PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  note_type TEXT CHECK (note_type IN ('observation', 'goal', 'experiment', 'outcome')),
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX user_notes_profile_idx ON user_notes (profile_id, created_at DESC);
CREATE INDEX user_notes_book_idx ON user_notes (book_id, created_at DESC);
CREATE INDEX user_notes_tags_idx ON user_notes USING GIN (tags);
```

**Purpose:** Allow users to add context AI can't infer (e.g., "Ran Facebook ad campaign").

---

#### `recommendation_feedback`
Track user responses to AI suggestions (learning loop).

```sql
CREATE TABLE recommendation_feedback (
  id UUID PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  recommendation_id UUID,
  recommendation_type TEXT CHECK (recommendation_type IN ('pricing', 'marketing', 'content', 'strategic')),
  action_taken TEXT CHECK (action_taken IN ('accepted', 'rejected', 'modified', 'deferred')),
  feedback_text TEXT,
  outcome_metrics JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX recommendation_feedback_profile_idx ON recommendation_feedback (profile_id, recommendation_type, created_at DESC);
```

**Purpose:** Enable feedback-driven model improvement.

---

#### `ai_model_metadata`
Track AI model versions and configurations.

```sql
CREATE TABLE ai_model_metadata (
  id UUID PRIMARY KEY,
  model_name TEXT NOT NULL,
  model_version TEXT NOT NULL,
  model_type TEXT CHECK (model_type IN ('chat', 'prediction', 'recommendation', 'insight_generation')),
  configuration JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  deployed_at TIMESTAMPTZ DEFAULT NOW(),
  deprecated_at TIMESTAMPTZ
);

CREATE INDEX ai_model_metadata_active_idx ON ai_model_metadata (model_type, is_active);
```

**Purpose:** Track which models generated predictions for reproducibility.

---

## API Endpoints

### `POST /api/ai/chat`
Send message to AI assistant.

**Request:**
```json
{
  "message": "How can I improve my book sales?",
  "sessionId": "uuid-optional"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Based on your sales data...",
    "suggestions": ["Review pricing", "Analyze funnel"],
    "metadata": { "sessionId": "uuid", "model": "gpt-4-turbo" }
  }
}
```

**Context Included:**
- User's books
- Last 30 days sales
- Competitors
- User notes

---

### `GET /api/ai/chat?sessionId=<uuid>`
Get conversation history for a session.

**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [
      { "role": "user", "content": "...", "metadata": {} },
      { "role": "assistant", "content": "...", "metadata": {} }
    ]
  }
}
```

---

### `POST /api/ai/predictions`
Generate prediction for a book.

**Request:**
```json
{
  "bookId": "uuid",
  "predictionType": "revenue_forecast",
  "timeHorizonDays": 30
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "prediction": {
      "id": "uuid",
      "predictionValue": 450.00,
      "confidenceScore": 0.85,
      "timeHorizonDays": 30,
      "featuresUsed": { "historical_days": 90, "avg_daily_revenue": 15.0 },
      "validUntil": "2025-12-23T00:00:00Z"
    }
  }
}
```

**Prediction Types:**
- `revenue_forecast`: 30/60/90-day revenue predictions
- `churn_risk`: Probability of declining sales
- `engagement_score`: Reader engagement metric (Phase 4)
- `sales_trend`: Trend classification (growing/stable/declining)

---

### `GET /api/ai/predictions?bookId=<uuid>&type=<type>`
Get existing predictions for a book or profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "predictions": [
      { "id": "uuid", "predictionType": "revenue_forecast", ... }
    ]
  }
}
```

---

### `GET /api/ai/recommendations`
Get AI-generated recommendations for profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "type": "pricing",
        "title": "Price optimization opportunity",
        "description": "Your book is selling well...",
        "priority": "medium",
        "expectedImpact": "8-12% revenue increase",
        "actionItems": ["Create A/B test", "Monitor for 2 weeks"],
        "confidence": 0.7,
        "metadata": { "bookId": "uuid", "currentAvgPrice": 9.99 }
      }
    ]
  }
}
```

**Recommendation Types:**
- `pricing`: Price adjustments, A/B tests
- `marketing`: Campaign timing, channel optimization
- `strategic`: Relaunch strategies, category targeting
- `content`: Cover/description improvements (Phase 4)

---

### `POST /api/ai/recommendations/feedback`
Record feedback on a recommendation.

**Request:**
```json
{
  "recommendationId": "uuid",
  "recommendationType": "pricing",
  "actionTaken": "accepted",
  "feedbackText": "Implemented price increase, sales up 10%"
}
```

---

### `POST /api/ai/notes`
Create a user note for AI context.

**Request:**
```json
{
  "bookId": "uuid-optional",
  "noteType": "observation",
  "content": "Ran Reddit ad campaign targeting fantasy readers",
  "tags": ["marketing", "reddit", "fantasy"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "note": { "id": "uuid", "content": "...", "created_at": "..." }
  }
}
```

---

### `GET /api/ai/notes?bookId=<uuid>&tags=tag1,tag2`
Get user notes with optional filters.

**Response:**
```json
{
  "success": true,
  "data": {
    "notes": [
      { "id": "uuid", "content": "...", "tags": ["marketing"], "created_at": "..." }
    ]
  }
}
```

---

### `DELETE /api/ai/notes?id=<uuid>`
Delete a user note.

---

## Service Layer

### `AIAssistantService`
**Location:** `lib/modules/ai/application/ai-services.ts`

**Methods:**
- `chat(profileId, message, sessionId)` - Send message with context
- `getConversationHistory(profileId, sessionId)` - Retrieve past messages
- `buildContext(profileId)` - Gather user data for AI context

**AI Provider Integration:**
- Placeholder logic included
- To integrate OpenRouter:
  ```typescript
  // Supports GPT-4, Claude, Llama, and 100+ models
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": env.NEXT_PUBLIC_APP_URL,
    },
    body: JSON.stringify({
      model: "openai/gpt-4-turbo",
      messages: [{ role: "system", content: systemPrompt }, ...history]
    }),
  });
  ```

---

### `PredictionEngineService`
**Methods:**
- `generateRevenueForecast(profileId, bookId, timeHorizonDays)` - Predict future revenue
- `detectChurnRisk(profileId, bookId)` - Calculate declining sales probability
- `getPredictions(profileId, filters)` - Retrieve cached predictions

**Current Algorithms:**
- **Revenue Forecast:** Simple moving average (replace with ARIMA/Prophet)
- **Churn Detection:** Trend comparison (first half vs second half of period)

**Phase 4 Enhancements:**
- Integrate scikit-learn or TensorFlow.js
- Add seasonality detection
- Incorporate external factors (holidays, platform promotions)

---

### `RecommendationEngineService`
**Methods:**
- `generateRecommendations(profileId)` - Generate all recommendation types
- `generatePricingRecommendations(profileId)` - Pricing suggestions
- `generateMarketingRecommendations(profileId)` - Funnel optimization
- `generatePerformanceRecommendations(profileId)` - Underperforming books
- `recordFeedback(...)` - Store user response

**Rule Logic:**
- **Pricing:** If units > 100/month, suggest price test
- **Marketing:** If conversion rate < 2%, suggest landing page optimization
- **Performance:** If revenue < $100 after 30-90 days, suggest relaunch

---

## UI Components

### `AIAssistant` (`components/ai/AIAssistant.tsx`)
Floating or right-rail chat interface.

**Props:**
- `initialPrompt?: string` - Auto-send on mount
- `position?: "right-rail" | "floating"` - Layout mode

**Features:**
- Real-time chat with AI
- Quick action buttons
- Minimize/maximize controls
- Conversation history persistence

**Usage:**
```tsx
import { AIAssistant } from "@/components/ai/AIAssistant";

<AIAssistant position="right-rail" initialPrompt="Analyze my sales" />
```

---

### `PredictionsPanel` (`components/ai/PredictionsPanel.tsx`)
Revenue forecasts and churn risk display.

**Props:**
- `bookId?: string` - Filter to specific book

**Features:**
- Generate new predictions on demand
- Confidence score visualization
- Risk level indicators
- Refresh functionality

**Usage:**
```tsx
import { PredictionsPanel } from "@/components/ai/PredictionsPanel";

<PredictionsPanel bookId={bookId} />
```

---

### `RecommendationsPanel` (`components/ai/RecommendationsPanel.tsx`)
Actionable AI suggestions with feedback loop.

**Features:**
- Priority badges
- Confidence scores
- Action item checklists
- Thumbs up/down feedback
- Auto-refresh

**Usage:**
```tsx
import { RecommendationsPanel } from "@/components/ai/RecommendationsPanel";

<RecommendationsPanel />
```

---

## Integration Points

### Dashboard Right Rail
Add `<AIAssistant position="right-rail" />` to dashboard layout:

```tsx
// app/(dashboard)/dashboard/layout.tsx
import { AIAssistant } from "@/components/ai/AIAssistant";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex">
      <main className="flex-1">{children}</main>
      <aside className="w-96 border-l">
        <AIAssistant position="right-rail" />
      </aside>
    </div>
  );
}
```

### Insights Page Expansion
Add predictions and recommendations to `/dashboard/insights`:

```tsx
import { PredictionsPanel } from "@/components/ai/PredictionsPanel";
import { RecommendationsPanel } from "@/components/ai/RecommendationsPanel";

<div className="grid gap-6 lg:grid-cols-2">
  <PredictionsPanel />
  <RecommendationsPanel />
</div>
```

### Book Detail Pages
Add book-specific predictions on `/dashboard/books/[bookId]`:

```tsx
<PredictionsPanel bookId={bookId} />
```

---

## Environment Variables

Add to `.env.local` and Vercel:

```env
# AI Provider (choose one)
OPENROUTER_API_KEY=sk-or-v1-...
ANTHROPIC_API_KEY=sk-ant-...
AI_PROVIDER=openrouter  # or "anthropic" or "none"

# Feature Flags
NEXT_PUBLIC_FEATURES={"aiAssistant":true,"aiPredictions":true,"aiRecommendations":true}
```

**Feature Flags:**
- `aiAssistant`: Enable chat interface
- `aiPredictions`: Enable ML forecasts
- `aiRecommendations`: Enable suggestions panel

---

## Deployment Steps

### 1. Run Migration
Execute Phase 3 migration in Supabase SQL Editor:
```bash
# Copy contents of supabase/migrations/0005_phase3_ai_layer.sql
# Paste into Supabase dashboard → SQL Editor → Execute
```

### 2. Set Environment Variables
In Vercel dashboard:
1. Add `OPENROUTER_API_KEY` or `ANTHROPIC_API_KEY`
2. Set `AI_PROVIDER=openrouter` (or anthropic)
3. Update `NEXT_PUBLIC_FEATURES` JSON

### 3. Deploy Application
```bash
git add .
git commit -m "Phase 3: AI Layer implementation"
git push origin main
# Vercel auto-deploys
```

### 4. Verify Endpoints
```bash
curl https://your-app.vercel.app/api/ai/chat \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello"}'
```

---

## Testing Checklist

- [ ] AI chat responds with placeholder message (no API key)
- [ ] AI chat responds with OpenAI/Anthropic (with API key)
- [ ] Conversation history persists across sessions
- [ ] Revenue forecast generates for book with 30+ days sales data
- [ ] Churn risk detection identifies declining sales
- [ ] Recommendations appear based on sales patterns
- [ ] Feedback recorded and removes recommendation
- [ ] User notes created and retrieved
- [ ] Predictions expire after `valid_until` date
- [ ] Phase 2 features still work (analytics, funnel, pricing)

---

## Performance Considerations

### Rate Limiting
AI API calls can be expensive. Add rate limiting:
```typescript
// lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/cache/redis";

export const aiRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 h"), // 10 requests per hour
});
```

### Caching
- Cache predictions for `timeHorizonDays` duration
- Cache recommendations for 24 hours
- Invalidate caches on new sales data

### Background Jobs
Move expensive operations to QStash:
```typescript
// Generate predictions nightly for all active books
await qstash.publishJSON({
  url: `${env.NEXTAUTH_URL}/api/ai/batch-predictions`,
  body: { profileIds: [...] }
});
```

---

## Phase 4 Enhancements

**Optional Extensions:**
1. **Advanced ML Models:**
   - Replace simple algorithms with ARIMA, Prophet, or LSTM
   - Add seasonality detection
   - Incorporate external signals (Amazon bestseller ranks, Google Trends)

2. **Competitor Intelligence:**
   - Auto-generate competitor analysis summaries
   - Price tracking alerts
   - Genre trend analysis

3. **Content Recommendations:**
   - AI-powered cover design suggestions
   - Description optimization
   - Keyword analysis

4. **Automated A/B Testing:**
   - Auto-create pricing experiments
   - Statistical significance calculations
   - Winner declaration

5. **Voice/Image Input:**
   - Voice notes transcription
   - Cover upload for feedback
   - Screenshot analysis

---

## Backward Compatibility

Phase 3 changes:
- ✅ All new tables with RLS policies
- ✅ No modifications to Phase 1/2 tables
- ✅ Feature-flag controlled UI
- ✅ Graceful degradation (works without AI provider)
- ✅ Zero breaking changes to existing APIs

---

## Support

For Phase 3 issues:
1. Check Supabase logs for DB errors
2. Verify environment variables in Vercel
3. Test with `AI_PROVIDER=none` to isolate AI errors
4. Check OpenAI/Anthropic API status pages

---

*End of Phase 3 Architecture Document*
