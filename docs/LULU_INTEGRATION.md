# Lulu Print API Integration

## Overview

Lulu is a print-on-demand (POD) platform that provides printing and fulfillment services for books and other print products. This integration enables AuthorStack to track print jobs, orders, and calculate profit margins.

## Features

- **Project Management**: List all print projects/products
- **Order Tracking**: Fetch print job history
- **Status Monitoring**: Track print job status (created → shipped)
- **Profit Calculation**: Calculate margins based on print costs
- **OAuth Authentication**: Secure token-based authentication

## Setup

### 1. Get Lulu API Credentials

1. Visit [Lulu Print API](https://developers.lulu.com/)
2. Create a developer account or sign in
3. Navigate to **API Credentials**
4. Create a new application
5. Copy the **API Key** and **API Secret**

### 2. Configure Environment Variables

Add to your `.env.local` (development) and Vercel (production):

```env
LULU_API_KEY=your_lulu_api_key
LULU_API_SECRET=your_lulu_api_secret
```

### 3. Connect Platform

1. Go to **Dashboard** → **Platforms** → **Connect Platform**
2. Select **Lulu**
3. Enter your API credentials
4. Click **Connect**

## API Endpoints

### Authentication

The integration uses OAuth 2.0 Client Credentials flow:

**Token Endpoint**: `POST https://api.lulu.com/auth/realms/glasstree/protocol/openid-connect/token`

**Headers**:
- `Authorization: Basic {base64(api_key:api_secret)}`

**Response**:
```json
{
  "access_token": "eyJhbG...",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

Access tokens are cached in Redis until expiration.

### Projects API

**Endpoint**: `GET https://api.lulu.com/v1/projects/`

Fetches all print projects (book designs) from your account.

### Print Jobs API

**Endpoint**: `GET https://api.lulu.com/v1/print-jobs/`

Fetches all print jobs (orders) with pagination support.

**Query Parameters**:
- `limit` - Results per page (default: 50)
- `offset` - Pagination offset (default: 0)

## Data Structure

### Lulu Print Job Object

```typescript
{
  id: string;
  line_item_id: string;
  status: "CREATED" | "PRODUCTION_READY" | "IN_PRODUCTION" | "SHIPPED" | "CANCELED";
  quantity: number;
  cost: {
    total_cost_excl_tax: number;
    total_cost_incl_tax: number;
    total_tax: number;
    shipping_cost: {
      total_cost_excl_tax: number;
      total_cost_incl_tax: number;
    };
  };
  tracking?: {
    carrier: string;
    tracking_number: string;
    tracking_urls: string[];
  };
  created_at: string;
  updated_at: string;
}
```

### Stored in `sales_events` Table

Only **SHIPPED** print jobs are stored as sales events:

```sql
{
  profile_id: UUID,
  platform: "lulu",
  event_type: "sale",
  quantity: INTEGER,
  amount: NUMERIC (print cost),
  currency: "USD",
  occurred_at: TIMESTAMPTZ,
  raw_payload: JSONB
}
```

## Usage Examples

### Fetch Projects

```typescript
import { fetchLuluProjects } from "@/lib/platforms/lulu";

const projects = await fetchLuluProjects();
console.log(`Found ${projects.length} projects`);
```

### Fetch Print Jobs

```typescript
import { fetchAllLuluPrintJobs } from "@/lib/platforms/lulu";

const printJobs = await fetchAllLuluPrintJobs();
console.log(`Total print jobs: ${printJobs.length}`);
```

### Calculate Profit

```typescript
import { calculateLuluProfit, getLuluPrintJob } from "@/lib/platforms/lulu";

const printJob = await getLuluPrintJob("print_job_123");
if (printJob) {
  const profit = calculateLuluProfit(printJob, 24.99); // Selling price: $24.99
  console.log(`Profit: $${profit.toFixed(2)}`);
}
```

## Ingestion Flow

1. **Trigger**: Manual sync or scheduled cron job
2. **Fetch**: Retrieve all print jobs via API with pagination
3. **Filter**: Only process SHIPPED print jobs
4. **Store**: Insert into `sales_events` table
5. **Cache**: Store access token for future requests

## Print Job Lifecycle

```
CREATED → PAYMENT_IN_PROGRESS → PRODUCTION_READY → IN_PRODUCTION → SHIPPED
   ↓                                                                      
CANCELED
```

Only **SHIPPED** jobs are counted as sales in the dashboard.

## Profit Margin Tracking

### Cost Breakdown

A print job includes:
- **Print cost**: Base cost for printing
- **Shipping cost**: Delivery fees
- **Tax**: Sales tax (if applicable)

### Profit Calculation

```typescript
Profit = Selling Price - Total Cost (incl. tax)
```

**Example**:
- Selling price: $24.99
- Print cost: $8.50
- Shipping: $4.50
- Tax: $1.20
- Total cost: $14.20
- **Profit: $10.79**

## Testing

### Test Authentication

```bash
# Get access token
curl -X POST https://api.lulu.com/auth/realms/glasstree/protocol/openid-connect/token \
  -H "Authorization: Basic $(echo -n 'api_key:api_secret' | base64)" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials"
```

### Test Print Jobs Fetch

```bash
curl -X GET "https://api.lulu.com/v1/print-jobs/?limit=10" \
  -H "Authorization: Bearer {access_token}"
```

## Rate Limits

Lulu Print API rate limits:
- **Default**: 100 requests per minute
- **Burst**: 200 requests per minute

The integration includes:
- ✅ Automatic pagination
- ✅ Rate limiting delays (500ms between requests)
- ✅ Token caching to minimize auth requests

## Troubleshooting

### Authentication Errors

1. Verify API credentials are correct
2. Check credentials haven't expired
3. Regenerate credentials in Lulu dashboard
4. Ensure credentials are in environment variables

### No Print Jobs Showing

1. Confirm print jobs exist in Lulu dashboard
2. Check jobs are in SHIPPED status
3. Verify API credentials have proper permissions
4. Check ingestion job logs for errors

### Token Expiration

Access tokens expire after 1 hour. The integration:
- Automatically refreshes tokens
- Caches tokens in Redis
- Handles expired token errors

## Use Cases

### For Print-on-Demand Authors

- **Track Orders**: See all print jobs in one place
- **Monitor Status**: Check production and shipping status
- **Calculate Profits**: Compare print costs to selling prices
- **Shipping Tracking**: Access carrier tracking numbers

### For Publishers

- **Bulk Printing**: Track large print runs
- **Inventory Management**: Monitor print job history
- **Cost Analysis**: Analyze print costs over time
- **Fulfillment**: Track shipping and delivery

## Production vs Development

### Development (Sandbox)

Lulu provides a sandbox environment for testing:
- Base URL: `https://api.sandbox.lulu.com`
- Use test credentials
- No actual printing occurs

### Production

- Base URL: `https://api.lulu.com`
- Real print jobs and costs
- Actual shipping and tracking

Update base URL in `lib/platforms/lulu.ts` for sandbox testing.

## Security

- ✅ API credentials stored securely in environment variables
- ✅ OAuth 2.0 authentication
- ✅ Token caching with automatic expiration
- ✅ HTTPS-only communication

## Future Enhancements

Potential features to add:

1. **Create Print Jobs**: Automated book printing from dashboard
2. **Quote Calculator**: Get print cost estimates
3. **Shipping Options**: Compare shipping methods and costs
4. **Bulk Operations**: Create multiple print jobs at once
5. **Inventory Sync**: Track inventory levels
6. **Custom Packaging**: White-label shipping options

## Support

For issues with:
- **Lulu Print API**: [Lulu API Documentation](https://developers.lulu.com/)
- **Authentication**: Check API credentials dashboard
- **Print Jobs**: Contact Lulu support
- **Integration**: Check ingestion job logs in AuthorStack

---

**Status**: Production Ready  
**API Version**: v1  
**Last Updated**: November 22, 2025
