# AuthorStack

Production-grade SaaS starter for indie authors. Includes Supabase auth, Whop billing hooks, Upstash Redis, Resend email integration, shadcn/ui, and an opinionated folder structure for future features.

## Stack
- Next.js 14 (App Router, React 19, TypeScript)
- Tailwind CSS v4 + shadcn/ui components
- Supabase (auth, Postgres, storage)
- Upstash Redis + QStash
- Whop billing
- Resend email

## Project layout
```
app/            # Routes, API handlers, layouts, loading/error states
components/     # UI primitives, navigation, providers, layout helpers
features/       # Future slices (leaderboard, mascot, community, distribution)
lib/            # Framework-agnostic utilities (env, supabase, cache, payments)
supabase/       # CLI config, SQL migrations, seed data
types/          # Shared TypeScript contracts
utils/          # Generic helpers
docs/           # Architecture notes + runbooks
```

## Environment
1. Copy `.env.example` to `.env.local`.
2. Fill Supabase, Whop, Upstash, and Resend credentials.
3. Feature flags live in `NEXT_PUBLIC_FEATURES` (JSON string).

## Local development
```bash
pnpm install
pnpm supabase:start     # launches local Postgres/auth/storage
pnpm db:reset           # applies migrations + seed data
pnpm dev
```

## Quality gates
```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Observability & ops
- `/api/healthz` verifies Supabase, Redis, Whop, and Resend configuration.
- Docs live at `/docs` with links to the in-repo architecture/runbook files.
- Scripts for Supabase management are available under the `package.json` scripts section.
