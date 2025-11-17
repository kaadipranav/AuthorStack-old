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

