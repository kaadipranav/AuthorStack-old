-- Competitors and Insights schema
-- Supports Amazon KDP competitor tracking and analytics insights

-- Ensure set_updated_at function exists (safe to run multiple times)
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Competitors table: stores basic competitor information
create table if not exists public.competitors (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  asin text not null,
  title text not null,
  author text,
  category text,
  format text, -- ebook, paperback, hardcover, audiobook
  image_url text,
  amazon_url text,
  last_synced_at timestamptz,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  unique (profile_id, asin)
);

create index if not exists competitors_profile_idx on public.competitors (profile_id, created_at desc);
create index if not exists competitors_asin_idx on public.competitors (asin);

-- Competitor prices: historical price tracking
create table if not exists public.competitor_prices (
  id uuid primary key default gen_random_uuid(),
  competitor_id uuid not null references public.competitors (id) on delete cascade,
  price numeric(10,2) not null,
  currency text not null default 'USD',
  timestamp timestamptz not null default timezone('utc'::text, now()),
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists competitor_prices_competitor_idx on public.competitor_prices (competitor_id, timestamp desc);

-- Competitor ranks: BSR (Best Seller Rank) tracking
create table if not exists public.competitor_ranks (
  id uuid primary key default gen_random_uuid(),
  competitor_id uuid not null references public.competitors (id) on delete cascade,
  bsr integer not null,
  category text not null,
  timestamp timestamptz not null default timezone('utc'::text, now()),
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists competitor_ranks_competitor_idx on public.competitor_ranks (competitor_id, timestamp desc);

-- Competitor reviews: rating and review count tracking
create table if not exists public.competitor_reviews (
  id uuid primary key default gen_random_uuid(),
  competitor_id uuid not null references public.competitors (id) on delete cascade,
  rating numeric(3,2) not null, -- e.g., 4.5
  review_count integer not null default 0,
  timestamp timestamptz not null default timezone('utc'::text, now()),
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists competitor_reviews_competitor_idx on public.competitor_reviews (competitor_id, timestamp desc);

-- Insights observations: manual user notes for AI to incorporate
create table if not exists public.insights_observations (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  observation_text text not null,
  tags text[] not null default '{}',
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists insights_observations_profile_idx on public.insights_observations (profile_id, created_at desc);

-- Triggers for updated_at
create trigger update_competitors_updated_at
  before update on public.competitors
  for each row
  execute procedure public.set_updated_at();

create trigger update_insights_observations_updated_at
  before update on public.insights_observations
  for each row
  execute procedure public.set_updated_at();

-- RLS policies for multi-tenant security
alter table public.competitors enable row level security;
alter table public.competitor_prices enable row level security;
alter table public.competitor_ranks enable row level security;
alter table public.competitor_reviews enable row level security;
alter table public.insights_observations enable row level security;

-- Competitors policies
create policy "Users can view their own competitors"
  on public.competitors for select
  using (auth.uid() = profile_id);

create policy "Users can insert their own competitors"
  on public.competitors for insert
  with check (auth.uid() = profile_id);

create policy "Users can update their own competitors"
  on public.competitors for update
  using (auth.uid() = profile_id);

create policy "Users can delete their own competitors"
  on public.competitors for delete
  using (auth.uid() = profile_id);

-- Competitor prices policies (read-only for users, system writes)
create policy "Users can view prices for their competitors"
  on public.competitor_prices for select
  using (
    exists (
      select 1 from public.competitors
      where competitors.id = competitor_prices.competitor_id
      and competitors.profile_id = auth.uid()
    )
  );

create policy "System can insert competitor prices"
  on public.competitor_prices for insert
  with check (true);

-- Competitor ranks policies
create policy "Users can view ranks for their competitors"
  on public.competitor_ranks for select
  using (
    exists (
      select 1 from public.competitors
      where competitors.id = competitor_ranks.competitor_id
      and competitors.profile_id = auth.uid()
    )
  );

create policy "System can insert competitor ranks"
  on public.competitor_ranks for insert
  with check (true);

-- Competitor reviews policies
create policy "Users can view reviews for their competitors"
  on public.competitor_reviews for select
  using (
    exists (
      select 1 from public.competitors
      where competitors.id = competitor_reviews.competitor_id
      and competitors.profile_id = auth.uid()
    )
  );

create policy "System can insert competitor reviews"
  on public.competitor_reviews for insert
  with check (true);

-- Insights observations policies
create policy "Users can view their own observations"
  on public.insights_observations for select
  using (auth.uid() = profile_id);

create policy "Users can insert their own observations"
  on public.insights_observations for insert
  with check (auth.uid() = profile_id);

create policy "Users can update their own observations"
  on public.insights_observations for update
  using (auth.uid() = profile_id);

create policy "Users can delete their own observations"
  on public.insights_observations for delete
  using (auth.uid() = profile_id);

-- Helper view for competitor summary
drop view if exists public.competitor_summary_view;
create view public.competitor_summary_view as
  select
    c.id,
    c.profile_id,
    c.asin,
    c.title,
    c.author,
    c.category,
    c.format,
    c.image_url,
    c.last_synced_at,
    (select price from public.competitor_prices where competitor_id = c.id order by timestamp desc limit 1) as current_price,
    (select bsr from public.competitor_ranks where competitor_id = c.id order by timestamp desc limit 1) as current_bsr,
    (select rating from public.competitor_reviews where competitor_id = c.id order by timestamp desc limit 1) as current_rating,
    (select review_count from public.competitor_reviews where competitor_id = c.id order by timestamp desc limit 1) as current_review_count
  from public.competitors c;
