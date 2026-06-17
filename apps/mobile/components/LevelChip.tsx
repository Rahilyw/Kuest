import { View, Text, StyleSheet } from 'react-native'
import { COLORS, RADIUS, SPACING } from '@/lib/constants'

interface LevelChipProps {
  level: number
  compact?: boolean
}

export function LevelChip({ level, compact = false }: LevelChipProps) {
  return (
    <View style={[styles.chip, compact && styles.compact]}>
      <Text style={[styles.text, compact && styles.textCompact]}>Lv {level}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  compact: {
    paddingHorizontal: SPACING.xs + 2,
    paddingVertical: 2,
  },
  text: { color: COLORS.textPrimary, fontWeight: '700', fontSize: 12 },
  textCompact: { fontSize: 10 },
})
