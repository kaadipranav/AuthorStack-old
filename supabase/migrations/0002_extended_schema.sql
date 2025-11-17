-- OAuth token history for external platforms (Gumroad, Whop, etc.)
create table if not exists public.platform_oauth_tokens (
  id uuid primary key default gen_random_uuid(),
  connection_id uuid not null references public.platform_connections (id) on delete cascade,
  access_token text not null,
  refresh_token text,
  expires_at timestamptz,
  scopes text[] not null default '{}',
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists platform_oauth_tokens_connection_idx
  on public.platform_oauth_tokens (connection_id, expires_at);

create trigger update_platform_oauth_tokens_updated_at
  before update on public.platform_oauth_tokens
  for each row
  execute procedure public.set_updated_at();

-- Track webhook payloads (Gumroad, Whop, etc.) for auditing & retries
create table if not exists public.platform_webhook_events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles (id) on delete set null,
  provider text not null,
  event_type text not null,
  delivery_status text not null default 'received',
  signature text,
  payload jsonb not null default '{}'::jsonb,
  received_at timestamptz not null default timezone('utc'::text, now()),
  processed_at timestamptz,
  error_message text
);

create index if not exists platform_webhook_events_provider_idx
  on public.platform_webhook_events (provider, received_at desc);

-- Cron execution logs (Vercel Cron / Upstash)
create table if not exists public.cron_logs (
  id uuid primary key default gen_random_uuid(),
  job_name text not null,
  status text not null default 'started',
  payload jsonb not null default '{}'::jsonb,
  started_at timestamptz not null default timezone('utc'::text, now()),
  finished_at timestamptz,
  error_message text
);

create index if not exists cron_logs_job_idx
  on public.cron_logs (job_name, started_at desc);

-- Ingestion attempt history for each job (retries, error logging)
create table if not exists public.ingestion_attempts (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.ingestion_jobs (id) on delete cascade,
  attempt_number integer not null default 1,
  status text not null default 'pending',
  started_at timestamptz not null default timezone('utc'::text, now()),
  finished_at timestamptz,
  error_message text
);

create index if not exists ingestion_attempts_job_idx
  on public.ingestion_attempts (job_id, attempt_number);

-- Materialized view-ready helper (useful for dashboards)
create view if not exists public.sales_summary_view as
  select
    se.profile_id,
    se.book_id,
    coalesce(b.title, 'Unknown Book') as book_title,
    sum(se.amount) as total_amount,
    sum(se.quantity) as total_units,
    min(se.occurred_at) as first_sale_at,
    max(se.occurred_at) as last_sale_at
  from public.sales_events se
  left join public.books b on b.id = se.book_id
  group by se.profile_id, se.book_id, b.title;

