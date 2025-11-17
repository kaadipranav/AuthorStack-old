## Feature Modules Overview

Each sub-folder under `features/` owns its UI, API handlers, data access helpers, and background jobs. Feature code ships behind env-driven flags defined in `lib/config/features.ts`.

- `leaderboard/` – discovery & rankings.
- `mascot/` – AI assistant, prompt templates, and conversation stores.
- `community/` – forums, messaging, and moderation rules.
- `distribution/` – fulfillment + partner integrations.

When activating a feature:
1. Toggle the flag in `NEXT_PUBLIC_FEATURES`.
2. Build components + API routes within the specific folder.
3. Export entry points via `features/index.ts` for tree-shaking.

