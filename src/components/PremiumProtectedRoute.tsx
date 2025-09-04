'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface PremiumProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export default function PremiumProtectedRoute({ 
  children, 
  redirectTo = '/login'
}: PremiumProtectedRouteProps) {
  const { user, userProfile, isPremium, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in - redirect to login
        router.push(redirectTo)
      } else if (!isPremium) {
        // Not premium - redirect to login (free users are blocked in AuthContext)
        router.push('/login')
      }
    }
  }, [user, userProfile, isPremium, loading, router, redirectTo])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-netflix-black">
        <div className="text-white text-xl">Đang tải...</div>
      </div>
    )
  }

  if (!user || !isPremium) {
    return null // Will redirect
  }

  return <>{children}</>
}
