import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { COLORS, SPACING } from '@/lib/constants'

interface SectionHeaderProps {
  title: string
  trailing?: string
  style?: ViewStyle
}

export function SectionHeader({ title, trailing, style }: SectionHeaderProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      {trailing !== undefined && <Text style={styles.trailing}>{trailing}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
  },
  title: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '700' },
  trailing: { color: COLORS.textMuted, fontSize: 13, fontWeight: '600' },
})
