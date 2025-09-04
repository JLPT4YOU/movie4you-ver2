'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import LoginForm from '@/components/LoginForm'
import Image from 'next/image'

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const { user, loading, isAuthorized } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && isAuthorized) {
      router.replace('/')
    }
  }, [isAuthorized, loading, router])



  // Always render the login UI to avoid flicker; only redirect when authorized

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Netflix-style gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80 z-10" />

      {/* Main Content */}
      <main className="relative z-20 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          <LoginForm 
            isSignUp={isSignUp} 
            onToggleMode={() => setIsSignUp(!isSignUp)} 
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 text-center text-gray-400 text-sm pb-6">
        <p>&copy; 2024 MOVIE4YOU. Tất cả quyền được bảo lưu.</p>
      </footer>
    </div>
  )
}
