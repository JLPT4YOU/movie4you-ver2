'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MovieDetailResponse, MovieDetail } from '@/types/movie';
import { resolveImageUrl } from '@/utils/ophim';
import { WatchHistoryManager } from '@/utils/watchHistory';
import { getYouTubeVideoId } from '@/utils/media';
import { IconVideo } from '@/components/icons';
import Header from '@/components/Header';
import { generateMovieSchema, generateBreadcrumbSchema } from '@/utils/seo';

export default function MovieDetailPage() {
  const params = useParams();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedServer, setSelectedServer] = useState(0);
  const [selectedEpisode, setSelectedEpisode] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false);
  const [isWatchingTrailer, setIsWatchingTrailer] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`/api/ophim/v1/api/phim/${params.slug}`);
        const data: MovieDetailResponse = await response.json();
        
        if (data.status === 'success' && data.data?.item) {
          setMovie(data.data.item);
          
          // Inject structured data into head
          const url = `${window.location.origin}/phim/${params.slug}`;
          const movieSchema = generateMovieSchema(data.data.item, url);
          const breadcrumbSchema = generateBreadcrumbSchema([
            { name: 'Trang chủ', url: window.location.origin },
            { name: data.data.item.type === 'series' ? 'Phim bộ' : 'Phim lẻ', url: `${window.location.origin}/danh-sach/${data.data.item.type}` },
            { name: data.data.item.name, url: url }
          ]);
          
          // Add structured data scripts
          const movieScript = document.createElement('script');
          movieScript.type = 'application/ld+json';
          movieScript.innerHTML = JSON.stringify(movieSchema);
          document.head.appendChild(movieScript);
          
          const breadcrumbScript = document.createElement('script');
          breadcrumbScript.type = 'application/ld+json';
          breadcrumbScript.innerHTML = JSON.stringify(breadcrumbSchema);
          document.head.appendChild(breadcrumbScript);
        }
      } catch (error) {
        console.error('Error fetching movie:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [params.slug]);

  useEffect(() => {
    // Load watch history
    if (movie) {
      const latestEpisode = WatchHistoryManager.getLatestEpisode(movie._id);
      if (latestEpisode) {
        setSelectedServer(latestEpisode.serverIndex);
        setSelectedEpisode(latestEpisode.episodeIndex);
      }
    }
  }, [movie]);

  const currentEpisode = movie?.episodes?.[selectedServer]?.server_data?.[selectedEpisode];

  const handleWatchNowClick = () => {
    if (movie && movie.episodes && movie.episodes.length > 0) {
      const firstEpisode = movie.episodes[0]?.server_data?.[0];
      if (firstEpisode?.link_embed) {
        setIsWatchingTrailer(false);
        setShowPlayer(true);
        return;
      }
    }

    if (movie?.trailer_url) {
      setIsWatchingTrailer(true);
      setShowPlayer(true);
    }
  };

  const handleTrailerClick = () => {
    if (movie?.trailer_url) {
      setIsWatchingTrailer(true);
      setShowPlayer(true);
    }
  };

  const closePlayer = () => {
    if (movie && currentEpisode && !isWatchingTrailer) {
      WatchHistoryManager.saveProgress({
        movieId: movie._id,
        movieName: movie.name,
        movieSlug: movie.slug,
        posterUrl: movie.thumb_url,
        episodeIndex: selectedEpisode,
        episodeName: currentEpisode.name,
        serverIndex: selectedServer,
        currentTime: 50,
        duration: 100
      });
    }
    setShowPlayer(false);
  };

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePlayer();
      }
    };

    if (showPlayer) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [showPlayer, closePlayer]);

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
            src={resolveImageUrl(movie.poster_url)}
            alt={movie.name}
            fill
            className="object-cover"
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
                    src={resolveImageUrl(movie.thumb_url)}
                    alt={movie.name}
                    width={280}
                    height={420}
                    className="rounded-xl shadow-2xl transition-transform duration-300 group-hover:scale-105 w-[280px] h-[420px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Play Button Overlay */}
                  <button
                    onClick={() => {
                      // Save to watch history when closing (simple view tracking)
                      if (movie) {
                        WatchHistoryManager.saveProgress({
                          movieId: movie._id,
                          movieName: movie.name,
                          movieSlug: movie.slug,
                          posterUrl: movie.thumb_url,
                          episodeIndex: 0,
                          episodeName: '',
                          serverIndex: 0,
                          currentTime: 50, // Default 50% progress for any watched video
                          duration: 100
                        });
                      }
                    }}
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
                  {movie.category?.map((cat: any) => (
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
                      <span className="text-white font-medium">{movie.country.map((country: any, index: number) => country.name).slice(0, 2).join(', ')}</span>
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
                    onClick={handleWatchNowClick}
                    className="bg-netflix-red hover:bg-red-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center gap-3 text-base sm:text-lg shadow-lg">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    Xem Ngay
                  </button>

                  {movie.trailer_url && (
                    <button
                      onClick={handleTrailerClick}
                      className="bg-gray-800/80 hover:bg-gray-700 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg font-semibold transition-colors duration-300 flex items-center gap-2 sm:gap-3 text-sm sm:text-base border border-gray-600 hover:border-gray-500 justify-center">
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

      {/* Video Popup */}
      {showPlayer && (movie?.episodes?.[0]?.server_data?.[0]?.link_embed || currentEpisode?.link_embed || movie?.trailer_url) && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closePlayer}
        >
          <div
            className="relative w-full max-w-6xl bg-netflix-black rounded-xl overflow-hidden shadow-2xl border border-netflix-gray"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closePlayer}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Video Player */}
            <div className="aspect-video bg-netflix-black">
              {(() => {
                if (isWatchingTrailer && movie?.trailer_url) {
                  const videoId = getYouTubeVideoId(movie.trailer_url);
                  if (videoId) {
                    return (
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                        className="w-full h-full"
                        allowFullScreen
                        allow="autoplay; encrypted-media"
                        title={`${movie.name} - Trailer`}
                      />
                    );
                  } else {
                    return (
                      <iframe
                        src={movie.trailer_url}
                        className="w-full h-full"
                        allowFullScreen
                        title={`${movie.name} - Trailer`}
                      />
                    );
                  }
                }

                if (!isWatchingTrailer) {
                  let videoSource = null;
                  let videoTitle = '';

                  if (currentEpisode?.link_embed) {
                    videoSource = currentEpisode.link_embed;
                    videoTitle = `${movie.name} - Tập ${currentEpisode.name}`;
                  } else if (movie?.episodes?.[0]?.server_data?.[0]?.link_embed) {
                    const firstEpisode = movie.episodes[0].server_data[0];
                    videoSource = firstEpisode.link_embed;
                    videoTitle = `${movie.name}${firstEpisode.name !== 'Full' ? ` - Tập ${firstEpisode.name}` : ''}`;
                  }

                  if (videoSource) {
                    return (
                      <iframe
                        src={videoSource}
                        className="w-full h-full"
                        allowFullScreen
                        title={videoTitle}
                      />
                    );
                  }
                }

                return null;
              })()}
            </div>

            {/* Episode Selection */}
            {!isWatchingTrailer && movie.episodes && movie.episodes.length > 0 && movie.type !== 'single' &&
             movie.episodes[0]?.server_data && movie.episodes[0].server_data.length > 1 && (
              <div className="p-5 border-t border-netflix-gray bg-netflix-black">
                <div className="mb-4">
                  <h3 className="text-white font-medium text-base">Chọn tập phim</h3>
                </div>

                {/* Server Selection */}
                {movie.episodes.length > 1 && (
                  <div className="mb-4">
                    <div className="flex gap-3">
                      {movie.episodes.map((server: any, index: number) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedServer(index);
                            setSelectedEpisode(0);
                          }}
                          className={`px-4 py-2 rounded text-sm font-medium transition-all duration-300 ${
                            selectedServer === index
                              ? 'bg-netflix-red text-white'
                              : 'bg-netflix-gray text-gray-300 hover:bg-netflix-light-gray'
                          }`}
                        >
                          {server.server_name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Episode Grid */}
                <div className="flex gap-2 flex-wrap max-h-24 overflow-y-auto">
                  {movie.episodes[selectedServer]?.server_data.map((episode: any, index: number) => {
                    const progress = movie ? WatchHistoryManager.getProgress(movie._id, index, selectedServer) : null;
                    const hasProgress = progress && progress.progress > 5;

                    return (
                      <button
                        key={index}
                        onClick={() => {
                          if (currentEpisode && movie) {
                            WatchHistoryManager.saveProgress({
                              movieId: movie._id,
                              movieName: movie.name,
                              movieSlug: movie.slug,
                              posterUrl: movie.thumb_url,
                              episodeIndex: index,
                              episodeName: episode.name,
                              serverIndex: selectedServer,
                              currentTime: 15,
                              duration: 100
                            });
                          }
                          setSelectedEpisode(index);
                        }}
                        className={`relative min-w-[40px] h-10 px-3 rounded text-sm font-medium transition-all duration-300 hover:scale-105 overflow-hidden ${
                          selectedEpisode === index
                            ? 'bg-netflix-red text-white shadow-lg'
                            : 'bg-netflix-gray text-gray-300 hover:bg-netflix-light-gray hover:text-white'
                        }`}
                      >
                        {hasProgress && (
                          <div
                            className="absolute bottom-0 left-0 h-1 bg-yellow-400 transition-all duration-300"
                            style={{ width: `${progress.progress}%` }}
                          />
                        )}
                        <span className="relative z-10">{episode.name}</span>
                        {progress && progress.progress > 90 && (
                          <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
