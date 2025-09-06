'use client'

import { useAuth } from '@/contexts/AuthContext'
import { usePathname, useRouter } from 'next/navigation'
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
  const pathname = usePathname()
  const isWatchPage = typeof pathname === 'string' && pathname.includes('/xem')

  useEffect(() => {
    // On watch page: allow brief auth fluctuations (loading or profile not yet loaded)
    if (isWatchPage && (loading || !userProfile)) return

    if (!user || !isAuthorized) {
      router.replace(redirectTo)
    }
  }, [user, userProfile, isAuthorized, loading, router, redirectTo, isWatchPage])

  // On the watch page, always render children to prevent playback interruption.
  // If user ends up unauthorized once auth/profile are fully resolved, the effect above will navigate away.
  if (isWatchPage) {
    return <>{children}</>
  }

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
