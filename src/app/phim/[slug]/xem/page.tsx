'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MovieDetail } from '@/types/movie';
import Header from '@/components/Header';
import { WatchHistoryManager } from '@/utils/watchHistory';



export default function WatchPage() {
  const params = useParams();

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedServer, setSelectedServer] = useState(0);
  const [selectedEpisode, setSelectedEpisode] = useState(0);
  const [alternativeSources, setAlternativeSources] = useState<any>({});
  const [selectedSource, setSelectedSource] = useState<'ophim' | 'phimapi' | 'nguonc' | 'mappletv' | 'videasy' | 'vidlink'>('ophim');

  const videoRef = useRef<HTMLIFrameElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      if (!params.slug) return;
      
      try {
        // Fetch from Ophim (primary source)
        const ophimRes = await fetch(`/api/ophim/v1/api/phim/${params.slug}`);
        const ophimData = await ophimRes.json();
        
        // Ophim API only - no fallback needed
        
        if (ophimData.status === 'success' && ophimData.data?.item) {

          setMovie(ophimData.data.item);
        }
        
        // Fetch from alternative sources
        Promise.all([
          fetch(`/api/phimapi/${params.slug}`).then(r => r.json()).catch(() => null),
          fetch(`/api/nguonc/${params.slug}`).then(r => r.json()).catch(() => null)
        ]).then(([phimapi, nguonc]) => {
          setAlternativeSources({ phimapi, nguonc });
        });
      } catch (error) {
        console.error('Error fetching movie:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [params.slug]);

  // Save watch history when episode changes or video plays
  useEffect(() => {
    if (!movie || !params.slug) return;

    // Get current episode info based on selected source
    let episodes: any[] = [];
    if (selectedSource === 'ophim' && movie?.episodes?.[selectedServer]) {
      episodes = movie.episodes[selectedServer].server_data || [];
    } else if (selectedSource === 'phimapi' && alternativeSources.phimapi?.episodes?.[selectedServer]) {
      episodes = alternativeSources.phimapi.episodes[selectedServer].server_data || [];
    } else if (selectedSource === 'nguonc' && alternativeSources.nguonc?.movie?.episodes?.[selectedServer]) {
      episodes = alternativeSources.nguonc.movie.episodes[selectedServer].items || [];
    } else if (selectedSource === 'mappletv') {
      episodes = [{ name: 'Full', slug: 'full' }];
    }

    const episode = episodes[selectedEpisode];
    if (!episode && selectedSource !== 'mappletv') return;

    // Save to watch history
    const saveHistory = () => {
      // Get poster URL from movie data
      let posterUrl = '';
      if (movie.thumb_url) {
        posterUrl = movie.thumb_url.replace('https://img.ophim.live/uploads/movies/', '');
      } else if (movie.poster_url) {
        posterUrl = movie.poster_url.replace('https://img.ophim.live/uploads/movies/', '');
      }

      WatchHistoryManager.saveProgress({
        movieId: movie._id,
        movieName: movie.name,
        movieSlug: movie.slug,
        posterUrl: posterUrl,
        episodeIndex: selectedEpisode,
        episodeName: selectedSource === 'mappletv' ? 'MappleTV' : (episode?.name || `Tập ${selectedEpisode + 1}`),
        serverIndex: selectedServer,
        currentTime: 0, // Start at 0 for iframe (can't access actual time)
        duration: 1, // Set to 1 to avoid division by zero
      });


    };

    // Save immediately when episode is selected
    saveHistory();

    // Also save periodically while watching (every 30 seconds)
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = setInterval(() => {
      saveHistory();
    }, 30000); // Save every 30 seconds

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [movie, selectedEpisode, selectedServer, selectedSource, alternativeSources, params.slug]);

  const getCurrentVideoSource = () => {
    let videoSource = null;
    let videoTitle = '';

    if (selectedSource === 'ophim' && movie) {
      const episode = movie.episodes?.[selectedServer]?.server_data?.[selectedEpisode];
      if (episode) {
        videoSource = episode.link_embed;
        videoTitle = `${movie.name} - ${episode.name}`;
      }
    } else if (selectedSource === 'phimapi' && alternativeSources.phimapi) {
      const episodes = alternativeSources.phimapi.episodes;
      if (episodes?.[selectedServer]) {
        const episode = episodes[selectedServer].server_data?.[selectedEpisode];
        if (episode) {
          videoSource = episode.link_embed || episode.link_m3u8;
          videoTitle = `${movie?.name} - Tập ${episode.name}`;
        }
      }
    } else if (selectedSource === 'nguonc' && alternativeSources.nguonc) {
      const episodes = alternativeSources.nguonc.movie?.episodes;
      if (episodes?.[selectedServer]) {
        const episode = episodes[selectedServer].items?.[selectedEpisode];
        if (episode) {
          videoSource = episode.embed || episode.m3u8;
          videoTitle = `${movie?.name} - Tập ${episode.name}`;
        }
      }
    } else if (selectedSource === 'mappletv' && movie?.tmdb?.id) {
      const tmdbType = movie.tmdb.type === 'movie' ? 'movie' : 'tv';
      const queryParams = "nextEpisode=true&autoplayNextEpisode=true&episodeSelector=true&overlay=true";
      if (tmdbType === 'movie') {
        videoSource = `https://mappletv.uk/watch/movie/${movie.tmdb.id}?${queryParams}`;
        videoTitle = `${movie.name} - MappleTV`;
      } else {
        // For TV shows, we need season and episode
        const season = movie.tmdb.season || 1; // Default to season 1 if not provided
        const episodeNumber = selectedEpisode + 1;
        videoSource = `https://mappletv.uk/watch/tv/${movie.tmdb.id}-${season}-${episodeNumber}?${queryParams}`;
        videoTitle = `${movie.name} - MappleTV - Tập ${episodeNumber}`;
      }
    } else if (selectedSource === 'videasy' && movie?.tmdb?.id) {
      const tmdbType = movie.tmdb.type === 'movie' ? 'movie' : 'tv';
      if (tmdbType === 'movie') {
        videoSource = `https://player.videasy.net/movie/${movie.tmdb.id}`;
        videoTitle = `${movie.name} - Videasy`;
      } else {
        // For TV shows, we need season and episode
        const season = movie.tmdb.season || 1; // Default to season 1 if not provided
        const episodeNumber = selectedEpisode + 1;
        videoSource = `https://player.videasy.net/tv/${movie.tmdb.id}/${season}/${episodeNumber}`;
        videoTitle = `${movie.name} - Videasy - Tập ${episodeNumber}`;
      }
    } else if (selectedSource === 'vidlink' && movie?.tmdb?.id) {
      const tmdbType = movie.tmdb.type === 'movie' ? 'movie' : 'tv';
      if (tmdbType === 'movie') {
        videoSource = `https://vidlink.pro/movie/${movie.tmdb.id}`;
        videoTitle = `${movie.name} - VidLink`;
      } else {
        // For TV shows, we need season and episode
        const season = movie.tmdb.season || 1; // Default to season 1 if not provided
        const episodeNumber = selectedEpisode + 1;
        videoSource = `https://vidlink.pro/tv/${movie.tmdb.id}/${season}/${episodeNumber}`;
        videoTitle = `${movie.name} - VidLink - Tập ${episodeNumber}`;
      }
    }

    return { videoSource, videoTitle };
  };

  const getServerList = () => {
    const servers: { name: string; source: string; index: number }[] = [];
    let serverCounter = 0;

    // Main source servers
    if (movie?.episodes) {
      movie.episodes.forEach((ep, idx) => {
        const serverName = ep.server_name;
        const displayName = getServerLanguage(serverName, serverCounter++);
        servers.push({ name: displayName, source: 'ophim', index: idx });
      });
    }

    // PhimAPI servers
    if (alternativeSources.phimapi?.episodes) {
      alternativeSources.phimapi.episodes.forEach((ep: any, idx: number) => {
        const serverName = ep.server_name;
        const displayName = getServerLanguage(serverName, serverCounter++);
        servers.push({ name: displayName, source: 'phimapi', index: idx });
      });
    }

    // NguonC servers
    if (alternativeSources.nguonc?.movie?.episodes) {
      alternativeSources.nguonc.movie.episodes.forEach((ep: any, idx: number) => {
        const serverName = ep.server_name;
        const displayName = getServerLanguage(serverName, serverCounter++);
        servers.push({ name: displayName, source: 'nguonc', index: idx });
      });
    }

    // MappleTV server (only if TMDB ID is available)
    if (movie?.tmdb?.id) {
      servers.push({ name: 'MappleTV', source: 'mappletv', index: 0 });
    }

    // Videasy server (only if TMDB ID is available)
    if (movie?.tmdb?.id) {
      servers.push({ name: 'Videasy', source: 'videasy', index: 0 });
    }

    // VidLink server (only if TMDB ID is available)
    if (movie?.tmdb?.id) {
      servers.push({ name: 'VidLink', source: 'vidlink', index: 0 });
    }

    return servers;
  };

  const getEpisodeList = () => {
    if (selectedSource === 'ophim' && movie?.episodes?.[selectedServer]) {
      return movie.episodes[selectedServer].server_data || [];
    } else if (selectedSource === 'phimapi' && alternativeSources.phimapi?.episodes?.[selectedServer]) {
      return alternativeSources.phimapi.episodes[selectedServer].server_data || [];
    } else if (selectedSource === 'nguonc' && alternativeSources.nguonc?.movie?.episodes?.[selectedServer]) {
      return alternativeSources.nguonc.movie.episodes[selectedServer].items || [];
    } else if (selectedSource === 'mappletv' || selectedSource === 'videasy' || selectedSource === 'vidlink') {
      if (movie?.tmdb?.type === 'tv') {
        // For TV shows, use the episode list from the primary source (ophim)
        // to allow episode selection. We assume the first server has the most complete list.
        return movie?.episodes?.[0]?.server_data || [];
      } else {
        // For movies, it's a single player
        return [{ name: 'Full', slug: 'full' }];
      }
    }
    return [];
  };

  const episodes = getEpisodeList();

  const getServerLanguage = (serverName: string, serverIndex: number) => {
    const name = serverName.toLowerCase();
    if (name.includes('vietsub')) return `Vietsub #${serverIndex + 1}`;
    if (name.includes('lồng tiếng') || name.includes('long tieng')) return `Lồng tiếng #${serverIndex + 1}`;
    if (name.includes('thuyết minh') || name.includes('thuyet minh')) return `Thuyết minh #${serverIndex + 1}`;
    // Default based on common patterns
    if (name.includes('#1')) return `Vietsub #${serverIndex + 1}`;
    if (name.includes('#2')) return `Thuyết minh #${serverIndex + 1}`;
    return `Server #${serverIndex + 1}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-white">Đang tải...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-white">Không tìm thấy phim</div>
      </div>
    );
  }

  const { videoSource, videoTitle } = getCurrentVideoSource();
  const servers = getServerList();

  return (
    <div className="min-h-screen bg-netflix-black">
      <Header />
      
      <div className="pt-16 pb-8">
        <div className="container mx-auto px-4">
          {/* Title and Back button */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-white">{movie.name}</h1>
            <Link 
              href={`/phim/${movie.slug}`}
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Quay lại
            </Link>
          </div>

          {/* Video Player */}
          <div className="mb-6">
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              {videoSource ? (
                <iframe
                  ref={videoRef}
                  src={videoSource}
                  className="w-full h-full"
                  allowFullScreen
                  title={videoTitle}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>Chọn server và tập phim để xem</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Server Selection */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-3">Chọn Server:</h2>
            <div className="flex flex-wrap gap-2">
              {/* Display all servers */}
              {servers.map((server) => (
                <button
                  key={`${server.source}-${server.index}`}
                  onClick={() => {
                    setSelectedSource(server.source as 'ophim' | 'phimapi' | 'nguonc' | 'mappletv' | 'videasy' | 'vidlink');
                    setSelectedServer(server.index);
                    setSelectedEpisode(0);
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedSource === server.source && selectedServer === server.index
                      ? 'bg-netflix-red text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {server.name}
                </button>
              ))}
            </div>
          </div>

          {/* Episode Selection */}
          {episodes.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-3">Chọn Tập:</h2>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                {episodes.map((episode: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedEpisode(idx)}
                    className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                      selectedEpisode === idx
                        ? 'bg-netflix-red text-white' 
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}>
                    {episode.name || `Tập ${idx + 1}`}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
