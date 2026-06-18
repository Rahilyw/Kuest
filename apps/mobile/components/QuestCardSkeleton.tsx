import { useEffect, useRef } from 'react'
import { View, Animated, StyleSheet } from 'react-native'
import { COLORS, RADIUS, SPACING } from '@/lib/constants'

export function QuestCardSkeleton() {
  const opacity = useRef(new Animated.Value(1)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start()
  }, [opacity])

  return (
    <Animated.View style={[styles.card, { opacity }]}>
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
    </Animated.View>
  )
}

const SHINE = '#E2E8F0'

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.md,
    backgroundColor: SHINE,
    marginRight: 14,
  },
  info: { flex: 1, justifyContent: 'space-between' },
  lineShort: {
    height: 10,
    width: '40%',
    backgroundColor: SHINE,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.sm,
  },
  lineLong: {
    height: 14,
    width: '85%',
    backgroundColor: SHINE,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.sm,
  },
  lineMedium: {
    height: 12,
    width: '65%',
    backgroundColor: SHINE,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.sm,
  },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pillSkeleton: { height: 20, width: 60, backgroundColor: SHINE, borderRadius: RADIUS.pill },
  xpSkeleton: { height: 14, width: 40, backgroundColor: SHINE, borderRadius: RADIUS.sm },
})
