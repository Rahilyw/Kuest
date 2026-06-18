import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useQuest } from '@/hooks/useQuests'
import { CATEGORY_COLORS, CATEGORY_ICONS, CATEGORY_SOFT } from '@/lib/constants'

export default function QuestDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { quest, loading } = useQuest(id)

  if (loading || !quest) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Loading…</Text>
      </View>
    )
  }

  const categoryColor = CATEGORY_COLORS[quest.category]
  const softBg = CATEGORY_SOFT[quest.category] ?? '#EEF2FF'
  const categoryIcon = CATEGORY_ICONS[quest.category]

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero: category-tinted, keeps identity without a dark overlay */}
        <View style={[styles.hero, { backgroundColor: softBg }]}>
          <TouchableOpacity style={styles.back} onPress={() => router.back()}>
            <View style={styles.backPill}>
              <Text style={[styles.backText, { color: categoryColor }]}>←</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.heroIcon}>{categoryIcon}</Text>
          {quest.is_sponsored && (
            <View style={[styles.sponsoredBadge, { borderColor: `${categoryColor}40` }]}>
              <Text style={[styles.sponsoredText, { color: categoryColor }]}>
                ⭐ Sponsored by {quest.sponsor_name}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          {/* XP badge */}
          <View style={[styles.xpBadge, { backgroundColor: softBg }]}>
            <Text style={[styles.xpText, { color: categoryColor }]}>+{quest.xp_reward} XP</Text>
          </View>

          <Text style={styles.title}>{quest.title}</Text>
          <Text style={styles.description}>{quest.description}</Text>

          {quest.sponsor_reward && (
            <View style={styles.rewardBox}>
              <Text style={styles.rewardLabel}>Your reward</Text>
              <Text style={[styles.rewardValue, { color: categoryColor }]}>{quest.sponsor_reward}</Text>
            </View>
          )}

          <View style={styles.rules}>
            <Text style={styles.rulesTitle}>How to complete</Text>
            <Text style={styles.rulesText}>1. Go to the quest location</Text>
            <Text style={styles.rulesText}>2. Tap "Start Quest" when you arrive</Text>
            <Text style={styles.rulesText}>3. Take a photo as proof</Text>
            <Text style={styles.rulesText}>4. Submit, we'll review within 2 hours</Text>
          </View>
        </View>
      </ScrollView>

      {/* Floating CTA footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.ctaButton, { backgroundColor: categoryColor }]}
          onPress={() => router.push(`/submit/${quest.id}`)}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaText}>Start Quest</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F9FF' },
  loading: { color: '#94A3B8', textAlign: 'center', marginTop: 100 },
  hero: { height: 220, alignItems: 'center', justifyContent: 'center' },
  back: { position: 'absolute', top: 52, left: 16 },
  backPill: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 999,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  backText: { fontSize: 20, fontWeight: '700', lineHeight: 28 },
  heroIcon: { fontSize: 68 },
  sponsoredBadge: {
    position: 'absolute',
    bottom: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
  },
  sponsoredText: { fontSize: 12, fontWeight: '700' },
  content: { padding: 20 },
  xpBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginBottom: 14,
  },
  xpText: { fontWeight: '800', fontSize: 14 },
  title: { fontSize: 26, fontWeight: '800', color: '#0F172A', marginBottom: 12, lineHeight: 32 },
  description: { color: '#475569', fontSize: 16, lineHeight: 25, marginBottom: 24 },
  rewardBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.06)',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  rewardLabel: { color: '#94A3B8', fontSize: 11, fontWeight: '700', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  rewardValue: { fontSize: 18, fontWeight: '800' },
  rules: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.06)',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  rulesTitle: { color: '#0F172A', fontWeight: '800', marginBottom: 12, fontSize: 15 },
  rulesText: { color: '#475569', marginBottom: 10, lineHeight: 22 },
  footer: {
    padding: 16,
    paddingBottom: 36,
    backgroundColor: 'rgba(240,249,255,0.96)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(15,23,42,0.06)',
  },
  ctaButton: {
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  ctaText: { color: '#FFFFFF', fontWeight: '800', fontSize: 18 },
})
