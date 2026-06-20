# Quest! — Product Roadmap

**Last updated:** June 18, 2026  
**Stage:** MVP Complete → Pre-Launch Hardening

The core product loop works end-to-end: discover quest → submit proof → admin approves → XP + leaderboard update. What remains is ship infrastructure (EAS), redemption wiring, and retention mechanics — not greenfield feature work.

---

## Snapshot

| Area | Status |
|---|---|
| Mobile core loop | ✅ Shippable |
| Admin operations | ✅ Usable (set `ADMIN_ALLOWED_EMAILS` before prod deploy) |
| Engagement plumbing | ⚠️ Mostly wired (push on approve needs EAS project ID + device build) |
| Sponsor / B2B loop | ❌ Not connected |
| Production readiness | ⚠️ EAS placeholders remain; error boundary shipped, Sentry not yet |

**Highest-impact blockers before real users:**

1. EAS config still has placeholder project IDs and secrets — blocks TestFlight / Play internal builds and push tokens
2. `ADMIN_ALLOWED_EMAILS` must be set in production — code denies all logins if unset (safe default)
3. Confirm migration `005_align_badge_unlock_logic.sql` is applied on live Supabase (12/13 badges; Season Veteran deferred)
4. Redemption code flow not wired — `generate-redemption-code` still has no caller

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
| Map view | Category-colored markers + geofence circles — `Fragment` import fixed |
| Weekly leaderboard | Top 50, user highlight, DB view |
| User profile | XP bar, badge grid, stats, quest history (last 20 approved) |
| Settings screen | Account info, push toggle (wired to token register/clear), weekly digest pref, sign out |
| XP & level system | 10 levels, 0–15k XP; DB trigger on approval |
| Push token registration | Permission, Expo token, save to `profiles.push_token` |
| Root error boundary | `components/ErrorBoundary.tsx` wraps Stack in `_layout.tsx` |
| Design system | Saltwater Saturday — `DESIGN.md` spec'd + implemented |

### Admin Dashboard (`apps/admin`)

| Feature | Notes |
|---|---|
| Session auth + login page | Middleware redirects unauthenticated users to `/login` |
| Admin email allowlist | `ADMIN_ALLOWED_EMAILS` env + `lib/admin-auth.ts`; prod denies if unset |
| Service role server-only | `supabaseAdmin` in server components/actions only — never in client bundle |
| `award-xp` invocation | `lib/invoke-edge-function.ts` called after approve in completions action |
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
| Badge unlock DB trigger | `005_align_badge_unlock_logic.sql` replaces `002` logic — 12/13 badges aligned with seed |
| Migrations 001–005 | Schema, badges, categories, push_token, badge alignment |
| 20 seeded quests | Victoria, BC — real GPS, 5 categories |
| 13 seeded badges | 12 unlock rules match DB trigger + `award-xp`; Season Veteran deferred |
| Edge functions | `award-xp` invoked on admin approve; `generate-redemption-code` implemented, not invoked |
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
| **Push notifications** | Client registration, settings toggle wired to token, sign-out cleanup, `award-xp` sends push on approve | EAS project ID placeholder blocks tokens in builds; no new-quest/streak pushes; weekly digest is local-only |
| **Badge auto-unlock** | 12/13 badges via `005` DB trigger + `award-xp` redundancy | Season Veteran needs seasons table; confirm `005` applied on live DB |
| **Admin auth** | Session gate + email allowlist in middleware | Must set `ADMIN_ALLOWED_EMAILS` in prod; dev allows all with warning if unset |
| **Settings** | Account display, push toggle, weekly digest pref, sign out | Privacy/Terms stubs; no edit city/profile |
| **EAS Build** | `eas.json`, npm scripts, `BUILDING.md` checklist, `apps/mobile/.env.example` | Placeholder env vars, project ID, submit credentials — requires `eas init` |
| **Error handling** | Root `ErrorBoundary` with on-brand fallback + Try Again | No Sentry or crash reporting service |
| **Sponsored quests (UI)** | Feed hero + sponsor pill on `QuestCard`; admin list shows sponsor column | Create form state has sponsor fields but UI doesn't expose them; no sponsored rows in seed |
| **Quest management (admin)** | Create + toggle status | No edit; sponsor fields not exposed in create form |

---

## Known Gaps

| Gap | Severity | Impact |
|---|---|---|
| **EAS not configured for real builds** | 🔴 Critical (ship) | Placeholders in `app.json` + `eas.json` block TestFlight / Play Store |
| **`ADMIN_ALLOWED_EMAILS` unset in prod** | 🔴 Critical (ops) | All admin logins denied until env is set |
| **Migration 005 not applied on live DB** | 🟠 High | Badge unlock may still use old `002` logic if only 001–004 were run manually |
| **Redemption code flow** | 🟠 High | Edge function + DB column exist; no mobile UI or admin invoke |
| **Season Veteran badge** | 🟡 Medium | Requires seasons table — deferred in `005` + `award-xp` |
| **Streak system** | 🟠 High | Retention mechanic from PRODUCT.md — not started |
| **Avatar photo upload** | 🟡 Medium | Display only; hash-based fallback |
| **Crash reporting (Sentry)** | 🟡 Medium | Error boundary catches UI crashes; no remote reporting |
| **Sponsor export** | 🟡 Medium | Placeholder copy on sponsors page |
| **Quest expiry / scheduling** | 🟡 Medium | No `active_from` / `active_until` in schema |
| **Admin quest editing** | 🟡 Medium | Create + toggle only |
| **Social features** | 🟢 Low | Friends, activity feed — v2 |
| **In-app quest search** | 🟢 Low | Category filter only |

### Resolved since prior roadmap

| Was listed as gap | Now |
|---|---|
| Badge seed ↔ unlock mismatch (12/13) | ✅ `005_align_badge_unlock_logic.sql` + `award-xp` aligned with `seed.sql` |
| `award-xp` not wired to admin approval | ✅ `invoke-edge-function.ts` + completions action |
| Admin has no role allowlist | ✅ `ADMIN_ALLOWED_EMAILS` + middleware (set env in prod) |
| Map `React.Fragment` crash | ✅ `import { Fragment } from 'react'` in `map.tsx` |
| No error boundary | ✅ Root `ErrorBoundary` in `_layout.tsx` |
| Admin has no authentication guard | ✅ Session middleware + login page |
| Service role key exposed client-side | ✅ `server-only` module; client pages use server actions |
| Push sender on approval | ⚠️ Wired via `award-xp`; needs deployed function + EAS project ID + device build |
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
| 0.1 | **Admin role allowlist** | ✅ Done | `lib/admin-auth.ts` + middleware; set `ADMIN_ALLOWED_EMAILS` before prod deploy |
| 0.2 | **Service role server-side only** | ✅ Done | `apps/admin/lib/supabase.ts` uses `server-only`; no client imports |
| 0.3 | **Badge auto-unlock — align seed + trigger** | ⚠️ Partial | `005` + `award-xp` match seed for 12/13; Season Veteran deferred; confirm migration applied |
| 0.4 | **Settings screen polish** | ⚠️ Partial | Push toggle wired; add edit city, wire Privacy/Terms links |
| 0.5 | **Error boundary + crash reporting** | ⚠️ Partial | `ErrorBoundary` shipped; add Sentry or equivalent |
| 0.6 | **EAS Build — real config** | ⚠️ Partial | `BUILDING.md` + `.env.example` done; run `eas init`, replace placeholders, first preview build |
| 0.7 | **Wire `award-xp` on approval** | ✅ Done | `apps/admin/lib/invoke-edge-function.ts` + completions action after approve |
| 0.8 | **Fix map `React` import** | ✅ Done | `import { Fragment } from 'react'` in `app/(tabs)/map.tsx` |
| 0.9 | **Consolidate migrations + docs** | ❌ | Duplicate `push_token` migrations; README only documents `001` — document full order |

**Suggested order:** 0.6 → 0.9 → 0.5 (Sentry) → confirm 0.3 on live DB

---

### Phase 1 — Retention Mechanics (Weeks 2–4)

| # | Task | Status | Why / next step |
|---|---|---|---|
| 1.1 | **Push notifications — full pipeline** | ⚠️ Partial | Approve push wired via `award-xp`; add in-app listeners, new-quest + streak reminders |
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
| 2.3 | **Sponsored quest UI (admin create)** | ⚠️ Partial | Mobile feed supports sponsors; expose sponsor fields in admin create form + seed sponsored quests |
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
| EAS real config + first build | Low | Critical (ship) | **P0** | ⚠️ Partial |
| `ADMIN_ALLOWED_EMAILS` in prod | Trivial | Critical | **P0** | ⚠️ Set on deploy |
| Confirm migration 005 on live DB | Low | High | **P0** | ⚠️ Ops check |
| Error boundary + Sentry | Low | High | **P0** | ⚠️ Boundary done; Sentry not |
| Badge unlock (12/13) | — | Critical | **P0** | ⚠️ Code done; verify DB |
| Wire `award-xp` on approval | Low | Critical | **P0** | ✅ Done |
| Admin role allowlist | Low | Critical | **P0** | ✅ Done |
| Fix map React import | Trivial | Medium | **P0** | ✅ Done |
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
| Badge Season Veteran | Requires seasons table; stubbed in `005` + `award-xp` | Phase 4.4 |
| `generate-redemption-code` orphaned | No caller in admin or DB webhooks | Phase 2.1 |
| Duplicate `push_token` migrations | `004_push_token.sql` + `20250618120000_add_push_token_to_profiles.sql` | Phase 0.9 |
| Migration docs incomplete | README stops at `001` | Phase 0.9 |
| Env var naming drift | Root `.env.example` says `SUPABASE_SERVICE_ROLE_KEY`; admin uses `SUPABASE_SECRET_KEY` | Phase 0.9 |
| No React Query / SWR | Hooks re-fetch on every mount | Phase 1 |
| No integration tests | Pure-logic tests only | Before first EAS production build |
| No error reporting | Error boundary only; no Sentry | Phase 0.5 |
| Leaderboard weekly-only | No all-time, monthly, or friend scope | Phase 4 |
| `unique(user_id, quest_id)` | Blocks re-attempt after rejection | Evaluate in Phase 1 |
| No sponsored quests in seed | Can't test sponsor/redemption E2E | Phase 2.1 |

---

## Architecture Notes

**Approval flow today:**

```
Mobile submit → completions (pending)
  → Admin approve (status + reviewed_at)
  → DB trigger: award XP + level
  → DB trigger: check badges on total_xp update (005-aligned, if migration applied)
  → invoke award-xp edge function: push notification + badge redundancy
  ✗ generate-redemption-code — not called
  ✗ mobile redemption code UI — not built
```

**Target approval flow (remaining work):**

```
Admin approve
  → (above — already in place)
  → if sponsored: invoke generate-redemption-code
  → mobile: show redemption code on approval notification / profile
```

Push on approve requires: deployed `award-xp` function, valid admin `SUPABASE_SECRET_KEY`, user `push_token` on profile (EAS project ID + physical device build).

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
| Jun 18, 2026 | Phase 0 progress: `award-xp` wired on admin approve, map Fragment fix, root ErrorBoundary, admin email allowlist, `BUILDING.md` + mobile `.env.example`. Updated blockers, architecture diagram, and priority matrix to match codebase. |

---

*Update this document when a phase item ships or when audit reveals drift.*
