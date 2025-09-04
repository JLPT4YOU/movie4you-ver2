'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

// This component bypasses the main layout to avoid showing header/footer
export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Spacer to push 404 down */}
        <div className="mb-16"></div>
        
        {/* Animated 404 Text */}
        <div className="mb-12">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400 animate-pulse">
            404
          </h1>
        </div>

        {/* Error Message */}
        <h2 className="text-3xl font-bold text-white mb-4">
          Oops! Trang không tìm thấy
        </h2>
        
        <p className="text-gray-400 mb-8 text-lg">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all transform hover:scale-105"
          >
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
              />
            </svg>
            Về trang chủ
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all transform hover:scale-105"
          >
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            Quay lại
          </button>
        </div>

        {/* Suggestion Section */}
        {mounted && (
          <div className="mt-12 p-6 bg-gray-800/30 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-3">
              Có thể bạn muốn xem:
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Link 
                href="/category/phim-hanh-dong" 
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                Phim Hành Động
              </Link>
              <span className="text-gray-600">•</span>
              <Link 
                href="/category/phim-hai-huoc" 
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                Phim Hài Hước
              </Link>
              <span className="text-gray-600">•</span>
              <Link 
                href="/category/phim-tinh-cam" 
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                Phim Tình Cảm
              </Link>
              <span className="text-gray-600">•</span>
              <Link 
                href="/category/phim-kiem-hiep" 
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                Phim Kiếm Hiệp
              </Link>
            </div>
          </div>
        )}

        {/* Fun Animation */}
        <div className="mt-8 text-gray-500 text-sm">
          <p>🎬 Đừng lo, còn rất nhiều phim hay đang chờ bạn khám phá!</p>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-600 rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-600 rounded-full opacity-5 blur-3xl"></div>
      </div>
    </div>
  );
}
