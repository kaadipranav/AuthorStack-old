## Distribution Module

- **Goal**: Manage POD (print-on-demand) + retail distribution hand-offs.
- **Architecture**:
  - Queue outbound jobs with Upstash/QStash.
  - Store carrier + printer configuration in Supabase.
  - Provide webhook receivers for fulfillment status.
- **Implementation Checklist**:
  1. Model shipments + fulfillment partners.
  2. Define partner adapters inside this folder.
  3. Expose `/api/distribution/*` endpoints guarded by feature flags.

