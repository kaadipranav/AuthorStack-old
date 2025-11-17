-- Enable useful extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

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

