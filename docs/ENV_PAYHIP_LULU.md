# Environment Variables - Payhip & Lulu Integrations

## New Variables Added

Add these to your environment configuration files:

### Local Development (`.env.local`)

```env
# ============================================
# Payhip API
# ============================================
# Get from: https://payhip.com/settings/api
PAYHIP_API_KEY=your_payhip_api_key_here

# Optional: For webhook signature verification
# Get from: Payhip webhook settings
PAYHIP_WEBHOOK_SECRET=your_payhip_webhook_secret

# ============================================
# Lulu Print API
# ============================================
# Get from: https://developers.lulu.com/
# Create an application to get credentials
LULU_API_KEY=your_lulu_api_key_here
LULU_API_SECRET=your_lulu_api_secret_here
```

---

## Production (Vercel Dashboard)

Add the same variables to your Vercel project:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add each variable for **Production**, **Preview**, and **Development** environments
3. Click **Save**

---

## How to Get API Keys

### Payhip

1. **Sign up/Login**: [payhip.com](https://payhip.com)
2. **Navigate to API**: Settings → API
3. **Generate Key**: Click "Generate API Key"
4. **Copy Key**: Save it to your environment variables
5. **Webhook (Optional)**:
   - Settings → Webhooks
   - Add URL: `https://your-domain.com/api/webhooks/payhip`
   - Select events: sale, refund, subscription_payment
   - Copy webhook secret

### Lulu

1. **Developer Account**: [developers.lulu.com](https://developers.lulu.com/)
2. **Create Application**: Dashboard → Create New App
3. **Get Credentials**: Copy API Key and API Secret
4. **Environment**: Choose Production or Sandbox
5. **Save Values**: Add to environment variables

---

## Testing Without API Keys

Both integrations support **mock mode**:

- **Payhip**: Returns empty arrays for products/sales
- **Lulu**: Returns null for access token, empty arrays for projects/jobs
- **Webhooks**: Signature verification skipped in mock mode

This allows development and testing without active accounts.

---

## Updated `.env.example`

Your `.env.example` should now include:

```env
# ... existing variables ...

# Payhip API
PAYHIP_API_KEY=
PAYHIP_WEBHOOK_SECRET=

# Lulu Print API
LULU_API_KEY=
LULU_API_SECRET=
```

---

## Verification

After adding environment variables, verify they're loaded:

```bash
# Local development
npm run dev

# Check console output
# You should see: "[Payhip] API key missing" OR "[Payhip] Fetching products"
# And: "[Lulu] API credentials missing" OR "[Lulu] Access token obtained"
```

---

## Security Notes

⚠️ **Important**:
- Never commit `.env.local` to git
- Keep API keys secure and private
- Rotate keys if compromised
- Use different keys for development and production
- Add `.env.local` to `.gitignore` (already done)

✅ **Best Practices**:
- Use Vercel's encrypted environment variables
- Set webhook secrets to verify authenticity
- Monitor webhook logs for suspicious activity
- Limit API key permissions if available

---

## Troubleshooting

### Variables Not Loading

1. Restart development server after adding variables
2. Check variable names match exactly (case-sensitive)
3. Ensure no extra spaces around `=` sign
4. Verify `.env.local` is in project root directory

### Vercel Variables

1. Variables must be added to **all environments** (Production, Preview, Development)
2. Redeploy after adding variables
3. Check deployment logs for errors

---

**Status**: Environment configuration ready  
**Required**: User must add API keys to use integrations  
**Optional**: Can skip if not using Payhip or Lulu
