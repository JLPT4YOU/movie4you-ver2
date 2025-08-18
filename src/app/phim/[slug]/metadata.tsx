import { Metadata } from 'next';
import { MovieDetailResponse } from '@/types/movie';
import { 
  generateTitle, 
  generateDescription, 
  generateKeywords,
  generateOpenGraph,
  generateTwitterCard 
} from '@/utils/seo';

// Fetch movie data for metadata generation
async function getMovieData(slug: string): Promise<MovieDetailResponse | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/ophim/v1/api/phim/${slug}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) return null;
    
    const data: MovieDetailResponse = await response.json();
    return data.status === 'success' ? data : null;
  } catch (error) {
    console.error('Error fetching movie for metadata:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const movieData = await getMovieData(params.slug);
  
  if (!movieData?.data?.item) {
    return {
      title: 'Phim không tìm thấy',
      description: 'Phim bạn tìm kiếm không tồn tại hoặc đã bị xóa.',
    };
  }
  
  const movie = movieData.data.item;
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://movie4you.com'}/phim/${params.slug}`;
  
  // Generate optimized title
  const title = generateTitle(
    movie.name,
    `${movie.origin_name} (${movie.year})`
  );
  
  // Generate optimized description
  const description = generateDescription(movie);
  
  // Generate keywords
  const keywords = generateKeywords(movie).join(', ');
  
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: generateOpenGraph(movie, url),
    twitter: generateTwitterCard(movie),
    other: {
      'article:published_time': movie.created?.time || new Date().toISOString(),
      'article:modified_time': movie.modified?.time || new Date().toISOString(),
      'article:tag': movie.category?.map(c => c.name).join(', '),
    }
  };
}
