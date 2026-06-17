# UI/UX Overhaul Spec — Kuest Mobile App

## Open Questions

None

## Decisions (resolved before coding)

1. **Icon library**: ✅ Use `@expo/vector-icons` (Ionicons) for tab bar icons and UI glyphs. Existing emoji-based category icons untouched.
2. **Safe area handling**: ✅ Add `react-native-safe-area-context` as a new dependency. Use `useSafeAreaInsets()` instead of hardcoded `paddingTop: 60`.
3. **Featured quest data**: ✅ Derive client-side as highest-XP active sponsored quest from existing `quests` list. No schema change, no new fetch.
4. **Greeting copy**: ✅ Import `useAuth` into `index.tsx` for personalised greeting and level chip. Read-only, no new auth logic.

## Files

### Modify
- `apps/mobile/lib/constants.ts` — Add a `COLORS` palette object (semantic tokens: bg, surface, surfaceElevated, border, textPrimary, textSecondary, textMuted, accent, accentSoft, warning, success, sponsor) and a `SPACING` / `RADIUS` scale. Keep existing exports intact (CATEGORY_COLORS, CATEGORY_ICONS, XP_LEVELS, CITY, helpers) for backward compatibility.
- `apps/mobile/app/(tabs)/_layout.tsx` — Add Ionicons tab icons (filled when active, outline when inactive), increase tab bar height, add subtle top border using new `COLORS.border`, set tab label font weight.
- `apps/mobile/app/(tabs)/index.tsx` — Full redesign: greeting header with avatar circle + level chip, compact XP progress strip, optional "Featured Quest" hero card, horizontally scrollable category chip row (with counts), section header "Active Quests" with count, FlatList with empty state and pull-to-refresh, loading skeleton state.
- `apps/mobile/app/(tabs)/leaderboard.tsx` — Polish header to match dashboard typography, redesign "your rank" card with avatar circle and delta arrow placeholder, add medal emoji (🥇🥈🥉) for top 3 rows, alternate row background subtly, empty state.
- `apps/mobile/app/(tabs)/profile.tsx` — Restructure header with larger avatar, settings gear icon (top-right), level chip overlay on avatar, group stats into a cleaner card with vertical dividers, add a section header style consistent with dashboard, polish sign-out button.
- `apps/mobile/components/QuestCard.tsx` — Add subtle border, distance placeholder pill (uses `radius_meters` label only — no geo math added), category color accent stripe on the left edge, improved sponsor pill styling, press-down scale feedback via `activeOpacity` + `transform`.
- `apps/mobile/components/XPBar.tsx` — Add level-up gradient-feel using two stacked Views (no new dep), add small XP numeric label (e.g. `1,240 / 2,000 XP`), thicker track (10px), rounded caps, soft glow effect via shadow.
- `apps/mobile/components/BadgeGrid.tsx` — Improve empty state with icon + 2-line copy, add locked/earned visual distinction via opacity convention (rendered as-is for earned), tighter grid with consistent aspect ratio.

### Create
- `apps/mobile/components/SectionHeader.tsx` — Reusable section header (title + optional trailing text/count).
- `apps/mobile/components/CategoryChip.tsx` — Extracted chip component used by the dashboard category row.
- `apps/mobile/components/EmptyState.tsx` — Generic empty-state component (icon, title, subtitle, optional CTA).
- `apps/mobile/components/Avatar.tsx` — Avatar circle with initial fallback. Accepts `username`, optional `uri`, and `size`.
- `apps/mobile/components/LevelChip.tsx` — Small pill showing `Lv N` with accent background.
- `apps/mobile/components/QuestCardSkeleton.tsx` — Static skeleton placeholder for the loading state (no animation lib needed).

## Interfaces

```typescript
// lib/constants.ts — additions
export const COLORS = {
  bg: '#0B1120',
  surface: '#1E293B',
  surfaceElevated: '#273449',
  border: '#1E293B',
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  accent: '#6366F1',
  accentSoft: '#312E81',
  accentText: '#A5B4FC',
  warning: '#F59E0B',
  success: '#22C55E',
  sponsor: '#F59E0B',
} as const

export const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 } as const
export const RADIUS = { sm: 8, md: 12, lg: 16, xl: 20, pill: 999 } as const

// components/SectionHeader.tsx
interface SectionHeaderProps {
  title: string
  trailing?: string
  style?: ViewStyle
}
export function SectionHeader(props: SectionHeaderProps): JSX.Element

// components/CategoryChip.tsx
interface CategoryChipProps {
  label: string
  active: boolean
  onPress: () => void
  count?: number
}
export function CategoryChip(props: CategoryChipProps): JSX.Element

// components/EmptyState.tsx
interface EmptyStateProps {
  icon: string                 // emoji
  title: string
  subtitle?: string
  ctaLabel?: string
  onCtaPress?: () => void
}
export function EmptyState(props: EmptyStateProps): JSX.Element

// components/Avatar.tsx
interface AvatarProps {
  username: string
  uri?: string | null
  size?: number                // default 48
}
export function Avatar(props: AvatarProps): JSX.Element

// components/LevelChip.tsx
interface LevelChipProps {
  level: number
  compact?: boolean
}
export function LevelChip(props: LevelChipProps): JSX.Element

// components/QuestCardSkeleton.tsx
export function QuestCardSkeleton(): JSX.Element

// QuestCard.tsx — no signature change
// XPBar.tsx — no signature change
// BadgeGrid.tsx — no signature change
```

## Edge Cases

- **No profile yet** (`useAuth().profile === null` on dashboard): greeting falls back to "Welcome to Kuest" — do NOT crash, do NOT render avatar/level chip.
- **Empty quests array**: render `EmptyState` with copy "No quests here yet" + subtitle "Try a different category or check back soon." Do not render the FlatList wrapper.
- **Loading state**: render 3 `QuestCardSkeleton` rows inside the list area, NOT the existing centered "Loading quests…" text.
- **Featured quest absent** (no sponsored active quests): silently omit the hero block — do not show an empty placeholder.
- **Username starts with non-letter** (Avatar initial fallback): use `username[0].toUpperCase()`; if `username` is empty string, render '?'.
- **XPBar at max level**: progress bar shows 100% filled and numeric label reads "Max level".
- **Long quest titles / descriptions**: keep existing `numberOfLines={1}` / `numberOfLines={2}` on QuestCard.
- **Long usernames in leaderboard**: ellipsize with `numberOfLines={1}` on the username Text.
- **Top 3 medal logic**: only show 🥇/🥈/🥉 when `rank === 1 | 2 | 3`; for everyone else show the `#N` text in the existing style.
- **Pull-to-refresh**: must call existing `useQuests().refetch`; spinner color = `COLORS.accent`.
- **Category chips**: `count` is optional and only rendered when defined; the "All" chip gets the total length, each category chip gets `quests.filter(q => q.category === value).length` computed against the UNFILTERED quest list — do not refetch. (If this requires a second query and the user does not want it, render WITHOUT counts. This is an implementation detail; default to no counts to avoid an extra fetch.)
- **Tab icons** (if approved per Open Question 1): active state uses filled Ionicons variant + `COLORS.accent`; inactive uses outline variant + `COLORS.textMuted`.
- **Safe area**: use `useSafeAreaInsets()` from `react-native-safe-area-context` (new dependency approved). Replace existing `paddingTop: 60` usages with `insets.top + 16` for a proper device-aware offset. Wrap `apps/mobile/app/_layout.tsx` in `<SafeAreaProvider>` if not already present.
- **No regressions**: do not change navigation paths, hooks, data fetching, or types beyond what is listed.

## Patterns to Follow

- **Color usage**: Replace hardcoded hex values with the new `COLORS` tokens from `apps/mobile/lib/constants.ts`. Match the existing convention seen in `apps/mobile/components/QuestCard.tsx` of using `${color}22` for soft tinted backgrounds.
- **StyleSheet structure**: Continue the inline `StyleSheet.create({...})` per-file pattern used in every existing screen and component (see `apps/mobile/app/(tabs)/profile.tsx`). Do NOT introduce a styling library.
- **Component file layout**: Follow `apps/mobile/components/QuestCard.tsx` exactly — named `export function ComponentName`, props `interface Props` (or `ComponentNameProps`) above the function, styles below.
- **TouchableOpacity feedback**: Match `apps/mobile/components/QuestCard.tsx` `activeOpacity={0.8}`.
- **Dark theme palette**: Stay within the existing slate/indigo system (`#0F172A`, `#1E293B`, `#6366F1`, `#F1F5F9`, `#64748B`) — new `COLORS` tokens reuse these values verbatim plus a slightly deeper `bg` (`#0B1120`) for higher contrast.
- **Category emoji icons**: Reuse `CATEGORY_ICONS` from `apps/mobile/lib/constants.ts` — do not redefine emoji mappings elsewhere.
- **Header pattern**: The Profile header centering + 60px top padding (`apps/mobile/app/(tabs)/profile.tsx` lines 73-85) is the reference for header layout; mirror that vertical rhythm on the dashboard.
- **Stat card pattern**: The Profile stats row (`apps/mobile/app/(tabs)/profile.tsx` line 86) is the reference for any horizontal stat group used in the new dashboard XP strip.
- **New dependencies approved**: `@expo/vector-icons` (already bundled with Expo, no install needed) and `react-native-safe-area-context` (must be added to `package.json`). Do not add `react-native-reanimated`, `moti`, `react-native-svg`, or `linear-gradient`.
