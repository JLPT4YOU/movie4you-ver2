import { Suspense } from "react";
import OptimizedHeroSection from "@/components/OptimizedHeroSection";
import OptimizedMovieSection from "@/components/OptimizedMovieSection";
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
  episode_total?: string;
  categories?: { name: string; slug: string }[];
  actor?: string[];
  director?: string[];
  content?: string;
  trailer_url?: string;
  showtimes?: string;
  modified: {
    time: string;
  };
}

// Fetch cinema movies on server side
async function getCinemaMovies() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  
  try {
    // Fetch list of cinema movies with optimized caching
    const listResponse = await fetch(
      `${apiUrl}/api/ophim/v1/api/danh-sach/phim-chieu-rap?page=1&limit=6&sort_field=modified.time`,
      { 
        next: { revalidate: 3600 }, // Cache for 1 hour
        cache: 'force-cache'
      }
    );
    
    if (!listResponse.ok) {
      throw new Error('Failed to fetch cinema movies');
    }
    
    const listData = await listResponse.json();
    const movieItems = listData?.data?.items || [];
    
    if (movieItems.length === 0) {
      return { heroMovies: [], cinemaMovies: [] };
    }
    
    // Fetch details for first 3 movies in parallel for hero section
    const detailPromises = movieItems.slice(0, 3).map((movie: Movie) => 
      fetch(
        `${apiUrl}/api/ophim/v1/api/phim/${movie.slug}`,
        { 
          next: { revalidate: 3600 }, // Cache for 1 hour
          cache: 'force-cache'
        }
      ).then(res => res.ok ? res.json() : null)
    );
    
    const detailResults = await Promise.all(detailPromises);
    
    // Process the first 3 movies with details
    const heroMovies = movieItems.slice(0, 3).map((movie: Movie, index: number) => {
      const detailData = detailResults[index];
      if (detailData?.data) {
        return {
          ...movie,
          ...detailData.data.movie,
          episodes: detailData.data.episodes || []
        };
      }
      return movie;
    });
    
    return {
      heroMovies,
      cinemaMovies: movieItems
    };
  } catch (error) {
    console.error('Error fetching cinema movies:', error);
    return { heroMovies: [], cinemaMovies: [] };
  }
}

export default async function Home() {
  // Fetch data on server side
  const { heroMovies, cinemaMovies } = await getCinemaMovies();

  return (
    <>
      <OptimizedHeroSection movies={heroMovies} loading={false} />
      <Suspense fallback={
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-96 bg-netflix-gray/10 rounded animate-pulse" />
        </div>
      }>
        <OptimizedMovieSection cinemaMovies={cinemaMovies} />
      </Suspense>
    </>
  );
}
