## Leaderboard Module

- **Goal**: Rank authors by launch performance and momentum.
- **Data**: Uses aggregated sales metrics cached in Upstash Redis.
- **API Surface**: `/api/leaderboard/*` (to be added) guarded by feature flag.
- **Next Steps**:
  1. Define ranking query in Supabase (materialized view or cron task).
  2. Expose read models via `lib/leaderboard/service.ts`.
  3. Stream updates via server actions or SSE when data is available.

