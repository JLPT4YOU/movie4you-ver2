'use client'

interface PremiumUpgradeProps {
  onClose?: () => void
}

export default function PremiumUpgrade({ onClose }: PremiumUpgradeProps) {
  return (
    <div className="min-h-screen bg-netflix-black flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-black/75 backdrop-blur-sm rounded-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Nâng cấp Premium</h1>
          <p className="text-gray-400">
            Bạn cần tài khoản Premium để truy cập tính năng này
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-left">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-gray-300">Xem phim không giới hạn</span>
          </div>
          
          <div className="flex items-center gap-3 text-left">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-gray-300">Chất lượng HD/4K</span>
          </div>
          
          <div className="flex items-center gap-3 text-left">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-gray-300">Không có quảng cáo</span>
          </div>
          
          <div className="flex items-center gap-3 text-left">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-gray-300">Tải xuống offline</span>
          </div>
        </div>

        <div className="space-y-3">
          <button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-3 px-6 rounded-md transition-all duration-200 transform hover:scale-105">
            Nâng cấp Premium
          </button>
          
          {onClose && (
            <button 
              onClick={onClose}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200"
            >
              Quay lại
            </button>
          )}
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Liên hệ admin để nâng cấp tài khoản Premium
        </p>
      </div>
    </div>
  )
}
