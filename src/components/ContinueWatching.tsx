'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { WatchHistoryManager, WatchHistoryItem } from '@/utils/watchHistory';
import { watchProgressService, WatchProgress } from '@/services/watchProgressService';
import { useAuth } from '@/contexts/AuthContext';

export default function ContinueWatching() {
  const { user } = useAuth();
  const [watchHistory, setWatchHistory] = useState<(WatchHistoryItem | WatchProgress)[]>([]);
  const [mounted, setMounted] = useState(false);

  const getProgressPercent = (item: WatchHistoryItem | WatchProgress) => {
    const duration = Math.max(1, Math.floor('duration' in item ? item.duration : item.duration_seconds || 0));
    const current = Math.max(0, Math.floor('currentTime' in item ? item.currentTime : item.progress_seconds || 0));
    const percent = Math.min(100, Math.max(0, Math.round((current / duration) * 100)));
    return percent;
  };

  useEffect(() => {
    setMounted(true);
    
    const loadHistory = async () => {
      let history: (WatchHistoryItem | WatchProgress)[] = [];
      
      // Load from Supabase if user is authenticated
      if (user) {
        const supabaseHistory = await watchProgressService.getWatchedMovies();
        history = supabaseHistory.slice(0, 12);
      }
      
      // Fallback to localStorage if no Supabase data or not authenticated
      if (history.length === 0) {
        const localHistory = WatchHistoryManager.getWatchedMovies();
        history = localHistory.slice(0, 12);
      }
      
      setWatchHistory(history);
    };

    loadHistory();
    
    // Refresh when window gets focus (when user comes back to tab)
    const handleFocus = () => loadHistory();
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [user]);

  // Don't render on server or if no history
  if (!mounted || watchHistory.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
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
              key={`${'movieId' in item ? item.movieId : item.movie_id}-${'episodeIndex' in item ? item.episodeIndex : item.episode_index}`} 
              className="flex-none w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 min-w-[160px]"
            >
              <Link href={`/phim/${'movieSlug' in item ? item.movieSlug : item.movie_slug}/xem`}>
                <div className="group relative">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-netflix-gray">
                    <Image
                      src={`https://img.ophim.live/uploads/movies/${'posterUrl' in item ? item.posterUrl : item.poster_url}`}
                      alt={'movieName' in item ? item.movieName : item.movie_name}
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
                    
                    {/* Progress bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/60" aria-hidden>
                      <div
                        className="h-full bg-netflix-red"
                        style={{ width: `${getProgressPercent(item)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <h3 className="text-white font-medium text-sm line-clamp-2 group-hover:text-netflix-red transition-colors">
                      {'movieName' in item ? item.movieName : item.movie_name}
                    </h3>
                    {(('episodeName' in item ? item.episodeName : item.episode_name) !== 'Full') && (
                      <div className="text-xs text-gray-400 mt-1">
                        Tập {'episodeName' in item ? item.episodeName : item.episode_name}
                      </div>
                    )}
                    <div className="text-[11px] text-gray-400 mt-1">
                      Tiếp tục: {WatchHistoryManager.formatTime('currentTime' in item ? item.currentTime : item.progress_seconds)} / {WatchHistoryManager.formatTime('duration' in item ? item.duration : item.duration_seconds)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {WatchHistoryManager.formatRelativeTime('watchedAt' in item ? item.watchedAt : item.watched_at || '')}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}
