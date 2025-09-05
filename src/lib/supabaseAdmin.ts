import 'server-only'
import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client using the service role key (DO NOT expose to client)
// Prefer SUPABASE_URL; fallback to NEXT_PUBLIC_SUPABASE_URL only if necessary (non-secret)
const supabaseUrl = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) as string
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

if (!supabaseUrl) throw new Error('Missing SUPABASE_URL')
if (!supabaseServiceRoleKey) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)

