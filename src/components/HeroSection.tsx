"use client";

import Image from "next/image";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { normalizeMovie } from '@/utils/ophim';
import { resolveImageUrl } from "@/utils/ophim";
import { getYouTubeVideoId } from "@/utils/media";
import { IconChevronLeft, IconChevronRight, IconVideo } from "@/components/icons";

interface Movie {
  name: string;
  slug: string;
  origin_name: string;
  thumb_url: string;
  poster_url: string;
  year: number;
  content?: string;
  time?: string;
  episode_time?: string;
  categories?: { name: string; slug: string }[];
  countries?: { name: string; slug: string }[];
  trailer_url?: string;
  modified: {
    time: string;
  };
}



export default function HeroSection() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showTrailerPopup, setShowTrailerPopup] = useState(false);

  useEffect(() => {
    const fetchCinemaMovies = async () => {
      try {
        // Fetch danh sách phim chiếu rạp
        const response = await fetch('/api/ophim/v1/api/danh-sach/phim-chieu-rap?page=1&limit=5&sort_field=modified.time&sort_type=desc');
        const data = await response.json();
        const arr = data?.data?.items ?? data?.items ?? data?.data ?? [] as Array<Record<string, unknown>>;
        const movieItems = arr.slice(0, 5).map((item: Record<string, any>) => normalizeMovie(item?.movie || item)) as Movie[];

        // Fetch chi tiết từng phim để lấy content đầy đủ
        const detailedMovies = await Promise.all(
          movieItems.map(async (movie: Movie) => {
            try {
              // Gọi API chi tiết phim
              const detailResponse = await fetch(`/api/ophim/v1/api/phim/${movie.slug}`);
              const detailData = await detailResponse.json();
              const movieDetail = detailData?.data?.item || {};

              return {
                name: movieDetail.name || movie.name || '',
                slug: movieDetail.slug || movie.slug || '',
                origin_name: movieDetail.origin_name || movie.origin_name || '',
                thumb_url: movieDetail.thumb_url || movie.thumb_url || '',
                poster_url: movieDetail.poster_url || movie.poster_url || '',
                year: movieDetail.year || movie.year || 0,
                content: movieDetail.content || '',
                time: movieDetail.time || movie.time || '',
                categories: movieDetail.category || movie.categories || [],
                countries: movieDetail.country || movie.countries || [],
                trailer_url: movieDetail.trailer_url || '',
                modified: { time: movieDetail?.modified?.time || movie?.modified?.time || '' }
              };
            } catch (error) {
              console.error(`Error fetching detail for ${movie.slug}:`, error);
              // Fallback to basic data if detail fetch fails
              return {
                name: movie.name || '',
                slug: movie.slug || '',
                origin_name: movie.origin_name || '',
                thumb_url: movie.thumb_url || '',
                poster_url: movie.poster_url || '',
                year: movie.year || 0,
                content: '',
                time: movie.time || '',
                categories: movie.categories || [],
                countries: movie.countries || [],
                trailer_url: '',
                modified: { time: movie?.modified?.time || '' }
              };
            }
          })
        );

        setMovies(detailedMovies);
      } catch (error) {
        console.error('Error fetching cinema movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCinemaMovies();
  }, []);

  // Auto slide every 8 seconds
  useEffect(() => {
    if (movies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [movies.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  };



  // Function to extract YouTube video ID from URL


  // Function to handle trailer popup
  const handleTrailerClick = () => {
    if (currentMovie?.trailer_url) {
      setShowTrailerPopup(true);
    }
  };

  const closeTrailerPopup = () => {
    setShowTrailerPopup(false);
  };

  // Handle ESC key to close popup
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeTrailerPopup();
      }
    };

    if (showTrailerPopup) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [showTrailerPopup]);

  if (loading) {
    return (
      <section className="relative min-h-[70vh] md:min-h-[75vh] lg:min-h-[80vh] w-full bg-netflix-black">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-netflix-red"></div>
        </div>
      </section>
    );
  }

  if (movies.length === 0) {
    return (
      <section className="relative min-h-[70vh] md:min-h-[75vh] lg:min-h-[80vh] w-full bg-netflix-black">
        <div className="absolute inset-0 flex items-center justify-center text-white">
          Không có dữ liệu phim chiếu rạp
        </div>
      </section>
    );
  }

  const currentMovie = movies[currentIndex];

  return (
    <section className="relative min-h-[70vh] md:min-h-[75vh] lg:min-h-[80vh] w-full overflow-hidden">
      {/* Background Images */}
      {movies.map((movie, index) => (
        <div
          key={movie.slug}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={resolveImageUrl(movie.poster_url || movie.thumb_url)}
            alt={movie.name}
            fill
            priority={index === 0}
            className="object-cover"
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-netflix-black/80 via-netflix-black/20 to-transparent" />
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-netflix-black/60 hover:bg-netflix-black/80 text-white p-2 rounded-full opacity-0 hover:opacity-100 transition-all duration-300"
        aria-label="Previous movie"
      >
        <IconChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-netflix-black/60 hover:bg-netflix-black/80 text-white p-2 rounded-full opacity-0 hover:opacity-100 transition-all duration-300"
        aria-label="Next movie"
      >
        <IconChevronRight className="w-6 h-6" />
      </button>

      {/* Content */}
      <div className="relative z-10 min-h-[70vh] md:min-h-[75vh] lg:min-h-[80vh] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            {/* Poster */}
            <div className="flex-shrink-0 mx-auto lg:mx-0">
              <div className="relative group">
                <Image
                  src={resolveImageUrl(currentMovie.thumb_url)}
                  alt={currentMovie.name}
                  width={280}
                  height={420}
                  className="rounded-xl shadow-2xl transition-transform duration-300 group-hover:scale-105 w-[280px] h-[420px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Play Button Overlay */}
                <Link
                  href={`/phim/${currentMovie.slug}`}
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <div className="bg-netflix-red rounded-full p-4 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </Link>
              </div>
            </div>

            {/* Movie Info */}
            <div className="flex-1 text-white max-w-3xl text-center lg:text-left">
              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold mb-4 leading-tight">
                {currentMovie.name}
              </h1>

              {/* Subtitle */}
              <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-gray-300 mb-6 font-light">
                {currentMovie.origin_name} <span className="text-netflix-red">({currentMovie.year})</span>
              </h2>

              {/* Ratings - Mock data since API doesn't provide ratings */}
              <div className="flex flex-wrap items-center gap-6 mb-6 justify-center lg:justify-start">
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-500 text-black px-3 py-1 rounded-lg font-bold text-lg">
                    IMDb
                  </div>
                  <span className="text-2xl font-bold">7.5</span>
                  <span className="text-gray-400">(12,345 đánh giá)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500 text-white px-3 py-1 rounded-lg font-bold text-lg">
                    TMDb
                  </div>
                  <span className="text-2xl font-bold">8.2</span>
                  <span className="text-gray-400">(5,678 đánh giá)</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-3 mb-8 justify-center lg:justify-start">
                {currentMovie.categories && currentMovie.categories.map((cat, index) => (
                  <Link
                    key={index}
                    href={`/the-loai/${cat.slug}`}
                    className="bg-gray-800/80 hover:bg-netflix-red text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 border border-gray-600 hover:border-netflix-red"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>

              {/* Movie Info Boxes */}
              <div className="flex flex-wrap gap-3 mb-8 justify-center lg:justify-start">
                <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-600">
                  <span className="text-gray-400 text-sm">HD</span>
                </div>
                {currentMovie.time && (
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-600">
                    <span className="text-gray-400 text-sm">{currentMovie.time}</span>
                  </div>
                )}
                <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-600">
                  <span className="text-gray-400 text-sm">{currentMovie.year}</span>
                </div>
                {currentMovie.countries && currentMovie.countries.length > 0 && (
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-600">
                    <span className="text-gray-400 text-sm">
                      {currentMovie.countries.slice(0, 2).map(country => country.name).join(', ')}
                    </span>
                  </div>
                )}
                <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-600">
                  <span className="text-gray-400 text-sm">Phim chiếu rạp</span>
                </div>
              </div>

              {/* Description */}
              {currentMovie.content && (
                <div className="mb-8 text-center lg:text-left">
                  <h3 className="text-xl font-semibold mb-3 text-gray-300">Cốt truyện</h3>
                  <div
                    className="text-lg leading-relaxed text-gray-200 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: currentMovie.content }}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href={`/phim/${currentMovie.slug}`}
                  className="bg-netflix-red hover:bg-red-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center gap-3 text-base sm:text-lg shadow-lg"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Xem Ngay
                </Link>

                {/* Trailer Button - chỉ hiển thị khi có trailer */}
                {currentMovie.trailer_url && (
                  <button
                    onClick={handleTrailerClick}
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

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-netflix-white w-8'
                : 'bg-netflix-white/40 hover:bg-netflix-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Trailer Popup */}
      {showTrailerPopup && currentMovie?.trailer_url && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto"
          onClick={closeTrailerPopup}
        >
          <div
            className="relative w-full max-w-6xl bg-netflix-black rounded-xl overflow-hidden shadow-2xl border border-netflix-gray my-4 md:my-8 mx-2 md:mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeTrailerPopup}
              className="absolute top-2 right-2 md:top-4 md:right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 md:p-2 transition-colors duration-300"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Video Player */}
            <div className="aspect-video bg-netflix-black">
              {(() => {
                const videoId = getYouTubeVideoId(currentMovie.trailer_url);
                if (videoId) {
                  return (
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                      className="w-full h-full"
                      allowFullScreen
                      allow="autoplay; encrypted-media"
                      title={`${currentMovie.name} - Trailer`}
                    />
                  );
                } else {
                  return (
                    <iframe
                      src={currentMovie.trailer_url}
                      className="w-full h-full"
                      allowFullScreen
                      title={`${currentMovie.name} - Trailer`}
                    />
                  );
                }
              })()}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
