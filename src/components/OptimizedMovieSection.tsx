"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { normalizeMovie, buildSearch } from "@/utils/ophim";
import { WatchHistoryManager, WatchHistoryItem } from "@/utils/watchHistory";

// Dynamic import với loading state
const MovieCard = dynamic(() => import("./MovieCard"), {
  loading: () => (
    <div className="aspect-[2/3] bg-netflix-gray rounded-md animate-pulse" />
  ),
  ssr: false
});

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

interface OptimizedMovieSectionProps {
  cinemaMovies?: Movie[];
}

export default function OptimizedMovieSection({ cinemaMovies = [] }: OptimizedMovieSectionProps) {
  const [categories, setCategories] = useState<MovieCategory[]>([]);
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadedPages, setLoadedPages] = useState<Record<string, number>>({});
  const [loadingMore, setLoadingMore] = useState<Record<string, boolean>>({});

  // Debounced scroll handler
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>, categorySlug: string) => {
    const element = e.currentTarget;
    const scrollPercentage = (element.scrollLeft / (element.scrollWidth - element.clientWidth)) * 100;
    
    if (scrollPercentage > 70 && !loadingMore[categorySlug]) {
      const currentPage = loadedPages[categorySlug] || 1;
      if (currentPage < 8) {
        loadMoreMovies(categorySlug);
      }
    }
  }, [loadingMore, loadedPages]);

  const loadMoreMovies = async (categorySlug: string) => {
    if (loadingMore[categorySlug]) return;
    
    setLoadingMore(prev => ({ ...prev, [categorySlug]: true }));
    
    try {
      const currentPage = loadedPages[categorySlug] || 1;
      const nextPage = currentPage + 1;
      
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

  useEffect(() => {
    const loadHistory = () => {
      const history = WatchHistoryManager.getWatchedMovies();
      // Show all movies in history, not just unfinished ones
      // Since we can't track actual progress with iframe
      setWatchHistory(history.slice(0, 12)); // Show latest 12 movies
    };

    loadHistory();
    // No need for interval - component remounts on navigation anyway
    return () => {};
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
            limit: 6,
            sort_field: 'modified.time',
            sort_type: 'desc',
            ...(p || {})
          };
          return buildSearch(base);
        };

        const rows = await Promise.all(
          lists.map(async (l) => {
            // Use provided cinema movies if available
            if (l.slug === 'phim-chieu-rap' && cinemaMovies.length > 0) {
              setLoadedPages(prev => ({ ...prev, [l.slug]: 1 }));
              return { name: l.title, slug: l.slug, items: cinemaMovies } as MovieCategory;
            }
            
            const url = `/api/ophim/v1/api/danh-sach/${l.slug}?${query(l.params)}`;
            const res = await fetch(url, { headers: { accept: 'application/json' } });
            if (!res.ok) throw new Error(`Failed to fetch list: ${l.slug}`);
            const json = await res.json();
            const arr = json?.data?.items ?? json?.items ?? json?.data?.movies ?? [] as Array<Record<string, unknown>>;
            const items = (Array.isArray(arr) ? arr : []).map(normalizeMovie).filter(Boolean) as Movie[];
            setLoadedPages(prev => ({ ...prev, [l.slug]: 1 }));
            return { name: l.title, slug: l.slug, items } as MovieCategory;
          })
        );

        setCategories(rows.filter((r) => r.items.length > 0));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [cinemaMovies]);

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
      <div className="px-4 sm:px-6 lg:px-8 py-8 text-center text-red-500">
        Error loading movies: {error}
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Continue Watching Section */}
      {watchHistory.length > 0 && (
        <section className="relative">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold text-white">Tiếp tục xem</h2>
            <Link href="/lich-su" className="text-sm text-white/80 hover:text-white transition-colors">
              Xem tất cả
            </Link>
          </div>

          <div className="relative">
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
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="mt-3">
                        <h3 className="text-white font-medium text-sm line-clamp-2 group-hover:text-netflix-red transition-colors">
                          {item.movieName}
                        </h3>
                        {item.episodeName !== 'Full' && (
                          <div className="text-xs text-gray-400 mt-1">Tập {item.episodeName}</div>
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

      {/* Movie Categories */}
      {categories.map((category) => (
        <section key={category.slug} className="relative">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold text-white">{category.name}</h2>
            <Link href={`/category/${category.slug}`} className="text-sm text-white/80 hover:text-white transition-colors">
              Xem tất cả
            </Link>
          </div>

          <div className="relative">
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
