import { View, StyleSheet } from 'react-native'
import { COLORS, RADIUS, SPACING } from '@/lib/constants'

export function QuestCardSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.iconBox} />
      <View style={styles.info}>
        <View style={styles.lineShort} />
        <View style={styles.lineLong} />
        <View style={styles.lineMedium} />
        <View style={styles.footer}>
          <View style={styles.pillSkeleton} />
          <View style={styles.xpSkeleton} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceElevated,
    marginRight: 14,
  },
  info: { flex: 1, justifyContent: 'space-between' },
  lineShort: {
    height: 10,
    width: '40%',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.sm,
  },
  lineLong: {
    height: 14,
    width: '85%',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.sm,
  },
  lineMedium: {
    height: 12,
    width: '65%',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.sm,
  },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pillSkeleton: {
    height: 20,
    width: 60,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.pill,
  },
  xpSkeleton: {
    height: 14,
    width: 40,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.sm,
  },
})
