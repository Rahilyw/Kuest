# Kuest — Product Roadmap

**Last updated:** June 18, 2026  
**Stage:** MVP Complete → Pre-Launch Hardening → Growth

---

## Where We Are Right Now

### What's Fully Implemented

**Mobile App (Expo/React Native)**

| Feature | Status | Notes |
|---|---|---|
| Email/password auth (sign up, sign in, sign out) | ✅ Done | Auto-creates profile on sign up |
| Quest feed with category filtering | ✅ Done | Pull-to-refresh, featured hero |
| Quest detail screen | ✅ Done | Full info, category colors, CTA |
| Quest submission (photo + GPS) | ✅ Done | Geofence validation, Supabase Storage |
| Map view with markers + geofence circles | ✅ Done | Category-colored markers |
| Weekly leaderboard | ✅ Done | Top 50, user highlight, DB view |
| User profile (XP bar, badges, stats) | ✅ Done | Deterministic avatar, level chip |
| XP & level system (10 levels, 0–15k XP) | ✅ Done | DB trigger awards XP on approval |
| Badge display grid | ✅ Done | 13 starter badges seeded |
| Design system: Saltwater Saturday | ✅ Done | DESIGN.md fully spec'd + implemented |

**Admin Dashboard (Next.js 14)**

| Feature | Status | Notes |
|---|---|---|
| Dashboard stats overview | ✅ Done | Users, completions, pending, active quests |
| Completions approval queue | ✅ Done | Approve/reject with photo + GPS |
| Quest management (list + create) | ✅ Done | Form for title, coords, XP, sponsor |
| Users table | ✅ Done | XP-sorted, server-rendered (ISR 60s) |
| Sponsors performance view | ✅ Done | Per-sponsor completion metrics |

**Database & Backend**

| Feature | Status | Notes |
|---|---|---|
| PostgreSQL schema (5 tables, 1 view) | ✅ Done | Supabase with RLS on all tables |
| XP-award DB trigger on approval | ✅ Done | Auto-increments XP + level |
| 20 seeded quests (Victoria, BC) | ✅ Done | Real GPS coords, 5 categories |
| 13 seeded badges | ✅ Done | Static, not auto-awarded yet |
| Edge functions (award-xp, redemption code) | ✅ Scaffolded | Not wired to UI |
| Supabase Storage (proof-photos bucket) | ✅ Done | Public bucket, RLS on upload |

**Tests**

| Area | Status |
|---|---|
| Logic tests (XP, leaderboard, avatar, geofence) | ✅ 555-line pure-JS test file |
| UI / integration tests | ❌ None yet |

---

### Known Gaps & Stubs

| Gap | Severity | Impact |
|---|---|---|
| **Admin has no authentication guard** | 🔴 Critical | Anyone can access /admin — must fix before any public exposure |
| **Badge unlock logic not implemented** | 🟠 High | Badges exist in DB but are never auto-awarded |
| **Push notifications not wired** | 🟠 High | `expo-notifications` imported, nothing implemented |
| **Settings screen missing** | 🟡 Medium | Button exists in profile, no nav handler |
| **Avatar photo upload missing** | 🟡 Medium | Avatar is hash-based; no user photo flow |
| **Sponsor redemption code not user-facing** | 🟡 Medium | Edge function exists, not wired to mobile or admin |
| **Sponsor export button missing** | 🟡 Medium | Placeholder on sponsors page |
| **No onboarding / intro flow** | 🟡 Medium | First-time users land directly on quest feed |
| **No streak system** | 🟡 Medium | Mentioned as retention mechanic in PRODUCT.md |
| **Social features absent** | 🟢 Low | Friends, activity feed — v2 |
| **No in-app quest search** | 🟢 Low | Currently only category filter |
| **Admin service role key exposed client-side** | 🔴 Critical | Should be server-side only (Next.js API routes) |

---

## Roadmap

### Phase 0 — Launch Hardening (Do First, ~1–2 weeks)

These are blockers or security issues that must be resolved before any real users touch the app.

| # | Task | Why |
|---|---|---|
| 0.1 | **Admin auth guard** (Supabase Auth on Next.js admin) | Security — admin is wide open |
| 0.2 | **Move admin service role key to server-side** (Next.js API routes / server actions only) | Security — service role key must never reach the browser |
| 0.3 | **Badge auto-unlock engine** (server-side function or DB trigger) | Core engagement loop; badges exist but are never earned |
| 0.4 | **Settings screen** (notification prefs, city field, sign-out) | Profile button already exists with no handler |
| 0.5 | **Error boundary + crash handling** in mobile | User-facing resilience |
| 0.6 | **EAS Build setup** (Expo Application Services for iOS/Android builds) | Required to actually ship to TestFlight / Google Play |

---

### Phase 1 — Retention Mechanics (Weeks 2–4)

Core engagement loops that keep users coming back after their first quest.

| # | Task | Why |
|---|---|---|
| 1.1 | **Push notifications** — quest approved, new quest added, streak reminder | Primary re-engagement channel |
| 1.2 | **Streak system** — daily/weekly quest completion streak counter + display | Retention via habit formation (Duolingo mechanic, city flavor) |
| 1.3 | **In-app quest completion celebration** — appears after submission, not before approval | Reward the action, not the outcome (PRODUCT.md principle) |
| 1.4 | **Avatar photo upload** — pick from library, crop, upload to Supabase Storage | Social identity; profile feels more personal |
| 1.5 | **Quest history tab or section on profile** — list of completed quests (approved only) | Tangible record of real-world activity |
| 1.6 | **Onboarding flow** — 2-3 screen intro on first launch (what Kuest is, pick city, first quest CTA) | Cold-start UX for new users |

---

### Phase 2 — Business Model (Weeks 4–6)

Sponsor features that make Kuest a viable B2B revenue channel.

| # | Task | Why |
|---|---|---|
| 2.1 | **Sponsor redemption code flow** — mobile screen to enter/display code after approval, admin wires edge function | Closes the loop between quest completion and sponsor reward |
| 2.2 | **Sponsor export** — CSV/PDF export of completion metrics per sponsor | Admin operational tool for sponsor invoicing |
| 2.3 | **Sponsored quest highlight design** — distinct card treatment in feed (subtle partner branding) | Differentiates sponsored from community quests in UI |
| 2.4 | **Quest expiry + scheduling** — quests have active_from / active_until dates | Sponsors want time-bounded campaigns |
| 2.5 | **Admin quest editing** — edit existing quest (currently only create + toggle) | QoL for quest operators |

---

### Phase 3 — Social Layer (Weeks 6–10)

The features that turn solo play into community momentum.

| # | Task | Why |
|---|---|---|
| 3.1 | **Activity feed** — friends' recent completions (with photo) | Social proof + FOMO loop |
| 3.2 | **Follow/friend system** — mutual follows or one-way follows | Prerequisite for feed |
| 3.3 | **Quest detail: "X friends completed"** counter | Social proof on individual quests |
| 3.4 | **Share quest / completion** — native share sheet with quest image | Organic growth vector |
| 3.5 | **In-app quest comments or reactions** | Community voice on quests |
| 3.6 | **Neighborhood / area filtering** on map | Victoria is walkable; neighborhood context is local identity |

---

### Phase 4 — Scale & Expansion (Weeks 10+)

Infrastructure and product moves for multi-city or multi-operator growth.

| # | Task | Why |
|---|---|---|
| 4.1 | **Multi-city support** — city selector, city-scoped quests/leaderboard | Core growth: beyond Victoria |
| 4.2 | **Quest types beyond photo proof** — check-in only, QR scan, social media proof | Broadens quest design possibilities for sponsors |
| 4.3 | **Self-serve sponsor portal** — sponsors create/manage their own quests | Reduces admin load, scales B2B |
| 4.4 | **Seasonal / special event quests** — festival mode, city event tie-ins | Local identity product hook |
| 4.5 | **All-time leaderboard + past seasons archive** | Long-term progression sense |
| 4.6 | **iOS / Android widget** — current streak, nearby quest | Home screen presence |

---

## Priority Feature Matrix

| Feature | Effort | Impact | Priority |
|---|---|---|---|
| Admin auth guard | Low | Critical | P0 |
| Move service key server-side | Low | Critical | P0 |
| Badge auto-unlock logic | Medium | High | P0 |
| Settings screen | Low | Medium | P0 |
| EAS Build setup | Low | Critical (ship) | P0 |
| Push notifications | Medium | High | P1 |
| Streak system | Medium | High | P1 |
| Onboarding flow | Medium | High | P1 |
| Avatar upload | Low | Medium | P1 |
| Quest history | Low | Medium | P1 |
| Redemption code flow | Medium | High | P2 |
| Sponsor export | Low | Medium | P2 |
| Quest expiry / scheduling | Medium | Medium | P2 |
| Admin quest editing | Low | Medium | P2 |
| Activity feed | High | High | P3 |
| Follow system | High | High | P3 |
| Share sheet | Low | Medium | P3 |
| Multi-city support | High | High | P4 |
| Self-serve sponsor portal | High | High | P4 |

---

## Tech Debt to Watch

| Area | Issue | When to Fix |
|---|---|---|
| No React Query / SWR | Each hook re-fetches on mount with no cache | Phase 1 — add caching layer when data freshness matters more |
| No integration tests | Only pure-logic tests exist; no Supabase query tests | Phase 0.6 — add before EAS build |
| No error reporting (Sentry etc.) | Crashes are silent in production | Phase 0.5 |
| Admin uses anon key for some queries | Mixed auth levels in admin; should be service-only | Phase 0.2 |
| Leaderboard view is weekly-scoped only | No all-time, monthly, or friend-scoped ranking | Phase 4 |
| `unique(user_id, quest_id)` DB constraint | Prevents re-attempting a rejected quest | Evaluate in Phase 1 |

---

## Success Metrics (from PRODUCT.md)

- **WAU retention after first quest** — primary retention signal
- **Sponsor quest renewal rate** — primary revenue signal
- **Leaderboard week-2 return** — secondary engagement signal
- **Average XP per MAU** — depth-of-play signal

---

*This roadmap is a living document. Update after each phase completes.*
