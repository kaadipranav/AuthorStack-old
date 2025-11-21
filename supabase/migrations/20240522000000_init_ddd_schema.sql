-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (User Context)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  bio text,
  subscription_tier text check (subscription_tier in ('free', 'pro', 'enterprise')) default 'free',
  updated_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Books table (Book Context)
create table if not exists public.books (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  subtitle text,
  description text,
  format text check (format in ('ebook', 'paperback', 'hardcover', 'audiobook')) not null,
  status text check (status in ('draft', 'scheduled', 'live')) default 'draft' not null,
  launch_date timestamp with time zone,
  cover_path text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.books enable row level security;

create policy "Users can view their own books."
  on books for select
  using ( auth.uid() = profile_id );

create policy "Users can insert their own books."
  on books for insert
  with check ( auth.uid() = profile_id );

create policy "Users can update their own books."
  on books for update
  using ( auth.uid() = profile_id );

create policy "Users can delete their own books."
  on books for delete
  using ( auth.uid() = profile_id );

-- Sales Events table (Book Context)
create table if not exists public.sales_events (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  book_id uuid references public.books(id) on delete set null, -- Optional link to book
  platform text check (platform in ('amazon_kdp', 'gumroad', 'smashwords', 'draft2digital')) not null,
  event_type text check (event_type in ('sale', 'refund')) not null,
  quantity integer not null,
  amount numeric(10, 2) not null,
  currency text default 'USD' not null,
  occurred_at timestamp with time zone not null,
  raw_payload jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.sales_events enable row level security;

create policy "Users can view their own sales."
  on sales_events for select
  using ( auth.uid() = profile_id );

-- Launch Checklists (Launch Context)
create table if not exists public.launch_checklists (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.launch_checklists enable row level security;

create policy "Users can view their own checklists."
  on launch_checklists for select
  using ( auth.uid() = profile_id );

-- Launch Tasks (Launch Context)
create table if not exists public.launch_tasks (
  id uuid default uuid_generate_v4() primary key,
  checklist_id uuid references public.launch_checklists(id) on delete cascade not null,
  title text not null,
  status text check (status in ('pending', 'in_progress', 'completed')) default 'pending' not null,
  due_date timestamp with time zone,
  priority text check (priority in ('low', 'medium', 'high')) default 'medium',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.launch_tasks enable row level security;

create policy "Users can view their own tasks."
  on launch_tasks for select
  using (
    exists (
      select 1 from launch_checklists
      where launch_checklists.id = launch_tasks.checklist_id
      and launch_checklists.profile_id = auth.uid()
    )
  );

-- Storage buckets
insert into storage.buckets (id, name, public)
values ('book-covers', 'book-covers', true)
on conflict (id) do nothing;

create policy "Book covers are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'book-covers' );

create policy "Users can upload book covers."
  on storage.objects for insert
  with check ( bucket_id = 'book-covers' and auth.uid()::text = (storage.foldername(name))[1] );

create policy "Users can update their own book covers."
  on storage.objects for update
  using ( bucket_id = 'book-covers' and auth.uid()::text = (storage.foldername(name))[1] );

create policy "Users can delete their own book covers."
  on storage.objects for delete
  using ( bucket_id = 'book-covers' and auth.uid()::text = (storage.foldername(name))[1] );
