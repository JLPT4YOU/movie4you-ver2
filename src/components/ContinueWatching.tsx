'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { WatchHistoryManager, WatchHistoryItem } from '@/utils/watchHistory';

export default function ContinueWatching() {
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const loadHistory = () => {
      const history = WatchHistoryManager.getWatchedMovies();
      // Show all recent movies (not filtering by progress since we can't track it with iframe)
      setWatchHistory(history.slice(0, 12));
    };

    loadHistory();
    
    // Refresh when window gets focus (when user comes back to tab)
    const handleFocus = () => loadHistory();
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Don't render on server or if no history
  if (!mounted || watchHistory.length === 0) {
    return null;
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-white">Tiếp tục xem</h2>
        <Link 
          href="/lich-su" 
          className="text-sm text-white/80 hover:text-white transition-colors"
        >
          Xem tất cả
        </Link>
      </div>

      <div className="relative">
        <div
          className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {watchHistory.map((item) => (
            <div 
              key={`${item.movieId}-${item.episodeIndex}`} 
              className="flex-none w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 min-w-[160px]"
            >
              <Link href={`/phim/${item.movieSlug}/xem`}>
                <div className="group relative">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-netflix-gray">
                    <Image
                      src={`https://img.ophim.live/uploads/movies/${item.posterUrl}`}
                      alt={item.movieName}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-black/50 rounded-full p-3">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                    
                    {/* Progress bar - always show at bottom since we set progress to 0 */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                      <div className="h-full bg-netflix-red w-1" />
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <h3 className="text-white font-medium text-sm line-clamp-2 group-hover:text-netflix-red transition-colors">
                      {item.movieName}
                    </h3>
                    {item.episodeName !== 'Full' && (
                      <div className="text-xs text-gray-400 mt-1">
                        Tập {item.episodeName}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      {WatchHistoryManager.formatRelativeTime(item.watchedAt)}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
