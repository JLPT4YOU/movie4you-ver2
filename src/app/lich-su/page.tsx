'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import { WatchHistoryManager, WatchHistoryItem } from '@/utils/watchHistory';

export default function WatchHistoryPage() {
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = () => {
      const watchedMovies = WatchHistoryManager.getWatchedMovies();
      setHistory(watchedMovies);
      setLoading(false);
    };

    loadHistory();
  }, []);

  const handleRemoveMovie = (movieId: string) => {
    WatchHistoryManager.removeMovie(movieId);
    setHistory(prev => prev.filter(item => item.movieId !== movieId));
  };

  const handleClearAll = () => {
    if (confirm('Bạn có chắc muốn xóa toàn bộ lịch sử xem?')) {
      WatchHistoryManager.clearHistory();
      setHistory([]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-black">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">Đang tải...</div>
        </div>
      </div>
    );
  }

  // Filter to show only movies that are not completed (progress < 90%)
  const unfinishedMovies = history.filter(item => item.progress < 90);

  return (
    <div className="min-h-screen bg-netflix-black">
      <Header />

      {/* Push content down below header */}
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">Tiếp tục xem</h1>
            {unfinishedMovies.length > 0 && (
              <button
                onClick={handleClearAll}
                className="bg-netflix-gray hover:bg-netflix-light-gray text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Xóa tất cả
              </button>
            )}
          </div>

          {/* Content */}
          {unfinishedMovies.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 text-lg mb-4">Chưa có phim để tiếp tục xem</div>
              <Link
                href="/"
                className="bg-netflix-red hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Khám phá phim
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {unfinishedMovies.map((item) => (
                <div key={`${item.movieId}-${item.episodeIndex}`} className="group relative">
                  <Link href={`/phim/${item.movieSlug}`}>
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-netflix-gray">
                      <Image
                        src={`https://img.ophim.live/uploads/movies/${item.posterUrl}`}
                        alt={item.movieName}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Play icon overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-black/50 rounded-full p-3">
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>


                      {/* Remove button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveMovie(item.movieId);
                        }}
                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </Link>

                  {/* Movie Info */}
                  <div className="mt-3">
                    <h3 className="text-white font-medium text-sm line-clamp-2 group-hover:text-netflix-red transition-colors">
                      {item.movieName}
                    </h3>

                    {item.episodeName !== 'Full' && (
                      <div className="text-xs text-gray-400 mt-1">
                        Tập {item.episodeName}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
