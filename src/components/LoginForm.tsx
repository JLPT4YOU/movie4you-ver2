'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface LoginFormProps {
  isSignUp: boolean
  onToggleMode: () => void
}

export default function LoginForm({ isSignUp, onToggleMode }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn, signUp } = useAuth()
  const router = useRouter()
  const isFreeAccountError = error === 'FREE_ACCOUNT'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Tiến hành đăng nhập/đăng ký bình thường. Nếu là tài khoản Free nhưng mật khẩu đúng,
      // signIn sẽ trả về lỗi 'FREE_ACCOUNT'. Nếu sai mật khẩu/email, sẽ trả về thông điệp lỗi tương ứng.
      const { error } = isSignUp
        ? await signUp(email, password)
        : await signIn(email, password)

      if (error) {
        setError(error.message)
      } else {
        // AuthContext sẽ xử lý redirect khi đã được ủy quyền
      }
    } catch (err) {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative w-full max-w-md mx-auto group">
      {/* Glow border */}
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-red-600/40 to-rose-500/40 blur opacity-60 transition group-hover:opacity-90" />

      {/* Card */}
      <div className="relative rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl p-8 shadow-2xl"> 
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {isSignUp ? 'Đăng ký' : 'Đăng nhập'}
          </h1>
          <p className="mt-2 text-sm text-gray-300">Chào mừng bạn đến với MOVIE4YOU</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="relative">
            {/* Icon */}
            <svg className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 7.5v9a2.25 2.25 0 0 1-2.25 2.25h-15A2.25 2.25 0 0 1 2.25 16.5v-9A2.25 2.25 0 0 1 4.5 5.25h15A2.25 2.25 0 0 1 21.75 7.5Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="m3 7 8.16 5.1a2.25 2.25 0 0 0 2.38 0L21.75 7" />
            </svg>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 w-full rounded-xl bg-white/5 pl-12 pr-4 text-white placeholder-gray-400 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-red-500/60 border border-white/10"
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className="relative">
            {/* Icon */}
            <svg className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V7.875a4.5 4.5 0 1 0-9 0V10.5" />
              <rect x="4.5" y="10.5" width="15" height="9" rx="2" />
            </svg>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="h-12 w-full rounded-xl bg-white/5 pl-12 pr-12 text-white placeholder-gray-400 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-red-500/60 border border-white/10"
              autoComplete="current-password"
            />
            <button
              type="button"
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-2 text-gray-300 hover:text-white hover:bg-white/10 transition"
            >
              {showPassword ? (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.58 10.59A3 3 0 0 0 12 15a3 3 0 0 0 2.41-4.86M9.88 5.1A9.77 9.77 0 0 1 12 4.75c6.75 0 9.75 7.25 9.75 7.25a12.66 12.66 0 0 1-3.08 4.1m-2.2 1.63A11.34 11.34 0 0 1 12 19.25C5.25 19.25 2.25 12 2.25 12a12.7 12.7 0 0 1 4.06-5.2" />
                </svg>
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.25C5.25 19.25 2.25 12 2.25 12S5.25 4.75 12 4.75 21.75 12 21.75 12 18.75 19.25 12 19.25Z" />
                  <circle cx="12" cy="12" r="3.25" />
                </svg>
              )}
            </button>
          </div>

          {error && (
            isFreeAccountError ? (
              <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-300">
                Your account is on the Free plan. Please upgrade to{' '}
                <a
                  href="https://jlpt4you.com/premium"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline text-current"
                >
                  Premium
                </a>{' '}to continue.
              </div>
            ) : (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </div>
            )
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold shadow-[0_0_30px_-10px_rgba(244,63,94,0.7)] transition hover:from-red-500 hover:to-rose-500 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang xử lý...' : (isSignUp ? 'Đăng ký' : 'Đăng nhập')}
          </button>
        </form>

        {/* Sign up link */}
        {!isSignUp && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Chưa có tài khoản?{' '}
              <a
                href="https://jlpt4you.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-red-400 hover:text-red-300 transition-colors duration-200 hover:underline"
              >
                Đăng ký
              </a>
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
