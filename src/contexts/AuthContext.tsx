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
  // Disclaimer gate - user must accept after each login
  disclaimerAccepted: boolean;
  acceptDisclaimer: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState<boolean>(true); // hidden when not auth

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

  // Terms acceptance helpers (persistent via Supabase)
  const checkTermsAcceptance = async (uid: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('terms_acceptance')
        .select('accepted_at')
        .eq('user_id', uid)
        .single();
      
      if (error) {
        console.log('No terms acceptance found:', error.message);
        return false;
      }
      
      return !!data?.accepted_at;
    } catch (error) {
      console.error('Error checking terms acceptance:', error);
      return false;
    }
  };
  
  const saveTermsAcceptance = async (uid: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('terms_acceptance')
        .upsert({
          user_id: uid,
          accepted_at: new Date().toISOString(),
          terms_version: 'v1.0',
          ip_address: null, // Could be added if needed
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null
        }, {
          onConflict: 'user_id'
        });
      
      if (error) {
        console.error('Error saving terms acceptance:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error saving terms acceptance:', error);
      return false;
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
      setDisclaimerAccepted(true);
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
            // Check terms acceptance from database on session restore
            const hasAccepted = await checkTermsAcceptance(profile.id);
            setDisclaimerAccepted(hasAccepted);
          } else {
            setUser(null);
            setSupabaseUser(null);
            setDisclaimerAccepted(true);
          }
        } else {
          
          setDisclaimerAccepted(true);
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
            // Check if user has already accepted terms in database
            const hasAccepted = await checkTermsAcceptance(profile.id);
            setDisclaimerAccepted(hasAccepted);
          } else {
            setUser(null);
            setSupabaseUser(null);
            setDisclaimerAccepted(true);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setSupabaseUser(null);
          setDisclaimerAccepted(true);
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

  const acceptDisclaimer = async () => {
    const uid = supabaseUser?.id || user?.id;
    if (uid) {
      const success = await saveTermsAcceptance(uid);
      if (success) {
        setDisclaimerAccepted(true);
      } else {
        console.error('Failed to save terms acceptance to database');
        // Still allow access but log the error
        setDisclaimerAccepted(true);
      }
    }
  };

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
        disclaimerAccepted,
        acceptDisclaimer,
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
