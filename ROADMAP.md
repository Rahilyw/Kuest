# Kuest — Product Roadmap

**Last updated:** June 18, 2026  
**Stage:** MVP Complete → Pre-Launch Hardening

The core product loop works end-to-end: discover quest → submit proof → admin approves → XP + leaderboard update. What remains is wiring (badges, push, redemption), authorization hardening, and ship infrastructure — not greenfield feature work.

---

## Snapshot

| Area | Status |
|---|---|
| Mobile core loop | ✅ Shippable |
| Admin operations | ✅ Usable (with auth gaps) |
| Engagement plumbing | ⚠️ Partially wired |
| Sponsor / B2B loop | ❌ Not connected |
| Production readiness | ⚠️ EAS + error handling incomplete |

**Highest-impact blockers before real users:**

1. Badge seed data ≠ unlock logic — only ~1 of 13 badges reliably awards today
2. `award-xp` edge function never called on approval — no push on approve, edge badge logic skipped
3. Admin auth is session-only — any Supabase user can access the dashboard
4. EAS config still has placeholder project IDs and secrets

---

## What's Fully Implemented

### Mobile App (`apps/mobile`)

| Feature | Notes |
|---|---|
| Email/password auth | Sign up, sign in, sign out; profile auto-created on sign up |
| Onboarding (3 screens) | First-launch intro, city pick, sign-up/sign-in CTA — `app/onboarding.tsx` |
| Quest feed | Category filter, pull-to-refresh, featured sponsored hero |
| Quest detail | Full info, category colors, start/submit CTA |
| Quest submission | Camera proof, GPS geofence, Supabase Storage upload |
| Submission celebration | Post-submit modal (pending approval) — `CompletionCelebration.tsx` |
| Map view | Category-colored markers + geofence circles |
| Weekly leaderboard | Top 50, user highlight, DB view |
| User profile | XP bar, badge grid, stats, quest history (last 20 approved) |
| Settings screen | Account info, push toggles, sign out — `app/settings.tsx` |
| XP & level system | 10 levels, 0–15k XP; DB trigger on approval |
| Push token registration | Permission, Expo token, save to `profiles.push_token` |
| Design system | Saltwater Saturday — `DESIGN.md` spec'd + implemented |

### Admin Dashboard (`apps/admin`)

| Feature | Notes |
|---|---|
| Session auth + login page | Middleware redirects unauthenticated users to `/login` |
| Service role server-only | `supabaseAdmin` in server components/actions only — never in client bundle |
| Dashboard stats | Users, completions, pending, active quests |
| Completions queue | Approve/reject with photo + GPS |
| Quest management | List, create, toggle active/inactive |
| Users table | XP-sorted, server-rendered (ISR 60s) |
| Sponsors view | Per-sponsor completion metrics (display only) |

### Database & Backend (`supabase/`)

| Feature | Notes |
|---|---|
| PostgreSQL schema | 5 tables, 1 view, RLS on core tables |
| XP-award DB trigger | `on_completion_approved` — increments XP + recalculates level |
| Badge unlock DB trigger | `on_xp_update` in `002_badge_unlock_trigger.sql` |
| Migrations 001–004 | Schema, badges, categories, push_token |
| 20 seeded quests | Victoria, BC — real GPS, 5 categories |
| 13 seeded badges | Names/rules **do not match** unlock trigger (see gaps) |
| Edge functions | `award-xp`, `generate-redemption-code` — implemented, **not invoked** |
| Supabase Storage | `proof-photos` bucket, RLS on upload |

### Tests

| Area | Status |
|---|---|
| Logic tests (XP, leaderboard, avatar, geofence) | ✅ `apps/mobile/__tests__/logic.test.js` |
| UI / integration tests | ❌ None |

---

## Partially Implemented

These exist in code but are incomplete, misaligned, or not connected end-to-end.

| Feature | What works | What's missing |
|---|---|---|
| **Push notifications** | Client registration, settings toggle, sign-out cleanup | Backend sender on approval; `award-xp` not called; no new-quest/streak pushes; weekly digest is local-only; EAS project ID placeholder |
| **Badge auto-unlock** | DB trigger + edge function logic exist | Seed badge names/rules don't match trigger; only `First Quest` reliably unlocks |
| **Admin auth** | Session gate via middleware | No admin role/allowlist — any authenticated user gets in |
| **Settings** | Account display, push prefs, sign out | Privacy/Terms stubs; no edit city/profile |
| **EAS Build** | `eas.json`, npm scripts, `BUILDING.md` | Placeholder env vars, project ID, submit credentials |
| **Sponsored quests (UI)** | Feed hero + sponsor pill on `QuestCard` | Admin create form has no sponsor fields in UI; no sponsored rows in seed |
| **Map view** | Markers, circles, user location | `React.Fragment` used without `import React` — likely runtime error |
| **Quest management (admin)** | Create + toggle status | No edit; sponsor fields not exposed in form |

---

## Known Gaps

| Gap | Severity | Impact |
|---|---|---|
| **Badge seed ↔ unlock mismatch** | ⚠️ Partial | 12/13 badges wired via `005_align_badge_unlock_logic.sql`; Season Veteran deferred (requires seasons table) |
| **`award-xp` not wired to admin approval** | 🔴 Critical | No push on approve; edge-function badge logic never runs |
| **Admin has no role allowlist** | 🔴 Critical | Any Supabase account can access admin after login |
| **EAS not configured for real builds** | 🔴 Critical (ship) | Placeholders block TestFlight / Play Store |
| **Redemption code flow** | 🟠 High | Edge function + DB column exist; no mobile UI or admin invoke |
| **Streak system** | 🟠 High | Retention mechanic from PRODUCT.md — not started |
| **Avatar photo upload** | 🟡 Medium | Display only; hash-based fallback |
| **Error boundary + crash reporting** | 🟡 Medium | Crashes are silent in production |
| **Sponsor export** | 🟡 Medium | Placeholder copy on sponsors page |
| **Quest expiry / scheduling** | 🟡 Medium | No `active_from` / `active_until` in schema |
| **Admin quest editing** | 🟡 Medium | Create + toggle only |
| **Social features** | 🟢 Low | Friends, activity feed — v2 |
| **In-app quest search** | 🟢 Low | Category filter only |

### Resolved since prior roadmap

| Was listed as gap | Now |
|---|---|
| Admin has no authentication guard | ✅ Session middleware + login page (role check still needed) |
| Service role key exposed client-side | ✅ `server-only` module; client pages use server actions |
| Push notifications not wired | ⚠️ Client registration done; sending not wired |
| Settings screen missing | ✅ Core screen shipped |
| No onboarding flow | ✅ 3-screen first-launch flow |
| Quest history missing | ✅ Profile section with approved completions |
| Submission celebration missing | ✅ Post-submit modal |

---

## Roadmap

Status key: ✅ Done · ⚠️ Partial · ❌ Not started

### Phase 0 — Launch Hardening (~1–2 weeks)

Blockers before any real users touch the app.

| # | Task | Status | Why / next step |
|---|---|---|---|
| 0.1 | **Admin role allowlist** | ⚠️ Partial | Middleware exists; add email/domain or role check so not every Supabase user is an admin |
| 0.2 | **Service role server-side only** | ✅ Done | `apps/admin/lib/supabase.ts` uses `server-only`; no client imports |
| 0.3 | **Badge auto-unlock — align seed + trigger** | ⚠️ Broken | Pick one source of truth: update `seed.sql` names/thresholds OR rewrite `002_badge_unlock_trigger.sql` + `award-xp` to match seed |
| 0.4 | **Settings screen polish** | ⚠️ Partial | Core done; add edit city, wire Privacy/Terms links |
| 0.5 | **Error boundary + crash reporting** | ❌ | Root-level `ErrorBoundary` in mobile; Sentry or equivalent |
| 0.6 | **EAS Build — real config** | ⚠️ Partial | Run `eas init`, replace placeholders in `app.json` + `eas.json`, first dev/preview build |
| 0.7 | **Wire `award-xp` on approval** | ❌ | Call from `apps/admin/app/completions/actions.ts` after approve — unlocks push + edge badge path |
| 0.8 | **Fix map `React` import** | ❌ | One-line fix in `app/(tabs)/map.tsx` |
| 0.9 | **Consolidate migrations + docs** | ❌ | Duplicate `push_token` migrations; README only documents `001` — document full order |

**Suggested order:** 0.3 → 0.7 → 0.1 → 0.8 → 0.6 → 0.5

---

### Phase 1 — Retention Mechanics (Weeks 2–4)

| # | Task | Status | Why / next step |
|---|---|---|---|
| 1.1 | **Push notifications — full pipeline** | ⚠️ Partial | Token registration done; wire sender, in-app listeners, new-quest + streak reminders |
| 1.2 | **Streak system** | ❌ | Daily/weekly completion counter + profile display |
| 1.3 | **Submission celebration** | ✅ Done | Modal after submit, not after approval — matches PRODUCT.md |
| 1.4 | **Avatar photo upload** | ❌ | Pick, crop, upload to Storage; update `profiles.avatar_url` |
| 1.5 | **Quest history on profile** | ✅ Done | Approved completions, last 20, empty state |
| 1.6 | **Onboarding flow** | ✅ Done | 3 screens, city pick, AsyncStorage gate |

---

### Phase 2 — Business Model (Weeks 4–6)

| # | Task | Status | Why / next step |
|---|---|---|---|
| 2.1 | **Redemption code flow** | ❌ | Wire `generate-redemption-code` from admin on sponsored approval; show code in mobile post-approval |
| 2.2 | **Sponsor export** | ❌ | CSV export of completion metrics per sponsor |
| 2.3 | **Sponsored quest UI (admin create)** | ⚠️ Partial | Mobile feed supports sponsors; add sponsor fields to admin quest form + seed sponsored quests |
| 2.4 | **Quest expiry + scheduling** | ❌ | `active_from` / `active_until` columns + admin UI |
| 2.5 | **Admin quest editing** | ❌ | Edit existing quest fields, not just create + toggle |

---

### Phase 3 — Social Layer (Weeks 6–10)

| # | Task | Status |
|---|---|---|
| 3.1 | Activity feed — friends' recent completions | ❌ |
| 3.2 | Follow/friend system | ❌ |
| 3.3 | Quest detail: "X friends completed" counter | ❌ |
| 3.4 | Share quest / completion (native share sheet) | ❌ |
| 3.5 | In-app quest comments or reactions | ❌ |
| 3.6 | Neighborhood / area filtering on map | ❌ |

---

### Phase 4 — Scale & Expansion (Weeks 10+)

| # | Task | Status |
|---|---|---|
| 4.1 | Multi-city support — scoped quests + leaderboard | ❌ (onboarding city pick is pilot-only) |
| 4.2 | Quest types beyond photo proof (check-in, QR, social) | ❌ |
| 4.3 | Self-serve sponsor portal | ❌ |
| 4.4 | Seasonal / special event quests | ❌ |
| 4.5 | All-time leaderboard + past seasons archive | ❌ |
| 4.6 | iOS / Android widget (streak, nearby quest) | ❌ |

---

## Priority Matrix (Revised)

| Feature | Effort | Impact | Priority | Status |
|---|---|---|---|---|
| Badge seed ↔ unlock alignment | Medium | Critical | **P0** | ⚠️ Broken |
| Wire `award-xp` on approval | Low | Critical | **P0** | ❌ |
| Admin role allowlist | Low | Critical | **P0** | ⚠️ Partial |
| EAS real config + first build | Low | Critical (ship) | **P0** | ⚠️ Partial |
| Fix map React import | Trivial | Medium | **P0** | ❌ |
| Error boundary + Sentry | Low | High | **P0** | ❌ |
| Push notification sending | Medium | High | **P1** | ⚠️ Partial |
| Streak system | Medium | High | **P1** | ❌ |
| Avatar upload | Low | Medium | **P1** | ❌ |
| Redemption code flow | Medium | High | **P2** | ❌ |
| Sponsor export + admin sponsor fields | Low–Med | Medium | **P2** | ❌ |
| Quest expiry / scheduling | Medium | Medium | **P2** | ❌ |
| Admin quest editing | Low | Medium | **P2** | ❌ |
| Onboarding flow | — | High | — | ✅ Done |
| Quest history | — | Medium | — | ✅ Done |
| Submission celebration | — | Medium | — | ✅ Done |
| Settings (core) | — | Medium | — | ✅ Done |
| Service role server-side | — | Critical | — | ✅ Done |

---

## Tech Debt

| Area | Issue | When to fix |
|---|---|---|
| Badge name/category drift | `seed.sql` vs `002_badge_unlock_trigger.sql` vs `award-xp` | **Now (P0)** |
| Edge functions orphaned | No caller in admin, mobile, or DB webhooks | **Now (P0)** |
| Duplicate `push_token` migrations | `004_push_token.sql` + `20250618120000_add_push_token_to_profiles.sql` | Phase 0.9 |
| Migration docs incomplete | README stops at `001` | Phase 0.9 |
| Env var naming drift | Admin uses `SUPABASE_SECRET_KEY`; docs may say `SERVICE_ROLE_KEY` | Phase 0.6 |
| No React Query / SWR | Hooks re-fetch on every mount | Phase 1 |
| No integration tests | Pure-logic tests only | Before first EAS production build |
| No error reporting | Crashes silent in prod | Phase 0.5 |
| Leaderboard weekly-only | No all-time, monthly, or friend scope | Phase 4 |
| `unique(user_id, quest_id)` | Blocks re-attempt after rejection | Evaluate in Phase 1 |
| No sponsored quests in seed | Can't test sponsor/redemption E2E | Phase 2.1 |

---

## Architecture Notes

**Approval flow today:**

```
Mobile submit → completions (pending)
  → Admin approve (direct status update)
  → DB trigger: award XP + level
  → DB trigger: check badges on total_xp update (misaligned with seed)
  ✗ award-xp edge function (push + edge badges) — never called
  ✗ generate-redemption-code — never called
```

**Target approval flow:**

```
Admin approve
  → DB trigger: XP + level + badges (aligned seed)
  → invoke award-xp: push notification + badge redundancy
  → if sponsored: invoke generate-redemption-code
  → mobile: show code + push "Quest approved!"
```

---

## Success Metrics (from PRODUCT.md)

- **WAU retention after first quest** — primary retention signal
- **Sponsor quest renewal rate** — primary revenue signal
- **Leaderboard week-2 return** — secondary engagement signal
- **Average XP per MAU** — depth-of-play signal

---

## Changelog

| Date | Change |
|---|---|
| Jun 18, 2026 | Full rewrite after codebase audit. Marked onboarding, quest history, submission celebration, settings, push registration, admin session auth as done/partial. Added badge mismatch, award-xp wiring, map bug, EAS placeholders as P0 blockers. |
| Jun 18, 2026 | Badge unlock aligned: 12/13 badges now award via `005_align_badge_unlock_logic.sql` + `award-xp` rewrite; Season Veteran deferred (requires seasons table). |

---

*Update this document when a phase item ships or when audit reveals drift.*
