'use client';

import { useState, useEffect } from 'react';
import { MovieDetail } from '@/types/movie';
import { WatchHistoryManager } from '@/utils/watchHistory';
import { getYouTubeVideoId } from '@/utils/media';
import { IconVideo } from '@/components/icons';

interface MoviePlayerProps {
  movie: MovieDetail;
}

export default function MoviePlayer({ movie }: MoviePlayerProps) {
  const [selectedServer, setSelectedServer] = useState(0);
  const [selectedEpisode, setSelectedEpisode] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false);
  const [isWatchingTrailer, setIsWatchingTrailer] = useState(false);

  useEffect(() => {
    // Load watch history
    const latestEpisode = WatchHistoryManager.getLatestEpisode(movie._id);
    if (latestEpisode) {
      setSelectedServer(latestEpisode.serverIndex);
      setSelectedEpisode(latestEpisode.episodeIndex);
    }
  }, [movie._id]);

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
  }, [showPlayer]);

  return (
    <>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleWatchNowClick}
          className="bg-netflix-red hover:bg-red-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center gap-3 text-base sm:text-lg shadow-lg"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
          Xem Ngay
        </button>

        {movie.trailer_url && (
          <button
            onClick={handleTrailerClick}
            className="bg-gray-800/80 hover:bg-gray-700 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg font-semibold transition-colors duration-300 flex items-center gap-2 sm:gap-3 text-sm sm:text-base border border-gray-600 hover:border-gray-500 justify-center"
          >
            <IconVideo className="w-5 h-5 sm:w-6 sm:h-6" />
            Trailer
          </button>
        )}
      </div>

      {/* Video Player Popup */}
      {showPlayer && (movie?.episodes?.[0]?.server_data?.[0]?.link_embed || currentEpisode?.link_embed || movie?.trailer_url) && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6"
          onClick={closePlayer}
        >
          <div
            className="relative w-full max-w-5xl bg-netflix-black rounded-lg overflow-hidden shadow-2xl border border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closePlayer}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full p-2 transition-all duration-200 hover:scale-110"
              aria-label="Đóng trình phát video"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Video Player */}
            <div className="aspect-video bg-black">
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
              <div className="p-4 sm:p-5 border-t border-gray-800 bg-netflix-black">
                <div className="mb-3">
                  <h3 className="text-white font-semibold text-sm sm:text-base">Chọn tập phim</h3>
                </div>

                {/* Server Selection */}
                {movie.episodes.length > 1 && (
                  <div className="mb-3">
                    <div className="flex gap-2 flex-wrap">
                      {movie.episodes.map((server, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedServer(index);
                            setSelectedEpisode(0);
                          }}
                          className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 ${
                            selectedServer === index
                              ? 'bg-netflix-red text-white shadow-lg'
                              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          {server.server_name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Episode Grid */}
                <div className="max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                  <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2 pr-2">
                    {movie.episodes[selectedServer]?.server_data.map((episode, index) => {
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
                          className={`relative h-9 px-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-105 overflow-hidden ${
                            selectedEpisode === index
                              ? 'bg-netflix-red text-white shadow-lg ring-2 ring-netflix-red ring-opacity-50'
                              : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                          }`}
                        >
                          {hasProgress && (
                            <div
                              className="absolute bottom-0 left-0 h-0.5 bg-yellow-400 transition-all duration-300"
                              style={{ width: `${progress.progress}%` }}
                            />
                          )}
                          <span className="relative z-10">{episode.name}</span>
                          {progress && progress.progress > 90 && (
                            <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
