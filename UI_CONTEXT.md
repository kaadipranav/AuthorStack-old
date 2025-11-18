# AuthorStack — UI_CONTEXT.md

> **Purpose:** A single-source, exhaustive UI specification for AuthorStack. Use this file as the canonical style + interaction guide for Cursor/Windsurf/any design or frontend engineer building the product.

---

## 0 — Philosophy & High-level Goals

- **Visual DNA:** "modern literary newsroom + financial command center" — an editorial, print-inspired aesthetic with modern responsive interactions.
- **Tone:** Calm, authoritative, precise, quietly premium. Not flashy, not minimalist-for-minimalism’s-sake — purposeful, textured, and legible.
- **Primary user:** Indie authors (self-pub), small publishing teams, ghostwriters.
- **Core objectives:** Clarity of data, instant trust, delightful interactions, legible editorial typography, accessible components.

---

## 1 — Design Tokens (Tailwind-first + CSS variable equivalents)

### Colors
```yaml
--bg: #FAF7F1         /* off-white paper */
--text: #11110F       /* near-black ink */
--muted: #3C3B39      /* secondary text */
--accent: #8A1B2E     /* deep burgundy */
--accent-2: #6B3A2E   /* complementary tannin */
--success: #1F6F4F    /* muted forest green */
--warning: #C79B17    /* desaturated amber */
--danger: #B33A3A     /* muted red */
--card: #FFFFFF       /* card surface */
--glass: rgba(17,17,15,0.03) /* subtle overlay */
--stroke: rgba(17,17,15,0.06)/* thin rules */
```

Tailwind config (tokens):
```js
module.exports = {
  theme: {
    extend: {
      colors: {
        paper: '#FAF7F1',
        ink: '#11110F',
        charcoal: '#3C3B39',
        burgundy: '#8A1B2E',
        tannin: '#6B3A2E',
        forest: '#1F6F4F',
        amber: '#C79B17',
        danger: '#B33A3A',
        surface: '#FFFFFF',
        glass: 'rgba(17,17,15,0.03)'
      }
    }
  }
}
```

### Typography
- Headings: serif display — **Tiempos** or **Merriweather** (weights: 400,700)
- Body: sans — **Inter** or **Inter var** (weights: 300,400,600)
- Mono (for numbers / code): **JetBrains Mono**

Tokens:
```yaml
--font-heading: 'Merriweather', serif
--font-body: 'Inter', sans-serif
--font-mono: 'JetBrains Mono', monospace
--type-scale:
  h1: 40px/1.05 700
  h2: 28px/1.12 700
  h3: 20px/1.25 600
  body-lg: 18px/1.5 400
  body: 16px/1.5 400
  small: 13px/1.4 400
```

### Spacing & Layout
- Base spacing unit: `8px` (Tailwind `space-2`/`p-2` corresponds to 8px).
- Grid rhythm for main dashboard: three-column desktop grid (Left nav, main content (2/3), right-insights column).
- Max content width: 1280px. Centered layout with generous side gutters on large screens.

### Radii & Shadows
- border-radius: `8px` for cards, `12px` for modals
- subtle shadow for elevated surfaces: `0 6px 18px rgba(17,17,15,0.06)`

### Breakpoints
- `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px, `2xl` 1536px

### Motion
- base easing: `cubic-bezier(.2,.9,.2,1)`
- durations: `fast`=120ms, `normal`=200ms, `slow`=320ms
- modal & route transitions: 240ms fade + 20px translateY

---

## 2 — Layout & Page System

### Global shell
- **Top bar (sticky):** left: small logo (wordmark + mark), center: global search (cmd+k), right: user menu (avatar), quick actions (New Book + Sync Now), notifications bell.
- **Left Sidebar (collapsible, sticky):** compact icons-only collapsed; expanded shows icons + labels. Contains: Dashboard, Books, Launches, Competitors, A/B Tests, Calendar, Insights, Integrations, Settings, Billing.
- **Main area:** scrollable, content width 900–980px on `lg`, or full width on `xl` with side insights.
- **Right insights rail (optional):** live alerts, quick tips from mascot, leaderboard highlights, upcoming tasks.

### Landing vs App
- Landing page (marketing): editorial hero — full-bleed text-on-paper hero with subtle typographic animations and a book-cover carousel. CTA: "Connect your first platform" (primary) and "See demo" (secondary). Pricing block uses the same editorial grid.
- App pages use the AuthorStack shell with `max-w-7xl` and three column layout.

---

## 3 — Component Library (complete)

> Each component entry: visual, props, states, accessibility.

### A. Logo / Wordmark
- Assets: SVG with two layers (mark + wordmark). Provide `dark` and `light` variants.
- Sizes: `xs` (32x32), `sm` (40x40), `md`(56x56)

### B. Topbar
- Elements: Logo, Global Search (Cmd+K), Breadcrumb (on subpages), Quick Actions (`New Book` primary), Sync Button (with last sync timestamp), Notifications, Avatar Menu.
- Sync button: shows spinner when in-progress; success check for 1.5s on completion.
- Accessibility: search input `aria-label="Search AuthorStack"`; quick actions keyboard accessible.

### C. Sidebar
- Collapsed: 56px width, icons only (tooltip on hover)
- Expanded: 240px width, icon + label, small unread badge
- Active item highlight: left-side 3px accent bar in `--accent` color
- Keyboard navigation: `aria-current` on active link.

### D. Cards (generic)
- Use `surface` background, `8px` radius, padding `p-4` or `p-6` for bigger cards
- Header row: Title (serif h3), subtitle (muted), actions menu (kebab)
- Empty state: subtle illustration + microcopy + CTA

### E. Revenue Card (Hero KPI)
- Layout: large revenue number (mono/semibold), small sparkline underneath, delta pill (▲ or ▼) — color-coded
- Interactions: hover shows breakdown by platform; click expands details drawer (slide-over)
- Data states: loading skeleton, error (retry CTA)

### F. Charts
- Library: Recharts (or Chart.js fallback)
- Chart types: line (revenue/time), stacked bar (platform split), donut (book share), area (reads over time)
- Styling: strokes use `--ink` with 0.9 alpha; accent line uses `--accent` for primary series; grid lines subtle `--stroke`.
- Tooltips: large card tooltip with date, revenue, unit sold; rounded `8px` box, small shadow.
- Accessibility: provide a table alternative for screen readers (aria-hidden chart, aria-describedby linking to table)

### G. Tables
- Use zebra-less rows, thin dividers, left-aligned text, compact vertical padding (12px).
- Column actions: sort, filter (icon triggers popover), column hide/show.
- Row expansion: click to expand details (transactions, platform id, ASIN link).
- Empty states with CTA.

### H. Modals & Slide-overs
- Slide-over from right for detailed views (e.g., book detail). Width 520px on desktop, full-screen on mobile.
- Modal: center, max-width 720px, overlay `glass` with 0.6 opacity.
- Close behavior: ESC, click outside, close button. Focus trap implemented.

### I. Forms
- Labels: top-aligned, serif label for important fields (Book Title) and sans for helper text.
- Inputs: single-line 44px height, rounded 8px, subtle border `--stroke`.
- Field validation: inline messages below field (muted for hint, amber for warning, danger for error).
- Autosave: small "Saved" microcopy with timestamp after changes.

### J. Badge & Pills
- Use for genre tags, platform chips. Slight fill with `glass` and 6px radius. Small text `12px`.

### K. Empty States
- Use subtle paper-texture illustrations, serif headline, two-line description, primary CTA.

### L. Notifications & Alerts
- Non-modal toast top-right (stacked); success in `--forest`, warning in `--amber`, danger in `--danger`.
- In-app alerts appear as slim yellow bar above main content.

### M. Onboarding Flows
- Progressive onboarding: Connect platform modal (Gumroad, KDP CSV, Apple Books) — shows benefits, permissions, sample data.
- Checklist wizard: 4-step with progress indicator, example data preview.

### N. Mascot Widget (Phase 3)
- Small persistent chat bubble in right rail with avatar (2–3 personalities selectable), minimized to compact 48px circle.
- When opened: conversational card with suggested actions ("Show me last 30 days revenue", "Recommend price for 'Romance' genre").
- Microcopy: friendly but authoritative tone. Provide a toggle to disable.

---

## 4 — Page & Feature Wireframes (detailed)

> Provide short wireframes in markdown-style layout; Cursor/Windsurf can use these to scaffold pages.

### Dashboard (Home)
- Top: KPI strip (Revenue, Units sold, Page reads, Active launches) — horizontally scrollable small cards
- Hero: Revenue card (big) with time-range selector (7d, 30d, 90d, custom)
- Middle-left: Books table (top performing books with small cover thumbnail, URL to store)
- Middle-right (insights rail): Top competitor price moves, upcoming tasks, leaderboard snippet
- Bottom: recent activity feed (sync events, refunds, emails sent)

### Book Detail Page
- Header: book cover, title, author, platforms connected, edit metadata button
- Tabs: Overview | Sales | Pricing | A/B Tests | Launches | Reviews
- Overview: last 30d revenue chart, heatmap of daily sales, best performing channels
- Sales tab: raw transactions table, export CSV
- Pricing tab: competitor price widget + price suggestion recommender

### Launchs Page
- List of launches with progress bars (30/60/90 day templates)
- Create Launch modal: choose template, set date, pick tasks to include

### Competitor Tracking
- Add competitor modal (search by ASIN/title)
- Grid of tracked competitors w/ current price, last change, sparkline

### A/B Tests Page
- Active tests list, create test flow (upload covers, titles), tracking short URLs
- Live results: impressions, clicks, conversions, significance indicator

### Settings / Integrations
- Integrations dashboard: connect/disconnect platforms, manage tokens
- Billing: plan status, invoices, cancel/upgrade

---

## 5 — Interaction Details & Microcopy

### Global microcopy style guide
- Voice: concise, slightly literary, clear — short sentences, occasional gentle humor
- Examples:
  - Empty revenue: "No sales yet — connect a platform to see your first dollars."
  - Sync success: "Synced: 563 sales (last 24h) • Updated 5m ago"
  - AB test winner: "Variant B wins at 94% confidence — declare winner?"

### Buttons
- Primary: filled `--accent` with white text, hover darken slightly
- Secondary: outline `--stroke`, text `--ink`
- Ghost: text only, subtle hover underline

### Keyboard shortcuts
- `Cmd/Ctrl + K` — Global search
- `Cmd/Ctrl + 1` — Dashboard
- `Cmd/Ctrl + N` — New Book / New Launch
- `/` — Focus search in page

---

## 6 — Accessibility

- Color contrast: ensure text >= 4.5:1 against background. Provide accessible color alternatives for vision-impaired users in settings.
- Focus states: 3px ring using `--accent` with 8px gap
- All interactive elements keyboard focusable; ARIA labels for complex widgets
- Charts: include accessible table fallback and `aria-describedby` linking
- Provide text resizing (12px–22px) via settings

---

## 7 — Responsive Behavior (important details)

- **Mobile nav:** bottom nav bar with 4 main items (Dashboard, Books, Launches, Insights). Collapsed sidebar hidden.
- **Tables:** transform to stacked card list on small screens. Use horizontal scroll for wide tables as last resort.
- **Charts:** use simplified sparklines on small screens; allow tap to expand to full-screen chart modal.
- **Slide-overs:** become full-screen modals.

---

## 8 — Visual Assets & Deliverables for Cursor/Windsurf

- Provide SVG logo in two variants (light/dark), favicon (32px), wordmark.
- Provide sample cover thumbnails (400x600) placeholder set (10 images) for UI mock data.
- Provide `paper-texture` PNG at 2000x2000 at 1% opacity for background subtlety.
- Icon set: Lucide or Feather — include custom glyphs for "KDP", "Gumroad", "Apple Books".

---

## 9 — Developer Handoff / Component API (props & example usage)

### Example React components (props sketch)

```tsx
// RevenueCard.tsx
export default function RevenueCard({
  total, delta, sparklineData, byPlatform
}: {
  total: number;
  delta: number; // percent
  sparklineData: number[];
  byPlatform: { name: string; revenue: number }[];
}) {
  return (<Card>...</Card>);
}
```

```tsx
// BookTable.tsx
<BookTable
  books={[{id, title, coverUrl, platform, revenue, unitsSold}]}
  onRowClick={(id) => router.push(`/books/${id}`)}
/>
```

**API endpoints used by UI** (UI-friendly names — devs can map to actual routes from CONTEXT.md):
- `GET /api/dashboard/overview?range=30` → { revenue, units, topBooks }
- `GET /api/books` → list books
- `GET /api/books/:id/sales?range=30` → timeseries
- `POST /api/platforms/connect` → start OAuth or upload CSV
- `POST /api/sync` → trigger manual sync

Include example JSON shapes in repo `mock/` for seeding components.

---

## 10 — Edge Cases, Errors & Loading

- Loading: skeleton cards (shimmer) for all heavy data. Use subtle gradient from `--glass`.
- Rate-limited API: show inline banner "Sync delayed due to API limits — retry now" with suggested action.
- Data mismatch (currency): show currency badge and conversion tooltip.
- Permission errors: instruct user to reauthorize connection with clear microcopy.

---

## 11 — Handoff Checklist for Cursor/Windsurf

1. Implement Tailwind tokens and fonts in project root
2. Create global layout (Topbar + Sidebar + Main + RightRail)
3. Build atomic components: Buttons, Cards, Inputs, Modals, Tables
4. Implement RevenueCard, BookTable, Chart wrappers
5. Create mock API routes to feed components
6. Build responsive variants and keyboard shortcuts
7. Polish micro-interactions & accessibility
8. Provide stories or preview pages for each component

---

## 12 — Prompts for Cursor/Windsurf (copy-paste)

**Prompt 1 — build RevenueCard:**
> "Create a React + Tailwind component `RevenueCard` following the design tokens in UI_CONTEXT.md. Use Recharts for sparkline. Support loading, error, and expanded drawer states. Include keyboard accessibility and unit tests."

**Prompt 2 — implement global layout:**
> "Create the AuthorStack shell layout—Topbar, collapsible Sidebar, Main content area, RightRail. Use Tailwind and shadcn/ui building blocks. Follow responsive behavior and include keyboard shortcuts."

(attach full UI_CONTEXT.md content when prompting)

---

## 13 — QA Notes & Visual Acceptance Criteria

- Typography: Headings must use serif; body must use sans. No system fallback except if fonts unavailable.
- Contrast: All interactive text must pass AA.
- Rhythm: Vertical rhythm consistent (8px grid). Cards align visually on a 12px baseline.
- Motion: Animations must be subtle and performant (no layout thrash).

---

## 14 — Future / Phase 2 UI Additions (brief)

- Leaderboard page (ProductHunt style) with filtering by genre / weekly movers
- Mascot chat UI and conversational flows
- Marketing calendar full-page editor with drag & drop events
- Print & fulfillment dashboard (post-18 feature)

---

## Appendix: Example Mock JSON (minimal)

```json
{
  "dashboard": {
    "revenue": 1284.5,
    "units": 312,
    "platforms": [{"name":"gumroad","revenue":734.5},{"name":"kdp","revenue":550}]
  },
  "books": [
    {"id":"b1","title":"Silver Thorns","coverUrl":"/mock/cover1.jpg","revenue":420,"units":120},
    {"id":"b2","title":"Letters to P","coverUrl":"/mock/cover2.jpg","revenue":320,"units":90}
  ]
}
```

---

_End of UI_CONTEXT.md — use this as the canonical spec. Iterate and update this document as decisions are made._
