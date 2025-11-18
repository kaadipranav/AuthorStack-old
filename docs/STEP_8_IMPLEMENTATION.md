# STEP 8 — Real Integrations Implementation Guide

## Status: IN PROGRESS

✅ **Completed:**
- Resend email integration (5 email templates)

🔲 **Remaining:**
- Upstash Redis queue operations
- Whop API integration
- Gumroad OAuth + API integration
- Amazon KDP CSV parsing

## 1. Resend Email Integration ✅

**File:** `lib/email/resend.ts`

**Implemented Functions:**
- `sendTransactionalEmail()` - Base email sender
- `sendSignupConfirmation()` - Welcome email
- `sendPasswordReset()` - Password reset email
- `sendSubscriptionUpdated()` - Subscription tier change
- `sendIngestionCompleted()` - Ingestion success alert
- `sendIngestionFailed()` - Ingestion failure alert

**Email Templates:**
All templates include:
- Professional HTML styling
- Brand colors (black header)
- Call-to-action buttons
- Footer with copyright
- Responsive design

**Usage:**
```typescript
import { sendSignupConfirmation, sendIngestionCompleted } from "@/lib/email/resend";

// Send signup confirmation
await sendSignupConfirmation("user@example.com", "https://app.com/confirm?token=xyz");

// Send ingestion completion
await sendIngestionCompleted("user@example.com", "gumroad", 42);
```

---

## 2. Upstash Redis Integration (TODO)

**File:** `lib/cache/redis.ts`

**Functions to Implement:**

```typescript
// Queue operations
export async function enqueueJob(jobId: string): Promise<void>
export async function dequeueJob(): Promise<string | null>
export async function getQueueLength(): Promise<number>

// Caching
export async function cacheApiResponse(
  key: string,
  data: unknown,
  ttlSeconds: number = 300
): Promise<void>
export async function getCachedResponse(key: string): Promise<unknown | null>
export async function invalidateCache(key: string): Promise<void>

// Rate limiting
export async function incrementRateLimit(
  userId: string,
  limit: number = 100,
  windowSeconds: number = 3600
): Promise<number>
export async function getRateLimitStatus(userId: string): Promise<number>

// Job scheduling
export async function scheduleJob(
  jobId: string,
  delayMs: number
): Promise<void>
```

**Implementation Pattern:**
```typescript
import { redis } from "@/lib/cache/redis";

// Enqueue
await redis.lpush("ingestion:queue", jobId);

// Dequeue
const jobId = await redis.rpop("ingestion:queue");

// Cache (5 min TTL)
await redis.set(`cache:gumroad:products`, JSON.stringify(data), {
  ex: 300,
});

// Rate limit
const count = await redis.incr(`ratelimit:${userId}`);
await redis.expire(`ratelimit:${userId}`, 3600);
```

---

## 3. Whop API Integration (TODO)

**File:** `lib/payments/whop.ts`

**Functions to Implement:**

```typescript
export async function fetchWhopCustomer(customerId: string): Promise<WhopCustomer>
export async function fetchWhopMemberships(customerId: string): Promise<WhopMembership[]>
export async function fetchWhopMembershipDetails(membershipId: string): Promise<WhopMembership>
export async function validateWhopSignature(
  payload: string,
  signature: string,
  timestamp: string
): Promise<boolean>
```

**API Endpoints:**
- `GET /api/v3/customers/{customer_id}` - Get customer
- `GET /api/v3/memberships?customer_id={id}` - List memberships
- `GET /api/v3/memberships/{membership_id}` - Get membership

**Implementation Pattern:**
```typescript
import { fetchWhop } from "@/lib/payments/whop";

const customer = await fetchWhop<WhopCustomer>(
  `/customers/${customerId}`
);

const memberships = await fetchWhop<WhopMembership[]>(
  `/memberships?customer_id=${customerId}`
);
```

---

## 4. Gumroad OAuth + API Integration (TODO)

**New File:** `lib/platforms/gumroad.ts`

**Functions to Implement:**

```typescript
export async function exchangeGumroadCode(code: string): Promise<GumroadToken>
export async function refreshGumroadToken(refreshToken: string): Promise<GumroadToken>
export async function fetchGumroadProducts(accessToken: string): Promise<GumroadProduct[]>
export async function fetchGumroadSales(
  accessToken: string,
  productId?: string,
  page?: number
): Promise<GumroadSale[]>
```

**File:** `app/api/platforms/oauth/gumroad/callback/route.ts`

**Implementation Pattern:**
```typescript
// 1. Exchange code for token
const token = await exchangeGumroadCode(code);

// 2. Store token
await supabase.from("platform_connections").upsert({
  profile_id: userId,
  provider: "gumroad",
  access_token: token.access_token,
  refresh_token: token.refresh_token,
  metadata: { expiresAt: token.expires_at },
});

// 3. Trigger initial sync
await enqueueJob(userId, "gumroad", {});
```

**File:** `lib/ingestion/handlers.ts`

**Update handleGumroadIngestion():**
```typescript
export async function handleGumroadIngestion(job: IngestionJob): Promise<IngestionResult> {
  const connection = await getGumroadConnection(job.profile_id);
  if (!connection?.access_token) {
    return { success: false, jobId: job.id, message: "No Gumroad token", error: "NO_TOKEN" };
  }

  // Fetch products
  const products = await fetchGumroadProducts(connection.access_token);

  // Fetch sales
  let salesEventsCreated = 0;
  for (const product of products) {
    const sales = await fetchGumroadSales(connection.access_token, product.id);
    
    for (const sale of sales) {
      await createSalesEvent(job.profile_id, {
        platform: "gumroad",
        event_type: "sale",
        quantity: sale.quantity,
        amount: sale.price,
        currency: "USD",
        occurred_at: sale.created_at,
        raw_payload: sale,
      });
      salesEventsCreated++;
    }
  }

  return {
    success: true,
    jobId: job.id,
    message: "Gumroad sync completed",
    salesEventsCreated,
  };
}
```

---

## 5. Amazon KDP CSV Parsing (TODO)

**File:** `lib/ingestion/handlers.ts`

**Update handleAmazonKdpIngestion():**

```typescript
export async function handleAmazonKdpIngestion(job: IngestionJob): Promise<IngestionResult> {
  const { storagePath } = job.payload as { storagePath?: string };
  if (!storagePath) {
    return { success: false, jobId: job.id, message: "Missing storage path", error: "MISSING_PATH" };
  }

  // Download CSV from Supabase Storage
  const supabase = await createSupabaseServiceClient();
  const { data, error: downloadError } = await supabase.storage
    .from("kdp-uploads")
    .download(storagePath);

  if (downloadError || !data) {
    return { success: false, jobId: job.id, message: "Failed to download CSV", error: downloadError?.message };
  }

  // Parse CSV
  const csv = await data.text();
  const lines = csv.split("\n");
  const headers = lines[0].split(",").map(h => h.trim());
  
  let salesEventsCreated = 0;

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values = lines[i].split(",").map(v => v.trim());
    const row: Record<string, string> = {};
    
    headers.forEach((header, idx) => {
      row[header] = values[idx] || "";
    });

    // Parse KDP report format
    const asin = row["ASIN"] || row["asin"] || "";
    const title = row["Title"] || row["title"] || "";
    const quantity = parseInt(row["Units Sold"] || row["units_sold"] || "0");
    const amount = parseFloat(row["Royalties"] || row["royalties"] || "0");
    const date = row["Date"] || row["date"] || new Date().toISOString();

    if (asin && quantity > 0) {
      await createSalesEvent(job.profile_id, {
        platform: "amazon_kdp",
        event_type: "sale",
        quantity,
        amount,
        currency: "USD",
        occurred_at: new Date(date).toISOString(),
        raw_payload: { asin, title, ...row },
      });
      salesEventsCreated++;
    }
  }

  return {
    success: true,
    jobId: job.id,
    message: `KDP CSV parsed: ${salesEventsCreated} events`,
    salesEventsCreated,
  };
}
```

---

## Environment Variables

All credentials are in `variables.txt`:

```env
# Resend
RESEND_API_KEY=re_MB7g1D17_HXHpqmo5AvMgzPQ3iXzHmmqf
FROM_EMAIL=noreply@authorstack.com

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://concrete-wolf-16347.upstash.io
UPSTASH_REDIS_REST_TOKEN=AT_bAAIncDJmMTAyOGJlMmViZjU0MmU2OTlkOTJlMWFkYjZhM2E2OHAyMTYzNDc

# Whop
WHOP_API_KEY=apik_DcHDu8F5xnb7w_C3759482_573850590d495f1afcc5e71794bf853ecd712c3ad13b0348f6c1eecf6564e023
WHOP_WEBHOOK_SECRET=ws_6fda39dc8008a032d2a0463ac3e1ddd4899db91b1b1caed02df632edcc1e3e46

# Gumroad
GUMROAD_API_KEY=EF2EDb-k9xDoVGyRvyiOW0rhd0TGh9wuNz-EvODYbFo
```

---

## Testing Checklist

### Resend Email
- [ ] Signup confirmation email sends
- [ ] Password reset email sends
- [ ] Subscription update email sends
- [ ] Ingestion completion email sends
- [ ] Ingestion failure email sends
- [ ] Check Resend dashboard for delivery

### Upstash Redis
- [ ] Queue operations work
- [ ] Caching works with TTL
- [ ] Rate limiting works
- [ ] Job scheduling works

### Whop
- [ ] Fetch customer details
- [ ] Fetch memberships
- [ ] Signature verification works
- [ ] Webhook processing works

### Gumroad
- [ ] OAuth flow completes
- [ ] Token stored correctly
- [ ] Products fetched
- [ ] Sales data ingested
- [ ] Sales events created

### Amazon KDP
- [ ] CSV uploaded
- [ ] CSV parsed correctly
- [ ] Sales events created
- [ ] Data in database

---

## Deployment Steps

1. **Copy env vars to `.env.local`:**
   ```bash
   cp variables.txt .env.local
   ```

2. **Start dev server:**
   ```bash
   npm run dev
   ```

3. **Test each integration:**
   - Sign up (triggers Resend)
   - Connect Gumroad (triggers OAuth)
   - Upload KDP CSV (triggers ingestion)
   - Check webhook logs

4. **Deploy to Vercel:**
   ```bash
   git add .
   git commit -m "STEP 8: Real integrations"
   git push origin main
   ```

5. **Set env vars in Vercel:**
   - Go to Project Settings → Environment Variables
   - Add all vars from `variables.txt`
   - Redeploy

---

## Success Criteria

✅ All emails send successfully
✅ Redis queue operations work
✅ Whop webhooks process correctly
✅ Gumroad OAuth completes
✅ Sales data ingests end-to-end
✅ No errors in logs
✅ Database populated with real data

---

**Status:** Resend ✅ | Redis 🔲 | Whop 🔲 | Gumroad 🔲 | KDP 🔲

**Next:** Implement remaining integrations following the patterns above.
