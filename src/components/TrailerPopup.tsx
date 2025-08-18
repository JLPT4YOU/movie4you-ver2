"use client";

import { useEffect } from "react";
import { getYouTubeVideoId } from "@/utils/media";

interface TrailerPopupProps {
  trailerUrl: string;
  movieName: string;
  onClose: () => void;
}

export default function TrailerPopup({ trailerUrl, movieName, onClose }: TrailerPopupProps) {
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const videoId = getYouTubeVideoId(trailerUrl);

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative bg-netflix-black rounded-xl shadow-2xl border border-netflix-gray w-full overflow-hidden flex flex-col"
        style={{ width: 'min(calc(100vw - 2rem), calc((100dvh - 2rem) * 16 / 9))', maxHeight: 'calc(100dvh - 2rem)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors duration-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="aspect-video bg-netflix-black flex-shrink-0">
          {videoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
              className="w-full h-full"
              allowFullScreen
              allow="autoplay; encrypted-media"
              title={`${movieName} - Trailer`}
            />
          ) : (
            <iframe
              src={trailerUrl}
              className="w-full h-full"
              allowFullScreen
              title={`${movieName} - Trailer`}
            />
          )}
        </div>
      </div>
    </div>
  );
}
