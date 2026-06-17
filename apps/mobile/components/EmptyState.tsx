import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { COLORS, RADIUS, SPACING } from '@/lib/constants'

interface EmptyStateProps {
  icon: string
  title: string
  subtitle?: string
  ctaLabel?: string
  onCtaPress?: () => void
}

export function EmptyState({ icon, title, subtitle, ctaLabel, onCtaPress }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle !== undefined && <Text style={styles.subtitle}>{subtitle}</Text>}
      {ctaLabel !== undefined && onCtaPress !== undefined && (
        <TouchableOpacity style={styles.cta} onPress={onCtaPress} activeOpacity={0.8}>
          <Text style={styles.ctaText}>{ctaLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl * 2,
    paddingHorizontal: SPACING.xl,
  },
  icon: { fontSize: 40, marginBottom: SPACING.md },
  title: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  cta: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  ctaText: { color: COLORS.textPrimary, fontWeight: '700', fontSize: 14 },
})
