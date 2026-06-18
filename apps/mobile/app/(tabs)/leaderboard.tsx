import { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Avatar } from '@/components/Avatar'
import { EmptyState } from '@/components/EmptyState'
import { COLORS, SPACING, RADIUS } from '@/lib/constants'
import type { LeaderboardEntry } from '@/lib/types'

function medalForRank(rank: number): string | null {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return null
}

export default function Leaderboard() {
  const insets = useSafeAreaInsets()
  const { profile } = useAuth()
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('leaderboard')
      .select('*')
      .order('weekly_xp', { ascending: false })
      .limit(50)
      .then(({ data }) => {
        setEntries((data ?? []).map((e, i) => ({ ...e, rank: i + 1 })))
        setLoading(false)
      })
  }, [])

  const myEntry = entries.find((e) => e.user_id === profile?.id)

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>Leaderboard</Text>
        <Text style={styles.subtitle}>Season 1 · Resets Monday</Text>
      </View>

      {myEntry && (
        <View style={styles.myRank}>
          <View style={styles.myRankLeft}>
            <Avatar
              username={myEntry.username}
              uri={myEntry.avatar_url}
              size={40}
            />
            <View style={styles.myRankInfo}>
              <Text style={styles.myRankName} numberOfLines={1}>@{myEntry.username}</Text>
              <Text style={styles.myRankXp}>{myEntry.weekly_xp} XP this week</Text>
            </View>
          </View>
          <View style={styles.myRankBadge}>
            <Text style={styles.myRankBadgeText}>#{myEntry.rank}</Text>
            <Text style={styles.myRankDelta}>↑</Text>
          </View>
        </View>
      )}

      {loading ? (
        <Text style={styles.loading}>Loading…</Text>
      ) : entries.length === 0 ? (
        <EmptyState
          icon="🏆"
          title="No rankings yet"
          subtitle="Complete quests this week to appear on the leaderboard."
        />
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.user_id}
          renderItem={({ item, index }) => {
            const medal = medalForRank(item.rank)
            const isEven = index % 2 === 1
            return (
              <View
                style={[
                  styles.row,
                  item.user_id === profile?.id && styles.rowHighlight,
                  isEven && styles.rowAlt,
                ]}
              >
                <View style={styles.rankCell}>
                  {medal ? (
                    <Text style={styles.medal}>{medal}</Text>
                  ) : (
                    <Text style={styles.rank}>#{item.rank}</Text>
                  )}
                </View>
                <Avatar
                  username={item.username}
                  uri={item.avatar_url}
                  size={32}
                />
                <Text style={styles.username} numberOfLines={1}>
                  {item.username}
                </Text>
                <Text style={styles.xp}>{item.weekly_xp} XP</Text>
              </View>
            )
          }}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: SPACING.xl, paddingBottom: SPACING.lg },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.textPrimary },
  subtitle: { color: COLORS.textMuted, marginTop: 4 },
  myRank: {
    backgroundColor: COLORS.accentSoft,
    marginHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  myRankLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  myRankInfo: { marginLeft: SPACING.md, flex: 1 },
  myRankName: { color: COLORS.accentText, fontWeight: '700', fontSize: 14 },
  myRankXp: { color: COLORS.accent, fontWeight: '600', fontSize: 12, marginTop: 2 },
  myRankBadge: { alignItems: 'center' },
  myRankBadgeText: { color: COLORS.accentText, fontWeight: '800', fontSize: 18 },
  myRankDelta: { color: COLORS.success, fontSize: 12, fontWeight: '700' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.md,
  },
  rowAlt: { backgroundColor: COLORS.surface },
  rowHighlight: { backgroundColor: COLORS.accentSoft },
  rankCell: { width: 36, alignItems: 'center' },
  medal: { fontSize: 20 },
  rank: { color: COLORS.textMuted, fontWeight: '700', fontSize: 14 },
  username: { flex: 1, color: COLORS.textPrimary, fontWeight: '600' },
  xp: { color: COLORS.accent, fontWeight: '700' },
  loading: { color: COLORS.textMuted, textAlign: 'center', marginTop: 40 },
})
