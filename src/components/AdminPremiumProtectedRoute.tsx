'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface AdminPremiumProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export default function AdminPremiumProtectedRoute({ 
  children, 
  redirectTo = '/login'
}: AdminPremiumProtectedRouteProps) {
  const { user, userProfile, isAuthorized, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in - redirect to login without adding history entry
        router.replace(redirectTo)
      } else if (!isAuthorized) {
        // Not authorized - redirect to login (free users are blocked in AuthContext)
        router.replace('/login')
      }
    }
  }, [user, userProfile, isAuthorized, loading, router, redirectTo])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-netflix-black">
        <div className="text-white text-xl">Đang tải...</div>
      </div>
    )
  }

  if (!user || !isAuthorized) {
    return null // Will redirect
  }

  return <>{children}</>
}
