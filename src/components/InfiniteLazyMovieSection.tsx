"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import MovieCard from "./MovieCard";

interface Movie {
  name: string;
  slug: string;
  origin_name: string;
  thumb_url: string;
  poster_url: string;
  year: number;
  time?: string;
  episode_time?: string;
  episode_current?: string;
  episode_total?: string;
  quality?: string;
  lang?: string;
  modified: {
    time: string;
  };
}

interface InfiniteLazyMovieSectionProps {
  title: string;
  slug: string;
  viewAllUrl: string;
  priority?: boolean;
}

export default function InfiniteLazyMovieSection({ 
  title, 
  slug, 
  viewAllUrl, 
  priority = false 
}: InfiniteLazyMovieSectionProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [displayedMovies, setDisplayedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoaded, setInitialLoaded] = useState(false);
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);

  // Fixed counts for all devices
  const getInitialCount = () => 6;
  const getLoadMoreCount = () => 6;

  // Fetch movies from API
  const fetchMovies = async (pageNum: number) => {
    try {
      const response = await fetch(
        `/api/ophim/v1/api/danh-sach/${slug}?page=${pageNum}&limit=12&sort_field=modified.time&sort_type=desc`,
        { 
          headers: { accept: 'application/json' },
          next: { revalidate: 300 }
        }
      );
      
      if (!response.ok) throw new Error(`Failed to fetch ${slug}`);
      
      const data = await response.json();
      const items = data?.data?.items || data?.items || [];
      
      // Check if there are more pages
      const totalPages = data?.data?.params?.pagination?.totalPages || 
                        data?.pagination?.totalPages || 
                        Math.ceil((data?.data?.params?.pagination?.totalItems || 100) / 12);
      
      setHasMore(pageNum < totalPages && items.length > 0);
      
      // Normalize movie data
      const normalizedMovies = items.map((item: any) => ({
        _id: item._id,
        name: item.name,
        slug: item.slug,
        origin_name: item.origin_name || item.name,
        poster_url: item.poster_url || item.thumb_url,
        thumb_url: item.thumb_url || item.poster_url,
        year: item.year,
        time: item.time,
        episode_current: item.episode_current,
        episode_total: item.episode_total,
        quality: item.quality,
        lang: item.lang,
        category: item.category,
        country: item.country,
        modified: item.modified || { time: new Date().toISOString() }
      }));
      
      return normalizedMovies;
    } catch (error) {
      console.error(`Error fetching ${slug}:`, error);
      return [];
    }
  };

  // Initial load
  const loadInitialMovies = async () => {
    if (initialLoaded || loading) return;
    
    setLoading(true);
    const newMovies = await fetchMovies(1);
    setMovies(newMovies);
    setDisplayedMovies(newMovies.slice(0, getInitialCount()));
    setInitialLoaded(true);
    setLoading(false);
  };

  // Load more movies (from already fetched or new page)
  const loadMoreMovies = useCallback(async () => {
    if (loadingMore || !initialLoaded) return;
    
    setLoadingMore(true);
    
    const currentDisplayed = displayedMovies.length;
    const loadCount = getLoadMoreCount();
    
    // Check if we have enough movies already fetched
    if (currentDisplayed + loadCount <= movies.length) {
      // Show more from already fetched movies
      setDisplayedMovies(movies.slice(0, currentDisplayed + loadCount));
    } else if (hasMore) {
      // Need to fetch more from API
      const nextPage = page + 1;
      const newMovies = await fetchMovies(nextPage);
      
      if (newMovies.length > 0) {
        const allMovies = [...movies, ...newMovies];
        setMovies(allMovies);
        setDisplayedMovies(allMovies.slice(0, currentDisplayed + loadCount));
        setPage(nextPage);
      }
    }
    
    setLoadingMore(false);
  }, [displayedMovies, movies, page, hasMore, loadingMore, initialLoaded]);

  // Intersection Observer for initial lazy loading
  useEffect(() => {
    if (priority) {
      loadInitialMovies();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !initialLoaded && !loading) {
            loadInitialMovies();
          }
        });
      },
      {
        root: null,
        rootMargin: '200px',
        threshold: 0.1
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [priority, initialLoaded, loading]);

  // Scroll handler for desktop
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || loadingMore || !hasMore) return;
    
    const container = scrollContainerRef.current;
    const scrollPercentage = (container.scrollLeft / 
      (container.scrollWidth - container.clientWidth)) * 100;
    
    // Load more when scrolled 70% to the right
    if (scrollPercentage > 70) {
      loadMoreMovies();
    }
  }, [loadMoreMovies, loadingMore, hasMore]);


  // Intersection Observer for load more trigger
  useEffect(() => {
    if (!initialLoaded) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasMore && !loadingMore) {
            loadMoreMovies();
          }
        });
      },
      {
        root: scrollContainerRef.current,
        rootMargin: '100px',
        threshold: 0.1
      }
    );

    if (loadMoreTriggerRef.current) {
      observer.observe(loadMoreTriggerRef.current);
    }

    return () => observer.disconnect();
  }, [initialLoaded, hasMore, loadingMore, loadMoreMovies]);

  return (
    <div ref={sectionRef} className="px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-netflix-white">{title}</h2>
        <a
          href={viewAllUrl}
          className="text-netflix-red hover:text-red-400 transition-colors text-sm font-medium"
        >
          Xem tất cả
        </a>
      </div>

      {loading ? (
        // Loading skeleton
        <div className="flex gap-3 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="flex-none w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6"
            >
              <div className="aspect-[2/3] bg-netflix-gray rounded-md animate-pulse"></div>
            </div>
          ))}
        </div>
      ) : displayedMovies.length > 0 ? (
        // Movies horizontal scroll container
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none'
            }}
            onScroll={handleScroll}
          >
            {displayedMovies.map((movie, index) => (
              <div 
                key={`${movie.slug}-${index}`}
                className="flex-none w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 min-w-[160px]"
              >
                <MovieCard
                  movie={movie}
                  lazy={!priority || index > 2}
                />
              </div>
            ))}
            
            {/* Load more trigger */}
            {hasMore && (
              <div 
                ref={loadMoreTriggerRef}
                className="flex-none w-px h-full"
              />
            )}
            
            {/* Loading more indicator */}
            {loadingMore && (
              <div className="flex-none flex items-center justify-center px-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-netflix-red"></div>
              </div>
            )}
          </div>
        </div>
      ) : initialLoaded ? (
        // No movies found
        <div className="text-center py-8 text-netflix-gray">
          Không có phim nào trong danh mục này
        </div>
      ) : null}
    </div>
  );
}
