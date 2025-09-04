import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client using the service role key (DO NOT expose to client)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)

