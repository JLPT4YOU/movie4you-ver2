'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export type UserRole = 'Free' | 'Premium' | 'Admin'

export interface UserProfile {
  id: string
  email: string
  name?: string
  role: UserRole
  subscription_expires_at?: string
  created_at: string
  updated_at: string
  is_active: boolean
  avatar_icon?: string
  display_name?: string
  balance: number
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  session: Session | null
  loading: boolean
  isPremium: boolean
  isAdmin: boolean
  isAuthorized: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  refreshUserProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch user profile from users table
  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        return null
      }

      return data as UserProfile
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  const refreshUserProfile = async () => {
    if (user) {
      const profile = await fetchUserProfile(user.id)
      setUserProfile(profile)
    }
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id)
        setUserProfile(profile)
        // Block Free users immediately if they still have a session
        if (profile && profile.role === 'Free') {
          // Free users: sign out silently and stay on current page (avoid flicker)
          await supabase.auth.signOut()
          setUser(null)
          setUserProfile(null)
          setSession(null)
          return
        }
      } else {
        setUserProfile(null)
      }
      
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id)
        setUserProfile(profile)

        // Block Free users on any auth state change as well
        if (profile && profile.role === 'Free') {
          // Free users: sign out silently and stay on current page (avoid flicker)
          await supabase.auth.signOut()
          setUser(null)
          setUserProfile(null)
          setSession(null)
          return
        }
      } else {
        setUserProfile(null)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      if (signInError.message === 'Invalid login credentials') {
        return { error: { ...signInError, message: 'Email hoặc mật khẩu không đúng' } };
      }
      return { error: signInError };
    }

    if (signInData.user) {
      const profile = await fetchUserProfile(signInData.user.id);
      if (profile && profile.role === 'Free') {
        await supabase.auth.signOut(); // Sign out the free user immediately
        return { error: { message: 'FREE_ACCOUNT' } }; // Custom error code
      }
    }

    // Successful login for premium/admin, the onAuthStateChange will handle the rest.
    return { error: null };
  }

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUserProfile(null)
    // Redirect to login page after logout
    window.location.href = '/login'
  }

  // Check if user is premium
  const isPremium = userProfile?.role === 'Premium' && 
    userProfile?.is_active && 
    (!userProfile?.subscription_expires_at || new Date(userProfile.subscription_expires_at) > new Date())

  // Check if user is admin
  const isAdmin = userProfile?.role === 'Admin' && userProfile?.is_active

  // Check if user is authorized (admin or premium)
  const isAuthorized = (isPremium || isAdmin) && userProfile?.is_active

  const value = {
    user,
    userProfile,
    session,
    loading,
    isPremium,
    isAdmin,
    isAuthorized,
    signIn,
    signUp,
    signOut,
    refreshUserProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
