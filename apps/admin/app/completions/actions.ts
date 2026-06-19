'use server'

import { supabaseAdmin } from '@/lib/supabase'

export interface Completion {
  id: string
  photo_url: string
  lat: number
  lng: number
  completed_at: string
  status: string
  user_id: string
  quest_id: string
  profiles: { username: string } | null
  quests: { title: string; xp_reward: number } | null
}

export async function getPendingCompletions(): Promise<Completion[]> {
  const { data } = await supabaseAdmin
    .from('completions')
    .select('*, profiles(username), quests(title, xp_reward)')
    .eq('status', 'pending')
    .order('completed_at', { ascending: true })

  return (data as Completion[]) ?? []
}

export async function updateCompletionStatus(id: string, status: 'approved' | 'rejected') {
  const { error } = await supabaseAdmin
    .from('completions')
    .update({ status, reviewed_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw new Error(error.message)
}
