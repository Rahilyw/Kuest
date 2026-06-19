'use server'

import { supabaseAdmin } from '@/lib/supabase'

export interface Quest {
  id: string
  title: string
  category: string
  xp_reward: number
  is_sponsored: boolean
  sponsor_name: string | null
  status: string
}

export async function getQuests(): Promise<Quest[]> {
  const { data } = await supabaseAdmin
    .from('quests')
    .select('*')
    .order('created_at', { ascending: false })

  return (data as Quest[]) ?? []
}

export async function createQuest(form: {
  title: string
  description: string
  category: string
  lat: string
  lng: string
  radius_meters: string
  xp_reward: string
  is_sponsored: boolean
  sponsor_name: string
  sponsor_reward: string
}): Promise<Quest | null> {
  const { data, error } = await supabaseAdmin
    .from('quests')
    .insert({
      ...form,
      lat: parseFloat(form.lat),
      lng: parseFloat(form.lng),
      radius_meters: parseInt(form.radius_meters),
      xp_reward: parseInt(form.xp_reward),
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Quest
}

export async function toggleQuestStatus(id: string, current: string): Promise<string> {
  const next = current === 'active' ? 'inactive' : 'active'
  const { error } = await supabaseAdmin.from('quests').update({ status: next }).eq('id', id)
  if (error) throw new Error(error.message)
  return next
}
