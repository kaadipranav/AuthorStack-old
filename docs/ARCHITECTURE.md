## AuthorStack Architecture Overview

### Frontend Foundation
- Next.js 14 App Router with React 19 server components where possible.
- TypeScript enforced via `tsconfig.json` and `pnpm typecheck`.
- Tailwind CSS v4 + shadcn/ui for composable design system primitives.
- Global providers live in `components/providers` (themes, future auth, analytics).
- Layout primitives (`components/layout`) compose navbar, footer, shells, and error boundaries.

### Domain-Driven Project Structure
```
app/               # App Router routes, API handlers, route groups
components/        # Reusable UI + layout primitives (ui/, navigation/, layout/, marketing/)
features/          # Future vertical slices (leaderboard, mascot, community, distribution)
lib/               # Framework-agnostic utilities (config, supabase, cache, payments, email)
supabase/          # Database migrations, seeds, and CLI config
types/             # Shared TypeScript types
utils/             # Pure utility helpers (e.g., className combiners)
docs/              # Architecture notes, runbooks, context brief
```

### Key Integrations
- **Supabase**: Auth, Postgres, storage. Server/client helpers live in `lib/supabase`.
- **Whop**: Subscription billing webhooks handled via helpers in `lib/payments/whop.ts`.
- **Upstash Redis & QStash**: Edge cache + background jobs via `lib/cache/redis.ts`.
- **Resend**: Transactional email helper in `lib/email/resend.ts`.
- **Feature Flags**: JSON-driven flags parsed via `lib/config/features.ts` and exposed throughout the UI.

### API Surface
- `/api/healthz` verifies Supabase, Redis, and integration wiring before deploys.
- Future API routes belong inside `app/api/<domain>/route.ts` following the same observability helpers.

### Data Flow Summary
1. Requests hit Vercel Edge / Node runtimes using App Router handlers.
2. Server components use `lib/env` for validated configuration and `lib/supabase/server` for authenticated data access.
3. Mutations fan out to Redis (cache bust), Resend (emails), or Whop webhooks using dedicated helper modules.
4. Feature-flagged experiences live inside `features/*` to keep the main surface area stable.

### Build & Operations
- `pnpm lint`, `pnpm typecheck`, `pnpm build` gate deployments.
- Supabase migrations run via CLI (`pnpm supabase:start`, `pnpm db:reset`).
- Observability hooks (Sentry/PostHog) are environment-driven so non-production builds incur no overhead.

