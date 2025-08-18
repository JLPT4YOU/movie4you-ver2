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
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl bg-netflix-black rounded-xl overflow-hidden shadow-2xl border border-netflix-gray my-4 md:my-8 mx-2 md:mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 md:top-4 md:right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 md:p-2 transition-colors duration-300"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="aspect-video bg-netflix-black">
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
