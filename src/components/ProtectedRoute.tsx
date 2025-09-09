'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { hasAccess, loading, user, isAuthenticated, supabaseUser } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // If we don't have a session at all and we're not loading, redirect
    if (!loading && !hasAccess && !isRedirecting && !supabaseUser) {
      setIsRedirecting(true);
      router.push('/');
    }
  }, [hasAccess, loading, router, isRedirecting, supabaseUser, user]);

  // Show spinner only while determining access (no access yet)
  if ((loading || (supabaseUser && !user)) && !hasAccess) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-netflix-red mx-auto mb-4"></div>
          <p>Đang xác thực...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-white text-center max-w-md px-6">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold mb-4">Không có quyền truy cập</h1>
          <p className="text-gray-300 mb-6">
            {user?.role === 'Free' 
              ? 'Tài khoản Free không được phép truy cập. Vui lòng nâng cấp lên Premium.'
              : 'Vui lòng đăng nhập để tiếp tục.'
            }
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-netflix-red hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Quay lại đăng nhập
          </button>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
