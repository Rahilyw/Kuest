import { View, Text, Image, StyleSheet } from 'react-native'
import { COLORS } from '@/lib/constants'

interface AvatarProps {
  username: string
  uri?: string | null
  size?: number
}

export function Avatar({ username, uri, size = 48 }: AvatarProps) {
  const initial = username.length > 0 ? username[0].toUpperCase() : '?'
  const borderRadius = size / 2

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.image, { width: size, height: size, borderRadius }]}
      />
    )
  }

  return (
    <View
      style={[
        styles.fallback,
        { width: size, height: size, borderRadius },
      ]}
    >
      <Text style={[styles.initial, { fontSize: size * 0.4 }]}>{initial}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  image: { backgroundColor: COLORS.surface },
  fallback: {
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: { color: COLORS.textPrimary, fontWeight: '800' },
})
