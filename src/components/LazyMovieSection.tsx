'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import MovieCard from '@/components/MovieCard';
import Link from 'next/link';

interface Movie {
  name: string;
  slug: string;
  origin_name: string;
  thumb_url: string;
  poster_url: string;
  year: number;
  modified: { time: string };
  episode_current?: string;
  quality?: string;
  lang?: string;
  _id?: string;
}

interface LazyMovieSectionProps {
  title: string;
  slug: string;
  viewAllUrl: string;
  priority?: boolean;
}

export default function LazyMovieSection({ title, slug, viewAllUrl, priority = false }: LazyMovieSectionProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);

  const fetchMovies = useCallback(async (pageNum: number) => {
    if (isFetching) return;
    
    setIsFetching(true);
    try {
      const response = await fetch(`/api/ophim/v1/api/danh-sach/${slug}?page=${pageNum}&limit=6`);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      const items = data?.data?.items || [];
      
      if (items.length < 6) {
        setHasMore(false);
      }
      
      setMovies(prev => pageNum === 1 ? items : [...prev, ...items]);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setHasMore(false);
    } finally {
      setIsFetching(false);
    }
  }, [slug, isFetching]);

  // Initial load with Intersection Observer
  useEffect(() => {
    if (hasLoaded) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          setIsLoading(true);
          setHasLoaded(true);
          fetchMovies(1).finally(() => setIsLoading(false));
        }
      },
      { 
        rootMargin: priority ? '1000px' : '100px',
        threshold: 0.01 
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasLoaded, isLoading, priority, fetchMovies]);

  // Horizontal scroll load more
  useEffect(() => {
    if (!hasLoaded || !hasMore || !scrollContainerRef.current) return;

    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const scrollPercentage = (container.scrollLeft / (container.scrollWidth - container.clientWidth)) * 100;
      
      if (scrollPercentage > 70 && !isFetching && hasMore) {
        setPage(prev => prev + 1);
        fetchMovies(page + 1);
      }
    };

    const container = scrollContainerRef.current;
    container?.addEventListener('scroll', handleScroll, { passive: true });

    return () => container?.removeEventListener('scroll', handleScroll);
  }, [hasLoaded, hasMore, isFetching, page, fetchMovies]);

  if (!hasLoaded) {
    return (
      <section ref={containerRef} className="mb-8">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{title}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-800 rounded-lg aspect-[2/3]"></div>
                <div className="mt-2 h-4 bg-gray-800 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          <Link 
            href={viewAllUrl}
            className="text-blue-500 hover:text-blue-400 transition-colors"
          >
            Xem tất cả →
          </Link>
        </div>
        
        <div className="relative">
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
            style={{ scrollBehavior: 'smooth' }}
          >
            {movies.map((movie) => (
              <div key={movie.slug} className="flex-shrink-0 w-[calc(50%-8px)] sm:w-[calc(33.333%-10.67px)] md:w-[calc(25%-12px)] lg:w-[calc(16.667%-13.33px)]">
                <MovieCard movie={movie} />
              </div>
            ))}
            
            {isFetching && (
              <div className="flex-shrink-0 w-[calc(50%-8px)] sm:w-[calc(33.333%-10.67px)] md:w-[calc(25%-12px)] lg:w-[calc(16.667%-13.33px)]">
                <div className="animate-pulse">
                  <div className="bg-gray-800 rounded-lg aspect-[2/3]"></div>
                  <div className="mt-2 h-4 bg-gray-800 rounded w-3/4"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
