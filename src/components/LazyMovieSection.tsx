"use client";

import { useState, useEffect, useRef } from "react";
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
  modified: {
    time: string;
  };
}

interface LazyMovieSectionProps {
  title: string;
  slug: string;
  viewAllUrl: string;
  priority?: boolean; // Load ngay lập tức (cho section đầu tiên)
}

export default function LazyMovieSection({ 
  title, 
  slug, 
  viewAllUrl, 
  priority = false 
}: LazyMovieSectionProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Fetch movies function
  const fetchMovies = async () => {
    if (loaded || loading) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `/api/ophim/v1/api/danh-sach/${slug}?page=1&limit=6&sort_field=modified.time&sort_type=desc`,
        { 
          headers: { accept: 'application/json' },
          next: { revalidate: 300 } // Cache 5 minutes
        }
      );
      
      if (!response.ok) throw new Error(`Failed to fetch ${slug}`);
      
      const data = await response.json();
      const items = data?.data?.items || data?.items || [];
      
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
      
      setMovies(normalizedMovies);
      setLoaded(true);
    } catch (error) {
      console.error(`Error fetching ${slug}:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) {
      // Load immediately for priority sections
      fetchMovies();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !loaded && !loading) {
            fetchMovies();
          }
        });
      },
      {
        root: null,
        rootMargin: '200px', // Load 200px before entering viewport
        threshold: 0.1
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [priority, loaded, loading]);

  return (
    <div ref={sectionRef} className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-netflix-white">{title}</h2>
        <a
          href={viewAllUrl}
          className="text-netflix-red hover:text-red-400 transition-colors text-sm font-medium"
        >
          Xem tất cả
        </a>
      </div>

      {loading ? (
        // Loading skeleton
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-netflix-gray rounded-md animate-pulse"></div>
          ))}
        </div>
      ) : movies.length > 0 ? (
        // Movies grid
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {movies.map((movie, index) => (
            <MovieCard
              key={movie.slug}
              movie={movie}
              lazy={!priority || index > 2} // First 3 items not lazy for priority sections
            />
          ))}
        </div>
      ) : loaded ? (
        // No movies found
        <div className="text-center py-8 text-netflix-gray">
          Không có phim nào trong danh mục này
        </div>
      ) : null}
    </div>
  );
}
