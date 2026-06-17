import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { COLORS, RADIUS, SPACING } from '@/lib/constants'

interface CategoryChipProps {
  label: string
  active: boolean
  onPress: () => void
  count?: number
}

export function CategoryChip({ label, active, onPress, count }: CategoryChipProps) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.label, active && styles.labelActive]}>
        {label}
        {count !== undefined ? ` ${count}` : ''}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
  },
  chipActive: { backgroundColor: COLORS.accent },
  label: { color: COLORS.textMuted, fontWeight: '600', fontSize: 13 },
  labelActive: { color: COLORS.textPrimary },
})
