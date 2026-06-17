import { View, Text, StyleSheet } from 'react-native'
import { COLORS, RADIUS, SPACING } from '@/lib/constants'
import type { UserBadge } from '@/lib/types'

interface Props {
  badges: UserBadge[]
}

export function BadgeGrid({ badges }: Props) {
  if (badges.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>🏅</Text>
        <Text style={styles.emptyTitle}>No badges yet</Text>
        <Text style={styles.emptySubtitle}>Complete quests to earn your first badge</Text>
      </View>
    )
  }

  return (
    <View style={styles.grid}>
      {badges.map((ub) => (
        <View key={ub.badge_id} style={styles.badge}>
          <Text style={styles.badgeIcon}>{ub.badge?.icon ?? '🏅'}</Text>
          <Text style={styles.badgeName} numberOfLines={2}>{ub.badge?.name}</Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: SPACING.lg },
  badge: {
    width: '30%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    margin: '1.5%',
  },
  badgeIcon: { fontSize: 28, marginBottom: SPACING.xs },
  badgeName: { color: COLORS.textSecondary, fontSize: 11, textAlign: 'center' },
  empty: { alignItems: 'center', paddingHorizontal: SPACING.xl, paddingVertical: SPACING.xxl * 2 },
  emptyIcon: { fontSize: 36, marginBottom: SPACING.md },
  emptyTitle: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '700', marginBottom: SPACING.sm },
  emptySubtitle: { color: COLORS.textMuted, fontSize: 13, textAlign: 'center', lineHeight: 20 },
})
