## Files Changed

### Modified
- `apps/mobile/package.json` — Added `react-native-safe-area-context@4.12.0` as a dependency.
- `apps/mobile/lib/constants.ts` — Added `COLORS`, `SPACING`, and `RADIUS` export objects; all existing exports (CATEGORY_COLORS, CATEGORY_ICONS, XP_LEVELS, CITY, helpers, PROOF_GEOFENCE_RADIUS) left intact.
- `apps/mobile/app/_layout.tsx` — Wrapped the root Stack in `<SafeAreaProvider>` from `react-native-safe-area-context`.
- `apps/mobile/app/(tabs)/_layout.tsx` — Added Ionicons tab icons (filled/outline active/inactive), increased tab bar height to 64, added top border using `COLORS.border`, set `tabBarLabelStyle` font weight to '600'.
- `apps/mobile/app/(tabs)/index.tsx` — Full redesign: greeting header with Avatar + LevelChip (profile-conditional), compact XP progress strip, Featured Quest hero card (highest-XP sponsored quest, omitted when absent), horizontally scrollable CategoryChip row, SectionHeader with quest count, FlatList with pull-to-refresh (COLORS.accent spinner), loading state shows 3 QuestCardSkeleton rows, empty state shows EmptyState component, `paddingTop: 60` replaced with `insets.top + 16`.
- `apps/mobile/app/(tabs)/leaderboard.tsx` — Polished header to match dashboard typography, "your rank" card redesigned with Avatar + delta arrow placeholder, medal emoji (🥇🥈🥉) for ranks 1–3, alternating row background on even rows, EmptyState for empty list, `paddingTop: 60` replaced with `insets.top + 16`, username ellipsized with `numberOfLines={1}`.
- `apps/mobile/app/(tabs)/profile.tsx` — Larger Avatar (88px) with LevelChip overlay, settings gear icon top-right (Ionicons), vertical dividers between stats, SectionHeader for Badges section, XP values formatted with `toLocaleString()`, sign-out button polish, `paddingTop: 60` replaced with `insets.top + 16`.
- `apps/mobile/components/QuestCard.tsx` — Added `borderWidth: 1` border, 4px left-edge color accent stripe, distance placeholder pill showing `radius_meters`, improved sponsor pill with tinted background, `activeOpacity={0.8}` unchanged.
- `apps/mobile/components/XPBar.tsx` — Track height increased to 10px, numeric XP label (e.g. `1,240 / 2,000 XP`), two-stacked-View gradient-feel fill with a lighter glow layer, shadow on track wrapper for soft glow, "Max level" label when at cap.
- `apps/mobile/components/BadgeGrid.tsx` — Improved empty state with icon + 2-line copy, consistent aspect-ratio badge cells, locked/earned opacity convention preserved as-is (earned badges render fully opaque).

### Created
- `apps/mobile/components/SectionHeader.tsx` — Reusable section header with `title` + optional `trailing` text, matches spec interface exactly.
- `apps/mobile/components/CategoryChip.tsx` — Chip component used by dashboard category row; supports `label`, `active`, `onPress`, optional `count`.
- `apps/mobile/components/EmptyState.tsx` — Generic empty-state with `icon`, `title`, optional `subtitle`, optional `ctaLabel`/`onCtaPress`.
- `apps/mobile/components/Avatar.tsx` — Avatar circle with initial fallback; accepts `username`, optional `uri`, optional `size` (default 48); renders '?' when username is empty string.
- `apps/mobile/components/LevelChip.tsx` — Small `Lv N` pill with `COLORS.accent` background; supports `compact` prop.
- `apps/mobile/components/QuestCardSkeleton.tsx` — Static skeleton placeholder (no animation library); matches QuestCard layout with surfaceElevated placeholder blocks.

## Summary

This implementation delivers the UI/UX overhaul described in the spec. A new `COLORS`/`SPACING`/`RADIUS` token system in `constants.ts` provides a consistent dark-slate/indigo palette across all screens and components. Safe-area insets replace hardcoded `paddingTop: 60` everywhere. The dashboard (`index.tsx`) gains a personalised greeting, XP strip, Featured Quest hero card, CategoryChip row, loading skeletons, and pull-to-refresh. The leaderboard gains medal emojis, avatar circles, alternating row shading, and a polished "your rank" card. The profile gains a larger avatar with level chip overlay, a settings gear icon, and vertical stat dividers. QuestCard, XPBar, and BadgeGrid are all visually polished while keeping their existing prop signatures unchanged.

## Focus for Tester

1. **Safe area**: Verify headers on notched/dynamic-island devices (iOS) and tall Android devices — `insets.top + 16` should give correct top clearance with no overlap with the status bar.
2. **No profile edge case** (`index.tsx`): With a freshly signed-out or profile-null state, the dashboard must show "Welcome to Kuest" with no Avatar/LevelChip, and must not crash.
3. **Featured quest logic**: Confirm the hero card shows only when at least one sponsored quest exists; confirm it selects the highest-XP one; confirm it is absent when no sponsored quests exist.
4. **Loading skeletons**: Confirm the three `QuestCardSkeleton` rows appear during the initial data fetch and the old "Loading quests…" text is gone.
5. **Pull-to-refresh**: Confirm the spinner appears in `COLORS.accent` (indigo) and calls `refetch` successfully on both iOS and Android.
6. **Empty quests state**: Filter to a category with no quests and confirm `EmptyState` renders with correct copy; confirm no FlatList crash.
7. **XPBar max level**: With a user at level 10 (≥15,000 XP), confirm the bar is 100% filled and the label reads "Max level".
8. **Leaderboard medal logic**: Ranks 1/2/3 show 🥇/🥈/🥉; rank 4+ shows `#N` text. Top-3 rows should NOT show a `#N` rank text alongside the medal.
9. **Long usernames in leaderboard**: Confirm `numberOfLines={1}` ellipsizes correctly and does not overflow the row.
10. **Tab icons**: Confirm filled Ionicons variant + accent color when active, outline variant + textMuted when inactive on all four tabs.
