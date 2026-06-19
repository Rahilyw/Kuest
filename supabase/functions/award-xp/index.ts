import { withSupabase } from 'npm:@supabase/server'

async function checkAndAwardBadges(userId: string, supabaseAdmin: any) {
  const [{ data: profile }, { data: earnedRows }, { data: allBadges }] = await Promise.all([
    supabaseAdmin.from('profiles').select('total_xp').eq('id', userId).single(),
    supabaseAdmin.from('user_badges').select('badge_id').eq('user_id', userId),
    supabaseAdmin.from('badges').select('id, name'),
  ])

  if (!profile || !allBadges) return

  const earnedIds = new Set((earnedRows ?? []).map((r: any) => r.badge_id))
  const unearnedBadges = allBadges.filter((b: any) => !earnedIds.has(b.id))
  if (!unearnedBadges.length) return

  const { data: completions } = await supabaseAdmin
    .from('completions')
    .select('quest:quests(category)')
    .eq('user_id', userId)
    .eq('status', 'approved')

  const totalCompletions = completions?.length ?? 0

  const categoryCounts: Record<string, number> = {}
  for (const c of completions ?? []) {
    const cat = c.quest?.category
    if (cat) categoryCounts[cat] = (categoryCounts[cat] ?? 0) + 1
  }

  const totalXp: number = profile.total_xp

  const conditionMet = (name: string): boolean => {
    switch (name) {
      case 'First Quest':     return totalCompletions >= 1
      case 'Explorer':        return totalCompletions >= 5
      case 'Adventurer':      return totalCompletions >= 10
      case 'Quest Master':    return totalCompletions >= 25
      case 'Legend':          return totalCompletions >= 50
      case 'Century':         return totalCompletions >= 100
      case 'XP Rookie':       return totalXp >= 100
      case 'XP Hunter':       return totalXp >= 500
      case 'XP Warrior':      return totalXp >= 1000
      case 'XP Elite':        return totalXp >= 5000
      case 'Outdoor Champ':   return (categoryCounts['outdoor'] ?? 0) >= 5
      case 'Foodie':          return (categoryCounts['food'] ?? 0) >= 5
      case 'Culture Vulture': return (categoryCounts['culture'] ?? 0) >= 5
      default:                return false
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

    return Response.json({ ok: true })
  }),
}
