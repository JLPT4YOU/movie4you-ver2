'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import HCaptcha from '@hcaptcha/react-hcaptcha';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, hasAccess, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | undefined>(undefined);
  const captchaRef = useRef<HCaptcha | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (hasAccess && !loading) {
      router.push('/home');
    }
  }, [hasAccess, loading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const result = await signIn(email, password, captchaToken);
      
      if (result.success) {
        router.push('/home');
      } else {
        setError(result.error || 'Đăng nhập thất bại');
      }
    } catch {
      setError('Đã xảy ra lỗi khi đăng nhập');
    } finally {
      setIsLoading(false);
      try {
        captchaRef.current?.resetCaptcha();
        setCaptchaToken(undefined);
      } catch {
        
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg.webp"
          alt="Background"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Multi-layer gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6 md:p-8">
          <Link href="/" className="inline-block">
            <Image
              src="/logo.png"
              alt="MOVIE4YOU"
              width={240}
              height={56}
              className="h-auto w-32 md:w-40 lg:w-48"
              priority
            />
          </Link>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* Login Card */}
            <div className="bg-black/75 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/10">
              {/* Welcome Text */}
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Chào mừng trở lại
                </h1>
                <p className="text-gray-300 text-lg">
                  Đăng nhập để tiếp tục xem phim
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                    Email hoặc số điện thoại
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/60 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent transition-all"
                    placeholder="name@example.com"
                    required
                  />
                </div>


                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 bg-gray-800/60 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent transition-all"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.05 8.05M21.95 21.95l-2.122-2.122m0 0L8.05 8.05M21.95 21.95L21.07 21.07" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-netflix-red bg-transparent border-gray-600 rounded focus:ring-netflix-red focus:ring-2"
                    />
                    <span className="text-sm text-gray-300">Ghi nhớ tôi</span>
                  </label>
                  <Link
                    href="#"
                    className="text-sm text-netflix-red hover:text-red-400 transition-colors"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>

                {/* hCaptcha (moved below Remember/Forgot and above Login button) */}
                <div>
                  <HCaptcha
                    ref={captchaRef}
                    sitekey="185a143a-edae-4240-8ba4-7dbeb87234b6"
                    onVerify={(token) => setCaptchaToken(token)}
                    onExpire={() => setCaptchaToken(undefined)}
                    theme="dark"
                  />
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading || !captchaToken}
                  className="w-full bg-gradient-to-r from-netflix-red to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Đang đăng nhập...</span>
                    </div>
                  ) : (
                    'Đăng nhập'
                  )}
                </button>
              </form>

              {/* Sign Up Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-400">
                  Chưa có tài khoản?{' '}
                  <Link href="#" className="text-netflix-red hover:text-red-400 font-medium transition-colors">
                    Đăng ký ngay
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="p-6 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 MOVIE4YOU. Tất cả quyền được bảo lưu.
          </p>
        </footer>
      </div>
    </div>
  );
}
