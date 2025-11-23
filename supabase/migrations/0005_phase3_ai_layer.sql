-- Phase 3: AI Layer Extensions
-- Backward-compatible additions for AI assistant, predictions, and recommendations
-- Dependencies: Phase 2 analytics tables (book_analytics_daily, funnel_events, pricing_snapshots)

-- ============================================================================
-- AI Conversations (Chat History)
-- ============================================================================
-- Store AI assistant chat messages for context continuity

CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  session_id UUID NOT NULL DEFAULT gen_random_uuid(),
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb, -- Store context, tokens used, model version
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS ai_conversations_profile_idx ON public.ai_conversations (profile_id, created_at DESC);
CREATE INDEX IF NOT EXISTS ai_conversations_session_idx ON public.ai_conversations (session_id, created_at ASC);

-- ============================================================================
-- AI Predictions (ML Forecasts)
-- ============================================================================
-- Store revenue forecasts, churn predictions, and engagement scores

CREATE TABLE IF NOT EXISTS public.ai_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  book_id UUID REFERENCES public.books (id) ON DELETE CASCADE,
  prediction_type TEXT NOT NULL CHECK (prediction_type IN ('revenue_forecast', 'churn_risk', 'engagement_score', 'sales_trend')),
  prediction_value NUMERIC(12,2) NOT NULL, -- Forecasted revenue, probability score, etc.
  confidence_score NUMERIC(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1), -- 0.0 to 1.0
  time_horizon_days INTEGER, -- Forecast period (e.g., 30, 60, 90 days)
  features_used JSONB DEFAULT '{}'::jsonb, -- Input features for ML model (sales history, platform mix, seasonality)
  model_version TEXT, -- Track which model/algorithm generated this
  valid_from TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  valid_until TIMESTAMPTZ, -- Expiration date for forecasts
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS ai_predictions_profile_idx ON public.ai_predictions (profile_id, prediction_type, created_at DESC);
CREATE INDEX IF NOT EXISTS ai_predictions_book_idx ON public.ai_predictions (book_id, prediction_type, valid_from DESC);
CREATE INDEX IF NOT EXISTS ai_predictions_validity_idx ON public.ai_predictions (valid_until) WHERE valid_until IS NOT NULL;

-- ============================================================================
-- AI Insights (Generated Summaries)
-- ============================================================================
-- Store AI-generated insights, trend analysis, and competitor intelligence

CREATE TABLE IF NOT EXISTS public.ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL CHECK (insight_type IN ('sales_trend', 'competitor_analysis', 'marketing_opportunity', 'performance_alert', 'strategic_recommendation')),
  title TEXT NOT NULL,
  summary TEXT NOT NULL, -- Short insight summary
  details JSONB DEFAULT '{}'::jsonb, -- Structured data (charts, metrics, recommendations)
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'dismissed', 'acted_upon')),
  related_book_ids UUID[], -- Array of book IDs this insight relates to
  related_competitor_ids UUID[], -- Array of competitor IDs
  generated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  expires_at TIMESTAMPTZ, -- Auto-hide stale insights
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS ai_insights_profile_idx ON public.ai_insights (profile_id, status, priority, generated_at DESC);
CREATE INDEX IF NOT EXISTS ai_insights_type_idx ON public.ai_insights (insight_type, status);
CREATE INDEX IF NOT EXISTS ai_insights_expiry_idx ON public.ai_insights (expires_at) WHERE expires_at IS NOT NULL;

-- ============================================================================
-- User Notes (Manual Context)
-- ============================================================================
-- Allow users to add manual observations for AI context enrichment

CREATE TABLE IF NOT EXISTS public.user_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  book_id UUID REFERENCES public.books (id) ON DELETE CASCADE,
  note_type TEXT DEFAULT 'observation' CHECK (note_type IN ('observation', 'goal', 'experiment', 'outcome')),
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}', -- User-defined tags for categorization
  metadata JSONB DEFAULT '{}'::jsonb, -- Extensible for future fields
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS user_notes_profile_idx ON public.user_notes (profile_id, created_at DESC);
CREATE INDEX IF NOT EXISTS user_notes_book_idx ON public.user_notes (book_id, created_at DESC);
CREATE INDEX IF NOT EXISTS user_notes_tags_idx ON public.user_notes USING GIN (tags);

-- ============================================================================
-- Recommendation Feedback (Learning Loop)
-- ============================================================================
-- Track user responses to AI recommendations for model improvement

CREATE TABLE IF NOT EXISTS public.recommendation_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  recommendation_id UUID, -- Links to pricing_recommendations or new AI recommendations
  recommendation_type TEXT NOT NULL CHECK (recommendation_type IN ('pricing', 'marketing', 'content', 'strategic')),
  action_taken TEXT CHECK (action_taken IN ('accepted', 'rejected', 'modified', 'deferred')),
  feedback_text TEXT,
  outcome_metrics JSONB DEFAULT '{}'::jsonb, -- Track actual results after following recommendation
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS recommendation_feedback_profile_idx ON public.recommendation_feedback (profile_id, recommendation_type, created_at DESC);
CREATE INDEX IF NOT EXISTS recommendation_feedback_recommendation_idx ON public.recommendation_feedback (recommendation_id);

-- ============================================================================
-- AI Model Metadata (Versioning & Config)
-- ============================================================================
-- Track which AI models/prompts are active for reproducibility

CREATE TABLE IF NOT EXISTS public.ai_model_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_name TEXT NOT NULL, -- e.g., 'gpt-4-turbo', 'claude-3-opus'
  model_version TEXT NOT NULL,
  model_type TEXT NOT NULL CHECK (model_type IN ('chat', 'prediction', 'recommendation', 'insight_generation')),
  configuration JSONB DEFAULT '{}'::jsonb, -- Temperature, max_tokens, system prompts
  is_active BOOLEAN DEFAULT true,
  deployed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  deprecated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS ai_model_metadata_active_idx ON public.ai_model_metadata (model_type, is_active);

-- ============================================================================
-- Cleanup Functions (Auto-expire stale data)
-- ============================================================================

-- Auto-expire old predictions
CREATE OR REPLACE FUNCTION public.cleanup_expired_predictions()
RETURNS void AS $$
BEGIN
  DELETE FROM public.ai_predictions
  WHERE valid_until < NOW();
END;
$$ LANGUAGE plpgsql;

-- Auto-expire old insights
CREATE OR REPLACE FUNCTION public.cleanup_expired_insights()
RETURNS void AS $$
BEGIN
  UPDATE public.ai_insights
  SET status = 'dismissed'
  WHERE expires_at < NOW() AND status = 'active';
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Row Level Security (RLS)
-- ============================================================================

ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendation_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_model_metadata ENABLE ROW LEVEL SECURITY;

-- AI Conversations policies
CREATE POLICY ai_conversations_select ON public.ai_conversations
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY ai_conversations_insert ON public.ai_conversations
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- AI Predictions policies
CREATE POLICY ai_predictions_select ON public.ai_predictions
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY ai_predictions_insert ON public.ai_predictions
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- AI Insights policies
CREATE POLICY ai_insights_select ON public.ai_insights
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY ai_insights_update ON public.ai_insights
  FOR UPDATE USING (auth.uid() = profile_id);

-- User Notes policies
CREATE POLICY user_notes_select ON public.user_notes
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY user_notes_insert ON public.user_notes
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY user_notes_update ON public.user_notes
  FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY user_notes_delete ON public.user_notes
  FOR DELETE USING (auth.uid() = profile_id);

-- Recommendation Feedback policies
CREATE POLICY recommendation_feedback_select ON public.recommendation_feedback
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY recommendation_feedback_insert ON public.recommendation_feedback
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- AI Model Metadata (read-only for users)
CREATE POLICY ai_model_metadata_select ON public.ai_model_metadata
  FOR SELECT USING (true);
