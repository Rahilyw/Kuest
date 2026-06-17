import { View, Text, StyleSheet } from 'react-native'
import { getLevelFromXp, getXpToNextLevel, XP_LEVELS, COLORS, SPACING, RADIUS } from '@/lib/constants'

interface Props {
  totalXp: number
}

export function XPBar({ totalXp }: Props) {
  const level = getLevelFromXp(totalXp)
  const xpToNext = getXpToNextLevel(totalXp)
  const isMaxLevel = xpToNext === 0
  const currentLevelXp = XP_LEVELS.find((l) => l.level === level)?.minXp ?? 0
  const nextLevelXp = XP_LEVELS.find((l) => l.level === level + 1)?.minXp ?? currentLevelXp + 1
  const progress = isMaxLevel
    ? 1
    : (totalXp - currentLevelXp) / (nextLevelXp - currentLevelXp)

  const xpLabel = isMaxLevel
    ? 'Max level'
    : `${totalXp.toLocaleString()} / ${nextLevelXp.toLocaleString()} XP`

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.level}>Level {level}</Text>
        <Text style={styles.xpLabel}>{xpLabel}</Text>
      </View>
      {/* Track with two stacked Views for gradient-feel */}
      <View style={styles.trackWrapper}>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${Math.min(progress * 100, 100)}%` }]}>
            <View style={styles.fillGlow} />
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { marginHorizontal: SPACING.lg, marginBottom: SPACING.xxl },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  level: { color: COLORS.textPrimary, fontWeight: '700', fontSize: 14 },
  xpLabel: { color: COLORS.textMuted, fontSize: 12 },
  trackWrapper: {
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 2,
  },
  track: {
    height: 10,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.pill,
    overflow: 'hidden',
  },
  fillGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: COLORS.accentText,
    opacity: 0.3,
    borderRadius: RADIUS.pill,
  },
})
