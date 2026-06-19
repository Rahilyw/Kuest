import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { XPBar } from '@/components/XPBar'
import { BadgeGrid } from '@/components/BadgeGrid'
import { Avatar } from '@/components/Avatar'
import { LevelChip } from '@/components/LevelChip'
import { SectionHeader } from '@/components/SectionHeader'
import { COLORS, SPACING, RADIUS } from '@/lib/constants'
import type { UserBadge } from '@/lib/types'

export default function Profile() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { profile, signOut } = useAuth()
  const [badges, setBadges] = useState<UserBadge[]>([])
  const [completionCount, setCompletionCount] = useState(0)

  useEffect(() => {
    if (!profile) return

    supabase
      .from('user_badges')
      .select('*, badge:badges(*)')
      .eq('user_id', profile.id)
      .then(({ data }) => setBadges(data ?? []))

    supabase
      .from('completions')
      .select('id', { count: 'exact' })
      .eq('user_id', profile.id)
      .eq('status', 'approved')
      .then(({ count }) => setCompletionCount(count ?? 0))
  }, [profile])

  if (!profile) return null

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header with settings gear */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity style={styles.settingsBtn} activeOpacity={0.8} onPress={() => router.push('/settings')}>
          <Ionicons name="settings-outline" size={22} color={COLORS.textMuted} />
        </TouchableOpacity>

        {/* Avatar with level chip overlay */}
        <View style={styles.avatarContainer}>
          <Avatar username={profile.username} uri={profile.avatar_url} size={88} />
          <View style={styles.levelOverlay}>
            <LevelChip level={profile.level} compact />
          </View>
        </View>

        <Text style={styles.username}>@{profile.username}</Text>
        <Text style={styles.city}>{profile.city}</Text>
      </View>

      {/* Stats card */}
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{completionCount}</Text>
          <Text style={styles.statLabel}>Quests</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{profile.total_xp.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total XP</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>Lv {profile.level}</Text>
          <Text style={styles.statLabel}>Level</Text>
        </View>
      </View>

      <XPBar totalXp={profile.total_xp} />

      <SectionHeader title="Badges" trailing={badges.length > 0 ? `${badges.length}` : undefined} />
      <BadgeGrid badges={badges} />

      <TouchableOpacity style={styles.signOut} onPress={signOut} activeOpacity={0.8}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { paddingBottom: 100 },
  header: {
    alignItems: 'center',
    paddingBottom: SPACING.xxl,
    paddingHorizontal: SPACING.xl,
  },
  settingsBtn: {
    position: 'absolute',
    top: 0,
    right: SPACING.xl,
    padding: SPACING.sm,
  },
  avatarContainer: { marginBottom: SPACING.md, position: 'relative' },
  levelOverlay: {
    position: 'absolute',
    bottom: -4,
    right: -4,
  },
  username: { color: COLORS.textPrimary, fontSize: 20, fontWeight: '700' },
  city: { color: COLORS.textMuted, marginTop: 4 },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.xl,
  },
  stat: { alignItems: 'center', flex: 1 },
  statDivider: { width: 1, height: 36, backgroundColor: COLORS.border },
  statValue: { color: COLORS.accent, fontSize: 22, fontWeight: '800' },
  statLabel: { color: COLORS.textMuted, marginTop: 4, fontSize: 12 },
  signOut: {
    margin: SPACING.xl,
    padding: SPACING.lg,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  signOutText: { color: COLORS.textMuted, fontWeight: '600' },
})
