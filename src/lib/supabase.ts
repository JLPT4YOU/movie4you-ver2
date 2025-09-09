import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://prrizpzrdepnjjkyrimh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBycml6cHpyZGVwbmpqa3lyaW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMTU1MjIsImV4cCI6MjA2ODg5MTUyMn0.fuV8_STGu2AE0gyFWwgT68nyn4Il7Fb112bBAX741aU';

export const supabase = createClient(supabaseUrl, supabaseKey);

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
