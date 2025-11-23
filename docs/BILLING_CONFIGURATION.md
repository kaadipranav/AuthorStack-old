# Billing Configuration Guide

## Overview

AuthorStack uses **Whop** for subscription billing with two active tiers:
- **Free**: $0/month (default for all new users)
- **PRO**: $19/month (Phase 2 analytics, revenue tracking, funnel visualization, pricing recommendations)

**Enterprise tier** exists in the database schema but is not currently implemented or advertised.

## Sign-Up Flow

### Free Tier
1. User selects "Free" plan during sign-up
2. Account created with `subscription_tier = 'free'`
3. User can access all Phase 1 features immediately after email verification

### PRO Tier
1. User selects "PRO" plan during sign-up
2. Account created with `subscription_tier = 'free'` (upgraded after payment)
3. `metadata.pending_pro_checkout = true` flag set on profile
4. After email verification, user redirected to Whop checkout
5. Webhook updates `subscription_tier = 'pro'` upon successful payment

## Whop Dashboard Configuration

### 1. Create PRO Plan
- Navigate to Whop dashboard → Products
- Create new product: "AuthorStack PRO"
- Set pricing: $19.00/month (recurring)
- Set plan name: `authorstack-pro` (used in tier mapping)

### 2. Configure Webhook
- Webhook URL: `https://your-domain.com/api/webhooks/whop`
- Events to subscribe:
  - `membership.went_valid` - User activated subscription
  - `membership.went_invalid` - Subscription cancelled/expired
  - `subscription.updated` - Plan changes
  - `charge.succeeded` - Payment processed

### 3. Get API Keys
Add to `.env.local`:
```env
WHOP_API_KEY=whop_xxx
WHOP_WEBHOOK_SECRET=whop_webhook_xxx
```

## Tier Mapping Logic

Located in `lib/payments/whop-service.ts`:

```typescript
function mapWhopStatusToTier(status: WhopSubscriptionStatus, planName: string) {
  if (status === "inactive" || status === "cancelled" || status === "past_due") {
    return "free";
  }
  
  // Check plan name for tier identification
  if (planName.toLowerCase().includes("enterprise")) {
    return "enterprise"; // Not currently offered
  }
  if (planName.toLowerCase().includes("pro")) {
    return "pro";
  }
  
  return "free";
}
```

## Feature Access Control

Check user tier in any component/page:

```typescript
import { requireAuth } from "@/lib/auth/require-auth";

const { user, profile } = await requireAuth();

if (profile.subscription_tier !== "pro") {
  return <UpgradePrompt />;
}
```

## Database Schema

```sql
-- profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  subscription_tier TEXT NOT NULL DEFAULT 'free', -- 'free' | 'pro' | 'enterprise'
  whop_customer_id TEXT,
  metadata JSONB DEFAULT '{}'
);

-- whop_subscriptions table (billing reconciliation)
CREATE TABLE whop_subscriptions (
  id UUID PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id),
  whop_membership_id TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  status TEXT NOT NULL, -- 'active' | 'inactive' | 'cancelled' | 'past_due'
  current_period_end TIMESTAMPTZ,
  raw_payload JSONB
);
```

## Testing Checklist

- [ ] Sign up with Free plan → verify `subscription_tier = 'free'`
- [ ] Sign up with PRO plan → verify `pending_pro_checkout` metadata
- [ ] Complete Whop checkout → verify webhook updates tier to `pro`
- [ ] Cancel subscription → verify tier reverts to `free`
- [ ] Access Phase 2 features as PRO user → verify no upgrade prompts
- [ ] Access Phase 2 features as Free user → verify upgrade prompts shown

## Future: First 50 Users Waiver

To implement promotional pricing:

1. Add user count tracking:
```typescript
const { count } = await supabase
  .from('profiles')
  .select('*', { count: 'exact', head: true });
```

2. Apply conditional pricing:
```typescript
if (count < 50) {
  // Show "FREE for early adopters" badge
  // Store waiver flag in metadata
  subscriptionTier = 'pro';
  metadata.early_adopter = true;
  metadata.waiver_applied = true;
}
```

3. Notify when waiver expires (user #51+)

## Support

For Whop integration issues, check:
- Webhook logs in Supabase: `SELECT * FROM whop_subscriptions ORDER BY created_at DESC`
- Server logs for webhook processing errors
- Whop dashboard → Webhooks → Delivery logs
