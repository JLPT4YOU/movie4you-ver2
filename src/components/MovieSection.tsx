"use client";

import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import Link from "next/link";
import Image from "next/image";

import { normalizeMovie, buildSearch } from "@/utils/ophim";
import { WatchHistoryManager, WatchHistoryItem } from "@/utils/watchHistory";

interface Movie {
  name: string;
  slug: string;
  origin_name: string;
  thumb_url: string;
  poster_url: string;
  year: number;
  categories?: { name: string; slug: string }[];
  modified: {
    time: string;
  };
}

interface MovieCategory {
  name: string;
  slug: string;
  items: Movie[];
}

export default function MovieSection() {
  const [categories, setCategories] = useState<MovieCategory[]>([]);
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadedPages, setLoadedPages] = useState<Record<string, number>>({});
  const [loadingMore, setLoadingMore] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Load watch history
    const loadHistory = () => {
      const history = WatchHistoryManager.getWatchedMovies();
      // Filter for unfinished movies (progress < 90%)
      const unfinished = history.filter(item => item.progress < 90);
      setWatchHistory(unfinished);
    };

    loadHistory();
    
    // Set up interval to refresh history every 30 seconds
    const interval = setInterval(loadHistory, 30000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {

        const lists: { slug: string; title: string; params?: Record<string, string | number> }[] = [
          { slug: 'phim-chieu-rap', title: 'Phim chiếu rạp' },
          { slug: 'phim-moi', title: 'Phim mới' },
          { slug: 'phim-le', title: 'Phim lẻ' },
          { slug: 'phim-bo', title: 'Phim bộ' },
          { slug: 'tv-shows', title: 'TV Shows' },
          { slug: 'hoat-hinh', title: 'Hoạt hình' },
        ];

        const query = (p?: Record<string, string | number>) => {
          const base: Record<string, string | number> = {
            page: 1,
            limit: 6,  // Only load 6 movies initially
            sort_field: 'modified.time',
            sort_type: 'desc',
            ...(p || {})
          };
          return buildSearch(base);
        };

        const rows = await Promise.all(
          lists.map(async (l) => {
            const url = `/api/ophim/v1/api/danh-sach/${l.slug}?${query(l.params)}`;
            const res = await fetch(url, { headers: { accept: 'application/json' } });
            if (!res.ok) throw new Error(`Failed to fetch list: ${l.slug}`);
            const json = await res.json();
            const arr = json?.data?.items ?? json?.items ?? json?.data?.movies ?? [] as Array<Record<string, unknown>>;
            const items = (Array.isArray(arr) ? arr : []).map(normalizeMovie).filter(Boolean) as Movie[];
            setLoadedPages(prev => ({ ...prev, [l.slug]: 1 }));  // Track loaded pages
            return { name: l.title, slug: l.slug, items } as MovieCategory;
          })
        );

        console.log('[Danh-sach rows]', rows.map(r => ({ name: r.name, count: r.items.length })));
        setCategories(rows.filter((r) => r.items.length > 0));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Function to load more movies for a specific category
  const loadMoreMovies = async (categorySlug: string) => {
    if (loadingMore[categorySlug]) return;
    
    setLoadingMore(prev => ({ ...prev, [categorySlug]: true }));
    
    try {
      const currentPage = loadedPages[categorySlug] || 1;
      const nextPage = currentPage + 1;
      
      // Fetch next page of movies
      const query = buildSearch({
        page: nextPage,
        limit: 6,
        sort_field: 'modified.time',
        sort_type: 'desc'
      });
      const response = await fetch(`/api/ophim/v1/api/danh-sach/${categorySlug}?${query}`);
      const data = await response.json();
            const arr = data?.data?.items ?? data?.items ?? data?.data?.movies ?? [] as Array<Record<string, unknown>>;
      if (arr.length > 0) {
        const newMovies = (Array.isArray(arr) ? arr : []).map(normalizeMovie).filter(Boolean) as Movie[];
        
        setCategories(prev => prev.map(cat => {
          if (cat.slug === categorySlug) {
            return {
              ...cat,
              items: [...cat.items, ...newMovies]
            };
          }
          return cat;
        }));
        
        setLoadedPages(prev => ({ ...prev, [categorySlug]: nextPage }));
      }
    } catch (error) {
      console.error(`Error loading more for ${categorySlug}:`, error);
    } finally {
      setLoadingMore(prev => ({ ...prev, [categorySlug]: false }));
    }
  };

  // Function to handle scroll detection
  const handleScroll = (e: React.UIEvent<HTMLDivElement>, categorySlug: string) => {
    const element = e.currentTarget;
    const scrollPercentage = (element.scrollLeft / (element.scrollWidth - element.clientWidth)) * 100;
    
    // Load more when scrolled past 70%
    if (scrollPercentage > 70 && !loadingMore[categorySlug]) {
      const currentPage = loadedPages[categorySlug] || 1;
      // Load more if haven't reached max pages (e.g., 8 pages = 48 movies total)
      if (currentPage < 8) {
        loadMoreMovies(categorySlug);
      }
    }
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-netflix-gray rounded w-48 mb-6"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-netflix-gray rounded-md"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-red-500">
          Error loading movies: {error}
        </div>
      </div>
    );
  }

  if (!loading && !error && categories.length === 0) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-10 text-center text-white/80">
        Không có dữ liệu phim. Vui lòng thử lại sau.
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Continue Watching Section - Show at the top if there are unfinished movies */}
      {watchHistory.length > 0 && (
        <section className="relative">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Tiếp tục xem
            </h2>
            <Link
              href="/lich-su"
              className="text-sm text-white/80 hover:text-white transition-colors"
            >
              Xem tất cả
            </Link>
          </div>

          {/* Continue Watching carousel */}
          <div className="relative">
            {/* Left scroll button */}
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-netflix-black/60 hover:bg-netflix-black/80 text-netflix-white p-2 rounded-r-md opacity-0 hover:opacity-100 transition-all"
              onClick={() => {
                const container = document.getElementById('carousel-continue-watching');
                if (container) container.scrollLeft -= 300;
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Right scroll button */}
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-netflix-black/60 hover:bg-netflix-black/80 text-netflix-white p-2 rounded-l-md opacity-0 hover:opacity-100 transition-all"
              onClick={() => {
                const container = document.getElementById('carousel-continue-watching');
                if (container) container.scrollLeft += 300;
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Movies grid with horizontal scroll */}
            <div
              id="carousel-continue-watching"
              className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {watchHistory.slice(0, 12).map((item) => (
                <div key={`${item.movieId}-${item.episodeIndex}`} className="flex-none w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 min-w-[160px]">
                  <Link href={`/phim/${item.movieSlug}`}>
                    <div className="group relative">
                      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-netflix-gray">
                        <Image
                          src={`https://img.ophim.live/uploads/movies/${item.posterUrl}`}
                          alt={item.movieName}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />


                        {/* Overlay with play icon */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-black/50 rounded-full p-3">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        </div>
                      </div>

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
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {categories.map((category) => (
        <section key={category.slug} className="relative">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold text-white">
              {category.name}
            </h2>
            <Link
              href={`/category/${category.slug}`}
              className="text-sm text-white/80 hover:text-white transition-colors"
            >
              Xem tất cả
            </Link>
          </div>

          {/* Movie carousel container */}
          <div className="relative">
            {/* Left scroll button */}
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-netflix-black/60 hover:bg-netflix-black/80 text-netflix-white p-2 rounded-r-md opacity-0 hover:opacity-100 transition-all"
              onClick={() => {
                const container = document.getElementById(`carousel-${category.slug}`);
                if (container) container.scrollLeft -= 300;
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Right scroll button */}
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-netflix-black/60 hover:bg-netflix-black/80 text-netflix-white p-2 rounded-l-md opacity-0 hover:opacity-100 transition-all"
              onClick={() => {
                const container = document.getElementById(`carousel-${category.slug}`);
                if (container) container.scrollLeft += 300;
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Movies grid with horizontal scroll */}
            <div
              id={`carousel-${category.slug}`}
              className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              onScroll={(e) => handleScroll(e, category.slug)}
            >
              {(category.items ?? []).map((movie) => (
                <div key={movie.slug} className="flex-none w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 min-w-[160px]">
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

