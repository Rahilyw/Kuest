import { withSupabase } from 'npm:@supabase/server'

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export default {
  fetch: withSupabase({ auth: 'secret' }, async (req, ctx) => {
    const { completion_id, action } = await req.json()

    const { data: completion } = await ctx.supabaseAdmin
      .from('completions')
      .select('*')
      .eq('id', completion_id)
      .single()

    if (!completion) {
      return Response.json({ error: 'Completion not found' }, { status: 404 })
    }

    if (action === 'generate') {
      if (completion.redemption_code) {
        return Response.json({ code: completion.redemption_code })
      }
      const code = generateCode()
      await ctx.supabaseAdmin
        .from('completions')
        .update({ redemption_code: code })
        .eq('id', completion_id)
      return Response.json({ code })
    }

    if (action === 'redeem') {
      if (!completion.redemption_code) {
        return Response.json({ error: 'No code to redeem' }, { status: 400 })
      }
      await ctx.supabaseAdmin
        .from('completions')
        .update({ redemption_code: null })
        .eq('id', completion_id)
      return Response.json({ ok: true, message: 'Redeemed!' })
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 })
  }),
}
