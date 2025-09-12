import { createClient } from '@supabase/supabase-js';

// Prefer environment variables in production; keep local fallback for dev
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://prrizpzrdepnjjkyrimh.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBycml6cHpyZGVwbmpqa3lyaW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMTU1MjIsImV4cCI6MjA2ODg5MTUyMn0.fuV8_STGu2AE0gyFWwgT68nyn4Il7Fb112bBAX741aU';

// Ensure a single client instance and enable persistent sessions with auto refresh
const globalForSupabase = globalThis as unknown as { __m4y_supabase?: ReturnType<typeof createClient> };

export const supabase =
  globalForSupabase.__m4y_supabase ??
  createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      storageKey: 'm4y_auth',
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForSupabase.__m4y_supabase = supabase;
}

export type UserRole = 'Free' | 'Premium' | 'Admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  display_name?: string;
  avatar_icon?: string;
}
