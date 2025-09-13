'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MovieDetail } from '@/types/movie';
import Header from '@/components/Header';
import { WatchHistoryManager } from '@/utils/watchHistory';
import { useAuth } from '@/contexts/AuthContext';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with Vidstack
const VideoPlayer = dynamic(() => import('@/components/VideoPlayer'), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-video bg-black rounded-lg flex items-center justify-center">
      <div className="text-gray-400">Đang tải player...</div>
    </div>
  ),
});

// Ad Blocker Notification Component
const AdBlockerNotification = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Ad Server Notice</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="text-gray-300 mb-4">
          <p className="mb-3">
            This server contains advertisements. Please install an ad blocker for the best experience.
          </p>
          <p className="mb-3">
            Visit: <a href="https://adguard-dns.io/en/public-dns.html" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">https://adguard-dns.io/en/public-dns.html</a>
          </p>
          <p>
            Choose option 2 and follow the instructions for your device.
          </p>
          <p className="mt-3 text-sm text-gray-400">
            Thank you!
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};



export default function WatchPage() {
  const params = useParams();
  const { user } = useAuth();

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedServer, setSelectedServer] = useState(0);
  const [selectedEpisode, setSelectedEpisode] = useState(-1); // Start with -1 to indicate not initialized
  type PhimApiEpisode = { name?: string; link_embed?: string; link_m3u8?: string };
  type PhimApiData = { episodes?: Array<{ server_name?: string; server_data?: PhimApiEpisode[] }> } | null;
  type NguonCEpisode = { name?: string; embed?: string };
  type NguonCData = { movie?: { episodes?: Array<{ server_name?: string; items?: NguonCEpisode[] }> } } | null;
  const [alternativeSources, setAlternativeSources] = useState<{ phimapi: PhimApiData; nguonc: NguonCData }>({ phimapi: null, nguonc: null });
  const [selectedSource, setSelectedSource] = useState<'ophim' | 'phimapi' | 'nguonc' | 'mappletv' | 'videasy' | 'vidlink' | 'vidfast'>('ophim');
  const [showAdNotification, setShowAdNotification] = useState(false);
  const [playerKey, setPlayerKey] = useState(0); // Force re-render of player
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [savedStartTime, setSavedStartTime] = useState(0);

  const videoRef = useRef<HTMLIFrameElement>(null);
  const initialSaveDoneRef = useRef(false);
  const lastPeriodicSaveAtRef = useRef(0); // ms timestamp for throttled periodic save
  // removed unused initializedFromHistoryRef

  const saveHistory = useCallback((overrides?: {
    source?: 'ophim' | 'phimapi' | 'nguonc' | 'mappletv' | 'videasy' | 'vidlink' | 'vidfast';
    serverIndex?: number;
    episodeIndex?: number;
    currentTime?: number;
    duration?: number;
  }) => {
    if (!movie) return;

    const source = overrides?.source ?? selectedSource;
    const serverIndex = overrides?.serverIndex ?? selectedServer;
    const episodeIndex = overrides?.episodeIndex ?? selectedEpisode;

    let episodes: Array<PhimApiEpisode | NguonCEpisode> = [];
    if (source === 'ophim' && movie?.episodes?.[serverIndex]) {
      episodes = movie.episodes[serverIndex].server_data || [];
    } else if (source === 'phimapi' && alternativeSources.phimapi?.episodes?.[serverIndex]) {
      episodes = alternativeSources.phimapi.episodes[serverIndex].server_data || [];
    } else if (source === 'nguonc' && alternativeSources.nguonc?.movie?.episodes?.[serverIndex]) {
      episodes = alternativeSources.nguonc.movie.episodes[serverIndex].items || [];
    } else if (source === 'mappletv' || source === 'videasy' || source === 'vidlink' || source === 'vidfast') {
      episodes = [{ name: 'Full' }];
    }

    const episode = episodes[episodeIndex];
    if (!episode && source !== 'mappletv' && source !== 'videasy' && source !== 'vidlink' && source !== 'vidfast') return;

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
      episodeIndex: episodeIndex,
      episodeName: source === 'mappletv' ? 'MappleTV' : (episode?.name || `Tập ${episodeIndex + 1}`),
      serverIndex: serverIndex,
      currentTime: overrides?.currentTime ?? currentPlaybackTime,
      duration: overrides?.duration ?? videoDuration, // Don't fallback to 1, keep 0 if no duration
    }, user?.id);
  }, [movie, selectedSource, selectedServer, selectedEpisode, alternativeSources, currentPlaybackTime, videoDuration, user?.id]);

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
          
          // Load saved playback progress for current episode
          // Will be loaded when episode/server changes
        }
        
        // Fetch from alternative sources
        Promise.all([
          fetch(`/api/phimapi/${params.slug}`).then(r => r.json()).catch(() => null),
          fetch(`/api/nguonc/${params.slug}`).then(r => r.json()).catch(() => null)
        ]).then(([phimapi, nguonc]) => {
          setAlternativeSources({ phimapi, nguonc });
        });
      } catch {
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [params.slug]);

  // Initialize selected episode and progress when movie/user changes.
  // Only set selectedEpisode on first init (when it's < 0) to avoid overriding user choice.
  useEffect(() => {
    const initFromHistory = async () => {
      if (!movie) {
        console.log('[INIT] No movie yet, skipping init');
        return;
      }

      try {
        const latest = await WatchHistoryManager.getLatestEpisode(movie._id, user?.id);
        const epIndex = (latest && typeof latest.episodeIndex === 'number') ? latest.episodeIndex : 0;
        
        if (selectedEpisode < 0) {
          setSelectedEpisode(epIndex);
        }

        // Load progress for that episode across any server
        const progress = await WatchHistoryManager.getEpisodeProgressAnyServer(movie._id, epIndex, user?.id);
        
        if (progress && progress.currentTime > 0 && progress.duration > 0) {
          setSavedStartTime(progress.currentTime);
          setCurrentPlaybackTime(progress.currentTime);
          setVideoDuration(progress.duration);
        } else {
          setSavedStartTime(0);
          setCurrentPlaybackTime(0);
          setVideoDuration(0);
        }
      } catch (e) {
        console.error('Error loading watch history:', e);
        if (selectedEpisode < 0) setSelectedEpisode(0);
      }
    };

    initFromHistory();
  }, [movie, user, selectedEpisode]);

  // Save on page/tab exit with current playback time
  useEffect(() => {
    const onUnloadOrHide = () => {
      // Save latest progress to localStorage immediately and schedule remote save
      saveHistory({
        currentTime: currentPlaybackTime,
        duration: videoDuration
      });
      // Force flush any pending remote saves to reduce data loss on sudden exit
      void WatchHistoryManager.flushPending();
    };
    window.addEventListener('beforeunload', onUnloadOrHide);
    // pagehide is more reliable than beforeunload on mobile/Safari
    window.addEventListener('pagehide', onUnloadOrHide);
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') onUnloadOrHide();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      window.removeEventListener('beforeunload', onUnloadOrHide);
      window.removeEventListener('pagehide', onUnloadOrHide);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [saveHistory, currentPlaybackTime, videoDuration]);

  // Save on component unmount (SPA route change as well)
  useEffect(() => {
    return () => {
      // Ensure we persist when navigating within the app (no pagehide/beforeunload fired)
      saveHistory({ currentTime: currentPlaybackTime, duration: videoDuration });
      void WatchHistoryManager.flushPending();
    };
  }, [saveHistory, currentPlaybackTime, videoDuration]);

  // Load saved progress when movie and current episode selection are ready
  useEffect(() => {
    if (!movie || selectedEpisode < 0) return;
    
    // Reset early-save guard when playback context changes
    initialSaveDoneRef.current = false;

    // Load saved progress for current episode/server
    const loadProgress = async () => {
      const savedProgress = await WatchHistoryManager.getEpisodeProgressAnyServer(
        movie._id,
        selectedEpisode,
        user?.id
      );

      if (savedProgress && savedProgress.currentTime > 0 && savedProgress.duration > 0) {
        setSavedStartTime(savedProgress.currentTime);
        setCurrentPlaybackTime(savedProgress.currentTime);
        setVideoDuration(savedProgress.duration);
      } else {
        setSavedStartTime(0);
        setCurrentPlaybackTime(0);
        setVideoDuration(0);
      }
    };

    loadProgress();
    // Note: saveHistory removed from deps to avoid infinite loop
  }, [movie, selectedEpisode, user?.id]);

  const getCurrentVideoSource = () => {
    let videoSource = null;
    let videoTitle = '';
    let isM3u8 = false;
    let embedSource = null;

    // IMPORTANT: Only ophim and phimapi use Vidstack Player with m3u8
    // nguonc and all ad servers (mappletv, videasy, vidlink, vidfast) MUST use iframe
    // NOTE: nguonc m3u8 is broken, only embed works properly
    
    if (selectedSource === 'ophim' && movie) {
      const episode = movie.episodes?.[selectedServer]?.server_data?.[selectedEpisode];
      if (episode) {
        // Prefer m3u8 for Vidstack, fallback to embed
        if (episode.link_m3u8) {
          videoSource = episode.link_m3u8;
          isM3u8 = true;
        } else {
          embedSource = episode.link_embed;
        }
        videoTitle = `${movie.name} - ${episode.name}`;
      }
    } else if (selectedSource === 'phimapi' && alternativeSources.phimapi) {
      const episodes = alternativeSources.phimapi.episodes;
      if (episodes?.[selectedServer]) {
        const episode = episodes[selectedServer].server_data?.[selectedEpisode];
        if (episode) {
          // Prefer m3u8 for Vidstack, fallback to embed
          if (episode.link_m3u8) {
            videoSource = episode.link_m3u8;
            isM3u8 = true;
          } else {
            embedSource = episode.link_embed;
          }
          videoTitle = `${movie?.name} - Tập ${episode.name}`;
        }
      }
    } else if (selectedSource === 'nguonc' && alternativeSources.nguonc) {
      const episodes = alternativeSources.nguonc.movie?.episodes;
      if (episodes?.[selectedServer]) {
        const episode = episodes[selectedServer].items?.[selectedEpisode];
        if (episode) {
          // NguonC: MUST use embed (m3u8 is broken)
          embedSource = episode.embed;
          videoTitle = `${movie?.name} - Tập ${episode.name}`;
        }
      }
    } else if (selectedSource === 'mappletv' && movie?.tmdb?.id) {
      // Ad Server: ALWAYS use iframe
      const tmdbType = movie.tmdb.type === 'movie' ? 'movie' : 'tv';
      const queryParams = "nextEpisode=true&autoplayNextEpisode=true&episodeSelector=true&overlay=true";
      if (tmdbType === 'movie') {
        embedSource = `https://mappletv.uk/watch/movie/${movie.tmdb.id}?${queryParams}`;
        videoTitle = `${movie.name} - MappleTV`;
      } else {
        // For TV shows, we need season and episode
        const season = movie.tmdb.season || 1; // Default to season 1 if not provided
        const episodeNumber = selectedEpisode + 1;
        embedSource = `https://mappletv.uk/watch/tv/${movie.tmdb.id}-${season}-${episodeNumber}?${queryParams}`;
        videoTitle = `${movie.name} - MappleTV - Tập ${episodeNumber}`;
      }
    } else if (selectedSource === 'videasy' && movie?.tmdb?.id) {
      // Ad Server: ALWAYS use iframe
      const tmdbType = movie.tmdb.type === 'movie' ? 'movie' : 'tv';
      if (tmdbType === 'movie') {
        embedSource = `https://player.videasy.net/movie/${movie.tmdb.id}`;
        videoTitle = `${movie.name} - Videasy`;
      } else {
        // For TV shows, we need season and episode
        const season = movie.tmdb.season || 1; // Default to season 1 if not provided
        const episodeNumber = selectedEpisode + 1;
        embedSource = `https://player.videasy.net/tv/${movie.tmdb.id}/${season}/${episodeNumber}`;
        videoTitle = `${movie.name} - Videasy - Tập ${episodeNumber}`;
      }
    } else if (selectedSource === 'vidlink' && movie?.tmdb?.id) {
      // Ad Server: ALWAYS use iframe
      const tmdbType = movie.tmdb.type === 'movie' ? 'movie' : 'tv';
      if (tmdbType === 'movie') {
        embedSource = `https://vidlink.pro/movie/${movie.tmdb.id}`;
        videoTitle = `${movie.name} - VidLink`;
      } else {
        // For TV shows, we need season and episode
        const season = movie.tmdb.season || 1; // Default to season 1 if not provided
        const episodeNumber = selectedEpisode + 1;
        embedSource = `https://vidlink.pro/tv/${movie.tmdb.id}/${season}/${episodeNumber}`;
        videoTitle = `${movie.name} - VidLink - Tập ${episodeNumber}`;
      }
    } else if (selectedSource === 'vidfast' && movie?.tmdb?.id) {
      // Ad Server: ALWAYS use iframe
      const tmdbType = movie.tmdb.type === 'movie' ? 'movie' : 'tv';
      if (tmdbType === 'movie') {
        embedSource = `https://vidfast.to/embed/movie/${movie.tmdb.id}`;
        videoTitle = `${movie.name} - VidFast`;
      } else {
        const season = movie.tmdb.season || 1;
        const episodeNumber = selectedEpisode + 1;
        embedSource = `https://vidfast.to/embed/tv/${movie.tmdb.id}/${season}/${episodeNumber}`;
        videoTitle = `${movie.name} - VidFast - Tập ${episodeNumber}`;
      }
    }

    return { videoSource, embedSource, videoTitle, isM3u8 };
  };

  const getServerList = () => {
    const servers: { name: string; source: string; index: number }[] = [];

    // Vietsub #1: Ophim (prefer first server)
    const hasOphim = Array.isArray(movie?.episodes) && movie!.episodes.length > 0;
    if (hasOphim) {
      servers.push({ name: 'Vietsub #1', source: 'ophim', index: 0 });
    }

    // Prepare PhimAPI episodes
    const phimapiEpisodes = alternativeSources.phimapi?.episodes || [];
    const findPhimapiIndexByVariant = (variant: 's4' | 's1' | 's2') => {
      if (!Array.isArray(phimapiEpisodes) || phimapiEpisodes.length === 0) return -1;
      if (variant === 's1' || variant === 's2') {
        const label = `(${variant})`;
        return phimapiEpisodes.findIndex((ep) => String(ep?.server_name || '').toLowerCase().includes(label));
      }
      // s4: original entries without (s1)/(s2); prefer those with m3u8 present
      return phimapiEpisodes.findIndex((ep: { server_name?: string; server_data?: { link_m3u8?: string }[] } | null | undefined) => {
        const name = String(ep?.server_name || '').toLowerCase();
        const isOriginal = !name.includes('(s1)') && !name.includes('(s2)');
        const hasM3u8 = Array.isArray(ep?.server_data) && ep!.server_data!.some((it) => Boolean(it?.link_m3u8));
        return isOriginal && hasM3u8;
      });
    };

    // Vietsub #2: PhimAPI S4 (original)
    const phimapiS4Index = findPhimapiIndexByVariant('s4');
    if (phimapiS4Index >= 0) {
      servers.push({ name: 'Vietsub #2', source: 'phimapi', index: phimapiS4Index });
    }

    // Vietsub #3: PhimAPI S1
    const phimapiS1Index = findPhimapiIndexByVariant('s1');
    if (phimapiS1Index >= 0) {
      servers.push({ name: 'Vietsub #3', source: 'phimapi', index: phimapiS1Index });
    }

    // Vietsub #4: PhimAPI S2
    const phimapiS2Index = findPhimapiIndexByVariant('s2');
    if (phimapiS2Index >= 0) {
      servers.push({ name: 'Vietsub #4', source: 'phimapi', index: phimapiS2Index });
    }

    // Vietsub #5: NguonC (iframe)
    const hasNguonC = Array.isArray(alternativeSources.nguonc?.movie?.episodes) && alternativeSources.nguonc!.movie!.episodes!.length > 0;
    if (hasNguonC) {
      servers.push({ name: 'Vietsub #5', source: 'nguonc', index: 0 });
    }

    // Ad servers (only if TMDB ID is available) - keep after main servers
    if (movie?.tmdb?.id) {
      servers.push({ name: 'Ad #1', source: 'mappletv', index: 0 });
      servers.push({ name: 'Ad #2', source: 'videasy', index: 0 });
      servers.push({ name: 'Ad #3', source: 'vidlink', index: 0 });
      servers.push({ name: 'Ad #4', source: 'vidfast', index: 0 });
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
    } else if (selectedSource === 'mappletv' || selectedSource === 'videasy' || selectedSource === 'vidlink' || selectedSource === 'vidfast') {
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

  // removed unused getServerLanguage

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

  const { videoSource, embedSource, videoTitle, isM3u8 } = getCurrentVideoSource();
  const servers = getServerList();

  const applyServerChange = async (nextSource: 'ophim' | 'phimapi' | 'nguonc' | 'mappletv' | 'videasy' | 'vidlink' | 'vidfast', nextServer: number) => {
    // Don't save when just switching server (no duration yet)
    setSelectedSource(nextSource);
    setSelectedServer(nextServer);

    // Load saved progress for the new server/episode
    if (movie) {
      const savedProgress = await WatchHistoryManager.getEpisodeProgressAnyServer(
        movie._id,
        selectedEpisode,
        user?.id
      );
      if (savedProgress && savedProgress.currentTime > 0) {
        setSavedStartTime(savedProgress.currentTime);
        setCurrentPlaybackTime(savedProgress.currentTime);
        setVideoDuration(savedProgress.duration);
      } else {
        setSavedStartTime(0);
        setCurrentPlaybackTime(0);
        setVideoDuration(0);
      }
    }

    // New context -> allow early save again
    initialSaveDoneRef.current = false;
    // Only force re-render when actually changing server (different video source)
    setPlayerKey(prev => prev + 1);
  };

  const fallbackToNextPreferredServer = () => {
    // Consider only main Vietsub servers for fallback order
    const mainServers = servers.filter((s) => s.name.startsWith('Vietsub'));
    if (mainServers.length === 0) return;

    const currentIdx = mainServers.findIndex((s) => s.source === selectedSource && s.index === selectedServer);
    if (currentIdx === -1) return;

    const nextIdx = currentIdx + 1;
    if (nextIdx < mainServers.length) {
      const next = mainServers[nextIdx];
      const nextSource = next.source as 'ophim' | 'phimapi' | 'nguonc' | 'mappletv' | 'videasy' | 'vidlink' | 'vidfast';
      applyServerChange(nextSource, next.index);
    }
  };

  return (
    <div className="min-h-screen bg-netflix-black">
      <Header />
      
      <div className="pt-16 pb-8">
        <div className="container mx-auto px-4">
          {/* Title and Back button */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-white">{movie.name}</h1>
            <Link 
              href={`/home/phim/${movie.slug}`}
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Quay lại
            </Link>
          </div>

          {/* Video Player */}
          <div className="mb-6">
            {videoSource && isM3u8 ? (
              // Use Vidstack for m3u8 sources
              <VideoPlayer
                key={playerKey} // Force re-render when switching episodes
                src={videoSource}
                title={videoTitle}
                poster={movie.poster_url || movie.thumb_url}
                showLogo={selectedSource === 'ophim' || selectedSource === 'phimapi'}
                logoSrc="/logo.png"
                onError={() => {
                  // Auto-fallback to next preferred Vietsub server
                  fallbackToNextPreferredServer();
                }}
                startTime={savedStartTime}
                onTimeUpdate={(currentTime, duration) => {
                  // Update playback state
                  setCurrentPlaybackTime(currentTime);
                  setVideoDuration(duration);

                  // Only save if we have valid duration
                  if (duration > 0) {
                    // Ensure we persist at least once early to minimize loss on sudden refresh
                    if (!initialSaveDoneRef.current && currentTime > 2) {
                      saveHistory({ currentTime, duration });
                      initialSaveDoneRef.current = true;
                    }

                    // Throttled periodic save (every ~5s)
                    const now = Date.now();
                    if (currentTime > 0 && now - lastPeriodicSaveAtRef.current >= 5000) {
                      lastPeriodicSaveAtRef.current = now;
                      saveHistory({ currentTime, duration });
                    }
                  }
                }}
              />
            ) : embedSource ? (
              // Use iframe for embed sources
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  ref={videoRef}
                  src={embedSource}
                  className="w-full h-full"
                  // Prevent ad/third-party players from navigating the parent page
                  sandbox="allow-same-origin allow-scripts allow-forms allow-presentation allow-popups"
                  // Allow common media capabilities
                  allow="autoplay; fullscreen; encrypted-media; picture-in-picture; clipboard-write"
                  referrerPolicy="no-referrer"
                  allowFullScreen
                  title={videoTitle}
                  onError={() => {
                    fallbackToNextPreferredServer();
                  }}
                />
              </div>
            ) : (
              // No video source available
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>Chọn server và tập phim để xem</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Server Selection */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-3">Chọn Server:</h2>
            <div className="flex flex-wrap gap-2">
              {servers.map((server) => (
                <button
                  key={server.source + server.index}
                  onClick={async () => {
                    const hasAds = ['mappletv', 'videasy', 'vidlink', 'vidfast'].includes(server.source);
                    if (hasAds) setShowAdNotification(true);
                    
                    const nextSource = server.source as 'ophim' | 'phimapi' | 'nguonc' | 'mappletv' | 'videasy' | 'vidlink' | 'vidfast';
                    const nextServer = server.index;
                    await applyServerChange(nextSource, nextServer);
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
                {episodes.map((episode, idx: number) => (
                  <button
                    key={idx}
                    onClick={async () => {
                      // Always reset progress first
                      setSavedStartTime(0);
                      setCurrentPlaybackTime(0);
                      setVideoDuration(0);
                      
                      // Set new episode
                      setSelectedEpisode(idx);
                      
                      // Load saved progress for the new episode
                      if (movie) {
                        const savedProgress = await WatchHistoryManager.getEpisodeProgressAnyServer(
                          movie._id,
                          idx,
                          user?.id
                        );
                        
                        if (savedProgress && savedProgress.currentTime > 0 && savedProgress.duration > 0) {
                          setSavedStartTime(savedProgress.currentTime);
                          setCurrentPlaybackTime(savedProgress.currentTime);
                          setVideoDuration(savedProgress.duration);
                        } else {
                          setSavedStartTime(0);
                          setCurrentPlaybackTime(0);
                          setVideoDuration(0);
                        }
                      }
                    }}
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
      
      {/* Ad Blocker Notification */}
      <AdBlockerNotification 
        isOpen={showAdNotification} 
        onClose={() => setShowAdNotification(false)} 
      />
    </div>
  );
}
