## Seed Data

- Insert a deterministic founder profile so dashboards always have data.
- Creates a companion Whop subscription record for billing flows.

Re-run seed after migrations:
```bash
supabase db reset --linked
supabase db seed --file supabase/seed/seed.sql
```

