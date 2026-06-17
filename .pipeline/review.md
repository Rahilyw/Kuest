# Review — Kuest UI/UX Overhaul

## Verdict

APPROVE

## Reasoning

Reviewed spec, changes log, test results, and all 15 changed/created source files. Also cross-referenced consumers of the modified `constants.ts` (`map.tsx`, `quest/[id].tsx`, `submit/[questId].tsx`) and the types/hooks (`useAuth`, `useQuests`, `lib/types.ts`) to confirm no regressions.

**Spec compliance** — Everything the spec calls for is implemented:
- `COLORS`/`SPACING`/`RADIUS` exports match the spec interface verbatim (`apps/mobile/lib/constants.ts:1-18`).
- All pre-existing exports (`CATEGORY_COLORS`, `CATEGORY_ICONS`, `XP_LEVELS`, `CITY`, helpers, `PROOF_GEOFENCE_RADIUS`) are preserved with no signature changes.
- Six new components match the prop interfaces exactly: `SectionHeader`, `CategoryChip`, `EmptyState`, `Avatar`, `LevelChip`, `QuestCardSkeleton`.
- `SafeAreaProvider` is wired in `apps/mobile/app/_layout.tsx:24`; every screen uses `insets.top + 16` in place of `paddingTop: 60`.
- Tab icons use filled-when-focused, outline-when-inactive Ionicons with the accent/textMuted color split.
- Dashboard greeting, XP strip, Featured card derivation, CategoryChip row, SectionHeader, skeleton loading, pull-to-refresh, and EmptyState are all in place.
- QuestCard adds the border, accent stripe, distance pill, and sponsor pill background as specified.
- XPBar shows the numeric label, max-level label, thicker 10px track, glow shadow, and stacked-View gradient effect.
- BadgeGrid empty state has icon + 2-line copy and consistent aspect-ratio cells.

**Edge cases** — Every edge case from the spec is handled:
- No profile: `index.tsx:57-73` renders only the "Welcome to Kuest" text without Avatar/LevelChip.
- Empty quests: `EmptyState` is rendered and FlatList is not wrapped.
- Loading: three `QuestCardSkeleton` rows replace the old text.
- No sponsored quest: `featuredQuest` is `null`, hero card is omitted.
- Empty username in Avatar: returns `?`.
- XPBar at max: `isMaxLevel === true`, progress forced to 1, label "Max level".
- Top-3 medal logic in `leaderboard.tsx:88-93` is mutually exclusive with `#N` text.
- Long usernames in leaderboard use `numberOfLines={1}`.
- Division-by-zero in dashboard XP strip (`index.tsx:86-87`) is correctly guarded with `denom === 0 ? 100 : ...`.

**Tests** — 84/84 assertions pass. Checks cover: `getLevelFromXp`/`getXpToNextLevel` at level boundaries; XPBar `isMaxLevel` and progress computation; featured-quest derivation including empty and no-sponsored cases; Avatar fallback for empty-string, non-letter, and symbol cases; medal logic exclusivity; and the no-profile greeting branch.

**TypeScript correctness** — All imports resolve, all prop interfaces are satisfied, Ionicons name typing in `_layout.tsx:5` uses `React.ComponentProps<typeof Ionicons>['name']` (valid), no obvious type leaks.

**Minor non-blocking observations** (not required to fix):
- `index.tsx:173-176` defines a local `getMinXpForLevel` that hard-codes the XP-levels array instead of reusing `XP_LEVELS` from constants. Drift risk if the level table changes.
- `index.tsx:159-166` wires `RefreshControl.refreshing` to the same `loading` flag that switches to the skeleton view, so the pull-to-refresh spinner will rarely be visible. Spec is satisfied; a future pass could split `loading` from `refreshing`.
- `constants.ts:5` sets `border: '#1E293B'`, identical to `surface`, so the QuestCard 1px border on a surface background is effectively invisible. Matches spec verbatim — not a deviation.
- `leaderboard.tsx:79` names the alternating-row flag `isEven` but shades odd-indexed rows. Functionally correct; naming only.
- `profile.tsx:44-46` settings gear icon has no `onPress`. Spec only requested the icon, no behaviour specified.

None of these are spec violations, correctness bugs, security issues, or regressions.

## Required Changes

None.
