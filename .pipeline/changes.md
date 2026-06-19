## Files Changed

- `apps/mobile/app/settings.tsx` — Created new settings screen with Account (read-only), Notifications (Switch toggles), About (version + no-op nav rows), and Danger Zone (Sign Out) sections; uses absolute back-button pill, safe-area insets, and section-card pattern per spec.
- `apps/mobile/app/(tabs)/profile.tsx` — Added `useRouter` import, instantiated `const router = useRouter()`, and wired `onPress={() => router.push('/settings')}` to the existing settings gear TouchableOpacity.
- `apps/mobile/app/_layout.tsx` — Registered `<Stack.Screen name="settings" options={{ presentation: 'card', headerShown: false }} />` inside the root Stack alongside existing screen entries.

## Summary

The settings gear button in the Profile tab now navigates to a new full-screen Settings route. The settings screen is registered with `presentation: 'card'` and `headerShown: false`. It renders four sections — Account (email, username, city; all read-only via optional chaining with empty-string fallbacks), Notifications (two local-state Switch toggles with no persistence), About (version string, Privacy Policy no-op, Terms of Service no-op), and Danger Zone (Sign Out which calls `await signOut()` then `router.replace('/(auth)/sign-in')`). The screen follows the back-button pill, section card, and StyleSheet conventions from `quest/[id].tsx` and `profile.tsx`.

## Focus for Tester

- Tap the gear icon on the Profile tab and confirm navigation to `/settings` with a card transition.
- Confirm the back arrow (←) returns to the Profile tab.
- Verify Account rows show live session email and profile username/city; confirm they render gracefully (empty string, not crash) when `session` or `profile` is `null` momentarily.
- Verify the `numberOfLines={1}` truncation on long email addresses — no overflow past the right edge.
- Toggle "Quest Nearby" and "Weekly Digest" switches; confirm they are purely local state and reset on unmount.
- Tap Privacy Policy and Terms of Service — confirm no navigation occurs (no-op).
- Tap Sign Out from the settings screen — confirm it signs the user out and redirects to `/(auth)/sign-in` without a flash of the settings screen.
- Verify status bar safe area: top padding driven by `useSafeAreaInsets().top`, nothing hardcoded.
- Verify the back button sits above ScrollView content (zIndex 10) and ScrollView content clears the title/back button via `paddingTop: insets.top + 64`.
