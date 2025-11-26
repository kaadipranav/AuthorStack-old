# AuthorStack - Manual Configuration Guide

## 🚀 What Was Just Added

### New Features Implemented:
1. **Pricing Page** (`/pricing`) - Full pricing page with 2 tiers (Free $0, Pro $29/mo with 14-day trial)
2. **Billing Dashboard** (`/dashboard/billing`) - Subscription management, payment methods, invoices
3. **Onboarding Wizard** - 3-step guided setup for new users
4. **Progress Component** - UI component for progress bars
5. **Updated Navigation** - Pricing link in header, proper billing icon in sidebar

---

## 🔧 Manual OAuth & API Configurations Required

### CRITICAL: Payment Provider (Whop)

1. **Create a Whop Account**
   - Go to https://whop.com/business
   - Create your business account
   - Create 2 products/plans:
     - **AuthorStack Free** - $0 (optional, for tracking)
     - **AuthorStack Pro** - $29/month (with 14-day free trial)   

2. **Get API Keys**
   ```
   WHOP_API_KEY=your_api_key
   WHOP_WEBHOOK_SECRET=your_webhook_secret
   ```

3. **Configure Webhook**
   - In Whop dashboard, go to Settings → Webhooks
   - Add webhook URL: `https://your-domain.com/api/webhooks/whop`
   - Select events: `membership.created`, `membership.updated`, `membership.cancelled`

---

### Platform Integrations

#### 1. Gumroad OAuth (Easiest to set up)

1. Go to https://gumroad.com/settings/advanced
2. Click "Create Application"
3. Fill in:
   - **Application Name:** AuthorStack
   - **Redirect URI:** `https://your-domain.com/api/platforms/oauth/gumroad/callback`
4. Get credentials:
   ```
   GUMROAD_CLIENT_ID=your_client_id
   GUMROAD_CLIENT_SECRET=your_client_secret
   GUMROAD_REDIRECT_URI=https://your-domain.com/api/platforms/oauth/gumroad/callback
   ```

#### 2. Payhip API

1. Log into https://payhip.com
2. Go to Account Settings → API
3. Generate API key
4. Add to env:
   ```
   PAYHIP_API_KEY=your_api_key
   ```

#### 3. Lulu API (Print-on-Demand)

1. Create developer account at https://developers.lulu.com
2. Create a new application
3. Get credentials:
   ```
   LULU_API_KEY=your_api_key
   LULU_API_SECRET=your_api_secret
   ```

#### 4. Amazon KDP (CSV Upload - No OAuth Needed)
- Users upload KDP Reports CSV manually
- No API keys required

#### 5. Other Platforms (CSV Upload)
- Kobo, Apple Books, Google Play, Barnes & Noble
- All use CSV upload - no API setup needed

---

### AI Features

#### OpenRouter (Required for AI)

1. Go to https://openrouter.ai
2. Create account and get API key
3. Add to env:
   ```
   OPENROUTER_API_KEY=your_api_key
   AI_PROVIDER=openrouter
   ```
4. Recommended: Add $10-20 credits to start

---

### Email (Resend)

1. Go to https://resend.com
2. Create account
3. Verify your domain
4. Get API key:
   ```
   RESEND_API_KEY=your_api_key
   FROM_EMAIL=noreply@your-domain.com
   ```

---

### Cron Jobs

Add this secret for Vercel Cron:
```
CRON_SECRET=generate_a_random_32_char_string
```

---

## 📋 Complete Environment Variables

Copy this to your `.env.local` or Vercel dashboard:

```env
# ============ SUPABASE (Required) ============
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# ============ APP URL ============
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Change for production

# ============ PAYMENTS (Whop) ============
WHOP_API_KEY=your_whop_api_key
WHOP_WEBHOOK_SECRET=your_whop_webhook_secret

# ============ AI (Required for AI features) ============
OPENROUTER_API_KEY=your_openrouter_api_key
AI_PROVIDER=openrouter

# ============ PLATFORM INTEGRATIONS ============
# Gumroad OAuth
GUMROAD_CLIENT_ID=your_gumroad_client_id
GUMROAD_CLIENT_SECRET=your_gumroad_client_secret
GUMROAD_REDIRECT_URI=https://your-domain.com/api/platforms/oauth/gumroad/callback

# Payhip
PAYHIP_API_KEY=your_payhip_api_key

# Lulu
LULU_API_KEY=your_lulu_api_key
LULU_API_SECRET=your_lulu_api_secret

# ============ EMAIL (Resend) ============
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=noreply@your-domain.com

# ============ REDIS (Upstash) - Already configured ============
UPSTASH_REDIS_REST_URL=https://concrete-wolf-16347.upstash.io
UPSTASH_REDIS_REST_TOKEN=AT_bAAIncDJmMTAyOGJlMmViZjU0MmU2OTlkOTJlMWFkYjZhM2E2OHAyMTYzNDc

# ============ CRON ============
CRON_SECRET=your_random_32_character_string

# ============ OPTIONAL: Monitoring ============
SENTRY_DSN=your_sentry_dsn
POSTHOG_API_KEY=your_posthog_key
```

---

## 🎯 Priority Order for Setup

### Phase 1: Go Live (Do This First)
1. ✅ Supabase (database) - Already have
2. ⬜ Whop (payments) - Create 3 products
3. ⬜ Resend (email) - Verify domain
4. ⬜ Deploy to Vercel

### Phase 2: Full Features
5. ⬜ OpenRouter (AI) - Get API key
6. ⬜ Gumroad OAuth - Create app
7. ⬜ Payhip API - Get key

### Phase 3: Optional
8. ⬜ Lulu API - For POD features
9. ⬜ Sentry/PostHog - Monitoring

---

## 💰 Pricing Structure Implemented

| Plan | Price | Key Features |
|------|-------|--------------|
| **Free** | $0 | 2 platforms, basic dashboard, checklists, community |
| **Pro** | $19/mo | Unlimited platforms, AI assistant, forecasting, A/B tests |
| **Enterprise** | $79/mo | Team seats, API access, dedicated support |

**Revenue Projections:**
- 100 Pro users = $1,900/mo
- 500 Pro users = $9,500/mo
- 1000 Pro + 50 Enterprise = $22,950/mo

---

## 🚀 Deployment Checklist

- [ ] Set all environment variables in Vercel
- [ ] Configure Whop webhook URL
- [ ] Verify Resend domain
- [ ] Test signup flow end-to-end
- [ ] Test payment flow (use Whop test mode)
- [ ] Connect at least one platform (Gumroad easiest)
- [ ] Verify AI chat works with OpenRouter

---

## 📞 Support

If you need help with any configuration:
- Whop Docs: https://dev.whop.com/docs
- Gumroad API: https://gumroad.com/api
- OpenRouter: https://openrouter.ai/docs
- Resend: https://resend.com/docs

