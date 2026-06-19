import { createClient } from '@supabase/supabase-js'
export { withSupabase } from '@supabase/server'

const url = process.env.SUPABASE_URL!

// Bypasses RLS — server-side only, never import in client components
export const supabaseAdmin = createClient(url, process.env.SUPABASE_SECRET_KEY!)

// Respects RLS — safe for server components that act on behalf of a user
export const supabase = createClient(url, process.env.SUPABASE_PUBLISHABLE_KEY!)
