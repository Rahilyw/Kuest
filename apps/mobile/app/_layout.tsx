import { useEffect, useState } from 'react'
import { Stack, useRouter, useSegments } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { useAuth } from '@/hooks/useAuth'
import { registerForPushNotifications } from '@/lib/notifications'
import { hasCompletedOnboarding } from '@/lib/onboarding'

export default function RootLayout() {
  const { session, loading } = useAuth()
  const router = useRouter()
  const segments = useSegments()
  const [onboardingChecked, setOnboardingChecked] = useState(false)
  const [hasOnboarded, setHasOnboarded] = useState(false)

  useEffect(() => {
    hasCompletedOnboarding().then((complete) => {
      setHasOnboarded(complete)
      setOnboardingChecked(true)
    })
  }, [])

  useEffect(() => {
    const inOnboarding = segments[0] === 'onboarding'
    if (!inOnboarding && onboardingChecked) {
      hasCompletedOnboarding().then(setHasOnboarded)
    }
  }, [segments[0], onboardingChecked])

  useEffect(() => {
    if (!session?.user.id) return
    registerForPushNotifications(session.user.id)
  }, [session?.user.id])

  useEffect(() => {
    if (loading || !onboardingChecked) return

    const inAuthGroup = segments[0] === '(auth)'
    const inOnboarding = segments[0] === 'onboarding'

    if (!hasOnboarded && !inOnboarding) {
      router.replace('/onboarding')
      return
    }

    if (hasOnboarded && !session && !inAuthGroup && !inOnboarding) {
      router.replace('/(auth)/sign-in')
    } else if (session && inAuthGroup) {
      router.replace('/(tabs)')
    }
  }, [session, loading, onboardingChecked, hasOnboarded, segments])

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="quest/[id]" options={{ presentation: 'card' }} />
          <Stack.Screen name="submit/[questId]" options={{ presentation: 'modal' }} />
          <Stack.Screen name="settings" options={{ presentation: 'card', headerShown: false }} />
        </Stack>
      </ErrorBoundary>
    </SafeAreaProvider>
  )
}
