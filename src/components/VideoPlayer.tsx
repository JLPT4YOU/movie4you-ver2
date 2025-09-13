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
}: VideoPlayerProps) {
  const playerRef = useRef<MediaPlayerInstance>(null);
  const [hasSeeked, setHasSeeked] = useState(false);
  const posterUrl = poster ? resolveOriginalImageUrl(poster) : undefined;
  
  console.log('VideoPlayer render: src=', src, 'startTime=', startTime);

  useEffect(() => {
    if (!playerRef.current || startTime <= 0 || hasSeeked) {
      console.log('VideoPlayer seek skip: startTime=', startTime, 'hasSeeked=', hasSeeked);
      return;
    }
    
    const player = playerRef.current;
    
    // Subscribe to player state changes
    const subscription = player.subscribe((state) => {
      // Wait for media to be ready and have duration
      if (state.canPlay && state.duration > 0 && !hasSeeked) {
        console.log('VideoPlayer seeking to:', startTime);
        player.currentTime = startTime;
        setHasSeeked(true);
      }
    });

    return () => subscription();
  }, [startTime, hasSeeked]);

  // Reset seeked flag when src or startTime changes
  useEffect(() => {
    setHasSeeked(false);
  }, [src, startTime]);

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
          onTimeUpdate(currentTime, duration);
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
