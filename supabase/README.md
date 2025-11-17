## Supabase Project Guide

### Tooling
- CLI dependency: `pnpm install` already installs the `supabase` binary.
- Local dev uses Docker containers managed by the CLI.

### Common commands
```bash
pnpm supabase:start        # launch local stack
pnpm db:reset              # reset DB (drop, migrate, seed)
pnpm supabase:stop         # stop containers
pnpm supabase:studio       # open studio UI
```

### Structure
- `supabase/migrations` – ordered SQL files generated via `supabase migration new <name>`.
- `supabase/seed/seed.sql` – deterministic seed data for local/staging.

### Deployment expectations
1. Run migrations in CI before deploying (see `/docs/ARCHITECTURE.md`).
2. Store secrets (`SUPABASE_DB_URL`, `SUPABASE_SERVICE_ROLE_KEY`) in CI + Vercel.
3. Use service-role client (`lib/supabase/service.ts`) for server-only jobs/jobs + cron.

