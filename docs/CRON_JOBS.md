# Vercel Cron Jobs - Free Tier Bypass

## Problem

Vercel's free tier (Hobby) only allows **2 cron jobs**, but AuthorStack needs 4:
1. Ingestion - Daily at midnight
2. Leaderboard - Daily at 2 AM
3. Boost Status - Every 5 minutes
4. Analytics - Daily at 3 AM

## Solution: Master Cron Job

Instead of 4 separate cron jobs, we use **1 master cron job** that orchestrates all tasks internally.

### How It Works

**File:** `app/api/cron/master/route.ts`

The master cron runs **every 5 minutes** and checks the current time to determine which jobs to execute:

```typescript
// Boost Status - Always runs (every 5 min)
await fetch('/api/cron/boost-status')

// Ingestion - Only at midnight (00:00-00:05)
if (hour === 0 && minute < 5) {
  await fetch('/api/ingestion/cron')
}

// Leaderboard - Only at 2 AM (02:00-02:05)
if (hour === 2 && minute < 5) {
  await fetch('/api/cron/leaderboard-weekly')
}

// Analytics - Only at 3 AM (03:00-03:05)
if (hour === 3 && minute < 5) {
  await fetch('/api/cron/analytics')
}
```

### Configuration

**vercel.json:**
```json
{
  "crons": [
    {
      "path": "/api/cron/master",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

This uses only **1 cron job slot**, leaving 1 free for future use.

## Benefits

1. ✅ Bypasses Vercel's 2 cron job limit
2. ✅ All 4 scheduled tasks still run on time
3. ✅ Centralized logging and error handling
4. ✅ Easy to add more scheduled tasks
5. ✅ No additional cost

## Monitoring

Check Vercel logs to see master cron execution:

```
[Cron] Master cron executing at 2025-11-26T00:00:00.000Z
[Cron] Running boost status update...
[Cron] Running ingestion...
[Cron] ✓ Master cron completed successfully
```

## Adding New Scheduled Tasks

To add a new scheduled task:

1. Create the API endpoint (e.g., `/api/cron/new-task/route.ts`)
2. Add time-based logic to `app/api/cron/master/route.ts`:

```typescript
// New Task - Daily at 4 AM
if (hour === 4 && minute < 5) {
  const response = await fetch('/api/cron/new-task', {
    method: 'POST',
    headers: { 'authorization': process.env.CRON_SECRET },
  });
  results.newTask = await response.json();
}
```

No need to modify `vercel.json`!

## Testing Locally

Test the master cron:

```bash
curl -X POST http://localhost:3000/api/cron/master \
  -H "Authorization: your_cron_secret"
```

## Production Deployment

1. Add `CRON_SECRET` to Vercel environment variables
2. Deploy: `git push origin main`
3. Verify in Vercel Dashboard → Cron Jobs
4. Should show 1 cron job: `/api/cron/master`

---

**Note:** This is a common pattern for bypassing Vercel's cron job limits on free tier. It's production-ready and used by many applications.
