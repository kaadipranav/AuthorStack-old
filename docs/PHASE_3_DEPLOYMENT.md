# Phase 3 Deployment Guide

## Quick Start

Phase 3 adds AI capabilities to AuthorStack. Follow these steps for production deployment.

---

## 1. Database Migration

### Execute SQL Migration

1. Open Supabase Dashboard → SQL Editor
2. Copy the entire contents of `supabase/migrations/0005_phase3_ai_layer.sql`
3. Paste into SQL Editor
4. Click "Run"

**What it creates:**
- 6 new tables: `ai_conversations`, `ai_predictions`, `ai_insights`, `user_notes`, `recommendation_feedback`, `ai_model_metadata`
- Row Level Security (RLS) policies for all tables
- Indexes for performance
- Cleanup functions for expired data

**Verification:**
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'ai_%';

-- Should return: ai_conversations, ai_predictions, ai_insights, ai_model_metadata
```

---

## 2. Environment Variables

### Add to Vercel (Production)

Navigate to Vercel Dashboard → Settings → Environment Variables:

```env
# AI Provider (choose ONE)
OPENAI_API_KEY=sk-proj-...
# OR
ANTHROPIC_API_KEY=sk-ant-...

# Set provider type
AI_PROVIDER=openai
# Options: "openai" | "anthropic" | "none"

# Enable AI features (add to existing NEXT_PUBLIC_FEATURES)
NEXT_PUBLIC_FEATURES={"leaderboard":false,"mascot":false,"community":false,"distribution":false,"aiAssistant":true,"aiPredictions":true,"aiRecommendations":true}
```

### Add to Local `.env.local`

```env
# Copy from Vercel or use your own keys
OPENAI_API_KEY=sk-...
AI_PROVIDER=openai
NEXT_PUBLIC_FEATURES={"aiAssistant":true,"aiPredictions":true,"aiRecommendations":true}
```

---

## 3. Build & Deploy

### Test Locally First

```bash
# Install dependencies (if needed)
pnpm install

# Build production bundle
pnpm build

# Check for errors
# If build succeeds, you're good to deploy
```

### Deploy to Vercel

```bash
git add .
git commit -m "Phase 3: AI Layer implementation"
git push origin main
```

Vercel will auto-deploy. Monitor build logs for errors.

---

## 4. Post-Deployment Verification

### Test API Endpoints

**Chat Endpoint (no API key):**
```bash
curl https://your-app.vercel.app/api/ai/chat \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Cookie: your-auth-cookie" \
  -d '{"message":"Hello"}'

# Expected: Placeholder response about API key
```

**Chat Endpoint (with API key):**
```bash
# Should return actual AI response from OpenAI/Anthropic
```

**Predictions:**
```bash
curl https://your-app.vercel.app/api/ai/predictions?bookId=<uuid> \
  -H "Cookie: your-auth-cookie"

# Expected: Empty array initially
```

**Recommendations:**
```bash
curl https://your-app.vercel.app/api/ai/recommendations \
  -H "Cookie: your-auth-cookie"

# Expected: Array of recommendations (if user has books/sales data)
```

### Test UI

1. Navigate to `/dashboard/insights`
2. Check for:
   - AI Assistant component (if enabled)
   - Predictions Panel
   - Recommendations Panel
3. Send a chat message
4. Generate a prediction
5. Accept/reject a recommendation

---

## 5. Feature Flag Configuration

### Gradual Rollout Strategy

**Stage 1: Internal Testing**
```json
{
  "aiAssistant": false,
  "aiPredictions": false,
  "aiRecommendations": false
}
```
Only admins can test by manually enabling in code.

**Stage 2: Beta Users**
```json
{
  "aiAssistant": true,
  "aiPredictions": false,
  "aiRecommendations": false
}
```
Enable chat for beta testers.

**Stage 3: Full Rollout**
```json
{
  "aiAssistant": true,
  "aiPredictions": true,
  "aiRecommendations": true
}
```
All AI features enabled for all users.

---

## 6. Monitoring

### Key Metrics to Track

**API Usage:**
- `/api/ai/chat` request count
- Average response time
- Error rate

**Database:**
- `ai_conversations` table growth
- `ai_predictions` cache hit rate
- Expired prediction cleanup frequency

**OpenAI/Anthropic Costs:**
- Token usage per user
- Cost per conversation
- Model distribution (gpt-4 vs gpt-3.5-turbo)

### Set Up Alerts

**Sentry (errors):**
```typescript
// Already integrated - AI errors auto-reported
```

**PostHog (analytics):**
```typescript
posthog.capture('ai_chat_sent', { tokens: 1500 });
posthog.capture('prediction_generated', { type: 'revenue_forecast' });
```

**Upstash (rate limiting):**
```typescript
if (!success) {
  logger.warn('AI rate limit exceeded', { userId });
}
```

---

## 7. Cost Management

### OpenAI API Costs

**Estimated Monthly Costs (1000 users):**
- Chat (avg 10 msg/user): ~$150/month (gpt-3.5-turbo)
- Chat (avg 10 msg/user): ~$600/month (gpt-4-turbo)
- Predictions (batch): ~$20/month (embeddings + completions)

**Cost Optimization:**
- Use `gpt-3.5-turbo` for simple queries
- Use `gpt-4-turbo` only for complex recommendations
- Cache predictions for 24-48 hours
- Rate limit users to 10 requests/hour

### Anthropic Claude Costs

**Comparison:**
- Claude Sonnet: Similar to GPT-3.5 pricing
- Claude Opus: Similar to GPT-4 pricing
- Better for long-context analysis

---

## 8. Troubleshooting

### Issue: Chat returns placeholder message

**Cause:** `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` not set

**Fix:**
```bash
# Vercel Dashboard → Environment Variables
# Add OPENAI_API_KEY=sk-...
# Redeploy
```

---

### Issue: Predictions fail with "Insufficient data"

**Cause:** Book has < 14 days of sales data

**Fix:**
- User needs to add more sales data
- Lower minimum data requirement in code (not recommended)

---

### Issue: Build errors after Phase 3 merge

**Cause:** TypeScript errors in AI services

**Fix:**
```bash
# Check for import errors
pnpm typecheck

# Common issues:
# 1. Missing @/lib/auth/session import
# 2. createSupabaseServerClient vs createSupabaseServiceClient
# 3. User type destructuring (use `const user = await requireAuth()` not `const { user }`)
```

---

### Issue: RLS policies blocking AI queries

**Cause:** `auth.uid()` not matching `profile_id`

**Fix:**
```sql
-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename LIKE 'ai_%';

-- Test policy manually
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claims.sub TO 'user-uuid';
SELECT * FROM ai_conversations WHERE profile_id = 'user-uuid';
```

---

## 9. Rollback Plan

If Phase 3 causes issues:

### Option 1: Feature Flag Disable

```json
{
  "aiAssistant": false,
  "aiPredictions": false,
  "aiRecommendations": false
}
```
Redeploy. UI hides AI components.

### Option 2: Revert Deployment

```bash
# Vercel Dashboard → Deployments
# Click previous deployment → "Promote to Production"
```

### Option 3: Database Rollback

```sql
-- ONLY IF NECESSARY (data loss)
DROP TABLE ai_conversations CASCADE;
DROP TABLE ai_predictions CASCADE;
DROP TABLE ai_insights CASCADE;
DROP TABLE user_notes CASCADE;
DROP TABLE recommendation_feedback CASCADE;
DROP TABLE ai_model_metadata CASCADE;
```

**Warning:** This deletes all AI data. Phase 1/2 features unaffected.

---

## 10. Next Steps

### Integrate OpenRouter (Recommended)

```typescript
// lib/modules/ai/application/ai-services.ts

private async callAIProvider(message: string, context: ChatContext) {
  if (env.AI_PROVIDER === "openrouter" && env.OPENROUTER_API_KEY) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": env.NEXT_PUBLIC_APP_URL,
      },
      body: JSON.stringify({
        model: "openai/gpt-4-turbo", // or anthropic/claude-3-5-sonnet, etc.
        messages: [
          { role: "system", content: `You are an AI assistant for AuthorStack...` },
          { role: "user", content: message }
        ],
        max_tokens: 500
      }),
    });
    
    const data = await response.json();
    return {
      message: data.choices[0]?.message?.content || "No response",
      metadata: { model: data.model, provider: "openrouter" }
    };
  }
}
```

### Integrate Anthropic

```typescript
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

const message = await anthropic.messages.create({
  model: "claude-3-sonnet-20240229",
  max_tokens: 1024,
  messages: [
    { role: "user", content: message }
  ],
  system: systemPrompt
});
```

### Enable Background Prediction Generation

```typescript
// app/api/ai/batch-predictions/route.ts
export async function POST() {
  const predictionService = new PredictionEngineService();
  
  // Get all active books
  const books = await getActiveBooks();
  
  for (const book of books) {
    await predictionService.generateRevenueForecast(book.profileId, book.id, 30);
  }
  
  return NextResponse.json({ success: true, processed: books.length });
}
```

**QStash Schedule (nightly at 2 AM):**
```bash
curl -XPOST 'https://qstash.upstash.io/v2/schedules' \
  -H "Authorization: Bearer $QSTASH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "https://your-app.vercel.app/api/ai/batch-predictions",
    "cron": "0 2 * * *"
  }'
```

---

## Checklist

Before marking Phase 3 as production-ready:

- [ ] Database migration executed successfully
- [ ] Environment variables set in Vercel
- [ ] Build completes without errors
- [ ] Deployment successful
- [ ] AI chat endpoint responds
- [ ] Predictions generate for books with data
- [ ] Recommendations appear based on rules
- [ ] Feedback recorded successfully
- [ ] User notes created and retrieved
- [ ] Phase 2 features still working (analytics, funnel, pricing)
- [ ] No console errors in browser
- [ ] OpenAI/Anthropic API key working (if configured)
- [ ] Rate limiting tested
- [ ] Feature flags respected

---

**Status:** Ready for production deployment ✅

**Support:** Check `docs/PHASE_3_ARCHITECTURE.md` for detailed technical documentation.
