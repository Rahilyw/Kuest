import { useEffect } from 'react'
import { Stack, useRouter, useSegments } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useAuth } from '@/hooks/useAuth'
import { registerForPushNotifications } from '@/lib/notifications'

export default function RootLayout() {
  const { session, loading } = useAuth()
  const router = useRouter()
  const segments = useSegments()

  useEffect(() => {
    if (!session?.user.id) return
    registerForPushNotifications(session.user.id)
  }, [session?.user.id])

  useEffect(() => {
    if (loading) return

    const inAuthGroup = segments[0] === '(auth)'

    if (!session && !inAuthGroup) {
      router.replace('/(auth)/sign-in')
    } else if (session && inAuthGroup) {
      router.replace('/(tabs)')
    }
  }, [session, loading])

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="quest/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="submit/[questId]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="settings" options={{ presentation: 'card', headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  )
}
