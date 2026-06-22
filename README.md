# Quest!

**Real life, gamified.** Quest! is a city exploration app that turns your neighbourhood into a game. Players complete real-world challenges — trying a local café, running a trail, joining a community event — capture photo proof on location, and earn XP, badges, and leaderboard ranking. Admins review submissions and approve completions through a dedicated web dashboard.

Built for Victoria, BC as the pilot city, but designed to drop into any city with a new seed file.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Mobile App](#mobile-app)
- [Admin Dashboard](#admin-dashboard)
- [Supabase Backend](#supabase-backend)
- [Design System](#design-system)
- [Testing & CI](#testing--ci)
- [Deployment](#deployment)
- [Roadmap](#roadmap)

---

## Overview

Quest! has three moving parts:

| Part | What it is | Who uses it |
|------|-----------|-------------|
| **Mobile app** | Expo / React Native | Players |
| **Admin dashboard** | Next.js 14 | City operators, admins |
| **Supabase backend** | Auth + Postgres + Storage + Edge Functions | Both |

The core loop is:

1. Player opens the app, browses quests on the **Explore** tab
2. Player travels to the quest location (300 m geofence check)
3. Player captures a **photo proof** with the in-app camera
4. Submission goes into an **admin approval queue**
5. Admin reviews the photo and approves/rejects
6. On approval: XP is awarded, level is recalculated, badges are checked, a push notification is sent
7. Completion appears on the **public activity feed**

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                        │
│                                                         │
│   ┌──────────────────┐      ┌──────────────────────┐   │
│   │   Mobile App     │      │   Admin Dashboard    │   │
│   │  Expo / RN       │      │   Next.js 14         │   │
│   │  iOS + Android   │      │   Web only           │   │
│   └────────┬─────────┘      └──────────┬───────────┘   │
└────────────┼───────────────────────────┼───────────────┘
             │                           │
             │ supabase-js (anon key)    │ supabase-js
             │                           │ (service-role key)
             ▼                           ▼
┌─────────────────────────────────────────────────────────┐
│                   Supabase Backend                      │
│                                                         │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │
│  │  Auth   │  │ Postgres │  │ Storage  │  │  Edge  │  │
│  │ (email) │  │ + RLS    │  │ Buckets  │  │  Fns   │  │
│  └─────────┘  └──────────┘  └──────────┘  └────────┘  │
└─────────────────────────────────────────────────────────┘
```

The mobile app uses the **anon key** with Row Level Security enforced at the database. The admin dashboard uses the **service-role key** exclusively in server-side Next.js components and server actions — the key is never sent to the browser.

---

## Project Structure

```
Quest! (monorepo root)
├── apps/
│   ├── mobile/                   Expo mobile app (player client)
│   │   ├── app/                  Expo Router file-based navigation
│   │   │   ├── (auth)/           Sign in, sign up, forgot password
│   │   │   ├── (tabs)/           5-tab main navigation
│   │   │   ├── quest/[id].tsx    Quest detail page
│   │   │   ├── submit/[questId]  Camera + GPS submission flow
│   │   │   ├── onboarding.tsx    3-screen intro + city selection
│   │   │   └── ...               Edit profile, settings, legal
│   │   ├── components/           Reusable UI components
│   │   ├── hooks/                Data-fetching hooks (Supabase queries)
│   │   ├── lib/                  Supabase client, constants, types
│   │   └── __tests__/            Logic unit tests (84 assertions)
│   │
│   └── admin/                    Next.js admin dashboard
│       ├── app/                  App Router pages
│       │   ├── login/            Admin login (email allowlist)
│       │   ├── completions/      Approval queue
│       │   ├── quests/           Quest management + create form
│       │   ├── users/            User directory
│       │   └── sponsors/         Sponsor completion reports
│       ├── lib/                  Supabase clients (server + SSR)
│       └── middleware.ts         Auth redirect guard
│
├── supabase/
│   ├── migrations/               001–010 SQL migration files (ordered)
│   ├── functions/
│   │   ├── award-xp/             Badge checking + push notifications
│   │   └── generate-redemption-code/  Sponsor reward codes
│   ├── seed.sql                  20 Victoria quests + 13 badge definitions
│   └── config.toml               Edge function config
│
├── tokens/                       Shared CSS design tokens
├── docs/                         Additional documentation
├── Gamified City Challenge App/  Figma Make web prototype (design reference)
├── DESIGN.md                     Harbour Electric design system spec
├── ARCHITECTURE.md               Visual architecture maps
├── PRODUCT.md                    Product positioning and strategy
├── ROADMAP.md                    Development status and blockers
└── .github/workflows/ci.yml      GitHub Actions (tests + type checks)
```

---

## Features

### For Players (Mobile App)

**Discover quests**
- Explore tab shows hero-image quest cards with category colour coding
- Category filters: Fitness, Social, Food, Community, Nature
- Map view with quest location pins across the city
- Completed quests are automatically hidden from the feed

**Complete quests**
- Tap a quest card to view full details (description, XP reward, sponsor info)
- GPS geofence check confirms you're within 300 m of the quest location
- In-app camera captures photo proof
- Submission is uploaded to Supabase Storage and queued for admin review

**Track progress**
- XP earned on each approval; 10-level progression (0 → 15,000 XP)
- Weekly leaderboard resets every Monday — compete for the top spot
- Streak system: maintain a weekly completion streak to build momentum
- 13 collectible badges with distinct unlock conditions

**Social feed**
- Activity tab shows a live feed of approved completions from the community
- See who completed what, their level, and when
- Map preview shows quest pin distribution across the city

**Rankings**
- Gold / silver / bronze podium for the top 3 weekly players
- Ranked "chasers" list for positions 4–10
- Featured badges section highlights the community's rarest achievements

**Profile**
- 2×2 stats: level, total XP, current streak, longest streak
- Recent approved completions with timestamps
- Settings for push notification preferences and weekly digest

### For Admins (Dashboard)

**Completions queue**
- Pending submissions with photo thumbnail (click to expand), GPS coordinates, quest title, username, and XP value
- One-click approve (triggers XP award + push notification) or reject
- All admin queries run server-side with the service-role key

**Quest management**
- Create quests with title, description, category, lat/lng (manual or map picker), geofence radius, XP reward
- Sponsor fields: sponsor name, sponsor reward description, toggle
- Toggle any quest active/inactive without deleting

**User directory**
- Full user list sorted by total XP
- Revalidates every 60 seconds (ISR)

**Sponsor reports**
- Per-sponsor completion metrics
- Export button for CSV/reporting

**Dashboard overview**
- Live counts: total users, approved completions, pending queue size, active quests

---

## Tech Stack

### Mobile

| Technology | Version | Role |
|-----------|---------|------|
| Expo | 54 | Build toolchain, OTA updates, EAS |
| React Native | 0.81.5 | UI framework |
| Expo Router | 6 | File-based navigation |
| TypeScript | 5.9 | Type safety |
| Supabase JS | 2.39 | Database, auth, storage |
| expo-camera | 17 | In-app photo capture |
| expo-location | 19 | GPS geofence verification |
| expo-notifications | 0.32 | Push notification delivery |
| expo-image-picker | 17 | Profile avatar selection |
| react-native-maps | 1.20.1 | Quest pin map |
| react-native-reanimated | 4.1.1 | Tab bar animations |
| AsyncStorage | 2.2 | Session persistence |

### Admin

| Technology | Version | Role |
|-----------|---------|------|
| Next.js | 14.2 | Framework (App Router, ISR) |
| React | 18.3 | UI library |
| TypeScript | 5 | Type safety |
| @supabase/ssr | 0.5.2 | SSR-safe auth client |
| @supabase/server | 1.1 | Service-role admin client |

### Backend

| Technology | Role |
|-----------|------|
| Supabase Auth | Email/password authentication |
| Supabase Postgres | Primary database with RLS |
| Supabase Storage | Photo proof, avatars, quest covers |
| Supabase Edge Functions | XP award + push notifications, redemption codes |
| Row Level Security | Per-user data access enforced at DB layer |

---

## Database Schema

### Tables

#### `profiles`
Extends Supabase Auth users with game data.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | Matches `auth.users.id` |
| `username` | text | Display name |
| `city` | text | Selected city (e.g., "Victoria") |
| `total_xp` | integer | Cumulative XP across all completions |
| `level` | integer | 1–10; recalculated on each XP change |
| `avatar_url` | text | Public URL from `avatars` storage bucket |
| `push_token` | text | Expo push token for notifications |
| `current_streak` | integer | Consecutive weeks with ≥1 approved completion |
| `longest_streak` | integer | Historical best streak |
| `last_completion_week` | text | ISO week string (e.g., "2026-W25") |

#### `quests`

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | Quest identifier |
| `title` | text | Quest name |
| `description` | text | What the player must do |
| `category` | enum | `fitness`, `social`, `food`, `community`, `nature` |
| `lat` / `lng` | float | Quest location coordinates |
| `radius_meters` | integer | Geofence radius (default 300 m) |
| `xp_reward` | integer | XP awarded on approval (100–300) |
| `is_sponsored` | boolean | Whether this quest has a sponsor |
| `sponsor_name` | text | Sponsor display name |
| `sponsor_reward` | text | Description of the real-world reward |
| `status` | text | `active` or `inactive` |
| `cover_image_url` | text | Hero image URL for quest cards |

#### `completions`

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | Completion identifier |
| `user_id` | uuid (FK) | References `profiles.id` |
| `quest_id` | uuid (FK) | References `quests.id` |
| `photo_url` | text | Proof photo URL in `proof-photos` bucket |
| `lat` / `lng` | float | GPS coordinates at submission time |
| `completed_at` | timestamptz | Submission timestamp |
| `status` | text | `pending`, `approved`, `rejected` |
| `redemption_code` | text | Generated code for sponsored quests |
| `reviewed_at` | timestamptz | Timestamp of admin decision |

#### `badges`

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | Badge identifier |
| `name` | text | Display name |
| `description` | text | What this badge means |
| `icon` | text | Emoji icon |
| `unlock_condition` | text | Machine-readable condition key |

#### `user_badges`
Junction table. Composite PK on (`user_id`, `badge_id`).

#### `quest_badges`
Links badges to specific quests. Composite PK on (`quest_id`, `badge_id`).

### Views

**`leaderboard`** — Aggregates approved completions from the current ISO week, summing `xp_reward` per user, ordered highest first.

### Key Database Triggers

**`on_completion_approved`** — Fires after any update to `completions`. When `status` changes to `'approved'`:
- Increments `profiles.total_xp` by the quest's `xp_reward`
- Recalculates `profiles.level` using the XP threshold table
- Updates `current_streak`, `longest_streak`, and `last_completion_week`

**`on_xp_update`** — Fires after `profiles.total_xp` changes. Evaluates all 13 badge unlock conditions and inserts any newly earned badges into `user_badges`.

### Storage Buckets

| Bucket | Access | Purpose |
|--------|--------|---------|
| `proof-photos` | Public read, auth upload | Quest proof images from players |
| `avatars` | Public read, auth upload | Player profile photos |
| `quest-covers` | Public read, admin upload | Hero images for quest cards |

### Row Level Security Summary

| Table | Who can read | Who can write |
|-------|-------------|---------------|
| `profiles` | All authenticated users | Own row only |
| `quests` | All authenticated users (active only) | Admin (service-role) |
| `completions` | Own rows + all approved rows | Own rows only |
| `badges` | All authenticated users | Admin (service-role) |
| `user_badges` | Own rows | DB trigger only |

### Migrations

Apply these in order via the Supabase SQL Editor or CLI:

| File | What it adds |
|------|-------------|
| `001_initial_schema.sql` | Core tables, XP trigger on approval, proof-photos bucket |
| `002_badge_unlock_trigger.sql` | Initial badge trigger (superseded by 005) |
| `003_add_quest_categories.sql` | Category enum values |
| `004_push_token.sql` | `push_token` column on profiles |
| `005_align_badge_unlock_logic.sql` | Replaces 002 with complete 13-badge unlock logic |
| `006_streak_system.sql` | Streak columns; extends XP trigger with weekly tracking |
| `007_avatar_bucket.sql` | `avatars` storage bucket + RLS |
| `008_public_feed_completions.sql` | RLS policy for public activity feed |
| `009_quest_cover_and_badges.sql` | `cover_image_url` on quests + `quest_badges` table |
| `010_quest_covers_bucket.sql` | `quest-covers` storage bucket |

---

## Getting Started

### Prerequisites

- Node.js 20+
- Yarn (for workspace scripts) or npm
- [Supabase account](https://supabase.com)
- [Expo Go](https://expo.dev/go) app on your phone (for development) or a simulator

### 1. Clone and install

```bash
git clone https://github.com/your-org/quest.git
cd quest

# Install root dependencies
yarn install

# Install app dependencies
cd apps/mobile && npm install
cd ../admin && npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** in your Supabase dashboard
3. Apply each migration file in order (001 through 010) — paste and run each file from `supabase/migrations/`
4. Run `supabase/seed.sql` to load the 20 starter quests and 13 badge definitions
5. Go to **Project Settings → API** and copy your:
   - Project URL
   - `anon` public key
   - `service_role` secret key

### 3. Configure environment variables

```bash
cp .env.example apps/mobile/.env
cp .env.example apps/admin/.env.local
```

Fill in both files with your Supabase credentials (see [Environment Variables](#environment-variables) below).

### 4. Start the mobile app

```bash
cd apps/mobile
npm start
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS) to run on your device. Use `npm run ios` or `npm run android` to open in a simulator.

### 5. Start the admin dashboard

```bash
cd apps/admin
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign in with an email listed in `ADMIN_ALLOWED_EMAILS`.

---

## Environment Variables

### Mobile (`apps/mobile/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `EXPO_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon (public) key |
| `EXPO_PUBLIC_BYPASS_GEOFENCE` | No | Set to `true` to skip GPS checks in development |

### Admin (`apps/admin/.env.local`)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key (used for auth UI only) |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Service-role secret key — **never expose to browser** |
| `ADMIN_ALLOWED_EMAILS` | Yes | Comma-separated admin email allowlist (e.g. `you@example.com,ops@example.com`) |

---

## Mobile App

### Navigation

The app uses [Expo Router](https://expo.github.io/router/) with file-based routing.

**Auth stack** (`app/(auth)/`)

| Route | Screen |
|-------|--------|
| `sign-in` | Email + password login |
| `sign-up` | Account creation; creates profile row on submit |
| `forgot-password` | Send password reset email |

**Main tabs** (`app/(tabs)/`)

| Tab | Route | What's here |
|-----|-------|------------|
| Explore | `index` | Hero quest cards, player XP card, category filter chips |
| Quests | `feed` | Map preview + public activity feed of approved completions |
| Rankings | `leaderboard` | Weekly podium (top 3), chasers (4–10), featured badges |
| Badges | `badges` | Full 13-badge collection with lock/earned states |
| Profile | `profile` | Stats grid, recent 5 completions, settings link |

**Other routes**

| Route | Purpose |
|-------|---------|
| `quest/[id]` | Quest detail — description, category, XP, sponsor info |
| `submit/[questId]` | Photo capture + GPS submission flow |
| `onboarding` | 3-screen intro shown once on first launch |
| `edit-profile` | Update username and city |
| `settings` | Push notification toggle, weekly digest, sign out |
| `legal/privacy` | Privacy policy |
| `legal/terms` | Terms of service |

### Key Hooks

| Hook | File | What it does |
|------|------|-------------|
| `useAuth` | `hooks/useAuth.ts` | Provides session, profile, and sign-out; persists session in AsyncStorage |
| `useQuests` | `hooks/useQuests.ts` | Fetches active quests; accepts optional category filter |
| `useActivityFeed` | `hooks/useActivityFeed.ts` | Queries approved completions with user and quest joins for the feed |
| `useUserCompletions` | `hooks/useUserCompletions.ts` | Returns the current user's completed quest IDs to hide from Explore |
| `useLocation` | `hooks/useLocation.ts` | GPS location with geofence check helper |

### Quest Submission Flow

```
Explore tab
    │
    ▼
Quest detail page
  (category colour, description, XP, sponsor)
    │
    ▼  tap "Start Quest"
GPS geofence check ──── fail ──→ "You're not close enough" message
    │ pass
    ▼
Camera opens
    │ capture photo
    ▼
Photo uploaded to proof-photos bucket
    │
    ▼
completion row inserted (status: 'pending')
    │
    ▼
Admin approval queue
    │ admin approves
    ▼
DB trigger fires:
  - XP added to profile
  - Level recalculated
  - Streak updated
  - Badges checked (13 conditions)
    │
    ▼
Push notification sent to player
Completion appears on activity feed
```

### XP and Level System

| Level | XP Required |
|-------|------------|
| 1 | 0 |
| 2 | 200 |
| 3 | 500 |
| 4 | 1,000 |
| 5 | 2,000 |
| 6 | 3,500 |
| 7 | 5,500 |
| 8 | 8,000 |
| 9 | 11,000 |
| 10 | 15,000 |

### Badge Catalogue

| Badge | Icon | Condition |
|-------|------|-----------|
| First Quest | 🌟 | Complete 1 quest |
| Getting Warmed Up | 🔥 | Complete 5 quests |
| Local Hero | 🏆 | Complete 10 quests |
| Explorer | 🗺️ | Complete quests in 3+ categories |
| Fitness Fanatic | 💪 | 3+ Fitness quests |
| Social Butterfly | 🦋 | 3+ Social quests |
| Foodie | 🍴 | 3+ Food quests |
| Community Champion | 🤝 | 3+ Community quests |
| Nature Lover | 🌿 | 3+ Nature quests |
| Early Bird | 🐦 | Complete a quest before 9 AM |
| Weekend Warrior | ⚔️ | Complete a quest on a weekend |
| Top 10 | 🎯 | Appear in the weekly leaderboard top 10 |
| Season Veteran | 🎖️ | Streak across 4 consecutive weeks |

---

## Admin Dashboard

The admin dashboard lives at `apps/admin/` and is a standard Next.js 14 app with the App Router.

### Pages

| Route | Purpose |
|-------|---------|
| `/login` | Email sign-in; email must be in `ADMIN_ALLOWED_EMAILS` |
| `/` | Overview dashboard with 4 stat cards |
| `/completions` | Approval queue — photo, GPS, approve/reject |
| `/quests` | Quest list with active toggle |
| `/quests/new` | Create quest form |
| `/users` | User directory sorted by XP (ISR 60 s) |
| `/sponsors` | Per-sponsor completion counts and export |

### Auth Model

- Admins log in with email/password through Supabase Auth
- `middleware.ts` redirects unauthenticated requests to `/login`
- The `ADMIN_ALLOWED_EMAILS` allowlist is checked at login time
- All database queries use the `service_role` key in server components and server actions — it never reaches the browser

### Approving a Completion

1. Navigate to `/completions`
2. See pending submissions with photo thumbnail, GPS coordinates, player username, quest name, and XP value
3. Click the photo to view full-size proof
4. Click **Approve** — this calls the `award-xp` edge function, which:
   - Updates `completions.status` to `'approved'`
   - The DB trigger awards XP, recalculates level, and checks badges
   - Sends a push notification to the player
5. Click **Reject** — sets status to `'rejected'` with no XP awarded

---

## Supabase Backend

### Edge Functions

**`award-xp`**

Called by the admin dashboard when approving a completion. Supplements the DB trigger by handling badge conditions that require cross-table context (Early Bird, Weekend Warrior, Top 10) and sending Expo push notifications.

**`generate-redemption-code`**

Generates or redeems 8-character alphanumeric codes for sponsored quest completions. Accepts `action: 'generate'` (on approve) or `action: 'redeem'` (when player claims reward). Mobile integration is in progress.

### Deploying Edge Functions

```bash
# With Supabase CLI
supabase functions deploy award-xp
supabase functions deploy generate-redemption-code
```

### Local Development with Supabase CLI

```bash
# Start local Supabase stack
supabase start

# Apply migrations
supabase db reset

# Seed data
supabase db seed --data supabase/seed.sql

# Run edge functions locally
supabase functions serve
```

---

## Design System

Quest! uses the **Harbour Electric** design system. Full spec in [DESIGN.md](DESIGN.md). Token files are in `tokens/`.

### Colour Palette

| Token | Hex | Use |
|-------|-----|-----|
| Quest Sky | `#E8F3FF` | App background |
| Quest Blue | `#4364F7` | Brand, CTAs, active tab pill |
| City Orange | `#FF6B35` | City badge, notifications, highlights |
| Navy | `#0D1B3E` | Primary text, Rankings/Profile headers |
| Quest White | `#FFFFFF` | Card surfaces, form inputs |

### Category Colours

| Category | Colour | Hex |
|----------|--------|-----|
| Fitness | Green | `#22C55E` |
| Social | Purple | `#A855F7` |
| Food | Orange | `#F97316` |
| Community | Blue | `#3B82F6` |
| Nature | Teal | `#14B8A6` |

### Design Principles

- **Image-led** — every quest card shows a full-bleed hero photo
- **Earned over given** — badges feel meaningful because they require real effort in the real world
- **Realness** — social proof comes from actual player photos, not generated content
- **Light mode, glass surfaces** — sky blue background with white cards and subtle shadows
- **WCAG AA** — 44×44 pt minimum touch targets; sufficient colour contrast throughout

---

## Testing & CI

### Unit Tests

Logic tests live at `apps/mobile/__tests__/logic.test.js` and cover 84 assertions across:

- XP calculation and level thresholds
- Leaderboard ranking logic
- Geofence distance calculations (Haversine formula)
- Greeting text generation
- Avatar URL helpers

```bash
cd apps/mobile
npm test
```

### Type Checking

```bash
# Mobile
cd apps/mobile && npx tsc --noEmit

# Admin
cd apps/admin && npx tsc --noEmit
```

### CI (GitHub Actions)

Every push to `main` and every pull request targeting `main` runs `.github/workflows/ci.yml`:

1. **logic-tests** — Node 20; runs `apps/mobile/__tests__/logic.test.js`
2. **typescript-check-mobile** — Installs deps; runs `tsc --noEmit` on the mobile app
3. **typescript-check-admin** — Installs deps; runs `tsc --noEmit` on the admin dashboard

---

## Deployment

### Mobile — EAS Build

The mobile app uses [Expo Application Services](https://expo.dev/eas) for builds and OTA updates.

```bash
cd apps/mobile

# Install EAS CLI
npm install -g eas-cli
eas login

# Development build (run on physical device)
npm run build:dev

# Preview build (TestFlight / internal testing)
npm run build:preview

# Production build
npm run build:prod

# Submit to App Store and Google Play
npm run submit:prod

# Push an OTA update without a new store submission
npm run update
```

Build profiles are defined in `apps/mobile/eas.json`.

### Admin — Vercel (Recommended)

```bash
cd apps/admin
npx vercel deploy
```

Set the following environment variables in your Vercel project settings:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ADMIN_ALLOWED_EMAILS
```

The admin app uses Next.js ISR for the user directory page (60-second revalidation). All other pages are dynamically server-rendered.

---

## Roadmap

See [ROADMAP.md](ROADMAP.md) for the full status breakdown.

**In progress**
- Sponsored quest redemption code flow (mobile UI not yet connected to edge function)
- Push notification tap handlers (token registration is wired; deep link on tap is not)

**Coming next**
- Avatar upload in the Edit Profile screen
- Streak milestone celebration modal
- ESLint and Prettier configuration
- UI and integration tests (Detox for mobile, Playwright for admin)
- Multi-city support (city picker in admin, per-city quest filtering)
