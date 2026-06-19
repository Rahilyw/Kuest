# Settings Screen Spec

## Overview
Wire up the existing settings gear button in the Profile tab to navigate to a new full settings screen. The settings screen exposes Account info (read-only), Notification toggles (visual only — no persistence yet), About info, and a Danger Zone with a destructive Sign Out action. The screen is registered with the root Stack with `headerShown: false` and `presentation: 'card'`.

## Open Questions
None.

## Files

### Modify
- `apps/mobile/app/(tabs)/profile.tsx` — Add `useRouter` import, instantiate `const router = useRouter()`, and add `onPress={() => router.push('/settings')}` to the existing `settingsBtn` TouchableOpacity (currently at line 44, no onPress).
- `apps/mobile/app/_layout.tsx` — Add `<Stack.Screen name="settings" options={{ presentation: 'card', headerShown: false }} />` inside the existing Stack, alongside the other Stack.Screen entries.

### Create
- `apps/mobile/app/settings.tsx` — New full settings screen with Account, Notifications, About, and Danger Zone sections.

## Interfaces

### `apps/mobile/app/settings.tsx`
```tsx
export default function Settings(): JSX.Element
```

Internal local state:
```tsx
const [questNearby, setQuestNearby] = useState<boolean>(true)
const [weeklyDigest, setWeeklyDigest] = useState<boolean>(true)
```

Hooks used:
- `useRouter()` from `expo-router` — for back navigation and post-signout redirect
- `useSafeAreaInsets()` from `react-native-safe-area-context` — for top padding under the status bar
- `useAuth()` from `@/hooks/useAuth` — destructure `{ session, profile, signOut }`

Sign-out handler:
```tsx
async function handleSignOut() {
  await signOut()
  router.replace('/(auth)/sign-in')
}
```

Imports required:
```tsx
import { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '@/hooks/useAuth'
import { SectionHeader } from '@/components/SectionHeader'
import { COLORS, SPACING, RADIUS } from '@/lib/constants'
```

### `apps/mobile/app/(tabs)/profile.tsx`
Add to imports:
```ts
import { useRouter } from 'expo-router'
```
Inside the `Profile` component body, alongside existing hooks:
```ts
const router = useRouter()
```
Update the existing TouchableOpacity at line 44:
```tsx
<TouchableOpacity
  style={styles.settingsBtn}
  activeOpacity={0.8}
  onPress={() => router.push('/settings')}
>
```

### `apps/mobile/app/_layout.tsx`
Add inside `<Stack screenOptions={{ headerShown: false }}>` after the existing `submit/[questId]` entry:
```tsx
<Stack.Screen name="settings" options={{ presentation: 'card', headerShown: false }} />
```

## Settings Screen Structure

Root layout:
- Outer container: `View` with `flex: 1, backgroundColor: COLORS.bg`.
- Absolute-positioned back-button pill (top-left, top: `insets.top + 12`, left: `SPACING.lg`, zIndex 10) — pattern copied from `apps/mobile/app/quest/[id].tsx`:
  ```tsx
  <TouchableOpacity style={styles.back} onPress={() => router.back()} activeOpacity={0.8}>
    <View style={styles.backPill}>
      <Text style={[styles.backText, { color: COLORS.accent }]}>←</Text>
    </View>
  </TouchableOpacity>
  ```
- Screen title "Settings" centered horizontally at the top, top padding `insets.top + 18`, fontSize 22, fontWeight '700', color `COLORS.textPrimary`, textAlign 'center'.
- `ScrollView` with `style={{ flex: 1 }}` and `contentContainerStyle={{ padding: SPACING.md, paddingTop: SPACING.lg, paddingBottom: 80 }}`. The ScrollView starts below the absolute back button and title; place the title inside an outer View that the ScrollView sits below, or give the ScrollView top padding sufficient to clear the title (`insets.top + 64`).

### Section card pattern
Each section is:
1. A `<SectionHeader title="..." />` above the card.
2. A single rounded card wrapping all rows:
   ```ts
   sectionCard: {
     backgroundColor: COLORS.surface,
     borderRadius: RADIUS.md,
     borderWidth: 1,
     borderColor: COLORS.border,
     overflow: 'hidden',
     marginBottom: SPACING.lg,
   }
   ```
3. Rows: each row is a horizontal flex row, height 52, padded `paddingHorizontal: SPACING.md`. Every row except the last in the card gets `borderBottomWidth: 1, borderBottomColor: COLORS.border`.
   ```ts
   row: {
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'space-between',
     paddingHorizontal: SPACING.md,
     height: 52,
   }
   ```
4. Row label: `color: COLORS.textPrimary, fontSize: 15, fontWeight: '500'`.
5. Row right-side value (read-only text): `color: COLORS.textMuted, fontSize: 14, flexShrink: 1, textAlign: 'right', marginLeft: SPACING.md`.

### ACCOUNT section
`<SectionHeader title="Account" />`
Rows inside one `sectionCard`:
1. Email — label "Email", right `<Text>{session?.user?.email ?? ''}</Text>` (muted, right-aligned).
2. Username — label "Username", right `<Text>{profile?.username ? '@' + profile.username : ''}</Text>` (muted).
3. City — label "City", right `<Text>{profile?.city ?? ''}</Text>` (muted).

All read-only. No chevron, no Switch.

### NOTIFICATIONS section
`<SectionHeader title="Notifications" />`
Rows inside one `sectionCard`:
1. "Quest Nearby" — right element is a `Switch`:
   ```tsx
   <Switch
     value={questNearby}
     onValueChange={setQuestNearby}
     thumbColor="#FFFFFF"
     trackColor={{ false: '#CBD5E1', true: COLORS.accent }}
     ios_backgroundColor="#CBD5E1"
   />
   ```
2. "Weekly Digest" — right element is the same `Switch` bound to `weeklyDigest` / `setWeeklyDigest`.

### ABOUT section
`<SectionHeader title="About" />`
Rows inside one `sectionCard`:
1. Version — label "Version", right `<Text>1.0.0</Text>` (muted).
2. Privacy Policy — whole row is a `TouchableOpacity` with `activeOpacity={0.7}` and `onPress={() => {}}` (no-op). Right side: `<Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />`.
3. Terms of Service — same pattern as Privacy Policy, no-op onPress, chevron-forward icon.

### DANGER ZONE section
`<SectionHeader title="Danger Zone" />`
Single-row `sectionCard` containing one `TouchableOpacity`:
```tsx
<TouchableOpacity
  style={styles.signOutRow}
  onPress={handleSignOut}
  activeOpacity={0.7}
>
  <Text style={styles.signOutText}>Sign Out</Text>
</TouchableOpacity>
```
Styles:
```ts
signOutRow: { height: 52, alignItems: 'center', justifyContent: 'center' },
signOutText: { color: '#EF4444', fontSize: 15, fontWeight: '600' },
```

### Back-button pill styles (copy from quest/[id].tsx)
```ts
back: { position: 'absolute', top: 0, left: 0, zIndex: 10 },  // top offset applied inline via insets
backPill: {
  backgroundColor: 'rgba(255,255,255,0.9)',
  borderRadius: 999,
  width: 36,
  height: 36,
  alignItems: 'center',
  justifyContent: 'center',
  shadowColor: '#0F172A',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 6,
  elevation: 3,
},
backText: { fontSize: 20, fontWeight: '700', lineHeight: 28 },
```
(The `back` container's `top` value is applied inline: `style={[styles.back, { top: insets.top + 12, left: SPACING.lg }]}`.)

## Edge Cases
- `session` or `profile` may be `null` momentarily — use optional chaining (`session?.user?.email`, `profile?.username`, `profile?.city`) and render an empty string fallback. Do not early-return `null`; the user must still be able to access Sign Out.
- After `signOut()` resolves, `useAuth`'s auth-state listener will null out the session and the root `_layout.tsx` redirect effect will also trigger navigation to `/(auth)/sign-in`. The explicit `router.replace('/(auth)/sign-in')` is still called to make the transition immediate and avoid a flash of the settings screen on a null session.
- Switch state is local-only and resets on unmount — intentional per the request (no persistence yet, no toast, no analytics).
- Privacy Policy and Terms of Service onPress are intentional no-ops (`() => {}`) — do not link to URLs or call `Linking.openURL`.
- Long email addresses must not overflow: right-side `<Text>` uses `flexShrink: 1, textAlign: 'right', marginLeft: SPACING.md` and `numberOfLines={1}`.
- Back button sits above ScrollView content via absolute position + `zIndex: 10`. ScrollView's `contentContainerStyle.paddingTop` clears the back button + title.
- Status bar safe area: top offset via `useSafeAreaInsets().top`, never hardcoded.

## Patterns to Follow
- **Back-button pill**: Copy `back` / `backPill` / `backText` styles and the wrapping TouchableOpacity structure from `apps/mobile/app/quest/[id].tsx` (lines 28–32 for JSX, lines 87–101 for styles). Replace the category color with `COLORS.accent` for the arrow.
- **SectionHeader usage**: Reuse the existing component at `apps/mobile/components/SectionHeader.tsx` exactly as used in `apps/mobile/app/(tabs)/profile.tsx` line 80 — pass only `title` (omit `trailing`).
- **Glass card styling**: Mirror the `stats` card pattern in `apps/mobile/app/(tabs)/profile.tsx` (lines 112–121) — `backgroundColor: COLORS.surface`, `borderRadius: RADIUS.md` (use `md` per spec, not `lg`), `borderWidth: 1, borderColor: COLORS.border`.
- **Sign-out flow**: Extend the pattern from `apps/mobile/app/(tabs)/profile.tsx` line 83 (`onPress={signOut}`) — call `await signOut()` then `router.replace('/(auth)/sign-in')`, mirroring the redirect target used in `apps/mobile/app/_layout.tsx` line 17.
- **Imports order**: Follow `apps/mobile/app/(tabs)/profile.tsx` — React imports first, then `react-native`, then `expo-router`, then `react-native-safe-area-context`, then `@expo/vector-icons`, then `@/hooks/...`, then `@/components/...`, then `@/lib/constants`.
- **StyleSheet placement**: `StyleSheet.create({...})` at the bottom of the file, same convention as `profile.tsx` and `quest/[id].tsx`.
- **Stack.Screen registration**: Mirror the existing `quest/[id]` and `submit/[questId]` registrations in `apps/mobile/app/_layout.tsx` (lines 28–29).
