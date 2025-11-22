# Payhip Integration

## Overview

Payhip is an e-commerce platform that allows indie authors to sell digital products, physical products, and memberships directly to customers. This integration enables AuthorStack to sync sales data from Payhip.

## Features

- **Product Listing**: Fetch all products from your Payhip account
- **Sales Data**: Retrieve sales transactions with full details
- **License Management**: Access license keys for digital products
- **Webhook Support**: Real-time sales notifications via webhooks
- **Redis Caching**: Product data cached for performance

## Setup

### 1. Get Payhip API Key

1. Log in to your Payhip account
2. Navigate to **Settings** → **API**
3. Generate a new API key
4. Copy the API key

### 2. Configure Environment Variables

Add to your `.env.local` (development) and Vercel (production):

```env
PAYHIP_API_KEY=your_payhip_api_key
PAYHIP_WEBHOOK_SECRET=your_webhook_secret  # Optional, for webhook verification
```

### 3. Connect Platform

1. Go to **Dashboard** → **Platforms** → **Connect Platform**
2. Select **Payhip**
3. Enter your API key
4. Click **Connect**

### 4. Set Up Webhook (Optional)

For real-time sales notifications:

1. In Payhip dashboard, go to **Settings** → **Webhooks**
2. Add webhook URL: `https://your-domain.com/api/webhooks/payhip`
3. Select events: `sale`, `subscription_payment`, `refund`, `dispute`
4. Copy the webhook secret
5. Add `PAYHIP_WEBHOOK_SECRET` to your environment variables

## API Endpoints

### Sales Data Ingestion

**Endpoint**: Internal ingestion handler  
**Trigger**: Manual sync or scheduled cron job

**Process**:
1. Fetch all sales from Payhip API
2. Filter completed sales
3. Insert into `sales_events` table
4. Cache product data

### Webhook Handler

**Endpoint**: `POST /api/webhooks/payhip`

**Events Supported**:
- `sale` - New sale completed
- `subscription_payment` - Recurring payment received
- `refund` - Sale refunded
- `dispute` - Chargeback or dispute opened

**Headers**:
- `x-payhip-signature` - HMAC-SHA256 signature (optional in mock mode)

**Response**:
```json
{
  "status": "success",
  "message": "Sale recorded",
  "profileId": "user_uuid"
}
```

## Data Structure

### Payhip Sale Object

```typescript
{
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  currency: string;
  buyer_email: string;
  created_at: string;
  status: "completed" | "pending" | "refunded";
}
```

### Stored in `sales_events` Table

```sql
{
  profile_id: UUID,
  platform: "payhip",
  event_type: "sale" | "refund",
  quantity: INTEGER,
  amount: NUMERIC,
  currency: TEXT,
  occurred_at: TIMESTAMPTZ,
  raw_payload: JSONB
}
```

## Usage Examples

### Fetch Products

```typescript
import { fetchPayhipProducts } from "@/lib/platforms/payhip";

const products = await fetchPayhipProducts();
console.log(`Found ${products.length} products`);
```

### Fetch Sales

```typescript
import { fetchAllPayhipSales } from "@/lib/platforms/payhip";

const sales = await fetchAllPayhipSales();
console.log(`Total sales: ${sales.length}`);
```

### Verify Webhook

```typescript
import { verifyPayhipWebhook } from "@/lib/platforms/payhip";

const { valid, reason } = await verifyPayhipWebhook(payload, signature);
if (!valid) {
  console.error("Invalid webhook:", reason);
}
```

## Testing

### Manual Webhook Test

```bash
curl -X POST https://your-domain.com/api/webhooks/payhip \
  -H "Content-Type: application/json" \
  -H "x-payhip-signature: test_signature" \
  -d '{
    "event": "sale",
    "data": {
      "sale_id": "sale_123",
      "product_id": "prod_456",
      "product_name": "My Book",
      "buyer_email": "buyer@example.com",
      "quantity": 1,
      "price": 9.99,
      "currency": "USD",
      "created_at": "2025-11-22T10:00:00Z",
      "status": "completed"
    },
    "timestamp": "2025-11-22T10:00:00Z"
  }'
```

### Check Webhook Logs

```sql
SELECT * FROM platform_webhook_events
WHERE provider = 'payhip'
ORDER BY received_at DESC
LIMIT 10;
```

## Rate Limits

Payhip API has the following rate limits:
- **Products**: 100 requests per hour
- **Sales**: 100 requests per hour
- **Licenses**: 50 requests per hour

The integration includes automatic caching to minimize API calls.

## Troubleshooting

### No Sales Appearing

1. Check API key is valid in Payhip dashboard
2. Verify `PAYHIP_API_KEY` environment variable is set
3. Check browser console for errors
4. Run manual sync from platform connections page

### Webhook Not Working

1. Verify webhook URL is publicly accessible
2. Check `PAYHIP_WEBHOOK_SECRET` matches Payhip dashboard
3. Test webhook using curl command above
4. Check `platform_webhook_events` table for errors

### API Key Errors

- Ensure API key is active in Payhip settings
- Regenerate API key if compromised
- Update environment variable with new key

## Security

- ✅ API key stored securely in environment variables
- ✅ Webhook signature verification (HMAC-SHA256)
- ✅ Webhook events logged for audit trail
- ✅ Mock mode available for development (no signature required)

## Support

For issues with:
- **Payhip API**: Contact Payhip support
- **AuthorStack Integration**: Check platform webhook logs
- **Missing Sales**: Trigger manual sync or check ingestion job status

---

**Status**: Production Ready  
**Last Updated**: November 22, 2025
