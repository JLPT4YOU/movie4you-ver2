"use client";

import React, { useState, useEffect, ReactNode } from 'react';
import { normalizeMovie } from "@/utils/ophim";

interface Movie {
  name: string;
  slug: string;
  origin_name: string;
  thumb_url: string;
  poster_url: string;
  year: number;
  type?: string;
  sub_docquyen?: boolean;
  episode_current?: string;
  quality?: string;
  lang?: string;
  time?: string;
  episode_time?: string;
  episode_total?: string;
  categories?: any[];
  countries?: any[];
  actor?: string[];
  director?: string[];
  content?: string;
  trailer_url?: string;
  showtimes?: string;
  modified: {
    time: string;
  };
}

interface CinemaMoviesProviderProps {
  children: (props: {
    heroMovies: Movie[];
    cinemaMovies: Movie[];
    loading: boolean;
    error: string | null;
  }) => ReactNode;
  initialHeroMovies?: Movie[];
  initialCinemaMovies?: Movie[];
}

export default function CinemaMoviesProvider({ children, initialHeroMovies = [], initialCinemaMovies = [] }: CinemaMoviesProviderProps) {
  const [heroMovies, setHeroMovies] = useState<Movie[]>(initialHeroMovies);
  const [cinemaMovies, setCinemaMovies] = useState<Movie[]>(initialCinemaMovies);
  const [loading, setLoading] = useState(initialHeroMovies.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Skip fetching if we already have initial data from SSR
    if (initialHeroMovies.length > 0) {
      return;
    }
    
    const fetchCinemaMovies = async () => {
      try {
        // Fetch 6 movies at once
        const response = await fetch('/api/ophim/v1/api/danh-sach/phim-chieu-rap?page=1&limit=6&sort_field=modified.time&sort_type=desc');
        const data = await response.json();
        const arr = data?.data?.items ?? data?.items ?? data?.data ?? [] as Array<Record<string, unknown>>;
        const movieItems = arr;

        if (movieItems.length > 0) {
          // Fetch first movie details immediately for hero section
          const firstMovieItem = movieItems[0];
          const movie = (firstMovieItem as Record<string, any>)?.movie || firstMovieItem;
          
          try {
            const detailResponse = await fetch(`/api/ophim/v1/api/phim/${(movie as Record<string, any>).slug}`);
            const detailData = await detailResponse.json();
            const movieDetail = detailData?.data?.item || {};

            const firstMovie = {
              name: movieDetail.name || movie.name,
              slug: movieDetail.slug || movie.slug,
              origin_name: movieDetail.origin_name || movie.origin_name,
              thumb_url: movieDetail.thumb_url || movie.thumb_url,
              poster_url: movieDetail.poster_url || movie.poster_url,
              year: movieDetail.year || movie.year,
              type: movieDetail.type || movie.type || 'single',
              sub_docquyen: movieDetail.sub_docquyen || movie.sub_docquyen || false,
              episode_current: movieDetail.episode_current || movie.episode_current || '',
              quality: movieDetail.quality || movie.quality || 'HD',
              lang: movieDetail.lang || movie.lang || 'Vietsub',
              time: movieDetail.time || movie.time || movieDetail.episode_time || movie.episode_time || '',
              episode_total: movieDetail.episode_total || movie.episode_total || '1',
              categories: movieDetail.category || movie.category || [],
              actor: movieDetail.actor || movie.actor || [],
              director: movieDetail.director || movie.director || [],
              content: movieDetail.content || movie.content || '',
              trailer_url: movieDetail.trailer_url || movie.trailer_url || '',
              showtimes: movieDetail.showtimes || movie.showtimes || '',
              modified: movieDetail.modified || movie.modified || { time: new Date().toISOString() }
            } as Movie;

            // Set first movie immediately for hero section
            setHeroMovies([firstMovie]);
            
            // Then fetch remaining movies details
            const remainingMovies = await Promise.all(
              movieItems.slice(1, 6).map(async (item: Record<string, unknown>) => {
                const movie = (item as Record<string, any>)?.movie || item;
                try {
                  const detailResponse = await fetch(`/api/ophim/v1/api/phim/${(movie as Record<string, any>).slug}`);
                  const detailData = await detailResponse.json();
                  const movieDetail = detailData?.data?.item || {};

                  return {
                    name: movieDetail.name || movie.name,
                    slug: movieDetail.slug || movie.slug,
                    origin_name: movieDetail.origin_name || movie.origin_name,
                    thumb_url: movieDetail.thumb_url || movie.thumb_url,
                    poster_url: movieDetail.poster_url || movie.poster_url,
                    year: movieDetail.year || movie.year,
                    type: movieDetail.type || movie.type || 'single',
                    sub_docquyen: movieDetail.sub_docquyen || movie.sub_docquyen || false,
                    episode_current: movieDetail.episode_current || movie.episode_current || '',
                    quality: movieDetail.quality || movie.quality || 'HD',
                    lang: movieDetail.lang || movie.lang || 'Vietsub',
                    time: movieDetail.time || movie.time || movieDetail.episode_time || movie.episode_time || '',
                    episode_total: movieDetail.episode_total || movie.episode_total || '1',
                    categories: movieDetail.category || movie.category || [],
                    actor: movieDetail.actor || movie.actor || [],
                    director: movieDetail.director || movie.director || [],
                    content: movieDetail.content || movie.content || '',
                    trailer_url: movieDetail.trailer_url || movie.trailer_url || '',
                    showtimes: movieDetail.showtimes || movie.showtimes || '',
                    modified: movieDetail.modified || movie.modified || { time: new Date().toISOString() }
                  } as Movie;
                } catch (error) {
                  console.error(`Error fetching details for ${(movie as Record<string, any>).slug}:`, error);
                  return normalizeMovie(movie) as Movie;
                }
              })
            );

            // Set all movies for hero section
            setHeroMovies([firstMovie, ...remainingMovies].slice(0, 5));
            // Set all 6 movies for cinema section
            setCinemaMovies([firstMovie, ...remainingMovies]);
          } catch (error) {
            console.error('Error fetching first movie details:', error);
            // Fallback to basic data
            const normalizedMovies = movieItems.map(normalizeMovie).filter(Boolean) as Movie[];
            setHeroMovies(normalizedMovies.slice(0, 5));
            setCinemaMovies(normalizedMovies.slice(0, 6));
          }
        }
      } catch (error) {
        console.error('Error fetching cinema movies:', error);
        setError('Failed to load cinema movies');
      } finally {
        setLoading(false);
      }
    };

    fetchCinemaMovies();
  }, []);

  return <>{children({ heroMovies, cinemaMovies, loading, error })}</>;
}
