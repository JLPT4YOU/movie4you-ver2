import { useState, useEffect } from 'react';
import { normalizeMovie, buildSearch } from '@/utils/ophim';

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

interface UseCinemaMoviesResult {
  movies: Movie[];
  loading: boolean;
  error: string | null;
}

export function useCinemaMovies(): UseCinemaMoviesResult {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCinemaMovies = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const query = buildSearch({
          page: 1,
          limit: 12,
          sort_field: 'modified.time',
          sort_type: 'desc'
        });
        
        const response = await fetch(`/api/ophim/v1/api/danh-sach/phim-chieu-rap?${query}`);
        if (!response.ok) throw new Error('Failed to fetch cinema movies');
        
        const data = await response.json();
        const arr = data?.data?.items ?? data?.items ?? data?.data?.movies ?? [];
        const normalizedMovies = (Array.isArray(arr) ? arr : [])
          .map(normalizeMovie)
          .filter(Boolean) as Movie[];
        
        setMovies(normalizedMovies);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCinemaMovies();
  }, []);

  return { movies, loading, error };
}
