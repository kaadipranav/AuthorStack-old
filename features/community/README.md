## Community Module

- **Goal**: Facilitate peer discussion, accountability, and launch diaries.
- **Data**: Supabase row-level security required for threads/messages.
- **Planned Components**:
  - Channel list + thread view.
  - Moderation tools + report queue.
  - Notification hooks via Resend / future push service.
- **Next Steps**:
  1. Model channels + memberships in Supabase migrations.
  2. Gate UI entrypoints via `isFeatureEnabled("community")`.
  3. Add webhook to sync moderation events to Slack/email.

