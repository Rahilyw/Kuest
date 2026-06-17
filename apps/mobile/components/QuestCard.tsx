import { TouchableOpacity, Text, View, StyleSheet } from 'react-native'
import { CATEGORY_COLORS, CATEGORY_ICONS, COLORS, RADIUS, SPACING } from '@/lib/constants'
import type { Quest } from '@/lib/types'

interface Props {
  quest: Quest
  onPress: () => void
}

export function QuestCard({ quest, onPress }: Props) {
  const color = CATEGORY_COLORS[quest.category]
  const icon = CATEGORY_ICONS[quest.category]

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Left color accent stripe */}
      <View style={[styles.accentStripe, { backgroundColor: color }]} />

      <View style={[styles.iconBox, { backgroundColor: `${color}22` }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      <View style={styles.info}>
        {quest.is_sponsored && (
          <View style={styles.sponsorPill}>
            <Text style={styles.sponsored}>⭐ {quest.sponsor_name}</Text>
          </View>
        )}
        <Text style={styles.title} numberOfLines={1}>{quest.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{quest.description}</Text>
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <View style={[styles.categoryPill, { backgroundColor: `${color}22` }]}>
              <Text style={[styles.categoryText, { color }]}>{quest.category}</Text>
            </View>
            <View style={styles.distancePill}>
              <Text style={styles.distanceText}>{quest.radius_meters}m</Text>
            </View>
          </View>
          <Text style={styles.xp}>+{quest.xp_reward} XP</Text>
        </View>
      </View>
    </TouchableOpacity>
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
    overflow: 'hidden',
  },
  accentStripe: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: RADIUS.lg,
    borderBottomLeftRadius: RADIUS.lg,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    marginLeft: 8,
  },
  icon: { fontSize: 24 },
  info: { flex: 1 },
  sponsorPill: {
    alignSelf: 'flex-start',
    backgroundColor: `${COLORS.sponsor}22`,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    marginBottom: 4,
  },
  sponsored: { color: COLORS.sponsor, fontSize: 11, fontWeight: '700' },
  title: { color: COLORS.textPrimary, fontWeight: '700', fontSize: 15, marginBottom: 4 },
  description: { color: COLORS.textMuted, fontSize: 13, lineHeight: 18, marginBottom: 10 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  categoryPill: { borderRadius: RADIUS.pill, paddingHorizontal: 10, paddingVertical: 3 },
  categoryText: { fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
  distancePill: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
  },
  distanceText: { color: COLORS.textMuted, fontSize: 11, fontWeight: '600' },
  xp: { color: COLORS.accent, fontWeight: '800', fontSize: 13 },
})
