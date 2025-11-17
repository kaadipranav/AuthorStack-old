-- Enable useful extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";
create extension if not exists "citext";

-- Profile information mirrors Supabase auth.users entries
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email citext unique,
  full_name text,
  avatar_url text,
  subscription_tier text not null default 'free',
  whop_customer_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

-- Store Whop subscription snapshots for billing reconciliation
create table if not exists public.whop_subscriptions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  whop_membership_id text not null,
  plan_name text not null,
  status text not null default 'inactive',
  current_period_end timestamptz,
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create unique index if not exists whop_subscriptions_membership_idx
  on public.whop_subscriptions (whop_membership_id);

create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  subtitle text,
  description text,
  format text not null default 'ebook',
  status text not null default 'draft',
  launch_date date,
  cover_path text,
  platforms text[] not null default '{}',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists books_profile_idx on public.books (profile_id);

create table if not exists public.platform_connections (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  provider text not null,
  status text not null default 'connected',
  access_token text,
  refresh_token text,
  metadata jsonb not null default '{}'::jsonb,
  last_synced_at timestamptz,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  unique (profile_id, provider)
);

create table if not exists public.ingestion_jobs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  platform text not null,
  status text not null default 'pending',
  payload jsonb not null default '{}'::jsonb,
  scheduled_for timestamptz not null default timezone('utc'::text, now()),
  executed_at timestamptz,
  error_message text,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists ingestion_jobs_profile_idx on public.ingestion_jobs (profile_id, status);

create table if not exists public.sales_events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  book_id uuid references public.books (id) on delete set null,
  platform text not null,
  event_type text not null default 'sale',
  quantity integer not null default 1,
  amount numeric(12,2) not null default 0,
  currency text not null default 'USD',
  occurred_at timestamptz not null default timezone('utc'::text, now()),
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists sales_events_profile_idx on public.sales_events (profile_id, occurred_at);

create table if not exists public.launch_checklists (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  launch_date date,
  notes text,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.launch_tasks (
  id uuid primary key default gen_random_uuid(),
  checklist_id uuid not null references public.launch_checklists (id) on delete cascade,
  title text not null,
  status text not null default 'not_started',
  due_date date,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists launch_tasks_checklist_idx on public.launch_tasks (checklist_id, status);

-- Helper function to keep updated_at in sync
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at
  before update on public.profiles
  for each row
  execute procedure public.set_updated_at();

create trigger update_books_updated_at
  before update on public.books
  for each row
  execute procedure public.set_updated_at();

create trigger update_platform_connections_updated_at
  before update on public.platform_connections
  for each row
  execute procedure public.set_updated_at();

create trigger update_ingestion_jobs_updated_at
  before update on public.ingestion_jobs
  for each row
  execute procedure public.set_updated_at();

create trigger update_launch_checklists_updated_at
  before update on public.launch_checklists
  for each row
  execute procedure public.set_updated_at();

create trigger update_launch_tasks_updated_at
  before update on public.launch_tasks
  for each row
  execute procedure public.set_updated_at();

-- Automatically create profile rows when a Supabase auth user registers
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, metadata)
  values (new.id, new.email, coalesce(new.raw_user_meta_data, '{}'::jsonb))
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();

-- Buckets for media uploads
do $$
begin
  if not exists (select 1 from storage.buckets where id = 'book-covers') then
    perform storage.create_bucket('book-covers', true, true);
  end if;
end $$;

do $$
begin
  if not exists (select 1 from storage.buckets where id = 'kdp-uploads') then
    perform storage.create_bucket('kdp-uploads', false, false);
  end if;
end $$;

