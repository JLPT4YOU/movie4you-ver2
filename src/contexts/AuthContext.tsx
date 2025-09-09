'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase, User, UserRole } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  hasAccess: boolean; // Only Premium/Admin have access
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Simple localStorage cache to speed up refresh on /home
  const PROFILE_CACHE_KEY = 'm4y_profile_cache_v1';
  const saveCachedProfile = (profile: User) => {
    try {
      localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(profile));
    } catch (e) {
      
    }
  };
  const loadCachedProfile = (expectedUserId?: string): User | null => {
    try {
      const raw = localStorage.getItem(PROFILE_CACHE_KEY);
      if (!raw) return null;
      const cached = JSON.parse(raw) as User;
      if (expectedUserId && cached?.id !== expectedUserId) return null;
      return cached;
    } catch (e) {
      
      return null;
    }
  };

  const fetchUserProfile = async (authUser: SupabaseUser) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, name, role, is_active, created_at, display_name, avatar_icon')
        .eq('id', authUser.id)
        .single();

      if (error) {
        
        return null;
      }

      return data as User;
    } catch (error) {
      
      return null;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const profile = await fetchUserProfile(data.user);
        if (profile) {
          // Check if user has access (Premium or Admin only)
          if (profile.role === 'Free') {
            await supabase.auth.signOut();
            return { 
              success: false, 
              error: 'Tài khoản Free không được phép truy cập. Vui lòng nâng cấp lên Premium hoặc liên hệ Admin.' 
            };
          }

          if (!profile.is_active) {
            await supabase.auth.signOut();
            return { 
              success: false, 
              error: 'Tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ Admin.' 
            };
          }

          setUser(profile);
          setSupabaseUser(data.user);
          saveCachedProfile(profile);
          return { success: true };
        }
      }

      return { success: false, error: 'Không thể tải thông tin người dùng' };
    } catch (error) {
      
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Đã xảy ra lỗi khi đăng nhập' 
      };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      // Clear local state immediately; onAuthStateChange will also handle this
      setUser(null);
      setSupabaseUser(null);
    } catch (error) {
      
    } finally {
      // Do not toggle loading here; it is controlled by session checks
    }
  };

  useEffect(() => {
    let initialSessionComplete = false;
    const safetyTimer = setTimeout(() => {
      
      setLoading(false);
    }, 5000);

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Set supabaseUser immediately so UI knows we are authenticated
          setSupabaseUser(session.user);

          // Try local cache first for instant UX
          const cached = loadCachedProfile(session.user.id);
          if (cached) {
            setUser(cached);
            setLoading(false);
          }

          const profile = await fetchUserProfile(session.user);
          
          if (profile && profile.is_active && (profile.role === 'Premium' || profile.role === 'Admin')) {
            setUser(profile);
            setSupabaseUser(session.user);
            saveCachedProfile(profile);
          } else {
            setUser(null);
            setSupabaseUser(null);
          }
        } else {
          
        }
      } catch (error) {
        
      } finally {
        initialSessionComplete = true;
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        
        // Skip INITIAL_SESSION and TOKEN_REFRESHED to avoid duplicate processing
        if (event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') {
          return;
        }
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Make supabaseUser available immediately
          setSupabaseUser(session.user);
          // Try cached profile for instant access
          const cached = loadCachedProfile(session.user.id);
          if (cached) {
            setUser(cached);
          }
          const profile = await fetchUserProfile(session.user);
          if (profile && profile.is_active && (profile.role === 'Premium' || profile.role === 'Admin')) {
            setUser(profile);
            setSupabaseUser(session.user);
            saveCachedProfile(profile);
          } else {
            setUser(null);
            setSupabaseUser(null);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setSupabaseUser(null);
        }
        
        // Only set loading=false if initial session is complete
        if (initialSessionComplete) {
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
      clearTimeout(safetyTimer);
    };
  }, []);

  const isAuthenticated = !!supabaseUser && !!user;
  const hasAccess = isAuthenticated && user?.is_active && (user?.role === 'Premium' || user?.role === 'Admin');

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        loading,
        signIn,
        signOut,
        isAuthenticated,
        hasAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
