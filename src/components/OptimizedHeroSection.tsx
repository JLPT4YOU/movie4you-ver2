"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { resolveImageUrl } from "@/utils/ophim";
import { IconChevronLeft, IconChevronRight, IconVideo } from "@/components/icons";

// Lazy load trailer popup
const TrailerPopup = dynamic(
  () => import('./TrailerPopup'),
  { 
    ssr: false,
    loading: () => null
  }
) as React.ComponentType<{ trailerUrl: string; movieName: string; onClose: () => void }>;

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

export default function OptimizedHeroSection() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showTrailerPopup, setShowTrailerPopup] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Preload image function
  const preloadImage = useCallback((index: number) => {
    if (movies[index] && !imagesLoaded[index]) {
      const img = new window.Image();
      img.src = resolveImageUrl(movies[index].poster_url || movies[index].thumb_url);
      img.onload = () => {
        setImagesLoaded(prev => ({ ...prev, [index]: true }));
      };
    }
  }, [movies, imagesLoaded]);

  // Phase 1: Load first movie for fast LCP
  useEffect(() => {
    const fetchFirstMovie = async () => {
      try {
        const response = await fetch('/api/ophim/v1/api/danh-sach/phim-chieu-rap?page=1&limit=6&sort_field=modified.time&sort_type=desc');
        const data = await response.json();
        const arr = data?.data?.items ?? data?.items ?? data?.data ?? [] as Array<Record<string, unknown>>;
        
        if (arr.length === 0) {
          setLoading(false);
          return;
        }

        // Store all items for later use
        const allMovieItems = arr.slice(0, 6);
        
        // Load only the first movie initially
        const firstMovieItem = allMovieItems[0];
        const movie = (firstMovieItem as Record<string, any>)?.movie || firstMovieItem;
        
        try {
          const detailResponse = await fetch(`/api/ophim/v1/api/phim/${(movie as Record<string, any>).slug}`);
          const detailData = await detailResponse.json();
          const movieDetail = detailData?.data?.item || {};

          const firstMovie = {
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

          setMovies([firstMovie]);
          setLoading(false);
          
          // Phase 2: Load remaining movies after initial render
          if (allMovieItems.length > 1) {
            setIsLoadingMore(true);
            setTimeout(async () => {
              const remainingMovies = await Promise.all(
                allMovieItems.slice(1).map(async (item: Record<string, unknown>) => {
                  const movie = (item as Record<string, any>)?.movie || item;
                  try {
                    const detailResponse = await fetch(`/api/ophim/v1/api/phim/${(movie as Record<string, any>).slug}`);
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
                    console.error(`Error fetching detail for ${(movie as Record<string, any>).slug}:`, error);
                    return {
                      name: (movie as Record<string, any>).name || '',
                      slug: (movie as Record<string, any>).slug || '',
                      origin_name: (movie as Record<string, any>).origin_name || '',
                      thumb_url: (movie as Record<string, any>).thumb_url || '',
                      poster_url: (movie as Record<string, any>).poster_url || '',
                      year: (movie as Record<string, any>).year || 0,
                      content: '',
                      time: (movie as Record<string, any>).time || '',
                      categories: (movie as Record<string, any>).categories || [],
                      countries: (movie as Record<string, any>).countries || [],
                      trailer_url: '',
                      modified: { time: (movie as Record<string, any>)?.modified?.time || '' }
                    };
                  }
                })
              );
              
              setMovies(prev => [...prev, ...remainingMovies]);
              setIsLoadingMore(false);
            }, 100); // Small delay to ensure first paint happens
          }
        } catch (error) {
          console.error(`Error fetching first movie detail:`, error);
          // Fallback to basic data
          const firstMovie = {
            name: (movie as Record<string, any>).name || '',
            slug: (movie as Record<string, any>).slug || '',
            origin_name: (movie as Record<string, any>).origin_name || '',
            thumb_url: (movie as Record<string, any>).thumb_url || '',
            poster_url: (movie as Record<string, any>).poster_url || '',
            year: (movie as Record<string, any>).year || 0,
            content: '',
            time: (movie as Record<string, any>).time || '',
            categories: (movie as Record<string, any>).categories || [],
            countries: (movie as Record<string, any>).countries || [],
            trailer_url: '',
            modified: { time: (movie as Record<string, any>)?.modified?.time || '' }
          };
          setMovies([firstMovie]);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching cinema movies:', error);
        setLoading(false);
      }
    };

    fetchFirstMovie();
  }, []);

  // Preload next image when index changes
  useEffect(() => {
    if (movies.length > 0) {
      const nextIndex = (currentIndex + 1) % movies.length;
      preloadImage(nextIndex);
    }
  }, [currentIndex, movies.length, preloadImage]);

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

  const handleTrailerClick = () => {
    if (currentMovie?.trailer_url) {
      setShowTrailerPopup(true);
    }
  };

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
      {/* Background Images with lazy loading */}
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
            sizes="100vw"
            quality={75}
            className="object-cover"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
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
                  sizes="280px"
                  quality={90}
                  className="rounded-xl shadow-2xl transition-transform duration-300 group-hover:scale-105 w-[280px] h-[420px] object-cover"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  loading="eager"
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
              <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold mb-4 leading-tight">
                {currentMovie.name}
              </h1>

              <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-gray-300 mb-6 font-light">
                {currentMovie.origin_name} <span className="text-netflix-red">({currentMovie.year})</span>
              </h2>

              {/* Tags */}
              <div className="flex flex-wrap gap-3 mb-8 justify-center lg:justify-start">
                {currentMovie.categories && currentMovie.categories.slice(0, 4).map((cat, index) => (
                  <Link
                    key={index}
                    href={`/the-loai/${cat.slug}`}
                    className="bg-gray-800/80 hover:bg-netflix-red text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 border border-gray-600 hover:border-netflix-red"
                  >
                    {cat.name}
                  </Link>
                ))}
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
        {/* Loading indicator for remaining movies */}
        {isLoadingMore && (
          <div className="flex items-center gap-1 ml-2">
            <div className="w-2 h-2 bg-netflix-white/40 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-netflix-white/40 rounded-full animate-pulse animation-delay-200" />
            <div className="w-2 h-2 bg-netflix-white/40 rounded-full animate-pulse animation-delay-400" />
          </div>
        )}
      </div>

      {/* Lazy loaded Trailer Popup */}
      {showTrailerPopup && currentMovie?.trailer_url && (
        <TrailerPopup
          trailerUrl={currentMovie.trailer_url}
          movieName={currentMovie.name}
          onClose={() => setShowTrailerPopup(false)}
        />
      )}
    </section>
  );
}
