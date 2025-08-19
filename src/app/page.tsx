import OptimizedHeroSection from "@/components/OptimizedHeroSection";
import LazyMovieSection from "@/components/LazyMovieSection";

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

async function fetchCinemaMoviesData() {
  try {
    // Use absolute URL for Vercel deployment
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://movie4you-ver2.vercel.app'
      : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
    
    console.log('Fetching from URL:', baseUrl);
    
    // Fetch 6 movies at once with ISR caching
    const response = await fetch(
      `${baseUrl}/api/ophim/v1/api/danh-sach/phim-chieu-rap?page=1&limit=6&sort_field=modified.time&sort_type=desc`,
      {
        next: { revalidate: 300 }, // Revalidate every 5 minutes
        cache: 'force-cache'
      }
    );
    
    if (!response.ok) {
      console.error('Failed to fetch cinema movies:', response.status, response.statusText);
      return { heroMovies: [], cinemaMovies: [] };
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Response is not JSON, got:', contentType);
      return { heroMovies: [], cinemaMovies: [] };
    }
    
    const data = await response.json();
    const arr = data?.data?.items ?? data?.items ?? data?.data ?? [] as Array<Record<string, unknown>>;
    const movieItems = arr;

    if (movieItems.length === 0) {
      return { heroMovies: [], cinemaMovies: [] };
    }

    // Process first movie details immediately for hero section
    const firstMovieItem = movieItems[0];
    const movie = (firstMovieItem as Record<string, any>)?.movie || firstMovieItem;
    
    let firstMovie: Movie;
    try {
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://movie4you-ver2.vercel.app'
        : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
      const detailResponse = await fetch(
        `${baseUrl}/api/ophim/v1/api/phim/${(movie as Record<string, any>).slug}`,
        { cache: 'no-store' }
      );
      
      if (!detailResponse.ok || !detailResponse.headers.get('content-type')?.includes('application/json')) {
        throw new Error('Invalid response from API');
      }
      
      const detailData = await detailResponse.json();
      const movieDetail = detailData?.data?.item || {};

      firstMovie = {
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
      console.error('Error fetching first movie details:', error);
      firstMovie = movie as Movie;
    }

    // Fetch remaining movies details
    const remainingMovies = await Promise.all(
      movieItems.slice(1, 6).map(async (item: any) => {
        const m = (item as Record<string, any>)?.movie || item;
        try {
          const baseUrl = process.env.NODE_ENV === 'production' 
            ? 'https://movie4you-ver2.vercel.app'
            : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
          const res = await fetch(
            `${baseUrl}/api/ophim/v1/api/phim/${(m as Record<string, any>).slug}`,
            { cache: 'no-store' }
          );
          
          if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) {
            throw new Error('Invalid response from API');
          }
          
          const detailData = await res.json();
          const detail = detailData?.data?.item || {};
          
          return {
            name: detail.name || m.name,
            slug: detail.slug || m.slug,
            origin_name: detail.origin_name || m.origin_name,
            thumb_url: detail.thumb_url || m.thumb_url,
            poster_url: detail.poster_url || m.poster_url,
            year: detail.year || m.year,
            type: detail.type || m.type || 'single',
            sub_docquyen: detail.sub_docquyen || m.sub_docquyen || false,
            episode_current: detail.episode_current || m.episode_current || '',
            quality: detail.quality || m.quality || 'HD',
            lang: detail.lang || m.lang || 'Vietsub',
            time: detail.time || m.time || detail.episode_time || m.episode_time || '',
            episode_total: detail.episode_total || m.episode_total || '1',
            categories: detail.category || m.category || [],
            actor: detail.actor || m.actor || [],
            director: detail.director || m.director || [],
            content: detail.content || m.content || '',
            trailer_url: detail.trailer_url || m.trailer_url || '',
            showtimes: detail.showtimes || m.showtimes || '',
            modified: detail.modified || m.modified || { time: new Date().toISOString() }
          } as Movie;
        } catch (error) {
          console.error('Error fetching movie details:', error);
          return m as Movie;
        }
      })
    );

    const allMovies = [firstMovie, ...remainingMovies];
    return {
      heroMovies: allMovies,
      cinemaMovies: allMovies
    };
  } catch (error) {
    console.error('Error fetching cinema movies:', error);
    return { heroMovies: [], cinemaMovies: [] };
  }
}

export default async function Home() {
  const { heroMovies } = await fetchCinemaMoviesData();

  return (
    <>
      <OptimizedHeroSection movies={heroMovies} loading={false} />

      {/* Lazy load movie sections - chỉ load khi scroll tới */}
      <LazyMovieSection
        title="Phim chiếu rạp"
        slug="phim-chieu-rap"
        viewAllUrl="/category/phim-chieu-rap"
        priority={true} // Load ngay lập tức
      />

      <LazyMovieSection
        title="Phim mới"
        slug="phim-moi"
        viewAllUrl="/category/phim-moi"
      />

      <LazyMovieSection
        title="Phim lẻ"
        slug="phim-le"
        viewAllUrl="/category/phim-le"
      />

      <LazyMovieSection
        title="Phim bộ"
        slug="phim-bo"
        viewAllUrl="/category/phim-bo"
      />

      <LazyMovieSection
        title="TV Shows"
        slug="tv-shows"
        viewAllUrl="/category/tv-shows"
      />

      <LazyMovieSection
        title="Hoạt hình"
        slug="hoat-hinh"
        viewAllUrl="/category/hoat-hinh"
      />
    </>
  );
}
