import { withSupabase } from 'npm:@supabase/server'

// Badge rules mirror 005_align_badge_unlock_logic.sql exactly.
// Keep both in sync when adding new badges.
async function checkAndAwardBadges(userId: string, supabaseAdmin: any) {
  const [{ data: earnedRows }, { data: allBadges }] = await Promise.all([
    supabaseAdmin.from('user_badges').select('badge_id').eq('user_id', userId),
    supabaseAdmin.from('badges').select('id, name'),
  ])

  if (!allBadges) return

  const earnedIds = new Set((earnedRows ?? []).map((r: any) => r.badge_id))
  const unearnedBadges = allBadges.filter((b: any) => !earnedIds.has(b.id))
  if (!unearnedBadges.length) return

  const { data: completions } = await supabaseAdmin
    .from('completions')
    .select('completed_at, quest:quests(category)')
    .eq('user_id', userId)
    .eq('status', 'approved')

  const rows = completions ?? []
  const totalCompletions = rows.length

  // Per-category counts
  const categoryCounts: Record<string, number> = {}
  for (const c of rows) {
    const cat = c.quest?.category
    if (cat) categoryCounts[cat] = (categoryCounts[cat] ?? 0) + 1
  }

  // Explorer: at least 1 in each of the 5 core categories
  const CORE_CATEGORIES = ['fitness', 'social', 'food', 'community', 'nature']
  const isExplorer = CORE_CATEGORIES.every(cat => (categoryCounts[cat] ?? 0) >= 1)

  // Early Bird: any completion before 8am Victoria time (UTC-8 approximation)
  const isEarlyBird = rows.some(c => {
    if (!c.completed_at) return false
    const d = new Date(c.completed_at)
    const localHour = (d.getUTCHours() - 8 + 24) % 24
    return localHour < 8
  })

  // Weekend Warrior: 3+ completions on Sat/Sun within the same Sat–Sun pair.
  // Normalise Sunday → previous Saturday so both days share one group key.
  const weekendCounts: Record<string, number> = {}
  for (const c of rows) {
    if (!c.completed_at) continue
    const d = new Date(new Date(c.completed_at).getTime() - 8 * 3600 * 1000) // UTC-8
    const dow = d.getUTCDay() // 0=Sun, 6=Sat
    if (dow !== 0 && dow !== 6) continue
    if (dow === 0) d.setUTCDate(d.getUTCDate() - 1) // shift Sun → Sat
    const key = d.toISOString().slice(0, 10)
    weekendCounts[key] = (weekendCounts[key] ?? 0) + 1
  }
  const isWeekendWarrior = Object.values(weekendCounts).some(n => n >= 3)

  // Top 10: check the leaderboard view
  let isTop10 = false
  const { data: top10Rows } = await supabaseAdmin
    .from('leaderboard')
    .select('user_id')
    .order('weekly_xp', { ascending: false })
    .limit(10)
  if (top10Rows) {
    isTop10 = top10Rows.some((row: any) => row.user_id === userId)
  }

  const conditionMet = (name: string): boolean => {
    switch (name) {
      case 'First Quest':        return totalCompletions >= 1
      case 'Getting Warmed Up':  return totalCompletions >= 5
      case 'Local Hero':         return totalCompletions >= 10
      case 'Explorer':           return isExplorer
      case 'Fitness Fanatic':    return (categoryCounts['fitness'] ?? 0) >= 3
      case 'Social Butterfly':   return (categoryCounts['social'] ?? 0) >= 3
      case 'Foodie':             return (categoryCounts['food'] ?? 0) >= 3
      case 'Community Champion': return (categoryCounts['community'] ?? 0) >= 3
      case 'Nature Lover':       return (categoryCounts['nature'] ?? 0) >= 3
      case 'Early Bird':         return isEarlyBird
      case 'Weekend Warrior':    return isWeekendWarrior
      case 'Top 10':             return isTop10
      // Season Veteran: requires seasons table; not yet implemented
      default:                   return false
    }
  }

  const toAward = unearnedBadges
    .filter((b: any) => conditionMet(b.name))
    .map((b: any) => ({ user_id: userId, badge_id: b.id }))

  if (!toAward.length) return

  await supabaseAdmin
    .from('user_badges')
    .upsert(toAward, { onConflict: 'user_id,badge_id', ignoreDuplicates: true })
}

export default {
  fetch: withSupabase({ auth: 'secret' }, async (req, ctx) => {
    const { completion_id } = await req.json()

    const { data: completion } = await ctx.supabaseAdmin
      .from('completions')
      .select('*, quest:quests(xp_reward)')
      .eq('id', completion_id)
      .single()

    if (!completion) {
      return Response.json({ error: 'Completion not found' }, { status: 404 })
    }

    // XP is awarded by the on_completion_approved DB trigger.
    await checkAndAwardBadges(completion.user_id, ctx.supabaseAdmin)

    const { data: profileRow } = await ctx.supabaseAdmin
      .from('profiles')
      .select('push_token, username')
      .eq('id', completion.user_id)
      .single()

    if (profileRow?.push_token) {
      try {
        await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: profileRow.push_token,
            title: 'Quest Approved! 🎉',
            body: `Your submission was approved. +${completion.quest.xp_reward} XP earned!`,
            sound: 'default',
          }),
        })
      } catch (err) {
        console.error('Push notification failed:', err)
      }
    }

    return Response.json({ ok: true })
  }),
}
