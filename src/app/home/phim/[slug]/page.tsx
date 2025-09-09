'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MovieDetailResponse, MovieDetail } from '@/types/movie';
import { resolveImageUrl } from '@/utils/ophim';
import { getYouTubeVideoId } from '@/utils/media';
import { IconVideo } from '@/components/icons';
import Header from '@/components/Header';


export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        // Fetch from Ophim API
        const response = await fetch(`/api/ophim/v1/api/phim/${params.slug}`);
        const data: MovieDetailResponse = await response.json();
        
        if (data.status === 'success' && data.data?.item) {
          setMovie(data.data.item);
          
          // Inject structured data for SEO
          const structuredData = {
            '@context': 'https://schema.org',
            '@type': 'Movie',
            name: data.data.item.name,
            alternateName: data.data.item.origin_name,
            dateCreated: data.data.item.year,
            description: data.data.item.content,
            director: data.data.item.director,
            actor: data.data.item.actor,
            image: resolveImageUrl(data.data.item.poster_url),
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: data.data.item.tmdb?.vote_average || 0,
              ratingCount: data.data.item.tmdb?.vote_count || 0,
              bestRating: 10,
              worstRating: 0
            }
          };
          
          const script = document.createElement('script');
          script.type = 'application/ld+json';
          script.text = JSON.stringify(structuredData);
          document.head.appendChild(script);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovie();
  }, [params.slug]);

  const handleWatchMovie = () => {
    router.push(`/home/phim/${params.slug}/xem`);
  };

  const handleWatchTrailer = () => {
    if (movie?.trailer_url) {
      setShowTrailer(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-white">Movie not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-black">
      <Header />
      
      {/* Hero Section */}
      <div className="relative min-h-screen">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={resolveImageUrl(movie.poster_url, 1920, 90)}
            alt={movie.name}
            fill
            sizes="100vw"
            className="object-cover"
            quality={90}
            priority
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
                    src={resolveImageUrl(movie.thumb_url, 400, 90)}
                    alt={movie.name}
                    width={280}
                    height={420}
                    quality={90}
                    className="rounded-xl shadow-2xl transition-transform duration-300 group-hover:scale-105 w-[280px] h-[420px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Play Button Overlay */}
                  <button
                    onClick={handleWatchMovie}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <div className="bg-netflix-red rounded-full p-4 shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </button>
                </div>
              </div>

              {/* Movie Info */}
              <div className="flex-1 text-white max-w-3xl text-center lg:text-left">
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
                  <div className="flex flex-wrap items-center gap-6 mb-6 justify-center lg:justify-start">
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
                        {movie.tmdb.season && (
                          <span className="text-gray-400">• Season {movie.tmdb.season}</span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-3 mb-8 justify-center lg:justify-start">
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

                {/* Movie Info */}
                <div className="flex flex-wrap gap-3 mb-8 justify-center lg:justify-start">
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-600">
                    <span className="text-gray-400 text-sm">{movie.quality}</span>
                  </div>

                  <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-600">
                    <span className="text-gray-400 text-sm">{movie.time}</span>
                  </div>

                  <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-600">
                    <span className="text-gray-400 text-sm">{movie.episode_current}/{movie.episode_total} tập</span>
                  </div>

                  <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-600">
                    <span className="text-gray-400 text-sm">{movie.year}</span>
                  </div>

                  {movie.country && movie.country.length > 0 && (
                    <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-600">
                      <span className="text-gray-400 text-sm">
                        {movie.country.map((country, index) => (
                          <span key={country.id}>
                            <Link
                              href={`/quoc-gia/${country.slug}`}
                              className="hover:text-netflix-red transition-colors"
                            >
                              {country.name}
                            </Link>
                            {index < movie.country.length - 1 && ", "}
                          </span>
                        ))}
                      </span>
                    </div>
                  )}

                  <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-600">
                    <span className="text-gray-400 text-sm">{movie.view.toLocaleString()} lượt xem</span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8 text-center lg:text-left">
                  <h3 className="text-xl font-semibold mb-3 text-gray-300">Cốt truyện</h3>
                  <div
                    className="text-lg leading-relaxed text-gray-200 line-clamp-4"
                    dangerouslySetInnerHTML={{ __html: movie.content }}
                  />
                </div>

                {/* Cast & Director - Simplified */}
                <div className="mb-8 text-center lg:text-left">
                  {movie.director && movie.director.length > 0 && (
                    <div className="mb-4">
                      <span className="text-gray-400 text-sm">Đạo diễn: </span>
                      <span className="text-white font-medium">{movie.country.map((country) => country.name).slice(0, 2).join(', ')}</span>
                    </div>
                  )}

                  {movie.actor && movie.actor.length > 0 && (
                    <div className="mb-4">
                      <span className="text-gray-400 text-sm">Diễn viên: </span>
                      <span className="text-white font-medium">
                        {movie.actor.slice(0, 3).join(', ')}
                        {movie.actor.length > 3 && '...'}
                      </span>
                    </div>
                  )}
                </div>


                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button
                    onClick={handleWatchMovie}
                    className="bg-netflix-red text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    Xem Ngay
                  </button>

                  {movie.trailer_url && (
                    <button
                      onClick={handleWatchTrailer}
                      className="bg-gray-800/80 hover:bg-gray-700 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg font-semibold transition-colors duration-300 flex items-center gap-2 sm:gap-3 text-sm sm:text-base border border-gray-600 hover:border-gray-500 justify-center"
                    >
                      <IconVideo className="w-5 h-5 sm:w-6 sm:h-6" />
                      Trailer
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && movie?.trailer_url && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowTrailer(false)}
        >
          <div
            className="relative bg-black rounded-lg overflow-hidden w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeVideoId(movie.trailer_url)}?autoplay=1`}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                title={`${movie.name} - Trailer`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
