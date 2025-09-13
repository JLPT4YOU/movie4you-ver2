'use client';

import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

import { MediaPlayer, MediaProvider, Poster, type MediaPlayerInstance } from '@vidstack/react';
import Image from 'next/image';
import { resolveOriginalImageUrl } from '@/utils/ophim';
import {
  DefaultVideoLayout,
  defaultLayoutIcons,
} from '@vidstack/react/player/layouts/default';
import { useEffect, useRef, useState } from 'react';

interface VideoPlayerProps {
  src: string;
  title: string;
  poster?: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  startTime?: number;
  showLogo?: boolean;
  logoSrc?: string;
  onError?: () => void;
  onFullscreenChange?: (isFullscreen: boolean) => void;
}

export default function VideoPlayer({
  src,
  title,
  poster,
  onTimeUpdate,
  startTime = 0,
  showLogo = false,
  logoSrc = '/logo.png',
  onError,
  onFullscreenChange,
}: VideoPlayerProps) {
  const playerRef = useRef<MediaPlayerInstance>(null);
  const [hasSeeked, setHasSeeked] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const posterUrl = poster ? resolveOriginalImageUrl(poster) : undefined;
  const prevFullscreenRef = useRef(false);
  

  useEffect(() => {
    if (!playerRef.current) return;
    
    const player = playerRef.current;
    
    // Subscribe to player state changes
    const subscription = player.subscribe((state) => {
      // Track when player is ready
      if (state.canPlay && state.duration > 0 && !isReady) {
        setIsReady(true);
      }
      
      // Perform seek when ready and haven't seeked yet
      if (state.canPlay && state.duration > 0 && !hasSeeked && startTime > 0) {
        player.currentTime = startTime;
        setHasSeeked(true);
      }

      // Emit fullscreen change to parent when toggled
      if (state.fullscreen !== prevFullscreenRef.current) {
        prevFullscreenRef.current = state.fullscreen;
        if (onFullscreenChange) onFullscreenChange(state.fullscreen);
      }
    });

    return () => subscription();
  }, [startTime, hasSeeked, isReady, onFullscreenChange]);

  // Reset flags when src changes (new video)
  useEffect(() => {
    setHasSeeked(false);
    setIsReady(false);
  }, [src]);
  
  // Reset seeked flag when startTime changes (same video, different position)
  useEffect(() => {
    if (startTime > 0) {
      setHasSeeked(false);
    }
  }, [startTime]);

  return (
    <MediaPlayer
      ref={playerRef}
      title={title}
      src={src}
      crossOrigin="anonymous"
      playsInline
      onError={() => {
        if (onError) onError();
      }}
      onTimeUpdate={(detail) => {
        if (onTimeUpdate) {
          const currentTime = detail?.currentTime ?? 0;
          // Duration is available on the player state, not in the event detail
          const duration = playerRef.current?.state.duration ?? 0;
          
          // Only report time updates if we have valid duration
          if (duration > 0) {
            onTimeUpdate(currentTime, duration);
          }
        }
      }}
      className="w-full aspect-video bg-black rounded-lg overflow-hidden vds-player"
    >
      {showLogo && (
        <div className="pointer-events-none absolute top-3 left-3 z-[60]">
          <Image
            src={logoSrc}
            alt="logo"
            width={96}
            height={24}
            style={{ height: 24, width: 'auto', objectFit: 'contain' }}
            priority={false}
          />
        </div>
      )}
      <MediaProvider>
        {posterUrl && (
          <Poster
            className="vds-poster"
            src={posterUrl}
            alt={title}
          />
        )}
      </MediaProvider>
      
      <DefaultVideoLayout
        icons={defaultLayoutIcons}
        translations={{
          'Play': 'Phát',
          'Pause': 'Tạm dừng',
          'Enter Fullscreen': 'Toàn màn hình',
          'Exit Fullscreen': 'Thoát toàn màn hình',
          'Mute': 'Tắt tiếng',
          'Unmute': 'Bật tiếng',
          'Settings': 'Cài đặt',
          'Speed': 'Tốc độ phát',
          'Quality': 'Chất lượng',
          'Auto': 'Tự động',
          'Captions': 'Phụ đề',
          'Off': 'Tắt',
        }}
      />
    </MediaPlayer>
  );
}
