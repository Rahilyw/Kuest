import { View, Text, StyleSheet } from 'react-native'
import { COLORS, RADIUS, SPACING } from '@/lib/constants'

interface Props {
  level: number
  compact?: boolean
}

export function LevelChip({ level, compact = false }: Props) {
  return (
    <View style={[styles.chip, compact && styles.compact]}>
      <Text style={[styles.text, compact && styles.textCompact]}>
        Lv {level}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs,
    // Glass highlight on top edge
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  compact: {
    paddingHorizontal: SPACING.xs + 2,
    paddingVertical: 2,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.3,
  },
  textCompact: { fontSize: 10 },
})
