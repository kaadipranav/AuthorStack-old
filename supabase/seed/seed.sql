insert into public.profiles (id, email, full_name, subscription_tier, metadata)
values (
  '00000000-0000-0000-0000-000000000000',
  'founder@authorstack.test',
  'Founder Preview',
  'pro',
  jsonb_build_object('seed', true)
)
on conflict (id) do nothing;

insert into public.whop_subscriptions (
  profile_id,
  whop_membership_id,
  plan_name,
  status,
  current_period_end,
  raw_payload
)
values (
  '00000000-0000-0000-0000-000000000000',
  'demo_membership',
  'AuthorStack Pro',
  'active',
  timezone('utc'::text, now()) + interval '30 days',
  jsonb_build_object('note', 'seed data')
)
on conflict (whop_membership_id) do nothing;

insert into public.books (
  id,
  profile_id,
  title,
  subtitle,
  description,
  format,
  status,
  launch_date,
  platforms
)
values (
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'Seed Book',
  'Demo pipeline',
  'This seeded record ensures dashboard metrics render.',
  'ebook',
  'draft',
  (timezone('utc'::text, now()) + interval '14 days')::date,
  array['amazon_kdp']
)
on conflict (id) do nothing;

insert into public.sales_events (
  profile_id,
  book_id,
  platform,
  event_type,
  quantity,
  amount,
  currency,
  occurred_at,
  raw_payload
)
values (
  '00000000-0000-0000-0000-000000000000',
  '11111111-1111-1111-1111-111111111111',
  'amazon_kdp',
  'sale',
  25,
  249.75,
  'USD',
  timezone('utc'::text, now()) - interval '1 day',
  jsonb_build_object('seed', true)
);

insert into public.launch_checklists (
  id,
  profile_id,
  name,
  launch_date,
  notes
)
values (
  '22222222-2222-2222-2222-222222222222',
  '00000000-0000-0000-0000-000000000000',
  'Seed Launch',
  (timezone('utc'::text, now()) + interval '30 days')::date,
  'Populate UI during development'
)
on conflict (id) do nothing;

insert into public.launch_tasks (
  id,
  checklist_id,
  title,
  status,
  due_date
)
values
  ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Finalize manuscript', 'in_progress', (timezone('utc'::text, now()) + interval '7 days')::date),
  ('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'Prep ARC outreach', 'not_started', (timezone('utc'::text, now()) + interval '10 days')::date)
on conflict (id) do nothing;

