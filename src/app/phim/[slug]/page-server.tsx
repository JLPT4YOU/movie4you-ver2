import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MovieDetailResponse, MovieDetail } from '@/types/movie';
import { resolveImageUrl } from '@/utils/ophim';
import { 
  generateTitle, 
  generateDescription, 
  generateKeywords,
  generateOpenGraph,
  generateTwitterCard,
  generateMovieSchema,
  generateBreadcrumbSchema
} from '@/utils/seo';
import MoviePlayer from '@/components/MoviePlayer';

// Fetch movie data
async function getMovieData(slug: string): Promise<MovieDetail | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/ophim/v1/api/phim/${slug}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) return null;
    
    const data: MovieDetailResponse = await response.json();
    return data.status === 'success' && data.data?.item ? data.data.item : null;
  } catch (error) {
    console.error('Error fetching movie:', error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const movie = await getMovieData(params.slug);
  
  if (!movie) {
    return {
      title: 'Phim không tìm thấy',
      description: 'Phim bạn tìm kiếm không tồn tại hoặc đã bị xóa.',
    };
  }
  
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://movie4you.com'}/phim/${params.slug}`;
  
  return {
    title: generateTitle(movie.name, `${movie.origin_name} (${movie.year})`),
    description: generateDescription(movie),
    keywords: generateKeywords(movie).join(', '),
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

export default async function MovieDetailPage({ params }: { params: { slug: string } }) {
  const movie = await getMovieData(params.slug);
  
  if (!movie) {
    notFound();
  }
  
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://movie4you.com'}/phim/${params.slug}`;
  
  // Generate structured data
  const movieSchema = generateMovieSchema(movie, url);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Trang chủ', url: process.env.NEXT_PUBLIC_SITE_URL || 'https://movie4you.com' },
    { name: movie.type === 'series' ? 'Phim bộ' : 'Phim lẻ', url: `${process.env.NEXT_PUBLIC_SITE_URL}/danh-sach/${movie.type}` },
    { name: movie.name, url: url }
  ]);
  
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(movieSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      {/* Hero Section */}
      <div className="relative min-h-screen">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={resolveImageUrl(movie.poster_url)}
            alt={`${movie.name} - Poster`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
              {/* Poster */}
              <div className="flex-shrink-0 mx-auto lg:mx-0">
                <div className="relative group">
                  <Image
                    src={resolveImageUrl(movie.thumb_url)}
                    alt={`${movie.name} - Xem phim HD Vietsub`}
                    width={280}
                    height={420}
                    className="rounded-xl shadow-2xl transition-transform duration-300 group-hover:scale-105 w-[280px] h-[420px] object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Movie Info */}
              <div className="flex-1 text-white max-w-3xl">
                {/* Title */}
                <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold mb-4 leading-tight">
                  {movie.name}
                </h1>

                {/* Subtitle */}
                <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-gray-300 mb-6 font-light">
                  {movie.origin_name} <span className="text-netflix-red">({movie.year})</span>
                </h2>

                {/* Ratings */}
                {(movie.imdb || movie.tmdb) && (
                  <div className="flex flex-wrap items-center gap-6 mb-6">
                    {movie.imdb && (
                      <div className="flex items-center gap-3">
                        <div className="bg-yellow-500 text-black px-3 py-1 rounded-lg font-bold text-lg">
                          IMDb
                        </div>
                        <span className="text-2xl font-bold">{movie.imdb.vote_average}</span>
                        <span className="text-gray-400">
                          ({movie.imdb.vote_count.toLocaleString()} đánh giá)
                        </span>
                      </div>
                    )}
                    {movie.tmdb && (
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-500 text-white px-3 py-1 rounded-lg font-bold text-lg">
                          TMDb
                        </div>
                        <span className="text-2xl font-bold">{movie.tmdb.vote_average}</span>
                        <span className="text-gray-400">
                          ({movie.tmdb.vote_count.toLocaleString()} đánh giá)
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-3 mb-8">
                  {movie.category?.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/the-loai/${cat.slug}`}
                      className="bg-gray-800/80 hover:bg-netflix-red text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 border border-gray-600 hover:border-netflix-red"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>

                {/* Movie Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-600">
                    <span className="text-gray-400 text-xs block">Chất lượng</span>
                    <span className="text-white font-medium">{movie.quality}</span>
                  </div>
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-600">
                    <span className="text-gray-400 text-xs block">Thời lượng</span>
                    <span className="text-white font-medium">{movie.time}</span>
                  </div>
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-600">
                    <span className="text-gray-400 text-xs block">Tập phim</span>
                    <span className="text-white font-medium">{movie.episode_current}/{movie.episode_total}</span>
                  </div>
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-600">
                    <span className="text-gray-400 text-xs block">Năm</span>
                    <span className="text-white font-medium">{movie.year}</span>
                  </div>
                  {movie.country && movie.country.length > 0 && (
                    <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-600">
                      <span className="text-gray-400 text-xs block">Quốc gia</span>
                      <span className="text-white font-medium">
                        {movie.country.map(c => c.name).join(', ')}
                      </span>
                    </div>
                  )}
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-600">
                    <span className="text-gray-400 text-xs block">Lượt xem</span>
                    <span className="text-white font-medium">{movie.view.toLocaleString()}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-3 text-gray-300">Nội dung phim</h3>
                  <div
                    className="text-lg leading-relaxed text-gray-200"
                    dangerouslySetInnerHTML={{ __html: movie.content }}
                  />
                </div>

                {/* Cast & Director */}
                {movie.director && movie.director.length > 0 && (
                  <div className="mb-4">
                    <span className="text-gray-400">Đạo diễn: </span>
                    <span className="text-white font-medium">{movie.director.join(', ')}</span>
                  </div>
                )}
                {movie.actor && movie.actor.length > 0 && (
                  <div className="mb-4">
                    <span className="text-gray-400">Diễn viên: </span>
                    <span className="text-white font-medium">{movie.actor.slice(0, 5).join(', ')}</span>
                  </div>
                )}

                {/* Player Component */}
                <MoviePlayer movie={movie} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
