## Local Development Runbook

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Bootstrap environment**
   ```bash
   cp .env.example .env.local
   # Fill in Supabase + integration keys
   ```

3. **Start Supabase + database migrations**
   ```bash
   pnpm supabase:start
   supabase db reset --force
   ```

4. **Run the web app**
   ```bash
   pnpm dev
   ```
   Visit `http://localhost:3000`.

5. **Quality gates before pushing**
   ```bash
   pnpm lint
   pnpm typecheck
   pnpm build
   ```

6. **Useful scripts**
   - `pnpm supabase:studio` – open the Supabase studio UI.
   - `pnpm supabase:stop` – tear down local Supabase containers.
   - `pnpm db:reset` – reset migrations + seed data.

7. **Smoke tests**
   - Trigger `/api/healthz`.
   - Run through login, dashboard, and integrations (requires keys).

