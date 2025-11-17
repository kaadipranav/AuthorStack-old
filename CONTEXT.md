# AuthorStack — PRODUCTION CONTEXT (Production-ready checklist + updated scope)

> This file is a production-focused, condensed version of the original CONTEXT.md. Paste this into your repo (docs/ or root) and give it to any AI assistant (Cursor/Windsurf) or human engineer. The goal: make the MVP production-ready so deployment requires **only setting environment variables**.

---

## 1) Core mission

AuthorStack is an indie-author SaaS platform: unified sales dashboard, launch checklist, competitor tracking, A/B testing, and later phases: AI mascot/assistant, ProductHunt-style leaderboard for discovery, in-app community, and distribution/printing. The immediate priority is a **stable, production-ready MVP** where every existing page and route works (no 404s), all API routes function, and sync jobs run reliably.

---

## 2) MVP MUST-HAVES (production)

1. Supabase Auth (signup, login, email verification, password reset)
2. Profiles & subscription state (free/pro/enterprise)STEP 6 — Ingestion jobs + cron structure

Implement the ingestion pipeline with placeholder scheduling.
No actual external API calls yet.
The architecture must be ready.
3. Book management CRUD (create, update, delete, cover upload)
4. Platform connections (Amazon KDP CSV/manual upload + Gumroad OAuth)
5. Sales data ingestion pipeline (cron + retry + manual sync endpoint)
6. Unified sales dashboard UI (no placeholders; real data flows end-to-end)
7. Launch checklist flows (create launch, tasks, reminders)
8. Payments via Whop (subscription webhooks must be handled)
9. Error pages and graceful fallbacks (network errors, 404, server errors)
10. One health-check endpoint `/healthz` returning 200 and basic metrics

---

## 3) Production architecture (high-level)

* Frontend: Next.js App Router (TypeScript), Tailwind + shadcn/ui
* Backend: Next.js API routes (serverless), Supabase Postgres, Redis via Upstash
* Hosting: Vercel (production) + Vercel Cron / Upstash QStash for scheduled jobs
* Storage: Supabase Storage for assets
* Email: Resend (transactional)
* Payments: Whop (subscriptions)
* Monitoring: Sentry (errors) + PostHog (product analytics)
* CI/CD: GitHub Actions -> Deploy to Vercel
* Secrets: Stored in Vercel / Supabase dashboard only (no .env in repo)

---

## 4) Requirements for "only env var changes" deployment

To achieve a deployment flow where **you only ever set environment variables**, ensure the following items exist in the repo (if missing add them via AI or an engineer):

A. **Infrastructure as Code (IAC) helpers & scripts**

* `vercel.json` configured for builds and rewrites
* `supabase` folder with migration SQL and `seed` scripts using Supabase CLI
* `redis` helper scripts and Upstash usage notes

B. **CI/CD pipeline** (GitHub Actions) - key steps only:

* `ci.yml` runs tests, builds, runs migrations with Supabase CLI, and deploys to Vercel via `vercel` or `vercel-action` using `VERCEL_TOKEN` env var
* `staging` branch auto-deploy -> `staging` Vercel project
* `main` branch auto-deploy -> `production` Vercel project

C. **Config-driven feature flags & placeholders**

* `NEXT_PUBLIC_FEATURES` JSON env var to toggle features (leaderboard, mascot, community, distribution)

D. **Runbook & Onboarding script**

* `./scripts/onboard.sh` to run local dev setup, migrations, and seed data (reads env vars)
* `./scripts/health_check.sh` to verify endpoints after deploy

E. **Automated DB migrations & seeds**

* Migrations folder and `supabase/migrations` with `npm run migrate:prod` step in CI
* `seed` script populates minimal admin user and demo data

F. **Production-ready build & error pages**

* `_error.tsx` / `app/not-found.tsx` — user-friendly messages
* `pages/_middleware.ts` or Next middleware for auth redirects

---

## 5) Critical environment variables (exact names to set in Vercel & Supabase)

Set these in Vercel Dashboard (Production & Staging) and in local `.env.local` only for development (not checked into repo):

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_DB_URL=

# Vercel/Next
NEXTAUTH_URL=https://your-app.vercel.app
NEXT_PUBLIC_VERCEL_ENV=production

# Payment
WHOP_API_KEY=
WHOP_WEBHOOK_SECRET=

# Email
RESEND_API_KEY=
FROM_EMAIL=

# Redis / Upstash
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Analytics & Monitoring
SENTRY_DSN=
POSTHOG_API_KEY=

# Feature flags
NEXT_PUBLIC_FEATURES={"leaderboard":false,"mascot":false,"community":false,"distribution":false}

# Misc
JWT_SECRET=
NODE_ENV=production

# Optional (for scraping / puppeteer)
PROXIES_JSON (or provider-specific keys)
```

---

## 6) Stabilize broken pages (priority checklist for an AI/human fixer)

1. Run `npm run build && npm start` locally — fix compilation/type errors
2. Run linter (`npm run lint`) — fix major lint errors that break build
3. Run tests (unit/integration) — write failing tests for major flows if missing
4. Check route table: ensure every page in `app/` or `pages/` is exported and linkable
5. Add `getServerSideProps`/server components where needed to avoid client-side 404s
6. Verify API route file names match fetch calls (typo mismatches cause 404s)
7. Verify Supabase environment variables used in the code are the same names as above
8. Ensure storage file URLs have proper signed URL logic (if missing return placeholder image)
9. Add global error boundary & network offline UI state
10. Add health-check `/api/healthz` that checks DB connection, Redis ping, and a simple query

---

## 7) CI/CD and deploy steps (so you only edit env vars)

1. Connect GitHub repo to Vercel (create two Vercel projects: `authorstack-staging`, `authorstack-prod`)
2. Add GitHub Actions file `ci.yml` to run tests/build and call `vercel` deploy using `VERCEL_TOKEN`
3. Store required secrets in GitHub and Vercel: VERCEL_TOKEN, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, WHOP_API_KEY, UPSTASH tokens, SENTRY_DSN
4. Configure Vercel environment variables (prod & staging) using the exact keys above
5. Protect `main` branch and enable auto-deploy on merge
6. CI job runs `npx supabase db push` or `supabase` CLI migration command to keep schema synced
7. Post-deploy job calls `./scripts/health_check.sh` and opens a git issue if checks fail

---

## 8) Testing & QA (make it zero-touch for deploys)

* Unit tests: Jest + React Testing Library for components
* Integration: test Supabase queries with a test DB (CI uses ephemeral DB URL)
* E2E: Playwright tests for core flows (signup, connect platform, dashboard load)
* Add a test step in CI that fails deploy on critical test failures

---

## 9) Observability & post-deploy ops (dont touch code later)

* Sentry for error alerts (integrate DSN in env)
* PostHog for product analytics (events track: signups, connect-platform, create-launch, upgrade)
* Slack/Gmail alert webhook for critical incidents
* Daily scheduled health-check endpoint and cron job that pings `/api/healthz` and writes status to a simple status file or 3rd party status page

---

## 10) Rollback & emergency plan

* Keep `main` deploys behind a protected tag (`v1.0.0`); revert by re-deploying previous tag in Vercel
* Have a manual DB backup script run weekly and store backups offsite
* Provide a `deployment-runbook.md` for emergency rollback steps

---

## 11) Extension points for future phases (placeholders, not implementations)

* `features/leaderboard` — folder with component stubs + API stubs + feature flag checks
* `features/mascot` — `assistant/` folder with prompts and placeholder UI panels guarded by `NEXT_PUBLIC_FEATURES.mascot`
* `features/community` — `community/` module with minimal models and RLS rules stubbed
* `features/distribution` — `distribution/` folder with placeholders for POD & fulfillment hooks

Do not implement features — only add clean extension points (interfaces, types, SQS/queue hooks)

---

## 12) Minimal local dev steps (for you or an AI to run once)

1. `git clone <repo>`
2. `cp .env.example .env.local && fill envs`
3. `npm ci`
4. `npx supabase start` (for local DB) or point to dev Supabase project
5. `npm run dev`
6. Visit `http://localhost:3000` and test flows

---

## 13) Final note to Cursor/Windsurf or an engineer executing this

* Priority #1: Fix broken routes/pages/components causing 404s or runtime errors
* Priority #2: Verify all server-client data flows (Supabase calls, webhooks, cron jobs)
* Priority #3: Add CI checks and migration automation
* Priority #4: Add health-check + monitoring
* Priority #5: Create extension points for future phases guarded by feature flags

If any of these steps are missing in the current repo, repair them. The objective is: **after this work, a non-technical founder can deploy to production by only setting environment variables in Vercel and Supabase**.

---

*End of production-ready context.*
